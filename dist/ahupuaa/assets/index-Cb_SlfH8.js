(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=e(i);fetch(i.href,a)}})();const Qt=360,Zt=Qt/2,Gl=.01,Hl=1.3,nn=Gl*Hl,Hn=2048,cn=1024,Vl=20261004;function co(s){const t=(s+180)*Math.PI/180;return[Math.sin(t),-Math.cos(t)]}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Xa="160",Wl=0,ho=1,Xl=2,jr=1,ql=2,gn=3,Mn=0,Ue=1,Ye=2,Rn=0,_i=1,Da=2,uo=3,fo=4,Yl=5,Vn=100,$l=101,Kl=102,po=103,mo=104,jl=200,Zl=201,Jl=202,Ql=203,Ua=204,Ia=205,tc=206,ec=207,nc=208,ic=209,sc=210,ac=211,oc=212,rc=213,lc=214,cc=0,hc=1,uc=2,Fs=3,dc=4,fc=5,pc=6,mc=7,Zr=0,gc=1,vc=2,Ln=0,_c=1,xc=2,Mc=3,yc=4,Sc=5,wc=6,Jr=300,Mi=301,yi=302,Fa=303,Na=304,Xs=306,Si=1e3,Ve=1001,za=1002,de=1003,go=1004,Qs=1005,ee=1006,Ec=1007,$n=1008,Ke=1009,bc=1010,Tc=1011,qa=1012,Qr=1013,_n=1014,ln=1015,Pn=1016,tl=1017,el=1018,Xn=1020,Ac=1021,Ne=1023,Cc=1024,Rc=1025,qn=1026,wi=1027,Ns=1028,nl=1029,Lc=1030,il=1031,sl=1033,ta=33776,ea=33777,na=33778,ia=33779,vo=35840,_o=35841,xo=35842,Mo=35843,al=36196,yo=37492,So=37496,wo=37808,Eo=37809,bo=37810,To=37811,Ao=37812,Co=37813,Ro=37814,Lo=37815,Po=37816,Do=37817,Uo=37818,Io=37819,Fo=37820,No=37821,sa=36492,zo=36494,Oo=36495,Pc=36283,ko=36284,Bo=36285,Go=36286,ol=3e3,Yn=3001,Dc=3200,Uc=3201,Ic=0,Fc=1,$e="",Me="srgb",yn="srgb-linear",Ya="display-p3",qs="display-p3-linear",zs="linear",Jt="srgb",Os="rec709",ks="p3",jn=7680,Ho=519,Nc=512,zc=513,Oc=514,rl=515,kc=516,Bc=517,Gc=518,Hc=519,Vo=35044,Gi=35048,Wo="300 es",Oa=1035,xn=2e3,Bs=2001;class Ti{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const a=i.indexOf(e);a!==-1&&i.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let a=0,r=i.length;a<r;a++)i[a].call(this,t);t.target=null}}}const we=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Xo=1234567;const Hi=Math.PI/180,qi=180/Math.PI;function Ai(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(we[s&255]+we[s>>8&255]+we[s>>16&255]+we[s>>24&255]+"-"+we[t&255]+we[t>>8&255]+"-"+we[t>>16&15|64]+we[t>>24&255]+"-"+we[e&63|128]+we[e>>8&255]+"-"+we[e>>16&255]+we[e>>24&255]+we[n&255]+we[n>>8&255]+we[n>>16&255]+we[n>>24&255]).toLowerCase()}function De(s,t,e){return Math.max(t,Math.min(e,s))}function $a(s,t){return(s%t+t)%t}function Vc(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Wc(s,t,e){return s!==t?(e-s)/(t-s):0}function Vi(s,t,e){return(1-e)*s+e*t}function Xc(s,t,e,n){return Vi(s,t,1-Math.exp(-e*n))}function qc(s,t=1){return t-Math.abs($a(s,t*2)-t)}function Yc(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function $c(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Kc(s,t){return s+Math.floor(Math.random()*(t-s+1))}function jc(s,t){return s+Math.random()*(t-s)}function Zc(s){return s*(.5-Math.random())}function Jc(s){s!==void 0&&(Xo=s);let t=Xo+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Qc(s){return s*Hi}function th(s){return s*qi}function ka(s){return(s&s-1)===0&&s!==0}function eh(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Gs(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function nh(s,t,e,n,i){const a=Math.cos,r=Math.sin,o=a(e/2),l=r(e/2),c=a((t+n)/2),h=r((t+n)/2),u=a((t-n)/2),d=r((t-n)/2),f=a((n-t)/2),v=r((n-t)/2);switch(i){case"XYX":s.set(o*h,l*u,l*d,o*c);break;case"YZY":s.set(l*d,o*h,l*u,o*c);break;case"ZXZ":s.set(l*u,l*d,o*h,o*c);break;case"XZX":s.set(o*h,l*v,l*f,o*c);break;case"YXY":s.set(l*f,o*h,l*v,o*c);break;case"ZYZ":s.set(l*v,l*f,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function mi(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Le(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const on={DEG2RAD:Hi,RAD2DEG:qi,generateUUID:Ai,clamp:De,euclideanModulo:$a,mapLinear:Vc,inverseLerp:Wc,lerp:Vi,damp:Xc,pingpong:qc,smoothstep:Yc,smootherstep:$c,randInt:Kc,randFloat:jc,randFloatSpread:Zc,seededRandom:Jc,degToRad:Qc,radToDeg:th,isPowerOfTwo:ka,ceilPowerOfTwo:eh,floorPowerOfTwo:Gs,setQuaternionFromProperEuler:nh,normalize:Le,denormalize:mi};class Tt{constructor(t=0,e=0){Tt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(De(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*n-r*i+t.x,this.y=a*i+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Gt{constructor(t,e,n,i,a,r,o,l,c){Gt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,a,r,o,l,c)}set(t,e,n,i,a,r,o,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=a,h[5]=l,h[6]=n,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,a=this.elements,r=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],v=n[8],_=i[0],m=i[3],p=i[6],x=i[1],g=i[4],M=i[7],w=i[2],y=i[5],A=i[8];return a[0]=r*_+o*x+l*w,a[3]=r*m+o*g+l*y,a[6]=r*p+o*M+l*A,a[1]=c*_+h*x+u*w,a[4]=c*m+h*g+u*y,a[7]=c*p+h*M+u*A,a[2]=d*_+f*x+v*w,a[5]=d*m+f*g+v*y,a[8]=d*p+f*M+v*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*r*h-e*o*c-n*a*h+n*o*l+i*a*c-i*r*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*r-o*c,d=o*l-h*a,f=c*a-r*l,v=e*u+n*d+i*f;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/v;return t[0]=u*_,t[1]=(i*c-h*n)*_,t[2]=(o*n-i*r)*_,t[3]=d*_,t[4]=(h*e-i*l)*_,t[5]=(i*a-o*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(r*e-n*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(n*l,n*c,-n*(l*r+c*o)+r+t,-i*c,i*l,-i*(-c*r+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(aa.makeScale(t,e)),this}rotate(t){return this.premultiply(aa.makeRotation(-t)),this}translate(t,e){return this.premultiply(aa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const aa=new Gt;function ll(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Hs(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function ih(){const s=Hs("canvas");return s.style.display="block",s}const qo={};function Wi(s){s in qo||(qo[s]=!0,console.warn(s))}const Yo=new Gt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),$o=new Gt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),as={[yn]:{transfer:zs,primaries:Os,toReference:s=>s,fromReference:s=>s},[Me]:{transfer:Jt,primaries:Os,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[qs]:{transfer:zs,primaries:ks,toReference:s=>s.applyMatrix3($o),fromReference:s=>s.applyMatrix3(Yo)},[Ya]:{transfer:Jt,primaries:ks,toReference:s=>s.convertSRGBToLinear().applyMatrix3($o),fromReference:s=>s.applyMatrix3(Yo).convertLinearToSRGB()}},sh=new Set([yn,qs]),Yt={enabled:!0,_workingColorSpace:yn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!sh.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=as[t].toReference,i=as[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return as[s].primaries},getTransfer:function(s){return s===$e?zs:as[s].transfer}};function xi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function oa(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Zn;class cl{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Zn===void 0&&(Zn=Hs("canvas")),Zn.width=t.width,Zn.height=t.height;const n=Zn.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Zn}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Hs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),a=i.data;for(let r=0;r<a.length;r++)a[r]=xi(a[r]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(xi(e[n]/255)*255):e[n]=xi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let ah=0;class hl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ah++}),this.uuid=Ai(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let a;if(Array.isArray(i)){a=[];for(let r=0,o=i.length;r<o;r++)i[r].isDataTexture?a.push(ra(i[r].image)):a.push(ra(i[r]))}else a=ra(i);n.url=a}return e||(t.images[this.uuid]=n),n}}function ra(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?cl.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let oh=0;class ze extends Ti{constructor(t=ze.DEFAULT_IMAGE,e=ze.DEFAULT_MAPPING,n=Ve,i=Ve,a=ee,r=$n,o=Ne,l=Ke,c=ze.DEFAULT_ANISOTROPY,h=$e){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:oh++}),this.uuid=Ai(),this.name="",this.source=new hl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Tt(0,0),this.repeat=new Tt(1,1),this.center=new Tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Wi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Yn?Me:$e),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Jr)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Si:t.x=t.x-Math.floor(t.x);break;case Ve:t.x=t.x<0?0:1;break;case za:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Si:t.y=t.y-Math.floor(t.y);break;case Ve:t.y=t.y<0?0:1;break;case za:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Wi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Me?Yn:ol}set encoding(t){Wi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Yn?Me:$e}}ze.DEFAULT_IMAGE=null;ze.DEFAULT_MAPPING=Jr;ze.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,i=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i+r[12]*a,this.y=r[1]*e+r[5]*n+r[9]*i+r[13]*a,this.z=r[2]*e+r[6]*n+r[10]*i+r[14]*a,this.w=r[3]*e+r[7]*n+r[11]*i+r[15]*a,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,a;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],v=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(v-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(v+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const g=(c+1)/2,M=(f+1)/2,w=(p+1)/2,y=(h+d)/4,A=(u+_)/4,U=(v+m)/4;return g>M&&g>w?g<.01?(n=0,i=.707106781,a=.707106781):(n=Math.sqrt(g),i=y/n,a=A/n):M>w?M<.01?(n=.707106781,i=0,a=.707106781):(i=Math.sqrt(M),n=y/i,a=U/i):w<.01?(n=.707106781,i=.707106781,a=0):(a=Math.sqrt(w),n=A/a,i=U/a),this.set(n,i,a,e),this}let x=Math.sqrt((m-v)*(m-v)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-v)/x,this.y=(u-_)/x,this.z=(d-h)/x,this.w=Math.acos((c+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class rh extends Ti{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(Wi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Yn?Me:$e),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ee,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new ze(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new hl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class sn extends rh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ul extends ze{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=de,this.minFilter=de,this.wrapR=Ve,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ba extends ze{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=de,this.minFilter=de,this.wrapR=Ve,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Dn{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,a,r,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=a[r+0],f=a[r+1],v=a[r+2],_=a[r+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=v,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==v){let m=1-o;const p=l*d+c*f+h*v+u*_,x=p>=0?1:-1,g=1-p*p;if(g>Number.EPSILON){const w=Math.sqrt(g),y=Math.atan2(w,p*x);m=Math.sin(m*y)/w,o=Math.sin(o*y)/w}const M=o*x;if(l=l*m+d*M,c=c*m+f*M,h=h*m+v*M,u=u*m+_*M,m===1-o){const w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,a,r){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=a[r],d=a[r+1],f=a[r+2],v=a[r+3];return t[e]=o*v+h*u+l*f-c*d,t[e+1]=l*v+h*d+c*u-o*f,t[e+2]=c*v+h*f+o*d-l*u,t[e+3]=h*v-o*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,a=t._z,r=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(a/2),d=l(n/2),f=l(i/2),v=l(a/2);switch(r){case"XYZ":this._x=d*h*u+c*f*v,this._y=c*f*u-d*h*v,this._z=c*h*v+d*f*u,this._w=c*h*u-d*f*v;break;case"YXZ":this._x=d*h*u+c*f*v,this._y=c*f*u-d*h*v,this._z=c*h*v-d*f*u,this._w=c*h*u+d*f*v;break;case"ZXY":this._x=d*h*u-c*f*v,this._y=c*f*u+d*h*v,this._z=c*h*v+d*f*u,this._w=c*h*u-d*f*v;break;case"ZYX":this._x=d*h*u-c*f*v,this._y=c*f*u+d*h*v,this._z=c*h*v-d*f*u,this._w=c*h*u+d*f*v;break;case"YZX":this._x=d*h*u+c*f*v,this._y=c*f*u+d*h*v,this._z=c*h*v-d*f*u,this._w=c*h*u-d*f*v;break;case"XZY":this._x=d*h*u-c*f*v,this._y=c*f*u-d*h*v,this._z=c*h*v+d*f*u,this._w=c*h*u+d*f*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],a=e[8],r=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(a-c)*f,this._z=(r-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+r)/f,this._z=(a+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(a-c)/f,this._x=(i+r)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(r-i)/f,this._x=(a+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(De(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,a=t._z,r=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+r*o+i*c-a*l,this._y=i*h+r*l+a*o-n*c,this._z=a*h+r*c+n*l-i*o,this._w=r*h-n*o-i*l-a*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,a=this._z,r=this._w;let o=r*t._w+n*t._x+i*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=n,this._y=i,this._z=a,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-e;return this._w=f*r+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*a+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=r*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=a*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),a=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(a),n*Math.cos(a),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,n=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ko.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ko.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*i,this.y=a[1]*e+a[4]*n+a[7]*i,this.z=a[2]*e+a[5]*n+a[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,a=t.elements,r=1/(a[3]*e+a[7]*n+a[11]*i+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*i+a[12])*r,this.y=(a[1]*e+a[5]*n+a[9]*i+a[13])*r,this.z=(a[2]*e+a[6]*n+a[10]*i+a[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,a=t.x,r=t.y,o=t.z,l=t.w,c=2*(r*i-o*n),h=2*(o*e-a*i),u=2*(a*n-r*e);return this.x=e+l*c+r*u-o*h,this.y=n+l*h+o*c-a*u,this.z=i+l*u+a*h-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i,this.y=a[1]*e+a[5]*n+a[9]*i,this.z=a[2]*e+a[6]*n+a[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,a=t.z,r=e.x,o=e.y,l=e.z;return this.x=i*l-a*o,this.y=a*r-n*l,this.z=n*o-i*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return la.copy(this).projectOnVector(t),this.sub(la)}reflect(t){return this.sub(la.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(De(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const la=new D,Ko=new Dn;class Un{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ze.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ze.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Ze.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,Ze):Ze.fromBufferAttribute(a,r),Ze.applyMatrix4(t.matrixWorld),this.expandByPoint(Ze);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),os.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),os.copy(n.boundingBox)),os.applyMatrix4(t.matrixWorld),this.union(os)}const i=t.children;for(let a=0,r=i.length;a<r;a++)this.expandByObject(i[a],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Ze),Ze.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Pi),rs.subVectors(this.max,Pi),Jn.subVectors(t.a,Pi),Qn.subVectors(t.b,Pi),ti.subVectors(t.c,Pi),Sn.subVectors(Qn,Jn),wn.subVectors(ti,Qn),Nn.subVectors(Jn,ti);let e=[0,-Sn.z,Sn.y,0,-wn.z,wn.y,0,-Nn.z,Nn.y,Sn.z,0,-Sn.x,wn.z,0,-wn.x,Nn.z,0,-Nn.x,-Sn.y,Sn.x,0,-wn.y,wn.x,0,-Nn.y,Nn.x,0];return!ca(e,Jn,Qn,ti,rs)||(e=[1,0,0,0,1,0,0,0,1],!ca(e,Jn,Qn,ti,rs))?!1:(ls.crossVectors(Sn,wn),e=[ls.x,ls.y,ls.z],ca(e,Jn,Qn,ti,rs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ze).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ze).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(un),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const un=[new D,new D,new D,new D,new D,new D,new D,new D],Ze=new D,os=new Un,Jn=new D,Qn=new D,ti=new D,Sn=new D,wn=new D,Nn=new D,Pi=new D,rs=new D,ls=new D,zn=new D;function ca(s,t,e,n,i){for(let a=0,r=s.length-3;a<=r;a+=3){zn.fromArray(s,a);const o=i.x*Math.abs(zn.x)+i.y*Math.abs(zn.y)+i.z*Math.abs(zn.z),l=t.dot(zn),c=e.dot(zn),h=n.dot(zn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const lh=new Un,Di=new D,ha=new D;class Ci{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):lh.setFromPoints(t).getCenter(n);let i=0;for(let a=0,r=t.length;a<r;a++)i=Math.max(i,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Di.subVectors(t,this.center);const e=Di.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Di,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ha.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Di.copy(t.center).add(ha)),this.expandByPoint(Di.copy(t.center).sub(ha))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const dn=new D,ua=new D,cs=new D,En=new D,da=new D,hs=new D,fa=new D;class Ka{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(dn.copy(this.origin).addScaledVector(this.direction,e),dn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){ua.copy(t).add(e).multiplyScalar(.5),cs.copy(e).sub(t).normalize(),En.copy(this.origin).sub(ua);const a=t.distanceTo(e)*.5,r=-this.direction.dot(cs),o=En.dot(this.direction),l=-En.dot(cs),c=En.lengthSq(),h=Math.abs(1-r*r);let u,d,f,v;if(h>0)if(u=r*l-o,d=r*o-l,v=a*h,u>=0)if(d>=-v)if(d<=v){const _=1/h;u*=_,d*=_,f=u*(u+r*d+2*o)+d*(r*u+d+2*l)+c}else d=a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;else d=-a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-v?(u=Math.max(0,-(-r*a+o)),d=u>0?-a:Math.min(Math.max(-a,-l),a),f=-u*u+d*(d+2*l)+c):d<=v?(u=0,d=Math.min(Math.max(-a,-l),a),f=d*(d+2*l)+c):(u=Math.max(0,-(r*a+o)),d=u>0?a:Math.min(Math.max(-a,-l),a),f=-u*u+d*(d+2*l)+c);else d=r>0?-a:a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(ua).addScaledVector(cs,d),f}intersectSphere(t,e){dn.subVectors(t.center,this.origin);const n=dn.dot(this.direction),i=dn.dot(dn)-n*n,a=t.radius*t.radius;if(i>a)return null;const r=Math.sqrt(a-i),o=n-r,l=n+r;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,a,r,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),h>=0?(a=(t.min.y-d.y)*h,r=(t.max.y-d.y)*h):(a=(t.max.y-d.y)*h,r=(t.min.y-d.y)*h),n>r||a>i||((a>n||isNaN(n))&&(n=a),(r<i||isNaN(i))&&(i=r),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,dn)!==null}intersectTriangle(t,e,n,i,a){da.subVectors(e,t),hs.subVectors(n,t),fa.crossVectors(da,hs);let r=this.direction.dot(fa),o;if(r>0){if(i)return null;o=1}else if(r<0)o=-1,r=-r;else return null;En.subVectors(this.origin,t);const l=o*this.direction.dot(hs.crossVectors(En,hs));if(l<0)return null;const c=o*this.direction.dot(da.cross(En));if(c<0||l+c>r)return null;const h=-o*En.dot(fa);return h<0?null:this.at(h/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Xt{constructor(t,e,n,i,a,r,o,l,c,h,u,d,f,v,_,m){Xt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,a,r,o,l,c,h,u,d,f,v,_,m)}set(t,e,n,i,a,r,o,l,c,h,u,d,f,v,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=a,p[5]=r,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=v,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/ei.setFromMatrixColumn(t,0).length(),a=1/ei.setFromMatrixColumn(t,1).length(),r=1/ei.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,a=t.z,r=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(a),u=Math.sin(a);if(t.order==="XYZ"){const d=r*h,f=r*u,v=o*h,_=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+v*c,e[5]=d-_*c,e[9]=-o*l,e[2]=_-d*c,e[6]=v+f*c,e[10]=r*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,v=c*h,_=c*u;e[0]=d+_*o,e[4]=v*o-f,e[8]=r*c,e[1]=r*u,e[5]=r*h,e[9]=-o,e[2]=f*o-v,e[6]=_+d*o,e[10]=r*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,v=c*h,_=c*u;e[0]=d-_*o,e[4]=-r*u,e[8]=v+f*o,e[1]=f+v*o,e[5]=r*h,e[9]=_-d*o,e[2]=-r*c,e[6]=o,e[10]=r*l}else if(t.order==="ZYX"){const d=r*h,f=r*u,v=o*h,_=o*u;e[0]=l*h,e[4]=v*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-v,e[2]=-c,e[6]=o*l,e[10]=r*l}else if(t.order==="YZX"){const d=r*l,f=r*c,v=o*l,_=o*c;e[0]=l*h,e[4]=_-d*u,e[8]=v*u+f,e[1]=u,e[5]=r*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*u+v,e[10]=d-_*u}else if(t.order==="XZY"){const d=r*l,f=r*c,v=o*l,_=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=r*h,e[9]=f*u-v,e[2]=v*u-f,e[6]=o*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ch,t,hh)}lookAt(t,e,n){const i=this.elements;return Ge.subVectors(t,e),Ge.lengthSq()===0&&(Ge.z=1),Ge.normalize(),bn.crossVectors(n,Ge),bn.lengthSq()===0&&(Math.abs(n.z)===1?Ge.x+=1e-4:Ge.z+=1e-4,Ge.normalize(),bn.crossVectors(n,Ge)),bn.normalize(),us.crossVectors(Ge,bn),i[0]=bn.x,i[4]=us.x,i[8]=Ge.x,i[1]=bn.y,i[5]=us.y,i[9]=Ge.y,i[2]=bn.z,i[6]=us.z,i[10]=Ge.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,a=this.elements,r=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],v=n[2],_=n[6],m=n[10],p=n[14],x=n[3],g=n[7],M=n[11],w=n[15],y=i[0],A=i[4],U=i[8],S=i[12],b=i[1],z=i[5],X=i[9],K=i[13],R=i[2],F=i[6],L=i[10],N=i[14],q=i[3],W=i[7],$=i[11],Z=i[15];return a[0]=r*y+o*b+l*R+c*q,a[4]=r*A+o*z+l*F+c*W,a[8]=r*U+o*X+l*L+c*$,a[12]=r*S+o*K+l*N+c*Z,a[1]=h*y+u*b+d*R+f*q,a[5]=h*A+u*z+d*F+f*W,a[9]=h*U+u*X+d*L+f*$,a[13]=h*S+u*K+d*N+f*Z,a[2]=v*y+_*b+m*R+p*q,a[6]=v*A+_*z+m*F+p*W,a[10]=v*U+_*X+m*L+p*$,a[14]=v*S+_*K+m*N+p*Z,a[3]=x*y+g*b+M*R+w*q,a[7]=x*A+g*z+M*F+w*W,a[11]=x*U+g*X+M*L+w*$,a[15]=x*S+g*K+M*N+w*Z,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],a=t[12],r=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],v=t[3],_=t[7],m=t[11],p=t[15];return v*(+a*l*u-i*c*u-a*o*d+n*c*d+i*o*f-n*l*f)+_*(+e*l*f-e*c*d+a*r*d-i*r*f+i*c*h-a*l*h)+m*(+e*c*u-e*o*f-a*r*u+n*r*f+a*o*h-n*c*h)+p*(-i*o*h-e*l*u+e*o*d+i*r*u-n*r*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],v=t[12],_=t[13],m=t[14],p=t[15],x=u*m*c-_*d*c+_*l*f-o*m*f-u*l*p+o*d*p,g=v*d*c-h*m*c-v*l*f+r*m*f+h*l*p-r*d*p,M=h*_*c-v*u*c+v*o*f-r*_*f-h*o*p+r*u*p,w=v*u*l-h*_*l-v*o*d+r*_*d+h*o*m-r*u*m,y=e*x+n*g+i*M+a*w;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/y;return t[0]=x*A,t[1]=(_*d*a-u*m*a-_*i*f+n*m*f+u*i*p-n*d*p)*A,t[2]=(o*m*a-_*l*a+_*i*c-n*m*c-o*i*p+n*l*p)*A,t[3]=(u*l*a-o*d*a-u*i*c+n*d*c+o*i*f-n*l*f)*A,t[4]=g*A,t[5]=(h*m*a-v*d*a+v*i*f-e*m*f-h*i*p+e*d*p)*A,t[6]=(v*l*a-r*m*a-v*i*c+e*m*c+r*i*p-e*l*p)*A,t[7]=(r*d*a-h*l*a+h*i*c-e*d*c-r*i*f+e*l*f)*A,t[8]=M*A,t[9]=(v*u*a-h*_*a-v*n*f+e*_*f+h*n*p-e*u*p)*A,t[10]=(r*_*a-v*o*a+v*n*c-e*_*c-r*n*p+e*o*p)*A,t[11]=(h*o*a-r*u*a-h*n*c+e*u*c+r*n*f-e*o*f)*A,t[12]=w*A,t[13]=(h*_*i-v*u*i+v*n*d-e*_*d-h*n*m+e*u*m)*A,t[14]=(v*o*i-r*_*i-v*n*l+e*_*l+r*n*m-e*o*m)*A,t[15]=(r*u*i-h*o*i+h*n*l-e*u*l-r*n*d+e*o*d)*A,this}scale(t){const e=this.elements,n=t.x,i=t.y,a=t.z;return e[0]*=n,e[4]*=i,e[8]*=a,e[1]*=n,e[5]*=i,e[9]*=a,e[2]*=n,e[6]*=i,e[10]*=a,e[3]*=n,e[7]*=i,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),a=1-n,r=t.x,o=t.y,l=t.z,c=a*r,h=a*o;return this.set(c*r+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*r,0,c*l-i*o,h*l+i*r,a*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,a,r){return this.set(1,n,a,0,t,1,r,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,a=e._x,r=e._y,o=e._z,l=e._w,c=a+a,h=r+r,u=o+o,d=a*c,f=a*h,v=a*u,_=r*h,m=r*u,p=o*u,x=l*c,g=l*h,M=l*u,w=n.x,y=n.y,A=n.z;return i[0]=(1-(_+p))*w,i[1]=(f+M)*w,i[2]=(v-g)*w,i[3]=0,i[4]=(f-M)*y,i[5]=(1-(d+p))*y,i[6]=(m+x)*y,i[7]=0,i[8]=(v+g)*A,i[9]=(m-x)*A,i[10]=(1-(d+_))*A,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let a=ei.set(i[0],i[1],i[2]).length();const r=ei.set(i[4],i[5],i[6]).length(),o=ei.set(i[8],i[9],i[10]).length();this.determinant()<0&&(a=-a),t.x=i[12],t.y=i[13],t.z=i[14],Je.copy(this);const c=1/a,h=1/r,u=1/o;return Je.elements[0]*=c,Je.elements[1]*=c,Je.elements[2]*=c,Je.elements[4]*=h,Je.elements[5]*=h,Je.elements[6]*=h,Je.elements[8]*=u,Je.elements[9]*=u,Je.elements[10]*=u,e.setFromRotationMatrix(Je),n.x=a,n.y=r,n.z=o,this}makePerspective(t,e,n,i,a,r,o=xn){const l=this.elements,c=2*a/(e-t),h=2*a/(n-i),u=(e+t)/(e-t),d=(n+i)/(n-i);let f,v;if(o===xn)f=-(r+a)/(r-a),v=-2*r*a/(r-a);else if(o===Bs)f=-r/(r-a),v=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,a,r,o=xn){const l=this.elements,c=1/(e-t),h=1/(n-i),u=1/(r-a),d=(e+t)*c,f=(n+i)*h;let v,_;if(o===xn)v=(r+a)*u,_=-2*u;else if(o===Bs)v=a*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ei=new D,Je=new Xt,ch=new D(0,0,0),hh=new D(1,1,1),bn=new D,us=new D,Ge=new D,jo=new Xt,Zo=new Dn;class Ei{constructor(t=0,e=0,n=0,i=Ei.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,a=i[0],r=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(De(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-De(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(De(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-De(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(De(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-De(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return jo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(jo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Zo.setFromEuler(this),this.setFromQuaternion(Zo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ei.DEFAULT_ORDER="XYZ";class ja{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let uh=0;const Jo=new D,ni=new Dn,fn=new Xt,ds=new D,Ui=new D,dh=new D,fh=new Dn,Qo=new D(1,0,0),tr=new D(0,1,0),er=new D(0,0,1),ph={type:"added"},mh={type:"removed"};class Oe extends Ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:uh++}),this.uuid=Ai(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Oe.DEFAULT_UP.clone();const t=new D,e=new Ei,n=new Dn,i=new D(1,1,1);function a(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Xt},normalMatrix:{value:new Gt}}),this.matrix=new Xt,this.matrixWorld=new Xt,this.matrixAutoUpdate=Oe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ja,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ni.setFromAxisAngle(t,e),this.quaternion.multiply(ni),this}rotateOnWorldAxis(t,e){return ni.setFromAxisAngle(t,e),this.quaternion.premultiply(ni),this}rotateX(t){return this.rotateOnAxis(Qo,t)}rotateY(t){return this.rotateOnAxis(tr,t)}rotateZ(t){return this.rotateOnAxis(er,t)}translateOnAxis(t,e){return Jo.copy(t).applyQuaternion(this.quaternion),this.position.add(Jo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Qo,t)}translateY(t){return this.translateOnAxis(tr,t)}translateZ(t){return this.translateOnAxis(er,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ds.copy(t):ds.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ui.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(Ui,ds,this.up):fn.lookAt(ds,Ui,this.up),this.quaternion.setFromRotationMatrix(fn),i&&(fn.extractRotation(i.matrixWorld),ni.setFromRotationMatrix(fn),this.quaternion.premultiply(ni.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(ph)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(mh)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),fn.multiply(t.parent.matrixWorld)),t.applyMatrix4(fn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let a=0,r=i.length;a<r;a++)i[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ui,t,dh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ui,fh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const a=e[n];(a.matrixWorldAutoUpdate===!0||t===!0)&&a.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let a=0,r=i.length;a<r;a++){const o=i[a];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];a(t.shapes,u)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(t.materials,this.material[l]));i.material=o}else i.material=a(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(a(t.animations,l))}}if(e){const o=r(t.geometries),l=r(t.materials),c=r(t.textures),h=r(t.images),u=r(t.shapes),d=r(t.skeletons),f=r(t.animations),v=r(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),v.length>0&&(n.nodes=v)}return n.object=i,n;function r(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Oe.DEFAULT_UP=new D(0,1,0);Oe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Qe=new D,pn=new D,pa=new D,mn=new D,ii=new D,si=new D,nr=new D,ma=new D,ga=new D,va=new D;let fs=!1;class tn{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Qe.subVectors(t,e),i.cross(Qe);const a=i.lengthSq();return a>0?i.multiplyScalar(1/Math.sqrt(a)):i.set(0,0,0)}static getBarycoord(t,e,n,i,a){Qe.subVectors(i,e),pn.subVectors(n,e),pa.subVectors(t,e);const r=Qe.dot(Qe),o=Qe.dot(pn),l=Qe.dot(pa),c=pn.dot(pn),h=pn.dot(pa),u=r*c-o*o;if(u===0)return a.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,v=(r*h-o*l)*d;return a.set(1-f-v,v,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,mn)===null?!1:mn.x>=0&&mn.y>=0&&mn.x+mn.y<=1}static getUV(t,e,n,i,a,r,o,l){return fs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),fs=!0),this.getInterpolation(t,e,n,i,a,r,o,l)}static getInterpolation(t,e,n,i,a,r,o,l){return this.getBarycoord(t,e,n,i,mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,mn.x),l.addScaledVector(r,mn.y),l.addScaledVector(o,mn.z),l)}static isFrontFacing(t,e,n,i){return Qe.subVectors(n,e),pn.subVectors(t,e),Qe.cross(pn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Qe.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),Qe.cross(pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return tn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return tn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,a){return fs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),fs=!0),tn.getInterpolation(t,this.a,this.b,this.c,e,n,i,a)}getInterpolation(t,e,n,i,a){return tn.getInterpolation(t,this.a,this.b,this.c,e,n,i,a)}containsPoint(t){return tn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return tn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,a=this.c;let r,o;ii.subVectors(i,n),si.subVectors(a,n),ma.subVectors(t,n);const l=ii.dot(ma),c=si.dot(ma);if(l<=0&&c<=0)return e.copy(n);ga.subVectors(t,i);const h=ii.dot(ga),u=si.dot(ga);if(h>=0&&u<=h)return e.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return r=l/(l-h),e.copy(n).addScaledVector(ii,r);va.subVectors(t,a);const f=ii.dot(va),v=si.dot(va);if(v>=0&&f<=v)return e.copy(a);const _=f*c-l*v;if(_<=0&&c>=0&&v<=0)return o=c/(c-v),e.copy(n).addScaledVector(si,o);const m=h*v-f*u;if(m<=0&&u-h>=0&&f-v>=0)return nr.subVectors(a,i),o=(u-h)/(u-h+(f-v)),e.copy(i).addScaledVector(nr,o);const p=1/(m+_+d);return r=_*p,o=d*p,e.copy(n).addScaledVector(ii,r).addScaledVector(si,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const dl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Tn={h:0,s:0,l:0},ps={h:0,s:0,l:0};function _a(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class vt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Me){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Yt.workingColorSpace){if(t=$a(t,1),e=De(e,0,1),n=De(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,r=2*n-a;this.r=_a(r,a,t+1/3),this.g=_a(r,a,t),this.b=_a(r,a,t-1/3)}return Yt.toWorkingColorSpace(this,i),this}setStyle(t,e=Me){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=i[1],o=i[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=i[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Me){const n=dl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=xi(t.r),this.g=xi(t.g),this.b=xi(t.b),this}copyLinearToSRGB(t){return this.r=oa(t.r),this.g=oa(t.g),this.b=oa(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Me){return Yt.fromWorkingColorSpace(Ee.copy(this),t),Math.round(De(Ee.r*255,0,255))*65536+Math.round(De(Ee.g*255,0,255))*256+Math.round(De(Ee.b*255,0,255))}getHexString(t=Me){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.fromWorkingColorSpace(Ee.copy(this),e);const n=Ee.r,i=Ee.g,a=Ee.b,r=Math.max(n,i,a),o=Math.min(n,i,a);let l,c;const h=(o+r)/2;if(o===r)l=0,c=0;else{const u=r-o;switch(c=h<=.5?u/(r+o):u/(2-r-o),r){case n:l=(i-a)/u+(i<a?6:0);break;case i:l=(a-n)/u+2;break;case a:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Yt.workingColorSpace){return Yt.fromWorkingColorSpace(Ee.copy(this),e),t.r=Ee.r,t.g=Ee.g,t.b=Ee.b,t}getStyle(t=Me){Yt.fromWorkingColorSpace(Ee.copy(this),t);const e=Ee.r,n=Ee.g,i=Ee.b;return t!==Me?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Tn),this.setHSL(Tn.h+t,Tn.s+e,Tn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Tn),t.getHSL(ps);const n=Vi(Tn.h,ps.h,e),i=Vi(Tn.s,ps.s,e),a=Vi(Tn.l,ps.l,e);return this.setHSL(n,i,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*i,this.g=a[1]*e+a[4]*n+a[7]*i,this.b=a[2]*e+a[5]*n+a[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ee=new vt;vt.NAMES=dl;let gh=0;class ji extends Ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:gh++}),this.uuid=Ai(),this.name="",this.type="Material",this.blending=_i,this.side=Mn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ua,this.blendDst=Ia,this.blendEquation=Vn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new vt(0,0,0),this.blendAlpha=0,this.depthFunc=Fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ho,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jn,this.stencilZFail=jn,this.stencilZPass=jn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==_i&&(n.blending=this.blending),this.side!==Mn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ua&&(n.blendSrc=this.blendSrc),this.blendDst!==Ia&&(n.blendDst=this.blendDst),this.blendEquation!==Vn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Fs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ho&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==jn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==jn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==jn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(e){const a=i(t.textures),r=i(t.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let a=0;a!==i;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class fl extends ji{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Zr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const fe=new D,ms=new Tt;class Ie{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Vo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,a=this.itemSize;i<a;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ms.fromBufferAttribute(this,e),ms.applyMatrix3(t),this.setXY(e,ms.x,ms.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix3(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix4(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyNormalMatrix(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.transformDirection(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=mi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Le(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=mi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=mi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=mi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=mi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),n=Le(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),n=Le(n,this.array),i=Le(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,a){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),n=Le(n,this.array),i=Le(i,this.array),a=Le(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Vo&&(t.usage=this.usage),t}}class pl extends Ie{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ml extends Ie{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ne extends Ie{constructor(t,e,n){super(new Float32Array(t),e,n)}}let vh=0;const Xe=new Xt,xa=new Oe,ai=new D,He=new Un,Ii=new Un,xe=new D;class ye extends Ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vh++}),this.uuid=Ai(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ll(t)?ml:pl)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Gt().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Xe.makeRotationFromQuaternion(t),this.applyMatrix4(Xe),this}rotateX(t){return Xe.makeRotationX(t),this.applyMatrix4(Xe),this}rotateY(t){return Xe.makeRotationY(t),this.applyMatrix4(Xe),this}rotateZ(t){return Xe.makeRotationZ(t),this.applyMatrix4(Xe),this}translate(t,e,n){return Xe.makeTranslation(t,e,n),this.applyMatrix4(Xe),this}scale(t,e,n){return Xe.makeScale(t,e,n),this.applyMatrix4(Xe),this}lookAt(t){return xa.lookAt(t),xa.updateMatrix(),this.applyMatrix4(xa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ai).negate(),this.translate(ai.x,ai.y,ai.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const a=t[n];e.push(a.x,a.y,a.z||0)}return this.setAttribute("position",new ne(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Un);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const a=e[n];He.setFromBufferAttribute(a),this.morphTargetsRelative?(xe.addVectors(this.boundingBox.min,He.min),this.boundingBox.expandByPoint(xe),xe.addVectors(this.boundingBox.max,He.max),this.boundingBox.expandByPoint(xe)):(this.boundingBox.expandByPoint(He.min),this.boundingBox.expandByPoint(He.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ci);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new D,1/0);return}if(t){const n=this.boundingSphere.center;if(He.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];Ii.setFromBufferAttribute(o),this.morphTargetsRelative?(xe.addVectors(He.min,Ii.min),He.expandByPoint(xe),xe.addVectors(He.max,Ii.max),He.expandByPoint(xe)):(He.expandByPoint(Ii.min),He.expandByPoint(Ii.max))}He.getCenter(n);let i=0;for(let a=0,r=t.count;a<r;a++)xe.fromBufferAttribute(t,a),i=Math.max(i,n.distanceToSquared(xe));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)xe.fromBufferAttribute(o,c),l&&(ai.fromBufferAttribute(t,c),xe.add(ai)),i=Math.max(i,n.distanceToSquared(xe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,a=e.normal.array,r=e.uv.array,o=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ie(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let b=0;b<o;b++)c[b]=new D,h[b]=new D;const u=new D,d=new D,f=new D,v=new Tt,_=new Tt,m=new Tt,p=new D,x=new D;function g(b,z,X){u.fromArray(i,b*3),d.fromArray(i,z*3),f.fromArray(i,X*3),v.fromArray(r,b*2),_.fromArray(r,z*2),m.fromArray(r,X*2),d.sub(u),f.sub(u),_.sub(v),m.sub(v);const K=1/(_.x*m.y-m.x*_.y);isFinite(K)&&(p.copy(d).multiplyScalar(m.y).addScaledVector(f,-_.y).multiplyScalar(K),x.copy(f).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(K),c[b].add(p),c[z].add(p),c[X].add(p),h[b].add(x),h[z].add(x),h[X].add(x))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let b=0,z=M.length;b<z;++b){const X=M[b],K=X.start,R=X.count;for(let F=K,L=K+R;F<L;F+=3)g(n[F+0],n[F+1],n[F+2])}const w=new D,y=new D,A=new D,U=new D;function S(b){A.fromArray(a,b*3),U.copy(A);const z=c[b];w.copy(z),w.sub(A.multiplyScalar(A.dot(z))).normalize(),y.crossVectors(U,z);const K=y.dot(h[b])<0?-1:1;l[b*4]=w.x,l[b*4+1]=w.y,l[b*4+2]=w.z,l[b*4+3]=K}for(let b=0,z=M.length;b<z;++b){const X=M[b],K=X.start,R=X.count;for(let F=K,L=K+R;F<L;F+=3)S(n[F+0]),S(n[F+1]),S(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ie(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new D,a=new D,r=new D,o=new D,l=new D,c=new D,h=new D,u=new D;if(t)for(let d=0,f=t.count;d<f;d+=3){const v=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,v),a.fromBufferAttribute(e,_),r.fromBufferAttribute(e,m),h.subVectors(r,a),u.subVectors(i,a),h.cross(u),o.fromBufferAttribute(n,v),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(v,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),r.fromBufferAttribute(e,d+2),h.subVectors(r,a),u.subVectors(i,a),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)xe.fromBufferAttribute(t,e),xe.normalize(),t.setXYZ(e,xe.x,xe.y,xe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,v=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let p=0;p<h;p++)d[v++]=c[f++]}return new Ie(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ye,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=t(l,n);e.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,a=!0)}a&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const a=t.morphAttributes;for(const c in a){const h=[],u=a[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let c=0,h=r.length;c<h;c++){const u=r[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ir=new Xt,On=new Ka,gs=new Ci,sr=new D,oi=new D,ri=new D,li=new D,Ma=new D,vs=new D,_s=new Tt,xs=new Tt,Ms=new Tt,ar=new D,or=new D,rr=new D,ys=new D,Ss=new D;class te extends Oe{constructor(t=new ye,e=new fl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=i.length;a<r;a++){const o=i[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(a&&o){vs.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=o[l],u=a[l];h!==0&&(Ma.fromBufferAttribute(u,t),r?vs.addScaledVector(Ma,h):vs.addScaledVector(Ma.sub(e),h))}e.add(vs)}return e}raycast(t,e){const n=this.geometry,i=this.material,a=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),gs.copy(n.boundingSphere),gs.applyMatrix4(a),On.copy(t.ray).recast(t.near),!(gs.containsPoint(On.origin)===!1&&(On.intersectSphere(gs,sr)===null||On.origin.distanceToSquared(sr)>(t.far-t.near)**2))&&(ir.copy(a).invert(),On.copy(t.ray).applyMatrix4(ir),!(n.boundingBox!==null&&On.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,On)))}_computeIntersections(t,e,n){let i;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,u=a.attributes.normal,d=a.groups,f=a.drawRange;if(o!==null)if(Array.isArray(r))for(let v=0,_=d.length;v<_;v++){const m=d[v],p=r[m.materialIndex],x=Math.max(m.start,f.start),g=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let M=x,w=g;M<w;M+=3){const y=o.getX(M),A=o.getX(M+1),U=o.getX(M+2);i=ws(this,p,t,n,c,h,u,y,A,U),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const v=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=v,p=_;m<p;m+=3){const x=o.getX(m),g=o.getX(m+1),M=o.getX(m+2);i=ws(this,r,t,n,c,h,u,x,g,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(r))for(let v=0,_=d.length;v<_;v++){const m=d[v],p=r[m.materialIndex],x=Math.max(m.start,f.start),g=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let M=x,w=g;M<w;M+=3){const y=M,A=M+1,U=M+2;i=ws(this,p,t,n,c,h,u,y,A,U),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const v=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=v,p=_;m<p;m+=3){const x=m,g=m+1,M=m+2;i=ws(this,r,t,n,c,h,u,x,g,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function _h(s,t,e,n,i,a,r,o){let l;if(t.side===Ue?l=n.intersectTriangle(r,a,i,!0,o):l=n.intersectTriangle(i,a,r,t.side===Mn,o),l===null)return null;Ss.copy(o),Ss.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Ss);return c<e.near||c>e.far?null:{distance:c,point:Ss.clone(),object:s}}function ws(s,t,e,n,i,a,r,o,l,c){s.getVertexPosition(o,oi),s.getVertexPosition(l,ri),s.getVertexPosition(c,li);const h=_h(s,t,e,n,oi,ri,li,ys);if(h){i&&(_s.fromBufferAttribute(i,o),xs.fromBufferAttribute(i,l),Ms.fromBufferAttribute(i,c),h.uv=tn.getInterpolation(ys,oi,ri,li,_s,xs,Ms,new Tt)),a&&(_s.fromBufferAttribute(a,o),xs.fromBufferAttribute(a,l),Ms.fromBufferAttribute(a,c),h.uv1=tn.getInterpolation(ys,oi,ri,li,_s,xs,Ms,new Tt),h.uv2=h.uv1),r&&(ar.fromBufferAttribute(r,o),or.fromBufferAttribute(r,l),rr.fromBufferAttribute(r,c),h.normal=tn.getInterpolation(ys,oi,ri,li,ar,or,rr,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new D,materialIndex:0};tn.getNormal(oi,ri,li,u.normal),h.face=u}return h}class Zi extends ye{constructor(t=1,e=1,n=1,i=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:a,depthSegments:r};const o=this;i=Math.floor(i),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],h=[],u=[];let d=0,f=0;v("z","y","x",-1,-1,n,e,t,r,a,0),v("z","y","x",1,-1,n,e,-t,r,a,1),v("x","z","y",1,1,t,n,e,i,r,2),v("x","z","y",1,-1,t,n,-e,i,r,3),v("x","y","z",1,-1,t,e,n,i,a,4),v("x","y","z",-1,-1,t,e,-n,i,a,5),this.setIndex(l),this.setAttribute("position",new ne(c,3)),this.setAttribute("normal",new ne(h,3)),this.setAttribute("uv",new ne(u,2));function v(_,m,p,x,g,M,w,y,A,U,S){const b=M/A,z=w/U,X=M/2,K=w/2,R=y/2,F=A+1,L=U+1;let N=0,q=0;const W=new D;for(let $=0;$<L;$++){const Z=$*z-K;for(let at=0;at<F;at++){const V=at*b-X;W[_]=V*x,W[m]=Z*g,W[p]=R,c.push(W.x,W.y,W.z),W[_]=0,W[m]=0,W[p]=y>0?1:-1,h.push(W.x,W.y,W.z),u.push(at/A),u.push(1-$/U),N+=1}}for(let $=0;$<U;$++)for(let Z=0;Z<A;Z++){const at=d+Z+F*$,V=d+Z+F*($+1),j=d+(Z+1)+F*($+1),st=d+(Z+1)+F*$;l.push(at,V,st),l.push(V,j,st),q+=6}o.addGroup(f,q,S),f+=q,d+=N}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zi(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function bi(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Pe(s){const t={};for(let e=0;e<s.length;e++){const n=bi(s[e]);for(const i in n)t[i]=n[i]}return t}function xh(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function gl(s){return s.getRenderTarget()===null?s.outputColorSpace:Yt.workingColorSpace}const Mh={clone:bi,merge:Pe};var yh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Sh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class pe extends ji{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=yh,this.fragmentShader=Sh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=bi(t.uniforms),this.uniformsGroups=xh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const r=this.uniforms[i].value;r&&r.isTexture?e.uniforms[i]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[i]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[i]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[i]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[i]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[i]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[i]={type:"m4",value:r.toArray()}:e.uniforms[i]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class vl extends Oe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xt,this.projectionMatrix=new Xt,this.projectionMatrixInverse=new Xt,this.coordinateSystem=xn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class qe extends vl{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=qi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Hi*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qi*2*Math.atan(Math.tan(Hi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Hi*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,a=-.5*i;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*i/l,e-=r.offsetY*n/c,i*=r.width/l,n*=r.height/c}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ci=-90,hi=1;class wh extends Oe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new qe(ci,hi,t,e);i.layers=this.layers,this.add(i);const a=new qe(ci,hi,t,e);a.layers=this.layers,this.add(a);const r=new qe(ci,hi,t,e);r.layers=this.layers,this.add(r);const o=new qe(ci,hi,t,e);o.layers=this.layers,this.add(o);const l=new qe(ci,hi,t,e);l.layers=this.layers,this.add(l);const c=new qe(ci,hi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,a,r,o,l]=e;for(const c of e)this.remove(c);if(t===xn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Bs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,a),t.setRenderTarget(n,1,i),t.render(e,r),t.setRenderTarget(n,2,i),t.render(e,o),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class _l extends ze{constructor(t,e,n,i,a,r,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Mi,super(t,e,n,i,a,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Eh extends sn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(Wi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Yn?Me:$e),this.texture=new _l(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ee}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Zi(5,5,5),a=new pe({name:"CubemapFromEquirect",uniforms:bi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ue,blending:Rn});a.uniforms.tEquirect.value=e;const r=new te(i,a),o=e.minFilter;return e.minFilter===$n&&(e.minFilter=ee),new wh(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,i){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,i);t.setRenderTarget(a)}}const ya=new D,bh=new D,Th=new Gt;class Bn{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=ya.subVectors(n,e).cross(bh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ya),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/i;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Th.getNormalMatrix(t),i=this.coplanarPoint(ya).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const kn=new Ci,Es=new D;class Za{constructor(t=new Bn,e=new Bn,n=new Bn,i=new Bn,a=new Bn,r=new Bn){this.planes=[t,e,n,i,a,r]}set(t,e,n,i,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=xn){const n=this.planes,i=t.elements,a=i[0],r=i[1],o=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],f=i[8],v=i[9],_=i[10],m=i[11],p=i[12],x=i[13],g=i[14],M=i[15];if(n[0].setComponents(l-a,d-c,m-f,M-p).normalize(),n[1].setComponents(l+a,d+c,m+f,M+p).normalize(),n[2].setComponents(l+r,d+h,m+v,M+x).normalize(),n[3].setComponents(l-r,d-h,m-v,M-x).normalize(),n[4].setComponents(l-o,d-u,m-_,M-g).normalize(),e===xn)n[5].setComponents(l+o,d+u,m+_,M+g).normalize();else if(e===Bs)n[5].setComponents(o,u,_,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),kn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),kn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(kn)}intersectsSprite(t){return kn.center.set(0,0,0),kn.radius=.7071067811865476,kn.applyMatrix4(t.matrixWorld),this.intersectsSphere(kn)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Es.x=i.normal.x>0?t.max.x:t.min.x,Es.y=i.normal.y>0?t.max.y:t.min.y,Es.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Es)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function xl(){let s=null,t=!1,e=null,n=null;function i(a,r){e(a,r),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){s=a}}}function Ah(s,t){const e=t.isWebGL2,n=new WeakMap;function i(c,h){const u=c.array,d=c.usage,f=u.byteLength,v=s.createBuffer();s.bindBuffer(h,v),s.bufferData(h,u,d),c.onUploadCallback();let _;if(u instanceof Float32Array)_=s.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)_=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=s.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=s.SHORT;else if(u instanceof Uint32Array)_=s.UNSIGNED_INT;else if(u instanceof Int32Array)_=s.INT;else if(u instanceof Int8Array)_=s.BYTE;else if(u instanceof Uint8Array)_=s.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:v,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:f}}function a(c,h,u){const d=h.array,f=h._updateRange,v=h.updateRanges;if(s.bindBuffer(u,c),f.count===-1&&v.length===0&&s.bufferSubData(u,0,d),v.length!==0){for(let _=0,m=v.length;_<m;_++){const p=v[_];e?s.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):s.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}f.count!==-1&&(e?s.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):s.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function r(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);if(u===void 0)n.set(c,i(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");a(u.buffer,c,h),u.version=c.version}}return{get:r,remove:o,update:l}}class Ja extends ye{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const a=t/2,r=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=t/o,d=e/l,f=[],v=[],_=[],m=[];for(let p=0;p<h;p++){const x=p*d-r;for(let g=0;g<c;g++){const M=g*u-a;v.push(M,-x,0),_.push(0,0,1),m.push(g/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<o;x++){const g=x+c*p,M=x+c*(p+1),w=x+1+c*(p+1),y=x+1+c*p;f.push(g,M,y),f.push(M,w,y)}this.setIndex(f),this.setAttribute("position",new ne(v,3)),this.setAttribute("normal",new ne(_,3)),this.setAttribute("uv",new ne(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ja(t.width,t.height,t.widthSegments,t.heightSegments)}}var Ch=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Rh=`#ifdef USE_ALPHAHASH
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
#endif`,Lh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ph=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Dh=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Uh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ih=`#ifdef USE_AOMAP
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
#endif`,Fh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Nh=`#ifdef USE_BATCHING
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
#endif`,zh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Oh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,kh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Bh=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Gh=`#ifdef USE_IRIDESCENCE
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
#endif`,Hh=`#ifdef USE_BUMPMAP
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
#endif`,Vh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Wh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Xh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Yh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,$h=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Kh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,jh=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Zh=`#define PI 3.141592653589793
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
} // validated`,Jh=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Qh=`vec3 transformedNormal = objectNormal;
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
#endif`,tu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,eu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,nu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,iu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,su="gl_FragColor = linearToOutputTexel( gl_FragColor );",au=`
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
}`,ou=`#ifdef USE_ENVMAP
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
#endif`,ru=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,lu=`#ifdef USE_ENVMAP
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
#endif`,cu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,hu=`#ifdef USE_ENVMAP
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
#endif`,uu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,du=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,pu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,mu=`#ifdef USE_GRADIENTMAP
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
}`,gu=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,vu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_u=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,xu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mu=`uniform bool receiveShadow;
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
#endif`,yu=`#ifdef USE_ENVMAP
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
#endif`,Su=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Eu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,bu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Tu=`PhysicalMaterial material;
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
#endif`,Au=`struct PhysicalMaterial {
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
}`,Cu=`
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
#endif`,Ru=`#if defined( RE_IndirectDiffuse )
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
#endif`,Lu=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Pu=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Du=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Uu=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Iu=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Fu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Nu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ou=`#if defined( USE_POINTS_UV )
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
#endif`,ku=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Gu=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Hu=`#ifdef USE_MORPHNORMALS
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
#endif`,Vu=`#ifdef USE_MORPHTARGETS
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
#endif`,Wu=`#ifdef USE_MORPHTARGETS
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
#endif`,Xu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,qu=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Yu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$u=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ku=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ju=`#ifdef USE_NORMALMAP
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
#endif`,Zu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ju=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Qu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,td=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ed=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,nd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,id=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ad=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,od=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,rd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ld=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ud=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
}`,fd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pd=`#ifdef USE_SKINNING
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
#endif`,md=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,gd=`#ifdef USE_SKINNING
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
#endif`,vd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_d=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Md=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,yd=`#ifdef USE_TRANSMISSION
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
#endif`,wd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Td=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ad=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Cd=`uniform sampler2D t2D;
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
}`,Rd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ld=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Pd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ud=`#include <common>
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
}`,Id=`#if DEPTH_PACKING == 3200
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
}`,Fd=`#define DISTANCE
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
}`,Nd=`#define DISTANCE
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
}`,zd=`varying vec3 vWorldDirection;
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
}`,kd=`uniform float scale;
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
}`,Bd=`uniform vec3 diffuse;
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
}`,Hd=`uniform vec3 diffuse;
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
}`,Vd=`#define LAMBERT
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
}`,Wd=`#define LAMBERT
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
}`,qd=`#define MATCAP
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
}`,Yd=`#define NORMAL
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
}`,$d=`#define NORMAL
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
}`,jd=`#define PHONG
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
}`,Zd=`#define STANDARD
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
}`,Jd=`#define STANDARD
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
}`,Qd=`#define TOON
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
}`,tf=`#define TOON
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
}`,ef=`uniform float size;
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
}`,nf=`uniform vec3 diffuse;
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
}`,sf=`#include <common>
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
}`,af=`uniform vec3 color;
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
}`,of=`uniform float rotation;
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
}`,rf=`uniform vec3 diffuse;
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
}`,Ft={alphahash_fragment:Ch,alphahash_pars_fragment:Rh,alphamap_fragment:Lh,alphamap_pars_fragment:Ph,alphatest_fragment:Dh,alphatest_pars_fragment:Uh,aomap_fragment:Ih,aomap_pars_fragment:Fh,batching_pars_vertex:Nh,batching_vertex:zh,begin_vertex:Oh,beginnormal_vertex:kh,bsdfs:Bh,iridescence_fragment:Gh,bumpmap_pars_fragment:Hh,clipping_planes_fragment:Vh,clipping_planes_pars_fragment:Wh,clipping_planes_pars_vertex:Xh,clipping_planes_vertex:qh,color_fragment:Yh,color_pars_fragment:$h,color_pars_vertex:Kh,color_vertex:jh,common:Zh,cube_uv_reflection_fragment:Jh,defaultnormal_vertex:Qh,displacementmap_pars_vertex:tu,displacementmap_vertex:eu,emissivemap_fragment:nu,emissivemap_pars_fragment:iu,colorspace_fragment:su,colorspace_pars_fragment:au,envmap_fragment:ou,envmap_common_pars_fragment:ru,envmap_pars_fragment:lu,envmap_pars_vertex:cu,envmap_physical_pars_fragment:yu,envmap_vertex:hu,fog_vertex:uu,fog_pars_vertex:du,fog_fragment:fu,fog_pars_fragment:pu,gradientmap_pars_fragment:mu,lightmap_fragment:gu,lightmap_pars_fragment:vu,lights_lambert_fragment:_u,lights_lambert_pars_fragment:xu,lights_pars_begin:Mu,lights_toon_fragment:Su,lights_toon_pars_fragment:wu,lights_phong_fragment:Eu,lights_phong_pars_fragment:bu,lights_physical_fragment:Tu,lights_physical_pars_fragment:Au,lights_fragment_begin:Cu,lights_fragment_maps:Ru,lights_fragment_end:Lu,logdepthbuf_fragment:Pu,logdepthbuf_pars_fragment:Du,logdepthbuf_pars_vertex:Uu,logdepthbuf_vertex:Iu,map_fragment:Fu,map_pars_fragment:Nu,map_particle_fragment:zu,map_particle_pars_fragment:Ou,metalnessmap_fragment:ku,metalnessmap_pars_fragment:Bu,morphcolor_vertex:Gu,morphnormal_vertex:Hu,morphtarget_pars_vertex:Vu,morphtarget_vertex:Wu,normal_fragment_begin:Xu,normal_fragment_maps:qu,normal_pars_fragment:Yu,normal_pars_vertex:$u,normal_vertex:Ku,normalmap_pars_fragment:ju,clearcoat_normal_fragment_begin:Zu,clearcoat_normal_fragment_maps:Ju,clearcoat_pars_fragment:Qu,iridescence_pars_fragment:td,opaque_fragment:ed,packing:nd,premultiplied_alpha_fragment:id,project_vertex:sd,dithering_fragment:ad,dithering_pars_fragment:od,roughnessmap_fragment:rd,roughnessmap_pars_fragment:ld,shadowmap_pars_fragment:cd,shadowmap_pars_vertex:hd,shadowmap_vertex:ud,shadowmask_pars_fragment:dd,skinbase_vertex:fd,skinning_pars_vertex:pd,skinning_vertex:md,skinnormal_vertex:gd,specularmap_fragment:vd,specularmap_pars_fragment:_d,tonemapping_fragment:xd,tonemapping_pars_fragment:Md,transmission_fragment:yd,transmission_pars_fragment:Sd,uv_pars_fragment:wd,uv_pars_vertex:Ed,uv_vertex:bd,worldpos_vertex:Td,background_vert:Ad,background_frag:Cd,backgroundCube_vert:Rd,backgroundCube_frag:Ld,cube_vert:Pd,cube_frag:Dd,depth_vert:Ud,depth_frag:Id,distanceRGBA_vert:Fd,distanceRGBA_frag:Nd,equirect_vert:zd,equirect_frag:Od,linedashed_vert:kd,linedashed_frag:Bd,meshbasic_vert:Gd,meshbasic_frag:Hd,meshlambert_vert:Vd,meshlambert_frag:Wd,meshmatcap_vert:Xd,meshmatcap_frag:qd,meshnormal_vert:Yd,meshnormal_frag:$d,meshphong_vert:Kd,meshphong_frag:jd,meshphysical_vert:Zd,meshphysical_frag:Jd,meshtoon_vert:Qd,meshtoon_frag:tf,points_vert:ef,points_frag:nf,shadow_vert:sf,shadow_frag:af,sprite_vert:of,sprite_frag:rf},it={common:{diffuse:{value:new vt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Gt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Gt},normalScale:{value:new Tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new vt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new vt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0},uvTransform:{value:new Gt}},sprite:{diffuse:{value:new vt(16777215)},opacity:{value:1},center:{value:new Tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}}},rn={basic:{uniforms:Pe([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.fog]),vertexShader:Ft.meshbasic_vert,fragmentShader:Ft.meshbasic_frag},lambert:{uniforms:Pe([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new vt(0)}}]),vertexShader:Ft.meshlambert_vert,fragmentShader:Ft.meshlambert_frag},phong:{uniforms:Pe([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new vt(0)},specular:{value:new vt(1118481)},shininess:{value:30}}]),vertexShader:Ft.meshphong_vert,fragmentShader:Ft.meshphong_frag},standard:{uniforms:Pe([it.common,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.roughnessmap,it.metalnessmap,it.fog,it.lights,{emissive:{value:new vt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ft.meshphysical_vert,fragmentShader:Ft.meshphysical_frag},toon:{uniforms:Pe([it.common,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.gradientmap,it.fog,it.lights,{emissive:{value:new vt(0)}}]),vertexShader:Ft.meshtoon_vert,fragmentShader:Ft.meshtoon_frag},matcap:{uniforms:Pe([it.common,it.bumpmap,it.normalmap,it.displacementmap,it.fog,{matcap:{value:null}}]),vertexShader:Ft.meshmatcap_vert,fragmentShader:Ft.meshmatcap_frag},points:{uniforms:Pe([it.points,it.fog]),vertexShader:Ft.points_vert,fragmentShader:Ft.points_frag},dashed:{uniforms:Pe([it.common,it.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ft.linedashed_vert,fragmentShader:Ft.linedashed_frag},depth:{uniforms:Pe([it.common,it.displacementmap]),vertexShader:Ft.depth_vert,fragmentShader:Ft.depth_frag},normal:{uniforms:Pe([it.common,it.bumpmap,it.normalmap,it.displacementmap,{opacity:{value:1}}]),vertexShader:Ft.meshnormal_vert,fragmentShader:Ft.meshnormal_frag},sprite:{uniforms:Pe([it.sprite,it.fog]),vertexShader:Ft.sprite_vert,fragmentShader:Ft.sprite_frag},background:{uniforms:{uvTransform:{value:new Gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ft.background_vert,fragmentShader:Ft.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ft.backgroundCube_vert,fragmentShader:Ft.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ft.cube_vert,fragmentShader:Ft.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ft.equirect_vert,fragmentShader:Ft.equirect_frag},distanceRGBA:{uniforms:Pe([it.common,it.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ft.distanceRGBA_vert,fragmentShader:Ft.distanceRGBA_frag},shadow:{uniforms:Pe([it.lights,it.fog,{color:{value:new vt(0)},opacity:{value:1}}]),vertexShader:Ft.shadow_vert,fragmentShader:Ft.shadow_frag}};rn.physical={uniforms:Pe([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Gt},clearcoatNormalScale:{value:new Tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Gt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Gt},sheen:{value:0},sheenColor:{value:new vt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Gt},transmissionSamplerSize:{value:new Tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Gt},attenuationDistance:{value:0},attenuationColor:{value:new vt(0)},specularColor:{value:new vt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Gt},anisotropyVector:{value:new Tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Gt}}]),vertexShader:Ft.meshphysical_vert,fragmentShader:Ft.meshphysical_frag};const bs={r:0,b:0,g:0};function lf(s,t,e,n,i,a,r){const o=new vt(0);let l=a===!0?0:1,c,h,u=null,d=0,f=null;function v(m,p){let x=!1,g=p.isScene===!0?p.background:null;g&&g.isTexture&&(g=(p.backgroundBlurriness>0?e:t).get(g)),g===null?_(o,l):g&&g.isColor&&(_(g,1),x=!0);const M=s.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(s.autoClear||x)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),g&&(g.isCubeTexture||g.mapping===Xs)?(h===void 0&&(h=new te(new Zi(1,1,1),new pe({name:"BackgroundCubeMaterial",uniforms:bi(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:Ue,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,y,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=g,h.material.uniforms.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=Yt.getTransfer(g.colorSpace)!==Jt,(u!==g||d!==g.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=g,d=g.version,f=s.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):g&&g.isTexture&&(c===void 0&&(c=new te(new Ja(2,2),new pe({name:"BackgroundMaterial",uniforms:bi(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=g,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(g.colorSpace)!==Jt,g.matrixAutoUpdate===!0&&g.updateMatrix(),c.material.uniforms.uvTransform.value.copy(g.matrix),(u!==g||d!==g.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,u=g,d=g.version,f=s.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function _(m,p){m.getRGB(bs,gl(s)),n.buffers.color.setClear(bs.r,bs.g,bs.b,p,r)}return{getClearColor:function(){return o},setClearColor:function(m,p=1){o.set(m),l=p,_(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,_(o,l)},render:v}}function cf(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),a=n.isWebGL2?null:t.get("OES_vertex_array_object"),r=n.isWebGL2||a!==null,o={},l=m(null);let c=l,h=!1;function u(R,F,L,N,q){let W=!1;if(r){const $=_(N,L,F);c!==$&&(c=$,f(c.object)),W=p(R,N,L,q),W&&x(R,N,L,q)}else{const $=F.wireframe===!0;(c.geometry!==N.id||c.program!==L.id||c.wireframe!==$)&&(c.geometry=N.id,c.program=L.id,c.wireframe=$,W=!0)}q!==null&&e.update(q,s.ELEMENT_ARRAY_BUFFER),(W||h)&&(h=!1,U(R,F,L,N),q!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function d(){return n.isWebGL2?s.createVertexArray():a.createVertexArrayOES()}function f(R){return n.isWebGL2?s.bindVertexArray(R):a.bindVertexArrayOES(R)}function v(R){return n.isWebGL2?s.deleteVertexArray(R):a.deleteVertexArrayOES(R)}function _(R,F,L){const N=L.wireframe===!0;let q=o[R.id];q===void 0&&(q={},o[R.id]=q);let W=q[F.id];W===void 0&&(W={},q[F.id]=W);let $=W[N];return $===void 0&&($=m(d()),W[N]=$),$}function m(R){const F=[],L=[],N=[];for(let q=0;q<i;q++)F[q]=0,L[q]=0,N[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:L,attributeDivisors:N,object:R,attributes:{},index:null}}function p(R,F,L,N){const q=c.attributes,W=F.attributes;let $=0;const Z=L.getAttributes();for(const at in Z)if(Z[at].location>=0){const j=q[at];let st=W[at];if(st===void 0&&(at==="instanceMatrix"&&R.instanceMatrix&&(st=R.instanceMatrix),at==="instanceColor"&&R.instanceColor&&(st=R.instanceColor)),j===void 0||j.attribute!==st||st&&j.data!==st.data)return!0;$++}return c.attributesNum!==$||c.index!==N}function x(R,F,L,N){const q={},W=F.attributes;let $=0;const Z=L.getAttributes();for(const at in Z)if(Z[at].location>=0){let j=W[at];j===void 0&&(at==="instanceMatrix"&&R.instanceMatrix&&(j=R.instanceMatrix),at==="instanceColor"&&R.instanceColor&&(j=R.instanceColor));const st={};st.attribute=j,j&&j.data&&(st.data=j.data),q[at]=st,$++}c.attributes=q,c.attributesNum=$,c.index=N}function g(){const R=c.newAttributes;for(let F=0,L=R.length;F<L;F++)R[F]=0}function M(R){w(R,0)}function w(R,F){const L=c.newAttributes,N=c.enabledAttributes,q=c.attributeDivisors;L[R]=1,N[R]===0&&(s.enableVertexAttribArray(R),N[R]=1),q[R]!==F&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,F),q[R]=F)}function y(){const R=c.newAttributes,F=c.enabledAttributes;for(let L=0,N=F.length;L<N;L++)F[L]!==R[L]&&(s.disableVertexAttribArray(L),F[L]=0)}function A(R,F,L,N,q,W,$){$===!0?s.vertexAttribIPointer(R,F,L,q,W):s.vertexAttribPointer(R,F,L,N,q,W)}function U(R,F,L,N){if(n.isWebGL2===!1&&(R.isInstancedMesh||N.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;g();const q=N.attributes,W=L.getAttributes(),$=F.defaultAttributeValues;for(const Z in W){const at=W[Z];if(at.location>=0){let V=q[Z];if(V===void 0&&(Z==="instanceMatrix"&&R.instanceMatrix&&(V=R.instanceMatrix),Z==="instanceColor"&&R.instanceColor&&(V=R.instanceColor)),V!==void 0){const j=V.normalized,st=V.itemSize,_t=e.get(V);if(_t===void 0)continue;const gt=_t.buffer,Pt=_t.type,Ut=_t.bytesPerElement,Et=n.isWebGL2===!0&&(Pt===s.INT||Pt===s.UNSIGNED_INT||V.gpuType===Qr);if(V.isInterleavedBufferAttribute){const Vt=V.data,O=Vt.stride,Ae=V.offset;if(Vt.isInstancedInterleavedBuffer){for(let Mt=0;Mt<at.locationSize;Mt++)w(at.location+Mt,Vt.meshPerAttribute);R.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=Vt.meshPerAttribute*Vt.count)}else for(let Mt=0;Mt<at.locationSize;Mt++)M(at.location+Mt);s.bindBuffer(s.ARRAY_BUFFER,gt);for(let Mt=0;Mt<at.locationSize;Mt++)A(at.location+Mt,st/at.locationSize,Pt,j,O*Ut,(Ae+st/at.locationSize*Mt)*Ut,Et)}else{if(V.isInstancedBufferAttribute){for(let Vt=0;Vt<at.locationSize;Vt++)w(at.location+Vt,V.meshPerAttribute);R.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let Vt=0;Vt<at.locationSize;Vt++)M(at.location+Vt);s.bindBuffer(s.ARRAY_BUFFER,gt);for(let Vt=0;Vt<at.locationSize;Vt++)A(at.location+Vt,st/at.locationSize,Pt,j,st*Ut,st/at.locationSize*Vt*Ut,Et)}}else if($!==void 0){const j=$[Z];if(j!==void 0)switch(j.length){case 2:s.vertexAttrib2fv(at.location,j);break;case 3:s.vertexAttrib3fv(at.location,j);break;case 4:s.vertexAttrib4fv(at.location,j);break;default:s.vertexAttrib1fv(at.location,j)}}}}y()}function S(){X();for(const R in o){const F=o[R];for(const L in F){const N=F[L];for(const q in N)v(N[q].object),delete N[q];delete F[L]}delete o[R]}}function b(R){if(o[R.id]===void 0)return;const F=o[R.id];for(const L in F){const N=F[L];for(const q in N)v(N[q].object),delete N[q];delete F[L]}delete o[R.id]}function z(R){for(const F in o){const L=o[F];if(L[R.id]===void 0)continue;const N=L[R.id];for(const q in N)v(N[q].object),delete N[q];delete L[R.id]}}function X(){K(),h=!0,c!==l&&(c=l,f(c.object))}function K(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:X,resetDefaultState:K,dispose:S,releaseStatesOfGeometry:b,releaseStatesOfProgram:z,initAttributes:g,enableAttribute:M,disableUnusedAttributes:y}}function hf(s,t,e,n){const i=n.isWebGL2;let a;function r(h){a=h}function o(h,u){s.drawArrays(a,h,u),e.update(u,a,1)}function l(h,u,d){if(d===0)return;let f,v;if(i)f=s,v="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[v](a,h,u,d),e.update(u,a,d)}function c(h,u,d){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let v=0;v<d;v++)this.render(h[v],u[v]);else{f.multiDrawArraysWEBGL(a,h,0,u,0,d);let v=0;for(let _=0;_<d;_++)v+=u[_];e.update(v,a,1)}}this.setMode=r,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function uf(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const r=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const l=a(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=r||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_TEXTURE_SIZE),v=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),_=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),g=d>0,M=r||t.has("OES_texture_float"),w=g&&M,y=r?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:r,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:a,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:v,maxAttributes:_,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:x,vertexTextures:g,floatFragmentTextures:M,floatVertexTextures:w,maxSamples:y}}function df(s){const t=this;let e=null,n=0,i=!1,a=!1;const r=new Bn,o=new Gt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const v=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||v===null||v.length===0||a&&!m)a?h(null):c();else{const x=a?0:n,g=x*4;let M=p.clippingState||null;l.value=M,M=h(v,d,g,f);for(let w=0;w!==g;++w)M[w]=e[w];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,v){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,v!==!0||m===null){const p=f+_*4,x=d.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let g=0,M=f;g!==_;++g,M+=4)r.copy(u[g]).applyMatrix4(x,o),r.normal.toArray(m,M),m[M+3]=r.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function ff(s){let t=new WeakMap;function e(r,o){return o===Fa?r.mapping=Mi:o===Na&&(r.mapping=yi),r}function n(r){if(r&&r.isTexture){const o=r.mapping;if(o===Fa||o===Na)if(t.has(r)){const l=t.get(r).texture;return e(l,r.mapping)}else{const l=r.image;if(l&&l.height>0){const c=new Eh(l.height/2);return c.fromEquirectangularTexture(s,r),t.set(r,c),r.addEventListener("dispose",i),e(c.texture,r.mapping)}else return null}}return r}function i(r){const o=r.target;o.removeEventListener("dispose",i);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}class Ji extends vl{constructor(t=-1,e=1,n=1,i=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let a=n-t,r=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const gi=4,lr=[.125,.215,.35,.446,.526,.582],Wn=20,Sa=new Ji,cr=new vt;let wa=null,Ea=0,ba=0;const Gn=(1+Math.sqrt(5))/2,ui=1/Gn,hr=[new D(1,1,1),new D(-1,1,1),new D(1,1,-1),new D(-1,1,-1),new D(0,Gn,ui),new D(0,Gn,-ui),new D(ui,0,Gn),new D(-ui,0,Gn),new D(Gn,ui,0),new D(-Gn,ui,0)];class ur{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){wa=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,n,i,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=pr(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fr(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(wa,Ea,ba),t.scissorTest=!1,Ts(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Mi||t.mapping===yi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),wa=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ee,minFilter:ee,generateMipmaps:!1,type:Pn,format:Ne,colorSpace:yn,depthBuffer:!1},i=dr(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=dr(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=pf(a)),this._blurMaterial=mf(a,t,e)}return i}_compileMaterial(t){const e=new te(this._lodPlanes[0],t);this._renderer.compile(e,Sa)}_sceneToCubeUV(t,e,n,i){const o=new qe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(cr),h.toneMapping=Ln,h.autoClear=!1;const f=new fl({name:"PMREM.Background",side:Ue,depthWrite:!1,depthTest:!1}),v=new te(new Zi,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(cr),_=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):x===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const g=this._cubeSize;Ts(i,x*g,p>2?g:0,g,g),h.setRenderTarget(i),_&&h.render(v,o),h.render(t,o)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Mi||t.mapping===yi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=pr()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fr());const a=i?this._cubemapMaterial:this._equirectMaterial,r=new te(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const l=this._cubeSize;Ts(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(r,Sa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const a=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),r=hr[(i-1)%hr.length];this._blur(t,i-1,i,a,r)}e.autoClear=n}_blur(t,e,n,i,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,i,"latitudinal",a),this._halfBlur(r,t,n,n,i,"longitudinal",a)}_halfBlur(t,e,n,i,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new te(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,v=isFinite(a)?Math.PI/(2*f):2*Math.PI/(2*Wn-1),_=a/v,m=isFinite(a)?1+Math.floor(h*_):Wn;m>Wn&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Wn}`);const p=[];let x=0;for(let A=0;A<Wn;++A){const U=A/_,S=Math.exp(-U*U/2);p.push(S),A===0?x+=S:A<m&&(x+=2*S)}for(let A=0;A<p.length;A++)p[A]=p[A]/x;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=r==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:g}=this;d.dTheta.value=v,d.mipInt.value=g-n;const M=this._sizeLods[i],w=3*M*(i>g-gi?i-g+gi:0),y=4*(this._cubeSize-M);Ts(e,w,y,3*M,2*M),l.setRenderTarget(e),l.render(u,Sa)}}function pf(s){const t=[],e=[],n=[];let i=s;const a=s-gi+1+lr.length;for(let r=0;r<a;r++){const o=Math.pow(2,i);e.push(o);let l=1/o;r>s-gi?l=lr[r-s+gi-1]:r===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,v=6,_=3,m=2,p=1,x=new Float32Array(_*v*f),g=new Float32Array(m*v*f),M=new Float32Array(p*v*f);for(let y=0;y<f;y++){const A=y%3*2/3-1,U=y>2?0:-1,S=[A,U,0,A+2/3,U,0,A+2/3,U+1,0,A,U,0,A+2/3,U+1,0,A,U+1,0];x.set(S,_*v*y),g.set(d,m*v*y);const b=[y,y,y,y,y,y];M.set(b,p*v*y)}const w=new ye;w.setAttribute("position",new Ie(x,_)),w.setAttribute("uv",new Ie(g,m)),w.setAttribute("faceIndex",new Ie(M,p)),t.push(w),i>gi&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function dr(s,t,e){const n=new sn(s,t,e);return n.texture.mapping=Xs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ts(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function mf(s,t,e){const n=new Float32Array(Wn),i=new D(0,1,0);return new pe({name:"SphericalGaussianBlur",defines:{n:Wn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Qa(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function fr(){return new pe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qa(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function pr(){return new pe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Qa(){return`

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
	`}function gf(s){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Fa||l===Na,h=l===Mi||l===yi;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new ur(s)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{const u=o.image;if(c&&u&&u.height>0||h&&u&&i(u)){e===null&&(e=new ur(s));const d=c?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,d),o.addEventListener("dispose",a),d.texture}else return null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function a(o){const l=o.target;l.removeEventListener("dispose",a);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function vf(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function _f(s,t,e,n){const i={},a=new WeakMap;function r(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const v in d.attributes)t.remove(d.attributes[v]);for(const v in d.morphAttributes){const _=d.morphAttributes[v];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}d.removeEventListener("dispose",r),delete i[d.id];const f=a.get(d);f&&(t.remove(f),a.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",r),i[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const v in d)t.update(d[v],s.ARRAY_BUFFER);const f=u.morphAttributes;for(const v in f){const _=f[v];for(let m=0,p=_.length;m<p;m++)t.update(_[m],s.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,v=u.attributes.position;let _=0;if(f!==null){const x=f.array;_=f.version;for(let g=0,M=x.length;g<M;g+=3){const w=x[g+0],y=x[g+1],A=x[g+2];d.push(w,y,y,A,A,w)}}else if(v!==void 0){const x=v.array;_=v.version;for(let g=0,M=x.length/3-1;g<M;g+=3){const w=g+0,y=g+1,A=g+2;d.push(w,y,y,A,A,w)}}else return;const m=new(ll(d)?ml:pl)(d,1);m.version=_;const p=a.get(u);p&&t.remove(p),a.set(u,m)}function h(u){const d=a.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return a.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function xf(s,t,e,n){const i=n.isWebGL2;let a;function r(f){a=f}let o,l;function c(f){o=f.type,l=f.bytesPerElement}function h(f,v){s.drawElements(a,v,o,f*l),e.update(v,a,1)}function u(f,v,_){if(_===0)return;let m,p;if(i)m=s,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](a,v,o,f*l,_),e.update(v,a,_)}function d(f,v,_){if(_===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<_;p++)this.render(f[p]/l,v[p]);else{m.multiDrawElementsWEBGL(a,v,0,o,f,0,_);let p=0;for(let x=0;x<_;x++)p+=v[x];e.update(p,a,1)}}this.setMode=r,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function Mf(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(e.calls++,r){case s.TRIANGLES:e.triangles+=o*(a/3);break;case s.LINES:e.lines+=o*(a/2);break;case s.LINE_STRIP:e.lines+=o*(a-1);break;case s.LINE_LOOP:e.lines+=o*a;break;case s.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function yf(s,t){return s[0]-t[0]}function Sf(s,t){return Math.abs(t[1])-Math.abs(s[1])}function wf(s,t,e){const n={},i=new Float32Array(8),a=new WeakMap,r=new le,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,u){const d=c.morphTargetInfluences;if(t.isWebGL2===!0){const f=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=f!==void 0?f.length:0;let _=a.get(h);if(_===void 0||_.count!==v){let R=function(){X.dispose(),a.delete(h),h.removeEventListener("dispose",R)};_!==void 0&&_.texture.dispose();const x=h.morphAttributes.position!==void 0,g=h.morphAttributes.normal!==void 0,M=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],y=h.morphAttributes.normal||[],A=h.morphAttributes.color||[];let U=0;x===!0&&(U=1),g===!0&&(U=2),M===!0&&(U=3);let S=h.attributes.position.count*U,b=1;S>t.maxTextureSize&&(b=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const z=new Float32Array(S*b*4*v),X=new ul(z,S,b,v);X.type=ln,X.needsUpdate=!0;const K=U*4;for(let F=0;F<v;F++){const L=w[F],N=y[F],q=A[F],W=S*b*4*F;for(let $=0;$<L.count;$++){const Z=$*K;x===!0&&(r.fromBufferAttribute(L,$),z[W+Z+0]=r.x,z[W+Z+1]=r.y,z[W+Z+2]=r.z,z[W+Z+3]=0),g===!0&&(r.fromBufferAttribute(N,$),z[W+Z+4]=r.x,z[W+Z+5]=r.y,z[W+Z+6]=r.z,z[W+Z+7]=0),M===!0&&(r.fromBufferAttribute(q,$),z[W+Z+8]=r.x,z[W+Z+9]=r.y,z[W+Z+10]=r.z,z[W+Z+11]=q.itemSize===4?r.w:1)}}_={count:v,texture:X,size:new Tt(S,b)},a.set(h,_),h.addEventListener("dispose",R)}let m=0;for(let x=0;x<d.length;x++)m+=d[x];const p=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(s,"morphTargetBaseInfluence",p),u.getUniforms().setValue(s,"morphTargetInfluences",d),u.getUniforms().setValue(s,"morphTargetsTexture",_.texture,e),u.getUniforms().setValue(s,"morphTargetsTextureSize",_.size)}else{const f=d===void 0?0:d.length;let v=n[h.id];if(v===void 0||v.length!==f){v=[];for(let g=0;g<f;g++)v[g]=[g,0];n[h.id]=v}for(let g=0;g<f;g++){const M=v[g];M[0]=g,M[1]=d[g]}v.sort(Sf);for(let g=0;g<8;g++)g<f&&v[g][1]?(o[g][0]=v[g][0],o[g][1]=v[g][1]):(o[g][0]=Number.MAX_SAFE_INTEGER,o[g][1]=0);o.sort(yf);const _=h.morphAttributes.position,m=h.morphAttributes.normal;let p=0;for(let g=0;g<8;g++){const M=o[g],w=M[0],y=M[1];w!==Number.MAX_SAFE_INTEGER&&y?(_&&h.getAttribute("morphTarget"+g)!==_[w]&&h.setAttribute("morphTarget"+g,_[w]),m&&h.getAttribute("morphNormal"+g)!==m[w]&&h.setAttribute("morphNormal"+g,m[w]),i[g]=y,p+=y):(_&&h.hasAttribute("morphTarget"+g)===!0&&h.deleteAttribute("morphTarget"+g),m&&h.hasAttribute("morphNormal"+g)===!0&&h.deleteAttribute("morphNormal"+g),i[g]=0)}const x=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(s,"morphTargetBaseInfluence",x),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function Ef(s,t,e,n){let i=new WeakMap;function a(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function r(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:a,dispose:r}}class to extends ze{constructor(t,e,n,i,a,r,o,l,c,h){if(h=h!==void 0?h:qn,h!==qn&&h!==wi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===qn&&(n=_n),n===void 0&&h===wi&&(n=Xn),super(null,i,a,r,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:de,this.minFilter=l!==void 0?l:de,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Ml=new ze,yl=new to(1,1);yl.compareFunction=rl;const Sl=new ul,wl=new Ba,El=new _l,mr=[],gr=[],vr=new Float32Array(16),_r=new Float32Array(9),xr=new Float32Array(4);function Ri(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let a=mr[i];if(a===void 0&&(a=new Float32Array(i),mr[i]=a),t!==0){n.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,s[r].toArray(a,o)}return a}function me(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function ge(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Ys(s,t){let e=gr[t];e===void 0&&(e=new Int32Array(t),gr[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function bf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Tf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;s.uniform2fv(this.addr,t),ge(e,t)}}function Af(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(me(e,t))return;s.uniform3fv(this.addr,t),ge(e,t)}}function Cf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;s.uniform4fv(this.addr,t),ge(e,t)}}function Rf(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;xr.set(n),s.uniformMatrix2fv(this.addr,!1,xr),ge(e,n)}}function Lf(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;_r.set(n),s.uniformMatrix3fv(this.addr,!1,_r),ge(e,n)}}function Pf(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;vr.set(n),s.uniformMatrix4fv(this.addr,!1,vr),ge(e,n)}}function Df(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Uf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;s.uniform2iv(this.addr,t),ge(e,t)}}function If(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;s.uniform3iv(this.addr,t),ge(e,t)}}function Ff(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;s.uniform4iv(this.addr,t),ge(e,t)}}function Nf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function zf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;s.uniform2uiv(this.addr,t),ge(e,t)}}function Of(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;s.uniform3uiv(this.addr,t),ge(e,t)}}function kf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;s.uniform4uiv(this.addr,t),ge(e,t)}}function Bf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const a=this.type===s.SAMPLER_2D_SHADOW?yl:Ml;e.setTexture2D(t||a,i)}function Gf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||wl,i)}function Hf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||El,i)}function Vf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Sl,i)}function Wf(s){switch(s){case 5126:return bf;case 35664:return Tf;case 35665:return Af;case 35666:return Cf;case 35674:return Rf;case 35675:return Lf;case 35676:return Pf;case 5124:case 35670:return Df;case 35667:case 35671:return Uf;case 35668:case 35672:return If;case 35669:case 35673:return Ff;case 5125:return Nf;case 36294:return zf;case 36295:return Of;case 36296:return kf;case 35678:case 36198:case 36298:case 36306:case 35682:return Bf;case 35679:case 36299:case 36307:return Gf;case 35680:case 36300:case 36308:case 36293:return Hf;case 36289:case 36303:case 36311:case 36292:return Vf}}function Xf(s,t){s.uniform1fv(this.addr,t)}function qf(s,t){const e=Ri(t,this.size,2);s.uniform2fv(this.addr,e)}function Yf(s,t){const e=Ri(t,this.size,3);s.uniform3fv(this.addr,e)}function $f(s,t){const e=Ri(t,this.size,4);s.uniform4fv(this.addr,e)}function Kf(s,t){const e=Ri(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function jf(s,t){const e=Ri(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Zf(s,t){const e=Ri(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Jf(s,t){s.uniform1iv(this.addr,t)}function Qf(s,t){s.uniform2iv(this.addr,t)}function tp(s,t){s.uniform3iv(this.addr,t)}function ep(s,t){s.uniform4iv(this.addr,t)}function np(s,t){s.uniform1uiv(this.addr,t)}function ip(s,t){s.uniform2uiv(this.addr,t)}function sp(s,t){s.uniform3uiv(this.addr,t)}function ap(s,t){s.uniform4uiv(this.addr,t)}function op(s,t,e){const n=this.cache,i=t.length,a=Ys(e,i);me(n,a)||(s.uniform1iv(this.addr,a),ge(n,a));for(let r=0;r!==i;++r)e.setTexture2D(t[r]||Ml,a[r])}function rp(s,t,e){const n=this.cache,i=t.length,a=Ys(e,i);me(n,a)||(s.uniform1iv(this.addr,a),ge(n,a));for(let r=0;r!==i;++r)e.setTexture3D(t[r]||wl,a[r])}function lp(s,t,e){const n=this.cache,i=t.length,a=Ys(e,i);me(n,a)||(s.uniform1iv(this.addr,a),ge(n,a));for(let r=0;r!==i;++r)e.setTextureCube(t[r]||El,a[r])}function cp(s,t,e){const n=this.cache,i=t.length,a=Ys(e,i);me(n,a)||(s.uniform1iv(this.addr,a),ge(n,a));for(let r=0;r!==i;++r)e.setTexture2DArray(t[r]||Sl,a[r])}function hp(s){switch(s){case 5126:return Xf;case 35664:return qf;case 35665:return Yf;case 35666:return $f;case 35674:return Kf;case 35675:return jf;case 35676:return Zf;case 5124:case 35670:return Jf;case 35667:case 35671:return Qf;case 35668:case 35672:return tp;case 35669:case 35673:return ep;case 5125:return np;case 36294:return ip;case 36295:return sp;case 36296:return ap;case 35678:case 36198:case 36298:case 36306:case 35682:return op;case 35679:case 36299:case 36307:return rp;case 35680:case 36300:case 36308:case 36293:return lp;case 36289:case 36303:case 36311:case 36292:return cp}}class up{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Wf(e.type)}}class dp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=hp(e.type)}}class fp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let a=0,r=i.length;a!==r;++a){const o=i[a];o.setValue(t,e[o.id],n)}}}const Ta=/(\w+)(\])?(\[|\.)?/g;function Mr(s,t){s.seq.push(t),s.map[t.id]=t}function pp(s,t,e){const n=s.name,i=n.length;for(Ta.lastIndex=0;;){const a=Ta.exec(n),r=Ta.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===i){Mr(e,c===void 0?new up(o,s,t):new dp(o,s,t));break}else{let u=e.map[o];u===void 0&&(u=new fp(o),Mr(e,u)),e=u}}}class Ds{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const a=t.getActiveUniform(e,i),r=t.getUniformLocation(e,a.name);pp(a,r,this)}}setValue(t,e,n,i){const a=this.map[e];a!==void 0&&a.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let a=0,r=e.length;a!==r;++a){const o=e[a],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,a=t.length;i!==a;++i){const r=t[i];r.id in e&&n.push(r)}return n}}function yr(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const mp=37297;let gp=0;function vp(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=i;r<a;r++){const o=r+1;n.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return n.join(`
`)}function _p(s){const t=Yt.getPrimaries(Yt.workingColorSpace),e=Yt.getPrimaries(s);let n;switch(t===e?n="":t===ks&&e===Os?n="LinearDisplayP3ToLinearSRGB":t===Os&&e===ks&&(n="LinearSRGBToLinearDisplayP3"),s){case yn:case qs:return[n,"LinearTransferOETF"];case Me:case Ya:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Sr(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const a=/ERROR: 0:(\d+)/.exec(i);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+i+`

`+vp(s.getShaderSource(t),r)}else return i}function xp(s,t){const e=_p(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Mp(s,t){let e;switch(t){case _c:e="Linear";break;case xc:e="Reinhard";break;case Mc:e="OptimizedCineon";break;case yc:e="ACESFilmic";break;case wc:e="AgX";break;case Sc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function yp(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(vi).join(`
`)}function Sp(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(vi).join(`
`)}function wp(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Ep(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const a=s.getActiveAttrib(t,i),r=a.name;let o=1;a.type===s.FLOAT_MAT2&&(o=2),a.type===s.FLOAT_MAT3&&(o=3),a.type===s.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:s.getAttribLocation(t,r),locationSize:o}}return e}function vi(s){return s!==""}function wr(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Er(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const bp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ga(s){return s.replace(bp,Ap)}const Tp=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Ap(s,t){let e=Ft[t];if(e===void 0){const n=Tp.get(t);if(n!==void 0)e=Ft[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ga(e)}const Cp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function br(s){return s.replace(Cp,Rp)}function Rp(s,t,e,n){let i="";for(let a=parseInt(t);a<parseInt(e);a++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return i}function Tr(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Lp(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===jr?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===ql?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===gn&&(t="SHADOWMAP_TYPE_VSM"),t}function Pp(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Mi:case yi:t="ENVMAP_TYPE_CUBE";break;case Xs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Dp(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case yi:t="ENVMAP_MODE_REFRACTION";break}return t}function Up(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Zr:t="ENVMAP_BLENDING_MULTIPLY";break;case gc:t="ENVMAP_BLENDING_MIX";break;case vc:t="ENVMAP_BLENDING_ADD";break}return t}function Ip(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Fp(s,t,e,n){const i=s.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const l=Lp(e),c=Pp(e),h=Dp(e),u=Up(e),d=Ip(e),f=e.isWebGL2?"":yp(e),v=Sp(e),_=wp(a),m=i.createProgram();let p,x,g=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(vi).join(`
`),p.length>0&&(p+=`
`),x=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(vi).join(`
`),x.length>0&&(x+=`
`)):(p=[Tr(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vi).join(`
`),x=[f,Tr(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ln?"#define TONE_MAPPING":"",e.toneMapping!==Ln?Ft.tonemapping_pars_fragment:"",e.toneMapping!==Ln?Mp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ft.colorspace_pars_fragment,xp("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(vi).join(`
`)),r=Ga(r),r=wr(r,e),r=Er(r,e),o=Ga(o),o=wr(o,e),o=Er(o,e),r=br(r),o=br(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,p=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,x=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Wo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const M=g+p+r,w=g+x+o,y=yr(i,i.VERTEX_SHADER,M),A=yr(i,i.FRAGMENT_SHADER,w);i.attachShader(m,y),i.attachShader(m,A),e.index0AttributeName!==void 0?i.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function U(X){if(s.debug.checkShaderErrors){const K=i.getProgramInfoLog(m).trim(),R=i.getShaderInfoLog(y).trim(),F=i.getShaderInfoLog(A).trim();let L=!0,N=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(L=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,m,y,A);else{const q=Sr(i,y,"vertex"),W=Sr(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Program Info Log: `+K+`
`+q+`
`+W)}else K!==""?console.warn("THREE.WebGLProgram: Program Info Log:",K):(R===""||F==="")&&(N=!1);N&&(X.diagnostics={runnable:L,programLog:K,vertexShader:{log:R,prefix:p},fragmentShader:{log:F,prefix:x}})}i.deleteShader(y),i.deleteShader(A),S=new Ds(i,m),b=Ep(i,m)}let S;this.getUniforms=function(){return S===void 0&&U(this),S};let b;this.getAttributes=function(){return b===void 0&&U(this),b};let z=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return z===!1&&(z=i.getProgramParameter(m,mp)),z},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=gp++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=y,this.fragmentShader=A,this}let Np=0;class zp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),a=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(i)===!1&&(r.add(i),i.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Op(t),e.set(t,n)),n}}class Op{constructor(t){this.id=Np++,this.code=t,this.usedTimes=0}}function kp(s,t,e,n,i,a,r){const o=new ja,l=new zp,c=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return S===0?"uv":`uv${S}`}function m(S,b,z,X,K){const R=X.fog,F=K.geometry,L=S.isMeshStandardMaterial?X.environment:null,N=(S.isMeshStandardMaterial?e:t).get(S.envMap||L),q=N&&N.mapping===Xs?N.image.height:null,W=v[S.type];S.precision!==null&&(f=i.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const $=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Z=$!==void 0?$.length:0;let at=0;F.morphAttributes.position!==void 0&&(at=1),F.morphAttributes.normal!==void 0&&(at=2),F.morphAttributes.color!==void 0&&(at=3);let V,j,st,_t;if(W){const Ce=rn[W];V=Ce.vertexShader,j=Ce.fragmentShader}else V=S.vertexShader,j=S.fragmentShader,l.update(S),st=l.getVertexShaderID(S),_t=l.getFragmentShaderID(S);const gt=s.getRenderTarget(),Pt=K.isInstancedMesh===!0,Ut=K.isBatchedMesh===!0,Et=!!S.map,Vt=!!S.matcap,O=!!N,Ae=!!S.aoMap,Mt=!!S.lightMap,Rt=!!S.bumpMap,ft=!!S.normalMap,ie=!!S.displacementMap,Nt=!!S.emissiveMap,C=!!S.metalnessMap,E=!!S.roughnessMap,B=S.anisotropy>0,tt=S.clearcoat>0,Q=S.iridescence>0,et=S.sheen>0,pt=S.transmission>0,lt=B&&!!S.anisotropyMap,ht=tt&&!!S.clearcoatMap,wt=tt&&!!S.clearcoatNormalMap,zt=tt&&!!S.clearcoatRoughnessMap,J=Q&&!!S.iridescenceMap,qt=Q&&!!S.iridescenceThicknessMap,Ht=et&&!!S.sheenColorMap,Ct=et&&!!S.sheenRoughnessMap,xt=!!S.specularMap,ut=!!S.specularColorMap,It=!!S.specularIntensityMap,Wt=pt&&!!S.transmissionMap,ae=pt&&!!S.thicknessMap,kt=!!S.gradientMap,nt=!!S.alphaMap,P=S.alphaTest>0,ot=!!S.alphaHash,rt=!!S.extensions,bt=!!F.attributes.uv1,yt=!!F.attributes.uv2,$t=!!F.attributes.uv3;let Kt=Ln;return S.toneMapped&&(gt===null||gt.isXRRenderTarget===!0)&&(Kt=s.toneMapping),{isWebGL2:h,shaderID:W,shaderType:S.type,shaderName:S.name,vertexShader:V,fragmentShader:j,defines:S.defines,customVertexShaderID:st,customFragmentShaderID:_t,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Ut,instancing:Pt,instancingColor:Pt&&K.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:gt===null?s.outputColorSpace:gt.isXRRenderTarget===!0?gt.texture.colorSpace:yn,map:Et,matcap:Vt,envMap:O,envMapMode:O&&N.mapping,envMapCubeUVHeight:q,aoMap:Ae,lightMap:Mt,bumpMap:Rt,normalMap:ft,displacementMap:d&&ie,emissiveMap:Nt,normalMapObjectSpace:ft&&S.normalMapType===Fc,normalMapTangentSpace:ft&&S.normalMapType===Ic,metalnessMap:C,roughnessMap:E,anisotropy:B,anisotropyMap:lt,clearcoat:tt,clearcoatMap:ht,clearcoatNormalMap:wt,clearcoatRoughnessMap:zt,iridescence:Q,iridescenceMap:J,iridescenceThicknessMap:qt,sheen:et,sheenColorMap:Ht,sheenRoughnessMap:Ct,specularMap:xt,specularColorMap:ut,specularIntensityMap:It,transmission:pt,transmissionMap:Wt,thicknessMap:ae,gradientMap:kt,opaque:S.transparent===!1&&S.blending===_i,alphaMap:nt,alphaTest:P,alphaHash:ot,combine:S.combine,mapUv:Et&&_(S.map.channel),aoMapUv:Ae&&_(S.aoMap.channel),lightMapUv:Mt&&_(S.lightMap.channel),bumpMapUv:Rt&&_(S.bumpMap.channel),normalMapUv:ft&&_(S.normalMap.channel),displacementMapUv:ie&&_(S.displacementMap.channel),emissiveMapUv:Nt&&_(S.emissiveMap.channel),metalnessMapUv:C&&_(S.metalnessMap.channel),roughnessMapUv:E&&_(S.roughnessMap.channel),anisotropyMapUv:lt&&_(S.anisotropyMap.channel),clearcoatMapUv:ht&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:wt&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:zt&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:qt&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ht&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&_(S.sheenRoughnessMap.channel),specularMapUv:xt&&_(S.specularMap.channel),specularColorMapUv:ut&&_(S.specularColorMap.channel),specularIntensityMapUv:It&&_(S.specularIntensityMap.channel),transmissionMapUv:Wt&&_(S.transmissionMap.channel),thicknessMapUv:ae&&_(S.thicknessMap.channel),alphaMapUv:nt&&_(S.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(ft||B),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:bt,vertexUv2s:yt,vertexUv3s:$t,pointsUvs:K.isPoints===!0&&!!F.attributes.uv&&(Et||nt),fog:!!R,useFog:S.fog===!0,fogExp2:R&&R.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:K.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:at,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&z.length>0,shadowMapType:s.shadowMap.type,toneMapping:Kt,useLegacyLights:s._useLegacyLights,decodeVideoTexture:Et&&S.map.isVideoTexture===!0&&Yt.getTransfer(S.map.colorSpace)===Jt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Ye,flipSided:S.side===Ue,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:rt&&S.extensions.derivatives===!0,extensionFragDepth:rt&&S.extensions.fragDepth===!0,extensionDrawBuffers:rt&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:rt&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:rt&&S.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function p(S){const b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(const z in S.defines)b.push(z),b.push(S.defines[z]);return S.isRawShaderMaterial===!1&&(x(b,S),g(b,S),b.push(s.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function x(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function g(S,b){o.disableAll(),b.isWebGL2&&o.enable(0),b.supportsVertexTextures&&o.enable(1),b.instancing&&o.enable(2),b.instancingColor&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),S.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.skinning&&o.enable(4),b.morphTargets&&o.enable(5),b.morphNormals&&o.enable(6),b.morphColors&&o.enable(7),b.premultipliedAlpha&&o.enable(8),b.shadowMapEnabled&&o.enable(9),b.useLegacyLights&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),S.push(o.mask)}function M(S){const b=v[S.type];let z;if(b){const X=rn[b];z=Mh.clone(X.uniforms)}else z=S.uniforms;return z}function w(S,b){let z;for(let X=0,K=c.length;X<K;X++){const R=c[X];if(R.cacheKey===b){z=R,++z.usedTimes;break}}return z===void 0&&(z=new Fp(s,b,S,a),c.push(z)),z}function y(S){if(--S.usedTimes===0){const b=c.indexOf(S);c[b]=c[c.length-1],c.pop(),S.destroy()}}function A(S){l.remove(S)}function U(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:w,releaseProgram:y,releaseShaderCache:A,programs:c,dispose:U}}function Bp(){let s=new WeakMap;function t(a){let r=s.get(a);return r===void 0&&(r={},s.set(a,r)),r}function e(a){s.delete(a)}function n(a,r,o){s.get(a)[r]=o}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function Gp(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Ar(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Cr(){const s=[];let t=0;const e=[],n=[],i=[];function a(){t=0,e.length=0,n.length=0,i.length=0}function r(u,d,f,v,_,m){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:v,renderOrder:u.renderOrder,z:_,group:m},s[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=v,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,d,f,v,_,m){const p=r(u,d,f,v,_,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function l(u,d,f,v,_,m){const p=r(u,d,f,v,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||Gp),n.length>1&&n.sort(d||Ar),i.length>1&&i.sort(d||Ar)}function h(){for(let u=t,d=s.length;u<d;u++){const f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:a,push:o,unshift:l,finish:h,sort:c}}function Hp(){let s=new WeakMap;function t(n,i){const a=s.get(n);let r;return a===void 0?(r=new Cr,s.set(n,[r])):i>=a.length?(r=new Cr,a.push(r)):r=a[i],r}function e(){s=new WeakMap}return{get:t,dispose:e}}function Vp(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new vt};break;case"SpotLight":e={position:new D,direction:new D,color:new vt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new vt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new vt,groundColor:new vt};break;case"RectAreaLight":e={color:new vt,position:new D,halfWidth:new D,halfHeight:new D};break}return s[t.id]=e,e}}}function Wp(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Xp=0;function qp(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Yp(s,t){const e=new Vp,n=Wp(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new D);const a=new D,r=new Xt,o=new Xt;function l(h,u){let d=0,f=0,v=0;for(let X=0;X<9;X++)i.probe[X].set(0,0,0);let _=0,m=0,p=0,x=0,g=0,M=0,w=0,y=0,A=0,U=0,S=0;h.sort(qp);const b=u===!0?Math.PI:1;for(let X=0,K=h.length;X<K;X++){const R=h[X],F=R.color,L=R.intensity,N=R.distance,q=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=F.r*L*b,f+=F.g*L*b,v+=F.b*L*b;else if(R.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(R.sh.coefficients[W],L);S++}else if(R.isDirectionalLight){const W=e.get(R);if(W.color.copy(R.color).multiplyScalar(R.intensity*b),R.castShadow){const $=R.shadow,Z=n.get(R);Z.shadowBias=$.bias,Z.shadowNormalBias=$.normalBias,Z.shadowRadius=$.radius,Z.shadowMapSize=$.mapSize,i.directionalShadow[_]=Z,i.directionalShadowMap[_]=q,i.directionalShadowMatrix[_]=R.shadow.matrix,M++}i.directional[_]=W,_++}else if(R.isSpotLight){const W=e.get(R);W.position.setFromMatrixPosition(R.matrixWorld),W.color.copy(F).multiplyScalar(L*b),W.distance=N,W.coneCos=Math.cos(R.angle),W.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),W.decay=R.decay,i.spot[p]=W;const $=R.shadow;if(R.map&&(i.spotLightMap[A]=R.map,A++,$.updateMatrices(R),R.castShadow&&U++),i.spotLightMatrix[p]=$.matrix,R.castShadow){const Z=n.get(R);Z.shadowBias=$.bias,Z.shadowNormalBias=$.normalBias,Z.shadowRadius=$.radius,Z.shadowMapSize=$.mapSize,i.spotShadow[p]=Z,i.spotShadowMap[p]=q,y++}p++}else if(R.isRectAreaLight){const W=e.get(R);W.color.copy(F).multiplyScalar(L),W.halfWidth.set(R.width*.5,0,0),W.halfHeight.set(0,R.height*.5,0),i.rectArea[x]=W,x++}else if(R.isPointLight){const W=e.get(R);if(W.color.copy(R.color).multiplyScalar(R.intensity*b),W.distance=R.distance,W.decay=R.decay,R.castShadow){const $=R.shadow,Z=n.get(R);Z.shadowBias=$.bias,Z.shadowNormalBias=$.normalBias,Z.shadowRadius=$.radius,Z.shadowMapSize=$.mapSize,Z.shadowCameraNear=$.camera.near,Z.shadowCameraFar=$.camera.far,i.pointShadow[m]=Z,i.pointShadowMap[m]=q,i.pointShadowMatrix[m]=R.shadow.matrix,w++}i.point[m]=W,m++}else if(R.isHemisphereLight){const W=e.get(R);W.skyColor.copy(R.color).multiplyScalar(L*b),W.groundColor.copy(R.groundColor).multiplyScalar(L*b),i.hemi[g]=W,g++}}x>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=it.LTC_FLOAT_1,i.rectAreaLTC2=it.LTC_FLOAT_2):(i.rectAreaLTC1=it.LTC_HALF_1,i.rectAreaLTC2=it.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=it.LTC_FLOAT_1,i.rectAreaLTC2=it.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=it.LTC_HALF_1,i.rectAreaLTC2=it.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=v;const z=i.hash;(z.directionalLength!==_||z.pointLength!==m||z.spotLength!==p||z.rectAreaLength!==x||z.hemiLength!==g||z.numDirectionalShadows!==M||z.numPointShadows!==w||z.numSpotShadows!==y||z.numSpotMaps!==A||z.numLightProbes!==S)&&(i.directional.length=_,i.spot.length=p,i.rectArea.length=x,i.point.length=m,i.hemi.length=g,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=y+A-U,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=U,i.numLightProbes=S,z.directionalLength=_,z.pointLength=m,z.spotLength=p,z.rectAreaLength=x,z.hemiLength=g,z.numDirectionalShadows=M,z.numPointShadows=w,z.numSpotShadows=y,z.numSpotMaps=A,z.numLightProbes=S,i.version=Xp++)}function c(h,u){let d=0,f=0,v=0,_=0,m=0;const p=u.matrixWorldInverse;for(let x=0,g=h.length;x<g;x++){const M=h[x];if(M.isDirectionalLight){const w=i.directional[d];w.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(a),w.direction.transformDirection(p),d++}else if(M.isSpotLight){const w=i.spot[v];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(a),w.direction.transformDirection(p),v++}else if(M.isRectAreaLight){const w=i.rectArea[_];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(p),o.identity(),r.copy(M.matrixWorld),r.premultiply(p),o.extractRotation(r),w.halfWidth.set(M.width*.5,0,0),w.halfHeight.set(0,M.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),_++}else if(M.isPointLight){const w=i.point[f];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(p),f++}else if(M.isHemisphereLight){const w=i.hemi[m];w.direction.setFromMatrixPosition(M.matrixWorld),w.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:i}}function Rr(s,t){const e=new Yp(s,t),n=[],i=[];function a(){n.length=0,i.length=0}function r(u){n.push(u)}function o(u){i.push(u)}function l(u){e.setup(n,u)}function c(u){e.setupView(n,u)}return{init:a,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:r,pushShadow:o}}function $p(s,t){let e=new WeakMap;function n(a,r=0){const o=e.get(a);let l;return o===void 0?(l=new Rr(s,t),e.set(a,[l])):r>=o.length?(l=new Rr(s,t),o.push(l)):l=o[r],l}function i(){e=new WeakMap}return{get:n,dispose:i}}class Kp extends ji{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Dc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class jp extends ji{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Zp=`void main() {
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
}`;function Qp(s,t,e){let n=new Za;const i=new Tt,a=new Tt,r=new le,o=new Kp({depthPacking:Uc}),l=new jp,c={},h=e.maxTextureSize,u={[Mn]:Ue,[Ue]:Mn,[Ye]:Ye},d=new pe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Tt},radius:{value:4}},vertexShader:Zp,fragmentShader:Jp}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const v=new ye;v.setAttribute("position",new Ie(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new te(v,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=jr;let p=this.type;this.render=function(y,A,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||y.length===0)return;const S=s.getRenderTarget(),b=s.getActiveCubeFace(),z=s.getActiveMipmapLevel(),X=s.state;X.setBlending(Rn),X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);const K=p!==gn&&this.type===gn,R=p===gn&&this.type!==gn;for(let F=0,L=y.length;F<L;F++){const N=y[F],q=N.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",N,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;i.copy(q.mapSize);const W=q.getFrameExtents();if(i.multiply(W),a.copy(q.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(a.x=Math.floor(h/W.x),i.x=a.x*W.x,q.mapSize.x=a.x),i.y>h&&(a.y=Math.floor(h/W.y),i.y=a.y*W.y,q.mapSize.y=a.y)),q.map===null||K===!0||R===!0){const Z=this.type!==gn?{minFilter:de,magFilter:de}:{};q.map!==null&&q.map.dispose(),q.map=new sn(i.x,i.y,Z),q.map.texture.name=N.name+".shadowMap",q.camera.updateProjectionMatrix()}s.setRenderTarget(q.map),s.clear();const $=q.getViewportCount();for(let Z=0;Z<$;Z++){const at=q.getViewport(Z);r.set(a.x*at.x,a.y*at.y,a.x*at.z,a.y*at.w),X.viewport(r),q.updateMatrices(N,Z),n=q.getFrustum(),M(A,U,q.camera,N,this.type)}q.isPointLightShadow!==!0&&this.type===gn&&x(q,U),q.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(S,b,z)};function x(y,A){const U=t.update(_);d.defines.VSM_SAMPLES!==y.blurSamples&&(d.defines.VSM_SAMPLES=y.blurSamples,f.defines.VSM_SAMPLES=y.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new sn(i.x,i.y)),d.uniforms.shadow_pass.value=y.map.texture,d.uniforms.resolution.value=y.mapSize,d.uniforms.radius.value=y.radius,s.setRenderTarget(y.mapPass),s.clear(),s.renderBufferDirect(A,null,U,d,_,null),f.uniforms.shadow_pass.value=y.mapPass.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,s.setRenderTarget(y.map),s.clear(),s.renderBufferDirect(A,null,U,f,_,null)}function g(y,A,U,S){let b=null;const z=U.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(z!==void 0)b=z;else if(b=U.isPointLight===!0?l:o,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const X=b.uuid,K=A.uuid;let R=c[X];R===void 0&&(R={},c[X]=R);let F=R[K];F===void 0&&(F=b.clone(),R[K]=F,A.addEventListener("dispose",w)),b=F}if(b.visible=A.visible,b.wireframe=A.wireframe,S===gn?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:u[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,U.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const X=s.properties.get(b);X.light=U}return b}function M(y,A,U,S,b){if(y.visible===!1)return;if(y.layers.test(A.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&b===gn)&&(!y.frustumCulled||n.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,y.matrixWorld);const K=t.update(y),R=y.material;if(Array.isArray(R)){const F=K.groups;for(let L=0,N=F.length;L<N;L++){const q=F[L],W=R[q.materialIndex];if(W&&W.visible){const $=g(y,W,S,b);y.onBeforeShadow(s,y,A,U,K,$,q),s.renderBufferDirect(U,null,K,$,y,q),y.onAfterShadow(s,y,A,U,K,$,q)}}}else if(R.visible){const F=g(y,R,S,b);y.onBeforeShadow(s,y,A,U,K,F,null),s.renderBufferDirect(U,null,K,F,y,null),y.onAfterShadow(s,y,A,U,K,F,null)}}const X=y.children;for(let K=0,R=X.length;K<R;K++)M(X[K],A,U,S,b)}function w(y){y.target.removeEventListener("dispose",w);for(const U in c){const S=c[U],b=y.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}function t0(s,t,e){const n=e.isWebGL2;function i(){let P=!1;const ot=new le;let rt=null;const bt=new le(0,0,0,0);return{setMask:function(yt){rt!==yt&&!P&&(s.colorMask(yt,yt,yt,yt),rt=yt)},setLocked:function(yt){P=yt},setClear:function(yt,$t,Kt,ve,Ce){Ce===!0&&(yt*=ve,$t*=ve,Kt*=ve),ot.set(yt,$t,Kt,ve),bt.equals(ot)===!1&&(s.clearColor(yt,$t,Kt,ve),bt.copy(ot))},reset:function(){P=!1,rt=null,bt.set(-1,0,0,0)}}}function a(){let P=!1,ot=null,rt=null,bt=null;return{setTest:function(yt){yt?Ut(s.DEPTH_TEST):Et(s.DEPTH_TEST)},setMask:function(yt){ot!==yt&&!P&&(s.depthMask(yt),ot=yt)},setFunc:function(yt){if(rt!==yt){switch(yt){case cc:s.depthFunc(s.NEVER);break;case hc:s.depthFunc(s.ALWAYS);break;case uc:s.depthFunc(s.LESS);break;case Fs:s.depthFunc(s.LEQUAL);break;case dc:s.depthFunc(s.EQUAL);break;case fc:s.depthFunc(s.GEQUAL);break;case pc:s.depthFunc(s.GREATER);break;case mc:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}rt=yt}},setLocked:function(yt){P=yt},setClear:function(yt){bt!==yt&&(s.clearDepth(yt),bt=yt)},reset:function(){P=!1,ot=null,rt=null,bt=null}}}function r(){let P=!1,ot=null,rt=null,bt=null,yt=null,$t=null,Kt=null,ve=null,Ce=null;return{setTest:function(jt){P||(jt?Ut(s.STENCIL_TEST):Et(s.STENCIL_TEST))},setMask:function(jt){ot!==jt&&!P&&(s.stencilMask(jt),ot=jt)},setFunc:function(jt,Re,an){(rt!==jt||bt!==Re||yt!==an)&&(s.stencilFunc(jt,Re,an),rt=jt,bt=Re,yt=an)},setOp:function(jt,Re,an){($t!==jt||Kt!==Re||ve!==an)&&(s.stencilOp(jt,Re,an),$t=jt,Kt=Re,ve=an)},setLocked:function(jt){P=jt},setClear:function(jt){Ce!==jt&&(s.clearStencil(jt),Ce=jt)},reset:function(){P=!1,ot=null,rt=null,bt=null,yt=null,$t=null,Kt=null,ve=null,Ce=null}}}const o=new i,l=new a,c=new r,h=new WeakMap,u=new WeakMap;let d={},f={},v=new WeakMap,_=[],m=null,p=!1,x=null,g=null,M=null,w=null,y=null,A=null,U=null,S=new vt(0,0,0),b=0,z=!1,X=null,K=null,R=null,F=null,L=null;const N=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,W=0;const $=s.getParameter(s.VERSION);$.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec($)[1]),q=W>=1):$.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),q=W>=2);let Z=null,at={};const V=s.getParameter(s.SCISSOR_BOX),j=s.getParameter(s.VIEWPORT),st=new le().fromArray(V),_t=new le().fromArray(j);function gt(P,ot,rt,bt){const yt=new Uint8Array(4),$t=s.createTexture();s.bindTexture(P,$t),s.texParameteri(P,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(P,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Kt=0;Kt<rt;Kt++)n&&(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)?s.texImage3D(ot,0,s.RGBA,1,1,bt,0,s.RGBA,s.UNSIGNED_BYTE,yt):s.texImage2D(ot+Kt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,yt);return $t}const Pt={};Pt[s.TEXTURE_2D]=gt(s.TEXTURE_2D,s.TEXTURE_2D,1),Pt[s.TEXTURE_CUBE_MAP]=gt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Pt[s.TEXTURE_2D_ARRAY]=gt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Pt[s.TEXTURE_3D]=gt(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Ut(s.DEPTH_TEST),l.setFunc(Fs),Nt(!1),C(ho),Ut(s.CULL_FACE),ft(Rn);function Ut(P){d[P]!==!0&&(s.enable(P),d[P]=!0)}function Et(P){d[P]!==!1&&(s.disable(P),d[P]=!1)}function Vt(P,ot){return f[P]!==ot?(s.bindFramebuffer(P,ot),f[P]=ot,n&&(P===s.DRAW_FRAMEBUFFER&&(f[s.FRAMEBUFFER]=ot),P===s.FRAMEBUFFER&&(f[s.DRAW_FRAMEBUFFER]=ot)),!0):!1}function O(P,ot){let rt=_,bt=!1;if(P)if(rt=v.get(ot),rt===void 0&&(rt=[],v.set(ot,rt)),P.isWebGLMultipleRenderTargets){const yt=P.texture;if(rt.length!==yt.length||rt[0]!==s.COLOR_ATTACHMENT0){for(let $t=0,Kt=yt.length;$t<Kt;$t++)rt[$t]=s.COLOR_ATTACHMENT0+$t;rt.length=yt.length,bt=!0}}else rt[0]!==s.COLOR_ATTACHMENT0&&(rt[0]=s.COLOR_ATTACHMENT0,bt=!0);else rt[0]!==s.BACK&&(rt[0]=s.BACK,bt=!0);bt&&(e.isWebGL2?s.drawBuffers(rt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(rt))}function Ae(P){return m!==P?(s.useProgram(P),m=P,!0):!1}const Mt={[Vn]:s.FUNC_ADD,[$l]:s.FUNC_SUBTRACT,[Kl]:s.FUNC_REVERSE_SUBTRACT};if(n)Mt[po]=s.MIN,Mt[mo]=s.MAX;else{const P=t.get("EXT_blend_minmax");P!==null&&(Mt[po]=P.MIN_EXT,Mt[mo]=P.MAX_EXT)}const Rt={[jl]:s.ZERO,[Zl]:s.ONE,[Jl]:s.SRC_COLOR,[Ua]:s.SRC_ALPHA,[sc]:s.SRC_ALPHA_SATURATE,[nc]:s.DST_COLOR,[tc]:s.DST_ALPHA,[Ql]:s.ONE_MINUS_SRC_COLOR,[Ia]:s.ONE_MINUS_SRC_ALPHA,[ic]:s.ONE_MINUS_DST_COLOR,[ec]:s.ONE_MINUS_DST_ALPHA,[ac]:s.CONSTANT_COLOR,[oc]:s.ONE_MINUS_CONSTANT_COLOR,[rc]:s.CONSTANT_ALPHA,[lc]:s.ONE_MINUS_CONSTANT_ALPHA};function ft(P,ot,rt,bt,yt,$t,Kt,ve,Ce,jt){if(P===Rn){p===!0&&(Et(s.BLEND),p=!1);return}if(p===!1&&(Ut(s.BLEND),p=!0),P!==Yl){if(P!==x||jt!==z){if((g!==Vn||y!==Vn)&&(s.blendEquation(s.FUNC_ADD),g=Vn,y=Vn),jt)switch(P){case _i:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Da:s.blendFunc(s.ONE,s.ONE);break;case uo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case fo:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case _i:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Da:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case uo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case fo:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}M=null,w=null,A=null,U=null,S.set(0,0,0),b=0,x=P,z=jt}return}yt=yt||ot,$t=$t||rt,Kt=Kt||bt,(ot!==g||yt!==y)&&(s.blendEquationSeparate(Mt[ot],Mt[yt]),g=ot,y=yt),(rt!==M||bt!==w||$t!==A||Kt!==U)&&(s.blendFuncSeparate(Rt[rt],Rt[bt],Rt[$t],Rt[Kt]),M=rt,w=bt,A=$t,U=Kt),(ve.equals(S)===!1||Ce!==b)&&(s.blendColor(ve.r,ve.g,ve.b,Ce),S.copy(ve),b=Ce),x=P,z=!1}function ie(P,ot){P.side===Ye?Et(s.CULL_FACE):Ut(s.CULL_FACE);let rt=P.side===Ue;ot&&(rt=!rt),Nt(rt),P.blending===_i&&P.transparent===!1?ft(Rn):ft(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),l.setFunc(P.depthFunc),l.setTest(P.depthTest),l.setMask(P.depthWrite),o.setMask(P.colorWrite);const bt=P.stencilWrite;c.setTest(bt),bt&&(c.setMask(P.stencilWriteMask),c.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),c.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),B(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?Ut(s.SAMPLE_ALPHA_TO_COVERAGE):Et(s.SAMPLE_ALPHA_TO_COVERAGE)}function Nt(P){X!==P&&(P?s.frontFace(s.CW):s.frontFace(s.CCW),X=P)}function C(P){P!==Wl?(Ut(s.CULL_FACE),P!==K&&(P===ho?s.cullFace(s.BACK):P===Xl?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Et(s.CULL_FACE),K=P}function E(P){P!==R&&(q&&s.lineWidth(P),R=P)}function B(P,ot,rt){P?(Ut(s.POLYGON_OFFSET_FILL),(F!==ot||L!==rt)&&(s.polygonOffset(ot,rt),F=ot,L=rt)):Et(s.POLYGON_OFFSET_FILL)}function tt(P){P?Ut(s.SCISSOR_TEST):Et(s.SCISSOR_TEST)}function Q(P){P===void 0&&(P=s.TEXTURE0+N-1),Z!==P&&(s.activeTexture(P),Z=P)}function et(P,ot,rt){rt===void 0&&(Z===null?rt=s.TEXTURE0+N-1:rt=Z);let bt=at[rt];bt===void 0&&(bt={type:void 0,texture:void 0},at[rt]=bt),(bt.type!==P||bt.texture!==ot)&&(Z!==rt&&(s.activeTexture(rt),Z=rt),s.bindTexture(P,ot||Pt[P]),bt.type=P,bt.texture=ot)}function pt(){const P=at[Z];P!==void 0&&P.type!==void 0&&(s.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function lt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ht(){try{s.compressedTexImage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function wt(){try{s.texSubImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function zt(){try{s.texSubImage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function J(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function qt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Ht(){try{s.texStorage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Ct(){try{s.texStorage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function xt(){try{s.texImage2D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ut(){try{s.texImage3D.apply(s,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function It(P){st.equals(P)===!1&&(s.scissor(P.x,P.y,P.z,P.w),st.copy(P))}function Wt(P){_t.equals(P)===!1&&(s.viewport(P.x,P.y,P.z,P.w),_t.copy(P))}function ae(P,ot){let rt=u.get(ot);rt===void 0&&(rt=new WeakMap,u.set(ot,rt));let bt=rt.get(P);bt===void 0&&(bt=s.getUniformBlockIndex(ot,P.name),rt.set(P,bt))}function kt(P,ot){const bt=u.get(ot).get(P);h.get(ot)!==bt&&(s.uniformBlockBinding(ot,bt,P.__bindingPointIndex),h.set(ot,bt))}function nt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),d={},Z=null,at={},f={},v=new WeakMap,_=[],m=null,p=!1,x=null,g=null,M=null,w=null,y=null,A=null,U=null,S=new vt(0,0,0),b=0,z=!1,X=null,K=null,R=null,F=null,L=null,st.set(0,0,s.canvas.width,s.canvas.height),_t.set(0,0,s.canvas.width,s.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Ut,disable:Et,bindFramebuffer:Vt,drawBuffers:O,useProgram:Ae,setBlending:ft,setMaterial:ie,setFlipSided:Nt,setCullFace:C,setLineWidth:E,setPolygonOffset:B,setScissorTest:tt,activeTexture:Q,bindTexture:et,unbindTexture:pt,compressedTexImage2D:lt,compressedTexImage3D:ht,texImage2D:xt,texImage3D:ut,updateUBOMapping:ae,uniformBlockBinding:kt,texStorage2D:Ht,texStorage3D:Ct,texSubImage2D:wt,texSubImage3D:zt,compressedTexSubImage2D:J,compressedTexSubImage3D:qt,scissor:It,viewport:Wt,reset:nt}}function e0(s,t,e,n,i,a,r){const o=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(C,E){return f?new OffscreenCanvas(C,E):Hs("canvas")}function _(C,E,B,tt){let Q=1;if((C.width>tt||C.height>tt)&&(Q=tt/Math.max(C.width,C.height)),Q<1||E===!0)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap){const et=E?Gs:Math.floor,pt=et(Q*C.width),lt=et(Q*C.height);u===void 0&&(u=v(pt,lt));const ht=B?v(pt,lt):u;return ht.width=pt,ht.height=lt,ht.getContext("2d").drawImage(C,0,0,pt,lt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+C.width+"x"+C.height+") to ("+pt+"x"+lt+")."),ht}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+C.width+"x"+C.height+")."),C;return C}function m(C){return ka(C.width)&&ka(C.height)}function p(C){return o?!1:C.wrapS!==Ve||C.wrapT!==Ve||C.minFilter!==de&&C.minFilter!==ee}function x(C,E){return C.generateMipmaps&&E&&C.minFilter!==de&&C.minFilter!==ee}function g(C){s.generateMipmap(C)}function M(C,E,B,tt,Q=!1){if(o===!1)return E;if(C!==null){if(s[C]!==void 0)return s[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let et=E;if(E===s.RED&&(B===s.FLOAT&&(et=s.R32F),B===s.HALF_FLOAT&&(et=s.R16F),B===s.UNSIGNED_BYTE&&(et=s.R8)),E===s.RED_INTEGER&&(B===s.UNSIGNED_BYTE&&(et=s.R8UI),B===s.UNSIGNED_SHORT&&(et=s.R16UI),B===s.UNSIGNED_INT&&(et=s.R32UI),B===s.BYTE&&(et=s.R8I),B===s.SHORT&&(et=s.R16I),B===s.INT&&(et=s.R32I)),E===s.RG&&(B===s.FLOAT&&(et=s.RG32F),B===s.HALF_FLOAT&&(et=s.RG16F),B===s.UNSIGNED_BYTE&&(et=s.RG8)),E===s.RGBA){const pt=Q?zs:Yt.getTransfer(tt);B===s.FLOAT&&(et=s.RGBA32F),B===s.HALF_FLOAT&&(et=s.RGBA16F),B===s.UNSIGNED_BYTE&&(et=pt===Jt?s.SRGB8_ALPHA8:s.RGBA8),B===s.UNSIGNED_SHORT_4_4_4_4&&(et=s.RGBA4),B===s.UNSIGNED_SHORT_5_5_5_1&&(et=s.RGB5_A1)}return(et===s.R16F||et===s.R32F||et===s.RG16F||et===s.RG32F||et===s.RGBA16F||et===s.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function w(C,E,B){return x(C,B)===!0||C.isFramebufferTexture&&C.minFilter!==de&&C.minFilter!==ee?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function y(C){return C===de||C===go||C===Qs?s.NEAREST:s.LINEAR}function A(C){const E=C.target;E.removeEventListener("dispose",A),S(E),E.isVideoTexture&&h.delete(E)}function U(C){const E=C.target;E.removeEventListener("dispose",U),z(E)}function S(C){const E=n.get(C);if(E.__webglInit===void 0)return;const B=C.source,tt=d.get(B);if(tt){const Q=tt[E.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&b(C),Object.keys(tt).length===0&&d.delete(B)}n.remove(C)}function b(C){const E=n.get(C);s.deleteTexture(E.__webglTexture);const B=C.source,tt=d.get(B);delete tt[E.__cacheKey],r.memory.textures--}function z(C){const E=C.texture,B=n.get(C),tt=n.get(E);if(tt.__webglTexture!==void 0&&(s.deleteTexture(tt.__webglTexture),r.memory.textures--),C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(B.__webglFramebuffer[Q]))for(let et=0;et<B.__webglFramebuffer[Q].length;et++)s.deleteFramebuffer(B.__webglFramebuffer[Q][et]);else s.deleteFramebuffer(B.__webglFramebuffer[Q]);B.__webglDepthbuffer&&s.deleteRenderbuffer(B.__webglDepthbuffer[Q])}else{if(Array.isArray(B.__webglFramebuffer))for(let Q=0;Q<B.__webglFramebuffer.length;Q++)s.deleteFramebuffer(B.__webglFramebuffer[Q]);else s.deleteFramebuffer(B.__webglFramebuffer);if(B.__webglDepthbuffer&&s.deleteRenderbuffer(B.__webglDepthbuffer),B.__webglMultisampledFramebuffer&&s.deleteFramebuffer(B.__webglMultisampledFramebuffer),B.__webglColorRenderbuffer)for(let Q=0;Q<B.__webglColorRenderbuffer.length;Q++)B.__webglColorRenderbuffer[Q]&&s.deleteRenderbuffer(B.__webglColorRenderbuffer[Q]);B.__webglDepthRenderbuffer&&s.deleteRenderbuffer(B.__webglDepthRenderbuffer)}if(C.isWebGLMultipleRenderTargets)for(let Q=0,et=E.length;Q<et;Q++){const pt=n.get(E[Q]);pt.__webglTexture&&(s.deleteTexture(pt.__webglTexture),r.memory.textures--),n.remove(E[Q])}n.remove(E),n.remove(C)}let X=0;function K(){X=0}function R(){const C=X;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),X+=1,C}function F(C){const E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function L(C,E){const B=n.get(C);if(C.isVideoTexture&&ie(C),C.isRenderTargetTexture===!1&&C.version>0&&B.__version!==C.version){const tt=C.image;if(tt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{st(B,C,E);return}}e.bindTexture(s.TEXTURE_2D,B.__webglTexture,s.TEXTURE0+E)}function N(C,E){const B=n.get(C);if(C.version>0&&B.__version!==C.version){st(B,C,E);return}e.bindTexture(s.TEXTURE_2D_ARRAY,B.__webglTexture,s.TEXTURE0+E)}function q(C,E){const B=n.get(C);if(C.version>0&&B.__version!==C.version){st(B,C,E);return}e.bindTexture(s.TEXTURE_3D,B.__webglTexture,s.TEXTURE0+E)}function W(C,E){const B=n.get(C);if(C.version>0&&B.__version!==C.version){_t(B,C,E);return}e.bindTexture(s.TEXTURE_CUBE_MAP,B.__webglTexture,s.TEXTURE0+E)}const $={[Si]:s.REPEAT,[Ve]:s.CLAMP_TO_EDGE,[za]:s.MIRRORED_REPEAT},Z={[de]:s.NEAREST,[go]:s.NEAREST_MIPMAP_NEAREST,[Qs]:s.NEAREST_MIPMAP_LINEAR,[ee]:s.LINEAR,[Ec]:s.LINEAR_MIPMAP_NEAREST,[$n]:s.LINEAR_MIPMAP_LINEAR},at={[Nc]:s.NEVER,[Hc]:s.ALWAYS,[zc]:s.LESS,[rl]:s.LEQUAL,[Oc]:s.EQUAL,[Gc]:s.GEQUAL,[kc]:s.GREATER,[Bc]:s.NOTEQUAL};function V(C,E,B){if(B?(s.texParameteri(C,s.TEXTURE_WRAP_S,$[E.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,$[E.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,$[E.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,Z[E.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,Z[E.minFilter])):(s.texParameteri(C,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(C,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(E.wrapS!==Ve||E.wrapT!==Ve)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(C,s.TEXTURE_MAG_FILTER,y(E.magFilter)),s.texParameteri(C,s.TEXTURE_MIN_FILTER,y(E.minFilter)),E.minFilter!==de&&E.minFilter!==ee&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,at[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const tt=t.get("EXT_texture_filter_anisotropic");if(E.magFilter===de||E.minFilter!==Qs&&E.minFilter!==$n||E.type===ln&&t.has("OES_texture_float_linear")===!1||o===!1&&E.type===Pn&&t.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||n.get(E).__currentAnisotropy)&&(s.texParameterf(C,tt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,i.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy)}}function j(C,E){let B=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",A));const tt=E.source;let Q=d.get(tt);Q===void 0&&(Q={},d.set(tt,Q));const et=F(E);if(et!==C.__cacheKey){Q[et]===void 0&&(Q[et]={texture:s.createTexture(),usedTimes:0},r.memory.textures++,B=!0),Q[et].usedTimes++;const pt=Q[C.__cacheKey];pt!==void 0&&(Q[C.__cacheKey].usedTimes--,pt.usedTimes===0&&b(E)),C.__cacheKey=et,C.__webglTexture=Q[et].texture}return B}function st(C,E,B){let tt=s.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(tt=s.TEXTURE_2D_ARRAY),E.isData3DTexture&&(tt=s.TEXTURE_3D);const Q=j(C,E),et=E.source;e.bindTexture(tt,C.__webglTexture,s.TEXTURE0+B);const pt=n.get(et);if(et.version!==pt.__version||Q===!0){e.activeTexture(s.TEXTURE0+B);const lt=Yt.getPrimaries(Yt.workingColorSpace),ht=E.colorSpace===$e?null:Yt.getPrimaries(E.colorSpace),wt=E.colorSpace===$e||lt===ht?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);const zt=p(E)&&m(E.image)===!1;let J=_(E.image,zt,!1,i.maxTextureSize);J=Nt(E,J);const qt=m(J)||o,Ht=a.convert(E.format,E.colorSpace);let Ct=a.convert(E.type),xt=M(E.internalFormat,Ht,Ct,E.colorSpace,E.isVideoTexture);V(tt,E,qt);let ut;const It=E.mipmaps,Wt=o&&E.isVideoTexture!==!0&&xt!==al,ae=pt.__version===void 0||Q===!0,kt=w(E,J,qt);if(E.isDepthTexture)xt=s.DEPTH_COMPONENT,o?E.type===ln?xt=s.DEPTH_COMPONENT32F:E.type===_n?xt=s.DEPTH_COMPONENT24:E.type===Xn?xt=s.DEPTH24_STENCIL8:xt=s.DEPTH_COMPONENT16:E.type===ln&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===qn&&xt===s.DEPTH_COMPONENT&&E.type!==qa&&E.type!==_n&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=_n,Ct=a.convert(E.type)),E.format===wi&&xt===s.DEPTH_COMPONENT&&(xt=s.DEPTH_STENCIL,E.type!==Xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=Xn,Ct=a.convert(E.type))),ae&&(Wt?e.texStorage2D(s.TEXTURE_2D,1,xt,J.width,J.height):e.texImage2D(s.TEXTURE_2D,0,xt,J.width,J.height,0,Ht,Ct,null));else if(E.isDataTexture)if(It.length>0&&qt){Wt&&ae&&e.texStorage2D(s.TEXTURE_2D,kt,xt,It[0].width,It[0].height);for(let nt=0,P=It.length;nt<P;nt++)ut=It[nt],Wt?e.texSubImage2D(s.TEXTURE_2D,nt,0,0,ut.width,ut.height,Ht,Ct,ut.data):e.texImage2D(s.TEXTURE_2D,nt,xt,ut.width,ut.height,0,Ht,Ct,ut.data);E.generateMipmaps=!1}else Wt?(ae&&e.texStorage2D(s.TEXTURE_2D,kt,xt,J.width,J.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,J.width,J.height,Ht,Ct,J.data)):e.texImage2D(s.TEXTURE_2D,0,xt,J.width,J.height,0,Ht,Ct,J.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Wt&&ae&&e.texStorage3D(s.TEXTURE_2D_ARRAY,kt,xt,It[0].width,It[0].height,J.depth);for(let nt=0,P=It.length;nt<P;nt++)ut=It[nt],E.format!==Ne?Ht!==null?Wt?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,nt,0,0,0,ut.width,ut.height,J.depth,Ht,ut.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,nt,xt,ut.width,ut.height,J.depth,0,ut.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Wt?e.texSubImage3D(s.TEXTURE_2D_ARRAY,nt,0,0,0,ut.width,ut.height,J.depth,Ht,Ct,ut.data):e.texImage3D(s.TEXTURE_2D_ARRAY,nt,xt,ut.width,ut.height,J.depth,0,Ht,Ct,ut.data)}else{Wt&&ae&&e.texStorage2D(s.TEXTURE_2D,kt,xt,It[0].width,It[0].height);for(let nt=0,P=It.length;nt<P;nt++)ut=It[nt],E.format!==Ne?Ht!==null?Wt?e.compressedTexSubImage2D(s.TEXTURE_2D,nt,0,0,ut.width,ut.height,Ht,ut.data):e.compressedTexImage2D(s.TEXTURE_2D,nt,xt,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Wt?e.texSubImage2D(s.TEXTURE_2D,nt,0,0,ut.width,ut.height,Ht,Ct,ut.data):e.texImage2D(s.TEXTURE_2D,nt,xt,ut.width,ut.height,0,Ht,Ct,ut.data)}else if(E.isDataArrayTexture)Wt?(ae&&e.texStorage3D(s.TEXTURE_2D_ARRAY,kt,xt,J.width,J.height,J.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,Ht,Ct,J.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,xt,J.width,J.height,J.depth,0,Ht,Ct,J.data);else if(E.isData3DTexture)Wt?(ae&&e.texStorage3D(s.TEXTURE_3D,kt,xt,J.width,J.height,J.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,Ht,Ct,J.data)):e.texImage3D(s.TEXTURE_3D,0,xt,J.width,J.height,J.depth,0,Ht,Ct,J.data);else if(E.isFramebufferTexture){if(ae)if(Wt)e.texStorage2D(s.TEXTURE_2D,kt,xt,J.width,J.height);else{let nt=J.width,P=J.height;for(let ot=0;ot<kt;ot++)e.texImage2D(s.TEXTURE_2D,ot,xt,nt,P,0,Ht,Ct,null),nt>>=1,P>>=1}}else if(It.length>0&&qt){Wt&&ae&&e.texStorage2D(s.TEXTURE_2D,kt,xt,It[0].width,It[0].height);for(let nt=0,P=It.length;nt<P;nt++)ut=It[nt],Wt?e.texSubImage2D(s.TEXTURE_2D,nt,0,0,Ht,Ct,ut):e.texImage2D(s.TEXTURE_2D,nt,xt,Ht,Ct,ut);E.generateMipmaps=!1}else Wt?(ae&&e.texStorage2D(s.TEXTURE_2D,kt,xt,J.width,J.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,Ht,Ct,J)):e.texImage2D(s.TEXTURE_2D,0,xt,Ht,Ct,J);x(E,qt)&&g(tt),pt.__version=et.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function _t(C,E,B){if(E.image.length!==6)return;const tt=j(C,E),Q=E.source;e.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+B);const et=n.get(Q);if(Q.version!==et.__version||tt===!0){e.activeTexture(s.TEXTURE0+B);const pt=Yt.getPrimaries(Yt.workingColorSpace),lt=E.colorSpace===$e?null:Yt.getPrimaries(E.colorSpace),ht=E.colorSpace===$e||pt===lt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ht);const wt=E.isCompressedTexture||E.image[0].isCompressedTexture,zt=E.image[0]&&E.image[0].isDataTexture,J=[];for(let nt=0;nt<6;nt++)!wt&&!zt?J[nt]=_(E.image[nt],!1,!0,i.maxCubemapSize):J[nt]=zt?E.image[nt].image:E.image[nt],J[nt]=Nt(E,J[nt]);const qt=J[0],Ht=m(qt)||o,Ct=a.convert(E.format,E.colorSpace),xt=a.convert(E.type),ut=M(E.internalFormat,Ct,xt,E.colorSpace),It=o&&E.isVideoTexture!==!0,Wt=et.__version===void 0||tt===!0;let ae=w(E,qt,Ht);V(s.TEXTURE_CUBE_MAP,E,Ht);let kt;if(wt){It&&Wt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,ae,ut,qt.width,qt.height);for(let nt=0;nt<6;nt++){kt=J[nt].mipmaps;for(let P=0;P<kt.length;P++){const ot=kt[P];E.format!==Ne?Ct!==null?It?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,0,0,ot.width,ot.height,Ct,ot.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,ut,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):It?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,0,0,ot.width,ot.height,Ct,xt,ot.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P,ut,ot.width,ot.height,0,Ct,xt,ot.data)}}}else{kt=E.mipmaps,It&&Wt&&(kt.length>0&&ae++,e.texStorage2D(s.TEXTURE_CUBE_MAP,ae,ut,J[0].width,J[0].height));for(let nt=0;nt<6;nt++)if(zt){It?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,J[nt].width,J[nt].height,Ct,xt,J[nt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,ut,J[nt].width,J[nt].height,0,Ct,xt,J[nt].data);for(let P=0;P<kt.length;P++){const rt=kt[P].image[nt].image;It?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,0,0,rt.width,rt.height,Ct,xt,rt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,ut,rt.width,rt.height,0,Ct,xt,rt.data)}}else{It?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,Ct,xt,J[nt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,ut,Ct,xt,J[nt]);for(let P=0;P<kt.length;P++){const ot=kt[P];It?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,0,0,Ct,xt,ot.image[nt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+nt,P+1,ut,Ct,xt,ot.image[nt])}}}x(E,Ht)&&g(s.TEXTURE_CUBE_MAP),et.__version=Q.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function gt(C,E,B,tt,Q,et){const pt=a.convert(B.format,B.colorSpace),lt=a.convert(B.type),ht=M(B.internalFormat,pt,lt,B.colorSpace);if(!n.get(E).__hasExternalTextures){const zt=Math.max(1,E.width>>et),J=Math.max(1,E.height>>et);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?e.texImage3D(Q,et,ht,zt,J,E.depth,0,pt,lt,null):e.texImage2D(Q,et,ht,zt,J,0,pt,lt,null)}e.bindFramebuffer(s.FRAMEBUFFER,C),ft(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,tt,Q,n.get(B).__webglTexture,0,Rt(E)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,tt,Q,n.get(B).__webglTexture,et),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Pt(C,E,B){if(s.bindRenderbuffer(s.RENDERBUFFER,C),E.depthBuffer&&!E.stencilBuffer){let tt=o===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(B||ft(E)){const Q=E.depthTexture;Q&&Q.isDepthTexture&&(Q.type===ln?tt=s.DEPTH_COMPONENT32F:Q.type===_n&&(tt=s.DEPTH_COMPONENT24));const et=Rt(E);ft(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,et,tt,E.width,E.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,et,tt,E.width,E.height)}else s.renderbufferStorage(s.RENDERBUFFER,tt,E.width,E.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,C)}else if(E.depthBuffer&&E.stencilBuffer){const tt=Rt(E);B&&ft(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,tt,s.DEPTH24_STENCIL8,E.width,E.height):ft(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,tt,s.DEPTH24_STENCIL8,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,E.width,E.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,C)}else{const tt=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let Q=0;Q<tt.length;Q++){const et=tt[Q],pt=a.convert(et.format,et.colorSpace),lt=a.convert(et.type),ht=M(et.internalFormat,pt,lt,et.colorSpace),wt=Rt(E);B&&ft(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,wt,ht,E.width,E.height):ft(E)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,wt,ht,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,ht,E.width,E.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ut(C,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),L(E.depthTexture,0);const tt=n.get(E.depthTexture).__webglTexture,Q=Rt(E);if(E.depthTexture.format===qn)ft(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,tt,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,tt,0);else if(E.depthTexture.format===wi)ft(E)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,tt,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function Et(C){const E=n.get(C),B=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!E.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Ut(E.__webglFramebuffer,C)}else if(B){E.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)e.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer[tt]),E.__webglDepthbuffer[tt]=s.createRenderbuffer(),Pt(E.__webglDepthbuffer[tt],C,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=s.createRenderbuffer(),Pt(E.__webglDepthbuffer,C,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function Vt(C,E,B){const tt=n.get(C);E!==void 0&&gt(tt.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),B!==void 0&&Et(C)}function O(C){const E=C.texture,B=n.get(C),tt=n.get(E);C.addEventListener("dispose",U),C.isWebGLMultipleRenderTargets!==!0&&(tt.__webglTexture===void 0&&(tt.__webglTexture=s.createTexture()),tt.__version=E.version,r.memory.textures++);const Q=C.isWebGLCubeRenderTarget===!0,et=C.isWebGLMultipleRenderTargets===!0,pt=m(C)||o;if(Q){B.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(o&&E.mipmaps&&E.mipmaps.length>0){B.__webglFramebuffer[lt]=[];for(let ht=0;ht<E.mipmaps.length;ht++)B.__webglFramebuffer[lt][ht]=s.createFramebuffer()}else B.__webglFramebuffer[lt]=s.createFramebuffer()}else{if(o&&E.mipmaps&&E.mipmaps.length>0){B.__webglFramebuffer=[];for(let lt=0;lt<E.mipmaps.length;lt++)B.__webglFramebuffer[lt]=s.createFramebuffer()}else B.__webglFramebuffer=s.createFramebuffer();if(et)if(i.drawBuffers){const lt=C.texture;for(let ht=0,wt=lt.length;ht<wt;ht++){const zt=n.get(lt[ht]);zt.__webglTexture===void 0&&(zt.__webglTexture=s.createTexture(),r.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&C.samples>0&&ft(C)===!1){const lt=et?E:[E];B.__webglMultisampledFramebuffer=s.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let ht=0;ht<lt.length;ht++){const wt=lt[ht];B.__webglColorRenderbuffer[ht]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,B.__webglColorRenderbuffer[ht]);const zt=a.convert(wt.format,wt.colorSpace),J=a.convert(wt.type),qt=M(wt.internalFormat,zt,J,wt.colorSpace,C.isXRRenderTarget===!0),Ht=Rt(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ht,qt,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ht,s.RENDERBUFFER,B.__webglColorRenderbuffer[ht])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(B.__webglDepthRenderbuffer=s.createRenderbuffer(),Pt(B.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){e.bindTexture(s.TEXTURE_CUBE_MAP,tt.__webglTexture),V(s.TEXTURE_CUBE_MAP,E,pt);for(let lt=0;lt<6;lt++)if(o&&E.mipmaps&&E.mipmaps.length>0)for(let ht=0;ht<E.mipmaps.length;ht++)gt(B.__webglFramebuffer[lt][ht],C,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+lt,ht);else gt(B.__webglFramebuffer[lt],C,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);x(E,pt)&&g(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(et){const lt=C.texture;for(let ht=0,wt=lt.length;ht<wt;ht++){const zt=lt[ht],J=n.get(zt);e.bindTexture(s.TEXTURE_2D,J.__webglTexture),V(s.TEXTURE_2D,zt,pt),gt(B.__webglFramebuffer,C,zt,s.COLOR_ATTACHMENT0+ht,s.TEXTURE_2D,0),x(zt,pt)&&g(s.TEXTURE_2D)}e.unbindTexture()}else{let lt=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(o?lt=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(lt,tt.__webglTexture),V(lt,E,pt),o&&E.mipmaps&&E.mipmaps.length>0)for(let ht=0;ht<E.mipmaps.length;ht++)gt(B.__webglFramebuffer[ht],C,E,s.COLOR_ATTACHMENT0,lt,ht);else gt(B.__webglFramebuffer,C,E,s.COLOR_ATTACHMENT0,lt,0);x(E,pt)&&g(lt),e.unbindTexture()}C.depthBuffer&&Et(C)}function Ae(C){const E=m(C)||o,B=C.isWebGLMultipleRenderTargets===!0?C.texture:[C.texture];for(let tt=0,Q=B.length;tt<Q;tt++){const et=B[tt];if(x(et,E)){const pt=C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,lt=n.get(et).__webglTexture;e.bindTexture(pt,lt),g(pt),e.unbindTexture()}}}function Mt(C){if(o&&C.samples>0&&ft(C)===!1){const E=C.isWebGLMultipleRenderTargets?C.texture:[C.texture],B=C.width,tt=C.height;let Q=s.COLOR_BUFFER_BIT;const et=[],pt=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,lt=n.get(C),ht=C.isWebGLMultipleRenderTargets===!0;if(ht)for(let wt=0;wt<E.length;wt++)e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,lt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,lt.__webglFramebuffer);for(let wt=0;wt<E.length;wt++){et.push(s.COLOR_ATTACHMENT0+wt),C.depthBuffer&&et.push(pt);const zt=lt.__ignoreDepthValues!==void 0?lt.__ignoreDepthValues:!1;if(zt===!1&&(C.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),ht&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,lt.__webglColorRenderbuffer[wt]),zt===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[pt]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[pt])),ht){const J=n.get(E[wt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,J,0)}s.blitFramebuffer(0,0,B,tt,0,0,B,tt,Q,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,et)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ht)for(let wt=0;wt<E.length;wt++){e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.RENDERBUFFER,lt.__webglColorRenderbuffer[wt]);const zt=n.get(E[wt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.TEXTURE_2D,zt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,lt.__webglMultisampledFramebuffer)}}function Rt(C){return Math.min(i.maxSamples,C.samples)}function ft(C){const E=n.get(C);return o&&C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function ie(C){const E=r.render.frame;h.get(C)!==E&&(h.set(C,E),C.update())}function Nt(C,E){const B=C.colorSpace,tt=C.format,Q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||C.format===Oa||B!==yn&&B!==$e&&(Yt.getTransfer(B)===Jt?o===!1?t.has("EXT_sRGB")===!0&&tt===Ne?(C.format=Oa,C.minFilter=ee,C.generateMipmaps=!1):E=cl.sRGBToLinear(E):(tt!==Ne||Q!==Ke)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),E}this.allocateTextureUnit=R,this.resetTextureUnits=K,this.setTexture2D=L,this.setTexture2DArray=N,this.setTexture3D=q,this.setTextureCube=W,this.rebindTextures=Vt,this.setupRenderTarget=O,this.updateRenderTargetMipmap=Ae,this.updateMultisampleRenderTarget=Mt,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=ft}function n0(s,t,e){const n=e.isWebGL2;function i(a,r=$e){let o;const l=Yt.getTransfer(r);if(a===Ke)return s.UNSIGNED_BYTE;if(a===tl)return s.UNSIGNED_SHORT_4_4_4_4;if(a===el)return s.UNSIGNED_SHORT_5_5_5_1;if(a===bc)return s.BYTE;if(a===Tc)return s.SHORT;if(a===qa)return s.UNSIGNED_SHORT;if(a===Qr)return s.INT;if(a===_n)return s.UNSIGNED_INT;if(a===ln)return s.FLOAT;if(a===Pn)return n?s.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(a===Ac)return s.ALPHA;if(a===Ne)return s.RGBA;if(a===Cc)return s.LUMINANCE;if(a===Rc)return s.LUMINANCE_ALPHA;if(a===qn)return s.DEPTH_COMPONENT;if(a===wi)return s.DEPTH_STENCIL;if(a===Oa)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(a===Ns)return s.RED;if(a===nl)return s.RED_INTEGER;if(a===Lc)return s.RG;if(a===il)return s.RG_INTEGER;if(a===sl)return s.RGBA_INTEGER;if(a===ta||a===ea||a===na||a===ia)if(l===Jt)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(a===ta)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(a===ea)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(a===na)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(a===ia)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(a===ta)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(a===ea)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(a===na)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(a===ia)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(a===vo||a===_o||a===xo||a===Mo)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(a===vo)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(a===_o)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(a===xo)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(a===Mo)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(a===al)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(a===yo||a===So)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(a===yo)return l===Jt?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(a===So)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(a===wo||a===Eo||a===bo||a===To||a===Ao||a===Co||a===Ro||a===Lo||a===Po||a===Do||a===Uo||a===Io||a===Fo||a===No)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(a===wo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(a===Eo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(a===bo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(a===To)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(a===Ao)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(a===Co)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(a===Ro)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(a===Lo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(a===Po)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(a===Do)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(a===Uo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(a===Io)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(a===Fo)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(a===No)return l===Jt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(a===sa||a===zo||a===Oo)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(a===sa)return l===Jt?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(a===zo)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(a===Oo)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(a===Pc||a===ko||a===Bo||a===Go)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(a===sa)return o.COMPRESSED_RED_RGTC1_EXT;if(a===ko)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(a===Bo)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(a===Go)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return a===Xn?n?s.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):s[a]!==void 0?s[a]:null}return{convert:i}}class i0 extends qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class en extends Oe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const s0={type:"move"};class Aa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new en,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new en,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new en,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,v=.005;c.inputState.pinching&&d>f+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&a!==null&&(i=a),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(s0)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new en;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class a0 extends Ti{constructor(t,e){super();const n=this;let i=null,a=1,r=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,v=null;const _=e.getContextAttributes();let m=null,p=null;const x=[],g=[],M=new Tt;let w=null;const y=new qe;y.layers.enable(1),y.viewport=new le;const A=new qe;A.layers.enable(2),A.viewport=new le;const U=[y,A],S=new i0;S.layers.enable(1),S.layers.enable(2);let b=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let j=x[V];return j===void 0&&(j=new Aa,x[V]=j),j.getTargetRaySpace()},this.getControllerGrip=function(V){let j=x[V];return j===void 0&&(j=new Aa,x[V]=j),j.getGripSpace()},this.getHand=function(V){let j=x[V];return j===void 0&&(j=new Aa,x[V]=j),j.getHandSpace()};function X(V){const j=g.indexOf(V.inputSource);if(j===-1)return;const st=x[j];st!==void 0&&(st.update(V.inputSource,V.frame,c||r),st.dispatchEvent({type:V.type,data:V.inputSource}))}function K(){i.removeEventListener("select",X),i.removeEventListener("selectstart",X),i.removeEventListener("selectend",X),i.removeEventListener("squeeze",X),i.removeEventListener("squeezestart",X),i.removeEventListener("squeezeend",X),i.removeEventListener("end",K),i.removeEventListener("inputsourceschange",R);for(let V=0;V<x.length;V++){const j=g[V];j!==null&&(g[V]=null,x[V].disconnect(j))}b=null,z=null,t.setRenderTarget(m),f=null,d=null,u=null,i=null,p=null,at.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){a=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return v},this.getSession=function(){return i},this.setSession=async function(V){if(i=V,i!==null){if(m=t.getRenderTarget(),i.addEventListener("select",X),i.addEventListener("selectstart",X),i.addEventListener("selectend",X),i.addEventListener("squeeze",X),i.addEventListener("squeezestart",X),i.addEventListener("squeezeend",X),i.addEventListener("end",K),i.addEventListener("inputsourceschange",R),_.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(M),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const j={antialias:i.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(i,e,j),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new sn(f.framebufferWidth,f.framebufferHeight,{format:Ne,type:Ke,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let j=null,st=null,_t=null;_.depth&&(_t=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,j=_.stencil?wi:qn,st=_.stencil?Xn:_n);const gt={colorFormat:e.RGBA8,depthFormat:_t,scaleFactor:a};u=new XRWebGLBinding(i,e),d=u.createProjectionLayer(gt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),p=new sn(d.textureWidth,d.textureHeight,{format:Ne,type:Ke,depthTexture:new to(d.textureWidth,d.textureHeight,st,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const Pt=t.properties.get(p);Pt.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await i.requestReferenceSpace(o),at.setContext(i),at.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function R(V){for(let j=0;j<V.removed.length;j++){const st=V.removed[j],_t=g.indexOf(st);_t>=0&&(g[_t]=null,x[_t].disconnect(st))}for(let j=0;j<V.added.length;j++){const st=V.added[j];let _t=g.indexOf(st);if(_t===-1){for(let Pt=0;Pt<x.length;Pt++)if(Pt>=g.length){g.push(st),_t=Pt;break}else if(g[Pt]===null){g[Pt]=st,_t=Pt;break}if(_t===-1)break}const gt=x[_t];gt&&gt.connect(st)}}const F=new D,L=new D;function N(V,j,st){F.setFromMatrixPosition(j.matrixWorld),L.setFromMatrixPosition(st.matrixWorld);const _t=F.distanceTo(L),gt=j.projectionMatrix.elements,Pt=st.projectionMatrix.elements,Ut=gt[14]/(gt[10]-1),Et=gt[14]/(gt[10]+1),Vt=(gt[9]+1)/gt[5],O=(gt[9]-1)/gt[5],Ae=(gt[8]-1)/gt[0],Mt=(Pt[8]+1)/Pt[0],Rt=Ut*Ae,ft=Ut*Mt,ie=_t/(-Ae+Mt),Nt=ie*-Ae;j.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Nt),V.translateZ(ie),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert();const C=Ut+ie,E=Et+ie,B=Rt-Nt,tt=ft+(_t-Nt),Q=Vt*Et/E*C,et=O*Et/E*C;V.projectionMatrix.makePerspective(B,tt,Q,et,C,E),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}function q(V,j){j===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(j.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(i===null)return;S.near=A.near=y.near=V.near,S.far=A.far=y.far=V.far,(b!==S.near||z!==S.far)&&(i.updateRenderState({depthNear:S.near,depthFar:S.far}),b=S.near,z=S.far);const j=V.parent,st=S.cameras;q(S,j);for(let _t=0;_t<st.length;_t++)q(st[_t],j);st.length===2?N(S,y,A):S.projectionMatrix.copy(y.projectionMatrix),W(V,S,j)};function W(V,j,st){st===null?V.matrix.copy(j.matrixWorld):(V.matrix.copy(st.matrixWorld),V.matrix.invert(),V.matrix.multiply(j.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(j.projectionMatrix),V.projectionMatrixInverse.copy(j.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=qi*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(V){l=V,d!==null&&(d.fixedFoveation=V),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=V)};let $=null;function Z(V,j){if(h=j.getViewerPose(c||r),v=j,h!==null){const st=h.views;f!==null&&(t.setRenderTargetFramebuffer(p,f.framebuffer),t.setRenderTarget(p));let _t=!1;st.length!==S.cameras.length&&(S.cameras.length=0,_t=!0);for(let gt=0;gt<st.length;gt++){const Pt=st[gt];let Ut=null;if(f!==null)Ut=f.getViewport(Pt);else{const Vt=u.getViewSubImage(d,Pt);Ut=Vt.viewport,gt===0&&(t.setRenderTargetTextures(p,Vt.colorTexture,d.ignoreDepthValues?void 0:Vt.depthStencilTexture),t.setRenderTarget(p))}let Et=U[gt];Et===void 0&&(Et=new qe,Et.layers.enable(gt),Et.viewport=new le,U[gt]=Et),Et.matrix.fromArray(Pt.transform.matrix),Et.matrix.decompose(Et.position,Et.quaternion,Et.scale),Et.projectionMatrix.fromArray(Pt.projectionMatrix),Et.projectionMatrixInverse.copy(Et.projectionMatrix).invert(),Et.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),gt===0&&(S.matrix.copy(Et.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),_t===!0&&S.cameras.push(Et)}}for(let st=0;st<x.length;st++){const _t=g[st],gt=x[st];_t!==null&&gt!==void 0&&gt.update(_t,j,c||r)}$&&$(V,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),v=null}const at=new xl;at.setAnimationLoop(Z),this.setAnimationLoop=function(V){$=V},this.dispose=function(){}}}function o0(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,gl(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,x,g,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),u(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p)):p.isMeshStandardMaterial?(a(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,M)):p.isMeshMatcapMaterial?(a(m,p),v(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),_(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,x,g):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ue&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ue&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p).envMap;if(x&&(m.envMap.value=x,m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const g=s._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*g,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,g){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=g*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ue&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function r0(s,t,e,n){let i={},a={},r=[];const o=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(x,g){const M=g.program;n.uniformBlockBinding(x,M)}function c(x,g){let M=i[x.id];M===void 0&&(v(x),M=h(x),i[x.id]=M,x.addEventListener("dispose",m));const w=g.program;n.updateUBOMapping(x,w);const y=t.render.frame;a[x.id]!==y&&(d(x),a[x.id]=y)}function h(x){const g=u();x.__bindingPointIndex=g;const M=s.createBuffer(),w=x.__size,y=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,w,y),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,g,M),M}function u(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const g=i[x.id],M=x.uniforms,w=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,g);for(let y=0,A=M.length;y<A;y++){const U=Array.isArray(M[y])?M[y]:[M[y]];for(let S=0,b=U.length;S<b;S++){const z=U[S];if(f(z,y,S,w)===!0){const X=z.__offset,K=Array.isArray(z.value)?z.value:[z.value];let R=0;for(let F=0;F<K.length;F++){const L=K[F],N=_(L);typeof L=="number"||typeof L=="boolean"?(z.__data[0]=L,s.bufferSubData(s.UNIFORM_BUFFER,X+R,z.__data)):L.isMatrix3?(z.__data[0]=L.elements[0],z.__data[1]=L.elements[1],z.__data[2]=L.elements[2],z.__data[3]=0,z.__data[4]=L.elements[3],z.__data[5]=L.elements[4],z.__data[6]=L.elements[5],z.__data[7]=0,z.__data[8]=L.elements[6],z.__data[9]=L.elements[7],z.__data[10]=L.elements[8],z.__data[11]=0):(L.toArray(z.__data,R),R+=N.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,X,z.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(x,g,M,w){const y=x.value,A=g+"_"+M;if(w[A]===void 0)return typeof y=="number"||typeof y=="boolean"?w[A]=y:w[A]=y.clone(),!0;{const U=w[A];if(typeof y=="number"||typeof y=="boolean"){if(U!==y)return w[A]=y,!0}else if(U.equals(y)===!1)return U.copy(y),!0}return!1}function v(x){const g=x.uniforms;let M=0;const w=16;for(let A=0,U=g.length;A<U;A++){const S=Array.isArray(g[A])?g[A]:[g[A]];for(let b=0,z=S.length;b<z;b++){const X=S[b],K=Array.isArray(X.value)?X.value:[X.value];for(let R=0,F=K.length;R<F;R++){const L=K[R],N=_(L),q=M%w;q!==0&&w-q<N.boundary&&(M+=w-q),X.__data=new Float32Array(N.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=M,M+=N.storage}}}const y=M%w;return y>0&&(M+=w-y),x.__size=M,x.__cache={},this}function _(x){const g={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(g.boundary=4,g.storage=4):x.isVector2?(g.boundary=8,g.storage=8):x.isVector3||x.isColor?(g.boundary=16,g.storage=12):x.isVector4?(g.boundary=16,g.storage=16):x.isMatrix3?(g.boundary=48,g.storage=48):x.isMatrix4?(g.boundary=64,g.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),g}function m(x){const g=x.target;g.removeEventListener("dispose",m);const M=r.indexOf(g.__bindingPointIndex);r.splice(M,1),s.deleteBuffer(i[g.id]),delete i[g.id],delete a[g.id]}function p(){for(const x in i)s.deleteBuffer(i[x]);r=[],i={},a={}}return{bind:l,update:c,dispose:p}}class bl{constructor(t={}){const{canvas:e=ih(),context:n=null,depth:i=!0,stencil:a=!0,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=r;const f=new Uint32Array(4),v=new Int32Array(4);let _=null,m=null;const p=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Me,this._useLegacyLights=!1,this.toneMapping=Ln,this.toneMappingExposure=1;const g=this;let M=!1,w=0,y=0,A=null,U=-1,S=null;const b=new le,z=new le;let X=null;const K=new vt(0);let R=0,F=e.width,L=e.height,N=1,q=null,W=null;const $=new le(0,0,F,L),Z=new le(0,0,F,L);let at=!1;const V=new Za;let j=!1,st=!1,_t=null;const gt=new Xt,Pt=new Tt,Ut=new D,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Vt(){return A===null?N:1}let O=n;function Ae(T,I){for(let G=0;G<T.length;G++){const H=T[G],k=e.getContext(H,I);if(k!==null)return k}return null}try{const T={alpha:!0,depth:i,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Xa}`),e.addEventListener("webglcontextlost",nt,!1),e.addEventListener("webglcontextrestored",P,!1),e.addEventListener("webglcontextcreationerror",ot,!1),O===null){const I=["webgl2","webgl","experimental-webgl"];if(g.isWebGL1Renderer===!0&&I.shift(),O=Ae(I,T),O===null)throw Ae(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&O instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),O.getShaderPrecisionFormat===void 0&&(O.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Mt,Rt,ft,ie,Nt,C,E,B,tt,Q,et,pt,lt,ht,wt,zt,J,qt,Ht,Ct,xt,ut,It,Wt;function ae(){Mt=new vf(O),Rt=new uf(O,Mt,t),Mt.init(Rt),ut=new n0(O,Mt,Rt),ft=new t0(O,Mt,Rt),ie=new Mf(O),Nt=new Bp,C=new e0(O,Mt,ft,Nt,Rt,ut,ie),E=new ff(g),B=new gf(g),tt=new Ah(O,Rt),It=new cf(O,Mt,tt,Rt),Q=new _f(O,tt,ie,It),et=new Ef(O,Q,tt,ie),Ht=new wf(O,Rt,C),zt=new df(Nt),pt=new kp(g,E,B,Mt,Rt,It,zt),lt=new o0(g,Nt),ht=new Hp,wt=new $p(Mt,Rt),qt=new lf(g,E,B,ft,et,d,l),J=new Qp(g,et,Rt),Wt=new r0(O,ie,Rt,ft),Ct=new hf(O,Mt,ie,Rt),xt=new xf(O,Mt,ie,Rt),ie.programs=pt.programs,g.capabilities=Rt,g.extensions=Mt,g.properties=Nt,g.renderLists=ht,g.shadowMap=J,g.state=ft,g.info=ie}ae();const kt=new a0(g,O);this.xr=kt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const T=Mt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Mt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(T){T!==void 0&&(N=T,this.setSize(F,L,!1))},this.getSize=function(T){return T.set(F,L)},this.setSize=function(T,I,G=!0){if(kt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=T,L=I,e.width=Math.floor(T*N),e.height=Math.floor(I*N),G===!0&&(e.style.width=T+"px",e.style.height=I+"px"),this.setViewport(0,0,T,I)},this.getDrawingBufferSize=function(T){return T.set(F*N,L*N).floor()},this.setDrawingBufferSize=function(T,I,G){F=T,L=I,N=G,e.width=Math.floor(T*G),e.height=Math.floor(I*G),this.setViewport(0,0,T,I)},this.getCurrentViewport=function(T){return T.copy(b)},this.getViewport=function(T){return T.copy($)},this.setViewport=function(T,I,G,H){T.isVector4?$.set(T.x,T.y,T.z,T.w):$.set(T,I,G,H),ft.viewport(b.copy($).multiplyScalar(N).floor())},this.getScissor=function(T){return T.copy(Z)},this.setScissor=function(T,I,G,H){T.isVector4?Z.set(T.x,T.y,T.z,T.w):Z.set(T,I,G,H),ft.scissor(z.copy(Z).multiplyScalar(N).floor())},this.getScissorTest=function(){return at},this.setScissorTest=function(T){ft.setScissorTest(at=T)},this.setOpaqueSort=function(T){q=T},this.setTransparentSort=function(T){W=T},this.getClearColor=function(T){return T.copy(qt.getClearColor())},this.setClearColor=function(){qt.setClearColor.apply(qt,arguments)},this.getClearAlpha=function(){return qt.getClearAlpha()},this.setClearAlpha=function(){qt.setClearAlpha.apply(qt,arguments)},this.clear=function(T=!0,I=!0,G=!0){let H=0;if(T){let k=!1;if(A!==null){const ct=A.texture.format;k=ct===sl||ct===il||ct===nl}if(k){const ct=A.texture.type,mt=ct===Ke||ct===_n||ct===qa||ct===Xn||ct===tl||ct===el,St=qt.getClearColor(),At=qt.getClearAlpha(),Ot=St.r,Lt=St.g,Dt=St.b;mt?(f[0]=Ot,f[1]=Lt,f[2]=Dt,f[3]=At,O.clearBufferuiv(O.COLOR,0,f)):(v[0]=Ot,v[1]=Lt,v[2]=Dt,v[3]=At,O.clearBufferiv(O.COLOR,0,v))}else H|=O.COLOR_BUFFER_BIT}I&&(H|=O.DEPTH_BUFFER_BIT),G&&(H|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",nt,!1),e.removeEventListener("webglcontextrestored",P,!1),e.removeEventListener("webglcontextcreationerror",ot,!1),ht.dispose(),wt.dispose(),Nt.dispose(),E.dispose(),B.dispose(),et.dispose(),It.dispose(),Wt.dispose(),pt.dispose(),kt.dispose(),kt.removeEventListener("sessionstart",Ce),kt.removeEventListener("sessionend",jt),_t&&(_t.dispose(),_t=null),Re.stop()};function nt(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function P(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const T=ie.autoReset,I=J.enabled,G=J.autoUpdate,H=J.needsUpdate,k=J.type;ae(),ie.autoReset=T,J.enabled=I,J.autoUpdate=G,J.needsUpdate=H,J.type=k}function ot(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function rt(T){const I=T.target;I.removeEventListener("dispose",rt),bt(I)}function bt(T){yt(T),Nt.remove(T)}function yt(T){const I=Nt.get(T).programs;I!==void 0&&(I.forEach(function(G){pt.releaseProgram(G)}),T.isShaderMaterial&&pt.releaseShaderCache(T))}this.renderBufferDirect=function(T,I,G,H,k,ct){I===null&&(I=Et);const mt=k.isMesh&&k.matrixWorld.determinant()<0,St=zl(T,I,G,H,k);ft.setMaterial(H,mt);let At=G.index,Ot=1;if(H.wireframe===!0){if(At=Q.getWireframeAttribute(G),At===void 0)return;Ot=2}const Lt=G.drawRange,Dt=G.attributes.position;let he=Lt.start*Ot,Be=(Lt.start+Lt.count)*Ot;ct!==null&&(he=Math.max(he,ct.start*Ot),Be=Math.min(Be,(ct.start+ct.count)*Ot)),At!==null?(he=Math.max(he,0),Be=Math.min(Be,At.count)):Dt!=null&&(he=Math.max(he,0),Be=Math.min(Be,Dt.count));const _e=Be-he;if(_e<0||_e===1/0)return;It.setup(k,H,St,G,At);let hn,se=Ct;if(At!==null&&(hn=tt.get(At),se=xt,se.setIndex(hn)),k.isMesh)H.wireframe===!0?(ft.setLineWidth(H.wireframeLinewidth*Vt()),se.setMode(O.LINES)):se.setMode(O.TRIANGLES);else if(k.isLine){let Bt=H.linewidth;Bt===void 0&&(Bt=1),ft.setLineWidth(Bt*Vt()),k.isLineSegments?se.setMode(O.LINES):k.isLineLoop?se.setMode(O.LINE_LOOP):se.setMode(O.LINE_STRIP)}else k.isPoints?se.setMode(O.POINTS):k.isSprite&&se.setMode(O.TRIANGLES);if(k.isBatchedMesh)se.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else if(k.isInstancedMesh)se.renderInstances(he,_e,k.count);else if(G.isInstancedBufferGeometry){const Bt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Ks=Math.min(G.instanceCount,Bt);se.renderInstances(he,_e,Ks)}else se.render(he,_e)};function $t(T,I,G){T.transparent===!0&&T.side===Ye&&T.forceSinglePass===!1?(T.side=Ue,T.needsUpdate=!0,ss(T,I,G),T.side=Mn,T.needsUpdate=!0,ss(T,I,G),T.side=Ye):ss(T,I,G)}this.compile=function(T,I,G=null){G===null&&(G=T),m=wt.get(G),m.init(),x.push(m),G.traverseVisible(function(k){k.isLight&&k.layers.test(I.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),T!==G&&T.traverseVisible(function(k){k.isLight&&k.layers.test(I.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),m.setupLights(g._useLegacyLights);const H=new Set;return T.traverse(function(k){const ct=k.material;if(ct)if(Array.isArray(ct))for(let mt=0;mt<ct.length;mt++){const St=ct[mt];$t(St,G,k),H.add(St)}else $t(ct,G,k),H.add(ct)}),x.pop(),m=null,H},this.compileAsync=function(T,I,G=null){const H=this.compile(T,I,G);return new Promise(k=>{function ct(){if(H.forEach(function(mt){Nt.get(mt).currentProgram.isReady()&&H.delete(mt)}),H.size===0){k(T);return}setTimeout(ct,10)}Mt.get("KHR_parallel_shader_compile")!==null?ct():setTimeout(ct,10)})};let Kt=null;function ve(T){Kt&&Kt(T)}function Ce(){Re.stop()}function jt(){Re.start()}const Re=new xl;Re.setAnimationLoop(ve),typeof self<"u"&&Re.setContext(self),this.setAnimationLoop=function(T){Kt=T,kt.setAnimationLoop(T),T===null?Re.stop():Re.start()},kt.addEventListener("sessionstart",Ce),kt.addEventListener("sessionend",jt),this.render=function(T,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),kt.enabled===!0&&kt.isPresenting===!0&&(kt.cameraAutoUpdate===!0&&kt.updateCamera(I),I=kt.getCamera()),T.isScene===!0&&T.onBeforeRender(g,T,I,A),m=wt.get(T,x.length),m.init(),x.push(m),gt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),V.setFromProjectionMatrix(gt),st=this.localClippingEnabled,j=zt.init(this.clippingPlanes,st),_=ht.get(T,p.length),_.init(),p.push(_),an(T,I,0,g.sortObjects),_.finish(),g.sortObjects===!0&&_.sort(q,W),this.info.render.frame++,j===!0&&zt.beginShadows();const G=m.state.shadowsArray;if(J.render(G,T,I),j===!0&&zt.endShadows(),this.info.autoReset===!0&&this.info.reset(),qt.render(_,T),m.setupLights(g._useLegacyLights),I.isArrayCamera){const H=I.cameras;for(let k=0,ct=H.length;k<ct;k++){const mt=H[k];io(_,T,mt,mt.viewport)}}else io(_,T,I);A!==null&&(C.updateMultisampleRenderTarget(A),C.updateRenderTargetMipmap(A)),T.isScene===!0&&T.onAfterRender(g,T,I),It.resetDefaultState(),U=-1,S=null,x.pop(),x.length>0?m=x[x.length-1]:m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function an(T,I,G,H){if(T.visible===!1)return;if(T.layers.test(I.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(I);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||V.intersectsSprite(T)){H&&Ut.setFromMatrixPosition(T.matrixWorld).applyMatrix4(gt);const mt=et.update(T),St=T.material;St.visible&&_.push(T,mt,St,G,Ut.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||V.intersectsObject(T))){const mt=et.update(T),St=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ut.copy(T.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),Ut.copy(mt.boundingSphere.center)),Ut.applyMatrix4(T.matrixWorld).applyMatrix4(gt)),Array.isArray(St)){const At=mt.groups;for(let Ot=0,Lt=At.length;Ot<Lt;Ot++){const Dt=At[Ot],he=St[Dt.materialIndex];he&&he.visible&&_.push(T,mt,he,G,Ut.z,Dt)}}else St.visible&&_.push(T,mt,St,G,Ut.z,null)}}const ct=T.children;for(let mt=0,St=ct.length;mt<St;mt++)an(ct[mt],I,G,H)}function io(T,I,G,H){const k=T.opaque,ct=T.transmissive,mt=T.transparent;m.setupLightsView(G),j===!0&&zt.setGlobalState(g.clippingPlanes,G),ct.length>0&&Nl(k,ct,I,G),H&&ft.viewport(b.copy(H)),k.length>0&&is(k,I,G),ct.length>0&&is(ct,I,G),mt.length>0&&is(mt,I,G),ft.buffers.depth.setTest(!0),ft.buffers.depth.setMask(!0),ft.buffers.color.setMask(!0),ft.setPolygonOffset(!1)}function Nl(T,I,G,H){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;const ct=Rt.isWebGL2;_t===null&&(_t=new sn(1,1,{generateMipmaps:!0,type:Mt.has("EXT_color_buffer_half_float")?Pn:Ke,minFilter:$n,samples:ct?4:0})),g.getDrawingBufferSize(Pt),ct?_t.setSize(Pt.x,Pt.y):_t.setSize(Gs(Pt.x),Gs(Pt.y));const mt=g.getRenderTarget();g.setRenderTarget(_t),g.getClearColor(K),R=g.getClearAlpha(),R<1&&g.setClearColor(16777215,.5),g.clear();const St=g.toneMapping;g.toneMapping=Ln,is(T,G,H),C.updateMultisampleRenderTarget(_t),C.updateRenderTargetMipmap(_t);let At=!1;for(let Ot=0,Lt=I.length;Ot<Lt;Ot++){const Dt=I[Ot],he=Dt.object,Be=Dt.geometry,_e=Dt.material,hn=Dt.group;if(_e.side===Ye&&he.layers.test(H.layers)){const se=_e.side;_e.side=Ue,_e.needsUpdate=!0,so(he,G,H,Be,_e,hn),_e.side=se,_e.needsUpdate=!0,At=!0}}At===!0&&(C.updateMultisampleRenderTarget(_t),C.updateRenderTargetMipmap(_t)),g.setRenderTarget(mt),g.setClearColor(K,R),g.toneMapping=St}function is(T,I,G){const H=I.isScene===!0?I.overrideMaterial:null;for(let k=0,ct=T.length;k<ct;k++){const mt=T[k],St=mt.object,At=mt.geometry,Ot=H===null?mt.material:H,Lt=mt.group;St.layers.test(G.layers)&&so(St,I,G,At,Ot,Lt)}}function so(T,I,G,H,k,ct){T.onBeforeRender(g,I,G,H,k,ct),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),k.onBeforeRender(g,I,G,H,T,ct),k.transparent===!0&&k.side===Ye&&k.forceSinglePass===!1?(k.side=Ue,k.needsUpdate=!0,g.renderBufferDirect(G,I,H,k,T,ct),k.side=Mn,k.needsUpdate=!0,g.renderBufferDirect(G,I,H,k,T,ct),k.side=Ye):g.renderBufferDirect(G,I,H,k,T,ct),T.onAfterRender(g,I,G,H,k,ct)}function ss(T,I,G){I.isScene!==!0&&(I=Et);const H=Nt.get(T),k=m.state.lights,ct=m.state.shadowsArray,mt=k.state.version,St=pt.getParameters(T,k.state,ct,I,G),At=pt.getProgramCacheKey(St);let Ot=H.programs;H.environment=T.isMeshStandardMaterial?I.environment:null,H.fog=I.fog,H.envMap=(T.isMeshStandardMaterial?B:E).get(T.envMap||H.environment),Ot===void 0&&(T.addEventListener("dispose",rt),Ot=new Map,H.programs=Ot);let Lt=Ot.get(At);if(Lt!==void 0){if(H.currentProgram===Lt&&H.lightsStateVersion===mt)return oo(T,St),Lt}else St.uniforms=pt.getUniforms(T),T.onBuild(G,St,g),T.onBeforeCompile(St,g),Lt=pt.acquireProgram(St,At),Ot.set(At,Lt),H.uniforms=St.uniforms;const Dt=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Dt.clippingPlanes=zt.uniform),oo(T,St),H.needsLights=kl(T),H.lightsStateVersion=mt,H.needsLights&&(Dt.ambientLightColor.value=k.state.ambient,Dt.lightProbe.value=k.state.probe,Dt.directionalLights.value=k.state.directional,Dt.directionalLightShadows.value=k.state.directionalShadow,Dt.spotLights.value=k.state.spot,Dt.spotLightShadows.value=k.state.spotShadow,Dt.rectAreaLights.value=k.state.rectArea,Dt.ltc_1.value=k.state.rectAreaLTC1,Dt.ltc_2.value=k.state.rectAreaLTC2,Dt.pointLights.value=k.state.point,Dt.pointLightShadows.value=k.state.pointShadow,Dt.hemisphereLights.value=k.state.hemi,Dt.directionalShadowMap.value=k.state.directionalShadowMap,Dt.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Dt.spotShadowMap.value=k.state.spotShadowMap,Dt.spotLightMatrix.value=k.state.spotLightMatrix,Dt.spotLightMap.value=k.state.spotLightMap,Dt.pointShadowMap.value=k.state.pointShadowMap,Dt.pointShadowMatrix.value=k.state.pointShadowMatrix),H.currentProgram=Lt,H.uniformsList=null,Lt}function ao(T){if(T.uniformsList===null){const I=T.currentProgram.getUniforms();T.uniformsList=Ds.seqWithValue(I.seq,T.uniforms)}return T.uniformsList}function oo(T,I){const G=Nt.get(T);G.outputColorSpace=I.outputColorSpace,G.batching=I.batching,G.instancing=I.instancing,G.instancingColor=I.instancingColor,G.skinning=I.skinning,G.morphTargets=I.morphTargets,G.morphNormals=I.morphNormals,G.morphColors=I.morphColors,G.morphTargetsCount=I.morphTargetsCount,G.numClippingPlanes=I.numClippingPlanes,G.numIntersection=I.numClipIntersection,G.vertexAlphas=I.vertexAlphas,G.vertexTangents=I.vertexTangents,G.toneMapping=I.toneMapping}function zl(T,I,G,H,k){I.isScene!==!0&&(I=Et),C.resetTextureUnits();const ct=I.fog,mt=H.isMeshStandardMaterial?I.environment:null,St=A===null?g.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:yn,At=(H.isMeshStandardMaterial?B:E).get(H.envMap||mt),Ot=H.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Lt=!!G.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Dt=!!G.morphAttributes.position,he=!!G.morphAttributes.normal,Be=!!G.morphAttributes.color;let _e=Ln;H.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(_e=g.toneMapping);const hn=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,se=hn!==void 0?hn.length:0,Bt=Nt.get(H),Ks=m.state.lights;if(j===!0&&(st===!0||T!==S)){const We=T===S&&H.id===U;zt.setState(H,T,We)}let oe=!1;H.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==Ks.state.version||Bt.outputColorSpace!==St||k.isBatchedMesh&&Bt.batching===!1||!k.isBatchedMesh&&Bt.batching===!0||k.isInstancedMesh&&Bt.instancing===!1||!k.isInstancedMesh&&Bt.instancing===!0||k.isSkinnedMesh&&Bt.skinning===!1||!k.isSkinnedMesh&&Bt.skinning===!0||k.isInstancedMesh&&Bt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Bt.instancingColor===!1&&k.instanceColor!==null||Bt.envMap!==At||H.fog===!0&&Bt.fog!==ct||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==zt.numPlanes||Bt.numIntersection!==zt.numIntersection)||Bt.vertexAlphas!==Ot||Bt.vertexTangents!==Lt||Bt.morphTargets!==Dt||Bt.morphNormals!==he||Bt.morphColors!==Be||Bt.toneMapping!==_e||Rt.isWebGL2===!0&&Bt.morphTargetsCount!==se)&&(oe=!0):(oe=!0,Bt.__version=H.version);let In=Bt.currentProgram;oe===!0&&(In=ss(H,I,k));let ro=!1,Li=!1,js=!1;const Se=In.getUniforms(),Fn=Bt.uniforms;if(ft.useProgram(In.program)&&(ro=!0,Li=!0,js=!0),H.id!==U&&(U=H.id,Li=!0),ro||S!==T){Se.setValue(O,"projectionMatrix",T.projectionMatrix),Se.setValue(O,"viewMatrix",T.matrixWorldInverse);const We=Se.map.cameraPosition;We!==void 0&&We.setValue(O,Ut.setFromMatrixPosition(T.matrixWorld)),Rt.logarithmicDepthBuffer&&Se.setValue(O,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Se.setValue(O,"isOrthographic",T.isOrthographicCamera===!0),S!==T&&(S=T,Li=!0,js=!0)}if(k.isSkinnedMesh){Se.setOptional(O,k,"bindMatrix"),Se.setOptional(O,k,"bindMatrixInverse");const We=k.skeleton;We&&(Rt.floatVertexTextures?(We.boneTexture===null&&We.computeBoneTexture(),Se.setValue(O,"boneTexture",We.boneTexture,C)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}k.isBatchedMesh&&(Se.setOptional(O,k,"batchingTexture"),Se.setValue(O,"batchingTexture",k._matricesTexture,C));const Zs=G.morphAttributes;if((Zs.position!==void 0||Zs.normal!==void 0||Zs.color!==void 0&&Rt.isWebGL2===!0)&&Ht.update(k,G,In),(Li||Bt.receiveShadow!==k.receiveShadow)&&(Bt.receiveShadow=k.receiveShadow,Se.setValue(O,"receiveShadow",k.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Fn.envMap.value=At,Fn.flipEnvMap.value=At.isCubeTexture&&At.isRenderTargetTexture===!1?-1:1),Li&&(Se.setValue(O,"toneMappingExposure",g.toneMappingExposure),Bt.needsLights&&Ol(Fn,js),ct&&H.fog===!0&&lt.refreshFogUniforms(Fn,ct),lt.refreshMaterialUniforms(Fn,H,N,L,_t),Ds.upload(O,ao(Bt),Fn,C)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ds.upload(O,ao(Bt),Fn,C),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Se.setValue(O,"center",k.center),Se.setValue(O,"modelViewMatrix",k.modelViewMatrix),Se.setValue(O,"normalMatrix",k.normalMatrix),Se.setValue(O,"modelMatrix",k.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const We=H.uniformsGroups;for(let Js=0,Bl=We.length;Js<Bl;Js++)if(Rt.isWebGL2){const lo=We[Js];Wt.update(lo,In),Wt.bind(lo,In)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return In}function Ol(T,I){T.ambientLightColor.needsUpdate=I,T.lightProbe.needsUpdate=I,T.directionalLights.needsUpdate=I,T.directionalLightShadows.needsUpdate=I,T.pointLights.needsUpdate=I,T.pointLightShadows.needsUpdate=I,T.spotLights.needsUpdate=I,T.spotLightShadows.needsUpdate=I,T.rectAreaLights.needsUpdate=I,T.hemisphereLights.needsUpdate=I}function kl(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(T,I,G){Nt.get(T.texture).__webglTexture=I,Nt.get(T.depthTexture).__webglTexture=G;const H=Nt.get(T);H.__hasExternalTextures=!0,H.__hasExternalTextures&&(H.__autoAllocateDepthBuffer=G===void 0,H.__autoAllocateDepthBuffer||Mt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,I){const G=Nt.get(T);G.__webglFramebuffer=I,G.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(T,I=0,G=0){A=T,w=I,y=G;let H=!0,k=null,ct=!1,mt=!1;if(T){const At=Nt.get(T);At.__useDefaultFramebuffer!==void 0?(ft.bindFramebuffer(O.FRAMEBUFFER,null),H=!1):At.__webglFramebuffer===void 0?C.setupRenderTarget(T):At.__hasExternalTextures&&C.rebindTextures(T,Nt.get(T.texture).__webglTexture,Nt.get(T.depthTexture).__webglTexture);const Ot=T.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(mt=!0);const Lt=Nt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Lt[I])?k=Lt[I][G]:k=Lt[I],ct=!0):Rt.isWebGL2&&T.samples>0&&C.useMultisampledRTT(T)===!1?k=Nt.get(T).__webglMultisampledFramebuffer:Array.isArray(Lt)?k=Lt[G]:k=Lt,b.copy(T.viewport),z.copy(T.scissor),X=T.scissorTest}else b.copy($).multiplyScalar(N).floor(),z.copy(Z).multiplyScalar(N).floor(),X=at;if(ft.bindFramebuffer(O.FRAMEBUFFER,k)&&Rt.drawBuffers&&H&&ft.drawBuffers(T,k),ft.viewport(b),ft.scissor(z),ft.setScissorTest(X),ct){const At=Nt.get(T.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+I,At.__webglTexture,G)}else if(mt){const At=Nt.get(T.texture),Ot=I||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,At.__webglTexture,G||0,Ot)}U=-1},this.readRenderTargetPixels=function(T,I,G,H,k,ct,mt){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=Nt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&mt!==void 0&&(St=St[mt]),St){ft.bindFramebuffer(O.FRAMEBUFFER,St);try{const At=T.texture,Ot=At.format,Lt=At.type;if(Ot!==Ne&&ut.convert(Ot)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Dt=Lt===Pn&&(Mt.has("EXT_color_buffer_half_float")||Rt.isWebGL2&&Mt.has("EXT_color_buffer_float"));if(Lt!==Ke&&ut.convert(Lt)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Lt===ln&&(Rt.isWebGL2||Mt.has("OES_texture_float")||Mt.has("WEBGL_color_buffer_float")))&&!Dt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=T.width-H&&G>=0&&G<=T.height-k&&O.readPixels(I,G,H,k,ut.convert(Ot),ut.convert(Lt),ct)}finally{const At=A!==null?Nt.get(A).__webglFramebuffer:null;ft.bindFramebuffer(O.FRAMEBUFFER,At)}}},this.copyFramebufferToTexture=function(T,I,G=0){const H=Math.pow(2,-G),k=Math.floor(I.image.width*H),ct=Math.floor(I.image.height*H);C.setTexture2D(I,0),O.copyTexSubImage2D(O.TEXTURE_2D,G,0,0,T.x,T.y,k,ct),ft.unbindTexture()},this.copyTextureToTexture=function(T,I,G,H=0){const k=I.image.width,ct=I.image.height,mt=ut.convert(G.format),St=ut.convert(G.type);C.setTexture2D(G,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,G.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,G.unpackAlignment),I.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,H,T.x,T.y,k,ct,mt,St,I.image.data):I.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,H,T.x,T.y,I.mipmaps[0].width,I.mipmaps[0].height,mt,I.mipmaps[0].data):O.texSubImage2D(O.TEXTURE_2D,H,T.x,T.y,mt,St,I.image),H===0&&G.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),ft.unbindTexture()},this.copyTextureToTexture3D=function(T,I,G,H,k=0){if(g.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ct=T.max.x-T.min.x+1,mt=T.max.y-T.min.y+1,St=T.max.z-T.min.z+1,At=ut.convert(H.format),Ot=ut.convert(H.type);let Lt;if(H.isData3DTexture)C.setTexture3D(H,0),Lt=O.TEXTURE_3D;else if(H.isDataArrayTexture||H.isCompressedArrayTexture)C.setTexture2DArray(H,0),Lt=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,H.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,H.unpackAlignment);const Dt=O.getParameter(O.UNPACK_ROW_LENGTH),he=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Be=O.getParameter(O.UNPACK_SKIP_PIXELS),_e=O.getParameter(O.UNPACK_SKIP_ROWS),hn=O.getParameter(O.UNPACK_SKIP_IMAGES),se=G.isCompressedTexture?G.mipmaps[k]:G.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,se.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,se.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,T.min.x),O.pixelStorei(O.UNPACK_SKIP_ROWS,T.min.y),O.pixelStorei(O.UNPACK_SKIP_IMAGES,T.min.z),G.isDataTexture||G.isData3DTexture?O.texSubImage3D(Lt,k,I.x,I.y,I.z,ct,mt,St,At,Ot,se.data):G.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),O.compressedTexSubImage3D(Lt,k,I.x,I.y,I.z,ct,mt,St,At,se.data)):O.texSubImage3D(Lt,k,I.x,I.y,I.z,ct,mt,St,At,Ot,se),O.pixelStorei(O.UNPACK_ROW_LENGTH,Dt),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,he),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Be),O.pixelStorei(O.UNPACK_SKIP_ROWS,_e),O.pixelStorei(O.UNPACK_SKIP_IMAGES,hn),k===0&&H.generateMipmaps&&O.generateMipmap(Lt),ft.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?C.setTextureCube(T,0):T.isData3DTexture?C.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?C.setTexture2DArray(T,0):C.setTexture2D(T,0),ft.unbindTexture()},this.resetState=function(){w=0,y=0,A=null,ft.reset(),It.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ya?"display-p3":"srgb",e.unpackColorSpace=Yt.workingColorSpace===qs?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Me?Yn:ol}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Yn?Me:yn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class l0 extends bl{}l0.prototype.isWebGL1Renderer=!0;class Qi extends Oe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Yi extends ze{constructor(t=null,e=1,n=1,i,a,r,o,l,c=de,h=de,u,d){super(null,r,o,l,c,h,i,a,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ha extends Ie{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const di=new Xt,Lr=new Xt,As=[],Pr=new Un,c0=new Xt,Fi=new te,Ni=new Ci;class Xi extends te{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ha(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,c0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Un),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,di),Pr.copy(t.boundingBox).applyMatrix4(di),this.boundingBox.union(Pr)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ci),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,di),Ni.copy(t.boundingSphere).applyMatrix4(di),this.boundingSphere.union(Ni)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(Fi.geometry=this.geometry,Fi.material=this.material,Fi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ni.copy(this.boundingSphere),Ni.applyMatrix4(n),t.ray.intersectsSphere(Ni)!==!1))for(let a=0;a<i;a++){this.getMatrixAt(a,di),Lr.multiplyMatrices(n,di),Fi.matrixWorld=Lr,Fi.raycast(t,As);for(let r=0,o=As.length;r<o;r++){const l=As[r];l.instanceId=a,l.object=this,e.push(l)}As.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ha(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class h0 extends ji{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new vt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Dr=new Xt,Va=new Ka,Cs=new Ci,Rs=new D;class Tl extends Oe{constructor(t=new ye,e=new h0){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,a=t.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Cs.copy(n.boundingSphere),Cs.applyMatrix4(i),Cs.radius+=a,t.ray.intersectsSphere(Cs)===!1)return;Dr.copy(i).invert(),Va.copy(t.ray).applyMatrix4(Dr);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,r.start),f=Math.min(c.count,r.start+r.count);for(let v=d,_=f;v<_;v++){const m=c.getX(v);Rs.fromBufferAttribute(u,m),Ur(Rs,m,l,i,t,e,this)}}else{const d=Math.max(0,r.start),f=Math.min(u.count,r.start+r.count);for(let v=d,_=f;v<_;v++)Rs.fromBufferAttribute(u,v),Ur(Rs,v,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=i.length;a<r;a++){const o=i[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Ur(s,t,e,n,i,a,r){const o=Va.distanceSqToPoint(s);if(o<e){const l=new D;Va.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,object:r})}}class eo extends ye{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const a=[],r=[];o(i),c(n),h(),this.setAttribute("position",new ne(a,3)),this.setAttribute("normal",new ne(a.slice(),3)),this.setAttribute("uv",new ne(r,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const g=new D,M=new D,w=new D;for(let y=0;y<e.length;y+=3)f(e[y+0],g),f(e[y+1],M),f(e[y+2],w),l(g,M,w,x)}function l(x,g,M,w){const y=w+1,A=[];for(let U=0;U<=y;U++){A[U]=[];const S=x.clone().lerp(M,U/y),b=g.clone().lerp(M,U/y),z=y-U;for(let X=0;X<=z;X++)X===0&&U===y?A[U][X]=S:A[U][X]=S.clone().lerp(b,X/z)}for(let U=0;U<y;U++)for(let S=0;S<2*(y-U)-1;S++){const b=Math.floor(S/2);S%2===0?(d(A[U][b+1]),d(A[U+1][b]),d(A[U][b])):(d(A[U][b+1]),d(A[U+1][b+1]),d(A[U+1][b]))}}function c(x){const g=new D;for(let M=0;M<a.length;M+=3)g.x=a[M+0],g.y=a[M+1],g.z=a[M+2],g.normalize().multiplyScalar(x),a[M+0]=g.x,a[M+1]=g.y,a[M+2]=g.z}function h(){const x=new D;for(let g=0;g<a.length;g+=3){x.x=a[g+0],x.y=a[g+1],x.z=a[g+2];const M=m(x)/2/Math.PI+.5,w=p(x)/Math.PI+.5;r.push(M,1-w)}v(),u()}function u(){for(let x=0;x<r.length;x+=6){const g=r[x+0],M=r[x+2],w=r[x+4],y=Math.max(g,M,w),A=Math.min(g,M,w);y>.9&&A<.1&&(g<.2&&(r[x+0]+=1),M<.2&&(r[x+2]+=1),w<.2&&(r[x+4]+=1))}}function d(x){a.push(x.x,x.y,x.z)}function f(x,g){const M=x*3;g.x=t[M+0],g.y=t[M+1],g.z=t[M+2]}function v(){const x=new D,g=new D,M=new D,w=new D,y=new Tt,A=new Tt,U=new Tt;for(let S=0,b=0;S<a.length;S+=9,b+=6){x.set(a[S+0],a[S+1],a[S+2]),g.set(a[S+3],a[S+4],a[S+5]),M.set(a[S+6],a[S+7],a[S+8]),y.set(r[b+0],r[b+1]),A.set(r[b+2],r[b+3]),U.set(r[b+4],r[b+5]),w.copy(x).add(g).add(M).divideScalar(3);const z=m(w);_(y,b+0,x,z),_(A,b+2,g,z),_(U,b+4,M,z)}}function _(x,g,M,w){w<0&&x.x===1&&(r[g]=x.x-1),M.x===0&&M.z===0&&(r[g]=w/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new eo(t.vertices,t.indices,t.radius,t.details)}}class no extends eo{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new no(t.radius,t.detail)}}class u0 extends ye{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class d0{constructor(t,e,n=0,i=1/0){this.ray=new Ka(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new ja,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Wa(t,this,n,e),n.sort(Ir),n}intersectObjects(t,e=!0,n=[]){for(let i=0,a=t.length;i<a;i++)Wa(t[i],this,n,e);return n.sort(Ir),n}}function Ir(s,t){return s.distance-t.distance}function Wa(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let a=0,r=i.length;a<r;a++)Wa(i[a],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Xa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Xa);const Ca=s=>Number.isInteger(s)?s.toFixed(1):String(s),je=`
#define WORLD ${Ca(Qt)}
#define HALF_WORLD ${Ca(Qt/2)}
#define HRES ${Ca(Hn)}
#define Y_PER_M ${nn}
#define PI 3.14159265
`,ts=`
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
`,es=`
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
`,Al=`
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
`,f0=`
${je}
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
`,p0=`
${je}
${ts}
${Kn}
${es}
${Al}
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
`,Fr=32,fi=7,Nr=1600;class m0{constructor(t,e){this.heights=t.height,this.N=Hn,this.leafSize=Qt/2**(fi-1),this.range0=22,this.buildMinMax();const n=new Yi(t.height,Hn,Hn,Ns,ln);n.minFilter=de,n.magFilter=de,n.needsUpdate=!0,this.heightTex=n;const i=new Yi(t.normals,Hn,Hn,Ne,Ke);i.minFilter=$n,i.magFilter=ee,i.generateMipmaps=!0,i.anisotropy=8,i.needsUpdate=!0,this.normalTex=i,this.full=this.makeGrid(Fr),this.half=this.makeGrid(Fr/2),this.morph=[];for(let r=0;r<8;r++)this.morph.push(new Tt);const a={...e.uniforms,uHeight:{value:n},uNormal:{value:i},uMorph:{value:this.morph},uCamPos:{value:new D},uDebug:{value:0}};this.uniforms=a,this.group=new en;for(const r of[this.full,this.half])r.material=new pe({vertexShader:f0,fragmentShader:p0,uniforms:{...a,uGrid:{value:r.dim}}}),r.mesh=new te(r.geometry,r.material),r.mesh.frustumCulled=!1,r.mesh.matrixAutoUpdate=!1,this.group.add(r.mesh);this._frustum=new Za,this._m=new Xt,this._box=new Un,this.setRange(this.range0)}makeGrid(t){const e=new u0,n=new Float32Array((t+1)*(t+1)*3);for(let o=0;o<=t;o++)for(let l=0;l<=t;l++){const c=(o*(t+1)+l)*3;n[c]=l/t,n[c+2]=o/t}const i=[];for(let o=0;o<t;o++)for(let l=0;l<t;l++){const c=o*(t+1)+l,h=c+1,u=c+t+1,d=u+1;l+o&1?i.push(c,u,h,h,u,d):i.push(c,u,d,c,d,h)}e.setIndex(i),e.setAttribute("position",new Ie(n,3));const a=new Float32Array(Nr*4),r=new Ha(a,4);return r.setUsage(Gi),e.setAttribute("aNode",r),e.instanceCount=0,{dim:t,geometry:e,data:a,attr:r,count:0}}buildMinMax(){const t=this.N,e=2**(fi-1),n=t/e;this.mm=[];let i=new Float32Array(e*e),a=new Float32Array(e*e);for(let o=0;o<e;o++)for(let l=0;l<e;l++){let c=1/0,h=-1/0;for(let u=o*n;u<=Math.min(t-1,(o+1)*n);u++)for(let d=l*n;d<=Math.min(t-1,(l+1)*n);d++){const f=this.heights[u*t+d];f<c&&(c=f),f>h&&(h=f)}i[o*e+l]=c,a[o*e+l]=h}this.mm.push({lo:i,hi:a,n:e});let r=e;for(;r>1;){const o=r/2,l=new Float32Array(o*o),c=new Float32Array(o*o);for(let h=0;h<o;h++)for(let u=0;u<o;u++){const d=2*h*r+2*u;l[h*o+u]=Math.min(i[d],i[d+1],i[d+r],i[d+r+1]),c[h*o+u]=Math.max(a[d],a[d+1],a[d+r],a[d+r+1])}i=l,a=c,r=o,this.mm.push({lo:i,hi:a,n:r})}}setRange(t){this.range0=t,this.ranges=[];for(let e=0;e<fi;e++)this.ranges.push(t*2**e);this.ranges[fi-1]=1e6;for(let e=0;e<fi;e++){const n=this.ranges[e],i=e>0?this.ranges[e-1]:0,a=i+(n-i)*.6;this.morph[e].set(a,n*.97)}}heightAt(t,e){return this.metresAt(t,e)*nn}metresAt(t,e){const n=this.N;let i=(t+Zt)/Qt*n-.5,a=(e+Zt)/Qt*n-.5;i<0&&(i=0),a<0&&(a=0),i>n-1.001&&(i=n-1.001),a>n-1.001&&(a=n-1.001);const r=i|0,o=a|0,l=i-r,c=a-o,h=this.heights,u=o*n+r,d=h[u]+(h[u+1]-h[u])*l,f=h[u+n]+(h[u+n+1]-h[u+n])*l;return d+(f-d)*c}normalAt(t,e,n=new D){const i=Qt/this.N,a=this.heightAt(t+i,e)-this.heightAt(t-i,e),r=this.heightAt(t,e+i)-this.heightAt(t,e-i);return n.set(-a,2*i,-r).normalize()}update(t){this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.uniforms.uCamPos.value.copy(t.position),this.full.count=0,this.half.count=0,this.select(0,0,fi-1);for(const e of[this.full,this.half])e.geometry.instanceCount=e.count,e.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],a=this.leafSize*2**n,r=-Zt+t*a,o=-Zt+e*a,l=i.lo[e*i.n+t]*nn,c=i.hi[e*i.n+t]*nn;return this._box.min.set(r,l,o),this._box.max.set(r+a,c,o+a),this._box}select(t,e,n){const i=this.nodeBox(t,e,n),a=this.mm[n];if(a.hi[e*a.n+t]<-45)return!0;if(i.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(i))return!0;const r=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,r,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,r,n),!0;for(let o=0;o<4;o++){const l=t*2+(o&1),c=e*2+(o>>1);if(!this.select(l,c,n-1)){const h=this.mm[n-1];if(h.hi[c*h.n+l]<-45)continue;const u=this.nodeBox(l,c,n-1);if(!this._frustum.intersectsBox(u))continue;this.emit(this.half,l,c,r/2,n)}}return!0}emit(t,e,n,i,a){if(t.count>=Nr)return;const r=t.count*4;t.data[r]=-Zt+e*i,t.data[r+1]=-Zt+n*i,t.data[r+2]=i,t.data[r+3]=a,t.count++}}const g0=`
${je}
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,v0=`
${je}
${ts}
${Kn}
${es}
${Al}
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
`;function _0(s,t,e,n){const i=[0,0,0];for(let o=0;o<=n;o++){const l=s*Math.pow(t/s,o/n);for(let c=0;c<e;c++){const h=c/e*Math.PI*2;i.push(Math.cos(h)*l,0,Math.sin(h)*l)}}const a=[];for(let o=0;o<e;o++)a.push(0,1+(o+1)%e,1+o);for(let o=0;o<n;o++)for(let l=0;l<e;l++){const c=1+o*e+l,h=1+o*e+(l+1)%e,u=c+e,d=h+e;a.push(c,h,u,h,d,u)}const r=new ye;return r.setAttribute("position",new ne(i,3)),r.setIndex(a),r}class x0{constructor(t,e,n){this.uniforms={...t.uniforms,uHeight:{value:e},uSea:{value:n},uCamPos:{value:new D},uWind:{value:new Tt(-.8,.45)},uSwellDir:{value:new Tt(-.6,.8)},uSwell:{value:.6},uDebug:{value:0},uHorizonColor:{value:new vt},uZenithColor:{value:new vt}};const i=_0(1.5,8e3,96,72);this.material=new pe({vertexShader:g0,fragmentShader:v0,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new te(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const M0=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],y0={ra:12.857,dec:27.13};function ns(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function An(s,t,e=0){let n=Math.imul(s|0,374761393)+Math.imul(t|0,668265263)+Math.imul(e|0,1442695041);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const S0=.5*(Math.sqrt(3)-1),zi=(3-Math.sqrt(3))/6,pi=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1,.7071,.7071,-.7071,.7071,.7071,-.7071,-.7071,-.7071]);function zr(s){const t=ns(s),e=new Uint8Array(256);for(let a=0;a<256;a++)e[a]=a;for(let a=255;a>0;a--){const r=Math.floor(t()*(a+1)),o=e[a];e[a]=e[r],e[r]=o}const n=new Uint8Array(512),i=new Uint8Array(512);for(let a=0;a<512;a++)n[a]=e[a&255],i[a]=n[a]%12;return function(r,o){const l=(r+o)*S0,c=Math.floor(r+l),h=Math.floor(o+l),u=(c+h)*zi,d=r-(c-u),f=o-(h-u);let v,_;d>f?(v=1,_=0):(v=0,_=1);const m=d-v+zi,p=f-_+zi,x=d-1+2*zi,g=f-1+2*zi,M=c&255,w=h&255;let y=0,A=.5-d*d-f*f;if(A>0){const b=i[M+n[w]]*2;A*=A,y+=A*A*(pi[b]*d+pi[b+1]*f)}let U=.5-m*m-p*p;if(U>0){const b=i[M+v+n[w+_]]*2;U*=U,y+=U*U*(pi[b]*m+pi[b+1]*p)}let S=.5-x*x-g*g;if(S>0){const b=i[M+1+n[w+1]]*2;S*=S,y+=S*S*(pi[b]*x+pi[b+1]*g)}return 70*y}}function w0(s,t,e,n,i=.5){let a=0,r=1,o=0,l=1;for(let c=0;c<n;c++)a+=r*s(t*l,e*l),o+=r,r*=i,l*=2.03;return a/o}const Us=(s,t,e)=>s<t?t:s>e?e:s,Or=(s,t,e)=>{const n=Us((e-s)/(t-s),0,1);return n*n*(3-2*n)},E0=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function $s(){const s=new ye;return s.setAttribute("position",new Ie(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const b0=`
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
`;class T0{constructor(t){this.renderer=t,this.size=new Tt;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?Pn:Ke,this.sceneRT=new sn(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new to(1,1,_n),this.quad=new te($s(),new pe({vertexShader:E0,fragmentShader:b0,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new Tt},uInvProj:{value:new Xt},uCamWorld:{value:new Xt},uCamPos:{value:new D},uSunDir:{value:new D(0,1,0)},uSunColor:{value:new vt},uFogColor:{value:new vt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new Qi,this.quadScene.add(this.quad),this.quadCam=new Ji(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const vn=Math.PI/180,Bi=21*vn,Ls=29.530588,A0=224.1,C0=["Hilo","Hoaka","Kūkahi","Kūlua","Kūkolu","Kūpau","ʻOlekūkahi","ʻOlekūlua","ʻOlekūkolu","ʻOlepau","Huna","Mōhalu","Hua","Akua","Hoku","Māhealani","Kulu","Lāʻaukūkahi","Lāʻaukūlua","Lāʻaupau","ʻOlekūkahi","ʻOlekūlua","ʻOlepau","Kāloakūkahi","Kāloakūlua","Kāloapau","Kāne","Lono","Mauli","Muku"];function kr(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),a=Math.sin(s)*Math.cos(Bi)-n*Math.cos(t)*Math.sin(Bi),r=Math.sin(s)*Math.sin(Bi)+n*Math.cos(t)*Math.cos(Bi);return e.set(i,r,-a)}function R0(s,t,e={}){const n=23.44*vn*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*vn,r=((s-80)/365.25*24%24+24)%24+t-12;e.sun=kr(n,(t-12)*15*vn,e.sun||new D);const o=s+t/24,l=((o-A0)%Ls+Ls)%Ls,c=l/Ls,h=i+c*2*Math.PI,u=Math.asin(Math.sin(23.44*vn)*Math.sin(h)+Math.sin(5.1*vn)*Math.sin(o*.23)),d=h/(2*Math.PI)*24;return e.moon=kr(u,(r-d)*15*vn,e.moon||new D),e.phase=c,e.night=Math.min(29,Math.floor(l)),e.illum=.5-.5*Math.cos(c*2*Math.PI),e.lst=r,e.decl=n,e}const Cl=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],Rl=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],L0=1.6110731556870734,P0=1.5;function D0(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((L0-Math.acos(s))/P0)))}function Ra(s,t,e,n=[0,0,0]){const i=D0(t.y),a=.2*e.turbidity*1e-17,r=Math.acos(Math.max(0,s.y)),o=1/(Math.cos(r)+.15*Math.pow(93.885-r*180/Math.PI,-1.253)),l=8400*o,c=1250*o,h=s.x*t.x+s.y*t.y+s.z*t.z,u=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),d=e.mieDirectionalG,f=d*d,v=1/(4*Math.PI)*((1-f)/Math.pow(1-2*d*h+f,1.5)),_=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let m=0;m<3;m++){const p=Cl[m]*e.rayleigh,x=.434*a*Rl[m]*e.mieCoefficient,g=Math.exp(-(p*l+x*c)),M=(p*u+x*v)/(p+x);let w=Math.pow(i*M*(1-g),1.5);w*=1+(Math.pow(i*M*g,.5)-1)*_;const y=.1*g,A=(w+y)*.04+[0,3e-4,75e-5][m];n[m]=Math.pow(A,1/2.4)}return n}function U0(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),a=.2*t.turbidity*1e-17;for(let r=0;r<3;r++){const o=Cl[r]*t.rayleigh,l=.434*a*Rl[r]*t.mieCoefficient;e[r]=Math.exp(-(o*8400*i+l*1250*i))}return e}const I0=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,Ll=`
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
`,F0=`
${Ll}
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
`,N0=`
${Ll}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,z0=`
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
`,O0=`
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
`;class k0{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=y0,e=(c,h)=>{const u=c/24*2*Math.PI,d=h*vn;return new D(Math.cos(d)*Math.cos(u),Math.cos(d)*Math.sin(u),Math.sin(d))};this.uniforms={uSun:{value:new D(0,1,0)},uMoon:{value:new D(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:Bi},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new te(new no(1,5),new pe({vertexShader:I0,fragmentShader:F0,uniforms:this.uniforms,side:Ue,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=ns(4242),a=M0.map(([c,h,u])=>[c/24*2*Math.PI,h*vn,u]);for(let c=0;c<2600;c++){const h=i()*2-1;a.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const r=new Float32Array(a.length*3);a.forEach((c,h)=>r.set(c,h*3));const o=new ye;o.setAttribute("aStar",new Ie(r,3)),o.setAttribute("position",new Ie(new Float32Array(a.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new Tl(o,new pe({vertexShader:z0,fragmentShader:O0,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:Da})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new en,this.group.add(n,this.stars),this.mapRT=new sn(256,128,{type:Pn,depthBuffer:!1}),this.mapRT.texture.wrapS=Si,this.mapScene=new Qi;const l=new te($s(),new pe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:N0,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));l.frustumCulled=!1,this.mapScene.add(l),this.mapCam=new Ji(-1,1,1,-1,0,1),this.astro={},this._v=new D}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const a=R0(t,e,this.astro),r=a.sun,o=this.uniforms;o.uSun.value.copy(r),o.uMoon.value.copy(a.moon),o.uPhase.value=a.phase,o.uIllum.value=a.illum,o.uLst.value=a.lst/24*2*Math.PI;const l=on.smoothstep(-r.y,-.02,.2);o.uNight.value=l,this.starUniforms.uNight.value=l,this.starUniforms.uTime.value=n;const c=this.params,h=this._v,u=Ra(h.set(0,1,0),r,c),d=[0,0,0];for(let y=0;y<8;y++){const A=y/8*Math.PI*2,U=Ra(h.set(Math.cos(A),.08,Math.sin(A)).normalize(),r,c);for(let S=0;S<3;S++)d[S]+=U[S]/8}const f=Ra(h.set(r.x,.05,r.z).normalize(),r,c),v=U0(r,c),_=on.smoothstep(r.y,-.04,.06),m=3.2;i.sunColor.setRGB(v[0]*m*_,v[1]*m*_,v[2]*m*_);const p=[.0035,.005,.011],g=on.smoothstep(a.moon.y,-.02,.1)*a.illum*l;i.skyColor.setRGB(u[0]*.55+d[0]*.45+p[0]+.012*g,u[1]*.55+d[1]*.45+p[1]+.016*g,u[2]*.55+d[2]*.45+p[2]+.024*g);const M=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new vt(M,M,M),.35),i.zenith.setRGB(u[0],u[1],u[2]),i.horizon.setRGB(d[0]+p[0],d[1]+p[1],d[2]+p[2]),i.sunHorizon.setRGB(f[0],f[1],f[2]);const w=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,r.y)+i.skyColor.r)*w*1.1,(i.sunColor.g*Math.max(0,r.y)+i.skyColor.g)*w,(i.sunColor.b*Math.max(0,r.y)+i.skyColor.b)*w*.8),i.moonColor.setRGB(.05*g,.06*g,.085*g),i.moonDir.copy(a.moon),i.sunDir.copy(r),i.night=l,a}}const La=Math.PI*2,B0=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,Br=s=>((s+Math.PI)%La+La)%La-Math.PI;class G0{constructor(t,e,n){this.camera=t,this.dom=e,this.terrain=n,this.state={target:new D(0,0,20),distance:420,yaw:.35,pitch:.62,lift:0},this.goal={target:this.state.target.clone(),distance:420,yaw:.35,pitch:.62,lift:0},this.flight=null,this.minDistance=.5,this.maxDistance=900,this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this._ray=new d0,this._v=new D,this.bind()}bind(){const t=this.dom,e=new Map;let n=null,i=null,a=null;t.addEventListener("contextmenu",o=>o.preventDefault()),t.addEventListener("pointerdown",o=>{this.enabled&&(t.setPointerCapture(o.pointerId),e.set(o.pointerId,{x:o.clientX,y:o.clientY}),e.size===1?(n=o.button===2||o.shiftKey||o.ctrlKey||o.metaKey?"pan":"orbit",i={x:o.clientX,y:o.clientY},this.panAnchor=n==="pan"?this.pickGround(o.clientX,o.clientY):null):e.size===2&&(n="pinch",a=this.pinchState(e)),this.touch())}),t.addEventListener("pointermove",o=>{if(e.has(o.pointerId)){if(e.set(o.pointerId,{x:o.clientX,y:o.clientY}),n==="orbit"&&i){const l=o.clientX-i.x,c=o.clientY-i.y;this.goal.yaw-=l*.005,this.goal.pitch=on.clamp(this.goal.pitch+c*.004,.06,1.52),i={x:o.clientX,y:o.clientY},this.touch()}else if(n==="pan"&&i)this.panBy(o.clientX-i.x,o.clientY-i.y),i={x:o.clientX,y:o.clientY},this.touch();else if(n==="pinch"&&e.size===2){const l=this.pinchState(e),c=a.dist/Math.max(20,l.dist);this.goal.distance=on.clamp(this.goal.distance*c,this.minDistance,this.maxDistance),this.panBy(l.cx-a.cx,l.cy-a.cy),this.goal.yaw-=Br(l.angle-a.angle),this.goal.pitch=on.clamp(this.goal.pitch+(l.cy-a.cy)*0,.06,1.52),a=l,this.touch()}}});const r=o=>{if(e.delete(o.pointerId),e.size===0)n=null;else if(e.size===1){const[l]=e.values();n="orbit",i={...l}}};t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r),t.addEventListener("wheel",o=>{if(!this.enabled)return;o.preventDefault();const l=Math.exp(Math.sign(o.deltaY)*Math.min(Math.abs(o.deltaY),120)*.0018);this.zoomAt(o.clientX,o.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",o=>{const l=this.pickGround(o.clientX,o.clientY);l&&this.flyTo({target:l,distance:Math.max(6,this.goal.distance*.45)},1.6)}),addEventListener("keydown",o=>{var h,u;if(!this.enabled||(u=(h=o.target).closest)!=null&&u.call(h,"input, textarea"))return;const l=this.goal.distance*.08,c={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]}[o.code];if(c&&!o.altKey){const d=Math.sin(this.goal.yaw),f=Math.cos(this.goal.yaw);this.goal.target.x+=(c[0]*f+c[1]*d)*l,this.goal.target.z+=(-c[0]*d+c[1]*f)*l,this.touch()}o.code==="KeyQ"&&(this.goal.yaw+=.12),o.code==="KeyE"&&(this.goal.yaw-=.12),(o.code==="Equal"||o.code==="NumpadAdd")&&(this.goal.distance*=.85),(o.code==="Minus"||o.code==="NumpadSubtract")&&(this.goal.distance/=.85)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,a=Math.sin(this.goal.yaw),r=Math.cos(this.goal.yaw),o=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*r-e*a*o)*i,this.goal.target.z+=(t*a-e*r*o)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),a=this.goal.distance,r=on.clamp(a*n,this.minDistance,this.maxDistance);if(i&&r<a){const o=1-r/a;this.goal.target.lerp(i,o)}this.goal.distance=r}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new Tt((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e,n=3e3){const i=(l,c)=>Math.max(0,this.terrain.heightAt(l,c));let a=0,r=0,o=this._v;for(let l=0;l<400&&a<n;l++){o.copy(t).addScaledVector(e,a);const c=o.y-i(o.x,o.z);if(c<0){let h=r,u=a;for(let d=0;d<20;d++){const f=(h+u)/2;o.copy(t).addScaledVector(e,f),o.y-i(o.x,o.z)<0?u=f:h=f}return o.clone()}r=a,a+=Math.max(.03,c*.45,a*.002)}return null}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift},a={target:t.target?t.target.clone():i.target.clone(),distance:t.distance??i.distance,yaw:t.yaw??i.yaw,pitch:t.pitch??i.pitch,lift:t.lift??0};a.yaw=i.yaw+Br(a.yaw-i.yaw);const r=i.target.distanceTo(a.target),o=n.hop??Math.max(0,r*.9-Math.max(i.distance,a.distance)*.6);this.flight={from:i,dest:a,t:0,duration:e,hop:o,onDone:n.onDone}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,(e=t.onDone)==null||e.call(t),this.apply()}update(t){var r;const e=this.goal;if(this.flight){const o=this.flight;o.t=Math.min(1,o.t+t/o.duration);const l=B0(o.t);e.target.lerpVectors(o.from.target,o.dest.target,l);const c=Math.log(o.from.distance)*(1-l)+Math.log(o.dest.distance)*l;e.distance=Math.exp(c)+o.hop*Math.sin(Math.PI*l),e.yaw=o.from.yaw+(o.dest.yaw-o.from.yaw)*l,e.pitch=o.from.pitch+(o.dest.pitch-o.from.pitch)*l+.25*Math.sin(Math.PI*l)*Math.min(1,o.hop/80),e.lift=o.from.lift+(o.dest.lift-o.from.lift)*l,o.t>=1&&(this.flight=null,(r=o.onDone)==null||r.call(o))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);e.target.x=on.clamp(e.target.x,-Zt*1.3,Zt*1.3),e.target.z=on.clamp(e.target.z,-Zt*1.3,Zt*1.3);const n=Math.max(0,this.terrain.heightAt(e.target.x,e.target.z));e.target.y+=(n-e.target.y)*Math.min(1,t*6);const i=this.state,a=this.flight?1:1-Math.exp(-t*7);i.target.lerp(e.target,a),i.distance+=(e.distance-i.distance)*a,i.yaw+=(e.yaw-i.yaw)*a,i.pitch+=(e.pitch-i.pitch)*a,i.lift+=(e.lift-i.lift)*a,this.apply()}apply(){const t=this.state,e=this.camera,n=Math.cos(t.pitch);e.position.set(t.target.x+t.distance*n*Math.sin(t.yaw),t.target.y+t.distance*Math.sin(t.pitch),t.target.z+t.distance*n*Math.cos(t.yaw));const i=Math.max(0,this.terrain.heightAt(e.position.x,e.position.z)),a=.12+t.distance*.03;e.position.y<i+a&&(e.position.y=i+a),this._v.copy(t.target),this._v.y+=t.lift*t.distance*.45,e.lookAt(this._v);const r=e.position.y-i;e.near=on.clamp(Math.min(r,t.distance)*.12,.02,4),e.far=9e3,e.updateProjectionMatrix()}}const H0=`
${je}
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
`;class V0{constructor(t,e=1024){this.rt=new sn(e,e,{type:Ke,depthBuffer:!1,minFilter:ee,magFilter:ee}),this.material=new pe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:H0,uniforms:{uHeight:{value:t},uSunDir:{value:new D(0,1,0)}},depthTest:!1,depthWrite:!1}),this.scene=new Qi;const n=new te($s(),this.material);n.frustumCulled=!1,this.scene.add(n),this.cam=new Ji(-1,1,1,-1,0,1),this.last=new D(0,-2,0)}get texture(){return this.rt.texture}update(t,e,n=!1){if(!n&&e.angleTo(this.last)<.004)return;this.last.copy(e),this.material.uniforms.uSunDir.value.copy(e);const i=t.getRenderTarget();t.setRenderTarget(this.rt),t.render(this.scene,this.cam),t.setRenderTarget(i)}}const W0=`
${je}
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
`;class X0{constructor(t){const e=new Ba(t.shape,t.shapeSize,t.shapeSize,t.shapeSize);e.format=Ns,e.minFilter=ee,e.magFilter=ee,e.wrapS=e.wrapT=e.wrapR=Si,e.unpackAlignment=1,e.needsUpdate=!0;const n=new Ba(t.detail,t.detailSize,t.detailSize,t.detailSize);n.format=Ns,n.minFilter=ee,n.magFilter=ee,n.wrapS=n.wrapT=n.wrapR=Si,n.unpackAlignment=1,n.needsUpdate=!0,this.scale=.5,this.rt=new sn(1,1,{type:Pn,depthBuffer:!1}),this.uniforms={uDepth:{value:null},uWeather:{value:null},uShape:{value:e},uDetail:{value:n},uWeatherRect:{value:new le},uInvProj:{value:new Xt},uCamWorld:{value:new Xt},uCamPos:{value:new D},uSunDir:{value:new D},uSunColor:{value:new vt},uSkyColor:{value:new vt},uGroundColor:{value:new vt},uFogColor:{value:new vt},uMoonDir:{value:new D},uMoonColor:{value:new vt},uWind:{value:new Tt},uWindDir:{value:new Tt(1,0)},uTime:{value:0},uBase:{value:8},uTop:{value:28},uDensity:{value:1},uFarCover:{value:.32},uOvercast:{value:0},uRainbow:{value:1},uSteps:{value:56},uLightSteps:{value:4},uFlash:{value:0},uFlashPos:{value:new D},uRes:{value:new Tt}},this.material=new pe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:W0,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new Qi;const i=new te($s(),this.material);i.frustumCulled=!1,this.scene.add(i),this.cam=new Ji(-1,1,1,-1,0,1),this.enabled=!0}get texture(){return this.rt.texture}setSize(t,e){this.full=[t,e],this.rt.setSize(Math.max(1,Math.floor(t*this.scale)),Math.max(1,Math.floor(e*this.scale))),this.uniforms.uRes.value.set(this.rt.width,this.rt.height)}setScale(t){Math.abs(t-this.scale)<.001||(this.scale=t,this.full&&this.setSize(...this.full))}render(t,e,n){const i=this.uniforms;i.uDepth.value=n,i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),t.setRenderTarget(this.rt),t.render(this.scene,this.cam)}}const Gr={moae:{name:"Moaʻe",gloss:"trade winds",bearing:62,speed:8.5,humidity:1,lcl:650,inversion:2150,patch:1,convect:.55},kona:{name:"Kona",gloss:"southerly storm",bearing:205,speed:11,humidity:1.45,lcl:420,inversion:4800,patch:1.6,convect:.8},malie:{name:"Mālie",gloss:"calm, sea breezes",bearing:110,speed:2.4,humidity:.85,lcl:900,inversion:2900,patch:.5,convect:1.5}},Fe=160,Oi=Qt*1.8;class q0{constructor(t,e,n=7){this.G=Fe,this.span=Oi,this.cell=Oi/Fe,this.origin=-Oi/2;const i=Fe*Fe;this.terrain=new Float32Array(i),this.land=new Float32Array(i),this.heat=new Float32Array(i);for(let a=0;a<Fe;a++)for(let r=0;r<Fe;r++){const o=this.origin+(r+.5)*this.cell,l=this.origin+(a+.5)*this.cell;let c=0,h=0,u=0;for(let f=-1;f<=1;f++)for(let v=-1;v<=1;v++){const _=o+v*this.cell*.5,m=l+f*this.cell*.5,p=Math.floor((_+Qt/2)/Qt*e),x=Math.floor((m+Qt/2)/Qt*e),g=p<0||x<0||p>=e||x>=e?-500:t[x*e+p];c+=Math.max(0,g),h=Math.max(h,g),u++}const d=a*Fe+r;this.terrain[d]=c/u,this.land[d]=h>0?1:0}this.qv=new Float32Array(i).fill(1),this.qc=new Float32Array(i),this.zp=new Float32Array(i),this.rain=new Float32Array(i),this.wet=new Float32Array(i),this.conv=new Float32Array(i),this.tmp=[new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i)],this.noise=zr(n),this.noise2=zr(n+1),this.mode="auto",this.regime="moae",this.state={...Gr.moae},this.wind=new Tt(...co(62)).multiplyScalar(8.5),this.windOffset=new Tt,this.simTime=0,this.nextChange=3600*30,this.rainTotal=0,this.data=new Float32Array(i*4),this.texture=new Yi(this.data,Fe,Fe,Ne,ln),this.texture.minFilter=ee,this.texture.magFilter=ee,this.texture.wrapS=this.texture.wrapT=Ve,this.texture.needsUpdate=!0,this.rect=new le(this.origin,this.origin,Oi,Oi),this.accum=0,this.boost=0}setMode(t){this.mode=t,t!=="auto"&&(this.regime=t)}pickRegime(t){const e=Math.random();return t==="hooilo"?e<.62?"moae":e<.8?"malie":"kona":e<.86?"moae":e<.97?"malie":"kona"}step(t,e,n,i){if(t<=0)return;if(this.simTime+=t,this.mode==="auto"&&this.simTime>this.nextChange){this.regime=this.pickRegime(i);const g=this.regime==="moae"?30+Math.random()*60:this.regime==="kona"?14+Math.random()*20:10+Math.random()*16;this.nextChange=this.simTime+g*3600}const a=Gr[this.regime],r=1-Math.exp(-t/7200),o=this.state;for(const g of["speed","humidity","lcl","inversion","patch","convect"]){let M=a[g];this.boost&&g==="humidity"&&(M*=1.18),this.boost&&g==="patch"&&(M*=1.6),o[g]+=(M-o[g])*r}let l=a.bearing-o.bearing;l=(l+540)%360-180,o.bearing+=l*r;const c=1+.18*Math.sin((n-9)/24*Math.PI*2),h=1+.12*this.noise(this.simTime/5400,3.3),u=o.bearing+9*this.noise(this.simTime/9e3,7.7),[d,f]=co(u),v=o.speed*c*h;this.wind.set(d*v,f*v);const _=d*v/100,m=f*v/100;this.windOffset.x+=_*t,this.windOffset.y+=m*t;const p=Math.hypot(_,m)*t,x=Math.max(1,Math.min(12,Math.ceil(p/(this.cell*1.5))));for(let g=0;g<x;g++)this.substep(t/x,_,m,e);this.pack()}substep(t,e,n,i){const a=Fe,r=this.cell,o=this.state,[l,c,h,u,d]=this.tmp,f=e*t/r,v=n*t/r,_=this.windOffset.x,m=this.windOffset.y;for(let M=0;M<a;M++)for(let w=0;w<a;w++){const y=M*a+w,A=w-f,U=M-v;if(A<0||U<0||A>a-1||U>a-1){const q=this.origin+(A+.5)*r-_,W=this.origin+(U+.5)*r-m,$=Math.hypot(e,n)||1,Z=(q*e+W*n)/$,at=(-q*n+W*e)/$,V=w0(this.noise2,Z/60,at/24,3);l[y]=o.humidity*(1+o.patch*.55*V),c[y]=Math.max(0,V-.05)*.75*o.patch,h[y]=0,u[y]=0,d[y]=0;continue}const S=Math.min(a-2,A|0),b=Math.min(a-2,U|0),z=A-S,X=U-b,K=b*a+S,R=(1-z)*(1-X),F=z*(1-X),L=(1-z)*X,N=z*X;l[y]=this.qv[K]*R+this.qv[K+1]*F+this.qv[K+a]*L+this.qv[K+a+1]*N,c[y]=this.qc[K]*R+this.qc[K+1]*F+this.qc[K+a]*L+this.qc[K+a+1]*N,h[y]=this.zp[K]*R+this.zp[K+1]*F+this.zp[K+a]*L+this.zp[K+a+1]*N,u[y]=this.conv[K]*R+this.conv[K+1]*F+this.conv[K+a]*L+this.conv[K+a+1]*N,d[y]=this.wet[y]}const p=Math.hypot(e,n)*t*100,x=Math.max(0,i)*o.convect,g=o.lcl;for(let M=0;M<a*a;M++){const w=this.terrain[M];let y=l[M],A=c[M];const U=h[M],S=Math.max(w,U-.24*p);if(S>U){const R=Math.max(0,S-Math.max(U,g)),F=Math.min(y,y*R/650);y-=F,A+=F}else if(S<U){const R=Math.min(A,(U-S)*(.0035*A+35e-5));A-=R,y+=R}let b=u[M]*Math.exp(-t/5400);if(this.land[M]){const R=x*Or(80,700,w)*(1-.6*Or(.85,1.2,o.humidity))*45e-7,F=Math.min(y*.2,R*t*y);y-=F,A+=F,b=Math.min(1,b+R*t*4)}else{y+=(o.humidity-y)*(1-Math.exp(-t/2400));const R=Math.max(0,y-o.humidity*1.12)*t*12e-5;y-=R,A+=R}const X=Math.max(0,A-.11)*(1-Math.exp(-t/1500));A-=X,A*=Math.exp(-t/21600);const K=X/Math.max(t,.001)*3600;this.rain[M]=this.rain[M]*.6+K*.4,d[M]=Us(d[M]*Math.exp(-t/(3600*5))+K*t/3600*3,0,1),this.qv[M]=y,this.qc[M]=A,this.zp[M]=S,this.conv[M]=b,this.wet[M]=d[M]}}pack(){const t=this.data;let e=0,n=0,i=0;for(let a=0;a<Fe*Fe;a++){const r=Us(this.qc[a]*4.2,0,1);t[a*4]=r;const o=Us(this.rain[a]*2.2,0,1);t[a*4+1]=o,t[a*4+2]=this.wet[a],t[a*4+3]=this.conv[a],this.land[a]&&(e+=o);const l=o*(.4+this.conv[a]);l>n&&(n=l,i=a)}this.rainTotal=e,this.stormiest={strength:n,x:this.origin+(i%Fe+.5)*this.cell,z:this.origin+(Math.floor(i/Fe)+.5)*this.cell},this.texture.needsUpdate=!0}spawnShower(t,e,n=6,i=.5){const a=this.G,r=(t-this.origin)/this.cell-.5,o=(e-this.origin)/this.cell-.5,l=n/this.cell;for(let c=Math.max(0,Math.floor(o-l));c<=Math.min(a-1,Math.ceil(o+l));c++)for(let h=Math.max(0,Math.floor(r-l));h<=Math.min(a-1,Math.ceil(r+l));h++){const u=Math.hypot(h-r,c-o)/l;if(u>1)continue;const d=c*a+h,f=(1-u*u)*i;this.qc[d]=Math.max(this.qc[d],.12+f*.3),this.rain[d]=Math.max(this.rain[d],f*.6),this.conv[d]=Math.max(this.conv[d],f)}this.pack()}warm(t,e,n,i){for(let a=0;a<t*3600;a+=600)this.step(600,e,n,i)}get base(){return this.state.lcl*nn}get top(){return this.state.inversion*nn}}const Te=.016,Y={plain:0,thatch:1,stone:2,leaf:3,kapa:5,wood:6,skin:7};class ke{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.xf=null,this.stack=[]}at(t,e,n,i=0,a=Te){this.stack.push(this.xf);const r=Math.cos(i),o=Math.sin(i);return this.xf=l=>[t+(l[0]*r-l[2]*o)*a,e+l[1]*a,n+(l[0]*o+l[2]*r)*a],this}done(){return this.xf=this.stack.pop()||null,this}get count(){return this.pos.length/3}tri(t,e,n,i,a=0,r=!0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const o=e[0]-t[0],l=e[1]-t[1],c=e[2]-t[2],h=n[0]-t[0],u=n[1]-t[1],d=n[2]-t[2];let f=l*d-c*u,v=c*h-o*d,_=o*u-l*h;const m=Math.hypot(f,v,_)||1;f/=m,v/=m,_/=m;for(const p of[t,e,n])this.pos.push(p[0],p[1],p[2]),this.nor.push(f,v,_),this.col.push(i[0],i[1],i[2]),this.mat.push(a)}quad(t,e,n,i,a,r=0){this.tri(t,e,n,a,r),this.tri(t,n,i,a,r)}box(t,e,n,i,a,r,o,l=0,c=0,h=1){const u=Math.cos(c),d=Math.sin(c),f=(M,w,y)=>[t+M*u-y*d,e+w,n+M*d+y*u],v=i/2,_=r/2,m=v*h,p=_*h,x=[f(-v,0,-_),f(v,0,-_),f(v,0,_),f(-v,0,_)],g=[f(-m,a,-p),f(m,a,-p),f(m,a,p),f(-m,a,p)];this.quad(g[0],g[3],g[2],g[1],o,l),this.quad(x[0],x[1],g[1],g[0],o,l),this.quad(x[1],x[2],g[2],g[1],o,l),this.quad(x[2],x[3],g[3],g[2],o,l),this.quad(x[3],x[0],g[0],g[3],o,l)}cyl(t,e,n,i,a,r=0,o=6,l=!1){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],h=Math.hypot(...c)||1,u=c.map(p=>p/h),d=Math.abs(u[1])<.9?[0,1,0]:[1,0,0];let f=[u[1]*d[2]-u[2]*d[1],u[2]*d[0]-u[0]*d[2],u[0]*d[1]-u[1]*d[0]];const v=Math.hypot(...f);f=f.map(p=>p/v);const _=[u[1]*f[2]-u[2]*f[1],u[2]*f[0]-u[0]*f[2],u[0]*f[1]-u[1]*f[0]],m=(p,x,g)=>{const M=g/o*Math.PI*2,w=Math.cos(M)*x,y=Math.sin(M)*x;return[p[0]+f[0]*w+_[0]*y,p[1]+f[1]*w+_[1]*y,p[2]+f[2]*w+_[2]*y]};for(let p=0;p<o;p++){const x=m(t,n,p),g=m(t,n,p+1),M=m(e,i,p),w=m(e,i,p+1);this.quad(x,g,w,M,a,r),l&&this.tri(e,M,w,a,r)}}blob(t,e,n,i,a,r,o,l=0,c=0,h=l===Y.leaf){const u=(1+Math.sqrt(5))/2,d=[[-1,u,0],[1,u,0],[-1,-u,0],[1,-u,0],[0,-1,u],[0,1,u],[0,-1,-u],[0,1,-u],[u,0,-1],[u,0,1],[-u,0,-1],[-u,0,1]],f=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],v=g=>.85+.3*Math.abs(Math.sin(g*12.9898+c*78.233)*43758.5453%1),_=d.map((g,M)=>{const w=Math.hypot(...g),y=v(M);return[t+g[0]/w*i*y,e+g[1]/w*a*y,n+g[2]/w*r*y]});if(!h){for(const g of f)this.tri(_[g[0]],_[g[1]],_[g[2]],o,l);return}const m=(g,M)=>{const w=[(g[0]+M[0])/2,(g[1]+M[1])/2,(g[2]+M[2])/2],y=[(w[0]-t)/i,(w[1]-e)/a,(w[2]-n)/r],A=Math.hypot(...y)||1,U=.9+.2*Math.abs(Math.sin(w[0]*91.7+w[2]*47.3+c)*43758.5453%1);return[t+y[0]/A*i*U,e+y[1]/A*a*U,n+y[2]/A*r*U]},p=g=>{const M=[(g[0]-t)/(i*i),(g[1]-e)/(a*a),(g[2]-n)/(r*r)],w=Math.hypot(...M)||1;return[M[0]/w,M[1]/w,M[2]/w]},x=(g,M,w)=>{const y=this.xf?[this.xf(g),this.xf(M),this.xf(w)]:[g,M,w],A=[p(g),p(M),p(w)];for(let U=0;U<3;U++)this.pos.push(...y[U]),this.nor.push(...A[U]),this.col.push(o[0],o[1],o[2]),this.mat.push(l)};for(const g of f){const M=_[g[0]],w=_[g[1]],y=_[g[2]],A=m(M,w),U=m(w,y),S=m(y,M);x(M,A,S),x(A,w,U),x(S,U,y),x(A,U,S)}}wall(t,e,n,i,a=Y.stone,r=.7){for(let o=0;o<t.length-1;o++){const l=t[o],c=t[o+1],h=c[0]-l[0],u=c[2]-l[2],d=Math.hypot(h,u)||1,f=-u/d,v=h/d,_=e/2,m=e*r/2,p=(b,z,X)=>[b[0]+f*z,b[1]+X,b[2]+v*z],x=p(l,-_,-n*.3),g=p(l,_,-n*.3),M=p(l,m,n),w=p(l,-m,n),y=p(c,-_,-n*.3),A=p(c,_,-n*.3),U=p(c,m,n),S=p(c,-m,n);this.quad(w,M,U,S,i,a),this.quad(g,A,U,M,i,a),this.quad(y,x,w,S,i,a)}}geometry(){const t=new ye;return t.setAttribute("position",new ne(this.pos,3)),t.setAttribute("normal",new ne(this.nor,3)),t.setAttribute("color",new ne(this.col,3)),t.setAttribute("aMat",new ne(this.mat,1)),t.computeBoundingSphere(),t}}function dt(s,t=0,e=Math.random){const n=new vt(s),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const Y0=`
${je}
in float aMat;
uniform float uTime;
uniform vec2 uWindVec;
uniform float uFadeNear;
uniform float uFadeFar;
uniform float uFadeClose;
out vec3 vWorld;
out vec3 vNormal;
out vec3 vColor;
out float vMat;
out vec3 vLocal;
out float vFade;
void main() {
  mat4 im = mat4(1.0);
  #ifdef USE_INSTANCING
  im = instanceMatrix;
  #endif
  vec3 p = position;
  vec4 wp = modelMatrix * im * vec4(p, 1.0);
  vec3 c = color;
  #ifdef USE_INSTANCING_COLOR
  c *= instanceColor;
  #endif
  if (aMat > 2.5 && aMat < 3.5) {
    // foliage sways with the wind, more toward the tips
    float h = max(p.y, 0.0);
    float ph = uTime * 1.9 + wp.x * 37.0 + wp.z * 23.0;
    float gust = 0.6 + 0.4 * sin(uTime * 0.7 + wp.x * 3.0);
    wp.xz += (uWindVec * (0.5 + 0.5 * sin(ph)) * gust + vec2(sin(ph * 1.3), cos(ph * 1.1)) * 0.15 * length(uWindVec)) * h * 0.012;
  }
  vWorld = wp.xyz;
  vNormal = normalize(mat3(modelMatrix * im) * normal);
  vColor = c;
  vMat = aMat;
  vLocal = p;
  float dist = distance(cameraPosition, wp.xyz);
  vFade = 1.0 - smoothstep(uFadeNear, uFadeFar, dist);
  // a tree right in front of the lens thins out rather than filling the view
  if (uFadeClose > 0.0) {
    vec3 origin = (modelMatrix * im * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vFade *= smoothstep(uFadeClose * 0.4, uFadeClose, distance(cameraPosition, origin));
  }
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,$0=`
${je}
${ts}
${Kn}
${es}
in vec3 vWorld;
in vec3 vNormal;
in vec3 vColor;
in float vMat;
in vec3 vLocal;
in float vFade;
uniform int uObjDebug;
void main() {
  if (vFade <= 0.0) discard;
  // dither out at the far end of the range instead of popping
  if (vFade < 1.0 && hash12(gl_FragCoord.xy) > vFade) discard;
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
  gl_FragColor = vec4(lit, 1.0);
}
`;function Vs(s,t={}){const[e,n]=t.fade||[120,160];return new pe({vertexShader:Y0,fragmentShader:$0,vertexColors:!0,side:t.doubleSide?Ye:Mn,uniforms:{...s.uniforms,uWindVec:s.uniforms.uWindVec||{value:new Tt(1,0)},uFadeNear:{value:e},uFadeFar:{value:n},uFadeClose:{value:t.close||0},uObjDebug:{value:0}}})}const ce={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",stoneDark:"#4f4844",wood:"#6b4a2f",koa:"#7a4a2a",kapa:"#efe8d8",salt:"#f2ece4"};function Is(s,t,e=7,n=4.6,i=5.2,a=!0){const r=dt(ce.thatch,.18,t),o=dt(ce.thatchDark,.15,t),l=dt(ce.stone,.15,t);s.box(0,-.6,0,e+1.8,1.05,n+1.8,l,Y.stone);const c=.45,h=c+1.05;s.box(0,c,0,e,h-c,n,r,Y.thatch);const u=e/2+.35,d=n/2+.45,f=c+i,v=[-u,h-.15,-d],_=[u,h-.15,-d],m=[-u,f,0],p=[u,f,0],x=[-u,h-.15,d],g=[u,h-.15,d];s.quad(v,m,p,_,r,Y.thatch),s.quad(g,p,m,x,r,Y.thatch),s.quad(_,p,m,v,o,Y.thatch),s.quad(x,m,p,g,o,Y.thatch);const M=e/2;if(s.tri([-M,h,-n/2],[-M,h,n/2],[-M,f-.2,0],r,Y.thatch),s.tri([M,h,n/2],[M,h,-n/2],[M,f-.2,0],r,Y.thatch),s.box(0,f-.12,0,e+.9,.35,.55,o,Y.thatch),a){const w=[.05,.035,.025];s.quad([M+.02,c,-.45],[M+.02,c,.45],[M+.02,c+1.4,.45],[M+.02,c+1.4,-.45],w,0)}}function Pl(s,t,e,n,i){const a=dt(ce.wood,.25,i);s.cyl([t,0,e],[t,n*.62,e],.22,.18,a,Y.wood,5),s.box(t,n*.6,e,.75,n*.28,.6,a,Y.wood,i()*.3,.85),s.box(t,n*.86,e,.35,n*.16,.35,a,Y.wood,0,.6)}function K0(s,t,e,n,i){const a=dt(ce.kapa,.05,i),r=dt(ce.wood,.2,i);s.box(t,0,e,2.6,n,2.6,a,Y.kapa,.1,.62);for(const[o,l]of[[-1.35,-1.35],[1.35,-1.35],[1.35,1.35],[-1.35,1.35]])s.cyl([t+o,0,e+l],[t+o*.55,n+.8,e+l*.55],.12,.08,r,Y.wood,4)}function j0(s,t,e,n){const i=dt(ce.wood,.2,n);for(const[a,r]of[[-.9,-.6],[.9,-.6],[.9,.6],[-.9,.6]])s.cyl([t+a,0,e+r],[t+a,2.6,e+r],.09,.08,i,Y.wood,4);s.box(t,2.5,e,2.2,.18,1.6,i,Y.wood),s.blob(t,2.85,e,.5,.25,.4,dt("#c9a35a",.2,n),Y.plain,1)}function Hr(s,t,e,n,i,a,r,o){const l=dt(ce.stone,.12,a),c=dt(ce.stoneDark,.12,a),h=r?44:26,u=r?30:18,d=r?3:2;s.at(t,e,n,i,o);let f=-1.5;for(let g=0;g<d;g++){const M=1-g*.14,w=(r?1.6:1.2)+(g===0?1.5:0);s.box(0,f,0,h*M,w,u*M,g%2?c:l,Y.stone),f+=w}const v=1-(d-1)*.14,_=h*v/2,m=u*v/2,p=r?2.2:1.5;s.box(0,f,-m+.8,h*v,p,1.6,c,Y.stone),s.box(0,f,m-.8,h*v,p,1.6,c,Y.stone),s.box(-_+.8,f,0,1.6,p,u*v,c,Y.stone),s.done(),s.at(t,e+f*o,n,i,o),K0(s,-_*.55,0,r?11:7.5,a);const x=r?7:4;for(let g=0;g<x;g++){const M=(g/(x-1)-.5)*1.6;Pl(s,-_*.55+Math.cos(M)*(r?8:5),Math.sin(M)*(r?8:5),r?4.2:3.2,a)}return j0(s,_*.15,0,a),s.done(),s.at(t+Math.cos(i)*_*.45*o-Math.sin(i)*m*.35*o,e+f*o,n+Math.sin(i)*_*.45*o+Math.cos(i)*m*.35*o,i,o),Is(s,a,r?8:6,r?5:4,r?6:4.5,!1),s.done(),f}function Dl(s,t,e=8){const n=dt(ce.koa,.2,t),i=dt("#4a2c18",.2,t),a=e/2;s.box(0,0,0,e*.8,.55,.62,n,Y.wood,0,.9),s.box(a*.85,.05,0,e*.2,.6,.4,i,Y.wood,0,.5),s.box(-a*.85,.05,0,e*.2,.55,.4,i,Y.wood,0,.5);const r=-2.4;for(const o of[-e*.15,e*.15])s.cyl([o,.55,0],[o,.5,r],.06,.06,i,Y.wood,4);s.box(0,.05,r,e*.5,.28,.24,i,Y.wood,0,.8)}function Ul(s,t,e=18){const n=dt(ce.koa,.15,t),i=dt("#4a2c18",.15,t);for(const r of[-2.2,2.2])s.box(0,0,r,e*.82,1,1,n,Y.wood,0,.88),s.box(e*.45,.2,r,e*.14,1.2,.6,i,Y.wood,0,.5),s.box(-e*.45,.2,r,e*.14,1.1,.6,i,Y.wood,0,.5);s.box(0,1,0,e*.42,.2,5.2,i,Y.wood),s.box(-e*.08,1.2,0,3.2,1.4,2.4,dt(ce.thatch,.1,t),Y.thatch,0,.7);const a=dt("#c9ac78",.08,t);s.cyl([e*.1,1.1,0],[e*.05,9.5,0],.12,.08,i,Y.wood,4),s.quad([e*.12,1.4,.05],[e*.36,8.8,.05],[e*.02,10.8,.05],[e*.05,4,.05],a,Y.plain),s.quad([e*.05,4,-.05],[e*.02,10.8,-.05],[e*.36,8.8,-.05],[e*.12,1.4,-.05],a,Y.plain)}function Z0(s,t,e=16,n=6){const i=dt(ce.thatch,.15,t),a=dt(ce.thatchDark,.15,t),r=dt(ce.wood,.2,t),o=4.8,l=e/2,c=n/2+.3;s.quad([-l,.3,-c],[-l,o,0],[l,o,0],[l,.3,-c],i,Y.thatch),s.quad([l,.3,c],[l,o,0],[-l,o,0],[-l,.3,c],i,Y.thatch),s.quad([l,.3,-c],[l,o,0],[-l,o,0],[-l,.3,-c],a,Y.thatch),s.quad([-l,.3,c],[-l,o,0],[l,o,0],[l,.3,c],a,Y.thatch),s.tri([-l,.3,c],[-l,.3,-c],[-l,o,0],i,Y.thatch),s.box(0,o-.1,0,e+.4,.3,.45,a,Y.thatch),s.cyl([l,0,0],[l,o,0],.15,.12,r,Y.wood,5)}function J0(s,t,e=!0){const n=dt(ce.stone,.2,t);for(let i=0;i<9;i++){const a=t()*Math.PI*2,r=1.4*(1-i/10);s.blob(Math.cos(a)*r*.5,i*.28,Math.sin(a)*r*.5,.75,.45,.7,n,Y.stone,i+t())}if(s.box(0,2.3,0,1.6,.25,1.3,dt("#5d5650",.1,t),Y.stone),e){const i=dt("#3b2a1e",.2,t);s.box(0,2.55,0,1,.75,.6,i,Y.wood,0,.8),s.box(.65,2.7,0,.5,.35,.35,i,Y.wood,0,.7),s.box(-.2,3.25,-.2,.15,.3,.12,i,Y.wood),s.box(-.2,3.25,.2,.15,.3,.12,i,Y.wood)}}function Q0(s,t,e=7){const n=dt(ce.wood,.1,t),i=dt(ce.kapa,.04,t);s.cyl([0,0,0],[0,e,0],.09,.07,n,Y.wood,5),s.cyl([0,e*.82,-1.6],[0,e*.82,1.6],.06,.06,n,Y.wood,4),s.quad([.02,e*.82,-1.5],[.02,e*.82,1.5],[.02,e*.3,1.3],[.02,e*.3,-1.3],i,Y.kapa),s.quad([-.02,e*.3,-1.3],[-.02,e*.3,1.3],[-.02,e*.82,1.5],[-.02,e*.82,-1.5],i,Y.kapa),s.box(0,e*.85,-1.55,.1,-1.6,.1,dt("#e2b13c",.1,t),Y.plain),s.box(0,e*.85,1.55,.1,-1.6,.1,dt("#e2b13c",.1,t),Y.plain),s.blob(0,e+.2,0,.35,.45,.35,dt("#3d2c1f",.1,t),Y.wood,2)}function tm(s,t){const e=dt(ce.stone,.2,t);s.box(0,-.3,0,3.2,.8,2.4,e,Y.stone,0,.85);for(let n=0;n<5;n++)s.blob((t()-.5)*1.4,.7+n*.25,(t()-.5)*1,.45,.3,.4,e,Y.stone,n);s.blob(0,2,0,.45,.35,.45,dt("#f3efe6",.05,t),Y.kapa,3)}function em(s,t){const e=dt("#4d4642",.2,t);for(let n=0;n<7;n++)s.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,Y.stone,n)}const nm=`
${je}
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
`,im=`
${je}
${ts}
${Kn}
${es}
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
`;class sm{constructor(t,e,n){this.group=new en;const i=[],a=[],r=[],o=new ke,l=dt("#5f8a3a",.15,Math.random),c=dt("#7a7a45",.1,Math.random),h=.06;for(const d of t.loi){for(const v of d.paddies){const _=(v.level+h)*nn,m=v.quad;for(const x of[0,1,2,0,2,3])i.push(m[x][0],_,m[x][1]),a.push(v.age),r.push(v.flood);const p=[...m,m[0]].map(x=>[x[0],_,x[1]]);o.wall(p,.011,.007,Math.random()<.8?l:c,Y.plain,.6)}const f=d.auwai;for(let v=0;v<f.length-1;v++){const _=f[v],m=f[v+1],p=m[0]-_[0],x=m[1]-_[1],g=Math.hypot(p,x)||1;if(g>1.2)continue;const M=-x/g*.012,w=p/g*.012,y=Math.max(e.heightAt(_[0],_[1]),_[2]*nn)+.002,A=Math.max(e.heightAt(m[0],m[1]),m[2]*nn)+.002,U=[[_[0]-M,y,_[1]-w],[m[0]-M,A,m[1]-w],[m[0]+M,A,m[1]+w],[_[0]+M,y,_[1]+w]];for(const S of[0,1,2,0,2,3])i.push(...U[S]),a.push(0),r.push(0)}}const u=new ye;u.setAttribute("position",new ne(i,3)),u.setAttribute("aAge",new ne(a,1)),u.setAttribute("aFlood",new ne(r,1)),u.computeBoundingSphere(),this.material=new pe({vertexShader:nm,fragmentShader:im,uniforms:{...n.uniforms},side:Ye,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2}),this.paddies=new te(u,this.material),this.group.add(this.paddies),this.banksGeometry=o.geometry()}}const Vr={noa:[7,4.6,5.2],mua:[8,5,5.6],aina:[6,4.2,4.6],kuku:[5,3.6,4],alii:[12,7,7.5]};class am{constructor(t){const{terrain:e,shared:n}=t,i=t.island.meta,a=i.sites;this.app=t,this.meta=i,this.sites=a,this.group=new en;const r=ns(i.seed+77),o=new ke,l=(c,h)=>Math.max(e.heightAt(c,h),0);for(const c of a.houses){const[h,u,d]=Vr[c.kind]||Vr.noa,f=c.scale||1;o.at(c.x,l(c.x,c.z),c.z,c.rot),Is(o,r,h*f,u*f,d*f),o.done()}for(const c of a.villages){const h=r()*Math.PI*2,u=c.x+Math.cos(h)*.35,d=c.z+Math.sin(h)*.35;o.at(u,l(u,d),d,0),em(o,r),o.done()}for(const c of a.heiau)Hr(o,c.x,l(c.x,c.z),c.z,c.rot,r,c.kind==="luakini",Te);this.beaches=[];for(const c of a.canoes){const h=c.dir,u=h+Math.PI/2;for(let d=0;d<c.n;d++){const f=(d-(c.n-1)/2)*.09,v=c.x+Math.cos(u)*f,_=c.z+Math.sin(u)*f;o.at(v,l(v,_)+.002,_,h),Dl(o,r,7+r()*4),o.done()}if(c.house){const d=c.x-Math.cos(h)*.32,f=c.z-Math.sin(h)*.32;o.at(d,l(d,f),f,h),Z0(o,r),o.done()}this.beaches.push(c)}if(a.alii){const c=a.canoes.find(h=>h.village===a.alii.id);if(c){const h=c.dir+Math.PI/2,u=c.x+Math.cos(h)*.45,d=c.z+Math.sin(h)*.45;o.at(u,l(u,d)+.002,d,c.dir),Ul(o,r),o.done()}}for(const c of a.koa)o.at(c.x,l(c.x,c.z),c.z,r()*6),tm(o,r),o.done();for(const c of i.ahu)o.at(c.x,l(c.x,c.z),c.z,r()*6),J0(o,r,!0),o.done();this.ponds=a.ponds,this.pondMask(t);for(const c of a.ponds)this.buildPond(o,c,r);a.puuhonua&&this.buildPuuhonua(o,a.puuhonua,r),a.holua&&this.buildHolua(o,a.holua,r);for(const c of a.saltpans)this.buildSalt(o,c,r);this.material=Vs(n,{fade:[70,110]}),this.structures=new te(o.geometry(),this.material),this.structures.frustumCulled=!1,this.group.add(this.structures),this.loi=new sm(a,e,n),this.group.add(this.loi.group),this.banks=new te(this.loi.banksGeometry,this.material),this.banks.frustumCulled=!1,this.group.add(this.banks)}pondMask(t){const e=cn,n=t.seaData,i=Qt/e;for(const a of this.ponds){const r=a.wall,o=r.map(f=>f[0]),l=r.map(f=>f[1]),c=Math.max(0,Math.floor((Math.min(...o)+Zt)/i)),h=Math.min(e-1,Math.ceil((Math.max(...o)+Zt)/i)),u=Math.max(0,Math.floor((Math.min(...l)+Zt)/i)),d=Math.min(e-1,Math.ceil((Math.max(...l)+Zt)/i));for(let f=u;f<=d;f++)for(let v=c;v<=h;v++){const _=-Zt+(v+.5)*i,m=-Zt+(f+.5)*i;om(r,_,m)&&(n[(f*e+v)*4]=255)}}t.seaTex.needsUpdate=!0}buildPond(t,e,n){const i=dt("#8a817a",.12,n),a=e.wall,r=a.length;let o=[];const l=()=>{o.length>1&&t.wall(o,.1,.024,i,Y.stone,.72),o=[]};for(let f=0;f<r;f++){const v=f/(r-1);if(e.gates.some(m=>Math.abs(m-v)<.022)){l();continue}o.push([a[f][0],0,a[f][1]])}l();const c=dt(ce.wood,.15,n);for(const f of e.gates){const v=Math.round(f*(r-1)),_=a[Math.max(0,v-1)],m=a[Math.min(r-1,v+1)],p=Math.atan2(m[1]-_[1],m[0]-_[0]),x=a[v][0],g=a[v][1];t.at(x,0,g,p);for(let M=-3;M<=3;M++)t.box(M*.55,-.4,0,.12,1.9,.12,c,Y.wood);t.box(0,1.25,0,4.2,.15,.2,c,Y.wood),t.done()}const h=Math.round(e.gates[0]*(r-1)),u=a[h][0]-e.ax*.12,d=a[h][1]-e.az*.12;t.at(u,.004,d,n()*3),Is(t,n,4,3,3.4),t.done()}buildPuuhonua(t,e,n){const{terrain:i}=this.app,a=e.dir,r=Math.cos(a),o=Math.sin(a),l=-o,c=r,h=e.x-r*1.6,u=e.z-o*1.6,d=g=>{for(let M=.3;M<9;M+=.15)if(i.heightAt(h+l*M*g,u+c*M*g)<=.002)return M;return 4},f=d(-1),v=d(1),_=[];for(let g=-f;g<=v;g+=.12){const M=h+l*g,w=u+c*g;_.push([M,Math.max(0,i.heightAt(M,w)),w])}const m=dt(ce.stoneDark,.1,n);t.wall(_,.08,.06,m,Y.stone,.8);const p=e.x-r*.5,x=e.z-o*.5;Hr(t,p,Math.max(0,i.heightAt(p,x)),x,a,n,!1,Te);for(let g=0;g<6;g++){const M=(g-2.5)*.12,w=e.x+l*M-r*.05,y=e.z+c*M-o*.05;t.at(w,Math.max(0,i.heightAt(w,y)),y,a),Pl(t,0,0,4,n),t.done()}for(let g=0;g<3;g++){const M=h+r*.5+l*(g-1)*.6,w=u+o*.5+c*(g-1)*.6;t.at(M,Math.max(0,i.heightAt(M,w)),w,a+Math.PI/2),Is(t,n,6,4,4.2),t.done()}this.puuhonuaWall={a:_[0],b:_[_.length-1]}}buildHolua(t,e,n){const{terrain:i}=this.app,a=Math.ceil(Math.hypot(e.x1-e.x0,e.z1-e.z0)/.08),r=[];for(let l=0;l<=a;l++){const c=l/a,h=e.x0+(e.x1-e.x0)*c,u=e.z0+(e.z1-e.z0)*c;r.push([h,i.heightAt(h,u)+.004,u])}t.wall(r,.11,.014,dt("#8a817a",.1,n),Y.stone,.75);const o=dt("#c2b25e",.1,n);for(let l=0;l<r.length-1;l++){const c=r[l],h=r[l+1],u=h[0]-c[0],d=h[2]-c[2],f=Math.hypot(u,d)||1,v=-d/f*.034,_=u/f*.034,m=c[1]+.0145,p=h[1]+.0145;t.quad([c[0]-v,m,c[2]-_],[c[0]+v,m,c[2]+_],[h[0]+v,p,h[2]+_],[h[0]-v,p,h[2]-_],o,Y.plain)}this.holuaPath=r}buildSalt(t,e,n){const{terrain:i}=this.app,a=e.dir+Math.PI/2,r=dt(ce.salt,.06,n),o=dt("#7d5b44",.12,n);for(let l=0;l<4;l++)for(let c=0;c<3;c++){const h=(l-1.5)*.11,u=(c-1)*.09,d=e.x+Math.cos(a)*h-Math.sin(a)*u,f=e.z+Math.sin(a)*h+Math.cos(a)*u,v=Math.max(i.heightAt(d,f),.004);t.at(d,v,f,a),t.box(0,-.3,0,6.6,.5,5.4,o,Y.plain),t.box(0,.05,0,5.8,.18,4.6,n()<.7?r:dt("#d9c2b4",.05,n),Y.kapa),t.done()}}}function om(s,t,e){let n=!1;for(let i=0,a=s.length-1;i<s.length;a=i++){const r=s[i],o=s[a];r[1]>e!=o[1]>e&&t<(o[0]-r[0])*(e-r[1])/(o[1]-r[1])+r[0]&&(n=!n)}return n}function rm(s){const t=new ke,e=dt("#8a7a62",.1,s),n=14;let i=[0,0,0];const a=.06;for(let h=1;h<=6;h++){const u=h/6*n,d=[a*Math.pow(u,1.5),u,0];t.cyl(i,d,.28-h*.02,.26-h*.025,e,Y.wood,6),i=d}const r=i,o=dt("#4c7a2c",.12,s),l=dt("#8f9a43",.1,s);for(let h=0;h<13;h++){const u=h/13*Math.PI*2+s()*.3,d=5.2+s()*1.2,f=1.4+s()*.8,v=Math.cos(u),_=Math.sin(u);let m=r;for(let p=1;p<=5;p++){const x=p/5,g=[r[0]+v*d*x,r[1]+f*x-3.8*x*x,r[2]+_*d*x],M=1*Math.sin(Math.PI*Math.min(1,x*1.1))+.15,w=-_*M,y=v*M,A=p>3?l:o;t.quad([m[0],m[1],m[2]],[g[0],g[1],g[2]],[g[0]+w,g[1]-.35*M,g[2]+y],[m[0]+w*.7,m[1]-.25*M,m[2]+y*.7],A,Y.leaf),t.quad([m[0]-w*.7,m[1]-.25*M,m[2]-y*.7],[g[0]-w,g[1]-.35*M,g[2]-y],[g[0],g[1],g[2]],[m[0],m[1],m[2]],A,Y.leaf),m=g}}const c=dt("#5c4a24",.1,s);for(let h=0;h<4;h++)t.blob(r[0]+Math.cos(h*1.7)*.4,r[1]-.6,r[2]+Math.sin(h*1.7)*.4,.3,.35,.3,c,Y.plain,h);return t.geometry()}function ki(s,{trunkH:t,crownR:e,color:n,trunkColor:i="#5a4636",blobs:a=3,flatten:r=1,red:o=0}){const l=new ke,c=dt(i,.1,s);l.cyl([0,0,0],[.3,t,.1],.35,.22,c,Y.wood,5);for(let h=0;h<a;h++){const u=h/a*Math.PI*2+s(),d=h===0?0:e*.45,f=dt(n,.18,s);l.blob(.3+Math.cos(u)*d,t+e*.35*r+(h===0?e*.2:0),.1+Math.sin(u)*d,e*(h===0?1:.75),e*.62*r,e*(h===0?1:.75),f,Y.leaf,h+s())}if(o>0){const h=dt("#9e2a22",.15,s);for(let u=0;u<o;u++){const d=s()*Math.PI*2,f=s()*.8;l.blob(.3+Math.cos(d)*e*.8,t+e*(.35+f*.45),.1+Math.sin(d)*e*.8,.7,.35,.7,h,Y.leaf,u)}}return l.geometry()}function lm(s){const t=new ke,e=dt("#6b5a45",.1,s),n=dt("#4f7036",.12,s);for(let i=0;i<4;i++){const a=i/4*Math.PI*2;t.cyl([Math.cos(a)*1.1,0,Math.sin(a)*1.1],[0,1.4,0],.08,.1,e,Y.wood,4)}t.cyl([0,1.2,0],[0,3.6,0],.22,.18,e,Y.wood,5);for(let i=0;i<3;i++){const a=i/3*Math.PI*2+.4,r=[Math.cos(a)*1.8,5.2,Math.sin(a)*1.8];t.cyl([0,3.5,0],r,.14,.1,e,Y.wood,4);for(let o=0;o<9;o++){const l=o/9*Math.PI*2,c=Math.cos(l),h=Math.sin(l),u=[r[0]+c*1.7,r[1]+.5-Math.abs(Math.sin(l))*.9,r[2]+h*1.7];t.tri([r[0]-h*.14,r[1],r[2]+c*.14],[r[0]+h*.14,r[1],r[2]-c*.14],u,n,Y.leaf)}}return t.geometry()}function cm(s){const t=new ke,e=dt("#7c9a4a",.1,s),n=dt("#6aa538",.12,s);for(let i=0;i<4;i++){const a=s()*Math.PI*2,r=s()*.6,o=Math.cos(a)*r,l=Math.sin(a)*r,c=2.4+s()*1.4;t.cyl([o,0,l],[o,c,l],.16,.12,e,Y.leaf,5);for(let h=0;h<4;h++){const u=s()*Math.PI*2,d=Math.cos(u),f=Math.sin(u),v=[o,c,l],_=[o+d*1.6,c+.7,l+f*1.6],m=[o+d*2.6,c-.2,l+f*2.6],p=-f*.45,x=d*.45;t.quad(v,[_[0]+p,_[1],_[2]+x],[m[0]+p*.6,m[1],m[2]+x*.6],m,n,Y.leaf),t.quad(v,m,[m[0]-p*.6,m[1],m[2]-x*.6],[_[0]-p,_[1],_[2]-x],n,Y.leaf)}}return t.geometry()}function Wr(s,t){const e=new ke,n=dt("#6b5a40",.1,s),i=dt(t?"#7d2b2f":"#3f7d32",.15,s);e.cyl([0,0,0],[.05,1.6,0],.05,.04,n,Y.wood,4);for(let a=0;a<9;a++){const r=a/9*Math.PI*2,o=Math.cos(r),l=Math.sin(r),c=.3+a%3*.25;e.quad([.05-l*.06,1.6,o*.06],[.05+l*.06,1.6,-o*.06],[.05+o*.9+l*.12,1.6+c,l*.9-o*.12],[.05+o*.9-l*.12,1.6+c,l*.9+o*.12],i,Y.leaf)}return e.geometry()}function Xr(s,t){const e=new ke;for(let n=0;n<3;n++)e.blob((s()-.5)*1.2,.5,(s()-.5)*1.2,.9,.7,.9,dt(t,.2,s),Y.leaf,n);return e.geometry()}const qr=["niu","hala","ulu","kukui","maia","ki","kiRed","ohia","koa","wiliwili","naupaka","aalii"];class hm{constructor(t){this.app=t;const e=ns(t.island.meta.seed+5150);this.geoms={niu:rm(e),hala:lm(e),ulu:ki(e,{trunkH:5,crownR:4.2,color:"#2f5a26",blobs:3}),kukui:ki(e,{trunkH:5,crownR:5.6,color:"#6f8a5c",trunkColor:"#7b7468",blobs:5}),maia:cm(e),ki:Wr(e,!1),kiRed:Wr(e,!0),ohia:ki(e,{trunkH:6,crownR:5.4,color:"#3a5e2c",trunkColor:"#4d4038",blobs:5,red:3}),koa:ki(e,{trunkH:10,crownR:7.5,color:"#5d7449",trunkColor:"#5b4a3a",blobs:5,flatten:.7}),wiliwili:ki(e,{trunkH:5,crownR:3.8,color:"#a3864a",trunkColor:"#8a7255",blobs:3,flatten:.8}),naupaka:Xr(e,"#5f8a42"),aalii:Xr(e,"#8b7c4a")},this.fixedMat=Vs(t.shared,{fade:[34,48],close:.7}),this.forestMat=Vs(t.shared,{fade:[10,13.5],close:.7}),this.group=new en,this.land=t.landTex.image.data,this.cleared=this.clearings(),this.fixed=this.placeFixed(e),this.meshes={};for(const n of qr){const i=this.fixed[n];if(!i.length)continue;const a=new Xi(this.geoms[n],this.fixedMat,i.length);this.writeInstances(a,i),a.frustumCulled=!1,this.group.add(a),this.meshes[n]=a}this.forest={};for(const n of["ohia","koa","kukui","wiliwili","aalii"]){const i=new Xi(this.geoms[n],this.forestMat,9e3);i.count=0,i.frustumCulled=!1,i.instanceMatrix.setUsage(Gi),this.group.add(i),this.forest[n]=i}this.tiles=new Map,this.lastCentre=new Tt(1e9,1e9)}clearings(){const t=cn,e=new Uint8Array(t*t),n=Qt/t,i=(r,o,l)=>{const c=Math.max(0,Math.floor((r-l+Zt)/n)),h=Math.min(t-1,Math.floor((r+l+Zt)/n)),u=Math.max(0,Math.floor((o-l+Zt)/n)),d=Math.min(t-1,Math.floor((o+l+Zt)/n));for(let f=u;f<=d;f++)for(let v=c;v<=h;v++)e[f*t+v]=1},a=this.app.island.meta.sites;for(const r of a.loi)for(const o of r.paddies)for(const l of o.quad)i(l[0],l[1],.05);for(const r of a.houses)i(r.x,r.z,.12);for(const r of a.heiau)i(r.x,r.z,.5);for(const r of a.villages)i(r.x,r.z,.3);for(const r of this.app.island.meta.ahu)i(r.x,r.z,.3);for(const r of a.koa)i(r.x,r.z,.15);return e}isCleared(t,e){const n=cn,i=Math.floor((t+Zt)/Qt*n),a=Math.floor((e+Zt)/Qt*n);return i>=0&&a>=0&&i<n&&a<n&&this.cleared[a*n+i]===1}landAt(t,e){const n=cn,i=Math.floor((t+Zt)/Qt*n),a=Math.floor((e+Zt)/Qt*n);if(i<0||a<0||i>=n||a>=n)return null;const r=(a*n+i)*4,o=this.land;return{rain:o[r]/255,sand:o[r+1]/255,rip:o[r+2]/255,field:o[r+3]/255}}writeInstances(t,e){const n=new Xt,i=new Dn,a=new D,r=new D,o=new vt,l=new D(0,1,0);for(let c=0;c<e.length;c++){const h=e[c];a.set(h.x,h.y,h.z),i.setFromAxisAngle(l,h.rot),r.setScalar(h.s),n.compose(a,i,r),t.setMatrixAt(c,n),o.setRGB(h.c,h.c*(.96+.08*(c*7%5)/5),h.c),t.setColorAt(c,o)}t.count=e.length,t.instanceMatrix.needsUpdate=!0,t.instanceColor&&(t.instanceColor.needsUpdate=!0)}placeFixed(t){const{terrain:e}=this.app,n=this.app.island.meta.sites,i=Object.fromEntries(qr.map(c=>[c,[]])),a=n.houses,r=(c,h,u)=>!a.some(d=>Math.abs(d.x-c)<u&&Math.abs(d.z-h)<u&&Math.hypot(d.x-c,d.z-h)<u),o=(c,h,u,d=1)=>{const f=e.heightAt(h,u);return f<=.003?!1:(i[c].push({x:h,y:f,z:u,rot:t()*Math.PI*2,s:Te*d*(.8+t()*.45),c:.85+t()*.3}),!0)};for(const c of n.villages){const h=c.alii?26:c.model?20:12;for(let u=0;u<h;u++){const d=t()*Math.PI*2,f=.12+t()*.7,v=c.x+Math.cos(d)*f,_=c.z+Math.sin(d)*f;if(!r(v,_,.09))continue;const m=this.landAt(v,_),p=m&&m.sand>.3||t()<.3?"niu":t()<.4?"ulu":t()<.5?"kukui":"maia";o(p,v,_)}for(let u=0;u<(c.model?24:10);u++){const d=a[Math.floor(t()*a.length)];if(d.village!==c.id)continue;const f=t()*Math.PI*2;o(t()<.75?"ki":"kiRed",d.x+Math.cos(f)*.08,d.z+Math.sin(f)*.08,.9)}}const l=this.app.island.meta.trail;for(let c=0;c<l.length;c++){const h=l[c];for(let u=0;u<3;u++){const d=h[0]+(t()-.5)*2.6,f=h[1]+(t()-.5)*2.6,v=this.landAt(d,f);if(!v)continue;const _=e.heightAt(d,f);_<=.003||_>.4||(v.sand>.4&&t()<.5?o("naupaka",d,f,.8):v.rain>.42&&t()<.5?o("hala",d,f):t()<.45?o("niu",d,f):v.rain<.3&&t()<.5&&o("aalii",d,f,.8))}}for(const c of n.loi)for(let h=0;h<c.paddies.length;h+=2){const u=c.paddies[h].quad,d=(u[2][0]+u[3][0])/2,f=(u[2][1]+u[3][1])/2,v=u[3][0]-u[0][0],_=u[3][1]-u[0][1],m=Math.hypot(v,_)||1,p=d+v/m*.06,x=f+_/m*.06,g=t();g<.3?o("maia",p,x):g<.5?o("kukui",p+v/m*.1,x+_/m*.1):g<.75&&o(t()<.8?"ki":"kiRed",p,x,.9)}return i}tile(t,e){const n=t*4096+e;let i=this.tiles.get(n);if(i)return i;const{terrain:a}=this.app,r=4,o=.17;i={ohia:[],koa:[],kukui:[],wiliwili:[],aalii:[]};const l=Math.round(r/o);for(let c=0;c<l;c++)for(let h=0;h<l;h++){const u=An(t*l+c,e*l+h,11),d=An(t*l+c,e*l+h,12),f=t*r+(c+u)*o,v=e*r+(h+d)*o,_=this.landAt(f,v);if(!_||_.sand>.2||_.field>.3||this.isCleared(f,v))continue;const m=a.metresAt(f,v);if(m<3)continue;const p=_.rain+(An(c,h,t*31+e)-.5)*.12,x=Math.min(1,Math.max(0,(p-.3)/.22)),g=An(t*l+c,e*l+h,13);let M=null;if(g<x*.85?_.rip>.4&&m<450&&g<.5?M="kukui":m>600&&p>.45?M=An(c,h,7)<.7?"ohia":"koa":m>350?M=An(c,h,8)<.55?"koa":"ohia":M=p>.5?"ohia":"kukui":p<.3&&g<.08&&(M=m<500&&An(c,h,9)<.5?"wiliwili":"aalii"),!M)continue;const w=a.heightAt(f,v);a.normalAt(f,v).y<.35&&An(c,h,5)<.7||i[M].push({x:f,y:w,z:v,rot:u*6.28,s:Te*(.75+d*.6)*(M==="aalii"?.8:1),c:.82+g*.35})}return this.tiles.set(n,i),i}update(t){const e=t.position,n=Math.max(0,this.app.terrain.heightAt(e.x,e.z)),i=e.y-n,a=i<14;for(const f in this.forest)this.forest[f].visible=a;for(const f in this.meshes)this.meshes[f].visible=i<60;if(!a||this.lastCentre.distanceTo(new Tt(e.x,e.z))<1.2)return;this.lastCentre.set(e.x,e.z);const r=4,o=14,l={ohia:[],koa:[],kukui:[],wiliwili:[],aalii:[]},c=Math.floor((e.x-o)/r),h=Math.floor((e.x+o)/r),u=Math.floor((e.z-o)/r),d=Math.floor((e.z+o)/r);for(let f=c;f<=h;f++)for(let v=u;v<=d;v++){const _=this.tile(f,v);for(const m in _)for(const p of _[m])Math.abs(p.x-e.x)>o||Math.abs(p.z-e.z)>o||l[m].push(p)}for(const f in l){const v=this.forest[f],_=l[f].slice(0,v.instanceMatrix.count);this.writeInstances(v,_)}this.tiles.size>400&&this.tiles.clear()}}function Yr(s,t){const e=new ke,n=dt("#7a4b30",.1,t),i=dt("#b08a5a",.15,t);return s==="stand"?(e.box(-.12,0,0,.16,.85,.18,n,Y.skin,0,.8),e.box(.12,0,0,.16,.85,.18,n,Y.skin,0,.8),e.box(0,.78,0,.42,.32,.26,i,Y.plain),e.box(0,1.05,0,.44,.5,.24,n,Y.skin,0,.85),e.box(-.3,.88,0,.11,.62,.12,n,Y.skin),e.box(.3,.88,0,.11,.62,.12,n,Y.skin),e.blob(0,1.68,0,.13,.15,.13,dt("#3a2418",.1,t),Y.skin,1,!1)):s==="bend"?(e.box(-.12,0,0,.16,.8,.18,n,Y.skin,0,.8),e.box(.12,0,0,.16,.8,.18,n,Y.skin,0,.8),e.box(0,.72,.05,.42,.3,.3,i,Y.plain),e.quad([-.22,.95,.05],[.22,.95,.05],[.2,1.05,.62],[-.2,1.05,.62],n,Y.skin),e.quad([-.2,.8,.62],[.2,.8,.62],[.22,.75,.05],[-.22,.75,.05],n,Y.skin),e.box(0,.78,.62,.4,.27,.1,n,Y.skin),e.box(-.24,.35,.6,.1,.5,.1,n,Y.skin),e.box(.24,.35,.6,.1,.5,.1,n,Y.skin),e.blob(0,1.02,.8,.13,.14,.14,dt("#3a2418",.1,t),Y.skin,2,!1)):(e.box(0,0,0,.6,.2,.42,i,Y.plain),e.box(0,.18,0,.42,.55,.24,n,Y.skin,0,.85),e.box(-.28,.2,.08,.1,.45,.1,n,Y.skin),e.box(.28,.2,.08,.1,.45,.1,n,Y.skin),e.blob(0,.86,0,.13,.15,.13,dt("#3a2418",.1,t),Y.skin,3,!1)),e.geometry()}function um(s){const t=new ke;return t.box(0,0,0,4.6,.12,.6,dt("#6b4630",.1,s),Y.wood,0,.85),t.geometry()}function dm(s){const t=new ke,e=dt("#1d1d22",.1,s);return t.tri([0,0,.6],[-1.1,.25,-.1],[0,0,-.3],e,Y.plain),t.tri([0,0,.6],[0,0,-.3],[1.1,.25,-.1],e,Y.plain),t.tri([-1.1,.25,-.1],[-2,-.1,-.5],[-.6,.15,-.25],e,Y.plain),t.tri([1.1,.25,-.1],[.6,.15,-.25],[2,-.1,-.5],e,Y.plain),t.tri([0,0,-.3],[-.25,0,-1],[.25,0,-1],e,Y.plain),t.geometry()}const fm=`
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
`,pm=`
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
`;class mm{constructor(t){this.app=t,this._m=new Xt,this._q=new Dn,this._p=new D,this._s=new D,this._e=new Ei,this._c=new vt;const e=t.island.meta,n=e.sites,i=ns(e.seed+2024);this.rand=i,this.group=new en,this.mat=Vs(t.shared,{fade:[24,34]});const a=t.terrain,r=(w,y)=>Math.max(0,a.heightAt(w,y));this.people={stand:[],bend:[],sit:[]};const o=(w,y,A,U,S=null,b=1)=>this.people[w].push({x:y,z:A,y:S??r(y,A),rot:U,ph:i()*6.28,tint:b});for(const w of n.loi){const y=w.model?16:5;for(let A=0;A<y;A++){const U=w.paddies[Math.floor(i()*w.paddies.length)];if(!U.flood)continue;const S=U.quad,b=.2+i()*.6,z=.2+i()*.6,X=S[0][0]+(S[1][0]-S[0][0])*b+(S[3][0]-S[0][0])*z,K=S[0][1]+(S[1][1]-S[0][1])*b+(S[3][1]-S[0][1])*z;o("bend",X,K,i()*6.28,(U.level-.25)*.013)}}for(const w of n.villages){const y=w.model?12:w.alii?14:4;for(let A=0;A<y;A++){const U=i()*6.28,S=.04+i()*.25;o(i()<.5?"sit":"stand",w.x+Math.cos(U)*S,w.z+Math.sin(U)*S,i()*6.28)}}for(const w of n.heiau.filter(y=>y.model||y.kind==="luakini"))for(let y=0;y<3;y++)o("stand",w.x+(i()-.5)*.12,w.z+(i()-.5)*.08,w.rot+Math.PI,r(w.x,w.z)+.07,2.4);for(const w of n.canoes)for(let y=0;y<(w.village===n.model?5:2);y++)o("stand",w.x+(i()-.5)*.2,w.z+(i()-.5)*.2,w.dir+Math.PI+(i()-.5));for(const w of n.ponds){const y=w.wall[Math.round(w.gates[0]*(w.wall.length-1))];o("stand",y[0]-w.ax*.02,y[1]-w.az*.02,Math.atan2(w.az,w.ax),.02)}this.poseMeshes={};for(const w of["stand","bend","sit"]){const y=this.people[w],A=new Xi(Yr(w,i),this.mat,Math.max(1,y.length+(w==="stand"?40:0)));A.frustumCulled=!1,A.instanceMatrix.setUsage(Gi),this.group.add(A),this.poseMeshes[w]=A}this.writeStatic(),this.trail=e.trail.slice();let l=0;for(let w=0;w<this.trail.length;w++){const y=this.trail[w],A=this.trail[(w+1)%this.trail.length];l+=y[0]*A[1]-A[0]*y[1]}l<0&&this.trail.reverse(),this.trailLen=[0];for(let w=1;w<=this.trail.length;w++){const y=this.trail[w-1],A=this.trail[w%this.trail.length];this.trailLen.push(this.trailLen[w-1]+Math.hypot(A[0]-y[0],A[1]-y[1]))}const c=n.alii||n.villages[0];let h=0,u=1/0;for(let w=0;w<this.trail.length;w++){const y=Math.hypot(this.trail[w][0]-c.x,this.trail[w][1]-c.z);y<u&&(u=y,h=this.trailLen[w])}this.procS=h-.6;const d=new ke;Q0(d,i),this.akua=new te(d.geometry(),this.mat),this.akua.frustumCulled=!1,this.group.add(this.akua),this.boats=[];const f=(()=>{const w=new ke;return Dl(w,i,8),w.geometry()})(),v=Yr("sit",i),_=e.ahupuaa.find(w=>w.id===n.model);for(let w=0;w<4;w++){const y=n.canoes[w%n.canoes.length],A=w<3&&_?_.mouth:[y.x,y.z],U=w<3?Math.atan2(_.mouth[1]-_.topZ,_.mouth[0]-_.topX):y.dir,S=5+i()*5,b=A[0]+Math.cos(U)*S+(i()-.5)*3,z=A[1]+Math.sin(U)*S+(i()-.5)*3;if(a.heightAt(b,z)>-.02)continue;const X=new en,K=new te(f,this.mat);K.scale.setScalar(Te),X.add(K);for(const R of[-1.6,1.4]){const F=new te(v,this.mat);F.scale.setScalar(Te),F.position.set(R*Te,.45*Te,0),F.rotation.y=Math.PI/2,X.add(F)}X.position.set(b,0,z),X.rotation.y=i()*6.28,this.group.add(X),this.boats.push({g:X,x:b,z,ph:i()*6.28,drift:i()*6.28,crew:2})}const m=new ke;Ul(m,i),this.voyager=new te(m.geometry(),this.mat),this.voyager.scale.setScalar(Te),this.voyager.frustumCulled=!1,this.group.add(this.voyager),this.voyagerS=0,this.surfers=[];const p=um(i);this.boards=new Xi(p,this.mat,24),this.boards.frustumCulled=!1,this.boards.instanceMatrix.setUsage(Gi),this.group.add(this.boards);for(const w of n.surf)for(let y=0;y<4;y++)this.surfers.push({s:w,ph:i(),lane:(i()-.5)*.5});this.birds=new Xi(dm(i),this.mat,12),this.birds.frustumCulled=!1,this.birds.instanceMatrix.setUsage(Gi),this.group.add(this.birds),this.birdCentres=[];for(let w=0;w<12;w++){const y=n.villages[Math.floor(i()*n.villages.length)];this.birdCentres.push({x:y.x+(i()-.5)*6,z:y.z+(i()-.5)*6,r:.6+i()*1.4,h:.9+i()*1.4,ph:i()*6.28,sp:.08+i()*.06})}const x=[],g=[];for(const w of n.villages)for(let y=0;y<14;y++)x.push(w.x+.05,r(w.x,w.z)+.01,w.z+.05),g.push(y/14+i()*.05);const M=new ye;M.setAttribute("position",new ne(x,3)),M.setAttribute("aSeed",new ne(g,1)),M.setAttribute("aAge",new ne(new Float32Array(g.length),1)),this.smoke=new Tl(M,new pe({vertexShader:fm,fragmentShader:pm,uniforms:{uTime:t.shared.uniforms.uTime,uWindVec:t.shared.uniforms.uWindVec,uSkyColor:t.shared.uniforms.uSkyColor,uSunColor:t.shared.uniforms.uSunColor},transparent:!0,depthWrite:!1})),this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,this.group.add(this.smoke),this._m=new Xt,this._q=new Dn,this._p=new D,this._s=new D,this._e=new Ei,this._c=new vt}writeStatic(){for(const t in this.people){const e=this.poseMeshes[t],n=this.people[t];for(let i=0;i<n.length;i++)this.setInstance(e,i,n[i].x,n[i].y,n[i].z,n[i].rot,Te,n[i].tint);e.count=n.length,e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0)}}setInstance(t,e,n,i,a,r,o,l=1,c=0){this._p.set(n,i,a),this._e.set(c,r,0,"YXZ"),this._q.setFromEuler(this._e),this._s.setScalar(o),this._m.compose(this._p,this._q,this._s),t.setMatrixAt(e,this._m),(l!==1||t.instanceColor)&&t.setColorAt(e,this._c.setRGB(l,l,l))}walkTo(t,e){let n=0,i=1/0;for(let a=0;a<this.trail.length;a++){const r=Math.hypot(this.trail[a][0]-t,this.trail[a][1]-e);r<i&&(i=r,n=this.trailLen[a])}this.procS=n-.12}trailPoint(t){const e=this.trailLen[this.trailLen.length-1];t=(t%e+e)%e;let n=0,i=this.trailLen.length-1;for(;n<i-1;){const l=n+i>>1;this.trailLen[l]<=t?n=l:i=l}const a=this.trail[n%this.trail.length],r=this.trail[(n+1)%this.trail.length],o=(t-this.trailLen[n])/Math.max(1e-6,this.trailLen[n+1]-this.trailLen[n]);return[a[0]+(r[0]-a[0])*o,a[1]+(r[1]-a[1])*o,Math.atan2(r[0]-a[0],r[1]-a[1])]}update(t,e){const n=this.app,i=n.terrain,a=n.camera.position,r=a.y-Math.max(0,i.heightAt(a.x,a.z))<30;if(this.group.visible=r,!r)return;const o=n.season==="hooilo",l=this.poseMeshes.stand;let c=this.people.stand.length;if(this.akua.visible=o,o){this.procS+=t*.0035*Math.max(1,Math.min(8,n.clock.speed/20));for(let f=0;f<11;f++){const[v,_,m]=this.trailPoint(this.procS-f*.035),p=Math.max(0,i.heightAt(v,_))+Math.abs(Math.sin(e*4.2+f))*.0012;this.setInstance(l,c++,v,p,_,m,Te,f===5?2.2:1),f===5&&(this.akua.position.set(v,p,_),this.akua.rotation.y=m,this.akua.scale.setScalar(Te))}}let h=0;for(const f of this.surfers){const v=f.s,_=(e*.06+f.ph)%1,m=-Math.sin(v.dir),p=Math.cos(v.dir),x=(_-.5)*.9+f.lane,g=_*.15,M=v.x+m*x-Math.cos(v.dir)*g,w=v.z+p*x-Math.sin(v.dir)*g,y=Math.atan2(m,p)+(f.lane>0?0:Math.PI),A=.002+Math.sin(e*2+f.ph*9)*8e-4;this.setInstance(this.boards,h++,M,A,w,y+Math.PI/2,Te,1,Math.sin(e*1.3+f.ph)*.06),this.setInstance(l,c++,M,A+.0025,w,y,Te*.95,1)}this.boards.count=h,this.boards.instanceMatrix.needsUpdate=!0,l.count=c,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0);for(const f of this.boats)f.g.position.x=f.x+Math.sin(e*.05+f.drift)*.6,f.g.position.z=f.z+Math.cos(e*.04+f.drift)*.6,f.g.position.y=Math.sin(e*1.3+f.ph)*.0015,f.g.rotation.z=Math.sin(e*1.1+f.ph)*.04,f.g.rotation.y+=t*.02;this.voyagerS+=t*.004;const u=155,d=this.voyagerS;this.voyager.position.set(Math.cos(d)*u*.95+10,Math.sin(e*.9)*.002,Math.sin(d)*u*.7),this.voyager.rotation.y=-d-Math.PI/2,this.voyager.rotation.x=.06;for(let f=0;f<this.birdCentres.length;f++){const v=this.birdCentres[f],_=v.ph+e*v.sp,m=v.x+Math.cos(_)*v.r,p=v.z+Math.sin(_)*v.r,x=Math.max(0,i.heightAt(m,p))+v.h+Math.sin(e*.3+f)*.1;this.setInstance(this.birds,f,m,x,p,-_,Te*1.4,1,.3)}this.birds.count=this.birdCentres.length,this.birds.instanceMatrix.needsUpdate=!0}}function Il(s,t,e,n=1){let i=Float32Array.from(s),a=new Float32Array(t*t);const r=1/(2*e+1);for(let o=0;o<n;o++){for(let l=0;l<t;l++){const c=l*t;let h=0;for(let u=-e;u<=e;u++)h+=i[c+Math.min(t-1,Math.max(0,u))];for(let u=0;u<t;u++)a[c+u]=h*r,h+=i[c+Math.min(t-1,u+e+1)]-i[c+Math.max(0,u-e)]}for(let l=0;l<t;l++){let c=0;for(let h=-e;h<=e;h++)c+=a[Math.min(t-1,Math.max(0,h))*t+l];for(let h=0;h<t;h++)i[h*t+l]=c*r,c+=a[Math.min(t-1,h+e+1)*t+l]-a[Math.max(0,h-e)*t+l]}}return i}function $r(s,t,e,n,i){let a=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let r=1;r<t;r++){let o=(s[r]+r*r-(s[n[a]]+n[a]*n[a]))/(2*r-2*n[a]);for(;o<=i[a];)a--,o=(s[r]+r*r-(s[n[a]]+n[a]*n[a]))/(2*r-2*n[a]);a++,n[a]=r,i[a]=o,i[a+1]=1/0}a=0;for(let r=0;r<t;r++){for(;i[a+1]<r;)a++;const o=r-n[a];e[r]=o*o+s[n[a]]}}function gm(s,t){const n=new Float64Array(s*s);for(let c=0;c<s*s;c++)n[c]=t(c)?0:1e20;const i=new Float64Array(s),a=new Float64Array(s),r=new Int32Array(s),o=new Float64Array(s+1);for(let c=0;c<s;c++){for(let h=0;h<s;h++)i[h]=n[h*s+c];$r(i,s,a,r,o);for(let h=0;h<s;h++)n[h*s+c]=a[h]}const l=new Float32Array(s*s);for(let c=0;c<s;c++){const h=c*s;for(let u=0;u<s;u++)i[u]=n[h+u];$r(i,s,a,r,o);for(let u=0;u<s;u++)l[h+u]=Math.sqrt(a[u])}return l}const vm=[{name:"Koʻolau",gloss:"windward",from:345,to:105},{name:"Puna",gloss:"the sunrise side",from:105,to:165},{name:"Kona",gloss:"leeward",from:165,to:255},{name:"Waialua",gloss:"the northwest side",from:255,to:345}],Kr=[{key:"akua",name:"Wao akua",gloss:"realm of the gods"},{key:"nahele",name:"Wao nahele",gloss:"the forest"},{key:"kanaka",name:"Wao kanaka",gloss:"realm of people"},{key:"kula",name:"Kula",gloss:"open dry plains"},{key:"kahakai",name:"Kahakai",gloss:"the shore"},{key:"kohola",name:"Kai kohola",gloss:"reef shallows"},{key:"uli",name:"Kai uli",gloss:"deep blue sea"}];function _m(s,t,e=!1){for(let n=0;n<t;n++){if(s.length<3)return s;const i=e?[]:[s[0]],a=s.length,r=e?a:a-1;for(let o=0;o<r;o++){const l=s[o],c=s[(o+1)%a];i.push([l[0]*.75+c[0]*.25,l[1]*.75+c[1]*.25]),i.push([l[0]*.25+c[0]*.75,l[1]*.25+c[1]*.75])}e||i.push(s[a-1]),s=i}return s}const xm=`
${je}
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
`,Mm=`
${je}
${ts}
${Kn}
${es}
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
`;class ym{constructor(t){const e=t.island.meta,n=t.terrain,i=[],a=[],r=[],o=[];let l=0;const c=new Set,h=.2,u=(m,p)=>Math.floor(m/h)*100003+Math.floor(p/h),d=(m,p)=>{for(let x=-2;x<=2;x++)for(let g=-2;g<=2;g++)if(c.has(u(m+g*h,p+x*h)))return!0;return!1},f=m=>{for(let p=1;p<m.length;p++){const[x,g]=m[p-1],[M,w]=m[p],y=Math.ceil(Math.hypot(M-x,w-g)/(h*.5));for(let A=0;A<=y;A++)c.add(u(x+(M-x)*A/y,g+(w-g)*A/y))}},v=e.streams.filter(m=>m.area>=.9&&m.pts.length>=3).sort((m,p)=>p.area-m.area);for(const m of v){let p=m.pts.length;for(let y=0;y<m.pts.length;y++)if(d(m.pts[y][0],m.pts[y][1])){p=y+1;break}if(p<3)continue;let x=m.pts.slice(0,p);f(x),x=_m(x,2);const g=Math.min(1,Math.max(0,(Math.log10(m.area)-.35)/.9));let M=0;const w=Math.min(.11,.009*Math.sqrt(m.area)+.012);for(let y=0;y<x.length;y++){const A=x[Math.max(0,y-1)],U=x[Math.min(x.length-1,y+1)],S=U[0]-A[0],b=U[1]-A[1],z=Math.hypot(S,b)||1,X=-b/z,K=S/z;y>0&&(M+=Math.hypot(x[y][0]-x[y-1][0],x[y][1]-x[y-1][1]));const R=x[y][0],F=x[y][1],L=n.metresAt(R,F);if(L<-.5)break;const N=x[Math.min(x.length-1,y+2)],q=(L-n.metresAt(N[0],N[1]))/Math.max(10,Math.hypot(N[0]-R,N[1]-F)*100),W=Math.min(1,Math.max(0,(q-.08)/.5)),$=w*(1+W*.4),Z=Math.max(L,0)*nn+.012+W*.03;for(const at of[-1,1]){const V=R+X*$*at,j=F+K*$*at,st=Math.max(Z,Math.max(0,n.metresAt(V,j))*nn+.003);i.push(V,st,j),a.push(M,g,W),r.push(at)}y>0&&o.push(l-2,l-1,l,l-1,l+1,l),l+=2}}const _=new ye;_.setAttribute("position",new ne(i,3)),_.setAttribute("aFlow",new ne(a,3)),_.setAttribute("aSide",new ne(r,1)),_.setIndex(o),_.computeBoundingSphere(),this.uniforms={...t.shared.uniforms,uFlowAll:{value:0}},this.material=new pe({vertexShader:xm,fragmentShader:Mm,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:Ye,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new te(_,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=2,this.app=t}update(){const t=this.app.weather,e=Math.min(1,t.rainTotal/600);this.uniforms.uFlowAll.value+=(e-this.uniforms.uFlowAll.value)*.01;const n=this.app.camera.position;this.mesh.visible=n.y-Math.max(0,this.app.terrain.heightAt(n.x,n.z))<90}}function $i(s,t,{filter:e="mip",format:n=Ne}={}){const i=new Yi(s,t,t,n,Ke);return e==="nearest"?(i.minFilter=de,i.magFilter=de):e==="linear"?(i.minFilter=ee,i.magFilter=ee):(i.minFilter=$n,i.magFilter=ee,i.generateMipmaps=!0),i.wrapS=i.wrapT=Ve,i.needsUpdate=!0,i}function Sm(s){const t=cn,e=new Uint8Array(t*t*4),n=Math.log(300),i=Math.log(12e3),a=new Float32Array(t*t);for(let o=0;o<t*t;o++)a[o]=Math.max(0,Math.min(1,Math.log10(Math.max(1e-6,s.area[o])/.04)/1.6));const r=Il(a,t,2,2);for(let o=0;o<t*t;o++)e[o*4]=Math.round(255*Math.max(0,Math.min(1,(Math.log(s.rain[o])-n)/(i-n)))),e[o*4+1]=Math.round(255*Math.max(0,Math.min(1,s.sand[o]))),e[o*4+2]=Math.round(255*Math.min(1,r[o]*1.6)),e[o*4+3]=s.region[o*4+3];return $i(e,t)}function wm(s){const t=cn,e=new Uint8Array(t*t*4),n=Qt/t*100,i=gm(t,a=>s.height1024[a]>0);for(let a=0;a<t*t;a++)e[a*4+3]=Math.round(255*Math.min(1,i[a]*n/300));return{tex:$i(e,t),data:e}}const Ki=["#8d9cc9","#3d8a4c","#a3d05b","#e3b65e","#f3e2b0","#53d6c8","#2a5aa8"],Em=["#000000","#f0a35e","#6fb6e8","#f2d06b","#9ed27a"];function bm(s){const t=cn,e=Ki.map(o=>new vt(o)),n=[new Float32Array(t*t),new Float32Array(t*t),new Float32Array(t*t)];for(let o=0;o<t*t;o++){const l=e[s[o*4+2]]||e[6];n[0][o]=l.r,n[1][o]=l.g,n[2][o]=l.b}const i=n.map(o=>Il(o,t,2,2)),a=new Uint8Array(t*t*4);for(let o=0;o<t*t;o++)a[o*4]=Math.round(255*Math.pow(i[0][o],1/2.2)),a[o*4+1]=Math.round(255*Math.pow(i[1][o],1/2.2)),a[o*4+2]=Math.round(255*Math.pow(i[2][o],1/2.2)),a[o*4+3]=255;const r=$i(a,t);return r.colorSpace=Me,r}class Tm{constructor(t,e){this.canvas=t,this.island=e,this.params=new URLSearchParams(location.search);const n=new bl({canvas:t,antialias:!1,powerPreference:"high-performance"});n.setClearColor(0,1),this.renderer=n,this.pipeline=new T0(n),this.scene=new Qi,this.camera=new qe(42,1,.1,9e3),this.light={sunDir:new D(0,1,0),sunColor:new vt,skyColor:new vt,groundColor:new vt,moonDir:new D(0,-1,0),moonColor:new vt,zenith:new vt,horizon:new vt,sunHorizon:new vt,night:0};const i=new Yi(new Uint8Array([0,0,0,0]),1,1);i.needsUpdate=!0;const a=e.data;this.landTex=Sm(a),this.regionTex=$i(a.region,cn,{filter:"nearest"}),this.linesTex=$i(a.lines,Hn,{filter:"linear"}),this.zoneTex=bm(a.region),this.overlay=new le(0,0,0,0),this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uShadow:{value:null},uWeather:{value:i},uWeatherRect:{value:new le(-Qt,-Qt,Qt*2,Qt*2)},uCloudShadowK:{value:0},uCloudMidY:{value:15},uWetness:{value:0},uLand:{value:this.landTex},uSkyMap:{value:null},uRegion:{value:this.regionTex},uLines:{value:this.linesTex},uZoneTex:{value:this.zoneTex},uOverlay:{value:this.overlay},uHover:{value:0},uFocus:{value:0},uFocusK:{value:0},uMokuColors:{value:Em.map(d=>new vt(d))},uWindVec:{value:new Tt(1,0)}}},this.terrain=new m0(a,this.shared),this.scene.add(this.terrain.group),this.shadow=new V0(this.terrain.heightTex),this.shared.uniforms.uShadow.value=this.shadow.texture;const r=wm(a);this.seaTex=r.tex,this.seaData=r.data,this.ocean=new x0(this.shared,this.terrain.heightTex,r.tex),this.scene.add(this.ocean.mesh),this.sky=new k0,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.weather=new q0(a.height1024,cn);const[o,l]=e.meta.cloudSizes;this.clouds=new X0({shape:a.cloudShape,shapeSize:o,detail:a.cloudDetail,detailSize:l}),this.clouds.uniforms.uWeather.value=this.weather.texture,this.clouds.uniforms.uWeatherRect.value=this.weather.rect,this.shared.uniforms.uWeather.value=this.weather.texture,this.shared.uniforms.uWeatherRect.value=this.weather.rect,this.pipeline.atmosphere=this.clouds,this.features=new am(this),this.scene.add(this.features.group),this.vegetation=new hm(this),this.scene.add(this.vegetation.group),this.life=new mm(this),this.scene.add(this.life.group),this.streams=new ym(this),this.scene.add(this.streams.mesh),this.flash={t:-10,next:0,pos:new D,k:0},this.rig=new G0(this.camera,t,this.terrain),this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??9.2),speed:Number(this.params.get("speed")??60)},this.season=this.clock.doy>120&&this.clock.doy<300?"kau":"hooilo",this.params.get("weather")&&this.weather.setMode(this.params.get("weather")),this.sky.update(this.clock.doy,this.clock.hour,0,this.light),this.weather.warm(6,this.light.sunDir.y,this.clock.hour,this.season),this.time=0,this.frames=0,this.updaters=[];const c=n.getContext(),h=c.getExtension("WEBGL_debug_renderer_info"),u=h?String(c.getParameter(h.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(u),this.quality={level:3,avg:16,since:0,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}applyQuality(){const t=[{clouds:.25,steps:26,light:2,range:12,dpr:1},{clouds:.33,steps:34,light:2,range:16,dpr:1.25},{clouds:.42,steps:44,light:3,range:19,dpr:1.5},{clouds:.5,steps:56,light:4,range:22,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.clouds.setScale(t.clouds),this.clouds.uniforms.uSteps.value=t.steps,this.clouds.uniforms.uLightSteps.value=t.light,this.terrain.setRange(t.range),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>38&&e.since>1.5&&e.level>0?(e.level--,e.since=0,this.applyQuality()):e.avg<17&&e.since>6&&e.level<3&&(e.level++,e.since=0,this.applyQuality()))}lightning(){const t=this.weather,e=this.flash,n=t.stormiest;n&&(t.regime==="kona"?n.strength>.35:n.strength>.9)&&this.time>e.next&&this.clock.speed>0&&(e.t=this.time,e.pos.set(n.x+(Math.random()-.5)*8,t.base+(t.top-t.base)*(.3+Math.random()*.4),n.z+(Math.random()-.5)*8),e.next=this.time+1.5+Math.random()*(t.regime==="kona"?5:14));const a=this.time-e.t;e.k=a<.6?Math.exp(-a*9)*(.7+.3*Math.sin(a*70))+(a>.12&&a<.22?.6:0):0,this.clouds.uniforms.uFlash.value=e.k,this.clouds.uniforms.uFlashPos.value.copy(e.pos),e.k>0&&this.light.skyColor.offsetHSL(0,0,0).add(new vt(.25,.27,.35).multiplyScalar(e.k))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.min(.1,(t-this.last)/1e3);this.last=t,this.time+=e,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.shadow.update(this.renderer,this.light.sunDir),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){const e=this.clock;e.hour+=t*e.speed/3600,e.hour>=24&&(e.hour-=24,e.doy=(e.doy+1)%365),this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(t),this.terrain.update(this.camera),this.ocean.update(this.camera),this.vegetation.update(this.camera),this.weather.step(t*e.speed,this.light.sunDir.y,e.hour,this.season),this.life.update(t,this.time),this.streams.update(),this.lightning();for(const l of this.updaters)l(t,this.time);const n=this.light,i=this.weather,a=this.clouds.uniforms;a.uSunDir.value.copy(n.sunDir),a.uSunColor.value.copy(n.sunColor),a.uSkyColor.value.copy(n.skyColor),a.uGroundColor.value.copy(n.groundColor),a.uFogColor.value.copy(n.horizon),a.uMoonDir.value.copy(n.moonDir),a.uMoonColor.value.copy(n.moonColor),a.uWind.value.copy(i.windOffset),a.uWindDir.value.copy(i.wind),a.uTime.value=this.time,a.uBase.value=i.base,a.uTop.value=i.top;const r=Math.max(0,Math.min(1,(i.state.humidity-1.1)/.3));if(a.uOvercast.value=r,a.uFarCover.value=.32+r*.4,r>0){const l=1-r*.65;n.sunColor.multiplyScalar(l);const c=(n.skyColor.r+n.skyColor.g+n.skyColor.b)/3;n.skyColor.lerp(new vt(c,c,c*1.04),r*.5).multiplyScalar(1-r*.25)}this.shared.uniforms.uCloudShadowK.value=2.6,this.shared.uniforms.uCloudMidY.value=(i.base+i.top)*.5,this.ocean.uniforms.uWind.value.set(i.wind.x/9,i.wind.y/9),this.shared.uniforms.uWindVec.value.set(i.wind.x/9,i.wind.y/9);const o=this.pipeline.uniforms;o.uSunDir.value.copy(n.sunDir),o.uSunColor.value.copy(n.sunHorizon),o.uFogColor.value.copy(n.horizon),o.uExposure.value=.55*(1+2.2*Math.pow(n.night,1.5)),o.uNight.value=n.night,this.sky.group.position.copy(this.camera.position)}}const Am=[{id:"island",icon:"island",title:"Ka Mokupuni",gloss:"the island",text:["A high island raised by two volcanoes and carved by rain. Land was divided in nested parts: the mokupuni (island) into moku (districts), each moku into ahupuaʻa, each ahupuaʻa into ʻili worked by extended families.","This island is a composite, not a map of any one place — but its boundaries follow the ridgelines of its own watersheds, the way real ones did."]},{id:"rain",icon:"rain",title:"Ka Ua",gloss:"the rain",text:["Most days the moaʻe — the trade wind — pushes moist ocean air against the windward mountains. Forced upward, it cools past about 650 m and condenses into the cloud bank on the summit. Showers fall on the windward side; the air sinking down the far side warms and dries.","So one side of an island is lush and the other dry. Hawaiians named hundreds of winds and rains, each belonging to a place. Wai, fresh water, was life — and waiwai, wealth, is water doubled."]},{id:"ahupuaa",icon:"ahupuaa",title:"Ahupuaʻa",gloss:"from the mountain to the sea",zone:null,text:["An ahupuaʻa ran from the uplands to the sea, usually bounded by ridges, so its people had forest, fresh water, farmland, shore and reef within one boundary.","A konohiki managed it for the aliʻi, allotting land and water, and could place a kapu that rested a fishery or forest until it recovered.","The name comes from the ahu, a stone altar at the boundary, where a carved puaʻa (pig) image stood during the Makahiki."]},{id:"akua",icon:"akua",title:"Wao Akua",gloss:"realm of the gods",zone:0,text:["The cloud-wrapped heights were left largely to the gods. People came only for special purposes — feathers, choice woods, stone for adzes — and with care.","Yet this is the source: mist and rain combed from the clouds by mossy ʻōhiʻa forest feed every spring and stream below. Keep the uplands whole, and water keeps flowing to everyone downstream."]},{id:"nahele",icon:"nahele",title:"Wao Nahele",gloss:"the forest",zone:1,text:["Below the clouds grew koa and ʻōhiʻa. A kahuna kālai waʻa, a master canoe builder, chose a koa tree here, felled it with stone koʻi (adzes), and shaped the hull before it was hauled down to the shore.","Kia manu, bird catchers, gathered feathers for the cloaks and helmets of the aliʻi. From the ʻōʻō they took only a few yellow feathers and let the bird go."]},{id:"loi",icon:"loi",title:"Loʻi Kalo",gloss:"irrigated taro terraces",zone:2,text:["Kalo (taro) was the staff of life, cooked and pounded into poi. Terraces stepped down the valley floor, fed by an ʻauwai — a ditch that took part of the stream at a dam and returned it below. The water had to keep moving: cool, flowing water kept the kalo healthy.","In tradition the first kalo grew from Hāloa, elder brother of the Hawaiian people, so caring for kalo was caring for family."]},{id:"kauhale",icon:"kauhale",title:"Kauhale",gloss:"the family compound",zone:4,text:["A home was a cluster of hale, each with its purpose: the hale noa where the family slept, the mua where men ate and kept the family shrine, a separate eating house for women, a house for beating kapa, a canoe house.","Under the ʻai kapu, men and women ate apart. Houses were framed in hardwood, lashed with cordage and thatched with pili grass, on a raised stone paepae."]},{id:"heiau",icon:"heiau",title:"Heiau",gloss:"temple",zone:4,text:["Heiau ranged from simple shrines to massive stone platforms. A luakini, a temple of state dedicated to Kū, could be built only by a ruling chief; others honored Lono for rain and harvests, or served healing and fishing.","On the platform stood the ʻanuʻu, a tall frame wrapped in white kapa where the high priest received the gods’ words; carved kiʻi images; and the lele, an altar for offerings."]},{id:"kahakai",icon:"kahakai",title:"Kahakai",gloss:"the shore",zone:4,text:["Most people lived near the shore, where the stream met the sea. Canoes, each hull carved from a single log and steadied by an ama float, were kept out of the sun in a hālau waʻa.","On flat rocks and clay pans, seawater evaporated into paʻakai — salt — for preserving fish."]},{id:"loko",icon:"loko",title:"Loko Iʻa",gloss:"fishpond",zone:5,text:["Hawaiians built the most advanced fishponds in the Pacific. A curved wall of stacked stone, the kuapā, enclosed part of the reef flat near a stream mouth, where fresh water mixed with salt.","In the wall were mākāhā — sluice gates of wooden grates. Young fish slipped in with the tide, fattened on algae, and grew too big to slip back out. ʻAmaʻama (mullet) and awa (milkfish) were raised here."]},{id:"koa",icon:"koa",title:"Koʻa",gloss:"fishing shrine",zone:5,text:["Fishermen built koʻa, stone shrines on the shore, and offered the first fish of a catch to the fishing gods. Offshore fishing grounds were also called koʻa, found by lining up landmarks on land.","Kapu protected fish in their seasons: aku and ʻōpelu were taken in turns, each closed while the other was open, so neither was fished out."]},{id:"surf",icon:"surf",title:"Heʻe Nalu",gloss:"wave sliding",zone:5,text:["Surfing belonged to everyone. Chiefs rode long olo boards of light wiliwili wood; commoners rode shorter alaia of koa. When the surf came up, whole villages went to the water.","Each break had its name, and the best were sometimes kapu to all but the aliʻi."]},{id:"kula",icon:"kula",title:"Kula",gloss:"the dry plains",zone:3,text:["Where rain was too scarce for loʻi, families farmed the open kula: ʻuala (sweet potato) in mounds, dryland kalo, ipu (gourds) and kō (sugarcane).","Long low walls ran across the slopes to break the wind and hold soil and moisture. The great leeward field systems covered tens of square kilometres."]},{id:"ahu",icon:"ahu",title:"Ahu · Makahiki",gloss:"the boundary altar · the season of Lono",zone:4,text:["Where the trail around the island crossed into each ahupuaʻa stood an ahu, a stone altar. When Makaliʻi — the Pleiades — rose at dusk in late autumn, the Makahiki began: four months honoring Lono, god of rain and growth.","Lono’s image, the akua loa — a tall staff hung with kapa — was carried around the island. At each ahu the people left offerings: kapa, food, feathers, pigs. Then came games, rest and feasting, and war was forbidden."]},{id:"puuhonua",icon:"puuhonua",title:"Puʻuhonua",gloss:"place of refuge",zone:4,text:["Breaking a kapu could mean death — unless you reached a puʻuhonua first. Inside its great walls a kahuna performed rites of absolution, and you could go home forgiven.","In wartime, defeated warriors and those who could not fight also found safety there."]},{id:"holua",icon:"holua",title:"Hōlua",gloss:"sledding course",zone:3,text:["During the Makahiki, chiefs raced down stone-built slides on papa hōlua — long, narrow sleds on hardwood runners — at tremendous speed.","The track was paved with stones and laid with slick grass or leaves; the longest ran for more than a kilometre."]},{id:"malama",icon:"malama",title:"Mālama ʻĀina",gloss:"care for the land",text:["The ahupuaʻa worked because each part cared for the next: protected forests made water, water fed loʻi and fishponds, and people tended it all.","Across Hawaiʻi today, communities are restoring loʻi, fishponds and forests on the same principles."]}],Ps={moae:{name:"Moaʻe",gloss:"trade winds"},kona:{name:"Kona",gloss:"southerly storm"},malie:{name:"Mālie",gloss:"calm"},auto:{name:"Auto",gloss:"let the weather change"}},Pa={kau:{name:"Kau",gloss:"the dry season"},hooilo:{name:"Hoʻoilo",gloss:"the wet season"}},Cm={island:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',rain:'<path d="M7 14.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M8.5 17.5l-1 2.5M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5"/>',ahupuaa:'<path d="M12 3.5 4.5 19.5h15z"/><path d="M12 7c-1.2 2.6 1 4.4 0 7s1.2 3 .3 5.5"/><path d="M3 21c2 0 2-.8 4.5-.8S9.5 21 12 21s2-.8 4.5-.8 2 .8 4.5.8"/>',akua:'<path d="M3 19.5l6-9 3 4 2-3 7 8z"/><path d="M8.2 7.5a2.6 2.6 0 0 1 5-1.3A2.2 2.2 0 1 1 15.5 9.6H8.8a1.1 1.1 0 0 1-.6-2.1z"/>',nahele:'<path d="M12 21v-6"/><path d="M12 15c-4.2 0-6.3-2.1-6.3-5a4 4 0 0 1 3-3.9 3.3 3.3 0 0 1 6.6 0 4 4 0 0 1 3 3.9c0 2.9-2.1 5-6.3 5z"/>',loi:'<path d="M12 21v-4.5"/><path d="M12 16.5c-5 0-8-3-8-7 0-2.2 1.2-4 3.2-4 2 0 3 1.8 4.8 1.8s2.8-1.8 4.8-1.8c2 0 3.2 1.8 3.2 4 0 4-3 7-8 7z"/><path d="M12 7.3v9"/>',kauhale:'<path d="M2.5 20.5h19"/><path d="M5 20.5 12 5l7 15.5"/><path d="M10.4 20.5v-4h3.2v4"/>',heiau:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',kahakai:'<path d="M3 14.5h18l-2.2 3.2H5.2z"/><path d="M6 11h12"/><path d="M8.5 11v3.5M15.5 11v3.5"/><path d="M3 20.5c2 0 2-.8 4.5-.8s2 .8 4.5.8 2-.8 4.5-.8 2 .8 4.5.8"/>',loko:'<path d="M3.5 12c3-4.2 9-5 12.5 0-3.5 5-9.5 4.2-12.5 0z"/><path d="M16 12l5-3.2v6.4z"/><circle cx="7.2" cy="11.2" r=".9" fill="currentColor"/><path d="M3 20c3-2 15-2 18 0"/>',koa:'<path d="M6.5 20.5h11"/><ellipse cx="12" cy="17.8" rx="4.3" ry="2"/><ellipse cx="12" cy="13.8" rx="3.2" ry="1.8"/><path d="M12 12V5.2a2.1 2.1 0 1 1 3.1 1.9"/>',surf:'<path d="M2.5 17c3.2 0 4.2-8.5 9.5-8.5 3 0 4.2 2 4.2 4.2-1.2-.2-3.2-.6-4 1.4 3 0 5.6 1 7.8 2.9"/><path d="M2.5 20.5h19"/>',kula:'<path d="M2.5 18.5c2-3 4.5-3 6.5 0M9 18.5c2-3 4.5-3 6.5 0M15.5 18.5c1.6-2.4 4-3 6 0"/><path d="M2.5 21h19"/><path d="M5.8 14.5v-3M12.2 14.5v-4M18.6 14.5v-3"/>',ahu:'<path d="M7.5 20.5h9l-1.2-3.2H8.7z"/><path d="M9.3 17.3l.6-3h4.2l.6 3"/><path d="M10.4 14.3l.6-2.3h2l.6 2.3"/><path d="M18 3.5l.7 1.6 1.6.7-1.6.7L18 8.1l-.7-1.6-1.6-.7 1.6-.7z"/>',puuhonua:'<path d="M2.5 20h19"/><path d="M3 20v-6.5h9.5V20"/><path d="M3 16.2h9.5"/><path d="M14 20l3.6-7.5L21.2 20"/>',holua:'<path d="M3 5.5l18 13.5"/><path d="M7.8 7.6l3.6 2.7"/><path d="M6.6 10.4l5.3 4"/><circle cx="9.6" cy="6.2" r="1.2"/>',malama:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',play:'<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5.5v13M16 5.5v13" stroke-width="2.6"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',zones:'<path d="M3 6h18M3 10.5h18M3 15h18M3 19.5h18"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',mute:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3 7 7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/>',moon:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',moae:'<path d="M3 8.5h11a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12.5h15a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16.5h8"/>',kona:'<path d="M7 13.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M12.5 13.5 10 18h3.5l-2 3.5"/>',malie:'<circle cx="8.5" cy="8.5" r="3"/><path d="M8.5 2.5v1.5M2.5 8.5H4M4.3 4.3l1 1"/><path d="M9.5 18.5a3.5 3.5 0 1 1 .7-6.9 4.3 4.3 0 0 1 8.3 2 2.6 2.6 0 0 1-.4 4.9z"/>',auto:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4.5v4h-4"/>',kau:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>',hooilo:'<path d="M7 13a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M9 16.5v3M13 16.5v3M17 16.5v3"/>',speed1:'<path d="M8 5.5v13l9-6.5z"/>',speed2:'<path d="M4.5 5.5v13l7.5-6.5zM12 5.5v13l7.5-6.5z"/>',speed3:'<path d="M3 6v12l6-6zM9.5 6v12l6-6zM16 6v12l6-6z"/>',wind:'<path d="M12 3l4 8h-3v10h-2V11H8z" fill="currentColor" stroke="none"/>',explore:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',tour:'<path d="M4 19c4-1 4-6 8-7s5-6 8-7"/><circle cx="4" cy="19" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="20" cy="5" r="1.4" fill="currentColor"/>'};function ue(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Cm[s]||""}</svg>`}const Cn=(s,t)=>Math.atan2(s,t);function Rm(s){const t=s.island.meta,e=t.sites,n=s.terrain,i=t.ahupuaa.find(L=>L.id===e.model)||t.ahupuaa[0],[a,r]=i.mouth;let o=i.topX-a,l=i.topZ-r;const c=Math.hypot(o,l)||1;o/=c,l/=c;const h=Cn(-o,-l),u=Cn(o,l),d=(L,N)=>new D(L,Math.max(0,n.heightAt(L,N)),N),f=i.trunk||[],v=L=>{if(!f.length)return[a+o*c*L,r+l*c*L];const N=f[Math.min(f.length-1,Math.floor(L*(f.length-1)))];return[N[0],N[1]]},_=L=>{let N=f[0];for(const q of f)Math.abs(q[2]-L)<Math.abs(N[2]-L)&&(N=q);return N?[N[0],N[1]]:v(.6)},m=e.villages.find(L=>L.model)||e.villages[0],p=e.loi.find(L=>L.model)||e.loi[0],x=e.heiau.find(L=>L.model)||e.heiau[0],g=e.ponds.find(L=>L.model)||e.ponds[0],M=e.canoes.find(L=>L.village===i.id)||e.canoes[0],w=e.koa.find(L=>L.id===i.id)||e.koa[0],y=L=>Math.min(...e.ponds.map(N=>Math.hypot(N.cx-L.x,N.cz-L.z)),99),U=[...e.surf].sort((L,N)=>Math.hypot(L.x-a,L.z-r)-Math.max(0,8-y(L))*20-(Math.hypot(N.x-a,N.z-r)-Math.max(0,8-y(N))*20))[0],S=e.alii||m,b=[...t.ahu].filter(L=>L.a===i.id||L.b===i.id).sort((L,N)=>Math.hypot(L.x-a,L.z-r)-Math.hypot(N.x-a,N.z-r))[0]||t.ahu[0],[z,X]=t.center,K=(()=>{const L=s.island.data.region,N=Math.sqrt(L.length/4);let q=null,W=-1;for(let $=0;$<N;$+=4)for(let Z=0;Z<N;Z+=4)if(L[($*N+Z)*4+3]>W){let V=0;for(let j=-8;j<=8;j+=4)for(let st=-8;st<=8;st+=4)V+=L[(Math.min(N-1,Math.max(0,$+j))*N+Math.min(N-1,Math.max(0,Z+st)))*4+3];V>W&&(W=V,q=[((Z+.5)/N-.5)*360,(($+.5)/N-.5)*360])}return q||[S.x,S.z-10]})(),R={};R.island={target:d(z+10,X+4),distance:330,yaw:.28,pitch:.78,overlay:[.55,0,.6,0],hour:9.5};{const L=a-o*4,N=r-l*4;R.rain={target:d(L,N),distance:24,yaw:u,pitch:.1,hour:16,weather:"moae",boost:!0,overlay:[0,0,0,0],lookUp:.35,showers:[[L-o*14,N-l*14],[L-o*8+l*7,N-l*8-o*7],[L-o*20-l*6,N-l*20+o*6]]}}{const[L,N]=v(.45);R.ahupuaa={target:d(L,N),distance:92,yaw:h+.25,pitch:.55,focus:i.id,overlay:[1,.85,.4,.6],hour:11}}{const[L,N]=_(260);R.akua={target:d(L,N),distance:26,yaw:h+.15,pitch:.1,hour:8.2,overlay:[0,0,0,0],lookUp:.55}}{const[L,N]=_(520);R.nahele={target:d(L,N),distance:9,yaw:h+.9,pitch:.55,hour:9.5,overlay:[0,0,0,0]}}if(p){const L=p.paddies[Math.floor(p.paddies.length*.35)].quad[0];R.loi={target:d(L[0],L[1]),distance:5.2,yaw:h-.5,pitch:.72,hour:10.2,overlay:[0,0,0,0]}}if(R.kauhale={target:d(m.x,m.z),distance:3.2,yaw:h+.9,pitch:.55,hour:8.8,overlay:[0,0,0,0]},x&&(R.heiau={target:d(x.x,x.z),distance:2.1,yaw:x.rot+2.2,pitch:.42,hour:11.5,overlay:[0,0,0,0]}),M){const L=Math.cos(M.dir),N=Math.sin(M.dir);R.kahakai={target:d(M.x,M.z),distance:2,yaw:Cn(L,N)+.7,pitch:.28,hour:15.8,overlay:[0,0,0,0]}}if(g&&(R.loko={target:d(g.cx+g.ax*g.r*.4,g.cz+g.az*g.r*.4),distance:6,yaw:Cn(g.ax,g.az)+.6,pitch:.5,hour:13,overlay:[0,0,0,0]}),w){const L=M||{dir:0};R.koa={target:d(w.x,w.z),distance:1.8,yaw:Cn(-Math.cos(L.dir),-Math.sin(L.dir))+.3,pitch:.2,hour:6.9,overlay:[0,0,0,0],lookUp:.25}}if(U&&(R.surf={target:d(U.x,U.z),distance:1.3,yaw:Cn(Math.cos(U.dir+.9),Math.sin(U.dir+.9)),pitch:.12,hour:14.5,overlay:[0,0,0,0]}),R.kula={target:d(K[0],K[1]),distance:11,yaw:.9,pitch:.42,hour:9,overlay:[0,0,0,0]},b){let L=0,N=-1/0;for(let q=0;q<24;q++){const W=q/24*Math.PI*2,$=n.heightAt(b.x+Math.sin(W)*2.2,b.z+Math.cos(W)*2.2);$>N&&(N=$,L=W)}R.ahu={target:d(b.x,b.z),distance:2,yaw:L,pitch:.3,hour:18.2,doy:318,overlay:[0,0,0,.8],lookUp:.6,ahu:b}}if(e.puuhonua){const L=e.puuhonua;R.puuhonua={target:d(L.x-Math.cos(L.dir)*.8,L.z-Math.sin(L.dir)*.8),distance:3.4,yaw:Cn(Math.cos(L.dir+.9),Math.sin(L.dir+.9)),pitch:.42,hour:15,overlay:[0,0,0,0]}}if(e.holua){const L=e.holua,N=(L.x0+L.x1)/2,q=(L.z0+L.z1)/2,W=L.x1-L.x0,$=L.z1-L.z0,Z=Math.hypot(W,$)||1;R.holua={target:d(N,q),distance:6.5,yaw:Cn(-$/Z,W/Z)+.25,pitch:.33,hour:16,overlay:[0,0,0,0]}}R.malama={target:d(z,X),distance:300,yaw:2.5,pitch:.5,hour:17.4,overlay:[.6,0,.5,0]};for(const L of Object.values(R))Lm(L,n);const F={akua:[i.topX,i.topZ],nahele:_(520),loi:R.loi?[R.loi.target.x,R.loi.target.z]:null,kauhale:[m.x,m.z],heiau:x?[x.x,x.z]:null,kahakai:M?[M.x,M.z]:null,loko:g?[g.cx+g.ax*g.r*.5,g.cz+g.az*g.r*.5]:null,koa:w?[w.x,w.z]:null,surf:U?[U.x,U.z]:null,kula:K,ahu:b?[b.x,b.z]:null,puuhonua:e.puuhonua?[e.puuhonua.x,e.puuhonua.z]:null,holua:e.holua?[(e.holua.x0+e.holua.x1)/2,(e.holua.z0+e.holua.z1)/2]:null};return{views:R,anchors:F,model:i}}function Lm(s,t){for(let e=0;e<8;e++){const n=Math.cos(s.pitch),i=new D(s.target.x+s.distance*n*Math.sin(s.yaw),s.target.y+s.distance*Math.sin(s.pitch),s.target.z+s.distance*n*Math.cos(s.yaw));let a=!1;for(let r=1;r<24;r++){const o=r/24,l=i.x+(s.target.x-i.x)*o,c=i.y+(s.target.y-i.y)*o,h=i.z+(s.target.z-i.z)*o;if(Math.max(0,t.heightAt(l,h))>c-.03){a=!0;break}}if(!a)return;s.pitch=Math.min(1.3,s.pitch+.07)}}const be=(s,t=document)=>t.querySelector(s),re=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,a]of Object.entries(t))i==="class"?n.className=a:i.startsWith("on")?n.addEventListener(i.slice(2),a):n.setAttribute(i,a);return e&&(n.innerHTML=e),n},Pm=s=>{const t=Math.floor(s),e=Math.floor((s-t)*60);return`${t}:${String(e).padStart(2,"0")}`},Dm=s=>s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2;class Um{constructor(t){this.app=t,this.meta=t.island.meta;const e=Rm(t);this.views=e.views,this.anchors=e.anchors,this.model=e.model,this.stops=Am.filter(n=>this.views[n.id]),this.mode="tour",this.index=-1,this.playing=!1,this.arrivedAt=0,this.overlayGoal=new le(0,0,0,0),this.focusGoal=0,this.layer={lines:!1,zones:!1,pins:!0},this.timeTween=null,this.counts=this.countFeatures(),this.build(),this.bind(),t.updaters.push(n=>this.update(n))}countFeatures(){const t=this.meta.sites,e={},n=(i,a,r=1)=>{e[i]=e[i]||{loi:0,hale:0,heiau:0,loko:0,koa:0},e[i][a]+=r};for(const i of t.loi)n(i.id,"loi",i.paddies.length);for(const i of t.houses)n(i.village,"hale");for(const i of t.heiau)n(i.id,"heiau");for(const i of t.ponds)n(i.id,"loko");for(const i of t.koa)n(i.id,"koa");return e}build(){const t=re("div",{id:"ui"});document.body.appendChild(t),this.root=t,t.appendChild(re("div",{class:"brand"},`<div class="brand-name">Ahupuaʻa</div><div class="brand-sub">${ue("akua",14)}<span></span>${ue("loko",14)}</div>`)),this.modeEl=re("div",{class:"modes"}),this.modeEl.append(re("button",{class:"mode on","data-mode":"tour",title:"Guided tour","aria-label":"Guided tour"},`${ue("tour",18)}<span>Tour</span>`),re("button",{class:"mode","data-mode":"explore",title:"Explore freely","aria-label":"Explore freely"},`${ue("explore",18)}<span>Explore</span>`)),t.appendChild(this.modeEl),this.tools=re("div",{class:"tools"});const e=(r,o,l)=>re("button",{class:"tool","data-tool":r,title:l,"aria-label":l},ue(o,20));this.tools.append(e("lines","lines","Ahupuaʻa boundaries"),e("zones","zones","Zones, mountain to sea"),e("pins","pins","Places"),e("help","help","About"),e("full","expand","Full screen")),t.appendChild(this.tools),this.legend=re("div",{class:"legend"}),Kr.forEach((r,o)=>this.legend.appendChild(re("div",{class:"lg"},`<i style="background:${Ki[o]}"></i><b>${r.name}</b><em>${r.gloss}</em>`))),t.appendChild(this.legend),this.card=re("section",{class:"card","aria-live":"polite"}),t.appendChild(this.card),this.rail=re("nav",{class:"rail","aria-label":"Tour stops"}),this.playBtn=re("button",{class:"play",title:"Play the tour","aria-label":"Play the tour"},ue("play",18)),this.rail.appendChild(this.playBtn),this.dots=this.stops.map((r,o)=>{const l=re("button",{class:"dot",title:r.title,"aria-label":r.title,"data-i":o},ue(r.icon,18));return this.rail.appendChild(l),l}),this.progress=re("div",{class:"rail-progress"},"<span></span>"),this.rail.appendChild(this.progress),t.appendChild(this.rail),this.markerLayer=re("div",{class:"markers"}),t.appendChild(this.markerLayer),this.markers=this.stops.filter(r=>this.anchors[r.id]).map(r=>{const o=re("button",{class:"marker",title:r.title,"aria-label":r.title},`${ue(r.icon,18)}<span>${r.title}</span>`);o.addEventListener("click",h=>{h.stopPropagation(),this.openStop(this.stops.indexOf(r),{fly:!0,explore:!0})}),this.markerLayer.appendChild(o);const[l,c]=this.anchors[r.id];return{el:o,stop:r,pos:new D(l,0,c),vis:0}});for(const r of this.markers)r.pos.y=Math.max(0,this.app.terrain.heightAt(r.pos.x,r.pos.z))+.05;this.inspector=re("div",{class:"inspector"}),t.appendChild(this.inspector),this.dock=re("div",{class:"dock"}),this.dock.innerHTML=`
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
      <div class="wind" title="Wind"><span class="wind-arrow">${ue("wind",22)}</span><span class="wind-speed"></span></div>`,t.appendChild(this.dock);const n=be(".regimes",this.dock);for(const r of["auto","moae","kona","malie"])n.appendChild(re("button",{class:"chip","data-regime":r,title:`${Ps[r].name} — ${Ps[r].gloss}`,"aria-label":Ps[r].name},ue(r,18)));const i=be(".seasons",this.dock);for(const r of["kau","hooilo"])i.appendChild(re("button",{class:"chip","data-season":r,title:`${Pa[r].name} — ${Pa[r].gloss}`,"aria-label":Pa[r].name},ue(r,18)));const a=be(".speeds",this.dock);for(const[r,o,l]of[["0",0,"pause"],["1",30,"speed1"],["2",240,"speed2"],["3",1800,"speed3"]])a.appendChild(re("button",{class:"chip","data-speed":o,title:o?`${o}× time`:"Pause time","aria-label":o?`${o} times speed`:"Pause"},ue(l,16)));this.help=re("div",{class:"help hidden"}),this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${ue("close",18)}</button>
        <h2>Ahupuaʻa</h2>
        <p>A composite Hawaiian high island, generated here in your browser: shaped by two volcanoes, carved by rain falling where the trade winds drop it, and divided into ahupuaʻa along its own watersheds.</p>
        <p>The weather is simulated: trade winds lift moist air over the mountains into cloud and rain; afternoon sun builds cumulus over the slopes; rainbows appear where sunlit rain sits opposite the sun.</p>
        <div class="help-keys">
          <span><b>Drag</b> turn</span><span><b>Right-drag / Shift</b> pan</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly there</span><span><b>← →</b> tour</span>
        </div>
      </div>`,t.appendChild(this.help)}bind(){this.modeEl.addEventListener("click",o=>{const l=o.target.closest("[data-mode]");l&&this.setMode(l.dataset.mode)}),this.tools.addEventListener("click",o=>{var h,u,d;const l=o.target.closest("[data-tool]");if(!l)return;const c=l.dataset.tool;c==="help"?this.help.classList.toggle("hidden"):c==="full"?document.fullscreenElement?(h=document.exitFullscreen)==null||h.call(document):(d=(u=document.documentElement).requestFullscreen)==null||d.call(u).catch(()=>{}):(this.layer[c]=!this.layer[c],this.applyLayers())}),this.help.addEventListener("click",o=>{(o.target===this.help||o.target.closest(".help-close"))&&this.help.classList.add("hidden")}),this.rail.addEventListener("click",o=>{const l=o.target.closest(".dot");l&&(this.setMode("tour",!1),this.goto(Number(l.dataset.i)))}),this.playBtn.addEventListener("click",()=>this.setPlaying(!this.playing)),this.dock.addEventListener("click",o=>{const l=o.target.closest("[data-regime]"),c=o.target.closest("[data-season]"),h=o.target.closest("[data-speed]");l&&this.app.weather.setMode(l.dataset.regime),c&&this.setSeason(c.dataset.season),h&&(this.app.clock.speed=Number(h.dataset.speed)),this.refreshDock()});const t=be(".dial-svg",this.dock);let e=!1;const n=o=>{const l=t.getBoundingClientRect(),c=(o.clientX-l.left)/l.width*120,h=(o.clientY-l.top)/l.height*64;let u=Math.atan2(58-h,c-60);u<0&&(u=u<-Math.PI/2?Math.PI:0);const d=6+(Math.PI-u)/Math.PI*12;this.timeTween=null,this.app.clock.hour=d};t.addEventListener("pointerdown",o=>{e=!0,t.setPointerCapture(o.pointerId),n(o)}),t.addEventListener("pointermove",o=>e&&n(o)),t.addEventListener("pointerup",()=>e=!1);const i=this.app.canvas;let a=null;i.addEventListener("pointerdown",o=>a={x:o.clientX,y:o.clientY,t:performance.now()}),i.addEventListener("pointerup",o=>{if(!a)return;Math.hypot(o.clientX-a.x,o.clientY-a.y)<5&&performance.now()-a.t<400&&this.pick(o.clientX,o.clientY),a=null});let r=0;i.addEventListener("pointermove",o=>{if(o.buttons||o.pointerType==="touch")return;const l=performance.now();l-r<60||(r=l,this.hover(o.clientX,o.clientY))}),i.addEventListener("pointerleave",()=>this.hover(null)),addEventListener("keydown",o=>{o.key==="ArrowRight"&&!o.shiftKey&&this.mode==="tour"?(o.preventDefault(),this.goto(this.index+1)):o.key==="ArrowLeft"&&!o.shiftKey&&this.mode==="tour"?(o.preventDefault(),this.goto(this.index-1)):o.key==="Escape"?this.help.classList.contains("hidden")?this.closeCard():this.help.classList.add("hidden"):o.key===" "&&this.mode==="tour"&&o.target===document.body&&(o.preventDefault(),this.setPlaying(!this.playing))}),this.app.rig.onUserInput=()=>{this.playing&&this.setPlaying(!1)}}setMode(t,e=!0){if(this.mode===t&&e){t==="tour"&&this.index<0&&this.goto(0);return}this.mode=t;for(const n of this.modeEl.querySelectorAll(".mode"))n.classList.toggle("on",n.dataset.mode===t);this.root.classList.toggle("exploring",t==="explore"),t==="explore"?(this.setPlaying(!1),this.closeCard(),this.focusGoal=0,this.app.rig.autoOrbit=0,this.app.clock.speed=Math.max(this.app.clock.speed,30),this.applyLayers()):e&&this.goto(Math.max(0,this.index))}applyLayers(){for(const t of this.tools.querySelectorAll("[data-tool]")){const e=t.dataset.tool;e in this.layer&&t.classList.toggle("on",this.layer[e])}this.legend.classList.toggle("show",this.layer.zones),this.markerLayer.classList.toggle("hidden",!this.layer.pins||this.mode!=="explore"),this.mode==="explore"&&this.overlayGoal.set(this.layer.lines?1:0,this.layer.zones?1:0,this.layer.lines?.5:0,this.layer.lines?.8:.35)}setSeason(t){const e=this.app.clock;e.doy=t==="kau"?172:355,this.app.season=t,this.refreshDock()}setPlaying(t){this.playing=t,this.playBtn.innerHTML=ue(t?"pause":"play",18),this.playBtn.classList.toggle("on",t),t&&this.mode!=="tour"&&this.setMode("tour"),t&&(this.arrivedAt=performance.now())}goto(t){if(t<0||t>=this.stops.length){t>=this.stops.length&&this.setPlaying(!1);return}this.openStop(t,{fly:!0,explore:!1})}openStop(t,{fly:e,explore:n}){this.index=t;const i=this.stops[t],a=this.views[i.id];if(this.dots.forEach((d,f)=>{d.classList.toggle("on",f===t),d.classList.toggle("done",f<t)}),this.renderCard(i,n),!a)return;const r=this.app.rig,o=r.goal.target.distanceTo(a.target),l=Math.min(6,2.2+Math.sqrt(o)*.22+Math.abs(Math.log(a.distance/r.goal.distance))*.35),c=innerWidth/Math.max(1,innerHeight),h=a.distance*(c<1?Math.pow(1/c,a.distance>40?1:.5):1);e&&r.flyTo({target:a.target,distance:h,yaw:a.yaw,pitch:a.pitch,lift:a.lookUp||0},l,{onDone:()=>this.arrivedAt=performance.now()}),this.arrivedAt=performance.now()+l*1e3,r.autoOrbit=a.distance<60?.012:.02;const u=this.app.clock;if(a.doy!==void 0&&Math.abs(a.doy-u.doy)>2?u.doy=a.doy:a.doy===void 0&&this.lastDoy!==void 0&&u.doy!==this.lastDoy&&(u.doy=this.lastDoy),a.doy===void 0&&(this.lastDoy=u.doy),a.hour!==void 0){let d=a.hour-u.hour;d<-12&&(d+=24),d>12&&(d-=24),this.timeTween={from:u.hour,by:d,t:0,dur:l}}if(u.speed=20,a.weather&&this.app.weather.setMode(a.weather),this.app.weather.boost=a.boost?1:0,a.showers)for(const[d,f]of a.showers)this.app.weather.spawnShower(d,f,5+Math.random()*3,.7);if(a.ahu&&this.app.life&&this.app.life.walkTo(a.ahu.x,a.ahu.z),!n){const d=a.overlay||[0,0,0,0];this.overlayGoal.set(d[0],d[1],d[2],d[3]),this.focusGoal=a.focus||0}}renderCard(t,e){var a,r,o,l;const n=t.zone!==void 0&&t.zone!==null?Kr[t.zone]:null,i=this.stops.length;this.card.innerHTML=`
      <header>
        <div class="card-icon">${ue(t.icon,26)}</div>
        <div class="card-titles"><h1>${t.title}</h1><p class="gloss">${t.gloss}</p></div>
        <button class="card-close" aria-label="Close">${ue("close",18)}</button>
      </header>
      ${n?`<div class="zone-chip"><i style="background:${Ki[t.zone]}"></i>${n.name}<em>${n.gloss}</em></div>`:""}
      <div class="card-body">${t.text.map(c=>`<p>${c}</p>`).join("")}</div>
      ${e?"":`<footer>
        <button class="nav prev" aria-label="Previous" ${this.index===0?"disabled":""}>${ue("prev",18)}</button>
        <span class="count">${this.index+1} / ${i}</span>
        ${this.index===i-1?`<button class="nav finish" aria-label="Explore">${ue("explore",18)}<span>Explore</span></button>`:`<button class="nav next" aria-label="Next">${ue("next",18)}</button>`}
      </footer>`}`,this.card.classList.add("show"),this.card.scrollTop=0,(a=be(".prev",this.card))==null||a.addEventListener("click",()=>this.goto(this.index-1)),(r=be(".next",this.card))==null||r.addEventListener("click",()=>this.goto(this.index+1)),(o=be(".finish",this.card))==null||o.addEventListener("click",()=>this.setMode("explore")),(l=be(".card-close",this.card))==null||l.addEventListener("click",()=>this.closeCard())}closeCard(){this.card.classList.remove("show")}regionAt(t,e){const n=this.app.island.data.region,i=cn,a=Math.floor((t+Zt)/Qt*i),r=Math.floor((e+Zt)/Qt*i);return a<0||r<0||a>=i||r>=i?0:n[(r*i+a)*4]}hover(t,e){if(t===null||this.mode!=="explore"){this.app.shared.uniforms.uHover.value=0,this.pinned||this.inspector.classList.remove("show");return}const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(this.app.shared.uniforms.uHover.value=i,!this.pinned){if(!i){this.inspector.classList.remove("show");return}this.showInspector(i,t,e)}}pick(t,e){if(this.mode!=="explore")return;const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(!i||i===this.focusGoal){this.focusGoal=0,this.pinned=!1,this.inspector.classList.remove("show","pinned");return}this.focusGoal=i,this.pinned=!0,this.showInspector(i,t,e,!0)}showInspector(t,e,n,i=!1){const a=this.meta.ahupuaa.find(c=>c.id===t);if(!a)return;if(this.inspectorId!==t){this.inspectorId=t;const c=vm[a.moku],h=this.counts[t]||{},u=(d,f)=>f?`<span class="st">${ue(d,15)}${f}</span>`:"";this.inspector.innerHTML=`
        <div class="in-head"><b>Ahupuaʻa</b><span class="in-moku"><i style="background:var(--moku${a.moku+1})"></i>${c.name}<em>${c.gloss}</em></span></div>
        ${Im(a.profile)}
        <div class="in-stats"><span class="st">${a.area.toFixed(1)} km²</span><span class="st">${ue("akua",15)}${Math.round(a.top)} m</span>${u("loi",h.loi)}${u("kauhale",h.hale)}${u("heiau",h.heiau)}${u("loko",h.loko)}${u("koa",h.koa)}</div>`}this.inspector.classList.add("show"),this.inspector.classList.toggle("pinned",i);const r=innerWidth,o=Math.min(r-300,e+18),l=Math.max(70,Math.min(innerHeight-220,n+18));this.inspector.style.transform=`translate(${o}px, ${l}px)`}update(t){const e=this.app,n=e.shared.uniforms,i=1-Math.exp(-t*3);if(e.overlay.lerp(this.overlayGoal,i),this.focusGoal?(n.uFocus.value=this.focusGoal,n.uFocusK.value+=(1-n.uFocusK.value)*i):(n.uFocusK.value+=(0-n.uFocusK.value)*i,n.uFocusK.value<.01&&(n.uFocus.value=0)),this.timeTween){const a=this.timeTween;a.t=Math.min(1,a.t+t/a.dur),e.clock.hour=((a.from+a.by*Dm(a.t))%24+24)%24,a.t>=1&&(this.timeTween=null)}if(this.playing&&this.mode==="tour"&&!e.rig.flight){const r=this.stops[this.index].text.join(" ").split(/\s+/).length,o=Math.max(9,r*.32)*1e3,l=performance.now()-this.arrivedAt;be("span",this.progress).style.width=`${Math.min(100,l/o*100)}%`,l>o&&(this.index<this.stops.length-1?this.goto(this.index+1):this.setPlaying(!1))}else be("span",this.progress).style.width="0%";this.updateMarkers(),this.frameN=(this.frameN||0)+1,this.frameN%6===0&&this.refreshDock()}updateMarkers(){if(this.mode!=="explore"||!this.layer.pins)return;const t=this.app.camera,e=innerWidth,n=innerHeight,i=new D,a=[],r=this.markers.map(o=>({m:o,d:t.position.distanceTo(o.pos)})).sort((o,l)=>o.d-l.d);for(const{m:o,d:l}of r){i.copy(o.pos).project(t);const c=i.z>1,h=(i.x+1)/2*e,u=(1-i.y)/2*n;let d=!c&&h>-40&&h<e+40&&u>60&&u<n+40&&l<420;d&&a.some(f=>Math.abs(f[0]-h)<44&&Math.abs(f[1]-u)<40)&&(d=!1),d&&a.push([h,u]),o.el.style.opacity=d?String(Math.min(1,(420-l)/120)):"0",o.el.style.pointerEvents=d?"auto":"none",d&&(o.el.style.transform=`translate(${h}px, ${u}px)`),o.el.classList.toggle("near",l<40)}}refreshDock(){const t=this.app,e=t.clock,n=t.light,i=be(".dial-body",this.dock),a=(e.hour-6)/12,r=e.hour<6||e.hour>18;let o;if(!r)o=Math.PI-a*Math.PI;else{const m=(e.hour-18+24)%24/12;o=Math.PI-m*Math.PI}const l=60+Math.cos(o)*52,c=58-Math.sin(o)*52;i.setAttribute("transform",`translate(${l.toFixed(1)} ${c.toFixed(1)})`),i.classList.toggle("moon",r),be(".dial-time",this.dock).textContent=Pm(e.hour);const h=C0[t.sky.astro.night]||"",u=be(".dial-night",this.dock);u.textContent=n.night>.5?`Pō ${h}`:"",u.title="The night of the Hawaiian lunar month";for(const m of this.dock.querySelectorAll("[data-regime]"))m.classList.toggle("on",t.weather.mode===m.dataset.regime);const d=e.doy>120&&e.doy<305?"kau":"hooilo";t.season=d;for(const m of this.dock.querySelectorAll("[data-season]"))m.classList.toggle("on",d===m.dataset.season);for(const m of this.dock.querySelectorAll("[data-speed]"))m.classList.toggle("on",Number(m.dataset.speed)===e.speed||e.speed===20&&m.dataset.speed==="30");const f=t.weather.wind,v=Math.atan2(f.x,-f.y)*180/Math.PI;be(".wind-arrow",this.dock).style.transform=`rotate(${v.toFixed(0)}deg)`,be(".wind-speed",this.dock).textContent=`${Math.round(f.length()*3.6)} km/h`;const _=Ps[t.weather.regime];be(".wind",this.dock).title=`${_.name} — ${_.gloss}`}start(){this.setMode("tour",!1),this.applyLayers(),this.goto(0)}}function Im(s){if(!s||s.length<2)return"";const t=260,e=78,n=s[s.length-1][0],i=Math.max(...s.map(d=>d[1]),200),a=Math.min(...s.map(d=>d[1]),-30),r=(e-14)/(i-a),o=d=>t-d/n*(t-4)-2,l=d=>e-6-(d-a)*r,c=l(0);let h="";for(let d=0;d<s.length-1;d++){const f=s[d],v=s[d+1];h+=`<path d="M${o(f[0]).toFixed(1)} ${c.toFixed(1)}L${o(f[0]).toFixed(1)} ${l(f[1]).toFixed(1)}L${o(v[0]).toFixed(1)} ${l(v[1]).toFixed(1)}L${o(v[0]).toFixed(1)} ${c.toFixed(1)}Z" fill="${Ki[f[2]]}" stroke="${Ki[f[2]]}" stroke-width=".6"/>`}const u=s.map((d,f)=>`${f?"L":"M"}${o(d[0]).toFixed(1)} ${l(d[1]).toFixed(1)}`).join("");return`<svg class="profile" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none">
    <rect x="0" y="${c.toFixed(1)}" width="${t}" height="${(e-c).toFixed(1)}" fill="rgba(60,120,190,0.35)"/>
    ${h}
    <path d="${u}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.2"/>
    <line x1="0" x2="${t}" y1="${c.toFixed(1)}" y2="${c.toFixed(1)}" stroke="rgba(255,255,255,0.4)" stroke-width=".8"/>
  </svg>
  <div class="profile-ends"><span>mauka</span><span>makai</span></div>`}const Ws=document.getElementById("boot"),Fm=Ws.querySelector(".boot-bar span"),Fl=Ws.querySelector(".boot-stage"),Nm={shape:["raising the shields",.02,.1],erode:["the rain carves valleys",.1,.42],valleys:["filling the valley floors",.42,.55],coast:["growing the reef",.55,.7],divide:["tracing the ridgelines",.66,.7],detail:["shaping the ridges",.7,.8],people:["the people arrive",.8,.86],light:["reading the light",.86,.94],sky:["gathering clouds",.94,.99],done:["",1,1]};function zm(s){return new Promise((t,e)=>{const n=new Worker(new URL(""+new URL("worker-CFU0dfvI.js",import.meta.url).href,import.meta.url),{type:"module"});n.onmessage=i=>{const a=i.data;if(a.type==="progress"){const r=Nm[a.stage];if(!r)return;Fl.textContent=r[0],Fm.style.width=`${(r[1]+(r[2]-r[1])*a.p)*100}%`}else a.type==="done"?(n.terminate(),t({data:a.data,meta:a.meta})):a.type==="error"&&(n.terminate(),e(new Error(a.message)))},n.onerror=i=>e(i),n.postMessage({seed:s})})}async function Om(){const s=performance.now(),t=await zm(Vl);console.log(`island generated in ${((performance.now()-s)/1e3).toFixed(1)} s`);const e=new Tm(document.getElementById("scene"),t),n=new Um(e);window.__app=e,e.ui=n;let i=0;const a=()=>{if(++i<4)return requestAnimationFrame(a);Ws.classList.add("gone"),setTimeout(()=>Ws.remove(),1200),new URLSearchParams(location.search).has("cam")||n.start()};requestAnimationFrame(a)}Om().catch(s=>{console.error(s),Fl.textContent="something went wrong — see the console"});
