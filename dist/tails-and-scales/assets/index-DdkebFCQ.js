(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Sc="160",Kn={ROTATE:0,DOLLY:1,PAN:2},rs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Jd=0,cl=1,Zd=2,Hu=1,Vu=2,Yn=3,Ei=0,Qe=1,cn=2,vi=0,Cs=1,ll=2,hl=3,ul=4,Qd=5,ki=100,tp=101,ep=102,fl=103,dl=104,np=200,ip=201,sp=202,rp=203,nc=204,ic=205,op=206,ap=207,cp=208,lp=209,hp=210,up=211,fp=212,dp=213,pp=214,mp=0,gp=1,vp=2,To=3,_p=4,xp=5,yp=6,Mp=7,wc=0,bp=1,Sp=2,_i=0,wp=1,Ep=2,Tp=3,Wu=4,Ap=5,Rp=6,Gu=300,zs=301,Os=302,sc=303,rc=304,ko=306,Ao=1e3,Sn=1001,oc=1002,ke=1003,pl=1004,oa=1005,Ze=1006,Cp=1007,yr=1008,xi=1009,Pp=1010,Lp=1011,Ec=1012,$u=1013,pi=1014,mi=1015,Mr=1016,Xu=1017,ju=1018,Wi=1020,Dp=1021,pn=1023,Ip=1024,Up=1025,Gi=1026,Fs=1027,Np=1028,qu=1029,zp=1030,Yu=1031,Ku=1033,aa=33776,ca=33777,la=33778,ha=33779,ml=35840,gl=35841,vl=35842,_l=35843,Ju=36196,xl=37492,yl=37496,Ml=37808,bl=37809,Sl=37810,wl=37811,El=37812,Tl=37813,Al=37814,Rl=37815,Cl=37816,Pl=37817,Ll=37818,Dl=37819,Il=37820,Ul=37821,ua=36492,Nl=36494,zl=36495,Op=36283,Ol=36284,Fl=36285,kl=36286,Zu=3e3,$i=3001,Fp=3200,kp=3201,Tc=0,Bp=1,mn="",Ae="srgb",ni="srgb-linear",Ac="display-p3",Bo="display-p3-linear",Ro="linear",fe="srgb",Co="rec709",Po="p3",os=7680,Bl=519,Hp=512,Vp=513,Wp=514,Qu=515,Gp=516,$p=517,Xp=518,jp=519,Hl=35044,qp=35048,Vl="300 es",ac=1035,ti=2e3,Lo=2001;class Qi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const He=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],xo=Math.PI/180,cc=180/Math.PI;function Lr(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(He[i&255]+He[i>>8&255]+He[i>>16&255]+He[i>>24&255]+"-"+He[t&255]+He[t>>8&255]+"-"+He[t>>16&15|64]+He[t>>24&255]+"-"+He[e&63|128]+He[e>>8&255]+"-"+He[e>>16&255]+He[e>>24&255]+He[n&255]+He[n>>8&255]+He[n>>16&255]+He[n>>24&255]).toLowerCase()}function Ue(i,t,e){return Math.max(t,Math.min(e,i))}function Yp(i,t){return(i%t+t)%t}function fa(i,t,e){return(1-e)*i+e*t}function Wl(i){return(i&i-1)===0&&i!==0}function lc(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Qs(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Je(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Kp={DEG2RAD:xo};class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ue(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jt{constructor(t,e,n,s,r,o,a,c,h){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,h)}set(t,e,n,s,r,o,a,c,h){const l=this.elements;return l[0]=t,l[1]=s,l[2]=a,l[3]=e,l[4]=r,l[5]=c,l[6]=n,l[7]=o,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],h=n[1],l=n[4],u=n[7],f=n[2],d=n[5],g=n[8],v=s[0],m=s[3],p=s[6],_=s[1],M=s[4],b=s[7],C=s[2],E=s[5],x=s[8];return r[0]=o*v+a*_+c*C,r[3]=o*m+a*M+c*E,r[6]=o*p+a*b+c*x,r[1]=h*v+l*_+u*C,r[4]=h*m+l*M+u*E,r[7]=h*p+l*b+u*x,r[2]=f*v+d*_+g*C,r[5]=f*m+d*M+g*E,r[8]=f*p+d*b+g*x,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],h=t[7],l=t[8];return e*o*l-e*a*h-n*r*l+n*a*c+s*r*h-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],h=t[7],l=t[8],u=l*o-a*h,f=a*c-l*r,d=h*r-o*c,g=e*u+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*h-l*n)*v,t[2]=(a*n-s*o)*v,t[3]=f*v,t[4]=(l*e-s*c)*v,t[5]=(s*r-a*e)*v,t[6]=d*v,t[7]=(n*c-h*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*o+h*a)+o+t,-s*h,s*c,-s*(-h*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(da.makeScale(t,e)),this}rotate(t){return this.premultiply(da.makeRotation(-t)),this}translate(t,e){return this.premultiply(da.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const da=new Jt;function tf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Do(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Jp(){const i=Do("canvas");return i.style.display="block",i}const Gl={};function dr(i){i in Gl||(Gl[i]=!0,console.warn(i))}const $l=new Jt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Xl=new Jt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Hr={[ni]:{transfer:Ro,primaries:Co,toReference:i=>i,fromReference:i=>i},[Ae]:{transfer:fe,primaries:Co,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Bo]:{transfer:Ro,primaries:Po,toReference:i=>i.applyMatrix3(Xl),fromReference:i=>i.applyMatrix3($l)},[Ac]:{transfer:fe,primaries:Po,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Xl),fromReference:i=>i.applyMatrix3($l).convertLinearToSRGB()}},Zp=new Set([ni,Bo]),ae={enabled:!0,_workingColorSpace:ni,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Zp.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Hr[t].toReference,s=Hr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Hr[i].primaries},getTransfer:function(i){return i===mn?Ro:Hr[i].transfer}};function Ps(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function pa(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let as;class ef{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{as===void 0&&(as=Do("canvas")),as.width=t.width,as.height=t.height;const n=as.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=as}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Do("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ps(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ps(e[n]/255)*255):e[n]=Ps(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Qp=0;class nf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Qp++}),this.uuid=Lr(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ma(s[o].image)):r.push(ma(s[o]))}else r=ma(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ma(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ef.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let tm=0;class Ye extends Qi{constructor(t=Ye.DEFAULT_IMAGE,e=Ye.DEFAULT_MAPPING,n=Sn,s=Sn,r=Ze,o=yr,a=pn,c=xi,h=Ye.DEFAULT_ANISOTROPY,l=mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tm++}),this.uuid=Lr(),this.name="",this.source=new nf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=h,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof l=="string"?this.colorSpace=l:(dr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=l===$i?Ae:mn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Gu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ao:t.x=t.x-Math.floor(t.x);break;case Sn:t.x=t.x<0?0:1;break;case oc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ao:t.y=t.y-Math.floor(t.y);break;case Sn:t.y=t.y<0?0:1;break;case oc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return dr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ae?$i:Zu}set encoding(t){dr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===$i?Ae:mn}}Ye.DEFAULT_IMAGE=null;Ye.DEFAULT_MAPPING=Gu;Ye.DEFAULT_ANISOTROPY=1;class de{constructor(t=0,e=0,n=0,s=1){de.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,h=c[0],l=c[4],u=c[8],f=c[1],d=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(l-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(l+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(h+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(h+1)/2,b=(d+1)/2,C=(p+1)/2,E=(l+f)/4,x=(u+v)/4,A=(g+m)/4;return M>b&&M>C?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=E/n,r=x/n):b>C?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=E/s,r=A/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=x/r,s=A/r),this.set(n,s,r,e),this}let _=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(f-l)*(f-l));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(u-v)/_,this.z=(f-l)/_,this.w=Math.acos((h+d+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class em extends Qi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(dr("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===$i?Ae:mn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ze,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ye(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new nf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class qi extends em{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class sf extends Ye{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ke,this.minFilter=ke,this.wrapR=Sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class nm extends Ye{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ke,this.minFilter=ke,this.wrapR=Sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Un{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],h=n[s+1],l=n[s+2],u=n[s+3];const f=r[o+0],d=r[o+1],g=r[o+2],v=r[o+3];if(a===0){t[e+0]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==f||h!==d||l!==g){let m=1-a;const p=c*f+h*d+l*g+u*v,_=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const C=Math.sqrt(M),E=Math.atan2(C,p*_);m=Math.sin(m*E)/C,a=Math.sin(a*E)/C}const b=a*_;if(c=c*m+f*b,h=h*m+d*b,l=l*m+g*b,u=u*m+v*b,m===1-a){const C=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=C,h*=C,l*=C,u*=C}}t[e]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],h=n[s+2],l=n[s+3],u=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return t[e]=a*g+l*u+c*d-h*f,t[e+1]=c*g+l*f+h*u-a*d,t[e+2]=h*g+l*d+a*f-c*u,t[e+3]=l*g-a*u-c*f-h*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,h=a(n/2),l=a(s/2),u=a(r/2),f=c(n/2),d=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*l*u+h*d*g,this._y=h*d*u-f*l*g,this._z=h*l*g+f*d*u,this._w=h*l*u-f*d*g;break;case"YXZ":this._x=f*l*u+h*d*g,this._y=h*d*u-f*l*g,this._z=h*l*g-f*d*u,this._w=h*l*u+f*d*g;break;case"ZXY":this._x=f*l*u-h*d*g,this._y=h*d*u+f*l*g,this._z=h*l*g+f*d*u,this._w=h*l*u-f*d*g;break;case"ZYX":this._x=f*l*u-h*d*g,this._y=h*d*u+f*l*g,this._z=h*l*g-f*d*u,this._w=h*l*u+f*d*g;break;case"YZX":this._x=f*l*u+h*d*g,this._y=h*d*u+f*l*g,this._z=h*l*g-f*d*u,this._w=h*l*u-f*d*g;break;case"XZY":this._x=f*l*u-h*d*g,this._y=h*d*u-f*l*g,this._z=h*l*g+f*d*u,this._w=h*l*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],h=e[2],l=e[6],u=e[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(l-c)*d,this._y=(r-h)*d,this._z=(o-s)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(l-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+h)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(r-h)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+l)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(o-s)/d,this._x=(r+h)/d,this._y=(c+l)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ue(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,h=e._z,l=e._w;return this._x=n*l+o*a+s*h-r*c,this._y=s*l+o*c+r*a-n*h,this._z=r*l+o*h+n*c-s*a,this._w=o*l-n*a-s*c-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const h=Math.sqrt(c),l=Math.atan2(h,a),u=Math.sin((1-e)*l)/h,f=Math.sin(e*l)/h;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(t=0,e=0,n=0){P.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(jl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(jl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,h=2*(o*s-a*n),l=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*h+o*u-a*l,this.y=n+c*l+a*h-r*u,this.z=s+c*u+r*l-o*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ga.copy(this).projectOnVector(t),this.sub(ga)}reflect(t){return this.sub(ga.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ue(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ga=new P,jl=new Un;class ts{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(_n.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(_n.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=_n.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,_n):_n.fromBufferAttribute(r,o),_n.applyMatrix4(t.matrixWorld),this.expandByPoint(_n);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Vr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Vr.copy(n.boundingBox)),Vr.applyMatrix4(t.matrixWorld),this.union(Vr)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,_n),_n.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(tr),Wr.subVectors(this.max,tr),cs.subVectors(t.a,tr),ls.subVectors(t.b,tr),hs.subVectors(t.c,tr),ci.subVectors(ls,cs),li.subVectors(hs,ls),Li.subVectors(cs,hs);let e=[0,-ci.z,ci.y,0,-li.z,li.y,0,-Li.z,Li.y,ci.z,0,-ci.x,li.z,0,-li.x,Li.z,0,-Li.x,-ci.y,ci.x,0,-li.y,li.x,0,-Li.y,Li.x,0];return!va(e,cs,ls,hs,Wr)||(e=[1,0,0,0,1,0,0,0,1],!va(e,cs,ls,hs,Wr))?!1:(Gr.crossVectors(ci,li),e=[Gr.x,Gr.y,Gr.z],va(e,cs,ls,hs,Wr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,_n).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(_n).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Gn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Gn=[new P,new P,new P,new P,new P,new P,new P,new P],_n=new P,Vr=new ts,cs=new P,ls=new P,hs=new P,ci=new P,li=new P,Li=new P,tr=new P,Wr=new P,Gr=new P,Di=new P;function va(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Di.fromArray(i,r);const a=s.x*Math.abs(Di.x)+s.y*Math.abs(Di.y)+s.z*Math.abs(Di.z),c=t.dot(Di),h=e.dot(Di),l=n.dot(Di);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>a)return!1}return!0}const im=new ts,er=new P,_a=new P;class Gs{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):im.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;er.subVectors(t,this.center);const e=er.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(er,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(_a.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(er.copy(t.center).add(_a)),this.expandByPoint(er.copy(t.center).sub(_a))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const $n=new P,xa=new P,$r=new P,hi=new P,ya=new P,Xr=new P,Ma=new P;class Ho{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,$n)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=$n.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):($n.copy(this.origin).addScaledVector(this.direction,e),$n.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){xa.copy(t).add(e).multiplyScalar(.5),$r.copy(e).sub(t).normalize(),hi.copy(this.origin).sub(xa);const r=t.distanceTo(e)*.5,o=-this.direction.dot($r),a=hi.dot(this.direction),c=-hi.dot($r),h=hi.lengthSq(),l=Math.abs(1-o*o);let u,f,d,g;if(l>0)if(u=o*c-a,f=o*a-c,g=r*l,u>=0)if(f>=-g)if(f<=g){const v=1/l;u*=v,f*=v,d=u*(u+o*f+2*a)+f*(o*u+f+2*c)+h}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+h;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+h;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+h):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+h):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+h);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(xa).addScaledVector($r,f),d}intersectSphere(t,e){$n.subVectors(t.center,this.origin);const n=$n.dot(this.direction),s=$n.dot($n)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,f=this.origin;return h>=0?(n=(t.min.x-f.x)*h,s=(t.max.x-f.x)*h):(n=(t.max.x-f.x)*h,s=(t.min.x-f.x)*h),l>=0?(r=(t.min.y-f.y)*l,o=(t.max.y-f.y)*l):(r=(t.max.y-f.y)*l,o=(t.min.y-f.y)*l),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,$n)!==null}intersectTriangle(t,e,n,s,r){ya.subVectors(e,t),Xr.subVectors(n,t),Ma.crossVectors(ya,Xr);let o=this.direction.dot(Ma),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;hi.subVectors(this.origin,t);const c=a*this.direction.dot(Xr.crossVectors(hi,Xr));if(c<0)return null;const h=a*this.direction.dot(ya.cross(hi));if(h<0||c+h>o)return null;const l=-a*hi.dot(Ma);return l<0?null:this.at(l/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class re{constructor(t,e,n,s,r,o,a,c,h,l,u,f,d,g,v,m){re.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,h,l,u,f,d,g,v,m)}set(t,e,n,s,r,o,a,c,h,l,u,f,d,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=h,p[6]=l,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new re().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/us.setFromMatrixColumn(t,0).length(),r=1/us.setFromMatrixColumn(t,1).length(),o=1/us.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*l,d=o*u,g=a*l,v=a*u;e[0]=c*l,e[4]=-c*u,e[8]=h,e[1]=d+g*h,e[5]=f-v*h,e[9]=-a*c,e[2]=v-f*h,e[6]=g+d*h,e[10]=o*c}else if(t.order==="YXZ"){const f=c*l,d=c*u,g=h*l,v=h*u;e[0]=f+v*a,e[4]=g*a-d,e[8]=o*h,e[1]=o*u,e[5]=o*l,e[9]=-a,e[2]=d*a-g,e[6]=v+f*a,e[10]=o*c}else if(t.order==="ZXY"){const f=c*l,d=c*u,g=h*l,v=h*u;e[0]=f-v*a,e[4]=-o*u,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*l,e[9]=v-f*a,e[2]=-o*h,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const f=o*l,d=o*u,g=a*l,v=a*u;e[0]=c*l,e[4]=g*h-d,e[8]=f*h+v,e[1]=c*u,e[5]=v*h+f,e[9]=d*h-g,e[2]=-h,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const f=o*c,d=o*h,g=a*c,v=a*h;e[0]=c*l,e[4]=v-f*u,e[8]=g*u+d,e[1]=u,e[5]=o*l,e[9]=-a*l,e[2]=-h*l,e[6]=d*u+g,e[10]=f-v*u}else if(t.order==="XZY"){const f=o*c,d=o*h,g=a*c,v=a*h;e[0]=c*l,e[4]=-u,e[8]=h*l,e[1]=f*u+v,e[5]=o*l,e[9]=d*u-g,e[2]=g*u-d,e[6]=a*l,e[10]=v*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(sm,t,rm)}lookAt(t,e,n){const s=this.elements;return sn.subVectors(t,e),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),ui.crossVectors(n,sn),ui.lengthSq()===0&&(Math.abs(n.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),ui.crossVectors(n,sn)),ui.normalize(),jr.crossVectors(sn,ui),s[0]=ui.x,s[4]=jr.x,s[8]=sn.x,s[1]=ui.y,s[5]=jr.y,s[9]=sn.y,s[2]=ui.z,s[6]=jr.z,s[10]=sn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],h=n[12],l=n[1],u=n[5],f=n[9],d=n[13],g=n[2],v=n[6],m=n[10],p=n[14],_=n[3],M=n[7],b=n[11],C=n[15],E=s[0],x=s[4],A=s[8],y=s[12],S=s[1],U=s[5],N=s[9],$=s[13],I=s[2],O=s[6],W=s[10],q=s[14],X=s[3],j=s[7],Y=s[11],rt=s[15];return r[0]=o*E+a*S+c*I+h*X,r[4]=o*x+a*U+c*O+h*j,r[8]=o*A+a*N+c*W+h*Y,r[12]=o*y+a*$+c*q+h*rt,r[1]=l*E+u*S+f*I+d*X,r[5]=l*x+u*U+f*O+d*j,r[9]=l*A+u*N+f*W+d*Y,r[13]=l*y+u*$+f*q+d*rt,r[2]=g*E+v*S+m*I+p*X,r[6]=g*x+v*U+m*O+p*j,r[10]=g*A+v*N+m*W+p*Y,r[14]=g*y+v*$+m*q+p*rt,r[3]=_*E+M*S+b*I+C*X,r[7]=_*x+M*U+b*O+C*j,r[11]=_*A+M*N+b*W+C*Y,r[15]=_*y+M*$+b*q+C*rt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],h=t[13],l=t[2],u=t[6],f=t[10],d=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+r*c*u-s*h*u-r*a*f+n*h*f+s*a*d-n*c*d)+v*(+e*c*d-e*h*f+r*o*f-s*o*d+s*h*l-r*c*l)+m*(+e*h*u-e*a*d-r*o*u+n*o*d+r*a*l-n*h*l)+p*(-s*a*l-e*c*u+e*a*f+s*o*u-n*o*f+n*c*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],h=t[7],l=t[8],u=t[9],f=t[10],d=t[11],g=t[12],v=t[13],m=t[14],p=t[15],_=u*m*h-v*f*h+v*c*d-a*m*d-u*c*p+a*f*p,M=g*f*h-l*m*h-g*c*d+o*m*d+l*c*p-o*f*p,b=l*v*h-g*u*h+g*a*d-o*v*d-l*a*p+o*u*p,C=g*u*c-l*v*c-g*a*f+o*v*f+l*a*m-o*u*m,E=e*_+n*M+s*b+r*C;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const x=1/E;return t[0]=_*x,t[1]=(v*f*r-u*m*r-v*s*d+n*m*d+u*s*p-n*f*p)*x,t[2]=(a*m*r-v*c*r+v*s*h-n*m*h-a*s*p+n*c*p)*x,t[3]=(u*c*r-a*f*r-u*s*h+n*f*h+a*s*d-n*c*d)*x,t[4]=M*x,t[5]=(l*m*r-g*f*r+g*s*d-e*m*d-l*s*p+e*f*p)*x,t[6]=(g*c*r-o*m*r-g*s*h+e*m*h+o*s*p-e*c*p)*x,t[7]=(o*f*r-l*c*r+l*s*h-e*f*h-o*s*d+e*c*d)*x,t[8]=b*x,t[9]=(g*u*r-l*v*r-g*n*d+e*v*d+l*n*p-e*u*p)*x,t[10]=(o*v*r-g*a*r+g*n*h-e*v*h-o*n*p+e*a*p)*x,t[11]=(l*a*r-o*u*r-l*n*h+e*u*h+o*n*d-e*a*d)*x,t[12]=C*x,t[13]=(l*v*s-g*u*s+g*n*f-e*v*f-l*n*m+e*u*m)*x,t[14]=(g*a*s-o*v*s-g*n*c+e*v*c+o*n*m-e*a*m)*x,t[15]=(o*u*s-l*a*s+l*n*c-e*u*c-o*n*f+e*a*f)*x,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,h=r*o,l=r*a;return this.set(h*o+n,h*a-s*c,h*c+s*a,0,h*a+s*c,l*a+n,l*c-s*o,0,h*c-s*a,l*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,h=r+r,l=o+o,u=a+a,f=r*h,d=r*l,g=r*u,v=o*l,m=o*u,p=a*u,_=c*h,M=c*l,b=c*u,C=n.x,E=n.y,x=n.z;return s[0]=(1-(v+p))*C,s[1]=(d+b)*C,s[2]=(g-M)*C,s[3]=0,s[4]=(d-b)*E,s[5]=(1-(f+p))*E,s[6]=(m+_)*E,s[7]=0,s[8]=(g+M)*x,s[9]=(m-_)*x,s[10]=(1-(f+v))*x,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=us.set(s[0],s[1],s[2]).length();const o=us.set(s[4],s[5],s[6]).length(),a=us.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],xn.copy(this);const h=1/r,l=1/o,u=1/a;return xn.elements[0]*=h,xn.elements[1]*=h,xn.elements[2]*=h,xn.elements[4]*=l,xn.elements[5]*=l,xn.elements[6]*=l,xn.elements[8]*=u,xn.elements[9]*=u,xn.elements[10]*=u,e.setFromRotationMatrix(xn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=ti){const c=this.elements,h=2*r/(e-t),l=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let d,g;if(a===ti)d=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Lo)d=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=ti){const c=this.elements,h=1/(e-t),l=1/(n-s),u=1/(o-r),f=(e+t)*h,d=(n+s)*l;let g,v;if(a===ti)g=(o+r)*u,v=-2*u;else if(a===Lo)g=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const us=new P,xn=new re,sm=new P(0,0,0),rm=new P(1,1,1),ui=new P,jr=new P,sn=new P,ql=new re,Yl=new Un;class $s{constructor(t=0,e=0,n=0,s=$s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],h=s[5],l=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Ue(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-l,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ue(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ue(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ue(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin(Ue(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ue(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,h),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-l,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ql.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ql,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Yl.setFromEuler(this),this.setFromQuaternion(Yl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}$s.DEFAULT_ORDER="XYZ";class Rc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let om=0;const Kl=new P,fs=new Un,Xn=new re,qr=new P,nr=new P,am=new P,cm=new Un,Jl=new P(1,0,0),Zl=new P(0,1,0),Ql=new P(0,0,1),lm={type:"added"},hm={type:"removed"};class ze extends Qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:om++}),this.uuid=Lr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ze.DEFAULT_UP.clone();const t=new P,e=new $s,n=new Un,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new re},normalMatrix:{value:new Jt}}),this.matrix=new re,this.matrixWorld=new re,this.matrixAutoUpdate=ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Rc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return fs.setFromAxisAngle(t,e),this.quaternion.multiply(fs),this}rotateOnWorldAxis(t,e){return fs.setFromAxisAngle(t,e),this.quaternion.premultiply(fs),this}rotateX(t){return this.rotateOnAxis(Jl,t)}rotateY(t){return this.rotateOnAxis(Zl,t)}rotateZ(t){return this.rotateOnAxis(Ql,t)}translateOnAxis(t,e){return Kl.copy(t).applyQuaternion(this.quaternion),this.position.add(Kl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Jl,t)}translateY(t){return this.translateOnAxis(Zl,t)}translateZ(t){return this.translateOnAxis(Ql,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?qr.copy(t):qr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),nr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt(nr,qr,this.up):Xn.lookAt(qr,nr,this.up),this.quaternion.setFromRotationMatrix(Xn),s&&(Xn.extractRotation(s.matrixWorld),fs.setFromRotationMatrix(Xn),this.quaternion.premultiply(fs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(lm)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(hm)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Xn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,t,am),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,cm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){const u=c[h];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,h=this.material.length;c<h;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),h=o(t.textures),l=o(t.images),u=o(t.shapes),f=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),l.length>0&&(n.images=l),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const h in a){const l=a[h];delete l.metadata,c.push(l)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ze.DEFAULT_UP=new P(0,1,0);ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const yn=new P,jn=new P,ba=new P,qn=new P,ds=new P,ps=new P,th=new P,Sa=new P,wa=new P,Ea=new P;let Yr=!1;class bn{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),yn.subVectors(t,e),s.cross(yn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){yn.subVectors(s,e),jn.subVectors(n,e),ba.subVectors(t,e);const o=yn.dot(yn),a=yn.dot(jn),c=yn.dot(ba),h=jn.dot(jn),l=jn.dot(ba),u=o*h-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(h*c-a*l)*f,g=(o*l-a*c)*f;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,qn)===null?!1:qn.x>=0&&qn.y>=0&&qn.x+qn.y<=1}static getUV(t,e,n,s,r,o,a,c){return Yr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Yr=!0),this.getInterpolation(t,e,n,s,r,o,a,c)}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,qn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,qn.x),c.addScaledVector(o,qn.y),c.addScaledVector(a,qn.z),c)}static isFrontFacing(t,e,n,s){return yn.subVectors(n,e),jn.subVectors(t,e),yn.cross(jn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return yn.subVectors(this.c,this.b),jn.subVectors(this.a,this.b),yn.cross(jn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return bn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return bn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Yr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Yr=!0),bn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return bn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return bn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return bn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;ds.subVectors(s,n),ps.subVectors(r,n),Sa.subVectors(t,n);const c=ds.dot(Sa),h=ps.dot(Sa);if(c<=0&&h<=0)return e.copy(n);wa.subVectors(t,s);const l=ds.dot(wa),u=ps.dot(wa);if(l>=0&&u<=l)return e.copy(s);const f=c*u-l*h;if(f<=0&&c>=0&&l<=0)return o=c/(c-l),e.copy(n).addScaledVector(ds,o);Ea.subVectors(t,r);const d=ds.dot(Ea),g=ps.dot(Ea);if(g>=0&&d<=g)return e.copy(r);const v=d*h-c*g;if(v<=0&&h>=0&&g<=0)return a=h/(h-g),e.copy(n).addScaledVector(ps,a);const m=l*g-d*u;if(m<=0&&u-l>=0&&d-g>=0)return th.subVectors(r,s),a=(u-l)/(u-l+(d-g)),e.copy(s).addScaledVector(th,a);const p=1/(m+v+f);return o=v*p,a=f*p,e.copy(n).addScaledVector(ds,o).addScaledVector(ps,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const rf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fi={h:0,s:0,l:0},Kr={h:0,s:0,l:0};function Ta(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class jt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ae){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ae.workingColorSpace){return this.r=t,this.g=e,this.b=n,ae.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ae.workingColorSpace){if(t=Yp(t,1),e=Ue(e,0,1),n=Ue(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Ta(o,r,t+1/3),this.g=Ta(o,r,t),this.b=Ta(o,r,t-1/3)}return ae.toWorkingColorSpace(this,s),this}setStyle(t,e=Ae){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ae){const n=rf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ps(t.r),this.g=Ps(t.g),this.b=Ps(t.b),this}copyLinearToSRGB(t){return this.r=pa(t.r),this.g=pa(t.g),this.b=pa(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ae){return ae.fromWorkingColorSpace(Ve.copy(this),t),Math.round(Ue(Ve.r*255,0,255))*65536+Math.round(Ue(Ve.g*255,0,255))*256+Math.round(Ue(Ve.b*255,0,255))}getHexString(t=Ae){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.fromWorkingColorSpace(Ve.copy(this),e);const n=Ve.r,s=Ve.g,r=Ve.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,h;const l=(a+o)/2;if(a===o)c=0,h=0;else{const u=o-a;switch(h=l<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=h,t.l=l,t}getRGB(t,e=ae.workingColorSpace){return ae.fromWorkingColorSpace(Ve.copy(this),e),t.r=Ve.r,t.g=Ve.g,t.b=Ve.b,t}getStyle(t=Ae){ae.fromWorkingColorSpace(Ve.copy(this),t);const e=Ve.r,n=Ve.g,s=Ve.b;return t!==Ae?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(fi),this.setHSL(fi.h+t,fi.s+e,fi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(fi),t.getHSL(Kr);const n=fa(fi.h,Kr.h,e),s=fa(fi.s,Kr.s,e),r=fa(fi.l,Kr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ve=new jt;jt.NAMES=rf;let um=0;class es extends Qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=Lr(),this.name="",this.type="Material",this.blending=Cs,this.side=Ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=nc,this.blendDst=ic,this.blendEquation=ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new jt(0,0,0),this.blendAlpha=0,this.depthFunc=To,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Bl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=os,this.stencilZFail=os,this.stencilZPass=os,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Cs&&(n.blending=this.blending),this.side!==Ei&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==nc&&(n.blendSrc=this.blendSrc),this.blendDst!==ic&&(n.blendDst=this.blendDst),this.blendEquation!==ki&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==To&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Bl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==os&&(n.stencilFail=this.stencilFail),this.stencilZFail!==os&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==os&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Xe extends es{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=wc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ee=new P,Jr=new ht;class hn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Hl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=mi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Jr.fromBufferAttribute(this,e),Jr.applyMatrix3(t),this.setXY(e,Jr.x,Jr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Qs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Je(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Qs(e,this.array)),e}setX(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Qs(e,this.array)),e}setY(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Qs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Qs(e,this.array)),e}setW(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array),s=Je(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),n=Je(n,this.array),s=Je(s,this.array),r=Je(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Hl&&(t.usage=this.usage),t}}class of extends hn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class af extends hn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ie extends hn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let fm=0;const fn=new re,Aa=new ze,ms=new P,rn=new ts,ir=new ts,Ie=new P;class Se extends Qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=Lr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(tf(t)?af:of)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return fn.makeRotationFromQuaternion(t),this.applyMatrix4(fn),this}rotateX(t){return fn.makeRotationX(t),this.applyMatrix4(fn),this}rotateY(t){return fn.makeRotationY(t),this.applyMatrix4(fn),this}rotateZ(t){return fn.makeRotationZ(t),this.applyMatrix4(fn),this}translate(t,e,n){return fn.makeTranslation(t,e,n),this.applyMatrix4(fn),this}scale(t,e,n){return fn.makeScale(t,e,n),this.applyMatrix4(fn),this}lookAt(t){return Aa.lookAt(t),Aa.updateMatrix(),this.applyMatrix4(Aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ms).negate(),this.translate(ms.x,ms.y,ms.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ie(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ts);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];rn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ie.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(Ie),Ie.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(Ie)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(rn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];ir.setFromBufferAttribute(a),this.morphTargetsRelative?(Ie.addVectors(rn.min,ir.min),rn.expandByPoint(Ie),Ie.addVectors(rn.max,ir.max),rn.expandByPoint(Ie)):(rn.expandByPoint(ir.min),rn.expandByPoint(ir.max))}rn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ie.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ie));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let h=0,l=a.count;h<l;h++)Ie.fromBufferAttribute(a,h),c&&(ms.fromBufferAttribute(t,h),Ie.add(ms)),s=Math.max(s,n.distanceToSquared(Ie))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new hn(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,h=[],l=[];for(let S=0;S<a;S++)h[S]=new P,l[S]=new P;const u=new P,f=new P,d=new P,g=new ht,v=new ht,m=new ht,p=new P,_=new P;function M(S,U,N){u.fromArray(s,S*3),f.fromArray(s,U*3),d.fromArray(s,N*3),g.fromArray(o,S*2),v.fromArray(o,U*2),m.fromArray(o,N*2),f.sub(u),d.sub(u),v.sub(g),m.sub(g);const $=1/(v.x*m.y-m.x*v.y);isFinite($)&&(p.copy(f).multiplyScalar(m.y).addScaledVector(d,-v.y).multiplyScalar($),_.copy(d).multiplyScalar(v.x).addScaledVector(f,-m.x).multiplyScalar($),h[S].add(p),h[U].add(p),h[N].add(p),l[S].add(_),l[U].add(_),l[N].add(_))}let b=this.groups;b.length===0&&(b=[{start:0,count:n.length}]);for(let S=0,U=b.length;S<U;++S){const N=b[S],$=N.start,I=N.count;for(let O=$,W=$+I;O<W;O+=3)M(n[O+0],n[O+1],n[O+2])}const C=new P,E=new P,x=new P,A=new P;function y(S){x.fromArray(r,S*3),A.copy(x);const U=h[S];C.copy(U),C.sub(x.multiplyScalar(x.dot(U))).normalize(),E.crossVectors(A,U);const $=E.dot(l[S])<0?-1:1;c[S*4]=C.x,c[S*4+1]=C.y,c[S*4+2]=C.z,c[S*4+3]=$}for(let S=0,U=b.length;S<U;++S){const N=b[S],$=N.start,I=N.count;for(let O=$,W=$+I;O<W;O+=3)y(n[O+0]),y(n[O+1]),y(n[O+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new hn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new P,r=new P,o=new P,a=new P,c=new P,h=new P,l=new P,u=new P;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),v=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),l.subVectors(o,r),u.subVectors(s,r),l.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,m),a.add(l),c.add(l),h.add(l),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,h.x,h.y,h.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),l.subVectors(o,r),u.subVectors(s,r),l.cross(u),n.setXYZ(f+0,l.x,l.y,l.z),n.setXYZ(f+1,l.x,l.y,l.z),n.setXYZ(f+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ie.fromBufferAttribute(t,e),Ie.normalize(),t.setXYZ(e,Ie.x,Ie.y,Ie.z)}toNonIndexed(){function t(a,c){const h=a.array,l=a.itemSize,u=a.normalized,f=new h.constructor(c.length*l);let d=0,g=0;for(let v=0,m=c.length;v<m;v++){a.isInterleavedBufferAttribute?d=c[v]*a.data.stride+a.offset:d=c[v]*l;for(let p=0;p<l;p++)f[g++]=h[d++]}return new hn(f,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Se,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],h=t(c,n);e.setAttribute(a,h)}const r=this.morphAttributes;for(const a in r){const c=[],h=r[a];for(let l=0,u=h.length;l<u;l++){const f=h[l],d=t(f,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const h=o[a];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const h=n[c];t.data.attributes[c]=h.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],l=[];for(let u=0,f=h.length;u<f;u++){const d=h[u];l.push(d.toJSON(t.data))}l.length>0&&(s[c]=l,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const h in s){const l=s[h];this.setAttribute(h,l.clone(e))}const r=t.morphAttributes;for(const h in r){const l=[],u=r[h];for(let f=0,d=u.length;f<d;f++)l.push(u[f].clone(e));this.morphAttributes[h]=l}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let h=0,l=o.length;h<l;h++){const u=o[h];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const eh=new re,Ii=new Ho,Zr=new Gs,nh=new P,gs=new P,vs=new P,_s=new P,Ra=new P,Qr=new P,to=new ht,eo=new ht,no=new ht,ih=new P,sh=new P,rh=new P,io=new P,so=new P;class Ht extends ze{constructor(t=new Se,e=new Xe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Qr.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const l=a[c],u=r[c];l!==0&&(Ra.fromBufferAttribute(u,t),o?Qr.addScaledVector(Ra,l):Qr.addScaledVector(Ra.sub(e),l))}e.add(Qr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Zr.copy(n.boundingSphere),Zr.applyMatrix4(r),Ii.copy(t.ray).recast(t.near),!(Zr.containsPoint(Ii.origin)===!1&&(Ii.intersectSphere(Zr,nh)===null||Ii.origin.distanceToSquared(nh)>(t.far-t.near)**2))&&(eh.copy(r).invert(),Ii.copy(t.ray).applyMatrix4(eh),!(n.boundingBox!==null&&Ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ii)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=o[m.materialIndex],_=Math.max(m.start,d.start),M=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let b=_,C=M;b<C;b+=3){const E=a.getX(b),x=a.getX(b+1),A=a.getX(b+2);s=ro(this,p,t,n,h,l,u,E,x,A),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),v=Math.min(a.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const _=a.getX(m),M=a.getX(m+1),b=a.getX(m+2);s=ro(this,o,t,n,h,l,u,_,M,b),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=o[m.materialIndex],_=Math.max(m.start,d.start),M=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let b=_,C=M;b<C;b+=3){const E=b,x=b+1,A=b+2;s=ro(this,p,t,n,h,l,u,E,x,A),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),v=Math.min(c.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const _=m,M=m+1,b=m+2;s=ro(this,o,t,n,h,l,u,_,M,b),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function dm(i,t,e,n,s,r,o,a){let c;if(t.side===Qe?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Ei,a),c===null)return null;so.copy(a),so.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(so);return h<e.near||h>e.far?null:{distance:h,point:so.clone(),object:i}}function ro(i,t,e,n,s,r,o,a,c,h){i.getVertexPosition(a,gs),i.getVertexPosition(c,vs),i.getVertexPosition(h,_s);const l=dm(i,t,e,n,gs,vs,_s,io);if(l){s&&(to.fromBufferAttribute(s,a),eo.fromBufferAttribute(s,c),no.fromBufferAttribute(s,h),l.uv=bn.getInterpolation(io,gs,vs,_s,to,eo,no,new ht)),r&&(to.fromBufferAttribute(r,a),eo.fromBufferAttribute(r,c),no.fromBufferAttribute(r,h),l.uv1=bn.getInterpolation(io,gs,vs,_s,to,eo,no,new ht),l.uv2=l.uv1),o&&(ih.fromBufferAttribute(o,a),sh.fromBufferAttribute(o,c),rh.fromBufferAttribute(o,h),l.normal=bn.getInterpolation(io,gs,vs,_s,ih,sh,rh,new P),l.normal.dot(n.direction)>0&&l.normal.multiplyScalar(-1));const u={a,b:c,c:h,normal:new P,materialIndex:0};bn.getNormal(gs,vs,_s,u.normal),l.face=u}return l}class Nn extends Se{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],h=[],l=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ie(h,3)),this.setAttribute("normal",new ie(l,3)),this.setAttribute("uv",new ie(u,2));function g(v,m,p,_,M,b,C,E,x,A,y){const S=b/x,U=C/A,N=b/2,$=C/2,I=E/2,O=x+1,W=A+1;let q=0,X=0;const j=new P;for(let Y=0;Y<W;Y++){const rt=Y*U-$;for(let ct=0;ct<O;ct++){const G=ct*S-N;j[v]=G*_,j[m]=rt*M,j[p]=I,h.push(j.x,j.y,j.z),j[v]=0,j[m]=0,j[p]=E>0?1:-1,l.push(j.x,j.y,j.z),u.push(ct/x),u.push(1-Y/A),q+=1}}for(let Y=0;Y<A;Y++)for(let rt=0;rt<x;rt++){const ct=f+rt+O*Y,G=f+rt+O*(Y+1),K=f+(rt+1)+O*(Y+1),pt=f+(rt+1)+O*Y;c.push(ct,G,pt),c.push(G,K,pt),X+=6}a.addGroup(d,X,y),d+=X,f+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Nn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ks(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function $e(i){const t={};for(let e=0;e<i.length;e++){const n=ks(i[e]);for(const s in n)t[s]=n[s]}return t}function pm(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function cf(i){return i.getRenderTarget()===null?i.outputColorSpace:ae.workingColorSpace}const mm={clone:ks,merge:$e};var gm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Yi extends es{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gm,this.fragmentShader=vm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ks(t.uniforms),this.uniformsGroups=pm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class lf extends ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new re,this.projectionMatrix=new re,this.projectionMatrixInverse=new re,this.coordinateSystem=ti}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class an extends lf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=cc*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(xo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return cc*2*Math.atan(Math.tan(xo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(xo*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,h=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/h,s*=o.width/c,n*=o.height/h}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const xs=-90,ys=1;class _m extends ze{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new an(xs,ys,t,e);s.layers=this.layers,this.add(s);const r=new an(xs,ys,t,e);r.layers=this.layers,this.add(r);const o=new an(xs,ys,t,e);o.layers=this.layers,this.add(o);const a=new an(xs,ys,t,e);a.layers=this.layers,this.add(a);const c=new an(xs,ys,t,e);c.layers=this.layers,this.add(c);const h=new an(xs,ys,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const h of e)this.remove(h);if(t===ti)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Lo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,h,l]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,l),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class hf extends Ye{constructor(t,e,n,s,r,o,a,c,h,l){t=t!==void 0?t:[],e=e!==void 0?e:zs,super(t,e,n,s,r,o,a,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class xm extends qi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(dr("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===$i?Ae:mn),this.texture=new hf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ze}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Nn(5,5,5),r=new Yi({name:"CubemapFromEquirect",uniforms:ks(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Qe,blending:vi});r.uniforms.tEquirect.value=e;const o=new Ht(s,r),a=e.minFilter;return e.minFilter===yr&&(e.minFilter=Ze),new _m(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Ca=new P,ym=new P,Mm=new Jt;class di{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ca.subVectors(n,e).cross(ym.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ca),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Mm.getNormalMatrix(t),s=this.coplanarPoint(Ca).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ui=new Gs,oo=new P;class Cc{constructor(t=new di,e=new di,n=new di,s=new di,r=new di,o=new di){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ti){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],h=s[4],l=s[5],u=s[6],f=s[7],d=s[8],g=s[9],v=s[10],m=s[11],p=s[12],_=s[13],M=s[14],b=s[15];if(n[0].setComponents(c-r,f-h,m-d,b-p).normalize(),n[1].setComponents(c+r,f+h,m+d,b+p).normalize(),n[2].setComponents(c+o,f+l,m+g,b+_).normalize(),n[3].setComponents(c-o,f-l,m-g,b-_).normalize(),n[4].setComponents(c-a,f-u,m-v,b-M).normalize(),e===ti)n[5].setComponents(c+a,f+u,m+v,b+M).normalize();else if(e===Lo)n[5].setComponents(a,u,v,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ui.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ui.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ui)}intersectsSprite(t){return Ui.center.set(0,0,0),Ui.radius=.7071067811865476,Ui.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ui)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(oo.x=s.normal.x>0?t.max.x:t.min.x,oo.y=s.normal.y>0?t.max.y:t.min.y,oo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(oo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function uf(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function bm(i,t){const e=t.isWebGL2,n=new WeakMap;function s(h,l){const u=h.array,f=h.usage,d=u.byteLength,g=i.createBuffer();i.bindBuffer(l,g),i.bufferData(l,u,f),h.onUploadCallback();let v;if(u instanceof Float32Array)v=i.FLOAT;else if(u instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)v=i.SHORT;else if(u instanceof Uint32Array)v=i.UNSIGNED_INT;else if(u instanceof Int32Array)v=i.INT;else if(u instanceof Int8Array)v=i.BYTE;else if(u instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:v,bytesPerElement:u.BYTES_PER_ELEMENT,version:h.version,size:d}}function r(h,l,u){const f=l.array,d=l._updateRange,g=l.updateRanges;if(i.bindBuffer(u,h),d.count===-1&&g.length===0&&i.bufferSubData(u,0,f),g.length!==0){for(let v=0,m=g.length;v<m;v++){const p=g[v];e?i.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f,p.start,p.count):i.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f.subarray(p.start,p.start+p.count))}l.clearUpdateRanges()}d.count!==-1&&(e?i.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f,d.offset,d.count):i.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f.subarray(d.offset,d.offset+d.count)),d.count=-1),l.onUploadCallback()}function o(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function a(h){h.isInterleavedBufferAttribute&&(h=h.data);const l=n.get(h);l&&(i.deleteBuffer(l.buffer),n.delete(h))}function c(h,l){if(h.isGLBufferAttribute){const f=n.get(h);(!f||f.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);const u=n.get(h);if(u===void 0)n.set(h,s(h,l));else if(u.version<h.version){if(u.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,h,l),u.version=h.version}}return{get:o,remove:a,update:c}}class yi extends Se{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),h=a+1,l=c+1,u=t/a,f=e/c,d=[],g=[],v=[],m=[];for(let p=0;p<l;p++){const _=p*f-o;for(let M=0;M<h;M++){const b=M*u-r;g.push(b,-_,0),v.push(0,0,1),m.push(M/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<a;_++){const M=_+h*p,b=_+h*(p+1),C=_+1+h*(p+1),E=_+1+h*p;d.push(M,b,E),d.push(b,C,E)}this.setIndex(d),this.setAttribute("position",new ie(g,3)),this.setAttribute("normal",new ie(v,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yi(t.width,t.height,t.widthSegments,t.heightSegments)}}var Sm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,wm=`#ifdef USE_ALPHAHASH
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
#endif`,Em=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Tm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Am=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Rm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Cm=`#ifdef USE_AOMAP
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
#endif`,Pm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lm=`#ifdef USE_BATCHING
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
#endif`,Dm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Im=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Um=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Nm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,zm=`#ifdef USE_IRIDESCENCE
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
#endif`,Om=`#ifdef USE_BUMPMAP
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
#endif`,Fm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,km=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Vm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Wm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Gm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,$m=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Xm=`#define PI 3.141592653589793
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
} // validated`,jm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,qm=`vec3 transformedNormal = objectNormal;
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
#endif`,Ym=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Km=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qm="gl_FragColor = linearToOutputTexel( gl_FragColor );",t0=`
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
}`,e0=`#ifdef USE_ENVMAP
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
#endif`,n0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,i0=`#ifdef USE_ENVMAP
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
#endif`,s0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,r0=`#ifdef USE_ENVMAP
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
#endif`,o0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,a0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,c0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,l0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,h0=`#ifdef USE_GRADIENTMAP
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
}`,u0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,f0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,d0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,p0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,m0=`uniform bool receiveShadow;
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
#endif`,g0=`#ifdef USE_ENVMAP
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
#endif`,v0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,x0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,y0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,M0=`PhysicalMaterial material;
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
#endif`,b0=`struct PhysicalMaterial {
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
}`,S0=`
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
#endif`,w0=`#if defined( RE_IndirectDiffuse )
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
#endif`,E0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,T0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,A0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,R0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,C0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,P0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,L0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,D0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,I0=`#if defined( USE_POINTS_UV )
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
#endif`,U0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,N0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,z0=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,O0=`#ifdef USE_MORPHNORMALS
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
#endif`,F0=`#ifdef USE_MORPHTARGETS
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
#endif`,k0=`#ifdef USE_MORPHTARGETS
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
#endif`,B0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,H0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,V0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,W0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,G0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$0=`#ifdef USE_NORMALMAP
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
#endif`,X0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,j0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,q0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Y0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,K0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,J0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Z0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Q0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,tg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,eg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ng=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ig=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,og=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ag=`float getShadowMask() {
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
}`,cg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,lg=`#ifdef USE_SKINNING
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
#endif`,hg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ug=`#ifdef USE_SKINNING
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
#endif`,fg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,dg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,pg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,mg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,gg=`#ifdef USE_TRANSMISSION
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
#endif`,vg=`#ifdef USE_TRANSMISSION
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
#endif`,_g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const bg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Sg=`uniform sampler2D t2D;
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
}`,wg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Eg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ag=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rg=`#include <common>
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
}`,Cg=`#if DEPTH_PACKING == 3200
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
}`,Pg=`#define DISTANCE
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
}`,Lg=`#define DISTANCE
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
}`,Dg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ig=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ug=`uniform float scale;
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
}`,Ng=`uniform vec3 diffuse;
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
}`,zg=`#include <common>
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
}`,Og=`uniform vec3 diffuse;
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
}`,Fg=`#define LAMBERT
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
}`,kg=`#define LAMBERT
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
}`,Bg=`#define MATCAP
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
}`,Hg=`#define MATCAP
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
}`,Vg=`#define NORMAL
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
}`,Wg=`#define NORMAL
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
}`,Gg=`#define PHONG
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
}`,$g=`#define PHONG
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
}`,Xg=`#define STANDARD
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
}`,jg=`#define STANDARD
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
}`,qg=`#define TOON
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
}`,Yg=`#define TOON
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
}`,Kg=`uniform float size;
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
}`,Jg=`uniform vec3 diffuse;
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
}`,Zg=`#include <common>
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
}`,Qg=`uniform vec3 color;
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
}`,tv=`uniform float rotation;
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
}`,ev=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:Sm,alphahash_pars_fragment:wm,alphamap_fragment:Em,alphamap_pars_fragment:Tm,alphatest_fragment:Am,alphatest_pars_fragment:Rm,aomap_fragment:Cm,aomap_pars_fragment:Pm,batching_pars_vertex:Lm,batching_vertex:Dm,begin_vertex:Im,beginnormal_vertex:Um,bsdfs:Nm,iridescence_fragment:zm,bumpmap_pars_fragment:Om,clipping_planes_fragment:Fm,clipping_planes_pars_fragment:km,clipping_planes_pars_vertex:Bm,clipping_planes_vertex:Hm,color_fragment:Vm,color_pars_fragment:Wm,color_pars_vertex:Gm,color_vertex:$m,common:Xm,cube_uv_reflection_fragment:jm,defaultnormal_vertex:qm,displacementmap_pars_vertex:Ym,displacementmap_vertex:Km,emissivemap_fragment:Jm,emissivemap_pars_fragment:Zm,colorspace_fragment:Qm,colorspace_pars_fragment:t0,envmap_fragment:e0,envmap_common_pars_fragment:n0,envmap_pars_fragment:i0,envmap_pars_vertex:s0,envmap_physical_pars_fragment:g0,envmap_vertex:r0,fog_vertex:o0,fog_pars_vertex:a0,fog_fragment:c0,fog_pars_fragment:l0,gradientmap_pars_fragment:h0,lightmap_fragment:u0,lightmap_pars_fragment:f0,lights_lambert_fragment:d0,lights_lambert_pars_fragment:p0,lights_pars_begin:m0,lights_toon_fragment:v0,lights_toon_pars_fragment:_0,lights_phong_fragment:x0,lights_phong_pars_fragment:y0,lights_physical_fragment:M0,lights_physical_pars_fragment:b0,lights_fragment_begin:S0,lights_fragment_maps:w0,lights_fragment_end:E0,logdepthbuf_fragment:T0,logdepthbuf_pars_fragment:A0,logdepthbuf_pars_vertex:R0,logdepthbuf_vertex:C0,map_fragment:P0,map_pars_fragment:L0,map_particle_fragment:D0,map_particle_pars_fragment:I0,metalnessmap_fragment:U0,metalnessmap_pars_fragment:N0,morphcolor_vertex:z0,morphnormal_vertex:O0,morphtarget_pars_vertex:F0,morphtarget_vertex:k0,normal_fragment_begin:B0,normal_fragment_maps:H0,normal_pars_fragment:V0,normal_pars_vertex:W0,normal_vertex:G0,normalmap_pars_fragment:$0,clearcoat_normal_fragment_begin:X0,clearcoat_normal_fragment_maps:j0,clearcoat_pars_fragment:q0,iridescence_pars_fragment:Y0,opaque_fragment:K0,packing:J0,premultiplied_alpha_fragment:Z0,project_vertex:Q0,dithering_fragment:tg,dithering_pars_fragment:eg,roughnessmap_fragment:ng,roughnessmap_pars_fragment:ig,shadowmap_pars_fragment:sg,shadowmap_pars_vertex:rg,shadowmap_vertex:og,shadowmask_pars_fragment:ag,skinbase_vertex:cg,skinning_pars_vertex:lg,skinning_vertex:hg,skinnormal_vertex:ug,specularmap_fragment:fg,specularmap_pars_fragment:dg,tonemapping_fragment:pg,tonemapping_pars_fragment:mg,transmission_fragment:gg,transmission_pars_fragment:vg,uv_pars_fragment:_g,uv_pars_vertex:xg,uv_vertex:yg,worldpos_vertex:Mg,background_vert:bg,background_frag:Sg,backgroundCube_vert:wg,backgroundCube_frag:Eg,cube_vert:Tg,cube_frag:Ag,depth_vert:Rg,depth_frag:Cg,distanceRGBA_vert:Pg,distanceRGBA_frag:Lg,equirect_vert:Dg,equirect_frag:Ig,linedashed_vert:Ug,linedashed_frag:Ng,meshbasic_vert:zg,meshbasic_frag:Og,meshlambert_vert:Fg,meshlambert_frag:kg,meshmatcap_vert:Bg,meshmatcap_frag:Hg,meshnormal_vert:Vg,meshnormal_frag:Wg,meshphong_vert:Gg,meshphong_frag:$g,meshphysical_vert:Xg,meshphysical_frag:jg,meshtoon_vert:qg,meshtoon_frag:Yg,points_vert:Kg,points_frag:Jg,shadow_vert:Zg,shadow_frag:Qg,sprite_vert:tv,sprite_frag:ev},lt={common:{diffuse:{value:new jt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new jt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new jt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new jt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},Cn={basic:{uniforms:$e([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:$e([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new jt(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:$e([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new jt(0)},specular:{value:new jt(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:$e([lt.common,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.roughnessmap,lt.metalnessmap,lt.fog,lt.lights,{emissive:{value:new jt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:$e([lt.common,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.gradientmap,lt.fog,lt.lights,{emissive:{value:new jt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:$e([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:$e([lt.points,lt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:$e([lt.common,lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:$e([lt.common,lt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:$e([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:$e([lt.sprite,lt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:$e([lt.common,lt.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:$e([lt.lights,lt.fog,{color:{value:new jt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};Cn.physical={uniforms:$e([Cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new jt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new jt(0)},specularColor:{value:new jt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const ao={r:0,b:0,g:0};function nv(i,t,e,n,s,r,o){const a=new jt(0);let c=r===!0?0:1,h,l,u=null,f=0,d=null;function g(m,p){let _=!1,M=p.isScene===!0?p.background:null;M&&M.isTexture&&(M=(p.backgroundBlurriness>0?e:t).get(M)),M===null?v(a,c):M&&M.isColor&&(v(M,1),_=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,o):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),M&&(M.isCubeTexture||M.mapping===ko)?(l===void 0&&(l=new Ht(new Nn(1,1,1),new Yi({name:"BackgroundCubeMaterial",uniforms:ks(Cn.backgroundCube.uniforms),vertexShader:Cn.backgroundCube.vertexShader,fragmentShader:Cn.backgroundCube.fragmentShader,side:Qe,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(C,E,x){this.matrixWorld.copyPosition(x.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),l.material.uniforms.envMap.value=M,l.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,l.material.toneMapped=ae.getTransfer(M.colorSpace)!==fe,(u!==M||f!==M.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=M,f=M.version,d=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(h===void 0&&(h=new Ht(new yi(2,2),new Yi({name:"BackgroundMaterial",uniforms:ks(Cn.background.uniforms),vertexShader:Cn.background.vertexShader,fragmentShader:Cn.background.fragmentShader,side:Ei,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=M,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=ae.getTransfer(M.colorSpace)!==fe,M.matrixAutoUpdate===!0&&M.updateMatrix(),h.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=M,f=M.version,d=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null))}function v(m,p){m.getRGB(ao,cf(i)),n.buffers.color.setClear(ao.r,ao.g,ao.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),c=p,v(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,v(a,c)},render:g}}function iv(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=m(null);let h=c,l=!1;function u(I,O,W,q,X){let j=!1;if(o){const Y=v(q,W,O);h!==Y&&(h=Y,d(h.object)),j=p(I,q,W,X),j&&_(I,q,W,X)}else{const Y=O.wireframe===!0;(h.geometry!==q.id||h.program!==W.id||h.wireframe!==Y)&&(h.geometry=q.id,h.program=W.id,h.wireframe=Y,j=!0)}X!==null&&e.update(X,i.ELEMENT_ARRAY_BUFFER),(j||l)&&(l=!1,A(I,O,W,q),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function d(I){return n.isWebGL2?i.bindVertexArray(I):r.bindVertexArrayOES(I)}function g(I){return n.isWebGL2?i.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function v(I,O,W){const q=W.wireframe===!0;let X=a[I.id];X===void 0&&(X={},a[I.id]=X);let j=X[O.id];j===void 0&&(j={},X[O.id]=j);let Y=j[q];return Y===void 0&&(Y=m(f()),j[q]=Y),Y}function m(I){const O=[],W=[],q=[];for(let X=0;X<s;X++)O[X]=0,W[X]=0,q[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:W,attributeDivisors:q,object:I,attributes:{},index:null}}function p(I,O,W,q){const X=h.attributes,j=O.attributes;let Y=0;const rt=W.getAttributes();for(const ct in rt)if(rt[ct].location>=0){const K=X[ct];let pt=j[ct];if(pt===void 0&&(ct==="instanceMatrix"&&I.instanceMatrix&&(pt=I.instanceMatrix),ct==="instanceColor"&&I.instanceColor&&(pt=I.instanceColor)),K===void 0||K.attribute!==pt||pt&&K.data!==pt.data)return!0;Y++}return h.attributesNum!==Y||h.index!==q}function _(I,O,W,q){const X={},j=O.attributes;let Y=0;const rt=W.getAttributes();for(const ct in rt)if(rt[ct].location>=0){let K=j[ct];K===void 0&&(ct==="instanceMatrix"&&I.instanceMatrix&&(K=I.instanceMatrix),ct==="instanceColor"&&I.instanceColor&&(K=I.instanceColor));const pt={};pt.attribute=K,K&&K.data&&(pt.data=K.data),X[ct]=pt,Y++}h.attributes=X,h.attributesNum=Y,h.index=q}function M(){const I=h.newAttributes;for(let O=0,W=I.length;O<W;O++)I[O]=0}function b(I){C(I,0)}function C(I,O){const W=h.newAttributes,q=h.enabledAttributes,X=h.attributeDivisors;W[I]=1,q[I]===0&&(i.enableVertexAttribArray(I),q[I]=1),X[I]!==O&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,O),X[I]=O)}function E(){const I=h.newAttributes,O=h.enabledAttributes;for(let W=0,q=O.length;W<q;W++)O[W]!==I[W]&&(i.disableVertexAttribArray(W),O[W]=0)}function x(I,O,W,q,X,j,Y){Y===!0?i.vertexAttribIPointer(I,O,W,X,j):i.vertexAttribPointer(I,O,W,q,X,j)}function A(I,O,W,q){if(n.isWebGL2===!1&&(I.isInstancedMesh||q.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();const X=q.attributes,j=W.getAttributes(),Y=O.defaultAttributeValues;for(const rt in j){const ct=j[rt];if(ct.location>=0){let G=X[rt];if(G===void 0&&(rt==="instanceMatrix"&&I.instanceMatrix&&(G=I.instanceMatrix),rt==="instanceColor"&&I.instanceColor&&(G=I.instanceColor)),G!==void 0){const K=G.normalized,pt=G.itemSize,wt=e.get(G);if(wt===void 0)continue;const bt=wt.buffer,kt=wt.type,Bt=wt.bytesPerElement,Lt=n.isWebGL2===!0&&(kt===i.INT||kt===i.UNSIGNED_INT||G.gpuType===$u);if(G.isInterleavedBufferAttribute){const Zt=G.data,k=Zt.stride,Fe=G.offset;if(Zt.isInstancedInterleavedBuffer){for(let At=0;At<ct.locationSize;At++)C(ct.location+At,Zt.meshPerAttribute);I.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=Zt.meshPerAttribute*Zt.count)}else for(let At=0;At<ct.locationSize;At++)b(ct.location+At);i.bindBuffer(i.ARRAY_BUFFER,bt);for(let At=0;At<ct.locationSize;At++)x(ct.location+At,pt/ct.locationSize,kt,K,k*Bt,(Fe+pt/ct.locationSize*At)*Bt,Lt)}else{if(G.isInstancedBufferAttribute){for(let Zt=0;Zt<ct.locationSize;Zt++)C(ct.location+Zt,G.meshPerAttribute);I.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let Zt=0;Zt<ct.locationSize;Zt++)b(ct.location+Zt);i.bindBuffer(i.ARRAY_BUFFER,bt);for(let Zt=0;Zt<ct.locationSize;Zt++)x(ct.location+Zt,pt/ct.locationSize,kt,K,pt*Bt,pt/ct.locationSize*Zt*Bt,Lt)}}else if(Y!==void 0){const K=Y[rt];if(K!==void 0)switch(K.length){case 2:i.vertexAttrib2fv(ct.location,K);break;case 3:i.vertexAttrib3fv(ct.location,K);break;case 4:i.vertexAttrib4fv(ct.location,K);break;default:i.vertexAttrib1fv(ct.location,K)}}}}E()}function y(){N();for(const I in a){const O=a[I];for(const W in O){const q=O[W];for(const X in q)g(q[X].object),delete q[X];delete O[W]}delete a[I]}}function S(I){if(a[I.id]===void 0)return;const O=a[I.id];for(const W in O){const q=O[W];for(const X in q)g(q[X].object),delete q[X];delete O[W]}delete a[I.id]}function U(I){for(const O in a){const W=a[O];if(W[I.id]===void 0)continue;const q=W[I.id];for(const X in q)g(q[X].object),delete q[X];delete W[I.id]}}function N(){$(),l=!0,h!==c&&(h=c,d(h.object))}function $(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:N,resetDefaultState:$,dispose:y,releaseStatesOfGeometry:S,releaseStatesOfProgram:U,initAttributes:M,enableAttribute:b,disableUnusedAttributes:E}}function sv(i,t,e,n){const s=n.isWebGL2;let r;function o(l){r=l}function a(l,u){i.drawArrays(r,l,u),e.update(u,r,1)}function c(l,u,f){if(f===0)return;let d,g;if(s)d=i,g="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[g](r,l,u,f),e.update(u,r,f)}function h(l,u,f){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<f;g++)this.render(l[g],u[g]);else{d.multiDrawArraysWEBGL(r,l,0,u,0,f);let g=0;for(let v=0;v<f;v++)g+=u[v];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=h}function rv(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const x=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(x.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(x){if(x==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";x="mediump"}return x==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const h=o||t.has("WEBGL_draw_buffers"),l=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=f>0,b=o||t.has("OES_texture_float"),C=M&&b,E=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:l,maxTextures:u,maxVertexTextures:f,maxTextureSize:d,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:_,vertexTextures:M,floatFragmentTextures:b,floatVertexTextures:C,maxSamples:E}}function ov(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new di,a=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=l(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?l(null):h();else{const _=r?0:n,M=_*4;let b=p.clippingState||null;c.value=b,b=l(g,f,M,d);for(let C=0;C!==M;++C)b[C]=e[C];p.clippingState=b,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function l(u,f,d,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=d+v*4,_=f.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,b=d;M!==v;++M,b+=4)o.copy(u[M]).applyMatrix4(_,a),o.normal.toArray(m,b),m[b+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function av(i){let t=new WeakMap;function e(o,a){return a===sc?o.mapping=zs:a===rc&&(o.mapping=Os),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===sc||a===rc)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const h=new xm(c.height/2);return h.fromEquirectangularTexture(i,o),t.set(o,h),o.addEventListener("dispose",s),e(h.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class ff extends lf{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,o=r+h*this.view.width,a-=l*this.view.offsetY,c=a-l*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const As=4,oh=[.125,.215,.35,.446,.526,.582],Bi=20,Pa=new ff,ah=new jt;let La=null,Da=0,Ia=0;const Ni=(1+Math.sqrt(5))/2,Ms=1/Ni,ch=[new P(1,1,1),new P(-1,1,1),new P(1,1,-1),new P(-1,1,-1),new P(0,Ni,Ms),new P(0,Ni,-Ms),new P(Ms,0,Ni),new P(-Ms,0,Ni),new P(Ni,Ms,0),new P(-Ni,Ms,0)];class lh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){La=this._renderer.getRenderTarget(),Da=this._renderer.getActiveCubeFace(),Ia=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=uh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(La,Da,Ia),t.scissorTest=!1,co(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zs||t.mapping===Os?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),La=this._renderer.getRenderTarget(),Da=this._renderer.getActiveCubeFace(),Ia=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ze,minFilter:Ze,generateMipmaps:!1,type:Mr,format:pn,colorSpace:ni,depthBuffer:!1},s=hh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hh(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=cv(r)),this._blurMaterial=lv(r,t,e)}return s}_compileMaterial(t){const e=new Ht(this._lodPlanes[0],t);this._renderer.compile(e,Pa)}_sceneToCubeUV(t,e,n,s){const a=new an(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,f=l.toneMapping;l.getClearColor(ah),l.toneMapping=_i,l.autoClear=!1;const d=new Xe({name:"PMREM.Background",side:Qe,depthWrite:!1,depthTest:!1}),g=new Ht(new Nn,d);let v=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,v=!0):(d.color.copy(ah),v=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(a.up.set(0,c[p],0),a.lookAt(h[p],0,0)):_===1?(a.up.set(0,0,c[p]),a.lookAt(0,h[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,h[p]));const M=this._cubeSize;co(s,_*M,p>2?M:0,M,M),l.setRenderTarget(s),v&&l.render(g,a),l.render(t,a)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=f,l.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===zs||t.mapping===Os;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=fh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=uh());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Ht(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;co(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Pa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=ch[(s-1)%ch.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,h=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const l=3,u=new Ht(this._lodPlanes[s],h),f=h.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Bi-1),v=r/g,m=isFinite(r)?1+Math.floor(l*v):Bi;m>Bi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Bi}`);const p=[];let _=0;for(let x=0;x<Bi;++x){const A=x/v,y=Math.exp(-A*A/2);p.push(y),x===0?_+=y:x<m&&(_+=2*y)}for(let x=0;x<p.length;x++)p[x]=p[x]/_;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:M}=this;f.dTheta.value=g,f.mipInt.value=M-n;const b=this._sizeLods[s],C=3*b*(s>M-As?s-M+As:0),E=4*(this._cubeSize-b);co(e,C,E,3*b,2*b),c.setRenderTarget(e),c.render(u,Pa)}}function cv(i){const t=[],e=[],n=[];let s=i;const r=i-As+1+oh.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-As?c=oh[o-i+As-1]:o===0&&(c=0),n.push(c);const h=1/(a-2),l=-h,u=1+h,f=[l,l,u,l,u,u,l,l,u,u,l,u],d=6,g=6,v=3,m=2,p=1,_=new Float32Array(v*g*d),M=new Float32Array(m*g*d),b=new Float32Array(p*g*d);for(let E=0;E<d;E++){const x=E%3*2/3-1,A=E>2?0:-1,y=[x,A,0,x+2/3,A,0,x+2/3,A+1,0,x,A,0,x+2/3,A+1,0,x,A+1,0];_.set(y,v*g*E),M.set(f,m*g*E);const S=[E,E,E,E,E,E];b.set(S,p*g*E)}const C=new Se;C.setAttribute("position",new hn(_,v)),C.setAttribute("uv",new hn(M,m)),C.setAttribute("faceIndex",new hn(b,p)),t.push(C),s>As&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function hh(i,t,e){const n=new qi(i,t,e);return n.texture.mapping=ko,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function co(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function lv(i,t,e){const n=new Float32Array(Bi),s=new P(0,1,0);return new Yi({name:"SphericalGaussianBlur",defines:{n:Bi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Pc(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function uh(){return new Yi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Pc(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function fh(){return new Yi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Pc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Pc(){return`

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
	`}function hv(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,h=c===sc||c===rc,l=c===zs||c===Os;if(h||l)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new lh(i)),u=h?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{const u=a.image;if(h&&u&&u.height>0||l&&u&&s(u)){e===null&&(e=new lh(i));const f=h?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let c=0;const h=6;for(let l=0;l<h;l++)a[l]!==void 0&&c++;return c===h}function r(a){const c=a.target;c.removeEventListener("dispose",r);const h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function uv(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function fv(i,t,e,n){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const v=f.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}f.removeEventListener("dispose",o),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],i.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const v=d[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],i.ARRAY_BUFFER)}}function h(u){const f=[],d=u.index,g=u.attributes.position;let v=0;if(d!==null){const _=d.array;v=d.version;for(let M=0,b=_.length;M<b;M+=3){const C=_[M+0],E=_[M+1],x=_[M+2];f.push(C,E,E,x,x,C)}}else if(g!==void 0){const _=g.array;v=g.version;for(let M=0,b=_.length/3-1;M<b;M+=3){const C=M+0,E=M+1,x=M+2;f.push(C,E,E,x,x,C)}}else return;const m=new(tf(f)?af:of)(f,1);m.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function l(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&h(u)}else h(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:l}}function dv(i,t,e,n){const s=n.isWebGL2;let r;function o(d){r=d}let a,c;function h(d){a=d.type,c=d.bytesPerElement}function l(d,g){i.drawElements(r,g,a,d*c),e.update(g,r,1)}function u(d,g,v){if(v===0)return;let m,p;if(s)m=i,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,a,d*c,v),e.update(g,r,v)}function f(d,g,v){if(v===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<v;p++)this.render(d[p]/c,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,a,d,0,v);let p=0;for(let _=0;_<v;_++)p+=g[_];e.update(p,r,1)}}this.setMode=o,this.setIndex=h,this.render=l,this.renderInstances=u,this.renderMultiDraw=f}function pv(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function mv(i,t){return i[0]-t[0]}function gv(i,t){return Math.abs(t[1])-Math.abs(i[1])}function vv(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,o=new de,a=[];for(let h=0;h<8;h++)a[h]=[h,0];function c(h,l,u){const f=h.morphTargetInfluences;if(t.isWebGL2===!0){const g=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,v=g!==void 0?g.length:0;let m=r.get(l);if(m===void 0||m.count!==v){let O=function(){$.dispose(),r.delete(l),l.removeEventListener("dispose",O)};var d=O;m!==void 0&&m.texture.dispose();const M=l.morphAttributes.position!==void 0,b=l.morphAttributes.normal!==void 0,C=l.morphAttributes.color!==void 0,E=l.morphAttributes.position||[],x=l.morphAttributes.normal||[],A=l.morphAttributes.color||[];let y=0;M===!0&&(y=1),b===!0&&(y=2),C===!0&&(y=3);let S=l.attributes.position.count*y,U=1;S>t.maxTextureSize&&(U=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const N=new Float32Array(S*U*4*v),$=new sf(N,S,U,v);$.type=mi,$.needsUpdate=!0;const I=y*4;for(let W=0;W<v;W++){const q=E[W],X=x[W],j=A[W],Y=S*U*4*W;for(let rt=0;rt<q.count;rt++){const ct=rt*I;M===!0&&(o.fromBufferAttribute(q,rt),N[Y+ct+0]=o.x,N[Y+ct+1]=o.y,N[Y+ct+2]=o.z,N[Y+ct+3]=0),b===!0&&(o.fromBufferAttribute(X,rt),N[Y+ct+4]=o.x,N[Y+ct+5]=o.y,N[Y+ct+6]=o.z,N[Y+ct+7]=0),C===!0&&(o.fromBufferAttribute(j,rt),N[Y+ct+8]=o.x,N[Y+ct+9]=o.y,N[Y+ct+10]=o.z,N[Y+ct+11]=j.itemSize===4?o.w:1)}}m={count:v,texture:$,size:new ht(S,U)},r.set(l,m),l.addEventListener("dispose",O)}let p=0;for(let M=0;M<f.length;M++)p+=f[M];const _=l.morphTargetsRelative?1:1-p;u.getUniforms().setValue(i,"morphTargetBaseInfluence",_),u.getUniforms().setValue(i,"morphTargetInfluences",f),u.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}else{const g=f===void 0?0:f.length;let v=n[l.id];if(v===void 0||v.length!==g){v=[];for(let b=0;b<g;b++)v[b]=[b,0];n[l.id]=v}for(let b=0;b<g;b++){const C=v[b];C[0]=b,C[1]=f[b]}v.sort(gv);for(let b=0;b<8;b++)b<g&&v[b][1]?(a[b][0]=v[b][0],a[b][1]=v[b][1]):(a[b][0]=Number.MAX_SAFE_INTEGER,a[b][1]=0);a.sort(mv);const m=l.morphAttributes.position,p=l.morphAttributes.normal;let _=0;for(let b=0;b<8;b++){const C=a[b],E=C[0],x=C[1];E!==Number.MAX_SAFE_INTEGER&&x?(m&&l.getAttribute("morphTarget"+b)!==m[E]&&l.setAttribute("morphTarget"+b,m[E]),p&&l.getAttribute("morphNormal"+b)!==p[E]&&l.setAttribute("morphNormal"+b,p[E]),s[b]=x,_+=x):(m&&l.hasAttribute("morphTarget"+b)===!0&&l.deleteAttribute("morphTarget"+b),p&&l.hasAttribute("morphNormal"+b)===!0&&l.deleteAttribute("morphNormal"+b),s[b]=0)}const M=l.morphTargetsRelative?1:1-_;u.getUniforms().setValue(i,"morphTargetBaseInfluence",M),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function _v(i,t,e,n){let s=new WeakMap;function r(c){const h=n.render.frame,l=c.geometry,u=t.get(c,l);if(s.get(u)!==h&&(t.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function o(){s=new WeakMap}function a(c){const h=c.target;h.removeEventListener("dispose",a),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:o}}class df extends Ye{constructor(t,e,n,s,r,o,a,c,h,l){if(l=l!==void 0?l:Gi,l!==Gi&&l!==Fs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&l===Gi&&(n=pi),n===void 0&&l===Fs&&(n=Wi),super(null,s,r,o,a,c,l,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:ke,this.minFilter=c!==void 0?c:ke,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const pf=new Ye,mf=new df(1,1);mf.compareFunction=Qu;const gf=new sf,vf=new nm,_f=new hf,dh=[],ph=[],mh=new Float32Array(16),gh=new Float32Array(9),vh=new Float32Array(4);function Xs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=dh[s];if(r===void 0&&(r=new Float32Array(s),dh[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Pe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Le(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Vo(i,t){let e=ph[t];e===void 0&&(e=new Int32Array(t),ph[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function xv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function yv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2fv(this.addr,t),Le(e,t)}}function Mv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Pe(e,t))return;i.uniform3fv(this.addr,t),Le(e,t)}}function bv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4fv(this.addr,t),Le(e,t)}}function Sv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,n))return;vh.set(n),i.uniformMatrix2fv(this.addr,!1,vh),Le(e,n)}}function wv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,n))return;gh.set(n),i.uniformMatrix3fv(this.addr,!1,gh),Le(e,n)}}function Ev(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Pe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,n))return;mh.set(n),i.uniformMatrix4fv(this.addr,!1,mh),Le(e,n)}}function Tv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Av(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2iv(this.addr,t),Le(e,t)}}function Rv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;i.uniform3iv(this.addr,t),Le(e,t)}}function Cv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4iv(this.addr,t),Le(e,t)}}function Pv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Lv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;i.uniform2uiv(this.addr,t),Le(e,t)}}function Dv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;i.uniform3uiv(this.addr,t),Le(e,t)}}function Iv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;i.uniform4uiv(this.addr,t),Le(e,t)}}function Uv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?mf:pf;e.setTexture2D(t||r,s)}function Nv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||vf,s)}function zv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||_f,s)}function Ov(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||gf,s)}function Fv(i){switch(i){case 5126:return xv;case 35664:return yv;case 35665:return Mv;case 35666:return bv;case 35674:return Sv;case 35675:return wv;case 35676:return Ev;case 5124:case 35670:return Tv;case 35667:case 35671:return Av;case 35668:case 35672:return Rv;case 35669:case 35673:return Cv;case 5125:return Pv;case 36294:return Lv;case 36295:return Dv;case 36296:return Iv;case 35678:case 36198:case 36298:case 36306:case 35682:return Uv;case 35679:case 36299:case 36307:return Nv;case 35680:case 36300:case 36308:case 36293:return zv;case 36289:case 36303:case 36311:case 36292:return Ov}}function kv(i,t){i.uniform1fv(this.addr,t)}function Bv(i,t){const e=Xs(t,this.size,2);i.uniform2fv(this.addr,e)}function Hv(i,t){const e=Xs(t,this.size,3);i.uniform3fv(this.addr,e)}function Vv(i,t){const e=Xs(t,this.size,4);i.uniform4fv(this.addr,e)}function Wv(i,t){const e=Xs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Gv(i,t){const e=Xs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function $v(i,t){const e=Xs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Xv(i,t){i.uniform1iv(this.addr,t)}function jv(i,t){i.uniform2iv(this.addr,t)}function qv(i,t){i.uniform3iv(this.addr,t)}function Yv(i,t){i.uniform4iv(this.addr,t)}function Kv(i,t){i.uniform1uiv(this.addr,t)}function Jv(i,t){i.uniform2uiv(this.addr,t)}function Zv(i,t){i.uniform3uiv(this.addr,t)}function Qv(i,t){i.uniform4uiv(this.addr,t)}function t_(i,t,e){const n=this.cache,s=t.length,r=Vo(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||pf,r[o])}function e_(i,t,e){const n=this.cache,s=t.length,r=Vo(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||vf,r[o])}function n_(i,t,e){const n=this.cache,s=t.length,r=Vo(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||_f,r[o])}function i_(i,t,e){const n=this.cache,s=t.length,r=Vo(e,s);Pe(n,r)||(i.uniform1iv(this.addr,r),Le(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||gf,r[o])}function s_(i){switch(i){case 5126:return kv;case 35664:return Bv;case 35665:return Hv;case 35666:return Vv;case 35674:return Wv;case 35675:return Gv;case 35676:return $v;case 5124:case 35670:return Xv;case 35667:case 35671:return jv;case 35668:case 35672:return qv;case 35669:case 35673:return Yv;case 5125:return Kv;case 36294:return Jv;case 36295:return Zv;case 36296:return Qv;case 35678:case 36198:case 36298:case 36306:case 35682:return t_;case 35679:case 36299:case 36307:return e_;case 35680:case 36300:case 36308:case 36293:return n_;case 36289:case 36303:case 36311:case 36292:return i_}}class r_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Fv(e.type)}}class o_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=s_(e.type)}}class a_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Ua=/(\w+)(\])?(\[|\.)?/g;function _h(i,t){i.seq.push(t),i.map[t.id]=t}function c_(i,t,e){const n=i.name,s=n.length;for(Ua.lastIndex=0;;){const r=Ua.exec(n),o=Ua.lastIndex;let a=r[1];const c=r[2]==="]",h=r[3];if(c&&(a=a|0),h===void 0||h==="["&&o+2===s){_h(e,h===void 0?new r_(a,i,t):new o_(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new a_(a),_h(e,u)),e=u}}}class yo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);c_(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function xh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const l_=37297;let h_=0;function u_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function f_(i){const t=ae.getPrimaries(ae.workingColorSpace),e=ae.getPrimaries(i);let n;switch(t===e?n="":t===Po&&e===Co?n="LinearDisplayP3ToLinearSRGB":t===Co&&e===Po&&(n="LinearSRGBToLinearDisplayP3"),i){case ni:case Bo:return[n,"LinearTransferOETF"];case Ae:case Ac:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function yh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+u_(i.getShaderSource(t),o)}else return s}function d_(i,t){const e=f_(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function p_(i,t){let e;switch(t){case wp:e="Linear";break;case Ep:e="Reinhard";break;case Tp:e="OptimizedCineon";break;case Wu:e="ACESFilmic";break;case Rp:e="AgX";break;case Ap:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function m_(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Rs).join(`
`)}function g_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Rs).join(`
`)}function v_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function __(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Rs(i){return i!==""}function Mh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function bh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const x_=/^[ \t]*#include +<([\w\d./]+)>/gm;function hc(i){return i.replace(x_,M_)}const y_=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function M_(i,t){let e=Xt[t];if(e===void 0){const n=y_.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return hc(e)}const b_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sh(i){return i.replace(b_,S_)}function S_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function wh(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function w_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Hu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Vu?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Yn&&(t="SHADOWMAP_TYPE_VSM"),t}function E_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case zs:case Os:t="ENVMAP_TYPE_CUBE";break;case ko:t="ENVMAP_TYPE_CUBE_UV";break}return t}function T_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Os:t="ENVMAP_MODE_REFRACTION";break}return t}function A_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case wc:t="ENVMAP_BLENDING_MULTIPLY";break;case bp:t="ENVMAP_BLENDING_MIX";break;case Sp:t="ENVMAP_BLENDING_ADD";break}return t}function R_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function C_(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=w_(e),h=E_(e),l=T_(e),u=A_(e),f=R_(e),d=e.isWebGL2?"":m_(e),g=g_(e),v=v_(r),m=s.createProgram();let p,_,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Rs).join(`
`),p.length>0&&(p+=`
`),_=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Rs).join(`
`),_.length>0&&(_+=`
`)):(p=[wh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Rs).join(`
`),_=[d,wh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==_i?"#define TONE_MAPPING":"",e.toneMapping!==_i?Xt.tonemapping_pars_fragment:"",e.toneMapping!==_i?p_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,d_("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Rs).join(`
`)),o=hc(o),o=Mh(o,e),o=bh(o,e),a=hc(a),a=Mh(a,e),a=bh(a,e),o=Sh(o),a=Sh(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,_=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Vl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Vl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const b=M+p+o,C=M+_+a,E=xh(s,s.VERTEX_SHADER,b),x=xh(s,s.FRAGMENT_SHADER,C);s.attachShader(m,E),s.attachShader(m,x),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function A(N){if(i.debug.checkShaderErrors){const $=s.getProgramInfoLog(m).trim(),I=s.getShaderInfoLog(E).trim(),O=s.getShaderInfoLog(x).trim();let W=!0,q=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,E,x);else{const X=yh(s,E,"vertex"),j=yh(s,x,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+$+`
`+X+`
`+j)}else $!==""?console.warn("THREE.WebGLProgram: Program Info Log:",$):(I===""||O==="")&&(q=!1);q&&(N.diagnostics={runnable:W,programLog:$,vertexShader:{log:I,prefix:p},fragmentShader:{log:O,prefix:_}})}s.deleteShader(E),s.deleteShader(x),y=new yo(s,m),S=__(s,m)}let y;this.getUniforms=function(){return y===void 0&&A(this),y};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let U=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return U===!1&&(U=s.getProgramParameter(m,l_)),U},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=h_++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=E,this.fragmentShader=x,this}let P_=0;class L_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new D_(t),e.set(t,n)),n}}class D_{constructor(t){this.id=P_++,this.code=t,this.usedTimes=0}}function I_(i,t,e,n,s,r,o){const a=new Rc,c=new L_,h=[],l=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(y){return y===0?"uv":`uv${y}`}function m(y,S,U,N,$){const I=N.fog,O=$.geometry,W=y.isMeshStandardMaterial?N.environment:null,q=(y.isMeshStandardMaterial?e:t).get(y.envMap||W),X=q&&q.mapping===ko?q.image.height:null,j=g[y.type];y.precision!==null&&(d=s.getMaxPrecision(y.precision),d!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));const Y=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,rt=Y!==void 0?Y.length:0;let ct=0;O.morphAttributes.position!==void 0&&(ct=1),O.morphAttributes.normal!==void 0&&(ct=2),O.morphAttributes.color!==void 0&&(ct=3);let G,K,pt,wt;if(j){const ye=Cn[j];G=ye.vertexShader,K=ye.fragmentShader}else G=y.vertexShader,K=y.fragmentShader,c.update(y),pt=c.getVertexShaderID(y),wt=c.getFragmentShaderID(y);const bt=i.getRenderTarget(),kt=$.isInstancedMesh===!0,Bt=$.isBatchedMesh===!0,Lt=!!y.map,Zt=!!y.matcap,k=!!q,Fe=!!y.aoMap,At=!!y.lightMap,Ut=!!y.bumpMap,xt=!!y.normalMap,ue=!!y.displacementMap,Wt=!!y.emissiveMap,R=!!y.metalnessMap,w=!!y.roughnessMap,F=y.anisotropy>0,et=y.clearcoat>0,Z=y.iridescence>0,nt=y.sheen>0,Mt=y.transmission>0,ft=F&&!!y.anisotropyMap,_t=et&&!!y.clearcoatMap,Ct=et&&!!y.clearcoatNormalMap,Gt=et&&!!y.clearcoatRoughnessMap,J=Z&&!!y.iridescenceMap,se=Z&&!!y.iridescenceThicknessMap,qt=nt&&!!y.sheenColorMap,Nt=nt&&!!y.sheenRoughnessMap,Tt=!!y.specularMap,mt=!!y.specularColorMap,L=!!y.specularIntensityMap,it=Mt&&!!y.transmissionMap,St=Mt&&!!y.thicknessMap,vt=!!y.gradientMap,Q=!!y.alphaMap,D=y.alphaTest>0,st=!!y.alphaHash,ut=!!y.extensions,Dt=!!O.attributes.uv1,Rt=!!O.attributes.uv2,Qt=!!O.attributes.uv3;let te=_i;return y.toneMapped&&(bt===null||bt.isXRRenderTarget===!0)&&(te=i.toneMapping),{isWebGL2:l,shaderID:j,shaderType:y.type,shaderName:y.name,vertexShader:G,fragmentShader:K,defines:y.defines,customVertexShaderID:pt,customFragmentShaderID:wt,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Bt,instancing:kt,instancingColor:kt&&$.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:bt===null?i.outputColorSpace:bt.isXRRenderTarget===!0?bt.texture.colorSpace:ni,map:Lt,matcap:Zt,envMap:k,envMapMode:k&&q.mapping,envMapCubeUVHeight:X,aoMap:Fe,lightMap:At,bumpMap:Ut,normalMap:xt,displacementMap:f&&ue,emissiveMap:Wt,normalMapObjectSpace:xt&&y.normalMapType===Bp,normalMapTangentSpace:xt&&y.normalMapType===Tc,metalnessMap:R,roughnessMap:w,anisotropy:F,anisotropyMap:ft,clearcoat:et,clearcoatMap:_t,clearcoatNormalMap:Ct,clearcoatRoughnessMap:Gt,iridescence:Z,iridescenceMap:J,iridescenceThicknessMap:se,sheen:nt,sheenColorMap:qt,sheenRoughnessMap:Nt,specularMap:Tt,specularColorMap:mt,specularIntensityMap:L,transmission:Mt,transmissionMap:it,thicknessMap:St,gradientMap:vt,opaque:y.transparent===!1&&y.blending===Cs,alphaMap:Q,alphaTest:D,alphaHash:st,combine:y.combine,mapUv:Lt&&v(y.map.channel),aoMapUv:Fe&&v(y.aoMap.channel),lightMapUv:At&&v(y.lightMap.channel),bumpMapUv:Ut&&v(y.bumpMap.channel),normalMapUv:xt&&v(y.normalMap.channel),displacementMapUv:ue&&v(y.displacementMap.channel),emissiveMapUv:Wt&&v(y.emissiveMap.channel),metalnessMapUv:R&&v(y.metalnessMap.channel),roughnessMapUv:w&&v(y.roughnessMap.channel),anisotropyMapUv:ft&&v(y.anisotropyMap.channel),clearcoatMapUv:_t&&v(y.clearcoatMap.channel),clearcoatNormalMapUv:Ct&&v(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Gt&&v(y.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&v(y.iridescenceMap.channel),iridescenceThicknessMapUv:se&&v(y.iridescenceThicknessMap.channel),sheenColorMapUv:qt&&v(y.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&v(y.sheenRoughnessMap.channel),specularMapUv:Tt&&v(y.specularMap.channel),specularColorMapUv:mt&&v(y.specularColorMap.channel),specularIntensityMapUv:L&&v(y.specularIntensityMap.channel),transmissionMapUv:it&&v(y.transmissionMap.channel),thicknessMapUv:St&&v(y.thicknessMap.channel),alphaMapUv:Q&&v(y.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(xt||F),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,vertexUv1s:Dt,vertexUv2s:Rt,vertexUv3s:Qt,pointsUvs:$.isPoints===!0&&!!O.attributes.uv&&(Lt||Q),fog:!!I,useFog:y.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:$.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:rt,morphTextureStride:ct,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&U.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Lt&&y.map.isVideoTexture===!0&&ae.getTransfer(y.map.colorSpace)===fe,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===cn,flipSided:y.side===Qe,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:ut&&y.extensions.derivatives===!0,extensionFragDepth:ut&&y.extensions.fragDepth===!0,extensionDrawBuffers:ut&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:ut&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ut&&y.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:l||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:l||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:l||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function p(y){const S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(const U in y.defines)S.push(U),S.push(y.defines[U]);return y.isRawShaderMaterial===!1&&(_(S,y),M(S,y),S.push(i.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function _(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function M(y,S){a.disableAll(),S.isWebGL2&&a.enable(0),S.supportsVertexTextures&&a.enable(1),S.instancing&&a.enable(2),S.instancingColor&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),y.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.skinning&&a.enable(4),S.morphTargets&&a.enable(5),S.morphNormals&&a.enable(6),S.morphColors&&a.enable(7),S.premultipliedAlpha&&a.enable(8),S.shadowMapEnabled&&a.enable(9),S.useLegacyLights&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),y.push(a.mask)}function b(y){const S=g[y.type];let U;if(S){const N=Cn[S];U=mm.clone(N.uniforms)}else U=y.uniforms;return U}function C(y,S){let U;for(let N=0,$=h.length;N<$;N++){const I=h[N];if(I.cacheKey===S){U=I,++U.usedTimes;break}}return U===void 0&&(U=new C_(i,S,y,r),h.push(U)),U}function E(y){if(--y.usedTimes===0){const S=h.indexOf(y);h[S]=h[h.length-1],h.pop(),y.destroy()}}function x(y){c.remove(y)}function A(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:b,acquireProgram:C,releaseProgram:E,releaseShaderCache:x,programs:h,dispose:A}}function U_(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function N_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Eh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Th(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,f,d,g,v,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function a(u,f,d,g,v,m){const p=o(u,f,d,g,v,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,g,v,m){const p=o(u,f,d,g,v,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function h(u,f){e.length>1&&e.sort(u||N_),n.length>1&&n.sort(f||Eh),s.length>1&&s.sort(f||Eh)}function l(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:l,sort:h}}function z_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Th,i.set(n,[o])):s>=r.length?(o=new Th,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function O_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new jt};break;case"SpotLight":e={position:new P,direction:new P,color:new jt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new jt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new jt,groundColor:new jt};break;case"RectAreaLight":e={color:new jt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function F_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let k_=0;function B_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function H_(i,t){const e=new O_,n=F_(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)s.probe.push(new P);const r=new P,o=new re,a=new re;function c(l,u){let f=0,d=0,g=0;for(let N=0;N<9;N++)s.probe[N].set(0,0,0);let v=0,m=0,p=0,_=0,M=0,b=0,C=0,E=0,x=0,A=0,y=0;l.sort(B_);const S=u===!0?Math.PI:1;for(let N=0,$=l.length;N<$;N++){const I=l[N],O=I.color,W=I.intensity,q=I.distance,X=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)f+=O.r*W*S,d+=O.g*W*S,g+=O.b*W*S;else if(I.isLightProbe){for(let j=0;j<9;j++)s.probe[j].addScaledVector(I.sh.coefficients[j],W);y++}else if(I.isDirectionalLight){const j=e.get(I);if(j.color.copy(I.color).multiplyScalar(I.intensity*S),I.castShadow){const Y=I.shadow,rt=n.get(I);rt.shadowBias=Y.bias,rt.shadowNormalBias=Y.normalBias,rt.shadowRadius=Y.radius,rt.shadowMapSize=Y.mapSize,s.directionalShadow[v]=rt,s.directionalShadowMap[v]=X,s.directionalShadowMatrix[v]=I.shadow.matrix,b++}s.directional[v]=j,v++}else if(I.isSpotLight){const j=e.get(I);j.position.setFromMatrixPosition(I.matrixWorld),j.color.copy(O).multiplyScalar(W*S),j.distance=q,j.coneCos=Math.cos(I.angle),j.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),j.decay=I.decay,s.spot[p]=j;const Y=I.shadow;if(I.map&&(s.spotLightMap[x]=I.map,x++,Y.updateMatrices(I),I.castShadow&&A++),s.spotLightMatrix[p]=Y.matrix,I.castShadow){const rt=n.get(I);rt.shadowBias=Y.bias,rt.shadowNormalBias=Y.normalBias,rt.shadowRadius=Y.radius,rt.shadowMapSize=Y.mapSize,s.spotShadow[p]=rt,s.spotShadowMap[p]=X,E++}p++}else if(I.isRectAreaLight){const j=e.get(I);j.color.copy(O).multiplyScalar(W),j.halfWidth.set(I.width*.5,0,0),j.halfHeight.set(0,I.height*.5,0),s.rectArea[_]=j,_++}else if(I.isPointLight){const j=e.get(I);if(j.color.copy(I.color).multiplyScalar(I.intensity*S),j.distance=I.distance,j.decay=I.decay,I.castShadow){const Y=I.shadow,rt=n.get(I);rt.shadowBias=Y.bias,rt.shadowNormalBias=Y.normalBias,rt.shadowRadius=Y.radius,rt.shadowMapSize=Y.mapSize,rt.shadowCameraNear=Y.camera.near,rt.shadowCameraFar=Y.camera.far,s.pointShadow[m]=rt,s.pointShadowMap[m]=X,s.pointShadowMatrix[m]=I.shadow.matrix,C++}s.point[m]=j,m++}else if(I.isHemisphereLight){const j=e.get(I);j.skyColor.copy(I.color).multiplyScalar(W*S),j.groundColor.copy(I.groundColor).multiplyScalar(W*S),s.hemi[M]=j,M++}}_>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_FLOAT_1,s.rectAreaLTC2=lt.LTC_FLOAT_2):(s.rectAreaLTC1=lt.LTC_HALF_1,s.rectAreaLTC2=lt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_FLOAT_1,s.rectAreaLTC2=lt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_HALF_1,s.rectAreaLTC2=lt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=d,s.ambient[2]=g;const U=s.hash;(U.directionalLength!==v||U.pointLength!==m||U.spotLength!==p||U.rectAreaLength!==_||U.hemiLength!==M||U.numDirectionalShadows!==b||U.numPointShadows!==C||U.numSpotShadows!==E||U.numSpotMaps!==x||U.numLightProbes!==y)&&(s.directional.length=v,s.spot.length=p,s.rectArea.length=_,s.point.length=m,s.hemi.length=M,s.directionalShadow.length=b,s.directionalShadowMap.length=b,s.pointShadow.length=C,s.pointShadowMap.length=C,s.spotShadow.length=E,s.spotShadowMap.length=E,s.directionalShadowMatrix.length=b,s.pointShadowMatrix.length=C,s.spotLightMatrix.length=E+x-A,s.spotLightMap.length=x,s.numSpotLightShadowsWithMaps=A,s.numLightProbes=y,U.directionalLength=v,U.pointLength=m,U.spotLength=p,U.rectAreaLength=_,U.hemiLength=M,U.numDirectionalShadows=b,U.numPointShadows=C,U.numSpotShadows=E,U.numSpotMaps=x,U.numLightProbes=y,s.version=k_++)}function h(l,u){let f=0,d=0,g=0,v=0,m=0;const p=u.matrixWorldInverse;for(let _=0,M=l.length;_<M;_++){const b=l[_];if(b.isDirectionalLight){const C=s.directional[f];C.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(p),f++}else if(b.isSpotLight){const C=s.spot[g];C.position.setFromMatrixPosition(b.matrixWorld),C.position.applyMatrix4(p),C.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(p),g++}else if(b.isRectAreaLight){const C=s.rectArea[v];C.position.setFromMatrixPosition(b.matrixWorld),C.position.applyMatrix4(p),a.identity(),o.copy(b.matrixWorld),o.premultiply(p),a.extractRotation(o),C.halfWidth.set(b.width*.5,0,0),C.halfHeight.set(0,b.height*.5,0),C.halfWidth.applyMatrix4(a),C.halfHeight.applyMatrix4(a),v++}else if(b.isPointLight){const C=s.point[d];C.position.setFromMatrixPosition(b.matrixWorld),C.position.applyMatrix4(p),d++}else if(b.isHemisphereLight){const C=s.hemi[m];C.direction.setFromMatrixPosition(b.matrixWorld),C.direction.transformDirection(p),m++}}}return{setup:c,setupView:h,state:s}}function Ah(i,t){const e=new H_(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(u){n.push(u)}function a(u){s.push(u)}function c(u){e.setup(n,u)}function h(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a}}function V_(i,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let c;return a===void 0?(c=new Ah(i,t),e.set(r,[c])):o>=a.length?(c=new Ah(i,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class W_ extends es{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Fp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class G_ extends es{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const $_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,X_=`uniform sampler2D shadow_pass;
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
}`;function j_(i,t,e){let n=new Cc;const s=new ht,r=new ht,o=new de,a=new W_({depthPacking:kp}),c=new G_,h={},l=e.maxTextureSize,u={[Ei]:Qe,[Qe]:Ei,[cn]:cn},f=new Yi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:$_,fragmentShader:X_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Se;g.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ht(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hu;let p=this.type;this.render=function(E,x,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const y=i.getRenderTarget(),S=i.getActiveCubeFace(),U=i.getActiveMipmapLevel(),N=i.state;N.setBlending(vi),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const $=p!==Yn&&this.type===Yn,I=p===Yn&&this.type!==Yn;for(let O=0,W=E.length;O<W;O++){const q=E[O],X=q.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const j=X.getFrameExtents();if(s.multiply(j),r.copy(X.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/j.x),s.x=r.x*j.x,X.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/j.y),s.y=r.y*j.y,X.mapSize.y=r.y)),X.map===null||$===!0||I===!0){const rt=this.type!==Yn?{minFilter:ke,magFilter:ke}:{};X.map!==null&&X.map.dispose(),X.map=new qi(s.x,s.y,rt),X.map.texture.name=q.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const Y=X.getViewportCount();for(let rt=0;rt<Y;rt++){const ct=X.getViewport(rt);o.set(r.x*ct.x,r.y*ct.y,r.x*ct.z,r.y*ct.w),N.viewport(o),X.updateMatrices(q,rt),n=X.getFrustum(),b(x,A,X.camera,q,this.type)}X.isPointLightShadow!==!0&&this.type===Yn&&_(X,A),X.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(y,S,U)};function _(E,x){const A=t.update(v);f.defines.VSM_SAMPLES!==E.blurSamples&&(f.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new qi(s.x,s.y)),f.uniforms.shadow_pass.value=E.map.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(x,null,A,f,v,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(x,null,A,d,v,null)}function M(E,x,A,y){let S=null;const U=A.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(U!==void 0)S=U;else if(S=A.isPointLight===!0?c:a,i.localClippingEnabled&&x.clipShadows===!0&&Array.isArray(x.clippingPlanes)&&x.clippingPlanes.length!==0||x.displacementMap&&x.displacementScale!==0||x.alphaMap&&x.alphaTest>0||x.map&&x.alphaTest>0){const N=S.uuid,$=x.uuid;let I=h[N];I===void 0&&(I={},h[N]=I);let O=I[$];O===void 0&&(O=S.clone(),I[$]=O,x.addEventListener("dispose",C)),S=O}if(S.visible=x.visible,S.wireframe=x.wireframe,y===Yn?S.side=x.shadowSide!==null?x.shadowSide:x.side:S.side=x.shadowSide!==null?x.shadowSide:u[x.side],S.alphaMap=x.alphaMap,S.alphaTest=x.alphaTest,S.map=x.map,S.clipShadows=x.clipShadows,S.clippingPlanes=x.clippingPlanes,S.clipIntersection=x.clipIntersection,S.displacementMap=x.displacementMap,S.displacementScale=x.displacementScale,S.displacementBias=x.displacementBias,S.wireframeLinewidth=x.wireframeLinewidth,S.linewidth=x.linewidth,A.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const N=i.properties.get(S);N.light=A}return S}function b(E,x,A,y,S){if(E.visible===!1)return;if(E.layers.test(x.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&S===Yn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,E.matrixWorld);const $=t.update(E),I=E.material;if(Array.isArray(I)){const O=$.groups;for(let W=0,q=O.length;W<q;W++){const X=O[W],j=I[X.materialIndex];if(j&&j.visible){const Y=M(E,j,y,S);E.onBeforeShadow(i,E,x,A,$,Y,X),i.renderBufferDirect(A,null,$,Y,E,X),E.onAfterShadow(i,E,x,A,$,Y,X)}}}else if(I.visible){const O=M(E,I,y,S);E.onBeforeShadow(i,E,x,A,$,O,null),i.renderBufferDirect(A,null,$,O,E,null),E.onAfterShadow(i,E,x,A,$,O,null)}}const N=E.children;for(let $=0,I=N.length;$<I;$++)b(N[$],x,A,y,S)}function C(E){E.target.removeEventListener("dispose",C);for(const A in h){const y=h[A],S=E.target.uuid;S in y&&(y[S].dispose(),delete y[S])}}}function q_(i,t,e){const n=e.isWebGL2;function s(){let D=!1;const st=new de;let ut=null;const Dt=new de(0,0,0,0);return{setMask:function(Rt){ut!==Rt&&!D&&(i.colorMask(Rt,Rt,Rt,Rt),ut=Rt)},setLocked:function(Rt){D=Rt},setClear:function(Rt,Qt,te,ve,ye){ye===!0&&(Rt*=ve,Qt*=ve,te*=ve),st.set(Rt,Qt,te,ve),Dt.equals(st)===!1&&(i.clearColor(Rt,Qt,te,ve),Dt.copy(st))},reset:function(){D=!1,ut=null,Dt.set(-1,0,0,0)}}}function r(){let D=!1,st=null,ut=null,Dt=null;return{setTest:function(Rt){Rt?Bt(i.DEPTH_TEST):Lt(i.DEPTH_TEST)},setMask:function(Rt){st!==Rt&&!D&&(i.depthMask(Rt),st=Rt)},setFunc:function(Rt){if(ut!==Rt){switch(Rt){case mp:i.depthFunc(i.NEVER);break;case gp:i.depthFunc(i.ALWAYS);break;case vp:i.depthFunc(i.LESS);break;case To:i.depthFunc(i.LEQUAL);break;case _p:i.depthFunc(i.EQUAL);break;case xp:i.depthFunc(i.GEQUAL);break;case yp:i.depthFunc(i.GREATER);break;case Mp:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ut=Rt}},setLocked:function(Rt){D=Rt},setClear:function(Rt){Dt!==Rt&&(i.clearDepth(Rt),Dt=Rt)},reset:function(){D=!1,st=null,ut=null,Dt=null}}}function o(){let D=!1,st=null,ut=null,Dt=null,Rt=null,Qt=null,te=null,ve=null,ye=null;return{setTest:function(ee){D||(ee?Bt(i.STENCIL_TEST):Lt(i.STENCIL_TEST))},setMask:function(ee){st!==ee&&!D&&(i.stencilMask(ee),st=ee)},setFunc:function(ee,we,Rn){(ut!==ee||Dt!==we||Rt!==Rn)&&(i.stencilFunc(ee,we,Rn),ut=ee,Dt=we,Rt=Rn)},setOp:function(ee,we,Rn){(Qt!==ee||te!==we||ve!==Rn)&&(i.stencilOp(ee,we,Rn),Qt=ee,te=we,ve=Rn)},setLocked:function(ee){D=ee},setClear:function(ee){ye!==ee&&(i.clearStencil(ee),ye=ee)},reset:function(){D=!1,st=null,ut=null,Dt=null,Rt=null,Qt=null,te=null,ve=null,ye=null}}}const a=new s,c=new r,h=new o,l=new WeakMap,u=new WeakMap;let f={},d={},g=new WeakMap,v=[],m=null,p=!1,_=null,M=null,b=null,C=null,E=null,x=null,A=null,y=new jt(0,0,0),S=0,U=!1,N=null,$=null,I=null,O=null,W=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,j=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(Y)[1]),X=j>=1):Y.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),X=j>=2);let rt=null,ct={};const G=i.getParameter(i.SCISSOR_BOX),K=i.getParameter(i.VIEWPORT),pt=new de().fromArray(G),wt=new de().fromArray(K);function bt(D,st,ut,Dt){const Rt=new Uint8Array(4),Qt=i.createTexture();i.bindTexture(D,Qt),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let te=0;te<ut;te++)n&&(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)?i.texImage3D(st,0,i.RGBA,1,1,Dt,0,i.RGBA,i.UNSIGNED_BYTE,Rt):i.texImage2D(st+te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Rt);return Qt}const kt={};kt[i.TEXTURE_2D]=bt(i.TEXTURE_2D,i.TEXTURE_2D,1),kt[i.TEXTURE_CUBE_MAP]=bt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(kt[i.TEXTURE_2D_ARRAY]=bt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),kt[i.TEXTURE_3D]=bt(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),h.setClear(0),Bt(i.DEPTH_TEST),c.setFunc(To),Wt(!1),R(cl),Bt(i.CULL_FACE),xt(vi);function Bt(D){f[D]!==!0&&(i.enable(D),f[D]=!0)}function Lt(D){f[D]!==!1&&(i.disable(D),f[D]=!1)}function Zt(D,st){return d[D]!==st?(i.bindFramebuffer(D,st),d[D]=st,n&&(D===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=st),D===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=st)),!0):!1}function k(D,st){let ut=v,Dt=!1;if(D)if(ut=g.get(st),ut===void 0&&(ut=[],g.set(st,ut)),D.isWebGLMultipleRenderTargets){const Rt=D.texture;if(ut.length!==Rt.length||ut[0]!==i.COLOR_ATTACHMENT0){for(let Qt=0,te=Rt.length;Qt<te;Qt++)ut[Qt]=i.COLOR_ATTACHMENT0+Qt;ut.length=Rt.length,Dt=!0}}else ut[0]!==i.COLOR_ATTACHMENT0&&(ut[0]=i.COLOR_ATTACHMENT0,Dt=!0);else ut[0]!==i.BACK&&(ut[0]=i.BACK,Dt=!0);Dt&&(e.isWebGL2?i.drawBuffers(ut):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ut))}function Fe(D){return m!==D?(i.useProgram(D),m=D,!0):!1}const At={[ki]:i.FUNC_ADD,[tp]:i.FUNC_SUBTRACT,[ep]:i.FUNC_REVERSE_SUBTRACT};if(n)At[fl]=i.MIN,At[dl]=i.MAX;else{const D=t.get("EXT_blend_minmax");D!==null&&(At[fl]=D.MIN_EXT,At[dl]=D.MAX_EXT)}const Ut={[np]:i.ZERO,[ip]:i.ONE,[sp]:i.SRC_COLOR,[nc]:i.SRC_ALPHA,[hp]:i.SRC_ALPHA_SATURATE,[cp]:i.DST_COLOR,[op]:i.DST_ALPHA,[rp]:i.ONE_MINUS_SRC_COLOR,[ic]:i.ONE_MINUS_SRC_ALPHA,[lp]:i.ONE_MINUS_DST_COLOR,[ap]:i.ONE_MINUS_DST_ALPHA,[up]:i.CONSTANT_COLOR,[fp]:i.ONE_MINUS_CONSTANT_COLOR,[dp]:i.CONSTANT_ALPHA,[pp]:i.ONE_MINUS_CONSTANT_ALPHA};function xt(D,st,ut,Dt,Rt,Qt,te,ve,ye,ee){if(D===vi){p===!0&&(Lt(i.BLEND),p=!1);return}if(p===!1&&(Bt(i.BLEND),p=!0),D!==Qd){if(D!==_||ee!==U){if((M!==ki||E!==ki)&&(i.blendEquation(i.FUNC_ADD),M=ki,E=ki),ee)switch(D){case Cs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ll:i.blendFunc(i.ONE,i.ONE);break;case hl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ul:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Cs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ll:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case hl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ul:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}b=null,C=null,x=null,A=null,y.set(0,0,0),S=0,_=D,U=ee}return}Rt=Rt||st,Qt=Qt||ut,te=te||Dt,(st!==M||Rt!==E)&&(i.blendEquationSeparate(At[st],At[Rt]),M=st,E=Rt),(ut!==b||Dt!==C||Qt!==x||te!==A)&&(i.blendFuncSeparate(Ut[ut],Ut[Dt],Ut[Qt],Ut[te]),b=ut,C=Dt,x=Qt,A=te),(ve.equals(y)===!1||ye!==S)&&(i.blendColor(ve.r,ve.g,ve.b,ye),y.copy(ve),S=ye),_=D,U=!1}function ue(D,st){D.side===cn?Lt(i.CULL_FACE):Bt(i.CULL_FACE);let ut=D.side===Qe;st&&(ut=!ut),Wt(ut),D.blending===Cs&&D.transparent===!1?xt(vi):xt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),c.setFunc(D.depthFunc),c.setTest(D.depthTest),c.setMask(D.depthWrite),a.setMask(D.colorWrite);const Dt=D.stencilWrite;h.setTest(Dt),Dt&&(h.setMask(D.stencilWriteMask),h.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),h.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),F(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Bt(i.SAMPLE_ALPHA_TO_COVERAGE):Lt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Wt(D){N!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),N=D)}function R(D){D!==Jd?(Bt(i.CULL_FACE),D!==$&&(D===cl?i.cullFace(i.BACK):D===Zd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Lt(i.CULL_FACE),$=D}function w(D){D!==I&&(X&&i.lineWidth(D),I=D)}function F(D,st,ut){D?(Bt(i.POLYGON_OFFSET_FILL),(O!==st||W!==ut)&&(i.polygonOffset(st,ut),O=st,W=ut)):Lt(i.POLYGON_OFFSET_FILL)}function et(D){D?Bt(i.SCISSOR_TEST):Lt(i.SCISSOR_TEST)}function Z(D){D===void 0&&(D=i.TEXTURE0+q-1),rt!==D&&(i.activeTexture(D),rt=D)}function nt(D,st,ut){ut===void 0&&(rt===null?ut=i.TEXTURE0+q-1:ut=rt);let Dt=ct[ut];Dt===void 0&&(Dt={type:void 0,texture:void 0},ct[ut]=Dt),(Dt.type!==D||Dt.texture!==st)&&(rt!==ut&&(i.activeTexture(ut),rt=ut),i.bindTexture(D,st||kt[D]),Dt.type=D,Dt.texture=st)}function Mt(){const D=ct[rt];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function ft(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _t(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ct(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Gt(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function se(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function qt(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Nt(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Tt(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function mt(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function L(D){pt.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),pt.copy(D))}function it(D){wt.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),wt.copy(D))}function St(D,st){let ut=u.get(st);ut===void 0&&(ut=new WeakMap,u.set(st,ut));let Dt=ut.get(D);Dt===void 0&&(Dt=i.getUniformBlockIndex(st,D.name),ut.set(D,Dt))}function vt(D,st){const Dt=u.get(st).get(D);l.get(st)!==Dt&&(i.uniformBlockBinding(st,Dt,D.__bindingPointIndex),l.set(st,Dt))}function Q(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},rt=null,ct={},d={},g=new WeakMap,v=[],m=null,p=!1,_=null,M=null,b=null,C=null,E=null,x=null,A=null,y=new jt(0,0,0),S=0,U=!1,N=null,$=null,I=null,O=null,W=null,pt.set(0,0,i.canvas.width,i.canvas.height),wt.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),h.reset()}return{buffers:{color:a,depth:c,stencil:h},enable:Bt,disable:Lt,bindFramebuffer:Zt,drawBuffers:k,useProgram:Fe,setBlending:xt,setMaterial:ue,setFlipSided:Wt,setCullFace:R,setLineWidth:w,setPolygonOffset:F,setScissorTest:et,activeTexture:Z,bindTexture:nt,unbindTexture:Mt,compressedTexImage2D:ft,compressedTexImage3D:_t,texImage2D:Tt,texImage3D:mt,updateUBOMapping:St,uniformBlockBinding:vt,texStorage2D:qt,texStorage3D:Nt,texSubImage2D:Ct,texSubImage3D:Gt,compressedTexSubImage2D:J,compressedTexSubImage3D:se,scissor:L,viewport:it,reset:Q}}function Y_(i,t,e,n,s,r,o){const a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,w){return d?new OffscreenCanvas(R,w):Do("canvas")}function v(R,w,F,et){let Z=1;if((R.width>et||R.height>et)&&(Z=et/Math.max(R.width,R.height)),Z<1||w===!0)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap){const nt=w?lc:Math.floor,Mt=nt(Z*R.width),ft=nt(Z*R.height);u===void 0&&(u=g(Mt,ft));const _t=F?g(Mt,ft):u;return _t.width=Mt,_t.height=ft,_t.getContext("2d").drawImage(R,0,0,Mt,ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+R.width+"x"+R.height+") to ("+Mt+"x"+ft+")."),_t}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+R.width+"x"+R.height+")."),R;return R}function m(R){return Wl(R.width)&&Wl(R.height)}function p(R){return a?!1:R.wrapS!==Sn||R.wrapT!==Sn||R.minFilter!==ke&&R.minFilter!==Ze}function _(R,w){return R.generateMipmaps&&w&&R.minFilter!==ke&&R.minFilter!==Ze}function M(R){i.generateMipmap(R)}function b(R,w,F,et,Z=!1){if(a===!1)return w;if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let nt=w;if(w===i.RED&&(F===i.FLOAT&&(nt=i.R32F),F===i.HALF_FLOAT&&(nt=i.R16F),F===i.UNSIGNED_BYTE&&(nt=i.R8)),w===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(nt=i.R8UI),F===i.UNSIGNED_SHORT&&(nt=i.R16UI),F===i.UNSIGNED_INT&&(nt=i.R32UI),F===i.BYTE&&(nt=i.R8I),F===i.SHORT&&(nt=i.R16I),F===i.INT&&(nt=i.R32I)),w===i.RG&&(F===i.FLOAT&&(nt=i.RG32F),F===i.HALF_FLOAT&&(nt=i.RG16F),F===i.UNSIGNED_BYTE&&(nt=i.RG8)),w===i.RGBA){const Mt=Z?Ro:ae.getTransfer(et);F===i.FLOAT&&(nt=i.RGBA32F),F===i.HALF_FLOAT&&(nt=i.RGBA16F),F===i.UNSIGNED_BYTE&&(nt=Mt===fe?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(nt=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(nt=i.RGB5_A1)}return(nt===i.R16F||nt===i.R32F||nt===i.RG16F||nt===i.RG32F||nt===i.RGBA16F||nt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function C(R,w,F){return _(R,F)===!0||R.isFramebufferTexture&&R.minFilter!==ke&&R.minFilter!==Ze?Math.log2(Math.max(w.width,w.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?w.mipmaps.length:1}function E(R){return R===ke||R===pl||R===oa?i.NEAREST:i.LINEAR}function x(R){const w=R.target;w.removeEventListener("dispose",x),y(w),w.isVideoTexture&&l.delete(w)}function A(R){const w=R.target;w.removeEventListener("dispose",A),U(w)}function y(R){const w=n.get(R);if(w.__webglInit===void 0)return;const F=R.source,et=f.get(F);if(et){const Z=et[w.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&S(R),Object.keys(et).length===0&&f.delete(F)}n.remove(R)}function S(R){const w=n.get(R);i.deleteTexture(w.__webglTexture);const F=R.source,et=f.get(F);delete et[w.__cacheKey],o.memory.textures--}function U(R){const w=R.texture,F=n.get(R),et=n.get(w);if(et.__webglTexture!==void 0&&(i.deleteTexture(et.__webglTexture),o.memory.textures--),R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(F.__webglFramebuffer[Z]))for(let nt=0;nt<F.__webglFramebuffer[Z].length;nt++)i.deleteFramebuffer(F.__webglFramebuffer[Z][nt]);else i.deleteFramebuffer(F.__webglFramebuffer[Z]);F.__webglDepthbuffer&&i.deleteRenderbuffer(F.__webglDepthbuffer[Z])}else{if(Array.isArray(F.__webglFramebuffer))for(let Z=0;Z<F.__webglFramebuffer.length;Z++)i.deleteFramebuffer(F.__webglFramebuffer[Z]);else i.deleteFramebuffer(F.__webglFramebuffer);if(F.__webglDepthbuffer&&i.deleteRenderbuffer(F.__webglDepthbuffer),F.__webglMultisampledFramebuffer&&i.deleteFramebuffer(F.__webglMultisampledFramebuffer),F.__webglColorRenderbuffer)for(let Z=0;Z<F.__webglColorRenderbuffer.length;Z++)F.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(F.__webglColorRenderbuffer[Z]);F.__webglDepthRenderbuffer&&i.deleteRenderbuffer(F.__webglDepthRenderbuffer)}if(R.isWebGLMultipleRenderTargets)for(let Z=0,nt=w.length;Z<nt;Z++){const Mt=n.get(w[Z]);Mt.__webglTexture&&(i.deleteTexture(Mt.__webglTexture),o.memory.textures--),n.remove(w[Z])}n.remove(w),n.remove(R)}let N=0;function $(){N=0}function I(){const R=N;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),N+=1,R}function O(R){const w=[];return w.push(R.wrapS),w.push(R.wrapT),w.push(R.wrapR||0),w.push(R.magFilter),w.push(R.minFilter),w.push(R.anisotropy),w.push(R.internalFormat),w.push(R.format),w.push(R.type),w.push(R.generateMipmaps),w.push(R.premultiplyAlpha),w.push(R.flipY),w.push(R.unpackAlignment),w.push(R.colorSpace),w.join()}function W(R,w){const F=n.get(R);if(R.isVideoTexture&&ue(R),R.isRenderTargetTexture===!1&&R.version>0&&F.__version!==R.version){const et=R.image;if(et===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(et.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{pt(F,R,w);return}}e.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+w)}function q(R,w){const F=n.get(R);if(R.version>0&&F.__version!==R.version){pt(F,R,w);return}e.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+w)}function X(R,w){const F=n.get(R);if(R.version>0&&F.__version!==R.version){pt(F,R,w);return}e.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+w)}function j(R,w){const F=n.get(R);if(R.version>0&&F.__version!==R.version){wt(F,R,w);return}e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+w)}const Y={[Ao]:i.REPEAT,[Sn]:i.CLAMP_TO_EDGE,[oc]:i.MIRRORED_REPEAT},rt={[ke]:i.NEAREST,[pl]:i.NEAREST_MIPMAP_NEAREST,[oa]:i.NEAREST_MIPMAP_LINEAR,[Ze]:i.LINEAR,[Cp]:i.LINEAR_MIPMAP_NEAREST,[yr]:i.LINEAR_MIPMAP_LINEAR},ct={[Hp]:i.NEVER,[jp]:i.ALWAYS,[Vp]:i.LESS,[Qu]:i.LEQUAL,[Wp]:i.EQUAL,[Xp]:i.GEQUAL,[Gp]:i.GREATER,[$p]:i.NOTEQUAL};function G(R,w,F){if(F?(i.texParameteri(R,i.TEXTURE_WRAP_S,Y[w.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,Y[w.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,Y[w.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,rt[w.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,rt[w.minFilter])):(i.texParameteri(R,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(R,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(w.wrapS!==Sn||w.wrapT!==Sn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(R,i.TEXTURE_MAG_FILTER,E(w.magFilter)),i.texParameteri(R,i.TEXTURE_MIN_FILTER,E(w.minFilter)),w.minFilter!==ke&&w.minFilter!==Ze&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),w.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,ct[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const et=t.get("EXT_texture_filter_anisotropic");if(w.magFilter===ke||w.minFilter!==oa&&w.minFilter!==yr||w.type===mi&&t.has("OES_texture_float_linear")===!1||a===!1&&w.type===Mr&&t.has("OES_texture_half_float_linear")===!1)return;(w.anisotropy>1||n.get(w).__currentAnisotropy)&&(i.texParameterf(R,et.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy)}}function K(R,w){let F=!1;R.__webglInit===void 0&&(R.__webglInit=!0,w.addEventListener("dispose",x));const et=w.source;let Z=f.get(et);Z===void 0&&(Z={},f.set(et,Z));const nt=O(w);if(nt!==R.__cacheKey){Z[nt]===void 0&&(Z[nt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,F=!0),Z[nt].usedTimes++;const Mt=Z[R.__cacheKey];Mt!==void 0&&(Z[R.__cacheKey].usedTimes--,Mt.usedTimes===0&&S(w)),R.__cacheKey=nt,R.__webglTexture=Z[nt].texture}return F}function pt(R,w,F){let et=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(et=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(et=i.TEXTURE_3D);const Z=K(R,w),nt=w.source;e.bindTexture(et,R.__webglTexture,i.TEXTURE0+F);const Mt=n.get(nt);if(nt.version!==Mt.__version||Z===!0){e.activeTexture(i.TEXTURE0+F);const ft=ae.getPrimaries(ae.workingColorSpace),_t=w.colorSpace===mn?null:ae.getPrimaries(w.colorSpace),Ct=w.colorSpace===mn||ft===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ct);const Gt=p(w)&&m(w.image)===!1;let J=v(w.image,Gt,!1,s.maxTextureSize);J=Wt(w,J);const se=m(J)||a,qt=r.convert(w.format,w.colorSpace);let Nt=r.convert(w.type),Tt=b(w.internalFormat,qt,Nt,w.colorSpace,w.isVideoTexture);G(et,w,se);let mt;const L=w.mipmaps,it=a&&w.isVideoTexture!==!0&&Tt!==Ju,St=Mt.__version===void 0||Z===!0,vt=C(w,J,se);if(w.isDepthTexture)Tt=i.DEPTH_COMPONENT,a?w.type===mi?Tt=i.DEPTH_COMPONENT32F:w.type===pi?Tt=i.DEPTH_COMPONENT24:w.type===Wi?Tt=i.DEPTH24_STENCIL8:Tt=i.DEPTH_COMPONENT16:w.type===mi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),w.format===Gi&&Tt===i.DEPTH_COMPONENT&&w.type!==Ec&&w.type!==pi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),w.type=pi,Nt=r.convert(w.type)),w.format===Fs&&Tt===i.DEPTH_COMPONENT&&(Tt=i.DEPTH_STENCIL,w.type!==Wi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),w.type=Wi,Nt=r.convert(w.type))),St&&(it?e.texStorage2D(i.TEXTURE_2D,1,Tt,J.width,J.height):e.texImage2D(i.TEXTURE_2D,0,Tt,J.width,J.height,0,qt,Nt,null));else if(w.isDataTexture)if(L.length>0&&se){it&&St&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,L[0].width,L[0].height);for(let Q=0,D=L.length;Q<D;Q++)mt=L[Q],it?e.texSubImage2D(i.TEXTURE_2D,Q,0,0,mt.width,mt.height,qt,Nt,mt.data):e.texImage2D(i.TEXTURE_2D,Q,Tt,mt.width,mt.height,0,qt,Nt,mt.data);w.generateMipmaps=!1}else it?(St&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,J.width,J.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,J.width,J.height,qt,Nt,J.data)):e.texImage2D(i.TEXTURE_2D,0,Tt,J.width,J.height,0,qt,Nt,J.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){it&&St&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,Tt,L[0].width,L[0].height,J.depth);for(let Q=0,D=L.length;Q<D;Q++)mt=L[Q],w.format!==pn?qt!==null?it?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,mt.width,mt.height,J.depth,qt,mt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,Tt,mt.width,mt.height,J.depth,0,mt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):it?e.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,mt.width,mt.height,J.depth,qt,Nt,mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Q,Tt,mt.width,mt.height,J.depth,0,qt,Nt,mt.data)}else{it&&St&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,L[0].width,L[0].height);for(let Q=0,D=L.length;Q<D;Q++)mt=L[Q],w.format!==pn?qt!==null?it?e.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,mt.width,mt.height,qt,mt.data):e.compressedTexImage2D(i.TEXTURE_2D,Q,Tt,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):it?e.texSubImage2D(i.TEXTURE_2D,Q,0,0,mt.width,mt.height,qt,Nt,mt.data):e.texImage2D(i.TEXTURE_2D,Q,Tt,mt.width,mt.height,0,qt,Nt,mt.data)}else if(w.isDataArrayTexture)it?(St&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,Tt,J.width,J.height,J.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,qt,Nt,J.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Tt,J.width,J.height,J.depth,0,qt,Nt,J.data);else if(w.isData3DTexture)it?(St&&e.texStorage3D(i.TEXTURE_3D,vt,Tt,J.width,J.height,J.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,qt,Nt,J.data)):e.texImage3D(i.TEXTURE_3D,0,Tt,J.width,J.height,J.depth,0,qt,Nt,J.data);else if(w.isFramebufferTexture){if(St)if(it)e.texStorage2D(i.TEXTURE_2D,vt,Tt,J.width,J.height);else{let Q=J.width,D=J.height;for(let st=0;st<vt;st++)e.texImage2D(i.TEXTURE_2D,st,Tt,Q,D,0,qt,Nt,null),Q>>=1,D>>=1}}else if(L.length>0&&se){it&&St&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,L[0].width,L[0].height);for(let Q=0,D=L.length;Q<D;Q++)mt=L[Q],it?e.texSubImage2D(i.TEXTURE_2D,Q,0,0,qt,Nt,mt):e.texImage2D(i.TEXTURE_2D,Q,Tt,qt,Nt,mt);w.generateMipmaps=!1}else it?(St&&e.texStorage2D(i.TEXTURE_2D,vt,Tt,J.width,J.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,qt,Nt,J)):e.texImage2D(i.TEXTURE_2D,0,Tt,qt,Nt,J);_(w,se)&&M(et),Mt.__version=nt.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function wt(R,w,F){if(w.image.length!==6)return;const et=K(R,w),Z=w.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+F);const nt=n.get(Z);if(Z.version!==nt.__version||et===!0){e.activeTexture(i.TEXTURE0+F);const Mt=ae.getPrimaries(ae.workingColorSpace),ft=w.colorSpace===mn?null:ae.getPrimaries(w.colorSpace),_t=w.colorSpace===mn||Mt===ft?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const Ct=w.isCompressedTexture||w.image[0].isCompressedTexture,Gt=w.image[0]&&w.image[0].isDataTexture,J=[];for(let Q=0;Q<6;Q++)!Ct&&!Gt?J[Q]=v(w.image[Q],!1,!0,s.maxCubemapSize):J[Q]=Gt?w.image[Q].image:w.image[Q],J[Q]=Wt(w,J[Q]);const se=J[0],qt=m(se)||a,Nt=r.convert(w.format,w.colorSpace),Tt=r.convert(w.type),mt=b(w.internalFormat,Nt,Tt,w.colorSpace),L=a&&w.isVideoTexture!==!0,it=nt.__version===void 0||et===!0;let St=C(w,se,qt);G(i.TEXTURE_CUBE_MAP,w,qt);let vt;if(Ct){L&&it&&e.texStorage2D(i.TEXTURE_CUBE_MAP,St,mt,se.width,se.height);for(let Q=0;Q<6;Q++){vt=J[Q].mipmaps;for(let D=0;D<vt.length;D++){const st=vt[D];w.format!==pn?Nt!==null?L?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,D,0,0,st.width,st.height,Nt,st.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,D,mt,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,D,0,0,st.width,st.height,Nt,Tt,st.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,D,mt,st.width,st.height,0,Nt,Tt,st.data)}}}else{vt=w.mipmaps,L&&it&&(vt.length>0&&St++,e.texStorage2D(i.TEXTURE_CUBE_MAP,St,mt,J[0].width,J[0].height));for(let Q=0;Q<6;Q++)if(Gt){L?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,J[Q].width,J[Q].height,Nt,Tt,J[Q].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,mt,J[Q].width,J[Q].height,0,Nt,Tt,J[Q].data);for(let D=0;D<vt.length;D++){const ut=vt[D].image[Q].image;L?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,D+1,0,0,ut.width,ut.height,Nt,Tt,ut.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,D+1,mt,ut.width,ut.height,0,Nt,Tt,ut.data)}}else{L?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Nt,Tt,J[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,mt,Nt,Tt,J[Q]);for(let D=0;D<vt.length;D++){const st=vt[D];L?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,D+1,0,0,Nt,Tt,st.image[Q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,D+1,mt,Nt,Tt,st.image[Q])}}}_(w,qt)&&M(i.TEXTURE_CUBE_MAP),nt.__version=Z.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function bt(R,w,F,et,Z,nt){const Mt=r.convert(F.format,F.colorSpace),ft=r.convert(F.type),_t=b(F.internalFormat,Mt,ft,F.colorSpace);if(!n.get(w).__hasExternalTextures){const Gt=Math.max(1,w.width>>nt),J=Math.max(1,w.height>>nt);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?e.texImage3D(Z,nt,_t,Gt,J,w.depth,0,Mt,ft,null):e.texImage2D(Z,nt,_t,Gt,J,0,Mt,ft,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),xt(w)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,et,Z,n.get(F).__webglTexture,0,Ut(w)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,et,Z,n.get(F).__webglTexture,nt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function kt(R,w,F){if(i.bindRenderbuffer(i.RENDERBUFFER,R),w.depthBuffer&&!w.stencilBuffer){let et=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(F||xt(w)){const Z=w.depthTexture;Z&&Z.isDepthTexture&&(Z.type===mi?et=i.DEPTH_COMPONENT32F:Z.type===pi&&(et=i.DEPTH_COMPONENT24));const nt=Ut(w);xt(w)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,et,w.width,w.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,et,w.width,w.height)}else i.renderbufferStorage(i.RENDERBUFFER,et,w.width,w.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,R)}else if(w.depthBuffer&&w.stencilBuffer){const et=Ut(w);F&&xt(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,et,i.DEPTH24_STENCIL8,w.width,w.height):xt(w)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,et,i.DEPTH24_STENCIL8,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,R)}else{const et=w.isWebGLMultipleRenderTargets===!0?w.texture:[w.texture];for(let Z=0;Z<et.length;Z++){const nt=et[Z],Mt=r.convert(nt.format,nt.colorSpace),ft=r.convert(nt.type),_t=b(nt.internalFormat,Mt,ft,nt.colorSpace),Ct=Ut(w);F&&xt(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,_t,w.width,w.height):xt(w)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ct,_t,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,_t,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Bt(R,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),W(w.depthTexture,0);const et=n.get(w.depthTexture).__webglTexture,Z=Ut(w);if(w.depthTexture.format===Gi)xt(w)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0);else if(w.depthTexture.format===Fs)xt(w)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function Lt(R){const w=n.get(R),F=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!w.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");Bt(w.__webglFramebuffer,R)}else if(F){w.__webglDepthbuffer=[];for(let et=0;et<6;et++)e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[et]),w.__webglDepthbuffer[et]=i.createRenderbuffer(),kt(w.__webglDepthbuffer[et],R,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer=i.createRenderbuffer(),kt(w.__webglDepthbuffer,R,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Zt(R,w,F){const et=n.get(R);w!==void 0&&bt(et.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&Lt(R)}function k(R){const w=R.texture,F=n.get(R),et=n.get(w);R.addEventListener("dispose",A),R.isWebGLMultipleRenderTargets!==!0&&(et.__webglTexture===void 0&&(et.__webglTexture=i.createTexture()),et.__version=w.version,o.memory.textures++);const Z=R.isWebGLCubeRenderTarget===!0,nt=R.isWebGLMultipleRenderTargets===!0,Mt=m(R)||a;if(Z){F.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(a&&w.mipmaps&&w.mipmaps.length>0){F.__webglFramebuffer[ft]=[];for(let _t=0;_t<w.mipmaps.length;_t++)F.__webglFramebuffer[ft][_t]=i.createFramebuffer()}else F.__webglFramebuffer[ft]=i.createFramebuffer()}else{if(a&&w.mipmaps&&w.mipmaps.length>0){F.__webglFramebuffer=[];for(let ft=0;ft<w.mipmaps.length;ft++)F.__webglFramebuffer[ft]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(nt)if(s.drawBuffers){const ft=R.texture;for(let _t=0,Ct=ft.length;_t<Ct;_t++){const Gt=n.get(ft[_t]);Gt.__webglTexture===void 0&&(Gt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&R.samples>0&&xt(R)===!1){const ft=nt?w:[w];F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let _t=0;_t<ft.length;_t++){const Ct=ft[_t];F.__webglColorRenderbuffer[_t]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[_t]);const Gt=r.convert(Ct.format,Ct.colorSpace),J=r.convert(Ct.type),se=b(Ct.internalFormat,Gt,J,Ct.colorSpace,R.isXRRenderTarget===!0),qt=Ut(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,qt,se,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,F.__webglColorRenderbuffer[_t])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),kt(F.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,et.__webglTexture),G(i.TEXTURE_CUBE_MAP,w,Mt);for(let ft=0;ft<6;ft++)if(a&&w.mipmaps&&w.mipmaps.length>0)for(let _t=0;_t<w.mipmaps.length;_t++)bt(F.__webglFramebuffer[ft][_t],R,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,_t);else bt(F.__webglFramebuffer[ft],R,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);_(w,Mt)&&M(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(nt){const ft=R.texture;for(let _t=0,Ct=ft.length;_t<Ct;_t++){const Gt=ft[_t],J=n.get(Gt);e.bindTexture(i.TEXTURE_2D,J.__webglTexture),G(i.TEXTURE_2D,Gt,Mt),bt(F.__webglFramebuffer,R,Gt,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,0),_(Gt,Mt)&&M(i.TEXTURE_2D)}e.unbindTexture()}else{let ft=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(a?ft=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(ft,et.__webglTexture),G(ft,w,Mt),a&&w.mipmaps&&w.mipmaps.length>0)for(let _t=0;_t<w.mipmaps.length;_t++)bt(F.__webglFramebuffer[_t],R,w,i.COLOR_ATTACHMENT0,ft,_t);else bt(F.__webglFramebuffer,R,w,i.COLOR_ATTACHMENT0,ft,0);_(w,Mt)&&M(ft),e.unbindTexture()}R.depthBuffer&&Lt(R)}function Fe(R){const w=m(R)||a,F=R.isWebGLMultipleRenderTargets===!0?R.texture:[R.texture];for(let et=0,Z=F.length;et<Z;et++){const nt=F[et];if(_(nt,w)){const Mt=R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ft=n.get(nt).__webglTexture;e.bindTexture(Mt,ft),M(Mt),e.unbindTexture()}}}function At(R){if(a&&R.samples>0&&xt(R)===!1){const w=R.isWebGLMultipleRenderTargets?R.texture:[R.texture],F=R.width,et=R.height;let Z=i.COLOR_BUFFER_BIT;const nt=[],Mt=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=n.get(R),_t=R.isWebGLMultipleRenderTargets===!0;if(_t)for(let Ct=0;Ct<w.length;Ct++)e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ct,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ct,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ft.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ft.__webglFramebuffer);for(let Ct=0;Ct<w.length;Ct++){nt.push(i.COLOR_ATTACHMENT0+Ct),R.depthBuffer&&nt.push(Mt);const Gt=ft.__ignoreDepthValues!==void 0?ft.__ignoreDepthValues:!1;if(Gt===!1&&(R.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),_t&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ft.__webglColorRenderbuffer[Ct]),Gt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Mt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Mt])),_t){const J=n.get(w[Ct]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,J,0)}i.blitFramebuffer(0,0,F,et,0,0,F,et,Z,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,nt)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),_t)for(let Ct=0;Ct<w.length;Ct++){e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ct,i.RENDERBUFFER,ft.__webglColorRenderbuffer[Ct]);const Gt=n.get(w[Ct]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ct,i.TEXTURE_2D,Gt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ft.__webglMultisampledFramebuffer)}}function Ut(R){return Math.min(s.maxSamples,R.samples)}function xt(R){const w=n.get(R);return a&&R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function ue(R){const w=o.render.frame;l.get(R)!==w&&(l.set(R,w),R.update())}function Wt(R,w){const F=R.colorSpace,et=R.format,Z=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||R.format===ac||F!==ni&&F!==mn&&(ae.getTransfer(F)===fe?a===!1?t.has("EXT_sRGB")===!0&&et===pn?(R.format=ac,R.minFilter=Ze,R.generateMipmaps=!1):w=ef.sRGBToLinear(w):(et!==pn||Z!==xi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),w}this.allocateTextureUnit=I,this.resetTextureUnits=$,this.setTexture2D=W,this.setTexture2DArray=q,this.setTexture3D=X,this.setTextureCube=j,this.rebindTextures=Zt,this.setupRenderTarget=k,this.updateRenderTargetMipmap=Fe,this.updateMultisampleRenderTarget=At,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=xt}function K_(i,t,e){const n=e.isWebGL2;function s(r,o=mn){let a;const c=ae.getTransfer(o);if(r===xi)return i.UNSIGNED_BYTE;if(r===Xu)return i.UNSIGNED_SHORT_4_4_4_4;if(r===ju)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Pp)return i.BYTE;if(r===Lp)return i.SHORT;if(r===Ec)return i.UNSIGNED_SHORT;if(r===$u)return i.INT;if(r===pi)return i.UNSIGNED_INT;if(r===mi)return i.FLOAT;if(r===Mr)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Dp)return i.ALPHA;if(r===pn)return i.RGBA;if(r===Ip)return i.LUMINANCE;if(r===Up)return i.LUMINANCE_ALPHA;if(r===Gi)return i.DEPTH_COMPONENT;if(r===Fs)return i.DEPTH_STENCIL;if(r===ac)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Np)return i.RED;if(r===qu)return i.RED_INTEGER;if(r===zp)return i.RG;if(r===Yu)return i.RG_INTEGER;if(r===Ku)return i.RGBA_INTEGER;if(r===aa||r===ca||r===la||r===ha)if(c===fe)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===aa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ca)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===la)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ha)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===aa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ca)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===la)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ha)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===ml||r===gl||r===vl||r===_l)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===ml)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===gl)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===vl)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===_l)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Ju)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===xl||r===yl)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===xl)return c===fe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===yl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ml||r===bl||r===Sl||r===wl||r===El||r===Tl||r===Al||r===Rl||r===Cl||r===Pl||r===Ll||r===Dl||r===Il||r===Ul)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Ml)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===bl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Sl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===wl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===El)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Tl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Al)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Rl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Cl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Pl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ll)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Dl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Il)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ul)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ua||r===Nl||r===zl)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===ua)return c===fe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Nl)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===zl)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Op||r===Ol||r===Fl||r===kl)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===ua)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Ol)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Fl)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===kl)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Wi?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class J_ extends an{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ot extends ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Z_={type:"move"};class Na{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ot,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ot,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ot,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(h,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],f=l.position.distanceTo(u.position),d=.02,g=.005;h.inputState.pinching&&f>d+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&f<=d-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Z_)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ot;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Q_ extends Qi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,h=null,l=null,u=null,f=null,d=null,g=null;const v=e.getContextAttributes();let m=null,p=null;const _=[],M=[],b=new ht;let C=null;const E=new an;E.layers.enable(1),E.viewport=new de;const x=new an;x.layers.enable(2),x.viewport=new de;const A=[E,x],y=new J_;y.layers.enable(1),y.layers.enable(2);let S=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let K=_[G];return K===void 0&&(K=new Na,_[G]=K),K.getTargetRaySpace()},this.getControllerGrip=function(G){let K=_[G];return K===void 0&&(K=new Na,_[G]=K),K.getGripSpace()},this.getHand=function(G){let K=_[G];return K===void 0&&(K=new Na,_[G]=K),K.getHandSpace()};function N(G){const K=M.indexOf(G.inputSource);if(K===-1)return;const pt=_[K];pt!==void 0&&(pt.update(G.inputSource,G.frame,h||o),pt.dispatchEvent({type:G.type,data:G.inputSource}))}function $(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",I);for(let G=0;G<_.length;G++){const K=M[G];K!==null&&(M[G]=null,_[G].disconnect(K))}S=null,U=null,t.setRenderTarget(m),d=null,f=null,u=null,s=null,p=null,ct.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){r=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){a=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||o},this.setReferenceSpace=function(G){h=G},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(G){if(s=G,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",$),s.addEventListener("inputsourceschange",I),v.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(b),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const K={antialias:s.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,K),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),p=new qi(d.framebufferWidth,d.framebufferHeight,{format:pn,type:xi,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let K=null,pt=null,wt=null;v.depth&&(wt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,K=v.stencil?Fs:Gi,pt=v.stencil?Wi:pi);const bt={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:r};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(bt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),p=new qi(f.textureWidth,f.textureHeight,{format:pn,type:xi,depthTexture:new df(f.textureWidth,f.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});const kt=t.properties.get(p);kt.__ignoreDepthValues=f.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(c),h=null,o=await s.requestReferenceSpace(a),ct.setContext(s),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function I(G){for(let K=0;K<G.removed.length;K++){const pt=G.removed[K],wt=M.indexOf(pt);wt>=0&&(M[wt]=null,_[wt].disconnect(pt))}for(let K=0;K<G.added.length;K++){const pt=G.added[K];let wt=M.indexOf(pt);if(wt===-1){for(let kt=0;kt<_.length;kt++)if(kt>=M.length){M.push(pt),wt=kt;break}else if(M[kt]===null){M[kt]=pt,wt=kt;break}if(wt===-1)break}const bt=_[wt];bt&&bt.connect(pt)}}const O=new P,W=new P;function q(G,K,pt){O.setFromMatrixPosition(K.matrixWorld),W.setFromMatrixPosition(pt.matrixWorld);const wt=O.distanceTo(W),bt=K.projectionMatrix.elements,kt=pt.projectionMatrix.elements,Bt=bt[14]/(bt[10]-1),Lt=bt[14]/(bt[10]+1),Zt=(bt[9]+1)/bt[5],k=(bt[9]-1)/bt[5],Fe=(bt[8]-1)/bt[0],At=(kt[8]+1)/kt[0],Ut=Bt*Fe,xt=Bt*At,ue=wt/(-Fe+At),Wt=ue*-Fe;K.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(Wt),G.translateZ(ue),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert();const R=Bt+ue,w=Lt+ue,F=Ut-Wt,et=xt+(wt-Wt),Z=Zt*Lt/w*R,nt=k*Lt/w*R;G.projectionMatrix.makePerspective(F,et,Z,nt,R,w),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}function X(G,K){K===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(K.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(s===null)return;y.near=x.near=E.near=G.near,y.far=x.far=E.far=G.far,(S!==y.near||U!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),S=y.near,U=y.far);const K=G.parent,pt=y.cameras;X(y,K);for(let wt=0;wt<pt.length;wt++)X(pt[wt],K);pt.length===2?q(y,E,x):y.projectionMatrix.copy(E.projectionMatrix),j(G,y,K)};function j(G,K,pt){pt===null?G.matrix.copy(K.matrixWorld):(G.matrix.copy(pt.matrixWorld),G.matrix.invert(),G.matrix.multiply(K.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(K.projectionMatrix),G.projectionMatrixInverse.copy(K.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=cc*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(G){c=G,f!==null&&(f.fixedFoveation=G),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=G)};let Y=null;function rt(G,K){if(l=K.getViewerPose(h||o),g=K,l!==null){const pt=l.views;d!==null&&(t.setRenderTargetFramebuffer(p,d.framebuffer),t.setRenderTarget(p));let wt=!1;pt.length!==y.cameras.length&&(y.cameras.length=0,wt=!0);for(let bt=0;bt<pt.length;bt++){const kt=pt[bt];let Bt=null;if(d!==null)Bt=d.getViewport(kt);else{const Zt=u.getViewSubImage(f,kt);Bt=Zt.viewport,bt===0&&(t.setRenderTargetTextures(p,Zt.colorTexture,f.ignoreDepthValues?void 0:Zt.depthStencilTexture),t.setRenderTarget(p))}let Lt=A[bt];Lt===void 0&&(Lt=new an,Lt.layers.enable(bt),Lt.viewport=new de,A[bt]=Lt),Lt.matrix.fromArray(kt.transform.matrix),Lt.matrix.decompose(Lt.position,Lt.quaternion,Lt.scale),Lt.projectionMatrix.fromArray(kt.projectionMatrix),Lt.projectionMatrixInverse.copy(Lt.projectionMatrix).invert(),Lt.viewport.set(Bt.x,Bt.y,Bt.width,Bt.height),bt===0&&(y.matrix.copy(Lt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),wt===!0&&y.cameras.push(Lt)}}for(let pt=0;pt<_.length;pt++){const wt=M[pt],bt=_[pt];wt!==null&&bt!==void 0&&bt.update(wt,K,h||o)}Y&&Y(G,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const ct=new uf;ct.setAnimationLoop(rt),this.setAnimationLoop=function(G){Y=G},this.dispose=function(){}}}function tx(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,cf(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,_,M,b){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),l(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,b)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,_,M):p.isSpriteMaterial?h(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Qe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Qe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const _=t.get(p).envMap;if(_&&(m.envMap.value=_,m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const M=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*M,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,_,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=M*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,_){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Qe&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const _=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ex(i,t,e,n){let s={},r={},o=[];const a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(_,M){const b=M.program;n.uniformBlockBinding(_,b)}function h(_,M){let b=s[_.id];b===void 0&&(g(_),b=l(_),s[_.id]=b,_.addEventListener("dispose",m));const C=M.program;n.updateUBOMapping(_,C);const E=t.render.frame;r[_.id]!==E&&(f(_),r[_.id]=E)}function l(_){const M=u();_.__bindingPointIndex=M;const b=i.createBuffer(),C=_.__size,E=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,C,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,b),b}function u(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const M=s[_.id],b=_.uniforms,C=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let E=0,x=b.length;E<x;E++){const A=Array.isArray(b[E])?b[E]:[b[E]];for(let y=0,S=A.length;y<S;y++){const U=A[y];if(d(U,E,y,C)===!0){const N=U.__offset,$=Array.isArray(U.value)?U.value:[U.value];let I=0;for(let O=0;O<$.length;O++){const W=$[O],q=v(W);typeof W=="number"||typeof W=="boolean"?(U.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,N+I,U.__data)):W.isMatrix3?(U.__data[0]=W.elements[0],U.__data[1]=W.elements[1],U.__data[2]=W.elements[2],U.__data[3]=0,U.__data[4]=W.elements[3],U.__data[5]=W.elements[4],U.__data[6]=W.elements[5],U.__data[7]=0,U.__data[8]=W.elements[6],U.__data[9]=W.elements[7],U.__data[10]=W.elements[8],U.__data[11]=0):(W.toArray(U.__data,I),I+=q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,N,U.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(_,M,b,C){const E=_.value,x=M+"_"+b;if(C[x]===void 0)return typeof E=="number"||typeof E=="boolean"?C[x]=E:C[x]=E.clone(),!0;{const A=C[x];if(typeof E=="number"||typeof E=="boolean"){if(A!==E)return C[x]=E,!0}else if(A.equals(E)===!1)return A.copy(E),!0}return!1}function g(_){const M=_.uniforms;let b=0;const C=16;for(let x=0,A=M.length;x<A;x++){const y=Array.isArray(M[x])?M[x]:[M[x]];for(let S=0,U=y.length;S<U;S++){const N=y[S],$=Array.isArray(N.value)?N.value:[N.value];for(let I=0,O=$.length;I<O;I++){const W=$[I],q=v(W),X=b%C;X!==0&&C-X<q.boundary&&(b+=C-X),N.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=b,b+=q.storage}}}const E=b%C;return E>0&&(b+=C-E),_.__size=b,_.__cache={},this}function v(_){const M={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(M.boundary=4,M.storage=4):_.isVector2?(M.boundary=8,M.storage=8):_.isVector3||_.isColor?(M.boundary=16,M.storage=12):_.isVector4?(M.boundary=16,M.storage=16):_.isMatrix3?(M.boundary=48,M.storage=48):_.isMatrix4?(M.boundary=64,M.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),M}function m(_){const M=_.target;M.removeEventListener("dispose",m);const b=o.indexOf(M.__bindingPointIndex);o.splice(b,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(const _ in s)i.deleteBuffer(s[_]);o=[],s={},r={}}return{bind:c,update:h,dispose:p}}class xf{constructor(t={}){const{canvas:e=Jp(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;const d=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const p=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ae,this._useLegacyLights=!1,this.toneMapping=_i,this.toneMappingExposure=1;const M=this;let b=!1,C=0,E=0,x=null,A=-1,y=null;const S=new de,U=new de;let N=null;const $=new jt(0);let I=0,O=e.width,W=e.height,q=1,X=null,j=null;const Y=new de(0,0,O,W),rt=new de(0,0,O,W);let ct=!1;const G=new Cc;let K=!1,pt=!1,wt=null;const bt=new re,kt=new ht,Bt=new P,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Zt(){return x===null?q:1}let k=n;function Fe(T,z){for(let H=0;H<T.length;H++){const V=T[H],B=e.getContext(V,z);if(B!==null)return B}return null}try{const T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Sc}`),e.addEventListener("webglcontextlost",Q,!1),e.addEventListener("webglcontextrestored",D,!1),e.addEventListener("webglcontextcreationerror",st,!1),k===null){const z=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&z.shift(),k=Fe(z,T),k===null)throw Fe(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&k instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),k.getShaderPrecisionFormat===void 0&&(k.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let At,Ut,xt,ue,Wt,R,w,F,et,Z,nt,Mt,ft,_t,Ct,Gt,J,se,qt,Nt,Tt,mt,L,it;function St(){At=new uv(k),Ut=new rv(k,At,t),At.init(Ut),mt=new K_(k,At,Ut),xt=new q_(k,At,Ut),ue=new pv(k),Wt=new U_,R=new Y_(k,At,xt,Wt,Ut,mt,ue),w=new av(M),F=new hv(M),et=new bm(k,Ut),L=new iv(k,At,et,Ut),Z=new fv(k,et,ue,L),nt=new _v(k,Z,et,ue),qt=new vv(k,Ut,R),Gt=new ov(Wt),Mt=new I_(M,w,F,At,Ut,L,Gt),ft=new tx(M,Wt),_t=new z_,Ct=new V_(At,Ut),se=new nv(M,w,F,xt,nt,f,c),J=new j_(M,nt,Ut),it=new ex(k,ue,Ut,xt),Nt=new sv(k,At,ue,Ut),Tt=new dv(k,At,ue,Ut),ue.programs=Mt.programs,M.capabilities=Ut,M.extensions=At,M.properties=Wt,M.renderLists=_t,M.shadowMap=J,M.state=xt,M.info=ue}St();const vt=new Q_(M,k);this.xr=vt,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const T=At.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=At.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(T){T!==void 0&&(q=T,this.setSize(O,W,!1))},this.getSize=function(T){return T.set(O,W)},this.setSize=function(T,z,H=!0){if(vt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=T,W=z,e.width=Math.floor(T*q),e.height=Math.floor(z*q),H===!0&&(e.style.width=T+"px",e.style.height=z+"px"),this.setViewport(0,0,T,z)},this.getDrawingBufferSize=function(T){return T.set(O*q,W*q).floor()},this.setDrawingBufferSize=function(T,z,H){O=T,W=z,q=H,e.width=Math.floor(T*H),e.height=Math.floor(z*H),this.setViewport(0,0,T,z)},this.getCurrentViewport=function(T){return T.copy(S)},this.getViewport=function(T){return T.copy(Y)},this.setViewport=function(T,z,H,V){T.isVector4?Y.set(T.x,T.y,T.z,T.w):Y.set(T,z,H,V),xt.viewport(S.copy(Y).multiplyScalar(q).floor())},this.getScissor=function(T){return T.copy(rt)},this.setScissor=function(T,z,H,V){T.isVector4?rt.set(T.x,T.y,T.z,T.w):rt.set(T,z,H,V),xt.scissor(U.copy(rt).multiplyScalar(q).floor())},this.getScissorTest=function(){return ct},this.setScissorTest=function(T){xt.setScissorTest(ct=T)},this.setOpaqueSort=function(T){X=T},this.setTransparentSort=function(T){j=T},this.getClearColor=function(T){return T.copy(se.getClearColor())},this.setClearColor=function(){se.setClearColor.apply(se,arguments)},this.getClearAlpha=function(){return se.getClearAlpha()},this.setClearAlpha=function(){se.setClearAlpha.apply(se,arguments)},this.clear=function(T=!0,z=!0,H=!0){let V=0;if(T){let B=!1;if(x!==null){const gt=x.texture.format;B=gt===Ku||gt===Yu||gt===qu}if(B){const gt=x.texture.type,Et=gt===xi||gt===pi||gt===Ec||gt===Wi||gt===Xu||gt===ju,It=se.getClearColor(),zt=se.getClearAlpha(),Yt=It.r,Vt=It.g,$t=It.b;Et?(d[0]=Yt,d[1]=Vt,d[2]=$t,d[3]=zt,k.clearBufferuiv(k.COLOR,0,d)):(g[0]=Yt,g[1]=Vt,g[2]=$t,g[3]=zt,k.clearBufferiv(k.COLOR,0,g))}else V|=k.COLOR_BUFFER_BIT}z&&(V|=k.DEPTH_BUFFER_BIT),H&&(V|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Q,!1),e.removeEventListener("webglcontextrestored",D,!1),e.removeEventListener("webglcontextcreationerror",st,!1),_t.dispose(),Ct.dispose(),Wt.dispose(),w.dispose(),F.dispose(),nt.dispose(),L.dispose(),it.dispose(),Mt.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",ye),vt.removeEventListener("sessionend",ee),wt&&(wt.dispose(),wt=null),we.stop()};function Q(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function D(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const T=ue.autoReset,z=J.enabled,H=J.autoUpdate,V=J.needsUpdate,B=J.type;St(),ue.autoReset=T,J.enabled=z,J.autoUpdate=H,J.needsUpdate=V,J.type=B}function st(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ut(T){const z=T.target;z.removeEventListener("dispose",ut),Dt(z)}function Dt(T){Rt(T),Wt.remove(T)}function Rt(T){const z=Wt.get(T).programs;z!==void 0&&(z.forEach(function(H){Mt.releaseProgram(H)}),T.isShaderMaterial&&Mt.releaseShaderCache(T))}this.renderBufferDirect=function(T,z,H,V,B,gt){z===null&&(z=Lt);const Et=B.isMesh&&B.matrixWorld.determinant()<0,It=jd(T,z,H,V,B);xt.setMaterial(V,Et);let zt=H.index,Yt=1;if(V.wireframe===!0){if(zt=Z.getWireframeAttribute(H),zt===void 0)return;Yt=2}const Vt=H.drawRange,$t=H.attributes.position;let Me=Vt.start*Yt,nn=(Vt.start+Vt.count)*Yt;gt!==null&&(Me=Math.max(Me,gt.start*Yt),nn=Math.min(nn,(gt.start+gt.count)*Yt)),zt!==null?(Me=Math.max(Me,0),nn=Math.min(nn,zt.count)):$t!=null&&(Me=Math.max(Me,0),nn=Math.min(nn,$t.count));const De=nn-Me;if(De<0||De===1/0)return;L.setup(B,V,It,H,zt);let Wn,pe=Nt;if(zt!==null&&(Wn=et.get(zt),pe=Tt,pe.setIndex(Wn)),B.isMesh)V.wireframe===!0?(xt.setLineWidth(V.wireframeLinewidth*Zt()),pe.setMode(k.LINES)):pe.setMode(k.TRIANGLES);else if(B.isLine){let Kt=V.linewidth;Kt===void 0&&(Kt=1),xt.setLineWidth(Kt*Zt()),B.isLineSegments?pe.setMode(k.LINES):B.isLineLoop?pe.setMode(k.LINE_LOOP):pe.setMode(k.LINE_STRIP)}else B.isPoints?pe.setMode(k.POINTS):B.isSprite&&pe.setMode(k.TRIANGLES);if(B.isBatchedMesh)pe.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else if(B.isInstancedMesh)pe.renderInstances(Me,De,B.count);else if(H.isInstancedBufferGeometry){const Kt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,na=Math.min(H.instanceCount,Kt);pe.renderInstances(Me,De,na)}else pe.render(Me,De)};function Qt(T,z,H){T.transparent===!0&&T.side===cn&&T.forceSinglePass===!1?(T.side=Qe,T.needsUpdate=!0,Br(T,z,H),T.side=Ei,T.needsUpdate=!0,Br(T,z,H),T.side=cn):Br(T,z,H)}this.compile=function(T,z,H=null){H===null&&(H=T),m=Ct.get(H),m.init(),_.push(m),H.traverseVisible(function(B){B.isLight&&B.layers.test(z.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),T!==H&&T.traverseVisible(function(B){B.isLight&&B.layers.test(z.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),m.setupLights(M._useLegacyLights);const V=new Set;return T.traverse(function(B){const gt=B.material;if(gt)if(Array.isArray(gt))for(let Et=0;Et<gt.length;Et++){const It=gt[Et];Qt(It,H,B),V.add(It)}else Qt(gt,H,B),V.add(gt)}),_.pop(),m=null,V},this.compileAsync=function(T,z,H=null){const V=this.compile(T,z,H);return new Promise(B=>{function gt(){if(V.forEach(function(Et){Wt.get(Et).currentProgram.isReady()&&V.delete(Et)}),V.size===0){B(T);return}setTimeout(gt,10)}At.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let te=null;function ve(T){te&&te(T)}function ye(){we.stop()}function ee(){we.start()}const we=new uf;we.setAnimationLoop(ve),typeof self<"u"&&we.setContext(self),this.setAnimationLoop=function(T){te=T,vt.setAnimationLoop(T),T===null?we.stop():we.start()},vt.addEventListener("sessionstart",ye),vt.addEventListener("sessionend",ee),this.render=function(T,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(z),z=vt.getCamera()),T.isScene===!0&&T.onBeforeRender(M,T,z,x),m=Ct.get(T,_.length),m.init(),_.push(m),bt.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),G.setFromProjectionMatrix(bt),pt=this.localClippingEnabled,K=Gt.init(this.clippingPlanes,pt),v=_t.get(T,p.length),v.init(),p.push(v),Rn(T,z,0,M.sortObjects),v.finish(),M.sortObjects===!0&&v.sort(X,j),this.info.render.frame++,K===!0&&Gt.beginShadows();const H=m.state.shadowsArray;if(J.render(H,T,z),K===!0&&Gt.endShadows(),this.info.autoReset===!0&&this.info.reset(),se.render(v,T),m.setupLights(M._useLegacyLights),z.isArrayCamera){const V=z.cameras;for(let B=0,gt=V.length;B<gt;B++){const Et=V[B];nl(v,T,Et,Et.viewport)}}else nl(v,T,z);x!==null&&(R.updateMultisampleRenderTarget(x),R.updateRenderTargetMipmap(x)),T.isScene===!0&&T.onAfterRender(M,T,z),L.resetDefaultState(),A=-1,y=null,_.pop(),_.length>0?m=_[_.length-1]:m=null,p.pop(),p.length>0?v=p[p.length-1]:v=null};function Rn(T,z,H,V){if(T.visible===!1)return;if(T.layers.test(z.layers)){if(T.isGroup)H=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(z);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||G.intersectsSprite(T)){V&&Bt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(bt);const Et=nt.update(T),It=T.material;It.visible&&v.push(T,Et,It,H,Bt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||G.intersectsObject(T))){const Et=nt.update(T),It=T.material;if(V&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Bt.copy(T.boundingSphere.center)):(Et.boundingSphere===null&&Et.computeBoundingSphere(),Bt.copy(Et.boundingSphere.center)),Bt.applyMatrix4(T.matrixWorld).applyMatrix4(bt)),Array.isArray(It)){const zt=Et.groups;for(let Yt=0,Vt=zt.length;Yt<Vt;Yt++){const $t=zt[Yt],Me=It[$t.materialIndex];Me&&Me.visible&&v.push(T,Et,Me,H,Bt.z,$t)}}else It.visible&&v.push(T,Et,It,H,Bt.z,null)}}const gt=T.children;for(let Et=0,It=gt.length;Et<It;Et++)Rn(gt[Et],z,H,V)}function nl(T,z,H,V){const B=T.opaque,gt=T.transmissive,Et=T.transparent;m.setupLightsView(H),K===!0&&Gt.setGlobalState(M.clippingPlanes,H),gt.length>0&&Xd(B,gt,z,H),V&&xt.viewport(S.copy(V)),B.length>0&&kr(B,z,H),gt.length>0&&kr(gt,z,H),Et.length>0&&kr(Et,z,H),xt.buffers.depth.setTest(!0),xt.buffers.depth.setMask(!0),xt.buffers.color.setMask(!0),xt.setPolygonOffset(!1)}function Xd(T,z,H,V){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;const gt=Ut.isWebGL2;wt===null&&(wt=new qi(1,1,{generateMipmaps:!0,type:At.has("EXT_color_buffer_half_float")?Mr:xi,minFilter:yr,samples:gt?4:0})),M.getDrawingBufferSize(kt),gt?wt.setSize(kt.x,kt.y):wt.setSize(lc(kt.x),lc(kt.y));const Et=M.getRenderTarget();M.setRenderTarget(wt),M.getClearColor($),I=M.getClearAlpha(),I<1&&M.setClearColor(16777215,.5),M.clear();const It=M.toneMapping;M.toneMapping=_i,kr(T,H,V),R.updateMultisampleRenderTarget(wt),R.updateRenderTargetMipmap(wt);let zt=!1;for(let Yt=0,Vt=z.length;Yt<Vt;Yt++){const $t=z[Yt],Me=$t.object,nn=$t.geometry,De=$t.material,Wn=$t.group;if(De.side===cn&&Me.layers.test(V.layers)){const pe=De.side;De.side=Qe,De.needsUpdate=!0,il(Me,H,V,nn,De,Wn),De.side=pe,De.needsUpdate=!0,zt=!0}}zt===!0&&(R.updateMultisampleRenderTarget(wt),R.updateRenderTargetMipmap(wt)),M.setRenderTarget(Et),M.setClearColor($,I),M.toneMapping=It}function kr(T,z,H){const V=z.isScene===!0?z.overrideMaterial:null;for(let B=0,gt=T.length;B<gt;B++){const Et=T[B],It=Et.object,zt=Et.geometry,Yt=V===null?Et.material:V,Vt=Et.group;It.layers.test(H.layers)&&il(It,z,H,zt,Yt,Vt)}}function il(T,z,H,V,B,gt){T.onBeforeRender(M,z,H,V,B,gt),T.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),B.onBeforeRender(M,z,H,V,T,gt),B.transparent===!0&&B.side===cn&&B.forceSinglePass===!1?(B.side=Qe,B.needsUpdate=!0,M.renderBufferDirect(H,z,V,B,T,gt),B.side=Ei,B.needsUpdate=!0,M.renderBufferDirect(H,z,V,B,T,gt),B.side=cn):M.renderBufferDirect(H,z,V,B,T,gt),T.onAfterRender(M,z,H,V,B,gt)}function Br(T,z,H){z.isScene!==!0&&(z=Lt);const V=Wt.get(T),B=m.state.lights,gt=m.state.shadowsArray,Et=B.state.version,It=Mt.getParameters(T,B.state,gt,z,H),zt=Mt.getProgramCacheKey(It);let Yt=V.programs;V.environment=T.isMeshStandardMaterial?z.environment:null,V.fog=z.fog,V.envMap=(T.isMeshStandardMaterial?F:w).get(T.envMap||V.environment),Yt===void 0&&(T.addEventListener("dispose",ut),Yt=new Map,V.programs=Yt);let Vt=Yt.get(zt);if(Vt!==void 0){if(V.currentProgram===Vt&&V.lightsStateVersion===Et)return rl(T,It),Vt}else It.uniforms=Mt.getUniforms(T),T.onBuild(H,It,M),T.onBeforeCompile(It,M),Vt=Mt.acquireProgram(It,zt),Yt.set(zt,Vt),V.uniforms=It.uniforms;const $t=V.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&($t.clippingPlanes=Gt.uniform),rl(T,It),V.needsLights=Yd(T),V.lightsStateVersion=Et,V.needsLights&&($t.ambientLightColor.value=B.state.ambient,$t.lightProbe.value=B.state.probe,$t.directionalLights.value=B.state.directional,$t.directionalLightShadows.value=B.state.directionalShadow,$t.spotLights.value=B.state.spot,$t.spotLightShadows.value=B.state.spotShadow,$t.rectAreaLights.value=B.state.rectArea,$t.ltc_1.value=B.state.rectAreaLTC1,$t.ltc_2.value=B.state.rectAreaLTC2,$t.pointLights.value=B.state.point,$t.pointLightShadows.value=B.state.pointShadow,$t.hemisphereLights.value=B.state.hemi,$t.directionalShadowMap.value=B.state.directionalShadowMap,$t.directionalShadowMatrix.value=B.state.directionalShadowMatrix,$t.spotShadowMap.value=B.state.spotShadowMap,$t.spotLightMatrix.value=B.state.spotLightMatrix,$t.spotLightMap.value=B.state.spotLightMap,$t.pointShadowMap.value=B.state.pointShadowMap,$t.pointShadowMatrix.value=B.state.pointShadowMatrix),V.currentProgram=Vt,V.uniformsList=null,Vt}function sl(T){if(T.uniformsList===null){const z=T.currentProgram.getUniforms();T.uniformsList=yo.seqWithValue(z.seq,T.uniforms)}return T.uniformsList}function rl(T,z){const H=Wt.get(T);H.outputColorSpace=z.outputColorSpace,H.batching=z.batching,H.instancing=z.instancing,H.instancingColor=z.instancingColor,H.skinning=z.skinning,H.morphTargets=z.morphTargets,H.morphNormals=z.morphNormals,H.morphColors=z.morphColors,H.morphTargetsCount=z.morphTargetsCount,H.numClippingPlanes=z.numClippingPlanes,H.numIntersection=z.numClipIntersection,H.vertexAlphas=z.vertexAlphas,H.vertexTangents=z.vertexTangents,H.toneMapping=z.toneMapping}function jd(T,z,H,V,B){z.isScene!==!0&&(z=Lt),R.resetTextureUnits();const gt=z.fog,Et=V.isMeshStandardMaterial?z.environment:null,It=x===null?M.outputColorSpace:x.isXRRenderTarget===!0?x.texture.colorSpace:ni,zt=(V.isMeshStandardMaterial?F:w).get(V.envMap||Et),Yt=V.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Vt=!!H.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),$t=!!H.morphAttributes.position,Me=!!H.morphAttributes.normal,nn=!!H.morphAttributes.color;let De=_i;V.toneMapped&&(x===null||x.isXRRenderTarget===!0)&&(De=M.toneMapping);const Wn=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,pe=Wn!==void 0?Wn.length:0,Kt=Wt.get(V),na=m.state.lights;if(K===!0&&(pt===!0||T!==y)){const un=T===y&&V.id===A;Gt.setState(V,T,un)}let _e=!1;V.version===Kt.__version?(Kt.needsLights&&Kt.lightsStateVersion!==na.state.version||Kt.outputColorSpace!==It||B.isBatchedMesh&&Kt.batching===!1||!B.isBatchedMesh&&Kt.batching===!0||B.isInstancedMesh&&Kt.instancing===!1||!B.isInstancedMesh&&Kt.instancing===!0||B.isSkinnedMesh&&Kt.skinning===!1||!B.isSkinnedMesh&&Kt.skinning===!0||B.isInstancedMesh&&Kt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Kt.instancingColor===!1&&B.instanceColor!==null||Kt.envMap!==zt||V.fog===!0&&Kt.fog!==gt||Kt.numClippingPlanes!==void 0&&(Kt.numClippingPlanes!==Gt.numPlanes||Kt.numIntersection!==Gt.numIntersection)||Kt.vertexAlphas!==Yt||Kt.vertexTangents!==Vt||Kt.morphTargets!==$t||Kt.morphNormals!==Me||Kt.morphColors!==nn||Kt.toneMapping!==De||Ut.isWebGL2===!0&&Kt.morphTargetsCount!==pe)&&(_e=!0):(_e=!0,Kt.__version=V.version);let Ci=Kt.currentProgram;_e===!0&&(Ci=Br(V,z,B));let ol=!1,Zs=!1,ia=!1;const Be=Ci.getUniforms(),Pi=Kt.uniforms;if(xt.useProgram(Ci.program)&&(ol=!0,Zs=!0,ia=!0),V.id!==A&&(A=V.id,Zs=!0),ol||y!==T){Be.setValue(k,"projectionMatrix",T.projectionMatrix),Be.setValue(k,"viewMatrix",T.matrixWorldInverse);const un=Be.map.cameraPosition;un!==void 0&&un.setValue(k,Bt.setFromMatrixPosition(T.matrixWorld)),Ut.logarithmicDepthBuffer&&Be.setValue(k,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Be.setValue(k,"isOrthographic",T.isOrthographicCamera===!0),y!==T&&(y=T,Zs=!0,ia=!0)}if(B.isSkinnedMesh){Be.setOptional(k,B,"bindMatrix"),Be.setOptional(k,B,"bindMatrixInverse");const un=B.skeleton;un&&(Ut.floatVertexTextures?(un.boneTexture===null&&un.computeBoneTexture(),Be.setValue(k,"boneTexture",un.boneTexture,R)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}B.isBatchedMesh&&(Be.setOptional(k,B,"batchingTexture"),Be.setValue(k,"batchingTexture",B._matricesTexture,R));const sa=H.morphAttributes;if((sa.position!==void 0||sa.normal!==void 0||sa.color!==void 0&&Ut.isWebGL2===!0)&&qt.update(B,H,Ci),(Zs||Kt.receiveShadow!==B.receiveShadow)&&(Kt.receiveShadow=B.receiveShadow,Be.setValue(k,"receiveShadow",B.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(Pi.envMap.value=zt,Pi.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),Zs&&(Be.setValue(k,"toneMappingExposure",M.toneMappingExposure),Kt.needsLights&&qd(Pi,ia),gt&&V.fog===!0&&ft.refreshFogUniforms(Pi,gt),ft.refreshMaterialUniforms(Pi,V,q,W,wt),yo.upload(k,sl(Kt),Pi,R)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(yo.upload(k,sl(Kt),Pi,R),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Be.setValue(k,"center",B.center),Be.setValue(k,"modelViewMatrix",B.modelViewMatrix),Be.setValue(k,"normalMatrix",B.normalMatrix),Be.setValue(k,"modelMatrix",B.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const un=V.uniformsGroups;for(let ra=0,Kd=un.length;ra<Kd;ra++)if(Ut.isWebGL2){const al=un[ra];it.update(al,Ci),it.bind(al,Ci)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ci}function qd(T,z){T.ambientLightColor.needsUpdate=z,T.lightProbe.needsUpdate=z,T.directionalLights.needsUpdate=z,T.directionalLightShadows.needsUpdate=z,T.pointLights.needsUpdate=z,T.pointLightShadows.needsUpdate=z,T.spotLights.needsUpdate=z,T.spotLightShadows.needsUpdate=z,T.rectAreaLights.needsUpdate=z,T.hemisphereLights.needsUpdate=z}function Yd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return x},this.setRenderTargetTextures=function(T,z,H){Wt.get(T.texture).__webglTexture=z,Wt.get(T.depthTexture).__webglTexture=H;const V=Wt.get(T);V.__hasExternalTextures=!0,V.__hasExternalTextures&&(V.__autoAllocateDepthBuffer=H===void 0,V.__autoAllocateDepthBuffer||At.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,z){const H=Wt.get(T);H.__webglFramebuffer=z,H.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(T,z=0,H=0){x=T,C=z,E=H;let V=!0,B=null,gt=!1,Et=!1;if(T){const zt=Wt.get(T);zt.__useDefaultFramebuffer!==void 0?(xt.bindFramebuffer(k.FRAMEBUFFER,null),V=!1):zt.__webglFramebuffer===void 0?R.setupRenderTarget(T):zt.__hasExternalTextures&&R.rebindTextures(T,Wt.get(T.texture).__webglTexture,Wt.get(T.depthTexture).__webglTexture);const Yt=T.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(Et=!0);const Vt=Wt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Vt[z])?B=Vt[z][H]:B=Vt[z],gt=!0):Ut.isWebGL2&&T.samples>0&&R.useMultisampledRTT(T)===!1?B=Wt.get(T).__webglMultisampledFramebuffer:Array.isArray(Vt)?B=Vt[H]:B=Vt,S.copy(T.viewport),U.copy(T.scissor),N=T.scissorTest}else S.copy(Y).multiplyScalar(q).floor(),U.copy(rt).multiplyScalar(q).floor(),N=ct;if(xt.bindFramebuffer(k.FRAMEBUFFER,B)&&Ut.drawBuffers&&V&&xt.drawBuffers(T,B),xt.viewport(S),xt.scissor(U),xt.setScissorTest(N),gt){const zt=Wt.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+z,zt.__webglTexture,H)}else if(Et){const zt=Wt.get(T.texture),Yt=z||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,zt.__webglTexture,H||0,Yt)}A=-1},this.readRenderTargetPixels=function(T,z,H,V,B,gt,Et){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=Wt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Et!==void 0&&(It=It[Et]),It){xt.bindFramebuffer(k.FRAMEBUFFER,It);try{const zt=T.texture,Yt=zt.format,Vt=zt.type;if(Yt!==pn&&mt.convert(Yt)!==k.getParameter(k.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const $t=Vt===Mr&&(At.has("EXT_color_buffer_half_float")||Ut.isWebGL2&&At.has("EXT_color_buffer_float"));if(Vt!==xi&&mt.convert(Vt)!==k.getParameter(k.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Vt===mi&&(Ut.isWebGL2||At.has("OES_texture_float")||At.has("WEBGL_color_buffer_float")))&&!$t){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=T.width-V&&H>=0&&H<=T.height-B&&k.readPixels(z,H,V,B,mt.convert(Yt),mt.convert(Vt),gt)}finally{const zt=x!==null?Wt.get(x).__webglFramebuffer:null;xt.bindFramebuffer(k.FRAMEBUFFER,zt)}}},this.copyFramebufferToTexture=function(T,z,H=0){const V=Math.pow(2,-H),B=Math.floor(z.image.width*V),gt=Math.floor(z.image.height*V);R.setTexture2D(z,0),k.copyTexSubImage2D(k.TEXTURE_2D,H,0,0,T.x,T.y,B,gt),xt.unbindTexture()},this.copyTextureToTexture=function(T,z,H,V=0){const B=z.image.width,gt=z.image.height,Et=mt.convert(H.format),It=mt.convert(H.type);R.setTexture2D(H,0),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,H.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,H.unpackAlignment),z.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,V,T.x,T.y,B,gt,Et,It,z.image.data):z.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,V,T.x,T.y,z.mipmaps[0].width,z.mipmaps[0].height,Et,z.mipmaps[0].data):k.texSubImage2D(k.TEXTURE_2D,V,T.x,T.y,Et,It,z.image),V===0&&H.generateMipmaps&&k.generateMipmap(k.TEXTURE_2D),xt.unbindTexture()},this.copyTextureToTexture3D=function(T,z,H,V,B=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const gt=T.max.x-T.min.x+1,Et=T.max.y-T.min.y+1,It=T.max.z-T.min.z+1,zt=mt.convert(V.format),Yt=mt.convert(V.type);let Vt;if(V.isData3DTexture)R.setTexture3D(V,0),Vt=k.TEXTURE_3D;else if(V.isDataArrayTexture||V.isCompressedArrayTexture)R.setTexture2DArray(V,0),Vt=k.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,V.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,V.unpackAlignment);const $t=k.getParameter(k.UNPACK_ROW_LENGTH),Me=k.getParameter(k.UNPACK_IMAGE_HEIGHT),nn=k.getParameter(k.UNPACK_SKIP_PIXELS),De=k.getParameter(k.UNPACK_SKIP_ROWS),Wn=k.getParameter(k.UNPACK_SKIP_IMAGES),pe=H.isCompressedTexture?H.mipmaps[B]:H.image;k.pixelStorei(k.UNPACK_ROW_LENGTH,pe.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,pe.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,T.min.x),k.pixelStorei(k.UNPACK_SKIP_ROWS,T.min.y),k.pixelStorei(k.UNPACK_SKIP_IMAGES,T.min.z),H.isDataTexture||H.isData3DTexture?k.texSubImage3D(Vt,B,z.x,z.y,z.z,gt,Et,It,zt,Yt,pe.data):H.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),k.compressedTexSubImage3D(Vt,B,z.x,z.y,z.z,gt,Et,It,zt,pe.data)):k.texSubImage3D(Vt,B,z.x,z.y,z.z,gt,Et,It,zt,Yt,pe),k.pixelStorei(k.UNPACK_ROW_LENGTH,$t),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Me),k.pixelStorei(k.UNPACK_SKIP_PIXELS,nn),k.pixelStorei(k.UNPACK_SKIP_ROWS,De),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Wn),B===0&&V.generateMipmaps&&k.generateMipmap(Vt),xt.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?R.setTextureCube(T,0):T.isData3DTexture?R.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?R.setTexture2DArray(T,0):R.setTexture2D(T,0),xt.unbindTexture()},this.resetState=function(){C=0,E=0,x=null,xt.reset(),L.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ti}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ac?"display-p3":"srgb",e.unpackColorSpace=ae.workingColorSpace===Bo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ae?$i:Zu}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===$i?Ae:ni}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class nx extends xf{}nx.prototype.isWebGL1Renderer=!0;class Lc{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new jt(t),this.near=e,this.far=n}clone(){return new Lc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class yf extends ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class ix extends Ye{constructor(t=null,e=1,n=1,s,r,o,a,c,h=ke,l=ke,u,f){super(null,o,a,c,h,l,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rh extends hn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const bs=new re,Ch=new re,lo=[],Ph=new ts,sx=new re,sr=new Ht,rr=new Gs;class pr extends Ht{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Rh(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,sx)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ts),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bs),Ph.copy(t.boundingBox).applyMatrix4(bs),this.boundingBox.union(Ph)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Gs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bs),rr.copy(t.boundingSphere).applyMatrix4(bs),this.boundingSphere.union(rr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(sr.geometry=this.geometry,sr.material=this.material,sr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),rr.copy(this.boundingSphere),rr.applyMatrix4(n),t.ray.intersectsSphere(rr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,bs),Ch.multiplyMatrices(n,bs),sr.matrixWorld=Ch,sr.raycast(t,lo);for(let o=0,a=lo.length;o<a;o++){const c=lo[o];c.instanceId=r,c.object=this,e.push(c)}lo.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Rh(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Dc extends es{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new jt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Lh=new P,Dh=new P,Ih=new re,za=new Ho,ho=new Gs;class Mf extends ze{constructor(t=new Se,e=new Dc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Lh.fromBufferAttribute(e,s-1),Dh.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Lh.distanceTo(Dh);t.setAttribute("lineDistance",new ie(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ho.copy(n.boundingSphere),ho.applyMatrix4(s),ho.radius+=r,t.ray.intersectsSphere(ho)===!1)return;Ih.copy(s).invert(),za.copy(t.ray).applyMatrix4(Ih);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,h=new P,l=new P,u=new P,f=new P,d=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){const p=Math.max(0,o.start),_=Math.min(g.count,o.start+o.count);for(let M=p,b=_-1;M<b;M+=d){const C=g.getX(M),E=g.getX(M+1);if(h.fromBufferAttribute(m,C),l.fromBufferAttribute(m,E),za.distanceSqToSegment(h,l,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const A=t.ray.origin.distanceTo(f);A<t.near||A>t.far||e.push({distance:A,point:u.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,o.start),_=Math.min(m.count,o.start+o.count);for(let M=p,b=_-1;M<b;M+=d){if(h.fromBufferAttribute(m,M),l.fromBufferAttribute(m,M+1),za.distanceSqToSegment(h,l,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const E=t.ray.origin.distanceTo(f);E<t.near||E>t.far||e.push({distance:E,point:u.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const Uh=new P,Nh=new P;class rx extends Mf{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Uh.fromBufferAttribute(e,s),Nh.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Uh.distanceTo(Nh);t.setAttribute("lineDistance",new ie(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ic extends Ye{constructor(t,e,n,s,r,o,a,c,h){super(t,e,n,s,r,o,a,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Hn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,h;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),h=n[s]-o,h<0)a=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const l=n[s],f=n[s+1]-l,d=(o-l)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new ht:new P);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new P,s=[],r=[],o=[],a=new P,c=new re;for(let d=0;d<=t;d++){const g=d/t;s[d]=this.getTangentAt(g,new P)}r[0]=new P,o[0]=new P;let h=Number.MAX_VALUE;const l=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);l<=h&&(h=l,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),f<=h&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Ue(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Ue(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Uc extends Hn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){const n=e||new ht,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),h=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const l=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=h-this.aY;c=f*l-d*u+this.aX,h=f*u+d*l+this.aY}return n.set(c,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class ox extends Uc{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Nc(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,h){s(o,a,h*(a-r),h*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,h,l,u){let f=(o-r)/h-(a-r)/(h+l)+(a-o)/l,d=(a-o)/l-(c-o)/(l+u)+(c-a)/u;f*=l,d*=l,s(o,a,f,d)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const uo=new P,Oa=new Nc,Fa=new Nc,ka=new Nc;class zc extends Hn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new P){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let h,l;this.closed||a>0?h=s[(a-1)%r]:(uo.subVectors(s[0],s[1]).add(s[0]),h=uo);const u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?l=s[(a+2)%r]:(uo.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=uo),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(h.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(l),d);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Oa.initNonuniformCatmullRom(h.x,u.x,f.x,l.x,g,v,m),Fa.initNonuniformCatmullRom(h.y,u.y,f.y,l.y,g,v,m),ka.initNonuniformCatmullRom(h.z,u.z,f.z,l.z,g,v,m)}else this.curveType==="catmullrom"&&(Oa.initCatmullRom(h.x,u.x,f.x,l.x,this.tension),Fa.initCatmullRom(h.y,u.y,f.y,l.y,this.tension),ka.initCatmullRom(h.z,u.z,f.z,l.z,this.tension));return n.set(Oa.calc(c),Fa.calc(c),ka.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new P().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function zh(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function ax(i,t){const e=1-i;return e*e*t}function cx(i,t){return 2*(1-i)*i*t}function lx(i,t){return i*i*t}function mr(i,t,e,n){return ax(i,t)+cx(i,e)+lx(i,n)}function hx(i,t){const e=1-i;return e*e*e*t}function ux(i,t){const e=1-i;return 3*e*e*i*t}function fx(i,t){return 3*(1-i)*i*i*t}function dx(i,t){return i*i*i*t}function gr(i,t,e,n,s){return hx(i,t)+ux(i,e)+fx(i,n)+dx(i,s)}class bf extends Hn{constructor(t=new ht,e=new ht,n=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(gr(t,s.x,r.x,o.x,a.x),gr(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class px extends Hn{constructor(t=new P,e=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(gr(t,s.x,r.x,o.x,a.x),gr(t,s.y,r.y,o.y,a.y),gr(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Sf extends Hn{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class mx extends Hn{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class wf extends Hn{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(mr(t,s.x,r.x,o.x),mr(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class gx extends Hn{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(mr(t,s.x,r.x,o.x),mr(t,s.y,r.y,o.y),mr(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ef extends Hn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],h=s[o],l=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(zh(a,c.x,h.x,l.x,u.x),zh(a,c.y,h.y,l.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ht().fromArray(s))}return this}}var Oh=Object.freeze({__proto__:null,ArcCurve:ox,CatmullRomCurve3:zc,CubicBezierCurve:bf,CubicBezierCurve3:px,EllipseCurve:Uc,LineCurve:Sf,LineCurve3:mx,QuadraticBezierCurve:wf,QuadraticBezierCurve3:gx,SplineCurve:Ef});class vx extends Hn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Oh[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),h=c===0?0:1-o/c;return a.getPointAt(h,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let h=0;h<c.length;h++){const l=c[h];n&&n.equals(l)||(e.push(l),n=l)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Oh[s.type]().fromJSON(s))}return this}}class _x extends vx{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Sf(this.currentPoint.clone(),new ht(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new wf(this.currentPoint.clone(),new ht(t,e),new ht(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new bf(this.currentPoint.clone(),new ht(t,e),new ht(n,s),new ht(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Ef(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const h=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(t+h,e+l,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const h=new Uc(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const l=h.getPoint(1);return this.currentPoint.copy(l),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Oc extends Se{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Ue(s,0,Math.PI*2);const r=[],o=[],a=[],c=[],h=[],l=1/e,u=new P,f=new ht,d=new P,g=new P,v=new P;let m=0,p=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:m=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-m,d.z=p*0,v.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:m=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),c.push(d.x,d.y,d.z),v.copy(g)}for(let _=0;_<=e;_++){const M=n+_*l*s,b=Math.sin(M),C=Math.cos(M);for(let E=0;E<=t.length-1;E++){u.x=t[E].x*b,u.y=t[E].y,u.z=t[E].x*C,o.push(u.x,u.y,u.z),f.x=_/e,f.y=E/(t.length-1),a.push(f.x,f.y);const x=c[3*E+0]*b,A=c[3*E+1],y=c[3*E+0]*C;h.push(x,A,y)}}for(let _=0;_<e;_++)for(let M=0;M<t.length-1;M++){const b=M+_*t.length,C=b,E=b+t.length,x=b+t.length+1,A=b+1;r.push(C,E,A),r.push(x,A,E)}this.setIndex(r),this.setAttribute("position",new ie(o,3)),this.setAttribute("uv",new ie(a,2)),this.setAttribute("normal",new ie(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oc(t.points,t.segments,t.phiStart,t.phiLength)}}class Fc extends Oc{constructor(t=1,e=1,n=4,s=8){const r=new _x;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new Fc(t.radius,t.length,t.capSegments,t.radialSegments)}}class Ki extends Se{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],h=new P,l=new ht;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const d=n+u/e*s;h.x=t*Math.cos(d),h.y=t*Math.sin(d),o.push(h.x,h.y,h.z),a.push(0,0,1),l.x=(o[f]/t+1)/2,l.y=(o[f+1]/t+1)/2,c.push(l.x,l.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ie(o,3)),this.setAttribute("normal",new ie(a,3)),this.setAttribute("uv",new ie(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ki(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class tn extends Se{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const l=[],u=[],f=[],d=[];let g=0;const v=[],m=n/2;let p=0;_(),o===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(l),this.setAttribute("position",new ie(u,3)),this.setAttribute("normal",new ie(f,3)),this.setAttribute("uv",new ie(d,2));function _(){const b=new P,C=new P;let E=0;const x=(e-t)/n;for(let A=0;A<=r;A++){const y=[],S=A/r,U=S*(e-t)+t;for(let N=0;N<=s;N++){const $=N/s,I=$*c+a,O=Math.sin(I),W=Math.cos(I);C.x=U*O,C.y=-S*n+m,C.z=U*W,u.push(C.x,C.y,C.z),b.set(O,x,W).normalize(),f.push(b.x,b.y,b.z),d.push($,1-S),y.push(g++)}v.push(y)}for(let A=0;A<s;A++)for(let y=0;y<r;y++){const S=v[y][A],U=v[y+1][A],N=v[y+1][A+1],$=v[y][A+1];l.push(S,U,$),l.push(U,N,$),E+=6}h.addGroup(p,E,0),p+=E}function M(b){const C=g,E=new ht,x=new P;let A=0;const y=b===!0?t:e,S=b===!0?1:-1;for(let N=1;N<=s;N++)u.push(0,m*S,0),f.push(0,S,0),d.push(.5,.5),g++;const U=g;for(let N=0;N<=s;N++){const I=N/s*c+a,O=Math.cos(I),W=Math.sin(I);x.x=y*W,x.y=m*S,x.z=y*O,u.push(x.x,x.y,x.z),f.push(0,S,0),E.x=O*.5+.5,E.y=W*.5*S+.5,d.push(E.x,E.y),g++}for(let N=0;N<s;N++){const $=C+N,I=U+N;b===!0?l.push(I,I+1,$):l.push(I+1,I,$),A+=3}h.addGroup(p,A,b===!0?1:2),p+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new tn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class zn extends tn{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new zn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Dr extends Se{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),h(n),l(),this.setAttribute("position",new ie(r,3)),this.setAttribute("normal",new ie(r.slice(),3)),this.setAttribute("uv",new ie(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const M=new P,b=new P,C=new P;for(let E=0;E<e.length;E+=3)d(e[E+0],M),d(e[E+1],b),d(e[E+2],C),c(M,b,C,_)}function c(_,M,b,C){const E=C+1,x=[];for(let A=0;A<=E;A++){x[A]=[];const y=_.clone().lerp(b,A/E),S=M.clone().lerp(b,A/E),U=E-A;for(let N=0;N<=U;N++)N===0&&A===E?x[A][N]=y:x[A][N]=y.clone().lerp(S,N/U)}for(let A=0;A<E;A++)for(let y=0;y<2*(E-A)-1;y++){const S=Math.floor(y/2);y%2===0?(f(x[A][S+1]),f(x[A+1][S]),f(x[A][S])):(f(x[A][S+1]),f(x[A+1][S+1]),f(x[A+1][S]))}}function h(_){const M=new P;for(let b=0;b<r.length;b+=3)M.x=r[b+0],M.y=r[b+1],M.z=r[b+2],M.normalize().multiplyScalar(_),r[b+0]=M.x,r[b+1]=M.y,r[b+2]=M.z}function l(){const _=new P;for(let M=0;M<r.length;M+=3){_.x=r[M+0],_.y=r[M+1],_.z=r[M+2];const b=m(_)/2/Math.PI+.5,C=p(_)/Math.PI+.5;o.push(b,1-C)}g(),u()}function u(){for(let _=0;_<o.length;_+=6){const M=o[_+0],b=o[_+2],C=o[_+4],E=Math.max(M,b,C),x=Math.min(M,b,C);E>.9&&x<.1&&(M<.2&&(o[_+0]+=1),b<.2&&(o[_+2]+=1),C<.2&&(o[_+4]+=1))}}function f(_){r.push(_.x,_.y,_.z)}function d(_,M){const b=_*3;M.x=t[b+0],M.y=t[b+1],M.z=t[b+2]}function g(){const _=new P,M=new P,b=new P,C=new P,E=new ht,x=new ht,A=new ht;for(let y=0,S=0;y<r.length;y+=9,S+=6){_.set(r[y+0],r[y+1],r[y+2]),M.set(r[y+3],r[y+4],r[y+5]),b.set(r[y+6],r[y+7],r[y+8]),E.set(o[S+0],o[S+1]),x.set(o[S+2],o[S+3]),A.set(o[S+4],o[S+5]),C.copy(_).add(M).add(b).divideScalar(3);const U=m(C);v(E,S+0,_,U),v(x,S+2,M,U),v(A,S+4,b,U)}}function v(_,M,b,C){C<0&&_.x===1&&(o[M]=_.x-1),b.x===0&&b.z===0&&(o[M]=C/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dr(t.vertices,t.indices,t.radius,t.details)}}class Io extends Dr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Io(t.radius,t.detail)}}class On extends Dr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new On(t.radius,t.detail)}}class Wo extends Dr{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Wo(t.radius,t.detail)}}class Ji extends Se{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],h=[],l=[];let u=t;const f=(e-t)/s,d=new P,g=new ht;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){const p=r+m/n*o;d.x=u*Math.cos(p),d.y=u*Math.sin(p),c.push(d.x,d.y,d.z),h.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,l.push(g.x,g.y)}u+=f}for(let v=0;v<s;v++){const m=v*(n+1);for(let p=0;p<n;p++){const _=p+m,M=_,b=_+n+1,C=_+n+2,E=_+1;a.push(M,b,E),a.push(b,C,E)}}this.setIndex(a),this.setAttribute("position",new ie(c,3)),this.setAttribute("normal",new ie(h,3)),this.setAttribute("uv",new ie(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ji(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ln extends Se{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let h=0;const l=[],u=new P,f=new P,d=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const _=[],M=p/n;let b=0;p===0&&o===0?b=.5/e:p===n&&c===Math.PI&&(b=-.5/e);for(let C=0;C<=e;C++){const E=C/e;u.x=-t*Math.cos(s+E*r)*Math.sin(o+M*a),u.y=t*Math.cos(o+M*a),u.z=t*Math.sin(s+E*r)*Math.sin(o+M*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),m.push(E+b,1-M),_.push(h++)}l.push(_)}for(let p=0;p<n;p++)for(let _=0;_<e;_++){const M=l[p][_+1],b=l[p][_],C=l[p+1][_],E=l[p+1][_+1];(p!==0||o>0)&&d.push(M,b,E),(p!==n-1||c<Math.PI)&&d.push(b,C,E)}this.setIndex(d),this.setAttribute("position",new ie(g,3)),this.setAttribute("normal",new ie(v,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ln(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class En extends Se{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],h=[],l=new P,u=new P,f=new P;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const v=g/s*r,m=d/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),l.x=t*Math.cos(v),l.y=t*Math.sin(v),f.subVectors(u,l).normalize(),c.push(f.x,f.y,f.z),h.push(g/s),h.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const v=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,p=(s+1)*(d-1)+g,_=(s+1)*d+g;o.push(v,m,_),o.push(m,p,_)}this.setIndex(o),this.setAttribute("position",new ie(a,3)),this.setAttribute("normal",new ie(c,3)),this.setAttribute("uv",new ie(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new En(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class wn extends es{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new jt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new jt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Tc,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class xx extends es{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new jt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Tc,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=wc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class kc extends ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new jt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class yx extends kc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.groundColor=new jt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ba=new re,Fh=new P,kh=new P;class Tf{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.map=null,this.mapPass=null,this.matrix=new re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Cc,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Fh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Fh),kh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(kh),e.updateMatrixWorld(),Ba.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ba),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ba)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Bh=new re,or=new P,Ha=new P;class Mx extends Tf{constructor(){super(new an(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ht(4,2),this._viewportCount=6,this._viewports=[new de(2,1,1,1),new de(0,1,1,1),new de(3,1,1,1),new de(1,1,1,1),new de(3,0,1,1),new de(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),or.setFromMatrixPosition(t.matrixWorld),n.position.copy(or),Ha.copy(n.position),Ha.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ha),n.updateMatrixWorld(),s.makeTranslation(-or.x,-or.y,-or.z),Bh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bh)}}class bx extends kc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Mx}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Sx extends Tf{constructor(){super(new ff(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Hh extends kc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.shadow=new Sx}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class wx{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Vh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Vh();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Vh(){return(typeof performance>"u"?Date:performance).now()}class Ex{constructor(t,e,n=0,s=1/0){this.ray=new Ho(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Rc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return uc(t,this,n,e),n.sort(Wh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)uc(t[s],this,n,e);return n.sort(Wh),n}}function Wh(i,t){return i.distance-t.distance}function uc(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,o=s.length;r<o;r++)uc(s[r],t,e,!0)}}class Gh{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ue(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Sc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Sc);function Tx(i){return{a:i>>>0,n:0,h:0,locked:!1}}function vr(i){if(i.locked)throw new Error("a dice draw while the rng is locked (a preview or legality check must never roll)");let t=i.a|0;t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);e=e+Math.imul(e^e>>>7,61|e)^e;const n=((e^e>>>14)>>>0)/4294967296;return i.a=t,i.n++,i.h=Math.imul(i.h,31)+Math.floor(n*4294967296)>>>0,n}const Bc=i=>`${i.n}#${i.h.toString(36)}`;function Af(i){i.locked=!0}function Rf(i){i.locked=!1}const ri=Object.freeze({W:40,H:28,deploy:8}),Mi=1,Ir=12,Go=3,Cf=5,Ur=6,br=Object.freeze([{key:"move",name:"Movement"},{key:"shoot",name:"Shooting"},{key:"charge",name:"Charge"},{key:"fight",name:"Fight"},{key:"morale",name:"Morale"}].map(Object.freeze)),Hc=i=>1+Math.floor(vr(i.rng)*6),Ge=(i,t)=>Array.from({length:t},()=>Hc(i)),ei=(i,t)=>i.filter(e=>e>=t).length,Ax=(i,t,e)=>i<t?t:i>e?e:i,Mo=i=>i>6?0:i<=1?1:(7-i)/6;function Zi(i){let t=0;for(let e=1;e<=6;e++)for(let n=1;n<=6;n++)e+n>=i&&t++;return t/36}function Nr(i,t,e){let n;return i>=2*t?n=2:i>t?n=3:i===t?n=4:2*i<=t?n=6:n=5,e?Math.min(n,e):n}function zr(i,t,e){return Math.max(2,i+t-(e?1:0))}const Sr=(i,t)=>Ax(i+t,2,6);function Bs(i,t,e){const n=i.alive;return e?n*i.t.A:t.blast?Math.min(t.shots,n):n*t.shots}function Uo(i,t,e,n,s){const r=n.t,o=Mo(t),a=Mo(Nr(e.S,r.T,e.poison)),c=1-Mo(zr(r.Sv,e.AP,s)),h=i*o*a*c,l=Math.min(e.D,r.W)/r.W,u=Math.min(n.alive,h*l);return{wounds:h,kills:u,value:u*r.pts}}function Pf(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const gn=(i,t,e)=>i+(t-i)*e,Ke=(i,t)=>i[Math.floor(t()*i.length)],ne=(i,t,e)=>t+i()*(e-t);function An(i){if(i&&typeof i=="object"&&!Object.isFrozen(i)){Object.freeze(i);for(const t of Object.values(i))An(t)}return i}function Rx(i,t=0){let e=3735928559^t,n=1103547991^t;for(let s=0;s<i.length;s++){const r=i.charCodeAt(s);e=Math.imul(e^r,2654435761),n=Math.imul(n^r,1597334677)}return e=Math.imul(e^e>>>16,2246822507),e^=Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507),n^=Math.imul(e^e>>>13,3266489909),4294967296*(2097151&n)+(e>>>0)}function fc(i){var t;if(i===null||typeof i=="boolean"||typeof i=="string")return JSON.stringify(i);if(typeof i=="number"){if(!Number.isFinite(i))throw new Error(`canonicalJSON: ${i} is not a finite number`);return JSON.stringify(i)}if(Array.isArray(i))return`[${i.map(e=>{if(e===void 0)throw new Error("canonicalJSON: undefined in an array");return fc(e)}).join(",")}]`;if(typeof i=="object"&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null))return`{${Object.keys(i).filter(n=>i[n]!==void 0).sort().map(n=>`${JSON.stringify(n)}:${fc(i[n])}`).join(",")}}`;throw new Error(`canonicalJSON: can't encode ${typeof i=="object"?((t=i.constructor)==null?void 0:t.name)??"object":typeof i}`)}const $h={name:"Twig knives",S:3,AP:0,D:1},Cx={key:"squirrel",name:"Bushtail Clans",short:"Bushtails",icon:"🐿️",look:{team:"#ec8a34",dark:"#7a3d12",alt:"#c75ad6",gore:["#cf6d2a","#f1dcb5"],voice:"squeak",models:"squirrel",anim:"squirrel"},army:["elder","oakguard","nutkin","nutkin","grenadier","glider","trebuchet"],units:{nutkin:{name:"Nutkin Skirmishers",short:"Nutkin",role:"Troops",ai:"shooter",models:6,base:.3,pts:7,stats:"M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2",ranged:{name:"Slingshots",range:18,shots:2,S:3,AP:0,D:1,assault:!0,fx:"acorn"},melee:$h,abilities:["Scurry — may shoot after Advancing."]},grenadier:{name:"Acorn Grenadiers",short:"Grenadiers",role:"Troops",ai:"shooter",models:5,base:.3,pts:11,stats:"M6 WS4 BS4 S3 T3 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Blasting acorns",range:12,shots:2,blast:1.6,S:4,AP:1,D:1,scenery:1,fx:"bomb"},melee:$h,abilities:['Blast — lobs 2 templates; a miss scatters D6+1".']},oakguard:{name:"Oak Guard",short:"Oak Guard",role:"Elite",ai:"melee",models:5,base:.34,pts:22,stats:"M5 WS3 BS5 S4 T4 W2 A2 Ld8 Sv3 OC1",ranged:null,melee:{name:"Pinecone halberds",S:5,AP:2,D:1},abilities:["Bark shields — the clan’s anvil. No guns, all heart."]},glider:{name:"Glider Wing",short:"Gliders",role:"Fast",ai:"raider",models:4,base:.32,pts:15,fly:!0,stats:"M12 WS3 BS4 S3 T3 W1 A2 Ld7 Sv5 OC1",ranged:{name:"Thorn darts",range:10,shots:2,S:3,AP:1,D:1,assault:!0,fx:"dart"},melee:{name:"Hooked claws",S:4,AP:1,D:1},abilities:["Fly — moves over scenery and enemy units.","Swoop — may shoot after Advancing."]},trebuchet:{name:"Pinecone Trebuchet",short:"Trebuchet",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:95,big:!0,stats:"M3 WS6 BS4 S3 T5 W7 A2 Ld7 Sv4 OC0",ranged:{name:"Flaming pinecone",range:36,shots:1,blast:3,S:6,AP:1,D:2,indirect:!0,heavy:!0,scenery:3,fx:"pinecone"},melee:{name:"Crew mallets",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving."]},elder:{name:"Elder Chitterwick",short:"Elder",role:"Hero",ai:"hero",models:1,base:.42,pts:80,hero:!0,stats:"M6 WS3 BS3 S4 T4 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Thornburst",spell:6,range:18,shots:1,blast:2.4,S:5,AP:2,D:1,scenery:2,fx:"thorns"},melee:{name:"Rootwood staff",S:5,AP:1,D:2},abilities:["Spell — cast on 2D6 ≥ 6: thorns erupt under the target, no scatter.",`Grey whiskers — friends within ${Ur}" use his Ld 9.`]}}},Px={key:"serpent",name:"Coil of Ssithra",short:"Serpents",icon:"🐍",look:{team:"#46c27a",dark:"#14532d",alt:"#4aa8e8",gore:["#3f8f4a","#d9cf86"],voice:"hiss",models:"serpent",anim:"serpent"},army:["hierophant","brute","scaleguard","scaleguard","spitter","sidewinder","engine"],units:{scaleguard:{name:"Scaleguard",short:"Scaleguard",role:"Troops",ai:"line",models:6,base:.32,pts:10,stats:"M5 WS3 BS5 S4 T4 W1 A1 Ld7 Sv4 OC2",ranged:{name:"Javelins",range:8,shots:1,S:4,AP:0,D:1,fx:"javelin"},melee:{name:"Serpent spears",S:4,AP:1,D:1},abilities:["Shield wall — the Coil’s steady line."]},spitter:{name:"Venom Spitters",short:"Spitters",role:"Troops",ai:"shooter",models:5,base:.32,pts:12,stats:"M5 WS4 BS3 S3 T4 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Venom spit",range:12,shots:2,S:2,AP:1,D:1,poison:4,fx:"spit"},melee:{name:"Fangs",S:3,AP:0,D:1,poison:4},abilities:["Poison 4+ — always wounds on a 4+, however tough the target."]},sidewinder:{name:"Sidewinder Stalkers",short:"Sidewinders",role:"Fast",ai:"melee",models:4,base:.34,pts:24,chargeAfterAdvance:!0,stats:"M10 WS3 BS5 S4 T4 W2 A2 Ld7 Sv5 OC1",ranged:null,melee:{name:"Twin sickles",S:4,AP:1,D:1},abilities:["Sidewind — may charge after Advancing."]},brute:{name:"Constrictor Brute",short:"Brute",role:"Monster",ai:"melee",models:1,base:.95,pts:125,big:!0,wrecker:!0,stats:"M6 WS3 BS6 S6 T6 W9 A4 Ld8 Sv4 OC4",ranged:null,melee:{name:"Crushing coils",S:7,AP:2,D:2},abilities:["Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it)."]},engine:{name:"Basilisk Venom Engine",short:"Venom Engine",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:100,big:!0,stats:"M4 WS6 BS4 S3 T6 W7 A1 Ld7 Sv3 OC0",ranged:{name:"Acid globe",range:30,shots:1,blast:2.6,S:5,AP:2,D:2,poison:3,indirect:!0,heavy:!0,scenery:4,corrodes:!0,fx:"acid"},melee:{name:"Crew hooks",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving.","Acid — Poison 3+, and it eats stone."]},hierophant:{name:"Hierophant Ssithra",short:"Hierophant",role:"Hero",ai:"hero",models:1,base:.45,pts:85,hero:!0,stats:"M5 WS3 BS3 S4 T5 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Mesmerize",spell:7,range:18,mesmerize:!0,fx:"gaze"},melee:{name:"Fang staff",S:5,AP:2,D:2,poison:3},abilities:["Spell — cast on 2D6 ≥ 7: the target suffers D3 mortal wounds and is Mesmerized — it can’t shoot or charge next turn and hits at −1 in melee.",`Coiled will — friends within ${Ur}" use her Ld 9.`]}}},Xh=Object.freeze(["M","WS","BS","S","T","W","A","Ld","Sv","OC"]),jh=Object.freeze(["Troops","Elite","Fast","Hero","Monster","Artillery"]),qh=Object.freeze(["melee","raider","line","shooter","hero","artillery"]),Lf=Object.freeze(["fly","big","hero","wrecker","burrow","chargeAfterAdvance","noCharge","brawler"]),Lx=new Set(["name","short","role","ai","models","base","pts","stats","ranged","melee","abilities",...Lf,"move","deployRow","eye","chest","swarm","swoop"]),Df=["range","shots","S","AP","D","blast","scenery","poison","spell"],If=["assault","heavy","indirect","corrodes","mesmerize"],Dx=new Set(["name","fx",...Df,...If]),Yh=["walk","fly","wreck","burrow"],Kh=["front","mid","back"],Jh=/^#[0-9a-f]{6}$/i,Zh=/^[a-z][a-z0-9-]*$/;function Ix(i){const t={};for(const n of String(i).trim().split(/\s+/)){const s=/^([A-Za-z]+)(\d+)$/.exec(n);if(!s||!Xh.includes(s[1]))throw new Error(`bad stat "${n}" in "${i}"`);if(s[1]in t)throw new Error(`${s[1]} given twice in "${i}"`);t[s[1]]=Number(s[2])}const e=Xh.filter(n=>!(n in t));if(e.length)throw new Error(`"${i}" lacks ${e.join(", ")}`);return t}function Qh(i,t,e){const n=r=>new Error(`${t}: ${r}`);if(!i||typeof i!="object")throw n("must be a weapon object");for(const r of Object.keys(i))if(!Dx.has(r))throw n(`unknown field "${r}"`);if(typeof i.name!="string"||!i.name)throw n("needs a name");if(i.fx!==void 0&&typeof i.fx!="string")throw n("fx is a string");for(const r of Df)if(i[r]!==void 0&&!(Number.isFinite(i[r])&&i[r]>=0))throw n(`${r} must be a number ≥ 0`);for(const r of If)if(i[r]!==void 0&&typeof i[r]!="boolean")throw n(`${r} must be true or false`);for(const r of["shots","S","AP","D","scenery","poison","spell"])if(i[r]!==void 0&&!Number.isInteger(i[r]))throw n(`${r} must be a whole number`);const s=["S","AP","D"];if(e){for(const r of s)if(i[r]===void 0)throw n(`a melee weapon needs ${r}`);for(const r of["range","shots","blast","spell","mesmerize","indirect","heavy","assault"])if(i[r]!==void 0)throw n(`a melee weapon has no ${r}`)}else{if(i.range===void 0)throw n("a ranged weapon needs a range");if(!i.mesmerize){for(const r of["shots",...s])if(i[r]===void 0)throw n(`a ranged weapon needs ${r}`)}if(i.mesmerize&&!i.spell)throw n("mesmerize is a spell: give it a cast value")}return{...i}}function Ux(i,t,e){var v,m;const n=`race ${i}, unit ${t}`,s=p=>new Error(`${n}: ${p}`);if(!e||typeof e!="object")throw s("must be an object");for(const p of Object.keys(e))if(!Lx.has(p))throw s(`unknown field "${p}"`);for(const p of["name","short"])if(typeof e[p]!="string"||!e[p])throw s(`needs a ${p}`);if(!jh.includes(e.role))throw s(`role must be one of ${jh.join(", ")}`);if(!qh.includes(e.ai))throw s(`ai must be one of ${qh.join(", ")}`);if(!Number.isInteger(e.models)||e.models<1)throw s("models must be a whole number ≥ 1");if(!(Number.isFinite(e.base)&&e.base>0))throw s("base must be a radius > 0");if(!Number.isInteger(e.pts)||e.pts<0)throw s("pts must be a whole number ≥ 0");if(!Array.isArray(e.abilities)||e.abilities.some(p=>typeof p!="string"))throw s("abilities is a list of card text");for(const p of Lf)if(e[p]!==void 0&&typeof e[p]!="boolean")throw s(`${p} must be true or false`);if(e.move!==void 0&&!Yh.includes(e.move))throw s(`move must be one of ${Yh.join(", ")}`);if(e.deployRow!==void 0&&!Kh.includes(e.deployRow))throw s(`deployRow must be one of ${Kh.join(", ")}`);for(const p of["eye","chest"])if(e[p]!==void 0&&!(Number.isFinite(e[p])&&e[p]>0))throw s(`${p} must be a height > 0`);if(e.swarm!==void 0&&!Number.isInteger((v=e.swarm)==null?void 0:v.min))throw s("swarm is { min }");if(e.swoop!==void 0&&!Number.isInteger((m=e.swoop)==null?void 0:m.chargeS))throw s("swoop is { chargeS }");let r;try{r=Ix(e.stats)}catch(p){throw s(p.message)}const o=e.ranged===null?null:Qh(e.ranged,`${n}, ranged`,!1),a=Qh(e.melee,`${n}, melee`,!0),c=(p,_)=>e[p]===void 0?_:e[p],h=c("fly",!1),l=c("big",!1),u=c("wrecker",!1),f=c("burrow",!1),d=c("hero",e.role==="Hero"),g={key:t,race:i,name:e.name,short:e.short,role:e.role,ai:e.ai,models:e.models,base:e.base,pts:e.pts,...r,ranged:o,melee:a,abilities:[...e.abilities],fly:h,big:l,hero:d,wrecker:u,burrow:f,chargeAfterAdvance:c("chargeAfterAdvance",!1),noCharge:c("noCharge",e.role==="Artillery"),brawler:c("brawler",!o||u),move:e.move??(h?"fly":u?"wreck":f?"burrow":"walk"),deployRow:e.deployRow??(e.role==="Artillery"?"back":d?"mid":"front"),eye:e.eye??(l?1.9:h?1.5:.95),chest:e.chest??(l||h?1:.55)};return e.swarm&&(g.swarm={min:e.swarm.min}),e.swoop&&(g.swoop={chargeS:e.swoop.chargeS}),g}function Nx(i){if(!i||typeof i!="object")throw new Error("defineRace needs a race object");const{key:t}=i;if(typeof t!="string"||!Zh.test(t))throw new Error(`race key "${t}" must be lower-case letters, digits and dashes`);const e=r=>new Error(`race ${t}: ${r}`);for(const r of Object.keys(i))if(!["key","name","short","icon","look","army","units"].includes(r))throw e(`unknown field "${r}"`);for(const r of["name","short","icon"])if(typeof i[r]!="string"||!i[r])throw e(`needs a ${r}`);const n=i.look;if(!n||typeof n!="object")throw e("needs a look");for(const r of["team","dark","alt"])if(!Jh.test(n[r]??""))throw e(`look.${r} must be a #rrggbb colour`);if(!Array.isArray(n.gore)||n.gore.length!==2||!n.gore.every(r=>Jh.test(r)))throw e("look.gore is two #rrggbb colours");for(const r of["voice","models","anim"])if(typeof n[r]!="string"||!n[r])throw e(`look.${r} must be named`);if(!i.units||typeof i.units!="object"||!Object.keys(i.units).length)throw e("needs units");const s=Object.create(null);for(const[r,o]of Object.entries(i.units)){if(!Zh.test(r))throw e(`unit key "${r}" must be lower-case letters, digits and dashes`);s[r]=Ux(t,r,o)}if(!Array.isArray(i.army)||!i.army.length)throw e("needs an army list");for(const r of i.army)if(!s[r])throw e(`army lists "${r}", which is not one of its units`);return An({key:t,name:i.name,short:i.short,icon:i.icon,look:{...n,gore:[...n.gore]},army:[...i.army],units:s})}function zx(i){const t=i.map(s=>Nx(s)),e=t.map(s=>s.key),n=e.find((s,r)=>e.indexOf(s)!==r);if(n!==void 0)throw new Error(`two races use the key "${n}"`);return An(Object.assign(Object.create(null),Object.fromEntries(t.map(s=>[s.key,s]))))}const Pn=zx([Cx,Px]),js=An(Object.assign(Object.create(null),{classic:{objectives:[{x:0,z:0},{x:-9,z:8},{x:9,z:-8},{x:-9,z:-8},{x:9,z:8}],rounds:Cf,deploy:ri.deploy}})),tu=Object.freeze(["squirrel","serpent"]);function Ft(i,t){const e=Math.abs(i),n=Math.abs(t);if(e===1/0||n===1/0)return 1/0;const s=Math.max(e,n);return s!==s?NaN:s===0?0:Math.sqrt(e/s*(e/s)+n/s*(n/s))*s}function Ox(i,t,e){const n=Math.abs(i),s=Math.abs(t),r=Math.abs(e);if(n===1/0||s===1/0||r===1/0)return 1/0;const o=Math.max(Math.max(n,s),r);if(o!==o)return NaN;if(o===0)return 0;const a=n/o*(n/o),c=s/o*(s/o),h=a+c-a-c,l=r/o*(r/o)-h;return Math.sqrt(a+c+l)*o}const eu=Math.SQRT2,Uf=(i,t,e)=>({nx:Math.round(i/e),nz:Math.round(t/e)});class Fx{constructor(t,e,n=.5){this.W=t,this.H=e,this.cell=n;const{nx:s,nz:r}=Uf(t,e,n);this.nx=s,this.nz=r;const o=this.N=this.nx*this.nz;this.hard=new Uint8Array(o),this.soft=new Uint8Array(o),this.diff=new Uint8Array(o),this.cover=new Uint8Array(o),this.clearAll=new Float32Array(o),this.clearHard=new Float32Array(o),this.tmp=new Float32Array(o)}x(t){return-this.W/2+(t%this.nx+.5)*this.cell}z(t){return-this.H/2+(Math.floor(t/this.nx)+.5)*this.cell}index(t,e){const n=Math.floor((t+this.W/2)/this.cell),s=Math.floor((e+this.H/2)/this.cell);return n<0||s<0||n>=this.nx||s>=this.nz?-1:s*this.nx+n}rebuild(t){this.hard.fill(0),this.soft.fill(0),this.diff.fill(0),this.cover.fill(0);for(const e of t){if(!e.alive)continue;const n=e.nav||e.shape;e.navKind==="hard"?this.raster(n,.1,this.hard):e.navKind==="soft"?this.raster(n,.1,this.soft):e.navKind==="diff"&&this.raster(n,.15,this.diff),e.cover&&this.raster(e.coverShape||n,.6,this.cover)}this.field(this.hard,null,this.clearHard),this.field(this.hard,this.soft,this.clearAll)}raster(t,e,n){const s=Ft(t.hx,t.hz)+e,r=Math.cos(t.yaw),o=Math.sin(t.yaw),a=Math.max(0,Math.floor((t.x-s+this.W/2)/this.cell)),c=Math.min(this.nx-1,Math.floor((t.x+s+this.W/2)/this.cell)),h=Math.max(0,Math.floor((t.z-s+this.H/2)/this.cell)),l=Math.min(this.nz-1,Math.floor((t.z+s+this.H/2)/this.cell));for(let u=h;u<=l;u++)for(let f=a;f<=c;f++){const d=u*this.nx+f,g=this.x(d)-t.x,v=this.z(d)-t.z,m=g*r-v*o,p=g*o+v*r;Math.abs(m)<=t.hx+e&&Math.abs(p)<=t.hz+e&&(n[d]=1)}}field(t,e,n){const{nx:s,nz:r,cell:o}=this,a=1e6,c=o,h=o*eu;for(let l=0;l<this.N;l++)n[l]=t[l]||e&&e[l]?0:a;for(let l=0;l<r;l++)for(let u=0;u<s;u++){const f=l*s+u;let d=n[f];u>0&&(d=Math.min(d,n[f-1]+c)),l>0&&(d=Math.min(d,n[f-s]+c),u>0&&(d=Math.min(d,n[f-s-1]+h)),u<s-1&&(d=Math.min(d,n[f-s+1]+h))),n[f]=d}for(let l=r-1;l>=0;l--)for(let u=s-1;u>=0;u--){const f=l*s+u;let d=n[f];u<s-1&&(d=Math.min(d,n[f+1]+c)),l<r-1&&(d=Math.min(d,n[f+s]+c),u<s-1&&(d=Math.min(d,n[f+s+1]+h)),u>0&&(d=Math.min(d,n[f+s-1]+h))),n[f]=d}for(let l=0;l<this.N;l++){const u=this.x(l),f=this.z(l),d=Math.min(u+this.W/2,this.W/2-u,f+this.H/2,this.H/2-f);n[l]=Math.min(n[l]>0?n[l]-o*.5:0,d)}}clearance(t,e){return e==="wreck"?this.clearHard[t]:this.clearAll[t]}standable(t,e,n,s){return t<0||s&&s[t]?!1:this.clearance(t,n==="wreck"?"wreck":"all")>=e-.06}reach(t,e,{r:n,max:s,mode:r="walk",forbid:o=null}){const a=this.N,c=new Float64Array(a).fill(1/0),h=new Int32Array(a).fill(-1),l=this.index(t,e),u={dist:c,prev:h,start:l,mode:r,sx:t,sz:e};if(l<0)return u;if(r==="fly"){for(let _=0;_<a;_++){const M=Ft(this.x(_)-t,this.z(_)-e);M<=s&&(c[_]=M)}return u}const f=Ft(t-this.x(l),e-this.z(l));c[l]=f;const d=new Bx;d.push(l,f);const{nx:g,nz:v,cell:m}=this,p=this.clearance(l,r==="wreck"?"wreck":"all")<n-.06?n*1.5:0;for(;d.size;){const[_,M]=d.pop();if(M>c[_])continue;const b=_%g,C=_/g|0;for(let E=-1;E<=1;E++)for(let x=-1;x<=1;x++){if(!x&&!E)continue;const A=b+x,y=C+E;if(A<0||y<0||A>=g||y>=v)continue;const S=y*g+A;if(o&&o[S])continue;const U=this.clearance(S,r==="wreck"?"wreck":"all");if(U<n-.06&&!(p&&U>.05&&Ft(this.x(S)-t,this.z(S)-e)<p))continue;let N=this.diff[S]?2:1;r==="wreck"&&this.clearAll[S]<n-.06&&(N=2);const $=M+(x&&E?eu:1)*m*N;$<=s&&$<c[S]&&(c[S]=$,h[S]=_,d.push(S,$))}}return u}path(t,e,n,s){if(t.mode==="fly")return[{x:t.sx,z:t.sz},{x:this.x(e),z:this.z(e)}];const r=[];for(let h=e;h!==-1&&(r.push(h),h!==t.start);h=t.prev[h]);r.reverse();const o=r.map(h=>({x:this.x(h),z:this.z(h)}));if(o[0]={x:t.sx,z:t.sz},o.length<3)return o;const a=[o[0]];let c=0;for(;c<o.length-1;){let h=c+1;for(let l=o.length-1;l>c+1;l--)if(this.walkable(o[c],o[l],n,t.mode,s)){h=l;break}a.push(o[h]),c=h}return a}walkable(t,e,n,s,r){const o=Ft(e.x-t.x,e.z-t.z),a=Math.ceil(o/(this.cell*.5)),c=this.diff[this.index(t.x,t.z)];for(let h=1;h<a;h++){const l=h/a,u=this.index(t.x+(e.x-t.x)*l,t.z+(e.z-t.z)*l);if(u<0||r&&r[u]||this.clearance(u,s==="wreck"?"wreck":"all")<n-.06||this.diff[u]!==c||s==="wreck"&&this.clearAll[u]<n-.06)return!1}if(r!=null&&r.discs){for(const h of r.discs)if(kx(t,e,h)<h.R)return!1}return!0}}function kx(i,t,e){const n=t.x-i.x,s=t.z-i.z,r=n*n+s*s;let o=r>0?((e.x-i.x)*n+(e.z-i.z)*s)/r:0;return o=o<0?0:o>1?1:o,Ft(i.x+n*o-e.x,i.z+s*o-e.z)}const Nf=i=>{let t=0;for(let e=1;e<i.length;e++)t+=Ft(i[e].x-i[e-1].x,i[e].z-i[e-1].z);return t};class Bx{constructor(){this.ids=[],this.keys=[]}get size(){return this.ids.length}push(t,e){const{ids:n,keys:s}=this;let r=n.length;for(n.push(t),s.push(e);r>0;){const o=r-1>>1;if(s[o]<=e)break;n[r]=n[o],s[r]=s[o],r=o}n[r]=t,s[r]=e}pop(){const{ids:t,keys:e}=this,n=[t[0],e[0]],s=t.pop(),r=e.pop();if(t.length){let o=0;const a=t.length;for(;;){let c=2*o+1;if(c>=a||(c+1<a&&e[c+1]<e[c]&&c++,e[c]>=r))break;t[o]=t[c],e[o]=e[c],o=c}t[o]=s,e[o]=r}return n}}function zi(i,t,e){i&&i.push({t,...e})}function ot(i,t,e={}){zi(i.out,t,e)}function zf(i,t){var e;i.journal.trace.push(t),(e=i.onTrace)==null||e.call(i,t,i)}function $o(i,t){const e=i.units.map(n=>`${n.id}:${n.pos.x.toFixed(3)},${n.pos.z.toFixed(3)},${n.models.map(s=>s.w).join("/")}`).join(" ");zf(i,`${t} ${e} chunks:${i.terrain.chunks.filter(n=>n.alive).length} vp:${i.turn.vp.join("-")} rng:${Bc(i.rng)}`)}function Hx(i,t,e){zf(i,`log ${t} ${e.replace(/<[^>]+>/g,"")} rng:${Bc(i.rng)}`)}function Oe(i,t,e,n=""){Hx(i,t,e),ot(i,"log",{side:t,html:e,cls:n,traced:!0,at:i.journal.trace.length}),Of(i)}function Of(i){for(const[t,e,n]of i.journal.pendingLog.splice(0))ot(i,"log",{side:t,html:e,cls:n,traced:!1,at:i.journal.trace.length})}const Ff=An({stone:{colors:["#8f8b82","#9c978d","#7f7b73","#a7a296","#878378"],bw:1,by:.72,bt:.62,hp:3,look:"box"},sand:{colors:["#c9a66b","#d6b67e","#b9935b","#ddc28e","#c29a60"],bw:1,by:.72,bt:.66,hp:2,look:"box"},log:{colors:["#7a5232","#6b4528","#86603c","#5f3e24"],bw:1,by:.56,bt:.56,hp:2,look:"log"}}),Vx=An({oak:["#4f8a34","#5f9a3c","#447a2c","#6aa646"],autumn:["#d08a2c","#c4622a","#e0a93a","#b8481f"],pine:["#2f6a3c","#3a7a46","#285c34"]}),Wx=An(["#7a5232","#5f3e24","#9a7048","#b08a5a"]),Gx=Object.freeze(["#6b4a2e","#5a3d24","#7a5638"]),$x=Object.freeze(["#3f7a34","#4a8a3a","#386c2e"]),Xx=Object.freeze(["#4f8f3e","#5c9a46","#3f7a34"]),jx=Object.freeze(["#3f7a34","#5c9a46","#2f5f28"]),qx=Object.freeze(["#7d7a74","#8c8880","#6e6b66","#96918a"]),Yx=Object.freeze(["#9a7048","#8a6038","#a77d50"]),Kx=Object.freeze(["#8a5a34","#7a4c2a"]),Jx=Object.freeze(["#c0392b","#d35a1f","#8e44ad","#b03050"]),nu=22;function _r(i,t,e,n){const s=Pf(n),r=Math.cos(e.yaw),o=Math.sin(e.yaw),a={p:(c,h)=>({x:e.x+r*c+o*h,z:e.z-o*c+r*h}),yaw:(c=0)=>e.yaw+c};bo[t](i,a,s)}function wr(i,t,e,n,s,r,o,a,{holes:c=[],cap:h=!1,bw:l,bt:u}={}){const f=Ff[a],d=l??f.bw,g=u??f.bt,v=t.p(n,s),m=t.yaw(r),p={blocks:[],x:v.x,z:v.z,yaw:m,style:a,by:f.by,rubble:null,w:d,t:g};for(let _=0;_<o;_++){if(c.includes(_))continue;const M=Ke(f.colors,e),b=m+(e()-.5)*.06,C=f.look==="log"?[d*1.02,f.by,g]:[d*(.95+e()*.04),f.by*.96,g*(.9+e()*.1)],E=i.add({kind:"block",hp:f.hp,shape:{x:v.x,y:f.by*(_+.5),z:v.z,hx:d/2,hy:f.by/2,hz:g/2,yaw:m},navKind:"soft",los:"block",cover:!0,col:p,level:_,look:{piece:f.look,color:M,chip:M,scale:C,yaw:b}});p.blocks.push(E)}if(h&&o>0){const _=Ke(f.colors,e),M=f.by*o+d*.55,b=i.add({kind:"block",hp:f.hp,shape:{x:v.x,y:M,z:v.z,hx:d/2,hy:d*.55,hz:d/2,yaw:m},navKind:"soft",los:"block",cover:!0,col:p,level:o,look:{piece:"cap",color:_,chip:_,r:d*.72,h:d*1.1,yaw:m}});p.blocks.push(b)}return p}function Zx(i,t,e,n,s,r){const o=t.p(n,s),a=ne(e,1.5,2.4),c=ne(e,.17,.26),h=Ke(Gx,e),l=Vx[r],u=[];let f;if(r==="pine"){for(let g=0;g<3;g++){const v=1.05-g*.26,m=1.3-g*.15;u.push({cone:!0,r:v,h:m,color:Ke(l,e),y:a*.45+g*.75+m/2,yaw:e()*3})}f=a*.45+2.5}else{const g=3+Math.floor(e()*3);for(let v=0;v<g;v++){const m=ne(e,.55,.9);u.push({r:m,color:Ke(l,e),pos:[ne(e,-.5,.5),a+ne(e,-.1,.6),ne(e,-.5,.5)]})}f=a+1.2}const d=e()*6;return i.add({kind:"tree",hp:3,shape:{x:o.x,y:f/2,z:o.z,hx:.7,hy:f/2,hz:.7,yaw:0},nav:{x:o.x,z:o.z,hx:c+.12,hz:c+.12,yaw:0},coverShape:{x:o.x,z:o.z,hx:.8,hz:.8,yaw:0},navKind:"soft",los:"obscure",cover:!0,trunkH:a,trunkR:c,look:{piece:"tree",trunk:{h:a,r:c},bark:h,canopy:u,yaw:d,leaves:l}})}function Qx(i,t,e,n,s,r){const o=t.p(n,s),a=t.yaw(r),c=Ke($x,e),h=[];for(let u=0;u<3;u++)h.push({color:Ke(Xx,e),pos:[-.4+u*.4,.62+e()*.08,ne(e,-.08,.08)]});const l=[];if(e()<.4)for(let u=0;u<4;u++)l.push([ne(e,-.5,.5),ne(e,.35,.75),.29]);return i.add({kind:"hedge",hp:1,shape:{x:o.x,y:.42,z:o.z,hx:.6,hy:.42,hz:.3,yaw:a},navKind:"diff",los:"obscure",cover:!0,look:{piece:"hedge",color:c,tufts:h,berries:l,yaw:a,leaves:jx}})}function dc(i,t,e,n,s,r){const o=t.p(n,s),a=ne(e,.65,1.25),c=Ke(qx,e),h=[1,a,ne(e,.75,1.1)],l=[e()*.6,e()*6,e()*.6],u=r*a,f=e()<.6,d=u*1.5;return i.add({kind:"rock",hp:1/0,shape:{x:o.x,y:d/2,z:o.z,hx:r*.85,hy:d/2,hz:r*.85,yaw:0},navKind:"hard",los:d>1.2?"block":"obscure",cover:!0,look:{piece:"boulder",size:r,color:c,scale:h,rot:l,y:u*.55,moss:f}})}function Vc(i,t,e,n,s){const r=t.p(n,s),o=t.yaw(e()*6),a=e();let c,h;if(a<.45){const l=ne(e,.55,.75),u=Ke(Yx,e),f=e()<.4;c={piece:"crate",s:l,color:u,stacked:f},h=f?l*1.7:l}else if(a<.8)c={piece:"barrel",color:Ke(Kx,e)},h=.75;else{const l=[];for(let u=0;u<4;u++)l.push([ne(e,-.12,.12),ne(e,-.12,.12)]);c={piece:"sack",acorns:l},h=.78}return i.add({kind:"crate",hp:1,shape:{x:r.x,y:h/2,z:r.z,hx:.36,hy:h/2,hz:.36,yaw:o},navKind:"diff",los:"obscure",cover:!0,look:{...c,yaw:o,chip:"#9a7048"}})}function ty(i,t,e,n,s){const r=t.p(n,s),o=ne(e,.9,1.9),a=ne(e,.5,.95),c=ne(e,.12,.2),h=Ke(Jx,e),l=[];for(let d=0;d<6;d++){const g=e()*6,v=ne(e,.25,1.1);l.push([g,v])}const u=ne(e,-.12,.12),f=o+a*.7;return i.add({kind:"mushroom",hp:2,shape:{x:r.x,y:f/2,z:r.z,hx:a*.6,hy:f/2,hz:a*.6,yaw:0},nav:{x:r.x,z:r.z,hx:c+.12,hz:c+.12,yaw:0},navKind:"soft",los:"obscure",cover:!0,look:{piece:"mushroom",h:o,r:a,sr:c,cap:h,dots:l,tilt:u,leaves:[h,"#fff6e0","#efe6d0"]}})}function ey(i,t,e,n,s){const r=t.p(0,0),o=[];for(let a=1;a<nu+2;a++)o.push(.78+e()*.3);return i.add({kind:"floor",hp:1/0,shape:{x:r.x,y:.01,z:r.z,hx:n*.75,hy:.01,hz:n*.75,yaw:0},navKind:"diff",cover:!0,look:{piece:"floor",r:n,segments:nu,color:s,rim:o}})}function ny(i,t,e){const n=Ke(["stone","sand","log","stone"],e),s=4+Math.floor(e()*3),r=3+Math.floor(e()*3),o=-s/2+.5,a=-r/2+.5,c=1+Math.floor(e()*(s-2));for(let l=0;l<s;l++){if(l===c)continue;let u=Math.max(1,Math.min(3,3-Math.floor(l/2)+Math.floor(e()*2)-(e()<.3?1:0)));const f=u===3&&e()<.35?[1]:[];wr(i,t,e,o+l,a,0,u,n,{holes:f})}for(let l=1;l<=r;l++){let u=Math.max(1,Math.min(3,3-Math.floor(l/2)+Math.floor(e()*2)));if(e()<.15)continue;const f=u===3&&e()<.35?[1]:[];wr(i,t,e,o,a+.3+.5+(l-1),Math.PI/2,u,n,{holes:f})}const h=Math.floor(e()*3);for(let l=0;l<h;l++)Vc(i,t,e,o+ne(e,1.5,s-1),a+ne(e,1.6,r-.5))}function iy(i,t,e){const n=Ke(["stone","sand","log"],e),s=5+Math.floor(e()*3),r=Math.floor(e()*s);for(let o=0;o<s;o++){if(o===r&&s>5)continue;const a=1+Math.floor(e()*3);wr(i,t,e,o-(s-1)/2,0,0,a,n,{holes:a===3&&e()<.4?[1]:[]})}e()<.6&&Vc(i,t,e,ne(e,-2,2),ne(e,.9,1.4))}function sy(i,t,e){const n=Ke(["stone","sand"],e),s=18,r=3.4,o=[];for(let h=0;h<s/2;h++)o.push(1+Math.floor(e()*3));const a=new Set([0,Math.floor(s/4)+(e()<.5?0:1)]),c=o.map(h=>h===3&&e()<.4);for(let h=0;h<s;h++){const l=h%(s/2);if(a.has(l))continue;const u=h/s*Math.PI*2,f=Math.atan2(-Math.cos(u),-Math.sin(u));wr(i,t,e,Math.cos(u)*r,Math.sin(u)*r,f,o[l],n,{holes:c[l]?[1]:[],bw:1.12})}}function ry(i,t,e){const n=e()<.3?"pine":e()<.4?"autumn":"oak";ey(i,t,e,3,n==="autumn"?"#5a5a2a":"#355a2a");const s=[],r=3+Math.floor(e()*3);for(let o=0;o<60&&s.length<r;o++){const a=e()*Math.PI*2,c=Math.sqrt(e())*2.2,h=Math.cos(a)*c,l=Math.sin(a)*c;s.some(u=>Ft(u.x-h,u.z-l)<1.55)||s.push({x:h,z:l})}for(const o of s)Zx(i,t,e,o.x,o.z,n)}function oy(i,t,e){const n=5+Math.floor(e()*3),s=ne(e,-.12,.12),r=1+Math.floor(e()*(n-2));for(let o=0;o<n;o++){if(o===r&&e()<.7)continue;const a=(o-(n-1)/2)*1.12,c=s*a*a;Qx(i,t,e,a,c,-Math.atan(2*s*a))}}function ay(i,t,e){const n=2+Math.floor(e()*3);dc(i,t,e,0,0,ne(e,.8,1.15));for(let s=1;s<n;s++){const r=e()*6;dc(i,t,e,Math.cos(r)*ne(e,.9,1.4),Math.sin(r)*ne(e,.9,1.4),ne(e,.35,.7))}}function cy(i,t,e){const n=3+Math.floor(e()*3);for(let s=0;s<n;s++)Vc(i,t,e,(s-(n-1)/2)*.8+ne(e,-.1,.1),ne(e,-.3,.3))}function ly(i,t,e){const n=3+Math.floor(e()*3),s=[];for(let r=0;r<40&&s.length<n;r++){const o=e()*6,a=Math.sqrt(e())*1.5,c=Math.cos(o)*a,h=Math.sin(o)*a;s.some(l=>Ft(l.x-c,l.z-h)<.9)||(s.push({x:c,z:h}),ty(i,t,e,c,h))}}function hy(i,t,e){wr(i,t,e,0,0,0,3+Math.floor(e()*2),"sand",{cap:!0,bw:.8,bt:.8}),e()<.7&&dc(i,t,e,1,.4,.4)}const bo=An(Object.assign(Object.create(null),{ruin:ny,wall:iy,tower:sy,forest:ry,hedgerow:oy,rocks:ay,barricade:cy,mushrooms:ly,obelisk:hy})),pc=An(Object.assign(Object.create(null),{tower(i,t,e){_r(i,"tower",{x:0,z:0,yaw:t()*Math.PI},t()*1e9|0),e.push({x:0,z:0,r:4.6,hollow:!0})},rockbox(i,t,e){const n=t()*Math.PI;for(const s of[0,1]){const r=n+s*(Math.PI/2),o=Math.cos(r)*4.2,a=Math.sin(r)*4.2,c=t()*1e9|0;_r(i,"rocks",{x:o,z:a,yaw:r},c),_r(i,"rocks",{x:-o,z:-a,yaw:r+Math.PI},c),e.push({x:o,z:a,r:1.8},{x:-o,z:-a,r:1.8})}}}));function uy(i,t,e,n,s){const r=Pf(e),{W:o,H:a}=i,c=[],h=r(),l=t.centre.find(([,v])=>h<v);l&&pc[l[0]](i,r,c);const u=t.kinds,f=u.reduce((v,m)=>v+m[2],0),d=t.pairs[0]+Math.floor(r()*t.pairs[1]);let g=0;for(let v=0;v<t.attempts&&g<d;v++){let m=r()*f,p=u[0];for(const S of u)if((m-=S[2])<=0){p=S;break}const[_,M]=p,b=ne(r,-o/2+M+t.margin,o/2-M-t.margin),C=ne(r,-a/2+M+t.margin,a/2-M-t.margin);if(Ft(b,C)<M+t.selfGap||Math.abs(b)>o/2-s-t.deployMargin&&(M>t.bigNotInDeploy||t.notInDeploy.includes(_))||n.some(S=>Ft(S.x-b,S.z-C)<M+t.objectiveGap))continue;const x=t.gap;if(c.some(S=>Ft(S.x-b,S.z-C)<S.r+M+x||Ft(S.x+b,S.z+C)<S.r+M+x))continue;const A=r()*Math.PI*2,y=r()*1e9|0;_r(i,_,{x:b,z:C,yaw:A},y),_r(i,_,{x:-b,z:-C,yaw:A+Math.PI},y),c.push({x:b,z:C,r:M},{x:-b,z:-C,r:M}),g++}return c}const iu=Object.freeze(["centre","kinds","pairs","attempts","mirror","margin","selfGap","deployMargin","bigNotInDeploy","notInDeploy","objectiveGap","gap"]),su=Object.freeze(["point"]);function fy(i,t){const e=r=>{throw new Error(`terrain set "${i}": ${r}`)},n=r=>typeof r=="number"&&Number.isFinite(r),s=r=>Number.isInteger(r)&&r>=0;(!t||typeof t!="object")&&e("is not a table");for(const r of Object.keys(t))iu.includes(r)||e(`unknown field "${r}"`);for(const r of iu)r in t||e(`no "${r}"`);(!Array.isArray(t.kinds)||!t.kinds.length)&&e("kinds must list at least one feature"),t.kinds.forEach((r,o)=>{(!Array.isArray(r)||r.length!==3)&&e(`kinds[${o}] must be [feature, radius, weight]`),r[0]in bo||e(`kinds[${o}]: no feature "${r[0]}" (there are ${Object.keys(bo).join(", ")})`),(!n(r[1])||r[1]<=0)&&e(`kinds[${o}] (${r[0]}): radius ${r[1]} must be a number above 0`),(!n(r[2])||r[2]<=0)&&e(`kinds[${o}] (${r[0]}): weight ${r[2]} must be a number above 0`)}),Array.isArray(t.centre)||e("centre must be a list of [piece, threshold]"),t.centre.forEach((r,o)=>{(!Array.isArray(r)||r.length!==2)&&e(`centre[${o}] must be [piece, threshold]`),r[0]in pc||e(`centre[${o}]: no centre piece "${r[0]}" (there are ${Object.keys(pc).join(", ")})`),(!n(r[1])||r[1]<=0||r[1]>1)&&e(`centre[${o}] (${r[0]}): threshold ${r[1]} must be in (0, 1]`),o&&r[1]<=t.centre[o-1][1]&&e(`centre[${o}] (${r[0]}): thresholds must rise (the first one above the draw wins)`)}),(!Array.isArray(t.pairs)||t.pairs.length!==2||!t.pairs.every(s))&&e("pairs must be two whole numbers, 0 or more"),s(t.attempts)||e(`attempts ${t.attempts} must be a whole number, 0 or more`),su.includes(t.mirror)||e(`mirror "${t.mirror}" is not one scatter knows (${su.join(", ")})`);for(const r of["margin","selfGap","deployMargin","bigNotInDeploy","objectiveGap","gap"])n(t[r])||e(`${r} ${t[r]} must be a finite number`);Array.isArray(t.notInDeploy)||e("notInDeploy must be a list of features");for(const r of t.notInDeploy)r in bo||e(`notInDeploy: no feature "${r}"`);return t}const Ls=An(Object.assign(Object.create(null),{classic:{centre:[["tower",.55],["rockbox",.8]],kinds:[["ruin",3.2,4],["wall",3.6,2],["forest",3.2,3],["hedgerow",3.4,2],["rocks",2,2],["barricade",2,2],["mushrooms",2,1.5],["obelisk",1.6,1]],pairs:[6,3],attempts:1200,mirror:"point",margin:.5,selfGap:1.4,deployMargin:1,bigNotInDeploy:2.1,notInDeploy:["forest"],objectiveGap:2.2,gap:2.1}}));for(const i of Object.keys(Ls))fy(i,Ls[i]);function dy(i,t,e,n,s){const r=Math.cos(s.yaw),o=Math.sin(s.yaw),a=i.x-s.x,c=i.y-s.y,h=i.z-s.z,l=[a*r-h*o,c,a*o+h*r],u=[t*r-n*o,e,t*o+n*r],f=[s.hx,s.hy,s.hz];let d=0,g=1;for(let v=0;v<3;v++)if(Math.abs(u[v])<1e-9){if(Math.abs(l[v])>f[v])return!1}else{let m=(-f[v]-l[v])/u[v],p=(f[v]-l[v])/u[v];if(m>p&&([m,p]=[p,m]),m>d&&(d=m),p<g&&(g=p),d>g)return!1}return!0}function py(i,t,e,n){const s=Math.cos(n.yaw),r=Math.sin(n.yaw),o=i-n.x,a=t-n.y,c=e-n.z,h=o*s-c*r,l=o*r+c*s,u=Math.max(0,Math.abs(h)-n.hx),f=Math.max(0,Math.abs(a)-n.hy),d=Math.max(0,Math.abs(l)-n.hz);return Ox(u,f,d)}const ru=i=>({x:i.shape.x,y:i.shape.y,z:i.shape.z}),my=i=>({id:i.id,kind:i.kind,shape:{...i.shape},look:i.look});class gy{constructor(t,e){this.W=t,this.H=e,this.chunks=[],this.features=[],this.dirty=!0,this.nextId=1}clear(t=null){this.chunks=[],this.features=[],this.nextId=1,this.dirty=!0,zi(t,"terrain.clear",{})}add(t,e=null){const n={id:this.nextId++,alive:!0,destructible:t.hp!==1/0,hp:t.hp??1/0,maxHp:t.hp??1/0,los:null,cover:!1,navKind:null,...t},s=n.shape;return s.reach=Ft(s.hx,s.hz)+.05,this.chunks.push(n),zi(e,"terrain.add",{def:my(n)}),n}generate(t,e,n,s="classic",r=null){if(!(s in Ls))throw new Error(`no terrain set "${s}" (there are ${Object.keys(Ls).join(", ")})`);this.clear(r);const o={W:this.W,H:this.H,add:a=>this.add(a,r)};this.features=uy(o,Ls[s],t,e,n),this.dirty=!0}los(t,e,n=1.3){let s=0;const r=e.x-t.x,o=e.y-t.y,a=e.z-t.z,c=r*r+a*a;for(const h of this.chunks){if(!h.alive||!h.los)continue;const l=h.shape;let u=c>0?((l.x-t.x)*r+(l.z-t.z)*a)/c:0;u=u<0?0:u>1?1:u;const f=t.x+r*u-l.x,d=t.z+a*u-l.z;if(!(f*f+d*d>l.reach*l.reach)&&dy(t,r,o,a,l)){if(h.los==="block")return{blocked:!0,obscure:s};Ft(l.x-t.x,l.z-t.z)<n+l.reach*.5||s++}}return{blocked:s>=2,obscure:s}}blast(t,e,n,s,{acid:r=!1}={},o=null){const a=[];for(const c of[...this.chunks]){if(!c.alive||!c.destructible)continue;const h=py(t,.5,e,c.shape);if(h>n)continue;let l=h<n*.6?s:Math.ceil(s/2);r&&c.kind==="block"&&(l+=1),this.hurt(c,l,{x:t,z:e},o,a)}return a}hurt(t,e,n,s=null,r=[]){return!t.alive||!t.destructible||(t.hp-=e,t.hp<=0?(this.destroy(t,n,s),r.push(t)):zi(s,"terrain.hurt",{id:t.id,from:n,at:ru(t)})),r}destroy(t,e,n=null){switch(t.alive=!1,this.dirty=!0,zi(n,"terrain.destroy",{id:t.id,kind:t.kind,from:e,at:ru(t)}),t.kind){case"block":this.collapse(t.col,n),this.rubble(t.col,e,n);break;case"tree":this.topple(t,e,n);break}}collapse(t,e=null){t.blocks=t.blocks.filter(r=>r.alive).sort((r,o)=>r.level-o.level);const n=[];let s=0;for(const r of t.blocks){if(r.level>s){const o=(r.level-s)*t.by;r.level=s,r.shape.y-=o,n.push({id:r.id,dy:o})}s=r.level+1}n.length&&zi(e,"terrain.collapse",{drops:n,by:t.by})}rubble(t,e,n=null){let s=t.rubble;if(!s){const r=t.style;s=t.rubble=this.add({kind:"rubble",hp:1/0,shape:{x:t.x,y:.2,z:t.z,hx:t.w*.7,hy:.2,hz:.6,yaw:t.yaw},navKind:"diff",los:"obscure",cover:!0,look:{piece:"rubble",style:r}},n),this.dirty=!0}zi(n,"terrain.rubble",{id:s.id,from:e})}topple(t,e,n=null){const s=t.shape;let r=s.x-((e==null?void 0:e.x)??s.x-1),o=s.z-((e==null?void 0:e.z)??s.z);const a=Ft(r,o)||1;r/=a,o/=a;const c=t.trunkH,h=this.add({kind:"log",hp:2,shape:{x:s.x+r*c*.5,y:t.trunkR,z:s.z+o*c*.5,hx:c*.5,hy:t.trunkR,hz:t.trunkR+.05,yaw:Math.atan2(-o,r)},navKind:"diff",los:"obscure",cover:!0,look:{piece:"fallen",tree:t.id,dx:r,dz:o}},n);return this.dirty=!0,h}}function vy(i,t){const e=t*2+.16;if(i===1)return[[0,0]];if(i<=4){const r=i===2?e/2:e/(2*Math.sin(Math.PI/i));return Array.from({length:i},(o,a)=>[Math.cos(a/i*Math.PI*2+.4)*r,Math.sin(a/i*Math.PI*2+.4)*r])}const n=i-1,s=Math.max(e,e/(2*Math.sin(Math.PI/n)));return[[0,0],...Array.from({length:n},(r,o)=>[Math.cos(o/n*Math.PI*2+.3)*s,Math.sin(o/n*Math.PI*2+.3)*s])]}function _y(i,t,e){const n=bi(i,e),s=n.units[t],r={id:i.nextUnitId++,key:t,t:s,side:e,race:n.key,pos:{x:0,z:0},models:[],alive:s.models,r:0,flags:{},lost:0,mesmerized:!1};for(let o=0;o<s.models;o++)r.models.push({w:s.W,alive:!0,ox:0,oz:0});return kf(r),r}function kf(i){const t=i.models.filter(n=>n.alive),e=vy(t.length,i.t.base);t.sort((n,s)=>Math.atan2(n.oz,n.ox)-Math.atan2(s.oz,s.ox)),e.forEach(([n,s],r)=>{t[r].ox=n,t[r].oz=s}),i.r=e.reduce((n,[s,r])=>Math.max(n,Ft(s,r)),0)+i.t.base}function Xo(i,t,e){i.pos.x=t,i.pos.z=e}function Bf(i,t){const{W:e}=ri,n=jo(i,t),s=n*(e/2),r=n*(e/2-Er(i.setup).deploy);return{minX:Math.min(s,r),maxX:Math.max(s,r)}}function Hf(i,t,e,{minX:n,maxX:s},r){const o=i.nav,a=o.x(e),c=o.z(e);return!(a-t.r<n-.01||a+t.r>s+.01||!o.standable(e,t.r,"walk")||r.some(h=>Ft(h.pos.x-a,h.pos.z-c)<h.r+t.r+.4))}function xy(i,t,e){return Number.isInteger(e)&&e>=0&&e<i.nav.N&&Hf(i,t,e,Bf(i,t.side),i.units.filter(n=>n!==t))}function Vf(i,t,e,n,s,r){const o=i.nav;let a=null,c=1/0;const h=Bf(i,s);for(let l=0;l<o.N;l++){if(!Hf(i,t,l,h,r))continue;const u=o.x(l),f=o.z(l),d=Ft(u-e,f-n);d<c&&(c=d,a={x:u,z:f})}return a}function yy(i){const{W:t,H:e}=ri;for(const n of[0,1]){const s=jo(i,n),r=i.units.filter(f=>f.side===n),o=[],a=r.filter(f=>f.t.deployRow==="back"),c=r.filter(f=>f.t.deployRow==="mid"),h=r.filter(f=>f.t.deployRow==="front"),l=Er(i.setup).deploy,u=[[h,t/2-l+1.8],[c,t/2-l+3.6],[a,t/2-2.4]];for(const[f,d]of u)f.forEach((g,v)=>{const m=((v+.5)/f.length-.5)*(e-6)*-s,p=Vf(i,g,s*d,m,n,o)||{x:s*d,z:m};Xo(g,p.x,p.z),o.push(g)})}}const Wf=Object.freeze([-1,1]),Er=i=>js.classic,Gf=.5;function My(i,t){if(i.length!==2||t.length!==2)throw new Error("a match has two seats");return i.map((e,n)=>{if(typeof e!="string"||!Pn[e])throw new Error(`seat ${n}: no race "${e}" (there are ${Object.keys(Pn).join(", ")})`);if(t[n]!=="human"&&t[n]!=="ai")throw new Error(`seat ${n}: controller "${t[n]}" is neither human nor ai`);return{seat:n,race:e,edge:Wf[n],ctrl:t[n]}})}const by=i=>({...i,seats:i.seats.map(t=>({...t}))}),bi=(i,t)=>Pn[i.seats[t].race],jo=(i,t)=>i.seats[t].edge,Wc=(i,t)=>i.seats[t].ctrl;function Sy(i,{out:t=null,onTrace:e=null}={}){const{W:n,H:s}=ri,r={setup:An(by(i)),rng:Tx(i.dice),seats:My(i.seats.map(o=>o.race),i.seats.map(o=>o.ctrl)),units:[],nextUnitId:1,objectives:Er().objectives.map((o,a)=>({i:a,x:o.x,z:o.z})),terrain:new gy(n,s),nav:new Fx(n,s,Gf),turn:{stage:"deploy",step:"rolloff",round:1,t:0,active:0,first:0,ph:0,vp:[0,0],wiped:-1,result:null,overtime:0},pending:null,journal:{trace:[],pendingLog:[]},out:t,onTrace:e,strict:!1};r.terrain.generate(i.board,r.objectives,Er().deploy,i.terrain,t),ns(r);for(const o of[0,1])for(const a of bi(r,o).army)r.units.push(_y(r,a,o));return yy(r),r}function ns(i){i.terrain.dirty&&(i.terrain.dirty=!1,i.nav.rebuild(i.terrain.chunks))}function qo(i,t,e,n,s,r=null){let o=0;for(let a=0;a<e;a++){const c=t.models.filter(d=>d.alive);if(!c.length)break;let h=r?c.filter(d=>r.includes(d)):[];h.length||(h=c);const l=h.filter(d=>d.w<t.t.W);let u;if(l.length)u=l[0];else{const d=g=>Ft(Ys(t,g)-s.pos.x,Ks(t,g)-s.pos.z);u=h.reduce((g,v)=>d(g)<d(v)?g:v)}u.w-=n;const f=Math.min(n,n+Math.min(0,u.w));u.w<=0?(wy(i,t,u,s,f),o++):ot(i,"unit.wound",{u:t.id,m:t.models.indexOf(u),dmg:f}),ot(i,"pause",{s:.06})}return o&&(t.lost+=o,ot(i,"pause",{s:.25}),oe(t)&&$f(i,t),i.out&&ot(i,"objectives",{owners:is(i)})),i.out&&ot(i,"status",Ai(i)),o}function $f(i,t){const e=Fr(i,t);if(kf(t),e.length&&!en(i,t)){const n=e.reduce((o,a)=>Si(t,o)<Si(t,a)?o:a),s=Jo(t,n),r=Si(t,n)-(Mi-.3);Xo(t,t.pos.x+(n.pos.x-t.pos.x)/s*r,t.pos.z+(n.pos.z-t.pos.z)/s*r)}ot(i,"unit.formation",{u:t.id,offs:t.models.map(n=>[n.ox,n.oz]),r:t.r,pos:{x:t.pos.x,z:t.pos.z}})}function wy(i,t,e,n,s){e.alive=!1,e.w=0,t.alive--,ot(i,"unit.slain",{u:t.id,m:t.models.indexOf(e),by:n?n.id:null,dmg:s}),oe(t)||Xf(i,t,n)}function Xf(i,t,e){i.journal.pendingLog.push([t.side,`<b>${t.t.name}</b> ${t.t.models>1?"are":"is"} destroyed!`,"big"]),ot(i,"unit.destroyed",{u:t.id,by:e?e.id:null})}function Hs(i,t){const e=t.t.ranged;return!(!e||!oe(t)||t.flags.shot||t.mesmerized||t.flags.fellBack||en(i,t)||t.flags.advanced&&!e.assault)}function Yo(i,t,e){const n=t.t.ranged,s=Si(t,e);if(s>n.range)return{ok:!1,why:`out of range (${s.toFixed(1)}" / ${n.range}")`};if(en(i,e)&&!n.spell)return{ok:!1,why:"locked in combat"};const r=Kc(i,t,e);if(!r.visible&&!n.indirect)return{ok:!1,why:"no line of sight"};let o=0;return n.heavy&&t.flags.moved&&o++,n.indirect&&!r.visible&&o++,{ok:!0,range:s,...r,mod:o,need:Sr(t.t.BS,o)}}function Gc(i,t){return Hs(i,t)?Fn(i,t).filter(e=>Yo(i,t,e).ok):[]}function Ey(i,t,e){const n=t.t.ranged,s=Yo(i,t,e);if(t.flags.shot=!0,ot(i,"unit.face",{u:t.id,tg:e.id}),ot(i,"tray.open",{title:`${t.t.short} → ${e.t.short} · ${n.name}`}),n.spell){const v=Ge(i,2),m=v[0]+v[1]>=n.spell;if(ot(i,"dice",{label:`Cast ${n.spell}+ (2D6)`,dice:v,need:0,sum:!0,pass:m}),!m){ot(i,"spell.fizzle",{u:t.id}),Oe(i,t.side,`<b>${t.t.short}</b> tries ${n.name} — it fizzles (${v[0]+v[1]}).`);return}return ot(i,"spell.cast",{u:t.id}),n.mesmerize?Ry(i,t,e):(Oe(i,t.side,`<b>${t.t.short}</b> casts <b>${n.name}</b> on ${e.t.short}!`),Ay(i,t,e,n))}if(n.blast)return Ty(i,t,e,n,s);const r=Bs(t,n,!1);ot(i,"volley",{u:t.id,tg:e.id,fx:n.fx,n:r});const o=Ge(i,r),a=ei(o,s.need);ot(i,"dice",{label:`Hit ${s.need}+`,dice:o,need:s.need});const c=Nr(n.S,e.t.T,n.poison),h=Ge(i,a),l=ei(h,c);a&&ot(i,"dice",{label:`Wound ${c}+`,dice:h,need:c});const u=zr(e.t.Sv,n.AP,s.cover),f=Ge(i,l),d=u>6?l:l-ei(f,u);l&&ot(i,"dice",{label:u>6?"No save":`Save ${u}+${s.cover?" (cover)":""}`,dice:u>6?[]:f,need:u,save:!0});const g=qo(i,e,d,n.D,t);Oe(i,t.side,`<b>${t.t.short}</b> shoot ${e.t.short}: ${a} hit, ${l} wound, ${d} unsaved${g?` — <b>${g} slain</b>`:""}.`)}function Ty(i,t,e,n,s){const{W:r,H:o}=ri,a=Bs(t,n,!1);Oe(i,t.side,`<b>${t.t.short}</b> fire ${n.name} at ${e.t.short} (${s.need}+${s.visible?"":", unseen"}).`);for(let c=0;c<a&&!(!oe(t)||!oe(e)&&c>0);c++){const h=vr(i.rng)*Math.PI*2,l=vr(i.rng)*e.r*.5,u={x:e.pos.x+Math.cos(h)*l,z:e.pos.z+Math.sin(h)*l};ot(i,"blast.aim",{x:u.x,z:u.z,r:n.blast});const f=Ge(i,1),d=f[0]>=s.need;ot(i,"dice",{label:a>1?`Template ${c+1}: hit ${s.need}+`:`Hit ${s.need}+`,dice:f,need:s.need});let g=u;if(!d){const v=Ge(i,1)[0]+1,m=vr(i.rng)*Math.PI*2;g={x:Math.max(-r/2+.3,Math.min(r/2-.3,u.x+Math.cos(m)*v)),z:Math.max(-o/2+.3,Math.min(o/2-.3,u.z+Math.sin(m)*v))},ot(i,"dice",{label:"Scatter D6+1",dice:[v-1],need:0,sum:!0,note:`${v}"`}),ot(i,"blast.scatter",{from:{x:u.x,z:u.z},to:{x:g.x,z:g.z},d:v})}ot(i,"blast.fire",{u:t.id,to:{x:g.x,z:g.z},fx:n.fx}),jf(i,t,g,n)}}function Ay(i,t,e,n){const s={x:e.pos.x,z:e.pos.z};ot(i,"spell.thorns",{u:t.id,x:s.x,z:s.z,r:n.blast}),jf(i,t,s,n),ot(i,"spell.fade",{u:t.id})}function jf(i,t,e,n){ot(i,"blast.land",{x:e.x,z:e.z,r:n.blast,fx:n.fx});const s=[];for(const o of i.units){if(!oe(o))continue;const a=o.models.filter(c=>c.alive&&Ft(Ys(o,c)-e.x,Ks(o,c)-e.z)<=n.blast+o.t.base*.6);a.length&&s.push({v:o,under:a})}for(const{v:o,under:a}of s){let c=a.length;o.t.big&&(c=Math.ceil(Hc(i)/2)+1);const h=o.side===t.side,l=Nr(n.S,o.t.T,n.poison),u=Ge(i,c),f=ei(u,l);ot(i,"dice",{label:`${h?"⚠ ":""}${o.t.short}: ${c} hit${c>1?"s":""} · wound ${l}+`,dice:u,need:l});const d=Yc(i,o),g=zr(o.t.Sv,n.AP,d),v=Ge(i,f),m=g>6?f:f-ei(v,g);f&&g<=6&&ot(i,"dice",{label:`Save ${g}+${d?" (cover)":""}`,dice:v,need:g,save:!0});const p=qo(i,o,m,n.D,t,a);Oe(i,t.side,`${h?"<b>Friendly fire!</b> ":""}${n.name} hits ${o.t.short}: ${f} wound, ${m} unsaved${p?` — <b>${p} slain</b>`:""}.`)}s.length||ot(i,"pause",{s:.25});const r=i.terrain.blast(e.x,e.z,n.blast,n.scenery||1,{acid:!!n.corrodes},i.out);r.length&&Oe(i,t.side,`…and ${r.length} piece${r.length>1?"s":""} of scenery ${r.length>1?"are":"is"} wrecked.`),ns(i)}function Ry(i,t,e){ot(i,"spell.gaze",{u:t.id,tg:e.id});const n=Math.ceil(Hc(i)/2);ot(i,"dice",{label:"Mortal wounds D3",dice:[n],need:0,sum:!0,note:`${n}`});const s=qo(i,e,n,1,t);e.mesmerized=!0,i.out&&ot(i,"status",Ai(i)),ot(i,"spell.mesmerized",{u:t.id,tg:e.id}),Oe(i,t.side,`<b>${t.t.short}</b> mesmerizes ${e.t.short}: ${n} mortal wound${n>1?"s":""}${s?`, <b>${s} slain</b>`:""}. It can't shoot or charge next turn.`)}function $c(i){return i.t.move}function No(i,t,e,n=[]){const{W:s,H:r}=ri,o=i.nav,a=new Uint8Array(o.N);a.discs=[];for(const c of Fn(i,t)){const h=c.r+t.r+(n.includes(c)?.02:e);a.discs.push({x:c.pos.x,z:c.pos.z,R:h-.02});const l=Math.max(0,Math.floor((c.pos.x-h+s/2)/o.cell)),u=Math.min(o.nx-1,Math.floor((c.pos.x+h+s/2)/o.cell)),f=Math.max(0,Math.floor((c.pos.z-h+r/2)/o.cell)),d=Math.min(o.nz-1,Math.floor((c.pos.z+h+r/2)/o.cell));for(let g=f;g<=d;g++)for(let v=l;v<=u;v++){const m=g*o.nx+v;Ft(o.x(m)-c.pos.x,o.z(m)-c.pos.z)<h&&(a[m]=1)}}return a}function Ds(i,t,e=0){ns(i);const n=en(i,t),s=t.t.M+e,r=$c(t),o=Fn(i,t),a=No(i,t,Mi+.05,n?o:[]),c=No(i,t,Mi+.05),h=i.nav.reach(t.pos.x,t.pos.z,{r:t.r,max:s,mode:r==="fly"?"fly":r,forbid:r==="fly"?null:a});return{u:t,res:h,max:s,mode:r,forbid:a,endForbid:c,fallback:n}}function Or(i,t,e){const{u:n,res:s,mode:r,endForbid:o}=t,a=i.nav;if(e<0||!isFinite(s.dist[e])||!a.standable(e,n.r,r==="wreck"?"wreck":"walk",o))return!1;const c=a.x(e),h=a.z(e);for(const l of i.units)if(l!==n&&oe(l)&&Ft(l.pos.x-c,l.pos.z-h)<l.r+n.r+.08)return!1;return!0}function Cy(i,t,e,n,s=2.4){const r=i.nav;let o=-1,a=s;const c=r.index(e,n);if(c<0)return-1;const h=Math.ceil(s/r.cell),l=c%r.nx,u=c/r.nx|0;for(let f=-h;f<=h;f++)for(let d=-h;d<=h;d++){const g=l+d,v=u+f;if(g<0||v<0||g>=r.nx||v>=r.nz)continue;const m=v*r.nx+g,p=Ft(r.x(m)-e,r.z(m)-n);p<a&&Or(i,t,m)&&(a=p,o=m)}return o}function Py(i,t,e,n=Ds(i,t,t.flags.advanced?t.flags.advRoll:0)){const s=i.nav.path(n.res,e,t.r,n.mode==="fly"?null:n.forbid);t.flags.moved=!0,n.fallback&&(t.flags.fellBack=!0);const r=Nf(s);Oe(i,t.side,`<b>${t.t.short}</b> ${n.fallback?"fall back":t.flags.advanced?"advance":"move"} ${r.toFixed(1)}".`),qf(i,t,s,{fly:n.mode==="fly",stomp:t.t.wrecker&&r>.1}),ns(i)}function Ly(i,t){ot(i,"tray.open",{title:`${t.t.short} — Advance`});const e=Ge(i,1);return ot(i,"dice",{label:"Advance D6",dice:e,need:0,sum:!0,note:`+${e[0]}"`}),t.flags.advanced=!0,t.flags.advRoll=e[0],Oe(i,t.side,`<b>${t.t.short}</b> advance: +${e[0]}".`),e[0]}function Dy(i,t){t.flags.moved=!0}function qf(i,t,e,{speed:n=7,fly:s=!1,stomp:r=!1}={}){const o=Nf(e);if(o<.05)return;const a=[];let c=0;for(let f=1;f<e.length;f++){const d=Ft(e[f].x-e[f-1].x,e[f].z-e[f-1].z);a.push({a:e[f-1],b:e[f],s:c,l:d}),c+=d}const h=[];if(t.t.wrecker){const f=[];for(const g of a)for(let v=0;v<g.l;v+=.25)f.push({s:g.s+v,x:g.a.x+(g.b.x-g.a.x)*v/g.l,z:g.a.z+(g.b.z-g.a.z)*v/g.l,dir:Math.atan2(g.b.x-g.a.x,g.b.z-g.a.z)});const d=a[a.length-1];f.push({s:o,x:e[e.length-1].x,z:e[e.length-1].z,dir:Math.atan2(d.b.x-d.a.x,d.b.z-d.a.z)});for(const g of f){const v=i.out?[]:null;Iy(i,t,g,v)&&v&&h.push({s:g.s,ev:v})}}const l=a.find(f=>o<=f.s+f.l)||a[a.length-1],u=l.l>0?(o-l.s)/l.l:1;Xo(t,gn(l.a.x,l.b.x,u),gn(l.a.z,l.b.z,u)),i.out&&(ot(i,"unit.move",{u:t.id,path:e.map(f=>({x:f.x,z:f.z})),L:o,speed:n,fly:s,stomp:r,smashes:h,to:{x:t.pos.x,z:t.pos.z}}),ot(i,"objectives",{owners:is(i)}),ot(i,"status",Ai(i)))}function Iy(i,t,{x:e,z:n,dir:s},r){let o=0;for(const a of i.terrain.chunks){if(!a.alive||!a.destructible)continue;const c=a.nav||a.shape;Ft(c.x-e,c.z-n)<t.r+Math.max(c.hx,c.hz)*.8&&(i.terrain.hurt(a,99,{x:e-Math.sin(s),z:n-Math.cos(s)},r),o++)}return o}function Tr(i,t){return!(!oe(t)||t.flags.charged||t.flags.chargeTried||t.t.noCharge||t.mesmerized||t.flags.fellBack||en(i,t)||t.flags.advanced&&!t.t.chargeAfterAdvance)}function Ko(i,t){return Tr(i,t)?Fn(i,t).filter(e=>Si(t,e)<=Ir):[]}function qs(i,t,e){ns(i);const n=i.nav,s=Fn(i,t).filter(m=>m!==e),r=$c(t),o=No(i,t,Mi+.05,[e]),a=n.reach(t.pos.x,t.pos.z,{r:t.r,max:Ir+.5,mode:r,forbid:r==="fly"?null:o}),c=[];let h=-1,l=1/0;const u=e.r+t.r+Mi-.08,f=Math.ceil((u+1)/n.cell),d=n.index(e.pos.x,e.pos.z),g=d%n.nx,v=d/n.nx|0;for(let m=-f;m<=f;m++)for(let p=-f;p<=f;p++){const _=g+p,M=v+m;if(_<0||M<0||_>=n.nx||M>=n.nz)continue;const b=M*n.nx+_,C=a.dist[b];if(!isFinite(C))continue;const E=Ft(n.x(b)-e.pos.x,n.z(b)-e.pos.z);E>u||E<e.r+t.r+.02||n.standable(b,t.r,r==="wreck"?"wreck":"walk",o)&&(s.some(x=>Ft(n.x(b)-x.pos.x,n.z(b)-x.pos.z)<x.r+t.r+Mi)||i.units.some(x=>x!==t&&x!==e&&oe(x)&&x.side===t.side&&Ft(x.pos.x-n.x(b),x.pos.z-n.z(b))<x.r+t.r+.05)||(c.push({i:b,d:C}),C<l&&(h=b,l=C)))}return h<0?null:{cell:h,need:Math.max(2,Math.ceil(l-.01)),res:a,forbid:o,mode:r,dist:l,spots:c}}function Yf(i,t){const e=new Uint8Array(i.res.dist.length);for(const n of i.spots)n.d<=t+.011&&(e[n.i]=1);return e[i.cell]=1,e}function Uy(i,t,e,n){const s=qs(i,t,e);if(t.flags.chargeTried=!0,ot(i,"tray.open",{title:`${t.t.short} charge ${e.t.short}`}),!s)return Oe(i,t.side,`<b>${t.t.short}</b> can't find a way to ${e.t.short}.`),null;const r=Ge(i,2),o=r[0]+r[1],a=o>=s.need;return ot(i,"dice",{label:`Charge ${s.need}" (2D6)`,dice:r,need:0,sum:!0,pass:a}),ot(i,"unit.face",{u:t.id,tg:e.id}),a?(t.flags.charged=!0,t.flags.chargeTarget=e.id,ot(i,"charge.result",{u:t.id,tg:e.id,ok:a}),Oe(i,t.side,`<b>${t.t.short}</b> charge ${e.t.short} — roll ${o} vs ${s.need}. <b>Contact!</b>`),n!=="ai"?{plan:s,rolled:o}:(Kf(i,t,e,s.cell,s),null)):(ot(i,"charge.result",{u:t.id,tg:e.id,ok:a}),Oe(i,t.side,`<b>${t.t.short}</b> charge ${e.t.short} — roll ${o}, needed ${s.need}. Failed.`),null)}function Kf(i,t,e,n,s=qs(i,t,e)){const r=i.nav.path(s.res,n,t.r,s.mode==="fly"?null:s.forbid);qf(i,t,r,{speed:11,fly:s.mode==="fly"}),ns(i)}const oe=i=>i.alive>0,Fn=(i,t)=>i.units.filter(e=>e.side!==t.side&&oe(e)),Xc=(i,t)=>i.units.filter(e=>e.side===t.side&&oe(e)&&e!==t),Jo=(i,t)=>Ft(i.pos.x-t.pos.x,i.pos.z-t.pos.z),Si=(i,t)=>Jo(i,t)-i.r-t.r,Fr=(i,t)=>Fn(i,t).filter(e=>Si(t,e)<=Mi+.05),Ys=(i,t)=>i.pos.x+t.ox,Ks=(i,t)=>i.pos.z+t.oz,en=(i,t)=>Fr(i,t).length>0,jc=i=>i.t.eye,qc=i=>i.t.chest;function Yc(i,t){const e=t.models.filter(s=>s.alive);if(t.t.fly)return!1;let n=0;for(const s of e)i.nav.cover[i.nav.index(Ys(t,s),Ks(t,s))]&&n++;return n*2>=e.length&&n>0}function Kc(i,t,e,n=t.pos){const s={x:n.x,y:jc(t),z:n.z};let r=0,o=0,a=0;for(const c of e.models){if(!c.alive)continue;a++;const h=i.terrain.los(s,{x:Ys(e,c),y:qc(e),z:Ks(e,c)});h.blocked||(r++,h.obscure&&o++)}return{visible:r>0,cover:r>0&&(o>0||r<a||Yc(i,e)),seen:r,total:a}}function Jf(i,t){let e=t.t.Ld;for(const n of Xc(i,t))n.t.hero&&Jo(t,n)<=Ur+t.r&&(e=Math.max(e,n.t.Ld));return e}function Zo(i,t){const e=[0,0];for(const n of i.units)if(oe(n))for(const s of n.models)s.alive&&Ft(Ys(n,s)-t.x,Ks(n,s)-t.z)<=Go+n.t.base&&(e[n.side]+=n.t.OC);return e[0]>e[1]?0:e[1]>e[0]?1:-1}const is=i=>i.objectives.map(t=>Zo(i,t)),Ai=i=>({engaged:i.units.filter(t=>oe(t)&&en(i,t)).map(t=>t.id),mesmerized:i.units.filter(t=>t.mesmerized).map(t=>t.id)}),Vs=i=>br[Math.min(i.turn.ph,br.length-1)].key;function Zf(i,t){if(!oe(t)||t.side!==i.turn.active)return!1;switch(Vs(i)){case"move":return!t.flags.moved;case"shoot":return Hs(i,t)&&Gc(i,t).length>0;case"charge":return Tr(i,t)&&Ko(i,t).length>0}return!1}const Qf=(i,t)=>i.units.some(e=>e.side===t&&Zf(i,e)),td=Object.freeze(Object.defineProperty({__proto__:null,alive:oe,anyCanAct:Qf,canAct:Zf,canCharge:Tr,canShoot:Hs,chargePlan:qs,chargeSpots:Yf,chargeTargets:Ko,chestY:qc,controlOf:Zo,dist:Jo,enemiesOf:Fn,engagedWith:Fr,eyeY:jc,forbidMask:No,freeSpot:Vf,friendsOf:Xc,gap:Si,inCover:Yc,isEngaged:en,leadership:Jf,moveMode:$c,movePlan:Ds,mx:Ys,mz:Ks,nearestValid:Cy,ownersOf:is,phaseKey:Vs,rngState:Bc,shootTargets:Gc,shotInfo:Yo,sight:Kc,statusOf:Ai,validEnd:Or},Symbol.toStringTag,{value:"Module"}));function ou(i,t){if(!oe(t)||t.flags.fought)return;const e=Fr(i,t);if(!e.length)return;t.flags.fought=!0;const n=e.find(p=>p.id===t.flags.chargeTarget)||e.reduce((p,_)=>p.alive*p.t.W<_.alive*_.t.W?p:_),s=t.t.melee,r=t.mesmerized?1:0,o=Sr(t.t.WS,r);ot(i,"unit.face",{u:t.id,tg:n.id}),ot(i,"focus",{x:t.pos.x*.5+n.pos.x*.5,z:t.pos.z*.5+n.pos.z*.5}),ot(i,"tray.open",{title:`${t.t.short} fight ${n.t.short} · ${s.name}`});const a=Bs(t,s,!0),c=Ge(i,a),h=ei(c,o);ot(i,"melee",{u:t.id,tg:n.id,n:a,hits:h}),ot(i,"dice",{label:`Hit ${o}+${r?" (mesmerized)":""}`,dice:c,need:o});const l=Nr(s.S,n.t.T,s.poison),u=Ge(i,h),f=ei(u,l);h&&ot(i,"dice",{label:`Wound ${l}+`,dice:u,need:l});const d=zr(n.t.Sv,s.AP,!1),g=Ge(i,f),v=d>6?f:f-ei(g,d);f&&ot(i,"dice",{label:d>6?"No save":`Save ${d}+`,dice:d>6?[]:g,need:d,save:!0});const m=qo(i,n,v,s.D,t);Oe(i,t.side,`<b>${t.t.short}</b> fight ${n.t.short}: ${h} hit, ${f} wound, ${v} unsaved${m?` — <b>${m} slain</b>`:""}.`),ot(i,"pause",{s:.3})}function Ny(i,t){const e=i.units.filter(s=>s.side===t&&s.flags.charged&&oe(s));for(const s of e)ou(i,s);let n=1-t;for(let s=0;s<30;s++){const r=i.units.find(a=>a.side===n&&oe(a)&&!a.flags.fought&&en(i,a)),o=i.units.find(a=>a.side===1-n&&oe(a)&&!a.flags.fought&&en(i,a));if(!r&&!o)break;r&&ou(i,r),n=1-n}for(const s of i.units)s.flags.fought=!1;i.out&&ot(i,"status",Ai(i))}function zy(i){let t=!1;for(const e of i.units){if(!oe(e)||!e.lost||e.t.models===1)continue;t||ot(i,"tray.open",{title:"Morale"}),t=!0;const n=Jf(i,e),s=Ge(i,1),r=s[0]+e.lost,o=s[0]===1?0:Math.max(0,r-n);if(ot(i,"dice",{label:`${e.t.short}: D6 + ${e.lost} lost vs Ld ${n}`,dice:s,need:0,sum:!0,pass:o===0,note:`${r}`}),o){const a=Math.min(o,e.alive),c=e.models.filter(h=>h.alive).slice(-a);for(const h of c)Oy(i,e,h);Oe(i,e.side,`<b>${e.t.short}</b> lose their nerve — <b>${a} flee</b>.`),oe(e)?$f(i,e):Xf(i,e,null),i.out&&(ot(i,"objectives",{owners:is(i)}),ot(i,"status",Ai(i))),ot(i,"pause",{s:.5})}else Oe(i,e.side,`<b>${e.t.short}</b> hold firm (${r} vs Ld ${n}).`)}}function Oy(i,t,e){e.alive=!1,e.w=0,t.alive--,ot(i,"unit.flee",{u:t.id,m:t.models.indexOf(e)})}const ed=i=>i.t.pts*i.alive/i.t.models;function Xi(i,t){return i.t.melee?Uo(i.alive*i.t.A,Sr(i.t.WS,i.mesmerized?1:0),i.t.melee,t,!1).value:0}function nd(i,t,e,n,s){var h;const r=t.t.ranged;if(!r||Ft(e.pos.x-n.x,e.pos.z-n.z)-t.r-e.r>r.range||en(i,e)&&!r.spell)return 0;const a=Kc(i,t,e,n);if(!a.visible&&!r.indirect&&!r.mesmerize)return 0;if(r.mesmerize)return a.visible?Zi(r.spell)*(ed(e)*.25+Math.min(2,e.alive)*e.t.pts*.08+((h=e.t.ranged)!=null&&h.blast?8:0)):0;let c=0;if(r.heavy&&s&&c++,r.indirect&&!a.visible&&c++,r.blast){const l=r.spell?Zi(r.spell):Mo(Sr(t.t.BS,c)),u=e.t.big?3:Math.max(1,Math.min(e.alive,Math.round(e.alive*Math.min(1,r.blast*r.blast/(e.r*e.r))*.8)));return Bs(t,r,!1)*l*Uo(u,1,r,e,a.cover).value}return Uo(Bs(t,r,!1),Sr(t.t.BS,c),r,e,a.cover).value}function au(i,t,e,n){const{nav:s}=i,r=Fn(i,t),o=Xc(i,t),a=i.objectives.map(d=>Zo(i,d)),c=t.t.ai,h={enemies:r,friends:o,owners:a,claimed:n,role:c};let l={cell:-1,score:cu(i,t,t.pos.x,t.pos.z,h,!1),dist:0,...h.last};const u=t.t.M>8?3:2,f=e.res;for(let d=0;d<s.nz;d+=u)for(let g=d/u%2?1:0;g<s.nx;g+=u){const v=d*s.nx+g;if(!isFinite(f.dist[v])||!Or(i,e,v))continue;const m=s.x(v),p=s.z(v),_=cu(i,t,m,p,h,!0)+vr(i.rng)*.05;_>l.score&&(l={cell:v,score:_,dist:Ft(m-t.pos.x,p-t.pos.z),...h.last})}return l}function cu(i,t,e,n,s,r){const{enemies:o,friends:a,owners:c,claimed:h,role:l}=s,u=t.t,f={x:e,z:n},d=r&&Ft(e-t.pos.x,n-t.pos.z)>.3;let g=0,v=!1,m=-1;if(u.OC>0){const b=l==="line"||l==="shooter"?5:l==="melee"?2:2.5;let C=0;for(const E of i.objectives){const x=Ft(E.x-e,E.z-n),A=c[E.i]===t.side?.45:1,y=h.has(E.i)?.25:1;let S;x<=2.6?S=b*A*y*1.4:S=b*A*y*Math.max(0,1-(x-2.6)/16)*.7,S>C&&(C=S,x<=2.6?(v=!0,m=E.i):v||(m=-1))}g+=C}let p=!1;if(u.ranged&&l!=="melee"){let b=0;for(const E of o){const x=nd(i,t,E,f,d);x>b&&(b=x)}b>0&&(p=!0),g+=b*(l==="artillery"?.25:l==="hero"?.12:.18)*(t.flags.advanced&&!u.ranged.assault?0:1)}if(l==="melee"||l==="line"||l==="raider"||l==="hero"){let b=0;for(const E of o){const x=Ft(E.pos.x-e,E.pos.z-n)-t.r-E.r;if(x>Ir)continue;const A=x<=1?1:Zi(Math.ceil(x)),y=Xi(E,t)*.4,S=A*(Xi(t,E)-y+(E.t.role==="Artillery"?10:0));S>b&&(b=S)}if(g+=b*(l==="melee"?.3:l==="raider"?.18:l==="hero"?.06:.15),b===0&&l!=="hero"){const E=Math.min(...o.map(x=>Ft(x.pos.x-e,x.pos.z-n)));g-=E*(l==="melee"?.12:.05)}}const _=l==="shooter"||l==="artillery"||l==="hero";for(const b of o){const C=Ft(b.pos.x-e,b.pos.z-n)-t.r-b.r;b.t.brawler&&C<b.t.M+7&&(g-=Xi(b,t)*(_?.16:.05)*(1-C/(b.t.M+7)))}const M=i.nav.index(e,n);if(M>=0&&i.nav.cover[M]&&(g+=_?1.5:.5),l==="artillery"&&d&&(g-=2.5),l==="hero"){let b=0;for(const E of a)Ft(E.pos.x-e,E.pos.z-n)<=Ur+E.r&&b++;g+=Math.min(3,b)*.9;const C=Math.min(...o.map(E=>Ft(E.pos.x-e,E.pos.z-n)));C<8&&(g-=(8-C)*.6)}for(const b of a){const C=Ft(b.pos.x-e,b.pos.z-n)-b.r-t.r;C<1.5&&(g-=(1.5-C)*.6)}return s.last={onObjective:v,obj:m,canShoot:p},g}const Ws=Object.freeze(["melee","raider","line","shooter","hero","artillery"]);function*Fy(i,t,e){e==="move"?yield*ky(i,t):e==="shoot"?yield*By(i,t):e==="charge"&&(yield*Hy(i,t))}function*ky(i,t){const e=i.units.filter(s=>s.side===t&&oe(s));e.sort((s,r)=>Ws.indexOf(s.t.ai)-Ws.indexOf(r.t.ai));const n=new Set;for(const s of e){if(!oe(s)||s.flags.moved)continue;const r=s.t.ai;if(en(i,s)){const l=Fr(i,s),u=l.reduce((m,p)=>m+Xi(p,s),0),f=l.reduce((m,p)=>Math.max(m,Xi(s,p)),0);if(r==="melee"||r==="line"||f>=u*.8)continue;const d=Ds(i,s);let g=-1,v=-1/0;for(let m=0;m<i.nav.N;m+=2){if(!Or(i,d,m))continue;const p=i.nav.x(m),_=i.nav.z(m),M=Math.min(...Fn(i,s).map(b=>Ft(b.pos.x-p,b.pos.z-_)-b.r));M>v&&(v=M,g=m)}g>=0&&(ot(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"move",u:s.id,c:g});continue}let o=Ds(i,s,s.flags.advanced?s.flags.advRoll:0),a=au(i,s,o,n);const c=Math.min(...Fn(i,s).map(l=>Si(s,l)));let h=!1;if(r==="melee"||r==="line"||r==="raider"?h=c>s.t.M+8&&!(r==="line"&&a.onObjective)&&!(r==="raider"&&a.canShoot):r==="shooter"&&(h=!a.canShoot&&!a.onObjective&&(s.t.ranged.assault||c>s.t.ranged.range+s.t.M+3)),h&&!s.flags.advanced){ot(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"advance",u:s.id},o=Ds(i,s,s.flags.advRoll);const l=au(i,s,o,n);l.cell>=0&&(a=l)}a.obj>=0&&n.add(a.obj),a.cell>=0&&a.dist>.4?(ot(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"move",u:s.id,c:a.cell}):s.flags.advanced&&Dy(i,s),ot(i,"pause",{s:.05})}}function*By(i,t){const e=i.units.filter(n=>n.side===t&&Hs(i,n));e.sort((n,s)=>Ws.indexOf(s.t.ai)-Ws.indexOf(n.t.ai));for(const n of e){if(!Hs(i,n))continue;const s=Gc(i,n);let r=null,o=.4;for(const a of s){let c=nd(i,n,a,n.pos,n.flags.moved);const h=n.t.ranged;if(h.blast)for(const l of i.units){if(l.side!==n.side||!oe(l))continue;const u=Ft(l.pos.x-a.pos.x,l.pos.z-a.pos.z)-l.r;u<h.blast+2.5&&(c-=ed(l)*.25*(1-Math.max(0,u)/(h.blast+2.5)))}h.mesmerize&&a.mesmerized&&(c*=.2),c>o&&(o=c,r=a)}r&&(ot(i,"focus",{x:(n.pos.x+r.pos.x)/2,z:(n.pos.z+r.pos.z)/2}),yield{t:"shoot",u:n.id,tg:r.id},ot(i,"pause",{s:.1}))}}function*Hy(i,t){const e=i.units.filter(n=>n.side===t&&Tr(i,n));e.sort((n,s)=>Ws.indexOf(n.t.ai)-Ws.indexOf(s.t.ai));for(const n of e){if(!Tr(i,n))continue;const s=n.t.ai;let r=null,o=0;for(const a of Ko(i,n)){const c=qs(i,n,a);if(!c)continue;const h=Zi(c.need),l=Xi(n,a)+(a.t.role==="Artillery"?12:0)+(a.alive<=2?6:0),u=Xi(a,n);if(h<(s==="melee"?.25:s==="line"?.33:s==="raider"?.4:s==="hero"?.5:.6)||(s==="shooter"||s==="hero")&&l<u*1.4)continue;const d=h*(l-u*.4);d>o&&(o=d,r=a)}r&&(ot(i,"focus",{x:(n.pos.x+r.pos.x)/2,z:(n.pos.z+r.pos.z)/2}),yield{t:"charge",u:n.id,tg:r.id},ot(i,"pause",{s:.1}))}}const Te=(i,t)=>i.units.find(e=>e.id===t),mc=Object.freeze({place(i,t,{u:e,c:n}){const s=Te(i,e);Xo(s,i.nav.x(n),i.nav.z(n)),ot(i,"unit.place",{u:e,x:s.pos.x,z:s.pos.z})},deployed(i,t){const e=i.pending.seats.filter(n=>n!==t);i.pending=e.length?{...i.pending,seats:e}:null},advance(i,t,{u:e}){Ly(i,Te(i,e))},move(i,t,{u:e,c:n}){Py(i,Te(i,e),n),fo(i)},shoot(i,t,{u:e,tg:n}){Ey(i,Te(i,e),Te(i,n)),fo(i)},charge(i,t,{u:e,tg:n},s){const r=Uy(i,Te(i,e),Te(i,n),s);if(!r)return fo(i);i.pending={k:"chargeEnd",seats:[t],u:e,tg:n,rolled:r.rolled,cell:r.plan.cell}},chargeEnd(i,t,{c:e}){const n=i.pending;Kf(i,Te(i,n.u),Te(i,n.tg),e===-1?n.cell:e),i.pending={k:"phase",seats:n.seats,phase:Vs(i)},fo(i)},end(i){i.pending=null},auto(i,t){ad(i,t,i.pending.phase),i.pending=null},concede(i,t){vc(i,t)}}),lu=Object.freeze({place:{k:"deploy",fields:["u","c"],ok:(i,t,{u:e,c:n})=>ar(i,t,e)??(xy(i,Te(i,e),n)?null:`cell ${n} is no free spot in seat ${t}'s zone for unit ${e}`)},deployed:{k:"deploy",fields:[]},advance:{k:"phase",phase:"move",fields:["u"],ok:(i,t,{u:e})=>ar(i,t,e)??Gy(i,Te(i,e))},move:{k:"phase",phase:"move",fields:["u","c"],ok:(i,t,{u:e,c:n})=>ar(i,t,e)??$y(i,Te(i,e),n)},shoot:{k:"phase",phase:"shoot",fields:["u","tg"],ok:(i,t,{u:e,tg:n})=>ar(i,t,e)??uu(i,t,n)??Xy(i,Te(i,e),Te(i,n))},charge:{k:"phase",phase:"charge",fields:["u","tg"],ok:(i,t,{u:e,tg:n})=>ar(i,t,e)??uu(i,t,n)??jy(i,Te(i,e),Te(i,n))},chargeEnd:{k:"chargeEnd",fields:["c"],ok:(i,t,{c:e},n)=>qy(i,n,e)},end:{k:"phase",fields:[]},auto:{k:"phase",fields:[]},concede:{k:null,fields:[],ok:(i,t)=>Wy(i,t)}});function hu(i,t,e){return id(i,t,e,i.pending)}function id(i,t,e,n){const s=i.rng.locked;Af(i.rng);try{return Vy(i,t,e,n)}finally{s||Rf(i.rng)}}function Vy(i,t,e,n){var r;if(!e||typeof e!="object"||Array.isArray(e))return"not a command";const s=typeof e.t=="string"&&Object.hasOwn(lu,e.t)?lu[e.t]:null;if(!s)return`no command "${e.t}"`;if(!Number.isInteger(t)||t<0||t>=i.seats.length)return`no seat ${t}`;for(const o of Object.keys(e))if(o!=="t"&&!s.fields.includes(o))return`${e.t} takes no field "${o}"`;for(const o of s.fields)if(!Number.isInteger(e[o]))return`${e.t} takes a whole number ${o}`;return i.turn.stage==="over"?"the battle is over":s.k?!n||!n.seats.includes(t)?`seat ${t} has no decision to make now`:n.k!==s.k?`${e.t} doesn't answer the ${n.k} decision`:s.phase&&n.phase!==s.phase?`${e.t} belongs to the ${s.phase} phase, not the ${n.phase}`:((r=s.ok)==null?void 0:r.call(s,i,t,e,n))??null:s.ok(i,t,e)}function ar(i,t,e){const n=Te(i,e);return n&&oe(n)&&n.side===t?null:`unit ${e} is no standing unit of seat ${t}`}function uu(i,t,e){const n=Te(i,e);return n&&oe(n)&&n.side!==t?null:`unit ${e} is no standing enemy of seat ${t}`}const sd=(i,t)=>t>=0&&t<i.nav.N;function Wy(i,t){return Wc(i,t)!=="human"?`seat ${t} is the AI's: only a human seat concedes`:i.turn.wiped>=0?`the battle is decided: seat ${i.turn.wiped} is wiped out`:null}function Gy(i,t){return t.flags.moved?`${t.t.short} has moved`:t.flags.advanced?`${t.t.short} has advanced`:en(i,t)?`${t.t.short} is in combat`:null}function $y(i,t,e){return t.flags.moved?`${t.t.short} has moved`:!sd(i,e)||!Or(i,Ds(i,t,t.flags.advanced?t.flags.advRoll:0),e)?`${t.t.short} can't end its move on cell ${e}`:null}function Xy(i,t,e){if(!Hs(i,t))return`${t.t.short} can't shoot now`;const n=Yo(i,t,e);return n.ok?null:`${t.t.short} can't shoot ${e.t.short}: ${n.why}`}function jy(i,t,e){return Ko(i,t).includes(e)?qs(i,t,e)?null:`${t.t.short} has no way to ${e.t.short}`:`${t.t.short} can't charge ${e.t.short}`}function qy(i,t,e){if(e===-1)return null;const n=sd(i,e)&&qs(i,Te(i,t.u),Te(i,t.tg));return n&&Yf(n,t.rolled)[e]?null:`the charge can't end on cell ${e} (rolled ${t.rolled}")`}const gc=i=>i.seats.filter(t=>t.ctrl==="human").map(t=>t.seat);function rd(i){const t=i.turn;for(;!i.pending&&t.stage!=="over";)switch(t.step){case"rolloff":t.stage="battle",ot(i,"stage",{stage:"battle"}),i.out&&ot(i,"objectives",{owners:is(i)}),Yy(i),t.round=1,t.t=0,t.step="turnStart";break;case"turnStart":t.active=(t.first+t.t)%2,Ky(i,t.active),t.ph=0,t.step="phase";break;case"phase":{const e=Vs(i);ot(i,"phase.start",{side:t.active,phase:e,round:t.round}),t.step="phaseEnd",e==="fight"?i.units.some(n=>oe(n)&&en(i,n))&&Ny(i,t.active):e==="morale"?zy(i):Qf(i,t.active)?Wc(i,t.active)==="human"?i.pending={k:"phase",seats:[t.active],phase:e}:ad(i,t.active,e):ot(i,"pause",{s:.2});break}case"phaseEnd":if($o(i,`phase ${t.active}:${Vs(i)}`),od(i),t.wiped>=0){vc(i);break}t.step=++t.ph<br.length?"phase":"turnEnd";break;case"turnEnd":Jy(i,t.active),t.step=++t.t<2?"turnStart":"score";break;case"score":Zy(i),t.round<i.setup.rounds?(t.round++,t.t=0,t.step="turnStart"):i.setup.overtime==="vote"&&gc(i).length?i.pending={k:"roundLimit",seats:gc(i),votes:{}}:vc(i);break;default:throw new Error(`the engine has no step "${t.step}"`)}i.pending&&i.out&&ot(i,"pending",{k:i.pending.k,seats:[...i.pending.seats]})}function Yy(i){const t=i.turn;ot(i,"tray.open",{title:"Roll-off for the first turn"});let e,n;do e=Ge(i,1),n=Ge(i,1),ot(i,"dice",{label:bi(i,0).short,dice:e,need:0,sum:!0}),ot(i,"dice",{label:bi(i,1).short,dice:n,need:0,sum:!0});while(e[0]===n[0]);t.first=e[0]>n[0]?0:1,Oe(i,t.first,`<b>${bi(i,t.first).name}</b> win the roll-off and take the first turn.`,"big")}function Ky(i,t){for(const e of i.units)e.lost=0,e.side===t&&(e.flags={})}function Jy(i,t){for(const e of i.units)e.side===t&&e.mesmerized&&(e.mesmerized=!1);i.out&&ot(i,"status",Ai(i))}function fo(i){$o(i,"act"),i.out&&(ot(i,"objectives",{owners:is(i)}),ot(i,"status",Ai(i))),ot(i,"act",{tag:"act"}),od(i)}function od(i){for(const t of[0,1])i.units.some(e=>e.side===t&&oe(e))||(i.turn.wiped=t)}function Zy(i){const t=i.turn,e=is(i),n=[0,0];for(const o of e)o>=0&&n[o]++;t.vp[0]+=n[0],t.vp[1]+=n[1],$o(i,`round ${t.round}`);const s=bi(i,0).short,r=bi(i,1).short;Oe(i,-1,`End of round ${t.round}: ${s} hold ${n[0]} objective${n[0]===1?"":"s"}, ${r} hold ${n[1]}. Score ${t.vp[0]}–${t.vp[1]}.`,"big"),ot(i,"round.scored",{round:t.round,held:[...n],vp:[...t.vp],owners:e})}function vc(i,t=-1){const e=i.turn,n=e.stage==="deploy"?0:e.round;Of(i),$o(i,"over"),e.stage="over",i.pending=null,ot(i,"stage",{stage:"over"});const s=t>=0?1-t:e.wiped>=0?1-e.wiped:e.vp[0]>e.vp[1]?0:e.vp[1]>e.vp[0]?1:-1,r=t>=0?"concede":e.wiped>=0?"wipe":"score";e.result={win:s,why:r},ot(i,"game.over",{win:s,why:r,vp:[...e.vp],rounds:n})}function ad(i,t,e){const n=i.pending,s={k:"phase",seats:[t],phase:e};for(const r of Fy(i,t,e)){if(i.strict){const o=id(i,t,r,s);if(o)throw new Error(`the AI (seat ${t}, ${e} phase) asked for ${JSON.stringify(r)}, which is illegal: ${o}`)}if(mc[r.t](i,t,r,"ai"),i.pending!==n)throw new Error(`the AI's ${JSON.stringify(r)} left a decision open: ${JSON.stringify(i.pending)}`)}}const Qy=new Set(["name","short","icon","look","abilities","fx"]),zo=i=>Array.isArray(i)?i.map(zo):i&&typeof i=="object"?Object.fromEntries(Object.entries(i).filter(([t])=>!Qy.has(t)).map(([t,e])=>[t,zo(e)])):i,fu=(i,t)=>Object.fromEntries(Object.entries(i).map(([e,n])=>[e,t(n)])),tM=Object.freeze({BOARD:ri,ENGAGE:Mi,CHARGE_RANGE:Ir,OBJECTIVE_RANGE:Go,ROUNDS:Cf,AURA:Ur});function eM({races:i=Pn,constants:t=tM,phases:e=br.map(r=>r.key),sets:n=Ls,missions:s=js}={}){return{races:fu(i,({units:r,...o})=>({...zo(o),units:fu(r,zo)})),constants:t,phases:e,sets:n,missions:s}}const nM=i=>Rx(fc(eM(i))).toString(36);nM();const du=i=>{var t;return[...((t=i.pending)==null?void 0:t.seats)??[]]},pu=99;function cd(i){const t={};for(const[s,r]of Object.entries(i??{}))r!=null&&(t[s]=r);const e={terrain:"classic",rounds:Er().rounds,overtime:"never",diceMode:"shared"};for(const[s,r]of Object.entries(e))t[s]??(t[s]=r);const n=s=>Number.isInteger(s)&&s>=0&&s<=4294967295;if(!n(t.board)||!n(t.dice))throw new Error(`a setup's board and dice are whole numbers from 0 to 2^32 - 1, not ${t.board} and ${t.dice}`);if(!Number.isInteger(t.rounds)||t.rounds<1||t.rounds>pu)throw new Error(`a battle lasts a whole number of rounds, from 1 to ${pu}, not ${t.rounds}`);if(t.overtime!=="never")throw new Error(`overtime "${t.overtime}": a battle ends after its rounds ('never') until F4's vote`);if(t.diceMode!=="shared")throw new Error(`dice mode "${t.diceMode}": only 'shared' dice so far`);if(!Array.isArray(t.seats))throw new Error("a setup names its seats");return t}function ld(i,{out:t=null,onTrace:e=null,strict:n=!1}={}){const s=Sy(cd(i),{out:t,onTrace:e});s.strict=n;const r=gc(s);if(r.length){ot(s,"stage",{stage:"deploy"});for(const o of r)Oe(s,o,`<b>${bi(s,o).name}</b>: deploy your army.`);s.pending={k:"deploy",seats:r}}return rd(s),s}function hd(i,t){const e=i.rng.locked;Af(i.rng);try{return t(i,td)}finally{e||Rf(i.rng)}}function iM(i,t,e){if(!Object.hasOwn(mc,e.t))throw new Error(`no command "${e.t}"`);mc[e.t](i,t,e,"seat"),rd(i)}class sM{constructor({store:t,localSeats:e=[],sink:n=null,onTrace:s=null}){this.store=t,this.localSeats=Object.freeze([...e]),this.sink=n,this.onTrace=s,this.G=null,this.status="lobby",this.error=null,this.rejected=[],this.folded=0,this.off=t.subscribe(()=>this.onChange()),this.onChange()}decisionFor(){var e;const t=(e=this.G)==null?void 0:e.pending;return(t==null?void 0:t.seats.find(n=>this.localSeats.includes(n)))??-1}preview(t){if(!this.G)throw new Error("no match to preview: the store has no start yet");return hd(this.G,t)}legal(t,e){return this.status!=="live"?`the match is ${this.status}`:this.localSeats.includes(t)?(e==null?void 0:e.t)!=="concede"&&!du(this.G).includes(t)?`seat ${t} has no decision to make now`:hu(this.G,t,e):`seat ${t} is not played on this device`}submit(t,e){const n=this.legal(t,e);if(n)throw new Error(`seat ${t} can't send ${JSON.stringify(e)}: ${n}`);this.store.append({s:t,...e})}onChange(){const t=this.store.entries();for(;this.folded<t.length;){const e=this.folded++;this.fold(t[e],e)}}fold(t,e){var n,s;if(this.status==="lobby"){if((t==null?void 0:t.t)!=="start")return this.reject(e,"the log has no start yet");try{this.G=ld(t.setup,{out:[],onTrace:this.onTrace})}catch(r){return this.status="refused",this.error=r.message,this.reject(e,r.message)}}else{if(this.status!=="live")return this.reject(e,`the match is ${this.status}`);{const{s:r,...o}=t;if(o.t==="start")return this.reject(e,"the match has started already");if(o.t!=="concede"&&!du(this.G).includes(r))return this.reject(e,`seat ${r} has no decision to make`);const a=hu(this.G,r,o);if(a)return this.reject(e,a);iM(this.G,r,o)}}this.status=this.G.turn.stage==="over"?"over":"live",(s=(n=this.sink)==null?void 0:n.events)==null||s.call(n,this.G.out.splice(0),this)}reject(t,e){this.rejected.push({at:t,why:e})}close(){this.off()}}class rM{constructor(t=[]){this.kind="local",this.list=t.map(e=>({...e})),this.subs=new Set}entries(){return this.list}append(t){this.list.push({...t});for(const e of[...this.subs])e()}subscribe(t){return this.subs.add(t),()=>this.subs.delete(t)}export(){return JSON.stringify(this.list)}}const oM=i=>i.objectives.map(t=>i.turn.stage==="battle"||i.turn.stage==="over"?Zo(i,t):-1);function xr(i){const t=i.turn,e={};for(const s of i.units)e[s.id]={pos:{x:s.pos.x,z:s.pos.z},r:s.r,models:s.models.map(r=>({w:r.w,alive:r.alive,ox:r.ox,oz:r.oz})),alive:s.alive,mesmerized:s.mesmerized,engaged:oe(s)&&en(i,s)};const n={};for(const s of i.terrain.chunks)n[s.id]={alive:s.alive,y:s.shape.y};return{units:e,chunks:n,owners:oM(i),vp:[...t.vp],round:t.round,active:t.active,phase:Vs(i),stage:t.stage}}function ud(i,t){const e=t.u===void 0?null:i.units[t.u];switch(t.t){case"unit.place":e.pos={x:t.x,z:t.z};break;case"unit.move":e.pos={x:t.to.x,z:t.to.z};for(const{ev:n}of t.smashes)for(const s of n)ud(i,s);break;case"unit.formation":e.pos={x:t.pos.x,z:t.pos.z},e.r=t.r,t.offs.forEach(([n,s],r)=>{e.models[r].ox=n,e.models[r].oz=s});break;case"unit.wound":e.models[t.m].w-=t.dmg;break;case"unit.slain":case"unit.flee":e.models[t.m].w=0,e.models[t.m].alive=!1,e.alive--;break;case"status":{const n=new Set(t.engaged),s=new Set(t.mesmerized);for(const[r,o]of Object.entries(i.units))o.engaged=n.has(Number(r)),o.mesmerized=s.has(Number(r));break}case"objectives":i.owners=[...t.owners];break;case"round.scored":i.vp=[...t.vp],i.owners=[...t.owners];break;case"phase.start":i.round=t.round,i.active=t.side,i.phase=t.phase;break;case"stage":i.stage=t.stage;break;case"terrain.clear":i.chunks={};break;case"terrain.add":i.chunks[t.def.id]={alive:!0,y:t.def.shape.y};break;case"terrain.destroy":i.chunks[t.id].alive=!1;break;case"terrain.collapse":for(const{id:n,dy:s}of t.drops)i.chunks[n].y-=s;break}return i}const Ar=Object.freeze({phaseStart:(i,t)=>i||t!=="battle"?.9:.6,dice:i=>.38+Math.min(i,14)*.035,pause:i=>i,beat:.3}),{W:po,H:mo}=ri,gi=Object.freeze({title:Object.freeze({orbit:Object.freeze({centre:Object.freeze([-5,0,0]),radius:25,y:13,speed:.035,angle:-1.02})}),landscape:Object.freeze({pos:Object.freeze([0,30,31]),target:Object.freeze([0,0,1.5]),fov:40}),portrait:Object.freeze({pos:Object.freeze([-36,46,0]),target:Object.freeze([-1,0,0]),fov:56}),broadside:Object.freeze({azimuth:0,elevation:.77,max:86}),behind:i=>Object.freeze({azimuth:i<0?-Math.PI/2:Math.PI/2,elevation:.9,max:75})}),fd=i=>!(i<1),aM=({localSeats:i=[],edges:t=[],aspect:e})=>fd(e)?gi.landscape:gi.portrait,dd=i=>fd(i)?gi.landscape.fov:gi.portrait.fov;function cM(i,t,e=i.angle){const n=e+t*i.speed,s=i.centre;return{pos:[s[0]+Math.sin(n)*i.radius,i.y,s[2]+Math.cos(n)*i.radius],target:[s[0],s[1],s[2]]}}const lM=({follow:i,stage:t,active:e,localSeats:n})=>!!i&&t==="battle"&&!(n.length===1&&n.includes(e));function hM(i,t){if(i.pos)return i;const e=dd(t),n=Math.tan(e*Math.PI/360),s=n*t,{azimuth:r,elevation:o}=i,a=[Math.sin(r)*Math.cos(o),Math.sin(o),Math.cos(r)*Math.cos(o)],c=a.map(v=>-v),h=fM([-c[2],0,c[0]]),l=uM(h,c),u=[[-po/2,-mo/2],[po/2,-mo/2],[-po/2,mo/2],[po/2,mo/2]].map(([v,m])=>[v,0,m]),f=v=>u.every(m=>{const p=[m[0]-a[0]*v,m[1]-a[1]*v,m[2]-a[2]*v],_=Va(p,c);return _>0&&Math.abs(Va(p,h))*1.12<=_*s&&Math.abs(Va(p,l))*1.12<=_*n});let d=1,g=i.max;if(f(d))g=d;else if(f(g))for(let v=0;v<60;v++){const m=(d+g)/2;f(m)?g=m:d=m}return{pos:a.map(v=>v*g),target:[0,0,0],fov:e}}const Va=(i,t)=>i[0]*t[0]+i[1]*t[1]+i[2]*t[2],uM=(i,t)=>[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]],fM=i=>{const t=Math.hypot(i[0],i[1],i[2]);return i.map(e=>e/t)},dM=(i,t=Math.random)=>Ke(i,t),Is=i=>1-Math.pow(1-i,3),pM=i=>i*i*i,_c=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,mM=i=>Math.atan2(Math.sin(i),Math.cos(i));function gM(i){return i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375}const vn={speed:1,time:0},xc=new Set;function Ce(i,t,e=n=>n){return new Promise(n=>{xc.add({t:0,duration:Math.max(1e-4,i),fn:t,ease:e,resolve:n})})}const Ln=i=>Ce(i,()=>{});function vM(i){for(const t of[...xc]){t.t+=i;const e=Math.min(1,t.t/t.duration);t.fn(t.ease(e),e),e>=1&&(xc.delete(t),t.resolve())}}class _M{constructor({lowfi:t=!1,fast:e=!1}={}){this.fast=e;const n=this.renderer=new xf({antialias:!0});n.setPixelRatio(t?.5:Math.min(devicePixelRatio,2)),n.setSize(innerWidth,innerHeight),n.shadowMap.enabled=!t,n.shadowMap.type=Vu,n.toneMapping=Wu,n.toneMappingExposure=1.05,document.body.prepend(n.domElement);const s=this.scene=new yf;s.background=new jt("#1c1712"),s.fog=new Lc("#1c1712",70,140),addEventListener("resize",()=>n.setSize(innerWidth,innerHeight)),this.overlay=document.querySelector("#labels")}light(){const t=this.scene;t.add(new yx("#d6e6ff","#3b2a1a",.85));const e=new Hh("#fff0d6",2.3);e.position.set(-16,34,20),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),Object.assign(e.shadow.camera,{left:-27,right:27,top:22,bottom:-22,near:5,far:90}),e.shadow.bias=-4e-4,e.shadow.normalBias=.02,t.add(e);const n=new Hh("#9fb8ff",.35);n.position.set(18,12,-16),t.add(n)}run({parts:t,rig:e,shake:n}){const s=new wx,r=()=>{requestAnimationFrame(r),this.fast&&(vn.speed=1e4);const o=Math.min(s.getDelta(),.05),a=o*vn.speed;vn.time+=a,vM(a),t(a,vn.time),e.update(o),e.render(this.renderer,this.scene,n(),!this.fast)};r()}}const mu={type:"change"},Wa={type:"start"},gu={type:"end"},go=new Ho,vu=new di,xM=Math.cos(70*Kp.DEG2RAD);class yM extends Qi{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Kn.ROTATE,MIDDLE:Kn.DOLLY,RIGHT:Kn.PAN},this.touches={ONE:rs.ROTATE,TWO:rs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(L){L.addEventListener("keydown",Ct),this._domElementKeyEvents=L},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Ct),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(mu),n.update(),r=s.NONE},this.update=function(){const L=new P,it=new Un().setFromUnitVectors(t.up,new P(0,1,0)),St=it.clone().invert(),vt=new P,Q=new Un,D=new P,st=2*Math.PI;return function(Dt=null){const Rt=n.object.position;L.copy(Rt).sub(n.target),L.applyQuaternion(it),a.setFromVector3(L),n.autoRotate&&r===s.NONE&&N(S(Dt)),n.enableDamping?(a.theta+=c.theta*n.dampingFactor,a.phi+=c.phi*n.dampingFactor):(a.theta+=c.theta,a.phi+=c.phi);let Qt=n.minAzimuthAngle,te=n.maxAzimuthAngle;isFinite(Qt)&&isFinite(te)&&(Qt<-Math.PI?Qt+=st:Qt>Math.PI&&(Qt-=st),te<-Math.PI?te+=st:te>Math.PI&&(te-=st),Qt<=te?a.theta=Math.max(Qt,Math.min(te,a.theta)):a.theta=a.theta>(Qt+te)/2?Math.max(Qt,a.theta):Math.min(te,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(l,n.dampingFactor):n.target.add(l),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&E||n.object.isOrthographicCamera?a.radius=Y(a.radius):a.radius=Y(a.radius*h),L.setFromSpherical(a),L.applyQuaternion(St),Rt.copy(n.target).add(L),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,l.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),l.set(0,0,0));let ve=!1;if(n.zoomToCursor&&E){let ye=null;if(n.object.isPerspectiveCamera){const ee=L.length();ye=Y(ee*h);const we=ee-ye;n.object.position.addScaledVector(b,we),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const ee=new P(C.x,C.y,0);ee.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),ve=!0;const we=new P(C.x,C.y,0);we.unproject(n.object),n.object.position.sub(we).add(ee),n.object.updateMatrixWorld(),ye=L.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ye!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ye).add(n.object.position):(go.origin.copy(n.object.position),go.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(go.direction))<xM?t.lookAt(n.target):(vu.setFromNormalAndCoplanarPoint(n.object.up,n.target),go.intersectPlane(vu,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),ve=!0);return h=1,E=!1,ve||vt.distanceToSquared(n.object.position)>o||8*(1-Q.dot(n.object.quaternion))>o||D.distanceToSquared(n.target)>0?(n.dispatchEvent(mu),vt.copy(n.object.position),Q.copy(n.object.quaternion),D.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",se),n.domElement.removeEventListener("pointerdown",R),n.domElement.removeEventListener("pointercancel",F),n.domElement.removeEventListener("wheel",nt),n.domElement.removeEventListener("pointermove",w),n.domElement.removeEventListener("pointerup",F),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Ct),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new Gh,c=new Gh;let h=1;const l=new P,u=new ht,f=new ht,d=new ht,g=new ht,v=new ht,m=new ht,p=new ht,_=new ht,M=new ht,b=new P,C=new ht;let E=!1;const x=[],A={};let y=!1;function S(L){return L!==null?2*Math.PI/60*n.autoRotateSpeed*L:2*Math.PI/60/60*n.autoRotateSpeed}function U(L){const it=Math.abs(L*.01);return Math.pow(.95,n.zoomSpeed*it)}function N(L){c.theta-=L}function $(L){c.phi-=L}const I=function(){const L=new P;return function(St,vt){L.setFromMatrixColumn(vt,0),L.multiplyScalar(-St),l.add(L)}}(),O=function(){const L=new P;return function(St,vt){n.screenSpacePanning===!0?L.setFromMatrixColumn(vt,1):(L.setFromMatrixColumn(vt,0),L.crossVectors(n.object.up,L)),L.multiplyScalar(St),l.add(L)}}(),W=function(){const L=new P;return function(St,vt){const Q=n.domElement;if(n.object.isPerspectiveCamera){const D=n.object.position;L.copy(D).sub(n.target);let st=L.length();st*=Math.tan(n.object.fov/2*Math.PI/180),I(2*St*st/Q.clientHeight,n.object.matrix),O(2*vt*st/Q.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(I(St*(n.object.right-n.object.left)/n.object.zoom/Q.clientWidth,n.object.matrix),O(vt*(n.object.top-n.object.bottom)/n.object.zoom/Q.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function q(L){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h/=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function X(L){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h*=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function j(L,it){if(!n.zoomToCursor)return;E=!0;const St=n.domElement.getBoundingClientRect(),vt=L-St.left,Q=it-St.top,D=St.width,st=St.height;C.x=vt/D*2-1,C.y=-(Q/st)*2+1,b.set(C.x,C.y,1).unproject(n.object).sub(n.object.position).normalize()}function Y(L){return Math.max(n.minDistance,Math.min(n.maxDistance,L))}function rt(L){u.set(L.clientX,L.clientY)}function ct(L){j(L.clientX,L.clientX),p.set(L.clientX,L.clientY)}function G(L){g.set(L.clientX,L.clientY)}function K(L){f.set(L.clientX,L.clientY),d.subVectors(f,u).multiplyScalar(n.rotateSpeed);const it=n.domElement;N(2*Math.PI*d.x/it.clientHeight),$(2*Math.PI*d.y/it.clientHeight),u.copy(f),n.update()}function pt(L){_.set(L.clientX,L.clientY),M.subVectors(_,p),M.y>0?q(U(M.y)):M.y<0&&X(U(M.y)),p.copy(_),n.update()}function wt(L){v.set(L.clientX,L.clientY),m.subVectors(v,g).multiplyScalar(n.panSpeed),W(m.x,m.y),g.copy(v),n.update()}function bt(L){j(L.clientX,L.clientY),L.deltaY<0?X(U(L.deltaY)):L.deltaY>0&&q(U(L.deltaY)),n.update()}function kt(L){let it=!1;switch(L.code){case n.keys.UP:L.ctrlKey||L.metaKey||L.shiftKey?$(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,n.keyPanSpeed),it=!0;break;case n.keys.BOTTOM:L.ctrlKey||L.metaKey||L.shiftKey?$(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,-n.keyPanSpeed),it=!0;break;case n.keys.LEFT:L.ctrlKey||L.metaKey||L.shiftKey?N(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(n.keyPanSpeed,0),it=!0;break;case n.keys.RIGHT:L.ctrlKey||L.metaKey||L.shiftKey?N(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(-n.keyPanSpeed,0),it=!0;break}it&&(L.preventDefault(),n.update())}function Bt(L){if(x.length===1)u.set(L.pageX,L.pageY);else{const it=mt(L),St=.5*(L.pageX+it.x),vt=.5*(L.pageY+it.y);u.set(St,vt)}}function Lt(L){if(x.length===1)g.set(L.pageX,L.pageY);else{const it=mt(L),St=.5*(L.pageX+it.x),vt=.5*(L.pageY+it.y);g.set(St,vt)}}function Zt(L){const it=mt(L),St=L.pageX-it.x,vt=L.pageY-it.y,Q=Math.sqrt(St*St+vt*vt);p.set(0,Q)}function k(L){n.enableZoom&&Zt(L),n.enablePan&&Lt(L)}function Fe(L){n.enableZoom&&Zt(L),n.enableRotate&&Bt(L)}function At(L){if(x.length==1)f.set(L.pageX,L.pageY);else{const St=mt(L),vt=.5*(L.pageX+St.x),Q=.5*(L.pageY+St.y);f.set(vt,Q)}d.subVectors(f,u).multiplyScalar(n.rotateSpeed);const it=n.domElement;N(2*Math.PI*d.x/it.clientHeight),$(2*Math.PI*d.y/it.clientHeight),u.copy(f)}function Ut(L){if(x.length===1)v.set(L.pageX,L.pageY);else{const it=mt(L),St=.5*(L.pageX+it.x),vt=.5*(L.pageY+it.y);v.set(St,vt)}m.subVectors(v,g).multiplyScalar(n.panSpeed),W(m.x,m.y),g.copy(v)}function xt(L){const it=mt(L),St=L.pageX-it.x,vt=L.pageY-it.y,Q=Math.sqrt(St*St+vt*vt);_.set(0,Q),M.set(0,Math.pow(_.y/p.y,n.zoomSpeed)),q(M.y),p.copy(_);const D=(L.pageX+it.x)*.5,st=(L.pageY+it.y)*.5;j(D,st)}function ue(L){n.enableZoom&&xt(L),n.enablePan&&Ut(L)}function Wt(L){n.enableZoom&&xt(L),n.enableRotate&&At(L)}function R(L){n.enabled!==!1&&(x.length===0&&(n.domElement.setPointerCapture(L.pointerId),n.domElement.addEventListener("pointermove",w),n.domElement.addEventListener("pointerup",F)),qt(L),L.pointerType==="touch"?Gt(L):et(L))}function w(L){n.enabled!==!1&&(L.pointerType==="touch"?J(L):Z(L))}function F(L){Nt(L),x.length===0&&(n.domElement.releasePointerCapture(L.pointerId),n.domElement.removeEventListener("pointermove",w),n.domElement.removeEventListener("pointerup",F)),n.dispatchEvent(gu),r=s.NONE}function et(L){let it;switch(L.button){case 0:it=n.mouseButtons.LEFT;break;case 1:it=n.mouseButtons.MIDDLE;break;case 2:it=n.mouseButtons.RIGHT;break;default:it=-1}switch(it){case Kn.DOLLY:if(n.enableZoom===!1)return;ct(L),r=s.DOLLY;break;case Kn.ROTATE:if(L.ctrlKey||L.metaKey||L.shiftKey){if(n.enablePan===!1)return;G(L),r=s.PAN}else{if(n.enableRotate===!1)return;rt(L),r=s.ROTATE}break;case Kn.PAN:if(L.ctrlKey||L.metaKey||L.shiftKey){if(n.enableRotate===!1)return;rt(L),r=s.ROTATE}else{if(n.enablePan===!1)return;G(L),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Wa)}function Z(L){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;K(L);break;case s.DOLLY:if(n.enableZoom===!1)return;pt(L);break;case s.PAN:if(n.enablePan===!1)return;wt(L);break}}function nt(L){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(L.preventDefault(),n.dispatchEvent(Wa),bt(Mt(L)),n.dispatchEvent(gu))}function Mt(L){const it=L.deltaMode,St={clientX:L.clientX,clientY:L.clientY,deltaY:L.deltaY};switch(it){case 1:St.deltaY*=16;break;case 2:St.deltaY*=100;break}return L.ctrlKey&&!y&&(St.deltaY*=10),St}function ft(L){L.key==="Control"&&(y=!0,document.addEventListener("keyup",_t,{passive:!0,capture:!0}))}function _t(L){L.key==="Control"&&(y=!1,document.removeEventListener("keyup",_t,{passive:!0,capture:!0}))}function Ct(L){n.enabled===!1||n.enablePan===!1||kt(L)}function Gt(L){switch(Tt(L),x.length){case 1:switch(n.touches.ONE){case rs.ROTATE:if(n.enableRotate===!1)return;Bt(L),r=s.TOUCH_ROTATE;break;case rs.PAN:if(n.enablePan===!1)return;Lt(L),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case rs.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;k(L),r=s.TOUCH_DOLLY_PAN;break;case rs.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Fe(L),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Wa)}function J(L){switch(Tt(L),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;At(L),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;Ut(L),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;ue(L),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Wt(L),n.update();break;default:r=s.NONE}}function se(L){n.enabled!==!1&&L.preventDefault()}function qt(L){x.push(L.pointerId)}function Nt(L){delete A[L.pointerId];for(let it=0;it<x.length;it++)if(x[it]==L.pointerId){x.splice(it,1);return}}function Tt(L){let it=A[L.pointerId];it===void 0&&(it=new ht,A[L.pointerId]=it),it.set(L.pageX,L.pageY)}function mt(L){const it=L.pointerId===x[0]?x[1]:x[0];return A[it]}n.domElement.addEventListener("contextmenu",se),n.domElement.addEventListener("pointerdown",R),n.domElement.addEventListener("pointercancel",F),n.domElement.addEventListener("wheel",nt,{passive:!1}),document.addEventListener("keydown",ft,{passive:!0,capture:!0}),this.update()}}const _u=i=>new P(i[0],i[1],i[2]),vo=75;class MM{constructor(t){const e=gi.landscape;this.camera=new an(e.fov,innerWidth/innerHeight,.1,400),this.camera.position.set(...e.pos);const n=this.controls=new yM(this.camera,t.domElement);n.target.set(...e.target),n.enableDamping=!0,n.dampingFactor=.08,n.maxPolarAngle=1.32,n.minDistance=5,n.maxDistance=vo,n.screenSpacePanning=!1,n.mouseButtons={LEFT:Kn.ROTATE,MIDDLE:Kn.DOLLY,RIGHT:Kn.PAN},this.follow=!0,this.titleSpin=!0,this.titleAngle=gi.title.orbit.angle,this.viewShift=1,this.focusTween=null,this.keys=new Set,addEventListener("keydown",s=>{s.target.tagName!=="INPUT"&&this.keys.add(s.key.toLowerCase())}),addEventListener("keyup",s=>this.keys.delete(s.key.toLowerCase())),this.fitFov(),addEventListener("resize",()=>{this.fitFov(),this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix()})}fitFov(){const t=this.camera;t.fov=dd(innerWidth/innerHeight),t.aspect=innerWidth/innerHeight,t.updateProjectionMatrix()}fit(t,e=innerWidth/innerHeight){return hM(t,e)}goTo(t,e=1.4){this.titleSpin=!1;const n=this.camera,s=this.controls,r=this.fit(t);s.maxDistance=Math.max(vo,t.max??vo);const o=n.position.clone(),a=s.target.clone(),c=_u(r.pos),h=_u(r.target);Ce(e,l=>{this.viewShift=1-l,n.position.lerpVectors(o,c,l),s.target.lerpVectors(a,h,l)},_c)}toTitle(){this.titleSpin=!0,this.controls.maxDistance=vo,this.titleAngle-=vn.time*gi.title.orbit.speed,this.viewShift=1}focus(t,e,{stage:n,active:s,localSeats:r}){if(!lM({follow:this.follow,stage:n,active:s,localSeats:r}))return;const o=this.camera,a=this.controls,c=a.target.clone();if(Math.hypot(t-c.x,e-c.z)<6)return;const l=o.position.clone().sub(c),u=new P(gn(c.x,t,.6),0,gn(c.z,e,.6)),f=this.focusTween={};Ce(.9,d=>{this.focusTween===f&&(a.target.lerpVectors(c,u,d),o.position.copy(a.target).add(l))},_c)}panKeys(t){const e=this.camera,n=this.controls,s=this.keys,r=new P,o=new P().subVectors(n.target,e.position).setY(0).normalize(),a=new P(-o.z,0,o.x);(s.has("w")||s.has("arrowup"))&&r.add(o),(s.has("s")||s.has("arrowdown"))&&r.sub(o),(s.has("d")||s.has("arrowright"))&&r.add(a),(s.has("a")||s.has("arrowleft"))&&r.sub(a),r.lengthSq()&&(r.normalize().multiplyScalar(t*18),n.target.add(r),e.position.add(r))}update(t){var s;const e=this.camera;if(this.titleSpin){const r=cM(gi.title.orbit,vn.time,this.titleAngle);e.position.set(...r.pos),this.controls.target.set(...r.target)}const n=innerWidth>900?this.viewShift:0;n>.001?e.setViewOffset(innerWidth,innerHeight,-innerWidth*.21*n,0,innerWidth,innerHeight):(s=e.view)!=null&&s.enabled&&e.clearViewOffset(),this.panKeys(t),this.controls.update()}render(t,e,n,s=!0){const r=this.camera,o=new P((Math.random()-.5)*n,(Math.random()-.5)*n,(Math.random()-.5)*n);r.position.add(o),s&&t.render(e,r),r.position.sub(o)}}function bM(i,t,e){const n=document.createElement("canvas");n.width=2048,n.height=Math.round(2048*t/i);const s=n.getContext("2d");s.fillStyle="#5b7a36",s.fillRect(0,0,n.width,n.height);const r=(a,c,h,l,u)=>{for(let f=0;f<c;f++)s.globalAlpha=u*(.4+Math.random()*.6),s.fillStyle=a[Math.random()*a.length|0],s.beginPath(),s.ellipse(Math.random()*n.width,Math.random()*n.height,h+Math.random()*(l-h),h+Math.random()*(l-h),Math.random()*3,0,Math.PI*2),s.fill()};r(["#6a8a40","#4f6c2c","#729347","#55742f","#7f964c"],700,20,90,.35),r(["#7d6b45","#6e5d3a","#8a7650"],40,30,110,.22),r(["#8fa65a","#a4b46a"],300,4,14,.4);for(let a=0;a<14e3;a++)s.globalAlpha=.35,s.fillStyle=Math.random()<.5?"#3f5a24":"#8fae5a",s.fillRect(Math.random()*n.width,Math.random()*n.height,2,4+Math.random()*4);s.globalAlpha=1;const o=new Ic(n);return o.colorSpace=Ae,o.anisotropy=e.capabilities.getMaxAnisotropy(),o}function SM(){const i=document.createElement("canvas");i.width=i.height=512;const t=i.getContext("2d");t.fillStyle="#4a3020",t.fillRect(0,0,512,512);for(let n=0;n<260;n++){t.strokeStyle=Math.random()<.5?"rgba(30,18,10,0.35)":"rgba(110,70,40,0.25)",t.lineWidth=1+Math.random()*3;const s=Math.random()*512;t.beginPath(),t.moveTo(0,s);for(let r=0;r<=512;r+=32)t.lineTo(r,s+Math.sin(r*.02+n)*4);t.stroke()}const e=new Ic(i);return e.colorSpace=Ae,e.wrapS=e.wrapT=Ao,e.repeat.set(6,6),e}class wM{constructor(t,e,{W:n,H:s,deploy:r,edges:o}){this.W=n,this.H=s;const a=new wn({map:bM(n,s,e),roughness:.95}),c=this.board=new Ht(new yi(n,s).rotateX(-Math.PI/2),a);c.receiveShadow=!0,t.add(c);const h=new Ht(new yi(220,220).rotateX(-Math.PI/2),new wn({map:SM(),roughness:.7}));h.position.y=-.62,h.receiveShadow=!0,t.add(h);{const l=new wn({color:"#5a3a22",roughness:.6}),u=[[n+1.6,.8,.8,0,-s/2-.4],[n+1.6,.8,.8,0,s/2+.4],[.8,.8,s,-n/2-.4,0],[.8,.8,s,n/2+.4,0]];for(const[d,g,v,m,p]of u){const _=new Ht(new Nn(d,g,v),l);_.position.set(m,-.22,p),_.castShadow=_.receiveShadow=!0,t.add(_)}const f=new Ht(new Nn(n,.6,s),l);f.position.y=-.31,t.add(f)}this.zoneMats=[],this.zoneLineMats=[];for(const l of[0,1]){const u=o[l],f=new Xe({transparent:!0,opacity:.07,depthWrite:!1});this.zoneMats.push(f);const d=new Ht(new yi(r,s).rotateX(-Math.PI/2),f);d.position.set(u*(n/2-r/2),.008,0),d.renderOrder=1,t.add(d);const g=[];for(let m=-s/2;m<s/2;m+=1)g.push(new P(u*(n/2-r),.02,m),new P(u*(n/2-r),.02,m+.5));const v=new Dc({transparent:!0,opacity:.5});this.zoneLineMats.push(v),t.add(new rx(new Se().setFromPoints(g),v))}this.tufts=new pr(new zn(.035,.13,3),new wn({color:"#ffffff",roughness:1}),700),this.flowers=new pr(new On(.05,0),new wn({roughness:.6}),140),t.add(this.tufts,this.flowers)}paint(t){for(const e of[0,1])this.zoneMats[e].color.set(t[e]),this.zoneLineMats[e].color.set(t[e])}zones(t){for(const e of[0,1])this.zoneMats[e].opacity=t[e]}scatterTufts(){const{W:t,H:e,tufts:n,flowers:s}=this,r=new re,o=new Un,a=new $s,c=new jt;for(let l=0;l<n.count;l++){const u=(Math.random()-.5)*(t-.4),f=(Math.random()-.5)*(e-.4),d=.6+Math.random()*1.2;o.setFromEuler(a.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5)),r.compose(new P(u,.08*d,f),o,new P(d,d,d)),n.setMatrixAt(l,r),n.setColorAt(l,c.set(["#9cba5a","#a8c464","#b4c86e","#8fae50"][l%4]))}const h=["#f4f0e0","#f2d14a","#d77ad0","#e8e8ff"];for(let l=0;l<s.count;l++){const u=(Math.random()-.5)*(t-.4),f=(Math.random()-.5)*(e-.4);r.compose(new P(u,.08,f),o.identity(),new P(1,.6,1)),s.setMatrixAt(l,r),s.setColorAt(l,c.set(h[l%h.length]))}n.instanceMatrix.needsUpdate=s.instanceMatrix.needsUpdate=!0,n.instanceColor.needsUpdate=s.instanceColor.needsUpdate=!0}}const Ga=new Map;function dt(i,t={}){const e=i+JSON.stringify(t);return Ga.has(e)||Ga.set(e,new wn({color:i,roughness:.72,flatShading:!0,...t})),Ga.get(e)}const Vi=i=>dt(i,{emissive:i,emissiveIntensity:1.6,roughness:.3}),We=i=>dt(i,{metalness:.65,roughness:.35}),at={ico:new On(1,1),ico0:new On(1,0),sph:new ln(1,10,8),box:new Nn(1,1,1),cyl:new tn(1,1,1,10),cone:new zn(1,1,8),cap:new ln(1,12,6,0,Math.PI*2,0,Math.PI/2),brim:new Ki(1,12).rotateX(Math.PI/2),oct:new Wo(1,0)};function tt(i,t,e=0,n=0,s=0,r=1,o=r,a=r){const c=new Ht(i,t);return c.position.set(e,n,s),c.scale.set(r,o,a),c.castShadow=!0,c}function Oi(i,t,e,n){const s=new P(...i),r=new P(...t),o=tt(at.cyl,n);return o.position.copy(s).add(r).multiplyScalar(.5),o.scale.set(e,s.distanceTo(r),e),o.quaternion.setFromUnitVectors(new P(0,1,0),r.clone().sub(s).normalize()),o}function EM(i,t){const e=new Ot,n=tt(new tn(i,i*1.05,.09,28),dt("#262422"),0,.045,0);n.receiveShadow=!0;const s=tt(new tn(i*.96,i*.96,.012,28),dt("#4c5e2c",{flatShading:!1}),0,.094,0);s.receiveShadow=!0;const r=tt(new En(i*1.02,.028,4,32).rotateX(Math.PI/2),dt(t,{emissive:t,emissiveIntensity:.35}),0,.07,0);e.add(n,s,r);for(let o=0;o<Math.round(i*9);o++){const a=Math.random()*6,c=Math.sqrt(Math.random())*i*.85;e.add(tt(at.cone,dt("#6a8a3a"),Math.cos(a)*c,.13,Math.sin(a)*c,.035,.08,.035))}return e}function TM(i,t,e,n,s=8,r=40){const o=new zc(i.map(p=>new P(...p))),a=o.computeFrenetFrames(r,!1),c=[],h=[];for(let p=0;p<=r;p++){const _=p/r,M=o.getPointAt(_),b=t+(e-t)*Math.pow(_,.6),C=a.normals[p],E=a.binormals[p];for(let x=0;x<=s;x++){const A=x/s*Math.PI*2,y=Math.cos(A),S=Math.sin(A);c.push(M.x+b*(y*C.x+S*E.x),M.y+b*(y*C.y+S*E.y),M.z+b*(y*C.z+S*E.z))}}for(let p=0;p<r;p++)for(let _=0;_<s;_++){const M=p*(s+1)+_,b=M+s+1;h.push(M,M+1,b,b,M+1,b+1)}const l=o.getPointAt(0),u=c.length/3;c.push(l.x,l.y,l.z);for(let p=0;p<s;p++)h.push(u,p+1,p);const f=o.getPointAt(1),d=c.length/3;c.push(f.x,f.y,f.z);const g=r*(s+1);for(let p=0;p<s;p++)h.push(d,g+p,g+p+1);const v=new Se;v.setAttribute("position",new ie(c,3)),v.setIndex(h),v.computeVertexNormals();const m=new Ht(v,n);return m.castShadow=!0,m}const lr=()=>dt("#7a5232");function AM(i=1.1,t="#c9a24a"){const e=new Ot;return e.add(tt(at.cyl,lr(),0,0,0,.022,i,.022)),e.add(tt(at.cone,We(t),0,i/2+.07,0,.04,.14,.04)),e}function pd(i,t,e){const n=new Ot,s=tt(at.cyl,t,0,0,0,i,.04,i);return s.rotation.x=Math.PI/2,n.add(s),n.add(tt(at.sph,e,0,0,.03,i*.25,i*.25,i*.15)),n}const hr=(i,t)=>{const e=new jt(i),n={};return e.getHSL(n),e.setHSL(n.h,n.s,Math.max(0,Math.min(1,n.l+t))),"#"+e.getHexString()};function Jn(i,t,e=.9){i.userData.hand.add(t),t.rotation.x=e}function md(i,t,e,n){const s=new Ot,r=tt(at.cyl,dt("#5a3a22"),0,0,0,i,.1,i);r.rotation.z=Math.PI/2;const o=tt(at.cyl,We("#444"),0,0,0,i*.3,.13,i*.3);return o.rotation.z=Math.PI/2,s.add(r,o),s.position.set(t,e,n),s}class RM{constructor(t,e,n,s){this.colorOf=s,this.items=e.map((r,o)=>{const a=new Ot;a.position.set(r.x,0,r.z);const c=new Ht(new tn(.55,.65,.16,8),dt("#8a8478"));c.position.y=.08,c.castShadow=c.receiveShadow=!0;const h=new Ht(new Wo(.2,0),new wn({color:"#fff3c0",emissive:"#ffd060",emissiveIntensity:.8,flatShading:!0}));h.position.y=.42;const l=new Ht(new tn(.03,.03,2.1,6),dt("#5a3d24"));l.position.set(.35,1.1,0),l.castShadow=!0;const u=new wn({color:"#e8e0d0",side:cn,roughness:.8}),f=new Ht(new yi(.8,.5,6,1).translate(.4,0,0),u);f.position.set(.35,1.85,0),f.castShadow=!0;const d=new Ht(new Ji(n-.06,n,64).rotateX(-Math.PI/2),new Xe({color:"#fff3c0",transparent:!0,opacity:.35,depthWrite:!1}));return d.position.y=.03,a.add(c,h,l,f,d),t.add(a),{i:o,g:a,gem:h,flag:f,flagMat:u,ring:d,owner:-1}})}paint(t,e){t.owner=e,t.flagMat.color.set(e<0?"#e8e0d0":this.colorOf(e)),t.ring.material.color.set(e<0?"#fff3c0":this.colorOf(e))}reset(){for(const t of this.items)this.paint(t,-1)}animate(t,e,n){for(const s of this.items){const r=n[s.i];r!==s.owner&&this.paint(s,r),s.gem.rotation.y=e*1.2,s.gem.position.y=.45+Math.sin(e*2+s.i)*.05,s.flag.rotation.y=Math.sin(e*2.2+s.i)*.25,s.ring.material.opacity=.3+Math.sin(e*2+s.i)*.08}}}let je=null,Us=null,Zn=!1;try{Zn=localStorage.getItem("tails-and-scales:muted")==="1"}catch{}function Qo(){if(!je)try{je=new(window.AudioContext||window.webkitAudioContext),Us=je.createGain(),Us.gain.value=Zn?0:.5,Us.connect(je.destination)}catch{je=null}}function CM(){Zn=!Zn;try{localStorage.setItem("tails-and-scales:muted",Zn?"1":"0")}catch{}return Us&&(Us.gain.value=Zn?0:.5),Zn}const PM=()=>Zn;function LM(i){const t=Math.floor(je.sampleRate*i),e=je.createBuffer(1,t,je.sampleRate),n=e.getChannelData(0);for(let r=0;r<t;r++)n[r]=Math.random()*2-1;const s=je.createBufferSource();return s.buffer=e,s}function gd(i,t,e,n,s){const r=je.createGain();return r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(n,t+e),r.gain.exponentialRampToValueAtTime(1e-4,t+s),i.connect(r),r.connect(Us),r}function Ts({dur:i=.3,freq:t=800,type:e="lowpass",peak:n=.5,delay:s=0,q:r=1}){const o=je.currentTime+s,a=LM(i),c=je.createBiquadFilter();c.type=e,c.frequency.value=t,c.Q.value=r,a.connect(c),gd(c,o,.005,n,i),a.start(o)}function Fi({f0:i=440,f1:t=i,dur:e=.15,type:n="sine",peak:s=.2,delay:r=0}){const o=je.currentTime+r,a=je.createOscillator();a.type=n,a.frequency.setValueAtTime(i,o),a.frequency.exponentialRampToValueAtTime(Math.max(20,t),o+e),gd(a,o,.01,s,e),a.start(o),a.stop(o+e+.05)}const xu={squeak(){Fi({f0:1400,f1:2400,dur:.12,type:"sine",peak:.12})},hiss(){Ts({dur:.35,freq:5e3,type:"highpass",peak:.18})}},DM={voice(i){Object.hasOwn(xu,i)&&xu[i]()},dice(i=3){for(let t=0;t<Math.min(6,i);t++)Ts({dur:.04,freq:2500+Math.random()*2e3,type:"bandpass",q:4,peak:.35,delay:t*.035+Math.random()*.02})},boom(i=1){Ts({dur:.5+i*.5,freq:300+200/i,peak:.8}),Fi({f0:90,f1:30,dur:.5+i*.3,type:"sine",peak:.5})},shot(){Fi({f0:900,f1:300,dur:.08,type:"triangle",peak:.12})},thwack(){Ts({dur:.07,freq:1400,type:"bandpass",q:2,peak:.4})},crumble(){Ts({dur:.8,freq:500,peak:.45});for(let i=0;i<4;i++)Ts({dur:.05,freq:1200,type:"bandpass",peak:.25,delay:.1+i*.09})},magic(){for(let i=0;i<4;i++)Fi({f0:500+i*220,f1:900+i*300,dur:.25,type:"sine",peak:.08,delay:i*.06})},fizzle(){Fi({f0:600,f1:120,dur:.35,type:"sawtooth",peak:.06})},fanfare(){[523,659,784,1046].forEach((i,t)=>Fi({f0:i,dur:.3,type:"triangle",peak:.15,delay:t*.14}))},click(){Fi({f0:1200,f1:900,dur:.04,type:"square",peak:.04})}},Re=new Proxy(DM,{get(i,t){return(...e)=>{if(!(!je||Zn))try{i[t](...e)}catch{}}}}),Hi=new Nn(1,1,1),vd=new tn(.5,.5,1,8).rotateZ(Math.PI/2),$a=new Map;function me(i,t={}){const e=i+JSON.stringify(t);return $a.has(e)||$a.set(e,new wn({color:i,roughness:.9,flatShading:!0,...t})),$a.get(e)}function ge(i,t,{shadow:e=!0}={}){const n=new Ht(i,t);return n.castShadow=e,n.receiveShadow=!0,n}const Xa={box:i=>yu(i,Hi),log:i=>yu(i,vd),cap(i){const{look:t,shape:e}=i,n=ge(new zn(t.r,t.h,4).rotateY(Math.PI/4),me(t.color));return n.position.set(e.x,e.y,e.z),n.rotation.y=t.yaw,{obj:n}},tree(i){const{look:t,shape:e}=i,{h:n,r:s}=t.trunk,r=new Ot;r.position.set(e.x,0,e.z);const o=ge(new tn(s*.75,s,n,7).translate(0,n/2,0),me(t.bark));r.add(o);const a=new Ot;r.add(a);for(const c of t.canopy)if(c.cone){const h=ge(new zn(c.r,c.h,8),me(c.color));h.position.y=c.y,h.rotation.y=c.yaw,a.add(h)}else{const h=ge(new On(c.r,1),me(c.color));h.position.set(...c.pos),h.scale.y=.8,a.add(h)}return r.rotation.y=t.yaw,{obj:r,canopy:a}},hedge(i){const{look:t,shape:e}=i,n=new Ot;n.position.set(e.x,0,e.z),n.rotation.y=t.yaw;const s=ge(Hi,me(t.color));s.scale.set(1.15,.62,.55),s.position.y=.31,n.add(s);for(const r of t.tufts){const o=ge(new On(.3,0),me(r.color));o.position.set(...r.pos),n.add(o)}for(const r of t.berries){const o=ge(new ln(.05,5,4),me("#c0302a"),{shadow:!1});o.position.set(...r),n.add(o)}return{obj:n}},boulder(i){const{look:t,shape:e}=i,n=ge(new Io(t.size,0),me(t.color));if(n.scale.set(...t.scale),n.rotation.set(...t.rot),n.position.set(e.x,t.y,e.z),t.moss){const s=ge(new Io(t.size*.55,0),me("#5d7a3a"),{shadow:!1});s.position.set(0,t.size*.55,0),s.scale.set(1.1,.4,1.1),n.add(s)}return{obj:n}},crate(i){const{look:t}=i,e=new Ot,n=t.s,s=ge(Hi,me(t.color));s.scale.setScalar(n),s.position.y=n/2;const r=ge(Hi,me("#5f3e24"));if(r.scale.set(n*1.02,n*.14,n*1.02),r.position.y=n/2,e.add(s,r),t.stacked){const o=ge(Hi,me("#9a7048"));o.scale.setScalar(n*.7),o.position.set(0,n+n*.35,0),o.rotation.y=.5,e.add(o)}return ja(i,e)},barrel(i){const t=new Ot,e=ge(new tn(.28,.24,.75,10),me(i.look.color));e.position.y=.375;const n=ge(new En(.29,.025,4,14).rotateX(Math.PI/2),me("#3a3a3a",{metalness:.4}));return n.position.y=.55,t.add(e,n),ja(i,t)},sack(i){const t=new Ot,e=ge(new ln(.34,9,7),me("#c2a77a"));e.scale.set(1,1.15,.9),e.position.y=.36,t.add(e);for(const[n,s]of i.look.acorns){const r=ge(new ln(.08,6,5),me("#8a5a2a"));r.position.set(n,.72,s),t.add(r)}return ja(i,t)},mushroom(i){const{look:t,shape:e}=i,{h:n,r:s,sr:r}=t,o=new Ot;o.position.set(e.x,0,e.z);const a=ge(new tn(r*.8,r*1.2,n,8).translate(0,n/2,0),me("#efe6d0")),c=ge(new ln(s,14,8,0,Math.PI*2,0,Math.PI/2),me(t.cap));c.position.y=n-.05,c.scale.y=.7;const h=ge(new Ki(s,14).rotateX(Math.PI/2),me("#e9dcc0"));h.position.y=n-.05,o.add(a,c,h);for(const[l,u]of t.dots){const f=ge(new ln(s*.12,5,4),me("#fff6e0"),{shadow:!1});f.position.set(Math.cos(l)*Math.sin(u)*s,n-.05+Math.cos(u)*s*.7,Math.sin(l)*Math.sin(u)*s),o.add(f)}return o.rotation.z=t.tilt,{obj:o}},floor(i){const{look:t,shape:e}=i,n=new Ki(t.r,t.segments),s=n.attributes.position;if(t.rim.length!==s.count-1)throw new Error(`a forest floor of ${s.count} vertices with ${t.rim.length} rim draws`);for(let o=1;o<s.count;o++){const a=t.rim[o-1];s.setXY(o,s.getX(o)*a,s.getY(o)*a)}n.rotateX(-Math.PI/2);const r=ge(n,me(t.color,{flatShading:!1}),{shadow:!1});return r.position.set(e.x,.012,e.z),{obj:r}},rubble(i){const t=new Ot;return t.position.set(i.shape.x,0,i.shape.z),{obj:t,pieces:0}}};function yu(i,t){const{look:e,shape:n}=i,s=ge(t,me(e.color));return s.scale.set(...e.scale),s.position.set(n.x,n.y,n.z),s.rotation.y=e.yaw,{obj:s}}function ja(i,t){return t.position.set(i.shape.x,0,i.shape.z),t.rotation.y=i.look.yaw,{obj:t}}class _d{constructor(t,e){this.scene=t,this.effects=e,this.group=new Ot,t.add(this.group),this.items=new Map,this.spares=new Map}object(t){var e;return(e=this.items.get(t))==null?void 0:e.obj}apply(t,e){switch(t.t){case"terrain.clear":return this.clear();case"terrain.add":return this.add(t.def);case"terrain.hurt":return this.hurt(this.items.get(t.id).c,t.from,t.at);case"terrain.destroy":return this.destroy(this.items.get(t.id).c,t.from,t.at);case"terrain.collapse":return this.collapse(t.drops,t.by,e);case"terrain.rubble":return this.rubble(this.items.get(t.id).c,t.from)}throw new Error(`TerrainView: no handler for ${t.t}`)}clear(){this.freeSpares(),this.scene.remove(this.group),this.group=new Ot,this.scene.add(this.group),this.spares=this.items,this.items=new Map}add(t){const e=this.spares.get(t.id);if(e!=null&&e.obj&&!e.touched&&!e.shared&&bu(e.c,t,!0)){this.spares.delete(t.id),this.items.set(t.id,{...e,c:t}),this.group.add(e.obj);return}if(t.look.piece==="fallen")return this.fell(t);const n={c:t,...Xa[t.look.piece](t)};this.items.set(t.id,n),this.group.add(n.obj)}dispose(){this.freeSpares();for(const t of this.items.values())this.free(t);this.items.clear(),this.scene.remove(this.group),this.group=new Ot,this.scene.add(this.group)}sync(t){var n;this.freeSpares();const e=new Map(t.map(s=>[s.id,s]));for(const[s,r]of[...this.items]){const o=e.get(s);o&&bu(r.c,o,!1)&&(o.alive?this.shows(r):!this.shows(r))||(this.free(r),this.items.delete(s))}for(const s of t){const r=this.items.get(s.id);if(r){s.alive&&IM.has(s.look.piece)&&(r.fall=null,r.obj.position.y=s.shape.y,r.c=cr(s));continue}if(!s.alive){this.items.has(s.id)||this.items.set(s.id,{c:cr(s),obj:null});continue}if(s.look.piece==="fallen"){this.fallen(cr(s),e.get(s.look.tree));continue}const o=cr(s),a={c:o,...Xa[s.look.piece](o)};if(this.items.set(s.id,a),this.group.add(a.obj),s.kind==="rubble")for(const c of t)c.kind==="block"&&!c.alive&&((n=c.col)==null?void 0:n.rubble)===s&&this.rubble(o,null)}}shows(t){var e;return!t.obj||t.obj.parent!==this.group?!1:t.c.kind==="tree"?((e=t.canopy)==null?void 0:e.parent)===t.obj:!0}state(t){const e=this.items.get(t),n=!!e&&this.shows(e);if(!n)return{shown:n};const s=e.obj;return{shown:n,x:s.position.x,y:s.position.y,z:s.position.z,q:s.quaternion.toArray()}}free(t){t.canopy&&t.canopy.parent!==t.obj&&Mu(t.canopy),t.canopy=null,!(!t.obj||t.shared)&&(t.obj.parent&&t.obj.parent.remove(t.obj),Mu(t.obj),t.ownMat&&t.obj.material.dispose(),t.obj=null)}freeSpares(){for(const t of this.spares.values())this.free(t);this.spares.clear()}hurt(t,e,n){const s=this.items.get(t.id),r=s.obj;s.touched=!0,r.isMesh&&(s.ownMat||(r.material=r.material.clone(),s.ownMat=!0),r.material.color.multiplyScalar(.8));const o=r.position.clone();Ce(.25,a=>{const c=(1-a)*.06;r.position.x=o.x+(Math.random()-.5)*c,r.position.z=o.z+(Math.random()-.5)*c}).then(()=>{r.position.x=o.x,r.position.z=o.z}),this.effects.debris(n.x,n.y,n.z,[t.look.chip||"#888","#666"],3,{from:e,power:3,size:.08})}destroy(t,e,n){const s=this.items.get(t.id);s.touched=!0;const r=n,o=this.effects;switch(t.kind){case"block":{this.group.remove(s.obj),o.debris(r.x,r.y,r.z,[t.look.chip,t.look.chip,"#5a5650"],12,{from:e,power:6}),o.smoke({x:r.x,y:r.y,z:r.z,size:.4,color:"#a09a8a",life:1.5});break}case"tree":{for(const a of s.canopy.children){const c=new P;a.getWorldPosition(c),o.leaves(c.x,c.y,c.z,t.look.leaves,14,1)}s.obj.remove(s.canopy);break}case"hedge":case"mushroom":if(this.group.remove(s.obj),o.leaves(r.x,r.y,r.z,t.look.leaves,t.kind==="hedge"?22:28,t.kind==="hedge"?.8:1.4),t.kind==="mushroom")for(let a=0;a<16;a++)o.mote({x:r.x,y:r.y*1.5,z:r.z,vx:(Math.random()-.5)*3,vy:Math.random()*2,vz:(Math.random()-.5)*3,size:.05,color:"#f0e0ff",life:2.5,drag:1});break;case"crate":case"log":this.group.remove(s.obj),o.debris(r.x,r.y,r.z,Wx,14,{from:e,power:6,size:.12});break}t.kind==="block"?Re.crumble():Re.thwack()}collapse(t,e,n){for(const{id:s,dy:r}of t){const o=this.items.get(s),{c:a,obj:c}=o;o.touched=!0;const h=n.chunks[s].y,l=c.position.y,u=h,f=o.fall={};Ce(.18+r*.15,d=>o.fall===f&&(c.position.y=l+(u-l)*d),gM).then(()=>{this.effects.debris(a.shape.x,h-e/2,a.shape.z,["#8a8478"],3,{power:2,size:.07})})}}rubble(t,e){const n=this.items.get(t.id),s=n.obj;n.touched=!0;const r=Ff[t.look.style],o=4+Math.floor(Math.random()*3);for(let a=0;a<o;a++){const c=ge(Hi,me(dM(r.colors))),h=.18+Math.random()*.22;c.scale.set(h*(r.look==="log"?2.4:1.2),h*.7,h);const l=Math.random()*6,u=Math.random()*.6,f=e?t.shape.x-e.x:0,d=e?t.shape.z-e.z:0,g=Math.hypot(f,d)||1;c.position.set(Math.cos(l)*u+f/g*.25,h*.3+Math.min(.2,n.pieces*.012),Math.sin(l)*u+d/g*.25),c.rotation.set(Math.random(),Math.random()*6,Math.random()),s.add(c)}n.pieces+=o}fell(t){const e=this.items.get(t.look.tree),n=e.c,s=n.shape,r=n.look.trunk,{dx:o,dz:a}=t.look,c=e.obj,h=c.quaternion.clone(),l=Su(c,h,t.look,r);Ce(.9,l,pM).then(()=>{this.effects.debris(s.x+o*r.h,.2,s.z+a*r.h,["#6b4a2e","#4f8a34"],8,{power:3,size:.1}),this.effects.shake=Math.max(this.effects.shake,.05)}),e.shared=!0,this.items.set(t.id,{c:t,obj:c,touched:!0}),this.group.add(c)}fallen(t,e){const n=cr(e),{obj:s,canopy:r}=Xa.tree(n);s.remove(r),Su(s,s.quaternion.clone(),t.look,n.look.trunk)(1),this.items.set(n.id,{c:n,obj:s,canopy:r,shared:!0}),this.items.set(t.id,{c:t,obj:s,touched:!0}),this.group.add(s)}}function Mu(i){i.traverse(t=>{t.geometry&&t.geometry!==Hi&&t.geometry!==vd&&t.geometry.dispose()})}const IM=new Set(["box","log","cap"]),cr=i=>({id:i.id,kind:i.kind,shape:{...i.shape},look:i.look});function bu(i,t,e){const n=s=>JSON.stringify({id:s.id,kind:s.kind,look:s.look,shape:e?s.shape:{...s.shape,y:0}});return n(i)===n(t)}function Su(i,t,{dx:e,dz:n},s){const r=new P(n,0,-e).normalize(),o=new Un;return a=>{o.setFromAxisAngle(r,(Math.PI/2-.12)*a),i.quaternion.copy(t).premultiply(o),i.position.y=Math.sin(a*Math.PI)*.05+s.r*a}}function UM(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new Se;let h=0;for(let l=0;l<i.length;++l){const u=i[l];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,d,l),h+=d}}if(e){let l=0;const u=[];for(let f=0;f<i.length;++f){const d=i[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+l);l+=i[f].attributes.position.count}c.setIndex(u)}for(const l in r){const u=wu(r[l]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" attribute."),null;c.setAttribute(l,u)}for(const l in o){const u=o[l][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[l]=[];for(let f=0;f<u;++f){const d=[];for(let v=0;v<o[l].length;++v)d.push(o[l][v][f]);const g=wu(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" morphAttribute."),null;c.morphAttributes[l].push(g)}}return c}function wu(i){let t,e,n,s=-1,r=0;for(let h=0;h<i.length;++h){const l=i[h];if(l.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=l.array.constructor),t!==l.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=l.itemSize),e!==l.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=l.normalized),n!==l.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=l.gpuType),s!==l.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=l.array.length}const o=new t(r);let a=0;for(let h=0;h<i.length;++h)o.set(i[h].array,a),a+=i[h].array.length;const c=new hn(o,e,n);return s!==void 0&&(c.gpuType=s),c}function NM(i){for(const t of["position","normal"]){const e=i.getAttribute(t);for(let n=0;n<e.count;n+=3){const s=e.getX(n+1),r=e.getY(n+1),o=e.getZ(n+1);e.setXYZ(n+1,e.getX(n+2),e.getY(n+2),e.getZ(n+2)),e.setXYZ(n+2,s,r,o)}}}const qa=new Map;function zM(i){return[i.metalness,i.roughness,i.emissiveIntensity>0?i.emissive.getHex():0,i.emissiveIntensity,i.transparent,i.opacity,i.side,i.flatShading].join("|")}function yc(i){i.updateMatrixWorld(!0);const t=new re().copy(i.matrixWorld).invert(),e=new re,n=new Map,s=[],r=o=>{for(const a of o.children){if(a.userData.keep){yc(a);continue}if(a.isMesh){const c=a.material,h=zM(c);n.has(h)||n.set(h,{m:c,geos:[]});const l=a.geometry.index?a.geometry.toNonIndexed():a.geometry,u=new Se;u.setAttribute("position",l.getAttribute("position").clone()),u.setAttribute("normal",l.getAttribute("normal").clone()),u.applyMatrix4(e.multiplyMatrices(t,a.matrixWorld)),e.determinant()<0&&NM(u);const f=u.getAttribute("position").count,d=new Float32Array(f*3);for(let g=0;g<f;g++)d.set([c.color.r,c.color.g,c.color.b],g*3);u.setAttribute("color",new hn(d,3)),n.get(h).geos.push(u),s.push(a)}r(a)}};r(i);for(const o of s)o.parent.remove(o);for(const[o,{m:a,geos:c}]of n)qa.has(o)||qa.set(o,new wn({vertexColors:!0,metalness:a.metalness,roughness:a.roughness,flatShading:a.flatShading,emissive:a.emissive,emissiveIntensity:a.emissiveIntensity,transparent:a.transparent,opacity:a.opacity,side:a.side})),i.add(new Ht(UM(c),qa.get(o)))}function Ss({fur:i="#c96a2d",belly:t="#f1dcb5",hat:e="acorn",hatColor:n="#6e4a2a",tailUp:s=1}={}){const r=new Ot,o=new Ot;r.add(o);const a=dt(i),c=dt(t),h=dt("#1b1410");for(const p of[-1,1])o.add(tt(at.ico,a,p*.1,.05,.07,.08,.045,.13)),o.add(tt(at.ico,a,p*.12,.17,-.02,.14));o.add(tt(at.ico,a,0,.38,0,.21,.28,.19)),o.add(tt(at.ico,c,0,.36,.1,.14,.2,.09));const l=new Ot;l.position.set(0,.72,.05),o.add(l),l.add(tt(at.ico,a,0,0,0,.17)),l.add(tt(at.ico,c,0,-.05,.12,.09,.075,.08)),l.add(tt(at.sph,h,0,-.02,.2,.028));for(const p of[-1,1]){l.add(tt(at.sph,h,p*.075,.04,.13,.034)),l.add(tt(at.sph,dt("#ffffff"),p*.068,.055,.155,.01));const _=tt(at.cone,a,p*.09,.16,-.02,.05,.13,.04);_.rotation.z=-p*.25,l.add(_);const M=tt(at.cone,dt(hr(i,-.25)),p*.1,.25,-.02,.025,.07,.02);M.rotation.z=-p*.3,l.add(M)}e==="acorn"&&(l.add(tt(at.cap,dt(n),0,.07,0,.19,.13,.19)),l.add(tt(at.brim,dt(n),0,.07,0,.19,1,.19)),l.add(tt(at.cyl,dt(hr(n,-.2)),0,.22,0,.02,.06,.02)));const u=new Ot;u.position.set(0,.22,-.18),o.add(u);const f=new zc([[0,0,0],[0,.2,-.26],[0,.55*s,-.32],[0,.82*s,-.22],[0,.93*s,-.02]].map(p=>new P(...p))),d=dt(hr(i,.08)),g=dt(hr(i,.2)),v=12;for(let p=0;p<v;p++){const _=p/(v-1),M=.085+Math.sin(Math.min(1,_*1.15)*Math.PI)*.11,b=f.getPointAt(_);u.add(tt(at.ico,_>.75?g:d,b.x,b.y,b.z,M,M*1.1,M))}const m=[];for(const p of[-1,1]){const _=new Ot;_.position.set(p*.17,.52,.04),_.add(tt(at.ico,a,0,-.1,0,.05,.12,.05));const M=new Ot;M.position.set(0,-.21,0),M.add(tt(at.ico,a,0,0,0,.045)),_.add(M),_.userData.hand=M,_.rotation.x=-.9,o.add(_),m.push(_)}return r.userData.anim={kind:"squirrel",body:o,tail:u,head:l,armL:m[0],armR:m[1]},r}const xd={nutkin(){const i=Ss({fur:"#cf6d2a",hatColor:"#6a4a26"}),t=i.userData.anim,e=tt(at.cone,dt("#5f8f2e"),0,.45,-.06,.25,.42,.2);e.rotation.x=.15,t.body.add(e);const n=new Ot;return n.add(Oi([0,-.08,0],[0,.04,0],.018,lr())),n.add(Oi([0,.04,0],[-.05,.13,0],.014,lr())),n.add(Oi([0,.04,0],[.05,.13,0],.014,lr())),Jn(t.armR,n,1.4),t.armR.rotation.x=-1.3,i},grenadier(){const i=Ss({fur:"#a9552a",hatColor:"#4f3a22"}),t=i.userData.anim,e=tt(new En(.21,.025,4,16),dt("#4a3020"),0,.4,.02);e.rotation.set(.1,0,.75),e.scale.z=.8,t.body.add(e);for(let s=0;s<4;s++){const r=-.7+s*.45;t.body.add(tt(at.sph,dt("#8a5a2a"),Math.sin(r)*.21*.7,.4+Math.cos(r)*.21*.7,.17,.045,.055,.045))}for(const s of[-1,1])t.head.add(tt(new En(.04,.012,4,10),We("#c9a24a"),s*.07,.07,.14));const n=new Ot;return n.add(tt(at.sph,dt("#8a5a2a"),0,0,0,.06,.07,.06)),n.add(tt(at.cap,dt("#4f3a22"),0,.03,0,.065,.04,.065)),n.add(tt(at.brim,dt("#4f3a22"),0,.03,0,.065,1,.065)),n.add(tt(at.sph,Vi("#ffb030"),0,.1,0,.022)),Jn(t.armR,n,0),t.armR.rotation.x=2.3,i},oakguard(){const i=Ss({fur:"#8a5a35",hatColor:"#5a3c22"}),t=i.userData.anim;t.body.add(tt(at.ico,dt("#5b4330"),0,.42,.05,.2,.22,.16));const e=tt(at.cone,dt("#c0302a"),0,.3,-.05,.03,.18,.08);e.rotation.x=-.5,t.head.add(e);const n=pd(.22,dt("#6b4a2e"),dt("#3e7a2a"));Jn(t.armL,n,.9),n.position.set(-.02,0,.08),t.armL.rotation.set(-.6,0,.3);const s=new Ot;return s.add(tt(at.cyl,lr(),0,.2,0,.022,1.15,.022)),s.add(tt(at.box,We("#a8b0b8"),.07,.62,0,.12,.16,.02)),s.add(tt(at.cone,dt("#6b4a26"),0,.85,0,.06,.18,.06)),Jn(t.armR,s,.9),i},glider(){const i=Ss({fur:"#9a8a78",belly:"#efe5d5",hat:"none",tailUp:.25}),t=i.userData.anim;for(const n of[-1,1])t.head.add(tt(new En(.045,.015,4,10),We("#c9a24a"),n*.07,.07,.14));t.head.add(tt(at.cap,dt("#6b4a2e"),0,.06,-.01,.18,.11,.18)),t.head.add(tt(at.brim,dt("#6b4a2e"),0,.06,-.01,.18,1,.18)),t.armL.rotation.set(-.2,0,-1.25),t.armR.rotation.set(-.2,0,1.25);const e=dt(hr("#9a8a78",-.12),{side:cn});for(const n of[-1,1]){const s=new Se;s.setAttribute("position",new ie([n*.15,.52,.02,n*.42,.45,.02,n*.2,.1,0,n*.15,.52,.02,n*.2,.1,0,n*.12,.25,0],3)),s.computeVertexNormals();const r=new Ht(s,e);r.castShadow=!0,t.body.add(r)}return t.body.position.y=.7,t.body.rotation.x=.55,t.lift=.7,i.add(tt(at.cyl,dt("#cfe8ff",{transparent:!0,opacity:.35}),0,.42,0,.025,.66,.025)),t.tail.rotation.x=-.6,i},trebuchet(){const i=new Ot,t=new Ot;i.add(t);const e=dt("#7a5232"),n=dt("#5f3e24");for(const h of[-1,1])t.add(tt(at.box,n,h*.38,.2,0,.1,.1,1.6)),t.add(Oi([h*.38,.2,-.55],[h*.38,1.25,0],.045,e)),t.add(Oi([h*.38,.2,.55],[h*.38,1.25,0],.045,e));t.add(tt(at.box,n,0,.2,.6,.86,.08,.1)),t.add(tt(at.box,n,0,.2,-.6,.86,.08,.1));const s=tt(at.cyl,We("#555"),0,1.25,0,.04,.9,.04);s.rotation.z=Math.PI/2,t.add(s);const r=[];for(const h of[-1,1])for(const l of[-.6,.6]){const u=md(.17,h*.5,.17,l);t.add(u),r.push(u)}const o=new Ot;o.position.set(0,1.25,0),o.add(tt(at.box,e,0,0,.35,.08,.08,1.7));const a=tt(at.box,n,0,-.18,-.45,.32,.3,.3);o.add(a);for(let h=0;h<5;h++)o.add(tt(at.sph,dt("#8a5a2a"),(Math.random()-.5)*.2,-.02,-.45+(Math.random()-.5)*.2,.06));const c=tt(at.cone,dt("#6b4a26"),0,0,1.25,.11,.24,.11);c.rotation.x=Math.PI/2,o.add(c),o.add(tt(at.sph,Vi("#ff8a2a"),0,.06,1.25,.05)),o.rotation.x=.75,o.rotation.y=Math.PI,t.add(o);for(const h of[-1,1]){const l=Ss({fur:"#c96a2d"});l.scale.setScalar(.72),l.position.set(h*.72,.05,-.25),l.rotation.y=-h*.5,l.userData.anim.armR.rotation.x=-2.2,t.add(l)}o.userData.keep=!0;for(const h of r)h.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:r,throwArm:o,rest:.75},i},elder(){const i=Ss({fur:"#a9a197",belly:"#f4efe6",hat:"none"}),t=i.userData.anim;i.scale.setScalar(1.28);const e=tt(new zn(.3,.55,10,1,!0),dt("#5a6b34",{side:cn}),0,.3,0);t.body.add(e),t.head.add(tt(at.cone,dt("#f4efe6"),0,-.14,.15,.06,.16,.04).rotateX(Math.PI));for(let s=0;s<7;s++){const r=s/7*Math.PI*2,o=tt(at.cone,dt(s%2?"#d08a2c":"#6aa646"),Math.cos(r)*.15,.12,Math.sin(r)*.15,.035,.12,.02);o.rotation.set(Math.sin(r)*.4,0,-Math.cos(r)*.4),t.head.add(o)}const n=new Ot;n.add(tt(at.cyl,dt("#5a3d24"),0,.25,0,.025,1,.025)),n.add(tt(at.oct,Vi("#7dff8a"),0,.82,0,.07,.11,.07));for(let s=0;s<3;s++){const r=s/3*Math.PI*2;n.add(Oi([0,.7,0],[Math.cos(r)*.07,.86,Math.sin(r)*.07],.012,dt("#5a3d24")))}return Jn(t.armL,n,.9),t.armL.rotation.x=-.6,t.gem=n.children[1],t.gem.userData.keep=!0,i}},OM=new Set([xd.trebuchet]);function ws({scale:i="#3f8f4a",belly:t="#d9cf86",hood:e=null,hoodSize:n=1,long:s=!1,thick:r=1}={}){const o=new Ot,a=new Ot;o.add(a);const c=dt(i),h=dt(t);let l;if(s)l=[[.05,.05,-.9],[-.18,.06,-.62],[.16,.07,-.34],[-.06,.1,-.08],[0,.26,.02],[0,.4,.03]];else{l=[];for(let v=0;v<=10;v++){const m=v/10,p=-.6+m*Math.PI*2.3,_=.3-m*.17;l.push([Math.cos(p)*_,.06+m*.1,Math.sin(p)*_-.04])}l.push([0,.3,.02],[0,.42,.03])}a.add(TM(l,.025,.115*r,c));const u=tt(new Fc(.12*r,.2,3,8),c,0,.53,.04);u.rotation.x=.12,a.add(u),a.add(tt(at.ico,h,0,.5,.12*r,.085*r,.17,.05));const f=new Ot;if(f.position.set(0,.79,.08),a.add(f),e){const v=tt(at.ico,dt(e),0,-.02,-.07,.21*n,.24*n,.05);f.add(v);for(const m of[-1,1])f.add(tt(at.sph,dt(t),m*.08*n,.02,-.12,.035*n,.035*n,.01))}f.add(tt(at.ico,c,0,0,.02,.11,.09,.15)),f.add(tt(at.ico,h,0,-.04,.06,.08,.04,.11));for(const v of[-1,1])f.add(tt(at.sph,dt("#ffd23a",{emissive:"#b08000",emissiveIntensity:.4}),v*.065,.035,.09,.03)),f.add(tt(at.sph,dt("#111111"),v*.079,.037,.1,.008,.024,.012));const d=new Ot;d.position.set(0,-.03,.16);for(const v of[-1,1]){const m=tt(at.cyl,dt("#d0304a"),v*.012,0,.05,.008,.1,.008);m.rotation.x=Math.PI/2,m.rotation.z=v*.3,d.add(m)}d.scale.setScalar(.001),f.add(d);const g=[];for(const v of[-1,1]){const m=new Ot;m.position.set(v*.15*r,.64,.05),m.add(tt(at.ico,c,0,-.1,0,.045*r,.12,.045*r));const p=new Ot;p.position.set(0,-.21,0),p.add(tt(at.ico,c,0,0,0,.042*r)),m.add(p),m.userData.hand=p,m.rotation.x=-.9,a.add(m),g.push(m)}return o.userData.anim={kind:"naga",body:a,head:f,tongue:d,armL:g[0],armR:g[1]},o}const FM={scaleguard(){const i=ws({scale:"#3f8f4a",belly:"#d9cf86"}),t=i.userData.anim;t.head.add(tt(at.cap,We("#b8862e"),0,.04,.01,.12,.09,.15)),t.head.add(tt(at.brim,We("#b8862e"),0,.04,.01,.12,1,.15)),t.head.add(tt(at.box,We("#b8862e"),0,.12,-.02,.015,.06,.18)),Jn(t.armR,AM(1.15),.9);const e=pd(.2,We("#a8762a"),We("#e0b050"));return Jn(t.armL,e,.9),e.position.z=.06,t.armL.rotation.set(-.7,0,.35),i},spitter(){const i=ws({scale:"#2f8f86",belly:"#e0d890",hood:"#5a2f7a",hoodSize:1.45}),t=i.userData.anim;return t.head.add(tt(at.sph,Vi("#8aff5a"),0,-.04,.16,.035)),t.body.add(tt(at.ico,dt("#7a8a3a"),.17,.38,.05,.08,.1,.08)),t.body.add(tt(at.sph,Vi("#8aff5a"),.17,.48,.05,.03)),t.armL.rotation.x=-.5,t.armR.rotation.x=-.5,i},sidewinder(){const i=ws({scale:"#c2a061",belly:"#efe0b0",long:!0}),t=i.userData.anim;for(let e=0;e<6;e++)t.body.add(tt(at.oct,dt("#6b4a2a"),0,.12+e*.07,-.05-e*.02,.04,.03,.04));for(const e of[-1,1]){const n=tt(at.cone,dt("#8a6a3a"),e*.06,.08,.05,.02,.07,.02);n.rotation.z=-e*.4,t.head.add(n);const s=tt(new En(.13,.014,4,12,Math.PI*.9),We("#c8ccd0"),0,.08,.08);s.rotation.y=Math.PI/2,Jn(e<0?t.armL:t.armR,s,.4)}return t.armL.rotation.set(-1.3,0,.3),t.armR.rotation.set(-1.3,0,-.3),t.body.rotation.x=.12,i},brute(){const i=ws({scale:"#4f6e2a",belly:"#c8b870",thick:1.35}),t=i.userData.anim;i.scale.setScalar(2.15);for(let e=0;e<7;e++){const n=tt(at.cone,dt("#e8dcc0"),0,.45+e*.06,-.12-(e<3?0:(e-3)*.01),.02,.07,.02);n.rotation.x=-1.1,t.body.add(n)}for(const e of[-1,1]){const n=tt(at.cone,dt("#e8dcc0"),e*.07,.08,-.03,.025,.12,.025);n.rotation.set(-.6,0,-e*.6),t.head.add(n),t.body.add(tt(new En(.06,.015,4,10).rotateX(Math.PI/2),We("#b8862e"),e*.2,.5,.05))}return t.armL.rotation.set(-1.2,0,.5),t.armR.rotation.set(-1.2,0,-.5),i},engine(){const i=new Ot,t=new Ot;i.add(t);const e=dt("#4a3a2a"),n=dt("#3a2c20");t.add(tt(at.box,e,0,.36,0,.8,.22,1.35));const s=[];for(const c of[-1,1])for(const h of[-.45,.45]){const l=md(.21,c*.47,.21,h);t.add(l),s.push(l)}const r=tt(at.ico,dt("#d8cfb0"),0,.55,.78,.2,.16,.28);t.add(r);for(const c of[-1,1])t.add(tt(at.cone,dt("#f4ecd8"),c*.09,.43,.92,.025,.12,.025).rotateX(Math.PI)),t.add(tt(at.sph,Vi("#8aff5a"),c*.1,.62,.88,.035));for(const c of[-1,1])t.add(Oi([c*.3,.45,-.3],[c*.2,1.05,-.1],.04,n));const o=new Ot;o.position.set(0,1.05,-.1),o.add(tt(at.box,e,0,0,.35,.08,.08,.9)),o.add(tt(at.cap,dt("#3a2c20",{side:cn}),0,.02,.8,.14,.08,.14).rotateX(Math.PI));const a=tt(at.sph,dt("#7dff5a",{emissive:"#4ad02a",emissiveIntensity:1.1,transparent:!0,opacity:.85,roughness:.15}),0,.12,.8,.14);a.userData.keep=!0,o.add(a),o.rotation.x=-.55,t.add(o);for(let c=0;c<3;c++)t.add(tt(at.sph,dt("#7dff5a",{emissive:"#3ab02a",emissiveIntensity:.9}),-.2+c*.2,.55,-.55,.08));for(const c of[-1,1]){const h=ws({scale:"#3f8f4a",belly:"#d9cf86"});h.scale.setScalar(.72),h.position.set(c*.72,.05,-.35),h.rotation.y=-c*.5,t.add(h)}o.userData.keep=!0;for(const c of s)c.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:s,throwArm:o,rest:-.55,globe:a},i},hierophant(){const i=ws({scale:"#5e3a8c",belly:"#e6c870",hood:"#3a2060",hoodSize:1.7}),t=i.userData.anim;i.scale.setScalar(1.32);for(let n=0;n<5;n++){const s=(n/4-.5)*1.6,r=tt(at.cone,We("#e0b040"),Math.sin(s)*.1,.12+Math.cos(s)*.04,-.02,.02,.12,.02);r.rotation.z=-s*.5,t.head.add(r)}for(const n of[-1,1])t.body.add(tt(new En(.05,.014,4,10).rotateX(Math.PI/2),We("#e0b040"),n*.15,.45,.05));const e=new Ot;return e.add(tt(at.cyl,dt("#2a1a40"),0,.25,0,.022,1,.022)),e.add(tt(at.sph,Vi("#c070ff"),0,.82,0,.08)),e.add(tt(new En(.1,.012,4,14),We("#e0b040"),0,.82,0)),Jn(t.armL,e,.9),t.armL.rotation.x=-.6,t.gem=e.children[1],t.gem.userData.keep=!0,i}},kM=new Set,Ya=Object.freeze({squirrel:xd,serpent:FM}),BM=new Set([...OM,...kM]),Ka=new Map;function Eu(i,t,e,n){if(!Object.hasOwn(Ya,i)||!Object.hasOwn(Ya[i],t))throw new Error(`no figure for unit "${t}" in the "${i}" kit`);const s=`${i}/${t}`,r=Ya[i][t],o=BM.has(r),a=new Ot,c=EM(e.base,n);a.add(c);const h=o||!Ka.has(s),l=h?r():Tu(Ka.get(s));l.position.y=e.big?.09:.06,l.userData.y0=l.position.y,a.add(l),a.userData.fig=l,a.userData.anim=l.userData.anim,a.userData.phase=Math.random()*10,a.userData.drawn=o,yc(c),h&&yc(l),a.traverse(d=>{d.isMesh&&(d.castShadow=!0)}),c.traverse(d=>{d.isMesh&&(d.receiveShadow=!0)});const u=new Set,f=d=>d.traverse(g=>g.isMesh&&u.add(g.geometry));return f(c),o&&f(l),a.userData.own=[...u],h&&!o&&Ka.set(s,Tu(l)),a}function HM(i){for(const t of i.userData.own??[])t.dispose();i.userData.own=[]}function Tu(i){const t=new Map;i.traverse(o=>{t.set(o,o.userData),o.userData={}});let e;try{e=i.clone(!0)}finally{for(const[o,a]of t)o.userData=a}const n=new Map,s=(o,a)=>{n.set(o,a),o.children.forEach((c,h)=>s(c,a.children[h]))};s(i,e);const r=o=>o!=null&&o.isObject3D?n.get(o)??o:Array.isArray(o)?o.map(r):o&&typeof o=="object"?Object.fromEntries(Object.entries(o).map(([a,c])=>[a,r(c)])):o;for(const[o,a]of t)n.get(o).userData=r(a);return e}let VM=null;const WM=()=>VM??(VM={ring:new Ji(.88,1,48).rotateX(-Math.PI/2),hit:new tn(1,1,1,12)}),_o=new P;class yd{constructor({scene:t,labels:e,fx:n,mirror:s,colorOf:r,W:o}){this.scene=t,this.W=o,this.labels=e,this.effects=n,this.mirror=s,this.colorOf=r,this.views=new Map,this.gen=0}get(t){return this.views.get(t)}unit(t){return this.views.get(t).u}shown(t){return this.mirror().units[t]}standing(t){const e=this.shown(t);return this.views.get(t).models.filter((n,s)=>e.models[s].alive)}top(t){const e=this.shown(t).pos;return{x:e.x,y:this.unit(t).t.big?2.6:1.6,z:e.z}}gone(t,e,n){return this.views.get(t)!==e||this.gen!==n}make(t,e,n){const s=-e*Math.PI/2,r=this.shown(t.id),o={id:t.id,u:t,edge:e,color:n,facing:s,moving:!1,at:null,models:[]},a=Pn[t.race].look.models;for(let l=0;l<t.t.models;l++){if(!r.models[l].alive){o.models.push({mesh:null,x:0,z:0,yaw:s,lunge:0,lungeDir:0,lift:0});continue}const u=Eu(a,t.key,t.t,n);this.scene.add(u),o.models.push({mesh:u,x:0,z:0,yaw:s,lunge:0,lungeDir:0,lift:0})}const{ring:c,hit:h}=WM();return o.ring=new Ht(c,new Xe({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})),o.ring.position.y=.04,o.ring.renderOrder=2,this.scene.add(o.ring),o.hit=new Ht(h,new Xe({visible:!1})),o.hit.userData.id=t.id,this.scene.add(o.hit),o.label=document.createElement("div"),o.label.className=`ulabel s${t.side}`,this.labels.appendChild(o.label),this.views.set(t.id,o),this.disc(t.id),this.stands(o,r.alive>0),this.place(o),o}stands(t,e){t.ring.visible=e,t.hit.visible=e,e&&!t.hit.parent&&this.scene.add(t.hit),e||this.scene.remove(t.hit)}place(t){const e=this.shown(t.id);e.models.forEach((n,s)=>{const r=t.models[s];r.mesh&&(r.x=e.pos.x+n.ox,r.z=e.pos.z+n.oz,r.mesh.position.set(r.x,0,r.z),r.mesh.rotation.y=r.yaw)})}unfigure(t){t.mesh&&(this.scene.remove(t.mesh),HM(t.mesh))}drop(t){for(const e of t.models)this.unfigure(e);this.scene.remove(t.ring,t.hit),t.ring.material.dispose(),t.hit.material.dispose(),t.label.remove(),this.views.delete(t.id)}dispose(){for(const t of[...this.views.values()])this.drop(t);this.gen++}sync(t,e){this.gen++;const n=this.mirror(),s=new Set(t.map(r=>r.id));for(const r of[...this.views.values()])s.has(r.id)||this.drop(r);for(const r of t){const o=e(r.side),a=this.colorOf(r.side);let c=this.views.get(r.id);if(c&&(c.u.t!==r.t||c.u.side!==r.side||c.edge!==o||c.color!==a)&&(this.drop(c),c=null),!c){this.make(r,o,a);continue}const h=n.units[r.id],l=Pn[r.race].look.models;c.at=null,c.moving=!1,c.facing=-o*Math.PI/2,c.models.forEach((u,f)=>{if(!h.models[f].alive){this.unfigure(u),c.models[f]={mesh:null,x:u.x,z:u.z,yaw:c.facing,lunge:0,lungeDir:0,lift:0};return}if(!u.mesh||u.dying||u.fleeing||!u.mesh.parent){this.unfigure(u);const g=Eu(l,r.key,r.t,a);this.scene.add(g),u=c.models[f]={mesh:g,x:0,z:0,yaw:c.facing,lunge:0,lungeDir:0,lift:0}}Object.assign(u,{yaw:c.facing,look:void 0,lunge:0,lift:0,flash:0,flying:!1,moving:!1}),u.mesh.position.y=0,u.mesh.userData.fig.position.x=0;const d=u.mesh.userData.anim;d!=null&&d.throwArm&&(d.throwArm.rotation.x=d.rest),d!=null&&d.globe&&(d.globe.visible=!0)}),this.disc(r.id),this.stands(c,h.alive>0),this.place(c)}this.labelAll()}disc(t){const e=this.views.get(t),n=e.u,s=this.shown(t),r=e.at??s.pos;e.ring.scale.setScalar(s.r+.18);const o=n.t.big?2.4:n.t.fly?1.8:1.3;e.hit.scale.set(s.r,o,s.r),e.ring.position.x=e.hit.position.x=r.x,e.ring.position.z=e.hit.position.z=r.z,e.hit.position.y=e.hit.scale.y/2}label(t){const e=this.views.get(t),n=e.u,s=this.shown(t),r=s.models.filter(a=>a.alive);let o=`<span class="nm">${n.t.short}</span>`;n.t.models>1?o+=`<span class="ct">${s.alive}/${n.t.models}</span>`:o+=`<span class="ct">${r[0]?r[0].w:0}/${n.t.W}♥</span>`,s.mesmerized&&(o+='<span class="st" title="Mesmerized">🌀</span>'),s.alive>0&&s.engaged&&(o+='<span class="st" title="In combat">⚔</span>'),e.label.innerHTML=o,e.label.style.display=s.alive>0?"":"none"}labelAll(){for(const t of this.views.keys())this.label(t)}paintRings(t){for(const e of this.views.values()){if(!(this.shown(e.id).alive>0))continue;const[n,s]=t(e);e.ring.material.opacity=s,e.ring.material.color.set(n)}}pickables(){return[...this.views.values()].filter(t=>this.shown(t.id).alive>0).map(t=>t.hit)}animate(t,e,{fast:n,camera:s,sel:r}){const o=this.mirror();for(const a of this.views.values()){const c=a.u,h=o.units[c.id],l=a.at??h.pos;for(const[u,f]of h.models.entries()){const d=a.models[u];if(!f.alive&&!d.dying)continue;const g=d.mesh.userData.anim;if(f.alive){const p=l.x+f.ox,_=l.z+f.oz,M=1-Math.exp(-t*(a.moving?16:7)),b=d.x,C=d.z;d.x+=(p-d.x)*M,d.z+=(_-d.z)*M;const E=Math.hypot(d.x-b,d.z-C)/Math.max(t,1e-4),x=E>.6?Math.atan2(d.x-b,d.z-C):d.look??a.facing;d.yaw+=mM(x-d.yaw)*(1-Math.exp(-t*8)),d.moving=E>.6;let A=0,y=0;if(d.lunge>0){d.lunge=Math.max(0,d.lunge-t*2.5);const S=Math.sin((1-d.lunge)*Math.PI)*.35;A=Math.sin(d.lungeDir)*S,y=Math.cos(d.lungeDir)*S}d.mesh.position.set(d.x+A,d.lift||0,d.z+y),d.mesh.rotation.y=d.yaw}if(!g||!f.alive)continue;const v=e+d.mesh.userData.phase,m=d.mesh.userData.fig;if(g.kind==="squirrel"){const p=d.moving?Math.abs(Math.sin(v*13))*.16:0;m.position.y=m.userData.y0+p,m.scale.y=1+(d.moving?0:Math.sin(v*2.4)*.018),m.rotation.x=d.moving?.12:0}else if(g.kind==="naga")m.rotation.z=Math.sin(v*(d.moving?9:1.4))*(d.moving?.12:.035),m.scale.y=1+Math.sin(v*1.4)*.015;else if(g.kind==="machine"&&d.moving)for(const p of g.wheels)p.rotation.x+=t*6;g.gem&&(g.gem.rotation.y=v*2),d.flash>0&&(d.flash-=t,m.position.x=Math.sin(e*60)*.04*(d.flash>0?1:0))}if(h.alive>0&&!n){_o.set(l.x,c.t.big?2.7:c.t.fly?2.3:1.7,l.z).project(s);const u=_o.z<1;a.label.style.transform=`translate(${(_o.x*.5+.5)*innerWidth}px, ${(-_o.y*.5+.5)*innerHeight}px) translate(-50%, -100%)`,a.label.style.visibility=u&&o.stage!=="title"?"visible":"hidden",a.label.classList.toggle("sel",c.id===r)}}}wounded(t){const e=this.views.get(t.u),n=e.u,s=e.models[t.m];this.effects.text({x:s.x,y:n.t.big?2.3:1.3,z:s.z},`-${t.dmg}`,"#ff5a4a",{size:n.t.big?24:18}),s.flash=.4}slain(t,e){const n=this.views.get(t.u),s=n.u,r=n.models[t.m];this.effects.text({x:r.x,y:s.t.big?2.3:1.3,z:r.z},`-${t.dmg}`,"#ff5a4a",{size:s.t.big?24:18}),r.dying=!0;const o=Pn[s.race].look;Re.voice(o.voice);const a=r.mesh.userData.fig,c=t.by===null?null:e.units[t.by],h=c?Math.atan2(r.x-c.pos.x,r.z-c.pos.z)-r.yaw:0,l=Math.sin(h)>=0?1:-1;this.effects.debris(r.x,.5,r.z,o.gore,6,{power:2,size:.07}),Ce(.6,u=>{a.rotation.z=l*u*1.45,a.position.y=(s.t.big?.09:.06)+Math.sin(u*Math.PI)*.15},Is).then(()=>Ln(1.4)).then(()=>Ce(.8,u=>r.mesh.position.y=-u*1.4)).then(()=>{this.unfigure(r),r.dying=!1})}fled(t){const e=this.views.get(t.u),n=e.models[t.m];n.dying=!0;const s=e.edge,r=s*(this.W/2+3),o=n.x,a=n.z;n.fleeing=!0,this.effects.text({x:n.x,y:1.4,z:n.z},"flees!","#e0e0e0",{size:14}),n.yaw=s*Math.PI/2,Ce(2.2,c=>{n.x=gn(o,r,c),n.z=a,n.mesh.position.set(n.x,Math.abs(Math.sin(c*30))*.2,n.z),n.mesh.rotation.y=n.yaw}).then(()=>{this.unfigure(n),n.dying=!1})}destroyed(t,e){const n=this.views.get(t.u),s=n.u,r=e.units[t.u].pos;n.label.style.display="none",n.ring.visible=!1,n.hit.visible=!1,this.scene.remove(n.hit),this.effects.text({x:r.x,y:2.2,z:r.z},`${s.t.short} destroyed`,this.colorOf(t.by!==null?this.unit(t.by).side:1-s.side),{size:20,life:2})}face(t){const e=this.views.get(t.u),n=this.shown(t.tg).pos,s=this.shown(t.u).pos;e.facing=Math.atan2(n.x-s.x,n.z-s.z);for(const r of e.models)r.look=Math.atan2(n.x-r.x,n.z-r.z)}shout(t){const e=this.unit(t.u);t.ok?this.effects.text(this.top(t.u),"CHARGE!",this.colorOf(e.side),{size:22}):this.effects.text(this.top(t.u),"Charge failed","#d0d0d0")}lunge(t){const e=this.views.get(t.tg),n=this.gen,s=this.shown(t.tg).pos;for(const r of this.standing(t.u))r.lunge=1,r.lungeDir=Math.atan2(s.x-r.x,s.z-r.z);Re.thwack(),t.hits&&Ln(Ar.dice(t.n)).then(()=>{if(!this.gone(t.tg,e,n))for(let r=0;r<Math.min(t.hits,8);r++){const o=this.standing(t.tg)[r%Math.max(1,this.shown(t.tg).alive)];if(o)for(let a=0;a<4;a++)this.effects.mote({x:o.x,y:.6,z:o.z,vx:(Math.random()-.5)*5,vy:Math.random()*4,vz:(Math.random()-.5)*5,size:.05,color:"#fff2b0",life:.3,g:12})}})}async walk(t,e,n){const s=this.views.get(t.u),r=this.gen,{path:o,L:a,speed:c,fly:h,smashes:l}=t;if(t.stomp&&Re.boom(.4),s.moving=!0,h)for(const m of s.models)m.flying=!0;const u=[];let f=0;for(let m=1;m<o.length;m++){const p=Ft(o[m].x-o[m-1].x,o[m].z-o[m-1].z);u.push({a:o[m-1],b:o[m],s:f,l:p}),f+=p}let d=0;const g=({ev:m})=>{n(m),this.effects.shake=Math.max(this.effects.shake,.08)},v=()=>this.gone(t.u,s,r);if(await Ce(a/c+.15,m=>{if(v())return;const p=Math.min(a,m*(a+c*.15)),_=u.find(b=>p<=b.s+b.l)||u[u.length-1],M=_.l>0?(p-_.s)/_.l:1;if(s.facing=Math.atan2(_.b.x-_.a.x,_.b.z-_.a.z),s.at={x:gn(_.a.x,_.b.x,M),z:gn(_.a.z,_.b.z,M)},this.disc(t.u),h)for(const b of s.models)b.lift=Math.sin(Math.min(1,p/a)*Math.PI)*Math.min(3,a*.3);for(;d<l.length&&l[d].s<=p;)g(l[d++])},_c),!v()){for(;d<l.length;)g(l[d++]);if(s.at=null,this.disc(t.u),s.moving=!1,h)for(const m of s.models)m.flying=!1,m.lift=0;await Ln(.15)}}}class GM{constructor(t,{W:e,H:n,grid:s}){this.data=new Uint8Array(s.nx*s.nz*4);const r=this.tex=new ix(this.data,s.nx,s.nz,pn);r.magFilter=Ze,r.minFilter=Ze;const o=this.mesh=new Ht(new yi(e,n).rotateX(-Math.PI/2),new Xe({map:r,transparent:!0,depthWrite:!1,toneMapped:!1}));o.position.y=.035,o.renderOrder=2,o.visible=!1,t.add(o);const a=this.rangeRing=new Ht(new Ji(.985,1,96).rotateX(-Math.PI/2),new Xe({color:"#ffffff",transparent:!0,opacity:.6,depthWrite:!1,toneMapped:!1}));a.position.y=.04,a.visible=!1,t.add(a);const c=this.pathLine=new Mf(new Se,new Dc({color:"#ffffff",transparent:!0,opacity:.9,toneMapped:!1}));c.visible=!1,c.renderOrder=4,t.add(c);const h=this.ghost=new Ht(new Ji(.9,1,40).rotateX(-Math.PI/2),new Xe({color:"#ffffff",transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1}));h.position.y=.05,h.visible=!1,t.add(h)}reach(t,e){const n=t.u.flags.advanced,{u:s,res:r,mode:o,endForbid:a}=t,c=new Uint8Array(e.N);for(let h=0;h<e.N;h++)isFinite(r.dist[h])&&e.standable(h,s.r,o==="wreck"?"wreck":"walk",a)&&(c[h]=1);this.mask(c,t.fallback?[255,120,90]:n?[255,190,70]:[90,180,255],e)}mask(t,e,n,s=80){const r=this.data;r.fill(0);for(let o=0;o<n.N;o++){if(!t[o])continue;const a=o%n.nx,c=o/n.nx|0,h=a===0||c===0||a===n.nx-1||c===n.nz-1||!t[o-1]||!t[o+1]||!t[o-n.nx]||!t[o+n.nx],l=((n.nz-1-c)*n.nx+a)*4;r[l]=e[0],r[l+1]=e[1],r[l+2]=e[2],r[l+3]=h?210:n.diff[o]?Math.round(s*.7):s}this.tex.needsUpdate=!0,this.mesh.visible=!0}clear(){this.mesh.visible=!1,this.pathLine.visible=!1,this.rangeRing.visible=!1}range({x:t,z:e},n,s,r){const o=this.rangeRing;o.position.x=t,o.position.z=e,o.scale.setScalar(n+s),o.material.color.set(r),o.visible=!0}path(t){this.pathLine.geometry.setFromPoints(t.map(e=>new P(e.x,.08,e.z))),this.pathLine.visible=!0}ghostAt(t,e,n){const s=this.ghost;s.position.x=t.x(e),s.position.z=t.z(e),s.scale.setScalar(n),s.visible=!0}}const Au=900,Ru=700,Cu=260,Es=new re,Pu=new Un,$M=new $s,So=new P,XM=new P,Lu=new jt;class Ja{constructor(t,e){this.mesh=t,this.max=e,this.items=[],this.free=[];for(let n=e-1;n>=0;n--)this.free.push(n);t.instanceMatrix.setUsage(qp),t.frustumCulled=!1,Es.makeScale(0,0,0);for(let n=0;n<e;n++)t.setMatrixAt(n,Es),t.setColorAt(n,Lu.set(16777215))}spawn(t){if(!this.free.length){const e=this.items.shift();this.free.push(e.i)}t.i=this.free.pop(),this.mesh.setColorAt(t.i,Lu.set(t.color)),this.mesh.instanceColor.needsUpdate=!0,this.items.push(t)}update(t){const e=[];for(const n of this.items){if(n.age+=t,n.age>=n.life){Es.makeScale(0,0,0),this.mesh.setMatrixAt(n.i,Es),this.free.push(n.i);continue}n.vy-=n.g*t;const s=Math.exp(-n.drag*t);n.vx*=s,n.vz*=s,n.g<0&&(n.vy*=s),n.x+=n.vx*t,n.y+=n.vy*t,n.z+=n.vz*t,n.y<n.floor&&(n.y=n.floor,n.vy=-n.vy*n.bounce,n.vx*=.55,n.vz*=.55,n.spin*=.5),n.rx+=n.spin*t,n.ry+=n.spin*.7*t;const r=n.age/n.life,o=n.size*(n.grow?.4+r*n.grow:1)*(r>n.fadeAt?1-(r-n.fadeAt)/(1-n.fadeAt):1);Pu.setFromEuler($M.set(n.rx,n.ry,0)),Es.compose(So.set(n.x,n.y,n.z),Pu,XM.set(o*n.sx,o*n.sy,o*n.sz)),this.mesh.setMatrixAt(n.i,Es),e.push(n)}this.items=e,this.mesh.instanceMatrix.needsUpdate=!0}}function Za(i){return{x:i.x,y:i.y,z:i.z,vx:i.vx||0,vy:i.vy||0,vz:i.vz||0,g:i.g??22,drag:i.drag??.6,bounce:i.bounce??.3,floor:i.floor??.04,size:i.size??.15,sx:i.sx??1,sy:i.sy??1,sz:i.sz??1,rx:Math.random()*6,ry:Math.random()*6,spin:i.spin??(Math.random()-.5)*18,age:0,life:i.life??1.5,fadeAt:i.fadeAt??.7,grow:i.grow||0,color:i.color}}function Du(i,t){const e=document.createElement("canvas");e.width=e.height=128;const n=e.getContext("2d"),s=n.createRadialGradient(64,64,4,64,64,62);s.addColorStop(0,i),s.addColorStop(.55,i),s.addColorStop(1,t),n.fillStyle=s,n.fillRect(0,0,128,128);for(let o=0;o<90;o++){const a=Math.random()*Math.PI*2,c=30+Math.random()*30;n.fillStyle=i,n.globalAlpha=Math.random()*.5,n.beginPath(),n.arc(64+Math.cos(a)*c,64+Math.sin(a)*c,2+Math.random()*6,0,Math.PI*2),n.fill()}const r=new Ic(e);return r.colorSpace=Ae,r}class jM{constructor(t,e,n){this.scene=t,this.camera=e,this.overlay=n,this.shake=0;const s=new pr(new Nn(1,1,1),new wn({roughness:.85}),Au);s.castShadow=!0;const r=new pr(new On(1,0),new Xe({toneMapped:!1}),Ru),o=new pr(new On(1,1),new xx({transparent:!0,opacity:.55,depthWrite:!1}),Cu);t.add(s,r,o),this.cubes=new Ja(s,Au),this.glow=new Ja(r,Ru),this.puff=new Ja(o,Cu),this.lights=[];for(let a=0;a<3;a++){const c=new bx(16755285,0,14,1.6);c.position.set(0,-50,0),t.add(c),this.lights.push({l:c,until:0})}this.scorchTex=Du("rgba(20,14,8,0.85)","rgba(20,14,8,0)"),this.acidTex=Du("rgba(90,220,60,0.75)","rgba(40,120,20,0)"),this.decals=[],this.decalGeo=new Ki(1,28),this.decalGeo.rotateX(-Math.PI/2),this.texts=[],this.flashGeo=new ln(1,20,12),this.ringGeo=new Ji(.93,1,64),this.ringGeo.rotateX(-Math.PI/2),this.discGeo=new Ki(1,48),this.discGeo.rotateX(-Math.PI/2)}cube(t){this.cubes.spawn(Za(t))}mote(t){this.glow.spawn(Za({g:-1,drag:2.5,bounce:0,floor:-99,spin:0,...t}))}smoke(t){this.puff.spawn(Za({g:-2.2,drag:1.8,bounce:0,floor:.1,spin:0,grow:2.2,fadeAt:.4,...t}))}debris(t,e,n,s,r,{from:o,power:a=7,size:c=.16}={}){for(let h=0;h<r;h++){let l=Math.random()-.5,u=Math.random()-.5;o&&(l+=(t-o.x)*.35,u+=(n-o.z)*.35);const f=Math.hypot(l,u)||1,d=a*(.4+Math.random()*.8);this.cube({x:t+(Math.random()-.5)*.4,y:e+Math.random()*.3,z:n+(Math.random()-.5)*.4,vx:l/f*d,vy:3+Math.random()*a,vz:u/f*d,size:c*(.5+Math.random()),sy:.6+Math.random()*.8,color:s[Math.random()*s.length|0],life:2.4+Math.random()*1.5,fadeAt:.75})}}leaves(t,e,n,s,r,o=1){for(let a=0;a<r;a++){const c=Math.random()*Math.PI*2,h=1+Math.random()*4*o;this.cube({x:t+Math.cos(c)*.5*o,y:e+Math.random()*o,z:n+Math.sin(c)*.5*o,vx:Math.cos(c)*h,vy:2+Math.random()*4,vz:Math.sin(c)*h,g:5,drag:2.4,size:.1+Math.random()*.08,sy:.25,spin:(Math.random()-.5)*10,color:s[Math.random()*s.length|0],life:1.6+Math.random()*1.6})}}flashLight(t,e,n,s,r,o){const a=this.lights.reduce((c,h)=>c.until<h.until?c:h);a.until=vn.time+o,a.l.color.set(s),a.l.position.set(t,e,n),Ce(o,c=>a.l.intensity=r*(1-c)*(1-c))}decal(t,e,n,s,r=.8){const o=new Ht(this.decalGeo,new Xe({map:s,transparent:!0,depthWrite:!1,opacity:r,polygonOffset:!0,polygonOffsetFactor:-2}));if(o.position.set(t,.015+this.decals.length*4e-4,e),o.rotation.y=Math.random()*6,o.scale.setScalar(n),o.renderOrder=1,this.scene.add(o),this.decals.push(o),this.decals.length>40){const a=this.decals.shift();this.scene.remove(a),a.material.dispose()}return o}clearDecals(){for(const t of this.decals)this.scene.remove(t),t.material.dispose();this.decals=[]}ring(t,e,n,s,{life:r=1.2,fill:o=.18,hold:a=!1}={}){const c=new Ot,h=new Ht(this.ringGeo,new Xe({color:s,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1})),l=new Ht(this.discGeo,new Xe({color:s,transparent:!0,opacity:o,depthWrite:!1,toneMapped:!1}));c.add(h,l),c.position.set(t,.05,e),c.scale.setScalar(n),c.renderOrder=3,this.scene.add(c);const u=()=>{this.scene.remove(c),h.material.dispose(),l.material.dispose()};return a||Ce(r,f=>{h.material.opacity=.95*(1-f),l.material.opacity=o*(1-f)}).then(u),c.userData.remove=u,c}explode(t,e,n,s="fire"){const r={fire:{flash:16761963,glow:["#ffd36e","#ff8a2a","#ff5a1f","#fff2b0"],light:16751178,smoke:"#4a4038"},acid:{flash:10354538,glow:["#b8ff6a","#5be04a","#d8ff9a","#2fbf4a"],light:9109338,smoke:"#3f5a2a"},thorns:{flash:13172634,glow:["#9be36a","#e4ffb0","#5ab04a"],light:12255114,smoke:"#3a4a2a"},dust:{flash:16773328,glow:["#ffe9b0","#ffd080"],light:16769184,smoke:"#8a7a64"}}[s],o=new Ht(this.flashGeo,new Xe({color:r.flash,transparent:!0,opacity:.9,toneMapped:!1,depthWrite:!1}));o.position.set(t,.3,e),this.scene.add(o),Ce(.45,c=>{o.scale.setScalar(.2+n*.85*Is(c)),o.material.opacity=.9*(1-c)}).then(()=>{this.scene.remove(o),o.material.dispose()}),this.flashLight(t,1.5,e,r.light,9+n*6,.7);const a=Math.round(18+n*14);for(let c=0;c<a;c++){const h=Math.random()*Math.PI*2,l=(2+Math.random()*6)*(.6+n*.25);this.mote({x:t,y:.3,z:e,vx:Math.cos(h)*l,vy:2+Math.random()*6,vz:Math.sin(h)*l,g:9,drag:2.2,size:.07+Math.random()*.12,color:r.glow[c%r.glow.length],life:.5+Math.random()*.7})}for(let c=0;c<6+n*3;c++){const h=Math.random()*Math.PI*2,l=Math.random()*n*.6;this.smoke({x:t+Math.cos(h)*l,y:.3+Math.random()*.4,z:e+Math.sin(h)*l,vx:Math.cos(h)*1.2,vy:1+Math.random()*1.5,vz:Math.sin(h)*1.2,size:.25+Math.random()*.25*n,color:r.smoke,life:1.6+Math.random()*1.4})}this.debris(t,.1,e,["#5b4630","#6f8a3a","#4a3a28"],Math.round(6+n*4),{power:5+n,size:.1}),this.decal(t,e,n*.7,s==="acid"?this.acidTex:this.scorchTex,s==="acid"?.6:.45),this.shake=Math.max(this.shake,.05+n*.06)}async projectile(t,e,{mesh:n,arc:s=.25,speed:r=22,trail:o=null,spin:a=10}={}){const c=Math.hypot(e.x-t.x,e.z-t.z),h=c*s;this.scene.add(n);let l=0;await Ce(Math.max(.12,c/r),u=>{n.position.set(t.x+(e.x-t.x)*u,t.y+(e.y-t.y)*u+4*h*u*(1-u),t.z+(e.z-t.z)*u),n.rotation.x+=a*.016,n.rotation.z+=a*.011,o&&u-l>.03&&(l=u,o(n.position))}),this.scene.remove(n)}text(t,e,n="#ffffff",{size:s=18,life:r=1.3,rise:o=1.4}={}){const a=document.createElement("div");a.className="float-text",a.textContent=e,a.style.color=n,a.style.fontSize=s+"px",this.overlay.appendChild(a),this.texts.push({el:a,x:t.x,y:t.y,z:t.z,age:0,life:r,rise:o})}update(t){this.cubes.update(t),this.glow.update(t),this.puff.update(t),this.shake*=Math.exp(-t*6);const e=innerWidth,n=innerHeight;this.texts=this.texts.filter(s=>{if(s.age+=t,s.age>s.life)return s.el.remove(),!1;const r=s.age/s.life;return So.set(s.x,s.y+s.rise*Is(r),s.z).project(this.camera),s.el.style.transform=`translate(${(So.x*.5+.5)*e}px, ${(-So.y*.5+.5)*n}px) translate(-50%, -50%) scale(${1+.3*(1-Math.min(1,r*5))})`,s.el.style.opacity=r>.6?1-(r-.6)/.4:1,!0})}}const qM=()=>({acorn:new ln(.07,6,5),dart:new zn(.03,.3,4).rotateX(Math.PI/2),javelin:new tn(.02,.02,.9,4).rotateX(Math.PI/2),spit:new On(.08,0),bomb:new ln(.11,8,6),pinecone:new zn(.2,.42,7),acid:new ln(.24,12,8)}),Iu=new Map,Uu=i=>Iu.get(i)??Iu.set(i,new Xe({color:i,toneMapped:!1})).get(i);class YM{constructor({scene:t,fx:e,units:n}){this.scene=t,this.effects=e,this.units=n,this.projGeo=qM(),this.thorn=null,this.blastMarker=null,this.spikesOf=new Map}projectileStyle(t){const e=this.effects,n=this.projGeo;switch(t){case"acorn":return{mesh:new Ht(n.acorn,dt("#8a5a2a")),arc:.08,speed:28};case"dart":return{mesh:new Ht(n.dart,dt("#4a6a2a")),arc:.03,speed:34,spin:0};case"javelin":return{mesh:new Ht(n.javelin,dt("#8a6a3a")),arc:.18,speed:20,spin:0};case"spit":return{mesh:new Ht(n.spit,Uu("#9aff5a")),arc:.12,speed:18,trail:s=>e.mote({x:s.x,y:s.y,z:s.z,size:.04,color:"#7aef4a",life:.4,g:6})};case"bomb":return{mesh:new Ht(n.bomb,dt("#7a4a22")),arc:.45,speed:14,trail:s=>e.mote({x:s.x,y:s.y+.1,z:s.z,size:.05,color:"#ffb030",life:.3,g:-1})};case"pinecone":return{mesh:new Ht(n.pinecone,dt("#6b4a26",{emissive:"#ff5a10",emissiveIntensity:.6})),arc:.55,speed:18,trail:s=>{e.mote({x:s.x,y:s.y,z:s.z,size:.12,color:Math.random()<.5?"#ff8a2a":"#ffd36e",life:.4,g:-2}),e.smoke({x:s.x,y:s.y,z:s.z,size:.14,color:"#3a3430",life:.9})}};case"acid":return{mesh:new Ht(n.acid,Uu("#8aff5a")),arc:.5,speed:15,trail:s=>e.mote({x:s.x,y:s.y,z:s.z,size:.1,color:Math.random()<.5?"#5be04a":"#c8ff8a",life:.5,g:8})}}return{mesh:new Ht(n.acorn,dt("#888"))}}fly(t,e,n){return this.effects.projectile(t,e,this.projectileStyle(n))}async volley(t){const e=this.units,n=this.effects,s=e.unit(t.u),r=e.unit(t.tg),o=e.get(t.u),a=e.gen,c=()=>e.gone(t.u,o,a),h=e.standing(t.u),l=e.standing(t.tg),u=[],f=Math.min(10,t.n);for(let d=0;d<f;d++){const g=h[d%h.length],v=l[Math.random()*l.length|0],m={x:g.x,y:jc(s)*.8+g.lift,z:g.z},p={x:v.x+(Math.random()-.5)*.6,y:qc(r)*.8,z:v.z+(Math.random()-.5)*.6};u.push(Ln(d*.06).then(()=>{if(!c())return Re.shot(),this.fly(m,p,t.fx)}).then(()=>{if(!c())for(let _=0;_<5;_++)n.mote({x:p.x,y:p.y,z:p.z,vx:(Math.random()-.5)*4,vy:Math.random()*3,vz:(Math.random()-.5)*4,size:.05,color:t.fx==="spit"?"#9aff5a":"#ffe0a0",life:.35,g:10})}))}await Promise.all(u)}aimed(t){this.blastMarker=this.effects.ring(t.x,t.z,t.r,"#ffffff",{hold:!0,fill:.12})}async scattered(t){const e=this.blastMarker;this.effects.text({x:t.from.x,y:1.5,z:t.from.z},`scatter ${t.d}"`,"#ffd36e",{size:15}),await Ce(.35,n=>e==null?void 0:e.position.set(gn(t.from.x,t.to.x,n),.05,gn(t.from.z,t.to.z,n)),Is)}async fired(t){var r;const e=this.units,n=e.get(t.u),s=e.gen;await this.artilleryFire(t),!e.gone(t.u,n,s)&&((r=this.blastMarker)==null||r.userData.remove(),this.blastMarker=null)}async artilleryFire(t){const e=this.units,n=e.unit(t.u),s=e.get(t.u),r=e.gen,o=t.to,a=()=>e.gone(t.u,s,r),c=e.standing(t.u)[0],h=c.mesh.userData.anim;if(h!=null&&h.throwArm){const f=h.rest;if(Re.thwack(),Ce(.25,d=>h.throwArm.rotation.x=f-2.1*Is(d)).then(()=>Ce(.8,d=>h.throwArm.rotation.x=f-2.1*(1-d))),h.globe&&(h.globe.visible=!1),await Ln(.15),a())return}else c.lunge=1,c.lungeDir=Math.atan2(o.x-c.x,o.z-c.z);const l={x:c.x,y:n.t.big?1.8:.9,z:c.z},u={x:o.x,y:.15,z:o.z};Re.shot(),await this.fly(l,u,t.fx),!a()&&h!=null&&h.globe&&(h.globe.visible=!0)}landed(t){const e=this.effects;t.fx!=="thorns"&&(e.explode(t.x,t.z,t.r,t.fx==="acid"?"acid":"fire"),Re.boom(t.r/2)),e.ring(t.x,t.z,t.r,t.fx==="acid"?"#8aff5a":"#ff9a4a",{life:1.4,fill:.2})}cast(){Re.magic()}fizzled(t){Re.fizzle(),this.effects.text(this.units.top(t.u),"Fizzle…","#c8b8ff")}async thorns(t){const e=this.units,n=this.effects,s=e.get(t.u),r=e.gen,o=s.models[0].mesh.userData.anim.gem;if(o){const c=new P;o.getWorldPosition(c);for(let h=0;h<20;h++)n.mote({x:c.x,y:c.y,z:c.z,vx:(Math.random()-.5)*3,vy:Math.random()*3,vz:(Math.random()-.5)*3,size:.06,color:"#9aff7a",life:.8,g:-1})}const a=[];this.thorn??(this.thorn=new zn(.12,1,5));for(let c=0;c<26;c++){const h=Math.random()*Math.PI*2,l=Math.sqrt(Math.random())*t.r,u=new Ht(this.thorn,dt(c%3?"#5a7a2a":"#7a5a2a"));u.position.set(t.x+Math.cos(h)*l,-.6,t.z+Math.sin(h)*l),u.rotation.set((Math.random()-.5)*.6,0,(Math.random()-.5)*.6),u.scale.set(1,.6+Math.random()*1.1,1),u.castShadow=!0,this.scene.add(u),a.push(u)}this.spikesOf.set(t.u,a),await Ce(.3,c=>a.forEach(h=>h.position.y=-.6+Is(c)*(.3+h.scale.y*.4))),!e.gone(t.u,s,r)&&n.explode(t.x,t.z,t.r,"thorns")}faded(t){const e=this.spikesOf.get(t.u)??[];this.spikesOf.delete(t.u),Ce(1.2,n=>e.forEach(s=>s.position.y-=.02*n)).then(()=>e.forEach(n=>this.scene.remove(n)))}async gaze(t){const e=this.units,n=this.effects,s=e.get(t.tg),r=e.gen,o=()=>e.gone(t.tg,s,r),a=e.top(t.u),c=e.top(t.tg),h=[];for(let u=0;u<=16;u++){const f=u/16;h.push(Ln(f*.3).then(()=>o()||n.mote({x:gn(a.x,c.x,f),y:gn(a.y,c.y,f)+Math.sin(f*Math.PI)*.8,z:gn(a.z,c.z,f),size:.09,color:"#c070ff",life:.7,g:0})))}if(await Promise.all(h),o())return;const l=e.shown(t.tg);for(let u=0;u<3;u++)n.ring(l.pos.x,l.pos.z,l.r*(.6+u*.35),"#c070ff",{life:1.2+u*.3,fill:.08})}mesmerized(t){this.effects.text(this.units.top(t.tg),"Mesmerized!","#e0a0ff",{size:20})}held(){return{marker:!!this.blastMarker,thorns:[...this.spikesOf.values()].reduce((t,e)=>t+e.length,0)}}clear(){var t;(t=this.blastMarker)==null||t.userData.remove(),this.blastMarker=null;for(const e of this.spikesOf.values())for(const n of e)this.scene.remove(n);this.spikesOf.clear()}}class KM{constructor({handlers:t,view:e=null,mirror:n=null,onIdle:s=null}){this.handlers=t,this.view=e,this.mirror=n,this.onIdle=s,this.observer=null,this.q=[],this.running=!1,this.table=0}get idle(){return!this.running&&!this.q.length}push(t){for(const e of t)this.q.push(e);this.running||this.run()}snap(t,e=xr(t)){var n,s,r,o;this.table++,this.q.length=0,this.running=!1,this.mirror=e,(n=this.view)==null||n.rebuild(t,e),(r=(s=this.observer)==null?void 0:s.reset)==null||r.call(s,e),(o=this.onIdle)==null||o.call(this,{snap:!0})}run(){var e,n,s;const t=this.table;this.running=!0;try{for(;this.q.length;){const r=this.q.shift();this.mirror=ud(this.mirror,r),(n=(e=this.observer)==null?void 0:e.event)==null||n.call(e,r,this.mirror);const o=(this.handlers[r.t]??this.handlers.fallback)(r,this.mirror);if(o&&typeof o.then=="function"){o.then(()=>t===this.table&&this.run(),a=>t===this.table&&this.fail(a));return}}}catch(r){return this.fail(r)}this.running=!1,(s=this.onIdle)==null||s.call(this)}fail(t){throw this.running=!1,this.q.length=0,t}}const Nu=new WeakMap;function JM(i){var n;const t=(n=i.G)==null?void 0:n.pending;if((t==null?void 0:t.k)!=="chargeEnd")return null;let e=Nu.get(t);return e||(e=i.preview((s,r)=>{const o=s.units.find(h=>h.id===t.u),a=s.units.find(h=>h.id===t.tg),c=r.chargePlan(s,o,a);return{seat:t.seats[0],u:o,tg:a,rolled:t.rolled,cell:t.cell,plan:c,ok:r.chargeSpots(c,t.rolled)}}),Nu.set(t,e)),e}function Md(i,t,e,n,s=2.4){let r=-1,o=s;for(let a=0;a<i.N;a++){if(!t[a])continue;const c=Ft(i.x(a)-e,i.z(a)-n);c<o&&(o=c,r=a)}return r}const ZM=-1,QM=i=>({t:"chargeEnd",c:i}),bd=i=>i.length===2&&i[0].race===i[1].race;function Sd(i){const t=bd(i);return Object.freeze(i.map(({seat:e,race:n})=>{const s=Pn[n];return Object.freeze({name:s.name,short:s.short,icon:s.icon,color:t&&e===1?s.look.alt:s.look.team,dark:s.look.dark})}))}const{alive:tb,isEngaged:eb,inCover:nb,phaseKey:Rr,canAct:ib,movePlan:sb,validEnd:rb,freeSpot:ob,shotInfo:ab,shootTargets:cb,chargeTargets:lb,chargePlan:hb,rngState:zu}=td,{W:Cr,H:Mc}=ri,yt=i=>document.querySelector(i),Dn=new URLSearchParams(location.search),wd=Dn.has("fast"),Js=new _M({lowfi:Dn.has("lowfi"),fast:wd}),{renderer:ss,scene:In}=Js,Tn=new MM(ss),{camera:Pr,controls:ub}=Tn;Js.light();const ii=new jM(In,Pr,Js.overlay),ta=new wM(In,ss,{W:Cr,H:Mc,deploy:js.classic.deploy,edges:Wf}),Ed=new RM(In,js.classic.objectives,Go,i=>be[i].color),dn=new _d(In,ii),Pt={seed:(Number(Dn.get("seed"))||Math.random()*1e6|0)>>>0,control:["human","ai"],sel:null,reach:null,hover:null},Jc=(()=>{if(!Dn.has("races"))return tu;const i=Dn.get("races").split(",").map(n=>n.trim().toLowerCase());if(i.length===2&&i.every(n=>Pn[n]))return i;const t=`?races= takes two of ${Object.keys(Pn).join(", ")}, comma-separated, not "${Dn.get("races")}"`;console.warn(`${t}: playing the classic matchup`);const e=document.createElement("p");return e.className="small",e.textContent=`${t}, so this is the classic matchup.`,yt("#title .modes").before(e),tu})();let ce=null,le=null,Qn=null,Zc=!0;const Mn=()=>le??Qn;let Ne=null,wo=null;const fb=Dn.has("debug"),db=fb?(i,t)=>Ne==null?void 0:Ne.line(i,t):null,Qc=i=>i.map((t,e)=>({seat:e,race:t}));let be=Sd(Qc(Jc));function Td(i){be=Sd(i),Rd()}const Ad=document.createElement("style");document.body.appendChild(Ad);const Ou=i=>`rgba(${[1,3,5].map(t=>parseInt(i.slice(t,t+2),16)).join(", ")}, 0.45)`;function Rd(){Ad.textContent=`#hud, #labels, #log, #card { --s0: ${be[0].color}; --s1: ${be[1].color}; --s0-glow: ${Ou(be[0].color)}; --s1-glow: ${Ou(be[1].color)}; }`;for(const i of[0,1]){const t=i?"#sideB":"#sideA";yt(`${t} .ic`).textContent=be[i].icon,yt(`${t} .nm`).textContent=be[i].name}ta.paint(be.map(i=>i.color))}Rd();const Cd=i=>i>=0&&bd(Mn().seats)?be[i].color:"",pb=i=>Wc(le,i)==="human",mb=i=>!!(ce!=null&&ce.localSeats.includes(i)),Pd=Object.fromEntries(br.map(i=>[i.key,i.name])),he=new yd({scene:In,labels:Js.overlay,fx:ii,mirror:()=>xe.mirror,colorOf:i=>be[i].color,W:Cr}),on=new YM({scene:In,fx:ii,units:he}),qe=new GM(In,{W:Cr,H:Mc,grid:Uf(Cr,Mc,Gf)}),Ld=i=>Mn().units.find(t=>t.id===i),Dd=i=>he.shown(i.id),gb={log:i=>Cb(i.side,i.html,i.cls,i.at),"tray.open":i=>bc.clear(i.title),dice:i=>bc.row(i.label,i.dice,i.need,i),pause:i=>Ln(Ar.pause(i.s)),focus:i=>Tn.focus(i.x,i.z,{stage:xe.mirror.stage,active:xe.mirror.active,localSeats:(ce==null?void 0:ce.localSeats)??[]}),"unit.place":i=>he.disc(i.u),"unit.formation":i=>{he.disc(i.u),he.label(i.u)},"unit.wound":i=>he.wounded(i),"unit.slain":(i,t)=>he.slain(i,t),"unit.flee":i=>he.fled(i),"unit.destroyed":(i,t)=>he.destroyed(i,t),"unit.face":i=>he.face(i),"unit.move":(i,t)=>he.walk(i,t,e=>{for(const n of e)dn.apply(n,t)}),melee:i=>he.lunge(i),"charge.result":i=>he.shout(i),volley:i=>on.volley(i),"blast.aim":i=>on.aimed(i),"blast.scatter":i=>on.scattered(i),"blast.fire":i=>on.fired(i),"blast.land":i=>on.landed(i),"spell.cast":()=>on.cast(),"spell.fizzle":i=>on.fizzled(i),"spell.thorns":i=>on.thorns(i),"spell.fade":i=>on.faded(i),"spell.gaze":i=>on.gaze(i),"spell.mesmerized":i=>on.mesmerized(i),status:()=>he.labelAll(),objectives:()=>{},act:()=>{},stage:i=>xb(i),"phase.start":i=>yb(i),"round.scored":i=>Mb(i),"game.over":i=>bb(i),pending:()=>{},check:i=>wo==null?void 0:wo(i),"terrain.clear":(i,t)=>dn.apply(i,t),"terrain.add":(i,t)=>dn.apply(i,t),"terrain.hurt":(i,t)=>dn.apply(i,t),"terrain.destroy":(i,t)=>dn.apply(i,t),"terrain.collapse":(i,t)=>dn.apply(i,t),"terrain.rubble":(i,t)=>dn.apply(i,t),fallback:(i,t)=>{const e=i.u!==void 0&&t.units[i.u]?t.units[i.u].pos:{x:i.x??0,z:i.z??0};return i.text&&ii.text({x:e.x,y:1.6,z:e.z},i.text,"#ffffff"),Ln(i.beat??Ar.beat)}};function Id(i,t,e={}){const{chunks:n=i.terrain.chunks,terrain:s=dn,units:r=he,shots:o=on,effects:a=ii}=e;s.sync(n),r.sync(i.units,c=>jo(i,c)),o.clear(),a.clearDecals()}const xe=new KM({handlers:gb,view:{rebuild:Id},onIdle:i=>wb(i)}),vb={events(i,t){le!==t.G&&(le=t.G,_b(le)),Ne&&(i=Ne.present(i,le)),xe.push(i)}};function _b(i){const t=n=>!he.get(n.id)||he.unit(n.id).t!==n.t||he.unit(n.id).side!==n.side,e=i.units.find(t);if(e||i.units.length!==he.views.size)throw new Error(`the battle's units are not the table's (${e?`unit ${e.id}, ${e.key} of seat ${e.side}`:`${i.units.length} units, ${he.views.size} figures`}): a battle starts on its own table (start())`)}let Ns=!1,Eo=!1;function xb(i){Ns=!1,i.stage!=="deploy"&&Bn(null),Vn()}function yb(i){return Ns=!0,Bn(null),bc.el.classList.remove("show"),Vn(),Gd(`${be[i.side].icon} ${be[i.side].name}`,Pd[i.phase],i.side)}function Mb(i){return i.owners.forEach((t,e)=>{const n=js.classic.objectives[e];t>=0&&ii.ring(n.x,n.z,Go,be[t].color,{life:1.6,fill:.15})}),Vn(),Gd(`End of round ${i.round}`,`VP ${i.vp[0]} – ${i.vp[1]}`)}function bb({win:i,why:t,vp:e,rounds:n}){Bn(null),Vn();const s=i<0?"A bloody draw":`${be[i].name} win!`,r=n?`in round ${n}`:"in the deployment",o=t==="wipe"?`${be[1-i].name} have been wiped from the table ${r}.`:t==="concede"?`${be[1-i].name} conceded ${r}.`:`Final score ${e[0]} – ${e[1]} after ${n} round${n===1?"":"s"}.`,a=yt("#overTitle");a.textContent=`${i>=0?be[i].icon+" ":""}${s}`,a.style.color=Cd(i),yt("#overWhy").textContent=o,yt("#over").classList.remove("hidden"),Re.fanfare()}const oi=()=>ce?ce.decisionFor():-1,ea=()=>oi()>=0?le.pending:null,Ti=()=>{var i;return((i=ea())==null?void 0:i.k)==="deploy"?oi():-1},Ri=()=>{var i;return xe.idle&&((i=ea())==null?void 0:i.k)==="phase"},ai=()=>{var i;return xe.idle&&((i=ea())==null?void 0:i.k)==="chargeEnd"?JM(ce):null},kn=i=>ce.preview(i);function si(i,t){const e=ce?ce.legal(i,t):"no battle";return e||(ce.submit(i,t),Vn(),null)}const Ud=(i,t)=>(qe.clear(),si(oi(),{t:"move",u:i.id,c:t})),Nd=i=>si(oi(),{t:"advance",u:i.id}),zd=(i,t)=>si(oi(),{t:"shoot",u:i.id,tg:t.id}),Od=(i,t)=>si(oi(),{t:"charge",u:i.id,tg:t.id});function Fd(i){const t=ai();return t?i>=0&&t.ok[i]?kd(t,i):`cell ${i} is no spot the roll reaches`:"no charge to end"}function Sb(){const i=ai();return i?kd(i,ZM):"no charge to end"}function kd(i,t){return Oo=null,qe.clear(),qe.ghost.visible=!1,yt("#tooltip").style.display="none",si(i.seat,QM(t))}let Oo=null;function wb({snap:i=!1}={}){Ne==null||Ne.idle();const t=!i&&fr&&Ld(fr.id);t&&t.t===fr.t&&t.side===fr.side&&yt("#card").classList.contains("show")&&wi(t),Pt.sel&&Ri()&&Bn(kn((n,s)=>s.canAct(n,Pt.sel))?Pt.sel:null);const e=ai();e&&Oo!==e&&(Oo=e,qe.rangeRing.visible=!1,qe.mask(e.ok,[255,150,60],le.nav,150),qe.ghostAt(le.nav,e.cell,e.u.r)),Vn(),Ne==null||Ne.settled()}const Qa=new Ex,Fu=new ht;let ur=null;function Bd(i){Fu.set(i.clientX/innerWidth*2-1,-(i.clientY/innerHeight)*2+1),Qa.setFromCamera(Fu,Pr);const t=Qa.intersectObjects(he.pickables(),!1),e=t.length?Ld(t[0].object.userData.id):null,n=Qa.intersectObject(ta.board,!1)[0];return{unit:e,ground:n?n.point:null}}ss.domElement.addEventListener("pointerdown",i=>{Qo(),ur={x:i.clientX,y:i.clientY,b:i.button}});ss.domElement.addEventListener("pointerup",i=>{if(!ur||i.button!==0)return;const t=Math.hypot(i.clientX-ur.x,i.clientY-ur.y);ur=null,!(t>6)&&Eb(Bd(i))});ss.domElement.addEventListener("pointerleave",()=>{Pt.hoverPick=null,Pt.hover=null,Vd(),tl()});ss.domElement.addEventListener("pointermove",i=>{Pt.mouse={x:i.clientX,y:i.clientY},Pt.hoverPick=Bd(i),Vd()});function Eb({unit:i,ground:t}){if(yt("#tooltip").style.display="none",Ti()>=0)return Hd(i,t);const e=ai();if(e){if(t){const r=Md(le.nav,e.ok,t.x,t.z);r>=0&&Fd(r)}return}if(!Ri()){i&&wi(i);return}const n=Pt.sel,s=Rr(le);if(i&&i.side===oi()){kn((r,o)=>o.canAct(r,i))?(Re.click(),Bn(i)):wi(i);return}if(s==="move"&&n&&t){const r=kn((o,a)=>a.nearestValid(o,Pt.reach,t.x,t.z));r>=0&&Ud(n,r);return}if(s==="shoot"&&n&&i&&i.side!==n.side)return void zd(n,i);if(s==="charge"&&n&&i&&i.side!==n.side)return void Od(n,i);i?wi(i):t&&Bn(null)}function Hd(i,t){const e=Ti();if(e<0)return"no seat deploying here";if(i&&i.side===e)return Re.click(),Pt.sel=i,wi(i),tl(),null;if(Pt.sel&&t){const n=Pt.sel,s=kn((r,o)=>o.freeSpot(r,n,t.x,t.z,e,r.units.filter(a=>a!==n)));if(s&&Math.hypot(s.x-t.x,s.z-t.z)<2.5){const r=si(e,{t:"place",u:n.id,c:le.nav.index(s.x,s.z)});return r||(Re.click(),he.labelAll()),r}}return null}function Bn(i){if(Pt.sel=i,Pt.reach=null,qe.clear(),i&&le){const t=Rr(le);le.turn.stage==="battle"&&t==="move"&&!i.flags.moved&&(Pt.reach=kn((e,n)=>n.movePlan(e,i,i.flags.advanced?i.flags.advRoll:0)),qe.reach(Pt.reach,le.nav)),t==="shoot"&&i.t.ranged&&ku(i,i.t.ranged.range),t==="charge"&&ku(i,Ir)}wi(i),Vn()}function ku(i,t){qe.range(i.pos,i.r,t,Rr(le)==="charge"?"#ffb070":"#ffffff")}function Vd(){const i=yt("#tooltip");i.style.display="none",qe.pathLine.visible=!1,qe.ghost.visible=!1;const t=Pt.hoverPick,e=ai();if(!t){e&&qe.ghostAt(le.nav,e.cell,e.u.r);return}Pt.hover=t.unit;let n="";const s=Pt.sel,r=(o,a,c)=>{qe.path(o),qe.ghostAt(le.nav,a,c)};if(e&&t.ground){const o=Md(le.nav,e.ok,t.ground.x,t.ground.z);o>=0?(r(kn(a=>a.nav.path(e.plan.res,o,e.u.r,e.plan.mode==="fly"?null:e.plan.forbid)),o,e.u.r),n=`End charge here · ${e.plan.res.dist[o].toFixed(1)}" of ${e.rolled}"`):n="✖ out of reach — pick a spot in the orange area"}else Ri()&&s&&(n=kn((o,a)=>{const c=a.phaseKey(o),h=o.nav;if(c==="move"&&Pt.reach&&t.ground&&!t.unit){const l=a.nearestValid(o,Pt.reach,t.ground.x,t.ground.z);return l<0?"":(r(h.path(Pt.reach.res,l,s.r,Pt.reach.mode==="fly"?null:Pt.reach.forbid),l,s.r),`${Pt.reach.res.dist[l].toFixed(1)}" of ${Pt.reach.max}"`)}if(c==="shoot"&&t.unit&&t.unit.side!==s.side){const l=a.shotInfo(o,s,t.unit);return l.ok?Tb(s,t.unit,l):`✖ ${l.why}`}if(c==="charge"&&t.unit&&t.unit.side!==s.side){if(!a.chargeTargets(o,s).includes(t.unit))return`✖ out of charge range (${a.gap(s,t.unit).toFixed(1)}")`;const l=a.chargePlan(o,s,t.unit);return l?`Charge: need ${l.need}" on 2D6 — ${Math.round(Zi(l.need)*100)}%`:"✖ no route"}return""}));if(!n&&t.unit){const o=Dd(t.unit);n=`${t.unit.t.name} · ${t.unit.t.models>1?`${o.alive}/${t.unit.t.models} models`:`${o.models[0].w}/${t.unit.t.W} wounds`}`}n&&Pt.mouse&&(i.innerHTML=n,i.style.display="block",i.style.left=Pt.mouse.x+16+"px",i.style.top=Pt.mouse.y+14+"px")}function Tb(i,t,e){const n=i.t.ranged;if(n.mesmerize)return`Mesmerize: cast ${n.spell}+ on 2D6 (${Math.round(Zi(n.spell)*100)}%) · D3 mortal wounds`;const s=[];n.spell&&s.push(`Cast ${n.spell}+ (${Math.round(Zi(n.spell)*100)}%)`);const r=Bs(i,n,!1),o=Nr(n.S,t.t.T,n.poison),a=zr(t.t.Sv,n.AP,e.cover);s.push(`${r} ${n.blast?`template${r>1?"s":""} (${n.blast}")`:"shots"} · hit ${n.spell?"auto":e.need+"+"} · wound ${o}+ · save ${a>6?"—":a+"+"}`);const c=[];if(c.push(`${e.range.toFixed(1)}"`),e.cover&&c.push("cover"),e.visible?e.seen<e.total&&c.push(`${e.seen}/${e.total} visible`):c.push("unseen (indirect −1)"),n.heavy&&i.flags.moved&&c.push("moved (heavy −1)"),!n.blast){const h=Uo(r,e.need,n,t,e.cover);c.push(`≈${h.kills.toFixed(1)} slain`)}return s.push(c.join(" · ")),s.join("<br>")}const Ab={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};function Rb(i,t){const e=document.createElement("div");e.className=`die ${t}`;for(let n=0;n<9;n++){const s=document.createElement("i");Ab[i].includes(n)&&(s.className="on"),e.appendChild(s)}return e}const bc={el:yt("#tray"),clear(i){this.el.innerHTML="";const t=document.createElement("div");t.className="tray-title",t.textContent=i,this.el.appendChild(t),this.el.classList.add("show")},async row(i,t,e,{sum:n=!1,pass:s,note:r="",save:o=!1}={}){Re.dice(t.length);const a=document.createElement("div");a.className="tray-row";const c=document.createElement("span");c.className="lbl",c.textContent=i,a.appendChild(c);const h=document.createElement("span");h.className="dice",a.appendChild(h),t.slice(0,30).forEach((f,d)=>{const g=e?f>=e?o?"saved":"ok":"fail":s===!1?"fail":s?"ok":"plain",v=Rb(f,g);v.style.animationDelay=`${d*.025/vn.speed}s`,h.appendChild(v)});const u=document.createElement("span");if(u.className="res",e){const f=ei(t,e);u.textContent=o?`${f} saved`:`${f} ✓`,t.length>30&&(u.textContent+=` (of ${t.length})`)}else n&&(u.textContent=r||`= ${t.reduce((f,d)=>f+d,0)}`,s===!0&&u.classList.add("good"),s===!1&&u.classList.add("bad"));for(a.appendChild(u),this.el.appendChild(a);this.el.children.length>7;)this.el.children[1].remove();await Ln(Ar.dice(t.length))}};function Cb(i,t,e,n){const s=yt("#logList"),r=document.createElement("div");for(r.className=`entry s${i} ${e}`,r.innerHTML=t,Ne&&(Ne.reach(n),r.dataset.at=n),s.prepend(r);s.children.length>80;)s.lastChild.remove()}const Bu=["M","WS","BS","S","T","W","A","Ld","Sv","OC"];let fr=null;function wi(i){var h;const t=yt("#card");if(fr=i,!i){t.classList.remove("show");return}const e=i.t,n=l=>l==="M"?`${e.M}"`:["WS","BS","Sv"].includes(l)?`${e[l]}+`:e[l],s=(l,u)=>{if(!l)return"";if(l.mesmerize)return`<div class="wpn"><span>${u} ${l.name}</span><em>spell ${l.spell}+ · ${l.range}" · D3 mortal + mesmerize</em></div>`;const f=[];return l.range&&f.push(`${l.range}"`),l.spell&&f.push(`spell ${l.spell}+`),l.blast?f.push(`blast ${l.blast}" ×${l.shots}`):l.shots&&f.push(`A${l.shots}`),f.push(`S${l.S}`,`AP-${l.AP}`,`D${l.D}`),l.poison&&f.push(`poison ${l.poison}+`),l.indirect&&f.push("indirect"),l.heavy&&f.push("heavy"),l.assault&&f.push("assault"),`<div class="wpn"><span>${u} ${l.name}</span><em>${f.join(" · ")}</em></div>`},r=Dd(i),o=xe.idle,a=[];o&&i.flags.moved&&a.push(i.flags.fellBack?"fell back":i.flags.advanced?`advanced +${i.flags.advRoll}"`:"moved"),o&&i.flags.shot&&a.push("shot"),o&&i.flags.charged&&a.push("charged"),r.mesmerized&&a.push("🌀 mesmerized"),r.alive>0&&r.engaged&&a.push("⚔ in combat"),o&&r.alive>0&&nb(Mn(),i)&&a.push("🛡 in cover");const c=e.models>1?`${r.alive}/${e.models} models`:`${r.models[0].w}/${e.W} wounds`;t.innerHTML=`
    <div class="card-head s${i.side}"><b>${e.name}</b><span>${be[i.side].short} · ${e.role}</span></div>
    <div class="card-sub">${r.alive>0?c:"destroyed"}${a.length?" · "+a.join(" · "):""}</div>
    <table class="stats"><tr>${Bu.map(l=>`<th>${l}</th>`).join("")}</tr><tr>${Bu.map(l=>`<td>${n(l)}</td>`).join("")}</tr></table>
    ${s(e.ranged,(h=e.ranged)!=null&&h.spell?"✦":"➹")}${s({...e.melee,range:0},"⚔")}
    <ul class="abil">${(e.abilities||[]).map(l=>`<li>${l}</li>`).join("")}</ul>`,t.classList.add("show")}function Vn(){var m;const i=xe.mirror,e=Mn().setup.rounds;yt("#vp0").textContent=i.vp[0],yt("#vp1").textContent=i.vp[1],yt("#round").textContent=i.stage==="deploy"?"Deployment":`Round ${Math.min(i.round,e)} / ${e}`,document.querySelectorAll("#phases .ph").forEach(p=>{p.classList.toggle("on",i.stage==="battle"&&p.dataset.k===i.phase)}),yt("#sideA").classList.toggle("active",i.stage==="battle"&&i.active===0),yt("#sideB").classList.toggle("active",i.stage==="battle"&&i.active===1);const n=xe.idle,s=ea(),r=Pt.sel,o=(s==null?void 0:s.k)==="deploy",a=Ns&&(s==null?void 0:s.k)==="phase"&&i.stage==="battle"&&i.active===s.seats[0]&&i.phase===s.phase&&i.round===le.turn.round,c=Ns&&(s==null?void 0:s.k)==="chargeEnd"&&i.stage==="battle"&&i.active===s.seats[0]&&i.phase==="charge"&&i.round===le.turn.round,h=ai(),l=yt("#endPhase"),u=yt("#autoPhase"),f=yt("#advance");!a&&!c?Eo=!1:n&&(Eo=!0);const d=Eo&&!h;l.style.display=o||d?"":"none",u.style.display=d?"":"none",yt("#closestSpot").style.display=h?"":"none",o?l.textContent="Begin battle ▸":a&&(l.textContent=`End ${Pd[s.phase]} ▸`),l.disabled=u.disabled=f.disabled=!n,a?n&&(f.style.display=s.phase==="move"&&r&&!r.flags.moved&&!r.flags.advanced&&!kn((p,_)=>_.isEngaged(p,r))?"":"none"):f.style.display="none",r&&(f.textContent=`Advance (+D6") — no ${(m=r.t.ranged)!=null&&m.assault?"charge":"shooting or charge"} after`,r.t.chargeAfterAdvance&&(f.textContent='Advance (+D6") — can still charge'));const g=Ti();ta.zones([0,1].map(p=>i.stage==="battle"||i.stage==="over"?.05:p===g?.2:.07));let v=yt("#hint").textContent;h?v=`Charge! Rolled ${h.rolled}" — click the orange area to place ${h.u.t.short}, or take the shortest move.`:o?v="Deployment — click one of your units, then click inside your shaded zone to move it there.":le&&Ns&&i.stage==="battle"&&!pb(i.active)?v=`${be[i.active].name} (AI) are taking their turn…`:a&&(n||!r)?v={move:r?kn((p,_)=>_.isEngaged(p,r))?"Engaged — click inside the red area to fall back (no shooting or charging after).":"Click inside the shaded area to move. Difficult ground costs double.":"Movement — pick a unit with a white ring to move it.",shoot:r?"Click an enemy unit to shoot it. Hover for odds.":"Shooting — pick a unit with a white ring to fire.",charge:r?'Click an enemy within 12" to declare a charge, then roll 2D6.':"Charge — pick a unit to charge with."}[s.phase]||"":a||(v=""),yt("#hint").textContent=v,yt("#hint").style.display=v?"":"none",tl()}function Wd(){const i=Ri(),t=Ti(),e=ai(),n=Pt.sel,s=i?kn((r,o)=>{const a=o.phaseKey(r),c=new Map;for(const h of r.units)!o.alive(h)||h===n||(o.canAct(r,h)?c.set(h.id,["#ffffff",.75]):n&&a==="shoot"&&h.side!==n.side&&o.shotInfo(r,n,h).ok?c.set(h.id,["#ff5a4a",.95]):n&&a==="charge"&&h.side!==n.side&&o.chargeTargets(r,n).includes(h)&&c.set(h.id,["#ffa040",.95]));return c}):new Map;return r=>{var o;return r.id===(n==null?void 0:n.id)?["#ffe680",1]:t>=0&&r.u.side===t?["#ffffff",.5]:e&&r.id===e.tg.id?["#ffa040",.95]:s.has(r.id)?s.get(r.id):r.id===((o=Pt.hover)==null?void 0:o.id)?["#ffffff",.35]:["#ffffff",0]}}function tl(){he.paintRings(Wd())}async function Gd(i,t,e=-1){const n=yt("#banner");n.innerHTML=`<div class="b1">${i}</div><div class="b2">${t}</div>`,n.querySelector(".b1").style.color=Cd(e),n.classList.remove("show"),n.offsetWidth,n.classList.add("show");const s=xe.mirror;await Ln(Ar.phaseStart(mb(s.active),s.stage))}yt("#endPhase").onclick=()=>{if(Qo(),Re.click(),Ti()>=0){const i=si(Ti(),{t:"deployed"});return i||(Pt.sel=null,wi(null),Vn()),i}return Ri()?(Bn(null),si(oi(),{t:"end"})):"no phase of a seat played here to end now"};yt("#closestSpot").onclick=()=>(Re.click(),Sb());yt("#autoPhase").onclick=()=>Ri()?(Bn(null),si(oi(),{t:"auto"})):"no phase of a seat played here to play out now";yt("#advance").onclick=()=>{const i=Pt.sel;return!i||!Ri()?"no unit of a seat played here to advance now":Nd(i)};const tc=[1,2,4];yt("#speed").onclick=()=>{vn.speed=tc[(tc.indexOf(vn.speed)+1)%tc.length],yt("#speed").textContent=`⏩ ${vn.speed}×`};yt("#follow").onclick=()=>{Tn.follow=!Tn.follow,yt("#follow").classList.toggle("off",!Tn.follow)};yt("#mute").textContent=PM()?"🔇":"🔊";yt("#mute").onclick=()=>{Qo(),yt("#mute").textContent=CM()?"🔇":"🔊"};yt("#helpBtn").onclick=()=>yt("#help").classList.remove("hidden");yt("#helpClose").onclick=()=>yt("#help").classList.add("hidden");yt("#logToggle").onclick=()=>yt("#log").classList.toggle("collapsed");yt("#seed").value=Pt.seed;yt("#reroll").onclick=()=>{Pt.seed=Math.random()*1e6|0,yt("#seed").value=Pt.seed,ji(Pt.seed)};yt("#seed").onchange=()=>{const i=(Number(yt("#seed").value)||1)>>>0;ji(i),Pt.seed=i,yt("#seed").value=i};document.querySelectorAll("[data-mode]").forEach(i=>{i.onclick=()=>{Qo(),Re.click(),el(i.dataset.mode)}});yt("#again").onclick=()=>{yt("#over").classList.add("hidden"),yt("#title").classList.remove("hidden"),document.body.classList.remove("playing"),Tn.toTitle(),ji(Pt.seed)};addEventListener("keydown",i=>{i.target.tagName!=="INPUT"&&i.key==="Escape"&&!ai()&&Bn(null)});function ji(i,{terrain:t="classic",races:e=Jc}={}){const n=ld({board:i,dice:0,terrain:t,seats:e.map(s=>({race:s,ctrl:"human"}))},{out:null});ce==null||ce.close(),ce=null,le=null,Qn=n,Zc=!0,Td(Qc(e)),he.dispose(),dn.dispose(),Pt.sel=null,Pt.reach=null,Oo=null,Ns=!1,Eo=!1,qe.clear(),yt("#logList").innerHTML="",yt("#tray").classList.remove("show"),dn.sync(n.terrain.chunks),ta.scatterTufts(),xe.snap(n,$d(n)),Ed.reset(),Vn()}const $d=i=>({...xr(i),stage:"title"}),ec={bushtail:["human","ai"],serpent:["ai","human"],hotseat:["human","human"],watch:["ai","ai"]},Fo=i=>{const t=cd(i);return{board:t.board,terrain:t.terrain,races:t.seats.map(e=>e.race)}},Pb=(i,t)=>JSON.stringify(Fo(i))===JSON.stringify(Fo(t));function el(i){if(!Object.hasOwn(ec,i))throw new Error(`no mode "${i}" (there are ${Object.keys(ec).join(", ")})`);const t=ec[i];ce&&ji(Pt.seed);const e=(Number(Dn.get("dice"))||Math.random()*1e9|0)>>>0,n={board:Pt.seed,dice:e,terrain:"classic",rounds:js.classic.rounds,diceMode:"shared",seats:Jc.map((r,o)=>({race:r,ctrl:t[o]}))};(!Zc||!Pb(Qn.setup,n))&&ji(n.board,Fo(n)),Pt.control=[...t],Pt.sel=null,Pt.reach=null,Td(Qc(n.seats.map(r=>r.race))),Ne==null||Ne.begin(),xe.snap(Qn,$d(Qn));const s=new rM;if(ce=new sM({store:s,localSeats:t.flatMap((r,o)=>r==="human"?[o]:[]),sink:vb,onTrace:db}),s.append({s:-1,t:"start",setup:n}),ce.status==="refused"){const r=ce.error;throw ce.close(),ce=null,ji(Qn.setup.board,Fo(Qn.setup)),new Error(`the battle could not start: ${r}`)}yt("#title").classList.add("hidden"),document.body.classList.add("playing"),innerWidth<700&&yt("#log").classList.add("collapsed"),Tn.goTo(aM({localSeats:ce.localSeats,edges:[0,1].map(r=>jo(ce.G,r)),aspect:innerWidth/innerHeight})),Vn()}ji(Pt.seed);Js.run({parts:(i,t)=>{var e;ii.update(i),he.animate(i,t,{fast:wd,camera:Pr,sel:(e=Pt.sel)==null?void 0:e.id}),Ed.animate(i,t,xe.mirror.owners)},rig:Tn,shake:()=>ii.shake});Dn.has("watch")&&el("watch");if(Dn.has("debug")){const i=new Set(["stage","round","active","first","phase","vp","wiped"]),t=new Set(["titleSpin","titleAngle","viewShift","follow"]),e={busy:()=>!xe.idle,auto:()=>!xe.idle,deploySide:()=>Ti()<0?void 0:Ti()},n=[],s=[];let r=null;const o=()=>xe.idle&&!s.length,a=x=>{if(r)return r.turn[x];const A=Mn(),y=A.turn;return x==="stage"?le?y.stage==="over"&&!o()?"battle":y.stage:"title":x==="wiped"?y.wiped<0?void 0:y.wiped:x==="phase"?Rr(A):y[x]},c=new Proxy(Pt,{get:(x,A)=>i.has(A)?a(A):Object.hasOwn(e,A)?e[A]():t.has(A)?Tn[A]:x[A],has:(x,A)=>i.has(A)||Object.hasOwn(e,A)||t.has(A)||A in x,set:(x,A,y)=>{if(i.has(A))throw new Error(`__ts.S.${A} is the match's ${A==="phase"?"G.turn.ph (phaseKey)":`G.turn.${A}`}: it can't be set through S`);if(Object.hasOwn(e,A))throw new Error(`__ts.S.${A} is derived from the Session and the player: it can't be set`);return t.has(A)?Tn[A]=y:x[A]=y,!0},ownKeys:x=>[...new Set([...Reflect.ownKeys(x),...i,...Object.keys(e),...t])],getOwnPropertyDescriptor:(x,A)=>i.has(A)?{value:a(A),enumerable:!0,configurable:!0,writable:!1}:Object.hasOwn(e,A)?{value:e[A](),enumerable:!0,configurable:!0,writable:!1}:t.has(A)?{value:Tn[A],enumerable:!0,configurable:!0,writable:!0}:Reflect.getOwnPropertyDescriptor(x,A)}),h=x=>{var A;return!!((A=x.out)!=null&&A.length)||!xe.idle},l=(x,A)=>{const y=x.turn,S=/^over /.test(A)&&y.step==="score";return{turn:{stage:y.stage,round:S?y.round+1:y.round,active:y.active,phase:Rr(x),first:y.first,vp:[...y.vp],wiped:y.wiped<0?void 0:y.wiped},rng:zu(x.rng),units:x.units.map(U=>({...U,pos:{...U.pos},flags:{...U.flags},models:U.models.map(N=>({...N}))})),chunks:x.terrain.chunks.map(U=>({id:U.id,kind:U.kind,alive:U.alive,hp:U.hp,shape:{...U.shape}}))}},u=(x,A)=>{r=A;try{n.push(x)}finally{r=null}},f=[],d=[],g=(x=()=>!0)=>new Promise(A=>{d.push({until:x,resolve:A}),Ne.settled()});Ne={begin:()=>{n.length=0,s.length=0,f.length=0;for(const x of d.splice(0))x.resolve()},line:(x,A)=>{const y=/^log /.test(x)?null:l(A,x);/^(act|phase|over) /.test(x)&&f.push({at:A.out.length,proj:xr(A),act:/^act /.test(x)}),s.length||h(A)?s.push([x,y]):u(x,y)},reach:x=>{for(;n.length<x&&s.length;)u(...s.shift())},idle:()=>{for(;s.length;)u(...s.shift())},settled:()=>{if(xe.idle)for(const x of d.splice(0)){let A=!0;try{A=x.until()}catch{}A?x.resolve():d.push(x)}},present:(x,A)=>{const y=[],S=f.filter(N=>N.act).map(N=>N.proj);let U=0;for(x.forEach((N,$)=>{for(;U<f.length&&f[U].at<=$;)y.push({t:"check",proj:f[U++].proj});y.push(N.t==="act"?{...N,proj:S.shift()}:N)});U<f.length;)y.push({t:"check",proj:f[U++].proj});return y.push({t:"check",proj:xr(A)}),f.length=0,y}};const v=(x,A)=>{if(x)throw new Error(`?debug ${A}: ${x}`)},m=x=>hd(Mn(),x),p=()=>{const x=new yf,A=new Proxy({},{get:()=>()=>{}}),y={M:null},S=new yd({scene:x,labels:document.createElement("div"),fx:A,mirror:()=>y.M,colorOf:N=>be[N].color,W:Cr}),U={clear(){},held:()=>({marker:!1,thorns:0})};return{at:y,units:S,terrain:new _d(x,A),shots:U,effects:A}},_=(x,A,y)=>{x.at.M=y??xr(A);const S=y?A.terrain.chunks.filter(U=>y.chunks[U.id]).map(U=>({...U,alive:y.chunks[U.id].alive,shape:{...U.shape,y:y.chunks[U.id].y}})):A.terrain.chunks;return Id(A,x.at.M,{chunks:S,terrain:x.terrain,units:x.units,shots:x.shots,effects:x.effects}),x.units.paintRings(Wd()),x},M=(x,A,y,S)=>({units:S.units.map(U=>{const N=x.get(U.id);if(!N)return{id:U.id,view:null};const $=N.ring,I=N.hit;return{id:U.id,ring:$.visible?{x:$.position.x,z:$.position.z,s:$.scale.x,op:$.material.opacity,col:$.material.color.getHexString()}:null,hit:I.visible&&I.parent?{x:I.position.x,y:I.position.y,z:I.position.z,sx:I.scale.x,sy:I.scale.y}:null,figures:N.models.map(O=>{var W;return(W=O.mesh)!=null&&W.parent?{x:O.mesh.position.x,y:O.mesh.position.y,z:O.mesh.position.z}:null}),label:{html:N.label.innerHTML,display:N.label.style.display||""}}}),chunks:S.terrain.chunks.map(U=>({id:U.id,...A.state(U.id)})),shots:y.held()}),b=(x,A,y,S)=>{if(typeof x=="number"&&typeof A=="number")Math.abs(x-A)<=1e-6||S.push(`${y}: ${x} | ${A}`);else if(x&&A&&typeof x=="object"&&typeof A=="object"){const U=[...new Set([...Object.keys(x),...Object.keys(A)])];for(const N of U)b(x[N],A[N],`${y}.${N}`,S)}else x!==A&&S.push(`${y}: ${JSON.stringify(x)} | ${JSON.stringify(A)}`);return S};let C=null;const E=(x=null)=>{const A=Mn();if(!x&&!xe.idle)throw new Error("?debug view.snapDiff: the player is still playing");const y=M(he,dn,on,A),S=_(p(),A,x);C=_(C??p(),A,x);const U=[...b(y,M(S.units,S.terrain,S.shots,A),"fresh",[]),...b(y,M(C.units,C.terrain,C.shots,A),"kept",[])];return S.units.dispose(),S.terrain.dispose(),{diffs:U.slice(0,12),n:U.length,units:y.units.length,figures:y.units.reduce((N,$)=>{var I;return N+(((I=$.figures)==null?void 0:I.filter(Boolean).length)??0)},0),chunks:y.chunks.length,shown:y.chunks.filter(N=>N.shown).length}};window.__ts={S:c,clock:vn,camera:Pr,controls:ub,renderer:ss,trace:n,get G(){return le},get session(){return ce},get player(){return xe},present:{listen(x){xe.observer=x},card(x){var A;return wi(x),((A=/class="card-sub">([^<]*)</.exec(yt("#card").innerHTML))==null?void 0:A[1])??null}},get units(){return r?r.units:Mn().units},get nav(){return Mn().nav},scenery:{get chunks(){return r?r.chunks:Mn().terrain.chunks},scene:In,blast(x,A,y,S,U){if(le)throw new Error("?debug scenery.blast: only on the title screen (no battle)");const N=[],$=Qn.terrain.blast(x,A,y,S,U,N);return Zc=!1,xe.push(N),ns(Qn),$}},validEnd:(x,A)=>m(y=>rb(y,x,A)),get phaseResolve(){return Ri()||null},get chargePick(){const x=ai();return x&&{u:x.u,plan:x.plan,ok:x.ok}},start:el,select:Bn,doMove:(x,A)=>(v(Ud(x,A),"doMove"),g()),doAdvance:x=>(v(Nd(x),"doAdvance"),g()),doShoot:(x,A)=>(v(zd(x,A),"doShoot"),g()),doCharge:(x,A)=>{v(Od(x,A),"doCharge");const y=ce;return g(()=>{var S;return y!==ce||((S=y.G.pending)==null?void 0:S.k)!=="chargeEnd"})},placeCharge:x=>(v(Fd(x),"placeCharge"),g()),deployClick:(x,A)=>v(Hd(x,A),"deployClick"),endPhase:()=>(v(yt("#endPhase").onclick(),"endPhase"),g()),autoPhase:()=>(v(yt("#autoPhase").onclick(),"autoPhase"),g()),q:{alive:tb,isEngaged:x=>m(A=>eb(A,x)),canAct:x=>m(A=>ib(A,x)),movePlan:(x,A)=>m(y=>sb(y,x,A)),freeSpot:(x,A,y,S,U)=>m(N=>ob(N,x,A,y,S,U)),shootTargets:x=>m(A=>cb(A,x)),shotInfo:(x,A)=>m(y=>ab(y,x,A)),chargeTargets:x=>m(A=>lb(A,x)),chargePlan:(x,A)=>m(y=>hb(y,x,A)),rngState:()=>r?r.rng:zu(Mn().rng)},screen(x,A,y){const S=new P(x,A,y).project(Pr);return[(S.x*.5+.5)*innerWidth,(-S.y*.5+.5)*innerHeight]},view:{snapDiff:E,pauseAtChecks(x){wo=x},counts:()=>{let x=0;return In.traverse(A=>A.userData.fig&&x++),{scene:In.children.length,terrain:dn.group.children.length,figures:x,labels:Js.overlay.children.length,marks:ii.decals.length}}}}}
