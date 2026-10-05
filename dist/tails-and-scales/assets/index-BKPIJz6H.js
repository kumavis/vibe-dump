(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ta="160",jn={ROTATE:0,DOLLY:1,PAN:2},Xi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Gu=0,rc=1,Vu=2,hh=1,uh=2,Yn=3,_i=0,en=1,pn=2,di=0,xs=1,oc=2,ac=3,cc=4,Wu=5,Ci=100,Xu=101,$u=102,lc=103,hc=104,qu=200,Yu=201,ju=202,Ku=203,da=204,pa=205,Ju=206,Zu=207,Qu=208,tf=209,ef=210,nf=211,sf=212,rf=213,of=214,af=0,cf=1,lf=2,Wr=3,hf=4,uf=5,ff=6,df=7,Aa=0,pf=1,mf=2,pi=0,gf=1,_f=2,vf=3,fh=4,xf=5,Mf=6,dh=300,Es=301,ws=302,ma=303,ga=304,io=306,Xr=1e3,En=1001,_a=1002,ke=1003,uc=1004,bo=1005,tn=1006,yf=1007,Qs=1008,mi=1009,Sf=1010,bf=1011,Ra=1012,ph=1013,ui=1014,fi=1015,tr=1016,mh=1017,gh=1018,Li=1020,Ef=1021,mn=1023,wf=1024,Tf=1025,Di=1026,Ts=1027,Af=1028,_h=1029,Rf=1030,vh=1031,xh=1033,Eo=33776,wo=33777,To=33778,Ao=33779,fc=35840,dc=35841,pc=35842,mc=35843,Mh=36196,gc=37492,_c=37496,vc=37808,xc=37809,Mc=37810,yc=37811,Sc=37812,bc=37813,Ec=37814,wc=37815,Tc=37816,Ac=37817,Rc=37818,Cc=37819,Pc=37820,Lc=37821,Ro=36492,Dc=36494,Ic=36495,Cf=36283,Uc=36284,Nc=36285,Oc=36286,yh=3e3,Ii=3001,Pf=3200,Lf=3201,Ca=0,Df=1,gn="",Ae="srgb",ii="srgb-linear",Pa="display-p3",so="display-p3-linear",$r="linear",fe="srgb",qr="rec709",Yr="p3",$i=7680,zc=519,If=512,Uf=513,Nf=514,Sh=515,Of=516,zf=517,Ff=518,Bf=519,Fc=35044,kf=35048,Bc="300 es",va=1035,Qn=2e3,jr=2001;class Bi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ge=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],kr=Math.PI/180,xa=180/Math.PI;function sr(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ge[i&255]+Ge[i>>8&255]+Ge[i>>16&255]+Ge[i>>24&255]+"-"+Ge[t&255]+Ge[t>>8&255]+"-"+Ge[t>>16&15|64]+Ge[t>>24&255]+"-"+Ge[e&63|128]+Ge[e>>8&255]+"-"+Ge[e>>16&255]+Ge[e>>24&255]+Ge[n&255]+Ge[n>>8&255]+Ge[n>>16&255]+Ge[n>>24&255]).toLowerCase()}function Ne(i,t,e){return Math.max(t,Math.min(e,i))}function Hf(i,t){return(i%t+t)%t}function Co(i,t,e){return(1-e)*i+e*t}function kc(i){return(i&i-1)===0&&i!==0}function Ma(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Fs(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Qe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Gf={DEG2RAD:kr};class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Kt{constructor(t,e,n,s,r,a,o,c,h){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,h)}set(t,e,n,s,r,a,o,c,h){const l=this.elements;return l[0]=t,l[1]=s,l[2]=o,l[3]=e,l[4]=r,l[5]=c,l[6]=n,l[7]=a,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],h=n[1],l=n[4],u=n[7],f=n[2],d=n[5],g=n[8],_=s[0],m=s[3],p=s[6],v=s[1],x=s[4],M=s[7],R=s[2],E=s[5],A=s[8];return r[0]=a*_+o*v+c*R,r[3]=a*m+o*x+c*E,r[6]=a*p+o*M+c*A,r[1]=h*_+l*v+u*R,r[4]=h*m+l*x+u*E,r[7]=h*p+l*M+u*A,r[2]=f*_+d*v+g*R,r[5]=f*m+d*x+g*E,r[8]=f*p+d*M+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8];return e*a*l-e*o*h-n*r*l+n*o*c+s*r*h-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8],u=l*a-o*h,f=o*c-l*r,d=h*r-a*c,g=e*u+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*h-l*n)*_,t[2]=(o*n-s*a)*_,t[3]=f*_,t[4]=(l*e-s*c)*_,t[5]=(s*r-o*e)*_,t[6]=d*_,t[7]=(n*c-h*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*a+h*o)+a+t,-s*h,s*c,-s*(-h*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Po.makeScale(t,e)),this}rotate(t){return this.premultiply(Po.makeRotation(-t)),this}translate(t,e){return this.premultiply(Po.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Po=new Kt;function bh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Kr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Vf(){const i=Kr("canvas");return i.style.display="block",i}const Hc={};function js(i){i in Hc||(Hc[i]=!0,console.warn(i))}const Gc=new Kt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Vc=new Kt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),dr={[ii]:{transfer:$r,primaries:qr,toReference:i=>i,fromReference:i=>i},[Ae]:{transfer:fe,primaries:qr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[so]:{transfer:$r,primaries:Yr,toReference:i=>i.applyMatrix3(Vc),fromReference:i=>i.applyMatrix3(Gc)},[Pa]:{transfer:fe,primaries:Yr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Vc),fromReference:i=>i.applyMatrix3(Gc).convertLinearToSRGB()}},Wf=new Set([ii,so]),le={enabled:!0,_workingColorSpace:ii,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Wf.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=dr[t].toReference,s=dr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return dr[i].primaries},getTransfer:function(i){return i===gn?$r:dr[i].transfer}};function Ms(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Lo(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let qi;class Eh{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{qi===void 0&&(qi=Kr("canvas")),qi.width=t.width,qi.height=t.height;const n=qi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=qi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Kr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ms(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ms(e[n]/255)*255):e[n]=Ms(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Xf=0;class wh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=sr(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Do(s[a].image)):r.push(Do(s[a]))}else r=Do(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Do(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Eh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let $f=0;class Je extends Bi{constructor(t=Je.DEFAULT_IMAGE,e=Je.DEFAULT_MAPPING,n=En,s=En,r=tn,a=Qs,o=mn,c=mi,h=Je.DEFAULT_ANISOTROPY,l=gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$f++}),this.uuid=sr(),this.name="",this.source=new wh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof l=="string"?this.colorSpace=l:(js("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=l===Ii?Ae:gn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==dh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Xr:t.x=t.x-Math.floor(t.x);break;case En:t.x=t.x<0?0:1;break;case _a:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Xr:t.y=t.y-Math.floor(t.y);break;case En:t.y=t.y<0?0:1;break;case _a:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return js("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ae?Ii:yh}set encoding(t){js("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Ii?Ae:gn}}Je.DEFAULT_IMAGE=null;Je.DEFAULT_MAPPING=dh;Je.DEFAULT_ANISOTROPY=1;class pe{constructor(t=0,e=0,n=0,s=1){pe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,h=c[0],l=c[4],u=c[8],f=c[1],d=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(l-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(l+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(h+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(h+1)/2,M=(d+1)/2,R=(p+1)/2,E=(l+f)/4,A=(u+_)/4,U=(g+m)/4;return x>M&&x>R?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=E/n,r=A/n):M>R?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=E/s,r=U/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=A/r,s=U/r),this.set(n,s,r,e),this}let v=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-l)*(f-l));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(u-_)/v,this.z=(f-l)/v,this.w=Math.acos((h+d+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class qf extends Bi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new pe(0,0,t,e),this.scissorTest=!1,this.viewport=new pe(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(js("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Ii?Ae:gn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:tn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Je(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new wh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Oi extends qf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Th extends Je{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ke,this.minFilter=ke,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yf extends Je{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ke,this.minFilter=ke,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Nn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],h=n[s+1],l=n[s+2],u=n[s+3];const f=r[a+0],d=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==f||h!==d||l!==g){let m=1-o;const p=c*f+h*d+l*g+u*_,v=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const R=Math.sqrt(x),E=Math.atan2(R,p*v);m=Math.sin(m*E)/R,o=Math.sin(o*E)/R}const M=o*v;if(c=c*m+f*M,h=h*m+d*M,l=l*m+g*M,u=u*m+_*M,m===1-o){const R=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=R,h*=R,l*=R,u*=R}}t[e]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],c=n[s+1],h=n[s+2],l=n[s+3],u=r[a],f=r[a+1],d=r[a+2],g=r[a+3];return t[e]=o*g+l*u+c*d-h*f,t[e+1]=c*g+l*f+h*u-o*d,t[e+2]=h*g+l*d+o*f-c*u,t[e+3]=l*g-o*u-c*f-h*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,h=o(n/2),l=o(s/2),u=o(r/2),f=c(n/2),d=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=f*l*u+h*d*g,this._y=h*d*u-f*l*g,this._z=h*l*g+f*d*u,this._w=h*l*u-f*d*g;break;case"YXZ":this._x=f*l*u+h*d*g,this._y=h*d*u-f*l*g,this._z=h*l*g-f*d*u,this._w=h*l*u+f*d*g;break;case"ZXY":this._x=f*l*u-h*d*g,this._y=h*d*u+f*l*g,this._z=h*l*g+f*d*u,this._w=h*l*u-f*d*g;break;case"ZYX":this._x=f*l*u-h*d*g,this._y=h*d*u+f*l*g,this._z=h*l*g-f*d*u,this._w=h*l*u+f*d*g;break;case"YZX":this._x=f*l*u+h*d*g,this._y=h*d*u+f*l*g,this._z=h*l*g-f*d*u,this._w=h*l*u-f*d*g;break;case"XZY":this._x=f*l*u-h*d*g,this._y=h*d*u-f*l*g,this._z=h*l*g+f*d*u,this._w=h*l*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],h=e[2],l=e[6],u=e[10],f=n+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(l-c)*d,this._y=(r-h)*d,this._z=(a-s)*d}else if(n>o&&n>u){const d=2*Math.sqrt(1+n-o-u);this._w=(l-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+h)/d}else if(o>u){const d=2*Math.sqrt(1+o-n-u);this._w=(r-h)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+l)/d}else{const d=2*Math.sqrt(1+u-n-o);this._w=(a-s)/d,this._x=(r+h)/d,this._y=(c+l)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ne(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,h=e._z,l=e._w;return this._x=n*l+a*o+s*h-r*c,this._y=s*l+a*c+r*o-n*h,this._z=r*l+a*h+n*c-s*o,this._w=a*l-n*o-s*c-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const h=Math.sqrt(c),l=Math.atan2(h,o),u=Math.sin((1-e)*l)/h,f=Math.sin(e*l)/h;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Wc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Wc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,h=2*(a*s-o*n),l=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+c*h+a*u-o*l,this.y=n+c*l+o*h-r*u,this.z=s+c*u+r*l-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Io.copy(this).projectOnVector(t),this.sub(Io)}reflect(t){return this.sub(Io.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Io=new C,Wc=new Nn;class ki{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(xn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(xn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=xn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,xn):xn.fromBufferAttribute(r,a),xn.applyMatrix4(t.matrixWorld),this.expandByPoint(xn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),pr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),pr.copy(n.boundingBox)),pr.applyMatrix4(t.matrixWorld),this.union(pr)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,xn),xn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Bs),mr.subVectors(this.max,Bs),Yi.subVectors(t.a,Bs),ji.subVectors(t.b,Bs),Ki.subVectors(t.c,Bs),si.subVectors(ji,Yi),ri.subVectors(Ki,ji),yi.subVectors(Yi,Ki);let e=[0,-si.z,si.y,0,-ri.z,ri.y,0,-yi.z,yi.y,si.z,0,-si.x,ri.z,0,-ri.x,yi.z,0,-yi.x,-si.y,si.x,0,-ri.y,ri.x,0,-yi.y,yi.x,0];return!Uo(e,Yi,ji,Ki,mr)||(e=[1,0,0,0,1,0,0,0,1],!Uo(e,Yi,ji,Ki,mr))?!1:(gr.crossVectors(si,ri),e=[gr.x,gr.y,gr.z],Uo(e,Yi,ji,Ki,mr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,xn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(xn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Gn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Gn=[new C,new C,new C,new C,new C,new C,new C,new C],xn=new C,pr=new ki,Yi=new C,ji=new C,Ki=new C,si=new C,ri=new C,yi=new C,Bs=new C,mr=new C,gr=new C,Si=new C;function Uo(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Si.fromArray(i,r);const o=s.x*Math.abs(Si.x)+s.y*Math.abs(Si.y)+s.z*Math.abs(Si.z),c=t.dot(Si),h=e.dot(Si),l=n.dot(Si);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>o)return!1}return!0}const jf=new ki,ks=new C,No=new C;class Ls{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):jf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ks.subVectors(t,this.center);const e=ks.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ks,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(No.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ks.copy(t.center).add(No)),this.expandByPoint(ks.copy(t.center).sub(No))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Vn=new C,Oo=new C,_r=new C,oi=new C,zo=new C,vr=new C,Fo=new C;class ro{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Vn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Vn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Vn.copy(this.origin).addScaledVector(this.direction,e),Vn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Oo.copy(t).add(e).multiplyScalar(.5),_r.copy(e).sub(t).normalize(),oi.copy(this.origin).sub(Oo);const r=t.distanceTo(e)*.5,a=-this.direction.dot(_r),o=oi.dot(this.direction),c=-oi.dot(_r),h=oi.lengthSq(),l=Math.abs(1-a*a);let u,f,d,g;if(l>0)if(u=a*c-o,f=a*o-c,g=r*l,u>=0)if(f>=-g)if(f<=g){const _=1/l;u*=_,f*=_,d=u*(u+a*f+2*o)+f*(a*u+f+2*c)+h}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+h;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+h;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+h):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+h):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+h);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Oo).addScaledVector(_r,f),d}intersectSphere(t,e){Vn.subVectors(t.center,this.origin);const n=Vn.dot(this.direction),s=Vn.dot(Vn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c;const h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,f=this.origin;return h>=0?(n=(t.min.x-f.x)*h,s=(t.max.x-f.x)*h):(n=(t.max.x-f.x)*h,s=(t.min.x-f.x)*h),l>=0?(r=(t.min.y-f.y)*l,a=(t.max.y-f.y)*l):(r=(t.max.y-f.y)*l,a=(t.min.y-f.y)*l),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Vn)!==null}intersectTriangle(t,e,n,s,r){zo.subVectors(e,t),vr.subVectors(n,t),Fo.crossVectors(zo,vr);let a=this.direction.dot(Fo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;oi.subVectors(this.origin,t);const c=o*this.direction.dot(vr.crossVectors(oi,vr));if(c<0)return null;const h=o*this.direction.dot(zo.cross(oi));if(h<0||c+h>a)return null;const l=-o*oi.dot(Fo);return l<0?null:this.at(l/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ae{constructor(t,e,n,s,r,a,o,c,h,l,u,f,d,g,_,m){ae.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,h,l,u,f,d,g,_,m)}set(t,e,n,s,r,a,o,c,h,l,u,f,d,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=h,p[6]=l,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ae().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ji.setFromMatrixColumn(t,0).length(),r=1/Ji.setFromMatrixColumn(t,1).length(),a=1/Ji.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*l,d=a*u,g=o*l,_=o*u;e[0]=c*l,e[4]=-c*u,e[8]=h,e[1]=d+g*h,e[5]=f-_*h,e[9]=-o*c,e[2]=_-f*h,e[6]=g+d*h,e[10]=a*c}else if(t.order==="YXZ"){const f=c*l,d=c*u,g=h*l,_=h*u;e[0]=f+_*o,e[4]=g*o-d,e[8]=a*h,e[1]=a*u,e[5]=a*l,e[9]=-o,e[2]=d*o-g,e[6]=_+f*o,e[10]=a*c}else if(t.order==="ZXY"){const f=c*l,d=c*u,g=h*l,_=h*u;e[0]=f-_*o,e[4]=-a*u,e[8]=g+d*o,e[1]=d+g*o,e[5]=a*l,e[9]=_-f*o,e[2]=-a*h,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const f=a*l,d=a*u,g=o*l,_=o*u;e[0]=c*l,e[4]=g*h-d,e[8]=f*h+_,e[1]=c*u,e[5]=_*h+f,e[9]=d*h-g,e[2]=-h,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,d=a*h,g=o*c,_=o*h;e[0]=c*l,e[4]=_-f*u,e[8]=g*u+d,e[1]=u,e[5]=a*l,e[9]=-o*l,e[2]=-h*l,e[6]=d*u+g,e[10]=f-_*u}else if(t.order==="XZY"){const f=a*c,d=a*h,g=o*c,_=o*h;e[0]=c*l,e[4]=-u,e[8]=h*l,e[1]=f*u+_,e[5]=a*l,e[9]=d*u-g,e[2]=g*u-d,e[6]=o*l,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Kf,t,Jf)}lookAt(t,e,n){const s=this.elements;return rn.subVectors(t,e),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),ai.crossVectors(n,rn),ai.lengthSq()===0&&(Math.abs(n.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),ai.crossVectors(n,rn)),ai.normalize(),xr.crossVectors(rn,ai),s[0]=ai.x,s[4]=xr.x,s[8]=rn.x,s[1]=ai.y,s[5]=xr.y,s[9]=rn.y,s[2]=ai.z,s[6]=xr.z,s[10]=rn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],h=n[12],l=n[1],u=n[5],f=n[9],d=n[13],g=n[2],_=n[6],m=n[10],p=n[14],v=n[3],x=n[7],M=n[11],R=n[15],E=s[0],A=s[4],U=s[8],y=s[12],w=s[1],H=s[5],G=s[9],tt=s[13],I=s[2],F=s[6],W=s[10],Y=s[14],$=s[3],q=s[7],j=s[11],ot=s[15];return r[0]=a*E+o*w+c*I+h*$,r[4]=a*A+o*H+c*F+h*q,r[8]=a*U+o*G+c*W+h*j,r[12]=a*y+o*tt+c*Y+h*ot,r[1]=l*E+u*w+f*I+d*$,r[5]=l*A+u*H+f*F+d*q,r[9]=l*U+u*G+f*W+d*j,r[13]=l*y+u*tt+f*Y+d*ot,r[2]=g*E+_*w+m*I+p*$,r[6]=g*A+_*H+m*F+p*q,r[10]=g*U+_*G+m*W+p*j,r[14]=g*y+_*tt+m*Y+p*ot,r[3]=v*E+x*w+M*I+R*$,r[7]=v*A+x*H+M*F+R*q,r[11]=v*U+x*G+M*W+R*j,r[15]=v*y+x*tt+M*Y+R*ot,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],h=t[13],l=t[2],u=t[6],f=t[10],d=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*c*u-s*h*u-r*o*f+n*h*f+s*o*d-n*c*d)+_*(+e*c*d-e*h*f+r*a*f-s*a*d+s*h*l-r*c*l)+m*(+e*h*u-e*o*d-r*a*u+n*a*d+r*o*l-n*h*l)+p*(-s*o*l-e*c*u+e*o*f+s*a*u-n*a*f+n*c*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8],u=t[9],f=t[10],d=t[11],g=t[12],_=t[13],m=t[14],p=t[15],v=u*m*h-_*f*h+_*c*d-o*m*d-u*c*p+o*f*p,x=g*f*h-l*m*h-g*c*d+a*m*d+l*c*p-a*f*p,M=l*_*h-g*u*h+g*o*d-a*_*d-l*o*p+a*u*p,R=g*u*c-l*_*c-g*o*f+a*_*f+l*o*m-a*u*m,E=e*v+n*x+s*M+r*R;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=v*A,t[1]=(_*f*r-u*m*r-_*s*d+n*m*d+u*s*p-n*f*p)*A,t[2]=(o*m*r-_*c*r+_*s*h-n*m*h-o*s*p+n*c*p)*A,t[3]=(u*c*r-o*f*r-u*s*h+n*f*h+o*s*d-n*c*d)*A,t[4]=x*A,t[5]=(l*m*r-g*f*r+g*s*d-e*m*d-l*s*p+e*f*p)*A,t[6]=(g*c*r-a*m*r-g*s*h+e*m*h+a*s*p-e*c*p)*A,t[7]=(a*f*r-l*c*r+l*s*h-e*f*h-a*s*d+e*c*d)*A,t[8]=M*A,t[9]=(g*u*r-l*_*r-g*n*d+e*_*d+l*n*p-e*u*p)*A,t[10]=(a*_*r-g*o*r+g*n*h-e*_*h-a*n*p+e*o*p)*A,t[11]=(l*o*r-a*u*r-l*n*h+e*u*h+a*n*d-e*o*d)*A,t[12]=R*A,t[13]=(l*_*s-g*u*s+g*n*f-e*_*f-l*n*m+e*u*m)*A,t[14]=(g*o*s-a*_*s-g*n*c+e*_*c+a*n*m-e*o*m)*A,t[15]=(a*u*s-l*o*s+l*n*c-e*u*c-a*n*f+e*o*f)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,h=r*a,l=r*o;return this.set(h*a+n,h*o-s*c,h*c+s*o,0,h*o+s*c,l*o+n,l*c-s*a,0,h*c-s*o,l*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,h=r+r,l=a+a,u=o+o,f=r*h,d=r*l,g=r*u,_=a*l,m=a*u,p=o*u,v=c*h,x=c*l,M=c*u,R=n.x,E=n.y,A=n.z;return s[0]=(1-(_+p))*R,s[1]=(d+M)*R,s[2]=(g-x)*R,s[3]=0,s[4]=(d-M)*E,s[5]=(1-(f+p))*E,s[6]=(m+v)*E,s[7]=0,s[8]=(g+x)*A,s[9]=(m-v)*A,s[10]=(1-(f+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ji.set(s[0],s[1],s[2]).length();const a=Ji.set(s[4],s[5],s[6]).length(),o=Ji.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Mn.copy(this);const h=1/r,l=1/a,u=1/o;return Mn.elements[0]*=h,Mn.elements[1]*=h,Mn.elements[2]*=h,Mn.elements[4]*=l,Mn.elements[5]*=l,Mn.elements[6]*=l,Mn.elements[8]*=u,Mn.elements[9]*=u,Mn.elements[10]*=u,e.setFromRotationMatrix(Mn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Qn){const c=this.elements,h=2*r/(e-t),l=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let d,g;if(o===Qn)d=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===jr)d=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Qn){const c=this.elements,h=1/(e-t),l=1/(n-s),u=1/(a-r),f=(e+t)*h,d=(n+s)*l;let g,_;if(o===Qn)g=(a+r)*u,_=-2*u;else if(o===jr)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ji=new C,Mn=new ae,Kf=new C(0,0,0),Jf=new C(1,1,1),ai=new C,xr=new C,rn=new C,Xc=new ae,$c=new Nn;class Ds{constructor(t=0,e=0,n=0,s=Ds.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],l=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ne(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ne(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-l,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Xc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Xc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return $c.setFromEuler(this),this.setFromQuaternion($c,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ds.DEFAULT_ORDER="XYZ";class La{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Zf=0;const qc=new C,Zi=new Nn,Wn=new ae,Mr=new C,Hs=new C,Qf=new C,td=new Nn,Yc=new C(1,0,0),jc=new C(0,1,0),Kc=new C(0,0,1),ed={type:"added"},nd={type:"removed"};class Oe extends Bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=sr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Oe.DEFAULT_UP.clone();const t=new C,e=new Ds,n=new Nn,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new Kt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=Oe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new La,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Zi.setFromAxisAngle(t,e),this.quaternion.multiply(Zi),this}rotateOnWorldAxis(t,e){return Zi.setFromAxisAngle(t,e),this.quaternion.premultiply(Zi),this}rotateX(t){return this.rotateOnAxis(Yc,t)}rotateY(t){return this.rotateOnAxis(jc,t)}rotateZ(t){return this.rotateOnAxis(Kc,t)}translateOnAxis(t,e){return qc.copy(t).applyQuaternion(this.quaternion),this.position.add(qc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Yc,t)}translateY(t){return this.translateOnAxis(jc,t)}translateZ(t){return this.translateOnAxis(Kc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Wn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Mr.copy(t):Mr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Hs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wn.lookAt(Hs,Mr,this.up):Wn.lookAt(Mr,Hs,this.up),this.quaternion.setFromRotationMatrix(Wn),s&&(Wn.extractRotation(s.matrixWorld),Zi.setFromRotationMatrix(Wn),this.quaternion.premultiply(Zi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(ed)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(nd)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Wn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Wn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Wn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hs,t,Qf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hs,td,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){const u=c[h];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),h=a(t.textures),l=a(t.images),u=a(t.shapes),f=a(t.skeletons),d=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),l.length>0&&(n.images=l),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const h in o){const l=o[h];delete l.metadata,c.push(l)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Oe.DEFAULT_UP=new C(0,1,0);Oe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const yn=new C,Xn=new C,Bo=new C,$n=new C,Qi=new C,ts=new C,Jc=new C,ko=new C,Ho=new C,Go=new C;let yr=!1;class bn{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),yn.subVectors(t,e),s.cross(yn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){yn.subVectors(s,e),Xn.subVectors(n,e),Bo.subVectors(t,e);const a=yn.dot(yn),o=yn.dot(Xn),c=yn.dot(Bo),h=Xn.dot(Xn),l=Xn.dot(Bo),u=a*h-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(h*c-o*l)*f,g=(a*l-o*c)*f;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,$n)===null?!1:$n.x>=0&&$n.y>=0&&$n.x+$n.y<=1}static getUV(t,e,n,s,r,a,o,c){return yr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),yr=!0),this.getInterpolation(t,e,n,s,r,a,o,c)}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,$n)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,$n.x),c.addScaledVector(a,$n.y),c.addScaledVector(o,$n.z),c)}static isFrontFacing(t,e,n,s){return yn.subVectors(n,e),Xn.subVectors(t,e),yn.cross(Xn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return yn.subVectors(this.c,this.b),Xn.subVectors(this.a,this.b),yn.cross(Xn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return bn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return bn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return yr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),yr=!0),bn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return bn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return bn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return bn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Qi.subVectors(s,n),ts.subVectors(r,n),ko.subVectors(t,n);const c=Qi.dot(ko),h=ts.dot(ko);if(c<=0&&h<=0)return e.copy(n);Ho.subVectors(t,s);const l=Qi.dot(Ho),u=ts.dot(Ho);if(l>=0&&u<=l)return e.copy(s);const f=c*u-l*h;if(f<=0&&c>=0&&l<=0)return a=c/(c-l),e.copy(n).addScaledVector(Qi,a);Go.subVectors(t,r);const d=Qi.dot(Go),g=ts.dot(Go);if(g>=0&&d<=g)return e.copy(r);const _=d*h-c*g;if(_<=0&&h>=0&&g<=0)return o=h/(h-g),e.copy(n).addScaledVector(ts,o);const m=l*g-d*u;if(m<=0&&u-l>=0&&d-g>=0)return Jc.subVectors(r,s),o=(u-l)/(u-l+(d-g)),e.copy(s).addScaledVector(Jc,o);const p=1/(m+_+f);return a=_*p,o=f*p,e.copy(n).addScaledVector(Qi,a).addScaledVector(ts,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ah={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ci={h:0,s:0,l:0},Sr={h:0,s:0,l:0};function Vo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class $t{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ae){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=le.workingColorSpace){return this.r=t,this.g=e,this.b=n,le.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=le.workingColorSpace){if(t=Hf(t,1),e=Ne(e,0,1),n=Ne(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Vo(a,r,t+1/3),this.g=Vo(a,r,t),this.b=Vo(a,r,t-1/3)}return le.toWorkingColorSpace(this,s),this}setStyle(t,e=Ae){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ae){const n=Ah[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ms(t.r),this.g=Ms(t.g),this.b=Ms(t.b),this}copyLinearToSRGB(t){return this.r=Lo(t.r),this.g=Lo(t.g),this.b=Lo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ae){return le.fromWorkingColorSpace(Ve.copy(this),t),Math.round(Ne(Ve.r*255,0,255))*65536+Math.round(Ne(Ve.g*255,0,255))*256+Math.round(Ne(Ve.b*255,0,255))}getHexString(t=Ae){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.fromWorkingColorSpace(Ve.copy(this),e);const n=Ve.r,s=Ve.g,r=Ve.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,h;const l=(o+a)/2;if(o===a)c=0,h=0;else{const u=a-o;switch(h=l<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=h,t.l=l,t}getRGB(t,e=le.workingColorSpace){return le.fromWorkingColorSpace(Ve.copy(this),e),t.r=Ve.r,t.g=Ve.g,t.b=Ve.b,t}getStyle(t=Ae){le.fromWorkingColorSpace(Ve.copy(this),t);const e=Ve.r,n=Ve.g,s=Ve.b;return t!==Ae?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ci),this.setHSL(ci.h+t,ci.s+e,ci.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ci),t.getHSL(Sr);const n=Co(ci.h,Sr.h,e),s=Co(ci.s,Sr.s,e),r=Co(ci.l,Sr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ve=new $t;$t.NAMES=Ah;let id=0;class Hi extends Bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:id++}),this.uuid=sr(),this.name="",this.type="Material",this.blending=xs,this.side=_i,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=da,this.blendDst=pa,this.blendEquation=Ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $t(0,0,0),this.blendAlpha=0,this.depthFunc=Wr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=zc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$i,this.stencilZFail=$i,this.stencilZPass=$i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==xs&&(n.blending=this.blending),this.side!==_i&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==da&&(n.blendSrc=this.blendSrc),this.blendDst!==pa&&(n.blendDst=this.blendDst),this.blendEquation!==Ci&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Wr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==zc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==$i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==$i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==$i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class je extends Hi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Aa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Te=new C,br=new ht;class hn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Fc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=fi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)br.fromBufferAttribute(this,e),br.applyMatrix3(t),this.setXY(e,br.x,br.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix3(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Fs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Qe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Fs(e,this.array)),e}setX(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Fs(e,this.array)),e}setY(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Fs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Fs(e,this.array)),e}setW(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Qe(e,this.array),n=Qe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Qe(e,this.array),n=Qe(n,this.array),s=Qe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Qe(e,this.array),n=Qe(n,this.array),s=Qe(s,this.array),r=Qe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Fc&&(t.usage=this.usage),t}}class Rh extends hn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Ch extends hn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ne extends hn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let sd=0;const dn=new ae,Wo=new Oe,es=new C,on=new ki,Gs=new ki,Ue=new C;class Ee extends Bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:sd++}),this.uuid=sr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(bh(t)?Ch:Rh)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return dn.makeRotationFromQuaternion(t),this.applyMatrix4(dn),this}rotateX(t){return dn.makeRotationX(t),this.applyMatrix4(dn),this}rotateY(t){return dn.makeRotationY(t),this.applyMatrix4(dn),this}rotateZ(t){return dn.makeRotationZ(t),this.applyMatrix4(dn),this}translate(t,e,n){return dn.makeTranslation(t,e,n),this.applyMatrix4(dn),this}scale(t,e,n){return dn.makeScale(t,e,n),this.applyMatrix4(dn),this}lookAt(t){return Wo.lookAt(t),Wo.updateMatrix(),this.applyMatrix4(Wo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(es).negate(),this.translate(es.x,es.y,es.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ne(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ki);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];on.setFromBufferAttribute(r),this.morphTargetsRelative?(Ue.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(Ue),Ue.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(Ue)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ls);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(on.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Gs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ue.addVectors(on.min,Gs.min),on.expandByPoint(Ue),Ue.addVectors(on.max,Gs.max),on.expandByPoint(Ue)):(on.expandByPoint(Gs.min),on.expandByPoint(Gs.max))}on.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ue.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ue));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let h=0,l=o.count;h<l;h++)Ue.fromBufferAttribute(o,h),c&&(es.fromBufferAttribute(t,h),Ue.add(es)),s=Math.max(s,n.distanceToSquared(Ue))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new hn(new Float32Array(4*o),4));const c=this.getAttribute("tangent").array,h=[],l=[];for(let w=0;w<o;w++)h[w]=new C,l[w]=new C;const u=new C,f=new C,d=new C,g=new ht,_=new ht,m=new ht,p=new C,v=new C;function x(w,H,G){u.fromArray(s,w*3),f.fromArray(s,H*3),d.fromArray(s,G*3),g.fromArray(a,w*2),_.fromArray(a,H*2),m.fromArray(a,G*2),f.sub(u),d.sub(u),_.sub(g),m.sub(g);const tt=1/(_.x*m.y-m.x*_.y);isFinite(tt)&&(p.copy(f).multiplyScalar(m.y).addScaledVector(d,-_.y).multiplyScalar(tt),v.copy(d).multiplyScalar(_.x).addScaledVector(f,-m.x).multiplyScalar(tt),h[w].add(p),h[H].add(p),h[G].add(p),l[w].add(v),l[H].add(v),l[G].add(v))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let w=0,H=M.length;w<H;++w){const G=M[w],tt=G.start,I=G.count;for(let F=tt,W=tt+I;F<W;F+=3)x(n[F+0],n[F+1],n[F+2])}const R=new C,E=new C,A=new C,U=new C;function y(w){A.fromArray(r,w*3),U.copy(A);const H=h[w];R.copy(H),R.sub(A.multiplyScalar(A.dot(H))).normalize(),E.crossVectors(U,H);const tt=E.dot(l[w])<0?-1:1;c[w*4]=R.x,c[w*4+1]=R.y,c[w*4+2]=R.z,c[w*4+3]=tt}for(let w=0,H=M.length;w<H;++w){const G=M[w],tt=G.start,I=G.count;for(let F=tt,W=tt+I;F<W;F+=3)y(n[F+0]),y(n[F+1]),y(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new hn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new C,r=new C,a=new C,o=new C,c=new C,h=new C,l=new C,u=new C;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,m),o.add(l),c.add(l),h.add(l),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,h.x,h.y,h.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),n.setXYZ(f+0,l.x,l.y,l.z),n.setXYZ(f+1,l.x,l.y,l.z),n.setXYZ(f+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ue.fromBufferAttribute(t,e),Ue.normalize(),t.setXYZ(e,Ue.x,Ue.y,Ue.z)}toNonIndexed(){function t(o,c){const h=o.array,l=o.itemSize,u=o.normalized,f=new h.constructor(c.length*l);let d=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?d=c[_]*o.data.stride+o.offset:d=c[_]*l;for(let p=0;p<l;p++)f[g++]=h[d++]}return new hn(f,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ee,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],h=t(c,n);e.setAttribute(o,h)}const r=this.morphAttributes;for(const o in r){const c=[],h=r[o];for(let l=0,u=h.length;l<u;l++){const f=h[l],d=t(f,n);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const h=a[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const h=n[c];t.data.attributes[c]=h.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],l=[];for(let u=0,f=h.length;u<f;u++){const d=h[u];l.push(d.toJSON(t.data))}l.length>0&&(s[c]=l,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const h in s){const l=s[h];this.setAttribute(h,l.clone(e))}const r=t.morphAttributes;for(const h in r){const l=[],u=r[h];for(let f=0,d=u.length;f<d;f++)l.push(u[f].clone(e));this.morphAttributes[h]=l}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let h=0,l=a.length;h<l;h++){const u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Zc=new ae,bi=new ro,Er=new Ls,Qc=new C,ns=new C,is=new C,ss=new C,Xo=new C,wr=new C,Tr=new ht,Ar=new ht,Rr=new ht,tl=new C,el=new C,nl=new C,Cr=new C,Pr=new C;class kt extends Oe{constructor(t=new Ee,e=new je){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){wr.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const l=o[c],u=r[c];l!==0&&(Xo.fromBufferAttribute(u,t),a?wr.addScaledVector(Xo,l):wr.addScaledVector(Xo.sub(e),l))}e.add(wr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Er.copy(n.boundingSphere),Er.applyMatrix4(r),bi.copy(t.ray).recast(t.near),!(Er.containsPoint(bi.origin)===!1&&(bi.intersectSphere(Er,Qc)===null||bi.origin.distanceToSquared(Qc)>(t.far-t.near)**2))&&(Zc.copy(r).invert(),bi.copy(t.ray).applyMatrix4(Zc),!(n.boundingBox!==null&&bi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,bi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=a[m.materialIndex],v=Math.max(m.start,d.start),x=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let M=v,R=x;M<R;M+=3){const E=o.getX(M),A=o.getX(M+1),U=o.getX(M+2);s=Lr(this,p,t,n,h,l,u,E,A,U),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const v=o.getX(m),x=o.getX(m+1),M=o.getX(m+2);s=Lr(this,a,t,n,h,l,u,v,x,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=a[m.materialIndex],v=Math.max(m.start,d.start),x=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let M=v,R=x;M<R;M+=3){const E=M,A=M+1,U=M+2;s=Lr(this,p,t,n,h,l,u,E,A,U),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const v=m,x=m+1,M=m+2;s=Lr(this,a,t,n,h,l,u,v,x,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function rd(i,t,e,n,s,r,a,o){let c;if(t.side===en?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===_i,o),c===null)return null;Pr.copy(o),Pr.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(Pr);return h<e.near||h>e.far?null:{distance:h,point:Pr.clone(),object:i}}function Lr(i,t,e,n,s,r,a,o,c,h){i.getVertexPosition(o,ns),i.getVertexPosition(c,is),i.getVertexPosition(h,ss);const l=rd(i,t,e,n,ns,is,ss,Cr);if(l){s&&(Tr.fromBufferAttribute(s,o),Ar.fromBufferAttribute(s,c),Rr.fromBufferAttribute(s,h),l.uv=bn.getInterpolation(Cr,ns,is,ss,Tr,Ar,Rr,new ht)),r&&(Tr.fromBufferAttribute(r,o),Ar.fromBufferAttribute(r,c),Rr.fromBufferAttribute(r,h),l.uv1=bn.getInterpolation(Cr,ns,is,ss,Tr,Ar,Rr,new ht),l.uv2=l.uv1),a&&(tl.fromBufferAttribute(a,o),el.fromBufferAttribute(a,c),nl.fromBufferAttribute(a,h),l.normal=bn.getInterpolation(Cr,ns,is,ss,tl,el,nl,new C),l.normal.dot(n.direction)>0&&l.normal.multiplyScalar(-1));const u={a:o,b:c,c:h,normal:new C,materialIndex:0};bn.getNormal(ns,is,ss,u.normal),l.face=u}return l}class On extends Ee{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],h=[],l=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ne(h,3)),this.setAttribute("normal",new ne(l,3)),this.setAttribute("uv",new ne(u,2));function g(_,m,p,v,x,M,R,E,A,U,y){const w=M/A,H=R/U,G=M/2,tt=R/2,I=E/2,F=A+1,W=U+1;let Y=0,$=0;const q=new C;for(let j=0;j<W;j++){const ot=j*H-tt;for(let at=0;at<F;at++){const X=at*w-G;q[_]=X*v,q[m]=ot*x,q[p]=I,h.push(q.x,q.y,q.z),q[_]=0,q[m]=0,q[p]=E>0?1:-1,l.push(q.x,q.y,q.z),u.push(at/A),u.push(1-j/U),Y+=1}}for(let j=0;j<U;j++)for(let ot=0;ot<A;ot++){const at=f+ot+F*j,X=f+ot+F*(j+1),K=f+(ot+1)+F*(j+1),pt=f+(ot+1)+F*j;c.push(at,X,pt),c.push(X,K,pt),$+=6}o.addGroup(d,$,y),d+=$,f+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new On(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function As(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function qe(i){const t={};for(let e=0;e<i.length;e++){const n=As(i[e]);for(const s in n)t[s]=n[s]}return t}function od(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Ph(i){return i.getRenderTarget()===null?i.outputColorSpace:le.workingColorSpace}const ad={clone:As,merge:qe};var cd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ld=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class zi extends Hi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cd,this.fragmentShader=ld,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=As(t.uniforms),this.uniformsGroups=od(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Lh extends Oe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Qn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class cn extends Lh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=xa*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(kr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return xa*2*Math.atan(Math.tan(kr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(kr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/h,s*=a.width/c,n*=a.height/h}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const rs=-90,os=1;class hd extends Oe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new cn(rs,os,t,e);s.layers=this.layers,this.add(s);const r=new cn(rs,os,t,e);r.layers=this.layers,this.add(r);const a=new cn(rs,os,t,e);a.layers=this.layers,this.add(a);const o=new cn(rs,os,t,e);o.layers=this.layers,this.add(o);const c=new cn(rs,os,t,e);c.layers=this.layers,this.add(c);const h=new cn(rs,os,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(const h of e)this.remove(h);if(t===Qn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===jr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,h,l]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,l),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Dh extends Je{constructor(t,e,n,s,r,a,o,c,h,l){t=t!==void 0?t:[],e=e!==void 0?e:Es,super(t,e,n,s,r,a,o,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ud extends Oi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(js("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Ii?Ae:gn),this.texture=new Dh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:tn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new On(5,5,5),r=new zi({name:"CubemapFromEquirect",uniforms:As(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:di});r.uniforms.tEquirect.value=e;const a=new kt(s,r),o=e.minFilter;return e.minFilter===Qs&&(e.minFilter=tn),new hd(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const $o=new C,fd=new C,dd=new Kt;class hi{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=$o.subVectors(n,e).cross(fd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta($o),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||dd.getNormalMatrix(t),s=this.coplanarPoint($o).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ei=new Ls,Dr=new C;class Da{constructor(t=new hi,e=new hi,n=new hi,s=new hi,r=new hi,a=new hi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Qn){const n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],h=s[4],l=s[5],u=s[6],f=s[7],d=s[8],g=s[9],_=s[10],m=s[11],p=s[12],v=s[13],x=s[14],M=s[15];if(n[0].setComponents(c-r,f-h,m-d,M-p).normalize(),n[1].setComponents(c+r,f+h,m+d,M+p).normalize(),n[2].setComponents(c+a,f+l,m+g,M+v).normalize(),n[3].setComponents(c-a,f-l,m-g,M-v).normalize(),n[4].setComponents(c-o,f-u,m-_,M-x).normalize(),e===Qn)n[5].setComponents(c+o,f+u,m+_,M+x).normalize();else if(e===jr)n[5].setComponents(o,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ei.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ei.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ei)}intersectsSprite(t){return Ei.center.set(0,0,0),Ei.radius=.7071067811865476,Ei.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ei)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Dr.x=s.normal.x>0?t.max.x:t.min.x,Dr.y=s.normal.y>0?t.max.y:t.min.y,Dr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Dr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ih(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function pd(i,t){const e=t.isWebGL2,n=new WeakMap;function s(h,l){const u=h.array,f=h.usage,d=u.byteLength,g=i.createBuffer();i.bindBuffer(l,g),i.bufferData(l,u,f),h.onUploadCallback();let _;if(u instanceof Float32Array)_=i.FLOAT;else if(u instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=i.SHORT;else if(u instanceof Uint32Array)_=i.UNSIGNED_INT;else if(u instanceof Int32Array)_=i.INT;else if(u instanceof Int8Array)_=i.BYTE;else if(u instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:h.version,size:d}}function r(h,l,u){const f=l.array,d=l._updateRange,g=l.updateRanges;if(i.bindBuffer(u,h),d.count===-1&&g.length===0&&i.bufferSubData(u,0,f),g.length!==0){for(let _=0,m=g.length;_<m;_++){const p=g[_];e?i.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f,p.start,p.count):i.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f.subarray(p.start,p.start+p.count))}l.clearUpdateRanges()}d.count!==-1&&(e?i.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f,d.offset,d.count):i.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f.subarray(d.offset,d.offset+d.count)),d.count=-1),l.onUploadCallback()}function a(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function o(h){h.isInterleavedBufferAttribute&&(h=h.data);const l=n.get(h);l&&(i.deleteBuffer(l.buffer),n.delete(h))}function c(h,l){if(h.isGLBufferAttribute){const f=n.get(h);(!f||f.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);const u=n.get(h);if(u===void 0)n.set(h,s(h,l));else if(u.version<h.version){if(u.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,h,l),u.version=h.version}}return{get:a,remove:o,update:c}}class vi extends Ee{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),h=o+1,l=c+1,u=t/o,f=e/c,d=[],g=[],_=[],m=[];for(let p=0;p<l;p++){const v=p*f-a;for(let x=0;x<h;x++){const M=x*u-r;g.push(M,-v,0),_.push(0,0,1),m.push(x/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<o;v++){const x=v+h*p,M=v+h*(p+1),R=v+1+h*(p+1),E=v+1+h*p;d.push(x,M,E),d.push(M,R,E)}this.setIndex(d),this.setAttribute("position",new ne(g,3)),this.setAttribute("normal",new ne(_,3)),this.setAttribute("uv",new ne(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vi(t.width,t.height,t.widthSegments,t.heightSegments)}}var md=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,gd=`#ifdef USE_ALPHAHASH
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
#endif`,_d=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xd=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Md=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,yd=`#ifdef USE_AOMAP
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
#endif`,Sd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,bd=`#ifdef USE_BATCHING
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
#endif`,Ed=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,wd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Td=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ad=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Rd=`#ifdef USE_IRIDESCENCE
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
#endif`,Cd=`#ifdef USE_BUMPMAP
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
#endif`,Pd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ld=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Dd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Id=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ud=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Nd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Od=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,zd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Fd=`#define PI 3.141592653589793
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
} // validated`,Bd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,kd=`vec3 transformedNormal = objectNormal;
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
#endif`,Hd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Gd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Vd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Wd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xd="gl_FragColor = linearToOutputTexel( gl_FragColor );",$d=`
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
}`,qd=`#ifdef USE_ENVMAP
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
#endif`,Yd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,jd=`#ifdef USE_ENVMAP
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
#endif`,Kd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Jd=`#ifdef USE_ENVMAP
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
#endif`,Zd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ep=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,np=`#ifdef USE_GRADIENTMAP
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
}`,ip=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,sp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,rp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,op=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ap=`uniform bool receiveShadow;
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
#endif`,cp=`#ifdef USE_ENVMAP
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
#endif`,lp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,hp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,up=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,dp=`PhysicalMaterial material;
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
#endif`,pp=`struct PhysicalMaterial {
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
}`,mp=`
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
#endif`,gp=`#if defined( RE_IndirectDiffuse )
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
#endif`,_p=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,vp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Mp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,yp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Sp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,bp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ep=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,wp=`#if defined( USE_POINTS_UV )
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
#endif`,Tp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ap=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Rp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Cp=`#ifdef USE_MORPHNORMALS
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
#endif`,Pp=`#ifdef USE_MORPHTARGETS
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
#endif`,Lp=`#ifdef USE_MORPHTARGETS
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
#endif`,Dp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ip=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Np=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Op=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,zp=`#ifdef USE_NORMALMAP
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
#endif`,Fp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Bp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Hp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Gp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Vp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Wp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,$p=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,qp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,jp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Kp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Jp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Zp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Qp=`float getShadowMask() {
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
}`,tm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,em=`#ifdef USE_SKINNING
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
#endif`,nm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,im=`#ifdef USE_SKINNING
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
#endif`,sm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,rm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,om=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,am=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,cm=`#ifdef USE_TRANSMISSION
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
#endif`,lm=`#ifdef USE_TRANSMISSION
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
#endif`,hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const pm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,mm=`uniform sampler2D t2D;
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
}`,gm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_m=`#ifdef ENVMAP_TYPE_CUBE
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
}`,vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mm=`#include <common>
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
}`,ym=`#if DEPTH_PACKING == 3200
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
}`,Sm=`#define DISTANCE
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
}`,bm=`#define DISTANCE
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
}`,Em=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,wm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tm=`uniform float scale;
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
}`,Am=`uniform vec3 diffuse;
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
}`,Rm=`#include <common>
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
}`,Cm=`uniform vec3 diffuse;
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
}`,Pm=`#define LAMBERT
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
}`,Lm=`#define LAMBERT
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
}`,Dm=`#define MATCAP
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
}`,Im=`#define MATCAP
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
}`,Um=`#define NORMAL
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
}`,Nm=`#define NORMAL
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
}`,Om=`#define PHONG
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
}`,zm=`#define PHONG
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
}`,Bm=`#define STANDARD
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
}`,km=`#define TOON
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
}`,Hm=`#define TOON
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
}`,Gm=`uniform float size;
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
}`,Wm=`#include <common>
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
}`,Xm=`uniform vec3 color;
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
}`,$m=`uniform float rotation;
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
}`,qm=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:md,alphahash_pars_fragment:gd,alphamap_fragment:_d,alphamap_pars_fragment:vd,alphatest_fragment:xd,alphatest_pars_fragment:Md,aomap_fragment:yd,aomap_pars_fragment:Sd,batching_pars_vertex:bd,batching_vertex:Ed,begin_vertex:wd,beginnormal_vertex:Td,bsdfs:Ad,iridescence_fragment:Rd,bumpmap_pars_fragment:Cd,clipping_planes_fragment:Pd,clipping_planes_pars_fragment:Ld,clipping_planes_pars_vertex:Dd,clipping_planes_vertex:Id,color_fragment:Ud,color_pars_fragment:Nd,color_pars_vertex:Od,color_vertex:zd,common:Fd,cube_uv_reflection_fragment:Bd,defaultnormal_vertex:kd,displacementmap_pars_vertex:Hd,displacementmap_vertex:Gd,emissivemap_fragment:Vd,emissivemap_pars_fragment:Wd,colorspace_fragment:Xd,colorspace_pars_fragment:$d,envmap_fragment:qd,envmap_common_pars_fragment:Yd,envmap_pars_fragment:jd,envmap_pars_vertex:Kd,envmap_physical_pars_fragment:cp,envmap_vertex:Jd,fog_vertex:Zd,fog_pars_vertex:Qd,fog_fragment:tp,fog_pars_fragment:ep,gradientmap_pars_fragment:np,lightmap_fragment:ip,lightmap_pars_fragment:sp,lights_lambert_fragment:rp,lights_lambert_pars_fragment:op,lights_pars_begin:ap,lights_toon_fragment:lp,lights_toon_pars_fragment:hp,lights_phong_fragment:up,lights_phong_pars_fragment:fp,lights_physical_fragment:dp,lights_physical_pars_fragment:pp,lights_fragment_begin:mp,lights_fragment_maps:gp,lights_fragment_end:_p,logdepthbuf_fragment:vp,logdepthbuf_pars_fragment:xp,logdepthbuf_pars_vertex:Mp,logdepthbuf_vertex:yp,map_fragment:Sp,map_pars_fragment:bp,map_particle_fragment:Ep,map_particle_pars_fragment:wp,metalnessmap_fragment:Tp,metalnessmap_pars_fragment:Ap,morphcolor_vertex:Rp,morphnormal_vertex:Cp,morphtarget_pars_vertex:Pp,morphtarget_vertex:Lp,normal_fragment_begin:Dp,normal_fragment_maps:Ip,normal_pars_fragment:Up,normal_pars_vertex:Np,normal_vertex:Op,normalmap_pars_fragment:zp,clearcoat_normal_fragment_begin:Fp,clearcoat_normal_fragment_maps:Bp,clearcoat_pars_fragment:kp,iridescence_pars_fragment:Hp,opaque_fragment:Gp,packing:Vp,premultiplied_alpha_fragment:Wp,project_vertex:Xp,dithering_fragment:$p,dithering_pars_fragment:qp,roughnessmap_fragment:Yp,roughnessmap_pars_fragment:jp,shadowmap_pars_fragment:Kp,shadowmap_pars_vertex:Jp,shadowmap_vertex:Zp,shadowmask_pars_fragment:Qp,skinbase_vertex:tm,skinning_pars_vertex:em,skinning_vertex:nm,skinnormal_vertex:im,specularmap_fragment:sm,specularmap_pars_fragment:rm,tonemapping_fragment:om,tonemapping_pars_fragment:am,transmission_fragment:cm,transmission_pars_fragment:lm,uv_pars_fragment:hm,uv_pars_vertex:um,uv_vertex:fm,worldpos_vertex:dm,background_vert:pm,background_frag:mm,backgroundCube_vert:gm,backgroundCube_frag:_m,cube_vert:vm,cube_frag:xm,depth_vert:Mm,depth_frag:ym,distanceRGBA_vert:Sm,distanceRGBA_frag:bm,equirect_vert:Em,equirect_frag:wm,linedashed_vert:Tm,linedashed_frag:Am,meshbasic_vert:Rm,meshbasic_frag:Cm,meshlambert_vert:Pm,meshlambert_frag:Lm,meshmatcap_vert:Dm,meshmatcap_frag:Im,meshnormal_vert:Um,meshnormal_frag:Nm,meshphong_vert:Om,meshphong_frag:zm,meshphysical_vert:Fm,meshphysical_frag:Bm,meshtoon_vert:km,meshtoon_frag:Hm,points_vert:Gm,points_frag:Vm,shadow_vert:Wm,shadow_frag:Xm,sprite_vert:$m,sprite_frag:qm},ct={common:{diffuse:{value:new $t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new $t(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},Dn={basic:{uniforms:qe([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:qe([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,ct.lights,{emissive:{value:new $t(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:qe([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,ct.lights,{emissive:{value:new $t(0)},specular:{value:new $t(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:qe([ct.common,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.roughnessmap,ct.metalnessmap,ct.fog,ct.lights,{emissive:{value:new $t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:qe([ct.common,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.gradientmap,ct.fog,ct.lights,{emissive:{value:new $t(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:qe([ct.common,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:qe([ct.points,ct.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:qe([ct.common,ct.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:qe([ct.common,ct.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:qe([ct.common,ct.bumpmap,ct.normalmap,ct.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:qe([ct.sprite,ct.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:qe([ct.common,ct.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:qe([ct.lights,ct.fog,{color:{value:new $t(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};Dn.physical={uniforms:qe([Dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new $t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new $t(0)},specularColor:{value:new $t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const Ir={r:0,b:0,g:0};function Ym(i,t,e,n,s,r,a){const o=new $t(0);let c=r===!0?0:1,h,l,u=null,f=0,d=null;function g(m,p){let v=!1,x=p.isScene===!0?p.background:null;x&&x.isTexture&&(x=(p.backgroundBlurriness>0?e:t).get(x)),x===null?_(o,c):x&&x.isColor&&(_(x,1),v=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,a):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||v)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===io)?(l===void 0&&(l=new kt(new On(1,1,1),new zi({name:"BackgroundCubeMaterial",uniforms:As(Dn.backgroundCube.uniforms),vertexShader:Dn.backgroundCube.vertexShader,fragmentShader:Dn.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(R,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),l.material.uniforms.envMap.value=x,l.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,l.material.toneMapped=le.getTransfer(x.colorSpace)!==fe,(u!==x||f!==x.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,f=x.version,d=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null)):x&&x.isTexture&&(h===void 0&&(h=new kt(new vi(2,2),new zi({name:"BackgroundMaterial",uniforms:As(Dn.background.uniforms),vertexShader:Dn.background.vertexShader,fragmentShader:Dn.background.fragmentShader,side:_i,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=x,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=le.getTransfer(x.colorSpace)!==fe,x.matrixAutoUpdate===!0&&x.updateMatrix(),h.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,f=x.version,d=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null))}function _(m,p){m.getRGB(Ir,Ph(i)),n.buffers.color.setClear(Ir.r,Ir.g,Ir.b,p,a)}return{getClearColor:function(){return o},setClearColor:function(m,p=1){o.set(m),c=p,_(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,_(o,c)},render:g}}function jm(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},c=m(null);let h=c,l=!1;function u(I,F,W,Y,$){let q=!1;if(a){const j=_(Y,W,F);h!==j&&(h=j,d(h.object)),q=p(I,Y,W,$),q&&v(I,Y,W,$)}else{const j=F.wireframe===!0;(h.geometry!==Y.id||h.program!==W.id||h.wireframe!==j)&&(h.geometry=Y.id,h.program=W.id,h.wireframe=j,q=!0)}$!==null&&e.update($,i.ELEMENT_ARRAY_BUFFER),(q||l)&&(l=!1,U(I,F,W,Y),$!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function d(I){return n.isWebGL2?i.bindVertexArray(I):r.bindVertexArrayOES(I)}function g(I){return n.isWebGL2?i.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function _(I,F,W){const Y=W.wireframe===!0;let $=o[I.id];$===void 0&&($={},o[I.id]=$);let q=$[F.id];q===void 0&&(q={},$[F.id]=q);let j=q[Y];return j===void 0&&(j=m(f()),q[Y]=j),j}function m(I){const F=[],W=[],Y=[];for(let $=0;$<s;$++)F[$]=0,W[$]=0,Y[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:W,attributeDivisors:Y,object:I,attributes:{},index:null}}function p(I,F,W,Y){const $=h.attributes,q=F.attributes;let j=0;const ot=W.getAttributes();for(const at in ot)if(ot[at].location>=0){const K=$[at];let pt=q[at];if(pt===void 0&&(at==="instanceMatrix"&&I.instanceMatrix&&(pt=I.instanceMatrix),at==="instanceColor"&&I.instanceColor&&(pt=I.instanceColor)),K===void 0||K.attribute!==pt||pt&&K.data!==pt.data)return!0;j++}return h.attributesNum!==j||h.index!==Y}function v(I,F,W,Y){const $={},q=F.attributes;let j=0;const ot=W.getAttributes();for(const at in ot)if(ot[at].location>=0){let K=q[at];K===void 0&&(at==="instanceMatrix"&&I.instanceMatrix&&(K=I.instanceMatrix),at==="instanceColor"&&I.instanceColor&&(K=I.instanceColor));const pt={};pt.attribute=K,K&&K.data&&(pt.data=K.data),$[at]=pt,j++}h.attributes=$,h.attributesNum=j,h.index=Y}function x(){const I=h.newAttributes;for(let F=0,W=I.length;F<W;F++)I[F]=0}function M(I){R(I,0)}function R(I,F){const W=h.newAttributes,Y=h.enabledAttributes,$=h.attributeDivisors;W[I]=1,Y[I]===0&&(i.enableVertexAttribArray(I),Y[I]=1),$[I]!==F&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,F),$[I]=F)}function E(){const I=h.newAttributes,F=h.enabledAttributes;for(let W=0,Y=F.length;W<Y;W++)F[W]!==I[W]&&(i.disableVertexAttribArray(W),F[W]=0)}function A(I,F,W,Y,$,q,j){j===!0?i.vertexAttribIPointer(I,F,W,$,q):i.vertexAttribPointer(I,F,W,Y,$,q)}function U(I,F,W,Y){if(n.isWebGL2===!1&&(I.isInstancedMesh||Y.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const $=Y.attributes,q=W.getAttributes(),j=F.defaultAttributeValues;for(const ot in q){const at=q[ot];if(at.location>=0){let X=$[ot];if(X===void 0&&(ot==="instanceMatrix"&&I.instanceMatrix&&(X=I.instanceMatrix),ot==="instanceColor"&&I.instanceColor&&(X=I.instanceColor)),X!==void 0){const K=X.normalized,pt=X.itemSize,Et=e.get(X);if(Et===void 0)continue;const St=Et.buffer,Ft=Et.type,Bt=Et.bytesPerElement,Lt=n.isWebGL2===!0&&(Ft===i.INT||Ft===i.UNSIGNED_INT||X.gpuType===ph);if(X.isInterleavedBufferAttribute){const Jt=X.data,z=Jt.stride,Be=X.offset;if(Jt.isInstancedInterleavedBuffer){for(let At=0;At<at.locationSize;At++)R(at.location+At,Jt.meshPerAttribute);I.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=Jt.meshPerAttribute*Jt.count)}else for(let At=0;At<at.locationSize;At++)M(at.location+At);i.bindBuffer(i.ARRAY_BUFFER,St);for(let At=0;At<at.locationSize;At++)A(at.location+At,pt/at.locationSize,Ft,K,z*Bt,(Be+pt/at.locationSize*At)*Bt,Lt)}else{if(X.isInstancedBufferAttribute){for(let Jt=0;Jt<at.locationSize;Jt++)R(at.location+Jt,X.meshPerAttribute);I.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Jt=0;Jt<at.locationSize;Jt++)M(at.location+Jt);i.bindBuffer(i.ARRAY_BUFFER,St);for(let Jt=0;Jt<at.locationSize;Jt++)A(at.location+Jt,pt/at.locationSize,Ft,K,pt*Bt,pt/at.locationSize*Jt*Bt,Lt)}}else if(j!==void 0){const K=j[ot];if(K!==void 0)switch(K.length){case 2:i.vertexAttrib2fv(at.location,K);break;case 3:i.vertexAttrib3fv(at.location,K);break;case 4:i.vertexAttrib4fv(at.location,K);break;default:i.vertexAttrib1fv(at.location,K)}}}}E()}function y(){G();for(const I in o){const F=o[I];for(const W in F){const Y=F[W];for(const $ in Y)g(Y[$].object),delete Y[$];delete F[W]}delete o[I]}}function w(I){if(o[I.id]===void 0)return;const F=o[I.id];for(const W in F){const Y=F[W];for(const $ in Y)g(Y[$].object),delete Y[$];delete F[W]}delete o[I.id]}function H(I){for(const F in o){const W=o[F];if(W[I.id]===void 0)continue;const Y=W[I.id];for(const $ in Y)g(Y[$].object),delete Y[$];delete W[I.id]}}function G(){tt(),l=!0,h!==c&&(h=c,d(h.object))}function tt(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:G,resetDefaultState:tt,dispose:y,releaseStatesOfGeometry:w,releaseStatesOfProgram:H,initAttributes:x,enableAttribute:M,disableUnusedAttributes:E}}function Km(i,t,e,n){const s=n.isWebGL2;let r;function a(l){r=l}function o(l,u){i.drawArrays(r,l,u),e.update(u,r,1)}function c(l,u,f){if(f===0)return;let d,g;if(s)d=i,g="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[g](r,l,u,f),e.update(u,r,f)}function h(l,u,f){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<f;g++)this.render(l[g],u[g]);else{d.multiDrawArraysWEBGL(r,l,0,u,0,f);let g=0;for(let _=0;_<f;_++)g+=u[_];e.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=h}function Jm(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);const h=a||t.has("WEBGL_draw_buffers"),l=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=f>0,M=a||t.has("OES_texture_float"),R=x&&M,E=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:l,maxTextures:u,maxVertexTextures:f,maxTextureSize:d,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:v,vertexTextures:x,floatFragmentTextures:M,floatVertexTextures:R,maxSamples:E}}function Zm(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new hi,o=new Kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=l(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?l(null):h();else{const v=r?0:n,x=v*4;let M=p.clippingState||null;c.value=M,M=l(g,f,x,d);for(let R=0;R!==x;++R)M[R]=e[R];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function l(u,f,d,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=d+_*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,M=d;x!==_;++x,M+=4)a.copy(u[x]).applyMatrix4(v,o),a.normal.toArray(m,M),m[M+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Qm(i){let t=new WeakMap;function e(a,o){return o===ma?a.mapping=Es:o===ga&&(a.mapping=ws),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===ma||o===ga)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new ud(c.height/2);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Uh extends Lh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=l*this.view.offsetY,c=o-l*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const _s=4,il=[.125,.215,.35,.446,.526,.582],Pi=20,qo=new Uh,sl=new $t;let Yo=null,jo=0,Ko=0;const Ri=(1+Math.sqrt(5))/2,as=1/Ri,rl=[new C(1,1,1),new C(-1,1,1),new C(1,1,-1),new C(-1,1,-1),new C(0,Ri,as),new C(0,Ri,-as),new C(as,0,Ri),new C(-as,0,Ri),new C(Ri,as,0),new C(-Ri,as,0)];class ol{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Yo=this._renderer.getRenderTarget(),jo=this._renderer.getActiveCubeFace(),Ko=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ll(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Yo,jo,Ko),t.scissorTest=!1,Ur(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Es||t.mapping===ws?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Yo=this._renderer.getRenderTarget(),jo=this._renderer.getActiveCubeFace(),Ko=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:tn,minFilter:tn,generateMipmaps:!1,type:tr,format:mn,colorSpace:ii,depthBuffer:!1},s=al(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=al(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=t0(r)),this._blurMaterial=e0(r,t,e)}return s}_compileMaterial(t){const e=new kt(this._lodPlanes[0],t);this._renderer.compile(e,qo)}_sceneToCubeUV(t,e,n,s){const o=new cn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,f=l.toneMapping;l.getClearColor(sl),l.toneMapping=pi,l.autoClear=!1;const d=new je({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1}),g=new kt(new On,d);let _=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,_=!0):(d.color.copy(sl),_=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(o.up.set(0,c[p],0),o.lookAt(h[p],0,0)):v===1?(o.up.set(0,0,c[p]),o.lookAt(0,h[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,h[p]));const x=this._cubeSize;Ur(s,v*x,p>2?x:0,x,x),l.setRenderTarget(s),_&&l.render(g,o),l.render(t,o)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=f,l.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Es||t.mapping===ws;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ll()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new kt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;Ur(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,qo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=rl[(s-1)%rl.length];this._blur(t,s-1,s,r,a)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const l=3,u=new kt(this._lodPlanes[s],h),f=h.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Pi-1),_=r/g,m=isFinite(r)?1+Math.floor(l*_):Pi;m>Pi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Pi}`);const p=[];let v=0;for(let A=0;A<Pi;++A){const U=A/_,y=Math.exp(-U*U/2);p.push(y),A===0?v+=y:A<m&&(v+=2*y)}for(let A=0;A<p.length;A++)p[A]=p[A]/v;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:x}=this;f.dTheta.value=g,f.mipInt.value=x-n;const M=this._sizeLods[s],R=3*M*(s>x-_s?s-x+_s:0),E=4*(this._cubeSize-M);Ur(e,R,E,3*M,2*M),c.setRenderTarget(e),c.render(u,qo)}}function t0(i){const t=[],e=[],n=[];let s=i;const r=i-_s+1+il.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-_s?c=il[a-i+_s-1]:a===0&&(c=0),n.push(c);const h=1/(o-2),l=-h,u=1+h,f=[l,l,u,l,u,u,l,l,u,u,l,u],d=6,g=6,_=3,m=2,p=1,v=new Float32Array(_*g*d),x=new Float32Array(m*g*d),M=new Float32Array(p*g*d);for(let E=0;E<d;E++){const A=E%3*2/3-1,U=E>2?0:-1,y=[A,U,0,A+2/3,U,0,A+2/3,U+1,0,A,U,0,A+2/3,U+1,0,A,U+1,0];v.set(y,_*g*E),x.set(f,m*g*E);const w=[E,E,E,E,E,E];M.set(w,p*g*E)}const R=new Ee;R.setAttribute("position",new hn(v,_)),R.setAttribute("uv",new hn(x,m)),R.setAttribute("faceIndex",new hn(M,p)),t.push(R),s>_s&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function al(i,t,e){const n=new Oi(i,t,e);return n.texture.mapping=io,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ur(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function e0(i,t,e){const n=new Float32Array(Pi),s=new C(0,1,0);return new zi({name:"SphericalGaussianBlur",defines:{n:Pi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ia(),fragmentShader:`

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
		`,blending:di,depthTest:!1,depthWrite:!1})}function cl(){return new zi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ia(),fragmentShader:`

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
		`,blending:di,depthTest:!1,depthWrite:!1})}function ll(){return new zi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ia(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:di,depthTest:!1,depthWrite:!1})}function Ia(){return`

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
	`}function n0(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,h=c===ma||c===ga,l=c===Es||c===ws;if(h||l)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new ol(i)),u=h?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{const u=o.image;if(h&&u&&u.height>0||l&&u&&s(u)){e===null&&(e=new ol(i));const f=h?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,f),o.addEventListener("dispose",r),f.texture}else return null}}}return o}function s(o){let c=0;const h=6;for(let l=0;l<h;l++)o[l]!==void 0&&c++;return c===h}function r(o){const c=o.target;c.removeEventListener("dispose",r);const h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function i0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function s0(i,t,e,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}f.removeEventListener("dispose",a),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],i.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const _=d[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],i.ARRAY_BUFFER)}}function h(u){const f=[],d=u.index,g=u.attributes.position;let _=0;if(d!==null){const v=d.array;_=d.version;for(let x=0,M=v.length;x<M;x+=3){const R=v[x+0],E=v[x+1],A=v[x+2];f.push(R,E,E,A,A,R)}}else if(g!==void 0){const v=g.array;_=g.version;for(let x=0,M=v.length/3-1;x<M;x+=3){const R=x+0,E=x+1,A=x+2;f.push(R,E,E,A,A,R)}}else return;const m=new(bh(f)?Ch:Rh)(f,1);m.version=_;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function l(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&h(u)}else h(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:l}}function r0(i,t,e,n){const s=n.isWebGL2;let r;function a(d){r=d}let o,c;function h(d){o=d.type,c=d.bytesPerElement}function l(d,g){i.drawElements(r,g,o,d*c),e.update(g,r,1)}function u(d,g,_){if(_===0)return;let m,p;if(s)m=i,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,o,d*c,_),e.update(g,r,_)}function f(d,g,_){if(_===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<_;p++)this.render(d[p]/c,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,o,d,0,_);let p=0;for(let v=0;v<_;v++)p+=g[v];e.update(p,r,1)}}this.setMode=a,this.setIndex=h,this.render=l,this.renderInstances=u,this.renderMultiDraw=f}function o0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function a0(i,t){return i[0]-t[0]}function c0(i,t){return Math.abs(t[1])-Math.abs(i[1])}function l0(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,a=new pe,o=[];for(let h=0;h<8;h++)o[h]=[h,0];function c(h,l,u){const f=h.morphTargetInfluences;if(t.isWebGL2===!0){const g=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,_=g!==void 0?g.length:0;let m=r.get(l);if(m===void 0||m.count!==_){let F=function(){tt.dispose(),r.delete(l),l.removeEventListener("dispose",F)};var d=F;m!==void 0&&m.texture.dispose();const x=l.morphAttributes.position!==void 0,M=l.morphAttributes.normal!==void 0,R=l.morphAttributes.color!==void 0,E=l.morphAttributes.position||[],A=l.morphAttributes.normal||[],U=l.morphAttributes.color||[];let y=0;x===!0&&(y=1),M===!0&&(y=2),R===!0&&(y=3);let w=l.attributes.position.count*y,H=1;w>t.maxTextureSize&&(H=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const G=new Float32Array(w*H*4*_),tt=new Th(G,w,H,_);tt.type=fi,tt.needsUpdate=!0;const I=y*4;for(let W=0;W<_;W++){const Y=E[W],$=A[W],q=U[W],j=w*H*4*W;for(let ot=0;ot<Y.count;ot++){const at=ot*I;x===!0&&(a.fromBufferAttribute(Y,ot),G[j+at+0]=a.x,G[j+at+1]=a.y,G[j+at+2]=a.z,G[j+at+3]=0),M===!0&&(a.fromBufferAttribute($,ot),G[j+at+4]=a.x,G[j+at+5]=a.y,G[j+at+6]=a.z,G[j+at+7]=0),R===!0&&(a.fromBufferAttribute(q,ot),G[j+at+8]=a.x,G[j+at+9]=a.y,G[j+at+10]=a.z,G[j+at+11]=q.itemSize===4?a.w:1)}}m={count:_,texture:tt,size:new ht(w,H)},r.set(l,m),l.addEventListener("dispose",F)}let p=0;for(let x=0;x<f.length;x++)p+=f[x];const v=l.morphTargetsRelative?1:1-p;u.getUniforms().setValue(i,"morphTargetBaseInfluence",v),u.getUniforms().setValue(i,"morphTargetInfluences",f),u.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}else{const g=f===void 0?0:f.length;let _=n[l.id];if(_===void 0||_.length!==g){_=[];for(let M=0;M<g;M++)_[M]=[M,0];n[l.id]=_}for(let M=0;M<g;M++){const R=_[M];R[0]=M,R[1]=f[M]}_.sort(c0);for(let M=0;M<8;M++)M<g&&_[M][1]?(o[M][0]=_[M][0],o[M][1]=_[M][1]):(o[M][0]=Number.MAX_SAFE_INTEGER,o[M][1]=0);o.sort(a0);const m=l.morphAttributes.position,p=l.morphAttributes.normal;let v=0;for(let M=0;M<8;M++){const R=o[M],E=R[0],A=R[1];E!==Number.MAX_SAFE_INTEGER&&A?(m&&l.getAttribute("morphTarget"+M)!==m[E]&&l.setAttribute("morphTarget"+M,m[E]),p&&l.getAttribute("morphNormal"+M)!==p[E]&&l.setAttribute("morphNormal"+M,p[E]),s[M]=A,v+=A):(m&&l.hasAttribute("morphTarget"+M)===!0&&l.deleteAttribute("morphTarget"+M),p&&l.hasAttribute("morphNormal"+M)===!0&&l.deleteAttribute("morphNormal"+M),s[M]=0)}const x=l.morphTargetsRelative?1:1-v;u.getUniforms().setValue(i,"morphTargetBaseInfluence",x),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function h0(i,t,e,n){let s=new WeakMap;function r(c){const h=n.render.frame,l=c.geometry,u=t.get(c,l);if(s.get(u)!==h&&(t.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function a(){s=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:a}}class Nh extends Je{constructor(t,e,n,s,r,a,o,c,h,l){if(l=l!==void 0?l:Di,l!==Di&&l!==Ts)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&l===Di&&(n=ui),n===void 0&&l===Ts&&(n=Li),super(null,s,r,a,o,c,l,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:ke,this.minFilter=c!==void 0?c:ke,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Oh=new Je,zh=new Nh(1,1);zh.compareFunction=Sh;const Fh=new Th,Bh=new Yf,kh=new Dh,hl=[],ul=[],fl=new Float32Array(16),dl=new Float32Array(9),pl=new Float32Array(4);function Is(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=hl[s];if(r===void 0&&(r=new Float32Array(s),hl[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Le(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function De(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function oo(i,t){let e=ul[t];e===void 0&&(e=new Int32Array(t),ul[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function u0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function f0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2fv(this.addr,t),De(e,t)}}function d0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Le(e,t))return;i.uniform3fv(this.addr,t),De(e,t)}}function p0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4fv(this.addr,t),De(e,t)}}function m0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;pl.set(n),i.uniformMatrix2fv(this.addr,!1,pl),De(e,n)}}function g0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;dl.set(n),i.uniformMatrix3fv(this.addr,!1,dl),De(e,n)}}function _0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;fl.set(n),i.uniformMatrix4fv(this.addr,!1,fl),De(e,n)}}function v0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function x0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2iv(this.addr,t),De(e,t)}}function M0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3iv(this.addr,t),De(e,t)}}function y0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4iv(this.addr,t),De(e,t)}}function S0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function b0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2uiv(this.addr,t),De(e,t)}}function E0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3uiv(this.addr,t),De(e,t)}}function w0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4uiv(this.addr,t),De(e,t)}}function T0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?zh:Oh;e.setTexture2D(t||r,s)}function A0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Bh,s)}function R0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||kh,s)}function C0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Fh,s)}function P0(i){switch(i){case 5126:return u0;case 35664:return f0;case 35665:return d0;case 35666:return p0;case 35674:return m0;case 35675:return g0;case 35676:return _0;case 5124:case 35670:return v0;case 35667:case 35671:return x0;case 35668:case 35672:return M0;case 35669:case 35673:return y0;case 5125:return S0;case 36294:return b0;case 36295:return E0;case 36296:return w0;case 35678:case 36198:case 36298:case 36306:case 35682:return T0;case 35679:case 36299:case 36307:return A0;case 35680:case 36300:case 36308:case 36293:return R0;case 36289:case 36303:case 36311:case 36292:return C0}}function L0(i,t){i.uniform1fv(this.addr,t)}function D0(i,t){const e=Is(t,this.size,2);i.uniform2fv(this.addr,e)}function I0(i,t){const e=Is(t,this.size,3);i.uniform3fv(this.addr,e)}function U0(i,t){const e=Is(t,this.size,4);i.uniform4fv(this.addr,e)}function N0(i,t){const e=Is(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function O0(i,t){const e=Is(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function z0(i,t){const e=Is(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function F0(i,t){i.uniform1iv(this.addr,t)}function B0(i,t){i.uniform2iv(this.addr,t)}function k0(i,t){i.uniform3iv(this.addr,t)}function H0(i,t){i.uniform4iv(this.addr,t)}function G0(i,t){i.uniform1uiv(this.addr,t)}function V0(i,t){i.uniform2uiv(this.addr,t)}function W0(i,t){i.uniform3uiv(this.addr,t)}function X0(i,t){i.uniform4uiv(this.addr,t)}function $0(i,t,e){const n=this.cache,s=t.length,r=oo(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Oh,r[a])}function q0(i,t,e){const n=this.cache,s=t.length,r=oo(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Bh,r[a])}function Y0(i,t,e){const n=this.cache,s=t.length,r=oo(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||kh,r[a])}function j0(i,t,e){const n=this.cache,s=t.length,r=oo(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Fh,r[a])}function K0(i){switch(i){case 5126:return L0;case 35664:return D0;case 35665:return I0;case 35666:return U0;case 35674:return N0;case 35675:return O0;case 35676:return z0;case 5124:case 35670:return F0;case 35667:case 35671:return B0;case 35668:case 35672:return k0;case 35669:case 35673:return H0;case 5125:return G0;case 36294:return V0;case 36295:return W0;case 36296:return X0;case 35678:case 36198:case 36298:case 36306:case 35682:return $0;case 35679:case 36299:case 36307:return q0;case 35680:case 36300:case 36308:case 36293:return Y0;case 36289:case 36303:case 36311:case 36292:return j0}}class J0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=P0(e.type)}}class Z0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=K0(e.type)}}class Q0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Jo=/(\w+)(\])?(\[|\.)?/g;function ml(i,t){i.seq.push(t),i.map[t.id]=t}function tg(i,t,e){const n=i.name,s=n.length;for(Jo.lastIndex=0;;){const r=Jo.exec(n),a=Jo.lastIndex;let o=r[1];const c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){ml(e,h===void 0?new J0(o,i,t):new Z0(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Q0(o),ml(e,u)),e=u}}}class Hr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);tg(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function gl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const eg=37297;let ng=0;function ig(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function sg(i){const t=le.getPrimaries(le.workingColorSpace),e=le.getPrimaries(i);let n;switch(t===e?n="":t===Yr&&e===qr?n="LinearDisplayP3ToLinearSRGB":t===qr&&e===Yr&&(n="LinearSRGBToLinearDisplayP3"),i){case ii:case so:return[n,"LinearTransferOETF"];case Ae:case Pa:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function _l(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+ig(i.getShaderSource(t),a)}else return s}function rg(i,t){const e=sg(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function og(i,t){let e;switch(t){case gf:e="Linear";break;case _f:e="Reinhard";break;case vf:e="OptimizedCineon";break;case fh:e="ACESFilmic";break;case Mf:e="AgX";break;case xf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function ag(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(vs).join(`
`)}function cg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(vs).join(`
`)}function lg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function hg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function vs(i){return i!==""}function vl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function xl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const ug=/^[ \t]*#include +<([\w\d./]+)>/gm;function ya(i){return i.replace(ug,dg)}const fg=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function dg(i,t){let e=Xt[t];if(e===void 0){const n=fg.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ya(e)}const pg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ml(i){return i.replace(pg,mg)}function mg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function yl(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function gg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===hh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===uh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Yn&&(t="SHADOWMAP_TYPE_VSM"),t}function _g(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Es:case ws:t="ENVMAP_TYPE_CUBE";break;case io:t="ENVMAP_TYPE_CUBE_UV";break}return t}function vg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ws:t="ENVMAP_MODE_REFRACTION";break}return t}function xg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Aa:t="ENVMAP_BLENDING_MULTIPLY";break;case pf:t="ENVMAP_BLENDING_MIX";break;case mf:t="ENVMAP_BLENDING_ADD";break}return t}function Mg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function yg(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=gg(e),h=_g(e),l=vg(e),u=xg(e),f=Mg(e),d=e.isWebGL2?"":ag(e),g=cg(e),_=lg(r),m=s.createProgram();let p,v,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(vs).join(`
`),p.length>0&&(p+=`
`),v=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(vs).join(`
`),v.length>0&&(v+=`
`)):(p=[yl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vs).join(`
`),v=[d,yl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==pi?"#define TONE_MAPPING":"",e.toneMapping!==pi?Xt.tonemapping_pars_fragment:"",e.toneMapping!==pi?og("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,rg("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(vs).join(`
`)),a=ya(a),a=vl(a,e),a=xl(a,e),o=ya(o),o=vl(o,e),o=xl(o,e),a=Ml(a),o=Ml(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Bc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Bc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const M=x+p+a,R=x+v+o,E=gl(s,s.VERTEX_SHADER,M),A=gl(s,s.FRAGMENT_SHADER,R);s.attachShader(m,E),s.attachShader(m,A),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function U(G){if(i.debug.checkShaderErrors){const tt=s.getProgramInfoLog(m).trim(),I=s.getShaderInfoLog(E).trim(),F=s.getShaderInfoLog(A).trim();let W=!0,Y=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,E,A);else{const $=_l(s,E,"vertex"),q=_l(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+tt+`
`+$+`
`+q)}else tt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",tt):(I===""||F==="")&&(Y=!1);Y&&(G.diagnostics={runnable:W,programLog:tt,vertexShader:{log:I,prefix:p},fragmentShader:{log:F,prefix:v}})}s.deleteShader(E),s.deleteShader(A),y=new Hr(s,m),w=hg(s,m)}let y;this.getUniforms=function(){return y===void 0&&U(this),y};let w;this.getAttributes=function(){return w===void 0&&U(this),w};let H=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return H===!1&&(H=s.getProgramParameter(m,eg)),H},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ng++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=E,this.fragmentShader=A,this}let Sg=0;class bg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Eg(t),e.set(t,n)),n}}class Eg{constructor(t){this.id=Sg++,this.code=t,this.usedTimes=0}}function wg(i,t,e,n,s,r,a){const o=new La,c=new bg,h=[],l=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return y===0?"uv":`uv${y}`}function m(y,w,H,G,tt){const I=G.fog,F=tt.geometry,W=y.isMeshStandardMaterial?G.environment:null,Y=(y.isMeshStandardMaterial?e:t).get(y.envMap||W),$=Y&&Y.mapping===io?Y.image.height:null,q=g[y.type];y.precision!==null&&(d=s.getMaxPrecision(y.precision),d!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));const j=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ot=j!==void 0?j.length:0;let at=0;F.morphAttributes.position!==void 0&&(at=1),F.morphAttributes.normal!==void 0&&(at=2),F.morphAttributes.color!==void 0&&(at=3);let X,K,pt,Et;if(q){const ye=Dn[q];X=ye.vertexShader,K=ye.fragmentShader}else X=y.vertexShader,K=y.fragmentShader,c.update(y),pt=c.getVertexShaderID(y),Et=c.getFragmentShaderID(y);const St=i.getRenderTarget(),Ft=tt.isInstancedMesh===!0,Bt=tt.isBatchedMesh===!0,Lt=!!y.map,Jt=!!y.matcap,z=!!Y,Be=!!y.aoMap,At=!!y.lightMap,Ut=!!y.bumpMap,Mt=!!y.normalMap,ue=!!y.displacementMap,Gt=!!y.emissiveMap,T=!!y.metalnessMap,S=!!y.roughnessMap,O=y.anisotropy>0,et=y.clearcoat>0,Z=y.iridescence>0,nt=y.sheen>0,yt=y.transmission>0,dt=O&&!!y.anisotropyMap,xt=et&&!!y.clearcoatMap,Pt=et&&!!y.clearcoatNormalMap,Vt=et&&!!y.clearcoatRoughnessMap,J=Z&&!!y.iridescenceMap,ie=Z&&!!y.iridescenceThicknessMap,qt=nt&&!!y.sheenColorMap,Nt=nt&&!!y.sheenRoughnessMap,Tt=!!y.specularMap,mt=!!y.specularColorMap,P=!!y.specularIntensityMap,st=yt&&!!y.transmissionMap,bt=yt&&!!y.thicknessMap,vt=!!y.gradientMap,Q=!!y.alphaMap,L=y.alphaTest>0,rt=!!y.alphaHash,ft=!!y.extensions,Dt=!!F.attributes.uv1,Rt=!!F.attributes.uv2,Zt=!!F.attributes.uv3;let Qt=pi;return y.toneMapped&&(St===null||St.isXRRenderTarget===!0)&&(Qt=i.toneMapping),{isWebGL2:l,shaderID:q,shaderType:y.type,shaderName:y.name,vertexShader:X,fragmentShader:K,defines:y.defines,customVertexShaderID:pt,customFragmentShaderID:Et,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Bt,instancing:Ft,instancingColor:Ft&&tt.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:St===null?i.outputColorSpace:St.isXRRenderTarget===!0?St.texture.colorSpace:ii,map:Lt,matcap:Jt,envMap:z,envMapMode:z&&Y.mapping,envMapCubeUVHeight:$,aoMap:Be,lightMap:At,bumpMap:Ut,normalMap:Mt,displacementMap:f&&ue,emissiveMap:Gt,normalMapObjectSpace:Mt&&y.normalMapType===Df,normalMapTangentSpace:Mt&&y.normalMapType===Ca,metalnessMap:T,roughnessMap:S,anisotropy:O,anisotropyMap:dt,clearcoat:et,clearcoatMap:xt,clearcoatNormalMap:Pt,clearcoatRoughnessMap:Vt,iridescence:Z,iridescenceMap:J,iridescenceThicknessMap:ie,sheen:nt,sheenColorMap:qt,sheenRoughnessMap:Nt,specularMap:Tt,specularColorMap:mt,specularIntensityMap:P,transmission:yt,transmissionMap:st,thicknessMap:bt,gradientMap:vt,opaque:y.transparent===!1&&y.blending===xs,alphaMap:Q,alphaTest:L,alphaHash:rt,combine:y.combine,mapUv:Lt&&_(y.map.channel),aoMapUv:Be&&_(y.aoMap.channel),lightMapUv:At&&_(y.lightMap.channel),bumpMapUv:Ut&&_(y.bumpMap.channel),normalMapUv:Mt&&_(y.normalMap.channel),displacementMapUv:ue&&_(y.displacementMap.channel),emissiveMapUv:Gt&&_(y.emissiveMap.channel),metalnessMapUv:T&&_(y.metalnessMap.channel),roughnessMapUv:S&&_(y.roughnessMap.channel),anisotropyMapUv:dt&&_(y.anisotropyMap.channel),clearcoatMapUv:xt&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:Pt&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Vt&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:ie&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:qt&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&_(y.sheenRoughnessMap.channel),specularMapUv:Tt&&_(y.specularMap.channel),specularColorMapUv:mt&&_(y.specularColorMap.channel),specularIntensityMapUv:P&&_(y.specularIntensityMap.channel),transmissionMapUv:st&&_(y.transmissionMap.channel),thicknessMapUv:bt&&_(y.thicknessMap.channel),alphaMapUv:Q&&_(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Mt||O),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Dt,vertexUv2s:Rt,vertexUv3s:Zt,pointsUvs:tt.isPoints===!0&&!!F.attributes.uv&&(Lt||Q),fog:!!I,useFog:y.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:tt.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:ot,morphTextureStride:at,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&H.length>0,shadowMapType:i.shadowMap.type,toneMapping:Qt,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Lt&&y.map.isVideoTexture===!0&&le.getTransfer(y.map.colorSpace)===fe,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===pn,flipSided:y.side===en,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:ft&&y.extensions.derivatives===!0,extensionFragDepth:ft&&y.extensions.fragDepth===!0,extensionDrawBuffers:ft&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:ft&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ft&&y.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:l||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:l||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:l||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function p(y){const w=[];if(y.shaderID?w.push(y.shaderID):(w.push(y.customVertexShaderID),w.push(y.customFragmentShaderID)),y.defines!==void 0)for(const H in y.defines)w.push(H),w.push(y.defines[H]);return y.isRawShaderMaterial===!1&&(v(w,y),x(w,y),w.push(i.outputColorSpace)),w.push(y.customProgramCacheKey),w.join()}function v(y,w){y.push(w.precision),y.push(w.outputColorSpace),y.push(w.envMapMode),y.push(w.envMapCubeUVHeight),y.push(w.mapUv),y.push(w.alphaMapUv),y.push(w.lightMapUv),y.push(w.aoMapUv),y.push(w.bumpMapUv),y.push(w.normalMapUv),y.push(w.displacementMapUv),y.push(w.emissiveMapUv),y.push(w.metalnessMapUv),y.push(w.roughnessMapUv),y.push(w.anisotropyMapUv),y.push(w.clearcoatMapUv),y.push(w.clearcoatNormalMapUv),y.push(w.clearcoatRoughnessMapUv),y.push(w.iridescenceMapUv),y.push(w.iridescenceThicknessMapUv),y.push(w.sheenColorMapUv),y.push(w.sheenRoughnessMapUv),y.push(w.specularMapUv),y.push(w.specularColorMapUv),y.push(w.specularIntensityMapUv),y.push(w.transmissionMapUv),y.push(w.thicknessMapUv),y.push(w.combine),y.push(w.fogExp2),y.push(w.sizeAttenuation),y.push(w.morphTargetsCount),y.push(w.morphAttributeCount),y.push(w.numDirLights),y.push(w.numPointLights),y.push(w.numSpotLights),y.push(w.numSpotLightMaps),y.push(w.numHemiLights),y.push(w.numRectAreaLights),y.push(w.numDirLightShadows),y.push(w.numPointLightShadows),y.push(w.numSpotLightShadows),y.push(w.numSpotLightShadowsWithMaps),y.push(w.numLightProbes),y.push(w.shadowMapType),y.push(w.toneMapping),y.push(w.numClippingPlanes),y.push(w.numClipIntersection),y.push(w.depthPacking)}function x(y,w){o.disableAll(),w.isWebGL2&&o.enable(0),w.supportsVertexTextures&&o.enable(1),w.instancing&&o.enable(2),w.instancingColor&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),y.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.skinning&&o.enable(4),w.morphTargets&&o.enable(5),w.morphNormals&&o.enable(6),w.morphColors&&o.enable(7),w.premultipliedAlpha&&o.enable(8),w.shadowMapEnabled&&o.enable(9),w.useLegacyLights&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),y.push(o.mask)}function M(y){const w=g[y.type];let H;if(w){const G=Dn[w];H=ad.clone(G.uniforms)}else H=y.uniforms;return H}function R(y,w){let H;for(let G=0,tt=h.length;G<tt;G++){const I=h[G];if(I.cacheKey===w){H=I,++H.usedTimes;break}}return H===void 0&&(H=new yg(i,w,y,r),h.push(H)),H}function E(y){if(--y.usedTimes===0){const w=h.indexOf(y);h[w]=h[h.length-1],h.pop(),y.destroy()}}function A(y){c.remove(y)}function U(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:R,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:U}}function Tg(){let i=new WeakMap;function t(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function e(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function Ag(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Sl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function bl(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,f,d,g,_,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,f,d,g,_,m){const p=a(u,f,d,g,_,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,g,_,m){const p=a(u,f,d,g,_,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function h(u,f){e.length>1&&e.sort(u||Ag),n.length>1&&n.sort(f||Sl),s.length>1&&s.sort(f||Sl)}function l(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:l,sort:h}}function Rg(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new bl,i.set(n,[a])):s>=r.length?(a=new bl,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Cg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new $t};break;case"SpotLight":e={position:new C,direction:new C,color:new $t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new $t,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new $t,groundColor:new $t};break;case"RectAreaLight":e={color:new $t,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function Pg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Lg=0;function Dg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Ig(i,t){const e=new Cg,n=Pg(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)s.probe.push(new C);const r=new C,a=new ae,o=new ae;function c(l,u){let f=0,d=0,g=0;for(let G=0;G<9;G++)s.probe[G].set(0,0,0);let _=0,m=0,p=0,v=0,x=0,M=0,R=0,E=0,A=0,U=0,y=0;l.sort(Dg);const w=u===!0?Math.PI:1;for(let G=0,tt=l.length;G<tt;G++){const I=l[G],F=I.color,W=I.intensity,Y=I.distance,$=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)f+=F.r*W*w,d+=F.g*W*w,g+=F.b*W*w;else if(I.isLightProbe){for(let q=0;q<9;q++)s.probe[q].addScaledVector(I.sh.coefficients[q],W);y++}else if(I.isDirectionalLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*w),I.castShadow){const j=I.shadow,ot=n.get(I);ot.shadowBias=j.bias,ot.shadowNormalBias=j.normalBias,ot.shadowRadius=j.radius,ot.shadowMapSize=j.mapSize,s.directionalShadow[_]=ot,s.directionalShadowMap[_]=$,s.directionalShadowMatrix[_]=I.shadow.matrix,M++}s.directional[_]=q,_++}else if(I.isSpotLight){const q=e.get(I);q.position.setFromMatrixPosition(I.matrixWorld),q.color.copy(F).multiplyScalar(W*w),q.distance=Y,q.coneCos=Math.cos(I.angle),q.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),q.decay=I.decay,s.spot[p]=q;const j=I.shadow;if(I.map&&(s.spotLightMap[A]=I.map,A++,j.updateMatrices(I),I.castShadow&&U++),s.spotLightMatrix[p]=j.matrix,I.castShadow){const ot=n.get(I);ot.shadowBias=j.bias,ot.shadowNormalBias=j.normalBias,ot.shadowRadius=j.radius,ot.shadowMapSize=j.mapSize,s.spotShadow[p]=ot,s.spotShadowMap[p]=$,E++}p++}else if(I.isRectAreaLight){const q=e.get(I);q.color.copy(F).multiplyScalar(W),q.halfWidth.set(I.width*.5,0,0),q.halfHeight.set(0,I.height*.5,0),s.rectArea[v]=q,v++}else if(I.isPointLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*w),q.distance=I.distance,q.decay=I.decay,I.castShadow){const j=I.shadow,ot=n.get(I);ot.shadowBias=j.bias,ot.shadowNormalBias=j.normalBias,ot.shadowRadius=j.radius,ot.shadowMapSize=j.mapSize,ot.shadowCameraNear=j.camera.near,ot.shadowCameraFar=j.camera.far,s.pointShadow[m]=ot,s.pointShadowMap[m]=$,s.pointShadowMatrix[m]=I.shadow.matrix,R++}s.point[m]=q,m++}else if(I.isHemisphereLight){const q=e.get(I);q.skyColor.copy(I.color).multiplyScalar(W*w),q.groundColor.copy(I.groundColor).multiplyScalar(W*w),s.hemi[x]=q,x++}}v>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ct.LTC_FLOAT_1,s.rectAreaLTC2=ct.LTC_FLOAT_2):(s.rectAreaLTC1=ct.LTC_HALF_1,s.rectAreaLTC2=ct.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ct.LTC_FLOAT_1,s.rectAreaLTC2=ct.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=ct.LTC_HALF_1,s.rectAreaLTC2=ct.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=d,s.ambient[2]=g;const H=s.hash;(H.directionalLength!==_||H.pointLength!==m||H.spotLength!==p||H.rectAreaLength!==v||H.hemiLength!==x||H.numDirectionalShadows!==M||H.numPointShadows!==R||H.numSpotShadows!==E||H.numSpotMaps!==A||H.numLightProbes!==y)&&(s.directional.length=_,s.spot.length=p,s.rectArea.length=v,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=E,s.spotShadowMap.length=E,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=E+A-U,s.spotLightMap.length=A,s.numSpotLightShadowsWithMaps=U,s.numLightProbes=y,H.directionalLength=_,H.pointLength=m,H.spotLength=p,H.rectAreaLength=v,H.hemiLength=x,H.numDirectionalShadows=M,H.numPointShadows=R,H.numSpotShadows=E,H.numSpotMaps=A,H.numLightProbes=y,s.version=Lg++)}function h(l,u){let f=0,d=0,g=0,_=0,m=0;const p=u.matrixWorldInverse;for(let v=0,x=l.length;v<x;v++){const M=l[v];if(M.isDirectionalLight){const R=s.directional[f];R.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),f++}else if(M.isSpotLight){const R=s.spot[g];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(p),R.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),g++}else if(M.isRectAreaLight){const R=s.rectArea[_];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(p),o.identity(),a.copy(M.matrixWorld),a.premultiply(p),o.extractRotation(a),R.halfWidth.set(M.width*.5,0,0),R.halfHeight.set(0,M.height*.5,0),R.halfWidth.applyMatrix4(o),R.halfHeight.applyMatrix4(o),_++}else if(M.isPointLight){const R=s.point[d];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(p),d++}else if(M.isHemisphereLight){const R=s.hemi[m];R.direction.setFromMatrixPosition(M.matrixWorld),R.direction.transformDirection(p),m++}}}return{setup:c,setupView:h,state:s}}function El(i,t){const e=new Ig(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function a(u){n.push(u)}function o(u){s.push(u)}function c(u){e.setup(n,u)}function h(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o}}function Ug(i,t){let e=new WeakMap;function n(r,a=0){const o=e.get(r);let c;return o===void 0?(c=new El(i,t),e.set(r,[c])):a>=o.length?(c=new El(i,t),o.push(c)):c=o[a],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class Ng extends Hi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Pf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Og extends Hi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const zg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Fg=`uniform sampler2D shadow_pass;
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
}`;function Bg(i,t,e){let n=new Da;const s=new ht,r=new ht,a=new pe,o=new Ng({depthPacking:Lf}),c=new Og,h={},l=e.maxTextureSize,u={[_i]:en,[en]:_i,[pn]:pn},f=new zi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:zg,fragmentShader:Fg}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Ee;g.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new kt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hh;let p=this.type;this.render=function(E,A,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const y=i.getRenderTarget(),w=i.getActiveCubeFace(),H=i.getActiveMipmapLevel(),G=i.state;G.setBlending(di),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const tt=p!==Yn&&this.type===Yn,I=p===Yn&&this.type!==Yn;for(let F=0,W=E.length;F<W;F++){const Y=E[F],$=Y.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const q=$.getFrameExtents();if(s.multiply(q),r.copy($.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/q.x),s.x=r.x*q.x,$.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/q.y),s.y=r.y*q.y,$.mapSize.y=r.y)),$.map===null||tt===!0||I===!0){const ot=this.type!==Yn?{minFilter:ke,magFilter:ke}:{};$.map!==null&&$.map.dispose(),$.map=new Oi(s.x,s.y,ot),$.map.texture.name=Y.name+".shadowMap",$.camera.updateProjectionMatrix()}i.setRenderTarget($.map),i.clear();const j=$.getViewportCount();for(let ot=0;ot<j;ot++){const at=$.getViewport(ot);a.set(r.x*at.x,r.y*at.y,r.x*at.z,r.y*at.w),G.viewport(a),$.updateMatrices(Y,ot),n=$.getFrustum(),M(A,U,$.camera,Y,this.type)}$.isPointLightShadow!==!0&&this.type===Yn&&v($,U),$.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(y,w,H)};function v(E,A){const U=t.update(_);f.defines.VSM_SAMPLES!==E.blurSamples&&(f.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Oi(s.x,s.y)),f.uniforms.shadow_pass.value=E.map.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(A,null,U,f,_,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(A,null,U,d,_,null)}function x(E,A,U,y){let w=null;const H=U.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(H!==void 0)w=H;else if(w=U.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const G=w.uuid,tt=A.uuid;let I=h[G];I===void 0&&(I={},h[G]=I);let F=I[tt];F===void 0&&(F=w.clone(),I[tt]=F,A.addEventListener("dispose",R)),w=F}if(w.visible=A.visible,w.wireframe=A.wireframe,y===Yn?w.side=A.shadowSide!==null?A.shadowSide:A.side:w.side=A.shadowSide!==null?A.shadowSide:u[A.side],w.alphaMap=A.alphaMap,w.alphaTest=A.alphaTest,w.map=A.map,w.clipShadows=A.clipShadows,w.clippingPlanes=A.clippingPlanes,w.clipIntersection=A.clipIntersection,w.displacementMap=A.displacementMap,w.displacementScale=A.displacementScale,w.displacementBias=A.displacementBias,w.wireframeLinewidth=A.wireframeLinewidth,w.linewidth=A.linewidth,U.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const G=i.properties.get(w);G.light=U}return w}function M(E,A,U,y,w){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&w===Yn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,E.matrixWorld);const tt=t.update(E),I=E.material;if(Array.isArray(I)){const F=tt.groups;for(let W=0,Y=F.length;W<Y;W++){const $=F[W],q=I[$.materialIndex];if(q&&q.visible){const j=x(E,q,y,w);E.onBeforeShadow(i,E,A,U,tt,j,$),i.renderBufferDirect(U,null,tt,j,E,$),E.onAfterShadow(i,E,A,U,tt,j,$)}}}else if(I.visible){const F=x(E,I,y,w);E.onBeforeShadow(i,E,A,U,tt,F,null),i.renderBufferDirect(U,null,tt,F,E,null),E.onAfterShadow(i,E,A,U,tt,F,null)}}const G=E.children;for(let tt=0,I=G.length;tt<I;tt++)M(G[tt],A,U,y,w)}function R(E){E.target.removeEventListener("dispose",R);for(const U in h){const y=h[U],w=E.target.uuid;w in y&&(y[w].dispose(),delete y[w])}}}function kg(i,t,e){const n=e.isWebGL2;function s(){let L=!1;const rt=new pe;let ft=null;const Dt=new pe(0,0,0,0);return{setMask:function(Rt){ft!==Rt&&!L&&(i.colorMask(Rt,Rt,Rt,Rt),ft=Rt)},setLocked:function(Rt){L=Rt},setClear:function(Rt,Zt,Qt,_e,ye){ye===!0&&(Rt*=_e,Zt*=_e,Qt*=_e),rt.set(Rt,Zt,Qt,_e),Dt.equals(rt)===!1&&(i.clearColor(Rt,Zt,Qt,_e),Dt.copy(rt))},reset:function(){L=!1,ft=null,Dt.set(-1,0,0,0)}}}function r(){let L=!1,rt=null,ft=null,Dt=null;return{setTest:function(Rt){Rt?Bt(i.DEPTH_TEST):Lt(i.DEPTH_TEST)},setMask:function(Rt){rt!==Rt&&!L&&(i.depthMask(Rt),rt=Rt)},setFunc:function(Rt){if(ft!==Rt){switch(Rt){case af:i.depthFunc(i.NEVER);break;case cf:i.depthFunc(i.ALWAYS);break;case lf:i.depthFunc(i.LESS);break;case Wr:i.depthFunc(i.LEQUAL);break;case hf:i.depthFunc(i.EQUAL);break;case uf:i.depthFunc(i.GEQUAL);break;case ff:i.depthFunc(i.GREATER);break;case df:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ft=Rt}},setLocked:function(Rt){L=Rt},setClear:function(Rt){Dt!==Rt&&(i.clearDepth(Rt),Dt=Rt)},reset:function(){L=!1,rt=null,ft=null,Dt=null}}}function a(){let L=!1,rt=null,ft=null,Dt=null,Rt=null,Zt=null,Qt=null,_e=null,ye=null;return{setTest:function(te){L||(te?Bt(i.STENCIL_TEST):Lt(i.STENCIL_TEST))},setMask:function(te){rt!==te&&!L&&(i.stencilMask(te),rt=te)},setFunc:function(te,we,Pn){(ft!==te||Dt!==we||Rt!==Pn)&&(i.stencilFunc(te,we,Pn),ft=te,Dt=we,Rt=Pn)},setOp:function(te,we,Pn){(Zt!==te||Qt!==we||_e!==Pn)&&(i.stencilOp(te,we,Pn),Zt=te,Qt=we,_e=Pn)},setLocked:function(te){L=te},setClear:function(te){ye!==te&&(i.clearStencil(te),ye=te)},reset:function(){L=!1,rt=null,ft=null,Dt=null,Rt=null,Zt=null,Qt=null,_e=null,ye=null}}}const o=new s,c=new r,h=new a,l=new WeakMap,u=new WeakMap;let f={},d={},g=new WeakMap,_=[],m=null,p=!1,v=null,x=null,M=null,R=null,E=null,A=null,U=null,y=new $t(0,0,0),w=0,H=!1,G=null,tt=null,I=null,F=null,W=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,q=0;const j=i.getParameter(i.VERSION);j.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(j)[1]),$=q>=1):j.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),$=q>=2);let ot=null,at={};const X=i.getParameter(i.SCISSOR_BOX),K=i.getParameter(i.VIEWPORT),pt=new pe().fromArray(X),Et=new pe().fromArray(K);function St(L,rt,ft,Dt){const Rt=new Uint8Array(4),Zt=i.createTexture();i.bindTexture(L,Zt),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Qt=0;Qt<ft;Qt++)n&&(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)?i.texImage3D(rt,0,i.RGBA,1,1,Dt,0,i.RGBA,i.UNSIGNED_BYTE,Rt):i.texImage2D(rt+Qt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Rt);return Zt}const Ft={};Ft[i.TEXTURE_2D]=St(i.TEXTURE_2D,i.TEXTURE_2D,1),Ft[i.TEXTURE_CUBE_MAP]=St(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Ft[i.TEXTURE_2D_ARRAY]=St(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ft[i.TEXTURE_3D]=St(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),h.setClear(0),Bt(i.DEPTH_TEST),c.setFunc(Wr),Gt(!1),T(rc),Bt(i.CULL_FACE),Mt(di);function Bt(L){f[L]!==!0&&(i.enable(L),f[L]=!0)}function Lt(L){f[L]!==!1&&(i.disable(L),f[L]=!1)}function Jt(L,rt){return d[L]!==rt?(i.bindFramebuffer(L,rt),d[L]=rt,n&&(L===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=rt),L===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=rt)),!0):!1}function z(L,rt){let ft=_,Dt=!1;if(L)if(ft=g.get(rt),ft===void 0&&(ft=[],g.set(rt,ft)),L.isWebGLMultipleRenderTargets){const Rt=L.texture;if(ft.length!==Rt.length||ft[0]!==i.COLOR_ATTACHMENT0){for(let Zt=0,Qt=Rt.length;Zt<Qt;Zt++)ft[Zt]=i.COLOR_ATTACHMENT0+Zt;ft.length=Rt.length,Dt=!0}}else ft[0]!==i.COLOR_ATTACHMENT0&&(ft[0]=i.COLOR_ATTACHMENT0,Dt=!0);else ft[0]!==i.BACK&&(ft[0]=i.BACK,Dt=!0);Dt&&(e.isWebGL2?i.drawBuffers(ft):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ft))}function Be(L){return m!==L?(i.useProgram(L),m=L,!0):!1}const At={[Ci]:i.FUNC_ADD,[Xu]:i.FUNC_SUBTRACT,[$u]:i.FUNC_REVERSE_SUBTRACT};if(n)At[lc]=i.MIN,At[hc]=i.MAX;else{const L=t.get("EXT_blend_minmax");L!==null&&(At[lc]=L.MIN_EXT,At[hc]=L.MAX_EXT)}const Ut={[qu]:i.ZERO,[Yu]:i.ONE,[ju]:i.SRC_COLOR,[da]:i.SRC_ALPHA,[ef]:i.SRC_ALPHA_SATURATE,[Qu]:i.DST_COLOR,[Ju]:i.DST_ALPHA,[Ku]:i.ONE_MINUS_SRC_COLOR,[pa]:i.ONE_MINUS_SRC_ALPHA,[tf]:i.ONE_MINUS_DST_COLOR,[Zu]:i.ONE_MINUS_DST_ALPHA,[nf]:i.CONSTANT_COLOR,[sf]:i.ONE_MINUS_CONSTANT_COLOR,[rf]:i.CONSTANT_ALPHA,[of]:i.ONE_MINUS_CONSTANT_ALPHA};function Mt(L,rt,ft,Dt,Rt,Zt,Qt,_e,ye,te){if(L===di){p===!0&&(Lt(i.BLEND),p=!1);return}if(p===!1&&(Bt(i.BLEND),p=!0),L!==Wu){if(L!==v||te!==H){if((x!==Ci||E!==Ci)&&(i.blendEquation(i.FUNC_ADD),x=Ci,E=Ci),te)switch(L){case xs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case oc:i.blendFunc(i.ONE,i.ONE);break;case ac:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case cc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case xs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case oc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ac:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case cc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}M=null,R=null,A=null,U=null,y.set(0,0,0),w=0,v=L,H=te}return}Rt=Rt||rt,Zt=Zt||ft,Qt=Qt||Dt,(rt!==x||Rt!==E)&&(i.blendEquationSeparate(At[rt],At[Rt]),x=rt,E=Rt),(ft!==M||Dt!==R||Zt!==A||Qt!==U)&&(i.blendFuncSeparate(Ut[ft],Ut[Dt],Ut[Zt],Ut[Qt]),M=ft,R=Dt,A=Zt,U=Qt),(_e.equals(y)===!1||ye!==w)&&(i.blendColor(_e.r,_e.g,_e.b,ye),y.copy(_e),w=ye),v=L,H=!1}function ue(L,rt){L.side===pn?Lt(i.CULL_FACE):Bt(i.CULL_FACE);let ft=L.side===en;rt&&(ft=!ft),Gt(ft),L.blending===xs&&L.transparent===!1?Mt(di):Mt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),c.setFunc(L.depthFunc),c.setTest(L.depthTest),c.setMask(L.depthWrite),o.setMask(L.colorWrite);const Dt=L.stencilWrite;h.setTest(Dt),Dt&&(h.setMask(L.stencilWriteMask),h.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),h.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),O(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Bt(i.SAMPLE_ALPHA_TO_COVERAGE):Lt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Gt(L){G!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),G=L)}function T(L){L!==Gu?(Bt(i.CULL_FACE),L!==tt&&(L===rc?i.cullFace(i.BACK):L===Vu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Lt(i.CULL_FACE),tt=L}function S(L){L!==I&&($&&i.lineWidth(L),I=L)}function O(L,rt,ft){L?(Bt(i.POLYGON_OFFSET_FILL),(F!==rt||W!==ft)&&(i.polygonOffset(rt,ft),F=rt,W=ft)):Lt(i.POLYGON_OFFSET_FILL)}function et(L){L?Bt(i.SCISSOR_TEST):Lt(i.SCISSOR_TEST)}function Z(L){L===void 0&&(L=i.TEXTURE0+Y-1),ot!==L&&(i.activeTexture(L),ot=L)}function nt(L,rt,ft){ft===void 0&&(ot===null?ft=i.TEXTURE0+Y-1:ft=ot);let Dt=at[ft];Dt===void 0&&(Dt={type:void 0,texture:void 0},at[ft]=Dt),(Dt.type!==L||Dt.texture!==rt)&&(ot!==ft&&(i.activeTexture(ft),ot=ft),i.bindTexture(L,rt||Ft[L]),Dt.type=L,Dt.texture=rt)}function yt(){const L=at[ot];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function dt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Pt(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Vt(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ie(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function qt(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Nt(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Tt(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function mt(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function P(L){pt.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),pt.copy(L))}function st(L){Et.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Et.copy(L))}function bt(L,rt){let ft=u.get(rt);ft===void 0&&(ft=new WeakMap,u.set(rt,ft));let Dt=ft.get(L);Dt===void 0&&(Dt=i.getUniformBlockIndex(rt,L.name),ft.set(L,Dt))}function vt(L,rt){const Dt=u.get(rt).get(L);l.get(rt)!==Dt&&(i.uniformBlockBinding(rt,Dt,L.__bindingPointIndex),l.set(rt,Dt))}function Q(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},ot=null,at={},d={},g=new WeakMap,_=[],m=null,p=!1,v=null,x=null,M=null,R=null,E=null,A=null,U=null,y=new $t(0,0,0),w=0,H=!1,G=null,tt=null,I=null,F=null,W=null,pt.set(0,0,i.canvas.width,i.canvas.height),Et.set(0,0,i.canvas.width,i.canvas.height),o.reset(),c.reset(),h.reset()}return{buffers:{color:o,depth:c,stencil:h},enable:Bt,disable:Lt,bindFramebuffer:Jt,drawBuffers:z,useProgram:Be,setBlending:Mt,setMaterial:ue,setFlipSided:Gt,setCullFace:T,setLineWidth:S,setPolygonOffset:O,setScissorTest:et,activeTexture:Z,bindTexture:nt,unbindTexture:yt,compressedTexImage2D:dt,compressedTexImage3D:xt,texImage2D:Tt,texImage3D:mt,updateUBOMapping:bt,uniformBlockBinding:vt,texStorage2D:qt,texStorage3D:Nt,texSubImage2D:Pt,texSubImage3D:Vt,compressedTexSubImage2D:J,compressedTexSubImage3D:ie,scissor:P,viewport:st,reset:Q}}function Hg(i,t,e,n,s,r,a){const o=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,S){return d?new OffscreenCanvas(T,S):Kr("canvas")}function _(T,S,O,et){let Z=1;if((T.width>et||T.height>et)&&(Z=et/Math.max(T.width,T.height)),Z<1||S===!0)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap){const nt=S?Ma:Math.floor,yt=nt(Z*T.width),dt=nt(Z*T.height);u===void 0&&(u=g(yt,dt));const xt=O?g(yt,dt):u;return xt.width=yt,xt.height=dt,xt.getContext("2d").drawImage(T,0,0,yt,dt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+T.width+"x"+T.height+") to ("+yt+"x"+dt+")."),xt}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+T.width+"x"+T.height+")."),T;return T}function m(T){return kc(T.width)&&kc(T.height)}function p(T){return o?!1:T.wrapS!==En||T.wrapT!==En||T.minFilter!==ke&&T.minFilter!==tn}function v(T,S){return T.generateMipmaps&&S&&T.minFilter!==ke&&T.minFilter!==tn}function x(T){i.generateMipmap(T)}function M(T,S,O,et,Z=!1){if(o===!1)return S;if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let nt=S;if(S===i.RED&&(O===i.FLOAT&&(nt=i.R32F),O===i.HALF_FLOAT&&(nt=i.R16F),O===i.UNSIGNED_BYTE&&(nt=i.R8)),S===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(nt=i.R8UI),O===i.UNSIGNED_SHORT&&(nt=i.R16UI),O===i.UNSIGNED_INT&&(nt=i.R32UI),O===i.BYTE&&(nt=i.R8I),O===i.SHORT&&(nt=i.R16I),O===i.INT&&(nt=i.R32I)),S===i.RG&&(O===i.FLOAT&&(nt=i.RG32F),O===i.HALF_FLOAT&&(nt=i.RG16F),O===i.UNSIGNED_BYTE&&(nt=i.RG8)),S===i.RGBA){const yt=Z?$r:le.getTransfer(et);O===i.FLOAT&&(nt=i.RGBA32F),O===i.HALF_FLOAT&&(nt=i.RGBA16F),O===i.UNSIGNED_BYTE&&(nt=yt===fe?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(nt=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(nt=i.RGB5_A1)}return(nt===i.R16F||nt===i.R32F||nt===i.RG16F||nt===i.RG32F||nt===i.RGBA16F||nt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function R(T,S,O){return v(T,O)===!0||T.isFramebufferTexture&&T.minFilter!==ke&&T.minFilter!==tn?Math.log2(Math.max(S.width,S.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?S.mipmaps.length:1}function E(T){return T===ke||T===uc||T===bo?i.NEAREST:i.LINEAR}function A(T){const S=T.target;S.removeEventListener("dispose",A),y(S),S.isVideoTexture&&l.delete(S)}function U(T){const S=T.target;S.removeEventListener("dispose",U),H(S)}function y(T){const S=n.get(T);if(S.__webglInit===void 0)return;const O=T.source,et=f.get(O);if(et){const Z=et[S.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&w(T),Object.keys(et).length===0&&f.delete(O)}n.remove(T)}function w(T){const S=n.get(T);i.deleteTexture(S.__webglTexture);const O=T.source,et=f.get(O);delete et[S.__cacheKey],a.memory.textures--}function H(T){const S=T.texture,O=n.get(T),et=n.get(S);if(et.__webglTexture!==void 0&&(i.deleteTexture(et.__webglTexture),a.memory.textures--),T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(O.__webglFramebuffer[Z]))for(let nt=0;nt<O.__webglFramebuffer[Z].length;nt++)i.deleteFramebuffer(O.__webglFramebuffer[Z][nt]);else i.deleteFramebuffer(O.__webglFramebuffer[Z]);O.__webglDepthbuffer&&i.deleteRenderbuffer(O.__webglDepthbuffer[Z])}else{if(Array.isArray(O.__webglFramebuffer))for(let Z=0;Z<O.__webglFramebuffer.length;Z++)i.deleteFramebuffer(O.__webglFramebuffer[Z]);else i.deleteFramebuffer(O.__webglFramebuffer);if(O.__webglDepthbuffer&&i.deleteRenderbuffer(O.__webglDepthbuffer),O.__webglMultisampledFramebuffer&&i.deleteFramebuffer(O.__webglMultisampledFramebuffer),O.__webglColorRenderbuffer)for(let Z=0;Z<O.__webglColorRenderbuffer.length;Z++)O.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(O.__webglColorRenderbuffer[Z]);O.__webglDepthRenderbuffer&&i.deleteRenderbuffer(O.__webglDepthRenderbuffer)}if(T.isWebGLMultipleRenderTargets)for(let Z=0,nt=S.length;Z<nt;Z++){const yt=n.get(S[Z]);yt.__webglTexture&&(i.deleteTexture(yt.__webglTexture),a.memory.textures--),n.remove(S[Z])}n.remove(S),n.remove(T)}let G=0;function tt(){G=0}function I(){const T=G;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),G+=1,T}function F(T){const S=[];return S.push(T.wrapS),S.push(T.wrapT),S.push(T.wrapR||0),S.push(T.magFilter),S.push(T.minFilter),S.push(T.anisotropy),S.push(T.internalFormat),S.push(T.format),S.push(T.type),S.push(T.generateMipmaps),S.push(T.premultiplyAlpha),S.push(T.flipY),S.push(T.unpackAlignment),S.push(T.colorSpace),S.join()}function W(T,S){const O=n.get(T);if(T.isVideoTexture&&ue(T),T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){const et=T.image;if(et===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(et.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{pt(O,T,S);return}}e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+S)}function Y(T,S){const O=n.get(T);if(T.version>0&&O.__version!==T.version){pt(O,T,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+S)}function $(T,S){const O=n.get(T);if(T.version>0&&O.__version!==T.version){pt(O,T,S);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+S)}function q(T,S){const O=n.get(T);if(T.version>0&&O.__version!==T.version){Et(O,T,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+S)}const j={[Xr]:i.REPEAT,[En]:i.CLAMP_TO_EDGE,[_a]:i.MIRRORED_REPEAT},ot={[ke]:i.NEAREST,[uc]:i.NEAREST_MIPMAP_NEAREST,[bo]:i.NEAREST_MIPMAP_LINEAR,[tn]:i.LINEAR,[yf]:i.LINEAR_MIPMAP_NEAREST,[Qs]:i.LINEAR_MIPMAP_LINEAR},at={[If]:i.NEVER,[Bf]:i.ALWAYS,[Uf]:i.LESS,[Sh]:i.LEQUAL,[Nf]:i.EQUAL,[Ff]:i.GEQUAL,[Of]:i.GREATER,[zf]:i.NOTEQUAL};function X(T,S,O){if(O?(i.texParameteri(T,i.TEXTURE_WRAP_S,j[S.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,j[S.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,j[S.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ot[S.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ot[S.minFilter])):(i.texParameteri(T,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(T,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(S.wrapS!==En||S.wrapT!==En)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(T,i.TEXTURE_MAG_FILTER,E(S.magFilter)),i.texParameteri(T,i.TEXTURE_MIN_FILTER,E(S.minFilter)),S.minFilter!==ke&&S.minFilter!==tn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),S.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,at[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const et=t.get("EXT_texture_filter_anisotropic");if(S.magFilter===ke||S.minFilter!==bo&&S.minFilter!==Qs||S.type===fi&&t.has("OES_texture_float_linear")===!1||o===!1&&S.type===tr&&t.has("OES_texture_half_float_linear")===!1)return;(S.anisotropy>1||n.get(S).__currentAnisotropy)&&(i.texParameterf(T,et.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy)}}function K(T,S){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,S.addEventListener("dispose",A));const et=S.source;let Z=f.get(et);Z===void 0&&(Z={},f.set(et,Z));const nt=F(S);if(nt!==T.__cacheKey){Z[nt]===void 0&&(Z[nt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Z[nt].usedTimes++;const yt=Z[T.__cacheKey];yt!==void 0&&(Z[T.__cacheKey].usedTimes--,yt.usedTimes===0&&w(S)),T.__cacheKey=nt,T.__webglTexture=Z[nt].texture}return O}function pt(T,S,O){let et=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(et=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(et=i.TEXTURE_3D);const Z=K(T,S),nt=S.source;e.bindTexture(et,T.__webglTexture,i.TEXTURE0+O);const yt=n.get(nt);if(nt.version!==yt.__version||Z===!0){e.activeTexture(i.TEXTURE0+O);const dt=le.getPrimaries(le.workingColorSpace),xt=S.colorSpace===gn?null:le.getPrimaries(S.colorSpace),Pt=S.colorSpace===gn||dt===xt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const Vt=p(S)&&m(S.image)===!1;let J=_(S.image,Vt,!1,s.maxTextureSize);J=Gt(S,J);const ie=m(J)||o,qt=r.convert(S.format,S.colorSpace);let Nt=r.convert(S.type),Tt=M(S.internalFormat,qt,Nt,S.colorSpace,S.isVideoTexture);X(et,S,ie);let mt;const P=S.mipmaps,st=o&&S.isVideoTexture!==!0&&Tt!==Mh,bt=yt.__version===void 0||Z===!0,vt=R(S,J,ie);if(S.isDepthTexture)Tt=i.DEPTH_COMPONENT,o?S.type===fi?Tt=i.DEPTH_COMPONENT32F:S.type===ui?Tt=i.DEPTH_COMPONENT24:S.type===Li?Tt=i.DEPTH24_STENCIL8:Tt=i.DEPTH_COMPONENT16:S.type===fi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),S.format===Di&&Tt===i.DEPTH_COMPONENT&&S.type!==Ra&&S.type!==ui&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),S.type=ui,Nt=r.convert(S.type)),S.format===Ts&&Tt===i.DEPTH_COMPONENT&&(Tt=i.DEPTH_STENCIL,S.type!==Li&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),S.type=Li,Nt=r.convert(S.type))),bt&&(st?e.texStorage2D(i.TEXTURE_2D,1,Tt,J.width,J.height):e.texImage2D(i.TEXTURE_2D,0,Tt,J.width,J.height,0,qt,Nt,null));else if(S.isDataTexture)if(P.length>0&&ie){st&&bt&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,P[0].width,P[0].height);for(let Q=0,L=P.length;Q<L;Q++)mt=P[Q],st?e.texSubImage2D(i.TEXTURE_2D,Q,0,0,mt.width,mt.height,qt,Nt,mt.data):e.texImage2D(i.TEXTURE_2D,Q,Tt,mt.width,mt.height,0,qt,Nt,mt.data);S.generateMipmaps=!1}else st?(bt&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,J.width,J.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,J.width,J.height,qt,Nt,J.data)):e.texImage2D(i.TEXTURE_2D,0,Tt,J.width,J.height,0,qt,Nt,J.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){st&&bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,Tt,P[0].width,P[0].height,J.depth);for(let Q=0,L=P.length;Q<L;Q++)mt=P[Q],S.format!==mn?qt!==null?st?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,mt.width,mt.height,J.depth,qt,mt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,Tt,mt.width,mt.height,J.depth,0,mt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?e.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,mt.width,mt.height,J.depth,qt,Nt,mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Q,Tt,mt.width,mt.height,J.depth,0,qt,Nt,mt.data)}else{st&&bt&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,P[0].width,P[0].height);for(let Q=0,L=P.length;Q<L;Q++)mt=P[Q],S.format!==mn?qt!==null?st?e.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,mt.width,mt.height,qt,mt.data):e.compressedTexImage2D(i.TEXTURE_2D,Q,Tt,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?e.texSubImage2D(i.TEXTURE_2D,Q,0,0,mt.width,mt.height,qt,Nt,mt.data):e.texImage2D(i.TEXTURE_2D,Q,Tt,mt.width,mt.height,0,qt,Nt,mt.data)}else if(S.isDataArrayTexture)st?(bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,Tt,J.width,J.height,J.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,qt,Nt,J.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Tt,J.width,J.height,J.depth,0,qt,Nt,J.data);else if(S.isData3DTexture)st?(bt&&e.texStorage3D(i.TEXTURE_3D,vt,Tt,J.width,J.height,J.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,qt,Nt,J.data)):e.texImage3D(i.TEXTURE_3D,0,Tt,J.width,J.height,J.depth,0,qt,Nt,J.data);else if(S.isFramebufferTexture){if(bt)if(st)e.texStorage2D(i.TEXTURE_2D,vt,Tt,J.width,J.height);else{let Q=J.width,L=J.height;for(let rt=0;rt<vt;rt++)e.texImage2D(i.TEXTURE_2D,rt,Tt,Q,L,0,qt,Nt,null),Q>>=1,L>>=1}}else if(P.length>0&&ie){st&&bt&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,P[0].width,P[0].height);for(let Q=0,L=P.length;Q<L;Q++)mt=P[Q],st?e.texSubImage2D(i.TEXTURE_2D,Q,0,0,qt,Nt,mt):e.texImage2D(i.TEXTURE_2D,Q,Tt,qt,Nt,mt);S.generateMipmaps=!1}else st?(bt&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,J.width,J.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,qt,Nt,J)):e.texImage2D(i.TEXTURE_2D,0,Tt,qt,Nt,J);v(S,ie)&&x(et),yt.__version=nt.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function Et(T,S,O){if(S.image.length!==6)return;const et=K(T,S),Z=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+O);const nt=n.get(Z);if(Z.version!==nt.__version||et===!0){e.activeTexture(i.TEXTURE0+O);const yt=le.getPrimaries(le.workingColorSpace),dt=S.colorSpace===gn?null:le.getPrimaries(S.colorSpace),xt=S.colorSpace===gn||yt===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const Pt=S.isCompressedTexture||S.image[0].isCompressedTexture,Vt=S.image[0]&&S.image[0].isDataTexture,J=[];for(let Q=0;Q<6;Q++)!Pt&&!Vt?J[Q]=_(S.image[Q],!1,!0,s.maxCubemapSize):J[Q]=Vt?S.image[Q].image:S.image[Q],J[Q]=Gt(S,J[Q]);const ie=J[0],qt=m(ie)||o,Nt=r.convert(S.format,S.colorSpace),Tt=r.convert(S.type),mt=M(S.internalFormat,Nt,Tt,S.colorSpace),P=o&&S.isVideoTexture!==!0,st=nt.__version===void 0||et===!0;let bt=R(S,ie,qt);X(i.TEXTURE_CUBE_MAP,S,qt);let vt;if(Pt){P&&st&&e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,mt,ie.width,ie.height);for(let Q=0;Q<6;Q++){vt=J[Q].mipmaps;for(let L=0;L<vt.length;L++){const rt=vt[L];S.format!==mn?Nt!==null?P?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L,0,0,rt.width,rt.height,Nt,rt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L,mt,rt.width,rt.height,0,rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L,0,0,rt.width,rt.height,Nt,Tt,rt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L,mt,rt.width,rt.height,0,Nt,Tt,rt.data)}}}else{vt=S.mipmaps,P&&st&&(vt.length>0&&bt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,mt,J[0].width,J[0].height));for(let Q=0;Q<6;Q++)if(Vt){P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,J[Q].width,J[Q].height,Nt,Tt,J[Q].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,mt,J[Q].width,J[Q].height,0,Nt,Tt,J[Q].data);for(let L=0;L<vt.length;L++){const ft=vt[L].image[Q].image;P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L+1,0,0,ft.width,ft.height,Nt,Tt,ft.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L+1,mt,ft.width,ft.height,0,Nt,Tt,ft.data)}}else{P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Nt,Tt,J[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,mt,Nt,Tt,J[Q]);for(let L=0;L<vt.length;L++){const rt=vt[L];P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L+1,0,0,Nt,Tt,rt.image[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L+1,mt,Nt,Tt,rt.image[Q])}}}v(S,qt)&&x(i.TEXTURE_CUBE_MAP),nt.__version=Z.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function St(T,S,O,et,Z,nt){const yt=r.convert(O.format,O.colorSpace),dt=r.convert(O.type),xt=M(O.internalFormat,yt,dt,O.colorSpace);if(!n.get(S).__hasExternalTextures){const Vt=Math.max(1,S.width>>nt),J=Math.max(1,S.height>>nt);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?e.texImage3D(Z,nt,xt,Vt,J,S.depth,0,yt,dt,null):e.texImage2D(Z,nt,xt,Vt,J,0,yt,dt,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,et,Z,n.get(O).__webglTexture,0,Ut(S)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,et,Z,n.get(O).__webglTexture,nt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ft(T,S,O){if(i.bindRenderbuffer(i.RENDERBUFFER,T),S.depthBuffer&&!S.stencilBuffer){let et=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(O||Mt(S)){const Z=S.depthTexture;Z&&Z.isDepthTexture&&(Z.type===fi?et=i.DEPTH_COMPONENT32F:Z.type===ui&&(et=i.DEPTH_COMPONENT24));const nt=Ut(S);Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,et,S.width,S.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,et,S.width,S.height)}else i.renderbufferStorage(i.RENDERBUFFER,et,S.width,S.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,T)}else if(S.depthBuffer&&S.stencilBuffer){const et=Ut(S);O&&Mt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,et,i.DEPTH24_STENCIL8,S.width,S.height):Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,et,i.DEPTH24_STENCIL8,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,T)}else{const et=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let Z=0;Z<et.length;Z++){const nt=et[Z],yt=r.convert(nt.format,nt.colorSpace),dt=r.convert(nt.type),xt=M(nt.internalFormat,yt,dt,nt.colorSpace),Pt=Ut(S);O&&Mt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Pt,xt,S.width,S.height):Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Pt,xt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,xt,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Bt(T,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),W(S.depthTexture,0);const et=n.get(S.depthTexture).__webglTexture,Z=Ut(S);if(S.depthTexture.format===Di)Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0);else if(S.depthTexture.format===Ts)Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function Lt(T){const S=n.get(T),O=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!S.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Bt(S.__webglFramebuffer,T)}else if(O){S.__webglDepthbuffer=[];for(let et=0;et<6;et++)e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[et]),S.__webglDepthbuffer[et]=i.createRenderbuffer(),Ft(S.__webglDepthbuffer[et],T,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=i.createRenderbuffer(),Ft(S.__webglDepthbuffer,T,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Jt(T,S,O){const et=n.get(T);S!==void 0&&St(et.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Lt(T)}function z(T){const S=T.texture,O=n.get(T),et=n.get(S);T.addEventListener("dispose",U),T.isWebGLMultipleRenderTargets!==!0&&(et.__webglTexture===void 0&&(et.__webglTexture=i.createTexture()),et.__version=S.version,a.memory.textures++);const Z=T.isWebGLCubeRenderTarget===!0,nt=T.isWebGLMultipleRenderTargets===!0,yt=m(T)||o;if(Z){O.__webglFramebuffer=[];for(let dt=0;dt<6;dt++)if(o&&S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer[dt]=[];for(let xt=0;xt<S.mipmaps.length;xt++)O.__webglFramebuffer[dt][xt]=i.createFramebuffer()}else O.__webglFramebuffer[dt]=i.createFramebuffer()}else{if(o&&S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer=[];for(let dt=0;dt<S.mipmaps.length;dt++)O.__webglFramebuffer[dt]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(nt)if(s.drawBuffers){const dt=T.texture;for(let xt=0,Pt=dt.length;xt<Pt;xt++){const Vt=n.get(dt[xt]);Vt.__webglTexture===void 0&&(Vt.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&T.samples>0&&Mt(T)===!1){const dt=nt?S:[S];O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let xt=0;xt<dt.length;xt++){const Pt=dt[xt];O.__webglColorRenderbuffer[xt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[xt]);const Vt=r.convert(Pt.format,Pt.colorSpace),J=r.convert(Pt.type),ie=M(Pt.internalFormat,Vt,J,Pt.colorSpace,T.isXRRenderTarget===!0),qt=Ut(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,qt,ie,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,O.__webglColorRenderbuffer[xt])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Ft(O.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,et.__webglTexture),X(i.TEXTURE_CUBE_MAP,S,yt);for(let dt=0;dt<6;dt++)if(o&&S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)St(O.__webglFramebuffer[dt][xt],T,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,xt);else St(O.__webglFramebuffer[dt],T,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0);v(S,yt)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(nt){const dt=T.texture;for(let xt=0,Pt=dt.length;xt<Pt;xt++){const Vt=dt[xt],J=n.get(Vt);e.bindTexture(i.TEXTURE_2D,J.__webglTexture),X(i.TEXTURE_2D,Vt,yt),St(O.__webglFramebuffer,T,Vt,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,0),v(Vt,yt)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let dt=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(o?dt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(dt,et.__webglTexture),X(dt,S,yt),o&&S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)St(O.__webglFramebuffer[xt],T,S,i.COLOR_ATTACHMENT0,dt,xt);else St(O.__webglFramebuffer,T,S,i.COLOR_ATTACHMENT0,dt,0);v(S,yt)&&x(dt),e.unbindTexture()}T.depthBuffer&&Lt(T)}function Be(T){const S=m(T)||o,O=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let et=0,Z=O.length;et<Z;et++){const nt=O[et];if(v(nt,S)){const yt=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,dt=n.get(nt).__webglTexture;e.bindTexture(yt,dt),x(yt),e.unbindTexture()}}}function At(T){if(o&&T.samples>0&&Mt(T)===!1){const S=T.isWebGLMultipleRenderTargets?T.texture:[T.texture],O=T.width,et=T.height;let Z=i.COLOR_BUFFER_BIT;const nt=[],yt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=n.get(T),xt=T.isWebGLMultipleRenderTargets===!0;if(xt)for(let Pt=0;Pt<S.length;Pt++)e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,dt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,dt.__webglFramebuffer);for(let Pt=0;Pt<S.length;Pt++){nt.push(i.COLOR_ATTACHMENT0+Pt),T.depthBuffer&&nt.push(yt);const Vt=dt.__ignoreDepthValues!==void 0?dt.__ignoreDepthValues:!1;if(Vt===!1&&(T.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),xt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,dt.__webglColorRenderbuffer[Pt]),Vt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[yt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[yt])),xt){const J=n.get(S[Pt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,J,0)}i.blitFramebuffer(0,0,O,et,0,0,O,et,Z,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,nt)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),xt)for(let Pt=0;Pt<S.length;Pt++){e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,dt.__webglColorRenderbuffer[Pt]);const Vt=n.get(S[Pt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,Vt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,dt.__webglMultisampledFramebuffer)}}function Ut(T){return Math.min(s.maxSamples,T.samples)}function Mt(T){const S=n.get(T);return o&&T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function ue(T){const S=a.render.frame;l.get(T)!==S&&(l.set(T,S),T.update())}function Gt(T,S){const O=T.colorSpace,et=T.format,Z=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||T.format===va||O!==ii&&O!==gn&&(le.getTransfer(O)===fe?o===!1?t.has("EXT_sRGB")===!0&&et===mn?(T.format=va,T.minFilter=tn,T.generateMipmaps=!1):S=Eh.sRGBToLinear(S):(et!==mn||Z!==mi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),S}this.allocateTextureUnit=I,this.resetTextureUnits=tt,this.setTexture2D=W,this.setTexture2DArray=Y,this.setTexture3D=$,this.setTextureCube=q,this.rebindTextures=Jt,this.setupRenderTarget=z,this.updateRenderTargetMipmap=Be,this.updateMultisampleRenderTarget=At,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=St,this.useMultisampledRTT=Mt}function Gg(i,t,e){const n=e.isWebGL2;function s(r,a=gn){let o;const c=le.getTransfer(a);if(r===mi)return i.UNSIGNED_BYTE;if(r===mh)return i.UNSIGNED_SHORT_4_4_4_4;if(r===gh)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Sf)return i.BYTE;if(r===bf)return i.SHORT;if(r===Ra)return i.UNSIGNED_SHORT;if(r===ph)return i.INT;if(r===ui)return i.UNSIGNED_INT;if(r===fi)return i.FLOAT;if(r===tr)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===Ef)return i.ALPHA;if(r===mn)return i.RGBA;if(r===wf)return i.LUMINANCE;if(r===Tf)return i.LUMINANCE_ALPHA;if(r===Di)return i.DEPTH_COMPONENT;if(r===Ts)return i.DEPTH_STENCIL;if(r===va)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Af)return i.RED;if(r===_h)return i.RED_INTEGER;if(r===Rf)return i.RG;if(r===vh)return i.RG_INTEGER;if(r===xh)return i.RGBA_INTEGER;if(r===Eo||r===wo||r===To||r===Ao)if(c===fe)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Eo)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===wo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===To)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Ao)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Eo)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===wo)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===To)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Ao)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===fc||r===dc||r===pc||r===mc)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===fc)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===dc)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===pc)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===mc)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Mh)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===gc||r===_c)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===gc)return c===fe?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===_c)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===vc||r===xc||r===Mc||r===yc||r===Sc||r===bc||r===Ec||r===wc||r===Tc||r===Ac||r===Rc||r===Cc||r===Pc||r===Lc)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===vc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===xc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Mc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===yc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Sc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===bc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Ec)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===wc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Tc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Ac)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Rc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Cc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Pc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Lc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Ro||r===Dc||r===Ic)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===Ro)return c===fe?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Dc)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Ic)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Cf||r===Uc||r===Nc||r===Oc)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===Ro)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Uc)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Nc)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Oc)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Li?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class Vg extends cn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class zt extends Oe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Wg={type:"move"};class Zo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(h,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],f=l.position.distanceTo(u.position),d=.02,g=.005;h.inputState.pinching&&f>d+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&f<=d-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Wg)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new zt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Xg extends Bi{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,h=null,l=null,u=null,f=null,d=null,g=null;const _=e.getContextAttributes();let m=null,p=null;const v=[],x=[],M=new ht;let R=null;const E=new cn;E.layers.enable(1),E.viewport=new pe;const A=new cn;A.layers.enable(2),A.viewport=new pe;const U=[E,A],y=new Vg;y.layers.enable(1),y.layers.enable(2);let w=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let K=v[X];return K===void 0&&(K=new Zo,v[X]=K),K.getTargetRaySpace()},this.getControllerGrip=function(X){let K=v[X];return K===void 0&&(K=new Zo,v[X]=K),K.getGripSpace()},this.getHand=function(X){let K=v[X];return K===void 0&&(K=new Zo,v[X]=K),K.getHandSpace()};function G(X){const K=x.indexOf(X.inputSource);if(K===-1)return;const pt=v[K];pt!==void 0&&(pt.update(X.inputSource,X.frame,h||a),pt.dispatchEvent({type:X.type,data:X.inputSource}))}function tt(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",tt),s.removeEventListener("inputsourceschange",I);for(let X=0;X<v.length;X++){const K=x[X];K!==null&&(x[X]=null,v[X].disconnect(K))}w=null,H=null,t.setRenderTarget(m),d=null,f=null,u=null,s=null,p=null,at.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(X){h=X},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",tt),s.addEventListener("inputsourceschange",I),_.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(M),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const K={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,K),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),p=new Oi(d.framebufferWidth,d.framebufferHeight,{format:mn,type:mi,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let K=null,pt=null,Et=null;_.depth&&(Et=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,K=_.stencil?Ts:Di,pt=_.stencil?Li:ui);const St={colorFormat:e.RGBA8,depthFormat:Et,scaleFactor:r};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(St),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),p=new Oi(f.textureWidth,f.textureHeight,{format:mn,type:mi,depthTexture:new Nh(f.textureWidth,f.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const Ft=t.properties.get(p);Ft.__ignoreDepthValues=f.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),at.setContext(s),at.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function I(X){for(let K=0;K<X.removed.length;K++){const pt=X.removed[K],Et=x.indexOf(pt);Et>=0&&(x[Et]=null,v[Et].disconnect(pt))}for(let K=0;K<X.added.length;K++){const pt=X.added[K];let Et=x.indexOf(pt);if(Et===-1){for(let Ft=0;Ft<v.length;Ft++)if(Ft>=x.length){x.push(pt),Et=Ft;break}else if(x[Ft]===null){x[Ft]=pt,Et=Ft;break}if(Et===-1)break}const St=v[Et];St&&St.connect(pt)}}const F=new C,W=new C;function Y(X,K,pt){F.setFromMatrixPosition(K.matrixWorld),W.setFromMatrixPosition(pt.matrixWorld);const Et=F.distanceTo(W),St=K.projectionMatrix.elements,Ft=pt.projectionMatrix.elements,Bt=St[14]/(St[10]-1),Lt=St[14]/(St[10]+1),Jt=(St[9]+1)/St[5],z=(St[9]-1)/St[5],Be=(St[8]-1)/St[0],At=(Ft[8]+1)/Ft[0],Ut=Bt*Be,Mt=Bt*At,ue=Et/(-Be+At),Gt=ue*-Be;K.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Gt),X.translateZ(ue),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const T=Bt+ue,S=Lt+ue,O=Ut-Gt,et=Mt+(Et-Gt),Z=Jt*Lt/S*T,nt=z*Lt/S*T;X.projectionMatrix.makePerspective(O,et,Z,nt,T,S),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function $(X,K){K===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(K.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;y.near=A.near=E.near=X.near,y.far=A.far=E.far=X.far,(w!==y.near||H!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),w=y.near,H=y.far);const K=X.parent,pt=y.cameras;$(y,K);for(let Et=0;Et<pt.length;Et++)$(pt[Et],K);pt.length===2?Y(y,E,A):y.projectionMatrix.copy(E.projectionMatrix),q(X,y,K)};function q(X,K,pt){pt===null?X.matrix.copy(K.matrixWorld):(X.matrix.copy(pt.matrixWorld),X.matrix.invert(),X.matrix.multiply(K.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(K.projectionMatrix),X.projectionMatrixInverse.copy(K.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=xa*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(X){c=X,f!==null&&(f.fixedFoveation=X),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=X)};let j=null;function ot(X,K){if(l=K.getViewerPose(h||a),g=K,l!==null){const pt=l.views;d!==null&&(t.setRenderTargetFramebuffer(p,d.framebuffer),t.setRenderTarget(p));let Et=!1;pt.length!==y.cameras.length&&(y.cameras.length=0,Et=!0);for(let St=0;St<pt.length;St++){const Ft=pt[St];let Bt=null;if(d!==null)Bt=d.getViewport(Ft);else{const Jt=u.getViewSubImage(f,Ft);Bt=Jt.viewport,St===0&&(t.setRenderTargetTextures(p,Jt.colorTexture,f.ignoreDepthValues?void 0:Jt.depthStencilTexture),t.setRenderTarget(p))}let Lt=U[St];Lt===void 0&&(Lt=new cn,Lt.layers.enable(St),Lt.viewport=new pe,U[St]=Lt),Lt.matrix.fromArray(Ft.transform.matrix),Lt.matrix.decompose(Lt.position,Lt.quaternion,Lt.scale),Lt.projectionMatrix.fromArray(Ft.projectionMatrix),Lt.projectionMatrixInverse.copy(Lt.projectionMatrix).invert(),Lt.viewport.set(Bt.x,Bt.y,Bt.width,Bt.height),St===0&&(y.matrix.copy(Lt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),Et===!0&&y.cameras.push(Lt)}}for(let pt=0;pt<v.length;pt++){const Et=x[pt],St=v[pt];Et!==null&&St!==void 0&&St.update(Et,K,h||a)}j&&j(X,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const at=new Ih;at.setAnimationLoop(ot),this.setAnimationLoop=function(X){j=X},this.dispose=function(){}}}function $g(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Ph(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,v,x,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),l(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,M)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,v,x):p.isSpriteMaterial?h(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===en&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===en&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=t.get(p).envMap;if(v&&(m.envMap.value=v,m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*x,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,v,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===en&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const v=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function qg(i,t,e,n){let s={},r={},a=[];const o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(v,x){const M=x.program;n.uniformBlockBinding(v,M)}function h(v,x){let M=s[v.id];M===void 0&&(g(v),M=l(v),s[v.id]=M,v.addEventListener("dispose",m));const R=x.program;n.updateUBOMapping(v,R);const E=t.render.frame;r[v.id]!==E&&(f(v),r[v.id]=E)}function l(v){const x=u();v.__bindingPointIndex=x;const M=i.createBuffer(),R=v.__size,E=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,R,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,M),M}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const x=s[v.id],M=v.uniforms,R=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let E=0,A=M.length;E<A;E++){const U=Array.isArray(M[E])?M[E]:[M[E]];for(let y=0,w=U.length;y<w;y++){const H=U[y];if(d(H,E,y,R)===!0){const G=H.__offset,tt=Array.isArray(H.value)?H.value:[H.value];let I=0;for(let F=0;F<tt.length;F++){const W=tt[F],Y=_(W);typeof W=="number"||typeof W=="boolean"?(H.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,G+I,H.__data)):W.isMatrix3?(H.__data[0]=W.elements[0],H.__data[1]=W.elements[1],H.__data[2]=W.elements[2],H.__data[3]=0,H.__data[4]=W.elements[3],H.__data[5]=W.elements[4],H.__data[6]=W.elements[5],H.__data[7]=0,H.__data[8]=W.elements[6],H.__data[9]=W.elements[7],H.__data[10]=W.elements[8],H.__data[11]=0):(W.toArray(H.__data,I),I+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,H.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(v,x,M,R){const E=v.value,A=x+"_"+M;if(R[A]===void 0)return typeof E=="number"||typeof E=="boolean"?R[A]=E:R[A]=E.clone(),!0;{const U=R[A];if(typeof E=="number"||typeof E=="boolean"){if(U!==E)return R[A]=E,!0}else if(U.equals(E)===!1)return U.copy(E),!0}return!1}function g(v){const x=v.uniforms;let M=0;const R=16;for(let A=0,U=x.length;A<U;A++){const y=Array.isArray(x[A])?x[A]:[x[A]];for(let w=0,H=y.length;w<H;w++){const G=y[w],tt=Array.isArray(G.value)?G.value:[G.value];for(let I=0,F=tt.length;I<F;I++){const W=tt[I],Y=_(W),$=M%R;$!==0&&R-$<Y.boundary&&(M+=R-$),G.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=M,M+=Y.storage}}}const E=M%R;return E>0&&(M+=R-E),v.__size=M,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function m(v){const x=v.target;x.removeEventListener("dispose",m);const M=a.indexOf(x.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(const v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:h,dispose:p}}class Hh{constructor(t={}){const{canvas:e=Vf(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=a;const d=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const p=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ae,this._useLegacyLights=!1,this.toneMapping=pi,this.toneMappingExposure=1;const x=this;let M=!1,R=0,E=0,A=null,U=-1,y=null;const w=new pe,H=new pe;let G=null;const tt=new $t(0);let I=0,F=e.width,W=e.height,Y=1,$=null,q=null;const j=new pe(0,0,F,W),ot=new pe(0,0,F,W);let at=!1;const X=new Da;let K=!1,pt=!1,Et=null;const St=new ae,Ft=new ht,Bt=new C,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Jt(){return A===null?Y:1}let z=n;function Be(b,N){for(let k=0;k<b.length;k++){const V=b[k],B=e.getContext(V,N);if(B!==null)return B}return null}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ta}`),e.addEventListener("webglcontextlost",Q,!1),e.addEventListener("webglcontextrestored",L,!1),e.addEventListener("webglcontextcreationerror",rt,!1),z===null){const N=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&N.shift(),z=Be(N,b),z===null)throw Be(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&z instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),z.getShaderPrecisionFormat===void 0&&(z.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let At,Ut,Mt,ue,Gt,T,S,O,et,Z,nt,yt,dt,xt,Pt,Vt,J,ie,qt,Nt,Tt,mt,P,st;function bt(){At=new i0(z),Ut=new Jm(z,At,t),At.init(Ut),mt=new Gg(z,At,Ut),Mt=new kg(z,At,Ut),ue=new o0(z),Gt=new Tg,T=new Hg(z,At,Mt,Gt,Ut,mt,ue),S=new Qm(x),O=new n0(x),et=new pd(z,Ut),P=new jm(z,At,et,Ut),Z=new s0(z,et,ue,P),nt=new h0(z,Z,et,ue),qt=new l0(z,Ut,T),Vt=new Zm(Gt),yt=new wg(x,S,O,At,Ut,P,Vt),dt=new $g(x,Gt),xt=new Rg,Pt=new Ug(At,Ut),ie=new Ym(x,S,O,Mt,nt,f,c),J=new Bg(x,nt,Ut),st=new qg(z,ue,Ut,Mt),Nt=new Km(z,At,ue,Ut),Tt=new r0(z,At,ue,Ut),ue.programs=yt.programs,x.capabilities=Ut,x.extensions=At,x.properties=Gt,x.renderLists=xt,x.shadowMap=J,x.state=Mt,x.info=ue}bt();const vt=new Xg(x,z);this.xr=vt,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const b=At.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=At.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(b){b!==void 0&&(Y=b,this.setSize(F,W,!1))},this.getSize=function(b){return b.set(F,W)},this.setSize=function(b,N,k=!0){if(vt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=b,W=N,e.width=Math.floor(b*Y),e.height=Math.floor(N*Y),k===!0&&(e.style.width=b+"px",e.style.height=N+"px"),this.setViewport(0,0,b,N)},this.getDrawingBufferSize=function(b){return b.set(F*Y,W*Y).floor()},this.setDrawingBufferSize=function(b,N,k){F=b,W=N,Y=k,e.width=Math.floor(b*k),e.height=Math.floor(N*k),this.setViewport(0,0,b,N)},this.getCurrentViewport=function(b){return b.copy(w)},this.getViewport=function(b){return b.copy(j)},this.setViewport=function(b,N,k,V){b.isVector4?j.set(b.x,b.y,b.z,b.w):j.set(b,N,k,V),Mt.viewport(w.copy(j).multiplyScalar(Y).floor())},this.getScissor=function(b){return b.copy(ot)},this.setScissor=function(b,N,k,V){b.isVector4?ot.set(b.x,b.y,b.z,b.w):ot.set(b,N,k,V),Mt.scissor(H.copy(ot).multiplyScalar(Y).floor())},this.getScissorTest=function(){return at},this.setScissorTest=function(b){Mt.setScissorTest(at=b)},this.setOpaqueSort=function(b){$=b},this.setTransparentSort=function(b){q=b},this.getClearColor=function(b){return b.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor.apply(ie,arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha.apply(ie,arguments)},this.clear=function(b=!0,N=!0,k=!0){let V=0;if(b){let B=!1;if(A!==null){const gt=A.texture.format;B=gt===xh||gt===vh||gt===_h}if(B){const gt=A.texture.type,wt=gt===mi||gt===ui||gt===Ra||gt===Li||gt===mh||gt===gh,It=ie.getClearColor(),Ot=ie.getClearAlpha(),Yt=It.r,Ht=It.g,Wt=It.b;wt?(d[0]=Yt,d[1]=Ht,d[2]=Wt,d[3]=Ot,z.clearBufferuiv(z.COLOR,0,d)):(g[0]=Yt,g[1]=Ht,g[2]=Wt,g[3]=Ot,z.clearBufferiv(z.COLOR,0,g))}else V|=z.COLOR_BUFFER_BIT}N&&(V|=z.DEPTH_BUFFER_BIT),k&&(V|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Q,!1),e.removeEventListener("webglcontextrestored",L,!1),e.removeEventListener("webglcontextcreationerror",rt,!1),xt.dispose(),Pt.dispose(),Gt.dispose(),S.dispose(),O.dispose(),nt.dispose(),P.dispose(),st.dispose(),yt.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",ye),vt.removeEventListener("sessionend",te),Et&&(Et.dispose(),Et=null),we.stop()};function Q(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function L(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const b=ue.autoReset,N=J.enabled,k=J.autoUpdate,V=J.needsUpdate,B=J.type;bt(),ue.autoReset=b,J.enabled=N,J.autoUpdate=k,J.needsUpdate=V,J.type=B}function rt(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function ft(b){const N=b.target;N.removeEventListener("dispose",ft),Dt(N)}function Dt(b){Rt(b),Gt.remove(b)}function Rt(b){const N=Gt.get(b).programs;N!==void 0&&(N.forEach(function(k){yt.releaseProgram(k)}),b.isShaderMaterial&&yt.releaseShaderCache(b))}this.renderBufferDirect=function(b,N,k,V,B,gt){N===null&&(N=Lt);const wt=B.isMesh&&B.matrixWorld.determinant()<0,It=Fu(b,N,k,V,B);Mt.setMaterial(V,wt);let Ot=k.index,Yt=1;if(V.wireframe===!0){if(Ot=Z.getWireframeAttribute(k),Ot===void 0)return;Yt=2}const Ht=k.drawRange,Wt=k.attributes.position;let Se=Ht.start*Yt,sn=(Ht.start+Ht.count)*Yt;gt!==null&&(Se=Math.max(Se,gt.start*Yt),sn=Math.min(sn,(gt.start+gt.count)*Yt)),Ot!==null?(Se=Math.max(Se,0),sn=Math.min(sn,Ot.count)):Wt!=null&&(Se=Math.max(Se,0),sn=Math.min(sn,Wt.count));const Ie=sn-Se;if(Ie<0||Ie===1/0)return;P.setup(B,V,It,k,Ot);let Hn,ge=Nt;if(Ot!==null&&(Hn=et.get(Ot),ge=Tt,ge.setIndex(Hn)),B.isMesh)V.wireframe===!0?(Mt.setLineWidth(V.wireframeLinewidth*Jt()),ge.setMode(z.LINES)):ge.setMode(z.TRIANGLES);else if(B.isLine){let jt=V.linewidth;jt===void 0&&(jt=1),Mt.setLineWidth(jt*Jt()),B.isLineSegments?ge.setMode(z.LINES):B.isLineLoop?ge.setMode(z.LINE_LOOP):ge.setMode(z.LINE_STRIP)}else B.isPoints?ge.setMode(z.POINTS):B.isSprite&&ge.setMode(z.TRIANGLES);if(B.isBatchedMesh)ge.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else if(B.isInstancedMesh)ge.renderInstances(Se,Ie,B.count);else if(k.isInstancedBufferGeometry){const jt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,xo=Math.min(k.instanceCount,jt);ge.renderInstances(Se,Ie,xo)}else ge.render(Se,Ie)};function Zt(b,N,k){b.transparent===!0&&b.side===pn&&b.forceSinglePass===!1?(b.side=en,b.needsUpdate=!0,fr(b,N,k),b.side=_i,b.needsUpdate=!0,fr(b,N,k),b.side=pn):fr(b,N,k)}this.compile=function(b,N,k=null){k===null&&(k=b),m=Pt.get(k),m.init(),v.push(m),k.traverseVisible(function(B){B.isLight&&B.layers.test(N.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),b!==k&&b.traverseVisible(function(B){B.isLight&&B.layers.test(N.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),m.setupLights(x._useLegacyLights);const V=new Set;return b.traverse(function(B){const gt=B.material;if(gt)if(Array.isArray(gt))for(let wt=0;wt<gt.length;wt++){const It=gt[wt];Zt(It,k,B),V.add(It)}else Zt(gt,k,B),V.add(gt)}),v.pop(),m=null,V},this.compileAsync=function(b,N,k=null){const V=this.compile(b,N,k);return new Promise(B=>{function gt(){if(V.forEach(function(wt){Gt.get(wt).currentProgram.isReady()&&V.delete(wt)}),V.size===0){B(b);return}setTimeout(gt,10)}At.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let Qt=null;function _e(b){Qt&&Qt(b)}function ye(){we.stop()}function te(){we.start()}const we=new Ih;we.setAnimationLoop(_e),typeof self<"u"&&we.setContext(self),this.setAnimationLoop=function(b){Qt=b,vt.setAnimationLoop(b),b===null?we.stop():we.start()},vt.addEventListener("sessionstart",ye),vt.addEventListener("sessionend",te),this.render=function(b,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(N),N=vt.getCamera()),b.isScene===!0&&b.onBeforeRender(x,b,N,A),m=Pt.get(b,v.length),m.init(),v.push(m),St.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),X.setFromProjectionMatrix(St),pt=this.localClippingEnabled,K=Vt.init(this.clippingPlanes,pt),_=xt.get(b,p.length),_.init(),p.push(_),Pn(b,N,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort($,q),this.info.render.frame++,K===!0&&Vt.beginShadows();const k=m.state.shadowsArray;if(J.render(k,b,N),K===!0&&Vt.endShadows(),this.info.autoReset===!0&&this.info.reset(),ie.render(_,b),m.setupLights(x._useLegacyLights),N.isArrayCamera){const V=N.cameras;for(let B=0,gt=V.length;B<gt;B++){const wt=V[B];Qa(_,b,wt,wt.viewport)}}else Qa(_,b,N);A!==null&&(T.updateMultisampleRenderTarget(A),T.updateRenderTargetMipmap(A)),b.isScene===!0&&b.onAfterRender(x,b,N),P.resetDefaultState(),U=-1,y=null,v.pop(),v.length>0?m=v[v.length-1]:m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function Pn(b,N,k,V){if(b.visible===!1)return;if(b.layers.test(N.layers)){if(b.isGroup)k=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(N);else if(b.isLight)m.pushLight(b),b.castShadow&&m.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||X.intersectsSprite(b)){V&&Bt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(St);const wt=nt.update(b),It=b.material;It.visible&&_.push(b,wt,It,k,Bt.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||X.intersectsObject(b))){const wt=nt.update(b),It=b.material;if(V&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Bt.copy(b.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),Bt.copy(wt.boundingSphere.center)),Bt.applyMatrix4(b.matrixWorld).applyMatrix4(St)),Array.isArray(It)){const Ot=wt.groups;for(let Yt=0,Ht=Ot.length;Yt<Ht;Yt++){const Wt=Ot[Yt],Se=It[Wt.materialIndex];Se&&Se.visible&&_.push(b,wt,Se,k,Bt.z,Wt)}}else It.visible&&_.push(b,wt,It,k,Bt.z,null)}}const gt=b.children;for(let wt=0,It=gt.length;wt<It;wt++)Pn(gt[wt],N,k,V)}function Qa(b,N,k,V){const B=b.opaque,gt=b.transmissive,wt=b.transparent;m.setupLightsView(k),K===!0&&Vt.setGlobalState(x.clippingPlanes,k),gt.length>0&&zu(B,gt,N,k),V&&Mt.viewport(w.copy(V)),B.length>0&&ur(B,N,k),gt.length>0&&ur(gt,N,k),wt.length>0&&ur(wt,N,k),Mt.buffers.depth.setTest(!0),Mt.buffers.depth.setMask(!0),Mt.buffers.color.setMask(!0),Mt.setPolygonOffset(!1)}function zu(b,N,k,V){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;const gt=Ut.isWebGL2;Et===null&&(Et=new Oi(1,1,{generateMipmaps:!0,type:At.has("EXT_color_buffer_half_float")?tr:mi,minFilter:Qs,samples:gt?4:0})),x.getDrawingBufferSize(Ft),gt?Et.setSize(Ft.x,Ft.y):Et.setSize(Ma(Ft.x),Ma(Ft.y));const wt=x.getRenderTarget();x.setRenderTarget(Et),x.getClearColor(tt),I=x.getClearAlpha(),I<1&&x.setClearColor(16777215,.5),x.clear();const It=x.toneMapping;x.toneMapping=pi,ur(b,k,V),T.updateMultisampleRenderTarget(Et),T.updateRenderTargetMipmap(Et);let Ot=!1;for(let Yt=0,Ht=N.length;Yt<Ht;Yt++){const Wt=N[Yt],Se=Wt.object,sn=Wt.geometry,Ie=Wt.material,Hn=Wt.group;if(Ie.side===pn&&Se.layers.test(V.layers)){const ge=Ie.side;Ie.side=en,Ie.needsUpdate=!0,tc(Se,k,V,sn,Ie,Hn),Ie.side=ge,Ie.needsUpdate=!0,Ot=!0}}Ot===!0&&(T.updateMultisampleRenderTarget(Et),T.updateRenderTargetMipmap(Et)),x.setRenderTarget(wt),x.setClearColor(tt,I),x.toneMapping=It}function ur(b,N,k){const V=N.isScene===!0?N.overrideMaterial:null;for(let B=0,gt=b.length;B<gt;B++){const wt=b[B],It=wt.object,Ot=wt.geometry,Yt=V===null?wt.material:V,Ht=wt.group;It.layers.test(k.layers)&&tc(It,N,k,Ot,Yt,Ht)}}function tc(b,N,k,V,B,gt){b.onBeforeRender(x,N,k,V,B,gt),b.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),B.onBeforeRender(x,N,k,V,b,gt),B.transparent===!0&&B.side===pn&&B.forceSinglePass===!1?(B.side=en,B.needsUpdate=!0,x.renderBufferDirect(k,N,V,B,b,gt),B.side=_i,B.needsUpdate=!0,x.renderBufferDirect(k,N,V,B,b,gt),B.side=pn):x.renderBufferDirect(k,N,V,B,b,gt),b.onAfterRender(x,N,k,V,B,gt)}function fr(b,N,k){N.isScene!==!0&&(N=Lt);const V=Gt.get(b),B=m.state.lights,gt=m.state.shadowsArray,wt=B.state.version,It=yt.getParameters(b,B.state,gt,N,k),Ot=yt.getProgramCacheKey(It);let Yt=V.programs;V.environment=b.isMeshStandardMaterial?N.environment:null,V.fog=N.fog,V.envMap=(b.isMeshStandardMaterial?O:S).get(b.envMap||V.environment),Yt===void 0&&(b.addEventListener("dispose",ft),Yt=new Map,V.programs=Yt);let Ht=Yt.get(Ot);if(Ht!==void 0){if(V.currentProgram===Ht&&V.lightsStateVersion===wt)return nc(b,It),Ht}else It.uniforms=yt.getUniforms(b),b.onBuild(k,It,x),b.onBeforeCompile(It,x),Ht=yt.acquireProgram(It,Ot),Yt.set(Ot,Ht),V.uniforms=It.uniforms;const Wt=V.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Wt.clippingPlanes=Vt.uniform),nc(b,It),V.needsLights=ku(b),V.lightsStateVersion=wt,V.needsLights&&(Wt.ambientLightColor.value=B.state.ambient,Wt.lightProbe.value=B.state.probe,Wt.directionalLights.value=B.state.directional,Wt.directionalLightShadows.value=B.state.directionalShadow,Wt.spotLights.value=B.state.spot,Wt.spotLightShadows.value=B.state.spotShadow,Wt.rectAreaLights.value=B.state.rectArea,Wt.ltc_1.value=B.state.rectAreaLTC1,Wt.ltc_2.value=B.state.rectAreaLTC2,Wt.pointLights.value=B.state.point,Wt.pointLightShadows.value=B.state.pointShadow,Wt.hemisphereLights.value=B.state.hemi,Wt.directionalShadowMap.value=B.state.directionalShadowMap,Wt.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Wt.spotShadowMap.value=B.state.spotShadowMap,Wt.spotLightMatrix.value=B.state.spotLightMatrix,Wt.spotLightMap.value=B.state.spotLightMap,Wt.pointShadowMap.value=B.state.pointShadowMap,Wt.pointShadowMatrix.value=B.state.pointShadowMatrix),V.currentProgram=Ht,V.uniformsList=null,Ht}function ec(b){if(b.uniformsList===null){const N=b.currentProgram.getUniforms();b.uniformsList=Hr.seqWithValue(N.seq,b.uniforms)}return b.uniformsList}function nc(b,N){const k=Gt.get(b);k.outputColorSpace=N.outputColorSpace,k.batching=N.batching,k.instancing=N.instancing,k.instancingColor=N.instancingColor,k.skinning=N.skinning,k.morphTargets=N.morphTargets,k.morphNormals=N.morphNormals,k.morphColors=N.morphColors,k.morphTargetsCount=N.morphTargetsCount,k.numClippingPlanes=N.numClippingPlanes,k.numIntersection=N.numClipIntersection,k.vertexAlphas=N.vertexAlphas,k.vertexTangents=N.vertexTangents,k.toneMapping=N.toneMapping}function Fu(b,N,k,V,B){N.isScene!==!0&&(N=Lt),T.resetTextureUnits();const gt=N.fog,wt=V.isMeshStandardMaterial?N.environment:null,It=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ii,Ot=(V.isMeshStandardMaterial?O:S).get(V.envMap||wt),Yt=V.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Ht=!!k.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Wt=!!k.morphAttributes.position,Se=!!k.morphAttributes.normal,sn=!!k.morphAttributes.color;let Ie=pi;V.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ie=x.toneMapping);const Hn=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ge=Hn!==void 0?Hn.length:0,jt=Gt.get(V),xo=m.state.lights;if(K===!0&&(pt===!0||b!==y)){const fn=b===y&&V.id===U;Vt.setState(V,b,fn)}let ve=!1;V.version===jt.__version?(jt.needsLights&&jt.lightsStateVersion!==xo.state.version||jt.outputColorSpace!==It||B.isBatchedMesh&&jt.batching===!1||!B.isBatchedMesh&&jt.batching===!0||B.isInstancedMesh&&jt.instancing===!1||!B.isInstancedMesh&&jt.instancing===!0||B.isSkinnedMesh&&jt.skinning===!1||!B.isSkinnedMesh&&jt.skinning===!0||B.isInstancedMesh&&jt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&jt.instancingColor===!1&&B.instanceColor!==null||jt.envMap!==Ot||V.fog===!0&&jt.fog!==gt||jt.numClippingPlanes!==void 0&&(jt.numClippingPlanes!==Vt.numPlanes||jt.numIntersection!==Vt.numIntersection)||jt.vertexAlphas!==Yt||jt.vertexTangents!==Ht||jt.morphTargets!==Wt||jt.morphNormals!==Se||jt.morphColors!==sn||jt.toneMapping!==Ie||Ut.isWebGL2===!0&&jt.morphTargetsCount!==ge)&&(ve=!0):(ve=!0,jt.__version=V.version);let xi=jt.currentProgram;ve===!0&&(xi=fr(V,N,B));let ic=!1,zs=!1,Mo=!1;const He=xi.getUniforms(),Mi=jt.uniforms;if(Mt.useProgram(xi.program)&&(ic=!0,zs=!0,Mo=!0),V.id!==U&&(U=V.id,zs=!0),ic||y!==b){He.setValue(z,"projectionMatrix",b.projectionMatrix),He.setValue(z,"viewMatrix",b.matrixWorldInverse);const fn=He.map.cameraPosition;fn!==void 0&&fn.setValue(z,Bt.setFromMatrixPosition(b.matrixWorld)),Ut.logarithmicDepthBuffer&&He.setValue(z,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&He.setValue(z,"isOrthographic",b.isOrthographicCamera===!0),y!==b&&(y=b,zs=!0,Mo=!0)}if(B.isSkinnedMesh){He.setOptional(z,B,"bindMatrix"),He.setOptional(z,B,"bindMatrixInverse");const fn=B.skeleton;fn&&(Ut.floatVertexTextures?(fn.boneTexture===null&&fn.computeBoneTexture(),He.setValue(z,"boneTexture",fn.boneTexture,T)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}B.isBatchedMesh&&(He.setOptional(z,B,"batchingTexture"),He.setValue(z,"batchingTexture",B._matricesTexture,T));const yo=k.morphAttributes;if((yo.position!==void 0||yo.normal!==void 0||yo.color!==void 0&&Ut.isWebGL2===!0)&&qt.update(B,k,xi),(zs||jt.receiveShadow!==B.receiveShadow)&&(jt.receiveShadow=B.receiveShadow,He.setValue(z,"receiveShadow",B.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(Mi.envMap.value=Ot,Mi.flipEnvMap.value=Ot.isCubeTexture&&Ot.isRenderTargetTexture===!1?-1:1),zs&&(He.setValue(z,"toneMappingExposure",x.toneMappingExposure),jt.needsLights&&Bu(Mi,Mo),gt&&V.fog===!0&&dt.refreshFogUniforms(Mi,gt),dt.refreshMaterialUniforms(Mi,V,Y,W,Et),Hr.upload(z,ec(jt),Mi,T)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Hr.upload(z,ec(jt),Mi,T),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&He.setValue(z,"center",B.center),He.setValue(z,"modelViewMatrix",B.modelViewMatrix),He.setValue(z,"normalMatrix",B.normalMatrix),He.setValue(z,"modelMatrix",B.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const fn=V.uniformsGroups;for(let So=0,Hu=fn.length;So<Hu;So++)if(Ut.isWebGL2){const sc=fn[So];st.update(sc,xi),st.bind(sc,xi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return xi}function Bu(b,N){b.ambientLightColor.needsUpdate=N,b.lightProbe.needsUpdate=N,b.directionalLights.needsUpdate=N,b.directionalLightShadows.needsUpdate=N,b.pointLights.needsUpdate=N,b.pointLightShadows.needsUpdate=N,b.spotLights.needsUpdate=N,b.spotLightShadows.needsUpdate=N,b.rectAreaLights.needsUpdate=N,b.hemisphereLights.needsUpdate=N}function ku(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(b,N,k){Gt.get(b.texture).__webglTexture=N,Gt.get(b.depthTexture).__webglTexture=k;const V=Gt.get(b);V.__hasExternalTextures=!0,V.__hasExternalTextures&&(V.__autoAllocateDepthBuffer=k===void 0,V.__autoAllocateDepthBuffer||At.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,N){const k=Gt.get(b);k.__webglFramebuffer=N,k.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(b,N=0,k=0){A=b,R=N,E=k;let V=!0,B=null,gt=!1,wt=!1;if(b){const Ot=Gt.get(b);Ot.__useDefaultFramebuffer!==void 0?(Mt.bindFramebuffer(z.FRAMEBUFFER,null),V=!1):Ot.__webglFramebuffer===void 0?T.setupRenderTarget(b):Ot.__hasExternalTextures&&T.rebindTextures(b,Gt.get(b.texture).__webglTexture,Gt.get(b.depthTexture).__webglTexture);const Yt=b.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(wt=!0);const Ht=Gt.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ht[N])?B=Ht[N][k]:B=Ht[N],gt=!0):Ut.isWebGL2&&b.samples>0&&T.useMultisampledRTT(b)===!1?B=Gt.get(b).__webglMultisampledFramebuffer:Array.isArray(Ht)?B=Ht[k]:B=Ht,w.copy(b.viewport),H.copy(b.scissor),G=b.scissorTest}else w.copy(j).multiplyScalar(Y).floor(),H.copy(ot).multiplyScalar(Y).floor(),G=at;if(Mt.bindFramebuffer(z.FRAMEBUFFER,B)&&Ut.drawBuffers&&V&&Mt.drawBuffers(b,B),Mt.viewport(w),Mt.scissor(H),Mt.setScissorTest(G),gt){const Ot=Gt.get(b.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+N,Ot.__webglTexture,k)}else if(wt){const Ot=Gt.get(b.texture),Yt=N||0;z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,Ot.__webglTexture,k||0,Yt)}U=-1},this.readRenderTargetPixels=function(b,N,k,V,B,gt,wt){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=Gt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&wt!==void 0&&(It=It[wt]),It){Mt.bindFramebuffer(z.FRAMEBUFFER,It);try{const Ot=b.texture,Yt=Ot.format,Ht=Ot.type;if(Yt!==mn&&mt.convert(Yt)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Wt=Ht===tr&&(At.has("EXT_color_buffer_half_float")||Ut.isWebGL2&&At.has("EXT_color_buffer_float"));if(Ht!==mi&&mt.convert(Ht)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ht===fi&&(Ut.isWebGL2||At.has("OES_texture_float")||At.has("WEBGL_color_buffer_float")))&&!Wt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=b.width-V&&k>=0&&k<=b.height-B&&z.readPixels(N,k,V,B,mt.convert(Yt),mt.convert(Ht),gt)}finally{const Ot=A!==null?Gt.get(A).__webglFramebuffer:null;Mt.bindFramebuffer(z.FRAMEBUFFER,Ot)}}},this.copyFramebufferToTexture=function(b,N,k=0){const V=Math.pow(2,-k),B=Math.floor(N.image.width*V),gt=Math.floor(N.image.height*V);T.setTexture2D(N,0),z.copyTexSubImage2D(z.TEXTURE_2D,k,0,0,b.x,b.y,B,gt),Mt.unbindTexture()},this.copyTextureToTexture=function(b,N,k,V=0){const B=N.image.width,gt=N.image.height,wt=mt.convert(k.format),It=mt.convert(k.type);T.setTexture2D(k,0),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,k.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,k.unpackAlignment),N.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,V,b.x,b.y,B,gt,wt,It,N.image.data):N.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,V,b.x,b.y,N.mipmaps[0].width,N.mipmaps[0].height,wt,N.mipmaps[0].data):z.texSubImage2D(z.TEXTURE_2D,V,b.x,b.y,wt,It,N.image),V===0&&k.generateMipmaps&&z.generateMipmap(z.TEXTURE_2D),Mt.unbindTexture()},this.copyTextureToTexture3D=function(b,N,k,V,B=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const gt=b.max.x-b.min.x+1,wt=b.max.y-b.min.y+1,It=b.max.z-b.min.z+1,Ot=mt.convert(V.format),Yt=mt.convert(V.type);let Ht;if(V.isData3DTexture)T.setTexture3D(V,0),Ht=z.TEXTURE_3D;else if(V.isDataArrayTexture||V.isCompressedArrayTexture)T.setTexture2DArray(V,0),Ht=z.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,V.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,V.unpackAlignment);const Wt=z.getParameter(z.UNPACK_ROW_LENGTH),Se=z.getParameter(z.UNPACK_IMAGE_HEIGHT),sn=z.getParameter(z.UNPACK_SKIP_PIXELS),Ie=z.getParameter(z.UNPACK_SKIP_ROWS),Hn=z.getParameter(z.UNPACK_SKIP_IMAGES),ge=k.isCompressedTexture?k.mipmaps[B]:k.image;z.pixelStorei(z.UNPACK_ROW_LENGTH,ge.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,ge.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,b.min.x),z.pixelStorei(z.UNPACK_SKIP_ROWS,b.min.y),z.pixelStorei(z.UNPACK_SKIP_IMAGES,b.min.z),k.isDataTexture||k.isData3DTexture?z.texSubImage3D(Ht,B,N.x,N.y,N.z,gt,wt,It,Ot,Yt,ge.data):k.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),z.compressedTexSubImage3D(Ht,B,N.x,N.y,N.z,gt,wt,It,Ot,ge.data)):z.texSubImage3D(Ht,B,N.x,N.y,N.z,gt,wt,It,Ot,Yt,ge),z.pixelStorei(z.UNPACK_ROW_LENGTH,Wt),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,Se),z.pixelStorei(z.UNPACK_SKIP_PIXELS,sn),z.pixelStorei(z.UNPACK_SKIP_ROWS,Ie),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Hn),B===0&&V.generateMipmaps&&z.generateMipmap(Ht),Mt.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?T.setTextureCube(b,0):b.isData3DTexture?T.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?T.setTexture2DArray(b,0):T.setTexture2D(b,0),Mt.unbindTexture()},this.resetState=function(){R=0,E=0,A=null,Mt.reset(),P.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Pa?"display-p3":"srgb",e.unpackColorSpace=le.workingColorSpace===so?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ae?Ii:yh}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Ii?Ae:ii}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Yg extends Hh{}Yg.prototype.isWebGL1Renderer=!0;class Ua{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new $t(t),this.near=e,this.far=n}clone(){return new Ua(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class jg extends Oe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Kg extends Je{constructor(t=null,e=1,n=1,s,r,a,o,c,h=ke,l=ke,u,f){super(null,a,o,c,h,l,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class wl extends hn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const cs=new ae,Tl=new ae,Nr=[],Al=new ki,Jg=new ae,Vs=new kt,Ws=new Ls;class Ks extends kt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new wl(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Jg)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ki),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,cs),Al.copy(t.boundingBox).applyMatrix4(cs),this.boundingBox.union(Al)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ls),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,cs),Ws.copy(t.boundingSphere).applyMatrix4(cs),this.boundingSphere.union(Ws)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Vs.geometry=this.geometry,Vs.material=this.material,Vs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ws.copy(this.boundingSphere),Ws.applyMatrix4(n),t.ray.intersectsSphere(Ws)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,cs),Tl.multiplyMatrices(n,cs),Vs.matrixWorld=Tl,Vs.raycast(t,Nr);for(let a=0,o=Nr.length;a<o;a++){const c=Nr[a];c.instanceId=r,c.object=this,e.push(c)}Nr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new wl(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Na extends Hi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new $t(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Rl=new C,Cl=new C,Pl=new ae,Qo=new ro,Or=new Ls;class Gh extends Oe{constructor(t=new Ee,e=new Na){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Rl.fromBufferAttribute(e,s-1),Cl.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Rl.distanceTo(Cl);t.setAttribute("lineDistance",new ne(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(s),Or.radius+=r,t.ray.intersectsSphere(Or)===!1)return;Pl.copy(s).invert(),Qo.copy(t.ray).applyMatrix4(Pl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=new C,l=new C,u=new C,f=new C,d=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){const p=Math.max(0,a.start),v=Math.min(g.count,a.start+a.count);for(let x=p,M=v-1;x<M;x+=d){const R=g.getX(x),E=g.getX(x+1);if(h.fromBufferAttribute(m,R),l.fromBufferAttribute(m,E),Qo.distanceSqToSegment(h,l,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const U=t.ray.origin.distanceTo(f);U<t.near||U>t.far||e.push({distance:U,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,a.start),v=Math.min(m.count,a.start+a.count);for(let x=p,M=v-1;x<M;x+=d){if(h.fromBufferAttribute(m,x),l.fromBufferAttribute(m,x+1),Qo.distanceSqToSegment(h,l,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const E=t.ray.origin.distanceTo(f);E<t.near||E>t.far||e.push({distance:E,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}const Ll=new C,Dl=new C;class Zg extends Gh{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Ll.fromBufferAttribute(e,s),Dl.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ll.distanceTo(Dl);t.setAttribute("lineDistance",new ne(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Oa extends Je{constructor(t,e,n,s,r,a,o,c,h){super(t,e,n,s,r,a,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Bn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=n[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const l=n[s],f=n[s+1]-l,d=(a-l)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new ht:new C);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,s=[],r=[],a=[],o=new C,c=new ae;for(let d=0;d<=t;d++){const g=d/t;s[d]=this.getTangentAt(g,new C)}r[0]=new C,a[0]=new C;let h=Number.MAX_VALUE;const l=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);l<=h&&(h=l,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),f<=h&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Ne(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(o,g))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Ne(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],d*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class za extends Bn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e){const n=e||new ht,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const l=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=h-this.aY;c=f*l-d*u+this.aX,h=f*u+d*l+this.aY}return n.set(c,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Qg extends za{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Fa(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,l,u){let f=(a-r)/h-(o-r)/(h+l)+(o-a)/l,d=(o-a)/l-(c-a)/(l+u)+(c-o)/u;f*=l,d*=l,s(a,o,f,d)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const zr=new C,ta=new Fa,ea=new Fa,na=new Fa;class Ba extends Bn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,l;this.closed||o>0?h=s[(o-1)%r]:(zr.subVectors(s[0],s[1]).add(s[0]),h=zr);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?l=s[(o+2)%r]:(zr.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=zr),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(h.distanceToSquared(u),d),_=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(l),d);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),ta.initNonuniformCatmullRom(h.x,u.x,f.x,l.x,g,_,m),ea.initNonuniformCatmullRom(h.y,u.y,f.y,l.y,g,_,m),na.initNonuniformCatmullRom(h.z,u.z,f.z,l.z,g,_,m)}else this.curveType==="catmullrom"&&(ta.initCatmullRom(h.x,u.x,f.x,l.x,this.tension),ea.initCatmullRom(h.y,u.y,f.y,l.y,this.tension),na.initCatmullRom(h.z,u.z,f.z,l.z,this.tension));return n.set(ta.calc(c),ea.calc(c),na.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Il(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,c=i*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*i+e}function t_(i,t){const e=1-i;return e*e*t}function e_(i,t){return 2*(1-i)*i*t}function n_(i,t){return i*i*t}function Js(i,t,e,n){return t_(i,t)+e_(i,e)+n_(i,n)}function i_(i,t){const e=1-i;return e*e*e*t}function s_(i,t){const e=1-i;return 3*e*e*i*t}function r_(i,t){return 3*(1-i)*i*i*t}function o_(i,t){return i*i*i*t}function Zs(i,t,e,n,s){return i_(i,t)+s_(i,e)+r_(i,n)+o_(i,s)}class Vh extends Bn{constructor(t=new ht,e=new ht,n=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Zs(t,s.x,r.x,a.x,o.x),Zs(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class a_ extends Bn{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Zs(t,s.x,r.x,a.x,o.x),Zs(t,s.y,r.y,a.y,o.y),Zs(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Wh extends Bn{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class c_ extends Bn{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Xh extends Bn{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Js(t,s.x,r.x,a.x),Js(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class l_ extends Bn{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Js(t,s.x,r.x,a.x),Js(t,s.y,r.y,a.y),Js(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class $h extends Bn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],h=s[a],l=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Il(o,c.x,h.x,l.x,u.x),Il(o,c.y,h.y,l.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ht().fromArray(s))}return this}}var Ul=Object.freeze({__proto__:null,ArcCurve:Qg,CatmullRomCurve3:Ba,CubicBezierCurve:Vh,CubicBezierCurve3:a_,EllipseCurve:za,LineCurve:Wh,LineCurve3:c_,QuadraticBezierCurve:Xh,QuadraticBezierCurve3:l_,SplineCurve:$h});class h_ extends Bn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ul[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),h=c===0?0:1-a/c;return o.getPointAt(h,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let h=0;h<c.length;h++){const l=c[h];n&&n.equals(l)||(e.push(l),n=l)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Ul[s.type]().fromJSON(s))}return this}}class u_ extends h_{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Wh(this.currentPoint.clone(),new ht(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Xh(this.currentPoint.clone(),new ht(t,e),new ht(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Vh(this.currentPoint.clone(),new ht(t,e),new ht(n,s),new ht(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new $h(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,c){const h=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(t+h,e+l,n,s,r,a,o,c),this}absellipse(t,e,n,s,r,a,o,c){const h=new za(t,e,n,s,r,a,o,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const l=h.getPoint(1);return this.currentPoint.copy(l),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ka extends Ee{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Ne(s,0,Math.PI*2);const r=[],a=[],o=[],c=[],h=[],l=1/e,u=new C,f=new ht,d=new C,g=new C,_=new C;let m=0,p=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:m=t[v+1].x-t[v].x,p=t[v+1].y-t[v].y,d.x=p*1,d.y=-m,d.z=p*0,_.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case t.length-1:c.push(_.x,_.y,_.z);break;default:m=t[v+1].x-t[v].x,p=t[v+1].y-t[v].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=_.x,d.y+=_.y,d.z+=_.z,d.normalize(),c.push(d.x,d.y,d.z),_.copy(g)}for(let v=0;v<=e;v++){const x=n+v*l*s,M=Math.sin(x),R=Math.cos(x);for(let E=0;E<=t.length-1;E++){u.x=t[E].x*M,u.y=t[E].y,u.z=t[E].x*R,a.push(u.x,u.y,u.z),f.x=v/e,f.y=E/(t.length-1),o.push(f.x,f.y);const A=c[3*E+0]*M,U=c[3*E+1],y=c[3*E+0]*R;h.push(A,U,y)}}for(let v=0;v<e;v++)for(let x=0;x<t.length-1;x++){const M=x+v*t.length,R=M,E=M+t.length,A=M+t.length+1,U=M+1;r.push(R,E,U),r.push(A,U,E)}this.setIndex(r),this.setAttribute("position",new ne(a,3)),this.setAttribute("uv",new ne(o,2)),this.setAttribute("normal",new ne(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ka(t.points,t.segments,t.phiStart,t.phiLength)}}class Ha extends ka{constructor(t=1,e=1,n=4,s=8){const r=new u_;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new Ha(t.radius,t.length,t.capSegments,t.radialSegments)}}class er extends Ee{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],h=new C,l=new ht;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const d=n+u/e*s;h.x=t*Math.cos(d),h.y=t*Math.sin(d),a.push(h.x,h.y,h.z),o.push(0,0,1),l.x=(a[f]/t+1)/2,l.y=(a[f+1]/t+1)/2,c.push(l.x,l.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ne(a,3)),this.setAttribute("normal",new ne(o,3)),this.setAttribute("uv",new ne(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new er(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class nn extends Ee{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const l=[],u=[],f=[],d=[];let g=0;const _=[],m=n/2;let p=0;v(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(l),this.setAttribute("position",new ne(u,3)),this.setAttribute("normal",new ne(f,3)),this.setAttribute("uv",new ne(d,2));function v(){const M=new C,R=new C;let E=0;const A=(e-t)/n;for(let U=0;U<=r;U++){const y=[],w=U/r,H=w*(e-t)+t;for(let G=0;G<=s;G++){const tt=G/s,I=tt*c+o,F=Math.sin(I),W=Math.cos(I);R.x=H*F,R.y=-w*n+m,R.z=H*W,u.push(R.x,R.y,R.z),M.set(F,A,W).normalize(),f.push(M.x,M.y,M.z),d.push(tt,1-w),y.push(g++)}_.push(y)}for(let U=0;U<s;U++)for(let y=0;y<r;y++){const w=_[y][U],H=_[y+1][U],G=_[y+1][U+1],tt=_[y][U+1];l.push(w,H,tt),l.push(H,G,tt),E+=6}h.addGroup(p,E,0),p+=E}function x(M){const R=g,E=new ht,A=new C;let U=0;const y=M===!0?t:e,w=M===!0?1:-1;for(let G=1;G<=s;G++)u.push(0,m*w,0),f.push(0,w,0),d.push(.5,.5),g++;const H=g;for(let G=0;G<=s;G++){const I=G/s*c+o,F=Math.cos(I),W=Math.sin(I);A.x=y*W,A.y=m*w,A.z=y*F,u.push(A.x,A.y,A.z),f.push(0,w,0),E.x=F*.5+.5,E.y=W*.5*w+.5,d.push(E.x,E.y),g++}for(let G=0;G<s;G++){const tt=R+G,I=H+G;M===!0?l.push(I,I+1,tt):l.push(I+1,I,tt),U+=3}h.addGroup(p,U,M===!0?1:2),p+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class zn extends nn{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new zn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class rr extends Ee{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),h(n),l(),this.setAttribute("position",new ne(r,3)),this.setAttribute("normal",new ne(r.slice(),3)),this.setAttribute("uv",new ne(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const x=new C,M=new C,R=new C;for(let E=0;E<e.length;E+=3)d(e[E+0],x),d(e[E+1],M),d(e[E+2],R),c(x,M,R,v)}function c(v,x,M,R){const E=R+1,A=[];for(let U=0;U<=E;U++){A[U]=[];const y=v.clone().lerp(M,U/E),w=x.clone().lerp(M,U/E),H=E-U;for(let G=0;G<=H;G++)G===0&&U===E?A[U][G]=y:A[U][G]=y.clone().lerp(w,G/H)}for(let U=0;U<E;U++)for(let y=0;y<2*(E-U)-1;y++){const w=Math.floor(y/2);y%2===0?(f(A[U][w+1]),f(A[U+1][w]),f(A[U][w])):(f(A[U][w+1]),f(A[U+1][w+1]),f(A[U+1][w]))}}function h(v){const x=new C;for(let M=0;M<r.length;M+=3)x.x=r[M+0],x.y=r[M+1],x.z=r[M+2],x.normalize().multiplyScalar(v),r[M+0]=x.x,r[M+1]=x.y,r[M+2]=x.z}function l(){const v=new C;for(let x=0;x<r.length;x+=3){v.x=r[x+0],v.y=r[x+1],v.z=r[x+2];const M=m(v)/2/Math.PI+.5,R=p(v)/Math.PI+.5;a.push(M,1-R)}g(),u()}function u(){for(let v=0;v<a.length;v+=6){const x=a[v+0],M=a[v+2],R=a[v+4],E=Math.max(x,M,R),A=Math.min(x,M,R);E>.9&&A<.1&&(x<.2&&(a[v+0]+=1),M<.2&&(a[v+2]+=1),R<.2&&(a[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function d(v,x){const M=v*3;x.x=t[M+0],x.y=t[M+1],x.z=t[M+2]}function g(){const v=new C,x=new C,M=new C,R=new C,E=new ht,A=new ht,U=new ht;for(let y=0,w=0;y<r.length;y+=9,w+=6){v.set(r[y+0],r[y+1],r[y+2]),x.set(r[y+3],r[y+4],r[y+5]),M.set(r[y+6],r[y+7],r[y+8]),E.set(a[w+0],a[w+1]),A.set(a[w+2],a[w+3]),U.set(a[w+4],a[w+5]),R.copy(v).add(x).add(M).divideScalar(3);const H=m(R);_(E,w+0,v,H),_(A,w+2,x,H),_(U,w+4,M,H)}}function _(v,x,M,R){R<0&&v.x===1&&(a[x]=v.x-1),M.x===0&&M.z===0&&(a[x]=R/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rr(t.vertices,t.indices,t.radius,t.details)}}class Jr extends rr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Jr(t.radius,t.detail)}}class Fn extends rr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Fn(t.radius,t.detail)}}class ao extends rr{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ao(t.radius,t.detail)}}class Gi extends Ee{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],h=[],l=[];let u=t;const f=(e-t)/s,d=new C,g=new ht;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const p=r+m/n*a;d.x=u*Math.cos(p),d.y=u*Math.sin(p),c.push(d.x,d.y,d.z),h.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,l.push(g.x,g.y)}u+=f}for(let _=0;_<s;_++){const m=_*(n+1);for(let p=0;p<n;p++){const v=p+m,x=v,M=v+n+1,R=v+n+2,E=v+1;o.push(x,M,E),o.push(M,R,E)}}this.setIndex(o),this.setAttribute("position",new ne(c,3)),this.setAttribute("normal",new ne(h,3)),this.setAttribute("uv",new ne(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ln extends Ee{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let h=0;const l=[],u=new C,f=new C,d=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const v=[],x=p/n;let M=0;p===0&&a===0?M=.5/e:p===n&&c===Math.PI&&(M=-.5/e);for(let R=0;R<=e;R++){const E=R/e;u.x=-t*Math.cos(s+E*r)*Math.sin(a+x*o),u.y=t*Math.cos(a+x*o),u.z=t*Math.sin(s+E*r)*Math.sin(a+x*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(E+M,1-x),v.push(h++)}l.push(v)}for(let p=0;p<n;p++)for(let v=0;v<e;v++){const x=l[p][v+1],M=l[p][v],R=l[p+1][v],E=l[p+1][v+1];(p!==0||a>0)&&d.push(x,M,E),(p!==n-1||c<Math.PI)&&d.push(M,R,E)}this.setIndex(d),this.setAttribute("position",new ne(g,3)),this.setAttribute("normal",new ne(_,3)),this.setAttribute("uv",new ne(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ln(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Sn extends Ee{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],h=[],l=new C,u=new C,f=new C;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const _=g/s*r,m=d/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),l.x=t*Math.cos(_),l.y=t*Math.sin(_),f.subVectors(u,l).normalize(),c.push(f.x,f.y,f.z),h.push(g/s),h.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const _=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,p=(s+1)*(d-1)+g,v=(s+1)*d+g;a.push(_,m,v),a.push(m,p,v)}this.setIndex(a),this.setAttribute("position",new ne(o,3)),this.setAttribute("normal",new ne(c,3)),this.setAttribute("uv",new ne(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Sn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Tn extends Hi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new $t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ca,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class f_ extends Hi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ca,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Aa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ga extends Oe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new $t(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class d_ extends Ga{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Oe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $t(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ia=new ae,Nl=new C,Ol=new C;class qh{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Da,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Nl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Nl),Ol.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ol),e.updateMatrixWorld(),ia.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ia),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ia)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const zl=new ae,Xs=new C,sa=new C;class p_ extends qh{constructor(){super(new cn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ht(4,2),this._viewportCount=6,this._viewports=[new pe(2,1,1,1),new pe(0,1,1,1),new pe(3,1,1,1),new pe(1,1,1,1),new pe(3,0,1,1),new pe(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Xs.setFromMatrixPosition(t.matrixWorld),n.position.copy(Xs),sa.copy(n.position),sa.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(sa),n.updateMatrixWorld(),s.makeTranslation(-Xs.x,-Xs.y,-Xs.z),zl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zl)}}class m_ extends Ga{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new p_}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class g_ extends qh{constructor(){super(new Uh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Yh extends Ga{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Oe.DEFAULT_UP),this.updateMatrix(),this.target=new Oe,this.shadow=new g_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class __{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Fl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Fl();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Fl(){return(typeof performance>"u"?Date:performance).now()}class v_{constructor(t,e,n=0,s=1/0){this.ray=new ro(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new La,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Sa(t,this,n,e),n.sort(Bl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Sa(t[s],this,n,e);return n.sort(Bl),n}}function Bl(i,t){return i.distance-t.distance}function Sa(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,a=s.length;r<a;r++)Sa(s[r],t,e,!0)}}class kl{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ne(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ta}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ta);const Hl={type:"change"},ra={type:"start"},Gl={type:"end"},Fr=new ro,Vl=new hi,x_=Math.cos(70*Gf.DEG2RAD);class M_ extends Bi{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:jn.ROTATE,MIDDLE:jn.DOLLY,RIGHT:jn.PAN},this.touches={ONE:Xi.ROTATE,TWO:Xi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(P){P.addEventListener("keydown",Pt),this._domElementKeyEvents=P},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Pt),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Hl),n.update(),r=s.NONE},this.update=function(){const P=new C,st=new Nn().setFromUnitVectors(t.up,new C(0,1,0)),bt=st.clone().invert(),vt=new C,Q=new Nn,L=new C,rt=2*Math.PI;return function(Dt=null){const Rt=n.object.position;P.copy(Rt).sub(n.target),P.applyQuaternion(st),o.setFromVector3(P),n.autoRotate&&r===s.NONE&&G(w(Dt)),n.enableDamping?(o.theta+=c.theta*n.dampingFactor,o.phi+=c.phi*n.dampingFactor):(o.theta+=c.theta,o.phi+=c.phi);let Zt=n.minAzimuthAngle,Qt=n.maxAzimuthAngle;isFinite(Zt)&&isFinite(Qt)&&(Zt<-Math.PI?Zt+=rt:Zt>Math.PI&&(Zt-=rt),Qt<-Math.PI?Qt+=rt:Qt>Math.PI&&(Qt-=rt),Zt<=Qt?o.theta=Math.max(Zt,Math.min(Qt,o.theta)):o.theta=o.theta>(Zt+Qt)/2?Math.max(Zt,o.theta):Math.min(Qt,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(l,n.dampingFactor):n.target.add(l),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&E||n.object.isOrthographicCamera?o.radius=j(o.radius):o.radius=j(o.radius*h),P.setFromSpherical(o),P.applyQuaternion(bt),Rt.copy(n.target).add(P),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,l.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),l.set(0,0,0));let _e=!1;if(n.zoomToCursor&&E){let ye=null;if(n.object.isPerspectiveCamera){const te=P.length();ye=j(te*h);const we=te-ye;n.object.position.addScaledVector(M,we),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const te=new C(R.x,R.y,0);te.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),_e=!0;const we=new C(R.x,R.y,0);we.unproject(n.object),n.object.position.sub(we).add(te),n.object.updateMatrixWorld(),ye=P.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ye!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ye).add(n.object.position):(Fr.origin.copy(n.object.position),Fr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Fr.direction))<x_?t.lookAt(n.target):(Vl.setFromNormalAndCoplanarPoint(n.object.up,n.target),Fr.intersectPlane(Vl,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),_e=!0);return h=1,E=!1,_e||vt.distanceToSquared(n.object.position)>a||8*(1-Q.dot(n.object.quaternion))>a||L.distanceToSquared(n.target)>0?(n.dispatchEvent(Hl),vt.copy(n.object.position),Q.copy(n.object.quaternion),L.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",ie),n.domElement.removeEventListener("pointerdown",T),n.domElement.removeEventListener("pointercancel",O),n.domElement.removeEventListener("wheel",nt),n.domElement.removeEventListener("pointermove",S),n.domElement.removeEventListener("pointerup",O),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Pt),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const a=1e-6,o=new kl,c=new kl;let h=1;const l=new C,u=new ht,f=new ht,d=new ht,g=new ht,_=new ht,m=new ht,p=new ht,v=new ht,x=new ht,M=new C,R=new ht;let E=!1;const A=[],U={};let y=!1;function w(P){return P!==null?2*Math.PI/60*n.autoRotateSpeed*P:2*Math.PI/60/60*n.autoRotateSpeed}function H(P){const st=Math.abs(P*.01);return Math.pow(.95,n.zoomSpeed*st)}function G(P){c.theta-=P}function tt(P){c.phi-=P}const I=function(){const P=new C;return function(bt,vt){P.setFromMatrixColumn(vt,0),P.multiplyScalar(-bt),l.add(P)}}(),F=function(){const P=new C;return function(bt,vt){n.screenSpacePanning===!0?P.setFromMatrixColumn(vt,1):(P.setFromMatrixColumn(vt,0),P.crossVectors(n.object.up,P)),P.multiplyScalar(bt),l.add(P)}}(),W=function(){const P=new C;return function(bt,vt){const Q=n.domElement;if(n.object.isPerspectiveCamera){const L=n.object.position;P.copy(L).sub(n.target);let rt=P.length();rt*=Math.tan(n.object.fov/2*Math.PI/180),I(2*bt*rt/Q.clientHeight,n.object.matrix),F(2*vt*rt/Q.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(I(bt*(n.object.right-n.object.left)/n.object.zoom/Q.clientWidth,n.object.matrix),F(vt*(n.object.top-n.object.bottom)/n.object.zoom/Q.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function Y(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h/=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function $(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h*=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function q(P,st){if(!n.zoomToCursor)return;E=!0;const bt=n.domElement.getBoundingClientRect(),vt=P-bt.left,Q=st-bt.top,L=bt.width,rt=bt.height;R.x=vt/L*2-1,R.y=-(Q/rt)*2+1,M.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function j(P){return Math.max(n.minDistance,Math.min(n.maxDistance,P))}function ot(P){u.set(P.clientX,P.clientY)}function at(P){q(P.clientX,P.clientX),p.set(P.clientX,P.clientY)}function X(P){g.set(P.clientX,P.clientY)}function K(P){f.set(P.clientX,P.clientY),d.subVectors(f,u).multiplyScalar(n.rotateSpeed);const st=n.domElement;G(2*Math.PI*d.x/st.clientHeight),tt(2*Math.PI*d.y/st.clientHeight),u.copy(f),n.update()}function pt(P){v.set(P.clientX,P.clientY),x.subVectors(v,p),x.y>0?Y(H(x.y)):x.y<0&&$(H(x.y)),p.copy(v),n.update()}function Et(P){_.set(P.clientX,P.clientY),m.subVectors(_,g).multiplyScalar(n.panSpeed),W(m.x,m.y),g.copy(_),n.update()}function St(P){q(P.clientX,P.clientY),P.deltaY<0?$(H(P.deltaY)):P.deltaY>0&&Y(H(P.deltaY)),n.update()}function Ft(P){let st=!1;switch(P.code){case n.keys.UP:P.ctrlKey||P.metaKey||P.shiftKey?tt(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,n.keyPanSpeed),st=!0;break;case n.keys.BOTTOM:P.ctrlKey||P.metaKey||P.shiftKey?tt(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,-n.keyPanSpeed),st=!0;break;case n.keys.LEFT:P.ctrlKey||P.metaKey||P.shiftKey?G(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(n.keyPanSpeed,0),st=!0;break;case n.keys.RIGHT:P.ctrlKey||P.metaKey||P.shiftKey?G(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(-n.keyPanSpeed,0),st=!0;break}st&&(P.preventDefault(),n.update())}function Bt(P){if(A.length===1)u.set(P.pageX,P.pageY);else{const st=mt(P),bt=.5*(P.pageX+st.x),vt=.5*(P.pageY+st.y);u.set(bt,vt)}}function Lt(P){if(A.length===1)g.set(P.pageX,P.pageY);else{const st=mt(P),bt=.5*(P.pageX+st.x),vt=.5*(P.pageY+st.y);g.set(bt,vt)}}function Jt(P){const st=mt(P),bt=P.pageX-st.x,vt=P.pageY-st.y,Q=Math.sqrt(bt*bt+vt*vt);p.set(0,Q)}function z(P){n.enableZoom&&Jt(P),n.enablePan&&Lt(P)}function Be(P){n.enableZoom&&Jt(P),n.enableRotate&&Bt(P)}function At(P){if(A.length==1)f.set(P.pageX,P.pageY);else{const bt=mt(P),vt=.5*(P.pageX+bt.x),Q=.5*(P.pageY+bt.y);f.set(vt,Q)}d.subVectors(f,u).multiplyScalar(n.rotateSpeed);const st=n.domElement;G(2*Math.PI*d.x/st.clientHeight),tt(2*Math.PI*d.y/st.clientHeight),u.copy(f)}function Ut(P){if(A.length===1)_.set(P.pageX,P.pageY);else{const st=mt(P),bt=.5*(P.pageX+st.x),vt=.5*(P.pageY+st.y);_.set(bt,vt)}m.subVectors(_,g).multiplyScalar(n.panSpeed),W(m.x,m.y),g.copy(_)}function Mt(P){const st=mt(P),bt=P.pageX-st.x,vt=P.pageY-st.y,Q=Math.sqrt(bt*bt+vt*vt);v.set(0,Q),x.set(0,Math.pow(v.y/p.y,n.zoomSpeed)),Y(x.y),p.copy(v);const L=(P.pageX+st.x)*.5,rt=(P.pageY+st.y)*.5;q(L,rt)}function ue(P){n.enableZoom&&Mt(P),n.enablePan&&Ut(P)}function Gt(P){n.enableZoom&&Mt(P),n.enableRotate&&At(P)}function T(P){n.enabled!==!1&&(A.length===0&&(n.domElement.setPointerCapture(P.pointerId),n.domElement.addEventListener("pointermove",S),n.domElement.addEventListener("pointerup",O)),qt(P),P.pointerType==="touch"?Vt(P):et(P))}function S(P){n.enabled!==!1&&(P.pointerType==="touch"?J(P):Z(P))}function O(P){Nt(P),A.length===0&&(n.domElement.releasePointerCapture(P.pointerId),n.domElement.removeEventListener("pointermove",S),n.domElement.removeEventListener("pointerup",O)),n.dispatchEvent(Gl),r=s.NONE}function et(P){let st;switch(P.button){case 0:st=n.mouseButtons.LEFT;break;case 1:st=n.mouseButtons.MIDDLE;break;case 2:st=n.mouseButtons.RIGHT;break;default:st=-1}switch(st){case jn.DOLLY:if(n.enableZoom===!1)return;at(P),r=s.DOLLY;break;case jn.ROTATE:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enablePan===!1)return;X(P),r=s.PAN}else{if(n.enableRotate===!1)return;ot(P),r=s.ROTATE}break;case jn.PAN:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enableRotate===!1)return;ot(P),r=s.ROTATE}else{if(n.enablePan===!1)return;X(P),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(ra)}function Z(P){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;K(P);break;case s.DOLLY:if(n.enableZoom===!1)return;pt(P);break;case s.PAN:if(n.enablePan===!1)return;Et(P);break}}function nt(P){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(P.preventDefault(),n.dispatchEvent(ra),St(yt(P)),n.dispatchEvent(Gl))}function yt(P){const st=P.deltaMode,bt={clientX:P.clientX,clientY:P.clientY,deltaY:P.deltaY};switch(st){case 1:bt.deltaY*=16;break;case 2:bt.deltaY*=100;break}return P.ctrlKey&&!y&&(bt.deltaY*=10),bt}function dt(P){P.key==="Control"&&(y=!0,document.addEventListener("keyup",xt,{passive:!0,capture:!0}))}function xt(P){P.key==="Control"&&(y=!1,document.removeEventListener("keyup",xt,{passive:!0,capture:!0}))}function Pt(P){n.enabled===!1||n.enablePan===!1||Ft(P)}function Vt(P){switch(Tt(P),A.length){case 1:switch(n.touches.ONE){case Xi.ROTATE:if(n.enableRotate===!1)return;Bt(P),r=s.TOUCH_ROTATE;break;case Xi.PAN:if(n.enablePan===!1)return;Lt(P),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Xi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;z(P),r=s.TOUCH_DOLLY_PAN;break;case Xi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Be(P),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(ra)}function J(P){switch(Tt(P),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;At(P),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;Ut(P),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;ue(P),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Gt(P),n.update();break;default:r=s.NONE}}function ie(P){n.enabled!==!1&&P.preventDefault()}function qt(P){A.push(P.pointerId)}function Nt(P){delete U[P.pointerId];for(let st=0;st<A.length;st++)if(A[st]==P.pointerId){A.splice(st,1);return}}function Tt(P){let st=U[P.pointerId];st===void 0&&(st=new ht,U[P.pointerId]=st),st.set(P.pageX,P.pageY)}function mt(P){const st=P.pointerId===A[0]?A[1]:A[0];return U[st]}n.domElement.addEventListener("contextmenu",ie),n.domElement.addEventListener("pointerdown",T),n.domElement.addEventListener("pointercancel",O),n.domElement.addEventListener("wheel",nt,{passive:!1}),document.addEventListener("keydown",dt,{passive:!0,capture:!0}),this.update()}}const In={W:40,H:28,deploy:8},Ui=1,co=12,Zr=3,Qr=5,to=6,be=[{key:"squirrel",name:"Bushtail Clans",short:"Bushtails",color:"#ec8a34",dark:"#7a3d12",icon:"🐿️"},{key:"snake",name:"Coil of Ssithra",short:"Serpents",color:"#46c27a",dark:"#14532d",icon:"🐍"}],jh=[{key:"move",name:"Movement"},{key:"shoot",name:"Shooting"},{key:"charge",name:"Charge"},{key:"fight",name:"Fight"},{key:"morale",name:"Morale"}],y_={nutkin:{side:0,name:"Nutkin Skirmishers",short:"Nutkin",role:"Troops",models:6,base:.3,pts:7,M:7,WS:4,BS:4,S:3,T:3,W:1,A:1,Ld:6,Sv:6,OC:2,ranged:{name:"Slingshots",range:18,shots:2,S:3,AP:0,D:1,assault:!0,fx:"acorn"},melee:{name:"Twig knives",S:3,AP:0,D:1},abilities:["Scurry — may shoot after Advancing."]},grenadier:{side:0,name:"Acorn Grenadiers",short:"Grenadiers",role:"Troops",models:5,base:.3,pts:11,M:6,WS:4,BS:4,S:3,T:3,W:1,A:1,Ld:7,Sv:5,OC:1,ranged:{name:"Blasting acorns",range:12,shots:2,blast:1.6,S:4,AP:1,D:1,scenery:1,fx:"bomb"},melee:{name:"Twig knives",S:3,AP:0,D:1},abilities:['Blast — lobs 2 templates; a miss scatters D6+1".']},oakguard:{side:0,name:"Oak Guard",short:"Oak Guard",role:"Elite",models:5,base:.34,pts:22,M:5,WS:3,BS:5,S:4,T:4,W:2,A:2,Ld:8,Sv:3,OC:1,ranged:null,melee:{name:"Pinecone halberds",S:5,AP:2,D:1},abilities:["Bark shields — the clan’s anvil. No guns, all heart."]},glider:{side:0,name:"Glider Wing",short:"Gliders",role:"Fast",models:4,base:.32,pts:15,M:12,fly:!0,WS:3,BS:4,S:3,T:3,W:1,A:2,Ld:7,Sv:5,OC:1,ranged:{name:"Thorn darts",range:10,shots:2,S:3,AP:1,D:1,assault:!0,fx:"dart"},melee:{name:"Hooked claws",S:4,AP:1,D:1},abilities:["Fly — moves over scenery and enemy units.","Swoop — may shoot after Advancing."]},trebuchet:{side:0,name:"Pinecone Trebuchet",short:"Trebuchet",role:"Artillery",models:1,base:1.05,pts:95,M:3,WS:6,BS:4,S:3,T:5,W:7,A:2,Ld:7,Sv:4,OC:0,big:!0,ranged:{name:"Flaming pinecone",range:36,shots:1,blast:3,S:6,AP:1,D:2,indirect:!0,heavy:!0,scenery:3,fx:"pinecone"},melee:{name:"Crew mallets",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving."]},elder:{side:0,name:"Elder Chitterwick",short:"Elder",role:"Hero",models:1,base:.42,pts:80,hero:!0,M:6,WS:3,BS:3,S:4,T:4,W:5,A:3,Ld:9,Sv:4,OC:1,ranged:{name:"Thornburst",spell:6,range:18,shots:1,blast:2.4,S:5,AP:2,D:1,scenery:2,fx:"thorns"},melee:{name:"Rootwood staff",S:5,AP:1,D:2},abilities:["Spell — cast on 2D6 ≥ 6: thorns erupt under the target, no scatter.",`Grey whiskers — friends within ${to}" use his Ld 9.`]},scaleguard:{side:1,name:"Scaleguard",short:"Scaleguard",role:"Troops",models:6,base:.32,pts:10,M:5,WS:3,BS:5,S:4,T:4,W:1,A:1,Ld:7,Sv:4,OC:2,ranged:{name:"Javelins",range:8,shots:1,S:4,AP:0,D:1,fx:"javelin"},melee:{name:"Serpent spears",S:4,AP:1,D:1},abilities:["Shield wall — the Coil’s steady line."]},spitter:{side:1,name:"Venom Spitters",short:"Spitters",role:"Troops",models:5,base:.32,pts:12,M:5,WS:4,BS:3,S:3,T:4,W:1,A:1,Ld:7,Sv:5,OC:1,ranged:{name:"Venom spit",range:12,shots:2,S:2,AP:1,D:1,poison:4,fx:"spit"},melee:{name:"Fangs",S:3,AP:0,D:1,poison:4},abilities:["Poison 4+ — always wounds on a 4+, however tough the target."]},sidewinder:{side:1,name:"Sidewinder Stalkers",short:"Sidewinders",role:"Fast",models:4,base:.34,pts:24,M:10,WS:3,BS:5,S:4,T:4,W:2,A:2,Ld:7,Sv:5,OC:1,ranged:null,melee:{name:"Twin sickles",S:4,AP:1,D:1},abilities:["Sidewind — may charge after Advancing."]},brute:{side:1,name:"Constrictor Brute",short:"Brute",role:"Monster",models:1,base:.95,pts:125,big:!0,M:6,WS:3,BS:6,S:6,T:6,W:9,A:4,Ld:8,Sv:4,OC:4,ranged:null,melee:{name:"Crushing coils",S:7,AP:2,D:2},abilities:["Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it)."],wrecker:!0},engine:{side:1,name:"Basilisk Venom Engine",short:"Venom Engine",role:"Artillery",models:1,base:1.05,pts:100,big:!0,M:4,WS:6,BS:4,S:3,T:6,W:7,A:1,Ld:7,Sv:3,OC:0,ranged:{name:"Acid globe",range:30,shots:1,blast:2.6,S:5,AP:2,D:2,poison:3,indirect:!0,heavy:!0,scenery:4,fx:"acid"},melee:{name:"Crew hooks",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving.","Acid — Poison 3+, and it eats stone."]},hierophant:{side:1,name:"Hierophant Ssithra",short:"Hierophant",role:"Hero",models:1,base:.45,pts:85,hero:!0,M:5,WS:3,BS:3,S:4,T:5,W:5,A:3,Ld:9,Sv:4,OC:1,ranged:{name:"Mesmerize",spell:7,range:18,mesmerize:!0,fx:"gaze"},melee:{name:"Fang staff",S:5,AP:2,D:2,poison:3},abilities:["Spell — cast on 2D6 ≥ 7: the target suffers D3 mortal wounds and is Mesmerized — it can’t shoot or charge next turn and hits at −1 in melee.",`Coiled will — friends within ${to}" use her Ld 9.`]}},S_=[["elder","oakguard","nutkin","nutkin","grenadier","glider","trebuchet"],["hierophant","brute","scaleguard","scaleguard","spitter","sidewinder","engine"]],Va=()=>1+Math.floor(Math.random()*6),We=i=>Array.from({length:i},Va),ei=(i,t)=>i.filter(e=>e>=t).length,b_=(i,t,e)=>i<t?t:i>e?e:i,Gr=i=>i>6?0:i<=1?1:(7-i)/6;function Fi(i){let t=0;for(let e=1;e<=6;e++)for(let n=1;n<=6;n++)e+n>=i&&t++;return t/36}function or(i,t,e){let n;return i>=2*t?n=2:i>t?n=3:i===t?n=4:2*i<=t?n=6:n=5,e?Math.min(n,e):n}function ar(i,t,e){return Math.max(2,i+t-(e?1:0))}const nr=(i,t)=>b_(i+t,2,6);function Rs(i,t,e){const n=i.alive;return e?n*i.t.A:t.blast?Math.min(t.shots,n):n*t.shots}function eo(i,t,e,n,s){const r=n.t,a=Gr(t),o=Gr(or(e.S,r.T,e.poison)),c=1-Gr(ar(r.Sv,e.AP,s)),h=i*a*o*c,l=Math.min(e.D,r.W)/r.W,u=Math.min(n.alive,h*l);return{wounds:h,kills:u,value:u*r.pts}}const Wl=Math.SQRT2;class E_{constructor(t,e,n=.5){this.W=t,this.H=e,this.cell=n,this.nx=Math.round(t/n),this.nz=Math.round(e/n);const s=this.N=this.nx*this.nz;this.hard=new Uint8Array(s),this.soft=new Uint8Array(s),this.diff=new Uint8Array(s),this.cover=new Uint8Array(s),this.clearAll=new Float32Array(s),this.clearHard=new Float32Array(s),this.tmp=new Float32Array(s)}x(t){return-this.W/2+(t%this.nx+.5)*this.cell}z(t){return-this.H/2+(Math.floor(t/this.nx)+.5)*this.cell}index(t,e){const n=Math.floor((t+this.W/2)/this.cell),s=Math.floor((e+this.H/2)/this.cell);return n<0||s<0||n>=this.nx||s>=this.nz?-1:s*this.nx+n}rebuild(t){this.hard.fill(0),this.soft.fill(0),this.diff.fill(0),this.cover.fill(0);for(const e of t){if(!e.alive)continue;const n=e.nav||e.shape;e.navKind==="hard"?this.raster(n,.1,this.hard):e.navKind==="soft"?this.raster(n,.1,this.soft):e.navKind==="diff"&&this.raster(n,.15,this.diff),e.cover&&this.raster(e.coverShape||n,.6,this.cover)}this.field(this.hard,null,this.clearHard),this.field(this.hard,this.soft,this.clearAll)}raster(t,e,n){const s=Math.hypot(t.hx,t.hz)+e,r=Math.cos(t.yaw),a=Math.sin(t.yaw),o=Math.max(0,Math.floor((t.x-s+this.W/2)/this.cell)),c=Math.min(this.nx-1,Math.floor((t.x+s+this.W/2)/this.cell)),h=Math.max(0,Math.floor((t.z-s+this.H/2)/this.cell)),l=Math.min(this.nz-1,Math.floor((t.z+s+this.H/2)/this.cell));for(let u=h;u<=l;u++)for(let f=o;f<=c;f++){const d=u*this.nx+f,g=this.x(d)-t.x,_=this.z(d)-t.z,m=g*r-_*a,p=g*a+_*r;Math.abs(m)<=t.hx+e&&Math.abs(p)<=t.hz+e&&(n[d]=1)}}field(t,e,n){const{nx:s,nz:r,cell:a}=this,o=1e6,c=a,h=a*Wl;for(let l=0;l<this.N;l++)n[l]=t[l]||e&&e[l]?0:o;for(let l=0;l<r;l++)for(let u=0;u<s;u++){const f=l*s+u;let d=n[f];u>0&&(d=Math.min(d,n[f-1]+c)),l>0&&(d=Math.min(d,n[f-s]+c),u>0&&(d=Math.min(d,n[f-s-1]+h)),u<s-1&&(d=Math.min(d,n[f-s+1]+h))),n[f]=d}for(let l=r-1;l>=0;l--)for(let u=s-1;u>=0;u--){const f=l*s+u;let d=n[f];u<s-1&&(d=Math.min(d,n[f+1]+c)),l<r-1&&(d=Math.min(d,n[f+s]+c),u<s-1&&(d=Math.min(d,n[f+s+1]+h)),u>0&&(d=Math.min(d,n[f+s-1]+h))),n[f]=d}for(let l=0;l<this.N;l++){const u=this.x(l),f=this.z(l),d=Math.min(u+this.W/2,this.W/2-u,f+this.H/2,this.H/2-f);n[l]=Math.min(n[l]>0?n[l]-a*.5:0,d)}}clearance(t,e){return e==="wreck"?this.clearHard[t]:this.clearAll[t]}standable(t,e,n,s){return t<0||s&&s[t]?!1:this.clearance(t,n==="wreck"?"wreck":"all")>=e-.06}reach(t,e,{r:n,max:s,mode:r="walk",forbid:a=null}){const o=this.N,c=new Float32Array(o).fill(1/0),h=new Int32Array(o).fill(-1),l=this.index(t,e),u={dist:c,prev:h,start:l,mode:r,sx:t,sz:e};if(l<0)return u;if(r==="fly"){for(let p=0;p<o;p++){const v=Math.hypot(this.x(p)-t,this.z(p)-e);v<=s&&(c[p]=v)}return u}c[l]=0;const f=new w_;f.push(l,0);const{nx:d,nz:g,cell:_}=this,m=this.clearance(l,r==="wreck"?"wreck":"all")<n-.06?n*1.5:0;for(;f.size;){const[p,v]=f.pop();if(v>c[p])continue;const x=p%d,M=p/d|0;for(let R=-1;R<=1;R++)for(let E=-1;E<=1;E++){if(!E&&!R)continue;const A=x+E,U=M+R;if(A<0||U<0||A>=d||U>=g)continue;const y=U*d+A;if(a&&a[y])continue;const w=this.clearance(y,r==="wreck"?"wreck":"all");if(w<n-.06&&!(m&&w>.05&&Math.hypot(this.x(y)-t,this.z(y)-e)<m))continue;let H=this.diff[y]?2:1;r==="wreck"&&this.clearAll[y]<n-.06&&(H=2);const G=v+(E&&R?Wl:1)*_*H;G<=s&&G<c[y]&&(c[y]=G,h[y]=p,f.push(y,G))}}return u}path(t,e,n,s){if(t.mode==="fly")return[{x:t.sx,z:t.sz},{x:this.x(e),z:this.z(e)}];const r=[];for(let h=e;h!==-1&&(r.push(h),h!==t.start);h=t.prev[h]);r.reverse();const a=r.map(h=>({x:this.x(h),z:this.z(h)}));if(a[0]={x:t.sx,z:t.sz},a.length<3)return a;const o=[a[0]];let c=0;for(;c<a.length-1;){let h=c+1;for(let l=a.length-1;l>c+1;l--)if(this.walkable(a[c],a[l],n,t.mode,s)){h=l;break}o.push(a[h]),c=h}return o}walkable(t,e,n,s,r){const a=Math.hypot(e.x-t.x,e.z-t.z),o=Math.ceil(a/(this.cell*.5)),c=this.diff[this.index(t.x,t.z)];for(let h=1;h<o;h++){const l=h/o,u=this.index(t.x+(e.x-t.x)*l,t.z+(e.z-t.z)*l);if(u<0||r&&r[u]||this.clearance(u,s==="wreck"?"wreck":"all")<n-.06||this.diff[u]!==c||s==="wreck"&&this.clearAll[u]<n-.06)return!1}return!0}}const Kh=i=>{let t=0;for(let e=1;e<i.length;e++)t+=Math.hypot(i[e].x-i[e-1].x,i[e].z-i[e-1].z);return t};class w_{constructor(){this.ids=[],this.keys=[]}get size(){return this.ids.length}push(t,e){const{ids:n,keys:s}=this;let r=n.length;for(n.push(t),s.push(e);r>0;){const a=r-1>>1;if(s[a]<=e)break;n[r]=n[a],s[r]=s[a],r=a}n[r]=t,s[r]=e}pop(){const{ids:t,keys:e}=this,n=[t[0],e[0]],s=t.pop(),r=e.pop();if(t.length){let a=0;const o=t.length;for(;;){let c=2*a+1;if(c>=o||(c+1<o&&e[c+1]<e[c]&&c++,e[c]>=r))break;t[a]=t[c],e[a]=e[c],a=c}t[a]=s,e[a]=r}return n}}function Xl(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const Un=(i,t,e)=>i+(t-i)*e,$e=(i,t=Math.random)=>i[Math.floor(t()*i.length)],ee=(i,t,e)=>t+i()*(e-t),Cs=i=>1-Math.pow(1-i,3),T_=i=>i*i*i,Wa=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,A_=i=>Math.atan2(Math.sin(i),Math.cos(i));function R_(i){return i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375}const _n={speed:1,time:0},ba=new Set;function Pe(i,t,e=n=>n){return new Promise(n=>{ba.add({t:0,duration:Math.max(1e-4,i),fn:t,ease:e,resolve:n})})}const Xe=i=>Pe(i,()=>{});function C_(i){for(const t of[...ba]){t.t+=i;const e=Math.min(1,t.t/t.duration);t.fn(t.ease(e),e),e>=1&&(ba.delete(t),t.resolve())}}const ls=new On(1,1,1),P_=new nn(.5,.5,1,8).rotateZ(Math.PI/2),oa=new Map;function xe(i,t={}){const e=i+JSON.stringify(t);return oa.has(e)||oa.set(e,new Tn({color:i,roughness:.9,flatShading:!0,...t})),oa.get(e)}function Me(i,t,{shadow:e=!0}={}){const n=new kt(i,t);return n.castShadow=e,n.receiveShadow=!0,n}const L_={stone:{colors:["#8f8b82","#9c978d","#7f7b73","#a7a296","#878378"],bw:1,by:.72,bt:.62,hp:3,look:"box"},sand:{colors:["#c9a66b","#d6b67e","#b9935b","#ddc28e","#c29a60"],bw:1,by:.72,bt:.66,hp:2,look:"box"},log:{colors:["#7a5232","#6b4528","#86603c","#5f3e24"],bw:1,by:.56,bt:.56,hp:2,look:"log"}},D_={oak:["#4f8a34","#5f9a3c","#447a2c","#6aa646"],autumn:["#d08a2c","#c4622a","#e0a93a","#b8481f"],pine:["#2f6a3c","#3a7a46","#285c34"]},I_=["#7a5232","#5f3e24","#9a7048","#b08a5a"];let U_=1;class N_{constructor(t,e,n,s){this.scene=t,this.fx=e,this.W=n,this.H=s,this.group=new zt,t.add(this.group),this.chunks=[],this.features=[],this.dirty=!0,this.onBreak=null}clear(){this.scene.remove(this.group),this.group=new zt,this.scene.add(this.group),this.chunks=[],this.features=[],this.dirty=!0}add(t){const e={id:U_++,alive:!0,destructible:t.hp!==1/0,hp:t.hp??1/0,maxHp:t.hp??1/0,los:null,cover:!1,navKind:null,...t},n=e.shape;return n.reach=Math.hypot(n.hx,n.hz)+.05,e.mesh&&this.group.add(e.mesh),this.chunks.push(e),e}generate(t,e,n){this.clear();const s=Xl(t),{W:r,H:a}=this,o=[],c=s();if(c<.55)this.build("tower",{x:0,z:0,yaw:s()*Math.PI},s()*1e9|0),o.push({x:0,z:0,r:4.6,hollow:!0});else if(c<.8){const d=s()*Math.PI;for(const g of[0,1]){const _=d+g*(Math.PI/2),m=Math.cos(_)*4.2,p=Math.sin(_)*4.2,v=s()*1e9|0;this.build("rocks",{x:m,z:p,yaw:_},v),this.build("rocks",{x:-m,z:-p,yaw:_+Math.PI},v),o.push({x:m,z:p,r:1.8},{x:-m,z:-p,r:1.8})}}const h=[["ruin",3.2,4],["wall",3.6,2],["forest",3.2,3],["hedgerow",3.4,2],["rocks",2,2],["barricade",2,2],["mushrooms",2,1.5],["obelisk",1.6,1]],l=h.reduce((d,g)=>d+g[2],0),u=6+Math.floor(s()*3);let f=0;for(let d=0;d<1200&&f<u;d++){let g=s()*l,_=h[0];for(const U of h)if((g-=U[2])<=0){_=U;break}const[m,p]=_,v=ee(s,-r/2+p+.5,r/2-p-.5),x=ee(s,-a/2+p+.5,a/2-p-.5);if(Math.hypot(v,x)<p+1.4||Math.abs(v)>r/2-n-1&&(p>2.1||m==="forest")||e.some(U=>Math.hypot(U.x-v,U.z-x)<p+2.2))continue;const R=2.1;if(o.some(U=>Math.hypot(U.x-v,U.z-x)<U.r+p+R||Math.hypot(U.x+v,U.z+x)<U.r+p+R))continue;const E=s()*Math.PI*2,A=s()*1e9|0;this.build(m,{x:v,z:x,yaw:E},A),this.build(m,{x:-v,z:-x,yaw:E+Math.PI},A),o.push({x:v,z:x,r:p},{x:-v,z:-x,r:p}),f++}this.features=o,this.dirty=!0}build(t,e,n){const s=Xl(n),r=Math.cos(e.yaw),a=Math.sin(e.yaw),o={p:(c,h)=>({x:e.x+r*c+a*h,z:e.z-a*c+r*h}),yaw:(c=0)=>e.yaw+c};this[t](o,s)}column(t,e,n,s,r,a,o,{holes:c=[],cap:h=!1,bw:l,bt:u}={}){const f=L_[o],d=l??f.bw,g=u??f.bt,_=t.p(n,s),m=t.yaw(r),p={blocks:[],x:_.x,z:_.z,yaw:m,style:f,rubble:null,w:d,t:g};for(let v=0;v<a;v++){if(c.includes(v))continue;const x=$e(f.colors,e),M=m+(e()-.5)*.06,R=Me(f.look==="log"?P_:ls,xe(x));f.look==="log"?R.scale.set(d*1.02,f.by,g):R.scale.set(d*(.95+e()*.04),f.by*.96,g*(.9+e()*.1)),R.position.set(_.x,f.by*(v+.5),_.z),R.rotation.y=M;const E=this.add({kind:"block",mesh:R,hp:f.hp,color:x,shape:{x:_.x,y:f.by*(v+.5),z:_.z,hx:d/2,hy:f.by/2,hz:g/2,yaw:m},navKind:"soft",los:"block",cover:!0});E.col=p,E.level=v,p.blocks.push(E)}if(h&&a>0){const v=$e(f.colors,e),x=Me(new zn(d*.72,d*1.1,4).rotateY(Math.PI/4),xe(v)),M=f.by*a+d*.55;x.position.set(_.x,M,_.z),x.rotation.y=m;const R=this.add({kind:"block",mesh:x,hp:f.hp,color:v,capH:d*1.1,shape:{x:_.x,y:M,z:_.z,hx:d/2,hy:d*.55,hz:d/2,yaw:m},navKind:"soft",los:"block",cover:!0});R.col=p,R.level=a,p.blocks.push(R)}return p}tree(t,e,n,s,r){const a=t.p(n,s),o=ee(e,1.5,2.4),c=ee(e,.17,.26),h=new zt;h.position.set(a.x,0,a.z);const l=Me(new nn(c*.75,c,o,7).translate(0,o/2,0),xe($e(["#6b4a2e","#5a3d24","#7a5638"],e)));h.add(l);const u=new zt;h.add(u);let f;const d=D_[r];if(r==="pine"){for(let _=0;_<3;_++){const m=1.05-_*.26,p=1.3-_*.15,v=Me(new zn(m,p,8),xe($e(d,e)));v.position.y=o*.45+_*.75+p/2,v.rotation.y=e()*3,u.add(v)}f=o*.45+2.5}else{const _=3+Math.floor(e()*3);for(let m=0;m<_;m++){const p=ee(e,.55,.9),v=Me(new Fn(p,1),xe($e(d,e)));v.position.set(ee(e,-.5,.5),o+ee(e,-.1,.6),ee(e,-.5,.5)),v.scale.y=.8,u.add(v)}f=o+1.2}h.rotation.y=e()*6;const g=this.add({kind:"tree",mesh:h,hp:3,leaves:d,shape:{x:a.x,y:f/2,z:a.z,hx:.7,hy:f/2,hz:.7,yaw:0},nav:{x:a.x,z:a.z,hx:c+.12,hz:c+.12,yaw:0},coverShape:{x:a.x,z:a.z,hx:.8,hz:.8,yaw:0},navKind:"soft",los:"obscure",cover:!0});return g.trunkH=o,g.trunkR=c,g.canopy=u,g}hedge(t,e,n,s,r){const a=t.p(n,s),o=t.yaw(r),c=new zt;c.position.set(a.x,0,a.z),c.rotation.y=o;const h=$e(["#3f7a34","#4a8a3a","#386c2e"],e),l=Me(ls,xe(h));l.scale.set(1.15,.62,.55),l.position.y=.31,c.add(l);for(let u=0;u<3;u++){const f=Me(new Fn(.3,0),xe($e(["#4f8f3e","#5c9a46","#3f7a34"],e)));f.position.set(-.4+u*.4,.62+e()*.08,ee(e,-.08,.08)),c.add(f)}if(e()<.4)for(let u=0;u<4;u++){const f=Me(new ln(.05,5,4),xe("#c0302a"),{shadow:!1});f.position.set(ee(e,-.5,.5),ee(e,.35,.75),.29),c.add(f)}return this.add({kind:"hedge",mesh:c,hp:1,leaves:["#3f7a34","#5c9a46","#2f5f28"],shape:{x:a.x,y:.42,z:a.z,hx:.6,hy:.42,hz:.3,yaw:o},navKind:"diff",los:"obscure",cover:!0})}boulder(t,e,n,s,r){const a=t.p(n,s),o=ee(e,.65,1.25),c=Me(new Jr(r,0),xe($e(["#7d7a74","#8c8880","#6e6b66","#96918a"],e)));c.scale.set(1,o,ee(e,.75,1.1)),c.rotation.set(e()*.6,e()*6,e()*.6);const h=r*o;if(c.position.set(a.x,h*.55,a.z),e()<.6){const u=Me(new Jr(r*.55,0),xe("#5d7a3a"),{shadow:!1});u.position.set(0,r*.55,0),u.scale.set(1.1,.4,1.1),c.add(u)}const l=h*1.5;return this.add({kind:"rock",mesh:c,hp:1/0,shape:{x:a.x,y:l/2,z:a.z,hx:r*.85,hy:l/2,hz:r*.85,yaw:0},navKind:"hard",los:l>1.2?"block":"obscure",cover:!0})}crate(t,e,n,s){const r=t.p(n,s),a=t.yaw(e()*6),o=e();let c,h;if(o<.45){c=new zt;const l=ee(e,.55,.75),u=Me(ls,xe($e(["#9a7048","#8a6038","#a77d50"],e)));u.scale.setScalar(l),u.position.y=l/2;const f=Me(ls,xe("#5f3e24"));if(f.scale.set(l*1.02,l*.14,l*1.02),f.position.y=l/2,c.add(u,f),e()<.4){const d=Me(ls,xe("#9a7048"));d.scale.setScalar(l*.7),d.position.set(0,l+l*.35,0),d.rotation.y=.5,c.add(d),h=l*1.7}else h=l}else if(o<.8){c=new zt;const l=Me(new nn(.28,.24,.75,10),xe($e(["#8a5a34","#7a4c2a"],e)));l.position.y=.375;const u=Me(new Sn(.29,.025,4,14).rotateX(Math.PI/2),xe("#3a3a3a",{metalness:.4}));u.position.y=.55,c.add(l,u),h=.75}else{c=new zt;const l=Me(new ln(.34,9,7),xe("#c2a77a"));l.scale.set(1,1.15,.9),l.position.y=.36,c.add(l);for(let u=0;u<4;u++){const f=Me(new ln(.08,6,5),xe("#8a5a2a"));f.position.set(ee(e,-.12,.12),.72,ee(e,-.12,.12)),c.add(f)}h=.78}return c.position.set(r.x,0,r.z),c.rotation.y=a,this.add({kind:"crate",mesh:c,hp:1,color:"#9a7048",shape:{x:r.x,y:h/2,z:r.z,hx:.36,hy:h/2,hz:.36,yaw:a},navKind:"diff",los:"obscure",cover:!0})}mushroom(t,e,n,s){const r=t.p(n,s),a=ee(e,.9,1.9),o=ee(e,.5,.95),c=ee(e,.12,.2),h=new zt;h.position.set(r.x,0,r.z);const l=Me(new nn(c*.8,c*1.2,a,8).translate(0,a/2,0),xe("#efe6d0")),u=$e(["#c0392b","#d35a1f","#8e44ad","#b03050"],e),f=Me(new ln(o,14,8,0,Math.PI*2,0,Math.PI/2),xe(u));f.position.y=a-.05,f.scale.y=.7,h.add(l,f);for(let g=0;g<6;g++){const _=e()*6,m=ee(e,.25,1.1),p=Me(new ln(o*.12,5,4),xe("#fff6e0"),{shadow:!1});p.position.set(Math.cos(_)*Math.sin(m)*o,a-.05+Math.cos(m)*o*.7,Math.sin(_)*Math.sin(m)*o),h.add(p)}h.rotation.z=ee(e,-.12,.12);const d=a+o*.7;return this.add({kind:"mushroom",mesh:h,hp:2,leaves:[u,"#fff6e0","#efe6d0"],shape:{x:r.x,y:d/2,z:r.z,hx:o*.6,hy:d/2,hz:o*.6,yaw:0},nav:{x:r.x,z:r.z,hx:c+.12,hz:c+.12,yaw:0},navKind:"soft",los:"obscure",cover:!0})}floor(t,e,n,s){const r=t.p(0,0),a=new er(n,22),o=a.attributes.position;for(let h=1;h<o.count;h++){const l=.78+e()*.3;o.setXY(h,o.getX(h)*l,o.getY(h)*l)}a.rotateX(-Math.PI/2);const c=Me(a,xe(s,{flatShading:!1}),{shadow:!1});return c.position.set(r.x,.012,r.z),this.add({kind:"floor",mesh:c,hp:1/0,shape:{x:r.x,y:.01,z:r.z,hx:n*.75,hy:.01,hz:n*.75,yaw:0},navKind:"diff",cover:!0})}ruin(t,e){const n=$e(["stone","sand","log","stone"],e),s=4+Math.floor(e()*3),r=3+Math.floor(e()*3),a=-s/2+.5,o=-r/2+.5,c=1+Math.floor(e()*(s-2));for(let l=0;l<s;l++){if(l===c)continue;let u=Math.max(1,Math.min(3,3-Math.floor(l/2)+Math.floor(e()*2)-(e()<.3?1:0)));const f=u===3&&e()<.35?[1]:[];this.column(t,e,a+l,o,0,u,n,{holes:f})}for(let l=1;l<=r;l++){let u=Math.max(1,Math.min(3,3-Math.floor(l/2)+Math.floor(e()*2)));if(e()<.15)continue;const f=u===3&&e()<.35?[1]:[];this.column(t,e,a,o+.3+.5+(l-1),Math.PI/2,u,n,{holes:f})}const h=Math.floor(e()*3);for(let l=0;l<h;l++)this.crate(t,e,a+ee(e,1.5,s-1),o+ee(e,1.6,r-.5))}wall(t,e){const n=$e(["stone","sand","log"],e),s=5+Math.floor(e()*3),r=Math.floor(e()*s);for(let a=0;a<s;a++){if(a===r&&s>5)continue;const o=1+Math.floor(e()*3);this.column(t,e,a-(s-1)/2,0,0,o,n,{holes:o===3&&e()<.4?[1]:[]})}e()<.6&&this.crate(t,e,ee(e,-2,2),ee(e,.9,1.4))}tower(t,e){const n=$e(["stone","sand"],e),s=18,r=3.4,a=[];for(let h=0;h<s/2;h++)a.push(1+Math.floor(e()*3));const o=new Set([0,Math.floor(s/4)+(e()<.5?0:1)]),c=a.map(h=>h===3&&e()<.4);for(let h=0;h<s;h++){const l=h%(s/2);if(o.has(l))continue;const u=h/s*Math.PI*2,f=Math.atan2(-Math.cos(u),-Math.sin(u));this.column(t,e,Math.cos(u)*r,Math.sin(u)*r,f,a[l],n,{holes:c[l]?[1]:[],bw:1.12})}}forest(t,e){const n=e()<.3?"pine":e()<.4?"autumn":"oak";this.floor(t,e,3,n==="autumn"?"#5a5a2a":"#355a2a");const s=[],r=3+Math.floor(e()*3);for(let a=0;a<60&&s.length<r;a++){const o=e()*Math.PI*2,c=Math.sqrt(e())*2.2,h=Math.cos(o)*c,l=Math.sin(o)*c;s.some(u=>Math.hypot(u.x-h,u.z-l)<1.55)||s.push({x:h,z:l})}for(const a of s)this.tree(t,e,a.x,a.z,n)}hedgerow(t,e){const n=5+Math.floor(e()*3),s=ee(e,-.12,.12),r=1+Math.floor(e()*(n-2));for(let a=0;a<n;a++){if(a===r&&e()<.7)continue;const o=(a-(n-1)/2)*1.12,c=s*o*o;this.hedge(t,e,o,c,-Math.atan(2*s*o))}}rocks(t,e){const n=2+Math.floor(e()*3);this.boulder(t,e,0,0,ee(e,.8,1.15));for(let s=1;s<n;s++){const r=e()*6;this.boulder(t,e,Math.cos(r)*ee(e,.9,1.4),Math.sin(r)*ee(e,.9,1.4),ee(e,.35,.7))}}barricade(t,e){const n=3+Math.floor(e()*3);for(let s=0;s<n;s++)this.crate(t,e,(s-(n-1)/2)*.8+ee(e,-.1,.1),ee(e,-.3,.3))}mushrooms(t,e){const n=3+Math.floor(e()*3),s=[];for(let r=0;r<40&&s.length<n;r++){const a=e()*6,o=Math.sqrt(e())*1.5,c=Math.cos(a)*o,h=Math.sin(a)*o;s.some(l=>Math.hypot(l.x-c,l.z-h)<.9)||(s.push({x:c,z:h}),this.mushroom(t,e,c,h))}}obelisk(t,e){this.column(t,e,0,0,0,3+Math.floor(e()*2),"sand",{cap:!0,bw:.8,bt:.8}),e()<.7&&this.boulder(t,e,1,.4,.4)}los(t,e,n=1.3){let s=0;const r=e.x-t.x,a=e.y-t.y,o=e.z-t.z,c=r*r+o*o;for(const h of this.chunks){if(!h.alive||!h.los)continue;const l=h.shape;let u=c>0?((l.x-t.x)*r+(l.z-t.z)*o)/c:0;u=u<0?0:u>1?1:u;const f=t.x+r*u-l.x,d=t.z+o*u-l.z;if(!(f*f+d*d>l.reach*l.reach)&&O_(t,r,a,o,l)){if(h.los==="block")return{blocked:!0,obscure:s};Math.hypot(l.x-t.x,l.z-t.z)<n+l.reach*.5||s++}}return{blocked:s>=2,obscure:s}}blast(t,e,n,s,{acid:r=!1}={}){const a=[];for(const o of[...this.chunks]){if(!o.alive||!o.destructible)continue;const c=z_(t,.5,e,o.shape);if(c>n)continue;let h=c<n*.6?s:Math.ceil(s/2);r&&o.kind==="block"&&(h+=1),this.hurt(o,h,{x:t,z:e},a)}return a}hurt(t,e,n,s=[]){if(!t.alive||!t.destructible)return s;if(t.hp-=e,t.hp<=0)this.destroy(t,n),s.push(t);else{t.mesh.isMesh&&(t.ownMat||(t.mesh.material=t.mesh.material.clone(),t.ownMat=!0),t.mesh.material.color.multiplyScalar(.8));const r=t.mesh.position.clone();Pe(.25,a=>{const o=(1-a)*.06;t.mesh.position.set(r.x+(Math.random()-.5)*o,r.y,r.z+(Math.random()-.5)*o)}).then(()=>t.mesh.position.copy(r)),this.fx.debris(t.shape.x,t.shape.y,t.shape.z,[t.color||"#888","#666"],3,{from:n,power:3,size:.08})}return s}destroy(t,e){var r;t.alive=!1,this.dirty=!0;const n=t.shape,s=this.fx;switch(t.kind){case"block":{this.group.remove(t.mesh),s.debris(n.x,n.y,n.z,[t.color,t.color,"#5a5650"],12,{from:e,power:6}),s.smoke({x:n.x,y:n.y,z:n.z,size:.4,color:"#a09a8a",life:1.5}),this.collapse(t.col),this.rubble(t.col,e);break}case"tree":this.topple(t,e);break;case"hedge":case"mushroom":if(this.group.remove(t.mesh),s.leaves(n.x,n.y,n.z,t.leaves,t.kind==="hedge"?22:28,t.kind==="hedge"?.8:1.4),t.kind==="mushroom")for(let a=0;a<16;a++)s.mote({x:n.x,y:n.y*1.5,z:n.z,vx:(Math.random()-.5)*3,vy:Math.random()*2,vz:(Math.random()-.5)*3,size:.05,color:"#f0e0ff",life:2.5,drag:1});break;case"crate":case"log":this.group.remove(t.mesh),s.debris(n.x,n.y,n.z,I_,14,{from:e,power:6,size:.12});break}(r=this.onBreak)==null||r.call(this,t)}collapse(t){t.blocks=t.blocks.filter(n=>n.alive).sort((n,s)=>n.level-s.level);let e=0;for(const n of t.blocks){if(n.level>e){const s=(n.level-e)*t.style.by;n.level=e,n.shape.y-=s;const r=n.mesh.position.y,a=r-s;Pe(.18+s*.15,o=>n.mesh.position.y=r+(a-r)*o,R_).then(()=>{this.fx.debris(n.shape.x,n.shape.y-t.style.by/2,n.shape.z,["#8a8478"],3,{power:2,size:.07})})}e=n.level+1}}rubble(t,e){const n=t.style;let s=t.rubble;if(!s){const o=new zt;o.position.set(t.x,0,t.z),s=t.rubble=this.add({kind:"rubble",mesh:o,hp:1/0,pieces:0,shape:{x:t.x,y:.2,z:t.z,hx:t.w*.7,hy:.2,hz:.6,yaw:t.yaw},navKind:"diff",los:"obscure",cover:!0}),this.dirty=!0}const r=s.mesh,a=4+Math.floor(Math.random()*3);for(let o=0;o<a;o++){const c=Me(ls,xe($e(n.colors))),h=.18+Math.random()*.22;c.scale.set(h*(n.look==="log"?2.4:1.2),h*.7,h);const l=Math.random()*6,u=Math.random()*.6,f=e?t.x-e.x:0,d=e?t.z-e.z:0,g=Math.hypot(f,d)||1;c.position.set(Math.cos(l)*u+f/g*.25,h*.3+Math.min(.2,s.pieces*.012),Math.sin(l)*u+d/g*.25),c.rotation.set(Math.random(),Math.random()*6,Math.random()),r.add(c)}s.pieces+=a}topple(t,e){const n=t.shape;let s=n.x-((e==null?void 0:e.x)??n.x-1),r=n.z-((e==null?void 0:e.z)??n.z);const a=Math.hypot(s,r)||1;s/=a,r/=a;const o=t.leaves;for(const g of t.canopy.children){const _=new C;g.getWorldPosition(_),this.fx.leaves(_.x,_.y,_.z,o,14,1)}t.mesh.remove(t.canopy);const c=t.mesh,h=new C(r,0,-s).normalize(),l=c.quaternion.clone(),u=new Nn;Pe(.9,g=>{u.setFromAxisAngle(h,(Math.PI/2-.12)*g),c.quaternion.copy(l).premultiply(u),c.position.y=Math.sin(g*Math.PI)*.05+t.trunkR*g},T_).then(()=>{this.fx.debris(n.x+s*t.trunkH,.2,n.z+r*t.trunkH,["#6b4a2e","#4f8a34"],8,{power:3,size:.1}),this.fx.shake=Math.max(this.fx.shake,.05)});const f=t.trunkH,d=this.add({kind:"log",mesh:c,hp:2,shape:{x:n.x+s*f*.5,y:t.trunkR,z:n.z+r*f*.5,hx:f*.5,hy:t.trunkR,hz:t.trunkR+.05,yaw:Math.atan2(-r,s)},navKind:"diff",los:"obscure",cover:!0});return this.dirty=!0,d}}function O_(i,t,e,n,s){const r=Math.cos(s.yaw),a=Math.sin(s.yaw),o=i.x-s.x,c=i.y-s.y,h=i.z-s.z,l=[o*r-h*a,c,o*a+h*r],u=[t*r-n*a,e,t*a+n*r],f=[s.hx,s.hy,s.hz];let d=0,g=1;for(let _=0;_<3;_++)if(Math.abs(u[_])<1e-9){if(Math.abs(l[_])>f[_])return!1}else{let m=(-f[_]-l[_])/u[_],p=(f[_]-l[_])/u[_];if(m>p&&([m,p]=[p,m]),m>d&&(d=m),p<g&&(g=p),d>g)return!1}return!0}function z_(i,t,e,n){const s=Math.cos(n.yaw),r=Math.sin(n.yaw),a=i-n.x,o=t-n.y,c=e-n.z,h=a*s-c*r,l=a*r+c*s,u=Math.max(0,Math.abs(h)-n.hx),f=Math.max(0,Math.abs(o)-n.hy),d=Math.max(0,Math.abs(l)-n.hz);return Math.hypot(u,f,d)}const $l=900,ql=700,Yl=260,hs=new ae,jl=new Nn,F_=new Ds,Vr=new C,B_=new C,Kl=new $t;class aa{constructor(t,e){this.mesh=t,this.max=e,this.items=[],this.free=[];for(let n=e-1;n>=0;n--)this.free.push(n);t.instanceMatrix.setUsage(kf),t.frustumCulled=!1,hs.makeScale(0,0,0);for(let n=0;n<e;n++)t.setMatrixAt(n,hs),t.setColorAt(n,Kl.set(16777215))}spawn(t){if(!this.free.length){const e=this.items.shift();this.free.push(e.i)}t.i=this.free.pop(),this.mesh.setColorAt(t.i,Kl.set(t.color)),this.mesh.instanceColor.needsUpdate=!0,this.items.push(t)}update(t){const e=[];for(const n of this.items){if(n.age+=t,n.age>=n.life){hs.makeScale(0,0,0),this.mesh.setMatrixAt(n.i,hs),this.free.push(n.i);continue}n.vy-=n.g*t;const s=Math.exp(-n.drag*t);n.vx*=s,n.vz*=s,n.g<0&&(n.vy*=s),n.x+=n.vx*t,n.y+=n.vy*t,n.z+=n.vz*t,n.y<n.floor&&(n.y=n.floor,n.vy=-n.vy*n.bounce,n.vx*=.55,n.vz*=.55,n.spin*=.5),n.rx+=n.spin*t,n.ry+=n.spin*.7*t;const r=n.age/n.life,a=n.size*(n.grow?.4+r*n.grow:1)*(r>n.fadeAt?1-(r-n.fadeAt)/(1-n.fadeAt):1);jl.setFromEuler(F_.set(n.rx,n.ry,0)),hs.compose(Vr.set(n.x,n.y,n.z),jl,B_.set(a*n.sx,a*n.sy,a*n.sz)),this.mesh.setMatrixAt(n.i,hs),e.push(n)}this.items=e,this.mesh.instanceMatrix.needsUpdate=!0}}function ca(i){return{x:i.x,y:i.y,z:i.z,vx:i.vx||0,vy:i.vy||0,vz:i.vz||0,g:i.g??22,drag:i.drag??.6,bounce:i.bounce??.3,floor:i.floor??.04,size:i.size??.15,sx:i.sx??1,sy:i.sy??1,sz:i.sz??1,rx:Math.random()*6,ry:Math.random()*6,spin:i.spin??(Math.random()-.5)*18,age:0,life:i.life??1.5,fadeAt:i.fadeAt??.7,grow:i.grow||0,color:i.color}}function Jl(i,t){const e=document.createElement("canvas");e.width=e.height=128;const n=e.getContext("2d"),s=n.createRadialGradient(64,64,4,64,64,62);s.addColorStop(0,i),s.addColorStop(.55,i),s.addColorStop(1,t),n.fillStyle=s,n.fillRect(0,0,128,128);for(let a=0;a<90;a++){const o=Math.random()*Math.PI*2,c=30+Math.random()*30;n.fillStyle=i,n.globalAlpha=Math.random()*.5,n.beginPath(),n.arc(64+Math.cos(o)*c,64+Math.sin(o)*c,2+Math.random()*6,0,Math.PI*2),n.fill()}const r=new Oa(e);return r.colorSpace=Ae,r}class k_{constructor(t,e,n){this.scene=t,this.camera=e,this.overlay=n,this.shake=0;const s=new Ks(new On(1,1,1),new Tn({roughness:.85}),$l);s.castShadow=!0;const r=new Ks(new Fn(1,0),new je({toneMapped:!1}),ql),a=new Ks(new Fn(1,1),new f_({transparent:!0,opacity:.55,depthWrite:!1}),Yl);t.add(s,r,a),this.cubes=new aa(s,$l),this.glow=new aa(r,ql),this.puff=new aa(a,Yl),this.lights=[];for(let o=0;o<3;o++){const c=new m_(16755285,0,14,1.6);c.position.set(0,-50,0),t.add(c),this.lights.push({l:c,until:0})}this.scorchTex=Jl("rgba(20,14,8,0.85)","rgba(20,14,8,0)"),this.acidTex=Jl("rgba(90,220,60,0.75)","rgba(40,120,20,0)"),this.decals=[],this.decalGeo=new er(1,28),this.decalGeo.rotateX(-Math.PI/2),this.texts=[],this.flashGeo=new ln(1,20,12),this.ringGeo=new Gi(.93,1,64),this.ringGeo.rotateX(-Math.PI/2),this.discGeo=new er(1,48),this.discGeo.rotateX(-Math.PI/2)}cube(t){this.cubes.spawn(ca(t))}mote(t){this.glow.spawn(ca({g:-1,drag:2.5,bounce:0,floor:-99,spin:0,...t}))}smoke(t){this.puff.spawn(ca({g:-2.2,drag:1.8,bounce:0,floor:.1,spin:0,grow:2.2,fadeAt:.4,...t}))}debris(t,e,n,s,r,{from:a,power:o=7,size:c=.16}={}){for(let h=0;h<r;h++){let l=Math.random()-.5,u=Math.random()-.5;a&&(l+=(t-a.x)*.35,u+=(n-a.z)*.35);const f=Math.hypot(l,u)||1,d=o*(.4+Math.random()*.8);this.cube({x:t+(Math.random()-.5)*.4,y:e+Math.random()*.3,z:n+(Math.random()-.5)*.4,vx:l/f*d,vy:3+Math.random()*o,vz:u/f*d,size:c*(.5+Math.random()),sy:.6+Math.random()*.8,color:s[Math.random()*s.length|0],life:2.4+Math.random()*1.5,fadeAt:.75})}}leaves(t,e,n,s,r,a=1){for(let o=0;o<r;o++){const c=Math.random()*Math.PI*2,h=1+Math.random()*4*a;this.cube({x:t+Math.cos(c)*.5*a,y:e+Math.random()*a,z:n+Math.sin(c)*.5*a,vx:Math.cos(c)*h,vy:2+Math.random()*4,vz:Math.sin(c)*h,g:5,drag:2.4,size:.1+Math.random()*.08,sy:.25,spin:(Math.random()-.5)*10,color:s[Math.random()*s.length|0],life:1.6+Math.random()*1.6})}}flashLight(t,e,n,s,r,a){const o=this.lights.reduce((c,h)=>c.until<h.until?c:h);o.until=_n.time+a,o.l.color.set(s),o.l.position.set(t,e,n),Pe(a,c=>o.l.intensity=r*(1-c)*(1-c))}decal(t,e,n,s,r=.8){const a=new kt(this.decalGeo,new je({map:s,transparent:!0,depthWrite:!1,opacity:r,polygonOffset:!0,polygonOffsetFactor:-2}));if(a.position.set(t,.015+this.decals.length*4e-4,e),a.rotation.y=Math.random()*6,a.scale.setScalar(n),a.renderOrder=1,this.scene.add(a),this.decals.push(a),this.decals.length>40){const o=this.decals.shift();this.scene.remove(o),o.material.dispose()}return a}ring(t,e,n,s,{life:r=1.2,fill:a=.18,hold:o=!1}={}){const c=new zt,h=new kt(this.ringGeo,new je({color:s,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1})),l=new kt(this.discGeo,new je({color:s,transparent:!0,opacity:a,depthWrite:!1,toneMapped:!1}));c.add(h,l),c.position.set(t,.05,e),c.scale.setScalar(n),c.renderOrder=3,this.scene.add(c);const u=()=>{this.scene.remove(c),h.material.dispose(),l.material.dispose()};return o||Pe(r,f=>{h.material.opacity=.95*(1-f),l.material.opacity=a*(1-f)}).then(u),c.userData.remove=u,c}explode(t,e,n,s="fire"){const r={fire:{flash:16761963,glow:["#ffd36e","#ff8a2a","#ff5a1f","#fff2b0"],light:16751178,smoke:"#4a4038"},acid:{flash:10354538,glow:["#b8ff6a","#5be04a","#d8ff9a","#2fbf4a"],light:9109338,smoke:"#3f5a2a"},thorns:{flash:13172634,glow:["#9be36a","#e4ffb0","#5ab04a"],light:12255114,smoke:"#3a4a2a"},dust:{flash:16773328,glow:["#ffe9b0","#ffd080"],light:16769184,smoke:"#8a7a64"}}[s],a=new kt(this.flashGeo,new je({color:r.flash,transparent:!0,opacity:.9,toneMapped:!1,depthWrite:!1}));a.position.set(t,.3,e),this.scene.add(a),Pe(.45,c=>{a.scale.setScalar(.2+n*.85*Cs(c)),a.material.opacity=.9*(1-c)}).then(()=>{this.scene.remove(a),a.material.dispose()}),this.flashLight(t,1.5,e,r.light,9+n*6,.7);const o=Math.round(18+n*14);for(let c=0;c<o;c++){const h=Math.random()*Math.PI*2,l=(2+Math.random()*6)*(.6+n*.25);this.mote({x:t,y:.3,z:e,vx:Math.cos(h)*l,vy:2+Math.random()*6,vz:Math.sin(h)*l,g:9,drag:2.2,size:.07+Math.random()*.12,color:r.glow[c%r.glow.length],life:.5+Math.random()*.7})}for(let c=0;c<6+n*3;c++){const h=Math.random()*Math.PI*2,l=Math.random()*n*.6;this.smoke({x:t+Math.cos(h)*l,y:.3+Math.random()*.4,z:e+Math.sin(h)*l,vx:Math.cos(h)*1.2,vy:1+Math.random()*1.5,vz:Math.sin(h)*1.2,size:.25+Math.random()*.25*n,color:r.smoke,life:1.6+Math.random()*1.4})}this.debris(t,.1,e,["#5b4630","#6f8a3a","#4a3a28"],Math.round(6+n*4),{power:5+n,size:.1}),this.decal(t,e,n*.7,s==="acid"?this.acidTex:this.scorchTex,s==="acid"?.6:.45),this.shake=Math.max(this.shake,.05+n*.06)}async projectile(t,e,{mesh:n,arc:s=.25,speed:r=22,trail:a=null,spin:o=10}={}){const c=Math.hypot(e.x-t.x,e.z-t.z),h=c*s;this.scene.add(n);let l=0;await Pe(Math.max(.12,c/r),u=>{n.position.set(t.x+(e.x-t.x)*u,t.y+(e.y-t.y)*u+4*h*u*(1-u),t.z+(e.z-t.z)*u),n.rotation.x+=o*.016,n.rotation.z+=o*.011,a&&u-l>.03&&(l=u,a(n.position))}),this.scene.remove(n)}text(t,e,n="#ffffff",{size:s=18,life:r=1.3,rise:a=1.4}={}){const o=document.createElement("div");o.className="float-text",o.textContent=e,o.style.color=n,o.style.fontSize=s+"px",this.overlay.appendChild(o),this.texts.push({el:o,x:t.x,y:t.y,z:t.z,age:0,life:r,rise:a})}update(t){this.cubes.update(t),this.glow.update(t),this.puff.update(t),this.shake*=Math.exp(-t*6);const e=innerWidth,n=innerHeight;this.texts=this.texts.filter(s=>{if(s.age+=t,s.age>s.life)return s.el.remove(),!1;const r=s.age/s.life;return Vr.set(s.x,s.y+s.rise*Cs(r),s.z).project(this.camera),s.el.style.transform=`translate(${(Vr.x*.5+.5)*e}px, ${(-Vr.y*.5+.5)*n}px) translate(-50%, -50%) scale(${1+.3*(1-Math.min(1,r*5))})`,s.el.style.opacity=r>.6?1-(r-.6)/.4:1,!0})}}function H_(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,c=new Ee;let h=0;for(let l=0;l<i.length;++l){const u=i[l];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,d,l),h+=d}}if(e){let l=0;const u=[];for(let f=0;f<i.length;++f){const d=i[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+l);l+=i[f].attributes.position.count}c.setIndex(u)}for(const l in r){const u=Zl(r[l]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" attribute."),null;c.setAttribute(l,u)}for(const l in a){const u=a[l][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[l]=[];for(let f=0;f<u;++f){const d=[];for(let _=0;_<a[l].length;++_)d.push(a[l][_][f]);const g=Zl(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" morphAttribute."),null;c.morphAttributes[l].push(g)}}return c}function Zl(i){let t,e,n,s=-1,r=0;for(let h=0;h<i.length;++h){const l=i[h];if(l.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=l.array.constructor),t!==l.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=l.itemSize),e!==l.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=l.normalized),n!==l.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=l.gpuType),s!==l.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=l.array.length}const a=new t(r);let o=0;for(let h=0;h<i.length;++h)a.set(i[h].array,o),o+=i[h].array.length;const c=new hn(a,e,n);return s!==void 0&&(c.gpuType=s),c}const la=new Map;function _t(i,t={}){const e=i+JSON.stringify(t);return la.has(e)||la.set(e,new Tn({color:i,roughness:.72,flatShading:!0,...t})),la.get(e)}const wi=i=>_t(i,{emissive:i,emissiveIntensity:1.6,roughness:.3}),Ye=i=>_t(i,{metalness:.65,roughness:.35}),lt={ico:new Fn(1,1),ico0:new Fn(1,0),sph:new ln(1,10,8),box:new On(1,1,1),cyl:new nn(1,1,1,10),cone:new zn(1,1,8),cap:new ln(1,12,6,0,Math.PI*2,0,Math.PI/2),oct:new ao(1,0)};function it(i,t,e=0,n=0,s=0,r=1,a=r,o=r){const c=new kt(i,t);return c.position.set(e,n,s),c.scale.set(r,a,o),c.castShadow=!0,c}function Ti(i,t,e,n){const s=new C(...i),r=new C(...t),a=it(lt.cyl,n);return a.position.copy(s).add(r).multiplyScalar(.5),a.scale.set(e,s.distanceTo(r),e),a.quaternion.setFromUnitVectors(new C(0,1,0),r.clone().sub(s).normalize()),a}function G_(i,t){const e=new zt,n=it(new nn(i,i*1.05,.09,28),_t("#262422"),0,.045,0);n.receiveShadow=!0;const s=it(new nn(i*.96,i*.96,.012,28),_t("#4c5e2c",{flatShading:!1}),0,.094,0);s.receiveShadow=!0;const r=it(new Sn(i*1.02,.028,4,32).rotateX(Math.PI/2),_t(t,{emissive:t,emissiveIntensity:.35}),0,.07,0);e.add(n,s,r);for(let a=0;a<Math.round(i*9);a++){const o=Math.random()*6,c=Math.sqrt(Math.random())*i*.85;e.add(it(lt.cone,_t("#6a8a3a"),Math.cos(o)*c,.13,Math.sin(o)*c,.035,.08,.035))}return e}function V_(i,t,e,n,s=8,r=40){const a=new Ba(i.map(f=>new C(...f))),o=a.computeFrenetFrames(r,!1),c=[],h=[];for(let f=0;f<=r;f++){const d=f/r,g=a.getPointAt(d),_=t+(e-t)*Math.pow(d,.6),m=o.normals[f],p=o.binormals[f];for(let v=0;v<=s;v++){const x=v/s*Math.PI*2,M=Math.cos(x),R=Math.sin(x);c.push(g.x+_*(M*m.x+R*p.x),g.y+_*(M*m.y+R*p.y),g.z+_*(M*m.z+R*p.z))}}for(let f=0;f<r;f++)for(let d=0;d<s;d++){const g=f*(s+1)+d,_=g+s+1;h.push(g,_,g+1,_,_+1,g+1)}const l=new Ee;l.setAttribute("position",new ne(c,3)),l.setIndex(h),l.computeVertexNormals();const u=new kt(l,n);return u.castShadow=!0,u}function us({fur:i="#c96a2d",belly:t="#f1dcb5",hat:e="acorn",hatColor:n="#6e4a2a",tailUp:s=1}={}){const r=new zt,a=new zt;r.add(a);const o=_t(i),c=_t(t),h=_t("#1b1410");for(const p of[-1,1])a.add(it(lt.ico,o,p*.1,.05,.07,.08,.045,.13)),a.add(it(lt.ico,o,p*.12,.17,-.02,.14));a.add(it(lt.ico,o,0,.38,0,.21,.28,.19)),a.add(it(lt.ico,c,0,.36,.1,.14,.2,.09));const l=new zt;l.position.set(0,.72,.05),a.add(l),l.add(it(lt.ico,o,0,0,0,.17)),l.add(it(lt.ico,c,0,-.05,.12,.09,.075,.08)),l.add(it(lt.sph,h,0,-.02,.2,.028));for(const p of[-1,1]){l.add(it(lt.sph,h,p*.075,.04,.13,.034)),l.add(it(lt.sph,_t("#ffffff"),p*.068,.055,.155,.01));const v=it(lt.cone,o,p*.09,.16,-.02,.05,.13,.04);v.rotation.z=-p*.25,l.add(v);const x=it(lt.cone,_t(qs(i,-.25)),p*.1,.25,-.02,.025,.07,.02);x.rotation.z=-p*.3,l.add(x)}if(e==="acorn"){const p=it(lt.cap,_t(n),0,.07,0,.19,.13,.19);l.add(p),l.add(it(lt.cyl,_t(qs(n,-.2)),0,.22,0,.02,.06,.02))}const u=new zt;u.position.set(0,.22,-.18),a.add(u);const f=new Ba([[0,0,0],[0,.2,-.26],[0,.55*s,-.32],[0,.82*s,-.22],[0,.93*s,-.02]].map(p=>new C(...p))),d=_t(qs(i,.08)),g=_t(qs(i,.2)),_=12;for(let p=0;p<_;p++){const v=p/(_-1),x=.085+Math.sin(Math.min(1,v*1.15)*Math.PI)*.11,M=f.getPointAt(v);u.add(it(lt.ico,v>.75?g:d,M.x,M.y,M.z,x,x*1.1,x))}const m=[];for(const p of[-1,1]){const v=new zt;v.position.set(p*.17,.52,.04),v.add(it(lt.ico,o,0,-.1,0,.05,.12,.05));const x=new zt;x.position.set(0,-.21,0),x.add(it(lt.ico,o,0,0,0,.045)),v.add(x),v.userData.hand=x,v.rotation.x=-.9,a.add(v),m.push(v)}return r.userData.anim={kind:"squirrel",body:a,tail:u,head:l,armL:m[0],armR:m[1]},r}function fs({scale:i="#3f8f4a",belly:t="#d9cf86",hood:e=null,hoodSize:n=1,long:s=!1,thick:r=1}={}){const a=new zt,o=new zt;a.add(o);const c=_t(i),h=_t(t);let l;if(s)l=[[.05,.05,-.9],[-.18,.06,-.62],[.16,.07,-.34],[-.06,.1,-.08],[0,.26,.02],[0,.4,.03]];else{l=[];for(let _=0;_<=10;_++){const m=_/10,p=-.6+m*Math.PI*2.3,v=.3-m*.17;l.push([Math.cos(p)*v,.06+m*.1,Math.sin(p)*v-.04])}l.push([0,.3,.02],[0,.42,.03])}o.add(V_(l,.025,.115*r,c));const u=it(new Ha(.12*r,.2,3,8),c,0,.53,.04);u.rotation.x=.12,o.add(u),o.add(it(lt.ico,h,0,.5,.12*r,.085*r,.17,.05));const f=new zt;if(f.position.set(0,.79,.08),o.add(f),e){const _=it(lt.ico,_t(e),0,-.02,-.07,.21*n,.24*n,.05);f.add(_);for(const m of[-1,1])f.add(it(lt.sph,_t(t),m*.08*n,.02,-.12,.035*n,.035*n,.01))}f.add(it(lt.ico,c,0,0,.02,.11,.09,.15)),f.add(it(lt.ico,h,0,-.04,.06,.08,.04,.11));for(const _ of[-1,1])f.add(it(lt.sph,_t("#ffd23a",{emissive:"#b08000",emissiveIntensity:.4}),_*.065,.035,.09,.03)),f.add(it(lt.sph,_t("#111111"),_*.079,.037,.1,.008,.024,.012));const d=new zt;d.position.set(0,-.03,.16);for(const _ of[-1,1]){const m=it(lt.cyl,_t("#d0304a"),_*.012,0,.05,.008,.1,.008);m.rotation.x=Math.PI/2,m.rotation.z=_*.3,d.add(m)}d.scale.setScalar(.001),f.add(d);const g=[];for(const _ of[-1,1]){const m=new zt;m.position.set(_*.15*r,.64,.05),m.add(it(lt.ico,c,0,-.1,0,.045*r,.12,.045*r));const p=new zt;p.position.set(0,-.21,0),p.add(it(lt.ico,c,0,0,0,.042*r)),m.add(p),m.userData.hand=p,m.rotation.x=-.9,o.add(m),g.push(m)}return a.userData.anim={kind:"naga",body:o,head:f,tongue:d,armL:g[0],armR:g[1]},a}const $s=()=>_t("#7a5232");function W_(i=1.1,t="#c9a24a"){const e=new zt;return e.add(it(lt.cyl,$s(),0,0,0,.022,i,.022)),e.add(it(lt.cone,Ye(t),0,i/2+.07,0,.04,.14,.04)),e}function Ql(i,t,e){const n=new zt,s=it(lt.cyl,t,0,0,0,i,.04,i);return s.rotation.x=Math.PI/2,n.add(s),n.add(it(lt.sph,e,0,0,.03,i*.25,i*.25,i*.15)),n}const qs=(i,t)=>{const e=new $t(i),n={};return e.getHSL(n),e.setHSL(n.h,n.s,Math.max(0,Math.min(1,n.l+t))),"#"+e.getHexString()};function qn(i,t,e=.9){i.userData.hand.add(t),t.rotation.x=e}function th(i,t,e,n){const s=new zt,r=it(lt.cyl,_t("#5a3a22"),0,0,0,i,.1,i);r.rotation.z=Math.PI/2;const a=it(lt.cyl,Ye("#444"),0,0,0,i*.3,.13,i*.3);return a.rotation.z=Math.PI/2,s.add(r,a),s.position.set(t,e,n),s}const X_={nutkin(){const i=us({fur:"#cf6d2a",hatColor:"#6a4a26"}),t=i.userData.anim,e=it(lt.cone,_t("#5f8f2e"),0,.45,-.06,.25,.42,.2);e.rotation.x=.15,t.body.add(e);const n=new zt;return n.add(Ti([0,-.08,0],[0,.04,0],.018,$s())),n.add(Ti([0,.04,0],[-.05,.13,0],.014,$s())),n.add(Ti([0,.04,0],[.05,.13,0],.014,$s())),qn(t.armR,n,1.4),t.armR.rotation.x=-1.3,i},grenadier(){const i=us({fur:"#a9552a",hatColor:"#4f3a22"}),t=i.userData.anim,e=it(new Sn(.21,.025,4,16),_t("#4a3020"),0,.4,.02);e.rotation.set(.1,0,.75),e.scale.z=.8,t.body.add(e);for(let s=0;s<4;s++){const r=-.7+s*.45;t.body.add(it(lt.sph,_t("#8a5a2a"),Math.sin(r)*.21*.7,.4+Math.cos(r)*.21*.7,.17,.045,.055,.045))}for(const s of[-1,1])t.head.add(it(new Sn(.04,.012,4,10),Ye("#c9a24a"),s*.07,.07,.14));const n=new zt;return n.add(it(lt.sph,_t("#8a5a2a"),0,0,0,.06,.07,.06)),n.add(it(lt.cap,_t("#4f3a22"),0,.03,0,.065,.04,.065)),n.add(it(lt.sph,wi("#ffb030"),0,.1,0,.022)),qn(t.armR,n,0),t.armR.rotation.x=2.3,i},oakguard(){const i=us({fur:"#8a5a35",hatColor:"#5a3c22"}),t=i.userData.anim;t.body.add(it(lt.ico,_t("#5b4330"),0,.42,.05,.2,.22,.16));const e=it(lt.cone,_t("#c0302a"),0,.3,-.05,.03,.18,.08);e.rotation.x=-.5,t.head.add(e);const n=Ql(.22,_t("#6b4a2e"),_t("#3e7a2a"));qn(t.armL,n,.9),n.position.set(-.02,0,.08),t.armL.rotation.set(-.6,0,.3);const s=new zt;return s.add(it(lt.cyl,$s(),0,.2,0,.022,1.15,.022)),s.add(it(lt.box,Ye("#a8b0b8"),.07,.62,0,.12,.16,.02)),s.add(it(lt.cone,_t("#6b4a26"),0,.85,0,.06,.18,.06)),qn(t.armR,s,.9),i},glider(){const i=us({fur:"#9a8a78",belly:"#efe5d5",hat:"none",tailUp:.25}),t=i.userData.anim;for(const n of[-1,1])t.head.add(it(new Sn(.045,.015,4,10),Ye("#c9a24a"),n*.07,.07,.14));t.head.add(it(lt.cap,_t("#6b4a2e"),0,.06,-.01,.18,.11,.18)),t.armL.rotation.set(-.2,0,-1.25),t.armR.rotation.set(-.2,0,1.25);const e=_t(qs("#9a8a78",-.12),{side:pn});for(const n of[-1,1]){const s=new Ee;s.setAttribute("position",new ne([n*.15,.52,.02,n*.42,.45,.02,n*.2,.1,0,n*.15,.52,.02,n*.2,.1,0,n*.12,.25,0],3)),s.computeVertexNormals();const r=new kt(s,e);r.castShadow=!0,t.body.add(r)}return t.body.position.y=.7,t.body.rotation.x=.55,t.lift=.7,i.add(it(lt.cyl,_t("#cfe8ff",{transparent:!0,opacity:.35}),0,.42,0,.025,.66,.025)),t.tail.rotation.x=-.6,i},trebuchet(){const i=new zt,t=new zt;i.add(t);const e=_t("#7a5232"),n=_t("#5f3e24");for(const h of[-1,1])t.add(it(lt.box,n,h*.38,.2,0,.1,.1,1.6)),t.add(Ti([h*.38,.2,-.55],[h*.38,1.25,0],.045,e)),t.add(Ti([h*.38,.2,.55],[h*.38,1.25,0],.045,e));t.add(it(lt.box,n,0,.2,.6,.86,.08,.1)),t.add(it(lt.box,n,0,.2,-.6,.86,.08,.1));const s=it(lt.cyl,Ye("#555"),0,1.25,0,.04,.9,.04);s.rotation.z=Math.PI/2,t.add(s);const r=[];for(const h of[-1,1])for(const l of[-.6,.6]){const u=th(.17,h*.5,.17,l);t.add(u),r.push(u)}const a=new zt;a.position.set(0,1.25,0),a.add(it(lt.box,e,0,0,.35,.08,.08,1.7));const o=it(lt.box,n,0,-.18,-.45,.32,.3,.3);a.add(o);for(let h=0;h<5;h++)a.add(it(lt.sph,_t("#8a5a2a"),(Math.random()-.5)*.2,-.02,-.45+(Math.random()-.5)*.2,.06));const c=it(lt.cone,_t("#6b4a26"),0,0,1.25,.11,.24,.11);c.rotation.x=Math.PI/2,a.add(c),a.add(it(lt.sph,wi("#ff8a2a"),0,.06,1.25,.05)),a.rotation.x=.75,a.rotation.y=Math.PI,t.add(a);for(const h of[-1,1]){const l=us({fur:"#c96a2d"});l.scale.setScalar(.72),l.position.set(h*.72,.05,-.25),l.rotation.y=-h*.5,l.userData.anim.armR.rotation.x=-2.2,t.add(l)}a.userData.keep=!0;for(const h of r)h.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:r,throwArm:a,rest:.75},i},elder(){const i=us({fur:"#a9a197",belly:"#f4efe6",hat:"none"}),t=i.userData.anim;i.scale.setScalar(1.28);const e=it(new zn(.3,.55,10,1,!0),_t("#5a6b34",{side:pn}),0,.3,0);t.body.add(e),t.head.add(it(lt.cone,_t("#f4efe6"),0,-.14,.15,.06,.16,.04).rotateX(Math.PI));for(let s=0;s<7;s++){const r=s/7*Math.PI*2,a=it(lt.cone,_t(s%2?"#d08a2c":"#6aa646"),Math.cos(r)*.15,.12,Math.sin(r)*.15,.035,.12,.02);a.rotation.set(Math.sin(r)*.4,0,-Math.cos(r)*.4),t.head.add(a)}const n=new zt;n.add(it(lt.cyl,_t("#5a3d24"),0,.25,0,.025,1,.025)),n.add(it(lt.oct,wi("#7dff8a"),0,.82,0,.07,.11,.07));for(let s=0;s<3;s++){const r=s/3*Math.PI*2;n.add(Ti([0,.7,0],[Math.cos(r)*.07,.86,Math.sin(r)*.07],.012,_t("#5a3d24")))}return qn(t.armL,n,.9),t.armL.rotation.x=-.6,t.gem=n.children[1],t.gem.userData.keep=!0,i},scaleguard(){const i=fs({scale:"#3f8f4a",belly:"#d9cf86"}),t=i.userData.anim;t.head.add(it(lt.cap,Ye("#b8862e"),0,.04,.01,.12,.09,.15)),t.head.add(it(lt.box,Ye("#b8862e"),0,.12,-.02,.015,.06,.18)),qn(t.armR,W_(1.15),.9);const e=Ql(.2,Ye("#a8762a"),Ye("#e0b050"));return qn(t.armL,e,.9),e.position.z=.06,t.armL.rotation.set(-.7,0,.35),i},spitter(){const i=fs({scale:"#2f8f86",belly:"#e0d890",hood:"#5a2f7a",hoodSize:1.45}),t=i.userData.anim;return t.head.add(it(lt.sph,wi("#8aff5a"),0,-.04,.16,.035)),t.body.add(it(lt.ico,_t("#7a8a3a"),.17,.38,.05,.08,.1,.08)),t.body.add(it(lt.sph,wi("#8aff5a"),.17,.48,.05,.03)),t.armL.rotation.x=-.5,t.armR.rotation.x=-.5,i},sidewinder(){const i=fs({scale:"#c2a061",belly:"#efe0b0",long:!0}),t=i.userData.anim;for(let e=0;e<6;e++)t.body.add(it(lt.oct,_t("#6b4a2a"),0,.12+e*.07,-.05-e*.02,.04,.03,.04));for(const e of[-1,1]){const n=it(lt.cone,_t("#8a6a3a"),e*.06,.08,.05,.02,.07,.02);n.rotation.z=-e*.4,t.head.add(n);const s=it(new Sn(.13,.014,4,12,Math.PI*.9),Ye("#c8ccd0"),0,.08,.08);s.rotation.y=Math.PI/2,qn(e<0?t.armL:t.armR,s,.4)}return t.armL.rotation.set(-1.3,0,.3),t.armR.rotation.set(-1.3,0,-.3),t.body.rotation.x=.12,i},brute(){const i=fs({scale:"#4f6e2a",belly:"#c8b870",thick:1.35}),t=i.userData.anim;i.scale.setScalar(2.15);for(let e=0;e<7;e++){const n=it(lt.cone,_t("#e8dcc0"),0,.45+e*.06,-.12-(e<3?0:(e-3)*.01),.02,.07,.02);n.rotation.x=-1.1,t.body.add(n)}for(const e of[-1,1]){const n=it(lt.cone,_t("#e8dcc0"),e*.07,.08,-.03,.025,.12,.025);n.rotation.set(-.6,0,-e*.6),t.head.add(n),t.body.add(it(new Sn(.06,.015,4,10).rotateX(Math.PI/2),Ye("#b8862e"),e*.2,.5,.05))}return t.armL.rotation.set(-1.2,0,.5),t.armR.rotation.set(-1.2,0,-.5),i},engine(){const i=new zt,t=new zt;i.add(t);const e=_t("#4a3a2a"),n=_t("#3a2c20");t.add(it(lt.box,e,0,.36,0,.8,.22,1.35));const s=[];for(const c of[-1,1])for(const h of[-.45,.45]){const l=th(.21,c*.47,.21,h);t.add(l),s.push(l)}const r=it(lt.ico,_t("#d8cfb0"),0,.55,.78,.2,.16,.28);t.add(r);for(const c of[-1,1])t.add(it(lt.cone,_t("#f4ecd8"),c*.09,.43,.92,.025,.12,.025).rotateX(Math.PI)),t.add(it(lt.sph,wi("#8aff5a"),c*.1,.62,.88,.035));for(const c of[-1,1])t.add(Ti([c*.3,.45,-.3],[c*.2,1.05,-.1],.04,n));const a=new zt;a.position.set(0,1.05,-.1),a.add(it(lt.box,e,0,0,.35,.08,.08,.9)),a.add(it(lt.cap,n,0,.02,.8,.14,.08,.14).rotateX(Math.PI));const o=it(lt.sph,_t("#7dff5a",{emissive:"#4ad02a",emissiveIntensity:1.1,transparent:!0,opacity:.85,roughness:.15}),0,.12,.8,.14);o.userData.keep=!0,a.add(o),a.rotation.x=-.55,t.add(a);for(let c=0;c<3;c++)t.add(it(lt.sph,_t("#7dff5a",{emissive:"#3ab02a",emissiveIntensity:.9}),-.2+c*.2,.55,-.55,.08));for(const c of[-1,1]){const h=fs({scale:"#3f8f4a",belly:"#d9cf86"});h.scale.setScalar(.72),h.position.set(c*.72,.05,-.35),h.rotation.y=-c*.5,t.add(h)}a.userData.keep=!0;for(const c of s)c.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:s,throwArm:a,rest:-.55,globe:o},i},hierophant(){const i=fs({scale:"#5e3a8c",belly:"#e6c870",hood:"#3a2060",hoodSize:1.7}),t=i.userData.anim;i.scale.setScalar(1.32);for(let n=0;n<5;n++){const s=(n/4-.5)*1.6,r=it(lt.cone,Ye("#e0b040"),Math.sin(s)*.1,.12+Math.cos(s)*.04,-.02,.02,.12,.02);r.rotation.z=-s*.5,t.head.add(r)}for(const n of[-1,1])t.body.add(it(new Sn(.05,.014,4,10).rotateX(Math.PI/2),Ye("#e0b040"),n*.15,.45,.05));const e=new zt;return e.add(it(lt.cyl,_t("#2a1a40"),0,.25,0,.022,1,.022)),e.add(it(lt.sph,wi("#c070ff"),0,.82,0,.08)),e.add(it(new Sn(.1,.012,4,14),Ye("#e0b040"),0,.82,0)),qn(t.armL,e,.9),t.armL.rotation.x=-.6,t.gem=e.children[1],t.gem.userData.keep=!0,i}};function $_(i,t,e){const n=new zt;n.add(G_(t.base,e));const s=X_[i]();return s.position.y=t.big?.09:.06,s.userData.y0=s.position.y,n.add(s),n.userData.fig=s,n.userData.anim=s.userData.anim,n.userData.phase=Math.random()*10,Ea(n.children[0]),Ea(s),n.traverse(r=>{r.isMesh&&(r.castShadow=!0)}),n}const ha=new Map;function q_(i){return[i.metalness,i.roughness,i.emissiveIntensity>0?i.emissive.getHex():0,i.emissiveIntensity,i.transparent,i.opacity,i.side,i.flatShading].join("|")}function Ea(i){i.updateMatrixWorld(!0);const t=new ae().copy(i.matrixWorld).invert(),e=new ae,n=new Map,s=[],r=a=>{for(const o of a.children){if(o.userData.keep){Ea(o);continue}if(o.isMesh){const c=o.material,h=q_(c);n.has(h)||n.set(h,{m:c,geos:[]});const l=o.geometry.index?o.geometry.toNonIndexed():o.geometry,u=new Ee;u.setAttribute("position",l.getAttribute("position").clone()),u.setAttribute("normal",l.getAttribute("normal").clone()),u.applyMatrix4(e.multiplyMatrices(t,o.matrixWorld));const f=u.getAttribute("position").count,d=new Float32Array(f*3);for(let g=0;g<f;g++)d.set([c.color.r,c.color.g,c.color.b],g*3);u.setAttribute("color",new hn(d,3)),n.get(h).geos.push(u),s.push(o)}r(o)}};r(i);for(const a of s)a.parent.remove(a);for(const[a,{m:o,geos:c}]of n)ha.has(a)||ha.set(a,new Tn({vertexColors:!0,metalness:o.metalness,roughness:o.roughness,flatShading:o.flatShading,emissive:o.emissive,emissiveIntensity:o.emissiveIntensity,transparent:o.transparent,opacity:o.opacity,side:o.side})),i.add(new kt(H_(c),ha.get(a)))}const ni={nutkin:"shooter",grenadier:"shooter",oakguard:"melee",glider:"raider",trebuchet:"artillery",elder:"hero",scaleguard:"line",spitter:"shooter",sidewinder:"melee",brute:"melee",engine:"artillery",hierophant:"hero"},Ps=["melee","raider","line","shooter","hero","artillery"];async function Jh(i,t,e){e==="move"?await Y_(i,t):e==="shoot"?await j_(i,t):e==="charge"&&await K_(i,t)}const Zh=i=>i.t.pts*i.alive/i.t.models;function Ni(i,t){return i.t.melee?eo(i.alive*i.t.A,nr(i.t.WS,i.mesmerized?1:0),i.t.melee,t,!1).value:0}function Qh(i,t,e,n,s){var h;const r=t.t.ranged;if(!r||Math.hypot(e.pos.x-n.x,e.pos.z-n.z)-t.r-e.r>r.range||i.isEngaged(e)&&!r.spell)return 0;const o=i.sight(t,e,n);if(!o.visible&&!r.indirect&&!r.mesmerize)return 0;if(r.mesmerize)return o.visible?Fi(r.spell)*(Zh(e)*.25+Math.min(2,e.alive)*e.t.pts*.08+((h=e.t.ranged)!=null&&h.blast?8:0)):0;let c=0;if(r.heavy&&s&&c++,r.indirect&&!o.visible&&c++,r.blast){const l=r.spell?Fi(r.spell):Gr(nr(t.t.BS,c)),u=e.t.big?3:Math.max(1,Math.min(e.alive,Math.round(e.alive*Math.min(1,r.blast*r.blast/(e.r*e.r))*.8)));return Rs(t,r,!1)*l*eo(u,1,r,e,o.cover).value}return eo(Rs(t,r,!1),nr(t.t.BS,c),r,e,o.cover).value}async function Y_(i,t){const e=i.units.filter(s=>s.side===t&&i.alive(s));e.sort((s,r)=>Ps.indexOf(ni[s.key])-Ps.indexOf(ni[r.key]));const n=new Set;for(const s of e){if(!i.alive(s)||s.flags.moved)continue;const r=ni[s.key];if(i.isEngaged(s)){const l=i.engagedWith(s),u=l.reduce((m,p)=>m+Ni(p,s),0),f=l.reduce((m,p)=>Math.max(m,Ni(s,p)),0);if(r==="melee"||r==="line"||f>=u*.8)continue;const d=i.movePlan(s);let g=-1,_=-1/0;for(let m=0;m<i.nav.N;m+=2){if(!i.validEnd(d,m))continue;const p=i.nav.x(m),v=i.nav.z(m),x=Math.min(...i.enemiesOf(s).map(M=>Math.hypot(M.pos.x-p,M.pos.z-v)-M.r));x>_&&(_=x,g=m)}g>=0&&(i.focus(s.pos.x,s.pos.z),await i.doMove(s,g,d));continue}let a=i.movePlan(s),o=eh(i,s,a,n);const c=Math.min(...i.enemiesOf(s).map(l=>i.gap(s,l)));let h=!1;if(r==="melee"||r==="line"||r==="raider"?h=c>s.t.M+8&&!(r==="line"&&o.onObjective)&&!(r==="raider"&&o.canShoot):r==="shooter"&&(h=!o.canShoot&&!o.onObjective&&(s.t.ranged.assault||c>s.t.ranged.range+s.t.M+3)),h){i.focus(s.pos.x,s.pos.z);const l=await i.doAdvance(s);a=i.movePlan(s,l);const u=eh(i,s,a,n);u.cell>=0&&(o=u)}o.obj>=0&&n.add(o.obj),o.cell>=0&&o.dist>.4?(i.focus(s.pos.x,s.pos.z),await i.doMove(s,o.cell,a)):s.flags.advanced&&(s.flags.moved=!0),await Xe(.05)}}function eh(i,t,e,n){const{nav:s}=i,r=i.enemiesOf(t),a=i.friendsOf(t),o=i.objectives.map(d=>i.controlOf(d)),c=ni[t.key],h={enemies:r,friends:a,owners:o,claimed:n,role:c};let l={cell:-1,score:nh(i,t,t.pos.x,t.pos.z,h,!1),dist:0,...h.last};const u=t.t.M>8?3:2,f=e.res;for(let d=0;d<s.nz;d+=u)for(let g=d/u%2?1:0;g<s.nx;g+=u){const _=d*s.nx+g;if(!isFinite(f.dist[_])||!i.validEnd(e,_))continue;const m=s.x(_),p=s.z(_),v=nh(i,t,m,p,h,!0)+Math.random()*.05;v>l.score&&(l={cell:_,score:v,dist:Math.hypot(m-t.pos.x,p-t.pos.z),...h.last})}return l}function nh(i,t,e,n,s,r){const{enemies:a,friends:o,owners:c,claimed:h,role:l}=s,u=t.t,f={x:e,z:n},d=r&&Math.hypot(e-t.pos.x,n-t.pos.z)>.3;let g=0,_=!1,m=-1;if(u.OC>0){const M=l==="line"||l==="shooter"?5:l==="melee"?2:2.5;let R=0;for(const E of i.objectives){const A=Math.hypot(E.x-e,E.z-n),U=c[E.i]===t.side?.45:1,y=h.has(E.i)?.25:1;let w;A<=2.6?w=M*U*y*1.4:w=M*U*y*Math.max(0,1-(A-2.6)/16)*.7,w>R&&(R=w,A<=2.6?(_=!0,m=E.i):_||(m=-1))}g+=R}let p=!1;if(u.ranged&&l!=="melee"){let M=0;for(const E of a){const A=Qh(i,t,E,f,d);A>M&&(M=A)}M>0&&(p=!0),g+=M*(l==="artillery"?.25:l==="hero"?.12:.18)*(t.flags.advanced&&!u.ranged.assault?0:1)}if(l==="melee"||l==="line"||l==="raider"||l==="hero"){let M=0;for(const E of a){const A=Math.hypot(E.pos.x-e,E.pos.z-n)-t.r-E.r;if(A>co)continue;const U=A<=1?1:Fi(Math.ceil(A)),y=Ni(E,t)*.4,w=U*(Ni(t,E)-y+(E.t.role==="Artillery"?10:0));w>M&&(M=w)}if(g+=M*(l==="melee"?.3:l==="raider"?.18:l==="hero"?.06:.15),M===0&&l!=="hero"){const E=Math.min(...a.map(A=>Math.hypot(A.pos.x-e,A.pos.z-n)));g-=E*(l==="melee"?.12:.05)}}const v=l==="shooter"||l==="artillery"||l==="hero";for(const M of a){const R=Math.hypot(M.pos.x-e,M.pos.z-n)-t.r-M.r;(!M.t.ranged||M.t.wrecker||M.key==="sidewinder"||M.key==="oakguard")&&R<M.t.M+7&&(g-=Ni(M,t)*(v?.16:.05)*(1-R/(M.t.M+7)))}const x=i.nav.index(e,n);if(x>=0&&i.nav.cover[x]&&(g+=v?1.5:.5),l==="artillery"&&d&&(g-=2.5),l==="hero"){let M=0;for(const E of o)Math.hypot(E.pos.x-e,E.pos.z-n)<=to+E.r&&M++;g+=Math.min(3,M)*.9;const R=Math.min(...a.map(E=>Math.hypot(E.pos.x-e,E.pos.z-n)));R<8&&(g-=(8-R)*.6)}for(const M of o){const R=Math.hypot(M.pos.x-e,M.pos.z-n)-M.r-t.r;R<1.5&&(g-=(1.5-R)*.6)}return s.last={onObjective:_,obj:m,canShoot:p},g}async function j_(i,t){const e=i.units.filter(n=>n.side===t&&i.canShoot(n));e.sort((n,s)=>Ps.indexOf(ni[s.key])-Ps.indexOf(ni[n.key]));for(const n of e){if(!i.canShoot(n))continue;const s=i.shootTargets(n);let r=null,a=.4;for(const o of s){let c=Qh(i,n,o,n.pos,n.flags.moved);const h=n.t.ranged;if(h.blast)for(const l of i.units){if(l.side!==n.side||!i.alive(l))continue;const u=Math.hypot(l.pos.x-o.pos.x,l.pos.z-o.pos.z)-l.r;u<h.blast+2.5&&(c-=Zh(l)*.25*(1-Math.max(0,u)/(h.blast+2.5)))}h.mesmerize&&o.mesmerized&&(c*=.2),c>a&&(a=c,r=o)}r&&(i.focus((n.pos.x+r.pos.x)/2,(n.pos.z+r.pos.z)/2),await i.doShoot(n,r),await Xe(.1))}}async function K_(i,t){const e=i.units.filter(n=>n.side===t&&i.canCharge(n));e.sort((n,s)=>Ps.indexOf(ni[n.key])-Ps.indexOf(ni[s.key]));for(const n of e){if(!i.canCharge(n))continue;const s=ni[n.key];let r=null,a=0;for(const o of i.chargeTargets(n)){const c=i.chargePlan(n,o);if(!c)continue;const h=Fi(c.need),l=Ni(n,o)+(o.t.role==="Artillery"?12:0)+(o.alive<=2?6:0),u=Ni(o,n);if(h<(s==="melee"?.25:s==="line"?.33:s==="raider"?.4:s==="hero"?.5:.6)||(s==="shooter"||s==="hero")&&l<u*1.4)continue;const d=h*(l-u*.4);d>a&&(a=d,r=o)}r&&(i.focus((n.pos.x+r.pos.x)/2,(n.pos.z+r.pos.z)/2),await i.doCharge(n,r,{auto:!0}),await Xe(.1))}}let Ke=null,ys=null,Kn=!1;try{Kn=localStorage.getItem("tails-and-scales:muted")==="1"}catch{}function lo(){if(!Ke)try{Ke=new(window.AudioContext||window.webkitAudioContext),ys=Ke.createGain(),ys.gain.value=Kn?0:.5,ys.connect(Ke.destination)}catch{Ke=null}}function J_(){Kn=!Kn;try{localStorage.setItem("tails-and-scales:muted",Kn?"1":"0")}catch{}return ys&&(ys.gain.value=Kn?0:.5),Kn}const Z_=()=>Kn;function Q_(i){const t=Math.floor(Ke.sampleRate*i),e=Ke.createBuffer(1,t,Ke.sampleRate),n=e.getChannelData(0);for(let r=0;r<t;r++)n[r]=Math.random()*2-1;const s=Ke.createBufferSource();return s.buffer=e,s}function tu(i,t,e,n,s){const r=Ke.createGain();return r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(n,t+e),r.gain.exponentialRampToValueAtTime(1e-4,t+s),i.connect(r),r.connect(ys),r}function ds({dur:i=.3,freq:t=800,type:e="lowpass",peak:n=.5,delay:s=0,q:r=1}){const a=Ke.currentTime+s,o=Q_(i),c=Ke.createBiquadFilter();c.type=e,c.frequency.value=t,c.Q.value=r,o.connect(c),tu(c,a,.005,n,i),o.start(a)}function Ai({f0:i=440,f1:t=i,dur:e=.15,type:n="sine",peak:s=.2,delay:r=0}){const a=Ke.currentTime+r,o=Ke.createOscillator();o.type=n,o.frequency.setValueAtTime(i,a),o.frequency.exponentialRampToValueAtTime(Math.max(20,t),a+e),tu(o,a,.01,s,e),o.start(a),o.stop(a+e+.05)}const tv={dice(i=3){for(let t=0;t<Math.min(6,i);t++)ds({dur:.04,freq:2500+Math.random()*2e3,type:"bandpass",q:4,peak:.35,delay:t*.035+Math.random()*.02})},boom(i=1){ds({dur:.5+i*.5,freq:300+200/i,peak:.8}),Ai({f0:90,f1:30,dur:.5+i*.3,type:"sine",peak:.5})},shot(){Ai({f0:900,f1:300,dur:.08,type:"triangle",peak:.12})},thwack(){ds({dur:.07,freq:1400,type:"bandpass",q:2,peak:.4})},squeak(){Ai({f0:1400,f1:2400,dur:.12,type:"sine",peak:.12})},hiss(){ds({dur:.35,freq:5e3,type:"highpass",peak:.18})},crumble(){ds({dur:.8,freq:500,peak:.45});for(let i=0;i<4;i++)ds({dur:.05,freq:1200,type:"bandpass",peak:.25,delay:.1+i*.09})},magic(){for(let i=0;i<4;i++)Ai({f0:500+i*220,f1:900+i*300,dur:.25,type:"sine",peak:.08,delay:i*.06})},fizzle(){Ai({f0:600,f1:120,dur:.35,type:"sawtooth",peak:.06})},fanfare(){[523,659,784,1046].forEach((i,t)=>Ai({f0:i,dur:.3,type:"triangle",peak:.15,delay:t*.14}))},click(){Ai({f0:1200,f1:900,dur:.04,type:"square",peak:.04})}},Ce=new Proxy(tv,{get(i,t){return(...e)=>{if(!(!Ke||Kn))try{i[t](...e)}catch{}}}}),{W:he,H:Re}=In,Ct=i=>document.querySelector(i),cr=new URLSearchParams(location.search),Ze=new Hh({antialias:!0});Ze.setPixelRatio(cr.has("lowfi")?.5:Math.min(devicePixelRatio,2));Ze.setSize(innerWidth,innerHeight);Ze.shadowMap.enabled=!cr.has("lowfi");Ze.shadowMap.type=uh;Ze.toneMapping=fh;Ze.toneMappingExposure=1.05;document.body.prepend(Ze.domElement);const re=new jg;re.background=new $t("#1c1712");re.fog=new Ua("#1c1712",70,140);const de=new cn(40,innerWidth/innerHeight,.1,400);de.position.set(0,30,31);const ze=new M_(de,Ze.domElement);ze.target.set(0,0,1.5);ze.enableDamping=!0;ze.dampingFactor=.08;ze.maxPolarAngle=1.32;ze.minDistance=5;ze.maxDistance=75;ze.screenSpacePanning=!1;ze.mouseButtons={LEFT:jn.ROTATE,MIDDLE:jn.DOLLY,RIGHT:jn.PAN};re.add(new d_("#d6e6ff","#3b2a1a",.85));const Vi=new Yh("#fff0d6",2.3);Vi.position.set(-16,34,20);Vi.castShadow=!0;Vi.shadow.mapSize.set(2048,2048);Object.assign(Vi.shadow.camera,{left:-27,right:27,top:22,bottom:-22,near:5,far:90});Vi.shadow.bias=-4e-4;Vi.shadow.normalBias=.02;re.add(Vi);const eu=new Yh("#9fb8ff",.35);eu.position.set(18,12,-16);re.add(eu);const nu=Ct("#labels"),se=new k_(re,de,nu);function ev(){const i=document.createElement("canvas");i.width=2048,i.height=Math.round(2048*Re/he);const t=i.getContext("2d");t.fillStyle="#5b7a36",t.fillRect(0,0,i.width,i.height);const e=(s,r,a,o,c)=>{for(let h=0;h<r;h++)t.globalAlpha=c*(.4+Math.random()*.6),t.fillStyle=s[Math.random()*s.length|0],t.beginPath(),t.ellipse(Math.random()*i.width,Math.random()*i.height,a+Math.random()*(o-a),a+Math.random()*(o-a),Math.random()*3,0,Math.PI*2),t.fill()};e(["#6a8a40","#4f6c2c","#729347","#55742f","#7f964c"],700,20,90,.35),e(["#7d6b45","#6e5d3a","#8a7650"],40,30,110,.22),e(["#8fa65a","#a4b46a"],300,4,14,.4);for(let s=0;s<14e3;s++)t.globalAlpha=.35,t.fillStyle=Math.random()<.5?"#3f5a24":"#8fae5a",t.fillRect(Math.random()*i.width,Math.random()*i.height,2,4+Math.random()*4);t.globalAlpha=1;const n=new Oa(i);return n.colorSpace=Ae,n.anisotropy=Ze.capabilities.getMaxAnisotropy(),n}function nv(){const i=document.createElement("canvas");i.width=i.height=512;const t=i.getContext("2d");t.fillStyle="#4a3020",t.fillRect(0,0,512,512);for(let n=0;n<260;n++){t.strokeStyle=Math.random()<.5?"rgba(30,18,10,0.35)":"rgba(110,70,40,0.25)",t.lineWidth=1+Math.random()*3;const s=Math.random()*512;t.beginPath(),t.moveTo(0,s);for(let r=0;r<=512;r+=32)t.lineTo(r,s+Math.sin(r*.02+n)*4);t.stroke()}const e=new Oa(i);return e.colorSpace=Ae,e.wrapS=e.wrapT=Xr,e.repeat.set(6,6),e}const iv=new Tn({map:ev(),roughness:.95}),Xa=new kt(new vi(he,Re).rotateX(-Math.PI/2),iv);Xa.receiveShadow=!0;re.add(Xa);const $a=new kt(new vi(220,220).rotateX(-Math.PI/2),new Tn({map:nv(),roughness:.7}));$a.position.y=-.62;$a.receiveShadow=!0;re.add($a);{const i=new Tn({color:"#5a3a22",roughness:.6}),t=[[he+1.6,.8,.8,0,-Re/2-.4],[he+1.6,.8,.8,0,Re/2+.4],[.8,.8,Re,-he/2-.4,0],[.8,.8,Re,he/2+.4,0]];for(const[n,s,r,a,o]of t){const c=new kt(new On(n,s,r),i);c.position.set(a,-.22,o),c.castShadow=c.receiveShadow=!0,re.add(c)}const e=new kt(new On(he,.6,Re),i);e.position.y=-.31,re.add(e)}const no=[];for(const i of[0,1]){const t=i===0?-1:1,e=new je({color:be[i].color,transparent:!0,opacity:.07,depthWrite:!1});no.push(e);const n=new kt(new vi(In.deploy,Re).rotateX(-Math.PI/2),e);n.position.set(t*(he/2-In.deploy/2),.008,0),n.renderOrder=1,re.add(n);const s=[];for(let a=-Re/2;a<Re/2;a+=1)s.push(new C(t*(he/2-In.deploy),.02,a),new C(t*(he/2-In.deploy),.02,a+.5));const r=new Zg(new Ee().setFromPoints(s),new Na({color:be[i].color,transparent:!0,opacity:.5}));re.add(r)}const ps=new Ks(new zn(.035,.13,3),new Tn({color:"#ffffff",roughness:1}),700),ms=new Ks(new Fn(.05,0),new Tn({roughness:.6}),140);re.add(ps,ms);function sv(){const i=new ae,t=new Nn,e=new Ds,n=new $t;for(let r=0;r<ps.count;r++){const a=(Math.random()-.5)*(he-.4),o=(Math.random()-.5)*(Re-.4),c=.6+Math.random()*1.2;t.setFromEuler(e.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5)),i.compose(new C(a,.08*c,o),t,new C(c,c,c)),ps.setMatrixAt(r,i),ps.setColorAt(r,n.set(["#9cba5a","#a8c464","#b4c86e","#8fae50"][r%4]))}const s=["#f4f0e0","#f2d14a","#d77ad0","#e8e8ff"];for(let r=0;r<ms.count;r++){const a=(Math.random()-.5)*(he-.4),o=(Math.random()-.5)*(Re-.4);i.compose(new C(a,.08,o),t.identity(),new C(1,.6,1)),ms.setMatrixAt(r,i),ms.setColorAt(r,n.set(s[r%s.length]))}ps.instanceMatrix.needsUpdate=ms.instanceMatrix.needsUpdate=!0,ps.instanceColor.needsUpdate=ms.instanceColor.needsUpdate=!0}const rv=[{x:0,z:0},{x:-9,z:8},{x:9,z:-8},{x:-9,z:-8},{x:9,z:8}],ir=rv.map((i,t)=>{const e=new zt;e.position.set(i.x,0,i.z);const n=new kt(new nn(.55,.65,.16,8),_t("#8a8478"));n.position.y=.08,n.castShadow=n.receiveShadow=!0;const s=new kt(new ao(.2,0),new Tn({color:"#fff3c0",emissive:"#ffd060",emissiveIntensity:.8,flatShading:!0}));s.position.y=.42;const r=new kt(new nn(.03,.03,2.1,6),_t("#5a3d24"));r.position.set(.35,1.1,0),r.castShadow=!0;const a=new Tn({color:"#e8e0d0",side:pn,roughness:.8}),o=new kt(new vi(.8,.5,6,1).translate(.4,0,0),a);o.position.set(.35,1.85,0),o.castShadow=!0;const c=new kt(new Gi(Zr-.06,Zr,64).rotateX(-Math.PI/2),new je({color:"#fff3c0",transparent:!0,opacity:.35,depthWrite:!1}));return c.position.y=.03,e.add(n,s,r,o,c),re.add(e),{...i,i:t,g:e,gem:s,flag:o,flagMat:a,ring:c,owner:-1}}),vn=new N_(re,se,he,Re),ut=new E_(he,Re,.5);vn.onBreak=i=>{i.kind==="block"?Ce.crumble():Ce.thwack()};function Us(){vn.dirty&&(vn.dirty=!1,ut.rebuild(vn.chunks))}const D={seed:Number(cr.get("seed"))||Math.random()*1e6|0,stage:"title",control:["human","ai"],round:1,active:0,first:0,phase:"move",vp:[0,0],busy:!1,sel:null,reach:null,hover:null,follow:!0,pendingLog:[]};let oe=[],ov=1;const ce=i=>i.alive>0,Wi=i=>oe.filter(t=>t.side!==i.side&&ce(t)),iu=i=>oe.filter(t=>t.side===i.side&&ce(t)&&t!==i),ho=(i,t)=>Math.hypot(i.pos.x-t.pos.x,i.pos.z-t.pos.z),gi=(i,t)=>ho(i,t)-i.r-t.r,uo=i=>Wi(i).filter(t=>gi(i,t)<=Ui+.05),un=i=>uo(i).length>0,An=i=>D.control[i]==="human";function av(i,t){const e=t*2+.16;if(i===1)return[[0,0]];if(i<=4){const r=i===2?e/2:e/(2*Math.sin(Math.PI/i));return Array.from({length:i},(a,o)=>[Math.cos(o/i*Math.PI*2+.4)*r,Math.sin(o/i*Math.PI*2+.4)*r])}const n=i-1,s=Math.max(e,e/(2*Math.sin(Math.PI/n)));return[[0,0],...Array.from({length:n},(r,a)=>[Math.cos(a/n*Math.PI*2+.3)*s,Math.sin(a/n*Math.PI*2+.3)*s])]}function cv(i,t){const e=y_[i],n={id:ov++,key:i,t:e,side:t,name:e.name,pos:{x:0,z:0},facing:t===0?Math.PI/2:-Math.PI/2,models:[],alive:e.models,r:0,flags:{},lost:0,mesmerized:!1,moving:!1};for(let s=0;s<e.models;s++){const r=$_(i,e,be[t].color);re.add(r),n.models.push({mesh:r,w:e.W,alive:!0,ox:0,oz:0,x:0,z:0,yaw:n.facing,lunge:0,lungeDir:0,lift:0})}return n.ring=new kt(new Gi(.88,1,48).rotateX(-Math.PI/2),new je({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})),n.ring.position.y=.04,n.ring.renderOrder=2,re.add(n.ring),n.hit=new kt(new nn(1,1,1,12),new je({visible:!1})),n.hit.userData.unit=n,re.add(n.hit),n.label=document.createElement("div"),n.label.className=`ulabel s${t}`,nu.appendChild(n.label),su(n,!0),n}function su(i,t=!1){const e=i.models.filter(r=>r.alive),n=av(e.length,i.t.base);e.sort((r,a)=>Math.atan2(r.oz,r.ox)-Math.atan2(a.oz,a.ox)),n.forEach(([r,a],o)=>{e[o].ox=r,e[o].oz=a}),i.r=n.reduce((r,[a,o])=>Math.max(r,Math.hypot(a,o)),0)+i.t.base,i.ring.scale.setScalar(i.r+.18);const s=i.t.big?2.4:i.t.fly?1.8:1.3;if(i.hit.scale.set(i.r,s,i.r),t)for(const r of i.models)ru(i,r);kn(i)}function ru(i,t){t.x=i.pos.x+t.ox,t.z=i.pos.z+t.oz,t.mesh.position.set(t.x,0,t.z),t.mesh.rotation.y=t.yaw}function lr(i,t,e){i.pos.x=t,i.pos.z=e,i.ring.position.x=i.hit.position.x=t,i.ring.position.z=i.hit.position.z=e,i.hit.position.y=i.hit.scale.y/2}function kn(i){const t=i.models.filter(n=>n.alive);let e=`<span class="nm">${i.t.short}</span>`;i.t.models>1?e+=`<span class="ct">${i.alive}/${i.t.models}</span>`:e+=`<span class="ct">${t[0]?t[0].w:0}/${i.t.W}♥</span>`,i.mesmerized&&(e+='<span class="st" title="Mesmerized">🌀</span>'),ce(i)&&un(i)&&(e+='<span class="st" title="In combat">⚔</span>'),i.label.innerHTML=e,i.label.style.display=ce(i)?"":"none"}function lv(){for(const i of oe){for(const t of i.models)re.remove(t.mesh);re.remove(i.ring,i.hit),i.label.remove()}oe=[]}function ou(i,t,e,n,s){let r=null,a=1/0;const o=n===0?-he/2:he/2-In.deploy,c=n===0?-he/2+In.deploy:he/2;for(let h=0;h<ut.N;h++){const l=ut.x(h),u=ut.z(h);if(l-i.r<o-.01||l+i.r>c+.01||!ut.standable(h,i.r,"walk")||s.some(d=>Math.hypot(d.pos.x-l,d.pos.z-u)<d.r+i.r+.4))continue;const f=Math.hypot(l-t,u-e);f<a&&(a=f,r={x:l,z:u})}return r}function hv(){for(const i of[0,1]){const t=i===0?-1:1,e=oe.filter(c=>c.side===i),n=[],s=e.filter(c=>c.t.role==="Artillery"),r=e.filter(c=>c.t.hero),o=[[e.filter(c=>!s.includes(c)&&!r.includes(c)),he/2-In.deploy+1.8],[r,he/2-In.deploy+3.6],[s,he/2-2.4]];for(const[c,h]of o)c.forEach((l,u)=>{const f=((u+.5)/c.length-.5)*(Re-6)*(i?-1:1),d=ou(l,t*h,f,i,n)||{x:t*h,z:f};lr(l,d.x,d.z),n.push(l);for(const g of l.models)ru(l,g)})}}const au=i=>i.t.big?1.9:i.t.fly?1.5:.95,cu=i=>i.t.big||i.t.fly?1:.55;function fo(i){const t=i.models.filter(n=>n.alive);if(i.t.fly)return!1;let e=0;for(const n of t)ut.cover[ut.index(n.x,n.z)]&&e++;return e*2>=t.length&&e>0}function lu(i,t,e=i.pos){const n={x:e.x,y:au(i),z:e.z};let s=0,r=0,a=0;for(const o of t.models){if(!o.alive)continue;a++;const c=vn.los(n,{x:o.x,y:cu(t),z:o.z});c.blocked||(s++,c.obscure&&r++)}return{visible:s>0,cover:s>0&&(r>0||s<a||fo(t)),seen:s,total:a}}function hu(i){let t=i.t.Ld;for(const e of iu(i))e.t.hero&&ho(i,e)<=to+i.r&&(t=Math.max(t,e.t.Ld));return t}function qa(i){const t=[0,0];for(const e of oe)if(ce(e))for(const n of e.models)n.alive&&Math.hypot(n.x-i.x,n.z-i.z)<=Zr+e.t.base&&(t[e.side]+=e.t.OC);return t[0]>t[1]?0:t[1]>t[0]?1:-1}function uu(i){return i.t.fly?"fly":i.t.wrecker?"wreck":"walk"}function wa(i,t,e=[]){const n=new Uint8Array(ut.N);for(const s of Wi(i)){const r=s.r+i.r+(e.includes(s)?.02:t),a=Math.max(0,Math.floor((s.pos.x-r+he/2)/ut.cell)),o=Math.min(ut.nx-1,Math.floor((s.pos.x+r+he/2)/ut.cell)),c=Math.max(0,Math.floor((s.pos.z-r+Re/2)/ut.cell)),h=Math.min(ut.nz-1,Math.floor((s.pos.z+r+Re/2)/ut.cell));for(let l=c;l<=h;l++)for(let u=a;u<=o;u++){const f=l*ut.nx+u;Math.hypot(ut.x(f)-s.pos.x,ut.z(f)-s.pos.z)<r&&(n[f]=1)}}return n}function fu(i,t=0){Us();const e=un(i),n=i.t.M+t,s=uu(i),r=Wi(i),a=wa(i,Ui+.05,e?r:[]),o=wa(i,Ui+.05),c=ut.reach(i.pos.x,i.pos.z,{r:i.r,max:n,mode:s==="fly"?"fly":s,forbid:s==="fly"?null:a});return{u:i,res:c,max:n,mode:s,forbid:a,endForbid:o,fallback:e}}function Ya(i,t){const{u:e,res:n,mode:s,endForbid:r}=i;if(t<0||!isFinite(n.dist[t])||!ut.standable(t,e.r,s==="wreck"?"wreck":"walk",r))return!1;const a=ut.x(t),o=ut.z(t);for(const c of oe)if(c!==e&&ce(c)&&Math.hypot(c.pos.x-a,c.pos.z-o)<c.r+e.r+.08)return!1;return!0}function du(i,t,e,n=2.4){let s=-1,r=n;const a=ut.index(t,e);if(a<0)return-1;const o=Math.ceil(n/ut.cell),c=a%ut.nx,h=a/ut.nx|0;for(let l=-o;l<=o;l++)for(let u=-o;u<=o;u++){const f=c+u,d=h+l;if(f<0||d<0||f>=ut.nx||d>=ut.nz)continue;const g=d*ut.nx+f,_=Math.hypot(ut.x(g)-t,ut.z(g)-e);_<r&&Ya(i,g)&&(r=_,s=g)}return s}async function pu(i,t,{speed:e=7,fly:n=!1}={}){const s=Kh(t);if(s<.05)return;if(i.moving=!0,n)for(const c of i.models)c.flying=!0;const r=[];let a=0;for(let c=1;c<t.length;c++){const h=Math.hypot(t[c].x-t[c-1].x,t[c].z-t[c-1].z);r.push({a:t[c-1],b:t[c],s:a,l:h}),a+=h}const o=i.t.wrecker;if(await Pe(s/e+.15,c=>{const h=Math.min(s,c*(s+e*.15)),l=r.find(g=>h<=g.s+g.l)||r[r.length-1],u=l.l>0?(h-l.s)/l.l:1,f=Un(l.a.x,l.b.x,u),d=Un(l.a.z,l.b.z,u);if(i.facing=Math.atan2(l.b.x-l.a.x,l.b.z-l.a.z),lr(i,f,d),n)for(const g of i.models)g.lift=Math.sin(Math.min(1,h/s)*Math.PI)*Math.min(3,s*.3);o&&uv(i,f,d)},Wa),i.moving=!1,n)for(const c of i.models)c.flying=!1,c.lift=0;await Xe(.15)}function uv(i,t,e){for(const n of vn.chunks){if(!n.alive||!n.destructible)continue;const s=n.nav||n.shape;Math.hypot(s.x-t,s.z-e)<i.r+Math.max(s.hx,s.hz)*.8&&(vn.hurt(n,99,{x:t-Math.sin(i.facing),z:e-Math.cos(i.facing)}),se.shake=Math.max(se.shake,.08))}}async function mu(i,t,e){D.busy=!0;const n=ut.path(e.res,t,i.r,e.mode==="fly"?null:e.forbid);i.flags.moved=!0,e.fallback&&(i.flags.fellBack=!0);const s=Kh(n);Fe(i.side,`<b>${i.t.short}</b> ${e.fallback?"fall back":i.flags.advanced?"advance":"move"} ${s.toFixed(1)}".`),i.t.wrecker&&s>.1&&Ce.boom(.4),await pu(i,n,{fly:e.mode==="fly"}),Us(),ti()}async function gu(i){D.busy=!0,me.clear(`${i.t.short} — Advance`);const t=We(1);return await me.row("Advance D6",t,0,{sum:!0,note:`+${t[0]}"`}),i.flags.advanced=!0,i.flags.advRoll=t[0],Fe(i.side,`<b>${i.t.short}</b> advance: +${t[0]}".`),D.busy=!1,t[0]}function ja(i){const t=i.t.ranged;return!(!t||!ce(i)||i.flags.shot||i.mesmerized||i.flags.fellBack||un(i)||i.flags.advanced&&!t.assault)}function Ns(i,t){const e=i.t.ranged,n=gi(i,t);if(n>e.range)return{ok:!1,why:`out of range (${n.toFixed(1)}" / ${e.range}")`};if(un(t)&&!e.spell)return{ok:!1,why:"locked in combat"};const s=lu(i,t);if(!s.visible&&!e.indirect)return{ok:!1,why:"no line of sight"};let r=0;return e.heavy&&i.flags.moved&&r++,e.indirect&&!s.visible&&r++,{ok:!0,range:n,...s,mod:r,need:nr(i.t.BS,r)}}function _u(i){return ja(i)?Wi(i).filter(t=>Ns(i,t).ok):[]}async function vu(i,t){D.busy=!0;const e=i.t.ranged,n=Ns(i,t);if(i.flags.shot=!0,Ja(i,t),me.clear(`${i.t.short} → ${t.t.short} · ${e.name}`),e.spell){const g=We(2),_=g[0]+g[1]>=e.spell;return await me.row(`Cast ${e.spell}+ (2D6)`,g,0,{sum:!0,pass:_}),_?(Ce.magic(),e.mesmerize?gv(i,t):(Fe(i.side,`<b>${i.t.short}</b> casts <b>${e.name}</b> on ${t.t.short}!`),await mv(i,t,e),ti())):(Ce.fizzle(),se.text(Ss(i),"Fizzle…","#c8b8ff"),Fe(i.side,`<b>${i.t.short}</b> tries ${e.name} — it fizzles (${g[0]+g[1]}).`),ti())}if(e.blast)return await dv(i,t,e,n),ti();const s=Rs(i,e,!1);await fv(i,t,e);const r=We(s),a=ei(r,n.need);await me.row(`Hit ${n.need}+`,r,n.need);const o=or(e.S,t.t.T,e.poison),c=We(a),h=ei(c,o);a&&await me.row(`Wound ${o}+`,c,o);const l=ar(t.t.Sv,e.AP,n.cover),u=We(h),f=l>6?h:h-ei(u,l);h&&await me.row(l>6?"No save":`Save ${l}+${n.cover?" (cover)":""}`,l>6?[]:u,l,{save:!0});const d=await po(t,f,e.D,i);Fe(i.side,`<b>${i.t.short}</b> shoot ${t.t.short}: ${a} hit, ${h} wound, ${f} unsaved${d?` — <b>${d} slain</b>`:""}.`),ti()}async function fv(i,t,e){const n=i.models.filter(o=>o.alive),s=t.models.filter(o=>o.alive),r=[],a=Math.min(10,n.length*e.shots);for(let o=0;o<a;o++){const c=n[o%n.length],h=s[Math.random()*s.length|0],l={x:c.x,y:au(i)*.8+c.lift,z:c.z},u={x:h.x+(Math.random()-.5)*.6,y:cu(t)*.8,z:h.z+(Math.random()-.5)*.6};r.push(Xe(o*.06).then(()=>(Ce.shot(),se.projectile(l,u,xu(e.fx)))).then(()=>{for(let f=0;f<5;f++)se.mote({x:u.x,y:u.y,z:u.z,vx:(Math.random()-.5)*4,vy:Math.random()*3,vz:(Math.random()-.5)*4,size:.05,color:e.fx==="spit"?"#9aff5a":"#ffe0a0",life:.35,g:10})}))}await Promise.all(r)}const li={acorn:new ln(.07,6,5),dart:new zn(.03,.3,4).rotateX(Math.PI/2),javelin:new nn(.02,.02,.9,4).rotateX(Math.PI/2),spit:new Fn(.08,0),bomb:new ln(.11,8,6),pinecone:new zn(.2,.42,7),acid:new ln(.24,12,8)};function xu(i){const t=e=>new je({color:e,toneMapped:!1});switch(i){case"acorn":return{mesh:new kt(li.acorn,_t("#8a5a2a")),arc:.08,speed:28};case"dart":return{mesh:new kt(li.dart,_t("#4a6a2a")),arc:.03,speed:34,spin:0};case"javelin":return{mesh:new kt(li.javelin,_t("#8a6a3a")),arc:.18,speed:20,spin:0};case"spit":return{mesh:new kt(li.spit,t("#9aff5a")),arc:.12,speed:18,trail:e=>se.mote({x:e.x,y:e.y,z:e.z,size:.04,color:"#7aef4a",life:.4,g:6})};case"bomb":return{mesh:new kt(li.bomb,_t("#7a4a22")),arc:.45,speed:14,trail:e=>se.mote({x:e.x,y:e.y+.1,z:e.z,size:.05,color:"#ffb030",life:.3,g:-1})};case"pinecone":return{mesh:new kt(li.pinecone,_t("#6b4a26",{emissive:"#ff5a10",emissiveIntensity:.6})),arc:.55,speed:18,trail:e=>{se.mote({x:e.x,y:e.y,z:e.z,size:.12,color:Math.random()<.5?"#ff8a2a":"#ffd36e",life:.4,g:-2}),se.smoke({x:e.x,y:e.y,z:e.z,size:.14,color:"#3a3430",life:.9})}};case"acid":return{mesh:new kt(li.acid,t("#8aff5a")),arc:.5,speed:15,trail:e=>se.mote({x:e.x,y:e.y,z:e.z,size:.1,color:Math.random()<.5?"#5be04a":"#c8ff8a",life:.5,g:8})}}return{mesh:new kt(li.acorn,_t("#888"))}}async function dv(i,t,e,n){const s=Rs(i,e,!1);Fe(i.side,`<b>${i.t.short}</b> fire ${e.name} at ${t.t.short} (${n.need}+${n.visible?"":", unseen"}).`);for(let r=0;r<s&&!(!ce(t)&&r>0);r++){const a=Math.random()*Math.PI*2,o=Math.random()*t.r*.5,c={x:t.pos.x+Math.cos(a)*o,z:t.pos.z+Math.sin(a)*o},h=se.ring(c.x,c.z,e.blast,"#ffffff",{hold:!0,fill:.12}),l=We(1),u=l[0]>=n.need;await me.row(s>1?`Template ${r+1}: hit ${n.need}+`:`Hit ${n.need}+`,l,n.need);let f=c;if(!u){const d=We(1)[0]+1,g=Math.random()*Math.PI*2;f={x:Math.max(-he/2+.3,Math.min(he/2-.3,c.x+Math.cos(g)*d)),z:Math.max(-Re/2+.3,Math.min(Re/2-.3,c.z+Math.sin(g)*d))},await me.row("Scatter D6+1",[d-1],0,{sum:!0,note:`${d}"`}),se.text({x:c.x,y:1.5,z:c.z},`scatter ${d}"`,"#ffd36e",{size:15}),await Pe(.35,_=>h.position.set(Un(c.x,f.x,_),.05,Un(c.z,f.z,_)),Cs)}await pv(i,f,e),h.userData.remove(),await Mu(i,f,e)}}async function pv(i,t,e){const n=i.models.find(a=>a.alive),s=n.mesh.userData.anim;if(s!=null&&s.throwArm){const a=s.rest;Ce.thwack(),Pe(.25,o=>s.throwArm.rotation.x=a-2.1*Cs(o)).then(()=>Pe(.8,o=>s.throwArm.rotation.x=a-2.1*(1-o))),s.globe&&(s.globe.visible=!1),await Xe(.15)}else n.lunge=1,n.lungeDir=Math.atan2(t.x-n.x,t.z-n.z);const r={x:n.x,y:i.t.big?1.8:.9,z:n.z};Ce.shot(),await se.projectile(r,{x:t.x,y:.15,z:t.z},xu(e.fx)),s!=null&&s.globe&&(s.globe.visible=!0)}async function mv(i,t,e){const n={x:t.pos.x,z:t.pos.z},s=i.models[0].mesh.userData.anim.gem;if(s){const o=new C;s.getWorldPosition(o);for(let c=0;c<20;c++)se.mote({x:o.x,y:o.y,z:o.z,vx:(Math.random()-.5)*3,vy:Math.random()*3,vz:(Math.random()-.5)*3,size:.06,color:"#9aff7a",life:.8,g:-1})}const r=[],a=new zn(.12,1,5);for(let o=0;o<26;o++){const c=Math.random()*Math.PI*2,h=Math.sqrt(Math.random())*e.blast,l=new kt(a,_t(o%3?"#5a7a2a":"#7a5a2a"));l.position.set(n.x+Math.cos(c)*h,-.6,n.z+Math.sin(c)*h),l.rotation.set((Math.random()-.5)*.6,0,(Math.random()-.5)*.6),l.scale.set(1,.6+Math.random()*1.1,1),l.castShadow=!0,re.add(l),r.push(l)}await Pe(.3,o=>r.forEach(c=>c.position.y=-.6+Cs(o)*(.3+c.scale.y*.4))),se.explode(n.x,n.z,e.blast,"thorns"),await Mu(i,n,e),Pe(1.2,o=>r.forEach(c=>c.position.y-=.02*o)).then(()=>r.forEach(o=>re.remove(o)))}async function Mu(i,t,e){e.fx!=="thorns"&&(se.explode(t.x,t.z,e.blast,e.fx==="acid"?"acid":"fire"),Ce.boom(e.blast/2)),se.ring(t.x,t.z,e.blast,e.fx==="acid"?"#8aff5a":"#ff9a4a",{life:1.4,fill:.2});const n=[];for(const r of oe){if(!ce(r))continue;const a=r.models.filter(o=>o.alive&&Math.hypot(o.x-t.x,o.z-t.z)<=e.blast+r.t.base*.6);a.length&&n.push({v:r,under:a})}for(const{v:r,under:a}of n){let o=a.length;r.t.big&&(o=Math.ceil(Va()/2)+1);const c=r.side===i.side,h=or(e.S,r.t.T,e.poison),l=We(o),u=ei(l,h);await me.row(`${c?"⚠ ":""}${r.t.short}: ${o} hit${o>1?"s":""} · wound ${h}+`,l,h);const f=fo(r),d=ar(r.t.Sv,e.AP,f),g=We(u),_=d>6?u:u-ei(g,d);u&&d<=6&&await me.row(`Save ${d}+${f?" (cover)":""}`,g,d,{save:!0});const m=await po(r,_,e.D,i,a);Fe(i.side,`${c?"<b>Friendly fire!</b> ":""}${e.name} hits ${r.t.short}: ${u} wound, ${_} unsaved${m?` — <b>${m} slain</b>`:""}.`)}n.length||await Xe(.25);const s=vn.blast(t.x,t.z,e.blast,e.scenery||1,{acid:e.fx==="acid"});s.length&&Fe(i.side,`…and ${s.length} piece${s.length>1?"s":""} of scenery ${s.length>1?"are":"is"} wrecked.`),Us()}async function gv(i,t){const e=Ss(i),n=Ss(t),s=[];for(let o=0;o<=16;o++){const c=o/16;s.push(Xe(c*.3).then(()=>se.mote({x:Un(e.x,n.x,c),y:Un(e.y,n.y,c)+Math.sin(c*Math.PI)*.8,z:Un(e.z,n.z,c),size:.09,color:"#c070ff",life:.7,g:0})))}await Promise.all(s);for(let o=0;o<3;o++)se.ring(t.pos.x,t.pos.z,t.r*(.6+o*.35),"#c070ff",{life:1.2+o*.3,fill:.08});const r=Math.ceil(Va()/2);await me.row("Mortal wounds D3",[r],0,{sum:!0,note:`${r}`});const a=await po(t,r,1,i);t.mesmerized=!0,kn(t),se.text(Ss(t),"Mesmerized!","#e0a0ff",{size:20}),Fe(i.side,`<b>${i.t.short}</b> mesmerizes ${t.t.short}: ${r} mortal wound${r>1?"s":""}${a?`, <b>${a} slain</b>`:""}. It can't shoot or charge next turn.`),ti()}async function po(i,t,e,n,s=null){let r=0;for(let a=0;a<t;a++){const o=i.models.filter(u=>u.alive);if(!o.length)break;let c=s?o.filter(u=>s.includes(u)):[];c.length||(c=o);const h=c.filter(u=>u.w<i.t.W);let l;h.length?l=h[0]:l=c.reduce((u,f)=>Math.hypot(u.x-n.pos.x,u.z-n.pos.z)<Math.hypot(f.x-n.pos.x,f.z-n.pos.z)?u:f),l.w-=e,se.text({x:l.x,y:i.t.big?2.3:1.3,z:l.z},`-${Math.min(e,e+Math.min(0,l.w))}`,"#ff5a4a",{size:i.t.big?24:18}),l.w<=0?(_v(i,l,n),r++):l.flash=.4,await Xe(.06)}return r&&(i.lost+=r,await Xe(.25),ce(i)&&yu(i)),kn(i),r}function yu(i){const t=uo(i);if(su(i),!t.length||un(i))return;const e=t.reduce((r,a)=>gi(i,r)<gi(i,a)?r:a),n=ho(i,e),s=gi(i,e)-(Ui-.3);lr(i,i.pos.x+(e.pos.x-i.pos.x)/n*s,i.pos.z+(e.pos.z-i.pos.z)/n*s)}function _v(i,t,e){t.alive=!1,t.w=0,i.alive--,t.dying=!0,i.side===0?Ce.squeak():Ce.hiss();const n=t.mesh.userData.fig,s=e?Math.atan2(t.x-e.pos.x,t.z-e.pos.z)-t.yaw:0,r=Math.sin(s)>=0?1:-1;se.debris(t.x,.5,t.z,i.side===0?["#cf6d2a","#f1dcb5"]:["#3f8f4a","#d9cf86"],6,{power:2,size:.07}),Pe(.6,a=>{n.rotation.z=r*a*1.45,n.position.y=(i.t.big?.09:.06)+Math.sin(a*Math.PI)*.15},Cs).then(()=>Xe(1.4)).then(()=>Pe(.8,a=>t.mesh.position.y=-a*1.4)).then(()=>{re.remove(t.mesh),t.dying=!1}),ce(i)||Su(i,e)}function Su(i,t){i.label.style.display="none",i.ring.visible=!1,i.hit.visible=!1,re.remove(i.hit),D.pendingLog.push([i.side,`<b>${i.t.name}</b> ${i.t.models>1?"are":"is"} destroyed!`,"big"]),se.text({x:i.pos.x,y:2.2,z:i.pos.z},`${i.t.short} destroyed`,be[t?t.side:1-i.side].color,{size:20,life:2})}function Ka(i){var t;return!(!ce(i)||i.flags.charged||i.flags.chargeTried||i.t.role==="Artillery"||i.mesmerized||i.flags.fellBack||un(i)||i.flags.advanced&&!((t=i.t.abilities)!=null&&t.some(e=>e.startsWith("Sidewind"))))}function hr(i){return Ka(i)?Wi(i).filter(t=>gi(i,t)<=co):[]}function mo(i,t){Us();const e=Wi(i).filter(g=>g!==t),n=uu(i),s=wa(i,Ui+.05,[t]),r=ut.reach(i.pos.x,i.pos.z,{r:i.r,max:co+.5,mode:n,forbid:n==="fly"?null:s}),a=[];let o=-1,c=1/0;const h=t.r+i.r+Ui-.08,l=Math.ceil((h+1)/ut.cell),u=ut.index(t.pos.x,t.pos.z),f=u%ut.nx,d=u/ut.nx|0;for(let g=-l;g<=l;g++)for(let _=-l;_<=l;_++){const m=f+_,p=d+g;if(m<0||p<0||m>=ut.nx||p>=ut.nz)continue;const v=p*ut.nx+m,x=r.dist[v];if(!isFinite(x))continue;const M=Math.hypot(ut.x(v)-t.pos.x,ut.z(v)-t.pos.z);M>h||M<t.r+i.r+.02||ut.standable(v,i.r,n==="wreck"?"wreck":"walk",s)&&(e.some(R=>Math.hypot(ut.x(v)-R.pos.x,ut.z(v)-R.pos.z)<R.r+i.r+Ui)||oe.some(R=>R!==i&&R!==t&&ce(R)&&R.side===i.side&&Math.hypot(R.pos.x-ut.x(v),R.pos.z-ut.z(v))<R.r+i.r+.05)||(a.push({i:v,d:x}),x<c&&(o=v,c=x)))}return o<0?null:{cell:o,need:Math.max(2,Math.ceil(c-.01)),res:r,forbid:s,mode:n,dist:c,spots:a}}async function bu(i,t,{auto:e=!1}={}){D.busy=!0;const n=mo(i,t);if(i.flags.chargeTried=!0,me.clear(`${i.t.short} charge ${t.t.short}`),!n)return Fe(i.side,`<b>${i.t.short}</b> can't find a way to ${t.t.short}.`),ti();const s=We(2),r=s[0]+s[1],a=r>=n.need;if(await me.row(`Charge ${n.need}" (2D6)`,s,0,{sum:!0,pass:a}),Ja(i,t),!a)return se.text(Ss(i),"Charge failed","#d0d0d0"),Fe(i.side,`<b>${i.t.short}</b> charge ${t.t.short} — roll ${r}, needed ${n.need}. Failed.`),ti();i.flags.charged=!0,i.flags.chargeTarget=t.id,se.text(Ss(i),"CHARGE!",be[i.side].color,{size:22}),Fe(i.side,`<b>${i.t.short}</b> charge ${t.t.short} — roll ${r} vs ${n.need}. <b>Contact!</b>`);const o=e||!An(i.side)?n.cell:await vv(i,t,n,r),c=ut.path(n.res,o,i.r,n.mode==="fly"?null:n.forbid);await pu(i,c,{speed:11,fly:n.mode==="fly"}),Us();for(const h of[i,t])kn(h);ti()}function vv(i,t,e,n){const s=new Uint8Array(ut.N);for(const r of e.spots)r.d<=n+.011&&(s[r.i]=1);return s[e.cell]=1,Lu(s,[255,150,60]),new Promise(r=>{D.chargePick={u:i,target:t,plan:e,rolled:n,ok:s,resolve:r},Cn()})}function Eu(i,t,e,n=2.4){let s=-1,r=n;for(let a=0;a<ut.N;a++){if(!i.ok[a])continue;const o=Math.hypot(ut.x(a)-t,ut.z(a)-e);o<r&&(r=o,s=a)}return s}function wu(i){const t=D.chargePick;!t||i<0||!t.ok[i]||(D.chargePick=null,Za(),an.visible=!1,Cn(),t.resolve(i))}async function ih(i){if(!ce(i)||i.flags.fought)return;const t=uo(i);if(!t.length)return;i.flags.fought=!0;const e=t.find(m=>m.id===i.flags.chargeTarget)||t.reduce((m,p)=>m.alive*m.t.W<p.alive*p.t.W?m:p),n=i.t.melee,s=i.mesmerized?1:0,r=nr(i.t.WS,s);Ja(i,e),(An(i.side)||An(e.side)||D.follow)&&Au(i.pos.x*.5+e.pos.x*.5,i.pos.z*.5+e.pos.z*.5),me.clear(`${i.t.short} fight ${e.t.short} · ${n.name}`);for(const m of i.models)m.alive&&(m.lunge=1,m.lungeDir=Math.atan2(e.pos.x-m.x,e.pos.z-m.z));Ce.thwack();const a=Rs(i,n,!0),o=We(a),c=ei(o,r);await me.row(`Hit ${r}+${s?" (mesmerized)":""}`,o,r);for(let m=0;m<Math.min(c,8);m++){const p=e.models.filter(v=>v.alive)[m%Math.max(1,e.alive)];if(p)for(let v=0;v<4;v++)se.mote({x:p.x,y:.6,z:p.z,vx:(Math.random()-.5)*5,vy:Math.random()*4,vz:(Math.random()-.5)*5,size:.05,color:"#fff2b0",life:.3,g:12})}const h=or(n.S,e.t.T,n.poison),l=We(c),u=ei(l,h);c&&await me.row(`Wound ${h}+`,l,h);const f=ar(e.t.Sv,n.AP,!1),d=We(u),g=f>6?u:u-ei(d,f);u&&await me.row(f>6?"No save":`Save ${f}+`,f>6?[]:d,f,{save:!0});const _=await po(e,g,n.D,i);Fe(i.side,`<b>${i.t.short}</b> fight ${e.t.short}: ${c} hit, ${u} wound, ${g} unsaved${_?` — <b>${_} slain</b>`:""}.`),await Xe(.3)}async function xv(i){const t=oe.filter(n=>n.side===i&&n.flags.charged&&ce(n));for(const n of t)await ih(n);let e=1-i;for(let n=0;n<30;n++){const s=oe.find(a=>a.side===e&&ce(a)&&!a.flags.fought&&un(a)),r=oe.find(a=>a.side===1-e&&ce(a)&&!a.flags.fought&&un(a));if(!s&&!r)break;s&&await ih(s),e=1-e}for(const n of oe)n.flags.fought=!1,kn(n)}async function Mv(){let i=!1;for(const t of oe){if(!ce(t)||!t.lost||t.t.models===1)continue;i||me.clear("Morale"),i=!0;const e=hu(t),n=We(1),s=n[0]+t.lost,r=n[0]===1?0:Math.max(0,s-e);if(await me.row(`${t.t.short}: D6 + ${t.lost} lost vs Ld ${e}`,n,0,{sum:!0,pass:r===0,note:`${s}`}),r){const a=Math.min(r,t.alive),o=t.models.filter(c=>c.alive).slice(-a);for(const c of o)yv(t,c);Fe(t.side,`<b>${t.t.short}</b> lose their nerve — <b>${a} flee</b>.`),ce(t)?yu(t):Su(t,null),kn(t),await Xe(.5)}else Fe(t.side,`<b>${t.t.short}</b> hold firm (${s} vs Ld ${e}).`)}}function yv(i,t){t.alive=!1,t.w=0,i.alive--,t.dying=!0;const e=i.side===0?-he/2-3:he/2+3,n=t.x,s=t.z;t.fleeing=!0,se.text({x:t.x,y:1.4,z:t.z},"flees!","#e0e0e0",{size:14}),t.yaw=i.side===0?-Math.PI/2:Math.PI/2,Pe(2.2,r=>{t.x=Un(n,e,r),t.z=s,t.mesh.position.set(t.x,Math.abs(Math.sin(r*30))*.2,t.z),t.mesh.rotation.y=t.yaw}).then(()=>{re.remove(t.mesh),t.dying=!1})}function Ja(i,t){i.facing=Math.atan2(t.pos.x-i.pos.x,t.pos.z-i.pos.z);for(const e of i.models)e.look=Math.atan2(t.pos.x-e.x,t.pos.z-e.z)}const Ss=i=>({x:i.pos.x,y:i.t.big?2.6:1.6,z:i.pos.z});function ti(){D.busy=!1;for(const i of oe)kn(i);D.sel&&!go(D.sel)?Rn(null):D.sel&&Rn(D.sel),Cn(),Tu()}function Tu(){for(const i of[0,1])oe.some(t=>t.side===i&&ce(t))||(D.wiped=i)}let sh=null;function Au(i,t){if(!D.follow||D.stage!=="battle"||An(D.active)&&D.control[0]!==D.control[1])return;const e=ze.target.clone();if(Math.hypot(i-e.x,t-e.z)<6)return;const s=de.position.clone().sub(e),r=new C(Un(e.x,i,.6),0,Un(e.z,t,.6)),a=sh={};Pe(.9,o=>{sh===a&&(ze.target.lerpVectors(e,r,o),de.position.copy(ze.target).add(s))},Wa)}const Ru={get units(){return oe},objectives:ir,nav:ut,scenery:vn,S:D,alive:ce,enemiesOf:Wi,friendsOf:iu,dist:ho,gap:gi,isEngaged:un,engagedWith:uo,sight:lu,inCover:fo,controlOf:qa,movePlan:fu,validEnd:Ya,doMove:mu,doAdvance:gu,canShoot:ja,shootTargets:_u,shotInfo:Ns,doShoot:vu,canCharge:Ka,chargeTargets:hr,chargePlan:mo,doCharge:bu,focus:Au,leadership:hu};let wn=null;async function Sv(){D.stage="battle",Rn(null),no.forEach(e=>e.opacity=.05),me.clear("Roll-off for the first turn");let i,t;do i=We(1),t=We(1),await me.row(be[0].short,i,0,{sum:!0}),await me.row(be[1].short,t,0,{sum:!0});while(i[0]===t[0]);for(D.first=i[0]>t[0]?0:1,Fe(D.first,`<b>${be[D.first].name}</b> win the roll-off and take the first turn.`,"big"),D.round=1;D.round<=Qr;D.round++){for(let e=0;e<2;e++)if(D.active=(D.first+e)%2,await bv(D.active),D.wiped!==void 0)return rh();await Ev()}rh()}async function bv(i){for(const t of oe)t.lost=0,t.side===i&&(t.flags={});for(const t of jh)if(D.phase=t.key,Rn(null),me.el.classList.remove("show"),Cn(),await Iu(`${be[i].icon} ${be[i].name}`,t.name),t.key==="fight"?oe.some(e=>ce(e)&&un(e))&&await xv(i):t.key==="morale"?await Mv():wv(i)?An(i)?(await new Promise(e=>{wn=e,D.waiting=!0,Cn()}),wn=null,D.waiting=!1):await Jh(Ru,i,t.key):await Xe(.2),Tu(),D.wiped!==void 0)return;for(const t of oe)t.side===i&&t.mesmerized&&(t.mesmerized=!1,kn(t))}async function Ev(){const i=[0,0];for(const t of ir){const e=qa(t);e>=0&&(i[e]++,se.ring(t.x,t.z,Zr,be[e].color,{life:1.6,fill:.15}))}D.vp[0]+=i[0],D.vp[1]+=i[1],Fe(-1,`End of round ${D.round}: ${be[0].short} hold ${i[0]} objective${i[0]===1?"":"s"}, ${be[1].short} hold ${i[1]}. Score ${D.vp[0]}–${D.vp[1]}.`,"big"),Cn(),await Iu(`End of round ${D.round}`,`VP ${D.vp[0]} – ${D.vp[1]}`)}function rh(){D.stage="over",Rn(null),Cn();let i;D.wiped!==void 0?i=1-D.wiped:i=D.vp[0]>D.vp[1]?0:D.vp[1]>D.vp[0]?1:-1;const t=i<0?"A bloody draw":`${be[i].name} win!`,e=D.wiped!==void 0?`${be[D.wiped].name} have been wiped from the table.`:`Final score ${D.vp[0]} – ${D.vp[1]} after ${Qr} rounds.`;Ct("#overTitle").textContent=`${i>=0?be[i].icon+" ":""}${t}`,Ct("#overWhy").textContent=e,Ct("#over").classList.remove("hidden"),Ce.fanfare()}const ua=new v_,oh=new ht;let Ys=null;function Cu(i){oh.set(i.clientX/innerWidth*2-1,-(i.clientY/innerHeight)*2+1),ua.setFromCamera(oh,de);const t=ua.intersectObjects(oe.filter(ce).map(s=>s.hit),!1),e=t.length?t[0].object.userData.unit:null,n=ua.intersectObject(Xa,!1)[0];return{unit:e,ground:n?n.point:null}}function go(i){if(!ce(i)||i.side!==D.active)return!1;switch(D.phase){case"move":return!i.flags.moved;case"shoot":return ja(i)&&_u(i).length>0;case"charge":return Ka(i)&&hr(i).length>0}return!1}const wv=i=>oe.some(t=>t.side===i&&go(t));Ze.domElement.addEventListener("pointerdown",i=>{lo(),Ys={x:i.clientX,y:i.clientY,b:i.button}});Ze.domElement.addEventListener("pointerup",i=>{if(!Ys||i.button!==0)return;const t=Math.hypot(i.clientX-Ys.x,i.clientY-Ys.y);Ys=null,!(t>6)&&Tv(Cu(i))});Ze.domElement.addEventListener("pointermove",i=>{D.mouse={x:i.clientX,y:i.clientY},D.hoverPick=Cu(i),Cv()});function Pu(){return D.stage==="battle"&&An(D.active)&&wn&&!D.busy||D.stage==="deploy"}async function Tv({unit:i,ground:t}){if(Ct("#tooltip").style.display="none",D.stage==="deploy")return Av(i,t);if(D.chargePick){t&&wu(Eu(D.chargePick,t.x,t.z));return}if(!Pu()){i&&bs(i);return}const e=D.sel;if(i&&i.side===D.active){go(i)?(Ce.click(),Rn(i)):bs(i);return}if(D.phase==="move"&&e&&t){const n=du(D.reach,t.x,t.z);n>=0&&(Za(),await mu(e,n,D.reach));return}if(D.phase==="shoot"&&e&&i&&i.side!==e.side){Ns(e,i).ok&&await vu(e,i);return}if(D.phase==="charge"&&e&&i&&i.side!==e.side){hr(e).includes(i)&&mo(e,i)&&await bu(e,i);return}i?bs(i):!i&&t&&Rn(null)}function Av(i,t){const e=D.deploySide;if(i&&i.side===e){Ce.click(),D.sel=i,bs(i),Du();return}if(D.sel&&t){const n=D.sel,s=oe.filter(a=>a!==n),r=ou(n,t.x,t.z,e,s);if(r&&Math.hypot(r.x-t.x,r.z-t.z)<2.5){lr(n,r.x,r.z),Ce.click();for(const a of oe)kn(a)}}}function Rn(i){D.sel=i,D.reach=null,Za(),i&&D.stage==="battle"&&D.phase==="move"&&!i.flags.moved&&(D.reach=fu(i,i.flags.advanced?i.flags.advRoll:0),Rv(D.reach)),i&&D.phase==="shoot"&&i.t.ranged&&ah(i,i.t.ranged.range),i&&D.phase==="charge"&&ah(i,co),bs(i),Cn()}const gs=new Uint8Array(ut.nx*ut.nz*4),_o=new Kg(gs,ut.nx,ut.nz,mn);_o.magFilter=tn;_o.minFilter=tn;const Os=new kt(new vi(he,Re).rotateX(-Math.PI/2),new je({map:_o,transparent:!0,depthWrite:!1,toneMapped:!1}));Os.position.y=.035;Os.renderOrder=2;Os.visible=!1;re.add(Os);function Rv(i){const t=i.u.flags.advanced,{u:e,res:n,mode:s,endForbid:r}=i,a=new Uint8Array(ut.N);for(let o=0;o<ut.N;o++)isFinite(n.dist[o])&&ut.standable(o,e.r,s==="wreck"?"wreck":"walk",r)&&(a[o]=1);Lu(a,i.fallback?[255,120,90]:t?[255,190,70]:[90,180,255])}function Lu(i,t){gs.fill(0);for(let e=0;e<ut.N;e++){if(!i[e])continue;const n=e%ut.nx,s=e/ut.nx|0,r=n===0||s===0||n===ut.nx-1||s===ut.nz-1||!i[e-1]||!i[e+1]||!i[e-ut.nx]||!i[e+ut.nx],a=((ut.nz-1-s)*ut.nx+n)*4;gs[a]=t[0],gs[a+1]=t[1],gs[a+2]=t[2],gs[a+3]=r?210:ut.diff[e]?55:80}_o.needsUpdate=!0,Os.visible=!0}function Za(){Os.visible=!1,Zn.visible=!1,Jn.visible=!1}const Jn=new kt(new Gi(.985,1,96).rotateX(-Math.PI/2),new je({color:"#ffffff",transparent:!0,opacity:.6,depthWrite:!1,toneMapped:!1}));Jn.position.y=.04;Jn.visible=!1;re.add(Jn);function ah(i,t){Jn.position.x=i.pos.x,Jn.position.z=i.pos.z,Jn.scale.setScalar(i.r+t),Jn.material.color.set(D.phase==="charge"?"#ffb070":"#ffffff"),Jn.visible=!0}const Zn=new Gh(new Ee,new Na({color:"#ffffff",transparent:!0,opacity:.9,toneMapped:!1}));Zn.visible=!1;Zn.renderOrder=4;re.add(Zn);const an=new kt(new Gi(.9,1,40).rotateX(-Math.PI/2),new je({color:"#ffffff",transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1}));an.position.y=.05;an.visible=!1;re.add(an);function Cv(){const i=Ct("#tooltip");i.style.display="none",Zn.visible=!1,an.visible=!1;const t=D.hoverPick;if(!t)return;D.hover=t.unit;let e="";const n=D.sel;if(D.chargePick&&t.ground){const s=D.chargePick,r=Eu(s,t.ground.x,t.ground.z);if(r>=0){const a=ut.path(s.plan.res,r,s.u.r,s.plan.mode==="fly"?null:s.plan.forbid);Zn.geometry.setFromPoints(a.map(o=>new C(o.x,.08,o.z))),Zn.visible=!0,an.position.x=ut.x(r),an.position.z=ut.z(r),an.scale.setScalar(s.u.r),an.visible=!0,e=`End charge here · ${s.plan.res.dist[r].toFixed(1)}" of ${s.rolled}"`}else e="✖ out of reach — pick a spot in the orange area"}else if(D.stage==="battle"&&Pu()&&n){if(D.phase==="move"&&D.reach&&t.ground&&!t.unit){const s=du(D.reach,t.ground.x,t.ground.z);if(s>=0){const r=ut.path(D.reach.res,s,n.r,D.reach.mode==="fly"?null:D.reach.forbid);Zn.geometry.setFromPoints(r.map(a=>new C(a.x,.08,a.z))),Zn.visible=!0,an.position.x=ut.x(s),an.position.z=ut.z(s),an.scale.setScalar(n.r),an.visible=!0,e=`${D.reach.res.dist[s].toFixed(1)}" of ${D.reach.max}"`}}else if(D.phase==="shoot"&&t.unit&&t.unit.side!==n.side){const s=Ns(n,t.unit);e=s.ok?Pv(n,t.unit,s):`✖ ${s.why}`}else if(D.phase==="charge"&&t.unit&&t.unit.side!==n.side)if(!hr(n).includes(t.unit))e=`✖ out of charge range (${gi(n,t.unit).toFixed(1)}")`;else{const s=mo(n,t.unit);e=s?`Charge: need ${s.need}" on 2D6 — ${Math.round(Fi(s.need)*100)}%`:"✖ no route"}}!e&&t.unit&&(e=`${t.unit.t.name} · ${t.unit.t.models>1?`${t.unit.alive}/${t.unit.t.models} models`:`${t.unit.models[0].w}/${t.unit.t.W} wounds`}`),e&&D.mouse&&(i.innerHTML=e,i.style.display="block",i.style.left=D.mouse.x+16+"px",i.style.top=D.mouse.y+14+"px")}function Pv(i,t,e){const n=i.t.ranged;if(n.mesmerize)return`Mesmerize: cast ${n.spell}+ on 2D6 (${Math.round(Fi(n.spell)*100)}%) · D3 mortal wounds`;const s=[];n.spell&&s.push(`Cast ${n.spell}+ (${Math.round(Fi(n.spell)*100)}%)`);const r=Rs(i,n,!1),a=or(n.S,t.t.T,n.poison),o=ar(t.t.Sv,n.AP,e.cover);s.push(`${r} ${n.blast?`template${r>1?"s":""} (${n.blast}")`:"shots"} · hit ${n.spell?"auto":e.need+"+"} · wound ${a}+ · save ${o>6?"—":o+"+"}`);const c=[];if(c.push(`${e.range.toFixed(1)}"`),e.cover&&c.push("cover"),e.visible?e.seen<e.total&&c.push(`${e.seen}/${e.total} visible`):c.push("unseen (indirect −1)"),n.heavy&&i.flags.moved&&c.push("moved (heavy −1)"),!n.blast){const h=eo(r,e.need,n,t,e.cover);c.push(`≈${h.kills.toFixed(1)} slain`)}return s.push(c.join(" · ")),s.join("<br>")}const Lv={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};function Dv(i,t){const e=document.createElement("div");e.className=`die ${t}`;for(let n=0;n<9;n++){const s=document.createElement("i");Lv[i].includes(n)&&(s.className="on"),e.appendChild(s)}return e}const me={el:Ct("#tray"),clear(i){this.el.innerHTML="";const t=document.createElement("div");t.className="tray-title",t.textContent=i,this.el.appendChild(t),this.el.classList.add("show")},async row(i,t,e,{sum:n=!1,pass:s,note:r="",save:a=!1}={}){Ce.dice(t.length);const o=document.createElement("div");o.className="tray-row";const c=document.createElement("span");c.className="lbl",c.textContent=i,o.appendChild(c);const h=document.createElement("span");h.className="dice",o.appendChild(h),t.slice(0,30).forEach((f,d)=>{const g=e?f>=e?a?"saved":"ok":"fail":s===!1?"fail":s?"ok":"plain",_=Dv(f,g);_.style.animationDelay=`${d*.025/_n.speed}s`,h.appendChild(_)});const u=document.createElement("span");if(u.className="res",e){const f=ei(t,e);u.textContent=a?`${f} saved`:`${f} ✓`,t.length>30&&(u.textContent+=` (of ${t.length})`)}else n&&(u.textContent=r||`= ${t.reduce((f,d)=>f+d,0)}`,s===!0&&u.classList.add("good"),s===!1&&u.classList.add("bad"));for(o.appendChild(u),this.el.appendChild(o);this.el.children.length>7;)this.el.children[1].remove();await Xe(.38+Math.min(t.length,14)*.035)}};function Fe(i,t,e=""){ch(i,t,e);for(const n of D.pendingLog.splice(0))ch(...n)}function ch(i,t,e){const n=Ct("#logList"),s=document.createElement("div");for(s.className=`entry s${i} ${e}`,s.innerHTML=t,n.prepend(s);n.children.length>80;)n.lastChild.remove()}const lh=["M","WS","BS","S","T","W","A","Ld","Sv","OC"];function bs(i){var o;const t=Ct("#card");if(!i){t.classList.remove("show");return}const e=i.t,n=c=>c==="M"?`${e.M}"`:["WS","BS","Sv"].includes(c)?`${e[c]}+`:e[c],s=(c,h)=>{if(!c)return"";if(c.mesmerize)return`<div class="wpn"><span>${h} ${c.name}</span><em>spell ${c.spell}+ · ${c.range}" · D3 mortal + mesmerize</em></div>`;const l=[];return c.range&&l.push(`${c.range}"`),c.spell&&l.push(`spell ${c.spell}+`),c.blast?l.push(`blast ${c.blast}" ×${c.shots}`):c.shots&&l.push(`A${c.shots}`),l.push(`S${c.S}`,`AP-${c.AP}`,`D${c.D}`),c.poison&&l.push(`poison ${c.poison}+`),c.indirect&&l.push("indirect"),c.heavy&&l.push("heavy"),c.assault&&l.push("assault"),`<div class="wpn"><span>${h} ${c.name}</span><em>${l.join(" · ")}</em></div>`},r=[];i.flags.moved&&r.push(i.flags.fellBack?"fell back":i.flags.advanced?`advanced +${i.flags.advRoll}"`:"moved"),i.flags.shot&&r.push("shot"),i.flags.charged&&r.push("charged"),i.mesmerized&&r.push("🌀 mesmerized"),ce(i)&&un(i)&&r.push("⚔ in combat"),ce(i)&&fo(i)&&r.push("🛡 in cover");const a=e.models>1?`${i.alive}/${e.models} models`:`${i.models[0].w}/${e.W} wounds`;t.innerHTML=`
    <div class="card-head s${i.side}"><b>${e.name}</b><span>${be[i.side].short} · ${e.role}</span></div>
    <div class="card-sub">${ce(i)?a:"destroyed"}${r.length?" · "+r.join(" · "):""}</div>
    <table class="stats"><tr>${lh.map(c=>`<th>${c}</th>`).join("")}</tr><tr>${lh.map(c=>`<td>${n(c)}</td>`).join("")}</tr></table>
    ${s(e.ranged,(o=e.ranged)!=null&&o.spell?"✦":"➹")}${s({...e.melee,range:0},"⚔")}
    <ul class="abil">${(e.abilities||[]).map(c=>`<li>${c}</li>`).join("")}</ul>`,t.classList.add("show")}function Cn(){var r,a;Ct("#vp0").textContent=D.vp[0],Ct("#vp1").textContent=D.vp[1],Ct("#round").textContent=D.stage==="deploy"?"Deployment":`Round ${Math.min(D.round,Qr)} / ${Qr}`,document.querySelectorAll("#phases .ph").forEach(o=>{o.classList.toggle("on",D.stage==="battle"&&o.dataset.k===D.phase)}),Ct("#sideA").classList.toggle("active",D.stage==="battle"&&D.active===0),Ct("#sideB").classList.toggle("active",D.stage==="battle"&&D.active===1);const i=D.stage==="battle"&&An(D.active)&&!!wn,t=D.sel,e=!!D.chargePick;Ct("#endPhase").style.display=i&&!e||D.stage==="deploy"?"":"none",Ct("#closestSpot").style.display=e?"":"none",Ct("#endPhase").textContent=D.stage==="deploy"?"Begin battle ▸":`End ${jh.find(o=>o.key===D.phase).name} ▸`,Ct("#endPhase").disabled=D.busy,Ct("#autoPhase").style.display=i&&!e?"":"none";const n=Ct("#advance");n.style.display=i&&D.phase==="move"&&t&&!t.flags.moved&&!t.flags.advanced&&!un(t)?"":"none",n.textContent=`Advance (+D6") — no ${(r=t==null?void 0:t.t.ranged)!=null&&r.assault?"charge":"shooting or charge"} after`,(a=t==null?void 0:t.t.abilities)!=null&&a.some(o=>o.startsWith("Sidewind"))&&(n.textContent='Advance (+D6") — can still charge');let s="";e?s=`Charge! You rolled ${D.chargePick.rolled}" — click in the orange area to choose where ${D.chargePick.u.t.short} end up.`:D.stage==="deploy"?s="Deployment — click one of your units, then click inside your shaded zone to move it there.":D.stage==="battle"&&!An(D.active)?s=`${be[D.active].name} (AI) are taking their turn…`:i&&(s={move:t?un(t)?"Engaged — click inside the red area to fall back (no shooting or charging after).":"Click inside the shaded area to move. Difficult ground costs double.":"Movement — pick a unit with a white ring to move it.",shoot:t?"Click an enemy unit to shoot it. Hover for odds.":"Shooting — pick a unit with a white ring to fire.",charge:t?'Click an enemy within 12" to declare a charge, then roll 2D6.':"Charge — pick a unit to charge with."}[D.phase]||""),Ct("#hint").textContent=s,Ct("#hint").style.display=s?"":"none",Du()}function Du(){const i=D.stage==="battle"&&An(D.active)&&wn||D.stage==="deploy";for(const t of oe){if(!ce(t))continue;const e=t.ring.material;let n=0,s="#ffffff";t===D.sel?(n=1,s="#ffe680"):D.stage==="deploy"&&t.side===D.deploySide?n=.5:i&&D.stage==="battle"&&go(t)?n=.75:i&&D.sel&&D.phase==="shoot"&&t.side!==D.sel.side&&Ns(D.sel,t).ok?(n=.95,s="#ff5a4a"):i&&D.sel&&D.phase==="charge"&&t.side!==D.sel.side&&hr(D.sel).includes(t)?(n=.95,s="#ffa040"):t===D.hover&&(n=.35),e.opacity=n,e.color.set(s)}}async function Iu(i,t){const e=Ct("#banner");e.innerHTML=`<div class="b1">${i}</div><div class="b2">${t}</div>`,e.classList.remove("show"),e.offsetWidth,e.classList.add("show"),await Xe(An(D.active)||D.stage!=="battle"?.9:.6)}Ct("#endPhase").onclick=()=>{var i;if(lo(),Ce.click(),D.stage==="deploy")return(i=D.deployDone)==null?void 0:i.call(D);D.busy||!wn||(Rn(null),wn())};Ct("#closestSpot").onclick=()=>{Ce.click(),D.chargePick&&wu(D.chargePick.plan.cell)};Ct("#autoPhase").onclick=async()=>{D.busy||!wn||(Rn(null),D.busy=!0,Cn(),await Jh(Ru,D.active,D.phase),D.busy=!1,wn==null||wn())};Ct("#advance").onclick=async()=>{const i=D.sel;!i||D.busy||(await gu(i),Rn(i))};const fa=[1,2,4];Ct("#speed").onclick=()=>{_n.speed=fa[(fa.indexOf(_n.speed)+1)%fa.length],Ct("#speed").textContent=`⏩ ${_n.speed}×`};Ct("#follow").onclick=()=>{D.follow=!D.follow,Ct("#follow").classList.toggle("off",!D.follow)};Ct("#mute").textContent=Z_()?"🔇":"🔊";Ct("#mute").onclick=()=>{lo(),Ct("#mute").textContent=J_()?"🔇":"🔊"};Ct("#helpBtn").onclick=()=>Ct("#help").classList.remove("hidden");Ct("#helpClose").onclick=()=>Ct("#help").classList.add("hidden");Ct("#logToggle").onclick=()=>Ct("#log").classList.toggle("collapsed");Ct("#seed").value=D.seed;Ct("#reroll").onclick=()=>{D.seed=Math.random()*1e6|0,Ct("#seed").value=D.seed,vo()};Ct("#seed").onchange=()=>{D.seed=Number(Ct("#seed").value)||1,vo()};document.querySelectorAll("[data-mode]").forEach(i=>{i.onclick=()=>{lo(),Ce.click(),Uu(i.dataset.mode)}});Ct("#again").onclick=()=>{Ct("#over").classList.add("hidden"),Ct("#title").classList.remove("hidden"),document.body.classList.remove("playing"),D.stage="title",D.titleSpin=!0,D.titleAngle-=_n.time*.035,D.viewShift=1,vo()};const Ln=new Set;addEventListener("keydown",i=>{i.target.tagName!=="INPUT"&&(Ln.add(i.key.toLowerCase()),i.key==="Escape"&&!D.chargePick&&Rn(null))});addEventListener("keyup",i=>Ln.delete(i.key.toLowerCase()));function Iv(i){const t=new C,e=new C().subVectors(ze.target,de.position).setY(0).normalize(),n=new C(-e.z,0,e.x);(Ln.has("w")||Ln.has("arrowup"))&&t.add(e),(Ln.has("s")||Ln.has("arrowdown"))&&t.sub(e),(Ln.has("d")||Ln.has("arrowright"))&&t.add(n),(Ln.has("a")||Ln.has("arrowleft"))&&t.sub(n),t.lengthSq()&&(t.normalize().multiplyScalar(i*18),ze.target.add(t),de.position.add(t))}function vo(){lv(),D.vp=[0,0],D.round=1,D.wiped=void 0,D.sel=null,Ct("#logList").innerHTML="",Ct("#tray").classList.remove("show"),vn.generate(D.seed,ir,In.deploy),vn.dirty=!0,Us(),sv();for(const i of[0,1])for(const t of S_[i])oe.push(cv(t,i));hv();for(const i of oe)kn(i);for(const i of ir)i.owner=-1;Cn()}async function Uu(i){D.control={bushtail:["human","ai"],serpent:["ai","human"],hotseat:["human","human"],watch:["ai","ai"]}[i],Ct("#title").classList.add("hidden"),document.body.classList.add("playing"),D.titleSpin=!1;const t=de.position.clone(),e=ze.target.clone(),n=zv();innerWidth<700&&Ct("#log").classList.add("collapsed"),Pe(1.4,s=>{D.viewShift=1-s,de.position.lerpVectors(t,n.pos,s),ze.target.lerpVectors(e,n.target,s)},Wa);for(const s of[0,1])An(s)&&(D.stage="deploy",D.deploySide=s,no[s].opacity=.2,Fe(s,`<b>${be[s].name}</b>: deploy your army.`),Cn(),await new Promise(r=>D.deployDone=r),no[s].opacity=.07,D.sel=null,bs(null));Sv()}const Uv=new __,Br=new C;D.titleSpin=!0;D.titleAngle=-1.02;D.viewShift=1;function Nv(i,t){for(const e of oe){for(const n of e.models){if(!n.alive&&!n.dying)continue;const s=n.mesh.userData.anim;if(n.alive){const o=e.pos.x+n.ox,c=e.pos.z+n.oz,h=1-Math.exp(-i*(e.moving?16:7)),l=n.x,u=n.z;n.x+=(o-n.x)*h,n.z+=(c-n.z)*h;const f=Math.hypot(n.x-l,n.z-u)/Math.max(i,1e-4),d=f>.6?Math.atan2(n.x-l,n.z-u):n.look??e.facing;n.yaw+=A_(d-n.yaw)*(1-Math.exp(-i*8)),n.moving=f>.6;let g=0,_=0;if(n.lunge>0){n.lunge=Math.max(0,n.lunge-i*2.5);const m=Math.sin((1-n.lunge)*Math.PI)*.35;g=Math.sin(n.lungeDir)*m,_=Math.cos(n.lungeDir)*m}n.mesh.position.set(n.x+g,n.lift||0,n.z+_),n.mesh.rotation.y=n.yaw}if(!s||!n.alive)continue;const r=t+n.mesh.userData.phase,a=n.mesh.userData.fig;if(s.kind==="squirrel"){const o=n.moving?Math.abs(Math.sin(r*13))*.16:0;a.position.y=a.userData.y0+o,a.scale.y=1+(n.moving?0:Math.sin(r*2.4)*.018),a.rotation.x=n.moving?.12:0}else if(s.kind==="naga")a.rotation.z=Math.sin(r*(n.moving?9:1.4))*(n.moving?.12:.035),a.scale.y=1+Math.sin(r*1.4)*.015;else if(s.kind==="machine"&&n.moving)for(const o of s.wheels)o.rotation.x+=i*6;s.gem&&(s.gem.rotation.y=r*2),n.flash>0&&(n.flash-=i,a.position.x=Math.sin(t*60)*.04*(n.flash>0?1:0))}if(ce(e)){Br.set(e.pos.x,e.t.big?2.7:e.t.fly?2.3:1.7,e.pos.z).project(de);const n=Br.z<1;e.label.style.transform=`translate(${(Br.x*.5+.5)*innerWidth}px, ${(-Br.y*.5+.5)*innerHeight}px) translate(-50%, -100%)`,e.label.style.visibility=n&&D.stage!=="title"?"visible":"hidden",e.label.classList.toggle("sel",e===D.sel)}}}function Ov(i,t){for(const e of ir){const n=D.stage==="battle"||D.stage==="over"?qa(e):-1;n!==e.owner&&(e.owner=n,e.flagMat.color.set(n<0?"#e8e0d0":be[n].color),e.ring.material.color.set(n<0?"#fff3c0":be[n].color)),e.gem.rotation.y=t*1.2,e.gem.position.y=.45+Math.sin(t*2+e.i)*.05,e.flag.rotation.y=Math.sin(t*2.2+e.i)*.25,e.ring.material.opacity=.3+Math.sin(t*2+e.i)*.08}}function Nu(){var r;requestAnimationFrame(Nu);const i=Math.min(Uv.getDelta(),.05),t=i*_n.speed;if(_n.time+=t,C_(t),se.update(t),Nv(t,_n.time),Ov(t,_n.time),D.titleSpin){const a=D.titleAngle+_n.time*.035;de.position.set(-5+Math.sin(a)*25,13,Math.cos(a)*25),ze.target.set(-5,0,0)}const e=innerWidth>900?D.viewShift:0;e>.001?de.setViewOffset(innerWidth,innerHeight,-innerWidth*.21*e,0,innerWidth,innerHeight):(r=de.view)!=null&&r.enabled&&de.clearViewOffset(),Iv(i),ze.update();const n=se.shake,s=new C((Math.random()-.5)*n,(Math.random()-.5)*n,(Math.random()-.5)*n);de.position.add(s),Ze.render(re,de),de.position.sub(s)}function zv(){return innerWidth>=innerHeight?{pos:new C(0,30,31),target:new C(0,0,1.5)}:{pos:new C(-36,46,0),target:new C(-1,0,0)}}function Ou(){de.fov=innerWidth>=innerHeight?40:56,de.aspect=innerWidth/innerHeight,de.updateProjectionMatrix()}Ou();addEventListener("resize",()=>{Ou(),de.aspect=innerWidth/innerHeight,de.updateProjectionMatrix(),Ze.setSize(innerWidth,innerHeight)});vo();Nu();cr.has("watch")&&Uu("watch");cr.has("debug")&&(window.__ts={S:D,clock:_n,scenery:vn,nav:ut,camera:de,controls:ze,renderer:Ze,validEnd:Ya,setUnitPos:lr,get units(){return oe},screen(i,t,e){const n=new C(i,t,e).project(de);return[(n.x*.5+.5)*innerWidth,(-n.y*.5+.5)*innerHeight]}});
