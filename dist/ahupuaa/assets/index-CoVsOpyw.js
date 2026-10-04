(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=e(i);fetch(i.href,a)}})();const Qt=360,Zt=Qt/2,Xl=.01,ql=1.3,sn=Xl*ql,Vn=2048,hn=1024,Yl=20261004;function po(s){const t=(s+180)*Math.PI/180;return[Math.sin(t),-Math.cos(t)]}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ka="160",$l=0,mo=1,jl=2,tl=1,Kl=2,xn=3,wn=0,Fe=1,$e=2,Pn=0,xi=1,Oa=2,go=3,vo=4,Zl=5,Wn=100,Jl=101,Ql=102,_o=103,xo=104,tc=200,ec=201,nc=202,ic=203,ka=204,Ba=205,sc=206,ac=207,oc=208,rc=209,lc=210,cc=211,hc=212,uc=213,dc=214,fc=0,pc=1,mc=2,Bs=3,gc=4,vc=5,_c=6,xc=7,el=0,Mc=1,yc=2,Dn=0,Sc=1,wc=2,Ec=3,bc=4,Tc=5,Ac=6,nl=300,Si=301,wi=302,Ga=303,Ha=304,js=306,Ei=1e3,We=1001,Va=1002,de=1003,Mo=1004,sa=1005,ee=1006,Cc=1007,jn=1008,Ke=1009,Rc=1010,Lc=1011,Za=1012,il=1013,yn=1014,cn=1015,Un=1016,sl=1017,al=1018,qn=1020,Pc=1021,Oe=1023,Dc=1024,Uc=1025,Yn=1026,bi=1027,Gs=1028,ol=1029,Ic=1030,rl=1031,ll=1033,aa=33776,oa=33777,ra=33778,la=33779,yo=35840,So=35841,wo=35842,Eo=35843,cl=36196,bo=37492,To=37496,Ao=37808,Co=37809,Ro=37810,Lo=37811,Po=37812,Do=37813,Uo=37814,Io=37815,Fo=37816,No=37817,zo=37818,Oo=37819,ko=37820,Bo=37821,ca=36492,Go=36494,Ho=36495,Fc=36283,Vo=36284,Wo=36285,Xo=36286,hl=3e3,$n=3001,Nc=3200,zc=3201,Oc=0,kc=1,je="",ye="srgb",En="srgb-linear",Ja="display-p3",Ks="display-p3-linear",Hs="linear",Jt="srgb",Vs="rec709",Ws="p3",Zn=7680,qo=519,Bc=512,Gc=513,Hc=514,ul=515,Vc=516,Wc=517,Xc=518,qc=519,Yo=35044,Mi=35048,$o="300 es",Wa=1035,Sn=2e3,Xs=2001;class Ci{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const a=i.indexOf(e);a!==-1&&i.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let a=0,r=i.length;a<r;a++)i[a].call(this,t);t.target=null}}}const Ee=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let jo=1234567;const Xi=Math.PI/180,Ki=180/Math.PI;function Ri(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ee[s&255]+Ee[s>>8&255]+Ee[s>>16&255]+Ee[s>>24&255]+"-"+Ee[t&255]+Ee[t>>8&255]+"-"+Ee[t>>16&15|64]+Ee[t>>24&255]+"-"+Ee[e&63|128]+Ee[e>>8&255]+"-"+Ee[e>>16&255]+Ee[e>>24&255]+Ee[n&255]+Ee[n>>8&255]+Ee[n>>16&255]+Ee[n>>24&255]).toLowerCase()}function Ie(s,t,e){return Math.max(t,Math.min(e,s))}function Qa(s,t){return(s%t+t)%t}function Yc(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function $c(s,t,e){return s!==t?(e-s)/(t-s):0}function qi(s,t,e){return(1-e)*s+e*t}function jc(s,t,e,n){return qi(s,t,1-Math.exp(-e*n))}function Kc(s,t=1){return t-Math.abs(Qa(s,t*2)-t)}function Zc(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Jc(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Qc(s,t){return s+Math.floor(Math.random()*(t-s+1))}function th(s,t){return s+Math.random()*(t-s)}function eh(s){return s*(.5-Math.random())}function nh(s){s!==void 0&&(jo=s);let t=jo+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ih(s){return s*Xi}function sh(s){return s*Ki}function Xa(s){return(s&s-1)===0&&s!==0}function ah(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function qs(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function oh(s,t,e,n,i){const a=Math.cos,r=Math.sin,o=a(e/2),l=r(e/2),c=a((t+n)/2),h=r((t+n)/2),d=a((t-n)/2),u=r((t-n)/2),m=a((n-t)/2),v=r((n-t)/2);switch(i){case"XYX":s.set(o*h,l*d,l*u,o*c);break;case"YZY":s.set(l*u,o*h,l*d,o*c);break;case"ZXZ":s.set(l*d,l*u,o*h,o*c);break;case"XZX":s.set(o*h,l*v,l*m,o*c);break;case"YXY":s.set(l*m,o*h,l*v,o*c);break;case"ZYZ":s.set(l*v,l*m,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function gi(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function De(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const rn={DEG2RAD:Xi,RAD2DEG:Ki,generateUUID:Ri,clamp:Ie,euclideanModulo:Qa,mapLinear:Yc,inverseLerp:$c,lerp:qi,damp:jc,pingpong:Kc,smoothstep:Zc,smootherstep:Jc,randInt:Qc,randFloat:th,randFloatSpread:eh,seededRandom:nh,degToRad:ih,radToDeg:sh,isPowerOfTwo:Xa,ceilPowerOfTwo:ah,floorPowerOfTwo:qs,setQuaternionFromProperEuler:oh,normalize:De,denormalize:gi};class Tt{constructor(t=0,e=0){Tt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*n-r*i+t.x,this.y=a*i+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Gt{constructor(t,e,n,i,a,r,o,l,c){Gt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,a,r,o,l,c)}set(t,e,n,i,a,r,o,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=a,h[5]=l,h[6]=n,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,a=this.elements,r=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],m=n[5],v=n[8],g=i[0],p=i[3],f=i[6],x=i[1],_=i[4],M=i[7],w=i[2],y=i[5],b=i[8];return a[0]=r*g+o*x+l*w,a[3]=r*p+o*_+l*y,a[6]=r*f+o*M+l*b,a[1]=c*g+h*x+d*w,a[4]=c*p+h*_+d*y,a[7]=c*f+h*M+d*b,a[2]=u*g+m*x+v*w,a[5]=u*p+m*_+v*y,a[8]=u*f+m*M+v*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*r*h-e*o*c-n*a*h+n*o*l+i*a*c-i*r*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*r-o*c,u=o*l-h*a,m=c*a-r*l,v=e*d+n*u+i*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/v;return t[0]=d*g,t[1]=(i*c-h*n)*g,t[2]=(o*n-i*r)*g,t[3]=u*g,t[4]=(h*e-i*l)*g,t[5]=(i*a-o*e)*g,t[6]=m*g,t[7]=(n*l-c*e)*g,t[8]=(r*e-n*a)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(n*l,n*c,-n*(l*r+c*o)+r+t,-i*c,i*l,-i*(-c*r+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(ha.makeScale(t,e)),this}rotate(t){return this.premultiply(ha.makeRotation(-t)),this}translate(t,e){return this.premultiply(ha.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ha=new Gt;function dl(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Ys(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function rh(){const s=Ys("canvas");return s.style.display="block",s}const Ko={};function Yi(s){s in Ko||(Ko[s]=!0,console.warn(s))}const Zo=new Gt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Jo=new Gt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),hs={[En]:{transfer:Hs,primaries:Vs,toReference:s=>s,fromReference:s=>s},[ye]:{transfer:Jt,primaries:Vs,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Ks]:{transfer:Hs,primaries:Ws,toReference:s=>s.applyMatrix3(Jo),fromReference:s=>s.applyMatrix3(Zo)},[Ja]:{transfer:Jt,primaries:Ws,toReference:s=>s.convertSRGBToLinear().applyMatrix3(Jo),fromReference:s=>s.applyMatrix3(Zo).convertLinearToSRGB()}},lh=new Set([En,Ks]),Yt={enabled:!0,_workingColorSpace:En,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!lh.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=hs[t].toReference,i=hs[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return hs[s].primaries},getTransfer:function(s){return s===je?Hs:hs[s].transfer}};function yi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ua(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Jn;class fl{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Jn===void 0&&(Jn=Ys("canvas")),Jn.width=t.width,Jn.height=t.height;const n=Jn.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Jn}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ys("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),a=i.data;for(let r=0;r<a.length;r++)a[r]=yi(a[r]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(yi(e[n]/255)*255):e[n]=yi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let ch=0;class pl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ch++}),this.uuid=Ri(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let a;if(Array.isArray(i)){a=[];for(let r=0,o=i.length;r<o;r++)i[r].isDataTexture?a.push(da(i[r].image)):a.push(da(i[r]))}else a=da(i);n.url=a}return e||(t.images[this.uuid]=n),n}}function da(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?fl.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let hh=0;class ke extends Ci{constructor(t=ke.DEFAULT_IMAGE,e=ke.DEFAULT_MAPPING,n=We,i=We,a=ee,r=jn,o=Oe,l=Ke,c=ke.DEFAULT_ANISOTROPY,h=je){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:hh++}),this.uuid=Ri(),this.name="",this.source=new pl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Tt(0,0),this.repeat=new Tt(1,1),this.center=new Tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Yi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===$n?ye:je),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==nl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ei:t.x=t.x-Math.floor(t.x);break;case We:t.x=t.x<0?0:1;break;case Va:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ei:t.y=t.y-Math.floor(t.y);break;case We:t.y=t.y<0?0:1;break;case Va:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Yi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===ye?$n:hl}set encoding(t){Yi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===$n?ye:je}}ke.DEFAULT_IMAGE=null;ke.DEFAULT_MAPPING=nl;ke.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,i=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i+r[12]*a,this.y=r[1]*e+r[5]*n+r[9]*i+r[13]*a,this.z=r[2]*e+r[6]*n+r[10]*i+r[14]*a,this.w=r[3]*e+r[7]*n+r[11]*i+r[15]*a,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,a;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],m=l[5],v=l[9],g=l[2],p=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-g)<.01&&Math.abs(v-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+g)<.1&&Math.abs(v+p)<.1&&Math.abs(c+m+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(c+1)/2,M=(m+1)/2,w=(f+1)/2,y=(h+u)/4,b=(d+g)/4,D=(v+p)/4;return _>M&&_>w?_<.01?(n=0,i=.707106781,a=.707106781):(n=Math.sqrt(_),i=y/n,a=b/n):M>w?M<.01?(n=.707106781,i=0,a=.707106781):(i=Math.sqrt(M),n=y/i,a=D/i):w<.01?(n=.707106781,i=.707106781,a=0):(a=Math.sqrt(w),n=b/a,i=D/a),this.set(n,i,a,e),this}let x=Math.sqrt((p-v)*(p-v)+(d-g)*(d-g)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(p-v)/x,this.y=(d-g)/x,this.z=(u-h)/x,this.w=Math.acos((c+m+f-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class uh extends Ci{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(Yi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===$n?ye:je),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ee,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new ke(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new pl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class an extends uh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ml extends ke{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=de,this.minFilter=de,this.wrapR=We,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qa extends ke{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=de,this.minFilter=de,this.wrapR=We,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class In{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,a,r,o){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const u=a[r+0],m=a[r+1],v=a[r+2],g=a[r+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(o===1){t[e+0]=u,t[e+1]=m,t[e+2]=v,t[e+3]=g;return}if(d!==g||l!==u||c!==m||h!==v){let p=1-o;const f=l*u+c*m+h*v+d*g,x=f>=0?1:-1,_=1-f*f;if(_>Number.EPSILON){const w=Math.sqrt(_),y=Math.atan2(w,f*x);p=Math.sin(p*y)/w,o=Math.sin(o*y)/w}const M=o*x;if(l=l*p+u*M,c=c*p+m*M,h=h*p+v*M,d=d*p+g*M,p===1-o){const w=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=w,c*=w,h*=w,d*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,a,r){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=a[r],u=a[r+1],m=a[r+2],v=a[r+3];return t[e]=o*v+h*d+l*m-c*u,t[e+1]=l*v+h*u+c*d-o*m,t[e+2]=c*v+h*m+o*u-l*d,t[e+3]=h*v-o*d-l*u-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,a=t._z,r=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),d=o(a/2),u=l(n/2),m=l(i/2),v=l(a/2);switch(r){case"XYZ":this._x=u*h*d+c*m*v,this._y=c*m*d-u*h*v,this._z=c*h*v+u*m*d,this._w=c*h*d-u*m*v;break;case"YXZ":this._x=u*h*d+c*m*v,this._y=c*m*d-u*h*v,this._z=c*h*v-u*m*d,this._w=c*h*d+u*m*v;break;case"ZXY":this._x=u*h*d-c*m*v,this._y=c*m*d+u*h*v,this._z=c*h*v+u*m*d,this._w=c*h*d-u*m*v;break;case"ZYX":this._x=u*h*d-c*m*v,this._y=c*m*d+u*h*v,this._z=c*h*v-u*m*d,this._w=c*h*d+u*m*v;break;case"YZX":this._x=u*h*d+c*m*v,this._y=c*m*d+u*h*v,this._z=c*h*v-u*m*d,this._w=c*h*d-u*m*v;break;case"XZY":this._x=u*h*d-c*m*v,this._y=c*m*d-u*h*v,this._z=c*h*v+u*m*d,this._w=c*h*d+u*m*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],a=e[8],r=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){const m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(h-l)*m,this._y=(a-c)*m,this._z=(r-i)*m}else if(n>o&&n>d){const m=2*Math.sqrt(1+n-o-d);this._w=(h-l)/m,this._x=.25*m,this._y=(i+r)/m,this._z=(a+c)/m}else if(o>d){const m=2*Math.sqrt(1+o-n-d);this._w=(a-c)/m,this._x=(i+r)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+d-n-o);this._w=(r-i)/m,this._x=(a+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ie(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,a=t._z,r=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+r*o+i*c-a*l,this._y=i*h+r*l+a*o-n*c,this._z=a*h+r*c+n*l-i*o,this._w=r*h-n*o-i*l-a*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,a=this._z,r=this._w;let o=r*t._w+n*t._x+i*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=n,this._y=i,this._z=a,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-e;return this._w=m*r+e*this._w,this._x=m*n+e*this._x,this._y=m*i+e*this._y,this._z=m*a+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=r*d+this._w*u,this._x=n*d+this._x*u,this._y=i*d+this._y*u,this._z=a*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),a=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(a),n*Math.cos(a),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(t=0,e=0,n=0){U.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Qo.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Qo.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*i,this.y=a[1]*e+a[4]*n+a[7]*i,this.z=a[2]*e+a[5]*n+a[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,a=t.elements,r=1/(a[3]*e+a[7]*n+a[11]*i+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*i+a[12])*r,this.y=(a[1]*e+a[5]*n+a[9]*i+a[13])*r,this.z=(a[2]*e+a[6]*n+a[10]*i+a[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,a=t.x,r=t.y,o=t.z,l=t.w,c=2*(r*i-o*n),h=2*(o*e-a*i),d=2*(a*n-r*e);return this.x=e+l*c+r*d-o*h,this.y=n+l*h+o*c-a*d,this.z=i+l*d+a*h-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i,this.y=a[1]*e+a[5]*n+a[9]*i,this.z=a[2]*e+a[6]*n+a[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,a=t.z,r=e.x,o=e.y,l=e.z;return this.x=i*l-a*o,this.y=a*r-n*l,this.z=n*o-i*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return fa.copy(this).projectOnVector(t),this.sub(fa)}reflect(t){return this.sub(fa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fa=new U,Qo=new In;class un{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Je.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Je.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Je.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,Je):Je.fromBufferAttribute(a,r),Je.applyMatrix4(t.matrixWorld),this.expandByPoint(Je);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),us.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),us.copy(n.boundingBox)),us.applyMatrix4(t.matrixWorld),this.union(us)}const i=t.children;for(let a=0,r=i.length;a<r;a++)this.expandByObject(i[a],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Je),Je.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ui),ds.subVectors(this.max,Ui),Qn.subVectors(t.a,Ui),ti.subVectors(t.b,Ui),ei.subVectors(t.c,Ui),bn.subVectors(ti,Qn),Tn.subVectors(ei,ti),zn.subVectors(Qn,ei);let e=[0,-bn.z,bn.y,0,-Tn.z,Tn.y,0,-zn.z,zn.y,bn.z,0,-bn.x,Tn.z,0,-Tn.x,zn.z,0,-zn.x,-bn.y,bn.x,0,-Tn.y,Tn.x,0,-zn.y,zn.x,0];return!pa(e,Qn,ti,ei,ds)||(e=[1,0,0,0,1,0,0,0,1],!pa(e,Qn,ti,ei,ds))?!1:(fs.crossVectors(bn,Tn),e=[fs.x,fs.y,fs.z],pa(e,Qn,ti,ei,ds))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Je).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Je).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(fn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),fn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),fn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),fn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),fn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),fn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),fn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),fn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(fn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const fn=[new U,new U,new U,new U,new U,new U,new U,new U],Je=new U,us=new un,Qn=new U,ti=new U,ei=new U,bn=new U,Tn=new U,zn=new U,Ui=new U,ds=new U,fs=new U,On=new U;function pa(s,t,e,n,i){for(let a=0,r=s.length-3;a<=r;a+=3){On.fromArray(s,a);const o=i.x*Math.abs(On.x)+i.y*Math.abs(On.y)+i.z*Math.abs(On.z),l=t.dot(On),c=e.dot(On),h=n.dot(On);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const dh=new un,Ii=new U,ma=new U;class Li{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):dh.setFromPoints(t).getCenter(n);let i=0;for(let a=0,r=t.length;a<r;a++)i=Math.max(i,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ii.subVectors(t,this.center);const e=Ii.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ii,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ma.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ii.copy(t.center).add(ma)),this.expandByPoint(Ii.copy(t.center).sub(ma))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const pn=new U,ga=new U,ps=new U,An=new U,va=new U,ms=new U,_a=new U;class to{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,pn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=pn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(pn.copy(this.origin).addScaledVector(this.direction,e),pn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){ga.copy(t).add(e).multiplyScalar(.5),ps.copy(e).sub(t).normalize(),An.copy(this.origin).sub(ga);const a=t.distanceTo(e)*.5,r=-this.direction.dot(ps),o=An.dot(this.direction),l=-An.dot(ps),c=An.lengthSq(),h=Math.abs(1-r*r);let d,u,m,v;if(h>0)if(d=r*l-o,u=r*o-l,v=a*h,d>=0)if(u>=-v)if(u<=v){const g=1/h;d*=g,u*=g,m=d*(d+r*u+2*o)+u*(r*d+u+2*l)+c}else u=a,d=Math.max(0,-(r*u+o)),m=-d*d+u*(u+2*l)+c;else u=-a,d=Math.max(0,-(r*u+o)),m=-d*d+u*(u+2*l)+c;else u<=-v?(d=Math.max(0,-(-r*a+o)),u=d>0?-a:Math.min(Math.max(-a,-l),a),m=-d*d+u*(u+2*l)+c):u<=v?(d=0,u=Math.min(Math.max(-a,-l),a),m=u*(u+2*l)+c):(d=Math.max(0,-(r*a+o)),u=d>0?a:Math.min(Math.max(-a,-l),a),m=-d*d+u*(u+2*l)+c);else u=r>0?-a:a,d=Math.max(0,-(r*u+o)),m=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(ga).addScaledVector(ps,u),m}intersectSphere(t,e){pn.subVectors(t.center,this.origin);const n=pn.dot(this.direction),i=pn.dot(pn)-n*n,a=t.radius*t.radius;if(i>a)return null;const r=Math.sqrt(a-i),o=n-r,l=n+r;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,a,r,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(a=(t.min.y-u.y)*h,r=(t.max.y-u.y)*h):(a=(t.max.y-u.y)*h,r=(t.min.y-u.y)*h),n>r||a>i||((a>n||isNaN(n))&&(n=a),(r<i||isNaN(i))&&(i=r),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,pn)!==null}intersectTriangle(t,e,n,i,a){va.subVectors(e,t),ms.subVectors(n,t),_a.crossVectors(va,ms);let r=this.direction.dot(_a),o;if(r>0){if(i)return null;o=1}else if(r<0)o=-1,r=-r;else return null;An.subVectors(this.origin,t);const l=o*this.direction.dot(ms.crossVectors(An,ms));if(l<0)return null;const c=o*this.direction.dot(va.cross(An));if(c<0||l+c>r)return null;const h=-o*An.dot(_a);return h<0?null:this.at(h/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Wt{constructor(t,e,n,i,a,r,o,l,c,h,d,u,m,v,g,p){Wt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,a,r,o,l,c,h,d,u,m,v,g,p)}set(t,e,n,i,a,r,o,l,c,h,d,u,m,v,g,p){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=i,f[1]=a,f[5]=r,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=m,f[7]=v,f[11]=g,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Wt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/ni.setFromMatrixColumn(t,0).length(),a=1/ni.setFromMatrixColumn(t,1).length(),r=1/ni.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,a=t.z,r=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(a),d=Math.sin(a);if(t.order==="XYZ"){const u=r*h,m=r*d,v=o*h,g=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=m+v*c,e[5]=u-g*c,e[9]=-o*l,e[2]=g-u*c,e[6]=v+m*c,e[10]=r*l}else if(t.order==="YXZ"){const u=l*h,m=l*d,v=c*h,g=c*d;e[0]=u+g*o,e[4]=v*o-m,e[8]=r*c,e[1]=r*d,e[5]=r*h,e[9]=-o,e[2]=m*o-v,e[6]=g+u*o,e[10]=r*l}else if(t.order==="ZXY"){const u=l*h,m=l*d,v=c*h,g=c*d;e[0]=u-g*o,e[4]=-r*d,e[8]=v+m*o,e[1]=m+v*o,e[5]=r*h,e[9]=g-u*o,e[2]=-r*c,e[6]=o,e[10]=r*l}else if(t.order==="ZYX"){const u=r*h,m=r*d,v=o*h,g=o*d;e[0]=l*h,e[4]=v*c-m,e[8]=u*c+g,e[1]=l*d,e[5]=g*c+u,e[9]=m*c-v,e[2]=-c,e[6]=o*l,e[10]=r*l}else if(t.order==="YZX"){const u=r*l,m=r*c,v=o*l,g=o*c;e[0]=l*h,e[4]=g-u*d,e[8]=v*d+m,e[1]=d,e[5]=r*h,e[9]=-o*h,e[2]=-c*h,e[6]=m*d+v,e[10]=u-g*d}else if(t.order==="XZY"){const u=r*l,m=r*c,v=o*l,g=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+g,e[5]=r*h,e[9]=m*d-v,e[2]=v*d-m,e[6]=o*h,e[10]=g*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(fh,t,ph)}lookAt(t,e,n){const i=this.elements;return He.subVectors(t,e),He.lengthSq()===0&&(He.z=1),He.normalize(),Cn.crossVectors(n,He),Cn.lengthSq()===0&&(Math.abs(n.z)===1?He.x+=1e-4:He.z+=1e-4,He.normalize(),Cn.crossVectors(n,He)),Cn.normalize(),gs.crossVectors(He,Cn),i[0]=Cn.x,i[4]=gs.x,i[8]=He.x,i[1]=Cn.y,i[5]=gs.y,i[9]=He.y,i[2]=Cn.z,i[6]=gs.z,i[10]=He.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,a=this.elements,r=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],m=n[13],v=n[2],g=n[6],p=n[10],f=n[14],x=n[3],_=n[7],M=n[11],w=n[15],y=i[0],b=i[4],D=i[8],S=i[12],T=i[1],I=i[5],W=i[9],j=i[13],R=i[2],N=i[6],L=i[10],z=i[14],q=i[3],X=i[7],$=i[11],Z=i[15];return a[0]=r*y+o*T+l*R+c*q,a[4]=r*b+o*I+l*N+c*X,a[8]=r*D+o*W+l*L+c*$,a[12]=r*S+o*j+l*z+c*Z,a[1]=h*y+d*T+u*R+m*q,a[5]=h*b+d*I+u*N+m*X,a[9]=h*D+d*W+u*L+m*$,a[13]=h*S+d*j+u*z+m*Z,a[2]=v*y+g*T+p*R+f*q,a[6]=v*b+g*I+p*N+f*X,a[10]=v*D+g*W+p*L+f*$,a[14]=v*S+g*j+p*z+f*Z,a[3]=x*y+_*T+M*R+w*q,a[7]=x*b+_*I+M*N+w*X,a[11]=x*D+_*W+M*L+w*$,a[15]=x*S+_*j+M*z+w*Z,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],a=t[12],r=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],m=t[14],v=t[3],g=t[7],p=t[11],f=t[15];return v*(+a*l*d-i*c*d-a*o*u+n*c*u+i*o*m-n*l*m)+g*(+e*l*m-e*c*u+a*r*u-i*r*m+i*c*h-a*l*h)+p*(+e*c*d-e*o*m-a*r*d+n*r*m+a*o*h-n*c*h)+f*(-i*o*h-e*l*d+e*o*u+i*r*d-n*r*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],m=t[11],v=t[12],g=t[13],p=t[14],f=t[15],x=d*p*c-g*u*c+g*l*m-o*p*m-d*l*f+o*u*f,_=v*u*c-h*p*c-v*l*m+r*p*m+h*l*f-r*u*f,M=h*g*c-v*d*c+v*o*m-r*g*m-h*o*f+r*d*f,w=v*d*l-h*g*l-v*o*u+r*g*u+h*o*p-r*d*p,y=e*x+n*_+i*M+a*w;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/y;return t[0]=x*b,t[1]=(g*u*a-d*p*a-g*i*m+n*p*m+d*i*f-n*u*f)*b,t[2]=(o*p*a-g*l*a+g*i*c-n*p*c-o*i*f+n*l*f)*b,t[3]=(d*l*a-o*u*a-d*i*c+n*u*c+o*i*m-n*l*m)*b,t[4]=_*b,t[5]=(h*p*a-v*u*a+v*i*m-e*p*m-h*i*f+e*u*f)*b,t[6]=(v*l*a-r*p*a-v*i*c+e*p*c+r*i*f-e*l*f)*b,t[7]=(r*u*a-h*l*a+h*i*c-e*u*c-r*i*m+e*l*m)*b,t[8]=M*b,t[9]=(v*d*a-h*g*a-v*n*m+e*g*m+h*n*f-e*d*f)*b,t[10]=(r*g*a-v*o*a+v*n*c-e*g*c-r*n*f+e*o*f)*b,t[11]=(h*o*a-r*d*a-h*n*c+e*d*c+r*n*m-e*o*m)*b,t[12]=w*b,t[13]=(h*g*i-v*d*i+v*n*u-e*g*u-h*n*p+e*d*p)*b,t[14]=(v*o*i-r*g*i-v*n*l+e*g*l+r*n*p-e*o*p)*b,t[15]=(r*d*i-h*o*i+h*n*l-e*d*l-r*n*u+e*o*u)*b,this}scale(t){const e=this.elements,n=t.x,i=t.y,a=t.z;return e[0]*=n,e[4]*=i,e[8]*=a,e[1]*=n,e[5]*=i,e[9]*=a,e[2]*=n,e[6]*=i,e[10]*=a,e[3]*=n,e[7]*=i,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),a=1-n,r=t.x,o=t.y,l=t.z,c=a*r,h=a*o;return this.set(c*r+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*r,0,c*l-i*o,h*l+i*r,a*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,a,r){return this.set(1,n,a,0,t,1,r,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,a=e._x,r=e._y,o=e._z,l=e._w,c=a+a,h=r+r,d=o+o,u=a*c,m=a*h,v=a*d,g=r*h,p=r*d,f=o*d,x=l*c,_=l*h,M=l*d,w=n.x,y=n.y,b=n.z;return i[0]=(1-(g+f))*w,i[1]=(m+M)*w,i[2]=(v-_)*w,i[3]=0,i[4]=(m-M)*y,i[5]=(1-(u+f))*y,i[6]=(p+x)*y,i[7]=0,i[8]=(v+_)*b,i[9]=(p-x)*b,i[10]=(1-(u+g))*b,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let a=ni.set(i[0],i[1],i[2]).length();const r=ni.set(i[4],i[5],i[6]).length(),o=ni.set(i[8],i[9],i[10]).length();this.determinant()<0&&(a=-a),t.x=i[12],t.y=i[13],t.z=i[14],Qe.copy(this);const c=1/a,h=1/r,d=1/o;return Qe.elements[0]*=c,Qe.elements[1]*=c,Qe.elements[2]*=c,Qe.elements[4]*=h,Qe.elements[5]*=h,Qe.elements[6]*=h,Qe.elements[8]*=d,Qe.elements[9]*=d,Qe.elements[10]*=d,e.setFromRotationMatrix(Qe),n.x=a,n.y=r,n.z=o,this}makePerspective(t,e,n,i,a,r,o=Sn){const l=this.elements,c=2*a/(e-t),h=2*a/(n-i),d=(e+t)/(e-t),u=(n+i)/(n-i);let m,v;if(o===Sn)m=-(r+a)/(r-a),v=-2*r*a/(r-a);else if(o===Xs)m=-r/(r-a),v=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,a,r,o=Sn){const l=this.elements,c=1/(e-t),h=1/(n-i),d=1/(r-a),u=(e+t)*c,m=(n+i)*h;let v,g;if(o===Sn)v=(r+a)*d,g=-2*d;else if(o===Xs)v=a*d,g=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=g,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ni=new U,Qe=new Wt,fh=new U(0,0,0),ph=new U(1,1,1),Cn=new U,gs=new U,He=new U,tr=new Wt,er=new In;class Ti{constructor(t=0,e=0,n=0,i=Ti.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,a=i[0],r=i[4],o=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],m=i[10];switch(e){case"XYZ":this._y=Math.asin(Ie(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ie(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ie(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-Ie(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(Ie(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,a)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Ie(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return tr.makeRotationFromQuaternion(t),this.setFromRotationMatrix(tr,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return er.setFromEuler(this),this.setFromQuaternion(er,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ti.DEFAULT_ORDER="XYZ";class eo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let mh=0;const nr=new U,ii=new In,mn=new Wt,vs=new U,Fi=new U,gh=new U,vh=new In,ir=new U(1,0,0),sr=new U(0,1,0),ar=new U(0,0,1),_h={type:"added"},xh={type:"removed"};class Be extends Ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mh++}),this.uuid=Ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Be.DEFAULT_UP.clone();const t=new U,e=new Ti,n=new In,i=new U(1,1,1);function a(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Wt},normalMatrix:{value:new Gt}}),this.matrix=new Wt,this.matrixWorld=new Wt,this.matrixAutoUpdate=Be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new eo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ii.setFromAxisAngle(t,e),this.quaternion.multiply(ii),this}rotateOnWorldAxis(t,e){return ii.setFromAxisAngle(t,e),this.quaternion.premultiply(ii),this}rotateX(t){return this.rotateOnAxis(ir,t)}rotateY(t){return this.rotateOnAxis(sr,t)}rotateZ(t){return this.rotateOnAxis(ar,t)}translateOnAxis(t,e){return nr.copy(t).applyQuaternion(this.quaternion),this.position.add(nr.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ir,t)}translateY(t){return this.translateOnAxis(sr,t)}translateZ(t){return this.translateOnAxis(ar,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(mn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?vs.copy(t):vs.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Fi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mn.lookAt(Fi,vs,this.up):mn.lookAt(vs,Fi,this.up),this.quaternion.setFromRotationMatrix(mn),i&&(mn.extractRotation(i.matrixWorld),ii.setFromRotationMatrix(mn),this.quaternion.premultiply(ii.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(_h)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(xh)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),mn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),mn.multiply(t.parent.matrixWorld)),t.applyMatrix4(mn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let a=0,r=i.length;a<r;a++)i[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,t,gh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,vh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const a=e[n];(a.matrixWorldAutoUpdate===!0||t===!0)&&a.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let a=0,r=i.length;a<r;a++){const o=i[a];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];a(t.shapes,d)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(t.materials,this.material[l]));i.material=o}else i.material=a(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(a(t.animations,l))}}if(e){const o=r(t.geometries),l=r(t.materials),c=r(t.textures),h=r(t.images),d=r(t.shapes),u=r(t.skeletons),m=r(t.animations),v=r(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=i,n;function r(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Be.DEFAULT_UP=new U(0,1,0);Be.DEFAULT_MATRIX_AUTO_UPDATE=!0;Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const tn=new U,gn=new U,xa=new U,vn=new U,si=new U,ai=new U,or=new U,Ma=new U,ya=new U,Sa=new U;let _s=!1;class en{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),tn.subVectors(t,e),i.cross(tn);const a=i.lengthSq();return a>0?i.multiplyScalar(1/Math.sqrt(a)):i.set(0,0,0)}static getBarycoord(t,e,n,i,a){tn.subVectors(i,e),gn.subVectors(n,e),xa.subVectors(t,e);const r=tn.dot(tn),o=tn.dot(gn),l=tn.dot(xa),c=gn.dot(gn),h=gn.dot(xa),d=r*c-o*o;if(d===0)return a.set(0,0,0),null;const u=1/d,m=(c*l-o*h)*u,v=(r*h-o*l)*u;return a.set(1-m-v,v,m)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,vn)===null?!1:vn.x>=0&&vn.y>=0&&vn.x+vn.y<=1}static getUV(t,e,n,i,a,r,o,l){return _s===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),_s=!0),this.getInterpolation(t,e,n,i,a,r,o,l)}static getInterpolation(t,e,n,i,a,r,o,l){return this.getBarycoord(t,e,n,i,vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,vn.x),l.addScaledVector(r,vn.y),l.addScaledVector(o,vn.z),l)}static isFrontFacing(t,e,n,i){return tn.subVectors(n,e),gn.subVectors(t,e),tn.cross(gn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return tn.subVectors(this.c,this.b),gn.subVectors(this.a,this.b),tn.cross(gn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return en.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return en.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,a){return _s===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),_s=!0),en.getInterpolation(t,this.a,this.b,this.c,e,n,i,a)}getInterpolation(t,e,n,i,a){return en.getInterpolation(t,this.a,this.b,this.c,e,n,i,a)}containsPoint(t){return en.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return en.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,a=this.c;let r,o;si.subVectors(i,n),ai.subVectors(a,n),Ma.subVectors(t,n);const l=si.dot(Ma),c=ai.dot(Ma);if(l<=0&&c<=0)return e.copy(n);ya.subVectors(t,i);const h=si.dot(ya),d=ai.dot(ya);if(h>=0&&d<=h)return e.copy(i);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return r=l/(l-h),e.copy(n).addScaledVector(si,r);Sa.subVectors(t,a);const m=si.dot(Sa),v=ai.dot(Sa);if(v>=0&&m<=v)return e.copy(a);const g=m*c-l*v;if(g<=0&&c>=0&&v<=0)return o=c/(c-v),e.copy(n).addScaledVector(ai,o);const p=h*v-m*d;if(p<=0&&d-h>=0&&m-v>=0)return or.subVectors(a,i),o=(d-h)/(d-h+(m-v)),e.copy(i).addScaledVector(or,o);const f=1/(p+g+u);return r=g*f,o=u*f,e.copy(n).addScaledVector(si,r).addScaledVector(ai,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const gl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Rn={h:0,s:0,l:0},xs={h:0,s:0,l:0};function wa(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class vt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ye){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Yt.workingColorSpace){if(t=Qa(t,1),e=Ie(e,0,1),n=Ie(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,r=2*n-a;this.r=wa(r,a,t+1/3),this.g=wa(r,a,t),this.b=wa(r,a,t-1/3)}return Yt.toWorkingColorSpace(this,i),this}setStyle(t,e=ye){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=i[1],o=i[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=i[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ye){const n=gl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=yi(t.r),this.g=yi(t.g),this.b=yi(t.b),this}copyLinearToSRGB(t){return this.r=ua(t.r),this.g=ua(t.g),this.b=ua(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ye){return Yt.fromWorkingColorSpace(be.copy(this),t),Math.round(Ie(be.r*255,0,255))*65536+Math.round(Ie(be.g*255,0,255))*256+Math.round(Ie(be.b*255,0,255))}getHexString(t=ye){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.fromWorkingColorSpace(be.copy(this),e);const n=be.r,i=be.g,a=be.b,r=Math.max(n,i,a),o=Math.min(n,i,a);let l,c;const h=(o+r)/2;if(o===r)l=0,c=0;else{const d=r-o;switch(c=h<=.5?d/(r+o):d/(2-r-o),r){case n:l=(i-a)/d+(i<a?6:0);break;case i:l=(a-n)/d+2;break;case a:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Yt.workingColorSpace){return Yt.fromWorkingColorSpace(be.copy(this),e),t.r=be.r,t.g=be.g,t.b=be.b,t}getStyle(t=ye){Yt.fromWorkingColorSpace(be.copy(this),t);const e=be.r,n=be.g,i=be.b;return t!==ye?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Rn),this.setHSL(Rn.h+t,Rn.s+e,Rn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Rn),t.getHSL(xs);const n=qi(Rn.h,xs.h,e),i=qi(Rn.s,xs.s,e),a=qi(Rn.l,xs.l,e);return this.setHSL(n,i,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*i,this.g=a[1]*e+a[4]*n+a[7]*i,this.b=a[2]*e+a[5]*n+a[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const be=new vt;vt.NAMES=gl;let Mh=0;class es extends Ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Mh++}),this.uuid=Ri(),this.name="",this.type="Material",this.blending=xi,this.side=wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ka,this.blendDst=Ba,this.blendEquation=Wn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new vt(0,0,0),this.blendAlpha=0,this.depthFunc=Bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=qo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Zn,this.stencilZFail=Zn,this.stencilZPass=Zn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==xi&&(n.blending=this.blending),this.side!==wn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ka&&(n.blendSrc=this.blendSrc),this.blendDst!==Ba&&(n.blendDst=this.blendDst),this.blendEquation!==Wn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Bs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==qo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Zn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Zn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Zn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(e){const a=i(t.textures),r=i(t.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let a=0;a!==i;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class vl extends es{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=el,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const fe=new U,Ms=new Tt;class Ne{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Yo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,a=this.itemSize;i<a;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ms.fromBufferAttribute(this,e),Ms.applyMatrix3(t),this.setXY(e,Ms.x,Ms.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix3(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix4(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyNormalMatrix(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.transformDirection(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=gi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=De(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=gi(e,this.array)),e}setX(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=gi(e,this.array)),e}setY(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=gi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=gi(e,this.array)),e}setW(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array),i=De(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,a){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),n=De(n,this.array),i=De(i,this.array),a=De(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Yo&&(t.usage=this.usage),t}}class _l extends Ne{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class xl extends Ne{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ne extends Ne{constructor(t,e,n){super(new Float32Array(t),e,n)}}let yh=0;const qe=new Wt,Ea=new Be,oi=new U,Ve=new un,Ni=new un,xe=new U;class Se extends Ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yh++}),this.uuid=Ri(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(dl(t)?xl:_l)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Gt().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return qe.makeRotationFromQuaternion(t),this.applyMatrix4(qe),this}rotateX(t){return qe.makeRotationX(t),this.applyMatrix4(qe),this}rotateY(t){return qe.makeRotationY(t),this.applyMatrix4(qe),this}rotateZ(t){return qe.makeRotationZ(t),this.applyMatrix4(qe),this}translate(t,e,n){return qe.makeTranslation(t,e,n),this.applyMatrix4(qe),this}scale(t,e,n){return qe.makeScale(t,e,n),this.applyMatrix4(qe),this}lookAt(t){return Ea.lookAt(t),Ea.updateMatrix(),this.applyMatrix4(Ea.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(oi).negate(),this.translate(oi.x,oi.y,oi.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const a=t[n];e.push(a.x,a.y,a.z||0)}return this.setAttribute("position",new ne(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new un);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const a=e[n];Ve.setFromBufferAttribute(a),this.morphTargetsRelative?(xe.addVectors(this.boundingBox.min,Ve.min),this.boundingBox.expandByPoint(xe),xe.addVectors(this.boundingBox.max,Ve.max),this.boundingBox.expandByPoint(xe)):(this.boundingBox.expandByPoint(Ve.min),this.boundingBox.expandByPoint(Ve.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Li);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new U,1/0);return}if(t){const n=this.boundingSphere.center;if(Ve.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];Ni.setFromBufferAttribute(o),this.morphTargetsRelative?(xe.addVectors(Ve.min,Ni.min),Ve.expandByPoint(xe),xe.addVectors(Ve.max,Ni.max),Ve.expandByPoint(xe)):(Ve.expandByPoint(Ni.min),Ve.expandByPoint(Ni.max))}Ve.getCenter(n);let i=0;for(let a=0,r=t.count;a<r;a++)xe.fromBufferAttribute(t,a),i=Math.max(i,n.distanceToSquared(xe));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)xe.fromBufferAttribute(o,c),l&&(oi.fromBufferAttribute(t,c),xe.add(oi)),i=Math.max(i,n.distanceToSquared(xe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,a=e.normal.array,r=e.uv.array,o=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ne(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let T=0;T<o;T++)c[T]=new U,h[T]=new U;const d=new U,u=new U,m=new U,v=new Tt,g=new Tt,p=new Tt,f=new U,x=new U;function _(T,I,W){d.fromArray(i,T*3),u.fromArray(i,I*3),m.fromArray(i,W*3),v.fromArray(r,T*2),g.fromArray(r,I*2),p.fromArray(r,W*2),u.sub(d),m.sub(d),g.sub(v),p.sub(v);const j=1/(g.x*p.y-p.x*g.y);isFinite(j)&&(f.copy(u).multiplyScalar(p.y).addScaledVector(m,-g.y).multiplyScalar(j),x.copy(m).multiplyScalar(g.x).addScaledVector(u,-p.x).multiplyScalar(j),c[T].add(f),c[I].add(f),c[W].add(f),h[T].add(x),h[I].add(x),h[W].add(x))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let T=0,I=M.length;T<I;++T){const W=M[T],j=W.start,R=W.count;for(let N=j,L=j+R;N<L;N+=3)_(n[N+0],n[N+1],n[N+2])}const w=new U,y=new U,b=new U,D=new U;function S(T){b.fromArray(a,T*3),D.copy(b);const I=c[T];w.copy(I),w.sub(b.multiplyScalar(b.dot(I))).normalize(),y.crossVectors(D,I);const j=y.dot(h[T])<0?-1:1;l[T*4]=w.x,l[T*4+1]=w.y,l[T*4+2]=w.z,l[T*4+3]=j}for(let T=0,I=M.length;T<I;++T){const W=M[T],j=W.start,R=W.count;for(let N=j,L=j+R;N<L;N+=3)S(n[N+0]),S(n[N+1]),S(n[N+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ne(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,m=n.count;u<m;u++)n.setXYZ(u,0,0,0);const i=new U,a=new U,r=new U,o=new U,l=new U,c=new U,h=new U,d=new U;if(t)for(let u=0,m=t.count;u<m;u+=3){const v=t.getX(u+0),g=t.getX(u+1),p=t.getX(u+2);i.fromBufferAttribute(e,v),a.fromBufferAttribute(e,g),r.fromBufferAttribute(e,p),h.subVectors(r,a),d.subVectors(i,a),h.cross(d),o.fromBufferAttribute(n,v),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(v,o.x,o.y,o.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,m=e.count;u<m;u+=3)i.fromBufferAttribute(e,u+0),a.fromBufferAttribute(e,u+1),r.fromBufferAttribute(e,u+2),h.subVectors(r,a),d.subVectors(i,a),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)xe.fromBufferAttribute(t,e),xe.normalize(),t.setXYZ(e,xe.x,xe.y,xe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let m=0,v=0;for(let g=0,p=l.length;g<p;g++){o.isInterleavedBufferAttribute?m=l[g]*o.data.stride+o.offset:m=l[g]*h;for(let f=0;f<h;f++)u[v++]=c[m++]}return new Ne(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Se,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=t(l,n);e.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],m=t(u,n);l.push(m)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const m=c[d];h.push(m.toJSON(t.data))}h.length>0&&(i[l]=h,a=!0)}a&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const a=t.morphAttributes;for(const c in a){const h=[],d=a[c];for(let u=0,m=d.length;u<m;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let c=0,h=r.length;c<h;c++){const d=r[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const rr=new Wt,kn=new to,ys=new Li,lr=new U,ri=new U,li=new U,ci=new U,ba=new U,Ss=new U,ws=new Tt,Es=new Tt,bs=new Tt,cr=new U,hr=new U,ur=new U,Ts=new U,As=new U;class te extends Be{constructor(t=new Se,e=new vl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=i.length;a<r;a++){const o=i[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(a&&o){Ss.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=o[l],d=a[l];h!==0&&(ba.fromBufferAttribute(d,t),r?Ss.addScaledVector(ba,h):Ss.addScaledVector(ba.sub(e),h))}e.add(Ss)}return e}raycast(t,e){const n=this.geometry,i=this.material,a=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ys.copy(n.boundingSphere),ys.applyMatrix4(a),kn.copy(t.ray).recast(t.near),!(ys.containsPoint(kn.origin)===!1&&(kn.intersectSphere(ys,lr)===null||kn.origin.distanceToSquared(lr)>(t.far-t.near)**2))&&(rr.copy(a).invert(),kn.copy(t.ray).applyMatrix4(rr),!(n.boundingBox!==null&&kn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,kn)))}_computeIntersections(t,e,n){let i;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,d=a.attributes.normal,u=a.groups,m=a.drawRange;if(o!==null)if(Array.isArray(r))for(let v=0,g=u.length;v<g;v++){const p=u[v],f=r[p.materialIndex],x=Math.max(p.start,m.start),_=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let M=x,w=_;M<w;M+=3){const y=o.getX(M),b=o.getX(M+1),D=o.getX(M+2);i=Cs(this,f,t,n,c,h,d,y,b,D),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const v=Math.max(0,m.start),g=Math.min(o.count,m.start+m.count);for(let p=v,f=g;p<f;p+=3){const x=o.getX(p),_=o.getX(p+1),M=o.getX(p+2);i=Cs(this,r,t,n,c,h,d,x,_,M),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(r))for(let v=0,g=u.length;v<g;v++){const p=u[v],f=r[p.materialIndex],x=Math.max(p.start,m.start),_=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let M=x,w=_;M<w;M+=3){const y=M,b=M+1,D=M+2;i=Cs(this,f,t,n,c,h,d,y,b,D),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const v=Math.max(0,m.start),g=Math.min(l.count,m.start+m.count);for(let p=v,f=g;p<f;p+=3){const x=p,_=p+1,M=p+2;i=Cs(this,r,t,n,c,h,d,x,_,M),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}}function Sh(s,t,e,n,i,a,r,o){let l;if(t.side===Fe?l=n.intersectTriangle(r,a,i,!0,o):l=n.intersectTriangle(i,a,r,t.side===wn,o),l===null)return null;As.copy(o),As.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(As);return c<e.near||c>e.far?null:{distance:c,point:As.clone(),object:s}}function Cs(s,t,e,n,i,a,r,o,l,c){s.getVertexPosition(o,ri),s.getVertexPosition(l,li),s.getVertexPosition(c,ci);const h=Sh(s,t,e,n,ri,li,ci,Ts);if(h){i&&(ws.fromBufferAttribute(i,o),Es.fromBufferAttribute(i,l),bs.fromBufferAttribute(i,c),h.uv=en.getInterpolation(Ts,ri,li,ci,ws,Es,bs,new Tt)),a&&(ws.fromBufferAttribute(a,o),Es.fromBufferAttribute(a,l),bs.fromBufferAttribute(a,c),h.uv1=en.getInterpolation(Ts,ri,li,ci,ws,Es,bs,new Tt),h.uv2=h.uv1),r&&(cr.fromBufferAttribute(r,o),hr.fromBufferAttribute(r,l),ur.fromBufferAttribute(r,c),h.normal=en.getInterpolation(Ts,ri,li,ci,cr,hr,ur,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new U,materialIndex:0};en.getNormal(ri,li,ci,d.normal),h.face=d}return h}class ns extends Se{constructor(t=1,e=1,n=1,i=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:a,depthSegments:r};const o=this;i=Math.floor(i),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],h=[],d=[];let u=0,m=0;v("z","y","x",-1,-1,n,e,t,r,a,0),v("z","y","x",1,-1,n,e,-t,r,a,1),v("x","z","y",1,1,t,n,e,i,r,2),v("x","z","y",1,-1,t,n,-e,i,r,3),v("x","y","z",1,-1,t,e,n,i,a,4),v("x","y","z",-1,-1,t,e,-n,i,a,5),this.setIndex(l),this.setAttribute("position",new ne(c,3)),this.setAttribute("normal",new ne(h,3)),this.setAttribute("uv",new ne(d,2));function v(g,p,f,x,_,M,w,y,b,D,S){const T=M/b,I=w/D,W=M/2,j=w/2,R=y/2,N=b+1,L=D+1;let z=0,q=0;const X=new U;for(let $=0;$<L;$++){const Z=$*I-j;for(let at=0;at<N;at++){const V=at*T-W;X[g]=V*x,X[p]=Z*_,X[f]=R,c.push(X.x,X.y,X.z),X[g]=0,X[p]=0,X[f]=y>0?1:-1,h.push(X.x,X.y,X.z),d.push(at/b),d.push(1-$/D),z+=1}}for(let $=0;$<D;$++)for(let Z=0;Z<b;Z++){const at=u+Z+N*$,V=u+Z+N*($+1),K=u+(Z+1)+N*($+1),st=u+(Z+1)+N*$;l.push(at,V,st),l.push(V,K,st),q+=6}o.addGroup(m,q,S),m+=q,u+=z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ns(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ai(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ue(s){const t={};for(let e=0;e<s.length;e++){const n=Ai(s[e]);for(const i in n)t[i]=n[i]}return t}function wh(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Ml(s){return s.getRenderTarget()===null?s.outputColorSpace:Yt.workingColorSpace}const Eh={clone:Ai,merge:Ue};var bh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Th=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class pe extends es{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bh,this.fragmentShader=Th,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ai(t.uniforms),this.uniformsGroups=wh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const r=this.uniforms[i].value;r&&r.isTexture?e.uniforms[i]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[i]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[i]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[i]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[i]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[i]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[i]={type:"m4",value:r.toArray()}:e.uniforms[i]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class yl extends Be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Wt,this.projectionMatrix=new Wt,this.projectionMatrixInverse=new Wt,this.coordinateSystem=Sn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Ye extends yl{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ki*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Xi*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ki*2*Math.atan(Math.tan(Xi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Xi*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,a=-.5*i;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*i/l,e-=r.offsetY*n/c,i*=r.width/l,n*=r.height/c}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const hi=-90,ui=1;class Ah extends Be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ye(hi,ui,t,e);i.layers=this.layers,this.add(i);const a=new Ye(hi,ui,t,e);a.layers=this.layers,this.add(a);const r=new Ye(hi,ui,t,e);r.layers=this.layers,this.add(r);const o=new Ye(hi,ui,t,e);o.layers=this.layers,this.add(o);const l=new Ye(hi,ui,t,e);l.layers=this.layers,this.add(l);const c=new Ye(hi,ui,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,a,r,o,l]=e;for(const c of e)this.remove(c);if(t===Sn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Xs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,a),t.setRenderTarget(n,1,i),t.render(e,r),t.setRenderTarget(n,2,i),t.render(e,o),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(d,u,m),t.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class Sl extends ke{constructor(t,e,n,i,a,r,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Si,super(t,e,n,i,a,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ch extends an{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(Yi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===$n?ye:je),this.texture=new Sl(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ee}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ns(5,5,5),a=new pe({name:"CubemapFromEquirect",uniforms:Ai(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Fe,blending:Pn});a.uniforms.tEquirect.value=e;const r=new te(i,a),o=e.minFilter;return e.minFilter===jn&&(e.minFilter=ee),new Ah(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,i){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,i);t.setRenderTarget(a)}}const Ta=new U,Rh=new U,Lh=new Gt;class Gn{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Ta.subVectors(n,e).cross(Rh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ta),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/i;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Lh.getNormalMatrix(t),i=this.coplanarPoint(Ta).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Bn=new Li,Rs=new U;class Zs{constructor(t=new Gn,e=new Gn,n=new Gn,i=new Gn,a=new Gn,r=new Gn){this.planes=[t,e,n,i,a,r]}set(t,e,n,i,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Sn){const n=this.planes,i=t.elements,a=i[0],r=i[1],o=i[2],l=i[3],c=i[4],h=i[5],d=i[6],u=i[7],m=i[8],v=i[9],g=i[10],p=i[11],f=i[12],x=i[13],_=i[14],M=i[15];if(n[0].setComponents(l-a,u-c,p-m,M-f).normalize(),n[1].setComponents(l+a,u+c,p+m,M+f).normalize(),n[2].setComponents(l+r,u+h,p+v,M+x).normalize(),n[3].setComponents(l-r,u-h,p-v,M-x).normalize(),n[4].setComponents(l-o,u-d,p-g,M-_).normalize(),e===Sn)n[5].setComponents(l+o,u+d,p+g,M+_).normalize();else if(e===Xs)n[5].setComponents(o,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Bn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Bn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Bn)}intersectsSprite(t){return Bn.center.set(0,0,0),Bn.radius=.7071067811865476,Bn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Bn)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Rs.x=i.normal.x>0?t.max.x:t.min.x,Rs.y=i.normal.y>0?t.max.y:t.min.y,Rs.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Rs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function wl(){let s=null,t=!1,e=null,n=null;function i(a,r){e(a,r),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){s=a}}}function Ph(s,t){const e=t.isWebGL2,n=new WeakMap;function i(c,h){const d=c.array,u=c.usage,m=d.byteLength,v=s.createBuffer();s.bindBuffer(h,v),s.bufferData(h,d,u),c.onUploadCallback();let g;if(d instanceof Float32Array)g=s.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)g=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=s.UNSIGNED_SHORT;else if(d instanceof Int16Array)g=s.SHORT;else if(d instanceof Uint32Array)g=s.UNSIGNED_INT;else if(d instanceof Int32Array)g=s.INT;else if(d instanceof Int8Array)g=s.BYTE;else if(d instanceof Uint8Array)g=s.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)g=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:v,type:g,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version,size:m}}function a(c,h,d){const u=h.array,m=h._updateRange,v=h.updateRanges;if(s.bindBuffer(d,c),m.count===-1&&v.length===0&&s.bufferSubData(d,0,u),v.length!==0){for(let g=0,p=v.length;g<p;g++){const f=v[g];e?s.bufferSubData(d,f.start*u.BYTES_PER_ELEMENT,u,f.start,f.count):s.bufferSubData(d,f.start*u.BYTES_PER_ELEMENT,u.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}m.count!==-1&&(e?s.bufferSubData(d,m.offset*u.BYTES_PER_ELEMENT,u,m.offset,m.count):s.bufferSubData(d,m.offset*u.BYTES_PER_ELEMENT,u.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function r(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const u=n.get(c);(!u||u.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const d=n.get(c);if(d===void 0)n.set(c,i(c,h));else if(d.version<c.version){if(d.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");a(d.buffer,c,h),d.version=c.version}}return{get:r,remove:o,update:l}}class no extends Se{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const a=t/2,r=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,d=t/o,u=e/l,m=[],v=[],g=[],p=[];for(let f=0;f<h;f++){const x=f*u-r;for(let _=0;_<c;_++){const M=_*d-a;v.push(M,-x,0),g.push(0,0,1),p.push(_/o),p.push(1-f/l)}}for(let f=0;f<l;f++)for(let x=0;x<o;x++){const _=x+c*f,M=x+c*(f+1),w=x+1+c*(f+1),y=x+1+c*f;m.push(_,M,y),m.push(M,w,y)}this.setIndex(m),this.setAttribute("position",new ne(v,3)),this.setAttribute("normal",new ne(g,3)),this.setAttribute("uv",new ne(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new no(t.width,t.height,t.widthSegments,t.heightSegments)}}var Dh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Uh=`#ifdef USE_ALPHAHASH
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
#endif`,Ih=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Fh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nh=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,zh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Oh=`#ifdef USE_AOMAP
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
#endif`,kh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Bh=`#ifdef USE_BATCHING
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
#endif`,Gh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Hh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Vh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Wh=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Xh=`#ifdef USE_IRIDESCENCE
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
#endif`,qh=`#ifdef USE_BUMPMAP
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
#endif`,Yh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$h=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,jh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Kh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Zh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Jh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Qh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,tu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,eu=`#define PI 3.141592653589793
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
} // validated`,nu=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,iu=`vec3 transformedNormal = objectNormal;
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
#endif`,su=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,au=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ou=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ru=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lu="gl_FragColor = linearToOutputTexel( gl_FragColor );",cu=`
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
}`,hu=`#ifdef USE_ENVMAP
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
#endif`,uu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,du=`#ifdef USE_ENVMAP
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
#endif`,fu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pu=`#ifdef USE_ENVMAP
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
#endif`,mu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,vu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,_u=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xu=`#ifdef USE_GRADIENTMAP
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
}`,Mu=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,yu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Su=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Eu=`uniform bool receiveShadow;
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
#endif`,bu=`#ifdef USE_ENVMAP
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
#endif`,Tu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Au=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Cu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ru=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Lu=`PhysicalMaterial material;
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
#endif`,Pu=`struct PhysicalMaterial {
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
}`,Du=`
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
#endif`,Uu=`#if defined( RE_IndirectDiffuse )
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
#endif`,Iu=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Fu=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Nu=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zu=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Ou=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,ku=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Bu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Gu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Hu=`#if defined( USE_POINTS_UV )
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
#endif`,Vu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Wu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Xu=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qu=`#ifdef USE_MORPHNORMALS
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
#endif`,Yu=`#ifdef USE_MORPHTARGETS
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
#endif`,$u=`#ifdef USE_MORPHTARGETS
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
#endif`,ju=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ku=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Zu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ju=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qu=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,td=`#ifdef USE_NORMALMAP
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
#endif`,ed=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,nd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,id=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,sd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ad=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,od=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,rd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ld=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,cd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,hd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ud=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,dd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,fd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,pd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,md=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,gd=`float getShadowMask() {
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
}`,vd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_d=`#ifdef USE_SKINNING
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
#endif`,xd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Md=`#ifdef USE_SKINNING
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
#endif`,yd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Sd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ed=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,bd=`#ifdef USE_TRANSMISSION
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
#endif`,Td=`#ifdef USE_TRANSMISSION
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
#endif`,Ad=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Rd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ld=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Pd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Dd=`uniform sampler2D t2D;
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
}`,Ud=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Id=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Fd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zd=`#include <common>
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
}`,Od=`#if DEPTH_PACKING == 3200
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
}`,Bd=`#define DISTANCE
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
}`,Gd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Hd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vd=`uniform float scale;
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
}`,Wd=`uniform vec3 diffuse;
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
}`,Xd=`#include <common>
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
}`,qd=`uniform vec3 diffuse;
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
}`,Yd=`#define LAMBERT
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
}`,$d=`#define LAMBERT
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
}`,jd=`#define MATCAP
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
}`,Kd=`#define MATCAP
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
}`,Zd=`#define NORMAL
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
}`,Jd=`#define NORMAL
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
}`,Qd=`#define PHONG
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
}`,tf=`#define PHONG
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
}`,ef=`#define STANDARD
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
}`,nf=`#define STANDARD
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
}`,sf=`#define TOON
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
}`,af=`#define TOON
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
}`,of=`uniform float size;
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
}`,rf=`uniform vec3 diffuse;
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
}`,lf=`#include <common>
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
}`,cf=`uniform vec3 color;
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
}`,hf=`uniform float rotation;
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
}`,uf=`uniform vec3 diffuse;
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
}`,Ft={alphahash_fragment:Dh,alphahash_pars_fragment:Uh,alphamap_fragment:Ih,alphamap_pars_fragment:Fh,alphatest_fragment:Nh,alphatest_pars_fragment:zh,aomap_fragment:Oh,aomap_pars_fragment:kh,batching_pars_vertex:Bh,batching_vertex:Gh,begin_vertex:Hh,beginnormal_vertex:Vh,bsdfs:Wh,iridescence_fragment:Xh,bumpmap_pars_fragment:qh,clipping_planes_fragment:Yh,clipping_planes_pars_fragment:$h,clipping_planes_pars_vertex:jh,clipping_planes_vertex:Kh,color_fragment:Zh,color_pars_fragment:Jh,color_pars_vertex:Qh,color_vertex:tu,common:eu,cube_uv_reflection_fragment:nu,defaultnormal_vertex:iu,displacementmap_pars_vertex:su,displacementmap_vertex:au,emissivemap_fragment:ou,emissivemap_pars_fragment:ru,colorspace_fragment:lu,colorspace_pars_fragment:cu,envmap_fragment:hu,envmap_common_pars_fragment:uu,envmap_pars_fragment:du,envmap_pars_vertex:fu,envmap_physical_pars_fragment:bu,envmap_vertex:pu,fog_vertex:mu,fog_pars_vertex:gu,fog_fragment:vu,fog_pars_fragment:_u,gradientmap_pars_fragment:xu,lightmap_fragment:Mu,lightmap_pars_fragment:yu,lights_lambert_fragment:Su,lights_lambert_pars_fragment:wu,lights_pars_begin:Eu,lights_toon_fragment:Tu,lights_toon_pars_fragment:Au,lights_phong_fragment:Cu,lights_phong_pars_fragment:Ru,lights_physical_fragment:Lu,lights_physical_pars_fragment:Pu,lights_fragment_begin:Du,lights_fragment_maps:Uu,lights_fragment_end:Iu,logdepthbuf_fragment:Fu,logdepthbuf_pars_fragment:Nu,logdepthbuf_pars_vertex:zu,logdepthbuf_vertex:Ou,map_fragment:ku,map_pars_fragment:Bu,map_particle_fragment:Gu,map_particle_pars_fragment:Hu,metalnessmap_fragment:Vu,metalnessmap_pars_fragment:Wu,morphcolor_vertex:Xu,morphnormal_vertex:qu,morphtarget_pars_vertex:Yu,morphtarget_vertex:$u,normal_fragment_begin:ju,normal_fragment_maps:Ku,normal_pars_fragment:Zu,normal_pars_vertex:Ju,normal_vertex:Qu,normalmap_pars_fragment:td,clearcoat_normal_fragment_begin:ed,clearcoat_normal_fragment_maps:nd,clearcoat_pars_fragment:id,iridescence_pars_fragment:sd,opaque_fragment:ad,packing:od,premultiplied_alpha_fragment:rd,project_vertex:ld,dithering_fragment:cd,dithering_pars_fragment:hd,roughnessmap_fragment:ud,roughnessmap_pars_fragment:dd,shadowmap_pars_fragment:fd,shadowmap_pars_vertex:pd,shadowmap_vertex:md,shadowmask_pars_fragment:gd,skinbase_vertex:vd,skinning_pars_vertex:_d,skinning_vertex:xd,skinnormal_vertex:Md,specularmap_fragment:yd,specularmap_pars_fragment:Sd,tonemapping_fragment:wd,tonemapping_pars_fragment:Ed,transmission_fragment:bd,transmission_pars_fragment:Td,uv_pars_fragment:Ad,uv_pars_vertex:Cd,uv_vertex:Rd,worldpos_vertex:Ld,background_vert:Pd,background_frag:Dd,backgroundCube_vert:Ud,backgroundCube_frag:Id,cube_vert:Fd,cube_frag:Nd,depth_vert:zd,depth_frag:Od,distanceRGBA_vert:kd,distanceRGBA_frag:Bd,equirect_vert:Gd,equirect_frag:Hd,linedashed_vert:Vd,linedashed_frag:Wd,meshbasic_vert:Xd,meshbasic_frag:qd,meshlambert_vert:Yd,meshlambert_frag:$d,meshmatcap_vert:jd,meshmatcap_frag:Kd,meshnormal_vert:Zd,meshnormal_frag:Jd,meshphong_vert:Qd,meshphong_frag:tf,meshphysical_vert:ef,meshphysical_frag:nf,meshtoon_vert:sf,meshtoon_frag:af,points_vert:of,points_frag:rf,shadow_vert:lf,shadow_frag:cf,sprite_vert:hf,sprite_frag:uf},it={common:{diffuse:{value:new vt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Gt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Gt},normalScale:{value:new Tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new vt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new vt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0},uvTransform:{value:new Gt}},sprite:{diffuse:{value:new vt(16777215)},opacity:{value:1},center:{value:new Tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}}},ln={basic:{uniforms:Ue([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.fog]),vertexShader:Ft.meshbasic_vert,fragmentShader:Ft.meshbasic_frag},lambert:{uniforms:Ue([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new vt(0)}}]),vertexShader:Ft.meshlambert_vert,fragmentShader:Ft.meshlambert_frag},phong:{uniforms:Ue([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new vt(0)},specular:{value:new vt(1118481)},shininess:{value:30}}]),vertexShader:Ft.meshphong_vert,fragmentShader:Ft.meshphong_frag},standard:{uniforms:Ue([it.common,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.roughnessmap,it.metalnessmap,it.fog,it.lights,{emissive:{value:new vt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ft.meshphysical_vert,fragmentShader:Ft.meshphysical_frag},toon:{uniforms:Ue([it.common,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.gradientmap,it.fog,it.lights,{emissive:{value:new vt(0)}}]),vertexShader:Ft.meshtoon_vert,fragmentShader:Ft.meshtoon_frag},matcap:{uniforms:Ue([it.common,it.bumpmap,it.normalmap,it.displacementmap,it.fog,{matcap:{value:null}}]),vertexShader:Ft.meshmatcap_vert,fragmentShader:Ft.meshmatcap_frag},points:{uniforms:Ue([it.points,it.fog]),vertexShader:Ft.points_vert,fragmentShader:Ft.points_frag},dashed:{uniforms:Ue([it.common,it.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ft.linedashed_vert,fragmentShader:Ft.linedashed_frag},depth:{uniforms:Ue([it.common,it.displacementmap]),vertexShader:Ft.depth_vert,fragmentShader:Ft.depth_frag},normal:{uniforms:Ue([it.common,it.bumpmap,it.normalmap,it.displacementmap,{opacity:{value:1}}]),vertexShader:Ft.meshnormal_vert,fragmentShader:Ft.meshnormal_frag},sprite:{uniforms:Ue([it.sprite,it.fog]),vertexShader:Ft.sprite_vert,fragmentShader:Ft.sprite_frag},background:{uniforms:{uvTransform:{value:new Gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ft.background_vert,fragmentShader:Ft.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ft.backgroundCube_vert,fragmentShader:Ft.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ft.cube_vert,fragmentShader:Ft.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ft.equirect_vert,fragmentShader:Ft.equirect_frag},distanceRGBA:{uniforms:Ue([it.common,it.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ft.distanceRGBA_vert,fragmentShader:Ft.distanceRGBA_frag},shadow:{uniforms:Ue([it.lights,it.fog,{color:{value:new vt(0)},opacity:{value:1}}]),vertexShader:Ft.shadow_vert,fragmentShader:Ft.shadow_frag}};ln.physical={uniforms:Ue([ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Gt},clearcoatNormalScale:{value:new Tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Gt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Gt},sheen:{value:0},sheenColor:{value:new vt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Gt},transmissionSamplerSize:{value:new Tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Gt},attenuationDistance:{value:0},attenuationColor:{value:new vt(0)},specularColor:{value:new vt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Gt},anisotropyVector:{value:new Tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Gt}}]),vertexShader:Ft.meshphysical_vert,fragmentShader:Ft.meshphysical_frag};const Ls={r:0,b:0,g:0};function df(s,t,e,n,i,a,r){const o=new vt(0);let l=a===!0?0:1,c,h,d=null,u=0,m=null;function v(p,f){let x=!1,_=f.isScene===!0?f.background:null;_&&_.isTexture&&(_=(f.backgroundBlurriness>0?e:t).get(_)),_===null?g(o,l):_&&_.isColor&&(g(_,1),x=!0);const M=s.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(s.autoClear||x)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),_&&(_.isCubeTexture||_.mapping===js)?(h===void 0&&(h=new te(new ns(1,1,1),new pe({name:"BackgroundCubeMaterial",uniforms:Ai(ln.backgroundCube.uniforms),vertexShader:ln.backgroundCube.vertexShader,fragmentShader:ln.backgroundCube.fragmentShader,side:Fe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,y,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=Yt.getTransfer(_.colorSpace)!==Jt,(d!==_||u!==_.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,d=_,u=_.version,m=s.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new te(new no(2,2),new pe({name:"BackgroundMaterial",uniforms:Ai(ln.background.uniforms),vertexShader:ln.background.vertexShader,fragmentShader:ln.background.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(_.colorSpace)!==Jt,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||u!==_.version||m!==s.toneMapping)&&(c.material.needsUpdate=!0,d=_,u=_.version,m=s.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function g(p,f){p.getRGB(Ls,Ml(s)),n.buffers.color.setClear(Ls.r,Ls.g,Ls.b,f,r)}return{getClearColor:function(){return o},setClearColor:function(p,f=1){o.set(p),l=f,g(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,g(o,l)},render:v}}function ff(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),a=n.isWebGL2?null:t.get("OES_vertex_array_object"),r=n.isWebGL2||a!==null,o={},l=p(null);let c=l,h=!1;function d(R,N,L,z,q){let X=!1;if(r){const $=g(z,L,N);c!==$&&(c=$,m(c.object)),X=f(R,z,L,q),X&&x(R,z,L,q)}else{const $=N.wireframe===!0;(c.geometry!==z.id||c.program!==L.id||c.wireframe!==$)&&(c.geometry=z.id,c.program=L.id,c.wireframe=$,X=!0)}q!==null&&e.update(q,s.ELEMENT_ARRAY_BUFFER),(X||h)&&(h=!1,D(R,N,L,z),q!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function u(){return n.isWebGL2?s.createVertexArray():a.createVertexArrayOES()}function m(R){return n.isWebGL2?s.bindVertexArray(R):a.bindVertexArrayOES(R)}function v(R){return n.isWebGL2?s.deleteVertexArray(R):a.deleteVertexArrayOES(R)}function g(R,N,L){const z=L.wireframe===!0;let q=o[R.id];q===void 0&&(q={},o[R.id]=q);let X=q[N.id];X===void 0&&(X={},q[N.id]=X);let $=X[z];return $===void 0&&($=p(u()),X[z]=$),$}function p(R){const N=[],L=[],z=[];for(let q=0;q<i;q++)N[q]=0,L[q]=0,z[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:L,attributeDivisors:z,object:R,attributes:{},index:null}}function f(R,N,L,z){const q=c.attributes,X=N.attributes;let $=0;const Z=L.getAttributes();for(const at in Z)if(Z[at].location>=0){const K=q[at];let st=X[at];if(st===void 0&&(at==="instanceMatrix"&&R.instanceMatrix&&(st=R.instanceMatrix),at==="instanceColor"&&R.instanceColor&&(st=R.instanceColor)),K===void 0||K.attribute!==st||st&&K.data!==st.data)return!0;$++}return c.attributesNum!==$||c.index!==z}function x(R,N,L,z){const q={},X=N.attributes;let $=0;const Z=L.getAttributes();for(const at in Z)if(Z[at].location>=0){let K=X[at];K===void 0&&(at==="instanceMatrix"&&R.instanceMatrix&&(K=R.instanceMatrix),at==="instanceColor"&&R.instanceColor&&(K=R.instanceColor));const st={};st.attribute=K,K&&K.data&&(st.data=K.data),q[at]=st,$++}c.attributes=q,c.attributesNum=$,c.index=z}function _(){const R=c.newAttributes;for(let N=0,L=R.length;N<L;N++)R[N]=0}function M(R){w(R,0)}function w(R,N){const L=c.newAttributes,z=c.enabledAttributes,q=c.attributeDivisors;L[R]=1,z[R]===0&&(s.enableVertexAttribArray(R),z[R]=1),q[R]!==N&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,N),q[R]=N)}function y(){const R=c.newAttributes,N=c.enabledAttributes;for(let L=0,z=N.length;L<z;L++)N[L]!==R[L]&&(s.disableVertexAttribArray(L),N[L]=0)}function b(R,N,L,z,q,X,$){$===!0?s.vertexAttribIPointer(R,N,L,q,X):s.vertexAttribPointer(R,N,L,z,q,X)}function D(R,N,L,z){if(n.isWebGL2===!1&&(R.isInstancedMesh||z.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();const q=z.attributes,X=L.getAttributes(),$=N.defaultAttributeValues;for(const Z in X){const at=X[Z];if(at.location>=0){let V=q[Z];if(V===void 0&&(Z==="instanceMatrix"&&R.instanceMatrix&&(V=R.instanceMatrix),Z==="instanceColor"&&R.instanceColor&&(V=R.instanceColor)),V!==void 0){const K=V.normalized,st=V.itemSize,_t=e.get(V);if(_t===void 0)continue;const gt=_t.buffer,Pt=_t.type,Ut=_t.bytesPerElement,Et=n.isWebGL2===!0&&(Pt===s.INT||Pt===s.UNSIGNED_INT||V.gpuType===il);if(V.isInterleavedBufferAttribute){const Vt=V.data,O=Vt.stride,Re=V.offset;if(Vt.isInstancedInterleavedBuffer){for(let Mt=0;Mt<at.locationSize;Mt++)w(at.location+Mt,Vt.meshPerAttribute);R.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Vt.meshPerAttribute*Vt.count)}else for(let Mt=0;Mt<at.locationSize;Mt++)M(at.location+Mt);s.bindBuffer(s.ARRAY_BUFFER,gt);for(let Mt=0;Mt<at.locationSize;Mt++)b(at.location+Mt,st/at.locationSize,Pt,K,O*Ut,(Re+st/at.locationSize*Mt)*Ut,Et)}else{if(V.isInstancedBufferAttribute){for(let Vt=0;Vt<at.locationSize;Vt++)w(at.location+Vt,V.meshPerAttribute);R.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let Vt=0;Vt<at.locationSize;Vt++)M(at.location+Vt);s.bindBuffer(s.ARRAY_BUFFER,gt);for(let Vt=0;Vt<at.locationSize;Vt++)b(at.location+Vt,st/at.locationSize,Pt,K,st*Ut,st/at.locationSize*Vt*Ut,Et)}}else if($!==void 0){const K=$[Z];if(K!==void 0)switch(K.length){case 2:s.vertexAttrib2fv(at.location,K);break;case 3:s.vertexAttrib3fv(at.location,K);break;case 4:s.vertexAttrib4fv(at.location,K);break;default:s.vertexAttrib1fv(at.location,K)}}}}y()}function S(){W();for(const R in o){const N=o[R];for(const L in N){const z=N[L];for(const q in z)v(z[q].object),delete z[q];delete N[L]}delete o[R]}}function T(R){if(o[R.id]===void 0)return;const N=o[R.id];for(const L in N){const z=N[L];for(const q in z)v(z[q].object),delete z[q];delete N[L]}delete o[R.id]}function I(R){for(const N in o){const L=o[N];if(L[R.id]===void 0)continue;const z=L[R.id];for(const q in z)v(z[q].object),delete z[q];delete L[R.id]}}function W(){j(),h=!0,c!==l&&(c=l,m(c.object))}function j(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:W,resetDefaultState:j,dispose:S,releaseStatesOfGeometry:T,releaseStatesOfProgram:I,initAttributes:_,enableAttribute:M,disableUnusedAttributes:y}}function pf(s,t,e,n){const i=n.isWebGL2;let a;function r(h){a=h}function o(h,d){s.drawArrays(a,h,d),e.update(d,a,1)}function l(h,d,u){if(u===0)return;let m,v;if(i)m=s,v="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[v](a,h,d,u),e.update(d,a,u)}function c(h,d,u){if(u===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<u;v++)this.render(h[v],d[v]);else{m.multiDrawArraysWEBGL(a,h,0,d,0,u);let v=0;for(let g=0;g<u;g++)v+=d[g];e.update(v,a,1)}}this.setMode=r,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function mf(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(b){if(b==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const r=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const l=a(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=r||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),u=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_TEXTURE_SIZE),v=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),p=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),f=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),_=u>0,M=r||t.has("OES_texture_float"),w=_&&M,y=r?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:r,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:a,precision:o,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:u,maxTextureSize:m,maxCubemapSize:v,maxAttributes:g,maxVertexUniforms:p,maxVaryings:f,maxFragmentUniforms:x,vertexTextures:_,floatFragmentTextures:M,floatVertexTextures:w,maxSamples:y}}function gf(s){const t=this;let e=null,n=0,i=!1,a=!1;const r=new Gn,o=new Gt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const m=d.length!==0||u||n!==0||i;return i=u,n=d.length,m},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,m){const v=d.clippingPlanes,g=d.clipIntersection,p=d.clipShadows,f=s.get(d);if(!i||v===null||v.length===0||a&&!p)a?h(null):c();else{const x=a?0:n,_=x*4;let M=f.clippingState||null;l.value=M,M=h(v,u,_,m);for(let w=0;w!==_;++w)M[w]=e[w];f.clippingState=M,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,m,v){const g=d!==null?d.length:0;let p=null;if(g!==0){if(p=l.value,v!==!0||p===null){const f=m+g*4,x=u.matrixWorldInverse;o.getNormalMatrix(x),(p===null||p.length<f)&&(p=new Float32Array(f));for(let _=0,M=m;_!==g;++_,M+=4)r.copy(d[_]).applyMatrix4(x,o),r.normal.toArray(p,M),p[M+3]=r.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,p}}function vf(s){let t=new WeakMap;function e(r,o){return o===Ga?r.mapping=Si:o===Ha&&(r.mapping=wi),r}function n(r){if(r&&r.isTexture){const o=r.mapping;if(o===Ga||o===Ha)if(t.has(r)){const l=t.get(r).texture;return e(l,r.mapping)}else{const l=r.image;if(l&&l.height>0){const c=new Ch(l.height/2);return c.fromEquirectangularTexture(s,r),t.set(r,c),r.addEventListener("dispose",i),e(c.texture,r.mapping)}else return null}}return r}function i(r){const o=r.target;o.removeEventListener("dispose",i);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}class is extends yl{constructor(t=-1,e=1,n=1,i=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let a=n-t,r=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const vi=4,dr=[.125,.215,.35,.446,.526,.582],Xn=20,Aa=new is,fr=new vt;let Ca=null,Ra=0,La=0;const Hn=(1+Math.sqrt(5))/2,di=1/Hn,pr=[new U(1,1,1),new U(-1,1,1),new U(1,1,-1),new U(-1,1,-1),new U(0,Hn,di),new U(0,Hn,-di),new U(di,0,Hn),new U(-di,0,Hn),new U(Hn,di,0),new U(-Hn,di,0)];class mr{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Ca=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),La=this._renderer.getActiveMipmapLevel(),this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,n,i,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_r(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vr(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ca,Ra,La),t.scissorTest=!1,Ps(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Si||t.mapping===wi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ca=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),La=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ee,minFilter:ee,generateMipmaps:!1,type:Un,format:Oe,colorSpace:En,depthBuffer:!1},i=gr(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=gr(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=_f(a)),this._blurMaterial=xf(a,t,e)}return i}_compileMaterial(t){const e=new te(this._lodPlanes[0],t);this._renderer.compile(e,Aa)}_sceneToCubeUV(t,e,n,i){const o=new Ye(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(fr),h.toneMapping=Dn,h.autoClear=!1;const m=new vl({name:"PMREM.Background",side:Fe,depthWrite:!1,depthTest:!1}),v=new te(new ns,m);let g=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,g=!0):(m.color.copy(fr),g=!0);for(let f=0;f<6;f++){const x=f%3;x===0?(o.up.set(0,l[f],0),o.lookAt(c[f],0,0)):x===1?(o.up.set(0,0,l[f]),o.lookAt(0,c[f],0)):(o.up.set(0,l[f],0),o.lookAt(0,0,c[f]));const _=this._cubeSize;Ps(i,x*_,f>2?_:0,_,_),h.setRenderTarget(i),g&&h.render(v,o),h.render(t,o)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=u,h.autoClear=d,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Si||t.mapping===wi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=_r()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vr());const a=i?this._cubemapMaterial:this._equirectMaterial,r=new te(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const l=this._cubeSize;Ps(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(r,Aa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const a=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),r=pr[(i-1)%pr.length];this._blur(t,i-1,i,a,r)}e.autoClear=n}_blur(t,e,n,i,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,i,"latitudinal",a),this._halfBlur(r,t,n,n,i,"longitudinal",a)}_halfBlur(t,e,n,i,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new te(this._lodPlanes[i],c),u=c.uniforms,m=this._sizeLods[n]-1,v=isFinite(a)?Math.PI/(2*m):2*Math.PI/(2*Xn-1),g=a/v,p=isFinite(a)?1+Math.floor(h*g):Xn;p>Xn&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Xn}`);const f=[];let x=0;for(let b=0;b<Xn;++b){const D=b/g,S=Math.exp(-D*D/2);f.push(S),b===0?x+=S:b<p&&(x+=2*S)}for(let b=0;b<f.length;b++)f[b]=f[b]/x;u.envMap.value=t.texture,u.samples.value=p,u.weights.value=f,u.latitudinal.value=r==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:_}=this;u.dTheta.value=v,u.mipInt.value=_-n;const M=this._sizeLods[i],w=3*M*(i>_-vi?i-_+vi:0),y=4*(this._cubeSize-M);Ps(e,w,y,3*M,2*M),l.setRenderTarget(e),l.render(d,Aa)}}function _f(s){const t=[],e=[],n=[];let i=s;const a=s-vi+1+dr.length;for(let r=0;r<a;r++){const o=Math.pow(2,i);e.push(o);let l=1/o;r>s-vi?l=dr[r-s+vi-1]:r===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,v=6,g=3,p=2,f=1,x=new Float32Array(g*v*m),_=new Float32Array(p*v*m),M=new Float32Array(f*v*m);for(let y=0;y<m;y++){const b=y%3*2/3-1,D=y>2?0:-1,S=[b,D,0,b+2/3,D,0,b+2/3,D+1,0,b,D,0,b+2/3,D+1,0,b,D+1,0];x.set(S,g*v*y),_.set(u,p*v*y);const T=[y,y,y,y,y,y];M.set(T,f*v*y)}const w=new Se;w.setAttribute("position",new Ne(x,g)),w.setAttribute("uv",new Ne(_,p)),w.setAttribute("faceIndex",new Ne(M,f)),t.push(w),i>vi&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function gr(s,t,e){const n=new an(s,t,e);return n.texture.mapping=js,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ps(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function xf(s,t,e){const n=new Float32Array(Xn),i=new U(0,1,0);return new pe({name:"SphericalGaussianBlur",defines:{n:Xn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:io(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function vr(){return new pe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:io(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function _r(){return new pe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:io(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function io(){return`

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
	`}function Mf(s){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Ga||l===Ha,h=l===Si||l===wi;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let d=t.get(o);return e===null&&(e=new mr(s)),d=c?e.fromEquirectangular(o,d):e.fromCubemap(o,d),t.set(o,d),d.texture}else{if(t.has(o))return t.get(o).texture;{const d=o.image;if(c&&d&&d.height>0||h&&d&&i(d)){e===null&&(e=new mr(s));const u=c?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,u),o.addEventListener("dispose",a),u.texture}else return null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function a(o){const l=o.target;l.removeEventListener("dispose",a);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function yf(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Sf(s,t,e,n){const i={},a=new WeakMap;function r(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const v in u.attributes)t.remove(u.attributes[v]);for(const v in u.morphAttributes){const g=u.morphAttributes[v];for(let p=0,f=g.length;p<f;p++)t.remove(g[p])}u.removeEventListener("dispose",r),delete i[u.id];const m=a.get(u);m&&(t.remove(m),a.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return i[u.id]===!0||(u.addEventListener("dispose",r),i[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const v in u)t.update(u[v],s.ARRAY_BUFFER);const m=d.morphAttributes;for(const v in m){const g=m[v];for(let p=0,f=g.length;p<f;p++)t.update(g[p],s.ARRAY_BUFFER)}}function c(d){const u=[],m=d.index,v=d.attributes.position;let g=0;if(m!==null){const x=m.array;g=m.version;for(let _=0,M=x.length;_<M;_+=3){const w=x[_+0],y=x[_+1],b=x[_+2];u.push(w,y,y,b,b,w)}}else if(v!==void 0){const x=v.array;g=v.version;for(let _=0,M=x.length/3-1;_<M;_+=3){const w=_+0,y=_+1,b=_+2;u.push(w,y,y,b,b,w)}}else return;const p=new(dl(u)?xl:_l)(u,1);p.version=g;const f=a.get(d);f&&t.remove(f),a.set(d,p)}function h(d){const u=a.get(d);if(u){const m=d.index;m!==null&&u.version<m.version&&c(d)}else c(d);return a.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function wf(s,t,e,n){const i=n.isWebGL2;let a;function r(m){a=m}let o,l;function c(m){o=m.type,l=m.bytesPerElement}function h(m,v){s.drawElements(a,v,o,m*l),e.update(v,a,1)}function d(m,v,g){if(g===0)return;let p,f;if(i)p=s,f="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[f](a,v,o,m*l,g),e.update(v,a,g)}function u(m,v,g){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<g;f++)this.render(m[f]/l,v[f]);else{p.multiDrawElementsWEBGL(a,v,0,o,m,0,g);let f=0;for(let x=0;x<g;x++)f+=v[x];e.update(f,a,1)}}this.setMode=r,this.setIndex=c,this.render=h,this.renderInstances=d,this.renderMultiDraw=u}function Ef(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(e.calls++,r){case s.TRIANGLES:e.triangles+=o*(a/3);break;case s.LINES:e.lines+=o*(a/2);break;case s.LINE_STRIP:e.lines+=o*(a-1);break;case s.LINE_LOOP:e.lines+=o*a;break;case s.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function bf(s,t){return s[0]-t[0]}function Tf(s,t){return Math.abs(t[1])-Math.abs(s[1])}function Af(s,t,e){const n={},i=new Float32Array(8),a=new WeakMap,r=new le,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,d){const u=c.morphTargetInfluences;if(t.isWebGL2===!0){const m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=m!==void 0?m.length:0;let g=a.get(h);if(g===void 0||g.count!==v){let R=function(){W.dispose(),a.delete(h),h.removeEventListener("dispose",R)};g!==void 0&&g.texture.dispose();const x=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,M=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],y=h.morphAttributes.normal||[],b=h.morphAttributes.color||[];let D=0;x===!0&&(D=1),_===!0&&(D=2),M===!0&&(D=3);let S=h.attributes.position.count*D,T=1;S>t.maxTextureSize&&(T=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const I=new Float32Array(S*T*4*v),W=new ml(I,S,T,v);W.type=cn,W.needsUpdate=!0;const j=D*4;for(let N=0;N<v;N++){const L=w[N],z=y[N],q=b[N],X=S*T*4*N;for(let $=0;$<L.count;$++){const Z=$*j;x===!0&&(r.fromBufferAttribute(L,$),I[X+Z+0]=r.x,I[X+Z+1]=r.y,I[X+Z+2]=r.z,I[X+Z+3]=0),_===!0&&(r.fromBufferAttribute(z,$),I[X+Z+4]=r.x,I[X+Z+5]=r.y,I[X+Z+6]=r.z,I[X+Z+7]=0),M===!0&&(r.fromBufferAttribute(q,$),I[X+Z+8]=r.x,I[X+Z+9]=r.y,I[X+Z+10]=r.z,I[X+Z+11]=q.itemSize===4?r.w:1)}}g={count:v,texture:W,size:new Tt(S,T)},a.set(h,g),h.addEventListener("dispose",R)}let p=0;for(let x=0;x<u.length;x++)p+=u[x];const f=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(s,"morphTargetBaseInfluence",f),d.getUniforms().setValue(s,"morphTargetInfluences",u),d.getUniforms().setValue(s,"morphTargetsTexture",g.texture,e),d.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}else{const m=u===void 0?0:u.length;let v=n[h.id];if(v===void 0||v.length!==m){v=[];for(let _=0;_<m;_++)v[_]=[_,0];n[h.id]=v}for(let _=0;_<m;_++){const M=v[_];M[0]=_,M[1]=u[_]}v.sort(Tf);for(let _=0;_<8;_++)_<m&&v[_][1]?(o[_][0]=v[_][0],o[_][1]=v[_][1]):(o[_][0]=Number.MAX_SAFE_INTEGER,o[_][1]=0);o.sort(bf);const g=h.morphAttributes.position,p=h.morphAttributes.normal;let f=0;for(let _=0;_<8;_++){const M=o[_],w=M[0],y=M[1];w!==Number.MAX_SAFE_INTEGER&&y?(g&&h.getAttribute("morphTarget"+_)!==g[w]&&h.setAttribute("morphTarget"+_,g[w]),p&&h.getAttribute("morphNormal"+_)!==p[w]&&h.setAttribute("morphNormal"+_,p[w]),i[_]=y,f+=y):(g&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),i[_]=0)}const x=h.morphTargetsRelative?1:1-f;d.getUniforms().setValue(s,"morphTargetBaseInfluence",x),d.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function Cf(s,t,e,n){let i=new WeakMap;function a(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(i.get(d)!==c&&(t.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return d}function r(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:a,dispose:r}}class so extends ke{constructor(t,e,n,i,a,r,o,l,c,h){if(h=h!==void 0?h:Yn,h!==Yn&&h!==bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Yn&&(n=yn),n===void 0&&h===bi&&(n=qn),super(null,i,a,r,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:de,this.minFilter=l!==void 0?l:de,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const El=new ke,bl=new so(1,1);bl.compareFunction=ul;const Tl=new ml,Al=new qa,Cl=new Sl,xr=[],Mr=[],yr=new Float32Array(16),Sr=new Float32Array(9),wr=new Float32Array(4);function Pi(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let a=xr[i];if(a===void 0&&(a=new Float32Array(i),xr[i]=a),t!==0){n.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,s[r].toArray(a,o)}return a}function me(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function ge(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Js(s,t){let e=Mr[t];e===void 0&&(e=new Int32Array(t),Mr[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Rf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Lf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;s.uniform2fv(this.addr,t),ge(e,t)}}function Pf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(me(e,t))return;s.uniform3fv(this.addr,t),ge(e,t)}}function Df(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;s.uniform4fv(this.addr,t),ge(e,t)}}function Uf(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;wr.set(n),s.uniformMatrix2fv(this.addr,!1,wr),ge(e,n)}}function If(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;Sr.set(n),s.uniformMatrix3fv(this.addr,!1,Sr),ge(e,n)}}function Ff(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;yr.set(n),s.uniformMatrix4fv(this.addr,!1,yr),ge(e,n)}}function Nf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function zf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;s.uniform2iv(this.addr,t),ge(e,t)}}function Of(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;s.uniform3iv(this.addr,t),ge(e,t)}}function kf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;s.uniform4iv(this.addr,t),ge(e,t)}}function Bf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Gf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;s.uniform2uiv(this.addr,t),ge(e,t)}}function Hf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;s.uniform3uiv(this.addr,t),ge(e,t)}}function Vf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;s.uniform4uiv(this.addr,t),ge(e,t)}}function Wf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const a=this.type===s.SAMPLER_2D_SHADOW?bl:El;e.setTexture2D(t||a,i)}function Xf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Al,i)}function qf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Cl,i)}function Yf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Tl,i)}function $f(s){switch(s){case 5126:return Rf;case 35664:return Lf;case 35665:return Pf;case 35666:return Df;case 35674:return Uf;case 35675:return If;case 35676:return Ff;case 5124:case 35670:return Nf;case 35667:case 35671:return zf;case 35668:case 35672:return Of;case 35669:case 35673:return kf;case 5125:return Bf;case 36294:return Gf;case 36295:return Hf;case 36296:return Vf;case 35678:case 36198:case 36298:case 36306:case 35682:return Wf;case 35679:case 36299:case 36307:return Xf;case 35680:case 36300:case 36308:case 36293:return qf;case 36289:case 36303:case 36311:case 36292:return Yf}}function jf(s,t){s.uniform1fv(this.addr,t)}function Kf(s,t){const e=Pi(t,this.size,2);s.uniform2fv(this.addr,e)}function Zf(s,t){const e=Pi(t,this.size,3);s.uniform3fv(this.addr,e)}function Jf(s,t){const e=Pi(t,this.size,4);s.uniform4fv(this.addr,e)}function Qf(s,t){const e=Pi(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function tp(s,t){const e=Pi(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function ep(s,t){const e=Pi(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function np(s,t){s.uniform1iv(this.addr,t)}function ip(s,t){s.uniform2iv(this.addr,t)}function sp(s,t){s.uniform3iv(this.addr,t)}function ap(s,t){s.uniform4iv(this.addr,t)}function op(s,t){s.uniform1uiv(this.addr,t)}function rp(s,t){s.uniform2uiv(this.addr,t)}function lp(s,t){s.uniform3uiv(this.addr,t)}function cp(s,t){s.uniform4uiv(this.addr,t)}function hp(s,t,e){const n=this.cache,i=t.length,a=Js(e,i);me(n,a)||(s.uniform1iv(this.addr,a),ge(n,a));for(let r=0;r!==i;++r)e.setTexture2D(t[r]||El,a[r])}function up(s,t,e){const n=this.cache,i=t.length,a=Js(e,i);me(n,a)||(s.uniform1iv(this.addr,a),ge(n,a));for(let r=0;r!==i;++r)e.setTexture3D(t[r]||Al,a[r])}function dp(s,t,e){const n=this.cache,i=t.length,a=Js(e,i);me(n,a)||(s.uniform1iv(this.addr,a),ge(n,a));for(let r=0;r!==i;++r)e.setTextureCube(t[r]||Cl,a[r])}function fp(s,t,e){const n=this.cache,i=t.length,a=Js(e,i);me(n,a)||(s.uniform1iv(this.addr,a),ge(n,a));for(let r=0;r!==i;++r)e.setTexture2DArray(t[r]||Tl,a[r])}function pp(s){switch(s){case 5126:return jf;case 35664:return Kf;case 35665:return Zf;case 35666:return Jf;case 35674:return Qf;case 35675:return tp;case 35676:return ep;case 5124:case 35670:return np;case 35667:case 35671:return ip;case 35668:case 35672:return sp;case 35669:case 35673:return ap;case 5125:return op;case 36294:return rp;case 36295:return lp;case 36296:return cp;case 35678:case 36198:case 36298:case 36306:case 35682:return hp;case 35679:case 36299:case 36307:return up;case 35680:case 36300:case 36308:case 36293:return dp;case 36289:case 36303:case 36311:case 36292:return fp}}class mp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=$f(e.type)}}class gp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=pp(e.type)}}class vp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let a=0,r=i.length;a!==r;++a){const o=i[a];o.setValue(t,e[o.id],n)}}}const Pa=/(\w+)(\])?(\[|\.)?/g;function Er(s,t){s.seq.push(t),s.map[t.id]=t}function _p(s,t,e){const n=s.name,i=n.length;for(Pa.lastIndex=0;;){const a=Pa.exec(n),r=Pa.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===i){Er(e,c===void 0?new mp(o,s,t):new gp(o,s,t));break}else{let d=e.map[o];d===void 0&&(d=new vp(o),Er(e,d)),e=d}}}class zs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const a=t.getActiveUniform(e,i),r=t.getUniformLocation(e,a.name);_p(a,r,this)}}setValue(t,e,n,i){const a=this.map[e];a!==void 0&&a.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let a=0,r=e.length;a!==r;++a){const o=e[a],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,a=t.length;i!==a;++i){const r=t[i];r.id in e&&n.push(r)}return n}}function br(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const xp=37297;let Mp=0;function yp(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=i;r<a;r++){const o=r+1;n.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return n.join(`
`)}function Sp(s){const t=Yt.getPrimaries(Yt.workingColorSpace),e=Yt.getPrimaries(s);let n;switch(t===e?n="":t===Ws&&e===Vs?n="LinearDisplayP3ToLinearSRGB":t===Vs&&e===Ws&&(n="LinearSRGBToLinearDisplayP3"),s){case En:case Ks:return[n,"LinearTransferOETF"];case ye:case Ja:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Tr(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const a=/ERROR: 0:(\d+)/.exec(i);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+i+`

`+yp(s.getShaderSource(t),r)}else return i}function wp(s,t){const e=Sp(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Ep(s,t){let e;switch(t){case Sc:e="Linear";break;case wc:e="Reinhard";break;case Ec:e="OptimizedCineon";break;case bc:e="ACESFilmic";break;case Ac:e="AgX";break;case Tc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function bp(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(_i).join(`
`)}function Tp(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(_i).join(`
`)}function Ap(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Cp(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const a=s.getActiveAttrib(t,i),r=a.name;let o=1;a.type===s.FLOAT_MAT2&&(o=2),a.type===s.FLOAT_MAT3&&(o=3),a.type===s.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:s.getAttribLocation(t,r),locationSize:o}}return e}function _i(s){return s!==""}function Ar(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Cr(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Rp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ya(s){return s.replace(Rp,Pp)}const Lp=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Pp(s,t){let e=Ft[t];if(e===void 0){const n=Lp.get(t);if(n!==void 0)e=Ft[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ya(e)}const Dp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Rr(s){return s.replace(Dp,Up)}function Up(s,t,e,n){let i="";for(let a=parseInt(t);a<parseInt(e);a++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return i}function Lr(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Ip(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===tl?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Kl?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===xn&&(t="SHADOWMAP_TYPE_VSM"),t}function Fp(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Si:case wi:t="ENVMAP_TYPE_CUBE";break;case js:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Np(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case wi:t="ENVMAP_MODE_REFRACTION";break}return t}function zp(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case el:t="ENVMAP_BLENDING_MULTIPLY";break;case Mc:t="ENVMAP_BLENDING_MIX";break;case yc:t="ENVMAP_BLENDING_ADD";break}return t}function Op(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function kp(s,t,e,n){const i=s.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const l=Ip(e),c=Fp(e),h=Np(e),d=zp(e),u=Op(e),m=e.isWebGL2?"":bp(e),v=Tp(e),g=Ap(a),p=i.createProgram();let f,x,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(_i).join(`
`),f.length>0&&(f+=`
`),x=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(_i).join(`
`),x.length>0&&(x+=`
`)):(f=[Lr(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_i).join(`
`),x=[m,Lr(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Dn?"#define TONE_MAPPING":"",e.toneMapping!==Dn?Ft.tonemapping_pars_fragment:"",e.toneMapping!==Dn?Ep("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ft.colorspace_pars_fragment,wp("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(_i).join(`
`)),r=Ya(r),r=Ar(r,e),r=Cr(r,e),o=Ya(o),o=Ar(o,e),o=Cr(o,e),r=Rr(r),o=Rr(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,f=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,x=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===$o?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===$o?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const M=_+f+r,w=_+x+o,y=br(i,i.VERTEX_SHADER,M),b=br(i,i.FRAGMENT_SHADER,w);i.attachShader(p,y),i.attachShader(p,b),e.index0AttributeName!==void 0?i.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p);function D(W){if(s.debug.checkShaderErrors){const j=i.getProgramInfoLog(p).trim(),R=i.getShaderInfoLog(y).trim(),N=i.getShaderInfoLog(b).trim();let L=!0,z=!0;if(i.getProgramParameter(p,i.LINK_STATUS)===!1)if(L=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,p,y,b);else{const q=Tr(i,y,"vertex"),X=Tr(i,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,i.VALIDATE_STATUS)+`

Program Info Log: `+j+`
`+q+`
`+X)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):(R===""||N==="")&&(z=!1);z&&(W.diagnostics={runnable:L,programLog:j,vertexShader:{log:R,prefix:f},fragmentShader:{log:N,prefix:x}})}i.deleteShader(y),i.deleteShader(b),S=new zs(i,p),T=Cp(i,p)}let S;this.getUniforms=function(){return S===void 0&&D(this),S};let T;this.getAttributes=function(){return T===void 0&&D(this),T};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=i.getProgramParameter(p,xp)),I},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Mp++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=y,this.fragmentShader=b,this}let Bp=0;class Gp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),a=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(i)===!1&&(r.add(i),i.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Hp(t),e.set(t,n)),n}}class Hp{constructor(t){this.id=Bp++,this.code=t,this.usedTimes=0}}function Vp(s,t,e,n,i,a,r){const o=new eo,l=new Gp,c=[],h=i.isWebGL2,d=i.logarithmicDepthBuffer,u=i.vertexTextures;let m=i.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return S===0?"uv":`uv${S}`}function p(S,T,I,W,j){const R=W.fog,N=j.geometry,L=S.isMeshStandardMaterial?W.environment:null,z=(S.isMeshStandardMaterial?e:t).get(S.envMap||L),q=z&&z.mapping===js?z.image.height:null,X=v[S.type];S.precision!==null&&(m=i.getMaxPrecision(S.precision),m!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const $=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,Z=$!==void 0?$.length:0;let at=0;N.morphAttributes.position!==void 0&&(at=1),N.morphAttributes.normal!==void 0&&(at=2),N.morphAttributes.color!==void 0&&(at=3);let V,K,st,_t;if(X){const Le=ln[X];V=Le.vertexShader,K=Le.fragmentShader}else V=S.vertexShader,K=S.fragmentShader,l.update(S),st=l.getVertexShaderID(S),_t=l.getFragmentShaderID(S);const gt=s.getRenderTarget(),Pt=j.isInstancedMesh===!0,Ut=j.isBatchedMesh===!0,Et=!!S.map,Vt=!!S.matcap,O=!!z,Re=!!S.aoMap,Mt=!!S.lightMap,Rt=!!S.bumpMap,ft=!!S.normalMap,ie=!!S.displacementMap,Nt=!!S.emissiveMap,C=!!S.metalnessMap,E=!!S.roughnessMap,B=S.anisotropy>0,tt=S.clearcoat>0,Q=S.iridescence>0,et=S.sheen>0,pt=S.transmission>0,lt=B&&!!S.anisotropyMap,ut=tt&&!!S.clearcoatMap,wt=tt&&!!S.clearcoatNormalMap,zt=tt&&!!S.clearcoatRoughnessMap,J=Q&&!!S.iridescenceMap,qt=Q&&!!S.iridescenceThicknessMap,Ht=et&&!!S.sheenColorMap,Ct=et&&!!S.sheenRoughnessMap,xt=!!S.specularMap,dt=!!S.specularColorMap,It=!!S.specularIntensityMap,Xt=pt&&!!S.transmissionMap,ae=pt&&!!S.thicknessMap,kt=!!S.gradientMap,nt=!!S.alphaMap,P=S.alphaTest>0,ot=!!S.alphaHash,rt=!!S.extensions,bt=!!N.attributes.uv1,yt=!!N.attributes.uv2,$t=!!N.attributes.uv3;let jt=Dn;return S.toneMapped&&(gt===null||gt.isXRRenderTarget===!0)&&(jt=s.toneMapping),{isWebGL2:h,shaderID:X,shaderType:S.type,shaderName:S.name,vertexShader:V,fragmentShader:K,defines:S.defines,customVertexShaderID:st,customFragmentShaderID:_t,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:Ut,instancing:Pt,instancingColor:Pt&&j.instanceColor!==null,supportsVertexTextures:u,outputColorSpace:gt===null?s.outputColorSpace:gt.isXRRenderTarget===!0?gt.texture.colorSpace:En,map:Et,matcap:Vt,envMap:O,envMapMode:O&&z.mapping,envMapCubeUVHeight:q,aoMap:Re,lightMap:Mt,bumpMap:Rt,normalMap:ft,displacementMap:u&&ie,emissiveMap:Nt,normalMapObjectSpace:ft&&S.normalMapType===kc,normalMapTangentSpace:ft&&S.normalMapType===Oc,metalnessMap:C,roughnessMap:E,anisotropy:B,anisotropyMap:lt,clearcoat:tt,clearcoatMap:ut,clearcoatNormalMap:wt,clearcoatRoughnessMap:zt,iridescence:Q,iridescenceMap:J,iridescenceThicknessMap:qt,sheen:et,sheenColorMap:Ht,sheenRoughnessMap:Ct,specularMap:xt,specularColorMap:dt,specularIntensityMap:It,transmission:pt,transmissionMap:Xt,thicknessMap:ae,gradientMap:kt,opaque:S.transparent===!1&&S.blending===xi,alphaMap:nt,alphaTest:P,alphaHash:ot,combine:S.combine,mapUv:Et&&g(S.map.channel),aoMapUv:Re&&g(S.aoMap.channel),lightMapUv:Mt&&g(S.lightMap.channel),bumpMapUv:Rt&&g(S.bumpMap.channel),normalMapUv:ft&&g(S.normalMap.channel),displacementMapUv:ie&&g(S.displacementMap.channel),emissiveMapUv:Nt&&g(S.emissiveMap.channel),metalnessMapUv:C&&g(S.metalnessMap.channel),roughnessMapUv:E&&g(S.roughnessMap.channel),anisotropyMapUv:lt&&g(S.anisotropyMap.channel),clearcoatMapUv:ut&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:wt&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:zt&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:qt&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ht&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&g(S.sheenRoughnessMap.channel),specularMapUv:xt&&g(S.specularMap.channel),specularColorMapUv:dt&&g(S.specularColorMap.channel),specularIntensityMapUv:It&&g(S.specularIntensityMap.channel),transmissionMapUv:Xt&&g(S.transmissionMap.channel),thicknessMapUv:ae&&g(S.thicknessMap.channel),alphaMapUv:nt&&g(S.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(ft||B),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,vertexUv1s:bt,vertexUv2s:yt,vertexUv3s:$t,pointsUvs:j.isPoints===!0&&!!N.attributes.uv&&(Et||nt),fog:!!R,useFog:S.fog===!0,fogExp2:R&&R.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:j.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:at,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:jt,useLegacyLights:s._useLegacyLights,decodeVideoTexture:Et&&S.map.isVideoTexture===!0&&Yt.getTransfer(S.map.colorSpace)===Jt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===$e,flipSided:S.side===Fe,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:rt&&S.extensions.derivatives===!0,extensionFragDepth:rt&&S.extensions.fragDepth===!0,extensionDrawBuffers:rt&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:rt&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:rt&&S.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function f(S){const T=[];if(S.shaderID?T.push(S.shaderID):(T.push(S.customVertexShaderID),T.push(S.customFragmentShaderID)),S.defines!==void 0)for(const I in S.defines)T.push(I),T.push(S.defines[I]);return S.isRawShaderMaterial===!1&&(x(T,S),_(T,S),T.push(s.outputColorSpace)),T.push(S.customProgramCacheKey),T.join()}function x(S,T){S.push(T.precision),S.push(T.outputColorSpace),S.push(T.envMapMode),S.push(T.envMapCubeUVHeight),S.push(T.mapUv),S.push(T.alphaMapUv),S.push(T.lightMapUv),S.push(T.aoMapUv),S.push(T.bumpMapUv),S.push(T.normalMapUv),S.push(T.displacementMapUv),S.push(T.emissiveMapUv),S.push(T.metalnessMapUv),S.push(T.roughnessMapUv),S.push(T.anisotropyMapUv),S.push(T.clearcoatMapUv),S.push(T.clearcoatNormalMapUv),S.push(T.clearcoatRoughnessMapUv),S.push(T.iridescenceMapUv),S.push(T.iridescenceThicknessMapUv),S.push(T.sheenColorMapUv),S.push(T.sheenRoughnessMapUv),S.push(T.specularMapUv),S.push(T.specularColorMapUv),S.push(T.specularIntensityMapUv),S.push(T.transmissionMapUv),S.push(T.thicknessMapUv),S.push(T.combine),S.push(T.fogExp2),S.push(T.sizeAttenuation),S.push(T.morphTargetsCount),S.push(T.morphAttributeCount),S.push(T.numDirLights),S.push(T.numPointLights),S.push(T.numSpotLights),S.push(T.numSpotLightMaps),S.push(T.numHemiLights),S.push(T.numRectAreaLights),S.push(T.numDirLightShadows),S.push(T.numPointLightShadows),S.push(T.numSpotLightShadows),S.push(T.numSpotLightShadowsWithMaps),S.push(T.numLightProbes),S.push(T.shadowMapType),S.push(T.toneMapping),S.push(T.numClippingPlanes),S.push(T.numClipIntersection),S.push(T.depthPacking)}function _(S,T){o.disableAll(),T.isWebGL2&&o.enable(0),T.supportsVertexTextures&&o.enable(1),T.instancing&&o.enable(2),T.instancingColor&&o.enable(3),T.matcap&&o.enable(4),T.envMap&&o.enable(5),T.normalMapObjectSpace&&o.enable(6),T.normalMapTangentSpace&&o.enable(7),T.clearcoat&&o.enable(8),T.iridescence&&o.enable(9),T.alphaTest&&o.enable(10),T.vertexColors&&o.enable(11),T.vertexAlphas&&o.enable(12),T.vertexUv1s&&o.enable(13),T.vertexUv2s&&o.enable(14),T.vertexUv3s&&o.enable(15),T.vertexTangents&&o.enable(16),T.anisotropy&&o.enable(17),T.alphaHash&&o.enable(18),T.batching&&o.enable(19),S.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.skinning&&o.enable(4),T.morphTargets&&o.enable(5),T.morphNormals&&o.enable(6),T.morphColors&&o.enable(7),T.premultipliedAlpha&&o.enable(8),T.shadowMapEnabled&&o.enable(9),T.useLegacyLights&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),S.push(o.mask)}function M(S){const T=v[S.type];let I;if(T){const W=ln[T];I=Eh.clone(W.uniforms)}else I=S.uniforms;return I}function w(S,T){let I;for(let W=0,j=c.length;W<j;W++){const R=c[W];if(R.cacheKey===T){I=R,++I.usedTimes;break}}return I===void 0&&(I=new kp(s,T,S,a),c.push(I)),I}function y(S){if(--S.usedTimes===0){const T=c.indexOf(S);c[T]=c[c.length-1],c.pop(),S.destroy()}}function b(S){l.remove(S)}function D(){l.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:M,acquireProgram:w,releaseProgram:y,releaseShaderCache:b,programs:c,dispose:D}}function Wp(){let s=new WeakMap;function t(a){let r=s.get(a);return r===void 0&&(r={},s.set(a,r)),r}function e(a){s.delete(a)}function n(a,r,o){s.get(a)[r]=o}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function Xp(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Pr(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Dr(){const s=[];let t=0;const e=[],n=[],i=[];function a(){t=0,e.length=0,n.length=0,i.length=0}function r(d,u,m,v,g,p){let f=s[t];return f===void 0?(f={id:d.id,object:d,geometry:u,material:m,groupOrder:v,renderOrder:d.renderOrder,z:g,group:p},s[t]=f):(f.id=d.id,f.object=d,f.geometry=u,f.material=m,f.groupOrder=v,f.renderOrder=d.renderOrder,f.z=g,f.group=p),t++,f}function o(d,u,m,v,g,p){const f=r(d,u,m,v,g,p);m.transmission>0?n.push(f):m.transparent===!0?i.push(f):e.push(f)}function l(d,u,m,v,g,p){const f=r(d,u,m,v,g,p);m.transmission>0?n.unshift(f):m.transparent===!0?i.unshift(f):e.unshift(f)}function c(d,u){e.length>1&&e.sort(d||Xp),n.length>1&&n.sort(u||Pr),i.length>1&&i.sort(u||Pr)}function h(){for(let d=t,u=s.length;d<u;d++){const m=s[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:i,init:a,push:o,unshift:l,finish:h,sort:c}}function qp(){let s=new WeakMap;function t(n,i){const a=s.get(n);let r;return a===void 0?(r=new Dr,s.set(n,[r])):i>=a.length?(r=new Dr,a.push(r)):r=a[i],r}function e(){s=new WeakMap}return{get:t,dispose:e}}function Yp(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new vt};break;case"SpotLight":e={position:new U,direction:new U,color:new vt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new vt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new vt,groundColor:new vt};break;case"RectAreaLight":e={color:new vt,position:new U,halfWidth:new U,halfHeight:new U};break}return s[t.id]=e,e}}}function $p(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let jp=0;function Kp(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Zp(s,t){const e=new Yp,n=$p(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new U);const a=new U,r=new Wt,o=new Wt;function l(h,d){let u=0,m=0,v=0;for(let W=0;W<9;W++)i.probe[W].set(0,0,0);let g=0,p=0,f=0,x=0,_=0,M=0,w=0,y=0,b=0,D=0,S=0;h.sort(Kp);const T=d===!0?Math.PI:1;for(let W=0,j=h.length;W<j;W++){const R=h[W],N=R.color,L=R.intensity,z=R.distance,q=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)u+=N.r*L*T,m+=N.g*L*T,v+=N.b*L*T;else if(R.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(R.sh.coefficients[X],L);S++}else if(R.isDirectionalLight){const X=e.get(R);if(X.color.copy(R.color).multiplyScalar(R.intensity*T),R.castShadow){const $=R.shadow,Z=n.get(R);Z.shadowBias=$.bias,Z.shadowNormalBias=$.normalBias,Z.shadowRadius=$.radius,Z.shadowMapSize=$.mapSize,i.directionalShadow[g]=Z,i.directionalShadowMap[g]=q,i.directionalShadowMatrix[g]=R.shadow.matrix,M++}i.directional[g]=X,g++}else if(R.isSpotLight){const X=e.get(R);X.position.setFromMatrixPosition(R.matrixWorld),X.color.copy(N).multiplyScalar(L*T),X.distance=z,X.coneCos=Math.cos(R.angle),X.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),X.decay=R.decay,i.spot[f]=X;const $=R.shadow;if(R.map&&(i.spotLightMap[b]=R.map,b++,$.updateMatrices(R),R.castShadow&&D++),i.spotLightMatrix[f]=$.matrix,R.castShadow){const Z=n.get(R);Z.shadowBias=$.bias,Z.shadowNormalBias=$.normalBias,Z.shadowRadius=$.radius,Z.shadowMapSize=$.mapSize,i.spotShadow[f]=Z,i.spotShadowMap[f]=q,y++}f++}else if(R.isRectAreaLight){const X=e.get(R);X.color.copy(N).multiplyScalar(L),X.halfWidth.set(R.width*.5,0,0),X.halfHeight.set(0,R.height*.5,0),i.rectArea[x]=X,x++}else if(R.isPointLight){const X=e.get(R);if(X.color.copy(R.color).multiplyScalar(R.intensity*T),X.distance=R.distance,X.decay=R.decay,R.castShadow){const $=R.shadow,Z=n.get(R);Z.shadowBias=$.bias,Z.shadowNormalBias=$.normalBias,Z.shadowRadius=$.radius,Z.shadowMapSize=$.mapSize,Z.shadowCameraNear=$.camera.near,Z.shadowCameraFar=$.camera.far,i.pointShadow[p]=Z,i.pointShadowMap[p]=q,i.pointShadowMatrix[p]=R.shadow.matrix,w++}i.point[p]=X,p++}else if(R.isHemisphereLight){const X=e.get(R);X.skyColor.copy(R.color).multiplyScalar(L*T),X.groundColor.copy(R.groundColor).multiplyScalar(L*T),i.hemi[_]=X,_++}}x>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=it.LTC_FLOAT_1,i.rectAreaLTC2=it.LTC_FLOAT_2):(i.rectAreaLTC1=it.LTC_HALF_1,i.rectAreaLTC2=it.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=it.LTC_FLOAT_1,i.rectAreaLTC2=it.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=it.LTC_HALF_1,i.rectAreaLTC2=it.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=u,i.ambient[1]=m,i.ambient[2]=v;const I=i.hash;(I.directionalLength!==g||I.pointLength!==p||I.spotLength!==f||I.rectAreaLength!==x||I.hemiLength!==_||I.numDirectionalShadows!==M||I.numPointShadows!==w||I.numSpotShadows!==y||I.numSpotMaps!==b||I.numLightProbes!==S)&&(i.directional.length=g,i.spot.length=f,i.rectArea.length=x,i.point.length=p,i.hemi.length=_,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=y+b-D,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=D,i.numLightProbes=S,I.directionalLength=g,I.pointLength=p,I.spotLength=f,I.rectAreaLength=x,I.hemiLength=_,I.numDirectionalShadows=M,I.numPointShadows=w,I.numSpotShadows=y,I.numSpotMaps=b,I.numLightProbes=S,i.version=jp++)}function c(h,d){let u=0,m=0,v=0,g=0,p=0;const f=d.matrixWorldInverse;for(let x=0,_=h.length;x<_;x++){const M=h[x];if(M.isDirectionalLight){const w=i.directional[u];w.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(a),w.direction.transformDirection(f),u++}else if(M.isSpotLight){const w=i.spot[v];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(f),w.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(a),w.direction.transformDirection(f),v++}else if(M.isRectAreaLight){const w=i.rectArea[g];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(f),o.identity(),r.copy(M.matrixWorld),r.premultiply(f),o.extractRotation(r),w.halfWidth.set(M.width*.5,0,0),w.halfHeight.set(0,M.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){const w=i.point[m];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(f),m++}else if(M.isHemisphereLight){const w=i.hemi[p];w.direction.setFromMatrixPosition(M.matrixWorld),w.direction.transformDirection(f),p++}}}return{setup:l,setupView:c,state:i}}function Ur(s,t){const e=new Zp(s,t),n=[],i=[];function a(){n.length=0,i.length=0}function r(d){n.push(d)}function o(d){i.push(d)}function l(d){e.setup(n,d)}function c(d){e.setupView(n,d)}return{init:a,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:r,pushShadow:o}}function Jp(s,t){let e=new WeakMap;function n(a,r=0){const o=e.get(a);let l;return o===void 0?(l=new Ur(s,t),e.set(a,[l])):r>=o.length?(l=new Ur(s,t),o.push(l)):l=o[r],l}function i(){e=new WeakMap}return{get:n,dispose:i}}class Qp extends es{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Nc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class t0 extends es{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const e0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,n0=`uniform sampler2D shadow_pass;
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
}`;function i0(s,t,e){let n=new Zs;const i=new Tt,a=new Tt,r=new le,o=new Qp({depthPacking:zc}),l=new t0,c={},h=e.maxTextureSize,d={[wn]:Fe,[Fe]:wn,[$e]:$e},u=new pe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Tt},radius:{value:4}},vertexShader:e0,fragmentShader:n0}),m=u.clone();m.defines.HORIZONTAL_PASS=1;const v=new Se;v.setAttribute("position",new Ne(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new te(v,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tl;let f=this.type;this.render=function(y,b,D){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||y.length===0)return;const S=s.getRenderTarget(),T=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),W=s.state;W.setBlending(Pn),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const j=f!==xn&&this.type===xn,R=f===xn&&this.type!==xn;for(let N=0,L=y.length;N<L;N++){const z=y[N],q=z.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",z,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;i.copy(q.mapSize);const X=q.getFrameExtents();if(i.multiply(X),a.copy(q.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(a.x=Math.floor(h/X.x),i.x=a.x*X.x,q.mapSize.x=a.x),i.y>h&&(a.y=Math.floor(h/X.y),i.y=a.y*X.y,q.mapSize.y=a.y)),q.map===null||j===!0||R===!0){const Z=this.type!==xn?{minFilter:de,magFilter:de}:{};q.map!==null&&q.map.dispose(),q.map=new an(i.x,i.y,Z),q.map.texture.name=z.name+".shadowMap",q.camera.updateProjectionMatrix()}s.setRenderTarget(q.map),s.clear();const $=q.getViewportCount();for(let Z=0;Z<$;Z++){const at=q.getViewport(Z);r.set(a.x*at.x,a.y*at.y,a.x*at.z,a.y*at.w),W.viewport(r),q.updateMatrices(z,Z),n=q.getFrustum(),M(b,D,q.camera,z,this.type)}q.isPointLightShadow!==!0&&this.type===xn&&x(q,D),q.needsUpdate=!1}f=this.type,p.needsUpdate=!1,s.setRenderTarget(S,T,I)};function x(y,b){const D=t.update(g);u.defines.VSM_SAMPLES!==y.blurSamples&&(u.defines.VSM_SAMPLES=y.blurSamples,m.defines.VSM_SAMPLES=y.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new an(i.x,i.y)),u.uniforms.shadow_pass.value=y.map.texture,u.uniforms.resolution.value=y.mapSize,u.uniforms.radius.value=y.radius,s.setRenderTarget(y.mapPass),s.clear(),s.renderBufferDirect(b,null,D,u,g,null),m.uniforms.shadow_pass.value=y.mapPass.texture,m.uniforms.resolution.value=y.mapSize,m.uniforms.radius.value=y.radius,s.setRenderTarget(y.map),s.clear(),s.renderBufferDirect(b,null,D,m,g,null)}function _(y,b,D,S){let T=null;const I=D.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(I!==void 0)T=I;else if(T=D.isPointLight===!0?l:o,s.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const W=T.uuid,j=b.uuid;let R=c[W];R===void 0&&(R={},c[W]=R);let N=R[j];N===void 0&&(N=T.clone(),R[j]=N,b.addEventListener("dispose",w)),T=N}if(T.visible=b.visible,T.wireframe=b.wireframe,S===xn?T.side=b.shadowSide!==null?b.shadowSide:b.side:T.side=b.shadowSide!==null?b.shadowSide:d[b.side],T.alphaMap=b.alphaMap,T.alphaTest=b.alphaTest,T.map=b.map,T.clipShadows=b.clipShadows,T.clippingPlanes=b.clippingPlanes,T.clipIntersection=b.clipIntersection,T.displacementMap=b.displacementMap,T.displacementScale=b.displacementScale,T.displacementBias=b.displacementBias,T.wireframeLinewidth=b.wireframeLinewidth,T.linewidth=b.linewidth,D.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const W=s.properties.get(T);W.light=D}return T}function M(y,b,D,S,T){if(y.visible===!1)return;if(y.layers.test(b.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&T===xn)&&(!y.frustumCulled||n.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,y.matrixWorld);const j=t.update(y),R=y.material;if(Array.isArray(R)){const N=j.groups;for(let L=0,z=N.length;L<z;L++){const q=N[L],X=R[q.materialIndex];if(X&&X.visible){const $=_(y,X,S,T);y.onBeforeShadow(s,y,b,D,j,$,q),s.renderBufferDirect(D,null,j,$,y,q),y.onAfterShadow(s,y,b,D,j,$,q)}}}else if(R.visible){const N=_(y,R,S,T);y.onBeforeShadow(s,y,b,D,j,N,null),s.renderBufferDirect(D,null,j,N,y,null),y.onAfterShadow(s,y,b,D,j,N,null)}}const W=y.children;for(let j=0,R=W.length;j<R;j++)M(W[j],b,D,S,T)}function w(y){y.target.removeEventListener("dispose",w);for(const D in c){const S=c[D],T=y.target.uuid;T in S&&(S[T].dispose(),delete S[T])}}}function s0(s,t,e){const n=e.isWebGL2;function i(){let P=!1;const ot=new le;let rt=null;const bt=new le(0,0,0,0);return{setMask:function(yt){rt!==yt&&!P&&(s.colorMask(yt,yt,yt,yt),rt=yt)},setLocked:function(yt){P=yt},setClear:function(yt,$t,jt,ve,Le){Le===!0&&(yt*=ve,$t*=ve,jt*=ve),ot.set(yt,$t,jt,ve),bt.equals(ot)===!1&&(s.clearColor(yt,$t,jt,ve),bt.copy(ot))},reset:function(){P=!1,rt=null,bt.set(-1,0,0,0)}}}function a(){let P=!1,ot=null,rt=null,bt=null;return{setTest:function(yt){yt?Ut(s.DEPTH_TEST):Et(s.DEPTH_TEST)},setMask:function(yt){ot!==yt&&!P&&(s.depthMask(yt),ot=yt)},setFunc:function(yt){if(rt!==yt){switch(yt){case fc:s.depthFunc(s.NEVER);break;case pc:s.depthFunc(s.ALWAYS);break;case mc:s.depthFunc(s.LESS);break;case Bs:s.depthFunc(s.LEQUAL);break;case gc:s.depthFunc(s.EQUAL);break;case vc:s.depthFunc(s.GEQUAL);break;case _c:s.depthFunc(s.GREATER);break;case xc:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}rt=yt}},setLocked:function(yt){P=yt},setClear:function(yt){bt!==yt&&(s.clearDepth(yt),bt=yt)},reset:function(){P=!1,ot=null,rt=null,bt=null}}}function r(){let P=!1,ot=null,rt=null,bt=null,yt=null,$t=null,jt=null,ve=null,Le=null;return{setTest:function(Kt){P||(Kt?Ut(s.STENCIL_TEST):Et(s.STENCIL_TEST))},setMask:function(Kt){ot!==Kt&&!P&&(s.stencilMask(Kt),ot=Kt)},setFunc:function(Kt,Pe,on){(rt!==Kt||bt!==Pe||yt!==on)&&(s.stencilFunc(Kt,Pe,on),rt=Kt,bt=Pe,yt=on)},setOp:function(Kt,Pe,on){($t!==Kt||jt!==Pe||ve!==on)&&(s.stencilOp(Kt,Pe,on),$t=Kt,jt=Pe,ve=on)},setLocked:function(Kt){P=Kt},setClear:function(Kt){Le!==Kt&&(s.clearStencil(Kt),Le=Kt)},reset:function(){P=!1,ot=null,rt=null,bt=null,yt=null,$t=null,jt=null,ve=null,Le=null}}}const o=new i,l=new a,c=new r,h=new WeakMap,d=new WeakMap;let u={},m={},v=new WeakMap,g=[],p=null,f=!1,x=null,_=null,M=null,w=null,y=null,b=null,D=null,S=new vt(0,0,0),T=0,I=!1,W=null,j=null,R=null,N=null,L=null;const z=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,X=0;const $=s.getParameter(s.VERSION);$.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec($)[1]),q=X>=1):$.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),q=X>=2);let Z=null,at={};const V=s.getParameter(s.SCISSOR_BOX),K=s.getParameter(s.VIEWPORT),st=new le().fromArray(V),_t=new le().fromArray(K);function gt(P,ot,rt,bt){const yt=new Uint8Array(4),$t=s.createTexture();s.bindTexture(P,$t),s.texParameteri(P,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(P,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let jt=0;jt<rt;jt++)n&&(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)?s.texImage3D(ot,0,s.RGBA,1,1,bt,0,s.RGBA,s.UNSIGNED_BYTE,yt):s.texImage2D(ot+jt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,yt);return $t}const Pt={};Pt[s.TEXTURE_2D]=gt(s.TEXTURE_2D,s.TEXTURE_2D,1),Pt[s.TEXTURE_CUBE_MAP]=gt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Pt[s.TEXTURE_2D_ARRAY]=gt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Pt[s.TEXTURE_3D]=gt(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Ut(s.DEPTH_TEST),l.setFunc(Bs),Nt(!1),C(mo),Ut(s.CULL_FACE),ft(Pn);function Ut(P){u[P]!==!0&&(s.enable(P),u[P]=!0)}function Et(P){u[P]!==!1&&(s.disable(P),u[P]=!1)}function Vt(P,ot){return m[P]!==ot?(s.bindFramebuffer(P,ot),m[P]=ot,n&&(P===s.DRAW_FRAMEBUFFER&&(m[s.FRAMEBUFFER]=ot),P===s.FRAMEBUFFER&&(m[s.DRAW_FRAMEBUFFER]=ot)),!0):!1}function O(P,ot){let rt=g,bt=!1;if(P)if(rt=v.get(ot),rt===void 0&&(rt=[],v.set(ot,rt)),P.isWebGLMultipleRenderTargets){const yt=P.texture;if(rt.length!==yt.length||rt[0]!==s.COLOR_ATTACHMENT0){for(let $t=0,jt=yt.length;$t<jt;$t++)rt[$t]=s.COLOR_ATTACHMENT0+$t;rt.length=yt.length,bt=!0}}else rt[0]!==s.COLOR_ATTACHMENT0&&(rt[0]=s.COLOR_ATTACHMENT0,bt=!0);else rt[0]!==s.BACK&&(rt[0]=s.BACK,bt=!0);bt&&(e.isWebGL2?s.drawBuffers(rt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(rt))}function Re(P){return p!==P?(s.useProgram(P),p=P,!0):!1}const Mt={[Wn]:s.FUNC_ADD,[Jl]:s.FUNC_SUBTRACT,[Ql]:s.FUNC_REVERSE_SUBTRACT};if(n)Mt[_o]=s.MIN,Mt[xo]=s.MAX;else{const P=t.get("EXT_blend_minmax");P!==null&&(Mt[_o]=P.MIN_EXT,Mt[xo]=P.MAX_EXT)}const Rt={[tc]:s.ZERO,[ec]:s.ONE,[nc]:s.SRC_COLOR,[ka]:s.SRC_ALPHA,[lc]:s.SRC_ALPHA_SATURATE,[oc]:s.DST_COLOR,[sc]:s.DST_ALPHA,[ic]:s.ONE_MINUS_SRC_COLOR,[Ba]:s.ONE_MINUS_SRC_ALPHA,[rc]:s.ONE_MINUS_DST_COLOR,[ac]:s.ONE_MINUS_DST_ALPHA,[cc]:s.CONSTANT_COLOR,[hc]:s.ONE_MINUS_CONSTANT_COLOR,[uc]:s.CONSTANT_ALPHA,[dc]:s.ONE_MINUS_CONSTANT_ALPHA};function ft(P,ot,rt,bt,yt,$t,jt,ve,Le,Kt){if(P===Pn){f===!0&&(Et(s.BLEND),f=!1);return}if(f===!1&&(Ut(s.BLEND),f=!0),P!==Zl){if(P!==x||Kt!==I){if((_!==Wn||y!==Wn)&&(s.blendEquation(s.FUNC_ADD),_=Wn,y=Wn),Kt)switch(P){case xi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Oa:s.blendFunc(s.ONE,s.ONE);break;case go:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case vo:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case xi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Oa:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case go:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case vo:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}M=null,w=null,b=null,D=null,S.set(0,0,0),T=0,x=P,I=Kt}return}yt=yt||ot,$t=$t||rt,jt=jt||bt,(ot!==_||yt!==y)&&(s.blendEquationSeparate(Mt[ot],Mt[yt]),_=ot,y=yt),(rt!==M||bt!==w||$t!==b||jt!==D)&&(s.blendFuncSeparate(Rt[rt],Rt[bt],Rt[$t],Rt[jt]),M=rt,w=bt,b=$t,D=jt),(ve.equals(S)===!1||Le!==T)&&(s.blendColor(ve.r,ve.g,ve.b,Le),S.copy(ve),T=Le),x=P,I=!1}function ie(P,ot){P.side===$e?Et(s.CULL_FACE):Ut(s.CULL_FACE);let rt=P.side===Fe;ot&&(rt=!rt),Nt(rt),P.blending===xi&&P.transparent===!1?ft(Pn):ft(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),l.setFunc(P.depthFunc),l.setTest(P.depthTest),l.setMask(P.depthWrite),o.setMask(P.colorWrite);const bt=P.stencilWrite;c.setTest(bt),bt&&(c.setMask(P.stencilWriteMask),c.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),c.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),B(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?Ut(s.SAMPLE_ALPHA_TO_COVERAGE):Et(s.SAMPLE_ALPHA_TO_COVERAGE)}function Nt(P){W!==P&&(P?s.frontFace(s.CW):s.frontFace(s.CCW),W=P)}function C(P){P!==$l?(Ut(s.CULL_FACE),P!==j&&(P===mo?s.cullFace(s.BACK):P===jl?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Et(s.CULL_FACE),j=P}function E(P){P!==R&&(q&&s.lineWidth(P),R=P)}function B(P,ot,rt){P?(Ut(s.POLYGON_OFFSET_FILL),(N!==ot||L!==rt)&&(s.polygonOffset(ot,rt),N=ot,L=rt)):Et(s.POLYGON_OFFSET_FILL)}function tt(P){P?Ut(s.SCISSOR_TEST):Et(s.SCISSOR_TEST)}function Q(P){P===void 0&&(P=s.TEXTURE0+z-1),Z!==P&&(s.activeTexture(P),Z=P)}function et(P,ot,rt){rt===void 0&&(Z===null?rt=s.TEXTURE0+z-1:rt=Z);let bt=at[rt];bt===void 0&&(bt={type:void 0,texture:void 0},at[rt]=bt),(bt.type!==P||bt.texture!==ot)&&(Z!==rt&&(s.activeTexture(rt),Z=rt),s.bindTexture(P,ot||Pt[P]),bt.type=P,bt.texture=ot)}function pt(){const P=at[Z];P!==void 0&&P.type!==void 0&&(s.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function lt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ut(){try{s.compressedTexImage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function wt(){try{s.texSubImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function zt(){try{s.texSubImage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function J(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function qt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Ht(){try{s.texStorage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Ct(){try{s.texStorage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function xt(){try{s.texImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function dt(){try{s.texImage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function It(P){st.equals(P)===!1&&(s.scissor(P.x,P.y,P.z,P.w),st.copy(P))}function Xt(P){_t.equals(P)===!1&&(s.viewport(P.x,P.y,P.z,P.w),_t.copy(P))}function ae(P,ot){let rt=d.get(ot);rt===void 0&&(rt=new WeakMap,d.set(ot,rt));let bt=rt.get(P);bt===void 0&&(bt=s.getUniformBlockIndex(ot,P.name),rt.set(P,bt))}function kt(P,ot){const bt=d.get(ot).get(P);h.get(ot)!==bt&&(s.uniformBlockBinding(ot,bt,P.__bindingPointIndex),h.set(ot,bt))}function nt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),u={},Z=null,at={},m={},v=new WeakMap,g=[],p=null,f=!1,x=null,_=null,M=null,w=null,y=null,b=null,D=null,S=new vt(0,0,0),T=0,I=!1,W=null,j=null,R=null,N=null,L=null,st.set(0,0,s.canvas.width,s.canvas.height),_t.set(0,0,s.canvas.width,s.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Ut,disable:Et,bindFramebuffer:Vt,drawBuffers:O,useProgram:Re,setBlending:ft,setMaterial:ie,setFlipSided:Nt,setCullFace:C,setLineWidth:E,setPolygonOffset:B,setScissorTest:tt,activeTexture:Q,bindTexture:et,unbindTexture:pt,compressedTexImage2D:lt,compressedTexImage3D:ut,texImage2D:xt,texImage3D:dt,updateUBOMapping:ae,uniformBlockBinding:kt,texStorage2D:Ht,texStorage3D:Ct,texSubImage2D:wt,texSubImage3D:zt,compressedTexSubImage2D:J,compressedTexSubImage3D:qt,scissor:It,viewport:Xt,reset:nt}}function a0(s,t,e,n,i,a,r){const o=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let d;const u=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(C,E){return m?new OffscreenCanvas(C,E):Ys("canvas")}function g(C,E,B,tt){let Q=1;if((C.width>tt||C.height>tt)&&(Q=tt/Math.max(C.width,C.height)),Q<1||E===!0)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap){const et=E?qs:Math.floor,pt=et(Q*C.width),lt=et(Q*C.height);d===void 0&&(d=v(pt,lt));const ut=B?v(pt,lt):d;return ut.width=pt,ut.height=lt,ut.getContext("2d").drawImage(C,0,0,pt,lt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+C.width+"x"+C.height+") to ("+pt+"x"+lt+")."),ut}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+C.width+"x"+C.height+")."),C;return C}function p(C){return Xa(C.width)&&Xa(C.height)}function f(C){return o?!1:C.wrapS!==We||C.wrapT!==We||C.minFilter!==de&&C.minFilter!==ee}function x(C,E){return C.generateMipmaps&&E&&C.minFilter!==de&&C.minFilter!==ee}function _(C){s.generateMipmap(C)}function M(C,E,B,tt,Q=!1){if(o===!1)return E;if(C!==null){if(s[C]!==void 0)return s[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let et=E;if(E===s.RED&&(B===s.FLOAT&&(et=s.R32F),B===s.HALF_FLOAT&&(et=s.R16F),B===s.UNSIGNED_BYTE&&(et=s.R8)),E===s.RED_INTEGER&&(B===s.UNSIGNED_BYTE&&(et=s.R8UI),B===s.UNSIGNED_SHORT&&(et=s.R16UI),B===s.UNSIGNED_INT&&(et=s.R32UI),B===s.BYTE&&(et=s.R8I),B===s.SHORT&&(et=s.R16I),B===s.INT&&(et=s.R32I)),E===s.RG&&(B===s.FLOAT&&(et=s.RG32F),B===s.HALF_FLOAT&&(et=s.RG16F),B===s.UNSIGNED_BYTE&&(et=s.RG8)),E===s.RGBA){const pt=Q?Hs:Yt.getTransfer(tt);B===s.FLOAT&&(et=s.RGBA32F),B===s.HALF_FLOAT&&(et=s.RGBA16F),B===s.UNSIGNED_BYTE&&(et=pt===Jt?s.SRGB8_ALPHA8:s.RGBA8),B===s.UNSIGNED_SHORT_4_4_4_4&&(et=s.RGBA4),B===s.UNSIGNED_SHORT_5_5_5_1&&(et=s.RGB5_A1)}return(et===s.R16F||et===s.R32F||et===s.RG16F||et===s.RG32F||et===s.RGBA16F||et===s.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function w(C,E,B){return x(C,B)===!0||C.isFramebufferTexture&&C.minFilter!==de&&C.minFilter!==ee?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function y(C){return C===de||C===Mo||C===sa?s.NEAREST:s.LINEAR}function b(C){const E=C.target;E.removeEventListener("dispose",b),S(E),E.isVideoTexture&&h.delete(E)}function D(C){const E=C.target;E.removeEventListener("dispose",D),I(E)}function S(C){const E=n.get(C);if(E.__webglInit===void 0)return;const B=C.source,tt=u.get(B);if(tt){const Q=tt[E.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&T(C),Object.keys(tt).length===0&&u.delete(B)}n.remove(C)}function T(C){const E=n.get(C);s.deleteTexture(E.__webglTexture);const B=C.source,tt=u.get(B);delete tt[E.__cacheKey],r.memory.textures--}function I(C){const E=C.texture,B=n.get(C),tt=n.get(E);if(tt.__webglTexture!==void 0&&(s.deleteTexture(tt.__webglTexture),r.memory.textures--),C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(B.__webglFramebuffer[Q]))for(let et=0;et<B.__webglFramebuffer[Q].length;et++)s.deleteFramebuffer(B.__webglFramebuffer[Q][et]);else s.deleteFramebuffer(B.__webglFramebuffer[Q]);B.__webglDepthbuffer&&s.deleteRenderbuffer(B.__webglDepthbuffer[Q])}else{if(Array.isArray(B.__webglFramebuffer))for(let Q=0;Q<B.__webglFramebuffer.length;Q++)s.deleteFramebuffer(B.__webglFramebuffer[Q]);else s.deleteFramebuffer(B.__webglFramebuffer);if(B.__webglDepthbuffer&&s.deleteRenderbuffer(B.__webglDepthbuffer),B.__webglMultisampledFramebuffer&&s.deleteFramebuffer(B.__webglMultisampledFramebuffer),B.__webglColorRenderbuffer)for(let Q=0;Q<B.__webglColorRenderbuffer.length;Q++)B.__webglColorRenderbuffer[Q]&&s.deleteRenderbuffer(B.__webglColorRenderbuffer[Q]);B.__webglDepthRenderbuffer&&s.deleteRenderbuffer(B.__webglDepthRenderbuffer)}if(C.isWebGLMultipleRenderTargets)for(let Q=0,et=E.length;Q<et;Q++){const pt=n.get(E[Q]);pt.__webglTexture&&(s.deleteTexture(pt.__webglTexture),r.memory.textures--),n.remove(E[Q])}n.remove(E),n.remove(C)}let W=0;function j(){W=0}function R(){const C=W;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),W+=1,C}function N(C){const E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function L(C,E){const B=n.get(C);if(C.isVideoTexture&&ie(C),C.isRenderTargetTexture===!1&&C.version>0&&B.__version!==C.version){const tt=C.image;if(tt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{st(B,C,E);return}}e.bindTexture(s.TEXTURE_2D,B.__webglTexture,s.TEXTURE0+E)}function z(C,E){const B=n.get(C);if(C.version>0&&B.__version!==C.version){st(B,C,E);return}e.bindTexture(s.TEXTURE_2D_ARRAY,B.__webglTexture,s.TEXTURE0+E)}function q(C,E){const B=n.get(C);if(C.version>0&&B.__version!==C.version){st(B,C,E);return}e.bindTexture(s.TEXTURE_3D,B.__webglTexture,s.TEXTURE0+E)}function X(C,E){const B=n.get(C);if(C.version>0&&B.__version!==C.version){_t(B,C,E);return}e.bindTexture(s.TEXTURE_CUBE_MAP,B.__webglTexture,s.TEXTURE0+E)}const $={[Ei]:s.REPEAT,[We]:s.CLAMP_TO_EDGE,[Va]:s.MIRRORED_REPEAT},Z={[de]:s.NEAREST,[Mo]:s.NEAREST_MIPMAP_NEAREST,[sa]:s.NEAREST_MIPMAP_LINEAR,[ee]:s.LINEAR,[Cc]:s.LINEAR_MIPMAP_NEAREST,[jn]:s.LINEAR_MIPMAP_LINEAR},at={[Bc]:s.NEVER,[qc]:s.ALWAYS,[Gc]:s.LESS,[ul]:s.LEQUAL,[Hc]:s.EQUAL,[Xc]:s.GEQUAL,[Vc]:s.GREATER,[Wc]:s.NOTEQUAL};function V(C,E,B){if(B?(s.texParameteri(C,s.TEXTURE_WRAP_S,$[E.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,$[E.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,$[E.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,Z[E.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,Z[E.minFilter])):(s.texParameteri(C,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(C,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(E.wrapS!==We||E.wrapT!==We)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(C,s.TEXTURE_MAG_FILTER,y(E.magFilter)),s.texParameteri(C,s.TEXTURE_MIN_FILTER,y(E.minFilter)),E.minFilter!==de&&E.minFilter!==ee&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,at[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const tt=t.get("EXT_texture_filter_anisotropic");if(E.magFilter===de||E.minFilter!==sa&&E.minFilter!==jn||E.type===cn&&t.has("OES_texture_float_linear")===!1||o===!1&&E.type===Un&&t.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||n.get(E).__currentAnisotropy)&&(s.texParameterf(C,tt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,i.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy)}}function K(C,E){let B=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",b));const tt=E.source;let Q=u.get(tt);Q===void 0&&(Q={},u.set(tt,Q));const et=N(E);if(et!==C.__cacheKey){Q[et]===void 0&&(Q[et]={texture:s.createTexture(),usedTimes:0},r.memory.textures++,B=!0),Q[et].usedTimes++;const pt=Q[C.__cacheKey];pt!==void 0&&(Q[C.__cacheKey].usedTimes--,pt.usedTimes===0&&T(E)),C.__cacheKey=et,C.__webglTexture=Q[et].texture}return B}function st(C,E,B){let tt=s.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(tt=s.TEXTURE_2D_ARRAY),E.isData3DTexture&&(tt=s.TEXTURE_3D);const Q=K(C,E),et=E.source;e.bindTexture(tt,C.__webglTexture,s.TEXTURE0+B);const pt=n.get(et);if(et.version!==pt.__version||Q===!0){e.activeTexture(s.TEXTURE0+B);const lt=Yt.getPrimaries(Yt.workingColorSpace),ut=E.colorSpace===je?null:Yt.getPrimaries(E.colorSpace),wt=E.colorSpace===je||lt===ut?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);const zt=f(E)&&p(E.image)===!1;let J=g(E.image,zt,!1,i.maxTextureSize);J=Nt(E,J);const qt=p(J)||o,Ht=a.convert(E.format,E.colorSpace);let Ct=a.convert(E.type),xt=M(E.internalFormat,Ht,Ct,E.colorSpace,E.isVideoTexture);V(tt,E,qt);let dt;const It=E.mipmaps,Xt=o&&E.isVideoTexture!==!0&&xt!==cl,ae=pt.__version===void 0||Q===!0,kt=w(E,J,qt);if(E.isDepthTexture)xt=s.DEPTH_COMPONENT,o?E.type===cn?xt=s.DEPTH_COMPONENT32F:E.type===yn?xt=s.DEPTH_COMPONENT24:E.type===qn?xt=s.DEPTH24_STENCIL8:xt=s.DEPTH_COMPONENT16:E.type===cn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===Yn&&xt===s.DEPTH_COMPONENT&&E.type!==Za&&E.type!==yn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=yn,Ct=a.convert(E.type)),E.format===bi&&xt===s.DEPTH_COMPONENT&&(xt=s.DEPTH_STENCIL,E.type!==qn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=qn,Ct=a.convert(E.type))),ae&&(Xt?e.texStorage2D(s.TEXTURE_2D,1,xt,J.width,J.height):e.texImage2D(s.TEXTURE_2D,0,xt,J.width,J.height,0,Ht,Ct,null));else if(E.isDataTexture)if(It.length>0&&qt){Xt&&ae&&e.texStorage2D(s.TEXTURE_2D,kt,xt,It[0].width,It[0].height);for(let nt=0,P=It.length;nt<P;nt++)dt=It[nt],Xt?e.texSubImage2D(s.TEXTURE_2D,nt,0,0,dt.width,dt.height,Ht,Ct,dt.data):e.texImage2D(s.TEXTURE_2D,nt,xt,dt.width,dt.height,0,Ht,Ct,dt.data);E.generateMipmaps=!1}else Xt?(ae&&e.texStorage2D(s.TEXTURE_2D,kt,xt,J.width,J.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,J.width,J.height,Ht,Ct,J.data)):e.texImage2D(s.TEXTURE_2D,0,xt,J.width,J.height,0,Ht,Ct,J.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Xt&&ae&&e.texStorage3D(s.TEXTURE_2D_ARRAY,kt,xt,It[0].width,It[0].height,J.depth);for(let nt=0,P=It.length;nt<P;nt++)dt=It[nt],E.format!==Oe?Ht!==null?Xt?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,nt,0,0,0,dt.width,dt.height,J.depth,Ht,dt.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,nt,xt,dt.width,dt.height,J.depth,0,dt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xt?e.texSubImage3D(s.TEXTURE_2D_ARRAY,nt,0,0,0,dt.width,dt.height,J.depth,Ht,Ct,dt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,nt,xt,dt.width,dt.height,J.depth,0,Ht,Ct,dt.data)}else{Xt&&ae&&e.texStorage2D(s.TEXTURE_2D,kt,xt,It[0].width,It[0].height);for(let nt=0,P=It.length;nt<P;nt++)dt=It[nt],E.format!==Oe?Ht!==null?Xt?e.compressedTexSubImage2D(s.TEXTURE_2D,nt,0,0,dt.width,dt.height,Ht,dt.data):e.compressedTexImage2D(s.TEXTURE_2D,nt,xt,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xt?e.texSubImage2D(s.TEXTURE_2D,nt,0,0,dt.width,dt.height,Ht,Ct,dt.data):e.texImage2D(s.TEXTURE_2D,nt,xt,dt.width,dt.height,0,Ht,Ct,dt.data)}else if(E.isDataArrayTexture)Xt?(ae&&e.texStorage3D(s.TEXTURE_2D_ARRAY,kt,xt,J.width,J.height,J.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,Ht,Ct,J.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,xt,J.width,J.height,J.depth,0,Ht,Ct,J.data);else if(E.isData3DTexture)Xt?(ae&&e.texStorage3D(s.TEXTURE_3D,kt,xt,J.width,J.height,J.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,Ht,Ct,J.data)):e.texImage3D(s.TEXTURE_3D,0,xt,J.width,J.height,J.depth,0,Ht,Ct,J.data);else if(E.isFramebufferTexture){if(ae)if(Xt)e.texStorage2D(s.TEXTURE_2D,kt,xt,J.width,J.height);else{let nt=J.width,P=J.height;for(let ot=0;ot<kt;ot++)e.texImage2D(s.TEXTURE_2D,ot,xt,nt,P,0,Ht,Ct,null),nt>>=1,P>>=1}}else if(It.length>0&&qt){Xt&&ae&&e.texStorage2D(s.TEXTURE_2D,kt,xt,It[0].width,It[0].height);for(let nt=0,P=It.length;nt<P;nt++)dt=It[nt],Xt?e.texSubImage2D(s.TEXTURE_2D,nt,0,0,Ht,Ct,dt):e.texImage2D(s.TEXTURE_2D,nt,xt,Ht,Ct,dt);E.generateMipmaps=!1}else Xt?(ae&&e.texStorage2D(s.TEXTURE_2D,kt,xt,J.width,J.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,Ht,Ct,J)):e.texImage2D(s.TEXTURE_2D,0,xt,Ht,Ct,J);x(E,qt)&&_(tt),pt.__version=et.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function _t(C,E,B){if(E.image.length!==6)return;const tt=K(C,E),Q=E.source;e.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+B);const et=n.get(Q);if(Q.version!==et.__version||tt===!0){e.activeTexture(s.TEXTURE0+B);const pt=Yt.getPrimaries(Yt.workingColorSpace),lt=E.colorSpace===je?null:Yt.getPrimaries(E.colorSpace),ut=E.colorSpace===je||pt===lt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);const wt=E.isCompressedTexture||E.image[0].isCompressedTexture,zt=E.image[0]&&E.image[0].isDataTexture,J=[];for(let nt=0;nt<6;nt++)!wt&&!zt?J[nt]=g(E.image[nt],!1,!0,i.maxCubemapSize):J[nt]=zt?E.image[nt].image:E.image[nt],J[nt]=Nt(E,J[nt]);const qt=J[0],Ht=p(qt)||o,Ct=a.convert(E.format,E.colorSpace),xt=a.convert(E.type),dt=M(E.internalFormat,Ct,xt,E.colorSpace),It=o&&E.isVideoTexture!==!0,Xt=et.__version===void 0||tt===!0;let ae=w(E,qt,Ht);V(s.TEXTURE_CUBE_MAP,E,Ht);let kt;if(wt){It&&Xt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,ae,dt,qt.width,qt.height);for(let nt=0;nt<6;nt++){kt=J[nt].mipmaps;for(let P=0;P<kt.length;P++){const ot=kt[P];E.format!==Oe?Ct!==null?It?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,0,0,ot.width,ot.height,Ct,ot.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,dt,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):It?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,0,0,ot.width,ot.height,Ct,xt,ot.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,dt,ot.width,ot.height,0,Ct,xt,ot.data)}}}else{kt=E.mipmaps,It&&Xt&&(kt.length>0&&ae++,e.texStorage2D(s.TEXTURE_CUBE_MAP,ae,dt,J[0].width,J[0].height));for(let nt=0;nt<6;nt++)if(zt){It?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,J[nt].width,J[nt].height,Ct,xt,J[nt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,dt,J[nt].width,J[nt].height,0,Ct,xt,J[nt].data);for(let P=0;P<kt.length;P++){const rt=kt[P].image[nt].image;It?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,0,0,rt.width,rt.height,Ct,xt,rt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,dt,rt.width,rt.height,0,Ct,xt,rt.data)}}else{It?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,Ct,xt,J[nt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,dt,Ct,xt,J[nt]);for(let P=0;P<kt.length;P++){const ot=kt[P];It?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,0,0,Ct,xt,ot.image[nt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,dt,Ct,xt,ot.image[nt])}}}x(E,Ht)&&_(s.TEXTURE_CUBE_MAP),et.__version=Q.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function gt(C,E,B,tt,Q,et){const pt=a.convert(B.format,B.colorSpace),lt=a.convert(B.type),ut=M(B.internalFormat,pt,lt,B.colorSpace);if(!n.get(E).__hasExternalTextures){const zt=Math.max(1,E.width>>et),J=Math.max(1,E.height>>et);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?e.texImage3D(Q,et,ut,zt,J,E.depth,0,pt,lt,null):e.texImage2D(Q,et,ut,zt,J,0,pt,lt,null)}e.bindFramebuffer(s.FRAMEBUFFER,C),ft(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,tt,Q,n.get(B).__webglTexture,0,Rt(E)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,tt,Q,n.get(B).__webglTexture,et),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Pt(C,E,B){if(s.bindRenderbuffer(s.RENDERBUFFER,C),E.depthBuffer&&!E.stencilBuffer){let tt=o===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(B||ft(E)){const Q=E.depthTexture;Q&&Q.isDepthTexture&&(Q.type===cn?tt=s.DEPTH_COMPONENT32F:Q.type===yn&&(tt=s.DEPTH_COMPONENT24));const et=Rt(E);ft(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,et,tt,E.width,E.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,et,tt,E.width,E.height)}else s.renderbufferStorage(s.RENDERBUFFER,tt,E.width,E.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,C)}else if(E.depthBuffer&&E.stencilBuffer){const tt=Rt(E);B&&ft(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,tt,s.DEPTH24_STENCIL8,E.width,E.height):ft(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,tt,s.DEPTH24_STENCIL8,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,E.width,E.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,C)}else{const tt=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let Q=0;Q<tt.length;Q++){const et=tt[Q],pt=a.convert(et.format,et.colorSpace),lt=a.convert(et.type),ut=M(et.internalFormat,pt,lt,et.colorSpace),wt=Rt(E);B&&ft(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,wt,ut,E.width,E.height):ft(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,wt,ut,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,ut,E.width,E.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ut(C,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),L(E.depthTexture,0);const tt=n.get(E.depthTexture).__webglTexture,Q=Rt(E);if(E.depthTexture.format===Yn)ft(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,tt,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,tt,0);else if(E.depthTexture.format===bi)ft(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,tt,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function Et(C){const E=n.get(C),B=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!E.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Ut(E.__webglFramebuffer,C)}else if(B){E.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)e.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer[tt]),E.__webglDepthbuffer[tt]=s.createRenderbuffer(),Pt(E.__webglDepthbuffer[tt],C,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=s.createRenderbuffer(),Pt(E.__webglDepthbuffer,C,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function Vt(C,E,B){const tt=n.get(C);E!==void 0&&gt(tt.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),B!==void 0&&Et(C)}function O(C){const E=C.texture,B=n.get(C),tt=n.get(E);C.addEventListener("dispose",D),C.isWebGLMultipleRenderTargets!==!0&&(tt.__webglTexture===void 0&&(tt.__webglTexture=s.createTexture()),tt.__version=E.version,r.memory.textures++);const Q=C.isWebGLCubeRenderTarget===!0,et=C.isWebGLMultipleRenderTargets===!0,pt=p(C)||o;if(Q){B.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(o&&E.mipmaps&&E.mipmaps.length>0){B.__webglFramebuffer[lt]=[];for(let ut=0;ut<E.mipmaps.length;ut++)B.__webglFramebuffer[lt][ut]=s.createFramebuffer()}else B.__webglFramebuffer[lt]=s.createFramebuffer()}else{if(o&&E.mipmaps&&E.mipmaps.length>0){B.__webglFramebuffer=[];for(let lt=0;lt<E.mipmaps.length;lt++)B.__webglFramebuffer[lt]=s.createFramebuffer()}else B.__webglFramebuffer=s.createFramebuffer();if(et)if(i.drawBuffers){const lt=C.texture;for(let ut=0,wt=lt.length;ut<wt;ut++){const zt=n.get(lt[ut]);zt.__webglTexture===void 0&&(zt.__webglTexture=s.createTexture(),r.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&C.samples>0&&ft(C)===!1){const lt=et?E:[E];B.__webglMultisampledFramebuffer=s.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let ut=0;ut<lt.length;ut++){const wt=lt[ut];B.__webglColorRenderbuffer[ut]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,B.__webglColorRenderbuffer[ut]);const zt=a.convert(wt.format,wt.colorSpace),J=a.convert(wt.type),qt=M(wt.internalFormat,zt,J,wt.colorSpace,C.isXRRenderTarget===!0),Ht=Rt(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ht,qt,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,B.__webglColorRenderbuffer[ut])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(B.__webglDepthRenderbuffer=s.createRenderbuffer(),Pt(B.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){e.bindTexture(s.TEXTURE_CUBE_MAP,tt.__webglTexture),V(s.TEXTURE_CUBE_MAP,E,pt);for(let lt=0;lt<6;lt++)if(o&&E.mipmaps&&E.mipmaps.length>0)for(let ut=0;ut<E.mipmaps.length;ut++)gt(B.__webglFramebuffer[lt][ut],C,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+lt,ut);else gt(B.__webglFramebuffer[lt],C,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);x(E,pt)&&_(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(et){const lt=C.texture;for(let ut=0,wt=lt.length;ut<wt;ut++){const zt=lt[ut],J=n.get(zt);e.bindTexture(s.TEXTURE_2D,J.__webglTexture),V(s.TEXTURE_2D,zt,pt),gt(B.__webglFramebuffer,C,zt,s.COLOR_ATTACHMENT0+ut,s.TEXTURE_2D,0),x(zt,pt)&&_(s.TEXTURE_2D)}e.unbindTexture()}else{let lt=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(o?lt=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(lt,tt.__webglTexture),V(lt,E,pt),o&&E.mipmaps&&E.mipmaps.length>0)for(let ut=0;ut<E.mipmaps.length;ut++)gt(B.__webglFramebuffer[ut],C,E,s.COLOR_ATTACHMENT0,lt,ut);else gt(B.__webglFramebuffer,C,E,s.COLOR_ATTACHMENT0,lt,0);x(E,pt)&&_(lt),e.unbindTexture()}C.depthBuffer&&Et(C)}function Re(C){const E=p(C)||o,B=C.isWebGLMultipleRenderTargets===!0?C.texture:[C.texture];for(let tt=0,Q=B.length;tt<Q;tt++){const et=B[tt];if(x(et,E)){const pt=C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,lt=n.get(et).__webglTexture;e.bindTexture(pt,lt),_(pt),e.unbindTexture()}}}function Mt(C){if(o&&C.samples>0&&ft(C)===!1){const E=C.isWebGLMultipleRenderTargets?C.texture:[C.texture],B=C.width,tt=C.height;let Q=s.COLOR_BUFFER_BIT;const et=[],pt=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,lt=n.get(C),ut=C.isWebGLMultipleRenderTargets===!0;if(ut)for(let wt=0;wt<E.length;wt++)e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,lt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,lt.__webglFramebuffer);for(let wt=0;wt<E.length;wt++){et.push(s.COLOR_ATTACHMENT0+wt),C.depthBuffer&&et.push(pt);const zt=lt.__ignoreDepthValues!==void 0?lt.__ignoreDepthValues:!1;if(zt===!1&&(C.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),ut&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,lt.__webglColorRenderbuffer[wt]),zt===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[pt]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[pt])),ut){const J=n.get(E[wt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,J,0)}s.blitFramebuffer(0,0,B,tt,0,0,B,tt,Q,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,et)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ut)for(let wt=0;wt<E.length;wt++){e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.RENDERBUFFER,lt.__webglColorRenderbuffer[wt]);const zt=n.get(E[wt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.TEXTURE_2D,zt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,lt.__webglMultisampledFramebuffer)}}function Rt(C){return Math.min(i.maxSamples,C.samples)}function ft(C){const E=n.get(C);return o&&C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function ie(C){const E=r.render.frame;h.get(C)!==E&&(h.set(C,E),C.update())}function Nt(C,E){const B=C.colorSpace,tt=C.format,Q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||C.format===Wa||B!==En&&B!==je&&(Yt.getTransfer(B)===Jt?o===!1?t.has("EXT_sRGB")===!0&&tt===Oe?(C.format=Wa,C.minFilter=ee,C.generateMipmaps=!1):E=fl.sRGBToLinear(E):(tt!==Oe||Q!==Ke)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),E}this.allocateTextureUnit=R,this.resetTextureUnits=j,this.setTexture2D=L,this.setTexture2DArray=z,this.setTexture3D=q,this.setTextureCube=X,this.rebindTextures=Vt,this.setupRenderTarget=O,this.updateRenderTargetMipmap=Re,this.updateMultisampleRenderTarget=Mt,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=ft}function o0(s,t,e){const n=e.isWebGL2;function i(a,r=je){let o;const l=Yt.getTransfer(r);if(a===Ke)return s.UNSIGNED_BYTE;if(a===sl)return s.UNSIGNED_SHORT_4_4_4_4;if(a===al)return s.UNSIGNED_SHORT_5_5_5_1;if(a===Rc)return s.BYTE;if(a===Lc)return s.SHORT;if(a===Za)return s.UNSIGNED_SHORT;if(a===il)return s.INT;if(a===yn)return s.UNSIGNED_INT;if(a===cn)return s.FLOAT;if(a===Un)return n?s.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(a===Pc)return s.ALPHA;if(a===Oe)return s.RGBA;if(a===Dc)return s.LUMINANCE;if(a===Uc)return s.LUMINANCE_ALPHA;if(a===Yn)return s.DEPTH_COMPONENT;if(a===bi)return s.DEPTH_STENCIL;if(a===Wa)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(a===Gs)return s.RED;if(a===ol)return s.RED_INTEGER;if(a===Ic)return s.RG;if(a===rl)return s.RG_INTEGER;if(a===ll)return s.RGBA_INTEGER;if(a===aa||a===oa||a===ra||a===la)if(l===Jt)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(a===aa)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(a===oa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(a===ra)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(a===la)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(a===aa)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(a===oa)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(a===ra)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(a===la)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(a===yo||a===So||a===wo||a===Eo)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(a===yo)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(a===So)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(a===wo)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(a===Eo)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(a===cl)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(a===bo||a===To)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(a===bo)return l===Jt?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(a===To)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(a===Ao||a===Co||a===Ro||a===Lo||a===Po||a===Do||a===Uo||a===Io||a===Fo||a===No||a===zo||a===Oo||a===ko||a===Bo)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(a===Ao)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(a===Co)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(a===Ro)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(a===Lo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(a===Po)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(a===Do)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(a===Uo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(a===Io)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(a===Fo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(a===No)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(a===zo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(a===Oo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(a===ko)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(a===Bo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(a===ca||a===Go||a===Ho)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(a===ca)return l===Jt?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(a===Go)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(a===Ho)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(a===Fc||a===Vo||a===Wo||a===Xo)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(a===ca)return o.COMPRESSED_RED_RGTC1_EXT;if(a===Vo)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(a===Wo)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(a===Xo)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return a===qn?n?s.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):s[a]!==void 0?s[a]:null}return{convert:i}}class r0 extends Ye{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class nn extends Be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const l0={type:"move"};class Da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(const g of t.hand.values()){const p=e.getJointPose(g,n),f=this._getHandJoint(c,g);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),m=.02,v=.005;c.inputState.pinching&&u>m+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=m-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&a!==null&&(i=a),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(l0)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new nn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class c0 extends Ci{constructor(t,e){super();const n=this;let i=null,a=1,r=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,m=null,v=null;const g=e.getContextAttributes();let p=null,f=null;const x=[],_=[],M=new Tt;let w=null;const y=new Ye;y.layers.enable(1),y.viewport=new le;const b=new Ye;b.layers.enable(2),b.viewport=new le;const D=[y,b],S=new r0;S.layers.enable(1),S.layers.enable(2);let T=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let K=x[V];return K===void 0&&(K=new Da,x[V]=K),K.getTargetRaySpace()},this.getControllerGrip=function(V){let K=x[V];return K===void 0&&(K=new Da,x[V]=K),K.getGripSpace()},this.getHand=function(V){let K=x[V];return K===void 0&&(K=new Da,x[V]=K),K.getHandSpace()};function W(V){const K=_.indexOf(V.inputSource);if(K===-1)return;const st=x[K];st!==void 0&&(st.update(V.inputSource,V.frame,c||r),st.dispatchEvent({type:V.type,data:V.inputSource}))}function j(){i.removeEventListener("select",W),i.removeEventListener("selectstart",W),i.removeEventListener("selectend",W),i.removeEventListener("squeeze",W),i.removeEventListener("squeezestart",W),i.removeEventListener("squeezeend",W),i.removeEventListener("end",j),i.removeEventListener("inputsourceschange",R);for(let V=0;V<x.length;V++){const K=_[V];K!==null&&(_[V]=null,x[V].disconnect(K))}T=null,I=null,t.setRenderTarget(p),m=null,u=null,d=null,i=null,f=null,at.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){a=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return d},this.getFrame=function(){return v},this.getSession=function(){return i},this.setSession=async function(V){if(i=V,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",W),i.addEventListener("selectstart",W),i.addEventListener("selectend",W),i.addEventListener("squeeze",W),i.addEventListener("squeezestart",W),i.addEventListener("squeezeend",W),i.addEventListener("end",j),i.addEventListener("inputsourceschange",R),g.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(M),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const K={antialias:i.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};m=new XRWebGLLayer(i,e,K),i.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),f=new an(m.framebufferWidth,m.framebufferHeight,{format:Oe,type:Ke,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let K=null,st=null,_t=null;g.depth&&(_t=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,K=g.stencil?bi:Yn,st=g.stencil?qn:yn);const gt={colorFormat:e.RGBA8,depthFormat:_t,scaleFactor:a};d=new XRWebGLBinding(i,e),u=d.createProjectionLayer(gt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),f=new an(u.textureWidth,u.textureHeight,{format:Oe,type:Ke,depthTexture:new so(u.textureWidth,u.textureHeight,st,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const Pt=t.properties.get(f);Pt.__ignoreDepthValues=u.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await i.requestReferenceSpace(o),at.setContext(i),at.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function R(V){for(let K=0;K<V.removed.length;K++){const st=V.removed[K],_t=_.indexOf(st);_t>=0&&(_[_t]=null,x[_t].disconnect(st))}for(let K=0;K<V.added.length;K++){const st=V.added[K];let _t=_.indexOf(st);if(_t===-1){for(let Pt=0;Pt<x.length;Pt++)if(Pt>=_.length){_.push(st),_t=Pt;break}else if(_[Pt]===null){_[Pt]=st,_t=Pt;break}if(_t===-1)break}const gt=x[_t];gt&&gt.connect(st)}}const N=new U,L=new U;function z(V,K,st){N.setFromMatrixPosition(K.matrixWorld),L.setFromMatrixPosition(st.matrixWorld);const _t=N.distanceTo(L),gt=K.projectionMatrix.elements,Pt=st.projectionMatrix.elements,Ut=gt[14]/(gt[10]-1),Et=gt[14]/(gt[10]+1),Vt=(gt[9]+1)/gt[5],O=(gt[9]-1)/gt[5],Re=(gt[8]-1)/gt[0],Mt=(Pt[8]+1)/Pt[0],Rt=Ut*Re,ft=Ut*Mt,ie=_t/(-Re+Mt),Nt=ie*-Re;K.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Nt),V.translateZ(ie),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert();const C=Ut+ie,E=Et+ie,B=Rt-Nt,tt=ft+(_t-Nt),Q=Vt*Et/E*C,et=O*Et/E*C;V.projectionMatrix.makePerspective(B,tt,Q,et,C,E),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}function q(V,K){K===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(K.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(i===null)return;S.near=b.near=y.near=V.near,S.far=b.far=y.far=V.far,(T!==S.near||I!==S.far)&&(i.updateRenderState({depthNear:S.near,depthFar:S.far}),T=S.near,I=S.far);const K=V.parent,st=S.cameras;q(S,K);for(let _t=0;_t<st.length;_t++)q(st[_t],K);st.length===2?z(S,y,b):S.projectionMatrix.copy(y.projectionMatrix),X(V,S,K)};function X(V,K,st){st===null?V.matrix.copy(K.matrixWorld):(V.matrix.copy(st.matrixWorld),V.matrix.invert(),V.matrix.multiply(K.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(K.projectionMatrix),V.projectionMatrixInverse.copy(K.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Ki*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(u===null&&m===null))return l},this.setFoveation=function(V){l=V,u!==null&&(u.fixedFoveation=V),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=V)};let $=null;function Z(V,K){if(h=K.getViewerPose(c||r),v=K,h!==null){const st=h.views;m!==null&&(t.setRenderTargetFramebuffer(f,m.framebuffer),t.setRenderTarget(f));let _t=!1;st.length!==S.cameras.length&&(S.cameras.length=0,_t=!0);for(let gt=0;gt<st.length;gt++){const Pt=st[gt];let Ut=null;if(m!==null)Ut=m.getViewport(Pt);else{const Vt=d.getViewSubImage(u,Pt);Ut=Vt.viewport,gt===0&&(t.setRenderTargetTextures(f,Vt.colorTexture,u.ignoreDepthValues?void 0:Vt.depthStencilTexture),t.setRenderTarget(f))}let Et=D[gt];Et===void 0&&(Et=new Ye,Et.layers.enable(gt),Et.viewport=new le,D[gt]=Et),Et.matrix.fromArray(Pt.transform.matrix),Et.matrix.decompose(Et.position,Et.quaternion,Et.scale),Et.projectionMatrix.fromArray(Pt.projectionMatrix),Et.projectionMatrixInverse.copy(Et.projectionMatrix).invert(),Et.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),gt===0&&(S.matrix.copy(Et.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),_t===!0&&S.cameras.push(Et)}}for(let st=0;st<x.length;st++){const _t=_[st],gt=x[st];_t!==null&&gt!==void 0&&gt.update(_t,K,c||r)}$&&$(V,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),v=null}const at=new wl;at.setAnimationLoop(Z),this.setAnimationLoop=function(V){$=V},this.dispose=function(){}}}function h0(s,t){function e(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,Ml(s)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function i(p,f,x,_,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?a(p,f):f.isMeshToonMaterial?(a(p,f),d(p,f)):f.isMeshPhongMaterial?(a(p,f),h(p,f)):f.isMeshStandardMaterial?(a(p,f),u(p,f),f.isMeshPhysicalMaterial&&m(p,f,M)):f.isMeshMatcapMaterial?(a(p,f),v(p,f)):f.isMeshDepthMaterial?a(p,f):f.isMeshDistanceMaterial?(a(p,f),g(p,f)):f.isMeshNormalMaterial?a(p,f):f.isLineBasicMaterial?(r(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?l(p,f,x,_):f.isSpriteMaterial?c(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,e(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Fe&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,e(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Fe&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,e(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,e(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const x=t.get(f).envMap;if(x&&(p.envMap.value=x,p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap){p.lightMap.value=f.lightMap;const _=s._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=f.lightMapIntensity*_,e(f.lightMap,p.lightMapTransform)}f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,p.aoMapTransform))}function r(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function l(p,f,x,_){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*x,p.scale.value=_*.5,f.map&&(p.map.value=f.map,e(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function c(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function h(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function d(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function u(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,p.roughnessMapTransform)),t.get(f).envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,x){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Fe&&p.clearcoatNormalScale.value.negate())),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,p.specularIntensityMapTransform))}function v(p,f){f.matcap&&(p.matcap.value=f.matcap)}function g(p,f){const x=t.get(f).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function u0(s,t,e,n){let i={},a={},r=[];const o=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(x,_){const M=_.program;n.uniformBlockBinding(x,M)}function c(x,_){let M=i[x.id];M===void 0&&(v(x),M=h(x),i[x.id]=M,x.addEventListener("dispose",p));const w=_.program;n.updateUBOMapping(x,w);const y=t.render.frame;a[x.id]!==y&&(u(x),a[x.id]=y)}function h(x){const _=d();x.__bindingPointIndex=_;const M=s.createBuffer(),w=x.__size,y=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,w,y),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,_,M),M}function d(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){const _=i[x.id],M=x.uniforms,w=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,_);for(let y=0,b=M.length;y<b;y++){const D=Array.isArray(M[y])?M[y]:[M[y]];for(let S=0,T=D.length;S<T;S++){const I=D[S];if(m(I,y,S,w)===!0){const W=I.__offset,j=Array.isArray(I.value)?I.value:[I.value];let R=0;for(let N=0;N<j.length;N++){const L=j[N],z=g(L);typeof L=="number"||typeof L=="boolean"?(I.__data[0]=L,s.bufferSubData(s.UNIFORM_BUFFER,W+R,I.__data)):L.isMatrix3?(I.__data[0]=L.elements[0],I.__data[1]=L.elements[1],I.__data[2]=L.elements[2],I.__data[3]=0,I.__data[4]=L.elements[3],I.__data[5]=L.elements[4],I.__data[6]=L.elements[5],I.__data[7]=0,I.__data[8]=L.elements[6],I.__data[9]=L.elements[7],I.__data[10]=L.elements[8],I.__data[11]=0):(L.toArray(I.__data,R),R+=z.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,W,I.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function m(x,_,M,w){const y=x.value,b=_+"_"+M;if(w[b]===void 0)return typeof y=="number"||typeof y=="boolean"?w[b]=y:w[b]=y.clone(),!0;{const D=w[b];if(typeof y=="number"||typeof y=="boolean"){if(D!==y)return w[b]=y,!0}else if(D.equals(y)===!1)return D.copy(y),!0}return!1}function v(x){const _=x.uniforms;let M=0;const w=16;for(let b=0,D=_.length;b<D;b++){const S=Array.isArray(_[b])?_[b]:[_[b]];for(let T=0,I=S.length;T<I;T++){const W=S[T],j=Array.isArray(W.value)?W.value:[W.value];for(let R=0,N=j.length;R<N;R++){const L=j[R],z=g(L),q=M%w;q!==0&&w-q<z.boundary&&(M+=w-q),W.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=M,M+=z.storage}}}const y=M%w;return y>0&&(M+=w-y),x.__size=M,x.__cache={},this}function g(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function p(x){const _=x.target;_.removeEventListener("dispose",p);const M=r.indexOf(_.__bindingPointIndex);r.splice(M,1),s.deleteBuffer(i[_.id]),delete i[_.id],delete a[_.id]}function f(){for(const x in i)s.deleteBuffer(i[x]);r=[],i={},a={}}return{bind:l,update:c,dispose:f}}class Rl{constructor(t={}){const{canvas:e=rh(),context:n=null,depth:i=!0,stencil:a=!0,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let u;n!==null?u=n.getContextAttributes().alpha:u=r;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const f=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ye,this._useLegacyLights=!1,this.toneMapping=Dn,this.toneMappingExposure=1;const _=this;let M=!1,w=0,y=0,b=null,D=-1,S=null;const T=new le,I=new le;let W=null;const j=new vt(0);let R=0,N=e.width,L=e.height,z=1,q=null,X=null;const $=new le(0,0,N,L),Z=new le(0,0,N,L);let at=!1;const V=new Zs;let K=!1,st=!1,_t=null;const gt=new Wt,Pt=new Tt,Ut=new U,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Vt(){return b===null?z:1}let O=n;function Re(A,F){for(let G=0;G<A.length;G++){const H=A[G],k=e.getContext(H,F);if(k!==null)return k}return null}try{const A={alpha:!0,depth:i,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ka}`),e.addEventListener("webglcontextlost",nt,!1),e.addEventListener("webglcontextrestored",P,!1),e.addEventListener("webglcontextcreationerror",ot,!1),O===null){const F=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&F.shift(),O=Re(F,A),O===null)throw Re(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&O instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),O.getShaderPrecisionFormat===void 0&&(O.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Mt,Rt,ft,ie,Nt,C,E,B,tt,Q,et,pt,lt,ut,wt,zt,J,qt,Ht,Ct,xt,dt,It,Xt;function ae(){Mt=new yf(O),Rt=new mf(O,Mt,t),Mt.init(Rt),dt=new o0(O,Mt,Rt),ft=new s0(O,Mt,Rt),ie=new Ef(O),Nt=new Wp,C=new a0(O,Mt,ft,Nt,Rt,dt,ie),E=new vf(_),B=new Mf(_),tt=new Ph(O,Rt),It=new ff(O,Mt,tt,Rt),Q=new Sf(O,tt,ie,It),et=new Cf(O,Q,tt,ie),Ht=new Af(O,Rt,C),zt=new gf(Nt),pt=new Vp(_,E,B,Mt,Rt,It,zt),lt=new h0(_,Nt),ut=new qp,wt=new Jp(Mt,Rt),qt=new df(_,E,B,ft,et,u,l),J=new i0(_,et,Rt),Xt=new u0(O,ie,Rt,ft),Ct=new pf(O,Mt,ie,Rt),xt=new wf(O,Mt,ie,Rt),ie.programs=pt.programs,_.capabilities=Rt,_.extensions=Mt,_.properties=Nt,_.renderLists=ut,_.shadowMap=J,_.state=ft,_.info=ie}ae();const kt=new c0(_,O);this.xr=kt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const A=Mt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Mt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(A){A!==void 0&&(z=A,this.setSize(N,L,!1))},this.getSize=function(A){return A.set(N,L)},this.setSize=function(A,F,G=!0){if(kt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=A,L=F,e.width=Math.floor(A*z),e.height=Math.floor(F*z),G===!0&&(e.style.width=A+"px",e.style.height=F+"px"),this.setViewport(0,0,A,F)},this.getDrawingBufferSize=function(A){return A.set(N*z,L*z).floor()},this.setDrawingBufferSize=function(A,F,G){N=A,L=F,z=G,e.width=Math.floor(A*G),e.height=Math.floor(F*G),this.setViewport(0,0,A,F)},this.getCurrentViewport=function(A){return A.copy(T)},this.getViewport=function(A){return A.copy($)},this.setViewport=function(A,F,G,H){A.isVector4?$.set(A.x,A.y,A.z,A.w):$.set(A,F,G,H),ft.viewport(T.copy($).multiplyScalar(z).floor())},this.getScissor=function(A){return A.copy(Z)},this.setScissor=function(A,F,G,H){A.isVector4?Z.set(A.x,A.y,A.z,A.w):Z.set(A,F,G,H),ft.scissor(I.copy(Z).multiplyScalar(z).floor())},this.getScissorTest=function(){return at},this.setScissorTest=function(A){ft.setScissorTest(at=A)},this.setOpaqueSort=function(A){q=A},this.setTransparentSort=function(A){X=A},this.getClearColor=function(A){return A.copy(qt.getClearColor())},this.setClearColor=function(){qt.setClearColor.apply(qt,arguments)},this.getClearAlpha=function(){return qt.getClearAlpha()},this.setClearAlpha=function(){qt.setClearAlpha.apply(qt,arguments)},this.clear=function(A=!0,F=!0,G=!0){let H=0;if(A){let k=!1;if(b!==null){const ct=b.texture.format;k=ct===ll||ct===rl||ct===ol}if(k){const ct=b.texture.type,mt=ct===Ke||ct===yn||ct===Za||ct===qn||ct===sl||ct===al,St=qt.getClearColor(),At=qt.getClearAlpha(),Ot=St.r,Lt=St.g,Dt=St.b;mt?(m[0]=Ot,m[1]=Lt,m[2]=Dt,m[3]=At,O.clearBufferuiv(O.COLOR,0,m)):(v[0]=Ot,v[1]=Lt,v[2]=Dt,v[3]=At,O.clearBufferiv(O.COLOR,0,v))}else H|=O.COLOR_BUFFER_BIT}F&&(H|=O.DEPTH_BUFFER_BIT),G&&(H|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",nt,!1),e.removeEventListener("webglcontextrestored",P,!1),e.removeEventListener("webglcontextcreationerror",ot,!1),ut.dispose(),wt.dispose(),Nt.dispose(),E.dispose(),B.dispose(),et.dispose(),It.dispose(),Xt.dispose(),pt.dispose(),kt.dispose(),kt.removeEventListener("sessionstart",Le),kt.removeEventListener("sessionend",Kt),_t&&(_t.dispose(),_t=null),Pe.stop()};function nt(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function P(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const A=ie.autoReset,F=J.enabled,G=J.autoUpdate,H=J.needsUpdate,k=J.type;ae(),ie.autoReset=A,J.enabled=F,J.autoUpdate=G,J.needsUpdate=H,J.type=k}function ot(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function rt(A){const F=A.target;F.removeEventListener("dispose",rt),bt(F)}function bt(A){yt(A),Nt.remove(A)}function yt(A){const F=Nt.get(A).programs;F!==void 0&&(F.forEach(function(G){pt.releaseProgram(G)}),A.isShaderMaterial&&pt.releaseShaderCache(A))}this.renderBufferDirect=function(A,F,G,H,k,ct){F===null&&(F=Et);const mt=k.isMesh&&k.matrixWorld.determinant()<0,St=Gl(A,F,G,H,k);ft.setMaterial(H,mt);let At=G.index,Ot=1;if(H.wireframe===!0){if(At=Q.getWireframeAttribute(G),At===void 0)return;Ot=2}const Lt=G.drawRange,Dt=G.attributes.position;let he=Lt.start*Ot,Ge=(Lt.start+Lt.count)*Ot;ct!==null&&(he=Math.max(he,ct.start*Ot),Ge=Math.min(Ge,(ct.start+ct.count)*Ot)),At!==null?(he=Math.max(he,0),Ge=Math.min(Ge,At.count)):Dt!=null&&(he=Math.max(he,0),Ge=Math.min(Ge,Dt.count));const _e=Ge-he;if(_e<0||_e===1/0)return;It.setup(k,H,St,G,At);let dn,se=Ct;if(At!==null&&(dn=tt.get(At),se=xt,se.setIndex(dn)),k.isMesh)H.wireframe===!0?(ft.setLineWidth(H.wireframeLinewidth*Vt()),se.setMode(O.LINES)):se.setMode(O.TRIANGLES);else if(k.isLine){let Bt=H.linewidth;Bt===void 0&&(Bt=1),ft.setLineWidth(Bt*Vt()),k.isLineSegments?se.setMode(O.LINES):k.isLineLoop?se.setMode(O.LINE_LOOP):se.setMode(O.LINE_STRIP)}else k.isPoints?se.setMode(O.POINTS):k.isSprite&&se.setMode(O.TRIANGLES);if(k.isBatchedMesh)se.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else if(k.isInstancedMesh)se.renderInstances(he,_e,k.count);else if(G.isInstancedBufferGeometry){const Bt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,ta=Math.min(G.instanceCount,Bt);se.renderInstances(he,_e,ta)}else se.render(he,_e)};function $t(A,F,G){A.transparent===!0&&A.side===$e&&A.forceSinglePass===!1?(A.side=Fe,A.needsUpdate=!0,cs(A,F,G),A.side=wn,A.needsUpdate=!0,cs(A,F,G),A.side=$e):cs(A,F,G)}this.compile=function(A,F,G=null){G===null&&(G=A),p=wt.get(G),p.init(),x.push(p),G.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),A!==G&&A.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights(_._useLegacyLights);const H=new Set;return A.traverse(function(k){const ct=k.material;if(ct)if(Array.isArray(ct))for(let mt=0;mt<ct.length;mt++){const St=ct[mt];$t(St,G,k),H.add(St)}else $t(ct,G,k),H.add(ct)}),x.pop(),p=null,H},this.compileAsync=function(A,F,G=null){const H=this.compile(A,F,G);return new Promise(k=>{function ct(){if(H.forEach(function(mt){Nt.get(mt).currentProgram.isReady()&&H.delete(mt)}),H.size===0){k(A);return}setTimeout(ct,10)}Mt.get("KHR_parallel_shader_compile")!==null?ct():setTimeout(ct,10)})};let jt=null;function ve(A){jt&&jt(A)}function Le(){Pe.stop()}function Kt(){Pe.start()}const Pe=new wl;Pe.setAnimationLoop(ve),typeof self<"u"&&Pe.setContext(self),this.setAnimationLoop=function(A){jt=A,kt.setAnimationLoop(A),A===null?Pe.stop():Pe.start()},kt.addEventListener("sessionstart",Le),kt.addEventListener("sessionend",Kt),this.render=function(A,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),kt.enabled===!0&&kt.isPresenting===!0&&(kt.cameraAutoUpdate===!0&&kt.updateCamera(F),F=kt.getCamera()),A.isScene===!0&&A.onBeforeRender(_,A,F,b),p=wt.get(A,x.length),p.init(),x.push(p),gt.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),V.setFromProjectionMatrix(gt),st=this.localClippingEnabled,K=zt.init(this.clippingPlanes,st),g=ut.get(A,f.length),g.init(),f.push(g),on(A,F,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(q,X),this.info.render.frame++,K===!0&&zt.beginShadows();const G=p.state.shadowsArray;if(J.render(G,A,F),K===!0&&zt.endShadows(),this.info.autoReset===!0&&this.info.reset(),qt.render(g,A),p.setupLights(_._useLegacyLights),F.isArrayCamera){const H=F.cameras;for(let k=0,ct=H.length;k<ct;k++){const mt=H[k];ro(g,A,mt,mt.viewport)}}else ro(g,A,F);b!==null&&(C.updateMultisampleRenderTarget(b),C.updateRenderTargetMipmap(b)),A.isScene===!0&&A.onAfterRender(_,A,F),It.resetDefaultState(),D=-1,S=null,x.pop(),x.length>0?p=x[x.length-1]:p=null,f.pop(),f.length>0?g=f[f.length-1]:g=null};function on(A,F,G,H){if(A.visible===!1)return;if(A.layers.test(F.layers)){if(A.isGroup)G=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(F);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||V.intersectsSprite(A)){H&&Ut.setFromMatrixPosition(A.matrixWorld).applyMatrix4(gt);const mt=et.update(A),St=A.material;St.visible&&g.push(A,mt,St,G,Ut.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||V.intersectsObject(A))){const mt=et.update(A),St=A.material;if(H&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Ut.copy(A.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),Ut.copy(mt.boundingSphere.center)),Ut.applyMatrix4(A.matrixWorld).applyMatrix4(gt)),Array.isArray(St)){const At=mt.groups;for(let Ot=0,Lt=At.length;Ot<Lt;Ot++){const Dt=At[Ot],he=St[Dt.materialIndex];he&&he.visible&&g.push(A,mt,he,G,Ut.z,Dt)}}else St.visible&&g.push(A,mt,St,G,Ut.z,null)}}const ct=A.children;for(let mt=0,St=ct.length;mt<St;mt++)on(ct[mt],F,G,H)}function ro(A,F,G,H){const k=A.opaque,ct=A.transmissive,mt=A.transparent;p.setupLightsView(G),K===!0&&zt.setGlobalState(_.clippingPlanes,G),ct.length>0&&Bl(k,ct,F,G),H&&ft.viewport(T.copy(H)),k.length>0&&ls(k,F,G),ct.length>0&&ls(ct,F,G),mt.length>0&&ls(mt,F,G),ft.buffers.depth.setTest(!0),ft.buffers.depth.setMask(!0),ft.buffers.color.setMask(!0),ft.setPolygonOffset(!1)}function Bl(A,F,G,H){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;const ct=Rt.isWebGL2;_t===null&&(_t=new an(1,1,{generateMipmaps:!0,type:Mt.has("EXT_color_buffer_half_float")?Un:Ke,minFilter:jn,samples:ct?4:0})),_.getDrawingBufferSize(Pt),ct?_t.setSize(Pt.x,Pt.y):_t.setSize(qs(Pt.x),qs(Pt.y));const mt=_.getRenderTarget();_.setRenderTarget(_t),_.getClearColor(j),R=_.getClearAlpha(),R<1&&_.setClearColor(16777215,.5),_.clear();const St=_.toneMapping;_.toneMapping=Dn,ls(A,G,H),C.updateMultisampleRenderTarget(_t),C.updateRenderTargetMipmap(_t);let At=!1;for(let Ot=0,Lt=F.length;Ot<Lt;Ot++){const Dt=F[Ot],he=Dt.object,Ge=Dt.geometry,_e=Dt.material,dn=Dt.group;if(_e.side===$e&&he.layers.test(H.layers)){const se=_e.side;_e.side=Fe,_e.needsUpdate=!0,lo(he,G,H,Ge,_e,dn),_e.side=se,_e.needsUpdate=!0,At=!0}}At===!0&&(C.updateMultisampleRenderTarget(_t),C.updateRenderTargetMipmap(_t)),_.setRenderTarget(mt),_.setClearColor(j,R),_.toneMapping=St}function ls(A,F,G){const H=F.isScene===!0?F.overrideMaterial:null;for(let k=0,ct=A.length;k<ct;k++){const mt=A[k],St=mt.object,At=mt.geometry,Ot=H===null?mt.material:H,Lt=mt.group;St.layers.test(G.layers)&&lo(St,F,G,At,Ot,Lt)}}function lo(A,F,G,H,k,ct){A.onBeforeRender(_,F,G,H,k,ct),A.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),k.onBeforeRender(_,F,G,H,A,ct),k.transparent===!0&&k.side===$e&&k.forceSinglePass===!1?(k.side=Fe,k.needsUpdate=!0,_.renderBufferDirect(G,F,H,k,A,ct),k.side=wn,k.needsUpdate=!0,_.renderBufferDirect(G,F,H,k,A,ct),k.side=$e):_.renderBufferDirect(G,F,H,k,A,ct),A.onAfterRender(_,F,G,H,k,ct)}function cs(A,F,G){F.isScene!==!0&&(F=Et);const H=Nt.get(A),k=p.state.lights,ct=p.state.shadowsArray,mt=k.state.version,St=pt.getParameters(A,k.state,ct,F,G),At=pt.getProgramCacheKey(St);let Ot=H.programs;H.environment=A.isMeshStandardMaterial?F.environment:null,H.fog=F.fog,H.envMap=(A.isMeshStandardMaterial?B:E).get(A.envMap||H.environment),Ot===void 0&&(A.addEventListener("dispose",rt),Ot=new Map,H.programs=Ot);let Lt=Ot.get(At);if(Lt!==void 0){if(H.currentProgram===Lt&&H.lightsStateVersion===mt)return ho(A,St),Lt}else St.uniforms=pt.getUniforms(A),A.onBuild(G,St,_),A.onBeforeCompile(St,_),Lt=pt.acquireProgram(St,At),Ot.set(At,Lt),H.uniforms=St.uniforms;const Dt=H.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Dt.clippingPlanes=zt.uniform),ho(A,St),H.needsLights=Vl(A),H.lightsStateVersion=mt,H.needsLights&&(Dt.ambientLightColor.value=k.state.ambient,Dt.lightProbe.value=k.state.probe,Dt.directionalLights.value=k.state.directional,Dt.directionalLightShadows.value=k.state.directionalShadow,Dt.spotLights.value=k.state.spot,Dt.spotLightShadows.value=k.state.spotShadow,Dt.rectAreaLights.value=k.state.rectArea,Dt.ltc_1.value=k.state.rectAreaLTC1,Dt.ltc_2.value=k.state.rectAreaLTC2,Dt.pointLights.value=k.state.point,Dt.pointLightShadows.value=k.state.pointShadow,Dt.hemisphereLights.value=k.state.hemi,Dt.directionalShadowMap.value=k.state.directionalShadowMap,Dt.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Dt.spotShadowMap.value=k.state.spotShadowMap,Dt.spotLightMatrix.value=k.state.spotLightMatrix,Dt.spotLightMap.value=k.state.spotLightMap,Dt.pointShadowMap.value=k.state.pointShadowMap,Dt.pointShadowMatrix.value=k.state.pointShadowMatrix),H.currentProgram=Lt,H.uniformsList=null,Lt}function co(A){if(A.uniformsList===null){const F=A.currentProgram.getUniforms();A.uniformsList=zs.seqWithValue(F.seq,A.uniforms)}return A.uniformsList}function ho(A,F){const G=Nt.get(A);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function Gl(A,F,G,H,k){F.isScene!==!0&&(F=Et),C.resetTextureUnits();const ct=F.fog,mt=H.isMeshStandardMaterial?F.environment:null,St=b===null?_.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:En,At=(H.isMeshStandardMaterial?B:E).get(H.envMap||mt),Ot=H.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Lt=!!G.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Dt=!!G.morphAttributes.position,he=!!G.morphAttributes.normal,Ge=!!G.morphAttributes.color;let _e=Dn;H.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(_e=_.toneMapping);const dn=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,se=dn!==void 0?dn.length:0,Bt=Nt.get(H),ta=p.state.lights;if(K===!0&&(st===!0||A!==S)){const Xe=A===S&&H.id===D;zt.setState(H,A,Xe)}let oe=!1;H.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==ta.state.version||Bt.outputColorSpace!==St||k.isBatchedMesh&&Bt.batching===!1||!k.isBatchedMesh&&Bt.batching===!0||k.isInstancedMesh&&Bt.instancing===!1||!k.isInstancedMesh&&Bt.instancing===!0||k.isSkinnedMesh&&Bt.skinning===!1||!k.isSkinnedMesh&&Bt.skinning===!0||k.isInstancedMesh&&Bt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Bt.instancingColor===!1&&k.instanceColor!==null||Bt.envMap!==At||H.fog===!0&&Bt.fog!==ct||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==zt.numPlanes||Bt.numIntersection!==zt.numIntersection)||Bt.vertexAlphas!==Ot||Bt.vertexTangents!==Lt||Bt.morphTargets!==Dt||Bt.morphNormals!==he||Bt.morphColors!==Ge||Bt.toneMapping!==_e||Rt.isWebGL2===!0&&Bt.morphTargetsCount!==se)&&(oe=!0):(oe=!0,Bt.__version=H.version);let Fn=Bt.currentProgram;oe===!0&&(Fn=cs(H,F,k));let uo=!1,Di=!1,ea=!1;const we=Fn.getUniforms(),Nn=Bt.uniforms;if(ft.useProgram(Fn.program)&&(uo=!0,Di=!0,ea=!0),H.id!==D&&(D=H.id,Di=!0),uo||S!==A){we.setValue(O,"projectionMatrix",A.projectionMatrix),we.setValue(O,"viewMatrix",A.matrixWorldInverse);const Xe=we.map.cameraPosition;Xe!==void 0&&Xe.setValue(O,Ut.setFromMatrixPosition(A.matrixWorld)),Rt.logarithmicDepthBuffer&&we.setValue(O,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&we.setValue(O,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,Di=!0,ea=!0)}if(k.isSkinnedMesh){we.setOptional(O,k,"bindMatrix"),we.setOptional(O,k,"bindMatrixInverse");const Xe=k.skeleton;Xe&&(Rt.floatVertexTextures?(Xe.boneTexture===null&&Xe.computeBoneTexture(),we.setValue(O,"boneTexture",Xe.boneTexture,C)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}k.isBatchedMesh&&(we.setOptional(O,k,"batchingTexture"),we.setValue(O,"batchingTexture",k._matricesTexture,C));const na=G.morphAttributes;if((na.position!==void 0||na.normal!==void 0||na.color!==void 0&&Rt.isWebGL2===!0)&&Ht.update(k,G,Fn),(Di||Bt.receiveShadow!==k.receiveShadow)&&(Bt.receiveShadow=k.receiveShadow,we.setValue(O,"receiveShadow",k.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Nn.envMap.value=At,Nn.flipEnvMap.value=At.isCubeTexture&&At.isRenderTargetTexture===!1?-1:1),Di&&(we.setValue(O,"toneMappingExposure",_.toneMappingExposure),Bt.needsLights&&Hl(Nn,ea),ct&&H.fog===!0&&lt.refreshFogUniforms(Nn,ct),lt.refreshMaterialUniforms(Nn,H,z,L,_t),zs.upload(O,co(Bt),Nn,C)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(zs.upload(O,co(Bt),Nn,C),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&we.setValue(O,"center",k.center),we.setValue(O,"modelViewMatrix",k.modelViewMatrix),we.setValue(O,"normalMatrix",k.normalMatrix),we.setValue(O,"modelMatrix",k.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const Xe=H.uniformsGroups;for(let ia=0,Wl=Xe.length;ia<Wl;ia++)if(Rt.isWebGL2){const fo=Xe[ia];Xt.update(fo,Fn),Xt.bind(fo,Fn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Fn}function Hl(A,F){A.ambientLightColor.needsUpdate=F,A.lightProbe.needsUpdate=F,A.directionalLights.needsUpdate=F,A.directionalLightShadows.needsUpdate=F,A.pointLights.needsUpdate=F,A.pointLightShadows.needsUpdate=F,A.spotLights.needsUpdate=F,A.spotLightShadows.needsUpdate=F,A.rectAreaLights.needsUpdate=F,A.hemisphereLights.needsUpdate=F}function Vl(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(A,F,G){Nt.get(A.texture).__webglTexture=F,Nt.get(A.depthTexture).__webglTexture=G;const H=Nt.get(A);H.__hasExternalTextures=!0,H.__hasExternalTextures&&(H.__autoAllocateDepthBuffer=G===void 0,H.__autoAllocateDepthBuffer||Mt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(A,F){const G=Nt.get(A);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(A,F=0,G=0){b=A,w=F,y=G;let H=!0,k=null,ct=!1,mt=!1;if(A){const At=Nt.get(A);At.__useDefaultFramebuffer!==void 0?(ft.bindFramebuffer(O.FRAMEBUFFER,null),H=!1):At.__webglFramebuffer===void 0?C.setupRenderTarget(A):At.__hasExternalTextures&&C.rebindTextures(A,Nt.get(A.texture).__webglTexture,Nt.get(A.depthTexture).__webglTexture);const Ot=A.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(mt=!0);const Lt=Nt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Lt[F])?k=Lt[F][G]:k=Lt[F],ct=!0):Rt.isWebGL2&&A.samples>0&&C.useMultisampledRTT(A)===!1?k=Nt.get(A).__webglMultisampledFramebuffer:Array.isArray(Lt)?k=Lt[G]:k=Lt,T.copy(A.viewport),I.copy(A.scissor),W=A.scissorTest}else T.copy($).multiplyScalar(z).floor(),I.copy(Z).multiplyScalar(z).floor(),W=at;if(ft.bindFramebuffer(O.FRAMEBUFFER,k)&&Rt.drawBuffers&&H&&ft.drawBuffers(A,k),ft.viewport(T),ft.scissor(I),ft.setScissorTest(W),ct){const At=Nt.get(A.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+F,At.__webglTexture,G)}else if(mt){const At=Nt.get(A.texture),Ot=F||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,At.__webglTexture,G||0,Ot)}D=-1},this.readRenderTargetPixels=function(A,F,G,H,k,ct,mt){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=Nt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&mt!==void 0&&(St=St[mt]),St){ft.bindFramebuffer(O.FRAMEBUFFER,St);try{const At=A.texture,Ot=At.format,Lt=At.type;if(Ot!==Oe&&dt.convert(Ot)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Dt=Lt===Un&&(Mt.has("EXT_color_buffer_half_float")||Rt.isWebGL2&&Mt.has("EXT_color_buffer_float"));if(Lt!==Ke&&dt.convert(Lt)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Lt===cn&&(Rt.isWebGL2||Mt.has("OES_texture_float")||Mt.has("WEBGL_color_buffer_float")))&&!Dt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=A.width-H&&G>=0&&G<=A.height-k&&O.readPixels(F,G,H,k,dt.convert(Ot),dt.convert(Lt),ct)}finally{const At=b!==null?Nt.get(b).__webglFramebuffer:null;ft.bindFramebuffer(O.FRAMEBUFFER,At)}}},this.copyFramebufferToTexture=function(A,F,G=0){const H=Math.pow(2,-G),k=Math.floor(F.image.width*H),ct=Math.floor(F.image.height*H);C.setTexture2D(F,0),O.copyTexSubImage2D(O.TEXTURE_2D,G,0,0,A.x,A.y,k,ct),ft.unbindTexture()},this.copyTextureToTexture=function(A,F,G,H=0){const k=F.image.width,ct=F.image.height,mt=dt.convert(G.format),St=dt.convert(G.type);C.setTexture2D(G,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,G.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,G.unpackAlignment),F.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,H,A.x,A.y,k,ct,mt,St,F.image.data):F.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,H,A.x,A.y,F.mipmaps[0].width,F.mipmaps[0].height,mt,F.mipmaps[0].data):O.texSubImage2D(O.TEXTURE_2D,H,A.x,A.y,mt,St,F.image),H===0&&G.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),ft.unbindTexture()},this.copyTextureToTexture3D=function(A,F,G,H,k=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ct=A.max.x-A.min.x+1,mt=A.max.y-A.min.y+1,St=A.max.z-A.min.z+1,At=dt.convert(H.format),Ot=dt.convert(H.type);let Lt;if(H.isData3DTexture)C.setTexture3D(H,0),Lt=O.TEXTURE_3D;else if(H.isDataArrayTexture||H.isCompressedArrayTexture)C.setTexture2DArray(H,0),Lt=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,H.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,H.unpackAlignment);const Dt=O.getParameter(O.UNPACK_ROW_LENGTH),he=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Ge=O.getParameter(O.UNPACK_SKIP_PIXELS),_e=O.getParameter(O.UNPACK_SKIP_ROWS),dn=O.getParameter(O.UNPACK_SKIP_IMAGES),se=G.isCompressedTexture?G.mipmaps[k]:G.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,se.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,se.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,A.min.x),O.pixelStorei(O.UNPACK_SKIP_ROWS,A.min.y),O.pixelStorei(O.UNPACK_SKIP_IMAGES,A.min.z),G.isDataTexture||G.isData3DTexture?O.texSubImage3D(Lt,k,F.x,F.y,F.z,ct,mt,St,At,Ot,se.data):G.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),O.compressedTexSubImage3D(Lt,k,F.x,F.y,F.z,ct,mt,St,At,se.data)):O.texSubImage3D(Lt,k,F.x,F.y,F.z,ct,mt,St,At,Ot,se),O.pixelStorei(O.UNPACK_ROW_LENGTH,Dt),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,he),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Ge),O.pixelStorei(O.UNPACK_SKIP_ROWS,_e),O.pixelStorei(O.UNPACK_SKIP_IMAGES,dn),k===0&&H.generateMipmaps&&O.generateMipmap(Lt),ft.unbindTexture()},this.initTexture=function(A){A.isCubeTexture?C.setTextureCube(A,0):A.isData3DTexture?C.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?C.setTexture2DArray(A,0):C.setTexture2D(A,0),ft.unbindTexture()},this.resetState=function(){w=0,y=0,b=null,ft.reset(),It.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ja?"display-p3":"srgb",e.unpackColorSpace=Yt.workingColorSpace===Ks?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===ye?$n:hl}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===$n?ye:En}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class d0 extends Rl{}d0.prototype.isWebGL1Renderer=!0;class ss extends Be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Zi extends ke{constructor(t=null,e=1,n=1,i,a,r,o,l,c=de,h=de,d,u){super(null,r,o,l,c,h,i,a,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ji extends Ne{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const fi=new Wt,Ir=new Wt,Ds=[],Fr=new un,f0=new Wt,zi=new te,Oi=new Li;class $i extends te{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ji(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,f0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new un),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,fi),Fr.copy(t.boundingBox).applyMatrix4(fi),this.boundingBox.union(Fr)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Li),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,fi),Oi.copy(t.boundingSphere).applyMatrix4(fi),this.boundingSphere.union(Oi)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(zi.geometry=this.geometry,zi.material=this.material,zi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Oi.copy(this.boundingSphere),Oi.applyMatrix4(n),t.ray.intersectsSphere(Oi)!==!1))for(let a=0;a<i;a++){this.getMatrixAt(a,fi),Ir.multiplyMatrices(n,fi),zi.matrixWorld=Ir,zi.raycast(t,Ds);for(let r=0,o=Ds.length;r<o;r++){const l=Ds[r];l.instanceId=a,l.object=this,e.push(l)}Ds.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ji(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class p0 extends es{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new vt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Nr=new Wt,$a=new to,Us=new Li,Is=new U;class Ll extends Be{constructor(t=new Se,e=new p0){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,a=t.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Us.copy(n.boundingSphere),Us.applyMatrix4(i),Us.radius+=a,t.ray.intersectsSphere(Us)===!1)return;Nr.copy(i).invert(),$a.copy(t.ray).applyMatrix4(Nr);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,r.start),m=Math.min(c.count,r.start+r.count);for(let v=u,g=m;v<g;v++){const p=c.getX(v);Is.fromBufferAttribute(d,p),zr(Is,p,l,i,t,e,this)}}else{const u=Math.max(0,r.start),m=Math.min(d.count,r.start+r.count);for(let v=u,g=m;v<g;v++)Is.fromBufferAttribute(d,v),zr(Is,v,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=i.length;a<r;a++){const o=i[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function zr(s,t,e,n,i,a,r){const o=$a.distanceSqToPoint(s);if(o<e){const l=new U;$a.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,object:r})}}class ao extends Se{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const a=[],r=[];o(i),c(n),h(),this.setAttribute("position",new ne(a,3)),this.setAttribute("normal",new ne(a.slice(),3)),this.setAttribute("uv",new ne(r,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const _=new U,M=new U,w=new U;for(let y=0;y<e.length;y+=3)m(e[y+0],_),m(e[y+1],M),m(e[y+2],w),l(_,M,w,x)}function l(x,_,M,w){const y=w+1,b=[];for(let D=0;D<=y;D++){b[D]=[];const S=x.clone().lerp(M,D/y),T=_.clone().lerp(M,D/y),I=y-D;for(let W=0;W<=I;W++)W===0&&D===y?b[D][W]=S:b[D][W]=S.clone().lerp(T,W/I)}for(let D=0;D<y;D++)for(let S=0;S<2*(y-D)-1;S++){const T=Math.floor(S/2);S%2===0?(u(b[D][T+1]),u(b[D+1][T]),u(b[D][T])):(u(b[D][T+1]),u(b[D+1][T+1]),u(b[D+1][T]))}}function c(x){const _=new U;for(let M=0;M<a.length;M+=3)_.x=a[M+0],_.y=a[M+1],_.z=a[M+2],_.normalize().multiplyScalar(x),a[M+0]=_.x,a[M+1]=_.y,a[M+2]=_.z}function h(){const x=new U;for(let _=0;_<a.length;_+=3){x.x=a[_+0],x.y=a[_+1],x.z=a[_+2];const M=p(x)/2/Math.PI+.5,w=f(x)/Math.PI+.5;r.push(M,1-w)}v(),d()}function d(){for(let x=0;x<r.length;x+=6){const _=r[x+0],M=r[x+2],w=r[x+4],y=Math.max(_,M,w),b=Math.min(_,M,w);y>.9&&b<.1&&(_<.2&&(r[x+0]+=1),M<.2&&(r[x+2]+=1),w<.2&&(r[x+4]+=1))}}function u(x){a.push(x.x,x.y,x.z)}function m(x,_){const M=x*3;_.x=t[M+0],_.y=t[M+1],_.z=t[M+2]}function v(){const x=new U,_=new U,M=new U,w=new U,y=new Tt,b=new Tt,D=new Tt;for(let S=0,T=0;S<a.length;S+=9,T+=6){x.set(a[S+0],a[S+1],a[S+2]),_.set(a[S+3],a[S+4],a[S+5]),M.set(a[S+6],a[S+7],a[S+8]),y.set(r[T+0],r[T+1]),b.set(r[T+2],r[T+3]),D.set(r[T+4],r[T+5]),w.copy(x).add(_).add(M).divideScalar(3);const I=p(w);g(y,T+0,x,I),g(b,T+2,_,I),g(D,T+4,M,I)}}function g(x,_,M,w){w<0&&x.x===1&&(r[_]=x.x-1),M.x===0&&M.z===0&&(r[_]=w/2/Math.PI+.5)}function p(x){return Math.atan2(x.z,-x.x)}function f(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ao(t.vertices,t.indices,t.radius,t.details)}}class oo extends ao{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new oo(t.radius,t.detail)}}class m0 extends Se{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class g0{constructor(t,e,n=0,i=1/0){this.ray=new to(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new eo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return ja(t,this,n,e),n.sort(Or),n}intersectObjects(t,e=!0,n=[]){for(let i=0,a=t.length;i<a;i++)ja(t[i],this,n,e);return n.sort(Or),n}}function Or(s,t){return s.distance-t.distance}function ja(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let a=0,r=i.length;a<r;a++)ja(i[a],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ka}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ka);const Ua=s=>Number.isInteger(s)?s.toFixed(1):String(s),Ze=`
#define WORLD ${Ua(Qt)}
#define HALF_WORLD ${Ua(Qt/2)}
#define HRES ${Ua(Vn)}
#define Y_PER_M ${sn}
#define PI 3.14159265
`,as=`
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
`,Kn=`
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
`,os=`
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
`,Pl=`
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
`,v0=`
${Ze}
${Kn}
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
`,_0=`
${Ze}
${as}
${Kn}
${os}
${Pl}
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
`,kr=32,pi=7,Br=1600;class x0{constructor(t,e){this.heights=t.height,this.N=Vn,this.leafSize=Qt/2**(pi-1),this.range0=22,this.buildMinMax();const n=new Zi(t.height,Vn,Vn,Gs,cn);n.minFilter=de,n.magFilter=de,n.needsUpdate=!0,this.heightTex=n;const i=new Zi(t.normals,Vn,Vn,Oe,Ke);i.minFilter=jn,i.magFilter=ee,i.generateMipmaps=!0,i.anisotropy=8,i.needsUpdate=!0,this.normalTex=i,this.full=this.makeGrid(kr),this.half=this.makeGrid(kr/2),this.morph=[];for(let r=0;r<8;r++)this.morph.push(new Tt);const a={...e.uniforms,uHeight:{value:n},uNormal:{value:i},uMorph:{value:this.morph},uCamPos:{value:new U},uDebug:{value:0}};this.uniforms=a,this.group=new nn;for(const r of[this.full,this.half])r.material=new pe({vertexShader:v0,fragmentShader:_0,uniforms:{...a,uGrid:{value:r.dim}}}),r.mesh=new te(r.geometry,r.material),r.mesh.frustumCulled=!1,r.mesh.matrixAutoUpdate=!1,this.group.add(r.mesh);this._frustum=new Zs,this._m=new Wt,this._box=new un,this.setRange(this.range0)}makeGrid(t){const e=new m0,n=new Float32Array((t+1)*(t+1)*3);for(let o=0;o<=t;o++)for(let l=0;l<=t;l++){const c=(o*(t+1)+l)*3;n[c]=l/t,n[c+2]=o/t}const i=[];for(let o=0;o<t;o++)for(let l=0;l<t;l++){const c=o*(t+1)+l,h=c+1,d=c+t+1,u=d+1;l+o&1?i.push(c,d,h,h,d,u):i.push(c,d,u,c,u,h)}e.setIndex(i),e.setAttribute("position",new Ne(n,3));const a=new Float32Array(Br*4),r=new Ji(a,4);return r.setUsage(Mi),e.setAttribute("aNode",r),e.instanceCount=0,{dim:t,geometry:e,data:a,attr:r,count:0}}buildMinMax(){const t=this.N,e=2**(pi-1),n=t/e;this.mm=[];let i=new Float32Array(e*e),a=new Float32Array(e*e);for(let o=0;o<e;o++)for(let l=0;l<e;l++){let c=1/0,h=-1/0;for(let d=o*n;d<=Math.min(t-1,(o+1)*n);d++)for(let u=l*n;u<=Math.min(t-1,(l+1)*n);u++){const m=this.heights[d*t+u];m<c&&(c=m),m>h&&(h=m)}i[o*e+l]=c,a[o*e+l]=h}this.mm.push({lo:i,hi:a,n:e});let r=e;for(;r>1;){const o=r/2,l=new Float32Array(o*o),c=new Float32Array(o*o);for(let h=0;h<o;h++)for(let d=0;d<o;d++){const u=2*h*r+2*d;l[h*o+d]=Math.min(i[u],i[u+1],i[u+r],i[u+r+1]),c[h*o+d]=Math.max(a[u],a[u+1],a[u+r],a[u+r+1])}i=l,a=c,r=o,this.mm.push({lo:i,hi:a,n:r})}}setRange(t){this.range0=t,this.ranges=[];for(let e=0;e<pi;e++)this.ranges.push(t*2**e);this.ranges[pi-1]=1e6;for(let e=0;e<pi;e++){const n=this.ranges[e],i=e>0?this.ranges[e-1]:0,a=i+(n-i)*.6;this.morph[e].set(a,n*.97)}}heightAt(t,e){return this.metresAt(t,e)*sn}metresAt(t,e){const n=this.N;let i=(t+Zt)/Qt*n-.5,a=(e+Zt)/Qt*n-.5;i<0&&(i=0),a<0&&(a=0),i>n-1.001&&(i=n-1.001),a>n-1.001&&(a=n-1.001);const r=i|0,o=a|0,l=i-r,c=a-o,h=this.heights,d=o*n+r,u=h[d]+(h[d+1]-h[d])*l,m=h[d+n]+(h[d+n+1]-h[d+n])*l;return u+(m-u)*c}normalAt(t,e,n=new U){const i=Qt/this.N,a=this.heightAt(t+i,e)-this.heightAt(t-i,e),r=this.heightAt(t,e+i)-this.heightAt(t,e-i);return n.set(-a,2*i,-r).normalize()}update(t){this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.uniforms.uCamPos.value.copy(t.position),this.full.count=0,this.half.count=0,this.select(0,0,pi-1);for(const e of[this.full,this.half])e.geometry.instanceCount=e.count,e.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],a=this.leafSize*2**n,r=-Zt+t*a,o=-Zt+e*a,l=i.lo[e*i.n+t]*sn,c=i.hi[e*i.n+t]*sn;return this._box.min.set(r,l,o),this._box.max.set(r+a,c,o+a),this._box}select(t,e,n){const i=this.nodeBox(t,e,n),a=this.mm[n];if(a.hi[e*a.n+t]<-45)return!0;if(i.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(i))return!0;const r=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,r,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,r,n),!0;for(let o=0;o<4;o++){const l=t*2+(o&1),c=e*2+(o>>1);if(!this.select(l,c,n-1)){const h=this.mm[n-1];if(h.hi[c*h.n+l]<-45)continue;const d=this.nodeBox(l,c,n-1);if(!this._frustum.intersectsBox(d))continue;this.emit(this.half,l,c,r/2,n)}}return!0}emit(t,e,n,i,a){if(t.count>=Br)return;const r=t.count*4;t.data[r]=-Zt+e*i,t.data[r+1]=-Zt+n*i,t.data[r+2]=i,t.data[r+3]=a,t.count++}}const M0=`
${Ze}
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,y0=`
${Ze}
${as}
${Kn}
${os}
${Pl}
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
`;function S0(s,t,e,n){const i=[0,0,0];for(let o=0;o<=n;o++){const l=s*Math.pow(t/s,o/n);for(let c=0;c<e;c++){const h=c/e*Math.PI*2;i.push(Math.cos(h)*l,0,Math.sin(h)*l)}}const a=[];for(let o=0;o<e;o++)a.push(0,1+(o+1)%e,1+o);for(let o=0;o<n;o++)for(let l=0;l<e;l++){const c=1+o*e+l,h=1+o*e+(l+1)%e,d=c+e,u=h+e;a.push(c,h,d,h,u,d)}const r=new Se;return r.setAttribute("position",new ne(i,3)),r.setIndex(a),r}class w0{constructor(t,e,n){this.uniforms={...t.uniforms,uHeight:{value:e},uSea:{value:n},uCamPos:{value:new U},uWind:{value:new Tt(-.8,.45)},uSwellDir:{value:new Tt(-.6,.8)},uSwell:{value:.6},uDebug:{value:0},uHorizonColor:{value:new vt},uZenithColor:{value:new vt}};const i=S0(1.5,8e3,96,72);this.material=new pe({vertexShader:M0,fragmentShader:y0,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new te(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const E0=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],b0={ra:12.857,dec:27.13};function rs(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function _n(s,t,e=0){let n=Math.imul(s|0,374761393)+Math.imul(t|0,668265263)+Math.imul(e|0,1442695041);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const T0=.5*(Math.sqrt(3)-1),ki=(3-Math.sqrt(3))/6,mi=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1,.7071,.7071,-.7071,.7071,.7071,-.7071,-.7071,-.7071]);function Gr(s){const t=rs(s),e=new Uint8Array(256);for(let a=0;a<256;a++)e[a]=a;for(let a=255;a>0;a--){const r=Math.floor(t()*(a+1)),o=e[a];e[a]=e[r],e[r]=o}const n=new Uint8Array(512),i=new Uint8Array(512);for(let a=0;a<512;a++)n[a]=e[a&255],i[a]=n[a]%12;return function(r,o){const l=(r+o)*T0,c=Math.floor(r+l),h=Math.floor(o+l),d=(c+h)*ki,u=r-(c-d),m=o-(h-d);let v,g;u>m?(v=1,g=0):(v=0,g=1);const p=u-v+ki,f=m-g+ki,x=u-1+2*ki,_=m-1+2*ki,M=c&255,w=h&255;let y=0,b=.5-u*u-m*m;if(b>0){const T=i[M+n[w]]*2;b*=b,y+=b*b*(mi[T]*u+mi[T+1]*m)}let D=.5-p*p-f*f;if(D>0){const T=i[M+v+n[w+g]]*2;D*=D,y+=D*D*(mi[T]*p+mi[T+1]*f)}let S=.5-x*x-_*_;if(S>0){const T=i[M+1+n[w+1]]*2;S*=S,y+=S*S*(mi[T]*x+mi[T+1]*_)}return 70*y}}function A0(s,t,e,n,i=.5){let a=0,r=1,o=0,l=1;for(let c=0;c<n;c++)a+=r*s(t*l,e*l),o+=r,r*=i,l*=2.03;return a/o}const Os=(s,t,e)=>s<t?t:s>e?e:s,Hr=(s,t,e)=>{const n=Os((e-s)/(t-s),0,1);return n*n*(3-2*n)},C0=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function Qs(){const s=new Se;return s.setAttribute("position",new Ne(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const R0=`
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
`;class L0{constructor(t){this.renderer=t,this.size=new Tt;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?Un:Ke,this.sceneRT=new an(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new so(1,1,yn),this.quad=new te(Qs(),new pe({vertexShader:C0,fragmentShader:R0,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new Tt},uInvProj:{value:new Wt},uCamWorld:{value:new Wt},uCamPos:{value:new U},uSunDir:{value:new U(0,1,0)},uSunColor:{value:new vt},uFogColor:{value:new vt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new ss,this.quadScene.add(this.quad),this.quadCam=new is(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const Mn=Math.PI/180,Wi=21*Mn,Fs=29.530588,P0=224.1,D0=["Hilo","Hoaka","Kūkahi","Kūlua","Kūkolu","Kūpau","ʻOlekūkahi","ʻOlekūlua","ʻOlekūkolu","ʻOlepau","Huna","Mōhalu","Hua","Akua","Hoku","Māhealani","Kulu","Lāʻaukūkahi","Lāʻaukūlua","Lāʻaupau","ʻOlekūkahi","ʻOlekūlua","ʻOlepau","Kāloakūkahi","Kāloakūlua","Kāloapau","Kāne","Lono","Mauli","Muku"];function Vr(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),a=Math.sin(s)*Math.cos(Wi)-n*Math.cos(t)*Math.sin(Wi),r=Math.sin(s)*Math.sin(Wi)+n*Math.cos(t)*Math.cos(Wi);return e.set(i,r,-a)}function U0(s,t,e={}){const n=23.44*Mn*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*Mn,r=((s-80)/365.25*24%24+24)%24+t-12;e.sun=Vr(n,(t-12)*15*Mn,e.sun||new U);const o=s+t/24,l=((o-P0)%Fs+Fs)%Fs,c=l/Fs,h=i+c*2*Math.PI,d=Math.asin(Math.sin(23.44*Mn)*Math.sin(h)+Math.sin(5.1*Mn)*Math.sin(o*.23)),u=h/(2*Math.PI)*24;return e.moon=Vr(d,(r-u)*15*Mn,e.moon||new U),e.phase=c,e.night=Math.min(29,Math.floor(l)),e.illum=.5-.5*Math.cos(c*2*Math.PI),e.lst=r,e.decl=n,e}const Dl=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],Ul=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],I0=1.6110731556870734,F0=1.5;function N0(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((I0-Math.acos(s))/F0)))}function Ia(s,t,e,n=[0,0,0]){const i=N0(t.y),a=.2*e.turbidity*1e-17,r=Math.acos(Math.max(0,s.y)),o=1/(Math.cos(r)+.15*Math.pow(93.885-r*180/Math.PI,-1.253)),l=8400*o,c=1250*o,h=s.x*t.x+s.y*t.y+s.z*t.z,d=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),u=e.mieDirectionalG,m=u*u,v=1/(4*Math.PI)*((1-m)/Math.pow(1-2*u*h+m,1.5)),g=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let p=0;p<3;p++){const f=Dl[p]*e.rayleigh,x=.434*a*Ul[p]*e.mieCoefficient,_=Math.exp(-(f*l+x*c)),M=(f*d+x*v)/(f+x);let w=Math.pow(i*M*(1-_),1.5);w*=1+(Math.pow(i*M*_,.5)-1)*g;const y=.1*_,b=(w+y)*.04+[0,3e-4,75e-5][p];n[p]=Math.pow(b,1/2.4)}return n}function z0(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),a=.2*t.turbidity*1e-17;for(let r=0;r<3;r++){const o=Dl[r]*t.rayleigh,l=.434*a*Ul[r]*t.mieCoefficient;e[r]=Math.exp(-(o*8400*i+l*1250*i))}return e}const O0=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,Il=`
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
`,k0=`
${Il}
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
`,B0=`
${Il}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,G0=`
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
`,H0=`
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
`;class V0{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=b0,e=(c,h)=>{const d=c/24*2*Math.PI,u=h*Mn;return new U(Math.cos(u)*Math.cos(d),Math.cos(u)*Math.sin(d),Math.sin(u))};this.uniforms={uSun:{value:new U(0,1,0)},uMoon:{value:new U(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:Wi},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new te(new oo(1,5),new pe({vertexShader:O0,fragmentShader:k0,uniforms:this.uniforms,side:Fe,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=rs(4242),a=E0.map(([c,h,d])=>[c/24*2*Math.PI,h*Mn,d]);for(let c=0;c<2600;c++){const h=i()*2-1;a.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const r=new Float32Array(a.length*3);a.forEach((c,h)=>r.set(c,h*3));const o=new Se;o.setAttribute("aStar",new Ne(r,3)),o.setAttribute("position",new Ne(new Float32Array(a.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new Ll(o,new pe({vertexShader:G0,fragmentShader:H0,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:Oa})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new nn,this.group.add(n,this.stars),this.mapRT=new an(256,128,{type:Un,depthBuffer:!1}),this.mapRT.texture.wrapS=Ei,this.mapScene=new ss;const l=new te(Qs(),new pe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:B0,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));l.frustumCulled=!1,this.mapScene.add(l),this.mapCam=new is(-1,1,1,-1,0,1),this.astro={},this._v=new U}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const a=U0(t,e,this.astro),r=a.sun,o=this.uniforms;o.uSun.value.copy(r),o.uMoon.value.copy(a.moon),o.uPhase.value=a.phase,o.uIllum.value=a.illum,o.uLst.value=a.lst/24*2*Math.PI;const l=rn.smoothstep(-r.y,-.02,.2);o.uNight.value=l,this.starUniforms.uNight.value=l,this.starUniforms.uTime.value=n;const c=this.params,h=this._v,d=Ia(h.set(0,1,0),r,c),u=[0,0,0];for(let y=0;y<8;y++){const b=y/8*Math.PI*2,D=Ia(h.set(Math.cos(b),.08,Math.sin(b)).normalize(),r,c);for(let S=0;S<3;S++)u[S]+=D[S]/8}const m=Ia(h.set(r.x,.05,r.z).normalize(),r,c),v=z0(r,c),g=rn.smoothstep(r.y,-.04,.06),p=3.2;i.sunColor.setRGB(v[0]*p*g,v[1]*p*g,v[2]*p*g);const f=[.0035,.005,.011],_=rn.smoothstep(a.moon.y,-.02,.1)*a.illum*l;i.skyColor.setRGB(d[0]*.55+u[0]*.45+f[0]+.012*_,d[1]*.55+u[1]*.45+f[1]+.016*_,d[2]*.55+u[2]*.45+f[2]+.024*_);const M=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new vt(M,M,M),.35),i.zenith.setRGB(d[0],d[1],d[2]),i.horizon.setRGB(u[0]+f[0],u[1]+f[1],u[2]+f[2]),i.sunHorizon.setRGB(m[0],m[1],m[2]);const w=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,r.y)+i.skyColor.r)*w*1.1,(i.sunColor.g*Math.max(0,r.y)+i.skyColor.g)*w,(i.sunColor.b*Math.max(0,r.y)+i.skyColor.b)*w*.8),i.moonColor.setRGB(.05*_,.06*_,.085*_),i.moonDir.copy(a.moon),i.sunDir.copy(r),i.night=l,a}}const Fa=Math.PI*2,W0=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,Wr=s=>((s+Math.PI)%Fa+Fa)%Fa-Math.PI;class X0{constructor(t,e,n){this.camera=t,this.dom=e,this.terrain=n,this.state={target:new U(0,0,20),distance:420,yaw:.35,pitch:.62,lift:0},this.goal={target:this.state.target.clone(),distance:420,yaw:.35,pitch:.62,lift:0},this.flight=null,this.floor=0,this.minDistance=.5,this.maxDistance=900,this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this._ray=new g0,this._v=new U,this.bind()}bind(){const t=this.dom,e=new Map;let n=null,i=null,a=null;t.addEventListener("contextmenu",o=>o.preventDefault()),t.addEventListener("pointerdown",o=>{this.enabled&&(t.setPointerCapture(o.pointerId),e.set(o.pointerId,{x:o.clientX,y:o.clientY}),e.size===1?(n=o.button===2||o.shiftKey||o.ctrlKey||o.metaKey?"pan":"orbit",i={x:o.clientX,y:o.clientY},this.panAnchor=n==="pan"?this.pickGround(o.clientX,o.clientY):null):e.size===2&&(n="pinch",a=this.pinchState(e)),this.touch())}),t.addEventListener("pointermove",o=>{if(e.has(o.pointerId)){if(e.set(o.pointerId,{x:o.clientX,y:o.clientY}),n==="orbit"&&i){const l=o.clientX-i.x,c=o.clientY-i.y;this.goal.yaw-=l*.005,this.goal.pitch=rn.clamp(this.goal.pitch+c*.004,.06,1.52),i={x:o.clientX,y:o.clientY},this.touch()}else if(n==="pan"&&i)this.panBy(o.clientX-i.x,o.clientY-i.y),i={x:o.clientX,y:o.clientY},this.touch();else if(n==="pinch"&&e.size===2){const l=this.pinchState(e),c=a.dist/Math.max(20,l.dist);this.goal.distance=rn.clamp(this.goal.distance*c,this.minDistance,this.maxDistance),this.panBy(l.cx-a.cx,l.cy-a.cy),this.goal.yaw-=Wr(l.angle-a.angle),this.goal.pitch=rn.clamp(this.goal.pitch+(l.cy-a.cy)*0,.06,1.52),a=l,this.touch()}}});const r=o=>{if(e.delete(o.pointerId),e.size===0)n=null;else if(e.size===1){const[l]=e.values();n="orbit",i={...l}}};t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r),t.addEventListener("wheel",o=>{if(!this.enabled)return;o.preventDefault();const l=Math.exp(Math.sign(o.deltaY)*Math.min(Math.abs(o.deltaY),120)*.0018);this.zoomAt(o.clientX,o.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",o=>{const l=this.pickGround(o.clientX,o.clientY);l&&this.flyTo({target:l,distance:Math.max(6,this.goal.distance*.45)},1.6)}),addEventListener("keydown",o=>{var h,d;if(!this.enabled||(d=(h=o.target).closest)!=null&&d.call(h,"input, textarea"))return;const l=this.goal.distance*.08,c={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]}[o.code];if(c&&!o.altKey){const u=Math.sin(this.goal.yaw),m=Math.cos(this.goal.yaw);this.goal.target.x+=(c[0]*m+c[1]*u)*l,this.goal.target.z+=(-c[0]*u+c[1]*m)*l,this.touch()}o.code==="KeyQ"&&(this.goal.yaw+=.12),o.code==="KeyE"&&(this.goal.yaw-=.12),(o.code==="Equal"||o.code==="NumpadAdd")&&(this.goal.distance*=.85),(o.code==="Minus"||o.code==="NumpadSubtract")&&(this.goal.distance/=.85)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,a=Math.sin(this.goal.yaw),r=Math.cos(this.goal.yaw),o=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*r-e*a*o)*i,this.goal.target.z+=(t*a-e*r*o)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),a=this.goal.distance,r=rn.clamp(a*n,this.minDistance,this.maxDistance);if(i&&r<a){const o=1-r/a;this.goal.target.lerp(i,o)}this.goal.distance=r}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new Tt((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e,n=3e3){const i=(l,c)=>Math.max(0,this.terrain.heightAt(l,c));let a=0,r=0,o=this._v;for(let l=0;l<400&&a<n;l++){o.copy(t).addScaledVector(e,a);const c=o.y-i(o.x,o.z);if(c<0){let h=r,d=a;for(let u=0;u<20;u++){const m=(h+d)/2;o.copy(t).addScaledVector(e,m),o.y-i(o.x,o.z)<0?d=m:h=m}return o.clone()}r=a,a+=Math.max(.03,c*.45,a*.002)}return null}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift},a={target:t.target?t.target.clone():i.target.clone(),distance:t.distance??i.distance,yaw:t.yaw??i.yaw,pitch:t.pitch??i.pitch,lift:t.lift??0};a.yaw=i.yaw+Wr(a.yaw-i.yaw);const r=i.target.distanceTo(a.target),o=n.hop??Math.max(0,r*.9-Math.max(i.distance,a.distance)*.6);this.flight={from:i,dest:a,t:0,duration:e,hop:o,onDone:n.onDone}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,(e=t.onDone)==null||e.call(t),this.apply()}update(t){var a;const e=this.goal;if(this.flight){const r=this.flight;r.t=Math.min(1,r.t+t/r.duration);const o=W0(r.t);e.target.lerpVectors(r.from.target,r.dest.target,o);const l=Math.log(r.from.distance)*(1-o)+Math.log(r.dest.distance)*o;e.distance=Math.exp(l)+r.hop*Math.sin(Math.PI*o),e.yaw=r.from.yaw+(r.dest.yaw-r.from.yaw)*o,e.pitch=r.from.pitch+(r.dest.pitch-r.from.pitch)*o+.25*Math.sin(Math.PI*o)*Math.min(1,r.hop/80),e.lift=r.from.lift+(r.dest.lift-r.from.lift)*o,r.t>=1&&(this.flight=null,(a=r.onDone)==null||a.call(r))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);if(e.target.x=rn.clamp(e.target.x,-Zt*1.3,Zt*1.3),e.target.z=rn.clamp(e.target.z,-Zt*1.3,Zt*1.3),!this.flight){const r=Math.max(0,this.terrain.heightAt(e.target.x,e.target.z));e.target.y+=(r-e.target.y)*(1-Math.exp(-t*6))}const n=this.state,i=this.flight?1:1-Math.exp(-t*7);n.target.lerp(e.target,i),n.distance+=(e.distance-n.distance)*i,n.yaw+=(e.yaw-n.yaw)*i,n.pitch+=(e.pitch-n.pitch)*i,n.lift+=(e.lift-n.lift)*i,this.apply(t)}groundAhead(t,e,n){const i=this.terrain;let a=i.heightAt(t,e);const r=this._prevXZ;if(r&&n>0){const o=(t-r.x)/n,l=(e-r.y)/n,c=Math.hypot(o,l),h=Math.min(2,c*.3);h>.005&&(a=Math.max(a,i.heightAt(t+o/c*h,e+l/c*h)))}return this._prevXZ=(this._prevXZ||new Tt).set(t,e),Math.max(0,a)}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const a=.12+e.distance*.03,r=this.groundAhead(n.position.x,n.position.z,t),o=Math.max(0,r+a-n.position.y);t<=0?this.floor=o:this.floor+=(o-this.floor)*(1-Math.exp(-t*(o>this.floor?9:2.5))),n.position.y+=this.floor;const l=Math.max(0,this.terrain.heightAt(n.position.x,n.position.z));n.position.y=Math.max(n.position.y,l+Math.min(.04,a*.3)),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const c=n.position.y-l;n.near=rn.clamp(Math.min(c,e.distance)*.12,.02,4),n.far=9e3,n.updateProjectionMatrix()}}const q0=`
${Ze}
${Kn}
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
`;class Y0{constructor(t,e=1024){this.rt=new an(e,e,{type:Ke,depthBuffer:!1,minFilter:ee,magFilter:ee}),this.material=new pe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:q0,uniforms:{uHeight:{value:t},uSunDir:{value:new U(0,1,0)}},depthTest:!1,depthWrite:!1}),this.scene=new ss;const n=new te(Qs(),this.material);n.frustumCulled=!1,this.scene.add(n),this.cam=new is(-1,1,1,-1,0,1),this.last=new U(0,-2,0),this.size=e,this.strips=4,this.strip=-1}get texture(){return this.rt.texture}update(t,e,n=!1){if(n||!this.drawn){this.drawn=!0,this.draw(t,e,-1);return}if(this.strip<0){if(e.angleTo(this.last)<.004)return;this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e),this.strip=0}this.draw(t,null,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e,n){e&&(this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e));const i=this.rt;if(n>=0){const r=this.size/this.strips;i.scissor.set(0,n*r,this.size,r),i.scissorTest=!0}else i.scissorTest=!1;const a=t.getRenderTarget();t.setRenderTarget(i),t.render(this.scene,this.cam),t.setRenderTarget(a),i.scissorTest=!1}}const $0=`
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
uniform float uFarCover;   // trade cumulus beyond the simulated patch
uniform float uOvercast;   // 0..1, a stratiform deck over everything (Kona storms)
uniform float uRainbow;
uniform float uSteps;
uniform float uLightSteps;
uniform float uFlash;      // lightning
uniform vec3 uFlashPos;
uniform vec2 uRes;
in vec2 vUv;

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

vec3 rainbowColour(float deg) {
  // primary bow: violet at 40.6°, red at 42.3°; secondary reversed at 50–53°
  vec3 c = vec3(0.0);
  float x = (deg - 40.4) / 2.1;
  if (x > -0.3 && x < 1.3) {
    c += vec3(smoothstep(0.55, 0.9, x) * (1.0 - smoothstep(0.95, 1.2, x)),
              smoothstep(0.25, 0.55, x) * (1.0 - smoothstep(0.6, 0.85, x)),
              smoothstep(-0.25, 0.05, x) * (1.0 - smoothstep(0.25, 0.55, x)));
  }
  float y = (deg - 50.0) / 3.4;
  if (y > -0.3 && y < 1.3) {
    c += 0.45 * vec3(smoothstep(-0.2, 0.15, y) * (1.0 - smoothstep(0.25, 0.5, y)),
                     smoothstep(0.3, 0.55, y) * (1.0 - smoothstep(0.6, 0.85, y)),
                     smoothstep(0.65, 0.9, y) * (1.0 - smoothstep(0.95, 1.25, y)));
  }
  // the sky inside the primary bow is a little brighter
  c += vec3(0.05) * (1.0 - smoothstep(30.0, 40.5, deg));
  return c;
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
  vec3 bow = rainbowColour(antiDeg) * uRainbow * smoothstep(-0.02, 0.06, uSunDir.y);
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
    } else {
      // rain: grey streaks below the base, thinning toward the ground in dry air
      // streaks: fine near the camera, a soft veil farther off
      float near = 1.0 - smoothstep(4.0, 30.0, t);
      vec3 q = vec3(p.x * mix(0.5, 3.0, near), p.y * 0.05 + uTime * 0.9, p.z * mix(0.5, 3.0, near)) + vec3(uWind.x * 0.5, 0.0, uWind.y * 0.5);
      float streak = texture(uDetail, q).r;
      float r = w.g * smoothstep(0.25, 0.75, streak + w.g * 0.4) * smoothstep(0.0, uBase * 0.3, p.y + uBase * 0.08);
      r *= mix(1.0, 0.35, near);
      // cloud overhead along the sun ray decides whether the rain is sunlit
      vec2 up = p.xz + uSunDir.xz / max(uSunDir.y, 0.05) * max(uBase - p.y, 0.0);
      float shade = exp(-weatherAll(up).r * 3.0);
      vec3 S = uSkyColor * 0.55 + sunL * shade * 0.14 + sunL * shade * bow * 3.0;
      float sigma = r * 0.14;
      float Ts = exp(-sigma * dt);
      L += T * (S * (1.0 - Ts) * fogT + uFogColor * (1.0 - fogT) * (1.0 - Ts));
      T *= Ts;
    }
    t += dt;
  }
  gl_FragColor = vec4(L, T);
}
`;class j0{constructor(t){const e=new qa(t.shape,t.shapeSize,t.shapeSize,t.shapeSize);e.format=Gs,e.minFilter=ee,e.magFilter=ee,e.wrapS=e.wrapT=e.wrapR=Ei,e.unpackAlignment=1,e.needsUpdate=!0;const n=new qa(t.detail,t.detailSize,t.detailSize,t.detailSize);n.format=Gs,n.minFilter=ee,n.magFilter=ee,n.wrapS=n.wrapT=n.wrapR=Ei,n.unpackAlignment=1,n.needsUpdate=!0,this.scale=.5,this.rt=new an(1,1,{type:Un,depthBuffer:!1}),this.uniforms={uDepth:{value:null},uWeather:{value:null},uShape:{value:e},uDetail:{value:n},uWeatherRect:{value:new le},uInvProj:{value:new Wt},uCamWorld:{value:new Wt},uCamPos:{value:new U},uSunDir:{value:new U},uSunColor:{value:new vt},uSkyColor:{value:new vt},uGroundColor:{value:new vt},uFogColor:{value:new vt},uMoonDir:{value:new U},uMoonColor:{value:new vt},uWind:{value:new Tt},uWindDir:{value:new Tt(1,0)},uTime:{value:0},uBase:{value:8},uTop:{value:28},uDensity:{value:1},uFarCover:{value:.32},uOvercast:{value:0},uRainbow:{value:1},uSteps:{value:56},uLightSteps:{value:4},uFlash:{value:0},uFlashPos:{value:new U},uRes:{value:new Tt}},this.material=new pe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:$0,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new ss;const i=new te(Qs(),this.material);i.frustumCulled=!1,this.scene.add(i),this.cam=new is(-1,1,1,-1,0,1),this.enabled=!0}get texture(){return this.rt.texture}setSize(t,e){this.full=[t,e],this.rt.setSize(Math.max(1,Math.floor(t*this.scale)),Math.max(1,Math.floor(e*this.scale))),this.uniforms.uRes.value.set(this.rt.width,this.rt.height)}setScale(t){Math.abs(t-this.scale)<.001||(this.scale=t,this.full&&this.setSize(...this.full))}render(t,e,n){const i=this.uniforms;i.uDepth.value=n,i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),t.setRenderTarget(this.rt),t.render(this.scene,this.cam)}}const Xr={moae:{name:"Moaʻe",gloss:"trade winds",bearing:62,speed:8.5,humidity:1,lcl:650,inversion:2150,patch:1,convect:.55},kona:{name:"Kona",gloss:"southerly storm",bearing:205,speed:11,humidity:1.45,lcl:420,inversion:4800,patch:1.6,convect:.8},malie:{name:"Mālie",gloss:"calm, sea breezes",bearing:110,speed:2.4,humidity:.85,lcl:900,inversion:2900,patch:.5,convect:1.5}},ze=160,Bi=Qt*1.8;class K0{constructor(t,e,n=7){this.G=ze,this.span=Bi,this.cell=Bi/ze,this.origin=-Bi/2;const i=ze*ze;this.terrain=new Float32Array(i),this.land=new Float32Array(i),this.heat=new Float32Array(i);for(let a=0;a<ze;a++)for(let r=0;r<ze;r++){const o=this.origin+(r+.5)*this.cell,l=this.origin+(a+.5)*this.cell;let c=0,h=0,d=0;for(let m=-1;m<=1;m++)for(let v=-1;v<=1;v++){const g=o+v*this.cell*.5,p=l+m*this.cell*.5,f=Math.floor((g+Qt/2)/Qt*e),x=Math.floor((p+Qt/2)/Qt*e),_=f<0||x<0||f>=e||x>=e?-500:t[x*e+f];c+=Math.max(0,_),h=Math.max(h,_),d++}const u=a*ze+r;this.terrain[u]=c/d,this.land[u]=h>0?1:0}this.qv=new Float32Array(i).fill(1),this.qc=new Float32Array(i),this.zp=new Float32Array(i),this.rain=new Float32Array(i),this.wet=new Float32Array(i),this.conv=new Float32Array(i),this.tmp=[new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i)],this.noise=Gr(n),this.noise2=Gr(n+1),this.mode="auto",this.regime="moae",this.state={...Xr.moae},this.wind=new Tt(...po(62)).multiplyScalar(8.5),this.windOffset=new Tt,this.simTime=0,this.nextChange=3600*30,this.rainTotal=0,this.data=new Float32Array(i*4),this.texture=new Zi(this.data,ze,ze,Oe,cn),this.texture.minFilter=ee,this.texture.magFilter=ee,this.texture.wrapS=this.texture.wrapT=We,this.texture.needsUpdate=!0,this.rect=new le(this.origin,this.origin,Bi,Bi),this.accum=0,this.boost=0}setMode(t){this.mode=t,t!=="auto"&&(this.regime=t)}pickRegime(t){const e=Math.random();return t==="hooilo"?e<.62?"moae":e<.8?"malie":"kona":e<.86?"moae":e<.97?"malie":"kona"}step(t,e,n,i,a=!1){if(t<=0)return;if(this.simTime+=t,this.mode==="auto"&&this.simTime>this.nextChange){this.regime=this.pickRegime(i);const y=this.regime==="moae"?30+Math.random()*60:this.regime==="kona"?14+Math.random()*20:10+Math.random()*16;this.nextChange=this.simTime+y*3600}const r=Xr[this.regime],o=1-Math.exp(-t/7200),l=this.state;for(const y of["speed","humidity","lcl","inversion","patch","convect"]){let b=r[y];this.boost&&y==="humidity"&&(b*=1.18),this.boost&&y==="patch"&&(b*=1.6),l[y]+=(b-l[y])*o}let c=r.bearing-l.bearing;c=(c+540)%360-180,l.bearing+=c*o;const h=1+.18*Math.sin((n-9)/24*Math.PI*2),d=1+.12*this.noise(this.simTime/5400,3.3),u=l.bearing+9*this.noise(this.simTime/9e3,7.7),[m,v]=po(u),g=l.speed*h*d;this.wind.set(m*g,v*g);const p=m*g/100,f=v*g/100;this.windOffset.x+=p*t,this.windOffset.y+=f*t,this.pending=(this.pending||0)+t;const x=performance.now();if(!a&&x-(this.lastPhysics||0)<80)return;this.lastPhysics=x;const _=this.pending;this.pending=0;const M=Math.hypot(p,f)*_,w=Math.max(1,Math.min(12,Math.ceil(M/(this.cell*1.5))));for(let y=0;y<w;y++)this.substep(_/w,p,f,e);this.pack()}substep(t,e,n,i){const a=ze,r=this.cell,o=this.state,[l,c,h,d,u]=this.tmp,m=e*t/r,v=n*t/r,g=this.windOffset.x,p=this.windOffset.y;for(let M=0;M<a;M++)for(let w=0;w<a;w++){const y=M*a+w,b=w-m,D=M-v;if(b<0||D<0||b>a-1||D>a-1){const q=this.origin+(b+.5)*r-g,X=this.origin+(D+.5)*r-p,$=Math.hypot(e,n)||1,Z=(q*e+X*n)/$,at=(-q*n+X*e)/$,V=A0(this.noise2,Z/60,at/24,3);l[y]=o.humidity*(1+o.patch*.55*V),c[y]=Math.max(0,V-.05)*.75*o.patch,h[y]=0,d[y]=0,u[y]=0;continue}const S=Math.min(a-2,b|0),T=Math.min(a-2,D|0),I=b-S,W=D-T,j=T*a+S,R=(1-I)*(1-W),N=I*(1-W),L=(1-I)*W,z=I*W;l[y]=this.qv[j]*R+this.qv[j+1]*N+this.qv[j+a]*L+this.qv[j+a+1]*z,c[y]=this.qc[j]*R+this.qc[j+1]*N+this.qc[j+a]*L+this.qc[j+a+1]*z,h[y]=this.zp[j]*R+this.zp[j+1]*N+this.zp[j+a]*L+this.zp[j+a+1]*z,d[y]=this.conv[j]*R+this.conv[j+1]*N+this.conv[j+a]*L+this.conv[j+a+1]*z,u[y]=this.wet[y]}const f=Math.hypot(e,n)*t*100,x=Math.max(0,i)*o.convect,_=o.lcl;for(let M=0;M<a*a;M++){const w=this.terrain[M];let y=l[M],b=c[M];const D=h[M],S=Math.max(w,D-.24*f);if(S>D){const R=Math.max(0,S-Math.max(D,_)),N=Math.min(y,y*R/650);y-=N,b+=N}else if(S<D){const R=Math.min(b,(D-S)*(.0035*b+35e-5));b-=R,y+=R}let T=d[M]*Math.exp(-t/5400);if(this.land[M]){const R=x*Hr(80,700,w)*(1-.6*Hr(.85,1.2,o.humidity))*45e-7,N=Math.min(y*.2,R*t*y);y-=N,b+=N,T=Math.min(1,T+R*t*4)}else{y+=(o.humidity-y)*(1-Math.exp(-t/2400));const R=Math.max(0,y-o.humidity*1.12)*t*12e-5;y-=R,b+=R}const W=Math.max(0,b-.11)*(1-Math.exp(-t/1500));b-=W,b*=Math.exp(-t/21600);const j=W/Math.max(t,.001)*3600;this.rain[M]=this.rain[M]*.6+j*.4,u[M]=Os(u[M]*Math.exp(-t/(3600*5))+j*t/3600*3,0,1),this.qv[M]=y,this.qc[M]=b,this.zp[M]=S,this.conv[M]=T,this.wet[M]=u[M]}}pack(){const t=this.data;let e=0,n=0,i=0;for(let a=0;a<ze*ze;a++){const r=Os(this.qc[a]*4.2,0,1);t[a*4]=r;const o=Os(this.rain[a]*2.2,0,1);t[a*4+1]=o,t[a*4+2]=this.wet[a],t[a*4+3]=this.conv[a],this.land[a]&&(e+=o);const l=o*(.4+this.conv[a]);l>n&&(n=l,i=a)}this.rainTotal=e,this.stormiest={strength:n,x:this.origin+(i%ze+.5)*this.cell,z:this.origin+(Math.floor(i/ze)+.5)*this.cell},this.texture.needsUpdate=!0}spawnShower(t,e,n=6,i=.5){const a=this.G,r=(t-this.origin)/this.cell-.5,o=(e-this.origin)/this.cell-.5,l=n/this.cell;for(let c=Math.max(0,Math.floor(o-l));c<=Math.min(a-1,Math.ceil(o+l));c++)for(let h=Math.max(0,Math.floor(r-l));h<=Math.min(a-1,Math.ceil(r+l));h++){const d=Math.hypot(h-r,c-o)/l;if(d>1)continue;const u=c*a+h,m=(1-d*d)*i;this.qc[u]=Math.max(this.qc[u],.12+m*.3),this.rain[u]=Math.max(this.rain[u],m*.6),this.conv[u]=Math.max(this.conv[u],m)}this.pack()}warm(t,e,n,i){for(let a=0;a<t*3600;a+=600)this.step(600,e,n,i,!0)}get base(){return this.state.lcl*sn}get top(){return this.state.inversion*sn}}const Ae=.016,Y={plain:0,thatch:1,stone:2,leaf:3,kapa:5,wood:6,skin:7};class Ce{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.xf=null,this.stack=[]}at(t,e,n,i=0,a=Ae){this.stack.push(this.xf);const r=Math.cos(i),o=Math.sin(i);return this.xf=l=>[t+(l[0]*r-l[2]*o)*a,e+l[1]*a,n+(l[0]*o+l[2]*r)*a],this}done(){return this.xf=this.stack.pop()||null,this}get count(){return this.pos.length/3}tri(t,e,n,i,a=0,r=!0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const o=e[0]-t[0],l=e[1]-t[1],c=e[2]-t[2],h=n[0]-t[0],d=n[1]-t[1],u=n[2]-t[2];let m=l*u-c*d,v=c*h-o*u,g=o*d-l*h;const p=Math.hypot(m,v,g)||1;m/=p,v/=p,g/=p;for(const f of[t,e,n])this.pos.push(f[0],f[1],f[2]),this.nor.push(m,v,g),this.col.push(i[0],i[1],i[2]),this.mat.push(a)}quad(t,e,n,i,a,r=0){this.tri(t,e,n,a,r),this.tri(t,n,i,a,r)}hexa(t,e,n,i=0){this.quad(e[0],e[3],e[2],e[1],n,i),this.quad(t[0],t[1],t[2],t[3],n,i);for(let a=0;a<4;a++)this.quad(t[a],e[a],e[(a+1)%4],t[(a+1)%4],n,i)}box(t,e,n,i,a,r,o,l=0,c=0,h=1){const d=Math.cos(c),u=Math.sin(c),m=(M,w,y)=>[t+M*d-y*u,e+w,n+M*u+y*d],v=i/2,g=r/2,p=v*h,f=g*h,x=[m(-v,0,-g),m(v,0,-g),m(v,0,g),m(-v,0,g)],_=[m(-p,a,-f),m(p,a,-f),m(p,a,f),m(-p,a,f)];a<0?this.hexa(_,x,o,l):this.hexa(x,_,o,l)}cyl(t,e,n,i,a,r=0,o=6,l=!1){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],h=Math.hypot(...c)||1,d=c.map(f=>f/h),u=Math.abs(d[1])<.9?[0,1,0]:[1,0,0];let m=[d[1]*u[2]-d[2]*u[1],d[2]*u[0]-d[0]*u[2],d[0]*u[1]-d[1]*u[0]];const v=Math.hypot(...m);m=m.map(f=>f/v);const g=[d[1]*m[2]-d[2]*m[1],d[2]*m[0]-d[0]*m[2],d[0]*m[1]-d[1]*m[0]],p=(f,x,_)=>{const M=_/o*Math.PI*2,w=Math.cos(M)*x,y=Math.sin(M)*x;return[f[0]+m[0]*w+g[0]*y,f[1]+m[1]*w+g[1]*y,f[2]+m[2]*w+g[2]*y]};for(let f=0;f<o;f++){const x=p(t,n,f),_=p(t,n,f+1),M=p(e,i,f),w=p(e,i,f+1);this.quad(x,_,w,M,a,r),l&&this.tri(e,M,w,a,r)}}blob(t,e,n,i,a,r,o,l=0,c=0,h=l===Y.leaf,d=1){const u=(1+Math.sqrt(5))/2,m=[[-1,u,0],[1,u,0],[-1,-u,0],[1,-u,0],[0,-1,u],[0,1,u],[0,-1,-u],[0,1,-u],[u,0,-1],[u,0,1],[-u,0,-1],[-u,0,1]],v=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],g=M=>.85+.3*Math.abs(Math.sin(M*12.9898+c*78.233)*43758.5453%1),p=m.map((M,w)=>{const y=Math.hypot(...M),b=g(w);return[t+M[0]/y*i*b,e+M[1]/y*a*b,n+M[2]/y*r*b]});if(!h){for(const M of v)this.tri(p[M[0]],p[M[1]],p[M[2]],o,l);return}const f=(M,w)=>{const y=[(M[0]+w[0])/2,(M[1]+w[1])/2,(M[2]+w[2])/2],b=[(y[0]-t)/i,(y[1]-e)/a,(y[2]-n)/r],D=Math.hypot(...b)||1,S=.9+.2*Math.abs(Math.sin(y[0]*91.7+y[2]*47.3+c)*43758.5453%1);return[t+b[0]/D*i*S,e+b[1]/D*a*S,n+b[2]/D*r*S]},x=M=>{const w=[(M[0]-t)/(i*i),(M[1]-e)/(a*a),(M[2]-n)/(r*r)],y=Math.hypot(...w)||1;return[w[0]/y,w[1]/y,w[2]/y]},_=(M,w,y)=>{const b=this.xf?[this.xf(M),this.xf(w),this.xf(y)]:[M,w,y],D=[x(M),x(w),x(y)];for(let S=0;S<3;S++)this.pos.push(...b[S]),this.nor.push(...D[S]),this.col.push(o[0],o[1],o[2]),this.mat.push(l)};if(d===0){for(const M of v)_(p[M[0]],p[M[1]],p[M[2]]);return}for(const M of v){const w=p[M[0]],y=p[M[1]],b=p[M[2]],D=f(w,y),S=f(y,b),T=f(b,w);_(w,D,T),_(D,y,S),_(T,S,b),_(D,S,T)}}wall(t,e,n,i,a=Y.stone,r=.7){const o=t.length;if(o<2)return;const l=o>2&&Math.hypot(t[0][0]-t[o-1][0],t[0][2]-t[o-1][2])<1e-9,c=[];for(let g=0;g<o-1;g++){const p=t[g+1][0]-t[g][0],f=t[g+1][2]-t[g][2],x=Math.hypot(p,f)||1;c.push([-f/x,p/x])}const h=t.map((g,p)=>{let f=c[p-1],x=c[p];if(l&&p===0&&(f=c[o-2]),l&&p===o-1&&(x=c[0]),!f)return x;if(!x)return f;const _=f[0]+x[0],M=f[1]+x[1],w=Math.hypot(_,M);if(w<1e-6)return x;const y=1/Math.max(.35,(_*x[0]+M*x[1])/w);return[_/w*y,M/w*y]}),d=e/2,u=e*r/2,m=(g,p,f,x)=>[g[0]+p[0]*f,g[1]+x,g[2]+p[1]*f],v=g=>[m(t[g],h[g],-d,-n*.3),m(t[g],h[g],d,-n*.3),m(t[g],h[g],u,n),m(t[g],h[g],-u,n)];for(let g=0;g<o-1;g++){const[p,f,x,_]=v(g),[M,w,y,b]=v(g+1);this.quad(_,x,y,b,i,a),this.quad(f,w,y,x,i,a),this.quad(M,p,_,b,i,a)}if(!l){const[g,p,f,x]=v(0),[_,M,w,y]=v(o-1);this.quad(g,p,f,x,i,a),this.quad(M,_,y,w,i,a)}}geometry(){const t=new Se;return t.setAttribute("position",new ne(this.pos,3)),t.setAttribute("normal",new ne(this.nor,3)),t.setAttribute("color",new ne(this.col,3)),t.setAttribute("aMat",new ne(this.mat,1)),t.computeBoundingSphere(),t}}function ht(s,t=0,e=Math.random){const n=new vt(s),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const Z0=`
${Ze}
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
`,J0=`
${Ze}
${as}
${Kn}
${os}
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
`;function ji(s,t={}){const[e,n]=t.fade||[120,160];return new pe({vertexShader:Z0,fragmentShader:J0,vertexColors:!0,side:t.doubleSide?$e:wn,uniforms:{...s.uniforms,uWindVec:s.uniforms.uWindVec||{value:new Tt(1,0)},uFadeNear:{value:e},uFadeFar:{value:n},uFadeClose:{value:t.close||0},uFadeIn:{value:new Tt(...t.fadeIn||[0,0])},uSway:{value:t.sway||0},uObjDebug:{value:0}}})}const ce={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",stoneDark:"#4f4844",wood:"#6b4a2f",koa:"#7a4a2a",kapa:"#efe8d8",salt:"#f2ece4"};function ks(s,t,e=7,n=4.6,i=5.2,a=!0){const r=ht(ce.thatch,.18,t),o=ht(ce.thatchDark,.15,t),l=ht(ce.stone,.15,t);s.box(0,-.6,0,e+1.8,1.05,n+1.8,l,Y.stone);const c=.45,h=c+1.05;s.box(0,c,0,e,h-c,n,r,Y.thatch);const d=e/2+.35,u=n/2+.45,m=c+i,v=[-d,h-.15,-u],g=[d,h-.15,-u],p=[-d,m,0],f=[d,m,0],x=[-d,h-.15,u],_=[d,h-.15,u];s.quad(v,p,f,g,r,Y.thatch),s.quad(_,f,p,x,r,Y.thatch),s.quad(g,f,p,v,o,Y.thatch),s.quad(x,p,f,_,o,Y.thatch);const M=e/2;if(s.tri([-M,h,-n/2],[-M,h,n/2],[-M,m-.2,0],r,Y.thatch),s.tri([M,h,n/2],[M,h,-n/2],[M,m-.2,0],r,Y.thatch),s.box(0,m-.12,0,e+.9,.35,.55,o,Y.thatch),a){const w=[.05,.035,.025];s.quad([M+.02,c,-.45],[M+.02,c+1.4,-.45],[M+.02,c+1.4,.45],[M+.02,c,.45],w,0)}}function Fl(s,t,e,n,i){const a=ht(ce.wood,.25,i);s.cyl([t,0,e],[t,n*.62,e],.22,.18,a,Y.wood,5),s.box(t,n*.6,e,.75,n*.28,.6,a,Y.wood,i()*.3,.85),s.box(t,n*.86,e,.35,n*.16,.35,a,Y.wood,0,.6)}function Q0(s,t,e,n,i){const a=ht(ce.kapa,.05,i),r=ht(ce.wood,.2,i);s.box(t,0,e,2.6,n,2.6,a,Y.kapa,.1,.62);for(const[o,l]of[[-1.35,-1.35],[1.35,-1.35],[1.35,1.35],[-1.35,1.35]])s.cyl([t+o,0,e+l],[t+o*.55,n+.8,e+l*.55],.12,.08,r,Y.wood,4)}function tm(s,t,e,n){const i=ht(ce.wood,.2,n);for(const[a,r]of[[-.9,-.6],[.9,-.6],[.9,.6],[-.9,.6]])s.cyl([t+a,0,e+r],[t+a,2.6,e+r],.09,.08,i,Y.wood,4);s.box(t,2.5,e,2.2,.18,1.6,i,Y.wood),s.blob(t,2.85,e,.5,.25,.4,ht("#c9a35a",.2,n),Y.plain,1)}function qr(s,t,e,n,i,a,r,o){const l=ht(ce.stone,.12,a),c=ht(ce.stoneDark,.12,a),h=r?44:26,d=r?30:18,u=r?3:2;s.at(t,e,n,i,o);let m=-1.5;for(let _=0;_<u;_++){const M=1-_*.14,w=(r?1.6:1.2)+(_===0?1.5:0);s.box(0,m,0,h*M,w,d*M,_%2?c:l,Y.stone),m+=w}const v=1-(u-1)*.14,g=h*v/2,p=d*v/2,f=r?2.2:1.5;s.box(0,m,-p+.8,h*v,f,1.6,c,Y.stone),s.box(0,m,p-.8,h*v,f,1.6,c,Y.stone),s.box(-g+.8,m,0,1.6,f,d*v,c,Y.stone),s.done(),s.at(t,e+m*o,n,i,o),Q0(s,-g*.55,0,r?11:7.5,a);const x=r?7:4;for(let _=0;_<x;_++){const M=(_/(x-1)-.5)*1.6;Fl(s,-g*.55+Math.cos(M)*(r?8:5),Math.sin(M)*(r?8:5),r?4.2:3.2,a)}return tm(s,g*.15,0,a),s.done(),s.at(t+Math.cos(i)*g*.45*o-Math.sin(i)*p*.35*o,e+m*o,n+Math.sin(i)*g*.45*o+Math.cos(i)*p*.35*o,i,o),ks(s,a,r?8:6,r?5:4,r?6:4.5,!1),s.done(),m}function Nl(s,t,e=8){const n=ht(ce.koa,.2,t),i=ht("#4a2c18",.2,t),a=e/2;s.box(0,0,0,e*.8,.55,.62,n,Y.wood,0,.9),s.box(a*.85,.05,0,e*.2,.6,.4,i,Y.wood,0,.5),s.box(-a*.85,.05,0,e*.2,.55,.4,i,Y.wood,0,.5);const r=-2.4;for(const o of[-e*.15,e*.15])s.cyl([o,.55,0],[o,.5,r],.06,.06,i,Y.wood,4);s.box(0,.05,r,e*.5,.28,.24,i,Y.wood,0,.8)}function zl(s,t,e=18){const n=ht(ce.koa,.15,t),i=ht("#4a2c18",.15,t);for(const r of[-2.2,2.2])s.box(0,0,r,e*.82,1,1,n,Y.wood,0,.88),s.box(e*.45,.2,r,e*.14,1.2,.6,i,Y.wood,0,.5),s.box(-e*.45,.2,r,e*.14,1.1,.6,i,Y.wood,0,.5);s.box(0,1,0,e*.42,.2,5.2,i,Y.wood),s.box(-e*.08,1.2,0,3.2,1.4,2.4,ht(ce.thatch,.1,t),Y.thatch,0,.7);const a=ht("#c9ac78",.08,t);s.cyl([e*.1,1.1,0],[e*.05,9.5,0],.12,.08,i,Y.wood,4),s.quad([e*.12,1.4,.05],[e*.36,8.8,.05],[e*.02,10.8,.05],[e*.05,4,.05],a,Y.plain),s.quad([e*.05,4,-.05],[e*.02,10.8,-.05],[e*.36,8.8,-.05],[e*.12,1.4,-.05],a,Y.plain)}function em(s,t,e=16,n=6){const i=ht(ce.thatch,.15,t),a=ht(ce.thatchDark,.15,t),r=ht(ce.wood,.2,t),o=4.8,l=e/2,c=n/2+.3;s.quad([-l,.3,-c],[-l,o,0],[l,o,0],[l,.3,-c],i,Y.thatch),s.quad([l,.3,c],[l,o,0],[-l,o,0],[-l,.3,c],i,Y.thatch),s.quad([l,.3,-c],[l,o,0],[-l,o,0],[-l,.3,-c],a,Y.thatch),s.quad([-l,.3,c],[-l,o,0],[l,o,0],[l,.3,c],a,Y.thatch),s.tri([-l,.3,c],[-l,.3,-c],[-l,o,0],a,Y.thatch),s.tri([-l,.3,-c],[-l,.3,c],[-l,o,0],i,Y.thatch),s.box(0,o-.1,0,e+.4,.3,.45,a,Y.thatch),s.cyl([l,0,0],[l,o,0],.15,.12,r,Y.wood,5)}function nm(s,t,e=!0){const n=ht(ce.stone,.2,t);for(let i=0;i<9;i++){const a=t()*Math.PI*2,r=1.4*(1-i/10);s.blob(Math.cos(a)*r*.5,i*.28,Math.sin(a)*r*.5,.75,.45,.7,n,Y.stone,i+t())}if(s.box(0,2.3,0,1.6,.25,1.3,ht("#5d5650",.1,t),Y.stone),e){const i=ht("#3b2a1e",.2,t);s.box(0,2.55,0,1,.75,.6,i,Y.wood,0,.8),s.box(.65,2.7,0,.5,.35,.35,i,Y.wood,0,.7),s.box(-.2,3.25,-.2,.15,.3,.12,i,Y.wood),s.box(-.2,3.25,.2,.15,.3,.12,i,Y.wood)}}function im(s,t,e=7){const n=ht(ce.wood,.1,t),i=ht(ce.kapa,.04,t);s.cyl([0,0,0],[0,e,0],.09,.07,n,Y.wood,5),s.cyl([0,e*.82,-1.6],[0,e*.82,1.6],.06,.06,n,Y.wood,4),s.quad([.02,e*.82,-1.5],[.02,e*.82,1.5],[.02,e*.3,1.3],[.02,e*.3,-1.3],i,Y.kapa),s.quad([-.02,e*.3,-1.3],[-.02,e*.3,1.3],[-.02,e*.82,1.5],[-.02,e*.82,-1.5],i,Y.kapa),s.box(0,e*.85,-1.55,.1,-1.6,.1,ht("#e2b13c",.1,t),Y.plain),s.box(0,e*.85,1.55,.1,-1.6,.1,ht("#e2b13c",.1,t),Y.plain),s.blob(0,e+.2,0,.35,.45,.35,ht("#3d2c1f",.1,t),Y.wood,2)}function sm(s,t){const e=ht(ce.stone,.2,t);s.box(0,-.3,0,3.2,.8,2.4,e,Y.stone,0,.85);for(let n=0;n<5;n++)s.blob((t()-.5)*1.4,.7+n*.25,(t()-.5)*1,.45,.3,.4,e,Y.stone,n);s.blob(0,2,0,.45,.35,.45,ht("#f3efe6",.05,t),Y.kapa,3)}function am(s,t){const e=ht("#4d4642",.2,t);for(let n=0;n<7;n++)s.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,Y.stone,n)}const om=`
${Ze}
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
`,rm=`
${Ze}
${as}
${Kn}
${os}
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
`;class lm{constructor(t,e,n){this.group=new nn;const i=[],a=[],r=[],o=new Ce,l=ht("#5f8a3a",.15,Math.random),c=ht("#7a7a45",.1,Math.random),h=.06;for(const u of t.loi){for(const v of u.paddies){const g=(v.level+h)*sn,p=v.quad;for(const x of[0,1,2,0,2,3])i.push(p[x][0],g,p[x][1]),a.push(v.age),r.push(v.flood);const f=[...p,p[0]].map(x=>[x[0],g,x[1]]);o.wall(f,.011,.007,Math.random()<.8?l:c,Y.plain,.6)}const m=u.auwai;for(let v=0;v<m.length-1;v++){const g=m[v],p=m[v+1],f=p[0]-g[0],x=p[1]-g[1],_=Math.hypot(f,x)||1;if(_>1.2)continue;const M=-x/_*.012,w=f/_*.012,y=Math.max(e.heightAt(g[0],g[1]),g[2]*sn)+.002,b=Math.max(e.heightAt(p[0],p[1]),p[2]*sn)+.002,D=[[g[0]-M,y,g[1]-w],[p[0]-M,b,p[1]-w],[p[0]+M,b,p[1]+w],[g[0]+M,y,g[1]+w]];for(const S of[0,1,2,0,2,3])i.push(...D[S]),a.push(0),r.push(0)}}const d=new Se;d.setAttribute("position",new ne(i,3)),d.setAttribute("aAge",new ne(a,1)),d.setAttribute("aFlood",new ne(r,1)),d.computeBoundingSphere(),this.material=new pe({vertexShader:om,fragmentShader:rm,uniforms:{...n.uniforms},side:$e,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2}),this.paddies=new te(d,this.material),this.group.add(this.paddies),this.banksGeometry=o.geometry()}}const Yr={noa:[7,4.6,5.2],mua:[8,5,5.6],aina:[6,4.2,4.6],kuku:[5,3.6,4],alii:[12,7,7.5]};class cm{constructor(t){const{terrain:e,shared:n}=t,i=t.island.meta,a=i.sites;this.app=t,this.meta=i,this.sites=a,this.group=new nn;const r=rs(i.seed+77),o=new Ce,l=(c,h)=>Math.max(e.heightAt(c,h),0);for(const c of a.houses){const[h,d,u]=Yr[c.kind]||Yr.noa,m=c.scale||1;o.at(c.x,l(c.x,c.z),c.z,c.rot),ks(o,r,h*m,d*m,u*m),o.done()}for(const c of a.villages){const h=r()*Math.PI*2,d=c.x+Math.cos(h)*.35,u=c.z+Math.sin(h)*.35;o.at(d,l(d,u),u,0),am(o,r),o.done()}for(const c of a.heiau)qr(o,c.x,l(c.x,c.z),c.z,c.rot,r,c.kind==="luakini",Ae);this.beaches=[];for(const c of a.canoes){const h=c.dir,d=h+Math.PI/2;for(let u=0;u<c.n;u++){const m=(u-(c.n-1)/2)*.09,v=c.x+Math.cos(d)*m,g=c.z+Math.sin(d)*m;o.at(v,l(v,g)+.002,g,h),Nl(o,r,7+r()*4),o.done()}if(c.house){const u=c.x-Math.cos(h)*.32,m=c.z-Math.sin(h)*.32;o.at(u,l(u,m),m,h),em(o,r),o.done()}this.beaches.push(c)}if(a.alii){const c=a.canoes.find(h=>h.village===a.alii.id);if(c){const h=c.dir+Math.PI/2,d=c.x+Math.cos(h)*.45,u=c.z+Math.sin(h)*.45;o.at(d,l(d,u)+.002,u,c.dir),zl(o,r),o.done()}}for(const c of a.koa)o.at(c.x,l(c.x,c.z),c.z,r()*6),sm(o,r),o.done();for(const c of i.ahu)o.at(c.x,l(c.x,c.z),c.z,r()*6),nm(o,r,!0),o.done();this.ponds=a.ponds,this.pondMask(t);for(const c of a.ponds)this.buildPond(o,c,r);a.puuhonua&&this.buildPuuhonua(o,a.puuhonua,r),a.holua&&this.buildHolua(o,a.holua,r);for(const c of a.saltpans)this.buildSalt(o,c,r);this.material=ji(n,{fade:[70,110]}),this.structures=new te(o.geometry(),this.material),this.structures.frustumCulled=!1,this.group.add(this.structures),this.loi=new lm(a,e,n),this.group.add(this.loi.group),this.banks=new te(this.loi.banksGeometry,this.material),this.banks.frustumCulled=!1,this.group.add(this.banks)}pondMask(t){const e=hn,n=t.seaData,i=Qt/e;for(const a of this.ponds){const r=a.wall,o=r.map(m=>m[0]),l=r.map(m=>m[1]),c=Math.max(0,Math.floor((Math.min(...o)+Zt)/i)),h=Math.min(e-1,Math.ceil((Math.max(...o)+Zt)/i)),d=Math.max(0,Math.floor((Math.min(...l)+Zt)/i)),u=Math.min(e-1,Math.ceil((Math.max(...l)+Zt)/i));for(let m=d;m<=u;m++)for(let v=c;v<=h;v++){const g=-Zt+(v+.5)*i,p=-Zt+(m+.5)*i;hm(r,g,p)&&(n[(m*e+v)*4]=255)}}t.seaTex.needsUpdate=!0}buildPond(t,e,n){const i=ht("#8a817a",.12,n),a=e.wall,r=a.length;let o=[];const l=()=>{o.length>1&&t.wall(o,.1,.024,i,Y.stone,.72),o=[]};for(let m=0;m<r;m++){const v=m/(r-1);if(e.gates.some(p=>Math.abs(p-v)<.022)){l();continue}o.push([a[m][0],0,a[m][1]])}l();const c=ht(ce.wood,.15,n);for(const m of e.gates){const v=Math.round(m*(r-1)),g=a[Math.max(0,v-1)],p=a[Math.min(r-1,v+1)],f=Math.atan2(p[1]-g[1],p[0]-g[0]),x=a[v][0],_=a[v][1];t.at(x,0,_,f);for(let M=-3;M<=3;M++)t.box(M*.55,-.4,0,.12,1.9,.12,c,Y.wood);t.box(0,1.25,0,4.2,.15,.2,c,Y.wood),t.done()}const h=Math.round(e.gates[0]*(r-1)),d=a[h][0]-e.ax*.12,u=a[h][1]-e.az*.12;t.at(d,.004,u,n()*3),ks(t,n,4,3,3.4),t.done()}buildPuuhonua(t,e,n){const{terrain:i}=this.app,a=e.dir,r=Math.cos(a),o=Math.sin(a),l=-o,c=r,h=e.x-r*1.6,d=e.z-o*1.6,u=_=>{for(let M=.3;M<9;M+=.15)if(i.heightAt(h+l*M*_,d+c*M*_)<=.002)return M;return 4},m=u(-1),v=u(1),g=[];for(let _=-m;_<=v;_+=.12){const M=h+l*_,w=d+c*_;g.push([M,Math.max(0,i.heightAt(M,w)),w])}const p=ht(ce.stoneDark,.1,n);t.wall(g,.08,.06,p,Y.stone,.8);const f=e.x-r*.5,x=e.z-o*.5;qr(t,f,Math.max(0,i.heightAt(f,x)),x,a,n,!1,Ae);for(let _=0;_<6;_++){const M=(_-2.5)*.12,w=e.x+l*M-r*.05,y=e.z+c*M-o*.05;t.at(w,Math.max(0,i.heightAt(w,y)),y,a),Fl(t,0,0,4,n),t.done()}for(let _=0;_<3;_++){const M=h+r*.5+l*(_-1)*.6,w=d+o*.5+c*(_-1)*.6;t.at(M,Math.max(0,i.heightAt(M,w)),w,a+Math.PI/2),ks(t,n,6,4,4.2),t.done()}this.puuhonuaWall={a:g[0],b:g[g.length-1]}}buildHolua(t,e,n){const{terrain:i}=this.app,a=Math.ceil(Math.hypot(e.x1-e.x0,e.z1-e.z0)/.08),r=[];for(let l=0;l<=a;l++){const c=l/a,h=e.x0+(e.x1-e.x0)*c,d=e.z0+(e.z1-e.z0)*c;r.push([h,i.heightAt(h,d)+.004,d])}t.wall(r,.11,.014,ht("#8a817a",.1,n),Y.stone,.75);const o=ht("#c2b25e",.1,n);for(let l=0;l<r.length-1;l++){const c=r[l],h=r[l+1],d=h[0]-c[0],u=h[2]-c[2],m=Math.hypot(d,u)||1,v=-u/m*.034,g=d/m*.034,p=c[1]+.0145,f=h[1]+.0145;t.quad([c[0]-v,p,c[2]-g],[c[0]+v,p,c[2]+g],[h[0]+v,f,h[2]+g],[h[0]-v,f,h[2]-g],o,Y.plain)}this.holuaPath=r}buildSalt(t,e,n){const{terrain:i}=this.app,a=e.dir+Math.PI/2,r=ht(ce.salt,.06,n),o=ht("#7d5b44",.12,n);for(let l=0;l<4;l++)for(let c=0;c<3;c++){const h=(l-1.5)*.11,d=(c-1)*.09,u=e.x+Math.cos(a)*h-Math.sin(a)*d,m=e.z+Math.sin(a)*h+Math.cos(a)*d,v=Math.max(i.heightAt(u,m),.004);t.at(u,v,m,a),t.box(0,-.3,0,6.6,.5,5.4,o,Y.plain),t.box(0,.05,0,5.8,.18,4.6,n()<.7?r:ht("#d9c2b4",.05,n),Y.kapa),t.done()}}}function hm(s,t,e){let n=!1;for(let i=0,a=s.length-1;i<s.length;a=i++){const r=s[i],o=s[a];r[1]>e!=o[1]>e&&t<(o[0]-r[0])*(e-r[1])/(o[1]-r[1])+r[0]&&(n=!n)}return n}function um(s){const t=new Ce,e=ht("#8a7a62",.1,s),n=14;let i=[0,0,0];const a=.06;for(let h=1;h<=6;h++){const d=h/6*n,u=[a*Math.pow(d,1.5),d,0];t.cyl(i,u,.28-h*.02,.26-h*.025,e,Y.wood,6),i=u}const r=i,o=ht("#4c7a2c",.12,s),l=ht("#8f9a43",.1,s);for(let h=0;h<13;h++){const d=h/13*Math.PI*2+s()*.3,u=5.2+s()*1.2,m=1.4+s()*.8,v=Math.cos(d),g=Math.sin(d);let p=r;for(let f=1;f<=5;f++){const x=f/5,_=[r[0]+v*u*x,r[1]+m*x-3.8*x*x,r[2]+g*u*x],M=1*Math.sin(Math.PI*Math.min(1,x*1.1))+.15,w=-g*M,y=v*M,b=f>3?l:o;t.quad([p[0],p[1],p[2]],[_[0],_[1],_[2]],[_[0]+w,_[1]-.35*M,_[2]+y],[p[0]+w*.7,p[1]-.25*M,p[2]+y*.7],b,Y.leaf),t.quad([p[0]-w*.7,p[1]-.25*M,p[2]-y*.7],[_[0]-w,_[1]-.35*M,_[2]-y],[_[0],_[1],_[2]],[p[0],p[1],p[2]],b,Y.leaf),p=_}}const c=ht("#5c4a24",.1,s);for(let h=0;h<4;h++)t.blob(r[0]+Math.cos(h*1.7)*.4,r[1]-.6,r[2]+Math.sin(h*1.7)*.4,.3,.35,.3,c,Y.plain,h);return t.geometry()}function Gi(s,{trunkH:t,crownR:e,color:n,trunkColor:i="#5a4636",blobs:a=3,flatten:r=1,red:o=0}){const l=new Ce,c=ht(i,.1,s);l.cyl([0,0,0],[.3,t,.1],.35,.22,c,Y.wood,5);for(let h=0;h<a;h++){const d=h/a*Math.PI*2+s(),u=h===0?0:e*.45,m=ht(n,.18,s);l.blob(.3+Math.cos(d)*u,t+e*.35*r+(h===0?e*.2:0),.1+Math.sin(d)*u,e*(h===0?1:.75),e*.62*r,e*(h===0?1:.75),m,Y.leaf,h+s())}if(o>0){const h=ht("#9e2a22",.15,s);for(let d=0;d<o;d++){const u=s()*Math.PI*2,m=s()*.8;l.blob(.3+Math.cos(u)*e*.8,t+e*(.35+m*.45),.1+Math.sin(u)*e*.8,.7,.35,.7,h,Y.leaf,d)}}return l.geometry()}function dm(s,{trunkH:t,crownR:e,color:n,trunkColor:i="#5a4636",flatten:a=1}){const r=new Ce;return r.cyl([0,0,0],[.3,t,.1],.4,.25,ht(i,.1,s),Y.wood,3),r.blob(.3,t+e*.42*a,.1,e*1.18,e*.7*a,e*1.18,ht(n,.12,s),Y.leaf,1,!0,0),r.geometry()}function fm(s,t){const e=new Ce;return e.blob(0,.55,0,1.3,.8,1.3,ht(t,.15,s),Y.leaf,1,!0,0),e.geometry()}function pm(s){const t=new Ce,e=ht("#6b5a45",.1,s),n=ht("#4f7036",.12,s);for(let i=0;i<4;i++){const a=i/4*Math.PI*2;t.cyl([Math.cos(a)*1.1,0,Math.sin(a)*1.1],[0,1.4,0],.08,.1,e,Y.wood,4)}t.cyl([0,1.2,0],[0,3.6,0],.22,.18,e,Y.wood,5);for(let i=0;i<3;i++){const a=i/3*Math.PI*2+.4,r=[Math.cos(a)*1.8,5.2,Math.sin(a)*1.8];t.cyl([0,3.5,0],r,.14,.1,e,Y.wood,4);for(let o=0;o<9;o++){const l=o/9*Math.PI*2,c=Math.cos(l),h=Math.sin(l),d=[r[0]+c*1.7,r[1]+.5-Math.abs(Math.sin(l))*.9,r[2]+h*1.7];t.tri([r[0]-h*.14,r[1],r[2]+c*.14],[r[0]+h*.14,r[1],r[2]-c*.14],d,n,Y.leaf)}}return t.geometry()}function mm(s){const t=new Ce,e=ht("#7c9a4a",.1,s),n=ht("#6aa538",.12,s);for(let i=0;i<4;i++){const a=s()*Math.PI*2,r=s()*.6,o=Math.cos(a)*r,l=Math.sin(a)*r,c=2.4+s()*1.4;t.cyl([o,0,l],[o,c,l],.16,.12,e,Y.leaf,5);for(let h=0;h<4;h++){const d=s()*Math.PI*2,u=Math.cos(d),m=Math.sin(d),v=[o,c,l],g=[o+u*1.6,c+.7,l+m*1.6],p=[o+u*2.6,c-.2,l+m*2.6],f=-m*.45,x=u*.45;t.quad(v,[g[0]+f,g[1],g[2]+x],[p[0]+f*.6,p[1],p[2]+x*.6],p,n,Y.leaf),t.quad(v,p,[p[0]-f*.6,p[1],p[2]-x*.6],[g[0]-f,g[1],g[2]-x],n,Y.leaf)}}return t.geometry()}function $r(s,t){const e=new Ce,n=ht("#6b5a40",.1,s),i=ht(t?"#7d2b2f":"#3f7d32",.15,s);e.cyl([0,0,0],[.05,1.6,0],.05,.04,n,Y.wood,4);for(let a=0;a<9;a++){const r=a/9*Math.PI*2,o=Math.cos(r),l=Math.sin(r),c=.3+a%3*.25;e.quad([.05-l*.06,1.6,o*.06],[.05+l*.06,1.6,-o*.06],[.05+o*.9+l*.12,1.6+c,l*.9-o*.12],[.05+o*.9-l*.12,1.6+c,l*.9+o*.12],i,Y.leaf)}return e.geometry()}function jr(s,t){const e=new Ce;for(let n=0;n<3;n++)e.blob((s()-.5)*1.2,.5,(s()-.5)*1.2,.9,.7,.9,ht(t,.2,s),Y.leaf,n);return e.geometry()}const Kr=["niu","hala","ulu","kukui","maia","ki","kiRed","ohia","koa","wiliwili","naupaka","aalii"],Hi=["ohia","koa","kukui","wiliwili","aalii"],Me=2,Na=13.5,Vi=[3.6,4.6];class gm{constructor(t){this.app=t;const e=rs(t.island.meta.seed+5150);this.geoms={niu:um(e),hala:pm(e),ulu:Gi(e,{trunkH:5,crownR:4.2,color:"#2f5a26",blobs:3}),kukui:Gi(e,{trunkH:5,crownR:5.6,color:"#6f8a5c",trunkColor:"#7b7468",blobs:5}),maia:mm(e),ki:$r(e,!1),kiRed:$r(e,!0),ohia:Gi(e,{trunkH:6,crownR:5.4,color:"#3a5e2c",trunkColor:"#4d4038",blobs:5,red:3}),koa:Gi(e,{trunkH:10,crownR:7.5,color:"#5d7449",trunkColor:"#5b4a3a",blobs:5,flatten:.7}),wiliwili:Gi(e,{trunkH:5,crownR:3.8,color:"#a3864a",trunkColor:"#8a7255",blobs:3,flatten:.8}),naupaka:jr(e,"#5f8a42"),aalii:jr(e,"#8b7c4a")};const n={ohia:{trunkH:6,crownR:5.4,color:"#3a5e2c",trunkColor:"#4d4038"},koa:{trunkH:10,crownR:7.5,color:"#5d7449",trunkColor:"#5b4a3a",flatten:.7},kukui:{trunkH:5,crownR:5.6,color:"#6f8a5c",trunkColor:"#7b7468"},wiliwili:{trunkH:5,crownR:3.8,color:"#a3864a",trunkColor:"#8a7255",flatten:.8}};this.farGeoms={...Object.fromEntries(Object.entries(n).map(([i,a])=>[i,dm(e,a)])),aalii:fm(e,"#8b7c4a")},this.fixedMat=ji(t.shared,{fade:[34,48],close:.3,sway:1,doubleSide:!0}),this.forestMat=ji(t.shared,{fade:[Vi[0],Vi[1]],close:.3,sway:1}),this.forestFarMat=ji(t.shared,{fade:[Na-3.5,Na],fadeIn:Vi,sway:1}),this.group=new nn,this.land=t.landTex.image.data,this.cleared=this.clearings(),this.fixed=this.placeFixed(e),this.meshes={};for(const i of Kr){const a=this.fixed[i];if(!a.length)continue;const r=new $i(this.geoms[i],this.fixedMat,a.length);this.writeInstances(r,a),r.frustumCulled=!1,this.group.add(r),this.meshes[i]=r}this.forest={near:{},far:{}};for(const i of Hi)this.forest.near[i]=this.forestMesh(this.geoms[i],this.forestMat,2500),this.forest.far[i]=this.forestMesh(this.farGeoms[i],this.forestFarMat,9e3);this.tiles=new Map,this.frustum=new Zs,this.projView=new Wt,this.box=new un,this.wanted=[],this.lastSelection=""}forestMesh(t,e,n){const i=new $i(t,e,n);return i.count=0,i.frustumCulled=!1,i.instanceMatrix.setUsage(Mi),i.instanceColor=new Ji(new Float32Array(n*3),3),i.instanceColor.setUsage(Mi),this.group.add(i),i}clearings(){const t=hn,e=new Uint8Array(t*t),n=Qt/t,i=(r,o,l)=>{const c=Math.max(0,Math.floor((r-l+Zt)/n)),h=Math.min(t-1,Math.floor((r+l+Zt)/n)),d=Math.max(0,Math.floor((o-l+Zt)/n)),u=Math.min(t-1,Math.floor((o+l+Zt)/n));for(let m=d;m<=u;m++)for(let v=c;v<=h;v++)e[m*t+v]=1},a=this.app.island.meta.sites;for(const r of a.loi)for(const o of r.paddies)for(const l of o.quad)i(l[0],l[1],.05);for(const r of a.houses)i(r.x,r.z,.12);for(const r of a.heiau)i(r.x,r.z,.5);for(const r of a.villages)i(r.x,r.z,.3);for(const r of this.app.island.meta.ahu)i(r.x,r.z,.3);for(const r of a.koa)i(r.x,r.z,.15);return e}isCleared(t,e){const n=hn,i=Math.floor((t+Zt)/Qt*n),a=Math.floor((e+Zt)/Qt*n);return i>=0&&a>=0&&i<n&&a<n&&this.cleared[a*n+i]===1}landAt(t,e){const n=hn,i=Math.floor((t+Zt)/Qt*n),a=Math.floor((e+Zt)/Qt*n);if(i<0||a<0||i>=n||a>=n)return null;const r=(a*n+i)*4,o=this.land;return{rain:o[r]/255,sand:o[r+1]/255,rip:o[r+2]/255,field:o[r+3]/255}}writeInstances(t,e){const n=new Wt,i=new In,a=new U,r=new U,o=new vt,l=new U(0,1,0);for(let c=0;c<e.length;c++){const h=e[c];a.set(h.x,h.y,h.z),i.setFromAxisAngle(l,h.rot),r.setScalar(h.s),n.compose(a,i,r),t.setMatrixAt(c,n),o.setRGB(h.c,h.c*(.96+.08*((h.x*997+h.z*131)%1+1)%1),h.c),t.setColorAt(c,o)}t.count=e.length,t.instanceMatrix.needsUpdate=!0,t.instanceColor&&(t.instanceColor.needsUpdate=!0)}placeFixed(t){const{terrain:e}=this.app,n=this.app.island.meta.sites,i=Object.fromEntries(Kr.map(c=>[c,[]])),a=n.houses,r=(c,h,d)=>!a.some(u=>Math.abs(u.x-c)<d&&Math.abs(u.z-h)<d&&Math.hypot(u.x-c,u.z-h)<d),o=(c,h,d,u=1)=>{const m=e.heightAt(h,d);return m<=.003?!1:(i[c].push({x:h,y:m,z:d,rot:t()*Math.PI*2,s:Ae*u*(.8+t()*.45),c:.85+t()*.3}),!0)};for(const c of n.villages){const h=c.alii?26:c.model?20:12;for(let d=0;d<h;d++){const u=t()*Math.PI*2,m=.12+t()*.7,v=c.x+Math.cos(u)*m,g=c.z+Math.sin(u)*m;if(!r(v,g,.09))continue;const p=this.landAt(v,g),f=p&&p.sand>.3||t()<.3?"niu":t()<.4?"ulu":t()<.5?"kukui":"maia";o(f,v,g)}for(let d=0;d<(c.model?24:10);d++){const u=a[Math.floor(t()*a.length)];if(u.village!==c.id)continue;const m=t()*Math.PI*2;o(t()<.75?"ki":"kiRed",u.x+Math.cos(m)*.08,u.z+Math.sin(m)*.08,.9)}}const l=this.app.island.meta.trail;for(let c=0;c<l.length;c++){const h=l[c];for(let d=0;d<3;d++){const u=h[0]+(t()-.5)*2.6,m=h[1]+(t()-.5)*2.6,v=this.landAt(u,m);if(!v)continue;const g=e.heightAt(u,m);g<=.003||g>.4||(v.sand>.4&&t()<.5?o("naupaka",u,m,.8):v.rain>.42&&t()<.5?o("hala",u,m):t()<.45?o("niu",u,m):v.rain<.3&&t()<.5&&o("aalii",u,m,.8))}}for(const c of n.loi)for(let h=0;h<c.paddies.length;h+=2){const d=c.paddies[h].quad,u=(d[2][0]+d[3][0])/2,m=(d[2][1]+d[3][1])/2,v=d[3][0]-d[0][0],g=d[3][1]-d[0][1],p=Math.hypot(v,g)||1,f=u+v/p*.06,x=m+g/p*.06,_=t();_<.3?o("maia",f,x):_<.5?o("kukui",f+v/p*.1,x+g/p*.1):_<.75&&o(t()<.8?"ki":"kiRed",f,x,.9)}return i}buildTile(t,e){const{terrain:n}=this.app,i=Math.round(Me/.17),a=Me/i,r=Object.fromEntries(Hi.map(v=>[v,[]]));let o=1/0,l=-1/0;for(let v=0;v<i;v++)for(let g=0;g<i;g++){const p=t*i+v,f=e*i+g,x=_n(p,f,11),_=_n(p,f,12),M=(p+x)*a,w=(f+_)*a,y=this.landAt(M,w);if(!y||y.sand>.2||y.field>.3||this.isCleared(M,w))continue;const b=n.metresAt(M,w);if(b<3)continue;const D=y.rain+(_n(p,f,3)-.5)*.12,S=Math.min(1,Math.max(0,(D-.3)/.22)),T=_n(p,f,13);let I=null;if(T<S*.85?y.rip>.4&&b<450&&T<.5?I="kukui":b>600&&D>.45?I=_n(p,f,7)<.7?"ohia":"koa":b>350?I=_n(p,f,8)<.55?"koa":"ohia":I=D>.5?"ohia":"kukui":D<.3&&T<.08&&(I=b<500&&_n(p,f,9)<.5?"wiliwili":"aalii"),!I||n.normalAt(M,w).y<.35&&_n(p,f,5)<.7)continue;const W=n.heightAt(M,w);r[I].push(M,W,w,x*6.28,Ae*(.75+_*.6)*(I==="aalii"?.8:1),.82+T*.35,_n(p,f,14)),o=Math.min(o,W),l=Math.max(l,W)}const c={};let h=0;for(const v of Hi){const g=r[v],p=g.length/7,f=new Float32Array(p*16),x=new Float32Array(p*3);for(let _=0;_<p;_++){const[M,w,y,b,D,S,T]=g.slice(_*7,_*7+7),I=Math.cos(b)*D,W=Math.sin(b)*D;f.set([I,0,-W,0,0,D,0,0,W,0,I,0,M,w,y,1],_*16),x.set([S,S*(.96+.08*T),S],_*3)}c[v]={mat:f,col:x,n:p},h+=p}const d=t*Me,u=e*Me,m=h?new un(new U(d-.2,o,u-.2),new U(d+Me+.2,l+.3,u+Me+.2)):null;return{data:c,box:m,total:h}}update(t){const e=t.position,n=Math.max(0,this.app.terrain.heightAt(e.x,e.z)),i=e.y-n,a=i<14;for(const g in this.meshes)this.meshes[g].visible=i<60;this.group.visible=i<60;for(const g of Hi)this.forest.near[g].visible=a,this.forest.far[g].visible=a;if(!a)return;t.updateMatrixWorld(),this.projView.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView);const r=Na,o=Math.floor((e.x-r)/Me),l=Math.floor((e.x+r)/Me),c=Math.floor((e.z-r)/Me),h=Math.floor((e.z+r)/Me),d=[],u=[],m=[];let v="";for(let g=o;g<=l;g++)for(let p=c;p<=h;p++){const f=g*Me,x=p*Me,_=Math.max(f-e.x,0,e.x-f-Me),M=Math.max(x-e.z,0,e.z-x-Me),w=Math.hypot(_,M);if(w>r)continue;const y=g*8192+p,b=this.tiles.get(y);if(!b){m.push([w,g,p]);continue}if(!b.box||!this.frustum.intersectsBox(b.box))continue;const D=Math.hypot(Math.max(Math.abs(f-e.x),Math.abs(f+Me-e.x)),Math.max(Math.abs(x-e.z),Math.abs(x+Me-e.z))),S=w<Vi[1]+.3,T=D>Vi[0]-.3;S&&d.push(b),T&&u.push(b),v+=`${y}${S?"n":""}${T?"f":""},`}m.sort((g,p)=>g[0]-p[0]);for(let g=0;g<Math.min(m.length,10);g++){const[,p,f]=m[g];this.tiles.set(p*8192+f,this.buildTile(p,f))}if(this.tiles.size>3e3)for(const[g,p]of this.tiles){const f=Math.floor(g/8192+.5),x=g-f*8192;Math.hypot((f+.5)*Me-e.x,(x+.5)*Me-e.z)>r*3&&this.tiles.delete(g)}v!==this.lastSelection&&(this.lastSelection=v,this.fill(this.forest.near,d),this.fill(this.forest.far,u))}fill(t,e){for(const n of Hi){const i=t[n],a=i.instanceMatrix.count,r=i.instanceMatrix,o=i.instanceColor;let l=0;for(const c of e){const h=c.data[n];if(!h.n)continue;const d=Math.min(h.n,a-l);if(d<=0)break;r.array.set(d===h.n?h.mat:h.mat.subarray(0,d*16),l*16),o.array.set(d===h.n?h.col:h.col.subarray(0,d*3),l*3),l+=d}i.count=l,l&&(r.clearUpdateRanges(),r.addUpdateRange(0,l*16),r.needsUpdate=!0,o.clearUpdateRanges(),o.addUpdateRange(0,l*3),o.needsUpdate=!0)}}}function Zr(s,t){const e=new Ce,n=ht("#7a4b30",.1,t),i=ht("#b08a5a",.15,t);return s==="stand"?(e.box(-.12,0,0,.16,.85,.18,n,Y.skin,0,.8),e.box(.12,0,0,.16,.85,.18,n,Y.skin,0,.8),e.box(0,.78,0,.42,.32,.26,i,Y.plain),e.box(0,1.05,0,.44,.5,.24,n,Y.skin,0,.85),e.box(-.3,.88,0,.11,.62,.12,n,Y.skin),e.box(.3,.88,0,.11,.62,.12,n,Y.skin),e.blob(0,1.68,0,.13,.15,.13,ht("#3a2418",.1,t),Y.skin,1,!1)):s==="bend"?(e.box(-.12,0,0,.16,.8,.18,n,Y.skin,0,.8),e.box(.12,0,0,.16,.8,.18,n,Y.skin,0,.8),e.box(0,.72,.05,.42,.3,.3,i,Y.plain),e.hexa([[-.22,.75,.05],[.22,.75,.05],[.2,.8,.62],[-.2,.8,.62]],[[-.22,.95,.05],[.22,.95,.05],[.2,1.05,.62],[-.2,1.05,.62]],n,Y.skin),e.box(0,.78,.62,.4,.27,.1,n,Y.skin),e.box(-.24,.35,.6,.1,.5,.1,n,Y.skin),e.box(.24,.35,.6,.1,.5,.1,n,Y.skin),e.blob(0,1.02,.8,.13,.14,.14,ht("#3a2418",.1,t),Y.skin,2,!1)):(e.box(0,0,0,.6,.2,.42,i,Y.plain),e.box(0,.18,0,.42,.55,.24,n,Y.skin,0,.85),e.box(-.28,.2,.08,.1,.45,.1,n,Y.skin),e.box(.28,.2,.08,.1,.45,.1,n,Y.skin),e.blob(0,.86,0,.13,.15,.13,ht("#3a2418",.1,t),Y.skin,3,!1)),e.geometry()}function vm(s){const t=new Ce;return t.box(0,0,0,4.6,.12,.6,ht("#6b4630",.1,s),Y.wood,0,.85),t.geometry()}function _m(s){const t=new Ce,e=ht("#1d1d22",.1,s),n=[[[0,0,.6],[-1.1,.25,-.1],[0,0,-.3]],[[0,0,.6],[0,0,-.3],[1.1,.25,-.1]],[[-1.1,.25,-.1],[-2,-.1,-.5],[-.6,.15,-.25]],[[1.1,.25,-.1],[.6,.15,-.25],[2,-.1,-.5]],[[0,0,-.3],[-.25,0,-1],[.25,0,-1]]];for(const[i,a,r]of n)t.tri(i,a,r,e,Y.plain),t.tri(i,r,a,e,Y.plain);return t.geometry()}const xm=`
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
`,Mm=`
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
`;class ym{constructor(t){this.app=t,this._m=new Wt,this._q=new In,this._p=new U,this._s=new U,this._e=new Ti,this._c=new vt;const e=t.island.meta,n=e.sites,i=rs(e.seed+2024);this.rand=i,this.group=new nn,this.mat=ji(t.shared,{fade:[24,34]});const a=t.terrain,r=(w,y)=>Math.max(0,a.heightAt(w,y));this.people={stand:[],bend:[],sit:[]};const o=(w,y,b,D,S=null,T=1)=>this.people[w].push({x:y,z:b,y:S??r(y,b),rot:D,ph:i()*6.28,tint:T});for(const w of n.loi){const y=w.model?16:5;for(let b=0;b<y;b++){const D=w.paddies[Math.floor(i()*w.paddies.length)];if(!D.flood)continue;const S=D.quad,T=.2+i()*.6,I=.2+i()*.6,W=S[0][0]+(S[1][0]-S[0][0])*T+(S[3][0]-S[0][0])*I,j=S[0][1]+(S[1][1]-S[0][1])*T+(S[3][1]-S[0][1])*I;o("bend",W,j,i()*6.28,(D.level-.25)*.013)}}for(const w of n.villages){const y=w.model?12:w.alii?14:4;for(let b=0;b<y;b++){const D=i()*6.28,S=.04+i()*.25;o(i()<.5?"sit":"stand",w.x+Math.cos(D)*S,w.z+Math.sin(D)*S,i()*6.28)}}for(const w of n.heiau.filter(y=>y.model||y.kind==="luakini"))for(let y=0;y<3;y++)o("stand",w.x+(i()-.5)*.12,w.z+(i()-.5)*.08,w.rot+Math.PI,r(w.x,w.z)+.07,2.4);for(const w of n.canoes)for(let y=0;y<(w.village===n.model?5:2);y++)o("stand",w.x+(i()-.5)*.2,w.z+(i()-.5)*.2,w.dir+Math.PI+(i()-.5));for(const w of n.ponds){const y=w.wall[Math.round(w.gates[0]*(w.wall.length-1))];o("stand",y[0]-w.ax*.02,y[1]-w.az*.02,Math.atan2(w.az,w.ax),.02)}this.poseMeshes={};for(const w of["stand","bend","sit"]){const y=this.people[w],b=Math.max(1,y.length+(w==="stand"?40:0)),D=new $i(Zr(w,i),this.mat,b);D.instanceColor=new Ji(new Float32Array(b*3).fill(1),3),D.frustumCulled=!1,D.instanceMatrix.setUsage(Mi),this.group.add(D),this.poseMeshes[w]=D}this.writeStatic(),this.trail=e.trail.slice();let l=0;for(let w=0;w<this.trail.length;w++){const y=this.trail[w],b=this.trail[(w+1)%this.trail.length];l+=y[0]*b[1]-b[0]*y[1]}l<0&&this.trail.reverse(),this.trailLen=[0];for(let w=1;w<=this.trail.length;w++){const y=this.trail[w-1],b=this.trail[w%this.trail.length];this.trailLen.push(this.trailLen[w-1]+Math.hypot(b[0]-y[0],b[1]-y[1]))}const c=n.alii||n.villages[0];let h=0,d=1/0;for(let w=0;w<this.trail.length;w++){const y=Math.hypot(this.trail[w][0]-c.x,this.trail[w][1]-c.z);y<d&&(d=y,h=this.trailLen[w])}this.procS=h-.6;const u=new Ce;im(u,i),this.akua=new te(u.geometry(),this.mat),this.akua.frustumCulled=!1,this.group.add(this.akua),this.boats=[];const m=(()=>{const w=new Ce;return Nl(w,i,8),w.geometry()})(),v=Zr("sit",i),g=e.ahupuaa.find(w=>w.id===n.model);for(let w=0;w<4;w++){const y=n.canoes[w%n.canoes.length],b=w<3&&g?g.mouth:[y.x,y.z],D=w<3?Math.atan2(g.mouth[1]-g.topZ,g.mouth[0]-g.topX):y.dir,S=5+i()*5,T=b[0]+Math.cos(D)*S+(i()-.5)*3,I=b[1]+Math.sin(D)*S+(i()-.5)*3;if(a.heightAt(T,I)>-.02)continue;const W=new nn,j=new te(m,this.mat);j.scale.setScalar(Ae),W.add(j);for(const R of[-1.6,1.4]){const N=new te(v,this.mat);N.scale.setScalar(Ae),N.position.set(R*Ae,.45*Ae,0),N.rotation.y=Math.PI/2,W.add(N)}W.position.set(T,0,I),W.rotation.y=i()*6.28,this.group.add(W),this.boats.push({g:W,x:T,z:I,ph:i()*6.28,drift:i()*6.28,crew:2})}const p=new Ce;zl(p,i),this.voyager=new te(p.geometry(),this.mat),this.voyager.scale.setScalar(Ae),this.voyager.frustumCulled=!1,this.group.add(this.voyager),this.voyagerS=0,this.surfers=[];const f=vm(i);this.boards=new $i(f,this.mat,24),this.boards.frustumCulled=!1,this.boards.instanceMatrix.setUsage(Mi),this.group.add(this.boards);for(const w of n.surf)for(let y=0;y<4;y++)this.surfers.push({s:w,ph:i(),lane:(i()-.5)*.5});this.birds=new $i(_m(i),this.mat,12),this.birds.frustumCulled=!1,this.birds.instanceMatrix.setUsage(Mi),this.group.add(this.birds),this.birdCentres=[];for(let w=0;w<12;w++){const y=n.villages[Math.floor(i()*n.villages.length)];this.birdCentres.push({x:y.x+(i()-.5)*6,z:y.z+(i()-.5)*6,r:.6+i()*1.4,h:.9+i()*1.4,ph:i()*6.28,sp:.08+i()*.06})}const x=[],_=[];for(const w of n.villages)for(let y=0;y<14;y++)x.push(w.x+.05,r(w.x,w.z)+.01,w.z+.05),_.push(y/14+i()*.05);const M=new Se;M.setAttribute("position",new ne(x,3)),M.setAttribute("aSeed",new ne(_,1)),M.setAttribute("aAge",new ne(new Float32Array(_.length),1)),this.smoke=new Ll(M,new pe({vertexShader:xm,fragmentShader:Mm,uniforms:{uTime:t.shared.uniforms.uTime,uWindVec:t.shared.uniforms.uWindVec,uSkyColor:t.shared.uniforms.uSkyColor,uSunColor:t.shared.uniforms.uSunColor},transparent:!0,depthWrite:!1})),this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,this.group.add(this.smoke),this._m=new Wt,this._q=new In,this._p=new U,this._s=new U,this._e=new Ti,this._c=new vt}writeStatic(){for(const t in this.people){const e=this.poseMeshes[t],n=this.people[t];for(let i=0;i<n.length;i++)this.setInstance(e,i,n[i].x,n[i].y,n[i].z,n[i].rot,Ae,n[i].tint);e.count=n.length,e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0)}}setInstance(t,e,n,i,a,r,o,l=1,c=0){this._p.set(n,i,a),this._e.set(c,r,0,"YXZ"),this._q.setFromEuler(this._e),this._s.setScalar(o),this._m.compose(this._p,this._q,this._s),t.setMatrixAt(e,this._m),(l!==1||t.instanceColor)&&t.setColorAt(e,this._c.setRGB(l,l,l))}walkTo(t,e){let n=0,i=1/0;for(let a=0;a<this.trail.length;a++){const r=Math.hypot(this.trail[a][0]-t,this.trail[a][1]-e);r<i&&(i=r,n=this.trailLen[a])}this.procS=n-.12}trailPoint(t){const e=this.trailLen[this.trailLen.length-1];t=(t%e+e)%e;let n=0,i=this.trailLen.length-1;for(;n<i-1;){const l=n+i>>1;this.trailLen[l]<=t?n=l:i=l}const a=this.trail[n%this.trail.length],r=this.trail[(n+1)%this.trail.length],o=(t-this.trailLen[n])/Math.max(1e-6,this.trailLen[n+1]-this.trailLen[n]);return[a[0]+(r[0]-a[0])*o,a[1]+(r[1]-a[1])*o,Math.atan2(r[0]-a[0],r[1]-a[1])]}update(t,e){const n=this.app,i=n.terrain,a=n.camera.position,r=a.y-Math.max(0,i.heightAt(a.x,a.z))<30;if(this.group.visible=r,!r)return;const o=n.season==="hooilo",l=this.poseMeshes.stand;let c=this.people.stand.length;if(this.akua.visible=o,o){this.procS+=t*.0035*Math.max(1,Math.min(8,n.clock.speed/20));for(let m=0;m<11;m++){const[v,g,p]=this.trailPoint(this.procS-m*.035),f=Math.max(0,i.heightAt(v,g))+Math.abs(Math.sin(e*4.2+m))*.0012;this.setInstance(l,c++,v,f,g,p,Ae,m===5?2.2:1),m===5&&(this.akua.position.set(v,f,g),this.akua.rotation.y=p,this.akua.scale.setScalar(Ae))}}let h=0;for(const m of this.surfers){const v=m.s,g=(e*.06+m.ph)%1,p=-Math.sin(v.dir),f=Math.cos(v.dir),x=(g-.5)*.9+m.lane,_=g*.15,M=v.x+p*x-Math.cos(v.dir)*_,w=v.z+f*x-Math.sin(v.dir)*_,y=Math.atan2(p,f)+(m.lane>0?0:Math.PI),b=.002+Math.sin(e*2+m.ph*9)*8e-4;this.setInstance(this.boards,h++,M,b,w,y+Math.PI/2,Ae,1,Math.sin(e*1.3+m.ph)*.06),this.setInstance(l,c++,M,b+.0025,w,y,Ae*.95,1)}this.boards.count=h,this.boards.instanceMatrix.needsUpdate=!0,l.count=c,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0);for(const m of this.boats)m.g.position.x=m.x+Math.sin(e*.05+m.drift)*.6,m.g.position.z=m.z+Math.cos(e*.04+m.drift)*.6,m.g.position.y=Math.sin(e*1.3+m.ph)*.0015,m.g.rotation.z=Math.sin(e*1.1+m.ph)*.04,m.g.rotation.y+=t*.02;this.voyagerS+=t*.004;const d=155,u=this.voyagerS;this.voyager.position.set(Math.cos(u)*d*.95+10,Math.sin(e*.9)*.002,Math.sin(u)*d*.7),this.voyager.rotation.y=-u-Math.PI/2,this.voyager.rotation.x=.06;for(let m=0;m<this.birdCentres.length;m++){const v=this.birdCentres[m],g=v.ph+e*v.sp,p=v.x+Math.cos(g)*v.r,f=v.z+Math.sin(g)*v.r,x=Math.max(0,i.heightAt(p,f))+v.h+Math.sin(e*.3+m)*.1;this.setInstance(this.birds,m,p,x,f,-g,Ae*1.4,1,.3)}this.birds.count=this.birdCentres.length,this.birds.instanceMatrix.needsUpdate=!0}}function Ol(s,t,e,n=1){let i=Float32Array.from(s),a=new Float32Array(t*t);const r=1/(2*e+1);for(let o=0;o<n;o++){for(let l=0;l<t;l++){const c=l*t;let h=0;for(let d=-e;d<=e;d++)h+=i[c+Math.min(t-1,Math.max(0,d))];for(let d=0;d<t;d++)a[c+d]=h*r,h+=i[c+Math.min(t-1,d+e+1)]-i[c+Math.max(0,d-e)]}for(let l=0;l<t;l++){let c=0;for(let h=-e;h<=e;h++)c+=a[Math.min(t-1,Math.max(0,h))*t+l];for(let h=0;h<t;h++)i[h*t+l]=c*r,c+=a[Math.min(t-1,h+e+1)*t+l]-a[Math.max(0,h-e)*t+l]}}return i}function Jr(s,t,e,n,i){let a=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let r=1;r<t;r++){let o=(s[r]+r*r-(s[n[a]]+n[a]*n[a]))/(2*r-2*n[a]);for(;o<=i[a];)a--,o=(s[r]+r*r-(s[n[a]]+n[a]*n[a]))/(2*r-2*n[a]);a++,n[a]=r,i[a]=o,i[a+1]=1/0}a=0;for(let r=0;r<t;r++){for(;i[a+1]<r;)a++;const o=r-n[a];e[r]=o*o+s[n[a]]}}function Sm(s,t){const n=new Float64Array(s*s);for(let c=0;c<s*s;c++)n[c]=t(c)?0:1e20;const i=new Float64Array(s),a=new Float64Array(s),r=new Int32Array(s),o=new Float64Array(s+1);for(let c=0;c<s;c++){for(let h=0;h<s;h++)i[h]=n[h*s+c];Jr(i,s,a,r,o);for(let h=0;h<s;h++)n[h*s+c]=a[h]}const l=new Float32Array(s*s);for(let c=0;c<s;c++){const h=c*s;for(let d=0;d<s;d++)i[d]=n[h+d];Jr(i,s,a,r,o);for(let d=0;d<s;d++)l[h+d]=Math.sqrt(a[d])}return l}const wm=[{name:"Koʻolau",gloss:"windward",from:345,to:105},{name:"Puna",gloss:"the sunrise side",from:105,to:165},{name:"Kona",gloss:"leeward",from:165,to:255},{name:"Waialua",gloss:"the northwest side",from:255,to:345}],Qr=[{key:"akua",name:"Wao akua",gloss:"realm of the gods"},{key:"nahele",name:"Wao nahele",gloss:"the forest"},{key:"kanaka",name:"Wao kanaka",gloss:"realm of people"},{key:"kula",name:"Kula",gloss:"open dry plains"},{key:"kahakai",name:"Kahakai",gloss:"the shore"},{key:"kohola",name:"Kai kohola",gloss:"reef shallows"},{key:"uli",name:"Kai uli",gloss:"deep blue sea"}];function Em(s,t,e=!1){for(let n=0;n<t;n++){if(s.length<3)return s;const i=e?[]:[s[0]],a=s.length,r=e?a:a-1;for(let o=0;o<r;o++){const l=s[o],c=s[(o+1)%a];i.push([l[0]*.75+c[0]*.25,l[1]*.75+c[1]*.25]),i.push([l[0]*.25+c[0]*.75,l[1]*.25+c[1]*.75])}e||i.push(s[a-1]),s=i}return s}const bm=`
${Ze}
in vec3 aFlow; // x along-stream distance, y perennial (0..1), z steepness (0..1)
in float aSide;
uniform sampler2D uWeather;
uniform vec4 uWeatherRect;
out vec3 vWorld;
out vec3 vFlow;
out float vSide;
out float vWet;
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
  vec4 w = texture(uWeather, (wp.xz - uWeatherRect.xy) / uWeatherRect.zw);
  vWet = w.b; // the ground's memory of recent rain
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,Tm=`
${Ze}
${as}
${Kn}
${os}
uniform float uFlowAll; // island-wide recent rain
in vec3 vWorld;
in vec3 vFlow;
in float vSide;
in float vWet;
void main() {
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
  float a = edge * mix(0.7, 0.55, steep) * streaks * smoothstep(0.06, 0.3, flow);
  // fade with distance so far-off falls are a sheen, not a painted line
  a *= 1.0 - smoothstep(12.0, 60.0, distance(cameraPosition, vWorld)) * 0.8;
  gl_FragColor = vec4(col, a);
}
`;class Am{constructor(t){const e=t.island.meta,n=t.terrain,i=[],a=[],r=[],o=[];let l=0;const c=new Set,h=.2,d=(p,f)=>Math.floor(p/h)*100003+Math.floor(f/h),u=(p,f)=>{for(let x=-2;x<=2;x++)for(let _=-2;_<=2;_++)if(c.has(d(p+_*h,f+x*h)))return!0;return!1},m=p=>{for(let f=1;f<p.length;f++){const[x,_]=p[f-1],[M,w]=p[f],y=Math.ceil(Math.hypot(M-x,w-_)/(h*.5));for(let b=0;b<=y;b++)c.add(d(x+(M-x)*b/y,_+(w-_)*b/y))}},v=e.streams.filter(p=>p.area>=.9&&p.pts.length>=3).sort((p,f)=>f.area-p.area);for(const p of v){let f=p.pts.length;for(let y=0;y<p.pts.length;y++)if(u(p.pts[y][0],p.pts[y][1])){f=y+1;break}if(f<3)continue;let x=p.pts.slice(0,f);m(x),x=Em(x,2);const _=Math.min(1,Math.max(0,(Math.log10(p.area)-.35)/.9));let M=0;const w=Math.min(.11,.009*Math.sqrt(p.area)+.012);for(let y=0;y<x.length;y++){const b=x[Math.max(0,y-1)],D=x[Math.min(x.length-1,y+1)],S=D[0]-b[0],T=D[1]-b[1],I=Math.hypot(S,T)||1,W=-T/I,j=S/I;y>0&&(M+=Math.hypot(x[y][0]-x[y-1][0],x[y][1]-x[y-1][1]));const R=x[y][0],N=x[y][1],L=n.metresAt(R,N);if(L<-.5)break;const z=x[Math.min(x.length-1,y+2)],q=(L-n.metresAt(z[0],z[1]))/Math.max(10,Math.hypot(z[0]-R,z[1]-N)*100),X=Math.min(1,Math.max(0,(q-.08)/.5)),$=w*(1+X*.4),Z=Math.max(L,0)*sn+.012+X*.03;for(const at of[-1,1]){const V=R+W*$*at,K=N+j*$*at,st=Math.max(Z,Math.max(0,n.metresAt(V,K))*sn+.003);i.push(V,st,K),a.push(M,_,X),r.push(at)}y>0&&o.push(l-2,l-1,l,l-1,l+1,l),l+=2}}const g=new Se;g.setAttribute("position",new ne(i,3)),g.setAttribute("aFlow",new ne(a,3)),g.setAttribute("aSide",new ne(r,1)),g.setIndex(o),g.computeBoundingSphere(),this.uniforms={...t.shared.uniforms,uFlowAll:{value:0}},this.material=new pe({vertexShader:bm,fragmentShader:Tm,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:$e,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new te(g,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=2,this.app=t}update(){const t=this.app.weather,e=Math.min(1,t.rainTotal/600);this.uniforms.uFlowAll.value+=(e-this.uniforms.uFlowAll.value)*.01;const n=this.app.camera.position;this.mesh.visible=n.y-Math.max(0,this.app.terrain.heightAt(n.x,n.z))<90}}function Qi(s,t,{filter:e="mip",format:n=Oe}={}){const i=new Zi(s,t,t,n,Ke);return e==="nearest"?(i.minFilter=de,i.magFilter=de):e==="linear"?(i.minFilter=ee,i.magFilter=ee):(i.minFilter=jn,i.magFilter=ee,i.generateMipmaps=!0),i.wrapS=i.wrapT=We,i.needsUpdate=!0,i}function Cm(s){const t=hn,e=new Uint8Array(t*t*4),n=Math.log(300),i=Math.log(12e3),a=new Float32Array(t*t);for(let o=0;o<t*t;o++)a[o]=Math.max(0,Math.min(1,Math.log10(Math.max(1e-6,s.area[o])/.04)/1.6));const r=Ol(a,t,2,2);for(let o=0;o<t*t;o++)e[o*4]=Math.round(255*Math.max(0,Math.min(1,(Math.log(s.rain[o])-n)/(i-n)))),e[o*4+1]=Math.round(255*Math.max(0,Math.min(1,s.sand[o]))),e[o*4+2]=Math.round(255*Math.min(1,r[o]*1.6)),e[o*4+3]=s.region[o*4+3];return Qi(e,t)}function Rm(s){const t=hn,e=new Uint8Array(t*t*4),n=Qt/t*100,i=Sm(t,a=>s.height1024[a]>0);for(let a=0;a<t*t;a++)e[a*4+3]=Math.round(255*Math.min(1,i[a]*n/300));return{tex:Qi(e,t),data:e}}const ts=["#8d9cc9","#3d8a4c","#a3d05b","#e3b65e","#f3e2b0","#53d6c8","#2a5aa8"],Lm=["#000000","#f0a35e","#6fb6e8","#f2d06b","#9ed27a"];function Pm(s){const t=hn,e=ts.map(o=>new vt(o)),n=[new Float32Array(t*t),new Float32Array(t*t),new Float32Array(t*t)];for(let o=0;o<t*t;o++){const l=e[s[o*4+2]]||e[6];n[0][o]=l.r,n[1][o]=l.g,n[2][o]=l.b}const i=n.map(o=>Ol(o,t,2,2)),a=new Uint8Array(t*t*4);for(let o=0;o<t*t;o++)a[o*4]=Math.round(255*Math.pow(i[0][o],1/2.2)),a[o*4+1]=Math.round(255*Math.pow(i[1][o],1/2.2)),a[o*4+2]=Math.round(255*Math.pow(i[2][o],1/2.2)),a[o*4+3]=255;const r=Qi(a,t);return r.colorSpace=ye,r}class Dm{constructor(t,e){this.canvas=t,this.island=e,this.params=new URLSearchParams(location.search);const n=new Rl({canvas:t,antialias:!1,powerPreference:"high-performance"});n.setClearColor(0,1),this.renderer=n,this.pipeline=new L0(n),this.scene=new ss,this.camera=new Ye(42,1,.1,9e3),this.light={sunDir:new U(0,1,0),sunColor:new vt,skyColor:new vt,groundColor:new vt,moonDir:new U(0,-1,0),moonColor:new vt,zenith:new vt,horizon:new vt,sunHorizon:new vt,night:0};const i=new Zi(new Uint8Array([0,0,0,0]),1,1);i.needsUpdate=!0;const a=e.data;this.landTex=Cm(a),this.regionTex=Qi(a.region,hn,{filter:"nearest"}),this.linesTex=Qi(a.lines,Vn,{filter:"linear"}),this.zoneTex=Pm(a.region),this.overlay=new le(0,0,0,0),this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uShadow:{value:null},uWeather:{value:i},uWeatherRect:{value:new le(-Qt,-Qt,Qt*2,Qt*2)},uCloudShadowK:{value:0},uCloudMidY:{value:15},uWetness:{value:0},uLand:{value:this.landTex},uSkyMap:{value:null},uRegion:{value:this.regionTex},uLines:{value:this.linesTex},uZoneTex:{value:this.zoneTex},uOverlay:{value:this.overlay},uHover:{value:0},uFocus:{value:0},uFocusK:{value:0},uMokuColors:{value:Lm.map(u=>new vt(u))},uWindVec:{value:new Tt(1,0)}}},this.terrain=new x0(a,this.shared),this.scene.add(this.terrain.group),this.shadow=new Y0(this.terrain.heightTex),this.shared.uniforms.uShadow.value=this.shadow.texture;const r=Rm(a);this.seaTex=r.tex,this.seaData=r.data,this.ocean=new w0(this.shared,this.terrain.heightTex,r.tex),this.scene.add(this.ocean.mesh),this.sky=new V0,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.weather=new K0(a.height1024,hn);const[o,l]=e.meta.cloudSizes;this.clouds=new j0({shape:a.cloudShape,shapeSize:o,detail:a.cloudDetail,detailSize:l}),this.clouds.uniforms.uWeather.value=this.weather.texture,this.clouds.uniforms.uWeatherRect.value=this.weather.rect,this.shared.uniforms.uWeather.value=this.weather.texture,this.shared.uniforms.uWeatherRect.value=this.weather.rect,this.pipeline.atmosphere=this.clouds,this.features=new cm(this),this.scene.add(this.features.group),this.vegetation=new gm(this),this.scene.add(this.vegetation.group),this.life=new ym(this),this.scene.add(this.life.group),this.streams=new Am(this),this.scene.add(this.streams.mesh),this.flash={t:-10,next:0,pos:new U,k:0},this.rig=new X0(this.camera,t,this.terrain),this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??9.2),speed:Number(this.params.get("speed")??60)},this.season=this.clock.doy>120&&this.clock.doy<300?"kau":"hooilo",this.params.get("weather")&&this.weather.setMode(this.params.get("weather")),this.sky.update(this.clock.doy,this.clock.hour,0,this.light),this.weather.warm(6,this.light.sunDir.y,this.clock.hour,this.season),this.time=0,this.frames=0,this.updaters=[];const c=n.getContext(),h=c.getExtension("WEBGL_debug_renderer_info"),d=h?String(c.getParameter(h.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(d),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}applyQuality(){const t=[{clouds:.25,steps:26,light:2,range:12,dpr:1},{clouds:.33,steps:34,light:2,range:16,dpr:1.25},{clouds:.42,steps:44,light:3,range:19,dpr:1.5},{clouds:.5,steps:56,light:4,range:22,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.clouds.setScale(t.clouds),this.clouds.uniforms.uSteps.value=t.steps,this.clouds.uniforms.uLightSteps.value=t.light,this.terrain.setRange(t.range),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}lightning(){const t=this.weather,e=this.flash,n=t.stormiest;n&&(t.regime==="kona"?n.strength>.35:n.strength>.9)&&this.time>e.next&&this.clock.speed>0&&(e.t=this.time,e.pos.set(n.x+(Math.random()-.5)*8,t.base+(t.top-t.base)*(.3+Math.random()*.4),n.z+(Math.random()-.5)*8),e.next=this.time+1.5+Math.random()*(t.regime==="kona"?5:14));const a=this.time-e.t;e.k=a<.6?Math.exp(-a*9)*(.7+.3*Math.sin(a*70))+(a>.12&&a<.22?.6:0):0,this.clouds.uniforms.uFlash.value=e.k,this.clouds.uniforms.uFlashPos.value.copy(e.pos),e.k>0&&this.light.skyColor.offsetHSL(0,0,0).add(new vt(.25,.27,.35).multiplyScalar(e.k))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.shadow.update(this.renderer,this.light.sunDir),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){const e=this.clock;e.hour+=t*e.speed/3600,e.hour>=24&&(e.hour-=24,e.doy=(e.doy+1)%365),this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t),this.terrain.update(this.camera),this.ocean.update(this.camera),this.vegetation.update(this.camera),this.weather.step(t*e.speed,this.light.sunDir.y,e.hour,this.season),this.life.update(t,this.time),this.streams.update(),this.lightning();for(const l of this.updaters)l(t,this.time);const n=this.light,i=this.weather,a=this.clouds.uniforms;a.uSunDir.value.copy(n.sunDir),a.uSunColor.value.copy(n.sunColor),a.uSkyColor.value.copy(n.skyColor),a.uGroundColor.value.copy(n.groundColor),a.uFogColor.value.copy(n.horizon),a.uMoonDir.value.copy(n.moonDir),a.uMoonColor.value.copy(n.moonColor),a.uWind.value.copy(i.windOffset),a.uWindDir.value.copy(i.wind),a.uTime.value=this.time,a.uBase.value=i.base,a.uTop.value=i.top;const r=Math.max(0,Math.min(1,(i.state.humidity-1.1)/.3));if(a.uOvercast.value=r,a.uFarCover.value=.32+r*.4,r>0){const l=1-r*.65;n.sunColor.multiplyScalar(l);const c=(n.skyColor.r+n.skyColor.g+n.skyColor.b)/3;n.skyColor.lerp(new vt(c,c,c*1.04),r*.5).multiplyScalar(1-r*.25)}this.shared.uniforms.uCloudShadowK.value=2.6,this.shared.uniforms.uCloudMidY.value=(i.base+i.top)*.5,this.ocean.uniforms.uWind.value.set(i.wind.x/9,i.wind.y/9),this.shared.uniforms.uWindVec.value.set(i.wind.x/9,i.wind.y/9);const o=this.pipeline.uniforms;o.uSunDir.value.copy(n.sunDir),o.uSunColor.value.copy(n.sunHorizon),o.uFogColor.value.copy(n.horizon),o.uExposure.value=.55*(1+2.2*Math.pow(n.night,1.5)),o.uNight.value=n.night,this.sky.group.position.copy(this.camera.position)}}const Um=[{id:"island",icon:"island",title:"Ka Mokupuni",gloss:"the island",text:["A high island raised by two volcanoes and carved by rain. Land was divided in nested parts: the mokupuni (island) into moku (districts), each moku into ahupuaʻa, each ahupuaʻa into ʻili worked by extended families.","This island is a composite, not a map of any one place — but its boundaries follow the ridgelines of its own watersheds, the way real ones did."]},{id:"rain",icon:"rain",title:"Ka Ua",gloss:"the rain",text:["Most days the moaʻe — the trade wind — pushes moist ocean air against the windward mountains. Forced upward, it cools past about 650 m and condenses into the cloud bank on the summit. Showers fall on the windward side; the air sinking down the far side warms and dries.","So one side of an island is lush and the other dry. Hawaiians named hundreds of winds and rains, each belonging to a place. Wai, fresh water, was life — and waiwai, wealth, is water doubled."]},{id:"ahupuaa",icon:"ahupuaa",title:"Ahupuaʻa",gloss:"from the mountain to the sea",zone:null,text:["An ahupuaʻa ran from the uplands to the sea, usually bounded by ridges, so its people had forest, fresh water, farmland, shore and reef within one boundary.","A konohiki managed it for the aliʻi, allotting land and water, and could place a kapu that rested a fishery or forest until it recovered.","The name comes from the ahu, a stone altar at the boundary, where a carved puaʻa (pig) image stood during the Makahiki."]},{id:"akua",icon:"akua",title:"Wao Akua",gloss:"realm of the gods",zone:0,text:["The cloud-wrapped heights were left largely to the gods. People came only for special purposes — feathers, choice woods, stone for adzes — and with care.","Yet this is the source: mist and rain combed from the clouds by mossy ʻōhiʻa forest feed every spring and stream below. Keep the uplands whole, and water keeps flowing to everyone downstream."]},{id:"nahele",icon:"nahele",title:"Wao Nahele",gloss:"the forest",zone:1,text:["Below the clouds grew koa and ʻōhiʻa. A kahuna kālai waʻa, a master canoe builder, chose a koa tree here, felled it with stone koʻi (adzes), and shaped the hull before it was hauled down to the shore.","Kia manu, bird catchers, gathered feathers for the cloaks and helmets of the aliʻi. From the ʻōʻō they took only a few yellow feathers and let the bird go."]},{id:"loi",icon:"loi",title:"Loʻi Kalo",gloss:"irrigated taro terraces",zone:2,text:["Kalo (taro) was the staff of life, cooked and pounded into poi. Terraces stepped down the valley floor, fed by an ʻauwai — a ditch that took part of the stream at a dam and returned it below. The water had to keep moving: cool, flowing water kept the kalo healthy.","In tradition the first kalo grew from Hāloa, elder brother of the Hawaiian people, so caring for kalo was caring for family."]},{id:"kauhale",icon:"kauhale",title:"Kauhale",gloss:"the family compound",zone:4,text:["A home was a cluster of hale, each with its purpose: the hale noa where the family slept, the mua where men ate and kept the family shrine, a separate eating house for women, a house for beating kapa, a canoe house.","Under the ʻai kapu, men and women ate apart. Houses were framed in hardwood, lashed with cordage and thatched with pili grass, on a raised stone paepae."]},{id:"heiau",icon:"heiau",title:"Heiau",gloss:"temple",zone:4,text:["Heiau ranged from simple shrines to massive stone platforms. A luakini, a temple of state dedicated to Kū, could be built only by a ruling chief; others honored Lono for rain and harvests, or served healing and fishing.","On the platform stood the ʻanuʻu, a tall frame wrapped in white kapa where the high priest received the gods’ words; carved kiʻi images; and the lele, an altar for offerings."]},{id:"kahakai",icon:"kahakai",title:"Kahakai",gloss:"the shore",zone:4,text:["Most people lived near the shore, where the stream met the sea. Canoes, each hull carved from a single log and steadied by an ama float, were kept out of the sun in a hālau waʻa.","On flat rocks and clay pans, seawater evaporated into paʻakai — salt — for preserving fish."]},{id:"loko",icon:"loko",title:"Loko Iʻa",gloss:"fishpond",zone:5,text:["Hawaiians built the most advanced fishponds in the Pacific. A curved wall of stacked stone, the kuapā, enclosed part of the reef flat near a stream mouth, where fresh water mixed with salt.","In the wall were mākāhā — sluice gates of wooden grates. Young fish slipped in with the tide, fattened on algae, and grew too big to slip back out. ʻAmaʻama (mullet) and awa (milkfish) were raised here."]},{id:"koa",icon:"koa",title:"Koʻa",gloss:"fishing shrine",zone:5,text:["Fishermen built koʻa, stone shrines on the shore, and offered the first fish of a catch to the fishing gods. Offshore fishing grounds were also called koʻa, found by lining up landmarks on land.","Kapu protected fish in their seasons: aku and ʻōpelu were taken in turns, each closed while the other was open, so neither was fished out."]},{id:"surf",icon:"surf",title:"Heʻe Nalu",gloss:"wave sliding",zone:5,text:["Surfing belonged to everyone. Chiefs rode long olo boards of light wiliwili wood; commoners rode shorter alaia of koa. When the surf came up, whole villages went to the water.","Each break had its name, and the best were sometimes kapu to all but the aliʻi."]},{id:"kula",icon:"kula",title:"Kula",gloss:"the dry plains",zone:3,text:["Where rain was too scarce for loʻi, families farmed the open kula: ʻuala (sweet potato) in mounds, dryland kalo, ipu (gourds) and kō (sugarcane).","Long low walls ran across the slopes to break the wind and hold soil and moisture. The great leeward field systems covered tens of square kilometres."]},{id:"ahu",icon:"ahu",title:"Ahu · Makahiki",gloss:"the boundary altar · the season of Lono",zone:4,text:["Where the trail around the island crossed into each ahupuaʻa stood an ahu, a stone altar. When Makaliʻi — the Pleiades — rose at dusk in late autumn, the Makahiki began: four months honoring Lono, god of rain and growth.","Lono’s image, the akua loa — a tall staff hung with kapa — was carried around the island. At each ahu the people left offerings: kapa, food, feathers, pigs. Then came games, rest and feasting, and war was forbidden."]},{id:"puuhonua",icon:"puuhonua",title:"Puʻuhonua",gloss:"place of refuge",zone:4,text:["Breaking a kapu could mean death — unless you reached a puʻuhonua first. Inside its great walls a kahuna performed rites of absolution, and you could go home forgiven.","In wartime, defeated warriors and those who could not fight also found safety there."]},{id:"holua",icon:"holua",title:"Hōlua",gloss:"sledding course",zone:3,text:["During the Makahiki, chiefs raced down stone-built slides on papa hōlua — long, narrow sleds on hardwood runners — at tremendous speed.","The track was paved with stones and laid with slick grass or leaves; the longest ran for more than a kilometre."]},{id:"malama",icon:"malama",title:"Mālama ʻĀina",gloss:"care for the land",text:["The ahupuaʻa worked because each part cared for the next: protected forests made water, water fed loʻi and fishponds, and people tended it all.","Across Hawaiʻi today, communities are restoring loʻi, fishponds and forests on the same principles."]}],Ns={moae:{name:"Moaʻe",gloss:"trade winds"},kona:{name:"Kona",gloss:"southerly storm"},malie:{name:"Mālie",gloss:"calm"},auto:{name:"Auto",gloss:"let the weather change"}},za={kau:{name:"Kau",gloss:"the dry season"},hooilo:{name:"Hoʻoilo",gloss:"the wet season"}},Im={island:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',rain:'<path d="M7 14.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M8.5 17.5l-1 2.5M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5"/>',ahupuaa:'<path d="M12 3.5 4.5 19.5h15z"/><path d="M12 7c-1.2 2.6 1 4.4 0 7s1.2 3 .3 5.5"/><path d="M3 21c2 0 2-.8 4.5-.8S9.5 21 12 21s2-.8 4.5-.8 2 .8 4.5.8"/>',akua:'<path d="M3 19.5l6-9 3 4 2-3 7 8z"/><path d="M8.2 7.5a2.6 2.6 0 0 1 5-1.3A2.2 2.2 0 1 1 15.5 9.6H8.8a1.1 1.1 0 0 1-.6-2.1z"/>',nahele:'<path d="M12 21v-6"/><path d="M12 15c-4.2 0-6.3-2.1-6.3-5a4 4 0 0 1 3-3.9 3.3 3.3 0 0 1 6.6 0 4 4 0 0 1 3 3.9c0 2.9-2.1 5-6.3 5z"/>',loi:'<path d="M12 21v-4.5"/><path d="M12 16.5c-5 0-8-3-8-7 0-2.2 1.2-4 3.2-4 2 0 3 1.8 4.8 1.8s2.8-1.8 4.8-1.8c2 0 3.2 1.8 3.2 4 0 4-3 7-8 7z"/><path d="M12 7.3v9"/>',kauhale:'<path d="M2.5 20.5h19"/><path d="M5 20.5 12 5l7 15.5"/><path d="M10.4 20.5v-4h3.2v4"/>',heiau:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',kahakai:'<path d="M3 14.5h18l-2.2 3.2H5.2z"/><path d="M6 11h12"/><path d="M8.5 11v3.5M15.5 11v3.5"/><path d="M3 20.5c2 0 2-.8 4.5-.8s2 .8 4.5.8 2-.8 4.5-.8 2 .8 4.5.8"/>',loko:'<path d="M3.5 12c3-4.2 9-5 12.5 0-3.5 5-9.5 4.2-12.5 0z"/><path d="M16 12l5-3.2v6.4z"/><circle cx="7.2" cy="11.2" r=".9" fill="currentColor"/><path d="M3 20c3-2 15-2 18 0"/>',koa:'<path d="M6.5 20.5h11"/><ellipse cx="12" cy="17.8" rx="4.3" ry="2"/><ellipse cx="12" cy="13.8" rx="3.2" ry="1.8"/><path d="M12 12V5.2a2.1 2.1 0 1 1 3.1 1.9"/>',surf:'<path d="M2.5 17c3.2 0 4.2-8.5 9.5-8.5 3 0 4.2 2 4.2 4.2-1.2-.2-3.2-.6-4 1.4 3 0 5.6 1 7.8 2.9"/><path d="M2.5 20.5h19"/>',kula:'<path d="M2.5 18.5c2-3 4.5-3 6.5 0M9 18.5c2-3 4.5-3 6.5 0M15.5 18.5c1.6-2.4 4-3 6 0"/><path d="M2.5 21h19"/><path d="M5.8 14.5v-3M12.2 14.5v-4M18.6 14.5v-3"/>',ahu:'<path d="M7.5 20.5h9l-1.2-3.2H8.7z"/><path d="M9.3 17.3l.6-3h4.2l.6 3"/><path d="M10.4 14.3l.6-2.3h2l.6 2.3"/><path d="M18 3.5l.7 1.6 1.6.7-1.6.7L18 8.1l-.7-1.6-1.6-.7 1.6-.7z"/>',puuhonua:'<path d="M2.5 20h19"/><path d="M3 20v-6.5h9.5V20"/><path d="M3 16.2h9.5"/><path d="M14 20l3.6-7.5L21.2 20"/>',holua:'<path d="M3 5.5l18 13.5"/><path d="M7.8 7.6l3.6 2.7"/><path d="M6.6 10.4l5.3 4"/><circle cx="9.6" cy="6.2" r="1.2"/>',malama:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',play:'<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5.5v13M16 5.5v13" stroke-width="2.6"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',zones:'<path d="M3 6h18M3 10.5h18M3 15h18M3 19.5h18"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',mute:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3 7 7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/>',moon:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',moae:'<path d="M3 8.5h11a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12.5h15a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16.5h8"/>',kona:'<path d="M7 13.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M12.5 13.5 10 18h3.5l-2 3.5"/>',malie:'<circle cx="8.5" cy="8.5" r="3"/><path d="M8.5 2.5v1.5M2.5 8.5H4M4.3 4.3l1 1"/><path d="M9.5 18.5a3.5 3.5 0 1 1 .7-6.9 4.3 4.3 0 0 1 8.3 2 2.6 2.6 0 0 1-.4 4.9z"/>',auto:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4.5v4h-4"/>',kau:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>',hooilo:'<path d="M7 13a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M9 16.5v3M13 16.5v3M17 16.5v3"/>',speed1:'<path d="M8 5.5v13l9-6.5z"/>',speed2:'<path d="M4.5 5.5v13l7.5-6.5zM12 5.5v13l7.5-6.5z"/>',speed3:'<path d="M3 6v12l6-6zM9.5 6v12l6-6zM16 6v12l6-6z"/>',wind:'<path d="M12 3l4 8h-3v10h-2V11H8z" fill="currentColor" stroke="none"/>',explore:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',tour:'<path d="M4 19c4-1 4-6 8-7s5-6 8-7"/><circle cx="4" cy="19" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="20" cy="5" r="1.4" fill="currentColor"/>'};function ue(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Im[s]||""}</svg>`}const Ln=(s,t)=>Math.atan2(s,t);function Fm(s){const t=s.island.meta,e=t.sites,n=s.terrain,i=t.ahupuaa.find(L=>L.id===e.model)||t.ahupuaa[0],[a,r]=i.mouth;let o=i.topX-a,l=i.topZ-r;const c=Math.hypot(o,l)||1;o/=c,l/=c;const h=Ln(-o,-l),d=Ln(o,l),u=(L,z)=>new U(L,Math.max(0,n.heightAt(L,z)),z),m=i.trunk||[],v=L=>{if(!m.length)return[a+o*c*L,r+l*c*L];const z=m[Math.min(m.length-1,Math.floor(L*(m.length-1)))];return[z[0],z[1]]},g=L=>{let z=m[0];for(const q of m)Math.abs(q[2]-L)<Math.abs(z[2]-L)&&(z=q);return z?[z[0],z[1]]:v(.6)},p=e.villages.find(L=>L.model)||e.villages[0],f=e.loi.find(L=>L.model)||e.loi[0],x=e.heiau.find(L=>L.model)||e.heiau[0],_=e.ponds.find(L=>L.model)||e.ponds[0],M=e.canoes.find(L=>L.village===i.id)||e.canoes[0],w=e.koa.find(L=>L.id===i.id)||e.koa[0],y=L=>Math.min(...e.ponds.map(z=>Math.hypot(z.cx-L.x,z.cz-L.z)),99),D=[...e.surf].sort((L,z)=>Math.hypot(L.x-a,L.z-r)-Math.max(0,8-y(L))*20-(Math.hypot(z.x-a,z.z-r)-Math.max(0,8-y(z))*20))[0],S=e.alii||p,T=[...t.ahu].filter(L=>L.a===i.id||L.b===i.id).sort((L,z)=>Math.hypot(L.x-a,L.z-r)-Math.hypot(z.x-a,z.z-r))[0]||t.ahu[0],[I,W]=t.center,j=(()=>{const L=s.island.data.region,z=Math.sqrt(L.length/4);let q=null,X=-1;for(let $=0;$<z;$+=4)for(let Z=0;Z<z;Z+=4)if(L[($*z+Z)*4+3]>X){let V=0;for(let K=-8;K<=8;K+=4)for(let st=-8;st<=8;st+=4)V+=L[(Math.min(z-1,Math.max(0,$+K))*z+Math.min(z-1,Math.max(0,Z+st)))*4+3];V>X&&(X=V,q=[((Z+.5)/z-.5)*360,(($+.5)/z-.5)*360])}return q||[S.x,S.z-10]})(),R={};R.island={target:u(I+10,W+4),distance:330,yaw:.28,pitch:.78,overlay:[.55,0,.6,0],hour:9.5};{const L=a-o*4,z=r-l*4;R.rain={target:u(L,z),distance:24,yaw:d,pitch:.1,hour:16,weather:"moae",boost:!0,overlay:[0,0,0,0],lookUp:.35,showers:[[L-o*14,z-l*14],[L-o*8+l*7,z-l*8-o*7],[L-o*20-l*6,z-l*20+o*6]]}}{const[L,z]=v(.45);R.ahupuaa={target:u(L,z),distance:92,yaw:h+.25,pitch:.55,focus:i.id,overlay:[1,.85,.4,.6],hour:11}}{const[L,z]=g(260);R.akua={target:u(L,z),distance:26,yaw:h+.15,pitch:.1,hour:8.2,overlay:[0,0,0,0],lookUp:.55}}{const[L,z]=g(520);R.nahele={target:u(L,z),distance:9,yaw:h+.9,pitch:.55,hour:9.5,overlay:[0,0,0,0]}}if(f){const L=f.paddies[Math.floor(f.paddies.length*.35)].quad[0];R.loi={target:u(L[0],L[1]),distance:5.2,yaw:h-.5,pitch:.72,hour:10.2,overlay:[0,0,0,0]}}if(R.kauhale={target:u(p.x,p.z),distance:3.2,yaw:h+.9,pitch:.55,hour:8.8,overlay:[0,0,0,0]},x&&(R.heiau={target:u(x.x,x.z),distance:2.1,yaw:x.rot+2.2,pitch:.42,hour:11.5,overlay:[0,0,0,0]}),M){const L=Math.cos(M.dir),z=Math.sin(M.dir);R.kahakai={target:u(M.x,M.z),distance:2,yaw:Ln(L,z)+.7,pitch:.28,hour:15.8,overlay:[0,0,0,0]}}if(_&&(R.loko={target:u(_.cx+_.ax*_.r*.4,_.cz+_.az*_.r*.4),distance:6,yaw:Ln(_.ax,_.az)+.6,pitch:.5,hour:13,overlay:[0,0,0,0]}),w){const L=M||{dir:0};R.koa={target:u(w.x,w.z),distance:1.8,yaw:Ln(-Math.cos(L.dir),-Math.sin(L.dir))+.3,pitch:.2,hour:6.9,overlay:[0,0,0,0],lookUp:.25}}if(D&&(R.surf={target:u(D.x,D.z),distance:1.3,yaw:Ln(Math.cos(D.dir+.9),Math.sin(D.dir+.9)),pitch:.12,hour:14.5,overlay:[0,0,0,0]}),R.kula={target:u(j[0],j[1]),distance:11,yaw:.9,pitch:.42,hour:9,overlay:[0,0,0,0]},T){let L=0,z=-1/0;for(let q=0;q<24;q++){const X=q/24*Math.PI*2,$=n.heightAt(T.x+Math.sin(X)*2.2,T.z+Math.cos(X)*2.2);$>z&&(z=$,L=X)}R.ahu={target:u(T.x,T.z),distance:2,yaw:L,pitch:.3,hour:18.2,doy:318,overlay:[0,0,0,.8],lookUp:.6,ahu:T}}if(e.puuhonua){const L=e.puuhonua;R.puuhonua={target:u(L.x-Math.cos(L.dir)*.8,L.z-Math.sin(L.dir)*.8),distance:3.4,yaw:Ln(Math.cos(L.dir+.9),Math.sin(L.dir+.9)),pitch:.42,hour:15,overlay:[0,0,0,0]}}if(e.holua){const L=e.holua,z=(L.x0+L.x1)/2,q=(L.z0+L.z1)/2,X=L.x1-L.x0,$=L.z1-L.z0,Z=Math.hypot(X,$)||1;R.holua={target:u(z,q),distance:6.5,yaw:Ln(-$/Z,X/Z)+.25,pitch:.33,hour:16,overlay:[0,0,0,0]}}R.malama={target:u(I,W),distance:300,yaw:2.5,pitch:.5,hour:17.4,overlay:[.6,0,.5,0]};for(const L of Object.values(R))Nm(L,n);const N={akua:[i.topX,i.topZ],nahele:g(520),loi:R.loi?[R.loi.target.x,R.loi.target.z]:null,kauhale:[p.x,p.z],heiau:x?[x.x,x.z]:null,kahakai:M?[M.x,M.z]:null,loko:_?[_.cx+_.ax*_.r*.5,_.cz+_.az*_.r*.5]:null,koa:w?[w.x,w.z]:null,surf:D?[D.x,D.z]:null,kula:j,ahu:T?[T.x,T.z]:null,puuhonua:e.puuhonua?[e.puuhonua.x,e.puuhonua.z]:null,holua:e.holua?[(e.holua.x0+e.holua.x1)/2,(e.holua.z0+e.holua.z1)/2]:null};return{views:R,anchors:N,model:i}}function Nm(s,t){for(let e=0;e<8;e++){const n=Math.cos(s.pitch),i=new U(s.target.x+s.distance*n*Math.sin(s.yaw),s.target.y+s.distance*Math.sin(s.pitch),s.target.z+s.distance*n*Math.cos(s.yaw));let a=!1;for(let r=1;r<24;r++){const o=r/24,l=i.x+(s.target.x-i.x)*o,c=i.y+(s.target.y-i.y)*o,h=i.z+(s.target.z-i.z)*o;if(Math.max(0,t.heightAt(l,h))>c-.03){a=!0;break}}if(!a)return;s.pitch=Math.min(1.3,s.pitch+.07)}}const Te=(s,t=document)=>t.querySelector(s),re=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,a]of Object.entries(t))i==="class"?n.className=a:i.startsWith("on")?n.addEventListener(i.slice(2),a):n.setAttribute(i,a);return e&&(n.innerHTML=e),n},zm=s=>{const t=Math.floor(s),e=Math.floor((s-t)*60);return`${t}:${String(e).padStart(2,"0")}`},Om=s=>s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2;class km{constructor(t){this.app=t,this.meta=t.island.meta;const e=Fm(t);this.views=e.views,this.anchors=e.anchors,this.model=e.model,this.stops=Um.filter(n=>this.views[n.id]),this.mode="tour",this.index=-1,this.playing=!1,this.arrivedAt=0,this.overlayGoal=new le(0,0,0,0),this.focusGoal=0,this.layer={lines:!1,zones:!1,pins:!0},this.timeTween=null,this.counts=this.countFeatures(),this.build(),this.bind(),t.updaters.push(n=>this.update(n))}countFeatures(){const t=this.meta.sites,e={},n=(i,a,r=1)=>{e[i]=e[i]||{loi:0,hale:0,heiau:0,loko:0,koa:0},e[i][a]+=r};for(const i of t.loi)n(i.id,"loi",i.paddies.length);for(const i of t.houses)n(i.village,"hale");for(const i of t.heiau)n(i.id,"heiau");for(const i of t.ponds)n(i.id,"loko");for(const i of t.koa)n(i.id,"koa");return e}build(){const t=re("div",{id:"ui"});document.body.appendChild(t),this.root=t,t.appendChild(re("div",{class:"brand"},`<div class="brand-name">Ahupuaʻa</div><div class="brand-sub">${ue("akua",14)}<span></span>${ue("loko",14)}</div>`)),this.modeEl=re("div",{class:"modes"}),this.modeEl.append(re("button",{class:"mode on","data-mode":"tour",title:"Guided tour","aria-label":"Guided tour"},`${ue("tour",18)}<span>Tour</span>`),re("button",{class:"mode","data-mode":"explore",title:"Explore freely","aria-label":"Explore freely"},`${ue("explore",18)}<span>Explore</span>`)),t.appendChild(this.modeEl),this.tools=re("div",{class:"tools"});const e=(r,o,l)=>re("button",{class:"tool","data-tool":r,title:l,"aria-label":l},ue(o,20));this.tools.append(e("lines","lines","Ahupuaʻa boundaries"),e("zones","zones","Zones, mountain to sea"),e("pins","pins","Places"),e("help","help","About"),e("full","expand","Full screen")),t.appendChild(this.tools),this.legend=re("div",{class:"legend"}),Qr.forEach((r,o)=>this.legend.appendChild(re("div",{class:"lg"},`<i style="background:${ts[o]}"></i><b>${r.name}</b><em>${r.gloss}</em>`))),t.appendChild(this.legend),this.card=re("section",{class:"card","aria-live":"polite"}),t.appendChild(this.card),this.rail=re("nav",{class:"rail","aria-label":"Tour stops"}),this.playBtn=re("button",{class:"play",title:"Play the tour","aria-label":"Play the tour"},ue("play",18)),this.rail.appendChild(this.playBtn),this.dots=this.stops.map((r,o)=>{const l=re("button",{class:"dot",title:r.title,"aria-label":r.title,"data-i":o},ue(r.icon,18));return this.rail.appendChild(l),l}),this.progress=re("div",{class:"rail-progress"},"<span></span>"),this.rail.appendChild(this.progress),t.appendChild(this.rail),this.markerLayer=re("div",{class:"markers"}),t.appendChild(this.markerLayer),this.markers=this.stops.filter(r=>this.anchors[r.id]).map(r=>{const o=re("button",{class:"marker",title:r.title,"aria-label":r.title},`${ue(r.icon,18)}<span>${r.title}</span>`);o.addEventListener("click",h=>{h.stopPropagation(),this.openStop(this.stops.indexOf(r),{fly:!0,explore:!0})}),this.markerLayer.appendChild(o);const[l,c]=this.anchors[r.id];return{el:o,stop:r,pos:new U(l,0,c),vis:0}});for(const r of this.markers)r.pos.y=Math.max(0,this.app.terrain.heightAt(r.pos.x,r.pos.z))+.05;this.inspector=re("div",{class:"inspector"}),t.appendChild(this.inspector),this.dock=re("div",{class:"dock"}),this.dock.innerHTML=`
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
      <div class="wind" title="Wind"><span class="wind-arrow">${ue("wind",22)}</span><span class="wind-speed"></span></div>`,t.appendChild(this.dock);const n=Te(".regimes",this.dock);for(const r of["auto","moae","kona","malie"])n.appendChild(re("button",{class:"chip","data-regime":r,title:`${Ns[r].name} — ${Ns[r].gloss}`,"aria-label":Ns[r].name},ue(r,18)));const i=Te(".seasons",this.dock);for(const r of["kau","hooilo"])i.appendChild(re("button",{class:"chip","data-season":r,title:`${za[r].name} — ${za[r].gloss}`,"aria-label":za[r].name},ue(r,18)));const a=Te(".speeds",this.dock);for(const[r,o,l]of[["0",0,"pause"],["1",30,"speed1"],["2",240,"speed2"],["3",1800,"speed3"]])a.appendChild(re("button",{class:"chip","data-speed":o,title:o?`${o}× time`:"Pause time","aria-label":o?`${o} times speed`:"Pause"},ue(l,16)));this.help=re("div",{class:"help hidden"}),this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${ue("close",18)}</button>
        <h2>Ahupuaʻa</h2>
        <p>A composite Hawaiian high island, generated here in your browser: shaped by two volcanoes, carved by rain falling where the trade winds drop it, and divided into ahupuaʻa along its own watersheds.</p>
        <p>The weather is simulated: trade winds lift moist air over the mountains into cloud and rain; afternoon sun builds cumulus over the slopes; rainbows appear where sunlit rain sits opposite the sun.</p>
        <div class="help-keys">
          <span><b>Drag</b> turn</span><span><b>Right-drag / Shift</b> pan</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly there</span><span><b>← →</b> tour</span>
        </div>
      </div>`,t.appendChild(this.help)}bind(){this.modeEl.addEventListener("click",o=>{const l=o.target.closest("[data-mode]");l&&this.setMode(l.dataset.mode)}),this.tools.addEventListener("click",o=>{var h,d,u;const l=o.target.closest("[data-tool]");if(!l)return;const c=l.dataset.tool;c==="help"?this.help.classList.toggle("hidden"):c==="full"?document.fullscreenElement?(h=document.exitFullscreen)==null||h.call(document):(u=(d=document.documentElement).requestFullscreen)==null||u.call(d).catch(()=>{}):(this.layer[c]=!this.layer[c],this.applyLayers())}),this.help.addEventListener("click",o=>{(o.target===this.help||o.target.closest(".help-close"))&&this.help.classList.add("hidden")}),this.rail.addEventListener("click",o=>{const l=o.target.closest(".dot");l&&(this.setMode("tour",!1),this.goto(Number(l.dataset.i)))}),this.playBtn.addEventListener("click",()=>this.setPlaying(!this.playing)),this.dock.addEventListener("click",o=>{const l=o.target.closest("[data-regime]"),c=o.target.closest("[data-season]"),h=o.target.closest("[data-speed]");l&&this.app.weather.setMode(l.dataset.regime),c&&this.setSeason(c.dataset.season),h&&(this.app.clock.speed=Number(h.dataset.speed)),this.refreshDock()});const t=Te(".dial-svg",this.dock);let e=!1;const n=o=>{const l=t.getBoundingClientRect(),c=(o.clientX-l.left)/l.width*120,h=(o.clientY-l.top)/l.height*64;let d=Math.atan2(58-h,c-60);d<0&&(d=d<-Math.PI/2?Math.PI:0);const u=6+(Math.PI-d)/Math.PI*12;this.timeTween=null,this.app.clock.hour=u};t.addEventListener("pointerdown",o=>{e=!0,t.setPointerCapture(o.pointerId),n(o)}),t.addEventListener("pointermove",o=>e&&n(o)),t.addEventListener("pointerup",()=>e=!1);const i=this.app.canvas;let a=null;i.addEventListener("pointerdown",o=>a={x:o.clientX,y:o.clientY,t:performance.now()}),i.addEventListener("pointerup",o=>{if(!a)return;Math.hypot(o.clientX-a.x,o.clientY-a.y)<5&&performance.now()-a.t<400&&this.pick(o.clientX,o.clientY),a=null});let r=0;i.addEventListener("pointermove",o=>{if(o.buttons||o.pointerType==="touch")return;const l=performance.now();l-r<60||(r=l,this.hover(o.clientX,o.clientY))}),i.addEventListener("pointerleave",()=>this.hover(null)),addEventListener("keydown",o=>{o.key==="ArrowRight"&&!o.shiftKey&&this.mode==="tour"?(o.preventDefault(),this.goto(this.index+1)):o.key==="ArrowLeft"&&!o.shiftKey&&this.mode==="tour"?(o.preventDefault(),this.goto(this.index-1)):o.key==="Escape"?this.help.classList.contains("hidden")?this.closeCard():this.help.classList.add("hidden"):o.key===" "&&this.mode==="tour"&&o.target===document.body&&(o.preventDefault(),this.setPlaying(!this.playing))}),this.app.rig.onUserInput=()=>{this.playing&&this.setPlaying(!1)}}setMode(t,e=!0){if(this.mode===t&&e){t==="tour"&&this.index<0&&this.goto(0);return}this.mode=t;for(const n of this.modeEl.querySelectorAll(".mode"))n.classList.toggle("on",n.dataset.mode===t);this.root.classList.toggle("exploring",t==="explore"),t==="explore"?(this.setPlaying(!1),this.closeCard(),this.focusGoal=0,this.app.rig.autoOrbit=0,this.app.clock.speed=Math.max(this.app.clock.speed,30),this.applyLayers()):e&&this.goto(Math.max(0,this.index))}applyLayers(){for(const t of this.tools.querySelectorAll("[data-tool]")){const e=t.dataset.tool;e in this.layer&&t.classList.toggle("on",this.layer[e])}this.legend.classList.toggle("show",this.layer.zones),this.markerLayer.classList.toggle("hidden",!this.layer.pins||this.mode!=="explore"),this.mode==="explore"&&this.overlayGoal.set(this.layer.lines?1:0,this.layer.zones?1:0,this.layer.lines?.5:0,this.layer.lines?.8:.35)}setSeason(t){const e=this.app.clock;e.doy=t==="kau"?172:355,this.app.season=t,this.refreshDock()}setPlaying(t){this.playing=t,this.playBtn.innerHTML=ue(t?"pause":"play",18),this.playBtn.classList.toggle("on",t),t&&this.mode!=="tour"&&this.setMode("tour"),t&&(this.arrivedAt=performance.now())}goto(t){if(t<0||t>=this.stops.length){t>=this.stops.length&&this.setPlaying(!1);return}this.openStop(t,{fly:!0,explore:!1})}openStop(t,{fly:e,explore:n}){this.index=t;const i=this.stops[t],a=this.views[i.id];if(this.dots.forEach((u,m)=>{u.classList.toggle("on",m===t),u.classList.toggle("done",m<t)}),this.renderCard(i,n),!a)return;const r=this.app.rig,o=r.goal.target.distanceTo(a.target),l=Math.min(6,2.2+Math.sqrt(o)*.22+Math.abs(Math.log(a.distance/r.goal.distance))*.35),c=innerWidth/Math.max(1,innerHeight),h=a.distance*(c<1?Math.pow(1/c,a.distance>40?1:.5):1);e&&r.flyTo({target:a.target,distance:h,yaw:a.yaw,pitch:a.pitch,lift:a.lookUp||0},l,{onDone:()=>this.arrivedAt=performance.now()}),this.arrivedAt=performance.now()+l*1e3,r.autoOrbit=a.distance<60?.012:.02;const d=this.app.clock;if(a.doy!==void 0&&Math.abs(a.doy-d.doy)>2?d.doy=a.doy:a.doy===void 0&&this.lastDoy!==void 0&&d.doy!==this.lastDoy&&(d.doy=this.lastDoy),a.doy===void 0&&(this.lastDoy=d.doy),a.hour!==void 0){let u=a.hour-d.hour;u<-12&&(u+=24),u>12&&(u-=24),this.timeTween={from:d.hour,by:u,t:0,dur:l}}if(d.speed=20,a.weather&&this.app.weather.setMode(a.weather),this.app.weather.boost=a.boost?1:0,a.showers)for(const[u,m]of a.showers)this.app.weather.spawnShower(u,m,5+Math.random()*3,.7);if(a.ahu&&this.app.life&&this.app.life.walkTo(a.ahu.x,a.ahu.z),!n){const u=a.overlay||[0,0,0,0];this.overlayGoal.set(u[0],u[1],u[2],u[3]),this.focusGoal=a.focus||0}}renderCard(t,e){var a,r,o,l;const n=t.zone!==void 0&&t.zone!==null?Qr[t.zone]:null,i=this.stops.length;this.card.innerHTML=`
      <header>
        <div class="card-icon">${ue(t.icon,26)}</div>
        <div class="card-titles"><h1>${t.title}</h1><p class="gloss">${t.gloss}</p></div>
        <button class="card-close" aria-label="Close">${ue("close",18)}</button>
      </header>
      ${n?`<div class="zone-chip"><i style="background:${ts[t.zone]}"></i>${n.name}<em>${n.gloss}</em></div>`:""}
      <div class="card-body">${t.text.map(c=>`<p>${c}</p>`).join("")}</div>
      ${e?"":`<footer>
        <button class="nav prev" aria-label="Previous" ${this.index===0?"disabled":""}>${ue("prev",18)}</button>
        <span class="count">${this.index+1} / ${i}</span>
        ${this.index===i-1?`<button class="nav finish" aria-label="Explore">${ue("explore",18)}<span>Explore</span></button>`:`<button class="nav next" aria-label="Next">${ue("next",18)}</button>`}
      </footer>`}`,this.card.classList.add("show"),this.card.scrollTop=0,(a=Te(".prev",this.card))==null||a.addEventListener("click",()=>this.goto(this.index-1)),(r=Te(".next",this.card))==null||r.addEventListener("click",()=>this.goto(this.index+1)),(o=Te(".finish",this.card))==null||o.addEventListener("click",()=>this.setMode("explore")),(l=Te(".card-close",this.card))==null||l.addEventListener("click",()=>this.closeCard())}closeCard(){this.card.classList.remove("show")}regionAt(t,e){const n=this.app.island.data.region,i=hn,a=Math.floor((t+Zt)/Qt*i),r=Math.floor((e+Zt)/Qt*i);return a<0||r<0||a>=i||r>=i?0:n[(r*i+a)*4]}hover(t,e){if(t===null||this.mode!=="explore"){this.app.shared.uniforms.uHover.value=0,this.pinned||this.inspector.classList.remove("show");return}const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(this.app.shared.uniforms.uHover.value=i,!this.pinned){if(!i){this.inspector.classList.remove("show");return}this.showInspector(i,t,e)}}pick(t,e){if(this.mode!=="explore")return;const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(!i||i===this.focusGoal){this.focusGoal=0,this.pinned=!1,this.inspector.classList.remove("show","pinned");return}this.focusGoal=i,this.pinned=!0,this.showInspector(i,t,e,!0)}showInspector(t,e,n,i=!1){const a=this.meta.ahupuaa.find(c=>c.id===t);if(!a)return;if(this.inspectorId!==t){this.inspectorId=t;const c=wm[a.moku],h=this.counts[t]||{},d=(u,m)=>m?`<span class="st">${ue(u,15)}${m}</span>`:"";this.inspector.innerHTML=`
        <div class="in-head"><b>Ahupuaʻa</b><span class="in-moku"><i style="background:var(--moku${a.moku+1})"></i>${c.name}<em>${c.gloss}</em></span></div>
        ${Bm(a.profile)}
        <div class="in-stats"><span class="st">${a.area.toFixed(1)} km²</span><span class="st">${ue("akua",15)}${Math.round(a.top)} m</span>${d("loi",h.loi)}${d("kauhale",h.hale)}${d("heiau",h.heiau)}${d("loko",h.loko)}${d("koa",h.koa)}</div>`}this.inspector.classList.add("show"),this.inspector.classList.toggle("pinned",i);const r=innerWidth,o=Math.min(r-300,e+18),l=Math.max(70,Math.min(innerHeight-220,n+18));this.inspector.style.transform=`translate(${o}px, ${l}px)`}update(t){const e=this.app,n=e.shared.uniforms,i=1-Math.exp(-t*3);if(e.overlay.lerp(this.overlayGoal,i),this.focusGoal?(n.uFocus.value=this.focusGoal,n.uFocusK.value+=(1-n.uFocusK.value)*i):(n.uFocusK.value+=(0-n.uFocusK.value)*i,n.uFocusK.value<.01&&(n.uFocus.value=0)),this.timeTween){const a=this.timeTween;a.t=Math.min(1,a.t+t/a.dur),e.clock.hour=((a.from+a.by*Om(a.t))%24+24)%24,a.t>=1&&(this.timeTween=null)}if(this.playing&&this.mode==="tour"&&!e.rig.flight){const r=this.stops[this.index].text.join(" ").split(/\s+/).length,o=Math.max(9,r*.32)*1e3,l=performance.now()-this.arrivedAt;Te("span",this.progress).style.width=`${Math.min(100,l/o*100)}%`,l>o&&(this.index<this.stops.length-1?this.goto(this.index+1):this.setPlaying(!1))}else Te("span",this.progress).style.width="0%";this.updateMarkers(),this.frameN=(this.frameN||0)+1,this.frameN%6===0&&this.refreshDock()}updateMarkers(){if(this.mode!=="explore"||!this.layer.pins)return;const t=this.app.camera,e=innerWidth,n=innerHeight,i=new U,a=[],r=this.markers.map(o=>({m:o,d:t.position.distanceTo(o.pos)})).sort((o,l)=>o.d-l.d);for(const{m:o,d:l}of r){i.copy(o.pos).project(t);const c=i.z>1,h=(i.x+1)/2*e,d=(1-i.y)/2*n;let u=!c&&h>-40&&h<e+40&&d>60&&d<n+40&&l<420;u&&a.some(m=>Math.abs(m[0]-h)<44&&Math.abs(m[1]-d)<40)&&(u=!1),u&&a.push([h,d]),o.el.style.opacity=u?String(Math.min(1,(420-l)/120)):"0",o.el.style.pointerEvents=u?"auto":"none",u&&(o.el.style.transform=`translate(${h}px, ${d}px)`),o.el.classList.toggle("near",l<40)}}refreshDock(){const t=this.app,e=t.clock,n=t.light,i=Te(".dial-body",this.dock),a=(e.hour-6)/12,r=e.hour<6||e.hour>18;let o;if(!r)o=Math.PI-a*Math.PI;else{const p=(e.hour-18+24)%24/12;o=Math.PI-p*Math.PI}const l=60+Math.cos(o)*52,c=58-Math.sin(o)*52;i.setAttribute("transform",`translate(${l.toFixed(1)} ${c.toFixed(1)})`),i.classList.toggle("moon",r),Te(".dial-time",this.dock).textContent=zm(e.hour);const h=D0[t.sky.astro.night]||"",d=Te(".dial-night",this.dock);d.textContent=n.night>.5?`Pō ${h}`:"",d.title="The night of the Hawaiian lunar month";for(const p of this.dock.querySelectorAll("[data-regime]"))p.classList.toggle("on",t.weather.mode===p.dataset.regime);const u=e.doy>120&&e.doy<305?"kau":"hooilo";t.season=u;for(const p of this.dock.querySelectorAll("[data-season]"))p.classList.toggle("on",u===p.dataset.season);for(const p of this.dock.querySelectorAll("[data-speed]"))p.classList.toggle("on",Number(p.dataset.speed)===e.speed||e.speed===20&&p.dataset.speed==="30");const m=t.weather.wind,v=Math.atan2(m.x,-m.y)*180/Math.PI;Te(".wind-arrow",this.dock).style.transform=`rotate(${v.toFixed(0)}deg)`,Te(".wind-speed",this.dock).textContent=`${Math.round(m.length()*3.6)} km/h`;const g=Ns[t.weather.regime];Te(".wind",this.dock).title=`${g.name} — ${g.gloss}`}start(){this.setMode("tour",!1),this.applyLayers(),this.goto(0)}}function Bm(s){if(!s||s.length<2)return"";const t=260,e=78,n=s[s.length-1][0],i=Math.max(...s.map(u=>u[1]),200),a=Math.min(...s.map(u=>u[1]),-30),r=(e-14)/(i-a),o=u=>t-u/n*(t-4)-2,l=u=>e-6-(u-a)*r,c=l(0);let h="";for(let u=0;u<s.length-1;u++){const m=s[u],v=s[u+1];h+=`<path d="M${o(m[0]).toFixed(1)} ${c.toFixed(1)}L${o(m[0]).toFixed(1)} ${l(m[1]).toFixed(1)}L${o(v[0]).toFixed(1)} ${l(v[1]).toFixed(1)}L${o(v[0]).toFixed(1)} ${c.toFixed(1)}Z" fill="${ts[m[2]]}" stroke="${ts[m[2]]}" stroke-width=".6"/>`}const d=s.map((u,m)=>`${m?"L":"M"}${o(u[0]).toFixed(1)} ${l(u[1]).toFixed(1)}`).join("");return`<svg class="profile" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none">
    <rect x="0" y="${c.toFixed(1)}" width="${t}" height="${(e-c).toFixed(1)}" fill="rgba(60,120,190,0.35)"/>
    ${h}
    <path d="${d}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.2"/>
    <line x1="0" x2="${t}" y1="${c.toFixed(1)}" y2="${c.toFixed(1)}" stroke="rgba(255,255,255,0.4)" stroke-width=".8"/>
  </svg>
  <div class="profile-ends"><span>mauka</span><span>makai</span></div>`}const $s=document.getElementById("boot"),Gm=$s.querySelector(".boot-bar span"),kl=$s.querySelector(".boot-stage"),Hm={shape:["raising the shields",.02,.1],erode:["the rain carves valleys",.1,.42],valleys:["filling the valley floors",.42,.55],coast:["growing the reef",.55,.7],divide:["tracing the ridgelines",.66,.7],detail:["shaping the ridges",.7,.8],people:["the people arrive",.8,.86],light:["reading the light",.86,.94],sky:["gathering clouds",.94,.99],done:["",1,1]};function Vm(s){return new Promise((t,e)=>{const n=new Worker(new URL(""+new URL("worker-CFU0dfvI.js",import.meta.url).href,import.meta.url),{type:"module"});n.onmessage=i=>{const a=i.data;if(a.type==="progress"){const r=Hm[a.stage];if(!r)return;kl.textContent=r[0],Gm.style.width=`${(r[1]+(r[2]-r[1])*a.p)*100}%`}else a.type==="done"?(n.terminate(),t({data:a.data,meta:a.meta})):a.type==="error"&&(n.terminate(),e(new Error(a.message)))},n.onerror=i=>e(i),n.postMessage({seed:s})})}async function Wm(){const s=performance.now(),t=await Vm(Yl);console.log(`island generated in ${((performance.now()-s)/1e3).toFixed(1)} s`);const e=new Dm(document.getElementById("scene"),t),n=new km(e);window.__app=e,e.ui=n;let i=0;const a=()=>{if(++i<4)return requestAnimationFrame(a);$s.classList.add("gone"),setTimeout(()=>$s.remove(),1200),new URLSearchParams(location.search).has("cam")||n.start()};requestAnimationFrame(a)}Wm().catch(s=>{console.error(s),kl.textContent="something went wrong — see the console"});
