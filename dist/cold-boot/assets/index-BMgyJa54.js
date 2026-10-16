(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ha="160",bi={ROTATE:0,DOLLY:1,PAN:2},xi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},vd=0,Ba=1,bd=2,Zc=1,xd=2,Dn=3,Qn=0,Gt=1,Jt=2,Nn=0,$i=1,Mn=2,ka=3,Ga=4,Md=5,li=100,yd=101,Sd=102,za=103,Ha=104,Ed=200,wd=201,Td=202,Ad=203,Wo=204,Xo=205,Rd=206,Cd=207,Pd=208,Ld=209,Dd=210,Id=211,Ud=212,Fd=213,Nd=214,Od=0,Bd=1,kd=2,Mr=3,Gd=4,zd=5,Hd=6,Vd=7,Jc=0,Wd=1,Xd=2,Zn=0,Qc=1,eh=2,th=3,da=4,Yd=5,nh=6,ih=300,Ji=301,Qi=302,Yo=303,$o=304,Ir=306,qo=1e3,fn=1001,Ko=1002,Bt=1003,Va=1004,Vr=1005,nn=1006,$d=1007,Ts=1008,Jn=1009,qd=1010,Kd=1011,ua=1012,sh=1013,Yn=1014,$n=1015,On=1016,rh=1017,oh=1018,ui=1020,jd=1021,pn=1023,Zd=1024,Jd=1025,fi=1026,es=1027,Qd=1028,ah=1029,eu=1030,lh=1031,ch=1033,Wr=33776,Xr=33777,Yr=33778,$r=33779,Wa=35840,Xa=35841,Ya=35842,$a=35843,hh=36196,qa=37492,Ka=37496,ja=37808,Za=37809,Ja=37810,Qa=37811,el=37812,tl=37813,nl=37814,il=37815,sl=37816,rl=37817,ol=37818,al=37819,ll=37820,cl=37821,qr=36492,hl=36494,dl=36495,tu=36283,ul=36284,fl=36285,pl=36286,dh=3e3,pi=3001,nu=3200,iu=3201,uh=0,su=1,on="",ft="srgb",kn="srgb-linear",fa="display-p3",Ur="display-p3-linear",yr="linear",ot="srgb",Sr="rec709",Er="p3",Mi=7680,ml=519,ru=512,ou=513,au=514,fh=515,lu=516,cu=517,hu=518,du=519,gl=35044,_l="300 es",jo=1035,Fn=2e3,wr=2001;class _i{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let vl=1234567;const qi=Math.PI/180,As=180/Math.PI;function as(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[n&255]+Dt[n>>8&255]+Dt[n>>16&255]+Dt[n>>24&255]).toLowerCase()}function Ct(i,e,t){return Math.max(e,Math.min(t,i))}function pa(i,e){return(i%e+e)%e}function uu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function fu(i,e,t){return i!==e?(t-i)/(e-i):0}function xs(i,e,t){return(1-t)*i+t*e}function pu(i,e,t,n){return xs(i,e,1-Math.exp(-t*n))}function mu(i,e=1){return e-Math.abs(pa(i,e*2)-e)}function gu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function _u(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function vu(i,e){return i+Math.floor(Math.random()*(e-i+1))}function bu(i,e){return i+Math.random()*(e-i)}function xu(i){return i*(.5-Math.random())}function Mu(i){i!==void 0&&(vl=i);let e=vl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function yu(i){return i*qi}function Su(i){return i*As}function Zo(i){return(i&i-1)===0&&i!==0}function Eu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Tr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function wu(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),d=r((e-n)/2),p=a((e-n)/2),m=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*d,l*p,o*c);break;case"YZY":i.set(l*p,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*p,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*m,o*c);break;case"YXY":i.set(l*m,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*m,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Vi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ft(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ma={DEG2RAD:qi,RAD2DEG:As,generateUUID:as,clamp:Ct,euclideanModulo:pa,mapLinear:uu,inverseLerp:fu,lerp:xs,damp:pu,pingpong:mu,smoothstep:gu,smootherstep:_u,randInt:vu,randFloat:bu,randFloatSpread:xu,seededRandom:Mu,degToRad:yu,radToDeg:Su,isPowerOfTwo:Zo,ceilPowerOfTwo:Eu,floorPowerOfTwo:Tr,setQuaternionFromProperEuler:wu,normalize:Ft,denormalize:Vi};class Ie{constructor(e=0,t=0){Ie.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Qe{constructor(e,t,n,s,r,a,o,l,c){Qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],p=n[2],m=n[5],g=n[8],_=s[0],f=s[3],u=s[6],b=s[1],v=s[4],T=s[7],I=s[2],A=s[5],R=s[8];return r[0]=a*_+o*b+l*I,r[3]=a*f+o*v+l*A,r[6]=a*u+o*T+l*R,r[1]=c*_+h*b+d*I,r[4]=c*f+h*v+d*A,r[7]=c*u+h*T+d*R,r[2]=p*_+m*b+g*I,r[5]=p*f+m*v+g*A,r[8]=p*u+m*T+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,p=o*l-h*r,m=c*r-a*l,g=t*d+n*p+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(s*c-h*n)*_,e[2]=(o*n-s*a)*_,e[3]=p*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=m*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Kr.makeScale(e,t)),this}rotate(e){return this.premultiply(Kr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Kr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Kr=new Qe;function ph(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Rs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Tu(){const i=Rs("canvas");return i.style.display="block",i}const bl={};function Ms(i){i in bl||(bl[i]=!0,console.warn(i))}const xl=new Qe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ml=new Qe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Us={[kn]:{transfer:yr,primaries:Sr,toReference:i=>i,fromReference:i=>i},[ft]:{transfer:ot,primaries:Sr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Ur]:{transfer:yr,primaries:Er,toReference:i=>i.applyMatrix3(Ml),fromReference:i=>i.applyMatrix3(xl)},[fa]:{transfer:ot,primaries:Er,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Ml),fromReference:i=>i.applyMatrix3(xl).convertLinearToSRGB()}},Au=new Set([kn,Ur]),rt={enabled:!0,_workingColorSpace:kn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Au.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=Us[e].toReference,s=Us[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Us[i].primaries},getTransfer:function(i){return i===on?yr:Us[i].transfer}};function Ki(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function jr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let yi;class mh{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{yi===void 0&&(yi=Rs("canvas")),yi.width=e.width,yi.height=e.height;const n=yi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=yi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Rs("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ki(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ki(t[n]/255)*255):t[n]=Ki(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ru=0;class gh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ru++}),this.uuid=as(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Zr(s[a].image)):r.push(Zr(s[a]))}else r=Zr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Zr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?mh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Cu=0;class zt extends _i{constructor(e=zt.DEFAULT_IMAGE,t=zt.DEFAULT_MAPPING,n=fn,s=fn,r=nn,a=Ts,o=pn,l=Jn,c=zt.DEFAULT_ANISOTROPY,h=on){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cu++}),this.uuid=as(),this.name="",this.source=new gh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ie(0,0),this.repeat=new Ie(1,1),this.center=new Ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Ms("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===pi?ft:on),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ih)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case qo:e.x=e.x-Math.floor(e.x);break;case fn:e.x=e.x<0?0:1;break;case Ko:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case qo:e.y=e.y-Math.floor(e.y);break;case fn:e.y=e.y<0?0:1;break;case Ko:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Ms("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===ft?pi:dh}set encoding(e){Ms("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===pi?ft:on}}zt.DEFAULT_IMAGE=null;zt.DEFAULT_MAPPING=ih;zt.DEFAULT_ANISOTROPY=1;class lt{constructor(e=0,t=0,n=0,s=1){lt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],d=l[8],p=l[1],m=l[5],g=l[9],_=l[2],f=l[6],u=l[10];if(Math.abs(h-p)<.01&&Math.abs(d-_)<.01&&Math.abs(g-f)<.01){if(Math.abs(h+p)<.1&&Math.abs(d+_)<.1&&Math.abs(g+f)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,T=(m+1)/2,I=(u+1)/2,A=(h+p)/4,R=(d+_)/4,H=(g+f)/4;return v>T&&v>I?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=A/n,r=R/n):T>I?T<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(T),n=A/s,r=H/s):I<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(I),n=R/r,s=H/r),this.set(n,s,r,t),this}let b=Math.sqrt((f-g)*(f-g)+(d-_)*(d-_)+(p-h)*(p-h));return Math.abs(b)<.001&&(b=1),this.x=(f-g)/b,this.y=(d-_)/b,this.z=(p-h)/b,this.w=Math.acos((c+m+u-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Pu extends _i{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t);const s={width:e,height:t,depth:1};n.encoding!==void 0&&(Ms("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===pi?ft:on),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:nn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new zt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new gh(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class mn extends Pu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class _h extends zt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Lu extends zt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class gi{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const p=r[a+0],m=r[a+1],g=r[a+2],_=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=p,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==p||c!==m||h!==g){let f=1-o;const u=l*p+c*m+h*g+d*_,b=u>=0?1:-1,v=1-u*u;if(v>Number.EPSILON){const I=Math.sqrt(v),A=Math.atan2(I,u*b);f=Math.sin(f*A)/I,o=Math.sin(o*A)/I}const T=o*b;if(l=l*f+p*T,c=c*f+m*T,h=h*f+g*T,d=d*f+_*T,f===1-o){const I=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=I,c*=I,h*=I,d*=I}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],p=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+h*d+l*m-c*p,e[t+1]=l*g+h*p+c*d-o*m,e[t+2]=c*g+h*m+o*p-l*d,e[t+3]=h*g-o*d-l*p-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),p=l(n/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=p*h*d+c*m*g,this._y=c*m*d-p*h*g,this._z=c*h*g+p*m*d,this._w=c*h*d-p*m*g;break;case"YXZ":this._x=p*h*d+c*m*g,this._y=c*m*d-p*h*g,this._z=c*h*g-p*m*d,this._w=c*h*d+p*m*g;break;case"ZXY":this._x=p*h*d-c*m*g,this._y=c*m*d+p*h*g,this._z=c*h*g+p*m*d,this._w=c*h*d-p*m*g;break;case"ZYX":this._x=p*h*d-c*m*g,this._y=c*m*d+p*h*g,this._z=c*h*g-p*m*d,this._w=c*h*d+p*m*g;break;case"YZX":this._x=p*h*d+c*m*g,this._y=c*m*d+p*h*g,this._z=c*h*g-p*m*d,this._w=c*h*d-p*m*g;break;case"XZY":this._x=p*h*d-c*m*g,this._y=c*m*d-p*h*g,this._z=c*h*g+p*m*d,this._w=c*h*d+p*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],p=n+o+d;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>d){const m=2*Math.sqrt(1+n-o-d);this._w=(h-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>d){const m=2*Math.sqrt(1+o-n-d);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+d-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ct(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,p=Math.sin(t*h)/c;return this._w=a*d+this._w*p,this._x=n*d+this._x*p,this._y=s*d+this._y*p,this._z=r*d+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(s),n*Math.sin(r),n*Math.cos(r),t*Math.sin(s))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,n=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(yl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(yl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Jr.copy(this).projectOnVector(e),this.sub(Jr)}reflect(e){return this.sub(Jr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Jr=new D,yl=new gi;class ls{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(an.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(an.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=an.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,an):an.fromBufferAttribute(r,a),an.applyMatrix4(e.matrixWorld),this.expandByPoint(an);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Fs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Fs.copy(n.boundingBox)),Fs.applyMatrix4(e.matrixWorld),this.union(Fs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,an),an.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(fs),Ns.subVectors(this.max,fs),Si.subVectors(e.a,fs),Ei.subVectors(e.b,fs),wi.subVectors(e.c,fs),Gn.subVectors(Ei,Si),zn.subVectors(wi,Ei),ni.subVectors(Si,wi);let t=[0,-Gn.z,Gn.y,0,-zn.z,zn.y,0,-ni.z,ni.y,Gn.z,0,-Gn.x,zn.z,0,-zn.x,ni.z,0,-ni.x,-Gn.y,Gn.x,0,-zn.y,zn.x,0,-ni.y,ni.x,0];return!Qr(t,Si,Ei,wi,Ns)||(t=[1,0,0,0,1,0,0,0,1],!Qr(t,Si,Ei,wi,Ns))?!1:(Os.crossVectors(Gn,zn),t=[Os.x,Os.y,Os.z],Qr(t,Si,Ei,wi,Ns))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,an).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(an).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const wn=[new D,new D,new D,new D,new D,new D,new D,new D],an=new D,Fs=new ls,Si=new D,Ei=new D,wi=new D,Gn=new D,zn=new D,ni=new D,fs=new D,Ns=new D,Os=new D,ii=new D;function Qr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ii.fromArray(i,r);const o=s.x*Math.abs(ii.x)+s.y*Math.abs(ii.y)+s.z*Math.abs(ii.z),l=e.dot(ii),c=t.dot(ii),h=n.dot(ii);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Du=new ls,ps=new D,eo=new D;class Ps{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Du.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ps.subVectors(e,this.center);const t=ps.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ps,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(eo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ps.copy(e.center).add(eo)),this.expandByPoint(ps.copy(e.center).sub(eo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Tn=new D,to=new D,Bs=new D,Hn=new D,no=new D,ks=new D,io=new D;class cs{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Tn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Tn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Tn.copy(this.origin).addScaledVector(this.direction,t),Tn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){to.copy(e).add(t).multiplyScalar(.5),Bs.copy(t).sub(e).normalize(),Hn.copy(this.origin).sub(to);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Bs),o=Hn.dot(this.direction),l=-Hn.dot(Bs),c=Hn.lengthSq(),h=Math.abs(1-a*a);let d,p,m,g;if(h>0)if(d=a*l-o,p=a*o-l,g=r*h,d>=0)if(p>=-g)if(p<=g){const _=1/h;d*=_,p*=_,m=d*(d+a*p+2*o)+p*(a*d+p+2*l)+c}else p=r,d=Math.max(0,-(a*p+o)),m=-d*d+p*(p+2*l)+c;else p=-r,d=Math.max(0,-(a*p+o)),m=-d*d+p*(p+2*l)+c;else p<=-g?(d=Math.max(0,-(-a*r+o)),p=d>0?-r:Math.min(Math.max(-r,-l),r),m=-d*d+p*(p+2*l)+c):p<=g?(d=0,p=Math.min(Math.max(-r,-l),r),m=p*(p+2*l)+c):(d=Math.max(0,-(a*r+o)),p=d>0?r:Math.min(Math.max(-r,-l),r),m=-d*d+p*(p+2*l)+c);else p=a>0?-r:r,d=Math.max(0,-(a*p+o)),m=-d*d+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(to).addScaledVector(Bs,p),m}intersectSphere(e,t){Tn.subVectors(e.center,this.origin);const n=Tn.dot(this.direction),s=Tn.dot(Tn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,p=this.origin;return c>=0?(n=(e.min.x-p.x)*c,s=(e.max.x-p.x)*c):(n=(e.max.x-p.x)*c,s=(e.min.x-p.x)*c),h>=0?(r=(e.min.y-p.y)*h,a=(e.max.y-p.y)*h):(r=(e.max.y-p.y)*h,a=(e.min.y-p.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-p.z)*d,l=(e.max.z-p.z)*d):(o=(e.max.z-p.z)*d,l=(e.min.z-p.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Tn)!==null}intersectTriangle(e,t,n,s,r){no.subVectors(t,e),ks.subVectors(n,e),io.crossVectors(no,ks);let a=this.direction.dot(io),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Hn.subVectors(this.origin,e);const l=o*this.direction.dot(ks.crossVectors(Hn,ks));if(l<0)return null;const c=o*this.direction.dot(no.cross(Hn));if(c<0||l+c>a)return null;const h=-o*Hn.dot(io);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ct{constructor(e,t,n,s,r,a,o,l,c,h,d,p,m,g,_,f){ct.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,d,p,m,g,_,f)}set(e,t,n,s,r,a,o,l,c,h,d,p,m,g,_,f){const u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=s,u[1]=r,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=p,u[3]=m,u[7]=g,u[11]=_,u[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ct().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Ti.setFromMatrixColumn(e,0).length(),r=1/Ti.setFromMatrixColumn(e,1).length(),a=1/Ti.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const p=a*h,m=a*d,g=o*h,_=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=m+g*c,t[5]=p-_*c,t[9]=-o*l,t[2]=_-p*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){const p=l*h,m=l*d,g=c*h,_=c*d;t[0]=p+_*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=m*o-g,t[6]=_+p*o,t[10]=a*l}else if(e.order==="ZXY"){const p=l*h,m=l*d,g=c*h,_=c*d;t[0]=p-_*o,t[4]=-a*d,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*h,t[9]=_-p*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const p=a*h,m=a*d,g=o*h,_=o*d;t[0]=l*h,t[4]=g*c-m,t[8]=p*c+_,t[1]=l*d,t[5]=_*c+p,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const p=a*l,m=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-p*d,t[8]=g*d+m,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*d+g,t[10]=p-_*d}else if(e.order==="XZY"){const p=a*l,m=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=p*d+_,t[5]=a*h,t[9]=m*d-g,t[2]=g*d-m,t[6]=o*h,t[10]=_*d+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Iu,e,Uu)}lookAt(e,t,n){const s=this.elements;return qt.subVectors(e,t),qt.lengthSq()===0&&(qt.z=1),qt.normalize(),Vn.crossVectors(n,qt),Vn.lengthSq()===0&&(Math.abs(n.z)===1?qt.x+=1e-4:qt.z+=1e-4,qt.normalize(),Vn.crossVectors(n,qt)),Vn.normalize(),Gs.crossVectors(qt,Vn),s[0]=Vn.x,s[4]=Gs.x,s[8]=qt.x,s[1]=Vn.y,s[5]=Gs.y,s[9]=qt.y,s[2]=Vn.z,s[6]=Gs.z,s[10]=qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],p=n[9],m=n[13],g=n[2],_=n[6],f=n[10],u=n[14],b=n[3],v=n[7],T=n[11],I=n[15],A=s[0],R=s[4],H=s[8],M=s[12],w=s[1],z=s[5],X=s[9],de=s[13],F=s[2],B=s[6],K=s[10],oe=s[14],re=s[3],te=s[7],le=s[11],ue=s[15];return r[0]=a*A+o*w+l*F+c*re,r[4]=a*R+o*z+l*B+c*te,r[8]=a*H+o*X+l*K+c*le,r[12]=a*M+o*de+l*oe+c*ue,r[1]=h*A+d*w+p*F+m*re,r[5]=h*R+d*z+p*B+m*te,r[9]=h*H+d*X+p*K+m*le,r[13]=h*M+d*de+p*oe+m*ue,r[2]=g*A+_*w+f*F+u*re,r[6]=g*R+_*z+f*B+u*te,r[10]=g*H+_*X+f*K+u*le,r[14]=g*M+_*de+f*oe+u*ue,r[3]=b*A+v*w+T*F+I*re,r[7]=b*R+v*z+T*B+I*te,r[11]=b*H+v*X+T*K+I*le,r[15]=b*M+v*de+T*oe+I*ue,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],p=e[10],m=e[14],g=e[3],_=e[7],f=e[11],u=e[15];return g*(+r*l*d-s*c*d-r*o*p+n*c*p+s*o*m-n*l*m)+_*(+t*l*m-t*c*p+r*a*p-s*a*m+s*c*h-r*l*h)+f*(+t*c*d-t*o*m-r*a*d+n*a*m+r*o*h-n*c*h)+u*(-s*o*h-t*l*d+t*o*p+s*a*d-n*a*p+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],p=e[10],m=e[11],g=e[12],_=e[13],f=e[14],u=e[15],b=d*f*c-_*p*c+_*l*m-o*f*m-d*l*u+o*p*u,v=g*p*c-h*f*c-g*l*m+a*f*m+h*l*u-a*p*u,T=h*_*c-g*d*c+g*o*m-a*_*m-h*o*u+a*d*u,I=g*d*l-h*_*l-g*o*p+a*_*p+h*o*f-a*d*f,A=t*b+n*v+s*T+r*I;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return e[0]=b*R,e[1]=(_*p*r-d*f*r-_*s*m+n*f*m+d*s*u-n*p*u)*R,e[2]=(o*f*r-_*l*r+_*s*c-n*f*c-o*s*u+n*l*u)*R,e[3]=(d*l*r-o*p*r-d*s*c+n*p*c+o*s*m-n*l*m)*R,e[4]=v*R,e[5]=(h*f*r-g*p*r+g*s*m-t*f*m-h*s*u+t*p*u)*R,e[6]=(g*l*r-a*f*r-g*s*c+t*f*c+a*s*u-t*l*u)*R,e[7]=(a*p*r-h*l*r+h*s*c-t*p*c-a*s*m+t*l*m)*R,e[8]=T*R,e[9]=(g*d*r-h*_*r-g*n*m+t*_*m+h*n*u-t*d*u)*R,e[10]=(a*_*r-g*o*r+g*n*c-t*_*c-a*n*u+t*o*u)*R,e[11]=(h*o*r-a*d*r-h*n*c+t*d*c+a*n*m-t*o*m)*R,e[12]=I*R,e[13]=(h*_*s-g*d*s+g*n*p-t*_*p-h*n*f+t*d*f)*R,e[14]=(g*o*s-a*_*s-g*n*l+t*_*l+a*n*f-t*o*f)*R,e[15]=(a*d*s-h*o*s+h*n*l-t*d*l-a*n*p+t*o*p)*R,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,d=o+o,p=r*c,m=r*h,g=r*d,_=a*h,f=a*d,u=o*d,b=l*c,v=l*h,T=l*d,I=n.x,A=n.y,R=n.z;return s[0]=(1-(_+u))*I,s[1]=(m+T)*I,s[2]=(g-v)*I,s[3]=0,s[4]=(m-T)*A,s[5]=(1-(p+u))*A,s[6]=(f+b)*A,s[7]=0,s[8]=(g+v)*R,s[9]=(f-b)*R,s[10]=(1-(p+_))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Ti.set(s[0],s[1],s[2]).length();const a=Ti.set(s[4],s[5],s[6]).length(),o=Ti.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],ln.copy(this);const c=1/r,h=1/a,d=1/o;return ln.elements[0]*=c,ln.elements[1]*=c,ln.elements[2]*=c,ln.elements[4]*=h,ln.elements[5]*=h,ln.elements[6]*=h,ln.elements[8]*=d,ln.elements[9]*=d,ln.elements[10]*=d,t.setFromRotationMatrix(ln),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Fn){const l=this.elements,c=2*r/(t-e),h=2*r/(n-s),d=(t+e)/(t-e),p=(n+s)/(n-s);let m,g;if(o===Fn)m=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===wr)m=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Fn){const l=this.elements,c=1/(t-e),h=1/(n-s),d=1/(a-r),p=(t+e)*c,m=(n+s)*h;let g,_;if(o===Fn)g=(a+r)*d,_=-2*d;else if(o===wr)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-p,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ti=new D,ln=new ct,Iu=new D(0,0,0),Uu=new D(1,1,1),Vn=new D,Gs=new D,qt=new D,Sl=new ct,El=new gi;class Fr{constructor(e=0,t=0,n=0,s=Fr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ct(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ct(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ct(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ct(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Sl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Sl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return El.setFromEuler(this),this.setFromQuaternion(El,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Fr.DEFAULT_ORDER="XYZ";class ga{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Fu=0;const wl=new D,Ai=new gi,An=new ct,zs=new D,ms=new D,Nu=new D,Ou=new gi,Tl=new D(1,0,0),Al=new D(0,1,0),Rl=new D(0,0,1),Bu={type:"added"},ku={type:"removed"};class St extends _i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=as(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=St.DEFAULT_UP.clone();const e=new D,t=new Fr,n=new gi,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ct},normalMatrix:{value:new Qe}}),this.matrix=new ct,this.matrixWorld=new ct,this.matrixAutoUpdate=St.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ga,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ai.setFromAxisAngle(e,t),this.quaternion.multiply(Ai),this}rotateOnWorldAxis(e,t){return Ai.setFromAxisAngle(e,t),this.quaternion.premultiply(Ai),this}rotateX(e){return this.rotateOnAxis(Tl,e)}rotateY(e){return this.rotateOnAxis(Al,e)}rotateZ(e){return this.rotateOnAxis(Rl,e)}translateOnAxis(e,t){return wl.copy(e).applyQuaternion(this.quaternion),this.position.add(wl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Tl,e)}translateY(e){return this.translateOnAxis(Al,e)}translateZ(e){return this.translateOnAxis(Rl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(An.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?zs.copy(e):zs.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?An.lookAt(ms,zs,this.up):An.lookAt(zs,ms,this.up),this.quaternion.setFromRotationMatrix(An),s&&(An.extractRotation(s.matrixWorld),Ai.setFromRotationMatrix(An),this.quaternion.premultiply(Ai.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Bu)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ku)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),An.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),An.multiply(e.parent.matrixWorld)),e.applyMatrix4(An),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,e,Nu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,Ou,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),p=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),p.length>0&&(n.skeletons=p),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}St.DEFAULT_UP=new D(0,1,0);St.DEFAULT_MATRIX_AUTO_UPDATE=!0;St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const cn=new D,Rn=new D,so=new D,Cn=new D,Ri=new D,Ci=new D,Cl=new D,ro=new D,oo=new D,ao=new D;let Hs=!1;class sn{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),cn.subVectors(e,t),s.cross(cn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){cn.subVectors(s,t),Rn.subVectors(n,t),so.subVectors(e,t);const a=cn.dot(cn),o=cn.dot(Rn),l=cn.dot(so),c=Rn.dot(Rn),h=Rn.dot(so),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const p=1/d,m=(c*l-o*h)*p,g=(a*h-o*l)*p;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Cn)===null?!1:Cn.x>=0&&Cn.y>=0&&Cn.x+Cn.y<=1}static getUV(e,t,n,s,r,a,o,l){return Hs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Hs=!0),this.getInterpolation(e,t,n,s,r,a,o,l)}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Cn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Cn.x),l.addScaledVector(a,Cn.y),l.addScaledVector(o,Cn.z),l)}static isFrontFacing(e,t,n,s){return cn.subVectors(n,t),Rn.subVectors(e,t),cn.cross(Rn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return cn.subVectors(this.c,this.b),Rn.subVectors(this.a,this.b),cn.cross(Rn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return sn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return sn.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,s,r){return Hs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Hs=!0),sn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}getInterpolation(e,t,n,s,r){return sn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return sn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return sn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Ri.subVectors(s,n),Ci.subVectors(r,n),ro.subVectors(e,n);const l=Ri.dot(ro),c=Ci.dot(ro);if(l<=0&&c<=0)return t.copy(n);oo.subVectors(e,s);const h=Ri.dot(oo),d=Ci.dot(oo);if(h>=0&&d<=h)return t.copy(s);const p=l*d-h*c;if(p<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Ri,a);ao.subVectors(e,r);const m=Ri.dot(ao),g=Ci.dot(ao);if(g>=0&&m<=g)return t.copy(r);const _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Ci,o);const f=h*g-m*d;if(f<=0&&d-h>=0&&m-g>=0)return Cl.subVectors(r,s),o=(d-h)/(d-h+(m-g)),t.copy(s).addScaledVector(Cl,o);const u=1/(f+_+p);return a=_*u,o=p*u,t.copy(n).addScaledVector(Ri,a).addScaledVector(Ci,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const vh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wn={h:0,s:0,l:0},Vs={h:0,s:0,l:0};function lo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Pe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ft){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=rt.workingColorSpace){return this.r=e,this.g=t,this.b=n,rt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=rt.workingColorSpace){if(e=pa(e,1),t=Ct(t,0,1),n=Ct(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=lo(a,r,e+1/3),this.g=lo(a,r,e),this.b=lo(a,r,e-1/3)}return rt.toWorkingColorSpace(this,s),this}setStyle(e,t=ft){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ft){const n=vh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ki(e.r),this.g=Ki(e.g),this.b=Ki(e.b),this}copyLinearToSRGB(e){return this.r=jr(e.r),this.g=jr(e.g),this.b=jr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ft){return rt.fromWorkingColorSpace(It.copy(this),e),Math.round(Ct(It.r*255,0,255))*65536+Math.round(Ct(It.g*255,0,255))*256+Math.round(Ct(It.b*255,0,255))}getHexString(e=ft){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=rt.workingColorSpace){rt.fromWorkingColorSpace(It.copy(this),t);const n=It.r,s=It.g,r=It.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=rt.workingColorSpace){return rt.fromWorkingColorSpace(It.copy(this),t),e.r=It.r,e.g=It.g,e.b=It.b,e}getStyle(e=ft){rt.fromWorkingColorSpace(It.copy(this),e);const t=It.r,n=It.g,s=It.b;return e!==ft?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Wn),this.setHSL(Wn.h+e,Wn.s+t,Wn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Wn),e.getHSL(Vs);const n=xs(Wn.h,Vs.h,t),s=xs(Wn.s,Vs.s,t),r=xs(Wn.l,Vs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const It=new Pe;Pe.NAMES=vh;let Gu=0;class vi extends _i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Gu++}),this.uuid=as(),this.name="",this.type="Material",this.blending=$i,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wo,this.blendDst=Xo,this.blendEquation=li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=Mr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ml,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mi,this.stencilZFail=Mi,this.stencilZPass=Mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==$i&&(n.blending=this.blending),this.side!==Qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Wo&&(n.blendSrc=this.blendSrc),this.blendDst!==Xo&&(n.blendDst=this.blendDst),this.blendEquation!==li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Mr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ml&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ls extends vi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Jc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const bt=new D,Ws=new Ie;class Ht{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=gl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=$n,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ws.fromBufferAttribute(this,t),Ws.applyMatrix3(e),this.setXY(t,Ws.x,Ws.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Vi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ft(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Vi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Vi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Vi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Vi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array),s=Ft(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),n=Ft(n,this.array),s=Ft(s,this.array),r=Ft(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==gl&&(e.usage=this.usage),e}}class bh extends Ht{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class xh extends Ht{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class mt extends Ht{constructor(e,t,n){super(new Float32Array(e),t,n)}}let zu=0;const en=new ct,co=new St,Pi=new D,Kt=new ls,gs=new ls,At=new D;class Rt extends _i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=as(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ph(e)?xh:bh)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return en.makeRotationFromQuaternion(e),this.applyMatrix4(en),this}rotateX(e){return en.makeRotationX(e),this.applyMatrix4(en),this}rotateY(e){return en.makeRotationY(e),this.applyMatrix4(en),this}rotateZ(e){return en.makeRotationZ(e),this.applyMatrix4(en),this}translate(e,t,n){return en.makeTranslation(e,t,n),this.applyMatrix4(en),this}scale(e,t,n){return en.makeScale(e,t,n),this.applyMatrix4(en),this}lookAt(e){return co.lookAt(e),co.updateMatrix(),this.applyMatrix4(co.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Pi).negate(),this.translate(Pi.x,Pi.y,Pi.z),this}setFromPoints(e){const t=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new mt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ls);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Kt.setFromBufferAttribute(r),this.morphTargetsRelative?(At.addVectors(this.boundingBox.min,Kt.min),this.boundingBox.expandByPoint(At),At.addVectors(this.boundingBox.max,Kt.max),this.boundingBox.expandByPoint(At)):(this.boundingBox.expandByPoint(Kt.min),this.boundingBox.expandByPoint(Kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ps);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(Kt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];gs.setFromBufferAttribute(o),this.morphTargetsRelative?(At.addVectors(Kt.min,gs.min),Kt.expandByPoint(At),At.addVectors(Kt.max,gs.max),Kt.expandByPoint(At)):(Kt.expandByPoint(gs.min),Kt.expandByPoint(gs.max))}Kt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)At.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(At));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)At.fromBufferAttribute(o,c),l&&(Pi.fromBufferAttribute(e,c),At.add(Pi)),s=Math.max(s,n.distanceToSquared(At))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,s=t.position.array,r=t.normal.array,a=t.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ht(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let w=0;w<o;w++)c[w]=new D,h[w]=new D;const d=new D,p=new D,m=new D,g=new Ie,_=new Ie,f=new Ie,u=new D,b=new D;function v(w,z,X){d.fromArray(s,w*3),p.fromArray(s,z*3),m.fromArray(s,X*3),g.fromArray(a,w*2),_.fromArray(a,z*2),f.fromArray(a,X*2),p.sub(d),m.sub(d),_.sub(g),f.sub(g);const de=1/(_.x*f.y-f.x*_.y);isFinite(de)&&(u.copy(p).multiplyScalar(f.y).addScaledVector(m,-_.y).multiplyScalar(de),b.copy(m).multiplyScalar(_.x).addScaledVector(p,-f.x).multiplyScalar(de),c[w].add(u),c[z].add(u),c[X].add(u),h[w].add(b),h[z].add(b),h[X].add(b))}let T=this.groups;T.length===0&&(T=[{start:0,count:n.length}]);for(let w=0,z=T.length;w<z;++w){const X=T[w],de=X.start,F=X.count;for(let B=de,K=de+F;B<K;B+=3)v(n[B+0],n[B+1],n[B+2])}const I=new D,A=new D,R=new D,H=new D;function M(w){R.fromArray(r,w*3),H.copy(R);const z=c[w];I.copy(z),I.sub(R.multiplyScalar(R.dot(z))).normalize(),A.crossVectors(H,z);const de=A.dot(h[w])<0?-1:1;l[w*4]=I.x,l[w*4+1]=I.y,l[w*4+2]=I.z,l[w*4+3]=de}for(let w=0,z=T.length;w<z;++w){const X=T[w],de=X.start,F=X.count;for(let B=de,K=de+F;B<K;B+=3)M(n[B+0]),M(n[B+1]),M(n[B+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ht(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let p=0,m=n.count;p<m;p++)n.setXYZ(p,0,0,0);const s=new D,r=new D,a=new D,o=new D,l=new D,c=new D,h=new D,d=new D;if(e)for(let p=0,m=e.count;p<m;p+=3){const g=e.getX(p+0),_=e.getX(p+1),f=e.getX(p+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,f),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,f),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),a.fromBufferAttribute(t,p+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)At.fromBufferAttribute(e,t),At.normalize(),e.setXYZ(t,At.x,At.y,At.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,p=new c.constructor(l.length*h);let m=0,g=0;for(let _=0,f=l.length;_<f;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*h;for(let u=0;u<h;u++)p[g++]=c[m++]}return new Ht(p,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Rt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const p=c[h],m=e(p,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,p=c.length;d<p;d++){const m=c[d];h.push(m.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],d=r[c];for(let p=0,m=d.length;p<m;p++)h.push(d[p].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Pl=new ct,si=new cs,Xs=new Ps,Ll=new D,Li=new D,Di=new D,Ii=new D,ho=new D,Ys=new D,$s=new Ie,qs=new Ie,Ks=new Ie,Dl=new D,Il=new D,Ul=new D,js=new D,Zs=new D;class Ve extends St{constructor(e=new Rt,t=new Ls){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Ys.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(ho.fromBufferAttribute(d,e),a?Ys.addScaledVector(ho,h):Ys.addScaledVector(ho.sub(t),h))}t.add(Ys)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xs.copy(n.boundingSphere),Xs.applyMatrix4(r),si.copy(e.ray).recast(e.near),!(Xs.containsPoint(si.origin)===!1&&(si.intersectSphere(Xs,Ll)===null||si.origin.distanceToSquared(Ll)>(e.far-e.near)**2))&&(Pl.copy(r).invert(),si.copy(e.ray).applyMatrix4(Pl),!(n.boundingBox!==null&&si.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,si)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,p=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=p.length;g<_;g++){const f=p[g],u=a[f.materialIndex],b=Math.max(f.start,m.start),v=Math.min(o.count,Math.min(f.start+f.count,m.start+m.count));for(let T=b,I=v;T<I;T+=3){const A=o.getX(T),R=o.getX(T+1),H=o.getX(T+2);s=Js(this,u,e,n,c,h,d,A,R,H),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let f=g,u=_;f<u;f+=3){const b=o.getX(f),v=o.getX(f+1),T=o.getX(f+2);s=Js(this,a,e,n,c,h,d,b,v,T),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=p.length;g<_;g++){const f=p[g],u=a[f.materialIndex],b=Math.max(f.start,m.start),v=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));for(let T=b,I=v;T<I;T+=3){const A=T,R=T+1,H=T+2;s=Js(this,u,e,n,c,h,d,A,R,H),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let f=g,u=_;f<u;f+=3){const b=f,v=f+1,T=f+2;s=Js(this,a,e,n,c,h,d,b,v,T),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}}function Hu(i,e,t,n,s,r,a,o){let l;if(e.side===Gt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Qn,o),l===null)return null;Zs.copy(o),Zs.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Zs);return c<t.near||c>t.far?null:{distance:c,point:Zs.clone(),object:i}}function Js(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Li),i.getVertexPosition(l,Di),i.getVertexPosition(c,Ii);const h=Hu(i,e,t,n,Li,Di,Ii,js);if(h){s&&($s.fromBufferAttribute(s,o),qs.fromBufferAttribute(s,l),Ks.fromBufferAttribute(s,c),h.uv=sn.getInterpolation(js,Li,Di,Ii,$s,qs,Ks,new Ie)),r&&($s.fromBufferAttribute(r,o),qs.fromBufferAttribute(r,l),Ks.fromBufferAttribute(r,c),h.uv1=sn.getInterpolation(js,Li,Di,Ii,$s,qs,Ks,new Ie),h.uv2=h.uv1),a&&(Dl.fromBufferAttribute(a,o),Il.fromBufferAttribute(a,l),Ul.fromBufferAttribute(a,c),h.normal=sn.getInterpolation(js,Li,Di,Ii,Dl,Il,Ul,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new D,materialIndex:0};sn.getNormal(Li,Di,Ii,d.normal),h.face=d}return h}class Pt extends Rt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let p=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new mt(c,3)),this.setAttribute("normal",new mt(h,3)),this.setAttribute("uv",new mt(d,2));function g(_,f,u,b,v,T,I,A,R,H,M){const w=T/R,z=I/H,X=T/2,de=I/2,F=A/2,B=R+1,K=H+1;let oe=0,re=0;const te=new D;for(let le=0;le<K;le++){const ue=le*z-de;for(let ne=0;ne<B;ne++){const k=ne*w-X;te[_]=k*b,te[f]=ue*v,te[u]=F,c.push(te.x,te.y,te.z),te[_]=0,te[f]=0,te[u]=A>0?1:-1,h.push(te.x,te.y,te.z),d.push(ne/R),d.push(1-le/H),oe+=1}}for(let le=0;le<H;le++)for(let ue=0;ue<R;ue++){const ne=p+ue+B*le,k=p+ue+B*(le+1),se=p+(ue+1)+B*(le+1),xe=p+(ue+1)+B*le;l.push(ne,k,xe),l.push(k,se,xe),re+=6}o.addGroup(m,re,M),m+=re,p+=oe}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ts(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Nt(i){const e={};for(let t=0;t<i.length;t++){const n=ts(i[t]);for(const s in n)e[s]=n[s]}return e}function Vu(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Mh(i){return i.getRenderTarget()===null?i.outputColorSpace:rt.workingColorSpace}const Cs={clone:ts,merge:Nt};var Wu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class yt extends vi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wu,this.fragmentShader=Xu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ts(e.uniforms),this.uniformsGroups=Vu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class yh extends St{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ct,this.projectionMatrix=new ct,this.projectionMatrixInverse=new ct,this.coordinateSystem=Fn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Xt extends yh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=As*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(qi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return As*2*Math.atan(Math.tan(qi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(qi*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ui=-90,Fi=1;class Yu extends St{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Xt(Ui,Fi,e,t);s.layers=this.layers,this.add(s);const r=new Xt(Ui,Fi,e,t);r.layers=this.layers,this.add(r);const a=new Xt(Ui,Fi,e,t);a.layers=this.layers,this.add(a);const o=new Xt(Ui,Fi,e,t);o.layers=this.layers,this.add(o);const l=new Xt(Ui,Fi,e,t);l.layers=this.layers,this.add(l);const c=new Xt(Ui,Fi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Fn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===wr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(d,p,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Sh extends zt{constructor(e,t,n,s,r,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Ji,super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class $u extends mn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];t.encoding!==void 0&&(Ms("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===pi?ft:on),this.texture=new Sh(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:nn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Pt(5,5,5),r=new yt({name:"CubemapFromEquirect",uniforms:ts(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Gt,blending:Nn});r.uniforms.tEquirect.value=t;const a=new Ve(s,r),o=t.minFilter;return t.minFilter===Ts&&(t.minFilter=nn),new Yu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}const uo=new D,qu=new D,Ku=new Qe;class Un{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=uo.subVectors(n,t).cross(qu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(uo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Ku.getNormalMatrix(e),s=this.coplanarPoint(uo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ri=new Ps,Qs=new D;class _a{constructor(e=new Un,t=new Un,n=new Un,s=new Un,r=new Un,a=new Un){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Fn){const n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],h=s[5],d=s[6],p=s[7],m=s[8],g=s[9],_=s[10],f=s[11],u=s[12],b=s[13],v=s[14],T=s[15];if(n[0].setComponents(l-r,p-c,f-m,T-u).normalize(),n[1].setComponents(l+r,p+c,f+m,T+u).normalize(),n[2].setComponents(l+a,p+h,f+g,T+b).normalize(),n[3].setComponents(l-a,p-h,f-g,T-b).normalize(),n[4].setComponents(l-o,p-d,f-_,T-v).normalize(),t===Fn)n[5].setComponents(l+o,p+d,f+_,T+v).normalize();else if(t===wr)n[5].setComponents(o,d,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(e){return ri.center.set(0,0,0),ri.radius=.7071067811865476,ri.applyMatrix4(e.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Qs.x=s.normal.x>0?e.max.x:e.min.x,Qs.y=s.normal.y>0?e.max.y:e.min.y,Qs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Qs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Eh(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ju(i,e){const t=e.isWebGL2,n=new WeakMap;function s(c,h){const d=c.array,p=c.usage,m=d.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,d,p),c.onUploadCallback();let _;if(d instanceof Float32Array)_=i.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)_=i.SHORT;else if(d instanceof Uint32Array)_=i.UNSIGNED_INT;else if(d instanceof Int32Array)_=i.INT;else if(d instanceof Int8Array)_=i.BYTE;else if(d instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:g,type:_,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version,size:m}}function r(c,h,d){const p=h.array,m=h._updateRange,g=h.updateRanges;if(i.bindBuffer(d,c),m.count===-1&&g.length===0&&i.bufferSubData(d,0,p),g.length!==0){for(let _=0,f=g.length;_<f;_++){const u=g[_];t?i.bufferSubData(d,u.start*p.BYTES_PER_ELEMENT,p,u.start,u.count):i.bufferSubData(d,u.start*p.BYTES_PER_ELEMENT,p.subarray(u.start,u.start+u.count))}h.clearUpdateRanges()}m.count!==-1&&(t?i.bufferSubData(d,m.offset*p.BYTES_PER_ELEMENT,p,m.offset,m.count):i.bufferSubData(d,m.offset*p.BYTES_PER_ELEMENT,p.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const p=n.get(c);(!p||p.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const d=n.get(c);if(d===void 0)n.set(c,s(c,h));else if(d.version<c.version){if(d.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,c,h),d.version=c.version}}return{get:a,remove:o,update:l}}class ns extends Rt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=e/o,p=t/l,m=[],g=[],_=[],f=[];for(let u=0;u<h;u++){const b=u*p-a;for(let v=0;v<c;v++){const T=v*d-r;g.push(T,-b,0),_.push(0,0,1),f.push(v/o),f.push(1-u/l)}}for(let u=0;u<l;u++)for(let b=0;b<o;b++){const v=b+c*u,T=b+c*(u+1),I=b+1+c*(u+1),A=b+1+c*u;m.push(v,T,A),m.push(T,I,A)}this.setIndex(m),this.setAttribute("position",new mt(g,3)),this.setAttribute("normal",new mt(_,3)),this.setAttribute("uv",new mt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ns(e.width,e.height,e.widthSegments,e.heightSegments)}}var Zu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ju=`#ifdef USE_ALPHAHASH
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
#endif`,Qu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ef=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,nf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sf=`#ifdef USE_AOMAP
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
#endif`,rf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,of=`#ifdef USE_BATCHING
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
#endif`,af=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,lf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,df=`#ifdef USE_IRIDESCENCE
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
#endif`,uf=`#ifdef USE_BUMPMAP
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
#endif`,ff=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,pf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_f=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,vf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Mf=`#define PI 3.141592653589793
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
} // validated`,yf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Sf=`vec3 transformedNormal = objectNormal;
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
#endif`,Ef=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Af=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Rf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Cf=`
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
}`,Pf=`#ifdef USE_ENVMAP
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
#endif`,Lf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Df=`#ifdef USE_ENVMAP
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
#endif`,If=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Uf=`#ifdef USE_ENVMAP
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
#endif`,Ff=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Nf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Of=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Bf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,kf=`#ifdef USE_GRADIENTMAP
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
}`,Gf=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,zf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Hf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Vf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Wf=`uniform bool receiveShadow;
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
#endif`,Xf=`#ifdef USE_ENVMAP
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
#endif`,Yf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$f=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Kf=`varying vec3 vViewPosition;
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
#endif`,Zf=`struct PhysicalMaterial {
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
}`,Jf=`
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
#endif`,Qf=`#if defined( RE_IndirectDiffuse )
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
#endif`,ep=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,tp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,np=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ip=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,sp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,rp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,op=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ap=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,lp=`#if defined( USE_POINTS_UV )
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
#endif`,cp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,dp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,up=`#ifdef USE_MORPHNORMALS
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
#endif`,fp=`#ifdef USE_MORPHTARGETS
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
#endif`,pp=`#ifdef USE_MORPHTARGETS
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
#endif`,mp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,gp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,_p=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,xp=`#ifdef USE_NORMALMAP
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
#endif`,Mp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,yp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Sp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ep=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Tp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ap=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Rp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Cp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Lp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Dp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ip=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Up=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Fp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Np=`float getShadowMask() {
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
}`,Op=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Bp=`#ifdef USE_SKINNING
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
#endif`,kp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gp=`#ifdef USE_SKINNING
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
#endif`,zp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Hp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Vp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Wp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Xp=`#ifdef USE_TRANSMISSION
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
#endif`,Yp=`#ifdef USE_TRANSMISSION
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
#endif`,$p=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,qp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Kp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Zp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Jp=`uniform sampler2D t2D;
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
}`,Qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,em=`#ifdef ENVMAP_TYPE_CUBE
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
}`,tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,im=`#include <common>
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
}`,sm=`#if DEPTH_PACKING == 3200
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
}`,rm=`#define DISTANCE
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
}`,om=`#define DISTANCE
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
}`,am=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cm=`uniform float scale;
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
}`,hm=`uniform vec3 diffuse;
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
}`,dm=`#include <common>
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
}`,um=`uniform vec3 diffuse;
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
}`,fm=`#define LAMBERT
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
}`,pm=`#define LAMBERT
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
}`,mm=`#define MATCAP
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
}`,gm=`#define MATCAP
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
}`,_m=`#define NORMAL
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
}`,vm=`#define NORMAL
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
}`,bm=`#define PHONG
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
}`,xm=`#define PHONG
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
}`,Mm=`#define STANDARD
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
}`,ym=`#define STANDARD
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
}`,Sm=`#define TOON
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
}`,Em=`#define TOON
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
}`,wm=`uniform float size;
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
}`,Tm=`uniform vec3 diffuse;
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
}`,Am=`#include <common>
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
}`,Rm=`uniform vec3 color;
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
}`,Cm=`uniform float rotation;
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
}`,Pm=`uniform vec3 diffuse;
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
}`,Ke={alphahash_fragment:Zu,alphahash_pars_fragment:Ju,alphamap_fragment:Qu,alphamap_pars_fragment:ef,alphatest_fragment:tf,alphatest_pars_fragment:nf,aomap_fragment:sf,aomap_pars_fragment:rf,batching_pars_vertex:of,batching_vertex:af,begin_vertex:lf,beginnormal_vertex:cf,bsdfs:hf,iridescence_fragment:df,bumpmap_pars_fragment:uf,clipping_planes_fragment:ff,clipping_planes_pars_fragment:pf,clipping_planes_pars_vertex:mf,clipping_planes_vertex:gf,color_fragment:_f,color_pars_fragment:vf,color_pars_vertex:bf,color_vertex:xf,common:Mf,cube_uv_reflection_fragment:yf,defaultnormal_vertex:Sf,displacementmap_pars_vertex:Ef,displacementmap_vertex:wf,emissivemap_fragment:Tf,emissivemap_pars_fragment:Af,colorspace_fragment:Rf,colorspace_pars_fragment:Cf,envmap_fragment:Pf,envmap_common_pars_fragment:Lf,envmap_pars_fragment:Df,envmap_pars_vertex:If,envmap_physical_pars_fragment:Xf,envmap_vertex:Uf,fog_vertex:Ff,fog_pars_vertex:Nf,fog_fragment:Of,fog_pars_fragment:Bf,gradientmap_pars_fragment:kf,lightmap_fragment:Gf,lightmap_pars_fragment:zf,lights_lambert_fragment:Hf,lights_lambert_pars_fragment:Vf,lights_pars_begin:Wf,lights_toon_fragment:Yf,lights_toon_pars_fragment:$f,lights_phong_fragment:qf,lights_phong_pars_fragment:Kf,lights_physical_fragment:jf,lights_physical_pars_fragment:Zf,lights_fragment_begin:Jf,lights_fragment_maps:Qf,lights_fragment_end:ep,logdepthbuf_fragment:tp,logdepthbuf_pars_fragment:np,logdepthbuf_pars_vertex:ip,logdepthbuf_vertex:sp,map_fragment:rp,map_pars_fragment:op,map_particle_fragment:ap,map_particle_pars_fragment:lp,metalnessmap_fragment:cp,metalnessmap_pars_fragment:hp,morphcolor_vertex:dp,morphnormal_vertex:up,morphtarget_pars_vertex:fp,morphtarget_vertex:pp,normal_fragment_begin:mp,normal_fragment_maps:gp,normal_pars_fragment:_p,normal_pars_vertex:vp,normal_vertex:bp,normalmap_pars_fragment:xp,clearcoat_normal_fragment_begin:Mp,clearcoat_normal_fragment_maps:yp,clearcoat_pars_fragment:Sp,iridescence_pars_fragment:Ep,opaque_fragment:wp,packing:Tp,premultiplied_alpha_fragment:Ap,project_vertex:Rp,dithering_fragment:Cp,dithering_pars_fragment:Pp,roughnessmap_fragment:Lp,roughnessmap_pars_fragment:Dp,shadowmap_pars_fragment:Ip,shadowmap_pars_vertex:Up,shadowmap_vertex:Fp,shadowmask_pars_fragment:Np,skinbase_vertex:Op,skinning_pars_vertex:Bp,skinning_vertex:kp,skinnormal_vertex:Gp,specularmap_fragment:zp,specularmap_pars_fragment:Hp,tonemapping_fragment:Vp,tonemapping_pars_fragment:Wp,transmission_fragment:Xp,transmission_pars_fragment:Yp,uv_pars_fragment:$p,uv_pars_vertex:qp,uv_vertex:Kp,worldpos_vertex:jp,background_vert:Zp,background_frag:Jp,backgroundCube_vert:Qp,backgroundCube_frag:em,cube_vert:tm,cube_frag:nm,depth_vert:im,depth_frag:sm,distanceRGBA_vert:rm,distanceRGBA_frag:om,equirect_vert:am,equirect_frag:lm,linedashed_vert:cm,linedashed_frag:hm,meshbasic_vert:dm,meshbasic_frag:um,meshlambert_vert:fm,meshlambert_frag:pm,meshmatcap_vert:mm,meshmatcap_frag:gm,meshnormal_vert:_m,meshnormal_frag:vm,meshphong_vert:bm,meshphong_frag:xm,meshphysical_vert:Mm,meshphysical_frag:ym,meshtoon_vert:Sm,meshtoon_frag:Em,points_vert:wm,points_frag:Tm,shadow_vert:Am,shadow_frag:Rm,sprite_vert:Cm,sprite_frag:Pm},Se={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qe}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qe},normalScale:{value:new Ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0},uvTransform:{value:new Qe}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new Ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}}},bn={basic:{uniforms:Nt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:Nt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:Nt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:Nt([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:Nt([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:Nt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:Nt([Se.points,Se.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:Nt([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:Nt([Se.common,Se.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:Nt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:Nt([Se.sprite,Se.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distanceRGBA:{uniforms:Nt([Se.common,Se.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distanceRGBA_vert,fragmentShader:Ke.distanceRGBA_frag},shadow:{uniforms:Nt([Se.lights,Se.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};bn.physical={uniforms:Nt([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qe},clearcoatNormalScale:{value:new Ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qe},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qe},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qe},transmissionSamplerSize:{value:new Ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qe},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qe},anisotropyVector:{value:new Ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qe}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};const er={r:0,b:0,g:0};function Lm(i,e,t,n,s,r,a){const o=new Pe(0);let l=r===!0?0:1,c,h,d=null,p=0,m=null;function g(f,u){let b=!1,v=u.isScene===!0?u.background:null;v&&v.isTexture&&(v=(u.backgroundBlurriness>0?t:e).get(v)),v===null?_(o,l):v&&v.isColor&&(_(v,1),b=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||b)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),v&&(v.isCubeTexture||v.mapping===Ir)?(h===void 0&&(h=new Ve(new Pt(1,1,1),new yt({name:"BackgroundCubeMaterial",uniforms:ts(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=rt.getTransfer(v.colorSpace)!==ot,(d!==v||p!==v.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,d=v,p=v.version,m=i.toneMapping),h.layers.enableAll(),f.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Ve(new ns(2,2),new yt({name:"BackgroundMaterial",uniforms:ts(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,c.material.toneMapped=rt.getTransfer(v.colorSpace)!==ot,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(d!==v||p!==v.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,d=v,p=v.version,m=i.toneMapping),c.layers.enableAll(),f.unshift(c,c.geometry,c.material,0,0,null))}function _(f,u){f.getRGB(er,Mh(i)),n.buffers.color.setClear(er.r,er.g,er.b,u,a)}return{getClearColor:function(){return o},setClearColor:function(f,u=1){o.set(f),l=u,_(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(f){l=f,_(o,l)},render:g}}function Dm(i,e,t,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=f(null);let c=l,h=!1;function d(F,B,K,oe,re){let te=!1;if(a){const le=_(oe,K,B);c!==le&&(c=le,m(c.object)),te=u(F,oe,K,re),te&&b(F,oe,K,re)}else{const le=B.wireframe===!0;(c.geometry!==oe.id||c.program!==K.id||c.wireframe!==le)&&(c.geometry=oe.id,c.program=K.id,c.wireframe=le,te=!0)}re!==null&&t.update(re,i.ELEMENT_ARRAY_BUFFER),(te||h)&&(h=!1,H(F,B,K,oe),re!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(re).buffer))}function p(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function m(F){return n.isWebGL2?i.bindVertexArray(F):r.bindVertexArrayOES(F)}function g(F){return n.isWebGL2?i.deleteVertexArray(F):r.deleteVertexArrayOES(F)}function _(F,B,K){const oe=K.wireframe===!0;let re=o[F.id];re===void 0&&(re={},o[F.id]=re);let te=re[B.id];te===void 0&&(te={},re[B.id]=te);let le=te[oe];return le===void 0&&(le=f(p()),te[oe]=le),le}function f(F){const B=[],K=[],oe=[];for(let re=0;re<s;re++)B[re]=0,K[re]=0,oe[re]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:K,attributeDivisors:oe,object:F,attributes:{},index:null}}function u(F,B,K,oe){const re=c.attributes,te=B.attributes;let le=0;const ue=K.getAttributes();for(const ne in ue)if(ue[ne].location>=0){const se=re[ne];let xe=te[ne];if(xe===void 0&&(ne==="instanceMatrix"&&F.instanceMatrix&&(xe=F.instanceMatrix),ne==="instanceColor"&&F.instanceColor&&(xe=F.instanceColor)),se===void 0||se.attribute!==xe||xe&&se.data!==xe.data)return!0;le++}return c.attributesNum!==le||c.index!==oe}function b(F,B,K,oe){const re={},te=B.attributes;let le=0;const ue=K.getAttributes();for(const ne in ue)if(ue[ne].location>=0){let se=te[ne];se===void 0&&(ne==="instanceMatrix"&&F.instanceMatrix&&(se=F.instanceMatrix),ne==="instanceColor"&&F.instanceColor&&(se=F.instanceColor));const xe={};xe.attribute=se,se&&se.data&&(xe.data=se.data),re[ne]=xe,le++}c.attributes=re,c.attributesNum=le,c.index=oe}function v(){const F=c.newAttributes;for(let B=0,K=F.length;B<K;B++)F[B]=0}function T(F){I(F,0)}function I(F,B){const K=c.newAttributes,oe=c.enabledAttributes,re=c.attributeDivisors;K[F]=1,oe[F]===0&&(i.enableVertexAttribArray(F),oe[F]=1),re[F]!==B&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](F,B),re[F]=B)}function A(){const F=c.newAttributes,B=c.enabledAttributes;for(let K=0,oe=B.length;K<oe;K++)B[K]!==F[K]&&(i.disableVertexAttribArray(K),B[K]=0)}function R(F,B,K,oe,re,te,le){le===!0?i.vertexAttribIPointer(F,B,K,re,te):i.vertexAttribPointer(F,B,K,oe,re,te)}function H(F,B,K,oe){if(n.isWebGL2===!1&&(F.isInstancedMesh||oe.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;v();const re=oe.attributes,te=K.getAttributes(),le=B.defaultAttributeValues;for(const ue in te){const ne=te[ue];if(ne.location>=0){let k=re[ue];if(k===void 0&&(ue==="instanceMatrix"&&F.instanceMatrix&&(k=F.instanceMatrix),ue==="instanceColor"&&F.instanceColor&&(k=F.instanceColor)),k!==void 0){const se=k.normalized,xe=k.itemSize,V=t.get(k);if(V===void 0)continue;const ee=V.buffer,ge=V.type,Me=V.bytesPerElement,be=n.isWebGL2===!0&&(ge===i.INT||ge===i.UNSIGNED_INT||k.gpuType===sh);if(k.isInterleavedBufferAttribute){const De=k.data,O=De.stride,We=k.offset;if(De.isInstancedInterleavedBuffer){for(let fe=0;fe<ne.locationSize;fe++)I(ne.location+fe,De.meshPerAttribute);F.isInstancedMesh!==!0&&oe._maxInstanceCount===void 0&&(oe._maxInstanceCount=De.meshPerAttribute*De.count)}else for(let fe=0;fe<ne.locationSize;fe++)T(ne.location+fe);i.bindBuffer(i.ARRAY_BUFFER,ee);for(let fe=0;fe<ne.locationSize;fe++)R(ne.location+fe,xe/ne.locationSize,ge,se,O*Me,(We+xe/ne.locationSize*fe)*Me,be)}else{if(k.isInstancedBufferAttribute){for(let De=0;De<ne.locationSize;De++)I(ne.location+De,k.meshPerAttribute);F.isInstancedMesh!==!0&&oe._maxInstanceCount===void 0&&(oe._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let De=0;De<ne.locationSize;De++)T(ne.location+De);i.bindBuffer(i.ARRAY_BUFFER,ee);for(let De=0;De<ne.locationSize;De++)R(ne.location+De,xe/ne.locationSize,ge,se,xe*Me,xe/ne.locationSize*De*Me,be)}}else if(le!==void 0){const se=le[ue];if(se!==void 0)switch(se.length){case 2:i.vertexAttrib2fv(ne.location,se);break;case 3:i.vertexAttrib3fv(ne.location,se);break;case 4:i.vertexAttrib4fv(ne.location,se);break;default:i.vertexAttrib1fv(ne.location,se)}}}}A()}function M(){X();for(const F in o){const B=o[F];for(const K in B){const oe=B[K];for(const re in oe)g(oe[re].object),delete oe[re];delete B[K]}delete o[F]}}function w(F){if(o[F.id]===void 0)return;const B=o[F.id];for(const K in B){const oe=B[K];for(const re in oe)g(oe[re].object),delete oe[re];delete B[K]}delete o[F.id]}function z(F){for(const B in o){const K=o[B];if(K[F.id]===void 0)continue;const oe=K[F.id];for(const re in oe)g(oe[re].object),delete oe[re];delete K[F.id]}}function X(){de(),h=!0,c!==l&&(c=l,m(c.object))}function de(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:X,resetDefaultState:de,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfProgram:z,initAttributes:v,enableAttribute:T,disableUnusedAttributes:A}}function Im(i,e,t,n){const s=n.isWebGL2;let r;function a(h){r=h}function o(h,d){i.drawArrays(r,h,d),t.update(d,r,1)}function l(h,d,p){if(p===0)return;let m,g;if(s)m=i,g="drawArraysInstanced";else if(m=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](r,h,d,p),t.update(d,r,p)}function c(h,d,p){if(p===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<p;g++)this.render(h[g],d[g]);else{m.multiDrawArraysWEBGL(r,h,0,d,0,p);let g=0;for(let _=0;_<p;_++)g+=d[_];t.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function Um(i,e,t){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),f=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),u=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),v=p>0,T=a||e.has("OES_texture_float"),I=v&&T,A=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:p,maxTextureSize:m,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:f,maxVaryings:u,maxFragmentUniforms:b,vertexTextures:v,floatFragmentTextures:T,floatVertexTextures:I,maxSamples:A}}function Fm(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Un,o=new Qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,p){const m=d.length!==0||p||n!==0||s;return s=p,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,p){t=h(d,p,0)},this.setState=function(d,p,m){const g=d.clippingPlanes,_=d.clipIntersection,f=d.clipShadows,u=i.get(d);if(!s||g===null||g.length===0||r&&!f)r?h(null):c();else{const b=r?0:n,v=b*4;let T=u.clippingState||null;l.value=T,T=h(g,p,v,m);for(let I=0;I!==v;++I)T[I]=t[I];u.clippingState=T,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,p,m,g){const _=d!==null?d.length:0;let f=null;if(_!==0){if(f=l.value,g!==!0||f===null){const u=m+_*4,b=p.matrixWorldInverse;o.getNormalMatrix(b),(f===null||f.length<u)&&(f=new Float32Array(u));for(let v=0,T=m;v!==_;++v,T+=4)a.copy(d[v]).applyMatrix4(b,o),a.normal.toArray(f,T),f[T+3]=a.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,f}}function Nm(i){let e=new WeakMap;function t(a,o){return o===Yo?a.mapping=Ji:o===$o&&(a.mapping=Qi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Yo||o===$o)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new $u(l.height/2);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class va extends yh{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Wi=4,Fl=[.125,.215,.35,.446,.526,.582],ci=20,fo=new va,Nl=new Pe;let po=null,mo=0,go=0;const ai=(1+Math.sqrt(5))/2,Ni=1/ai,Ol=[new D(1,1,1),new D(-1,1,1),new D(1,1,-1),new D(-1,1,-1),new D(0,ai,Ni),new D(0,ai,-Ni),new D(Ni,0,ai),new D(-Ni,0,ai),new D(ai,Ni,0),new D(-ai,Ni,0)];class Jo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){po=this._renderer.getRenderTarget(),mo=this._renderer.getActiveCubeFace(),go=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=kl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(po,mo,go),e.scissorTest=!1,tr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ji||e.mapping===Qi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),po=this._renderer.getRenderTarget(),mo=this._renderer.getActiveCubeFace(),go=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:nn,minFilter:nn,generateMipmaps:!1,type:On,format:pn,colorSpace:kn,depthBuffer:!1},s=Bl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Om(r)),this._blurMaterial=Bm(r,e,t)}return s}_compileMaterial(e){const t=new Ve(this._lodPlanes[0],e);this._renderer.compile(t,fo)}_sceneToCubeUV(e,t,n,s){const o=new Xt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,p=h.toneMapping;h.getClearColor(Nl),h.toneMapping=Zn,h.autoClear=!1;const m=new Ls({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1}),g=new Ve(new Pt,m);let _=!1;const f=e.background;f?f.isColor&&(m.color.copy(f),e.background=null,_=!0):(m.color.copy(Nl),_=!0);for(let u=0;u<6;u++){const b=u%3;b===0?(o.up.set(0,l[u],0),o.lookAt(c[u],0,0)):b===1?(o.up.set(0,0,l[u]),o.lookAt(0,c[u],0)):(o.up.set(0,l[u],0),o.lookAt(0,0,c[u]));const v=this._cubeSize;tr(s,b*v,u>2?v:0,v,v),h.setRenderTarget(s),_&&h.render(g,o),h.render(e,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=p,h.autoClear=d,e.background=f}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ji||e.mapping===Qi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=kl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ve(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;tr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,fo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Ol[(s-1)%Ol.length];this._blur(e,s-1,s,r,a)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Ve(this._lodPlanes[s],c),p=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ci-1),_=r/g,f=isFinite(r)?1+Math.floor(h*_):ci;f>ci&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${ci}`);const u=[];let b=0;for(let R=0;R<ci;++R){const H=R/_,M=Math.exp(-H*H/2);u.push(M),R===0?b+=M:R<f&&(b+=2*M)}for(let R=0;R<u.length;R++)u[R]=u[R]/b;p.envMap.value=e.texture,p.samples.value=f,p.weights.value=u,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:v}=this;p.dTheta.value=g,p.mipInt.value=v-n;const T=this._sizeLods[s],I=3*T*(s>v-Wi?s-v+Wi:0),A=4*(this._cubeSize-T);tr(t,I,A,3*T,2*T),l.setRenderTarget(t),l.render(d,fo)}}function Om(i){const e=[],t=[],n=[];let s=i;const r=i-Wi+1+Fl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-Wi?l=Fl[a-i+Wi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,d=1+c,p=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,g=6,_=3,f=2,u=1,b=new Float32Array(_*g*m),v=new Float32Array(f*g*m),T=new Float32Array(u*g*m);for(let A=0;A<m;A++){const R=A%3*2/3-1,H=A>2?0:-1,M=[R,H,0,R+2/3,H,0,R+2/3,H+1,0,R,H,0,R+2/3,H+1,0,R,H+1,0];b.set(M,_*g*A),v.set(p,f*g*A);const w=[A,A,A,A,A,A];T.set(w,u*g*A)}const I=new Rt;I.setAttribute("position",new Ht(b,_)),I.setAttribute("uv",new Ht(v,f)),I.setAttribute("faceIndex",new Ht(T,u)),e.push(I),s>Wi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Bl(i,e,t){const n=new mn(i,e,t);return n.texture.mapping=Ir,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function tr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Bm(i,e,t){const n=new Float32Array(ci),s=new D(0,1,0);return new yt({name:"SphericalGaussianBlur",defines:{n:ci,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ba(),fragmentShader:`

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
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function kl(){return new yt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ba(),fragmentShader:`

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
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Gl(){return new yt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ba(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function ba(){return`

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
	`}function km(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Yo||l===$o,h=l===Ji||l===Qi;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let d=e.get(o);return t===null&&(t=new Jo(i)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),e.set(o,d),d.texture}else{if(e.has(o))return e.get(o).texture;{const d=o.image;if(c&&d&&d.height>0||h&&d&&s(d)){t===null&&(t=new Jo(i));const p=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,p),o.addEventListener("dispose",r),p.texture}else return null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Gm(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const s=t(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function zm(i,e,t,n){const s={},r=new WeakMap;function a(d){const p=d.target;p.index!==null&&e.remove(p.index);for(const g in p.attributes)e.remove(p.attributes[g]);for(const g in p.morphAttributes){const _=p.morphAttributes[g];for(let f=0,u=_.length;f<u;f++)e.remove(_[f])}p.removeEventListener("dispose",a),delete s[p.id];const m=r.get(p);m&&(e.remove(m),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(d,p){return s[p.id]===!0||(p.addEventListener("dispose",a),s[p.id]=!0,t.memory.geometries++),p}function l(d){const p=d.attributes;for(const g in p)e.update(p[g],i.ARRAY_BUFFER);const m=d.morphAttributes;for(const g in m){const _=m[g];for(let f=0,u=_.length;f<u;f++)e.update(_[f],i.ARRAY_BUFFER)}}function c(d){const p=[],m=d.index,g=d.attributes.position;let _=0;if(m!==null){const b=m.array;_=m.version;for(let v=0,T=b.length;v<T;v+=3){const I=b[v+0],A=b[v+1],R=b[v+2];p.push(I,A,A,R,R,I)}}else if(g!==void 0){const b=g.array;_=g.version;for(let v=0,T=b.length/3-1;v<T;v+=3){const I=v+0,A=v+1,R=v+2;p.push(I,A,A,R,R,I)}}else return;const f=new(ph(p)?xh:bh)(p,1);f.version=_;const u=r.get(d);u&&e.remove(u),r.set(d,f)}function h(d){const p=r.get(d);if(p){const m=d.index;m!==null&&p.version<m.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Hm(i,e,t,n){const s=n.isWebGL2;let r;function a(m){r=m}let o,l;function c(m){o=m.type,l=m.bytesPerElement}function h(m,g){i.drawElements(r,g,o,m*l),t.update(g,r,1)}function d(m,g,_){if(_===0)return;let f,u;if(s)f=i,u="drawElementsInstanced";else if(f=e.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",f===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[u](r,g,o,m*l,_),t.update(g,r,_)}function p(m,g,_){if(_===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let u=0;u<_;u++)this.render(m[u]/l,g[u]);else{f.multiDrawElementsWEBGL(r,g,0,o,m,0,_);let u=0;for(let b=0;b<_;b++)u+=g[b];t.update(u,r,1)}}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=d,this.renderMultiDraw=p}function Vm(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Wm(i,e){return i[0]-e[0]}function Xm(i,e){return Math.abs(e[1])-Math.abs(i[1])}function Ym(i,e,t){const n={},s=new Float32Array(8),r=new WeakMap,a=new lt,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,d){const p=c.morphTargetInfluences;if(e.isWebGL2===!0){const m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=m!==void 0?m.length:0;let _=r.get(h);if(_===void 0||_.count!==g){let F=function(){X.dispose(),r.delete(h),h.removeEventListener("dispose",F)};_!==void 0&&_.texture.dispose();const b=h.morphAttributes.position!==void 0,v=h.morphAttributes.normal!==void 0,T=h.morphAttributes.color!==void 0,I=h.morphAttributes.position||[],A=h.morphAttributes.normal||[],R=h.morphAttributes.color||[];let H=0;b===!0&&(H=1),v===!0&&(H=2),T===!0&&(H=3);let M=h.attributes.position.count*H,w=1;M>e.maxTextureSize&&(w=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const z=new Float32Array(M*w*4*g),X=new _h(z,M,w,g);X.type=$n,X.needsUpdate=!0;const de=H*4;for(let B=0;B<g;B++){const K=I[B],oe=A[B],re=R[B],te=M*w*4*B;for(let le=0;le<K.count;le++){const ue=le*de;b===!0&&(a.fromBufferAttribute(K,le),z[te+ue+0]=a.x,z[te+ue+1]=a.y,z[te+ue+2]=a.z,z[te+ue+3]=0),v===!0&&(a.fromBufferAttribute(oe,le),z[te+ue+4]=a.x,z[te+ue+5]=a.y,z[te+ue+6]=a.z,z[te+ue+7]=0),T===!0&&(a.fromBufferAttribute(re,le),z[te+ue+8]=a.x,z[te+ue+9]=a.y,z[te+ue+10]=a.z,z[te+ue+11]=re.itemSize===4?a.w:1)}}_={count:g,texture:X,size:new Ie(M,w)},r.set(h,_),h.addEventListener("dispose",F)}let f=0;for(let b=0;b<p.length;b++)f+=p[b];const u=h.morphTargetsRelative?1:1-f;d.getUniforms().setValue(i,"morphTargetBaseInfluence",u),d.getUniforms().setValue(i,"morphTargetInfluences",p),d.getUniforms().setValue(i,"morphTargetsTexture",_.texture,t),d.getUniforms().setValue(i,"morphTargetsTextureSize",_.size)}else{const m=p===void 0?0:p.length;let g=n[h.id];if(g===void 0||g.length!==m){g=[];for(let v=0;v<m;v++)g[v]=[v,0];n[h.id]=g}for(let v=0;v<m;v++){const T=g[v];T[0]=v,T[1]=p[v]}g.sort(Xm);for(let v=0;v<8;v++)v<m&&g[v][1]?(o[v][0]=g[v][0],o[v][1]=g[v][1]):(o[v][0]=Number.MAX_SAFE_INTEGER,o[v][1]=0);o.sort(Wm);const _=h.morphAttributes.position,f=h.morphAttributes.normal;let u=0;for(let v=0;v<8;v++){const T=o[v],I=T[0],A=T[1];I!==Number.MAX_SAFE_INTEGER&&A?(_&&h.getAttribute("morphTarget"+v)!==_[I]&&h.setAttribute("morphTarget"+v,_[I]),f&&h.getAttribute("morphNormal"+v)!==f[I]&&h.setAttribute("morphNormal"+v,f[I]),s[v]=A,u+=A):(_&&h.hasAttribute("morphTarget"+v)===!0&&h.deleteAttribute("morphTarget"+v),f&&h.hasAttribute("morphNormal"+v)===!0&&h.deleteAttribute("morphNormal"+v),s[v]=0)}const b=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(i,"morphTargetBaseInfluence",b),d.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function $m(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=e.get(l,h);if(s.get(d)!==c&&(e.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;s.get(p)!==c&&(p.update(),s.set(p,c))}return d}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}class wh extends zt{constructor(e,t,n,s,r,a,o,l,c,h){if(h=h!==void 0?h:fi,h!==fi&&h!==es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===fi&&(n=Yn),n===void 0&&h===es&&(n=ui),super(null,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Bt,this.minFilter=l!==void 0?l:Bt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Th=new zt,Ah=new wh(1,1);Ah.compareFunction=fh;const Rh=new _h,Ch=new Lu,Ph=new Sh,zl=[],Hl=[],Vl=new Float32Array(16),Wl=new Float32Array(9),Xl=new Float32Array(4);function hs(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=zl[s];if(r===void 0&&(r=new Float32Array(s),zl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Et(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function wt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Nr(i,e){let t=Hl[e];t===void 0&&(t=new Int32Array(e),Hl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function qm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Km(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2fv(this.addr,e),wt(t,e)}}function jm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Et(t,e))return;i.uniform3fv(this.addr,e),wt(t,e)}}function Zm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4fv(this.addr,e),wt(t,e)}}function Jm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),wt(t,e)}else{if(Et(t,n))return;Xl.set(n),i.uniformMatrix2fv(this.addr,!1,Xl),wt(t,n)}}function Qm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),wt(t,e)}else{if(Et(t,n))return;Wl.set(n),i.uniformMatrix3fv(this.addr,!1,Wl),wt(t,n)}}function e0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),wt(t,e)}else{if(Et(t,n))return;Vl.set(n),i.uniformMatrix4fv(this.addr,!1,Vl),wt(t,n)}}function t0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function n0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2iv(this.addr,e),wt(t,e)}}function i0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;i.uniform3iv(this.addr,e),wt(t,e)}}function s0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4iv(this.addr,e),wt(t,e)}}function r0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function o0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2uiv(this.addr,e),wt(t,e)}}function a0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;i.uniform3uiv(this.addr,e),wt(t,e)}}function l0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4uiv(this.addr,e),wt(t,e)}}function c0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Ah:Th;t.setTexture2D(e||r,s)}function h0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Ch,s)}function d0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Ph,s)}function u0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Rh,s)}function f0(i){switch(i){case 5126:return qm;case 35664:return Km;case 35665:return jm;case 35666:return Zm;case 35674:return Jm;case 35675:return Qm;case 35676:return e0;case 5124:case 35670:return t0;case 35667:case 35671:return n0;case 35668:case 35672:return i0;case 35669:case 35673:return s0;case 5125:return r0;case 36294:return o0;case 36295:return a0;case 36296:return l0;case 35678:case 36198:case 36298:case 36306:case 35682:return c0;case 35679:case 36299:case 36307:return h0;case 35680:case 36300:case 36308:case 36293:return d0;case 36289:case 36303:case 36311:case 36292:return u0}}function p0(i,e){i.uniform1fv(this.addr,e)}function m0(i,e){const t=hs(e,this.size,2);i.uniform2fv(this.addr,t)}function g0(i,e){const t=hs(e,this.size,3);i.uniform3fv(this.addr,t)}function _0(i,e){const t=hs(e,this.size,4);i.uniform4fv(this.addr,t)}function v0(i,e){const t=hs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function b0(i,e){const t=hs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function x0(i,e){const t=hs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function M0(i,e){i.uniform1iv(this.addr,e)}function y0(i,e){i.uniform2iv(this.addr,e)}function S0(i,e){i.uniform3iv(this.addr,e)}function E0(i,e){i.uniform4iv(this.addr,e)}function w0(i,e){i.uniform1uiv(this.addr,e)}function T0(i,e){i.uniform2uiv(this.addr,e)}function A0(i,e){i.uniform3uiv(this.addr,e)}function R0(i,e){i.uniform4uiv(this.addr,e)}function C0(i,e,t){const n=this.cache,s=e.length,r=Nr(t,s);Et(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Th,r[a])}function P0(i,e,t){const n=this.cache,s=e.length,r=Nr(t,s);Et(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Ch,r[a])}function L0(i,e,t){const n=this.cache,s=e.length,r=Nr(t,s);Et(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Ph,r[a])}function D0(i,e,t){const n=this.cache,s=e.length,r=Nr(t,s);Et(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Rh,r[a])}function I0(i){switch(i){case 5126:return p0;case 35664:return m0;case 35665:return g0;case 35666:return _0;case 35674:return v0;case 35675:return b0;case 35676:return x0;case 5124:case 35670:return M0;case 35667:case 35671:return y0;case 35668:case 35672:return S0;case 35669:case 35673:return E0;case 5125:return w0;case 36294:return T0;case 36295:return A0;case 36296:return R0;case 35678:case 36198:case 36298:case 36306:case 35682:return C0;case 35679:case 36299:case 36307:return P0;case 35680:case 36300:case 36308:case 36293:return L0;case 36289:case 36303:case 36311:case 36292:return D0}}class U0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=f0(t.type)}}class F0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=I0(t.type)}}class N0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const _o=/(\w+)(\])?(\[|\.)?/g;function Yl(i,e){i.seq.push(e),i.map[e.id]=e}function O0(i,e,t){const n=i.name,s=n.length;for(_o.lastIndex=0;;){const r=_o.exec(n),a=_o.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Yl(t,c===void 0?new U0(o,i,e):new F0(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new N0(o),Yl(t,d)),t=d}}}class gr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);O0(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function $l(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const B0=37297;let k0=0;function G0(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function z0(i){const e=rt.getPrimaries(rt.workingColorSpace),t=rt.getPrimaries(i);let n;switch(e===t?n="":e===Er&&t===Sr?n="LinearDisplayP3ToLinearSRGB":e===Sr&&t===Er&&(n="LinearSRGBToLinearDisplayP3"),i){case kn:case Ur:return[n,"LinearTransferOETF"];case ft:case fa:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function ql(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+G0(i.getShaderSource(e),a)}else return s}function H0(i,e){const t=z0(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function V0(i,e){let t;switch(e){case Qc:t="Linear";break;case eh:t="Reinhard";break;case th:t="OptimizedCineon";break;case da:t="ACESFilmic";break;case nh:t="AgX";break;case Yd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function W0(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Xi).join(`
`)}function X0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Xi).join(`
`)}function Y0(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function $0(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Xi(i){return i!==""}function Kl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function jl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const q0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Qo(i){return i.replace(q0,j0)}const K0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function j0(i,e){let t=Ke[e];if(t===void 0){const n=K0.get(e);if(n!==void 0)t=Ke[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Qo(t)}const Z0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Zl(i){return i.replace(Z0,J0)}function J0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Jl(i){let e="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Q0(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Zc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===xd?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Dn&&(e="SHADOWMAP_TYPE_VSM"),e}function eg(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ji:case Qi:e="ENVMAP_TYPE_CUBE";break;case Ir:e="ENVMAP_TYPE_CUBE_UV";break}return e}function tg(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Qi:e="ENVMAP_MODE_REFRACTION";break}return e}function ng(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Jc:e="ENVMAP_BLENDING_MULTIPLY";break;case Wd:e="ENVMAP_BLENDING_MIX";break;case Xd:e="ENVMAP_BLENDING_ADD";break}return e}function ig(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function sg(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Q0(t),c=eg(t),h=tg(t),d=ng(t),p=ig(t),m=t.isWebGL2?"":W0(t),g=X0(t),_=Y0(r),f=s.createProgram();let u,b,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Xi).join(`
`),u.length>0&&(u+=`
`),b=[m,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Xi).join(`
`),b.length>0&&(b+=`
`)):(u=[Jl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xi).join(`
`),b=[m,Jl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Zn?"#define TONE_MAPPING":"",t.toneMapping!==Zn?Ke.tonemapping_pars_fragment:"",t.toneMapping!==Zn?V0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,H0("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Xi).join(`
`)),a=Qo(a),a=Kl(a,t),a=jl(a,t),o=Qo(o),o=Kl(o,t),o=jl(o,t),a=Zl(a),o=Zl(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,u=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,b=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===_l?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===_l?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+b);const T=v+u+a,I=v+b+o,A=$l(s,s.VERTEX_SHADER,T),R=$l(s,s.FRAGMENT_SHADER,I);s.attachShader(f,A),s.attachShader(f,R),t.index0AttributeName!==void 0?s.bindAttribLocation(f,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(f,0,"position"),s.linkProgram(f);function H(X){if(i.debug.checkShaderErrors){const de=s.getProgramInfoLog(f).trim(),F=s.getShaderInfoLog(A).trim(),B=s.getShaderInfoLog(R).trim();let K=!0,oe=!0;if(s.getProgramParameter(f,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,f,A,R);else{const re=ql(s,A,"vertex"),te=ql(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(f,s.VALIDATE_STATUS)+`

Program Info Log: `+de+`
`+re+`
`+te)}else de!==""?console.warn("THREE.WebGLProgram: Program Info Log:",de):(F===""||B==="")&&(oe=!1);oe&&(X.diagnostics={runnable:K,programLog:de,vertexShader:{log:F,prefix:u},fragmentShader:{log:B,prefix:b}})}s.deleteShader(A),s.deleteShader(R),M=new gr(s,f),w=$0(s,f)}let M;this.getUniforms=function(){return M===void 0&&H(this),M};let w;this.getAttributes=function(){return w===void 0&&H(this),w};let z=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return z===!1&&(z=s.getProgramParameter(f,B0)),z},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(f),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=k0++,this.cacheKey=e,this.usedTimes=1,this.program=f,this.vertexShader=A,this.fragmentShader=R,this}let rg=0;class og{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new ag(e),t.set(e,n)),n}}class ag{constructor(e){this.id=rg++,this.code=e,this.usedTimes=0}}function lg(i,e,t,n,s,r,a){const o=new ga,l=new og,c=[],h=s.isWebGL2,d=s.logarithmicDepthBuffer,p=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return M===0?"uv":`uv${M}`}function f(M,w,z,X,de){const F=X.fog,B=de.geometry,K=M.isMeshStandardMaterial?X.environment:null,oe=(M.isMeshStandardMaterial?t:e).get(M.envMap||K),re=oe&&oe.mapping===Ir?oe.image.height:null,te=g[M.type];M.precision!==null&&(m=s.getMaxPrecision(M.precision),m!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",m,"instead."));const le=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ue=le!==void 0?le.length:0;let ne=0;B.morphAttributes.position!==void 0&&(ne=1),B.morphAttributes.normal!==void 0&&(ne=2),B.morphAttributes.color!==void 0&&(ne=3);let k,se,xe,V;if(te){const gt=bn[te];k=gt.vertexShader,se=gt.fragmentShader}else k=M.vertexShader,se=M.fragmentShader,l.update(M),xe=l.getVertexShaderID(M),V=l.getFragmentShaderID(M);const ee=i.getRenderTarget(),ge=de.isInstancedMesh===!0,Me=de.isBatchedMesh===!0,be=!!M.map,De=!!M.matcap,O=!!oe,We=!!M.aoMap,fe=!!M.lightMap,he=!!M.bumpMap,ce=!!M.normalMap,$e=!!M.displacementMap,Ue=!!M.emissiveMap,E=!!M.metalnessMap,x=!!M.roughnessMap,Y=M.anisotropy>0,_e=M.clearcoat>0,pe=M.iridescence>0,ve=M.sheen>0,Le=M.transmission>0,Ee=Y&&!!M.anisotropyMap,Re=_e&&!!M.clearcoatMap,Ne=_e&&!!M.clearcoatNormalMap,C=_e&&!!M.clearcoatRoughnessMap,P=pe&&!!M.iridescenceMap,J=pe&&!!M.iridescenceThicknessMap,ie=ve&&!!M.sheenColorMap,$=ve&&!!M.sheenRoughnessMap,q=!!M.specularMap,N=!!M.specularColorMap,y=!!M.specularIntensityMap,ae=Le&&!!M.transmissionMap,Ae=Le&&!!M.thicknessMap,Te=!!M.gradientMap,me=!!M.alphaMap,U=M.alphaTest>0,ye=!!M.alphaHash,we=!!M.extensions,Be=!!B.attributes.uv1,Oe=!!B.attributes.uv2,et=!!B.attributes.uv3;let tt=Zn;return M.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(tt=i.toneMapping),{isWebGL2:h,shaderID:te,shaderType:M.type,shaderName:M.name,vertexShader:k,fragmentShader:se,defines:M.defines,customVertexShaderID:xe,customFragmentShaderID:V,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:m,batching:Me,instancing:ge,instancingColor:ge&&de.instanceColor!==null,supportsVertexTextures:p,outputColorSpace:ee===null?i.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:kn,map:be,matcap:De,envMap:O,envMapMode:O&&oe.mapping,envMapCubeUVHeight:re,aoMap:We,lightMap:fe,bumpMap:he,normalMap:ce,displacementMap:p&&$e,emissiveMap:Ue,normalMapObjectSpace:ce&&M.normalMapType===su,normalMapTangentSpace:ce&&M.normalMapType===uh,metalnessMap:E,roughnessMap:x,anisotropy:Y,anisotropyMap:Ee,clearcoat:_e,clearcoatMap:Re,clearcoatNormalMap:Ne,clearcoatRoughnessMap:C,iridescence:pe,iridescenceMap:P,iridescenceThicknessMap:J,sheen:ve,sheenColorMap:ie,sheenRoughnessMap:$,specularMap:q,specularColorMap:N,specularIntensityMap:y,transmission:Le,transmissionMap:ae,thicknessMap:Ae,gradientMap:Te,opaque:M.transparent===!1&&M.blending===$i,alphaMap:me,alphaTest:U,alphaHash:ye,combine:M.combine,mapUv:be&&_(M.map.channel),aoMapUv:We&&_(M.aoMap.channel),lightMapUv:fe&&_(M.lightMap.channel),bumpMapUv:he&&_(M.bumpMap.channel),normalMapUv:ce&&_(M.normalMap.channel),displacementMapUv:$e&&_(M.displacementMap.channel),emissiveMapUv:Ue&&_(M.emissiveMap.channel),metalnessMapUv:E&&_(M.metalnessMap.channel),roughnessMapUv:x&&_(M.roughnessMap.channel),anisotropyMapUv:Ee&&_(M.anisotropyMap.channel),clearcoatMapUv:Re&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Ne&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:C&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:P&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:J&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:ie&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:$&&_(M.sheenRoughnessMap.channel),specularMapUv:q&&_(M.specularMap.channel),specularColorMapUv:N&&_(M.specularColorMap.channel),specularIntensityMapUv:y&&_(M.specularIntensityMap.channel),transmissionMapUv:ae&&_(M.transmissionMap.channel),thicknessMapUv:Ae&&_(M.thicknessMap.channel),alphaMapUv:me&&_(M.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(ce||Y),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,vertexUv1s:Be,vertexUv2s:Oe,vertexUv3s:et,pointsUvs:de.isPoints===!0&&!!B.attributes.uv&&(be||me),fog:!!F,useFog:M.fog===!0,fogExp2:F&&F.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:de.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:ue,morphTextureStride:ne,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&z.length>0,shadowMapType:i.shadowMap.type,toneMapping:tt,useLegacyLights:i._useLegacyLights,decodeVideoTexture:be&&M.map.isVideoTexture===!0&&rt.getTransfer(M.map.colorSpace)===ot,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Jt,flipSided:M.side===Gt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:we&&M.extensions.derivatives===!0,extensionFragDepth:we&&M.extensions.fragDepth===!0,extensionDrawBuffers:we&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:we&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:we&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function u(M){const w=[];if(M.shaderID?w.push(M.shaderID):(w.push(M.customVertexShaderID),w.push(M.customFragmentShaderID)),M.defines!==void 0)for(const z in M.defines)w.push(z),w.push(M.defines[z]);return M.isRawShaderMaterial===!1&&(b(w,M),v(w,M),w.push(i.outputColorSpace)),w.push(M.customProgramCacheKey),w.join()}function b(M,w){M.push(w.precision),M.push(w.outputColorSpace),M.push(w.envMapMode),M.push(w.envMapCubeUVHeight),M.push(w.mapUv),M.push(w.alphaMapUv),M.push(w.lightMapUv),M.push(w.aoMapUv),M.push(w.bumpMapUv),M.push(w.normalMapUv),M.push(w.displacementMapUv),M.push(w.emissiveMapUv),M.push(w.metalnessMapUv),M.push(w.roughnessMapUv),M.push(w.anisotropyMapUv),M.push(w.clearcoatMapUv),M.push(w.clearcoatNormalMapUv),M.push(w.clearcoatRoughnessMapUv),M.push(w.iridescenceMapUv),M.push(w.iridescenceThicknessMapUv),M.push(w.sheenColorMapUv),M.push(w.sheenRoughnessMapUv),M.push(w.specularMapUv),M.push(w.specularColorMapUv),M.push(w.specularIntensityMapUv),M.push(w.transmissionMapUv),M.push(w.thicknessMapUv),M.push(w.combine),M.push(w.fogExp2),M.push(w.sizeAttenuation),M.push(w.morphTargetsCount),M.push(w.morphAttributeCount),M.push(w.numDirLights),M.push(w.numPointLights),M.push(w.numSpotLights),M.push(w.numSpotLightMaps),M.push(w.numHemiLights),M.push(w.numRectAreaLights),M.push(w.numDirLightShadows),M.push(w.numPointLightShadows),M.push(w.numSpotLightShadows),M.push(w.numSpotLightShadowsWithMaps),M.push(w.numLightProbes),M.push(w.shadowMapType),M.push(w.toneMapping),M.push(w.numClippingPlanes),M.push(w.numClipIntersection),M.push(w.depthPacking)}function v(M,w){o.disableAll(),w.isWebGL2&&o.enable(0),w.supportsVertexTextures&&o.enable(1),w.instancing&&o.enable(2),w.instancingColor&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),M.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.skinning&&o.enable(4),w.morphTargets&&o.enable(5),w.morphNormals&&o.enable(6),w.morphColors&&o.enable(7),w.premultipliedAlpha&&o.enable(8),w.shadowMapEnabled&&o.enable(9),w.useLegacyLights&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),M.push(o.mask)}function T(M){const w=g[M.type];let z;if(w){const X=bn[w];z=Cs.clone(X.uniforms)}else z=M.uniforms;return z}function I(M,w){let z;for(let X=0,de=c.length;X<de;X++){const F=c[X];if(F.cacheKey===w){z=F,++z.usedTimes;break}}return z===void 0&&(z=new sg(i,w,M,r),c.push(z)),z}function A(M){if(--M.usedTimes===0){const w=c.indexOf(M);c[w]=c[c.length-1],c.pop(),M.destroy()}}function R(M){l.remove(M)}function H(){l.dispose()}return{getParameters:f,getProgramCacheKey:u,getUniforms:T,acquireProgram:I,releaseProgram:A,releaseShaderCache:R,programs:c,dispose:H}}function cg(){let i=new WeakMap;function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function t(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function hg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Ql(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ec(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d,p,m,g,_,f){let u=i[e];return u===void 0?(u={id:d.id,object:d,geometry:p,material:m,groupOrder:g,renderOrder:d.renderOrder,z:_,group:f},i[e]=u):(u.id=d.id,u.object=d,u.geometry=p,u.material=m,u.groupOrder=g,u.renderOrder=d.renderOrder,u.z=_,u.group=f),e++,u}function o(d,p,m,g,_,f){const u=a(d,p,m,g,_,f);m.transmission>0?n.push(u):m.transparent===!0?s.push(u):t.push(u)}function l(d,p,m,g,_,f){const u=a(d,p,m,g,_,f);m.transmission>0?n.unshift(u):m.transparent===!0?s.unshift(u):t.unshift(u)}function c(d,p){t.length>1&&t.sort(d||hg),n.length>1&&n.sort(p||Ql),s.length>1&&s.sort(p||Ql)}function h(){for(let d=e,p=i.length;d<p;d++){const m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function dg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new ec,i.set(n,[a])):s>=r.length?(a=new ec,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function ug(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Pe};break;case"SpotLight":t={position:new D,direction:new D,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":t={color:new Pe,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function fg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let pg=0;function mg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function gg(i,e){const t=new ug,n=fg(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new D);const r=new D,a=new ct,o=new ct;function l(h,d){let p=0,m=0,g=0;for(let X=0;X<9;X++)s.probe[X].set(0,0,0);let _=0,f=0,u=0,b=0,v=0,T=0,I=0,A=0,R=0,H=0,M=0;h.sort(mg);const w=d===!0?Math.PI:1;for(let X=0,de=h.length;X<de;X++){const F=h[X],B=F.color,K=F.intensity,oe=F.distance,re=F.shadow&&F.shadow.map?F.shadow.map.texture:null;if(F.isAmbientLight)p+=B.r*K*w,m+=B.g*K*w,g+=B.b*K*w;else if(F.isLightProbe){for(let te=0;te<9;te++)s.probe[te].addScaledVector(F.sh.coefficients[te],K);M++}else if(F.isDirectionalLight){const te=t.get(F);if(te.color.copy(F.color).multiplyScalar(F.intensity*w),F.castShadow){const le=F.shadow,ue=n.get(F);ue.shadowBias=le.bias,ue.shadowNormalBias=le.normalBias,ue.shadowRadius=le.radius,ue.shadowMapSize=le.mapSize,s.directionalShadow[_]=ue,s.directionalShadowMap[_]=re,s.directionalShadowMatrix[_]=F.shadow.matrix,T++}s.directional[_]=te,_++}else if(F.isSpotLight){const te=t.get(F);te.position.setFromMatrixPosition(F.matrixWorld),te.color.copy(B).multiplyScalar(K*w),te.distance=oe,te.coneCos=Math.cos(F.angle),te.penumbraCos=Math.cos(F.angle*(1-F.penumbra)),te.decay=F.decay,s.spot[u]=te;const le=F.shadow;if(F.map&&(s.spotLightMap[R]=F.map,R++,le.updateMatrices(F),F.castShadow&&H++),s.spotLightMatrix[u]=le.matrix,F.castShadow){const ue=n.get(F);ue.shadowBias=le.bias,ue.shadowNormalBias=le.normalBias,ue.shadowRadius=le.radius,ue.shadowMapSize=le.mapSize,s.spotShadow[u]=ue,s.spotShadowMap[u]=re,A++}u++}else if(F.isRectAreaLight){const te=t.get(F);te.color.copy(B).multiplyScalar(K),te.halfWidth.set(F.width*.5,0,0),te.halfHeight.set(0,F.height*.5,0),s.rectArea[b]=te,b++}else if(F.isPointLight){const te=t.get(F);if(te.color.copy(F.color).multiplyScalar(F.intensity*w),te.distance=F.distance,te.decay=F.decay,F.castShadow){const le=F.shadow,ue=n.get(F);ue.shadowBias=le.bias,ue.shadowNormalBias=le.normalBias,ue.shadowRadius=le.radius,ue.shadowMapSize=le.mapSize,ue.shadowCameraNear=le.camera.near,ue.shadowCameraFar=le.camera.far,s.pointShadow[f]=ue,s.pointShadowMap[f]=re,s.pointShadowMatrix[f]=F.shadow.matrix,I++}s.point[f]=te,f++}else if(F.isHemisphereLight){const te=t.get(F);te.skyColor.copy(F.color).multiplyScalar(K*w),te.groundColor.copy(F.groundColor).multiplyScalar(K*w),s.hemi[v]=te,v++}}b>0&&(e.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Se.LTC_FLOAT_1,s.rectAreaLTC2=Se.LTC_FLOAT_2):(s.rectAreaLTC1=Se.LTC_HALF_1,s.rectAreaLTC2=Se.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Se.LTC_FLOAT_1,s.rectAreaLTC2=Se.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Se.LTC_HALF_1,s.rectAreaLTC2=Se.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=p,s.ambient[1]=m,s.ambient[2]=g;const z=s.hash;(z.directionalLength!==_||z.pointLength!==f||z.spotLength!==u||z.rectAreaLength!==b||z.hemiLength!==v||z.numDirectionalShadows!==T||z.numPointShadows!==I||z.numSpotShadows!==A||z.numSpotMaps!==R||z.numLightProbes!==M)&&(s.directional.length=_,s.spot.length=u,s.rectArea.length=b,s.point.length=f,s.hemi.length=v,s.directionalShadow.length=T,s.directionalShadowMap.length=T,s.pointShadow.length=I,s.pointShadowMap.length=I,s.spotShadow.length=A,s.spotShadowMap.length=A,s.directionalShadowMatrix.length=T,s.pointShadowMatrix.length=I,s.spotLightMatrix.length=A+R-H,s.spotLightMap.length=R,s.numSpotLightShadowsWithMaps=H,s.numLightProbes=M,z.directionalLength=_,z.pointLength=f,z.spotLength=u,z.rectAreaLength=b,z.hemiLength=v,z.numDirectionalShadows=T,z.numPointShadows=I,z.numSpotShadows=A,z.numSpotMaps=R,z.numLightProbes=M,s.version=pg++)}function c(h,d){let p=0,m=0,g=0,_=0,f=0;const u=d.matrixWorldInverse;for(let b=0,v=h.length;b<v;b++){const T=h[b];if(T.isDirectionalLight){const I=s.directional[p];I.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),I.direction.sub(r),I.direction.transformDirection(u),p++}else if(T.isSpotLight){const I=s.spot[g];I.position.setFromMatrixPosition(T.matrixWorld),I.position.applyMatrix4(u),I.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),I.direction.sub(r),I.direction.transformDirection(u),g++}else if(T.isRectAreaLight){const I=s.rectArea[_];I.position.setFromMatrixPosition(T.matrixWorld),I.position.applyMatrix4(u),o.identity(),a.copy(T.matrixWorld),a.premultiply(u),o.extractRotation(a),I.halfWidth.set(T.width*.5,0,0),I.halfHeight.set(0,T.height*.5,0),I.halfWidth.applyMatrix4(o),I.halfHeight.applyMatrix4(o),_++}else if(T.isPointLight){const I=s.point[m];I.position.setFromMatrixPosition(T.matrixWorld),I.position.applyMatrix4(u),m++}else if(T.isHemisphereLight){const I=s.hemi[f];I.direction.setFromMatrixPosition(T.matrixWorld),I.direction.transformDirection(u),f++}}}return{setup:l,setupView:c,state:s}}function tc(i,e){const t=new gg(i,e),n=[],s=[];function r(){n.length=0,s.length=0}function a(d){n.push(d)}function o(d){s.push(d)}function l(d){t.setup(n,d)}function c(d){t.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function _g(i,e){let t=new WeakMap;function n(r,a=0){const o=t.get(r);let l;return o===void 0?(l=new tc(i,e),t.set(r,[l])):a>=o.length?(l=new tc(i,e),o.push(l)):l=o[a],l}function s(){t=new WeakMap}return{get:n,dispose:s}}class vg extends vi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=nu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class bg extends vi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const xg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mg=`uniform sampler2D shadow_pass;
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
}`;function yg(i,e,t){let n=new _a;const s=new Ie,r=new Ie,a=new lt,o=new vg({depthPacking:iu}),l=new bg,c={},h=t.maxTextureSize,d={[Qn]:Gt,[Gt]:Qn,[Jt]:Jt},p=new yt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ie},radius:{value:4}},vertexShader:xg,fragmentShader:Mg}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const g=new Rt;g.setAttribute("position",new Ht(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ve(g,p),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Zc;let u=this.type;this.render=function(A,R,H){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||A.length===0)return;const M=i.getRenderTarget(),w=i.getActiveCubeFace(),z=i.getActiveMipmapLevel(),X=i.state;X.setBlending(Nn),X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);const de=u!==Dn&&this.type===Dn,F=u===Dn&&this.type!==Dn;for(let B=0,K=A.length;B<K;B++){const oe=A[B],re=oe.shadow;if(re===void 0){console.warn("THREE.WebGLShadowMap:",oe,"has no shadow.");continue}if(re.autoUpdate===!1&&re.needsUpdate===!1)continue;s.copy(re.mapSize);const te=re.getFrameExtents();if(s.multiply(te),r.copy(re.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/te.x),s.x=r.x*te.x,re.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/te.y),s.y=r.y*te.y,re.mapSize.y=r.y)),re.map===null||de===!0||F===!0){const ue=this.type!==Dn?{minFilter:Bt,magFilter:Bt}:{};re.map!==null&&re.map.dispose(),re.map=new mn(s.x,s.y,ue),re.map.texture.name=oe.name+".shadowMap",re.camera.updateProjectionMatrix()}i.setRenderTarget(re.map),i.clear();const le=re.getViewportCount();for(let ue=0;ue<le;ue++){const ne=re.getViewport(ue);a.set(r.x*ne.x,r.y*ne.y,r.x*ne.z,r.y*ne.w),X.viewport(a),re.updateMatrices(oe,ue),n=re.getFrustum(),T(R,H,re.camera,oe,this.type)}re.isPointLightShadow!==!0&&this.type===Dn&&b(re,H),re.needsUpdate=!1}u=this.type,f.needsUpdate=!1,i.setRenderTarget(M,w,z)};function b(A,R){const H=e.update(_);p.defines.VSM_SAMPLES!==A.blurSamples&&(p.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new mn(s.x,s.y)),p.uniforms.shadow_pass.value=A.map.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(R,null,H,p,_,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(R,null,H,m,_,null)}function v(A,R,H,M){let w=null;const z=H.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(z!==void 0)w=z;else if(w=H.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const X=w.uuid,de=R.uuid;let F=c[X];F===void 0&&(F={},c[X]=F);let B=F[de];B===void 0&&(B=w.clone(),F[de]=B,R.addEventListener("dispose",I)),w=B}if(w.visible=R.visible,w.wireframe=R.wireframe,M===Dn?w.side=R.shadowSide!==null?R.shadowSide:R.side:w.side=R.shadowSide!==null?R.shadowSide:d[R.side],w.alphaMap=R.alphaMap,w.alphaTest=R.alphaTest,w.map=R.map,w.clipShadows=R.clipShadows,w.clippingPlanes=R.clippingPlanes,w.clipIntersection=R.clipIntersection,w.displacementMap=R.displacementMap,w.displacementScale=R.displacementScale,w.displacementBias=R.displacementBias,w.wireframeLinewidth=R.wireframeLinewidth,w.linewidth=R.linewidth,H.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const X=i.properties.get(w);X.light=H}return w}function T(A,R,H,M,w){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&w===Dn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,A.matrixWorld);const de=e.update(A),F=A.material;if(Array.isArray(F)){const B=de.groups;for(let K=0,oe=B.length;K<oe;K++){const re=B[K],te=F[re.materialIndex];if(te&&te.visible){const le=v(A,te,M,w);A.onBeforeShadow(i,A,R,H,de,le,re),i.renderBufferDirect(H,null,de,le,A,re),A.onAfterShadow(i,A,R,H,de,le,re)}}}else if(F.visible){const B=v(A,F,M,w);A.onBeforeShadow(i,A,R,H,de,B,null),i.renderBufferDirect(H,null,de,B,A,null),A.onAfterShadow(i,A,R,H,de,B,null)}}const X=A.children;for(let de=0,F=X.length;de<F;de++)T(X[de],R,H,M,w)}function I(A){A.target.removeEventListener("dispose",I);for(const H in c){const M=c[H],w=A.target.uuid;w in M&&(M[w].dispose(),delete M[w])}}}function Sg(i,e,t){const n=t.isWebGL2;function s(){let U=!1;const ye=new lt;let we=null;const Be=new lt(0,0,0,0);return{setMask:function(Oe){we!==Oe&&!U&&(i.colorMask(Oe,Oe,Oe,Oe),we=Oe)},setLocked:function(Oe){U=Oe},setClear:function(Oe,et,tt,dt,gt){gt===!0&&(Oe*=dt,et*=dt,tt*=dt),ye.set(Oe,et,tt,dt),Be.equals(ye)===!1&&(i.clearColor(Oe,et,tt,dt),Be.copy(ye))},reset:function(){U=!1,we=null,Be.set(-1,0,0,0)}}}function r(){let U=!1,ye=null,we=null,Be=null;return{setTest:function(Oe){Oe?Me(i.DEPTH_TEST):be(i.DEPTH_TEST)},setMask:function(Oe){ye!==Oe&&!U&&(i.depthMask(Oe),ye=Oe)},setFunc:function(Oe){if(we!==Oe){switch(Oe){case Od:i.depthFunc(i.NEVER);break;case Bd:i.depthFunc(i.ALWAYS);break;case kd:i.depthFunc(i.LESS);break;case Mr:i.depthFunc(i.LEQUAL);break;case Gd:i.depthFunc(i.EQUAL);break;case zd:i.depthFunc(i.GEQUAL);break;case Hd:i.depthFunc(i.GREATER);break;case Vd:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}we=Oe}},setLocked:function(Oe){U=Oe},setClear:function(Oe){Be!==Oe&&(i.clearDepth(Oe),Be=Oe)},reset:function(){U=!1,ye=null,we=null,Be=null}}}function a(){let U=!1,ye=null,we=null,Be=null,Oe=null,et=null,tt=null,dt=null,gt=null;return{setTest:function(st){U||(st?Me(i.STENCIL_TEST):be(i.STENCIL_TEST))},setMask:function(st){ye!==st&&!U&&(i.stencilMask(st),ye=st)},setFunc:function(st,vt,_n){(we!==st||Be!==vt||Oe!==_n)&&(i.stencilFunc(st,vt,_n),we=st,Be=vt,Oe=_n)},setOp:function(st,vt,_n){(et!==st||tt!==vt||dt!==_n)&&(i.stencilOp(st,vt,_n),et=st,tt=vt,dt=_n)},setLocked:function(st){U=st},setClear:function(st){gt!==st&&(i.clearStencil(st),gt=st)},reset:function(){U=!1,ye=null,we=null,Be=null,Oe=null,et=null,tt=null,dt=null,gt=null}}}const o=new s,l=new r,c=new a,h=new WeakMap,d=new WeakMap;let p={},m={},g=new WeakMap,_=[],f=null,u=!1,b=null,v=null,T=null,I=null,A=null,R=null,H=null,M=new Pe(0,0,0),w=0,z=!1,X=null,de=null,F=null,B=null,K=null;const oe=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let re=!1,te=0;const le=i.getParameter(i.VERSION);le.indexOf("WebGL")!==-1?(te=parseFloat(/^WebGL (\d)/.exec(le)[1]),re=te>=1):le.indexOf("OpenGL ES")!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(le)[1]),re=te>=2);let ue=null,ne={};const k=i.getParameter(i.SCISSOR_BOX),se=i.getParameter(i.VIEWPORT),xe=new lt().fromArray(k),V=new lt().fromArray(se);function ee(U,ye,we,Be){const Oe=new Uint8Array(4),et=i.createTexture();i.bindTexture(U,et),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let tt=0;tt<we;tt++)n&&(U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY)?i.texImage3D(ye,0,i.RGBA,1,1,Be,0,i.RGBA,i.UNSIGNED_BYTE,Oe):i.texImage2D(ye+tt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Oe);return et}const ge={};ge[i.TEXTURE_2D]=ee(i.TEXTURE_2D,i.TEXTURE_2D,1),ge[i.TEXTURE_CUBE_MAP]=ee(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(ge[i.TEXTURE_2D_ARRAY]=ee(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ge[i.TEXTURE_3D]=ee(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Me(i.DEPTH_TEST),l.setFunc(Mr),Ue(!1),E(Ba),Me(i.CULL_FACE),ce(Nn);function Me(U){p[U]!==!0&&(i.enable(U),p[U]=!0)}function be(U){p[U]!==!1&&(i.disable(U),p[U]=!1)}function De(U,ye){return m[U]!==ye?(i.bindFramebuffer(U,ye),m[U]=ye,n&&(U===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=ye),U===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=ye)),!0):!1}function O(U,ye){let we=_,Be=!1;if(U)if(we=g.get(ye),we===void 0&&(we=[],g.set(ye,we)),U.isWebGLMultipleRenderTargets){const Oe=U.texture;if(we.length!==Oe.length||we[0]!==i.COLOR_ATTACHMENT0){for(let et=0,tt=Oe.length;et<tt;et++)we[et]=i.COLOR_ATTACHMENT0+et;we.length=Oe.length,Be=!0}}else we[0]!==i.COLOR_ATTACHMENT0&&(we[0]=i.COLOR_ATTACHMENT0,Be=!0);else we[0]!==i.BACK&&(we[0]=i.BACK,Be=!0);Be&&(t.isWebGL2?i.drawBuffers(we):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(we))}function We(U){return f!==U?(i.useProgram(U),f=U,!0):!1}const fe={[li]:i.FUNC_ADD,[yd]:i.FUNC_SUBTRACT,[Sd]:i.FUNC_REVERSE_SUBTRACT};if(n)fe[za]=i.MIN,fe[Ha]=i.MAX;else{const U=e.get("EXT_blend_minmax");U!==null&&(fe[za]=U.MIN_EXT,fe[Ha]=U.MAX_EXT)}const he={[Ed]:i.ZERO,[wd]:i.ONE,[Td]:i.SRC_COLOR,[Wo]:i.SRC_ALPHA,[Dd]:i.SRC_ALPHA_SATURATE,[Pd]:i.DST_COLOR,[Rd]:i.DST_ALPHA,[Ad]:i.ONE_MINUS_SRC_COLOR,[Xo]:i.ONE_MINUS_SRC_ALPHA,[Ld]:i.ONE_MINUS_DST_COLOR,[Cd]:i.ONE_MINUS_DST_ALPHA,[Id]:i.CONSTANT_COLOR,[Ud]:i.ONE_MINUS_CONSTANT_COLOR,[Fd]:i.CONSTANT_ALPHA,[Nd]:i.ONE_MINUS_CONSTANT_ALPHA};function ce(U,ye,we,Be,Oe,et,tt,dt,gt,st){if(U===Nn){u===!0&&(be(i.BLEND),u=!1);return}if(u===!1&&(Me(i.BLEND),u=!0),U!==Md){if(U!==b||st!==z){if((v!==li||A!==li)&&(i.blendEquation(i.FUNC_ADD),v=li,A=li),st)switch(U){case $i:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Mn:i.blendFunc(i.ONE,i.ONE);break;case ka:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ga:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case $i:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Mn:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ka:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ga:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}T=null,I=null,R=null,H=null,M.set(0,0,0),w=0,b=U,z=st}return}Oe=Oe||ye,et=et||we,tt=tt||Be,(ye!==v||Oe!==A)&&(i.blendEquationSeparate(fe[ye],fe[Oe]),v=ye,A=Oe),(we!==T||Be!==I||et!==R||tt!==H)&&(i.blendFuncSeparate(he[we],he[Be],he[et],he[tt]),T=we,I=Be,R=et,H=tt),(dt.equals(M)===!1||gt!==w)&&(i.blendColor(dt.r,dt.g,dt.b,gt),M.copy(dt),w=gt),b=U,z=!1}function $e(U,ye){U.side===Jt?be(i.CULL_FACE):Me(i.CULL_FACE);let we=U.side===Gt;ye&&(we=!we),Ue(we),U.blending===$i&&U.transparent===!1?ce(Nn):ce(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),l.setFunc(U.depthFunc),l.setTest(U.depthTest),l.setMask(U.depthWrite),o.setMask(U.colorWrite);const Be=U.stencilWrite;c.setTest(Be),Be&&(c.setMask(U.stencilWriteMask),c.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),c.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Y(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Me(i.SAMPLE_ALPHA_TO_COVERAGE):be(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ue(U){X!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),X=U)}function E(U){U!==vd?(Me(i.CULL_FACE),U!==de&&(U===Ba?i.cullFace(i.BACK):U===bd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):be(i.CULL_FACE),de=U}function x(U){U!==F&&(re&&i.lineWidth(U),F=U)}function Y(U,ye,we){U?(Me(i.POLYGON_OFFSET_FILL),(B!==ye||K!==we)&&(i.polygonOffset(ye,we),B=ye,K=we)):be(i.POLYGON_OFFSET_FILL)}function _e(U){U?Me(i.SCISSOR_TEST):be(i.SCISSOR_TEST)}function pe(U){U===void 0&&(U=i.TEXTURE0+oe-1),ue!==U&&(i.activeTexture(U),ue=U)}function ve(U,ye,we){we===void 0&&(ue===null?we=i.TEXTURE0+oe-1:we=ue);let Be=ne[we];Be===void 0&&(Be={type:void 0,texture:void 0},ne[we]=Be),(Be.type!==U||Be.texture!==ye)&&(ue!==we&&(i.activeTexture(we),ue=we),i.bindTexture(U,ye||ge[U]),Be.type=U,Be.texture=ye)}function Le(){const U=ne[ue];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Ee(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Re(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ne(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function C(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function P(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ie(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function $(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function q(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function N(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function y(U){xe.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),xe.copy(U))}function ae(U){V.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),V.copy(U))}function Ae(U,ye){let we=d.get(ye);we===void 0&&(we=new WeakMap,d.set(ye,we));let Be=we.get(U);Be===void 0&&(Be=i.getUniformBlockIndex(ye,U.name),we.set(U,Be))}function Te(U,ye){const Be=d.get(ye).get(U);h.get(ye)!==Be&&(i.uniformBlockBinding(ye,Be,U.__bindingPointIndex),h.set(ye,Be))}function me(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),p={},ue=null,ne={},m={},g=new WeakMap,_=[],f=null,u=!1,b=null,v=null,T=null,I=null,A=null,R=null,H=null,M=new Pe(0,0,0),w=0,z=!1,X=null,de=null,F=null,B=null,K=null,xe.set(0,0,i.canvas.width,i.canvas.height),V.set(0,0,i.canvas.width,i.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Me,disable:be,bindFramebuffer:De,drawBuffers:O,useProgram:We,setBlending:ce,setMaterial:$e,setFlipSided:Ue,setCullFace:E,setLineWidth:x,setPolygonOffset:Y,setScissorTest:_e,activeTexture:pe,bindTexture:ve,unbindTexture:Le,compressedTexImage2D:Ee,compressedTexImage3D:Re,texImage2D:q,texImage3D:N,updateUBOMapping:Ae,uniformBlockBinding:Te,texStorage2D:ie,texStorage3D:$,texSubImage2D:Ne,texSubImage3D:C,compressedTexSubImage2D:P,compressedTexSubImage3D:J,scissor:y,viewport:ae,reset:me}}function Eg(i,e,t,n,s,r,a){const o=s.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let d;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,x){return m?new OffscreenCanvas(E,x):Rs("canvas")}function _(E,x,Y,_e){let pe=1;if((E.width>_e||E.height>_e)&&(pe=_e/Math.max(E.width,E.height)),pe<1||x===!0)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap){const ve=x?Tr:Math.floor,Le=ve(pe*E.width),Ee=ve(pe*E.height);d===void 0&&(d=g(Le,Ee));const Re=Y?g(Le,Ee):d;return Re.width=Le,Re.height=Ee,Re.getContext("2d").drawImage(E,0,0,Le,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+E.width+"x"+E.height+") to ("+Le+"x"+Ee+")."),Re}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+E.width+"x"+E.height+")."),E;return E}function f(E){return Zo(E.width)&&Zo(E.height)}function u(E){return o?!1:E.wrapS!==fn||E.wrapT!==fn||E.minFilter!==Bt&&E.minFilter!==nn}function b(E,x){return E.generateMipmaps&&x&&E.minFilter!==Bt&&E.minFilter!==nn}function v(E){i.generateMipmap(E)}function T(E,x,Y,_e,pe=!1){if(o===!1)return x;if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let ve=x;if(x===i.RED&&(Y===i.FLOAT&&(ve=i.R32F),Y===i.HALF_FLOAT&&(ve=i.R16F),Y===i.UNSIGNED_BYTE&&(ve=i.R8)),x===i.RED_INTEGER&&(Y===i.UNSIGNED_BYTE&&(ve=i.R8UI),Y===i.UNSIGNED_SHORT&&(ve=i.R16UI),Y===i.UNSIGNED_INT&&(ve=i.R32UI),Y===i.BYTE&&(ve=i.R8I),Y===i.SHORT&&(ve=i.R16I),Y===i.INT&&(ve=i.R32I)),x===i.RG&&(Y===i.FLOAT&&(ve=i.RG32F),Y===i.HALF_FLOAT&&(ve=i.RG16F),Y===i.UNSIGNED_BYTE&&(ve=i.RG8)),x===i.RGBA){const Le=pe?yr:rt.getTransfer(_e);Y===i.FLOAT&&(ve=i.RGBA32F),Y===i.HALF_FLOAT&&(ve=i.RGBA16F),Y===i.UNSIGNED_BYTE&&(ve=Le===ot?i.SRGB8_ALPHA8:i.RGBA8),Y===i.UNSIGNED_SHORT_4_4_4_4&&(ve=i.RGBA4),Y===i.UNSIGNED_SHORT_5_5_5_1&&(ve=i.RGB5_A1)}return(ve===i.R16F||ve===i.R32F||ve===i.RG16F||ve===i.RG32F||ve===i.RGBA16F||ve===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ve}function I(E,x,Y){return b(E,Y)===!0||E.isFramebufferTexture&&E.minFilter!==Bt&&E.minFilter!==nn?Math.log2(Math.max(x.width,x.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?x.mipmaps.length:1}function A(E){return E===Bt||E===Va||E===Vr?i.NEAREST:i.LINEAR}function R(E){const x=E.target;x.removeEventListener("dispose",R),M(x),x.isVideoTexture&&h.delete(x)}function H(E){const x=E.target;x.removeEventListener("dispose",H),z(x)}function M(E){const x=n.get(E);if(x.__webglInit===void 0)return;const Y=E.source,_e=p.get(Y);if(_e){const pe=_e[x.__cacheKey];pe.usedTimes--,pe.usedTimes===0&&w(E),Object.keys(_e).length===0&&p.delete(Y)}n.remove(E)}function w(E){const x=n.get(E);i.deleteTexture(x.__webglTexture);const Y=E.source,_e=p.get(Y);delete _e[x.__cacheKey],a.memory.textures--}function z(E){const x=E.texture,Y=n.get(E),_e=n.get(x);if(_e.__webglTexture!==void 0&&(i.deleteTexture(_e.__webglTexture),a.memory.textures--),E.depthTexture&&E.depthTexture.dispose(),E.isWebGLCubeRenderTarget)for(let pe=0;pe<6;pe++){if(Array.isArray(Y.__webglFramebuffer[pe]))for(let ve=0;ve<Y.__webglFramebuffer[pe].length;ve++)i.deleteFramebuffer(Y.__webglFramebuffer[pe][ve]);else i.deleteFramebuffer(Y.__webglFramebuffer[pe]);Y.__webglDepthbuffer&&i.deleteRenderbuffer(Y.__webglDepthbuffer[pe])}else{if(Array.isArray(Y.__webglFramebuffer))for(let pe=0;pe<Y.__webglFramebuffer.length;pe++)i.deleteFramebuffer(Y.__webglFramebuffer[pe]);else i.deleteFramebuffer(Y.__webglFramebuffer);if(Y.__webglDepthbuffer&&i.deleteRenderbuffer(Y.__webglDepthbuffer),Y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(Y.__webglMultisampledFramebuffer),Y.__webglColorRenderbuffer)for(let pe=0;pe<Y.__webglColorRenderbuffer.length;pe++)Y.__webglColorRenderbuffer[pe]&&i.deleteRenderbuffer(Y.__webglColorRenderbuffer[pe]);Y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(Y.__webglDepthRenderbuffer)}if(E.isWebGLMultipleRenderTargets)for(let pe=0,ve=x.length;pe<ve;pe++){const Le=n.get(x[pe]);Le.__webglTexture&&(i.deleteTexture(Le.__webglTexture),a.memory.textures--),n.remove(x[pe])}n.remove(x),n.remove(E)}let X=0;function de(){X=0}function F(){const E=X;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),X+=1,E}function B(E){const x=[];return x.push(E.wrapS),x.push(E.wrapT),x.push(E.wrapR||0),x.push(E.magFilter),x.push(E.minFilter),x.push(E.anisotropy),x.push(E.internalFormat),x.push(E.format),x.push(E.type),x.push(E.generateMipmaps),x.push(E.premultiplyAlpha),x.push(E.flipY),x.push(E.unpackAlignment),x.push(E.colorSpace),x.join()}function K(E,x){const Y=n.get(E);if(E.isVideoTexture&&$e(E),E.isRenderTargetTexture===!1&&E.version>0&&Y.__version!==E.version){const _e=E.image;if(_e===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(_e.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{xe(Y,E,x);return}}t.bindTexture(i.TEXTURE_2D,Y.__webglTexture,i.TEXTURE0+x)}function oe(E,x){const Y=n.get(E);if(E.version>0&&Y.__version!==E.version){xe(Y,E,x);return}t.bindTexture(i.TEXTURE_2D_ARRAY,Y.__webglTexture,i.TEXTURE0+x)}function re(E,x){const Y=n.get(E);if(E.version>0&&Y.__version!==E.version){xe(Y,E,x);return}t.bindTexture(i.TEXTURE_3D,Y.__webglTexture,i.TEXTURE0+x)}function te(E,x){const Y=n.get(E);if(E.version>0&&Y.__version!==E.version){V(Y,E,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture,i.TEXTURE0+x)}const le={[qo]:i.REPEAT,[fn]:i.CLAMP_TO_EDGE,[Ko]:i.MIRRORED_REPEAT},ue={[Bt]:i.NEAREST,[Va]:i.NEAREST_MIPMAP_NEAREST,[Vr]:i.NEAREST_MIPMAP_LINEAR,[nn]:i.LINEAR,[$d]:i.LINEAR_MIPMAP_NEAREST,[Ts]:i.LINEAR_MIPMAP_LINEAR},ne={[ru]:i.NEVER,[du]:i.ALWAYS,[ou]:i.LESS,[fh]:i.LEQUAL,[au]:i.EQUAL,[hu]:i.GEQUAL,[lu]:i.GREATER,[cu]:i.NOTEQUAL};function k(E,x,Y){if(Y?(i.texParameteri(E,i.TEXTURE_WRAP_S,le[x.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,le[x.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,le[x.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,ue[x.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,ue[x.minFilter])):(i.texParameteri(E,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(E,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(x.wrapS!==fn||x.wrapT!==fn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(E,i.TEXTURE_MAG_FILTER,A(x.magFilter)),i.texParameteri(E,i.TEXTURE_MIN_FILTER,A(x.minFilter)),x.minFilter!==Bt&&x.minFilter!==nn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),x.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,ne[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const _e=e.get("EXT_texture_filter_anisotropic");if(x.magFilter===Bt||x.minFilter!==Vr&&x.minFilter!==Ts||x.type===$n&&e.has("OES_texture_float_linear")===!1||o===!1&&x.type===On&&e.has("OES_texture_half_float_linear")===!1)return;(x.anisotropy>1||n.get(x).__currentAnisotropy)&&(i.texParameterf(E,_e.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy)}}function se(E,x){let Y=!1;E.__webglInit===void 0&&(E.__webglInit=!0,x.addEventListener("dispose",R));const _e=x.source;let pe=p.get(_e);pe===void 0&&(pe={},p.set(_e,pe));const ve=B(x);if(ve!==E.__cacheKey){pe[ve]===void 0&&(pe[ve]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,Y=!0),pe[ve].usedTimes++;const Le=pe[E.__cacheKey];Le!==void 0&&(pe[E.__cacheKey].usedTimes--,Le.usedTimes===0&&w(x)),E.__cacheKey=ve,E.__webglTexture=pe[ve].texture}return Y}function xe(E,x,Y){let _e=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(_e=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(_e=i.TEXTURE_3D);const pe=se(E,x),ve=x.source;t.bindTexture(_e,E.__webglTexture,i.TEXTURE0+Y);const Le=n.get(ve);if(ve.version!==Le.__version||pe===!0){t.activeTexture(i.TEXTURE0+Y);const Ee=rt.getPrimaries(rt.workingColorSpace),Re=x.colorSpace===on?null:rt.getPrimaries(x.colorSpace),Ne=x.colorSpace===on||Ee===Re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);const C=u(x)&&f(x.image)===!1;let P=_(x.image,C,!1,s.maxTextureSize);P=Ue(x,P);const J=f(P)||o,ie=r.convert(x.format,x.colorSpace);let $=r.convert(x.type),q=T(x.internalFormat,ie,$,x.colorSpace,x.isVideoTexture);k(_e,x,J);let N;const y=x.mipmaps,ae=o&&x.isVideoTexture!==!0&&q!==hh,Ae=Le.__version===void 0||pe===!0,Te=I(x,P,J);if(x.isDepthTexture)q=i.DEPTH_COMPONENT,o?x.type===$n?q=i.DEPTH_COMPONENT32F:x.type===Yn?q=i.DEPTH_COMPONENT24:x.type===ui?q=i.DEPTH24_STENCIL8:q=i.DEPTH_COMPONENT16:x.type===$n&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),x.format===fi&&q===i.DEPTH_COMPONENT&&x.type!==ua&&x.type!==Yn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),x.type=Yn,$=r.convert(x.type)),x.format===es&&q===i.DEPTH_COMPONENT&&(q=i.DEPTH_STENCIL,x.type!==ui&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),x.type=ui,$=r.convert(x.type))),Ae&&(ae?t.texStorage2D(i.TEXTURE_2D,1,q,P.width,P.height):t.texImage2D(i.TEXTURE_2D,0,q,P.width,P.height,0,ie,$,null));else if(x.isDataTexture)if(y.length>0&&J){ae&&Ae&&t.texStorage2D(i.TEXTURE_2D,Te,q,y[0].width,y[0].height);for(let me=0,U=y.length;me<U;me++)N=y[me],ae?t.texSubImage2D(i.TEXTURE_2D,me,0,0,N.width,N.height,ie,$,N.data):t.texImage2D(i.TEXTURE_2D,me,q,N.width,N.height,0,ie,$,N.data);x.generateMipmaps=!1}else ae?(Ae&&t.texStorage2D(i.TEXTURE_2D,Te,q,P.width,P.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,P.width,P.height,ie,$,P.data)):t.texImage2D(i.TEXTURE_2D,0,q,P.width,P.height,0,ie,$,P.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){ae&&Ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Te,q,y[0].width,y[0].height,P.depth);for(let me=0,U=y.length;me<U;me++)N=y[me],x.format!==pn?ie!==null?ae?t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,me,0,0,0,N.width,N.height,P.depth,ie,N.data,0,0):t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,me,q,N.width,N.height,P.depth,0,N.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?t.texSubImage3D(i.TEXTURE_2D_ARRAY,me,0,0,0,N.width,N.height,P.depth,ie,$,N.data):t.texImage3D(i.TEXTURE_2D_ARRAY,me,q,N.width,N.height,P.depth,0,ie,$,N.data)}else{ae&&Ae&&t.texStorage2D(i.TEXTURE_2D,Te,q,y[0].width,y[0].height);for(let me=0,U=y.length;me<U;me++)N=y[me],x.format!==pn?ie!==null?ae?t.compressedTexSubImage2D(i.TEXTURE_2D,me,0,0,N.width,N.height,ie,N.data):t.compressedTexImage2D(i.TEXTURE_2D,me,q,N.width,N.height,0,N.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?t.texSubImage2D(i.TEXTURE_2D,me,0,0,N.width,N.height,ie,$,N.data):t.texImage2D(i.TEXTURE_2D,me,q,N.width,N.height,0,ie,$,N.data)}else if(x.isDataArrayTexture)ae?(Ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Te,q,P.width,P.height,P.depth),t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,P.width,P.height,P.depth,ie,$,P.data)):t.texImage3D(i.TEXTURE_2D_ARRAY,0,q,P.width,P.height,P.depth,0,ie,$,P.data);else if(x.isData3DTexture)ae?(Ae&&t.texStorage3D(i.TEXTURE_3D,Te,q,P.width,P.height,P.depth),t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,P.width,P.height,P.depth,ie,$,P.data)):t.texImage3D(i.TEXTURE_3D,0,q,P.width,P.height,P.depth,0,ie,$,P.data);else if(x.isFramebufferTexture){if(Ae)if(ae)t.texStorage2D(i.TEXTURE_2D,Te,q,P.width,P.height);else{let me=P.width,U=P.height;for(let ye=0;ye<Te;ye++)t.texImage2D(i.TEXTURE_2D,ye,q,me,U,0,ie,$,null),me>>=1,U>>=1}}else if(y.length>0&&J){ae&&Ae&&t.texStorage2D(i.TEXTURE_2D,Te,q,y[0].width,y[0].height);for(let me=0,U=y.length;me<U;me++)N=y[me],ae?t.texSubImage2D(i.TEXTURE_2D,me,0,0,ie,$,N):t.texImage2D(i.TEXTURE_2D,me,q,ie,$,N);x.generateMipmaps=!1}else ae?(Ae&&t.texStorage2D(i.TEXTURE_2D,Te,q,P.width,P.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,ie,$,P)):t.texImage2D(i.TEXTURE_2D,0,q,ie,$,P);b(x,J)&&v(_e),Le.__version=ve.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function V(E,x,Y){if(x.image.length!==6)return;const _e=se(E,x),pe=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+Y);const ve=n.get(pe);if(pe.version!==ve.__version||_e===!0){t.activeTexture(i.TEXTURE0+Y);const Le=rt.getPrimaries(rt.workingColorSpace),Ee=x.colorSpace===on?null:rt.getPrimaries(x.colorSpace),Re=x.colorSpace===on||Le===Ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);const Ne=x.isCompressedTexture||x.image[0].isCompressedTexture,C=x.image[0]&&x.image[0].isDataTexture,P=[];for(let me=0;me<6;me++)!Ne&&!C?P[me]=_(x.image[me],!1,!0,s.maxCubemapSize):P[me]=C?x.image[me].image:x.image[me],P[me]=Ue(x,P[me]);const J=P[0],ie=f(J)||o,$=r.convert(x.format,x.colorSpace),q=r.convert(x.type),N=T(x.internalFormat,$,q,x.colorSpace),y=o&&x.isVideoTexture!==!0,ae=ve.__version===void 0||_e===!0;let Ae=I(x,J,ie);k(i.TEXTURE_CUBE_MAP,x,ie);let Te;if(Ne){y&&ae&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,N,J.width,J.height);for(let me=0;me<6;me++){Te=P[me].mipmaps;for(let U=0;U<Te.length;U++){const ye=Te[U];x.format!==pn?$!==null?y?t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,U,0,0,ye.width,ye.height,$,ye.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,U,N,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):y?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,U,0,0,ye.width,ye.height,$,q,ye.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,U,N,ye.width,ye.height,0,$,q,ye.data)}}}else{Te=x.mipmaps,y&&ae&&(Te.length>0&&Ae++,t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,N,P[0].width,P[0].height));for(let me=0;me<6;me++)if(C){y?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,P[me].width,P[me].height,$,q,P[me].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,N,P[me].width,P[me].height,0,$,q,P[me].data);for(let U=0;U<Te.length;U++){const we=Te[U].image[me].image;y?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,U+1,0,0,we.width,we.height,$,q,we.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,U+1,N,we.width,we.height,0,$,q,we.data)}}else{y?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,$,q,P[me]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,N,$,q,P[me]);for(let U=0;U<Te.length;U++){const ye=Te[U];y?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,U+1,0,0,$,q,ye.image[me]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,U+1,N,$,q,ye.image[me])}}}b(x,ie)&&v(i.TEXTURE_CUBE_MAP),ve.__version=pe.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function ee(E,x,Y,_e,pe,ve){const Le=r.convert(Y.format,Y.colorSpace),Ee=r.convert(Y.type),Re=T(Y.internalFormat,Le,Ee,Y.colorSpace);if(!n.get(x).__hasExternalTextures){const C=Math.max(1,x.width>>ve),P=Math.max(1,x.height>>ve);pe===i.TEXTURE_3D||pe===i.TEXTURE_2D_ARRAY?t.texImage3D(pe,ve,Re,C,P,x.depth,0,Le,Ee,null):t.texImage2D(pe,ve,Re,C,P,0,Le,Ee,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),ce(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,_e,pe,n.get(Y).__webglTexture,0,he(x)):(pe===i.TEXTURE_2D||pe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&pe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,_e,pe,n.get(Y).__webglTexture,ve),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ge(E,x,Y){if(i.bindRenderbuffer(i.RENDERBUFFER,E),x.depthBuffer&&!x.stencilBuffer){let _e=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(Y||ce(x)){const pe=x.depthTexture;pe&&pe.isDepthTexture&&(pe.type===$n?_e=i.DEPTH_COMPONENT32F:pe.type===Yn&&(_e=i.DEPTH_COMPONENT24));const ve=he(x);ce(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ve,_e,x.width,x.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ve,_e,x.width,x.height)}else i.renderbufferStorage(i.RENDERBUFFER,_e,x.width,x.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,E)}else if(x.depthBuffer&&x.stencilBuffer){const _e=he(x);Y&&ce(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,_e,i.DEPTH24_STENCIL8,x.width,x.height):ce(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,_e,i.DEPTH24_STENCIL8,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,E)}else{const _e=x.isWebGLMultipleRenderTargets===!0?x.texture:[x.texture];for(let pe=0;pe<_e.length;pe++){const ve=_e[pe],Le=r.convert(ve.format,ve.colorSpace),Ee=r.convert(ve.type),Re=T(ve.internalFormat,Le,Ee,ve.colorSpace),Ne=he(x);Y&&ce(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ne,Re,x.width,x.height):ce(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ne,Re,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Re,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Me(E,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),K(x.depthTexture,0);const _e=n.get(x.depthTexture).__webglTexture,pe=he(x);if(x.depthTexture.format===fi)ce(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,_e,0,pe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,_e,0);else if(x.depthTexture.format===es)ce(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,_e,0,pe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,_e,0);else throw new Error("Unknown depthTexture format")}function be(E){const x=n.get(E),Y=E.isWebGLCubeRenderTarget===!0;if(E.depthTexture&&!x.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");Me(x.__webglFramebuffer,E)}else if(Y){x.__webglDepthbuffer=[];for(let _e=0;_e<6;_e++)t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[_e]),x.__webglDepthbuffer[_e]=i.createRenderbuffer(),ge(x.__webglDepthbuffer[_e],E,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer=i.createRenderbuffer(),ge(x.__webglDepthbuffer,E,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function De(E,x,Y){const _e=n.get(E);x!==void 0&&ee(_e.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Y!==void 0&&be(E)}function O(E){const x=E.texture,Y=n.get(E),_e=n.get(x);E.addEventListener("dispose",H),E.isWebGLMultipleRenderTargets!==!0&&(_e.__webglTexture===void 0&&(_e.__webglTexture=i.createTexture()),_e.__version=x.version,a.memory.textures++);const pe=E.isWebGLCubeRenderTarget===!0,ve=E.isWebGLMultipleRenderTargets===!0,Le=f(E)||o;if(pe){Y.__webglFramebuffer=[];for(let Ee=0;Ee<6;Ee++)if(o&&x.mipmaps&&x.mipmaps.length>0){Y.__webglFramebuffer[Ee]=[];for(let Re=0;Re<x.mipmaps.length;Re++)Y.__webglFramebuffer[Ee][Re]=i.createFramebuffer()}else Y.__webglFramebuffer[Ee]=i.createFramebuffer()}else{if(o&&x.mipmaps&&x.mipmaps.length>0){Y.__webglFramebuffer=[];for(let Ee=0;Ee<x.mipmaps.length;Ee++)Y.__webglFramebuffer[Ee]=i.createFramebuffer()}else Y.__webglFramebuffer=i.createFramebuffer();if(ve)if(s.drawBuffers){const Ee=E.texture;for(let Re=0,Ne=Ee.length;Re<Ne;Re++){const C=n.get(Ee[Re]);C.__webglTexture===void 0&&(C.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&E.samples>0&&ce(E)===!1){const Ee=ve?x:[x];Y.__webglMultisampledFramebuffer=i.createFramebuffer(),Y.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let Re=0;Re<Ee.length;Re++){const Ne=Ee[Re];Y.__webglColorRenderbuffer[Re]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Y.__webglColorRenderbuffer[Re]);const C=r.convert(Ne.format,Ne.colorSpace),P=r.convert(Ne.type),J=T(Ne.internalFormat,C,P,Ne.colorSpace,E.isXRRenderTarget===!0),ie=he(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,ie,J,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,Y.__webglColorRenderbuffer[Re])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(Y.__webglDepthRenderbuffer=i.createRenderbuffer(),ge(Y.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(pe){t.bindTexture(i.TEXTURE_CUBE_MAP,_e.__webglTexture),k(i.TEXTURE_CUBE_MAP,x,Le);for(let Ee=0;Ee<6;Ee++)if(o&&x.mipmaps&&x.mipmaps.length>0)for(let Re=0;Re<x.mipmaps.length;Re++)ee(Y.__webglFramebuffer[Ee][Re],E,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Re);else ee(Y.__webglFramebuffer[Ee],E,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0);b(x,Le)&&v(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){const Ee=E.texture;for(let Re=0,Ne=Ee.length;Re<Ne;Re++){const C=Ee[Re],P=n.get(C);t.bindTexture(i.TEXTURE_2D,P.__webglTexture),k(i.TEXTURE_2D,C,Le),ee(Y.__webglFramebuffer,E,C,i.COLOR_ATTACHMENT0+Re,i.TEXTURE_2D,0),b(C,Le)&&v(i.TEXTURE_2D)}t.unbindTexture()}else{let Ee=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(o?Ee=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(Ee,_e.__webglTexture),k(Ee,x,Le),o&&x.mipmaps&&x.mipmaps.length>0)for(let Re=0;Re<x.mipmaps.length;Re++)ee(Y.__webglFramebuffer[Re],E,x,i.COLOR_ATTACHMENT0,Ee,Re);else ee(Y.__webglFramebuffer,E,x,i.COLOR_ATTACHMENT0,Ee,0);b(x,Le)&&v(Ee),t.unbindTexture()}E.depthBuffer&&be(E)}function We(E){const x=f(E)||o,Y=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let _e=0,pe=Y.length;_e<pe;_e++){const ve=Y[_e];if(b(ve,x)){const Le=E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Ee=n.get(ve).__webglTexture;t.bindTexture(Le,Ee),v(Le),t.unbindTexture()}}}function fe(E){if(o&&E.samples>0&&ce(E)===!1){const x=E.isWebGLMultipleRenderTargets?E.texture:[E.texture],Y=E.width,_e=E.height;let pe=i.COLOR_BUFFER_BIT;const ve=[],Le=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ee=n.get(E),Re=E.isWebGLMultipleRenderTargets===!0;if(Re)for(let Ne=0;Ne<x.length;Ne++)t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let Ne=0;Ne<x.length;Ne++){ve.push(i.COLOR_ATTACHMENT0+Ne),E.depthBuffer&&ve.push(Le);const C=Ee.__ignoreDepthValues!==void 0?Ee.__ignoreDepthValues:!1;if(C===!1&&(E.depthBuffer&&(pe|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&(pe|=i.STENCIL_BUFFER_BIT)),Re&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[Ne]),C===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Le]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Le])),Re){const P=n.get(x[Ne]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,P,0)}i.blitFramebuffer(0,0,Y,_e,0,0,Y,_e,pe,i.NEAREST),c&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ve)}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Re)for(let Ne=0;Ne<x.length;Ne++){t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[Ne]);const C=n.get(x[Ne]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.TEXTURE_2D,C,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}}function he(E){return Math.min(s.maxSamples,E.samples)}function ce(E){const x=n.get(E);return o&&E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function $e(E){const x=a.render.frame;h.get(E)!==x&&(h.set(E,x),E.update())}function Ue(E,x){const Y=E.colorSpace,_e=E.format,pe=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||E.format===jo||Y!==kn&&Y!==on&&(rt.getTransfer(Y)===ot?o===!1?e.has("EXT_sRGB")===!0&&_e===pn?(E.format=jo,E.minFilter=nn,E.generateMipmaps=!1):x=mh.sRGBToLinear(x):(_e!==pn||pe!==Jn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),x}this.allocateTextureUnit=F,this.resetTextureUnits=de,this.setTexture2D=K,this.setTexture2DArray=oe,this.setTexture3D=re,this.setTextureCube=te,this.rebindTextures=De,this.setupRenderTarget=O,this.updateRenderTargetMipmap=We,this.updateMultisampleRenderTarget=fe,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=ce}function wg(i,e,t){const n=t.isWebGL2;function s(r,a=on){let o;const l=rt.getTransfer(a);if(r===Jn)return i.UNSIGNED_BYTE;if(r===rh)return i.UNSIGNED_SHORT_4_4_4_4;if(r===oh)return i.UNSIGNED_SHORT_5_5_5_1;if(r===qd)return i.BYTE;if(r===Kd)return i.SHORT;if(r===ua)return i.UNSIGNED_SHORT;if(r===sh)return i.INT;if(r===Yn)return i.UNSIGNED_INT;if(r===$n)return i.FLOAT;if(r===On)return n?i.HALF_FLOAT:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===jd)return i.ALPHA;if(r===pn)return i.RGBA;if(r===Zd)return i.LUMINANCE;if(r===Jd)return i.LUMINANCE_ALPHA;if(r===fi)return i.DEPTH_COMPONENT;if(r===es)return i.DEPTH_STENCIL;if(r===jo)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Qd)return i.RED;if(r===ah)return i.RED_INTEGER;if(r===eu)return i.RG;if(r===lh)return i.RG_INTEGER;if(r===ch)return i.RGBA_INTEGER;if(r===Wr||r===Xr||r===Yr||r===$r)if(l===ot)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Wr)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Xr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Yr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===$r)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Wr)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Xr)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Yr)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===$r)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Wa||r===Xa||r===Ya||r===$a)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Wa)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Xa)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Ya)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===$a)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===hh)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===qa||r===Ka)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(r===qa)return l===ot?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===Ka)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===ja||r===Za||r===Ja||r===Qa||r===el||r===tl||r===nl||r===il||r===sl||r===rl||r===ol||r===al||r===ll||r===cl)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(r===ja)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Za)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Ja)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Qa)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===el)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===tl)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===nl)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===il)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===sl)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===rl)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===ol)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===al)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===ll)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===cl)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===qr||r===hl||r===dl)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(r===qr)return l===ot?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===hl)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===dl)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===tu||r===ul||r===fl||r===pl)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(r===qr)return o.COMPRESSED_RED_RGTC1_EXT;if(r===ul)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===fl)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===pl)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ui?n?i.UNSIGNED_INT_24_8:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class Tg extends Xt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class yn extends St{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ag={type:"move"};class vo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new yn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new yn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new yn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const f=t.getJointPose(_,n),u=this._getHandJoint(c,_);f!==null&&(u.matrix.fromArray(f.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=f.radius),u.visible=f!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],p=h.position.distanceTo(d.position),m=.02,g=.005;c.inputState.pinching&&p>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ag)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new yn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Rg extends _i{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,p=null,m=null,g=null;const _=t.getContextAttributes();let f=null,u=null;const b=[],v=[],T=new Ie;let I=null;const A=new Xt;A.layers.enable(1),A.viewport=new lt;const R=new Xt;R.layers.enable(2),R.viewport=new lt;const H=[A,R],M=new Tg;M.layers.enable(1),M.layers.enable(2);let w=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let se=b[k];return se===void 0&&(se=new vo,b[k]=se),se.getTargetRaySpace()},this.getControllerGrip=function(k){let se=b[k];return se===void 0&&(se=new vo,b[k]=se),se.getGripSpace()},this.getHand=function(k){let se=b[k];return se===void 0&&(se=new vo,b[k]=se),se.getHandSpace()};function X(k){const se=v.indexOf(k.inputSource);if(se===-1)return;const xe=b[se];xe!==void 0&&(xe.update(k.inputSource,k.frame,c||a),xe.dispatchEvent({type:k.type,data:k.inputSource}))}function de(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",de),s.removeEventListener("inputsourceschange",F);for(let k=0;k<b.length;k++){const se=v[k];se!==null&&(v[k]=null,b[k].disconnect(se))}w=null,z=null,e.setRenderTarget(f),m=null,p=null,d=null,s=null,u=null,ne.stop(),n.isPresenting=!1,e.setPixelRatio(I),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){r=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){o=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(k){c=k},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(k){if(s=k,s!==null){if(f=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",de),s.addEventListener("inputsourceschange",F),_.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(T),s.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const se={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,se),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),u=new mn(m.framebufferWidth,m.framebufferHeight,{format:pn,type:Jn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let se=null,xe=null,V=null;_.depth&&(V=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,se=_.stencil?es:fi,xe=_.stencil?ui:Yn);const ee={colorFormat:t.RGBA8,depthFormat:V,scaleFactor:r};d=new XRWebGLBinding(s,t),p=d.createProjectionLayer(ee),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),u=new mn(p.textureWidth,p.textureHeight,{format:pn,type:Jn,depthTexture:new wh(p.textureWidth,p.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0});const ge=e.properties.get(u);ge.__ignoreDepthValues=p.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ne.setContext(s),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function F(k){for(let se=0;se<k.removed.length;se++){const xe=k.removed[se],V=v.indexOf(xe);V>=0&&(v[V]=null,b[V].disconnect(xe))}for(let se=0;se<k.added.length;se++){const xe=k.added[se];let V=v.indexOf(xe);if(V===-1){for(let ge=0;ge<b.length;ge++)if(ge>=v.length){v.push(xe),V=ge;break}else if(v[ge]===null){v[ge]=xe,V=ge;break}if(V===-1)break}const ee=b[V];ee&&ee.connect(xe)}}const B=new D,K=new D;function oe(k,se,xe){B.setFromMatrixPosition(se.matrixWorld),K.setFromMatrixPosition(xe.matrixWorld);const V=B.distanceTo(K),ee=se.projectionMatrix.elements,ge=xe.projectionMatrix.elements,Me=ee[14]/(ee[10]-1),be=ee[14]/(ee[10]+1),De=(ee[9]+1)/ee[5],O=(ee[9]-1)/ee[5],We=(ee[8]-1)/ee[0],fe=(ge[8]+1)/ge[0],he=Me*We,ce=Me*fe,$e=V/(-We+fe),Ue=$e*-We;se.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX(Ue),k.translateZ($e),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert();const E=Me+$e,x=be+$e,Y=he-Ue,_e=ce+(V-Ue),pe=De*be/x*E,ve=O*be/x*E;k.projectionMatrix.makePerspective(Y,_e,pe,ve,E,x),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}function re(k,se){se===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(se.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(s===null)return;M.near=R.near=A.near=k.near,M.far=R.far=A.far=k.far,(w!==M.near||z!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),w=M.near,z=M.far);const se=k.parent,xe=M.cameras;re(M,se);for(let V=0;V<xe.length;V++)re(xe[V],se);xe.length===2?oe(M,A,R):M.projectionMatrix.copy(A.projectionMatrix),te(k,M,se)};function te(k,se,xe){xe===null?k.matrix.copy(se.matrixWorld):(k.matrix.copy(xe.matrixWorld),k.matrix.invert(),k.matrix.multiply(se.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(se.projectionMatrix),k.projectionMatrixInverse.copy(se.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=As*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(p===null&&m===null))return l},this.setFoveation=function(k){l=k,p!==null&&(p.fixedFoveation=k),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=k)};let le=null;function ue(k,se){if(h=se.getViewerPose(c||a),g=se,h!==null){const xe=h.views;m!==null&&(e.setRenderTargetFramebuffer(u,m.framebuffer),e.setRenderTarget(u));let V=!1;xe.length!==M.cameras.length&&(M.cameras.length=0,V=!0);for(let ee=0;ee<xe.length;ee++){const ge=xe[ee];let Me=null;if(m!==null)Me=m.getViewport(ge);else{const De=d.getViewSubImage(p,ge);Me=De.viewport,ee===0&&(e.setRenderTargetTextures(u,De.colorTexture,p.ignoreDepthValues?void 0:De.depthStencilTexture),e.setRenderTarget(u))}let be=H[ee];be===void 0&&(be=new Xt,be.layers.enable(ee),be.viewport=new lt,H[ee]=be),be.matrix.fromArray(ge.transform.matrix),be.matrix.decompose(be.position,be.quaternion,be.scale),be.projectionMatrix.fromArray(ge.projectionMatrix),be.projectionMatrixInverse.copy(be.projectionMatrix).invert(),be.viewport.set(Me.x,Me.y,Me.width,Me.height),ee===0&&(M.matrix.copy(be.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),V===!0&&M.cameras.push(be)}}for(let xe=0;xe<b.length;xe++){const V=v[xe],ee=b[xe];V!==null&&ee!==void 0&&ee.update(V,se,c||a)}le&&le(k,se),se.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:se}),g=null}const ne=new Eh;ne.setAnimationLoop(ue),this.setAnimationLoop=function(k){le=k},this.dispose=function(){}}}function Cg(i,e){function t(f,u){f.matrixAutoUpdate===!0&&f.updateMatrix(),u.value.copy(f.matrix)}function n(f,u){u.color.getRGB(f.fogColor.value,Mh(i)),u.isFog?(f.fogNear.value=u.near,f.fogFar.value=u.far):u.isFogExp2&&(f.fogDensity.value=u.density)}function s(f,u,b,v,T){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(f,u):u.isMeshToonMaterial?(r(f,u),d(f,u)):u.isMeshPhongMaterial?(r(f,u),h(f,u)):u.isMeshStandardMaterial?(r(f,u),p(f,u),u.isMeshPhysicalMaterial&&m(f,u,T)):u.isMeshMatcapMaterial?(r(f,u),g(f,u)):u.isMeshDepthMaterial?r(f,u):u.isMeshDistanceMaterial?(r(f,u),_(f,u)):u.isMeshNormalMaterial?r(f,u):u.isLineBasicMaterial?(a(f,u),u.isLineDashedMaterial&&o(f,u)):u.isPointsMaterial?l(f,u,b,v):u.isSpriteMaterial?c(f,u):u.isShadowMaterial?(f.color.value.copy(u.color),f.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(f,u){f.opacity.value=u.opacity,u.color&&f.diffuse.value.copy(u.color),u.emissive&&f.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(f.map.value=u.map,t(u.map,f.mapTransform)),u.alphaMap&&(f.alphaMap.value=u.alphaMap,t(u.alphaMap,f.alphaMapTransform)),u.bumpMap&&(f.bumpMap.value=u.bumpMap,t(u.bumpMap,f.bumpMapTransform),f.bumpScale.value=u.bumpScale,u.side===Gt&&(f.bumpScale.value*=-1)),u.normalMap&&(f.normalMap.value=u.normalMap,t(u.normalMap,f.normalMapTransform),f.normalScale.value.copy(u.normalScale),u.side===Gt&&f.normalScale.value.negate()),u.displacementMap&&(f.displacementMap.value=u.displacementMap,t(u.displacementMap,f.displacementMapTransform),f.displacementScale.value=u.displacementScale,f.displacementBias.value=u.displacementBias),u.emissiveMap&&(f.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,f.emissiveMapTransform)),u.specularMap&&(f.specularMap.value=u.specularMap,t(u.specularMap,f.specularMapTransform)),u.alphaTest>0&&(f.alphaTest.value=u.alphaTest);const b=e.get(u).envMap;if(b&&(f.envMap.value=b,f.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=u.reflectivity,f.ior.value=u.ior,f.refractionRatio.value=u.refractionRatio),u.lightMap){f.lightMap.value=u.lightMap;const v=i._useLegacyLights===!0?Math.PI:1;f.lightMapIntensity.value=u.lightMapIntensity*v,t(u.lightMap,f.lightMapTransform)}u.aoMap&&(f.aoMap.value=u.aoMap,f.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,f.aoMapTransform))}function a(f,u){f.diffuse.value.copy(u.color),f.opacity.value=u.opacity,u.map&&(f.map.value=u.map,t(u.map,f.mapTransform))}function o(f,u){f.dashSize.value=u.dashSize,f.totalSize.value=u.dashSize+u.gapSize,f.scale.value=u.scale}function l(f,u,b,v){f.diffuse.value.copy(u.color),f.opacity.value=u.opacity,f.size.value=u.size*b,f.scale.value=v*.5,u.map&&(f.map.value=u.map,t(u.map,f.uvTransform)),u.alphaMap&&(f.alphaMap.value=u.alphaMap,t(u.alphaMap,f.alphaMapTransform)),u.alphaTest>0&&(f.alphaTest.value=u.alphaTest)}function c(f,u){f.diffuse.value.copy(u.color),f.opacity.value=u.opacity,f.rotation.value=u.rotation,u.map&&(f.map.value=u.map,t(u.map,f.mapTransform)),u.alphaMap&&(f.alphaMap.value=u.alphaMap,t(u.alphaMap,f.alphaMapTransform)),u.alphaTest>0&&(f.alphaTest.value=u.alphaTest)}function h(f,u){f.specular.value.copy(u.specular),f.shininess.value=Math.max(u.shininess,1e-4)}function d(f,u){u.gradientMap&&(f.gradientMap.value=u.gradientMap)}function p(f,u){f.metalness.value=u.metalness,u.metalnessMap&&(f.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,f.metalnessMapTransform)),f.roughness.value=u.roughness,u.roughnessMap&&(f.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,f.roughnessMapTransform)),e.get(u).envMap&&(f.envMapIntensity.value=u.envMapIntensity)}function m(f,u,b){f.ior.value=u.ior,u.sheen>0&&(f.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),f.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(f.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,f.sheenColorMapTransform)),u.sheenRoughnessMap&&(f.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,f.sheenRoughnessMapTransform))),u.clearcoat>0&&(f.clearcoat.value=u.clearcoat,f.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(f.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,f.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(f.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Gt&&f.clearcoatNormalScale.value.negate())),u.iridescence>0&&(f.iridescence.value=u.iridescence,f.iridescenceIOR.value=u.iridescenceIOR,f.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(f.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,f.iridescenceMapTransform)),u.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),u.transmission>0&&(f.transmission.value=u.transmission,f.transmissionSamplerMap.value=b.texture,f.transmissionSamplerSize.value.set(b.width,b.height),u.transmissionMap&&(f.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,f.transmissionMapTransform)),f.thickness.value=u.thickness,u.thicknessMap&&(f.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=u.attenuationDistance,f.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(f.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(f.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=u.specularIntensity,f.specularColor.value.copy(u.specularColor),u.specularColorMap&&(f.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,f.specularColorMapTransform)),u.specularIntensityMap&&(f.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,u){u.matcap&&(f.matcap.value=u.matcap)}function _(f,u){const b=e.get(u).light;f.referencePosition.value.setFromMatrixPosition(b.matrixWorld),f.nearDistance.value=b.shadow.camera.near,f.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Pg(i,e,t,n){let s={},r={},a=[];const o=t.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(b,v){const T=v.program;n.uniformBlockBinding(b,T)}function c(b,v){let T=s[b.id];T===void 0&&(g(b),T=h(b),s[b.id]=T,b.addEventListener("dispose",f));const I=v.program;n.updateUBOMapping(b,I);const A=e.render.frame;r[b.id]!==A&&(p(b),r[b.id]=A)}function h(b){const v=d();b.__bindingPointIndex=v;const T=i.createBuffer(),I=b.__size,A=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,I,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,T),T}function d(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(b){const v=s[b.id],T=b.uniforms,I=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let A=0,R=T.length;A<R;A++){const H=Array.isArray(T[A])?T[A]:[T[A]];for(let M=0,w=H.length;M<w;M++){const z=H[M];if(m(z,A,M,I)===!0){const X=z.__offset,de=Array.isArray(z.value)?z.value:[z.value];let F=0;for(let B=0;B<de.length;B++){const K=de[B],oe=_(K);typeof K=="number"||typeof K=="boolean"?(z.__data[0]=K,i.bufferSubData(i.UNIFORM_BUFFER,X+F,z.__data)):K.isMatrix3?(z.__data[0]=K.elements[0],z.__data[1]=K.elements[1],z.__data[2]=K.elements[2],z.__data[3]=0,z.__data[4]=K.elements[3],z.__data[5]=K.elements[4],z.__data[6]=K.elements[5],z.__data[7]=0,z.__data[8]=K.elements[6],z.__data[9]=K.elements[7],z.__data[10]=K.elements[8],z.__data[11]=0):(K.toArray(z.__data,F),F+=oe.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,X,z.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(b,v,T,I){const A=b.value,R=v+"_"+T;if(I[R]===void 0)return typeof A=="number"||typeof A=="boolean"?I[R]=A:I[R]=A.clone(),!0;{const H=I[R];if(typeof A=="number"||typeof A=="boolean"){if(H!==A)return I[R]=A,!0}else if(H.equals(A)===!1)return H.copy(A),!0}return!1}function g(b){const v=b.uniforms;let T=0;const I=16;for(let R=0,H=v.length;R<H;R++){const M=Array.isArray(v[R])?v[R]:[v[R]];for(let w=0,z=M.length;w<z;w++){const X=M[w],de=Array.isArray(X.value)?X.value:[X.value];for(let F=0,B=de.length;F<B;F++){const K=de[F],oe=_(K),re=T%I;re!==0&&I-re<oe.boundary&&(T+=I-re),X.__data=new Float32Array(oe.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=T,T+=oe.storage}}}const A=T%I;return A>0&&(T+=I-A),b.__size=T,b.__cache={},this}function _(b){const v={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(v.boundary=4,v.storage=4):b.isVector2?(v.boundary=8,v.storage=8):b.isVector3||b.isColor?(v.boundary=16,v.storage=12):b.isVector4?(v.boundary=16,v.storage=16):b.isMatrix3?(v.boundary=48,v.storage=48):b.isMatrix4?(v.boundary=64,v.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),v}function f(b){const v=b.target;v.removeEventListener("dispose",f);const T=a.indexOf(v.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function u(){for(const b in s)i.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:l,update:c,dispose:u}}class Lh{constructor(e={}){const{canvas:t=Tu(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let p;n!==null?p=n.getContextAttributes().alpha:p=a;const m=new Uint32Array(4),g=new Int32Array(4);let _=null,f=null;const u=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ft,this._useLegacyLights=!1,this.toneMapping=Zn,this.toneMappingExposure=1;const v=this;let T=!1,I=0,A=0,R=null,H=-1,M=null;const w=new lt,z=new lt;let X=null;const de=new Pe(0);let F=0,B=t.width,K=t.height,oe=1,re=null,te=null;const le=new lt(0,0,B,K),ue=new lt(0,0,B,K);let ne=!1;const k=new _a;let se=!1,xe=!1,V=null;const ee=new ct,ge=new Ie,Me=new D,be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function De(){return R===null?oe:1}let O=n;function We(S,G){for(let Z=0;Z<S.length;Z++){const Q=S[Z],j=t.getContext(Q,G);if(j!==null)return j}return null}try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ha}`),t.addEventListener("webglcontextlost",me,!1),t.addEventListener("webglcontextrestored",U,!1),t.addEventListener("webglcontextcreationerror",ye,!1),O===null){const G=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&G.shift(),O=We(G,S),O===null)throw We(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&O instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),O.getShaderPrecisionFormat===void 0&&(O.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let fe,he,ce,$e,Ue,E,x,Y,_e,pe,ve,Le,Ee,Re,Ne,C,P,J,ie,$,q,N,y,ae;function Ae(){fe=new Gm(O),he=new Um(O,fe,e),fe.init(he),N=new wg(O,fe,he),ce=new Sg(O,fe,he),$e=new Vm(O),Ue=new cg,E=new Eg(O,fe,ce,Ue,he,N,$e),x=new Nm(v),Y=new km(v),_e=new ju(O,he),y=new Dm(O,fe,_e,he),pe=new zm(O,_e,$e,y),ve=new $m(O,pe,_e,$e),ie=new Ym(O,he,E),C=new Fm(Ue),Le=new lg(v,x,Y,fe,he,y,C),Ee=new Cg(v,Ue),Re=new dg,Ne=new _g(fe,he),J=new Lm(v,x,Y,ce,ve,p,l),P=new yg(v,ve,he),ae=new Pg(O,$e,he,ce),$=new Im(O,fe,$e,he),q=new Hm(O,fe,$e,he),$e.programs=Le.programs,v.capabilities=he,v.extensions=fe,v.properties=Ue,v.renderLists=Re,v.shadowMap=P,v.state=ce,v.info=$e}Ae();const Te=new Rg(v,O);this.xr=Te,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const S=fe.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=fe.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return oe},this.setPixelRatio=function(S){S!==void 0&&(oe=S,this.setSize(B,K,!1))},this.getSize=function(S){return S.set(B,K)},this.setSize=function(S,G,Z=!0){if(Te.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=S,K=G,t.width=Math.floor(S*oe),t.height=Math.floor(G*oe),Z===!0&&(t.style.width=S+"px",t.style.height=G+"px"),this.setViewport(0,0,S,G)},this.getDrawingBufferSize=function(S){return S.set(B*oe,K*oe).floor()},this.setDrawingBufferSize=function(S,G,Z){B=S,K=G,oe=Z,t.width=Math.floor(S*Z),t.height=Math.floor(G*Z),this.setViewport(0,0,S,G)},this.getCurrentViewport=function(S){return S.copy(w)},this.getViewport=function(S){return S.copy(le)},this.setViewport=function(S,G,Z,Q){S.isVector4?le.set(S.x,S.y,S.z,S.w):le.set(S,G,Z,Q),ce.viewport(w.copy(le).multiplyScalar(oe).floor())},this.getScissor=function(S){return S.copy(ue)},this.setScissor=function(S,G,Z,Q){S.isVector4?ue.set(S.x,S.y,S.z,S.w):ue.set(S,G,Z,Q),ce.scissor(z.copy(ue).multiplyScalar(oe).floor())},this.getScissorTest=function(){return ne},this.setScissorTest=function(S){ce.setScissorTest(ne=S)},this.setOpaqueSort=function(S){re=S},this.setTransparentSort=function(S){te=S},this.getClearColor=function(S){return S.copy(J.getClearColor())},this.setClearColor=function(){J.setClearColor.apply(J,arguments)},this.getClearAlpha=function(){return J.getClearAlpha()},this.setClearAlpha=function(){J.setClearAlpha.apply(J,arguments)},this.clear=function(S=!0,G=!0,Z=!0){let Q=0;if(S){let j=!1;if(R!==null){const Ce=R.texture.format;j=Ce===ch||Ce===lh||Ce===ah}if(j){const Ce=R.texture.type,Fe=Ce===Jn||Ce===Yn||Ce===ua||Ce===ui||Ce===rh||Ce===oh,ke=J.getClearColor(),ze=J.getClearAlpha(),je=ke.r,Xe=ke.g,qe=ke.b;Fe?(m[0]=je,m[1]=Xe,m[2]=qe,m[3]=ze,O.clearBufferuiv(O.COLOR,0,m)):(g[0]=je,g[1]=Xe,g[2]=qe,g[3]=ze,O.clearBufferiv(O.COLOR,0,g))}else Q|=O.COLOR_BUFFER_BIT}G&&(Q|=O.DEPTH_BUFFER_BIT),Z&&(Q|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",me,!1),t.removeEventListener("webglcontextrestored",U,!1),t.removeEventListener("webglcontextcreationerror",ye,!1),Re.dispose(),Ne.dispose(),Ue.dispose(),x.dispose(),Y.dispose(),ve.dispose(),y.dispose(),ae.dispose(),Le.dispose(),Te.dispose(),Te.removeEventListener("sessionstart",gt),Te.removeEventListener("sessionend",st),V&&(V.dispose(),V=null),vt.stop()};function me(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const S=$e.autoReset,G=P.enabled,Z=P.autoUpdate,Q=P.needsUpdate,j=P.type;Ae(),$e.autoReset=S,P.enabled=G,P.autoUpdate=Z,P.needsUpdate=Q,P.type=j}function ye(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function we(S){const G=S.target;G.removeEventListener("dispose",we),Be(G)}function Be(S){Oe(S),Ue.remove(S)}function Oe(S){const G=Ue.get(S).programs;G!==void 0&&(G.forEach(function(Z){Le.releaseProgram(Z)}),S.isShaderMaterial&&Le.releaseShaderCache(S))}this.renderBufferDirect=function(S,G,Z,Q,j,Ce){G===null&&(G=be);const Fe=j.isMesh&&j.matrixWorld.determinant()<0,ke=pd(S,G,Z,Q,j);ce.setMaterial(Q,Fe);let ze=Z.index,je=1;if(Q.wireframe===!0){if(ze=pe.getWireframeAttribute(Z),ze===void 0)return;je=2}const Xe=Z.drawRange,qe=Z.attributes.position;let _t=Xe.start*je,$t=(Xe.start+Xe.count)*je;Ce!==null&&(_t=Math.max(_t,Ce.start*je),$t=Math.min($t,(Ce.start+Ce.count)*je)),ze!==null?(_t=Math.max(_t,0),$t=Math.min($t,ze.count)):qe!=null&&(_t=Math.max(_t,0),$t=Math.min($t,qe.count));const Tt=$t-_t;if(Tt<0||Tt===1/0)return;y.setup(j,Q,ke,Z,ze);let En,ht=$;if(ze!==null&&(En=_e.get(ze),ht=q,ht.setIndex(En)),j.isMesh)Q.wireframe===!0?(ce.setLineWidth(Q.wireframeLinewidth*De()),ht.setMode(O.LINES)):ht.setMode(O.TRIANGLES);else if(j.isLine){let Je=Q.linewidth;Je===void 0&&(Je=1),ce.setLineWidth(Je*De()),j.isLineSegments?ht.setMode(O.LINES):j.isLineLoop?ht.setMode(O.LINE_LOOP):ht.setMode(O.LINE_STRIP)}else j.isPoints?ht.setMode(O.POINTS):j.isSprite&&ht.setMode(O.TRIANGLES);if(j.isBatchedMesh)ht.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else if(j.isInstancedMesh)ht.renderInstances(_t,Tt,j.count);else if(Z.isInstancedBufferGeometry){const Je=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,kr=Math.min(Z.instanceCount,Je);ht.renderInstances(_t,Tt,kr)}else ht.render(_t,Tt)};function et(S,G,Z){S.transparent===!0&&S.side===Jt&&S.forceSinglePass===!1?(S.side=Gt,S.needsUpdate=!0,Is(S,G,Z),S.side=Qn,S.needsUpdate=!0,Is(S,G,Z),S.side=Jt):Is(S,G,Z)}this.compile=function(S,G,Z=null){Z===null&&(Z=S),f=Ne.get(Z),f.init(),b.push(f),Z.traverseVisible(function(j){j.isLight&&j.layers.test(G.layers)&&(f.pushLight(j),j.castShadow&&f.pushShadow(j))}),S!==Z&&S.traverseVisible(function(j){j.isLight&&j.layers.test(G.layers)&&(f.pushLight(j),j.castShadow&&f.pushShadow(j))}),f.setupLights(v._useLegacyLights);const Q=new Set;return S.traverse(function(j){const Ce=j.material;if(Ce)if(Array.isArray(Ce))for(let Fe=0;Fe<Ce.length;Fe++){const ke=Ce[Fe];et(ke,Z,j),Q.add(ke)}else et(Ce,Z,j),Q.add(Ce)}),b.pop(),f=null,Q},this.compileAsync=function(S,G,Z=null){const Q=this.compile(S,G,Z);return new Promise(j=>{function Ce(){if(Q.forEach(function(Fe){Ue.get(Fe).currentProgram.isReady()&&Q.delete(Fe)}),Q.size===0){j(S);return}setTimeout(Ce,10)}fe.get("KHR_parallel_shader_compile")!==null?Ce():setTimeout(Ce,10)})};let tt=null;function dt(S){tt&&tt(S)}function gt(){vt.stop()}function st(){vt.start()}const vt=new Eh;vt.setAnimationLoop(dt),typeof self<"u"&&vt.setContext(self),this.setAnimationLoop=function(S){tt=S,Te.setAnimationLoop(S),S===null?vt.stop():vt.start()},Te.addEventListener("sessionstart",gt),Te.addEventListener("sessionend",st),this.render=function(S,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),Te.enabled===!0&&Te.isPresenting===!0&&(Te.cameraAutoUpdate===!0&&Te.updateCamera(G),G=Te.getCamera()),S.isScene===!0&&S.onBeforeRender(v,S,G,R),f=Ne.get(S,b.length),f.init(),b.push(f),ee.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),k.setFromProjectionMatrix(ee),xe=this.localClippingEnabled,se=C.init(this.clippingPlanes,xe),_=Re.get(S,u.length),_.init(),u.push(_),_n(S,G,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(re,te),this.info.render.frame++,se===!0&&C.beginShadows();const Z=f.state.shadowsArray;if(P.render(Z,S,G),se===!0&&C.endShadows(),this.info.autoReset===!0&&this.info.reset(),J.render(_,S),f.setupLights(v._useLegacyLights),G.isArrayCamera){const Q=G.cameras;for(let j=0,Ce=Q.length;j<Ce;j++){const Fe=Q[j];Da(_,S,Fe,Fe.viewport)}}else Da(_,S,G);R!==null&&(E.updateMultisampleRenderTarget(R),E.updateRenderTargetMipmap(R)),S.isScene===!0&&S.onAfterRender(v,S,G),y.resetDefaultState(),H=-1,M=null,b.pop(),b.length>0?f=b[b.length-1]:f=null,u.pop(),u.length>0?_=u[u.length-1]:_=null};function _n(S,G,Z,Q){if(S.visible===!1)return;if(S.layers.test(G.layers)){if(S.isGroup)Z=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(G);else if(S.isLight)f.pushLight(S),S.castShadow&&f.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||k.intersectsSprite(S)){Q&&Me.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ee);const Fe=ve.update(S),ke=S.material;ke.visible&&_.push(S,Fe,ke,Z,Me.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||k.intersectsObject(S))){const Fe=ve.update(S),ke=S.material;if(Q&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Me.copy(S.boundingSphere.center)):(Fe.boundingSphere===null&&Fe.computeBoundingSphere(),Me.copy(Fe.boundingSphere.center)),Me.applyMatrix4(S.matrixWorld).applyMatrix4(ee)),Array.isArray(ke)){const ze=Fe.groups;for(let je=0,Xe=ze.length;je<Xe;je++){const qe=ze[je],_t=ke[qe.materialIndex];_t&&_t.visible&&_.push(S,Fe,_t,Z,Me.z,qe)}}else ke.visible&&_.push(S,Fe,ke,Z,Me.z,null)}}const Ce=S.children;for(let Fe=0,ke=Ce.length;Fe<ke;Fe++)_n(Ce[Fe],G,Z,Q)}function Da(S,G,Z,Q){const j=S.opaque,Ce=S.transmissive,Fe=S.transparent;f.setupLightsView(Z),se===!0&&C.setGlobalState(v.clippingPlanes,Z),Ce.length>0&&fd(j,Ce,G,Z),Q&&ce.viewport(w.copy(Q)),j.length>0&&Ds(j,G,Z),Ce.length>0&&Ds(Ce,G,Z),Fe.length>0&&Ds(Fe,G,Z),ce.buffers.depth.setTest(!0),ce.buffers.depth.setMask(!0),ce.buffers.color.setMask(!0),ce.setPolygonOffset(!1)}function fd(S,G,Z,Q){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;const Ce=he.isWebGL2;V===null&&(V=new mn(1,1,{generateMipmaps:!0,type:fe.has("EXT_color_buffer_half_float")?On:Jn,minFilter:Ts,samples:Ce?4:0})),v.getDrawingBufferSize(ge),Ce?V.setSize(ge.x,ge.y):V.setSize(Tr(ge.x),Tr(ge.y));const Fe=v.getRenderTarget();v.setRenderTarget(V),v.getClearColor(de),F=v.getClearAlpha(),F<1&&v.setClearColor(16777215,.5),v.clear();const ke=v.toneMapping;v.toneMapping=Zn,Ds(S,Z,Q),E.updateMultisampleRenderTarget(V),E.updateRenderTargetMipmap(V);let ze=!1;for(let je=0,Xe=G.length;je<Xe;je++){const qe=G[je],_t=qe.object,$t=qe.geometry,Tt=qe.material,En=qe.group;if(Tt.side===Jt&&_t.layers.test(Q.layers)){const ht=Tt.side;Tt.side=Gt,Tt.needsUpdate=!0,Ia(_t,Z,Q,$t,Tt,En),Tt.side=ht,Tt.needsUpdate=!0,ze=!0}}ze===!0&&(E.updateMultisampleRenderTarget(V),E.updateRenderTargetMipmap(V)),v.setRenderTarget(Fe),v.setClearColor(de,F),v.toneMapping=ke}function Ds(S,G,Z){const Q=G.isScene===!0?G.overrideMaterial:null;for(let j=0,Ce=S.length;j<Ce;j++){const Fe=S[j],ke=Fe.object,ze=Fe.geometry,je=Q===null?Fe.material:Q,Xe=Fe.group;ke.layers.test(Z.layers)&&Ia(ke,G,Z,ze,je,Xe)}}function Ia(S,G,Z,Q,j,Ce){S.onBeforeRender(v,G,Z,Q,j,Ce),S.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),j.onBeforeRender(v,G,Z,Q,S,Ce),j.transparent===!0&&j.side===Jt&&j.forceSinglePass===!1?(j.side=Gt,j.needsUpdate=!0,v.renderBufferDirect(Z,G,Q,j,S,Ce),j.side=Qn,j.needsUpdate=!0,v.renderBufferDirect(Z,G,Q,j,S,Ce),j.side=Jt):v.renderBufferDirect(Z,G,Q,j,S,Ce),S.onAfterRender(v,G,Z,Q,j,Ce)}function Is(S,G,Z){G.isScene!==!0&&(G=be);const Q=Ue.get(S),j=f.state.lights,Ce=f.state.shadowsArray,Fe=j.state.version,ke=Le.getParameters(S,j.state,Ce,G,Z),ze=Le.getProgramCacheKey(ke);let je=Q.programs;Q.environment=S.isMeshStandardMaterial?G.environment:null,Q.fog=G.fog,Q.envMap=(S.isMeshStandardMaterial?Y:x).get(S.envMap||Q.environment),je===void 0&&(S.addEventListener("dispose",we),je=new Map,Q.programs=je);let Xe=je.get(ze);if(Xe!==void 0){if(Q.currentProgram===Xe&&Q.lightsStateVersion===Fe)return Fa(S,ke),Xe}else ke.uniforms=Le.getUniforms(S),S.onBuild(Z,ke,v),S.onBeforeCompile(ke,v),Xe=Le.acquireProgram(ke,ze),je.set(ze,Xe),Q.uniforms=ke.uniforms;const qe=Q.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(qe.clippingPlanes=C.uniform),Fa(S,ke),Q.needsLights=gd(S),Q.lightsStateVersion=Fe,Q.needsLights&&(qe.ambientLightColor.value=j.state.ambient,qe.lightProbe.value=j.state.probe,qe.directionalLights.value=j.state.directional,qe.directionalLightShadows.value=j.state.directionalShadow,qe.spotLights.value=j.state.spot,qe.spotLightShadows.value=j.state.spotShadow,qe.rectAreaLights.value=j.state.rectArea,qe.ltc_1.value=j.state.rectAreaLTC1,qe.ltc_2.value=j.state.rectAreaLTC2,qe.pointLights.value=j.state.point,qe.pointLightShadows.value=j.state.pointShadow,qe.hemisphereLights.value=j.state.hemi,qe.directionalShadowMap.value=j.state.directionalShadowMap,qe.directionalShadowMatrix.value=j.state.directionalShadowMatrix,qe.spotShadowMap.value=j.state.spotShadowMap,qe.spotLightMatrix.value=j.state.spotLightMatrix,qe.spotLightMap.value=j.state.spotLightMap,qe.pointShadowMap.value=j.state.pointShadowMap,qe.pointShadowMatrix.value=j.state.pointShadowMatrix),Q.currentProgram=Xe,Q.uniformsList=null,Xe}function Ua(S){if(S.uniformsList===null){const G=S.currentProgram.getUniforms();S.uniformsList=gr.seqWithValue(G.seq,S.uniforms)}return S.uniformsList}function Fa(S,G){const Z=Ue.get(S);Z.outputColorSpace=G.outputColorSpace,Z.batching=G.batching,Z.instancing=G.instancing,Z.instancingColor=G.instancingColor,Z.skinning=G.skinning,Z.morphTargets=G.morphTargets,Z.morphNormals=G.morphNormals,Z.morphColors=G.morphColors,Z.morphTargetsCount=G.morphTargetsCount,Z.numClippingPlanes=G.numClippingPlanes,Z.numIntersection=G.numClipIntersection,Z.vertexAlphas=G.vertexAlphas,Z.vertexTangents=G.vertexTangents,Z.toneMapping=G.toneMapping}function pd(S,G,Z,Q,j){G.isScene!==!0&&(G=be),E.resetTextureUnits();const Ce=G.fog,Fe=Q.isMeshStandardMaterial?G.environment:null,ke=R===null?v.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:kn,ze=(Q.isMeshStandardMaterial?Y:x).get(Q.envMap||Fe),je=Q.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Xe=!!Z.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),qe=!!Z.morphAttributes.position,_t=!!Z.morphAttributes.normal,$t=!!Z.morphAttributes.color;let Tt=Zn;Q.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Tt=v.toneMapping);const En=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,ht=En!==void 0?En.length:0,Je=Ue.get(Q),kr=f.state.lights;if(se===!0&&(xe===!0||S!==M)){const Qt=S===M&&Q.id===H;C.setState(Q,S,Qt)}let ut=!1;Q.version===Je.__version?(Je.needsLights&&Je.lightsStateVersion!==kr.state.version||Je.outputColorSpace!==ke||j.isBatchedMesh&&Je.batching===!1||!j.isBatchedMesh&&Je.batching===!0||j.isInstancedMesh&&Je.instancing===!1||!j.isInstancedMesh&&Je.instancing===!0||j.isSkinnedMesh&&Je.skinning===!1||!j.isSkinnedMesh&&Je.skinning===!0||j.isInstancedMesh&&Je.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&Je.instancingColor===!1&&j.instanceColor!==null||Je.envMap!==ze||Q.fog===!0&&Je.fog!==Ce||Je.numClippingPlanes!==void 0&&(Je.numClippingPlanes!==C.numPlanes||Je.numIntersection!==C.numIntersection)||Je.vertexAlphas!==je||Je.vertexTangents!==Xe||Je.morphTargets!==qe||Je.morphNormals!==_t||Je.morphColors!==$t||Je.toneMapping!==Tt||he.isWebGL2===!0&&Je.morphTargetsCount!==ht)&&(ut=!0):(ut=!0,Je.__version=Q.version);let ei=Je.currentProgram;ut===!0&&(ei=Is(Q,G,j));let Na=!1,us=!1,Gr=!1;const Lt=ei.getUniforms(),ti=Je.uniforms;if(ce.useProgram(ei.program)&&(Na=!0,us=!0,Gr=!0),Q.id!==H&&(H=Q.id,us=!0),Na||M!==S){Lt.setValue(O,"projectionMatrix",S.projectionMatrix),Lt.setValue(O,"viewMatrix",S.matrixWorldInverse);const Qt=Lt.map.cameraPosition;Qt!==void 0&&Qt.setValue(O,Me.setFromMatrixPosition(S.matrixWorld)),he.logarithmicDepthBuffer&&Lt.setValue(O,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&Lt.setValue(O,"isOrthographic",S.isOrthographicCamera===!0),M!==S&&(M=S,us=!0,Gr=!0)}if(j.isSkinnedMesh){Lt.setOptional(O,j,"bindMatrix"),Lt.setOptional(O,j,"bindMatrixInverse");const Qt=j.skeleton;Qt&&(he.floatVertexTextures?(Qt.boneTexture===null&&Qt.computeBoneTexture(),Lt.setValue(O,"boneTexture",Qt.boneTexture,E)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}j.isBatchedMesh&&(Lt.setOptional(O,j,"batchingTexture"),Lt.setValue(O,"batchingTexture",j._matricesTexture,E));const zr=Z.morphAttributes;if((zr.position!==void 0||zr.normal!==void 0||zr.color!==void 0&&he.isWebGL2===!0)&&ie.update(j,Z,ei),(us||Je.receiveShadow!==j.receiveShadow)&&(Je.receiveShadow=j.receiveShadow,Lt.setValue(O,"receiveShadow",j.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(ti.envMap.value=ze,ti.flipEnvMap.value=ze.isCubeTexture&&ze.isRenderTargetTexture===!1?-1:1),us&&(Lt.setValue(O,"toneMappingExposure",v.toneMappingExposure),Je.needsLights&&md(ti,Gr),Ce&&Q.fog===!0&&Ee.refreshFogUniforms(ti,Ce),Ee.refreshMaterialUniforms(ti,Q,oe,K,V),gr.upload(O,Ua(Je),ti,E)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(gr.upload(O,Ua(Je),ti,E),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&Lt.setValue(O,"center",j.center),Lt.setValue(O,"modelViewMatrix",j.modelViewMatrix),Lt.setValue(O,"normalMatrix",j.normalMatrix),Lt.setValue(O,"modelMatrix",j.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const Qt=Q.uniformsGroups;for(let Hr=0,_d=Qt.length;Hr<_d;Hr++)if(he.isWebGL2){const Oa=Qt[Hr];ae.update(Oa,ei),ae.bind(Oa,ei)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ei}function md(S,G){S.ambientLightColor.needsUpdate=G,S.lightProbe.needsUpdate=G,S.directionalLights.needsUpdate=G,S.directionalLightShadows.needsUpdate=G,S.pointLights.needsUpdate=G,S.pointLightShadows.needsUpdate=G,S.spotLights.needsUpdate=G,S.spotLightShadows.needsUpdate=G,S.rectAreaLights.needsUpdate=G,S.hemisphereLights.needsUpdate=G}function gd(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(S,G,Z){Ue.get(S.texture).__webglTexture=G,Ue.get(S.depthTexture).__webglTexture=Z;const Q=Ue.get(S);Q.__hasExternalTextures=!0,Q.__hasExternalTextures&&(Q.__autoAllocateDepthBuffer=Z===void 0,Q.__autoAllocateDepthBuffer||fe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(S,G){const Z=Ue.get(S);Z.__webglFramebuffer=G,Z.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(S,G=0,Z=0){R=S,I=G,A=Z;let Q=!0,j=null,Ce=!1,Fe=!1;if(S){const ze=Ue.get(S);ze.__useDefaultFramebuffer!==void 0?(ce.bindFramebuffer(O.FRAMEBUFFER,null),Q=!1):ze.__webglFramebuffer===void 0?E.setupRenderTarget(S):ze.__hasExternalTextures&&E.rebindTextures(S,Ue.get(S.texture).__webglTexture,Ue.get(S.depthTexture).__webglTexture);const je=S.texture;(je.isData3DTexture||je.isDataArrayTexture||je.isCompressedArrayTexture)&&(Fe=!0);const Xe=Ue.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Xe[G])?j=Xe[G][Z]:j=Xe[G],Ce=!0):he.isWebGL2&&S.samples>0&&E.useMultisampledRTT(S)===!1?j=Ue.get(S).__webglMultisampledFramebuffer:Array.isArray(Xe)?j=Xe[Z]:j=Xe,w.copy(S.viewport),z.copy(S.scissor),X=S.scissorTest}else w.copy(le).multiplyScalar(oe).floor(),z.copy(ue).multiplyScalar(oe).floor(),X=ne;if(ce.bindFramebuffer(O.FRAMEBUFFER,j)&&he.drawBuffers&&Q&&ce.drawBuffers(S,j),ce.viewport(w),ce.scissor(z),ce.setScissorTest(X),Ce){const ze=Ue.get(S.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+G,ze.__webglTexture,Z)}else if(Fe){const ze=Ue.get(S.texture),je=G||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,ze.__webglTexture,Z||0,je)}H=-1},this.readRenderTargetPixels=function(S,G,Z,Q,j,Ce,Fe){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ke=Ue.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Fe!==void 0&&(ke=ke[Fe]),ke){ce.bindFramebuffer(O.FRAMEBUFFER,ke);try{const ze=S.texture,je=ze.format,Xe=ze.type;if(je!==pn&&N.convert(je)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const qe=Xe===On&&(fe.has("EXT_color_buffer_half_float")||he.isWebGL2&&fe.has("EXT_color_buffer_float"));if(Xe!==Jn&&N.convert(Xe)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Xe===$n&&(he.isWebGL2||fe.has("OES_texture_float")||fe.has("WEBGL_color_buffer_float")))&&!qe){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=S.width-Q&&Z>=0&&Z<=S.height-j&&O.readPixels(G,Z,Q,j,N.convert(je),N.convert(Xe),Ce)}finally{const ze=R!==null?Ue.get(R).__webglFramebuffer:null;ce.bindFramebuffer(O.FRAMEBUFFER,ze)}}},this.copyFramebufferToTexture=function(S,G,Z=0){const Q=Math.pow(2,-Z),j=Math.floor(G.image.width*Q),Ce=Math.floor(G.image.height*Q);E.setTexture2D(G,0),O.copyTexSubImage2D(O.TEXTURE_2D,Z,0,0,S.x,S.y,j,Ce),ce.unbindTexture()},this.copyTextureToTexture=function(S,G,Z,Q=0){const j=G.image.width,Ce=G.image.height,Fe=N.convert(Z.format),ke=N.convert(Z.type);E.setTexture2D(Z,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,Z.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,Z.unpackAlignment),G.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Q,S.x,S.y,j,Ce,Fe,ke,G.image.data):G.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Q,S.x,S.y,G.mipmaps[0].width,G.mipmaps[0].height,Fe,G.mipmaps[0].data):O.texSubImage2D(O.TEXTURE_2D,Q,S.x,S.y,Fe,ke,G.image),Q===0&&Z.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),ce.unbindTexture()},this.copyTextureToTexture3D=function(S,G,Z,Q,j=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Ce=S.max.x-S.min.x+1,Fe=S.max.y-S.min.y+1,ke=S.max.z-S.min.z+1,ze=N.convert(Q.format),je=N.convert(Q.type);let Xe;if(Q.isData3DTexture)E.setTexture3D(Q,0),Xe=O.TEXTURE_3D;else if(Q.isDataArrayTexture||Q.isCompressedArrayTexture)E.setTexture2DArray(Q,0),Xe=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,Q.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,Q.unpackAlignment);const qe=O.getParameter(O.UNPACK_ROW_LENGTH),_t=O.getParameter(O.UNPACK_IMAGE_HEIGHT),$t=O.getParameter(O.UNPACK_SKIP_PIXELS),Tt=O.getParameter(O.UNPACK_SKIP_ROWS),En=O.getParameter(O.UNPACK_SKIP_IMAGES),ht=Z.isCompressedTexture?Z.mipmaps[j]:Z.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,ht.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ht.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,S.min.x),O.pixelStorei(O.UNPACK_SKIP_ROWS,S.min.y),O.pixelStorei(O.UNPACK_SKIP_IMAGES,S.min.z),Z.isDataTexture||Z.isData3DTexture?O.texSubImage3D(Xe,j,G.x,G.y,G.z,Ce,Fe,ke,ze,je,ht.data):Z.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),O.compressedTexSubImage3D(Xe,j,G.x,G.y,G.z,Ce,Fe,ke,ze,ht.data)):O.texSubImage3D(Xe,j,G.x,G.y,G.z,Ce,Fe,ke,ze,je,ht),O.pixelStorei(O.UNPACK_ROW_LENGTH,qe),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,_t),O.pixelStorei(O.UNPACK_SKIP_PIXELS,$t),O.pixelStorei(O.UNPACK_SKIP_ROWS,Tt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,En),j===0&&Q.generateMipmaps&&O.generateMipmap(Xe),ce.unbindTexture()},this.initTexture=function(S){S.isCubeTexture?E.setTextureCube(S,0):S.isData3DTexture?E.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?E.setTexture2DArray(S,0):E.setTexture2D(S,0),ce.unbindTexture()},this.resetState=function(){I=0,A=0,R=null,ce.reset(),y.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===fa?"display-p3":"srgb",t.unpackColorSpace=rt.workingColorSpace===Ur?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===ft?pi:dh}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===pi?ft:kn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class Lg extends Lh{}Lg.prototype.isWebGL1Renderer=!0;class xa{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Pe(e),this.near=t,this.far=n}clone(){return new xa(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Dh extends St{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class Ih extends vi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Pe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const nc=new D,ic=new D,sc=new ct,bo=new cs,nr=new Ps;class Dg extends St{constructor(e=new Rt,t=new Ih){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)nc.fromBufferAttribute(t,s-1),ic.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=nc.distanceTo(ic);e.setAttribute("lineDistance",new mt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),nr.copy(n.boundingSphere),nr.applyMatrix4(s),nr.radius+=r,e.ray.intersectsSphere(nr)===!1)return;sc.copy(s).invert(),bo.copy(e.ray).applyMatrix4(sc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new D,h=new D,d=new D,p=new D,m=this.isLineSegments?2:1,g=n.index,f=n.attributes.position;if(g!==null){const u=Math.max(0,a.start),b=Math.min(g.count,a.start+a.count);for(let v=u,T=b-1;v<T;v+=m){const I=g.getX(v),A=g.getX(v+1);if(c.fromBufferAttribute(f,I),h.fromBufferAttribute(f,A),bo.distanceSqToSegment(c,h,p,d)>l)continue;p.applyMatrix4(this.matrixWorld);const H=e.ray.origin.distanceTo(p);H<e.near||H>e.far||t.push({distance:H,point:d.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}else{const u=Math.max(0,a.start),b=Math.min(f.count,a.start+a.count);for(let v=u,T=b-1;v<T;v+=m){if(c.fromBufferAttribute(f,v),h.fromBufferAttribute(f,v+1),bo.distanceSqToSegment(c,h,p,d)>l)continue;p.applyMatrix4(this.matrixWorld);const A=e.ray.origin.distanceTo(p);A<e.near||A>e.far||t.push({distance:A,point:d.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}const rc=new D,oc=new D;class Ig extends Dg{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)rc.fromBufferAttribute(t,s),oc.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+rc.distanceTo(oc);e.setAttribute("lineDistance",new mt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ma extends vi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const ac=new ct,ea=new cs,ir=new Ps,sr=new D;class Uh extends St{constructor(e=new Rt,t=new Ma){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ir.copy(n.boundingSphere),ir.applyMatrix4(s),ir.radius+=r,e.ray.intersectsSphere(ir)===!1)return;ac.copy(s).invert(),ea.copy(e.ray).applyMatrix4(ac);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const p=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let g=p,_=m;g<_;g++){const f=c.getX(g);sr.fromBufferAttribute(d,f),lc(sr,f,l,s,e,t,this)}}else{const p=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let g=p,_=m;g<_;g++)sr.fromBufferAttribute(d,g),lc(sr,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function lc(i,e,t,n,s,r,a){const o=ea.distanceSqToPoint(i);if(o<t){const l=new D;ea.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,object:a})}}class Or extends zt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ar extends Rt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],p=[],m=[];let g=0;const _=[],f=n/2;let u=0;b(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new mt(d,3)),this.setAttribute("normal",new mt(p,3)),this.setAttribute("uv",new mt(m,2));function b(){const T=new D,I=new D;let A=0;const R=(t-e)/n;for(let H=0;H<=r;H++){const M=[],w=H/r,z=w*(t-e)+e;for(let X=0;X<=s;X++){const de=X/s,F=de*l+o,B=Math.sin(F),K=Math.cos(F);I.x=z*B,I.y=-w*n+f,I.z=z*K,d.push(I.x,I.y,I.z),T.set(B,R,K).normalize(),p.push(T.x,T.y,T.z),m.push(de,1-w),M.push(g++)}_.push(M)}for(let H=0;H<s;H++)for(let M=0;M<r;M++){const w=_[M][H],z=_[M+1][H],X=_[M+1][H+1],de=_[M][H+1];h.push(w,z,de),h.push(z,X,de),A+=6}c.addGroup(u,A,0),u+=A}function v(T){const I=g,A=new Ie,R=new D;let H=0;const M=T===!0?e:t,w=T===!0?1:-1;for(let X=1;X<=s;X++)d.push(0,f*w,0),p.push(0,w,0),m.push(.5,.5),g++;const z=g;for(let X=0;X<=s;X++){const F=X/s*l+o,B=Math.cos(F),K=Math.sin(F);R.x=M*K,R.y=f*w,R.z=M*B,d.push(R.x,R.y,R.z),p.push(0,w,0),A.x=B*.5+.5,A.y=K*.5*w+.5,m.push(A.x,A.y),g++}for(let X=0;X<s;X++){const de=I+X,F=z+X;T===!0?h.push(F,F+1,de):h.push(F+1,F,de),H+=3}c.addGroup(u,H,T===!0?1:2),u+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ar(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const rr=new D,or=new D,xo=new D,ar=new sn;class Ug extends Rt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(qi*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),p={},m=[];for(let g=0;g<l;g+=3){a?(c[0]=a.getX(g),c[1]=a.getX(g+1),c[2]=a.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:f,c:u}=ar;if(_.fromBufferAttribute(o,c[0]),f.fromBufferAttribute(o,c[1]),u.fromBufferAttribute(o,c[2]),ar.getNormal(xo),d[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,d[1]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,d[2]=`${Math.round(u.x*s)},${Math.round(u.y*s)},${Math.round(u.z*s)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let b=0;b<3;b++){const v=(b+1)%3,T=d[b],I=d[v],A=ar[h[b]],R=ar[h[v]],H=`${T}_${I}`,M=`${I}_${T}`;M in p&&p[M]?(xo.dot(p[M].normal)<=r&&(m.push(A.x,A.y,A.z),m.push(R.x,R.y,R.z)),p[M]=null):H in p||(p[H]={index0:c[b],index1:c[v],normal:xo.clone()})}}for(const g in p)if(p[g]){const{index0:_,index1:f}=p[g];rr.fromBufferAttribute(o,_),or.fromBufferAttribute(o,f),m.push(rr.x,rr.y,rr.z),m.push(or.x,or.y,or.z)}this.setAttribute("position",new mt(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class ya extends Rt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let d=e;const p=(t-e)/s,m=new D,g=new Ie;for(let _=0;_<=s;_++){for(let f=0;f<=n;f++){const u=r+f/n*a;m.x=d*Math.cos(u),m.y=d*Math.sin(u),l.push(m.x,m.y,m.z),c.push(0,0,1),g.x=(m.x/t+1)/2,g.y=(m.y/t+1)/2,h.push(g.x,g.y)}d+=p}for(let _=0;_<s;_++){const f=_*(n+1);for(let u=0;u<n;u++){const b=u+f,v=b,T=b+n+1,I=b+n+2,A=b+1;o.push(v,T,A),o.push(T,I,A)}}this.setIndex(o),this.setAttribute("position",new mt(l,3)),this.setAttribute("normal",new mt(c,3)),this.setAttribute("uv",new mt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ya(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Fg extends yt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Mt extends vi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Pe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=uh,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ng extends Mt{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ie(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ct(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Pe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Pe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Pe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}const cc={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Og{constructor(e,t,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,p=c.length;d<p;d+=2){const m=c[d],g=c[d+1];if(m.global&&(m.lastIndex=0),m.test(h))return g}return null}}}const Bg=new Og;class Sa{constructor(e){this.manager=e!==void 0?e:Bg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Sa.DEFAULT_MATERIAL_NAME="__DEFAULT";class kg extends Sa{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=cc.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;const o=Rs("img");function l(){h(),cc.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(d){h(),s&&s(d),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}}class Gg extends Sa{constructor(e){super(e)}load(e,t,n,s){const r=new zt,a=new kg(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class Ea extends St{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class zg extends Ea{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Pe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Mo=new ct,hc=new D,dc=new D;class Fh{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ie(512,512),this.map=null,this.mapPass=null,this.matrix=new ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _a,this._frameExtents=new Ie(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;hc.setFromMatrixPosition(e.matrixWorld),t.position.copy(hc),dc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(dc),t.updateMatrixWorld(),Mo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Mo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Mo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const uc=new ct,_s=new D,yo=new D;class Hg extends Fh{constructor(){super(new Xt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ie(4,2),this._viewportCount=6,this._viewports=[new lt(2,1,1,1),new lt(0,1,1,1),new lt(3,1,1,1),new lt(1,1,1,1),new lt(3,0,1,1),new lt(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),_s.setFromMatrixPosition(e.matrixWorld),n.position.copy(_s),yo.copy(n.position),yo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(yo),n.updateMatrixWorld(),s.makeTranslation(-_s.x,-_s.y,-_s.z),uc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(uc)}}class Vg extends Ea{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Hg}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Wg extends Fh{constructor(){super(new va(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Nh extends Ea{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.target=new St,this.shadow=new Wg}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Xg{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=fc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=fc();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function fc(){return(typeof performance>"u"?Date:performance).now()}class Yg{constructor(e,t,n=0,s=1/0){this.ray=new cs(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new ga,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return ta(e,this,n,t),n.sort(pc),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)ta(e[s],this,n,t);return n.sort(pc),n}}function pc(i,e){return i.distance-e.distance}function ta(i,e,t,n){if(i.layers.test(e.layers)&&i.raycast(e,t),n===!0){const s=i.children;for(let r=0,a=s.length;r<a;r++)ta(s[r],e,t,!0)}}class mc{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Ct(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ha}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ha);const Oh={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class ds{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const $g=new va(-1,1,1,-1,0,1);class qg extends Rt{constructor(){super(),this.setAttribute("position",new mt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new mt([0,2,0,0,2,0],2))}}const Kg=new qg;class wa{constructor(e){this._mesh=new Ve(Kg,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,$g)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class jg extends ds{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof yt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Cs.clone(e.uniforms),this.material=new yt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new wa(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class gc extends ds{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Zg extends ds{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Bh{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Ie);this._width=n.width,this._height=n.height,t=new mn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:On}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new jg(Oh),this.copyPass.material.blending=Nn,this.clock=new Xg}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}gc!==void 0&&(a instanceof gc?n=!0:a instanceof Zg&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ie);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class kh extends ds{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Pe}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor)),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const Jg={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Pe(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class is extends ds{constructor(e,t,n,s){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new Ie(e.x,e.y):new Ie(256,256),this.clearColor=new Pe(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new mn(r,a,{type:On}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const p=new mn(r,a,{type:On});p.texture.name="UnrealBloomPass.h"+d,p.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(p);const m=new mn(r,a,{type:On});m.texture.name="UnrealBloomPass.v"+d,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),r=Math.round(r/2),a=Math.round(a/2)}const o=Jg;this.highPassUniforms=Cs.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new yt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ie(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Oh;this.copyUniforms=Cs.clone(h.uniforms),this.blendMaterial=new yt({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:Mn,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Pe,this.oldClearAlpha=1,this.basic=new Ls,this.fsQuad=new wa(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Ie(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=is.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=is.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new yt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ie(.5,.5)},direction:{value:new Ie(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new yt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}is.BlurDirectionX=new Ie(1,0);is.BlurDirectionY=new Ie(0,1);const Qg={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = OptimizedCineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Gh extends ds{constructor(){super();const e=Qg;this.uniforms=Cs.clone(e.uniforms),this.material=new Fg({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new wa(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},rt.getTransfer(this._outputColorSpace)===ot&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Qc?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===eh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===th?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===da?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===nh&&(this.material.defines.AGX_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class e_ extends Dh{constructor(e=null){super();const t=new Pt;t.deleteAttribute("uv");const n=new Mt({side:Gt}),s=new Mt;let r=5;e!==null&&e._useLegacyLights===!1&&(r=900);const a=new Vg(16777215,r,28,2);a.position.set(.418,16.199,.3),this.add(a);const o=new Ve(t,n);o.position.set(-.757,13.219,.717),o.scale.set(31.713,28.305,28.591),this.add(o);const l=new Ve(t,s);l.position.set(-10.906,2.009,1.846),l.rotation.set(0,-.195,0),l.scale.set(2.328,7.905,4.651),this.add(l);const c=new Ve(t,s);c.position.set(-5.607,-.754,-.758),c.rotation.set(0,.994,0),c.scale.set(1.97,1.534,3.955),this.add(c);const h=new Ve(t,s);h.position.set(6.167,.857,7.803),h.rotation.set(0,.561,0),h.scale.set(3.927,6.285,3.687),this.add(h);const d=new Ve(t,s);d.position.set(-2.017,.018,6.124),d.rotation.set(0,.333,0),d.scale.set(2.002,4.566,2.064),this.add(d);const p=new Ve(t,s);p.position.set(2.291,-.756,-2.621),p.rotation.set(0,-.286,0),p.scale.set(1.546,1.552,1.496),this.add(p);const m=new Ve(t,s);m.position.set(-2.193,-.369,-5.547),m.rotation.set(0,.516,0),m.scale.set(3.875,3.487,2.986),this.add(m);const g=new Ve(t,Oi(50));g.position.set(-16.116,14.37,8.208),g.scale.set(.1,2.428,2.739),this.add(g);const _=new Ve(t,Oi(50));_.position.set(-16.109,18.021,-8.207),_.scale.set(.1,2.425,2.751),this.add(_);const f=new Ve(t,Oi(17));f.position.set(14.904,12.198,-1.832),f.scale.set(.15,4.265,6.331),this.add(f);const u=new Ve(t,Oi(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const b=new Ve(t,Oi(20));b.position.set(3.235,11.486,-12.541),b.scale.set(2.5,2,.1),this.add(b);const v=new Ve(t,Oi(100));v.position.set(0,20,0),v.scale.set(1,.1,1),this.add(v)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Oi(i){const e=new Ls;return e.color.setScalar(i),e}function Rr(i=1){let e=i>>>0||1;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}const ss=(i,e=0,t=1)=>Math.min(t,Math.max(e,i)),na=i=>(i=ss(i),i*i*(3-2*i)),t_=i=>(i=ss(i),i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2),Ye=(i,e,t)=>ss((i-e)/(t-e)),nt=(i,e,t,n=.04)=>na((i-e+n)/n)*(1-na((i-t)/n)),gn={off:"#1b1f2a",reset:"#3a3f52",wfs:"#6a2d43",real:"#ffb547",prot:"#4fe08a",long:"#58a6ff",park:"#7d7fb8",os:"#f2f4ff"},_c={off:"unpowered",reset:"in reset",wfs:"wait-for-SIPI",real:"16-bit real mode",prot:"32-bit protected mode",long:"64-bit long mode",park:"parked by firmware",os:"running the OS"},L={fetch:"#ffcf6b",car:"#ff6bd5",dram:"#7cf2ff",train:"#ff8a3d",pcie:"#a78bff",power:"#ff4d4d",mgmt:"#5ef0b0",ipi:"#ffffff",gpu:"#6bffb0"};function ia(i){if(i<=0)return"0";const e=[[1e-9,"ns"],[1e-6,"µs"],[.001,"ms"],[1,"s"]];let t=e[0];for(const r of e)i>=r[0]&&(t=r);const n=i/t[0],s=n>=100?0:n>=10?1:2;return`${n.toFixed(s)} ${t[1]}`}function vc(i,e,t){i=(i%360+360)%360/360,e/=100,t/=100;const n=a=>(a+i*12)%12,s=e*Math.min(t,1-t),r=a=>t-s*Math.max(-1,Math.min(n(a)-3,Math.min(9-n(a),1)));return[r(0)*255,r(8)*255,r(4)*255]}const Ut={sram:[34,50,94],sramLine:[58,82,150],sramHi:[86,113,192],sramGutter:[26,31,61],phy:[61,47,24],phyLine:[160,122,52],phyDark:[90,69,32],phyHi:[226,180,92],gpu:[20,48,44],gpuCell:[31,74,66],ring:[141,134,214],ringBg:[33,28,64],moat:[5,3,14],seal:[138,122,74]};class n_{constructor(e,t){this.W=e,this.H=t,this.d=new Uint8ClampedArray(e*t*4);for(let n=3;n<this.d.length;n+=4)this.d[n]=255}rect(e,t,n,s,r,a=1){const o=Math.max(0,Math.round(e)),l=Math.max(0,Math.round(t)),c=Math.min(this.W,Math.round(e+n)),h=Math.min(this.H,Math.round(t+s));if(c<=o||h<=l)return;const d=this.d,p=r[0],m=r[1],g=r[2];if(a>=1)for(let _=l;_<h;_++){let f=(_*this.W+o)*4;for(let u=o;u<c;u++,f+=4)d[f]=p,d[f+1]=m,d[f+2]=g}else{const _=1-a;for(let f=l;f<h;f++){let u=(f*this.W+o)*4;for(let b=o;b<c;b++,u+=4)d[u]=d[u]*_+p*a,d[u+1]=d[u+1]*_+m*a,d[u+2]=d[u+2]*_+g*a}}}stroke(e,t,n,s,r,a=1,o=1){this.rect(e,t,n,a,r,o),this.rect(e,t+s-a,n,a,r,o),this.rect(e,t,a,s,r,o),this.rect(e+n-a,t,a,s,r,o)}mottle(e,t,n,s,r,a=.25,o=60,l=null){const c=Math.max(2,Math.ceil(n/o)+2),h=Math.max(2,Math.ceil(s/o)+2),d=new Float32Array(c*h);for(let b=0;b<d.length;b++)d[b]=r();const p=l?new Float32Array(c*h).map(()=>r()):null,m=Math.max(0,Math.round(e)),g=Math.max(0,Math.round(t)),_=Math.min(this.W,Math.round(e+n)),f=Math.min(this.H,Math.round(t+s)),u=this.d;for(let b=g;b<f;b++){const v=(b-t)/o,T=Math.floor(v),I=v-T,A=I*I*(3-2*I);for(let R=m;R<_;R++){const H=(R-e)/o,M=Math.floor(H),w=H-M,z=w*w*(3-2*w),X=T*c+M,F=1+((d[X]*(1-z)+d[X+1]*z)*(1-A)+(d[X+c]*(1-z)+d[X+c+1]*z)*A-.5)*2*a,B=(b*this.W+R)*4;if(p){const oe=((p[X]*(1-z)+p[X+1]*z)*(1-A)+(p[X+c]*(1-z)+p[X+c+1]*z)*A-.5)*l;u[B]=u[B]*F*(1+oe),u[B+1]=u[B+1]*F,u[B+2]=u[B+2]*F*(1-oe)}else u[B]*=F,u[B+1]*=F,u[B+2]*=F}}}}function Ot(i,e,t,n,s,r,a,o={}){const[l,c,h]=a,d=o.rowH||Math.max(2,Math.min(n,s)/70),p=[];for(let g=0;g<12;g++)p.push(vc(l+(r()-.5)*22,c,Math.max(4,h+(r()-.5)*12)));i.rect(e,t,n,s,vc(l,c,Math.max(3,h-7)));for(let g=t;g<t+s;g+=d){let _=e;for(;_<e+n;){const f=d*(.7+r()*4.5);i.rect(_,g,Math.min(f,e+n-_)-.6,d-.7,p[r()*p.length|0]),_+=f}}i.mottle(e,t,n,s,r,o.mottle??.28,Math.max(20,Math.min(n,s)/3),.25);const m=o.macros??Math.round(n*s/26e3);for(let g=0;g<m;g++){const _=n*(.08+r()*.16),f=s*(.06+r()*.14);Br(i,e+r()*(n-_),t+r()*(s-f),_,f,r,{cols:1+(r()*2|0),rows:1,tone:.8})}}function Br(i,e,t,n,s,r,a={}){const o=a.cols||Math.max(1,Math.round(n/60)),l=a.rows||Math.max(1,Math.round(s/60)),c=a.tone??1;i.rect(e,t,n,s,Ut.sramGutter);const h=Math.max(1,n*.035),d=Math.max(1,s*.035),p=(n-h*(o+1))/o,m=(s-d*(l+1))/l,g=Math.max(2,Math.min(p,m)/22),_=Ut.sram.map(u=>u*c),f=Ut.sramLine.map(u=>u*c);for(let u=0;u<o;u++)for(let b=0;b<l;b++){const v=e+h+u*(p+h),T=t+d+b*(m+d);if(i.rect(v,T,p,m,_),a.vertical)for(let I=v;I<v+p;I+=g)i.rect(I,T,g*.5,m,f);else for(let I=T;I<T+m;I+=g)i.rect(v,I,p,g*.5,f);a.vertical?i.rect(v,T+m/2-g,p,g*1.2,Ut.sramHi,.35*c):i.rect(v+p/2-g,T,g*1.2,m,Ut.sramHi,.35*c)}i.mottle(e,t,n,s,r,.12,Math.max(30,Math.min(n,s)/2))}function i_(i,e,t,n,s,r,a={}){const o=a.vertical??s>n,l=o?s:n,c=o?n:s,h=a.lanes||Math.max(4,Math.round(l/Math.max(10,c*.55)));i.rect(e,t,n,s,Ut.phy);const d=l/h,p=(m,g,_,f,u,b)=>o?i.rect(e+g,t+m,f,_,u,b):i.rect(e+m,t+g,_,f,u,b);for(let m=0;m<h;m++){const g=m*d;p(g+d*.08,c*.06,d*.84,c*.18,Ut.phyLine),p(g+d*.12,c*.3,d*.76,c*.34,Ut.phyDark),p(g+d*.3,c*.36,d*.4,c*.2,Ut.phyHi),p(g+d*.1,c*.72,d*.8,c*.2,[255,220,150],.18),p(g,0,Math.max(1,d*.04),c,[0,0,0],.35)}i.mottle(e,t,n,s,r,.12,40)}function s_(i,e,t,n,s,r,a={}){i.rect(e,t,n,s,Ut.gpu);const o=a.cols||8,l=a.rows||4,c=Math.min(n,s)*.04,h=(n-c*2)/o,d=(s-c*2)/l;for(let p=0;p<o;p++)for(let m=0;m<l;m++){const g=e+c+p*h,_=t+c+m*d;i.rect(g+h*.06,_+d*.06,h*.88,d*.88,Ut.gpuCell),Br(i,g+h*.12,_+d*.12,h*.36,d*.76,r,{cols:1,rows:2,tone:.8}),Ot(i,g+h*.52,_+d*.12,h*.36,d*.76,r,[168,40,22],{macros:0,mottle:.15})}}function r_(i,e,t,n,s){i.rect(e,t,n,s,Ut.ringBg);const r=s>n,a=6;for(let o=0;o<a;o++)r?i.rect(e+n*(o+.5)/a-.6,t,1.2,s,Ut.ring):i.rect(e,t+s*(o+.5)/a-.6,n,1.2,Ut.ring)}function bc(i,e,t,n,s,r,a,o){for(const l of r){let c=l.x,h=l.y;o!=null&&o.x&&(c=1-l.x-l.w),o!=null&&o.y&&(h=1-l.y-l.h);const d=e+c*n,p=t+h*s,m=l.w*n,g=l.h*s,_=`${l.kind||""} ${l.id||""}`.toLowerCase();if(/\bl2\b|l1|cache|sram|\brf\b|tlb|btb|uop/.test(_)){const f=m/Math.max(1,g);Br(i,d,p,m,g,a,{cols:Math.max(1,Math.round(f*2)),rows:Math.max(1,Math.round(2/Math.max(.5,f))),tone:/l2/.test(_)?1:.85,vertical:g>m*1.5})}else/fp|vec|simd|avx/.test(_)?Ot(i,d,p,m,g,a,[208,36,24]):/int|alu|exec/.test(_)?Ot(i,d,p,m,g,a,[282,32,25]):/fe|front|decode|fetch/.test(_)?Ot(i,d,p,m,g,a,[236,30,26]):/mem|load|store|lsu/.test(_)?Ot(i,d,p,m,g,a,[200,26,22]):/core/.test(_)?Ot(i,d,p,m,g,a,[190,34,23]):Ot(i,d,p,m,g,a,[272,34,26]);i.stroke(d,p,m,g,[0,0,0],1,.45)}}function o_(i,e,t){var g,_;const n=new n_(e,t),s=Rr(3358);Ot(n,0,0,e,t,s,[250,22,14],{macros:0,rowH:3});const r=f=>[f.x*e,f.y*t,f.w*e,f.h*t],a=["other","misc_io","system_agent","pmu","ring","llc_slice","imc","ddr_phy","pcie_ctrl","pcie_phy","dmi","display","display_phy","media","igpu","thunderbolt","ecore_cluster","pcore"],o=[...i.blocks].sort((f,u)=>a.indexOf(f.kind)-a.indexOf(u.kind)),l=(g=i.core_internals)==null?void 0:g.pcore,c=(_=i.core_internals)==null?void 0:_.ecore_cluster,h=Math.max(2,e/1100);for(const f of o){const[u,b,v,T]=r(f);switch(f.kind){case"pcore":l!=null&&l.length?bc(n,u,b,v,T,l,s,f.mirror):Ot(n,u,b,v,T,s,[272,34,26]);break;case"ecore_cluster":c!=null&&c.length?bc(n,u,b,v,T,c,s,f.mirror):Ot(n,u,b,v,T,s,[196,40,22]);break;case"llc_slice":Br(n,u,b,v,T,s,{cols:f.w*e>f.h*t?4:2,rows:f.w*e>f.h*t?2:4});break;case"ring":r_(n,u,b,v,T);break;case"ddr_phy":case"pcie_phy":case"display_phy":case"dmi":case"thunderbolt":i_(n,u,b,v,T,s,{lanes:f.lanes});break;case"igpu":s_(n,u,b,v,T,s,{cols:f.cols||(v>T?8:4),rows:f.rows||(v>T?4:8)});break;case"media":Ot(n,u,b,v,T,s,[176,34,20]);break;case"imc":Ot(n,u,b,v,T,s,[30,34,20]);break;case"pcie_ctrl":Ot(n,u,b,v,T,s,[262,40,24]);break;case"display":Ot(n,u,b,v,T,s,[150,26,20]);break;default:Ot(n,u,b,v,T,s,[240,26,20])}n.stroke(u,b,v,T,Ut.moat,h,.85)}const d=Math.max(3,e/700);n.stroke(e*.002,t*.004,e*.996,t*.992,Ut.seal,d),n.stroke(e*.006,t*.012,e*.988,t*.976,[200,180,120],1,.35);const p=document.createElement("canvas");return p.width=e,p.height=t,p.getContext("2d").putImageData(new ImageData(n.d,e,t),0,0),p}const _r=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,a_=`
uniform vec3 uColor;
uniform float uLevel;
uniform float uTime;
uniform float uStyle;
uniform vec2 uSize;
uniform float uSeed;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
void main() {
  if (uLevel < 0.002) discard;
  vec2 d = min(vUv, 1.0 - vUv) * uSize;
  float edge = min(d.x, d.y);
  float rim = exp(-edge * 9.0);
  float a;
  if (uStyle < 0.5) {
    // steady glow
    a = 0.32 + rim * 0.9;
  } else if (uStyle < 1.5) {
    // scan: bands sweeping through (instruction streaming / enumeration)
    float s = fract(vUv.x * 3.0 - uTime * 1.2);
    a = 0.18 + rim * 0.8 + smoothstep(0.0, 0.08, s) * smoothstep(0.35, 0.08, s) * 0.9;
  } else if (uStyle < 2.5) {
    // pinned: diagonal hatching — cache lines locked in place as RAM
    float s = step(0.55, fract((vUv.x * uSize.x - vUv.y * uSize.y) * 1.6 + uTime * 0.25));
    a = 0.2 + 0.45 * s + rim * 0.9;
  } else if (uStyle < 3.5) {
    // sparkle: lots of independent little bursts (heavy compute / training)
    vec2 cell = floor(vUv * uSize * 3.0);
    float n = hash(cell + floor(uTime * 14.0));
    a = 0.16 + rim * 0.7 + step(0.86, n) * 1.1;
  } else if (uStyle < 4.5) {
    // breathe: slow pulse (waiting / parked / powered but idle)
    a = (0.25 + 0.2 * sin(uTime * 2.4 + uSeed)) + rim * 0.6;
  } else {
    // stripe: one way of a 12-way cache pinned — a thin hatched band
    float band = smoothstep(0.455, 0.47, vUv.y) * smoothstep(0.545, 0.53, vUv.y);
    float hatch = step(0.5, fract((vUv.x * uSize.x - vUv.y * uSize.y) * 3.0 + uTime * 0.3));
    a = 0.05 + rim * 0.35 + band * (0.9 + 0.5 * hatch);
  }
  gl_FragColor = vec4(uColor * a * uLevel, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,xc=`
uniform vec3 uColor;
uniform float uLevel;
uniform float uTime;
varying vec2 vUv;
void main() {
  float dash = smoothstep(0.0, 0.15, fract(vUv.x * 0.9 - uTime * 2.2)) * smoothstep(0.6, 0.3, fract(vUv.x * 0.9 - uTime * 2.2));
  float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
  float a = (0.18 + dash * 0.9) * across * uLevel;
  gl_FragColor = vec4(uColor * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,l_=`
uniform vec3 uColor;
uniform float uLevel;
uniform float uTime;
uniform float uBreath;
uniform float uSeed;
varying vec2 vUv;
void main() {
  float r = length(vUv - 0.5) * 2.0;
  float core = smoothstep(0.42, 0.3, r);
  float ring = smoothstep(0.5, 0.44, r) * smoothstep(0.38, 0.44, r) * 0.6;
  float halo = smoothstep(1.0, 0.2, r) * 0.28;
  float b = mix(1.0, 0.45 + 0.4 * sin(uTime * 2.2 + uSeed), uBreath);
  gl_FragColor = vec4(uColor * (core + ring + halo) * uLevel * b, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;function zh(i,e,t){return new yt({uniforms:{uColor:{value:new Pe("#ffffff")},uLevel:{value:0},uTime:{value:0},uStyle:{value:0},uSize:{value:new Ie(i,e)},uSeed:{value:t}},vertexShader:_r,fragmentShader:a_,transparent:!0,blending:Mn,depthWrite:!1})}const Hh={glow:0,scan:1,pinned:2,sparkle:3,breathe:4,stripe:5},ji=1,Mc=Object.fromEntries(Object.entries(gn).map(([i,e])=>[i,new Pe(e)]));function c_(i,e={}){var _e,pe,ve,Le,Ee,Re,Ne;const{maxTexture:t=4096,anisotropy:n=8}=e,s=i.die_mm.w,r=i.die_mm.h,a=new yn;a.name="die";const o=Math.min(t,4096),l=Math.round(o*r/s),c=o_(i,o,l),h=new Or(c);h.colorSpace=ft,h.anisotropy=n;const d=new Ng({map:h,roughness:.32,metalness:.35,iridescence:.55,iridescenceIOR:1.7,iridescenceThicknessRange:[180,520],clearcoat:.25,clearcoatRoughness:.4,emissive:new Pe("#ffffff"),emissiveMap:h,emissiveIntensity:.06}),p={value:0};d.onBeforeCompile=C=>{C.uniforms.uGrade=p;const P=`
uniform float uGrade;
vec3 dieGrade(vec3 lin) {
  vec3 s = pow(max(lin, vec3(0.0)), vec3(1.0 / 2.2));
  float l = dot(s, vec3(0.299, 0.587, 0.114));
  vec3 c0 = vec3(0.020, 0.024, 0.059);
  vec3 c1 = vec3(0.200, 0.150, 0.370);
  vec3 c2 = vec3(0.700, 0.600, 0.430);
  vec3 duo = l < 0.588 ? mix(c0, c1, l / 0.588) : mix(c1, c2, (l - 0.588) / 0.412);
  return mix(lin * 0.32, pow(duo, vec3(2.2)) * 0.5, uGrade);
}`;C.fragmentShader=C.fragmentShader.replace("void main() {",P+`
void main() {`).replace("#include <map_fragment>",`#include <map_fragment>
diffuseColor.rgb = dieGrade(diffuseColor.rgb);`).replace("#include <emissivemap_fragment>",`#ifdef USE_EMISSIVEMAP
totalEmissiveRadiance *= dieGrade(texture2D(emissiveMap, vEmissiveMapUv).rgb);
#endif`)};const m=new Mt({color:"#2a2a33",roughness:.6,metalness:.4}),g=.78,_=new Ve(new Pt(s,g,r),[m,m,d,m,m,m]);_.position.y=-g/2,a.add(_);const f=new Map,u=(C,P,J=0)=>new D((C-.5)*s,J,(P-.5)*r);let b=1;const v=(C,P,J,ie,$,q,N=null)=>{const y=$*s,ae=q*r,Ae=zh(y,ae,b++*1.37),Te=new Ve(new ns(y,ae),Ae);Te.rotation.x=-Math.PI/2;const me=u(J+$/2,ie+q/2,.012+(N?.004:0));Te.position.copy(me),Te.renderOrder=N?3:2,Te.layers.set(ji),a.add(Te);const U={id:C,kind:P,parent:N,rect:{x:J,y:ie,w:$,h:q},center:me.clone().setY(0),size:[y,ae],mesh:Te,mat:Ae,level:0,target:0,color:new Pe("#ffffff"),targetColor:new Pe("#ffffff"),style:0};return f.set(C,U),U};v("die","whole",0,0,1,1).label=i.chip;for(const C of i.blocks){const P=v(C.id,C.kind,C.x,C.y,C.w,C.h);P.label=C.label,P.data=C}const T=(C,P)=>{var J,ie;if(P)for(const $ of P){let q=$.x,N=$.y;(J=C.mirror)!=null&&J.x&&(q=1-$.x-$.w),(ie=C.mirror)!=null&&ie.y&&(N=1-$.y-$.h);const y=v(`${C.id}.${$.id}`,$.kind||$.id,C.x+q*C.w,C.y+N*C.h,$.w*C.w,$.h*C.h,C.id);y.label=$.label}};for(const C of i.blocks)C.kind==="pcore"&&T(C,(_e=i.core_internals)==null?void 0:_e.pcore),C.kind==="ecore_cluster"&&T(C,(pe=i.core_internals)==null?void 0:pe.ecore_cluster);const I=(((ve=i.ring)==null?void 0:ve.path)||[]).map(([C,P])=>u(C,P,.03));let A=null;if(I.length>1){const C=i.ring.closed!==!1,P=C?[...I,I[0]]:I,J=lr(P,i.ring.width_mm||.22),ie=new yt({uniforms:{uColor:{value:new Pe("#bfb6ff")},uLevel:{value:0},uTime:{value:0}},vertexShader:_r,fragmentShader:xc,transparent:!0,blending:Mn,depthWrite:!1,side:Jt}),$=new Ve(J,ie);$.renderOrder=4,a.add($),A={mesh:$,mat:ie,pts:P,closed:C,level:0,target:0}}const R=new Map;for(const C of((Le=i.ring)==null?void 0:Le.stops)||[])R.set(C.id,{...C,p:u(C.x,C.y,.05)});const H=[];if(A){let C=0;H.push(0);for(let P=1;P<A.pts.length;P++)C+=A.pts[P].distanceTo(A.pts[P-1]),H.push(C)}const M=C=>{let P=null;for(let J=1;J<A.pts.length;J++){const ie=A.pts[J-1],$=A.pts[J],q=new D().subVectors($,ie),N=q.lengthSq()||1,y=Math.min(1,Math.max(0,new D().subVectors(C,ie).dot(q)/N)),ae=ie.clone().addScaledVector(q,y),Ae=ae.distanceTo(C);(!P||Ae<P.d)&&(P={d:Ae,seg:J,dist:H[J-1]+y*Math.sqrt(N),point:ae})}return P},w=.06,z=-.74,X=new Map,de=(C,P)=>{let J=X.get(C);return J||X.set(C,J={id:C,p:P,adj:new Map}),J},F=(C,P)=>{const J=X.get(C),ie=X.get(P);if(!J||!ie||C===P)return;const $=J.p.distanceTo(ie.p);J.adj.set(P,$),ie.adj.set(C,$)};if(A){const C=H[H.length-1],P=[];for(let J=0;J<A.pts.length-(A.closed?1:0);J++)P.push({id:`ring:${J}`,d:H[J],p:A.pts[J].clone().setY(w)});for(const J of R.values()){const ie=M(J.p);P.push({id:`stop:${J.id}`,d:ie.dist%C,p:ie.point.clone().setY(w)})}P.sort((J,ie)=>J.d-ie.d);for(const J of P)de(J.id,J.p);for(let J=1;J<P.length;J++)F(P[J-1].id,P[J].id);A.closed&&F(P[P.length-1].id,P[0].id)}const B=i.wiring||{},K=C=>/^(stop|ring):/.test(C)?C:`w:${C}`;for(const[C,[P,J]]of Object.entries(B.nodes||{}))de(`w:${C}`,u(P,J,w));for(const[C,P]of B.edges||[])F(K(C),K(P));const oe=new Map;for(const[C,P]of Object.entries(B.ports||{}))oe.set(C,K(P));for(const C of R.values())for(const P of C.serves||[]){const J=f.get(P);if(!J||oe.has(P))continue;const ie=`port:${P}`;de(ie,new D(X.get(`stop:${C.id}`).p.x,w,J.center.z)),F(ie,`stop:${C.id}`),oe.set(P,ie)}const re=e.package||{x:s/2+6,z:r/2+6},te=new Map;for(const[C,P]of Object.entries(B.exits||{})){const J=X.get(K(P.node));if(!J)continue;const ie=J.p.clone(),$=P.edge==="left"?ie.clone().setX(-s/2):P.edge==="right"?ie.clone().setX(s/2):P.edge==="top"?ie.clone().setZ(-r/2):ie.clone().setZ(r/2),q=P.edge==="left"?$.clone().setX(-re.x):P.edge==="right"?$.clone().setX(re.x):P.edge==="top"?$.clone().setZ(-re.z):$.clone().setZ(re.z),N=[$,$.clone().setY(z),q.setY(z)];te.set(C,{name:C,node:K(P.node),via:P.via,out:N,label:P.label,bus:P.bus,level:0,target:0,color:new Pe})}const le=(C,P)=>{const J=new Map([[C,0]]),ie=new Map,$=new Set([C]);for(;$.size;){let N=null;for(const y of $)(N===null||J.get(y)<J.get(N))&&(N=y);if($.delete(N),N===P)break;for(const[y,ae]of X.get(N).adj){const Ae=J.get(N)+ae;Ae<(J.get(y)??1/0)&&(J.set(y,Ae),ie.set(y,N),$.add(y))}}if(!J.has(P))return null;const q=[P];for(;q[0]!==C;)q.unshift(ie.get(q[0]));return q.map(N=>X.get(N).p.clone())},ue=C=>{const P=te.get(C);if(P)return{node:P.node,ext:P.out,exit:C};const J=C.split(".")[0],ie=f.get(J),$=oe.get(J);return!ie||!$?null:{node:$,ext:$.startsWith("port:")?[ie.center.clone().setY(w)]:[],block:ie}},ne=new Map,k=(C,P)=>{const J=`${C}>${P}`;if(ne.has(J))return ne.get(J);const ie=ue(C),$=ue(P);let q=null;if(ie&&$){const y=le(ie.node,$.node);y&&(q=[...[...ie.ext].reverse(),...y,...$.ext])}if(!q){const y=f.get(C.split(".")[0]),ae=f.get(P.split(".")[0]);if(!y||!ae)return null;q=[y.center.clone().setY(w),ae.center.clone().setY(w)]}q=q.filter((y,ae)=>ae===0||y.distanceToSquared(q[ae-1])>1e-8);const N={pts:q,exits:[ie==null?void 0:ie.exit,$==null?void 0:$.exit].filter(Boolean)};return ne.set(J,N),N},se=C=>new yt({uniforms:{uColor:{value:new Pe(C)},uLevel:{value:0},uTime:{value:0}},vertexShader:_r,fragmentShader:xc,transparent:!0,blending:Mn,depthWrite:!1,side:Jt}),xe=new Map,V=(C,P,J)=>{let ie=xe.get(C);ie||xe.set(C,ie=lr(P.filter(y=>y.y>0),.16));const $=se(J),q=new Ve(ie,$);q.renderOrder=4,q.layers.set(ji),a.add(q);const N={mesh:q,mat:$,level:0,target:0};return x.set(C,N),N},ee=(C,P,J)=>{const ie=new yt({uniforms:{uColor:{value:new Pe},uLevel:{value:0},uTime:{value:0},uBreath:{value:0},uSeed:{value:b++*.7}},vertexShader:_r,fragmentShader:l_,transparent:!0,blending:Mn,depthWrite:!1}),$=new Ve(new ns(J*2.6,J*2.6),ie);return $.rotation.x=-Math.PI/2,$.position.set(C,.05,P),$.renderOrder=5,$.layers.set(ji),a.add($),{mesh:$,mat:ie,color:new Pe(gn.off),level:0}},ge=i.blocks.filter(C=>C.kind==="pcore").sort((C,P)=>Bi(C.id)-Bi(P.id)),Me=i.blocks.filter(C=>C.kind==="ecore_cluster").sort((C,P)=>Bi(C.id)-Bi(P.id)),be=[];for(const C of ge){const P=u(C.x+C.w/2,C.y+C.h/2),J=Math.min(C.w*s,C.h*r);for(let ie=0;ie<2;ie++){const $=ee(P.x+(ie-.5)*J*.34,P.z,J*.12);be.push({led:$,block:C.id,label:`P${Bi(C.id)} T${ie}`,kind:"p"})}}const De=(((Ee=i.core_internals)==null?void 0:Ee.ecore_cluster)||[]).filter(C=>/core/i.test(C.kind||C.id)&&!/l2/i.test(C.id));for(const C of Me)for(let P=0;P<4;P++){let J,ie;const $=De[P];if($){let y=$.x,ae=$.y;(Re=C.mirror)!=null&&Re.x&&(y=1-$.x-$.w),(Ne=C.mirror)!=null&&Ne.y&&(ae=1-$.y-$.h);const Ae=u(C.x+(y+$.w/2)*C.w,C.y+(ae+$.h/2)*C.h);J=Ae.x,ie=Ae.z}else{const y=u(C.x+(P%2+.5)*(C.w/2),C.y+(Math.floor(P/2)+.5)*(C.h/2));J=y.x,ie=y.z}const q=Math.min(C.w*s,C.h*r)*.09,N=ee(J,ie,q);be.push({led:N,block:C.id,label:`E${Bi(C.id)*4+P}`,kind:"e"})}const O=600,We=new Rt,fe=new Float32Array(O*3),he=new Float32Array(O*3);We.setAttribute("position",new Ht(fe,3)),We.setAttribute("color",new Ht(he,3));const ce=new Ma({size:.55,map:Wh(),vertexColors:!0,transparent:!0,blending:Mn,depthWrite:!1,sizeAttenuation:!0}),$e=new Uh(We,ce);$e.frustumCulled=!1,$e.renderOrder=6,a.add($e);const Ue=[],E=new Map,x=new Map;for(const C of te.values())C.mat=se("#ffffff"),C.mesh=new Ve(lr(C.out.slice(1),.5),C.mat),C.mesh.renderOrder=4,C.mesh.visible=!1,a.add(C.mesh);const Y={group:a,W:s,H:r,setPhoto(C){C.colorSpace=ft,C.anisotropy=n;const P=d.map;d.map=C,d.emissiveMap=C,P&&P!==C&&P.dispose(),d.emissiveIntensity=.05,d.roughness=.5,d.metalness=.2,d.clearcoat=.12,d.iridescence=.3,p.value=1,d.needsUpdate=!0},setTrueColor(C){p.value=C?0:1},blocks:f,lps:be,stops:R,route:k,points:$e,toLocal:u,begin(){for(const C of f.values())C.target=0;A&&(A.target=0);for(const C of E.values())C.live=!1;for(const C of x.values())C.target=0;for(const C of te.values())C.target=0},light(C,P,J,ie="glow"){for(const $ of Y.select(C))P>=$.target&&($.target=P,$.targetColor.set(J),$.style=Hh[ie]??0)},select(C){if(f.has(C))return[f.get(C)];if(C.startsWith("kind:")){const P=C.slice(5);return[...f.values()].filter(J=>J.kind===P&&!J.parent)}if(C.startsWith("sub:")){const[,P,J]=C.split(":"),ie=J.split("|");return[...f.values()].filter($=>$.parent&&(P==="*"||$.parent===P)&&ie.includes($.id.slice($.id.indexOf(".")+1)))}return[]},ringLevel(C,P){A&&C>A.target&&(A.target=C,A.mat.uniforms.uColor.value.set(P))},stream(C,P,J,ie,$,q=6){if(!(ie>0))return null;let N=E.get(C);if(!N){const y=k(P,J);if(!y)return;N={pts:y.pts,rk:`${P}>${J}`,exits:y.exits,acc:0,rate:ie,color:new Pe($),speed:q,live:!0,len:sa(y.pts),fresh:!0,wire:null},E.set(C,N)}N.wire||(N.wire=x.get(N.rk)||V(N.rk,N.pts,$)),N.rate=ie,N.color.set($),N.speed=q,N.live=!0;{N.wire.target=Math.max(N.wire.target,Math.min(1,.35+ie*.08)),N.wire.mat.uniforms.uColor.value.copy(N.color);for(const y of N.exits){const ae=te.get(y);ae.target=1,ae.color.copy(N.color)}}return N},setExitOut(C,P){const J=te.get(C);J&&(J.out=[J.out[0],J.out[1],...P.map(ie=>ie.clone().setY(z))],J.mesh.geometry.dispose(),J.mesh.geometry=lr(J.out.slice(1),.5),ne.clear())},liveExits(){return[...te.values()].filter(C=>C.level>.2)},exits:te,setLp(C,P,J=1){const ie=be[C];ie&&(ie.mode=P,ie.targetColor=gn[P]||gn.off,ie.targetLevel=P==="off"?0:J)},update(C,P,J=C){const ie=1-Math.exp(-C*7);for(const q of f.values()){q.level+=(q.target-q.level)*ie,q.color.lerp(q.targetColor,ie);const N=q.mat.uniforms;N.uLevel.value=q.level,N.uColor.value.copy(q.color),N.uTime.value=P,N.uStyle.value=q.style,q.mesh.visible=q.level>.003}A&&(A.level+=(A.target-A.level)*ie,A.mat.uniforms.uLevel.value=A.level,A.mat.uniforms.uTime.value=P,A.mesh.visible=A.level>.003);for(const[q,N]of x)if(N.level+=((N.target||0)-N.level)*ie,N.mat.uniforms.uLevel.value=N.level*.55,N.mat.uniforms.uTime.value=P,N.mesh.visible=N.level>.01,N.level<.002&&!N.target){a.remove(N.mesh),N.mat.dispose(),x.delete(q);for(const y of E.values())y.wire===N&&(y.wire=null)}for(const q of te.values())q.level+=(q.target-q.level)*ie,q.mat.uniforms.uLevel.value=q.level*.8,q.mat.uniforms.uColor.value.copy(q.color),q.mat.uniforms.uTime.value=P,q.mesh.visible=q.level>.01;for(const q of be){const N=q.led;N.color.lerp(Mc[q.mode]||Mc.off,ie),N.level+=((q.targetLevel??0)-N.level)*ie;const y=N.mat.uniforms;y.uColor.value.copy(N.color),y.uLevel.value=N.level*1.5,y.uTime.value=P,y.uBreath.value=q.mode==="wfs"||q.mode==="park"?1:0,N.mesh.visible=N.level>.01}for(const[q,N]of E){if(!N.live){E.delete(q);continue}if(N.fresh&&J===0){const y=Math.min(O-Ue.length,Math.round(N.rate*N.len/N.speed));for(let ae=0;ae<y;ae++)Ue.push({key:q,pts:N.pts,len:N.len,d:(ae+.5)/y*N.len,speed:N.speed,color:N.color.clone()})}for(N.fresh=!1,N.acc+=J*N.rate;N.acc>=1&&Ue.length<O;)N.acc-=1,Ue.push({key:q,pts:N.pts,len:N.len,d:0,speed:N.speed*(.85+Math.random()*.3),color:N.color.clone()})}let $=0;for(let q=Ue.length-1;q>=0;q--){const N=Ue[q];if(N.d+=N.speed*J,N.d>=N.len||J===0&&!E.has(N.key)){Ue.splice(q,1);continue}}for(const q of Ue){const N=Vh(q.pts,q.d);fe[$*3]=N.x,fe[$*3+1]=N.y,fe[$*3+2]=N.z;const y=Math.min(1,q.d/.4,(q.len-q.d)/.4);he[$*3]=q.color.r*y,he[$*3+1]=q.color.g*y,he[$*3+2]=q.color.b*y,$++}We.setDrawRange(0,$),We.attributes.position.needsUpdate=!0,We.attributes.color.needsUpdate=!0},blockAt(C,P){const J=C/s+.5,ie=P/r+.5;let $=null;for(const q of f.values()){const N=q.rect;q.kind!=="whole"&&J>=N.x&&J<=N.x+N.w&&ie>=N.y&&ie<=N.y+N.h&&(!$||q.parent&&!$.parent||N.w*N.h<$.rect.w*$.rect.h)&&($=q)}return $}};return Y}function lr(i,e){const t=[],n=[],s=[];let r=0;for(let o=0;o<i.length;o++){const l=i[Math.max(0,o-1)],c=i[Math.min(i.length-1,o+1)],h=new D().subVectors(c,l).setY(0).normalize(),d=new D(-h.z,0,h.x).multiplyScalar(e/2);if(o>0&&(r+=i[o].distanceTo(i[o-1])),t.push(i[o].x+d.x,i[o].y,i[o].z+d.z,i[o].x-d.x,i[o].y,i[o].z-d.z),n.push(r,0,r,1),o>0){const p=o*2;s.push(p-2,p-1,p,p-1,p+1,p)}}const a=new Rt;return a.setAttribute("position",new mt(t,3)),a.setAttribute("uv",new mt(n,2)),a.setIndex(s),a}function Bi(i){const e=/(\d+)$/.exec(i);return e?Number(e[1]):0}function sa(i){let e=0;for(let t=1;t<i.length;t++)e+=i[t].distanceTo(i[t-1]);return e}const yc=new D;function Vh(i,e){for(let t=1;t<i.length;t++){const n=i[t].distanceTo(i[t-1]);if(e<=n)return yc.copy(i[t-1]).lerp(i[t],n?e/n:0);e-=n}return yc.copy(i[i.length-1])}let cr=null;function Wh(){if(cr)return cr;const i=document.createElement("canvas");i.width=i.height=64;const e=i.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);return t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.25,"rgba(255,255,255,0.8)"),t.addColorStop(.6,"rgba(255,255,255,0.15)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),cr=new Or(i),cr}function h_(i,e=!1){const t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Rt;let c=0;for(let h=0;h<i.length;++h){const d=i[h];let p=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in d.attributes){if(!n.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(d.attributes[m]),p++}if(p!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in d.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[m]===void 0&&(a[m]=[]),a[m].push(d.morphAttributes[m])}if(e){let m;if(t)m=d.index.count;else if(d.attributes.position!==void 0)m=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,m,h),c+=m}}if(t){let h=0;const d=[];for(let p=0;p<i.length;++p){const m=i[p].index;for(let g=0;g<m.count;++g)d.push(m.getX(g)+h);h+=i[p].attributes.position.count}l.setIndex(d)}for(const h in r){const d=Sc(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(const h in a){const d=a[h][0].length;if(d===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let p=0;p<d;++p){const m=[];for(let _=0;_<a[h].length;++_)m.push(a[h][_][p]);const g=Sc(m);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Sc(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.array.length}const a=new e(r);let o=0;for(let c=0;c<i.length;++c)a.set(i[c].array,o),o+=i[c].array.length;const l=new Ht(a,t,n);return s!==void 0&&(l.gpuType=s),l}const qn={w:305,h:244},di={x:120,y:72},rn={w:37.5,h:45,z:1.15},Wt=(i,e,t=0)=>new D(i-qn.w/2,t,e-qn.h/2),vr=[190,200,210,220],d_=[1,3],ki=12,ys=133.35,hi=31.25,hr={pwrbtn:{lanes:1,pts:[[278,235],[268,235],[262,221]]},siopch:{lanes:2,pts:[[256,208],[253,199]]},pson:{lanes:1,pts:[[264,208],[280,186],[280,152],[289,150]]},pwrok:{lanes:1,pts:[[289,146],[276,146],[276,184],[261,206]]},perst:{lanes:1,pts:[[228,196],[176,196],[140,170],[118,154]]},perst2:{lanes:1,pts:[[176,196],[150,150],[120,120]]},standby:{lanes:2,pts:[[290,120],[272,120],[272,178],[253,184]]},atx:{lanes:3,pts:[[290,132],[262,132],[262,108],[246,96],[168,96],[150,88]]},eps:{lanes:3,pts:[[44,18],[62,26],[82,30]]},vrm:{lanes:4,pts:[[124,36],[124,50]]},vrm2:{lanes:4,pts:[[80,72],[96,72]]},dmi:{lanes:4,pts:[[124,95],[160,113],[160,165],[174,178],[226,186]]},sideband:{lanes:1,pts:[[139,90],[167,108],[167,160],[180,172],[226,180]]},spi:{lanes:1,pts:[[232,203],[232,214],[214,228],[210,232]]},smbus:{lanes:1,pts:[[247,177],[247,160],[222,156],[200,156]]},ddrA:{lanes:6,pts:[[139,79],[170,92],[196,92]]},ddrB:{lanes:6,pts:[[139,72],[168,52],[216,52]]},pcie16:{lanes:4,pts:[[110,95],[110,128],[108,145]]},pcie4:{lanes:2,pts:[[101,74],[88,74],[88,96],[113,98],[115,103]]},cmos:{lanes:1,pts:[[172,205],[204,205],[228,196]]}},u_={pcie16:{at:[110,di.y+rn.h/2],dir:[0,1]},pcie4:{at:[di.x-rn.w/2,73.6],dir:[-1,0]}};function f_({anisotropy:i=8}={}){const e=new yn;e.name="board";const t=Rr(723581),n=new Map,s={pcb:null,black:new Mt({color:"#16161b",roughness:.55,metalness:.1}),plastic:new Mt({color:"#202028",roughness:.7,metalness:.05}),metal:new Mt({color:"#8d9099",roughness:.38,metalness:.9}),darkMetal:new Mt({color:"#5a5e68",roughness:.4,metalness:.85}),gold:new Mt({color:"#d6a640",roughness:.3,metalness:1}),chip:new Mt({color:"#111114",roughness:.42,metalness:.2}),dimmPcb:new Mt({color:"#0f3a2a",roughness:.55,metalness:.15}),substrate:new Mt({color:"#0a1916",roughness:.6,metalness:.15}),choke:new Mt({color:"#4b4d55",roughness:.45,metalness:.6}),white:new Mt({color:"#7d7a72",roughness:.7})},r=__(t);r.anisotropy=i,s.pcb=new Mt({map:r,roughness:.62,metalness:.18});const a=new Ve(new Pt(qn.w,1.6,qn.h),[s.black,s.black,s.pcb,s.black,s.black,s.black]);a.position.y=-.8,e.add(a);const o=(V,ee,ge,Me,be,De,O,We=e)=>{const fe=new Ve(new Pt(V,ee,ge),Me);return fe.position.copy(Wt(be,De,O+ee/2)),We.add(fe),fe},l=(V,ee,ge,Me,be,De,O)=>{const We=zh(Me,be,n.size*3.1+1),fe=new Ve(new ns(Me,be),We);fe.rotation.x=-Math.PI/2,fe.position.copy(Wt(ee,ge,De+.05)),fe.renderOrder=2,fe.visible=!1,e.add(fe);const he={id:V,mesh:fe,mat:We,level:0,target:0,color:new Pe,targetColor:new Pe,style:0,anchor:Wt(ee,ge,De+1),label:O};return n.set(V,he),he},c=di,h=new yn;e.add(h),o(52,1.4,4,s.darkMetal,c.x,c.y-30,0,h),o(52,1.4,4,s.darkMetal,c.x,c.y+30,0,h),o(4,1.4,56,s.darkMetal,c.x-24,c.y,0,h),o(4,1.4,56,s.darkMetal,c.x+24,c.y,0,h);const d=new Ve(new Ar(.9,.9,62,10),s.darkMetal);d.rotation.x=Math.PI/2,d.position.copy(Wt(c.x+29,c.y,1.2)),e.add(d),o(44,2.6,52,s.plastic,c.x,c.y,0);const p=2.6;o(rn.w,rn.z,rn.h,s.substrate,c.x,c.y,p);for(let V=0;V<26;V++){const ee=V%4,ge=(Math.floor(V/4)+.5)/7,Me=ee<2?c.x-12+ge*24:ee===2?c.x-16:c.x+16,be=ee<2?ee===0?c.y-19.5:c.y+19.5:c.y-15+ge*30;o(.5,.5,1,s.darkMetal,Me,be,p+rn.z)}const m=p+rn.z+.78,g=new yn,_=new Mt({map:v_(),roughness:.36,metalness:.9,color:"#c8cad0",transparent:!0}),f=s.metal.clone();f.transparent=!0;const u=new Ve(new Pt(29,1.9,40),[f,f,_,f,f,f]);u.position.y=.95,g.add(u);for(const V of[-1,1]){const ee=new Ve(new Pt(18,.8,3),f);ee.position.set(0,.4,V*21.3),g.add(ee)}g.position.copy(Wt(c.x,c.y,p+rn.z+.4)),e.add(g);for(let V=0;V<10;V++)o(8,6,8,s.choke,84+V*9,30,0),o(5,1,4,s.chip,84+V*9,39,0);for(let V=0;V<6;V++)o(8,6,8,s.choke,72,48+V*9.5,0),o(4,1,5,s.chip,80,48+V*9.5,0);l("vrm",120,34,100,18,6.2,"CPU voltage regulator"),l("vrm2",74,72,14,60,6.2,null),o(20,9,9,s.white,40,14,0),l("eps",40,14,20,9,9.2,"EPS 12 V (CPU power)"),o(10,10,52,s.white,294,126,0);for(let V=0;V<12;V++)for(let ee=0;ee<2;ee++)o(3,.6,3,s.black,292+ee*4,106+V*4,10);l("atx24",294,126,10,52,10.4,"ATX 24-pin (5 V standby lives here)");const b=[];vr.forEach((V,ee)=>{if(o(6,8,142,s.plastic,V,ki+68,0),o(6.4,9,4,s.white,V,ki-3,0),o(6.4,9,4,s.white,V,ki+139,0),!d_.includes(ee))return;const ge=p_(s);ge.group.position.copy(Wt(V,ki+68,5)),e.add(ge.group),b.push({...ge,x:V,ch:ee<2?"A":"B"})}),l("dimmA",vr[1],ki+68,4,ys,5+hi+.4,"DDR5 DIMM, channel A"),l("dimmB",vr[3],ki+68,4,ys,5+hi+.4,"DDR5 DIMM, channel B"),o(25,1.3,24,s.substrate,240,190,0),o(13,.7,11,s.darkMetal,240,190,1.3),l("pch",240,190,25,24,2.1,"PCH (chipset) — CSME + PMC + SPI controller"),o(5.3,1.75,5.3,s.chip,210,233,.1);for(let V=0;V<4;V++)o(1.4,.3,.45,s.metal,206.8,231.1+V*1.27,0),o(1.4,.3,.45,s.metal,213.2,231.1+V*1.27,0);l("spi",210,233,8,7,2,"SPI NOR flash — the BIOS chip");const v=new Ve(new Ar(10,10,3.2,40),s.darkMetal);v.position.copy(Wt(165,205,1.6)),e.add(v),l("cmos",165,205,18,18,3.4,"CR2032 — keeps the RTC well alive");for(let V=0;V<5;V++)for(let ee=0;ee<2;ee++)o(.64,6,.64,s.gold,276+V*2.54,234+ee*2.54,0);l("fpanel",281,235.3,14,6,6.2,"Front-panel header (power button)"),o(80,.8,22,s.dimmPcb,72,113,1.5),o(6,4,22,s.plastic,115,113,0),o(12,1.2,12,s.chip,96,113,2.3),o(16,1.2,14,s.chip,74,113,2.3),o(16,1.2,14,s.chip,54,113,2.3),l("nvme",72,113,80,22,3.6,"NVMe SSD (PCIe 4.0 x4 from the CPU)"),o(89,11,7.5,s.plastic,75,150,0);const T=new yn,I=new Mt({color:"#8a90a8",roughness:.5,metalness:.4,transparent:!0,opacity:.04,depthWrite:!1}),A=new Pt(200,112,40),R=new Ve(A,I);T.add(R);const H=new Ig(new Ug(A),new Ih({color:"#9aa3c7",transparent:!0,opacity:.12}));T.add(H);for(const V of[-60,0,60]){const ee=new Ve(new ya(24,25,48),new Ls({color:"#9aa3c7",transparent:!0,opacity:.1,side:Jt}));ee.position.set(V,0,20.1),T.add(ee)}const M=Wt(125,172,11);T.position.copy(M),T.visible=!1,e.add(T);const w=new ls().setFromCenterAndSize(Wt(125,172,67),new D(200,112,40)),z={rise:0,occ:1},X={cam:new D,target:new D,set:!1},de=new cs,F=new D,B={body:I,edges:H.material,rings:T.children.filter(V=>V.isMesh&&V!==R).map(V=>V.material)};l("gpu",75,150,89,7.5,11.4,"Discrete GPU (PCIe 5.0-capable x16 slot)"),o(18,30,130,s.darkMetal,12,88,0),o(9,1,9,s.chip,30,196,0),o(10,1.2,10,s.chip,261,213,0),l("sio",261,213,12,12,1.5,"Super I/O (power button, PS_ON#, PWR_OK)");const K=new Map;for(const[V,ee]of Object.entries(hr)){const ge=ee.pts.map(([De,O])=>Wt(De,O,.06)),Me=[];for(let De=0;De<ee.lanes;De++){const O=(De-(ee.lanes-1)/2)*1.3;Me.push(Ec(ge,O))}const be=g_(Me);e.add(be),K.set(V,{name:V,pts:ge,lanes:Me,mesh:be,level:0,target:0,len:sa(ge)})}const oe=900,re=new Rt,te=new Float32Array(oe*3),le=new Float32Array(oe*3);re.setAttribute("position",new Ht(te,3)),re.setAttribute("color",new Ht(le,3));const ue=new Uh(re,new Ma({size:3.2,map:Wh(),vertexColors:!0,transparent:!0,blending:Mn,depthWrite:!1}));ue.frustumCulled=!1,ue.renderOrder=6,e.add(ue);const ne=[],k=new Map,se=[];return b.forEach((V,ee)=>{for(const ge of V.chips)ge.dimm=ee,se.push(ge)}),b_(e,new Set(Object.values(s).filter(V=>V!==s.pcb)),g),{group:e,comps:n,paths:K,dimms:b,ihs:g,dieTop:m,socketWorld:Wt(c.x,c.y,m),W:Wt,points:ue,land(V){const ee=u_[V];return ee?{at:Wt(ee.at[0],ee.at[1],0),dir:new D(ee.dir[0],0,ee.dir[1])}:null},startAt(V,ee,ge){const Me=K.get(V);if(!Me)return;const be=ee.clone().setY(.06),De=be.clone().addScaledVector(ge,12),O=[be,De,...hr[V].pts.slice(1).map(([fe,he])=>Wt(fe,he,.06))],We=[];for(let fe=0;fe<hr[V].lanes;fe++)We.push(Ec(O,(fe-(hr[V].lanes-1)/2)*1.3));Me.mesh.geometry.dispose(),Me.mesh.geometry=Xh(We),Object.assign(Me,{pts:O,lanes:We,len:sa(O)})},setView(V,ee){X.cam.copy(V),X.target.copy(ee),X.set=!0},begin(){for(const V of n.values())V.target=0;for(const V of K.values())V.target=0;for(const V of k.values())V.live=!1;for(const V of se)V.target=0;for(const V of b)for(const ee of Object.values(V.parts))ee.target=0},light(V,ee,ge,Me="glow"){const be=n.get(V);be&&ee>=be.target&&(be.target=ee,be.targetColor.set(ge),be.style=Hh[Me]??0)},bus(V,ee,ge,{rate:Me=0,speed:be=60,dir:De=1}={}){const O=K.get(V);if(O&&(ee>=O.target&&(O.target=ee,O.mesh.material.uniforms.uColor.value.set(ge)),Me>0&&ee>.02)){const We=`${V}:${De}`;let fe=k.get(We);fe||(fe={lanes:De>0?O.lanes:O.lanes.map(he=>[...he].reverse()),len:O.len,acc:0,color:new Pe,fresh:!0},k.set(We,fe)),fe.rate=fe.live?Math.max(fe.rate,Me):Me,fe.speed=be,fe.color.set(ge),fe.live=!0}},dimmPart(V,ee,ge){for(const Me of b){const be=Me.parts[V];be&&ee>be.target&&(be.target=ee,be.color.set(ge))}},chips(V,ee){for(const ge of se){const Me=V(ge.dimm,ge.rank,ge.sub,ge.i);Me>ge.target&&(ge.target=Me,ge.color.set(ee))}},update(V,ee,ge=V){const Me=1-Math.exp(-V*7);for(const he of n.values()){he.level+=(he.target-he.level)*Me,he.color.lerp(he.targetColor,Me);const ce=he.mat.uniforms;ce.uLevel.value=he.level,ce.uColor.value.copy(he.color),ce.uTime.value=ee,ce.uStyle.value=he.style,he.mesh.visible=he.level>.003}const be=n.get("gpu").level;z.rise+=((be>.2?1:0)-z.rise)*Math.min(1,V*3);let De=!1;X.set&&(de.origin.copy(X.cam),de.direction.subVectors(X.target,X.cam).normalize(),De=!!de.intersectBox(w,F)&&F.distanceTo(X.cam)<X.cam.distanceTo(X.target)),z.occ+=((De?.1:1)-z.occ)*Math.min(1,V*4);const O=z.rise;T.visible=O>.01,T.scale.y=Math.max(.01,O),T.position.y=M.y+56*T.scale.y;const We=z.occ*Math.min(1,O*1.5);B.body.opacity=(.015+be*.05)*We,B.edges.opacity=(.05+be*.35)*We;for(const he of B.rings)he.opacity=(.04+be*.25)*We;for(const he of K.values()){he.level+=(he.target-he.level)*Me;const ce=he.mesh.material.uniforms;ce.uLevel.value=.18+he.level,ce.uTime.value=ee}for(const he of se)he.level+=(he.target-he.level)*Math.min(1,V*14),he.mat.emissive.copy(he.color).multiplyScalar(he.level*.9);for(const he of b)for(const ce of Object.values(he.parts))ce.level+=(ce.target-ce.level)*Math.min(1,V*10),ce.mat.emissive.copy(ce.color).multiplyScalar(ce.level*1.4);for(const[he,ce]of k){if(!ce.live){k.delete(he);continue}if(ce.fresh&&ge===0){const $e=Math.min(oe-ne.length,Math.round(ce.rate*ce.len/ce.speed));for(let Ue=0;Ue<$e;Ue++)ne.push({key:he,pts:ce.lanes[Ue%ce.lanes.length],len:ce.len,d:(Ue+.5)/$e*ce.len,speed:ce.speed,color:ce.color.clone()})}for(ce.fresh=!1,ce.acc+=ge*ce.rate;ce.acc>=1&&ne.length<oe;){ce.acc-=1;const $e=ce.lanes[Math.floor(Math.random()*ce.lanes.length)];ne.push({key:he,pts:$e,len:ce.len,d:0,speed:ce.speed*(.85+Math.random()*.3),color:ce.color.clone()})}}let fe=0;for(let he=ne.length-1;he>=0;he--){const ce=ne[he];ce.d+=ce.speed*ge,(ce.d>=ce.len||ge===0&&!k.has(ce.key))&&ne.splice(he,1)}for(const he of ne){const ce=Vh(he.pts,he.d);te[fe*3]=ce.x,te[fe*3+1]=ce.y+.4,te[fe*3+2]=ce.z;const $e=Math.min(1,he.d/4,(he.len-he.d)/4);le[fe*3]=he.color.r*$e,le[fe*3+1]=he.color.g*$e,le[fe*3+2]=he.color.b*$e,fe++}re.setDrawRange(0,fe),re.attributes.position.needsUpdate=!0,re.attributes.color.needsUpdate=!0}}}function p_(i,e){const t=new yn,n=new Ve(new Pt(1.2,hi,ys),i.dimmPcb);n.position.y=hi/2,t.add(n);const s=new Ve(new Pt(1.26,3,ys-6),i.gold);s.position.y=1.5,t.add(s);const r=[];for(const h of[-1,1])for(let d=0;d<8;d++){const p=d<4?0:1,m=(d<4?-ys/2+10+d*13.5:14+(d-4)*13.5)+2,g=new Mt({color:"#141418",roughness:.45,metalness:.2,emissive:new Pe("#000")}),_=new Ve(new Pt(1.1,9.5,11),g);_.position.set(h*1.15,hi*.55,m),t.add(_),r.push({mesh:_,mat:g,rank:h>0?0:1,sub:p,i:d%4,level:0,target:0,color:new Pe})}const a=()=>new Mt({color:"#141418",roughness:.45,metalness:.2,emissive:new Pe("#000")}),o=new Ve(new Pt(1,5,5),a());o.position.set(1.1,hi*.62,6),t.add(o);const l=new Ve(new Pt(.9,2.2,2.2),a());l.position.set(1.05,hi*.3,6),t.add(l);const c=h=>({mesh:h,mat:h.material,level:0,target:0,color:new Pe});return{group:t,chips:r,parts:{pmic:c(o),spd:c(l)}}}function Ec(i,e){if(!e)return i.map(n=>n.clone());const t=[];for(let n=0;n<i.length;n++){const s=i[Math.max(0,n-1)],r=i[Math.min(i.length-1,n+1)],a=new D().subVectors(r,s).setY(0).normalize(),o=new D(-a.z,0,a.x);t.push(i[n].clone().addScaledVector(o,e))}return t}const m_=`
uniform vec3 uColor;
uniform float uLevel;
uniform float uTime;
varying vec2 vUv;
void main() {
  float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
  float dash = smoothstep(0.0, 0.2, fract(vUv.x * 0.08 - uTime * 1.6)) * smoothstep(0.7, 0.35, fract(vUv.x * 0.08 - uTime * 1.6));
  float hot = clamp(uLevel - 0.18, 0.0, 1.0);
  vec3 copper = vec3(0.42, 0.30, 0.16);
  vec3 col = mix(copper * 0.55, uColor * (0.5 + dash * 1.2), hot);
  gl_FragColor = vec4(col * smoothstep(0.0, 0.5, across) * (0.6 + hot), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;function g_(i){const e=new yt({uniforms:{uColor:{value:new Pe("#ffffff")},uLevel:{value:.18},uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:m_,transparent:!0,blending:Mn,depthWrite:!1,side:Jt}),t=new Ve(Xh(i),e);return t.renderOrder=1,t}function Xh(i){const e=[],t=[],n=[];let s=0;const r=.55;for(const o of i){let l=0;for(let c=0;c<o.length;c++){const h=o[Math.max(0,c-1)],d=o[Math.min(o.length-1,c+1)],p=new D().subVectors(d,h).setY(0).normalize(),m=new D(-p.z,0,p.x).multiplyScalar(r/2);if(c>0&&(l+=o[c].distanceTo(o[c-1])),e.push(o[c].x+m.x,o[c].y,o[c].z+m.z,o[c].x-m.x,o[c].y,o[c].z-m.z),t.push(l,0,l,1),c>0){const g=s+c*2;n.push(g-2,g-1,g,g-1,g+1,g)}}s+=o.length*2}const a=new Rt;return a.setAttribute("position",new mt(e,3)),a.setAttribute("uv",new mt(t,2)),a.setIndex(n),a}function __(i){const t=document.createElement("canvas");t.width=qn.w*6,t.height=qn.h*6;const n=t.getContext("2d");n.fillStyle="#0c0f14",n.fillRect(0,0,t.width,t.height),n.globalAlpha=.5;for(let o=0;o<520;o++){let l=i()*qn.w,c=i()*qn.h;n.strokeStyle=i()<.5?"#14202a":"#18161f",n.lineWidth=(.2+i()*.35)*6,n.beginPath(),n.moveTo(l*6,c*6);for(let h=0;h<4;h++)i()<.5?l+=(i()-.5)*60:c+=(i()-.5)*60,n.lineTo(l*6,c*6);n.stroke()}n.globalAlpha=1,n.fillStyle="#1d2530";for(let o=0;o<1400;o++)n.beginPath(),n.arc(i()*t.width,i()*t.height,.35*6,0,Math.PI*2),n.fill();for(const[o,l]of[[6.35,10.16],[6.35,165.1],[163.83,10.16],[163.83,165.1],[288.29,10.16],[288.29,165.1],[288.29,237.49],[163.83,237.49],[6.35,237.49]])n.fillStyle="#7a6a3a",n.beginPath(),n.arc(o*6,l*6,4*6,0,Math.PI*2),n.fill(),n.fillStyle="#05060a",n.beginPath(),n.arc(o*6,l*6,1.8*6,0,Math.PI*2),n.fill();n.strokeStyle="rgba(220,226,240,0.55)",n.fillStyle="rgba(220,226,240,0.6)",n.lineWidth=.35*6;const s=(o,l,c,h)=>n.strokeRect((o-c/2)*6,(l-h/2)*6,c*6,h*6),r=(o,l,c,h=3,d="center",p=0)=>{n.save(),n.translate(l*6,c*6),n.rotate(p),n.font=`600 ${h*6}px ui-monospace, Menlo, Consolas, monospace`,n.textAlign=d,n.textBaseline="middle",n.fillText(o,0,0),n.restore()};s(di.x,di.y,54,66),r("LGA1700",di.x-26,di.y+36,2.6,"left"),s(240,190,29,28),r("PCH",240,206.5,2.6),s(210,233,10,9),r("BIOS",210,240.5,2.4),r("CMOS",165,218,2.4),vr.forEach((o,l)=>r(["DDR5_A1","DDR5_A2","DDR5_B1","DDR5_B2"][l],o,160,1.9,"center",-Math.PI/2)),r("PCIE_X16",75,158.5,2.4),r("M2_1",72,128.5,2.4),r("F_PANEL",281,241.5,2.2),r("ATX_PWR",283,126,2.2,"center",-Math.PI/2),r("CPU_PWR",40,22,2.2),r("PWR_SW",278,230,1.8),r("SIO",261,221,2);const a=new Or(t);return a.colorSpace=ft,a}function v_(){const i=document.createElement("canvas");i.width=800,i.height=580;const e=i.getContext("2d"),t=e.createLinearGradient(0,0,800,580);t.addColorStop(0,"#cfd2d8"),t.addColorStop(.5,"#b4b8c0"),t.addColorStop(1,"#d6d8dd"),e.fillStyle=t,e.fillRect(0,0,800,580),e.globalAlpha=.08;for(let s=0;s<900;s++)e.fillStyle=Math.random()<.5?"#fff":"#666",e.fillRect(0,Math.random()*580,800,1);e.globalAlpha=1,e.fillStyle="rgba(70,74,82,0.85)",e.font="600 46px ui-monospace, Menlo, Consolas, monospace",e.fillText("x86-64  8P+16E",90,200),e.font="500 38px ui-monospace, Menlo, Consolas, monospace",e.fillText("RAPTOR LAKE-S",90,270),e.fillText("LGA1700   DDR5",90,330),e.font="500 30px ui-monospace, Menlo, Consolas, monospace",e.fillText("reset vector: FFFFFFF0h",90,420);const n=new Or(i);return n.colorSpace=ft,n.center.set(.5,.5),n.rotation=Math.PI/2,n}function b_(i,e,t){i.updateMatrixWorld(!0);const n=new ct().copy(i.matrixWorld).invert(),s=new Map;i.traverse(r=>{if(!(!r.isMesh||!e.has(r.material))){for(let a=r.parent;a&&a!==i;a=a.parent)if(a===t)return;s.has(r.material)||s.set(r.material,[]),s.get(r.material).push(r)}});for(const[r,a]of s){if(a.length<2)continue;const o=a.map(c=>{const h=c.geometry.index?c.geometry.toNonIndexed():c.geometry.clone();for(const d of Object.keys(h.attributes))["position","normal","uv"].includes(d)||h.deleteAttribute(d);return h.clearGroups(),h.applyMatrix4(new ct().multiplyMatrices(n,c.matrixWorld))}),l=h_(o);for(const c of o)c.dispose();if(l){for(const c of a)c.parent.remove(c),c.geometry.dispose();i.add(new Ve(l,r))}}}const Yh={chip:"Intel Core i9-13900K - Raptor Lake-S 8P+16E die (B0 stepping; same die in i9-14900K / i7-13700K-class parts), Intel 7, UHD Graphics 770 (32 EU)",die_mm:{w:23.413,h:10.791},blocks:[{id:"ddrphy",kind:"ddr_phy",label:"DDR5/DDR4 memory PHY (2 channels, 128-bit + ECC bits)",x:.0063,y:.0074,w:.551,h:.039,confidence:"high"},{id:"imc0",kind:"imc",label:"Memory controller, left half (mirror pair - probably one DDR channel each)",x:.0969,y:.065,w:.0518,h:.2698,confidence:"medium"},{id:"imc1",kind:"imc",label:"Memory controller, right half (mirror pair - probably one DDR channel each)",x:.1487,y:.065,w:.0521,h:.2698,confidence:"medium"},{id:"sa",kind:"system_agent",label:"System Agent (uncore: IO fabric, coherency, power/clock control)",x:.1086,y:.3394,w:.0919,h:.1103,confidence:"medium"},{id:"dmi",kind:"dmi",label:"DMI 4.0 x8 PHY (link to the Z690/Z790 PCH)",x:.0057,y:.0673,w:.0469,h:.1516,confidence:"high"},{id:"pcie5",kind:"pcie_phy",label:"PCIe 5.0 x16 PHY (x16 or 2x8)",x:.0057,y:.2511,w:.0521,h:.3654,confidence:"high"},{id:"pcie4",kind:"pcie_phy",label:"PCIe 4.0 x4 PHY (CPU-attached M.2)",x:.0057,y:.6176,w:.0469,h:.09,confidence:"high"},{id:"pcie_ctrl",kind:"pcie_ctrl",label:"PCIe 5.0/4.0 + DMI controllers (digital logic)",x:.0578,y:.065,w:.0281,h:.5911,confidence:"medium"},{id:"ring_stop_sa",kind:"ring",label:"Ring stop at the System-Agent end (SA <-> ring interface)",x:.1615,y:.4581,w:.039,h:.1256,confidence:"medium"},{id:"uncore_misc",kind:"other",label:"Uncore logic, unidentified (GNA 3.0 probably here)",x:.0859,y:.4525,w:.0756,h:.2443,confidence:"low"},{id:"uncore_misc2",kind:"other",label:"Uncore logic, unidentified",x:.1615,y:.5854,w:.0401,h:.1058,confidence:"low"},{id:"display",kind:"display",label:"Display engine (4 display pipes)",x:.0534,y:.6968,w:.1484,h:.2206,confidence:"medium"},{id:"display_phy",kind:"display_phy",label:"Display PHYs (DDI ports for DP/HDMI)",x:.0617,y:.9253,w:.1315,h:.0628,confidence:"medium"},{id:"misc_io",kind:"misc_io",label:"Misc I/O macros (unidentified; possibly sideband/GPIO/clock/debug pads)",x:.0057,y:.7381,w:.0474,h:.1624,confidence:"low"},{id:"misc_io_b",kind:"misc_io",label:"Small macros / fill at bottom-left corner (unidentified)",x:.0057,y:.9021,w:.0474,h:.0866,confidence:"low"},{id:"pcore0",kind:"pcore",label:"P-core 0 (Raptor Cove) + 2 MB L2",x:.2012,y:.0679,w:.0966,h:.3009,confidence:"high"},{id:"llc0",kind:"llc_slice",label:"LLC slice 0 (3 MB) - P-core column 0, top",x:.2008,y:.3688,w:.093,h:.1097,confidence:"high"},{id:"pcore1",kind:"pcore",label:"P-core 1 (Raptor Cove) + 2 MB L2",x:.2978,y:.0679,w:.0966,h:.3009,confidence:"high"},{id:"llc1",kind:"llc_slice",label:"LLC slice 1 (3 MB) - P-core column 1, top",x:.2977,y:.3688,w:.0927,h:.1097,confidence:"high"},{id:"pcore2",kind:"pcore",label:"P-core 2 (Raptor Cove) + 2 MB L2",x:.3944,y:.0679,w:.0966,h:.3009,confidence:"high"},{id:"llc2",kind:"llc_slice",label:"LLC slice 2 (3 MB) - P-core column 2, top",x:.3943,y:.3688,w:.0927,h:.1097,confidence:"high"},{id:"pcore3",kind:"pcore",label:"P-core 3 (Raptor Cove) + 2 MB L2",x:.491,y:.0679,w:.0966,h:.3009,confidence:"high"},{id:"llc3",kind:"llc_slice",label:"LLC slice 3 (3 MB) - P-core column 3, top",x:.4909,y:.3688,w:.0927,h:.1097,confidence:"high"},{id:"pcore4",kind:"pcore",label:"P-core 4 (Raptor Cove) + 2 MB L2",x:.2021,y:.6912,w:.0963,h:.3009,confidence:"high",mirror:{x:!0,y:!0}},{id:"llc4",kind:"llc_slice",label:"LLC slice 4 (3 MB) - P-core column 0, bottom",x:.206,y:.5831,w:.0924,h:.1081,confidence:"high"},{id:"pcore5",kind:"pcore",label:"P-core 5 (Raptor Cove) + 2 MB L2",x:.2987,y:.6912,w:.0964,h:.3009,confidence:"high",mirror:{x:!0,y:!0}},{id:"llc5",kind:"llc_slice",label:"LLC slice 5 (3 MB) - P-core column 1, bottom",x:.3026,y:.5831,w:.0925,h:.1081,confidence:"high"},{id:"pcore6",kind:"pcore",label:"P-core 6 (Raptor Cove) + 2 MB L2",x:.3953,y:.6912,w:.0964,h:.3009,confidence:"high",mirror:{x:!0,y:!0}},{id:"llc6",kind:"llc_slice",label:"LLC slice 6 (3 MB) - P-core column 2, bottom",x:.3992,y:.5831,w:.0925,h:.1081,confidence:"high"},{id:"pcore7",kind:"pcore",label:"P-core 7 (Raptor Cove) + 2 MB L2",x:.4919,y:.6912,w:.0964,h:.3009,confidence:"high",mirror:{x:!0,y:!0}},{id:"llc7",kind:"llc_slice",label:"LLC slice 7 (3 MB) - P-core column 3, bottom",x:.4958,y:.5831,w:.0925,h:.1081,confidence:"high"},{id:"ecl0",kind:"ecore_cluster",label:"E-core cluster 0 (top-left): 4x Gracemont + 4 MB shared L2",x:.5878,y:.0877,w:.1265,h:.2969,confidence:"high"},{id:"ecl1",kind:"ecore_cluster",label:"E-core cluster 1 (top-right): 4x Gracemont + 4 MB shared L2",x:.7146,y:.0877,w:.1265,h:.2969,confidence:"high"},{id:"ecl2",kind:"ecore_cluster",label:"E-core cluster 2 (bottom-left): 4x Gracemont + 4 MB shared L2",x:.5888,y:.677,w:.1266,h:.297,confidence:"high",mirror:{x:!0,y:!0}},{id:"ecl3",kind:"ecore_cluster",label:"E-core cluster 3 (bottom-right): 4x Gracemont + 4 MB shared L2",x:.7156,y:.677,w:.1263,h:.297,confidence:"high",mirror:{x:!0,y:!0}},{id:"llc8",kind:"llc_slice",label:"LLC slice 8 (3 MB) - ecluster0 column",x:.5893,y:.405,w:.0922,h:.0735,confidence:"high"},{id:"llc9",kind:"llc_slice",label:"LLC slice 9 (3 MB) - ecluster1 column",x:.7148,y:.405,w:.0922,h:.0735,confidence:"high"},{id:"llc10",kind:"llc_slice",label:"LLC slice 10 (3 MB) - ecluster2 column",x:.5935,y:.5831,w:.0922,h:.073,confidence:"high"},{id:"llc11",kind:"llc_slice",label:"LLC slice 11 (3 MB) - ecluster3 column",x:.719,y:.5831,w:.0922,h:.073,confidence:"high"},{id:"ring_p0",kind:"ring",label:"Ring agents for column P0: 2 mirrored ring-stop/CBo units (pcore0+llc0, pcore4+llc4)",x:.2078,y:.4813,w:.0839,h:.0985,confidence:"high"},{id:"ring_p1",kind:"ring",label:"Ring agents for column P1: 2 mirrored ring-stop/CBo units (pcore1+llc1, pcore5+llc5)",x:.3044,y:.4813,w:.0839,h:.0985,confidence:"high"},{id:"ring_p2",kind:"ring",label:"Ring agents for column P2: 2 mirrored ring-stop/CBo units (pcore2+llc2, pcore6+llc6)",x:.401,y:.4813,w:.0839,h:.0985,confidence:"high"},{id:"ring_p3",kind:"ring",label:"Ring agents for column P3: 2 mirrored ring-stop/CBo units (pcore3+llc3, pcore7+llc7)",x:.4977,y:.4813,w:.0838,h:.0985,confidence:"high"},{id:"ring_e0",kind:"ring",label:"Ring agents for column E0: 2 mirrored ring-stop/CBo units (ecluster0+llc8, ecluster2+llc10)",x:.5956,y:.4813,w:.0841,h:.0985,confidence:"high"},{id:"ring_e1",kind:"ring",label:"Ring agents for column E1: 2 mirrored ring-stop/CBo units (ecluster1+llc9, ecluster3+llc11)",x:.7211,y:.4813,w:.0857,h:.0985,confidence:"high"},{id:"ring_stop_gt",kind:"ring",label:"Ring stop at the iGPU end (right end of the ring)",x:.807,y:.4785,w:.0112,h:.1041,confidence:"low"},{id:"igpu",kind:"igpu",label:"Integrated GPU complex: Intel UHD Graphics 770 (Xe-LP, 32 EU) incl. media",x:.8427,y:.0583,w:.1516,h:.8976,confidence:"high"},{id:"media0",kind:"media",label:"Media engine 0 (video decode/encode + video enhancement)",x:.8427,y:.1086,w:.0766,h:.3501,confidence:"medium"},{id:"media1",kind:"media",label:"Media engine 1 (video decode/encode + video enhancement)",x:.8427,y:.6063,w:.0766,h:.3496,confidence:"medium"},{id:"gpu_global",kind:"igpu",label:"GPU global assets (GAM + GTI: the GPU's interface to the ring)",x:.8427,y:.4587,w:.0391,h:.1476,confidence:"medium"},{id:"gpu_common",kind:"igpu",label:"GPU slice common (3D geometry front end, raster/pixel back end, L3 control)",x:.8818,y:.3173,w:.1125,h:.3773,confidence:"medium"},{id:"gpu_l3_top",kind:"igpu",label:"GPU L3 cache column (upper SRAM banks)",x:.9201,y:.1086,w:.019,h:.2014,confidence:"medium"},{id:"gpu_l3_bot",kind:"igpu",label:"GPU L3 cache column (lower SRAM banks)",x:.9201,y:.7212,w:.019,h:.2024,confidence:"medium"},{id:"gpu_eu0",kind:"igpu",label:"GPU subslice 0: 16 EUs (8 EU pairs)",x:.9393,y:.0583,w:.055,h:.1459,confidence:"high"},{id:"gpu_tmu0",kind:"igpu",label:"GPU subslice 0: sampler / texture units + L1/SLM",x:.9393,y:.2042,w:.055,h:.1131,confidence:"medium"},{id:"gpu_tmu1",kind:"igpu",label:"GPU subslice 1: sampler / texture units + L1/SLM",x:.9393,y:.6946,w:.055,h:.1131,confidence:"medium"},{id:"gpu_eu1",kind:"igpu",label:"GPU subslice 1: 16 EUs (8 EU pairs)",x:.9393,y:.8077,w:.055,h:.1471,confidence:"high"},{id:"analog0",kind:"other",label:"Small analog/mixed-signal macro 0 on top edge (unidentified)",x:.599,y:.0147,w:.0145,h:.0554,confidence:"low"},{id:"analog1",kind:"other",label:"Small analog/mixed-signal macro 1 on top edge (unidentified)",x:.6656,y:.0147,w:.0289,h:.0554,confidence:"low"},{id:"analog2",kind:"other",label:"Small analog/mixed-signal macro 2 on top edge (unidentified)",x:.7922,y:.0147,w:.0286,h:.0554,confidence:"low"}],core_internals:{pcore:[{id:"power_gates",label:"Power-gate stripe (core power switches)",x:0,y:0,w:.035,h:1},{id:"fma",label:"FMA / vector execution units (ports 0 & 1)",x:.035,y:0,w:.187,h:.277},{id:"fpu",label:"FPU / SIMD execution",x:.222,y:0,w:.296,h:.284},{id:"fp_regs",label:"FP/vector register files",x:.518,y:0,w:.142,h:.277},{id:"ooo",label:"Out-of-order scheduling, rename & retirement (ROB)",x:.66,y:0,w:.34,h:.337},{id:"int_exec",label:"Integer execution",x:.068,y:.284,w:.445,h:.128},{id:"int_regs",label:"Integer register file",x:.518,y:.31,w:.142,h:.1},{id:"ucode_opcache",label:"Microcode ROM + 4K-uop op cache",x:.759,y:.299,w:.083,h:.165},{id:"l1d",label:"48 KB L1 data cache",x:.079,y:.397,w:.136,h:.119},{id:"load_store",label:"Load/store units + L1D control",x:.215,y:.412,w:.401,h:.277},{id:"decode",label:"Instruction decode",x:.616,y:.464,w:.384,h:.135},{id:"l1i",label:"32 KB L1 instruction cache",x:.623,y:.599,w:.092,h:.09},{id:"l1i_ctl",label:"L1I control / fetch",x:.715,y:.599,w:.285,h:.105},{id:"branch",label:"Branch prediction",x:.704,y:.704,w:.296,h:.296},{id:"l2",label:"L2 cache (in-core arrays + control)",x:.066,y:.689,w:.638,h:.311},{id:"l2_ext",label:"L2 extension arrays (Raptor Cove's 1.25 -> 2 MB growth)",x:.217,y:1,w:.55,h:.175}],ecore_cluster:[{id:"l2",label:"Shared 4 MB L2 (cluster)",x:.004,y:0,w:.992,h:.19},{id:"core_tl",label:"Gracemont core (top-left)",x:0,y:.196,w:.431,h:.398},{id:"core_tr",label:"Gracemont core (top-right; L/R mirror of core_tl)",x:.569,y:.196,w:.431,h:.398},{id:"core_bl",label:"Gracemont core (bottom-left; T/B mirror of core_tl)",x:0,y:.598,w:.431,h:.398},{id:"core_br",label:"Gracemont core (bottom-right)",x:.569,y:.598,w:.431,h:.398},{id:"spine",label:"L2 control/tags + cluster logic (central spine, links to the ring stop)",x:.431,y:.196,w:.138,h:.8}]},ring:{path:[[.1836,.5059],[.8125,.5059],[.8125,.5551],[.1836,.5551]],closed:!0,stops:[{id:"stop_sa",x:.1836,y:.5305,serves:["sa","imc0","imc1","pcie_ctrl","dmi","pcie5","pcie4","display","display_phy","uncore_misc","uncore_misc2"]},{id:"stop_pcore0",x:.2288,y:.5059,serves:["pcore0","llc0"]},{id:"stop_pcore1",x:.3254,y:.5059,serves:["pcore1","llc1"]},{id:"stop_pcore2",x:.422,y:.5059,serves:["pcore2","llc2"]},{id:"stop_pcore3",x:.5186,y:.5059,serves:["pcore3","llc3"]},{id:"stop_ecluster0",x:.6166,y:.5059,serves:["ecl0","llc8"]},{id:"stop_ecluster1",x:.7421,y:.5059,serves:["ecl1","llc9"]},{id:"stop_gt",x:.8125,y:.5305,serves:["igpu","gpu_global","gpu_common","media0","media1"]},{id:"stop_ecluster3",x:.785,y:.5551,serves:["ecl3","llc11"]},{id:"stop_ecluster2",x:.6587,y:.5551,serves:["ecl2","llc10"]},{id:"stop_pcore7",x:.5605,y:.5551,serves:["pcore7","llc7"]},{id:"stop_pcore6",x:.4639,y:.5551,serves:["pcore6","llc6"]},{id:"stop_pcore5",x:.3673,y:.5551,serves:["pcore5","llc5"]},{id:"stop_pcore4",x:.2707,y:.5551,serves:["pcore4","llc4"]}]},wiring:{nodes:{sa:[.15469,.3948],sa_ring:[.1836,.3948],sa_w:[.13073,.3948],sa_mem:[.15469,.3371],mf_w:[.12279,.3371],mf_e:[.17474,.3371],imc0:[.12279,.19994],imc1:[.17474,.19994],imc0_up:[.12279,.05628],imc1_up:[.17474,.05628],ddrA_s:[.13516,.05628],ddrB_s:[.43281,.05628],ddr_a:[.13516,.02687],ddr_b:[.43281,.02687],io_j:[.13073,.45136],io_hub:[.0625,.45136],io_p5:[.0625,.43326],io_p5a:[.0625,.34219],io_dmi:[.0625,.1431],io_p5b:[.0625,.52432],io_p4:[.0625,.67704],dmi:[.02917,.1431],pcie5:[.03177,.43326],pcie5_a:[.03177,.34219],pcie5_b:[.03177,.52432],pcie4:[.02917,.67704],um:[.13073,.57466],um2_w:[.13073,.63801],um2:[.18151,.63801],disp_n:[.13073,.6776],disp:[.13073,.80713],dphy_n:[.13073,.92081],dphy:[.13073,.95673],gt:[.86224,.5305],media0:[.86224,.28281],media1:[.86224,.78054],gc:[.90104,.5305],gs:[.92943,.5305],gs_eu0:[.92943,.13122],gs_tmu0:[.92943,.26075],gl3t:[.92943,.20928],gl3b:[.92943,.8224],gs_tmu1:[.92943,.75113],gs_eu1:[.92943,.88122],gpu_eu0:[.9668,.13122],gpu_tmu0:[.9668,.26075],gpu_tmu1:[.9668,.75113],gpu_eu1:[.9668,.88122],pcore0:[.2288,.21833],llc0:[.2288,.42364],pcore1:[.3254,.21833],llc1:[.3254,.42364],pcore2:[.422,.21833],llc2:[.422,.42364],pcore3:[.5186,.21833],llc3:[.5186,.42364],pcore4:[.2707,.84163],llc4:[.2707,.63716],pcore5:[.3673,.84163],llc5:[.3673,.63716],pcore6:[.4639,.84163],llc6:[.4639,.63716],pcore7:[.5605,.84163],llc7:[.5605,.63716],ecluster0:[.65104,.23614],e0_g:[.65104,.39423],e0_s:[.6166,.39423],llc8:[.6166,.44174],ecluster1:[.77786,.23614],e1_g:[.77786,.39423],e1_s:[.7421,.39423],llc9:[.7421,.44174],ecluster2:[.65208,.82551],e2_g:[.65208,.66686],e2_s:[.6587,.66686],llc10:[.6587,.61963],ecluster3:[.77878,.82551],e3_g:[.77878,.66686],e3_s:[.785,.66686],llc11:[.785,.61963]},edges:[["stop:stop_sa","sa_ring"],["sa_ring","sa"],["sa","sa_w"],["sa","sa_mem"],["sa_mem","mf_w"],["sa_mem","mf_e"],["mf_w","imc0"],["mf_e","imc1"],["imc0","imc0_up"],["imc1","imc1_up"],["imc0_up","ddrA_s"],["imc1_up","ddrB_s"],["ddrA_s","ddr_a"],["ddrB_s","ddr_b"],["sa_w","io_j"],["io_j","io_hub"],["io_hub","io_p5"],["io_p5","io_p5a"],["io_p5a","io_dmi"],["io_hub","io_p5b"],["io_p5b","io_p4"],["io_dmi","dmi"],["io_p5","pcie5"],["io_p4","pcie4"],["io_p5a","pcie5_a"],["io_p5b","pcie5_b"],["pcie5","pcie5_a"],["pcie5","pcie5_b"],["io_j","um"],["um","um2_w"],["um2_w","disp_n"],["um2_w","um2"],["disp_n","disp"],["disp","dphy_n"],["dphy_n","dphy"],["stop:stop_gt","gt"],["gt","media0"],["gt","media1"],["gt","gc"],["gc","gs"],["gs","gs_tmu0"],["gs_tmu0","gl3t"],["gl3t","gs_eu0"],["gs","gs_tmu1"],["gs_tmu1","gl3b"],["gl3b","gs_eu1"],["gs_eu0","gpu_eu0"],["gs_tmu0","gpu_tmu0"],["gs_tmu1","gpu_tmu1"],["gs_eu1","gpu_eu1"],["pcore0","llc0"],["llc0","stop:stop_pcore0"],["pcore1","llc1"],["llc1","stop:stop_pcore1"],["pcore2","llc2"],["llc2","stop:stop_pcore2"],["pcore3","llc3"],["llc3","stop:stop_pcore3"],["pcore4","llc4"],["llc4","stop:stop_pcore4"],["pcore5","llc5"],["llc5","stop:stop_pcore5"],["pcore6","llc6"],["llc6","stop:stop_pcore6"],["pcore7","llc7"],["llc7","stop:stop_pcore7"],["ecluster0","e0_g"],["e0_g","e0_s"],["e0_s","llc8"],["llc8","stop:stop_ecluster0"],["ecluster1","e1_g"],["e1_g","e1_s"],["e1_s","llc9"],["llc9","stop:stop_ecluster1"],["ecluster2","e2_g"],["e2_g","e2_s"],["e2_s","llc10"],["llc10","stop:stop_ecluster2"],["ecluster3","e3_g"],["e3_g","e3_s"],["e3_s","llc11"],["llc11","stop:stop_ecluster3"]],ports:{sa:"sa",imc0:"imc0",imc1:"imc1",ddrphy:"ddr_a",dmi:"dmi",pcie5:"pcie5",pcie4:"pcie4",pcie_ctrl:"io_hub",display:"disp",display_phy:"dphy",igpu:"gt",gpu_global:"gt",media0:"media0",media1:"media1",gpu_common:"gc",gpu_l3_top:"gl3t",gpu_l3_bot:"gl3b",gpu_eu0:"gpu_eu0",gpu_eu1:"gpu_eu1",gpu_tmu0:"gpu_tmu0",gpu_tmu1:"gpu_tmu1",uncore_misc:"um",uncore_misc2:"um2",pcore0:"pcore0",pcore1:"pcore1",pcore2:"pcore2",pcore3:"pcore3",pcore4:"pcore4",pcore5:"pcore5",pcore6:"pcore6",pcore7:"pcore7",llc0:"llc0",llc1:"llc1",llc2:"llc2",llc3:"llc3",llc4:"llc4",llc5:"llc5",llc6:"llc6",llc7:"llc7",llc8:"llc8",llc9:"llc9",llc10:"llc10",llc11:"llc11",ecl0:"ecluster0",ecl1:"ecluster1",ecl2:"ecluster2",ecl3:"ecluster3"},exits:{dmi:{node:"dmi",edge:"left",label:"DMI ×8 → chipset",bus:"dmi"},pcie5:{node:"pcie5",edge:"left",label:"PCIe 5.0 ×16 → graphics card",bus:"pcie16"},pcie4:{node:"pcie4",edge:"left",label:"PCIe 4.0 ×4 → NVMe SSD",bus:"pcie4"},dram0:{node:"ddr_a",edge:"top",label:"DDR5 channel A → DIMM",bus:"ddrA"},dram1:{node:"ddr_b",edge:"top",label:"DDR5 channel B → DIMM",bus:"ddrB"},display:{node:"dphy",edge:"bottom",label:"DisplayPort / HDMI → monitor"}},notes:"Schematic of logical paths through physical channels: the wires themselves are in metal layers a poly-layer photo can't show. Cores drop through their LLC slice/CBo to their ring agent; the SA reaches MC0/MC1 through the memory fabric and each MC its own half of the DDR PHY; the I/O fabric runs from the SA to the PCIe/DMI controller column. Measured and argued in research/audit2/interconnect/wiring.json."},mounting:{die_center_offset_mm:{east:0,north:1.8}}},x_=""+new URL("raptor-lake-die-Cx3uVZPi.jpg",import.meta.url).href,W={thread:["LaurieWired’s thread","https://bsky.app/profile/lauriewired.bsky.social/post/3mxwk6hqb622v"],sdm:["Intel SDM, rev. 093 (Vols. 1 and 3)","https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html"],pchds:["Intel 700-series PCH datasheet","https://edc.intel.com/content/www/us/en/design/products-and-solutions/processors-and-chipsets/700-series-chipset-family-platform-controller-hub-datasheet-volume-1-of/"],rplds:["Intel 13th-gen Core datasheet","https://edc.intel.com/content/www/us/en/design/products/platforms/details/raptor-lake-s/13th-generation-core-processors-datasheet-volume-1-of-2/"],atx:["Intel ATX 3 PSU design guide","https://cdrdv2-public.intel.com/336521/336521_Rev2p1a.pdf"],sio:["Nuvoton NCT6796D datasheet (example Super I/O; the MSI board uses an NCT6687D)","https://www.nuvoton.com/resource-files/NCT6796D_Datasheet_V0_6.pdf"],csme:["Intel CSME security white paper","https://www.intel.com/content/dam/www/public/us/en/security-advisory/documents/intel-csme-security-white-paper.pdf"],cseTelemetry:["coreboot cse_telemetry_v1.h","https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/include/intelblocks/cse_telemetry_v1.h"],cseCommit:["coreboot commit 860672e9 (measured CSME timings)","https://github.com/coreboot/coreboot/commit/860672e9879e52820d453e3bc41d151116facb1a"],cseCommit2:["coreboot change 79768 (CSME timings, Alder Lake-N)","https://review.coreboot.org/c/coreboot/+/79768"],fit:["Intel FIT BIOS specification","https://www.intel.com/content/dam/www/public/us/en/documents/guides/fit-bios-specification.pdf"],txt:["coreboot: Intel TXT / ACM docs","https://github.com/coreboot/coreboot/blob/main/Documentation/security/intel/txt.md"],ermolov:["Ermolov, “Safeguarding rootkits: Intel BootGuard” (2016)","https://papers.put.as/papers/firmware/2016/Intel_BootGuard_final.pdf"],entry16:["coreboot src/cpu/x86/entry16.S","https://github.com/coreboot/coreboot/blob/main/src/cpu/x86/entry16.S"],entry32:["coreboot src/cpu/x86/entry32.S","https://github.com/coreboot/coreboot/blob/main/src/cpu/x86/entry32.S"],bootblockld:["coreboot src/arch/x86/bootblock.ld","https://github.com/coreboot/coreboot/blob/main/src/arch/x86/bootblock.ld"],gdt:["coreboot src/arch/x86/gdt_init.S","https://github.com/coreboot/coreboot/blob/main/src/arch/x86/gdt_init.S"],vtf0:["EDK2 UefiCpuPkg/ResetVector/Vtf0","https://github.com/tianocore/edk2/tree/master/UefiCpuPkg/ResetVector/Vtf0"],adlSec:["edk2-platforms Alder Lake SecEntry.nasm","https://github.com/tianocore/edk2-platforms/blob/master/Platform/Intel/AlderlakeOpenBoardPkg/FspWrapper/Library/SecFspWrapperPlatformSecLib/Ia32/SecEntry.nasm"],flash:["Winbond W25Q256JV datasheet","https://cdn.sparkfun.com/assets/c/2/9/2/6/W25Q256JV.pdf"],ucode:["Intel microcode release notes","https://github.com/intel/Intel-Linux-Processor-Microcode-Data-Files/blob/main/releasenote.md"],amd17:["coreboot: AMD family 17h boot flow","https://github.com/coreboot/coreboot/blob/main/Documentation/soc/amd/family17h.md"],sipi:["coreboot src/cpu/x86/sipi_vector.S","https://github.com/coreboot/coreboot/blob/main/src/cpu/x86/sipi_vector.S"],mpinit:["coreboot src/cpu/x86/mp_init.c","https://github.com/coreboot/coreboot/blob/main/src/cpu/x86/mp_init.c"],mpfuncs:["EDK2 MpInitLib X64/MpFuncs.nasm","https://github.com/tianocore/edk2/blob/master/UefiCpuPkg/Library/MpInitLib/X64/MpFuncs.nasm"],mplib:["EDK2 MpInitLib MpLib.c","https://github.com/tianocore/edk2/blob/master/UefiCpuPkg/Library/MpInitLib/MpLib.c"],smpboot:["Linux arch/x86/kernel/smpboot.c","https://github.com/torvalds/linux/blob/master/arch/x86/kernel/smpboot.c"],tramp:["Linux arch/x86/realmode/rm/trampoline_64.S","https://github.com/torvalds/linux/blob/master/arch/x86/realmode/rm/trampoline_64.S"],head64:["Linux arch/x86/kernel/head_64.S","https://github.com/torvalds/linux/blob/master/arch/x86/kernel/head_64.S"],cpuhp:["Linux kernel/cpu.c (parallel bring-up)","https://github.com/torvalds/linux/blob/master/kernel/cpu.c"],lkml65:["Gleixner, Linux 6.5 smp/core pull (bring-up timings)","https://lkml.iu.edu/hypermail/linux/kernel/2306.3/01314.html"],acpi:["ACPI 6.5 §5.2.12 (MADT)","https://uefi.org/specs/ACPI/6.5/05_ACPI_Software_Programming_Model.html"],ark:["Intel ARK: Core i9-13900K","https://www.intel.com/content/www/us/en/products/sku/230496/intel-core-i913900k-processor-36m-cache-up-to-5-80-ghz/specifications.html"],micron:["Micron DDR5 SDRAM product page (core data sheet Rev. D, JESD79-5B-compliant)","https://www.micron.com/products/memory/dram-components/ddr5-sdram"],rambus:["Rambus: DDR5 DIMM chipsets","https://www.rambus.com/blogs/get-ready-for-ddr5-dimm-chipsets/"],fspm:["Intel FSP: Raptor Lake-S FspmUpd.h","https://github.com/intel/FSP/blob/master/RaptorLakeFspBinPkg/Client/RaptorLakeS/Include/FspmUpd.h"],meminit:["coreboot drivers/intel/fsp2_0/memory_init.c","https://github.com/coreboot/coreboot/blob/main/src/drivers/intel/fsp2_0/memory_init.c"],smbuslib:["coreboot intel smbus/smbuslib.c","https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/smbus/smbuslib.c"],hswraminit:["coreboot Haswell native raminit (open MRC re-implementation)","https://github.com/coreboot/coreboot/tree/main/src/northbridge/intel/haswell/native_raminit"],memmap:["coreboot intel systemagent/memmap.c","https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/systemagent/memmap.c"],adlKconfig:["coreboot soc/intel/alderlake/Kconfig","https://github.com/coreboot/coreboot/blob/main/src/soc/intel/alderlake/Kconfig"],fspapi:["EDK2 IntelFsp2Pkg FspApi.h","https://github.com/tianocore/edk2/blob/master/IntelFsp2Pkg/Include/FspEas/FspApi.h"],enablepaging:["EDK2 BaseLib Ia32/EnablePaging64.nasm","https://github.com/tianocore/edk2/blob/master/MdePkg/Library/BaseLib/Ia32/EnablePaging64.nasm"],dxeipl:["EDK2 DxeIplPeim (PEI → DXE hand-off)","https://github.com/tianocore/edk2/tree/master/MdeModulePkg/Core/DxeIplPeim"],dispatcher:["EDK2 DXE Dispatcher.c","https://github.com/tianocore/edk2/blob/master/MdeModulePkg/Core/Dxe/Dispatcher/Dispatcher.c"],pispec:["UEFI PI spec 1.8, Vol. 2 (DXE)","https://uefi.org/specs/PI/1.8/V2_Overview.html"],uefispec:["UEFI 2.11 specification","https://uefi.org/specs/UEFI/2.11/"],msibios:["MSI PRO Z790-P WIFI BIOS 7E06vAK (module census)","https://download-2.msi.com/bos_exe/mb/7E06vAK.zip"],smmreloc:["EDK2 SmmRelocationLib.c","https://github.com/tianocore/edk2/blob/master/UefiCpuPkg/Library/SmmRelocationLib/SmmRelocationLib.c"],pcidevice:["coreboot src/device/pci_device.c","https://github.com/coreboot/coreboot/blob/main/src/device/pci_device.c"],pcilib:["EDK2 PciBusDxe PciLib.c","https://github.com/tianocore/edk2/blob/master/MdeModulePkg/Bus/Pci/PciBusDxe/PciLib.c"],pcidevs:["coreboot alderlake pci_devs.h","https://github.com/coreboot/coreboot/blob/main/src/soc/intel/alderlake/include/soc/pci_devs.h"],linuxpci:["Linux drivers/pci/pci.c (link-up waits)","https://github.com/torvalds/linux/blob/master/drivers/pci/pci.c"],optrom:["EDK2 PciOptionRomSupport.c","https://github.com/tianocore/edk2/blob/master/MdeModulePkg/Bus/Pci/PciBusDxe/PciOptionRomSupport.c"],gop:["EDK2 GraphicsOutput.h","https://github.com/tianocore/edk2/blob/master/MdePkg/Include/Protocol/GraphicsOutput.h"],bds:["EDK2 BdsDxe BdsEntry.c","https://github.com/tianocore/edk2/blob/master/MdeModulePkg/Universal/BdsDxe/BdsEntry.c"],imgverify:["EDK2 DxeImageVerificationLib.c","https://github.com/tianocore/edk2/blob/master/SecurityPkg/Library/DxeImageVerificationLib/DxeImageVerificationLib.c"],efistub:["Linux EFI stub (x86-stub.c, efi-stub-helper.c)","https://github.com/torvalds/linux/tree/master/drivers/firmware/efi/libstub"],fpdt:["Microsoft: BIOS initialization duration (FPDT)","https://learn.microsoft.com/en-us/windows-hardware/test/assessments/bios-initialization-duration"],endofdxe:["UEFI PI 1.8 Vol. 2: End of DXE event","https://uefi.org/specs/PI/1.8/V2_Services_Boot_Services.html"],bdsplatform:["EDK2 OvmfPkg PlatformBootManagerLib BdsPlatform.c","https://github.com/tianocore/edk2/blob/master/OvmfPkg/Library/PlatformBootManagerLib/BdsPlatform.c"],defer3rd:["EDK2 SecurityStubDxe Defer3rdPartyImageLoad.c","https://github.com/tianocore/edk2/blob/master/MdeModulePkg/Universal/SecurityStubDxe/Defer3rdPartyImageLoad.c"],uefiexec:["UEFI 2.11 §2.3.4: x64 platforms (calling conventions, execution model)","https://uefi.org/specs/UEFI/2.11/02_Overview.html"],smmcpu:["EDK2 PiSmmCpuDxeSmm PiSmmCpuCommon.c","https://github.com/tianocore/edk2/blob/master/UefiCpuPkg/PiSmmCpuDxeSmm/PiSmmCpuCommon.c"],ms7e06:["coreboot mainboard msi/ms7e06 (PRO Z790-P WIFI)","https://github.com/coreboot/coreboot/tree/main/src/mainboard/msi/ms7e06"],ucodeLinux:["Linux arch/x86/kernel/cpu/microcode/intel.c","https://github.com/torvalds/linux/blob/master/arch/x86/kernel/cpu/microcode/intel.c"],fritz:["Die photo: Fritzchens Fritz, CC0 (Wikimedia Commons)","https://commons.wikimedia.org/wiki/File:Intel@intel7(10nmESF)@RaptorLake@RPL(8P%2B16E)@i9-13900K@ES_DSCx05_poly@5xExt.jpg"]},$h=i=>i<16&&i%2===1,qh=i=>!$h(i),Gi=i=>()=>i,xt=(i,e="wfs")=>t=>t===0?i:e;function Ta(i,e,t,n,{before:s="wfs",bspMode:r=null,spread:a=.55,order:o=null}={}){const l=Ye(i,e,t);return c=>{if(c===0)return r??n[n.length-1];const h=o?o(c):(c-1)/30,d=(l*(1+a)-h*a)*n.length;return d<=0?s:n[Math.min(n.length-1,Math.floor(d))]}}function br(i,e){let t=0;for(;t<e.length-2&&i>=e[t+1][0];)t++;const[n,s]=e[t],[r,a]=e[t+1];return Math.floor(s+Ye(i,n,r)*(a-s))}const vs=(i,e)=>{const t=s=>s?"high":"low",n=e+i;return{title:"Board signals",note:"# = active low",rows:[["PWRBTN#",n>1.08&&n<1.4?"low (pressed)":"high",n>1.08&&n<1.4?"hot":""],["SLP_S3#",n>1.55?"high (S0)":"low (S5)",n>1.55&&n<2?"hot":""],["PS_ON#",n>1.75?"low (on)":"high (off)",n>1.75&&n<2.1?"hot":""],["+12 V / 5 V / 3.3 V",n>2.25?"in regulation":n>1.9?"ramping":"off"],["5 V standby","on"],["PWR_OK",t(n>2.7),n>2.7&&n<3.1?"hot":""],["PCH_PWROK",t(n>3.95),n>3.95&&n<4.3?"hot":""],["CPUPWRGD",t(n>4.18),n>4.18&&n<4.5?"hot":""],["PLTRST#",n>4.32?"high (released)":"low (reset)",n>4.32&&n<4.7?"hot":""]]}},M_=["atx24","pch","sio","cmos","fpanel","spi"],y_=[{stage:0,title:"Off — but not dead",dur:9,real:0,mode:"off",shot:"standby",narration:["A PC that is “off” is still sipping power. A coin cell keeps the chipset’s real-time clock ticking at 32,768 Hz and preserves 256 bytes of battery-backed “CMOS” RAM.","With the power supply plugged in, its always-on <em>5 V standby</em> rail also keeps part of the chipset awake — its power-management controller (PMC) — plus a small <em>Super I/O</em> chip whose job right now is to watch the power button."],facts:[["State","ACPI S5 “soft off”"],["Alive","RTC well, PCH standby well + PMC, Super I/O"],["CPU","unpowered — SLP_S3# can cut it off completely"]],regs:i=>vs(i,0),sources:[W.pchds,W.atx,W.sio],lps:()=>Gi("off"),act(i,e){e.board("cmos",.35,L.mgmt,"breathe"),e.board("atx24",.3,L.power,"breathe"),e.bus("standby",.35,L.power,{rate:2,speed:30}),e.board("pch",.22,L.mgmt,"breathe"),e.board("sio",.3,L.mgmt,"breathe"),e.bus("cmos",.25,L.mgmt,{rate:.6,speed:20})},labels:M_},{stage:0,title:"Press",dur:8,real:.08,mode:"off",shot:"standby",narration:["Pressing the button just pulls a wire to ground. The Super I/O has its own debounce filter (62 ms by default on a Nuvoton NCT6796D), then passes the press to the chipset’s <code>PWRBTN#</code> pin, which by default waits out a further 16 ms in case it was a glitch.","Satisfied, the PMC leaves S5 by releasing its sleep signals (<code>SLP_S5#</code>, <code>SLP_S4#</code>, <code>SLP_S3#</code>). The Super I/O turns <code>SLP_S3#</code> into <code>PS_ON#</code> — the green wire in the 24-pin cable that tells the power supply to switch on."],facts:[["Super I/O filter","62.4 ms default on PSIN# (NCT6796D; delay inferred)"],["Debounce","16 ms on PWRBTN# (PCH datasheet)"],["SLP_S3# → PS_ON#","0–200 ns on a Nuvoton NCT6796D"]],regs:i=>vs(i,1),sources:[W.pchds,W.sio],lps:()=>Gi("off"),act(i,e){e.board("cmos",.3,L.mgmt,"breathe"),e.board("atx24",.3+Ye(i,.75,.95)*.7,L.power,"breathe"),e.bus("standby",.35,L.power,{rate:2,speed:30});const t=nt(i,.05,.4);e.board("fpanel",t,L.power,"glow"),e.bus("pwrbtn",t,L.power,{rate:t*14,speed:30}),e.board("sio",.3+nt(i,.15,.85)*.7,L.mgmt,"glow"),e.bus("siopch",nt(i,.2,.6),L.mgmt,{rate:10,speed:12}),e.board("pch",.25+nt(i,.3,.7)*.75,L.mgmt,"scan"),e.bus("siopch",nt(i,.55,.75),L.power,{rate:10,speed:12,dir:-1}),e.bus("pson",nt(i,.65,1),L.power,{rate:14,speed:40})},labels:[{id:"fpanel",hot:!0,to:.45},{id:"sio",text:"Super I/O: debounce → PWRBTN#, then PS_ON#"},{id:"pch",text:"PMC: 16 ms debounce, leave S5",from:.25},{id:"atx24",text:"PS_ON# low → PSU on",from:.7}]},{stage:0,title:"Power, proven",dur:9,real:.28,mode:"off",shot:"power",narration:["The supply ramps +12 V, +5 V and +3.3 V — then deliberately waits. On a current ATX supply, <code>PWR_OK</code> — the PSU’s promise that the power is stable — rises 100–250 ms after the rails are in regulation (pre-2020 designs: up to 500 ms). It is the longest single wait before the CPU runs anything.","The motherboard’s regulators turn 12 V into the processor’s own rails. The big multi-phase core regulator will take its voltage orders from the CPU itself over a three-wire bus called SVID. DIMMs, the GPU and the SSD get power too, but are held in reset."],facts:[["PSU power-on (T1)","< 200 ms (ATX 3 required)"],["PWR_OK delay (T3)","100–250 ms after rails are good (ATX 3 required)"],["CPU rails","VccCORE, VccGT (SVID), VccIN_AUX, VDD2 (memory controller), 1.05 V sustain"]],regs:i=>vs(i,2),sources:[W.atx,W.rplds,W.pchds],lps:()=>Gi("off"),act(i,e){const t=Ye(i,.05,.35);e.board("atx24",.6+t*.4,L.power,"glow"),e.bus("atx",t,L.power,{rate:30*t,speed:90}),e.board("eps",t,L.power,"glow"),e.bus("eps",t,L.power,{rate:24*t,speed:70});const n=Ye(i,.3,.55);e.board("vrm",n*.9,L.power,"sparkle"),e.board("vrm2",n*.9,L.power,"sparkle"),e.bus("vrm",n,L.power,{rate:20*n,speed:40}),e.bus("vrm2",n,L.power,{rate:20*n,speed:40});const s=Ye(i,.62,.8);e.bus("pwrok",nt(i,.6,.85),L.mgmt,{rate:12,speed:50}),e.board("sio",.3+s*.5,L.mgmt,"glow"),e.board("dimmA",n*.25,L.power,"breathe"),e.board("dimmB",n*.25,L.power,"breathe"),e.board("gpu",n*.15,L.power,"breathe"),e.board("nvme",n*.25,L.power,"breathe"),e.board("pch",.4,L.mgmt,"breathe")},labels:[{id:"atx24",text:"+12 V · +5 V · +3.3 V",hot:!0},{id:"vrm",text:"CPU voltage regulator",from:.3},{id:"sio",text:"PWR_OK → board power-good",from:.6}]},{stage:0,title:"The computer that boots your computer",dur:10,real:.1,mode:"off",shot:"pch",narration:["Inside the chipset sits another processor: the <em>Converged Security and Management Engine</em>, a 32-bit core “based on Intel 486 architecture” with its own SRAM and an unchangeable boot ROM. It starts climbing its own ladder — from reset into protected mode with paging — before the main CPU executes anything.","Its ROM pulls signed firmware out of the CSME region of the same SPI flash chip that holds the BIOS, and that firmware patches the chipset’s power controller and sets up the clocks, including the 100 MHz reference clock the CPU will run from. The CPU stays in reset until this engine tells the PMC the host may boot."],note:{tag:"In parallel",html:"The CSME works while the power supply is still proving itself; the clock here adds them up one after the other, so treat it as ± a few hundred ms. Intel’s own telemetry on Alder Lake Chromebooks: CSME ROM start → “Host BIOS Prep Done” ≈ 50–90 ms; → “CPU Reset Done Ack” ≈ 170–280 ms."},facts:[["CSME core","32-bit, 486-class, 512 KB–1.9 MB SRAM"],["Firmware","CSME region of the SPI flash"],["Also","holds the Boot Guard key hash in fuses"]],regs:i=>vs(i,3),sources:[W.csme,W.cseTelemetry,W.cseCommit,W.cseCommit2],lps:()=>Gi("off"),act(i,e){e.board("pch",.7+.3*nt(i,.1,.9),L.mgmt,"sparkle"),e.board("spi",nt(i,.15,.6),L.fetch,"scan"),e.bus("spi",nt(i,.15,.6),L.mgmt,{rate:16,speed:25,dir:-1}),e.bus("pwrok",nt(i,.75,1),L.mgmt,{rate:8,speed:40}),e.board("atx24",.8,L.power,"glow"),e.board("vrm",.5,L.power,"breathe"),e.board("vrm2",.5,L.power,"breathe"),e.board("sio",.5,L.mgmt,"glow")},labels:[{id:"pch",text:"CSME: a 486-class CPU inside the chipset",hot:!0},{id:"spi",text:"SPI flash: descriptor · CSME · BIOS regions",from:.12}]},{stage:0,title:"Reset released — and a leader is chosen",dur:9,real:.05,mode:"reset",shot:[[0,"pcie"],[.2,"die"]],narration:["Every supply reports good. The chipset raises <code>CPUPWRGD</code> and releases <code>PLTRST#</code>, the platform reset — which also reaches the GPU and SSD as PCIe <code>PERST#</code>, after their guaranteed 100 ms of stable power.","Inside the CPU, in steps Intel doesn’t publish, its power-control firmware brings up clocks and voltages and every core runs its reset microcode. Then one hardware thread becomes the <em>bootstrap processor</em> (BSP). The other 31 halt in <em>wait-for-SIPI</em>: powered, listening, and executing nothing until software sends them a start-up message."],note:{tag:"Which thread?",html:"On modern Intel parts the BSP is picked by a platform-specific mix of hardware and configuration (SDM §11.4). Linux’s CPU 0 on Alder/Raptor Lake is a P-core thread; which <em>physical</em> P-core it is isn’t documented, so the one lit here is illustrative."},facts:[["Logical processors","8 P-cores × 2 threads + 16 E-cores = 32"],["BSP","1 (IA32_APIC_BASE bit 8 set)"],["APs","31, in wait-for-SIPI"],["Duration","unpublished; the clock’s 50 ms is an estimate"]],regs:i=>vs(i,4),sources:[W.pchds,W.sdm,W.rplds],lps:i=>i<.3?Gi("off"):i<.55?Gi("reset"):Ta(i,.55,.85,["wfs"],{before:"reset",bspMode:"reset",spread:.6}),act(i,e){e.bus("sideband",nt(i,.05,.45),L.mgmt,{rate:10,speed:60}),e.bus("perst",nt(i,.15,.5),L.mgmt,{rate:6,speed:60}),e.bus("perst2",nt(i,.15,.5),L.mgmt,{rate:6,speed:60}),e.board("pch",.5,L.mgmt,"glow");const t=nt(i,.3,.5,.08);e.die("die",t*.9,"#ffffff","scan"),e.die("kind:pcore",nt(i,.32,.62)*.5,"#d8dcff","sparkle"),e.die("kind:ecore_cluster",nt(i,.32,.62)*.5,"#d8dcff","sparkle"),e.die("sa",Ye(i,.3,.45)*.4,L.mgmt,"breathe"),e.die("pcore0",Ye(i,.6,.8)*.55,"#ffffff","glow")},labels:[{id:"pcore0",text:"BSP (P-core 0, thread 0)",hot:!0,from:.6}]},{stage:0,title:"Patching itself before the first instruction",dur:10,real:.07,mode:"reset",shot:"fetch",inset:{shot:"die",label:"ON THE DIE"},narration:["Before running a single BIOS instruction, the BSP’s microcode reads a pointer stored 64 bytes below the 4 GiB mark (<code>FFFFFFC0</code>) to find the <em>Firmware Interface Table</em> in flash.","The table lists microcode updates. The CPU loads the newest one that matches and applies it to every thread in the package — every boot, because “the effects of a loaded update are cleared from the processor upon a hard reset”. The chip you bought is being patched by the flash chip before it runs anything."],facts:[["FIT pointer","FFFFFFC0h (4 GiB − 40h)"],["Microcode","type-1 FIT entry; RPL-S B0 = 06-b7-01, ≈241 KB"],["Reset acknowledged → first BIOS code","28–89 ms on Alder Lake Chromebooks (what fills it isn’t documented)"]],regs:{title:"Top of the 4 GiB address space",note:"all of it is the flash chip",rows:[["FFFFFFFC","CBFS header pointer (coreboot)","wide"],["FFFFFFF0","reset vector (16 bytes)","wide"],["FFFFFFC0","FIT pointer — same 64-byte line","wide hot"],["FFFF0000–FFFFFFFF","top 64 KiB: real-mode reach","wide"],["FF000000–FFFFFFFF","16 MiB BIOS decode window","wide"]]},mem:{on:["flash","lapic"],hit:["flash"],note:"no DRAM, no cache"},sources:[W.fit,W.sdm,W.ucode,W.cseCommit,W.cseCommit2,W.bootblockld],lps:()=>xt("reset"),act(i,e){e.die("pcore0",.6,"#ffffff","scan"),e.ring(.6,L.fetch),e.flow("fit","pcore0","dmi",4,L.fetch,5),e.bus("dmi",.8,L.fetch,{rate:6,speed:70}),e.bus("spi",.9,L.fetch,{rate:10,speed:30,dir:-1}),e.bus("dmi",.8,L.fetch,{rate:8,speed:70,dir:-1}),e.board("spi",.9,L.fetch,"scan"),e.board("pch",.5,L.fetch,"glow");const t=Ye(i,.55,.95);if(t>0){for(const n of["pcore1","pcore2","pcore3","pcore4","pcore5","pcore6","pcore7","ecl0","ecl1","ecl2","ecl3"])e.flow(`uc-${n}`,"dmi",n,1.2,"#ffffff",6);e.die("kind:pcore",t*.3,"#ffffff","scan"),e.die("kind:ecore_cluster",t*.3,"#ffffff","scan")}},labels:[{id:"spi",text:"FIT → microcode update",hot:!0},{id:"dmi",text:"DMI ×8 to the chipset",always:!0}]},{stage:0,title:"The secret first program",dur:10,real:.01,mode:"prot",shot:"dieLeft",inset:{shot:"fetch",label:"OUT OVER DMI → CHIPSET → SPI FLASH"},narration:["If the FIT also lists an Intel-signed <em>Startup ACM</em> (as on every <em>Intel Boot Guard</em> PC), the CPU runs it before the reset vector — from inside its own cache, in what is believed to be 32-bit protected mode. So on those machines the first x86 code to run isn’t 16-bit at all: the “386” runs before the “8086”.","With Boot Guard provisioned, the ACM checks the PC maker’s key manifest against a key hash fused into the chipset, then hashes the BIOS’s Initial Boot Block before letting it execute. It leaves that boot block sitting in cache, in the same No-Eviction Mode that comes back in Stage 2."],note:{tag:"Not every PC",html:"This step happens only if the FIT lists a Startup ACM, which Boot Guard (fused in by the PC maker) requires. MSI’s PRO Z790-P WIFI BIOS (7E06vAK) lists none, so on that board the BSP goes straight to the reset vector; this step and its estimated 10 ms never happen."},facts:[["FIT type","0x02 Startup ACM, 0x0B Key Manifest, 0x0C Boot Policy Manifest"],["Runs in","cache (“AC RAM”); 32-bit protected mode, paging off (believed — not documented for the reset-time launch)"],["Leaves behind","MSR 0x13A bit 0 = NEM enabled"]],mem:{on:["flash","lapic","car"],hit:["car","flash"],note:"only with a Startup ACM"},sources:[W.fit,W.txt,W.ermolov,W.csme],lps:()=>xt("prot"),act(i,e){e.die("pcore0",.8,L.car,"scan"),e.die("llc0",.4+.3*Ye(i,.2,.6),L.car,"pinned"),e.die("sub:pcore0:l2",.5,L.car,"pinned"),e.ring(.5,L.car),e.flow("ibb","dmi","pcore0",3,L.fetch,5),e.flow("acm","pcore0","llc0",4,L.car,4)},labels:[{id:"pcore0",text:"Startup ACM (Intel-signed)",hot:!0},{id:"llc0",text:"cache as private RAM"}]}],Yi=[{a:"FFFFFFF0",i:"jmp   _start16bit",era:"8086",why:"A 3-byte near jump (E9 0D F4). IP wraps from FFF3 to F400 inside the 64 KiB segment, so execution continues at FFFFF400. CS is untouched, so its hidden base FFFF0000 survives."},{a:"FFFFF400",i:"cli",era:"8086",why:"Mask interrupts. IF is already 0 after reset; this is belt-and-braces."},{a:"FFFFF401",i:"movl  %eax, %ebp",era:"386",why:"Stash the built-in self-test result (EAX) in EBP. The 66h prefix lets 16-bit code use a 32-bit register — something no 8086 could do."},{a:"FFFFF404",i:"movb  $0x01, %al",era:"8086",why:"post_code(POSTCODE_RESET_VECTOR_CORRECT) expands to this line and the next. POST code 0x01: “reset vector correct”."},{a:"FFFFF406",i:"outb  %al, $0x80",era:"8086",why:"The BIOS’s first visible output: an I/O write that crosses DMI to the chipset, where a POST-code display on the board can show “01”."},{a:"FFFFF408",i:"xorl  %eax, %eax",era:"386",why:"EAX = 0 (32-bit operation, 66h prefix)."},{a:"FFFFF40B",i:"movl  %eax, %cr3",era:"386",why:"CR3 = 0, “invalidate TLB”. Paging is off; this is historical caution. Control registers arrived with the 386."},{a:"FFFFF40E",i:"movw  %cs, %ax",era:"8086",why:"AX = F000, the visible CS selector."},{a:"FFFFF410",i:"shlw  $4, %ax",era:"186",why:"AX = F000 << 4, truncated to 16 bits = 0. A shift by an immediate count first appeared on the 80186."},{a:"FFFFF413",i:"movw  $nullidt_offset, %bx",era:"8086",why:"Low 16 bits of the address of a 6-byte “null IDT” descriptor, computed by the linker because there is no stack to compute it at run time."},{a:"FFFFF416",i:"subw  %ax, %bx",era:"8086",why:"Make it relative to CS (a no-op on the BSP)."},{a:"FFFFF418",i:"lidt  %cs:(%bx)",era:"286",why:"IDTR = {limit 0}. From now on any exception shuts the CPU down instead of jumping through garbage at physical address 0, where there is no RAM."},{a:"FFFFF41C",i:"movw  $gdtptr_offset, %bx",era:"8086",why:"Point at the GDT descriptor, also in the top 64 KiB of flash."},{a:"FFFFF41F",i:"subw  %ax, %bx",era:"8086",why:"CS-relative again."},{a:"FFFFF421",i:"lgdtl %cs:(%bx)",era:"386",why:"Load the Global Descriptor Table: flat 32-bit code and data segments, plus a 64-bit code segment not used here. The “l” (66h) matters: a 16-bit LGDT keeps only a 24-bit base, and this table lives at FFFFFxxx."},"...       # Boot Guard (CBnT) path, not built",{a:"FFFFF426",i:"movl  %cr0, %eax",era:"386",why:"EAX = 60000010, the reset value of CR0."},{a:"FFFFF429",i:"andl  $0x7FFAFFD1, %eax",era:"386",why:"Clear PG, AM, WP, NE, TS, EM, MP."},{a:"FFFFF42F",i:"orl   $0x60000001, %eax",era:"386",why:"Keep CD and NW set (caches stay off for now) and set PE — Protection Enable."},{a:"FFFFF435",i:"movl  %eax, %cr0",era:"386",why:"CR0 = 60000011. Protected mode is on — but CS still holds its stale 16-bit real-mode descriptor until it is reloaded."},{a:"FFFFF438",i:"movl  %ebp, %eax",era:"386",why:"Put the self-test result back in EAX for the next stage. The SDM asks for the far jump immediately after MOV CR0; a register-only move like this one is harmless in practice."},{a:"FFFFF43B",i:"ljmpl $GDT_CODE_SEG, $bootblock_protected_mode_entry",era:"386",why:"The first far jump. Selector GDT_CODE_SEG = 08h is looked up in the new GDT: base 0, limit 4 GiB, 32-bit. From the next instruction the CPU is a 32-bit protected-mode machine — still running straight out of flash."}],Zi=Yi.filter(i=>typeof i=="object"),S_=i=>Yi.indexOf(Zi[Math.min(i,Zi.length-1)]),dr=i=>{const e=Math.floor(i*Zi.length),t=e>=19?"60000011":"60000010",n=e>=21?"0008 · base 0 · 4 GiB · 32-bit":"F000 · base FFFF0000 · 16-bit",s=e===4||e===5?"00000001":e===8?"0000F000":e===16||e===17?"60000010":e===18||e===19?"60000011":"00000000",r=e>=21?"FFFFFxxx (32-bit)":["0000FFF0","0000F400","0000F401","0000F404","0000F406","0000F408","0000F40B","0000F40E","0000F410","0000F413","0000F416","0000F418","0000F41C","0000F41F","0000F421","0000F426","0000F429","0000F42F","0000F435","0000F438","0000F43B"][e];return{title:"BSP registers",note:"values per Intel SDM Table 12-1",rows:[["CS",n,"wide"+(e>=21?" hot":"")],["EIP",r,e===0?"hot":""],["CR0",t,e>=19?"hot":""],["EDX","000B0671"],["EAX",s],["EBP",e>=3?"00000000 ← BIST":"00000000"],["IDTR",e>=12?"limit 0 (null)":"base 0"],["GDTR",e>=15?"base FFFFFxxx":"base 0",e>=15&&e<19?"hot":""],["MTRRs","off → all UC"]]}},E_=[{stage:1,title:"Wake up as a 1978 processor",dur:9,real:0,isReset:!0,mode:"real",shot:"die",narration:["Now the BSP looks like a freshly reset 8086: <em>real mode</em>, where an address is “segment × 16 + offset” and 64 KiB segments reach about 1 MiB. Caches are disabled and every MTRR is off, so all memory is uncacheable — unless a Boot Guard ACM ran first and left the boot block in cache.","But there is a trick. Real mode can’t reach 4 GiB, so at reset the CPU loads the code segment’s <em>hidden</em> base with <code>FFFF0000</code> while the visible selector says <code>F000</code>. Add <code>IP = FFF0</code> and the first fetch comes from <code>FFFFFFF0</code> — 16 bytes below 4 GiB. An 8086 started at <code>FFFF0</code>, 16 bytes below 1 MiB."],facts:[["First fetch","FFFFFFF0h on Intel since the 386 (AMD Zen: in DRAM, see Stage 2)"],["EDX at reset","000B0671 = this CPU’s family/model/stepping (06-B7-01)"],["Caching","CR0.CD = NW = 1, MTRRs off → uncacheable (no Boot Guard)"]],regs:i=>dr(0),code:{src:"coreboot entry16.S",href:W.entry16[1],lines:Yi,at:()=>0,title:"Next to execute"},mem:{on:["flash","lapic"],hit:[],note:"no writable memory anywhere"},sources:[W.sdm,W.rplds,W.amd17],lps:()=>xt("real"),act(i,e){e.die("pcore0",.55,L.fetch,"breathe")},labels:[{id:"pcore0",text:"BSP — real mode",hot:!0,color:"#ffb547"}]},{stage:1,title:"Sixteen bytes below 4 GiB",dur:10,real:8e-6,mode:"real",shot:"fetch",inset:{shot:"die",label:"ON THE DIE"},narration:["There is no memory controller set up, no cache, no RAM. The fetch — a whole 64-byte line at a time — leaves the core, crosses the ring and the DMI link to the chipset, whose SPI controller reads it serially from the flash chip at up to 50 MHz. The chipset wires the top 16 MiB below 4 GiB to the BIOS region of that chip.","Only 16 bytes fit between <code>FFFFFFF0</code> and the end of the address space, so the code there just jumps somewhere roomier (EDK2 puts two NOPs before its jump). coreboot’s is 3 bytes, <code>E9 0D F4</code>: a <em>near</em> jump that wraps around inside the 64 KiB segment to <code>FFFFF400</code> without touching CS, so the hidden base survives."],facts:[["One 64-byte flash read","≈ 3 µs (quad I/O) to 11 µs (single-bit) at 50 MHz; slower at lower clocks"],["Path","core → ring → system agent → DMI → PCH → SPI → flash"],["Lower bound","≥ 3 µs per fresh 64-byte line (50 MHz quad I/O) — 6× the thread’s 500 ns already"]],regs:i=>dr(i<.7?0:1/Zi.length+.001),code:{src:"coreboot entry16.S",href:W.entry16[1],lines:Yi,at:i=>i<.7?0:1},mem:{on:["flash","lapic"],hit:["flash"]},sources:[W.sdm,W.pchds,W.flash,W.entry16,W.bootblockld],lps:()=>xt("real"),act(i,e){e.die("sub:pcore0:decode|l1i_ctl|branch|ucode_opcache",1,L.fetch,"scan"),e.die("pcore0",.5,L.fetch,"glow"),e.ring(.8,L.fetch),e.flow("f","pcore0","dmi",5,L.fetch,5),e.bus("dmi",.9,L.fetch,{rate:8,speed:70}),e.bus("spi",1,L.fetch,{rate:10,speed:25,dir:-1}),e.bus("dmi",.9,L.fetch,{rate:6,speed:70,dir:-1}),e.board("spi",1,L.fetch,"scan"),e.board("pch",.6,L.fetch,"glow")},labels:[{id:"spi",text:"FFFFFFF0 lives here",hot:!0},{id:"pch",text:"SPI controller"}]},{stage:1,title:"An 8086 costume over a 386",dur:12,real:25e-6,mode:"real",shot:"die",inset:{shot:"fetch",label:"EVERY FETCH GOES TO FLASH"},narration:["The code that follows wears 1978 clothes but uses 1985 parts. A <code>66h</code> prefix lets 16-bit code touch 32-bit registers; <code>mov %cr3</code>, <code>lgdtl</code> and <code>lidt</code> belong to the 286 and 386. Watch the era tags.","There is still no stack, so nothing can be <code>call</code>ed — coreboot parks the self-test result in EBP, and EDK2’s reset vector parks it in the stack pointer itself because there is no stack to point at. An <code>out</code> to port 80h sends POST code <code>01</code> across DMI, the BIOS’s first visible sign of life."],facts:[["Real-mode prologue","21 instructions (coreboot), 17 (EDK2 VTF0), 29 (Intel’s Alder Lake reference)"],["Instructions newer than the 8086 here","12 of 21 — just over half"]],regs:i=>dr((1+i*13)/Zi.length+.001),code:{src:"coreboot entry16.S",href:W.entry16[1],lines:Yi,at:i=>Math.min(13,1+Math.floor(i*13))},mem:{on:["flash","lapic"],hit:["flash"]},sources:[W.entry16,W.vtf0,W.adlSec,W.sdm],lps:()=>xt("real"),act(i,e,t){e.die("sub:pcore0:decode|l1i_ctl|branch|ucode_opcache",.9,L.fetch,"scan"),e.die("pcore0",.5,L.fetch,"glow"),e.ring(.6,L.fetch),e.flow("f","pcore0","dmi",3,L.fetch,5),e.bus("dmi",.8,L.fetch,{rate:5,speed:70}),e.bus("spi",.8,L.fetch,{rate:6,speed:25,dir:-1}),e.board("spi",.8,L.fetch,"scan");const n=nt(i,.25,.4);e.board("pch",.4+n*.6,"#ffffff","glow")},labels:[{id:"pcore0",text:"BSP — real mode",hot:!0,color:"#ffb547"}]},{stage:1,title:"One bit, one far jump",dur:11,real:2e-5,mode:i=>i<.86?"real":"prot",shot:"dieLeft",inset:{shot:"fetch",label:"OUT OVER DMI → CHIPSET → SPI FLASH"},narration:["Load a tiny table from flash — the GDT — describing flat 4 GiB code and data segments (plus a 64-bit code segment it won’t use here). Set bit 0 of CR0, <em>Protection Enable</em>. Then make the first far jump: selector <code>08h</code> is looked up in the new table, and CS becomes base 0, limit 4 GiB, 32-bit.","That’s it — real mode is over after about twenty instructions. LaurieWired’s “15–30 instructions” is right on: 21 in coreboot, 17 in EDK2’s generic reset vector, 29 in Intel’s Alder Lake reference code."],note:{tag:"Thread check",html:"“500 ns (ish)” is plausible only when Boot Guard has pre-loaded this code into cache and nothing waits on a port-80 write. Fetched uncached from SPI flash, 21 instructions take more like <em>15–60 µs</em> (an estimate — no one seems to have published a measurement). And the stack isn’t built here: real mode only loads a GDT and flips PE. The writable stack comes next, in 32-bit mode."},facts:[["Time in real mode","≈ 15–60 µs uncached; ≈ 1 µs if Boot Guard cached it, as the port-80 write still crosses DMI (both estimates)"],["Leaves with","caches still off, still no RAM, still no stack"]],regs:i=>dr((14+i*8.14)/Zi.length+.001),code:{src:"coreboot entry16.S",href:W.entry16[1],lines:Yi,at:i=>S_(Math.min(20,14+Math.floor(i*8.14)))},mem:{on:["flash","lapic"],hit:["flash"]},sources:[W.entry16,W.gdt,W.sdm,W.thread],lps:i=>xt(i<.86?"real":"prot"),act(i,e){const t=Ye(i,.84,.95);e.die("pcore0",.6+t*.4,t>.5?"#4fe08a":L.fetch,t>0?"scan":"glow"),e.die("sub:pcore0:decode|l1i_ctl|branch|ucode_opcache",.8,L.fetch,"scan"),e.ring(.5,L.fetch),e.flow("f","pcore0","dmi",3,L.fetch,5)},labels:[{id:"pcore0",text:"BSP",hot:!0}]}],In=["llc0","llc1","llc2","llc3","llc4","llc5","llc6","llc7","llc8","llc9","llc10","llc11"],wc=["pcore1","pcore2","pcore3","pcore4","pcore5","pcore6","pcore7","ecl0","ecl1","ecl2","ecl3"],Pn={on:["flash","lapic","car"],hit:["car","flash"],note:"no DRAM yet"},So=["check_mtrr:","	/* Use the MTRR default type MSR as a proxy for detecting INIT#.","	 * Reset the system if any known bits are set in that MSR. That is","	 * an indication of the CPU not being properly reset. */","check_for_clean_reset:","	movl	$MTRR_DEF_TYPE_MSR, %ecx","	rdmsr","	andl	$(MTRR_DEF_TYPE_EN | MTRR_DEF_TYPE_FIX_EN), %eax","	cmp	$0, %eax","	jnz	warm_reset",{i:"	jmp	*%esp",why:"“return”: the caller put its return address in ESP — there is no stack yet"}],Tc=["	/* Configure default memory type to uncacheable (UC) */","	mov	$MTRR_DEF_TYPE_MSR, %ecx","	rdmsr","	/* Clear enable bits and set default type to UC. */","	and	$~(MTRR_DEF_TYPE_MASK | MTRR_DEF_TYPE_EN | \\","		 MTRR_DEF_TYPE_FIX_EN), %eax","	wrmsr","	...",{i:"	find_free_mtrr",why:"macro: leaves ECX = first free variable MTRR (200h after the wipe)"},"	...","	/* Configure CAR region as write-back (WB) */",{i:"	mov	$CONFIG_DCACHE_RAM_BASE, %eax",why:"CONFIG_DCACHE_RAM_BASE = 0xFEF00000 on Alder/Raptor Lake"},"	or	$MTRR_TYPE_WRBACK, %eax","	xor	%edx,%edx","	wrmsr","	incl	%ecx","	mov	$(512 * KiB), %eax	/* size mask */","	...                              # write mask 0, then again for +256 KiB","	/* Enable variable MTRRs */","	mov	$MTRR_DEF_TYPE_MSR, %ecx","	rdmsr","	or	$MTRR_DEF_TYPE_EN, %eax","	wrmsr","	/* Enable caching */","	mov	%cr0, %eax","	and	$~(CR0_CD | CR0_NW), %eax","	invd","	mov	%eax, %cr0"],Ac=["car_nem_enhanced:","	/* Disable cache eviction (setup stage) */","	mov	$MSR_EVICT_CTL, %ecx","	rdmsr","	or	$0x1, %eax","	wrmsr","	...                                  # size the LLC, pick data ways, SF masks","	/* Set MSR 0xC85 L3_Protected_ways = ((1 << data ways) - 1) */","	mov	%esi, %eax","	xorl	%edx, %edx","	mov	$IA32_L3_PROTECTED_WAYS, %ecx","	wrmsr","	...                                  # EAX = every way but the data way","	movl	$IA32_L3_MASK_1, %ecx","	xorl	%edx, %edx","	wrmsr","	...","	mov	%esi, %eax","	movl	$IA32_L3_MASK_2, %ecx","	xorl	%edx, %edx","	wrmsr","	...","	movl	$IA32_PQR_ASSOC, %ecx","	...",{i:"	movl	$0x02, %edx",why:"class of service 2: fills may use only the data way"},"	...","	wrmsr",{i:"	clear_car",why:"macro: rep stosl of zeros over the 768 KiB window"},"	...","	movl	$IA32_PQR_ASSOC, %ecx","	...",{i:"	movl	$0x01, %edx",why:"class of service 1: every way but the data way"},"	...","	wrmsr","	...","	/*","	 * Enable No-Eviction Mode Run State by setting","	 * NO_EVICT_MODE MSR 2E0h bit [1] = '1'.","	 */","	movl	$MSR_EVICT_CTL, %ecx","	rdmsr","	orl	$0x02, %eax","	wrmsr"],Eo=["car_init_done:","	post_code(POSTCODE_SOC_CAR_INIT_DONE)","	/* Setup bootblock stack */","	mov	$_ecar_stack, %esp","	...","	/* Copy .data section content to Cache-As-Ram */","#include <cpu/x86/copy_data_section.inc>","before_carstage:","	post_code(POSTCODE_SOC_BEFORE_CARSTAGE)",{i:"	call	bootblock_c_entry",why:"the firmware’s first CALL since the reset vector"}],Rc=["static void smbus_read_spd5(u8 *spd, u8 spd_addr, u16 size)","{","	u8 page = ~0;",{i:"	u32 max_page_size = MAX_SPD_PAGE_SIZE_SPD5;",why:"MAX_SPD_PAGE_SIZE_SPD5 = 128: the hub shows 128 bytes at a time"},"	...","	for (int i = 0; i < size; i++) {","		u8 next_page = (u8) (i / max_page_size);","		if (next_page != page) {",{i:"			switch_page(spd_addr, next_page);",why:"writes the page number into the hub’s MR11"},"			page = next_page;","		}","		unsigned int byte_addr = SPD_HUB_MEMREG(i % max_page_size);","		spd[i] = smbus_read_byte(spd_addr, byte_addr);","	}","}"],wo=["	data = mrc_cache_current_mmap_leak(MRC_TRAINING_DATA, version,","					   &mrc_size);","	if (data == NULL)","		return;","	/* MRC cache found */","	arch_upd->NvsBufferPtr = (uintptr_t)data;","	...","	/* Configure bootmode */","	if (s3wake) {","		arch_upd->BootMode = FSP_BOOT_ON_S3_RESUME;","	} else {","		if (arch_upd->NvsBufferPtr)","			arch_upd->BootMode =","				FSP_BOOT_ASSUMING_NO_CONFIGURATION_CHANGES;","		else","			arch_upd->BootMode = FSP_BOOT_WITH_FULL_CONFIGURATION;","	}"],To=["	const uint16_t wl_start = 192;","	const uint16_t wl_stop  = 192 + 128;","	const uint16_t wl_step  = 2;","	...                         # for each rank:","	for (uint16_t wl_delay = wl_start; wl_delay < wl_stop; wl_delay += wl_step) {","		...                       # for each channel with this rank:","		for (uint8_t byte = 0; byte < ctrl->lanes; byte++) {","			update_txt(ctrl, channel, rank, byte, TXT_TXDQS,","				wl_delay);","		}","		...","		io_reset();","		udelay(wait_time_us);","		...                       # for each channel with this rank:","		for (uint8_t byte = 0; byte < ctrl->lanes; byte++) {","			const uint32_t feedback =","				get_data_train_feedback(channel, byte);","			const bool pass = (feedback & 0x1ff) >= 16;","			...","			phase_record_pass(&region_data[channel][byte],","				pass, wl_delay, wl_start, wl_step);","		}","		...","	}"],Ao=["	for (int32_t offset = m_start; offset <= m_stop; offset += m_step) {","		...","		change_1d_margin_multicast(ctrl, param, offset, 0, false,","			REG_FILE_USE_START);","		run_io_test(ctrl, chanmask, ctrl->dq_pat, 1);","		for (uint8_t channel = 0; channel < NUM_CHANNELS; channel++) {","			...","			/* Read out byte group error results and update limit */","			const uint16_t result = get_byte_group_errors(channel);","			...","			for (uint8_t byte = 0; byte < ctrl->lanes; byte++) {","				const bool pass = !(result & BIT(byte));",'				printk(MARGIN_1D_PLOT, pass ? ". " : "# ");',"				linear_record_pass(&region_data[channel][byte],","					pass, offset, m_start, m_step);","			}","		}","	}"],w_=["/* Raptor Lake-S FSP-M training switches (FspmUpd.h): */","/* a selection from ~50, shared with DDR4/LPDDR; */","/* run order isn’t public */","ECT        Early Command Training","SOT        SenseAmp Offset Training","ERDMPRTC2D Early ReadMPR Timing Centering 2D","RCVET      Receive Enable Training","JWRL       Jedec Write Leveling","EWRTC2D    Early Write Time Centering 2D","ERDTC2D    Early Read Time Centering 2D","WRTC1D     Write Timing Centering 1D","WRVC1D     Write Voltage Centering 1D","RDTC1D     Read Timing Centering 1D","DIMMODTT   Dimm ODT Training","DIMMRONT   DIMM RON Training","WRDSEQT    Write Drive Strength/Equalization 2D","RDEQT      Read Equalization Training","CMDVC      Command Voltage Centering","LCT        Late Command Training","RTL        Round Trip Latency Training","TAT        Turn Around Timing Training","DCC        Duty Cycle Correction Training","DIMMDFE    DIMM DFE Training","DRAMDCA    DRAM DCA Training","VDDQT      Vddq Training","MEMTST     Memory Test","ALIASCHK   DIMM SPD Alias Test"],T_=[" * +---------------------------+ TOUUD"," * |                           |"," * +---------------------------+ TOM (if mem > 4GB)"," * | CSME UMA (if mem > 4 GiB) |"," * +---------------------------+ TOUUD"," * |                           |"," * +---------------------------+ 4GiB"," * | PCI Address Space         |"," * +---------------------------+ TOM (if mem < 4GB)"," * | CSME UMA (if mem < 4 GiB) |"," * +---------------------------+ TOLUD (also maps into MC address space)"," * | iGD / DSM                 |"," * +---------------------------+ BDSM"," * | GTT / GSM                 |"," * +---------------------------+ TOLM"," * | TSEG                      |"," * +---------------------------+ TSEGMB"," * | DMA Protected Region      |"," * +---------------------------+ DPR"," * | PRM (C6DRAM/SGX)          |"," * +---------------------------+ PRMRR"," * | ...                       |"," * +---------------------------+ 0"],Ro=["	/* Make sure _cbmem_top_ptr hits dram before invd */","	...","	clflush	_cbmem_top_ptr","	...","	/* chipset_teardown_car() is expected to disable cache-as-ram. */","	call	chipset_teardown_car","	...                          # inside it (soc exit_car.S):","	/* Disable MTRRs. */","	...","	/* invalidate cache contents. */","	invd","	/* Knock down bit 1 then bit 0 of NEM control not combining steps. */","	mov	$(MSR_EVICT_CTL), %ecx","	rdmsr","	and	$(~(1 << 1)), %eax","	wrmsr","	and	$(~(1 << 0)), %eax","	wrmsr","	...                          # CLOS 0, C85h = 0, return","	/* Enable caching if not already enabled. */","	...                          # 64-bit build variant","	mov	%cr0, %eax","	and	$(~(CR0_CD | CR0_NW)), %eax","	mov	%eax, %cr0","	...","	/* Ensure cache is clean. */","	invd",{i:"	movl	$_estack, %esp",why:"the stack moves into DRAM"},"	...","	call	postcar_mtrr_setup","	...","	call main"],Kh=[".code16",".global _start","_start:","	cli","	xorl	%eax, %eax","	movl	%eax, %cr3    /* Invalidate TLB*/","	/* On hyper threaded cpus, invalidating the cache here is","	 * very very bad.  Don't.","	 */","	/* setup the data segment */","	movw	%cs, %ax","	movw	%ax, %ds","	...","	movl	$(gdtaddr), %ebx","	sub	$(_start), %ebx","	lgdtl	(%ebx)","	movl	%cr0, %eax","	andl	$~CR0_CLEAR_FLAGS, %eax",{i:"	orl	$CR0_SET_FLAGS, %eax",why:"CR0_SET_FLAGS = PE | CD | NW: protected mode on, caches explicitly kept off"},"	movl	%eax, %cr0","	ljmpl	$GDT_CODE_SEG, $1f","1:","	.code32","	...                         # flat data segments, IDT","1:","	/* Obtain CPU number. */","	movl	ap_count, %ecx","	inc	%ecx","	lock cmpxchg %ecx, ap_count","	jnz	1b","	/* Setup stacks for each CPU. */","	...                         # microcode check, copy BSP MTRRs","	/* Enable caching. */","	...                         # then call into C: ap_init()","halt_jump:","	hlt","	jmp	halt_jump"],Cc=Kh.length-4,Co={tag:"Normal boot",html:"This step runs on a <em>first</em> boot, or after new DIMMs, a BIOS update, changed memory settings or a CMOS clear. On a normal boot the saved results are written straight back instead — use the <b>normal boot / first boot</b> switch by the clock to compare (how first-boot time splits across these steps is our estimate)."};function zi(i,e,t,{chips:n,phy:s=1}={}){i.die("pcore0",.55,L.fetch,"glow"),i.die("sub:pcore0:l1d|l2|load_store",.6,L.car,"pinned");for(const r of In)i.die(r,.4,L.car,"stripe");i.die("imc0",.8*s,L.train,"sparkle"),i.die("imc1",.8*s,L.train,"sparkle"),i.die("ddrphy",1*s,L.train,"sparkle"),i.ring(.35,L.train),i.flow("mmio0","pcore0","imc0",3,L.train,6),i.flow("mmio1","pcore0","imc1",3,L.train,6),i.flow("trainA","imc0","dram0",5*s,L.train,6),i.flow("trainB","imc1","dram1",5*s,L.train,6),i.bus("ddrA",.9*s,L.train,{rate:26,speed:80}),i.bus("ddrB",.9*s,L.train,{rate:26,speed:80}),n&&i.chips(n,L.train)}const A_=["U8Ptr       = (UINT8 *)(UINTN)(SMM_DEFAULT_SMBASE + SMM_HANDLER_OFFSET);","...","// Backup original contents at address 0x38000","...","for (Index = 0; Index < mNumberOfCpus; Index++) {","  ...","  if (BspApicId != (UINT32)ProcessorInfo.ProcessorId) {","    mRebased = FALSE;","    mSmBase  = GetSmBase (Index, SmmRelocationStart, TileSize);","    SendSmiIpi ((UINT32)ProcessorInfo.ProcessorId);","    //","    // Wait for this AP to finish its 1st SMI","    //","    while (!mRebased) {","    }","  } else {","    //","    // BSP will be Relocated later","    //","    BspIndex = Index;","  }","}","...","mSmBase  = GetSmBase (BspIndex, SmmRelocationStart, TileSize);","SendSmiIpi (BspApicId);"],R_=[{stage:2,title:"A 386 with nowhere to put anything",dur:10,real:2e-5,mode:"prot",shot:"dieLeft",inset:{shot:"fetch",label:"OUT OVER DMI → CHIPSET → SPI FLASH"},narration:["The far jump lands in 32-bit flat protected mode: one segment spanning all 4 GiB, base 0. It is a 386 now — but it still has no RAM. The DIMMs are untrained, flash is read-only, and — unless a Boot Guard ACM left this code in cache — every fetch crawls in from the SPI chip uncached.","So the early code is written without a stack. coreboot saves the self-test result and the timestamp counter in <em>MMX registers</em>, and “calls” its sanity checks by first loading the return address into ESP and ending them with <code>jmp *%esp</code>. Here it checks that the CPU really was reset: if the MTRRs were already enabled, something did a warm INIT instead, so it resets the platform properly through port <code>CF9h</code>."],facts:[["Segments","flat: base 0, limit 4 GiB, 32-bit"],["Memory","none writable; code uncached from flash unless Boot Guard cached it"],["Scratch storage","registers only — even MMX (1997) registers"]],code:{src:"coreboot src/cpu/x86/early_reset.S",href:W.entry32[1].replace("entry32.S","early_reset.S"),lines:So,at:i=>Math.min(So.length-1,Math.floor(Ye(i,.15,.95)*So.length))},mem:{on:["flash","lapic"],hit:["flash"],note:"still nothing writable"},sources:[W.entry32,W.sdm],lps:()=>xt("prot"),act(i,e){e.die("pcore0",.7,"#4fe08a","glow"),e.die("sub:pcore0:decode|l1i_ctl|branch|ucode_opcache",.8,L.fetch,"scan"),e.ring(.5,L.fetch),e.flow("f","pcore0","dmi",3,L.fetch,5)},labels:[{id:"pcore0",text:"BSP — 32-bit protected mode",hot:!0,color:"#4fe08a"}]},{stage:2,title:"Borrowing the cache, part 1: lie about an address",dur:12,real:2e-5,mode:"prot",shot:"llc",narration:["C code needs a stack and writable globals. The only fast, writable storage on the chip is its cache — so the firmware borrows it. First it picks an address range where nothing will ever exist: <code>FEF00000</code>, in the hole just above the local APIC and below the flash window.","It wipes the memory-type range registers (MTRRs) to “uncacheable”, then marks that window as <em>write-back</em> with two variable MTRRs (512 KiB + 256 KiB = 768 KiB), enables the MTRRs, and clears CR0’s CD and NW bits — after an <code>INVD</code> to throw away anything stale. The cache is now on, and willing to hold an address range that has no memory behind it."],facts:[["CAR window","FEF00000–FEFBFFFF (768 KiB, coreboot on ADL/RPL)"],["Elsewhere","Intel’s FSP and EDK2 reference: 1 MiB at the same base"],["Physical address bits","46 on a typical i9-13900K (CPUID 80000008h; some systems report fewer)"]],regs:i=>({title:"MSRs written (i9-13900K, coreboot defaults)",rows:[["MTRR_DEF_TYPE (2FFh)",i>.7?"E=1 · default UC":"E=0 · UC",i>.7&&i<.85?"hot wide":"wide"],["PHYSBASE0 (200h)",i>.3?"00000000_FEF00006 (WB)":"0",i>.3&&i<.5?"hot wide":"wide"],["PHYSMASK0 (201h)",i>.4?"00003FFF_FFF80800 (512 KiB)":"0","wide"],["PHYSBASE1 (202h)",i>.5?"00000000_FEF80006 (WB)":"0",i>.5&&i<.7?"hot wide":"wide"],["PHYSMASK1 (203h)",i>.5?"00003FFF_FFFC0800 (256 KiB)":"0","wide"],["CR0",i>.85?"…CD=0 NW=0 (caches on)":"60000011 (CD=1 NW=1)",i>.85?"hot wide":"wide"]]}),code:{src:"coreboot …/car/cache_as_ram.S",href:"https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/cpu/car/cache_as_ram.S",lines:Tc,at:i=>Math.min(Tc.length-1,br(i,[[.05,0],[.3,14],[.4,17],[.62,18],[.7,22],[.85,27]]))},mem:{on:["flash","lapic","car"],hit:["car"],note:"a window with nothing behind it"},sources:[W.adlKconfig,W.sdm],lps:()=>xt("prot"),act(i,e){e.die("pcore0",.7,"#4fe08a","glow"),e.die("sub:pcore0:decode|l1i_ctl|branch|ucode_opcache",.6,L.fetch,"scan");const t=Ye(i,.85,1);for(const n of In)e.die(n,.12+t*.15,L.car,"breathe");e.die("sub:pcore0:l1d|l2",.2+t*.3,L.car,"breathe")},labels:[{id:"llc2",text:"L3 slices: 12 × 3 MB",from:.4}]},{stage:2,title:"Borrowing the cache, part 2: No-Eviction Mode",dur:13,real:3e-4,mode:"prot",shot:"llc",narration:["A normal cache evicts old lines by writing them back to memory. Here there is no memory, so an evicted line would simply vanish. Intel’s fix is <em>No-Eviction Mode</em> (MSR <code>2E0h</code>): in its “setup” state the firmware writes zeros over the whole 768 KiB window — 12,288 cache lines, each now allocated and marked modified — then flips it to “run”, and those lines can no longer be chosen as victims.","On Raptor Lake it is surgical (“enhanced NEM”). The 36 MB L3 has 12 ways; firmware reserves just <em>one</em> for its data, via class-of-service way masks, and leaves the other eleven as an ordinary cache for code streaming in from flash. Because the L3 hashes addresses across its 12 slices, the pinned data is almost certainly spread over all of them — drawn here, schematically, as a thin stripe in every slice."],note:{tag:"Thread check",html:"“Temporarily uses L2/L3 cache-as-RAM … Intel calls this NEM” — yes. The guarantee is enforced in the L3 and its snoop filter while the BSP’s own L1/L2 hold the hot data, so “L2/L3” is fair. AMD Zen has no such stage at all: its ARM security processor trains DRAM before any x86 core runs."},facts:[["LLC (CPUID leaf 4)","12 ways × 49,152 sets × 64 B = 36 MiB"],["Ways pinned for CAR","1 of 12 (mask 0x001); “effective way size” 2 MiB ≥ 768 KiB"],["Lines touched","12,288 (rep stosl of 196,608 dwords)"]],regs:i=>({title:"MSRs written, in order",note:"most are model-specific, not in the SDM",rows:[["2E0h NEM",i>.85?"setup + RUN":i>.05?"setup":"0",i>.05&&i<.12||i>.85?"hot":""],["1892h / 1891h SF masks",i>.12?"0x001 · other snoop-filter ways":"—",i>.12&&i<.2?"hot":""],["C85h L3 protected ways",i>.2?"0x001":"—",i>.2&&i<.27?"hot":""],["C91h L3 mask 1",i>.27?"0xFFE (code ways)":"—",i>.27&&i<.33?"hot":""],["C92h L3 mask 2",i>.33?"0x001 (data way)":"—",i>.33&&i<.4?"hot":""],["C8Fh PQR_ASSOC",i>.78?"CLOS 1":i>.4?"CLOS 2 (fill)":"—",i>.4&&i<.8?"hot":""],["lines filled",`${Math.floor(Ye(i,.42,.75)*12288).toLocaleString("en-US")} / 12,288`,i>.42&&i<.76?"hot":""]]}),code:{src:"coreboot …/car/cache_as_ram.S",href:"https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/cpu/car/cache_as_ram.S",lines:Ac,at:i=>Math.min(Ac.length-1,br(i,[[0,0],[.05,5],[.08,6],[.16,7],[.2,11],[.23,12],[.27,15],[.33,20],[.4,26],[.42,27],[.75,28],[.78,33],[.8,34],[.85,42]]))},mem:{on:["flash","lapic","car"],hit:["car"],note:"cache pinned as RAM"},sources:[W.amd17,W.adlKconfig,W.sdm],lps:()=>xt("prot"),act(i,e){e.die("pcore0",.7,"#4fe08a","glow");const t=Ye(i,.42,.75),n=Ye(i,.8,.95);for(let s=0;s<In.length;s++){const r=Ye(t*12,s,s+1);e.die(In[s],.15+r*.7+n*.25,L.car,"stripe")}if(e.die("sub:pcore0:l1d|l2|load_store",.3+t*.5,L.car,"pinned"),t>0&&t<1){e.ring(.8,L.car);for(const s of["llc0","llc3","llc5","llc8","llc10","llc11"])e.flow(`fill-${s}`,"pcore0",s,4,L.car,6)}},labels:[{id:"llc1",text:"one way of 12, pinned (placement schematic)",from:.5}]},{stage:2,title:"The first stack, the first call",dur:11,real:.012,mode:"prot",shot:"dieLeft",inset:{shot:"fetch",label:"OUT OVER DMI → CHIPSET → SPI FLASH"},narration:["Now there is RAM — 768 KiB of it, made of cache. The stack pointer is set to the top of its 544 KiB slice of the window and, for the first time since the reset vector, the CPU executes a <code>call</code>. From here on it is C.","The first C code marks the BIOS region of flash <em>write-protect</em> cacheable, so code finally stops crawling in a line at a time: it streams into the eleven free L3 ways and can be dropped and refetched at will. Everything before memory exists now lives on this borrowed stack — coreboot’s bootblock and romstage, or UEFI’s SEC and PEI, and Intel’s memory-training code, which needs at least 284 KB of stack (coreboot budgets 512 KiB)."],facts:[["CAR budget (coreboot ADL/RPL)","544 KiB stack · 128 KiB FSP-M heap · console, timestamps, caches"],["Code","executes in place from flash, cached WP"],["Time on a normal boot","FSP-M with saved training ≈ 46–105 ms (Meteor Lake Chromebook)"]],code:{src:"coreboot …/car/cache_as_ram.S",href:"https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/cpu/car/cache_as_ram.S",lines:Eo,at:i=>Math.min(Eo.length-1,Math.floor(Ye(i,.05,.6)*Eo.length))},mem:Pn,sources:[W.adlKconfig,W.fspapi],lps:()=>xt("prot"),act(i,e){e.die("pcore0",.8,"#4fe08a","glow"),e.die("sub:pcore0:l1d|l2|load_store",.7,L.car,"pinned");for(const n of In)e.die(n,.45,L.car,"stripe");const t=Ye(i,.45,.6);if(e.ring(.4+t*.4,L.fetch),e.flow("code","dmi","pcore0",2+t*8,L.fetch,7),t>0)for(const n of["llc1","llc2","llc6","llc9"])e.flow(`wp-${n}`,"dmi",n,2*t,L.fetch,7);e.bus("dmi",.6,L.fetch,{rate:4+t*10,speed:80,dir:-1})},labels:[{id:"pcore0",text:"call bootblock_c_entry",hot:!0}]},{stage:2,title:"Who’s plugged in?",dur:11,real:{normal:.02,first:.4},mode:"prot",shot:"spd",inset:{shot:"imc",label:"ON THE DIE"},narration:["Before training anything, the firmware asks each DIMM what it is. On every DDR5 module sits an <em>SPD hub</em> holding 1 KiB: DRAM type, size, ranks, chip width, speed bins and timings, XMP profiles. The chipset’s SMBus controller (PCI device 00:1F.4) reads it one byte at a time over two wires, flipping 128-byte pages through a register in the hub.","A DDR5 DIMM is really two independent 32-bit sub-channels, so the code hands each DIMM’s data to both halves. Two DIMMs on Raptor Lake: 2 channels × 2 sub-channels × 32 bits = 128 data lines, each byte with its own strobe — sixteen byte lanes to train."],facts:[["SPD5 hub","1 KiB, I²C up to 1 MHz or I3C up to 12.5 MHz"],["Read cost","coreboot reads 512 B: ≈ 0.2 s per DIMM at 100 kHz (estimate); with its SPD cache, later boots read just the serial number"],["This system","2 DIMMs · 4 sub-channels · 128 DQ lines"]],code:{src:"coreboot …/smbus/smbuslib.c",href:W.smbuslib[1],lines:Rc,at:i=>Math.min(Rc.length-1,5+Math.floor(Ye(i,.1,.9)*8))},mem:Pn,sources:[W.smbuslib,W.rambus,W.micron],lps:()=>xt("prot"),act(i,e,t){e.die("pcore0",.6,L.fetch,"glow");for(const n of In)e.die(n,.35,L.car,"stripe");e.flow("smb","pcore0","dmi",3,L.mgmt,6),e.bus("dmi",.6,L.mgmt,{rate:6,speed:80}),e.board("pch",.6,L.mgmt,"scan"),e.bus("smbus",1,L.mgmt,{rate:10,speed:30}),e.bus("smbus",.8,L.mgmt,{rate:6,speed:30,dir:-1}),e.dimmPart("spd",.6+.4*Math.sin(t*9),L.mgmt),e.board("dimmA",.3,L.mgmt,"scan"),e.board("dimmB",.3,L.mgmt,"scan")},labels:[{id:"pch",text:"SMBus controller (00:1F.4)"},{id:"dimmA",text:"SPD hub: 1 KiB of “what am I”",hot:!0},"dimmB"]},{stage:2,title:"Train — or remember?",dur:10,real:.002,mode:"prot",shot:"fetch",narration:["Training results — thousands of delay, voltage and equalizer settings — are saved in the flash chip later in any boot whose training succeeded (Chromebooks reserve a 64 KB slot for them; Intel’s open EDK2 platform code keeps them in a UEFI variable). If a matching copy exists, the firmware hands it to Intel’s memory code with the instruction “assume nothing changed”.","New DIMMs, a different BIOS version, changed memory settings or a cleared CMOS invalidate it, and the full training below runs instead. That — not the CPU — is what makes a first boot with new memory sit on a black screen; coreboot’s optional early-display mode even puts up a wait message (“Please wait for RAM to be initialized...”) so you don’t think it hung."],facts:[["Saved where","SPI flash (coreboot RW_MRC_CACHE; Intel EDK2 MinPlatform “FspNvsBuffer” variable; AMI’s isn’t public)"],["Retrain triggers","DIMM change, BIOS/FSP update, setting change, CMOS/RTC power loss"]],regs:(i,e)=>({title:"FSP-M boot mode",rows:[["NvsBufferPtr",(e==null?void 0:e.bootKind)==="first"?"0 (no saved data)":"→ saved training data","wide hot"],["BootMode",(e==null?void 0:e.bootKind)==="first"?"FSP_BOOT_WITH_FULL_CONFIGURATION":"FSP_BOOT_ASSUMING_NO_CONFIGURATION_CHANGES","wide hot"]]}),code:{src:"coreboot drivers/intel/fsp2_0/memory_init.c",href:W.meminit[1],lines:wo,at:i=>Math.min(wo.length-1,Math.floor(Ye(i,.05,.95)*wo.length))},mem:Pn,sources:[W.meminit,W.fspm],lps:()=>xt("prot"),act(i,e){e.die("pcore0",.6,L.fetch,"glow");for(const t of In)e.die(t,.35,L.car,"stripe");e.flow("mrc","dmi","pcore0",4,L.fetch,6),e.bus("dmi",.7,L.fetch,{rate:6,speed:80,dir:-1}),e.bus("spi",.9,L.fetch,{rate:10,speed:25,dir:-1}),e.board("spi",.9,L.fetch,"scan"),e.board("pch",.5,L.fetch,"glow")},labels:[{id:"spi",text:"saved training data lives here",hot:!0}]},{stage:2,title:"Waking the DRAM chips",dur:10,real:.006,mode:"prot",shot:"dimms",inset:{shot:"imc",label:"MEMORY CONTROLLERS + DDR5 PHY"},narration:["Each DIMM makes its own DRAM voltages from the board’s 5 V with an on-module power-management chip (PMIC): 1.1 V for the chips and their I/O, 1.8 V for word-line pumping. The controller holds the DRAMs in reset for at least 200 µs, releases it, then by JEDEC rule waits at least 4 ms before driving chip-select high, starts the clocks, and issues its first configuration commands.","Then <em>ZQ calibration</em>: each DRAM compares its output drivers and on-die termination against a precision 240 Ω resistor, so every chip speaks with the right impedance whatever its temperature or manufacturing spread."],facts:[["DDR5 rails","VDD = VDDQ = 1.1 V, VPP = 1.8 V (from the DIMM’s PMIC)"],["JEDEC timings","RESET_n low ≥ 200 µs · CS_n low ≥ 4 ms after reset · ZQCAL ≥ 1 µs"],["Happens on","every boot, normal or first"]],mem:Pn,sources:[W.micron,W.rambus],lps:()=>xt("prot"),act(i,e,t){zi(e,i,t,{phy:.6,chips:(n,s,r,a)=>i>.35?.35+.25*Math.sin(t*3):.05}),e.dimmPart("pmic",.9,L.power),e.board("dimmA",.3,L.power,"breathe"),e.board("dimmB",.3,L.power,"breathe")},labels:[{id:"dimmA",text:"PMIC: 5 V → 1.1 V / 1.8 V",hot:!0},"dimmB"]},{stage:2,title:"Teaching the commands to land",dur:11,real:{normal:0,first:4},mode:"prot",shot:"dimms",inset:{shot:"imc",label:"MEMORY CONTROLLERS + DDR5 PHY"},narration:["At DDR5-5600 a data bit lasts 178.6 picoseconds — about the time light takes to cross 5 cm, and a signal on a circuit board covers roughly half that. The chips sample command pins once per 357 ps clock, but the controller doesn’t yet know where inside that clock they sample, so even its configuration writes are unreliable.","DDR5 provides loop-back modes for this. In <em>CS training</em> and <em>CA training</em> the DRAM samples the chip-select and address pins and echoes the result back on its data pins; the controller slides its command timing (and the reference voltage the chips compare against) until the echoes come back right."],note:Co,facts:[["1 UI at DDR5-5600","178.6 ps (clock: 357 ps)"],["VrefCA / VrefCS","126 codes, 0.5 % of VDDQ (≈ 5.5 mV) each"],["Intel’s name","ECT — Early Command Training"]],mem:Pn,sources:[W.micron,W.fspm],lps:()=>xt("prot"),act(i,e,t){zi(e,i,t,{chips:(n,s,r,a)=>s===0?Math.sin(t*7+r*1.7+a*.4)>.2?.9:.25:.08}),e.bus("ddrA",.9,L.fetch,{rate:10,speed:70,dir:-1}),e.bus("ddrB",.9,L.fetch,{rate:10,speed:70,dir:-1})},labels:[{id:"dimmA",text:"rank 0: echoing CS / CA on its data pins",hot:!0}]},{stage:2,title:"Learning to read before writing",dur:11,real:{normal:0,first:5},mode:"prot",shot:"dimms",inset:{shot:"imc",label:"MEMORY CONTROLLERS + DDR5 PHY"},narration:["Writes can’t be checked until reads work, and reads can’t be checked without known data. DDR5 solves the chicken-and-egg with a pattern generator in every chip: two 8-bit LFSRs (x⁸+x⁶+x⁵+x⁴+1), seeded through MR26/MR27 and read out with a mode-register read of MR31 — pseudo-random enough to stress crosstalk between neighbouring data lines.","A read-preamble mode makes the chip hold its strobe steady between reads and toggle it only for a short preamble plus the data, so the controller can find exactly when read data starts arriving and open its receivers (“receive enable”) at the right moment. Only then can it centre its sampling point inside each bit."],note:{tag:"Order",html:"JEDEC fixes the order only up to command training. After that each vendor chooses; coreboot’s open re-implementation of Intel’s Haswell memory code runs the reads (receive enable, read pattern) before write leveling. Raptor Lake’s DDR5 order isn’t public. "+Co.html},facts:[["LFSR seeds","MR26 = 0x5A, MR27 = 0x3C (defaults)"],["Intel’s names","RCVET Receive Enable · RDMPRT Read MPR · SOT SenseAmp Offset"]],mem:Pn,sources:[W.micron,W.fspm],lps:()=>xt("prot"),act(i,e,t){zi(e,i,t,{chips:(n,s,r,a)=>s!==Math.min(1,Math.floor(i*2))?.06:Math.sin(t*11+a*1.3+r+n*2)>.4?.9:.2}),e.bus("ddrA",1,L.dram,{rate:30,speed:90,dir:-1}),e.bus("ddrB",1,L.dram,{rate:30,speed:90,dir:-1})},labels:[{id:"dimmB",text:"chips stream an LFSR pattern",hot:!0}]},{stage:2,title:"Write leveling: the fly-by problem",dur:12,real:{normal:0,first:5},mode:"prot",shot:"dimms",eye:{kind:"flyby",title:"Write leveling — one sub-channel",sub:"x8 chips, one rank at a time"},narration:["On a DIMM the clock and command wires visit the chips one after another — a “fly-by” route that keeps the bus clean but means each chip sees its clock edge a little later than the last. Every byte’s write strobe must be delayed by just the right amount to meet <em>its</em> chip’s clock.","So the controller puts the DRAMs in write-leveling mode, sends writes, and nudges each byte’s strobe later in small steps; the chip reports what it saw on a data pin, and the controller locks onto the moment that report flips from 0 to 1. DDR5 adds a second, internal leveling pass for delays inside the chip. One rank at a time."],note:Co,facts:[["Sweep (open Haswell code)","64 delay points per byte lane per rank"],["Intel’s name","JWRL — Jedec Write Leveling"]],code:{src:"coreboot haswell/native_raminit (open DDR3 analogue)",href:W.hswraminit[1],lines:To,at:i=>Math.min(To.length-1,4+Math.floor(i*9%1*(To.length-4)))},mem:Pn,sources:[W.micron,W.hswraminit,W.fspm],lps:()=>xt("prot"),act(i,e,t){zi(e,i,t,{chips:(n,s,r,a)=>{if(s!==Math.min(1,Math.floor(i*2)))return .06;const o=a,l=t*1.6%5;return Math.abs(l-o)<.8?1:.15}})},labels:[{id:"dimmA",text:"clock reaches each chip later",hot:!0}]},{stage:2,title:"Drawing the eye",dur:16,real:{normal:0,first:25},mode:"prot",shot:"imcEye",eye:{kind:"read",title:"Read eye — one byte lane",sub:"DIMM A · sub-channel A · byte 2 · each rank in turn",seed:5},narration:["Now the heart of it. For every byte lane, firmware sweeps the sampling delay and the reference voltage, and at each point fires a burst of test traffic generated by hardware in the memory controller — a pattern generator and checker (Intel’s names for it include REUT and CPGC). Pass or fail. The passing region is an <em>eye</em>; the setting is parked in its middle, for the most margin on every side.","All lanes are tested in parallel by hardware, but settings are stepped one by one — in the open re-implementation of Intel’s Haswell code, 63 timing points or 109 voltage points per sweep, and at each point 256 loops of 128 cache lines written and read back: 2 MiB each way, per channel. Then again for writes, for every rank."],note:{tag:"Thread check",html:"“Tens of millions of instructions” — nobody has published an instruction count for memory training, and it’s the wrong yardstick: the time goes to hardware — MMIO polls, JEDEC-mandated waits, and test bursts the memory controller generates itself. The core mostly waits."},facts:[["Normal boot","skipped: the saved results are written straight back (switch to “first boot” by the clock)"],["Each point","one hardware test burst, pass / fail"],["Shape shown","illustrative — real eyes vary per lane, that’s the point"]],code:{src:"coreboot haswell/native_raminit train_1d_margins.c",href:W.hswraminit[1],lines:Ao,at:i=>Math.min(Ao.length-1,Math.floor(i*14%1*Ao.length))},mem:Pn,sources:[W.hswraminit,W.micron,W.fspm],lps:()=>xt("prot"),act(i,e,t){zi(e,i,t,{chips:(n,s,r,a)=>s!==Math.min(1,Math.floor(i*2))?.06:Math.sin(t*13+a*.9+r*2.1+n)>.1?.8:.15})},labels:[{id:"ddrphy",text:"DDR5 PHY: per-lane delay & Vref",hot:!0},{id:"imc0",text:"memory controller 0"},{id:"imc1",text:"memory controller 1"}]},{stage:2,title:"DDR5’s extra knobs — and why the first boot takes forever",dur:15,real:{normal:.07,first:25},mode:"prot",shot:"dimms",eye:{kind:"write",title:"Write eye — DRAM receiver",sub:"after DFE · DIMM B · rank 1 · byte 5",seed:9},narration:["Past about 3,000 MT/s, JEDEC expects the data eye at a DDR5 chip’s pins to be <em>closed</em>: echoes of earlier bits smear into later ones. So every DDR5 chip’s data receivers have a 4-tap decision-feedback equalizer that subtracts those echoes, plus duty-cycle adjusters, termination and drive-strength settings — each another set of knobs to sweep, each change needing the eye re-measured.","Intel’s Raptor Lake memory code lists about fifty separately switchable training steps. Multiply by every rank, tens to hundreds of settings per sweep, a burst of hardware test traffic at each setting — and, with dynamic memory frequency enabled, up to four memory speeds. First-time DDR5 training typically takes tens of seconds and can run to minutes on large or dual-rank kits. A normal boot restores the saved results instead: on an Intel Meteor Lake Chromebook reference board (soldered LPDDR5X, not DIMMs), coreboot logs show the whole memory init taking 46–105 ms. We found no published figure for desktop DDR5 DIMMs."],note:{tag:"Thread check",html:"“Takes forever on DDR5 with memory training” — on a first boot or after a change, yes. LaurieWired’s jet-engine start-cart image fits nicely: a small self-contained system (the cache scratchpad) gets the big one running and is then disconnected. The cache supplies a place to run the training code, not energy. On AMD the “start cart” is literally a separate ARM processor."},facts:[["DFE tap 1","+50 … −200 mV in ~5 mV steps (≈ 50 codes)"],["DCA","−7 … +7 global, −3 … +3 per pin"],["JEDEC minimum eye, DDR5-5600","0.235 UI (≈ 42 ps) × 60 mV diamond at the DRAM’s receiver, after DFE (writes)"],["Normal boot","restore + JEDEC init + checks: FSP-M ≈ 46–105 ms (Meteor Lake Chromebook, soldered LPDDR5X)"],["First boot","tens of seconds to minutes (board-vendor and memory-maker reports)"]],code:{src:"Intel FSP RaptorLakeS FspmUpd.h (switch names)",href:W.fspm[1],lines:w_,ref:!0,title:"Training steps it can run"},mem:Pn,sources:[W.micron,W.fspm,W.thread],lps:()=>xt("prot"),act(i,e,t){zi(e,i,t,{chips:(n,s,r,a)=>Math.sin(t*17+a*2.3+r*1.1+s*3+n)>0?.95:.12})},labels:[{id:"dimmA",text:"4-tap DFE in every chip"},"dimmB"]},{stage:2,title:"DRAM online: carving up the map",dur:12,real:{normal:.005,first:.01},mode:"prot",shot:"memory",narration:["Memory works. The fresh training results stay in RAM for now: they are written to flash later in this boot, and only if they changed (this board’s BIOS does it from a 64-bit DXE driver, SaveMemoryConfig; coreboot after PCI enumeration). The memory controller’s map is programmed: DRAM from address 0 up to <em>TOLUD</em>, then a hole below 4 GiB for device registers and PCIe — with the DRAM that would have sat in the hole remapped above 4 GiB, up to <em>TOUUD</em>.","Slices are fenced off before anyone else can see them: <em>TSEG</em> for System Management Mode, stolen memory for the integrated GPU, a region for the security engine, protected ranges for DMA and for the cores’ C6 save area (PRMRR; this chip has no SGX). Each region gets its memory type when the MTRRs are rewritten."],facts:[["Host-bridge registers","TOLUD BCh · TOUUD A8h · TSEG B8h · BDSM B0h"],["TSEG size (FSP default)","4 MiB release / 16 MiB debug"]],code:{src:"coreboot …/systemagent/memmap.c (comment)",href:W.memmap[1],lines:T_,ref:!0},mem:{on:["flash","lapic","car","dram","mmio","high"],hit:["dram","high"],note:"DRAM exists"},sources:[W.memmap,W.fspm],lps:()=>xt("prot"),act(i,e){e.die("pcore0",.6,L.dram,"glow");for(const t of In)e.die(t,.35,L.car,"stripe");e.die("imc0",.6,L.dram,"scan"),e.die("imc1",.6,L.dram,"scan"),e.die("ddrphy",.6,L.dram,"scan"),e.bus("ddrA",.8,L.dram,{rate:14,speed:90}),e.bus("ddrB",.8,L.dram,{rate:14,speed:90}),e.chips(()=>.3,L.dram)},labels:["dimmA","dimmB"]},{stage:2,title:"Moving out of the cache",dur:13,real:.003,mode:"prot",shot:"llc",narration:["Time to give the cache back. Everything worth keeping — logs, timestamps, the next stage’s code — has been written into DRAM, which is still mapped uncached, so none of it is sitting only in the cache. Then the firmware does something no normal program ever should: <code>INVD</code>, which throws the entire cache away <em>without</em> writing anything back. The scratch data had no home in memory anyway; writing it back would mean writing to addresses where nothing exists.","Intel’s manual names this exact use: INVD for when “the cache is used as temporary memory”. The No-Eviction bits are cleared (run first, then setup), the way masks released, and the stack pointer leaps from the cache window into real DRAM. The cache goes back to its day job."],note:{tag:"Boot Guard",html:"On Boot Guard systems this teardown is a security moment: once the verified code is no longer pinned in cache it would be re-read from flash, which can be swapped after verification. EDK2 can migrate firmware volumes into DRAM before tearing NEM down, but only if the platform turns it on (PcdMigrateTemporaryRamFirmwareVolumes is off by default)."},facts:[["INVD vs WBINVD","discard vs write back — writing back 768 KiB to nowhere is pointless or harmful"],["New MTRRs","write-back: TSEG + the 32 MiB below cbmem_top · flash write-protect"]],code:{src:"coreboot exit_car.S (arch + soc)",href:"https://github.com/coreboot/coreboot/blob/main/src/arch/x86/exit_car.S",lines:Ro,at:i=>Math.min(Ro.length-1,Math.floor(Ye(i,.05,.95)*Ro.length))},mem:{on:["flash","lapic","dram","mmio","high"],hit:["dram"],note:"CAR gone"},sources:[W.sdm,W.fspapi],lps:()=>xt("prot"),act(i,e){const t=Ye(i,.3,.38);for(const s of In)e.die(s,(1-t)*.6+nt(i,.3,.36,.02)*.8,t>.5?"#ffffff":L.car,"stripe");e.die("sub:pcore0:l1d|l2|load_store",.6*(1-t),L.car,"pinned"),e.die("pcore0",.6,L.dram,"glow");const n=Ye(i,.55,.8);e.die("imc0",.3+n*.4,L.dram,"scan"),e.die("imc1",.3+n*.4,L.dram,"scan"),e.flow("stk","pcore0","dram0",1+n*4,L.dram,6),i<.3&&e.flow("copy","llc2","dram0",4,L.car,6),e.ring(.4,L.dram)},labels:[{id:"llc2",text:"INVD: the scratch RAM evaporates",hot:!0,from:.28,to:.6}]},{stage:2,title:"Thirty-one sleepers get a doorbell",dur:14,real:.05,mode:"prot",shot:"die",narration:["With DRAM up — and before any PCIe work — the firmware wakes the other 31 hardware threads for the first time. The BSP writes its Local APIC’s Interrupt Command Register: an INIT and then a single <em>Start-up IPI</em> to “all excluding self”, carrying a page number. Every AP starts at once in 16-bit real mode at that page — coreboot uses vector 30h, so <code>CS = 3000h, IP = 0</code>: physical 30000h, in freshly trained DRAM.","Each climbs the ladder in a dozen instructions, takes a ticket for its own stack with one <code>lock cmpxchg</code>, checks its microcode (already loaded for every thread by the FIT, so usually a no-op), copies the BSP’s MTRRs, turns its caches on, reports its APIC ID and core type, and parks — by default in <code>hlt</code> under EDK2; coreboot first has it relocate its SMM base, then spin waiting for work. In a typical UEFI BIOS this first wake comes from 32-bit PEI — as INIT-SIPI-SIPI, or a bare SIPI under EDK2’s default — so they only climb to protected mode."],note:{tag:"Thread check",html:"LaurieWired’s “Stage 4” starts here — before Stage 3’s PCIe and GPU work, not after it. And the APs never touch the reset vector, cache-as-RAM or training: they start at a 4 KiB page below 1 MiB that the BSP filled in."},facts:[["ICR (FEE0_0300h)","INIT 000C4500h · SIPI 000C4630h (all-excluding-self, vector 30h)"],["AP entry","CS = 3000h, IP = 0 → 30000h (coreboot)"],["In parallel?","yes — one broadcast; EDK2’s default then waits a fixed 50 ms to count them unless the platform sets its CPU count"]],code:{src:"coreboot src/cpu/x86/sipi_vector.S",href:W.sipi[1],lines:Kh,at:i=>Math.min(Cc,br(i,[[.27,0],[.45,20],[.63,Cc]]))},mem:{on:["flash","lapic","dram","mmio","high"],hit:["lapic","dram"]},sources:[W.sipi,W.mpinit,W.mplib,W.sdm],lps:i=>Ta(i,.18,.9,["real","prot","park"],{before:"wfs",bspMode:"prot",spread:.35}),act(i,e){e.die("pcore0",.6,"#4fe08a","glow");const t=nt(i,.04,.22);if(t>0){e.ring(.9*t,L.ipi);for(const s of wc)e.flow(`sipi-${s}`,"pcore0",s,3*t,L.ipi,8)}const n=nt(i,.2,.85);e.die("kind:pcore",.1+n*.35,"#ffcf6b","sparkle"),e.die("kind:ecore_cluster",.1+n*.35,"#ffcf6b","sparkle"),n>0&&wc.forEach((s,r)=>e.flow(`tr-${s}`,s,r%2?"dram1":"dram0",.6*n,L.dram,6))},labels:[{id:"pcore0",text:"BSP: INIT, then SIPI to all-but-self",hot:!0,to:.3}]},{stage:2,title:"Thirty-two SMM bases, one at a time",dur:15,real:.005,mode:"prot",shot:"die",narration:["<em>System Management Mode</em> is a hidden CPU mode with its own walled-off slice of DRAM, TSEG, carved out a moment ago. An SMI drops a thread into it, and every thread starts out assuming its SMM area is at <code>30000h</code> — so if two took an SMI at once they would trample each other’s saved state. The BSP therefore sends each of the other 31 threads an SMI, one after another, and has each move its base to a private tile; then it does itself.","Entering SMM clears CR0’s PE and PG bits, putting the thread in an environment “similar to real-address mode”; this relocation handler climbs straight back to 32-bit protected mode. Once DXE has installed the 64-bit SMM code, every later SMI climbs all the way to long mode — 1978 to 2003 again, on every SMI, for as long as the machine runs."],note:{tag:"When",html:"Current EDK2 relocates here in PEI, as soon as the MP services are up — its SMM CPU driver now refuses to start if this hasn’t happened. Older EDK2 did it in DXE; which one this retail BIOS does isn’t public. coreboot relocates during its own multiprocessor init, and on AMD it simply writes each thread’s SMM_BASE MSR — no SMI needed."},facts:[["Default SMBASE","30000h; handler at SMBASE + 8000h = 38000h"],["TSEG","FSP default 4 MiB (16 MiB debug); coreboot ADL/RPL: 8 MiB"],["Order","the 31 APs one at a time, then the BSP"],["SMRR","only SMM code may set it; then non-SMM reads of TSEG return a fixed value and writes are dropped"]],code:{src:"EDK2 UefiCpuPkg SmmRelocationLib.c (PEIM library)",href:W.smmreloc[1],lines:A_,at:i=>{if(i<.06)return 0;const e=Ye(i,.06,.94)*32;if(e>=31)return e%1<.4?23:24;const t=e%1;return t<.15?7:t<.3?8:t<.45?9:13}},mem:{on:["flash","lapic","dram","mmio","high"],hit:["dram"],note:"TSEG carved from DRAM"},sources:[W.smmreloc,W.smmcpu,W.sdm],lps:i=>e=>{const t=e===0?31:e-1,n=Ye(i,.06,.94)*32,s=e===0?"prot":"park";return n<t+.45?s:n<t+.7?"real":n<t+.95?"prot":s},act(i,e){e.die("pcore0",.5,"#4fe08a","glow");const t=Math.floor(Ye(i,.06,.94)*32),n=["pcore0","pcore0","pcore1","pcore1","pcore2","pcore2","pcore3","pcore3","pcore4","pcore4","pcore5","pcore5","pcore6","pcore6","pcore7","pcore7"],s=t<31?t+1<16?n[t+1]:["ecl0","ecl1","ecl2","ecl3"][Math.floor((t+1-16)/4)]:"pcore0";e.die(s,.9,"#ff9a3d","scan"),e.flow(`smi-${s}`,"pcore0",s,4,"#ff9a3d",9),e.die("imc0",.35,L.dram,"scan")},labels:[{id:"pcore0",text:"BSP: SendSmiIpi(), one thread at a time",hot:!0}]}],C_=["pcore1","pcore2","pcore3","pcore4","pcore5","pcore6","pcore7","ecl0","ecl1","ecl2","ecl3"],ur={on:["flash","lapic","dram","mmio","high"],hit:["dram"]},Cr=[{i:"cli",era:"8086",why:"Interrupts off for the switch (SDM §12.8.5.2). DxeIpl has already loaded an IDT in the 64-bit format while still in 32-bit mode, and turned paging off."},{i:"mov   DWORD [esp], .0",era:"386",why:"Put the 64-bit landing address on the stack for the far return below — the stack is real DRAM now."},{i:"mov   eax, cr4",era:"P5",why:""},{i:"or    al, (1 << 5)",era:"8086",why:"CR4.PAE: physical address extension (Pentium Pro, 1995) — long mode requires it."},{i:"mov   cr4, eax",era:"P5",why:"PAE on."},{i:"mov   ecx, 0xc0000080",era:"386",why:"IA32_EFER, AMD’s Extended Feature Enable Register."},{i:"rdmsr",era:"P5",why:"Read a model-specific register (Pentium)."},{i:"or    ah, 1",era:"8086",why:"Bit 8: LME, long-mode enable."},{i:"wrmsr",era:"P5",why:"Long mode is enabled — but not yet active."},{i:"mov   eax, cr0",era:"386",why:""},{i:"bts   eax, 31",era:"386",why:"CR0.PG: paging."},{i:"mov   cr0, eax",era:"386",why:"Paging on with LME set: the CPU sets EFER.LMA. It is now in IA-32e “compatibility mode” — still running 32-bit code, like a 32-bit app on a 64-bit OS."},{i:"retf",era:"386",why:"A far return pops a code selector whose descriptor has L = 1, D = 0. This is the instant the CPU becomes a true 64-bit AMD64 machine."},{i:".0:",era:"",why:"The label the second line put on the stack: the far return lands here."},{i:"BITS 64",era:"",why:""},{i:"mov   rbx, [esp]",era:"AMD64",why:"The DXE core’s entry point, read as a full 64-bit value."},{i:"mov   rcx, [esp + 8]",era:"AMD64",why:"First argument: the HOB list — everything PEI learned, the one thing DXE needs."},{i:"mov   rdx, [esp + 0x10]",era:"AMD64",why:"Second argument (unused, 0)."},{i:"mov   rsp, [esp + 0x18]",era:"AMD64",why:"Switch to the DXE stack."},{i:"add   rsp, -0x20",era:"AMD64",why:"32 bytes of “shadow space” the x64 calling convention reserves."},{i:"call  rbx",era:"AMD64",why:"Into the DXE core. Apart from trips into System Management Mode (and legacy-BIOS thunks, if CSM is on), the boot processor stays in 64-bit mode from here into the kernel."}],Pr=i=>Math.floor(Ye(i,.05,.85)*Cr.length),Po=i=>.05+.8*i/Cr.length,Pc=i=>Pr(i)>=13,P_=["Step #1 - When a FV protocol is added to the system every driver in the","FV is added to the mDiscoveredList. The SOR, Before, and After Depex are","pre-processed as drivers are added to the mDiscoveredList. If an Apriori","file exists in the FV those drivers are addeded to the mScheduledQueue.","...","Step #2 - Dispatch. Remove driver from the mScheduledQueue and load and","start it. After mScheduledQueue is drained check the mDiscoveredList to","see if any item has a Depex that is ready to be placed on the","mScheduledQueue."],Lc=[";RendezvousFunnelProc  procedure follows. All APs execute their procedure. This",";procedure serializes all the AP processors through an Init sequence. It must be",";noted that APs arrive here very raw...ie: real mode, no stack.","...","BITS 16","    ...","o32 lgdt       [cs:si]","    mov        eax, cr0                    ; Get control register 0","    or         eax, 000000003h             ; Set PE bit (bit #0) & MP","    mov        cr0, eax","o32 jmp far    [cs:di]","BITS 32","Flat32Start:                                   ; protected mode entry point","    ...","    mov        eax, cr4","    bts        eax, 5","    ...","    mov        cr4, eax","    ...","    mov        cr3, ecx                    ; Load CR3","    mov        ecx, 0c0000080h             ; EFER MSR number","    rdmsr                                  ; Read EFER","    bts        eax, 8                      ; Set LME=1","    wrmsr                                  ; Write EFER","    mov        eax, cr0                    ; Read CR0","    bts        eax, 31                     ; Set PG=1","    mov        cr0, eax                    ; Write CR0","    ...","    jmp far    [edi]","BITS 64","LongModeStart:"],Lo=["00:00.0  host bridge / system agent      (CPU)","00:01.0  PCIe root port, x16 Gen5        (CPU)","  01:00.0  discrete GPU","  01:00.1  GPU HDMI/DP audio","00:02.0  UHD 770 integrated GPU          (CPU)","00:06.0  PCIe root port, x4 Gen4         (CPU)","  02:00.0  NVMe SSD","00:14.0  USB xHCI controller             (PCH, via DMI)","00:16.0  CSME interface (HECI)           (PCH)","00:17.0  SATA controller                 (PCH)","00:1a–1d PCH PCIe root ports             (PCH)","00:1f.0  eSPI / LPC bridge               (PCH)","00:1f.3  HD audio                        (PCH)","00:1f.4  SMBus                           (PCH)","00:1f.5  SPI flash controller            (PCH)"],Dc=["u32 pci_moving_config32(struct device *dev, unsigned int reg)","{","	u32 value, ones, zeroes;","	value = pci_read_config32(dev, reg);","	pci_write_config32(dev, reg, 0xffffffff);","	ones = pci_read_config32(dev, reg);","	pci_write_config32(dev, reg, 0x00000000);","	zeroes = pci_read_config32(dev, reg);","	pci_write_config32(dev, reg, value);","	return ones ^ zeroes;","}"],Do=["//",'// Delete "BootNext" NV variable before transferring control to it to prevent loops.',"//","Status = gRT->SetVariable (","                EFI_BOOT_NEXT_VARIABLE_NAME,","...","//",'// Boot to "BootNext"',"//",'UnicodeSPrint (BootNextVariableName, sizeof (BootNextVariableName), L"Boot%04x", *BootNext);',"...                       /* then walk BootOrder: Boot0000, Boot0003, … */"],Io=["	status = efi_get_memory_map(&map, true);","	...","	status = efi_bs_call(exit_boot_services, handle, map->map_key);","	if (status == EFI_INVALID_PARAMETER) {","		/*","		 * The memory map changed between efi_get_memory_map() and","		 * exit_boot_services().  Per the UEFI Spec v2.6, Section 6.4:","		 * EFI_BOOT_SERVICES.ExitBootServices we need to get the","		 * updated map, and try again.  The spec implies one retry","		 * ...","		 */","	...","static void __noreturn enter_kernel(unsigned long kernel_addr,","				    struct boot_params *boot_params)","{","	/* enter decompressed kernel with boot_params pointer in RSI/ESI */",'	asm("jmp *%0"::"r"(kernel_addr), "S"(boot_params));'],L_=i=>{const e=Pr(i);return{title:"BSP control state",note:"SDM §12.8.5",rows:[["CR3","PML4 in DRAM (identity map)","wide"],["CR4.PAE",e>=5?"1":"0",e>=5&&e<8?"hot":""],["EFER.LME",e>=9?"1":"0",e>=9&&e<11?"hot":""],["CR0.PG",e>=12?"1":"0",e>=12&&e<13?"hot":""],["EFER.LMA",e>=12?"1 (set by hardware)":"0",e>=12&&e<13?"hot":""],["CS",e>=13?"L = 1, D = 0 → 64-bit":e>=12?"L = 0, D = 1 → compatibility mode":"32-bit flat (L = 0, D = 1)",e>=12?"hot wide":"wide"]]}},D_=["VisitAllInstancesOfProtocol (","  &gEfiPciRootBridgeIoProtocolGuid,","  ConnectRootBridge,","  NULL","  );","...","EfiEventGroupSignal (&gEfiEndOfDxeEventGroupGuid);","...","//","// Prevent further changes to LockBoxes or SMRAM.","// Any TPM 2 Physical Presence Interface opcode must be handled before.","//","Handle = NULL;","Status = gBS->InstallProtocolInterface (","                &Handle,","                &gEfiDxeSmmReadyToLockProtocolGuid,","                EFI_NATIVE_INTERFACE,","                NULL","                );","...","//","// Dispatch deferred images after EndOfDxe event and ReadyToLock","// installation.","//","EfiBootManagerDispatchDeferredImages ();"],I_=[{stage:3,title:"Into 64 bits: the PEI → DXE hand-off",dur:13,real:.005,mode:i=>Pc(i)?"long":"prot",shot:"dieLeft",narration:["On this platform everything since the reset code left 16-bit real mode — cache-as-RAM, DDR5 training, even Intel’s silicon init — ran as 32-bit code. We checked a real retail Z790 BIOS image: every SEC and PEI module is 32-bit x86 except one used only for firmware updates, and all 263 DXE drivers are 64-bit. On a normal boot the boot processor’s main flow flips into long mode once, here at the hand-off from PEI to DXE. From here on, every SMI and every wake of the other 31 threads repeats the climb.","The recipe: build identity-mapped page tables in DRAM (every address maps to itself, so the code flipping the switch keeps running), point CR3 at them, set CR4.PAE, set EFER.LME, then turn on paging. That lands the CPU in <em>compatibility mode</em> — long mode, still running 32-bit code. One far return to a code segment marked L = 1 and it is a 2003 AMD64."],note:{tag:"Not universal",html:"Other designs switch earlier. coreboot runs 64-bit from just after cache-as-RAM — before DRAM exists — on Panther Lake and some Meteor Lake Chromebooks, and Intel ships 64-bit FSP builds starting with Meteor Lake. EDK2’s generic X64 reset vector reaches long mode before its first line of C — after a short scan of flash for the SEC core — using page tables stored in flash. On AMD Zen an on-die ARM security processor has trained DRAM before the x86 cores run a single instruction."},facts:[["Measured (MSI Z790, AMI)","SEC 4/4 and PEI 100/101 modules 32-bit · DXE 263/263 and SMM 63/63 64-bit"],["Raptor Lake FSP","32-bit API · spec 2.4 in this MSI image (Intel’s public RPL-S release: 2.3)"],["Identity map","EDK2: the CPU’s whole physical address width (46 bits on a typical 13900K), 2 MiB or 1 GiB pages, built in DRAM"]],regs:L_,code:{src:"EDK2 MdePkg BaseLib Ia32/EnablePaging64.nasm",href:W.enablepaging[1],lines:Cr,at:i=>Math.min(Cr.length-1,Pr(i))},mem:ur,sources:[W.enablepaging,W.dxeipl,W.sdm,W.msibios,W.fspm,W.amd17],lps:i=>e=>e===0?Pc(i)?"long":"prot":"park",act(i,e){const t=Pr(i),n=Ye(i,Po(12),Po(13));e.die("pcore0",.7+n*.3,t>=13?"#58a6ff":"#4fe08a",t>=12?"scan":"glow"),e.die("sub:pcore0:decode|l1i|branch|ucode_opcache",.6,"#58a6ff","scan"),e.die("imc0",.4,L.dram,"scan"),e.flow("pt","pcore0","dram0",4*nt(i,0,.3),L.dram,6),e.ring(.4,L.dram)},labels:[{id:"pcore0",text:"BSP: compatibility mode → 64-bit",hot:!0,color:"#58a6ff",from:Po(12)}]},{stage:3,title:"Wake the cores again — all the way to 64-bit",dur:13,real:.03,mode:"long",shot:"die",narration:["The APs were last woken from 32-bit PEI, so DXE’s CPU driver — among the first drivers DXE runs — can’t simply hand them 64-bit work: it sends INIT-SIPI-SIPI again. Every thread restarts in 16-bit real mode at a page below 1 MiB and climbs the whole ladder in a trampoline of about fifty instructions — real, protected, then long mode, into code, descriptor tables and page tables the BSP already built in RAM.","In EDK2’s default “HLT loop” parking mode, each later request for AP work repeats the INIT-SIPI-SIPI too. Counting the SMM relocation, that’s at least the third climb for every AP this boot, and more are coming."],facts:[["Why again","PEI (32-bit) and DXE (64-bit) differ in mode"],["Trampoline","≈ 50 instructions from the SIPI vector to the first 64-bit one"]],code:{src:"EDK2 UefiCpuPkg MpInitLib X64/MpFuncs.nasm",href:W.mpfuncs[1],lines:Lc,at:i=>Math.min(Lc.length-1,br(i,[[0,0],[.21,0],[.335,4],[.458,11],[.582,29],[.705,30]]))},mem:{on:["flash","lapic","dram","mmio","high"],hit:["lapic","dram"]},sources:[W.mpfuncs,W.mplib,W.sdm],lps:i=>Ta(i,.12,.92,["wfs","real","prot","long","park"],{before:"park",bspMode:"long",spread:.3}),act(i,e){e.die("pcore0",.6,"#58a6ff","glow");const t=nt(i,.04,.2);if(t>0){e.ring(.9*t,L.ipi);for(const s of C_)e.flow(`ipi-${s}`,"pcore0",s,3*t,L.ipi,8)}const n=nt(i,.18,.88);e.die("kind:pcore",.1+n*.3,"#7fd8ff","sparkle"),e.die("kind:ecore_cluster",.1+n*.3,"#7fd8ff","sparkle")},labels:[{id:"ecl0",text:"every AP: 16 → 32 → 64 again",from:.3}]},{stage:3,title:"A firmware operating system",dur:12,real:{normal:1,first:1.29},mode:"long",shot:"fetch",inset:{shot:"bsp",label:"ONE THREAD DOES THE WORK"},narration:["DXE — the Driver Execution Environment — is a small operating system in its own right: memory allocation, events and timers, boot and runtime services, and a dispatcher that runs each driver as soon as the protocols it depends on appear. Order is mostly emergent — only a short “apriori” list (14 drivers on this board) runs first, in a fixed order.","On the MSI board we measured, the main DXE volume is stored LZMA-compressed — 5.5 MB in flash — and inflated into 18.3 MB of DRAM before dispatch: 260 DXE drivers (Intel’s FSP volume adds 3 more) and 63 System Management Mode drivers, from CPU and timer drivers to USB, NVMe, FAT, a network stack, Secure Boot, the setup UI and the board vendor’s overclocking menus.","And it all runs on one thread of one P-core. The UEFI specification defines boot services as uniprocessor: drivers are serviced by polling, and the only interrupt is the boot-services timer."],facts:[["First boot only","a DXE driver (SaveMemoryConfig on this board) also writes the new memory-training results to flash"],["DXE volume","5,513,321 B compressed → 18,284,560 B"],["Modules","263 DXE · 63 SMM · 101 PEIM · 3 UEFI apps"],["Execution model","one processor, 64-bit, identity-mapped, polled drivers, a timer interrupt (UEFI §2.3.4)"],["Idle","the BSP HLTs when no event is pending"]],code:{src:"EDK2 MdeModulePkg/Core/Dxe/Dispatcher/Dispatcher.c (header comment)",href:W.dispatcher[1],lines:P_,ref:!0,title:"How DXE decides what runs next"},mem:{on:["flash","lapic","dram","mmio","high"],hit:["flash","dram"]},sources:[W.pispec,W.dispatcher,W.uefiexec,W.msibios],lps:()=>i=>i===0?"long":"park",act(i,e,t){e.die("pcore0",.9,"#58a6ff","sparkle"),e.die("sub:pcore0:l1d|l2|load_store|int_exec",.6,"#58a6ff","sparkle");const n=nt(i,0,.15);e.flow("fv","dmi","pcore0",5*n,L.fetch,7),e.flow("ram","pcore0","dram0",6,L.dram,7),e.flow("ram2","pcore0","dram1",4,L.dram,7),e.bus("spi",.9*n,L.fetch,{rate:12*n,speed:25,dir:-1}),e.bus("dmi",.8*n,L.fetch,{rate:10*n,speed:80,dir:-1}),e.board("spi",.8*n,L.fetch,"scan"),e.bus("ddrA",.6,L.dram,{rate:10,speed:90}),e.bus("ddrB",.6,L.dram,{rate:10,speed:90}),e.ring(.6,"#58a6ff")},labels:[{id:"spi",text:"DXE volume: 5.5 MB LZMA",hot:!0,to:.3}]},{stage:3,title:"Who’s on the bus? PCIe enumeration",dur:15,real:.3,mode:"long",shot:"pcie",inset:{shot:"sa",label:"ROOT PORTS ON THE DIE"},narration:["When the dispatcher runs out of drivers, the boot manager (BDS) starts <em>connecting</em> devices — and connecting the PCI root bridge is what sets the PCI bus driver scanning. Configuration space is reached through a memory window (ECAM): 4 KiB per bus/device/function. Firmware reads the first four bytes of every possible device; all ones — <code>FFFFFFFF</code> — means nobody is home, anything else is a vendor and device ID. Finding a bridge, it hands the link behind it the next free bus number, scans it depth-first, then records the highest bus number found below so future requests route correctly.","The chipset is invisible here: DMI is transparent to configuration software, so the PCH’s USB, SATA, audio and SPI controllers show up on bus 0 alongside the CPU’s own devices. The links themselves train in hardware — up to 32 GT/s per lane on the CPU’s Gen5 ×16 graphics port — before this scan begins. The PCIe rule: wait at least 100 ms after a link trains before the first configuration request, and allow a device a full second before declaring it broken. (Intel’s FSP configured the CPU’s root ports back in 32-bit PEI; this finds what is behind them.)"],facts:[["ECAM address","base + (bus << 20 | dev << 15 | fn << 12 | reg)"],["CPU lanes","PCIe 5.0 ×16 (or ×8 + ×8) + PCIe 4.0 ×4"],["CPU ↔ PCH","DMI Gen 4 ×8, 16 GT/s"]],code:{src:"enumeration result (devices: coreboot pci_devs.h; slots: coreboot’s ms7e06 board)",href:W.pcidevs[1],lines:Lo,at:i=>Math.min(Lo.length-1,Math.floor(Ye(i,.05,.9)*Lo.length)),title:"Found so far"},mem:{on:["flash","lapic","dram","mmio","high"],hit:["mmio"],note:"ECAM lives in the MMIO hole"},sources:[W.bdsplatform,W.pcidevice,W.pcilib,W.pcidevs,W.ms7e06,W.linuxpci,W.ark],lps:()=>i=>i===0?"long":"park",act(i,e){e.die("pcore0",.6,"#58a6ff","glow"),e.die("pcie_ctrl",.8,L.pcie,"scan"),e.die("sa",.5,L.pcie,"scan"),e.flow("cfg","pcore0","pcie_ctrl",6,L.pcie,7);const t=nt(i,.12,.4),n=nt(i,.32,.55),s=nt(i,.5,.95);e.die("pcie5",.3+t*.7,L.pcie,"sparkle"),e.die("pcie4",.3+n*.7,L.pcie,"sparkle"),e.die("dmi",.3+s*.7,L.pcie,"sparkle"),e.bus("pcie16",.3+t*.7,L.pcie,{rate:14*t,speed:90}),e.board("gpu",t*.8,L.pcie,"scan"),e.bus("pcie4",.3+n*.7,L.pcie,{rate:10*n,speed:90}),e.board("nvme",n*.9,L.pcie,"scan"),e.bus("dmi",.3+s*.6,L.pcie,{rate:10*s,speed:90}),e.board("pch",.3+s*.6,L.pcie,"scan")},labels:[{id:"gpu",text:"01:00.0 GPU",to:.5},{id:"nvme",text:"02:00.0 NVMe",from:.3},{id:"pch",text:"PCH devices, also on bus 0",from:.5}]},{stage:3,title:"Sizing the windows",dur:11,real:.05,mode:"long",shot:"pcie",narration:["Each device says how much address space it wants through its Base Address Registers, and the trick for asking is lovely: write all ones, read it back. Address bits below the window’s size stay zero, and the lowest bit that moved gives the size. (coreboot also writes zeros and XORs the two answers, to find exactly the bits that move.) A GPU answering <code>F000000C</code> wants 256 MiB, 64-bit, prefetchable — or, with Resizable BAR enabled, all of its VRAM in one window above 4 GiB.","Then the allocator packs every request into the address holes — I/O ports, 32-bit MMIO below 4 GiB, 64-bit prefetchable MMIO above — largest first, programs each bridge’s windows and switches the bridges on. A device’s own bus mastering — its licence to DMA — waits for its driver (in EDK2, its memory decoding does too)."],regs:i=>({title:"Sizing one BAR (worked example)",rows:[["original value","saved"],["write","FFFFFFFF",i>.15&&i<.4?"hot":""],["read back",i>.3?"F000000C":"…",i>.3&&i<.55?"hot":""],["bits 3:0",i>.45?"C = memory, 64-bit, prefetchable":"…","wide"],["lowest bit that moved",i>.6?"bit 28 → 2²⁸ = 256 MiB":"…",i>.6?"hot wide":"wide"]]}),code:{src:"coreboot src/device/pci_device.c",href:W.pcidevice[1],lines:Dc,at:i=>Math.min(Dc.length-1,3+Math.floor(Ye(i,.05,.9)*8))},mem:{on:["flash","lapic","dram","mmio","high"],hit:["mmio","high"]},sources:[W.pcidevice,W.pcilib],lps:()=>i=>i===0?"long":"park",act(i,e){e.die("pcore0",.6,"#58a6ff","glow"),e.die("pcie_ctrl",.6,L.pcie,"scan"),e.die("pcie5",.8,L.pcie,"glow"),e.flow("bar","pcore0","pcie5",4,L.pcie,7),e.bus("pcie16",.8,L.pcie,{rate:8,speed:90}),e.bus("pcie16",.6,L.pcie,{rate:6,speed:90,dir:-1}),e.board("gpu",.7,L.pcie,"scan")},labels:[{id:"gpu",text:"BAR: “I want 256 MiB”",hot:!0}]},{stage:3,title:"Lock-down before outside code runs",dur:13,real:.02,mode:"long",shot:"die",narration:["Up to now every instruction came from the board maker’s own flash. The next code to run comes from somewhere else — the graphics card’s ROM — so the firmware locks up first. It signals <em>End of DXE</em>, then installs <em>SMM Ready To Lock</em>: SMRAM is closed and locked until the next reset, and SMM stops loading new drivers.","The PI specification asks for this order: before running any driver or application that isn’t from the platform manufacturer, or connecting consoles, the platform should signal End of DXE and immediately install SMM Ready To Lock. EDK2 enforces it — an option ROM found during enumeration is <em>deferred</em>, not run, until this moment."],note:{tag:"Also around here",html:"A retail BIOS typically also write-protects its own flash and turns on pre-boot DMA protection. This MSI image carries modules for BIOS Guard, VT-d DMA protection and the CSME hand-off; we checked they are present, not exactly when each one runs. The order shown is EDK2’s reference platform; AMI’s is not public."},facts:[["Order (EDK2)","connect root bridges → End of DXE → SMM Ready To Lock → deferred option ROMs → consoles"],["SMRAM lock","cannot be reopened until the next reset"]],code:{src:"EDK2 OvmfPkg BdsPlatform.c — PlatformBootManagerBeforeConsole()",href:W.bdsplatform[1],lines:D_,title:"The order, in code",at:i=>i<.12?Math.min(4,Math.floor(Ye(i,0,.12)*5)):i<.35?6:i<.75?9+Math.min(9,Math.floor(Ye(i,.35,.75)*10)):24},mem:{on:["flash","lapic","dram","mmio","high"],hit:["dram","flash"],note:"TSEG locked"},sources:[W.endofdxe,W.bdsplatform,W.defer3rd,W.msibios],lps:()=>i=>i===0?"long":"park",act(i,e){e.die("pcore0",.8,"#58a6ff","glow");const t=Ye(i,.4,.7);e.die("imc0",.3+.5*t,"#ff9a3d","pinned"),e.die("imc1",.3+.5*t,"#ff9a3d","pinned"),e.flow("lock","pcore0","imc0",4*nt(i,.35,.75),"#ff9a3d",7),e.board("spi",.25+.5*t,"#ff9a3d","pinned"),e.board("gpu",.25,L.gpu,"breathe"),e.die("kind:pcore",.12,"#7d7fb8","breathe"),e.die("kind:ecore_cluster",.12,"#7d7fb8","breathe")},labels:[{id:"pcore0",text:"End of DXE → SMM Ready To Lock",hot:!0,from:.15}]},{stage:3,title:"The graphics card brings its own driver",dur:12,real:.3,mode:"long",shot:"pcie",narration:["A graphics card carries an <em>option ROM</em>, exposed through a ROM BAR at configuration offset 30h. Each image begins <code>55 AA</code> and points to a “PCIR” structure whose code type says what it is: 0 for an old real-mode VGA BIOS, 3 for a UEFI driver. This board’s firmware still ships the legacy-compatibility (CSM) modules, but a modern card is driven by its UEFI <em>GOP</em> driver.","Only now, after the lock-down, does the firmware run that 64-bit driver — on the CPU, not the GPU — after checking its signature under Secure Boot. GOP hands back a framebuffer address inside one of the card’s BARs; the boot logo is simply pixels written there. (An ACPI table, BGRT, later tells the OS where the logo was, so it can keep it on screen.)"],facts:[["ROM image","signature AA55h → “PCIR” → code type 3 = EFI"],["Runs on","the CPU (BSP), 64-bit"],["Gives","a linear framebuffer + Blt()"],["Signed by","usually Microsoft’s third-party UEFI CA — the 2011 certificate expired in June 2026; firmware doesn’t enforce expiry, and newer ROMs are signed under a 2023 CA"]],mem:{on:["flash","lapic","dram","mmio","high"],hit:["high","dram"]},sources:[W.optrom,W.gop,W.imgverify,W.defer3rd],lps:()=>i=>i===0?"long":"park",act(i,e){e.die("pcore0",.8,"#58a6ff","sparkle"),e.die("pcie5",.9,L.gpu,"scan"),e.flow("rom","pcie5","pcore0",4*nt(i,.05,.4),L.gpu,7),e.flow("fb","pcore0","pcie5",6*Ye(i,.45,.6),L.gpu,7),e.bus("pcie16",1,L.gpu,{rate:6+16*Ye(i,.45,.6),speed:100,dir:i<.4?-1:1}),e.board("gpu",.6+.4*Ye(i,.45,.65),L.gpu,"glow")},labels:[{id:"gpu",text:"GOP driver from the card’s ROM; logo → framebuffer",hot:!0}]},{stage:3,title:"Describing the machine to whoever comes next",dur:11,real:.05,mode:"long",shot:"die",narration:["Before handing over, firmware writes down what it found. ACPI tables: the RSDP points to the XSDT, which lists the rest — the FADT (which in turn points to the DSDT, device descriptions in AML bytecode), the <em>MADT</em> with one entry for each of the 32 hardware threads (by convention the boot thread comes first), MCFG saying where ECAM lives, HPET, DMAR for the IOMMU, the boot-performance and boot-logo tables, TPM2.","SMBIOS describes the board, the processor and each DIMM; the UEFI memory map tells the OS which RAM is free and which it must never touch. Most of it is written as drivers load; the boot-logo table waits for ReadyToBoot, once a boot option is picked, and the boot-timing record is stamped right up to ExitBootServices."],facts:[["RSDP signature","“RSD PTR ” (with the trailing space)"],["MADT","32 processor entries; the spec says the BSP “should” be first"],["SMBIOS 3","anchor “_SM3_”; type 4 = CPU, type 17 = each DIMM"]],regs:{title:"ACPI tables written",rows:[["RSDP","→ XSDT"],["XSDT","64-bit pointers"],["FACP / DSDT","AML device tree"],["APIC (MADT)","32 local APICs","hot"],["MCFG","ECAM base"],["HPET · DMAR","timers · VT-d"],["FPDT · BGRT","boot timing · logo"],["TPM2 · SSDTs","more AML"]]},mem:ur,sources:[W.acpi,W.uefispec],lps:()=>i=>i===0?"long":"park",act(i,e){e.die("pcore0",.7,"#58a6ff","sparkle"),e.flow("acpi","pcore0","dram1",4,L.dram,6),e.die("kind:pcore",.18,"#7d7fb8","breathe"),e.die("kind:ecore_cluster",.18,"#7d7fb8","breathe")}},{stage:3,title:"Choosing something to boot",dur:12,real:.8,mode:"long",shot:"pcie",narration:["Boot Device Selection: the boot manager reads the UEFI variable <code>BootNext</code> (deleting it first, so a broken entry can’t loop forever), then walks <code>BootOrder</code> through <code>Boot####</code> entries — each a device path like <code>PciRoot(0x0)/Pci(0x6,0x0)/Pci(0x0,0x0)/NVMe(0x1,…)/HD(1,GPT,…)/\\EFI\\…</code> down to a file on a FAT32 EFI System Partition. If none work, firmware falls back to its recovery options, which by spec include the removable-media default path <code>\\EFI\\BOOT\\BOOTX64.EFI</code>.","Under Secure Boot the loader is hashed and its signature checked against <code>dbx</code> (revoked) first, then <code>db</code> (allowed); the KEK and platform key control who may change those lists. Then the boot loader — Windows Boot Manager, or shim and GRUB — runs as a 64-bit UEFI application, still using the firmware’s services to read the kernel off the NVMe drive."],facts:[["Fallback path","\\EFI\\BOOT\\BOOTX64.EFI (PE machine 8664h)"],["Watchdog","the boot manager arms a 5-minute watchdog before starting the loader"],["Variable writes","go through SMM on this firmware (its NvramSmm and SmiVariable modules): each is an SMI, a trip out of long mode and back"]],code:{src:"EDK2 MdeModulePkg BdsDxe/BdsEntry.c",href:W.bds[1],lines:Do,at:i=>Math.min(Do.length-1,Math.floor(Ye(i,.05,.6)*Do.length))},mem:ur,sources:[W.uefispec,W.bds,W.imgverify],lps:()=>i=>i===0?"long":"park",act(i,e){e.die("pcore0",.8,"#58a6ff","sparkle"),e.die("pcie4",.9,L.pcie,"scan"),e.flow("nvme","pcie4","pcore0",5,L.pcie,7),e.bus("pcie4",1,L.pcie,{rate:18,speed:100,dir:-1}),e.board("nvme",1,L.pcie,"scan"),e.board("gpu",.4,L.gpu,"glow")},labels:[{id:"nvme",text:"ESP → \\EFI\\…\\loader.efi",hot:!0}]},{stage:3,title:"ExitBootServices: the firmware steps aside",dur:13,real:.5,mode:"long",shot:"die",narration:["Linux’s EFI stub — the kernel image pretending to be a UEFI application — decompresses the kernel while firmware services are still available, grabs the final memory map and calls <code>ExitBootServices</code> with that map’s key. If anything allocated memory in between, the firmware refuses and the loader must fetch the map and try again.","After that the OS owns all available memory; firmware keeps only a few runtime services (variables, time, reset). The stub jumps to the kernel’s <code>startup_64</code> with a pointer to its boot parameters in RSI. Apart from brief trips into SMM (and legacy-BIOS thunks, if CSM is on), the boot processor has stayed in 64-bit mode since DXE began. The other 31 threads — woken one last time at ExitBootServices (in EDK2) to move there — sit in a tiny halt loop the firmware copied into reserved memory, waiting to be woken again."],note:{tag:"Thread check",html:"“Hundreds of millions of instructions” for this stage — plausible as a floor, but unmeasured: nobody publishes it. Retail desktops typically spend a few seconds in firmware (Windows shows it as “Last BIOS time”); with turbo-clocked busy-waits the true count could be in the billions."},facts:[["Typical firmware time","a few seconds on retail desktops; well under 1 s with lean firmware like coreboot"],["APs at hand-off","HLT/MWAIT loop in EfiReservedMemoryType pages"]],code:{src:"Linux drivers/firmware/efi/libstub",href:W.efistub[1],lines:Io,at:i=>Math.min(Io.length-1,Math.floor(Ye(i,.05,.9)*Io.length))},mem:ur,sources:[W.efistub,W.uefispec,W.fpdt],lps:()=>i=>i===0?"long":"park",act(i,e){e.die("pcore0",.85,"#58a6ff","sparkle"),e.flow("k","pcore0","dram0",6,L.dram,7),e.flow("k2","pcore0","dram1",6,L.dram,7),e.ring(.7,L.dram),e.bus("ddrA",.7,L.dram,{rate:14,speed:100}),e.bus("ddrB",.7,L.dram,{rate:14,speed:100}),e.die("kind:pcore",.15,"#7d7fb8","breathe"),e.die("kind:ecore_cluster",.15,"#7d7fb8","breathe")},labels:[{id:"pcore0",text:"jmp startup_64",hot:!0,from:.7}]}],Uo=[{i:"cli",era:"8086",why:"Woken by a Start-up IPI, the AP is in 16-bit real mode at CS = VV00h, IP = 0 — the page number the IPI carried."},{i:"wbinvd",era:"486",why:"Write back and invalidate this core’s caches and every cache it shares, up to the 36 MB L3. Nothing is lost — dirty lines go to DRAM first. (coreboot’s firmware trampoline pointedly skips it: “On hyper threaded cpus, invalidating the cache here is very very bad.”)"},{i:"LJMPW_RM(1f)",era:"8086",why:"A real-mode far jump that moves CS from the SIPI page down to the start of the kernel’s real-mode blob, so code and data can use their offsets within it. Safe here, unlike at the BSP’s reset vector: all of it lies below 1 MiB."},{i:"mov   %cs, %ax",era:"8086",why:"Code and data now share one real-mode segment: the kernel’s blob below 1 MiB…"},{i:"mov   %ax, %ds ; mov %ax, %es ; mov %ax, %ss",era:"8086",why:"…so every segment points at it."},{i:"LOCK_AND_LOAD_REALMODE_ESP",era:"386",why:"A lock btsl spinlock: only one AP at a time may use the shared real-mode stack. This is what makes parallel bring-up safe."},{i:"call  verify_cpu",era:"8086",why:"Unlike the BSP at reset, this code has a stack — the kernel put one below 1 MiB — so it can call a routine that checks the CPU supports long mode."},"...",{i:"lidtl tr_idt",era:"386",why:"A zero-length IDT, like the one the BSP’s reset code loaded: any exception now shuts down instead of vectoring into nowhere."},{i:"lgdtl tr_gdt",era:"386",why:"The trampoline’s GDT: a flat 32-bit code segment, a 64-bit code segment (L = 1), a flat data segment."},"...",{i:"movl  $(CR0_STATE & ~X86_CR0_PG), %eax",era:"386",why:"Protected mode on, paging still off."},{i:"movl  %eax, %cr0",era:"386",why:"1985: protected mode."},{i:"ljmpl $__KERNEL32_CS, $pa_startup_32",era:"386",why:"Far jump reloads CS with a 32-bit descriptor."},"...",{i:".code32",era:"",why:""},"...                     # startup_32: data segments, SME check",{i:"movl  pa_tr_cr4, %eax ; movl %eax, %cr4",era:"P5",why:"Enable PAE — physical address extension, a Pentium Pro (1995) feature long mode requires."},{i:"movl  $pa_trampoline_pgd, %eax ; movl %eax, %cr3",era:"386",why:"Point CR3 at the trampoline’s 4-level page tables."},{i:"movl  $MSR_EFER, %ecx ; rdmsr ; … ; wrmsr",era:"P5",why:"Set EFER.LME, the long-mode enable bit, in AMD’s Extended Feature Enable Register."},{i:"movl  $CR0_STATE, %eax ; movl %eax, %cr0",era:"386",why:"Turn paging on. With LME set, this activates long mode — in 32-bit compatibility mode until CS is reloaded."},{i:"ljmpl $__KERNEL_CS, $pa_startup_64",era:"386",why:"Load a code segment with L = 1. The AP is now a 64-bit AMD64 processor (2003)."},"...",{i:".code64",era:"",why:""},"...",{i:"jmpq  *tr_start(%rip)",era:"AMD64",why:"RIP-relative addressing — itself an AMD64 invention — jumps into the kernel proper: secondary_startup_64."}],Fo=["/* Assert INIT on the target CPU */","apic_icr_write(APIC_INT_LEVELTRIG | APIC_INT_ASSERT |","               APIC_DM_INIT, phys_apicid);","safe_apic_wait_icr_idle();","udelay(init_udelay);","/* Deassert INIT on the target CPU */","apic_icr_write(APIC_INT_LEVELTRIG | APIC_DM_INIT, phys_apicid);","...","for (j = 1; j <= num_starts; j++) {","    ...","    apic_icr_write(APIC_DM_STARTUP | (start_eip >> 12),","                   phys_apicid);","    ...","    if (init_udelay == 0)","        udelay(10);","    ...","}"];function U_(i,e,t){const n=[];for(let o=1;o<32;o++)qh(o)&&n.push(o);const s=n.length,r=new Map(n.map((o,l)=>[o,l])),a=Ye(i,e,t);return o=>{if(o===0)return"os";if($h(o))return"park";const l=r.get(o),c=l/s*.18,h=.06+l/s*.86,d=.86/s;return a<c?"park":a<c+.02?"wfs":a<h?"real":a<h+d*.45?"prot":"long"}}const F_=["pcore0","pcore1","pcore2","pcore3","pcore4","pcore5","pcore6","pcore7"],N_=["ecl0","ecl1","ecl2","ecl3"],O_=[{stage:4,title:"The OS knocks again",dur:11,real:.01,mode:"long",shot:"die",narration:["At hand-off the firmware leaves the 31 other threads halted in a tiny loop, in memory the OS has promised not to touch. The OS learns they exist from ACPI’s MADT table, which lists every APIC ID, by convention the boot processor first.","Then, for each AP in turn, Linux writes the boot CPU’s Local APIC Interrupt Command Register — the MMIO register at <code>FEE0_0300h</code>, or MSR <code>830h</code> when the kernel runs the APICs in x2APIC mode, as it often does on modern Intel: an <em>INIT</em>, which drops the AP straight back to its reset state, and two <em>Start-up IPIs</em> carrying a one-byte page number. The AP will begin executing in real mode at that page × 4096, a trampoline the kernel copied below 1 MiB."],note:{tag:"What INIT keeps",html:"INIT resets the registers and the APIC, but leaves caches, MTRRs, most MSRs and the SMM base the firmware set alone (SDM Table 12-1, §34.11). The ladder restarts; the housekeeping mostly doesn’t."},facts:[["ICR","FEE0_0300h (xAPIC) or MSR 830h (x2APIC, platform-dependent)"],["Per AP","INIT, then SIPI, SIPI — targeted, not broadcast"],["10 ms INIT delay","skipped on modern CPUs (init_udelay = 0)"]],regs:i=>({title:"BSP → Local APIC ICR (low dword)",note:"one AP shown",rows:[["INIT assert","0000C500",i>.15&&i<.4?"hot wide":"wide"],["INIT de-assert","00008500  (P6-era relic; now goes out as a plain INIT)",i>.35&&i<.55?"hot wide":"wide"],["SIPI × 2","000006VV  (VV = trampoline page)",i>.55&&i<.9?"hot wide":"wide"],["AP starts at","CS = VV00h, IP = 0 → VV000h",i>.85?"hot wide":"wide"]]}),code:{src:"Linux arch/x86/kernel/smpboot.c",href:W.smpboot[1],lines:Fo,at:i=>Math.min(Fo.length-1,Math.floor(Ye(i,.1,.95)*Fo.length))},mem:{on:["dram","mmio","lapic","flash","high"],hit:["lapic"],note:"ICR is an APIC register"},sources:[W.smpboot,W.acpi,W.sdm],lps:i=>e=>e===0?"os":e===2?i>.85?"real":i>.15?"wfs":"park":"park",act(i,e){e.die("pcore0",.7,L.dram,"glow"),e.die("sub:pcore0:l2",.3,L.dram,"glow");const t=nt(i,.1,.95);t>0&&(e.flow("ipi-pcore1","pcore0","pcore1",1.6*t,L.ipi,7),e.ring(.6*t,L.ipi)),e.die("pcore1",nt(i,.4,.6)*.25,"#ffffff","scan")},labels:[{id:"pcore0",text:"BSP: running the kernel",hot:!0}]},{stage:4,title:"Thirty-one more trips from 1978 to 2003",dur:14,real:.03,mode:"long",shot:[[0,"die"],[.55,"dieRight"]],narration:["Each AP wakes as an 8086 in the kernel’s trampoline; some eighty instructions later (sixty of them a CPU check, still in 16-bit mode) it is a 386, and about twenty more make it an AMD64. Watch the era tags again: <code>wbinvd</code> from the 486, CR4 and MSR access from the Pentium, RIP-relative jumps from AMD64 — PAE and <code>EFER.LME</code> are newer bits, written with older instructions.","They take turns. The BSP kicks each AP in quick succession without waiting for it, but the trampoline shares one real-mode stack, guarded by a lock: kicked APs spin on it in 16-bit code, and each climbs to 64-bit only when its turn comes, releasing the lock once it is on its own kernel stack. Since Linux 6.5, what overlaps is each AP’s early startup, microcode load included, up to an “alive” checkpoint; the BSP then releases them to finish one at a time. And all the primary threads (seven other P-core first threads and all sixteen E-cores) are online before the eight P-core sibling threads are even kicked, so a core’s microcode update is done before its second thread starts."],note:{tag:"Thread check",html:"“Every single core has to go through the same process” — every <em>thread</em> climbs the same mode ladder, and not just once: on a typical UEFI PC, once in 32-bit PEI, again for its SMM relocation, again in 64-bit DXE, and again here. But no AP ever runs the reset vector, cache-as-RAM, DRAM training or PCIe enumeration. They are fast mostly because they skip all that. Firmware wakes all 31 at once, and Linux overlaps their early startup."},facts:[["Order","23 primary threads (7 P + 16 E), then 8 P-core siblings"],["Climb","one AP at a time (trampoline lock); only early startup, to “alive”, overlaps"],["Per AP","350 µs – 3.5 ms to report alive (upstream measurements, various CPUs)"],["Big server","~800 ms → ~80 ms with parallel bring-up (2-socket Skylake)"]],code:{src:"Linux arch/x86/realmode/rm/trampoline_64.S",href:W.tramp[1],lines:Uo,at:i=>Math.min(Uo.length-1,Math.floor(Ye(i,.05,.5)*Uo.length)),title:"One AP’s trampoline"},mem:{on:["dram","mmio","lapic","flash","high"],hit:["dram"],note:"trampoline page below 1 MiB"},sources:[W.tramp,W.cpuhp,W.lkml65,W.head64],lps:i=>U_(i,.04,.97),act(i,e){e.die("pcore0",.5,L.dram,"glow");const t=nt(i,.04,.4),n=nt(i,.04,.9);e.die("kind:ecore_cluster",.2+n*.5,"#7fd8ff","sparkle"),e.die("kind:pcore",.15+t*.4,"#7fd8ff","sparkle"),F_.forEach((s,r)=>e.flow(`tr-${s}`,s,r%2?"dram1":"dram0",.8*t,L.dram,6)),N_.forEach((s,r)=>e.flow(`tr-${s}`,s,r%2?"dram1":"dram0",.8*n,L.dram,6)),e.die("kind:imc",.5*n,L.dram,"scan"),e.ring(.6*n,L.dram)},labels:[{id:"ecl1",text:"primary threads first (incl. all E-cores)"}]},{stage:4,title:"Checking in",dur:10,real:.02,mode:"long",shot:"die",narration:["Now in 64-bit mode with kernel page tables, each AP finds its own CPU number by reading its APIC ID, takes its own idle stack, and releases the trampoline’s lock for the next one.","Then the per-thread chores: check its microcode (skipped if current; a newer patch from the initramfs is loaded here, once per core), program its Local APIC, and ask CPUID leaf 1Ah what it is — <code>40h</code> for a Core (P-core), <code>20h</code> for an Atom (E-core). Finally it marks itself online and drops into the idle loop. Once the last thread is up, all 32 re-sync their memory-type registers with the boot CPU in one pass."],facts:[["CPUID.1AH:EAX[31:24]","40h = P-core · 20h = E-core"],["Microcode","MSR 79h written only if newer than what is running"],["Ends in","the kernel idle loop"]],regs:{title:"What each thread reports",rows:[["P-core thread","core type 40h (Core)"],["E-core","core type 20h (Atom)"],["P-cores","8 × 2 threads"],["E-cores","16 × 1 thread"],["Online","32 of 32","hot"]]},mem:{on:["dram","mmio","lapic","flash","high"],hit:["dram"]},sources:[W.head64,W.smpboot,W.ucodeLinux,W.sdm],lps:i=>e=>{if(e===0)return"os";if(qh(e))return i>.05+(e<16?e/2-1:e-9)/23*.42?"os":"long";const t=(e-1)/16;return i<.5+t*.03?"park":i<.515+t*.03?"wfs":i<.55+t*.08?"real":i<.56+t*.08?"prot":i<.64+t*.36?"long":"os"},act(i,e){e.die("kind:pcore",.3,"#f2f4ff","breathe"),e.die("kind:ecore_cluster",.3,"#f2f4ff","breathe"),e.ring(.4,"#f2f4ff")},labels:[{id:"pcore2",text:"then the P-core sibling threads",from:.5}]}],B_=[{stage:5,title:"Thirty-two threads, one machine",dur:16,hold:!0,real:.2,mode:"long",shot:"die",narration:["From the button to here: a coin-cell clock, a power supply proving itself, a 486-class security engine booting inside the chipset, a CPU patched from flash before its first instruction, an 8086 costume for twenty instructions, a 386 borrowing its own cache as RAM while it taught the DDR5 to talk, an AMD64 enumerating PCIe and loading a boot loader — and 31 other threads woken, parked, and woken again.","Biology has a phrase for an embryo replaying its ancestors’ forms as it develops: <em>ontogeny recapitulates phylogeny</em>. It turned out to be wrong for embryos. For an x86 PC it is very nearly true, every single boot — only Boot Guard’s check, run before the reset vector, breaks the order."],note:{tag:"Credit",html:'This walkthrough expands <a href="https://bsky.app/profile/lauriewired.bsky.social/post/3mxwk6hqb622v" target="_blank" rel="noopener">LaurieWired’s thread</a>, checked against Intel’s manuals and datasheets and the coreboot, EDK2 and Linux sources. The die is Fritzchens Fritz’s CC0 photograph of an i9-13900K, with the floorplan measured on it.'},facts:[["“…in a few milliseconds”","✗ on the boot CPU: real mode lasts µs, but 32-bit mode lasts until DXE — ~0.1 s or more on a normal boot, tens of seconds with new DDR5. Each AP’s own climb: µs"],["“15–30 instructions” in real mode","✓ 17 (EDK2), 21 (coreboot), 29 (Intel ADL reference)"],["“500 ns (ish)”","≈ only if Boot Guard pre-cached the code; ~15–60 µs uncached (estimate)"],["Real mode builds the stack","✗ it loads a GDT (and a null IDT) and sets PE; the stack comes in 32-bit mode"],["Cache-as-RAM, “NEM”","✓ on Intel; AMD Zen trains DRAM on its ARM security processor before x86 runs at all"],["Every core repeats the process","≈ every thread climbs the mode ladder again and again (PEI wake, SMM relocation, DXE wake, the OS); none repeat CAR, training or PCIe"],["Secondary cores wake in “Stage 4+”","✗ first woken at the end of Stage 2, right after DRAM and before Stage 3’s PCIe work; again in DXE and by the OS"],["Faster because RAM is warm","≈ mostly because they skip the slow work; firmware wakes them all at once, and Linux overlaps their early startup"]],sources:[W.thread,W.fritz,W.sdm,W.entry16,W.tramp,W.amd17],lps:()=>()=>"os",act(i,e,t){e.die("kind:pcore",.45,"#f2f4ff","sparkle"),e.die("kind:ecore_cluster",.45,"#f2f4ff","sparkle"),e.die("kind:llc_slice",.3,L.dram,"scan"),e.ring(.7,"#d8dcff"),e.die("kind:imc",.5,L.dram,"scan"),e.die("kind:ddr_phy",.5,L.dram,"scan"),e.die("pcie5",.4,L.pcie,"scan"),e.die("pcie4",.4,L.pcie,"scan"),e.die("dmi",.3,L.pcie,"scan"),e.flow("o1","pcore1","dram0",3,L.dram,6),e.flow("o2","ecl2","dram1",3,L.dram,6),e.flow("o3","pcore6","llc3",3,"#ffffff",6),e.flow("o4","ecl1","llc8",3,"#ffffff",6),e.bus("ddrA",.6,L.dram,{rate:12,speed:90}),e.bus("ddrB",.6,L.dram,{rate:12,speed:90}),e.bus("pcie16",.5,L.pcie,{rate:6,speed:90}),e.bus("pcie4",.5,L.pcie,{rate:6,speed:90}),e.board("gpu",.5,L.gpu,"scan"),e.board("nvme",.4,L.pcie,"scan")}}],jh=[{name:"Power",long:"Stage 0 — before the first instruction",color:"#ff6b81"},{name:"Real mode",long:"Stage 1 — 16-bit real mode, like an 8086 (1978)",color:"#ffb547"},{name:"Protected",long:"Stage 2 — 32-bit protected mode, like a 386 (1985): cache-as-RAM and DRAM training",color:"#4fe08a"},{name:"Long mode",long:"Stage 3 — 64-bit long mode, like AMD64 (2003): drivers, PCIe, GPU, bootloader",color:"#58a6ff"},{name:"Other cores",long:"Stage 4 — the 31 other hardware threads climb the same ladder",color:"#c79bff"},{name:"OS",long:"Stage 5 — the operating system owns the machine",color:"#f2f4ff"}],rs=[...y_,...E_,...R_,...I_,...O_,...B_];class k_{constructor(e){this.steps=e,this.i=0,this.p=0,this.playing=!1,this.speed=1,this.listeners=new Set,this.total=e.reduce((n,s)=>n+s.dur,0);let t=0;this.starts=e.map(n=>{const s=t;return t+=n.dur,s})}on(e){return this.listeners.add(e),()=>this.listeners.delete(e)}emit(e){for(const t of this.listeners)t(e,this)}get step(){return this.steps[this.i]}update(e){if(!this.playing)return;const t=this.step;this.p+=e*this.speed/t.dur,this.p>=1&&(t.hold?(this.p=1,this.playing=!1,this.emit("pause")):this.i<this.steps.length-1?(this.i++,this.p=0,this.emit("step")):(this.p=1,this.playing=!1,this.emit("pause")))}go(e,t=0){const n=Math.max(0,Math.min(this.steps.length-1,e)),s=n!==this.i;this.i=n,this.p=Math.max(0,Math.min(1,t)),s&&this.emit("step"),this.emit("seek")}next(){this.i<this.steps.length-1?this.go(this.i+1):this.go(this.i,1)}prev(){this.p>.08?this.go(this.i,0):this.go(this.i-1)}play(){this.i===this.steps.length-1&&this.p>=1&&this.go(0),this.playing=!0,this.emit("play")}pause(){this.playing=!1,this.emit("pause")}toggle(){this.playing?this.pause():this.play()}get global(){return(this.starts[this.i]+this.p*this.step.dur)/this.total}seekGlobal(e){const t=Math.max(0,Math.min(1,e))*this.total;let n=this.steps.length-1;for(let s=0;s<this.steps.length;s++)if(t<this.starts[s]+this.steps[s].dur){n=s;break}this.go(n,(t-this.starts[n])/this.steps[n].dur)}realTime(){const e=this.step,[t,n]=e.t||[0,0];return t<=0||n<=0||n<=t?t+(n-t)*this.p:t*Math.pow(n/t,this.p)}}const Ic={type:"change"},No={type:"start"},Uc={type:"end"},fr=new cs,Fc=new Un,G_=Math.cos(70*ma.DEG2RAD);class z_ extends _i{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:bi.ROTATE,MIDDLE:bi.DOLLY,RIGHT:bi.PAN},this.touches={ONE:xi.ROTATE,TWO:xi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(y){y.addEventListener("keydown",Ne),this._domElementKeyEvents=y},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Ne),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Ic),n.update(),r=s.NONE},this.update=function(){const y=new D,ae=new gi().setFromUnitVectors(e.up,new D(0,1,0)),Ae=ae.clone().invert(),Te=new D,me=new gi,U=new D,ye=2*Math.PI;return function(Be=null){const Oe=n.object.position;y.copy(Oe).sub(n.target),y.applyQuaternion(ae),o.setFromVector3(y),n.autoRotate&&r===s.NONE&&X(w(Be)),n.enableDamping?(o.theta+=l.theta*n.dampingFactor,o.phi+=l.phi*n.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let et=n.minAzimuthAngle,tt=n.maxAzimuthAngle;isFinite(et)&&isFinite(tt)&&(et<-Math.PI?et+=ye:et>Math.PI&&(et-=ye),tt<-Math.PI?tt+=ye:tt>Math.PI&&(tt-=ye),et<=tt?o.theta=Math.max(et,Math.min(tt,o.theta)):o.theta=o.theta>(et+tt)/2?Math.max(et,o.theta):Math.min(tt,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&A||n.object.isOrthographicCamera?o.radius=le(o.radius):o.radius=le(o.radius*c),y.setFromSpherical(o),y.applyQuaternion(Ae),Oe.copy(n.target).add(y),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),h.set(0,0,0));let dt=!1;if(n.zoomToCursor&&A){let gt=null;if(n.object.isPerspectiveCamera){const st=y.length();gt=le(st*c);const vt=st-gt;n.object.position.addScaledVector(T,vt),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const st=new D(I.x,I.y,0);st.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),dt=!0;const vt=new D(I.x,I.y,0);vt.unproject(n.object),n.object.position.sub(vt).add(st),n.object.updateMatrixWorld(),gt=y.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;gt!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(gt).add(n.object.position):(fr.origin.copy(n.object.position),fr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(fr.direction))<G_?e.lookAt(n.target):(Fc.setFromNormalAndCoplanarPoint(n.object.up,n.target),fr.intersectPlane(Fc,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),dt=!0);return c=1,A=!1,dt||Te.distanceToSquared(n.object.position)>a||8*(1-me.dot(n.object.quaternion))>a||U.distanceToSquared(n.target)>0?(n.dispatchEvent(Ic),Te.copy(n.object.position),me.copy(n.object.quaternion),U.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",J),n.domElement.removeEventListener("pointerdown",E),n.domElement.removeEventListener("pointercancel",Y),n.domElement.removeEventListener("wheel",ve),n.domElement.removeEventListener("pointermove",x),n.domElement.removeEventListener("pointerup",Y),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Ne),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const a=1e-6,o=new mc,l=new mc;let c=1;const h=new D,d=new Ie,p=new Ie,m=new Ie,g=new Ie,_=new Ie,f=new Ie,u=new Ie,b=new Ie,v=new Ie,T=new D,I=new Ie;let A=!1;const R=[],H={};let M=!1;function w(y){return y!==null?2*Math.PI/60*n.autoRotateSpeed*y:2*Math.PI/60/60*n.autoRotateSpeed}function z(y){const ae=Math.abs(y*.01);return Math.pow(.95,n.zoomSpeed*ae)}function X(y){l.theta-=y}function de(y){l.phi-=y}const F=function(){const y=new D;return function(Ae,Te){y.setFromMatrixColumn(Te,0),y.multiplyScalar(-Ae),h.add(y)}}(),B=function(){const y=new D;return function(Ae,Te){n.screenSpacePanning===!0?y.setFromMatrixColumn(Te,1):(y.setFromMatrixColumn(Te,0),y.crossVectors(n.object.up,y)),y.multiplyScalar(Ae),h.add(y)}}(),K=function(){const y=new D;return function(Ae,Te){const me=n.domElement;if(n.object.isPerspectiveCamera){const U=n.object.position;y.copy(U).sub(n.target);let ye=y.length();ye*=Math.tan(n.object.fov/2*Math.PI/180),F(2*Ae*ye/me.clientHeight,n.object.matrix),B(2*Te*ye/me.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(F(Ae*(n.object.right-n.object.left)/n.object.zoom/me.clientWidth,n.object.matrix),B(Te*(n.object.top-n.object.bottom)/n.object.zoom/me.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function oe(y){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=y:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function re(y){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=y:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function te(y,ae){if(!n.zoomToCursor)return;A=!0;const Ae=n.domElement.getBoundingClientRect(),Te=y-Ae.left,me=ae-Ae.top,U=Ae.width,ye=Ae.height;I.x=Te/U*2-1,I.y=-(me/ye)*2+1,T.set(I.x,I.y,1).unproject(n.object).sub(n.object.position).normalize()}function le(y){return Math.max(n.minDistance,Math.min(n.maxDistance,y))}function ue(y){d.set(y.clientX,y.clientY)}function ne(y){te(y.clientX,y.clientX),u.set(y.clientX,y.clientY)}function k(y){g.set(y.clientX,y.clientY)}function se(y){p.set(y.clientX,y.clientY),m.subVectors(p,d).multiplyScalar(n.rotateSpeed);const ae=n.domElement;X(2*Math.PI*m.x/ae.clientHeight),de(2*Math.PI*m.y/ae.clientHeight),d.copy(p),n.update()}function xe(y){b.set(y.clientX,y.clientY),v.subVectors(b,u),v.y>0?oe(z(v.y)):v.y<0&&re(z(v.y)),u.copy(b),n.update()}function V(y){_.set(y.clientX,y.clientY),f.subVectors(_,g).multiplyScalar(n.panSpeed),K(f.x,f.y),g.copy(_),n.update()}function ee(y){te(y.clientX,y.clientY),y.deltaY<0?re(z(y.deltaY)):y.deltaY>0&&oe(z(y.deltaY)),n.update()}function ge(y){let ae=!1;switch(y.code){case n.keys.UP:y.ctrlKey||y.metaKey||y.shiftKey?de(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):K(0,n.keyPanSpeed),ae=!0;break;case n.keys.BOTTOM:y.ctrlKey||y.metaKey||y.shiftKey?de(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):K(0,-n.keyPanSpeed),ae=!0;break;case n.keys.LEFT:y.ctrlKey||y.metaKey||y.shiftKey?X(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):K(n.keyPanSpeed,0),ae=!0;break;case n.keys.RIGHT:y.ctrlKey||y.metaKey||y.shiftKey?X(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):K(-n.keyPanSpeed,0),ae=!0;break}ae&&(y.preventDefault(),n.update())}function Me(y){if(R.length===1)d.set(y.pageX,y.pageY);else{const ae=N(y),Ae=.5*(y.pageX+ae.x),Te=.5*(y.pageY+ae.y);d.set(Ae,Te)}}function be(y){if(R.length===1)g.set(y.pageX,y.pageY);else{const ae=N(y),Ae=.5*(y.pageX+ae.x),Te=.5*(y.pageY+ae.y);g.set(Ae,Te)}}function De(y){const ae=N(y),Ae=y.pageX-ae.x,Te=y.pageY-ae.y,me=Math.sqrt(Ae*Ae+Te*Te);u.set(0,me)}function O(y){n.enableZoom&&De(y),n.enablePan&&be(y)}function We(y){n.enableZoom&&De(y),n.enableRotate&&Me(y)}function fe(y){if(R.length==1)p.set(y.pageX,y.pageY);else{const Ae=N(y),Te=.5*(y.pageX+Ae.x),me=.5*(y.pageY+Ae.y);p.set(Te,me)}m.subVectors(p,d).multiplyScalar(n.rotateSpeed);const ae=n.domElement;X(2*Math.PI*m.x/ae.clientHeight),de(2*Math.PI*m.y/ae.clientHeight),d.copy(p)}function he(y){if(R.length===1)_.set(y.pageX,y.pageY);else{const ae=N(y),Ae=.5*(y.pageX+ae.x),Te=.5*(y.pageY+ae.y);_.set(Ae,Te)}f.subVectors(_,g).multiplyScalar(n.panSpeed),K(f.x,f.y),g.copy(_)}function ce(y){const ae=N(y),Ae=y.pageX-ae.x,Te=y.pageY-ae.y,me=Math.sqrt(Ae*Ae+Te*Te);b.set(0,me),v.set(0,Math.pow(b.y/u.y,n.zoomSpeed)),oe(v.y),u.copy(b);const U=(y.pageX+ae.x)*.5,ye=(y.pageY+ae.y)*.5;te(U,ye)}function $e(y){n.enableZoom&&ce(y),n.enablePan&&he(y)}function Ue(y){n.enableZoom&&ce(y),n.enableRotate&&fe(y)}function E(y){n.enabled!==!1&&(R.length===0&&(n.domElement.setPointerCapture(y.pointerId),n.domElement.addEventListener("pointermove",x),n.domElement.addEventListener("pointerup",Y)),ie(y),y.pointerType==="touch"?C(y):_e(y))}function x(y){n.enabled!==!1&&(y.pointerType==="touch"?P(y):pe(y))}function Y(y){$(y),R.length===0&&(n.domElement.releasePointerCapture(y.pointerId),n.domElement.removeEventListener("pointermove",x),n.domElement.removeEventListener("pointerup",Y)),n.dispatchEvent(Uc),r=s.NONE}function _e(y){let ae;switch(y.button){case 0:ae=n.mouseButtons.LEFT;break;case 1:ae=n.mouseButtons.MIDDLE;break;case 2:ae=n.mouseButtons.RIGHT;break;default:ae=-1}switch(ae){case bi.DOLLY:if(n.enableZoom===!1)return;ne(y),r=s.DOLLY;break;case bi.ROTATE:if(y.ctrlKey||y.metaKey||y.shiftKey){if(n.enablePan===!1)return;k(y),r=s.PAN}else{if(n.enableRotate===!1)return;ue(y),r=s.ROTATE}break;case bi.PAN:if(y.ctrlKey||y.metaKey||y.shiftKey){if(n.enableRotate===!1)return;ue(y),r=s.ROTATE}else{if(n.enablePan===!1)return;k(y),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(No)}function pe(y){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;se(y);break;case s.DOLLY:if(n.enableZoom===!1)return;xe(y);break;case s.PAN:if(n.enablePan===!1)return;V(y);break}}function ve(y){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(y.preventDefault(),n.dispatchEvent(No),ee(Le(y)),n.dispatchEvent(Uc))}function Le(y){const ae=y.deltaMode,Ae={clientX:y.clientX,clientY:y.clientY,deltaY:y.deltaY};switch(ae){case 1:Ae.deltaY*=16;break;case 2:Ae.deltaY*=100;break}return y.ctrlKey&&!M&&(Ae.deltaY*=10),Ae}function Ee(y){y.key==="Control"&&(M=!0,document.addEventListener("keyup",Re,{passive:!0,capture:!0}))}function Re(y){y.key==="Control"&&(M=!1,document.removeEventListener("keyup",Re,{passive:!0,capture:!0}))}function Ne(y){n.enabled===!1||n.enablePan===!1||ge(y)}function C(y){switch(q(y),R.length){case 1:switch(n.touches.ONE){case xi.ROTATE:if(n.enableRotate===!1)return;Me(y),r=s.TOUCH_ROTATE;break;case xi.PAN:if(n.enablePan===!1)return;be(y),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case xi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;O(y),r=s.TOUCH_DOLLY_PAN;break;case xi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;We(y),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(No)}function P(y){switch(q(y),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;fe(y),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;he(y),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;$e(y),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Ue(y),n.update();break;default:r=s.NONE}}function J(y){n.enabled!==!1&&y.preventDefault()}function ie(y){R.push(y.pointerId)}function $(y){delete H[y.pointerId];for(let ae=0;ae<R.length;ae++)if(R[ae]==y.pointerId){R.splice(ae,1);return}}function q(y){let ae=H[y.pointerId];ae===void 0&&(ae=new Ie,H[y.pointerId]=ae),ae.set(y.pageX,y.pageY)}function N(y){const ae=y.pointerId===R[0]?R[1]:R[0];return H[ae]}n.domElement.addEventListener("contextmenu",J),n.domElement.addEventListener("pointerdown",E),n.domElement.addEventListener("pointercancel",Y),n.domElement.addEventListener("wheel",ve,{passive:!1}),document.addEventListener("keydown",Ee,{passive:!0,capture:!0}),this.update()}}class H_{constructor(e,t,n){this.camera=e,this.shots=n,this.controls=new z_(e,t),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=4,this.controls.maxDistance=2e3,this.controls.maxPolarAngle=Math.PI*.49,this.controls.zoomSpeed=.8,this.flight=null,this.current=null,this.backoff=1,this.userMoved=!1,this.controls.addEventListener("start",()=>{this.flight=null,this.userMoved=!0})}shotFor(e){const t=this.shots[e];if(!t)return null;const n=typeof t=="function"?t():{...t,pos:t.pos.clone(),target:t.target.clone()},s=this.backoff;return s!==1&&n.pos.sub(n.target).multiplyScalar(s).add(n.target),n}setFrame(e,t){this.backoff=Math.max(1,.826/e,.99/t)}go(e,{duration:t=1.8,instant:n=!1}={}){if(!e||e===this.current&&!this.userMoved&&!n)return;const s=this.shotFor(e);if(!s)return;this.current=e,this.userMoved=!1;const r=this.camera.position.clone(),a=this.controls.target.clone(),o=this.camera.fov,l=s.pos.clone(),c=s.target.clone(),h=s.fov||40;if(n){this.camera.position.copy(l),this.controls.target.copy(c),this.camera.fov=h,this.camera.updateProjectionMatrix(),this.flight=null,this.controls.update();return}const d=r.distanceTo(l);this.flight={t:0,duration:Math.max(.9,Math.min(t,.8+d/160)),fromPos:r,fromTarget:a,toPos:l,toTarget:c,fromFov:o,toFov:h,lift:Math.min(60,d*.18)}}update(e){const t=this.flight;if(t){t.t+=e/t.duration;const n=t_(Math.min(1,t.t)),s=new D().lerpVectors(t.fromPos,t.toPos,n);s.y+=Math.sin(Math.PI*n)*t.lift,this.camera.position.copy(s),this.controls.target.lerpVectors(t.fromTarget,t.toTarget,n),this.camera.fov=t.fromFov+(t.toFov-t.fromFov)*n,this.camera.updateProjectionMatrix(),t.t>=1&&(this.flight=null)}this.controls.update()}dieCloseness(e){const t=this.camera.position.distanceTo(e)/this.backoff;return ma.clamp((140-t)/90,0,1)}}const tn=64,hn=48,Ss=i=>Math.max(0,Math.min(1,i)),Nc=new Map,V_=(i,e,t)=>{const n=Ss((t-i)/(e-i));return n*n*(3-2*n)};function Zh(i){const e=Math.min(2,window.devicePixelRatio||1),t=Math.max(180,Math.round(i.clientWidth||280)),n=Math.round(t*300/560);(i.width!==Math.round(t*e)||i.height!==Math.round(n*e))&&(i.width=Math.round(t*e),i.height=Math.round(n*e));const s=i.getContext("2d");return s.setTransform(e,0,0,e,0,0),{g:s,W:t,H:n,dpr:e}}const Es="ui-monospace, Menlo, monospace";function W_(i,e,t,n){if(e.kind==="flyby")return X_(i,e,t,n);const{g:s,W:r,H:a,dpr:o}=Zh(i);s.fillStyle="#05070d",s.fillRect(0,0,r,a);const l=20,c=16,h=6,d=r-l-10,p=a-c-h,m=ne=>l+ne*d,g=ne=>h+(1-ne)*p;s.strokeStyle="rgba(120,130,170,0.12)",s.lineWidth=1;for(let ne=0;ne<=8;ne++)s.beginPath(),s.moveTo(m(ne/8),g(0)),s.lineTo(m(ne/8),g(1)),s.stroke();for(let ne=0;ne<=6;ne++)s.beginPath(),s.moveTo(m(0),g(ne/6)),s.lineTo(m(1),g(ne/6)),s.stroke();const _=Rr(e.seed||7),f=.5+(_()-.5)*.18,u=.5+(_()-.5)*.12,b=e.kind==="write"?.19:.21,v=e.kind==="write"?.32:.36,T=(ne,k)=>{const se=Math.abs(k-u)/v;if(se>=1)return!1;const xe=b*Math.pow(1-se,.8),V=(Math.sin(ne*91+k*37)+Math.sin(k*53))*.006;return Math.abs(ne-f)<xe+V},I=Rr((e.seed||7)+11);s.globalCompositeOperation="lighter";for(let ne=0;ne<52;ne++){const k=(I()-.5)*.08+Math.sin(n*3+ne)*.005,se=(I()-.5)*.06,xe=I()<.5?0:1,V=I()<.5?0:1,ee=I()<.5?0:1,ge=(I()-.5)*.1;s.strokeStyle=`rgba(80, 220, 255, ${.11+I()*.06})`,s.lineWidth=1.1,s.beginPath();for(let Me=0;Me<=120;Me++){const be=Me/120,De=f-.5+k,O=f+.5+k,We=(he,ce,$e)=>he+(ce-he)*(.5+.5*Math.tanh((be-$e)/.03));let fe=be<f?We(xe,V,De):We(V,ee,O);fe=u-.42+fe*.84+se*.5+(V===xe?0:ge),Me===0?s.moveTo(m(be),g(fe)):s.lineTo(m(be),g(fe))}s.stroke()}s.globalCompositeOperation="source-over";const A=d/tn,R=p/hn,H=Math.floor(hn/2),M=(ne,k,se)=>{s.fillStyle=se?"rgba(79, 224, 138, 0.42)":"rgba(255, 70, 90, 0.16)",s.fillRect(m(0)+ne*A+.5,g(1)+(hn-1-k)*R+.5,A-1,R-1)},w=(ne,k)=>T((ne+.5)/tn,(k+.5)/hn),z=Ss(t/.16),X=Ss((t-.16)/.14),de=Ss((t-.3)/.55),F=Math.floor(de*tn*hn);if(F>0){const ne=`${e.kind}:${e.seed||7}:${r}x${a}`;let k=Nc.get(`${ne}@${o}`);if(!k){k=document.createElement("canvas"),k.width=Math.round(r*o),k.height=Math.round(a*o);const ee=k.getContext("2d");ee.setTransform(o,0,0,o,0,0);for(let ge=0;ge<hn;ge++)for(let Me=0;Me<tn;Me++)ee.fillStyle=w(Me,ge)?"rgba(79, 224, 138, 0.42)":"rgba(255, 70, 90, 0.16)",ee.fillRect(m(0)+Me*A+.5,g(1)+(hn-1-ge)*R+.5,A-1,R-1);Nc.set(`${ne}@${o}`,k)}const se=(ee,ge,Me,be)=>s.drawImage(k,ee*o,ge*o,Me*o,be*o,ee,ge,Me,be),xe=Math.floor(F/tn),V=F%tn;if(xe>0){const ee=g(1)+(hn-xe)*R;se(m(0),ee,d,xe*R)}if(V>0){const ee=g(1)+(hn-1-xe)*R;se(m(0),ee,V*A,R)}}const B=Math.floor(z*tn);for(let ne=0;ne<B;ne++)M(ne,H,w(ne,H));let K=tn,oe=-1;for(let ne=0;ne<tn;ne++)w(ne,H)&&(K=Math.min(K,ne),oe=Math.max(oe,ne));const re=oe>=K?Math.round((K+oe)/2):tn/2,te=Math.floor(X*hn);for(let ne=0;ne<te;ne++)M(re,ne,w(re,ne));let le=null;if(z>0&&z<1?le=[B,H]:X>0&&X<1?le=[re,te]:de>0&&de<1&&(le=[F%tn,Math.floor(F/tn)]),le&&(s.strokeStyle="#fff",s.lineWidth=1.5,s.strokeRect(m(0)+le[0]*A,g(1)+(hn-1-le[1])*R,A,R)),t>.85){const ne=V_(.85,.93,t),k=m(f),se=g(u),xe=.235*d,V=60/260*p;e.kind==="write"&&(s.strokeStyle=`rgba(255, 255, 255, ${.8*ne})`,s.setLineDash([3,3]),s.beginPath(),s.moveTo(k-xe/2,se),s.lineTo(k,se-V/2),s.lineTo(k+xe/2,se),s.lineTo(k,se+V/2),s.closePath(),s.stroke(),s.setLineDash([])),s.strokeStyle=`rgba(255, 207, 107, ${ne})`,s.lineWidth=2,s.beginPath(),s.moveTo(k-8,se),s.lineTo(k+8,se),s.moveTo(k,se-8),s.lineTo(k,se+8),s.stroke(),s.fillStyle=`rgba(255, 207, 107, ${ne})`,s.font=`600 11px ${Es}`,s.textAlign="left",s.fillText("centre → saved",Math.min(r-98,k+xe/2+4),se-5),s.fillStyle=`rgba(255, 255, 255, ${.75*ne})`,s.font=`10px ${Es}`,e.kind==="write"&&s.fillText("JEDEC min eye",Math.min(r-84,k+xe/2+4),se+12)}s.fillStyle="rgba(160,170,200,0.85)",s.font=`10px ${Es}`,s.textAlign="center",s.save(),s.translate(9,g(.5)),s.rotate(-Math.PI/2),s.fillText(e.kind==="write"?"DRAM VrefDQ":"host Vref",0,3),s.restore(),s.fillText("−½ UI",m(0)+16,a-4),s.fillText("+½ UI",m(1)-16,a-4);const ue=t<.16?"1-D: timing at nominal Vref":t<.3?"1-D: Vref at the timing centre":t<.85?"2-D raster: each point is one test burst":"parked in the middle";return r<240?`${ue} · 1 UI = 178.6 ps`:`${ue} · strobe delay across 1 UI = 178.6 ps`}function X_(i,e,t,n){const{g:s,W:r,H:a}=Zh(i);s.fillStyle="#05070d",s.fillRect(0,0,r,a);const o=4,l=44,c=r-10,h=(c-l)/o,d=22;s.strokeStyle="rgba(255, 181, 71, 0.75)",s.lineWidth=2,s.beginPath(),s.moveTo(8,d),s.lineTo(c,d),s.stroke(),s.fillStyle="rgba(255, 181, 71, 0.9)",s.font=`10px ${Es}`,s.textAlign="left",s.fillText("CK + CA (fly-by)",8,d-7);const p=n*.6%1;s.fillStyle="#ffcf6b",s.beginPath(),s.arc(8+p*(c-8),d,3,0,Math.PI*2),s.fill();const m=42,g=(a-m-4)/o,_=l+4,f=r-10,u=b=>_+b*(f-_);for(let b=0;b<o;b++){const v=m+b*g,T=l+h*(b+.5);s.fillStyle="#1a1f2c",s.fillRect(T-18,d+4,36,13),s.fillStyle="#8aa0c8",s.font=`9.5px ${Es}`,s.textAlign="center",s.fillText(`DRAM ${b}`,T,d+14),s.strokeStyle="rgba(120,130,170,0.25)",s.beginPath(),s.moveTo(_,v+g*.6),s.lineTo(f,v+g*.6),s.stroke(),s.fillStyle="#8aa0c8",s.textAlign="right",s.fillText(`byte ${b}`,_-6,v+g*.6+4);const I=.25+b*.13;s.strokeStyle="rgba(255, 181, 71, 0.9)",s.lineWidth=2,s.beginPath(),s.moveTo(u(I),v+g*.2),s.lineTo(u(I),v+g*.9),s.stroke();const R=.08+Ss((t-.08-b*.04)/.62)*.8,H=R>=I,M=H?I:R;s.fillStyle=H?"#4fe08a":"#7cf2ff",s.fillRect(u(M)-3,v+g*.35,6,g*.5),s.fillStyle=H?"#4fe08a":"rgba(200,210,235,0.7)",s.textAlign="left",s.fillText(H?"0→1 ✓":"0",u(Math.min(.86,M))+6,v+g*.62)}return r<240?"orange: clock edge at each chip · blue: that byte’s strobe (DQS)":"orange: the clock edge as each chip sees it · blue: that byte’s write strobe (DQS), slid later until the chip’s feedback flips 0 → 1"}const He=i=>document.querySelector(i),Y_=[{mode:"real",bits:"16-bit real",era:"8086 · 1978",c:gn.real},{mode:"prot",bits:"32-bit protected",era:"80386 · 1985",c:gn.prot},{mode:"long",bits:"64-bit long",era:"AMD64 · 2003",c:gn.long}],$_=[{id:"dram",label:"DRAM",sub:"0 → TOLUD: DRAM below the 32-bit MMIO hole",flex:30,c:"#7cf2ff"},{gap:!0},{id:"mmio",label:"MMIO",sub:"PCIe BARs + ECAM configuration space",flex:15,c:"#a78bff"},{gap:!0},{id:"car",label:"CAR",sub:"cache lines pinned as RAM (no DRAM behind them)",flex:9,c:"#ff6bd5"},{id:"lapic",label:"APIC",sub:"local APIC at FEE0_0000",flex:8,c:"#ffffff"},{id:"flash",label:"flash",sub:"BIOS region, top 16 MiB below 4 GiB",flex:10,c:"#ffcf6b"},{four:!0},{id:"high",label:"DRAM",sub:"DRAM remapped above 4 GiB",flex:20,c:"#7cf2ff"}],q_={off:-1,reset:-1,wfs:-1,real:0,prot:1,long:2,park:2,os:2};class K_{constructor({timeline:e,stages:t,lpLayout:n,onSpeed:s}){this.tl=e,this.stages=t,this.lastStep=-1,this.codeLines=[],this.labelEls=new Map,this.speeds=[.25,.5,1,2,4],this.speedIdx=2,this.onSpeed=s,this.buildStages(),this.buildTimeline(),this.buildLps(n),this.bindControls()}buildStages(){const e=He("#stages");e.innerHTML="",this.stageBtns=this.stages.map((t,n)=>{const s=document.createElement("button");return s.type="button",s.style.setProperty("--c",t.color),s.innerHTML=`<span class="n">${n}</span><span>${t.name}</span>`,s.title=t.long,s.addEventListener("click",()=>{const r=this.tl.steps.findIndex(a=>a.stage===n);r>=0&&this.tl.go(r)}),e.appendChild(s),s})}buildTimeline(){const e=He("#segments"),t=He("#ticks");e.innerHTML="",t.innerHTML="",He("#track").title="";const n=[];this.tl.steps.forEach((s,r)=>{const a=n[n.length-1];a&&a.stage===s.stage?a.end=r:n.push({stage:s.stage,start:r,end:r})}),this.runs=n.map(s=>{const r=this.tl.starts[s.start]/this.tl.total,a=(this.tl.starts[s.end]+this.tl.steps[s.end].dur)/this.tl.total,o=document.createElement("div");o.className="seg",o.style.flex=`${a-r} 1 0`;const l=this.stages[s.stage];return o.style.setProperty("--c",l.color),o.innerHTML=`<div class="fill"></div><div class="lbl">${l.name}</div>`,o.title=l.long,e.appendChild(o),{...s,a:r,b:a,el:o,fill:o.firstChild}}),this.tickEls=this.tl.steps.map((s,r)=>{const a=document.createElement("i");return a.style.left=`${this.tl.starts[r]/this.tl.total*100}%`,a.title=s.title,t.appendChild(a),a})}buildLps(e){const t=He("#lps");t.innerHTML="",this.lpCells=[];const n=document.createElement("div");n.className="count",t.appendChild(n),this.lpCount=n;const s=document.createElement("div");s.className="row",s.innerHTML='<span class="lab">P-cores</span>';const r=document.createElement("div");r.className="row",r.innerHTML='<span class="lab">E-cores</span>';let a=null;e.forEach((l,c)=>{const h=document.createElement("div");h.className=`cell ${l.kind}`,h.title=l.label,l.kind==="p"?(c%2===0&&(a=document.createElement("div"),a.className="pc",s.appendChild(a)),a.appendChild(h)):r.appendChild(h),this.lpCells.push(h)}),t.appendChild(s),t.appendChild(r);const o=document.createElement("div");o.className="legend",o.innerHTML=["wfs","real","prot","long","park","os"].map(l=>`<span><i style="background:${gn[l]}"></i>${_c[l]}</span>`).join(""),t.appendChild(o),this.lpModes=e.map(()=>"off")}bindControls(){He("#play").addEventListener("click",()=>this.tl.toggle()),He("#next").addEventListener("click",()=>this.tl.next()),He("#prev").addEventListener("click",()=>this.tl.prev()),He("#speed").addEventListener("click",()=>{var o;this.speedIdx=(this.speedIdx+1)%this.speeds.length;const a=this.speeds[this.speedIdx];He("#speed").textContent=`${a}×`,He("#speed").setAttribute("aria-label",`Playback speed ${a}×`),(o=this.onSpeed)==null||o.call(this,a)});for(const a of["pointerdown","wheel","touchstart"])He("#panel").addEventListener(a,()=>{this.tl.playing&&this.tl.pause()},{passive:!0});const e=He("#track");let t=!1;const n=a=>{const o=e.getBoundingClientRect();this.tl.seekGlobal((a.clientX-o.left)/o.width)};e.addEventListener("pointerdown",a=>{t=!0,e.setPointerCapture(a.pointerId),n(a)});const s=He("#tracktip");e.addEventListener("pointermove",a=>{t&&n(a);const o=e.getBoundingClientRect(),l=Math.max(0,Math.min(1,(a.clientX-o.left)/o.width))*this.tl.total;let c=this.tl.steps.length-1;for(let h=0;h<this.tl.steps.length;h++)if(l<this.tl.starts[h]+this.tl.steps[h].dur){c=h;break}s.hidden=!1,s.innerHTML=`<span>${c+1}</span>${this.tl.steps[c].title}`,s.style.left=`${a.clientX-o.left}px`}),e.addEventListener("pointerleave",()=>s.hidden=!0),e.addEventListener("pointerup",()=>t=!1),e.addEventListener("pointercancel",()=>t=!1),e.addEventListener("lostpointercapture",()=>t=!1);const r=a=>{const o=this.tl.steps,l=o[this.tl.i].stage;if(a>0){const h=o.findIndex(d=>d.stage>l);return h<0?o.length-1:h}const c=o.findIndex(h=>h.stage===l);return c<this.tl.i?c:Math.max(0,o.findIndex(h=>h.stage===l-1))};e.addEventListener("keydown",a=>{const o=this.tl.steps.length;if(a.key==="ArrowRight"||a.key==="ArrowUp")this.tl.next();else if(a.key==="ArrowLeft"||a.key==="ArrowDown")this.tl.prev();else if(a.key==="Home")this.tl.go(0);else if(a.key==="End")this.tl.go(o-1);else if(a.key==="PageUp")this.tl.go(r(1));else if(a.key==="PageDown")this.tl.go(r(-1));else return;a.preventDefault()}),window.addEventListener("keydown",a=>{var l,c;const o=a.target;if(!((l=o.closest)!=null&&l.call(o,"input, textarea, select")))if(a.key===" "){if((c=o.closest)!=null&&c.call(o,"button")&&!o.closest("#play, #power"))return;a.preventDefault(),document.body.classList.contains("intro")?He("#power").click():this.tl.toggle()}else a.key==="ArrowRight"&&o!==e?this.tl.next():a.key==="ArrowLeft"&&o!==e&&this.tl.prev()})}renderStep(e,t){var h;const n=this.stages[e.stage],s=He("#stepmeta");s.style.setProperty("--c",n.color),s.innerHTML=`<span class="stage">Stage ${e.stage} · ${n.name}</span><span class="lpmini" title="logical processors executing"></span><span>${t+1} / ${this.tl.steps.length}</span>`,this.lpMini=s.querySelector(".lpmini"),this.lpMiniText=null,He("#title").textContent=e.title,this.ladderMode=null,He("#narration").innerHTML=(e.narration||[]).map(d=>`<p>${d}</p>`).join("");const r=He("#note");r.innerHTML=e.note?`<span class="tag">${e.note.tag}</span>${e.note.html}`:"",He("#facts").innerHTML=(e.facts||[]).map(([d,p])=>`<dt>${d}</dt><dd>${p}</dd>`).join("");const a=He("#memmap");a.hidden=!e.mem,e.mem&&(He("#memnote").textContent=e.mem.note||"",a.querySelector(".bar").innerHTML=$_.map(d=>{var g,_;if(d.gap)return'<div class="m gap"></div>';if(d.four)return'<div class="m four" title="4 GiB boundary"></div>';const p=(g=e.mem.on)==null?void 0:g.includes(d.id),m=(_=e.mem.hit)==null?void 0:_.includes(d.id);return`<div class="m ${p?"on":""} ${m?"hit":""}" style="flex:${d.flex} 1 0;--c:${d.c}" title="${d.sub}${p?"":" — nothing answers here yet"}">${d.label}</div>`}).join("")),this.regsKey="",e.regs||(He("#regs").innerHTML="");const o=He("#code");if(e.code){const d=e.code.href?`<a href="${e.code.href}" target="_blank" rel="noopener">${e.code.src}</a>`:e.code.src||"",p=Z_(e.code);this.codeKinds=Q_(e.code.lines,p),this.codeIndent=e.code.lines.map(g=>ev(typeof g=="string"?g:g.i??"")),this.codeRef=!!e.code.ref||!this.codeKinds.includes("code");const m=e.code.title||(this.codeRef?"From the source":"Executing");o.classList.toggle("ref",this.codeRef),o.innerHTML=`<h3>${m}<span>${d}</span></h3><pre>${e.code.lines.map(g=>J_(g,p)).join("")}</pre><div class="explain"></div>`,this.codeLines=[...o.querySelectorAll(".ln")],this.codeExplain=o.querySelector(".explain"),this.lastOn=null}else o.innerHTML="",o.classList.remove("ref"),this.codeLines=[];He("#sources").innerHTML=(h=e.sources)!=null&&h.length?"Sources: "+e.sources.map(([d,p])=>`<a href="${p}" target="_blank" rel="noopener">${d}</a>`).join(" · "):"",He("#panel").scrollTop=0,this.stageBtns.forEach((d,p)=>{d.classList.toggle("on",p===e.stage),d.classList.toggle("past",p<e.stage),p===e.stage?d.setAttribute("aria-current","step"):d.removeAttribute("aria-current")});const l=this.tl.steps.length,c=He("#track");c.setAttribute("aria-valuemin","1"),c.setAttribute("aria-valuemax",String(l)),c.setAttribute("aria-valuenow",String(t+1)),c.setAttribute("aria-valuetext",`Step ${t+1} of ${l}: ${e.title} (${n.name})`),clearTimeout(this.srT),this.srT=setTimeout(()=>{He("#sr-step").textContent=`Step ${t+1} of ${l}: ${e.title}`},400),this.tickEls.forEach((d,p)=>d.classList.toggle("on",p===t)),He("#eye").hidden=!e.eye,this.obstaclesDirty=!0,e.eye&&(He("#eyetitle").textContent=e.eye.title,He("#eyesub").textContent=e.eye.sub||"")}frame({realT:e,resetT:t,lpModes:n,step:s,p:r,time:a,ctx:o}){var m;const l=this.tl.i;l!==this.lastStep&&(this.lastStep=l,this.renderStep(s,l));const c=this.tl.global;He("#playhead").style.left=`${c*100}%`;for(const g of this.runs){const _=ss((c-g.a)/(g.b-g.a));g.fill.style.width=`${_*100}%`}He("#play").textContent=this.tl.playing?"❚❚":"▶",He("#play").setAttribute("aria-label",this.tl.playing?"Pause":"Play"),He("#clockmain").textContent=e<=0?"t = 0":`t ≈ ${ia(e)}`,He("#clocksub").textContent=t==null?"since the power button":`since power button · ${ia(t)} since the reset vector`;const h=typeof s.mode=="function"?s.mode(r):s.mode;if(h!==this.ladderMode){this.ladderMode=h;const g=q_[h]??-1;He("#ladder").innerHTML=Y_.map((_,f)=>`<div class="rung ${f===g?"on":f<g&&s.stage>=1?"done":""}" style="--c:${_.c}"><b>${_.bits}</b>${_.era}</div>`).join(""),He("#ladder").title=g<0?"No BIOS instruction has executed yet":""}if(s.regs){const g=typeof s.regs=="function"?s.regs(r,o):s.regs,_=JSON.stringify(g);if(_!==this.regsKey){const f=this.regsPrev&&this.regsStep===l?this.regsPrev:null;this.regsKey=_,this.regsStep=l,this.regsPrev=Object.fromEntries(g.rows.map(([u,b])=>[u,b])),He("#regs").innerHTML=`<h3>${g.title||"State"}<span>${g.note||""}</span></h3><div class="grid">${g.rows.map(([u,b,v=""])=>{const T=f&&f[u]!==void 0&&f[u]!==b?" flash":"",I=String(u).length+String(b).length>20&&!v.includes("wide")?" wide":"";return`<div class="r ${v}${I}${T}"><span class="k">${u}</span><span class="v" title="${b}">${b}</span></div>`}).join("")}</div>`}}if(this.codeLines.length&&((m=s.code)!=null&&m.at)&&!this.codeRef){const g=tv(this.codeKinds,this.codeIndent,s.code.at(r));this.codeLines.forEach((f,u)=>{f.classList.toggle("on",u===g),f.classList.toggle("done",u<g)});const _=this.codeLines[g];if(_&&_!==this.lastOn){this.lastOn=_;const f=_.parentElement;f.scrollTop=_.offsetTop-f.offsetTop-(f.clientHeight-_.offsetHeight)/2;const u=s.code.lines[g],b=typeof u=="object"?u.why:"";this.codeExplain.innerHTML=b?`<b>${Jh(typeof u=="object"?u.i:u)}</b> — ${b}`:""}}let d=0;n.forEach((g,_)=>{if(g!==this.lpModes[_]){this.lpModes[_]=g;const f=this.lpCells[_];f.style.background=gn[g],f.style.boxShadow=g==="off"||g==="reset"?"none":`0 0 6px ${gn[g]}88`,f.title=`${f.title.split(" —")[0]} — ${_c[g]}`}(g==="real"||g==="prot"||g==="long"||g==="os")&&d++}),this.lpCount.textContent=`${d} of ${n.length} logical processors executing`;const p=`${d}/${n.length} threads`;if(p!==this.lpMiniText&&(this.lpMiniText=p,this.lpMini.textContent=p),s.eye){const g=W_(He("#eyecanvas"),s.eye,r,a);g!==this.eyeCap&&(this.eyeCap=g,He("#eye .eyeaxes span").textContent=g)}}labels(e,t,n,s){var m,g;const r=He("#labels"),a=new Set,o=((m=this.view)==null?void 0:m.right)??n,l=((g=this.view)==null?void 0:g.bottom)??s,c=[];for(const _ of e){a.add(_.id);let f=this.labelEls.get(_.id);f||(f=document.createElement("div"),f.className="l",r.appendChild(f),this.labelEls.set(_.id,f)),f.textContent!==_.text&&(f.textContent=_.text,f.bw=null),f.classList.toggle("hot",!!_.hot),_.color?f.style.setProperty("--lc",_.color):f.style.removeProperty("--lc");const u=_.pos.clone().project(t),b=(u.x+1)/2*n,v=(1-u.y)/2*s-10,T=u.z<1&&b>-20&&b<o+20&&v>16&&v<l;f.style.opacity=T?_.dim?.55:1:0,f.bw==null&&(f.bw=f.offsetWidth,f.bh=f.offsetHeight),c.push({el:f,x:b,y:v,vis:T,hot:!!_.hot,bw:f.bw,bh:f.bh})}(this.obstaclesDirty||!this.obstacles)&&(this.obstaclesDirty=!1,this.obstacles=["#brand","#stages","#lps","#inset","#eye","#vhud","#vcap"].map(_=>He(_)).filter(_=>_&&!_.hidden&&getComputedStyle(_).display!=="none").map(_=>{const f=_.getBoundingClientRect();if(_.id!=="inset")return f;const u=_.querySelector(".lbl").getBoundingClientRect(),b=Math.min(f.left,u.left);return new DOMRect(b,f.top,Math.max(f.right,u.right)-b,Math.max(f.bottom,u.bottom)-f.top)}).filter(_=>_.width>0&&_.height>0));const h=document.body.classList.contains("intro")?[]:this.obstacles,d=(_,f,u)=>h.find(b=>_+u.bw/2>b.left-2&&_-u.bw/2<b.right+2&&f>b.top-2&&f-u.bh<b.bottom+2);c.sort((_,f)=>f.hot-_.hot||f.y-_.y);const p=[];for(const _ of c){const f=_.bw/2+6;let u=Math.max(f,Math.min(o-f,_.x)),b=_.y;const v=_.vis&&d(u,b,_);if(v){const A=[[v.right+f+2,b],[v.left-f-2,b],[u,v.bottom+_.bh+4],[u,v.top-4]].find(([R,H])=>R>=f&&R<=o-f&&H-_.bh>=16&&H<=l&&!d(R,H,_));A?[u,b]=A:_.hot||(_.el.style.opacity=0)}if(_.vis){const I=R=>p.find(H=>Math.abs(H.cx-u)<(H.bw+_.bw)/2+4&&R-_.bh<H.top+2&&H.top-H.bh<R+2);let A=!1;for(let R=0;R<6;R++){const H=I(b);if(!H)break;const M=H.top-H.bh-3;!A&&M-_.bh>=16&&!d(u,M,_)?b=M:(A=!0,b=H.top+_.bh+3)}!_.hot&&(d(u,b,_)||I(b)||b>l)&&(_.el.style.opacity=0),p.push({cx:u,top:b,bw:_.bw,bh:_.bh})}_.el.style.left=`${u}px`,_.el.style.top=`${b}px`,_.el.style.setProperty("--dx",`${Math.max(-f+6,Math.min(f-6,_.x-u))}px`),_.el.style.setProperty("--dy",`${Math.max(0,_.y-b)}px`);const T=b-_.bh>_.y+10;_.el.classList.toggle("below",T),T&&_.el.style.setProperty("--up",`${b-_.bh-(_.y+10)}px`)}for(const[_,f]of this.labelEls)a.has(_)||(f.remove(),this.labelEls.delete(_))}tip(e,t,n){const s=He("#tip");if(!e){s.hidden=!0;return}s.hidden=!1;const r=`<b>${e.title}</b>${e.sub?`<span>${e.sub}</span>`:""}`;r!==this.tipHtml&&(this.tipHtml=r,s.innerHTML=r);const a=s.getBoundingClientRect();s.style.left=`${Math.min(window.innerWidth-a.width-8,t+14)}px`,s.style.top=`${Math.min(window.innerHeight-a.height-8,n+14)}px`}}const Jh=i=>String(i).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),j_={8086:"#ffb547",8087:"#ffb547",186:"#ffa040",286:"#ff8a3d",386:"#4fe08a",486:"#4fe08a",P5:"#3fd0c0",MMX:"#3fd0c0",P6:"#3fd0c0",AMD64:"#58a6ff","":"#888"},Z_=i=>i.lang||(/\.nasm\b/i.test(i.src||"")?"nasm":"c");function J_(i,e="c"){if(typeof i=="string")return`<span class="ln">${Oc(i,e)}</span>`;const t=i.era?`<span class="era" style="--e:${j_[i.era]||"#888"}" title="oldest CPU with this instruction form">${i.era}</span>`:"";return`<span class="ln" title="${Jh(i.why||"")}">${i.a?`<span class="ad">${i.a}</span>`:""}<span class="in">${Oc(i.i,e)}</span>${t}</span>`}function Q_(i,e){let t=!1;return i.map(n=>{const s=(typeof n=="string"?n:n.i??"").trim();if(s==="...")return"elision";if(!s)return t?"comment":"blank";if(e==="nasm")return s.startsWith(";")?"comment":"code";if(/^#\s*(include|if|ifdef|ifndef|endif|else|elif|define|undef)\b/.test(s))return"code";!t&&/^\*(\s|\/|$)/.test(s)&&(t=!0);let r=!1,a=null;for(let o=0;o<s.length;o++){const l=s[o];if(t){l==="*"&&s[o+1]==="/"&&(t=!1,o++);continue}if(a){l==="\\"?o++:l===a&&(a=null);continue}if(l==="/"&&s[o+1]==="*")t=!0,o++;else{if(l==="/"&&s[o+1]==="/"||l==="#")break;/\s/.test(l)||(r=!0,(l==='"'||l==="'")&&(a=l))}}return r?"code":"comment"})}const ev=i=>/^\s*/.exec(i.replace(/\t/g,"    "))[0].length;function tv(i,e,t){if(i[t]==="code")return t;let n=-1,s=-1;for(let r=t+1;r<i.length&&n<0;r++)i[r]==="code"&&(n=r);for(let r=t-1;r>=0&&s<0;r--)i[r]==="code"&&(s=r);return n<0?s<0?t:s:s<0?n:e[t]>e[n]?s:n}function Oc(i,e="c"){const t=i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");if(/^\s*#\s*(include|if|ifdef|ifndef|endif|else|elif|define|undef)\b/.test(t))return t;let n=null;for(let s=0;s<t.length;s++){const r=t[s];if(n){r==="\\"?s++:r===n&&(n=null);continue}if(r==='"'||r==="'"&&e!=="nasm")n=r;else if(e==="nasm"?r===";":r==="#"||r==="/"&&(t[s+1]==="*"||t[s+1]==="/"))return`${t.slice(0,s)}<span class="c">${t.slice(s)}</span>`}return t}const Bc=.22,nv=1.8,iv=new D(0,1,0),kc=new D;function Gc(i,e){if(!Array.isArray(i))return{value:i,from:0};let t={value:i[0][1],from:0};for(const[n,s]of i)e>=n&&(t={value:s,from:n});return t}class sv{constructor(e){this.ctx=e,this.cut=null,this.seg=null,this.shot=null,this.inset=void 0,this.drift=0,this.driftAngle=0,this.hud=document.getElementById("vhud"),this.cap=document.getElementById("vcap"),this.capSpan=this.cap.querySelector("span"),this.capText=null,this.hudKey=""}ready(){return this.ctx.ready}load(e){const{timeline:t,dismissIntro:n,hasShot:s,steps:r}=this.ctx;for(const o of e.segments){if(!r[o.step])throw new Error(`cut: no step ${o.step}`);if(!(o.frames>0))throw new Error(`cut: segment ${o.name||o.step} has no frames (run tts.py)`);for(const l of[o.shot,o.inset]){const c=Array.isArray(l)?l.map(h=>h[1]):[l];for(const h of c){const d=h&&typeof h=="object"?h.shot:h;if(d&&!s(d))throw new Error(`cut: unknown shot "${d}"`)}}}n(),t.speed=0,t.playing=!0;let a=0;for(const o of e.segments)o.first=a,a+=o.frames;return this.cut=e,this.frames=a,this.hud.hidden=!1,this.cap.hidden=!1,this.seek(0),{total:a/e.fps,frames:a}}seek(e){const{director:t,steps:n,timeline:s,shotAt:r}=this.ctx;this.place(e);const a=this.shot||r(n[this.seg.step],s.p);a&&t.go(a,{instant:!0}),this.prefill=!0}segAt(e){const t=this.cut.segments;for(const n of t)if(e<n.first+n.frames)return n;return t[t.length-1]}place(e){const{timeline:t,stages:n,steps:s,realAt:r}=this.ctx,a=this.segAt(e);this.seg=a;const o=this.cut.fps,l=(e-a.first)/o,c=ss((e-a.first)/a.frames,0,1);t.i=a.step,t.p=Math.min(.9995,a.p0+(a.p1-a.p0)*c);const h=Gc(a.shot,c);this.shot=h.value||null,this.inset="inset"in a?Gc(a.inset,c).value:void 0,this.drift=a.drift||0,this.driftAngle=this.drift*Math.max(0,l-h.from*a.frames/o-nv);let d="",p=0;for(const v of a.captions||[])l>=v.t0&&l<v.t1&&(d=v.text,p=Math.min(1,(l-v.t0)/Bc,(v.t1-l)/Bc));d!==this.capText&&(this.capText=d,this.capSpan.textContent=d),this.cap.style.opacity=d?ss(p,0,1):0;const m=s[a.step],g=n[m.stage],[_,f]=g.long.split(" — "),u=`${m.stage}`;u!==this.hudKey&&(this.hudKey=u,this.hud.style.setProperty("--c",g.color),this.hud.querySelector(".st").textContent=_,this.hud.querySelector(".mode").textContent=f||g.name);const b=r(a.step,t.p);this.hud.querySelector(".clk").textContent=b<=0?"t = 0":`t ≈ ${ia(b)} after the power button`}frame(e){const{timeline:t,renderFrame:n}=this.ctx;this.place(e);const s=1e3/this.cut.fps;this.prefill?(this.prefill=!1,t.playing=!1,n(s),t.playing=!0):n(s)}afterCamera(){const{director:e,camera:t}=this.ctx;if(!this.drift||e.flight||!e.current)return;const n=e.shotFor(e.current);n&&(kc.subVectors(n.pos,n.target).applyAxisAngle(iv,ma.degToRad(this.driftAngle)),t.position.copy(n.target).add(kc),e.controls.target.copy(n.target),t.lookAt(n.target))}}const os=new URLSearchParams(location.search).has("video");os&&document.body.classList.add("video");const Qh=document.getElementById("gl");let it;var qc;try{it=new Lh({canvas:Qh,antialias:!1,powerPreference:"high-performance"})}catch(i){throw(qc=window.__coldbootNoGl)==null||qc.call(window),i}const ra=it.getContext(),zc=ra.getExtension("WEBGL_debug_renderer_info"),rv=/SwiftShader|llvmpipe|softpipe|Software/i.test(String(ra.getParameter(zc?zc.UNMASKED_RENDERER_WEBGL:ra.RENDERER))),ov=os&&Number(new URLSearchParams(location.search).get("pr"))||0,ed=()=>ov||Math.min(rv?1:2,window.devicePixelRatio||1);it.setPixelRatio(ed());const pr=it.extensions,Aa=it.capabilities.isWebGL2?pr.has("EXT_color_buffer_float")||pr.has("EXT_color_buffer_half_float"):pr.has("OES_texture_half_float")&&pr.has("EXT_color_buffer_half_float");it.toneMapping=da;it.toneMappingExposure=1.05;it.outputColorSpace=ft;const Vt=new Dh;Vt.background=new Pe("#05060b");Vt.fog=new xa("#05060b",600,1400);function td(){var t;if(!Aa)return;const i=new Jo(it),e=new e_(it);Vt.environment=i.fromScene(e,.04).texture,(t=e.dispose)==null||t.call(e),i.dispose()}td();Qh.addEventListener("webglcontextrestored",td);const kt=new Xt(40,1,.3,4e3);Vt.add(new zg("#8090c0","#0a0a10",.35));const nd=new Nh("#dfe6ff",1.4);nd.position.set(-120,260,180);Vt.add(nd);const id=new Nh("#ffb070",.55);id.position.set(220,80,-200);Vt.add(id);let sd;const av=new Promise(i=>sd=i);new Gg().load(x_,i=>{Ge.setPhoto(i),Ge.setTrueColor(bs),sd()});const lv=it.capabilities.maxTextureSize,rd=Math.min(8,it.capabilities.getMaxAnisotropy()),pt=f_({anisotropy:rd});Vt.add(pt.group);const Ge=c_(Yh,{maxTexture:Math.min(2048,lv),anisotropy:rd,package:{x:rn.h/2,z:rn.w/2}});Ge.group.position.copy(pt.socketWorld);var Kc;const Oo=(Kc=Yh.mounting)==null?void 0:Kc.die_center_offset_mm;Oo&&Ge.group.position.add(new D(Oo.east||0,0,-Oo.north));Ge.group.rotation.y=-Math.PI/2;Ge.group.scale.x=-1;Vt.add(Ge.group);Ge.group.updateMatrixWorld(!0);for(const i of Ge.exits.values()){const e=Ge.group.localToWorld(i.out[0].clone()),t=Ge.group.localToWorld(i.out[i.out.length-1].clone()).sub(e).setY(0).normalize(),n=pt.socketWorld,s=e.clone();Math.abs(t.x)>Math.abs(t.z)?s.x=n.x+Math.sign(t.x)*(rn.w/2):s.z=n.z+Math.sign(t.z)*(rn.h/2);const r=i.bus&&pt.land(i.bus),a=r?[e.clone().addScaledVector(t,2),r.at]:[s];Ge.setExitOut(i.name,a.map(o=>Ge.group.worldToLocal(o.clone()))),i.bus&&pt.startAt(i.bus,r?r.at:s,r?r.dir:t)}const xn=Ge.group.position.clone(),od=document.getElementById("truecolor");let bs=!1;function ad(){bs=!bs,Ge.setTrueColor(bs),od.setAttribute("aria-pressed",String(bs))}od.addEventListener("click",ad);window.addEventListener("keydown",i=>{(i.key==="t"||i.key==="T")&&!i.metaKey&&!i.ctrlKey&&!i.altKey&&ad()});const Ze=(i,e,t)=>new D(i,e,t),Ln=(i,e,t=40)=>()=>({target:i.clone(),pos:i.clone().add(e),fov:t}),dn=(i,e,t=40)=>()=>({target:Ge.group.localToWorld(i.clone()),pos:Ge.group.localToWorld(i.clone().add(e)),fov:t}),cv=i=>Ge.blocks.get(i).center.clone(),Xn=i=>pt.comps.get(i).anchor.clone(),mr=(...i)=>i.reduce((e,t)=>e.add(t),Ze(0,0,0)).multiplyScalar(1/i.length),Lr={overview:Ln(Ze(0,0,8),Ze(0,330,330),40),standby:Ln(mr(Xn("cmos"),Xn("atx24")).setY(0).add(Ze(3,0,28.5)),Ze(-25,185,200),40),power:Ln(Ze(30,0,10),Ze(-10,270,255),40),pch:Ln(mr(Xn("pch"),Xn("spi")).setY(0),Ze(-10,85,100),38),socket:dn(Ze(0,0,0),Ze(0,62,72),38),die:dn(Ze(0,0,.6),Ze(0,30.5,21.5),40),dieLow:dn(Ze(-2,0,0),Ze(-8,11,19),38),dieLeft:dn(Ze(-5.5,0,.4),Ze(-3,17,13.5),38),dieRight:dn(Ze(5.5,0,.4),Ze(3,17,13.5),38),bsp:dn(cv("pcore0").add(Ze(.6,0,1.2)),Ze(-1.5,7.5,6),38),sa:dn(Ze(-8.5,0,-.6),Ze(-2.5,11,10),38),fetch:Ln(mr(xn.clone(),Xn("spi")).setY(0),Ze(-10,190,190),40),dimms:Ln(Ze(xn.x+62,14,xn.z+18),Ze(150,105,150),40),memory:Ln(Ze(xn.x+40,0,xn.z+5),Ze(10,150,140),40),pcie:Ln(mr(xn.clone(),Xn("nvme"),Xn("gpu").setY(0),Xn("pch")).setY(0).add(Ze(12,0,6)),Ze(20,260,240),40),attract:dn(Ze(0,0,0),Ze(-9,12,17),36),imc:dn(Ze(-8.2,0,-3),Ze(-1.5,10,9.5),38),imcEye:dn(Ze(-5.9,0,-2.5),Ze(1.5,10,9.5),38),llc:dn(Ze(-.8,0,.6),Ze(0,21,16),38),spd:Ln(Ze(50,0,-10),Ze(-20,215,215),40)},ld=new Set(["die","dieLow","dieLeft","dieRight","bsp","sa","imc","imcEye","llc","attract"]),jt=new k_(rs),at=new H_(kt,it.domElement,Lr),mi=new K_({timeline:jt,stages:jh,lpLayout:Ge.lps,onSpeed:i=>jt.speed=i}),Yt=Aa?new Bh(it):null;Yt&&(Yt.addPass(new kh(Vt,kt)),Yt.addPass(new is(new Ie(1,1),.7,.5,.84)),Yt.addPass(new Gh));const vn=new Xt(40,1.6,.3,4e3);kt.layers.enable(ji);const xr=document.getElementById("inset");let oa=null,aa=null,Hc="",Vc=null;const Bn=Aa?new Bh(it):null;Bn&&(Bn.addPass(new kh(Vt,vn)),Bn.addPass(new Gh));function Ra(){const i=window.innerWidth,e=window.innerHeight,t=ed();t!==it.getPixelRatio()&&(it.setPixelRatio(t),Yt==null||Yt.setPixelRatio(t),Bn==null||Bn.setPixelRatio(t)),it.setSize(i,e,!1),Yt==null||Yt.setSize(i,e);const n=p=>document.getElementById(p).getBoundingClientRect(),s=n("panel"),r=n("timeline");let a=0,o=0,l=e;os?l=e*.82:document.body.classList.contains("intro")||(s.left>i*.3?(a=i-s.left,l=r.top,e<=520&&(o=n("brand").bottom)):(o=n("brand").bottom,l=Math.min(s.top,r.top,n("stages").top)));const c=e/2-(o+l)/2,h=i+a,d=e+2*Math.abs(c);if(kt.aspect=h/d,kt.setViewOffset(h,d,a,c>0?2*c:0,i,e),kt.updateProjectionMatrix(),mi.view={right:i-a,bottom:l},mi.obstaclesDirty=!0,oa&&(aa=xr.getBoundingClientRect()),at.setFrame((l-o)/d,(i-a)/d),Vt.fog.near=600*at.backoff,Vt.fog.far=1400*at.backoff,at.current&&!at.userMoved)if(at.flight){const p=at.shotFor(at.current);at.flight.toPos.copy(p.pos),at.flight.toTarget.copy(p.target)}else at.go(at.current,{instant:!0})}window.addEventListener("resize",Ra);Ra();const Kn=Ge.lps.map(()=>"off"),Bo={die:(i,e,t,n)=>Ge.light(i,e,t,n),ring:(i,e)=>Ge.ringLevel(i,e),flow:(i,e,t,n,s,r)=>{const a=Ge.stream(i,e,t,n,s,r);if(!(!a||!(n>0)))for(const o of a.exits){const l=Ge.exits.get(o).bus;l&&pt.bus(l,Math.min(1,.55+n*.08),s,{rate:n*3,speed:80,dir:o===t?1:-1})}},board:(i,e,t,n)=>pt.light(i,e,t,n),bus:(i,e,t,n)=>pt.bus(i,e,t,n),chips:(i,e)=>pt.chips(i,e),dimmPart:(i,e,t)=>pt.dimmPart(i,e,t),lp:(i,e)=>Kn[i]=e,lps:i=>Kn.forEach((e,t)=>Kn[t]=i(t,Ge.lps[t])),nP:Ge.lps.filter(i=>i.kind==="p").length},oi=new D;function hv(i,e){const t=[];for(const n of i.labels||[]){const s=typeof n=="string"?{id:n}:n;if(s.from!=null&&e<s.from||s.to!=null&&e>s.to)continue;const r=pt.comps.get(s.id);if(r){t.push({id:s.id,text:s.text||r.label||s.id,pos:r.anchor,hot:s.hot,color:s.color});continue}const a=Ge.blocks.get(s.id);a&&(s.always||at.dieCloseness(xn)>.45)&&(oi.copy(a.center),Ge.group.localToWorld(oi),t.push({id:s.id,text:s.text||a.label||s.id,pos:oi.clone().setY(oi.y+.2),hot:s.hot,color:s.color}))}if(!Sn&&at.dieCloseness(xn)>.45){const n=new Set((i.labels||[]).map(s=>typeof s=="string"?s:s.id));for(const s of Ge.liveExits())n.has(s.name)||(oi.copy(s.out[0]),Ge.group.localToWorld(oi),t.push({id:`exit:${s.name}`,text:s.label,pos:oi.clone(),color:`#${s.color.getHexString()}`}))}return t}const Wc={pcore:"Raptor Cove performance core · 2 hardware threads · 2 MB private L2",ecore_cluster:"Four Gracemont efficiency cores (one thread each) sharing a 4 MB L2",llc_slice:"One 3 MB slice of the 36 MB shared L3 / last-level cache",ring:"The ring bus (“compute fabric”): cores, L3 slices, system agent and GPU all sit on it",imc:"Integrated memory controller: two DDR5 channels",ddr_phy:"DDR5/DDR4 PHY: the analog transceivers memory training tunes",pcie_phy:"PCIe PHY lanes",dmi:"DMI 4.0 ×8 — the CPU’s link to the chipset, and so to the BIOS flash",pcie_ctrl:"DMI and PCIe controllers",display:"Display engine (4 pipes)",display_phy:"Display PHYs",igpu:"Intel UHD Graphics 770 (32 execution units)",media:"Media engine (video encode / decode)",system_agent:"System agent: the uncore glue between the ring and the outside world",whole:"Raptor Lake-S 8P+16E die"},Xc=new Yg,Yc=new Ie,dv=new Un(new D(0,1,0),-xn.y);let Zt=null;it.domElement.addEventListener("pointermove",i=>{Zt={x:i.clientX,y:i.clientY}});it.domElement.addEventListener("pointerleave",()=>Zt=null);function uv(){if(!Zt||Sn)return null;Yc.set(Zt.x/window.innerWidth*2-1,-(Zt.y/window.innerHeight)*2+1),Xc.setFromCamera(Yc,kt);const i=new D;if(Xc.ray.intersectPlane(dv,i)){const n=Ge.group.worldToLocal(i.clone());if(Math.abs(n.x)<=Ge.W/2&&Math.abs(n.z)<=Ge.H/2){const s=Ge.blockAt(n.x,n.z);if(s){const r=s.parent?Ge.blocks.get(s.parent):null;return{title:s.label||s.id,sub:r?`${r.label} — ${Wc[r.kind]||""}`:Wc[s.kind]||""}}}}let e=null,t=40;for(const n of pt.comps.values()){if(!n.label)continue;const s=n.anchor.clone().project(kt),r=(s.x+1)/2*window.innerWidth,a=(1-s.y)/2*window.innerHeight,o=Math.hypot(r-Zt.x,a-Zt.y);s.z<1&&o<t&&(t=o,e=n)}return e?{title:e.label}:null}var jc;const $c=((jc=window.matchMedia)==null?void 0:jc.call(window,"(prefers-reduced-motion: reduce)").matches)??!1;let Sn=!0;const ko=document.getElementById("intro"),cd=["brand","stages","panel","timeline","lps","eye","inset"].map(i=>document.getElementById(i));for(const i of cd)i.inert=!0;at.go("attract",{instant:!0});function Ca(){if(!Sn)return!1;Sn=!1,ko.classList.add("gone"),document.body.classList.remove("intro");for(const e of cd)e.inert=!1;const i=document.activeElement;return ko.inert=!0,(!i||i===document.body||ko.contains(i))&&document.getElementById("play").focus({preventScroll:!0}),Ra(),!0}function hd(){Ca()&&(jt.go(0),jt.play())}document.getElementById("power").addEventListener("click",hd);function fv(i){const e=Ge.lps.length;for(let r=0;r<e;r++){const a=(i*.25+r*.07)%4;Kn[r]=a<1?"real":a<2?"prot":a<3?"long":"wfs"}Ge.light("kind:llc_slice",.35+.15*Math.sin(i*1.3),"#ff6bd5","pinned"),Ge.light("kind:ddr_phy",.5,"#ff8a3d","sparkle"),Ge.light("kind:imc",.35,"#ff8a3d","sparkle"),Ge.ringLevel(.7,"#bfb6ff"),Ge.stream("a1","pcore0","imc0",3,"#7cf2ff",5);const t=at.shotFor("attract"),n=i*.06,s=t.pos.clone().sub(t.target);s.applyAxisAngle(new D(0,1,0),Math.sin(n)*.5),at.userMoved||(kt.position.copy(t.target).add(s),at.controls.target.copy(t.target))}const Go=new D;function la(i){const e=un&&un.inset!==void 0?un.inset:i.inset;return e?typeof e=="object"?e:{shot:e,label:""}:null}const ca=[Ge.points.material,pt.points.material];for(const i of ca)i.userData.size=i.size;function pv(i,e){var l,c;const t=Sn?null:((l=la(i))==null?void 0:l.shot)||null;if(t!==oa&&(oa=t,xr.hidden=!t,mi.obstaclesDirty=!0,t)){const h=Lr[t]();vn.position.copy(h.pos),ld.has(t)?vn.layers.enable(ji):vn.layers.disable(ji),Go.copy(h.target),vn.fov=h.fov,aa=xr.getBoundingClientRect()}const n=((c=la(i))==null?void 0:c.label)||"";if(t&&n!==Vc&&(Vc=n,xr.querySelector(".lbl").textContent=n,mi.obstaclesDirty=!0),!t)return;const s=aa;if(!s||s.width<4)return;const r=Lr[t]();vn.position.lerp(r.pos,Math.min(1,e*3)),Go.lerp(r.target,Math.min(1,e*3)),vn.aspect=s.width/s.height,vn.updateProjectionMatrix(),vn.lookAt(Go);const a=window.innerHeight;it.setScissorTest(!0),it.setScissor(s.left,a-s.bottom,s.width,s.height),it.setViewport(s.left,a-s.bottom,s.width,s.height),it.setClearColor("#070912",1);const o=s.height/a;for(const h of ca)h.size=h.userData.size*o;if(Bn){const h=`${s.width}x${s.height}`;h!==Hc&&(Hc=h,Bn.setSize(s.width,s.height)),Bn.render()}else it.clear(!0,!0),it.render(Vt,vn);for(const h of ca)h.size=h.userData.size;it.setScissorTest(!1),it.setViewport(0,0,window.innerWidth,window.innerHeight)}let un=null,ws=performance.now(),Hi=0,zo=1,jn="normal";const Pa=i=>typeof i.real=="object"?i.real[jn]:i.real||0,Dr={realBase:rs.map(()=>0)};function dd(){let i=0;rs.forEach((e,t)=>{Dr.realBase[t]=i,i+=Pa(e)})}dd();const Ho=document.getElementById("bootkind");Ho.addEventListener("click",()=>{jn=jn==="normal"?"first":"normal",Ho.innerHTML=jn==="normal"?'<span class="long">normal boot</span><span class="short">normal</span>':'<span class="long">first boot · new DIMMs</span><span class="short">1st boot</span>',Ho.classList.toggle("first",jn==="first"),dd()});const Vo=rs.findIndex(i=>i.isReset);function ud(i,e){if(!i.shot)return null;if(typeof i.shot=="string")return i.shot;let t=i.shot[0][1];for(const[n,s]of i.shot)e>=n&&(t=s);return t}function La(i){var d,p;const e=os?(i-ws)/1e3:Math.min(.05,(i-ws)/1e3);ws=i;const t=jt.playing||Sn&&!$c?e:0;Hi+=t,jt.update(e);const n=jt.step,s=jt.p;if(Ge.begin(),pt.begin(),Sn)fv(Hi);else{n.lps&&Bo.lps(n.lps(s)),Bo.bootKind=jn,(d=n.act)==null||d.call(n,s,Bo,Hi);const m=(un==null?void 0:un.shot)||ud(n,s);m&&m!==at.current&&at.go(m,{instant:$c})}for(let m=0;m<Kn.length;m++)Ge.setLp(m,Kn[m],Kn[m]==="off"?0:1);const r=at.dieCloseness(xn),a=ld.has((p=la(n))==null?void 0:p.shot),o=Sn||n.lid===!1||a||r>.25?1:0;zo+=(o-zo)*Math.min(1,e*3);const l=na(Math.min(1,zo*1.8));pt.ihs.position.y=pt.socketWorld.y-.4+l*14,pt.ihs.traverse(m=>{for(const g of[].concat(m.material||[]))g.opacity=1-l}),pt.ihs.visible=l<.99,Ge.update(e,Hi,t),pt.setView(kt.position,at.controls.target),pt.update(e,Hi,t),at.update(e),un==null||un.afterCamera(e),kt.updateMatrixWorld();const c=Dr.realBase[jt.i]+Pa(n)*s,h=Vo>=0&&jt.i>=Vo?c-Dr.realBase[Vo]:null;mi.frame({realT:c,resetT:h,lpModes:Kn,step:n,p:s,time:Hi,ctx:{bootKind:jn}}),mi.labels(Sn?[]:hv(n,s),kt,window.innerWidth,window.innerHeight),mi.tip(uv(),(Zt==null?void 0:Zt.x)??0,(Zt==null?void 0:Zt.y)??0),Yt?Yt.render():it.render(Vt,kt),pv(n,e),os||requestAnimationFrame(La)}jt.on(i=>{if(i==="play"&&Sn){hd();return}(i==="step"||i==="seek")&&(Ca(),i==="seek"&&(at.current=null))});requestAnimationFrame(i=>{ws=i,La(i),it.setRenderTarget(Yt?Yt.readBuffer:null),it.compile(Vt,kt),it.setRenderTarget(null),document.getElementById("boot").classList.add("gone"),document.body.classList.add("ready")});window.__coldboot={timeline:jt,director:at,die:Ge,board:pt,renderer:it,MODE_COLORS:gn,bootKind:()=>jn};os&&(un=new sv({timeline:jt,director:at,camera:kt,stages:jh,steps:rs,dismissIntro:Ca,shotAt:ud,hasShot:i=>typeof Lr[i]=="function",ready:av,realAt:(i,e)=>Dr.realBase[i]+Pa(rs[i])*e,renderFrame:i=>La(ws+i)}),window.__coldboot.video=un);
