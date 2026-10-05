(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Na="160",Kn={ROTATE:0,DOLLY:1,PAN:2},qi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},nf=0,_c=1,sf=2,yh=1,Sh=2,jn=3,_i=0,nn=1,hn=2,di=0,ys=1,vc=2,xc=3,Mc=4,rf=5,Ci=100,of=101,af=102,yc=103,Sc=104,cf=200,lf=201,hf=202,uf=203,xa=204,Ma=205,ff=206,df=207,pf=208,mf=209,gf=210,_f=211,vf=212,xf=213,Mf=214,yf=0,Sf=1,bf=2,qr=3,Ef=4,wf=5,Tf=6,Af=7,za=0,Rf=1,Cf=2,pi=0,Pf=1,Lf=2,Df=3,bh=4,If=5,Uf=6,Eh=300,Ts=301,As=302,ya=303,Sa=304,ao=306,Yr=1e3,En=1001,ba=1002,He=1003,bc=1004,Co=1005,en=1006,Nf=1007,nr=1008,mi=1009,zf=1010,Of=1011,Oa=1012,wh=1013,ui=1014,fi=1015,ir=1016,Th=1017,Ah=1018,Li=1020,Ff=1021,_n=1023,Bf=1024,kf=1025,Di=1026,Rs=1027,Hf=1028,Rh=1029,Gf=1030,Ch=1031,Ph=1033,Po=33776,Lo=33777,Do=33778,Io=33779,Ec=35840,wc=35841,Tc=35842,Ac=35843,Lh=36196,Rc=37492,Cc=37496,Pc=37808,Lc=37809,Dc=37810,Ic=37811,Uc=37812,Nc=37813,zc=37814,Oc=37815,Fc=37816,Bc=37817,kc=37818,Hc=37819,Gc=37820,Vc=37821,Uo=36492,Wc=36494,Xc=36495,Vf=36283,$c=36284,qc=36285,Yc=36286,Dh=3e3,Ii=3001,Wf=3200,Xf=3201,Fa=0,$f=1,vn="",Ae="srgb",ii="srgb-linear",Ba="display-p3",co="display-p3-linear",jr="linear",fe="srgb",Kr="rec709",Jr="p3",Yi=7680,jc=519,qf=512,Yf=513,jf=514,Ih=515,Kf=516,Jf=517,Zf=518,Qf=519,Kc=35044,td=35048,Jc="300 es",Ea=1035,Qn=2e3,Zr=2001;class ki{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ve=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Vr=Math.PI/180,wa=180/Math.PI;function or(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ve[i&255]+Ve[i>>8&255]+Ve[i>>16&255]+Ve[i>>24&255]+"-"+Ve[t&255]+Ve[t>>8&255]+"-"+Ve[t>>16&15|64]+Ve[t>>24&255]+"-"+Ve[e&63|128]+Ve[e>>8&255]+"-"+Ve[e>>16&255]+Ve[e>>24&255]+Ve[n&255]+Ve[n>>8&255]+Ve[n>>16&255]+Ve[n>>24&255]).toLowerCase()}function Ne(i,t,e){return Math.max(t,Math.min(e,i))}function ed(i,t){return(i%t+t)%t}function No(i,t,e){return(1-e)*i+e*t}function Zc(i){return(i&i-1)===0&&i!==0}function Ta(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function ks(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function tn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const nd={DEG2RAD:Vr};class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Kt{constructor(t,e,n,s,r,a,o,c,h){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,h)}set(t,e,n,s,r,a,o,c,h){const l=this.elements;return l[0]=t,l[1]=s,l[2]=o,l[3]=e,l[4]=r,l[5]=c,l[6]=n,l[7]=a,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],h=n[1],l=n[4],u=n[7],f=n[2],p=n[5],_=n[8],g=s[0],m=s[3],d=s[6],v=s[1],x=s[4],M=s[7],C=s[2],w=s[5],A=s[8];return r[0]=a*g+o*v+c*C,r[3]=a*m+o*x+c*w,r[6]=a*d+o*M+c*A,r[1]=h*g+l*v+u*C,r[4]=h*m+l*x+u*w,r[7]=h*d+l*M+u*A,r[2]=f*g+p*v+_*C,r[5]=f*m+p*x+_*w,r[8]=f*d+p*M+_*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8];return e*a*l-e*o*h-n*r*l+n*o*c+s*r*h-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8],u=l*a-o*h,f=o*c-l*r,p=h*r-a*c,_=e*u+n*f+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return t[0]=u*g,t[1]=(s*h-l*n)*g,t[2]=(o*n-s*a)*g,t[3]=f*g,t[4]=(l*e-s*c)*g,t[5]=(s*r-o*e)*g,t[6]=p*g,t[7]=(n*c-h*e)*g,t[8]=(a*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*a+h*o)+a+t,-s*h,s*c,-s*(-h*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(zo.makeScale(t,e)),this}rotate(t){return this.premultiply(zo.makeRotation(-t)),this}translate(t,e){return this.premultiply(zo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const zo=new Kt;function Uh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Qr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function id(){const i=Qr("canvas");return i.style.display="block",i}const Qc={};function Js(i){i in Qc||(Qc[i]=!0,console.warn(i))}const tl=new Kt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),el=new Kt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),gr={[ii]:{transfer:jr,primaries:Kr,toReference:i=>i,fromReference:i=>i},[Ae]:{transfer:fe,primaries:Kr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[co]:{transfer:jr,primaries:Jr,toReference:i=>i.applyMatrix3(el),fromReference:i=>i.applyMatrix3(tl)},[Ba]:{transfer:fe,primaries:Jr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(el),fromReference:i=>i.applyMatrix3(tl).convertLinearToSRGB()}},sd=new Set([ii,co]),le={enabled:!0,_workingColorSpace:ii,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!sd.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=gr[t].toReference,s=gr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return gr[i].primaries},getTransfer:function(i){return i===vn?jr:gr[i].transfer}};function Ss(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Oo(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ji;class Nh{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ji===void 0&&(ji=Qr("canvas")),ji.width=t.width,ji.height=t.height;const n=ji.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ji}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Qr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ss(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ss(e[n]/255)*255):e[n]=Ss(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let rd=0;class zh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:rd++}),this.uuid=or(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Fo(s[a].image)):r.push(Fo(s[a]))}else r=Fo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Fo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Nh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let od=0;class Qe extends ki{constructor(t=Qe.DEFAULT_IMAGE,e=Qe.DEFAULT_MAPPING,n=En,s=En,r=en,a=nr,o=_n,c=mi,h=Qe.DEFAULT_ANISOTROPY,l=vn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:od++}),this.uuid=or(),this.name="",this.source=new zh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof l=="string"?this.colorSpace=l:(Js("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=l===Ii?Ae:vn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Eh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Yr:t.x=t.x-Math.floor(t.x);break;case En:t.x=t.x<0?0:1;break;case ba:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Yr:t.y=t.y-Math.floor(t.y);break;case En:t.y=t.y<0?0:1;break;case ba:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Js("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ae?Ii:Dh}set encoding(t){Js("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Ii?Ae:vn}}Qe.DEFAULT_IMAGE=null;Qe.DEFAULT_MAPPING=Eh;Qe.DEFAULT_ANISOTROPY=1;class pe{constructor(t=0,e=0,n=0,s=1){pe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,h=c[0],l=c[4],u=c[8],f=c[1],p=c[5],_=c[9],g=c[2],m=c[6],d=c[10];if(Math.abs(l-f)<.01&&Math.abs(u-g)<.01&&Math.abs(_-m)<.01){if(Math.abs(l+f)<.1&&Math.abs(u+g)<.1&&Math.abs(_+m)<.1&&Math.abs(h+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(h+1)/2,M=(p+1)/2,C=(d+1)/2,w=(l+f)/4,A=(u+g)/4,U=(_+m)/4;return x>M&&x>C?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=w/n,r=A/n):M>C?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=w/s,r=U/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=A/r,s=U/r),this.set(n,s,r,e),this}let v=Math.sqrt((m-_)*(m-_)+(u-g)*(u-g)+(f-l)*(f-l));return Math.abs(v)<.001&&(v=1),this.x=(m-_)/v,this.y=(u-g)/v,this.z=(f-l)/v,this.w=Math.acos((h+p+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ad extends ki{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new pe(0,0,t,e),this.scissorTest=!1,this.viewport=new pe(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(Js("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Ii?Ae:vn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:en,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Qe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new zh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zi extends ad{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Oh extends Qe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=He,this.minFilter=He,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class cd extends Qe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=He,this.minFilter=He,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Nn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],h=n[s+1],l=n[s+2],u=n[s+3];const f=r[a+0],p=r[a+1],_=r[a+2],g=r[a+3];if(o===0){t[e+0]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=p,t[e+2]=_,t[e+3]=g;return}if(u!==g||c!==f||h!==p||l!==_){let m=1-o;const d=c*f+h*p+l*_+u*g,v=d>=0?1:-1,x=1-d*d;if(x>Number.EPSILON){const C=Math.sqrt(x),w=Math.atan2(C,d*v);m=Math.sin(m*w)/C,o=Math.sin(o*w)/C}const M=o*v;if(c=c*m+f*M,h=h*m+p*M,l=l*m+_*M,u=u*m+g*M,m===1-o){const C=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=C,h*=C,l*=C,u*=C}}t[e]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],c=n[s+1],h=n[s+2],l=n[s+3],u=r[a],f=r[a+1],p=r[a+2],_=r[a+3];return t[e]=o*_+l*u+c*p-h*f,t[e+1]=c*_+l*f+h*u-o*p,t[e+2]=h*_+l*p+o*f-c*u,t[e+3]=l*_-o*u-c*f-h*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,h=o(n/2),l=o(s/2),u=o(r/2),f=c(n/2),p=c(s/2),_=c(r/2);switch(a){case"XYZ":this._x=f*l*u+h*p*_,this._y=h*p*u-f*l*_,this._z=h*l*_+f*p*u,this._w=h*l*u-f*p*_;break;case"YXZ":this._x=f*l*u+h*p*_,this._y=h*p*u-f*l*_,this._z=h*l*_-f*p*u,this._w=h*l*u+f*p*_;break;case"ZXY":this._x=f*l*u-h*p*_,this._y=h*p*u+f*l*_,this._z=h*l*_+f*p*u,this._w=h*l*u-f*p*_;break;case"ZYX":this._x=f*l*u-h*p*_,this._y=h*p*u+f*l*_,this._z=h*l*_-f*p*u,this._w=h*l*u+f*p*_;break;case"YZX":this._x=f*l*u+h*p*_,this._y=h*p*u+f*l*_,this._z=h*l*_-f*p*u,this._w=h*l*u-f*p*_;break;case"XZY":this._x=f*l*u-h*p*_,this._y=h*p*u-f*l*_,this._z=h*l*_+f*p*u,this._w=h*l*u+f*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],h=e[2],l=e[6],u=e[10],f=n+o+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(l-c)*p,this._y=(r-h)*p,this._z=(a-s)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(l-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+h)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(r-h)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+l)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+h)/p,this._y=(c+l)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ne(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,h=e._z,l=e._w;return this._x=n*l+a*o+s*h-r*c,this._y=s*l+a*c+r*o-n*h,this._z=r*l+a*h+n*c-s*o,this._w=a*l-n*o-s*c-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const h=Math.sqrt(c),l=Math.atan2(h,o),u=Math.sin((1-e)*l)/h,f=Math.sin(e*l)/h;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(nl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(nl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,h=2*(a*s-o*n),l=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+c*h+a*u-o*l,this.y=n+c*l+o*h-r*u,this.z=s+c*u+r*l-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Bo.copy(this).projectOnVector(t),this.sub(Bo)}reflect(t){return this.sub(Bo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Bo=new R,nl=new Nn;class Hi{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(xn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(xn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=xn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,xn):xn.fromBufferAttribute(r,a),xn.applyMatrix4(t.matrixWorld),this.expandByPoint(xn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),_r.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),_r.copy(n.boundingBox)),_r.applyMatrix4(t.matrixWorld),this.union(_r)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,xn),xn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Hs),vr.subVectors(this.max,Hs),Ki.subVectors(t.a,Hs),Ji.subVectors(t.b,Hs),Zi.subVectors(t.c,Hs),si.subVectors(Ji,Ki),ri.subVectors(Zi,Ji),yi.subVectors(Ki,Zi);let e=[0,-si.z,si.y,0,-ri.z,ri.y,0,-yi.z,yi.y,si.z,0,-si.x,ri.z,0,-ri.x,yi.z,0,-yi.x,-si.y,si.x,0,-ri.y,ri.x,0,-yi.y,yi.x,0];return!ko(e,Ki,Ji,Zi,vr)||(e=[1,0,0,0,1,0,0,0,1],!ko(e,Ki,Ji,Zi,vr))?!1:(xr.crossVectors(si,ri),e=[xr.x,xr.y,xr.z],ko(e,Ki,Ji,Zi,vr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,xn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(xn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Vn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Vn=[new R,new R,new R,new R,new R,new R,new R,new R],xn=new R,_r=new Hi,Ki=new R,Ji=new R,Zi=new R,si=new R,ri=new R,yi=new R,Hs=new R,vr=new R,xr=new R,Si=new R;function ko(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Si.fromArray(i,r);const o=s.x*Math.abs(Si.x)+s.y*Math.abs(Si.y)+s.z*Math.abs(Si.z),c=t.dot(Si),h=e.dot(Si),l=n.dot(Si);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>o)return!1}return!0}const ld=new Hi,Gs=new R,Ho=new R;class Is{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):ld.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Gs.subVectors(t,this.center);const e=Gs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Gs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ho.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Gs.copy(t.center).add(Ho)),this.expandByPoint(Gs.copy(t.center).sub(Ho))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Wn=new R,Go=new R,Mr=new R,oi=new R,Vo=new R,yr=new R,Wo=new R;class lo{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Wn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Wn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Wn.copy(this.origin).addScaledVector(this.direction,e),Wn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Go.copy(t).add(e).multiplyScalar(.5),Mr.copy(e).sub(t).normalize(),oi.copy(this.origin).sub(Go);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Mr),o=oi.dot(this.direction),c=-oi.dot(Mr),h=oi.lengthSq(),l=Math.abs(1-a*a);let u,f,p,_;if(l>0)if(u=a*c-o,f=a*o-c,_=r*l,u>=0)if(f>=-_)if(f<=_){const g=1/l;u*=g,f*=g,p=u*(u+a*f+2*o)+f*(a*u+f+2*c)+h}else f=r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+h;else f=-r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+h;else f<=-_?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h):f<=_?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+h):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Go).addScaledVector(Mr,f),p}intersectSphere(t,e){Wn.subVectors(t.center,this.origin);const n=Wn.dot(this.direction),s=Wn.dot(Wn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c;const h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,f=this.origin;return h>=0?(n=(t.min.x-f.x)*h,s=(t.max.x-f.x)*h):(n=(t.max.x-f.x)*h,s=(t.min.x-f.x)*h),l>=0?(r=(t.min.y-f.y)*l,a=(t.max.y-f.y)*l):(r=(t.max.y-f.y)*l,a=(t.min.y-f.y)*l),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Wn)!==null}intersectTriangle(t,e,n,s,r){Vo.subVectors(e,t),yr.subVectors(n,t),Wo.crossVectors(Vo,yr);let a=this.direction.dot(Wo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;oi.subVectors(this.origin,t);const c=o*this.direction.dot(yr.crossVectors(oi,yr));if(c<0)return null;const h=o*this.direction.dot(Vo.cross(oi));if(h<0||c+h>a)return null;const l=-o*oi.dot(Wo);return l<0?null:this.at(l/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ce{constructor(t,e,n,s,r,a,o,c,h,l,u,f,p,_,g,m){ce.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,h,l,u,f,p,_,g,m)}set(t,e,n,s,r,a,o,c,h,l,u,f,p,_,g,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=c,d[2]=h,d[6]=l,d[10]=u,d[14]=f,d[3]=p,d[7]=_,d[11]=g,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ce().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Qi.setFromMatrixColumn(t,0).length(),r=1/Qi.setFromMatrixColumn(t,1).length(),a=1/Qi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*l,p=a*u,_=o*l,g=o*u;e[0]=c*l,e[4]=-c*u,e[8]=h,e[1]=p+_*h,e[5]=f-g*h,e[9]=-o*c,e[2]=g-f*h,e[6]=_+p*h,e[10]=a*c}else if(t.order==="YXZ"){const f=c*l,p=c*u,_=h*l,g=h*u;e[0]=f+g*o,e[4]=_*o-p,e[8]=a*h,e[1]=a*u,e[5]=a*l,e[9]=-o,e[2]=p*o-_,e[6]=g+f*o,e[10]=a*c}else if(t.order==="ZXY"){const f=c*l,p=c*u,_=h*l,g=h*u;e[0]=f-g*o,e[4]=-a*u,e[8]=_+p*o,e[1]=p+_*o,e[5]=a*l,e[9]=g-f*o,e[2]=-a*h,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const f=a*l,p=a*u,_=o*l,g=o*u;e[0]=c*l,e[4]=_*h-p,e[8]=f*h+g,e[1]=c*u,e[5]=g*h+f,e[9]=p*h-_,e[2]=-h,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,p=a*h,_=o*c,g=o*h;e[0]=c*l,e[4]=g-f*u,e[8]=_*u+p,e[1]=u,e[5]=a*l,e[9]=-o*l,e[2]=-h*l,e[6]=p*u+_,e[10]=f-g*u}else if(t.order==="XZY"){const f=a*c,p=a*h,_=o*c,g=o*h;e[0]=c*l,e[4]=-u,e[8]=h*l,e[1]=f*u+g,e[5]=a*l,e[9]=p*u-_,e[2]=_*u-p,e[6]=o*l,e[10]=g*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(hd,t,ud)}lookAt(t,e,n){const s=this.elements;return on.subVectors(t,e),on.lengthSq()===0&&(on.z=1),on.normalize(),ai.crossVectors(n,on),ai.lengthSq()===0&&(Math.abs(n.z)===1?on.x+=1e-4:on.z+=1e-4,on.normalize(),ai.crossVectors(n,on)),ai.normalize(),Sr.crossVectors(on,ai),s[0]=ai.x,s[4]=Sr.x,s[8]=on.x,s[1]=ai.y,s[5]=Sr.y,s[9]=on.y,s[2]=ai.z,s[6]=Sr.z,s[10]=on.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],h=n[12],l=n[1],u=n[5],f=n[9],p=n[13],_=n[2],g=n[6],m=n[10],d=n[14],v=n[3],x=n[7],M=n[11],C=n[15],w=s[0],A=s[4],U=s[8],y=s[12],b=s[1],H=s[5],G=s[9],K=s[13],I=s[2],F=s[6],W=s[10],Y=s[14],$=s[3],q=s[7],j=s[11],ot=s[15];return r[0]=a*w+o*b+c*I+h*$,r[4]=a*A+o*H+c*F+h*q,r[8]=a*U+o*G+c*W+h*j,r[12]=a*y+o*K+c*Y+h*ot,r[1]=l*w+u*b+f*I+p*$,r[5]=l*A+u*H+f*F+p*q,r[9]=l*U+u*G+f*W+p*j,r[13]=l*y+u*K+f*Y+p*ot,r[2]=_*w+g*b+m*I+d*$,r[6]=_*A+g*H+m*F+d*q,r[10]=_*U+g*G+m*W+d*j,r[14]=_*y+g*K+m*Y+d*ot,r[3]=v*w+x*b+M*I+C*$,r[7]=v*A+x*H+M*F+C*q,r[11]=v*U+x*G+M*W+C*j,r[15]=v*y+x*K+M*Y+C*ot,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],h=t[13],l=t[2],u=t[6],f=t[10],p=t[14],_=t[3],g=t[7],m=t[11],d=t[15];return _*(+r*c*u-s*h*u-r*o*f+n*h*f+s*o*p-n*c*p)+g*(+e*c*p-e*h*f+r*a*f-s*a*p+s*h*l-r*c*l)+m*(+e*h*u-e*o*p-r*a*u+n*a*p+r*o*l-n*h*l)+d*(-s*o*l-e*c*u+e*o*f+s*a*u-n*a*f+n*c*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],l=t[8],u=t[9],f=t[10],p=t[11],_=t[12],g=t[13],m=t[14],d=t[15],v=u*m*h-g*f*h+g*c*p-o*m*p-u*c*d+o*f*d,x=_*f*h-l*m*h-_*c*p+a*m*p+l*c*d-a*f*d,M=l*g*h-_*u*h+_*o*p-a*g*p-l*o*d+a*u*d,C=_*u*c-l*g*c-_*o*f+a*g*f+l*o*m-a*u*m,w=e*v+n*x+s*M+r*C;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return t[0]=v*A,t[1]=(g*f*r-u*m*r-g*s*p+n*m*p+u*s*d-n*f*d)*A,t[2]=(o*m*r-g*c*r+g*s*h-n*m*h-o*s*d+n*c*d)*A,t[3]=(u*c*r-o*f*r-u*s*h+n*f*h+o*s*p-n*c*p)*A,t[4]=x*A,t[5]=(l*m*r-_*f*r+_*s*p-e*m*p-l*s*d+e*f*d)*A,t[6]=(_*c*r-a*m*r-_*s*h+e*m*h+a*s*d-e*c*d)*A,t[7]=(a*f*r-l*c*r+l*s*h-e*f*h-a*s*p+e*c*p)*A,t[8]=M*A,t[9]=(_*u*r-l*g*r-_*n*p+e*g*p+l*n*d-e*u*d)*A,t[10]=(a*g*r-_*o*r+_*n*h-e*g*h-a*n*d+e*o*d)*A,t[11]=(l*o*r-a*u*r-l*n*h+e*u*h+a*n*p-e*o*p)*A,t[12]=C*A,t[13]=(l*g*s-_*u*s+_*n*f-e*g*f-l*n*m+e*u*m)*A,t[14]=(_*o*s-a*g*s-_*n*c+e*g*c+a*n*m-e*o*m)*A,t[15]=(a*u*s-l*o*s+l*n*c-e*u*c-a*n*f+e*o*f)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,h=r*a,l=r*o;return this.set(h*a+n,h*o-s*c,h*c+s*o,0,h*o+s*c,l*o+n,l*c-s*a,0,h*c-s*o,l*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,h=r+r,l=a+a,u=o+o,f=r*h,p=r*l,_=r*u,g=a*l,m=a*u,d=o*u,v=c*h,x=c*l,M=c*u,C=n.x,w=n.y,A=n.z;return s[0]=(1-(g+d))*C,s[1]=(p+M)*C,s[2]=(_-x)*C,s[3]=0,s[4]=(p-M)*w,s[5]=(1-(f+d))*w,s[6]=(m+v)*w,s[7]=0,s[8]=(_+x)*A,s[9]=(m-v)*A,s[10]=(1-(f+g))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Qi.set(s[0],s[1],s[2]).length();const a=Qi.set(s[4],s[5],s[6]).length(),o=Qi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Mn.copy(this);const h=1/r,l=1/a,u=1/o;return Mn.elements[0]*=h,Mn.elements[1]*=h,Mn.elements[2]*=h,Mn.elements[4]*=l,Mn.elements[5]*=l,Mn.elements[6]*=l,Mn.elements[8]*=u,Mn.elements[9]*=u,Mn.elements[10]*=u,e.setFromRotationMatrix(Mn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Qn){const c=this.elements,h=2*r/(e-t),l=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let p,_;if(o===Qn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Zr)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Qn){const c=this.elements,h=1/(e-t),l=1/(n-s),u=1/(a-r),f=(e+t)*h,p=(n+s)*l;let _,g;if(o===Qn)_=(a+r)*u,g=-2*u;else if(o===Zr)_=r*u,g=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=g,c[14]=-_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Qi=new R,Mn=new ce,hd=new R(0,0,0),ud=new R(1,1,1),ai=new R,Sr=new R,on=new R,il=new ce,sl=new Nn;class Us{constructor(t=0,e=0,n=0,s=Us.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],l=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ne(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ne(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-l,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return il.makeRotationFromQuaternion(t),this.setFromRotationMatrix(il,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return sl.setFromEuler(this),this.setFromQuaternion(sl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Us.DEFAULT_ORDER="XYZ";class ka{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let fd=0;const rl=new R,ts=new Nn,Xn=new ce,br=new R,Vs=new R,dd=new R,pd=new Nn,ol=new R(1,0,0),al=new R(0,1,0),cl=new R(0,0,1),md={type:"added"},gd={type:"removed"};class ze extends ki{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fd++}),this.uuid=or(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ze.DEFAULT_UP.clone();const t=new R,e=new Us,n=new Nn,s=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ce},normalMatrix:{value:new Kt}}),this.matrix=new ce,this.matrixWorld=new ce,this.matrixAutoUpdate=ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ka,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ts.setFromAxisAngle(t,e),this.quaternion.multiply(ts),this}rotateOnWorldAxis(t,e){return ts.setFromAxisAngle(t,e),this.quaternion.premultiply(ts),this}rotateX(t){return this.rotateOnAxis(ol,t)}rotateY(t){return this.rotateOnAxis(al,t)}rotateZ(t){return this.rotateOnAxis(cl,t)}translateOnAxis(t,e){return rl.copy(t).applyQuaternion(this.quaternion),this.position.add(rl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ol,t)}translateY(t){return this.translateOnAxis(al,t)}translateZ(t){return this.translateOnAxis(cl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?br.copy(t):br.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Vs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt(Vs,br,this.up):Xn.lookAt(br,Vs,this.up),this.quaternion.setFromRotationMatrix(Xn),s&&(Xn.extractRotation(s.matrixWorld),ts.setFromRotationMatrix(Xn),this.quaternion.premultiply(ts.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(md)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(gd)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Xn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vs,t,dd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vs,pd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){const u=c[h];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),h=a(t.textures),l=a(t.images),u=a(t.shapes),f=a(t.skeletons),p=a(t.animations),_=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),l.length>0&&(n.images=l),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=s,n;function a(o){const c=[];for(const h in o){const l=o[h];delete l.metadata,c.push(l)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ze.DEFAULT_UP=new R(0,1,0);ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const yn=new R,$n=new R,Xo=new R,qn=new R,es=new R,ns=new R,ll=new R,$o=new R,qo=new R,Yo=new R;let Er=!1;class bn{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),yn.subVectors(t,e),s.cross(yn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){yn.subVectors(s,e),$n.subVectors(n,e),Xo.subVectors(t,e);const a=yn.dot(yn),o=yn.dot($n),c=yn.dot(Xo),h=$n.dot($n),l=$n.dot(Xo),u=a*h-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(h*c-o*l)*f,_=(a*l-o*c)*f;return r.set(1-p-_,_,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,qn)===null?!1:qn.x>=0&&qn.y>=0&&qn.x+qn.y<=1}static getUV(t,e,n,s,r,a,o,c){return Er===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Er=!0),this.getInterpolation(t,e,n,s,r,a,o,c)}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,qn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,qn.x),c.addScaledVector(a,qn.y),c.addScaledVector(o,qn.z),c)}static isFrontFacing(t,e,n,s){return yn.subVectors(n,e),$n.subVectors(t,e),yn.cross($n).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return yn.subVectors(this.c,this.b),$n.subVectors(this.a,this.b),yn.cross($n).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return bn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return bn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Er===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Er=!0),bn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return bn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return bn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return bn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;es.subVectors(s,n),ns.subVectors(r,n),$o.subVectors(t,n);const c=es.dot($o),h=ns.dot($o);if(c<=0&&h<=0)return e.copy(n);qo.subVectors(t,s);const l=es.dot(qo),u=ns.dot(qo);if(l>=0&&u<=l)return e.copy(s);const f=c*u-l*h;if(f<=0&&c>=0&&l<=0)return a=c/(c-l),e.copy(n).addScaledVector(es,a);Yo.subVectors(t,r);const p=es.dot(Yo),_=ns.dot(Yo);if(_>=0&&p<=_)return e.copy(r);const g=p*h-c*_;if(g<=0&&h>=0&&_<=0)return o=h/(h-_),e.copy(n).addScaledVector(ns,o);const m=l*_-p*u;if(m<=0&&u-l>=0&&p-_>=0)return ll.subVectors(r,s),o=(u-l)/(u-l+(p-_)),e.copy(s).addScaledVector(ll,o);const d=1/(m+g+f);return a=g*d,o=f*d,e.copy(n).addScaledVector(es,a).addScaledVector(ns,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Fh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ci={h:0,s:0,l:0},wr={h:0,s:0,l:0};function jo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class $t{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ae){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=le.workingColorSpace){return this.r=t,this.g=e,this.b=n,le.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=le.workingColorSpace){if(t=ed(t,1),e=Ne(e,0,1),n=Ne(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=jo(a,r,t+1/3),this.g=jo(a,r,t),this.b=jo(a,r,t-1/3)}return le.toWorkingColorSpace(this,s),this}setStyle(t,e=Ae){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ae){const n=Fh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ss(t.r),this.g=Ss(t.g),this.b=Ss(t.b),this}copyLinearToSRGB(t){return this.r=Oo(t.r),this.g=Oo(t.g),this.b=Oo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ae){return le.fromWorkingColorSpace(We.copy(this),t),Math.round(Ne(We.r*255,0,255))*65536+Math.round(Ne(We.g*255,0,255))*256+Math.round(Ne(We.b*255,0,255))}getHexString(t=Ae){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.fromWorkingColorSpace(We.copy(this),e);const n=We.r,s=We.g,r=We.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,h;const l=(o+a)/2;if(o===a)c=0,h=0;else{const u=a-o;switch(h=l<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=h,t.l=l,t}getRGB(t,e=le.workingColorSpace){return le.fromWorkingColorSpace(We.copy(this),e),t.r=We.r,t.g=We.g,t.b=We.b,t}getStyle(t=Ae){le.fromWorkingColorSpace(We.copy(this),t);const e=We.r,n=We.g,s=We.b;return t!==Ae?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ci),this.setHSL(ci.h+t,ci.s+e,ci.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ci),t.getHSL(wr);const n=No(ci.h,wr.h,e),s=No(ci.s,wr.s,e),r=No(ci.l,wr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const We=new $t;$t.NAMES=Fh;let _d=0;class Gi extends ki{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_d++}),this.uuid=or(),this.name="",this.type="Material",this.blending=ys,this.side=_i,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=xa,this.blendDst=Ma,this.blendEquation=Ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $t(0,0,0),this.blendAlpha=0,this.depthFunc=qr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yi,this.stencilZFail=Yi,this.stencilZPass=Yi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ys&&(n.blending=this.blending),this.side!==_i&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==xa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ma&&(n.blendDst=this.blendDst),this.blendEquation!==Ci&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==qr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==jc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Yi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Yi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Yi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Je extends Gi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=za,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Te=new R,Tr=new ht;class fn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Kc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=fi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Tr.fromBufferAttribute(this,e),Tr.applyMatrix3(t),this.setXY(e,Tr.x,Tr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix3(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ks(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=tn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ks(e,this.array)),e}setX(t,e){return this.normalized&&(e=tn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ks(e,this.array)),e}setY(t,e){return this.normalized&&(e=tn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ks(e,this.array)),e}setZ(t,e){return this.normalized&&(e=tn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ks(e,this.array)),e}setW(t,e){return this.normalized&&(e=tn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=tn(e,this.array),n=tn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=tn(e,this.array),n=tn(n,this.array),s=tn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=tn(e,this.array),n=tn(n,this.array),s=tn(s,this.array),r=tn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Kc&&(t.usage=this.usage),t}}class Bh extends fn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class kh extends fn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ie extends fn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let vd=0;const gn=new ce,Ko=new ze,is=new R,an=new Hi,Ws=new Hi,Ue=new R;class Ee extends ki{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vd++}),this.uuid=or(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Uh(t)?kh:Bh)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return gn.makeRotationFromQuaternion(t),this.applyMatrix4(gn),this}rotateX(t){return gn.makeRotationX(t),this.applyMatrix4(gn),this}rotateY(t){return gn.makeRotationY(t),this.applyMatrix4(gn),this}rotateZ(t){return gn.makeRotationZ(t),this.applyMatrix4(gn),this}translate(t,e,n){return gn.makeTranslation(t,e,n),this.applyMatrix4(gn),this}scale(t,e,n){return gn.makeScale(t,e,n),this.applyMatrix4(gn),this}lookAt(t){return Ko.lookAt(t),Ko.updateMatrix(),this.applyMatrix4(Ko.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(is).negate(),this.translate(is.x,is.y,is.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ie(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];an.setFromBufferAttribute(r),this.morphTargetsRelative?(Ue.addVectors(this.boundingBox.min,an.min),this.boundingBox.expandByPoint(Ue),Ue.addVectors(this.boundingBox.max,an.max),this.boundingBox.expandByPoint(Ue)):(this.boundingBox.expandByPoint(an.min),this.boundingBox.expandByPoint(an.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Is);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(an.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Ws.setFromBufferAttribute(o),this.morphTargetsRelative?(Ue.addVectors(an.min,Ws.min),an.expandByPoint(Ue),Ue.addVectors(an.max,Ws.max),an.expandByPoint(Ue)):(an.expandByPoint(Ws.min),an.expandByPoint(Ws.max))}an.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ue.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ue));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let h=0,l=o.count;h<l;h++)Ue.fromBufferAttribute(o,h),c&&(is.fromBufferAttribute(t,h),Ue.add(is)),s=Math.max(s,n.distanceToSquared(Ue))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new fn(new Float32Array(4*o),4));const c=this.getAttribute("tangent").array,h=[],l=[];for(let b=0;b<o;b++)h[b]=new R,l[b]=new R;const u=new R,f=new R,p=new R,_=new ht,g=new ht,m=new ht,d=new R,v=new R;function x(b,H,G){u.fromArray(s,b*3),f.fromArray(s,H*3),p.fromArray(s,G*3),_.fromArray(a,b*2),g.fromArray(a,H*2),m.fromArray(a,G*2),f.sub(u),p.sub(u),g.sub(_),m.sub(_);const K=1/(g.x*m.y-m.x*g.y);isFinite(K)&&(d.copy(f).multiplyScalar(m.y).addScaledVector(p,-g.y).multiplyScalar(K),v.copy(p).multiplyScalar(g.x).addScaledVector(f,-m.x).multiplyScalar(K),h[b].add(d),h[H].add(d),h[G].add(d),l[b].add(v),l[H].add(v),l[G].add(v))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let b=0,H=M.length;b<H;++b){const G=M[b],K=G.start,I=G.count;for(let F=K,W=K+I;F<W;F+=3)x(n[F+0],n[F+1],n[F+2])}const C=new R,w=new R,A=new R,U=new R;function y(b){A.fromArray(r,b*3),U.copy(A);const H=h[b];C.copy(H),C.sub(A.multiplyScalar(A.dot(H))).normalize(),w.crossVectors(U,H);const K=w.dot(l[b])<0?-1:1;c[b*4]=C.x,c[b*4+1]=C.y,c[b*4+2]=C.z,c[b*4+3]=K}for(let b=0,H=M.length;b<H;++b){const G=M[b],K=G.start,I=G.count;for(let F=K,W=K+I;F<W;F+=3)y(n[F+0]),y(n[F+1]),y(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new fn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new R,r=new R,a=new R,o=new R,c=new R,h=new R,l=new R,u=new R;if(t)for(let f=0,p=t.count;f<p;f+=3){const _=t.getX(f+0),g=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,_),r.fromBufferAttribute(e,g),a.fromBufferAttribute(e,m),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),o.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),h.fromBufferAttribute(n,m),o.add(l),c.add(l),h.add(l),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(g,c.x,c.y,c.z),n.setXYZ(m,h.x,h.y,h.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),l.subVectors(a,r),u.subVectors(s,r),l.cross(u),n.setXYZ(f+0,l.x,l.y,l.z),n.setXYZ(f+1,l.x,l.y,l.z),n.setXYZ(f+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ue.fromBufferAttribute(t,e),Ue.normalize(),t.setXYZ(e,Ue.x,Ue.y,Ue.z)}toNonIndexed(){function t(o,c){const h=o.array,l=o.itemSize,u=o.normalized,f=new h.constructor(c.length*l);let p=0,_=0;for(let g=0,m=c.length;g<m;g++){o.isInterleavedBufferAttribute?p=c[g]*o.data.stride+o.offset:p=c[g]*l;for(let d=0;d<l;d++)f[_++]=h[p++]}return new fn(f,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ee,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],h=t(c,n);e.setAttribute(o,h)}const r=this.morphAttributes;for(const o in r){const c=[],h=r[o];for(let l=0,u=h.length;l<u;l++){const f=h[l],p=t(f,n);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const h=a[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const h=n[c];t.data.attributes[c]=h.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],l=[];for(let u=0,f=h.length;u<f;u++){const p=h[u];l.push(p.toJSON(t.data))}l.length>0&&(s[c]=l,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const h in s){const l=s[h];this.setAttribute(h,l.clone(e))}const r=t.morphAttributes;for(const h in r){const l=[],u=r[h];for(let f=0,p=u.length;f<p;f++)l.push(u[f].clone(e));this.morphAttributes[h]=l}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let h=0,l=a.length;h<l;h++){const u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hl=new ce,bi=new lo,Ar=new Is,ul=new R,ss=new R,rs=new R,os=new R,Jo=new R,Rr=new R,Cr=new ht,Pr=new ht,Lr=new ht,fl=new R,dl=new R,pl=new R,Dr=new R,Ir=new R;class kt extends ze{constructor(t=new Ee,e=new Je){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Rr.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const l=o[c],u=r[c];l!==0&&(Jo.fromBufferAttribute(u,t),a?Rr.addScaledVector(Jo,l):Rr.addScaledVector(Jo.sub(e),l))}e.add(Rr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ar.copy(n.boundingSphere),Ar.applyMatrix4(r),bi.copy(t.ray).recast(t.near),!(Ar.containsPoint(bi.origin)===!1&&(bi.intersectSphere(Ar,ul)===null||bi.origin.distanceToSquared(ul)>(t.far-t.near)**2))&&(hl.copy(r).invert(),bi.copy(t.ray).applyMatrix4(hl),!(n.boundingBox!==null&&bi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,bi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,g=f.length;_<g;_++){const m=f[_],d=a[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let M=v,C=x;M<C;M+=3){const w=o.getX(M),A=o.getX(M+1),U=o.getX(M+2);s=Ur(this,d,t,n,h,l,u,w,A,U),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),g=Math.min(o.count,p.start+p.count);for(let m=_,d=g;m<d;m+=3){const v=o.getX(m),x=o.getX(m+1),M=o.getX(m+2);s=Ur(this,a,t,n,h,l,u,v,x,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,g=f.length;_<g;_++){const m=f[_],d=a[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let M=v,C=x;M<C;M+=3){const w=M,A=M+1,U=M+2;s=Ur(this,d,t,n,h,l,u,w,A,U),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),g=Math.min(c.count,p.start+p.count);for(let m=_,d=g;m<d;m+=3){const v=m,x=m+1,M=m+2;s=Ur(this,a,t,n,h,l,u,v,x,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function xd(i,t,e,n,s,r,a,o){let c;if(t.side===nn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===_i,o),c===null)return null;Ir.copy(o),Ir.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(Ir);return h<e.near||h>e.far?null:{distance:h,point:Ir.clone(),object:i}}function Ur(i,t,e,n,s,r,a,o,c,h){i.getVertexPosition(o,ss),i.getVertexPosition(c,rs),i.getVertexPosition(h,os);const l=xd(i,t,e,n,ss,rs,os,Dr);if(l){s&&(Cr.fromBufferAttribute(s,o),Pr.fromBufferAttribute(s,c),Lr.fromBufferAttribute(s,h),l.uv=bn.getInterpolation(Dr,ss,rs,os,Cr,Pr,Lr,new ht)),r&&(Cr.fromBufferAttribute(r,o),Pr.fromBufferAttribute(r,c),Lr.fromBufferAttribute(r,h),l.uv1=bn.getInterpolation(Dr,ss,rs,os,Cr,Pr,Lr,new ht),l.uv2=l.uv1),a&&(fl.fromBufferAttribute(a,o),dl.fromBufferAttribute(a,c),pl.fromBufferAttribute(a,h),l.normal=bn.getInterpolation(Dr,ss,rs,os,fl,dl,pl,new R),l.normal.dot(n.direction)>0&&l.normal.multiplyScalar(-1));const u={a:o,b:c,c:h,normal:new R,materialIndex:0};bn.getNormal(ss,rs,os,u.normal),l.face=u}return l}class zn extends Ee{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],h=[],l=[],u=[];let f=0,p=0;_("z","y","x",-1,-1,n,e,t,a,r,0),_("z","y","x",1,-1,n,e,-t,a,r,1),_("x","z","y",1,1,t,n,e,s,a,2),_("x","z","y",1,-1,t,n,-e,s,a,3),_("x","y","z",1,-1,t,e,n,s,r,4),_("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ie(h,3)),this.setAttribute("normal",new ie(l,3)),this.setAttribute("uv",new ie(u,2));function _(g,m,d,v,x,M,C,w,A,U,y){const b=M/A,H=C/U,G=M/2,K=C/2,I=w/2,F=A+1,W=U+1;let Y=0,$=0;const q=new R;for(let j=0;j<W;j++){const ot=j*H-K;for(let ct=0;ct<F;ct++){const X=ct*b-G;q[g]=X*v,q[m]=ot*x,q[d]=I,h.push(q.x,q.y,q.z),q[g]=0,q[m]=0,q[d]=w>0?1:-1,l.push(q.x,q.y,q.z),u.push(ct/A),u.push(1-j/U),Y+=1}}for(let j=0;j<U;j++)for(let ot=0;ot<A;ot++){const ct=f+ot+F*j,X=f+ot+F*(j+1),J=f+(ot+1)+F*(j+1),mt=f+(ot+1)+F*j;c.push(ct,X,mt),c.push(X,J,mt),$+=6}o.addGroup(p,$,y),p+=$,f+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Cs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ke(i){const t={};for(let e=0;e<i.length;e++){const n=Cs(i[e]);for(const s in n)t[s]=n[s]}return t}function Md(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Hh(i){return i.getRenderTarget()===null?i.outputColorSpace:le.workingColorSpace}const yd={clone:Cs,merge:Ke};var Sd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,bd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Oi extends Gi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Sd,this.fragmentShader=bd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Cs(t.uniforms),this.uniformsGroups=Md(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Gh extends ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ce,this.projectionMatrix=new ce,this.projectionMatrixInverse=new ce,this.coordinateSystem=Qn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class cn extends Gh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=wa*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Vr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return wa*2*Math.atan(Math.tan(Vr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Vr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/h,s*=a.width/c,n*=a.height/h}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const as=-90,cs=1;class Ed extends ze{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new cn(as,cs,t,e);s.layers=this.layers,this.add(s);const r=new cn(as,cs,t,e);r.layers=this.layers,this.add(r);const a=new cn(as,cs,t,e);a.layers=this.layers,this.add(a);const o=new cn(as,cs,t,e);o.layers=this.layers,this.add(o);const c=new cn(as,cs,t,e);c.layers=this.layers,this.add(c);const h=new cn(as,cs,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(const h of e)this.remove(h);if(t===Qn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Zr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,h,l]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,s),t.render(e,l),t.setRenderTarget(u,f,p),t.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class Vh extends Qe{constructor(t,e,n,s,r,a,o,c,h,l){t=t!==void 0?t:[],e=e!==void 0?e:Ts,super(t,e,n,s,r,a,o,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class wd extends zi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(Js("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Ii?Ae:vn),this.texture=new Vh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:en}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new zn(5,5,5),r=new Oi({name:"CubemapFromEquirect",uniforms:Cs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:nn,blending:di});r.uniforms.tEquirect.value=e;const a=new kt(s,r),o=e.minFilter;return e.minFilter===nr&&(e.minFilter=en),new Ed(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const Zo=new R,Td=new R,Ad=new Kt;class hi{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Zo.subVectors(n,e).cross(Td.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Zo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Ad.getNormalMatrix(t),s=this.coplanarPoint(Zo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ei=new Is,Nr=new R;class Ha{constructor(t=new hi,e=new hi,n=new hi,s=new hi,r=new hi,a=new hi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Qn){const n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],h=s[4],l=s[5],u=s[6],f=s[7],p=s[8],_=s[9],g=s[10],m=s[11],d=s[12],v=s[13],x=s[14],M=s[15];if(n[0].setComponents(c-r,f-h,m-p,M-d).normalize(),n[1].setComponents(c+r,f+h,m+p,M+d).normalize(),n[2].setComponents(c+a,f+l,m+_,M+v).normalize(),n[3].setComponents(c-a,f-l,m-_,M-v).normalize(),n[4].setComponents(c-o,f-u,m-g,M-x).normalize(),e===Qn)n[5].setComponents(c+o,f+u,m+g,M+x).normalize();else if(e===Zr)n[5].setComponents(o,u,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ei.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ei.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ei)}intersectsSprite(t){return Ei.center.set(0,0,0),Ei.radius=.7071067811865476,Ei.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ei)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Nr.x=s.normal.x>0?t.max.x:t.min.x,Nr.y=s.normal.y>0?t.max.y:t.min.y,Nr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Nr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Wh(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Rd(i,t){const e=t.isWebGL2,n=new WeakMap;function s(h,l){const u=h.array,f=h.usage,p=u.byteLength,_=i.createBuffer();i.bindBuffer(l,_),i.bufferData(l,u,f),h.onUploadCallback();let g;if(u instanceof Float32Array)g=i.FLOAT;else if(u instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(e)g=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)g=i.SHORT;else if(u instanceof Uint32Array)g=i.UNSIGNED_INT;else if(u instanceof Int32Array)g=i.INT;else if(u instanceof Int8Array)g=i.BYTE;else if(u instanceof Uint8Array)g=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)g=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:_,type:g,bytesPerElement:u.BYTES_PER_ELEMENT,version:h.version,size:p}}function r(h,l,u){const f=l.array,p=l._updateRange,_=l.updateRanges;if(i.bindBuffer(u,h),p.count===-1&&_.length===0&&i.bufferSubData(u,0,f),_.length!==0){for(let g=0,m=_.length;g<m;g++){const d=_[g];e?i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}l.clearUpdateRanges()}p.count!==-1&&(e?i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f,p.offset,p.count):i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f.subarray(p.offset,p.offset+p.count)),p.count=-1),l.onUploadCallback()}function a(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function o(h){h.isInterleavedBufferAttribute&&(h=h.data);const l=n.get(h);l&&(i.deleteBuffer(l.buffer),n.delete(h))}function c(h,l){if(h.isGLBufferAttribute){const f=n.get(h);(!f||f.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);const u=n.get(h);if(u===void 0)n.set(h,s(h,l));else if(u.version<h.version){if(u.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,h,l),u.version=h.version}}return{get:a,remove:o,update:c}}class vi extends Ee{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),h=o+1,l=c+1,u=t/o,f=e/c,p=[],_=[],g=[],m=[];for(let d=0;d<l;d++){const v=d*f-a;for(let x=0;x<h;x++){const M=x*u-r;_.push(M,-v,0),g.push(0,0,1),m.push(x/o),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let v=0;v<o;v++){const x=v+h*d,M=v+h*(d+1),C=v+1+h*(d+1),w=v+1+h*d;p.push(x,M,w),p.push(M,C,w)}this.setIndex(p),this.setAttribute("position",new ie(_,3)),this.setAttribute("normal",new ie(g,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vi(t.width,t.height,t.widthSegments,t.heightSegments)}}var Cd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Pd=`#ifdef USE_ALPHAHASH
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
#endif`,Ld=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Dd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Id=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Ud=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Nd=`#ifdef USE_AOMAP
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
#endif`,zd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Od=`#ifdef USE_BATCHING
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
#endif`,Fd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Bd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,kd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Gd=`#ifdef USE_IRIDESCENCE
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
#endif`,Wd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$d=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Yd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,jd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Kd=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Zd=`#define PI 3.141592653589793
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
} // validated`,Qd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,tp=`vec3 transformedNormal = objectNormal;
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
#endif`,ep=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,np=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ip=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,sp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,rp="gl_FragColor = linearToOutputTexel( gl_FragColor );",op=`
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
}`,ap=`#ifdef USE_ENVMAP
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
#endif`,cp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,lp=`#ifdef USE_ENVMAP
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
#endif`,hp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,up=`#ifdef USE_ENVMAP
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
#endif`,fp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,dp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,pp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,mp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gp=`#ifdef USE_GRADIENTMAP
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
}`,_p=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,vp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,xp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Mp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yp=`uniform bool receiveShadow;
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
#endif`,Sp=`#ifdef USE_ENVMAP
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
#endif`,bp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ep=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Tp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ap=`PhysicalMaterial material;
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
#endif`,Rp=`struct PhysicalMaterial {
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
}`,Cp=`
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
#endif`,Pp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Lp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Dp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ip=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Up=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Np=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,zp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Op=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Fp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Bp=`#if defined( USE_POINTS_UV )
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
#endif`,kp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Gp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vp=`#ifdef USE_MORPHNORMALS
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
#endif`,Wp=`#ifdef USE_MORPHTARGETS
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
#endif`,Xp=`#ifdef USE_MORPHTARGETS
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
#endif`,$p=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,qp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Yp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Jp=`#ifdef USE_NORMALMAP
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
#endif`,Zp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,em=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,nm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,im=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,sm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,rm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,om=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,am=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,lm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,hm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,um=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,dm=`float getShadowMask() {
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
}`,pm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,mm=`#ifdef USE_SKINNING
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
#endif`,gm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_m=`#ifdef USE_SKINNING
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
#endif`,vm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,xm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Mm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ym=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Sm=`#ifdef USE_TRANSMISSION
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
#endif`,bm=`#ifdef USE_TRANSMISSION
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
#endif`,Em=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,wm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Am=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Rm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Cm=`uniform sampler2D t2D;
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
}`,Pm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Dm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Im=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Um=`#include <common>
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
}`,Nm=`#if DEPTH_PACKING == 3200
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
}`,zm=`#define DISTANCE
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
}`,Om=`#define DISTANCE
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
}`,Fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,km=`uniform float scale;
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
}`,Hm=`uniform vec3 diffuse;
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
}`,Gm=`#include <common>
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
}`,Vm=`uniform vec3 diffuse;
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
}`,Wm=`#define LAMBERT
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
}`,Xm=`#define LAMBERT
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
}`,$m=`#define MATCAP
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
}`,qm=`#define MATCAP
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
}`,Ym=`#define NORMAL
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
}`,jm=`#define NORMAL
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
}`,Km=`#define PHONG
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
}`,Jm=`#define PHONG
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
}`,Zm=`#define STANDARD
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
}`,Qm=`#define STANDARD
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
}`,r0=`uniform vec3 color;
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
}`,o0=`uniform float rotation;
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
}`,a0=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:Cd,alphahash_pars_fragment:Pd,alphamap_fragment:Ld,alphamap_pars_fragment:Dd,alphatest_fragment:Id,alphatest_pars_fragment:Ud,aomap_fragment:Nd,aomap_pars_fragment:zd,batching_pars_vertex:Od,batching_vertex:Fd,begin_vertex:Bd,beginnormal_vertex:kd,bsdfs:Hd,iridescence_fragment:Gd,bumpmap_pars_fragment:Vd,clipping_planes_fragment:Wd,clipping_planes_pars_fragment:Xd,clipping_planes_pars_vertex:$d,clipping_planes_vertex:qd,color_fragment:Yd,color_pars_fragment:jd,color_pars_vertex:Kd,color_vertex:Jd,common:Zd,cube_uv_reflection_fragment:Qd,defaultnormal_vertex:tp,displacementmap_pars_vertex:ep,displacementmap_vertex:np,emissivemap_fragment:ip,emissivemap_pars_fragment:sp,colorspace_fragment:rp,colorspace_pars_fragment:op,envmap_fragment:ap,envmap_common_pars_fragment:cp,envmap_pars_fragment:lp,envmap_pars_vertex:hp,envmap_physical_pars_fragment:Sp,envmap_vertex:up,fog_vertex:fp,fog_pars_vertex:dp,fog_fragment:pp,fog_pars_fragment:mp,gradientmap_pars_fragment:gp,lightmap_fragment:_p,lightmap_pars_fragment:vp,lights_lambert_fragment:xp,lights_lambert_pars_fragment:Mp,lights_pars_begin:yp,lights_toon_fragment:bp,lights_toon_pars_fragment:Ep,lights_phong_fragment:wp,lights_phong_pars_fragment:Tp,lights_physical_fragment:Ap,lights_physical_pars_fragment:Rp,lights_fragment_begin:Cp,lights_fragment_maps:Pp,lights_fragment_end:Lp,logdepthbuf_fragment:Dp,logdepthbuf_pars_fragment:Ip,logdepthbuf_pars_vertex:Up,logdepthbuf_vertex:Np,map_fragment:zp,map_pars_fragment:Op,map_particle_fragment:Fp,map_particle_pars_fragment:Bp,metalnessmap_fragment:kp,metalnessmap_pars_fragment:Hp,morphcolor_vertex:Gp,morphnormal_vertex:Vp,morphtarget_pars_vertex:Wp,morphtarget_vertex:Xp,normal_fragment_begin:$p,normal_fragment_maps:qp,normal_pars_fragment:Yp,normal_pars_vertex:jp,normal_vertex:Kp,normalmap_pars_fragment:Jp,clearcoat_normal_fragment_begin:Zp,clearcoat_normal_fragment_maps:Qp,clearcoat_pars_fragment:tm,iridescence_pars_fragment:em,opaque_fragment:nm,packing:im,premultiplied_alpha_fragment:sm,project_vertex:rm,dithering_fragment:om,dithering_pars_fragment:am,roughnessmap_fragment:cm,roughnessmap_pars_fragment:lm,shadowmap_pars_fragment:hm,shadowmap_pars_vertex:um,shadowmap_vertex:fm,shadowmask_pars_fragment:dm,skinbase_vertex:pm,skinning_pars_vertex:mm,skinning_vertex:gm,skinnormal_vertex:_m,specularmap_fragment:vm,specularmap_pars_fragment:xm,tonemapping_fragment:Mm,tonemapping_pars_fragment:ym,transmission_fragment:Sm,transmission_pars_fragment:bm,uv_pars_fragment:Em,uv_pars_vertex:wm,uv_vertex:Tm,worldpos_vertex:Am,background_vert:Rm,background_frag:Cm,backgroundCube_vert:Pm,backgroundCube_frag:Lm,cube_vert:Dm,cube_frag:Im,depth_vert:Um,depth_frag:Nm,distanceRGBA_vert:zm,distanceRGBA_frag:Om,equirect_vert:Fm,equirect_frag:Bm,linedashed_vert:km,linedashed_frag:Hm,meshbasic_vert:Gm,meshbasic_frag:Vm,meshlambert_vert:Wm,meshlambert_frag:Xm,meshmatcap_vert:$m,meshmatcap_frag:qm,meshnormal_vert:Ym,meshnormal_frag:jm,meshphong_vert:Km,meshphong_frag:Jm,meshphysical_vert:Zm,meshphysical_frag:Qm,meshtoon_vert:t0,meshtoon_frag:e0,points_vert:n0,points_frag:i0,shadow_vert:s0,shadow_frag:r0,sprite_vert:o0,sprite_frag:a0},lt={common:{diffuse:{value:new $t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new $t(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},Pn={basic:{uniforms:Ke([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Ke([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new $t(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Ke([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new $t(0)},specular:{value:new $t(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Ke([lt.common,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.roughnessmap,lt.metalnessmap,lt.fog,lt.lights,{emissive:{value:new $t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Ke([lt.common,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.gradientmap,lt.fog,lt.lights,{emissive:{value:new $t(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Ke([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Ke([lt.points,lt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Ke([lt.common,lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Ke([lt.common,lt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Ke([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Ke([lt.sprite,lt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Ke([lt.common,lt.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Ke([lt.lights,lt.fog,{color:{value:new $t(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};Pn.physical={uniforms:Ke([Pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new $t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new $t(0)},specularColor:{value:new $t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const zr={r:0,b:0,g:0};function c0(i,t,e,n,s,r,a){const o=new $t(0);let c=r===!0?0:1,h,l,u=null,f=0,p=null;function _(m,d){let v=!1,x=d.isScene===!0?d.background:null;x&&x.isTexture&&(x=(d.backgroundBlurriness>0?e:t).get(x)),x===null?g(o,c):x&&x.isColor&&(g(x,1),v=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,a):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||v)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===ao)?(l===void 0&&(l=new kt(new zn(1,1,1),new Oi({name:"BackgroundCubeMaterial",uniforms:Cs(Pn.backgroundCube.uniforms),vertexShader:Pn.backgroundCube.vertexShader,fragmentShader:Pn.backgroundCube.fragmentShader,side:nn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(C,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),l.material.uniforms.envMap.value=x,l.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,l.material.toneMapped=le.getTransfer(x.colorSpace)!==fe,(u!==x||f!==x.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,f=x.version,p=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null)):x&&x.isTexture&&(h===void 0&&(h=new kt(new vi(2,2),new Oi({name:"BackgroundMaterial",uniforms:Cs(Pn.background.uniforms),vertexShader:Pn.background.vertexShader,fragmentShader:Pn.background.fragmentShader,side:_i,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=x,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=le.getTransfer(x.colorSpace)!==fe,x.matrixAutoUpdate===!0&&x.updateMatrix(),h.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,f=x.version,p=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null))}function g(m,d){m.getRGB(zr,Hh(i)),n.buffers.color.setClear(zr.r,zr.g,zr.b,d,a)}return{getClearColor:function(){return o},setClearColor:function(m,d=1){o.set(m),c=d,g(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,g(o,c)},render:_}}function l0(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},c=m(null);let h=c,l=!1;function u(I,F,W,Y,$){let q=!1;if(a){const j=g(Y,W,F);h!==j&&(h=j,p(h.object)),q=d(I,Y,W,$),q&&v(I,Y,W,$)}else{const j=F.wireframe===!0;(h.geometry!==Y.id||h.program!==W.id||h.wireframe!==j)&&(h.geometry=Y.id,h.program=W.id,h.wireframe=j,q=!0)}$!==null&&e.update($,i.ELEMENT_ARRAY_BUFFER),(q||l)&&(l=!1,U(I,F,W,Y),$!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function p(I){return n.isWebGL2?i.bindVertexArray(I):r.bindVertexArrayOES(I)}function _(I){return n.isWebGL2?i.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function g(I,F,W){const Y=W.wireframe===!0;let $=o[I.id];$===void 0&&($={},o[I.id]=$);let q=$[F.id];q===void 0&&(q={},$[F.id]=q);let j=q[Y];return j===void 0&&(j=m(f()),q[Y]=j),j}function m(I){const F=[],W=[],Y=[];for(let $=0;$<s;$++)F[$]=0,W[$]=0,Y[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:W,attributeDivisors:Y,object:I,attributes:{},index:null}}function d(I,F,W,Y){const $=h.attributes,q=F.attributes;let j=0;const ot=W.getAttributes();for(const ct in ot)if(ot[ct].location>=0){const J=$[ct];let mt=q[ct];if(mt===void 0&&(ct==="instanceMatrix"&&I.instanceMatrix&&(mt=I.instanceMatrix),ct==="instanceColor"&&I.instanceColor&&(mt=I.instanceColor)),J===void 0||J.attribute!==mt||mt&&J.data!==mt.data)return!0;j++}return h.attributesNum!==j||h.index!==Y}function v(I,F,W,Y){const $={},q=F.attributes;let j=0;const ot=W.getAttributes();for(const ct in ot)if(ot[ct].location>=0){let J=q[ct];J===void 0&&(ct==="instanceMatrix"&&I.instanceMatrix&&(J=I.instanceMatrix),ct==="instanceColor"&&I.instanceColor&&(J=I.instanceColor));const mt={};mt.attribute=J,J&&J.data&&(mt.data=J.data),$[ct]=mt,j++}h.attributes=$,h.attributesNum=j,h.index=Y}function x(){const I=h.newAttributes;for(let F=0,W=I.length;F<W;F++)I[F]=0}function M(I){C(I,0)}function C(I,F){const W=h.newAttributes,Y=h.enabledAttributes,$=h.attributeDivisors;W[I]=1,Y[I]===0&&(i.enableVertexAttribArray(I),Y[I]=1),$[I]!==F&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,F),$[I]=F)}function w(){const I=h.newAttributes,F=h.enabledAttributes;for(let W=0,Y=F.length;W<Y;W++)F[W]!==I[W]&&(i.disableVertexAttribArray(W),F[W]=0)}function A(I,F,W,Y,$,q,j){j===!0?i.vertexAttribIPointer(I,F,W,$,q):i.vertexAttribPointer(I,F,W,Y,$,q)}function U(I,F,W,Y){if(n.isWebGL2===!1&&(I.isInstancedMesh||Y.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const $=Y.attributes,q=W.getAttributes(),j=F.defaultAttributeValues;for(const ot in q){const ct=q[ot];if(ct.location>=0){let X=$[ot];if(X===void 0&&(ot==="instanceMatrix"&&I.instanceMatrix&&(X=I.instanceMatrix),ot==="instanceColor"&&I.instanceColor&&(X=I.instanceColor)),X!==void 0){const J=X.normalized,mt=X.itemSize,Et=e.get(X);if(Et===void 0)continue;const St=Et.buffer,Ft=Et.type,Bt=Et.bytesPerElement,Lt=n.isWebGL2===!0&&(Ft===i.INT||Ft===i.UNSIGNED_INT||X.gpuType===wh);if(X.isInterleavedBufferAttribute){const Jt=X.data,O=Jt.stride,Be=X.offset;if(Jt.isInstancedInterleavedBuffer){for(let Rt=0;Rt<ct.locationSize;Rt++)C(ct.location+Rt,Jt.meshPerAttribute);I.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=Jt.meshPerAttribute*Jt.count)}else for(let Rt=0;Rt<ct.locationSize;Rt++)M(ct.location+Rt);i.bindBuffer(i.ARRAY_BUFFER,St);for(let Rt=0;Rt<ct.locationSize;Rt++)A(ct.location+Rt,mt/ct.locationSize,Ft,J,O*Bt,(Be+mt/ct.locationSize*Rt)*Bt,Lt)}else{if(X.isInstancedBufferAttribute){for(let Jt=0;Jt<ct.locationSize;Jt++)C(ct.location+Jt,X.meshPerAttribute);I.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Jt=0;Jt<ct.locationSize;Jt++)M(ct.location+Jt);i.bindBuffer(i.ARRAY_BUFFER,St);for(let Jt=0;Jt<ct.locationSize;Jt++)A(ct.location+Jt,mt/ct.locationSize,Ft,J,mt*Bt,mt/ct.locationSize*Jt*Bt,Lt)}}else if(j!==void 0){const J=j[ot];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(ct.location,J);break;case 3:i.vertexAttrib3fv(ct.location,J);break;case 4:i.vertexAttrib4fv(ct.location,J);break;default:i.vertexAttrib1fv(ct.location,J)}}}}w()}function y(){G();for(const I in o){const F=o[I];for(const W in F){const Y=F[W];for(const $ in Y)_(Y[$].object),delete Y[$];delete F[W]}delete o[I]}}function b(I){if(o[I.id]===void 0)return;const F=o[I.id];for(const W in F){const Y=F[W];for(const $ in Y)_(Y[$].object),delete Y[$];delete F[W]}delete o[I.id]}function H(I){for(const F in o){const W=o[F];if(W[I.id]===void 0)continue;const Y=W[I.id];for(const $ in Y)_(Y[$].object),delete Y[$];delete W[I.id]}}function G(){K(),l=!0,h!==c&&(h=c,p(h.object))}function K(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:G,resetDefaultState:K,dispose:y,releaseStatesOfGeometry:b,releaseStatesOfProgram:H,initAttributes:x,enableAttribute:M,disableUnusedAttributes:w}}function h0(i,t,e,n){const s=n.isWebGL2;let r;function a(l){r=l}function o(l,u){i.drawArrays(r,l,u),e.update(u,r,1)}function c(l,u,f){if(f===0)return;let p,_;if(s)p=i,_="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),_="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[_](r,l,u,f),e.update(u,r,f)}function h(l,u,f){if(f===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<f;_++)this.render(l[_],u[_]);else{p.multiDrawArraysWEBGL(r,l,0,u,0,f);let _=0;for(let g=0;g<f;g++)_+=u[g];e.update(_,r,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=h}function u0(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);const h=a||t.has("WEBGL_draw_buffers"),l=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),d=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=f>0,M=a||t.has("OES_texture_float"),C=x&&M,w=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:l,maxTextures:u,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:_,maxAttributes:g,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:v,vertexTextures:x,floatFragmentTextures:M,floatVertexTextures:C,maxSamples:w}}function f0(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new hi,o=new Kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=l(u,f,0)},this.setState=function(u,f,p){const _=u.clippingPlanes,g=u.clipIntersection,m=u.clipShadows,d=i.get(u);if(!s||_===null||_.length===0||r&&!m)r?l(null):h();else{const v=r?0:n,x=v*4;let M=d.clippingState||null;c.value=M,M=l(_,f,x,p);for(let C=0;C!==x;++C)M[C]=e[C];d.clippingState=M,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=v}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function l(u,f,p,_){const g=u!==null?u.length:0;let m=null;if(g!==0){if(m=c.value,_!==!0||m===null){const d=p+g*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<d)&&(m=new Float32Array(d));for(let x=0,M=p;x!==g;++x,M+=4)a.copy(u[x]).applyMatrix4(v,o),a.normal.toArray(m,M),m[M+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function d0(i){let t=new WeakMap;function e(a,o){return o===ya?a.mapping=Ts:o===Sa&&(a.mapping=As),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===ya||o===Sa)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new wd(c.height/2);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Xh extends Gh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=l*this.view.offsetY,c=o-l*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const xs=4,ml=[.125,.215,.35,.446,.526,.582],Pi=20,Qo=new Xh,gl=new $t;let ta=null,ea=0,na=0;const Ri=(1+Math.sqrt(5))/2,ls=1/Ri,_l=[new R(1,1,1),new R(-1,1,1),new R(1,1,-1),new R(-1,1,-1),new R(0,Ri,ls),new R(0,Ri,-ls),new R(ls,0,Ri),new R(-ls,0,Ri),new R(Ri,ls,0),new R(-Ri,ls,0)];class vl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){ta=this._renderer.getRenderTarget(),ea=this._renderer.getActiveCubeFace(),na=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ml(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ta,ea,na),t.scissorTest=!1,Or(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ts||t.mapping===As?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ta=this._renderer.getRenderTarget(),ea=this._renderer.getActiveCubeFace(),na=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:en,minFilter:en,generateMipmaps:!1,type:ir,format:_n,colorSpace:ii,depthBuffer:!1},s=xl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=p0(r)),this._blurMaterial=m0(r,t,e)}return s}_compileMaterial(t){const e=new kt(this._lodPlanes[0],t);this._renderer.compile(e,Qo)}_sceneToCubeUV(t,e,n,s){const o=new cn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,f=l.toneMapping;l.getClearColor(gl),l.toneMapping=pi,l.autoClear=!1;const p=new Je({name:"PMREM.Background",side:nn,depthWrite:!1,depthTest:!1}),_=new kt(new zn,p);let g=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,g=!0):(p.color.copy(gl),g=!0);for(let d=0;d<6;d++){const v=d%3;v===0?(o.up.set(0,c[d],0),o.lookAt(h[d],0,0)):v===1?(o.up.set(0,0,c[d]),o.lookAt(0,h[d],0)):(o.up.set(0,c[d],0),o.lookAt(0,0,h[d]));const x=this._cubeSize;Or(s,v*x,d>2?x:0,x,x),l.setRenderTarget(s),g&&l.render(_,o),l.render(t,o)}_.geometry.dispose(),_.material.dispose(),l.toneMapping=f,l.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ts||t.mapping===As;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=yl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ml());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new kt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;Or(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Qo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=_l[(s-1)%_l.length];this._blur(t,s-1,s,r,a)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const l=3,u=new kt(this._lodPlanes[s],h),f=h.uniforms,p=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Pi-1),g=r/_,m=isFinite(r)?1+Math.floor(l*g):Pi;m>Pi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Pi}`);const d=[];let v=0;for(let A=0;A<Pi;++A){const U=A/g,y=Math.exp(-U*U/2);d.push(y),A===0?v+=y:A<m&&(v+=2*y)}for(let A=0;A<d.length;A++)d[A]=d[A]/v;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:x}=this;f.dTheta.value=_,f.mipInt.value=x-n;const M=this._sizeLods[s],C=3*M*(s>x-xs?s-x+xs:0),w=4*(this._cubeSize-M);Or(e,C,w,3*M,2*M),c.setRenderTarget(e),c.render(u,Qo)}}function p0(i){const t=[],e=[],n=[];let s=i;const r=i-xs+1+ml.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-xs?c=ml[a-i+xs-1]:a===0&&(c=0),n.push(c);const h=1/(o-2),l=-h,u=1+h,f=[l,l,u,l,u,u,l,l,u,u,l,u],p=6,_=6,g=3,m=2,d=1,v=new Float32Array(g*_*p),x=new Float32Array(m*_*p),M=new Float32Array(d*_*p);for(let w=0;w<p;w++){const A=w%3*2/3-1,U=w>2?0:-1,y=[A,U,0,A+2/3,U,0,A+2/3,U+1,0,A,U,0,A+2/3,U+1,0,A,U+1,0];v.set(y,g*_*w),x.set(f,m*_*w);const b=[w,w,w,w,w,w];M.set(b,d*_*w)}const C=new Ee;C.setAttribute("position",new fn(v,g)),C.setAttribute("uv",new fn(x,m)),C.setAttribute("faceIndex",new fn(M,d)),t.push(C),s>xs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function xl(i,t,e){const n=new zi(i,t,e);return n.texture.mapping=ao,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Or(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function m0(i,t,e){const n=new Float32Array(Pi),s=new R(0,1,0);return new Oi({name:"SphericalGaussianBlur",defines:{n:Pi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ga(),fragmentShader:`

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
		`,blending:di,depthTest:!1,depthWrite:!1})}function Ml(){return new Oi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ga(),fragmentShader:`

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
		`,blending:di,depthTest:!1,depthWrite:!1})}function yl(){return new Oi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ga(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:di,depthTest:!1,depthWrite:!1})}function Ga(){return`

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
	`}function g0(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,h=c===ya||c===Sa,l=c===Ts||c===As;if(h||l)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new vl(i)),u=h?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{const u=o.image;if(h&&u&&u.height>0||l&&u&&s(u)){e===null&&(e=new vl(i));const f=h?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,f),o.addEventListener("dispose",r),f.texture}else return null}}}return o}function s(o){let c=0;const h=6;for(let l=0;l<h;l++)o[l]!==void 0&&c++;return c===h}function r(o){const c=o.target;c.removeEventListener("dispose",r);const h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function _0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function v0(i,t,e,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const _ in f.attributes)t.remove(f.attributes[_]);for(const _ in f.morphAttributes){const g=f.morphAttributes[_];for(let m=0,d=g.length;m<d;m++)t.remove(g[m])}f.removeEventListener("dispose",a),delete s[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const _ in f)t.update(f[_],i.ARRAY_BUFFER);const p=u.morphAttributes;for(const _ in p){const g=p[_];for(let m=0,d=g.length;m<d;m++)t.update(g[m],i.ARRAY_BUFFER)}}function h(u){const f=[],p=u.index,_=u.attributes.position;let g=0;if(p!==null){const v=p.array;g=p.version;for(let x=0,M=v.length;x<M;x+=3){const C=v[x+0],w=v[x+1],A=v[x+2];f.push(C,w,w,A,A,C)}}else if(_!==void 0){const v=_.array;g=_.version;for(let x=0,M=v.length/3-1;x<M;x+=3){const C=x+0,w=x+1,A=x+2;f.push(C,w,w,A,A,C)}}else return;const m=new(Uh(f)?kh:Bh)(f,1);m.version=g;const d=r.get(u);d&&t.remove(d),r.set(u,m)}function l(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:l}}function x0(i,t,e,n){const s=n.isWebGL2;let r;function a(p){r=p}let o,c;function h(p){o=p.type,c=p.bytesPerElement}function l(p,_){i.drawElements(r,_,o,p*c),e.update(_,r,1)}function u(p,_,g){if(g===0)return;let m,d;if(s)m=i,d="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[d](r,_,o,p*c,g),e.update(_,r,g)}function f(p,_,g){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<g;d++)this.render(p[d]/c,_[d]);else{m.multiDrawElementsWEBGL(r,_,0,o,p,0,g);let d=0;for(let v=0;v<g;v++)d+=_[v];e.update(d,r,1)}}this.setMode=a,this.setIndex=h,this.render=l,this.renderInstances=u,this.renderMultiDraw=f}function M0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function y0(i,t){return i[0]-t[0]}function S0(i,t){return Math.abs(t[1])-Math.abs(i[1])}function b0(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,a=new pe,o=[];for(let h=0;h<8;h++)o[h]=[h,0];function c(h,l,u){const f=h.morphTargetInfluences;if(t.isWebGL2===!0){const _=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,g=_!==void 0?_.length:0;let m=r.get(l);if(m===void 0||m.count!==g){let F=function(){K.dispose(),r.delete(l),l.removeEventListener("dispose",F)};var p=F;m!==void 0&&m.texture.dispose();const x=l.morphAttributes.position!==void 0,M=l.morphAttributes.normal!==void 0,C=l.morphAttributes.color!==void 0,w=l.morphAttributes.position||[],A=l.morphAttributes.normal||[],U=l.morphAttributes.color||[];let y=0;x===!0&&(y=1),M===!0&&(y=2),C===!0&&(y=3);let b=l.attributes.position.count*y,H=1;b>t.maxTextureSize&&(H=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const G=new Float32Array(b*H*4*g),K=new Oh(G,b,H,g);K.type=fi,K.needsUpdate=!0;const I=y*4;for(let W=0;W<g;W++){const Y=w[W],$=A[W],q=U[W],j=b*H*4*W;for(let ot=0;ot<Y.count;ot++){const ct=ot*I;x===!0&&(a.fromBufferAttribute(Y,ot),G[j+ct+0]=a.x,G[j+ct+1]=a.y,G[j+ct+2]=a.z,G[j+ct+3]=0),M===!0&&(a.fromBufferAttribute($,ot),G[j+ct+4]=a.x,G[j+ct+5]=a.y,G[j+ct+6]=a.z,G[j+ct+7]=0),C===!0&&(a.fromBufferAttribute(q,ot),G[j+ct+8]=a.x,G[j+ct+9]=a.y,G[j+ct+10]=a.z,G[j+ct+11]=q.itemSize===4?a.w:1)}}m={count:g,texture:K,size:new ht(b,H)},r.set(l,m),l.addEventListener("dispose",F)}let d=0;for(let x=0;x<f.length;x++)d+=f[x];const v=l.morphTargetsRelative?1:1-d;u.getUniforms().setValue(i,"morphTargetBaseInfluence",v),u.getUniforms().setValue(i,"morphTargetInfluences",f),u.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}else{const _=f===void 0?0:f.length;let g=n[l.id];if(g===void 0||g.length!==_){g=[];for(let M=0;M<_;M++)g[M]=[M,0];n[l.id]=g}for(let M=0;M<_;M++){const C=g[M];C[0]=M,C[1]=f[M]}g.sort(S0);for(let M=0;M<8;M++)M<_&&g[M][1]?(o[M][0]=g[M][0],o[M][1]=g[M][1]):(o[M][0]=Number.MAX_SAFE_INTEGER,o[M][1]=0);o.sort(y0);const m=l.morphAttributes.position,d=l.morphAttributes.normal;let v=0;for(let M=0;M<8;M++){const C=o[M],w=C[0],A=C[1];w!==Number.MAX_SAFE_INTEGER&&A?(m&&l.getAttribute("morphTarget"+M)!==m[w]&&l.setAttribute("morphTarget"+M,m[w]),d&&l.getAttribute("morphNormal"+M)!==d[w]&&l.setAttribute("morphNormal"+M,d[w]),s[M]=A,v+=A):(m&&l.hasAttribute("morphTarget"+M)===!0&&l.deleteAttribute("morphTarget"+M),d&&l.hasAttribute("morphNormal"+M)===!0&&l.deleteAttribute("morphNormal"+M),s[M]=0)}const x=l.morphTargetsRelative?1:1-v;u.getUniforms().setValue(i,"morphTargetBaseInfluence",x),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function E0(i,t,e,n){let s=new WeakMap;function r(c){const h=n.render.frame,l=c.geometry,u=t.get(c,l);if(s.get(u)!==h&&(t.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function a(){s=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:a}}class $h extends Qe{constructor(t,e,n,s,r,a,o,c,h,l){if(l=l!==void 0?l:Di,l!==Di&&l!==Rs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&l===Di&&(n=ui),n===void 0&&l===Rs&&(n=Li),super(null,s,r,a,o,c,l,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:He,this.minFilter=c!==void 0?c:He,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const qh=new Qe,Yh=new $h(1,1);Yh.compareFunction=Ih;const jh=new Oh,Kh=new cd,Jh=new Vh,Sl=[],bl=[],El=new Float32Array(16),wl=new Float32Array(9),Tl=new Float32Array(4);function Ns(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Sl[s];if(r===void 0&&(r=new Float32Array(s),Sl[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Le(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function De(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ho(i,t){let e=bl[t];e===void 0&&(e=new Int32Array(t),bl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function w0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function T0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2fv(this.addr,t),De(e,t)}}function A0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Le(e,t))return;i.uniform3fv(this.addr,t),De(e,t)}}function R0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4fv(this.addr,t),De(e,t)}}function C0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;Tl.set(n),i.uniformMatrix2fv(this.addr,!1,Tl),De(e,n)}}function P0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;wl.set(n),i.uniformMatrix3fv(this.addr,!1,wl),De(e,n)}}function L0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),De(e,t)}else{if(Le(e,n))return;El.set(n),i.uniformMatrix4fv(this.addr,!1,El),De(e,n)}}function D0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function I0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2iv(this.addr,t),De(e,t)}}function U0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3iv(this.addr,t),De(e,t)}}function N0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4iv(this.addr,t),De(e,t)}}function z0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function O0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2uiv(this.addr,t),De(e,t)}}function F0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3uiv(this.addr,t),De(e,t)}}function B0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4uiv(this.addr,t),De(e,t)}}function k0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Yh:qh;e.setTexture2D(t||r,s)}function H0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Kh,s)}function G0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Jh,s)}function V0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||jh,s)}function W0(i){switch(i){case 5126:return w0;case 35664:return T0;case 35665:return A0;case 35666:return R0;case 35674:return C0;case 35675:return P0;case 35676:return L0;case 5124:case 35670:return D0;case 35667:case 35671:return I0;case 35668:case 35672:return U0;case 35669:case 35673:return N0;case 5125:return z0;case 36294:return O0;case 36295:return F0;case 36296:return B0;case 35678:case 36198:case 36298:case 36306:case 35682:return k0;case 35679:case 36299:case 36307:return H0;case 35680:case 36300:case 36308:case 36293:return G0;case 36289:case 36303:case 36311:case 36292:return V0}}function X0(i,t){i.uniform1fv(this.addr,t)}function $0(i,t){const e=Ns(t,this.size,2);i.uniform2fv(this.addr,e)}function q0(i,t){const e=Ns(t,this.size,3);i.uniform3fv(this.addr,e)}function Y0(i,t){const e=Ns(t,this.size,4);i.uniform4fv(this.addr,e)}function j0(i,t){const e=Ns(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function K0(i,t){const e=Ns(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function J0(i,t){const e=Ns(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Z0(i,t){i.uniform1iv(this.addr,t)}function Q0(i,t){i.uniform2iv(this.addr,t)}function tg(i,t){i.uniform3iv(this.addr,t)}function eg(i,t){i.uniform4iv(this.addr,t)}function ng(i,t){i.uniform1uiv(this.addr,t)}function ig(i,t){i.uniform2uiv(this.addr,t)}function sg(i,t){i.uniform3uiv(this.addr,t)}function rg(i,t){i.uniform4uiv(this.addr,t)}function og(i,t,e){const n=this.cache,s=t.length,r=ho(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||qh,r[a])}function ag(i,t,e){const n=this.cache,s=t.length,r=ho(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Kh,r[a])}function cg(i,t,e){const n=this.cache,s=t.length,r=ho(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Jh,r[a])}function lg(i,t,e){const n=this.cache,s=t.length,r=ho(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),De(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||jh,r[a])}function hg(i){switch(i){case 5126:return X0;case 35664:return $0;case 35665:return q0;case 35666:return Y0;case 35674:return j0;case 35675:return K0;case 35676:return J0;case 5124:case 35670:return Z0;case 35667:case 35671:return Q0;case 35668:case 35672:return tg;case 35669:case 35673:return eg;case 5125:return ng;case 36294:return ig;case 36295:return sg;case 36296:return rg;case 35678:case 36198:case 36298:case 36306:case 35682:return og;case 35679:case 36299:case 36307:return ag;case 35680:case 36300:case 36308:case 36293:return cg;case 36289:case 36303:case 36311:case 36292:return lg}}class ug{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=W0(e.type)}}class fg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=hg(e.type)}}class dg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const ia=/(\w+)(\])?(\[|\.)?/g;function Al(i,t){i.seq.push(t),i.map[t.id]=t}function pg(i,t,e){const n=i.name,s=n.length;for(ia.lastIndex=0;;){const r=ia.exec(n),a=ia.lastIndex;let o=r[1];const c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){Al(e,h===void 0?new ug(o,i,t):new fg(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new dg(o),Al(e,u)),e=u}}}class Wr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);pg(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Rl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const mg=37297;let gg=0;function _g(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function vg(i){const t=le.getPrimaries(le.workingColorSpace),e=le.getPrimaries(i);let n;switch(t===e?n="":t===Jr&&e===Kr?n="LinearDisplayP3ToLinearSRGB":t===Kr&&e===Jr&&(n="LinearSRGBToLinearDisplayP3"),i){case ii:case co:return[n,"LinearTransferOETF"];case Ae:case Ba:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Cl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+_g(i.getShaderSource(t),a)}else return s}function xg(i,t){const e=vg(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Mg(i,t){let e;switch(t){case Pf:e="Linear";break;case Lf:e="Reinhard";break;case Df:e="OptimizedCineon";break;case bh:e="ACESFilmic";break;case Uf:e="AgX";break;case If:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function yg(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ms).join(`
`)}function Sg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ms).join(`
`)}function bg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Eg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ms(i){return i!==""}function Pl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ll(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const wg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Aa(i){return i.replace(wg,Ag)}const Tg=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Ag(i,t){let e=Xt[t];if(e===void 0){const n=Tg.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Aa(e)}const Rg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Dl(i){return i.replace(Rg,Cg)}function Cg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Il(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Pg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===yh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Sh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===jn&&(t="SHADOWMAP_TYPE_VSM"),t}function Lg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ts:case As:t="ENVMAP_TYPE_CUBE";break;case ao:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Dg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case As:t="ENVMAP_MODE_REFRACTION";break}return t}function Ig(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case za:t="ENVMAP_BLENDING_MULTIPLY";break;case Rf:t="ENVMAP_BLENDING_MIX";break;case Cf:t="ENVMAP_BLENDING_ADD";break}return t}function Ug(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Ng(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=Pg(e),h=Lg(e),l=Dg(e),u=Ig(e),f=Ug(e),p=e.isWebGL2?"":yg(e),_=Sg(e),g=bg(r),m=s.createProgram();let d,v,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),d.length>0&&(d+=`
`),v=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),v.length>0&&(v+=`
`)):(d=[Il(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ms).join(`
`),v=[p,Il(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==pi?"#define TONE_MAPPING":"",e.toneMapping!==pi?Xt.tonemapping_pars_fragment:"",e.toneMapping!==pi?Mg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,xg("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ms).join(`
`)),a=Aa(a),a=Pl(a,e),a=Ll(a,e),o=Aa(o),o=Pl(o,e),o=Ll(o,e),a=Dl(a),o=Dl(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,d=[_,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Jc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Jc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const M=x+d+a,C=x+v+o,w=Rl(s,s.VERTEX_SHADER,M),A=Rl(s,s.FRAGMENT_SHADER,C);s.attachShader(m,w),s.attachShader(m,A),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function U(G){if(i.debug.checkShaderErrors){const K=s.getProgramInfoLog(m).trim(),I=s.getShaderInfoLog(w).trim(),F=s.getShaderInfoLog(A).trim();let W=!0,Y=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,w,A);else{const $=Cl(s,w,"vertex"),q=Cl(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+K+`
`+$+`
`+q)}else K!==""?console.warn("THREE.WebGLProgram: Program Info Log:",K):(I===""||F==="")&&(Y=!1);Y&&(G.diagnostics={runnable:W,programLog:K,vertexShader:{log:I,prefix:d},fragmentShader:{log:F,prefix:v}})}s.deleteShader(w),s.deleteShader(A),y=new Wr(s,m),b=Eg(s,m)}let y;this.getUniforms=function(){return y===void 0&&U(this),y};let b;this.getAttributes=function(){return b===void 0&&U(this),b};let H=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return H===!1&&(H=s.getProgramParameter(m,mg)),H},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=gg++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=w,this.fragmentShader=A,this}let zg=0;class Og{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Fg(t),e.set(t,n)),n}}class Fg{constructor(t){this.id=zg++,this.code=t,this.usedTimes=0}}function Bg(i,t,e,n,s,r,a){const o=new ka,c=new Og,h=[],l=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return y===0?"uv":`uv${y}`}function m(y,b,H,G,K){const I=G.fog,F=K.geometry,W=y.isMeshStandardMaterial?G.environment:null,Y=(y.isMeshStandardMaterial?e:t).get(y.envMap||W),$=Y&&Y.mapping===ao?Y.image.height:null,q=_[y.type];y.precision!==null&&(p=s.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));const j=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ot=j!==void 0?j.length:0;let ct=0;F.morphAttributes.position!==void 0&&(ct=1),F.morphAttributes.normal!==void 0&&(ct=2),F.morphAttributes.color!==void 0&&(ct=3);let X,J,mt,Et;if(q){const ye=Pn[q];X=ye.vertexShader,J=ye.fragmentShader}else X=y.vertexShader,J=y.fragmentShader,c.update(y),mt=c.getVertexShaderID(y),Et=c.getFragmentShaderID(y);const St=i.getRenderTarget(),Ft=K.isInstancedMesh===!0,Bt=K.isBatchedMesh===!0,Lt=!!y.map,Jt=!!y.matcap,O=!!Y,Be=!!y.aoMap,Rt=!!y.lightMap,Ut=!!y.bumpMap,Mt=!!y.normalMap,ue=!!y.displacementMap,Gt=!!y.emissiveMap,T=!!y.metalnessMap,S=!!y.roughnessMap,z=y.anisotropy>0,nt=y.clearcoat>0,Q=y.iridescence>0,it=y.sheen>0,yt=y.transmission>0,dt=z&&!!y.anisotropyMap,xt=nt&&!!y.clearcoatMap,Pt=nt&&!!y.clearcoatNormalMap,Vt=nt&&!!y.clearcoatRoughnessMap,Z=Q&&!!y.iridescenceMap,se=Q&&!!y.iridescenceThicknessMap,qt=it&&!!y.sheenColorMap,Nt=it&&!!y.sheenRoughnessMap,Tt=!!y.specularMap,gt=!!y.specularColorMap,P=!!y.specularIntensityMap,st=yt&&!!y.transmissionMap,bt=yt&&!!y.thicknessMap,vt=!!y.gradientMap,tt=!!y.alphaMap,D=y.alphaTest>0,rt=!!y.alphaHash,ft=!!y.extensions,Dt=!!F.attributes.uv1,Ct=!!F.attributes.uv2,Zt=!!F.attributes.uv3;let Qt=pi;return y.toneMapped&&(St===null||St.isXRRenderTarget===!0)&&(Qt=i.toneMapping),{isWebGL2:l,shaderID:q,shaderType:y.type,shaderName:y.name,vertexShader:X,fragmentShader:J,defines:y.defines,customVertexShaderID:mt,customFragmentShaderID:Et,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:Bt,instancing:Ft,instancingColor:Ft&&K.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:St===null?i.outputColorSpace:St.isXRRenderTarget===!0?St.texture.colorSpace:ii,map:Lt,matcap:Jt,envMap:O,envMapMode:O&&Y.mapping,envMapCubeUVHeight:$,aoMap:Be,lightMap:Rt,bumpMap:Ut,normalMap:Mt,displacementMap:f&&ue,emissiveMap:Gt,normalMapObjectSpace:Mt&&y.normalMapType===$f,normalMapTangentSpace:Mt&&y.normalMapType===Fa,metalnessMap:T,roughnessMap:S,anisotropy:z,anisotropyMap:dt,clearcoat:nt,clearcoatMap:xt,clearcoatNormalMap:Pt,clearcoatRoughnessMap:Vt,iridescence:Q,iridescenceMap:Z,iridescenceThicknessMap:se,sheen:it,sheenColorMap:qt,sheenRoughnessMap:Nt,specularMap:Tt,specularColorMap:gt,specularIntensityMap:P,transmission:yt,transmissionMap:st,thicknessMap:bt,gradientMap:vt,opaque:y.transparent===!1&&y.blending===ys,alphaMap:tt,alphaTest:D,alphaHash:rt,combine:y.combine,mapUv:Lt&&g(y.map.channel),aoMapUv:Be&&g(y.aoMap.channel),lightMapUv:Rt&&g(y.lightMap.channel),bumpMapUv:Ut&&g(y.bumpMap.channel),normalMapUv:Mt&&g(y.normalMap.channel),displacementMapUv:ue&&g(y.displacementMap.channel),emissiveMapUv:Gt&&g(y.emissiveMap.channel),metalnessMapUv:T&&g(y.metalnessMap.channel),roughnessMapUv:S&&g(y.roughnessMap.channel),anisotropyMapUv:dt&&g(y.anisotropyMap.channel),clearcoatMapUv:xt&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:Pt&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Vt&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Z&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:se&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:qt&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&g(y.sheenRoughnessMap.channel),specularMapUv:Tt&&g(y.specularMap.channel),specularColorMapUv:gt&&g(y.specularColorMap.channel),specularIntensityMapUv:P&&g(y.specularIntensityMap.channel),transmissionMapUv:st&&g(y.transmissionMap.channel),thicknessMapUv:bt&&g(y.thicknessMap.channel),alphaMapUv:tt&&g(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Mt||z),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Dt,vertexUv2s:Ct,vertexUv3s:Zt,pointsUvs:K.isPoints===!0&&!!F.attributes.uv&&(Lt||tt),fog:!!I,useFog:y.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:K.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:ot,morphTextureStride:ct,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&H.length>0,shadowMapType:i.shadowMap.type,toneMapping:Qt,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Lt&&y.map.isVideoTexture===!0&&le.getTransfer(y.map.colorSpace)===fe,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===hn,flipSided:y.side===nn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:ft&&y.extensions.derivatives===!0,extensionFragDepth:ft&&y.extensions.fragDepth===!0,extensionDrawBuffers:ft&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:ft&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ft&&y.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:l||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:l||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:l||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function d(y){const b=[];if(y.shaderID?b.push(y.shaderID):(b.push(y.customVertexShaderID),b.push(y.customFragmentShaderID)),y.defines!==void 0)for(const H in y.defines)b.push(H),b.push(y.defines[H]);return y.isRawShaderMaterial===!1&&(v(b,y),x(b,y),b.push(i.outputColorSpace)),b.push(y.customProgramCacheKey),b.join()}function v(y,b){y.push(b.precision),y.push(b.outputColorSpace),y.push(b.envMapMode),y.push(b.envMapCubeUVHeight),y.push(b.mapUv),y.push(b.alphaMapUv),y.push(b.lightMapUv),y.push(b.aoMapUv),y.push(b.bumpMapUv),y.push(b.normalMapUv),y.push(b.displacementMapUv),y.push(b.emissiveMapUv),y.push(b.metalnessMapUv),y.push(b.roughnessMapUv),y.push(b.anisotropyMapUv),y.push(b.clearcoatMapUv),y.push(b.clearcoatNormalMapUv),y.push(b.clearcoatRoughnessMapUv),y.push(b.iridescenceMapUv),y.push(b.iridescenceThicknessMapUv),y.push(b.sheenColorMapUv),y.push(b.sheenRoughnessMapUv),y.push(b.specularMapUv),y.push(b.specularColorMapUv),y.push(b.specularIntensityMapUv),y.push(b.transmissionMapUv),y.push(b.thicknessMapUv),y.push(b.combine),y.push(b.fogExp2),y.push(b.sizeAttenuation),y.push(b.morphTargetsCount),y.push(b.morphAttributeCount),y.push(b.numDirLights),y.push(b.numPointLights),y.push(b.numSpotLights),y.push(b.numSpotLightMaps),y.push(b.numHemiLights),y.push(b.numRectAreaLights),y.push(b.numDirLightShadows),y.push(b.numPointLightShadows),y.push(b.numSpotLightShadows),y.push(b.numSpotLightShadowsWithMaps),y.push(b.numLightProbes),y.push(b.shadowMapType),y.push(b.toneMapping),y.push(b.numClippingPlanes),y.push(b.numClipIntersection),y.push(b.depthPacking)}function x(y,b){o.disableAll(),b.isWebGL2&&o.enable(0),b.supportsVertexTextures&&o.enable(1),b.instancing&&o.enable(2),b.instancingColor&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),y.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.skinning&&o.enable(4),b.morphTargets&&o.enable(5),b.morphNormals&&o.enable(6),b.morphColors&&o.enable(7),b.premultipliedAlpha&&o.enable(8),b.shadowMapEnabled&&o.enable(9),b.useLegacyLights&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),y.push(o.mask)}function M(y){const b=_[y.type];let H;if(b){const G=Pn[b];H=yd.clone(G.uniforms)}else H=y.uniforms;return H}function C(y,b){let H;for(let G=0,K=h.length;G<K;G++){const I=h[G];if(I.cacheKey===b){H=I,++H.usedTimes;break}}return H===void 0&&(H=new Ng(i,b,y,r),h.push(H)),H}function w(y){if(--y.usedTimes===0){const b=h.indexOf(y);h[b]=h[h.length-1],h.pop(),y.destroy()}}function A(y){c.remove(y)}function U(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:M,acquireProgram:C,releaseProgram:w,releaseShaderCache:A,programs:h,dispose:U}}function kg(){let i=new WeakMap;function t(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function e(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function Hg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Ul(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Nl(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,f,p,_,g,m){let d=i[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:_,renderOrder:u.renderOrder,z:g,group:m},i[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=_,d.renderOrder=u.renderOrder,d.z=g,d.group=m),t++,d}function o(u,f,p,_,g,m){const d=a(u,f,p,_,g,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):e.push(d)}function c(u,f,p,_,g,m){const d=a(u,f,p,_,g,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function h(u,f){e.length>1&&e.sort(u||Hg),n.length>1&&n.sort(f||Ul),s.length>1&&s.sort(f||Ul)}function l(){for(let u=t,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:l,sort:h}}function Gg(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Nl,i.set(n,[a])):s>=r.length?(a=new Nl,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Vg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new $t};break;case"SpotLight":e={position:new R,direction:new R,color:new $t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new $t,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new $t,groundColor:new $t};break;case"RectAreaLight":e={color:new $t,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function Wg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Xg=0;function $g(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function qg(i,t){const e=new Vg,n=Wg(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)s.probe.push(new R);const r=new R,a=new ce,o=new ce;function c(l,u){let f=0,p=0,_=0;for(let G=0;G<9;G++)s.probe[G].set(0,0,0);let g=0,m=0,d=0,v=0,x=0,M=0,C=0,w=0,A=0,U=0,y=0;l.sort($g);const b=u===!0?Math.PI:1;for(let G=0,K=l.length;G<K;G++){const I=l[G],F=I.color,W=I.intensity,Y=I.distance,$=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)f+=F.r*W*b,p+=F.g*W*b,_+=F.b*W*b;else if(I.isLightProbe){for(let q=0;q<9;q++)s.probe[q].addScaledVector(I.sh.coefficients[q],W);y++}else if(I.isDirectionalLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*b),I.castShadow){const j=I.shadow,ot=n.get(I);ot.shadowBias=j.bias,ot.shadowNormalBias=j.normalBias,ot.shadowRadius=j.radius,ot.shadowMapSize=j.mapSize,s.directionalShadow[g]=ot,s.directionalShadowMap[g]=$,s.directionalShadowMatrix[g]=I.shadow.matrix,M++}s.directional[g]=q,g++}else if(I.isSpotLight){const q=e.get(I);q.position.setFromMatrixPosition(I.matrixWorld),q.color.copy(F).multiplyScalar(W*b),q.distance=Y,q.coneCos=Math.cos(I.angle),q.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),q.decay=I.decay,s.spot[d]=q;const j=I.shadow;if(I.map&&(s.spotLightMap[A]=I.map,A++,j.updateMatrices(I),I.castShadow&&U++),s.spotLightMatrix[d]=j.matrix,I.castShadow){const ot=n.get(I);ot.shadowBias=j.bias,ot.shadowNormalBias=j.normalBias,ot.shadowRadius=j.radius,ot.shadowMapSize=j.mapSize,s.spotShadow[d]=ot,s.spotShadowMap[d]=$,w++}d++}else if(I.isRectAreaLight){const q=e.get(I);q.color.copy(F).multiplyScalar(W),q.halfWidth.set(I.width*.5,0,0),q.halfHeight.set(0,I.height*.5,0),s.rectArea[v]=q,v++}else if(I.isPointLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*b),q.distance=I.distance,q.decay=I.decay,I.castShadow){const j=I.shadow,ot=n.get(I);ot.shadowBias=j.bias,ot.shadowNormalBias=j.normalBias,ot.shadowRadius=j.radius,ot.shadowMapSize=j.mapSize,ot.shadowCameraNear=j.camera.near,ot.shadowCameraFar=j.camera.far,s.pointShadow[m]=ot,s.pointShadowMap[m]=$,s.pointShadowMatrix[m]=I.shadow.matrix,C++}s.point[m]=q,m++}else if(I.isHemisphereLight){const q=e.get(I);q.skyColor.copy(I.color).multiplyScalar(W*b),q.groundColor.copy(I.groundColor).multiplyScalar(W*b),s.hemi[x]=q,x++}}v>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_FLOAT_1,s.rectAreaLTC2=lt.LTC_FLOAT_2):(s.rectAreaLTC1=lt.LTC_HALF_1,s.rectAreaLTC2=lt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_FLOAT_1,s.rectAreaLTC2=lt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_HALF_1,s.rectAreaLTC2=lt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=p,s.ambient[2]=_;const H=s.hash;(H.directionalLength!==g||H.pointLength!==m||H.spotLength!==d||H.rectAreaLength!==v||H.hemiLength!==x||H.numDirectionalShadows!==M||H.numPointShadows!==C||H.numSpotShadows!==w||H.numSpotMaps!==A||H.numLightProbes!==y)&&(s.directional.length=g,s.spot.length=d,s.rectArea.length=v,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=C,s.pointShadowMap.length=C,s.spotShadow.length=w,s.spotShadowMap.length=w,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=C,s.spotLightMatrix.length=w+A-U,s.spotLightMap.length=A,s.numSpotLightShadowsWithMaps=U,s.numLightProbes=y,H.directionalLength=g,H.pointLength=m,H.spotLength=d,H.rectAreaLength=v,H.hemiLength=x,H.numDirectionalShadows=M,H.numPointShadows=C,H.numSpotShadows=w,H.numSpotMaps=A,H.numLightProbes=y,s.version=Xg++)}function h(l,u){let f=0,p=0,_=0,g=0,m=0;const d=u.matrixWorldInverse;for(let v=0,x=l.length;v<x;v++){const M=l[v];if(M.isDirectionalLight){const C=s.directional[f];C.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(d),f++}else if(M.isSpotLight){const C=s.spot[_];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(d),C.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(d),_++}else if(M.isRectAreaLight){const C=s.rectArea[g];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(d),o.identity(),a.copy(M.matrixWorld),a.premultiply(d),o.extractRotation(a),C.halfWidth.set(M.width*.5,0,0),C.halfHeight.set(0,M.height*.5,0),C.halfWidth.applyMatrix4(o),C.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){const C=s.point[p];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(d),p++}else if(M.isHemisphereLight){const C=s.hemi[m];C.direction.setFromMatrixPosition(M.matrixWorld),C.direction.transformDirection(d),m++}}}return{setup:c,setupView:h,state:s}}function zl(i,t){const e=new qg(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function a(u){n.push(u)}function o(u){s.push(u)}function c(u){e.setup(n,u)}function h(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o}}function Yg(i,t){let e=new WeakMap;function n(r,a=0){const o=e.get(r);let c;return o===void 0?(c=new zl(i,t),e.set(r,[c])):a>=o.length?(c=new zl(i,t),o.push(c)):c=o[a],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class jg extends Gi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Wf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Kg extends Gi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Jg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Zg=`uniform sampler2D shadow_pass;
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
}`;function Qg(i,t,e){let n=new Ha;const s=new ht,r=new ht,a=new pe,o=new jg({depthPacking:Xf}),c=new Kg,h={},l=e.maxTextureSize,u={[_i]:nn,[nn]:_i,[hn]:hn},f=new Oi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:Jg,fragmentShader:Zg}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const _=new Ee;_.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new kt(_,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=yh;let d=this.type;this.render=function(w,A,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const y=i.getRenderTarget(),b=i.getActiveCubeFace(),H=i.getActiveMipmapLevel(),G=i.state;G.setBlending(di),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const K=d!==jn&&this.type===jn,I=d===jn&&this.type!==jn;for(let F=0,W=w.length;F<W;F++){const Y=w[F],$=Y.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const q=$.getFrameExtents();if(s.multiply(q),r.copy($.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/q.x),s.x=r.x*q.x,$.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/q.y),s.y=r.y*q.y,$.mapSize.y=r.y)),$.map===null||K===!0||I===!0){const ot=this.type!==jn?{minFilter:He,magFilter:He}:{};$.map!==null&&$.map.dispose(),$.map=new zi(s.x,s.y,ot),$.map.texture.name=Y.name+".shadowMap",$.camera.updateProjectionMatrix()}i.setRenderTarget($.map),i.clear();const j=$.getViewportCount();for(let ot=0;ot<j;ot++){const ct=$.getViewport(ot);a.set(r.x*ct.x,r.y*ct.y,r.x*ct.z,r.y*ct.w),G.viewport(a),$.updateMatrices(Y,ot),n=$.getFrustum(),M(A,U,$.camera,Y,this.type)}$.isPointLightShadow!==!0&&this.type===jn&&v($,U),$.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(y,b,H)};function v(w,A){const U=t.update(g);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new zi(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,U,f,g,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,U,p,g,null)}function x(w,A,U,y){let b=null;const H=U.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(H!==void 0)b=H;else if(b=U.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const G=b.uuid,K=A.uuid;let I=h[G];I===void 0&&(I={},h[G]=I);let F=I[K];F===void 0&&(F=b.clone(),I[K]=F,A.addEventListener("dispose",C)),b=F}if(b.visible=A.visible,b.wireframe=A.wireframe,y===jn?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:u[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,U.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const G=i.properties.get(b);G.light=U}return b}function M(w,A,U,y,b){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&b===jn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,w.matrixWorld);const K=t.update(w),I=w.material;if(Array.isArray(I)){const F=K.groups;for(let W=0,Y=F.length;W<Y;W++){const $=F[W],q=I[$.materialIndex];if(q&&q.visible){const j=x(w,q,y,b);w.onBeforeShadow(i,w,A,U,K,j,$),i.renderBufferDirect(U,null,K,j,w,$),w.onAfterShadow(i,w,A,U,K,j,$)}}}else if(I.visible){const F=x(w,I,y,b);w.onBeforeShadow(i,w,A,U,K,F,null),i.renderBufferDirect(U,null,K,F,w,null),w.onAfterShadow(i,w,A,U,K,F,null)}}const G=w.children;for(let K=0,I=G.length;K<I;K++)M(G[K],A,U,y,b)}function C(w){w.target.removeEventListener("dispose",C);for(const U in h){const y=h[U],b=w.target.uuid;b in y&&(y[b].dispose(),delete y[b])}}}function t_(i,t,e){const n=e.isWebGL2;function s(){let D=!1;const rt=new pe;let ft=null;const Dt=new pe(0,0,0,0);return{setMask:function(Ct){ft!==Ct&&!D&&(i.colorMask(Ct,Ct,Ct,Ct),ft=Ct)},setLocked:function(Ct){D=Ct},setClear:function(Ct,Zt,Qt,xe,ye){ye===!0&&(Ct*=xe,Zt*=xe,Qt*=xe),rt.set(Ct,Zt,Qt,xe),Dt.equals(rt)===!1&&(i.clearColor(Ct,Zt,Qt,xe),Dt.copy(rt))},reset:function(){D=!1,ft=null,Dt.set(-1,0,0,0)}}}function r(){let D=!1,rt=null,ft=null,Dt=null;return{setTest:function(Ct){Ct?Bt(i.DEPTH_TEST):Lt(i.DEPTH_TEST)},setMask:function(Ct){rt!==Ct&&!D&&(i.depthMask(Ct),rt=Ct)},setFunc:function(Ct){if(ft!==Ct){switch(Ct){case yf:i.depthFunc(i.NEVER);break;case Sf:i.depthFunc(i.ALWAYS);break;case bf:i.depthFunc(i.LESS);break;case qr:i.depthFunc(i.LEQUAL);break;case Ef:i.depthFunc(i.EQUAL);break;case wf:i.depthFunc(i.GEQUAL);break;case Tf:i.depthFunc(i.GREATER);break;case Af:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ft=Ct}},setLocked:function(Ct){D=Ct},setClear:function(Ct){Dt!==Ct&&(i.clearDepth(Ct),Dt=Ct)},reset:function(){D=!1,rt=null,ft=null,Dt=null}}}function a(){let D=!1,rt=null,ft=null,Dt=null,Ct=null,Zt=null,Qt=null,xe=null,ye=null;return{setTest:function(te){D||(te?Bt(i.STENCIL_TEST):Lt(i.STENCIL_TEST))},setMask:function(te){rt!==te&&!D&&(i.stencilMask(te),rt=te)},setFunc:function(te,we,Rn){(ft!==te||Dt!==we||Ct!==Rn)&&(i.stencilFunc(te,we,Rn),ft=te,Dt=we,Ct=Rn)},setOp:function(te,we,Rn){(Zt!==te||Qt!==we||xe!==Rn)&&(i.stencilOp(te,we,Rn),Zt=te,Qt=we,xe=Rn)},setLocked:function(te){D=te},setClear:function(te){ye!==te&&(i.clearStencil(te),ye=te)},reset:function(){D=!1,rt=null,ft=null,Dt=null,Ct=null,Zt=null,Qt=null,xe=null,ye=null}}}const o=new s,c=new r,h=new a,l=new WeakMap,u=new WeakMap;let f={},p={},_=new WeakMap,g=[],m=null,d=!1,v=null,x=null,M=null,C=null,w=null,A=null,U=null,y=new $t(0,0,0),b=0,H=!1,G=null,K=null,I=null,F=null,W=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,q=0;const j=i.getParameter(i.VERSION);j.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(j)[1]),$=q>=1):j.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),$=q>=2);let ot=null,ct={};const X=i.getParameter(i.SCISSOR_BOX),J=i.getParameter(i.VIEWPORT),mt=new pe().fromArray(X),Et=new pe().fromArray(J);function St(D,rt,ft,Dt){const Ct=new Uint8Array(4),Zt=i.createTexture();i.bindTexture(D,Zt),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Qt=0;Qt<ft;Qt++)n&&(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)?i.texImage3D(rt,0,i.RGBA,1,1,Dt,0,i.RGBA,i.UNSIGNED_BYTE,Ct):i.texImage2D(rt+Qt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ct);return Zt}const Ft={};Ft[i.TEXTURE_2D]=St(i.TEXTURE_2D,i.TEXTURE_2D,1),Ft[i.TEXTURE_CUBE_MAP]=St(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Ft[i.TEXTURE_2D_ARRAY]=St(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ft[i.TEXTURE_3D]=St(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),h.setClear(0),Bt(i.DEPTH_TEST),c.setFunc(qr),Gt(!1),T(_c),Bt(i.CULL_FACE),Mt(di);function Bt(D){f[D]!==!0&&(i.enable(D),f[D]=!0)}function Lt(D){f[D]!==!1&&(i.disable(D),f[D]=!1)}function Jt(D,rt){return p[D]!==rt?(i.bindFramebuffer(D,rt),p[D]=rt,n&&(D===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=rt),D===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=rt)),!0):!1}function O(D,rt){let ft=g,Dt=!1;if(D)if(ft=_.get(rt),ft===void 0&&(ft=[],_.set(rt,ft)),D.isWebGLMultipleRenderTargets){const Ct=D.texture;if(ft.length!==Ct.length||ft[0]!==i.COLOR_ATTACHMENT0){for(let Zt=0,Qt=Ct.length;Zt<Qt;Zt++)ft[Zt]=i.COLOR_ATTACHMENT0+Zt;ft.length=Ct.length,Dt=!0}}else ft[0]!==i.COLOR_ATTACHMENT0&&(ft[0]=i.COLOR_ATTACHMENT0,Dt=!0);else ft[0]!==i.BACK&&(ft[0]=i.BACK,Dt=!0);Dt&&(e.isWebGL2?i.drawBuffers(ft):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ft))}function Be(D){return m!==D?(i.useProgram(D),m=D,!0):!1}const Rt={[Ci]:i.FUNC_ADD,[of]:i.FUNC_SUBTRACT,[af]:i.FUNC_REVERSE_SUBTRACT};if(n)Rt[yc]=i.MIN,Rt[Sc]=i.MAX;else{const D=t.get("EXT_blend_minmax");D!==null&&(Rt[yc]=D.MIN_EXT,Rt[Sc]=D.MAX_EXT)}const Ut={[cf]:i.ZERO,[lf]:i.ONE,[hf]:i.SRC_COLOR,[xa]:i.SRC_ALPHA,[gf]:i.SRC_ALPHA_SATURATE,[pf]:i.DST_COLOR,[ff]:i.DST_ALPHA,[uf]:i.ONE_MINUS_SRC_COLOR,[Ma]:i.ONE_MINUS_SRC_ALPHA,[mf]:i.ONE_MINUS_DST_COLOR,[df]:i.ONE_MINUS_DST_ALPHA,[_f]:i.CONSTANT_COLOR,[vf]:i.ONE_MINUS_CONSTANT_COLOR,[xf]:i.CONSTANT_ALPHA,[Mf]:i.ONE_MINUS_CONSTANT_ALPHA};function Mt(D,rt,ft,Dt,Ct,Zt,Qt,xe,ye,te){if(D===di){d===!0&&(Lt(i.BLEND),d=!1);return}if(d===!1&&(Bt(i.BLEND),d=!0),D!==rf){if(D!==v||te!==H){if((x!==Ci||w!==Ci)&&(i.blendEquation(i.FUNC_ADD),x=Ci,w=Ci),te)switch(D){case ys:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vc:i.blendFunc(i.ONE,i.ONE);break;case xc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Mc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case ys:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case xc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Mc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}M=null,C=null,A=null,U=null,y.set(0,0,0),b=0,v=D,H=te}return}Ct=Ct||rt,Zt=Zt||ft,Qt=Qt||Dt,(rt!==x||Ct!==w)&&(i.blendEquationSeparate(Rt[rt],Rt[Ct]),x=rt,w=Ct),(ft!==M||Dt!==C||Zt!==A||Qt!==U)&&(i.blendFuncSeparate(Ut[ft],Ut[Dt],Ut[Zt],Ut[Qt]),M=ft,C=Dt,A=Zt,U=Qt),(xe.equals(y)===!1||ye!==b)&&(i.blendColor(xe.r,xe.g,xe.b,ye),y.copy(xe),b=ye),v=D,H=!1}function ue(D,rt){D.side===hn?Lt(i.CULL_FACE):Bt(i.CULL_FACE);let ft=D.side===nn;rt&&(ft=!ft),Gt(ft),D.blending===ys&&D.transparent===!1?Mt(di):Mt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),c.setFunc(D.depthFunc),c.setTest(D.depthTest),c.setMask(D.depthWrite),o.setMask(D.colorWrite);const Dt=D.stencilWrite;h.setTest(Dt),Dt&&(h.setMask(D.stencilWriteMask),h.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),h.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),z(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Bt(i.SAMPLE_ALPHA_TO_COVERAGE):Lt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Gt(D){G!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),G=D)}function T(D){D!==nf?(Bt(i.CULL_FACE),D!==K&&(D===_c?i.cullFace(i.BACK):D===sf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Lt(i.CULL_FACE),K=D}function S(D){D!==I&&($&&i.lineWidth(D),I=D)}function z(D,rt,ft){D?(Bt(i.POLYGON_OFFSET_FILL),(F!==rt||W!==ft)&&(i.polygonOffset(rt,ft),F=rt,W=ft)):Lt(i.POLYGON_OFFSET_FILL)}function nt(D){D?Bt(i.SCISSOR_TEST):Lt(i.SCISSOR_TEST)}function Q(D){D===void 0&&(D=i.TEXTURE0+Y-1),ot!==D&&(i.activeTexture(D),ot=D)}function it(D,rt,ft){ft===void 0&&(ot===null?ft=i.TEXTURE0+Y-1:ft=ot);let Dt=ct[ft];Dt===void 0&&(Dt={type:void 0,texture:void 0},ct[ft]=Dt),(Dt.type!==D||Dt.texture!==rt)&&(ot!==ft&&(i.activeTexture(ft),ot=ft),i.bindTexture(D,rt||Ft[D]),Dt.type=D,Dt.texture=rt)}function yt(){const D=ct[ot];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function dt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Pt(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Vt(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Z(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function se(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function qt(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Nt(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Tt(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function gt(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function P(D){mt.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),mt.copy(D))}function st(D){Et.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),Et.copy(D))}function bt(D,rt){let ft=u.get(rt);ft===void 0&&(ft=new WeakMap,u.set(rt,ft));let Dt=ft.get(D);Dt===void 0&&(Dt=i.getUniformBlockIndex(rt,D.name),ft.set(D,Dt))}function vt(D,rt){const Dt=u.get(rt).get(D);l.get(rt)!==Dt&&(i.uniformBlockBinding(rt,Dt,D.__bindingPointIndex),l.set(rt,Dt))}function tt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},ot=null,ct={},p={},_=new WeakMap,g=[],m=null,d=!1,v=null,x=null,M=null,C=null,w=null,A=null,U=null,y=new $t(0,0,0),b=0,H=!1,G=null,K=null,I=null,F=null,W=null,mt.set(0,0,i.canvas.width,i.canvas.height),Et.set(0,0,i.canvas.width,i.canvas.height),o.reset(),c.reset(),h.reset()}return{buffers:{color:o,depth:c,stencil:h},enable:Bt,disable:Lt,bindFramebuffer:Jt,drawBuffers:O,useProgram:Be,setBlending:Mt,setMaterial:ue,setFlipSided:Gt,setCullFace:T,setLineWidth:S,setPolygonOffset:z,setScissorTest:nt,activeTexture:Q,bindTexture:it,unbindTexture:yt,compressedTexImage2D:dt,compressedTexImage3D:xt,texImage2D:Tt,texImage3D:gt,updateUBOMapping:bt,uniformBlockBinding:vt,texStorage2D:qt,texStorage3D:Nt,texSubImage2D:Pt,texSubImage3D:Vt,compressedTexSubImage2D:Z,compressedTexSubImage3D:se,scissor:P,viewport:st,reset:tt}}function e_(i,t,e,n,s,r,a){const o=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(T,S){return p?new OffscreenCanvas(T,S):Qr("canvas")}function g(T,S,z,nt){let Q=1;if((T.width>nt||T.height>nt)&&(Q=nt/Math.max(T.width,T.height)),Q<1||S===!0)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap){const it=S?Ta:Math.floor,yt=it(Q*T.width),dt=it(Q*T.height);u===void 0&&(u=_(yt,dt));const xt=z?_(yt,dt):u;return xt.width=yt,xt.height=dt,xt.getContext("2d").drawImage(T,0,0,yt,dt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+T.width+"x"+T.height+") to ("+yt+"x"+dt+")."),xt}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+T.width+"x"+T.height+")."),T;return T}function m(T){return Zc(T.width)&&Zc(T.height)}function d(T){return o?!1:T.wrapS!==En||T.wrapT!==En||T.minFilter!==He&&T.minFilter!==en}function v(T,S){return T.generateMipmaps&&S&&T.minFilter!==He&&T.minFilter!==en}function x(T){i.generateMipmap(T)}function M(T,S,z,nt,Q=!1){if(o===!1)return S;if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let it=S;if(S===i.RED&&(z===i.FLOAT&&(it=i.R32F),z===i.HALF_FLOAT&&(it=i.R16F),z===i.UNSIGNED_BYTE&&(it=i.R8)),S===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(it=i.R8UI),z===i.UNSIGNED_SHORT&&(it=i.R16UI),z===i.UNSIGNED_INT&&(it=i.R32UI),z===i.BYTE&&(it=i.R8I),z===i.SHORT&&(it=i.R16I),z===i.INT&&(it=i.R32I)),S===i.RG&&(z===i.FLOAT&&(it=i.RG32F),z===i.HALF_FLOAT&&(it=i.RG16F),z===i.UNSIGNED_BYTE&&(it=i.RG8)),S===i.RGBA){const yt=Q?jr:le.getTransfer(nt);z===i.FLOAT&&(it=i.RGBA32F),z===i.HALF_FLOAT&&(it=i.RGBA16F),z===i.UNSIGNED_BYTE&&(it=yt===fe?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(it=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(it=i.RGB5_A1)}return(it===i.R16F||it===i.R32F||it===i.RG16F||it===i.RG32F||it===i.RGBA16F||it===i.RGBA32F)&&t.get("EXT_color_buffer_float"),it}function C(T,S,z){return v(T,z)===!0||T.isFramebufferTexture&&T.minFilter!==He&&T.minFilter!==en?Math.log2(Math.max(S.width,S.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?S.mipmaps.length:1}function w(T){return T===He||T===bc||T===Co?i.NEAREST:i.LINEAR}function A(T){const S=T.target;S.removeEventListener("dispose",A),y(S),S.isVideoTexture&&l.delete(S)}function U(T){const S=T.target;S.removeEventListener("dispose",U),H(S)}function y(T){const S=n.get(T);if(S.__webglInit===void 0)return;const z=T.source,nt=f.get(z);if(nt){const Q=nt[S.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&b(T),Object.keys(nt).length===0&&f.delete(z)}n.remove(T)}function b(T){const S=n.get(T);i.deleteTexture(S.__webglTexture);const z=T.source,nt=f.get(z);delete nt[S.__cacheKey],a.memory.textures--}function H(T){const S=T.texture,z=n.get(T),nt=n.get(S);if(nt.__webglTexture!==void 0&&(i.deleteTexture(nt.__webglTexture),a.memory.textures--),T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(z.__webglFramebuffer[Q]))for(let it=0;it<z.__webglFramebuffer[Q].length;it++)i.deleteFramebuffer(z.__webglFramebuffer[Q][it]);else i.deleteFramebuffer(z.__webglFramebuffer[Q]);z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer[Q])}else{if(Array.isArray(z.__webglFramebuffer))for(let Q=0;Q<z.__webglFramebuffer.length;Q++)i.deleteFramebuffer(z.__webglFramebuffer[Q]);else i.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&i.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let Q=0;Q<z.__webglColorRenderbuffer.length;Q++)z.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(z.__webglColorRenderbuffer[Q]);z.__webglDepthRenderbuffer&&i.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(T.isWebGLMultipleRenderTargets)for(let Q=0,it=S.length;Q<it;Q++){const yt=n.get(S[Q]);yt.__webglTexture&&(i.deleteTexture(yt.__webglTexture),a.memory.textures--),n.remove(S[Q])}n.remove(S),n.remove(T)}let G=0;function K(){G=0}function I(){const T=G;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),G+=1,T}function F(T){const S=[];return S.push(T.wrapS),S.push(T.wrapT),S.push(T.wrapR||0),S.push(T.magFilter),S.push(T.minFilter),S.push(T.anisotropy),S.push(T.internalFormat),S.push(T.format),S.push(T.type),S.push(T.generateMipmaps),S.push(T.premultiplyAlpha),S.push(T.flipY),S.push(T.unpackAlignment),S.push(T.colorSpace),S.join()}function W(T,S){const z=n.get(T);if(T.isVideoTexture&&ue(T),T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){const nt=T.image;if(nt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(nt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{mt(z,T,S);return}}e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+S)}function Y(T,S){const z=n.get(T);if(T.version>0&&z.__version!==T.version){mt(z,T,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+S)}function $(T,S){const z=n.get(T);if(T.version>0&&z.__version!==T.version){mt(z,T,S);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+S)}function q(T,S){const z=n.get(T);if(T.version>0&&z.__version!==T.version){Et(z,T,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+S)}const j={[Yr]:i.REPEAT,[En]:i.CLAMP_TO_EDGE,[ba]:i.MIRRORED_REPEAT},ot={[He]:i.NEAREST,[bc]:i.NEAREST_MIPMAP_NEAREST,[Co]:i.NEAREST_MIPMAP_LINEAR,[en]:i.LINEAR,[Nf]:i.LINEAR_MIPMAP_NEAREST,[nr]:i.LINEAR_MIPMAP_LINEAR},ct={[qf]:i.NEVER,[Qf]:i.ALWAYS,[Yf]:i.LESS,[Ih]:i.LEQUAL,[jf]:i.EQUAL,[Zf]:i.GEQUAL,[Kf]:i.GREATER,[Jf]:i.NOTEQUAL};function X(T,S,z){if(z?(i.texParameteri(T,i.TEXTURE_WRAP_S,j[S.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,j[S.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,j[S.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ot[S.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ot[S.minFilter])):(i.texParameteri(T,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(T,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(S.wrapS!==En||S.wrapT!==En)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(T,i.TEXTURE_MAG_FILTER,w(S.magFilter)),i.texParameteri(T,i.TEXTURE_MIN_FILTER,w(S.minFilter)),S.minFilter!==He&&S.minFilter!==en&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),S.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ct[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const nt=t.get("EXT_texture_filter_anisotropic");if(S.magFilter===He||S.minFilter!==Co&&S.minFilter!==nr||S.type===fi&&t.has("OES_texture_float_linear")===!1||o===!1&&S.type===ir&&t.has("OES_texture_half_float_linear")===!1)return;(S.anisotropy>1||n.get(S).__currentAnisotropy)&&(i.texParameterf(T,nt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy)}}function J(T,S){let z=!1;T.__webglInit===void 0&&(T.__webglInit=!0,S.addEventListener("dispose",A));const nt=S.source;let Q=f.get(nt);Q===void 0&&(Q={},f.set(nt,Q));const it=F(S);if(it!==T.__cacheKey){Q[it]===void 0&&(Q[it]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,z=!0),Q[it].usedTimes++;const yt=Q[T.__cacheKey];yt!==void 0&&(Q[T.__cacheKey].usedTimes--,yt.usedTimes===0&&b(S)),T.__cacheKey=it,T.__webglTexture=Q[it].texture}return z}function mt(T,S,z){let nt=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(nt=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(nt=i.TEXTURE_3D);const Q=J(T,S),it=S.source;e.bindTexture(nt,T.__webglTexture,i.TEXTURE0+z);const yt=n.get(it);if(it.version!==yt.__version||Q===!0){e.activeTexture(i.TEXTURE0+z);const dt=le.getPrimaries(le.workingColorSpace),xt=S.colorSpace===vn?null:le.getPrimaries(S.colorSpace),Pt=S.colorSpace===vn||dt===xt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const Vt=d(S)&&m(S.image)===!1;let Z=g(S.image,Vt,!1,s.maxTextureSize);Z=Gt(S,Z);const se=m(Z)||o,qt=r.convert(S.format,S.colorSpace);let Nt=r.convert(S.type),Tt=M(S.internalFormat,qt,Nt,S.colorSpace,S.isVideoTexture);X(nt,S,se);let gt;const P=S.mipmaps,st=o&&S.isVideoTexture!==!0&&Tt!==Lh,bt=yt.__version===void 0||Q===!0,vt=C(S,Z,se);if(S.isDepthTexture)Tt=i.DEPTH_COMPONENT,o?S.type===fi?Tt=i.DEPTH_COMPONENT32F:S.type===ui?Tt=i.DEPTH_COMPONENT24:S.type===Li?Tt=i.DEPTH24_STENCIL8:Tt=i.DEPTH_COMPONENT16:S.type===fi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),S.format===Di&&Tt===i.DEPTH_COMPONENT&&S.type!==Oa&&S.type!==ui&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),S.type=ui,Nt=r.convert(S.type)),S.format===Rs&&Tt===i.DEPTH_COMPONENT&&(Tt=i.DEPTH_STENCIL,S.type!==Li&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),S.type=Li,Nt=r.convert(S.type))),bt&&(st?e.texStorage2D(i.TEXTURE_2D,1,Tt,Z.width,Z.height):e.texImage2D(i.TEXTURE_2D,0,Tt,Z.width,Z.height,0,qt,Nt,null));else if(S.isDataTexture)if(P.length>0&&se){st&&bt&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,P[0].width,P[0].height);for(let tt=0,D=P.length;tt<D;tt++)gt=P[tt],st?e.texSubImage2D(i.TEXTURE_2D,tt,0,0,gt.width,gt.height,qt,Nt,gt.data):e.texImage2D(i.TEXTURE_2D,tt,Tt,gt.width,gt.height,0,qt,Nt,gt.data);S.generateMipmaps=!1}else st?(bt&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,Z.width,Z.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Z.width,Z.height,qt,Nt,Z.data)):e.texImage2D(i.TEXTURE_2D,0,Tt,Z.width,Z.height,0,qt,Nt,Z.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){st&&bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,Tt,P[0].width,P[0].height,Z.depth);for(let tt=0,D=P.length;tt<D;tt++)gt=P[tt],S.format!==_n?qt!==null?st?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,gt.width,gt.height,Z.depth,qt,gt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,tt,Tt,gt.width,gt.height,Z.depth,0,gt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?e.texSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,gt.width,gt.height,Z.depth,qt,Nt,gt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,tt,Tt,gt.width,gt.height,Z.depth,0,qt,Nt,gt.data)}else{st&&bt&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,P[0].width,P[0].height);for(let tt=0,D=P.length;tt<D;tt++)gt=P[tt],S.format!==_n?qt!==null?st?e.compressedTexSubImage2D(i.TEXTURE_2D,tt,0,0,gt.width,gt.height,qt,gt.data):e.compressedTexImage2D(i.TEXTURE_2D,tt,Tt,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?e.texSubImage2D(i.TEXTURE_2D,tt,0,0,gt.width,gt.height,qt,Nt,gt.data):e.texImage2D(i.TEXTURE_2D,tt,Tt,gt.width,gt.height,0,qt,Nt,gt.data)}else if(S.isDataArrayTexture)st?(bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,Tt,Z.width,Z.height,Z.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,qt,Nt,Z.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Tt,Z.width,Z.height,Z.depth,0,qt,Nt,Z.data);else if(S.isData3DTexture)st?(bt&&e.texStorage3D(i.TEXTURE_3D,vt,Tt,Z.width,Z.height,Z.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,qt,Nt,Z.data)):e.texImage3D(i.TEXTURE_3D,0,Tt,Z.width,Z.height,Z.depth,0,qt,Nt,Z.data);else if(S.isFramebufferTexture){if(bt)if(st)e.texStorage2D(i.TEXTURE_2D,vt,Tt,Z.width,Z.height);else{let tt=Z.width,D=Z.height;for(let rt=0;rt<vt;rt++)e.texImage2D(i.TEXTURE_2D,rt,Tt,tt,D,0,qt,Nt,null),tt>>=1,D>>=1}}else if(P.length>0&&se){st&&bt&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,P[0].width,P[0].height);for(let tt=0,D=P.length;tt<D;tt++)gt=P[tt],st?e.texSubImage2D(i.TEXTURE_2D,tt,0,0,qt,Nt,gt):e.texImage2D(i.TEXTURE_2D,tt,Tt,qt,Nt,gt);S.generateMipmaps=!1}else st?(bt&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,Z.width,Z.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,qt,Nt,Z)):e.texImage2D(i.TEXTURE_2D,0,Tt,qt,Nt,Z);v(S,se)&&x(nt),yt.__version=it.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function Et(T,S,z){if(S.image.length!==6)return;const nt=J(T,S),Q=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+z);const it=n.get(Q);if(Q.version!==it.__version||nt===!0){e.activeTexture(i.TEXTURE0+z);const yt=le.getPrimaries(le.workingColorSpace),dt=S.colorSpace===vn?null:le.getPrimaries(S.colorSpace),xt=S.colorSpace===vn||yt===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const Pt=S.isCompressedTexture||S.image[0].isCompressedTexture,Vt=S.image[0]&&S.image[0].isDataTexture,Z=[];for(let tt=0;tt<6;tt++)!Pt&&!Vt?Z[tt]=g(S.image[tt],!1,!0,s.maxCubemapSize):Z[tt]=Vt?S.image[tt].image:S.image[tt],Z[tt]=Gt(S,Z[tt]);const se=Z[0],qt=m(se)||o,Nt=r.convert(S.format,S.colorSpace),Tt=r.convert(S.type),gt=M(S.internalFormat,Nt,Tt,S.colorSpace),P=o&&S.isVideoTexture!==!0,st=it.__version===void 0||nt===!0;let bt=C(S,se,qt);X(i.TEXTURE_CUBE_MAP,S,qt);let vt;if(Pt){P&&st&&e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,gt,se.width,se.height);for(let tt=0;tt<6;tt++){vt=Z[tt].mipmaps;for(let D=0;D<vt.length;D++){const rt=vt[D];S.format!==_n?Nt!==null?P?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D,0,0,rt.width,rt.height,Nt,rt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D,gt,rt.width,rt.height,0,rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D,0,0,rt.width,rt.height,Nt,Tt,rt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D,gt,rt.width,rt.height,0,Nt,Tt,rt.data)}}}else{vt=S.mipmaps,P&&st&&(vt.length>0&&bt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,gt,Z[0].width,Z[0].height));for(let tt=0;tt<6;tt++)if(Vt){P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,Z[tt].width,Z[tt].height,Nt,Tt,Z[tt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,gt,Z[tt].width,Z[tt].height,0,Nt,Tt,Z[tt].data);for(let D=0;D<vt.length;D++){const ft=vt[D].image[tt].image;P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D+1,0,0,ft.width,ft.height,Nt,Tt,ft.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D+1,gt,ft.width,ft.height,0,Nt,Tt,ft.data)}}else{P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,Nt,Tt,Z[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,gt,Nt,Tt,Z[tt]);for(let D=0;D<vt.length;D++){const rt=vt[D];P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D+1,0,0,Nt,Tt,rt.image[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D+1,gt,Nt,Tt,rt.image[tt])}}}v(S,qt)&&x(i.TEXTURE_CUBE_MAP),it.__version=Q.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function St(T,S,z,nt,Q,it){const yt=r.convert(z.format,z.colorSpace),dt=r.convert(z.type),xt=M(z.internalFormat,yt,dt,z.colorSpace);if(!n.get(S).__hasExternalTextures){const Vt=Math.max(1,S.width>>it),Z=Math.max(1,S.height>>it);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?e.texImage3D(Q,it,xt,Vt,Z,S.depth,0,yt,dt,null):e.texImage2D(Q,it,xt,Vt,Z,0,yt,dt,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,nt,Q,n.get(z).__webglTexture,0,Ut(S)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,nt,Q,n.get(z).__webglTexture,it),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ft(T,S,z){if(i.bindRenderbuffer(i.RENDERBUFFER,T),S.depthBuffer&&!S.stencilBuffer){let nt=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(z||Mt(S)){const Q=S.depthTexture;Q&&Q.isDepthTexture&&(Q.type===fi?nt=i.DEPTH_COMPONENT32F:Q.type===ui&&(nt=i.DEPTH_COMPONENT24));const it=Ut(S);Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it,nt,S.width,S.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,it,nt,S.width,S.height)}else i.renderbufferStorage(i.RENDERBUFFER,nt,S.width,S.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,T)}else if(S.depthBuffer&&S.stencilBuffer){const nt=Ut(S);z&&Mt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,i.DEPTH24_STENCIL8,S.width,S.height):Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,i.DEPTH24_STENCIL8,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,T)}else{const nt=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let Q=0;Q<nt.length;Q++){const it=nt[Q],yt=r.convert(it.format,it.colorSpace),dt=r.convert(it.type),xt=M(it.internalFormat,yt,dt,it.colorSpace),Pt=Ut(S);z&&Mt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Pt,xt,S.width,S.height):Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Pt,xt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,xt,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Bt(T,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),W(S.depthTexture,0);const nt=n.get(S.depthTexture).__webglTexture,Q=Ut(S);if(S.depthTexture.format===Di)Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0);else if(S.depthTexture.format===Rs)Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0);else throw new Error("Unknown depthTexture format")}function Lt(T){const S=n.get(T),z=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!S.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Bt(S.__webglFramebuffer,T)}else if(z){S.__webglDepthbuffer=[];for(let nt=0;nt<6;nt++)e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[nt]),S.__webglDepthbuffer[nt]=i.createRenderbuffer(),Ft(S.__webglDepthbuffer[nt],T,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=i.createRenderbuffer(),Ft(S.__webglDepthbuffer,T,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Jt(T,S,z){const nt=n.get(T);S!==void 0&&St(nt.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&Lt(T)}function O(T){const S=T.texture,z=n.get(T),nt=n.get(S);T.addEventListener("dispose",U),T.isWebGLMultipleRenderTargets!==!0&&(nt.__webglTexture===void 0&&(nt.__webglTexture=i.createTexture()),nt.__version=S.version,a.memory.textures++);const Q=T.isWebGLCubeRenderTarget===!0,it=T.isWebGLMultipleRenderTargets===!0,yt=m(T)||o;if(Q){z.__webglFramebuffer=[];for(let dt=0;dt<6;dt++)if(o&&S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer[dt]=[];for(let xt=0;xt<S.mipmaps.length;xt++)z.__webglFramebuffer[dt][xt]=i.createFramebuffer()}else z.__webglFramebuffer[dt]=i.createFramebuffer()}else{if(o&&S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer=[];for(let dt=0;dt<S.mipmaps.length;dt++)z.__webglFramebuffer[dt]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(it)if(s.drawBuffers){const dt=T.texture;for(let xt=0,Pt=dt.length;xt<Pt;xt++){const Vt=n.get(dt[xt]);Vt.__webglTexture===void 0&&(Vt.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&T.samples>0&&Mt(T)===!1){const dt=it?S:[S];z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let xt=0;xt<dt.length;xt++){const Pt=dt[xt];z.__webglColorRenderbuffer[xt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[xt]);const Vt=r.convert(Pt.format,Pt.colorSpace),Z=r.convert(Pt.type),se=M(Pt.internalFormat,Vt,Z,Pt.colorSpace,T.isXRRenderTarget===!0),qt=Ut(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,qt,se,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,z.__webglColorRenderbuffer[xt])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Ft(z.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Q){e.bindTexture(i.TEXTURE_CUBE_MAP,nt.__webglTexture),X(i.TEXTURE_CUBE_MAP,S,yt);for(let dt=0;dt<6;dt++)if(o&&S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)St(z.__webglFramebuffer[dt][xt],T,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,xt);else St(z.__webglFramebuffer[dt],T,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0);v(S,yt)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(it){const dt=T.texture;for(let xt=0,Pt=dt.length;xt<Pt;xt++){const Vt=dt[xt],Z=n.get(Vt);e.bindTexture(i.TEXTURE_2D,Z.__webglTexture),X(i.TEXTURE_2D,Vt,yt),St(z.__webglFramebuffer,T,Vt,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,0),v(Vt,yt)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let dt=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(o?dt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(dt,nt.__webglTexture),X(dt,S,yt),o&&S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)St(z.__webglFramebuffer[xt],T,S,i.COLOR_ATTACHMENT0,dt,xt);else St(z.__webglFramebuffer,T,S,i.COLOR_ATTACHMENT0,dt,0);v(S,yt)&&x(dt),e.unbindTexture()}T.depthBuffer&&Lt(T)}function Be(T){const S=m(T)||o,z=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let nt=0,Q=z.length;nt<Q;nt++){const it=z[nt];if(v(it,S)){const yt=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,dt=n.get(it).__webglTexture;e.bindTexture(yt,dt),x(yt),e.unbindTexture()}}}function Rt(T){if(o&&T.samples>0&&Mt(T)===!1){const S=T.isWebGLMultipleRenderTargets?T.texture:[T.texture],z=T.width,nt=T.height;let Q=i.COLOR_BUFFER_BIT;const it=[],yt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=n.get(T),xt=T.isWebGLMultipleRenderTargets===!0;if(xt)for(let Pt=0;Pt<S.length;Pt++)e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,dt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,dt.__webglFramebuffer);for(let Pt=0;Pt<S.length;Pt++){it.push(i.COLOR_ATTACHMENT0+Pt),T.depthBuffer&&it.push(yt);const Vt=dt.__ignoreDepthValues!==void 0?dt.__ignoreDepthValues:!1;if(Vt===!1&&(T.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),xt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,dt.__webglColorRenderbuffer[Pt]),Vt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[yt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[yt])),xt){const Z=n.get(S[Pt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Z,0)}i.blitFramebuffer(0,0,z,nt,0,0,z,nt,Q,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,it)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),xt)for(let Pt=0;Pt<S.length;Pt++){e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,dt.__webglColorRenderbuffer[Pt]);const Vt=n.get(S[Pt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,Vt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,dt.__webglMultisampledFramebuffer)}}function Ut(T){return Math.min(s.maxSamples,T.samples)}function Mt(T){const S=n.get(T);return o&&T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function ue(T){const S=a.render.frame;l.get(T)!==S&&(l.set(T,S),T.update())}function Gt(T,S){const z=T.colorSpace,nt=T.format,Q=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||T.format===Ea||z!==ii&&z!==vn&&(le.getTransfer(z)===fe?o===!1?t.has("EXT_sRGB")===!0&&nt===_n?(T.format=Ea,T.minFilter=en,T.generateMipmaps=!1):S=Nh.sRGBToLinear(S):(nt!==_n||Q!==mi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),S}this.allocateTextureUnit=I,this.resetTextureUnits=K,this.setTexture2D=W,this.setTexture2DArray=Y,this.setTexture3D=$,this.setTextureCube=q,this.rebindTextures=Jt,this.setupRenderTarget=O,this.updateRenderTargetMipmap=Be,this.updateMultisampleRenderTarget=Rt,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=St,this.useMultisampledRTT=Mt}function n_(i,t,e){const n=e.isWebGL2;function s(r,a=vn){let o;const c=le.getTransfer(a);if(r===mi)return i.UNSIGNED_BYTE;if(r===Th)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Ah)return i.UNSIGNED_SHORT_5_5_5_1;if(r===zf)return i.BYTE;if(r===Of)return i.SHORT;if(r===Oa)return i.UNSIGNED_SHORT;if(r===wh)return i.INT;if(r===ui)return i.UNSIGNED_INT;if(r===fi)return i.FLOAT;if(r===ir)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===Ff)return i.ALPHA;if(r===_n)return i.RGBA;if(r===Bf)return i.LUMINANCE;if(r===kf)return i.LUMINANCE_ALPHA;if(r===Di)return i.DEPTH_COMPONENT;if(r===Rs)return i.DEPTH_STENCIL;if(r===Ea)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Hf)return i.RED;if(r===Rh)return i.RED_INTEGER;if(r===Gf)return i.RG;if(r===Ch)return i.RG_INTEGER;if(r===Ph)return i.RGBA_INTEGER;if(r===Po||r===Lo||r===Do||r===Io)if(c===fe)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Po)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Lo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Do)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Io)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Po)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Lo)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Do)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Io)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ec||r===wc||r===Tc||r===Ac)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Ec)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===wc)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Tc)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ac)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Lh)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Rc||r===Cc)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===Rc)return c===fe?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===Cc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Pc||r===Lc||r===Dc||r===Ic||r===Uc||r===Nc||r===zc||r===Oc||r===Fc||r===Bc||r===kc||r===Hc||r===Gc||r===Vc)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Pc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Lc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Dc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Ic)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Uc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Nc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===zc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Oc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Fc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Bc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===kc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Hc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Gc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Vc)return c===fe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Uo||r===Wc||r===Xc)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===Uo)return c===fe?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Wc)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Xc)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Vf||r===$c||r===qc||r===Yc)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===Uo)return o.COMPRESSED_RED_RGTC1_EXT;if(r===$c)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===qc)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Yc)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Li?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class i_ extends cn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ot extends ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const s_={type:"move"};class sa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ot,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ot,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ot,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(const g of t.hand.values()){const m=e.getJointPose(g,n),d=this._getHandJoint(h,g);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],f=l.position.distanceTo(u.position),p=.02,_=.005;h.inputState.pinching&&f>p+_?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&f<=p-_&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(s_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ot;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class r_ extends ki{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,h=null,l=null,u=null,f=null,p=null,_=null;const g=e.getContextAttributes();let m=null,d=null;const v=[],x=[],M=new ht;let C=null;const w=new cn;w.layers.enable(1),w.viewport=new pe;const A=new cn;A.layers.enable(2),A.viewport=new pe;const U=[w,A],y=new i_;y.layers.enable(1),y.layers.enable(2);let b=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let J=v[X];return J===void 0&&(J=new sa,v[X]=J),J.getTargetRaySpace()},this.getControllerGrip=function(X){let J=v[X];return J===void 0&&(J=new sa,v[X]=J),J.getGripSpace()},this.getHand=function(X){let J=v[X];return J===void 0&&(J=new sa,v[X]=J),J.getHandSpace()};function G(X){const J=x.indexOf(X.inputSource);if(J===-1)return;const mt=v[J];mt!==void 0&&(mt.update(X.inputSource,X.frame,h||a),mt.dispatchEvent({type:X.type,data:X.inputSource}))}function K(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",I);for(let X=0;X<v.length;X++){const J=x[X];J!==null&&(x[X]=null,v[X].disconnect(J))}b=null,H=null,t.setRenderTarget(m),p=null,f=null,u=null,s=null,d=null,ct.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(X){h=X},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",K),s.addEventListener("inputsourceschange",I),g.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(M),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const J={antialias:s.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,J),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),d=new zi(p.framebufferWidth,p.framebufferHeight,{format:_n,type:mi,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let J=null,mt=null,Et=null;g.depth&&(Et=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=g.stencil?Rs:Di,mt=g.stencil?Li:ui);const St={colorFormat:e.RGBA8,depthFormat:Et,scaleFactor:r};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(St),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),d=new zi(f.textureWidth,f.textureHeight,{format:_n,type:mi,depthTexture:new $h(f.textureWidth,f.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const Ft=t.properties.get(d);Ft.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),ct.setContext(s),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function I(X){for(let J=0;J<X.removed.length;J++){const mt=X.removed[J],Et=x.indexOf(mt);Et>=0&&(x[Et]=null,v[Et].disconnect(mt))}for(let J=0;J<X.added.length;J++){const mt=X.added[J];let Et=x.indexOf(mt);if(Et===-1){for(let Ft=0;Ft<v.length;Ft++)if(Ft>=x.length){x.push(mt),Et=Ft;break}else if(x[Ft]===null){x[Ft]=mt,Et=Ft;break}if(Et===-1)break}const St=v[Et];St&&St.connect(mt)}}const F=new R,W=new R;function Y(X,J,mt){F.setFromMatrixPosition(J.matrixWorld),W.setFromMatrixPosition(mt.matrixWorld);const Et=F.distanceTo(W),St=J.projectionMatrix.elements,Ft=mt.projectionMatrix.elements,Bt=St[14]/(St[10]-1),Lt=St[14]/(St[10]+1),Jt=(St[9]+1)/St[5],O=(St[9]-1)/St[5],Be=(St[8]-1)/St[0],Rt=(Ft[8]+1)/Ft[0],Ut=Bt*Be,Mt=Bt*Rt,ue=Et/(-Be+Rt),Gt=ue*-Be;J.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Gt),X.translateZ(ue),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const T=Bt+ue,S=Lt+ue,z=Ut-Gt,nt=Mt+(Et-Gt),Q=Jt*Lt/S*T,it=O*Lt/S*T;X.projectionMatrix.makePerspective(z,nt,Q,it,T,S),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function $(X,J){J===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(J.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;y.near=A.near=w.near=X.near,y.far=A.far=w.far=X.far,(b!==y.near||H!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),b=y.near,H=y.far);const J=X.parent,mt=y.cameras;$(y,J);for(let Et=0;Et<mt.length;Et++)$(mt[Et],J);mt.length===2?Y(y,w,A):y.projectionMatrix.copy(w.projectionMatrix),q(X,y,J)};function q(X,J,mt){mt===null?X.matrix.copy(J.matrixWorld):(X.matrix.copy(mt.matrixWorld),X.matrix.invert(),X.matrix.multiply(J.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(J.projectionMatrix),X.projectionMatrixInverse.copy(J.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=wa*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(X){c=X,f!==null&&(f.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)};let j=null;function ot(X,J){if(l=J.getViewerPose(h||a),_=J,l!==null){const mt=l.views;p!==null&&(t.setRenderTargetFramebuffer(d,p.framebuffer),t.setRenderTarget(d));let Et=!1;mt.length!==y.cameras.length&&(y.cameras.length=0,Et=!0);for(let St=0;St<mt.length;St++){const Ft=mt[St];let Bt=null;if(p!==null)Bt=p.getViewport(Ft);else{const Jt=u.getViewSubImage(f,Ft);Bt=Jt.viewport,St===0&&(t.setRenderTargetTextures(d,Jt.colorTexture,f.ignoreDepthValues?void 0:Jt.depthStencilTexture),t.setRenderTarget(d))}let Lt=U[St];Lt===void 0&&(Lt=new cn,Lt.layers.enable(St),Lt.viewport=new pe,U[St]=Lt),Lt.matrix.fromArray(Ft.transform.matrix),Lt.matrix.decompose(Lt.position,Lt.quaternion,Lt.scale),Lt.projectionMatrix.fromArray(Ft.projectionMatrix),Lt.projectionMatrixInverse.copy(Lt.projectionMatrix).invert(),Lt.viewport.set(Bt.x,Bt.y,Bt.width,Bt.height),St===0&&(y.matrix.copy(Lt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),Et===!0&&y.cameras.push(Lt)}}for(let mt=0;mt<v.length;mt++){const Et=x[mt],St=v[mt];Et!==null&&St!==void 0&&St.update(Et,J,h||a)}j&&j(X,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),_=null}const ct=new Wh;ct.setAnimationLoop(ot),this.setAnimationLoop=function(X){j=X},this.dispose=function(){}}}function o_(i,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,Hh(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,v,x,M){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),l(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,M)):d.isMeshMatcapMaterial?(r(m,d),_(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),g(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?c(m,d,v,x):d.isSpriteMaterial?h(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===nn&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===nn&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const v=t.get(d).envMap;if(v&&(m.envMap.value=v,m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;const x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*x,e(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,v,x){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*v,m.scale.value=x*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),t.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,v){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===nn&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,d){d.matcap&&(m.matcap.value=d.matcap)}function g(m,d){const v=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function a_(i,t,e,n){let s={},r={},a=[];const o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(v,x){const M=x.program;n.uniformBlockBinding(v,M)}function h(v,x){let M=s[v.id];M===void 0&&(_(v),M=l(v),s[v.id]=M,v.addEventListener("dispose",m));const C=x.program;n.updateUBOMapping(v,C);const w=t.render.frame;r[v.id]!==w&&(f(v),r[v.id]=w)}function l(v){const x=u();v.__bindingPointIndex=x;const M=i.createBuffer(),C=v.__size,w=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,C,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,M),M}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const x=s[v.id],M=v.uniforms,C=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let w=0,A=M.length;w<A;w++){const U=Array.isArray(M[w])?M[w]:[M[w]];for(let y=0,b=U.length;y<b;y++){const H=U[y];if(p(H,w,y,C)===!0){const G=H.__offset,K=Array.isArray(H.value)?H.value:[H.value];let I=0;for(let F=0;F<K.length;F++){const W=K[F],Y=g(W);typeof W=="number"||typeof W=="boolean"?(H.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,G+I,H.__data)):W.isMatrix3?(H.__data[0]=W.elements[0],H.__data[1]=W.elements[1],H.__data[2]=W.elements[2],H.__data[3]=0,H.__data[4]=W.elements[3],H.__data[5]=W.elements[4],H.__data[6]=W.elements[5],H.__data[7]=0,H.__data[8]=W.elements[6],H.__data[9]=W.elements[7],H.__data[10]=W.elements[8],H.__data[11]=0):(W.toArray(H.__data,I),I+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,H.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,x,M,C){const w=v.value,A=x+"_"+M;if(C[A]===void 0)return typeof w=="number"||typeof w=="boolean"?C[A]=w:C[A]=w.clone(),!0;{const U=C[A];if(typeof w=="number"||typeof w=="boolean"){if(U!==w)return C[A]=w,!0}else if(U.equals(w)===!1)return U.copy(w),!0}return!1}function _(v){const x=v.uniforms;let M=0;const C=16;for(let A=0,U=x.length;A<U;A++){const y=Array.isArray(x[A])?x[A]:[x[A]];for(let b=0,H=y.length;b<H;b++){const G=y[b],K=Array.isArray(G.value)?G.value:[G.value];for(let I=0,F=K.length;I<F;I++){const W=K[I],Y=g(W),$=M%C;$!==0&&C-$<Y.boundary&&(M+=C-$),G.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=M,M+=Y.storage}}}const w=M%C;return w>0&&(M+=C-w),v.__size=M,v.__cache={},this}function g(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function m(v){const x=v.target;x.removeEventListener("dispose",m);const M=a.indexOf(x.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function d(){for(const v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:h,dispose:d}}class Zh{constructor(t={}){const{canvas:e=id(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=a;const p=new Uint32Array(4),_=new Int32Array(4);let g=null,m=null;const d=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ae,this._useLegacyLights=!1,this.toneMapping=pi,this.toneMappingExposure=1;const x=this;let M=!1,C=0,w=0,A=null,U=-1,y=null;const b=new pe,H=new pe;let G=null;const K=new $t(0);let I=0,F=e.width,W=e.height,Y=1,$=null,q=null;const j=new pe(0,0,F,W),ot=new pe(0,0,F,W);let ct=!1;const X=new Ha;let J=!1,mt=!1,Et=null;const St=new ce,Ft=new ht,Bt=new R,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Jt(){return A===null?Y:1}let O=n;function Be(E,N){for(let k=0;k<E.length;k++){const V=E[k],B=e.getContext(V,N);if(B!==null)return B}return null}try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Na}`),e.addEventListener("webglcontextlost",tt,!1),e.addEventListener("webglcontextrestored",D,!1),e.addEventListener("webglcontextcreationerror",rt,!1),O===null){const N=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&N.shift(),O=Be(N,E),O===null)throw Be(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&O instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),O.getShaderPrecisionFormat===void 0&&(O.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Rt,Ut,Mt,ue,Gt,T,S,z,nt,Q,it,yt,dt,xt,Pt,Vt,Z,se,qt,Nt,Tt,gt,P,st;function bt(){Rt=new _0(O),Ut=new u0(O,Rt,t),Rt.init(Ut),gt=new n_(O,Rt,Ut),Mt=new t_(O,Rt,Ut),ue=new M0(O),Gt=new kg,T=new e_(O,Rt,Mt,Gt,Ut,gt,ue),S=new d0(x),z=new g0(x),nt=new Rd(O,Ut),P=new l0(O,Rt,nt,Ut),Q=new v0(O,nt,ue,P),it=new E0(O,Q,nt,ue),qt=new b0(O,Ut,T),Vt=new f0(Gt),yt=new Bg(x,S,z,Rt,Ut,P,Vt),dt=new o_(x,Gt),xt=new Gg,Pt=new Yg(Rt,Ut),se=new c0(x,S,z,Mt,it,f,c),Z=new Qg(x,it,Ut),st=new a_(O,ue,Ut,Mt),Nt=new h0(O,Rt,ue,Ut),Tt=new x0(O,Rt,ue,Ut),ue.programs=yt.programs,x.capabilities=Ut,x.extensions=Rt,x.properties=Gt,x.renderLists=xt,x.shadowMap=Z,x.state=Mt,x.info=ue}bt();const vt=new r_(x,O);this.xr=vt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const E=Rt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Rt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(E){E!==void 0&&(Y=E,this.setSize(F,W,!1))},this.getSize=function(E){return E.set(F,W)},this.setSize=function(E,N,k=!0){if(vt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=E,W=N,e.width=Math.floor(E*Y),e.height=Math.floor(N*Y),k===!0&&(e.style.width=E+"px",e.style.height=N+"px"),this.setViewport(0,0,E,N)},this.getDrawingBufferSize=function(E){return E.set(F*Y,W*Y).floor()},this.setDrawingBufferSize=function(E,N,k){F=E,W=N,Y=k,e.width=Math.floor(E*k),e.height=Math.floor(N*k),this.setViewport(0,0,E,N)},this.getCurrentViewport=function(E){return E.copy(b)},this.getViewport=function(E){return E.copy(j)},this.setViewport=function(E,N,k,V){E.isVector4?j.set(E.x,E.y,E.z,E.w):j.set(E,N,k,V),Mt.viewport(b.copy(j).multiplyScalar(Y).floor())},this.getScissor=function(E){return E.copy(ot)},this.setScissor=function(E,N,k,V){E.isVector4?ot.set(E.x,E.y,E.z,E.w):ot.set(E,N,k,V),Mt.scissor(H.copy(ot).multiplyScalar(Y).floor())},this.getScissorTest=function(){return ct},this.setScissorTest=function(E){Mt.setScissorTest(ct=E)},this.setOpaqueSort=function(E){$=E},this.setTransparentSort=function(E){q=E},this.getClearColor=function(E){return E.copy(se.getClearColor())},this.setClearColor=function(){se.setClearColor.apply(se,arguments)},this.getClearAlpha=function(){return se.getClearAlpha()},this.setClearAlpha=function(){se.setClearAlpha.apply(se,arguments)},this.clear=function(E=!0,N=!0,k=!0){let V=0;if(E){let B=!1;if(A!==null){const _t=A.texture.format;B=_t===Ph||_t===Ch||_t===Rh}if(B){const _t=A.texture.type,wt=_t===mi||_t===ui||_t===Oa||_t===Li||_t===Th||_t===Ah,It=se.getClearColor(),zt=se.getClearAlpha(),Yt=It.r,Ht=It.g,Wt=It.b;wt?(p[0]=Yt,p[1]=Ht,p[2]=Wt,p[3]=zt,O.clearBufferuiv(O.COLOR,0,p)):(_[0]=Yt,_[1]=Ht,_[2]=Wt,_[3]=zt,O.clearBufferiv(O.COLOR,0,_))}else V|=O.COLOR_BUFFER_BIT}N&&(V|=O.DEPTH_BUFFER_BIT),k&&(V|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",tt,!1),e.removeEventListener("webglcontextrestored",D,!1),e.removeEventListener("webglcontextcreationerror",rt,!1),xt.dispose(),Pt.dispose(),Gt.dispose(),S.dispose(),z.dispose(),it.dispose(),P.dispose(),st.dispose(),yt.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",ye),vt.removeEventListener("sessionend",te),Et&&(Et.dispose(),Et=null),we.stop()};function tt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function D(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const E=ue.autoReset,N=Z.enabled,k=Z.autoUpdate,V=Z.needsUpdate,B=Z.type;bt(),ue.autoReset=E,Z.enabled=N,Z.autoUpdate=k,Z.needsUpdate=V,Z.type=B}function rt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function ft(E){const N=E.target;N.removeEventListener("dispose",ft),Dt(N)}function Dt(E){Ct(E),Gt.remove(E)}function Ct(E){const N=Gt.get(E).programs;N!==void 0&&(N.forEach(function(k){yt.releaseProgram(k)}),E.isShaderMaterial&&yt.releaseShaderCache(E))}this.renderBufferDirect=function(E,N,k,V,B,_t){N===null&&(N=Lt);const wt=B.isMesh&&B.matrixWorld.determinant()<0,It=Zu(E,N,k,V,B);Mt.setMaterial(V,wt);let zt=k.index,Yt=1;if(V.wireframe===!0){if(zt=Q.getWireframeAttribute(k),zt===void 0)return;Yt=2}const Ht=k.drawRange,Wt=k.attributes.position;let Se=Ht.start*Yt,rn=(Ht.start+Ht.count)*Yt;_t!==null&&(Se=Math.max(Se,_t.start*Yt),rn=Math.min(rn,(_t.start+_t.count)*Yt)),zt!==null?(Se=Math.max(Se,0),rn=Math.min(rn,zt.count)):Wt!=null&&(Se=Math.max(Se,0),rn=Math.min(rn,Wt.count));const Ie=rn-Se;if(Ie<0||Ie===1/0)return;P.setup(B,V,It,k,zt);let Gn,ge=Nt;if(zt!==null&&(Gn=nt.get(zt),ge=Tt,ge.setIndex(Gn)),B.isMesh)V.wireframe===!0?(Mt.setLineWidth(V.wireframeLinewidth*Jt()),ge.setMode(O.LINES)):ge.setMode(O.TRIANGLES);else if(B.isLine){let jt=V.linewidth;jt===void 0&&(jt=1),Mt.setLineWidth(jt*Jt()),B.isLineSegments?ge.setMode(O.LINES):B.isLineLoop?ge.setMode(O.LINE_LOOP):ge.setMode(O.LINE_STRIP)}else B.isPoints?ge.setMode(O.POINTS):B.isSprite&&ge.setMode(O.TRIANGLES);if(B.isBatchedMesh)ge.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else if(B.isInstancedMesh)ge.renderInstances(Se,Ie,B.count);else if(k.isInstancedBufferGeometry){const jt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,wo=Math.min(k.instanceCount,jt);ge.renderInstances(Se,Ie,wo)}else ge.render(Se,Ie)};function Zt(E,N,k){E.transparent===!0&&E.side===hn&&E.forceSinglePass===!1?(E.side=nn,E.needsUpdate=!0,mr(E,N,k),E.side=_i,E.needsUpdate=!0,mr(E,N,k),E.side=hn):mr(E,N,k)}this.compile=function(E,N,k=null){k===null&&(k=E),m=Pt.get(k),m.init(),v.push(m),k.traverseVisible(function(B){B.isLight&&B.layers.test(N.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),E!==k&&E.traverseVisible(function(B){B.isLight&&B.layers.test(N.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),m.setupLights(x._useLegacyLights);const V=new Set;return E.traverse(function(B){const _t=B.material;if(_t)if(Array.isArray(_t))for(let wt=0;wt<_t.length;wt++){const It=_t[wt];Zt(It,k,B),V.add(It)}else Zt(_t,k,B),V.add(_t)}),v.pop(),m=null,V},this.compileAsync=function(E,N,k=null){const V=this.compile(E,N,k);return new Promise(B=>{function _t(){if(V.forEach(function(wt){Gt.get(wt).currentProgram.isReady()&&V.delete(wt)}),V.size===0){B(E);return}setTimeout(_t,10)}Rt.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let Qt=null;function xe(E){Qt&&Qt(E)}function ye(){we.stop()}function te(){we.start()}const we=new Wh;we.setAnimationLoop(xe),typeof self<"u"&&we.setContext(self),this.setAnimationLoop=function(E){Qt=E,vt.setAnimationLoop(E),E===null?we.stop():we.start()},vt.addEventListener("sessionstart",ye),vt.addEventListener("sessionend",te),this.render=function(E,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(N),N=vt.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,N,A),m=Pt.get(E,v.length),m.init(),v.push(m),St.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),X.setFromProjectionMatrix(St),mt=this.localClippingEnabled,J=Vt.init(this.clippingPlanes,mt),g=xt.get(E,d.length),g.init(),d.push(g),Rn(E,N,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort($,q),this.info.render.frame++,J===!0&&Vt.beginShadows();const k=m.state.shadowsArray;if(Z.render(k,E,N),J===!0&&Vt.endShadows(),this.info.autoReset===!0&&this.info.reset(),se.render(g,E),m.setupLights(x._useLegacyLights),N.isArrayCamera){const V=N.cameras;for(let B=0,_t=V.length;B<_t;B++){const wt=V[B];uc(g,E,wt,wt.viewport)}}else uc(g,E,N);A!==null&&(T.updateMultisampleRenderTarget(A),T.updateRenderTargetMipmap(A)),E.isScene===!0&&E.onAfterRender(x,E,N),P.resetDefaultState(),U=-1,y=null,v.pop(),v.length>0?m=v[v.length-1]:m=null,d.pop(),d.length>0?g=d[d.length-1]:g=null};function Rn(E,N,k,V){if(E.visible===!1)return;if(E.layers.test(N.layers)){if(E.isGroup)k=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(N);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||X.intersectsSprite(E)){V&&Bt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(St);const wt=it.update(E),It=E.material;It.visible&&g.push(E,wt,It,k,Bt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||X.intersectsObject(E))){const wt=it.update(E),It=E.material;if(V&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Bt.copy(E.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),Bt.copy(wt.boundingSphere.center)),Bt.applyMatrix4(E.matrixWorld).applyMatrix4(St)),Array.isArray(It)){const zt=wt.groups;for(let Yt=0,Ht=zt.length;Yt<Ht;Yt++){const Wt=zt[Yt],Se=It[Wt.materialIndex];Se&&Se.visible&&g.push(E,wt,Se,k,Bt.z,Wt)}}else It.visible&&g.push(E,wt,It,k,Bt.z,null)}}const _t=E.children;for(let wt=0,It=_t.length;wt<It;wt++)Rn(_t[wt],N,k,V)}function uc(E,N,k,V){const B=E.opaque,_t=E.transmissive,wt=E.transparent;m.setupLightsView(k),J===!0&&Vt.setGlobalState(x.clippingPlanes,k),_t.length>0&&Ju(B,_t,N,k),V&&Mt.viewport(b.copy(V)),B.length>0&&pr(B,N,k),_t.length>0&&pr(_t,N,k),wt.length>0&&pr(wt,N,k),Mt.buffers.depth.setTest(!0),Mt.buffers.depth.setMask(!0),Mt.buffers.color.setMask(!0),Mt.setPolygonOffset(!1)}function Ju(E,N,k,V){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;const _t=Ut.isWebGL2;Et===null&&(Et=new zi(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")?ir:mi,minFilter:nr,samples:_t?4:0})),x.getDrawingBufferSize(Ft),_t?Et.setSize(Ft.x,Ft.y):Et.setSize(Ta(Ft.x),Ta(Ft.y));const wt=x.getRenderTarget();x.setRenderTarget(Et),x.getClearColor(K),I=x.getClearAlpha(),I<1&&x.setClearColor(16777215,.5),x.clear();const It=x.toneMapping;x.toneMapping=pi,pr(E,k,V),T.updateMultisampleRenderTarget(Et),T.updateRenderTargetMipmap(Et);let zt=!1;for(let Yt=0,Ht=N.length;Yt<Ht;Yt++){const Wt=N[Yt],Se=Wt.object,rn=Wt.geometry,Ie=Wt.material,Gn=Wt.group;if(Ie.side===hn&&Se.layers.test(V.layers)){const ge=Ie.side;Ie.side=nn,Ie.needsUpdate=!0,fc(Se,k,V,rn,Ie,Gn),Ie.side=ge,Ie.needsUpdate=!0,zt=!0}}zt===!0&&(T.updateMultisampleRenderTarget(Et),T.updateRenderTargetMipmap(Et)),x.setRenderTarget(wt),x.setClearColor(K,I),x.toneMapping=It}function pr(E,N,k){const V=N.isScene===!0?N.overrideMaterial:null;for(let B=0,_t=E.length;B<_t;B++){const wt=E[B],It=wt.object,zt=wt.geometry,Yt=V===null?wt.material:V,Ht=wt.group;It.layers.test(k.layers)&&fc(It,N,k,zt,Yt,Ht)}}function fc(E,N,k,V,B,_t){E.onBeforeRender(x,N,k,V,B,_t),E.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),B.onBeforeRender(x,N,k,V,E,_t),B.transparent===!0&&B.side===hn&&B.forceSinglePass===!1?(B.side=nn,B.needsUpdate=!0,x.renderBufferDirect(k,N,V,B,E,_t),B.side=_i,B.needsUpdate=!0,x.renderBufferDirect(k,N,V,B,E,_t),B.side=hn):x.renderBufferDirect(k,N,V,B,E,_t),E.onAfterRender(x,N,k,V,B,_t)}function mr(E,N,k){N.isScene!==!0&&(N=Lt);const V=Gt.get(E),B=m.state.lights,_t=m.state.shadowsArray,wt=B.state.version,It=yt.getParameters(E,B.state,_t,N,k),zt=yt.getProgramCacheKey(It);let Yt=V.programs;V.environment=E.isMeshStandardMaterial?N.environment:null,V.fog=N.fog,V.envMap=(E.isMeshStandardMaterial?z:S).get(E.envMap||V.environment),Yt===void 0&&(E.addEventListener("dispose",ft),Yt=new Map,V.programs=Yt);let Ht=Yt.get(zt);if(Ht!==void 0){if(V.currentProgram===Ht&&V.lightsStateVersion===wt)return pc(E,It),Ht}else It.uniforms=yt.getUniforms(E),E.onBuild(k,It,x),E.onBeforeCompile(It,x),Ht=yt.acquireProgram(It,zt),Yt.set(zt,Ht),V.uniforms=It.uniforms;const Wt=V.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Wt.clippingPlanes=Vt.uniform),pc(E,It),V.needsLights=tf(E),V.lightsStateVersion=wt,V.needsLights&&(Wt.ambientLightColor.value=B.state.ambient,Wt.lightProbe.value=B.state.probe,Wt.directionalLights.value=B.state.directional,Wt.directionalLightShadows.value=B.state.directionalShadow,Wt.spotLights.value=B.state.spot,Wt.spotLightShadows.value=B.state.spotShadow,Wt.rectAreaLights.value=B.state.rectArea,Wt.ltc_1.value=B.state.rectAreaLTC1,Wt.ltc_2.value=B.state.rectAreaLTC2,Wt.pointLights.value=B.state.point,Wt.pointLightShadows.value=B.state.pointShadow,Wt.hemisphereLights.value=B.state.hemi,Wt.directionalShadowMap.value=B.state.directionalShadowMap,Wt.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Wt.spotShadowMap.value=B.state.spotShadowMap,Wt.spotLightMatrix.value=B.state.spotLightMatrix,Wt.spotLightMap.value=B.state.spotLightMap,Wt.pointShadowMap.value=B.state.pointShadowMap,Wt.pointShadowMatrix.value=B.state.pointShadowMatrix),V.currentProgram=Ht,V.uniformsList=null,Ht}function dc(E){if(E.uniformsList===null){const N=E.currentProgram.getUniforms();E.uniformsList=Wr.seqWithValue(N.seq,E.uniforms)}return E.uniformsList}function pc(E,N){const k=Gt.get(E);k.outputColorSpace=N.outputColorSpace,k.batching=N.batching,k.instancing=N.instancing,k.instancingColor=N.instancingColor,k.skinning=N.skinning,k.morphTargets=N.morphTargets,k.morphNormals=N.morphNormals,k.morphColors=N.morphColors,k.morphTargetsCount=N.morphTargetsCount,k.numClippingPlanes=N.numClippingPlanes,k.numIntersection=N.numClipIntersection,k.vertexAlphas=N.vertexAlphas,k.vertexTangents=N.vertexTangents,k.toneMapping=N.toneMapping}function Zu(E,N,k,V,B){N.isScene!==!0&&(N=Lt),T.resetTextureUnits();const _t=N.fog,wt=V.isMeshStandardMaterial?N.environment:null,It=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ii,zt=(V.isMeshStandardMaterial?z:S).get(V.envMap||wt),Yt=V.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Ht=!!k.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Wt=!!k.morphAttributes.position,Se=!!k.morphAttributes.normal,rn=!!k.morphAttributes.color;let Ie=pi;V.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ie=x.toneMapping);const Gn=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ge=Gn!==void 0?Gn.length:0,jt=Gt.get(V),wo=m.state.lights;if(J===!0&&(mt===!0||E!==y)){const mn=E===y&&V.id===U;Vt.setState(V,E,mn)}let Me=!1;V.version===jt.__version?(jt.needsLights&&jt.lightsStateVersion!==wo.state.version||jt.outputColorSpace!==It||B.isBatchedMesh&&jt.batching===!1||!B.isBatchedMesh&&jt.batching===!0||B.isInstancedMesh&&jt.instancing===!1||!B.isInstancedMesh&&jt.instancing===!0||B.isSkinnedMesh&&jt.skinning===!1||!B.isSkinnedMesh&&jt.skinning===!0||B.isInstancedMesh&&jt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&jt.instancingColor===!1&&B.instanceColor!==null||jt.envMap!==zt||V.fog===!0&&jt.fog!==_t||jt.numClippingPlanes!==void 0&&(jt.numClippingPlanes!==Vt.numPlanes||jt.numIntersection!==Vt.numIntersection)||jt.vertexAlphas!==Yt||jt.vertexTangents!==Ht||jt.morphTargets!==Wt||jt.morphNormals!==Se||jt.morphColors!==rn||jt.toneMapping!==Ie||Ut.isWebGL2===!0&&jt.morphTargetsCount!==ge)&&(Me=!0):(Me=!0,jt.__version=V.version);let xi=jt.currentProgram;Me===!0&&(xi=mr(V,N,B));let mc=!1,Bs=!1,To=!1;const Ge=xi.getUniforms(),Mi=jt.uniforms;if(Mt.useProgram(xi.program)&&(mc=!0,Bs=!0,To=!0),V.id!==U&&(U=V.id,Bs=!0),mc||y!==E){Ge.setValue(O,"projectionMatrix",E.projectionMatrix),Ge.setValue(O,"viewMatrix",E.matrixWorldInverse);const mn=Ge.map.cameraPosition;mn!==void 0&&mn.setValue(O,Bt.setFromMatrixPosition(E.matrixWorld)),Ut.logarithmicDepthBuffer&&Ge.setValue(O,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Ge.setValue(O,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Bs=!0,To=!0)}if(B.isSkinnedMesh){Ge.setOptional(O,B,"bindMatrix"),Ge.setOptional(O,B,"bindMatrixInverse");const mn=B.skeleton;mn&&(Ut.floatVertexTextures?(mn.boneTexture===null&&mn.computeBoneTexture(),Ge.setValue(O,"boneTexture",mn.boneTexture,T)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}B.isBatchedMesh&&(Ge.setOptional(O,B,"batchingTexture"),Ge.setValue(O,"batchingTexture",B._matricesTexture,T));const Ao=k.morphAttributes;if((Ao.position!==void 0||Ao.normal!==void 0||Ao.color!==void 0&&Ut.isWebGL2===!0)&&qt.update(B,k,xi),(Bs||jt.receiveShadow!==B.receiveShadow)&&(jt.receiveShadow=B.receiveShadow,Ge.setValue(O,"receiveShadow",B.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(Mi.envMap.value=zt,Mi.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),Bs&&(Ge.setValue(O,"toneMappingExposure",x.toneMappingExposure),jt.needsLights&&Qu(Mi,To),_t&&V.fog===!0&&dt.refreshFogUniforms(Mi,_t),dt.refreshMaterialUniforms(Mi,V,Y,W,Et),Wr.upload(O,dc(jt),Mi,T)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Wr.upload(O,dc(jt),Mi,T),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Ge.setValue(O,"center",B.center),Ge.setValue(O,"modelViewMatrix",B.modelViewMatrix),Ge.setValue(O,"normalMatrix",B.normalMatrix),Ge.setValue(O,"modelMatrix",B.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const mn=V.uniformsGroups;for(let Ro=0,ef=mn.length;Ro<ef;Ro++)if(Ut.isWebGL2){const gc=mn[Ro];st.update(gc,xi),st.bind(gc,xi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return xi}function Qu(E,N){E.ambientLightColor.needsUpdate=N,E.lightProbe.needsUpdate=N,E.directionalLights.needsUpdate=N,E.directionalLightShadows.needsUpdate=N,E.pointLights.needsUpdate=N,E.pointLightShadows.needsUpdate=N,E.spotLights.needsUpdate=N,E.spotLightShadows.needsUpdate=N,E.rectAreaLights.needsUpdate=N,E.hemisphereLights.needsUpdate=N}function tf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(E,N,k){Gt.get(E.texture).__webglTexture=N,Gt.get(E.depthTexture).__webglTexture=k;const V=Gt.get(E);V.__hasExternalTextures=!0,V.__hasExternalTextures&&(V.__autoAllocateDepthBuffer=k===void 0,V.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(E,N){const k=Gt.get(E);k.__webglFramebuffer=N,k.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(E,N=0,k=0){A=E,C=N,w=k;let V=!0,B=null,_t=!1,wt=!1;if(E){const zt=Gt.get(E);zt.__useDefaultFramebuffer!==void 0?(Mt.bindFramebuffer(O.FRAMEBUFFER,null),V=!1):zt.__webglFramebuffer===void 0?T.setupRenderTarget(E):zt.__hasExternalTextures&&T.rebindTextures(E,Gt.get(E.texture).__webglTexture,Gt.get(E.depthTexture).__webglTexture);const Yt=E.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(wt=!0);const Ht=Gt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ht[N])?B=Ht[N][k]:B=Ht[N],_t=!0):Ut.isWebGL2&&E.samples>0&&T.useMultisampledRTT(E)===!1?B=Gt.get(E).__webglMultisampledFramebuffer:Array.isArray(Ht)?B=Ht[k]:B=Ht,b.copy(E.viewport),H.copy(E.scissor),G=E.scissorTest}else b.copy(j).multiplyScalar(Y).floor(),H.copy(ot).multiplyScalar(Y).floor(),G=ct;if(Mt.bindFramebuffer(O.FRAMEBUFFER,B)&&Ut.drawBuffers&&V&&Mt.drawBuffers(E,B),Mt.viewport(b),Mt.scissor(H),Mt.setScissorTest(G),_t){const zt=Gt.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+N,zt.__webglTexture,k)}else if(wt){const zt=Gt.get(E.texture),Yt=N||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,zt.__webglTexture,k||0,Yt)}U=-1},this.readRenderTargetPixels=function(E,N,k,V,B,_t,wt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=Gt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&wt!==void 0&&(It=It[wt]),It){Mt.bindFramebuffer(O.FRAMEBUFFER,It);try{const zt=E.texture,Yt=zt.format,Ht=zt.type;if(Yt!==_n&&gt.convert(Yt)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Wt=Ht===ir&&(Rt.has("EXT_color_buffer_half_float")||Ut.isWebGL2&&Rt.has("EXT_color_buffer_float"));if(Ht!==mi&&gt.convert(Ht)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ht===fi&&(Ut.isWebGL2||Rt.has("OES_texture_float")||Rt.has("WEBGL_color_buffer_float")))&&!Wt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=E.width-V&&k>=0&&k<=E.height-B&&O.readPixels(N,k,V,B,gt.convert(Yt),gt.convert(Ht),_t)}finally{const zt=A!==null?Gt.get(A).__webglFramebuffer:null;Mt.bindFramebuffer(O.FRAMEBUFFER,zt)}}},this.copyFramebufferToTexture=function(E,N,k=0){const V=Math.pow(2,-k),B=Math.floor(N.image.width*V),_t=Math.floor(N.image.height*V);T.setTexture2D(N,0),O.copyTexSubImage2D(O.TEXTURE_2D,k,0,0,E.x,E.y,B,_t),Mt.unbindTexture()},this.copyTextureToTexture=function(E,N,k,V=0){const B=N.image.width,_t=N.image.height,wt=gt.convert(k.format),It=gt.convert(k.type);T.setTexture2D(k,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,k.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,k.unpackAlignment),N.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,V,E.x,E.y,B,_t,wt,It,N.image.data):N.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,V,E.x,E.y,N.mipmaps[0].width,N.mipmaps[0].height,wt,N.mipmaps[0].data):O.texSubImage2D(O.TEXTURE_2D,V,E.x,E.y,wt,It,N.image),V===0&&k.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),Mt.unbindTexture()},this.copyTextureToTexture3D=function(E,N,k,V,B=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const _t=E.max.x-E.min.x+1,wt=E.max.y-E.min.y+1,It=E.max.z-E.min.z+1,zt=gt.convert(V.format),Yt=gt.convert(V.type);let Ht;if(V.isData3DTexture)T.setTexture3D(V,0),Ht=O.TEXTURE_3D;else if(V.isDataArrayTexture||V.isCompressedArrayTexture)T.setTexture2DArray(V,0),Ht=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,V.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,V.unpackAlignment);const Wt=O.getParameter(O.UNPACK_ROW_LENGTH),Se=O.getParameter(O.UNPACK_IMAGE_HEIGHT),rn=O.getParameter(O.UNPACK_SKIP_PIXELS),Ie=O.getParameter(O.UNPACK_SKIP_ROWS),Gn=O.getParameter(O.UNPACK_SKIP_IMAGES),ge=k.isCompressedTexture?k.mipmaps[B]:k.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,ge.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ge.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,E.min.x),O.pixelStorei(O.UNPACK_SKIP_ROWS,E.min.y),O.pixelStorei(O.UNPACK_SKIP_IMAGES,E.min.z),k.isDataTexture||k.isData3DTexture?O.texSubImage3D(Ht,B,N.x,N.y,N.z,_t,wt,It,zt,Yt,ge.data):k.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),O.compressedTexSubImage3D(Ht,B,N.x,N.y,N.z,_t,wt,It,zt,ge.data)):O.texSubImage3D(Ht,B,N.x,N.y,N.z,_t,wt,It,zt,Yt,ge),O.pixelStorei(O.UNPACK_ROW_LENGTH,Wt),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Se),O.pixelStorei(O.UNPACK_SKIP_PIXELS,rn),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ie),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Gn),B===0&&V.generateMipmaps&&O.generateMipmap(Ht),Mt.unbindTexture()},this.initTexture=function(E){E.isCubeTexture?T.setTextureCube(E,0):E.isData3DTexture?T.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?T.setTexture2DArray(E,0):T.setTexture2D(E,0),Mt.unbindTexture()},this.resetState=function(){C=0,w=0,A=null,Mt.reset(),P.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ba?"display-p3":"srgb",e.unpackColorSpace=le.workingColorSpace===co?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ae?Ii:Dh}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Ii?Ae:ii}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class c_ extends Zh{}c_.prototype.isWebGL1Renderer=!0;class Va{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new $t(t),this.near=e,this.far=n}clone(){return new Va(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class l_ extends ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class h_ extends Qe{constructor(t=null,e=1,n=1,s,r,a,o,c,h=He,l=He,u,f){super(null,a,o,c,h,l,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ol extends fn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const hs=new ce,Fl=new ce,Fr=[],Bl=new Hi,u_=new ce,Xs=new kt,$s=new Is;class Zs extends kt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ol(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,u_)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Hi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,hs),Bl.copy(t.boundingBox).applyMatrix4(hs),this.boundingBox.union(Bl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Is),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,hs),$s.copy(t.boundingSphere).applyMatrix4(hs),this.boundingSphere.union($s)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Xs.geometry=this.geometry,Xs.material=this.material,Xs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),$s.copy(this.boundingSphere),$s.applyMatrix4(n),t.ray.intersectsSphere($s)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,hs),Fl.multiplyMatrices(n,hs),Xs.matrixWorld=Fl,Xs.raycast(t,Fr);for(let a=0,o=Fr.length;a<o;a++){const c=Fr[a];c.instanceId=r,c.object=this,e.push(c)}Fr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ol(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Wa extends Gi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new $t(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const kl=new R,Hl=new R,Gl=new ce,ra=new lo,Br=new Is;class Qh extends ze{constructor(t=new Ee,e=new Wa){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)kl.fromBufferAttribute(e,s-1),Hl.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=kl.distanceTo(Hl);t.setAttribute("lineDistance",new ie(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Br.copy(n.boundingSphere),Br.applyMatrix4(s),Br.radius+=r,t.ray.intersectsSphere(Br)===!1)return;Gl.copy(s).invert(),ra.copy(t.ray).applyMatrix4(Gl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=new R,l=new R,u=new R,f=new R,p=this.isLineSegments?2:1,_=n.index,m=n.attributes.position;if(_!==null){const d=Math.max(0,a.start),v=Math.min(_.count,a.start+a.count);for(let x=d,M=v-1;x<M;x+=p){const C=_.getX(x),w=_.getX(x+1);if(h.fromBufferAttribute(m,C),l.fromBufferAttribute(m,w),ra.distanceSqToSegment(h,l,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const U=t.ray.origin.distanceTo(f);U<t.near||U>t.far||e.push({distance:U,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const d=Math.max(0,a.start),v=Math.min(m.count,a.start+a.count);for(let x=d,M=v-1;x<M;x+=p){if(h.fromBufferAttribute(m,x),l.fromBufferAttribute(m,x+1),ra.distanceSqToSegment(h,l,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const w=t.ray.origin.distanceTo(f);w<t.near||w>t.far||e.push({distance:w,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}const Vl=new R,Wl=new R;class f_ extends Qh{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Vl.fromBufferAttribute(e,s),Wl.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Vl.distanceTo(Wl);t.setAttribute("lineDistance",new ie(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Xa extends Qe{constructor(t,e,n,s,r,a,o,c,h){super(t,e,n,s,r,a,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class kn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=n[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const l=n[s],f=n[s+1]-l,p=(a-l)/f;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new ht:new R);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new R,s=[],r=[],a=[],o=new R,c=new ce;for(let p=0;p<=t;p++){const _=p/t;s[p]=this.getTangentAt(_,new R)}r[0]=new R,a[0]=new R;let h=Number.MAX_VALUE;const l=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);l<=h&&(h=l,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),f<=h&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const _=Math.acos(Ne(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,_))}a[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(Ne(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let _=1;_<=t;_++)r[_].applyMatrix4(c.makeRotationAxis(s[_],p*_)),a[_].crossVectors(s[_],r[_])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class $a extends kn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e){const n=e||new ht,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const l=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,p=h-this.aY;c=f*l-p*u+this.aX,h=f*u+p*l+this.aY}return n.set(c,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class d_ extends $a{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function qa(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,l,u){let f=(a-r)/h-(o-r)/(h+l)+(o-a)/l,p=(o-a)/l-(c-a)/(l+u)+(c-o)/u;f*=l,p*=l,s(a,o,f,p)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const kr=new R,oa=new qa,aa=new qa,ca=new qa;class Ya extends kn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new R){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,l;this.closed||o>0?h=s[(o-1)%r]:(kr.subVectors(s[0],s[1]).add(s[0]),h=kr);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?l=s[(o+2)%r]:(kr.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=kr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let _=Math.pow(h.distanceToSquared(u),p),g=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(l),p);g<1e-4&&(g=1),_<1e-4&&(_=g),m<1e-4&&(m=g),oa.initNonuniformCatmullRom(h.x,u.x,f.x,l.x,_,g,m),aa.initNonuniformCatmullRom(h.y,u.y,f.y,l.y,_,g,m),ca.initNonuniformCatmullRom(h.z,u.z,f.z,l.z,_,g,m)}else this.curveType==="catmullrom"&&(oa.initCatmullRom(h.x,u.x,f.x,l.x,this.tension),aa.initCatmullRom(h.y,u.y,f.y,l.y,this.tension),ca.initCatmullRom(h.z,u.z,f.z,l.z,this.tension));return n.set(oa.calc(c),aa.calc(c),ca.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new R().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Xl(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,c=i*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*i+e}function p_(i,t){const e=1-i;return e*e*t}function m_(i,t){return 2*(1-i)*i*t}function g_(i,t){return i*i*t}function Qs(i,t,e,n){return p_(i,t)+m_(i,e)+g_(i,n)}function __(i,t){const e=1-i;return e*e*e*t}function v_(i,t){const e=1-i;return 3*e*e*i*t}function x_(i,t){return 3*(1-i)*i*i*t}function M_(i,t){return i*i*i*t}function tr(i,t,e,n,s){return __(i,t)+v_(i,e)+x_(i,n)+M_(i,s)}class tu extends kn{constructor(t=new ht,e=new ht,n=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(tr(t,s.x,r.x,a.x,o.x),tr(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class y_ extends kn{constructor(t=new R,e=new R,n=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new R){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(tr(t,s.x,r.x,a.x,o.x),tr(t,s.y,r.y,a.y,o.y),tr(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class eu extends kn{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class S_ extends kn{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class nu extends kn{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Qs(t,s.x,r.x,a.x),Qs(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class b_ extends kn{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Qs(t,s.x,r.x,a.x),Qs(t,s.y,r.y,a.y),Qs(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class iu extends kn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],h=s[a],l=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Xl(o,c.x,h.x,l.x,u.x),Xl(o,c.y,h.y,l.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ht().fromArray(s))}return this}}var $l=Object.freeze({__proto__:null,ArcCurve:d_,CatmullRomCurve3:Ya,CubicBezierCurve:tu,CubicBezierCurve3:y_,EllipseCurve:$a,LineCurve:eu,LineCurve3:S_,QuadraticBezierCurve:nu,QuadraticBezierCurve3:b_,SplineCurve:iu});class E_ extends kn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new $l[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),h=c===0?0:1-a/c;return o.getPointAt(h,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let h=0;h<c.length;h++){const l=c[h];n&&n.equals(l)||(e.push(l),n=l)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new $l[s.type]().fromJSON(s))}return this}}class w_ extends E_{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new eu(this.currentPoint.clone(),new ht(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new nu(this.currentPoint.clone(),new ht(t,e),new ht(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new tu(this.currentPoint.clone(),new ht(t,e),new ht(n,s),new ht(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new iu(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,c){const h=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(t+h,e+l,n,s,r,a,o,c),this}absellipse(t,e,n,s,r,a,o,c){const h=new $a(t,e,n,s,r,a,o,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const l=h.getPoint(1);return this.currentPoint.copy(l),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ja extends Ee{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Ne(s,0,Math.PI*2);const r=[],a=[],o=[],c=[],h=[],l=1/e,u=new R,f=new ht,p=new R,_=new R,g=new R;let m=0,d=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:m=t[v+1].x-t[v].x,d=t[v+1].y-t[v].y,p.x=d*1,p.y=-m,p.z=d*0,g.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case t.length-1:c.push(g.x,g.y,g.z);break;default:m=t[v+1].x-t[v].x,d=t[v+1].y-t[v].y,p.x=d*1,p.y=-m,p.z=d*0,_.copy(p),p.x+=g.x,p.y+=g.y,p.z+=g.z,p.normalize(),c.push(p.x,p.y,p.z),g.copy(_)}for(let v=0;v<=e;v++){const x=n+v*l*s,M=Math.sin(x),C=Math.cos(x);for(let w=0;w<=t.length-1;w++){u.x=t[w].x*M,u.y=t[w].y,u.z=t[w].x*C,a.push(u.x,u.y,u.z),f.x=v/e,f.y=w/(t.length-1),o.push(f.x,f.y);const A=c[3*w+0]*M,U=c[3*w+1],y=c[3*w+0]*C;h.push(A,U,y)}}for(let v=0;v<e;v++)for(let x=0;x<t.length-1;x++){const M=x+v*t.length,C=M,w=M+t.length,A=M+t.length+1,U=M+1;r.push(C,w,U),r.push(A,U,w)}this.setIndex(r),this.setAttribute("position",new ie(a,3)),this.setAttribute("uv",new ie(o,2)),this.setAttribute("normal",new ie(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ja(t.points,t.segments,t.phiStart,t.phiLength)}}class Ka extends ja{constructor(t=1,e=1,n=4,s=8){const r=new w_;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new Ka(t.radius,t.length,t.capSegments,t.radialSegments)}}class Fi extends Ee{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],h=new R,l=new ht;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const p=n+u/e*s;h.x=t*Math.cos(p),h.y=t*Math.sin(p),a.push(h.x,h.y,h.z),o.push(0,0,1),l.x=(a[f]/t+1)/2,l.y=(a[f+1]/t+1)/2,c.push(l.x,l.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ie(a,3)),this.setAttribute("normal",new ie(o,3)),this.setAttribute("uv",new ie(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fi(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class sn extends Ee{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const l=[],u=[],f=[],p=[];let _=0;const g=[],m=n/2;let d=0;v(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(l),this.setAttribute("position",new ie(u,3)),this.setAttribute("normal",new ie(f,3)),this.setAttribute("uv",new ie(p,2));function v(){const M=new R,C=new R;let w=0;const A=(e-t)/n;for(let U=0;U<=r;U++){const y=[],b=U/r,H=b*(e-t)+t;for(let G=0;G<=s;G++){const K=G/s,I=K*c+o,F=Math.sin(I),W=Math.cos(I);C.x=H*F,C.y=-b*n+m,C.z=H*W,u.push(C.x,C.y,C.z),M.set(F,A,W).normalize(),f.push(M.x,M.y,M.z),p.push(K,1-b),y.push(_++)}g.push(y)}for(let U=0;U<s;U++)for(let y=0;y<r;y++){const b=g[y][U],H=g[y+1][U],G=g[y+1][U+1],K=g[y][U+1];l.push(b,H,K),l.push(H,G,K),w+=6}h.addGroup(d,w,0),d+=w}function x(M){const C=_,w=new ht,A=new R;let U=0;const y=M===!0?t:e,b=M===!0?1:-1;for(let G=1;G<=s;G++)u.push(0,m*b,0),f.push(0,b,0),p.push(.5,.5),_++;const H=_;for(let G=0;G<=s;G++){const I=G/s*c+o,F=Math.cos(I),W=Math.sin(I);A.x=y*W,A.y=m*b,A.z=y*F,u.push(A.x,A.y,A.z),f.push(0,b,0),w.x=F*.5+.5,w.y=W*.5*b+.5,p.push(w.x,w.y),_++}for(let G=0;G<s;G++){const K=C+G,I=H+G;M===!0?l.push(I,I+1,K):l.push(I+1,I,K),U+=3}h.addGroup(d,U,M===!0?1:2),d+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class On extends sn{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new On(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ar extends Ee{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),h(n),l(),this.setAttribute("position",new ie(r,3)),this.setAttribute("normal",new ie(r.slice(),3)),this.setAttribute("uv",new ie(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const x=new R,M=new R,C=new R;for(let w=0;w<e.length;w+=3)p(e[w+0],x),p(e[w+1],M),p(e[w+2],C),c(x,M,C,v)}function c(v,x,M,C){const w=C+1,A=[];for(let U=0;U<=w;U++){A[U]=[];const y=v.clone().lerp(M,U/w),b=x.clone().lerp(M,U/w),H=w-U;for(let G=0;G<=H;G++)G===0&&U===w?A[U][G]=y:A[U][G]=y.clone().lerp(b,G/H)}for(let U=0;U<w;U++)for(let y=0;y<2*(w-U)-1;y++){const b=Math.floor(y/2);y%2===0?(f(A[U][b+1]),f(A[U+1][b]),f(A[U][b])):(f(A[U][b+1]),f(A[U+1][b+1]),f(A[U+1][b]))}}function h(v){const x=new R;for(let M=0;M<r.length;M+=3)x.x=r[M+0],x.y=r[M+1],x.z=r[M+2],x.normalize().multiplyScalar(v),r[M+0]=x.x,r[M+1]=x.y,r[M+2]=x.z}function l(){const v=new R;for(let x=0;x<r.length;x+=3){v.x=r[x+0],v.y=r[x+1],v.z=r[x+2];const M=m(v)/2/Math.PI+.5,C=d(v)/Math.PI+.5;a.push(M,1-C)}_(),u()}function u(){for(let v=0;v<a.length;v+=6){const x=a[v+0],M=a[v+2],C=a[v+4],w=Math.max(x,M,C),A=Math.min(x,M,C);w>.9&&A<.1&&(x<.2&&(a[v+0]+=1),M<.2&&(a[v+2]+=1),C<.2&&(a[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function p(v,x){const M=v*3;x.x=t[M+0],x.y=t[M+1],x.z=t[M+2]}function _(){const v=new R,x=new R,M=new R,C=new R,w=new ht,A=new ht,U=new ht;for(let y=0,b=0;y<r.length;y+=9,b+=6){v.set(r[y+0],r[y+1],r[y+2]),x.set(r[y+3],r[y+4],r[y+5]),M.set(r[y+6],r[y+7],r[y+8]),w.set(a[b+0],a[b+1]),A.set(a[b+2],a[b+3]),U.set(a[b+4],a[b+5]),C.copy(v).add(x).add(M).divideScalar(3);const H=m(C);g(w,b+0,v,H),g(A,b+2,x,H),g(U,b+4,M,H)}}function g(v,x,M,C){C<0&&v.x===1&&(a[x]=v.x-1),M.x===0&&M.z===0&&(a[x]=C/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function d(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ar(t.vertices,t.indices,t.radius,t.details)}}class to extends ar{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new to(t.radius,t.detail)}}class Fn extends ar{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Fn(t.radius,t.detail)}}class uo extends ar{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new uo(t.radius,t.detail)}}class Vi extends Ee{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],h=[],l=[];let u=t;const f=(e-t)/s,p=new R,_=new ht;for(let g=0;g<=s;g++){for(let m=0;m<=n;m++){const d=r+m/n*a;p.x=u*Math.cos(d),p.y=u*Math.sin(d),c.push(p.x,p.y,p.z),h.push(0,0,1),_.x=(p.x/e+1)/2,_.y=(p.y/e+1)/2,l.push(_.x,_.y)}u+=f}for(let g=0;g<s;g++){const m=g*(n+1);for(let d=0;d<n;d++){const v=d+m,x=v,M=v+n+1,C=v+n+2,w=v+1;o.push(x,M,w),o.push(M,C,w)}}this.setIndex(o),this.setAttribute("position",new ie(c,3)),this.setAttribute("normal",new ie(h,3)),this.setAttribute("uv",new ie(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class un extends Ee{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let h=0;const l=[],u=new R,f=new R,p=[],_=[],g=[],m=[];for(let d=0;d<=n;d++){const v=[],x=d/n;let M=0;d===0&&a===0?M=.5/e:d===n&&c===Math.PI&&(M=-.5/e);for(let C=0;C<=e;C++){const w=C/e;u.x=-t*Math.cos(s+w*r)*Math.sin(a+x*o),u.y=t*Math.cos(a+x*o),u.z=t*Math.sin(s+w*r)*Math.sin(a+x*o),_.push(u.x,u.y,u.z),f.copy(u).normalize(),g.push(f.x,f.y,f.z),m.push(w+M,1-x),v.push(h++)}l.push(v)}for(let d=0;d<n;d++)for(let v=0;v<e;v++){const x=l[d][v+1],M=l[d][v],C=l[d+1][v],w=l[d+1][v+1];(d!==0||a>0)&&p.push(x,M,w),(d!==n-1||c<Math.PI)&&p.push(M,C,w)}this.setIndex(p),this.setAttribute("position",new ie(_,3)),this.setAttribute("normal",new ie(g,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new un(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Sn extends Ee{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],h=[],l=new R,u=new R,f=new R;for(let p=0;p<=n;p++)for(let _=0;_<=s;_++){const g=_/s*r,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(g),u.y=(t+e*Math.cos(m))*Math.sin(g),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),l.x=t*Math.cos(g),l.y=t*Math.sin(g),f.subVectors(u,l).normalize(),c.push(f.x,f.y,f.z),h.push(_/s),h.push(p/n)}for(let p=1;p<=n;p++)for(let _=1;_<=s;_++){const g=(s+1)*p+_-1,m=(s+1)*(p-1)+_-1,d=(s+1)*(p-1)+_,v=(s+1)*p+_;a.push(g,m,v),a.push(m,d,v)}this.setIndex(a),this.setAttribute("position",new ie(o,3)),this.setAttribute("normal",new ie(c,3)),this.setAttribute("uv",new ie(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Sn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class wn extends Gi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new $t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fa,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class T_ extends Gi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fa,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=za,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ja extends ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new $t(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class A_ extends Ja{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $t(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const la=new ce,ql=new R,Yl=new R;class su{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.map=null,this.mapPass=null,this.matrix=new ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ha,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;ql.setFromMatrixPosition(t.matrixWorld),e.position.copy(ql),Yl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Yl),e.updateMatrixWorld(),la.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(la),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(la)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const jl=new ce,qs=new R,ha=new R;class R_ extends su{constructor(){super(new cn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ht(4,2),this._viewportCount=6,this._viewports=[new pe(2,1,1,1),new pe(0,1,1,1),new pe(3,1,1,1),new pe(1,1,1,1),new pe(3,0,1,1),new pe(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),qs.setFromMatrixPosition(t.matrixWorld),n.position.copy(qs),ha.copy(n.position),ha.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ha),n.updateMatrixWorld(),s.makeTranslation(-qs.x,-qs.y,-qs.z),jl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(jl)}}class C_ extends Ja{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new R_}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class P_ extends su{constructor(){super(new Xh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ru extends Ja{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.shadow=new P_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class L_{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Kl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Kl();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Kl(){return(typeof performance>"u"?Date:performance).now()}class D_{constructor(t,e,n=0,s=1/0){this.ray=new lo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ka,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Ra(t,this,n,e),n.sort(Jl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Ra(t[s],this,n,e);return n.sort(Jl),n}}function Jl(i,t){return i.distance-t.distance}function Ra(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,a=s.length;r<a;r++)Ra(s[r],t,e,!0)}}class Zl{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ne(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Na}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Na);const Ql={type:"change"},ua={type:"start"},th={type:"end"},Hr=new lo,eh=new hi,I_=Math.cos(70*nd.DEG2RAD);class U_ extends ki{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Kn.ROTATE,MIDDLE:Kn.DOLLY,RIGHT:Kn.PAN},this.touches={ONE:qi.ROTATE,TWO:qi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(P){P.addEventListener("keydown",Pt),this._domElementKeyEvents=P},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Pt),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Ql),n.update(),r=s.NONE},this.update=function(){const P=new R,st=new Nn().setFromUnitVectors(t.up,new R(0,1,0)),bt=st.clone().invert(),vt=new R,tt=new Nn,D=new R,rt=2*Math.PI;return function(Dt=null){const Ct=n.object.position;P.copy(Ct).sub(n.target),P.applyQuaternion(st),o.setFromVector3(P),n.autoRotate&&r===s.NONE&&G(b(Dt)),n.enableDamping?(o.theta+=c.theta*n.dampingFactor,o.phi+=c.phi*n.dampingFactor):(o.theta+=c.theta,o.phi+=c.phi);let Zt=n.minAzimuthAngle,Qt=n.maxAzimuthAngle;isFinite(Zt)&&isFinite(Qt)&&(Zt<-Math.PI?Zt+=rt:Zt>Math.PI&&(Zt-=rt),Qt<-Math.PI?Qt+=rt:Qt>Math.PI&&(Qt-=rt),Zt<=Qt?o.theta=Math.max(Zt,Math.min(Qt,o.theta)):o.theta=o.theta>(Zt+Qt)/2?Math.max(Zt,o.theta):Math.min(Qt,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(l,n.dampingFactor):n.target.add(l),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&w||n.object.isOrthographicCamera?o.radius=j(o.radius):o.radius=j(o.radius*h),P.setFromSpherical(o),P.applyQuaternion(bt),Ct.copy(n.target).add(P),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,l.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),l.set(0,0,0));let xe=!1;if(n.zoomToCursor&&w){let ye=null;if(n.object.isPerspectiveCamera){const te=P.length();ye=j(te*h);const we=te-ye;n.object.position.addScaledVector(M,we),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const te=new R(C.x,C.y,0);te.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),xe=!0;const we=new R(C.x,C.y,0);we.unproject(n.object),n.object.position.sub(we).add(te),n.object.updateMatrixWorld(),ye=P.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ye!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ye).add(n.object.position):(Hr.origin.copy(n.object.position),Hr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Hr.direction))<I_?t.lookAt(n.target):(eh.setFromNormalAndCoplanarPoint(n.object.up,n.target),Hr.intersectPlane(eh,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),xe=!0);return h=1,w=!1,xe||vt.distanceToSquared(n.object.position)>a||8*(1-tt.dot(n.object.quaternion))>a||D.distanceToSquared(n.target)>0?(n.dispatchEvent(Ql),vt.copy(n.object.position),tt.copy(n.object.quaternion),D.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",se),n.domElement.removeEventListener("pointerdown",T),n.domElement.removeEventListener("pointercancel",z),n.domElement.removeEventListener("wheel",it),n.domElement.removeEventListener("pointermove",S),n.domElement.removeEventListener("pointerup",z),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Pt),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const a=1e-6,o=new Zl,c=new Zl;let h=1;const l=new R,u=new ht,f=new ht,p=new ht,_=new ht,g=new ht,m=new ht,d=new ht,v=new ht,x=new ht,M=new R,C=new ht;let w=!1;const A=[],U={};let y=!1;function b(P){return P!==null?2*Math.PI/60*n.autoRotateSpeed*P:2*Math.PI/60/60*n.autoRotateSpeed}function H(P){const st=Math.abs(P*.01);return Math.pow(.95,n.zoomSpeed*st)}function G(P){c.theta-=P}function K(P){c.phi-=P}const I=function(){const P=new R;return function(bt,vt){P.setFromMatrixColumn(vt,0),P.multiplyScalar(-bt),l.add(P)}}(),F=function(){const P=new R;return function(bt,vt){n.screenSpacePanning===!0?P.setFromMatrixColumn(vt,1):(P.setFromMatrixColumn(vt,0),P.crossVectors(n.object.up,P)),P.multiplyScalar(bt),l.add(P)}}(),W=function(){const P=new R;return function(bt,vt){const tt=n.domElement;if(n.object.isPerspectiveCamera){const D=n.object.position;P.copy(D).sub(n.target);let rt=P.length();rt*=Math.tan(n.object.fov/2*Math.PI/180),I(2*bt*rt/tt.clientHeight,n.object.matrix),F(2*vt*rt/tt.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(I(bt*(n.object.right-n.object.left)/n.object.zoom/tt.clientWidth,n.object.matrix),F(vt*(n.object.top-n.object.bottom)/n.object.zoom/tt.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function Y(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h/=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function $(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h*=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function q(P,st){if(!n.zoomToCursor)return;w=!0;const bt=n.domElement.getBoundingClientRect(),vt=P-bt.left,tt=st-bt.top,D=bt.width,rt=bt.height;C.x=vt/D*2-1,C.y=-(tt/rt)*2+1,M.set(C.x,C.y,1).unproject(n.object).sub(n.object.position).normalize()}function j(P){return Math.max(n.minDistance,Math.min(n.maxDistance,P))}function ot(P){u.set(P.clientX,P.clientY)}function ct(P){q(P.clientX,P.clientX),d.set(P.clientX,P.clientY)}function X(P){_.set(P.clientX,P.clientY)}function J(P){f.set(P.clientX,P.clientY),p.subVectors(f,u).multiplyScalar(n.rotateSpeed);const st=n.domElement;G(2*Math.PI*p.x/st.clientHeight),K(2*Math.PI*p.y/st.clientHeight),u.copy(f),n.update()}function mt(P){v.set(P.clientX,P.clientY),x.subVectors(v,d),x.y>0?Y(H(x.y)):x.y<0&&$(H(x.y)),d.copy(v),n.update()}function Et(P){g.set(P.clientX,P.clientY),m.subVectors(g,_).multiplyScalar(n.panSpeed),W(m.x,m.y),_.copy(g),n.update()}function St(P){q(P.clientX,P.clientY),P.deltaY<0?$(H(P.deltaY)):P.deltaY>0&&Y(H(P.deltaY)),n.update()}function Ft(P){let st=!1;switch(P.code){case n.keys.UP:P.ctrlKey||P.metaKey||P.shiftKey?K(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,n.keyPanSpeed),st=!0;break;case n.keys.BOTTOM:P.ctrlKey||P.metaKey||P.shiftKey?K(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,-n.keyPanSpeed),st=!0;break;case n.keys.LEFT:P.ctrlKey||P.metaKey||P.shiftKey?G(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(n.keyPanSpeed,0),st=!0;break;case n.keys.RIGHT:P.ctrlKey||P.metaKey||P.shiftKey?G(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(-n.keyPanSpeed,0),st=!0;break}st&&(P.preventDefault(),n.update())}function Bt(P){if(A.length===1)u.set(P.pageX,P.pageY);else{const st=gt(P),bt=.5*(P.pageX+st.x),vt=.5*(P.pageY+st.y);u.set(bt,vt)}}function Lt(P){if(A.length===1)_.set(P.pageX,P.pageY);else{const st=gt(P),bt=.5*(P.pageX+st.x),vt=.5*(P.pageY+st.y);_.set(bt,vt)}}function Jt(P){const st=gt(P),bt=P.pageX-st.x,vt=P.pageY-st.y,tt=Math.sqrt(bt*bt+vt*vt);d.set(0,tt)}function O(P){n.enableZoom&&Jt(P),n.enablePan&&Lt(P)}function Be(P){n.enableZoom&&Jt(P),n.enableRotate&&Bt(P)}function Rt(P){if(A.length==1)f.set(P.pageX,P.pageY);else{const bt=gt(P),vt=.5*(P.pageX+bt.x),tt=.5*(P.pageY+bt.y);f.set(vt,tt)}p.subVectors(f,u).multiplyScalar(n.rotateSpeed);const st=n.domElement;G(2*Math.PI*p.x/st.clientHeight),K(2*Math.PI*p.y/st.clientHeight),u.copy(f)}function Ut(P){if(A.length===1)g.set(P.pageX,P.pageY);else{const st=gt(P),bt=.5*(P.pageX+st.x),vt=.5*(P.pageY+st.y);g.set(bt,vt)}m.subVectors(g,_).multiplyScalar(n.panSpeed),W(m.x,m.y),_.copy(g)}function Mt(P){const st=gt(P),bt=P.pageX-st.x,vt=P.pageY-st.y,tt=Math.sqrt(bt*bt+vt*vt);v.set(0,tt),x.set(0,Math.pow(v.y/d.y,n.zoomSpeed)),Y(x.y),d.copy(v);const D=(P.pageX+st.x)*.5,rt=(P.pageY+st.y)*.5;q(D,rt)}function ue(P){n.enableZoom&&Mt(P),n.enablePan&&Ut(P)}function Gt(P){n.enableZoom&&Mt(P),n.enableRotate&&Rt(P)}function T(P){n.enabled!==!1&&(A.length===0&&(n.domElement.setPointerCapture(P.pointerId),n.domElement.addEventListener("pointermove",S),n.domElement.addEventListener("pointerup",z)),qt(P),P.pointerType==="touch"?Vt(P):nt(P))}function S(P){n.enabled!==!1&&(P.pointerType==="touch"?Z(P):Q(P))}function z(P){Nt(P),A.length===0&&(n.domElement.releasePointerCapture(P.pointerId),n.domElement.removeEventListener("pointermove",S),n.domElement.removeEventListener("pointerup",z)),n.dispatchEvent(th),r=s.NONE}function nt(P){let st;switch(P.button){case 0:st=n.mouseButtons.LEFT;break;case 1:st=n.mouseButtons.MIDDLE;break;case 2:st=n.mouseButtons.RIGHT;break;default:st=-1}switch(st){case Kn.DOLLY:if(n.enableZoom===!1)return;ct(P),r=s.DOLLY;break;case Kn.ROTATE:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enablePan===!1)return;X(P),r=s.PAN}else{if(n.enableRotate===!1)return;ot(P),r=s.ROTATE}break;case Kn.PAN:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enableRotate===!1)return;ot(P),r=s.ROTATE}else{if(n.enablePan===!1)return;X(P),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(ua)}function Q(P){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;J(P);break;case s.DOLLY:if(n.enableZoom===!1)return;mt(P);break;case s.PAN:if(n.enablePan===!1)return;Et(P);break}}function it(P){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(P.preventDefault(),n.dispatchEvent(ua),St(yt(P)),n.dispatchEvent(th))}function yt(P){const st=P.deltaMode,bt={clientX:P.clientX,clientY:P.clientY,deltaY:P.deltaY};switch(st){case 1:bt.deltaY*=16;break;case 2:bt.deltaY*=100;break}return P.ctrlKey&&!y&&(bt.deltaY*=10),bt}function dt(P){P.key==="Control"&&(y=!0,document.addEventListener("keyup",xt,{passive:!0,capture:!0}))}function xt(P){P.key==="Control"&&(y=!1,document.removeEventListener("keyup",xt,{passive:!0,capture:!0}))}function Pt(P){n.enabled===!1||n.enablePan===!1||Ft(P)}function Vt(P){switch(Tt(P),A.length){case 1:switch(n.touches.ONE){case qi.ROTATE:if(n.enableRotate===!1)return;Bt(P),r=s.TOUCH_ROTATE;break;case qi.PAN:if(n.enablePan===!1)return;Lt(P),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case qi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;O(P),r=s.TOUCH_DOLLY_PAN;break;case qi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Be(P),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(ua)}function Z(P){switch(Tt(P),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Rt(P),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;Ut(P),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;ue(P),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Gt(P),n.update();break;default:r=s.NONE}}function se(P){n.enabled!==!1&&P.preventDefault()}function qt(P){A.push(P.pointerId)}function Nt(P){delete U[P.pointerId];for(let st=0;st<A.length;st++)if(A[st]==P.pointerId){A.splice(st,1);return}}function Tt(P){let st=U[P.pointerId];st===void 0&&(st=new ht,U[P.pointerId]=st),st.set(P.pageX,P.pageY)}function gt(P){const st=P.pointerId===A[0]?A[1]:A[0];return U[st]}n.domElement.addEventListener("contextmenu",se),n.domElement.addEventListener("pointerdown",T),n.domElement.addEventListener("pointercancel",z),n.domElement.addEventListener("wheel",it,{passive:!1}),document.addEventListener("keydown",dt,{passive:!0,capture:!0}),this.update()}}function Ca(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const Un=(i,t,e)=>i+(t-i)*e,je=(i,t=Math.random)=>i[Math.floor(t()*i.length)],ee=(i,t,e)=>t+i()*(e-t),Ps=i=>1-Math.pow(1-i,3),N_=i=>i*i*i,Za=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,z_=i=>Math.atan2(Math.sin(i),Math.cos(i));function O_(i){return i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375}const ln={speed:1,time:0},Pa=new Set;function Pe(i,t,e=n=>n){return new Promise(n=>{Pa.add({t:0,duration:Math.max(1e-4,i),fn:t,ease:e,resolve:n})})}const qe=i=>Pe(i,()=>{});function F_(i){for(const t of[...Pa]){t.t+=i;const e=Math.min(1,t.t/t.duration);t.fn(t.ease(e),e),e>=1&&(Pa.delete(t),t.resolve())}}let ou=Math.random,Qa=0,eo=0;function er(){const i=ou();return Qa++,eo=Math.imul(eo,31)+Math.floor(i*4294967296)>>>0,i}function B_(i){ou=Ca(i),Qa=0,eo=0}const au=()=>`${Qa}#${eo.toString(36)}`,Dn={W:40,H:28,deploy:8},Ui=1,fo=12,no=3,io=5,so=6,be=[{key:"squirrel",name:"Bushtail Clans",short:"Bushtails",color:"#ec8a34",dark:"#7a3d12",icon:"🐿️"},{key:"snake",name:"Coil of Ssithra",short:"Serpents",color:"#46c27a",dark:"#14532d",icon:"🐍"}],cu=[{key:"move",name:"Movement"},{key:"shoot",name:"Shooting"},{key:"charge",name:"Charge"},{key:"fight",name:"Fight"},{key:"morale",name:"Morale"}],k_={nutkin:{side:0,name:"Nutkin Skirmishers",short:"Nutkin",role:"Troops",models:6,base:.3,pts:7,M:7,WS:4,BS:4,S:3,T:3,W:1,A:1,Ld:6,Sv:6,OC:2,ranged:{name:"Slingshots",range:18,shots:2,S:3,AP:0,D:1,assault:!0,fx:"acorn"},melee:{name:"Twig knives",S:3,AP:0,D:1},abilities:["Scurry — may shoot after Advancing."]},grenadier:{side:0,name:"Acorn Grenadiers",short:"Grenadiers",role:"Troops",models:5,base:.3,pts:11,M:6,WS:4,BS:4,S:3,T:3,W:1,A:1,Ld:7,Sv:5,OC:1,ranged:{name:"Blasting acorns",range:12,shots:2,blast:1.6,S:4,AP:1,D:1,scenery:1,fx:"bomb"},melee:{name:"Twig knives",S:3,AP:0,D:1},abilities:['Blast — lobs 2 templates; a miss scatters D6+1".']},oakguard:{side:0,name:"Oak Guard",short:"Oak Guard",role:"Elite",models:5,base:.34,pts:22,M:5,WS:3,BS:5,S:4,T:4,W:2,A:2,Ld:8,Sv:3,OC:1,ranged:null,melee:{name:"Pinecone halberds",S:5,AP:2,D:1},abilities:["Bark shields — the clan’s anvil. No guns, all heart."]},glider:{side:0,name:"Glider Wing",short:"Gliders",role:"Fast",models:4,base:.32,pts:15,M:12,fly:!0,WS:3,BS:4,S:3,T:3,W:1,A:2,Ld:7,Sv:5,OC:1,ranged:{name:"Thorn darts",range:10,shots:2,S:3,AP:1,D:1,assault:!0,fx:"dart"},melee:{name:"Hooked claws",S:4,AP:1,D:1},abilities:["Fly — moves over scenery and enemy units.","Swoop — may shoot after Advancing."]},trebuchet:{side:0,name:"Pinecone Trebuchet",short:"Trebuchet",role:"Artillery",models:1,base:1.05,pts:95,M:3,WS:6,BS:4,S:3,T:5,W:7,A:2,Ld:7,Sv:4,OC:0,big:!0,ranged:{name:"Flaming pinecone",range:36,shots:1,blast:3,S:6,AP:1,D:2,indirect:!0,heavy:!0,scenery:3,fx:"pinecone"},melee:{name:"Crew mallets",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving."]},elder:{side:0,name:"Elder Chitterwick",short:"Elder",role:"Hero",models:1,base:.42,pts:80,hero:!0,M:6,WS:3,BS:3,S:4,T:4,W:5,A:3,Ld:9,Sv:4,OC:1,ranged:{name:"Thornburst",spell:6,range:18,shots:1,blast:2.4,S:5,AP:2,D:1,scenery:2,fx:"thorns"},melee:{name:"Rootwood staff",S:5,AP:1,D:2},abilities:["Spell — cast on 2D6 ≥ 6: thorns erupt under the target, no scatter.",`Grey whiskers — friends within ${so}" use his Ld 9.`]},scaleguard:{side:1,name:"Scaleguard",short:"Scaleguard",role:"Troops",models:6,base:.32,pts:10,M:5,WS:3,BS:5,S:4,T:4,W:1,A:1,Ld:7,Sv:4,OC:2,ranged:{name:"Javelins",range:8,shots:1,S:4,AP:0,D:1,fx:"javelin"},melee:{name:"Serpent spears",S:4,AP:1,D:1},abilities:["Shield wall — the Coil’s steady line."]},spitter:{side:1,name:"Venom Spitters",short:"Spitters",role:"Troops",models:5,base:.32,pts:12,M:5,WS:4,BS:3,S:3,T:4,W:1,A:1,Ld:7,Sv:5,OC:1,ranged:{name:"Venom spit",range:12,shots:2,S:2,AP:1,D:1,poison:4,fx:"spit"},melee:{name:"Fangs",S:3,AP:0,D:1,poison:4},abilities:["Poison 4+ — always wounds on a 4+, however tough the target."]},sidewinder:{side:1,name:"Sidewinder Stalkers",short:"Sidewinders",role:"Fast",models:4,base:.34,pts:24,M:10,WS:3,BS:5,S:4,T:4,W:2,A:2,Ld:7,Sv:5,OC:1,ranged:null,melee:{name:"Twin sickles",S:4,AP:1,D:1},abilities:["Sidewind — may charge after Advancing."]},brute:{side:1,name:"Constrictor Brute",short:"Brute",role:"Monster",models:1,base:.95,pts:125,big:!0,M:6,WS:3,BS:6,S:6,T:6,W:9,A:4,Ld:8,Sv:4,OC:4,ranged:null,melee:{name:"Crushing coils",S:7,AP:2,D:2},abilities:["Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it)."],wrecker:!0},engine:{side:1,name:"Basilisk Venom Engine",short:"Venom Engine",role:"Artillery",models:1,base:1.05,pts:100,big:!0,M:4,WS:6,BS:4,S:3,T:6,W:7,A:1,Ld:7,Sv:3,OC:0,ranged:{name:"Acid globe",range:30,shots:1,blast:2.6,S:5,AP:2,D:2,poison:3,indirect:!0,heavy:!0,scenery:4,fx:"acid"},melee:{name:"Crew hooks",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving.","Acid — Poison 3+, and it eats stone."]},hierophant:{side:1,name:"Hierophant Ssithra",short:"Hierophant",role:"Hero",models:1,base:.45,pts:85,hero:!0,M:5,WS:3,BS:3,S:4,T:5,W:5,A:3,Ld:9,Sv:4,OC:1,ranged:{name:"Mesmerize",spell:7,range:18,mesmerize:!0,fx:"gaze"},melee:{name:"Fang staff",S:5,AP:2,D:2,poison:3},abilities:["Spell — cast on 2D6 ≥ 7: the target suffers D3 mortal wounds and is Mesmerized — it can’t shoot or charge next turn and hits at −1 in melee.",`Coiled will — friends within ${so}" use her Ld 9.`]}},H_=[["elder","oakguard","nutkin","nutkin","grenadier","glider","trebuchet"],["hierophant","brute","scaleguard","scaleguard","spitter","sidewinder","engine"]],tc=()=>1+Math.floor(er()*6),$e=i=>Array.from({length:i},tc),ei=(i,t)=>i.filter(e=>e>=t).length,G_=(i,t,e)=>i<t?t:i>e?e:i,Xr=i=>i>6?0:i<=1?1:(7-i)/6;function Bi(i){let t=0;for(let e=1;e<=6;e++)for(let n=1;n<=6;n++)e+n>=i&&t++;return t/36}function cr(i,t,e){let n;return i>=2*t?n=2:i>t?n=3:i===t?n=4:2*i<=t?n=6:n=5,e?Math.min(n,e):n}function lr(i,t,e){return Math.max(2,i+t-(e?1:0))}const sr=(i,t)=>G_(i+t,2,6);function Ls(i,t,e){const n=i.alive;return e?n*i.t.A:t.blast?Math.min(t.shots,n):n*t.shots}function ro(i,t,e,n,s){const r=n.t,a=Xr(t),o=Xr(cr(e.S,r.T,e.poison)),c=1-Xr(lr(r.Sv,e.AP,s)),h=i*a*o*c,l=Math.min(e.D,r.W)/r.W,u=Math.min(n.alive,h*l);return{wounds:h,kills:u,value:u*r.pts}}const nh=Math.SQRT2;class V_{constructor(t,e,n=.5){this.W=t,this.H=e,this.cell=n,this.nx=Math.round(t/n),this.nz=Math.round(e/n);const s=this.N=this.nx*this.nz;this.hard=new Uint8Array(s),this.soft=new Uint8Array(s),this.diff=new Uint8Array(s),this.cover=new Uint8Array(s),this.clearAll=new Float32Array(s),this.clearHard=new Float32Array(s),this.tmp=new Float32Array(s)}x(t){return-this.W/2+(t%this.nx+.5)*this.cell}z(t){return-this.H/2+(Math.floor(t/this.nx)+.5)*this.cell}index(t,e){const n=Math.floor((t+this.W/2)/this.cell),s=Math.floor((e+this.H/2)/this.cell);return n<0||s<0||n>=this.nx||s>=this.nz?-1:s*this.nx+n}rebuild(t){this.hard.fill(0),this.soft.fill(0),this.diff.fill(0),this.cover.fill(0);for(const e of t){if(!e.alive)continue;const n=e.nav||e.shape;e.navKind==="hard"?this.raster(n,.1,this.hard):e.navKind==="soft"?this.raster(n,.1,this.soft):e.navKind==="diff"&&this.raster(n,.15,this.diff),e.cover&&this.raster(e.coverShape||n,.6,this.cover)}this.field(this.hard,null,this.clearHard),this.field(this.hard,this.soft,this.clearAll)}raster(t,e,n){const s=Math.hypot(t.hx,t.hz)+e,r=Math.cos(t.yaw),a=Math.sin(t.yaw),o=Math.max(0,Math.floor((t.x-s+this.W/2)/this.cell)),c=Math.min(this.nx-1,Math.floor((t.x+s+this.W/2)/this.cell)),h=Math.max(0,Math.floor((t.z-s+this.H/2)/this.cell)),l=Math.min(this.nz-1,Math.floor((t.z+s+this.H/2)/this.cell));for(let u=h;u<=l;u++)for(let f=o;f<=c;f++){const p=u*this.nx+f,_=this.x(p)-t.x,g=this.z(p)-t.z,m=_*r-g*a,d=_*a+g*r;Math.abs(m)<=t.hx+e&&Math.abs(d)<=t.hz+e&&(n[p]=1)}}field(t,e,n){const{nx:s,nz:r,cell:a}=this,o=1e6,c=a,h=a*nh;for(let l=0;l<this.N;l++)n[l]=t[l]||e&&e[l]?0:o;for(let l=0;l<r;l++)for(let u=0;u<s;u++){const f=l*s+u;let p=n[f];u>0&&(p=Math.min(p,n[f-1]+c)),l>0&&(p=Math.min(p,n[f-s]+c),u>0&&(p=Math.min(p,n[f-s-1]+h)),u<s-1&&(p=Math.min(p,n[f-s+1]+h))),n[f]=p}for(let l=r-1;l>=0;l--)for(let u=s-1;u>=0;u--){const f=l*s+u;let p=n[f];u<s-1&&(p=Math.min(p,n[f+1]+c)),l<r-1&&(p=Math.min(p,n[f+s]+c),u<s-1&&(p=Math.min(p,n[f+s+1]+h)),u>0&&(p=Math.min(p,n[f+s-1]+h))),n[f]=p}for(let l=0;l<this.N;l++){const u=this.x(l),f=this.z(l),p=Math.min(u+this.W/2,this.W/2-u,f+this.H/2,this.H/2-f);n[l]=Math.min(n[l]>0?n[l]-a*.5:0,p)}}clearance(t,e){return e==="wreck"?this.clearHard[t]:this.clearAll[t]}standable(t,e,n,s){return t<0||s&&s[t]?!1:this.clearance(t,n==="wreck"?"wreck":"all")>=e-.06}reach(t,e,{r:n,max:s,mode:r="walk",forbid:a=null}){const o=this.N,c=new Float64Array(o).fill(1/0),h=new Int32Array(o).fill(-1),l=this.index(t,e),u={dist:c,prev:h,start:l,mode:r,sx:t,sz:e};if(l<0)return u;if(r==="fly"){for(let v=0;v<o;v++){const x=Math.hypot(this.x(v)-t,this.z(v)-e);x<=s&&(c[v]=x)}return u}const f=Math.hypot(t-this.x(l),e-this.z(l));c[l]=f;const p=new X_;p.push(l,f);const{nx:_,nz:g,cell:m}=this,d=this.clearance(l,r==="wreck"?"wreck":"all")<n-.06?n*1.5:0;for(;p.size;){const[v,x]=p.pop();if(x>c[v])continue;const M=v%_,C=v/_|0;for(let w=-1;w<=1;w++)for(let A=-1;A<=1;A++){if(!A&&!w)continue;const U=M+A,y=C+w;if(U<0||y<0||U>=_||y>=g)continue;const b=y*_+U;if(a&&a[b])continue;const H=this.clearance(b,r==="wreck"?"wreck":"all");if(H<n-.06&&!(d&&H>.05&&Math.hypot(this.x(b)-t,this.z(b)-e)<d))continue;let G=this.diff[b]?2:1;r==="wreck"&&this.clearAll[b]<n-.06&&(G=2);const K=x+(A&&w?nh:1)*m*G;K<=s&&K<c[b]&&(c[b]=K,h[b]=v,p.push(b,K))}}return u}path(t,e,n,s){if(t.mode==="fly")return[{x:t.sx,z:t.sz},{x:this.x(e),z:this.z(e)}];const r=[];for(let h=e;h!==-1&&(r.push(h),h!==t.start);h=t.prev[h]);r.reverse();const a=r.map(h=>({x:this.x(h),z:this.z(h)}));if(a[0]={x:t.sx,z:t.sz},a.length<3)return a;const o=[a[0]];let c=0;for(;c<a.length-1;){let h=c+1;for(let l=a.length-1;l>c+1;l--)if(this.walkable(a[c],a[l],n,t.mode,s)){h=l;break}o.push(a[h]),c=h}return o}walkable(t,e,n,s,r){const a=Math.hypot(e.x-t.x,e.z-t.z),o=Math.ceil(a/(this.cell*.5)),c=this.diff[this.index(t.x,t.z)];for(let h=1;h<o;h++){const l=h/o,u=this.index(t.x+(e.x-t.x)*l,t.z+(e.z-t.z)*l);if(u<0||r&&r[u]||this.clearance(u,s==="wreck"?"wreck":"all")<n-.06||this.diff[u]!==c||s==="wreck"&&this.clearAll[u]<n-.06)return!1}if(r!=null&&r.discs){for(const h of r.discs)if(W_(t,e,h)<h.R)return!1}return!0}}function W_(i,t,e){const n=t.x-i.x,s=t.z-i.z,r=n*n+s*s;let a=r>0?((e.x-i.x)*n+(e.z-i.z)*s)/r:0;return a=a<0?0:a>1?1:a,Math.hypot(i.x+n*a-e.x,i.z+s*a-e.z)}const lu=i=>{let t=0;for(let e=1;e<i.length;e++)t+=Math.hypot(i[e].x-i[e-1].x,i[e].z-i[e-1].z);return t};class X_{constructor(){this.ids=[],this.keys=[]}get size(){return this.ids.length}push(t,e){const{ids:n,keys:s}=this;let r=n.length;for(n.push(t),s.push(e);r>0;){const a=r-1>>1;if(s[a]<=e)break;n[r]=n[a],s[r]=s[a],r=a}n[r]=t,s[r]=e}pop(){const{ids:t,keys:e}=this,n=[t[0],e[0]],s=t.pop(),r=e.pop();if(t.length){let a=0;const o=t.length;for(;;){let c=2*a+1;if(c>=o||(c+1<o&&e[c+1]<e[c]&&c++,e[c]>=r))break;t[a]=t[c],e[a]=e[c],a=c}t[a]=s,e[a]=r}return n}}const us=new zn(1,1,1),$_=new sn(.5,.5,1,8).rotateZ(Math.PI/2),fa=new Map;function _e(i,t={}){const e=i+JSON.stringify(t);return fa.has(e)||fa.set(e,new wn({color:i,roughness:.9,flatShading:!0,...t})),fa.get(e)}function ve(i,t,{shadow:e=!0}={}){const n=new kt(i,t);return n.castShadow=e,n.receiveShadow=!0,n}const q_={stone:{colors:["#8f8b82","#9c978d","#7f7b73","#a7a296","#878378"],bw:1,by:.72,bt:.62,hp:3,look:"box"},sand:{colors:["#c9a66b","#d6b67e","#b9935b","#ddc28e","#c29a60"],bw:1,by:.72,bt:.66,hp:2,look:"box"},log:{colors:["#7a5232","#6b4528","#86603c","#5f3e24"],bw:1,by:.56,bt:.56,hp:2,look:"log"}},Y_={oak:["#4f8a34","#5f9a3c","#447a2c","#6aa646"],autumn:["#d08a2c","#c4622a","#e0a93a","#b8481f"],pine:["#2f6a3c","#3a7a46","#285c34"]},j_=["#7a5232","#5f3e24","#9a7048","#b08a5a"];let K_=1;class J_{constructor(t,e,n,s){this.scene=t,this.fx=e,this.W=n,this.H=s,this.group=new Ot,t.add(this.group),this.chunks=[],this.features=[],this.dirty=!0,this.onBreak=null}clear(){this.scene.remove(this.group),this.group=new Ot,this.scene.add(this.group),this.chunks=[],this.features=[],this.dirty=!0}add(t){const e={id:K_++,alive:!0,destructible:t.hp!==1/0,hp:t.hp??1/0,maxHp:t.hp??1/0,los:null,cover:!1,navKind:null,...t},n=e.shape;return n.reach=Math.hypot(n.hx,n.hz)+.05,e.mesh&&this.group.add(e.mesh),this.chunks.push(e),e}generate(t,e,n){this.clear();const s=Ca(t),{W:r,H:a}=this,o=[],c=s();if(c<.55)this.build("tower",{x:0,z:0,yaw:s()*Math.PI},s()*1e9|0),o.push({x:0,z:0,r:4.6,hollow:!0});else if(c<.8){const p=s()*Math.PI;for(const _ of[0,1]){const g=p+_*(Math.PI/2),m=Math.cos(g)*4.2,d=Math.sin(g)*4.2,v=s()*1e9|0;this.build("rocks",{x:m,z:d,yaw:g},v),this.build("rocks",{x:-m,z:-d,yaw:g+Math.PI},v),o.push({x:m,z:d,r:1.8},{x:-m,z:-d,r:1.8})}}const h=[["ruin",3.2,4],["wall",3.6,2],["forest",3.2,3],["hedgerow",3.4,2],["rocks",2,2],["barricade",2,2],["mushrooms",2,1.5],["obelisk",1.6,1]],l=h.reduce((p,_)=>p+_[2],0),u=6+Math.floor(s()*3);let f=0;for(let p=0;p<1200&&f<u;p++){let _=s()*l,g=h[0];for(const U of h)if((_-=U[2])<=0){g=U;break}const[m,d]=g,v=ee(s,-r/2+d+.5,r/2-d-.5),x=ee(s,-a/2+d+.5,a/2-d-.5);if(Math.hypot(v,x)<d+1.4||Math.abs(v)>r/2-n-1&&(d>2.1||m==="forest")||e.some(U=>Math.hypot(U.x-v,U.z-x)<d+2.2))continue;const C=2.1;if(o.some(U=>Math.hypot(U.x-v,U.z-x)<U.r+d+C||Math.hypot(U.x+v,U.z+x)<U.r+d+C))continue;const w=s()*Math.PI*2,A=s()*1e9|0;this.build(m,{x:v,z:x,yaw:w},A),this.build(m,{x:-v,z:-x,yaw:w+Math.PI},A),o.push({x:v,z:x,r:d},{x:-v,z:-x,r:d}),f++}this.features=o,this.dirty=!0}build(t,e,n){const s=Ca(n),r=Math.cos(e.yaw),a=Math.sin(e.yaw),o={p:(c,h)=>({x:e.x+r*c+a*h,z:e.z-a*c+r*h}),yaw:(c=0)=>e.yaw+c};this[t](o,s)}column(t,e,n,s,r,a,o,{holes:c=[],cap:h=!1,bw:l,bt:u}={}){const f=q_[o],p=l??f.bw,_=u??f.bt,g=t.p(n,s),m=t.yaw(r),d={blocks:[],x:g.x,z:g.z,yaw:m,style:f,rubble:null,w:p,t:_};for(let v=0;v<a;v++){if(c.includes(v))continue;const x=je(f.colors,e),M=m+(e()-.5)*.06,C=ve(f.look==="log"?$_:us,_e(x));f.look==="log"?C.scale.set(p*1.02,f.by,_):C.scale.set(p*(.95+e()*.04),f.by*.96,_*(.9+e()*.1)),C.position.set(g.x,f.by*(v+.5),g.z),C.rotation.y=M;const w=this.add({kind:"block",mesh:C,hp:f.hp,color:x,shape:{x:g.x,y:f.by*(v+.5),z:g.z,hx:p/2,hy:f.by/2,hz:_/2,yaw:m},navKind:"soft",los:"block",cover:!0});w.col=d,w.level=v,d.blocks.push(w)}if(h&&a>0){const v=je(f.colors,e),x=ve(new On(p*.72,p*1.1,4).rotateY(Math.PI/4),_e(v)),M=f.by*a+p*.55;x.position.set(g.x,M,g.z),x.rotation.y=m;const C=this.add({kind:"block",mesh:x,hp:f.hp,color:v,capH:p*1.1,shape:{x:g.x,y:M,z:g.z,hx:p/2,hy:p*.55,hz:p/2,yaw:m},navKind:"soft",los:"block",cover:!0});C.col=d,C.level=a,d.blocks.push(C)}return d}tree(t,e,n,s,r){const a=t.p(n,s),o=ee(e,1.5,2.4),c=ee(e,.17,.26),h=new Ot;h.position.set(a.x,0,a.z);const l=ve(new sn(c*.75,c,o,7).translate(0,o/2,0),_e(je(["#6b4a2e","#5a3d24","#7a5638"],e)));h.add(l);const u=new Ot;h.add(u);let f;const p=Y_[r];if(r==="pine"){for(let g=0;g<3;g++){const m=1.05-g*.26,d=1.3-g*.15,v=ve(new On(m,d,8),_e(je(p,e)));v.position.y=o*.45+g*.75+d/2,v.rotation.y=e()*3,u.add(v)}f=o*.45+2.5}else{const g=3+Math.floor(e()*3);for(let m=0;m<g;m++){const d=ee(e,.55,.9),v=ve(new Fn(d,1),_e(je(p,e)));v.position.set(ee(e,-.5,.5),o+ee(e,-.1,.6),ee(e,-.5,.5)),v.scale.y=.8,u.add(v)}f=o+1.2}h.rotation.y=e()*6;const _=this.add({kind:"tree",mesh:h,hp:3,leaves:p,shape:{x:a.x,y:f/2,z:a.z,hx:.7,hy:f/2,hz:.7,yaw:0},nav:{x:a.x,z:a.z,hx:c+.12,hz:c+.12,yaw:0},coverShape:{x:a.x,z:a.z,hx:.8,hz:.8,yaw:0},navKind:"soft",los:"obscure",cover:!0});return _.trunkH=o,_.trunkR=c,_.canopy=u,_}hedge(t,e,n,s,r){const a=t.p(n,s),o=t.yaw(r),c=new Ot;c.position.set(a.x,0,a.z),c.rotation.y=o;const h=je(["#3f7a34","#4a8a3a","#386c2e"],e),l=ve(us,_e(h));l.scale.set(1.15,.62,.55),l.position.y=.31,c.add(l);for(let u=0;u<3;u++){const f=ve(new Fn(.3,0),_e(je(["#4f8f3e","#5c9a46","#3f7a34"],e)));f.position.set(-.4+u*.4,.62+e()*.08,ee(e,-.08,.08)),c.add(f)}if(e()<.4)for(let u=0;u<4;u++){const f=ve(new un(.05,5,4),_e("#c0302a"),{shadow:!1});f.position.set(ee(e,-.5,.5),ee(e,.35,.75),.29),c.add(f)}return this.add({kind:"hedge",mesh:c,hp:1,leaves:["#3f7a34","#5c9a46","#2f5f28"],shape:{x:a.x,y:.42,z:a.z,hx:.6,hy:.42,hz:.3,yaw:o},navKind:"diff",los:"obscure",cover:!0})}boulder(t,e,n,s,r){const a=t.p(n,s),o=ee(e,.65,1.25),c=ve(new to(r,0),_e(je(["#7d7a74","#8c8880","#6e6b66","#96918a"],e)));c.scale.set(1,o,ee(e,.75,1.1)),c.rotation.set(e()*.6,e()*6,e()*.6);const h=r*o;if(c.position.set(a.x,h*.55,a.z),e()<.6){const u=ve(new to(r*.55,0),_e("#5d7a3a"),{shadow:!1});u.position.set(0,r*.55,0),u.scale.set(1.1,.4,1.1),c.add(u)}const l=h*1.5;return this.add({kind:"rock",mesh:c,hp:1/0,shape:{x:a.x,y:l/2,z:a.z,hx:r*.85,hy:l/2,hz:r*.85,yaw:0},navKind:"hard",los:l>1.2?"block":"obscure",cover:!0})}crate(t,e,n,s){const r=t.p(n,s),a=t.yaw(e()*6),o=e();let c,h;if(o<.45){c=new Ot;const l=ee(e,.55,.75),u=ve(us,_e(je(["#9a7048","#8a6038","#a77d50"],e)));u.scale.setScalar(l),u.position.y=l/2;const f=ve(us,_e("#5f3e24"));if(f.scale.set(l*1.02,l*.14,l*1.02),f.position.y=l/2,c.add(u,f),e()<.4){const p=ve(us,_e("#9a7048"));p.scale.setScalar(l*.7),p.position.set(0,l+l*.35,0),p.rotation.y=.5,c.add(p),h=l*1.7}else h=l}else if(o<.8){c=new Ot;const l=ve(new sn(.28,.24,.75,10),_e(je(["#8a5a34","#7a4c2a"],e)));l.position.y=.375;const u=ve(new Sn(.29,.025,4,14).rotateX(Math.PI/2),_e("#3a3a3a",{metalness:.4}));u.position.y=.55,c.add(l,u),h=.75}else{c=new Ot;const l=ve(new un(.34,9,7),_e("#c2a77a"));l.scale.set(1,1.15,.9),l.position.y=.36,c.add(l);for(let u=0;u<4;u++){const f=ve(new un(.08,6,5),_e("#8a5a2a"));f.position.set(ee(e,-.12,.12),.72,ee(e,-.12,.12)),c.add(f)}h=.78}return c.position.set(r.x,0,r.z),c.rotation.y=a,this.add({kind:"crate",mesh:c,hp:1,color:"#9a7048",shape:{x:r.x,y:h/2,z:r.z,hx:.36,hy:h/2,hz:.36,yaw:a},navKind:"diff",los:"obscure",cover:!0})}mushroom(t,e,n,s){const r=t.p(n,s),a=ee(e,.9,1.9),o=ee(e,.5,.95),c=ee(e,.12,.2),h=new Ot;h.position.set(r.x,0,r.z);const l=ve(new sn(c*.8,c*1.2,a,8).translate(0,a/2,0),_e("#efe6d0")),u=je(["#c0392b","#d35a1f","#8e44ad","#b03050"],e),f=ve(new un(o,14,8,0,Math.PI*2,0,Math.PI/2),_e(u));f.position.y=a-.05,f.scale.y=.7;const p=ve(new Fi(o,14).rotateX(Math.PI/2),_e("#e9dcc0"));p.position.y=a-.05,h.add(l,f,p);for(let g=0;g<6;g++){const m=e()*6,d=ee(e,.25,1.1),v=ve(new un(o*.12,5,4),_e("#fff6e0"),{shadow:!1});v.position.set(Math.cos(m)*Math.sin(d)*o,a-.05+Math.cos(d)*o*.7,Math.sin(m)*Math.sin(d)*o),h.add(v)}h.rotation.z=ee(e,-.12,.12);const _=a+o*.7;return this.add({kind:"mushroom",mesh:h,hp:2,leaves:[u,"#fff6e0","#efe6d0"],shape:{x:r.x,y:_/2,z:r.z,hx:o*.6,hy:_/2,hz:o*.6,yaw:0},nav:{x:r.x,z:r.z,hx:c+.12,hz:c+.12,yaw:0},navKind:"soft",los:"obscure",cover:!0})}floor(t,e,n,s){const r=t.p(0,0),a=new Fi(n,22),o=a.attributes.position;for(let h=1;h<o.count;h++){const l=.78+e()*.3;o.setXY(h,o.getX(h)*l,o.getY(h)*l)}a.rotateX(-Math.PI/2);const c=ve(a,_e(s,{flatShading:!1}),{shadow:!1});return c.position.set(r.x,.012,r.z),this.add({kind:"floor",mesh:c,hp:1/0,shape:{x:r.x,y:.01,z:r.z,hx:n*.75,hy:.01,hz:n*.75,yaw:0},navKind:"diff",cover:!0})}ruin(t,e){const n=je(["stone","sand","log","stone"],e),s=4+Math.floor(e()*3),r=3+Math.floor(e()*3),a=-s/2+.5,o=-r/2+.5,c=1+Math.floor(e()*(s-2));for(let l=0;l<s;l++){if(l===c)continue;let u=Math.max(1,Math.min(3,3-Math.floor(l/2)+Math.floor(e()*2)-(e()<.3?1:0)));const f=u===3&&e()<.35?[1]:[];this.column(t,e,a+l,o,0,u,n,{holes:f})}for(let l=1;l<=r;l++){let u=Math.max(1,Math.min(3,3-Math.floor(l/2)+Math.floor(e()*2)));if(e()<.15)continue;const f=u===3&&e()<.35?[1]:[];this.column(t,e,a,o+.3+.5+(l-1),Math.PI/2,u,n,{holes:f})}const h=Math.floor(e()*3);for(let l=0;l<h;l++)this.crate(t,e,a+ee(e,1.5,s-1),o+ee(e,1.6,r-.5))}wall(t,e){const n=je(["stone","sand","log"],e),s=5+Math.floor(e()*3),r=Math.floor(e()*s);for(let a=0;a<s;a++){if(a===r&&s>5)continue;const o=1+Math.floor(e()*3);this.column(t,e,a-(s-1)/2,0,0,o,n,{holes:o===3&&e()<.4?[1]:[]})}e()<.6&&this.crate(t,e,ee(e,-2,2),ee(e,.9,1.4))}tower(t,e){const n=je(["stone","sand"],e),s=18,r=3.4,a=[];for(let h=0;h<s/2;h++)a.push(1+Math.floor(e()*3));const o=new Set([0,Math.floor(s/4)+(e()<.5?0:1)]),c=a.map(h=>h===3&&e()<.4);for(let h=0;h<s;h++){const l=h%(s/2);if(o.has(l))continue;const u=h/s*Math.PI*2,f=Math.atan2(-Math.cos(u),-Math.sin(u));this.column(t,e,Math.cos(u)*r,Math.sin(u)*r,f,a[l],n,{holes:c[l]?[1]:[],bw:1.12})}}forest(t,e){const n=e()<.3?"pine":e()<.4?"autumn":"oak";this.floor(t,e,3,n==="autumn"?"#5a5a2a":"#355a2a");const s=[],r=3+Math.floor(e()*3);for(let a=0;a<60&&s.length<r;a++){const o=e()*Math.PI*2,c=Math.sqrt(e())*2.2,h=Math.cos(o)*c,l=Math.sin(o)*c;s.some(u=>Math.hypot(u.x-h,u.z-l)<1.55)||s.push({x:h,z:l})}for(const a of s)this.tree(t,e,a.x,a.z,n)}hedgerow(t,e){const n=5+Math.floor(e()*3),s=ee(e,-.12,.12),r=1+Math.floor(e()*(n-2));for(let a=0;a<n;a++){if(a===r&&e()<.7)continue;const o=(a-(n-1)/2)*1.12,c=s*o*o;this.hedge(t,e,o,c,-Math.atan(2*s*o))}}rocks(t,e){const n=2+Math.floor(e()*3);this.boulder(t,e,0,0,ee(e,.8,1.15));for(let s=1;s<n;s++){const r=e()*6;this.boulder(t,e,Math.cos(r)*ee(e,.9,1.4),Math.sin(r)*ee(e,.9,1.4),ee(e,.35,.7))}}barricade(t,e){const n=3+Math.floor(e()*3);for(let s=0;s<n;s++)this.crate(t,e,(s-(n-1)/2)*.8+ee(e,-.1,.1),ee(e,-.3,.3))}mushrooms(t,e){const n=3+Math.floor(e()*3),s=[];for(let r=0;r<40&&s.length<n;r++){const a=e()*6,o=Math.sqrt(e())*1.5,c=Math.cos(a)*o,h=Math.sin(a)*o;s.some(l=>Math.hypot(l.x-c,l.z-h)<.9)||(s.push({x:c,z:h}),this.mushroom(t,e,c,h))}}obelisk(t,e){this.column(t,e,0,0,0,3+Math.floor(e()*2),"sand",{cap:!0,bw:.8,bt:.8}),e()<.7&&this.boulder(t,e,1,.4,.4)}los(t,e,n=1.3){let s=0;const r=e.x-t.x,a=e.y-t.y,o=e.z-t.z,c=r*r+o*o;for(const h of this.chunks){if(!h.alive||!h.los)continue;const l=h.shape;let u=c>0?((l.x-t.x)*r+(l.z-t.z)*o)/c:0;u=u<0?0:u>1?1:u;const f=t.x+r*u-l.x,p=t.z+o*u-l.z;if(!(f*f+p*p>l.reach*l.reach)&&Z_(t,r,a,o,l)){if(h.los==="block")return{blocked:!0,obscure:s};Math.hypot(l.x-t.x,l.z-t.z)<n+l.reach*.5||s++}}return{blocked:s>=2,obscure:s}}blast(t,e,n,s,{acid:r=!1}={}){const a=[];for(const o of[...this.chunks]){if(!o.alive||!o.destructible)continue;const c=Q_(t,.5,e,o.shape);if(c>n)continue;let h=c<n*.6?s:Math.ceil(s/2);r&&o.kind==="block"&&(h+=1),this.hurt(o,h,{x:t,z:e},a)}return a}hurt(t,e,n,s=[]){if(!t.alive||!t.destructible)return s;if(t.hp-=e,t.hp<=0)this.destroy(t,n),s.push(t);else{t.mesh.isMesh&&(t.ownMat||(t.mesh.material=t.mesh.material.clone(),t.ownMat=!0),t.mesh.material.color.multiplyScalar(.8));const r=t.mesh.position.clone();Pe(.25,a=>{const o=(1-a)*.06;t.mesh.position.set(r.x+(Math.random()-.5)*o,r.y,r.z+(Math.random()-.5)*o)}).then(()=>t.mesh.position.copy(r)),this.fx.debris(t.shape.x,t.shape.y,t.shape.z,[t.color||"#888","#666"],3,{from:n,power:3,size:.08})}return s}destroy(t,e){var r;t.alive=!1,this.dirty=!0;const n=t.shape,s=this.fx;switch(t.kind){case"block":{this.group.remove(t.mesh),s.debris(n.x,n.y,n.z,[t.color,t.color,"#5a5650"],12,{from:e,power:6}),s.smoke({x:n.x,y:n.y,z:n.z,size:.4,color:"#a09a8a",life:1.5}),this.collapse(t.col),this.rubble(t.col,e);break}case"tree":this.topple(t,e);break;case"hedge":case"mushroom":if(this.group.remove(t.mesh),s.leaves(n.x,n.y,n.z,t.leaves,t.kind==="hedge"?22:28,t.kind==="hedge"?.8:1.4),t.kind==="mushroom")for(let a=0;a<16;a++)s.mote({x:n.x,y:n.y*1.5,z:n.z,vx:(Math.random()-.5)*3,vy:Math.random()*2,vz:(Math.random()-.5)*3,size:.05,color:"#f0e0ff",life:2.5,drag:1});break;case"crate":case"log":this.group.remove(t.mesh),s.debris(n.x,n.y,n.z,j_,14,{from:e,power:6,size:.12});break}(r=this.onBreak)==null||r.call(this,t)}collapse(t){t.blocks=t.blocks.filter(n=>n.alive).sort((n,s)=>n.level-s.level);let e=0;for(const n of t.blocks){if(n.level>e){const s=(n.level-e)*t.style.by;n.level=e,n.shape.y-=s;const r=n.mesh.position.y,a=r-s;Pe(.18+s*.15,o=>n.mesh.position.y=r+(a-r)*o,O_).then(()=>{this.fx.debris(n.shape.x,n.shape.y-t.style.by/2,n.shape.z,["#8a8478"],3,{power:2,size:.07})})}e=n.level+1}}rubble(t,e){const n=t.style;let s=t.rubble;if(!s){const o=new Ot;o.position.set(t.x,0,t.z),s=t.rubble=this.add({kind:"rubble",mesh:o,hp:1/0,pieces:0,shape:{x:t.x,y:.2,z:t.z,hx:t.w*.7,hy:.2,hz:.6,yaw:t.yaw},navKind:"diff",los:"obscure",cover:!0}),this.dirty=!0}const r=s.mesh,a=4+Math.floor(Math.random()*3);for(let o=0;o<a;o++){const c=ve(us,_e(je(n.colors))),h=.18+Math.random()*.22;c.scale.set(h*(n.look==="log"?2.4:1.2),h*.7,h);const l=Math.random()*6,u=Math.random()*.6,f=e?t.x-e.x:0,p=e?t.z-e.z:0,_=Math.hypot(f,p)||1;c.position.set(Math.cos(l)*u+f/_*.25,h*.3+Math.min(.2,s.pieces*.012),Math.sin(l)*u+p/_*.25),c.rotation.set(Math.random(),Math.random()*6,Math.random()),r.add(c)}s.pieces+=a}topple(t,e){const n=t.shape;let s=n.x-((e==null?void 0:e.x)??n.x-1),r=n.z-((e==null?void 0:e.z)??n.z);const a=Math.hypot(s,r)||1;s/=a,r/=a;const o=t.leaves;for(const _ of t.canopy.children){const g=new R;_.getWorldPosition(g),this.fx.leaves(g.x,g.y,g.z,o,14,1)}t.mesh.remove(t.canopy);const c=t.mesh,h=new R(r,0,-s).normalize(),l=c.quaternion.clone(),u=new Nn;Pe(.9,_=>{u.setFromAxisAngle(h,(Math.PI/2-.12)*_),c.quaternion.copy(l).premultiply(u),c.position.y=Math.sin(_*Math.PI)*.05+t.trunkR*_},N_).then(()=>{this.fx.debris(n.x+s*t.trunkH,.2,n.z+r*t.trunkH,["#6b4a2e","#4f8a34"],8,{power:3,size:.1}),this.fx.shake=Math.max(this.fx.shake,.05)});const f=t.trunkH,p=this.add({kind:"log",mesh:c,hp:2,shape:{x:n.x+s*f*.5,y:t.trunkR,z:n.z+r*f*.5,hx:f*.5,hy:t.trunkR,hz:t.trunkR+.05,yaw:Math.atan2(-r,s)},navKind:"diff",los:"obscure",cover:!0});return this.dirty=!0,p}}function Z_(i,t,e,n,s){const r=Math.cos(s.yaw),a=Math.sin(s.yaw),o=i.x-s.x,c=i.y-s.y,h=i.z-s.z,l=[o*r-h*a,c,o*a+h*r],u=[t*r-n*a,e,t*a+n*r],f=[s.hx,s.hy,s.hz];let p=0,_=1;for(let g=0;g<3;g++)if(Math.abs(u[g])<1e-9){if(Math.abs(l[g])>f[g])return!1}else{let m=(-f[g]-l[g])/u[g],d=(f[g]-l[g])/u[g];if(m>d&&([m,d]=[d,m]),m>p&&(p=m),d<_&&(_=d),p>_)return!1}return!0}function Q_(i,t,e,n){const s=Math.cos(n.yaw),r=Math.sin(n.yaw),a=i-n.x,o=t-n.y,c=e-n.z,h=a*s-c*r,l=a*r+c*s,u=Math.max(0,Math.abs(h)-n.hx),f=Math.max(0,Math.abs(o)-n.hy),p=Math.max(0,Math.abs(l)-n.hz);return Math.hypot(u,f,p)}const ih=900,sh=700,rh=260,fs=new ce,oh=new Nn,tv=new Us,$r=new R,ev=new R,ah=new $t;class da{constructor(t,e){this.mesh=t,this.max=e,this.items=[],this.free=[];for(let n=e-1;n>=0;n--)this.free.push(n);t.instanceMatrix.setUsage(td),t.frustumCulled=!1,fs.makeScale(0,0,0);for(let n=0;n<e;n++)t.setMatrixAt(n,fs),t.setColorAt(n,ah.set(16777215))}spawn(t){if(!this.free.length){const e=this.items.shift();this.free.push(e.i)}t.i=this.free.pop(),this.mesh.setColorAt(t.i,ah.set(t.color)),this.mesh.instanceColor.needsUpdate=!0,this.items.push(t)}update(t){const e=[];for(const n of this.items){if(n.age+=t,n.age>=n.life){fs.makeScale(0,0,0),this.mesh.setMatrixAt(n.i,fs),this.free.push(n.i);continue}n.vy-=n.g*t;const s=Math.exp(-n.drag*t);n.vx*=s,n.vz*=s,n.g<0&&(n.vy*=s),n.x+=n.vx*t,n.y+=n.vy*t,n.z+=n.vz*t,n.y<n.floor&&(n.y=n.floor,n.vy=-n.vy*n.bounce,n.vx*=.55,n.vz*=.55,n.spin*=.5),n.rx+=n.spin*t,n.ry+=n.spin*.7*t;const r=n.age/n.life,a=n.size*(n.grow?.4+r*n.grow:1)*(r>n.fadeAt?1-(r-n.fadeAt)/(1-n.fadeAt):1);oh.setFromEuler(tv.set(n.rx,n.ry,0)),fs.compose($r.set(n.x,n.y,n.z),oh,ev.set(a*n.sx,a*n.sy,a*n.sz)),this.mesh.setMatrixAt(n.i,fs),e.push(n)}this.items=e,this.mesh.instanceMatrix.needsUpdate=!0}}function pa(i){return{x:i.x,y:i.y,z:i.z,vx:i.vx||0,vy:i.vy||0,vz:i.vz||0,g:i.g??22,drag:i.drag??.6,bounce:i.bounce??.3,floor:i.floor??.04,size:i.size??.15,sx:i.sx??1,sy:i.sy??1,sz:i.sz??1,rx:Math.random()*6,ry:Math.random()*6,spin:i.spin??(Math.random()-.5)*18,age:0,life:i.life??1.5,fadeAt:i.fadeAt??.7,grow:i.grow||0,color:i.color}}function ch(i,t){const e=document.createElement("canvas");e.width=e.height=128;const n=e.getContext("2d"),s=n.createRadialGradient(64,64,4,64,64,62);s.addColorStop(0,i),s.addColorStop(.55,i),s.addColorStop(1,t),n.fillStyle=s,n.fillRect(0,0,128,128);for(let a=0;a<90;a++){const o=Math.random()*Math.PI*2,c=30+Math.random()*30;n.fillStyle=i,n.globalAlpha=Math.random()*.5,n.beginPath(),n.arc(64+Math.cos(o)*c,64+Math.sin(o)*c,2+Math.random()*6,0,Math.PI*2),n.fill()}const r=new Xa(e);return r.colorSpace=Ae,r}class nv{constructor(t,e,n){this.scene=t,this.camera=e,this.overlay=n,this.shake=0;const s=new Zs(new zn(1,1,1),new wn({roughness:.85}),ih);s.castShadow=!0;const r=new Zs(new Fn(1,0),new Je({toneMapped:!1}),sh),a=new Zs(new Fn(1,1),new T_({transparent:!0,opacity:.55,depthWrite:!1}),rh);t.add(s,r,a),this.cubes=new da(s,ih),this.glow=new da(r,sh),this.puff=new da(a,rh),this.lights=[];for(let o=0;o<3;o++){const c=new C_(16755285,0,14,1.6);c.position.set(0,-50,0),t.add(c),this.lights.push({l:c,until:0})}this.scorchTex=ch("rgba(20,14,8,0.85)","rgba(20,14,8,0)"),this.acidTex=ch("rgba(90,220,60,0.75)","rgba(40,120,20,0)"),this.decals=[],this.decalGeo=new Fi(1,28),this.decalGeo.rotateX(-Math.PI/2),this.texts=[],this.flashGeo=new un(1,20,12),this.ringGeo=new Vi(.93,1,64),this.ringGeo.rotateX(-Math.PI/2),this.discGeo=new Fi(1,48),this.discGeo.rotateX(-Math.PI/2)}cube(t){this.cubes.spawn(pa(t))}mote(t){this.glow.spawn(pa({g:-1,drag:2.5,bounce:0,floor:-99,spin:0,...t}))}smoke(t){this.puff.spawn(pa({g:-2.2,drag:1.8,bounce:0,floor:.1,spin:0,grow:2.2,fadeAt:.4,...t}))}debris(t,e,n,s,r,{from:a,power:o=7,size:c=.16}={}){for(let h=0;h<r;h++){let l=Math.random()-.5,u=Math.random()-.5;a&&(l+=(t-a.x)*.35,u+=(n-a.z)*.35);const f=Math.hypot(l,u)||1,p=o*(.4+Math.random()*.8);this.cube({x:t+(Math.random()-.5)*.4,y:e+Math.random()*.3,z:n+(Math.random()-.5)*.4,vx:l/f*p,vy:3+Math.random()*o,vz:u/f*p,size:c*(.5+Math.random()),sy:.6+Math.random()*.8,color:s[Math.random()*s.length|0],life:2.4+Math.random()*1.5,fadeAt:.75})}}leaves(t,e,n,s,r,a=1){for(let o=0;o<r;o++){const c=Math.random()*Math.PI*2,h=1+Math.random()*4*a;this.cube({x:t+Math.cos(c)*.5*a,y:e+Math.random()*a,z:n+Math.sin(c)*.5*a,vx:Math.cos(c)*h,vy:2+Math.random()*4,vz:Math.sin(c)*h,g:5,drag:2.4,size:.1+Math.random()*.08,sy:.25,spin:(Math.random()-.5)*10,color:s[Math.random()*s.length|0],life:1.6+Math.random()*1.6})}}flashLight(t,e,n,s,r,a){const o=this.lights.reduce((c,h)=>c.until<h.until?c:h);o.until=ln.time+a,o.l.color.set(s),o.l.position.set(t,e,n),Pe(a,c=>o.l.intensity=r*(1-c)*(1-c))}decal(t,e,n,s,r=.8){const a=new kt(this.decalGeo,new Je({map:s,transparent:!0,depthWrite:!1,opacity:r,polygonOffset:!0,polygonOffsetFactor:-2}));if(a.position.set(t,.015+this.decals.length*4e-4,e),a.rotation.y=Math.random()*6,a.scale.setScalar(n),a.renderOrder=1,this.scene.add(a),this.decals.push(a),this.decals.length>40){const o=this.decals.shift();this.scene.remove(o),o.material.dispose()}return a}clearDecals(){for(const t of this.decals)this.scene.remove(t),t.material.dispose();this.decals=[]}ring(t,e,n,s,{life:r=1.2,fill:a=.18,hold:o=!1}={}){const c=new Ot,h=new kt(this.ringGeo,new Je({color:s,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1})),l=new kt(this.discGeo,new Je({color:s,transparent:!0,opacity:a,depthWrite:!1,toneMapped:!1}));c.add(h,l),c.position.set(t,.05,e),c.scale.setScalar(n),c.renderOrder=3,this.scene.add(c);const u=()=>{this.scene.remove(c),h.material.dispose(),l.material.dispose()};return o||Pe(r,f=>{h.material.opacity=.95*(1-f),l.material.opacity=a*(1-f)}).then(u),c.userData.remove=u,c}explode(t,e,n,s="fire"){const r={fire:{flash:16761963,glow:["#ffd36e","#ff8a2a","#ff5a1f","#fff2b0"],light:16751178,smoke:"#4a4038"},acid:{flash:10354538,glow:["#b8ff6a","#5be04a","#d8ff9a","#2fbf4a"],light:9109338,smoke:"#3f5a2a"},thorns:{flash:13172634,glow:["#9be36a","#e4ffb0","#5ab04a"],light:12255114,smoke:"#3a4a2a"},dust:{flash:16773328,glow:["#ffe9b0","#ffd080"],light:16769184,smoke:"#8a7a64"}}[s],a=new kt(this.flashGeo,new Je({color:r.flash,transparent:!0,opacity:.9,toneMapped:!1,depthWrite:!1}));a.position.set(t,.3,e),this.scene.add(a),Pe(.45,c=>{a.scale.setScalar(.2+n*.85*Ps(c)),a.material.opacity=.9*(1-c)}).then(()=>{this.scene.remove(a),a.material.dispose()}),this.flashLight(t,1.5,e,r.light,9+n*6,.7);const o=Math.round(18+n*14);for(let c=0;c<o;c++){const h=Math.random()*Math.PI*2,l=(2+Math.random()*6)*(.6+n*.25);this.mote({x:t,y:.3,z:e,vx:Math.cos(h)*l,vy:2+Math.random()*6,vz:Math.sin(h)*l,g:9,drag:2.2,size:.07+Math.random()*.12,color:r.glow[c%r.glow.length],life:.5+Math.random()*.7})}for(let c=0;c<6+n*3;c++){const h=Math.random()*Math.PI*2,l=Math.random()*n*.6;this.smoke({x:t+Math.cos(h)*l,y:.3+Math.random()*.4,z:e+Math.sin(h)*l,vx:Math.cos(h)*1.2,vy:1+Math.random()*1.5,vz:Math.sin(h)*1.2,size:.25+Math.random()*.25*n,color:r.smoke,life:1.6+Math.random()*1.4})}this.debris(t,.1,e,["#5b4630","#6f8a3a","#4a3a28"],Math.round(6+n*4),{power:5+n,size:.1}),this.decal(t,e,n*.7,s==="acid"?this.acidTex:this.scorchTex,s==="acid"?.6:.45),this.shake=Math.max(this.shake,.05+n*.06)}async projectile(t,e,{mesh:n,arc:s=.25,speed:r=22,trail:a=null,spin:o=10}={}){const c=Math.hypot(e.x-t.x,e.z-t.z),h=c*s;this.scene.add(n);let l=0;await Pe(Math.max(.12,c/r),u=>{n.position.set(t.x+(e.x-t.x)*u,t.y+(e.y-t.y)*u+4*h*u*(1-u),t.z+(e.z-t.z)*u),n.rotation.x+=o*.016,n.rotation.z+=o*.011,a&&u-l>.03&&(l=u,a(n.position))}),this.scene.remove(n)}text(t,e,n="#ffffff",{size:s=18,life:r=1.3,rise:a=1.4}={}){const o=document.createElement("div");o.className="float-text",o.textContent=e,o.style.color=n,o.style.fontSize=s+"px",this.overlay.appendChild(o),this.texts.push({el:o,x:t.x,y:t.y,z:t.z,age:0,life:r,rise:a})}update(t){this.cubes.update(t),this.glow.update(t),this.puff.update(t),this.shake*=Math.exp(-t*6);const e=innerWidth,n=innerHeight;this.texts=this.texts.filter(s=>{if(s.age+=t,s.age>s.life)return s.el.remove(),!1;const r=s.age/s.life;return $r.set(s.x,s.y+s.rise*Ps(r),s.z).project(this.camera),s.el.style.transform=`translate(${($r.x*.5+.5)*e}px, ${(-$r.y*.5+.5)*n}px) translate(-50%, -50%) scale(${1+.3*(1-Math.min(1,r*5))})`,s.el.style.opacity=r>.6?1-(r-.6)/.4:1,!0})}}function iv(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,c=new Ee;let h=0;for(let l=0;l<i.length;++l){const u=i[l];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,l),h+=p}}if(e){let l=0;const u=[];for(let f=0;f<i.length;++f){const p=i[f].index;for(let _=0;_<p.count;++_)u.push(p.getX(_)+l);l+=i[f].attributes.position.count}c.setIndex(u)}for(const l in r){const u=lh(r[l]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" attribute."),null;c.setAttribute(l,u)}for(const l in a){const u=a[l][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[l]=[];for(let f=0;f<u;++f){const p=[];for(let g=0;g<a[l].length;++g)p.push(a[l][g][f]);const _=lh(p);if(!_)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" morphAttribute."),null;c.morphAttributes[l].push(_)}}return c}function lh(i){let t,e,n,s=-1,r=0;for(let h=0;h<i.length;++h){const l=i[h];if(l.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=l.array.constructor),t!==l.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=l.itemSize),e!==l.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=l.normalized),n!==l.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=l.gpuType),s!==l.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=l.array.length}const a=new t(r);let o=0;for(let h=0;h<i.length;++h)a.set(i[h].array,o),o+=i[h].array.length;const c=new fn(a,e,n);return s!==void 0&&(c.gpuType=s),c}const ma=new Map;function pt(i,t={}){const e=i+JSON.stringify(t);return ma.has(e)||ma.set(e,new wn({color:i,roughness:.72,flatShading:!0,...t})),ma.get(e)}const wi=i=>pt(i,{emissive:i,emissiveIntensity:1.6,roughness:.3}),Xe=i=>pt(i,{metalness:.65,roughness:.35}),at={ico:new Fn(1,1),ico0:new Fn(1,0),sph:new un(1,10,8),box:new zn(1,1,1),cyl:new sn(1,1,1,10),cone:new On(1,1,8),cap:new un(1,12,6,0,Math.PI*2,0,Math.PI/2),brim:new Fi(1,12).rotateX(Math.PI/2),oct:new uo(1,0)};function et(i,t,e=0,n=0,s=0,r=1,a=r,o=r){const c=new kt(i,t);return c.position.set(e,n,s),c.scale.set(r,a,o),c.castShadow=!0,c}function Ti(i,t,e,n){const s=new R(...i),r=new R(...t),a=et(at.cyl,n);return a.position.copy(s).add(r).multiplyScalar(.5),a.scale.set(e,s.distanceTo(r),e),a.quaternion.setFromUnitVectors(new R(0,1,0),r.clone().sub(s).normalize()),a}function sv(i,t){const e=new Ot,n=et(new sn(i,i*1.05,.09,28),pt("#262422"),0,.045,0);n.receiveShadow=!0;const s=et(new sn(i*.96,i*.96,.012,28),pt("#4c5e2c",{flatShading:!1}),0,.094,0);s.receiveShadow=!0;const r=et(new Sn(i*1.02,.028,4,32).rotateX(Math.PI/2),pt(t,{emissive:t,emissiveIntensity:.35}),0,.07,0);e.add(n,s,r);for(let a=0;a<Math.round(i*9);a++){const o=Math.random()*6,c=Math.sqrt(Math.random())*i*.85;e.add(et(at.cone,pt("#6a8a3a"),Math.cos(o)*c,.13,Math.sin(o)*c,.035,.08,.035))}return e}function rv(i,t,e,n,s=8,r=40){const a=new Ya(i.map(d=>new R(...d))),o=a.computeFrenetFrames(r,!1),c=[],h=[];for(let d=0;d<=r;d++){const v=d/r,x=a.getPointAt(v),M=t+(e-t)*Math.pow(v,.6),C=o.normals[d],w=o.binormals[d];for(let A=0;A<=s;A++){const U=A/s*Math.PI*2,y=Math.cos(U),b=Math.sin(U);c.push(x.x+M*(y*C.x+b*w.x),x.y+M*(y*C.y+b*w.y),x.z+M*(y*C.z+b*w.z))}}for(let d=0;d<r;d++)for(let v=0;v<s;v++){const x=d*(s+1)+v,M=x+s+1;h.push(x,x+1,M,M,x+1,M+1)}const l=a.getPointAt(0),u=c.length/3;c.push(l.x,l.y,l.z);for(let d=0;d<s;d++)h.push(u,d+1,d);const f=a.getPointAt(1),p=c.length/3;c.push(f.x,f.y,f.z);const _=r*(s+1);for(let d=0;d<s;d++)h.push(p,_+d,_+d+1);const g=new Ee;g.setAttribute("position",new ie(c,3)),g.setIndex(h),g.computeVertexNormals();const m=new kt(g,n);return m.castShadow=!0,m}function ds({fur:i="#c96a2d",belly:t="#f1dcb5",hat:e="acorn",hatColor:n="#6e4a2a",tailUp:s=1}={}){const r=new Ot,a=new Ot;r.add(a);const o=pt(i),c=pt(t),h=pt("#1b1410");for(const d of[-1,1])a.add(et(at.ico,o,d*.1,.05,.07,.08,.045,.13)),a.add(et(at.ico,o,d*.12,.17,-.02,.14));a.add(et(at.ico,o,0,.38,0,.21,.28,.19)),a.add(et(at.ico,c,0,.36,.1,.14,.2,.09));const l=new Ot;l.position.set(0,.72,.05),a.add(l),l.add(et(at.ico,o,0,0,0,.17)),l.add(et(at.ico,c,0,-.05,.12,.09,.075,.08)),l.add(et(at.sph,h,0,-.02,.2,.028));for(const d of[-1,1]){l.add(et(at.sph,h,d*.075,.04,.13,.034)),l.add(et(at.sph,pt("#ffffff"),d*.068,.055,.155,.01));const v=et(at.cone,o,d*.09,.16,-.02,.05,.13,.04);v.rotation.z=-d*.25,l.add(v);const x=et(at.cone,pt(js(i,-.25)),d*.1,.25,-.02,.025,.07,.02);x.rotation.z=-d*.3,l.add(x)}e==="acorn"&&(l.add(et(at.cap,pt(n),0,.07,0,.19,.13,.19)),l.add(et(at.brim,pt(n),0,.07,0,.19,1,.19)),l.add(et(at.cyl,pt(js(n,-.2)),0,.22,0,.02,.06,.02)));const u=new Ot;u.position.set(0,.22,-.18),a.add(u);const f=new Ya([[0,0,0],[0,.2,-.26],[0,.55*s,-.32],[0,.82*s,-.22],[0,.93*s,-.02]].map(d=>new R(...d))),p=pt(js(i,.08)),_=pt(js(i,.2)),g=12;for(let d=0;d<g;d++){const v=d/(g-1),x=.085+Math.sin(Math.min(1,v*1.15)*Math.PI)*.11,M=f.getPointAt(v);u.add(et(at.ico,v>.75?_:p,M.x,M.y,M.z,x,x*1.1,x))}const m=[];for(const d of[-1,1]){const v=new Ot;v.position.set(d*.17,.52,.04),v.add(et(at.ico,o,0,-.1,0,.05,.12,.05));const x=new Ot;x.position.set(0,-.21,0),x.add(et(at.ico,o,0,0,0,.045)),v.add(x),v.userData.hand=x,v.rotation.x=-.9,a.add(v),m.push(v)}return r.userData.anim={kind:"squirrel",body:a,tail:u,head:l,armL:m[0],armR:m[1]},r}function ps({scale:i="#3f8f4a",belly:t="#d9cf86",hood:e=null,hoodSize:n=1,long:s=!1,thick:r=1}={}){const a=new Ot,o=new Ot;a.add(o);const c=pt(i),h=pt(t);let l;if(s)l=[[.05,.05,-.9],[-.18,.06,-.62],[.16,.07,-.34],[-.06,.1,-.08],[0,.26,.02],[0,.4,.03]];else{l=[];for(let g=0;g<=10;g++){const m=g/10,d=-.6+m*Math.PI*2.3,v=.3-m*.17;l.push([Math.cos(d)*v,.06+m*.1,Math.sin(d)*v-.04])}l.push([0,.3,.02],[0,.42,.03])}o.add(rv(l,.025,.115*r,c));const u=et(new Ka(.12*r,.2,3,8),c,0,.53,.04);u.rotation.x=.12,o.add(u),o.add(et(at.ico,h,0,.5,.12*r,.085*r,.17,.05));const f=new Ot;if(f.position.set(0,.79,.08),o.add(f),e){const g=et(at.ico,pt(e),0,-.02,-.07,.21*n,.24*n,.05);f.add(g);for(const m of[-1,1])f.add(et(at.sph,pt(t),m*.08*n,.02,-.12,.035*n,.035*n,.01))}f.add(et(at.ico,c,0,0,.02,.11,.09,.15)),f.add(et(at.ico,h,0,-.04,.06,.08,.04,.11));for(const g of[-1,1])f.add(et(at.sph,pt("#ffd23a",{emissive:"#b08000",emissiveIntensity:.4}),g*.065,.035,.09,.03)),f.add(et(at.sph,pt("#111111"),g*.079,.037,.1,.008,.024,.012));const p=new Ot;p.position.set(0,-.03,.16);for(const g of[-1,1]){const m=et(at.cyl,pt("#d0304a"),g*.012,0,.05,.008,.1,.008);m.rotation.x=Math.PI/2,m.rotation.z=g*.3,p.add(m)}p.scale.setScalar(.001),f.add(p);const _=[];for(const g of[-1,1]){const m=new Ot;m.position.set(g*.15*r,.64,.05),m.add(et(at.ico,c,0,-.1,0,.045*r,.12,.045*r));const d=new Ot;d.position.set(0,-.21,0),d.add(et(at.ico,c,0,0,0,.042*r)),m.add(d),m.userData.hand=d,m.rotation.x=-.9,o.add(m),_.push(m)}return a.userData.anim={kind:"naga",body:o,head:f,tongue:p,armL:_[0],armR:_[1]},a}const Ys=()=>pt("#7a5232");function ov(i=1.1,t="#c9a24a"){const e=new Ot;return e.add(et(at.cyl,Ys(),0,0,0,.022,i,.022)),e.add(et(at.cone,Xe(t),0,i/2+.07,0,.04,.14,.04)),e}function hh(i,t,e){const n=new Ot,s=et(at.cyl,t,0,0,0,i,.04,i);return s.rotation.x=Math.PI/2,n.add(s),n.add(et(at.sph,e,0,0,.03,i*.25,i*.25,i*.15)),n}const js=(i,t)=>{const e=new $t(i),n={};return e.getHSL(n),e.setHSL(n.h,n.s,Math.max(0,Math.min(1,n.l+t))),"#"+e.getHexString()};function Yn(i,t,e=.9){i.userData.hand.add(t),t.rotation.x=e}function uh(i,t,e,n){const s=new Ot,r=et(at.cyl,pt("#5a3a22"),0,0,0,i,.1,i);r.rotation.z=Math.PI/2;const a=et(at.cyl,Xe("#444"),0,0,0,i*.3,.13,i*.3);return a.rotation.z=Math.PI/2,s.add(r,a),s.position.set(t,e,n),s}const av={nutkin(){const i=ds({fur:"#cf6d2a",hatColor:"#6a4a26"}),t=i.userData.anim,e=et(at.cone,pt("#5f8f2e"),0,.45,-.06,.25,.42,.2);e.rotation.x=.15,t.body.add(e);const n=new Ot;return n.add(Ti([0,-.08,0],[0,.04,0],.018,Ys())),n.add(Ti([0,.04,0],[-.05,.13,0],.014,Ys())),n.add(Ti([0,.04,0],[.05,.13,0],.014,Ys())),Yn(t.armR,n,1.4),t.armR.rotation.x=-1.3,i},grenadier(){const i=ds({fur:"#a9552a",hatColor:"#4f3a22"}),t=i.userData.anim,e=et(new Sn(.21,.025,4,16),pt("#4a3020"),0,.4,.02);e.rotation.set(.1,0,.75),e.scale.z=.8,t.body.add(e);for(let s=0;s<4;s++){const r=-.7+s*.45;t.body.add(et(at.sph,pt("#8a5a2a"),Math.sin(r)*.21*.7,.4+Math.cos(r)*.21*.7,.17,.045,.055,.045))}for(const s of[-1,1])t.head.add(et(new Sn(.04,.012,4,10),Xe("#c9a24a"),s*.07,.07,.14));const n=new Ot;return n.add(et(at.sph,pt("#8a5a2a"),0,0,0,.06,.07,.06)),n.add(et(at.cap,pt("#4f3a22"),0,.03,0,.065,.04,.065)),n.add(et(at.brim,pt("#4f3a22"),0,.03,0,.065,1,.065)),n.add(et(at.sph,wi("#ffb030"),0,.1,0,.022)),Yn(t.armR,n,0),t.armR.rotation.x=2.3,i},oakguard(){const i=ds({fur:"#8a5a35",hatColor:"#5a3c22"}),t=i.userData.anim;t.body.add(et(at.ico,pt("#5b4330"),0,.42,.05,.2,.22,.16));const e=et(at.cone,pt("#c0302a"),0,.3,-.05,.03,.18,.08);e.rotation.x=-.5,t.head.add(e);const n=hh(.22,pt("#6b4a2e"),pt("#3e7a2a"));Yn(t.armL,n,.9),n.position.set(-.02,0,.08),t.armL.rotation.set(-.6,0,.3);const s=new Ot;return s.add(et(at.cyl,Ys(),0,.2,0,.022,1.15,.022)),s.add(et(at.box,Xe("#a8b0b8"),.07,.62,0,.12,.16,.02)),s.add(et(at.cone,pt("#6b4a26"),0,.85,0,.06,.18,.06)),Yn(t.armR,s,.9),i},glider(){const i=ds({fur:"#9a8a78",belly:"#efe5d5",hat:"none",tailUp:.25}),t=i.userData.anim;for(const n of[-1,1])t.head.add(et(new Sn(.045,.015,4,10),Xe("#c9a24a"),n*.07,.07,.14));t.head.add(et(at.cap,pt("#6b4a2e"),0,.06,-.01,.18,.11,.18)),t.head.add(et(at.brim,pt("#6b4a2e"),0,.06,-.01,.18,1,.18)),t.armL.rotation.set(-.2,0,-1.25),t.armR.rotation.set(-.2,0,1.25);const e=pt(js("#9a8a78",-.12),{side:hn});for(const n of[-1,1]){const s=new Ee;s.setAttribute("position",new ie([n*.15,.52,.02,n*.42,.45,.02,n*.2,.1,0,n*.15,.52,.02,n*.2,.1,0,n*.12,.25,0],3)),s.computeVertexNormals();const r=new kt(s,e);r.castShadow=!0,t.body.add(r)}return t.body.position.y=.7,t.body.rotation.x=.55,t.lift=.7,i.add(et(at.cyl,pt("#cfe8ff",{transparent:!0,opacity:.35}),0,.42,0,.025,.66,.025)),t.tail.rotation.x=-.6,i},trebuchet(){const i=new Ot,t=new Ot;i.add(t);const e=pt("#7a5232"),n=pt("#5f3e24");for(const h of[-1,1])t.add(et(at.box,n,h*.38,.2,0,.1,.1,1.6)),t.add(Ti([h*.38,.2,-.55],[h*.38,1.25,0],.045,e)),t.add(Ti([h*.38,.2,.55],[h*.38,1.25,0],.045,e));t.add(et(at.box,n,0,.2,.6,.86,.08,.1)),t.add(et(at.box,n,0,.2,-.6,.86,.08,.1));const s=et(at.cyl,Xe("#555"),0,1.25,0,.04,.9,.04);s.rotation.z=Math.PI/2,t.add(s);const r=[];for(const h of[-1,1])for(const l of[-.6,.6]){const u=uh(.17,h*.5,.17,l);t.add(u),r.push(u)}const a=new Ot;a.position.set(0,1.25,0),a.add(et(at.box,e,0,0,.35,.08,.08,1.7));const o=et(at.box,n,0,-.18,-.45,.32,.3,.3);a.add(o);for(let h=0;h<5;h++)a.add(et(at.sph,pt("#8a5a2a"),(Math.random()-.5)*.2,-.02,-.45+(Math.random()-.5)*.2,.06));const c=et(at.cone,pt("#6b4a26"),0,0,1.25,.11,.24,.11);c.rotation.x=Math.PI/2,a.add(c),a.add(et(at.sph,wi("#ff8a2a"),0,.06,1.25,.05)),a.rotation.x=.75,a.rotation.y=Math.PI,t.add(a);for(const h of[-1,1]){const l=ds({fur:"#c96a2d"});l.scale.setScalar(.72),l.position.set(h*.72,.05,-.25),l.rotation.y=-h*.5,l.userData.anim.armR.rotation.x=-2.2,t.add(l)}a.userData.keep=!0;for(const h of r)h.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:r,throwArm:a,rest:.75},i},elder(){const i=ds({fur:"#a9a197",belly:"#f4efe6",hat:"none"}),t=i.userData.anim;i.scale.setScalar(1.28);const e=et(new On(.3,.55,10,1,!0),pt("#5a6b34",{side:hn}),0,.3,0);t.body.add(e),t.head.add(et(at.cone,pt("#f4efe6"),0,-.14,.15,.06,.16,.04).rotateX(Math.PI));for(let s=0;s<7;s++){const r=s/7*Math.PI*2,a=et(at.cone,pt(s%2?"#d08a2c":"#6aa646"),Math.cos(r)*.15,.12,Math.sin(r)*.15,.035,.12,.02);a.rotation.set(Math.sin(r)*.4,0,-Math.cos(r)*.4),t.head.add(a)}const n=new Ot;n.add(et(at.cyl,pt("#5a3d24"),0,.25,0,.025,1,.025)),n.add(et(at.oct,wi("#7dff8a"),0,.82,0,.07,.11,.07));for(let s=0;s<3;s++){const r=s/3*Math.PI*2;n.add(Ti([0,.7,0],[Math.cos(r)*.07,.86,Math.sin(r)*.07],.012,pt("#5a3d24")))}return Yn(t.armL,n,.9),t.armL.rotation.x=-.6,t.gem=n.children[1],t.gem.userData.keep=!0,i},scaleguard(){const i=ps({scale:"#3f8f4a",belly:"#d9cf86"}),t=i.userData.anim;t.head.add(et(at.cap,Xe("#b8862e"),0,.04,.01,.12,.09,.15)),t.head.add(et(at.brim,Xe("#b8862e"),0,.04,.01,.12,1,.15)),t.head.add(et(at.box,Xe("#b8862e"),0,.12,-.02,.015,.06,.18)),Yn(t.armR,ov(1.15),.9);const e=hh(.2,Xe("#a8762a"),Xe("#e0b050"));return Yn(t.armL,e,.9),e.position.z=.06,t.armL.rotation.set(-.7,0,.35),i},spitter(){const i=ps({scale:"#2f8f86",belly:"#e0d890",hood:"#5a2f7a",hoodSize:1.45}),t=i.userData.anim;return t.head.add(et(at.sph,wi("#8aff5a"),0,-.04,.16,.035)),t.body.add(et(at.ico,pt("#7a8a3a"),.17,.38,.05,.08,.1,.08)),t.body.add(et(at.sph,wi("#8aff5a"),.17,.48,.05,.03)),t.armL.rotation.x=-.5,t.armR.rotation.x=-.5,i},sidewinder(){const i=ps({scale:"#c2a061",belly:"#efe0b0",long:!0}),t=i.userData.anim;for(let e=0;e<6;e++)t.body.add(et(at.oct,pt("#6b4a2a"),0,.12+e*.07,-.05-e*.02,.04,.03,.04));for(const e of[-1,1]){const n=et(at.cone,pt("#8a6a3a"),e*.06,.08,.05,.02,.07,.02);n.rotation.z=-e*.4,t.head.add(n);const s=et(new Sn(.13,.014,4,12,Math.PI*.9),Xe("#c8ccd0"),0,.08,.08);s.rotation.y=Math.PI/2,Yn(e<0?t.armL:t.armR,s,.4)}return t.armL.rotation.set(-1.3,0,.3),t.armR.rotation.set(-1.3,0,-.3),t.body.rotation.x=.12,i},brute(){const i=ps({scale:"#4f6e2a",belly:"#c8b870",thick:1.35}),t=i.userData.anim;i.scale.setScalar(2.15);for(let e=0;e<7;e++){const n=et(at.cone,pt("#e8dcc0"),0,.45+e*.06,-.12-(e<3?0:(e-3)*.01),.02,.07,.02);n.rotation.x=-1.1,t.body.add(n)}for(const e of[-1,1]){const n=et(at.cone,pt("#e8dcc0"),e*.07,.08,-.03,.025,.12,.025);n.rotation.set(-.6,0,-e*.6),t.head.add(n),t.body.add(et(new Sn(.06,.015,4,10).rotateX(Math.PI/2),Xe("#b8862e"),e*.2,.5,.05))}return t.armL.rotation.set(-1.2,0,.5),t.armR.rotation.set(-1.2,0,-.5),i},engine(){const i=new Ot,t=new Ot;i.add(t);const e=pt("#4a3a2a"),n=pt("#3a2c20");t.add(et(at.box,e,0,.36,0,.8,.22,1.35));const s=[];for(const c of[-1,1])for(const h of[-.45,.45]){const l=uh(.21,c*.47,.21,h);t.add(l),s.push(l)}const r=et(at.ico,pt("#d8cfb0"),0,.55,.78,.2,.16,.28);t.add(r);for(const c of[-1,1])t.add(et(at.cone,pt("#f4ecd8"),c*.09,.43,.92,.025,.12,.025).rotateX(Math.PI)),t.add(et(at.sph,wi("#8aff5a"),c*.1,.62,.88,.035));for(const c of[-1,1])t.add(Ti([c*.3,.45,-.3],[c*.2,1.05,-.1],.04,n));const a=new Ot;a.position.set(0,1.05,-.1),a.add(et(at.box,e,0,0,.35,.08,.08,.9)),a.add(et(at.cap,pt("#3a2c20",{side:hn}),0,.02,.8,.14,.08,.14).rotateX(Math.PI));const o=et(at.sph,pt("#7dff5a",{emissive:"#4ad02a",emissiveIntensity:1.1,transparent:!0,opacity:.85,roughness:.15}),0,.12,.8,.14);o.userData.keep=!0,a.add(o),a.rotation.x=-.55,t.add(a);for(let c=0;c<3;c++)t.add(et(at.sph,pt("#7dff5a",{emissive:"#3ab02a",emissiveIntensity:.9}),-.2+c*.2,.55,-.55,.08));for(const c of[-1,1]){const h=ps({scale:"#3f8f4a",belly:"#d9cf86"});h.scale.setScalar(.72),h.position.set(c*.72,.05,-.35),h.rotation.y=-c*.5,t.add(h)}a.userData.keep=!0;for(const c of s)c.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:s,throwArm:a,rest:-.55,globe:o},i},hierophant(){const i=ps({scale:"#5e3a8c",belly:"#e6c870",hood:"#3a2060",hoodSize:1.7}),t=i.userData.anim;i.scale.setScalar(1.32);for(let n=0;n<5;n++){const s=(n/4-.5)*1.6,r=et(at.cone,Xe("#e0b040"),Math.sin(s)*.1,.12+Math.cos(s)*.04,-.02,.02,.12,.02);r.rotation.z=-s*.5,t.head.add(r)}for(const n of[-1,1])t.body.add(et(new Sn(.05,.014,4,10).rotateX(Math.PI/2),Xe("#e0b040"),n*.15,.45,.05));const e=new Ot;return e.add(et(at.cyl,pt("#2a1a40"),0,.25,0,.022,1,.022)),e.add(et(at.sph,wi("#c070ff"),0,.82,0,.08)),e.add(et(new Sn(.1,.012,4,14),Xe("#e0b040"),0,.82,0)),Yn(t.armL,e,.9),t.armL.rotation.x=-.6,t.gem=e.children[1],t.gem.userData.keep=!0,i}};function cv(i,t,e){const n=new Ot;n.add(sv(t.base,e));const s=av[i]();return s.position.y=t.big?.09:.06,s.userData.y0=s.position.y,n.add(s),n.userData.fig=s,n.userData.anim=s.userData.anim,n.userData.phase=Math.random()*10,La(n.children[0]),La(s),n.traverse(r=>{r.isMesh&&(r.castShadow=!0)}),n.children[0].traverse(r=>{r.isMesh&&(r.receiveShadow=!0)}),n}function lv(i){for(const t of["position","normal"]){const e=i.getAttribute(t);for(let n=0;n<e.count;n+=3){const s=e.getX(n+1),r=e.getY(n+1),a=e.getZ(n+1);e.setXYZ(n+1,e.getX(n+2),e.getY(n+2),e.getZ(n+2)),e.setXYZ(n+2,s,r,a)}}}const ga=new Map;function hv(i){return[i.metalness,i.roughness,i.emissiveIntensity>0?i.emissive.getHex():0,i.emissiveIntensity,i.transparent,i.opacity,i.side,i.flatShading].join("|")}function La(i){i.updateMatrixWorld(!0);const t=new ce().copy(i.matrixWorld).invert(),e=new ce,n=new Map,s=[],r=a=>{for(const o of a.children){if(o.userData.keep){La(o);continue}if(o.isMesh){const c=o.material,h=hv(c);n.has(h)||n.set(h,{m:c,geos:[]});const l=o.geometry.index?o.geometry.toNonIndexed():o.geometry,u=new Ee;u.setAttribute("position",l.getAttribute("position").clone()),u.setAttribute("normal",l.getAttribute("normal").clone()),u.applyMatrix4(e.multiplyMatrices(t,o.matrixWorld)),e.determinant()<0&&lv(u);const f=u.getAttribute("position").count,p=new Float32Array(f*3);for(let _=0;_<f;_++)p.set([c.color.r,c.color.g,c.color.b],_*3);u.setAttribute("color",new fn(p,3)),n.get(h).geos.push(u),s.push(o)}r(o)}};r(i);for(const a of s)a.parent.remove(a);for(const[a,{m:o,geos:c}]of n)ga.has(a)||ga.set(a,new wn({vertexColors:!0,metalness:o.metalness,roughness:o.roughness,flatShading:o.flatShading,emissive:o.emissive,emissiveIntensity:o.emissiveIntensity,transparent:o.transparent,opacity:o.opacity,side:o.side})),i.add(new kt(iv(c),ga.get(a)))}const ni={nutkin:"shooter",grenadier:"shooter",oakguard:"melee",glider:"raider",trebuchet:"artillery",elder:"hero",scaleguard:"line",spitter:"shooter",sidewinder:"melee",brute:"melee",engine:"artillery",hierophant:"hero"},Ds=["melee","raider","line","shooter","hero","artillery"];async function hu(i,t,e){e==="move"?await uv(i,t):e==="shoot"?await fv(i,t):e==="charge"&&await dv(i,t)}const uu=i=>i.t.pts*i.alive/i.t.models;function Ni(i,t){return i.t.melee?ro(i.alive*i.t.A,sr(i.t.WS,i.mesmerized?1:0),i.t.melee,t,!1).value:0}function fu(i,t,e,n,s){var h;const r=t.t.ranged;if(!r||Math.hypot(e.pos.x-n.x,e.pos.z-n.z)-t.r-e.r>r.range||i.isEngaged(e)&&!r.spell)return 0;const o=i.sight(t,e,n);if(!o.visible&&!r.indirect&&!r.mesmerize)return 0;if(r.mesmerize)return o.visible?Bi(r.spell)*(uu(e)*.25+Math.min(2,e.alive)*e.t.pts*.08+((h=e.t.ranged)!=null&&h.blast?8:0)):0;let c=0;if(r.heavy&&s&&c++,r.indirect&&!o.visible&&c++,r.blast){const l=r.spell?Bi(r.spell):Xr(sr(t.t.BS,c)),u=e.t.big?3:Math.max(1,Math.min(e.alive,Math.round(e.alive*Math.min(1,r.blast*r.blast/(e.r*e.r))*.8)));return Ls(t,r,!1)*l*ro(u,1,r,e,o.cover).value}return ro(Ls(t,r,!1),sr(t.t.BS,c),r,e,o.cover).value}async function uv(i,t){const e=i.units.filter(s=>s.side===t&&i.alive(s));e.sort((s,r)=>Ds.indexOf(ni[s.key])-Ds.indexOf(ni[r.key]));const n=new Set;for(const s of e){if(!i.alive(s)||s.flags.moved)continue;const r=ni[s.key];if(i.isEngaged(s)){const l=i.engagedWith(s),u=l.reduce((m,d)=>m+Ni(d,s),0),f=l.reduce((m,d)=>Math.max(m,Ni(s,d)),0);if(r==="melee"||r==="line"||f>=u*.8)continue;const p=i.movePlan(s);let _=-1,g=-1/0;for(let m=0;m<i.nav.N;m+=2){if(!i.validEnd(p,m))continue;const d=i.nav.x(m),v=i.nav.z(m),x=Math.min(...i.enemiesOf(s).map(M=>Math.hypot(M.pos.x-d,M.pos.z-v)-M.r));x>g&&(g=x,_=m)}_>=0&&(i.focus(s.pos.x,s.pos.z),await i.doMove(s,_,p));continue}let a=i.movePlan(s,s.flags.advanced?s.flags.advRoll:0),o=fh(i,s,a,n);const c=Math.min(...i.enemiesOf(s).map(l=>i.gap(s,l)));let h=!1;if(r==="melee"||r==="line"||r==="raider"?h=c>s.t.M+8&&!(r==="line"&&o.onObjective)&&!(r==="raider"&&o.canShoot):r==="shooter"&&(h=!o.canShoot&&!o.onObjective&&(s.t.ranged.assault||c>s.t.ranged.range+s.t.M+3)),h&&!s.flags.advanced){i.focus(s.pos.x,s.pos.z);const l=await i.doAdvance(s);a=i.movePlan(s,l);const u=fh(i,s,a,n);u.cell>=0&&(o=u)}o.obj>=0&&n.add(o.obj),o.cell>=0&&o.dist>.4?(i.focus(s.pos.x,s.pos.z),await i.doMove(s,o.cell,a)):s.flags.advanced&&(s.flags.moved=!0),await qe(.05)}}function fh(i,t,e,n){const{nav:s}=i,r=i.enemiesOf(t),a=i.friendsOf(t),o=i.objectives.map(p=>i.controlOf(p)),c=ni[t.key],h={enemies:r,friends:a,owners:o,claimed:n,role:c};let l={cell:-1,score:dh(i,t,t.pos.x,t.pos.z,h,!1),dist:0,...h.last};const u=t.t.M>8?3:2,f=e.res;for(let p=0;p<s.nz;p+=u)for(let _=p/u%2?1:0;_<s.nx;_+=u){const g=p*s.nx+_;if(!isFinite(f.dist[g])||!i.validEnd(e,g))continue;const m=s.x(g),d=s.z(g),v=dh(i,t,m,d,h,!0)+er()*.05;v>l.score&&(l={cell:g,score:v,dist:Math.hypot(m-t.pos.x,d-t.pos.z),...h.last})}return l}function dh(i,t,e,n,s,r){const{enemies:a,friends:o,owners:c,claimed:h,role:l}=s,u=t.t,f={x:e,z:n},p=r&&Math.hypot(e-t.pos.x,n-t.pos.z)>.3;let _=0,g=!1,m=-1;if(u.OC>0){const M=l==="line"||l==="shooter"?5:l==="melee"?2:2.5;let C=0;for(const w of i.objectives){const A=Math.hypot(w.x-e,w.z-n),U=c[w.i]===t.side?.45:1,y=h.has(w.i)?.25:1;let b;A<=2.6?b=M*U*y*1.4:b=M*U*y*Math.max(0,1-(A-2.6)/16)*.7,b>C&&(C=b,A<=2.6?(g=!0,m=w.i):g||(m=-1))}_+=C}let d=!1;if(u.ranged&&l!=="melee"){let M=0;for(const w of a){const A=fu(i,t,w,f,p);A>M&&(M=A)}M>0&&(d=!0),_+=M*(l==="artillery"?.25:l==="hero"?.12:.18)*(t.flags.advanced&&!u.ranged.assault?0:1)}if(l==="melee"||l==="line"||l==="raider"||l==="hero"){let M=0;for(const w of a){const A=Math.hypot(w.pos.x-e,w.pos.z-n)-t.r-w.r;if(A>fo)continue;const U=A<=1?1:Bi(Math.ceil(A)),y=Ni(w,t)*.4,b=U*(Ni(t,w)-y+(w.t.role==="Artillery"?10:0));b>M&&(M=b)}if(_+=M*(l==="melee"?.3:l==="raider"?.18:l==="hero"?.06:.15),M===0&&l!=="hero"){const w=Math.min(...a.map(A=>Math.hypot(A.pos.x-e,A.pos.z-n)));_-=w*(l==="melee"?.12:.05)}}const v=l==="shooter"||l==="artillery"||l==="hero";for(const M of a){const C=Math.hypot(M.pos.x-e,M.pos.z-n)-t.r-M.r;(!M.t.ranged||M.t.wrecker||M.key==="sidewinder"||M.key==="oakguard")&&C<M.t.M+7&&(_-=Ni(M,t)*(v?.16:.05)*(1-C/(M.t.M+7)))}const x=i.nav.index(e,n);if(x>=0&&i.nav.cover[x]&&(_+=v?1.5:.5),l==="artillery"&&p&&(_-=2.5),l==="hero"){let M=0;for(const w of o)Math.hypot(w.pos.x-e,w.pos.z-n)<=so+w.r&&M++;_+=Math.min(3,M)*.9;const C=Math.min(...a.map(w=>Math.hypot(w.pos.x-e,w.pos.z-n)));C<8&&(_-=(8-C)*.6)}for(const M of o){const C=Math.hypot(M.pos.x-e,M.pos.z-n)-M.r-t.r;C<1.5&&(_-=(1.5-C)*.6)}return s.last={onObjective:g,obj:m,canShoot:d},_}async function fv(i,t){const e=i.units.filter(n=>n.side===t&&i.canShoot(n));e.sort((n,s)=>Ds.indexOf(ni[s.key])-Ds.indexOf(ni[n.key]));for(const n of e){if(!i.canShoot(n))continue;const s=i.shootTargets(n);let r=null,a=.4;for(const o of s){let c=fu(i,n,o,n.pos,n.flags.moved);const h=n.t.ranged;if(h.blast)for(const l of i.units){if(l.side!==n.side||!i.alive(l))continue;const u=Math.hypot(l.pos.x-o.pos.x,l.pos.z-o.pos.z)-l.r;u<h.blast+2.5&&(c-=uu(l)*.25*(1-Math.max(0,u)/(h.blast+2.5)))}h.mesmerize&&o.mesmerized&&(c*=.2),c>a&&(a=c,r=o)}r&&(i.focus((n.pos.x+r.pos.x)/2,(n.pos.z+r.pos.z)/2),await i.doShoot(n,r),await qe(.1))}}async function dv(i,t){const e=i.units.filter(n=>n.side===t&&i.canCharge(n));e.sort((n,s)=>Ds.indexOf(ni[n.key])-Ds.indexOf(ni[s.key]));for(const n of e){if(!i.canCharge(n))continue;const s=ni[n.key];let r=null,a=0;for(const o of i.chargeTargets(n)){const c=i.chargePlan(n,o);if(!c)continue;const h=Bi(c.need),l=Ni(n,o)+(o.t.role==="Artillery"?12:0)+(o.alive<=2?6:0),u=Ni(o,n);if(h<(s==="melee"?.25:s==="line"?.33:s==="raider"?.4:s==="hero"?.5:.6)||(s==="shooter"||s==="hero")&&l<u*1.4)continue;const p=h*(l-u*.4);p>a&&(a=p,r=o)}r&&(i.focus((n.pos.x+r.pos.x)/2,(n.pos.z+r.pos.z)/2),await i.doCharge(n,r,{auto:!0}),await qe(.1))}}let Ze=null,bs=null,Jn=!1;try{Jn=localStorage.getItem("tails-and-scales:muted")==="1"}catch{}function po(){if(!Ze)try{Ze=new(window.AudioContext||window.webkitAudioContext),bs=Ze.createGain(),bs.gain.value=Jn?0:.5,bs.connect(Ze.destination)}catch{Ze=null}}function pv(){Jn=!Jn;try{localStorage.setItem("tails-and-scales:muted",Jn?"1":"0")}catch{}return bs&&(bs.gain.value=Jn?0:.5),Jn}const mv=()=>Jn;function gv(i){const t=Math.floor(Ze.sampleRate*i),e=Ze.createBuffer(1,t,Ze.sampleRate),n=e.getChannelData(0);for(let r=0;r<t;r++)n[r]=Math.random()*2-1;const s=Ze.createBufferSource();return s.buffer=e,s}function du(i,t,e,n,s){const r=Ze.createGain();return r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(n,t+e),r.gain.exponentialRampToValueAtTime(1e-4,t+s),i.connect(r),r.connect(bs),r}function ms({dur:i=.3,freq:t=800,type:e="lowpass",peak:n=.5,delay:s=0,q:r=1}){const a=Ze.currentTime+s,o=gv(i),c=Ze.createBiquadFilter();c.type=e,c.frequency.value=t,c.Q.value=r,o.connect(c),du(c,a,.005,n,i),o.start(a)}function Ai({f0:i=440,f1:t=i,dur:e=.15,type:n="sine",peak:s=.2,delay:r=0}){const a=Ze.currentTime+r,o=Ze.createOscillator();o.type=n,o.frequency.setValueAtTime(i,a),o.frequency.exponentialRampToValueAtTime(Math.max(20,t),a+e),du(o,a,.01,s,e),o.start(a),o.stop(a+e+.05)}const _v={dice(i=3){for(let t=0;t<Math.min(6,i);t++)ms({dur:.04,freq:2500+Math.random()*2e3,type:"bandpass",q:4,peak:.35,delay:t*.035+Math.random()*.02})},boom(i=1){ms({dur:.5+i*.5,freq:300+200/i,peak:.8}),Ai({f0:90,f1:30,dur:.5+i*.3,type:"sine",peak:.5})},shot(){Ai({f0:900,f1:300,dur:.08,type:"triangle",peak:.12})},thwack(){ms({dur:.07,freq:1400,type:"bandpass",q:2,peak:.4})},squeak(){Ai({f0:1400,f1:2400,dur:.12,type:"sine",peak:.12})},hiss(){ms({dur:.35,freq:5e3,type:"highpass",peak:.18})},crumble(){ms({dur:.8,freq:500,peak:.45});for(let i=0;i<4;i++)ms({dur:.05,freq:1200,type:"bandpass",peak:.25,delay:.1+i*.09})},magic(){for(let i=0;i<4;i++)Ai({f0:500+i*220,f1:900+i*300,dur:.25,type:"sine",peak:.08,delay:i*.06})},fizzle(){Ai({f0:600,f1:120,dur:.35,type:"sawtooth",peak:.06})},fanfare(){[523,659,784,1046].forEach((i,t)=>Ai({f0:i,dur:.3,type:"triangle",peak:.15,delay:t*.14}))},click(){Ai({f0:1200,f1:900,dur:.04,type:"square",peak:.04})}},Ce=new Proxy(_v,{get(i,t){return(...e)=>{if(!(!Ze||Jn))try{i[t](...e)}catch{}}}}),{W:he,H:Re}=Dn,At=i=>document.querySelector(i),Wi=new URLSearchParams(location.search),Ye=new Zh({antialias:!0});Ye.setPixelRatio(Wi.has("lowfi")?.5:Math.min(devicePixelRatio,2));Ye.setSize(innerWidth,innerHeight);Ye.shadowMap.enabled=!Wi.has("lowfi");Ye.shadowMap.type=Sh;Ye.toneMapping=bh;Ye.toneMappingExposure=1.05;document.body.prepend(Ye.domElement);const oe=new l_;oe.background=new $t("#1c1712");oe.fog=new Va("#1c1712",70,140);const de=new cn(40,innerWidth/innerHeight,.1,400);de.position.set(0,30,31);const Oe=new U_(de,Ye.domElement);Oe.target.set(0,0,1.5);Oe.enableDamping=!0;Oe.dampingFactor=.08;Oe.maxPolarAngle=1.32;Oe.minDistance=5;Oe.maxDistance=75;Oe.screenSpacePanning=!1;Oe.mouseButtons={LEFT:Kn.ROTATE,MIDDLE:Kn.DOLLY,RIGHT:Kn.PAN};oe.add(new A_("#d6e6ff","#3b2a1a",.85));const Xi=new ru("#fff0d6",2.3);Xi.position.set(-16,34,20);Xi.castShadow=!0;Xi.shadow.mapSize.set(2048,2048);Object.assign(Xi.shadow.camera,{left:-27,right:27,top:22,bottom:-22,near:5,far:90});Xi.shadow.bias=-4e-4;Xi.shadow.normalBias=.02;oe.add(Xi);const pu=new ru("#9fb8ff",.35);pu.position.set(18,12,-16);oe.add(pu);const mu=At("#labels"),ne=new nv(oe,de,mu);function vv(){const i=document.createElement("canvas");i.width=2048,i.height=Math.round(2048*Re/he);const t=i.getContext("2d");t.fillStyle="#5b7a36",t.fillRect(0,0,i.width,i.height);const e=(s,r,a,o,c)=>{for(let h=0;h<r;h++)t.globalAlpha=c*(.4+Math.random()*.6),t.fillStyle=s[Math.random()*s.length|0],t.beginPath(),t.ellipse(Math.random()*i.width,Math.random()*i.height,a+Math.random()*(o-a),a+Math.random()*(o-a),Math.random()*3,0,Math.PI*2),t.fill()};e(["#6a8a40","#4f6c2c","#729347","#55742f","#7f964c"],700,20,90,.35),e(["#7d6b45","#6e5d3a","#8a7650"],40,30,110,.22),e(["#8fa65a","#a4b46a"],300,4,14,.4);for(let s=0;s<14e3;s++)t.globalAlpha=.35,t.fillStyle=Math.random()<.5?"#3f5a24":"#8fae5a",t.fillRect(Math.random()*i.width,Math.random()*i.height,2,4+Math.random()*4);t.globalAlpha=1;const n=new Xa(i);return n.colorSpace=Ae,n.anisotropy=Ye.capabilities.getMaxAnisotropy(),n}function xv(){const i=document.createElement("canvas");i.width=i.height=512;const t=i.getContext("2d");t.fillStyle="#4a3020",t.fillRect(0,0,512,512);for(let n=0;n<260;n++){t.strokeStyle=Math.random()<.5?"rgba(30,18,10,0.35)":"rgba(110,70,40,0.25)",t.lineWidth=1+Math.random()*3;const s=Math.random()*512;t.beginPath(),t.moveTo(0,s);for(let r=0;r<=512;r+=32)t.lineTo(r,s+Math.sin(r*.02+n)*4);t.stroke()}const e=new Xa(i);return e.colorSpace=Ae,e.wrapS=e.wrapT=Yr,e.repeat.set(6,6),e}const Mv=new wn({map:vv(),roughness:.95}),ec=new kt(new vi(he,Re).rotateX(-Math.PI/2),Mv);ec.receiveShadow=!0;oe.add(ec);const nc=new kt(new vi(220,220).rotateX(-Math.PI/2),new wn({map:xv(),roughness:.7}));nc.position.y=-.62;nc.receiveShadow=!0;oe.add(nc);{const i=new wn({color:"#5a3a22",roughness:.6}),t=[[he+1.6,.8,.8,0,-Re/2-.4],[he+1.6,.8,.8,0,Re/2+.4],[.8,.8,Re,-he/2-.4,0],[.8,.8,Re,he/2+.4,0]];for(const[n,s,r,a,o]of t){const c=new kt(new zn(n,s,r),i);c.position.set(a,-.22,o),c.castShadow=c.receiveShadow=!0,oe.add(c)}const e=new kt(new zn(he,.6,Re),i);e.position.y=-.31,oe.add(e)}const oo=[];for(const i of[0,1]){const t=i===0?-1:1,e=new Je({color:be[i].color,transparent:!0,opacity:.07,depthWrite:!1});oo.push(e);const n=new kt(new vi(Dn.deploy,Re).rotateX(-Math.PI/2),e);n.position.set(t*(he/2-Dn.deploy/2),.008,0),n.renderOrder=1,oe.add(n);const s=[];for(let a=-Re/2;a<Re/2;a+=1)s.push(new R(t*(he/2-Dn.deploy),.02,a),new R(t*(he/2-Dn.deploy),.02,a+.5));const r=new f_(new Ee().setFromPoints(s),new Wa({color:be[i].color,transparent:!0,opacity:.5}));oe.add(r)}const gs=new Zs(new On(.035,.13,3),new wn({color:"#ffffff",roughness:1}),700),_s=new Zs(new Fn(.05,0),new wn({roughness:.6}),140);oe.add(gs,_s);function yv(){const i=new ce,t=new Nn,e=new Us,n=new $t;for(let r=0;r<gs.count;r++){const a=(Math.random()-.5)*(he-.4),o=(Math.random()-.5)*(Re-.4),c=.6+Math.random()*1.2;t.setFromEuler(e.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5)),i.compose(new R(a,.08*c,o),t,new R(c,c,c)),gs.setMatrixAt(r,i),gs.setColorAt(r,n.set(["#9cba5a","#a8c464","#b4c86e","#8fae50"][r%4]))}const s=["#f4f0e0","#f2d14a","#d77ad0","#e8e8ff"];for(let r=0;r<_s.count;r++){const a=(Math.random()-.5)*(he-.4),o=(Math.random()-.5)*(Re-.4);i.compose(new R(a,.08,o),t.identity(),new R(1,.6,1)),_s.setMatrixAt(r,i),_s.setColorAt(r,n.set(s[r%s.length]))}gs.instanceMatrix.needsUpdate=_s.instanceMatrix.needsUpdate=!0,gs.instanceColor.needsUpdate=_s.instanceColor.needsUpdate=!0}const Sv=[{x:0,z:0},{x:-9,z:8},{x:9,z:-8},{x:-9,z:-8},{x:9,z:8}],rr=Sv.map((i,t)=>{const e=new Ot;e.position.set(i.x,0,i.z);const n=new kt(new sn(.55,.65,.16,8),pt("#8a8478"));n.position.y=.08,n.castShadow=n.receiveShadow=!0;const s=new kt(new uo(.2,0),new wn({color:"#fff3c0",emissive:"#ffd060",emissiveIntensity:.8,flatShading:!0}));s.position.y=.42;const r=new kt(new sn(.03,.03,2.1,6),pt("#5a3d24"));r.position.set(.35,1.1,0),r.castShadow=!0;const a=new wn({color:"#e8e0d0",side:hn,roughness:.8}),o=new kt(new vi(.8,.5,6,1).translate(.4,0,0),a);o.position.set(.35,1.85,0),o.castShadow=!0;const c=new kt(new Vi(no-.06,no,64).rotateX(-Math.PI/2),new Je({color:"#fff3c0",transparent:!0,opacity:.35,depthWrite:!1}));return c.position.y=.03,e.add(n,s,r,o,c),oe.add(e),{...i,i:t,g:e,gem:s,flag:o,flagMat:a,ring:c,owner:-1}}),dn=new J_(oe,ne,he,Re),ut=new V_(he,Re,.5);dn.onBreak=i=>{i.kind==="block"?Ce.crumble():Ce.thwack()};function zs(){dn.dirty&&(dn.dirty=!1,ut.rebuild(dn.chunks))}const L={seed:Number(Wi.get("seed"))||Math.random()*1e6|0,stage:"title",control:["human","ai"],round:1,active:0,first:0,phase:"move",vp:[0,0],busy:!1,sel:null,reach:null,hover:null,follow:!0,pendingLog:[]};let re=[],bv=1;const ae=i=>i.alive>0,$i=i=>re.filter(t=>t.side!==i.side&&ae(t)),gu=i=>re.filter(t=>t.side===i.side&&ae(t)&&t!==i),mo=(i,t)=>Math.hypot(i.pos.x-t.pos.x,i.pos.z-t.pos.z),gi=(i,t)=>mo(i,t)-i.r-t.r,go=i=>$i(i).filter(t=>gi(i,t)<=Ui+.05),hr=(i,t)=>i.pos.x+t.ox,ur=(i,t)=>i.pos.z+t.oz,pn=i=>go(i).length>0,Bn=i=>L.control[i]==="human";function Ev(i,t){const e=t*2+.16;if(i===1)return[[0,0]];if(i<=4){const r=i===2?e/2:e/(2*Math.sin(Math.PI/i));return Array.from({length:i},(a,o)=>[Math.cos(o/i*Math.PI*2+.4)*r,Math.sin(o/i*Math.PI*2+.4)*r])}const n=i-1,s=Math.max(e,e/(2*Math.sin(Math.PI/n)));return[[0,0],...Array.from({length:n},(r,a)=>[Math.cos(a/n*Math.PI*2+.3)*s,Math.sin(a/n*Math.PI*2+.3)*s])]}function wv(i,t){const e=k_[i],n={id:bv++,key:i,t:e,side:t,name:e.name,pos:{x:0,z:0},facing:t===0?Math.PI/2:-Math.PI/2,models:[],alive:e.models,r:0,flags:{},lost:0,mesmerized:!1,moving:!1};for(let s=0;s<e.models;s++){const r=cv(i,e,be[t].color);oe.add(r),n.models.push({mesh:r,w:e.W,alive:!0,ox:0,oz:0,x:0,z:0,yaw:n.facing,lunge:0,lungeDir:0,lift:0})}return n.ring=new kt(new Vi(.88,1,48).rotateX(-Math.PI/2),new Je({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})),n.ring.position.y=.04,n.ring.renderOrder=2,oe.add(n.ring),n.hit=new kt(new sn(1,1,1,12),new Je({visible:!1})),n.hit.userData.unit=n,oe.add(n.hit),n.label=document.createElement("div"),n.label.className=`ulabel s${t}`,mu.appendChild(n.label),_u(n,!0),n}function _u(i,t=!1){const e=i.models.filter(r=>r.alive),n=Ev(e.length,i.t.base);e.sort((r,a)=>Math.atan2(r.oz,r.ox)-Math.atan2(a.oz,a.ox)),n.forEach(([r,a],o)=>{e[o].ox=r,e[o].oz=a}),i.r=n.reduce((r,[a,o])=>Math.max(r,Math.hypot(a,o)),0)+i.t.base,i.ring.scale.setScalar(i.r+.18);const s=i.t.big?2.4:i.t.fly?1.8:1.3;if(i.hit.scale.set(i.r,s,i.r),t)for(const r of i.models)vu(i,r);Hn(i)}function vu(i,t){t.x=i.pos.x+t.ox,t.z=i.pos.z+t.oz,t.mesh.position.set(t.x,0,t.z),t.mesh.rotation.y=t.yaw}function fr(i,t,e){i.pos.x=t,i.pos.z=e,i.ring.position.x=i.hit.position.x=t,i.ring.position.z=i.hit.position.z=e,i.hit.position.y=i.hit.scale.y/2}function Hn(i){const t=i.models.filter(n=>n.alive);let e=`<span class="nm">${i.t.short}</span>`;i.t.models>1?e+=`<span class="ct">${i.alive}/${i.t.models}</span>`:e+=`<span class="ct">${t[0]?t[0].w:0}/${i.t.W}♥</span>`,i.mesmerized&&(e+='<span class="st" title="Mesmerized">🌀</span>'),ae(i)&&pn(i)&&(e+='<span class="st" title="In combat">⚔</span>'),i.label.innerHTML=e,i.label.style.display=ae(i)?"":"none"}function Tv(){for(const i of re){for(const t of i.models)oe.remove(t.mesh);oe.remove(i.ring,i.hit),i.label.remove()}re=[]}function xu(i,t,e,n,s){let r=null,a=1/0;const o=n===0?-he/2:he/2-Dn.deploy,c=n===0?-he/2+Dn.deploy:he/2;for(let h=0;h<ut.N;h++){const l=ut.x(h),u=ut.z(h);if(l-i.r<o-.01||l+i.r>c+.01||!ut.standable(h,i.r,"walk")||s.some(p=>Math.hypot(p.pos.x-l,p.pos.z-u)<p.r+i.r+.4))continue;const f=Math.hypot(l-t,u-e);f<a&&(a=f,r={x:l,z:u})}return r}function Av(){for(const i of[0,1]){const t=i===0?-1:1,e=re.filter(c=>c.side===i),n=[],s=e.filter(c=>c.t.role==="Artillery"),r=e.filter(c=>c.t.hero),o=[[e.filter(c=>!s.includes(c)&&!r.includes(c)),he/2-Dn.deploy+1.8],[r,he/2-Dn.deploy+3.6],[s,he/2-2.4]];for(const[c,h]of o)c.forEach((l,u)=>{const f=((u+.5)/c.length-.5)*(Re-6)*(i?-1:1),p=xu(l,t*h,f,i,n)||{x:t*h,z:f};fr(l,p.x,p.z),n.push(l);for(const _ of l.models)vu(l,_)})}}const Mu=i=>i.t.big?1.9:i.t.fly?1.5:.95,yu=i=>i.t.big||i.t.fly?1:.55;function _o(i){const t=i.models.filter(n=>n.alive);if(i.t.fly)return!1;let e=0;for(const n of t)ut.cover[ut.index(hr(i,n),ur(i,n))]&&e++;return e*2>=t.length&&e>0}function Su(i,t,e=i.pos){const n={x:e.x,y:Mu(i),z:e.z};let s=0,r=0,a=0;for(const o of t.models){if(!o.alive)continue;a++;const c=dn.los(n,{x:hr(t,o),y:yu(t),z:ur(t,o)});c.blocked||(s++,c.obscure&&r++)}return{visible:s>0,cover:s>0&&(r>0||s<a||_o(t)),seen:s,total:a}}function bu(i){let t=i.t.Ld;for(const e of gu(i))e.t.hero&&mo(i,e)<=so+i.r&&(t=Math.max(t,e.t.Ld));return t}function ic(i){const t=[0,0];for(const e of re)if(ae(e))for(const n of e.models)n.alive&&Math.hypot(hr(e,n)-i.x,ur(e,n)-i.z)<=no+e.t.base&&(t[e.side]+=e.t.OC);return t[0]>t[1]?0:t[1]>t[0]?1:-1}function Eu(i){return i.t.fly?"fly":i.t.wrecker?"wreck":"walk"}function Da(i,t,e=[]){const n=new Uint8Array(ut.N);n.discs=[];for(const s of $i(i)){const r=s.r+i.r+(e.includes(s)?.02:t);n.discs.push({x:s.pos.x,z:s.pos.z,R:r-.02});const a=Math.max(0,Math.floor((s.pos.x-r+he/2)/ut.cell)),o=Math.min(ut.nx-1,Math.floor((s.pos.x+r+he/2)/ut.cell)),c=Math.max(0,Math.floor((s.pos.z-r+Re/2)/ut.cell)),h=Math.min(ut.nz-1,Math.floor((s.pos.z+r+Re/2)/ut.cell));for(let l=c;l<=h;l++)for(let u=a;u<=o;u++){const f=l*ut.nx+u;Math.hypot(ut.x(f)-s.pos.x,ut.z(f)-s.pos.z)<r&&(n[f]=1)}}return n}function wu(i,t=0){zs();const e=pn(i),n=i.t.M+t,s=Eu(i),r=$i(i),a=Da(i,Ui+.05,e?r:[]),o=Da(i,Ui+.05),c=ut.reach(i.pos.x,i.pos.z,{r:i.r,max:n,mode:s==="fly"?"fly":s,forbid:s==="fly"?null:a});return{u:i,res:c,max:n,mode:s,forbid:a,endForbid:o,fallback:e}}function sc(i,t){const{u:e,res:n,mode:s,endForbid:r}=i;if(t<0||!isFinite(n.dist[t])||!ut.standable(t,e.r,s==="wreck"?"wreck":"walk",r))return!1;const a=ut.x(t),o=ut.z(t);for(const c of re)if(c!==e&&ae(c)&&Math.hypot(c.pos.x-a,c.pos.z-o)<c.r+e.r+.08)return!1;return!0}function Tu(i,t,e,n=2.4){let s=-1,r=n;const a=ut.index(t,e);if(a<0)return-1;const o=Math.ceil(n/ut.cell),c=a%ut.nx,h=a/ut.nx|0;for(let l=-o;l<=o;l++)for(let u=-o;u<=o;u++){const f=c+u,p=h+l;if(f<0||p<0||f>=ut.nx||p>=ut.nz)continue;const _=p*ut.nx+f,g=Math.hypot(ut.x(_)-t,ut.z(_)-e);g<r&&sc(i,_)&&(r=g,s=_)}return s}async function Au(i,t,{speed:e=7,fly:n=!1}={}){const s=lu(t);if(s<.05)return;if(i.moving=!0,n)for(const h of i.models)h.flying=!0;const r=[];let a=0;for(let h=1;h<t.length;h++){const l=Math.hypot(t[h].x-t[h-1].x,t[h].z-t[h-1].z);r.push({a:t[h-1],b:t[h],s:a,l}),a+=l}const o=[];if(i.t.wrecker)for(const h of r)for(let l=0;l<h.l;l+=.25)o.push({s:h.s+l,x:h.a.x+(h.b.x-h.a.x)*l/h.l,z:h.a.z+(h.b.z-h.a.z)*l/h.l,dir:Math.atan2(h.b.x-h.a.x,h.b.z-h.a.z)});i.t.wrecker&&o.push({s,x:t[t.length-1].x,z:t[t.length-1].z,dir:r[r.length-1]?Math.atan2(r[r.length-1].b.x-r[r.length-1].a.x,r[r.length-1].b.z-r[r.length-1].a.z):i.facing});let c=0;for(await Pe(s/e+.15,h=>{const l=Math.min(s,h*(s+e*.15)),u=r.find(g=>l<=g.s+g.l)||r[r.length-1],f=u.l>0?(l-u.s)/u.l:1,p=Un(u.a.x,u.b.x,f),_=Un(u.a.z,u.b.z,f);if(i.facing=Math.atan2(u.b.x-u.a.x,u.b.z-u.a.z),fr(i,p,_),n)for(const g of i.models)g.lift=Math.sin(Math.min(1,l/s)*Math.PI)*Math.min(3,s*.3);for(;c<o.length&&o[c].s<=l;)ph(i,o[c++])},Za);c<o.length;)ph(i,o[c++]);if(i.moving=!1,n)for(const h of i.models)h.flying=!1,h.lift=0;await qe(.15)}function ph(i,{x:t,z:e,dir:n}){for(const s of dn.chunks){if(!s.alive||!s.destructible)continue;const r=s.nav||s.shape;Math.hypot(r.x-t,r.z-e)<i.r+Math.max(r.hx,r.hz)*.8&&(dn.hurt(s,99,{x:t-Math.sin(n),z:e-Math.cos(n)}),ne.shake=Math.max(ne.shake,.08))}}async function Ru(i,t,e){L.busy=!0;const n=ut.path(e.res,t,i.r,e.mode==="fly"?null:e.forbid);i.flags.moved=!0,e.fallback&&(i.flags.fellBack=!0);const s=lu(n);Fe(i.side,`<b>${i.t.short}</b> ${e.fallback?"fall back":i.flags.advanced?"advance":"move"} ${s.toFixed(1)}".`),i.t.wrecker&&s>.1&&Ce.boom(.4),await Au(i,n,{fly:e.mode==="fly"}),zs(),ti()}async function Cu(i){L.busy=!0,me.clear(`${i.t.short} — Advance`);const t=$e(1);return await me.row("Advance D6",t,0,{sum:!0,note:`+${t[0]}"`}),i.flags.advanced=!0,i.flags.advRoll=t[0],Fe(i.side,`<b>${i.t.short}</b> advance: +${t[0]}".`),L.busy=!1,t[0]}function rc(i){const t=i.t.ranged;return!(!t||!ae(i)||i.flags.shot||i.mesmerized||i.flags.fellBack||pn(i)||i.flags.advanced&&!t.assault)}function Os(i,t){const e=i.t.ranged,n=gi(i,t);if(n>e.range)return{ok:!1,why:`out of range (${n.toFixed(1)}" / ${e.range}")`};if(pn(t)&&!e.spell)return{ok:!1,why:"locked in combat"};const s=Su(i,t);if(!s.visible&&!e.indirect)return{ok:!1,why:"no line of sight"};let r=0;return e.heavy&&i.flags.moved&&r++,e.indirect&&!s.visible&&r++,{ok:!0,range:n,...s,mod:r,need:sr(i.t.BS,r)}}function Pu(i){return rc(i)?$i(i).filter(t=>Os(i,t).ok):[]}async function Lu(i,t){L.busy=!0;const e=i.t.ranged,n=Os(i,t);if(i.flags.shot=!0,ac(i,t),me.clear(`${i.t.short} → ${t.t.short} · ${e.name}`),e.spell){const _=$e(2),g=_[0]+_[1]>=e.spell;return await me.row(`Cast ${e.spell}+ (2D6)`,_,0,{sum:!0,pass:g}),g?(Ce.magic(),e.mesmerize?Dv(i,t):(Fe(i.side,`<b>${i.t.short}</b> casts <b>${e.name}</b> on ${t.t.short}!`),await Lv(i,t,e),ti())):(Ce.fizzle(),ne.text(Es(i),"Fizzle…","#c8b8ff"),Fe(i.side,`<b>${i.t.short}</b> tries ${e.name} — it fizzles (${_[0]+_[1]}).`),ti())}if(e.blast)return await Cv(i,t,e,n),ti();const s=Ls(i,e,!1);await Rv(i,t,e);const r=$e(s),a=ei(r,n.need);await me.row(`Hit ${n.need}+`,r,n.need);const o=cr(e.S,t.t.T,e.poison),c=$e(a),h=ei(c,o);a&&await me.row(`Wound ${o}+`,c,o);const l=lr(t.t.Sv,e.AP,n.cover),u=$e(h),f=l>6?h:h-ei(u,l);h&&await me.row(l>6?"No save":`Save ${l}+${n.cover?" (cover)":""}`,l>6?[]:u,l,{save:!0});const p=await vo(t,f,e.D,i);Fe(i.side,`<b>${i.t.short}</b> shoot ${t.t.short}: ${a} hit, ${h} wound, ${f} unsaved${p?` — <b>${p} slain</b>`:""}.`),ti()}async function Rv(i,t,e){const n=i.models.filter(o=>o.alive),s=t.models.filter(o=>o.alive),r=[],a=Math.min(10,n.length*e.shots);for(let o=0;o<a;o++){const c=n[o%n.length],h=s[Math.random()*s.length|0],l={x:c.x,y:Mu(i)*.8+c.lift,z:c.z},u={x:h.x+(Math.random()-.5)*.6,y:yu(t)*.8,z:h.z+(Math.random()-.5)*.6};r.push(qe(o*.06).then(()=>(Ce.shot(),ne.projectile(l,u,Du(e.fx)))).then(()=>{for(let f=0;f<5;f++)ne.mote({x:u.x,y:u.y,z:u.z,vx:(Math.random()-.5)*4,vy:Math.random()*3,vz:(Math.random()-.5)*4,size:.05,color:e.fx==="spit"?"#9aff5a":"#ffe0a0",life:.35,g:10})}))}await Promise.all(r)}const li={acorn:new un(.07,6,5),dart:new On(.03,.3,4).rotateX(Math.PI/2),javelin:new sn(.02,.02,.9,4).rotateX(Math.PI/2),spit:new Fn(.08,0),bomb:new un(.11,8,6),pinecone:new On(.2,.42,7),acid:new un(.24,12,8)};function Du(i){const t=e=>new Je({color:e,toneMapped:!1});switch(i){case"acorn":return{mesh:new kt(li.acorn,pt("#8a5a2a")),arc:.08,speed:28};case"dart":return{mesh:new kt(li.dart,pt("#4a6a2a")),arc:.03,speed:34,spin:0};case"javelin":return{mesh:new kt(li.javelin,pt("#8a6a3a")),arc:.18,speed:20,spin:0};case"spit":return{mesh:new kt(li.spit,t("#9aff5a")),arc:.12,speed:18,trail:e=>ne.mote({x:e.x,y:e.y,z:e.z,size:.04,color:"#7aef4a",life:.4,g:6})};case"bomb":return{mesh:new kt(li.bomb,pt("#7a4a22")),arc:.45,speed:14,trail:e=>ne.mote({x:e.x,y:e.y+.1,z:e.z,size:.05,color:"#ffb030",life:.3,g:-1})};case"pinecone":return{mesh:new kt(li.pinecone,pt("#6b4a26",{emissive:"#ff5a10",emissiveIntensity:.6})),arc:.55,speed:18,trail:e=>{ne.mote({x:e.x,y:e.y,z:e.z,size:.12,color:Math.random()<.5?"#ff8a2a":"#ffd36e",life:.4,g:-2}),ne.smoke({x:e.x,y:e.y,z:e.z,size:.14,color:"#3a3430",life:.9})}};case"acid":return{mesh:new kt(li.acid,t("#8aff5a")),arc:.5,speed:15,trail:e=>ne.mote({x:e.x,y:e.y,z:e.z,size:.1,color:Math.random()<.5?"#5be04a":"#c8ff8a",life:.5,g:8})}}return{mesh:new kt(li.acorn,pt("#888"))}}async function Cv(i,t,e,n){const s=Ls(i,e,!1);Fe(i.side,`<b>${i.t.short}</b> fire ${e.name} at ${t.t.short} (${n.need}+${n.visible?"":", unseen"}).`);for(let r=0;r<s&&!(!ae(i)||!ae(t)&&r>0);r++){const a=er()*Math.PI*2,o=er()*t.r*.5,c={x:t.pos.x+Math.cos(a)*o,z:t.pos.z+Math.sin(a)*o},h=ne.ring(c.x,c.z,e.blast,"#ffffff",{hold:!0,fill:.12}),l=$e(1),u=l[0]>=n.need;await me.row(s>1?`Template ${r+1}: hit ${n.need}+`:`Hit ${n.need}+`,l,n.need);let f=c;if(!u){const p=$e(1)[0]+1,_=er()*Math.PI*2;f={x:Math.max(-he/2+.3,Math.min(he/2-.3,c.x+Math.cos(_)*p)),z:Math.max(-Re/2+.3,Math.min(Re/2-.3,c.z+Math.sin(_)*p))},await me.row("Scatter D6+1",[p-1],0,{sum:!0,note:`${p}"`}),ne.text({x:c.x,y:1.5,z:c.z},`scatter ${p}"`,"#ffd36e",{size:15}),await Pe(.35,g=>h.position.set(Un(c.x,f.x,g),.05,Un(c.z,f.z,g)),Ps)}await Pv(i,f,e),h.userData.remove(),await Iu(i,f,e)}}async function Pv(i,t,e){const n=i.models.find(a=>a.alive),s=n.mesh.userData.anim;if(s!=null&&s.throwArm){const a=s.rest;Ce.thwack(),Pe(.25,o=>s.throwArm.rotation.x=a-2.1*Ps(o)).then(()=>Pe(.8,o=>s.throwArm.rotation.x=a-2.1*(1-o))),s.globe&&(s.globe.visible=!1),await qe(.15)}else n.lunge=1,n.lungeDir=Math.atan2(t.x-n.x,t.z-n.z);const r={x:n.x,y:i.t.big?1.8:.9,z:n.z};Ce.shot(),await ne.projectile(r,{x:t.x,y:.15,z:t.z},Du(e.fx)),s!=null&&s.globe&&(s.globe.visible=!0)}async function Lv(i,t,e){const n={x:t.pos.x,z:t.pos.z},s=i.models[0].mesh.userData.anim.gem;if(s){const o=new R;s.getWorldPosition(o);for(let c=0;c<20;c++)ne.mote({x:o.x,y:o.y,z:o.z,vx:(Math.random()-.5)*3,vy:Math.random()*3,vz:(Math.random()-.5)*3,size:.06,color:"#9aff7a",life:.8,g:-1})}const r=[],a=new On(.12,1,5);for(let o=0;o<26;o++){const c=Math.random()*Math.PI*2,h=Math.sqrt(Math.random())*e.blast,l=new kt(a,pt(o%3?"#5a7a2a":"#7a5a2a"));l.position.set(n.x+Math.cos(c)*h,-.6,n.z+Math.sin(c)*h),l.rotation.set((Math.random()-.5)*.6,0,(Math.random()-.5)*.6),l.scale.set(1,.6+Math.random()*1.1,1),l.castShadow=!0,oe.add(l),r.push(l)}await Pe(.3,o=>r.forEach(c=>c.position.y=-.6+Ps(o)*(.3+c.scale.y*.4))),ne.explode(n.x,n.z,e.blast,"thorns"),await Iu(i,n,e),Pe(1.2,o=>r.forEach(c=>c.position.y-=.02*o)).then(()=>r.forEach(o=>oe.remove(o)))}async function Iu(i,t,e){e.fx!=="thorns"&&(ne.explode(t.x,t.z,e.blast,e.fx==="acid"?"acid":"fire"),Ce.boom(e.blast/2)),ne.ring(t.x,t.z,e.blast,e.fx==="acid"?"#8aff5a":"#ff9a4a",{life:1.4,fill:.2});const n=[];for(const r of re){if(!ae(r))continue;const a=r.models.filter(o=>o.alive&&Math.hypot(hr(r,o)-t.x,ur(r,o)-t.z)<=e.blast+r.t.base*.6);a.length&&n.push({v:r,under:a})}for(const{v:r,under:a}of n){let o=a.length;r.t.big&&(o=Math.ceil(tc()/2)+1);const c=r.side===i.side,h=cr(e.S,r.t.T,e.poison),l=$e(o),u=ei(l,h);await me.row(`${c?"⚠ ":""}${r.t.short}: ${o} hit${o>1?"s":""} · wound ${h}+`,l,h);const f=_o(r),p=lr(r.t.Sv,e.AP,f),_=$e(u),g=p>6?u:u-ei(_,p);u&&p<=6&&await me.row(`Save ${p}+${f?" (cover)":""}`,_,p,{save:!0});const m=await vo(r,g,e.D,i,a);Fe(i.side,`${c?"<b>Friendly fire!</b> ":""}${e.name} hits ${r.t.short}: ${u} wound, ${g} unsaved${m?` — <b>${m} slain</b>`:""}.`)}n.length||await qe(.25);const s=dn.blast(t.x,t.z,e.blast,e.scenery||1,{acid:e.fx==="acid"});s.length&&Fe(i.side,`…and ${s.length} piece${s.length>1?"s":""} of scenery ${s.length>1?"are":"is"} wrecked.`),zs()}async function Dv(i,t){const e=Es(i),n=Es(t),s=[];for(let o=0;o<=16;o++){const c=o/16;s.push(qe(c*.3).then(()=>ne.mote({x:Un(e.x,n.x,c),y:Un(e.y,n.y,c)+Math.sin(c*Math.PI)*.8,z:Un(e.z,n.z,c),size:.09,color:"#c070ff",life:.7,g:0})))}await Promise.all(s);for(let o=0;o<3;o++)ne.ring(t.pos.x,t.pos.z,t.r*(.6+o*.35),"#c070ff",{life:1.2+o*.3,fill:.08});const r=Math.ceil(tc()/2);await me.row("Mortal wounds D3",[r],0,{sum:!0,note:`${r}`});const a=await vo(t,r,1,i);t.mesmerized=!0,Hn(t),ne.text(Es(t),"Mesmerized!","#e0a0ff",{size:20}),Fe(i.side,`<b>${i.t.short}</b> mesmerizes ${t.t.short}: ${r} mortal wound${r>1?"s":""}${a?`, <b>${a} slain</b>`:""}. It can't shoot or charge next turn.`),ti()}async function vo(i,t,e,n,s=null){let r=0;for(let a=0;a<t;a++){const o=i.models.filter(u=>u.alive);if(!o.length)break;let c=s?o.filter(u=>s.includes(u)):[];c.length||(c=o);const h=c.filter(u=>u.w<i.t.W);let l;if(h.length)l=h[0];else{const u=f=>Math.hypot(hr(i,f)-n.pos.x,ur(i,f)-n.pos.z);l=c.reduce((f,p)=>u(f)<u(p)?f:p)}l.w-=e,ne.text({x:l.x,y:i.t.big?2.3:1.3,z:l.z},`-${Math.min(e,e+Math.min(0,l.w))}`,"#ff5a4a",{size:i.t.big?24:18}),l.w<=0?(Iv(i,l,n),r++):l.flash=.4,await qe(.06)}return r&&(i.lost+=r,await qe(.25),ae(i)&&Uu(i)),Hn(i),r}function Uu(i){const t=go(i);if(_u(i),!t.length||pn(i))return;const e=t.reduce((r,a)=>gi(i,r)<gi(i,a)?r:a),n=mo(i,e),s=gi(i,e)-(Ui-.3);fr(i,i.pos.x+(e.pos.x-i.pos.x)/n*s,i.pos.z+(e.pos.z-i.pos.z)/n*s)}function Iv(i,t,e){t.alive=!1,t.w=0,i.alive--,t.dying=!0,i.side===0?Ce.squeak():Ce.hiss();const n=t.mesh.userData.fig,s=e?Math.atan2(t.x-e.pos.x,t.z-e.pos.z)-t.yaw:0,r=Math.sin(s)>=0?1:-1;ne.debris(t.x,.5,t.z,i.side===0?["#cf6d2a","#f1dcb5"]:["#3f8f4a","#d9cf86"],6,{power:2,size:.07}),Pe(.6,a=>{n.rotation.z=r*a*1.45,n.position.y=(i.t.big?.09:.06)+Math.sin(a*Math.PI)*.15},Ps).then(()=>qe(1.4)).then(()=>Pe(.8,a=>t.mesh.position.y=-a*1.4)).then(()=>{oe.remove(t.mesh),t.dying=!1}),ae(i)||Nu(i,e)}function Nu(i,t){i.label.style.display="none",i.ring.visible=!1,i.hit.visible=!1,oe.remove(i.hit),L.pendingLog.push([i.side,`<b>${i.t.name}</b> ${i.t.models>1?"are":"is"} destroyed!`,"big"]),ne.text({x:i.pos.x,y:2.2,z:i.pos.z},`${i.t.short} destroyed`,be[t?t.side:1-i.side].color,{size:20,life:2})}function oc(i){var t;return!(!ae(i)||i.flags.charged||i.flags.chargeTried||i.t.role==="Artillery"||i.mesmerized||i.flags.fellBack||pn(i)||i.flags.advanced&&!((t=i.t.abilities)!=null&&t.some(e=>e.startsWith("Sidewind"))))}function dr(i){return oc(i)?$i(i).filter(t=>gi(i,t)<=fo):[]}function xo(i,t){zs();const e=$i(i).filter(_=>_!==t),n=Eu(i),s=Da(i,Ui+.05,[t]),r=ut.reach(i.pos.x,i.pos.z,{r:i.r,max:fo+.5,mode:n,forbid:n==="fly"?null:s}),a=[];let o=-1,c=1/0;const h=t.r+i.r+Ui-.08,l=Math.ceil((h+1)/ut.cell),u=ut.index(t.pos.x,t.pos.z),f=u%ut.nx,p=u/ut.nx|0;for(let _=-l;_<=l;_++)for(let g=-l;g<=l;g++){const m=f+g,d=p+_;if(m<0||d<0||m>=ut.nx||d>=ut.nz)continue;const v=d*ut.nx+m,x=r.dist[v];if(!isFinite(x))continue;const M=Math.hypot(ut.x(v)-t.pos.x,ut.z(v)-t.pos.z);M>h||M<t.r+i.r+.02||ut.standable(v,i.r,n==="wreck"?"wreck":"walk",s)&&(e.some(C=>Math.hypot(ut.x(v)-C.pos.x,ut.z(v)-C.pos.z)<C.r+i.r+Ui)||re.some(C=>C!==i&&C!==t&&ae(C)&&C.side===i.side&&Math.hypot(C.pos.x-ut.x(v),C.pos.z-ut.z(v))<C.r+i.r+.05)||(a.push({i:v,d:x}),x<c&&(o=v,c=x)))}return o<0?null:{cell:o,need:Math.max(2,Math.ceil(c-.01)),res:r,forbid:s,mode:n,dist:c,spots:a}}async function zu(i,t,{auto:e=!1}={}){L.busy=!0;const n=xo(i,t);if(i.flags.chargeTried=!0,me.clear(`${i.t.short} charge ${t.t.short}`),!n)return Fe(i.side,`<b>${i.t.short}</b> can't find a way to ${t.t.short}.`),ti();const s=$e(2),r=s[0]+s[1],a=r>=n.need;if(await me.row(`Charge ${n.need}" (2D6)`,s,0,{sum:!0,pass:a}),ac(i,t),!a)return ne.text(Es(i),"Charge failed","#d0d0d0"),Fe(i.side,`<b>${i.t.short}</b> charge ${t.t.short} — roll ${r}, needed ${n.need}. Failed.`),ti();i.flags.charged=!0,i.flags.chargeTarget=t.id,ne.text(Es(i),"CHARGE!",be[i.side].color,{size:22}),Fe(i.side,`<b>${i.t.short}</b> charge ${t.t.short} — roll ${r} vs ${n.need}. <b>Contact!</b>`);const o=e||!Bn(i.side)?n.cell:await Uv(i,t,n,r),c=ut.path(n.res,o,i.r,n.mode==="fly"?null:n.forbid);await Au(i,c,{speed:11,fly:n.mode==="fly"}),zs();for(const h of[i,t])Hn(h);ti()}function Uv(i,t,e,n){const s=new Uint8Array(ut.N);for(const r of e.spots)r.d<=n+.011&&(s[r.i]=1);return s[e.cell]=1,Ln.visible=!1,Vu(s,[255,150,60],150),Wu(e.cell,i.r),new Promise(r=>{L.chargePick={u:i,target:t,plan:e,rolled:n,ok:s,resolve:r},An()})}function Ou(i,t,e,n=2.4){let s=-1,r=n;for(let a=0;a<ut.N;a++){if(!i.ok[a])continue;const o=Math.hypot(ut.x(a)-t,ut.z(a)-e);o<r&&(r=o,s=a)}return s}function Fu(i){const t=L.chargePick;!t||i<0||!t.ok[i]||(L.chargePick=null,lc(),ke.visible=!1,At("#tooltip").style.display="none",An(),t.resolve(i))}async function mh(i){if(!ae(i)||i.flags.fought)return;const t=go(i);if(!t.length)return;i.flags.fought=!0;const e=t.find(m=>m.id===i.flags.chargeTarget)||t.reduce((m,d)=>m.alive*m.t.W<d.alive*d.t.W?m:d),n=i.t.melee,s=i.mesmerized?1:0,r=sr(i.t.WS,s);ac(i,e),(Bn(i.side)||Bn(e.side)||L.follow)&&ku(i.pos.x*.5+e.pos.x*.5,i.pos.z*.5+e.pos.z*.5),me.clear(`${i.t.short} fight ${e.t.short} · ${n.name}`);for(const m of i.models)m.alive&&(m.lunge=1,m.lungeDir=Math.atan2(e.pos.x-m.x,e.pos.z-m.z));Ce.thwack();const a=Ls(i,n,!0),o=$e(a),c=ei(o,r);await me.row(`Hit ${r}+${s?" (mesmerized)":""}`,o,r);for(let m=0;m<Math.min(c,8);m++){const d=e.models.filter(v=>v.alive)[m%Math.max(1,e.alive)];if(d)for(let v=0;v<4;v++)ne.mote({x:d.x,y:.6,z:d.z,vx:(Math.random()-.5)*5,vy:Math.random()*4,vz:(Math.random()-.5)*5,size:.05,color:"#fff2b0",life:.3,g:12})}const h=cr(n.S,e.t.T,n.poison),l=$e(c),u=ei(l,h);c&&await me.row(`Wound ${h}+`,l,h);const f=lr(e.t.Sv,n.AP,!1),p=$e(u),_=f>6?u:u-ei(p,f);u&&await me.row(f>6?"No save":`Save ${f}+`,f>6?[]:p,f,{save:!0});const g=await vo(e,_,n.D,i);Fe(i.side,`<b>${i.t.short}</b> fight ${e.t.short}: ${c} hit, ${u} wound, ${_} unsaved${g?` — <b>${g} slain</b>`:""}.`),await qe(.3)}async function Nv(i){const t=re.filter(n=>n.side===i&&n.flags.charged&&ae(n));for(const n of t)await mh(n);let e=1-i;for(let n=0;n<30;n++){const s=re.find(a=>a.side===e&&ae(a)&&!a.flags.fought&&pn(a)),r=re.find(a=>a.side===1-e&&ae(a)&&!a.flags.fought&&pn(a));if(!s&&!r)break;s&&await mh(s),e=1-e}for(const n of re)n.flags.fought=!1,Hn(n)}async function zv(){let i=!1;for(const t of re){if(!ae(t)||!t.lost||t.t.models===1)continue;i||me.clear("Morale"),i=!0;const e=bu(t),n=$e(1),s=n[0]+t.lost,r=n[0]===1?0:Math.max(0,s-e);if(await me.row(`${t.t.short}: D6 + ${t.lost} lost vs Ld ${e}`,n,0,{sum:!0,pass:r===0,note:`${s}`}),r){const a=Math.min(r,t.alive),o=t.models.filter(c=>c.alive).slice(-a);for(const c of o)Ov(t,c);Fe(t.side,`<b>${t.t.short}</b> lose their nerve — <b>${a} flee</b>.`),ae(t)?Uu(t):Nu(t,null),Hn(t),await qe(.5)}else Fe(t.side,`<b>${t.t.short}</b> hold firm (${s} vs Ld ${e}).`)}}function Ov(i,t){t.alive=!1,t.w=0,i.alive--,t.dying=!0;const e=i.side===0?-he/2-3:he/2+3,n=t.x,s=t.z;t.fleeing=!0,ne.text({x:t.x,y:1.4,z:t.z},"flees!","#e0e0e0",{size:14}),t.yaw=i.side===0?-Math.PI/2:Math.PI/2,Pe(2.2,r=>{t.x=Un(n,e,r),t.z=s,t.mesh.position.set(t.x,Math.abs(Math.sin(r*30))*.2,t.z),t.mesh.rotation.y=t.yaw}).then(()=>{oe.remove(t.mesh),t.dying=!1})}function ac(i,t){i.facing=Math.atan2(t.pos.x-i.pos.x,t.pos.z-i.pos.z);for(const e of i.models)e.look=Math.atan2(t.pos.x-e.x,t.pos.z-e.z)}const Es=i=>({x:i.pos.x,y:i.t.big?2.6:1.6,z:i.pos.z});function ti(){bo("act"),L.busy=!1;for(const i of re)Hn(i);L.sel&&!Mo(L.sel)?Tn(null):L.sel&&Tn(L.sel),An(),Bu()}function Bu(){for(const i of[0,1])re.some(t=>t.side===i&&ae(t))||(L.wiped=i)}let gh=null;function ku(i,t){if(!L.follow||L.stage!=="battle"||Bn(L.active)&&L.control[0]!==L.control[1])return;const e=Oe.target.clone();if(Math.hypot(i-e.x,t-e.z)<6)return;const s=de.position.clone().sub(e),r=new R(Un(e.x,i,.6),0,Un(e.z,t,.6)),a=gh={};Pe(.9,o=>{gh===a&&(Oe.target.lerpVectors(e,r,o),de.position.copy(Oe.target).add(s))},Za)}const Hu={get units(){return re},objectives:rr,nav:ut,scenery:dn,S:L,alive:ae,enemiesOf:$i,friendsOf:gu,dist:mo,gap:gi,isEngaged:pn,engagedWith:go,sight:Su,inCover:_o,controlOf:ic,movePlan:wu,validEnd:sc,doMove:Ru,doAdvance:Cu,canShoot:rc,shootTargets:Pu,shotInfo:Os,doShoot:Lu,canCharge:oc,chargeTargets:dr,chargePlan:xo,doCharge:zu,focus:ku,leadership:bu};let In=null;async function Fv(){L.stage="battle",Tn(null),oo.forEach(e=>e.opacity=.05),me.clear("Roll-off for the first turn");let i,t;do i=$e(1),t=$e(1),await me.row(be[0].short,i,0,{sum:!0}),await me.row(be[1].short,t,0,{sum:!0});while(i[0]===t[0]);for(L.first=i[0]>t[0]?0:1,Fe(L.first,`<b>${be[L.first].name}</b> win the roll-off and take the first turn.`,"big"),L.round=1;L.round<=io;L.round++){for(let e=0;e<2;e++)if(L.active=(L.first+e)%2,await Bv(L.active),L.wiped!==void 0)return _h();await kv()}_h()}async function Bv(i){for(const t of re)t.lost=0,t.side===i&&(t.flags={});for(const t of cu)if(L.phase=t.key,Tn(null),me.el.classList.remove("show"),An(),await $u(`${be[i].icon} ${be[i].name}`,t.name),t.key==="fight"?re.some(e=>ae(e)&&pn(e))&&await Nv(i):t.key==="morale"?await zv():Hv(i)?Bn(i)?(await new Promise(e=>{In=e,L.waiting=!0,An()}),In=null,L.waiting=!1):await hu(Hu,i,t.key):await qe(.2),bo(`phase ${i}:${t.key}`),Bu(),L.wiped!==void 0)return;for(const t of re)t.side===i&&t.mesmerized&&(t.mesmerized=!1,Hn(t))}async function kv(){const i=[0,0];for(const t of rr){const e=ic(t);e>=0&&(i[e]++,ne.ring(t.x,t.z,no,be[e].color,{life:1.6,fill:.15}))}L.vp[0]+=i[0],L.vp[1]+=i[1],bo(`round ${L.round}`),Fe(-1,`End of round ${L.round}: ${be[0].short} hold ${i[0]} objective${i[0]===1?"":"s"}, ${be[1].short} hold ${i[1]}. Score ${L.vp[0]}–${L.vp[1]}.`,"big"),An(),await $u(`End of round ${L.round}`,`VP ${L.vp[0]} – ${L.vp[1]}`)}function _h(){for(const n of L.pendingLog.splice(0))Ia(...n);bo("over"),L.stage="over",Tn(null),An();let i;L.wiped!==void 0?i=1-L.wiped:i=L.vp[0]>L.vp[1]?0:L.vp[1]>L.vp[0]?1:-1;const t=i<0?"A bloody draw":`${be[i].name} win!`,e=L.wiped!==void 0?`${be[L.wiped].name} have been wiped from the table.`:`Final score ${L.vp[0]} – ${L.vp[1]} after ${io} rounds.`;At("#overTitle").textContent=`${i>=0?be[i].icon+" ":""}${t}`,At("#overWhy").textContent=e,At("#over").classList.remove("hidden"),Ce.fanfare()}const _a=new D_,vh=new ht;let Ks=null;function Gu(i){vh.set(i.clientX/innerWidth*2-1,-(i.clientY/innerHeight)*2+1),_a.setFromCamera(vh,de);const t=_a.intersectObjects(re.filter(ae).map(s=>s.hit),!1),e=t.length?t[0].object.userData.unit:null,n=_a.intersectObject(ec,!1)[0];return{unit:e,ground:n?n.point:null}}function Mo(i){if(!ae(i)||i.side!==L.active)return!1;switch(L.phase){case"move":return!i.flags.moved;case"shoot":return rc(i)&&Pu(i).length>0;case"charge":return oc(i)&&dr(i).length>0}return!1}const Hv=i=>re.some(t=>t.side===i&&Mo(t));Ye.domElement.addEventListener("pointerdown",i=>{po(),Ks={x:i.clientX,y:i.clientY,b:i.button}});Ye.domElement.addEventListener("pointerup",i=>{if(!Ks||i.button!==0)return;const t=Math.hypot(i.clientX-Ks.x,i.clientY-Ks.y);Ks=null,!(t>6)&&Gv(Gu(i))});Ye.domElement.addEventListener("pointerleave",()=>{L.hoverPick=null,L.hover=null,Xu(),hc()});Ye.domElement.addEventListener("pointermove",i=>{L.mouse={x:i.clientX,y:i.clientY},L.hoverPick=Gu(i),Xu()});function cc(){return L.stage==="battle"&&Bn(L.active)&&In&&!L.busy&&!L.auto||L.stage==="deploy"}async function Gv({unit:i,ground:t}){if(At("#tooltip").style.display="none",L.stage==="deploy")return Vv(i,t);if(L.chargePick){t&&Fu(Ou(L.chargePick,t.x,t.z));return}if(!cc()){i&&ws(i);return}const e=L.sel;if(i&&i.side===L.active){Mo(i)?(Ce.click(),Tn(i)):ws(i);return}if(L.phase==="move"&&e&&t){const n=Tu(L.reach,t.x,t.z);n>=0&&(lc(),await Ru(e,n,L.reach));return}if(L.phase==="shoot"&&e&&i&&i.side!==e.side){Os(e,i).ok&&await Lu(e,i);return}if(L.phase==="charge"&&e&&i&&i.side!==e.side){dr(e).includes(i)&&xo(e,i)&&await zu(e,i);return}i?ws(i):!i&&t&&Tn(null)}function Vv(i,t){const e=L.deploySide;if(i&&i.side===e){Ce.click(),L.sel=i,ws(i),hc();return}if(L.sel&&t){const n=L.sel,s=re.filter(a=>a!==n),r=xu(n,t.x,t.z,e,s);if(r&&Math.hypot(r.x-t.x,r.z-t.z)<2.5){fr(n,r.x,r.z),Ce.click();for(const a of re)Hn(a)}}}function Tn(i){L.sel=i,L.reach=null,lc(),i&&L.stage==="battle"&&L.phase==="move"&&!i.flags.moved&&(L.reach=wu(i,i.flags.advanced?i.flags.advRoll:0),Wv(L.reach)),i&&L.phase==="shoot"&&i.t.ranged&&xh(i,i.t.ranged.range),i&&L.phase==="charge"&&xh(i,fo),ws(i),An()}const vs=new Uint8Array(ut.nx*ut.nz*4),yo=new h_(vs,ut.nx,ut.nz,_n);yo.magFilter=en;yo.minFilter=en;const Fs=new kt(new vi(he,Re).rotateX(-Math.PI/2),new Je({map:yo,transparent:!0,depthWrite:!1,toneMapped:!1}));Fs.position.y=.035;Fs.renderOrder=2;Fs.visible=!1;oe.add(Fs);function Wv(i){const t=i.u.flags.advanced,{u:e,res:n,mode:s,endForbid:r}=i,a=new Uint8Array(ut.N);for(let o=0;o<ut.N;o++)isFinite(n.dist[o])&&ut.standable(o,e.r,s==="wreck"?"wreck":"walk",r)&&(a[o]=1);Vu(a,i.fallback?[255,120,90]:t?[255,190,70]:[90,180,255])}function Vu(i,t,e=80){vs.fill(0);for(let n=0;n<ut.N;n++){if(!i[n])continue;const s=n%ut.nx,r=n/ut.nx|0,a=s===0||r===0||s===ut.nx-1||r===ut.nz-1||!i[n-1]||!i[n+1]||!i[n-ut.nx]||!i[n+ut.nx],o=((ut.nz-1-r)*ut.nx+s)*4;vs[o]=t[0],vs[o+1]=t[1],vs[o+2]=t[2],vs[o+3]=a?210:ut.diff[n]?Math.round(e*.7):e}yo.needsUpdate=!0,Fs.visible=!0}function lc(){Fs.visible=!1,Zn.visible=!1,Ln.visible=!1}const Ln=new kt(new Vi(.985,1,96).rotateX(-Math.PI/2),new Je({color:"#ffffff",transparent:!0,opacity:.6,depthWrite:!1,toneMapped:!1}));Ln.position.y=.04;Ln.visible=!1;oe.add(Ln);function xh(i,t){Ln.position.x=i.pos.x,Ln.position.z=i.pos.z,Ln.scale.setScalar(i.r+t),Ln.material.color.set(L.phase==="charge"?"#ffb070":"#ffffff"),Ln.visible=!0}const Zn=new Qh(new Ee,new Wa({color:"#ffffff",transparent:!0,opacity:.9,toneMapped:!1}));Zn.visible=!1;Zn.renderOrder=4;oe.add(Zn);const ke=new kt(new Vi(.9,1,40).rotateX(-Math.PI/2),new Je({color:"#ffffff",transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1}));ke.position.y=.05;ke.visible=!1;oe.add(ke);function Wu(i,t){ke.position.x=ut.x(i),ke.position.z=ut.z(i),ke.scale.setScalar(t),ke.visible=!0}function Xu(){const i=At("#tooltip");i.style.display="none",Zn.visible=!1,ke.visible=!1;const t=L.hoverPick;if(!t){L.chargePick&&Wu(L.chargePick.plan.cell,L.chargePick.u.r);return}L.hover=t.unit;let e="";const n=L.sel;if(L.chargePick&&t.ground){const s=L.chargePick,r=Ou(s,t.ground.x,t.ground.z);if(r>=0){const a=ut.path(s.plan.res,r,s.u.r,s.plan.mode==="fly"?null:s.plan.forbid);Zn.geometry.setFromPoints(a.map(o=>new R(o.x,.08,o.z))),Zn.visible=!0,ke.position.x=ut.x(r),ke.position.z=ut.z(r),ke.scale.setScalar(s.u.r),ke.visible=!0,e=`End charge here · ${s.plan.res.dist[r].toFixed(1)}" of ${s.rolled}"`}else e="✖ out of reach — pick a spot in the orange area"}else if(L.stage==="battle"&&cc()&&n){if(L.phase==="move"&&L.reach&&t.ground&&!t.unit){const s=Tu(L.reach,t.ground.x,t.ground.z);if(s>=0){const r=ut.path(L.reach.res,s,n.r,L.reach.mode==="fly"?null:L.reach.forbid);Zn.geometry.setFromPoints(r.map(a=>new R(a.x,.08,a.z))),Zn.visible=!0,ke.position.x=ut.x(s),ke.position.z=ut.z(s),ke.scale.setScalar(n.r),ke.visible=!0,e=`${L.reach.res.dist[s].toFixed(1)}" of ${L.reach.max}"`}}else if(L.phase==="shoot"&&t.unit&&t.unit.side!==n.side){const s=Os(n,t.unit);e=s.ok?Xv(n,t.unit,s):`✖ ${s.why}`}else if(L.phase==="charge"&&t.unit&&t.unit.side!==n.side)if(!dr(n).includes(t.unit))e=`✖ out of charge range (${gi(n,t.unit).toFixed(1)}")`;else{const s=xo(n,t.unit);e=s?`Charge: need ${s.need}" on 2D6 — ${Math.round(Bi(s.need)*100)}%`:"✖ no route"}}!e&&t.unit&&(e=`${t.unit.t.name} · ${t.unit.t.models>1?`${t.unit.alive}/${t.unit.t.models} models`:`${t.unit.models[0].w}/${t.unit.t.W} wounds`}`),e&&L.mouse&&(i.innerHTML=e,i.style.display="block",i.style.left=L.mouse.x+16+"px",i.style.top=L.mouse.y+14+"px")}function Xv(i,t,e){const n=i.t.ranged;if(n.mesmerize)return`Mesmerize: cast ${n.spell}+ on 2D6 (${Math.round(Bi(n.spell)*100)}%) · D3 mortal wounds`;const s=[];n.spell&&s.push(`Cast ${n.spell}+ (${Math.round(Bi(n.spell)*100)}%)`);const r=Ls(i,n,!1),a=cr(n.S,t.t.T,n.poison),o=lr(t.t.Sv,n.AP,e.cover);s.push(`${r} ${n.blast?`template${r>1?"s":""} (${n.blast}")`:"shots"} · hit ${n.spell?"auto":e.need+"+"} · wound ${a}+ · save ${o>6?"—":o+"+"}`);const c=[];if(c.push(`${e.range.toFixed(1)}"`),e.cover&&c.push("cover"),e.visible?e.seen<e.total&&c.push(`${e.seen}/${e.total} visible`):c.push("unseen (indirect −1)"),n.heavy&&i.flags.moved&&c.push("moved (heavy −1)"),!n.blast){const h=ro(r,e.need,n,t,e.cover);c.push(`≈${h.kills.toFixed(1)} slain`)}return s.push(c.join(" · ")),s.join("<br>")}const $v={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};function qv(i,t){const e=document.createElement("div");e.className=`die ${t}`;for(let n=0;n<9;n++){const s=document.createElement("i");$v[i].includes(n)&&(s.className="on"),e.appendChild(s)}return e}const me={el:At("#tray"),clear(i){this.el.innerHTML="";const t=document.createElement("div");t.className="tray-title",t.textContent=i,this.el.appendChild(t),this.el.classList.add("show")},async row(i,t,e,{sum:n=!1,pass:s,note:r="",save:a=!1}={}){Ce.dice(t.length);const o=document.createElement("div");o.className="tray-row";const c=document.createElement("span");c.className="lbl",c.textContent=i,o.appendChild(c);const h=document.createElement("span");h.className="dice",o.appendChild(h),t.slice(0,30).forEach((f,p)=>{const _=e?f>=e?a?"saved":"ok":"fail":s===!1?"fail":s?"ok":"plain",g=qv(f,_);g.style.animationDelay=`${p*.025/ln.speed}s`,h.appendChild(g)});const u=document.createElement("span");if(u.className="res",e){const f=ei(t,e);u.textContent=a?`${f} saved`:`${f} ✓`,t.length>30&&(u.textContent+=` (of ${t.length})`)}else n&&(u.textContent=r||`= ${t.reduce((f,p)=>f+p,0)}`,s===!0&&u.classList.add("good"),s===!1&&u.classList.add("bad"));for(o.appendChild(u),this.el.appendChild(o);this.el.children.length>7;)this.el.children[1].remove();await qe(.38+Math.min(t.length,14)*.035)}},So=[];function bo(i){const t=re.map(e=>`${e.id}:${e.pos.x.toFixed(3)},${e.pos.z.toFixed(3)},${e.models.map(n=>n.w).join("/")}`).join(" ");So.push(`${i} ${t} chunks:${dn.chunks.filter(e=>e.alive).length} vp:${L.vp.join("-")} rng:${au()}`)}function Fe(i,t,e=""){So.push(`log ${i} ${t.replace(/<[^>]+>/g,"")} rng:${au()}`),Ia(i,t,e);for(const n of L.pendingLog.splice(0))Ia(...n)}function Ia(i,t,e){const n=At("#logList"),s=document.createElement("div");for(s.className=`entry s${i} ${e}`,s.innerHTML=t,n.prepend(s);n.children.length>80;)n.lastChild.remove()}const Mh=["M","WS","BS","S","T","W","A","Ld","Sv","OC"];function ws(i){var o;const t=At("#card");if(!i){t.classList.remove("show");return}const e=i.t,n=c=>c==="M"?`${e.M}"`:["WS","BS","Sv"].includes(c)?`${e[c]}+`:e[c],s=(c,h)=>{if(!c)return"";if(c.mesmerize)return`<div class="wpn"><span>${h} ${c.name}</span><em>spell ${c.spell}+ · ${c.range}" · D3 mortal + mesmerize</em></div>`;const l=[];return c.range&&l.push(`${c.range}"`),c.spell&&l.push(`spell ${c.spell}+`),c.blast?l.push(`blast ${c.blast}" ×${c.shots}`):c.shots&&l.push(`A${c.shots}`),l.push(`S${c.S}`,`AP-${c.AP}`,`D${c.D}`),c.poison&&l.push(`poison ${c.poison}+`),c.indirect&&l.push("indirect"),c.heavy&&l.push("heavy"),c.assault&&l.push("assault"),`<div class="wpn"><span>${h} ${c.name}</span><em>${l.join(" · ")}</em></div>`},r=[];i.flags.moved&&r.push(i.flags.fellBack?"fell back":i.flags.advanced?`advanced +${i.flags.advRoll}"`:"moved"),i.flags.shot&&r.push("shot"),i.flags.charged&&r.push("charged"),i.mesmerized&&r.push("🌀 mesmerized"),ae(i)&&pn(i)&&r.push("⚔ in combat"),ae(i)&&_o(i)&&r.push("🛡 in cover");const a=e.models>1?`${i.alive}/${e.models} models`:`${i.models[0].w}/${e.W} wounds`;t.innerHTML=`
    <div class="card-head s${i.side}"><b>${e.name}</b><span>${be[i.side].short} · ${e.role}</span></div>
    <div class="card-sub">${ae(i)?a:"destroyed"}${r.length?" · "+r.join(" · "):""}</div>
    <table class="stats"><tr>${Mh.map(c=>`<th>${c}</th>`).join("")}</tr><tr>${Mh.map(c=>`<td>${n(c)}</td>`).join("")}</tr></table>
    ${s(e.ranged,(o=e.ranged)!=null&&o.spell?"✦":"➹")}${s({...e.melee,range:0},"⚔")}
    <ul class="abil">${(e.abilities||[]).map(c=>`<li>${c}</li>`).join("")}</ul>`,t.classList.add("show")}function An(){var r,a;At("#vp0").textContent=L.vp[0],At("#vp1").textContent=L.vp[1],At("#round").textContent=L.stage==="deploy"?"Deployment":`Round ${Math.min(L.round,io)} / ${io}`,document.querySelectorAll("#phases .ph").forEach(o=>{o.classList.toggle("on",L.stage==="battle"&&o.dataset.k===L.phase)}),At("#sideA").classList.toggle("active",L.stage==="battle"&&L.active===0),At("#sideB").classList.toggle("active",L.stage==="battle"&&L.active===1);const i=L.stage==="battle"&&Bn(L.active)&&!!In&&!L.auto,t=L.sel,e=!!L.chargePick;At("#endPhase").style.display=i&&!e||L.stage==="deploy"?"":"none",At("#closestSpot").style.display=e?"":"none",At("#endPhase").textContent=L.stage==="deploy"?"Begin battle ▸":`End ${cu.find(o=>o.key===L.phase).name} ▸`,At("#endPhase").disabled=L.busy||L.auto,At("#autoPhase").style.display=i&&!e?"":"none";const n=At("#advance");n.style.display=i&&L.phase==="move"&&t&&!t.flags.moved&&!t.flags.advanced&&!pn(t)?"":"none",n.textContent=`Advance (+D6") — no ${(r=t==null?void 0:t.t.ranged)!=null&&r.assault?"charge":"shooting or charge"} after`,(a=t==null?void 0:t.t.abilities)!=null&&a.some(o=>o.startsWith("Sidewind"))&&(n.textContent='Advance (+D6") — can still charge');let s="";e?s=`Charge! Rolled ${L.chargePick.rolled}" — click the orange area to place ${L.chargePick.u.t.short}, or take the shortest move.`:L.stage==="deploy"?s="Deployment — click one of your units, then click inside your shaded zone to move it there.":L.stage==="battle"&&!Bn(L.active)?s=`${be[L.active].name} (AI) are taking their turn…`:i&&(s={move:t?pn(t)?"Engaged — click inside the red area to fall back (no shooting or charging after).":"Click inside the shaded area to move. Difficult ground costs double.":"Movement — pick a unit with a white ring to move it.",shoot:t?"Click an enemy unit to shoot it. Hover for odds.":"Shooting — pick a unit with a white ring to fire.",charge:t?'Click an enemy within 12" to declare a charge, then roll 2D6.':"Charge — pick a unit to charge with."}[L.phase]||""),At("#hint").textContent=s,At("#hint").style.display=s?"":"none",hc()}function hc(){const i=cc();for(const t of re){if(!ae(t))continue;const e=t.ring.material;let n=0,s="#ffffff";t===L.sel?(n=1,s="#ffe680"):L.stage==="deploy"&&t.side===L.deploySide?n=.5:L.chargePick&&t===L.chargePick.target?(n=.95,s="#ffa040"):i&&L.stage==="battle"&&Mo(t)?n=.75:i&&L.sel&&L.phase==="shoot"&&t.side!==L.sel.side&&Os(L.sel,t).ok?(n=.95,s="#ff5a4a"):i&&L.sel&&L.phase==="charge"&&t.side!==L.sel.side&&dr(L.sel).includes(t)?(n=.95,s="#ffa040"):t===L.hover&&(n=.35),e.opacity=n,e.color.set(s)}}async function $u(i,t){const e=At("#banner");e.innerHTML=`<div class="b1">${i}</div><div class="b2">${t}</div>`,e.classList.remove("show"),e.offsetWidth,e.classList.add("show"),await qe(Bn(L.active)||L.stage!=="battle"?.9:.6)}At("#endPhase").onclick=()=>{var i;if(po(),Ce.click(),L.stage==="deploy")return(i=L.deployDone)==null?void 0:i.call(L);L.busy||L.auto||!In||(Tn(null),In())};At("#closestSpot").onclick=()=>{Ce.click(),L.chargePick&&Fu(L.chargePick.plan.cell)};At("#autoPhase").onclick=async()=>{if(!(L.busy||L.auto||!In)){Tn(null),L.auto=!0,L.busy=!0,An();try{await hu(Hu,L.active,L.phase)}finally{L.auto=!1,L.busy=!1}In==null||In()}};At("#advance").onclick=async()=>{const i=L.sel;!i||L.busy||L.auto||(await Cu(i),Tn(i))};const va=[1,2,4];At("#speed").onclick=()=>{ln.speed=va[(va.indexOf(ln.speed)+1)%va.length],At("#speed").textContent=`⏩ ${ln.speed}×`};At("#follow").onclick=()=>{L.follow=!L.follow,At("#follow").classList.toggle("off",!L.follow)};At("#mute").textContent=mv()?"🔇":"🔊";At("#mute").onclick=()=>{po(),At("#mute").textContent=pv()?"🔇":"🔊"};At("#helpBtn").onclick=()=>At("#help").classList.remove("hidden");At("#helpClose").onclick=()=>At("#help").classList.add("hidden");At("#logToggle").onclick=()=>At("#log").classList.toggle("collapsed");At("#seed").value=L.seed;At("#reroll").onclick=()=>{L.seed=Math.random()*1e6|0,At("#seed").value=L.seed,Eo()};At("#seed").onchange=()=>{L.seed=Number(At("#seed").value)||1,Eo()};document.querySelectorAll("[data-mode]").forEach(i=>{i.onclick=()=>{po(),Ce.click(),qu(i.dataset.mode)}});At("#again").onclick=()=>{At("#over").classList.add("hidden"),At("#title").classList.remove("hidden"),document.body.classList.remove("playing"),L.stage="title",L.titleSpin=!0,L.titleAngle-=ln.time*.035,L.viewShift=1,Eo()};const Cn=new Set;addEventListener("keydown",i=>{i.target.tagName!=="INPUT"&&(Cn.add(i.key.toLowerCase()),i.key==="Escape"&&!L.chargePick&&Tn(null))});addEventListener("keyup",i=>Cn.delete(i.key.toLowerCase()));function Yv(i){const t=new R,e=new R().subVectors(Oe.target,de.position).setY(0).normalize(),n=new R(-e.z,0,e.x);(Cn.has("w")||Cn.has("arrowup"))&&t.add(e),(Cn.has("s")||Cn.has("arrowdown"))&&t.sub(e),(Cn.has("d")||Cn.has("arrowright"))&&t.add(n),(Cn.has("a")||Cn.has("arrowleft"))&&t.sub(n),t.lengthSq()&&(t.normalize().multiplyScalar(i*18),Oe.target.add(t),de.position.add(t))}function Eo(){Tv(),L.vp=[0,0],L.round=1,L.wiped=void 0,L.sel=null,At("#logList").innerHTML="",At("#tray").classList.remove("show"),dn.generate(L.seed,rr,Dn.deploy),dn.dirty=!0,zs(),yv();for(const i of[0,1])for(const t of H_[i])re.push(wv(t,i));Av();for(const i of re)Hn(i);for(const i of rr)Yu(i,-1);ne.clearDecals(),L.pendingLog=[],L.phase="move",L.active=0,L.busy=!1,L.waiting=!1,L.chargePick=null,L.auto=!1,An()}async function qu(i){L.dice=Number(Wi.get("dice"))||Math.random()*1e9|0,B_(L.dice),So.length=0,L.control={bushtail:["human","ai"],serpent:["ai","human"],hotseat:["human","human"],watch:["ai","ai"]}[i],At("#title").classList.add("hidden"),document.body.classList.add("playing"),L.titleSpin=!1;const t=de.position.clone(),e=Oe.target.clone(),n=Zv();innerWidth<700&&At("#log").classList.add("collapsed"),Pe(1.4,s=>{L.viewShift=1-s,de.position.lerpVectors(t,n.pos,s),Oe.target.lerpVectors(e,n.target,s)},Za);for(const s of[0,1])Bn(s)&&(L.stage="deploy",L.deploySide=s,oo[s].opacity=.2,Fe(s,`<b>${be[s].name}</b>: deploy your army.`),An(),await new Promise(r=>L.deployDone=r),oo[s].opacity=.07,L.sel=null,ws(null));Fv()}const jv=new L_,Gr=new R;L.titleSpin=!0;L.titleAngle=-1.02;L.viewShift=1;function Kv(i,t){for(const e of re){for(const n of e.models){if(!n.alive&&!n.dying)continue;const s=n.mesh.userData.anim;if(n.alive){const o=e.pos.x+n.ox,c=e.pos.z+n.oz,h=1-Math.exp(-i*(e.moving?16:7)),l=n.x,u=n.z;n.x+=(o-n.x)*h,n.z+=(c-n.z)*h;const f=Math.hypot(n.x-l,n.z-u)/Math.max(i,1e-4),p=f>.6?Math.atan2(n.x-l,n.z-u):n.look??e.facing;n.yaw+=z_(p-n.yaw)*(1-Math.exp(-i*8)),n.moving=f>.6;let _=0,g=0;if(n.lunge>0){n.lunge=Math.max(0,n.lunge-i*2.5);const m=Math.sin((1-n.lunge)*Math.PI)*.35;_=Math.sin(n.lungeDir)*m,g=Math.cos(n.lungeDir)*m}n.mesh.position.set(n.x+_,n.lift||0,n.z+g),n.mesh.rotation.y=n.yaw}if(!s||!n.alive)continue;const r=t+n.mesh.userData.phase,a=n.mesh.userData.fig;if(s.kind==="squirrel"){const o=n.moving?Math.abs(Math.sin(r*13))*.16:0;a.position.y=a.userData.y0+o,a.scale.y=1+(n.moving?0:Math.sin(r*2.4)*.018),a.rotation.x=n.moving?.12:0}else if(s.kind==="naga")a.rotation.z=Math.sin(r*(n.moving?9:1.4))*(n.moving?.12:.035),a.scale.y=1+Math.sin(r*1.4)*.015;else if(s.kind==="machine"&&n.moving)for(const o of s.wheels)o.rotation.x+=i*6;s.gem&&(s.gem.rotation.y=r*2),n.flash>0&&(n.flash-=i,a.position.x=Math.sin(t*60)*.04*(n.flash>0?1:0))}if(ae(e)&&!Ua){Gr.set(e.pos.x,e.t.big?2.7:e.t.fly?2.3:1.7,e.pos.z).project(de);const n=Gr.z<1;e.label.style.transform=`translate(${(Gr.x*.5+.5)*innerWidth}px, ${(-Gr.y*.5+.5)*innerHeight}px) translate(-50%, -100%)`,e.label.style.visibility=n&&L.stage!=="title"?"visible":"hidden",e.label.classList.toggle("sel",e===L.sel)}}}function Yu(i,t){i.owner=t,i.flagMat.color.set(t<0?"#e8e0d0":be[t].color),i.ring.material.color.set(t<0?"#fff3c0":be[t].color)}function Jv(i,t){for(const e of rr){const n=L.stage==="battle"||L.stage==="over"?ic(e):-1;n!==e.owner&&Yu(e,n),e.gem.rotation.y=t*1.2,e.gem.position.y=.45+Math.sin(t*2+e.i)*.05,e.flag.rotation.y=Math.sin(t*2.2+e.i)*.25,e.ring.material.opacity=.3+Math.sin(t*2+e.i)*.08}}const Ua=Wi.has("fast");function ju(){var r;requestAnimationFrame(ju),Ua&&(ln.speed=1e4);const i=Math.min(jv.getDelta(),.05),t=i*ln.speed;if(ln.time+=t,F_(t),ne.update(t),Kv(t,ln.time),Jv(t,ln.time),L.titleSpin){const a=L.titleAngle+ln.time*.035;de.position.set(-5+Math.sin(a)*25,13,Math.cos(a)*25),Oe.target.set(-5,0,0)}const e=innerWidth>900?L.viewShift:0;e>.001?de.setViewOffset(innerWidth,innerHeight,-innerWidth*.21*e,0,innerWidth,innerHeight):(r=de.view)!=null&&r.enabled&&de.clearViewOffset(),Yv(i),Oe.update();const n=ne.shake,s=new R((Math.random()-.5)*n,(Math.random()-.5)*n,(Math.random()-.5)*n);de.position.add(s),Ua||Ye.render(oe,de),de.position.sub(s)}function Zv(){return innerWidth>=innerHeight?{pos:new R(0,30,31),target:new R(0,0,1.5)}:{pos:new R(-36,46,0),target:new R(-1,0,0)}}function Ku(){de.fov=innerWidth>=innerHeight?40:56,de.aspect=innerWidth/innerHeight,de.updateProjectionMatrix()}Ku();addEventListener("resize",()=>{Ku(),de.aspect=innerWidth/innerHeight,de.updateProjectionMatrix(),Ye.setSize(innerWidth,innerHeight)});Eo();ju();Wi.has("watch")&&qu("watch");Wi.has("debug")&&(window.__ts={S:L,clock:ln,scenery:dn,nav:ut,camera:de,controls:Oe,renderer:Ye,validEnd:sc,setUnitPos:fr,trace:So,get units(){return re},screen(i,t,e){const n=new R(i,t,e).project(de);return[(n.x*.5+.5)*innerWidth,(-n.y*.5+.5)*innerHeight]}});
