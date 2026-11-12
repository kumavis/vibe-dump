(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ea="160",Dc=0,Ga=1,Uc=2,Il=1,Ic=2,Ln=3,$n=0,Ct=1,Zt=2,Xn=0,zi=1,ka=2,Ha=3,Va=4,Nc=5,ri=100,Fc=101,Oc=102,Wa=103,Xa=104,Bc=200,zc=201,Gc=202,kc=203,la=204,ca=205,Hc=206,Vc=207,Wc=208,Xc=209,qc=210,Yc=211,$c=212,jc=213,Kc=214,Zc=0,Jc=1,Qc=2,es=3,eh=4,th=5,nh=6,ih=7,Nl=0,rh=1,sh=2,qn=0,ah=1,oh=2,lh=3,ch=4,hh=5,uh=6,Fl=300,ki=301,Hi=302,ha=303,ua=304,ls=306,da=1e3,hn=1001,fa=1002,Nt=1003,qa=1004,vs=1005,$t=1006,dh=1007,fr=1008,Yn=1009,fh=1010,ph=1011,ba=1012,Ol=1013,Hn=1014,Vn=1015,pr=1016,Bl=1017,zl=1018,oi=1020,mh=1021,un=1023,gh=1024,_h=1025,li=1026,Vi=1027,vh=1028,Gl=1029,xh=1030,kl=1031,Hl=1033,xs=33776,Ms=33777,ys=33778,Ss=33779,Ya=35840,$a=35841,ja=35842,Ka=35843,Vl=36196,Za=37492,Ja=37496,Qa=37808,eo=37809,to=37810,no=37811,io=37812,ro=37813,so=37814,ao=37815,oo=37816,lo=37817,co=37818,ho=37819,uo=37820,fo=37821,Es=36492,po=36494,mo=36495,Mh=36283,go=36284,_o=36285,vo=36286,Wl=3e3,ci=3001,yh=3200,Sh=3201,Xl=0,Eh=1,Jt="",ut="srgb",In="srgb-linear",Ta="display-p3",cs="display-p3-linear",ts="linear",tt="srgb",ns="rec709",is="p3",pi=7680,xo=519,bh=512,Th=513,wh=514,ql=515,Ah=516,Rh=517,Ch=518,Ph=519,Mo=35044,yo="300 es",pa=1035,Un=2e3,rs=2001;class qi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Tt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let So=1234567;const lr=Math.PI/180,mr=180/Math.PI;function Yi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Tt[n&255]+Tt[n>>8&255]+Tt[n>>16&255]+Tt[n>>24&255]+"-"+Tt[e&255]+Tt[e>>8&255]+"-"+Tt[e>>16&15|64]+Tt[e>>24&255]+"-"+Tt[t&63|128]+Tt[t>>8&255]+"-"+Tt[t>>16&255]+Tt[t>>24&255]+Tt[i&255]+Tt[i>>8&255]+Tt[i>>16&255]+Tt[i>>24&255]).toLowerCase()}function vt(n,e,t){return Math.max(e,Math.min(t,n))}function wa(n,e){return(n%e+e)%e}function Lh(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function Dh(n,e,t){return n!==e?(t-n)/(e-n):0}function cr(n,e,t){return(1-t)*n+t*e}function Uh(n,e,t,i){return cr(n,e,1-Math.exp(-t*i))}function Ih(n,e=1){return e-Math.abs(wa(n,e*2)-e)}function Nh(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Fh(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Oh(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Bh(n,e){return n+Math.random()*(e-n)}function zh(n){return n*(.5-Math.random())}function Gh(n){n!==void 0&&(So=n);let e=So+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function kh(n){return n*lr}function Hh(n){return n*mr}function ma(n){return(n&n-1)===0&&n!==0}function Vh(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function ss(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Wh(n,e,t,i,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+i)/2),u=a((e+i)/2),f=s((e-i)/2),p=a((e-i)/2),m=s((i-e)/2),_=a((i-e)/2);switch(r){case"XYX":n.set(o*u,l*f,l*p,o*c);break;case"YZY":n.set(l*p,o*u,l*f,o*c);break;case"ZXZ":n.set(l*f,l*p,o*u,o*c);break;case"XZX":n.set(o*u,l*_,l*m,o*c);break;case"YXY":n.set(l*m,o*u,l*_,o*c);break;case"ZYZ":n.set(l*_,l*m,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Ii(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Dt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const ga={DEG2RAD:lr,RAD2DEG:mr,generateUUID:Yi,clamp:vt,euclideanModulo:wa,mapLinear:Lh,inverseLerp:Dh,lerp:cr,damp:Uh,pingpong:Ih,smoothstep:Nh,smootherstep:Fh,randInt:Oh,randFloat:Bh,randFloatSpread:zh,seededRandom:Gh,degToRad:kh,radToDeg:Hh,isPowerOfTwo:ma,ceilPowerOfTwo:Vh,floorPowerOfTwo:ss,setQuaternionFromProperEuler:Wh,normalize:Dt,denormalize:Ii};class Re{constructor(e=0,t=0){Re.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(vt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class He{constructor(e,t,i,r,s,a,o,l,c){He.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c)}set(e,t,i,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],f=i[7],p=i[2],m=i[5],_=i[8],g=r[0],d=r[3],h=r[6],x=r[1],v=r[4],S=r[7],R=r[2],w=r[5],A=r[8];return s[0]=a*g+o*x+l*R,s[3]=a*d+o*v+l*w,s[6]=a*h+o*S+l*A,s[1]=c*g+u*x+f*R,s[4]=c*d+u*v+f*w,s[7]=c*h+u*S+f*A,s[2]=p*g+m*x+_*R,s[5]=p*d+m*v+_*w,s[8]=p*h+m*S+_*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*s*u+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,p=o*l-u*s,m=c*s-a*l,_=t*f+i*p+r*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return e[0]=f*g,e[1]=(r*c-u*i)*g,e[2]=(o*i-r*a)*g,e[3]=p*g,e[4]=(u*t-r*l)*g,e[5]=(r*s-o*t)*g,e[6]=m*g,e[7]=(i*l-c*t)*g,e[8]=(a*t-i*s)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(bs.makeScale(e,t)),this}rotate(e){return this.premultiply(bs.makeRotation(-e)),this}translate(e,t){return this.premultiply(bs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const bs=new He;function Yl(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function as(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Xh(){const n=as("canvas");return n.style.display="block",n}const Eo={};function hr(n){n in Eo||(Eo[n]=!0,console.warn(n))}const bo=new He().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),To=new He().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Sr={[In]:{transfer:ts,primaries:ns,toReference:n=>n,fromReference:n=>n},[ut]:{transfer:tt,primaries:ns,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[cs]:{transfer:ts,primaries:is,toReference:n=>n.applyMatrix3(To),fromReference:n=>n.applyMatrix3(bo)},[Ta]:{transfer:tt,primaries:is,toReference:n=>n.convertSRGBToLinear().applyMatrix3(To),fromReference:n=>n.applyMatrix3(bo).convertLinearToSRGB()}},qh=new Set([In,cs]),je={enabled:!0,_workingColorSpace:In,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!qh.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const i=Sr[e].toReference,r=Sr[t].fromReference;return r(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return Sr[n].primaries},getTransfer:function(n){return n===Jt?ts:Sr[n].transfer}};function Gi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ts(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let mi;class $l{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{mi===void 0&&(mi=as("canvas")),mi.width=e.width,mi.height=e.height;const i=mi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=mi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=as("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Gi(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Gi(t[i]/255)*255):t[i]=Gi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Yh=0;class jl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Yh++}),this.uuid=Yi(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ws(r[a].image)):s.push(ws(r[a]))}else s=ws(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function ws(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?$l.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let $h=0;class Bt extends qi{constructor(e=Bt.DEFAULT_IMAGE,t=Bt.DEFAULT_MAPPING,i=hn,r=hn,s=$t,a=fr,o=un,l=Yn,c=Bt.DEFAULT_ANISOTROPY,u=Jt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$h++}),this.uuid=Yi(),this.name="",this.source=new jl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Re(0,0),this.repeat=new Re(1,1),this.center=new Re(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(hr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===ci?ut:Jt),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Fl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case da:e.x=e.x-Math.floor(e.x);break;case hn:e.x=e.x<0?0:1;break;case fa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case da:e.y=e.y-Math.floor(e.y);break;case hn:e.y=e.y<0?0:1;break;case fa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return hr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===ut?ci:Wl}set encoding(e){hr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===ci?ut:Jt}}Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=Fl;Bt.DEFAULT_ANISOTROPY=1;class xt{constructor(e=0,t=0,i=0,r=1){xt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],p=l[1],m=l[5],_=l[9],g=l[2],d=l[6],h=l[10];if(Math.abs(u-p)<.01&&Math.abs(f-g)<.01&&Math.abs(_-d)<.01){if(Math.abs(u+p)<.1&&Math.abs(f+g)<.1&&Math.abs(_+d)<.1&&Math.abs(c+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,S=(m+1)/2,R=(h+1)/2,w=(u+p)/4,A=(f+g)/4,k=(_+d)/4;return v>S&&v>R?v<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(v),r=w/i,s=A/i):S>R?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=w/r,s=k/r):R<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(R),i=A/s,r=k/s),this.set(i,r,s,t),this}let x=Math.sqrt((d-_)*(d-_)+(f-g)*(f-g)+(p-u)*(p-u));return Math.abs(x)<.001&&(x=1),this.x=(d-_)/x,this.y=(f-g)/x,this.z=(p-u)/x,this.w=Math.acos((c+m+h-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class jh extends qi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t);const r={width:e,height:t,depth:1};i.encoding!==void 0&&(hr("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===ci?ut:Jt),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$t,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new Bt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(e,t,i=1){(this.width!==e||this.height!==t||this.depth!==i)&&(this.width=e,this.height=t,this.depth=i,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new jl(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ui extends jh{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Kl extends Bt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=hn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Kh extends Bt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=hn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class En{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3];const p=s[a+0],m=s[a+1],_=s[a+2],g=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(o===1){e[t+0]=p,e[t+1]=m,e[t+2]=_,e[t+3]=g;return}if(f!==g||l!==p||c!==m||u!==_){let d=1-o;const h=l*p+c*m+u*_+f*g,x=h>=0?1:-1,v=1-h*h;if(v>Number.EPSILON){const R=Math.sqrt(v),w=Math.atan2(R,h*x);d=Math.sin(d*w)/R,o=Math.sin(o*w)/R}const S=o*x;if(l=l*d+p*S,c=c*d+m*S,u=u*d+_*S,f=f*d+g*S,d===1-o){const R=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=R,c*=R,u*=R,f*=R}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[a],p=s[a+1],m=s[a+2],_=s[a+3];return e[t]=o*_+u*f+l*m-c*p,e[t+1]=l*_+u*p+c*f-o*m,e[t+2]=c*_+u*m+o*p-l*f,e[t+3]=u*_-o*f-l*p-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(r/2),f=o(s/2),p=l(i/2),m=l(r/2),_=l(s/2);switch(a){case"XYZ":this._x=p*u*f+c*m*_,this._y=c*m*f-p*u*_,this._z=c*u*_+p*m*f,this._w=c*u*f-p*m*_;break;case"YXZ":this._x=p*u*f+c*m*_,this._y=c*m*f-p*u*_,this._z=c*u*_-p*m*f,this._w=c*u*f+p*m*_;break;case"ZXY":this._x=p*u*f-c*m*_,this._y=c*m*f+p*u*_,this._z=c*u*_+p*m*f,this._w=c*u*f-p*m*_;break;case"ZYX":this._x=p*u*f-c*m*_,this._y=c*m*f+p*u*_,this._z=c*u*_-p*m*f,this._w=c*u*f+p*m*_;break;case"YZX":this._x=p*u*f+c*m*_,this._y=c*m*f+p*u*_,this._z=c*u*_-p*m*f,this._w=c*u*f-p*m*_;break;case"XZY":this._x=p*u*f-c*m*_,this._y=c*m*f-p*u*_,this._z=c*u*_+p*m*f,this._w=c*u*f+p*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],p=i+o+f;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(u-l)*m,this._y=(s-c)*m,this._z=(a-r)*m}else if(i>o&&i>f){const m=2*Math.sqrt(1+i-o-f);this._w=(u-l)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+c)/m}else if(o>f){const m=2*Math.sqrt(1+o-i-f);this._w=(s-c)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+f-i-o);this._w=(a-r)/m,this._x=(s+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(vt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-i*c,this._z=s*u+a*c+i*l-r*o,this._w=a*u-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*i+t*this._x,this._y=m*r+t*this._y,this._z=m*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),f=Math.sin((1-t)*u)/c,p=Math.sin(t*u)/c;return this._w=a*f+this._w*p,this._x=i*f+this._x*p,this._y=r*f+this._y*p,this._z=s*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=Math.random(),t=Math.sqrt(1-e),i=Math.sqrt(e),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(t*Math.cos(r),i*Math.sin(s),i*Math.cos(s),t*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(wo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(wo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),u=2*(o*t-s*r),f=2*(s*i-a*t);return this.x=t+l*c+a*f-o*u,this.y=i+l*u+o*c-s*f,this.z=r+l*f+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return As.copy(this).projectOnVector(e),this.sub(As)}reflect(e){return this.sub(As.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(vt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(t),this.y=i*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const As=new D,wo=new En;class fi{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(nn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(nn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=nn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,nn):nn.fromBufferAttribute(s,a),nn.applyMatrix4(e.matrixWorld),this.expandByPoint(nn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Er.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Er.copy(i.boundingBox)),Er.applyMatrix4(e.matrixWorld),this.union(Er)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,nn),nn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qi),br.subVectors(this.max,Qi),gi.subVectors(e.a,Qi),_i.subVectors(e.b,Qi),vi.subVectors(e.c,Qi),Fn.subVectors(_i,gi),On.subVectors(vi,_i),Jn.subVectors(gi,vi);let t=[0,-Fn.z,Fn.y,0,-On.z,On.y,0,-Jn.z,Jn.y,Fn.z,0,-Fn.x,On.z,0,-On.x,Jn.z,0,-Jn.x,-Fn.y,Fn.x,0,-On.y,On.x,0,-Jn.y,Jn.x,0];return!Rs(t,gi,_i,vi,br)||(t=[1,0,0,0,1,0,0,0,1],!Rs(t,gi,_i,vi,br))?!1:(Tr.crossVectors(Fn,On),t=[Tr.x,Tr.y,Tr.z],Rs(t,gi,_i,vi,br))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,nn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(nn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const wn=[new D,new D,new D,new D,new D,new D,new D,new D],nn=new D,Er=new fi,gi=new D,_i=new D,vi=new D,Fn=new D,On=new D,Jn=new D,Qi=new D,br=new D,Tr=new D,Qn=new D;function Rs(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){Qn.fromArray(n,s);const o=r.x*Math.abs(Qn.x)+r.y*Math.abs(Qn.y)+r.z*Math.abs(Qn.z),l=e.dot(Qn),c=t.dot(Qn),u=i.dot(Qn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Zh=new fi,er=new D,Cs=new D;class $i{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Zh.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;er.subVectors(e,this.center);const t=er.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(er,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Cs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(er.copy(e.center).add(Cs)),this.expandByPoint(er.copy(e.center).sub(Cs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const An=new D,Ps=new D,wr=new D,Bn=new D,Ls=new D,Ar=new D,Ds=new D;class Zl{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,An)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=An.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(An.copy(this.origin).addScaledVector(this.direction,t),An.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Ps.copy(e).add(t).multiplyScalar(.5),wr.copy(t).sub(e).normalize(),Bn.copy(this.origin).sub(Ps);const s=e.distanceTo(t)*.5,a=-this.direction.dot(wr),o=Bn.dot(this.direction),l=-Bn.dot(wr),c=Bn.lengthSq(),u=Math.abs(1-a*a);let f,p,m,_;if(u>0)if(f=a*l-o,p=a*o-l,_=s*u,f>=0)if(p>=-_)if(p<=_){const g=1/u;f*=g,p*=g,m=f*(f+a*p+2*o)+p*(a*f+p+2*l)+c}else p=s,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*l)+c;else p=-s,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*l)+c;else p<=-_?(f=Math.max(0,-(-a*s+o)),p=f>0?-s:Math.min(Math.max(-s,-l),s),m=-f*f+p*(p+2*l)+c):p<=_?(f=0,p=Math.min(Math.max(-s,-l),s),m=p*(p+2*l)+c):(f=Math.max(0,-(a*s+o)),p=f>0?s:Math.min(Math.max(-s,-l),s),m=-f*f+p*(p+2*l)+c);else p=a>0?-s:s,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Ps).addScaledVector(wr,p),m}intersectSphere(e,t){An.subVectors(e.center,this.origin);const i=An.dot(this.direction),r=An.dot(An)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,p=this.origin;return c>=0?(i=(e.min.x-p.x)*c,r=(e.max.x-p.x)*c):(i=(e.max.x-p.x)*c,r=(e.min.x-p.x)*c),u>=0?(s=(e.min.y-p.y)*u,a=(e.max.y-p.y)*u):(s=(e.max.y-p.y)*u,a=(e.min.y-p.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-p.z)*f,l=(e.max.z-p.z)*f):(o=(e.max.z-p.z)*f,l=(e.min.z-p.z)*f),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,An)!==null}intersectTriangle(e,t,i,r,s){Ls.subVectors(t,e),Ar.subVectors(i,e),Ds.crossVectors(Ls,Ar);let a=this.direction.dot(Ds),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Bn.subVectors(this.origin,e);const l=o*this.direction.dot(Ar.crossVectors(Bn,Ar));if(l<0)return null;const c=o*this.direction.dot(Ls.cross(Bn));if(c<0||l+c>a)return null;const u=-o*Bn.dot(Ds);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class et{constructor(e,t,i,r,s,a,o,l,c,u,f,p,m,_,g,d){et.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c,u,f,p,m,_,g,d)}set(e,t,i,r,s,a,o,l,c,u,f,p,m,_,g,d){const h=this.elements;return h[0]=e,h[4]=t,h[8]=i,h[12]=r,h[1]=s,h[5]=a,h[9]=o,h[13]=l,h[2]=c,h[6]=u,h[10]=f,h[14]=p,h[3]=m,h[7]=_,h[11]=g,h[15]=d,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new et().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/xi.setFromMatrixColumn(e,0).length(),s=1/xi.setFromMatrixColumn(e,1).length(),a=1/xi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const p=a*u,m=a*f,_=o*u,g=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=m+_*c,t[5]=p-g*c,t[9]=-o*l,t[2]=g-p*c,t[6]=_+m*c,t[10]=a*l}else if(e.order==="YXZ"){const p=l*u,m=l*f,_=c*u,g=c*f;t[0]=p+g*o,t[4]=_*o-m,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=m*o-_,t[6]=g+p*o,t[10]=a*l}else if(e.order==="ZXY"){const p=l*u,m=l*f,_=c*u,g=c*f;t[0]=p-g*o,t[4]=-a*f,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*u,t[9]=g-p*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const p=a*u,m=a*f,_=o*u,g=o*f;t[0]=l*u,t[4]=_*c-m,t[8]=p*c+g,t[1]=l*f,t[5]=g*c+p,t[9]=m*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const p=a*l,m=a*c,_=o*l,g=o*c;t[0]=l*u,t[4]=g-p*f,t[8]=_*f+m,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=m*f+_,t[10]=p-g*f}else if(e.order==="XZY"){const p=a*l,m=a*c,_=o*l,g=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=p*f+g,t[5]=a*u,t[9]=m*f-_,t[2]=_*f-m,t[6]=o*u,t[10]=g*f+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Jh,e,Qh)}lookAt(e,t,i){const r=this.elements;return Gt.subVectors(e,t),Gt.lengthSq()===0&&(Gt.z=1),Gt.normalize(),zn.crossVectors(i,Gt),zn.lengthSq()===0&&(Math.abs(i.z)===1?Gt.x+=1e-4:Gt.z+=1e-4,Gt.normalize(),zn.crossVectors(i,Gt)),zn.normalize(),Rr.crossVectors(Gt,zn),r[0]=zn.x,r[4]=Rr.x,r[8]=Gt.x,r[1]=zn.y,r[5]=Rr.y,r[9]=Gt.y,r[2]=zn.z,r[6]=Rr.z,r[10]=Gt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],f=i[5],p=i[9],m=i[13],_=i[2],g=i[6],d=i[10],h=i[14],x=i[3],v=i[7],S=i[11],R=i[15],w=r[0],A=r[4],k=r[8],y=r[12],E=r[1],O=r[5],W=r[9],K=r[13],C=r[2],F=r[6],Y=r[10],I=r[14],B=r[3],H=r[7],X=r[11],Z=r[15];return s[0]=a*w+o*E+l*C+c*B,s[4]=a*A+o*O+l*F+c*H,s[8]=a*k+o*W+l*Y+c*X,s[12]=a*y+o*K+l*I+c*Z,s[1]=u*w+f*E+p*C+m*B,s[5]=u*A+f*O+p*F+m*H,s[9]=u*k+f*W+p*Y+m*X,s[13]=u*y+f*K+p*I+m*Z,s[2]=_*w+g*E+d*C+h*B,s[6]=_*A+g*O+d*F+h*H,s[10]=_*k+g*W+d*Y+h*X,s[14]=_*y+g*K+d*I+h*Z,s[3]=x*w+v*E+S*C+R*B,s[7]=x*A+v*O+S*F+R*H,s[11]=x*k+v*W+S*Y+R*X,s[15]=x*y+v*K+S*I+R*Z,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],p=e[10],m=e[14],_=e[3],g=e[7],d=e[11],h=e[15];return _*(+s*l*f-r*c*f-s*o*p+i*c*p+r*o*m-i*l*m)+g*(+t*l*m-t*c*p+s*a*p-r*a*m+r*c*u-s*l*u)+d*(+t*c*f-t*o*m-s*a*f+i*a*m+s*o*u-i*c*u)+h*(-r*o*u-t*l*f+t*o*p+r*a*f-i*a*p+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],p=e[10],m=e[11],_=e[12],g=e[13],d=e[14],h=e[15],x=f*d*c-g*p*c+g*l*m-o*d*m-f*l*h+o*p*h,v=_*p*c-u*d*c-_*l*m+a*d*m+u*l*h-a*p*h,S=u*g*c-_*f*c+_*o*m-a*g*m-u*o*h+a*f*h,R=_*f*l-u*g*l-_*o*p+a*g*p+u*o*d-a*f*d,w=t*x+i*v+r*S+s*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return e[0]=x*A,e[1]=(g*p*s-f*d*s-g*r*m+i*d*m+f*r*h-i*p*h)*A,e[2]=(o*d*s-g*l*s+g*r*c-i*d*c-o*r*h+i*l*h)*A,e[3]=(f*l*s-o*p*s-f*r*c+i*p*c+o*r*m-i*l*m)*A,e[4]=v*A,e[5]=(u*d*s-_*p*s+_*r*m-t*d*m-u*r*h+t*p*h)*A,e[6]=(_*l*s-a*d*s-_*r*c+t*d*c+a*r*h-t*l*h)*A,e[7]=(a*p*s-u*l*s+u*r*c-t*p*c-a*r*m+t*l*m)*A,e[8]=S*A,e[9]=(_*f*s-u*g*s-_*i*m+t*g*m+u*i*h-t*f*h)*A,e[10]=(a*g*s-_*o*s+_*i*c-t*g*c-a*i*h+t*o*h)*A,e[11]=(u*o*s-a*f*s-u*i*c+t*f*c+a*i*m-t*o*m)*A,e[12]=R*A,e[13]=(u*g*r-_*f*r+_*i*p-t*g*p-u*i*d+t*f*d)*A,e[14]=(_*o*r-a*g*r-_*i*l+t*g*l+a*i*d-t*o*d)*A,e[15]=(a*f*r-u*o*r+u*i*l-t*f*l-a*i*p+t*o*p)*A,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+i,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,f=o+o,p=s*c,m=s*u,_=s*f,g=a*u,d=a*f,h=o*f,x=l*c,v=l*u,S=l*f,R=i.x,w=i.y,A=i.z;return r[0]=(1-(g+h))*R,r[1]=(m+S)*R,r[2]=(_-v)*R,r[3]=0,r[4]=(m-S)*w,r[5]=(1-(p+h))*w,r[6]=(d+x)*w,r[7]=0,r[8]=(_+v)*A,r[9]=(d-x)*A,r[10]=(1-(p+g))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=xi.set(r[0],r[1],r[2]).length();const a=xi.set(r[4],r[5],r[6]).length(),o=xi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],rn.copy(this);const c=1/s,u=1/a,f=1/o;return rn.elements[0]*=c,rn.elements[1]*=c,rn.elements[2]*=c,rn.elements[4]*=u,rn.elements[5]*=u,rn.elements[6]*=u,rn.elements[8]*=f,rn.elements[9]*=f,rn.elements[10]*=f,t.setFromRotationMatrix(rn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,r,s,a,o=Un){const l=this.elements,c=2*s/(t-e),u=2*s/(i-r),f=(t+e)/(t-e),p=(i+r)/(i-r);let m,_;if(o===Un)m=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===rs)m=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=Un){const l=this.elements,c=1/(t-e),u=1/(i-r),f=1/(a-s),p=(t+e)*c,m=(i+r)*u;let _,g;if(o===Un)_=(a+s)*f,g=-2*f;else if(o===rs)_=s*f,g=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-p,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=g,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const xi=new D,rn=new et,Jh=new D(0,0,0),Qh=new D(1,1,1),zn=new D,Rr=new D,Gt=new D,Ao=new et,Ro=new En;class hs{constructor(e=0,t=0,i=0,r=hs.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],f=r[2],p=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-vt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(vt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-vt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(vt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-vt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Ao.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ao,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ro.setFromEuler(this),this.setFromQuaternion(Ro,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}hs.DEFAULT_ORDER="XYZ";class Jl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let eu=0;const Co=new D,Mi=new En,Rn=new et,Cr=new D,tr=new D,tu=new D,nu=new En,Po=new D(1,0,0),Lo=new D(0,1,0),Do=new D(0,0,1),iu={type:"added"},ru={type:"removed"};class St extends qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:eu++}),this.uuid=Yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=St.DEFAULT_UP.clone();const e=new D,t=new hs,i=new En,r=new D(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new et},normalMatrix:{value:new He}}),this.matrix=new et,this.matrixWorld=new et,this.matrixAutoUpdate=St.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Jl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.premultiply(Mi),this}rotateX(e){return this.rotateOnAxis(Po,e)}rotateY(e){return this.rotateOnAxis(Lo,e)}rotateZ(e){return this.rotateOnAxis(Do,e)}translateOnAxis(e,t){return Co.copy(e).applyQuaternion(this.quaternion),this.position.add(Co.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Po,e)}translateY(e){return this.translateOnAxis(Lo,e)}translateZ(e){return this.translateOnAxis(Do,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Rn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Cr.copy(e):Cr.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),tr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rn.lookAt(tr,Cr,this.up):Rn.lookAt(Cr,tr,this.up),this.quaternion.setFromRotationMatrix(Rn),r&&(Rn.extractRotation(r.matrixWorld),Mi.setFromRotationMatrix(Rn),this.quaternion.premultiply(Mi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(iu)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ru)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Rn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Rn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Rn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(tr,e,tu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(tr,nu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++){const s=t[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++){const o=r[s];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),p=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),p.length>0&&(i.skeletons=p),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=r,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}St.DEFAULT_UP=new D(0,1,0);St.DEFAULT_MATRIX_AUTO_UPDATE=!0;St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const sn=new D,Cn=new D,Us=new D,Pn=new D,yi=new D,Si=new D,Uo=new D,Is=new D,Ns=new D,Fs=new D;let Pr=!1;class cn{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),sn.subVectors(e,t),r.cross(sn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){sn.subVectors(r,t),Cn.subVectors(i,t),Us.subVectors(e,t);const a=sn.dot(sn),o=sn.dot(Cn),l=sn.dot(Us),c=Cn.dot(Cn),u=Cn.dot(Us),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;const p=1/f,m=(c*l-o*u)*p,_=(a*u-o*l)*p;return s.set(1-m-_,_,m)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Pn)===null?!1:Pn.x>=0&&Pn.y>=0&&Pn.x+Pn.y<=1}static getUV(e,t,i,r,s,a,o,l){return Pr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Pr=!0),this.getInterpolation(e,t,i,r,s,a,o,l)}static getInterpolation(e,t,i,r,s,a,o,l){return this.getBarycoord(e,t,i,r,Pn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Pn.x),l.addScaledVector(a,Pn.y),l.addScaledVector(o,Pn.z),l)}static isFrontFacing(e,t,i,r){return sn.subVectors(i,t),Cn.subVectors(e,t),sn.cross(Cn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return sn.subVectors(this.c,this.b),Cn.subVectors(this.a,this.b),sn.cross(Cn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return cn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return cn.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,i,r,s){return Pr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Pr=!0),cn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}getInterpolation(e,t,i,r,s){return cn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return cn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return cn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;yi.subVectors(r,i),Si.subVectors(s,i),Is.subVectors(e,i);const l=yi.dot(Is),c=Si.dot(Is);if(l<=0&&c<=0)return t.copy(i);Ns.subVectors(e,r);const u=yi.dot(Ns),f=Si.dot(Ns);if(u>=0&&f<=u)return t.copy(r);const p=l*f-u*c;if(p<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(yi,a);Fs.subVectors(e,s);const m=yi.dot(Fs),_=Si.dot(Fs);if(_>=0&&m<=_)return t.copy(s);const g=m*c-l*_;if(g<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(i).addScaledVector(Si,o);const d=u*_-m*f;if(d<=0&&f-u>=0&&m-_>=0)return Uo.subVectors(s,r),o=(f-u)/(f-u+(m-_)),t.copy(r).addScaledVector(Uo,o);const h=1/(d+g+p);return a=g*h,o=p*h,t.copy(i).addScaledVector(yi,a).addScaledVector(Si,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ql={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gn={h:0,s:0,l:0},Lr={h:0,s:0,l:0};function Os(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ee{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=je.workingColorSpace){return this.r=e,this.g=t,this.b=i,je.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=je.workingColorSpace){if(e=wa(e,1),t=vt(t,0,1),i=vt(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Os(a,s,e+1/3),this.g=Os(a,s,e),this.b=Os(a,s,e-1/3)}return je.toWorkingColorSpace(this,r),this}setStyle(e,t=ut){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ut){const i=Ql[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Gi(e.r),this.g=Gi(e.g),this.b=Gi(e.b),this}copyLinearToSRGB(e){return this.r=Ts(e.r),this.g=Ts(e.g),this.b=Ts(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ut){return je.fromWorkingColorSpace(wt.copy(this),e),Math.round(vt(wt.r*255,0,255))*65536+Math.round(vt(wt.g*255,0,255))*256+Math.round(vt(wt.b*255,0,255))}getHexString(e=ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.fromWorkingColorSpace(wt.copy(this),t);const i=wt.r,r=wt.g,s=wt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=je.workingColorSpace){return je.fromWorkingColorSpace(wt.copy(this),t),e.r=wt.r,e.g=wt.g,e.b=wt.b,e}getStyle(e=ut){je.fromWorkingColorSpace(wt.copy(this),e);const t=wt.r,i=wt.g,r=wt.b;return e!==ut?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Gn),this.setHSL(Gn.h+e,Gn.s+t,Gn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Gn),e.getHSL(Lr);const i=cr(Gn.h,Lr.h,t),r=cr(Gn.s,Lr.s,t),s=cr(Gn.l,Lr.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const wt=new Ee;Ee.NAMES=Ql;let su=0;class ji extends qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:su++}),this.uuid=Yi(),this.name="",this.type="Material",this.blending=zi,this.side=$n,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=la,this.blendDst=ca,this.blendEquation=ri,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ee(0,0,0),this.blendAlpha=0,this.depthFunc=es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pi,this.stencilZFail=pi,this.stencilZPass=pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(i.blending=this.blending),this.side!==$n&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==la&&(i.blendSrc=this.blendSrc),this.blendDst!==ca&&(i.blendDst=this.blendDst),this.blendEquation!==ri&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==es&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xo&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==pi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==pi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class yn extends ji{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Nl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const lt=new D,Dr=new Re;class dt{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Mo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Vn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Dr.fromBufferAttribute(this,t),Dr.applyMatrix3(e),this.setXY(t,Dr.x,Dr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)lt.fromBufferAttribute(this,t),lt.applyMatrix3(e),this.setXYZ(t,lt.x,lt.y,lt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)lt.fromBufferAttribute(this,t),lt.applyMatrix4(e),this.setXYZ(t,lt.x,lt.y,lt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)lt.fromBufferAttribute(this,t),lt.applyNormalMatrix(e),this.setXYZ(t,lt.x,lt.y,lt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)lt.fromBufferAttribute(this,t),lt.transformDirection(e),this.setXYZ(t,lt.x,lt.y,lt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ii(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Dt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ii(t,this.array)),t}setX(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ii(t,this.array)),t}setY(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ii(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ii(t,this.array)),t}setW(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),i=Dt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),i=Dt(i,this.array),r=Dt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),i=Dt(i,this.array),r=Dt(r,this.array),s=Dt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Mo&&(e.usage=this.usage),e}}class ec extends dt{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class tc extends dt{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ht extends dt{constructor(e,t,i){super(new Float32Array(e),t,i)}}let au=0;const qt=new et,Bs=new St,Ei=new D,kt=new fi,nr=new fi,_t=new D;class Et extends qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:au++}),this.uuid=Yi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Yl(e)?tc:ec)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new He().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return qt.makeRotationFromQuaternion(e),this.applyMatrix4(qt),this}rotateX(e){return qt.makeRotationX(e),this.applyMatrix4(qt),this}rotateY(e){return qt.makeRotationY(e),this.applyMatrix4(qt),this}rotateZ(e){return qt.makeRotationZ(e),this.applyMatrix4(qt),this}translate(e,t,i){return qt.makeTranslation(e,t,i),this.applyMatrix4(qt),this}scale(e,t,i){return qt.makeScale(e,t,i),this.applyMatrix4(qt),this}lookAt(e){return Bs.lookAt(e),Bs.updateMatrix(),this.applyMatrix4(Bs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(e){const t=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new ht(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];kt.setFromBufferAttribute(s),this.morphTargetsRelative?(_t.addVectors(this.boundingBox.min,kt.min),this.boundingBox.expandByPoint(_t),_t.addVectors(this.boundingBox.max,kt.max),this.boundingBox.expandByPoint(_t)):(this.boundingBox.expandByPoint(kt.min),this.boundingBox.expandByPoint(kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $i);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(kt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];nr.setFromBufferAttribute(o),this.morphTargetsRelative?(_t.addVectors(kt.min,nr.min),kt.expandByPoint(_t),_t.addVectors(kt.max,nr.max),kt.expandByPoint(_t)):(kt.expandByPoint(nr.min),kt.expandByPoint(nr.max))}kt.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)_t.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(_t));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)_t.fromBufferAttribute(o,c),l&&(Ei.fromBufferAttribute(e,c),_t.add(Ei)),r=Math.max(r,i.distanceToSquared(_t))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,r=t.position.array,s=t.normal.array,a=t.uv.array,o=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new dt(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],u=[];for(let E=0;E<o;E++)c[E]=new D,u[E]=new D;const f=new D,p=new D,m=new D,_=new Re,g=new Re,d=new Re,h=new D,x=new D;function v(E,O,W){f.fromArray(r,E*3),p.fromArray(r,O*3),m.fromArray(r,W*3),_.fromArray(a,E*2),g.fromArray(a,O*2),d.fromArray(a,W*2),p.sub(f),m.sub(f),g.sub(_),d.sub(_);const K=1/(g.x*d.y-d.x*g.y);isFinite(K)&&(h.copy(p).multiplyScalar(d.y).addScaledVector(m,-g.y).multiplyScalar(K),x.copy(m).multiplyScalar(g.x).addScaledVector(p,-d.x).multiplyScalar(K),c[E].add(h),c[O].add(h),c[W].add(h),u[E].add(x),u[O].add(x),u[W].add(x))}let S=this.groups;S.length===0&&(S=[{start:0,count:i.length}]);for(let E=0,O=S.length;E<O;++E){const W=S[E],K=W.start,C=W.count;for(let F=K,Y=K+C;F<Y;F+=3)v(i[F+0],i[F+1],i[F+2])}const R=new D,w=new D,A=new D,k=new D;function y(E){A.fromArray(s,E*3),k.copy(A);const O=c[E];R.copy(O),R.sub(A.multiplyScalar(A.dot(O))).normalize(),w.crossVectors(k,O);const K=w.dot(u[E])<0?-1:1;l[E*4]=R.x,l[E*4+1]=R.y,l[E*4+2]=R.z,l[E*4+3]=K}for(let E=0,O=S.length;E<O;++E){const W=S[E],K=W.start,C=W.count;for(let F=K,Y=K+C;F<Y;F+=3)y(i[F+0]),y(i[F+1]),y(i[F+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new dt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let p=0,m=i.count;p<m;p++)i.setXYZ(p,0,0,0);const r=new D,s=new D,a=new D,o=new D,l=new D,c=new D,u=new D,f=new D;if(e)for(let p=0,m=e.count;p<m;p+=3){const _=e.getX(p+0),g=e.getX(p+1),d=e.getX(p+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,d),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,g),c.fromBufferAttribute(i,d),o.add(u),l.add(u),c.add(u),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(g,l.x,l.y,l.z),i.setXYZ(d,c.x,c.y,c.z)}else for(let p=0,m=t.count;p<m;p+=3)r.fromBufferAttribute(t,p+0),s.fromBufferAttribute(t,p+1),a.fromBufferAttribute(t,p+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),i.setXYZ(p+0,u.x,u.y,u.z),i.setXYZ(p+1,u.x,u.y,u.z),i.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)_t.fromBufferAttribute(e,t),_t.normalize(),e.setXYZ(t,_t.x,_t.y,_t.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,p=new c.constructor(l.length*u);let m=0,_=0;for(let g=0,d=l.length;g<d;g++){o.isInterleavedBufferAttribute?m=l[g]*o.data.stride+o.offset:m=l[g]*u;for(let h=0;h<u;h++)p[_++]=c[m++]}return new dt(p,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Et,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,f=c.length;u<f;u++){const p=c[u],m=e(p,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,p=c.length;f<p;f++){const m=c[f];u.push(m.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let p=0,m=f.length;p<m;p++)u.push(f[p].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Io=new et,ei=new Zl,Ur=new $i,No=new D,bi=new D,Ti=new D,wi=new D,zs=new D,Ir=new D,Nr=new Re,Fr=new Re,Or=new Re,Fo=new D,Oo=new D,Bo=new D,Br=new D,zr=new D;class Ne extends St{constructor(e=new Et,t=new yn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Ir.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],f=s[l];u!==0&&(zs.fromBufferAttribute(f,e),a?Ir.addScaledVector(zs,u):Ir.addScaledVector(zs.sub(t),u))}t.add(Ir)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ur.copy(i.boundingSphere),Ur.applyMatrix4(s),ei.copy(e.ray).recast(e.near),!(Ur.containsPoint(ei.origin)===!1&&(ei.intersectSphere(Ur,No)===null||ei.origin.distanceToSquared(No)>(e.far-e.near)**2))&&(Io.copy(s).invert(),ei.copy(e.ray).applyMatrix4(Io),!(i.boundingBox!==null&&ei.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ei)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,p=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,g=p.length;_<g;_++){const d=p[_],h=a[d.materialIndex],x=Math.max(d.start,m.start),v=Math.min(o.count,Math.min(d.start+d.count,m.start+m.count));for(let S=x,R=v;S<R;S+=3){const w=o.getX(S),A=o.getX(S+1),k=o.getX(S+2);r=Gr(this,h,e,i,c,u,f,w,A,k),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=d.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),g=Math.min(o.count,m.start+m.count);for(let d=_,h=g;d<h;d+=3){const x=o.getX(d),v=o.getX(d+1),S=o.getX(d+2);r=Gr(this,a,e,i,c,u,f,x,v,S),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,g=p.length;_<g;_++){const d=p[_],h=a[d.materialIndex],x=Math.max(d.start,m.start),v=Math.min(l.count,Math.min(d.start+d.count,m.start+m.count));for(let S=x,R=v;S<R;S+=3){const w=S,A=S+1,k=S+2;r=Gr(this,h,e,i,c,u,f,w,A,k),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=d.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),g=Math.min(l.count,m.start+m.count);for(let d=_,h=g;d<h;d+=3){const x=d,v=d+1,S=d+2;r=Gr(this,a,e,i,c,u,f,x,v,S),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}}function ou(n,e,t,i,r,s,a,o){let l;if(e.side===Ct?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===$n,o),l===null)return null;zr.copy(o),zr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(zr);return c<t.near||c>t.far?null:{distance:c,point:zr.clone(),object:n}}function Gr(n,e,t,i,r,s,a,o,l,c){n.getVertexPosition(o,bi),n.getVertexPosition(l,Ti),n.getVertexPosition(c,wi);const u=ou(n,e,t,i,bi,Ti,wi,Br);if(u){r&&(Nr.fromBufferAttribute(r,o),Fr.fromBufferAttribute(r,l),Or.fromBufferAttribute(r,c),u.uv=cn.getInterpolation(Br,bi,Ti,wi,Nr,Fr,Or,new Re)),s&&(Nr.fromBufferAttribute(s,o),Fr.fromBufferAttribute(s,l),Or.fromBufferAttribute(s,c),u.uv1=cn.getInterpolation(Br,bi,Ti,wi,Nr,Fr,Or,new Re),u.uv2=u.uv1),a&&(Fo.fromBufferAttribute(a,o),Oo.fromBufferAttribute(a,l),Bo.fromBufferAttribute(a,c),u.normal=cn.getInterpolation(Br,bi,Ti,wi,Fo,Oo,Bo,new D),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new D,materialIndex:0};cn.getNormal(bi,Ti,wi,f.normal),u.face=f}return u}class xr extends Et{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],f=[];let p=0,m=0;_("z","y","x",-1,-1,i,t,e,a,s,0),_("z","y","x",1,-1,i,t,-e,a,s,1),_("x","z","y",1,1,e,i,t,r,a,2),_("x","z","y",1,-1,e,i,-t,r,a,3),_("x","y","z",1,-1,e,t,i,r,s,4),_("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new ht(c,3)),this.setAttribute("normal",new ht(u,3)),this.setAttribute("uv",new ht(f,2));function _(g,d,h,x,v,S,R,w,A,k,y){const E=S/A,O=R/k,W=S/2,K=R/2,C=w/2,F=A+1,Y=k+1;let I=0,B=0;const H=new D;for(let X=0;X<Y;X++){const Z=X*O-K;for(let se=0;se<F;se++){const $=se*E-W;H[g]=$*x,H[d]=Z*v,H[h]=C,c.push(H.x,H.y,H.z),H[g]=0,H[d]=0,H[h]=w>0?1:-1,u.push(H.x,H.y,H.z),f.push(se/A),f.push(1-X/k),I+=1}}for(let X=0;X<k;X++)for(let Z=0;Z<A;Z++){const se=p+Z+F*X,$=p+Z+F*(X+1),J=p+(Z+1)+F*(X+1),ue=p+(Z+1)+F*X;l.push(se,$,ue),l.push($,J,ue),B+=6}o.addGroup(m,B,y),m+=B,p+=I}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Wi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Ut(n){const e={};for(let t=0;t<n.length;t++){const i=Wi(n[t]);for(const r in i)e[r]=i[r]}return e}function lu(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function nc(n){return n.getRenderTarget()===null?n.outputColorSpace:je.workingColorSpace}const cu={clone:Wi,merge:Ut};var hu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,uu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class jn extends ji{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=hu,this.fragmentShader=uu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Wi(e.uniforms),this.uniformsGroups=lu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class ic extends St{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new et,this.projectionMatrix=new et,this.projectionMatrixInverse=new et,this.coordinateSystem=Un}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class jt extends ic{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=mr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(lr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return mr*2*Math.atan(Math.tan(lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(lr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ai=-90,Ri=1;class du extends St{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new jt(Ai,Ri,e,t);r.layers=this.layers,this.add(r);const s=new jt(Ai,Ri,e,t);s.layers=this.layers,this.add(s);const a=new jt(Ai,Ri,e,t);a.layers=this.layers,this.add(a);const o=new jt(Ai,Ri,e,t);o.layers=this.layers,this.add(o);const l=new jt(Ai,Ri,e,t);l.layers=this.layers,this.add(l);const c=new jt(Ai,Ri,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===Un)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===rs)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,f=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,a),e.setRenderTarget(i,2,r),e.render(t,o),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=g,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(f,p,m),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class rc extends Bt{constructor(e,t,i,r,s,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:ki,super(e,t,i,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class fu extends ui{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];t.encoding!==void 0&&(hr("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===ci?ut:Jt),this.texture=new rc(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:$t}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new xr(5,5,5),s=new jn({name:"CubemapFromEquirect",uniforms:Wi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ct,blending:Xn});s.uniforms.tEquirect.value=t;const a=new Ne(r,s),o=t.minFilter;return t.minFilter===fr&&(t.minFilter=$t),new du(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}const Gs=new D,pu=new D,mu=new He;class kn{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Gs.subVectors(i,t).cross(pu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Gs),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||mu.getNormalMatrix(e),r=this.coplanarPoint(Gs).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ti=new $i,kr=new D;class Aa{constructor(e=new kn,t=new kn,i=new kn,r=new kn,s=new kn,a=new kn){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Un){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],u=r[5],f=r[6],p=r[7],m=r[8],_=r[9],g=r[10],d=r[11],h=r[12],x=r[13],v=r[14],S=r[15];if(i[0].setComponents(l-s,p-c,d-m,S-h).normalize(),i[1].setComponents(l+s,p+c,d+m,S+h).normalize(),i[2].setComponents(l+a,p+u,d+_,S+x).normalize(),i[3].setComponents(l-a,p-u,d-_,S-x).normalize(),i[4].setComponents(l-o,p-f,d-g,S-v).normalize(),t===Un)i[5].setComponents(l+o,p+f,d+g,S+v).normalize();else if(t===rs)i[5].setComponents(o,f,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ti.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ti.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ti)}intersectsSprite(e){return ti.center.set(0,0,0),ti.radius=.7071067811865476,ti.applyMatrix4(e.matrixWorld),this.intersectsSphere(ti)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(kr.x=r.normal.x>0?e.max.x:e.min.x,kr.y=r.normal.y>0?e.max.y:e.min.y,kr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(kr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function sc(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function gu(n,e){const t=e.isWebGL2,i=new WeakMap;function r(c,u){const f=c.array,p=c.usage,m=f.byteLength,_=n.createBuffer();n.bindBuffer(u,_),n.bufferData(u,f,p),c.onUploadCallback();let g;if(f instanceof Float32Array)g=n.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)g=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=n.UNSIGNED_SHORT;else if(f instanceof Int16Array)g=n.SHORT;else if(f instanceof Uint32Array)g=n.UNSIGNED_INT;else if(f instanceof Int32Array)g=n.INT;else if(f instanceof Int8Array)g=n.BYTE;else if(f instanceof Uint8Array)g=n.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)g=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:_,type:g,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version,size:m}}function s(c,u,f){const p=u.array,m=u._updateRange,_=u.updateRanges;if(n.bindBuffer(f,c),m.count===-1&&_.length===0&&n.bufferSubData(f,0,p),_.length!==0){for(let g=0,d=_.length;g<d;g++){const h=_[g];t?n.bufferSubData(f,h.start*p.BYTES_PER_ELEMENT,p,h.start,h.count):n.bufferSubData(f,h.start*p.BYTES_PER_ELEMENT,p.subarray(h.start,h.start+h.count))}u.clearUpdateRanges()}m.count!==-1&&(t?n.bufferSubData(f,m.offset*p.BYTES_PER_ELEMENT,p,m.offset,m.count):n.bufferSubData(f,m.offset*p.BYTES_PER_ELEMENT,p.subarray(m.offset,m.offset+m.count)),m.count=-1),u.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=i.get(c);u&&(n.deleteBuffer(u.buffer),i.delete(c))}function l(c,u){if(c.isGLBufferAttribute){const p=i.get(c);(!p||p.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const f=i.get(c);if(f===void 0)i.set(c,r(c,u));else if(f.version<c.version){if(f.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(f.buffer,c,u),f.version=c.version}}return{get:a,remove:o,update:l}}class gr extends Et{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,u=l+1,f=e/o,p=t/l,m=[],_=[],g=[],d=[];for(let h=0;h<u;h++){const x=h*p-a;for(let v=0;v<c;v++){const S=v*f-s;_.push(S,-x,0),g.push(0,0,1),d.push(v/o),d.push(1-h/l)}}for(let h=0;h<l;h++)for(let x=0;x<o;x++){const v=x+c*h,S=x+c*(h+1),R=x+1+c*(h+1),w=x+1+c*h;m.push(v,S,w),m.push(S,R,w)}this.setIndex(m),this.setAttribute("position",new ht(_,3)),this.setAttribute("normal",new ht(g,3)),this.setAttribute("uv",new ht(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gr(e.width,e.height,e.widthSegments,e.heightSegments)}}var _u=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vu=`#ifdef USE_ALPHAHASH
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
#endif`,xu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Mu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yu=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Su=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Eu=`#ifdef USE_AOMAP
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
#endif`,bu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tu=`#ifdef USE_BATCHING
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
#endif`,wu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Au=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ru=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Cu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Pu=`#ifdef USE_IRIDESCENCE
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
#endif`,Lu=`#ifdef USE_BUMPMAP
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
#endif`,Du=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Uu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Iu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Nu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Fu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ou=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Bu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,zu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Gu=`#define PI 3.141592653589793
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
} // validated`,ku=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Hu=`vec3 transformedNormal = objectNormal;
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
#endif`,Vu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Yu="gl_FragColor = linearToOutputTexel( gl_FragColor );",$u=`
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
}`,ju=`#ifdef USE_ENVMAP
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
#endif`,Ku=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zu=`#ifdef USE_ENVMAP
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
#endif`,Ju=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qu=`#ifdef USE_ENVMAP
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
#endif`,ed=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,td=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,nd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,id=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,rd=`#ifdef USE_GRADIENTMAP
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
}`,sd=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,ad=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,od=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ld=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,cd=`uniform bool receiveShadow;
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
#endif`,hd=`#ifdef USE_ENVMAP
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
#endif`,ud=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,fd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,pd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,md=`PhysicalMaterial material;
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
#endif`,gd=`struct PhysicalMaterial {
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
}`,_d=`
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
#endif`,vd=`#if defined( RE_IndirectDiffuse )
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
#endif`,xd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Md=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Ed=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,bd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Td=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,wd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ad=`#if defined( USE_POINTS_UV )
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
#endif`,Rd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Pd=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ld=`#ifdef USE_MORPHNORMALS
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
#endif`,Dd=`#ifdef USE_MORPHTARGETS
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
#endif`,Ud=`#ifdef USE_MORPHTARGETS
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
#endif`,Id=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Nd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Fd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Od=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,zd=`#ifdef USE_NORMALMAP
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
#endif`,Gd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,kd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Hd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Vd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Wd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,qd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Yd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,$d=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Kd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Zd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Jd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Qd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ef=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,tf=`float getShadowMask() {
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
}`,nf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,rf=`#ifdef USE_SKINNING
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
#endif`,sf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,af=`#ifdef USE_SKINNING
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
#endif`,of=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,cf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hf=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,uf=`#ifdef USE_TRANSMISSION
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
#endif`,df=`#ifdef USE_TRANSMISSION
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
#endif`,ff=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const _f=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,vf=`uniform sampler2D t2D;
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
}`,xf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mf=`#ifdef ENVMAP_TYPE_CUBE
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
}`,yf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ef=`#include <common>
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
}`,bf=`#if DEPTH_PACKING == 3200
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
}`,Tf=`#define DISTANCE
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
}`,wf=`#define DISTANCE
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
}`,Af=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cf=`uniform float scale;
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
}`,Pf=`uniform vec3 diffuse;
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
}`,Lf=`#include <common>
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
}`,Df=`uniform vec3 diffuse;
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
}`,Uf=`#define LAMBERT
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
}`,If=`#define LAMBERT
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
}`,Nf=`#define MATCAP
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
}`,Ff=`#define MATCAP
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
}`,Of=`#define NORMAL
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
}`,Bf=`#define NORMAL
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
}`,zf=`#define PHONG
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
}`,Gf=`#define PHONG
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
}`,kf=`#define STANDARD
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
}`,Hf=`#define STANDARD
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
}`,Vf=`#define TOON
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
}`,Wf=`#define TOON
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
}`,Xf=`uniform float size;
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
}`,qf=`uniform vec3 diffuse;
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
}`,Yf=`#include <common>
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
}`,$f=`uniform vec3 color;
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
}`,jf=`uniform float rotation;
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
}`,Kf=`uniform vec3 diffuse;
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
}`,Oe={alphahash_fragment:_u,alphahash_pars_fragment:vu,alphamap_fragment:xu,alphamap_pars_fragment:Mu,alphatest_fragment:yu,alphatest_pars_fragment:Su,aomap_fragment:Eu,aomap_pars_fragment:bu,batching_pars_vertex:Tu,batching_vertex:wu,begin_vertex:Au,beginnormal_vertex:Ru,bsdfs:Cu,iridescence_fragment:Pu,bumpmap_pars_fragment:Lu,clipping_planes_fragment:Du,clipping_planes_pars_fragment:Uu,clipping_planes_pars_vertex:Iu,clipping_planes_vertex:Nu,color_fragment:Fu,color_pars_fragment:Ou,color_pars_vertex:Bu,color_vertex:zu,common:Gu,cube_uv_reflection_fragment:ku,defaultnormal_vertex:Hu,displacementmap_pars_vertex:Vu,displacementmap_vertex:Wu,emissivemap_fragment:Xu,emissivemap_pars_fragment:qu,colorspace_fragment:Yu,colorspace_pars_fragment:$u,envmap_fragment:ju,envmap_common_pars_fragment:Ku,envmap_pars_fragment:Zu,envmap_pars_vertex:Ju,envmap_physical_pars_fragment:hd,envmap_vertex:Qu,fog_vertex:ed,fog_pars_vertex:td,fog_fragment:nd,fog_pars_fragment:id,gradientmap_pars_fragment:rd,lightmap_fragment:sd,lightmap_pars_fragment:ad,lights_lambert_fragment:od,lights_lambert_pars_fragment:ld,lights_pars_begin:cd,lights_toon_fragment:ud,lights_toon_pars_fragment:dd,lights_phong_fragment:fd,lights_phong_pars_fragment:pd,lights_physical_fragment:md,lights_physical_pars_fragment:gd,lights_fragment_begin:_d,lights_fragment_maps:vd,lights_fragment_end:xd,logdepthbuf_fragment:Md,logdepthbuf_pars_fragment:yd,logdepthbuf_pars_vertex:Sd,logdepthbuf_vertex:Ed,map_fragment:bd,map_pars_fragment:Td,map_particle_fragment:wd,map_particle_pars_fragment:Ad,metalnessmap_fragment:Rd,metalnessmap_pars_fragment:Cd,morphcolor_vertex:Pd,morphnormal_vertex:Ld,morphtarget_pars_vertex:Dd,morphtarget_vertex:Ud,normal_fragment_begin:Id,normal_fragment_maps:Nd,normal_pars_fragment:Fd,normal_pars_vertex:Od,normal_vertex:Bd,normalmap_pars_fragment:zd,clearcoat_normal_fragment_begin:Gd,clearcoat_normal_fragment_maps:kd,clearcoat_pars_fragment:Hd,iridescence_pars_fragment:Vd,opaque_fragment:Wd,packing:Xd,premultiplied_alpha_fragment:qd,project_vertex:Yd,dithering_fragment:$d,dithering_pars_fragment:jd,roughnessmap_fragment:Kd,roughnessmap_pars_fragment:Zd,shadowmap_pars_fragment:Jd,shadowmap_pars_vertex:Qd,shadowmap_vertex:ef,shadowmask_pars_fragment:tf,skinbase_vertex:nf,skinning_pars_vertex:rf,skinning_vertex:sf,skinnormal_vertex:af,specularmap_fragment:of,specularmap_pars_fragment:lf,tonemapping_fragment:cf,tonemapping_pars_fragment:hf,transmission_fragment:uf,transmission_pars_fragment:df,uv_pars_fragment:ff,uv_pars_vertex:pf,uv_vertex:mf,worldpos_vertex:gf,background_vert:_f,background_frag:vf,backgroundCube_vert:xf,backgroundCube_frag:Mf,cube_vert:yf,cube_frag:Sf,depth_vert:Ef,depth_frag:bf,distanceRGBA_vert:Tf,distanceRGBA_frag:wf,equirect_vert:Af,equirect_frag:Rf,linedashed_vert:Cf,linedashed_frag:Pf,meshbasic_vert:Lf,meshbasic_frag:Df,meshlambert_vert:Uf,meshlambert_frag:If,meshmatcap_vert:Nf,meshmatcap_frag:Ff,meshnormal_vert:Of,meshnormal_frag:Bf,meshphong_vert:zf,meshphong_frag:Gf,meshphysical_vert:kf,meshphysical_frag:Hf,meshtoon_vert:Vf,meshtoon_frag:Wf,points_vert:Xf,points_frag:qf,shadow_vert:Yf,shadow_frag:$f,sprite_vert:jf,sprite_frag:Kf},oe={common:{diffuse:{value:new Ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new Re(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new Ee(16777215)},opacity:{value:1},center:{value:new Re(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},Sn={basic:{uniforms:Ut([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Ut([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Ee(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Ut([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Ee(0)},specular:{value:new Ee(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Ut([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new Ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Ut([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new Ee(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Ut([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Ut([oe.points,oe.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Ut([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Ut([oe.common,oe.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Ut([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Ut([oe.sprite,oe.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:Ut([oe.common,oe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:Ut([oe.lights,oe.fog,{color:{value:new Ee(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};Sn.physical={uniforms:Ut([Sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new Re(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new Ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new Re},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new Ee(0)},specularColor:{value:new Ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new Re},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const Hr={r:0,b:0,g:0};function Zf(n,e,t,i,r,s,a){const o=new Ee(0);let l=s===!0?0:1,c,u,f=null,p=0,m=null;function _(d,h){let x=!1,v=h.isScene===!0?h.background:null;v&&v.isTexture&&(v=(h.backgroundBlurriness>0?t:e).get(v)),v===null?g(o,l):v&&v.isColor&&(g(v,1),x=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||x)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),v&&(v.isCubeTexture||v.mapping===ls)?(u===void 0&&(u=new Ne(new xr(1,1,1),new jn({name:"BackgroundCubeMaterial",uniforms:Wi(Sn.backgroundCube.uniforms),vertexShader:Sn.backgroundCube.vertexShader,fragmentShader:Sn.backgroundCube.fragmentShader,side:Ct,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),u.material.uniforms.envMap.value=v,u.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=h.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=h.backgroundIntensity,u.material.toneMapped=je.getTransfer(v.colorSpace)!==tt,(f!==v||p!==v.version||m!==n.toneMapping)&&(u.material.needsUpdate=!0,f=v,p=v.version,m=n.toneMapping),u.layers.enableAll(),d.unshift(u,u.geometry,u.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Ne(new gr(2,2),new jn({name:"BackgroundMaterial",uniforms:Wi(Sn.background.uniforms),vertexShader:Sn.background.vertexShader,fragmentShader:Sn.background.fragmentShader,side:$n,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=h.backgroundIntensity,c.material.toneMapped=je.getTransfer(v.colorSpace)!==tt,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||p!==v.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,f=v,p=v.version,m=n.toneMapping),c.layers.enableAll(),d.unshift(c,c.geometry,c.material,0,0,null))}function g(d,h){d.getRGB(Hr,nc(n)),i.buffers.color.setClear(Hr.r,Hr.g,Hr.b,h,a)}return{getClearColor:function(){return o},setClearColor:function(d,h=1){o.set(d),l=h,g(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(d){l=d,g(o,l)},render:_}}function Jf(n,e,t,i){const r=n.getParameter(n.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),a=i.isWebGL2||s!==null,o={},l=d(null);let c=l,u=!1;function f(C,F,Y,I,B){let H=!1;if(a){const X=g(I,Y,F);c!==X&&(c=X,m(c.object)),H=h(C,I,Y,B),H&&x(C,I,Y,B)}else{const X=F.wireframe===!0;(c.geometry!==I.id||c.program!==Y.id||c.wireframe!==X)&&(c.geometry=I.id,c.program=Y.id,c.wireframe=X,H=!0)}B!==null&&t.update(B,n.ELEMENT_ARRAY_BUFFER),(H||u)&&(u=!1,k(C,F,Y,I),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function p(){return i.isWebGL2?n.createVertexArray():s.createVertexArrayOES()}function m(C){return i.isWebGL2?n.bindVertexArray(C):s.bindVertexArrayOES(C)}function _(C){return i.isWebGL2?n.deleteVertexArray(C):s.deleteVertexArrayOES(C)}function g(C,F,Y){const I=Y.wireframe===!0;let B=o[C.id];B===void 0&&(B={},o[C.id]=B);let H=B[F.id];H===void 0&&(H={},B[F.id]=H);let X=H[I];return X===void 0&&(X=d(p()),H[I]=X),X}function d(C){const F=[],Y=[],I=[];for(let B=0;B<r;B++)F[B]=0,Y[B]=0,I[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:Y,attributeDivisors:I,object:C,attributes:{},index:null}}function h(C,F,Y,I){const B=c.attributes,H=F.attributes;let X=0;const Z=Y.getAttributes();for(const se in Z)if(Z[se].location>=0){const J=B[se];let ue=H[se];if(ue===void 0&&(se==="instanceMatrix"&&C.instanceMatrix&&(ue=C.instanceMatrix),se==="instanceColor"&&C.instanceColor&&(ue=C.instanceColor)),J===void 0||J.attribute!==ue||ue&&J.data!==ue.data)return!0;X++}return c.attributesNum!==X||c.index!==I}function x(C,F,Y,I){const B={},H=F.attributes;let X=0;const Z=Y.getAttributes();for(const se in Z)if(Z[se].location>=0){let J=H[se];J===void 0&&(se==="instanceMatrix"&&C.instanceMatrix&&(J=C.instanceMatrix),se==="instanceColor"&&C.instanceColor&&(J=C.instanceColor));const ue={};ue.attribute=J,J&&J.data&&(ue.data=J.data),B[se]=ue,X++}c.attributes=B,c.attributesNum=X,c.index=I}function v(){const C=c.newAttributes;for(let F=0,Y=C.length;F<Y;F++)C[F]=0}function S(C){R(C,0)}function R(C,F){const Y=c.newAttributes,I=c.enabledAttributes,B=c.attributeDivisors;Y[C]=1,I[C]===0&&(n.enableVertexAttribArray(C),I[C]=1),B[C]!==F&&((i.isWebGL2?n:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](C,F),B[C]=F)}function w(){const C=c.newAttributes,F=c.enabledAttributes;for(let Y=0,I=F.length;Y<I;Y++)F[Y]!==C[Y]&&(n.disableVertexAttribArray(Y),F[Y]=0)}function A(C,F,Y,I,B,H,X){X===!0?n.vertexAttribIPointer(C,F,Y,B,H):n.vertexAttribPointer(C,F,Y,I,B,H)}function k(C,F,Y,I){if(i.isWebGL2===!1&&(C.isInstancedMesh||I.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;v();const B=I.attributes,H=Y.getAttributes(),X=F.defaultAttributeValues;for(const Z in H){const se=H[Z];if(se.location>=0){let $=B[Z];if($===void 0&&(Z==="instanceMatrix"&&C.instanceMatrix&&($=C.instanceMatrix),Z==="instanceColor"&&C.instanceColor&&($=C.instanceColor)),$!==void 0){const J=$.normalized,ue=$.itemSize,L=t.get($);if(L===void 0)continue;const Q=L.buffer,le=L.type,re=L.bytesPerElement,j=i.isWebGL2===!0&&(le===n.INT||le===n.UNSIGNED_INT||$.gpuType===Ol);if($.isInterleavedBufferAttribute){const fe=$.data,U=fe.stride,qe=$.offset;if(fe.isInstancedInterleavedBuffer){for(let pe=0;pe<se.locationSize;pe++)R(se.location+pe,fe.meshPerAttribute);C.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let pe=0;pe<se.locationSize;pe++)S(se.location+pe);n.bindBuffer(n.ARRAY_BUFFER,Q);for(let pe=0;pe<se.locationSize;pe++)A(se.location+pe,ue/se.locationSize,le,J,U*re,(qe+ue/se.locationSize*pe)*re,j)}else{if($.isInstancedBufferAttribute){for(let fe=0;fe<se.locationSize;fe++)R(se.location+fe,$.meshPerAttribute);C.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let fe=0;fe<se.locationSize;fe++)S(se.location+fe);n.bindBuffer(n.ARRAY_BUFFER,Q);for(let fe=0;fe<se.locationSize;fe++)A(se.location+fe,ue/se.locationSize,le,J,ue*re,ue/se.locationSize*fe*re,j)}}else if(X!==void 0){const J=X[Z];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(se.location,J);break;case 3:n.vertexAttrib3fv(se.location,J);break;case 4:n.vertexAttrib4fv(se.location,J);break;default:n.vertexAttrib1fv(se.location,J)}}}}w()}function y(){W();for(const C in o){const F=o[C];for(const Y in F){const I=F[Y];for(const B in I)_(I[B].object),delete I[B];delete F[Y]}delete o[C]}}function E(C){if(o[C.id]===void 0)return;const F=o[C.id];for(const Y in F){const I=F[Y];for(const B in I)_(I[B].object),delete I[B];delete F[Y]}delete o[C.id]}function O(C){for(const F in o){const Y=o[F];if(Y[C.id]===void 0)continue;const I=Y[C.id];for(const B in I)_(I[B].object),delete I[B];delete Y[C.id]}}function W(){K(),u=!0,c!==l&&(c=l,m(c.object))}function K(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:W,resetDefaultState:K,dispose:y,releaseStatesOfGeometry:E,releaseStatesOfProgram:O,initAttributes:v,enableAttribute:S,disableUnusedAttributes:w}}function Qf(n,e,t,i){const r=i.isWebGL2;let s;function a(u){s=u}function o(u,f){n.drawArrays(s,u,f),t.update(f,s,1)}function l(u,f,p){if(p===0)return;let m,_;if(r)m=n,_="drawArraysInstanced";else if(m=e.get("ANGLE_instanced_arrays"),_="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[_](s,u,f,p),t.update(f,s,p)}function c(u,f,p){if(p===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<p;_++)this.render(u[_],f[_]);else{m.multiDrawArraysWEBGL(s,u,0,f,0,p);let _=0;for(let g=0;g<p;g++)_+=f[g];t.update(_,s,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function ep(n,e,t){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=s(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),u=t.logarithmicDepthBuffer===!0,f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_TEXTURE_SIZE),_=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),d=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),h=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),v=p>0,S=a||e.has("OES_texture_float"),R=v&&S,w=a?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:r,getMaxPrecision:s,precision:o,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:m,maxCubemapSize:_,maxAttributes:g,maxVertexUniforms:d,maxVaryings:h,maxFragmentUniforms:x,vertexTextures:v,floatFragmentTextures:S,floatVertexTextures:R,maxSamples:w}}function tp(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new kn,o=new He,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const m=f.length!==0||p||i!==0||r;return r=p,i=f.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,p){t=u(f,p,0)},this.setState=function(f,p,m){const _=f.clippingPlanes,g=f.clipIntersection,d=f.clipShadows,h=n.get(f);if(!r||_===null||_.length===0||s&&!d)s?u(null):c();else{const x=s?0:i,v=x*4;let S=h.clippingState||null;l.value=S,S=u(_,p,v,m);for(let R=0;R!==v;++R)S[R]=t[R];h.clippingState=S,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,p,m,_){const g=f!==null?f.length:0;let d=null;if(g!==0){if(d=l.value,_!==!0||d===null){const h=m+g*4,x=p.matrixWorldInverse;o.getNormalMatrix(x),(d===null||d.length<h)&&(d=new Float32Array(h));for(let v=0,S=m;v!==g;++v,S+=4)a.copy(f[v]).applyMatrix4(x,o),a.normal.toArray(d,S),d[S+3]=a.constant}l.value=d,l.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,d}}function np(n){let e=new WeakMap;function t(a,o){return o===ha?a.mapping=ki:o===ua&&(a.mapping=Hi),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===ha||o===ua)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new fu(l.height/2);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class ac extends ic{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ni=4,zo=[.125,.215,.35,.446,.526,.582],si=20,ks=new ac,Go=new Ee;let Hs=null,Vs=0,Ws=0;const ii=(1+Math.sqrt(5))/2,Ci=1/ii,ko=[new D(1,1,1),new D(-1,1,1),new D(1,1,-1),new D(-1,1,-1),new D(0,ii,Ci),new D(0,ii,-Ci),new D(Ci,0,ii),new D(-Ci,0,ii),new D(ii,Ci,0),new D(-ii,Ci,0)];class Ho{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Hs=this._renderer.getRenderTarget(),Vs=this._renderer.getActiveCubeFace(),Ws=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Hs,Vs,Ws),e.scissorTest=!1,Vr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ki||e.mapping===Hi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Hs=this._renderer.getRenderTarget(),Vs=this._renderer.getActiveCubeFace(),Ws=this._renderer.getActiveMipmapLevel();const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:$t,minFilter:$t,generateMipmaps:!1,type:pr,format:un,colorSpace:In,depthBuffer:!1},r=Vo(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vo(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ip(s)),this._blurMaterial=rp(s,e,t)}return r}_compileMaterial(e){const t=new Ne(this._lodPlanes[0],e);this._renderer.compile(t,ks)}_sceneToCubeUV(e,t,i,r){const o=new jt(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(Go),u.toneMapping=qn,u.autoClear=!1;const m=new yn({name:"PMREM.Background",side:Ct,depthWrite:!1,depthTest:!1}),_=new Ne(new xr,m);let g=!1;const d=e.background;d?d.isColor&&(m.color.copy(d),e.background=null,g=!0):(m.color.copy(Go),g=!0);for(let h=0;h<6;h++){const x=h%3;x===0?(o.up.set(0,l[h],0),o.lookAt(c[h],0,0)):x===1?(o.up.set(0,0,l[h]),o.lookAt(0,c[h],0)):(o.up.set(0,l[h],0),o.lookAt(0,0,c[h]));const v=this._cubeSize;Vr(r,x*v,h>2?v:0,v,v),u.setRenderTarget(r),g&&u.render(_,o),u.render(e,o)}_.geometry.dispose(),_.material.dispose(),u.toneMapping=p,u.autoClear=f,e.background=d}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===ki||e.mapping===Hi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wo());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Ne(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Vr(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,ks)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=ko[(r-1)%ko.length];this._blur(e,r-1,r,s,a)}t.autoClear=i}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Ne(this._lodPlanes[r],c),p=c.uniforms,m=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*si-1),g=s/_,d=isFinite(s)?1+Math.floor(u*g):si;d>si&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${d} samples when the maximum is set to ${si}`);const h=[];let x=0;for(let A=0;A<si;++A){const k=A/g,y=Math.exp(-k*k/2);h.push(y),A===0?x+=y:A<d&&(x+=2*y)}for(let A=0;A<h.length;A++)h[A]=h[A]/x;p.envMap.value=e.texture,p.samples.value=d,p.weights.value=h,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:v}=this;p.dTheta.value=_,p.mipInt.value=v-i;const S=this._sizeLods[r],R=3*S*(r>v-Ni?r-v+Ni:0),w=4*(this._cubeSize-S);Vr(t,R,w,3*S,2*S),l.setRenderTarget(t),l.render(f,ks)}}function ip(n){const e=[],t=[],i=[];let r=n;const s=n-Ni+1+zo.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>n-Ni?l=zo[a-n+Ni-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,f=1+c,p=[u,u,f,u,f,f,u,u,f,f,u,f],m=6,_=6,g=3,d=2,h=1,x=new Float32Array(g*_*m),v=new Float32Array(d*_*m),S=new Float32Array(h*_*m);for(let w=0;w<m;w++){const A=w%3*2/3-1,k=w>2?0:-1,y=[A,k,0,A+2/3,k,0,A+2/3,k+1,0,A,k,0,A+2/3,k+1,0,A,k+1,0];x.set(y,g*_*w),v.set(p,d*_*w);const E=[w,w,w,w,w,w];S.set(E,h*_*w)}const R=new Et;R.setAttribute("position",new dt(x,g)),R.setAttribute("uv",new dt(v,d)),R.setAttribute("faceIndex",new dt(S,h)),e.push(R),r>Ni&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Vo(n,e,t){const i=new ui(n,e,t);return i.texture.mapping=ls,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Vr(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function rp(n,e,t){const i=new Float32Array(si),r=new D(0,1,0);return new jn({name:"SphericalGaussianBlur",defines:{n:si,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ra(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Wo(){return new jn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ra(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Xo(){return new jn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Ra(){return`

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
	`}function sp(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===ha||l===ua,u=l===ki||l===Hi;if(c||u)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let f=e.get(o);return t===null&&(t=new Ho(n)),f=c?t.fromEquirectangular(o,f):t.fromCubemap(o,f),e.set(o,f),f.texture}else{if(e.has(o))return e.get(o).texture;{const f=o.image;if(c&&f&&f.height>0||u&&f&&r(f)){t===null&&(t=new Ho(n));const p=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,p),o.addEventListener("dispose",s),p.texture}else return null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function ap(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){const r=t(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function op(n,e,t,i){const r={},s=new WeakMap;function a(f){const p=f.target;p.index!==null&&e.remove(p.index);for(const _ in p.attributes)e.remove(p.attributes[_]);for(const _ in p.morphAttributes){const g=p.morphAttributes[_];for(let d=0,h=g.length;d<h;d++)e.remove(g[d])}p.removeEventListener("dispose",a),delete r[p.id];const m=s.get(p);m&&(e.remove(m),s.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(f,p){return r[p.id]===!0||(p.addEventListener("dispose",a),r[p.id]=!0,t.memory.geometries++),p}function l(f){const p=f.attributes;for(const _ in p)e.update(p[_],n.ARRAY_BUFFER);const m=f.morphAttributes;for(const _ in m){const g=m[_];for(let d=0,h=g.length;d<h;d++)e.update(g[d],n.ARRAY_BUFFER)}}function c(f){const p=[],m=f.index,_=f.attributes.position;let g=0;if(m!==null){const x=m.array;g=m.version;for(let v=0,S=x.length;v<S;v+=3){const R=x[v+0],w=x[v+1],A=x[v+2];p.push(R,w,w,A,A,R)}}else if(_!==void 0){const x=_.array;g=_.version;for(let v=0,S=x.length/3-1;v<S;v+=3){const R=v+0,w=v+1,A=v+2;p.push(R,w,w,A,A,R)}}else return;const d=new(Yl(p)?tc:ec)(p,1);d.version=g;const h=s.get(f);h&&e.remove(h),s.set(f,d)}function u(f){const p=s.get(f);if(p){const m=f.index;m!==null&&p.version<m.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function lp(n,e,t,i){const r=i.isWebGL2;let s;function a(m){s=m}let o,l;function c(m){o=m.type,l=m.bytesPerElement}function u(m,_){n.drawElements(s,_,o,m*l),t.update(_,s,1)}function f(m,_,g){if(g===0)return;let d,h;if(r)d=n,h="drawElementsInstanced";else if(d=e.get("ANGLE_instanced_arrays"),h="drawElementsInstancedANGLE",d===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[h](s,_,o,m*l,g),t.update(_,s,g)}function p(m,_,g){if(g===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let h=0;h<g;h++)this.render(m[h]/l,_[h]);else{d.multiDrawElementsWEBGL(s,_,0,o,m,0,g);let h=0;for(let x=0;x<g;x++)h+=_[x];t.update(h,s,1)}}this.setMode=a,this.setIndex=c,this.render=u,this.renderInstances=f,this.renderMultiDraw=p}function cp(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function hp(n,e){return n[0]-e[0]}function up(n,e){return Math.abs(e[1])-Math.abs(n[1])}function dp(n,e,t){const i={},r=new Float32Array(8),s=new WeakMap,a=new xt,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,u,f){const p=c.morphTargetInfluences;if(e.isWebGL2===!0){const _=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,g=_!==void 0?_.length:0;let d=s.get(u);if(d===void 0||d.count!==g){let F=function(){K.dispose(),s.delete(u),u.removeEventListener("dispose",F)};var m=F;d!==void 0&&d.texture.dispose();const v=u.morphAttributes.position!==void 0,S=u.morphAttributes.normal!==void 0,R=u.morphAttributes.color!==void 0,w=u.morphAttributes.position||[],A=u.morphAttributes.normal||[],k=u.morphAttributes.color||[];let y=0;v===!0&&(y=1),S===!0&&(y=2),R===!0&&(y=3);let E=u.attributes.position.count*y,O=1;E>e.maxTextureSize&&(O=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const W=new Float32Array(E*O*4*g),K=new Kl(W,E,O,g);K.type=Vn,K.needsUpdate=!0;const C=y*4;for(let Y=0;Y<g;Y++){const I=w[Y],B=A[Y],H=k[Y],X=E*O*4*Y;for(let Z=0;Z<I.count;Z++){const se=Z*C;v===!0&&(a.fromBufferAttribute(I,Z),W[X+se+0]=a.x,W[X+se+1]=a.y,W[X+se+2]=a.z,W[X+se+3]=0),S===!0&&(a.fromBufferAttribute(B,Z),W[X+se+4]=a.x,W[X+se+5]=a.y,W[X+se+6]=a.z,W[X+se+7]=0),R===!0&&(a.fromBufferAttribute(H,Z),W[X+se+8]=a.x,W[X+se+9]=a.y,W[X+se+10]=a.z,W[X+se+11]=H.itemSize===4?a.w:1)}}d={count:g,texture:K,size:new Re(E,O)},s.set(u,d),u.addEventListener("dispose",F)}let h=0;for(let v=0;v<p.length;v++)h+=p[v];const x=u.morphTargetsRelative?1:1-h;f.getUniforms().setValue(n,"morphTargetBaseInfluence",x),f.getUniforms().setValue(n,"morphTargetInfluences",p),f.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),f.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}else{const _=p===void 0?0:p.length;let g=i[u.id];if(g===void 0||g.length!==_){g=[];for(let S=0;S<_;S++)g[S]=[S,0];i[u.id]=g}for(let S=0;S<_;S++){const R=g[S];R[0]=S,R[1]=p[S]}g.sort(up);for(let S=0;S<8;S++)S<_&&g[S][1]?(o[S][0]=g[S][0],o[S][1]=g[S][1]):(o[S][0]=Number.MAX_SAFE_INTEGER,o[S][1]=0);o.sort(hp);const d=u.morphAttributes.position,h=u.morphAttributes.normal;let x=0;for(let S=0;S<8;S++){const R=o[S],w=R[0],A=R[1];w!==Number.MAX_SAFE_INTEGER&&A?(d&&u.getAttribute("morphTarget"+S)!==d[w]&&u.setAttribute("morphTarget"+S,d[w]),h&&u.getAttribute("morphNormal"+S)!==h[w]&&u.setAttribute("morphNormal"+S,h[w]),r[S]=A,x+=A):(d&&u.hasAttribute("morphTarget"+S)===!0&&u.deleteAttribute("morphTarget"+S),h&&u.hasAttribute("morphNormal"+S)===!0&&u.deleteAttribute("morphNormal"+S),r[S]=0)}const v=u.morphTargetsRelative?1:1-x;f.getUniforms().setValue(n,"morphTargetBaseInfluence",v),f.getUniforms().setValue(n,"morphTargetInfluences",r)}}return{update:l}}function fp(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;r.get(p)!==c&&(p.update(),r.set(p,c))}return f}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class oc extends Bt{constructor(e,t,i,r,s,a,o,l,c,u){if(u=u!==void 0?u:li,u!==li&&u!==Vi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===li&&(i=Hn),i===void 0&&u===Vi&&(i=oi),super(null,r,s,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Nt,this.minFilter=l!==void 0?l:Nt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const lc=new Bt,cc=new oc(1,1);cc.compareFunction=ql;const hc=new Kl,uc=new Kh,dc=new rc,qo=[],Yo=[],$o=new Float32Array(16),jo=new Float32Array(9),Ko=new Float32Array(4);function Ki(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=qo[r];if(s===void 0&&(s=new Float32Array(r),qo[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function ft(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function pt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function us(n,e){let t=Yo[e];t===void 0&&(t=new Int32Array(e),Yo[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function pp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function mp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;n.uniform2fv(this.addr,e),pt(t,e)}}function gp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ft(t,e))return;n.uniform3fv(this.addr,e),pt(t,e)}}function _p(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;n.uniform4fv(this.addr,e),pt(t,e)}}function vp(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(ft(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,i))return;Ko.set(i),n.uniformMatrix2fv(this.addr,!1,Ko),pt(t,i)}}function xp(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(ft(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,i))return;jo.set(i),n.uniformMatrix3fv(this.addr,!1,jo),pt(t,i)}}function Mp(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(ft(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,i))return;$o.set(i),n.uniformMatrix4fv(this.addr,!1,$o),pt(t,i)}}function yp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Sp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;n.uniform2iv(this.addr,e),pt(t,e)}}function Ep(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;n.uniform3iv(this.addr,e),pt(t,e)}}function bp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;n.uniform4iv(this.addr,e),pt(t,e)}}function Tp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function wp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;n.uniform2uiv(this.addr,e),pt(t,e)}}function Ap(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;n.uniform3uiv(this.addr,e),pt(t,e)}}function Rp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;n.uniform4uiv(this.addr,e),pt(t,e)}}function Cp(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);const s=this.type===n.SAMPLER_2D_SHADOW?cc:lc;t.setTexture2D(e||s,r)}function Pp(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||uc,r)}function Lp(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||dc,r)}function Dp(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||hc,r)}function Up(n){switch(n){case 5126:return pp;case 35664:return mp;case 35665:return gp;case 35666:return _p;case 35674:return vp;case 35675:return xp;case 35676:return Mp;case 5124:case 35670:return yp;case 35667:case 35671:return Sp;case 35668:case 35672:return Ep;case 35669:case 35673:return bp;case 5125:return Tp;case 36294:return wp;case 36295:return Ap;case 36296:return Rp;case 35678:case 36198:case 36298:case 36306:case 35682:return Cp;case 35679:case 36299:case 36307:return Pp;case 35680:case 36300:case 36308:case 36293:return Lp;case 36289:case 36303:case 36311:case 36292:return Dp}}function Ip(n,e){n.uniform1fv(this.addr,e)}function Np(n,e){const t=Ki(e,this.size,2);n.uniform2fv(this.addr,t)}function Fp(n,e){const t=Ki(e,this.size,3);n.uniform3fv(this.addr,t)}function Op(n,e){const t=Ki(e,this.size,4);n.uniform4fv(this.addr,t)}function Bp(n,e){const t=Ki(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function zp(n,e){const t=Ki(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Gp(n,e){const t=Ki(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function kp(n,e){n.uniform1iv(this.addr,e)}function Hp(n,e){n.uniform2iv(this.addr,e)}function Vp(n,e){n.uniform3iv(this.addr,e)}function Wp(n,e){n.uniform4iv(this.addr,e)}function Xp(n,e){n.uniform1uiv(this.addr,e)}function qp(n,e){n.uniform2uiv(this.addr,e)}function Yp(n,e){n.uniform3uiv(this.addr,e)}function $p(n,e){n.uniform4uiv(this.addr,e)}function jp(n,e,t){const i=this.cache,r=e.length,s=us(t,r);ft(i,s)||(n.uniform1iv(this.addr,s),pt(i,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||lc,s[a])}function Kp(n,e,t){const i=this.cache,r=e.length,s=us(t,r);ft(i,s)||(n.uniform1iv(this.addr,s),pt(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||uc,s[a])}function Zp(n,e,t){const i=this.cache,r=e.length,s=us(t,r);ft(i,s)||(n.uniform1iv(this.addr,s),pt(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||dc,s[a])}function Jp(n,e,t){const i=this.cache,r=e.length,s=us(t,r);ft(i,s)||(n.uniform1iv(this.addr,s),pt(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||hc,s[a])}function Qp(n){switch(n){case 5126:return Ip;case 35664:return Np;case 35665:return Fp;case 35666:return Op;case 35674:return Bp;case 35675:return zp;case 35676:return Gp;case 5124:case 35670:return kp;case 35667:case 35671:return Hp;case 35668:case 35672:return Vp;case 35669:case 35673:return Wp;case 5125:return Xp;case 36294:return qp;case 36295:return Yp;case 36296:return $p;case 35678:case 36198:case 36298:case 36306:case 35682:return jp;case 35679:case 36299:case 36307:return Kp;case 35680:case 36300:case 36308:case 36293:return Zp;case 36289:case 36303:case 36311:case 36292:return Jp}}class em{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Up(t.type)}}class tm{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Qp(t.type)}}class nm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const Xs=/(\w+)(\])?(\[|\.)?/g;function Zo(n,e){n.seq.push(e),n.map[e.id]=e}function im(n,e,t){const i=n.name,r=i.length;for(Xs.lastIndex=0;;){const s=Xs.exec(i),a=Xs.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Zo(t,c===void 0?new em(o,n,e):new tm(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new nm(o),Zo(t,f)),t=f}}}class Qr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);im(s,a,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function Jo(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const rm=37297;let sm=0;function am(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}function om(n){const e=je.getPrimaries(je.workingColorSpace),t=je.getPrimaries(n);let i;switch(e===t?i="":e===is&&t===ns?i="LinearDisplayP3ToLinearSRGB":e===ns&&t===is&&(i="LinearSRGBToLinearDisplayP3"),n){case In:case cs:return[i,"LinearTransferOETF"];case ut:case Ta:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Qo(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+am(n.getShaderSource(e),a)}else return r}function lm(n,e){const t=om(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function cm(n,e){let t;switch(e){case ah:t="Linear";break;case oh:t="Reinhard";break;case lh:t="OptimizedCineon";break;case ch:t="ACESFilmic";break;case uh:t="AgX";break;case hh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function hm(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Fi).join(`
`)}function um(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Fi).join(`
`)}function dm(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function fm(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Fi(n){return n!==""}function el(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function tl(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const pm=/^[ \t]*#include +<([\w\d./]+)>/gm;function _a(n){return n.replace(pm,gm)}const mm=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function gm(n,e){let t=Oe[e];if(t===void 0){const i=mm.get(e);if(i!==void 0)t=Oe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return _a(t)}const _m=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nl(n){return n.replace(_m,vm)}function vm(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function il(n){let e="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function xm(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Il?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Ic?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ln&&(e="SHADOWMAP_TYPE_VSM"),e}function Mm(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ki:case Hi:e="ENVMAP_TYPE_CUBE";break;case ls:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ym(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Hi:e="ENVMAP_MODE_REFRACTION";break}return e}function Sm(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Nl:e="ENVMAP_BLENDING_MULTIPLY";break;case rh:e="ENVMAP_BLENDING_MIX";break;case sh:e="ENVMAP_BLENDING_ADD";break}return e}function Em(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function bm(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=xm(t),c=Mm(t),u=ym(t),f=Sm(t),p=Em(t),m=t.isWebGL2?"":hm(t),_=um(t),g=dm(s),d=r.createProgram();let h,x,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Fi).join(`
`),h.length>0&&(h+=`
`),x=[m,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Fi).join(`
`),x.length>0&&(x+=`
`)):(h=[il(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fi).join(`
`),x=[m,il(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qn?"#define TONE_MAPPING":"",t.toneMapping!==qn?Oe.tonemapping_pars_fragment:"",t.toneMapping!==qn?cm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,lm("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Fi).join(`
`)),a=_a(a),a=el(a,t),a=tl(a,t),o=_a(o),o=el(o,t),o=tl(o,t),a=nl(a),o=nl(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,h=[_,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+h,x=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===yo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===yo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const S=v+h+a,R=v+x+o,w=Jo(r,r.VERTEX_SHADER,S),A=Jo(r,r.FRAGMENT_SHADER,R);r.attachShader(d,w),r.attachShader(d,A),t.index0AttributeName!==void 0?r.bindAttribLocation(d,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(d,0,"position"),r.linkProgram(d);function k(W){if(n.debug.checkShaderErrors){const K=r.getProgramInfoLog(d).trim(),C=r.getShaderInfoLog(w).trim(),F=r.getShaderInfoLog(A).trim();let Y=!0,I=!0;if(r.getProgramParameter(d,r.LINK_STATUS)===!1)if(Y=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,d,w,A);else{const B=Qo(r,w,"vertex"),H=Qo(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(d,r.VALIDATE_STATUS)+`

Program Info Log: `+K+`
`+B+`
`+H)}else K!==""?console.warn("THREE.WebGLProgram: Program Info Log:",K):(C===""||F==="")&&(I=!1);I&&(W.diagnostics={runnable:Y,programLog:K,vertexShader:{log:C,prefix:h},fragmentShader:{log:F,prefix:x}})}r.deleteShader(w),r.deleteShader(A),y=new Qr(r,d),E=fm(r,d)}let y;this.getUniforms=function(){return y===void 0&&k(this),y};let E;this.getAttributes=function(){return E===void 0&&k(this),E};let O=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return O===!1&&(O=r.getProgramParameter(d,rm)),O},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(d),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=sm++,this.cacheKey=e,this.usedTimes=1,this.program=d,this.vertexShader=w,this.fragmentShader=A,this}let Tm=0;class wm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Am(e),t.set(e,i)),i}}class Am{constructor(e){this.id=Tm++,this.code=e,this.usedTimes=0}}function Rm(n,e,t,i,r,s,a){const o=new Jl,l=new wm,c=[],u=r.isWebGL2,f=r.logarithmicDepthBuffer,p=r.vertexTextures;let m=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return y===0?"uv":`uv${y}`}function d(y,E,O,W,K){const C=W.fog,F=K.geometry,Y=y.isMeshStandardMaterial?W.environment:null,I=(y.isMeshStandardMaterial?t:e).get(y.envMap||Y),B=I&&I.mapping===ls?I.image.height:null,H=_[y.type];y.precision!==null&&(m=r.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));const X=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Z=X!==void 0?X.length:0;let se=0;F.morphAttributes.position!==void 0&&(se=1),F.morphAttributes.normal!==void 0&&(se=2),F.morphAttributes.color!==void 0&&(se=3);let $,J,ue,L;if(H){const Pt=Sn[H];$=Pt.vertexShader,J=Pt.fragmentShader}else $=y.vertexShader,J=y.fragmentShader,l.update(y),ue=l.getVertexShaderID(y),L=l.getFragmentShaderID(y);const Q=n.getRenderTarget(),le=K.isInstancedMesh===!0,re=K.isBatchedMesh===!0,j=!!y.map,fe=!!y.matcap,U=!!I,qe=!!y.aoMap,pe=!!y.lightMap,xe=!!y.bumpMap,ge=!!y.normalMap,Ke=!!y.displacementMap,be=!!y.emissiveMap,T=!!y.metalnessMap,M=!!y.roughnessMap,G=y.anisotropy>0,ne=y.clearcoat>0,te=y.iridescence>0,ie=y.sheen>0,Me=y.transmission>0,de=G&&!!y.anisotropyMap,_e=ne&&!!y.clearcoatMap,Ae=ne&&!!y.clearcoatNormalMap,Be=ne&&!!y.clearcoatRoughnessMap,ee=te&&!!y.iridescenceMap,$e=te&&!!y.iridescenceThicknessMap,Ve=ie&&!!y.sheenColorMap,De=ie&&!!y.sheenRoughnessMap,Se=!!y.specularMap,ve=!!y.specularColorMap,Fe=!!y.specularIntensityMap,Ye=Me&&!!y.transmissionMap,st=Me&&!!y.thicknessMap,Ge=!!y.gradientMap,ae=!!y.alphaMap,P=y.alphaTest>0,ce=!!y.alphaHash,he=!!y.extensions,Ce=!!F.attributes.uv1,Te=!!F.attributes.uv2,Ze=!!F.attributes.uv3;let Je=qn;return y.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Je=n.toneMapping),{isWebGL2:u,shaderID:H,shaderType:y.type,shaderName:y.name,vertexShader:$,fragmentShader:J,defines:y.defines,customVertexShaderID:ue,customFragmentShaderID:L,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,batching:re,instancing:le,instancingColor:le&&K.instanceColor!==null,supportsVertexTextures:p,outputColorSpace:Q===null?n.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:In,map:j,matcap:fe,envMap:U,envMapMode:U&&I.mapping,envMapCubeUVHeight:B,aoMap:qe,lightMap:pe,bumpMap:xe,normalMap:ge,displacementMap:p&&Ke,emissiveMap:be,normalMapObjectSpace:ge&&y.normalMapType===Eh,normalMapTangentSpace:ge&&y.normalMapType===Xl,metalnessMap:T,roughnessMap:M,anisotropy:G,anisotropyMap:de,clearcoat:ne,clearcoatMap:_e,clearcoatNormalMap:Ae,clearcoatRoughnessMap:Be,iridescence:te,iridescenceMap:ee,iridescenceThicknessMap:$e,sheen:ie,sheenColorMap:Ve,sheenRoughnessMap:De,specularMap:Se,specularColorMap:ve,specularIntensityMap:Fe,transmission:Me,transmissionMap:Ye,thicknessMap:st,gradientMap:Ge,opaque:y.transparent===!1&&y.blending===zi,alphaMap:ae,alphaTest:P,alphaHash:ce,combine:y.combine,mapUv:j&&g(y.map.channel),aoMapUv:qe&&g(y.aoMap.channel),lightMapUv:pe&&g(y.lightMap.channel),bumpMapUv:xe&&g(y.bumpMap.channel),normalMapUv:ge&&g(y.normalMap.channel),displacementMapUv:Ke&&g(y.displacementMap.channel),emissiveMapUv:be&&g(y.emissiveMap.channel),metalnessMapUv:T&&g(y.metalnessMap.channel),roughnessMapUv:M&&g(y.roughnessMap.channel),anisotropyMapUv:de&&g(y.anisotropyMap.channel),clearcoatMapUv:_e&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:Ae&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Be&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:ee&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:$e&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:De&&g(y.sheenRoughnessMap.channel),specularMapUv:Se&&g(y.specularMap.channel),specularColorMapUv:ve&&g(y.specularColorMap.channel),specularIntensityMapUv:Fe&&g(y.specularIntensityMap.channel),transmissionMapUv:Ye&&g(y.transmissionMap.channel),thicknessMapUv:st&&g(y.thicknessMap.channel),alphaMapUv:ae&&g(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(ge||G),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Ce,vertexUv2s:Te,vertexUv3s:Ze,pointsUvs:K.isPoints===!0&&!!F.attributes.uv&&(j||ae),fog:!!C,useFog:y.fog===!0,fogExp2:C&&C.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:K.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:se,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&O.length>0,shadowMapType:n.shadowMap.type,toneMapping:Je,useLegacyLights:n._useLegacyLights,decodeVideoTexture:j&&y.map.isVideoTexture===!0&&je.getTransfer(y.map.colorSpace)===tt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Zt,flipSided:y.side===Ct,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:he&&y.extensions.derivatives===!0,extensionFragDepth:he&&y.extensions.fragDepth===!0,extensionDrawBuffers:he&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:he&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:he&&y.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function h(y){const E=[];if(y.shaderID?E.push(y.shaderID):(E.push(y.customVertexShaderID),E.push(y.customFragmentShaderID)),y.defines!==void 0)for(const O in y.defines)E.push(O),E.push(y.defines[O]);return y.isRawShaderMaterial===!1&&(x(E,y),v(E,y),E.push(n.outputColorSpace)),E.push(y.customProgramCacheKey),E.join()}function x(y,E){y.push(E.precision),y.push(E.outputColorSpace),y.push(E.envMapMode),y.push(E.envMapCubeUVHeight),y.push(E.mapUv),y.push(E.alphaMapUv),y.push(E.lightMapUv),y.push(E.aoMapUv),y.push(E.bumpMapUv),y.push(E.normalMapUv),y.push(E.displacementMapUv),y.push(E.emissiveMapUv),y.push(E.metalnessMapUv),y.push(E.roughnessMapUv),y.push(E.anisotropyMapUv),y.push(E.clearcoatMapUv),y.push(E.clearcoatNormalMapUv),y.push(E.clearcoatRoughnessMapUv),y.push(E.iridescenceMapUv),y.push(E.iridescenceThicknessMapUv),y.push(E.sheenColorMapUv),y.push(E.sheenRoughnessMapUv),y.push(E.specularMapUv),y.push(E.specularColorMapUv),y.push(E.specularIntensityMapUv),y.push(E.transmissionMapUv),y.push(E.thicknessMapUv),y.push(E.combine),y.push(E.fogExp2),y.push(E.sizeAttenuation),y.push(E.morphTargetsCount),y.push(E.morphAttributeCount),y.push(E.numDirLights),y.push(E.numPointLights),y.push(E.numSpotLights),y.push(E.numSpotLightMaps),y.push(E.numHemiLights),y.push(E.numRectAreaLights),y.push(E.numDirLightShadows),y.push(E.numPointLightShadows),y.push(E.numSpotLightShadows),y.push(E.numSpotLightShadowsWithMaps),y.push(E.numLightProbes),y.push(E.shadowMapType),y.push(E.toneMapping),y.push(E.numClippingPlanes),y.push(E.numClipIntersection),y.push(E.depthPacking)}function v(y,E){o.disableAll(),E.isWebGL2&&o.enable(0),E.supportsVertexTextures&&o.enable(1),E.instancing&&o.enable(2),E.instancingColor&&o.enable(3),E.matcap&&o.enable(4),E.envMap&&o.enable(5),E.normalMapObjectSpace&&o.enable(6),E.normalMapTangentSpace&&o.enable(7),E.clearcoat&&o.enable(8),E.iridescence&&o.enable(9),E.alphaTest&&o.enable(10),E.vertexColors&&o.enable(11),E.vertexAlphas&&o.enable(12),E.vertexUv1s&&o.enable(13),E.vertexUv2s&&o.enable(14),E.vertexUv3s&&o.enable(15),E.vertexTangents&&o.enable(16),E.anisotropy&&o.enable(17),E.alphaHash&&o.enable(18),E.batching&&o.enable(19),y.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.skinning&&o.enable(4),E.morphTargets&&o.enable(5),E.morphNormals&&o.enable(6),E.morphColors&&o.enable(7),E.premultipliedAlpha&&o.enable(8),E.shadowMapEnabled&&o.enable(9),E.useLegacyLights&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),y.push(o.mask)}function S(y){const E=_[y.type];let O;if(E){const W=Sn[E];O=cu.clone(W.uniforms)}else O=y.uniforms;return O}function R(y,E){let O;for(let W=0,K=c.length;W<K;W++){const C=c[W];if(C.cacheKey===E){O=C,++O.usedTimes;break}}return O===void 0&&(O=new bm(n,E,y,s),c.push(O)),O}function w(y){if(--y.usedTimes===0){const E=c.indexOf(y);c[E]=c[c.length-1],c.pop(),y.destroy()}}function A(y){l.remove(y)}function k(){l.dispose()}return{getParameters:d,getProgramCacheKey:h,getUniforms:S,acquireProgram:R,releaseProgram:w,releaseShaderCache:A,programs:c,dispose:k}}function Cm(){let n=new WeakMap;function e(s){let a=n.get(s);return a===void 0&&(a={},n.set(s,a)),a}function t(s){n.delete(s)}function i(s,a,o){n.get(s)[a]=o}function r(){n=new WeakMap}return{get:e,remove:t,update:i,dispose:r}}function Pm(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function rl(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function sl(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(f,p,m,_,g,d){let h=n[e];return h===void 0?(h={id:f.id,object:f,geometry:p,material:m,groupOrder:_,renderOrder:f.renderOrder,z:g,group:d},n[e]=h):(h.id=f.id,h.object=f,h.geometry=p,h.material=m,h.groupOrder=_,h.renderOrder=f.renderOrder,h.z=g,h.group=d),e++,h}function o(f,p,m,_,g,d){const h=a(f,p,m,_,g,d);m.transmission>0?i.push(h):m.transparent===!0?r.push(h):t.push(h)}function l(f,p,m,_,g,d){const h=a(f,p,m,_,g,d);m.transmission>0?i.unshift(h):m.transparent===!0?r.unshift(h):t.unshift(h)}function c(f,p){t.length>1&&t.sort(f||Pm),i.length>1&&i.sort(p||rl),r.length>1&&r.sort(p||rl)}function u(){for(let f=e,p=n.length;f<p;f++){const m=n[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:u,sort:c}}function Lm(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new sl,n.set(i,[a])):r>=s.length?(a=new sl,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Dm(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Ee};break;case"SpotLight":t={position:new D,direction:new D,color:new Ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Ee,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Ee,groundColor:new Ee};break;case"RectAreaLight":t={color:new Ee,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function Um(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Re,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Im=0;function Nm(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Fm(n,e){const t=new Dm,i=Um(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)r.probe.push(new D);const s=new D,a=new et,o=new et;function l(u,f){let p=0,m=0,_=0;for(let W=0;W<9;W++)r.probe[W].set(0,0,0);let g=0,d=0,h=0,x=0,v=0,S=0,R=0,w=0,A=0,k=0,y=0;u.sort(Nm);const E=f===!0?Math.PI:1;for(let W=0,K=u.length;W<K;W++){const C=u[W],F=C.color,Y=C.intensity,I=C.distance,B=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)p+=F.r*Y*E,m+=F.g*Y*E,_+=F.b*Y*E;else if(C.isLightProbe){for(let H=0;H<9;H++)r.probe[H].addScaledVector(C.sh.coefficients[H],Y);y++}else if(C.isDirectionalLight){const H=t.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity*E),C.castShadow){const X=C.shadow,Z=i.get(C);Z.shadowBias=X.bias,Z.shadowNormalBias=X.normalBias,Z.shadowRadius=X.radius,Z.shadowMapSize=X.mapSize,r.directionalShadow[g]=Z,r.directionalShadowMap[g]=B,r.directionalShadowMatrix[g]=C.shadow.matrix,S++}r.directional[g]=H,g++}else if(C.isSpotLight){const H=t.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(F).multiplyScalar(Y*E),H.distance=I,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,r.spot[h]=H;const X=C.shadow;if(C.map&&(r.spotLightMap[A]=C.map,A++,X.updateMatrices(C),C.castShadow&&k++),r.spotLightMatrix[h]=X.matrix,C.castShadow){const Z=i.get(C);Z.shadowBias=X.bias,Z.shadowNormalBias=X.normalBias,Z.shadowRadius=X.radius,Z.shadowMapSize=X.mapSize,r.spotShadow[h]=Z,r.spotShadowMap[h]=B,w++}h++}else if(C.isRectAreaLight){const H=t.get(C);H.color.copy(F).multiplyScalar(Y),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),r.rectArea[x]=H,x++}else if(C.isPointLight){const H=t.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity*E),H.distance=C.distance,H.decay=C.decay,C.castShadow){const X=C.shadow,Z=i.get(C);Z.shadowBias=X.bias,Z.shadowNormalBias=X.normalBias,Z.shadowRadius=X.radius,Z.shadowMapSize=X.mapSize,Z.shadowCameraNear=X.camera.near,Z.shadowCameraFar=X.camera.far,r.pointShadow[d]=Z,r.pointShadowMap[d]=B,r.pointShadowMatrix[d]=C.shadow.matrix,R++}r.point[d]=H,d++}else if(C.isHemisphereLight){const H=t.get(C);H.skyColor.copy(C.color).multiplyScalar(Y*E),H.groundColor.copy(C.groundColor).multiplyScalar(Y*E),r.hemi[v]=H,v++}}x>0&&(e.isWebGL2?n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=oe.LTC_FLOAT_1,r.rectAreaLTC2=oe.LTC_FLOAT_2):(r.rectAreaLTC1=oe.LTC_HALF_1,r.rectAreaLTC2=oe.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=oe.LTC_FLOAT_1,r.rectAreaLTC2=oe.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=oe.LTC_HALF_1,r.rectAreaLTC2=oe.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=p,r.ambient[1]=m,r.ambient[2]=_;const O=r.hash;(O.directionalLength!==g||O.pointLength!==d||O.spotLength!==h||O.rectAreaLength!==x||O.hemiLength!==v||O.numDirectionalShadows!==S||O.numPointShadows!==R||O.numSpotShadows!==w||O.numSpotMaps!==A||O.numLightProbes!==y)&&(r.directional.length=g,r.spot.length=h,r.rectArea.length=x,r.point.length=d,r.hemi.length=v,r.directionalShadow.length=S,r.directionalShadowMap.length=S,r.pointShadow.length=R,r.pointShadowMap.length=R,r.spotShadow.length=w,r.spotShadowMap.length=w,r.directionalShadowMatrix.length=S,r.pointShadowMatrix.length=R,r.spotLightMatrix.length=w+A-k,r.spotLightMap.length=A,r.numSpotLightShadowsWithMaps=k,r.numLightProbes=y,O.directionalLength=g,O.pointLength=d,O.spotLength=h,O.rectAreaLength=x,O.hemiLength=v,O.numDirectionalShadows=S,O.numPointShadows=R,O.numSpotShadows=w,O.numSpotMaps=A,O.numLightProbes=y,r.version=Im++)}function c(u,f){let p=0,m=0,_=0,g=0,d=0;const h=f.matrixWorldInverse;for(let x=0,v=u.length;x<v;x++){const S=u[x];if(S.isDirectionalLight){const R=r.directional[p];R.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(h),p++}else if(S.isSpotLight){const R=r.spot[_];R.position.setFromMatrixPosition(S.matrixWorld),R.position.applyMatrix4(h),R.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(h),_++}else if(S.isRectAreaLight){const R=r.rectArea[g];R.position.setFromMatrixPosition(S.matrixWorld),R.position.applyMatrix4(h),o.identity(),a.copy(S.matrixWorld),a.premultiply(h),o.extractRotation(a),R.halfWidth.set(S.width*.5,0,0),R.halfHeight.set(0,S.height*.5,0),R.halfWidth.applyMatrix4(o),R.halfHeight.applyMatrix4(o),g++}else if(S.isPointLight){const R=r.point[m];R.position.setFromMatrixPosition(S.matrixWorld),R.position.applyMatrix4(h),m++}else if(S.isHemisphereLight){const R=r.hemi[d];R.direction.setFromMatrixPosition(S.matrixWorld),R.direction.transformDirection(h),d++}}}return{setup:l,setupView:c,state:r}}function al(n,e){const t=new Fm(n,e),i=[],r=[];function s(){i.length=0,r.length=0}function a(f){i.push(f)}function o(f){r.push(f)}function l(f){t.setup(i,f)}function c(f){t.setupView(i,f)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Om(n,e){let t=new WeakMap;function i(s,a=0){const o=t.get(s);let l;return o===void 0?(l=new al(n,e),t.set(s,[l])):a>=o.length?(l=new al(n,e),o.push(l)):l=o[a],l}function r(){t=new WeakMap}return{get:i,dispose:r}}class Bm extends ji{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class zm extends ji{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Gm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,km=`uniform sampler2D shadow_pass;
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
}`;function Hm(n,e,t){let i=new Aa;const r=new Re,s=new Re,a=new xt,o=new Bm({depthPacking:Sh}),l=new zm,c={},u=t.maxTextureSize,f={[$n]:Ct,[Ct]:$n,[Zt]:Zt},p=new jn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Re},radius:{value:4}},vertexShader:Gm,fragmentShader:km}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const _=new Et;_.setAttribute("position",new dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Ne(_,p),d=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Il;let h=this.type;this.render=function(w,A,k){if(d.enabled===!1||d.autoUpdate===!1&&d.needsUpdate===!1||w.length===0)return;const y=n.getRenderTarget(),E=n.getActiveCubeFace(),O=n.getActiveMipmapLevel(),W=n.state;W.setBlending(Xn),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const K=h!==Ln&&this.type===Ln,C=h===Ln&&this.type!==Ln;for(let F=0,Y=w.length;F<Y;F++){const I=w[F],B=I.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",I,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;r.copy(B.mapSize);const H=B.getFrameExtents();if(r.multiply(H),s.copy(B.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/H.x),r.x=s.x*H.x,B.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/H.y),r.y=s.y*H.y,B.mapSize.y=s.y)),B.map===null||K===!0||C===!0){const Z=this.type!==Ln?{minFilter:Nt,magFilter:Nt}:{};B.map!==null&&B.map.dispose(),B.map=new ui(r.x,r.y,Z),B.map.texture.name=I.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const X=B.getViewportCount();for(let Z=0;Z<X;Z++){const se=B.getViewport(Z);a.set(s.x*se.x,s.y*se.y,s.x*se.z,s.y*se.w),W.viewport(a),B.updateMatrices(I,Z),i=B.getFrustum(),S(A,k,B.camera,I,this.type)}B.isPointLightShadow!==!0&&this.type===Ln&&x(B,k),B.needsUpdate=!1}h=this.type,d.needsUpdate=!1,n.setRenderTarget(y,E,O)};function x(w,A){const k=e.update(g);p.defines.VSM_SAMPLES!==w.blurSamples&&(p.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ui(r.x,r.y)),p.uniforms.shadow_pass.value=w.map.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(A,null,k,p,g,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(A,null,k,m,g,null)}function v(w,A,k,y){let E=null;const O=k.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(O!==void 0)E=O;else if(E=k.isPointLight===!0?l:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const W=E.uuid,K=A.uuid;let C=c[W];C===void 0&&(C={},c[W]=C);let F=C[K];F===void 0&&(F=E.clone(),C[K]=F,A.addEventListener("dispose",R)),E=F}if(E.visible=A.visible,E.wireframe=A.wireframe,y===Ln?E.side=A.shadowSide!==null?A.shadowSide:A.side:E.side=A.shadowSide!==null?A.shadowSide:f[A.side],E.alphaMap=A.alphaMap,E.alphaTest=A.alphaTest,E.map=A.map,E.clipShadows=A.clipShadows,E.clippingPlanes=A.clippingPlanes,E.clipIntersection=A.clipIntersection,E.displacementMap=A.displacementMap,E.displacementScale=A.displacementScale,E.displacementBias=A.displacementBias,E.wireframeLinewidth=A.wireframeLinewidth,E.linewidth=A.linewidth,k.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const W=n.properties.get(E);W.light=k}return E}function S(w,A,k,y,E){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&E===Ln)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,w.matrixWorld);const K=e.update(w),C=w.material;if(Array.isArray(C)){const F=K.groups;for(let Y=0,I=F.length;Y<I;Y++){const B=F[Y],H=C[B.materialIndex];if(H&&H.visible){const X=v(w,H,y,E);w.onBeforeShadow(n,w,A,k,K,X,B),n.renderBufferDirect(k,null,K,X,w,B),w.onAfterShadow(n,w,A,k,K,X,B)}}}else if(C.visible){const F=v(w,C,y,E);w.onBeforeShadow(n,w,A,k,K,F,null),n.renderBufferDirect(k,null,K,F,w,null),w.onAfterShadow(n,w,A,k,K,F,null)}}const W=w.children;for(let K=0,C=W.length;K<C;K++)S(W[K],A,k,y,E)}function R(w){w.target.removeEventListener("dispose",R);for(const k in c){const y=c[k],E=w.target.uuid;E in y&&(y[E].dispose(),delete y[E])}}}function Vm(n,e,t){const i=t.isWebGL2;function r(){let P=!1;const ce=new xt;let he=null;const Ce=new xt(0,0,0,0);return{setMask:function(Te){he!==Te&&!P&&(n.colorMask(Te,Te,Te,Te),he=Te)},setLocked:function(Te){P=Te},setClear:function(Te,Ze,Je,mt,Pt){Pt===!0&&(Te*=mt,Ze*=mt,Je*=mt),ce.set(Te,Ze,Je,mt),Ce.equals(ce)===!1&&(n.clearColor(Te,Ze,Je,mt),Ce.copy(ce))},reset:function(){P=!1,he=null,Ce.set(-1,0,0,0)}}}function s(){let P=!1,ce=null,he=null,Ce=null;return{setTest:function(Te){Te?re(n.DEPTH_TEST):j(n.DEPTH_TEST)},setMask:function(Te){ce!==Te&&!P&&(n.depthMask(Te),ce=Te)},setFunc:function(Te){if(he!==Te){switch(Te){case Zc:n.depthFunc(n.NEVER);break;case Jc:n.depthFunc(n.ALWAYS);break;case Qc:n.depthFunc(n.LESS);break;case es:n.depthFunc(n.LEQUAL);break;case eh:n.depthFunc(n.EQUAL);break;case th:n.depthFunc(n.GEQUAL);break;case nh:n.depthFunc(n.GREATER);break;case ih:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}he=Te}},setLocked:function(Te){P=Te},setClear:function(Te){Ce!==Te&&(n.clearDepth(Te),Ce=Te)},reset:function(){P=!1,ce=null,he=null,Ce=null}}}function a(){let P=!1,ce=null,he=null,Ce=null,Te=null,Ze=null,Je=null,mt=null,Pt=null;return{setTest:function(Qe){P||(Qe?re(n.STENCIL_TEST):j(n.STENCIL_TEST))},setMask:function(Qe){ce!==Qe&&!P&&(n.stencilMask(Qe),ce=Qe)},setFunc:function(Qe,Lt,_n){(he!==Qe||Ce!==Lt||Te!==_n)&&(n.stencilFunc(Qe,Lt,_n),he=Qe,Ce=Lt,Te=_n)},setOp:function(Qe,Lt,_n){(Ze!==Qe||Je!==Lt||mt!==_n)&&(n.stencilOp(Qe,Lt,_n),Ze=Qe,Je=Lt,mt=_n)},setLocked:function(Qe){P=Qe},setClear:function(Qe){Pt!==Qe&&(n.clearStencil(Qe),Pt=Qe)},reset:function(){P=!1,ce=null,he=null,Ce=null,Te=null,Ze=null,Je=null,mt=null,Pt=null}}}const o=new r,l=new s,c=new a,u=new WeakMap,f=new WeakMap;let p={},m={},_=new WeakMap,g=[],d=null,h=!1,x=null,v=null,S=null,R=null,w=null,A=null,k=null,y=new Ee(0,0,0),E=0,O=!1,W=null,K=null,C=null,F=null,Y=null;const I=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,H=0;const X=n.getParameter(n.VERSION);X.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(X)[1]),B=H>=1):X.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),B=H>=2);let Z=null,se={};const $=n.getParameter(n.SCISSOR_BOX),J=n.getParameter(n.VIEWPORT),ue=new xt().fromArray($),L=new xt().fromArray(J);function Q(P,ce,he,Ce){const Te=new Uint8Array(4),Ze=n.createTexture();n.bindTexture(P,Ze),n.texParameteri(P,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(P,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Je=0;Je<he;Je++)i&&(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)?n.texImage3D(ce,0,n.RGBA,1,1,Ce,0,n.RGBA,n.UNSIGNED_BYTE,Te):n.texImage2D(ce+Je,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Te);return Ze}const le={};le[n.TEXTURE_2D]=Q(n.TEXTURE_2D,n.TEXTURE_2D,1),le[n.TEXTURE_CUBE_MAP]=Q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(le[n.TEXTURE_2D_ARRAY]=Q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),le[n.TEXTURE_3D]=Q(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),re(n.DEPTH_TEST),l.setFunc(es),be(!1),T(Ga),re(n.CULL_FACE),ge(Xn);function re(P){p[P]!==!0&&(n.enable(P),p[P]=!0)}function j(P){p[P]!==!1&&(n.disable(P),p[P]=!1)}function fe(P,ce){return m[P]!==ce?(n.bindFramebuffer(P,ce),m[P]=ce,i&&(P===n.DRAW_FRAMEBUFFER&&(m[n.FRAMEBUFFER]=ce),P===n.FRAMEBUFFER&&(m[n.DRAW_FRAMEBUFFER]=ce)),!0):!1}function U(P,ce){let he=g,Ce=!1;if(P)if(he=_.get(ce),he===void 0&&(he=[],_.set(ce,he)),P.isWebGLMultipleRenderTargets){const Te=P.texture;if(he.length!==Te.length||he[0]!==n.COLOR_ATTACHMENT0){for(let Ze=0,Je=Te.length;Ze<Je;Ze++)he[Ze]=n.COLOR_ATTACHMENT0+Ze;he.length=Te.length,Ce=!0}}else he[0]!==n.COLOR_ATTACHMENT0&&(he[0]=n.COLOR_ATTACHMENT0,Ce=!0);else he[0]!==n.BACK&&(he[0]=n.BACK,Ce=!0);Ce&&(t.isWebGL2?n.drawBuffers(he):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(he))}function qe(P){return d!==P?(n.useProgram(P),d=P,!0):!1}const pe={[ri]:n.FUNC_ADD,[Fc]:n.FUNC_SUBTRACT,[Oc]:n.FUNC_REVERSE_SUBTRACT};if(i)pe[Wa]=n.MIN,pe[Xa]=n.MAX;else{const P=e.get("EXT_blend_minmax");P!==null&&(pe[Wa]=P.MIN_EXT,pe[Xa]=P.MAX_EXT)}const xe={[Bc]:n.ZERO,[zc]:n.ONE,[Gc]:n.SRC_COLOR,[la]:n.SRC_ALPHA,[qc]:n.SRC_ALPHA_SATURATE,[Wc]:n.DST_COLOR,[Hc]:n.DST_ALPHA,[kc]:n.ONE_MINUS_SRC_COLOR,[ca]:n.ONE_MINUS_SRC_ALPHA,[Xc]:n.ONE_MINUS_DST_COLOR,[Vc]:n.ONE_MINUS_DST_ALPHA,[Yc]:n.CONSTANT_COLOR,[$c]:n.ONE_MINUS_CONSTANT_COLOR,[jc]:n.CONSTANT_ALPHA,[Kc]:n.ONE_MINUS_CONSTANT_ALPHA};function ge(P,ce,he,Ce,Te,Ze,Je,mt,Pt,Qe){if(P===Xn){h===!0&&(j(n.BLEND),h=!1);return}if(h===!1&&(re(n.BLEND),h=!0),P!==Nc){if(P!==x||Qe!==O){if((v!==ri||w!==ri)&&(n.blendEquation(n.FUNC_ADD),v=ri,w=ri),Qe)switch(P){case zi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ka:n.blendFunc(n.ONE,n.ONE);break;case Ha:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Va:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case zi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ka:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Ha:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Va:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}S=null,R=null,A=null,k=null,y.set(0,0,0),E=0,x=P,O=Qe}return}Te=Te||ce,Ze=Ze||he,Je=Je||Ce,(ce!==v||Te!==w)&&(n.blendEquationSeparate(pe[ce],pe[Te]),v=ce,w=Te),(he!==S||Ce!==R||Ze!==A||Je!==k)&&(n.blendFuncSeparate(xe[he],xe[Ce],xe[Ze],xe[Je]),S=he,R=Ce,A=Ze,k=Je),(mt.equals(y)===!1||Pt!==E)&&(n.blendColor(mt.r,mt.g,mt.b,Pt),y.copy(mt),E=Pt),x=P,O=!1}function Ke(P,ce){P.side===Zt?j(n.CULL_FACE):re(n.CULL_FACE);let he=P.side===Ct;ce&&(he=!he),be(he),P.blending===zi&&P.transparent===!1?ge(Xn):ge(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),l.setFunc(P.depthFunc),l.setTest(P.depthTest),l.setMask(P.depthWrite),o.setMask(P.colorWrite);const Ce=P.stencilWrite;c.setTest(Ce),Ce&&(c.setMask(P.stencilWriteMask),c.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),c.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),G(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?re(n.SAMPLE_ALPHA_TO_COVERAGE):j(n.SAMPLE_ALPHA_TO_COVERAGE)}function be(P){W!==P&&(P?n.frontFace(n.CW):n.frontFace(n.CCW),W=P)}function T(P){P!==Dc?(re(n.CULL_FACE),P!==K&&(P===Ga?n.cullFace(n.BACK):P===Uc?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):j(n.CULL_FACE),K=P}function M(P){P!==C&&(B&&n.lineWidth(P),C=P)}function G(P,ce,he){P?(re(n.POLYGON_OFFSET_FILL),(F!==ce||Y!==he)&&(n.polygonOffset(ce,he),F=ce,Y=he)):j(n.POLYGON_OFFSET_FILL)}function ne(P){P?re(n.SCISSOR_TEST):j(n.SCISSOR_TEST)}function te(P){P===void 0&&(P=n.TEXTURE0+I-1),Z!==P&&(n.activeTexture(P),Z=P)}function ie(P,ce,he){he===void 0&&(Z===null?he=n.TEXTURE0+I-1:he=Z);let Ce=se[he];Ce===void 0&&(Ce={type:void 0,texture:void 0},se[he]=Ce),(Ce.type!==P||Ce.texture!==ce)&&(Z!==he&&(n.activeTexture(he),Z=he),n.bindTexture(P,ce||le[P]),Ce.type=P,Ce.texture=ce)}function Me(){const P=se[Z];P!==void 0&&P.type!==void 0&&(n.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function de(){try{n.compressedTexImage2D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function _e(){try{n.compressedTexImage3D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Ae(){try{n.texSubImage2D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Be(){try{n.texSubImage3D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ee(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function $e(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Ve(){try{n.texStorage2D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function De(){try{n.texStorage3D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Se(){try{n.texImage2D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ve(){try{n.texImage3D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Fe(P){ue.equals(P)===!1&&(n.scissor(P.x,P.y,P.z,P.w),ue.copy(P))}function Ye(P){L.equals(P)===!1&&(n.viewport(P.x,P.y,P.z,P.w),L.copy(P))}function st(P,ce){let he=f.get(ce);he===void 0&&(he=new WeakMap,f.set(ce,he));let Ce=he.get(P);Ce===void 0&&(Ce=n.getUniformBlockIndex(ce,P.name),he.set(P,Ce))}function Ge(P,ce){const Ce=f.get(ce).get(P);u.get(ce)!==Ce&&(n.uniformBlockBinding(ce,Ce,P.__bindingPointIndex),u.set(ce,Ce))}function ae(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),p={},Z=null,se={},m={},_=new WeakMap,g=[],d=null,h=!1,x=null,v=null,S=null,R=null,w=null,A=null,k=null,y=new Ee(0,0,0),E=0,O=!1,W=null,K=null,C=null,F=null,Y=null,ue.set(0,0,n.canvas.width,n.canvas.height),L.set(0,0,n.canvas.width,n.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:re,disable:j,bindFramebuffer:fe,drawBuffers:U,useProgram:qe,setBlending:ge,setMaterial:Ke,setFlipSided:be,setCullFace:T,setLineWidth:M,setPolygonOffset:G,setScissorTest:ne,activeTexture:te,bindTexture:ie,unbindTexture:Me,compressedTexImage2D:de,compressedTexImage3D:_e,texImage2D:Se,texImage3D:ve,updateUBOMapping:st,uniformBlockBinding:Ge,texStorage2D:Ve,texStorage3D:De,texSubImage2D:Ae,texSubImage3D:Be,compressedTexSubImage2D:ee,compressedTexSubImage3D:$e,scissor:Fe,viewport:Ye,reset:ae}}function Wm(n,e,t,i,r,s,a){const o=r.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap;let f;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(T,M){return m?new OffscreenCanvas(T,M):as("canvas")}function g(T,M,G,ne){let te=1;if((T.width>ne||T.height>ne)&&(te=ne/Math.max(T.width,T.height)),te<1||M===!0)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap){const ie=M?ss:Math.floor,Me=ie(te*T.width),de=ie(te*T.height);f===void 0&&(f=_(Me,de));const _e=G?_(Me,de):f;return _e.width=Me,_e.height=de,_e.getContext("2d").drawImage(T,0,0,Me,de),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+T.width+"x"+T.height+") to ("+Me+"x"+de+")."),_e}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+T.width+"x"+T.height+")."),T;return T}function d(T){return ma(T.width)&&ma(T.height)}function h(T){return o?!1:T.wrapS!==hn||T.wrapT!==hn||T.minFilter!==Nt&&T.minFilter!==$t}function x(T,M){return T.generateMipmaps&&M&&T.minFilter!==Nt&&T.minFilter!==$t}function v(T){n.generateMipmap(T)}function S(T,M,G,ne,te=!1){if(o===!1)return M;if(T!==null){if(n[T]!==void 0)return n[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let ie=M;if(M===n.RED&&(G===n.FLOAT&&(ie=n.R32F),G===n.HALF_FLOAT&&(ie=n.R16F),G===n.UNSIGNED_BYTE&&(ie=n.R8)),M===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(ie=n.R8UI),G===n.UNSIGNED_SHORT&&(ie=n.R16UI),G===n.UNSIGNED_INT&&(ie=n.R32UI),G===n.BYTE&&(ie=n.R8I),G===n.SHORT&&(ie=n.R16I),G===n.INT&&(ie=n.R32I)),M===n.RG&&(G===n.FLOAT&&(ie=n.RG32F),G===n.HALF_FLOAT&&(ie=n.RG16F),G===n.UNSIGNED_BYTE&&(ie=n.RG8)),M===n.RGBA){const Me=te?ts:je.getTransfer(ne);G===n.FLOAT&&(ie=n.RGBA32F),G===n.HALF_FLOAT&&(ie=n.RGBA16F),G===n.UNSIGNED_BYTE&&(ie=Me===tt?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT_4_4_4_4&&(ie=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(ie=n.RGB5_A1)}return(ie===n.R16F||ie===n.R32F||ie===n.RG16F||ie===n.RG32F||ie===n.RGBA16F||ie===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ie}function R(T,M,G){return x(T,G)===!0||T.isFramebufferTexture&&T.minFilter!==Nt&&T.minFilter!==$t?Math.log2(Math.max(M.width,M.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?M.mipmaps.length:1}function w(T){return T===Nt||T===qa||T===vs?n.NEAREST:n.LINEAR}function A(T){const M=T.target;M.removeEventListener("dispose",A),y(M),M.isVideoTexture&&u.delete(M)}function k(T){const M=T.target;M.removeEventListener("dispose",k),O(M)}function y(T){const M=i.get(T);if(M.__webglInit===void 0)return;const G=T.source,ne=p.get(G);if(ne){const te=ne[M.__cacheKey];te.usedTimes--,te.usedTimes===0&&E(T),Object.keys(ne).length===0&&p.delete(G)}i.remove(T)}function E(T){const M=i.get(T);n.deleteTexture(M.__webglTexture);const G=T.source,ne=p.get(G);delete ne[M.__cacheKey],a.memory.textures--}function O(T){const M=T.texture,G=i.get(T),ne=i.get(M);if(ne.__webglTexture!==void 0&&(n.deleteTexture(ne.__webglTexture),a.memory.textures--),T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(G.__webglFramebuffer[te]))for(let ie=0;ie<G.__webglFramebuffer[te].length;ie++)n.deleteFramebuffer(G.__webglFramebuffer[te][ie]);else n.deleteFramebuffer(G.__webglFramebuffer[te]);G.__webglDepthbuffer&&n.deleteRenderbuffer(G.__webglDepthbuffer[te])}else{if(Array.isArray(G.__webglFramebuffer))for(let te=0;te<G.__webglFramebuffer.length;te++)n.deleteFramebuffer(G.__webglFramebuffer[te]);else n.deleteFramebuffer(G.__webglFramebuffer);if(G.__webglDepthbuffer&&n.deleteRenderbuffer(G.__webglDepthbuffer),G.__webglMultisampledFramebuffer&&n.deleteFramebuffer(G.__webglMultisampledFramebuffer),G.__webglColorRenderbuffer)for(let te=0;te<G.__webglColorRenderbuffer.length;te++)G.__webglColorRenderbuffer[te]&&n.deleteRenderbuffer(G.__webglColorRenderbuffer[te]);G.__webglDepthRenderbuffer&&n.deleteRenderbuffer(G.__webglDepthRenderbuffer)}if(T.isWebGLMultipleRenderTargets)for(let te=0,ie=M.length;te<ie;te++){const Me=i.get(M[te]);Me.__webglTexture&&(n.deleteTexture(Me.__webglTexture),a.memory.textures--),i.remove(M[te])}i.remove(M),i.remove(T)}let W=0;function K(){W=0}function C(){const T=W;return T>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+r.maxTextures),W+=1,T}function F(T){const M=[];return M.push(T.wrapS),M.push(T.wrapT),M.push(T.wrapR||0),M.push(T.magFilter),M.push(T.minFilter),M.push(T.anisotropy),M.push(T.internalFormat),M.push(T.format),M.push(T.type),M.push(T.generateMipmaps),M.push(T.premultiplyAlpha),M.push(T.flipY),M.push(T.unpackAlignment),M.push(T.colorSpace),M.join()}function Y(T,M){const G=i.get(T);if(T.isVideoTexture&&Ke(T),T.isRenderTargetTexture===!1&&T.version>0&&G.__version!==T.version){const ne=T.image;if(ne===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ne.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ue(G,T,M);return}}t.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+M)}function I(T,M){const G=i.get(T);if(T.version>0&&G.__version!==T.version){ue(G,T,M);return}t.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+M)}function B(T,M){const G=i.get(T);if(T.version>0&&G.__version!==T.version){ue(G,T,M);return}t.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+M)}function H(T,M){const G=i.get(T);if(T.version>0&&G.__version!==T.version){L(G,T,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+M)}const X={[da]:n.REPEAT,[hn]:n.CLAMP_TO_EDGE,[fa]:n.MIRRORED_REPEAT},Z={[Nt]:n.NEAREST,[qa]:n.NEAREST_MIPMAP_NEAREST,[vs]:n.NEAREST_MIPMAP_LINEAR,[$t]:n.LINEAR,[dh]:n.LINEAR_MIPMAP_NEAREST,[fr]:n.LINEAR_MIPMAP_LINEAR},se={[bh]:n.NEVER,[Ph]:n.ALWAYS,[Th]:n.LESS,[ql]:n.LEQUAL,[wh]:n.EQUAL,[Ch]:n.GEQUAL,[Ah]:n.GREATER,[Rh]:n.NOTEQUAL};function $(T,M,G){if(G?(n.texParameteri(T,n.TEXTURE_WRAP_S,X[M.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,X[M.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,X[M.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,Z[M.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,Z[M.minFilter])):(n.texParameteri(T,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(T,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(M.wrapS!==hn||M.wrapT!==hn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(T,n.TEXTURE_MAG_FILTER,w(M.magFilter)),n.texParameteri(T,n.TEXTURE_MIN_FILTER,w(M.minFilter)),M.minFilter!==Nt&&M.minFilter!==$t&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),M.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,se[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const ne=e.get("EXT_texture_filter_anisotropic");if(M.magFilter===Nt||M.minFilter!==vs&&M.minFilter!==fr||M.type===Vn&&e.has("OES_texture_float_linear")===!1||o===!1&&M.type===pr&&e.has("OES_texture_half_float_linear")===!1)return;(M.anisotropy>1||i.get(M).__currentAnisotropy)&&(n.texParameterf(T,ne.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy)}}function J(T,M){let G=!1;T.__webglInit===void 0&&(T.__webglInit=!0,M.addEventListener("dispose",A));const ne=M.source;let te=p.get(ne);te===void 0&&(te={},p.set(ne,te));const ie=F(M);if(ie!==T.__cacheKey){te[ie]===void 0&&(te[ie]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,G=!0),te[ie].usedTimes++;const Me=te[T.__cacheKey];Me!==void 0&&(te[T.__cacheKey].usedTimes--,Me.usedTimes===0&&E(M)),T.__cacheKey=ie,T.__webglTexture=te[ie].texture}return G}function ue(T,M,G){let ne=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(ne=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(ne=n.TEXTURE_3D);const te=J(T,M),ie=M.source;t.bindTexture(ne,T.__webglTexture,n.TEXTURE0+G);const Me=i.get(ie);if(ie.version!==Me.__version||te===!0){t.activeTexture(n.TEXTURE0+G);const de=je.getPrimaries(je.workingColorSpace),_e=M.colorSpace===Jt?null:je.getPrimaries(M.colorSpace),Ae=M.colorSpace===Jt||de===_e?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);const Be=h(M)&&d(M.image)===!1;let ee=g(M.image,Be,!1,r.maxTextureSize);ee=be(M,ee);const $e=d(ee)||o,Ve=s.convert(M.format,M.colorSpace);let De=s.convert(M.type),Se=S(M.internalFormat,Ve,De,M.colorSpace,M.isVideoTexture);$(ne,M,$e);let ve;const Fe=M.mipmaps,Ye=o&&M.isVideoTexture!==!0&&Se!==Vl,st=Me.__version===void 0||te===!0,Ge=R(M,ee,$e);if(M.isDepthTexture)Se=n.DEPTH_COMPONENT,o?M.type===Vn?Se=n.DEPTH_COMPONENT32F:M.type===Hn?Se=n.DEPTH_COMPONENT24:M.type===oi?Se=n.DEPTH24_STENCIL8:Se=n.DEPTH_COMPONENT16:M.type===Vn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),M.format===li&&Se===n.DEPTH_COMPONENT&&M.type!==ba&&M.type!==Hn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),M.type=Hn,De=s.convert(M.type)),M.format===Vi&&Se===n.DEPTH_COMPONENT&&(Se=n.DEPTH_STENCIL,M.type!==oi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),M.type=oi,De=s.convert(M.type))),st&&(Ye?t.texStorage2D(n.TEXTURE_2D,1,Se,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,Se,ee.width,ee.height,0,Ve,De,null));else if(M.isDataTexture)if(Fe.length>0&&$e){Ye&&st&&t.texStorage2D(n.TEXTURE_2D,Ge,Se,Fe[0].width,Fe[0].height);for(let ae=0,P=Fe.length;ae<P;ae++)ve=Fe[ae],Ye?t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ve.width,ve.height,Ve,De,ve.data):t.texImage2D(n.TEXTURE_2D,ae,Se,ve.width,ve.height,0,Ve,De,ve.data);M.generateMipmaps=!1}else Ye?(st&&t.texStorage2D(n.TEXTURE_2D,Ge,Se,ee.width,ee.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,ee.width,ee.height,Ve,De,ee.data)):t.texImage2D(n.TEXTURE_2D,0,Se,ee.width,ee.height,0,Ve,De,ee.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ye&&st&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ge,Se,Fe[0].width,Fe[0].height,ee.depth);for(let ae=0,P=Fe.length;ae<P;ae++)ve=Fe[ae],M.format!==un?Ve!==null?Ye?t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ve.width,ve.height,ee.depth,Ve,ve.data,0,0):t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ae,Se,ve.width,ve.height,ee.depth,0,ve.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?t.texSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ve.width,ve.height,ee.depth,Ve,De,ve.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ae,Se,ve.width,ve.height,ee.depth,0,Ve,De,ve.data)}else{Ye&&st&&t.texStorage2D(n.TEXTURE_2D,Ge,Se,Fe[0].width,Fe[0].height);for(let ae=0,P=Fe.length;ae<P;ae++)ve=Fe[ae],M.format!==un?Ve!==null?Ye?t.compressedTexSubImage2D(n.TEXTURE_2D,ae,0,0,ve.width,ve.height,Ve,ve.data):t.compressedTexImage2D(n.TEXTURE_2D,ae,Se,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ve.width,ve.height,Ve,De,ve.data):t.texImage2D(n.TEXTURE_2D,ae,Se,ve.width,ve.height,0,Ve,De,ve.data)}else if(M.isDataArrayTexture)Ye?(st&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ge,Se,ee.width,ee.height,ee.depth),t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,Ve,De,ee.data)):t.texImage3D(n.TEXTURE_2D_ARRAY,0,Se,ee.width,ee.height,ee.depth,0,Ve,De,ee.data);else if(M.isData3DTexture)Ye?(st&&t.texStorage3D(n.TEXTURE_3D,Ge,Se,ee.width,ee.height,ee.depth),t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,Ve,De,ee.data)):t.texImage3D(n.TEXTURE_3D,0,Se,ee.width,ee.height,ee.depth,0,Ve,De,ee.data);else if(M.isFramebufferTexture){if(st)if(Ye)t.texStorage2D(n.TEXTURE_2D,Ge,Se,ee.width,ee.height);else{let ae=ee.width,P=ee.height;for(let ce=0;ce<Ge;ce++)t.texImage2D(n.TEXTURE_2D,ce,Se,ae,P,0,Ve,De,null),ae>>=1,P>>=1}}else if(Fe.length>0&&$e){Ye&&st&&t.texStorage2D(n.TEXTURE_2D,Ge,Se,Fe[0].width,Fe[0].height);for(let ae=0,P=Fe.length;ae<P;ae++)ve=Fe[ae],Ye?t.texSubImage2D(n.TEXTURE_2D,ae,0,0,Ve,De,ve):t.texImage2D(n.TEXTURE_2D,ae,Se,Ve,De,ve);M.generateMipmaps=!1}else Ye?(st&&t.texStorage2D(n.TEXTURE_2D,Ge,Se,ee.width,ee.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ve,De,ee)):t.texImage2D(n.TEXTURE_2D,0,Se,Ve,De,ee);x(M,$e)&&v(ne),Me.__version=ie.version,M.onUpdate&&M.onUpdate(M)}T.__version=M.version}function L(T,M,G){if(M.image.length!==6)return;const ne=J(T,M),te=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+G);const ie=i.get(te);if(te.version!==ie.__version||ne===!0){t.activeTexture(n.TEXTURE0+G);const Me=je.getPrimaries(je.workingColorSpace),de=M.colorSpace===Jt?null:je.getPrimaries(M.colorSpace),_e=M.colorSpace===Jt||Me===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const Ae=M.isCompressedTexture||M.image[0].isCompressedTexture,Be=M.image[0]&&M.image[0].isDataTexture,ee=[];for(let ae=0;ae<6;ae++)!Ae&&!Be?ee[ae]=g(M.image[ae],!1,!0,r.maxCubemapSize):ee[ae]=Be?M.image[ae].image:M.image[ae],ee[ae]=be(M,ee[ae]);const $e=ee[0],Ve=d($e)||o,De=s.convert(M.format,M.colorSpace),Se=s.convert(M.type),ve=S(M.internalFormat,De,Se,M.colorSpace),Fe=o&&M.isVideoTexture!==!0,Ye=ie.__version===void 0||ne===!0;let st=R(M,$e,Ve);$(n.TEXTURE_CUBE_MAP,M,Ve);let Ge;if(Ae){Fe&&Ye&&t.texStorage2D(n.TEXTURE_CUBE_MAP,st,ve,$e.width,$e.height);for(let ae=0;ae<6;ae++){Ge=ee[ae].mipmaps;for(let P=0;P<Ge.length;P++){const ce=Ge[P];M.format!==un?De!==null?Fe?t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,P,0,0,ce.width,ce.height,De,ce.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,P,ve,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Fe?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,P,0,0,ce.width,ce.height,De,Se,ce.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,P,ve,ce.width,ce.height,0,De,Se,ce.data)}}}else{Ge=M.mipmaps,Fe&&Ye&&(Ge.length>0&&st++,t.texStorage2D(n.TEXTURE_CUBE_MAP,st,ve,ee[0].width,ee[0].height));for(let ae=0;ae<6;ae++)if(Be){Fe?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,ee[ae].width,ee[ae].height,De,Se,ee[ae].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,ve,ee[ae].width,ee[ae].height,0,De,Se,ee[ae].data);for(let P=0;P<Ge.length;P++){const he=Ge[P].image[ae].image;Fe?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,P+1,0,0,he.width,he.height,De,Se,he.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,P+1,ve,he.width,he.height,0,De,Se,he.data)}}else{Fe?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,De,Se,ee[ae]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,ve,De,Se,ee[ae]);for(let P=0;P<Ge.length;P++){const ce=Ge[P];Fe?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,P+1,0,0,De,Se,ce.image[ae]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,P+1,ve,De,Se,ce.image[ae])}}}x(M,Ve)&&v(n.TEXTURE_CUBE_MAP),ie.__version=te.version,M.onUpdate&&M.onUpdate(M)}T.__version=M.version}function Q(T,M,G,ne,te,ie){const Me=s.convert(G.format,G.colorSpace),de=s.convert(G.type),_e=S(G.internalFormat,Me,de,G.colorSpace);if(!i.get(M).__hasExternalTextures){const Be=Math.max(1,M.width>>ie),ee=Math.max(1,M.height>>ie);te===n.TEXTURE_3D||te===n.TEXTURE_2D_ARRAY?t.texImage3D(te,ie,_e,Be,ee,M.depth,0,Me,de,null):t.texImage2D(te,ie,_e,Be,ee,0,Me,de,null)}t.bindFramebuffer(n.FRAMEBUFFER,T),ge(M)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ne,te,i.get(G).__webglTexture,0,xe(M)):(te===n.TEXTURE_2D||te>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ne,te,i.get(G).__webglTexture,ie),t.bindFramebuffer(n.FRAMEBUFFER,null)}function le(T,M,G){if(n.bindRenderbuffer(n.RENDERBUFFER,T),M.depthBuffer&&!M.stencilBuffer){let ne=o===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(G||ge(M)){const te=M.depthTexture;te&&te.isDepthTexture&&(te.type===Vn?ne=n.DEPTH_COMPONENT32F:te.type===Hn&&(ne=n.DEPTH_COMPONENT24));const ie=xe(M);ge(M)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ie,ne,M.width,M.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,ie,ne,M.width,M.height)}else n.renderbufferStorage(n.RENDERBUFFER,ne,M.width,M.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,T)}else if(M.depthBuffer&&M.stencilBuffer){const ne=xe(M);G&&ge(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,ne,n.DEPTH24_STENCIL8,M.width,M.height):ge(M)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ne,n.DEPTH24_STENCIL8,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,T)}else{const ne=M.isWebGLMultipleRenderTargets===!0?M.texture:[M.texture];for(let te=0;te<ne.length;te++){const ie=ne[te],Me=s.convert(ie.format,ie.colorSpace),de=s.convert(ie.type),_e=S(ie.internalFormat,Me,de,ie.colorSpace),Ae=xe(M);G&&ge(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ae,_e,M.width,M.height):ge(M)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ae,_e,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,_e,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function re(T,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,T),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),Y(M.depthTexture,0);const ne=i.get(M.depthTexture).__webglTexture,te=xe(M);if(M.depthTexture.format===li)ge(M)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ne,0,te):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ne,0);else if(M.depthTexture.format===Vi)ge(M)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ne,0,te):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ne,0);else throw new Error("Unknown depthTexture format")}function j(T){const M=i.get(T),G=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!M.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");re(M.__webglFramebuffer,T)}else if(G){M.__webglDepthbuffer=[];for(let ne=0;ne<6;ne++)t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[ne]),M.__webglDepthbuffer[ne]=n.createRenderbuffer(),le(M.__webglDepthbuffer[ne],T,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer=n.createRenderbuffer(),le(M.__webglDepthbuffer,T,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function fe(T,M,G){const ne=i.get(T);M!==void 0&&Q(ne.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&j(T)}function U(T){const M=T.texture,G=i.get(T),ne=i.get(M);T.addEventListener("dispose",k),T.isWebGLMultipleRenderTargets!==!0&&(ne.__webglTexture===void 0&&(ne.__webglTexture=n.createTexture()),ne.__version=M.version,a.memory.textures++);const te=T.isWebGLCubeRenderTarget===!0,ie=T.isWebGLMultipleRenderTargets===!0,Me=d(T)||o;if(te){G.__webglFramebuffer=[];for(let de=0;de<6;de++)if(o&&M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer[de]=[];for(let _e=0;_e<M.mipmaps.length;_e++)G.__webglFramebuffer[de][_e]=n.createFramebuffer()}else G.__webglFramebuffer[de]=n.createFramebuffer()}else{if(o&&M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer=[];for(let de=0;de<M.mipmaps.length;de++)G.__webglFramebuffer[de]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if(ie)if(r.drawBuffers){const de=T.texture;for(let _e=0,Ae=de.length;_e<Ae;_e++){const Be=i.get(de[_e]);Be.__webglTexture===void 0&&(Be.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&T.samples>0&&ge(T)===!1){const de=ie?M:[M];G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let _e=0;_e<de.length;_e++){const Ae=de[_e];G.__webglColorRenderbuffer[_e]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[_e]);const Be=s.convert(Ae.format,Ae.colorSpace),ee=s.convert(Ae.type),$e=S(Ae.internalFormat,Be,ee,Ae.colorSpace,T.isXRRenderTarget===!0),Ve=xe(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ve,$e,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,G.__webglColorRenderbuffer[_e])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),le(G.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(te){t.bindTexture(n.TEXTURE_CUBE_MAP,ne.__webglTexture),$(n.TEXTURE_CUBE_MAP,M,Me);for(let de=0;de<6;de++)if(o&&M.mipmaps&&M.mipmaps.length>0)for(let _e=0;_e<M.mipmaps.length;_e++)Q(G.__webglFramebuffer[de][_e],T,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,_e);else Q(G.__webglFramebuffer[de],T,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);x(M,Me)&&v(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ie){const de=T.texture;for(let _e=0,Ae=de.length;_e<Ae;_e++){const Be=de[_e],ee=i.get(Be);t.bindTexture(n.TEXTURE_2D,ee.__webglTexture),$(n.TEXTURE_2D,Be,Me),Q(G.__webglFramebuffer,T,Be,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,0),x(Be,Me)&&v(n.TEXTURE_2D)}t.unbindTexture()}else{let de=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(o?de=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(de,ne.__webglTexture),$(de,M,Me),o&&M.mipmaps&&M.mipmaps.length>0)for(let _e=0;_e<M.mipmaps.length;_e++)Q(G.__webglFramebuffer[_e],T,M,n.COLOR_ATTACHMENT0,de,_e);else Q(G.__webglFramebuffer,T,M,n.COLOR_ATTACHMENT0,de,0);x(M,Me)&&v(de),t.unbindTexture()}T.depthBuffer&&j(T)}function qe(T){const M=d(T)||o,G=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let ne=0,te=G.length;ne<te;ne++){const ie=G[ne];if(x(ie,M)){const Me=T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,de=i.get(ie).__webglTexture;t.bindTexture(Me,de),v(Me),t.unbindTexture()}}}function pe(T){if(o&&T.samples>0&&ge(T)===!1){const M=T.isWebGLMultipleRenderTargets?T.texture:[T.texture],G=T.width,ne=T.height;let te=n.COLOR_BUFFER_BIT;const ie=[],Me=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=i.get(T),_e=T.isWebGLMultipleRenderTargets===!0;if(_e)for(let Ae=0;Ae<M.length;Ae++)t.bindFramebuffer(n.FRAMEBUFFER,de.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,de.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let Ae=0;Ae<M.length;Ae++){ie.push(n.COLOR_ATTACHMENT0+Ae),T.depthBuffer&&ie.push(Me);const Be=de.__ignoreDepthValues!==void 0?de.__ignoreDepthValues:!1;if(Be===!1&&(T.depthBuffer&&(te|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&(te|=n.STENCIL_BUFFER_BIT)),_e&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,de.__webglColorRenderbuffer[Ae]),Be===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[Me]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[Me])),_e){const ee=i.get(M[Ae]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ee,0)}n.blitFramebuffer(0,0,G,ne,0,0,G,ne,te,n.NEAREST),c&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ie)}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),_e)for(let Ae=0;Ae<M.length;Ae++){t.bindFramebuffer(n.FRAMEBUFFER,de.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.RENDERBUFFER,de.__webglColorRenderbuffer[Ae]);const Be=i.get(M[Ae]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,de.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.TEXTURE_2D,Be,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}}function xe(T){return Math.min(r.maxSamples,T.samples)}function ge(T){const M=i.get(T);return o&&T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Ke(T){const M=a.render.frame;u.get(T)!==M&&(u.set(T,M),T.update())}function be(T,M){const G=T.colorSpace,ne=T.format,te=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||T.format===pa||G!==In&&G!==Jt&&(je.getTransfer(G)===tt?o===!1?e.has("EXT_sRGB")===!0&&ne===un?(T.format=pa,T.minFilter=$t,T.generateMipmaps=!1):M=$l.sRGBToLinear(M):(ne!==un||te!==Yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),M}this.allocateTextureUnit=C,this.resetTextureUnits=K,this.setTexture2D=Y,this.setTexture2DArray=I,this.setTexture3D=B,this.setTextureCube=H,this.rebindTextures=fe,this.setupRenderTarget=U,this.updateRenderTargetMipmap=qe,this.updateMultisampleRenderTarget=pe,this.setupDepthRenderbuffer=j,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=ge}function Xm(n,e,t){const i=t.isWebGL2;function r(s,a=Jt){let o;const l=je.getTransfer(a);if(s===Yn)return n.UNSIGNED_BYTE;if(s===Bl)return n.UNSIGNED_SHORT_4_4_4_4;if(s===zl)return n.UNSIGNED_SHORT_5_5_5_1;if(s===fh)return n.BYTE;if(s===ph)return n.SHORT;if(s===ba)return n.UNSIGNED_SHORT;if(s===Ol)return n.INT;if(s===Hn)return n.UNSIGNED_INT;if(s===Vn)return n.FLOAT;if(s===pr)return i?n.HALF_FLOAT:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(s===mh)return n.ALPHA;if(s===un)return n.RGBA;if(s===gh)return n.LUMINANCE;if(s===_h)return n.LUMINANCE_ALPHA;if(s===li)return n.DEPTH_COMPONENT;if(s===Vi)return n.DEPTH_STENCIL;if(s===pa)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(s===vh)return n.RED;if(s===Gl)return n.RED_INTEGER;if(s===xh)return n.RG;if(s===kl)return n.RG_INTEGER;if(s===Hl)return n.RGBA_INTEGER;if(s===xs||s===Ms||s===ys||s===Ss)if(l===tt)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(s===xs)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===Ms)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===ys)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Ss)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(s===xs)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Ms)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===ys)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Ss)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Ya||s===$a||s===ja||s===Ka)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(s===Ya)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===$a)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===ja)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Ka)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Vl)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===Za||s===Ja)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(s===Za)return l===tt?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(s===Ja)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===Qa||s===eo||s===to||s===no||s===io||s===ro||s===so||s===ao||s===oo||s===lo||s===co||s===ho||s===uo||s===fo)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(s===Qa)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===eo)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===to)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===no)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===io)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===ro)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===so)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===ao)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===oo)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===lo)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===co)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===ho)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===uo)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===fo)return l===tt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Es||s===po||s===mo)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(s===Es)return l===tt?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===po)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===mo)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===Mh||s===go||s===_o||s===vo)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(s===Es)return o.COMPRESSED_RED_RGTC1_EXT;if(s===go)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===_o)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===vo)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===oi?i?n.UNSIGNED_INT_24_8:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):n[s]!==void 0?n[s]:null}return{convert:r}}class qm extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class pn extends St{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ym={type:"move"};class qs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new pn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new pn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new pn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const g of e.hand.values()){const d=t.getJointPose(g,i),h=this._getHandJoint(c,g);d!==null&&(h.matrix.fromArray(d.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=d.radius),h.visible=d!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],p=u.position.distanceTo(f.position),m=.02,_=.005;c.inputState.pinching&&p>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ym)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new pn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class $m extends qi{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,p=null,m=null,_=null;const g=t.getContextAttributes();let d=null,h=null;const x=[],v=[],S=new Re;let R=null;const w=new jt;w.layers.enable(1),w.viewport=new xt;const A=new jt;A.layers.enable(2),A.viewport=new xt;const k=[w,A],y=new qm;y.layers.enable(1),y.layers.enable(2);let E=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let J=x[$];return J===void 0&&(J=new qs,x[$]=J),J.getTargetRaySpace()},this.getControllerGrip=function($){let J=x[$];return J===void 0&&(J=new qs,x[$]=J),J.getGripSpace()},this.getHand=function($){let J=x[$];return J===void 0&&(J=new qs,x[$]=J),J.getHandSpace()};function W($){const J=v.indexOf($.inputSource);if(J===-1)return;const ue=x[J];ue!==void 0&&(ue.update($.inputSource,$.frame,c||a),ue.dispatchEvent({type:$.type,data:$.inputSource}))}function K(){r.removeEventListener("select",W),r.removeEventListener("selectstart",W),r.removeEventListener("selectend",W),r.removeEventListener("squeeze",W),r.removeEventListener("squeezestart",W),r.removeEventListener("squeezeend",W),r.removeEventListener("end",K),r.removeEventListener("inputsourceschange",C);for(let $=0;$<x.length;$++){const J=v[$];J!==null&&(v[$]=null,x[$].disconnect(J))}E=null,O=null,e.setRenderTarget(d),m=null,p=null,f=null,r=null,h=null,se.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(S.width,S.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return f},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function($){if(r=$,r!==null){if(d=e.getRenderTarget(),r.addEventListener("select",W),r.addEventListener("selectstart",W),r.addEventListener("selectend",W),r.addEventListener("squeeze",W),r.addEventListener("squeezestart",W),r.addEventListener("squeezeend",W),r.addEventListener("end",K),r.addEventListener("inputsourceschange",C),g.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(S),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const J={antialias:r.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,t,J),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),h=new ui(m.framebufferWidth,m.framebufferHeight,{format:un,type:Yn,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let J=null,ue=null,L=null;g.depth&&(L=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,J=g.stencil?Vi:li,ue=g.stencil?oi:Hn);const Q={colorFormat:t.RGBA8,depthFormat:L,scaleFactor:s};f=new XRWebGLBinding(r,t),p=f.createProjectionLayer(Q),r.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),h=new ui(p.textureWidth,p.textureHeight,{format:un,type:Yn,depthTexture:new oc(p.textureWidth,p.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0});const le=e.properties.get(h);le.__ignoreDepthValues=p.ignoreDepthValues}h.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),se.setContext(r),se.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function C($){for(let J=0;J<$.removed.length;J++){const ue=$.removed[J],L=v.indexOf(ue);L>=0&&(v[L]=null,x[L].disconnect(ue))}for(let J=0;J<$.added.length;J++){const ue=$.added[J];let L=v.indexOf(ue);if(L===-1){for(let le=0;le<x.length;le++)if(le>=v.length){v.push(ue),L=le;break}else if(v[le]===null){v[le]=ue,L=le;break}if(L===-1)break}const Q=x[L];Q&&Q.connect(ue)}}const F=new D,Y=new D;function I($,J,ue){F.setFromMatrixPosition(J.matrixWorld),Y.setFromMatrixPosition(ue.matrixWorld);const L=F.distanceTo(Y),Q=J.projectionMatrix.elements,le=ue.projectionMatrix.elements,re=Q[14]/(Q[10]-1),j=Q[14]/(Q[10]+1),fe=(Q[9]+1)/Q[5],U=(Q[9]-1)/Q[5],qe=(Q[8]-1)/Q[0],pe=(le[8]+1)/le[0],xe=re*qe,ge=re*pe,Ke=L/(-qe+pe),be=Ke*-qe;J.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(be),$.translateZ(Ke),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert();const T=re+Ke,M=j+Ke,G=xe-be,ne=ge+(L-be),te=fe*j/M*T,ie=U*j/M*T;$.projectionMatrix.makePerspective(G,ne,te,ie,T,M),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}function B($,J){J===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(J.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(r===null)return;y.near=A.near=w.near=$.near,y.far=A.far=w.far=$.far,(E!==y.near||O!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),E=y.near,O=y.far);const J=$.parent,ue=y.cameras;B(y,J);for(let L=0;L<ue.length;L++)B(ue[L],J);ue.length===2?I(y,w,A):y.projectionMatrix.copy(w.projectionMatrix),H($,y,J)};function H($,J,ue){ue===null?$.matrix.copy(J.matrixWorld):($.matrix.copy(ue.matrixWorld),$.matrix.invert(),$.matrix.multiply(J.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(J.projectionMatrix),$.projectionMatrixInverse.copy(J.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=mr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(p===null&&m===null))return l},this.setFoveation=function($){l=$,p!==null&&(p.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)};let X=null;function Z($,J){if(u=J.getViewerPose(c||a),_=J,u!==null){const ue=u.views;m!==null&&(e.setRenderTargetFramebuffer(h,m.framebuffer),e.setRenderTarget(h));let L=!1;ue.length!==y.cameras.length&&(y.cameras.length=0,L=!0);for(let Q=0;Q<ue.length;Q++){const le=ue[Q];let re=null;if(m!==null)re=m.getViewport(le);else{const fe=f.getViewSubImage(p,le);re=fe.viewport,Q===0&&(e.setRenderTargetTextures(h,fe.colorTexture,p.ignoreDepthValues?void 0:fe.depthStencilTexture),e.setRenderTarget(h))}let j=k[Q];j===void 0&&(j=new jt,j.layers.enable(Q),j.viewport=new xt,k[Q]=j),j.matrix.fromArray(le.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(le.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(re.x,re.y,re.width,re.height),Q===0&&(y.matrix.copy(j.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),L===!0&&y.cameras.push(j)}}for(let ue=0;ue<x.length;ue++){const L=v[ue],Q=x[ue];L!==null&&Q!==void 0&&Q.update(L,J,c||a)}X&&X($,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),_=null}const se=new sc;se.setAnimationLoop(Z),this.setAnimationLoop=function($){X=$},this.dispose=function(){}}}function jm(n,e){function t(d,h){d.matrixAutoUpdate===!0&&d.updateMatrix(),h.value.copy(d.matrix)}function i(d,h){h.color.getRGB(d.fogColor.value,nc(n)),h.isFog?(d.fogNear.value=h.near,d.fogFar.value=h.far):h.isFogExp2&&(d.fogDensity.value=h.density)}function r(d,h,x,v,S){h.isMeshBasicMaterial||h.isMeshLambertMaterial?s(d,h):h.isMeshToonMaterial?(s(d,h),f(d,h)):h.isMeshPhongMaterial?(s(d,h),u(d,h)):h.isMeshStandardMaterial?(s(d,h),p(d,h),h.isMeshPhysicalMaterial&&m(d,h,S)):h.isMeshMatcapMaterial?(s(d,h),_(d,h)):h.isMeshDepthMaterial?s(d,h):h.isMeshDistanceMaterial?(s(d,h),g(d,h)):h.isMeshNormalMaterial?s(d,h):h.isLineBasicMaterial?(a(d,h),h.isLineDashedMaterial&&o(d,h)):h.isPointsMaterial?l(d,h,x,v):h.isSpriteMaterial?c(d,h):h.isShadowMaterial?(d.color.value.copy(h.color),d.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(d,h){d.opacity.value=h.opacity,h.color&&d.diffuse.value.copy(h.color),h.emissive&&d.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(d.map.value=h.map,t(h.map,d.mapTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.bumpMap&&(d.bumpMap.value=h.bumpMap,t(h.bumpMap,d.bumpMapTransform),d.bumpScale.value=h.bumpScale,h.side===Ct&&(d.bumpScale.value*=-1)),h.normalMap&&(d.normalMap.value=h.normalMap,t(h.normalMap,d.normalMapTransform),d.normalScale.value.copy(h.normalScale),h.side===Ct&&d.normalScale.value.negate()),h.displacementMap&&(d.displacementMap.value=h.displacementMap,t(h.displacementMap,d.displacementMapTransform),d.displacementScale.value=h.displacementScale,d.displacementBias.value=h.displacementBias),h.emissiveMap&&(d.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,d.emissiveMapTransform)),h.specularMap&&(d.specularMap.value=h.specularMap,t(h.specularMap,d.specularMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest);const x=e.get(h).envMap;if(x&&(d.envMap.value=x,d.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,d.reflectivity.value=h.reflectivity,d.ior.value=h.ior,d.refractionRatio.value=h.refractionRatio),h.lightMap){d.lightMap.value=h.lightMap;const v=n._useLegacyLights===!0?Math.PI:1;d.lightMapIntensity.value=h.lightMapIntensity*v,t(h.lightMap,d.lightMapTransform)}h.aoMap&&(d.aoMap.value=h.aoMap,d.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,d.aoMapTransform))}function a(d,h){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,h.map&&(d.map.value=h.map,t(h.map,d.mapTransform))}function o(d,h){d.dashSize.value=h.dashSize,d.totalSize.value=h.dashSize+h.gapSize,d.scale.value=h.scale}function l(d,h,x,v){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,d.size.value=h.size*x,d.scale.value=v*.5,h.map&&(d.map.value=h.map,t(h.map,d.uvTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest)}function c(d,h){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,d.rotation.value=h.rotation,h.map&&(d.map.value=h.map,t(h.map,d.mapTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest)}function u(d,h){d.specular.value.copy(h.specular),d.shininess.value=Math.max(h.shininess,1e-4)}function f(d,h){h.gradientMap&&(d.gradientMap.value=h.gradientMap)}function p(d,h){d.metalness.value=h.metalness,h.metalnessMap&&(d.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,d.metalnessMapTransform)),d.roughness.value=h.roughness,h.roughnessMap&&(d.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,d.roughnessMapTransform)),e.get(h).envMap&&(d.envMapIntensity.value=h.envMapIntensity)}function m(d,h,x){d.ior.value=h.ior,h.sheen>0&&(d.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),d.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(d.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,d.sheenColorMapTransform)),h.sheenRoughnessMap&&(d.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,d.sheenRoughnessMapTransform))),h.clearcoat>0&&(d.clearcoat.value=h.clearcoat,d.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(d.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,d.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(d.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,d.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(d.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,d.clearcoatNormalMapTransform),d.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Ct&&d.clearcoatNormalScale.value.negate())),h.iridescence>0&&(d.iridescence.value=h.iridescence,d.iridescenceIOR.value=h.iridescenceIOR,d.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],d.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(d.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,d.iridescenceMapTransform)),h.iridescenceThicknessMap&&(d.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,d.iridescenceThicknessMapTransform))),h.transmission>0&&(d.transmission.value=h.transmission,d.transmissionSamplerMap.value=x.texture,d.transmissionSamplerSize.value.set(x.width,x.height),h.transmissionMap&&(d.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,d.transmissionMapTransform)),d.thickness.value=h.thickness,h.thicknessMap&&(d.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,d.thicknessMapTransform)),d.attenuationDistance.value=h.attenuationDistance,d.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(d.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(d.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,d.anisotropyMapTransform))),d.specularIntensity.value=h.specularIntensity,d.specularColor.value.copy(h.specularColor),h.specularColorMap&&(d.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,d.specularColorMapTransform)),h.specularIntensityMap&&(d.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,d.specularIntensityMapTransform))}function _(d,h){h.matcap&&(d.matcap.value=h.matcap)}function g(d,h){const x=e.get(h).light;d.referencePosition.value.setFromMatrixPosition(x.matrixWorld),d.nearDistance.value=x.shadow.camera.near,d.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Km(n,e,t,i){let r={},s={},a=[];const o=t.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(x,v){const S=v.program;i.uniformBlockBinding(x,S)}function c(x,v){let S=r[x.id];S===void 0&&(_(x),S=u(x),r[x.id]=S,x.addEventListener("dispose",d));const R=v.program;i.updateUBOMapping(x,R);const w=e.render.frame;s[x.id]!==w&&(p(x),s[x.id]=w)}function u(x){const v=f();x.__bindingPointIndex=v;const S=n.createBuffer(),R=x.__size,w=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,S),n.bufferData(n.UNIFORM_BUFFER,R,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,S),S}function f(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(x){const v=r[x.id],S=x.uniforms,R=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let w=0,A=S.length;w<A;w++){const k=Array.isArray(S[w])?S[w]:[S[w]];for(let y=0,E=k.length;y<E;y++){const O=k[y];if(m(O,w,y,R)===!0){const W=O.__offset,K=Array.isArray(O.value)?O.value:[O.value];let C=0;for(let F=0;F<K.length;F++){const Y=K[F],I=g(Y);typeof Y=="number"||typeof Y=="boolean"?(O.__data[0]=Y,n.bufferSubData(n.UNIFORM_BUFFER,W+C,O.__data)):Y.isMatrix3?(O.__data[0]=Y.elements[0],O.__data[1]=Y.elements[1],O.__data[2]=Y.elements[2],O.__data[3]=0,O.__data[4]=Y.elements[3],O.__data[5]=Y.elements[4],O.__data[6]=Y.elements[5],O.__data[7]=0,O.__data[8]=Y.elements[6],O.__data[9]=Y.elements[7],O.__data[10]=Y.elements[8],O.__data[11]=0):(Y.toArray(O.__data,C),C+=I.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,W,O.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(x,v,S,R){const w=x.value,A=v+"_"+S;if(R[A]===void 0)return typeof w=="number"||typeof w=="boolean"?R[A]=w:R[A]=w.clone(),!0;{const k=R[A];if(typeof w=="number"||typeof w=="boolean"){if(k!==w)return R[A]=w,!0}else if(k.equals(w)===!1)return k.copy(w),!0}return!1}function _(x){const v=x.uniforms;let S=0;const R=16;for(let A=0,k=v.length;A<k;A++){const y=Array.isArray(v[A])?v[A]:[v[A]];for(let E=0,O=y.length;E<O;E++){const W=y[E],K=Array.isArray(W.value)?W.value:[W.value];for(let C=0,F=K.length;C<F;C++){const Y=K[C],I=g(Y),B=S%R;B!==0&&R-B<I.boundary&&(S+=R-B),W.__data=new Float32Array(I.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=S,S+=I.storage}}}const w=S%R;return w>0&&(S+=R-w),x.__size=S,x.__cache={},this}function g(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function d(x){const v=x.target;v.removeEventListener("dispose",d);const S=a.indexOf(v.__bindingPointIndex);a.splice(S,1),n.deleteBuffer(r[v.id]),delete r[v.id],delete s[v.id]}function h(){for(const x in r)n.deleteBuffer(r[x]);a=[],r={},s={}}return{bind:l,update:c,dispose:h}}class fc{constructor(e={}){const{canvas:t=Xh(),context:i=null,depth:r=!0,stencil:s=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=e;this.isWebGLRenderer=!0;let p;i!==null?p=i.getContextAttributes().alpha:p=a;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,d=null;const h=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ut,this._useLegacyLights=!1,this.toneMapping=qn,this.toneMappingExposure=1;const v=this;let S=!1,R=0,w=0,A=null,k=-1,y=null;const E=new xt,O=new xt;let W=null;const K=new Ee(0);let C=0,F=t.width,Y=t.height,I=1,B=null,H=null;const X=new xt(0,0,F,Y),Z=new xt(0,0,F,Y);let se=!1;const $=new Aa;let J=!1,ue=!1,L=null;const Q=new et,le=new Re,re=new D,j={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function fe(){return A===null?I:1}let U=i;function qe(b,N){for(let V=0;V<b.length;V++){const q=b[V],z=t.getContext(q,N);if(z!==null)return z}return null}try{const b={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ea}`),t.addEventListener("webglcontextlost",ae,!1),t.addEventListener("webglcontextrestored",P,!1),t.addEventListener("webglcontextcreationerror",ce,!1),U===null){const N=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&N.shift(),U=qe(N,b),U===null)throw qe(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&U instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),U.getShaderPrecisionFormat===void 0&&(U.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let pe,xe,ge,Ke,be,T,M,G,ne,te,ie,Me,de,_e,Ae,Be,ee,$e,Ve,De,Se,ve,Fe,Ye;function st(){pe=new ap(U),xe=new ep(U,pe,e),pe.init(xe),ve=new Xm(U,pe,xe),ge=new Vm(U,pe,xe),Ke=new cp(U),be=new Cm,T=new Wm(U,pe,ge,be,xe,ve,Ke),M=new np(v),G=new sp(v),ne=new gu(U,xe),Fe=new Jf(U,pe,ne,xe),te=new op(U,ne,Ke,Fe),ie=new fp(U,te,ne,Ke),Ve=new dp(U,xe,T),Be=new tp(be),Me=new Rm(v,M,G,pe,xe,Fe,Be),de=new jm(v,be),_e=new Lm,Ae=new Om(pe,xe),$e=new Zf(v,M,G,ge,ie,p,l),ee=new Hm(v,ie,xe),Ye=new Km(U,Ke,xe,ge),De=new Qf(U,pe,Ke,xe),Se=new lp(U,pe,Ke,xe),Ke.programs=Me.programs,v.capabilities=xe,v.extensions=pe,v.properties=be,v.renderLists=_e,v.shadowMap=ee,v.state=ge,v.info=Ke}st();const Ge=new $m(v,U);this.xr=Ge,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const b=pe.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=pe.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return I},this.setPixelRatio=function(b){b!==void 0&&(I=b,this.setSize(F,Y,!1))},this.getSize=function(b){return b.set(F,Y)},this.setSize=function(b,N,V=!0){if(Ge.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=b,Y=N,t.width=Math.floor(b*I),t.height=Math.floor(N*I),V===!0&&(t.style.width=b+"px",t.style.height=N+"px"),this.setViewport(0,0,b,N)},this.getDrawingBufferSize=function(b){return b.set(F*I,Y*I).floor()},this.setDrawingBufferSize=function(b,N,V){F=b,Y=N,I=V,t.width=Math.floor(b*V),t.height=Math.floor(N*V),this.setViewport(0,0,b,N)},this.getCurrentViewport=function(b){return b.copy(E)},this.getViewport=function(b){return b.copy(X)},this.setViewport=function(b,N,V,q){b.isVector4?X.set(b.x,b.y,b.z,b.w):X.set(b,N,V,q),ge.viewport(E.copy(X).multiplyScalar(I).floor())},this.getScissor=function(b){return b.copy(Z)},this.setScissor=function(b,N,V,q){b.isVector4?Z.set(b.x,b.y,b.z,b.w):Z.set(b,N,V,q),ge.scissor(O.copy(Z).multiplyScalar(I).floor())},this.getScissorTest=function(){return se},this.setScissorTest=function(b){ge.setScissorTest(se=b)},this.setOpaqueSort=function(b){B=b},this.setTransparentSort=function(b){H=b},this.getClearColor=function(b){return b.copy($e.getClearColor())},this.setClearColor=function(){$e.setClearColor.apply($e,arguments)},this.getClearAlpha=function(){return $e.getClearAlpha()},this.setClearAlpha=function(){$e.setClearAlpha.apply($e,arguments)},this.clear=function(b=!0,N=!0,V=!0){let q=0;if(b){let z=!1;if(A!==null){const me=A.texture.format;z=me===Hl||me===kl||me===Gl}if(z){const me=A.texture.type,ye=me===Yn||me===Hn||me===ba||me===oi||me===Bl||me===zl,we=$e.getClearColor(),Le=$e.getClearAlpha(),ze=we.r,Ue=we.g,Ie=we.b;ye?(m[0]=ze,m[1]=Ue,m[2]=Ie,m[3]=Le,U.clearBufferuiv(U.COLOR,0,m)):(_[0]=ze,_[1]=Ue,_[2]=Ie,_[3]=Le,U.clearBufferiv(U.COLOR,0,_))}else q|=U.COLOR_BUFFER_BIT}N&&(q|=U.DEPTH_BUFFER_BIT),V&&(q|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ae,!1),t.removeEventListener("webglcontextrestored",P,!1),t.removeEventListener("webglcontextcreationerror",ce,!1),_e.dispose(),Ae.dispose(),be.dispose(),M.dispose(),G.dispose(),ie.dispose(),Fe.dispose(),Ye.dispose(),Me.dispose(),Ge.dispose(),Ge.removeEventListener("sessionstart",Pt),Ge.removeEventListener("sessionend",Qe),L&&(L.dispose(),L=null),Lt.stop()};function ae(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function P(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const b=Ke.autoReset,N=ee.enabled,V=ee.autoUpdate,q=ee.needsUpdate,z=ee.type;st(),Ke.autoReset=b,ee.enabled=N,ee.autoUpdate=V,ee.needsUpdate=q,ee.type=z}function ce(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function he(b){const N=b.target;N.removeEventListener("dispose",he),Ce(N)}function Ce(b){Te(b),be.remove(b)}function Te(b){const N=be.get(b).programs;N!==void 0&&(N.forEach(function(V){Me.releaseProgram(V)}),b.isShaderMaterial&&Me.releaseShaderCache(b))}this.renderBufferDirect=function(b,N,V,q,z,me){N===null&&(N=j);const ye=z.isMesh&&z.matrixWorld.determinant()<0,we=Rc(b,N,V,q,z);ge.setMaterial(q,ye);let Le=V.index,ze=1;if(q.wireframe===!0){if(Le=te.getWireframeAttribute(V),Le===void 0)return;ze=2}const Ue=V.drawRange,Ie=V.attributes.position;let ot=Ue.start*ze,zt=(Ue.start+Ue.count)*ze;me!==null&&(ot=Math.max(ot,me.start*ze),zt=Math.min(zt,(me.start+me.count)*ze)),Le!==null?(ot=Math.max(ot,0),zt=Math.min(zt,Le.count)):Ie!=null&&(ot=Math.max(ot,0),zt=Math.min(zt,Ie.count));const gt=zt-ot;if(gt<0||gt===1/0)return;Fe.setup(z,q,we,V,Le);let Tn,rt=De;if(Le!==null&&(Tn=ne.get(Le),rt=Se,rt.setIndex(Tn)),z.isMesh)q.wireframe===!0?(ge.setLineWidth(q.wireframeLinewidth*fe()),rt.setMode(U.LINES)):rt.setMode(U.TRIANGLES);else if(z.isLine){let ke=q.linewidth;ke===void 0&&(ke=1),ge.setLineWidth(ke*fe()),z.isLineSegments?rt.setMode(U.LINES):z.isLineLoop?rt.setMode(U.LINE_LOOP):rt.setMode(U.LINE_STRIP)}else z.isPoints?rt.setMode(U.POINTS):z.isSprite&&rt.setMode(U.TRIANGLES);if(z.isBatchedMesh)rt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else if(z.isInstancedMesh)rt.renderInstances(ot,gt,z.count);else if(V.isInstancedBufferGeometry){const ke=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,ps=Math.min(V.instanceCount,ke);rt.renderInstances(ot,gt,ps)}else rt.render(ot,gt)};function Ze(b,N,V){b.transparent===!0&&b.side===Zt&&b.forceSinglePass===!1?(b.side=Ct,b.needsUpdate=!0,yr(b,N,V),b.side=$n,b.needsUpdate=!0,yr(b,N,V),b.side=Zt):yr(b,N,V)}this.compile=function(b,N,V=null){V===null&&(V=b),d=Ae.get(V),d.init(),x.push(d),V.traverseVisible(function(z){z.isLight&&z.layers.test(N.layers)&&(d.pushLight(z),z.castShadow&&d.pushShadow(z))}),b!==V&&b.traverseVisible(function(z){z.isLight&&z.layers.test(N.layers)&&(d.pushLight(z),z.castShadow&&d.pushShadow(z))}),d.setupLights(v._useLegacyLights);const q=new Set;return b.traverse(function(z){const me=z.material;if(me)if(Array.isArray(me))for(let ye=0;ye<me.length;ye++){const we=me[ye];Ze(we,V,z),q.add(we)}else Ze(me,V,z),q.add(me)}),x.pop(),d=null,q},this.compileAsync=function(b,N,V=null){const q=this.compile(b,N,V);return new Promise(z=>{function me(){if(q.forEach(function(ye){be.get(ye).currentProgram.isReady()&&q.delete(ye)}),q.size===0){z(b);return}setTimeout(me,10)}pe.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let Je=null;function mt(b){Je&&Je(b)}function Pt(){Lt.stop()}function Qe(){Lt.start()}const Lt=new sc;Lt.setAnimationLoop(mt),typeof self<"u"&&Lt.setContext(self),this.setAnimationLoop=function(b){Je=b,Ge.setAnimationLoop(b),b===null?Lt.stop():Lt.start()},Ge.addEventListener("sessionstart",Pt),Ge.addEventListener("sessionend",Qe),this.render=function(b,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Ge.enabled===!0&&Ge.isPresenting===!0&&(Ge.cameraAutoUpdate===!0&&Ge.updateCamera(N),N=Ge.getCamera()),b.isScene===!0&&b.onBeforeRender(v,b,N,A),d=Ae.get(b,x.length),d.init(),x.push(d),Q.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),$.setFromProjectionMatrix(Q),ue=this.localClippingEnabled,J=Be.init(this.clippingPlanes,ue),g=_e.get(b,h.length),g.init(),h.push(g),_n(b,N,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(B,H),this.info.render.frame++,J===!0&&Be.beginShadows();const V=d.state.shadowsArray;if(ee.render(V,b,N),J===!0&&Be.endShadows(),this.info.autoReset===!0&&this.info.reset(),$e.render(g,b),d.setupLights(v._useLegacyLights),N.isArrayCamera){const q=N.cameras;for(let z=0,me=q.length;z<me;z++){const ye=q[z];Ia(g,b,ye,ye.viewport)}}else Ia(g,b,N);A!==null&&(T.updateMultisampleRenderTarget(A),T.updateRenderTargetMipmap(A)),b.isScene===!0&&b.onAfterRender(v,b,N),Fe.resetDefaultState(),k=-1,y=null,x.pop(),x.length>0?d=x[x.length-1]:d=null,h.pop(),h.length>0?g=h[h.length-1]:g=null};function _n(b,N,V,q){if(b.visible===!1)return;if(b.layers.test(N.layers)){if(b.isGroup)V=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(N);else if(b.isLight)d.pushLight(b),b.castShadow&&d.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||$.intersectsSprite(b)){q&&re.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Q);const ye=ie.update(b),we=b.material;we.visible&&g.push(b,ye,we,V,re.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||$.intersectsObject(b))){const ye=ie.update(b),we=b.material;if(q&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),re.copy(b.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),re.copy(ye.boundingSphere.center)),re.applyMatrix4(b.matrixWorld).applyMatrix4(Q)),Array.isArray(we)){const Le=ye.groups;for(let ze=0,Ue=Le.length;ze<Ue;ze++){const Ie=Le[ze],ot=we[Ie.materialIndex];ot&&ot.visible&&g.push(b,ye,ot,V,re.z,Ie)}}else we.visible&&g.push(b,ye,we,V,re.z,null)}}const me=b.children;for(let ye=0,we=me.length;ye<we;ye++)_n(me[ye],N,V,q)}function Ia(b,N,V,q){const z=b.opaque,me=b.transmissive,ye=b.transparent;d.setupLightsView(V),J===!0&&Be.setGlobalState(v.clippingPlanes,V),me.length>0&&Ac(z,me,N,V),q&&ge.viewport(E.copy(q)),z.length>0&&Mr(z,N,V),me.length>0&&Mr(me,N,V),ye.length>0&&Mr(ye,N,V),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function Ac(b,N,V,q){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;const me=xe.isWebGL2;L===null&&(L=new ui(1,1,{generateMipmaps:!0,type:pe.has("EXT_color_buffer_half_float")?pr:Yn,minFilter:fr,samples:me?4:0})),v.getDrawingBufferSize(le),me?L.setSize(le.x,le.y):L.setSize(ss(le.x),ss(le.y));const ye=v.getRenderTarget();v.setRenderTarget(L),v.getClearColor(K),C=v.getClearAlpha(),C<1&&v.setClearColor(16777215,.5),v.clear();const we=v.toneMapping;v.toneMapping=qn,Mr(b,V,q),T.updateMultisampleRenderTarget(L),T.updateRenderTargetMipmap(L);let Le=!1;for(let ze=0,Ue=N.length;ze<Ue;ze++){const Ie=N[ze],ot=Ie.object,zt=Ie.geometry,gt=Ie.material,Tn=Ie.group;if(gt.side===Zt&&ot.layers.test(q.layers)){const rt=gt.side;gt.side=Ct,gt.needsUpdate=!0,Na(ot,V,q,zt,gt,Tn),gt.side=rt,gt.needsUpdate=!0,Le=!0}}Le===!0&&(T.updateMultisampleRenderTarget(L),T.updateRenderTargetMipmap(L)),v.setRenderTarget(ye),v.setClearColor(K,C),v.toneMapping=we}function Mr(b,N,V){const q=N.isScene===!0?N.overrideMaterial:null;for(let z=0,me=b.length;z<me;z++){const ye=b[z],we=ye.object,Le=ye.geometry,ze=q===null?ye.material:q,Ue=ye.group;we.layers.test(V.layers)&&Na(we,N,V,Le,ze,Ue)}}function Na(b,N,V,q,z,me){b.onBeforeRender(v,N,V,q,z,me),b.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),z.onBeforeRender(v,N,V,q,b,me),z.transparent===!0&&z.side===Zt&&z.forceSinglePass===!1?(z.side=Ct,z.needsUpdate=!0,v.renderBufferDirect(V,N,q,z,b,me),z.side=$n,z.needsUpdate=!0,v.renderBufferDirect(V,N,q,z,b,me),z.side=Zt):v.renderBufferDirect(V,N,q,z,b,me),b.onAfterRender(v,N,V,q,z,me)}function yr(b,N,V){N.isScene!==!0&&(N=j);const q=be.get(b),z=d.state.lights,me=d.state.shadowsArray,ye=z.state.version,we=Me.getParameters(b,z.state,me,N,V),Le=Me.getProgramCacheKey(we);let ze=q.programs;q.environment=b.isMeshStandardMaterial?N.environment:null,q.fog=N.fog,q.envMap=(b.isMeshStandardMaterial?G:M).get(b.envMap||q.environment),ze===void 0&&(b.addEventListener("dispose",he),ze=new Map,q.programs=ze);let Ue=ze.get(Le);if(Ue!==void 0){if(q.currentProgram===Ue&&q.lightsStateVersion===ye)return Oa(b,we),Ue}else we.uniforms=Me.getUniforms(b),b.onBuild(V,we,v),b.onBeforeCompile(we,v),Ue=Me.acquireProgram(we,Le),ze.set(Le,Ue),q.uniforms=we.uniforms;const Ie=q.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ie.clippingPlanes=Be.uniform),Oa(b,we),q.needsLights=Pc(b),q.lightsStateVersion=ye,q.needsLights&&(Ie.ambientLightColor.value=z.state.ambient,Ie.lightProbe.value=z.state.probe,Ie.directionalLights.value=z.state.directional,Ie.directionalLightShadows.value=z.state.directionalShadow,Ie.spotLights.value=z.state.spot,Ie.spotLightShadows.value=z.state.spotShadow,Ie.rectAreaLights.value=z.state.rectArea,Ie.ltc_1.value=z.state.rectAreaLTC1,Ie.ltc_2.value=z.state.rectAreaLTC2,Ie.pointLights.value=z.state.point,Ie.pointLightShadows.value=z.state.pointShadow,Ie.hemisphereLights.value=z.state.hemi,Ie.directionalShadowMap.value=z.state.directionalShadowMap,Ie.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ie.spotShadowMap.value=z.state.spotShadowMap,Ie.spotLightMatrix.value=z.state.spotLightMatrix,Ie.spotLightMap.value=z.state.spotLightMap,Ie.pointShadowMap.value=z.state.pointShadowMap,Ie.pointShadowMatrix.value=z.state.pointShadowMatrix),q.currentProgram=Ue,q.uniformsList=null,Ue}function Fa(b){if(b.uniformsList===null){const N=b.currentProgram.getUniforms();b.uniformsList=Qr.seqWithValue(N.seq,b.uniforms)}return b.uniformsList}function Oa(b,N){const V=be.get(b);V.outputColorSpace=N.outputColorSpace,V.batching=N.batching,V.instancing=N.instancing,V.instancingColor=N.instancingColor,V.skinning=N.skinning,V.morphTargets=N.morphTargets,V.morphNormals=N.morphNormals,V.morphColors=N.morphColors,V.morphTargetsCount=N.morphTargetsCount,V.numClippingPlanes=N.numClippingPlanes,V.numIntersection=N.numClipIntersection,V.vertexAlphas=N.vertexAlphas,V.vertexTangents=N.vertexTangents,V.toneMapping=N.toneMapping}function Rc(b,N,V,q,z){N.isScene!==!0&&(N=j),T.resetTextureUnits();const me=N.fog,ye=q.isMeshStandardMaterial?N.environment:null,we=A===null?v.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:In,Le=(q.isMeshStandardMaterial?G:M).get(q.envMap||ye),ze=q.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ue=!!V.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ie=!!V.morphAttributes.position,ot=!!V.morphAttributes.normal,zt=!!V.morphAttributes.color;let gt=qn;q.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(gt=v.toneMapping);const Tn=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,rt=Tn!==void 0?Tn.length:0,ke=be.get(q),ps=d.state.lights;if(J===!0&&(ue===!0||b!==y)){const Xt=b===y&&q.id===k;Be.setState(q,b,Xt)}let at=!1;q.version===ke.__version?(ke.needsLights&&ke.lightsStateVersion!==ps.state.version||ke.outputColorSpace!==we||z.isBatchedMesh&&ke.batching===!1||!z.isBatchedMesh&&ke.batching===!0||z.isInstancedMesh&&ke.instancing===!1||!z.isInstancedMesh&&ke.instancing===!0||z.isSkinnedMesh&&ke.skinning===!1||!z.isSkinnedMesh&&ke.skinning===!0||z.isInstancedMesh&&ke.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&ke.instancingColor===!1&&z.instanceColor!==null||ke.envMap!==Le||q.fog===!0&&ke.fog!==me||ke.numClippingPlanes!==void 0&&(ke.numClippingPlanes!==Be.numPlanes||ke.numIntersection!==Be.numIntersection)||ke.vertexAlphas!==ze||ke.vertexTangents!==Ue||ke.morphTargets!==Ie||ke.morphNormals!==ot||ke.morphColors!==zt||ke.toneMapping!==gt||xe.isWebGL2===!0&&ke.morphTargetsCount!==rt)&&(at=!0):(at=!0,ke.__version=q.version);let Kn=ke.currentProgram;at===!0&&(Kn=yr(q,N,z));let Ba=!1,Ji=!1,ms=!1;const bt=Kn.getUniforms(),Zn=ke.uniforms;if(ge.useProgram(Kn.program)&&(Ba=!0,Ji=!0,ms=!0),q.id!==k&&(k=q.id,Ji=!0),Ba||y!==b){bt.setValue(U,"projectionMatrix",b.projectionMatrix),bt.setValue(U,"viewMatrix",b.matrixWorldInverse);const Xt=bt.map.cameraPosition;Xt!==void 0&&Xt.setValue(U,re.setFromMatrixPosition(b.matrixWorld)),xe.logarithmicDepthBuffer&&bt.setValue(U,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&bt.setValue(U,"isOrthographic",b.isOrthographicCamera===!0),y!==b&&(y=b,Ji=!0,ms=!0)}if(z.isSkinnedMesh){bt.setOptional(U,z,"bindMatrix"),bt.setOptional(U,z,"bindMatrixInverse");const Xt=z.skeleton;Xt&&(xe.floatVertexTextures?(Xt.boneTexture===null&&Xt.computeBoneTexture(),bt.setValue(U,"boneTexture",Xt.boneTexture,T)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}z.isBatchedMesh&&(bt.setOptional(U,z,"batchingTexture"),bt.setValue(U,"batchingTexture",z._matricesTexture,T));const gs=V.morphAttributes;if((gs.position!==void 0||gs.normal!==void 0||gs.color!==void 0&&xe.isWebGL2===!0)&&Ve.update(z,V,Kn),(Ji||ke.receiveShadow!==z.receiveShadow)&&(ke.receiveShadow=z.receiveShadow,bt.setValue(U,"receiveShadow",z.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(Zn.envMap.value=Le,Zn.flipEnvMap.value=Le.isCubeTexture&&Le.isRenderTargetTexture===!1?-1:1),Ji&&(bt.setValue(U,"toneMappingExposure",v.toneMappingExposure),ke.needsLights&&Cc(Zn,ms),me&&q.fog===!0&&de.refreshFogUniforms(Zn,me),de.refreshMaterialUniforms(Zn,q,I,Y,L),Qr.upload(U,Fa(ke),Zn,T)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Qr.upload(U,Fa(ke),Zn,T),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&bt.setValue(U,"center",z.center),bt.setValue(U,"modelViewMatrix",z.modelViewMatrix),bt.setValue(U,"normalMatrix",z.normalMatrix),bt.setValue(U,"modelMatrix",z.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const Xt=q.uniformsGroups;for(let _s=0,Lc=Xt.length;_s<Lc;_s++)if(xe.isWebGL2){const za=Xt[_s];Ye.update(za,Kn),Ye.bind(za,Kn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Kn}function Cc(b,N){b.ambientLightColor.needsUpdate=N,b.lightProbe.needsUpdate=N,b.directionalLights.needsUpdate=N,b.directionalLightShadows.needsUpdate=N,b.pointLights.needsUpdate=N,b.pointLightShadows.needsUpdate=N,b.spotLights.needsUpdate=N,b.spotLightShadows.needsUpdate=N,b.rectAreaLights.needsUpdate=N,b.hemisphereLights.needsUpdate=N}function Pc(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(b,N,V){be.get(b.texture).__webglTexture=N,be.get(b.depthTexture).__webglTexture=V;const q=be.get(b);q.__hasExternalTextures=!0,q.__hasExternalTextures&&(q.__autoAllocateDepthBuffer=V===void 0,q.__autoAllocateDepthBuffer||pe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,N){const V=be.get(b);V.__webglFramebuffer=N,V.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(b,N=0,V=0){A=b,R=N,w=V;let q=!0,z=null,me=!1,ye=!1;if(b){const Le=be.get(b);Le.__useDefaultFramebuffer!==void 0?(ge.bindFramebuffer(U.FRAMEBUFFER,null),q=!1):Le.__webglFramebuffer===void 0?T.setupRenderTarget(b):Le.__hasExternalTextures&&T.rebindTextures(b,be.get(b.texture).__webglTexture,be.get(b.depthTexture).__webglTexture);const ze=b.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(ye=!0);const Ue=be.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ue[N])?z=Ue[N][V]:z=Ue[N],me=!0):xe.isWebGL2&&b.samples>0&&T.useMultisampledRTT(b)===!1?z=be.get(b).__webglMultisampledFramebuffer:Array.isArray(Ue)?z=Ue[V]:z=Ue,E.copy(b.viewport),O.copy(b.scissor),W=b.scissorTest}else E.copy(X).multiplyScalar(I).floor(),O.copy(Z).multiplyScalar(I).floor(),W=se;if(ge.bindFramebuffer(U.FRAMEBUFFER,z)&&xe.drawBuffers&&q&&ge.drawBuffers(b,z),ge.viewport(E),ge.scissor(O),ge.setScissorTest(W),me){const Le=be.get(b.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+N,Le.__webglTexture,V)}else if(ye){const Le=be.get(b.texture),ze=N||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Le.__webglTexture,V||0,ze)}k=-1},this.readRenderTargetPixels=function(b,N,V,q,z,me,ye){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=be.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ye!==void 0&&(we=we[ye]),we){ge.bindFramebuffer(U.FRAMEBUFFER,we);try{const Le=b.texture,ze=Le.format,Ue=Le.type;if(ze!==un&&ve.convert(ze)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ie=Ue===pr&&(pe.has("EXT_color_buffer_half_float")||xe.isWebGL2&&pe.has("EXT_color_buffer_float"));if(Ue!==Yn&&ve.convert(Ue)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ue===Vn&&(xe.isWebGL2||pe.has("OES_texture_float")||pe.has("WEBGL_color_buffer_float")))&&!Ie){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=b.width-q&&V>=0&&V<=b.height-z&&U.readPixels(N,V,q,z,ve.convert(ze),ve.convert(Ue),me)}finally{const Le=A!==null?be.get(A).__webglFramebuffer:null;ge.bindFramebuffer(U.FRAMEBUFFER,Le)}}},this.copyFramebufferToTexture=function(b,N,V=0){const q=Math.pow(2,-V),z=Math.floor(N.image.width*q),me=Math.floor(N.image.height*q);T.setTexture2D(N,0),U.copyTexSubImage2D(U.TEXTURE_2D,V,0,0,b.x,b.y,z,me),ge.unbindTexture()},this.copyTextureToTexture=function(b,N,V,q=0){const z=N.image.width,me=N.image.height,ye=ve.convert(V.format),we=ve.convert(V.type);T.setTexture2D(V,0),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,V.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,V.unpackAlignment),N.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,q,b.x,b.y,z,me,ye,we,N.image.data):N.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,q,b.x,b.y,N.mipmaps[0].width,N.mipmaps[0].height,ye,N.mipmaps[0].data):U.texSubImage2D(U.TEXTURE_2D,q,b.x,b.y,ye,we,N.image),q===0&&V.generateMipmaps&&U.generateMipmap(U.TEXTURE_2D),ge.unbindTexture()},this.copyTextureToTexture3D=function(b,N,V,q,z=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const me=b.max.x-b.min.x+1,ye=b.max.y-b.min.y+1,we=b.max.z-b.min.z+1,Le=ve.convert(q.format),ze=ve.convert(q.type);let Ue;if(q.isData3DTexture)T.setTexture3D(q,0),Ue=U.TEXTURE_3D;else if(q.isDataArrayTexture||q.isCompressedArrayTexture)T.setTexture2DArray(q,0),Ue=U.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,q.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,q.unpackAlignment);const Ie=U.getParameter(U.UNPACK_ROW_LENGTH),ot=U.getParameter(U.UNPACK_IMAGE_HEIGHT),zt=U.getParameter(U.UNPACK_SKIP_PIXELS),gt=U.getParameter(U.UNPACK_SKIP_ROWS),Tn=U.getParameter(U.UNPACK_SKIP_IMAGES),rt=V.isCompressedTexture?V.mipmaps[z]:V.image;U.pixelStorei(U.UNPACK_ROW_LENGTH,rt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,rt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,b.min.x),U.pixelStorei(U.UNPACK_SKIP_ROWS,b.min.y),U.pixelStorei(U.UNPACK_SKIP_IMAGES,b.min.z),V.isDataTexture||V.isData3DTexture?U.texSubImage3D(Ue,z,N.x,N.y,N.z,me,ye,we,Le,ze,rt.data):V.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),U.compressedTexSubImage3D(Ue,z,N.x,N.y,N.z,me,ye,we,Le,rt.data)):U.texSubImage3D(Ue,z,N.x,N.y,N.z,me,ye,we,Le,ze,rt),U.pixelStorei(U.UNPACK_ROW_LENGTH,Ie),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ot),U.pixelStorei(U.UNPACK_SKIP_PIXELS,zt),U.pixelStorei(U.UNPACK_SKIP_ROWS,gt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Tn),z===0&&q.generateMipmaps&&U.generateMipmap(Ue),ge.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?T.setTextureCube(b,0):b.isData3DTexture?T.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?T.setTexture2DArray(b,0):T.setTexture2D(b,0),ge.unbindTexture()},this.resetState=function(){R=0,w=0,A=null,ge.reset(),Fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Ta?"display-p3":"srgb",t.unpackColorSpace=je.workingColorSpace===cs?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===ut?ci:Wl}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===ci?ut:In}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class Zm extends fc{}Zm.prototype.isWebGL1Renderer=!0;class Jm extends St{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class ol extends dt{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Pi=new et,ll=new et,Wr=[],cl=new fi,Qm=new et,ir=new Ne,rr=new $i;class e0 extends Ne{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ol(new Float32Array(i*16),16),this.instanceColor=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,Qm)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new fi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Pi),cl.copy(e.boundingBox).applyMatrix4(Pi),this.boundingBox.union(cl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new $i),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Pi),rr.copy(e.boundingSphere).applyMatrix4(Pi),this.boundingSphere.union(rr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){const i=this.matrixWorld,r=this.count;if(ir.geometry=this.geometry,ir.material=this.material,ir.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),rr.copy(this.boundingSphere),rr.applyMatrix4(i),e.ray.intersectsSphere(rr)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Pi),ll.multiplyMatrices(i,Pi),ir.matrixWorld=ll,ir.raycast(e,Wr);for(let a=0,o=Wr.length;a<o;a++){const l=Wr[a];l.instanceId=s,l.object=this,t.push(l)}Wr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ol(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Ca extends ji{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ee(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const hl=new et,va=new Zl,Xr=new $i,qr=new D;class pc extends St{constructor(e=new Et,t=new Ca){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Xr.copy(i.boundingSphere),Xr.applyMatrix4(r),Xr.radius+=s,e.ray.intersectsSphere(Xr)===!1)return;hl.copy(r).invert(),va.copy(e.ray).applyMatrix4(hl);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){const p=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let _=p,g=m;_<g;_++){const d=c.getX(_);qr.fromBufferAttribute(f,d),ul(qr,d,l,r,e,t,this)}}else{const p=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let _=p,g=m;_<g;_++)qr.fromBufferAttribute(f,_),ul(qr,_,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function ul(n,e,t,i,r,s,a){const o=va.distanceSqToPoint(n);if(o<t){const l=new D;va.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,object:a})}}class Pa extends Bt{constructor(e,t,i,r,s,a,o,l,c){super(e,t,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class mc{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const i=this.getLengths();let r=0;const s=i.length;let a;t?a=t:a=e*i[s-1];let o=0,l=s-1,c;for(;o<=l;)if(r=Math.floor(o+(l-o)/2),c=i[r]-a,c<0)o=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===a)return r/(s-1);const u=i[r],p=i[r+1]-u,m=(a-u)/p;return(r+m)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),l=t||(a.isVector2?new Re:new D);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){const i=new D,r=[],s=[],a=[],o=new D,l=new et;for(let m=0;m<=e;m++){const _=m/e;r[m]=this.getTangentAt(_,new D)}s[0]=new D,a[0]=new D;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),f=Math.abs(r[0].y),p=Math.abs(r[0].z);u<=c&&(c=u,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),p<=c&&i.set(0,0,1),o.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let m=1;m<=e;m++){if(s[m]=s[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(r[m-1],r[m]),o.length()>Number.EPSILON){o.normalize();const _=Math.acos(vt(r[m-1].dot(r[m]),-1,1));s[m].applyMatrix4(l.makeRotationAxis(o,_))}a[m].crossVectors(r[m],s[m])}if(t===!0){let m=Math.acos(vt(s[0].dot(s[e]),-1,1));m/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(m=-m);for(let _=1;_<=e;_++)s[_].applyMatrix4(l.makeRotationAxis(r[_],m*_)),a[_].crossVectors(r[_],s[_])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function La(){let n=0,e=0,t=0,i=0;function r(s,a,o,l){n=s,e=o,t=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){r(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,u,f){let p=(a-s)/c-(o-s)/(c+u)+(o-a)/u,m=(o-a)/u-(l-a)/(u+f)+(l-o)/f;p*=u,m*=u,r(a,o,p,m)},calc:function(s){const a=s*s,o=a*s;return n+e*s+t*a+i*o}}}const Yr=new D,Ys=new La,$s=new La,js=new La;class t0 extends mc{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new D){const i=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,u;this.closed||o>0?c=r[(o-1)%s]:(Yr.subVectors(r[0],r[1]).add(r[0]),c=Yr);const f=r[o%s],p=r[(o+1)%s];if(this.closed||o+2<s?u=r[(o+2)%s]:(Yr.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=Yr),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let _=Math.pow(c.distanceToSquared(f),m),g=Math.pow(f.distanceToSquared(p),m),d=Math.pow(p.distanceToSquared(u),m);g<1e-4&&(g=1),_<1e-4&&(_=g),d<1e-4&&(d=g),Ys.initNonuniformCatmullRom(c.x,f.x,p.x,u.x,_,g,d),$s.initNonuniformCatmullRom(c.y,f.y,p.y,u.y,_,g,d),js.initNonuniformCatmullRom(c.z,f.z,p.z,u.z,_,g,d)}else this.curveType==="catmullrom"&&(Ys.initCatmullRom(c.x,f.x,p.x,u.x,this.tension),$s.initCatmullRom(c.y,f.y,p.y,u.y,this.tension),js.initCatmullRom(c.z,f.z,p.z,u.z,this.tension));return i.set(Ys.calc(l),$s.calc(l),js.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new D().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function n0(n,e){const t=1-n;return t*t*e}function i0(n,e){return 2*(1-n)*n*e}function r0(n,e){return n*n*e}function dl(n,e,t,i){return n0(n,e)+i0(n,t)+r0(n,i)}class s0 extends mc{constructor(e=new Re,t=new Re,i=new Re){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Re){const i=t,r=this.v0,s=this.v1,a=this.v2;return i.set(dl(e,r.x,s.x,a.x),dl(e,r.y,s.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class _r extends Et{constructor(e=1,t=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:r},t=Math.max(3,t);const s=[],a=[],o=[],l=[],c=new D,u=new Re;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,p=3;f<=t;f++,p+=3){const m=i+f/t*r;c.x=e*Math.cos(m),c.y=e*Math.sin(m),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[p]/e+1)/2,u.y=(a[p+1]/e+1)/2,l.push(u.x,u.y)}for(let f=1;f<=t;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new ht(a,3)),this.setAttribute("normal",new ht(o,3)),this.setAttribute("uv",new ht(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _r(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ds extends Et{constructor(e=1,t=1,i=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],f=[],p=[],m=[];let _=0;const g=[],d=i/2;let h=0;x(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new ht(f,3)),this.setAttribute("normal",new ht(p,3)),this.setAttribute("uv",new ht(m,2));function x(){const S=new D,R=new D;let w=0;const A=(t-e)/i;for(let k=0;k<=s;k++){const y=[],E=k/s,O=E*(t-e)+e;for(let W=0;W<=r;W++){const K=W/r,C=K*l+o,F=Math.sin(C),Y=Math.cos(C);R.x=O*F,R.y=-E*i+d,R.z=O*Y,f.push(R.x,R.y,R.z),S.set(F,A,Y).normalize(),p.push(S.x,S.y,S.z),m.push(K,1-E),y.push(_++)}g.push(y)}for(let k=0;k<r;k++)for(let y=0;y<s;y++){const E=g[y][k],O=g[y+1][k],W=g[y+1][k+1],K=g[y][k+1];u.push(E,O,K),u.push(O,W,K),w+=6}c.addGroup(h,w,0),h+=w}function v(S){const R=_,w=new Re,A=new D;let k=0;const y=S===!0?e:t,E=S===!0?1:-1;for(let W=1;W<=r;W++)f.push(0,d*E,0),p.push(0,E,0),m.push(.5,.5),_++;const O=_;for(let W=0;W<=r;W++){const C=W/r*l+o,F=Math.cos(C),Y=Math.sin(C);A.x=y*Y,A.y=d*E,A.z=y*F,f.push(A.x,A.y,A.z),p.push(0,E,0),w.x=F*.5+.5,w.y=Y*.5*E+.5,m.push(w.x,w.y),_++}for(let W=0;W<r;W++){const K=R+W,C=O+W;S===!0?u.push(C,C+1,K):u.push(C+1,C,K),k+=3}c.addGroup(h,k,S===!0?1:2),h+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ds(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Da extends Et{constructor(e=.5,t=1,i=32,r=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:a},i=Math.max(3,i),r=Math.max(1,r);const o=[],l=[],c=[],u=[];let f=e;const p=(t-e)/r,m=new D,_=new Re;for(let g=0;g<=r;g++){for(let d=0;d<=i;d++){const h=s+d/i*a;m.x=f*Math.cos(h),m.y=f*Math.sin(h),l.push(m.x,m.y,m.z),c.push(0,0,1),_.x=(m.x/t+1)/2,_.y=(m.y/t+1)/2,u.push(_.x,_.y)}f+=p}for(let g=0;g<r;g++){const d=g*(i+1);for(let h=0;h<i;h++){const x=h+d,v=x,S=x+i+1,R=x+i+2,w=x+1;o.push(v,S,w),o.push(S,R,w)}}this.setIndex(o),this.setAttribute("position",new ht(l,3)),this.setAttribute("normal",new ht(c,3)),this.setAttribute("uv",new ht(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Da(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Ft extends Et{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const u=[],f=new D,p=new D,m=[],_=[],g=[],d=[];for(let h=0;h<=i;h++){const x=[],v=h/i;let S=0;h===0&&a===0?S=.5/t:h===i&&l===Math.PI&&(S=-.5/t);for(let R=0;R<=t;R++){const w=R/t;f.x=-e*Math.cos(r+w*s)*Math.sin(a+v*o),f.y=e*Math.cos(a+v*o),f.z=e*Math.sin(r+w*s)*Math.sin(a+v*o),_.push(f.x,f.y,f.z),p.copy(f).normalize(),g.push(p.x,p.y,p.z),d.push(w+S,1-v),x.push(c++)}u.push(x)}for(let h=0;h<i;h++)for(let x=0;x<t;x++){const v=u[h][x+1],S=u[h][x],R=u[h+1][x],w=u[h+1][x+1];(h!==0||a>0)&&m.push(v,S,w),(h!==i-1||l<Math.PI)&&m.push(S,R,w)}this.setIndex(m),this.setAttribute("position",new ht(_,3)),this.setAttribute("normal",new ht(g,3)),this.setAttribute("uv",new ht(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ft(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class dn extends ji{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ee(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Xl,this.normalScale=new Re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class xa extends dn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Re(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return vt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ee(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ee(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ee(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class gc extends St{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ee(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Ks=new et,fl=new D,pl=new D;class a0{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Re(512,512),this.map=null,this.mapPass=null,this.matrix=new et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Aa,this._frameExtents=new Re(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;fl.setFromMatrixPosition(e.matrixWorld),t.position.copy(fl),pl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(pl),t.updateMatrixWorld(),Ks.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ks),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ks)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class o0 extends a0{constructor(){super(new ac(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ml extends gc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.target=new St,this.shadow=new o0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class l0 extends gc{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ea}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ea);const it=(n,e,t)=>n+(e-n)*t,Qt=(n,e=0,t=1)=>Math.min(t,Math.max(e,n)),ct=(n,e,t)=>{const i=Qt((t-n)/(e-n));return i*i*(3-2*i)},gl=n=>(n=Qt(n),n*n*n*(n*(n*6-15)+10));function fn(n,e,t,i,r){const s=n.computeFrenetFrames(e,!1),a=(e+1)*(t+1),o=new Float32Array(a*3),l=new Float32Array(a*3),c=r?new Float32Array(a*3):null,u=[],f=new D,p=new D;for(let _=0;_<=e;_++){const g=_/e;n.getPointAt(g,f);const d=typeof i=="function"?i(g,f):i,h=r?r(g,f):null,x=s.normals[_],v=s.binormals[_];for(let S=0;S<=t;S++){const R=S/t*Math.PI*2,w=(_*(t+1)+S)*3;if(p.set(0,0,0).addScaledVector(x,Math.cos(R)).addScaledVector(v,Math.sin(R)),l[w]=p.x,l[w+1]=p.y,l[w+2]=p.z,o[w]=f.x+p.x*d,o[w+1]=f.y+p.y*d,o[w+2]=f.z+p.z*d,c){const A=d*h.scale;c[w]=f.x+p.x*A+h.shift[0],c[w+1]=f.y+p.y*A+h.shift[1],c[w+2]=f.z+p.z*A+h.shift[2]}if(_<e&&S<t){const A=_*(t+1)+S,k=A+t+1;u.push(A,k,A+1,k,k+1,A+1)}}}const m=new Et;return m.setAttribute("position",new dt(o,3)),m.setAttribute("normal",new dt(l,3)),m.setIndex(u),c&&(m.morphAttributes.position=[new dt(c,3)],m.morphTargetsRelative=!1),m}const Kt=n=>new t0(n.map(e=>e.isVector3?e:new D(...e)),!1,"centripetal");let Zs;function c0(){if(Zs)return Zs;const n=document.createElement("canvas");n.width=n.height=64;const e=n.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);return t.addColorStop(0,"#fff"),t.addColorStop(.55,"#fff"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),Zs=new Pa(n)}function ur(n,e,t,i,r=4003360){const s=new Float32Array(e*3),a=new Et;a.setAttribute("position",new dt(s,3));const o=new Ca({size:t,color:i,map:c0(),alphaTest:.35,transparent:!0,sizeAttenuation:!0,depthWrite:!1}),l=new pc(a,o);l.frustumCulled=!1;let c=Math.random();const u=new D,f=new Ee(i),p=new Ee(r);return{points:l,mat:o,advance(m,_=1){c=((c+(Number.isFinite(m)?m:0))%1+1)%1;for(let g=0;g<e;g++)n.getPointAt((g/e+c)%1,u),s[g*3]=u.x,s[g*3+1]=u.y,s[g*3+2]=u.z;a.attributes.position.needsUpdate=!0,o.color.copy(p).lerp(f,_)}}}function Js(n,e){const t=document.createElement("canvas");t.width=t.height=n;const i=t.getContext("2d");e(i,n);const r=new Pa(t);return r.colorSpace=ut,r.anisotropy=8,r}function fs(n=1){let e=n>>>0;return()=>(e=e*1664525+1013904223>>>0)/4294967296}const ai=Math.PI/180,hi=20*ai,It=12,on=-12.25,$r=11.25,Li=11,Xi=10.75,os=.88,an=.3,vn=2,Ma=2.4,ln=12,di=-.14,h0=-.07,Dn=11,jr=.025,At=n=>.12+n*.07,Mt=n=>-.95+.1*(1-Math.min(1,(n/.9)**2)),sr=n=>n<=-.62?.88+.02*ct(-1.5,-.62,n):.9+.6*ct(-.62,.45,n),_l=n=>-1.5+.2*(1-ct(.06,.5,Math.abs(n))),Wt=(n,e)=>on+Math.sqrt(Math.max(0,n*n-e*e)),mn={lane:5,x:Mt(.478),y:(At(5)+At(6))/2};function vl(n,e,t,i,r){const s=r*r,a=s*r;return .5*(2*e+(-n+t)*r+(2*n-5*e+4*t-i)*s+(-n+3*e-3*t+i)*a)}function _c(n,e=1,t=10){const i=At(n),r=Xi+.008+n*.012,s=it(16,62,n/(Dn-1))*ai,a=i+.42,o=Math.asin(a/r),l=Wt(r,a),c=Mt(i),u=[];for(let p=0;p<5;p++){const m=it(s,o,p/4);u.push([on+r*Math.cos(m),r*Math.sin(m)])}u.push([l+.035,i+.2],[l+.14,i+.06],[l+.3,i],[c,i],[c+an,i],[-.2,i*1.25],[.45,i*1.62],[3,i*1.62],[7,i*1.62],[ln,i*1.62]);const f=[];for(let p=0;p<u.length-1;p++){const m=u[Math.max(0,p-1)],_=u[p],g=u[p+1],d=u[Math.min(u.length-1,p+2)];for(let h=0;h<t;h++){const x=h/t;f.push([vl(m[0],_[0],g[0],d[0],x),vl(m[1],_[1],g[1],d[1],x)])}}return f.push(u[u.length-1]),f.map(([p,m])=>{const _=it(.0058,.027,ct(l+.02,l+.28,p)),g=it(_,.0125,ct(c-.06,c+.02,p)),d=it(g,.047,ct(c+an-.02,c+an+.3,p)),h=ct(l-.25,l+.12,p)*(1-ct(c-.05,c+.02,p))*(m>i+.4?ct(i+.9,i+.4,m):1);return{x:p,y:m*e,r:d,bump:h,lane:n}})}function or(n,e,t=0){const i=Math.hypot(10.72,n,e),r=Xi-t;return[on+r*10.72/i,r*e/i,-r*n/i]}const en={u:3.9,v:-.3},Xe={sclera:"#e7e1d3",scleraLine:"#cfc7b6",choroid:"#8a3a2e",lumen:"#c9503f",rpe:"#3b2419",rod:"#e9bfa6",nuc:"#b58fb0",plex:"#f1d6c6",rnfl:"#f3e2a4",glia:"#efd2ba",lamina:"#dfe3ea",beam:"#8794ab",beamDark:"#66738c",myelin:"#f5ecc9",septum:"#9aa5ba",pia:"#63728d",csf:"#cfe5f3",arach:"#9fbcd4",dura:"#b8b0a2",duraLine:"#9c9486",cupBack:"#a9532a",bundle:"#eedc98",bundleEdge:"#cdb96e",axon:"#b79f52",cornea:"#bfdfe8",astro:"#7d5a9a",endo:"#a8322c"},Oi=(n,e,t,i,r,s=96)=>{for(let a=0;a<=s;a++){const o=i+(r-i)*a/s;n.lineTo(e+t*Math.cos(o),t*Math.sin(o))}};function Qs(n,e,t,i,r,s,a){n.beginPath(),Oi(n,e,t,s,a),Oi(n,i,r,a,s),n.closePath()}function u0(n,e,t,i){const r=e/t.w;n.setTransform(r,0,0,-r,-t.x*r,(t.y+t.w)*r);const s=1.3/r,a=r>100,o=r>1100,l=r>4e3,c=fs(7),u=Math.PI-Math.acos(Math.cos(29.4*ai)/Math.cos(hi)),f=g=>Math.asin((os+.02)/g);for(const g of[1,-1]){if(n.save(),n.scale(1,g),n.fillStyle=Xe.sclera,Qs(n,-It,It,on,$r,0,u),n.fill(),r>40){n.strokeStyle=Xe.scleraLine,n.lineWidth=Math.max(s,.02);for(let h=1;h<5;h++)n.beginPath(),Oi(n,-It-.05*h,It-.2*h+.05*h,.01,u*.98),n.stroke()}if(n.fillStyle=Xe.choroid,Qs(n,on,$r,on,Li,f($r),2.55),n.fill(),r>40){n.fillStyle=Xe.lumen;for(let h=f($r)+.012;h<2.5;h+=.03){const x=Li+.09+.08*c();n.beginPath(),n.ellipse(on+x*Math.cos(h),x*Math.sin(h),.07,.035+.02*c(),h+Math.PI/2,0,7),n.fill()}}const d=r>40?[[Li,Xe.rod],[10.93,Xe.nuc],[10.89,Xe.plex],[10.87,Xe.nuc],[10.84,Xe.plex],[10.8,Xe.nuc],[10.785,Xe.rnfl]]:[[Li,Xe.rod]];d.forEach(([h,x],v)=>{const S=v+1<d.length?d[v+1][0]:Xi;n.fillStyle=x,Qs(n,on,h,on,S,f(h),2.35),n.fill()}),n.strokeStyle=Xe.rpe,n.lineWidth=Math.max(s,.014),n.beginPath(),Oi(n,on,Li,f(Li),2.45),n.stroke(),n.restore()}{const d=5.35*Math.sin(hi),h=-It-5.35*Math.cos(hi),x=Math.sqrt(7.8**2-d**2),v=Math.sqrt(7.25**2-d**2),S=-It+It*Math.cos(u),R=It*Math.sin(u),w=Math.atan2(R,S-h);n.fillStyle=Xe.cornea,n.beginPath(),Oi(n,h,x,w,2*Math.PI-w,48),Oi(n,h,v,2*Math.PI-w+.04,w-.04,48),n.closePath(),n.fill()}const p=[];for(let g=-.62;g<=ln;g+=.04)p.push(g);for(const g of[1,-1]){if(n.save(),n.scale(1,g),n.fillStyle=Xe.dura,n.fillRect(-.3,vn,ln+.3,Ma-vn),a){n.strokeStyle=Xe.duraLine,n.lineWidth=Math.max(s,.012);for(let d=1;d<4;d++)n.beginPath(),n.moveTo(-.2,vn+d*.1),n.lineTo(ln,vn+d*.1),n.stroke()}n.fillStyle=Xe.csf,n.beginPath(),n.moveTo(ln,vn),n.lineTo(.05,vn),n.quadraticCurveTo(-.22,vn-.05,-.2,1.62);for(const d of p)d>-.2&&n.lineTo(d,sr(d)+.05);if(n.closePath(),n.fill(),a){n.strokeStyle=Xe.arach,n.lineWidth=Math.max(s,.01);for(let d=.3;d<ln;d+=.33)n.beginPath(),n.moveTo(d,sr(d)+.05),n.lineTo(d+.12*(c()-.3),vn-.03),n.stroke();n.beginPath(),n.moveTo(.05,vn-.04),n.lineTo(ln,vn-.04),n.stroke()}n.restore()}const m=(g,d)=>{n.beginPath();const h=60,x=.89;for(let v=0;v<=h;v++){const S=-x+2*x*v/h;n.lineTo(g(S),S)}for(let v=h;v>=0;v--){const S=-x+2*x*v/h;n.lineTo(d(S),S)}n.closePath()};n.fillStyle=Xe.cupBack,m(g=>Wt(Xi,g)-.01,_l),n.fill(),n.fillStyle=Xe.glia,m(_l,Mt),n.fill(),n.fillStyle=Xe.lamina,m(Mt,g=>Mt(g)+an),n.fill(),n.fillStyle=Xe.myelin,n.beginPath();for(let g=0;g<=40;g++){const d=-.9+1.8*g/40;n.lineTo(Mt(d)+an,d)}for(const g of p)n.lineTo(g,sr(g));for(const g of[...p].reverse())n.lineTo(g,-sr(g));n.closePath(),n.fill(),n.strokeStyle=Xe.pia,n.lineWidth=Math.max(s,.03);for(const g of[1,-1]){n.beginPath();for(const d of p)n.lineTo(d,g*(sr(d)+.02));n.stroke()}const _=[];for(const g of[1,-1])for(let d=0;d<Dn;d++)_.push(_c(d,g,8));if(r>30)for(const g of _){n.beginPath();const d=[];g.forEach((h,x)=>{const v=g[Math.min(g.length-1,x+1)],S=g[Math.max(0,x-1)],R=v.x-S.x,w=v.y-S.y,A=Math.hypot(R,w)||1,k=-w/A*h.r,y=R/A*h.r;n.lineTo(h.x+k,h.y+y),d.push([h.x-k,h.y-y])});for(const[h,x]of d.reverse())n.lineTo(h,x);n.closePath(),n.fillStyle=Xe.bundle,n.fill(),a&&(n.strokeStyle=Xe.bundleEdge,n.lineWidth=s,n.stroke())}if(a){n.strokeStyle=Xe.septum,n.lineWidth=Math.max(s,.008);for(const g of[1,-1])for(let d=0;d<Dn-1;d++){const h=(At(d)+At(d+1))/2;n.beginPath();for(let x=Mt(h)+an;x<=ln;x+=.06){const v=1+.25*Math.min(1,Math.max(0,(x+.55)/.35))+.37*Math.min(1,Math.max(0,(x+.2)/.65));n.lineTo(x,g*h*v)}n.stroke()}}if(r>30){const g=a?7:4;for(const d of[1,-1]){for(let h=0;h<g;h++){const x=.02+(an-.04)*h/(g-1);n.strokeStyle=h%2?Xe.beam:Xe.beamDark,n.lineWidth=Math.max(s,a?.02:.04);for(let v=-1;v<Dn;v++){const S=v<0?.075:At(v)+jr/2,R=v+1<Dn?At(v+1)-jr/2:.9;n.beginPath();for(let w=0;w<=6;w++){const A=S+(R-S)*w/6;n.lineTo(Mt(A)+x,d*A)}n.stroke()}}n.strokeStyle=Xe.beamDark,n.lineWidth=Math.max(s,.02),n.beginPath(),n.moveTo(Mt(.9),d*.9),n.lineTo(Mt(.9)+an,d*.9),n.stroke()}}if(o){for(const g of[1,-1])for(let d=0;d<Dn-1;d++){const h=(At(d)+At(d+1))/2,x=Mt(h);n.strokeStyle=Xe.endo,n.lineWidth=.009,n.lineCap="round",n.beginPath(),n.moveTo(x-.3,g*h),n.lineTo(x+an*.9,g*h),n.stroke(),n.strokeStyle="#f7d9d2",n.lineWidth=.0066,n.beginPath(),n.moveTo(x-.3,g*h),n.lineTo(x+an*.9,g*h),n.stroke(),n.lineCap="butt",n.fillStyle=Xe.astro;for(let v=x-.29;v<x-.01;v+=.034){const S=c()>.5?1:-1;n.beginPath(),n.ellipse(v+.01*c(),g*(h+S*.0105),.0042,.0024,0,0,7),n.fill()}}n.strokeStyle="rgba(70,82,110,0.35)",n.lineWidth=Math.max(s,.0012);for(const g of[1,-1])for(let d=0;d<Dn-1;d++){const h=At(d)+jr/2+.001,x=At(d+1)-jr/2-.001;for(let v=.01;v<an;v+=.012)n.beginPath(),n.moveTo(Mt(h)+v,g*h),n.lineTo(Mt(x)+v+.004,g*x),n.stroke()}}if(l){n.strokeStyle=Xe.axon,n.lineWidth=5e-4;for(const g of _)for(let d=-4;d<=4;d++)n.beginPath(),g.forEach((h,x)=>{if(h.x<t.x-.05||h.x>t.x+t.w+.05)return;const v=g[Math.min(g.length-1,x+1)],S=g[Math.max(0,x-1)],R=v.x-S.x,w=v.y-S.y,A=Math.hypot(R,w)||1;n.lineTo(h.x-w/A*h.r*d/4.6,h.y+R/A*h.r*d/4.6)}),n.stroke()}if(i){const g=i.w*.012;n.clearRect(i.x+g,i.y+g,i.w-2*g,i.w-2*g)}n.setTransform(1,0,0,1,0,0)}const xl=[{x:-26,y:-20,w:40},{x:-3.6,y:-4,w:8},{x:-1.75,y:-.25,w:1.5},{x:-1.03,y:.355,w:.3}],Ml=new Ee(15850900),d0=new Ee(16174518),f0=new Ee(9277336),xn=14169900,ea=4021419;function p0(n,e,t,i,r){const s=n.length,a=t+1,o=new Float32Array(s*a*3),l=new Float32Array(s*a*3),c=new Float32Array(s*a*3),u=[];n.forEach((p,m)=>{const _=n[Math.max(0,m-1)],g=n[Math.min(s-1,m+1)],d=g.x-_.x,h=g.y-_.y,x=Math.hypot(d,h)||1,v=-h/x,S=d/x,R=i(p);for(let w=0;w<=t;w++){const A=w/t*Math.PI*2,k=Math.cos(A),y=Math.sin(A),E=(m*a+w)*3;o[E]=p.x+v*k*p.r,o[E+1]=p.y+S*k*p.r,o[E+2]=e+y*p.r;const O=p.r*R.scale;l[E]=p.x+R.dx+v*k*O,l[E+1]=p.y+R.dy+S*k*O,l[E+2]=e+y*Math.min(O,.066);const W=p.r*r;if(c[E]=p.x+v*k*W,c[E+1]=p.y+S*k*W,c[E+2]=e+y*W,m<s-1&&w<t){const K=m*a+w;u.push(K,K+a,K+1,K+a,K+a+1,K+1)}}});const f=new Et;return f.setAttribute("position",new dt(o,3)),f.setIndex(u),f.computeVertexNormals(),f.morphAttributes.position=[new dt(l,3),new dt(c,3)],f}function m0(n,e){const t=fs(11),i=e/34,r=e/2-en.u/2*i,s=e/2,a=u=>r+u*i,o=u=>s-u*i,l=n.createRadialGradient(e/2,e/2,e*.03,e/2,e/2,e*.5);l.addColorStop(0,"#d9662d"),l.addColorStop(.6,"#bd4d21"),l.addColorStop(1,"#8a3214"),n.fillStyle=l,n.fillRect(0,0,e,e);for(let u=0;u<2600;u++){n.fillStyle=t()<.5?"rgba(255,170,90,0.03)":"rgba(70,15,5,0.035)";const f=t()*7,p=e*.44*Math.sqrt(t());n.beginPath(),n.arc(e/2+p*Math.cos(f),e/2+p*Math.sin(f),(.1+.45*t())*i,0,7),n.fill()}const c=n.createRadialGradient(a(en.u),o(en.v),0,a(en.u),o(en.v),1.9*i);c.addColorStop(0,"rgba(70,14,6,0.8)"),c.addColorStop(.25,"rgba(70,14,6,0.45)"),c.addColorStop(1,"rgba(70,14,6,0)"),n.fillStyle=c,n.fillRect(0,0,e,e)}function g0(n,e,t){const i=e/2,r=e*(os/2.6);n.clearRect(0,0,e,e);const s=t.swelling,a=t.pallor;if(s>.01){const f=n.createRadialGradient(i,i-r*.3,r*.5,i,i-r*.3,r*1.4);f.addColorStop(0,`rgba(238,122,92,${.92*s})`),f.addColorStop(1,"rgba(238,122,92,0)"),n.fillStyle=f,n.fillRect(0,0,e,e)}const o=n.createRadialGradient(i,i,0,i,i,r);o.addColorStop(0,"#ee9a68"),o.addColorStop(.8,"#e17f4a"),o.addColorStop(1,"#d56a38"),n.fillStyle=o,n.beginPath(),n.arc(i,i,r,0,7),n.fill(),n.save(),n.beginPath(),n.arc(i,i,r*(1+.24*s),0,7),n.clip();const l=n.createLinearGradient(0,i-r,0,i+r*.25);l.addColorStop(0,`rgba(226,84,60,${.7*s*(1-a)})`),l.addColorStop(1,"rgba(226,84,60,0)"),n.fillStyle=l,n.fillRect(0,0,e,e);const c=n.createLinearGradient(0,i-r,0,i+r*.2);c.addColorStop(0,`rgba(248,244,230,${.95*a})`),c.addColorStop(.7,`rgba(248,244,230,${.9*a})`),c.addColorStop(1,"rgba(248,244,230,0)"),n.fillStyle=c,n.fillRect(0,0,e,e),n.restore(),n.fillStyle="rgba(255,240,205,0.92)",n.beginPath(),n.arc(i,i,r*.17*(1-.6*s),0,7),n.fill();const u=s*(1-a);if(u>.01){n.strokeStyle=`rgba(150,12,18,${.85*u})`,n.lineCap="round";for(const[f,p,m]of[[-2.25,.3,.075],[-1.5,.22,.06],[-.85,.27,.07]])n.lineWidth=m*r,n.beginPath(),n.moveTo(i+Math.cos(f)*r*.97,i+Math.sin(f)*r*.97),n.lineTo(i+Math.cos(f)*r*(1+p),i+Math.sin(f)*r*(1+p)),n.stroke()}}function _0(n,e){const t=new pn,i={clippingPlanes:[n]},r=L=>new dn({roughness:.6,...L}),s=new D(-Math.cos(hi),0,Math.sin(hi)),a=new En().setFromUnitVectors(new D(0,1,0),s),o=29.4*ai,l=new Ft(It,96,64,0,Math.PI*2,o,Math.PI-o);l.applyQuaternion(a),l.translate(-It,0,0),t.add(new Ne(l,r({color:15525594,roughness:.45,...i})));const c=new Ft(11.3,64,48);c.translate(-12.1,0,0),t.add(new Ne(c,new yn({color:2823953,side:Ct,...i})));const u=new Ft(Xi,128,96,0,Math.PI*2,52*ai,Math.PI-52*ai);u.applyQuaternion(a);{const L=u.attributes.position,Q=u.attributes.uv;for(let le=0;le<L.count;le++){const re=Math.max(L.getX(le),.4),j=-L.getZ(le)/re*10.72,fe=L.getY(le)/re*10.72;Q.setXY(le,.5+(j-en.u/2)/34,.5+fe/34)}}u.translate(on,0,0),t.add(new Ne(u,new yn({map:Js(e?1024:2048,m0),side:Ct,...i})));const f=new pn;f.quaternion.copy(a),f.position.set(-It,0,0),t.add(f);const p=new Ne(new Ft(7.8,64,24,0,Math.PI*2,0,49.1*ai),new xa({color:13625584,roughness:.05,transparent:!0,opacity:.3,depthWrite:!1,...i}));p.position.y=5.35,p.renderOrder=2;const m=Js(256,(L,Q)=>{const le=fs(5);L.fillStyle="#4f7391",L.fillRect(0,0,Q,Q),L.translate(Q/2,Q/2);for(let re=0;re<260;re++)L.rotate(le()*7),L.strokeStyle=le()<.5?"rgba(20,40,60,0.35)":"rgba(190,215,230,0.3)",L.lineWidth=1+le()*1.5,L.beginPath(),L.moveTo(Q*.14,0),L.lineTo(Q*.5,0),L.stroke()}),_=new Ne(new Da(1.7,5.95,64),new dn({map:m,side:Zt,roughness:.7,...i}));_.rotation.x=-Math.PI/2,_.position.y=9.55;const g=new Ne(new _r(1.75,40),new yn({color:328966,...i}));g.rotation.x=-Math.PI/2,g.position.y=9.5;const d=new Ft(1,48,32);d.scale(4.5,1.9,4.5);const h=new Ne(d,new xa({color:15656642,roughness:.15,transparent:!0,opacity:.55,side:Zt,depthWrite:!1,...i}));h.position.y=7.3,h.renderOrder=1,f.add(p,_,g,h);const x=new ds(Ma,Ma,ln+.2,48,1,!0);x.rotateZ(-Math.PI/2),x.translate((ln-.2)/2,0,0),t.add(new Ne(x,r({color:12432807,side:Zt,...i})));const v=(L,Q,le)=>new D(...or(L,Q,le)),S={a:r({color:xn,roughness:.5,...i}),v:r({color:8132128,roughness:.5,...i})},R=[],w=L=>.03+.07*(1-ct(.7,1.4,L)),A=(L,Q,le)=>{const re=Kt(L.map(([j,fe])=>v(j,fe,w(Math.hypot(j,fe))+Q)));if(t.add(new Ne(fn(re,64,6,j=>Q*(1-.45*j)),S[le])),le==="a"){const j=ur(re,12,Q*2.6,16761518);j.mat.clippingPlanes=[n],t.add(j.points),R.push(j)}};for(const L of[1,-1]){const Q=[[.05,.12],[.3,.75],[1.3,2.3],[3.2,3.4],[5.6,3.3],[8,2.3],[10,.9]].map(([re,j])=>[re,j*L]),le=[[-.05,.12],[-.4,.8],[-1.5,2.1],[-3.4,3.1],[-6,3.7],[-8.5,3.6]].map(([re,j])=>[re,j*L]);for(const re of[Q,le]){A(re,.05,"a"),A(re.map(([U,qe],pe)=>[U+(pe?.16:.1)*(re===Q?1:-1),qe+(pe?.2*L:0)]),.065,"v");const[j,fe]=re[3];A([[j,fe],[j*1.05,fe+1.1*L],[j*1.2,fe+2.6*L]],.03,"a"),A([[re[2][0],re[2][1]],[re[2][0]*1.6,re[2][1]-.6*L],[re[2][0]*2.4,re[2][1]-1*L]],.026,"a")}}const k={},y=new Ee(16771496),E=new Ee(5917252);for(const L of["sup","inf"]){const Q=L==="sup"?1:-1,le=k[L]=new yn({color:y,transparent:!0,opacity:.3,depthWrite:!1,...i}),re=46;for(let j=0;j<re;j++){const fe=.06+j/(re-1)*(Math.PI-.1),U=new Re(Math.cos(fe)*os,Math.sin(fe)*os),qe=new Re(Math.cos(fe),Math.sin(fe));let pe,xe;if(fe<.3)xe=new Re(en.u-.4,.05+fe*.6),pe=U.clone().lerp(xe,.5);else if(fe<1.25){const be=(fe-.3)/.95;xe=new Re(en.u+.45+4.6*be,.05),pe=new Re((U.x+xe.x)/2-.5,1+3.4*be)}else if(fe<2.05){const be=(fe-1.25)/.8;xe=new Re(it(9.5,0,be),it(2,8,be)),pe=U.clone().addScaledVector(qe,2.2).add(new Re(1.6*(1-be),2))}else xe=U.clone().addScaledVector(qe,6.5),pe=U.clone().lerp(xe,.5);const ge=new s0(U,pe,xe),Ke=new Ne(fn(Kt(ge.getPoints(20).map(be=>v(be.x,be.y*Q,.012))),24,4,.016),le);Ke.renderOrder=1,t.add(Ke)}}const O=document.createElement("canvas");O.width=O.height=512;const W=O.getContext("2d"),K=new Pa(O);K.colorSpace=ut;const C=new Ne(new gr(2.6,2.6),new yn({map:K,transparent:!0,depthWrite:!1}));C.rotation.y=-Math.PI/2,C.position.set(-1.555,0,0),C.renderOrder=2,t.add(C);const F=new pn;t.add(F);const Y=xl.map((L,Q)=>{const le=Js(e?1024:2048,(fe,U)=>u0(fe,U,L,xl[Q+1])),re=new yn({map:le,transparent:!0,alphaTest:.5}),j=new Ne(new gr(L.w,L.w),re);return j.position.set(L.x+L.w/2,L.y+L.w/2,di+Q*.0012),F.add(j),re}),I=[];for(const L of[1,-1])for(let Q=0;Q<Dn;Q++){const le=_c(Q,L,10),re=p0(le,h0,8,U=>L>0?{scale:1+1.3*U.bump,dx:-U.bump*(.1+.011*(Dn-1-Q)),dy:U.bump*.013*Q}:{scale:1+.22*U.bump,dx:-U.bump*.02,dy:0},.5),j=r({color:Ml,roughness:.55,transparent:!0}),fe=new Ne(re,j);F.add(fe),I.push({mesh:fe,mat:j,upper:L>0,lane:Q})}const B=[],H=(L,Q,le,re,j,fe=-.036)=>{const U=Kt(L.map(ge=>[ge[0],ge[1],ge[2]??fe])),qe=r({color:le,roughness:.45,transparent:!0,emissive:le,emissiveIntensity:Q<.02?.55:.12}),pe=new Ne(fn(U,Math.max(24,L.length*10),8,Q),qe);F.add(pe);const xe=j?ur(U,j,Q*1.5,le===ea?12175615:16765122):null;xe&&(xe.points.renderOrder=4,xe.mat.depthTest=!1,F.add(xe.points)),B.push({mesh:pe,mat:qe,f:xe,role:re,base:new Ee(le),len:U.getLength()})},X=Xi-.06;H([[12.4,-3.6],[10.6,-2.75],[9.6,-1.7],[8.7,-.55],[7.8,-.07],[4,-.06],[0,-.055],[-.9,-.05],[-1.3,-.05]],.055,xn,"cra",26),H([[12.9,-3.6,-.1],[11.1,-2.75,-.1],[10.1,-1.7,-.1],[9.2,-.5,-.1],[8.3,.06,-.1],[4,.07,-.1],[0,.065,-.1],[-.9,.06,-.1],[-1.28,.06,-.1]],.066,ea,"crv",0);for(const L of[1,-1]){H([[-1.3,-.05],[-1.44,.1*L],[-1.56,.42*L],[-1.6,.9*L],[Wt(X,1.6)-.02,1.6*L],[Wt(X,2.6),2.6*L],[Wt(X,4),4*L]],.04,xn,"cra",10),H([[-1.28,.06,-.1],[-1.4,.2*L,-.1],[-1.52,.5*L,-.1],[-1.57,1*L,-.1],[Wt(X,1.7)-.02,1.7*L,-.1],[Wt(X,3),3*L,-.1]],.048,ea,"crv",0);const Q=L>0?"sector":"other";H([[14.5,2.4,-3.8],[12.6,L>0?3:-.4,L>0?-2.2:-3.6],[11,2.75*L,-1.2],[8.5,3.15*L,-.12],[6,3.15*L],[2,3.08*L],[.3,3.05*L],[-.3,2.9*L],[-.62,2.4*L],[-.75,1.8*L],[-.75,1.38*L]],.04,xn,Q+"-trunk",28),H([[-.75,1.38*L],[-.8,1.08*L],[Mt(.8)+.15,.82*L],[Mt(.5)+.15,.5*L],[Mt(.2)+.15,.2*L]],.013,xn,Q,9),H([[-.75,1.38*L],[-.95,1.32*L],[-1.14,1.16*L],[-1.2,.99*L],[-1.22,.8*L],[-1.2,.5*L],[-1.18,.24*L]],.012,xn,Q,9),H([[-.75,1.38*L],[-.55,1.22*L],[-.3,1.075*L],[.5,1.54*L],[2,1.545*L],[5,1.545*L]],.012,xn,L>0?"sector-pial":"other",14),H([[.6,1.54*L],[.75,1.1*L],[.85,.6*L]],.009,xn,L>0?"sector-pial":"other",4),H([[2.2,1.545*L],[2.35,1.1*L],[2.45,.55*L]],.009,xn,L>0?"sector-pial":"other",4)}const Z=new pn;t.add(Z);const se=r({color:xn,roughness:.5,...i}),$=[],J={lat:[14.5,2.4,-3.8],med:[14.5,2.4,3.8]};for(let L=0;L<14;L++){const Q=(L+.5)/14*Math.PI*2,le=Math.cos(Q),re=Math.sin(Q);if(Math.abs(re)<.2)continue;const j=2.75+.9*(L*7%5)/4,fe=re<0?J.lat:J.med,U=[-It+Math.sqrt(It*It-j*j)+.03,j*le,j*re],qe=Kt([fe,[11.5,2.9*le+.5,3.3*re],[7,3*le,3*re],[2,j*le,j*re],U]);Z.add(new Ne(fn(qe,48,6,.04),se));const pe=ur(qe,16,.09,16765122);pe.mat.clippingPlanes=[n],Z.add(pe.points),$.push(pe)}new Ee;let ue="";return{group:t,section:F,trunks:J,update(L,Q){F.visible=L.plate>.01;for(const j of Y)j.opacity=L.plate;const le=L.plate*(1-L.micro);for(const j of I){const fe=j.upper?1:0;j.mesh.morphTargetInfluences[0]=L.swelling*(j.upper?1:.8),j.mesh.morphTargetInfluences[1]=L.atrophy*fe,j.mat.color.copy(Ml).lerp(d0,L.swelling*(j.upper?1:.25)).lerp(f0,Math.max(L.atrophy,L.pallor,.35*L.damage)*fe*.9),j.mat.opacity=le,j.mesh.visible=le>.01}for(const j of B){const fe=j.role.startsWith("sector"),U=j.role==="sector"?L.flow:j.role==="sector-trunk"?it(L.flow,L.flowAll,.5):j.role==="sector-pial"?it(L.flow,L.flowAll,.4):j.role==="cra"?1:L.flowAll,qe=ct(.05,.6,U);j.mat.color.copy(j.base).multiplyScalar(fe?.4+.6*qe:1),j.mat.emissive.copy(j.mat.color);const pe=j.role!=="cra"&&j.role!=="crv"&&!j.role.endsWith("trunk");j.mat.opacity=L.plate*(pe?1-L.micro:1),j.mesh.visible=j.mat.opacity>.01,j.f&&(j.f.points.visible=j.mesh.visible,j.f.advance(Q*.9*U/j.len,qe),j.f.mat.opacity=j.mat.opacity)}for(const j of R)j.advance(Q*.05);for(const j of $)j.advance(Q*.06*L.flowAll,ct(.2,.9,L.flowAll));k.sup.color.copy(y).lerp(E,L.damage),k.sup.opacity=it(.3,.22,L.damage),C.visible=L.cap>.01,C.material.opacity=L.cap,C.scale.setScalar(1+.1*L.swelling);const re=[L.swelling,L.pallor].map(j=>j.toFixed(3)).join();C.visible&&re!==ue&&(ue=re,g0(W,512,L),K.needsUpdate=!0)}}}const Kr=.001,Ot=mn.x,Di=mn.y,ar=Ot-.31,ta=Ot+.27,v0=n=>it(.027,.0125,ct(Ot-.06,Ot+.02,n)),Zr=n=>ct(Ot-.115,Ot-.05,n)*(1-ct(Ot-.012,Ot+.004,n));function x0(){const n=new pn,e=new dn({color:9400098,emissive:9400098,emissiveIntensity:.45,roughness:.5,transparent:!0}),t=[],i=[];for(const R of[mn.lane,mn.lane+1]){const w=At(R),A=R===mn.lane?1:-1;for(let k=0;k<2;k++)for(let E=0;E<12;E++){const O=(E+(k?.5:0))/11.5*2-1,W=di+.02-k*.0034,K=B=>w+O*v0(B),C=[];for(let B=0;B<=34;B++){const H=it(ar,ta,B/34);C.push([H,K(H),W])}const F=Kt(C),Y=fn(F,110,6,.5*Kr,(B,H)=>{const X=Zr(H.x);return{scale:1+2.1*X,shift:[0,X*(O*.0045+A*.0032),0]}}),I=new Ne(Y,e);if(n.add(I),t.push(I),k===0)for(let B=0;B<8;B++)i.push({path:K,f:O,toSeptum:A,z:W+7e-4,phase:Math.random(),dir:B%3===0?-1:1,speed:.6+.8*Math.random(),pileAt:Ot-.012-.06*Math.random()**1.6,x0:Ot-.2,x1:Ot+.2})}}const r=new Float32Array(i.length*3),s=new Et;s.setAttribute("position",new dt(r,3));const a=new Ca({size:2.3*Kr,color:749455,transparent:!0,depthTest:!1,sizeAttenuation:!0}),o=new pc(s,a);o.frustumCulled=!1,o.renderOrder=6,n.add(o);const l=di+.0185,c=Kt([[ar,Di,l],[Ot-.08,Di,l],[Ot,Di,l],[ta,Di,l]]),u=new dn({color:12730682,roughness:.4,transparent:!0,depthWrite:!1}),f=new Ne(fn(c,80,12,4*Kr,(R,w)=>({scale:1-.74*Zr(w.x),shift:[0,0,0]})),u);f.renderOrder=5,n.add(f);const p=11,m=new Ft(3.6*Kr,16,12),_=new dn({color:14693675,roughness:.5,transparent:!0}),g=new e0(m,_,p);g.renderOrder=4,n.add(g);const d=Array.from({length:p},(R,w)=>w/p),h=new et,x=new En,v=new D,S=new D;return{group:n,anchor:{x:Ot,y:Di},update(R,w){const A=R.micro*R.plate;if(n.visible=A>.01,!n.visible)return;e.opacity=.9*A,u.opacity=.42*A,_.opacity=A,a.opacity=A;for(const E of t)E.morphTargetInfluences[0]=R.swelling;f.morphTargetInfluences[0]=R.swelling,i.forEach((E,O)=>{E.phase=(E.phase+Math.max(0,w)*.05*E.speed*(1-R.stasis))%1;const W=it(E.x0,E.x1,E.dir>0?E.phase:1-E.phase),K=it(W,E.pileAt,R.stasis),C=Zr(K)*R.swelling;r[O*3]=K,r[O*3+1]=E.path(K)+C*(E.f*.0045+E.toSeptum*.0032)+(O%3-1)*2e-4*(1+3*C),r[O*3+2]=E.z}),s.attributes.position.needsUpdate=!0;const k=ta-ar,y=(Ot-.118-ar)/k;for(let E=0;E<p;E++){let O=d[E]+Math.max(0,w)*.11*R.flow;R.swelling>.55&&d[E]<=y&&O>y-.02*(E*5%4)&&(O=d[E]),d[E]=O%1;const W=ar+d[E]*k,K=1-.7*Zr(W)*R.swelling;h.compose(v.set(W,Di,l),x,S.set(.42+.5*(1-K),K,1)),g.setMatrixAt(E,h)}g.instanceMatrix.needsUpdate=!0}}}const yl=[[105,0,-85,-85],[99,36,-50,-126],[84,59,-15,-160],[60,72,6,-180],[32,75,12,-186],[6,73,9,-182],[-22,69,11,-168],[-48,63,13,-142],[-72,54,11,-112],[-97,38,7,-72],[-111,19,-6,-46],[-116,0,-30,-30]];function M0(n){const e=yl.length-1,t=Math.min(e-1e-6,n*e),i=Math.floor(t),r=t-i,s=a=>yl[Math.min(e,Math.max(0,a))];return[0,1,2,3].map(a=>{const o=s(i-1)[a],l=s(i)[a],c=s(i+1)[a],u=s(i+2)[a];return .5*(2*l+(-o+c)*r+(2*o-5*l+4*c-u)*r*r+(-o+3*l-3*c+u)*r*r*r)})}function y0(){const t=[],i=[],r=(a,o)=>Math.exp(-(a*a+o*o));for(let a=0;a<=80;a++){let[o,l,c,u]=M0(a/80);l=Math.max(0,l);const f=(c+u)/2,p=(c-u)/2;for(let m=0;m<=96;m++){const _=m/96*Math.PI*2,g=Math.sin(_),d=Math.cos(_),h=.8,x=l*Math.sign(g)*Math.abs(g)**h;let v=f+p*Math.sign(d)*Math.abs(d)**h;if(d>0){const S=ct(0,.5,d);v+=S*(23*r(x/10.5,(o+21)/18)+7*r(x/8,(o+1)/15)),v-=S*4.5*r((Math.abs(x)-32)/15,(o-1)/11),v+=S*4*r(x/46,(o-17)/7),v+=S*(3.5*r(x/19,(o+60)/5)+5*r(x/18,(o+96)/12))}if(t.push(x,o,v),a<80&&m<96){const S=a*97+m;i.push(S,S+96+1,S+1,S+1,S+96+1,S+96+2)}}}const s=new Et;return s.setAttribute("position",new ht(t,3)),s.setIndex(i),s.computeVertexNormals(),s}function Sl(n,e){return new jn({transparent:!0,uniforms:{uGlass:{value:0},uSolid:{value:new Ee(n)},uRim:{value:new Ee(e)},uAlpha:{value:1}},vertexShader:`varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalMatrix * normal; vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform float uGlass, uAlpha; uniform vec3 uSolid, uRim; varying vec3 vN; varying vec3 vV;
      void main(){
        vec3 n = normalize(vN); vec3 v = normalize(vV);
        float ndv = abs(dot(n, v));
        float fres = pow(1.0 - ndv, 2.2);
        float lit = 0.42 + 0.58 * max(dot(n, normalize(vec3(0.35, 0.6, 0.72))), 0.0);
        vec3 col = mix(uSolid * lit, uRim * (0.45 + 0.9 * fres), uGlass);
        float a = mix(1.0, 0.03 + 0.5 * fres, uGlass) * uAlpha;
        gl_FragColor = vec4(col, a);
        #include <colorspace_fragment>
      }`})}function S0(n,e,t){const i=new pn,r=(I,B,H)=>new D(I,B,H),s=Sl(13350820,11124968),a=new yn({colorWrite:!1,transparent:!0}),o=(I,B)=>{for(const[H,X]of[[a,20],[s,21]]){const Z=new Ne(I,H);Z.renderOrder=X,B&&Z.position.copy(B),i.add(Z)}};o(y0()),o(new ds(52,60,110,48),r(0,-150,-98));for(const I of[-1,1]){const B=new Ft(1,24,18);B.scale(7,30,17),o(B,r(I*76,-6,-92))}const l=new Ft(1,48,36);l.scale(66,52,82);const c=Sl(14196904,15182262);c.depthWrite=!1,c.uniforms.uGlass.value=1;const u=new Ne(l,c);u.position.set(0,38,-88),u.renderOrder=10,i.add(u);const f=new pn;f.position.set(32,0,0);const p=new Ft(12,48,32,0,Math.PI*2,.513,Math.PI-.513);p.rotateX(Math.PI/2),f.add(new Ne(p,new dn({color:15525594,roughness:.45})));const m=new Ne(new _r(5.95,40),new dn({color:5206929}));m.position.z=9.55;const _=new Ne(new _r(1.75,32),new yn({color:328966}));_.position.z=9.6;const g=new Ne(new Ft(7.8,40,16,0,Math.PI*2,0,.857),new xa({color:13625584,roughness:.05,transparent:!0,opacity:.3,depthWrite:!1}));g.rotation.x=Math.PI/2,g.position.z=5.35,f.add(m,_,g),i.add(f);const d=new Ee(15783048),h=new Ee(9277336),x=n(t),v=n([t[0]+7,.6,0]),S=I=>{const B=I<0?x.clone():r(-x.x,x.y,x.z),H=I<0?v.clone():r(-v.x,v.y,v.z);return[B,H,r(I*14,3,-40),r(I*9.5,6.5,-49),r(I*2.5,10,-60)]},R=I=>[r(I*2.5,10,-64),r(I*12,9,-72),r(I*24,8,-84),r(I*27,8.5,-89)],w=I=>[r(I*27,8.5,-89),r(I*37,14,-110),r(I*31,22,-150),r(I*13,20,-170)],A={},k=I=>new dn({roughness:.5,...I});for(const I of[-1,1]){A[I]=k({color:I<0?12432807:d});const B=S(I);I>0&&B.unshift(r(32-4.1,0,-11.3)),i.add(new Ne(fn(Kt(B),48,12,I<0?2.4:2.2),A[I])),i.add(new Ne(fn(Kt(R(I)),40,10,1.9),k({color:15125380}))),i.add(new Ne(fn(Kt(w(I)),48,8,Z=>1.4+2.2*Math.sin(Z*Math.PI)),k({color:14270602,transparent:!0,opacity:.85})));const H=new Ne(new Ft(4,20,16),k({color:13081198}));H.position.copy(r(I*27,8.5,-89)),i.add(H);const X=new Ne(new Ft(1,24,18),k({color:15044512,roughness:.7}));X.scale.set(11,15,7),X.position.copy(r(I*11,20,-166)),i.add(X)}const y=new Ne(new Ft(1,24,16),k({color:d}));y.scale.set(7,2.4,4.5),y.position.set(0,10,-62),i.add(y);const E=[];for(const I of[-1,1])for(const B of[-1,1]){const H=[...S(I),r(0,10,-62),...R(B).slice(1),...w(B).slice(1)];I>0&&H.unshift(r(32-4.1,0,-11.3));const X=ur(Kt(H),10,3.6,I<0?16765562:10477823,3816518);X.points.renderOrder=15,X.mat.depthTest=!1,i.add(X.points),E.push({f:X,affected:I<0})}const O=new dn({color:14169900,roughness:.5}),W=[],K=(I,B,H)=>{const X=Kt(I);if(i.add(new Ne(fn(X,40,8,B),O)),H){const Z=ur(X,H,B*1.6,16763323);Z.points.renderOrder=15,Z.mat.depthTest=!1,i.add(Z.points),W.push(Z)}};K([r(-12,-70,-66),r(-11,-30,-62),r(-11,-6,-60),r(-9.5,5,-57),r(-12,13,-54),r(-15,20,-58)],2.3,14);const C=[r(-9.8,5,-57),r(-11.5,2.5,-49),r(-16,.5,-42),r(-21.5,2,-35),r(-22.5,6,-29),r(-18,8.5,-24)];K(C,.6,12),K([r(-21.5,2,-35),r(-24.5,2,-30),n(e.lat)],.24,6),K([r(-19.5,8,-25.5),r(-20,4,-24.5),n(e.med)],.24,6),K([r(-17.5,.8,-40),r(-21,-2.5,-32),n([12.4,-3.6,-.036])],.2,6);const F=new dn({color:10242880,roughness:.8,transparent:!0}),Y=[];for(const[I,B]of[[0,1],[0,-1],[1,0],[-1,0]]){const H=r(-32,0,0),X=[H.clone().add(r(I*11.4,B*11.4,4.6)),H.clone().add(r(I*12.9,B*12.9,-2)),H.clone().add(r(I*11.5,B*11.5,-11)),r(-18+I*5,3+B*5,-30),r(-13.5+I*1.5,3.5+B*1.5,-41)],Z=new Ne(fn(Kt(X),40,10,se=>.5+2.3*Math.sin(Math.min(1,se*1.15)*Math.PI)**.7),F);i.add(Z),Y.push(Z)}return{group:i,update(I,B,H){F.opacity=.8*(1-I.clip)*ct(17,30,H);for(const X of Y)X.visible=F.opacity>.02;for(const X of E)X.f.points.visible=H>110;for(const X of W)X.points.visible=H>26;s.uniforms.uGlass.value=I.glass,s.uniforms.uAlpha.value=1-I.hideHead,s.depthWrite=I.glass<.02,c.uniforms.uAlpha.value=.5*I.glass*(1-I.hideHead),A[-1].color.set(12432807).lerp(h,.4*I.damage);for(const X of E)X.f.advance(B*.14,X.affected?1-.7*I.damage:1);for(const X of W)X.advance(B*.12)}}}function E0(n,e){const t=new D(-32,0,0),i=new D(Math.sin(hi),0,-Math.cos(hi)),r=new D(0,1,0),s=new D().crossVectors(i,r),a=t.clone().addScaledVector(i,It),o=new et().makeBasis(i,r,s).setPosition(a),l=g=>new D(g[0],g[1],g[2]??0).applyMatrix4(o),c=new kn(s.clone().negate(),0),u=_0(c,e);u.group.matrixAutoUpdate=!1,u.group.matrix.copy(o),n.add(u.group);const f=x0();u.section.add(f.group);const p=S0(l,u.trunks,[ln,0,0]);n.add(p.group),n.add(new l0(16777215,.85));const m=new ml(16777215,1.5);n.add(m);const _=new ml(12570879,.5);return _.position.set(-200,80,-300),n.add(_),{toWorld:l,frame:o,update(g,d,h,x){c.constant=s.dot(a)+di-.004+14*(1-g.clip),m.position.copy(h.position).add(new D(.3,.6,.2).multiplyScalar(h.position.length()+50)),u.update(g,d),f.update(g,d),p.update(g,d,x)}}}const We=di+.03,Yt=mn.x,Wn=mn.y,b0={eyeR:["w",[-32,0,13],"Right eye — the affected one in this model",[-150,-70]],eyeL:["w",[32,0,13],"Fellow eye",[120,-60]],nerveW:["w",[-14,3,-40],"Optic nerve",[-170,10]],chiasm:["w",[0,10,-62],"Optic chiasm: about half the fibres cross",[190,40]],lgn:["w",[27,8.5,-89],"Relay station in the thalamus",[190,0]],rad:["w",[-35,16,-125],"Optic radiation",[-170,0]],cortex:["w",[0,22,-168],"Visual cortex",[0,-70]],ica:["w",[-11,-22,-61.5],"Internal carotid artery",[190,20]],oph:["w",[-16,.5,-42],"Ophthalmic artery",[150,70]],muscle:["w",[-32,12.5,-6],"Eye muscle",[-90,-90]],nerveO:["o",[9,0,2.4],"Optic nerve in its sheath",[150,90]],pca:["o",[12,1.9,-1.6],"Posterior ciliary arteries",[-40,-110]],craIn:["o",[11.2,-3.1,0],"Central retinal artery",[170,70]],spca:["o",[2.5,2.1,2.6],"Short posterior ciliary arteries enter the sclera around the nerve",[230,-60]],globe:["o",[-3.5,7.5,5],"Back of the eyeball (sclera)",[-150,-70]],cornea:["o",[-24.5,0,We],"Cornea",[-90,-90]],lens:["o",[-19.6,1.5,1],"Lens",[-30,-150]],vitreous:["o",[-11,3.5,-.5],"Vitreous gel",[0,0],"plain"],retinaA:["o",[Wt(10.87,7.5),7.5,We],"Retina",[150,-60]],choroidA:["o",[Wt(11.12,6),6,We],"Choroid (blood-vessel layer)",[190,-20]],scleraA:["o",[Wt(11.7,-8.5),-8.5,We],"Sclera",[130,70]],foveaA:["o",or(en.u,en.v),"Fovea: centre of sharp vision",[-70,110]],discA:["o",[-1.45,0,We],"Optic disc",[-150,60]],nerveA:["o",[7,0,We],"Optic nerve",[40,110]],rnfl:["o",[Wt(10.8,1.25),1.25,We],"Nerve-fibre layer",[-250,20]],retB:["o",[Wt(10.93,1.7),1.7,We],"Retina",[-250,-10]],chorB:["o",[Wt(11.12,2.15),2.15,We],"Choroid",[-240,-40]],sclB:["o",[-.9,-1.75,We],"Sclera",[-300,30]],cup:["o",[-1.31,0,We],"Cup",[-190,0]],rim:["o",[-1.5,-.55,We],"Rim of the disc: fibres turning into the nerve",[-290,40]],prelam:["o",[-1.13,-.42,We],"Prelaminar region: bare fibres",[-230,130]],lam:["o",[-.78,-.62,We],"Lamina cribrosa",[-60,190]],retro:["o",[.7,-.75,We],"Myelinated nerve",[120,170]],pia:["o",[2.4,-1.52,We],"Pia",[60,150]],csf:["o",[3.2,-1.78,We],"Fluid-filled space between the membranes",[200,110]],duraB:["o",[4.4,-2.2,We],"Dura",[170,60]],craB:["o",[2.6,-.06,We],"Central retinal artery",[200,-130]],crvB:["o",[3.8,.07,We],"Central retinal vein",[230,-80]],spcaB:["o",[2.6,3.08,We],"Short posterior ciliary artery",[170,-40]],zh:["o",[-.75,1.38,We],"Arterial circle in the sclera (cut across)",[220,-110]],brLam:["o",[Mt(.62)+.15,.62,We],"branch to the lamina",[250,20]],brPre:["o",[-1.21,.88,We],"via the choroid to the prelaminar region",[-270,-40]],brPia:["o",[1.2,1.545,We],"back along the pia",[230,-60]],upper:["o",[-1.05,.5,We],"Upper half of the nerve head",[-280,-110]],lower:["o",[-1.05,-.5,We],"Lower half",[-250,110]],swollen:["o",[-1.5,.62,We],"Swollen fibres heap up into the eye",[-250,-60]],wasted:["o",[.9,.6,We],"Wasted fibres",[200,-150]],mAxon:["o",[Yt-.105,At(mn.lane+1)+.012,We],"Axons, about 1 µm thick",[-150,-120]],mPore:["o",[Yt+.012,At(mn.lane),We],"Pore, about 25 µm",[150,110]],mBeam:["o",[Yt+.1,Wn+.012,We],"Collagen beam",[200,-90]],mCap:["o",[Yt-.135,Wn,We],"Capillary: red cells in single file",[-240,70]],mAstro:["o",[Yt-.075,Wn-.0105,We],"Astrocytes (support cells)",[-90,150]],mCargo:["o",[Yt-.045,At(mn.lane)-.006,We],"Cargo moving along the axons",[70,170]],mPile:["o",[Yt-.03,At(mn.lane+1)+.004,We],"Cargo piles up; fibres balloon",[130,-130]],mSqueeze:["o",[Yt-.06,Wn,We],"Capillary squeezed shut",[-260,60]],fDisc:["o",[-1.56,-.5,0],"Optic disc",[110,120]],fMac:["o",or(en.u,en.v,.02),"Macula",[-60,110]],fArt:["o",or(3.2,3.4,.06),"Retinal artery and vein",[-120,-80]],fNfl:["o",or(3.4,1.9,.02),"Upper nerve fibres",[-210,-20]],fEdge:["o",[-1.56,.95,.35],"Blurred, raised margin with splinter bleeds",[240,-90]],fPale:["o",[-1.56,.45,0],"Pale upper half",[220,-80]]},na={f:"w",at:[0,-8,-75],from:[215,40,560]},El={f:"w",at:[0,-5,-80],from:[-150,70,590]},ia={f:"w",at:[0,8,-85],from:[0,520,170]},T0={f:"o",at:[-6.5,0,0],from:[-6.5,3,66]},bl={f:"o",at:[-.45,0,0],from:[-.45,.2,11.5]},ra={f:"o",at:[-.3,.75,0],from:[-.3,.75,7.6]},sa={f:"o",at:[Yt-.035,Wn,di],from:[Yt-.035,Wn,.52]},Tl={f:"o",at:[Yt-.04,Wn,di],from:[Yt-.04,Wn,.3]},wl={f:"o",at:[-1.5,0,-1.7],from:[-17,.2,-1.5]},Al={f:"o",at:[-1.5,0,-.5],from:[-10.5,.1,-.5]},w0={clip:1,plate:1,cap:0,glass:1,hideHead:1},A0=[{ch:"The route from eye to brain",text:"This film follows one eye from the outside in, to the spot where a condition called non-arteritic anterior ischemic optic neuropathy — NAION — does its damage. NAION is the most common cause of sudden optic-nerve damage in people over 50.[[ew]]",shot:na,set:{glass:0},labels:[]},{text:"It strikes roughly 2 to 10 people in every 100,000 each year. The average age is about 60, but in one hospital series nearly a quarter of patients were under 50.[[ew]][[atk]]",shot:El,set:{glass:1},labels:["eyeR"]},{text:"Seeing begins in the retina, the light-sensitive lining at the back of each eye. About a million nerve fibres — one from each of the retina’s output cells — leave the eye together as the optic nerve.[[wpd]][[wpn]]",shot:ia,labels:["eyeR","eyeL","nerveW"]},{text:"The nerve is 4 to 5 cm long. It runs back through the eye socket and a canal in the skull to the optic chiasm, where about half of its fibres cross to the other side.[[ken]][[wpn]]",shot:{f:"w",at:[0,8,-60],from:[40,330,60]},labels:["nerveW","chiasm"]},{text:"After a relay in the thalamus, the signals fan out to the visual cortex at the very back of the head. Each eye feeds both halves of the brain.[[wpn]][[wpc]]",shot:ia,labels:["chiasm","lgn","rad","cortex"]},{text:"One fact shapes everything that follows. The optic nerve is not an ordinary nerve but an outgrowth of the brain, insulated by the same cells as the brain. Like the brain, it does not regrow once badly damaged.[[ken]][[wpn]]",shot:{f:"w",at:[-18,4,-40],from:[120,210,120]},labels:["nerveW"]},{ch:"The blood supply",text:"Blood reaches the eye from the internal carotid artery in the neck. Its branch to the eye socket is the ophthalmic artery.[[ken]]",shot:{f:"w",at:[-20,2,-36],from:[-125,105,35]},set:{hideHead:.75},labels:["ica","oph","muscle","nerveW"]},{text:"The ophthalmic artery divides. The central retinal artery enters the optic nerve behind the eye and runs up its core. The posterior ciliary arteries, a lateral and a medial, run forward beside the nerve.[[ken]][[hay]]",shot:{f:"o",at:[9,0,0],from:[30,15,26]},set:{hideHead:1},labels:["oph","pca","craIn","nerveO"]},{text:"They break up into short posterior ciliary arteries that pierce the white wall of the eye in a ring around the nerve. These small vessels, not the central retinal artery, are the main blood supply of the front of the optic nerve.[[hay]][[berry]]",shot:{f:"o",at:[1.5,0,0],from:[27,10,17]},labels:["spca","globe","nerveO"]},{ch:"Inside the eye",text:"Now cut the eye and its nerve down the middle. From the front: the cornea and lens that focus light, the clear gel that fills the eye, and the wall — retina innermost, then the blood-rich choroid, then the tough white sclera.[[std]]",shot:T0,set:{clip:1,plate:[1,5],glass:1,hideHead:1},move:4.5,labels:["cornea","lens","vitreous","retinaA","choroidA","scleraA","foveaA","discA","nerveA"]},{text:"Nerve fibres run across the inner surface of the retina and converge on a single exit, the optic disc, about 1.8 mm across. The disc has no light sensors, which is why each eye has a blind spot.[[wpd]][[wpb]]",shot:bl,set:w0,labels:["rnfl","retB","chorB","sclB","cup","rim"]},{text:"At the disc the fibres turn through a right angle and pass through the lamina cribrosa, a sieve of collagen spanning the hole in the sclera. In healthy human eyes its pores average 25 micrometres across and its beams 47.[[wang]]",shot:{f:"o",at:[-.95,0,0],from:[-.95,.1,5.4]},labels:["rim","cup","prelam","lam","retro"]},{text:"In front of the sieve the fibres are bare. Behind it each one gains an insulating sheath of myelin, and the nerve doubles in width, from about 1.6 mm to 3.5 mm. From here back it is wrapped in the same three membranes as the brain, with a fluid-filled space between them.[[ken]][[wpn]][[yang]]",shot:{f:"o",at:[1.1,0,0],from:[1.1,.2,13]},labels:["prelam","lam","retro","pia","csf","duraB"]},{text:"This is the vulnerable part. The central retinal artery passes straight through, on its way to the retina. The nerve head is fed from the side: by an arterial circle within the sclera, formed by short posterior ciliary arteries, and by the neighbouring choroid.[[atk]][[hay]][[ken]]",shot:ra,labels:["craB","crvB","spcaB","zh","brLam","brPre","brPia"]},{text:"The circle is described as having separate upper and lower halves. That matches a striking feature of NAION: it often destroys the top or bottom half of the nerve head and spares the other. The circle is not complete in every eye.[[atk]][[ken]]",shot:{f:"o",at:[-.6,0,0],from:[-.6,0,8.6]},labels:["upper","lower","zh"]},{text:"Closer. Each pore of the sieve carries a bundle of fibres, each fibre about a thousandth of a millimetre thick. In primate eyes every beam of the sieve has a capillary running through it, and more capillaries lie in the tissue between the bundles.[[yang]][[std]]",shot:sa,set:{micro:[1,3.5]},move:5,labels:["mAxon","mPore","mBeam","mCap","mAstro"]},{text:"Each fibre is part of a living cell, centimetres long. Material made in the cell body, back in the retina, is carried down the fibre continuously, and spent material is carried back. This traffic, called axonal transport, needs a steady supply of energy — and therefore of blood.[[yang]][[std]]",shot:Tl,labels:["mCargo","mCap"]},{ch:"A disc at risk",text:"Optic discs differ. Most have a central hollow, the cup, which leaves the fibres some slack. In nearly all eyes that develop NAION the disc is small and the cup tiny or absent: a cup-to-disc ratio below about 0.2. Doctors call this a disc at risk.[[ew]][[atk]]",shot:bl,set:{micro:0},labels:["cup","rim","lam"],fig:"discs"},{text:"The same number of fibres is packed into a smaller opening, just in front of a rigid sieve. Nothing is wrong yet, and the eye sees normally. Whether crowding helps cause NAION, or only makes it worse once it starts, is disputed.[[hay]][[ew]]",shot:{f:"o",at:[-1,0,0],from:[-1,0,6.2]},labels:["prelam","lam"],fig:"discs"},{ch:"The fall in blood flow",text:"Flow through the nerve head depends on perfusion pressure: the mean blood pressure minus the pressure inside the eye. Normally the small vessels widen or narrow to hold the flow steady as that pressure changes. This is autoregulation.[[hay]]",shot:ra,set:{hud:1},labels:["spcaB","zh"],fig:"auto"},{text:"Autoregulation works only within a range. Below it, flow falls with pressure. One influential theory holds that the normal dip in blood pressure during sleep — sometimes deepened by blood-pressure tablets taken at bedtime — carries a susceptible nerve head below that range.[[hay]]",shot:ra,set:{night:1,flowAll:[.55,7],flow:[.5,7]},labels:["spcaB","zh"],fig:"auto"},{text:"The evidence is mixed. In one series 73% of patients found their vision gone on waking. But the largest treatment trial did not confirm that timing, and a study comparing patients with healthy controls found no difference in night-time blood pressure.[[hay]][[ew]][[atk]]",shot:{f:"o",at:[-.5,.75,0],from:[-1.4,.9,7.4]},labels:["brLam","brPre"],fig:"auto"},{text:"What is better established is what NAION usually is not: a blood clot. In nerves examined after death no blocked or inflamed vessel was found. The accepted view is a shortfall of flow in the smallest vessels, most often in people with high blood pressure, diabetes or sleep apnoea.[[atk]][[hay]][[ew]]",shot:{f:"o",at:[-.8,.6,0],from:[-.8,.6,5.2]},labels:["upper"]},{ch:"The vicious circle",text:"Follow one capillary as its flow falls. The fibres beside it run short of oxygen, and of the energy that drives their internal transport.[[hay]][[atk]]",shot:sa,set:{micro:[1,3.5],flow:.4},move:5,labels:["mCap","mCargo"]},{text:"Transport stalls. Cargo that should pass through the sieve piles up in front of it, and the fibres balloon. This is the swelling that an eye doctor sees at the disc.[[hay]][[atk]][[yang]]",shot:Tl,set:{stasis:[1,6],swelling:[.55,9]},labels:["mPile"]},{text:"In a crowded disc the swollen fibres have nowhere to expand. As Hayreh put it, the only thing they can squeeze to make room is the fine capillaries lying among them. Flow falls further, and more fibres swell.[[hay]]",shot:sa,set:{swelling:[1,7],flow:[.06,7]},labels:["mSqueeze","mPile"]},{text:"A vicious circle: less blood, more swelling, less blood. It has been likened to a compartment syndrome, in which tissue is strangled by its own swelling inside a space that cannot stretch. This is the leading explanation. It has not been proven.[[hay]][[atk]][[berry]][[ew]]",shot:{f:"o",at:[-1.05,.3,0],from:[-1.05,.3,4.6]},set:{micro:0,damage:[.6,9]},labels:["swollen","lam"]},{ch:"What the eye sees",text:"Seen through the pupil, the disc is swollen from the first day of visual loss. Its margin is blurred and raised, often with small splinter-shaped bleeds.[[hay]][[atk]]",shot:wl,set:{clip:[0,5],plate:[0,1.5],cap:[1,3],night:0,flowAll:1,damage:.75},move:6,labels:["fDisc","fMac","fArt","fEdge"],fig:"vision"},{text:"Fibres from the upper half of the retina enter the top of the disc. Because the optics of the eye turn the image upside down, those fibres carry the lower half of what the eye sees.[[wpc]][[std]]",shot:{f:"o",at:[-1.5,.9,-1.9],from:[-15,1.4,-1.9]},labels:["fNfl","fDisc","fMac"],fig:"vision"},{text:"So when the upper half of the nerve head fails, the lower half of that eye’s view dims or goes, usually without pain. Lower-field loss is the commonest pattern; careful testing often shows it densest in the lower corner nearest the nose.[[ew]][[atk]][[hay]]",shot:wl,set:{damage:[1,8]},labels:["fNfl"],fig:"vision"},{text:"The loss can deepen over the first two weeks, then holds steady. Sharpness of central vision varies widely. About two thirds of patients keep better than 20/200, and a third keep 20/20 with part of their field missing.[[ew]][[atk]][[hay]]",shot:Al,labels:["fEdge"],fig:"vision"},{ch:"The weeks and months after",text:"Over about two months the swelling subsides. As it does, the affected part of the disc turns pale: the damaged fibres are wasting away.[[hay]][[atk]][[berry]]",shot:Al,set:{swelling:[.08,9],pallor:[1,9],stasis:0,flow:.5},labels:["fPale"],fig:"vision"},{text:"Scans show the layer of nerve fibres around the disc thinning over two to three months and levelling off by about six.[[ew]]",shot:{f:"o",at:[-.5,.3,0],from:[-.5,.5,8.4]},set:{clip:1,plate:[1,4],cap:0,atrophy:[1,8]},move:6,labels:["wasted","lower"],fig:"vision"},{text:"These fibres do not regrow. Even so, in studies between 13% and 43% of patients regained three or more lines on the eye chart — perhaps partly as fluid under the central retina clears. Missing areas of the visual field recover less often.[[ew]][[atk]][[berry]]",shot:ia,set:{clip:0,plate:0,hideHead:0},move:6,labels:["eyeR","chiasm","cortex"],fig:"vision"},{ch:"What can be done",text:"No treatment has been shown to work. The one rigorous trial tested surgery to open the sheath around the nerve. It did not help and may have harmed: 33% of operated patients improved, against 43% of those left alone.[[atk]][[ew]]",shot:{f:"o",at:[4,0,0],from:[22,9,15]},set:{hideHead:1},labels:["nerveO"],fig:"vision"},{text:"Steroid tablets looked helpful in one large study, but patients chose their own treatment, so the comparison is disputed. Aspirin has not been shown to improve the outcome.[[atk]][[hay]][[berry]]",shot:El,set:{hideHead:0},labels:[]},{text:"The other eye is affected in about 15 to 24% of people within five years. A second attack in the same eye is uncommon: 3 to 8%.[[ew]][[atk]]",shot:{f:"w",at:[0,0,-10],from:[0,60,330]},labels:["eyeR","eyeL"]},{text:"Reasonable steps are the ones that protect small blood vessels in general: controlling blood pressure, diabetes and cholesterol, and treating sleep apnoea. None has been proven in a trial to protect the second eye. Some specialists advise against taking blood-pressure tablets at bedtime — a question for the prescribing doctor.[[ew]][[hay]]",shot:{f:"w",at:[-20,2,-36],from:[-135,90,60]},set:{hideHead:.6},labels:["ica","oph"]},{text:"Links with some medicines — amiodarone, drugs for erectile dysfunction and, more recently, semaglutide — have been reported and remain debated. Ophthalmology societies advise against stopping semaglutide on the strength of a single study.[[ew]][[atk]]",shot:na,set:{hideHead:0},labels:[]},{text:"One thing is urgent. A rarer form of this condition is caused by giant cell arteritis, an inflammation of the arteries that can take the second eye within days and is treated at once with steroids. Sudden loss of vision, especially with headache, a tender scalp or jaw pain on chewing, needs assessment the same day.[[ew]][[aaion]][[hay90]]",shot:{f:"w",at:[0,0,-10],from:[0,30,300]},labels:["eyeR","eyeL"]},{text:"Much is still unknown: why the flow falls, why the damage stops where it does, and how to break the circle once it has begun. What you have watched is the leading account, not a settled one.[[ew]][[berry]]",shot:na,set:{glass:.55},labels:[]}],aa={glass:0,hideHead:0,clip:0,plate:0,cap:0,micro:0,night:0,hud:0,flowAll:1,flow:1,stasis:0,swelling:0,damage:0,atrophy:0,pallor:0};function R0(n){let e=0,t=null,i=-1;const r=A0.map((_,g)=>{_.ch&&(t=_.ch,i++);const d=_.text.replace(/\[\[[\w-]+\]\]/g,""),h=Math.max(7,2.6+d.length/15.5),x=w=>_.shot.f==="o"?n(w):new D(...w),v=x(_.shot.at),S=x(_.shot.from),R={..._,i:g,start:e,dur:h,chapter:t,chapterIndex:i,first:!!_.ch,at:v,dir:S.clone().sub(v).normalize(),dist:S.distanceTo(v),move:Math.min(_.move??3.6,h*.7)};return e+=h,R}),s=e,a={};for(const _ of Object.keys(aa))a[_]=[];for(const _ of r)for(const[g,d]of Object.entries(_.set||{})){const[h,x]=Array.isArray(d)?d:[d,2.8];a[g].push([_.start,h,Math.min(x,_.dur)])}const o=_=>{let g=r.length-1;for(;g>0&&r[g].start>_;)g--;return r[g]};function l(_){const g={};for(const d of Object.keys(aa)){let h=aa[d];for(const[x,v,S]of a[d]){if(_<x)break;h=it(h,v,gl((_-x)/S))}g[d]=h}return g}const c=new En,u=new En,f=new En,p=new D(0,0,1);function m(_,g){const d=o(_),h=r[Math.max(0,d.i-1)],x=d.i===0?1:gl((_-d.start)/d.move),v=d.dist<h.dist,S=Math.abs(Math.log(d.dist/h.dist)),R=S<.7?x:v?1-(1-x)**(1+S):x**(1+S);return g.at.lerpVectors(h.at,d.at,R),g.dist=Math.exp(it(Math.log(h.dist),Math.log(d.dist),x)),c.setFromUnitVectors(p,h.dir),u.setFromUnitVectors(p,d.dir),f.slerpQuaternions(c,u,x),g.dir.copy(p).applyQuaternion(f),g}return{cues:r,total:s,cueAt:o,state:l,camera:m}}const vc=[{id:"ew",read:"full",title:"EyeWiki (American Academy of Ophthalmology): Non-Arteritic Anterior Ischemic Optic Neuropathy (NAION)",url:"https://eyewiki.org/Non-Arteritic_Anterior_Ischemic_Optic_Neuropathy_(NAION)",took:"Incidence and age; the small “disc at risk” (cup-to-disc ratio under 0.2, small discs in up to 97% of patients) and that its role is unclear; the compartment-syndrome idea and that no mechanism is established; the IONDT not confirming the night-time theory; lower-field loss most common; worsening over two weeks, stabilising within two months; nerve-fibre-layer thinning at 2–3 months, plateau at 6; recovery of three lines in 13–43%; fellow eye 15–24% over five years, recurrence 3–8%; no effective treatment and no trial evidence for risk-factor control; medicines debate, including advice not to stop semaglutide on one study; testing for giant cell arteritis when suspected."},{id:"hay",read:"full",title:"Hayreh SS. Anterior Ischemic Optic Neuropathy, Part 2: a discussion for physicians (and Part 1, for patients). EyeRounds, University of Iowa",url:"https://eyerounds.org/article/AION/AION-part2.htm",took:"Nerve head supplied mainly by the posterior ciliary arteries (lateral and medial); perfusion pressure = mean blood pressure − eye pressure; autoregulation and its critical range; the night-time blood-pressure theory, bedtime tablets, and 73% noticing loss on waking; temporary under-perfusion rather than a clot as the usual cause; the small cup as a secondary factor; stalled transport in starved fibres causing the disc swelling; swollen fibres compressing the capillaries among them, and the vicious circle; swelling present from onset, splinter bleeds, pallor from 2–3 weeks, swelling gone in about 2 months; lower-field loss with a denser patch toward the nose; presenting sharpness of vision; the steroid study and its lack of randomisation; aspirin; advice on evening blood-pressure doses."},{id:"atk",read:"full",title:"Atkins EJ, Bruce BB, Newman NJ, Biousse V. Treatment of nonarteritic anterior ischemic optic neuropathy. Survey of Ophthalmology 2010;55(1):47–63",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC3721361",took:"An arterial circle from the short posterior ciliary arteries with distinct upper and lower halves, consistent with half-field loss; choroidal supply of the laminar and prelaminar layers; post-mortem series (193 eyes) with no blocked or inflamed vessels and infarcts mainly behind the lamina; small-vessel insufficiency as the accepted cause; conflicting night-pressure studies; stalled transport, swelling in a restricted space, compressed capillaries, “compartment syndrome”; risk factors (60% with at least one; hypertension 47%, diabetes 24%); sharpness of vision at presentation; swelling lasting a median 7.9 weeks, pallor by 4–6 weeks; the decompression trial (32.6% vs 42.7% improved; 23.9% vs 12.4% worsened); steroids, aspirin; fellow eye about 15% in five years, recurrence under 5%; fluid under the fovea as a source of reversible loss; the venous and vitreous-traction hypotheses."},{id:"berry",read:"full",title:"Berry S, Lin WV, Sadaka A, Lee AG. Nonarteritic anterior ischemic optic neuropathy: cause, effect, and management. Eye and Brain 2017;9:23–28",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC5628702",took:"Short posterior ciliary arteries supply the front of the nerve head; capillaries more easily compressed in the fixed space in front of the rigid lamina; pathogenesis unproven and probably multifactorial; atrophy within 6–11 weeks; visual-field loss less likely to improve than sharpness; no high-grade evidence for any treatment."},{id:"wang",read:"full",title:"Wang B, Nevins JE, Nadler Z, et al. In vivo lamina cribrosa micro-architecture in healthy and glaucomatous eyes as assessed by optical coherence tomography. Invest Ophthalmol Vis Sci 2013;54(13):8270–8274",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC3869422",took:"The lamina cribrosa as a meshwork of collagen through which all retinal axons pass; in healthy human eyes, mean pore diameter 24.6 µm and beam thickness 46.7 µm (the model is drawn to these)."},{id:"yang",read:"full",title:"Yang H, Reynaud J, Lockwood H, et al. The connective tissue phenotype of glaucomatous cupping in the monkey eye. Progress in Retinal and Eye Research 2017;59:1–52",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC5603293",took:"Monkey eyes: each laminar beam contains a capillary; capillaries in the septa in front of and behind the lamina; the lamina as a site of axonal-transport blockade; high energy demand of axon mitochondria; myelin beginning at the back of the lamina."},{id:"ken",read:"full",title:"Kenhub anatomy library: The optic nerve",url:"https://www.kenhub.com/en/library/anatomy/the-optic-nerve",took:"Nerve length 35–55 mm and its four segments; fibres bare in front of the lamina and myelinated behind it, by oligodendrocytes; no regeneration after severe damage; the three meningeal sheaths and the fluid space; ophthalmic artery from the internal carotid, giving the central retinal and posterior ciliary arteries; the circle of Zinn–Haller being inconsistent; nerve twice as wide behind the eye."},{id:"wpn",read:"full",title:"Wikipedia: Optic nerve",url:"https://en.wikipedia.org/wiki/Optic_nerve",took:"Fibre count (770,000–1.7 million); segment lengths; width 1.6 mm in the eye and 3.5 mm in the orbit; a myelinated tract of the central nervous system; about 53% of fibres cross at the chiasm; relay in the lateral geniculate nucleus and on to the visual cortex."},{id:"wpd",read:"full",title:"Wikipedia: Optic disc",url:"https://en.wikipedia.org/wiki/Optic_disc",took:"Disc dimensions (1.76 mm × 1.92 mm); 1–1.2 million fibres; the disc lies 3–4 mm to the nasal side of the fovea; it corresponds to the blind spot."},{id:"wpb",read:"full",title:"Wikipedia: Blind spot (vision)",url:"https://en.wikipedia.org/wiki/Blind_spot_(vision)",took:"No photoreceptors on the disc; the blind spot lies about 12–15° to the temple side and 1.5° below the horizontal, roughly 7.5° high and 5.5° wide (used for the field plot)."},{id:"wpc",read:"full",title:"Wikipedia: Optic chiasm",url:"https://en.wikipedia.org/wiki/Optic_chiasm",took:"Fibres from the nasal retina cross; the retinal image is inverted."},{id:"aaion",read:"summary",title:"EyeWiki (American Academy of Ophthalmology): Arteritic Anterior Ischemic Optic Neuropathy (AAION)",url:"https://eyewiki.org/Arteritic_Anterior_Ischemic_Optic_Neuropathy_(AAION)",took:"The arteritic form is caused by giant cell arteritis and is treated urgently with steroids to protect the other eye."},{id:"hay90",read:"summary",title:"Hayreh SS. Anterior ischaemic optic neuropathy: differentiation of arteritic from non-arteritic type and its management. Eye 1990;4:25–41",url:"https://www.nature.com/articles/eye19904",took:"Telling the two forms apart: symptoms of giant cell arteritis, blood tests, artery biopsy."},{id:"std",read:"none",title:"General anatomy and physiology",url:"",took:"Statements marked with this number are standard textbook material that was not checked against a specific source for this project: the layers of the eye wall, axon and red-cell sizes, axonal transport and its need for energy, and the mapping of the upper retina to the lower visual field."}],C0=["Time is compressed. The fall in blood flow takes hours, the swelling days, the wasting of fibres weeks to months.","The model always damages the upper half of the nerve head, because loss in the lower visual field is the most common pattern. A real eye may lose a different part, or all of it.","The mechanism shown — under-perfusion, stalled transport, swelling, squeezed capillaries — is the leading account. It is unproven. Post-mortem studies found infarcts mainly behind the lamina, which the model does not show; venous and vitreous-traction explanations also exist.","Capillary layout, the arterial circle and the laminar pores are drawn from descriptions, not traced from one specimen. Pore and beam sizes follow human measurements; capillaries inside beams are documented in monkeys.","Dimensions not tied to a citation are round textbook values: wall thicknesses, lamina thickness (0.3 mm), axon diameter (about 1 µm), capillary and red-cell size (about 8 µm).","The section shows 11 bundles per half of the nerve; the real nerve has several hundred pores and about a million fibres. At the finest scale two dozen axons stand in for the hundreds in each bundle.","The head is a stylised model. Positions of the chiasm, thalamus and visual cortex are schematic.","Gauge readings and the autoregulation curve are illustrative. The sources give no numerical limits.","This is an explanation, not a diagnosis, and not medical advice."],P0=new Map(vc.map((n,e)=>[n.id,e+1]));function xc(n){return n.replace(/\[\[([\w-]+)\]\]/g,(e,t)=>{const i=P0.get(t);if(!i)throw new Error(`unknown source: ${t}`);return`<sup><a href="#" data-src="${t}">${i}</a></sup>`})}const ya="#e8eaf0",L0="#98a0b3",D0="#3a4356",U0="#ffb86b",Mc="#ff6a5c";function tn(n,e,t,i,r={}){n.font=`${r.w||400} ${r.size||12}px system-ui, sans-serif`,n.fillStyle=r.color||L0,n.textAlign=r.align||"left",n.textBaseline=r.base||"alphabetic",n.fillText(e,t,i)}function I0(n,e,t,i){const r=i.damage,s=e*.56,a=t-26;n.save(),n.beginPath(),n.roundRect(0,0,s,a,6),n.clip();const o=n.createLinearGradient(0,0,0,a*.6);if(o.addColorStop(0,"#6fb1e6"),o.addColorStop(1,"#d9ecf7"),n.fillStyle=o,n.fillRect(0,0,s,a),n.fillStyle="#fff4c2",n.beginPath(),n.arc(s*.78,a*.18,a*.07,0,7),n.fill(),n.fillStyle="#7fa66b",n.beginPath(),n.moveTo(0,a*.52),n.quadraticCurveTo(s*.3,a*.34,s*.6,a*.5),n.quadraticCurveTo(s*.85,a*.4,s,a*.48),n.lineTo(s,a),n.lineTo(0,a),n.fill(),n.fillStyle="#5c8f4e",n.fillRect(0,a*.58,s,a*.42),n.fillStyle="#d9c7a0",n.beginPath(),n.moveTo(s*.46,a*.58),n.lineTo(s*.54,a*.58),n.lineTo(s*.74,a),n.lineTo(s*.28,a),n.fill(),n.fillStyle="#f3ede2",n.fillRect(s*.15,a*.42,s*.2,a*.2),n.fillStyle="#a5483a",n.beginPath(),n.moveTo(s*.12,a*.43),n.lineTo(s*.25,a*.27),n.lineTo(s*.38,a*.43),n.fill(),n.fillStyle="#4b3a2c",n.fillRect(s*.23,a*.52,s*.04,a*.1),n.fillStyle="#3f6f3a",n.beginPath(),n.arc(s*.8,a*.5,a*.13,0,7),n.fill(),n.fillStyle="#5a4030",n.fillRect(s*.79,a*.58,s*.02,a*.13),r>.01){const p=n.createLinearGradient(0,a*.44,0,a*.6);p.addColorStop(0,"rgba(70,72,82,0)"),p.addColorStop(1,`rgba(70,72,82,${.86*r})`),n.fillStyle=p,n.fillRect(0,a*.44,s,a*.56);const m=n.createRadialGradient(s*.12,a*.95,0,s*.12,a*.95,s*.6);m.addColorStop(0,`rgba(48,50,58,${.85*r})`),m.addColorStop(1,"rgba(48,50,58,0)"),n.save(),n.beginPath(),n.rect(0,a*.5,s,a*.5),n.clip(),n.fillStyle=m,n.fillRect(0,0,s,a),n.restore()}n.strokeStyle="rgba(255,255,255,0.85)",n.lineWidth=1.5,n.beginPath(),n.moveTo(s/2-5,a/2),n.lineTo(s/2+5,a/2),n.moveTo(s/2,a/2-5),n.lineTo(s/2,a/2+5),n.stroke(),n.restore(),tn(n,"Through the right eye",2,t-8);const l=e*.8,c=a/2+6,u=Math.min(e*.19,a/2-8),f=u/30;n.fillStyle="#f2efe6",n.beginPath(),n.arc(l,c,u,0,7),n.fill(),n.save(),n.beginPath(),n.arc(l,c,u,0,7),n.clip(),r>.01&&(n.fillStyle=`rgba(60,62,70,${.55*r})`,n.fillRect(l-u,c,2*u,u),n.fillStyle=`rgba(20,20,24,${.8*r})`,n.beginPath(),n.moveTo(l,c),n.arc(l,c,u*1.1,Math.PI*.5,Math.PI),n.closePath(),n.fill()),n.fillStyle="#1b1b1f",n.beginPath(),n.ellipse(l+13.5*f,c+1.5*f,2.75*f,3.75*f,0,0,7),n.fill(),n.restore(),n.strokeStyle="#8b8778",n.lineWidth=1;for(const p of[10,20,30])n.beginPath(),n.arc(l,c,p*f,0,7),n.stroke();n.beginPath(),n.moveTo(l-u,c),n.lineTo(l+u,c),n.moveTo(l,c-u),n.lineTo(l,c+u),n.stroke(),tn(n,"Field chart, central 30°",l,t-8,{align:"center"}),tn(n,"nose side",l-u,9,{size:9.5}),tn(n,"temple side",l+u,9,{size:9.5,align:"right"})}function N0(n,e,t,i){const r=fs(3),s=[{x:e*.26,title:"Disc with a cup",cup:.42,ring:44},{x:e*.74,title:"Crowded disc",cup:.12,ring:33}];for(const a of s){tn(n,a.title,a.x,14,{align:"center",color:ya,w:600});const o=56,l=30;n.fillStyle="#b9491f",n.fillRect(a.x-62,22,124,68),n.fillStyle="#e58a55",n.beginPath(),n.arc(a.x,o,l*(a.ring/44),0,7),n.fill(),n.fillStyle="#ffeccc",n.beginPath(),n.arc(a.x,o,l*(a.ring/44)*a.cup,0,7),n.fill(),n.strokeStyle="#8a1a1a",n.lineWidth=2;for(const g of[-2.2,-.9,.9,2.2])n.beginPath(),n.moveTo(a.x,o),n.quadraticCurveTo(a.x+Math.cos(g)*20,o+Math.sin(g)*26,a.x+Math.cos(g)*60,o+Math.sin(g)*34),n.stroke();tn(n,`cup-to-disc ≈ ${a.cup<.2?"0.1":"0.4"}`,a.x,104,{align:"center",size:11});const c=t-62,u=a.ring,f=u*a.cup,p=70;n.strokeStyle="#d9d2c2",n.lineWidth=6,n.beginPath(),n.arc(a.x,c,u+5,0,7),n.stroke();const m=a.cup<.2,_=i.swelling*(m?1:.55);for(let g=0;g<p;g++){const d=Math.sqrt(f*f+(g+.5)/p*(u*u-f*f)),h=g*2.39996,x=a.x+d*Math.cos(h),v=c+d*Math.sin(h),S=v<c,R=S?_:_*.25;n.fillStyle=m&&S?`rgb(${Math.round(it(238,150,i.damage))},${Math.round(it(220,150,i.damage))},${Math.round(it(150,158,i.damage))})`:"#eedc96",n.beginPath(),n.arc(x,v,1.9*(1+.55*R),0,7),n.fill()}for(let g=0;g<9;g++){const d=g/9*6.283+.3,h=(f+u)/2+(r()-.5)*8,x=Math.sin(d)<0,v=m&&x?ct(.45,.95,i.swelling):0;n.fillStyle=v>.5?"#5a2026":Mc,n.beginPath(),n.arc(a.x+h*Math.cos(d),c+h*Math.sin(d),2.4*(1-.5*v),0,7),n.fill()}}tn(n,"Above: face-on. Below: cut across at the opening.",e/2,t-6,{align:"center",size:10.5})}function F0(n,e,t,i){const s=e-16,a=t-40,o=26;n.strokeStyle=D0,n.lineWidth=1,n.beginPath(),n.moveTo(44,o-8),n.lineTo(44,a),n.lineTo(s,a),n.stroke(),tn(n,"Blood flow",38,o-12,{size:11}),tn(n,"Perfusion pressure = mean blood pressure − eye pressure",(44+s)/2,t-22,{align:"center",size:11}),tn(n,"Schematic. The source gives no numerical limits.",(44+s)/2,t-7,{align:"center",size:10});const l=p=>p<.38?.78*(p/.38)**1.25:p<.82?.78+.03*(p-.38):.793+.9*(p-.82),c=p=>it(44,s,p),u=p=>it(a,o,p);n.fillStyle="rgba(127,209,168,0.1)",n.fillRect(c(.38),o,c(.82)-c(.38),a-o),tn(n,"autoregulation range",c(.6),o+12,{align:"center",size:10.5,color:"#7fd1a8"}),n.strokeStyle=ya,n.lineWidth=2,n.beginPath();for(let p=.02;p<=1;p+=.02)n.lineTo(c(p),u(l(p)));n.stroke();const f=it(.62,.2,ct(1,.5,i.flowAll));n.fillStyle=i.flowAll<.8?Mc:U0,n.beginPath(),n.arc(c(f),u(l(f)),6,0,7),n.fill(),tn(n,i.night>.5?"asleep: pressure dips":"awake",c(f)+10,u(l(f))+16,{size:11,color:ya})}const O0={vision:{draw:I0,w:380,h:150,title:"Visibility simulation"},discs:{draw:N0,w:380,h:250,title:"Why a small disc is at risk"},auto:{draw:F0,w:380,h:190,title:"Autoregulation"}};function B0(n){const e=n.querySelector("canvas"),t=n.querySelector("figcaption"),i=e.getContext("2d");let r=null,s="";return{update(a,o){if(n.hidden=!a,!a){r=null;return}const l=O0[a],c=a+[o.damage,o.swelling,o.flowAll,o.night>.5].map(u=>(+u).toFixed(2)).join();c!==s&&(s=c,r!==a&&(r=a,e.width=l.w*2,e.height=l.h*2,e.style.aspectRatio=`${l.w} / ${l.h}`,t.textContent=l.title),i.setTransform(2,0,0,2,0,0),i.clearRect(0,0,l.w,l.h),l.draw(i,l.w,l.h,o))}}}const Pe=n=>document.getElementById(n),vr=Pe("stage"),z0=Math.min(innerWidth,innerHeight)<560,gn=new fc({antialias:!0});gn.setPixelRatio(Math.min(devicePixelRatio,2));gn.localClippingEnabled=!0;vr.prepend(gn.domElement);const yc=new Jm,Ht=new jt(30,1,1,4e3),Ua=E0(yc,z0),nt=R0(Ua.toWorld);let Mn=0,Vt=0;function Sc(){Mn=vr.clientWidth,Vt=vr.clientHeight,!(!Mn||!Vt)&&(gn.setSize(Mn,Vt,!1),Ht.aspect=Mn/Vt,Ht.fov=Mn/Vt>=1.35?30:ga.radToDeg(2*Math.atan(Math.tan(ga.degToRad(15))*1.35/(Mn/Vt))),Ht.updateProjectionMatrix(),Pe("leaders").setAttribute("viewBox",`0 0 ${Mn} ${Vt}`))}new ResizeObserver(Sc).observe(vr);Sc();const Rl="http://www.w3.org/2000/svg",Ec=Object.entries(b0).map(([n,[e,t,i,r,s]])=>{const a=document.createElement("div");a.className="label"+(s?" "+s:""),a.textContent=i,Pe("labels").appendChild(a);const o=document.createElementNS(Rl,"line"),l=document.createElementNS(Rl,"circle");l.setAttribute("r",3),s||Pe("leaders").append(o,l);const c=e==="o"?Ua.toWorld(t):new D(...t);return{id:n,el:a,line:o,dot:l,pos:c,off:r,a:0,w:0,h:0}}),Ui=new D;function G0(n,e){const t=Qt(Mn/1280,.42,1.15),i=[],r=vr.getBoundingClientRect();for(const s of["subtext","figure","gauges"]){const a=Pe(s).getBoundingClientRect();a.width&&i.push({x:a.left-r.left+a.width/2,y:a.top-r.top+a.height/2,w:a.width,h:a.height,fixed:!0})}for(const s of Ec){const a=n.has(s.id)?1:0;s.a=Qt(s.a+(a?e*2.2:-e*4)),Ui.copy(s.pos).project(Ht);const o=s.a>.01&&Ui.z<1&&Math.abs(Ui.x)<1.15&&Math.abs(Ui.y)<1.15;if(s.el.style.opacity=o?s.a:0,s.line.style.opacity=s.dot.style.opacity=o?s.a*.9:0,!o)continue;s.w||(s.w=s.el.offsetWidth,s.h=s.el.offsetHeight);const l=(Ui.x*.5+.5)*Mn,c=(-Ui.y*.5+.5)*Vt;let u=Qt(l+s.off[0]*t,s.w/2+12,Mn-s.w/2-12),f=Qt(c+s.off[1]*t,s.h/2+70,Vt-s.h/2-20);for(let p=0;p<6;p++)for(const m of i)Math.abs(u-m.x)<(s.w+m.w)/2+6&&Math.abs(f-m.y)<(s.h+m.h)/2+4&&(f=m.y+(m.fixed?m.y>Vt/2?-1:1:f>=m.y?1:-1)*((s.h+m.h)/2+6));f=Qt(f,s.h/2+70,Vt-s.h/2-12),i.push({x:u,y:f,w:s.w,h:s.h}),s.el.style.transform=`translate(${u}px, ${f}px) translate(-50%, -50%)`,s.line.setAttribute("x1",l),s.line.setAttribute("y1",c),s.line.setAttribute("x2",u),s.line.setAttribute("y2",f),s.dot.setAttribute("cx",l),s.dot.setAttribute("cy",c)}}addEventListener("resize",()=>{for(const n of Ec)n.w=0});let yt=0,bn=!1,dr=1,Jr=!0;const Sa=n=>`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,"0")}`,Rt={yaw:0,pitch:0,zoom:1},Nn=n=>{bn=n,Pe("play").textContent=n?"❚❚":"▶",Pe("hint").hidden=n||yt<=.01};Pe("play").addEventListener("click",()=>{yt>=nt.total-.05&&(yt=0),Nn(!bn)});const Zi=(n,e,t)=>{yt=Qt(n,0,nt.total),Rt.yaw=Rt.pitch=0,Rt.zoom=1,t||(Pe("scrub").value=Math.round(yt/nt.total*1e3)),e||Nn(!1)};Pe("prev").addEventListener("click",()=>{const n=nt.cueAt(yt);Zi((yt-n.start>2?n:nt.cues[Math.max(0,n.i-1)]).start,bn)});Pe("next").addEventListener("click",()=>{const n=nt.cueAt(yt);Zi(nt.cues[Math.min(nt.cues.length-1,n.i+1)].start,bn)});Pe("scrub").addEventListener("input",()=>Zi(Pe("scrub").value/1e3*nt.total,!1,!0));const oa=[1,1.5,2,.5];Pe("speed").addEventListener("click",()=>{dr=oa[(oa.indexOf(dr)+1)%oa.length],Pe("speed").textContent=dr+"×"});Pe("cc").addEventListener("click",()=>{Jr=!Jr,Pe("cc").setAttribute("aria-pressed",Jr),Pe("subs").hidden=!Jr});addEventListener("keydown",n=>{n.target.closest("input, button, a")||(n.code==="Space"&&(n.preventDefault(),Pe("play").click()),n.code==="ArrowRight"&&Pe("next").click(),n.code==="ArrowLeft"&&Pe("prev").click())});for(const n of nt.cues)if(n.first){const e=document.createElement("button");e.style.left=n.start/nt.total*100+"%",e.title=n.chapter,e.setAttribute("aria-label","Chapter: "+n.chapter),e.addEventListener("click",()=>Zi(n.start,bn)),Pe("ticks").appendChild(e)}let Bi=null;gn.domElement.addEventListener("pointerdown",n=>{Bi={x:n.clientX,y:n.clientY},gn.domElement.setPointerCapture(n.pointerId)});gn.domElement.addEventListener("pointermove",n=>{if(!Bi)return;const e=n.clientX-Bi.x,t=n.clientY-Bi.y;bn&&Math.hypot(e,t)>6&&Nn(!1),bn||(Rt.yaw=Qt(Rt.yaw-e*.005,-1.4,1.4),Rt.pitch=Qt(Rt.pitch+t*.005,-1,1),Bi={x:n.clientX,y:n.clientY})});gn.domElement.addEventListener("pointerup",()=>{Bi=null});gn.domElement.addEventListener("wheel",n=>{n.preventDefault(),Nn(!1),Rt.zoom=Qt(Rt.zoom*Math.exp(n.deltaY*.0012),.25,4)},{passive:!1});Pe("tab-transcript").innerHTML=nt.cues.map(n=>`${n.first?`<h3>${n.chapterIndex+1}. ${n.chapter}</h3>`:""}<p data-cue="${n.i}"><button class="go" aria-label="Play from here">${Sa(n.start)}</button>${xc(n.text)}</p>`).join("");Pe("srclist").innerHTML=vc.map(n=>`<li id="src-${n.id}">${n.url?`<a href="${n.url}" target="_blank" rel="noopener">${n.title}</a>`:`<b>${n.title}</b>`}
  <span class="read ${n.read}">${{full:"Read in full",summary:"Search summary only — not yet read",none:"Not checked against a source"}[n.read]}</span><p>${n.took}</p></li>`).join("");Pe("caveats").innerHTML=C0.map(n=>`<li>${n}</li>`).join("");const bc=n=>{for(const e of document.querySelectorAll("[role=tab]"))e.setAttribute("aria-selected",e.dataset.tab===n);for(const e of document.querySelectorAll(".tab"))e.hidden=e.id!=="tab-"+n},Tc=(n,e)=>{Pe("notes").hidden=!1,bc(n);for(const t of Pe("srclist").children)t.classList.toggle("hit",t.id==="src-"+e);e&&Pe("src-"+e).scrollIntoView({block:"center"})};document.querySelectorAll("[role=tab]").forEach(n=>n.addEventListener("click",()=>bc(n.dataset.tab)));Pe("open-notes").addEventListener("click",()=>Tc("transcript"));Pe("close-notes").addEventListener("click",()=>{Pe("notes").hidden=!0});document.addEventListener("click",n=>{const e=n.target.closest("a[data-src]");if(e){n.preventDefault(),Nn(!1),Tc("sources",e.dataset.src);return}const t=n.target.closest("button.go");t&&(Zi(nt.cues[+t.parentElement.dataset.cue].start,!1),Nn(!0))});const k0=B0(Pe("figure")),ni={at:new D,dir:new D,dist:1},Cl=new D,Pl=new D(0,1,0),H0=new Ee(790551),V0=new Ee(395806),W0=new Ee,X0=[100,50,20,10,5,2,1,.5,.2,.1,.05,.02,.01,.005];let Ll=-1,Dl=performance.now(),Ul=!1;function wc(n){const e=Qt((n-Dl)/1e3,0,.1);Dl=n,bn&&(yt+=e*dr,Rt.yaw*=.9,Rt.pitch*=.9,Rt.zoom=it(Rt.zoom,1,.1),yt>=nt.total&&(yt=nt.total,Nn(!1)));const t=nt.state(yt),i=nt.cueAt(yt);nt.camera(yt,ni),Cl.crossVectors(Pl,ni.dir).normalize(),ni.dir.applyAxisAngle(Pl,Rt.yaw).applyAxisAngle(Cl,-Rt.pitch).normalize();const r=ni.dist*Rt.zoom;Ht.position.copy(ni.at).addScaledVector(ni.dir,r),Ht.lookAt(ni.at),Ht.near=r*.02,Ht.far=r*40+900,Ht.updateProjectionMatrix(),Ht.updateMatrixWorld(),gn.setClearColor(W0.copy(H0).lerp(V0,t.night));const s=2*r*Math.tan(ga.degToRad(Ht.fov/2))/Vt,a=s*Vt;if(Ua.update(t,bn?e*dr:e*.35,Ht,a),gn.render(yc,Ht),i.i!==Ll){Ll=i.i,Pe("subtext").innerHTML=xc(i.text),Pe("chapter").textContent=`${i.chapterIndex+1} · ${i.chapter}`;for(const c of Pe("tab-transcript").querySelectorAll("p"))c.classList.toggle("now",+c.dataset.cue===i.i)}const o=yt-i.start>i.move*.55||i.i===0;G0(new Set(o?i.labels:i.labels.filter(c=>nt.cues[Math.max(0,i.i-1)].labels.includes(c))),e);const l=X0.find(c=>c/s<=150)??.005;Pe("scalebar").style.width=l/s+"px",Pe("scaletext").textContent=l>=10?l/10+" cm":l>=1?l+" mm":l*1e3+" µm",Pe("crumb").textContent=a>220?"Head":a>45?"Eye socket":a>9?"Eye":a>.5?"Optic nerve head":"Capillary bed",Pe("gauges").hidden=t.hud<.5,Pe("g-pp").style.width=it(100,45,ct(1,.5,t.flowAll))+"%",Pe("g-flow").style.width=t.flow*100+"%",Pe("g-swell").style.width=t.swelling*100+"%",Pe("g-work").style.width=(1-t.damage)*100+"%",k0.update(i.fig,t),document.body.classList.toggle("night",t.night>.5),bn&&(Pe("scrub").value=Math.round(yt/nt.total*1e3)),Pe("clock").textContent=`${Sa(yt)} / ${Sa(nt.total)}`,Ul||(Ul=!0,Pe("loading").hidden=!0,document.body.classList.add("ready")),requestAnimationFrame(wc)}Nn(!1);requestAnimationFrame(wc);window.__aion={seek:n=>Zi(n),cueStart:n=>nt.cues[n].start,cues:nt.cues.length,total:nt.total,play:()=>Nn(!0)};
