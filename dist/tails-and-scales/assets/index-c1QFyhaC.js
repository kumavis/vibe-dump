(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ic="160",ii={ROTATE:0,DOLLY:1,PAN:2},ps={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},tp=0,yl=1,ep=2,ju=1,qu=2,ni=3,Pi=0,cn=1,_n=2,Si=0,Vs=1,bl=2,Sl=3,El=4,np=5,qi=100,ip=101,sp=102,wl=103,Tl=104,rp=200,op=201,ap=202,cp=203,uc=204,fc=205,lp=206,hp=207,up=208,fp=209,dp=210,pp=211,mp=212,gp=213,_p=214,vp=0,xp=1,Mp=2,Fo=3,yp=4,bp=5,Sp=6,Ep=7,Uc=0,wp=1,Tp=2,Ei=0,Ap=1,Rp=2,Cp=3,Yu=4,Pp=5,Lp=6,Ku=300,qs=301,Ys=302,dc=303,pc=304,Qo=306,ko=1e3,Pn=1001,mc=1002,Ge=1003,Al=1004,xa=1005,on=1006,Dp=1007,Dr=1008,wi=1009,Ip=1010,Up=1011,Nc=1012,Ju=1013,yi=1014,bi=1015,Ir=1016,Zu=1017,Qu=1018,Ki=1020,Np=1021,bn=1023,zp=1024,Op=1025,Ji=1026,Ks=1027,Fp=1028,tf=1029,kp=1030,ef=1031,nf=1033,Ma=33776,ya=33777,ba=33778,Sa=33779,Rl=35840,Cl=35841,Pl=35842,Ll=35843,sf=36196,Dl=37492,Il=37496,Ul=37808,Nl=37809,zl=37810,Ol=37811,Fl=37812,kl=37813,Bl=37814,Hl=37815,Vl=37816,Wl=37817,Gl=37818,$l=37819,Xl=37820,jl=37821,Ea=36492,ql=36494,Yl=36495,Bp=36283,Kl=36284,Jl=36285,Zl=36286,rf=3e3,Zi=3001,Hp=3200,Vp=3201,zc=0,Wp=1,Sn="",Le="srgb",li="srgb-linear",Oc="display-p3",ta="display-p3-linear",Bo="linear",fe="srgb",Ho="rec709",Vo="p3",ms=7680,Ql=519,Gp=512,$p=513,Xp=514,of=515,jp=516,qp=517,Yp=518,Kp=519,th=35044,Jp=35048,eh="300 es",gc=1035,oi=2e3,Wo=2001;class as{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Do=Math.PI/180,_c=180/Math.PI;function Xr(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[i&255]+Xe[i>>8&255]+Xe[i>>16&255]+Xe[i>>24&255]).toLowerCase()}function Fe(n,t,e){return Math.max(t,Math.min(e,n))}function Zp(n,t){return(n%t+t)%t}function wa(n,t,e){return(1-e)*n+e*t}function nh(n){return(n&n-1)===0&&n!==0}function vc(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function dr(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function rn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Qp={DEG2RAD:Do};class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Fe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jt{constructor(t,e,i,s,r,o,a,c,l){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,c,l)}set(t,e,i,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=i,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],m=i[5],g=i[8],_=s[0],p=s[3],f=s[6],v=s[1],x=s[4],M=s[7],R=s[2],E=s[5],T=s[8];return r[0]=o*_+a*v+c*R,r[3]=o*p+a*x+c*E,r[6]=o*f+a*M+c*T,r[1]=l*_+h*v+u*R,r[4]=l*p+h*x+u*E,r[7]=l*f+h*M+u*T,r[2]=d*_+m*v+g*R,r[5]=d*p+m*x+g*E,r[8]=d*f+m*M+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-i*r*h+i*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,m=l*r-o*c,g=e*u+i*d+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*l-h*i)*_,t[2]=(a*i-s*o)*_,t[3]=d*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-a*e)*_,t[6]=m*_,t[7]=(i*c-l*e)*_,t[8]=(o*e-i*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ta.makeScale(t,e)),this}rotate(t){return this.premultiply(Ta.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ta.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ta=new Jt;function af(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Go(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function tm(){const n=Go("canvas");return n.style.display="block",n}const ih={};function Tr(n){n in ih||(ih[n]=!0,console.warn(n))}const sh=new Jt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),rh=new Jt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),no={[li]:{transfer:Bo,primaries:Ho,toReference:n=>n,fromReference:n=>n},[Le]:{transfer:fe,primaries:Ho,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[ta]:{transfer:Bo,primaries:Vo,toReference:n=>n.applyMatrix3(rh),fromReference:n=>n.applyMatrix3(sh)},[Oc]:{transfer:fe,primaries:Vo,toReference:n=>n.convertSRGBToLinear().applyMatrix3(rh),fromReference:n=>n.applyMatrix3(sh).convertLinearToSRGB()}},em=new Set([li,ta]),le={enabled:!0,_workingColorSpace:li,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!em.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;const i=no[t].toReference,s=no[e].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return no[n].primaries},getTransfer:function(n){return n===Sn?Bo:no[n].transfer}};function Ws(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Aa(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let gs;class cf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{gs===void 0&&(gs=Go("canvas")),gs.width=t.width,gs.height=t.height;const i=gs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=gs}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Go("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ws(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Ws(e[i]/255)*255):e[i]=Ws(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let nm=0;class lf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nm++}),this.uuid=Xr(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ra(s[o].image)):r.push(Ra(s[o]))}else r=Ra(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function Ra(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?cf.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let im=0;class en extends as{constructor(t=en.DEFAULT_IMAGE,e=en.DEFAULT_MAPPING,i=Pn,s=Pn,r=on,o=Dr,a=bn,c=wi,l=en.DEFAULT_ANISOTROPY,h=Sn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:im++}),this.uuid=Xr(),this.name="",this.source=new lf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Tr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Zi?Le:Sn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ku)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ko:t.x=t.x-Math.floor(t.x);break;case Pn:t.x=t.x<0?0:1;break;case mc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ko:t.y=t.y-Math.floor(t.y);break;case Pn:t.y=t.y<0?0:1;break;case mc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Tr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Le?Zi:rf}set encoding(t){Tr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Zi?Le:Sn}}en.DEFAULT_IMAGE=null;en.DEFAULT_MAPPING=Ku;en.DEFAULT_ANISOTROPY=1;class me{constructor(t=0,e=0,i=0,s=1){me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],m=c[5],g=c[9],_=c[2],p=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+p)<.1&&Math.abs(l+m+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,M=(m+1)/2,R=(f+1)/2,E=(h+d)/4,T=(u+_)/4,U=(g+p)/4;return x>M&&x>R?x<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(x),s=E/i,r=T/i):M>R?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=E/s,r=U/s):R<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),i=T/r,s=U/r),this.set(i,s,r,e),this}let v=Math.sqrt((p-g)*(p-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(p-g)/v,this.y=(u-_)/v,this.z=(d-h)/v,this.w=Math.acos((l+m+f-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class sm extends as{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new me(0,0,t,e),this.scissorTest=!1,this.viewport=new me(0,0,t,e);const s={width:t,height:e,depth:1};i.encoding!==void 0&&(Tr("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Zi?Le:Sn),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new en(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(t,e,i=1){(this.width!==t||this.height!==e||this.depth!==i)&&(this.width=t,this.height=e,this.depth=i,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new lf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class is extends sm{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class hf extends en{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class rm extends en{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class kn{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3];const d=r[o+0],m=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=m,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||l!==m||h!==g){let p=1-a;const f=c*d+l*m+h*g+u*_,v=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){const R=Math.sqrt(x),E=Math.atan2(R,f*v);p=Math.sin(p*E)/R,a=Math.sin(a*E)/R}const M=a*v;if(c=c*p+d*M,l=l*p+m*M,h=h*p+g*M,u=u*p+_*M,p===1-a){const R=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=R,l*=R,h*=R,u*=R}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,o){const a=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[o],d=r[o+1],m=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*m-l*d,t[e+1]=c*g+h*d+l*u-a*m,t[e+2]=l*g+h*m+a*d-c*u,t[e+3]=h*g-a*u-c*d-l*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(i/2),h=a(s/2),u=a(r/2),d=c(i/2),m=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u-d*m*g;break;case"YXZ":this._x=d*h*u+l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u+d*m*g;break;case"ZXY":this._x=d*h*u-l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u-d*m*g;break;case"ZYX":this._x=d*h*u-l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u+d*m*g;break;case"YZX":this._x=d*h*u+l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u-d*m*g;break;case"XZY":this._x=d*h*u-l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=i+a+u;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-c)*m,this._y=(r-l)*m,this._z=(o-s)*m}else if(i>a&&i>u){const m=2*Math.sqrt(1+i-a-u);this._w=(h-c)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+l)/m}else if(a>u){const m=2*Math.sqrt(1+a-i-u);this._w=(r-l)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(c+h)/m}else{const m=2*Math.sqrt(1+u-i-a);this._w=(o-s)/m,this._x=(r+l)/m,this._y=(c+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Fe(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-i*l,this._z=r*h+o*l+i*c-s*a,this._w=o*h-i*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+i*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-e;return this._w=m*o+e*this._w,this._x=m*i+e*this._x,this._y=m*s+e*this._y,this._z=m*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=Math.random(),e=Math.sqrt(1-t),i=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),i*Math.sin(r),i*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,i=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(oh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(oh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*i),h=2*(a*e-r*s),u=2*(r*i-o*e);return this.x=e+c*l+o*u-a*h,this.y=i+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Ca.copy(this).projectOnVector(t),this.sub(Ca)}reflect(t){return this.sub(Ca.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Fe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,i=Math.sqrt(1-t**2);return this.x=i*Math.cos(e),this.y=i*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ca=new C,oh=new kn;class cs{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(wn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(wn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=wn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,wn):wn.fromBufferAttribute(r,o),wn.applyMatrix4(t.matrixWorld),this.expandByPoint(wn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),io.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),io.copy(i.boundingBox)),io.applyMatrix4(t.matrixWorld),this.union(io)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,wn),wn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(pr),so.subVectors(this.max,pr),_s.subVectors(t.a,pr),vs.subVectors(t.b,pr),xs.subVectors(t.c,pr),di.subVectors(vs,_s),pi.subVectors(xs,vs),ki.subVectors(_s,xs);let e=[0,-di.z,di.y,0,-pi.z,pi.y,0,-ki.z,ki.y,di.z,0,-di.x,pi.z,0,-pi.x,ki.z,0,-ki.x,-di.y,di.x,0,-pi.y,pi.x,0,-ki.y,ki.x,0];return!Pa(e,_s,vs,xs,so)||(e=[1,0,0,0,1,0,0,0,1],!Pa(e,_s,vs,xs,so))?!1:(ro.crossVectors(di,pi),e=[ro.x,ro.y,ro.z],Pa(e,_s,vs,xs,so))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,wn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(wn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Kn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Kn=[new C,new C,new C,new C,new C,new C,new C,new C],wn=new C,io=new cs,_s=new C,vs=new C,xs=new C,di=new C,pi=new C,ki=new C,pr=new C,so=new C,ro=new C,Bi=new C;function Pa(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Bi.fromArray(n,r);const a=s.x*Math.abs(Bi.x)+s.y*Math.abs(Bi.y)+s.z*Math.abs(Bi.z),c=t.dot(Bi),l=e.dot(Bi),h=i.dot(Bi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const om=new cs,mr=new C,La=new C;class sr{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):om.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;mr.subVectors(t,this.center);const e=mr.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(mr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(La.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(mr.copy(t.center).add(La)),this.expandByPoint(mr.copy(t.center).sub(La))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Jn=new C,Da=new C,oo=new C,mi=new C,Ia=new C,ao=new C,Ua=new C;class ea{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Jn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Jn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Jn.copy(this.origin).addScaledVector(this.direction,e),Jn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Da.copy(t).add(e).multiplyScalar(.5),oo.copy(e).sub(t).normalize(),mi.copy(this.origin).sub(Da);const r=t.distanceTo(e)*.5,o=-this.direction.dot(oo),a=mi.dot(this.direction),c=-mi.dot(oo),l=mi.lengthSq(),h=Math.abs(1-o*o);let u,d,m,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,m=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),m=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),m=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),m=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Da).addScaledVector(oo,d),m}intersectSphere(t,e){Jn.subVectors(t.center,this.origin);const i=Jn.dot(this.direction),s=Jn.dot(Jn)-i*i,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Jn)!==null}intersectTriangle(t,e,i,s,r){Ia.subVectors(e,t),ao.subVectors(i,t),Ua.crossVectors(Ia,ao);let o=this.direction.dot(Ua),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;mi.subVectors(this.origin,t);const c=a*this.direction.dot(ao.crossVectors(mi,ao));if(c<0)return null;const l=a*this.direction.dot(Ia.cross(mi));if(l<0||c+l>o)return null;const h=-a*mi.dot(Ua);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ae{constructor(t,e,i,s,r,o,a,c,l,h,u,d,m,g,_,p){ae.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,c,l,h,u,d,m,g,_,p)}set(t,e,i,s,r,o,a,c,l,h,u,d,m,g,_,p){const f=this.elements;return f[0]=t,f[4]=e,f[8]=i,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=m,f[7]=g,f[11]=_,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ae().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Ms.setFromMatrixColumn(t,0).length(),r=1/Ms.setFromMatrixColumn(t,1).length(),o=1/Ms.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,m=o*u,g=a*h,_=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=m+g*l,e[5]=d-_*l,e[9]=-a*c,e[2]=_-d*l,e[6]=g+m*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*h,m=c*u,g=l*h,_=l*u;e[0]=d+_*a,e[4]=g*a-m,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=m*a-g,e[6]=_+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*h,m=c*u,g=l*h,_=l*u;e[0]=d-_*a,e[4]=-o*u,e[8]=g+m*a,e[1]=m+g*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*h,m=o*u,g=a*h,_=a*u;e[0]=c*h,e[4]=g*l-m,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=m*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,m=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=_-d*u,e[8]=g*u+m,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=m*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=o*c,m=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=o*h,e[9]=m*u-g,e[2]=g*u-m,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(am,t,cm)}lookAt(t,e,i){const s=this.elements;return dn.subVectors(t,e),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),gi.crossVectors(i,dn),gi.lengthSq()===0&&(Math.abs(i.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),gi.crossVectors(i,dn)),gi.normalize(),co.crossVectors(dn,gi),s[0]=gi.x,s[4]=co.x,s[8]=dn.x,s[1]=gi.y,s[5]=co.y,s[9]=dn.y,s[2]=gi.z,s[6]=co.z,s[10]=dn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],m=i[13],g=i[2],_=i[6],p=i[10],f=i[14],v=i[3],x=i[7],M=i[11],R=i[15],E=s[0],T=s[4],U=s[8],y=s[12],S=s[1],B=s[5],H=s[9],Y=s[13],D=s[2],O=s[6],W=s[10],j=s[14],$=s[3],X=s[7],q=s[11],rt=s[15];return r[0]=o*E+a*S+c*D+l*$,r[4]=o*T+a*B+c*O+l*X,r[8]=o*U+a*H+c*W+l*q,r[12]=o*y+a*Y+c*j+l*rt,r[1]=h*E+u*S+d*D+m*$,r[5]=h*T+u*B+d*O+m*X,r[9]=h*U+u*H+d*W+m*q,r[13]=h*y+u*Y+d*j+m*rt,r[2]=g*E+_*S+p*D+f*$,r[6]=g*T+_*B+p*O+f*X,r[10]=g*U+_*H+p*W+f*q,r[14]=g*y+_*Y+p*j+f*rt,r[3]=v*E+x*S+M*D+R*$,r[7]=v*T+x*B+M*O+R*X,r[11]=v*U+x*H+M*W+R*q,r[15]=v*y+x*Y+M*j+R*rt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],m=t[14],g=t[3],_=t[7],p=t[11],f=t[15];return g*(+r*c*u-s*l*u-r*a*d+i*l*d+s*a*m-i*c*m)+_*(+e*c*m-e*l*d+r*o*d-s*o*m+s*l*h-r*c*h)+p*(+e*l*u-e*a*m-r*o*u+i*o*m+r*a*h-i*l*h)+f*(-s*a*h-e*c*u+e*a*d+s*o*u-i*o*d+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],m=t[11],g=t[12],_=t[13],p=t[14],f=t[15],v=u*p*l-_*d*l+_*c*m-a*p*m-u*c*f+a*d*f,x=g*d*l-h*p*l-g*c*m+o*p*m+h*c*f-o*d*f,M=h*_*l-g*u*l+g*a*m-o*_*m-h*a*f+o*u*f,R=g*u*c-h*_*c-g*a*d+o*_*d+h*a*p-o*u*p,E=e*v+i*x+s*M+r*R;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/E;return t[0]=v*T,t[1]=(_*d*r-u*p*r-_*s*m+i*p*m+u*s*f-i*d*f)*T,t[2]=(a*p*r-_*c*r+_*s*l-i*p*l-a*s*f+i*c*f)*T,t[3]=(u*c*r-a*d*r-u*s*l+i*d*l+a*s*m-i*c*m)*T,t[4]=x*T,t[5]=(h*p*r-g*d*r+g*s*m-e*p*m-h*s*f+e*d*f)*T,t[6]=(g*c*r-o*p*r-g*s*l+e*p*l+o*s*f-e*c*f)*T,t[7]=(o*d*r-h*c*r+h*s*l-e*d*l-o*s*m+e*c*m)*T,t[8]=M*T,t[9]=(g*u*r-h*_*r-g*i*m+e*_*m+h*i*f-e*u*f)*T,t[10]=(o*_*r-g*a*r+g*i*l-e*_*l-o*i*f+e*a*f)*T,t[11]=(h*a*r-o*u*r-h*i*l+e*u*l+o*i*m-e*a*m)*T,t[12]=R*T,t[13]=(h*_*s-g*u*s+g*i*d-e*_*d-h*i*p+e*u*p)*T,t[14]=(g*a*s-o*_*s-g*i*c+e*_*c+o*i*p-e*a*p)*T,t[15]=(o*u*s-h*a*s+h*i*c-e*u*c-o*i*d+e*a*d)*T,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+i,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+i,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,m=r*h,g=r*u,_=o*h,p=o*u,f=a*u,v=c*l,x=c*h,M=c*u,R=i.x,E=i.y,T=i.z;return s[0]=(1-(_+f))*R,s[1]=(m+M)*R,s[2]=(g-x)*R,s[3]=0,s[4]=(m-M)*E,s[5]=(1-(d+f))*E,s[6]=(p+v)*E,s[7]=0,s[8]=(g+x)*T,s[9]=(p-v)*T,s[10]=(1-(d+_))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let r=Ms.set(s[0],s[1],s[2]).length();const o=Ms.set(s[4],s[5],s[6]).length(),a=Ms.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Tn.copy(this);const l=1/r,h=1/o,u=1/a;return Tn.elements[0]*=l,Tn.elements[1]*=l,Tn.elements[2]*=l,Tn.elements[4]*=h,Tn.elements[5]*=h,Tn.elements[6]*=h,Tn.elements[8]*=u,Tn.elements[9]*=u,Tn.elements[10]*=u,e.setFromRotationMatrix(Tn),i.x=r,i.y=o,i.z=a,this}makePerspective(t,e,i,s,r,o,a=oi){const c=this.elements,l=2*r/(e-t),h=2*r/(i-s),u=(e+t)/(e-t),d=(i+s)/(i-s);let m,g;if(a===oi)m=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Wo)m=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=oi){const c=this.elements,l=1/(e-t),h=1/(i-s),u=1/(o-r),d=(e+t)*l,m=(i+s)*h;let g,_;if(a===oi)g=(o+r)*u,_=-2*u;else if(a===Wo)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ms=new C,Tn=new ae,am=new C(0,0,0),cm=new C(1,1,1),gi=new C,co=new C,dn=new C,ah=new ae,ch=new kn;class rr{constructor(t=0,e=0,i=0,s=rr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(Fe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Fe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Fe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Fe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Fe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Fe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return ah.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ah,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ch.setFromEuler(this),this.setFromQuaternion(ch,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}rr.DEFAULT_ORDER="XYZ";class Fc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let lm=0;const lh=new C,ys=new kn,Zn=new ae,lo=new C,gr=new C,hm=new C,um=new kn,hh=new C(1,0,0),uh=new C(0,1,0),fh=new C(0,0,1),fm={type:"added"},dm={type:"removed"};class Be extends as{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lm++}),this.uuid=Xr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Be.DEFAULT_UP.clone();const t=new C,e=new rr,i=new kn,s=new C(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new Jt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=Be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Fc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ys.setFromAxisAngle(t,e),this.quaternion.multiply(ys),this}rotateOnWorldAxis(t,e){return ys.setFromAxisAngle(t,e),this.quaternion.premultiply(ys),this}rotateX(t){return this.rotateOnAxis(hh,t)}rotateY(t){return this.rotateOnAxis(uh,t)}rotateZ(t){return this.rotateOnAxis(fh,t)}translateOnAxis(t,e){return lh.copy(t).applyQuaternion(this.quaternion),this.position.add(lh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(hh,t)}translateY(t){return this.translateOnAxis(uh,t)}translateZ(t){return this.translateOnAxis(fh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Zn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?lo.copy(t):lo.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zn.lookAt(gr,lo,this.up):Zn.lookAt(lo,gr,this.up),this.quaternion.setFromRotationMatrix(Zn),s&&(Zn.extractRotation(s.matrixWorld),ys.setFromRotationMatrix(Zn),this.quaternion.premultiply(ys.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(fm)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(dm)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Zn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Zn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Zn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gr,t,hm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gr,um,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++){const r=e[i];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),m=o(t.animations),g=o(t.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),m.length>0&&(i.animations=m),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Be.DEFAULT_UP=new C(0,1,0);Be.DEFAULT_MATRIX_AUTO_UPDATE=!0;Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const An=new C,Qn=new C,Na=new C,ti=new C,bs=new C,Ss=new C,dh=new C,za=new C,Oa=new C,Fa=new C;let ho=!1;class Cn{constructor(t=new C,e=new C,i=new C){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),An.subVectors(t,e),s.cross(An);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){An.subVectors(s,e),Qn.subVectors(i,e),Na.subVectors(t,e);const o=An.dot(An),a=An.dot(Qn),c=An.dot(Na),l=Qn.dot(Qn),h=Qn.dot(Na),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,m=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-m-g,g,m)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,ti)===null?!1:ti.x>=0&&ti.y>=0&&ti.x+ti.y<=1}static getUV(t,e,i,s,r,o,a,c){return ho===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ho=!0),this.getInterpolation(t,e,i,s,r,o,a,c)}static getInterpolation(t,e,i,s,r,o,a,c){return this.getBarycoord(t,e,i,s,ti)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ti.x),c.addScaledVector(o,ti.y),c.addScaledVector(a,ti.z),c)}static isFrontFacing(t,e,i,s){return An.subVectors(i,e),Qn.subVectors(t,e),An.cross(Qn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return An.subVectors(this.c,this.b),Qn.subVectors(this.a,this.b),An.cross(Qn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Cn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Cn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,i,s,r){return ho===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ho=!0),Cn.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}getInterpolation(t,e,i,s,r){return Cn.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return Cn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Cn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let o,a;bs.subVectors(s,i),Ss.subVectors(r,i),za.subVectors(t,i);const c=bs.dot(za),l=Ss.dot(za);if(c<=0&&l<=0)return e.copy(i);Oa.subVectors(t,s);const h=bs.dot(Oa),u=Ss.dot(Oa);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(i).addScaledVector(bs,o);Fa.subVectors(t,r);const m=bs.dot(Fa),g=Ss.dot(Fa);if(g>=0&&m<=g)return e.copy(r);const _=m*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(i).addScaledVector(Ss,a);const p=h*g-m*u;if(p<=0&&u-h>=0&&m-g>=0)return dh.subVectors(r,s),a=(u-h)/(u-h+(m-g)),e.copy(s).addScaledVector(dh,a);const f=1/(p+_+d);return o=_*f,a=d*f,e.copy(i).addScaledVector(bs,o).addScaledVector(Ss,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const uf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},uo={h:0,s:0,l:0};function ka(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class jt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Le){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=le.workingColorSpace){return this.r=t,this.g=e,this.b=i,le.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=le.workingColorSpace){if(t=Zp(t,1),e=Fe(e,0,1),i=Fe(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=ka(o,r,t+1/3),this.g=ka(o,r,t),this.b=ka(o,r,t-1/3)}return le.toWorkingColorSpace(this,s),this}setStyle(t,e=Le){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Le){const i=uf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ws(t.r),this.g=Ws(t.g),this.b=Ws(t.b),this}copyLinearToSRGB(t){return this.r=Aa(t.r),this.g=Aa(t.g),this.b=Aa(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Le){return le.fromWorkingColorSpace(je.copy(this),t),Math.round(Fe(je.r*255,0,255))*65536+Math.round(Fe(je.g*255,0,255))*256+Math.round(Fe(je.b*255,0,255))}getHexString(t=Le){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.fromWorkingColorSpace(je.copy(this),e);const i=je.r,s=je.g,r=je.b,o=Math.max(i,s,r),a=Math.min(i,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=le.workingColorSpace){return le.fromWorkingColorSpace(je.copy(this),e),t.r=je.r,t.g=je.g,t.b=je.b,t}getStyle(t=Le){le.fromWorkingColorSpace(je.copy(this),t);const e=je.r,i=je.g,s=je.b;return t!==Le?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(_i),this.setHSL(_i.h+t,_i.s+e,_i.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(_i),t.getHSL(uo);const i=wa(_i.h,uo.h,e),s=wa(_i.s,uo.s,e),r=wa(_i.l,uo.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const je=new jt;jt.NAMES=uf;let pm=0;class ls extends as{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:pm++}),this.uuid=Xr(),this.name="",this.type="Material",this.blending=Vs,this.side=Pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=uc,this.blendDst=fc,this.blendEquation=qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new jt(0,0,0),this.blendAlpha=0,this.depthFunc=Fo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ql,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ms,this.stencilZFail=ms,this.stencilZPass=ms,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Vs&&(i.blending=this.blending),this.side!==Pi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==uc&&(i.blendSrc=this.blendSrc),this.blendDst!==fc&&(i.blendDst=this.blendDst),this.blendEquation!==qi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Fo&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ql&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ms&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ms&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ms&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ze extends ls{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ce=new C,fo=new ht;class xn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=th,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=bi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)fo.fromBufferAttribute(this,e),fo.applyMatrix3(t),this.setXY(e,fo.x,fo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix3(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix4(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyNormalMatrix(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.transformDirection(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=dr(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=rn(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=dr(e,this.array)),e}setX(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=dr(e,this.array)),e}setY(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=dr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=dr(e,this.array)),e}setW(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array),s=rn(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array),s=rn(s,this.array),r=rn(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==th&&(t.usage=this.usage),t}}class ff extends xn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class df extends xn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class se extends xn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let mm=0;const yn=new ae,Ba=new Be,Es=new C,pn=new cs,_r=new cs,Oe=new C;class Ae extends as{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mm++}),this.uuid=Xr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(af(t)?df:ff)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Jt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return yn.makeRotationFromQuaternion(t),this.applyMatrix4(yn),this}rotateX(t){return yn.makeRotationX(t),this.applyMatrix4(yn),this}rotateY(t){return yn.makeRotationY(t),this.applyMatrix4(yn),this}rotateZ(t){return yn.makeRotationZ(t),this.applyMatrix4(yn),this}translate(t,e,i){return yn.makeTranslation(t,e,i),this.applyMatrix4(yn),this}scale(t,e,i){return yn.makeScale(t,e,i),this.applyMatrix4(yn),this}lookAt(t){return Ba.lookAt(t),Ba.updateMatrix(),this.applyMatrix4(Ba.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Es).negate(),this.translate(Es.x,Es.y,Es.z),this}setFromPoints(t){const e=[];for(let i=0,s=t.length;i<s;i++){const r=t[i];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new se(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new cs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];pn.setFromBufferAttribute(r),this.morphTargetsRelative?(Oe.addVectors(this.boundingBox.min,pn.min),this.boundingBox.expandByPoint(Oe),Oe.addVectors(this.boundingBox.max,pn.max),this.boundingBox.expandByPoint(Oe)):(this.boundingBox.expandByPoint(pn.min),this.boundingBox.expandByPoint(pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new sr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new C,1/0);return}if(t){const i=this.boundingSphere.center;if(pn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];_r.setFromBufferAttribute(a),this.morphTargetsRelative?(Oe.addVectors(pn.min,_r.min),pn.expandByPoint(Oe),Oe.addVectors(pn.max,_r.max),pn.expandByPoint(Oe)):(pn.expandByPoint(_r.min),pn.expandByPoint(_r.max))}pn.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)Oe.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Oe));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Oe.fromBufferAttribute(a,l),c&&(Es.fromBufferAttribute(t,l),Oe.add(Es)),s=Math.max(s,i.distanceToSquared(Oe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new xn(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let S=0;S<a;S++)l[S]=new C,h[S]=new C;const u=new C,d=new C,m=new C,g=new ht,_=new ht,p=new ht,f=new C,v=new C;function x(S,B,H){u.fromArray(s,S*3),d.fromArray(s,B*3),m.fromArray(s,H*3),g.fromArray(o,S*2),_.fromArray(o,B*2),p.fromArray(o,H*2),d.sub(u),m.sub(u),_.sub(g),p.sub(g);const Y=1/(_.x*p.y-p.x*_.y);isFinite(Y)&&(f.copy(d).multiplyScalar(p.y).addScaledVector(m,-_.y).multiplyScalar(Y),v.copy(m).multiplyScalar(_.x).addScaledVector(d,-p.x).multiplyScalar(Y),l[S].add(f),l[B].add(f),l[H].add(f),h[S].add(v),h[B].add(v),h[H].add(v))}let M=this.groups;M.length===0&&(M=[{start:0,count:i.length}]);for(let S=0,B=M.length;S<B;++S){const H=M[S],Y=H.start,D=H.count;for(let O=Y,W=Y+D;O<W;O+=3)x(i[O+0],i[O+1],i[O+2])}const R=new C,E=new C,T=new C,U=new C;function y(S){T.fromArray(r,S*3),U.copy(T);const B=l[S];R.copy(B),R.sub(T.multiplyScalar(T.dot(B))).normalize(),E.crossVectors(U,B);const Y=E.dot(h[S])<0?-1:1;c[S*4]=R.x,c[S*4+1]=R.y,c[S*4+2]=R.z,c[S*4+3]=Y}for(let S=0,B=M.length;S<B;++S){const H=M[S],Y=H.start,D=H.count;for(let O=Y,W=Y+D;O<W;O+=3)y(i[O+0]),y(i[O+1]),y(i[O+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new xn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,m=i.count;d<m;d++)i.setXYZ(d,0,0,0);const s=new C,r=new C,o=new C,a=new C,c=new C,l=new C,h=new C,u=new C;if(t)for(let d=0,m=t.count;d<m;d+=3){const g=t.getX(d+0),_=t.getX(d+1),p=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,p),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,p),a.add(h),c.add(h),l.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,m=e.count;d<m;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Oe.fromBufferAttribute(t,e),Oe.normalize(),t.setXYZ(e,Oe.x,Oe.y,Oe.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let m=0,g=0;for(let _=0,p=c.length;_<p;_++){a.isInterleavedBufferAttribute?m=c[_]*a.data.stride+a.offset:m=c[_]*h;for(let f=0;f<h;f++)d[g++]=l[m++]}return new xn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ae,i=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,i);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],m=t(d,i);c.push(m)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const m=l[u];h.push(m.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,m=u.length;d<m;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ph=new ae,Hi=new ea,po=new sr,mh=new C,ws=new C,Ts=new C,As=new C,Ha=new C,mo=new C,go=new ht,_o=new ht,vo=new ht,gh=new C,_h=new C,vh=new C,xo=new C,Mo=new C;class Ht extends Be{constructor(t=new Ae,e=new Ze){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){mo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(Ha.fromBufferAttribute(u,t),o?mo.addScaledVector(Ha,h):mo.addScaledVector(Ha.sub(e),h))}e.add(mo)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),po.copy(i.boundingSphere),po.applyMatrix4(r),Hi.copy(t.ray).recast(t.near),!(po.containsPoint(Hi.origin)===!1&&(Hi.intersectSphere(po,mh)===null||Hi.origin.distanceToSquared(mh)>(t.far-t.near)**2))&&(ph.copy(r).invert(),Hi.copy(t.ray).applyMatrix4(ph),!(i.boundingBox!==null&&Hi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Hi)))}_computeIntersections(t,e,i){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const p=d[g],f=o[p.materialIndex],v=Math.max(p.start,m.start),x=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let M=v,R=x;M<R;M+=3){const E=a.getX(M),T=a.getX(M+1),U=a.getX(M+2);s=yo(this,f,t,i,l,h,u,E,T,U),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(a.count,m.start+m.count);for(let p=g,f=_;p<f;p+=3){const v=a.getX(p),x=a.getX(p+1),M=a.getX(p+2);s=yo(this,o,t,i,l,h,u,v,x,M),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const p=d[g],f=o[p.materialIndex],v=Math.max(p.start,m.start),x=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let M=v,R=x;M<R;M+=3){const E=M,T=M+1,U=M+2;s=yo(this,f,t,i,l,h,u,E,T,U),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(c.count,m.start+m.count);for(let p=g,f=_;p<f;p+=3){const v=p,x=p+1,M=p+2;s=yo(this,o,t,i,l,h,u,v,x,M),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function gm(n,t,e,i,s,r,o,a){let c;if(t.side===cn?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,t.side===Pi,a),c===null)return null;Mo.copy(a),Mo.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Mo);return l<e.near||l>e.far?null:{distance:l,point:Mo.clone(),object:n}}function yo(n,t,e,i,s,r,o,a,c,l){n.getVertexPosition(a,ws),n.getVertexPosition(c,Ts),n.getVertexPosition(l,As);const h=gm(n,t,e,i,ws,Ts,As,xo);if(h){s&&(go.fromBufferAttribute(s,a),_o.fromBufferAttribute(s,c),vo.fromBufferAttribute(s,l),h.uv=Cn.getInterpolation(xo,ws,Ts,As,go,_o,vo,new ht)),r&&(go.fromBufferAttribute(r,a),_o.fromBufferAttribute(r,c),vo.fromBufferAttribute(r,l),h.uv1=Cn.getInterpolation(xo,ws,Ts,As,go,_o,vo,new ht),h.uv2=h.uv1),o&&(gh.fromBufferAttribute(o,a),_h.fromBufferAttribute(o,c),vh.fromBufferAttribute(o,l),h.normal=Cn.getInterpolation(xo,ws,Ts,As,gh,_h,vh,new C),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new C,materialIndex:0};Cn.getNormal(ws,Ts,As,u.normal),h.face=u}return h}class Bn extends Ae{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,m=0;g("z","y","x",-1,-1,i,e,t,o,r,0),g("z","y","x",1,-1,i,e,-t,o,r,1),g("x","z","y",1,1,t,i,e,s,o,2),g("x","z","y",1,-1,t,i,-e,s,o,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new se(l,3)),this.setAttribute("normal",new se(h,3)),this.setAttribute("uv",new se(u,2));function g(_,p,f,v,x,M,R,E,T,U,y){const S=M/T,B=R/U,H=M/2,Y=R/2,D=E/2,O=T+1,W=U+1;let j=0,$=0;const X=new C;for(let q=0;q<W;q++){const rt=q*B-Y;for(let ct=0;ct<O;ct++){const G=ct*S-H;X[_]=G*v,X[p]=rt*x,X[f]=D,l.push(X.x,X.y,X.z),X[_]=0,X[p]=0,X[f]=E>0?1:-1,h.push(X.x,X.y,X.z),u.push(ct/T),u.push(1-q/U),j+=1}}for(let q=0;q<U;q++)for(let rt=0;rt<T;rt++){const ct=d+rt+O*q,G=d+rt+O*(q+1),K=d+(rt+1)+O*(q+1),pt=d+(rt+1)+O*q;c.push(ct,G,pt),c.push(G,K,pt),$+=6}a.addGroup(m,$,y),m+=$,d+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Js(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Je(n){const t={};for(let e=0;e<n.length;e++){const i=Js(n[e]);for(const s in i)t[s]=i[s]}return t}function _m(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function pf(n){return n.getRenderTarget()===null?n.outputColorSpace:le.workingColorSpace}const vm={clone:Js,merge:Je};var xm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Mm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ss extends ls{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=xm,this.fragmentShader=Mm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Js(t.uniforms),this.uniformsGroups=_m(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class mf extends Be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=oi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class mn extends mf{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=_c*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Do*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return _c*2*Math.atan(Math.tan(Do*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Do*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Rs=-90,Cs=1;class ym extends Be{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new mn(Rs,Cs,t,e);s.layers=this.layers,this.add(s);const r=new mn(Rs,Cs,t,e);r.layers=this.layers,this.add(r);const o=new mn(Rs,Cs,t,e);o.layers=this.layers,this.add(o);const a=new mn(Rs,Cs,t,e);a.layers=this.layers,this.add(a);const c=new mn(Rs,Cs,t,e);c.layers=this.layers,this.add(c);const l=new mn(Rs,Cs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===oi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Wo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,a),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,m),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class gf extends en{constructor(t,e,i,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:qs,super(t,e,i,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class bm extends is{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];e.encoding!==void 0&&(Tr("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Zi?Le:Sn),this.texture=new gf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:on}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Bn(5,5,5),r=new ss({name:"CubemapFromEquirect",uniforms:Js(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:cn,blending:Si});r.uniforms.tEquirect.value=e;const o=new Ht(s,r),a=e.minFilter;return e.minFilter===Dr&&(e.minFilter=on),new ym(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}}const Va=new C,Sm=new C,Em=new Jt;class xi{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Va.subVectors(i,e).cross(Sm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Va),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Em.getNormalMatrix(t),s=this.coplanarPoint(Va).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vi=new sr,bo=new C;class kc{constructor(t=new xi,e=new xi,i=new xi,s=new xi,r=new xi,o=new xi){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=oi){const i=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],m=s[8],g=s[9],_=s[10],p=s[11],f=s[12],v=s[13],x=s[14],M=s[15];if(i[0].setComponents(c-r,d-l,p-m,M-f).normalize(),i[1].setComponents(c+r,d+l,p+m,M+f).normalize(),i[2].setComponents(c+o,d+h,p+g,M+v).normalize(),i[3].setComponents(c-o,d-h,p-g,M-v).normalize(),i[4].setComponents(c-a,d-u,p-_,M-x).normalize(),e===oi)i[5].setComponents(c+a,d+u,p+_,M+x).normalize();else if(e===Wo)i[5].setComponents(a,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Vi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Vi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Vi)}intersectsSprite(t){return Vi.center.set(0,0,0),Vi.radius=.7071067811865476,Vi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Vi)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(bo.x=s.normal.x>0?t.max.x:t.min.x,bo.y=s.normal.y>0?t.max.y:t.min.y,bo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(bo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function _f(){let n=null,t=!1,e=null,i=null;function s(r,o){e(r,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function wm(n,t){const e=t.isWebGL2,i=new WeakMap;function s(l,h){const u=l.array,d=l.usage,m=u.byteLength,g=n.createBuffer();n.bindBuffer(h,g),n.bufferData(h,u,d),l.onUploadCallback();let _;if(u instanceof Float32Array)_=n.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)_=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=n.SHORT;else if(u instanceof Uint32Array)_=n.UNSIGNED_INT;else if(u instanceof Int32Array)_=n.INT;else if(u instanceof Int8Array)_=n.BYTE;else if(u instanceof Uint8Array)_=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:m}}function r(l,h,u){const d=h.array,m=h._updateRange,g=h.updateRanges;if(n.bindBuffer(u,l),m.count===-1&&g.length===0&&n.bufferSubData(u,0,d),g.length!==0){for(let _=0,p=g.length;_<p;_++){const f=g[_];e?n.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d,f.start,f.count):n.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}m.count!==-1&&(e?n.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d,m.offset,m.count):n.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),i.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=i.get(l);h&&(n.deleteBuffer(h.buffer),i.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const d=i.get(l);(!d||d.version<l.version)&&i.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=i.get(l);if(u===void 0)i.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:o,remove:a,update:c}}class Ii extends Ae{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(i),c=Math.floor(s),l=a+1,h=c+1,u=t/a,d=e/c,m=[],g=[],_=[],p=[];for(let f=0;f<h;f++){const v=f*d-o;for(let x=0;x<l;x++){const M=x*u-r;g.push(M,-v,0),_.push(0,0,1),p.push(x/a),p.push(1-f/c)}}for(let f=0;f<c;f++)for(let v=0;v<a;v++){const x=v+l*f,M=v+l*(f+1),R=v+1+l*(f+1),E=v+1+l*f;m.push(x,M,E),m.push(M,R,E)}this.setIndex(m),this.setAttribute("position",new se(g,3)),this.setAttribute("normal",new se(_,3)),this.setAttribute("uv",new se(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ii(t.width,t.height,t.widthSegments,t.heightSegments)}}var Tm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Am=`#ifdef USE_ALPHAHASH
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
#endif`,Rm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Cm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pm=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Lm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Dm=`#ifdef USE_AOMAP
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
#endif`,Im=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Um=`#ifdef USE_BATCHING
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
#endif`,Nm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,zm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Om=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Fm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,km=`#ifdef USE_IRIDESCENCE
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
#endif`,Bm=`#ifdef USE_BUMPMAP
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
#endif`,Hm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Vm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Wm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Gm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$m=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Xm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,jm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,qm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Ym=`#define PI 3.141592653589793
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
} // validated`,Km=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Jm=`vec3 transformedNormal = objectNormal;
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
#endif`,Zm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Qm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,t0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,e0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,n0="gl_FragColor = linearToOutputTexel( gl_FragColor );",i0=`
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
}`,s0=`#ifdef USE_ENVMAP
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
#endif`,r0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,o0=`#ifdef USE_ENVMAP
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
#endif`,a0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,c0=`#ifdef USE_ENVMAP
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
#endif`,l0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,h0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,u0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,f0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,d0=`#ifdef USE_GRADIENTMAP
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
}`,p0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,m0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,g0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,v0=`uniform bool receiveShadow;
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
#endif`,x0=`#ifdef USE_ENVMAP
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
#endif`,M0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,y0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,b0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,S0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,E0=`PhysicalMaterial material;
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
#endif`,w0=`struct PhysicalMaterial {
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
}`,T0=`
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
#endif`,A0=`#if defined( RE_IndirectDiffuse )
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
#endif`,R0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,C0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,P0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,L0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,D0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,I0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,U0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,N0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,z0=`#if defined( USE_POINTS_UV )
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
#endif`,O0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,F0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,k0=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,B0=`#ifdef USE_MORPHNORMALS
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
#endif`,H0=`#ifdef USE_MORPHTARGETS
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
#endif`,V0=`#ifdef USE_MORPHTARGETS
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
#endif`,W0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,G0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,X0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,j0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,q0=`#ifdef USE_NORMALMAP
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
#endif`,Y0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,K0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,J0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Z0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Q0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,eg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ng=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ig=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,rg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,og=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ag=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,cg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,lg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,hg=`float getShadowMask() {
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
}`,ug=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fg=`#ifdef USE_SKINNING
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
#endif`,dg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,pg=`#ifdef USE_SKINNING
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
#endif`,mg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_g=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,xg=`#ifdef USE_TRANSMISSION
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
#endif`,Mg=`#ifdef USE_TRANSMISSION
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
#endif`,yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Eg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const wg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Tg=`uniform sampler2D t2D;
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
}`,Ag=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lg=`#include <common>
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
}`,Dg=`#if DEPTH_PACKING == 3200
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
}`,Ig=`#define DISTANCE
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
}`,Ug=`#define DISTANCE
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
}`,Ng=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,zg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Og=`uniform float scale;
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
}`,Fg=`uniform vec3 diffuse;
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
}`,kg=`#include <common>
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
}`,Bg=`uniform vec3 diffuse;
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
}`,Hg=`#define LAMBERT
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
}`,Vg=`#define LAMBERT
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
}`,Wg=`#define MATCAP
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
}`,Gg=`#define MATCAP
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
}`,$g=`#define NORMAL
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
}`,Xg=`#define NORMAL
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
}`,jg=`#define PHONG
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
}`,qg=`#define PHONG
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
}`,Yg=`#define STANDARD
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
}`,Kg=`#define STANDARD
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
}`,Jg=`#define TOON
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
}`,Zg=`#define TOON
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
}`,Qg=`uniform float size;
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
}`,t_=`uniform vec3 diffuse;
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
}`,e_=`#include <common>
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
}`,n_=`uniform vec3 color;
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
}`,i_=`uniform float rotation;
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
}`,s_=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:Tm,alphahash_pars_fragment:Am,alphamap_fragment:Rm,alphamap_pars_fragment:Cm,alphatest_fragment:Pm,alphatest_pars_fragment:Lm,aomap_fragment:Dm,aomap_pars_fragment:Im,batching_pars_vertex:Um,batching_vertex:Nm,begin_vertex:zm,beginnormal_vertex:Om,bsdfs:Fm,iridescence_fragment:km,bumpmap_pars_fragment:Bm,clipping_planes_fragment:Hm,clipping_planes_pars_fragment:Vm,clipping_planes_pars_vertex:Wm,clipping_planes_vertex:Gm,color_fragment:$m,color_pars_fragment:Xm,color_pars_vertex:jm,color_vertex:qm,common:Ym,cube_uv_reflection_fragment:Km,defaultnormal_vertex:Jm,displacementmap_pars_vertex:Zm,displacementmap_vertex:Qm,emissivemap_fragment:t0,emissivemap_pars_fragment:e0,colorspace_fragment:n0,colorspace_pars_fragment:i0,envmap_fragment:s0,envmap_common_pars_fragment:r0,envmap_pars_fragment:o0,envmap_pars_vertex:a0,envmap_physical_pars_fragment:x0,envmap_vertex:c0,fog_vertex:l0,fog_pars_vertex:h0,fog_fragment:u0,fog_pars_fragment:f0,gradientmap_pars_fragment:d0,lightmap_fragment:p0,lightmap_pars_fragment:m0,lights_lambert_fragment:g0,lights_lambert_pars_fragment:_0,lights_pars_begin:v0,lights_toon_fragment:M0,lights_toon_pars_fragment:y0,lights_phong_fragment:b0,lights_phong_pars_fragment:S0,lights_physical_fragment:E0,lights_physical_pars_fragment:w0,lights_fragment_begin:T0,lights_fragment_maps:A0,lights_fragment_end:R0,logdepthbuf_fragment:C0,logdepthbuf_pars_fragment:P0,logdepthbuf_pars_vertex:L0,logdepthbuf_vertex:D0,map_fragment:I0,map_pars_fragment:U0,map_particle_fragment:N0,map_particle_pars_fragment:z0,metalnessmap_fragment:O0,metalnessmap_pars_fragment:F0,morphcolor_vertex:k0,morphnormal_vertex:B0,morphtarget_pars_vertex:H0,morphtarget_vertex:V0,normal_fragment_begin:W0,normal_fragment_maps:G0,normal_pars_fragment:$0,normal_pars_vertex:X0,normal_vertex:j0,normalmap_pars_fragment:q0,clearcoat_normal_fragment_begin:Y0,clearcoat_normal_fragment_maps:K0,clearcoat_pars_fragment:J0,iridescence_pars_fragment:Z0,opaque_fragment:Q0,packing:tg,premultiplied_alpha_fragment:eg,project_vertex:ng,dithering_fragment:ig,dithering_pars_fragment:sg,roughnessmap_fragment:rg,roughnessmap_pars_fragment:og,shadowmap_pars_fragment:ag,shadowmap_pars_vertex:cg,shadowmap_vertex:lg,shadowmask_pars_fragment:hg,skinbase_vertex:ug,skinning_pars_vertex:fg,skinning_vertex:dg,skinnormal_vertex:pg,specularmap_fragment:mg,specularmap_pars_fragment:gg,tonemapping_fragment:_g,tonemapping_pars_fragment:vg,transmission_fragment:xg,transmission_pars_fragment:Mg,uv_pars_fragment:yg,uv_pars_vertex:bg,uv_vertex:Sg,worldpos_vertex:Eg,background_vert:wg,background_frag:Tg,backgroundCube_vert:Ag,backgroundCube_frag:Rg,cube_vert:Cg,cube_frag:Pg,depth_vert:Lg,depth_frag:Dg,distanceRGBA_vert:Ig,distanceRGBA_frag:Ug,equirect_vert:Ng,equirect_frag:zg,linedashed_vert:Og,linedashed_frag:Fg,meshbasic_vert:kg,meshbasic_frag:Bg,meshlambert_vert:Hg,meshlambert_frag:Vg,meshmatcap_vert:Wg,meshmatcap_frag:Gg,meshnormal_vert:$g,meshnormal_frag:Xg,meshphong_vert:jg,meshphong_frag:qg,meshphysical_vert:Yg,meshphysical_frag:Kg,meshtoon_vert:Jg,meshtoon_frag:Zg,points_vert:Qg,points_frag:t_,shadow_vert:e_,shadow_frag:n_,sprite_vert:i_,sprite_frag:s_},lt={common:{diffuse:{value:new jt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new jt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new jt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new jt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},zn={basic:{uniforms:Je([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Je([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new jt(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Je([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new jt(0)},specular:{value:new jt(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Je([lt.common,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.roughnessmap,lt.metalnessmap,lt.fog,lt.lights,{emissive:{value:new jt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Je([lt.common,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.gradientmap,lt.fog,lt.lights,{emissive:{value:new jt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Je([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Je([lt.points,lt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Je([lt.common,lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Je([lt.common,lt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Je([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Je([lt.sprite,lt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Je([lt.common,lt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Je([lt.lights,lt.fog,{color:{value:new jt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};zn.physical={uniforms:Je([zn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new jt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new jt(0)},specularColor:{value:new jt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const So={r:0,b:0,g:0};function r_(n,t,e,i,s,r,o){const a=new jt(0);let c=r===!0?0:1,l,h,u=null,d=0,m=null;function g(p,f){let v=!1,x=f.isScene===!0?f.background:null;x&&x.isTexture&&(x=(f.backgroundBlurriness>0?e:t).get(x)),x===null?_(a,c):x&&x.isColor&&(_(x,1),v=!0);const M=n.xr.getEnvironmentBlendMode();M==="additive"?i.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||v)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),x&&(x.isCubeTexture||x.mapping===Qo)?(h===void 0&&(h=new Ht(new Bn(1,1,1),new ss({name:"BackgroundCubeMaterial",uniforms:Js(zn.backgroundCube.uniforms),vertexShader:zn.backgroundCube.vertexShader,fragmentShader:zn.backgroundCube.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,E,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=le.getTransfer(x.colorSpace)!==fe,(u!==x||d!==x.version||m!==n.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,m=n.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Ht(new Ii(2,2),new ss({name:"BackgroundMaterial",uniforms:Js(zn.background.uniforms),vertexShader:zn.background.vertexShader,fragmentShader:zn.background.fragmentShader,side:Pi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,l.material.toneMapped=le.getTransfer(x.colorSpace)!==fe,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||m!==n.toneMapping)&&(l.material.needsUpdate=!0,u=x,d=x.version,m=n.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function _(p,f){p.getRGB(So,pf(n)),i.buffers.color.setClear(So.r,So.g,So.b,f,o)}return{getClearColor:function(){return a},setClearColor:function(p,f=1){a.set(p),c=f,_(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,_(a,c)},render:g}}function o_(n,t,e,i){const s=n.getParameter(n.MAX_VERTEX_ATTRIBS),r=i.isWebGL2?null:t.get("OES_vertex_array_object"),o=i.isWebGL2||r!==null,a={},c=p(null);let l=c,h=!1;function u(D,O,W,j,$){let X=!1;if(o){const q=_(j,W,O);l!==q&&(l=q,m(l.object)),X=f(D,j,W,$),X&&v(D,j,W,$)}else{const q=O.wireframe===!0;(l.geometry!==j.id||l.program!==W.id||l.wireframe!==q)&&(l.geometry=j.id,l.program=W.id,l.wireframe=q,X=!0)}$!==null&&e.update($,n.ELEMENT_ARRAY_BUFFER),(X||h)&&(h=!1,U(D,O,W,j),$!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function d(){return i.isWebGL2?n.createVertexArray():r.createVertexArrayOES()}function m(D){return i.isWebGL2?n.bindVertexArray(D):r.bindVertexArrayOES(D)}function g(D){return i.isWebGL2?n.deleteVertexArray(D):r.deleteVertexArrayOES(D)}function _(D,O,W){const j=W.wireframe===!0;let $=a[D.id];$===void 0&&($={},a[D.id]=$);let X=$[O.id];X===void 0&&(X={},$[O.id]=X);let q=X[j];return q===void 0&&(q=p(d()),X[j]=q),q}function p(D){const O=[],W=[],j=[];for(let $=0;$<s;$++)O[$]=0,W[$]=0,j[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:W,attributeDivisors:j,object:D,attributes:{},index:null}}function f(D,O,W,j){const $=l.attributes,X=O.attributes;let q=0;const rt=W.getAttributes();for(const ct in rt)if(rt[ct].location>=0){const K=$[ct];let pt=X[ct];if(pt===void 0&&(ct==="instanceMatrix"&&D.instanceMatrix&&(pt=D.instanceMatrix),ct==="instanceColor"&&D.instanceColor&&(pt=D.instanceColor)),K===void 0||K.attribute!==pt||pt&&K.data!==pt.data)return!0;q++}return l.attributesNum!==q||l.index!==j}function v(D,O,W,j){const $={},X=O.attributes;let q=0;const rt=W.getAttributes();for(const ct in rt)if(rt[ct].location>=0){let K=X[ct];K===void 0&&(ct==="instanceMatrix"&&D.instanceMatrix&&(K=D.instanceMatrix),ct==="instanceColor"&&D.instanceColor&&(K=D.instanceColor));const pt={};pt.attribute=K,K&&K.data&&(pt.data=K.data),$[ct]=pt,q++}l.attributes=$,l.attributesNum=q,l.index=j}function x(){const D=l.newAttributes;for(let O=0,W=D.length;O<W;O++)D[O]=0}function M(D){R(D,0)}function R(D,O){const W=l.newAttributes,j=l.enabledAttributes,$=l.attributeDivisors;W[D]=1,j[D]===0&&(n.enableVertexAttribArray(D),j[D]=1),$[D]!==O&&((i.isWebGL2?n:t.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](D,O),$[D]=O)}function E(){const D=l.newAttributes,O=l.enabledAttributes;for(let W=0,j=O.length;W<j;W++)O[W]!==D[W]&&(n.disableVertexAttribArray(W),O[W]=0)}function T(D,O,W,j,$,X,q){q===!0?n.vertexAttribIPointer(D,O,W,$,X):n.vertexAttribPointer(D,O,W,j,$,X)}function U(D,O,W,j){if(i.isWebGL2===!1&&(D.isInstancedMesh||j.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const $=j.attributes,X=W.getAttributes(),q=O.defaultAttributeValues;for(const rt in X){const ct=X[rt];if(ct.location>=0){let G=$[rt];if(G===void 0&&(rt==="instanceMatrix"&&D.instanceMatrix&&(G=D.instanceMatrix),rt==="instanceColor"&&D.instanceColor&&(G=D.instanceColor)),G!==void 0){const K=G.normalized,pt=G.itemSize,wt=e.get(G);if(wt===void 0)continue;const St=wt.buffer,kt=wt.type,Bt=wt.bytesPerElement,Lt=i.isWebGL2===!0&&(kt===n.INT||kt===n.UNSIGNED_INT||G.gpuType===Ju);if(G.isInterleavedBufferAttribute){const Zt=G.data,z=Zt.stride,We=G.offset;if(Zt.isInstancedInterleavedBuffer){for(let Rt=0;Rt<ct.locationSize;Rt++)R(ct.location+Rt,Zt.meshPerAttribute);D.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=Zt.meshPerAttribute*Zt.count)}else for(let Rt=0;Rt<ct.locationSize;Rt++)M(ct.location+Rt);n.bindBuffer(n.ARRAY_BUFFER,St);for(let Rt=0;Rt<ct.locationSize;Rt++)T(ct.location+Rt,pt/ct.locationSize,kt,K,z*Bt,(We+pt/ct.locationSize*Rt)*Bt,Lt)}else{if(G.isInstancedBufferAttribute){for(let Zt=0;Zt<ct.locationSize;Zt++)R(ct.location+Zt,G.meshPerAttribute);D.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let Zt=0;Zt<ct.locationSize;Zt++)M(ct.location+Zt);n.bindBuffer(n.ARRAY_BUFFER,St);for(let Zt=0;Zt<ct.locationSize;Zt++)T(ct.location+Zt,pt/ct.locationSize,kt,K,pt*Bt,pt/ct.locationSize*Zt*Bt,Lt)}}else if(q!==void 0){const K=q[rt];if(K!==void 0)switch(K.length){case 2:n.vertexAttrib2fv(ct.location,K);break;case 3:n.vertexAttrib3fv(ct.location,K);break;case 4:n.vertexAttrib4fv(ct.location,K);break;default:n.vertexAttrib1fv(ct.location,K)}}}}E()}function y(){H();for(const D in a){const O=a[D];for(const W in O){const j=O[W];for(const $ in j)g(j[$].object),delete j[$];delete O[W]}delete a[D]}}function S(D){if(a[D.id]===void 0)return;const O=a[D.id];for(const W in O){const j=O[W];for(const $ in j)g(j[$].object),delete j[$];delete O[W]}delete a[D.id]}function B(D){for(const O in a){const W=a[O];if(W[D.id]===void 0)continue;const j=W[D.id];for(const $ in j)g(j[$].object),delete j[$];delete W[D.id]}}function H(){Y(),h=!0,l!==c&&(l=c,m(l.object))}function Y(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:H,resetDefaultState:Y,dispose:y,releaseStatesOfGeometry:S,releaseStatesOfProgram:B,initAttributes:x,enableAttribute:M,disableUnusedAttributes:E}}function a_(n,t,e,i){const s=i.isWebGL2;let r;function o(h){r=h}function a(h,u){n.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,d){if(d===0)return;let m,g;if(s)m=n,g="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](r,h,u,d),e.update(u,r,d)}function l(h,u,d){if(d===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{m.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function c_(n,t,e){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");i=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const l=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),d=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),_=n.getParameter(n.MAX_VERTEX_ATTRIBS),p=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),f=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,M=o||t.has("OES_texture_float"),R=x&&M,E=o?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:m,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:p,maxVaryings:f,maxFragmentUniforms:v,vertexTextures:x,floatFragmentTextures:M,floatVertexTextures:R,maxSamples:E}}function l_(n){const t=this;let e=null,i=0,s=!1,r=!1;const o=new xi,a=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const m=u.length!==0||d||i!==0||s;return s=d,i=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,m){const g=u.clippingPlanes,_=u.clipIntersection,p=u.clipShadows,f=n.get(u);if(!s||g===null||g.length===0||r&&!p)r?h(null):l();else{const v=r?0:i,x=v*4;let M=f.clippingState||null;c.value=M,M=h(g,d,x,m);for(let R=0;R!==x;++R)M[R]=e[R];f.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,m,g){const _=u!==null?u.length:0;let p=null;if(_!==0){if(p=c.value,g!==!0||p===null){const f=m+_*4,v=d.matrixWorldInverse;a.getNormalMatrix(v),(p===null||p.length<f)&&(p=new Float32Array(f));for(let x=0,M=m;x!==_;++x,M+=4)o.copy(u[x]).applyMatrix4(v,a),o.normal.toArray(p,M),p[M+3]=o.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,p}}function h_(n){let t=new WeakMap;function e(o,a){return a===dc?o.mapping=qs:a===pc&&(o.mapping=Ys),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===dc||a===pc)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new bm(c.height/2);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}class vf extends mf{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,o=i+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Bs=4,xh=[.125,.215,.35,.446,.526,.582],Yi=20,Wa=new vf,Mh=new jt;let Ga=null,$a=0,Xa=0;const Xi=(1+Math.sqrt(5))/2,Ps=1/Xi,yh=[new C(1,1,1),new C(-1,1,1),new C(1,1,-1),new C(-1,1,-1),new C(0,Xi,Ps),new C(0,Xi,-Ps),new C(Ps,0,Xi),new C(-Ps,0,Xi),new C(Xi,Ps,0),new C(-Xi,Ps,0)];class bh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Ga=this._renderer.getRenderTarget(),$a=this._renderer.getActiveCubeFace(),Xa=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Eh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ga,$a,Xa),t.scissorTest=!1,Eo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===qs||t.mapping===Ys?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ga=this._renderer.getRenderTarget(),$a=this._renderer.getActiveCubeFace(),Xa=this._renderer.getActiveMipmapLevel();const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:on,minFilter:on,generateMipmaps:!1,type:Ir,format:bn,colorSpace:li,depthBuffer:!1},s=Sh(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Sh(t,e,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=u_(r)),this._blurMaterial=f_(r,t,e)}return s}_compileMaterial(t){const e=new Ht(this._lodPlanes[0],t);this._renderer.compile(e,Wa)}_sceneToCubeUV(t,e,i,s){const a=new mn(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Mh),h.toneMapping=Ei,h.autoClear=!1;const m=new Ze({name:"PMREM.Background",side:cn,depthWrite:!1,depthTest:!1}),g=new Ht(new Bn,m);let _=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,_=!0):(m.color.copy(Mh),_=!0);for(let f=0;f<6;f++){const v=f%3;v===0?(a.up.set(0,c[f],0),a.lookAt(l[f],0,0)):v===1?(a.up.set(0,0,c[f]),a.lookAt(0,l[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,l[f]));const x=this._cubeSize;Eo(s,v*x,f>2?x:0,x,x),h.setRenderTarget(s),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=p}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===qs||t.mapping===Ys;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Eh());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Ht(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;Eo(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,Wa)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=yh[(s-1)%yh.length];this._blur(t,s-1,s,r,o)}e.autoClear=i}_blur(t,e,i,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",r),this._halfBlur(o,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Ht(this._lodPlanes[s],l),d=l.uniforms,m=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Yi-1),_=r/g,p=isFinite(r)?1+Math.floor(h*_):Yi;p>Yi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Yi}`);const f=[];let v=0;for(let T=0;T<Yi;++T){const U=T/_,y=Math.exp(-U*U/2);f.push(y),T===0?v+=y:T<p&&(v+=2*y)}for(let T=0;T<f.length;T++)f[T]=f[T]/v;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-i;const M=this._sizeLods[s],R=3*M*(s>x-Bs?s-x+Bs:0),E=4*(this._cubeSize-M);Eo(e,R,E,3*M,2*M),c.setRenderTarget(e),c.render(u,Wa)}}function u_(n){const t=[],e=[],i=[];let s=n;const r=n-Bs+1+xh.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>n-Bs?c=xh[o-n+Bs-1]:o===0&&(c=0),i.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,g=6,_=3,p=2,f=1,v=new Float32Array(_*g*m),x=new Float32Array(p*g*m),M=new Float32Array(f*g*m);for(let E=0;E<m;E++){const T=E%3*2/3-1,U=E>2?0:-1,y=[T,U,0,T+2/3,U,0,T+2/3,U+1,0,T,U,0,T+2/3,U+1,0,T,U+1,0];v.set(y,_*g*E),x.set(d,p*g*E);const S=[E,E,E,E,E,E];M.set(S,f*g*E)}const R=new Ae;R.setAttribute("position",new xn(v,_)),R.setAttribute("uv",new xn(x,p)),R.setAttribute("faceIndex",new xn(M,f)),t.push(R),s>Bs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Sh(n,t,e){const i=new is(n,t,e);return i.texture.mapping=Qo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Eo(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function f_(n,t,e){const i=new Float32Array(Yi),s=new C(0,1,0);return new ss({name:"SphericalGaussianBlur",defines:{n:Yi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Bc(),fragmentShader:`

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
		`,blending:Si,depthTest:!1,depthWrite:!1})}function Eh(){return new ss({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bc(),fragmentShader:`

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
		`,blending:Si,depthTest:!1,depthWrite:!1})}function wh(){return new ss({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Si,depthTest:!1,depthWrite:!1})}function Bc(){return`

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
	`}function d_(n){let t=new WeakMap,e=null;function i(a){if(a&&a.isTexture){const c=a.mapping,l=c===dc||c===pc,h=c===qs||c===Ys;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new bh(n)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{const u=a.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new bh(n));const d=l?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function p_(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(i){i.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(i){const s=e(i);return s===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function m_(n,t,e,i){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let p=0,f=_.length;p<f;p++)t.remove(_[p])}d.removeEventListener("dispose",o),delete s[d.id];const m=r.get(d);m&&(t.remove(m),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)t.update(d[g],n.ARRAY_BUFFER);const m=u.morphAttributes;for(const g in m){const _=m[g];for(let p=0,f=_.length;p<f;p++)t.update(_[p],n.ARRAY_BUFFER)}}function l(u){const d=[],m=u.index,g=u.attributes.position;let _=0;if(m!==null){const v=m.array;_=m.version;for(let x=0,M=v.length;x<M;x+=3){const R=v[x+0],E=v[x+1],T=v[x+2];d.push(R,E,E,T,T,R)}}else if(g!==void 0){const v=g.array;_=g.version;for(let x=0,M=v.length/3-1;x<M;x+=3){const R=x+0,E=x+1,T=x+2;d.push(R,E,E,T,T,R)}}else return;const p=new(af(d)?df:ff)(d,1);p.version=_;const f=r.get(u);f&&t.remove(f),r.set(u,p)}function h(u){const d=r.get(u);if(d){const m=u.index;m!==null&&d.version<m.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function g_(n,t,e,i){const s=i.isWebGL2;let r;function o(m){r=m}let a,c;function l(m){a=m.type,c=m.bytesPerElement}function h(m,g){n.drawElements(r,g,a,m*c),e.update(g,r,1)}function u(m,g,_){if(_===0)return;let p,f;if(s)p=n,f="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[f](r,g,a,m*c,_),e.update(g,r,_)}function d(m,g,_){if(_===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<_;f++)this.render(m[f]/c,g[f]);else{p.multiDrawElementsWEBGL(r,g,0,a,m,0,_);let f=0;for(let v=0;v<_;v++)f+=g[v];e.update(f,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function __(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function v_(n,t){return n[0]-t[0]}function x_(n,t){return Math.abs(t[1])-Math.abs(n[1])}function M_(n,t,e){const i={},s=new Float32Array(8),r=new WeakMap,o=new me,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,u){const d=l.morphTargetInfluences;if(t.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,_=g!==void 0?g.length:0;let p=r.get(h);if(p===void 0||p.count!==_){let O=function(){Y.dispose(),r.delete(h),h.removeEventListener("dispose",O)};var m=O;p!==void 0&&p.texture.dispose();const x=h.morphAttributes.position!==void 0,M=h.morphAttributes.normal!==void 0,R=h.morphAttributes.color!==void 0,E=h.morphAttributes.position||[],T=h.morphAttributes.normal||[],U=h.morphAttributes.color||[];let y=0;x===!0&&(y=1),M===!0&&(y=2),R===!0&&(y=3);let S=h.attributes.position.count*y,B=1;S>t.maxTextureSize&&(B=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const H=new Float32Array(S*B*4*_),Y=new hf(H,S,B,_);Y.type=bi,Y.needsUpdate=!0;const D=y*4;for(let W=0;W<_;W++){const j=E[W],$=T[W],X=U[W],q=S*B*4*W;for(let rt=0;rt<j.count;rt++){const ct=rt*D;x===!0&&(o.fromBufferAttribute(j,rt),H[q+ct+0]=o.x,H[q+ct+1]=o.y,H[q+ct+2]=o.z,H[q+ct+3]=0),M===!0&&(o.fromBufferAttribute($,rt),H[q+ct+4]=o.x,H[q+ct+5]=o.y,H[q+ct+6]=o.z,H[q+ct+7]=0),R===!0&&(o.fromBufferAttribute(X,rt),H[q+ct+8]=o.x,H[q+ct+9]=o.y,H[q+ct+10]=o.z,H[q+ct+11]=X.itemSize===4?o.w:1)}}p={count:_,texture:Y,size:new ht(S,B)},r.set(h,p),h.addEventListener("dispose",O)}let f=0;for(let x=0;x<d.length;x++)f+=d[x];const v=h.morphTargetsRelative?1:1-f;u.getUniforms().setValue(n,"morphTargetBaseInfluence",v),u.getUniforms().setValue(n,"morphTargetInfluences",d),u.getUniforms().setValue(n,"morphTargetsTexture",p.texture,e),u.getUniforms().setValue(n,"morphTargetsTextureSize",p.size)}else{const g=d===void 0?0:d.length;let _=i[h.id];if(_===void 0||_.length!==g){_=[];for(let M=0;M<g;M++)_[M]=[M,0];i[h.id]=_}for(let M=0;M<g;M++){const R=_[M];R[0]=M,R[1]=d[M]}_.sort(x_);for(let M=0;M<8;M++)M<g&&_[M][1]?(a[M][0]=_[M][0],a[M][1]=_[M][1]):(a[M][0]=Number.MAX_SAFE_INTEGER,a[M][1]=0);a.sort(v_);const p=h.morphAttributes.position,f=h.morphAttributes.normal;let v=0;for(let M=0;M<8;M++){const R=a[M],E=R[0],T=R[1];E!==Number.MAX_SAFE_INTEGER&&T?(p&&h.getAttribute("morphTarget"+M)!==p[E]&&h.setAttribute("morphTarget"+M,p[E]),f&&h.getAttribute("morphNormal"+M)!==f[E]&&h.setAttribute("morphNormal"+M,f[E]),s[M]=T,v+=T):(p&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),f&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),s[M]=0)}const x=h.morphTargetsRelative?1:1-v;u.getUniforms().setValue(n,"morphTargetBaseInfluence",x),u.getUniforms().setValue(n,"morphTargetInfluences",s)}}return{update:c}}function y_(n,t,e,i){let s=new WeakMap;function r(c){const l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class xf extends en{constructor(t,e,i,s,r,o,a,c,l,h){if(h=h!==void 0?h:Ji,h!==Ji&&h!==Ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ji&&(i=yi),i===void 0&&h===Ks&&(i=Ki),super(null,s,r,o,a,c,h,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ge,this.minFilter=c!==void 0?c:Ge,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Mf=new en,yf=new xf(1,1);yf.compareFunction=of;const bf=new hf,Sf=new rm,Ef=new gf,Th=[],Ah=[],Rh=new Float32Array(16),Ch=new Float32Array(9),Ph=new Float32Array(4);function or(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=Th[s];if(r===void 0&&(r=new Float32Array(s),Th[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function Ie(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ue(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function na(n,t){let e=Ah[t];e===void 0&&(e=new Int32Array(t),Ah[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function b_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function S_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2fv(this.addr,t),Ue(e,t)}}function E_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;n.uniform3fv(this.addr,t),Ue(e,t)}}function w_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4fv(this.addr,t),Ue(e,t)}}function T_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,i))return;Ph.set(i),n.uniformMatrix2fv(this.addr,!1,Ph),Ue(e,i)}}function A_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,i))return;Ch.set(i),n.uniformMatrix3fv(this.addr,!1,Ch),Ue(e,i)}}function R_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,i))return;Rh.set(i),n.uniformMatrix4fv(this.addr,!1,Rh),Ue(e,i)}}function C_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function P_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2iv(this.addr,t),Ue(e,t)}}function L_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;n.uniform3iv(this.addr,t),Ue(e,t)}}function D_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4iv(this.addr,t),Ue(e,t)}}function I_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function U_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2uiv(this.addr,t),Ue(e,t)}}function N_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;n.uniform3uiv(this.addr,t),Ue(e,t)}}function z_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4uiv(this.addr,t),Ue(e,t)}}function O_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);const r=this.type===n.SAMPLER_2D_SHADOW?yf:Mf;e.setTexture2D(t||r,s)}function F_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Sf,s)}function k_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Ef,s)}function B_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||bf,s)}function H_(n){switch(n){case 5126:return b_;case 35664:return S_;case 35665:return E_;case 35666:return w_;case 35674:return T_;case 35675:return A_;case 35676:return R_;case 5124:case 35670:return C_;case 35667:case 35671:return P_;case 35668:case 35672:return L_;case 35669:case 35673:return D_;case 5125:return I_;case 36294:return U_;case 36295:return N_;case 36296:return z_;case 35678:case 36198:case 36298:case 36306:case 35682:return O_;case 35679:case 36299:case 36307:return F_;case 35680:case 36300:case 36308:case 36293:return k_;case 36289:case 36303:case 36311:case 36292:return B_}}function V_(n,t){n.uniform1fv(this.addr,t)}function W_(n,t){const e=or(t,this.size,2);n.uniform2fv(this.addr,e)}function G_(n,t){const e=or(t,this.size,3);n.uniform3fv(this.addr,e)}function $_(n,t){const e=or(t,this.size,4);n.uniform4fv(this.addr,e)}function X_(n,t){const e=or(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function j_(n,t){const e=or(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function q_(n,t){const e=or(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Y_(n,t){n.uniform1iv(this.addr,t)}function K_(n,t){n.uniform2iv(this.addr,t)}function J_(n,t){n.uniform3iv(this.addr,t)}function Z_(n,t){n.uniform4iv(this.addr,t)}function Q_(n,t){n.uniform1uiv(this.addr,t)}function tv(n,t){n.uniform2uiv(this.addr,t)}function ev(n,t){n.uniform3uiv(this.addr,t)}function nv(n,t){n.uniform4uiv(this.addr,t)}function iv(n,t,e){const i=this.cache,s=t.length,r=na(e,s);Ie(i,r)||(n.uniform1iv(this.addr,r),Ue(i,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Mf,r[o])}function sv(n,t,e){const i=this.cache,s=t.length,r=na(e,s);Ie(i,r)||(n.uniform1iv(this.addr,r),Ue(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Sf,r[o])}function rv(n,t,e){const i=this.cache,s=t.length,r=na(e,s);Ie(i,r)||(n.uniform1iv(this.addr,r),Ue(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Ef,r[o])}function ov(n,t,e){const i=this.cache,s=t.length,r=na(e,s);Ie(i,r)||(n.uniform1iv(this.addr,r),Ue(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||bf,r[o])}function av(n){switch(n){case 5126:return V_;case 35664:return W_;case 35665:return G_;case 35666:return $_;case 35674:return X_;case 35675:return j_;case 35676:return q_;case 5124:case 35670:return Y_;case 35667:case 35671:return K_;case 35668:case 35672:return J_;case 35669:case 35673:return Z_;case 5125:return Q_;case 36294:return tv;case 36295:return ev;case 36296:return nv;case 35678:case 36198:case 36298:case 36306:case 35682:return iv;case 35679:case 36299:case 36307:return sv;case 35680:case 36300:case 36308:case 36293:return rv;case 36289:case 36303:case 36311:case 36292:return ov}}class cv{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=H_(e.type)}}class lv{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=av(e.type)}}class hv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],i)}}}const ja=/(\w+)(\])?(\[|\.)?/g;function Lh(n,t){n.seq.push(t),n.map[t.id]=t}function uv(n,t,e){const i=n.name,s=i.length;for(ja.lastIndex=0;;){const r=ja.exec(i),o=ja.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Lh(e,l===void 0?new cv(a,n,t):new lv(a,n,t));break}else{let u=e.map[a];u===void 0&&(u=new hv(a),Lh(e,u)),e=u}}}class Io{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);uv(r,o,this)}}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&i.push(o)}return i}}function Dh(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const fv=37297;let dv=0;function pv(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}function mv(n){const t=le.getPrimaries(le.workingColorSpace),e=le.getPrimaries(n);let i;switch(t===e?i="":t===Vo&&e===Ho?i="LinearDisplayP3ToLinearSRGB":t===Ho&&e===Vo&&(i="LinearSRGBToLinearDisplayP3"),n){case li:case ta:return[i,"LinearTransferOETF"];case Le:case Oc:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Ih(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+pv(n.getShaderSource(t),o)}else return s}function gv(n,t){const e=mv(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function _v(n,t){let e;switch(t){case Ap:e="Linear";break;case Rp:e="Reinhard";break;case Cp:e="OptimizedCineon";break;case Yu:e="ACESFilmic";break;case Lp:e="AgX";break;case Pp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function vv(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Hs).join(`
`)}function xv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Hs).join(`
`)}function Mv(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function yv(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),o=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function Hs(n){return n!==""}function Uh(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Nh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const bv=/^[ \t]*#include +<([\w\d./]+)>/gm;function xc(n){return n.replace(bv,Ev)}const Sv=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Ev(n,t){let e=Xt[t];if(e===void 0){const i=Sv.get(t);if(i!==void 0)e=Xt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return xc(e)}const wv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zh(n){return n.replace(wv,Tv)}function Tv(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Oh(n){let t="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Av(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===ju?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===qu?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===ni&&(t="SHADOWMAP_TYPE_VSM"),t}function Rv(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case qs:case Ys:t="ENVMAP_TYPE_CUBE";break;case Qo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Cv(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ys:t="ENVMAP_MODE_REFRACTION";break}return t}function Pv(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Uc:t="ENVMAP_BLENDING_MULTIPLY";break;case wp:t="ENVMAP_BLENDING_MIX";break;case Tp:t="ENVMAP_BLENDING_ADD";break}return t}function Lv(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Dv(n,t,e,i){const s=n.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=Av(e),l=Rv(e),h=Cv(e),u=Pv(e),d=Lv(e),m=e.isWebGL2?"":vv(e),g=xv(e),_=Mv(r),p=s.createProgram();let f,v,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Hs).join(`
`),f.length>0&&(f+=`
`),v=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Hs).join(`
`),v.length>0&&(v+=`
`)):(f=[Oh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hs).join(`
`),v=[m,Oh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ei?"#define TONE_MAPPING":"",e.toneMapping!==Ei?Xt.tonemapping_pars_fragment:"",e.toneMapping!==Ei?_v("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,gv("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Hs).join(`
`)),o=xc(o),o=Uh(o,e),o=Nh(o,e),a=xc(a),a=Uh(a,e),a=Nh(a,e),o=zh(o),a=zh(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===eh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===eh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const M=x+f+o,R=x+v+a,E=Dh(s,s.VERTEX_SHADER,M),T=Dh(s,s.FRAGMENT_SHADER,R);s.attachShader(p,E),s.attachShader(p,T),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function U(H){if(n.debug.checkShaderErrors){const Y=s.getProgramInfoLog(p).trim(),D=s.getShaderInfoLog(E).trim(),O=s.getShaderInfoLog(T).trim();let W=!0,j=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(W=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,p,E,T);else{const $=Ih(s,E,"vertex"),X=Ih(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+Y+`
`+$+`
`+X)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):(D===""||O==="")&&(j=!1);j&&(H.diagnostics={runnable:W,programLog:Y,vertexShader:{log:D,prefix:f},fragmentShader:{log:O,prefix:v}})}s.deleteShader(E),s.deleteShader(T),y=new Io(s,p),S=yv(s,p)}let y;this.getUniforms=function(){return y===void 0&&U(this),y};let S;this.getAttributes=function(){return S===void 0&&U(this),S};let B=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return B===!1&&(B=s.getProgramParameter(p,fv)),B},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=dv++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=E,this.fragmentShader=T,this}let Iv=0;class Uv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Nv(t),e.set(t,i)),i}}class Nv{constructor(t){this.id=Iv++,this.code=t,this.usedTimes=0}}function zv(n,t,e,i,s,r,o){const a=new Fc,c=new Uv,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return y===0?"uv":`uv${y}`}function p(y,S,B,H,Y){const D=H.fog,O=Y.geometry,W=y.isMeshStandardMaterial?H.environment:null,j=(y.isMeshStandardMaterial?e:t).get(y.envMap||W),$=j&&j.mapping===Qo?j.image.height:null,X=g[y.type];y.precision!==null&&(m=s.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));const q=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,rt=q!==void 0?q.length:0;let ct=0;O.morphAttributes.position!==void 0&&(ct=1),O.morphAttributes.normal!==void 0&&(ct=2),O.morphAttributes.color!==void 0&&(ct=3);let G,K,pt,wt;if(X){const we=zn[X];G=we.vertexShader,K=we.fragmentShader}else G=y.vertexShader,K=y.fragmentShader,c.update(y),pt=c.getVertexShaderID(y),wt=c.getFragmentShaderID(y);const St=n.getRenderTarget(),kt=Y.isInstancedMesh===!0,Bt=Y.isBatchedMesh===!0,Lt=!!y.map,Zt=!!y.matcap,z=!!j,We=!!y.aoMap,Rt=!!y.lightMap,Ut=!!y.bumpMap,yt=!!y.normalMap,ue=!!y.displacementMap,Wt=!!y.emissiveMap,A=!!y.metalnessMap,b=!!y.roughnessMap,N=y.anisotropy>0,et=y.clearcoat>0,Z=y.iridescence>0,nt=y.sheen>0,bt=y.transmission>0,ft=N&&!!y.anisotropyMap,xt=et&&!!y.clearcoatMap,Pt=et&&!!y.clearcoatNormalMap,Gt=et&&!!y.clearcoatRoughnessMap,J=Z&&!!y.iridescenceMap,oe=Z&&!!y.iridescenceThicknessMap,qt=nt&&!!y.sheenColorMap,Nt=nt&&!!y.sheenRoughnessMap,At=!!y.specularMap,mt=!!y.specularColorMap,P=!!y.specularIntensityMap,it=bt&&!!y.transmissionMap,Et=bt&&!!y.thicknessMap,_t=!!y.gradientMap,Q=!!y.alphaMap,L=y.alphaTest>0,st=!!y.alphaHash,ut=!!y.extensions,Dt=!!O.attributes.uv1,Ct=!!O.attributes.uv2,Qt=!!O.attributes.uv3;let te=Ei;return y.toneMapped&&(St===null||St.isXRRenderTarget===!0)&&(te=n.toneMapping),{isWebGL2:h,shaderID:X,shaderType:y.type,shaderName:y.name,vertexShader:G,fragmentShader:K,defines:y.defines,customVertexShaderID:pt,customFragmentShaderID:wt,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,batching:Bt,instancing:kt,instancingColor:kt&&Y.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:St===null?n.outputColorSpace:St.isXRRenderTarget===!0?St.texture.colorSpace:li,map:Lt,matcap:Zt,envMap:z,envMapMode:z&&j.mapping,envMapCubeUVHeight:$,aoMap:We,lightMap:Rt,bumpMap:Ut,normalMap:yt,displacementMap:d&&ue,emissiveMap:Wt,normalMapObjectSpace:yt&&y.normalMapType===Wp,normalMapTangentSpace:yt&&y.normalMapType===zc,metalnessMap:A,roughnessMap:b,anisotropy:N,anisotropyMap:ft,clearcoat:et,clearcoatMap:xt,clearcoatNormalMap:Pt,clearcoatRoughnessMap:Gt,iridescence:Z,iridescenceMap:J,iridescenceThicknessMap:oe,sheen:nt,sheenColorMap:qt,sheenRoughnessMap:Nt,specularMap:At,specularColorMap:mt,specularIntensityMap:P,transmission:bt,transmissionMap:it,thicknessMap:Et,gradientMap:_t,opaque:y.transparent===!1&&y.blending===Vs,alphaMap:Q,alphaTest:L,alphaHash:st,combine:y.combine,mapUv:Lt&&_(y.map.channel),aoMapUv:We&&_(y.aoMap.channel),lightMapUv:Rt&&_(y.lightMap.channel),bumpMapUv:Ut&&_(y.bumpMap.channel),normalMapUv:yt&&_(y.normalMap.channel),displacementMapUv:ue&&_(y.displacementMap.channel),emissiveMapUv:Wt&&_(y.emissiveMap.channel),metalnessMapUv:A&&_(y.metalnessMap.channel),roughnessMapUv:b&&_(y.roughnessMap.channel),anisotropyMapUv:ft&&_(y.anisotropyMap.channel),clearcoatMapUv:xt&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:Pt&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Gt&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:qt&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&_(y.sheenRoughnessMap.channel),specularMapUv:At&&_(y.specularMap.channel),specularColorMapUv:mt&&_(y.specularColorMap.channel),specularIntensityMapUv:P&&_(y.specularIntensityMap.channel),transmissionMapUv:it&&_(y.transmissionMap.channel),thicknessMapUv:Et&&_(y.thicknessMap.channel),alphaMapUv:Q&&_(y.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(yt||N),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,vertexUv1s:Dt,vertexUv2s:Ct,vertexUv3s:Qt,pointsUvs:Y.isPoints===!0&&!!O.attributes.uv&&(Lt||Q),fog:!!D,useFog:y.fog===!0,fogExp2:D&&D.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:Y.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:rt,morphTextureStride:ct,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&B.length>0,shadowMapType:n.shadowMap.type,toneMapping:te,useLegacyLights:n._useLegacyLights,decodeVideoTexture:Lt&&y.map.isVideoTexture===!0&&le.getTransfer(y.map.colorSpace)===fe,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===_n,flipSided:y.side===cn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:ut&&y.extensions.derivatives===!0,extensionFragDepth:ut&&y.extensions.fragDepth===!0,extensionDrawBuffers:ut&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:ut&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ut&&y.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function f(y){const S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(const B in y.defines)S.push(B),S.push(y.defines[B]);return y.isRawShaderMaterial===!1&&(v(S,y),x(S,y),S.push(n.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function v(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function x(y,S){a.disableAll(),S.isWebGL2&&a.enable(0),S.supportsVertexTextures&&a.enable(1),S.instancing&&a.enable(2),S.instancingColor&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),y.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.skinning&&a.enable(4),S.morphTargets&&a.enable(5),S.morphNormals&&a.enable(6),S.morphColors&&a.enable(7),S.premultipliedAlpha&&a.enable(8),S.shadowMapEnabled&&a.enable(9),S.useLegacyLights&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),y.push(a.mask)}function M(y){const S=g[y.type];let B;if(S){const H=zn[S];B=vm.clone(H.uniforms)}else B=y.uniforms;return B}function R(y,S){let B;for(let H=0,Y=l.length;H<Y;H++){const D=l[H];if(D.cacheKey===S){B=D,++B.usedTimes;break}}return B===void 0&&(B=new Dv(n,S,y,r),l.push(B)),B}function E(y){if(--y.usedTimes===0){const S=l.indexOf(y);l[S]=l[l.length-1],l.pop(),y.destroy()}}function T(y){c.remove(y)}function U(){c.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:M,acquireProgram:R,releaseProgram:E,releaseShaderCache:T,programs:l,dispose:U}}function Ov(){let n=new WeakMap;function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function e(r){n.delete(r)}function i(r,o,a){n.get(r)[o]=a}function s(){n=new WeakMap}return{get:t,remove:e,update:i,dispose:s}}function Fv(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Fh(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function kh(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(u,d,m,g,_,p){let f=n[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:m,groupOrder:g,renderOrder:u.renderOrder,z:_,group:p},n[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=m,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=p),t++,f}function a(u,d,m,g,_,p){const f=o(u,d,m,g,_,p);m.transmission>0?i.push(f):m.transparent===!0?s.push(f):e.push(f)}function c(u,d,m,g,_,p){const f=o(u,d,m,g,_,p);m.transmission>0?i.unshift(f):m.transparent===!0?s.unshift(f):e.unshift(f)}function l(u,d){e.length>1&&e.sort(u||Fv),i.length>1&&i.sort(d||Fh),s.length>1&&s.sort(d||Fh)}function h(){for(let u=t,d=n.length;u<d;u++){const m=n[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function kv(){let n=new WeakMap;function t(i,s){const r=n.get(i);let o;return r===void 0?(o=new kh,n.set(i,[o])):s>=r.length?(o=new kh,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function Bv(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new jt};break;case"SpotLight":e={position:new C,direction:new C,color:new jt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new jt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new jt,groundColor:new jt};break;case"RectAreaLight":e={color:new jt,position:new C,halfWidth:new C,halfHeight:new C};break}return n[t.id]=e,e}}}function Hv(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Vv=0;function Wv(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Gv(n,t){const e=new Bv,i=Hv(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new C);const r=new C,o=new ae,a=new ae;function c(h,u){let d=0,m=0,g=0;for(let H=0;H<9;H++)s.probe[H].set(0,0,0);let _=0,p=0,f=0,v=0,x=0,M=0,R=0,E=0,T=0,U=0,y=0;h.sort(Wv);const S=u===!0?Math.PI:1;for(let H=0,Y=h.length;H<Y;H++){const D=h[H],O=D.color,W=D.intensity,j=D.distance,$=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=O.r*W*S,m+=O.g*W*S,g+=O.b*W*S;else if(D.isLightProbe){for(let X=0;X<9;X++)s.probe[X].addScaledVector(D.sh.coefficients[X],W);y++}else if(D.isDirectionalLight){const X=e.get(D);if(X.color.copy(D.color).multiplyScalar(D.intensity*S),D.castShadow){const q=D.shadow,rt=i.get(D);rt.shadowBias=q.bias,rt.shadowNormalBias=q.normalBias,rt.shadowRadius=q.radius,rt.shadowMapSize=q.mapSize,s.directionalShadow[_]=rt,s.directionalShadowMap[_]=$,s.directionalShadowMatrix[_]=D.shadow.matrix,M++}s.directional[_]=X,_++}else if(D.isSpotLight){const X=e.get(D);X.position.setFromMatrixPosition(D.matrixWorld),X.color.copy(O).multiplyScalar(W*S),X.distance=j,X.coneCos=Math.cos(D.angle),X.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),X.decay=D.decay,s.spot[f]=X;const q=D.shadow;if(D.map&&(s.spotLightMap[T]=D.map,T++,q.updateMatrices(D),D.castShadow&&U++),s.spotLightMatrix[f]=q.matrix,D.castShadow){const rt=i.get(D);rt.shadowBias=q.bias,rt.shadowNormalBias=q.normalBias,rt.shadowRadius=q.radius,rt.shadowMapSize=q.mapSize,s.spotShadow[f]=rt,s.spotShadowMap[f]=$,E++}f++}else if(D.isRectAreaLight){const X=e.get(D);X.color.copy(O).multiplyScalar(W),X.halfWidth.set(D.width*.5,0,0),X.halfHeight.set(0,D.height*.5,0),s.rectArea[v]=X,v++}else if(D.isPointLight){const X=e.get(D);if(X.color.copy(D.color).multiplyScalar(D.intensity*S),X.distance=D.distance,X.decay=D.decay,D.castShadow){const q=D.shadow,rt=i.get(D);rt.shadowBias=q.bias,rt.shadowNormalBias=q.normalBias,rt.shadowRadius=q.radius,rt.shadowMapSize=q.mapSize,rt.shadowCameraNear=q.camera.near,rt.shadowCameraFar=q.camera.far,s.pointShadow[p]=rt,s.pointShadowMap[p]=$,s.pointShadowMatrix[p]=D.shadow.matrix,R++}s.point[p]=X,p++}else if(D.isHemisphereLight){const X=e.get(D);X.skyColor.copy(D.color).multiplyScalar(W*S),X.groundColor.copy(D.groundColor).multiplyScalar(W*S),s.hemi[x]=X,x++}}v>0&&(t.isWebGL2?n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_FLOAT_1,s.rectAreaLTC2=lt.LTC_FLOAT_2):(s.rectAreaLTC1=lt.LTC_HALF_1,s.rectAreaLTC2=lt.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_FLOAT_1,s.rectAreaLTC2=lt.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_HALF_1,s.rectAreaLTC2=lt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=m,s.ambient[2]=g;const B=s.hash;(B.directionalLength!==_||B.pointLength!==p||B.spotLength!==f||B.rectAreaLength!==v||B.hemiLength!==x||B.numDirectionalShadows!==M||B.numPointShadows!==R||B.numSpotShadows!==E||B.numSpotMaps!==T||B.numLightProbes!==y)&&(s.directional.length=_,s.spot.length=f,s.rectArea.length=v,s.point.length=p,s.hemi.length=x,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=E,s.spotShadowMap.length=E,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=E+T-U,s.spotLightMap.length=T,s.numSpotLightShadowsWithMaps=U,s.numLightProbes=y,B.directionalLength=_,B.pointLength=p,B.spotLength=f,B.rectAreaLength=v,B.hemiLength=x,B.numDirectionalShadows=M,B.numPointShadows=R,B.numSpotShadows=E,B.numSpotMaps=T,B.numLightProbes=y,s.version=Vv++)}function l(h,u){let d=0,m=0,g=0,_=0,p=0;const f=u.matrixWorldInverse;for(let v=0,x=h.length;v<x;v++){const M=h[v];if(M.isDirectionalLight){const R=s.directional[d];R.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(f),d++}else if(M.isSpotLight){const R=s.spot[g];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(f),R.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(f),g++}else if(M.isRectAreaLight){const R=s.rectArea[_];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(f),a.identity(),o.copy(M.matrixWorld),o.premultiply(f),a.extractRotation(o),R.halfWidth.set(M.width*.5,0,0),R.halfHeight.set(0,M.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),_++}else if(M.isPointLight){const R=s.point[m];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(f),m++}else if(M.isHemisphereLight){const R=s.hemi[p];R.direction.setFromMatrixPosition(M.matrixWorld),R.direction.transformDirection(f),p++}}}return{setup:c,setupView:l,state:s}}function Bh(n,t){const e=new Gv(n,t),i=[],s=[];function r(){i.length=0,s.length=0}function o(u){i.push(u)}function a(u){s.push(u)}function c(u){e.setup(i,u)}function l(u){e.setupView(i,u)}return{init:r,state:{lightsArray:i,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function $v(n,t){let e=new WeakMap;function i(r,o=0){const a=e.get(r);let c;return a===void 0?(c=new Bh(n,t),e.set(r,[c])):o>=a.length?(c=new Bh(n,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:i,dispose:s}}class Xv extends ls{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class jv extends ls{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const qv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Yv=`uniform sampler2D shadow_pass;
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
}`;function Kv(n,t,e){let i=new kc;const s=new ht,r=new ht,o=new me,a=new Xv({depthPacking:Vp}),c=new jv,l={},h=e.maxTextureSize,u={[Pi]:cn,[cn]:Pi,[_n]:_n},d=new ss({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:qv,fragmentShader:Yv}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const g=new Ae;g.setAttribute("position",new xn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ht(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ju;let f=this.type;this.render=function(E,T,U){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;const y=n.getRenderTarget(),S=n.getActiveCubeFace(),B=n.getActiveMipmapLevel(),H=n.state;H.setBlending(Si),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const Y=f!==ni&&this.type===ni,D=f===ni&&this.type!==ni;for(let O=0,W=E.length;O<W;O++){const j=E[O],$=j.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const X=$.getFrameExtents();if(s.multiply(X),r.copy($.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/X.x),s.x=r.x*X.x,$.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/X.y),s.y=r.y*X.y,$.mapSize.y=r.y)),$.map===null||Y===!0||D===!0){const rt=this.type!==ni?{minFilter:Ge,magFilter:Ge}:{};$.map!==null&&$.map.dispose(),$.map=new is(s.x,s.y,rt),$.map.texture.name=j.name+".shadowMap",$.camera.updateProjectionMatrix()}n.setRenderTarget($.map),n.clear();const q=$.getViewportCount();for(let rt=0;rt<q;rt++){const ct=$.getViewport(rt);o.set(r.x*ct.x,r.y*ct.y,r.x*ct.z,r.y*ct.w),H.viewport(o),$.updateMatrices(j,rt),i=$.getFrustum(),M(T,U,$.camera,j,this.type)}$.isPointLightShadow!==!0&&this.type===ni&&v($,U),$.needsUpdate=!1}f=this.type,p.needsUpdate=!1,n.setRenderTarget(y,S,B)};function v(E,T){const U=t.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,m.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new is(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(T,null,U,d,_,null),m.uniforms.shadow_pass.value=E.mapPass.texture,m.uniforms.resolution.value=E.mapSize,m.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(T,null,U,m,_,null)}function x(E,T,U,y){let S=null;const B=U.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(B!==void 0)S=B;else if(S=U.isPointLight===!0?c:a,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const H=S.uuid,Y=T.uuid;let D=l[H];D===void 0&&(D={},l[H]=D);let O=D[Y];O===void 0&&(O=S.clone(),D[Y]=O,T.addEventListener("dispose",R)),S=O}if(S.visible=T.visible,S.wireframe=T.wireframe,y===ni?S.side=T.shadowSide!==null?T.shadowSide:T.side:S.side=T.shadowSide!==null?T.shadowSide:u[T.side],S.alphaMap=T.alphaMap,S.alphaTest=T.alphaTest,S.map=T.map,S.clipShadows=T.clipShadows,S.clippingPlanes=T.clippingPlanes,S.clipIntersection=T.clipIntersection,S.displacementMap=T.displacementMap,S.displacementScale=T.displacementScale,S.displacementBias=T.displacementBias,S.wireframeLinewidth=T.wireframeLinewidth,S.linewidth=T.linewidth,U.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const H=n.properties.get(S);H.light=U}return S}function M(E,T,U,y,S){if(E.visible===!1)return;if(E.layers.test(T.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&S===ni)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,E.matrixWorld);const Y=t.update(E),D=E.material;if(Array.isArray(D)){const O=Y.groups;for(let W=0,j=O.length;W<j;W++){const $=O[W],X=D[$.materialIndex];if(X&&X.visible){const q=x(E,X,y,S);E.onBeforeShadow(n,E,T,U,Y,q,$),n.renderBufferDirect(U,null,Y,q,E,$),E.onAfterShadow(n,E,T,U,Y,q,$)}}}else if(D.visible){const O=x(E,D,y,S);E.onBeforeShadow(n,E,T,U,Y,O,null),n.renderBufferDirect(U,null,Y,O,E,null),E.onAfterShadow(n,E,T,U,Y,O,null)}}const H=E.children;for(let Y=0,D=H.length;Y<D;Y++)M(H[Y],T,U,y,S)}function R(E){E.target.removeEventListener("dispose",R);for(const U in l){const y=l[U],S=E.target.uuid;S in y&&(y[S].dispose(),delete y[S])}}}function Jv(n,t,e){const i=e.isWebGL2;function s(){let L=!1;const st=new me;let ut=null;const Dt=new me(0,0,0,0);return{setMask:function(Ct){ut!==Ct&&!L&&(n.colorMask(Ct,Ct,Ct,Ct),ut=Ct)},setLocked:function(Ct){L=Ct},setClear:function(Ct,Qt,te,be,we){we===!0&&(Ct*=be,Qt*=be,te*=be),st.set(Ct,Qt,te,be),Dt.equals(st)===!1&&(n.clearColor(Ct,Qt,te,be),Dt.copy(st))},reset:function(){L=!1,ut=null,Dt.set(-1,0,0,0)}}}function r(){let L=!1,st=null,ut=null,Dt=null;return{setTest:function(Ct){Ct?Bt(n.DEPTH_TEST):Lt(n.DEPTH_TEST)},setMask:function(Ct){st!==Ct&&!L&&(n.depthMask(Ct),st=Ct)},setFunc:function(Ct){if(ut!==Ct){switch(Ct){case vp:n.depthFunc(n.NEVER);break;case xp:n.depthFunc(n.ALWAYS);break;case Mp:n.depthFunc(n.LESS);break;case Fo:n.depthFunc(n.LEQUAL);break;case yp:n.depthFunc(n.EQUAL);break;case bp:n.depthFunc(n.GEQUAL);break;case Sp:n.depthFunc(n.GREATER);break;case Ep:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ut=Ct}},setLocked:function(Ct){L=Ct},setClear:function(Ct){Dt!==Ct&&(n.clearDepth(Ct),Dt=Ct)},reset:function(){L=!1,st=null,ut=null,Dt=null}}}function o(){let L=!1,st=null,ut=null,Dt=null,Ct=null,Qt=null,te=null,be=null,we=null;return{setTest:function(ne){L||(ne?Bt(n.STENCIL_TEST):Lt(n.STENCIL_TEST))},setMask:function(ne){st!==ne&&!L&&(n.stencilMask(ne),st=ne)},setFunc:function(ne,Re,Un){(ut!==ne||Dt!==Re||Ct!==Un)&&(n.stencilFunc(ne,Re,Un),ut=ne,Dt=Re,Ct=Un)},setOp:function(ne,Re,Un){(Qt!==ne||te!==Re||be!==Un)&&(n.stencilOp(ne,Re,Un),Qt=ne,te=Re,be=Un)},setLocked:function(ne){L=ne},setClear:function(ne){we!==ne&&(n.clearStencil(ne),we=ne)},reset:function(){L=!1,st=null,ut=null,Dt=null,Ct=null,Qt=null,te=null,be=null,we=null}}}const a=new s,c=new r,l=new o,h=new WeakMap,u=new WeakMap;let d={},m={},g=new WeakMap,_=[],p=null,f=!1,v=null,x=null,M=null,R=null,E=null,T=null,U=null,y=new jt(0,0,0),S=0,B=!1,H=null,Y=null,D=null,O=null,W=null;const j=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,X=0;const q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(q)[1]),$=X>=1):q.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),$=X>=2);let rt=null,ct={};const G=n.getParameter(n.SCISSOR_BOX),K=n.getParameter(n.VIEWPORT),pt=new me().fromArray(G),wt=new me().fromArray(K);function St(L,st,ut,Dt){const Ct=new Uint8Array(4),Qt=n.createTexture();n.bindTexture(L,Qt),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let te=0;te<ut;te++)i&&(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)?n.texImage3D(st,0,n.RGBA,1,1,Dt,0,n.RGBA,n.UNSIGNED_BYTE,Ct):n.texImage2D(st+te,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ct);return Qt}const kt={};kt[n.TEXTURE_2D]=St(n.TEXTURE_2D,n.TEXTURE_2D,1),kt[n.TEXTURE_CUBE_MAP]=St(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(kt[n.TEXTURE_2D_ARRAY]=St(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),kt[n.TEXTURE_3D]=St(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Bt(n.DEPTH_TEST),c.setFunc(Fo),Wt(!1),A(yl),Bt(n.CULL_FACE),yt(Si);function Bt(L){d[L]!==!0&&(n.enable(L),d[L]=!0)}function Lt(L){d[L]!==!1&&(n.disable(L),d[L]=!1)}function Zt(L,st){return m[L]!==st?(n.bindFramebuffer(L,st),m[L]=st,i&&(L===n.DRAW_FRAMEBUFFER&&(m[n.FRAMEBUFFER]=st),L===n.FRAMEBUFFER&&(m[n.DRAW_FRAMEBUFFER]=st)),!0):!1}function z(L,st){let ut=_,Dt=!1;if(L)if(ut=g.get(st),ut===void 0&&(ut=[],g.set(st,ut)),L.isWebGLMultipleRenderTargets){const Ct=L.texture;if(ut.length!==Ct.length||ut[0]!==n.COLOR_ATTACHMENT0){for(let Qt=0,te=Ct.length;Qt<te;Qt++)ut[Qt]=n.COLOR_ATTACHMENT0+Qt;ut.length=Ct.length,Dt=!0}}else ut[0]!==n.COLOR_ATTACHMENT0&&(ut[0]=n.COLOR_ATTACHMENT0,Dt=!0);else ut[0]!==n.BACK&&(ut[0]=n.BACK,Dt=!0);Dt&&(e.isWebGL2?n.drawBuffers(ut):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ut))}function We(L){return p!==L?(n.useProgram(L),p=L,!0):!1}const Rt={[qi]:n.FUNC_ADD,[ip]:n.FUNC_SUBTRACT,[sp]:n.FUNC_REVERSE_SUBTRACT};if(i)Rt[wl]=n.MIN,Rt[Tl]=n.MAX;else{const L=t.get("EXT_blend_minmax");L!==null&&(Rt[wl]=L.MIN_EXT,Rt[Tl]=L.MAX_EXT)}const Ut={[rp]:n.ZERO,[op]:n.ONE,[ap]:n.SRC_COLOR,[uc]:n.SRC_ALPHA,[dp]:n.SRC_ALPHA_SATURATE,[up]:n.DST_COLOR,[lp]:n.DST_ALPHA,[cp]:n.ONE_MINUS_SRC_COLOR,[fc]:n.ONE_MINUS_SRC_ALPHA,[fp]:n.ONE_MINUS_DST_COLOR,[hp]:n.ONE_MINUS_DST_ALPHA,[pp]:n.CONSTANT_COLOR,[mp]:n.ONE_MINUS_CONSTANT_COLOR,[gp]:n.CONSTANT_ALPHA,[_p]:n.ONE_MINUS_CONSTANT_ALPHA};function yt(L,st,ut,Dt,Ct,Qt,te,be,we,ne){if(L===Si){f===!0&&(Lt(n.BLEND),f=!1);return}if(f===!1&&(Bt(n.BLEND),f=!0),L!==np){if(L!==v||ne!==B){if((x!==qi||E!==qi)&&(n.blendEquation(n.FUNC_ADD),x=qi,E=qi),ne)switch(L){case Vs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case bl:n.blendFunc(n.ONE,n.ONE);break;case Sl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case El:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Vs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case bl:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Sl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case El:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}M=null,R=null,T=null,U=null,y.set(0,0,0),S=0,v=L,B=ne}return}Ct=Ct||st,Qt=Qt||ut,te=te||Dt,(st!==x||Ct!==E)&&(n.blendEquationSeparate(Rt[st],Rt[Ct]),x=st,E=Ct),(ut!==M||Dt!==R||Qt!==T||te!==U)&&(n.blendFuncSeparate(Ut[ut],Ut[Dt],Ut[Qt],Ut[te]),M=ut,R=Dt,T=Qt,U=te),(be.equals(y)===!1||we!==S)&&(n.blendColor(be.r,be.g,be.b,we),y.copy(be),S=we),v=L,B=!1}function ue(L,st){L.side===_n?Lt(n.CULL_FACE):Bt(n.CULL_FACE);let ut=L.side===cn;st&&(ut=!ut),Wt(ut),L.blending===Vs&&L.transparent===!1?yt(Si):yt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),c.setFunc(L.depthFunc),c.setTest(L.depthTest),c.setMask(L.depthWrite),a.setMask(L.colorWrite);const Dt=L.stencilWrite;l.setTest(Dt),Dt&&(l.setMask(L.stencilWriteMask),l.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),l.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),N(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Bt(n.SAMPLE_ALPHA_TO_COVERAGE):Lt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Wt(L){H!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),H=L)}function A(L){L!==tp?(Bt(n.CULL_FACE),L!==Y&&(L===yl?n.cullFace(n.BACK):L===ep?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Lt(n.CULL_FACE),Y=L}function b(L){L!==D&&($&&n.lineWidth(L),D=L)}function N(L,st,ut){L?(Bt(n.POLYGON_OFFSET_FILL),(O!==st||W!==ut)&&(n.polygonOffset(st,ut),O=st,W=ut)):Lt(n.POLYGON_OFFSET_FILL)}function et(L){L?Bt(n.SCISSOR_TEST):Lt(n.SCISSOR_TEST)}function Z(L){L===void 0&&(L=n.TEXTURE0+j-1),rt!==L&&(n.activeTexture(L),rt=L)}function nt(L,st,ut){ut===void 0&&(rt===null?ut=n.TEXTURE0+j-1:ut=rt);let Dt=ct[ut];Dt===void 0&&(Dt={type:void 0,texture:void 0},ct[ut]=Dt),(Dt.type!==L||Dt.texture!==st)&&(rt!==ut&&(n.activeTexture(ut),rt=ut),n.bindTexture(L,st||kt[L]),Dt.type=L,Dt.texture=st)}function bt(){const L=ct[rt];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function ft(){try{n.compressedTexImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Pt(){try{n.texSubImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Gt(){try{n.texSubImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function oe(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function qt(){try{n.texStorage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Nt(){try{n.texStorage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function At(){try{n.texImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function mt(){try{n.texImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function P(L){pt.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),pt.copy(L))}function it(L){wt.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),wt.copy(L))}function Et(L,st){let ut=u.get(st);ut===void 0&&(ut=new WeakMap,u.set(st,ut));let Dt=ut.get(L);Dt===void 0&&(Dt=n.getUniformBlockIndex(st,L.name),ut.set(L,Dt))}function _t(L,st){const Dt=u.get(st).get(L);h.get(st)!==Dt&&(n.uniformBlockBinding(st,Dt,L.__bindingPointIndex),h.set(st,Dt))}function Q(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},rt=null,ct={},m={},g=new WeakMap,_=[],p=null,f=!1,v=null,x=null,M=null,R=null,E=null,T=null,U=null,y=new jt(0,0,0),S=0,B=!1,H=null,Y=null,D=null,O=null,W=null,pt.set(0,0,n.canvas.width,n.canvas.height),wt.set(0,0,n.canvas.width,n.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:Bt,disable:Lt,bindFramebuffer:Zt,drawBuffers:z,useProgram:We,setBlending:yt,setMaterial:ue,setFlipSided:Wt,setCullFace:A,setLineWidth:b,setPolygonOffset:N,setScissorTest:et,activeTexture:Z,bindTexture:nt,unbindTexture:bt,compressedTexImage2D:ft,compressedTexImage3D:xt,texImage2D:At,texImage3D:mt,updateUBOMapping:Et,uniformBlockBinding:_t,texStorage2D:qt,texStorage3D:Nt,texSubImage2D:Pt,texSubImage3D:Gt,compressedTexSubImage2D:J,compressedTexSubImage3D:oe,scissor:P,viewport:it,reset:Q}}function Zv(n,t,e,i,s,r,o){const a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,b){return m?new OffscreenCanvas(A,b):Go("canvas")}function _(A,b,N,et){let Z=1;if((A.width>et||A.height>et)&&(Z=et/Math.max(A.width,A.height)),Z<1||b===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){const nt=b?vc:Math.floor,bt=nt(Z*A.width),ft=nt(Z*A.height);u===void 0&&(u=g(bt,ft));const xt=N?g(bt,ft):u;return xt.width=bt,xt.height=ft,xt.getContext("2d").drawImage(A,0,0,bt,ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+bt+"x"+ft+")."),xt}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function p(A){return nh(A.width)&&nh(A.height)}function f(A){return a?!1:A.wrapS!==Pn||A.wrapT!==Pn||A.minFilter!==Ge&&A.minFilter!==on}function v(A,b){return A.generateMipmaps&&b&&A.minFilter!==Ge&&A.minFilter!==on}function x(A){n.generateMipmap(A)}function M(A,b,N,et,Z=!1){if(a===!1)return b;if(A!==null){if(n[A]!==void 0)return n[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let nt=b;if(b===n.RED&&(N===n.FLOAT&&(nt=n.R32F),N===n.HALF_FLOAT&&(nt=n.R16F),N===n.UNSIGNED_BYTE&&(nt=n.R8)),b===n.RED_INTEGER&&(N===n.UNSIGNED_BYTE&&(nt=n.R8UI),N===n.UNSIGNED_SHORT&&(nt=n.R16UI),N===n.UNSIGNED_INT&&(nt=n.R32UI),N===n.BYTE&&(nt=n.R8I),N===n.SHORT&&(nt=n.R16I),N===n.INT&&(nt=n.R32I)),b===n.RG&&(N===n.FLOAT&&(nt=n.RG32F),N===n.HALF_FLOAT&&(nt=n.RG16F),N===n.UNSIGNED_BYTE&&(nt=n.RG8)),b===n.RGBA){const bt=Z?Bo:le.getTransfer(et);N===n.FLOAT&&(nt=n.RGBA32F),N===n.HALF_FLOAT&&(nt=n.RGBA16F),N===n.UNSIGNED_BYTE&&(nt=bt===fe?n.SRGB8_ALPHA8:n.RGBA8),N===n.UNSIGNED_SHORT_4_4_4_4&&(nt=n.RGBA4),N===n.UNSIGNED_SHORT_5_5_5_1&&(nt=n.RGB5_A1)}return(nt===n.R16F||nt===n.R32F||nt===n.RG16F||nt===n.RG32F||nt===n.RGBA16F||nt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function R(A,b,N){return v(A,N)===!0||A.isFramebufferTexture&&A.minFilter!==Ge&&A.minFilter!==on?Math.log2(Math.max(b.width,b.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?b.mipmaps.length:1}function E(A){return A===Ge||A===Al||A===xa?n.NEAREST:n.LINEAR}function T(A){const b=A.target;b.removeEventListener("dispose",T),y(b),b.isVideoTexture&&h.delete(b)}function U(A){const b=A.target;b.removeEventListener("dispose",U),B(b)}function y(A){const b=i.get(A);if(b.__webglInit===void 0)return;const N=A.source,et=d.get(N);if(et){const Z=et[b.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&S(A),Object.keys(et).length===0&&d.delete(N)}i.remove(A)}function S(A){const b=i.get(A);n.deleteTexture(b.__webglTexture);const N=A.source,et=d.get(N);delete et[b.__cacheKey],o.memory.textures--}function B(A){const b=A.texture,N=i.get(A),et=i.get(b);if(et.__webglTexture!==void 0&&(n.deleteTexture(et.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(N.__webglFramebuffer[Z]))for(let nt=0;nt<N.__webglFramebuffer[Z].length;nt++)n.deleteFramebuffer(N.__webglFramebuffer[Z][nt]);else n.deleteFramebuffer(N.__webglFramebuffer[Z]);N.__webglDepthbuffer&&n.deleteRenderbuffer(N.__webglDepthbuffer[Z])}else{if(Array.isArray(N.__webglFramebuffer))for(let Z=0;Z<N.__webglFramebuffer.length;Z++)n.deleteFramebuffer(N.__webglFramebuffer[Z]);else n.deleteFramebuffer(N.__webglFramebuffer);if(N.__webglDepthbuffer&&n.deleteRenderbuffer(N.__webglDepthbuffer),N.__webglMultisampledFramebuffer&&n.deleteFramebuffer(N.__webglMultisampledFramebuffer),N.__webglColorRenderbuffer)for(let Z=0;Z<N.__webglColorRenderbuffer.length;Z++)N.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(N.__webglColorRenderbuffer[Z]);N.__webglDepthRenderbuffer&&n.deleteRenderbuffer(N.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let Z=0,nt=b.length;Z<nt;Z++){const bt=i.get(b[Z]);bt.__webglTexture&&(n.deleteTexture(bt.__webglTexture),o.memory.textures--),i.remove(b[Z])}i.remove(b),i.remove(A)}let H=0;function Y(){H=0}function D(){const A=H;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),H+=1,A}function O(A){const b=[];return b.push(A.wrapS),b.push(A.wrapT),b.push(A.wrapR||0),b.push(A.magFilter),b.push(A.minFilter),b.push(A.anisotropy),b.push(A.internalFormat),b.push(A.format),b.push(A.type),b.push(A.generateMipmaps),b.push(A.premultiplyAlpha),b.push(A.flipY),b.push(A.unpackAlignment),b.push(A.colorSpace),b.join()}function W(A,b){const N=i.get(A);if(A.isVideoTexture&&ue(A),A.isRenderTargetTexture===!1&&A.version>0&&N.__version!==A.version){const et=A.image;if(et===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(et.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{pt(N,A,b);return}}e.bindTexture(n.TEXTURE_2D,N.__webglTexture,n.TEXTURE0+b)}function j(A,b){const N=i.get(A);if(A.version>0&&N.__version!==A.version){pt(N,A,b);return}e.bindTexture(n.TEXTURE_2D_ARRAY,N.__webglTexture,n.TEXTURE0+b)}function $(A,b){const N=i.get(A);if(A.version>0&&N.__version!==A.version){pt(N,A,b);return}e.bindTexture(n.TEXTURE_3D,N.__webglTexture,n.TEXTURE0+b)}function X(A,b){const N=i.get(A);if(A.version>0&&N.__version!==A.version){wt(N,A,b);return}e.bindTexture(n.TEXTURE_CUBE_MAP,N.__webglTexture,n.TEXTURE0+b)}const q={[ko]:n.REPEAT,[Pn]:n.CLAMP_TO_EDGE,[mc]:n.MIRRORED_REPEAT},rt={[Ge]:n.NEAREST,[Al]:n.NEAREST_MIPMAP_NEAREST,[xa]:n.NEAREST_MIPMAP_LINEAR,[on]:n.LINEAR,[Dp]:n.LINEAR_MIPMAP_NEAREST,[Dr]:n.LINEAR_MIPMAP_LINEAR},ct={[Gp]:n.NEVER,[Kp]:n.ALWAYS,[$p]:n.LESS,[of]:n.LEQUAL,[Xp]:n.EQUAL,[Yp]:n.GEQUAL,[jp]:n.GREATER,[qp]:n.NOTEQUAL};function G(A,b,N){if(N?(n.texParameteri(A,n.TEXTURE_WRAP_S,q[b.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,q[b.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,q[b.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,rt[b.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,rt[b.minFilter])):(n.texParameteri(A,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(A,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(b.wrapS!==Pn||b.wrapT!==Pn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(A,n.TEXTURE_MAG_FILTER,E(b.magFilter)),n.texParameteri(A,n.TEXTURE_MIN_FILTER,E(b.minFilter)),b.minFilter!==Ge&&b.minFilter!==on&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),b.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,ct[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const et=t.get("EXT_texture_filter_anisotropic");if(b.magFilter===Ge||b.minFilter!==xa&&b.minFilter!==Dr||b.type===bi&&t.has("OES_texture_float_linear")===!1||a===!1&&b.type===Ir&&t.has("OES_texture_half_float_linear")===!1)return;(b.anisotropy>1||i.get(b).__currentAnisotropy)&&(n.texParameterf(A,et.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy)}}function K(A,b){let N=!1;A.__webglInit===void 0&&(A.__webglInit=!0,b.addEventListener("dispose",T));const et=b.source;let Z=d.get(et);Z===void 0&&(Z={},d.set(et,Z));const nt=O(b);if(nt!==A.__cacheKey){Z[nt]===void 0&&(Z[nt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,N=!0),Z[nt].usedTimes++;const bt=Z[A.__cacheKey];bt!==void 0&&(Z[A.__cacheKey].usedTimes--,bt.usedTimes===0&&S(b)),A.__cacheKey=nt,A.__webglTexture=Z[nt].texture}return N}function pt(A,b,N){let et=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(et=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&(et=n.TEXTURE_3D);const Z=K(A,b),nt=b.source;e.bindTexture(et,A.__webglTexture,n.TEXTURE0+N);const bt=i.get(nt);if(nt.version!==bt.__version||Z===!0){e.activeTexture(n.TEXTURE0+N);const ft=le.getPrimaries(le.workingColorSpace),xt=b.colorSpace===Sn?null:le.getPrimaries(b.colorSpace),Pt=b.colorSpace===Sn||ft===xt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const Gt=f(b)&&p(b.image)===!1;let J=_(b.image,Gt,!1,s.maxTextureSize);J=Wt(b,J);const oe=p(J)||a,qt=r.convert(b.format,b.colorSpace);let Nt=r.convert(b.type),At=M(b.internalFormat,qt,Nt,b.colorSpace,b.isVideoTexture);G(et,b,oe);let mt;const P=b.mipmaps,it=a&&b.isVideoTexture!==!0&&At!==sf,Et=bt.__version===void 0||Z===!0,_t=R(b,J,oe);if(b.isDepthTexture)At=n.DEPTH_COMPONENT,a?b.type===bi?At=n.DEPTH_COMPONENT32F:b.type===yi?At=n.DEPTH_COMPONENT24:b.type===Ki?At=n.DEPTH24_STENCIL8:At=n.DEPTH_COMPONENT16:b.type===bi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),b.format===Ji&&At===n.DEPTH_COMPONENT&&b.type!==Nc&&b.type!==yi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),b.type=yi,Nt=r.convert(b.type)),b.format===Ks&&At===n.DEPTH_COMPONENT&&(At=n.DEPTH_STENCIL,b.type!==Ki&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),b.type=Ki,Nt=r.convert(b.type))),Et&&(it?e.texStorage2D(n.TEXTURE_2D,1,At,J.width,J.height):e.texImage2D(n.TEXTURE_2D,0,At,J.width,J.height,0,qt,Nt,null));else if(b.isDataTexture)if(P.length>0&&oe){it&&Et&&e.texStorage2D(n.TEXTURE_2D,_t,At,P[0].width,P[0].height);for(let Q=0,L=P.length;Q<L;Q++)mt=P[Q],it?e.texSubImage2D(n.TEXTURE_2D,Q,0,0,mt.width,mt.height,qt,Nt,mt.data):e.texImage2D(n.TEXTURE_2D,Q,At,mt.width,mt.height,0,qt,Nt,mt.data);b.generateMipmaps=!1}else it?(Et&&e.texStorage2D(n.TEXTURE_2D,_t,At,J.width,J.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,J.width,J.height,qt,Nt,J.data)):e.texImage2D(n.TEXTURE_2D,0,At,J.width,J.height,0,qt,Nt,J.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){it&&Et&&e.texStorage3D(n.TEXTURE_2D_ARRAY,_t,At,P[0].width,P[0].height,J.depth);for(let Q=0,L=P.length;Q<L;Q++)mt=P[Q],b.format!==bn?qt!==null?it?e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,mt.width,mt.height,J.depth,qt,mt.data,0,0):e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,At,mt.width,mt.height,J.depth,0,mt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):it?e.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,mt.width,mt.height,J.depth,qt,Nt,mt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,Q,At,mt.width,mt.height,J.depth,0,qt,Nt,mt.data)}else{it&&Et&&e.texStorage2D(n.TEXTURE_2D,_t,At,P[0].width,P[0].height);for(let Q=0,L=P.length;Q<L;Q++)mt=P[Q],b.format!==bn?qt!==null?it?e.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,mt.width,mt.height,qt,mt.data):e.compressedTexImage2D(n.TEXTURE_2D,Q,At,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):it?e.texSubImage2D(n.TEXTURE_2D,Q,0,0,mt.width,mt.height,qt,Nt,mt.data):e.texImage2D(n.TEXTURE_2D,Q,At,mt.width,mt.height,0,qt,Nt,mt.data)}else if(b.isDataArrayTexture)it?(Et&&e.texStorage3D(n.TEXTURE_2D_ARRAY,_t,At,J.width,J.height,J.depth),e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,qt,Nt,J.data)):e.texImage3D(n.TEXTURE_2D_ARRAY,0,At,J.width,J.height,J.depth,0,qt,Nt,J.data);else if(b.isData3DTexture)it?(Et&&e.texStorage3D(n.TEXTURE_3D,_t,At,J.width,J.height,J.depth),e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,qt,Nt,J.data)):e.texImage3D(n.TEXTURE_3D,0,At,J.width,J.height,J.depth,0,qt,Nt,J.data);else if(b.isFramebufferTexture){if(Et)if(it)e.texStorage2D(n.TEXTURE_2D,_t,At,J.width,J.height);else{let Q=J.width,L=J.height;for(let st=0;st<_t;st++)e.texImage2D(n.TEXTURE_2D,st,At,Q,L,0,qt,Nt,null),Q>>=1,L>>=1}}else if(P.length>0&&oe){it&&Et&&e.texStorage2D(n.TEXTURE_2D,_t,At,P[0].width,P[0].height);for(let Q=0,L=P.length;Q<L;Q++)mt=P[Q],it?e.texSubImage2D(n.TEXTURE_2D,Q,0,0,qt,Nt,mt):e.texImage2D(n.TEXTURE_2D,Q,At,qt,Nt,mt);b.generateMipmaps=!1}else it?(Et&&e.texStorage2D(n.TEXTURE_2D,_t,At,J.width,J.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,qt,Nt,J)):e.texImage2D(n.TEXTURE_2D,0,At,qt,Nt,J);v(b,oe)&&x(et),bt.__version=nt.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function wt(A,b,N){if(b.image.length!==6)return;const et=K(A,b),Z=b.source;e.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+N);const nt=i.get(Z);if(Z.version!==nt.__version||et===!0){e.activeTexture(n.TEXTURE0+N);const bt=le.getPrimaries(le.workingColorSpace),ft=b.colorSpace===Sn?null:le.getPrimaries(b.colorSpace),xt=b.colorSpace===Sn||bt===ft?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const Pt=b.isCompressedTexture||b.image[0].isCompressedTexture,Gt=b.image[0]&&b.image[0].isDataTexture,J=[];for(let Q=0;Q<6;Q++)!Pt&&!Gt?J[Q]=_(b.image[Q],!1,!0,s.maxCubemapSize):J[Q]=Gt?b.image[Q].image:b.image[Q],J[Q]=Wt(b,J[Q]);const oe=J[0],qt=p(oe)||a,Nt=r.convert(b.format,b.colorSpace),At=r.convert(b.type),mt=M(b.internalFormat,Nt,At,b.colorSpace),P=a&&b.isVideoTexture!==!0,it=nt.__version===void 0||et===!0;let Et=R(b,oe,qt);G(n.TEXTURE_CUBE_MAP,b,qt);let _t;if(Pt){P&&it&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Et,mt,oe.width,oe.height);for(let Q=0;Q<6;Q++){_t=J[Q].mipmaps;for(let L=0;L<_t.length;L++){const st=_t[L];b.format!==bn?Nt!==null?P?e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L,0,0,st.width,st.height,Nt,st.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L,mt,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L,0,0,st.width,st.height,Nt,At,st.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L,mt,st.width,st.height,0,Nt,At,st.data)}}}else{_t=b.mipmaps,P&&it&&(_t.length>0&&Et++,e.texStorage2D(n.TEXTURE_CUBE_MAP,Et,mt,J[0].width,J[0].height));for(let Q=0;Q<6;Q++)if(Gt){P?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,J[Q].width,J[Q].height,Nt,At,J[Q].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,mt,J[Q].width,J[Q].height,0,Nt,At,J[Q].data);for(let L=0;L<_t.length;L++){const ut=_t[L].image[Q].image;P?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L+1,0,0,ut.width,ut.height,Nt,At,ut.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L+1,mt,ut.width,ut.height,0,Nt,At,ut.data)}}else{P?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Nt,At,J[Q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,mt,Nt,At,J[Q]);for(let L=0;L<_t.length;L++){const st=_t[L];P?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L+1,0,0,Nt,At,st.image[Q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,L+1,mt,Nt,At,st.image[Q])}}}v(b,qt)&&x(n.TEXTURE_CUBE_MAP),nt.__version=Z.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function St(A,b,N,et,Z,nt){const bt=r.convert(N.format,N.colorSpace),ft=r.convert(N.type),xt=M(N.internalFormat,bt,ft,N.colorSpace);if(!i.get(b).__hasExternalTextures){const Gt=Math.max(1,b.width>>nt),J=Math.max(1,b.height>>nt);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?e.texImage3D(Z,nt,xt,Gt,J,b.depth,0,bt,ft,null):e.texImage2D(Z,nt,xt,Gt,J,0,bt,ft,null)}e.bindFramebuffer(n.FRAMEBUFFER,A),yt(b)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,et,Z,i.get(N).__webglTexture,0,Ut(b)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,et,Z,i.get(N).__webglTexture,nt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function kt(A,b,N){if(n.bindRenderbuffer(n.RENDERBUFFER,A),b.depthBuffer&&!b.stencilBuffer){let et=a===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(N||yt(b)){const Z=b.depthTexture;Z&&Z.isDepthTexture&&(Z.type===bi?et=n.DEPTH_COMPONENT32F:Z.type===yi&&(et=n.DEPTH_COMPONENT24));const nt=Ut(b);yt(b)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,nt,et,b.width,b.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,nt,et,b.width,b.height)}else n.renderbufferStorage(n.RENDERBUFFER,et,b.width,b.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,A)}else if(b.depthBuffer&&b.stencilBuffer){const et=Ut(b);N&&yt(b)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,et,n.DEPTH24_STENCIL8,b.width,b.height):yt(b)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,et,n.DEPTH24_STENCIL8,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,A)}else{const et=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let Z=0;Z<et.length;Z++){const nt=et[Z],bt=r.convert(nt.format,nt.colorSpace),ft=r.convert(nt.type),xt=M(nt.internalFormat,bt,ft,nt.colorSpace),Pt=Ut(b);N&&yt(b)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Pt,xt,b.width,b.height):yt(b)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Pt,xt,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,xt,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Bt(A,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,A),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),W(b.depthTexture,0);const et=i.get(b.depthTexture).__webglTexture,Z=Ut(b);if(b.depthTexture.format===Ji)yt(b)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,et,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,et,0);else if(b.depthTexture.format===Ks)yt(b)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,et,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function Lt(A){const b=i.get(A),N=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!b.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");Bt(b.__webglFramebuffer,A)}else if(N){b.__webglDepthbuffer=[];for(let et=0;et<6;et++)e.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[et]),b.__webglDepthbuffer[et]=n.createRenderbuffer(),kt(b.__webglDepthbuffer[et],A,!1)}else e.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=n.createRenderbuffer(),kt(b.__webglDepthbuffer,A,!1);e.bindFramebuffer(n.FRAMEBUFFER,null)}function Zt(A,b,N){const et=i.get(A);b!==void 0&&St(et.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),N!==void 0&&Lt(A)}function z(A){const b=A.texture,N=i.get(A),et=i.get(b);A.addEventListener("dispose",U),A.isWebGLMultipleRenderTargets!==!0&&(et.__webglTexture===void 0&&(et.__webglTexture=n.createTexture()),et.__version=b.version,o.memory.textures++);const Z=A.isWebGLCubeRenderTarget===!0,nt=A.isWebGLMultipleRenderTargets===!0,bt=p(A)||a;if(Z){N.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(a&&b.mipmaps&&b.mipmaps.length>0){N.__webglFramebuffer[ft]=[];for(let xt=0;xt<b.mipmaps.length;xt++)N.__webglFramebuffer[ft][xt]=n.createFramebuffer()}else N.__webglFramebuffer[ft]=n.createFramebuffer()}else{if(a&&b.mipmaps&&b.mipmaps.length>0){N.__webglFramebuffer=[];for(let ft=0;ft<b.mipmaps.length;ft++)N.__webglFramebuffer[ft]=n.createFramebuffer()}else N.__webglFramebuffer=n.createFramebuffer();if(nt)if(s.drawBuffers){const ft=A.texture;for(let xt=0,Pt=ft.length;xt<Pt;xt++){const Gt=i.get(ft[xt]);Gt.__webglTexture===void 0&&(Gt.__webglTexture=n.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&A.samples>0&&yt(A)===!1){const ft=nt?b:[b];N.__webglMultisampledFramebuffer=n.createFramebuffer(),N.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let xt=0;xt<ft.length;xt++){const Pt=ft[xt];N.__webglColorRenderbuffer[xt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,N.__webglColorRenderbuffer[xt]);const Gt=r.convert(Pt.format,Pt.colorSpace),J=r.convert(Pt.type),oe=M(Pt.internalFormat,Gt,J,Pt.colorSpace,A.isXRRenderTarget===!0),qt=Ut(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,qt,oe,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.RENDERBUFFER,N.__webglColorRenderbuffer[xt])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(N.__webglDepthRenderbuffer=n.createRenderbuffer(),kt(N.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Z){e.bindTexture(n.TEXTURE_CUBE_MAP,et.__webglTexture),G(n.TEXTURE_CUBE_MAP,b,bt);for(let ft=0;ft<6;ft++)if(a&&b.mipmaps&&b.mipmaps.length>0)for(let xt=0;xt<b.mipmaps.length;xt++)St(N.__webglFramebuffer[ft][xt],A,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,xt);else St(N.__webglFramebuffer[ft],A,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);v(b,bt)&&x(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(nt){const ft=A.texture;for(let xt=0,Pt=ft.length;xt<Pt;xt++){const Gt=ft[xt],J=i.get(Gt);e.bindTexture(n.TEXTURE_2D,J.__webglTexture),G(n.TEXTURE_2D,Gt,bt),St(N.__webglFramebuffer,A,Gt,n.COLOR_ATTACHMENT0+xt,n.TEXTURE_2D,0),v(Gt,bt)&&x(n.TEXTURE_2D)}e.unbindTexture()}else{let ft=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(a?ft=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(ft,et.__webglTexture),G(ft,b,bt),a&&b.mipmaps&&b.mipmaps.length>0)for(let xt=0;xt<b.mipmaps.length;xt++)St(N.__webglFramebuffer[xt],A,b,n.COLOR_ATTACHMENT0,ft,xt);else St(N.__webglFramebuffer,A,b,n.COLOR_ATTACHMENT0,ft,0);v(b,bt)&&x(ft),e.unbindTexture()}A.depthBuffer&&Lt(A)}function We(A){const b=p(A)||a,N=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let et=0,Z=N.length;et<Z;et++){const nt=N[et];if(v(nt,b)){const bt=A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,ft=i.get(nt).__webglTexture;e.bindTexture(bt,ft),x(bt),e.unbindTexture()}}}function Rt(A){if(a&&A.samples>0&&yt(A)===!1){const b=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],N=A.width,et=A.height;let Z=n.COLOR_BUFFER_BIT;const nt=[],bt=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ft=i.get(A),xt=A.isWebGLMultipleRenderTargets===!0;if(xt)for(let Pt=0;Pt<b.length;Pt++)e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Pt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Pt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,ft.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ft.__webglFramebuffer);for(let Pt=0;Pt<b.length;Pt++){nt.push(n.COLOR_ATTACHMENT0+Pt),A.depthBuffer&&nt.push(bt);const Gt=ft.__ignoreDepthValues!==void 0?ft.__ignoreDepthValues:!1;if(Gt===!1&&(A.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),xt&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ft.__webglColorRenderbuffer[Pt]),Gt===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[bt]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[bt])),xt){const J=i.get(b[Pt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,J,0)}n.blitFramebuffer(0,0,N,et,0,0,N,et,Z,n.NEAREST),l&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,nt)}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),xt)for(let Pt=0;Pt<b.length;Pt++){e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Pt,n.RENDERBUFFER,ft.__webglColorRenderbuffer[Pt]);const Gt=i.get(b[Pt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Pt,n.TEXTURE_2D,Gt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ft.__webglMultisampledFramebuffer)}}function Ut(A){return Math.min(s.maxSamples,A.samples)}function yt(A){const b=i.get(A);return a&&A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function ue(A){const b=o.render.frame;h.get(A)!==b&&(h.set(A,b),A.update())}function Wt(A,b){const N=A.colorSpace,et=A.format,Z=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===gc||N!==li&&N!==Sn&&(le.getTransfer(N)===fe?a===!1?t.has("EXT_sRGB")===!0&&et===bn?(A.format=gc,A.minFilter=on,A.generateMipmaps=!1):b=cf.sRGBToLinear(b):(et!==bn||Z!==wi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),b}this.allocateTextureUnit=D,this.resetTextureUnits=Y,this.setTexture2D=W,this.setTexture2DArray=j,this.setTexture3D=$,this.setTextureCube=X,this.rebindTextures=Zt,this.setupRenderTarget=z,this.updateRenderTargetMipmap=We,this.updateMultisampleRenderTarget=Rt,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=St,this.useMultisampledRTT=yt}function Qv(n,t,e){const i=e.isWebGL2;function s(r,o=Sn){let a;const c=le.getTransfer(o);if(r===wi)return n.UNSIGNED_BYTE;if(r===Zu)return n.UNSIGNED_SHORT_4_4_4_4;if(r===Qu)return n.UNSIGNED_SHORT_5_5_5_1;if(r===Ip)return n.BYTE;if(r===Up)return n.SHORT;if(r===Nc)return n.UNSIGNED_SHORT;if(r===Ju)return n.INT;if(r===yi)return n.UNSIGNED_INT;if(r===bi)return n.FLOAT;if(r===Ir)return i?n.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Np)return n.ALPHA;if(r===bn)return n.RGBA;if(r===zp)return n.LUMINANCE;if(r===Op)return n.LUMINANCE_ALPHA;if(r===Ji)return n.DEPTH_COMPONENT;if(r===Ks)return n.DEPTH_STENCIL;if(r===gc)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Fp)return n.RED;if(r===tf)return n.RED_INTEGER;if(r===kp)return n.RG;if(r===ef)return n.RG_INTEGER;if(r===nf)return n.RGBA_INTEGER;if(r===Ma||r===ya||r===ba||r===Sa)if(c===fe)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Ma)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ya)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ba)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Sa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Ma)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ya)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ba)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Sa)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Rl||r===Cl||r===Pl||r===Ll)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Rl)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Cl)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Pl)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ll)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===sf)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Dl||r===Il)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Dl)return c===fe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Il)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ul||r===Nl||r===zl||r===Ol||r===Fl||r===kl||r===Bl||r===Hl||r===Vl||r===Wl||r===Gl||r===$l||r===Xl||r===jl)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Ul)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Nl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===zl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Ol)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Fl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===kl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Bl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Hl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Vl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Wl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Gl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===$l)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Xl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===jl)return c===fe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Ea||r===ql||r===Yl)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===Ea)return c===fe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===ql)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Yl)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Bp||r===Kl||r===Jl||r===Zl)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===Ea)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Kl)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Jl)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Zl)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Ki?i?n.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):n[r]!==void 0?n[r]:null}return{convert:s}}class tx extends mn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ft extends Be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ex={type:"move"};class qa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ft,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ft,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ft,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const _ of t.hand.values()){const p=e.getJointPose(_,i),f=this._getHandJoint(l,_);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),m=.02,g=.005;l.inputState.pinching&&d>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ex)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ft;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class nx extends as{constructor(t,e){super();const i=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,m=null,g=null;const _=e.getContextAttributes();let p=null,f=null;const v=[],x=[],M=new ht;let R=null;const E=new mn;E.layers.enable(1),E.viewport=new me;const T=new mn;T.layers.enable(2),T.viewport=new me;const U=[E,T],y=new tx;y.layers.enable(1),y.layers.enable(2);let S=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let K=v[G];return K===void 0&&(K=new qa,v[G]=K),K.getTargetRaySpace()},this.getControllerGrip=function(G){let K=v[G];return K===void 0&&(K=new qa,v[G]=K),K.getGripSpace()},this.getHand=function(G){let K=v[G];return K===void 0&&(K=new qa,v[G]=K),K.getHandSpace()};function H(G){const K=x.indexOf(G.inputSource);if(K===-1)return;const pt=v[K];pt!==void 0&&(pt.update(G.inputSource,G.frame,l||o),pt.dispatchEvent({type:G.type,data:G.inputSource}))}function Y(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",D);for(let G=0;G<v.length;G++){const K=x[G];K!==null&&(x[G]=null,v[G].disconnect(K))}S=null,B=null,t.setRenderTarget(p),m=null,d=null,u=null,s=null,f=null,ct.stop(),i.isPresenting=!1,t.setPixelRatio(R),t.setSize(M.width,M.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){r=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){a=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(G){l=G},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(G){if(s=G,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",D),_.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(M),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const K={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,K),s.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),f=new is(m.framebufferWidth,m.framebufferHeight,{format:bn,type:wi,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let K=null,pt=null,wt=null;_.depth&&(wt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,K=_.stencil?Ks:Ji,pt=_.stencil?Ki:yi);const St={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(St),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),f=new is(d.textureWidth,d.textureHeight,{format:bn,type:wi,depthTexture:new xf(d.textureWidth,d.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const kt=t.properties.get(f);kt.__ignoreDepthValues=d.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),ct.setContext(s),ct.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function D(G){for(let K=0;K<G.removed.length;K++){const pt=G.removed[K],wt=x.indexOf(pt);wt>=0&&(x[wt]=null,v[wt].disconnect(pt))}for(let K=0;K<G.added.length;K++){const pt=G.added[K];let wt=x.indexOf(pt);if(wt===-1){for(let kt=0;kt<v.length;kt++)if(kt>=x.length){x.push(pt),wt=kt;break}else if(x[kt]===null){x[kt]=pt,wt=kt;break}if(wt===-1)break}const St=v[wt];St&&St.connect(pt)}}const O=new C,W=new C;function j(G,K,pt){O.setFromMatrixPosition(K.matrixWorld),W.setFromMatrixPosition(pt.matrixWorld);const wt=O.distanceTo(W),St=K.projectionMatrix.elements,kt=pt.projectionMatrix.elements,Bt=St[14]/(St[10]-1),Lt=St[14]/(St[10]+1),Zt=(St[9]+1)/St[5],z=(St[9]-1)/St[5],We=(St[8]-1)/St[0],Rt=(kt[8]+1)/kt[0],Ut=Bt*We,yt=Bt*Rt,ue=wt/(-We+Rt),Wt=ue*-We;K.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(Wt),G.translateZ(ue),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert();const A=Bt+ue,b=Lt+ue,N=Ut-Wt,et=yt+(wt-Wt),Z=Zt*Lt/b*A,nt=z*Lt/b*A;G.projectionMatrix.makePerspective(N,et,Z,nt,A,b),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}function $(G,K){K===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(K.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(s===null)return;y.near=T.near=E.near=G.near,y.far=T.far=E.far=G.far,(S!==y.near||B!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),S=y.near,B=y.far);const K=G.parent,pt=y.cameras;$(y,K);for(let wt=0;wt<pt.length;wt++)$(pt[wt],K);pt.length===2?j(y,E,T):y.projectionMatrix.copy(E.projectionMatrix),X(G,y,K)};function X(G,K,pt){pt===null?G.matrix.copy(K.matrixWorld):(G.matrix.copy(pt.matrixWorld),G.matrix.invert(),G.matrix.multiply(K.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(K.projectionMatrix),G.projectionMatrixInverse.copy(K.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=_c*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&m===null))return c},this.setFoveation=function(G){c=G,d!==null&&(d.fixedFoveation=G),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=G)};let q=null;function rt(G,K){if(h=K.getViewerPose(l||o),g=K,h!==null){const pt=h.views;m!==null&&(t.setRenderTargetFramebuffer(f,m.framebuffer),t.setRenderTarget(f));let wt=!1;pt.length!==y.cameras.length&&(y.cameras.length=0,wt=!0);for(let St=0;St<pt.length;St++){const kt=pt[St];let Bt=null;if(m!==null)Bt=m.getViewport(kt);else{const Zt=u.getViewSubImage(d,kt);Bt=Zt.viewport,St===0&&(t.setRenderTargetTextures(f,Zt.colorTexture,d.ignoreDepthValues?void 0:Zt.depthStencilTexture),t.setRenderTarget(f))}let Lt=U[St];Lt===void 0&&(Lt=new mn,Lt.layers.enable(St),Lt.viewport=new me,U[St]=Lt),Lt.matrix.fromArray(kt.transform.matrix),Lt.matrix.decompose(Lt.position,Lt.quaternion,Lt.scale),Lt.projectionMatrix.fromArray(kt.projectionMatrix),Lt.projectionMatrixInverse.copy(Lt.projectionMatrix).invert(),Lt.viewport.set(Bt.x,Bt.y,Bt.width,Bt.height),St===0&&(y.matrix.copy(Lt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),wt===!0&&y.cameras.push(Lt)}}for(let pt=0;pt<v.length;pt++){const wt=x[pt],St=v[pt];wt!==null&&St!==void 0&&St.update(wt,K,l||o)}q&&q(G,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),g=null}const ct=new _f;ct.setAnimationLoop(rt),this.setAnimationLoop=function(G){q=G},this.dispose=function(){}}}function ix(n,t){function e(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function i(p,f){f.color.getRGB(p.fogColor.value,pf(n)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,v,x,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(p,f):f.isMeshToonMaterial?(r(p,f),u(p,f)):f.isMeshPhongMaterial?(r(p,f),h(p,f)):f.isMeshStandardMaterial?(r(p,f),d(p,f),f.isMeshPhysicalMaterial&&m(p,f,M)):f.isMeshMatcapMaterial?(r(p,f),g(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),_(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(o(p,f),f.isLineDashedMaterial&&a(p,f)):f.isPointsMaterial?c(p,f,v,x):f.isSpriteMaterial?l(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,e(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===cn&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,e(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===cn&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,e(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,e(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const v=t.get(f).envMap;if(v&&(p.envMap.value=v,p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap){p.lightMap.value=f.lightMap;const x=n._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=f.lightMapIntensity*x,e(f.lightMap,p.lightMapTransform)}f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,p.aoMapTransform))}function o(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform))}function a(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function c(p,f,v,x){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*v,p.scale.value=x*.5,f.map&&(p.map.value=f.map,e(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function l(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function h(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function u(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,p.roughnessMapTransform)),t.get(f).envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,v){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===cn&&p.clearcoatNormalScale.value.negate())),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function _(p,f){const v=t.get(f).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function sx(n,t,e,i){let s={},r={},o=[];const a=e.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(v,x){const M=x.program;i.uniformBlockBinding(v,M)}function l(v,x){let M=s[v.id];M===void 0&&(g(v),M=h(v),s[v.id]=M,v.addEventListener("dispose",p));const R=x.program;i.updateUBOMapping(v,R);const E=t.render.frame;r[v.id]!==E&&(d(v),r[v.id]=E)}function h(v){const x=u();v.__bindingPointIndex=x;const M=n.createBuffer(),R=v.__size,E=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,R,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,M),M}function u(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const x=s[v.id],M=v.uniforms,R=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let E=0,T=M.length;E<T;E++){const U=Array.isArray(M[E])?M[E]:[M[E]];for(let y=0,S=U.length;y<S;y++){const B=U[y];if(m(B,E,y,R)===!0){const H=B.__offset,Y=Array.isArray(B.value)?B.value:[B.value];let D=0;for(let O=0;O<Y.length;O++){const W=Y[O],j=_(W);typeof W=="number"||typeof W=="boolean"?(B.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,H+D,B.__data)):W.isMatrix3?(B.__data[0]=W.elements[0],B.__data[1]=W.elements[1],B.__data[2]=W.elements[2],B.__data[3]=0,B.__data[4]=W.elements[3],B.__data[5]=W.elements[4],B.__data[6]=W.elements[5],B.__data[7]=0,B.__data[8]=W.elements[6],B.__data[9]=W.elements[7],B.__data[10]=W.elements[8],B.__data[11]=0):(W.toArray(B.__data,D),D+=j.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,H,B.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(v,x,M,R){const E=v.value,T=x+"_"+M;if(R[T]===void 0)return typeof E=="number"||typeof E=="boolean"?R[T]=E:R[T]=E.clone(),!0;{const U=R[T];if(typeof E=="number"||typeof E=="boolean"){if(U!==E)return R[T]=E,!0}else if(U.equals(E)===!1)return U.copy(E),!0}return!1}function g(v){const x=v.uniforms;let M=0;const R=16;for(let T=0,U=x.length;T<U;T++){const y=Array.isArray(x[T])?x[T]:[x[T]];for(let S=0,B=y.length;S<B;S++){const H=y[S],Y=Array.isArray(H.value)?H.value:[H.value];for(let D=0,O=Y.length;D<O;D++){const W=Y[D],j=_(W),$=M%R;$!==0&&R-$<j.boundary&&(M+=R-$),H.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=M,M+=j.storage}}}const E=M%R;return E>0&&(M+=R-E),v.__size=M,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function p(v){const x=v.target;x.removeEventListener("dispose",p);const M=o.indexOf(x.__bindingPointIndex);o.splice(M,1),n.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function f(){for(const v in s)n.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:c,update:l,dispose:f}}class wf{constructor(t={}){const{canvas:e=tm(),context:i=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;i!==null?d=i.getContextAttributes().alpha:d=o;const m=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const f=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Le,this._useLegacyLights=!1,this.toneMapping=Ei,this.toneMappingExposure=1;const x=this;let M=!1,R=0,E=0,T=null,U=-1,y=null;const S=new me,B=new me;let H=null;const Y=new jt(0);let D=0,O=e.width,W=e.height,j=1,$=null,X=null;const q=new me(0,0,O,W),rt=new me(0,0,O,W);let ct=!1;const G=new kc;let K=!1,pt=!1,wt=null;const St=new ae,kt=new ht,Bt=new C,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Zt(){return T===null?j:1}let z=i;function We(w,I){for(let k=0;k<w.length;k++){const V=w[k],F=e.getContext(V,I);if(F!==null)return F}return null}try{const w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ic}`),e.addEventListener("webglcontextlost",Q,!1),e.addEventListener("webglcontextrestored",L,!1),e.addEventListener("webglcontextcreationerror",st,!1),z===null){const I=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&I.shift(),z=We(I,w),z===null)throw We(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&z instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),z.getShaderPrecisionFormat===void 0&&(z.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Rt,Ut,yt,ue,Wt,A,b,N,et,Z,nt,bt,ft,xt,Pt,Gt,J,oe,qt,Nt,At,mt,P,it;function Et(){Rt=new p_(z),Ut=new c_(z,Rt,t),Rt.init(Ut),mt=new Qv(z,Rt,Ut),yt=new Jv(z,Rt,Ut),ue=new __(z),Wt=new Ov,A=new Zv(z,Rt,yt,Wt,Ut,mt,ue),b=new h_(x),N=new d_(x),et=new wm(z,Ut),P=new o_(z,Rt,et,Ut),Z=new m_(z,et,ue,P),nt=new y_(z,Z,et,ue),qt=new M_(z,Ut,A),Gt=new l_(Wt),bt=new zv(x,b,N,Rt,Ut,P,Gt),ft=new ix(x,Wt),xt=new kv,Pt=new $v(Rt,Ut),oe=new r_(x,b,N,yt,nt,d,c),J=new Kv(x,nt,Ut),it=new sx(z,ue,Ut,yt),Nt=new a_(z,Rt,ue,Ut),At=new g_(z,Rt,ue,Ut),ue.programs=bt.programs,x.capabilities=Ut,x.extensions=Rt,x.properties=Wt,x.renderLists=xt,x.shadowMap=J,x.state=yt,x.info=ue}Et();const _t=new nx(x,z);this.xr=_t,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const w=Rt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Rt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(w){w!==void 0&&(j=w,this.setSize(O,W,!1))},this.getSize=function(w){return w.set(O,W)},this.setSize=function(w,I,k=!0){if(_t.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=w,W=I,e.width=Math.floor(w*j),e.height=Math.floor(I*j),k===!0&&(e.style.width=w+"px",e.style.height=I+"px"),this.setViewport(0,0,w,I)},this.getDrawingBufferSize=function(w){return w.set(O*j,W*j).floor()},this.setDrawingBufferSize=function(w,I,k){O=w,W=I,j=k,e.width=Math.floor(w*k),e.height=Math.floor(I*k),this.setViewport(0,0,w,I)},this.getCurrentViewport=function(w){return w.copy(S)},this.getViewport=function(w){return w.copy(q)},this.setViewport=function(w,I,k,V){w.isVector4?q.set(w.x,w.y,w.z,w.w):q.set(w,I,k,V),yt.viewport(S.copy(q).multiplyScalar(j).floor())},this.getScissor=function(w){return w.copy(rt)},this.setScissor=function(w,I,k,V){w.isVector4?rt.set(w.x,w.y,w.z,w.w):rt.set(w,I,k,V),yt.scissor(B.copy(rt).multiplyScalar(j).floor())},this.getScissorTest=function(){return ct},this.setScissorTest=function(w){yt.setScissorTest(ct=w)},this.setOpaqueSort=function(w){$=w},this.setTransparentSort=function(w){X=w},this.getClearColor=function(w){return w.copy(oe.getClearColor())},this.setClearColor=function(){oe.setClearColor.apply(oe,arguments)},this.getClearAlpha=function(){return oe.getClearAlpha()},this.setClearAlpha=function(){oe.setClearAlpha.apply(oe,arguments)},this.clear=function(w=!0,I=!0,k=!0){let V=0;if(w){let F=!1;if(T!==null){const gt=T.texture.format;F=gt===nf||gt===ef||gt===tf}if(F){const gt=T.texture.type,Tt=gt===wi||gt===yi||gt===Nc||gt===Ki||gt===Zu||gt===Qu,It=oe.getClearColor(),zt=oe.getClearAlpha(),Yt=It.r,Vt=It.g,$t=It.b;Tt?(m[0]=Yt,m[1]=Vt,m[2]=$t,m[3]=zt,z.clearBufferuiv(z.COLOR,0,m)):(g[0]=Yt,g[1]=Vt,g[2]=$t,g[3]=zt,z.clearBufferiv(z.COLOR,0,g))}else V|=z.COLOR_BUFFER_BIT}I&&(V|=z.DEPTH_BUFFER_BIT),k&&(V|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Q,!1),e.removeEventListener("webglcontextrestored",L,!1),e.removeEventListener("webglcontextcreationerror",st,!1),xt.dispose(),Pt.dispose(),Wt.dispose(),b.dispose(),N.dispose(),nt.dispose(),P.dispose(),it.dispose(),bt.dispose(),_t.dispose(),_t.removeEventListener("sessionstart",we),_t.removeEventListener("sessionend",ne),wt&&(wt.dispose(),wt=null),Re.stop()};function Q(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function L(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const w=ue.autoReset,I=J.enabled,k=J.autoUpdate,V=J.needsUpdate,F=J.type;Et(),ue.autoReset=w,J.enabled=I,J.autoUpdate=k,J.needsUpdate=V,J.type=F}function st(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ut(w){const I=w.target;I.removeEventListener("dispose",ut),Dt(I)}function Dt(w){Ct(w),Wt.remove(w)}function Ct(w){const I=Wt.get(w).programs;I!==void 0&&(I.forEach(function(k){bt.releaseProgram(k)}),w.isShaderMaterial&&bt.releaseShaderCache(w))}this.renderBufferDirect=function(w,I,k,V,F,gt){I===null&&(I=Lt);const Tt=F.isMesh&&F.matrixWorld.determinant()<0,It=Kd(w,I,k,V,F);yt.setMaterial(V,Tt);let zt=k.index,Yt=1;if(V.wireframe===!0){if(zt=Z.getWireframeAttribute(k),zt===void 0)return;Yt=2}const Vt=k.drawRange,$t=k.attributes.position;let Te=Vt.start*Yt,fn=(Vt.start+Vt.count)*Yt;gt!==null&&(Te=Math.max(Te,gt.start*Yt),fn=Math.min(fn,(gt.start+gt.count)*Yt)),zt!==null?(Te=Math.max(Te,0),fn=Math.min(fn,zt.count)):$t!=null&&(Te=Math.max(Te,0),fn=Math.min(fn,$t.count));const ze=fn-Te;if(ze<0||ze===1/0)return;P.setup(F,V,It,k,zt);let Yn,ve=Nt;if(zt!==null&&(Yn=et.get(zt),ve=At,ve.setIndex(Yn)),F.isMesh)V.wireframe===!0?(yt.setLineWidth(V.wireframeLinewidth*Zt()),ve.setMode(z.LINES)):ve.setMode(z.TRIANGLES);else if(F.isLine){let Kt=V.linewidth;Kt===void 0&&(Kt=1),yt.setLineWidth(Kt*Zt()),F.isLineSegments?ve.setMode(z.LINES):F.isLineLoop?ve.setMode(z.LINE_LOOP):ve.setMode(z.LINE_STRIP)}else F.isPoints?ve.setMode(z.POINTS):F.isSprite&&ve.setMode(z.TRIANGLES);if(F.isBatchedMesh)ve.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else if(F.isInstancedMesh)ve.renderInstances(Te,ze,F.count);else if(k.isInstancedBufferGeometry){const Kt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,ma=Math.min(k.instanceCount,Kt);ve.renderInstances(Te,ze,ma)}else ve.render(Te,ze)};function Qt(w,I,k){w.transparent===!0&&w.side===_n&&w.forceSinglePass===!1?(w.side=cn,w.needsUpdate=!0,eo(w,I,k),w.side=Pi,w.needsUpdate=!0,eo(w,I,k),w.side=_n):eo(w,I,k)}this.compile=function(w,I,k=null){k===null&&(k=w),p=Pt.get(k),p.init(),v.push(p),k.traverseVisible(function(F){F.isLight&&F.layers.test(I.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),w!==k&&w.traverseVisible(function(F){F.isLight&&F.layers.test(I.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),p.setupLights(x._useLegacyLights);const V=new Set;return w.traverse(function(F){const gt=F.material;if(gt)if(Array.isArray(gt))for(let Tt=0;Tt<gt.length;Tt++){const It=gt[Tt];Qt(It,k,F),V.add(It)}else Qt(gt,k,F),V.add(gt)}),v.pop(),p=null,V},this.compileAsync=function(w,I,k=null){const V=this.compile(w,I,k);return new Promise(F=>{function gt(){if(V.forEach(function(Tt){Wt.get(Tt).currentProgram.isReady()&&V.delete(Tt)}),V.size===0){F(w);return}setTimeout(gt,10)}Rt.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let te=null;function be(w){te&&te(w)}function we(){Re.stop()}function ne(){Re.start()}const Re=new _f;Re.setAnimationLoop(be),typeof self<"u"&&Re.setContext(self),this.setAnimationLoop=function(w){te=w,_t.setAnimationLoop(w),w===null?Re.stop():Re.start()},_t.addEventListener("sessionstart",we),_t.addEventListener("sessionend",ne),this.render=function(w,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),_t.enabled===!0&&_t.isPresenting===!0&&(_t.cameraAutoUpdate===!0&&_t.updateCamera(I),I=_t.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,I,T),p=Pt.get(w,v.length),p.init(),v.push(p),St.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),G.setFromProjectionMatrix(St),pt=this.localClippingEnabled,K=Gt.init(this.clippingPlanes,pt),_=xt.get(w,f.length),_.init(),f.push(_),Un(w,I,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort($,X),this.info.render.frame++,K===!0&&Gt.beginShadows();const k=p.state.shadowsArray;if(J.render(k,w,I),K===!0&&Gt.endShadows(),this.info.autoReset===!0&&this.info.reset(),oe.render(_,w),p.setupLights(x._useLegacyLights),I.isArrayCamera){const V=I.cameras;for(let F=0,gt=V.length;F<gt;F++){const Tt=V[F];ml(_,w,Tt,Tt.viewport)}}else ml(_,w,I);T!==null&&(A.updateMultisampleRenderTarget(T),A.updateRenderTargetMipmap(T)),w.isScene===!0&&w.onAfterRender(x,w,I),P.resetDefaultState(),U=-1,y=null,v.pop(),v.length>0?p=v[v.length-1]:p=null,f.pop(),f.length>0?_=f[f.length-1]:_=null};function Un(w,I,k,V){if(w.visible===!1)return;if(w.layers.test(I.layers)){if(w.isGroup)k=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(I);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||G.intersectsSprite(w)){V&&Bt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(St);const Tt=nt.update(w),It=w.material;It.visible&&_.push(w,Tt,It,k,Bt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||G.intersectsObject(w))){const Tt=nt.update(w),It=w.material;if(V&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Bt.copy(w.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),Bt.copy(Tt.boundingSphere.center)),Bt.applyMatrix4(w.matrixWorld).applyMatrix4(St)),Array.isArray(It)){const zt=Tt.groups;for(let Yt=0,Vt=zt.length;Yt<Vt;Yt++){const $t=zt[Yt],Te=It[$t.materialIndex];Te&&Te.visible&&_.push(w,Tt,Te,k,Bt.z,$t)}}else It.visible&&_.push(w,Tt,It,k,Bt.z,null)}}const gt=w.children;for(let Tt=0,It=gt.length;Tt<It;Tt++)Un(gt[Tt],I,k,V)}function ml(w,I,k,V){const F=w.opaque,gt=w.transmissive,Tt=w.transparent;p.setupLightsView(k),K===!0&&Gt.setGlobalState(x.clippingPlanes,k),gt.length>0&&Yd(F,gt,I,k),V&&yt.viewport(S.copy(V)),F.length>0&&to(F,I,k),gt.length>0&&to(gt,I,k),Tt.length>0&&to(Tt,I,k),yt.buffers.depth.setTest(!0),yt.buffers.depth.setMask(!0),yt.buffers.color.setMask(!0),yt.setPolygonOffset(!1)}function Yd(w,I,k,V){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;const gt=Ut.isWebGL2;wt===null&&(wt=new is(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")?Ir:wi,minFilter:Dr,samples:gt?4:0})),x.getDrawingBufferSize(kt),gt?wt.setSize(kt.x,kt.y):wt.setSize(vc(kt.x),vc(kt.y));const Tt=x.getRenderTarget();x.setRenderTarget(wt),x.getClearColor(Y),D=x.getClearAlpha(),D<1&&x.setClearColor(16777215,.5),x.clear();const It=x.toneMapping;x.toneMapping=Ei,to(w,k,V),A.updateMultisampleRenderTarget(wt),A.updateRenderTargetMipmap(wt);let zt=!1;for(let Yt=0,Vt=I.length;Yt<Vt;Yt++){const $t=I[Yt],Te=$t.object,fn=$t.geometry,ze=$t.material,Yn=$t.group;if(ze.side===_n&&Te.layers.test(V.layers)){const ve=ze.side;ze.side=cn,ze.needsUpdate=!0,gl(Te,k,V,fn,ze,Yn),ze.side=ve,ze.needsUpdate=!0,zt=!0}}zt===!0&&(A.updateMultisampleRenderTarget(wt),A.updateRenderTargetMipmap(wt)),x.setRenderTarget(Tt),x.setClearColor(Y,D),x.toneMapping=It}function to(w,I,k){const V=I.isScene===!0?I.overrideMaterial:null;for(let F=0,gt=w.length;F<gt;F++){const Tt=w[F],It=Tt.object,zt=Tt.geometry,Yt=V===null?Tt.material:V,Vt=Tt.group;It.layers.test(k.layers)&&gl(It,I,k,zt,Yt,Vt)}}function gl(w,I,k,V,F,gt){w.onBeforeRender(x,I,k,V,F,gt),w.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),F.onBeforeRender(x,I,k,V,w,gt),F.transparent===!0&&F.side===_n&&F.forceSinglePass===!1?(F.side=cn,F.needsUpdate=!0,x.renderBufferDirect(k,I,V,F,w,gt),F.side=Pi,F.needsUpdate=!0,x.renderBufferDirect(k,I,V,F,w,gt),F.side=_n):x.renderBufferDirect(k,I,V,F,w,gt),w.onAfterRender(x,I,k,V,F,gt)}function eo(w,I,k){I.isScene!==!0&&(I=Lt);const V=Wt.get(w),F=p.state.lights,gt=p.state.shadowsArray,Tt=F.state.version,It=bt.getParameters(w,F.state,gt,I,k),zt=bt.getProgramCacheKey(It);let Yt=V.programs;V.environment=w.isMeshStandardMaterial?I.environment:null,V.fog=I.fog,V.envMap=(w.isMeshStandardMaterial?N:b).get(w.envMap||V.environment),Yt===void 0&&(w.addEventListener("dispose",ut),Yt=new Map,V.programs=Yt);let Vt=Yt.get(zt);if(Vt!==void 0){if(V.currentProgram===Vt&&V.lightsStateVersion===Tt)return vl(w,It),Vt}else It.uniforms=bt.getUniforms(w),w.onBuild(k,It,x),w.onBeforeCompile(It,x),Vt=bt.acquireProgram(It,zt),Yt.set(zt,Vt),V.uniforms=It.uniforms;const $t=V.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&($t.clippingPlanes=Gt.uniform),vl(w,It),V.needsLights=Zd(w),V.lightsStateVersion=Tt,V.needsLights&&($t.ambientLightColor.value=F.state.ambient,$t.lightProbe.value=F.state.probe,$t.directionalLights.value=F.state.directional,$t.directionalLightShadows.value=F.state.directionalShadow,$t.spotLights.value=F.state.spot,$t.spotLightShadows.value=F.state.spotShadow,$t.rectAreaLights.value=F.state.rectArea,$t.ltc_1.value=F.state.rectAreaLTC1,$t.ltc_2.value=F.state.rectAreaLTC2,$t.pointLights.value=F.state.point,$t.pointLightShadows.value=F.state.pointShadow,$t.hemisphereLights.value=F.state.hemi,$t.directionalShadowMap.value=F.state.directionalShadowMap,$t.directionalShadowMatrix.value=F.state.directionalShadowMatrix,$t.spotShadowMap.value=F.state.spotShadowMap,$t.spotLightMatrix.value=F.state.spotLightMatrix,$t.spotLightMap.value=F.state.spotLightMap,$t.pointShadowMap.value=F.state.pointShadowMap,$t.pointShadowMatrix.value=F.state.pointShadowMatrix),V.currentProgram=Vt,V.uniformsList=null,Vt}function _l(w){if(w.uniformsList===null){const I=w.currentProgram.getUniforms();w.uniformsList=Io.seqWithValue(I.seq,w.uniforms)}return w.uniformsList}function vl(w,I){const k=Wt.get(w);k.outputColorSpace=I.outputColorSpace,k.batching=I.batching,k.instancing=I.instancing,k.instancingColor=I.instancingColor,k.skinning=I.skinning,k.morphTargets=I.morphTargets,k.morphNormals=I.morphNormals,k.morphColors=I.morphColors,k.morphTargetsCount=I.morphTargetsCount,k.numClippingPlanes=I.numClippingPlanes,k.numIntersection=I.numClipIntersection,k.vertexAlphas=I.vertexAlphas,k.vertexTangents=I.vertexTangents,k.toneMapping=I.toneMapping}function Kd(w,I,k,V,F){I.isScene!==!0&&(I=Lt),A.resetTextureUnits();const gt=I.fog,Tt=V.isMeshStandardMaterial?I.environment:null,It=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:li,zt=(V.isMeshStandardMaterial?N:b).get(V.envMap||Tt),Yt=V.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Vt=!!k.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),$t=!!k.morphAttributes.position,Te=!!k.morphAttributes.normal,fn=!!k.morphAttributes.color;let ze=Ei;V.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ze=x.toneMapping);const Yn=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ve=Yn!==void 0?Yn.length:0,Kt=Wt.get(V),ma=p.state.lights;if(K===!0&&(pt===!0||w!==y)){const Mn=w===y&&V.id===U;Gt.setState(V,w,Mn)}let Se=!1;V.version===Kt.__version?(Kt.needsLights&&Kt.lightsStateVersion!==ma.state.version||Kt.outputColorSpace!==It||F.isBatchedMesh&&Kt.batching===!1||!F.isBatchedMesh&&Kt.batching===!0||F.isInstancedMesh&&Kt.instancing===!1||!F.isInstancedMesh&&Kt.instancing===!0||F.isSkinnedMesh&&Kt.skinning===!1||!F.isSkinnedMesh&&Kt.skinning===!0||F.isInstancedMesh&&Kt.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Kt.instancingColor===!1&&F.instanceColor!==null||Kt.envMap!==zt||V.fog===!0&&Kt.fog!==gt||Kt.numClippingPlanes!==void 0&&(Kt.numClippingPlanes!==Gt.numPlanes||Kt.numIntersection!==Gt.numIntersection)||Kt.vertexAlphas!==Yt||Kt.vertexTangents!==Vt||Kt.morphTargets!==$t||Kt.morphNormals!==Te||Kt.morphColors!==fn||Kt.toneMapping!==ze||Ut.isWebGL2===!0&&Kt.morphTargetsCount!==ve)&&(Se=!0):(Se=!0,Kt.__version=V.version);let Oi=Kt.currentProgram;Se===!0&&(Oi=eo(V,I,F));let xl=!1,fr=!1,ga=!1;const $e=Oi.getUniforms(),Fi=Kt.uniforms;if(yt.useProgram(Oi.program)&&(xl=!0,fr=!0,ga=!0),V.id!==U&&(U=V.id,fr=!0),xl||y!==w){$e.setValue(z,"projectionMatrix",w.projectionMatrix),$e.setValue(z,"viewMatrix",w.matrixWorldInverse);const Mn=$e.map.cameraPosition;Mn!==void 0&&Mn.setValue(z,Bt.setFromMatrixPosition(w.matrixWorld)),Ut.logarithmicDepthBuffer&&$e.setValue(z,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&$e.setValue(z,"isOrthographic",w.isOrthographicCamera===!0),y!==w&&(y=w,fr=!0,ga=!0)}if(F.isSkinnedMesh){$e.setOptional(z,F,"bindMatrix"),$e.setOptional(z,F,"bindMatrixInverse");const Mn=F.skeleton;Mn&&(Ut.floatVertexTextures?(Mn.boneTexture===null&&Mn.computeBoneTexture(),$e.setValue(z,"boneTexture",Mn.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}F.isBatchedMesh&&($e.setOptional(z,F,"batchingTexture"),$e.setValue(z,"batchingTexture",F._matricesTexture,A));const _a=k.morphAttributes;if((_a.position!==void 0||_a.normal!==void 0||_a.color!==void 0&&Ut.isWebGL2===!0)&&qt.update(F,k,Oi),(fr||Kt.receiveShadow!==F.receiveShadow)&&(Kt.receiveShadow=F.receiveShadow,$e.setValue(z,"receiveShadow",F.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(Fi.envMap.value=zt,Fi.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),fr&&($e.setValue(z,"toneMappingExposure",x.toneMappingExposure),Kt.needsLights&&Jd(Fi,ga),gt&&V.fog===!0&&ft.refreshFogUniforms(Fi,gt),ft.refreshMaterialUniforms(Fi,V,j,W,wt),Io.upload(z,_l(Kt),Fi,A)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Io.upload(z,_l(Kt),Fi,A),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&$e.setValue(z,"center",F.center),$e.setValue(z,"modelViewMatrix",F.modelViewMatrix),$e.setValue(z,"normalMatrix",F.normalMatrix),$e.setValue(z,"modelMatrix",F.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Mn=V.uniformsGroups;for(let va=0,Qd=Mn.length;va<Qd;va++)if(Ut.isWebGL2){const Ml=Mn[va];it.update(Ml,Oi),it.bind(Ml,Oi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Oi}function Jd(w,I){w.ambientLightColor.needsUpdate=I,w.lightProbe.needsUpdate=I,w.directionalLights.needsUpdate=I,w.directionalLightShadows.needsUpdate=I,w.pointLights.needsUpdate=I,w.pointLightShadows.needsUpdate=I,w.spotLights.needsUpdate=I,w.spotLightShadows.needsUpdate=I,w.rectAreaLights.needsUpdate=I,w.hemisphereLights.needsUpdate=I}function Zd(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(w,I,k){Wt.get(w.texture).__webglTexture=I,Wt.get(w.depthTexture).__webglTexture=k;const V=Wt.get(w);V.__hasExternalTextures=!0,V.__hasExternalTextures&&(V.__autoAllocateDepthBuffer=k===void 0,V.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(w,I){const k=Wt.get(w);k.__webglFramebuffer=I,k.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(w,I=0,k=0){T=w,R=I,E=k;let V=!0,F=null,gt=!1,Tt=!1;if(w){const zt=Wt.get(w);zt.__useDefaultFramebuffer!==void 0?(yt.bindFramebuffer(z.FRAMEBUFFER,null),V=!1):zt.__webglFramebuffer===void 0?A.setupRenderTarget(w):zt.__hasExternalTextures&&A.rebindTextures(w,Wt.get(w.texture).__webglTexture,Wt.get(w.depthTexture).__webglTexture);const Yt=w.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(Tt=!0);const Vt=Wt.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Vt[I])?F=Vt[I][k]:F=Vt[I],gt=!0):Ut.isWebGL2&&w.samples>0&&A.useMultisampledRTT(w)===!1?F=Wt.get(w).__webglMultisampledFramebuffer:Array.isArray(Vt)?F=Vt[k]:F=Vt,S.copy(w.viewport),B.copy(w.scissor),H=w.scissorTest}else S.copy(q).multiplyScalar(j).floor(),B.copy(rt).multiplyScalar(j).floor(),H=ct;if(yt.bindFramebuffer(z.FRAMEBUFFER,F)&&Ut.drawBuffers&&V&&yt.drawBuffers(w,F),yt.viewport(S),yt.scissor(B),yt.setScissorTest(H),gt){const zt=Wt.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+I,zt.__webglTexture,k)}else if(Tt){const zt=Wt.get(w.texture),Yt=I||0;z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,zt.__webglTexture,k||0,Yt)}U=-1},this.readRenderTargetPixels=function(w,I,k,V,F,gt,Tt){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=Wt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Tt!==void 0&&(It=It[Tt]),It){yt.bindFramebuffer(z.FRAMEBUFFER,It);try{const zt=w.texture,Yt=zt.format,Vt=zt.type;if(Yt!==bn&&mt.convert(Yt)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const $t=Vt===Ir&&(Rt.has("EXT_color_buffer_half_float")||Ut.isWebGL2&&Rt.has("EXT_color_buffer_float"));if(Vt!==wi&&mt.convert(Vt)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Vt===bi&&(Ut.isWebGL2||Rt.has("OES_texture_float")||Rt.has("WEBGL_color_buffer_float")))&&!$t){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=w.width-V&&k>=0&&k<=w.height-F&&z.readPixels(I,k,V,F,mt.convert(Yt),mt.convert(Vt),gt)}finally{const zt=T!==null?Wt.get(T).__webglFramebuffer:null;yt.bindFramebuffer(z.FRAMEBUFFER,zt)}}},this.copyFramebufferToTexture=function(w,I,k=0){const V=Math.pow(2,-k),F=Math.floor(I.image.width*V),gt=Math.floor(I.image.height*V);A.setTexture2D(I,0),z.copyTexSubImage2D(z.TEXTURE_2D,k,0,0,w.x,w.y,F,gt),yt.unbindTexture()},this.copyTextureToTexture=function(w,I,k,V=0){const F=I.image.width,gt=I.image.height,Tt=mt.convert(k.format),It=mt.convert(k.type);A.setTexture2D(k,0),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,k.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,k.unpackAlignment),I.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,V,w.x,w.y,F,gt,Tt,It,I.image.data):I.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,V,w.x,w.y,I.mipmaps[0].width,I.mipmaps[0].height,Tt,I.mipmaps[0].data):z.texSubImage2D(z.TEXTURE_2D,V,w.x,w.y,Tt,It,I.image),V===0&&k.generateMipmaps&&z.generateMipmap(z.TEXTURE_2D),yt.unbindTexture()},this.copyTextureToTexture3D=function(w,I,k,V,F=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const gt=w.max.x-w.min.x+1,Tt=w.max.y-w.min.y+1,It=w.max.z-w.min.z+1,zt=mt.convert(V.format),Yt=mt.convert(V.type);let Vt;if(V.isData3DTexture)A.setTexture3D(V,0),Vt=z.TEXTURE_3D;else if(V.isDataArrayTexture||V.isCompressedArrayTexture)A.setTexture2DArray(V,0),Vt=z.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,V.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,V.unpackAlignment);const $t=z.getParameter(z.UNPACK_ROW_LENGTH),Te=z.getParameter(z.UNPACK_IMAGE_HEIGHT),fn=z.getParameter(z.UNPACK_SKIP_PIXELS),ze=z.getParameter(z.UNPACK_SKIP_ROWS),Yn=z.getParameter(z.UNPACK_SKIP_IMAGES),ve=k.isCompressedTexture?k.mipmaps[F]:k.image;z.pixelStorei(z.UNPACK_ROW_LENGTH,ve.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,ve.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,w.min.x),z.pixelStorei(z.UNPACK_SKIP_ROWS,w.min.y),z.pixelStorei(z.UNPACK_SKIP_IMAGES,w.min.z),k.isDataTexture||k.isData3DTexture?z.texSubImage3D(Vt,F,I.x,I.y,I.z,gt,Tt,It,zt,Yt,ve.data):k.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),z.compressedTexSubImage3D(Vt,F,I.x,I.y,I.z,gt,Tt,It,zt,ve.data)):z.texSubImage3D(Vt,F,I.x,I.y,I.z,gt,Tt,It,zt,Yt,ve),z.pixelStorei(z.UNPACK_ROW_LENGTH,$t),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,Te),z.pixelStorei(z.UNPACK_SKIP_PIXELS,fn),z.pixelStorei(z.UNPACK_SKIP_ROWS,ze),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Yn),F===0&&V.generateMipmaps&&z.generateMipmap(Vt),yt.unbindTexture()},this.initTexture=function(w){w.isCubeTexture?A.setTextureCube(w,0):w.isData3DTexture?A.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?A.setTexture2DArray(w,0):A.setTexture2D(w,0),yt.unbindTexture()},this.resetState=function(){R=0,E=0,T=null,yt.reset(),P.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return oi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Oc?"display-p3":"srgb",e.unpackColorSpace=le.workingColorSpace===ta?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Le?Zi:rf}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Zi?Le:li}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class rx extends wf{}rx.prototype.isWebGL1Renderer=!0;class Hc{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new jt(t),this.near=e,this.far=i}clone(){return new Hc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class ox extends Be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class ax extends en{constructor(t=null,e=1,i=1,s,r,o,a,c,l=Ge,h=Ge,u,d){super(null,o,a,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Hh extends xn{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ls=new ae,Vh=new ae,wo=[],Wh=new cs,cx=new ae,vr=new Ht,xr=new sr;class Ar extends Ht{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Hh(new Float32Array(i*16),16),this.instanceColor=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,cx)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new cs),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ls),Wh.copy(t.boundingBox).applyMatrix4(Ls),this.boundingBox.union(Wh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new sr),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ls),xr.copy(t.boundingSphere).applyMatrix4(Ls),this.boundingSphere.union(xr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const i=this.matrixWorld,s=this.count;if(vr.geometry=this.geometry,vr.material=this.material,vr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),xr.copy(this.boundingSphere),xr.applyMatrix4(i),t.ray.intersectsSphere(xr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ls),Vh.multiplyMatrices(i,Ls),vr.matrixWorld=Vh,vr.raycast(t,wo);for(let o=0,a=wo.length;o<a;o++){const c=wo[o];c.instanceId=r,c.object=this,e.push(c)}wo.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Hh(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Vc extends ls{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new jt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Gh=new C,$h=new C,Xh=new ae,Ya=new ea,To=new sr;class Tf extends Be{constructor(t=new Ae,e=new Vc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)Gh.fromBufferAttribute(e,s-1),$h.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=Gh.distanceTo($h);t.setAttribute("lineDistance",new se(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),To.copy(i.boundingSphere),To.applyMatrix4(s),To.radius+=r,t.ray.intersectsSphere(To)===!1)return;Xh.copy(s).invert(),Ya.copy(t.ray).applyMatrix4(Xh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=new C,h=new C,u=new C,d=new C,m=this.isLineSegments?2:1,g=i.index,p=i.attributes.position;if(g!==null){const f=Math.max(0,o.start),v=Math.min(g.count,o.start+o.count);for(let x=f,M=v-1;x<M;x+=m){const R=g.getX(x),E=g.getX(x+1);if(l.fromBufferAttribute(p,R),h.fromBufferAttribute(p,E),Ya.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const U=t.ray.origin.distanceTo(d);U<t.near||U>t.far||e.push({distance:U,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const f=Math.max(0,o.start),v=Math.min(p.count,o.start+o.count);for(let x=f,M=v-1;x<M;x+=m){if(l.fromBufferAttribute(p,x),h.fromBufferAttribute(p,x+1),Ya.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const E=t.ray.origin.distanceTo(d);E<t.near||E>t.far||e.push({distance:E,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const jh=new C,qh=new C;class lx extends Tf{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)jh.fromBufferAttribute(e,s),qh.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+jh.distanceTo(qh);t.setAttribute("lineDistance",new se(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Wc extends en{constructor(t,e,i,s,r,o,a,c,l){super(t,e,i,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class jn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const r=i.length;let o;e?o=e:o=t*i[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=i[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===o)return s/(r-1);const h=i[s],d=i[s+1]-h,m=(o-h)/d;return(s+m)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new ht:new C);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new C,s=[],r=[],o=[],a=new C,c=new ae;for(let m=0;m<=t;m++){const g=m/t;s[m]=this.getTangentAt(g,new C)}r[0]=new C,o[0]=new C;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),d<=l&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let m=1;m<=t;m++){if(r[m]=r[m-1].clone(),o[m]=o[m-1].clone(),a.crossVectors(s[m-1],s[m]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Fe(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(c.makeRotationAxis(a,g))}o[m].crossVectors(s[m],r[m])}if(e===!0){let m=Math.acos(Fe(r[0].dot(r[t]),-1,1));m/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(m=-m);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],m*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Gc extends jn{constructor(t=0,e=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){const i=e||new ht,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,m=l-this.aY;c=d*h-m*u+this.aX,l=d*u+m*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class hx extends Gc{constructor(t,e,i,s,r,o){super(t,e,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function $c(){let n=0,t=0,e=0,i=0;function s(r,o,a,c){n=r,t=a,e=-3*r+3*o-2*a-c,i=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,m=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,m*=h,s(o,a,d,m)},calc:function(r){const o=r*r,a=o*r;return n+t*r+e*o+i*a}}}const Ao=new C,Ka=new $c,Ja=new $c,Za=new $c;class Xc extends jn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new C){const i=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(Ao.subVectors(s[0],s[1]).add(s[0]),l=Ao);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Ao.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ao),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),m),_=Math.pow(u.distanceToSquared(d),m),p=Math.pow(d.distanceToSquared(h),m);_<1e-4&&(_=1),g<1e-4&&(g=_),p<1e-4&&(p=_),Ka.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,_,p),Ja.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,_,p),Za.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,_,p)}else this.curveType==="catmullrom"&&(Ka.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Ja.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Za.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return i.set(Ka.calc(c),Ja.calc(c),Za.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Yh(n,t,e,i,s){const r=(i-t)*.5,o=(s-e)*.5,a=n*n,c=n*a;return(2*e-2*i+r+o)*c+(-3*e+3*i-2*r-o)*a+r*n+e}function ux(n,t){const e=1-n;return e*e*t}function fx(n,t){return 2*(1-n)*n*t}function dx(n,t){return n*n*t}function Rr(n,t,e,i){return ux(n,t)+fx(n,e)+dx(n,i)}function px(n,t){const e=1-n;return e*e*e*t}function mx(n,t){const e=1-n;return 3*e*e*n*t}function gx(n,t){return 3*(1-n)*n*n*t}function _x(n,t){return n*n*n*t}function Cr(n,t,e,i,s){return px(n,t)+mx(n,e)+gx(n,i)+_x(n,s)}class Af extends jn{constructor(t=new ht,e=new ht,i=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new ht){const i=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Cr(t,s.x,r.x,o.x,a.x),Cr(t,s.y,r.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class vx extends jn{constructor(t=new C,e=new C,i=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new C){const i=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(Cr(t,s.x,r.x,o.x,a.x),Cr(t,s.y,r.y,o.y,a.y),Cr(t,s.z,r.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Rf extends jn{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class xx extends jn{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Cf extends jn{constructor(t=new ht,e=new ht,i=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ht){const i=e,s=this.v0,r=this.v1,o=this.v2;return i.set(Rr(t,s.x,r.x,o.x),Rr(t,s.y,r.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Mx extends jn{constructor(t=new C,e=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new C){const i=e,s=this.v0,r=this.v1,o=this.v2;return i.set(Rr(t,s.x,r.x,o.x),Rr(t,s.y,r.y,o.y),Rr(t,s.z,r.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Pf extends jn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const i=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return i.set(Yh(a,c.x,l.x,h.x,u.x),Yh(a,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new ht().fromArray(s))}return this}}var Kh=Object.freeze({__proto__:null,ArcCurve:hx,CatmullRomCurve3:Xc,CubicBezierCurve:Af,CubicBezierCurve3:vx,EllipseCurve:Gc,LineCurve:Rf,LineCurve3:xx,QuadraticBezierCurve:Cf,QuadraticBezierCurve3:Mx,SplineCurve:Pf});class yx extends jn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Kh[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const o=s[r]-i,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new Kh[s.type]().fromJSON(s))}return this}}class bx extends yx{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Rf(this.currentPoint.clone(),new ht(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const r=new Cf(this.currentPoint.clone(),new ht(t,e),new ht(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,o){const a=new Af(this.currentPoint.clone(),new ht(t,e),new ht(i,s),new ht(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Pf(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,i,s,r,o),this}absarc(t,e,i,s,r,o){return this.absellipse(t,e,i,i,s,r,o),this}ellipse(t,e,i,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,r,o,a,c),this}absellipse(t,e,i,s,r,o,a,c){const l=new Gc(t,e,i,s,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class jc extends Ae{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:s},e=Math.floor(e),s=Fe(s,0,Math.PI*2);const r=[],o=[],a=[],c=[],l=[],h=1/e,u=new C,d=new ht,m=new C,g=new C,_=new C;let p=0,f=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:p=t[v+1].x-t[v].x,f=t[v+1].y-t[v].y,m.x=f*1,m.y=-p,m.z=f*0,_.copy(m),m.normalize(),c.push(m.x,m.y,m.z);break;case t.length-1:c.push(_.x,_.y,_.z);break;default:p=t[v+1].x-t[v].x,f=t[v+1].y-t[v].y,m.x=f*1,m.y=-p,m.z=f*0,g.copy(m),m.x+=_.x,m.y+=_.y,m.z+=_.z,m.normalize(),c.push(m.x,m.y,m.z),_.copy(g)}for(let v=0;v<=e;v++){const x=i+v*h*s,M=Math.sin(x),R=Math.cos(x);for(let E=0;E<=t.length-1;E++){u.x=t[E].x*M,u.y=t[E].y,u.z=t[E].x*R,o.push(u.x,u.y,u.z),d.x=v/e,d.y=E/(t.length-1),a.push(d.x,d.y);const T=c[3*E+0]*M,U=c[3*E+1],y=c[3*E+0]*R;l.push(T,U,y)}}for(let v=0;v<e;v++)for(let x=0;x<t.length-1;x++){const M=x+v*t.length,R=M,E=M+t.length,T=M+t.length+1,U=M+1;r.push(R,E,U),r.push(T,U,E)}this.setIndex(r),this.setAttribute("position",new se(o,3)),this.setAttribute("uv",new se(a,2)),this.setAttribute("normal",new se(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jc(t.points,t.segments,t.phiStart,t.phiLength)}}class qc extends jc{constructor(t=1,e=1,i=4,s=8){const r=new bx;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(i),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:i,radialSegments:s}}static fromJSON(t){return new qc(t.radius,t.length,t.capSegments,t.radialSegments)}}class rs extends Ae{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],l=new C,h=new ht;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const m=i+u/e*s;l.x=t*Math.cos(m),l.y=t*Math.sin(m),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new se(o,3)),this.setAttribute("normal",new se(a,3)),this.setAttribute("uv",new se(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rs(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class ln extends Ae{constructor(t=1,e=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],m=[];let g=0;const _=[],p=i/2;let f=0;v(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new se(u,3)),this.setAttribute("normal",new se(d,3)),this.setAttribute("uv",new se(m,2));function v(){const M=new C,R=new C;let E=0;const T=(e-t)/i;for(let U=0;U<=r;U++){const y=[],S=U/r,B=S*(e-t)+t;for(let H=0;H<=s;H++){const Y=H/s,D=Y*c+a,O=Math.sin(D),W=Math.cos(D);R.x=B*O,R.y=-S*i+p,R.z=B*W,u.push(R.x,R.y,R.z),M.set(O,T,W).normalize(),d.push(M.x,M.y,M.z),m.push(Y,1-S),y.push(g++)}_.push(y)}for(let U=0;U<s;U++)for(let y=0;y<r;y++){const S=_[y][U],B=_[y+1][U],H=_[y+1][U+1],Y=_[y][U+1];h.push(S,B,Y),h.push(B,H,Y),E+=6}l.addGroup(f,E,0),f+=E}function x(M){const R=g,E=new ht,T=new C;let U=0;const y=M===!0?t:e,S=M===!0?1:-1;for(let H=1;H<=s;H++)u.push(0,p*S,0),d.push(0,S,0),m.push(.5,.5),g++;const B=g;for(let H=0;H<=s;H++){const D=H/s*c+a,O=Math.cos(D),W=Math.sin(D);T.x=y*W,T.y=p*S,T.z=y*O,u.push(T.x,T.y,T.z),d.push(0,S,0),E.x=O*.5+.5,E.y=W*.5*S+.5,m.push(E.x,E.y),g++}for(let H=0;H<s;H++){const Y=R+H,D=B+H;M===!0?h.push(D,D+1,Y):h.push(D+1,D,Y),U+=3}l.addGroup(f,U,M===!0?1:2),f+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ln(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Hn extends ln{constructor(t=1,e=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Hn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class jr extends Ae{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const r=[],o=[];a(s),l(i),h(),this.setAttribute("position",new se(r,3)),this.setAttribute("normal",new se(r.slice(),3)),this.setAttribute("uv",new se(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){const x=new C,M=new C,R=new C;for(let E=0;E<e.length;E+=3)m(e[E+0],x),m(e[E+1],M),m(e[E+2],R),c(x,M,R,v)}function c(v,x,M,R){const E=R+1,T=[];for(let U=0;U<=E;U++){T[U]=[];const y=v.clone().lerp(M,U/E),S=x.clone().lerp(M,U/E),B=E-U;for(let H=0;H<=B;H++)H===0&&U===E?T[U][H]=y:T[U][H]=y.clone().lerp(S,H/B)}for(let U=0;U<E;U++)for(let y=0;y<2*(E-U)-1;y++){const S=Math.floor(y/2);y%2===0?(d(T[U][S+1]),d(T[U+1][S]),d(T[U][S])):(d(T[U][S+1]),d(T[U+1][S+1]),d(T[U+1][S]))}}function l(v){const x=new C;for(let M=0;M<r.length;M+=3)x.x=r[M+0],x.y=r[M+1],x.z=r[M+2],x.normalize().multiplyScalar(v),r[M+0]=x.x,r[M+1]=x.y,r[M+2]=x.z}function h(){const v=new C;for(let x=0;x<r.length;x+=3){v.x=r[x+0],v.y=r[x+1],v.z=r[x+2];const M=p(v)/2/Math.PI+.5,R=f(v)/Math.PI+.5;o.push(M,1-R)}g(),u()}function u(){for(let v=0;v<o.length;v+=6){const x=o[v+0],M=o[v+2],R=o[v+4],E=Math.max(x,M,R),T=Math.min(x,M,R);E>.9&&T<.1&&(x<.2&&(o[v+0]+=1),M<.2&&(o[v+2]+=1),R<.2&&(o[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function m(v,x){const M=v*3;x.x=t[M+0],x.y=t[M+1],x.z=t[M+2]}function g(){const v=new C,x=new C,M=new C,R=new C,E=new ht,T=new ht,U=new ht;for(let y=0,S=0;y<r.length;y+=9,S+=6){v.set(r[y+0],r[y+1],r[y+2]),x.set(r[y+3],r[y+4],r[y+5]),M.set(r[y+6],r[y+7],r[y+8]),E.set(o[S+0],o[S+1]),T.set(o[S+2],o[S+3]),U.set(o[S+4],o[S+5]),R.copy(v).add(x).add(M).divideScalar(3);const B=p(R);_(E,S+0,v,B),_(T,S+2,x,B),_(U,S+4,M,B)}}function _(v,x,M,R){R<0&&v.x===1&&(o[x]=v.x-1),M.x===0&&M.z===0&&(o[x]=R/2/Math.PI+.5)}function p(v){return Math.atan2(v.z,-v.x)}function f(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jr(t.vertices,t.indices,t.radius,t.details)}}class $o extends jr{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=1/i,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new $o(t.radius,t.detail)}}class Vn extends jr{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Vn(t.radius,t.detail)}}class ia extends jr{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ia(t.radius,t.detail)}}class hs extends Ae{constructor(t=.5,e=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);const a=[],c=[],l=[],h=[];let u=t;const d=(e-t)/s,m=new C,g=new ht;for(let _=0;_<=s;_++){for(let p=0;p<=i;p++){const f=r+p/i*o;m.x=u*Math.cos(f),m.y=u*Math.sin(f),c.push(m.x,m.y,m.z),l.push(0,0,1),g.x=(m.x/e+1)/2,g.y=(m.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<s;_++){const p=_*(i+1);for(let f=0;f<i;f++){const v=f+p,x=v,M=v+i+1,R=v+i+2,E=v+1;a.push(x,M,E),a.push(M,R,E)}}this.setIndex(a),this.setAttribute("position",new se(c,3)),this.setAttribute("normal",new se(l,3)),this.setAttribute("uv",new se(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class vn extends Ae{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new C,d=new C,m=[],g=[],_=[],p=[];for(let f=0;f<=i;f++){const v=[],x=f/i;let M=0;f===0&&o===0?M=.5/e:f===i&&c===Math.PI&&(M=-.5/e);for(let R=0;R<=e;R++){const E=R/e;u.x=-t*Math.cos(s+E*r)*Math.sin(o+x*a),u.y=t*Math.cos(o+x*a),u.z=t*Math.sin(s+E*r)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),p.push(E+M,1-x),v.push(l++)}h.push(v)}for(let f=0;f<i;f++)for(let v=0;v<e;v++){const x=h[f][v+1],M=h[f][v],R=h[f+1][v],E=h[f+1][v+1];(f!==0||o>0)&&m.push(x,M,E),(f!==i-1||c<Math.PI)&&m.push(M,R,E)}this.setIndex(m),this.setAttribute("position",new se(g,3)),this.setAttribute("normal",new se(_,3)),this.setAttribute("uv",new se(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Rn extends Ae{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const o=[],a=[],c=[],l=[],h=new C,u=new C,d=new C;for(let m=0;m<=i;m++)for(let g=0;g<=s;g++){const _=g/s*r,p=m/i*Math.PI*2;u.x=(t+e*Math.cos(p))*Math.cos(_),u.y=(t+e*Math.cos(p))*Math.sin(_),u.z=e*Math.sin(p),a.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(m/i)}for(let m=1;m<=i;m++)for(let g=1;g<=s;g++){const _=(s+1)*m+g-1,p=(s+1)*(m-1)+g-1,f=(s+1)*(m-1)+g,v=(s+1)*m+g;o.push(_,p,v),o.push(p,f,v)}this.setIndex(o),this.setAttribute("position",new se(a,3)),this.setAttribute("normal",new se(c,3)),this.setAttribute("uv",new se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Dn extends ls{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new jt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new jt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zc,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Sx extends ls{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new jt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zc,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Yc extends Be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new jt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class Ex extends Yc{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new jt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Qa=new ae,Jh=new C,Zh=new C;class Lf{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new kc,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Jh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Jh),Zh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Zh),e.updateMatrixWorld(),Qa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Qa),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Qa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Qh=new ae,Mr=new C,tc=new C;class wx extends Lf{constructor(){super(new mn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ht(4,2),this._viewportCount=6,this._viewports=[new me(2,1,1,1),new me(0,1,1,1),new me(3,1,1,1),new me(1,1,1,1),new me(3,0,1,1),new me(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const i=this.camera,s=this.matrix,r=t.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Mr.setFromMatrixPosition(t.matrixWorld),i.position.copy(Mr),tc.copy(i.position),tc.add(this._cubeDirections[e]),i.up.copy(this._cubeUps[e]),i.lookAt(tc),i.updateMatrixWorld(),s.makeTranslation(-Mr.x,-Mr.y,-Mr.z),Qh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Qh)}}class Tx extends Yc{constructor(t,e,i=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new wx}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Ax extends Lf{constructor(){super(new vf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Df extends Yc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.target=new Be,this.shadow=new Ax}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Rx{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=tu(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=tu();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function tu(){return(typeof performance>"u"?Date:performance).now()}class Cx{constructor(t,e,i=0,s=1/0){this.ray=new ea(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Fc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,i=[]){return Mc(t,this,i,e),i.sort(eu),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)Mc(t[s],this,i,e);return i.sort(eu),i}}function eu(n,t){return n.distance-t.distance}function Mc(n,t,e,i){if(n.layers.test(t.layers)&&n.raycast(t,e),i===!0){const s=n.children;for(let r=0,o=s.length;r<o;r++)Mc(s[r],t,e,!0)}}class nu{constructor(t=1,e=0,i=0){return this.radius=t,this.phi=e,this.theta=i,this}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(Fe(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ic}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ic);const iu={type:"change"},ec={type:"start"},su={type:"end"},Ro=new ea,ru=new xi,Px=Math.cos(70*Qp.DEG2RAD);class Lx extends as{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ii.ROTATE,MIDDLE:ii.DOLLY,RIGHT:ii.PAN},this.touches={ONE:ps.ROTATE,TWO:ps.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(P){P.addEventListener("keydown",Pt),this._domElementKeyEvents=P},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Pt),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(iu),i.update(),r=s.NONE},this.update=function(){const P=new C,it=new kn().setFromUnitVectors(t.up,new C(0,1,0)),Et=it.clone().invert(),_t=new C,Q=new kn,L=new C,st=2*Math.PI;return function(Dt=null){const Ct=i.object.position;P.copy(Ct).sub(i.target),P.applyQuaternion(it),a.setFromVector3(P),i.autoRotate&&r===s.NONE&&H(S(Dt)),i.enableDamping?(a.theta+=c.theta*i.dampingFactor,a.phi+=c.phi*i.dampingFactor):(a.theta+=c.theta,a.phi+=c.phi);let Qt=i.minAzimuthAngle,te=i.maxAzimuthAngle;isFinite(Qt)&&isFinite(te)&&(Qt<-Math.PI?Qt+=st:Qt>Math.PI&&(Qt-=st),te<-Math.PI?te+=st:te>Math.PI&&(te-=st),Qt<=te?a.theta=Math.max(Qt,Math.min(te,a.theta)):a.theta=a.theta>(Qt+te)/2?Math.max(Qt,a.theta):Math.min(te,a.theta)),a.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,a.phi)),a.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(h,i.dampingFactor):i.target.add(h),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor),i.zoomToCursor&&E||i.object.isOrthographicCamera?a.radius=q(a.radius):a.radius=q(a.radius*l),P.setFromSpherical(a),P.applyQuaternion(Et),Ct.copy(i.target).add(P),i.object.lookAt(i.target),i.enableDamping===!0?(c.theta*=1-i.dampingFactor,c.phi*=1-i.dampingFactor,h.multiplyScalar(1-i.dampingFactor)):(c.set(0,0,0),h.set(0,0,0));let be=!1;if(i.zoomToCursor&&E){let we=null;if(i.object.isPerspectiveCamera){const ne=P.length();we=q(ne*l);const Re=ne-we;i.object.position.addScaledVector(M,Re),i.object.updateMatrixWorld()}else if(i.object.isOrthographicCamera){const ne=new C(R.x,R.y,0);ne.unproject(i.object),i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/l)),i.object.updateProjectionMatrix(),be=!0;const Re=new C(R.x,R.y,0);Re.unproject(i.object),i.object.position.sub(Re).add(ne),i.object.updateMatrixWorld(),we=P.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;we!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(we).add(i.object.position):(Ro.origin.copy(i.object.position),Ro.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(Ro.direction))<Px?t.lookAt(i.target):(ru.setFromNormalAndCoplanarPoint(i.object.up,i.target),Ro.intersectPlane(ru,i.target))))}else i.object.isOrthographicCamera&&(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/l)),i.object.updateProjectionMatrix(),be=!0);return l=1,E=!1,be||_t.distanceToSquared(i.object.position)>o||8*(1-Q.dot(i.object.quaternion))>o||L.distanceToSquared(i.target)>0?(i.dispatchEvent(iu),_t.copy(i.object.position),Q.copy(i.object.quaternion),L.copy(i.target),!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",oe),i.domElement.removeEventListener("pointerdown",A),i.domElement.removeEventListener("pointercancel",N),i.domElement.removeEventListener("wheel",nt),i.domElement.removeEventListener("pointermove",b),i.domElement.removeEventListener("pointerup",N),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",Pt),i._domElementKeyEvents=null)};const i=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new nu,c=new nu;let l=1;const h=new C,u=new ht,d=new ht,m=new ht,g=new ht,_=new ht,p=new ht,f=new ht,v=new ht,x=new ht,M=new C,R=new ht;let E=!1;const T=[],U={};let y=!1;function S(P){return P!==null?2*Math.PI/60*i.autoRotateSpeed*P:2*Math.PI/60/60*i.autoRotateSpeed}function B(P){const it=Math.abs(P*.01);return Math.pow(.95,i.zoomSpeed*it)}function H(P){c.theta-=P}function Y(P){c.phi-=P}const D=function(){const P=new C;return function(Et,_t){P.setFromMatrixColumn(_t,0),P.multiplyScalar(-Et),h.add(P)}}(),O=function(){const P=new C;return function(Et,_t){i.screenSpacePanning===!0?P.setFromMatrixColumn(_t,1):(P.setFromMatrixColumn(_t,0),P.crossVectors(i.object.up,P)),P.multiplyScalar(Et),h.add(P)}}(),W=function(){const P=new C;return function(Et,_t){const Q=i.domElement;if(i.object.isPerspectiveCamera){const L=i.object.position;P.copy(L).sub(i.target);let st=P.length();st*=Math.tan(i.object.fov/2*Math.PI/180),D(2*Et*st/Q.clientHeight,i.object.matrix),O(2*_t*st/Q.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(D(Et*(i.object.right-i.object.left)/i.object.zoom/Q.clientWidth,i.object.matrix),O(_t*(i.object.top-i.object.bottom)/i.object.zoom/Q.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function j(P){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?l/=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function $(P){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?l*=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function X(P,it){if(!i.zoomToCursor)return;E=!0;const Et=i.domElement.getBoundingClientRect(),_t=P-Et.left,Q=it-Et.top,L=Et.width,st=Et.height;R.x=_t/L*2-1,R.y=-(Q/st)*2+1,M.set(R.x,R.y,1).unproject(i.object).sub(i.object.position).normalize()}function q(P){return Math.max(i.minDistance,Math.min(i.maxDistance,P))}function rt(P){u.set(P.clientX,P.clientY)}function ct(P){X(P.clientX,P.clientX),f.set(P.clientX,P.clientY)}function G(P){g.set(P.clientX,P.clientY)}function K(P){d.set(P.clientX,P.clientY),m.subVectors(d,u).multiplyScalar(i.rotateSpeed);const it=i.domElement;H(2*Math.PI*m.x/it.clientHeight),Y(2*Math.PI*m.y/it.clientHeight),u.copy(d),i.update()}function pt(P){v.set(P.clientX,P.clientY),x.subVectors(v,f),x.y>0?j(B(x.y)):x.y<0&&$(B(x.y)),f.copy(v),i.update()}function wt(P){_.set(P.clientX,P.clientY),p.subVectors(_,g).multiplyScalar(i.panSpeed),W(p.x,p.y),g.copy(_),i.update()}function St(P){X(P.clientX,P.clientY),P.deltaY<0?$(B(P.deltaY)):P.deltaY>0&&j(B(P.deltaY)),i.update()}function kt(P){let it=!1;switch(P.code){case i.keys.UP:P.ctrlKey||P.metaKey||P.shiftKey?Y(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):W(0,i.keyPanSpeed),it=!0;break;case i.keys.BOTTOM:P.ctrlKey||P.metaKey||P.shiftKey?Y(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):W(0,-i.keyPanSpeed),it=!0;break;case i.keys.LEFT:P.ctrlKey||P.metaKey||P.shiftKey?H(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):W(i.keyPanSpeed,0),it=!0;break;case i.keys.RIGHT:P.ctrlKey||P.metaKey||P.shiftKey?H(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):W(-i.keyPanSpeed,0),it=!0;break}it&&(P.preventDefault(),i.update())}function Bt(P){if(T.length===1)u.set(P.pageX,P.pageY);else{const it=mt(P),Et=.5*(P.pageX+it.x),_t=.5*(P.pageY+it.y);u.set(Et,_t)}}function Lt(P){if(T.length===1)g.set(P.pageX,P.pageY);else{const it=mt(P),Et=.5*(P.pageX+it.x),_t=.5*(P.pageY+it.y);g.set(Et,_t)}}function Zt(P){const it=mt(P),Et=P.pageX-it.x,_t=P.pageY-it.y,Q=Math.sqrt(Et*Et+_t*_t);f.set(0,Q)}function z(P){i.enableZoom&&Zt(P),i.enablePan&&Lt(P)}function We(P){i.enableZoom&&Zt(P),i.enableRotate&&Bt(P)}function Rt(P){if(T.length==1)d.set(P.pageX,P.pageY);else{const Et=mt(P),_t=.5*(P.pageX+Et.x),Q=.5*(P.pageY+Et.y);d.set(_t,Q)}m.subVectors(d,u).multiplyScalar(i.rotateSpeed);const it=i.domElement;H(2*Math.PI*m.x/it.clientHeight),Y(2*Math.PI*m.y/it.clientHeight),u.copy(d)}function Ut(P){if(T.length===1)_.set(P.pageX,P.pageY);else{const it=mt(P),Et=.5*(P.pageX+it.x),_t=.5*(P.pageY+it.y);_.set(Et,_t)}p.subVectors(_,g).multiplyScalar(i.panSpeed),W(p.x,p.y),g.copy(_)}function yt(P){const it=mt(P),Et=P.pageX-it.x,_t=P.pageY-it.y,Q=Math.sqrt(Et*Et+_t*_t);v.set(0,Q),x.set(0,Math.pow(v.y/f.y,i.zoomSpeed)),j(x.y),f.copy(v);const L=(P.pageX+it.x)*.5,st=(P.pageY+it.y)*.5;X(L,st)}function ue(P){i.enableZoom&&yt(P),i.enablePan&&Ut(P)}function Wt(P){i.enableZoom&&yt(P),i.enableRotate&&Rt(P)}function A(P){i.enabled!==!1&&(T.length===0&&(i.domElement.setPointerCapture(P.pointerId),i.domElement.addEventListener("pointermove",b),i.domElement.addEventListener("pointerup",N)),qt(P),P.pointerType==="touch"?Gt(P):et(P))}function b(P){i.enabled!==!1&&(P.pointerType==="touch"?J(P):Z(P))}function N(P){Nt(P),T.length===0&&(i.domElement.releasePointerCapture(P.pointerId),i.domElement.removeEventListener("pointermove",b),i.domElement.removeEventListener("pointerup",N)),i.dispatchEvent(su),r=s.NONE}function et(P){let it;switch(P.button){case 0:it=i.mouseButtons.LEFT;break;case 1:it=i.mouseButtons.MIDDLE;break;case 2:it=i.mouseButtons.RIGHT;break;default:it=-1}switch(it){case ii.DOLLY:if(i.enableZoom===!1)return;ct(P),r=s.DOLLY;break;case ii.ROTATE:if(P.ctrlKey||P.metaKey||P.shiftKey){if(i.enablePan===!1)return;G(P),r=s.PAN}else{if(i.enableRotate===!1)return;rt(P),r=s.ROTATE}break;case ii.PAN:if(P.ctrlKey||P.metaKey||P.shiftKey){if(i.enableRotate===!1)return;rt(P),r=s.ROTATE}else{if(i.enablePan===!1)return;G(P),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&i.dispatchEvent(ec)}function Z(P){switch(r){case s.ROTATE:if(i.enableRotate===!1)return;K(P);break;case s.DOLLY:if(i.enableZoom===!1)return;pt(P);break;case s.PAN:if(i.enablePan===!1)return;wt(P);break}}function nt(P){i.enabled===!1||i.enableZoom===!1||r!==s.NONE||(P.preventDefault(),i.dispatchEvent(ec),St(bt(P)),i.dispatchEvent(su))}function bt(P){const it=P.deltaMode,Et={clientX:P.clientX,clientY:P.clientY,deltaY:P.deltaY};switch(it){case 1:Et.deltaY*=16;break;case 2:Et.deltaY*=100;break}return P.ctrlKey&&!y&&(Et.deltaY*=10),Et}function ft(P){P.key==="Control"&&(y=!0,document.addEventListener("keyup",xt,{passive:!0,capture:!0}))}function xt(P){P.key==="Control"&&(y=!1,document.removeEventListener("keyup",xt,{passive:!0,capture:!0}))}function Pt(P){i.enabled===!1||i.enablePan===!1||kt(P)}function Gt(P){switch(At(P),T.length){case 1:switch(i.touches.ONE){case ps.ROTATE:if(i.enableRotate===!1)return;Bt(P),r=s.TOUCH_ROTATE;break;case ps.PAN:if(i.enablePan===!1)return;Lt(P),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(i.touches.TWO){case ps.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;z(P),r=s.TOUCH_DOLLY_PAN;break;case ps.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;We(P),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&i.dispatchEvent(ec)}function J(P){switch(At(P),r){case s.TOUCH_ROTATE:if(i.enableRotate===!1)return;Rt(P),i.update();break;case s.TOUCH_PAN:if(i.enablePan===!1)return;Ut(P),i.update();break;case s.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;ue(P),i.update();break;case s.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;Wt(P),i.update();break;default:r=s.NONE}}function oe(P){i.enabled!==!1&&P.preventDefault()}function qt(P){T.push(P.pointerId)}function Nt(P){delete U[P.pointerId];for(let it=0;it<T.length;it++)if(T[it]==P.pointerId){T.splice(it,1);return}}function At(P){let it=U[P.pointerId];it===void 0&&(it=new ht,U[P.pointerId]=it),it.set(P.pageX,P.pageY)}function mt(P){const it=P.pointerId===T[0]?T[1]:T[0];return U[it]}i.domElement.addEventListener("contextmenu",oe),i.domElement.addEventListener("pointerdown",A),i.domElement.addEventListener("pointercancel",N),i.domElement.addEventListener("wheel",nt,{passive:!1}),document.addEventListener("keydown",ft,{passive:!0,capture:!0}),this.update()}}function Dx(n){return{a:n>>>0,n:0,h:0,locked:!1}}function Pr(n){if(n.locked)throw new Error("a dice draw while the rng is locked (a preview or legality check must never roll)");let t=n.a|0;t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);e=e+Math.imul(e^e>>>7,61|e)^e;const i=((e^e>>>14)>>>0)/4294967296;return n.a=t,n.n++,n.h=Math.imul(n.h,31)+Math.floor(i*4294967296)>>>0,i}const Kc=n=>`${n.n}#${n.h.toString(36)}`;function If(n){n.locked=!0}function Uf(n){n.locked=!1}const Ui=Object.freeze({W:40,H:28,deploy:8}),Ti=1,qr=12,Ur=3,Nf=5,Yr=6,Nr=Object.freeze([{key:"move",name:"Movement"},{key:"shoot",name:"Shooting"},{key:"charge",name:"Charge"},{key:"fight",name:"Fight"},{key:"morale",name:"Morale"}].map(Object.freeze)),Jc=n=>1+Math.floor(Pr(n.rng)*6),Ye=(n,t)=>Array.from({length:t},()=>Jc(n)),ci=(n,t)=>n.filter(e=>e>=t).length,Ix=(n,t,e)=>n<t?t:n>e?e:n,Uo=n=>n>6?0:n<=1?1:(7-n)/6;function os(n){let t=0;for(let e=1;e<=6;e++)for(let i=1;i<=6;i++)e+i>=n&&t++;return t/36}function Kr(n,t,e){let i;return n>=2*t?i=2:n>t?i=3:n===t?i=4:2*n<=t?i=6:i=5,e?Math.min(i,e):i}function Jr(n,t,e){return Math.max(2,n+t-(e?1:0))}const zr=(n,t)=>Ix(n+t,2,6);function Zs(n,t,e){const i=n.alive;return e?i*n.t.A:t.blast?Math.min(t.shots,i):i*t.shots}function Xo(n,t,e,i,s){const r=i.t,o=Uo(t),a=Uo(Kr(e.S,r.T,e.poison)),c=1-Uo(Jr(r.Sv,e.AP,s)),l=n*o*a*c,h=Math.min(e.D,r.W)/r.W,u=Math.min(i.alive,l*h);return{wounds:l,kills:u,value:u*r.pts}}function zf(n){let t=n>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const En=(n,t,e)=>n+(t-n)*e,nn=(n,t)=>n[Math.floor(t()*n.length)],ie=(n,t,e)=>t+n()*(e-t);function In(n){if(n&&typeof n=="object"&&!Object.isFrozen(n)){Object.freeze(n);for(const t of Object.values(n))In(t)}return n}function Ux(n,t=0){let e=3735928559^t,i=1103547991^t;for(let s=0;s<n.length;s++){const r=n.charCodeAt(s);e=Math.imul(e^r,2654435761),i=Math.imul(i^r,1597334677)}return e=Math.imul(e^e>>>16,2246822507),e^=Math.imul(i^i>>>13,3266489909),i=Math.imul(i^i>>>16,2246822507),i^=Math.imul(e^e>>>13,3266489909),4294967296*(2097151&i)+(e>>>0)}function yc(n){var t;if(n===null||typeof n=="boolean"||typeof n=="string")return JSON.stringify(n);if(typeof n=="number"){if(!Number.isFinite(n))throw new Error(`canonicalJSON: ${n} is not a finite number`);return JSON.stringify(n)}if(Array.isArray(n))return`[${n.map(e=>{if(e===void 0)throw new Error("canonicalJSON: undefined in an array");return yc(e)}).join(",")}]`;if(typeof n=="object"&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null))return`{${Object.keys(n).filter(i=>n[i]!==void 0).sort().map(i=>`${JSON.stringify(i)}:${yc(n[i])}`).join(",")}}`;throw new Error(`canonicalJSON: can't encode ${typeof n=="object"?((t=n.constructor)==null?void 0:t.name)??"object":typeof n}`)}const ou={name:"Twig knives",S:3,AP:0,D:1},Nx={key:"squirrel",name:"Bushtail Clans",short:"Bushtails",icon:"🐿️",look:{team:"#ec8a34",dark:"#7a3d12",alt:"#c75ad6",gore:["#cf6d2a","#f1dcb5"],voice:"squeak",models:"squirrel",anim:"squirrel"},army:["elder","oakguard","nutkin","nutkin","grenadier","glider","trebuchet"],units:{nutkin:{name:"Nutkin Skirmishers",short:"Nutkin",role:"Troops",ai:"shooter",models:6,base:.3,pts:7,stats:"M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2",ranged:{name:"Slingshots",range:18,shots:2,S:3,AP:0,D:1,assault:!0,fx:"acorn"},melee:ou,abilities:["Scurry — may shoot after Advancing."]},grenadier:{name:"Acorn Grenadiers",short:"Grenadiers",role:"Troops",ai:"shooter",models:5,base:.3,pts:11,stats:"M6 WS4 BS4 S3 T3 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Blasting acorns",range:12,shots:2,blast:1.6,S:4,AP:1,D:1,scenery:1,fx:"bomb"},melee:ou,abilities:['Blast — lobs 2 templates; a miss scatters D6+1".']},oakguard:{name:"Oak Guard",short:"Oak Guard",role:"Elite",ai:"melee",models:5,base:.34,pts:22,stats:"M5 WS3 BS5 S4 T4 W2 A2 Ld8 Sv3 OC1",ranged:null,melee:{name:"Pinecone halberds",S:5,AP:2,D:1},abilities:["Bark shields — the clan’s anvil. No guns, all heart."]},glider:{name:"Glider Wing",short:"Gliders",role:"Fast",ai:"raider",models:4,base:.32,pts:15,fly:!0,stats:"M12 WS3 BS4 S3 T3 W1 A2 Ld7 Sv5 OC1",ranged:{name:"Thorn darts",range:10,shots:2,S:3,AP:1,D:1,assault:!0,fx:"dart"},melee:{name:"Hooked claws",S:4,AP:1,D:1},abilities:["Fly — moves over scenery and enemy units.","Swoop — may shoot after Advancing."]},trebuchet:{name:"Pinecone Trebuchet",short:"Trebuchet",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:95,big:!0,stats:"M3 WS6 BS4 S3 T5 W7 A2 Ld7 Sv4 OC0",ranged:{name:"Flaming pinecone",range:36,shots:1,blast:3,S:6,AP:1,D:2,indirect:!0,heavy:!0,scenery:3,fx:"pinecone"},melee:{name:"Crew mallets",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving."]},elder:{name:"Elder Chitterwick",short:"Elder",role:"Hero",ai:"hero",models:1,base:.42,pts:80,hero:!0,stats:"M6 WS3 BS3 S4 T4 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Thornburst",spell:6,range:18,shots:1,blast:2.4,S:5,AP:2,D:1,scenery:2,fx:"thorns"},melee:{name:"Rootwood staff",S:5,AP:1,D:2},abilities:["Spell — cast on 2D6 ≥ 6: thorns erupt under the target, no scatter.",`Grey whiskers — friends within ${Yr}" use his Ld 9.`]}}},zx={key:"serpent",name:"Coil of Ssithra",short:"Serpents",icon:"🐍",look:{team:"#46c27a",dark:"#14532d",alt:"#4aa8e8",gore:["#3f8f4a","#d9cf86"],voice:"hiss",models:"serpent",anim:"serpent"},army:["hierophant","brute","scaleguard","scaleguard","spitter","sidewinder","engine"],units:{scaleguard:{name:"Scaleguard",short:"Scaleguard",role:"Troops",ai:"line",models:6,base:.32,pts:10,stats:"M5 WS3 BS5 S4 T4 W1 A1 Ld7 Sv4 OC2",ranged:{name:"Javelins",range:8,shots:1,S:4,AP:0,D:1,fx:"javelin"},melee:{name:"Serpent spears",S:4,AP:1,D:1},abilities:["Shield wall — the Coil’s steady line."]},spitter:{name:"Venom Spitters",short:"Spitters",role:"Troops",ai:"shooter",models:5,base:.32,pts:12,stats:"M5 WS4 BS3 S3 T4 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Venom spit",range:12,shots:2,S:2,AP:1,D:1,poison:4,fx:"spit"},melee:{name:"Fangs",S:3,AP:0,D:1,poison:4},abilities:["Poison 4+ — always wounds on a 4+, however tough the target."]},sidewinder:{name:"Sidewinder Stalkers",short:"Sidewinders",role:"Fast",ai:"melee",models:4,base:.34,pts:24,chargeAfterAdvance:!0,stats:"M10 WS3 BS5 S4 T4 W2 A2 Ld7 Sv5 OC1",ranged:null,melee:{name:"Twin sickles",S:4,AP:1,D:1},abilities:["Sidewind — may charge after Advancing."]},brute:{name:"Constrictor Brute",short:"Brute",role:"Monster",ai:"melee",models:1,base:.95,pts:125,big:!0,wrecker:!0,stats:"M6 WS3 BS6 S6 T6 W9 A4 Ld8 Sv4 OC4",ranged:null,melee:{name:"Crushing coils",S:7,AP:2,D:2},abilities:["Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it)."]},engine:{name:"Basilisk Venom Engine",short:"Venom Engine",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:100,big:!0,stats:"M4 WS6 BS4 S3 T6 W7 A1 Ld7 Sv3 OC0",ranged:{name:"Acid globe",range:30,shots:1,blast:2.6,S:5,AP:2,D:2,poison:3,indirect:!0,heavy:!0,scenery:4,corrodes:!0,fx:"acid"},melee:{name:"Crew hooks",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving.","Acid — Poison 3+, and it eats stone."]},hierophant:{name:"Hierophant Ssithra",short:"Hierophant",role:"Hero",ai:"hero",models:1,base:.45,pts:85,hero:!0,stats:"M5 WS3 BS3 S4 T5 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Mesmerize",spell:7,range:18,mesmerize:!0,fx:"gaze"},melee:{name:"Fang staff",S:5,AP:2,D:2,poison:3},abilities:["Spell — cast on 2D6 ≥ 7: the target suffers D3 mortal wounds and is Mesmerized — it can’t shoot or charge next turn and hits at −1 in melee.",`Coiled will — friends within ${Yr}" use her Ld 9.`]}}},au=Object.freeze(["M","WS","BS","S","T","W","A","Ld","Sv","OC"]),cu=Object.freeze(["Troops","Elite","Fast","Hero","Monster","Artillery"]),lu=Object.freeze(["melee","raider","line","shooter","hero","artillery"]),Of=Object.freeze(["fly","big","hero","wrecker","burrow","chargeAfterAdvance","noCharge","brawler"]),Ox=new Set(["name","short","role","ai","models","base","pts","stats","ranged","melee","abilities",...Of,"move","deployRow","eye","chest","swarm","swoop"]),Ff=["range","shots","S","AP","D","blast","scenery","poison","spell"],kf=["assault","heavy","indirect","corrodes","mesmerize"],Fx=new Set(["name","fx",...Ff,...kf]),hu=["walk","fly","wreck","burrow"],uu=["front","mid","back"],fu=/^#[0-9a-f]{6}$/i,du=/^[a-z][a-z0-9-]*$/;function kx(n){const t={};for(const i of String(n).trim().split(/\s+/)){const s=/^([A-Za-z]+)(\d+)$/.exec(i);if(!s||!au.includes(s[1]))throw new Error(`bad stat "${i}" in "${n}"`);if(s[1]in t)throw new Error(`${s[1]} given twice in "${n}"`);t[s[1]]=Number(s[2])}const e=au.filter(i=>!(i in t));if(e.length)throw new Error(`"${n}" lacks ${e.join(", ")}`);return t}function pu(n,t,e){const i=r=>new Error(`${t}: ${r}`);if(!n||typeof n!="object")throw i("must be a weapon object");for(const r of Object.keys(n))if(!Fx.has(r))throw i(`unknown field "${r}"`);if(typeof n.name!="string"||!n.name)throw i("needs a name");if(n.fx!==void 0&&typeof n.fx!="string")throw i("fx is a string");for(const r of Ff)if(n[r]!==void 0&&!(Number.isFinite(n[r])&&n[r]>=0))throw i(`${r} must be a number ≥ 0`);for(const r of kf)if(n[r]!==void 0&&typeof n[r]!="boolean")throw i(`${r} must be true or false`);for(const r of["shots","S","AP","D","scenery","poison","spell"])if(n[r]!==void 0&&!Number.isInteger(n[r]))throw i(`${r} must be a whole number`);const s=["S","AP","D"];if(e){for(const r of s)if(n[r]===void 0)throw i(`a melee weapon needs ${r}`);for(const r of["range","shots","blast","spell","mesmerize","indirect","heavy","assault"])if(n[r]!==void 0)throw i(`a melee weapon has no ${r}`)}else{if(n.range===void 0)throw i("a ranged weapon needs a range");if(!n.mesmerize){for(const r of["shots",...s])if(n[r]===void 0)throw i(`a ranged weapon needs ${r}`)}if(n.mesmerize&&!n.spell)throw i("mesmerize is a spell: give it a cast value")}return{...n}}function Bx(n,t,e){var _,p;const i=`race ${n}, unit ${t}`,s=f=>new Error(`${i}: ${f}`);if(!e||typeof e!="object")throw s("must be an object");for(const f of Object.keys(e))if(!Ox.has(f))throw s(`unknown field "${f}"`);for(const f of["name","short"])if(typeof e[f]!="string"||!e[f])throw s(`needs a ${f}`);if(!cu.includes(e.role))throw s(`role must be one of ${cu.join(", ")}`);if(!lu.includes(e.ai))throw s(`ai must be one of ${lu.join(", ")}`);if(!Number.isInteger(e.models)||e.models<1)throw s("models must be a whole number ≥ 1");if(!(Number.isFinite(e.base)&&e.base>0))throw s("base must be a radius > 0");if(!Number.isInteger(e.pts)||e.pts<0)throw s("pts must be a whole number ≥ 0");if(!Array.isArray(e.abilities)||e.abilities.some(f=>typeof f!="string"))throw s("abilities is a list of card text");for(const f of Of)if(e[f]!==void 0&&typeof e[f]!="boolean")throw s(`${f} must be true or false`);if(e.move!==void 0&&!hu.includes(e.move))throw s(`move must be one of ${hu.join(", ")}`);if(e.deployRow!==void 0&&!uu.includes(e.deployRow))throw s(`deployRow must be one of ${uu.join(", ")}`);for(const f of["eye","chest"])if(e[f]!==void 0&&!(Number.isFinite(e[f])&&e[f]>0))throw s(`${f} must be a height > 0`);if(e.swarm!==void 0&&!Number.isInteger((_=e.swarm)==null?void 0:_.min))throw s("swarm is { min }");if(e.swoop!==void 0&&!Number.isInteger((p=e.swoop)==null?void 0:p.chargeS))throw s("swoop is { chargeS }");let r;try{r=kx(e.stats)}catch(f){throw s(f.message)}const o=e.ranged===null?null:pu(e.ranged,`${i}, ranged`,!1),a=pu(e.melee,`${i}, melee`,!0),c=(f,v)=>e[f]===void 0?v:e[f],l=c("fly",!1),h=c("big",!1),u=c("wrecker",!1),d=c("burrow",!1),m=c("hero",e.role==="Hero"),g={key:t,race:n,name:e.name,short:e.short,role:e.role,ai:e.ai,models:e.models,base:e.base,pts:e.pts,...r,ranged:o,melee:a,abilities:[...e.abilities],fly:l,big:h,hero:m,wrecker:u,burrow:d,chargeAfterAdvance:c("chargeAfterAdvance",!1),noCharge:c("noCharge",e.role==="Artillery"),brawler:c("brawler",!o||u),move:e.move??(l?"fly":u?"wreck":d?"burrow":"walk"),deployRow:e.deployRow??(e.role==="Artillery"?"back":m?"mid":"front"),eye:e.eye??(h?1.9:l?1.5:.95),chest:e.chest??(h||l?1:.55)};return e.swarm&&(g.swarm={min:e.swarm.min}),e.swoop&&(g.swoop={chargeS:e.swoop.chargeS}),g}function Hx(n){if(!n||typeof n!="object")throw new Error("defineRace needs a race object");const{key:t}=n;if(typeof t!="string"||!du.test(t))throw new Error(`race key "${t}" must be lower-case letters, digits and dashes`);const e=r=>new Error(`race ${t}: ${r}`);for(const r of Object.keys(n))if(!["key","name","short","icon","look","army","units"].includes(r))throw e(`unknown field "${r}"`);for(const r of["name","short","icon"])if(typeof n[r]!="string"||!n[r])throw e(`needs a ${r}`);const i=n.look;if(!i||typeof i!="object")throw e("needs a look");for(const r of["team","dark","alt"])if(!fu.test(i[r]??""))throw e(`look.${r} must be a #rrggbb colour`);if(!Array.isArray(i.gore)||i.gore.length!==2||!i.gore.every(r=>fu.test(r)))throw e("look.gore is two #rrggbb colours");for(const r of["voice","models","anim"])if(typeof i[r]!="string"||!i[r])throw e(`look.${r} must be named`);if(!n.units||typeof n.units!="object"||!Object.keys(n.units).length)throw e("needs units");const s=Object.create(null);for(const[r,o]of Object.entries(n.units)){if(!du.test(r))throw e(`unit key "${r}" must be lower-case letters, digits and dashes`);s[r]=Bx(t,r,o)}if(!Array.isArray(n.army)||!n.army.length)throw e("needs an army list");for(const r of n.army)if(!s[r])throw e(`army lists "${r}", which is not one of its units`);return In({key:t,name:n.name,short:n.short,icon:n.icon,look:{...i,gore:[...i.gore]},army:[...n.army],units:s})}function Vx(n){const t=n.map(s=>Hx(s)),e=t.map(s=>s.key),i=e.find((s,r)=>e.indexOf(s)!==r);if(i!==void 0)throw new Error(`two races use the key "${i}"`);return In(Object.assign(Object.create(null),Object.fromEntries(t.map(s=>[s.key,s]))))}const Li=Vx([Nx,zx]),ar=In(Object.assign(Object.create(null),{classic:{objectives:[{x:0,z:0},{x:-9,z:8},{x:9,z:-8},{x:-9,z:-8},{x:9,z:8}],rounds:Nf,deploy:Ui.deploy}})),mu=Object.freeze(["squirrel","serpent"]);function Ot(n,t){const e=Math.abs(n),i=Math.abs(t);if(e===1/0||i===1/0)return 1/0;const s=Math.max(e,i);return s!==s?NaN:s===0?0:Math.sqrt(e/s*(e/s)+i/s*(i/s))*s}function Wx(n,t,e){const i=Math.abs(n),s=Math.abs(t),r=Math.abs(e);if(i===1/0||s===1/0||r===1/0)return 1/0;const o=Math.max(Math.max(i,s),r);if(o!==o)return NaN;if(o===0)return 0;const a=i/o*(i/o),c=s/o*(s/o),l=a+c-a-c,h=r/o*(r/o)-l;return Math.sqrt(a+c+h)*o}const gu=Math.SQRT2,Bf=(n,t,e)=>({nx:Math.round(n/e),nz:Math.round(t/e)});class Gx{constructor(t,e,i=.5){this.W=t,this.H=e,this.cell=i;const{nx:s,nz:r}=Bf(t,e,i);this.nx=s,this.nz=r;const o=this.N=this.nx*this.nz;this.hard=new Uint8Array(o),this.soft=new Uint8Array(o),this.diff=new Uint8Array(o),this.cover=new Uint8Array(o),this.clearAll=new Float32Array(o),this.clearHard=new Float32Array(o),this.tmp=new Float32Array(o)}x(t){return-this.W/2+(t%this.nx+.5)*this.cell}z(t){return-this.H/2+(Math.floor(t/this.nx)+.5)*this.cell}index(t,e){const i=Math.floor((t+this.W/2)/this.cell),s=Math.floor((e+this.H/2)/this.cell);return i<0||s<0||i>=this.nx||s>=this.nz?-1:s*this.nx+i}rebuild(t){this.hard.fill(0),this.soft.fill(0),this.diff.fill(0),this.cover.fill(0);for(const e of t){if(!e.alive)continue;const i=e.nav||e.shape;e.navKind==="hard"?this.raster(i,.1,this.hard):e.navKind==="soft"?this.raster(i,.1,this.soft):e.navKind==="diff"&&this.raster(i,.15,this.diff),e.cover&&this.raster(e.coverShape||i,.6,this.cover)}this.field(this.hard,null,this.clearHard),this.field(this.hard,this.soft,this.clearAll)}raster(t,e,i){const s=Ot(t.hx,t.hz)+e,r=Math.cos(t.yaw),o=Math.sin(t.yaw),a=Math.max(0,Math.floor((t.x-s+this.W/2)/this.cell)),c=Math.min(this.nx-1,Math.floor((t.x+s+this.W/2)/this.cell)),l=Math.max(0,Math.floor((t.z-s+this.H/2)/this.cell)),h=Math.min(this.nz-1,Math.floor((t.z+s+this.H/2)/this.cell));for(let u=l;u<=h;u++)for(let d=a;d<=c;d++){const m=u*this.nx+d,g=this.x(m)-t.x,_=this.z(m)-t.z,p=g*r-_*o,f=g*o+_*r;Math.abs(p)<=t.hx+e&&Math.abs(f)<=t.hz+e&&(i[m]=1)}}field(t,e,i){const{nx:s,nz:r,cell:o}=this,a=1e6,c=o,l=o*gu;for(let h=0;h<this.N;h++)i[h]=t[h]||e&&e[h]?0:a;for(let h=0;h<r;h++)for(let u=0;u<s;u++){const d=h*s+u;let m=i[d];u>0&&(m=Math.min(m,i[d-1]+c)),h>0&&(m=Math.min(m,i[d-s]+c),u>0&&(m=Math.min(m,i[d-s-1]+l)),u<s-1&&(m=Math.min(m,i[d-s+1]+l))),i[d]=m}for(let h=r-1;h>=0;h--)for(let u=s-1;u>=0;u--){const d=h*s+u;let m=i[d];u<s-1&&(m=Math.min(m,i[d+1]+c)),h<r-1&&(m=Math.min(m,i[d+s]+c),u<s-1&&(m=Math.min(m,i[d+s+1]+l)),u>0&&(m=Math.min(m,i[d+s-1]+l))),i[d]=m}for(let h=0;h<this.N;h++){const u=this.x(h),d=this.z(h),m=Math.min(u+this.W/2,this.W/2-u,d+this.H/2,this.H/2-d);i[h]=Math.min(i[h]>0?i[h]-o*.5:0,m)}}clearance(t,e){return e==="wreck"?this.clearHard[t]:this.clearAll[t]}standable(t,e,i,s){return t<0||s&&s[t]?!1:this.clearance(t,i==="wreck"?"wreck":"all")>=e-.06}reach(t,e,{r:i,max:s,mode:r="walk",forbid:o=null}){const a=this.N,c=new Float64Array(a).fill(1/0),l=new Int32Array(a).fill(-1),h=this.index(t,e),u={dist:c,prev:l,start:h,mode:r,sx:t,sz:e};if(h<0)return u;if(r==="fly"){for(let v=0;v<a;v++){const x=Ot(this.x(v)-t,this.z(v)-e);x<=s&&(c[v]=x)}return u}const d=Ot(t-this.x(h),e-this.z(h));c[h]=d;const m=new Xx;m.push(h,d);const{nx:g,nz:_,cell:p}=this,f=this.clearance(h,r==="wreck"?"wreck":"all")<i-.06?i*1.5:0;for(;m.size;){const[v,x]=m.pop();if(x>c[v])continue;const M=v%g,R=v/g|0;for(let E=-1;E<=1;E++)for(let T=-1;T<=1;T++){if(!T&&!E)continue;const U=M+T,y=R+E;if(U<0||y<0||U>=g||y>=_)continue;const S=y*g+U;if(o&&o[S])continue;const B=this.clearance(S,r==="wreck"?"wreck":"all");if(B<i-.06&&!(f&&B>.05&&Ot(this.x(S)-t,this.z(S)-e)<f))continue;let H=this.diff[S]?2:1;r==="wreck"&&this.clearAll[S]<i-.06&&(H=2);const Y=x+(T&&E?gu:1)*p*H;Y<=s&&Y<c[S]&&(c[S]=Y,l[S]=v,m.push(S,Y))}}return u}path(t,e,i,s){if(t.mode==="fly")return[{x:t.sx,z:t.sz},{x:this.x(e),z:this.z(e)}];const r=[];for(let l=e;l!==-1&&(r.push(l),l!==t.start);l=t.prev[l]);r.reverse();const o=r.map(l=>({x:this.x(l),z:this.z(l)}));if(o[0]={x:t.sx,z:t.sz},o.length<3)return o;const a=[o[0]];let c=0;for(;c<o.length-1;){let l=c+1;for(let h=o.length-1;h>c+1;h--)if(this.walkable(o[c],o[h],i,t.mode,s)){l=h;break}a.push(o[l]),c=l}return a}walkable(t,e,i,s,r){const o=Ot(e.x-t.x,e.z-t.z),a=Math.ceil(o/(this.cell*.5)),c=this.diff[this.index(t.x,t.z)];for(let l=1;l<a;l++){const h=l/a,u=this.index(t.x+(e.x-t.x)*h,t.z+(e.z-t.z)*h);if(u<0||r&&r[u]||this.clearance(u,s==="wreck"?"wreck":"all")<i-.06||this.diff[u]!==c||s==="wreck"&&this.clearAll[u]<i-.06)return!1}if(r!=null&&r.discs){for(const l of r.discs)if($x(t,e,l)<l.R)return!1}return!0}}function $x(n,t,e){const i=t.x-n.x,s=t.z-n.z,r=i*i+s*s;let o=r>0?((e.x-n.x)*i+(e.z-n.z)*s)/r:0;return o=o<0?0:o>1?1:o,Ot(n.x+i*o-e.x,n.z+s*o-e.z)}const Hf=n=>{let t=0;for(let e=1;e<n.length;e++)t+=Ot(n[e].x-n[e-1].x,n[e].z-n[e-1].z);return t};class Xx{constructor(){this.ids=[],this.keys=[]}get size(){return this.ids.length}push(t,e){const{ids:i,keys:s}=this;let r=i.length;for(i.push(t),s.push(e);r>0;){const o=r-1>>1;if(s[o]<=e)break;i[r]=i[o],s[r]=s[o],r=o}i[r]=t,s[r]=e}pop(){const{ids:t,keys:e}=this,i=[t[0],e[0]],s=t.pop(),r=e.pop();if(t.length){let o=0;const a=t.length;for(;;){let c=2*o+1;if(c>=a||(c+1<a&&e[c+1]<e[c]&&c++,e[c]>=r))break;t[o]=t[c],e[o]=e[c],o=c}t[o]=s,e[o]=r}return i}}function ji(n,t,e){n&&n.push({t,...e})}function ot(n,t,e={}){ji(n.out,t,e)}function Vf(n,t){var e;n.journal.trace.push(t),(e=n.onTrace)==null||e.call(n,t,n)}function sa(n,t){const e=n.units.map(i=>`${i.id}:${i.pos.x.toFixed(3)},${i.pos.z.toFixed(3)},${i.models.map(s=>s.w).join("/")}`).join(" ");Vf(n,`${t} ${e} chunks:${n.terrain.chunks.filter(i=>i.alive).length} vp:${n.turn.vp.join("-")} rng:${Kc(n.rng)}`)}function jx(n,t,e){Vf(n,`log ${t} ${e.replace(/<[^>]+>/g,"")} rng:${Kc(n.rng)}`)}function He(n,t,e,i=""){jx(n,t,e),ot(n,"log",{side:t,html:e,cls:i,traced:!0,at:n.journal.trace.length}),Wf(n)}function Wf(n){for(const[t,e,i]of n.journal.pendingLog.splice(0))ot(n,"log",{side:t,html:e,cls:i,traced:!1,at:n.journal.trace.length})}const Gf=In({stone:{colors:["#8f8b82","#9c978d","#7f7b73","#a7a296","#878378"],bw:1,by:.72,bt:.62,hp:3,look:"box"},sand:{colors:["#c9a66b","#d6b67e","#b9935b","#ddc28e","#c29a60"],bw:1,by:.72,bt:.66,hp:2,look:"box"},log:{colors:["#7a5232","#6b4528","#86603c","#5f3e24"],bw:1,by:.56,bt:.56,hp:2,look:"log"}}),qx=In({oak:["#4f8a34","#5f9a3c","#447a2c","#6aa646"],autumn:["#d08a2c","#c4622a","#e0a93a","#b8481f"],pine:["#2f6a3c","#3a7a46","#285c34"]}),Yx=In(["#7a5232","#5f3e24","#9a7048","#b08a5a"]),Kx=Object.freeze(["#6b4a2e","#5a3d24","#7a5638"]),Jx=Object.freeze(["#3f7a34","#4a8a3a","#386c2e"]),Zx=Object.freeze(["#4f8f3e","#5c9a46","#3f7a34"]),Qx=Object.freeze(["#3f7a34","#5c9a46","#2f5f28"]),tM=Object.freeze(["#7d7a74","#8c8880","#6e6b66","#96918a"]),eM=Object.freeze(["#9a7048","#8a6038","#a77d50"]),nM=Object.freeze(["#8a5a34","#7a4c2a"]),iM=Object.freeze(["#c0392b","#d35a1f","#8e44ad","#b03050"]),_u=22;function Lr(n,t,e,i){const s=zf(i),r=Math.cos(e.yaw),o=Math.sin(e.yaw),a={p:(c,l)=>({x:e.x+r*c+o*l,z:e.z-o*c+r*l}),yaw:(c=0)=>e.yaw+c};No[t](n,a,s)}function Or(n,t,e,i,s,r,o,a,{holes:c=[],cap:l=!1,bw:h,bt:u}={}){const d=Gf[a],m=h??d.bw,g=u??d.bt,_=t.p(i,s),p=t.yaw(r),f={blocks:[],x:_.x,z:_.z,yaw:p,style:a,by:d.by,rubble:null,w:m,t:g};for(let v=0;v<o;v++){if(c.includes(v))continue;const x=nn(d.colors,e),M=p+(e()-.5)*.06,R=d.look==="log"?[m*1.02,d.by,g]:[m*(.95+e()*.04),d.by*.96,g*(.9+e()*.1)],E=n.add({kind:"block",hp:d.hp,shape:{x:_.x,y:d.by*(v+.5),z:_.z,hx:m/2,hy:d.by/2,hz:g/2,yaw:p},navKind:"soft",los:"block",cover:!0,col:f,level:v,look:{piece:d.look,color:x,chip:x,scale:R,yaw:M}});f.blocks.push(E)}if(l&&o>0){const v=nn(d.colors,e),x=d.by*o+m*.55,M=n.add({kind:"block",hp:d.hp,shape:{x:_.x,y:x,z:_.z,hx:m/2,hy:m*.55,hz:m/2,yaw:p},navKind:"soft",los:"block",cover:!0,col:f,level:o,look:{piece:"cap",color:v,chip:v,r:m*.72,h:m*1.1,yaw:p}});f.blocks.push(M)}return f}function sM(n,t,e,i,s,r){const o=t.p(i,s),a=ie(e,1.5,2.4),c=ie(e,.17,.26),l=nn(Kx,e),h=qx[r],u=[];let d;if(r==="pine"){for(let g=0;g<3;g++){const _=1.05-g*.26,p=1.3-g*.15;u.push({cone:!0,r:_,h:p,color:nn(h,e),y:a*.45+g*.75+p/2,yaw:e()*3})}d=a*.45+2.5}else{const g=3+Math.floor(e()*3);for(let _=0;_<g;_++){const p=ie(e,.55,.9);u.push({r:p,color:nn(h,e),pos:[ie(e,-.5,.5),a+ie(e,-.1,.6),ie(e,-.5,.5)]})}d=a+1.2}const m=e()*6;return n.add({kind:"tree",hp:3,shape:{x:o.x,y:d/2,z:o.z,hx:.7,hy:d/2,hz:.7,yaw:0},nav:{x:o.x,z:o.z,hx:c+.12,hz:c+.12,yaw:0},coverShape:{x:o.x,z:o.z,hx:.8,hz:.8,yaw:0},navKind:"soft",los:"obscure",cover:!0,trunkH:a,trunkR:c,look:{piece:"tree",trunk:{h:a,r:c},bark:l,canopy:u,yaw:m,leaves:h}})}function rM(n,t,e,i,s,r){const o=t.p(i,s),a=t.yaw(r),c=nn(Jx,e),l=[];for(let u=0;u<3;u++)l.push({color:nn(Zx,e),pos:[-.4+u*.4,.62+e()*.08,ie(e,-.08,.08)]});const h=[];if(e()<.4)for(let u=0;u<4;u++)h.push([ie(e,-.5,.5),ie(e,.35,.75),.29]);return n.add({kind:"hedge",hp:1,shape:{x:o.x,y:.42,z:o.z,hx:.6,hy:.42,hz:.3,yaw:a},navKind:"diff",los:"obscure",cover:!0,look:{piece:"hedge",color:c,tufts:l,berries:h,yaw:a,leaves:Qx}})}function bc(n,t,e,i,s,r){const o=t.p(i,s),a=ie(e,.65,1.25),c=nn(tM,e),l=[1,a,ie(e,.75,1.1)],h=[e()*.6,e()*6,e()*.6],u=r*a,d=e()<.6,m=u*1.5;return n.add({kind:"rock",hp:1/0,shape:{x:o.x,y:m/2,z:o.z,hx:r*.85,hy:m/2,hz:r*.85,yaw:0},navKind:"hard",los:m>1.2?"block":"obscure",cover:!0,look:{piece:"boulder",size:r,color:c,scale:l,rot:h,y:u*.55,moss:d}})}function Zc(n,t,e,i,s){const r=t.p(i,s),o=t.yaw(e()*6),a=e();let c,l;if(a<.45){const h=ie(e,.55,.75),u=nn(eM,e),d=e()<.4;c={piece:"crate",s:h,color:u,stacked:d},l=d?h*1.7:h}else if(a<.8)c={piece:"barrel",color:nn(nM,e)},l=.75;else{const h=[];for(let u=0;u<4;u++)h.push([ie(e,-.12,.12),ie(e,-.12,.12)]);c={piece:"sack",acorns:h},l=.78}return n.add({kind:"crate",hp:1,shape:{x:r.x,y:l/2,z:r.z,hx:.36,hy:l/2,hz:.36,yaw:o},navKind:"diff",los:"obscure",cover:!0,look:{...c,yaw:o,chip:"#9a7048"}})}function oM(n,t,e,i,s){const r=t.p(i,s),o=ie(e,.9,1.9),a=ie(e,.5,.95),c=ie(e,.12,.2),l=nn(iM,e),h=[];for(let m=0;m<6;m++){const g=e()*6,_=ie(e,.25,1.1);h.push([g,_])}const u=ie(e,-.12,.12),d=o+a*.7;return n.add({kind:"mushroom",hp:2,shape:{x:r.x,y:d/2,z:r.z,hx:a*.6,hy:d/2,hz:a*.6,yaw:0},nav:{x:r.x,z:r.z,hx:c+.12,hz:c+.12,yaw:0},navKind:"soft",los:"obscure",cover:!0,look:{piece:"mushroom",h:o,r:a,sr:c,cap:l,dots:h,tilt:u,leaves:[l,"#fff6e0","#efe6d0"]}})}function aM(n,t,e,i,s){const r=t.p(0,0),o=[];for(let a=1;a<_u+2;a++)o.push(.78+e()*.3);return n.add({kind:"floor",hp:1/0,shape:{x:r.x,y:.01,z:r.z,hx:i*.75,hy:.01,hz:i*.75,yaw:0},navKind:"diff",cover:!0,look:{piece:"floor",r:i,segments:_u,color:s,rim:o}})}function cM(n,t,e){const i=nn(["stone","sand","log","stone"],e),s=4+Math.floor(e()*3),r=3+Math.floor(e()*3),o=-s/2+.5,a=-r/2+.5,c=1+Math.floor(e()*(s-2));for(let h=0;h<s;h++){if(h===c)continue;let u=Math.max(1,Math.min(3,3-Math.floor(h/2)+Math.floor(e()*2)-(e()<.3?1:0)));const d=u===3&&e()<.35?[1]:[];Or(n,t,e,o+h,a,0,u,i,{holes:d})}for(let h=1;h<=r;h++){let u=Math.max(1,Math.min(3,3-Math.floor(h/2)+Math.floor(e()*2)));if(e()<.15)continue;const d=u===3&&e()<.35?[1]:[];Or(n,t,e,o,a+.3+.5+(h-1),Math.PI/2,u,i,{holes:d})}const l=Math.floor(e()*3);for(let h=0;h<l;h++)Zc(n,t,e,o+ie(e,1.5,s-1),a+ie(e,1.6,r-.5))}function lM(n,t,e){const i=nn(["stone","sand","log"],e),s=5+Math.floor(e()*3),r=Math.floor(e()*s);for(let o=0;o<s;o++){if(o===r&&s>5)continue;const a=1+Math.floor(e()*3);Or(n,t,e,o-(s-1)/2,0,0,a,i,{holes:a===3&&e()<.4?[1]:[]})}e()<.6&&Zc(n,t,e,ie(e,-2,2),ie(e,.9,1.4))}function hM(n,t,e){const i=nn(["stone","sand"],e),s=18,r=3.4,o=[];for(let l=0;l<s/2;l++)o.push(1+Math.floor(e()*3));const a=new Set([0,Math.floor(s/4)+(e()<.5?0:1)]),c=o.map(l=>l===3&&e()<.4);for(let l=0;l<s;l++){const h=l%(s/2);if(a.has(h))continue;const u=l/s*Math.PI*2,d=Math.atan2(-Math.cos(u),-Math.sin(u));Or(n,t,e,Math.cos(u)*r,Math.sin(u)*r,d,o[h],i,{holes:c[h]?[1]:[],bw:1.12})}}function uM(n,t,e){const i=e()<.3?"pine":e()<.4?"autumn":"oak";aM(n,t,e,3,i==="autumn"?"#5a5a2a":"#355a2a");const s=[],r=3+Math.floor(e()*3);for(let o=0;o<60&&s.length<r;o++){const a=e()*Math.PI*2,c=Math.sqrt(e())*2.2,l=Math.cos(a)*c,h=Math.sin(a)*c;s.some(u=>Ot(u.x-l,u.z-h)<1.55)||s.push({x:l,z:h})}for(const o of s)sM(n,t,e,o.x,o.z,i)}function fM(n,t,e){const i=5+Math.floor(e()*3),s=ie(e,-.12,.12),r=1+Math.floor(e()*(i-2));for(let o=0;o<i;o++){if(o===r&&e()<.7)continue;const a=(o-(i-1)/2)*1.12,c=s*a*a;rM(n,t,e,a,c,-Math.atan(2*s*a))}}function dM(n,t,e){const i=2+Math.floor(e()*3);bc(n,t,e,0,0,ie(e,.8,1.15));for(let s=1;s<i;s++){const r=e()*6;bc(n,t,e,Math.cos(r)*ie(e,.9,1.4),Math.sin(r)*ie(e,.9,1.4),ie(e,.35,.7))}}function pM(n,t,e){const i=3+Math.floor(e()*3);for(let s=0;s<i;s++)Zc(n,t,e,(s-(i-1)/2)*.8+ie(e,-.1,.1),ie(e,-.3,.3))}function mM(n,t,e){const i=3+Math.floor(e()*3),s=[];for(let r=0;r<40&&s.length<i;r++){const o=e()*6,a=Math.sqrt(e())*1.5,c=Math.cos(o)*a,l=Math.sin(o)*a;s.some(h=>Ot(h.x-c,h.z-l)<.9)||(s.push({x:c,z:l}),oM(n,t,e,c,l))}}function gM(n,t,e){Or(n,t,e,0,0,0,3+Math.floor(e()*2),"sand",{cap:!0,bw:.8,bt:.8}),e()<.7&&bc(n,t,e,1,.4,.4)}const No=In(Object.assign(Object.create(null),{ruin:cM,wall:lM,tower:hM,forest:uM,hedgerow:fM,rocks:dM,barricade:pM,mushrooms:mM,obelisk:gM})),Sc=In(Object.assign(Object.create(null),{tower(n,t,e){Lr(n,"tower",{x:0,z:0,yaw:t()*Math.PI},t()*1e9|0),e.push({x:0,z:0,r:4.6,hollow:!0})},rockbox(n,t,e){const i=t()*Math.PI;for(const s of[0,1]){const r=i+s*(Math.PI/2),o=Math.cos(r)*4.2,a=Math.sin(r)*4.2,c=t()*1e9|0;Lr(n,"rocks",{x:o,z:a,yaw:r},c),Lr(n,"rocks",{x:-o,z:-a,yaw:r+Math.PI},c),e.push({x:o,z:a,r:1.8},{x:-o,z:-a,r:1.8})}}}));function _M(n,t,e,i,s){const r=zf(e),{W:o,H:a}=n,c=[],l=r(),h=t.centre.find(([,_])=>l<_);h&&Sc[h[0]](n,r,c);const u=t.kinds,d=u.reduce((_,p)=>_+p[2],0),m=t.pairs[0]+Math.floor(r()*t.pairs[1]);let g=0;for(let _=0;_<t.attempts&&g<m;_++){let p=r()*d,f=u[0];for(const S of u)if((p-=S[2])<=0){f=S;break}const[v,x]=f,M=ie(r,-o/2+x+t.margin,o/2-x-t.margin),R=ie(r,-a/2+x+t.margin,a/2-x-t.margin);if(Ot(M,R)<x+t.selfGap||Math.abs(M)>o/2-s-t.deployMargin&&(x>t.bigNotInDeploy||t.notInDeploy.includes(v))||i.some(S=>Ot(S.x-M,S.z-R)<x+t.objectiveGap))continue;const T=t.gap;if(c.some(S=>Ot(S.x-M,S.z-R)<S.r+x+T||Ot(S.x+M,S.z+R)<S.r+x+T))continue;const U=r()*Math.PI*2,y=r()*1e9|0;Lr(n,v,{x:M,z:R,yaw:U},y),Lr(n,v,{x:-M,z:-R,yaw:U+Math.PI},y),c.push({x:M,z:R,r:x},{x:-M,z:-R,r:x}),g++}return c}const vu=Object.freeze(["centre","kinds","pairs","attempts","mirror","margin","selfGap","deployMargin","bigNotInDeploy","notInDeploy","objectiveGap","gap"]),xu=Object.freeze(["point"]);function vM(n,t){const e=r=>{throw new Error(`terrain set "${n}": ${r}`)},i=r=>typeof r=="number"&&Number.isFinite(r),s=r=>Number.isInteger(r)&&r>=0;(!t||typeof t!="object")&&e("is not a table");for(const r of Object.keys(t))vu.includes(r)||e(`unknown field "${r}"`);for(const r of vu)r in t||e(`no "${r}"`);(!Array.isArray(t.kinds)||!t.kinds.length)&&e("kinds must list at least one feature"),t.kinds.forEach((r,o)=>{(!Array.isArray(r)||r.length!==3)&&e(`kinds[${o}] must be [feature, radius, weight]`),r[0]in No||e(`kinds[${o}]: no feature "${r[0]}" (there are ${Object.keys(No).join(", ")})`),(!i(r[1])||r[1]<=0)&&e(`kinds[${o}] (${r[0]}): radius ${r[1]} must be a number above 0`),(!i(r[2])||r[2]<=0)&&e(`kinds[${o}] (${r[0]}): weight ${r[2]} must be a number above 0`)}),Array.isArray(t.centre)||e("centre must be a list of [piece, threshold]"),t.centre.forEach((r,o)=>{(!Array.isArray(r)||r.length!==2)&&e(`centre[${o}] must be [piece, threshold]`),r[0]in Sc||e(`centre[${o}]: no centre piece "${r[0]}" (there are ${Object.keys(Sc).join(", ")})`),(!i(r[1])||r[1]<=0||r[1]>1)&&e(`centre[${o}] (${r[0]}): threshold ${r[1]} must be in (0, 1]`),o&&r[1]<=t.centre[o-1][1]&&e(`centre[${o}] (${r[0]}): thresholds must rise (the first one above the draw wins)`)}),(!Array.isArray(t.pairs)||t.pairs.length!==2||!t.pairs.every(s))&&e("pairs must be two whole numbers, 0 or more"),s(t.attempts)||e(`attempts ${t.attempts} must be a whole number, 0 or more`),xu.includes(t.mirror)||e(`mirror "${t.mirror}" is not one scatter knows (${xu.join(", ")})`);for(const r of["margin","selfGap","deployMargin","bigNotInDeploy","objectiveGap","gap"])i(t[r])||e(`${r} ${t[r]} must be a finite number`);Array.isArray(t.notInDeploy)||e("notInDeploy must be a list of features");for(const r of t.notInDeploy)r in No||e(`notInDeploy: no feature "${r}"`);return t}const Gs=In(Object.assign(Object.create(null),{classic:{centre:[["tower",.55],["rockbox",.8]],kinds:[["ruin",3.2,4],["wall",3.6,2],["forest",3.2,3],["hedgerow",3.4,2],["rocks",2,2],["barricade",2,2],["mushrooms",2,1.5],["obelisk",1.6,1]],pairs:[6,3],attempts:1200,mirror:"point",margin:.5,selfGap:1.4,deployMargin:1,bigNotInDeploy:2.1,notInDeploy:["forest"],objectiveGap:2.2,gap:2.1}}));for(const n of Object.keys(Gs))vM(n,Gs[n]);function xM(n,t,e,i,s){const r=Math.cos(s.yaw),o=Math.sin(s.yaw),a=n.x-s.x,c=n.y-s.y,l=n.z-s.z,h=[a*r-l*o,c,a*o+l*r],u=[t*r-i*o,e,t*o+i*r],d=[s.hx,s.hy,s.hz];let m=0,g=1;for(let _=0;_<3;_++)if(Math.abs(u[_])<1e-9){if(Math.abs(h[_])>d[_])return!1}else{let p=(-d[_]-h[_])/u[_],f=(d[_]-h[_])/u[_];if(p>f&&([p,f]=[f,p]),p>m&&(m=p),f<g&&(g=f),m>g)return!1}return!0}function MM(n,t,e,i){const s=Math.cos(i.yaw),r=Math.sin(i.yaw),o=n-i.x,a=t-i.y,c=e-i.z,l=o*s-c*r,h=o*r+c*s,u=Math.max(0,Math.abs(l)-i.hx),d=Math.max(0,Math.abs(a)-i.hy),m=Math.max(0,Math.abs(h)-i.hz);return Wx(u,d,m)}const Mu=n=>({x:n.shape.x,y:n.shape.y,z:n.shape.z}),yM=n=>({id:n.id,kind:n.kind,shape:{...n.shape},look:n.look});class bM{constructor(t,e){this.W=t,this.H=e,this.chunks=[],this.features=[],this.dirty=!0,this.nextId=1}clear(t=null){this.chunks=[],this.features=[],this.nextId=1,this.dirty=!0,ji(t,"terrain.clear",{})}add(t,e=null){const i={id:this.nextId++,alive:!0,destructible:t.hp!==1/0,hp:t.hp??1/0,maxHp:t.hp??1/0,los:null,cover:!1,navKind:null,...t},s=i.shape;return s.reach=Ot(s.hx,s.hz)+.05,this.chunks.push(i),ji(e,"terrain.add",{def:yM(i)}),i}generate(t,e,i,s="classic",r=null){if(!(s in Gs))throw new Error(`no terrain set "${s}" (there are ${Object.keys(Gs).join(", ")})`);this.clear(r);const o={W:this.W,H:this.H,add:a=>this.add(a,r)};this.features=_M(o,Gs[s],t,e,i),this.dirty=!0}los(t,e,i=1.3){let s=0;const r=e.x-t.x,o=e.y-t.y,a=e.z-t.z,c=r*r+a*a;for(const l of this.chunks){if(!l.alive||!l.los)continue;const h=l.shape;let u=c>0?((h.x-t.x)*r+(h.z-t.z)*a)/c:0;u=u<0?0:u>1?1:u;const d=t.x+r*u-h.x,m=t.z+a*u-h.z;if(!(d*d+m*m>h.reach*h.reach)&&xM(t,r,o,a,h)){if(l.los==="block")return{blocked:!0,obscure:s};Ot(h.x-t.x,h.z-t.z)<i+h.reach*.5||s++}}return{blocked:s>=2,obscure:s}}blast(t,e,i,s,{acid:r=!1}={},o=null){const a=[];for(const c of[...this.chunks]){if(!c.alive||!c.destructible)continue;const l=MM(t,.5,e,c.shape);if(l>i)continue;let h=l<i*.6?s:Math.ceil(s/2);r&&c.kind==="block"&&(h+=1),this.hurt(c,h,{x:t,z:e},o,a)}return a}hurt(t,e,i,s=null,r=[]){return!t.alive||!t.destructible||(t.hp-=e,t.hp<=0?(this.destroy(t,i,s),r.push(t)):ji(s,"terrain.hurt",{id:t.id,from:i,at:Mu(t)})),r}destroy(t,e,i=null){switch(t.alive=!1,this.dirty=!0,ji(i,"terrain.destroy",{id:t.id,kind:t.kind,from:e,at:Mu(t)}),t.kind){case"block":this.collapse(t.col,i),this.rubble(t.col,e,i);break;case"tree":this.topple(t,e,i);break}}collapse(t,e=null){t.blocks=t.blocks.filter(r=>r.alive).sort((r,o)=>r.level-o.level);const i=[];let s=0;for(const r of t.blocks){if(r.level>s){const o=(r.level-s)*t.by;r.level=s,r.shape.y-=o,i.push({id:r.id,dy:o})}s=r.level+1}i.length&&ji(e,"terrain.collapse",{drops:i,by:t.by})}rubble(t,e,i=null){let s=t.rubble;if(!s){const r=t.style;s=t.rubble=this.add({kind:"rubble",hp:1/0,shape:{x:t.x,y:.2,z:t.z,hx:t.w*.7,hy:.2,hz:.6,yaw:t.yaw},navKind:"diff",los:"obscure",cover:!0,look:{piece:"rubble",style:r}},i),this.dirty=!0}ji(i,"terrain.rubble",{id:s.id,from:e})}topple(t,e,i=null){const s=t.shape;let r=s.x-((e==null?void 0:e.x)??s.x-1),o=s.z-((e==null?void 0:e.z)??s.z);const a=Ot(r,o)||1;r/=a,o/=a;const c=t.trunkH,l=this.add({kind:"log",hp:2,shape:{x:s.x+r*c*.5,y:t.trunkR,z:s.z+o*c*.5,hx:c*.5,hy:t.trunkR,hz:t.trunkR+.05,yaw:Math.atan2(-o,r)},navKind:"diff",los:"obscure",cover:!0,look:{piece:"fallen",tree:t.id,dx:r,dz:o}},i);return this.dirty=!0,l}}function SM(n,t){const e=t*2+.16;if(n===1)return[[0,0]];if(n<=4){const r=n===2?e/2:e/(2*Math.sin(Math.PI/n));return Array.from({length:n},(o,a)=>[Math.cos(a/n*Math.PI*2+.4)*r,Math.sin(a/n*Math.PI*2+.4)*r])}const i=n-1,s=Math.max(e,e/(2*Math.sin(Math.PI/i)));return[[0,0],...Array.from({length:i},(r,o)=>[Math.cos(o/i*Math.PI*2+.3)*s,Math.sin(o/i*Math.PI*2+.3)*s])]}function EM(n,t,e){const i=Ai(n,e),s=i.units[t],r={id:n.nextUnitId++,key:t,t:s,side:e,race:i.key,pos:{x:0,z:0},models:[],alive:s.models,r:0,flags:{},lost:0,mesmerized:!1};for(let o=0;o<s.models;o++)r.models.push({w:s.W,alive:!0,ox:0,oz:0});return $f(r),r}function $f(n){const t=n.models.filter(i=>i.alive),e=SM(t.length,n.t.base);t.sort((i,s)=>Math.atan2(i.oz,i.ox)-Math.atan2(s.oz,s.ox)),e.forEach(([i,s],r)=>{t[r].ox=i,t[r].oz=s}),n.r=e.reduce((i,[s,r])=>Math.max(i,Ot(s,r)),0)+n.t.base}function ra(n,t,e){n.pos.x=t,n.pos.z=e}function Xf(n,t){const{W:e}=Ui,i=Qc(n,t),s=i*(e/2),r=i*(e/2-Fr(n.setup).deploy);return{minX:Math.min(s,r),maxX:Math.max(s,r)}}function jf(n,t,e,{minX:i,maxX:s},r){const o=n.nav,a=o.x(e),c=o.z(e);return!(a-t.r<i-.01||a+t.r>s+.01||!o.standable(e,t.r,"walk")||r.some(l=>Ot(l.pos.x-a,l.pos.z-c)<l.r+t.r+.4))}function wM(n,t,e){return Number.isInteger(e)&&e>=0&&e<n.nav.N&&jf(n,t,e,Xf(n,t.side),n.units.filter(i=>i!==t))}function qf(n,t,e,i,s,r){const o=n.nav;let a=null,c=1/0;const l=Xf(n,s);for(let h=0;h<o.N;h++){if(!jf(n,t,h,l,r))continue;const u=o.x(h),d=o.z(h),m=Ot(u-e,d-i);m<c&&(c=m,a={x:u,z:d})}return a}function TM(n){const{W:t,H:e}=Ui;for(const i of[0,1]){const s=Qc(n,i),r=n.units.filter(d=>d.side===i),o=[],a=r.filter(d=>d.t.deployRow==="back"),c=r.filter(d=>d.t.deployRow==="mid"),l=r.filter(d=>d.t.deployRow==="front"),h=Fr(n.setup).deploy,u=[[l,t/2-h+1.8],[c,t/2-h+3.6],[a,t/2-2.4]];for(const[d,m]of u)d.forEach((g,_)=>{const p=((_+.5)/d.length-.5)*(e-6)*-s,f=qf(n,g,s*m,p,i,o)||{x:s*m,z:p};ra(g,f.x,f.z),o.push(g)})}}const Yf=Object.freeze([-1,1]),Fr=n=>ar.classic,Kf=.5;function AM(n,t){if(n.length!==2||t.length!==2)throw new Error("a match has two seats");return n.map((e,i)=>{if(typeof e!="string"||!Li[e])throw new Error(`seat ${i}: no race "${e}" (there are ${Object.keys(Li).join(", ")})`);if(t[i]!=="human"&&t[i]!=="ai")throw new Error(`seat ${i}: controller "${t[i]}" is neither human nor ai`);return{seat:i,race:e,edge:Yf[i],ctrl:t[i]}})}const RM=n=>({...n,seats:n.seats.map(t=>({...t}))}),Ai=(n,t)=>Li[n.seats[t].race],Qc=(n,t)=>n.seats[t].edge,tl=(n,t)=>n.seats[t].ctrl;function CM(n,{out:t=null,onTrace:e=null}={}){const{W:i,H:s}=Ui,r={setup:In(RM(n)),rng:Dx(n.dice),seats:AM(n.seats.map(o=>o.race),n.seats.map(o=>o.ctrl)),units:[],nextUnitId:1,objectives:Fr().objectives.map((o,a)=>({i:a,x:o.x,z:o.z})),terrain:new bM(i,s),nav:new Gx(i,s,Kf),turn:{stage:"deploy",step:"rolloff",round:1,t:0,active:0,first:0,ph:0,vp:[0,0],wiped:-1,result:null,overtime:0},pending:null,journal:{trace:[],pendingLog:[]},out:t,onTrace:e,strict:!1};r.terrain.generate(n.board,r.objectives,Fr().deploy,n.terrain,t),us(r);for(const o of[0,1])for(const a of Ai(r,o).army)r.units.push(EM(r,a,o));return TM(r),r}function us(n){n.terrain.dirty&&(n.terrain.dirty=!1,n.nav.rebuild(n.terrain.chunks))}function oa(n,t,e,i,s,r=null){let o=0;for(let a=0;a<e;a++){const c=t.models.filter(m=>m.alive);if(!c.length)break;let l=r?c.filter(m=>r.includes(m)):[];l.length||(l=c);const h=l.filter(m=>m.w<t.t.W);let u;if(h.length)u=h[0];else{const m=g=>Ot(lr(t,g)-s.pos.x,hr(t,g)-s.pos.z);u=l.reduce((g,_)=>m(g)<m(_)?g:_)}u.w-=i;const d=Math.min(i,i+Math.min(0,u.w));u.w<=0?(PM(n,t,u,s,d),o++):ot(n,"unit.wound",{u:t.id,m:t.models.indexOf(u),dmg:d}),ot(n,"pause",{s:.06})}return o&&(t.lost+=o,ot(n,"pause",{s:.25}),ce(t)&&Jf(n,t),n.out&&ot(n,"objectives",{owners:fs(n)})),n.out&&ot(n,"status",Ni(n)),o}function Jf(n,t){const e=Qr(n,t);if($f(t),e.length&&!hn(n,t)){const i=e.reduce((o,a)=>Ri(t,o)<Ri(t,a)?o:a),s=la(t,i),r=Ri(t,i)-(Ti-.3);ra(t,t.pos.x+(i.pos.x-t.pos.x)/s*r,t.pos.z+(i.pos.z-t.pos.z)/s*r)}ot(n,"unit.formation",{u:t.id,offs:t.models.map(i=>[i.ox,i.oz]),r:t.r,pos:{x:t.pos.x,z:t.pos.z}})}function PM(n,t,e,i,s){e.alive=!1,e.w=0,t.alive--,ot(n,"unit.slain",{u:t.id,m:t.models.indexOf(e),by:i?i.id:null,dmg:s}),ce(t)||Zf(n,t,i)}function Zf(n,t,e){n.journal.pendingLog.push([t.side,`<b>${t.t.name}</b> ${t.t.models>1?"are":"is"} destroyed!`,"big"]),ot(n,"unit.destroyed",{u:t.id,by:e?e.id:null})}function Qs(n,t){const e=t.t.ranged;return!(!e||!ce(t)||t.flags.shot||t.mesmerized||t.flags.fellBack||hn(n,t)||t.flags.advanced&&!e.assault)}function aa(n,t,e){const i=t.t.ranged,s=Ri(t,e);if(s>i.range)return{ok:!1,why:`out of range (${s.toFixed(1)}" / ${i.range}")`};if(hn(n,e)&&!i.spell)return{ok:!1,why:"locked in combat"};const r=rl(n,t,e);if(!r.visible&&!i.indirect)return{ok:!1,why:"no line of sight"};let o=0;return i.heavy&&t.flags.moved&&o++,i.indirect&&!r.visible&&o++,{ok:!0,range:s,...r,mod:o,need:zr(t.t.BS,o)}}function el(n,t){return Qs(n,t)?Wn(n,t).filter(e=>aa(n,t,e).ok):[]}function LM(n,t,e){const i=t.t.ranged,s=aa(n,t,e);if(t.flags.shot=!0,ot(n,"unit.face",{u:t.id,tg:e.id}),ot(n,"tray.open",{title:`${t.t.short} → ${e.t.short} · ${i.name}`}),i.spell){const _=Ye(n,2),p=_[0]+_[1]>=i.spell;if(ot(n,"dice",{label:`Cast ${i.spell}+ (2D6)`,dice:_,need:0,sum:!0,pass:p}),!p){ot(n,"spell.fizzle",{u:t.id}),He(n,t.side,`<b>${t.t.short}</b> tries ${i.name} — it fizzles (${_[0]+_[1]}).`);return}return ot(n,"spell.cast",{u:t.id}),i.mesmerize?UM(n,t,e):(He(n,t.side,`<b>${t.t.short}</b> casts <b>${i.name}</b> on ${e.t.short}!`),IM(n,t,e,i))}if(i.blast)return DM(n,t,e,i,s);const r=Zs(t,i,!1);ot(n,"volley",{u:t.id,tg:e.id,fx:i.fx,n:r});const o=Ye(n,r),a=ci(o,s.need);ot(n,"dice",{label:`Hit ${s.need}+`,dice:o,need:s.need});const c=Kr(i.S,e.t.T,i.poison),l=Ye(n,a),h=ci(l,c);a&&ot(n,"dice",{label:`Wound ${c}+`,dice:l,need:c});const u=Jr(e.t.Sv,i.AP,s.cover),d=Ye(n,h),m=u>6?h:h-ci(d,u);h&&ot(n,"dice",{label:u>6?"No save":`Save ${u}+${s.cover?" (cover)":""}`,dice:u>6?[]:d,need:u,save:!0});const g=oa(n,e,m,i.D,t);He(n,t.side,`<b>${t.t.short}</b> shoot ${e.t.short}: ${a} hit, ${h} wound, ${m} unsaved${g?` — <b>${g} slain</b>`:""}.`)}function DM(n,t,e,i,s){const{W:r,H:o}=Ui,a=Zs(t,i,!1);He(n,t.side,`<b>${t.t.short}</b> fire ${i.name} at ${e.t.short} (${s.need}+${s.visible?"":", unseen"}).`);for(let c=0;c<a&&!(!ce(t)||!ce(e)&&c>0);c++){const l=Pr(n.rng)*Math.PI*2,h=Pr(n.rng)*e.r*.5,u={x:e.pos.x+Math.cos(l)*h,z:e.pos.z+Math.sin(l)*h};ot(n,"blast.aim",{x:u.x,z:u.z,r:i.blast});const d=Ye(n,1),m=d[0]>=s.need;ot(n,"dice",{label:a>1?`Template ${c+1}: hit ${s.need}+`:`Hit ${s.need}+`,dice:d,need:s.need});let g=u;if(!m){const _=Ye(n,1)[0]+1,p=Pr(n.rng)*Math.PI*2;g={x:Math.max(-r/2+.3,Math.min(r/2-.3,u.x+Math.cos(p)*_)),z:Math.max(-o/2+.3,Math.min(o/2-.3,u.z+Math.sin(p)*_))},ot(n,"dice",{label:"Scatter D6+1",dice:[_-1],need:0,sum:!0,note:`${_}"`}),ot(n,"blast.scatter",{from:{x:u.x,z:u.z},to:{x:g.x,z:g.z},d:_})}ot(n,"blast.fire",{u:t.id,to:{x:g.x,z:g.z},fx:i.fx}),Qf(n,t,g,i)}}function IM(n,t,e,i){const s={x:e.pos.x,z:e.pos.z};ot(n,"spell.thorns",{u:t.id,x:s.x,z:s.z,r:i.blast}),Qf(n,t,s,i),ot(n,"spell.fade",{u:t.id})}function Qf(n,t,e,i){ot(n,"blast.land",{x:e.x,z:e.z,r:i.blast,fx:i.fx});const s=[];for(const o of n.units){if(!ce(o))continue;const a=o.models.filter(c=>c.alive&&Ot(lr(o,c)-e.x,hr(o,c)-e.z)<=i.blast+o.t.base*.6);a.length&&s.push({v:o,under:a})}for(const{v:o,under:a}of s){let c=a.length;o.t.big&&(c=Math.ceil(Jc(n)/2)+1);const l=o.side===t.side,h=Kr(i.S,o.t.T,i.poison),u=Ye(n,c),d=ci(u,h);ot(n,"dice",{label:`${l?"⚠ ":""}${o.t.short}: ${c} hit${c>1?"s":""} · wound ${h}+`,dice:u,need:h});const m=sl(n,o),g=Jr(o.t.Sv,i.AP,m),_=Ye(n,d),p=g>6?d:d-ci(_,g);d&&g<=6&&ot(n,"dice",{label:`Save ${g}+${m?" (cover)":""}`,dice:_,need:g,save:!0});const f=oa(n,o,p,i.D,t,a);He(n,t.side,`${l?"<b>Friendly fire!</b> ":""}${i.name} hits ${o.t.short}: ${d} wound, ${p} unsaved${f?` — <b>${f} slain</b>`:""}.`)}s.length||ot(n,"pause",{s:.25});const r=n.terrain.blast(e.x,e.z,i.blast,i.scenery||1,{acid:!!i.corrodes},n.out);r.length&&He(n,t.side,`…and ${r.length} piece${r.length>1?"s":""} of scenery ${r.length>1?"are":"is"} wrecked.`),us(n)}function UM(n,t,e){ot(n,"spell.gaze",{u:t.id,tg:e.id});const i=Math.ceil(Jc(n)/2);ot(n,"dice",{label:"Mortal wounds D3",dice:[i],need:0,sum:!0,note:`${i}`});const s=oa(n,e,i,1,t);e.mesmerized=!0,n.out&&ot(n,"status",Ni(n)),ot(n,"spell.mesmerized",{u:t.id,tg:e.id}),He(n,t.side,`<b>${t.t.short}</b> mesmerizes ${e.t.short}: ${i} mortal wound${i>1?"s":""}${s?`, <b>${s} slain</b>`:""}. It can't shoot or charge next turn.`)}function nl(n){return n.t.move}function jo(n,t,e,i=[]){const{W:s,H:r}=Ui,o=n.nav,a=new Uint8Array(o.N);a.discs=[];for(const c of Wn(n,t)){const l=c.r+t.r+(i.includes(c)?.02:e);a.discs.push({x:c.pos.x,z:c.pos.z,R:l-.02});const h=Math.max(0,Math.floor((c.pos.x-l+s/2)/o.cell)),u=Math.min(o.nx-1,Math.floor((c.pos.x+l+s/2)/o.cell)),d=Math.max(0,Math.floor((c.pos.z-l+r/2)/o.cell)),m=Math.min(o.nz-1,Math.floor((c.pos.z+l+r/2)/o.cell));for(let g=d;g<=m;g++)for(let _=h;_<=u;_++){const p=g*o.nx+_;Ot(o.x(p)-c.pos.x,o.z(p)-c.pos.z)<l&&(a[p]=1)}}return a}function $s(n,t,e=0){us(n);const i=hn(n,t),s=t.t.M+e,r=nl(t),o=Wn(n,t),a=jo(n,t,Ti+.05,i?o:[]),c=jo(n,t,Ti+.05),l=n.nav.reach(t.pos.x,t.pos.z,{r:t.r,max:s,mode:r==="fly"?"fly":r,forbid:r==="fly"?null:a});return{u:t,res:l,max:s,mode:r,forbid:a,endForbid:c,fallback:i}}function Zr(n,t,e){const{u:i,res:s,mode:r,endForbid:o}=t,a=n.nav;if(e<0||!isFinite(s.dist[e])||!a.standable(e,i.r,r==="wreck"?"wreck":"walk",o))return!1;const c=a.x(e),l=a.z(e);for(const h of n.units)if(h!==i&&ce(h)&&Ot(h.pos.x-c,h.pos.z-l)<h.r+i.r+.08)return!1;return!0}function NM(n,t,e,i,s=2.4){const r=n.nav;let o=-1,a=s;const c=r.index(e,i);if(c<0)return-1;const l=Math.ceil(s/r.cell),h=c%r.nx,u=c/r.nx|0;for(let d=-l;d<=l;d++)for(let m=-l;m<=l;m++){const g=h+m,_=u+d;if(g<0||_<0||g>=r.nx||_>=r.nz)continue;const p=_*r.nx+g,f=Ot(r.x(p)-e,r.z(p)-i);f<a&&Zr(n,t,p)&&(a=f,o=p)}return o}function zM(n,t,e,i=$s(n,t,t.flags.advanced?t.flags.advRoll:0)){const s=n.nav.path(i.res,e,t.r,i.mode==="fly"?null:i.forbid);t.flags.moved=!0,i.fallback&&(t.flags.fellBack=!0);const r=Hf(s);He(n,t.side,`<b>${t.t.short}</b> ${i.fallback?"fall back":t.flags.advanced?"advance":"move"} ${r.toFixed(1)}".`),td(n,t,s,{fly:i.mode==="fly",stomp:t.t.wrecker&&r>.1}),us(n)}function OM(n,t){ot(n,"tray.open",{title:`${t.t.short} — Advance`});const e=Ye(n,1);return ot(n,"dice",{label:"Advance D6",dice:e,need:0,sum:!0,note:`+${e[0]}"`}),t.flags.advanced=!0,t.flags.advRoll=e[0],He(n,t.side,`<b>${t.t.short}</b> advance: +${e[0]}".`),e[0]}function FM(n,t){t.flags.moved=!0}function td(n,t,e,{speed:i=7,fly:s=!1,stomp:r=!1}={}){const o=Hf(e);if(o<.05)return;const a=[];let c=0;for(let d=1;d<e.length;d++){const m=Ot(e[d].x-e[d-1].x,e[d].z-e[d-1].z);a.push({a:e[d-1],b:e[d],s:c,l:m}),c+=m}const l=[];if(t.t.wrecker){const d=[];for(const g of a)for(let _=0;_<g.l;_+=.25)d.push({s:g.s+_,x:g.a.x+(g.b.x-g.a.x)*_/g.l,z:g.a.z+(g.b.z-g.a.z)*_/g.l,dir:Math.atan2(g.b.x-g.a.x,g.b.z-g.a.z)});const m=a[a.length-1];d.push({s:o,x:e[e.length-1].x,z:e[e.length-1].z,dir:Math.atan2(m.b.x-m.a.x,m.b.z-m.a.z)});for(const g of d){const _=n.out?[]:null;kM(n,t,g,_)&&_&&l.push({s:g.s,ev:_})}}const h=a.find(d=>o<=d.s+d.l)||a[a.length-1],u=h.l>0?(o-h.s)/h.l:1;ra(t,En(h.a.x,h.b.x,u),En(h.a.z,h.b.z,u)),n.out&&(ot(n,"unit.move",{u:t.id,path:e.map(d=>({x:d.x,z:d.z})),L:o,speed:i,fly:s,stomp:r,smashes:l,to:{x:t.pos.x,z:t.pos.z}}),ot(n,"objectives",{owners:fs(n)}),ot(n,"status",Ni(n)))}function kM(n,t,{x:e,z:i,dir:s},r){let o=0;for(const a of n.terrain.chunks){if(!a.alive||!a.destructible)continue;const c=a.nav||a.shape;Ot(c.x-e,c.z-i)<t.r+Math.max(c.hx,c.hz)*.8&&(n.terrain.hurt(a,99,{x:e-Math.sin(s),z:i-Math.cos(s)},r),o++)}return o}function kr(n,t){return!(!ce(t)||t.flags.charged||t.flags.chargeTried||t.t.noCharge||t.mesmerized||t.flags.fellBack||hn(n,t)||t.flags.advanced&&!t.t.chargeAfterAdvance)}function ca(n,t){return kr(n,t)?Wn(n,t).filter(e=>Ri(t,e)<=qr):[]}function cr(n,t,e){us(n);const i=n.nav,s=Wn(n,t).filter(p=>p!==e),r=nl(t),o=jo(n,t,Ti+.05,[e]),a=i.reach(t.pos.x,t.pos.z,{r:t.r,max:qr+.5,mode:r,forbid:r==="fly"?null:o}),c=[];let l=-1,h=1/0;const u=e.r+t.r+Ti-.08,d=Math.ceil((u+1)/i.cell),m=i.index(e.pos.x,e.pos.z),g=m%i.nx,_=m/i.nx|0;for(let p=-d;p<=d;p++)for(let f=-d;f<=d;f++){const v=g+f,x=_+p;if(v<0||x<0||v>=i.nx||x>=i.nz)continue;const M=x*i.nx+v,R=a.dist[M];if(!isFinite(R))continue;const E=Ot(i.x(M)-e.pos.x,i.z(M)-e.pos.z);E>u||E<e.r+t.r+.02||i.standable(M,t.r,r==="wreck"?"wreck":"walk",o)&&(s.some(T=>Ot(i.x(M)-T.pos.x,i.z(M)-T.pos.z)<T.r+t.r+Ti)||n.units.some(T=>T!==t&&T!==e&&ce(T)&&T.side===t.side&&Ot(T.pos.x-i.x(M),T.pos.z-i.z(M))<T.r+t.r+.05)||(c.push({i:M,d:R}),R<h&&(l=M,h=R)))}return l<0?null:{cell:l,need:Math.max(2,Math.ceil(h-.01)),res:a,forbid:o,mode:r,dist:h,spots:c}}function ed(n,t){const e=new Uint8Array(n.res.dist.length);for(const i of n.spots)i.d<=t+.011&&(e[i.i]=1);return e[n.cell]=1,e}function BM(n,t,e,i){const s=cr(n,t,e);if(t.flags.chargeTried=!0,ot(n,"tray.open",{title:`${t.t.short} charge ${e.t.short}`}),!s)return He(n,t.side,`<b>${t.t.short}</b> can't find a way to ${e.t.short}.`),null;const r=Ye(n,2),o=r[0]+r[1],a=o>=s.need;return ot(n,"dice",{label:`Charge ${s.need}" (2D6)`,dice:r,need:0,sum:!0,pass:a}),ot(n,"unit.face",{u:t.id,tg:e.id}),a?(t.flags.charged=!0,t.flags.chargeTarget=e.id,ot(n,"charge.result",{u:t.id,tg:e.id,ok:a}),He(n,t.side,`<b>${t.t.short}</b> charge ${e.t.short} — roll ${o} vs ${s.need}. <b>Contact!</b>`),i!=="ai"?{plan:s,rolled:o}:(nd(n,t,e,s.cell,s),null)):(ot(n,"charge.result",{u:t.id,tg:e.id,ok:a}),He(n,t.side,`<b>${t.t.short}</b> charge ${e.t.short} — roll ${o}, needed ${s.need}. Failed.`),null)}function nd(n,t,e,i,s=cr(n,t,e)){const r=n.nav.path(s.res,i,t.r,s.mode==="fly"?null:s.forbid);td(n,t,r,{speed:11,fly:s.mode==="fly"}),us(n)}const ce=n=>n.alive>0,Wn=(n,t)=>n.units.filter(e=>e.side!==t.side&&ce(e)),il=(n,t)=>n.units.filter(e=>e.side===t.side&&ce(e)&&e!==t),la=(n,t)=>Ot(n.pos.x-t.pos.x,n.pos.z-t.pos.z),Ri=(n,t)=>la(n,t)-n.r-t.r,Qr=(n,t)=>Wn(n,t).filter(e=>Ri(t,e)<=Ti+.05),lr=(n,t)=>n.pos.x+t.ox,hr=(n,t)=>n.pos.z+t.oz,hn=(n,t)=>Qr(n,t).length>0,id=n=>n.t.eye,sd=n=>n.t.chest;function sl(n,t){const e=t.models.filter(s=>s.alive);if(t.t.fly)return!1;let i=0;for(const s of e)n.nav.cover[n.nav.index(lr(t,s),hr(t,s))]&&i++;return i*2>=e.length&&i>0}function rl(n,t,e,i=t.pos){const s={x:i.x,y:id(t),z:i.z};let r=0,o=0,a=0;for(const c of e.models){if(!c.alive)continue;a++;const l=n.terrain.los(s,{x:lr(e,c),y:sd(e),z:hr(e,c)});l.blocked||(r++,l.obscure&&o++)}return{visible:r>0,cover:r>0&&(o>0||r<a||sl(n,e)),seen:r,total:a}}function rd(n,t){let e=t.t.Ld;for(const i of il(n,t))i.t.hero&&la(t,i)<=Yr+t.r&&(e=Math.max(e,i.t.Ld));return e}function ha(n,t){const e=[0,0];for(const i of n.units)if(ce(i))for(const s of i.models)s.alive&&Ot(lr(i,s)-t.x,hr(i,s)-t.z)<=Ur+i.t.base&&(e[i.side]+=i.t.OC);return e[0]>e[1]?0:e[1]>e[0]?1:-1}const fs=n=>n.objectives.map(t=>ha(n,t)),Ni=n=>({engaged:n.units.filter(t=>ce(t)&&hn(n,t)).map(t=>t.id),mesmerized:n.units.filter(t=>t.mesmerized).map(t=>t.id)}),tr=n=>Nr[Math.min(n.turn.ph,Nr.length-1)].key;function od(n,t){if(!ce(t)||t.side!==n.turn.active)return!1;switch(tr(n)){case"move":return!t.flags.moved;case"shoot":return Qs(n,t)&&el(n,t).length>0;case"charge":return kr(n,t)&&ca(n,t).length>0}return!1}const ad=(n,t)=>n.units.some(e=>e.side===t&&od(n,e)),cd=Object.freeze(Object.defineProperty({__proto__:null,alive:ce,anyCanAct:ad,canAct:od,canCharge:kr,canShoot:Qs,chargePlan:cr,chargeSpots:ed,chargeTargets:ca,chestY:sd,controlOf:ha,dist:la,enemiesOf:Wn,engagedWith:Qr,eyeY:id,forbidMask:jo,freeSpot:qf,friendsOf:il,gap:Ri,inCover:sl,isEngaged:hn,leadership:rd,moveMode:nl,movePlan:$s,mx:lr,mz:hr,nearestValid:NM,ownersOf:fs,phaseKey:tr,rngState:Kc,shootTargets:el,shotInfo:aa,sight:rl,statusOf:Ni,validEnd:Zr},Symbol.toStringTag,{value:"Module"}));function yu(n,t){if(!ce(t)||t.flags.fought)return;const e=Qr(n,t);if(!e.length)return;t.flags.fought=!0;const i=e.find(f=>f.id===t.flags.chargeTarget)||e.reduce((f,v)=>f.alive*f.t.W<v.alive*v.t.W?f:v),s=t.t.melee,r=t.mesmerized?1:0,o=zr(t.t.WS,r);ot(n,"unit.face",{u:t.id,tg:i.id}),ot(n,"focus",{x:t.pos.x*.5+i.pos.x*.5,z:t.pos.z*.5+i.pos.z*.5}),ot(n,"tray.open",{title:`${t.t.short} fight ${i.t.short} · ${s.name}`});const a=Zs(t,s,!0),c=Ye(n,a),l=ci(c,o);ot(n,"melee",{u:t.id,tg:i.id,n:a,hits:l}),ot(n,"dice",{label:`Hit ${o}+${r?" (mesmerized)":""}`,dice:c,need:o});const h=Kr(s.S,i.t.T,s.poison),u=Ye(n,l),d=ci(u,h);l&&ot(n,"dice",{label:`Wound ${h}+`,dice:u,need:h});const m=Jr(i.t.Sv,s.AP,!1),g=Ye(n,d),_=m>6?d:d-ci(g,m);d&&ot(n,"dice",{label:m>6?"No save":`Save ${m}+`,dice:m>6?[]:g,need:m,save:!0});const p=oa(n,i,_,s.D,t);He(n,t.side,`<b>${t.t.short}</b> fight ${i.t.short}: ${l} hit, ${d} wound, ${_} unsaved${p?` — <b>${p} slain</b>`:""}.`),ot(n,"pause",{s:.3})}function HM(n,t){const e=n.units.filter(s=>s.side===t&&s.flags.charged&&ce(s));for(const s of e)yu(n,s);let i=1-t;for(let s=0;s<30;s++){const r=n.units.find(a=>a.side===i&&ce(a)&&!a.flags.fought&&hn(n,a)),o=n.units.find(a=>a.side===1-i&&ce(a)&&!a.flags.fought&&hn(n,a));if(!r&&!o)break;r&&yu(n,r),i=1-i}for(const s of n.units)s.flags.fought=!1;n.out&&ot(n,"status",Ni(n))}function VM(n){let t=!1;for(const e of n.units){if(!ce(e)||!e.lost||e.t.models===1)continue;t||ot(n,"tray.open",{title:"Morale"}),t=!0;const i=rd(n,e),s=Ye(n,1),r=s[0]+e.lost,o=s[0]===1?0:Math.max(0,r-i);if(ot(n,"dice",{label:`${e.t.short}: D6 + ${e.lost} lost vs Ld ${i}`,dice:s,need:0,sum:!0,pass:o===0,note:`${r}`}),o){const a=Math.min(o,e.alive),c=e.models.filter(l=>l.alive).slice(-a);for(const l of c)WM(n,e,l);He(n,e.side,`<b>${e.t.short}</b> lose their nerve — <b>${a} flee</b>.`),ce(e)?Jf(n,e):Zf(n,e,null),n.out&&(ot(n,"objectives",{owners:fs(n)}),ot(n,"status",Ni(n))),ot(n,"pause",{s:.5})}else He(n,e.side,`<b>${e.t.short}</b> hold firm (${r} vs Ld ${i}).`)}}function WM(n,t,e){e.alive=!1,e.w=0,t.alive--,ot(n,"unit.flee",{u:t.id,m:t.models.indexOf(e)})}const ld=n=>n.t.pts*n.alive/n.t.models;function Qi(n,t){return n.t.melee?Xo(n.alive*n.t.A,zr(n.t.WS,n.mesmerized?1:0),n.t.melee,t,!1).value:0}function hd(n,t,e,i,s){var l;const r=t.t.ranged;if(!r||Ot(e.pos.x-i.x,e.pos.z-i.z)-t.r-e.r>r.range||hn(n,e)&&!r.spell)return 0;const a=rl(n,t,e,i);if(!a.visible&&!r.indirect&&!r.mesmerize)return 0;if(r.mesmerize)return a.visible?os(r.spell)*(ld(e)*.25+Math.min(2,e.alive)*e.t.pts*.08+((l=e.t.ranged)!=null&&l.blast?8:0)):0;let c=0;if(r.heavy&&s&&c++,r.indirect&&!a.visible&&c++,r.blast){const h=r.spell?os(r.spell):Uo(zr(t.t.BS,c)),u=e.t.big?3:Math.max(1,Math.min(e.alive,Math.round(e.alive*Math.min(1,r.blast*r.blast/(e.r*e.r))*.8)));return Zs(t,r,!1)*h*Xo(u,1,r,e,a.cover).value}return Xo(Zs(t,r,!1),zr(t.t.BS,c),r,e,a.cover).value}function bu(n,t,e,i){const{nav:s}=n,r=Wn(n,t),o=il(n,t),a=n.objectives.map(m=>ha(n,m)),c=t.t.ai,l={enemies:r,friends:o,owners:a,claimed:i,role:c};let h={cell:-1,score:Su(n,t,t.pos.x,t.pos.z,l,!1),dist:0,...l.last};const u=t.t.M>8?3:2,d=e.res;for(let m=0;m<s.nz;m+=u)for(let g=m/u%2?1:0;g<s.nx;g+=u){const _=m*s.nx+g;if(!isFinite(d.dist[_])||!Zr(n,e,_))continue;const p=s.x(_),f=s.z(_),v=Su(n,t,p,f,l,!0)+Pr(n.rng)*.05;v>h.score&&(h={cell:_,score:v,dist:Ot(p-t.pos.x,f-t.pos.z),...l.last})}return h}function Su(n,t,e,i,s,r){const{enemies:o,friends:a,owners:c,claimed:l,role:h}=s,u=t.t,d={x:e,z:i},m=r&&Ot(e-t.pos.x,i-t.pos.z)>.3;let g=0,_=!1,p=-1;if(u.OC>0){const M=h==="line"||h==="shooter"?5:h==="melee"?2:2.5;let R=0;for(const E of n.objectives){const T=Ot(E.x-e,E.z-i),U=c[E.i]===t.side?.45:1,y=l.has(E.i)?.25:1;let S;T<=2.6?S=M*U*y*1.4:S=M*U*y*Math.max(0,1-(T-2.6)/16)*.7,S>R&&(R=S,T<=2.6?(_=!0,p=E.i):_||(p=-1))}g+=R}let f=!1;if(u.ranged&&h!=="melee"){let M=0;for(const E of o){const T=hd(n,t,E,d,m);T>M&&(M=T)}M>0&&(f=!0),g+=M*(h==="artillery"?.25:h==="hero"?.12:.18)*(t.flags.advanced&&!u.ranged.assault?0:1)}if(h==="melee"||h==="line"||h==="raider"||h==="hero"){let M=0;for(const E of o){const T=Ot(E.pos.x-e,E.pos.z-i)-t.r-E.r;if(T>qr)continue;const U=T<=1?1:os(Math.ceil(T)),y=Qi(E,t)*.4,S=U*(Qi(t,E)-y+(E.t.role==="Artillery"?10:0));S>M&&(M=S)}if(g+=M*(h==="melee"?.3:h==="raider"?.18:h==="hero"?.06:.15),M===0&&h!=="hero"){const E=Math.min(...o.map(T=>Ot(T.pos.x-e,T.pos.z-i)));g-=E*(h==="melee"?.12:.05)}}const v=h==="shooter"||h==="artillery"||h==="hero";for(const M of o){const R=Ot(M.pos.x-e,M.pos.z-i)-t.r-M.r;M.t.brawler&&R<M.t.M+7&&(g-=Qi(M,t)*(v?.16:.05)*(1-R/(M.t.M+7)))}const x=n.nav.index(e,i);if(x>=0&&n.nav.cover[x]&&(g+=v?1.5:.5),h==="artillery"&&m&&(g-=2.5),h==="hero"){let M=0;for(const E of a)Ot(E.pos.x-e,E.pos.z-i)<=Yr+E.r&&M++;g+=Math.min(3,M)*.9;const R=Math.min(...o.map(E=>Ot(E.pos.x-e,E.pos.z-i)));R<8&&(g-=(8-R)*.6)}for(const M of a){const R=Ot(M.pos.x-e,M.pos.z-i)-M.r-t.r;R<1.5&&(g-=(1.5-R)*.6)}return s.last={onObjective:_,obj:p,canShoot:f},g}const er=Object.freeze(["melee","raider","line","shooter","hero","artillery"]);function*GM(n,t,e){e==="move"?yield*$M(n,t):e==="shoot"?yield*XM(n,t):e==="charge"&&(yield*jM(n,t))}function*$M(n,t){const e=n.units.filter(s=>s.side===t&&ce(s));e.sort((s,r)=>er.indexOf(s.t.ai)-er.indexOf(r.t.ai));const i=new Set;for(const s of e){if(!ce(s)||s.flags.moved)continue;const r=s.t.ai;if(hn(n,s)){const h=Qr(n,s),u=h.reduce((p,f)=>p+Qi(f,s),0),d=h.reduce((p,f)=>Math.max(p,Qi(s,f)),0);if(r==="melee"||r==="line"||d>=u*.8)continue;const m=$s(n,s);let g=-1,_=-1/0;for(let p=0;p<n.nav.N;p+=2){if(!Zr(n,m,p))continue;const f=n.nav.x(p),v=n.nav.z(p),x=Math.min(...Wn(n,s).map(M=>Ot(M.pos.x-f,M.pos.z-v)-M.r));x>_&&(_=x,g=p)}g>=0&&(ot(n,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"move",u:s.id,c:g});continue}let o=$s(n,s,s.flags.advanced?s.flags.advRoll:0),a=bu(n,s,o,i);const c=Math.min(...Wn(n,s).map(h=>Ri(s,h)));let l=!1;if(r==="melee"||r==="line"||r==="raider"?l=c>s.t.M+8&&!(r==="line"&&a.onObjective)&&!(r==="raider"&&a.canShoot):r==="shooter"&&(l=!a.canShoot&&!a.onObjective&&(s.t.ranged.assault||c>s.t.ranged.range+s.t.M+3)),l&&!s.flags.advanced){ot(n,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"advance",u:s.id},o=$s(n,s,s.flags.advRoll);const h=bu(n,s,o,i);h.cell>=0&&(a=h)}a.obj>=0&&i.add(a.obj),a.cell>=0&&a.dist>.4?(ot(n,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"move",u:s.id,c:a.cell}):s.flags.advanced&&FM(n,s),ot(n,"pause",{s:.05})}}function*XM(n,t){const e=n.units.filter(i=>i.side===t&&Qs(n,i));e.sort((i,s)=>er.indexOf(s.t.ai)-er.indexOf(i.t.ai));for(const i of e){if(!Qs(n,i))continue;const s=el(n,i);let r=null,o=.4;for(const a of s){let c=hd(n,i,a,i.pos,i.flags.moved);const l=i.t.ranged;if(l.blast)for(const h of n.units){if(h.side!==i.side||!ce(h))continue;const u=Ot(h.pos.x-a.pos.x,h.pos.z-a.pos.z)-h.r;u<l.blast+2.5&&(c-=ld(h)*.25*(1-Math.max(0,u)/(l.blast+2.5)))}l.mesmerize&&a.mesmerized&&(c*=.2),c>o&&(o=c,r=a)}r&&(ot(n,"focus",{x:(i.pos.x+r.pos.x)/2,z:(i.pos.z+r.pos.z)/2}),yield{t:"shoot",u:i.id,tg:r.id},ot(n,"pause",{s:.1}))}}function*jM(n,t){const e=n.units.filter(i=>i.side===t&&kr(n,i));e.sort((i,s)=>er.indexOf(i.t.ai)-er.indexOf(s.t.ai));for(const i of e){if(!kr(n,i))continue;const s=i.t.ai;let r=null,o=0;for(const a of ca(n,i)){const c=cr(n,i,a);if(!c)continue;const l=os(c.need),h=Qi(i,a)+(a.t.role==="Artillery"?12:0)+(a.alive<=2?6:0),u=Qi(a,i);if(l<(s==="melee"?.25:s==="line"?.33:s==="raider"?.4:s==="hero"?.5:.6)||(s==="shooter"||s==="hero")&&h<u*1.4)continue;const m=l*(h-u*.4);m>o&&(o=m,r=a)}r&&(ot(n,"focus",{x:(i.pos.x+r.pos.x)/2,z:(i.pos.z+r.pos.z)/2}),yield{t:"charge",u:i.id,tg:r.id},ot(n,"pause",{s:.1}))}}const Pe=(n,t)=>n.units.find(e=>e.id===t),Ec=Object.freeze({place(n,t,{u:e,c:i}){const s=Pe(n,e);ra(s,n.nav.x(i),n.nav.z(i)),ot(n,"unit.place",{u:e,x:s.pos.x,z:s.pos.z})},deployed(n,t){const e=n.pending.seats.filter(i=>i!==t);n.pending=e.length?{...n.pending,seats:e}:null},advance(n,t,{u:e}){OM(n,Pe(n,e))},move(n,t,{u:e,c:i}){zM(n,Pe(n,e),i),Co(n)},shoot(n,t,{u:e,tg:i}){LM(n,Pe(n,e),Pe(n,i)),Co(n)},charge(n,t,{u:e,tg:i},s){const r=BM(n,Pe(n,e),Pe(n,i),s);if(!r)return Co(n);n.pending={k:"chargeEnd",seats:[t],u:e,tg:i,rolled:r.rolled,cell:r.plan.cell}},chargeEnd(n,t,{c:e}){const i=n.pending;nd(n,Pe(n,i.u),Pe(n,i.tg),e===-1?i.cell:e),n.pending={k:"phase",seats:i.seats,phase:tr(n)},Co(n)},end(n){n.pending=null},auto(n,t){md(n,t,n.pending.phase),n.pending=null},concede(n,t){Tc(n,t)}}),Eu=Object.freeze({place:{k:"deploy",fields:["u","c"],ok:(n,t,{u:e,c:i})=>yr(n,t,e)??(wM(n,Pe(n,e),i)?null:`cell ${i} is no free spot in seat ${t}'s zone for unit ${e}`)},deployed:{k:"deploy",fields:[]},advance:{k:"phase",phase:"move",fields:["u"],ok:(n,t,{u:e})=>yr(n,t,e)??KM(n,Pe(n,e))},move:{k:"phase",phase:"move",fields:["u","c"],ok:(n,t,{u:e,c:i})=>yr(n,t,e)??JM(n,Pe(n,e),i)},shoot:{k:"phase",phase:"shoot",fields:["u","tg"],ok:(n,t,{u:e,tg:i})=>yr(n,t,e)??Tu(n,t,i)??ZM(n,Pe(n,e),Pe(n,i))},charge:{k:"phase",phase:"charge",fields:["u","tg"],ok:(n,t,{u:e,tg:i})=>yr(n,t,e)??Tu(n,t,i)??QM(n,Pe(n,e),Pe(n,i))},chargeEnd:{k:"chargeEnd",fields:["c"],ok:(n,t,{c:e},i)=>ty(n,i,e)},end:{k:"phase",fields:[]},auto:{k:"phase",fields:[]},concede:{k:null,fields:[],ok:(n,t)=>YM(n,t)}});function wu(n,t,e){return ud(n,t,e,n.pending)}function ud(n,t,e,i){const s=n.rng.locked;If(n.rng);try{return qM(n,t,e,i)}finally{s||Uf(n.rng)}}function qM(n,t,e,i){var r;if(!e||typeof e!="object"||Array.isArray(e))return"not a command";const s=typeof e.t=="string"&&Object.hasOwn(Eu,e.t)?Eu[e.t]:null;if(!s)return`no command "${e.t}"`;if(!Number.isInteger(t)||t<0||t>=n.seats.length)return`no seat ${t}`;for(const o of Object.keys(e))if(o!=="t"&&!s.fields.includes(o))return`${e.t} takes no field "${o}"`;for(const o of s.fields)if(!Number.isInteger(e[o]))return`${e.t} takes a whole number ${o}`;return n.turn.stage==="over"?"the battle is over":s.k?!i||!i.seats.includes(t)?`seat ${t} has no decision to make now`:i.k!==s.k?`${e.t} doesn't answer the ${i.k} decision`:s.phase&&i.phase!==s.phase?`${e.t} belongs to the ${s.phase} phase, not the ${i.phase}`:((r=s.ok)==null?void 0:r.call(s,n,t,e,i))??null:s.ok(n,t,e)}function yr(n,t,e){const i=Pe(n,e);return i&&ce(i)&&i.side===t?null:`unit ${e} is no standing unit of seat ${t}`}function Tu(n,t,e){const i=Pe(n,e);return i&&ce(i)&&i.side!==t?null:`unit ${e} is no standing enemy of seat ${t}`}const fd=(n,t)=>t>=0&&t<n.nav.N;function YM(n,t){return tl(n,t)!=="human"?`seat ${t} is the AI's: only a human seat concedes`:n.turn.wiped>=0?`the battle is decided: seat ${n.turn.wiped} is wiped out`:null}function KM(n,t){return t.flags.moved?`${t.t.short} has moved`:t.flags.advanced?`${t.t.short} has advanced`:hn(n,t)?`${t.t.short} is in combat`:null}function JM(n,t,e){return t.flags.moved?`${t.t.short} has moved`:!fd(n,e)||!Zr(n,$s(n,t,t.flags.advanced?t.flags.advRoll:0),e)?`${t.t.short} can't end its move on cell ${e}`:null}function ZM(n,t,e){if(!Qs(n,t))return`${t.t.short} can't shoot now`;const i=aa(n,t,e);return i.ok?null:`${t.t.short} can't shoot ${e.t.short}: ${i.why}`}function QM(n,t,e){return ca(n,t).includes(e)?cr(n,t,e)?null:`${t.t.short} has no way to ${e.t.short}`:`${t.t.short} can't charge ${e.t.short}`}function ty(n,t,e){if(e===-1)return null;const i=fd(n,e)&&cr(n,Pe(n,t.u),Pe(n,t.tg));return i&&ed(i,t.rolled)[e]?null:`the charge can't end on cell ${e} (rolled ${t.rolled}")`}const wc=n=>n.seats.filter(t=>t.ctrl==="human").map(t=>t.seat);function dd(n){const t=n.turn;for(;!n.pending&&t.stage!=="over";)switch(t.step){case"rolloff":t.stage="battle",ot(n,"stage",{stage:"battle"}),n.out&&ot(n,"objectives",{owners:fs(n)}),ey(n),t.round=1,t.t=0,t.step="turnStart";break;case"turnStart":t.active=(t.first+t.t)%2,ny(n,t.active),t.ph=0,t.step="phase";break;case"phase":{const e=tr(n);ot(n,"phase.start",{side:t.active,phase:e,round:t.round}),t.step="phaseEnd",e==="fight"?n.units.some(i=>ce(i)&&hn(n,i))&&HM(n,t.active):e==="morale"?VM(n):ad(n,t.active)?tl(n,t.active)==="human"?n.pending={k:"phase",seats:[t.active],phase:e}:md(n,t.active,e):ot(n,"pause",{s:.2});break}case"phaseEnd":if(sa(n,`phase ${t.active}:${tr(n)}`),pd(n),t.wiped>=0){Tc(n);break}t.step=++t.ph<Nr.length?"phase":"turnEnd";break;case"turnEnd":iy(n,t.active),t.step=++t.t<2?"turnStart":"score";break;case"score":sy(n),t.round<n.setup.rounds?(t.round++,t.t=0,t.step="turnStart"):n.setup.overtime==="vote"&&wc(n).length?n.pending={k:"roundLimit",seats:wc(n),votes:{}}:Tc(n);break;default:throw new Error(`the engine has no step "${t.step}"`)}n.pending&&n.out&&ot(n,"pending",{k:n.pending.k,seats:[...n.pending.seats]})}function ey(n){const t=n.turn;ot(n,"tray.open",{title:"Roll-off for the first turn"});let e,i;do e=Ye(n,1),i=Ye(n,1),ot(n,"dice",{label:Ai(n,0).short,dice:e,need:0,sum:!0}),ot(n,"dice",{label:Ai(n,1).short,dice:i,need:0,sum:!0});while(e[0]===i[0]);t.first=e[0]>i[0]?0:1,He(n,t.first,`<b>${Ai(n,t.first).name}</b> win the roll-off and take the first turn.`,"big")}function ny(n,t){for(const e of n.units)e.lost=0,e.side===t&&(e.flags={})}function iy(n,t){for(const e of n.units)e.side===t&&e.mesmerized&&(e.mesmerized=!1);n.out&&ot(n,"status",Ni(n))}function Co(n){sa(n,"act"),n.out&&(ot(n,"objectives",{owners:fs(n)}),ot(n,"status",Ni(n))),ot(n,"act",{tag:"act"}),pd(n)}function pd(n){for(const t of[0,1])n.units.some(e=>e.side===t&&ce(e))||(n.turn.wiped=t)}function sy(n){const t=n.turn,e=fs(n),i=[0,0];for(const o of e)o>=0&&i[o]++;t.vp[0]+=i[0],t.vp[1]+=i[1],sa(n,`round ${t.round}`);const s=Ai(n,0).short,r=Ai(n,1).short;He(n,-1,`End of round ${t.round}: ${s} hold ${i[0]} objective${i[0]===1?"":"s"}, ${r} hold ${i[1]}. Score ${t.vp[0]}–${t.vp[1]}.`,"big"),ot(n,"round.scored",{round:t.round,held:[...i],vp:[...t.vp],owners:e})}function Tc(n,t=-1){const e=n.turn,i=e.stage==="deploy"?0:e.round;Wf(n),sa(n,"over"),e.stage="over",n.pending=null,ot(n,"stage",{stage:"over"});const s=t>=0?1-t:e.wiped>=0?1-e.wiped:e.vp[0]>e.vp[1]?0:e.vp[1]>e.vp[0]?1:-1,r=t>=0?"concede":e.wiped>=0?"wipe":"score";e.result={win:s,why:r},ot(n,"game.over",{win:s,why:r,vp:[...e.vp],rounds:i})}function md(n,t,e){const i=n.pending,s={k:"phase",seats:[t],phase:e};for(const r of GM(n,t,e)){if(n.strict){const o=ud(n,t,r,s);if(o)throw new Error(`the AI (seat ${t}, ${e} phase) asked for ${JSON.stringify(r)}, which is illegal: ${o}`)}if(Ec[r.t](n,t,r,"ai"),n.pending!==i)throw new Error(`the AI's ${JSON.stringify(r)} left a decision open: ${JSON.stringify(n.pending)}`)}}const ry=new Set(["name","short","icon","look","abilities","fx"]),qo=n=>Array.isArray(n)?n.map(qo):n&&typeof n=="object"?Object.fromEntries(Object.entries(n).filter(([t])=>!ry.has(t)).map(([t,e])=>[t,qo(e)])):n,Au=(n,t)=>Object.fromEntries(Object.entries(n).map(([e,i])=>[e,t(i)])),oy=Object.freeze({BOARD:Ui,ENGAGE:Ti,CHARGE_RANGE:qr,OBJECTIVE_RANGE:Ur,ROUNDS:Nf,AURA:Yr});function ay({races:n=Li,constants:t=oy,phases:e=Nr.map(r=>r.key),sets:i=Gs,missions:s=ar}={}){return{races:Au(n,({units:r,...o})=>({...qo(o),units:Au(r,qo)})),constants:t,phases:e,sets:i,missions:s}}const cy=n=>Ux(yc(ay(n))).toString(36);cy();const Ru=n=>{var t;return[...((t=n.pending)==null?void 0:t.seats)??[]]},Cu=99;function gd(n){const t={};for(const[s,r]of Object.entries(n??{}))r!=null&&(t[s]=r);const e={terrain:"classic",rounds:Fr().rounds,overtime:"never",diceMode:"shared"};for(const[s,r]of Object.entries(e))t[s]??(t[s]=r);const i=s=>Number.isInteger(s)&&s>=0&&s<=4294967295;if(!i(t.board)||!i(t.dice))throw new Error(`a setup's board and dice are whole numbers from 0 to 2^32 - 1, not ${t.board} and ${t.dice}`);if(!Number.isInteger(t.rounds)||t.rounds<1||t.rounds>Cu)throw new Error(`a battle lasts a whole number of rounds, from 1 to ${Cu}, not ${t.rounds}`);if(t.overtime!=="never")throw new Error(`overtime "${t.overtime}": a battle ends after its rounds ('never') until F4's vote`);if(t.diceMode!=="shared")throw new Error(`dice mode "${t.diceMode}": only 'shared' dice so far`);if(!Array.isArray(t.seats))throw new Error("a setup names its seats");return t}function _d(n,{out:t=null,onTrace:e=null,strict:i=!1}={}){const s=CM(gd(n),{out:t,onTrace:e});s.strict=i;const r=wc(s);if(r.length){ot(s,"stage",{stage:"deploy"});for(const o of r)He(s,o,`<b>${Ai(s,o).name}</b>: deploy your army.`);s.pending={k:"deploy",seats:r}}return dd(s),s}function vd(n,t){const e=n.rng.locked;If(n.rng);try{return t(n,cd)}finally{e||Uf(n.rng)}}function ly(n,t,e){if(!Object.hasOwn(Ec,e.t))throw new Error(`no command "${e.t}"`);Ec[e.t](n,t,e,"seat"),dd(n)}class hy{constructor({store:t,localSeats:e=[],sink:i=null,onTrace:s=null}){this.store=t,this.localSeats=Object.freeze([...e]),this.sink=i,this.onTrace=s,this.G=null,this.status="lobby",this.error=null,this.rejected=[],this.folded=0,this.off=t.subscribe(()=>this.onChange()),this.onChange()}decisionFor(){var e;const t=(e=this.G)==null?void 0:e.pending;return(t==null?void 0:t.seats.find(i=>this.localSeats.includes(i)))??-1}preview(t){if(!this.G)throw new Error("no match to preview: the store has no start yet");return vd(this.G,t)}legal(t,e){return this.status!=="live"?`the match is ${this.status}`:this.localSeats.includes(t)?(e==null?void 0:e.t)!=="concede"&&!Ru(this.G).includes(t)?`seat ${t} has no decision to make now`:wu(this.G,t,e):`seat ${t} is not played on this device`}submit(t,e){const i=this.legal(t,e);if(i)throw new Error(`seat ${t} can't send ${JSON.stringify(e)}: ${i}`);this.store.append({s:t,...e})}onChange(){const t=this.store.entries();for(;this.folded<t.length;){const e=this.folded++;this.fold(t[e],e)}}fold(t,e){var i,s;if(this.status==="lobby"){if((t==null?void 0:t.t)!=="start")return this.reject(e,"the log has no start yet");try{this.G=_d(t.setup,{out:[],onTrace:this.onTrace})}catch(r){return this.status="refused",this.error=r.message,this.reject(e,r.message)}}else{if(this.status!=="live")return this.reject(e,`the match is ${this.status}`);{const{s:r,...o}=t;if(o.t==="start")return this.reject(e,"the match has started already");if(o.t!=="concede"&&!Ru(this.G).includes(r))return this.reject(e,`seat ${r} has no decision to make`);const a=wu(this.G,r,o);if(a)return this.reject(e,a);ly(this.G,r,o)}}this.status=this.G.turn.stage==="over"?"over":"live",(s=(i=this.sink)==null?void 0:i.events)==null||s.call(i,this.G.out.splice(0),this)}reject(t,e){this.rejected.push({at:t,why:e})}close(){this.off()}}class uy{constructor(t=[]){this.kind="local",this.list=t.map(e=>({...e})),this.subs=new Set}entries(){return this.list}append(t){this.list.push({...t});for(const e of[...this.subs])e()}subscribe(t){return this.subs.add(t),()=>this.subs.delete(t)}export(){return JSON.stringify(this.list)}}const fy=n=>n.objectives.map(t=>n.turn.stage==="battle"||n.turn.stage==="over"?ha(n,t):-1);function Ac(n){const t=n.turn,e={};for(const s of n.units)e[s.id]={pos:{x:s.pos.x,z:s.pos.z},r:s.r,models:s.models.map(r=>({w:r.w,alive:r.alive,ox:r.ox,oz:r.oz})),alive:s.alive,mesmerized:s.mesmerized,engaged:ce(s)&&hn(n,s)};const i={};for(const s of n.terrain.chunks)i[s.id]={alive:s.alive,y:s.shape.y};return{units:e,chunks:i,owners:fy(n),vp:[...t.vp],round:t.round,active:t.active,phase:tr(n),stage:t.stage}}function xd(n,t){const e=t.u===void 0?null:n.units[t.u];switch(t.t){case"unit.place":e.pos={x:t.x,z:t.z};break;case"unit.move":e.pos={x:t.to.x,z:t.to.z};for(const{ev:i}of t.smashes)for(const s of i)xd(n,s);break;case"unit.formation":e.pos={x:t.pos.x,z:t.pos.z},e.r=t.r,t.offs.forEach(([i,s],r)=>{e.models[r].ox=i,e.models[r].oz=s});break;case"unit.wound":e.models[t.m].w-=t.dmg;break;case"unit.slain":case"unit.flee":e.models[t.m].w=0,e.models[t.m].alive=!1,e.alive--;break;case"status":{const i=new Set(t.engaged),s=new Set(t.mesmerized);for(const[r,o]of Object.entries(n.units))o.engaged=i.has(Number(r)),o.mesmerized=s.has(Number(r));break}case"objectives":n.owners=[...t.owners];break;case"round.scored":n.vp=[...t.vp],n.owners=[...t.owners];break;case"phase.start":n.round=t.round,n.active=t.side,n.phase=t.phase;break;case"stage":n.stage=t.stage;break;case"terrain.clear":n.chunks={};break;case"terrain.add":n.chunks[t.def.id]={alive:!0,y:t.def.shape.y};break;case"terrain.destroy":n.chunks[t.id].alive=!1;break;case"terrain.collapse":for(const{id:i,dy:s}of t.drops)n.chunks[i].y-=s;break}return n}const Br=Object.freeze({phaseStart:(n,t)=>n||t!=="battle"?.9:.6,dice:n=>.38+Math.min(n,14)*.035,pause:n=>n,beat:.3}),dy=(n,t=Math.random)=>nn(n,t),nr=n=>1-Math.pow(1-n,3),py=n=>n*n*n,ol=n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2,my=n=>Math.atan2(Math.sin(n),Math.cos(n));function gy(n){return n<1/2.75?7.5625*n*n:n<2/2.75?7.5625*(n-=1.5/2.75)*n+.75:n<2.5/2.75?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}const gn={speed:1,time:0},Rc=new Set;function De(n,t,e=i=>i){return new Promise(i=>{Rc.add({t:0,duration:Math.max(1e-4,n),fn:t,ease:e,resolve:i})})}const Gn=n=>De(n,()=>{});function _y(n){for(const t of[...Rc]){t.t+=n;const e=Math.min(1,t.t/t.duration);t.fn(t.ease(e),e),e>=1&&(Rc.delete(t),t.resolve())}}const zs=new Bn(1,1,1),vy=new ln(.5,.5,1,8).rotateZ(Math.PI/2),nc=new Map;function xe(n,t={}){const e=n+JSON.stringify(t);return nc.has(e)||nc.set(e,new Dn({color:n,roughness:.9,flatShading:!0,...t})),nc.get(e)}function Me(n,t,{shadow:e=!0}={}){const i=new Ht(n,t);return i.castShadow=e,i.receiveShadow=!0,i}const xy={box:n=>Pu(n,zs),log:n=>Pu(n,vy),cap(n){const{look:t,shape:e}=n,i=Me(new Hn(t.r,t.h,4).rotateY(Math.PI/4),xe(t.color));return i.position.set(e.x,e.y,e.z),i.rotation.y=t.yaw,{obj:i}},tree(n){const{look:t,shape:e}=n,{h:i,r:s}=t.trunk,r=new Ft;r.position.set(e.x,0,e.z);const o=Me(new ln(s*.75,s,i,7).translate(0,i/2,0),xe(t.bark));r.add(o);const a=new Ft;r.add(a);for(const c of t.canopy)if(c.cone){const l=Me(new Hn(c.r,c.h,8),xe(c.color));l.position.y=c.y,l.rotation.y=c.yaw,a.add(l)}else{const l=Me(new Vn(c.r,1),xe(c.color));l.position.set(...c.pos),l.scale.y=.8,a.add(l)}return r.rotation.y=t.yaw,{obj:r,canopy:a}},hedge(n){const{look:t,shape:e}=n,i=new Ft;i.position.set(e.x,0,e.z),i.rotation.y=t.yaw;const s=Me(zs,xe(t.color));s.scale.set(1.15,.62,.55),s.position.y=.31,i.add(s);for(const r of t.tufts){const o=Me(new Vn(.3,0),xe(r.color));o.position.set(...r.pos),i.add(o)}for(const r of t.berries){const o=Me(new vn(.05,5,4),xe("#c0302a"),{shadow:!1});o.position.set(...r),i.add(o)}return{obj:i}},boulder(n){const{look:t,shape:e}=n,i=Me(new $o(t.size,0),xe(t.color));if(i.scale.set(...t.scale),i.rotation.set(...t.rot),i.position.set(e.x,t.y,e.z),t.moss){const s=Me(new $o(t.size*.55,0),xe("#5d7a3a"),{shadow:!1});s.position.set(0,t.size*.55,0),s.scale.set(1.1,.4,1.1),i.add(s)}return{obj:i}},crate(n){const{look:t}=n,e=new Ft,i=t.s,s=Me(zs,xe(t.color));s.scale.setScalar(i),s.position.y=i/2;const r=Me(zs,xe("#5f3e24"));if(r.scale.set(i*1.02,i*.14,i*1.02),r.position.y=i/2,e.add(s,r),t.stacked){const o=Me(zs,xe("#9a7048"));o.scale.setScalar(i*.7),o.position.set(0,i+i*.35,0),o.rotation.y=.5,e.add(o)}return ic(n,e)},barrel(n){const t=new Ft,e=Me(new ln(.28,.24,.75,10),xe(n.look.color));e.position.y=.375;const i=Me(new Rn(.29,.025,4,14).rotateX(Math.PI/2),xe("#3a3a3a",{metalness:.4}));return i.position.y=.55,t.add(e,i),ic(n,t)},sack(n){const t=new Ft,e=Me(new vn(.34,9,7),xe("#c2a77a"));e.scale.set(1,1.15,.9),e.position.y=.36,t.add(e);for(const[i,s]of n.look.acorns){const r=Me(new vn(.08,6,5),xe("#8a5a2a"));r.position.set(i,.72,s),t.add(r)}return ic(n,t)},mushroom(n){const{look:t,shape:e}=n,{h:i,r:s,sr:r}=t,o=new Ft;o.position.set(e.x,0,e.z);const a=Me(new ln(r*.8,r*1.2,i,8).translate(0,i/2,0),xe("#efe6d0")),c=Me(new vn(s,14,8,0,Math.PI*2,0,Math.PI/2),xe(t.cap));c.position.y=i-.05,c.scale.y=.7;const l=Me(new rs(s,14).rotateX(Math.PI/2),xe("#e9dcc0"));l.position.y=i-.05,o.add(a,c,l);for(const[h,u]of t.dots){const d=Me(new vn(s*.12,5,4),xe("#fff6e0"),{shadow:!1});d.position.set(Math.cos(h)*Math.sin(u)*s,i-.05+Math.cos(u)*s*.7,Math.sin(h)*Math.sin(u)*s),o.add(d)}return o.rotation.z=t.tilt,{obj:o}},floor(n){const{look:t,shape:e}=n,i=new rs(t.r,t.segments),s=i.attributes.position;if(t.rim.length!==s.count-1)throw new Error(`a forest floor of ${s.count} vertices with ${t.rim.length} rim draws`);for(let o=1;o<s.count;o++){const a=t.rim[o-1];s.setXY(o,s.getX(o)*a,s.getY(o)*a)}i.rotateX(-Math.PI/2);const r=Me(i,xe(t.color,{flatShading:!1}),{shadow:!1});return r.position.set(e.x,.012,e.z),{obj:r}},rubble(n){const t=new Ft;return t.position.set(n.shape.x,0,n.shape.z),{obj:t,pieces:0}}};function Pu(n,t){const{look:e,shape:i}=n,s=Me(t,xe(e.color));return s.scale.set(...e.scale),s.position.set(i.x,i.y,i.z),s.rotation.y=e.yaw,{obj:s}}function ic(n,t){return t.position.set(n.shape.x,0,n.shape.z),t.rotation.y=n.look.yaw,{obj:t}}class My{constructor(t,e){this.scene=t,this.fx=e,this.group=new Ft,t.add(this.group),this.items=new Map,this.onBreak=null}object(t){var e;return(e=this.items.get(t))==null?void 0:e.obj}apply(t,e){switch(t.t){case"terrain.clear":return this.clear();case"terrain.add":return this.add(t.def);case"terrain.hurt":return this.hurt(this.items.get(t.id).c,t.from,t.at);case"terrain.destroy":return this.destroy(this.items.get(t.id).c,t.from,t.at);case"terrain.collapse":return this.collapse(t.drops,t.by,e);case"terrain.rubble":return this.rubble(this.items.get(t.id).c,t.from)}throw new Error(`TerrainView: no handler for ${t.t}`)}clear(){this.scene.remove(this.group),this.group=new Ft,this.scene.add(this.group),this.items.clear()}add(t){if(t.look.piece==="fallen")return this.fell(t);const e={c:t,...xy[t.look.piece](t)};this.items.set(t.id,e),this.group.add(e.obj)}hurt(t,e,i){const s=this.items.get(t.id),r=s.obj;r.isMesh&&(s.ownMat||(r.material=r.material.clone(),s.ownMat=!0),r.material.color.multiplyScalar(.8));const o=r.position.clone();De(.25,a=>{const c=(1-a)*.06;r.position.set(o.x+(Math.random()-.5)*c,o.y,o.z+(Math.random()-.5)*c)}).then(()=>r.position.copy(o)),this.fx.debris(i.x,i.y,i.z,[t.look.chip||"#888","#666"],3,{from:e,power:3,size:.08})}destroy(t,e,i){var a;const s=this.items.get(t.id),r=i,o=this.fx;switch(t.kind){case"block":{this.group.remove(s.obj),o.debris(r.x,r.y,r.z,[t.look.chip,t.look.chip,"#5a5650"],12,{from:e,power:6}),o.smoke({x:r.x,y:r.y,z:r.z,size:.4,color:"#a09a8a",life:1.5});break}case"tree":{for(const c of s.canopy.children){const l=new C;c.getWorldPosition(l),o.leaves(l.x,l.y,l.z,t.look.leaves,14,1)}s.obj.remove(s.canopy);break}case"hedge":case"mushroom":if(this.group.remove(s.obj),o.leaves(r.x,r.y,r.z,t.look.leaves,t.kind==="hedge"?22:28,t.kind==="hedge"?.8:1.4),t.kind==="mushroom")for(let c=0;c<16;c++)o.mote({x:r.x,y:r.y*1.5,z:r.z,vx:(Math.random()-.5)*3,vy:Math.random()*2,vz:(Math.random()-.5)*3,size:.05,color:"#f0e0ff",life:2.5,drag:1});break;case"crate":case"log":this.group.remove(s.obj),o.debris(r.x,r.y,r.z,Yx,14,{from:e,power:6,size:.12});break}(a=this.onBreak)==null||a.call(this,t)}collapse(t,e,i){for(const{id:s,dy:r}of t){const{c:o,obj:a}=this.items.get(s),c=i.chunks[s].y,l=a.position.y,h=l-r;De(.18+r*.15,u=>a.position.y=l+(h-l)*u,gy).then(()=>{this.fx.debris(o.shape.x,c-e/2,o.shape.z,["#8a8478"],3,{power:2,size:.07})})}}rubble(t,e){const i=this.items.get(t.id),s=i.obj,r=Gf[t.look.style],o=4+Math.floor(Math.random()*3);for(let a=0;a<o;a++){const c=Me(zs,xe(dy(r.colors))),l=.18+Math.random()*.22;c.scale.set(l*(r.look==="log"?2.4:1.2),l*.7,l);const h=Math.random()*6,u=Math.random()*.6,d=e?t.shape.x-e.x:0,m=e?t.shape.z-e.z:0,g=Math.hypot(d,m)||1;c.position.set(Math.cos(h)*u+d/g*.25,l*.3+Math.min(.2,i.pieces*.012),Math.sin(h)*u+m/g*.25),c.rotation.set(Math.random(),Math.random()*6,Math.random()),s.add(c)}i.pieces+=o}fell(t){const e=this.items.get(t.look.tree),i=e.c,s=i.shape,r=i.look.trunk,{dx:o,dz:a}=t.look,c=e.obj,l=new C(a,0,-o).normalize(),h=c.quaternion.clone(),u=new kn;De(.9,d=>{u.setFromAxisAngle(l,(Math.PI/2-.12)*d),c.quaternion.copy(h).premultiply(u),c.position.y=Math.sin(d*Math.PI)*.05+r.r*d},py).then(()=>{this.fx.debris(s.x+o*r.h,.2,s.z+a*r.h,["#6b4a2e","#4f8a34"],8,{power:3,size:.1}),this.fx.shake=Math.max(this.fx.shake,.05)}),this.items.set(t.id,{c:t,obj:c}),this.group.add(c)}}class yy{constructor({handlers:t,mirror:e=null,onIdle:i=null}){this.handlers=t,this.mirror=e,this.onIdle=i,this.observer=null,this.q=[],this.running=!1,this.table=0}get idle(){return!this.running&&!this.q.length}push(t){for(const e of t)this.q.push(e);this.running||this.run()}reset(t){var e,i;this.table++,this.q.length=0,this.running=!1,this.mirror=t,(i=(e=this.observer)==null?void 0:e.reset)==null||i.call(e,t)}run(){var e,i,s;const t=this.table;this.running=!0;try{for(;this.q.length;){const r=this.q.shift();this.mirror=xd(this.mirror,r),(i=(e=this.observer)==null?void 0:e.event)==null||i.call(e,r,this.mirror);const o=(this.handlers[r.t]??this.handlers.fallback)(r,this.mirror);if(o&&typeof o.then=="function"){o.then(()=>t===this.table&&this.run(),a=>t===this.table&&this.fail(a));return}}}catch(r){return this.fail(r)}this.running=!1,(s=this.onIdle)==null||s.call(this)}fail(t){throw this.running=!1,this.q.length=0,t}}const Lu=new WeakMap;function by(n){var i;const t=(i=n.G)==null?void 0:i.pending;if((t==null?void 0:t.k)!=="chargeEnd")return null;let e=Lu.get(t);return e||(e=n.preview((s,r)=>{const o=s.units.find(l=>l.id===t.u),a=s.units.find(l=>l.id===t.tg),c=r.chargePlan(s,o,a);return{seat:t.seats[0],u:o,tg:a,rolled:t.rolled,cell:t.cell,plan:c,ok:r.chargeSpots(c,t.rolled)}}),Lu.set(t,e)),e}function Md(n,t,e,i,s=2.4){let r=-1,o=s;for(let a=0;a<n.N;a++){if(!t[a])continue;const c=Ot(n.x(a)-e,n.z(a)-i);c<o&&(o=c,r=a)}return r}const Sy=-1,Ey=n=>({t:"chargeEnd",c:n}),yd=n=>n.length===2&&n[0].race===n[1].race;function bd(n){const t=yd(n);return Object.freeze(n.map(({seat:e,race:i})=>{const s=Li[i];return Object.freeze({name:s.name,short:s.short,icon:s.icon,color:t&&e===1?s.look.alt:s.look.team,dark:s.look.dark})}))}const Du=900,Iu=700,Uu=260,Ds=new ae,Nu=new kn,wy=new rr,zo=new C,Ty=new C,zu=new jt;class sc{constructor(t,e){this.mesh=t,this.max=e,this.items=[],this.free=[];for(let i=e-1;i>=0;i--)this.free.push(i);t.instanceMatrix.setUsage(Jp),t.frustumCulled=!1,Ds.makeScale(0,0,0);for(let i=0;i<e;i++)t.setMatrixAt(i,Ds),t.setColorAt(i,zu.set(16777215))}spawn(t){if(!this.free.length){const e=this.items.shift();this.free.push(e.i)}t.i=this.free.pop(),this.mesh.setColorAt(t.i,zu.set(t.color)),this.mesh.instanceColor.needsUpdate=!0,this.items.push(t)}update(t){const e=[];for(const i of this.items){if(i.age+=t,i.age>=i.life){Ds.makeScale(0,0,0),this.mesh.setMatrixAt(i.i,Ds),this.free.push(i.i);continue}i.vy-=i.g*t;const s=Math.exp(-i.drag*t);i.vx*=s,i.vz*=s,i.g<0&&(i.vy*=s),i.x+=i.vx*t,i.y+=i.vy*t,i.z+=i.vz*t,i.y<i.floor&&(i.y=i.floor,i.vy=-i.vy*i.bounce,i.vx*=.55,i.vz*=.55,i.spin*=.5),i.rx+=i.spin*t,i.ry+=i.spin*.7*t;const r=i.age/i.life,o=i.size*(i.grow?.4+r*i.grow:1)*(r>i.fadeAt?1-(r-i.fadeAt)/(1-i.fadeAt):1);Nu.setFromEuler(wy.set(i.rx,i.ry,0)),Ds.compose(zo.set(i.x,i.y,i.z),Nu,Ty.set(o*i.sx,o*i.sy,o*i.sz)),this.mesh.setMatrixAt(i.i,Ds),e.push(i)}this.items=e,this.mesh.instanceMatrix.needsUpdate=!0}}function rc(n){return{x:n.x,y:n.y,z:n.z,vx:n.vx||0,vy:n.vy||0,vz:n.vz||0,g:n.g??22,drag:n.drag??.6,bounce:n.bounce??.3,floor:n.floor??.04,size:n.size??.15,sx:n.sx??1,sy:n.sy??1,sz:n.sz??1,rx:Math.random()*6,ry:Math.random()*6,spin:n.spin??(Math.random()-.5)*18,age:0,life:n.life??1.5,fadeAt:n.fadeAt??.7,grow:n.grow||0,color:n.color}}function Ou(n,t){const e=document.createElement("canvas");e.width=e.height=128;const i=e.getContext("2d"),s=i.createRadialGradient(64,64,4,64,64,62);s.addColorStop(0,n),s.addColorStop(.55,n),s.addColorStop(1,t),i.fillStyle=s,i.fillRect(0,0,128,128);for(let o=0;o<90;o++){const a=Math.random()*Math.PI*2,c=30+Math.random()*30;i.fillStyle=n,i.globalAlpha=Math.random()*.5,i.beginPath(),i.arc(64+Math.cos(a)*c,64+Math.sin(a)*c,2+Math.random()*6,0,Math.PI*2),i.fill()}const r=new Wc(e);return r.colorSpace=Le,r}class Ay{constructor(t,e,i){this.scene=t,this.camera=e,this.overlay=i,this.shake=0;const s=new Ar(new Bn(1,1,1),new Dn({roughness:.85}),Du);s.castShadow=!0;const r=new Ar(new Vn(1,0),new Ze({toneMapped:!1}),Iu),o=new Ar(new Vn(1,1),new Sx({transparent:!0,opacity:.55,depthWrite:!1}),Uu);t.add(s,r,o),this.cubes=new sc(s,Du),this.glow=new sc(r,Iu),this.puff=new sc(o,Uu),this.lights=[];for(let a=0;a<3;a++){const c=new Tx(16755285,0,14,1.6);c.position.set(0,-50,0),t.add(c),this.lights.push({l:c,until:0})}this.scorchTex=Ou("rgba(20,14,8,0.85)","rgba(20,14,8,0)"),this.acidTex=Ou("rgba(90,220,60,0.75)","rgba(40,120,20,0)"),this.decals=[],this.decalGeo=new rs(1,28),this.decalGeo.rotateX(-Math.PI/2),this.texts=[],this.flashGeo=new vn(1,20,12),this.ringGeo=new hs(.93,1,64),this.ringGeo.rotateX(-Math.PI/2),this.discGeo=new rs(1,48),this.discGeo.rotateX(-Math.PI/2)}cube(t){this.cubes.spawn(rc(t))}mote(t){this.glow.spawn(rc({g:-1,drag:2.5,bounce:0,floor:-99,spin:0,...t}))}smoke(t){this.puff.spawn(rc({g:-2.2,drag:1.8,bounce:0,floor:.1,spin:0,grow:2.2,fadeAt:.4,...t}))}debris(t,e,i,s,r,{from:o,power:a=7,size:c=.16}={}){for(let l=0;l<r;l++){let h=Math.random()-.5,u=Math.random()-.5;o&&(h+=(t-o.x)*.35,u+=(i-o.z)*.35);const d=Math.hypot(h,u)||1,m=a*(.4+Math.random()*.8);this.cube({x:t+(Math.random()-.5)*.4,y:e+Math.random()*.3,z:i+(Math.random()-.5)*.4,vx:h/d*m,vy:3+Math.random()*a,vz:u/d*m,size:c*(.5+Math.random()),sy:.6+Math.random()*.8,color:s[Math.random()*s.length|0],life:2.4+Math.random()*1.5,fadeAt:.75})}}leaves(t,e,i,s,r,o=1){for(let a=0;a<r;a++){const c=Math.random()*Math.PI*2,l=1+Math.random()*4*o;this.cube({x:t+Math.cos(c)*.5*o,y:e+Math.random()*o,z:i+Math.sin(c)*.5*o,vx:Math.cos(c)*l,vy:2+Math.random()*4,vz:Math.sin(c)*l,g:5,drag:2.4,size:.1+Math.random()*.08,sy:.25,spin:(Math.random()-.5)*10,color:s[Math.random()*s.length|0],life:1.6+Math.random()*1.6})}}flashLight(t,e,i,s,r,o){const a=this.lights.reduce((c,l)=>c.until<l.until?c:l);a.until=gn.time+o,a.l.color.set(s),a.l.position.set(t,e,i),De(o,c=>a.l.intensity=r*(1-c)*(1-c))}decal(t,e,i,s,r=.8){const o=new Ht(this.decalGeo,new Ze({map:s,transparent:!0,depthWrite:!1,opacity:r,polygonOffset:!0,polygonOffsetFactor:-2}));if(o.position.set(t,.015+this.decals.length*4e-4,e),o.rotation.y=Math.random()*6,o.scale.setScalar(i),o.renderOrder=1,this.scene.add(o),this.decals.push(o),this.decals.length>40){const a=this.decals.shift();this.scene.remove(a),a.material.dispose()}return o}clearDecals(){for(const t of this.decals)this.scene.remove(t),t.material.dispose();this.decals=[]}ring(t,e,i,s,{life:r=1.2,fill:o=.18,hold:a=!1}={}){const c=new Ft,l=new Ht(this.ringGeo,new Ze({color:s,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1})),h=new Ht(this.discGeo,new Ze({color:s,transparent:!0,opacity:o,depthWrite:!1,toneMapped:!1}));c.add(l,h),c.position.set(t,.05,e),c.scale.setScalar(i),c.renderOrder=3,this.scene.add(c);const u=()=>{this.scene.remove(c),l.material.dispose(),h.material.dispose()};return a||De(r,d=>{l.material.opacity=.95*(1-d),h.material.opacity=o*(1-d)}).then(u),c.userData.remove=u,c}explode(t,e,i,s="fire"){const r={fire:{flash:16761963,glow:["#ffd36e","#ff8a2a","#ff5a1f","#fff2b0"],light:16751178,smoke:"#4a4038"},acid:{flash:10354538,glow:["#b8ff6a","#5be04a","#d8ff9a","#2fbf4a"],light:9109338,smoke:"#3f5a2a"},thorns:{flash:13172634,glow:["#9be36a","#e4ffb0","#5ab04a"],light:12255114,smoke:"#3a4a2a"},dust:{flash:16773328,glow:["#ffe9b0","#ffd080"],light:16769184,smoke:"#8a7a64"}}[s],o=new Ht(this.flashGeo,new Ze({color:r.flash,transparent:!0,opacity:.9,toneMapped:!1,depthWrite:!1}));o.position.set(t,.3,e),this.scene.add(o),De(.45,c=>{o.scale.setScalar(.2+i*.85*nr(c)),o.material.opacity=.9*(1-c)}).then(()=>{this.scene.remove(o),o.material.dispose()}),this.flashLight(t,1.5,e,r.light,9+i*6,.7);const a=Math.round(18+i*14);for(let c=0;c<a;c++){const l=Math.random()*Math.PI*2,h=(2+Math.random()*6)*(.6+i*.25);this.mote({x:t,y:.3,z:e,vx:Math.cos(l)*h,vy:2+Math.random()*6,vz:Math.sin(l)*h,g:9,drag:2.2,size:.07+Math.random()*.12,color:r.glow[c%r.glow.length],life:.5+Math.random()*.7})}for(let c=0;c<6+i*3;c++){const l=Math.random()*Math.PI*2,h=Math.random()*i*.6;this.smoke({x:t+Math.cos(l)*h,y:.3+Math.random()*.4,z:e+Math.sin(l)*h,vx:Math.cos(l)*1.2,vy:1+Math.random()*1.5,vz:Math.sin(l)*1.2,size:.25+Math.random()*.25*i,color:r.smoke,life:1.6+Math.random()*1.4})}this.debris(t,.1,e,["#5b4630","#6f8a3a","#4a3a28"],Math.round(6+i*4),{power:5+i,size:.1}),this.decal(t,e,i*.7,s==="acid"?this.acidTex:this.scorchTex,s==="acid"?.6:.45),this.shake=Math.max(this.shake,.05+i*.06)}async projectile(t,e,{mesh:i,arc:s=.25,speed:r=22,trail:o=null,spin:a=10}={}){const c=Math.hypot(e.x-t.x,e.z-t.z),l=c*s;this.scene.add(i);let h=0;await De(Math.max(.12,c/r),u=>{i.position.set(t.x+(e.x-t.x)*u,t.y+(e.y-t.y)*u+4*l*u*(1-u),t.z+(e.z-t.z)*u),i.rotation.x+=a*.016,i.rotation.z+=a*.011,o&&u-h>.03&&(h=u,o(i.position))}),this.scene.remove(i)}text(t,e,i="#ffffff",{size:s=18,life:r=1.3,rise:o=1.4}={}){const a=document.createElement("div");a.className="float-text",a.textContent=e,a.style.color=i,a.style.fontSize=s+"px",this.overlay.appendChild(a),this.texts.push({el:a,x:t.x,y:t.y,z:t.z,age:0,life:r,rise:o})}update(t){this.cubes.update(t),this.glow.update(t),this.puff.update(t),this.shake*=Math.exp(-t*6);const e=innerWidth,i=innerHeight;this.texts=this.texts.filter(s=>{if(s.age+=t,s.age>s.life)return s.el.remove(),!1;const r=s.age/s.life;return zo.set(s.x,s.y+s.rise*nr(r),s.z).project(this.camera),s.el.style.transform=`translate(${(zo.x*.5+.5)*e}px, ${(-zo.y*.5+.5)*i}px) translate(-50%, -50%) scale(${1+.3*(1-Math.min(1,r*5))})`,s.el.style.opacity=r>.6?1-(r-.6)/.4:1,!0})}}function Ry(n,t=!1){const e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,c=new Ae;let l=0;for(let h=0;h<n.length;++h){const u=n[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in u.attributes){if(!i.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(u.attributes[m]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in u.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[m]===void 0&&(o[m]=[]),o[m].push(u.morphAttributes[m])}if(t){let m;if(e)m=u.index.count;else if(u.attributes.position!==void 0)m=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,m,h),l+=m}}if(e){let h=0;const u=[];for(let d=0;d<n.length;++d){const m=n[d].index;for(let g=0;g<m.count;++g)u.push(m.getX(g)+h);h+=n[d].attributes.position.count}c.setIndex(u)}for(const h in r){const u=Fu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const m=[];for(let _=0;_<o[h].length;++_)m.push(o[h][_][d]);const g=Fu(m);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function Fu(n){let t,e,i,s=-1,r=0;for(let l=0;l<n.length;++l){const h=n[l];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.array.length}const o=new t(r);let a=0;for(let l=0;l<n.length;++l)o.set(n[l].array,a),a+=n[l].array.length;const c=new xn(o,e,i);return s!==void 0&&(c.gpuType=s),c}const oc=new Map;function dt(n,t={}){const e=n+JSON.stringify(t);return oc.has(e)||oc.set(e,new Dn({color:n,roughness:.72,flatShading:!0,...t})),oc.get(e)}const Wi=n=>dt(n,{emissive:n,emissiveIntensity:1.6,roughness:.3}),qe=n=>dt(n,{metalness:.65,roughness:.35}),at={ico:new Vn(1,1),ico0:new Vn(1,0),sph:new vn(1,10,8),box:new Bn(1,1,1),cyl:new ln(1,1,1,10),cone:new Hn(1,1,8),cap:new vn(1,12,6,0,Math.PI*2,0,Math.PI/2),brim:new rs(1,12).rotateX(Math.PI/2),oct:new ia(1,0)};function tt(n,t,e=0,i=0,s=0,r=1,o=r,a=r){const c=new Ht(n,t);return c.position.set(e,i,s),c.scale.set(r,o,a),c.castShadow=!0,c}function Gi(n,t,e,i){const s=new C(...n),r=new C(...t),o=tt(at.cyl,i);return o.position.copy(s).add(r).multiplyScalar(.5),o.scale.set(e,s.distanceTo(r),e),o.quaternion.setFromUnitVectors(new C(0,1,0),r.clone().sub(s).normalize()),o}function Cy(n,t){const e=new Ft,i=tt(new ln(n,n*1.05,.09,28),dt("#262422"),0,.045,0);i.receiveShadow=!0;const s=tt(new ln(n*.96,n*.96,.012,28),dt("#4c5e2c",{flatShading:!1}),0,.094,0);s.receiveShadow=!0;const r=tt(new Rn(n*1.02,.028,4,32).rotateX(Math.PI/2),dt(t,{emissive:t,emissiveIntensity:.35}),0,.07,0);e.add(i,s,r);for(let o=0;o<Math.round(n*9);o++){const a=Math.random()*6,c=Math.sqrt(Math.random())*n*.85;e.add(tt(at.cone,dt("#6a8a3a"),Math.cos(a)*c,.13,Math.sin(a)*c,.035,.08,.035))}return e}function Py(n,t,e,i,s=8,r=40){const o=new Xc(n.map(f=>new C(...f))),a=o.computeFrenetFrames(r,!1),c=[],l=[];for(let f=0;f<=r;f++){const v=f/r,x=o.getPointAt(v),M=t+(e-t)*Math.pow(v,.6),R=a.normals[f],E=a.binormals[f];for(let T=0;T<=s;T++){const U=T/s*Math.PI*2,y=Math.cos(U),S=Math.sin(U);c.push(x.x+M*(y*R.x+S*E.x),x.y+M*(y*R.y+S*E.y),x.z+M*(y*R.z+S*E.z))}}for(let f=0;f<r;f++)for(let v=0;v<s;v++){const x=f*(s+1)+v,M=x+s+1;l.push(x,x+1,M,M,x+1,M+1)}const h=o.getPointAt(0),u=c.length/3;c.push(h.x,h.y,h.z);for(let f=0;f<s;f++)l.push(u,f+1,f);const d=o.getPointAt(1),m=c.length/3;c.push(d.x,d.y,d.z);const g=r*(s+1);for(let f=0;f<s;f++)l.push(m,g+f,g+f+1);const _=new Ae;_.setAttribute("position",new se(c,3)),_.setIndex(l),_.computeVertexNormals();const p=new Ht(_,i);return p.castShadow=!0,p}function Is({fur:n="#c96a2d",belly:t="#f1dcb5",hat:e="acorn",hatColor:i="#6e4a2a",tailUp:s=1}={}){const r=new Ft,o=new Ft;r.add(o);const a=dt(n),c=dt(t),l=dt("#1b1410");for(const f of[-1,1])o.add(tt(at.ico,a,f*.1,.05,.07,.08,.045,.13)),o.add(tt(at.ico,a,f*.12,.17,-.02,.14));o.add(tt(at.ico,a,0,.38,0,.21,.28,.19)),o.add(tt(at.ico,c,0,.36,.1,.14,.2,.09));const h=new Ft;h.position.set(0,.72,.05),o.add(h),h.add(tt(at.ico,a,0,0,0,.17)),h.add(tt(at.ico,c,0,-.05,.12,.09,.075,.08)),h.add(tt(at.sph,l,0,-.02,.2,.028));for(const f of[-1,1]){h.add(tt(at.sph,l,f*.075,.04,.13,.034)),h.add(tt(at.sph,dt("#ffffff"),f*.068,.055,.155,.01));const v=tt(at.cone,a,f*.09,.16,-.02,.05,.13,.04);v.rotation.z=-f*.25,h.add(v);const x=tt(at.cone,dt(Sr(n,-.25)),f*.1,.25,-.02,.025,.07,.02);x.rotation.z=-f*.3,h.add(x)}e==="acorn"&&(h.add(tt(at.cap,dt(i),0,.07,0,.19,.13,.19)),h.add(tt(at.brim,dt(i),0,.07,0,.19,1,.19)),h.add(tt(at.cyl,dt(Sr(i,-.2)),0,.22,0,.02,.06,.02)));const u=new Ft;u.position.set(0,.22,-.18),o.add(u);const d=new Xc([[0,0,0],[0,.2,-.26],[0,.55*s,-.32],[0,.82*s,-.22],[0,.93*s,-.02]].map(f=>new C(...f))),m=dt(Sr(n,.08)),g=dt(Sr(n,.2)),_=12;for(let f=0;f<_;f++){const v=f/(_-1),x=.085+Math.sin(Math.min(1,v*1.15)*Math.PI)*.11,M=d.getPointAt(v);u.add(tt(at.ico,v>.75?g:m,M.x,M.y,M.z,x,x*1.1,x))}const p=[];for(const f of[-1,1]){const v=new Ft;v.position.set(f*.17,.52,.04),v.add(tt(at.ico,a,0,-.1,0,.05,.12,.05));const x=new Ft;x.position.set(0,-.21,0),x.add(tt(at.ico,a,0,0,0,.045)),v.add(x),v.userData.hand=x,v.rotation.x=-.9,o.add(v),p.push(v)}return r.userData.anim={kind:"squirrel",body:o,tail:u,head:h,armL:p[0],armR:p[1]},r}function Us({scale:n="#3f8f4a",belly:t="#d9cf86",hood:e=null,hoodSize:i=1,long:s=!1,thick:r=1}={}){const o=new Ft,a=new Ft;o.add(a);const c=dt(n),l=dt(t);let h;if(s)h=[[.05,.05,-.9],[-.18,.06,-.62],[.16,.07,-.34],[-.06,.1,-.08],[0,.26,.02],[0,.4,.03]];else{h=[];for(let _=0;_<=10;_++){const p=_/10,f=-.6+p*Math.PI*2.3,v=.3-p*.17;h.push([Math.cos(f)*v,.06+p*.1,Math.sin(f)*v-.04])}h.push([0,.3,.02],[0,.42,.03])}a.add(Py(h,.025,.115*r,c));const u=tt(new qc(.12*r,.2,3,8),c,0,.53,.04);u.rotation.x=.12,a.add(u),a.add(tt(at.ico,l,0,.5,.12*r,.085*r,.17,.05));const d=new Ft;if(d.position.set(0,.79,.08),a.add(d),e){const _=tt(at.ico,dt(e),0,-.02,-.07,.21*i,.24*i,.05);d.add(_);for(const p of[-1,1])d.add(tt(at.sph,dt(t),p*.08*i,.02,-.12,.035*i,.035*i,.01))}d.add(tt(at.ico,c,0,0,.02,.11,.09,.15)),d.add(tt(at.ico,l,0,-.04,.06,.08,.04,.11));for(const _ of[-1,1])d.add(tt(at.sph,dt("#ffd23a",{emissive:"#b08000",emissiveIntensity:.4}),_*.065,.035,.09,.03)),d.add(tt(at.sph,dt("#111111"),_*.079,.037,.1,.008,.024,.012));const m=new Ft;m.position.set(0,-.03,.16);for(const _ of[-1,1]){const p=tt(at.cyl,dt("#d0304a"),_*.012,0,.05,.008,.1,.008);p.rotation.x=Math.PI/2,p.rotation.z=_*.3,m.add(p)}m.scale.setScalar(.001),d.add(m);const g=[];for(const _ of[-1,1]){const p=new Ft;p.position.set(_*.15*r,.64,.05),p.add(tt(at.ico,c,0,-.1,0,.045*r,.12,.045*r));const f=new Ft;f.position.set(0,-.21,0),f.add(tt(at.ico,c,0,0,0,.042*r)),p.add(f),p.userData.hand=f,p.rotation.x=-.9,a.add(p),g.push(p)}return o.userData.anim={kind:"naga",body:a,head:d,tongue:m,armL:g[0],armR:g[1]},o}const br=()=>dt("#7a5232");function Ly(n=1.1,t="#c9a24a"){const e=new Ft;return e.add(tt(at.cyl,br(),0,0,0,.022,n,.022)),e.add(tt(at.cone,qe(t),0,n/2+.07,0,.04,.14,.04)),e}function ku(n,t,e){const i=new Ft,s=tt(at.cyl,t,0,0,0,n,.04,n);return s.rotation.x=Math.PI/2,i.add(s),i.add(tt(at.sph,e,0,0,.03,n*.25,n*.25,n*.15)),i}const Sr=(n,t)=>{const e=new jt(n),i={};return e.getHSL(i),e.setHSL(i.h,i.s,Math.max(0,Math.min(1,i.l+t))),"#"+e.getHexString()};function ei(n,t,e=.9){n.userData.hand.add(t),t.rotation.x=e}function Bu(n,t,e,i){const s=new Ft,r=tt(at.cyl,dt("#5a3a22"),0,0,0,n,.1,n);r.rotation.z=Math.PI/2;const o=tt(at.cyl,qe("#444"),0,0,0,n*.3,.13,n*.3);return o.rotation.z=Math.PI/2,s.add(r,o),s.position.set(t,e,i),s}const Dy={nutkin(){const n=Is({fur:"#cf6d2a",hatColor:"#6a4a26"}),t=n.userData.anim,e=tt(at.cone,dt("#5f8f2e"),0,.45,-.06,.25,.42,.2);e.rotation.x=.15,t.body.add(e);const i=new Ft;return i.add(Gi([0,-.08,0],[0,.04,0],.018,br())),i.add(Gi([0,.04,0],[-.05,.13,0],.014,br())),i.add(Gi([0,.04,0],[.05,.13,0],.014,br())),ei(t.armR,i,1.4),t.armR.rotation.x=-1.3,n},grenadier(){const n=Is({fur:"#a9552a",hatColor:"#4f3a22"}),t=n.userData.anim,e=tt(new Rn(.21,.025,4,16),dt("#4a3020"),0,.4,.02);e.rotation.set(.1,0,.75),e.scale.z=.8,t.body.add(e);for(let s=0;s<4;s++){const r=-.7+s*.45;t.body.add(tt(at.sph,dt("#8a5a2a"),Math.sin(r)*.21*.7,.4+Math.cos(r)*.21*.7,.17,.045,.055,.045))}for(const s of[-1,1])t.head.add(tt(new Rn(.04,.012,4,10),qe("#c9a24a"),s*.07,.07,.14));const i=new Ft;return i.add(tt(at.sph,dt("#8a5a2a"),0,0,0,.06,.07,.06)),i.add(tt(at.cap,dt("#4f3a22"),0,.03,0,.065,.04,.065)),i.add(tt(at.brim,dt("#4f3a22"),0,.03,0,.065,1,.065)),i.add(tt(at.sph,Wi("#ffb030"),0,.1,0,.022)),ei(t.armR,i,0),t.armR.rotation.x=2.3,n},oakguard(){const n=Is({fur:"#8a5a35",hatColor:"#5a3c22"}),t=n.userData.anim;t.body.add(tt(at.ico,dt("#5b4330"),0,.42,.05,.2,.22,.16));const e=tt(at.cone,dt("#c0302a"),0,.3,-.05,.03,.18,.08);e.rotation.x=-.5,t.head.add(e);const i=ku(.22,dt("#6b4a2e"),dt("#3e7a2a"));ei(t.armL,i,.9),i.position.set(-.02,0,.08),t.armL.rotation.set(-.6,0,.3);const s=new Ft;return s.add(tt(at.cyl,br(),0,.2,0,.022,1.15,.022)),s.add(tt(at.box,qe("#a8b0b8"),.07,.62,0,.12,.16,.02)),s.add(tt(at.cone,dt("#6b4a26"),0,.85,0,.06,.18,.06)),ei(t.armR,s,.9),n},glider(){const n=Is({fur:"#9a8a78",belly:"#efe5d5",hat:"none",tailUp:.25}),t=n.userData.anim;for(const i of[-1,1])t.head.add(tt(new Rn(.045,.015,4,10),qe("#c9a24a"),i*.07,.07,.14));t.head.add(tt(at.cap,dt("#6b4a2e"),0,.06,-.01,.18,.11,.18)),t.head.add(tt(at.brim,dt("#6b4a2e"),0,.06,-.01,.18,1,.18)),t.armL.rotation.set(-.2,0,-1.25),t.armR.rotation.set(-.2,0,1.25);const e=dt(Sr("#9a8a78",-.12),{side:_n});for(const i of[-1,1]){const s=new Ae;s.setAttribute("position",new se([i*.15,.52,.02,i*.42,.45,.02,i*.2,.1,0,i*.15,.52,.02,i*.2,.1,0,i*.12,.25,0],3)),s.computeVertexNormals();const r=new Ht(s,e);r.castShadow=!0,t.body.add(r)}return t.body.position.y=.7,t.body.rotation.x=.55,t.lift=.7,n.add(tt(at.cyl,dt("#cfe8ff",{transparent:!0,opacity:.35}),0,.42,0,.025,.66,.025)),t.tail.rotation.x=-.6,n},trebuchet(){const n=new Ft,t=new Ft;n.add(t);const e=dt("#7a5232"),i=dt("#5f3e24");for(const l of[-1,1])t.add(tt(at.box,i,l*.38,.2,0,.1,.1,1.6)),t.add(Gi([l*.38,.2,-.55],[l*.38,1.25,0],.045,e)),t.add(Gi([l*.38,.2,.55],[l*.38,1.25,0],.045,e));t.add(tt(at.box,i,0,.2,.6,.86,.08,.1)),t.add(tt(at.box,i,0,.2,-.6,.86,.08,.1));const s=tt(at.cyl,qe("#555"),0,1.25,0,.04,.9,.04);s.rotation.z=Math.PI/2,t.add(s);const r=[];for(const l of[-1,1])for(const h of[-.6,.6]){const u=Bu(.17,l*.5,.17,h);t.add(u),r.push(u)}const o=new Ft;o.position.set(0,1.25,0),o.add(tt(at.box,e,0,0,.35,.08,.08,1.7));const a=tt(at.box,i,0,-.18,-.45,.32,.3,.3);o.add(a);for(let l=0;l<5;l++)o.add(tt(at.sph,dt("#8a5a2a"),(Math.random()-.5)*.2,-.02,-.45+(Math.random()-.5)*.2,.06));const c=tt(at.cone,dt("#6b4a26"),0,0,1.25,.11,.24,.11);c.rotation.x=Math.PI/2,o.add(c),o.add(tt(at.sph,Wi("#ff8a2a"),0,.06,1.25,.05)),o.rotation.x=.75,o.rotation.y=Math.PI,t.add(o);for(const l of[-1,1]){const h=Is({fur:"#c96a2d"});h.scale.setScalar(.72),h.position.set(l*.72,.05,-.25),h.rotation.y=-l*.5,h.userData.anim.armR.rotation.x=-2.2,t.add(h)}o.userData.keep=!0;for(const l of r)l.userData.keep=!0;return n.userData.anim={kind:"machine",body:t,wheels:r,throwArm:o,rest:.75},n},elder(){const n=Is({fur:"#a9a197",belly:"#f4efe6",hat:"none"}),t=n.userData.anim;n.scale.setScalar(1.28);const e=tt(new Hn(.3,.55,10,1,!0),dt("#5a6b34",{side:_n}),0,.3,0);t.body.add(e),t.head.add(tt(at.cone,dt("#f4efe6"),0,-.14,.15,.06,.16,.04).rotateX(Math.PI));for(let s=0;s<7;s++){const r=s/7*Math.PI*2,o=tt(at.cone,dt(s%2?"#d08a2c":"#6aa646"),Math.cos(r)*.15,.12,Math.sin(r)*.15,.035,.12,.02);o.rotation.set(Math.sin(r)*.4,0,-Math.cos(r)*.4),t.head.add(o)}const i=new Ft;i.add(tt(at.cyl,dt("#5a3d24"),0,.25,0,.025,1,.025)),i.add(tt(at.oct,Wi("#7dff8a"),0,.82,0,.07,.11,.07));for(let s=0;s<3;s++){const r=s/3*Math.PI*2;i.add(Gi([0,.7,0],[Math.cos(r)*.07,.86,Math.sin(r)*.07],.012,dt("#5a3d24")))}return ei(t.armL,i,.9),t.armL.rotation.x=-.6,t.gem=i.children[1],t.gem.userData.keep=!0,n},scaleguard(){const n=Us({scale:"#3f8f4a",belly:"#d9cf86"}),t=n.userData.anim;t.head.add(tt(at.cap,qe("#b8862e"),0,.04,.01,.12,.09,.15)),t.head.add(tt(at.brim,qe("#b8862e"),0,.04,.01,.12,1,.15)),t.head.add(tt(at.box,qe("#b8862e"),0,.12,-.02,.015,.06,.18)),ei(t.armR,Ly(1.15),.9);const e=ku(.2,qe("#a8762a"),qe("#e0b050"));return ei(t.armL,e,.9),e.position.z=.06,t.armL.rotation.set(-.7,0,.35),n},spitter(){const n=Us({scale:"#2f8f86",belly:"#e0d890",hood:"#5a2f7a",hoodSize:1.45}),t=n.userData.anim;return t.head.add(tt(at.sph,Wi("#8aff5a"),0,-.04,.16,.035)),t.body.add(tt(at.ico,dt("#7a8a3a"),.17,.38,.05,.08,.1,.08)),t.body.add(tt(at.sph,Wi("#8aff5a"),.17,.48,.05,.03)),t.armL.rotation.x=-.5,t.armR.rotation.x=-.5,n},sidewinder(){const n=Us({scale:"#c2a061",belly:"#efe0b0",long:!0}),t=n.userData.anim;for(let e=0;e<6;e++)t.body.add(tt(at.oct,dt("#6b4a2a"),0,.12+e*.07,-.05-e*.02,.04,.03,.04));for(const e of[-1,1]){const i=tt(at.cone,dt("#8a6a3a"),e*.06,.08,.05,.02,.07,.02);i.rotation.z=-e*.4,t.head.add(i);const s=tt(new Rn(.13,.014,4,12,Math.PI*.9),qe("#c8ccd0"),0,.08,.08);s.rotation.y=Math.PI/2,ei(e<0?t.armL:t.armR,s,.4)}return t.armL.rotation.set(-1.3,0,.3),t.armR.rotation.set(-1.3,0,-.3),t.body.rotation.x=.12,n},brute(){const n=Us({scale:"#4f6e2a",belly:"#c8b870",thick:1.35}),t=n.userData.anim;n.scale.setScalar(2.15);for(let e=0;e<7;e++){const i=tt(at.cone,dt("#e8dcc0"),0,.45+e*.06,-.12-(e<3?0:(e-3)*.01),.02,.07,.02);i.rotation.x=-1.1,t.body.add(i)}for(const e of[-1,1]){const i=tt(at.cone,dt("#e8dcc0"),e*.07,.08,-.03,.025,.12,.025);i.rotation.set(-.6,0,-e*.6),t.head.add(i),t.body.add(tt(new Rn(.06,.015,4,10).rotateX(Math.PI/2),qe("#b8862e"),e*.2,.5,.05))}return t.armL.rotation.set(-1.2,0,.5),t.armR.rotation.set(-1.2,0,-.5),n},engine(){const n=new Ft,t=new Ft;n.add(t);const e=dt("#4a3a2a"),i=dt("#3a2c20");t.add(tt(at.box,e,0,.36,0,.8,.22,1.35));const s=[];for(const c of[-1,1])for(const l of[-.45,.45]){const h=Bu(.21,c*.47,.21,l);t.add(h),s.push(h)}const r=tt(at.ico,dt("#d8cfb0"),0,.55,.78,.2,.16,.28);t.add(r);for(const c of[-1,1])t.add(tt(at.cone,dt("#f4ecd8"),c*.09,.43,.92,.025,.12,.025).rotateX(Math.PI)),t.add(tt(at.sph,Wi("#8aff5a"),c*.1,.62,.88,.035));for(const c of[-1,1])t.add(Gi([c*.3,.45,-.3],[c*.2,1.05,-.1],.04,i));const o=new Ft;o.position.set(0,1.05,-.1),o.add(tt(at.box,e,0,0,.35,.08,.08,.9)),o.add(tt(at.cap,dt("#3a2c20",{side:_n}),0,.02,.8,.14,.08,.14).rotateX(Math.PI));const a=tt(at.sph,dt("#7dff5a",{emissive:"#4ad02a",emissiveIntensity:1.1,transparent:!0,opacity:.85,roughness:.15}),0,.12,.8,.14);a.userData.keep=!0,o.add(a),o.rotation.x=-.55,t.add(o);for(let c=0;c<3;c++)t.add(tt(at.sph,dt("#7dff5a",{emissive:"#3ab02a",emissiveIntensity:.9}),-.2+c*.2,.55,-.55,.08));for(const c of[-1,1]){const l=Us({scale:"#3f8f4a",belly:"#d9cf86"});l.scale.setScalar(.72),l.position.set(c*.72,.05,-.35),l.rotation.y=-c*.5,t.add(l)}o.userData.keep=!0;for(const c of s)c.userData.keep=!0;return n.userData.anim={kind:"machine",body:t,wheels:s,throwArm:o,rest:-.55,globe:a},n},hierophant(){const n=Us({scale:"#5e3a8c",belly:"#e6c870",hood:"#3a2060",hoodSize:1.7}),t=n.userData.anim;n.scale.setScalar(1.32);for(let i=0;i<5;i++){const s=(i/4-.5)*1.6,r=tt(at.cone,qe("#e0b040"),Math.sin(s)*.1,.12+Math.cos(s)*.04,-.02,.02,.12,.02);r.rotation.z=-s*.5,t.head.add(r)}for(const i of[-1,1])t.body.add(tt(new Rn(.05,.014,4,10).rotateX(Math.PI/2),qe("#e0b040"),i*.15,.45,.05));const e=new Ft;return e.add(tt(at.cyl,dt("#2a1a40"),0,.25,0,.022,1,.022)),e.add(tt(at.sph,Wi("#c070ff"),0,.82,0,.08)),e.add(tt(new Rn(.1,.012,4,14),qe("#e0b040"),0,.82,0)),ei(t.armL,e,.9),t.armL.rotation.x=-.6,t.gem=e.children[1],t.gem.userData.keep=!0,n}};function Iy(n,t,e){const i=new Ft;i.add(Cy(t.base,e));const s=Dy[n]();return s.position.y=t.big?.09:.06,s.userData.y0=s.position.y,i.add(s),i.userData.fig=s,i.userData.anim=s.userData.anim,i.userData.phase=Math.random()*10,Cc(i.children[0]),Cc(s),i.traverse(r=>{r.isMesh&&(r.castShadow=!0)}),i.children[0].traverse(r=>{r.isMesh&&(r.receiveShadow=!0)}),i}function Uy(n){for(const t of["position","normal"]){const e=n.getAttribute(t);for(let i=0;i<e.count;i+=3){const s=e.getX(i+1),r=e.getY(i+1),o=e.getZ(i+1);e.setXYZ(i+1,e.getX(i+2),e.getY(i+2),e.getZ(i+2)),e.setXYZ(i+2,s,r,o)}}}const ac=new Map;function Ny(n){return[n.metalness,n.roughness,n.emissiveIntensity>0?n.emissive.getHex():0,n.emissiveIntensity,n.transparent,n.opacity,n.side,n.flatShading].join("|")}function Cc(n){n.updateMatrixWorld(!0);const t=new ae().copy(n.matrixWorld).invert(),e=new ae,i=new Map,s=[],r=o=>{for(const a of o.children){if(a.userData.keep){Cc(a);continue}if(a.isMesh){const c=a.material,l=Ny(c);i.has(l)||i.set(l,{m:c,geos:[]});const h=a.geometry.index?a.geometry.toNonIndexed():a.geometry,u=new Ae;u.setAttribute("position",h.getAttribute("position").clone()),u.setAttribute("normal",h.getAttribute("normal").clone()),u.applyMatrix4(e.multiplyMatrices(t,a.matrixWorld)),e.determinant()<0&&Uy(u);const d=u.getAttribute("position").count,m=new Float32Array(d*3);for(let g=0;g<d;g++)m.set([c.color.r,c.color.g,c.color.b],g*3);u.setAttribute("color",new xn(m,3)),i.get(l).geos.push(u),s.push(a)}r(a)}};r(n);for(const o of s)o.parent.remove(o);for(const[o,{m:a,geos:c}]of i)ac.has(o)||ac.set(o,new Dn({vertexColors:!0,metalness:a.metalness,roughness:a.roughness,flatShading:a.flatShading,emissive:a.emissive,emissiveIntensity:a.emissiveIntensity,transparent:a.transparent,opacity:a.opacity,side:a.side})),n.add(new Ht(Ry(c),ac.get(o)))}let Qe=null,Xs=null,ri=!1;try{ri=localStorage.getItem("tails-and-scales:muted")==="1"}catch{}function ua(){if(!Qe)try{Qe=new(window.AudioContext||window.webkitAudioContext),Xs=Qe.createGain(),Xs.gain.value=ri?0:.5,Xs.connect(Qe.destination)}catch{Qe=null}}function zy(){ri=!ri;try{localStorage.setItem("tails-and-scales:muted",ri?"1":"0")}catch{}return Xs&&(Xs.gain.value=ri?0:.5),ri}const Oy=()=>ri;function Fy(n){const t=Math.floor(Qe.sampleRate*n),e=Qe.createBuffer(1,t,Qe.sampleRate),i=e.getChannelData(0);for(let r=0;r<t;r++)i[r]=Math.random()*2-1;const s=Qe.createBufferSource();return s.buffer=e,s}function Sd(n,t,e,i,s){const r=Qe.createGain();return r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(i,t+e),r.gain.exponentialRampToValueAtTime(1e-4,t+s),n.connect(r),r.connect(Xs),r}function Ns({dur:n=.3,freq:t=800,type:e="lowpass",peak:i=.5,delay:s=0,q:r=1}){const o=Qe.currentTime+s,a=Fy(n),c=Qe.createBiquadFilter();c.type=e,c.frequency.value=t,c.Q.value=r,a.connect(c),Sd(c,o,.005,i,n),a.start(o)}function $i({f0:n=440,f1:t=n,dur:e=.15,type:i="sine",peak:s=.2,delay:r=0}){const o=Qe.currentTime+r,a=Qe.createOscillator();a.type=i,a.frequency.setValueAtTime(n,o),a.frequency.exponentialRampToValueAtTime(Math.max(20,t),o+e),Sd(a,o,.01,s,e),a.start(o),a.stop(o+e+.05)}const ky={dice(n=3){for(let t=0;t<Math.min(6,n);t++)Ns({dur:.04,freq:2500+Math.random()*2e3,type:"bandpass",q:4,peak:.35,delay:t*.035+Math.random()*.02})},boom(n=1){Ns({dur:.5+n*.5,freq:300+200/n,peak:.8}),$i({f0:90,f1:30,dur:.5+n*.3,type:"sine",peak:.5})},shot(){$i({f0:900,f1:300,dur:.08,type:"triangle",peak:.12})},thwack(){Ns({dur:.07,freq:1400,type:"bandpass",q:2,peak:.4})},squeak(){$i({f0:1400,f1:2400,dur:.12,type:"sine",peak:.12})},hiss(){Ns({dur:.35,freq:5e3,type:"highpass",peak:.18})},crumble(){Ns({dur:.8,freq:500,peak:.45});for(let n=0;n<4;n++)Ns({dur:.05,freq:1200,type:"bandpass",peak:.25,delay:.1+n*.09})},magic(){for(let n=0;n<4;n++)$i({f0:500+n*220,f1:900+n*300,dur:.25,type:"sine",peak:.08,delay:n*.06})},fizzle(){$i({f0:600,f1:120,dur:.35,type:"sawtooth",peak:.06})},fanfare(){[523,659,784,1046].forEach((n,t)=>$i({f0:n,dur:.3,type:"triangle",peak:.15,delay:t*.14}))},click(){$i({f0:1200,f1:900,dur:.04,type:"square",peak:.04})}},Ne=new Proxy(ky,{get(n,t){return(...e)=>{if(!(!Qe||ri))try{n[t](...e)}catch{}}}}),{alive:By,isEngaged:Hy,eyeY:Vy,chestY:Wy,inCover:Gy,phaseKey:Hr,canAct:$y,movePlan:Xy,validEnd:jy,freeSpot:qy,shotInfo:Yy,shootTargets:Ky,chargeTargets:Jy,chargePlan:Zy,rngState:Hu}=cd,{W:tn,H:an}=Ui,Mt=n=>document.querySelector(n),Ln=new URLSearchParams(location.search),Ke=new wf({antialias:!0});Ke.setPixelRatio(Ln.has("lowfi")?.5:Math.min(devicePixelRatio,2));Ke.setSize(innerWidth,innerHeight);Ke.shadowMap.enabled=!Ln.has("lowfi");Ke.shadowMap.type=qu;Ke.toneMapping=Yu;Ke.toneMappingExposure=1.05;document.body.prepend(Ke.domElement);const re=new ox;re.background=new jt("#1c1712");re.fog=new Hc("#1c1712",70,140);const de=new mn(40,innerWidth/innerHeight,.1,400);de.position.set(0,30,31);const Ve=new Lx(de,Ke.domElement);Ve.target.set(0,0,1.5);Ve.enableDamping=!0;Ve.dampingFactor=.08;Ve.maxPolarAngle=1.32;Ve.minDistance=5;Ve.maxDistance=75;Ve.screenSpacePanning=!1;Ve.mouseButtons={LEFT:ii.ROTATE,MIDDLE:ii.DOLLY,RIGHT:ii.PAN};re.add(new Ex("#d6e6ff","#3b2a1a",.85));const ds=new Df("#fff0d6",2.3);ds.position.set(-16,34,20);ds.castShadow=!0;ds.shadow.mapSize.set(2048,2048);Object.assign(ds.shadow.camera,{left:-27,right:27,top:22,bottom:-22,near:5,far:90});ds.shadow.bias=-4e-4;ds.shadow.normalBias=.02;re.add(ds);const Ed=new Df("#9fb8ff",.35);Ed.position.set(18,12,-16);re.add(Ed);const wd=Mt("#labels"),ee=new Ay(re,de,wd);function Qy(){const n=document.createElement("canvas");n.width=2048,n.height=Math.round(2048*an/tn);const t=n.getContext("2d");t.fillStyle="#5b7a36",t.fillRect(0,0,n.width,n.height);const e=(s,r,o,a,c)=>{for(let l=0;l<r;l++)t.globalAlpha=c*(.4+Math.random()*.6),t.fillStyle=s[Math.random()*s.length|0],t.beginPath(),t.ellipse(Math.random()*n.width,Math.random()*n.height,o+Math.random()*(a-o),o+Math.random()*(a-o),Math.random()*3,0,Math.PI*2),t.fill()};e(["#6a8a40","#4f6c2c","#729347","#55742f","#7f964c"],700,20,90,.35),e(["#7d6b45","#6e5d3a","#8a7650"],40,30,110,.22),e(["#8fa65a","#a4b46a"],300,4,14,.4);for(let s=0;s<14e3;s++)t.globalAlpha=.35,t.fillStyle=Math.random()<.5?"#3f5a24":"#8fae5a",t.fillRect(Math.random()*n.width,Math.random()*n.height,2,4+Math.random()*4);t.globalAlpha=1;const i=new Wc(n);return i.colorSpace=Le,i.anisotropy=Ke.capabilities.getMaxAnisotropy(),i}function tb(){const n=document.createElement("canvas");n.width=n.height=512;const t=n.getContext("2d");t.fillStyle="#4a3020",t.fillRect(0,0,512,512);for(let i=0;i<260;i++){t.strokeStyle=Math.random()<.5?"rgba(30,18,10,0.35)":"rgba(110,70,40,0.25)",t.lineWidth=1+Math.random()*3;const s=Math.random()*512;t.beginPath(),t.moveTo(0,s);for(let r=0;r<=512;r+=32)t.lineTo(r,s+Math.sin(r*.02+i)*4);t.stroke()}const e=new Wc(n);return e.colorSpace=Le,e.wrapS=e.wrapT=ko,e.repeat.set(6,6),e}const eb=new Dn({map:Qy(),roughness:.95}),al=new Ht(new Ii(tn,an).rotateX(-Math.PI/2),eb);al.receiveShadow=!0;re.add(al);const cl=new Ht(new Ii(220,220).rotateX(-Math.PI/2),new Dn({map:tb(),roughness:.7}));cl.position.y=-.62;cl.receiveShadow=!0;re.add(cl);{const n=new Dn({color:"#5a3a22",roughness:.6}),t=[[tn+1.6,.8,.8,0,-an/2-.4],[tn+1.6,.8,.8,0,an/2+.4],[.8,.8,an,-tn/2-.4,0],[.8,.8,an,tn/2+.4,0]];for(const[i,s,r,o,a]of t){const c=new Ht(new Bn(i,s,r),n);c.position.set(o,-.22,a),c.castShadow=c.receiveShadow=!0,re.add(c)}const e=new Ht(new Bn(tn,.6,an),n);e.position.y=-.31,re.add(e)}const ll=[],Td=[],Po=ar.classic.deploy;for(const n of[0,1]){const t=Yf[n],e=new Ze({transparent:!0,opacity:.07,depthWrite:!1});ll.push(e);const i=new Ht(new Ii(Po,an).rotateX(-Math.PI/2),e);i.position.set(t*(tn/2-Po/2),.008,0),i.renderOrder=1,re.add(i);const s=[];for(let o=-an/2;o<an/2;o+=1)s.push(new C(t*(tn/2-Po),.02,o),new C(t*(tn/2-Po),.02,o+.5));const r=new Vc({transparent:!0,opacity:.5});Td.push(r),re.add(new lx(new Ae().setFromPoints(s),r))}const Os=new Ar(new Hn(.035,.13,3),new Dn({color:"#ffffff",roughness:1}),700),Fs=new Ar(new Vn(.05,0),new Dn({roughness:.6}),140);re.add(Os,Fs);function nb(){const n=new ae,t=new kn,e=new rr,i=new jt;for(let r=0;r<Os.count;r++){const o=(Math.random()-.5)*(tn-.4),a=(Math.random()-.5)*(an-.4),c=.6+Math.random()*1.2;t.setFromEuler(e.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5)),n.compose(new C(o,.08*c,a),t,new C(c,c,c)),Os.setMatrixAt(r,n),Os.setColorAt(r,i.set(["#9cba5a","#a8c464","#b4c86e","#8fae50"][r%4]))}const s=["#f4f0e0","#f2d14a","#d77ad0","#e8e8ff"];for(let r=0;r<Fs.count;r++){const o=(Math.random()-.5)*(tn-.4),a=(Math.random()-.5)*(an-.4);n.compose(new C(o,.08,a),t.identity(),new C(1,.6,1)),Fs.setMatrixAt(r,n),Fs.setColorAt(r,i.set(s[r%s.length]))}Os.instanceMatrix.needsUpdate=Fs.instanceMatrix.needsUpdate=!0,Os.instanceColor.needsUpdate=Fs.instanceColor.needsUpdate=!0}const Ad=ar.classic.objectives.map((n,t)=>{const e=new Ft;e.position.set(n.x,0,n.z);const i=new Ht(new ln(.55,.65,.16,8),dt("#8a8478"));i.position.y=.08,i.castShadow=i.receiveShadow=!0;const s=new Ht(new ia(.2,0),new Dn({color:"#fff3c0",emissive:"#ffd060",emissiveIntensity:.8,flatShading:!0}));s.position.y=.42;const r=new Ht(new ln(.03,.03,2.1,6),dt("#5a3d24"));r.position.set(.35,1.1,0),r.castShadow=!0;const o=new Dn({color:"#e8e0d0",side:_n,roughness:.8}),a=new Ht(new Ii(.8,.5,6,1).translate(.4,0,0),o);a.position.set(.35,1.85,0),a.castShadow=!0;const c=new Ht(new hs(Ur-.06,Ur,64).rotateX(-Math.PI/2),new Ze({color:"#fff3c0",transparent:!0,opacity:.35,depthWrite:!1}));return c.position.y=.03,e.add(i,s,r,a,c),re.add(e),{i:t,g:e,gem:s,flag:a,flagMat:o,ring:c,owner:-1}}),Mi=new My(re,ee);Mi.onBreak=n=>{n.kind==="block"?Ne.crumble():Ne.thwack()};const vt={seed:(Number(Ln.get("seed"))||Math.random()*1e6|0)>>>0,control:["human","ai"],sel:null,reach:null,hover:null,follow:!0},hl=(()=>{if(!Ln.has("races"))return mu;const n=Ln.get("races").split(",").map(i=>i.trim().toLowerCase());if(n.length===2&&n.every(i=>Li[i]))return n;const t=`?races= takes two of ${Object.keys(Li).join(", ")}, comma-separated, not "${Ln.get("races")}"`;console.warn(`${t}: playing the classic matchup`);const e=document.createElement("p");return e.className="small",e.textContent=`${t}, so this is the classic matchup.`,Mt("#title .modes").before(e),mu})();let ge=null,he=null,ts=null,ul=!0;const si=()=>he??ts;let ke=null;const ib=Ln.has("debug"),sb=ib?(n,t)=>ke==null?void 0:ke.line(n,t):null,fl=n=>n.map((t,e)=>({seat:e,race:t}));let pe=bd(fl(hl));function Rd(n){pe=bd(n),Pd()}const Cd=document.createElement("style");document.body.appendChild(Cd);const Vu=n=>`rgba(${[1,3,5].map(t=>parseInt(n.slice(t,t+2),16)).join(", ")}, 0.45)`;function Pd(){Cd.textContent=`#hud, #labels, #log, #card { --s0: ${pe[0].color}; --s1: ${pe[1].color}; --s0-glow: ${Vu(pe[0].color)}; --s1-glow: ${Vu(pe[1].color)}; }`;for(const n of[0,1]){const t=n?"#sideB":"#sideA";Mt(`${t} .ic`).textContent=pe[n].icon,Mt(`${t} .nm`).textContent=pe[n].name,ll[n].color.set(pe[n].color),Td[n].color.set(pe[n].color)}}Pd();const Ld=n=>n>=0&&yd(si().seats)?pe[n].color:"",rb=n=>tl(he,n)==="human",Dd=n=>!!(ge!=null&&ge.localSeats.includes(n)),Id=Object.fromEntries(Nr.map(n=>[n.key,n.name])),_e=new Map,sn=n=>_e.get(n.id),Ee=n=>_e.get(n).u,un=n=>ye.mirror.units[n.id],Vr=n=>sn(n).models.filter((t,e)=>un(n).models[e].alive);function ob(n,t){const e=Qc(t,n.side),i=-e*Math.PI/2,s={u:n,edge:e,facing:i,moving:!1,at:null,models:[]};for(let o=0;o<n.t.models;o++){const a=Iy(n.key,n.t,pe[n.side].color);re.add(a),s.models.push({mesh:a,x:0,z:0,yaw:i,lunge:0,lungeDir:0,lift:0})}s.ring=new Ht(new hs(.88,1,48).rotateX(-Math.PI/2),new Ze({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})),s.ring.position.y=.04,s.ring.renderOrder=2,re.add(s.ring),s.hit=new Ht(new ln(1,1,1,12),new Ze({visible:!1})),s.hit.userData.unit=n,re.add(s.hit),s.label=document.createElement("div"),s.label.className=`ulabel s${n.side}`,wd.appendChild(s.label),_e.set(n.id,s),Wr(n);const r=un(n);r.models.forEach((o,a)=>{const c=s.models[a];c.x=r.pos.x+o.ox,c.z=r.pos.z+o.oz,c.mesh.position.set(c.x,0,c.z),c.mesh.rotation.y=c.yaw})}function Wr(n){const t=sn(n),e=un(n),i=t.at??e.pos;t.ring.scale.setScalar(e.r+.18);const s=n.t.big?2.4:n.t.fly?1.8:1.3;t.hit.scale.set(e.r,s,e.r),t.ring.position.x=t.hit.position.x=i.x,t.ring.position.z=t.hit.position.z=i.z,t.hit.position.y=t.hit.scale.y/2}function Gr(n){const t=un(n),e=t.models.filter(r=>r.alive);let i=`<span class="nm">${n.t.short}</span>`;n.t.models>1?i+=`<span class="ct">${t.alive}/${n.t.models}</span>`:i+=`<span class="ct">${e[0]?e[0].w:0}/${n.t.W}♥</span>`,t.mesmerized&&(i+='<span class="st" title="Mesmerized">🌀</span>'),t.alive>0&&t.engaged&&(i+='<span class="st" title="In combat">⚔</span>');const s=sn(n);s.label.innerHTML=i,s.label.style.display=t.alive>0?"":"none"}function ab(){for(const n of _e.values()){for(const t of n.models)re.remove(t.mesh);re.remove(n.ring,n.hit),n.label.remove()}_e.clear()}function cb(n){const t=i=>!_e.has(i.id)||_e.get(i.id).u.t!==i.t||_e.get(i.id).u.side!==i.side,e=n.units.find(t);if(e||n.units.length!==_e.size)throw new Error(`the battle's units are not the table's (${e?`unit ${e.id}, ${e.key} of seat ${e.side}`:`${n.units.length} units, ${_e.size} figures`}): a battle starts on its own table (start())`);for(const i of n.units){const s=_e.get(i.id);s.u=i,s.hit.userData.unit=i,Gr(i)}}const lb={log:n=>Bb(n.side,n.html,n.cls,n.at),"tray.open":n=>Lc.clear(n.title),dice:n=>Lc.row(n.label,n.dice,n.need,n),pause:n=>Gn(Br.pause(n.s)),focus:n=>Rb(n.x,n.z),"unit.place":n=>Wr(Ee(n.u)),"unit.formation":n=>{const t=Ee(n.u);Wr(t),Gr(t)},"unit.wound":n=>ub(n),"unit.slain":(n,t)=>fb(n,t),"unit.flee":n=>wb(n),"unit.destroyed":(n,t)=>db(n,t),"unit.face":n=>Tb(Ee(n.u),Ee(n.tg)),"unit.move":(n,t)=>mb(n,t),melee:n=>pb(n),"charge.result":n=>Ab(n),volley:n=>gb(n),"blast.aim":n=>_b(n),"blast.scatter":n=>vb(n),"blast.fire":n=>xb(n),"blast.land":n=>yb(n),"spell.cast":()=>{Ne.magic()},"spell.fizzle":n=>{Ne.fizzle(),ee.text(ir(Ee(n.u)),"Fizzle…","#c8b8ff")},"spell.thorns":n=>bb(n),"spell.fade":n=>Sb(n),"spell.gaze":n=>Eb(n),"spell.mesmerized":n=>{ee.text(ir(Ee(n.tg)),"Mesmerized!","#e0a0ff",{size:20})},status:()=>{for(const n of _e.values())Gr(n.u)},objectives:()=>{},act:()=>{},stage:n=>Cb(n),"phase.start":n=>Pb(n),"round.scored":n=>Lb(n),"game.over":n=>Db(n),pending:()=>{},check:()=>{},"terrain.clear":(n,t)=>Mi.apply(n,t),"terrain.add":(n,t)=>Mi.apply(n,t),"terrain.hurt":(n,t)=>Mi.apply(n,t),"terrain.destroy":(n,t)=>Mi.apply(n,t),"terrain.collapse":(n,t)=>Mi.apply(n,t),"terrain.rubble":(n,t)=>Mi.apply(n,t),fallback:(n,t)=>{const e=n.u!==void 0&&t.units[n.u]?t.units[n.u].pos:{x:n.x??0,z:n.z??0};return n.text&&ee.text({x:e.x,y:1.6,z:e.z},n.text,"#ffffff"),Gn(n.beat??Br.beat)}},ye=new yy({handlers:lb,onIdle:()=>Ub()});let Yo=!1;const hb={events(n,t){var e,i;if(he!==t.G&&(he=t.G,cb(he)),ke&&(n=ke.present(n,he)),Yo&&(Yo=!1,((e=n[0])==null?void 0:e.t)==="terrain.clear")){let s=1;for(;((i=n[s])==null?void 0:i.t)==="terrain.add";)s++;n=n.slice(s)}ye.push(n)}};function ub(n){const t=Ee(n.u),e=sn(t).models[n.m];ee.text({x:e.x,y:t.t.big?2.3:1.3,z:e.z},`-${n.dmg}`,"#ff5a4a",{size:t.t.big?24:18}),e.flash=.4}function fb(n,t){const e=Ee(n.u),i=sn(e).models[n.m];ee.text({x:i.x,y:e.t.big?2.3:1.3,z:i.z},`-${n.dmg}`,"#ff5a4a",{size:e.t.big?24:18}),i.dying=!0;const s=Li[e.race].look;Ne[s.voice]();const r=i.mesh.userData.fig,o=n.by===null?null:t.units[n.by],a=o?Math.atan2(i.x-o.pos.x,i.z-o.pos.z)-i.yaw:0,c=Math.sin(a)>=0?1:-1;ee.debris(i.x,.5,i.z,s.gore,6,{power:2,size:.07}),De(.6,l=>{r.rotation.z=c*l*1.45,r.position.y=(e.t.big?.09:.06)+Math.sin(l*Math.PI)*.15},nr).then(()=>Gn(1.4)).then(()=>De(.8,l=>i.mesh.position.y=-l*1.4)).then(()=>{re.remove(i.mesh),i.dying=!1})}function db(n,t){const e=Ee(n.u),i=sn(e),s=t.units[n.u].pos;i.label.style.display="none",i.ring.visible=!1,i.hit.visible=!1,re.remove(i.hit),ee.text({x:s.x,y:2.2,z:s.z},`${e.t.short} destroyed`,pe[n.by!==null?Ee(n.by).side:1-e.side].color,{size:20,life:2})}function pb(n){const t=Ee(n.u),e=Ee(n.tg),i=sn(e),s=un(e).pos;for(const r of Vr(t))r.lunge=1,r.lungeDir=Math.atan2(s.x-r.x,s.z-r.z);Ne.thwack(),n.hits&&Gn(Br.dice(n.n)).then(()=>{if(_e.get(e.id)===i)for(let r=0;r<Math.min(n.hits,8);r++){const o=Vr(e)[r%Math.max(1,un(e).alive)];if(o)for(let a=0;a<4;a++)ee.mote({x:o.x,y:.6,z:o.z,vx:(Math.random()-.5)*5,vy:Math.random()*4,vz:(Math.random()-.5)*5,size:.05,color:"#fff2b0",life:.3,g:12})}})}async function mb(n,t){const e=Ee(n.u),i=sn(e),{path:s,L:r,speed:o,fly:a,smashes:c}=n;if(n.stomp&&Ne.boom(.4),i.moving=!0,a)for(const g of i.models)g.flying=!0;const l=[];let h=0;for(let g=1;g<s.length;g++){const _=Ot(s[g].x-s[g-1].x,s[g].z-s[g-1].z);l.push({a:s[g-1],b:s[g],s:h,l:_}),h+=_}let u=0;const d=({ev:g})=>{for(const _ of g)Mi.apply(_,t);ee.shake=Math.max(ee.shake,.08)},m=()=>_e.get(n.u)!==i;if(await De(r/o+.15,g=>{if(m())return;const _=Math.min(r,g*(r+o*.15)),p=l.find(v=>_<=v.s+v.l)||l[l.length-1],f=p.l>0?(_-p.s)/p.l:1;if(i.facing=Math.atan2(p.b.x-p.a.x,p.b.z-p.a.z),i.at={x:En(p.a.x,p.b.x,f),z:En(p.a.z,p.b.z,f)},Wr(e),a)for(const v of i.models)v.lift=Math.sin(Math.min(1,_/r)*Math.PI)*Math.min(3,r*.3);for(;u<c.length&&c[u].s<=_;)d(c[u++])},ol),!m()){for(;u<c.length;)d(c[u++]);if(i.at=null,Wr(e),i.moving=!1,a)for(const g of i.models)g.flying=!1,g.lift=0;await Gn(.15)}}async function gb(n){const t=Ee(n.u),e=Ee(n.tg),i=sn(t),s=()=>_e.get(n.u)!==i,r=Vr(t),o=Vr(e),a=[],c=Math.min(10,n.n);for(let l=0;l<c;l++){const h=r[l%r.length],u=o[Math.random()*o.length|0],d={x:h.x,y:Vy(t)*.8+h.lift,z:h.z},m={x:u.x+(Math.random()-.5)*.6,y:Wy(e)*.8,z:u.z+(Math.random()-.5)*.6};a.push(Gn(l*.06).then(()=>{if(!s())return Ne.shot(),ee.projectile(d,m,Ud(n.fx))}).then(()=>{if(!s())for(let g=0;g<5;g++)ee.mote({x:m.x,y:m.y,z:m.z,vx:(Math.random()-.5)*4,vy:Math.random()*3,vz:(Math.random()-.5)*4,size:.05,color:n.fx==="spit"?"#9aff5a":"#ffe0a0",life:.35,g:10})}))}await Promise.all(a)}const vi={acorn:new vn(.07,6,5),dart:new Hn(.03,.3,4).rotateX(Math.PI/2),javelin:new ln(.02,.02,.9,4).rotateX(Math.PI/2),spit:new Vn(.08,0),bomb:new vn(.11,8,6),pinecone:new Hn(.2,.42,7),acid:new vn(.24,12,8)};function Ud(n){const t=e=>new Ze({color:e,toneMapped:!1});switch(n){case"acorn":return{mesh:new Ht(vi.acorn,dt("#8a5a2a")),arc:.08,speed:28};case"dart":return{mesh:new Ht(vi.dart,dt("#4a6a2a")),arc:.03,speed:34,spin:0};case"javelin":return{mesh:new Ht(vi.javelin,dt("#8a6a3a")),arc:.18,speed:20,spin:0};case"spit":return{mesh:new Ht(vi.spit,t("#9aff5a")),arc:.12,speed:18,trail:e=>ee.mote({x:e.x,y:e.y,z:e.z,size:.04,color:"#7aef4a",life:.4,g:6})};case"bomb":return{mesh:new Ht(vi.bomb,dt("#7a4a22")),arc:.45,speed:14,trail:e=>ee.mote({x:e.x,y:e.y+.1,z:e.z,size:.05,color:"#ffb030",life:.3,g:-1})};case"pinecone":return{mesh:new Ht(vi.pinecone,dt("#6b4a26",{emissive:"#ff5a10",emissiveIntensity:.6})),arc:.55,speed:18,trail:e=>{ee.mote({x:e.x,y:e.y,z:e.z,size:.12,color:Math.random()<.5?"#ff8a2a":"#ffd36e",life:.4,g:-2}),ee.smoke({x:e.x,y:e.y,z:e.z,size:.14,color:"#3a3430",life:.9})}};case"acid":return{mesh:new Ht(vi.acid,t("#8aff5a")),arc:.5,speed:15,trail:e=>ee.mote({x:e.x,y:e.y,z:e.z,size:.1,color:Math.random()<.5?"#5be04a":"#c8ff8a",life:.5,g:8})}}return{mesh:new Ht(vi.acorn,dt("#888"))}}let Fn=null;function _b(n){Fn=ee.ring(n.x,n.z,n.r,"#ffffff",{hold:!0,fill:.12})}async function vb(n){const t=Fn;ee.text({x:n.from.x,y:1.5,z:n.from.z},`scatter ${n.d}"`,"#ffd36e",{size:15}),await De(.35,e=>t==null?void 0:t.position.set(En(n.from.x,n.to.x,e),.05,En(n.from.z,n.to.z,e)),nr)}async function xb(n){const t=sn(Ee(n.u));await Mb(n),_e.get(n.u)===t&&(Fn==null||Fn.userData.remove(),Fn=null)}async function Mb(n){const t=Ee(n.u),e=sn(t),i=n.to,s=()=>_e.get(n.u)!==e,r=Vr(t)[0],o=r.mesh.userData.anim;if(o!=null&&o.throwArm){const c=o.rest;if(Ne.thwack(),De(.25,l=>o.throwArm.rotation.x=c-2.1*nr(l)).then(()=>De(.8,l=>o.throwArm.rotation.x=c-2.1*(1-l))),o.globe&&(o.globe.visible=!1),await Gn(.15),s())return}else r.lunge=1,r.lungeDir=Math.atan2(i.x-r.x,i.z-r.z);const a={x:r.x,y:t.t.big?1.8:.9,z:r.z};Ne.shot(),await ee.projectile(a,{x:i.x,y:.15,z:i.z},Ud(n.fx)),!s()&&o!=null&&o.globe&&(o.globe.visible=!0)}function yb(n){n.fx!=="thorns"&&(ee.explode(n.x,n.z,n.r,n.fx==="acid"?"acid":"fire"),Ne.boom(n.r/2)),ee.ring(n.x,n.z,n.r,n.fx==="acid"?"#8aff5a":"#ff9a4a",{life:1.4,fill:.2})}const $r=new Map;async function bb(n){const t=sn(Ee(n.u)),e=t.models[0].mesh.userData.anim.gem;if(e){const r=new C;e.getWorldPosition(r);for(let o=0;o<20;o++)ee.mote({x:r.x,y:r.y,z:r.z,vx:(Math.random()-.5)*3,vy:Math.random()*3,vz:(Math.random()-.5)*3,size:.06,color:"#9aff7a",life:.8,g:-1})}const i=[],s=new Hn(.12,1,5);for(let r=0;r<26;r++){const o=Math.random()*Math.PI*2,a=Math.sqrt(Math.random())*n.r,c=new Ht(s,dt(r%3?"#5a7a2a":"#7a5a2a"));c.position.set(n.x+Math.cos(o)*a,-.6,n.z+Math.sin(o)*a),c.rotation.set((Math.random()-.5)*.6,0,(Math.random()-.5)*.6),c.scale.set(1,.6+Math.random()*1.1,1),c.castShadow=!0,re.add(c),i.push(c)}$r.set(n.u,i),await De(.3,r=>i.forEach(o=>o.position.y=-.6+nr(r)*(.3+o.scale.y*.4))),_e.get(n.u)===t&&ee.explode(n.x,n.z,n.r,"thorns")}function Sb(n){const t=$r.get(n.u)??[];$r.delete(n.u),De(1.2,e=>t.forEach(i=>i.position.y-=.02*e)).then(()=>t.forEach(e=>re.remove(e)))}async function Eb(n){const t=Ee(n.tg),e=sn(t),i=()=>_e.get(n.tg)!==e,s=ir(Ee(n.u)),r=ir(t),o=[];for(let c=0;c<=16;c++){const l=c/16;o.push(Gn(l*.3).then(()=>i()||ee.mote({x:En(s.x,r.x,l),y:En(s.y,r.y,l)+Math.sin(l*Math.PI)*.8,z:En(s.z,r.z,l),size:.09,color:"#c070ff",life:.7,g:0})))}if(await Promise.all(o),i())return;const a=un(t);for(let c=0;c<3;c++)ee.ring(a.pos.x,a.pos.z,a.r*(.6+c*.35),"#c070ff",{life:1.2+c*.3,fill:.08})}function wb(n){const t=Ee(n.u),e=sn(t),i=e.models[n.m];i.dying=!0;const s=e.edge,r=s*(tn/2+3),o=i.x,a=i.z;i.fleeing=!0,ee.text({x:i.x,y:1.4,z:i.z},"flees!","#e0e0e0",{size:14}),i.yaw=s*Math.PI/2,De(2.2,c=>{i.x=En(o,r,c),i.z=a,i.mesh.position.set(i.x,Math.abs(Math.sin(c*30))*.2,i.z),i.mesh.rotation.y=i.yaw}).then(()=>{re.remove(i.mesh),i.dying=!1})}function Tb(n,t){const e=sn(n),i=un(t).pos,s=un(n).pos;e.facing=Math.atan2(i.x-s.x,i.z-s.z);for(const r of e.models)r.look=Math.atan2(i.x-r.x,i.z-r.z)}const ir=n=>{const t=un(n).pos;return{x:t.x,y:n.t.big?2.6:1.6,z:t.z}};function Ab(n){const t=Ee(n.u);n.ok?ee.text(ir(t),"CHARGE!",pe[t.side].color,{size:22}):ee.text(ir(t),"Charge failed","#d0d0d0")}let Wu=null;function Rb(n,t){const e=ye.mirror;if(!vt.follow||e.stage!=="battle"||Dd(e.active)&&ge.localSeats.length===1)return;const i=Ve.target.clone();if(Math.hypot(n-i.x,t-i.z)<6)return;const r=de.position.clone().sub(i),o=new C(En(i.x,n,.6),0,En(i.z,t,.6)),a=Wu={};De(.9,c=>{Wu===a&&(Ve.target.lerpVectors(i,o,c),de.position.copy(Ve.target).add(r))},ol)}let js=!1,Oo=!1;function Cb(n){js=!1,n.stage!=="deploy"&&Xn(null),qn()}function Pb(n){return js=!0,Xn(null),Lc.el.classList.remove("show"),qn(),$d(`${pe[n.side].icon} ${pe[n.side].name}`,Id[n.phase],n.side)}function Lb(n){return n.owners.forEach((t,e)=>{const i=ar.classic.objectives[e];t>=0&&ee.ring(i.x,i.z,Ur,pe[t].color,{life:1.6,fill:.15})}),qn(),$d(`End of round ${n.round}`,`VP ${n.vp[0]} – ${n.vp[1]}`)}function Db({win:n,why:t,vp:e,rounds:i}){Xn(null),qn();const s=n<0?"A bloody draw":`${pe[n].name} win!`,r=i?`in round ${i}`:"in the deployment",o=t==="wipe"?`${pe[1-n].name} have been wiped from the table ${r}.`:t==="concede"?`${pe[1-n].name} conceded ${r}.`:`Final score ${e[0]} – ${e[1]} after ${i} round${i===1?"":"s"}.`,a=Mt("#overTitle");a.textContent=`${n>=0?pe[n].icon+" ":""}${s}`,a.style.color=Ld(n),Mt("#overWhy").textContent=o,Mt("#over").classList.remove("hidden"),Ne.fanfare()}const ui=()=>ge?ge.decisionFor():-1,fa=()=>ui()>=0?he.pending:null,Di=()=>{var n;return((n=fa())==null?void 0:n.k)==="deploy"?ui():-1},zi=()=>{var n;return ye.idle&&((n=fa())==null?void 0:n.k)==="phase"},fi=()=>{var n;return ye.idle&&((n=fa())==null?void 0:n.k)==="chargeEnd"?by(ge):null},$n=n=>ge.preview(n);function hi(n,t){const e=ge?ge.legal(n,t):"no battle";return e||(ge.submit(n,t),qn(),null)}const Nd=(n,t)=>(pa(),hi(ui(),{t:"move",u:n.id,c:t})),zd=n=>hi(ui(),{t:"advance",u:n.id}),Od=(n,t)=>hi(ui(),{t:"shoot",u:n.id,tg:t.id}),Fd=(n,t)=>hi(ui(),{t:"charge",u:n.id,tg:t.id});function kd(n){const t=fi();return t?n>=0&&t.ok[n]?Bd(t,n):`cell ${n} is no spot the roll reaches`:"no charge to end"}function Ib(){const n=fi();return n?Bd(n,Sy):"no charge to end"}function Bd(n,t){return Ko=null,pa(),ai.visible=!1,Mt("#tooltip").style.display="none",hi(n.seat,Ey(t))}let Ko=null;function Ub(){var e;ke==null||ke.idle();const n=wr&&((e=_e.get(wr.id))==null?void 0:e.u);n&&n.t===wr.t&&n.side===wr.side&&Mt("#card").classList.contains("show")&&Ci(n),vt.sel&&zi()&&Xn($n((i,s)=>s.canAct(i,vt.sel))?vt.sel:null);const t=fi();t&&Ko!==t&&(Ko=t,On.visible=!1,Wd(t.ok,[255,150,60],150),Pc(t.cell,t.u.r)),qn(),ke==null||ke.settled()}const cc=new Cx,Gu=new ht;let Er=null;function Hd(n){Gu.set(n.clientX/innerWidth*2-1,-(n.clientY/innerHeight)*2+1),cc.setFromCamera(Gu,de);const t=cc.intersectObjects([..._e.values()].filter(s=>un(s.u).alive>0).map(s=>s.hit),!1),e=t.length?t[0].object.userData.unit:null,i=cc.intersectObject(al,!1)[0];return{unit:e,ground:i?i.point:null}}Ke.domElement.addEventListener("pointerdown",n=>{ua(),Er={x:n.clientX,y:n.clientY,b:n.button}});Ke.domElement.addEventListener("pointerup",n=>{if(!Er||n.button!==0)return;const t=Math.hypot(n.clientX-Er.x,n.clientY-Er.y);Er=null,!(t>6)&&Nb(Hd(n))});Ke.domElement.addEventListener("pointerleave",()=>{vt.hoverPick=null,vt.hover=null,Gd(),dl()});Ke.domElement.addEventListener("pointermove",n=>{vt.mouse={x:n.clientX,y:n.clientY},vt.hoverPick=Hd(n),Gd()});function Nb({unit:n,ground:t}){if(Mt("#tooltip").style.display="none",Di()>=0)return Vd(n,t);const e=fi();if(e){if(t){const r=Md(he.nav,e.ok,t.x,t.z);r>=0&&kd(r)}return}if(!zi()){n&&Ci(n);return}const i=vt.sel,s=Hr(he);if(n&&n.side===ui()){$n((r,o)=>o.canAct(r,n))?(Ne.click(),Xn(n)):Ci(n);return}if(s==="move"&&i&&t){const r=$n((o,a)=>a.nearestValid(o,vt.reach,t.x,t.z));r>=0&&Nd(i,r);return}if(s==="shoot"&&i&&n&&n.side!==i.side)return void Od(i,n);if(s==="charge"&&i&&n&&n.side!==i.side)return void Fd(i,n);n?Ci(n):t&&Xn(null)}function Vd(n,t){const e=Di();if(e<0)return"no seat deploying here";if(n&&n.side===e)return Ne.click(),vt.sel=n,Ci(n),dl(),null;if(vt.sel&&t){const i=vt.sel,s=$n((r,o)=>o.freeSpot(r,i,t.x,t.z,e,r.units.filter(a=>a!==i)));if(s&&Math.hypot(s.x-t.x,s.z-t.z)<2.5){const r=hi(e,{t:"place",u:i.id,c:he.nav.index(s.x,s.z)});if(!r){Ne.click();for(const o of _e.values())Gr(o.u)}return r}}return null}function Xn(n){if(vt.sel=n,vt.reach=null,pa(),n&&he){const t=Hr(he);he.turn.stage==="battle"&&t==="move"&&!n.flags.moved&&(vt.reach=$n((e,i)=>i.movePlan(e,n,n.flags.advanced?n.flags.advRoll:0)),zb(vt.reach)),t==="shoot"&&n.t.ranged&&$u(n,n.t.ranged.range),t==="charge"&&$u(n,qr)}Ci(n),qn()}const Jo=Bf(tn,an,Kf),ks=new Uint8Array(Jo.nx*Jo.nz*4),da=new ax(ks,Jo.nx,Jo.nz,bn);da.magFilter=on;da.minFilter=on;const ur=new Ht(new Ii(tn,an).rotateX(-Math.PI/2),new Ze({map:da,transparent:!0,depthWrite:!1,toneMapped:!1}));ur.position.y=.035;ur.renderOrder=2;ur.visible=!1;re.add(ur);function zb(n){const t=n.u.flags.advanced,{u:e,res:i,mode:s,endForbid:r}=n,o=he.nav,a=new Uint8Array(o.N);for(let c=0;c<o.N;c++)isFinite(i.dist[c])&&o.standable(c,e.r,s==="wreck"?"wreck":"walk",r)&&(a[c]=1);Wd(a,n.fallback?[255,120,90]:t?[255,190,70]:[90,180,255])}function Wd(n,t,e=80){const i=he.nav;ks.fill(0);for(let s=0;s<i.N;s++){if(!n[s])continue;const r=s%i.nx,o=s/i.nx|0,a=r===0||o===0||r===i.nx-1||o===i.nz-1||!n[s-1]||!n[s+1]||!n[s-i.nx]||!n[s+i.nx],c=((i.nz-1-o)*i.nx+r)*4;ks[c]=t[0],ks[c+1]=t[1],ks[c+2]=t[2],ks[c+3]=a?210:i.diff[s]?Math.round(e*.7):e}da.needsUpdate=!0,ur.visible=!0}function pa(){ur.visible=!1,es.visible=!1,On.visible=!1}const On=new Ht(new hs(.985,1,96).rotateX(-Math.PI/2),new Ze({color:"#ffffff",transparent:!0,opacity:.6,depthWrite:!1,toneMapped:!1}));On.position.y=.04;On.visible=!1;re.add(On);function $u(n,t){On.position.x=n.pos.x,On.position.z=n.pos.z,On.scale.setScalar(n.r+t),On.material.color.set(Hr(he)==="charge"?"#ffb070":"#ffffff"),On.visible=!0}const es=new Tf(new Ae,new Vc({color:"#ffffff",transparent:!0,opacity:.9,toneMapped:!1}));es.visible=!1;es.renderOrder=4;re.add(es);const ai=new Ht(new hs(.9,1,40).rotateX(-Math.PI/2),new Ze({color:"#ffffff",transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1}));ai.position.y=.05;ai.visible=!1;re.add(ai);function Pc(n,t){ai.position.x=he.nav.x(n),ai.position.z=he.nav.z(n),ai.scale.setScalar(t),ai.visible=!0}function Gd(){const n=Mt("#tooltip");n.style.display="none",es.visible=!1,ai.visible=!1;const t=vt.hoverPick,e=fi();if(!t){e&&Pc(e.cell,e.u.r);return}vt.hover=t.unit;let i="";const s=vt.sel,r=(o,a,c)=>{es.geometry.setFromPoints(o.map(l=>new C(l.x,.08,l.z))),es.visible=!0,Pc(a,c)};if(e&&t.ground){const o=Md(he.nav,e.ok,t.ground.x,t.ground.z);o>=0?(r($n(a=>a.nav.path(e.plan.res,o,e.u.r,e.plan.mode==="fly"?null:e.plan.forbid)),o,e.u.r),i=`End charge here · ${e.plan.res.dist[o].toFixed(1)}" of ${e.rolled}"`):i="✖ out of reach — pick a spot in the orange area"}else zi()&&s&&(i=$n((o,a)=>{const c=a.phaseKey(o),l=o.nav;if(c==="move"&&vt.reach&&t.ground&&!t.unit){const h=a.nearestValid(o,vt.reach,t.ground.x,t.ground.z);return h<0?"":(r(l.path(vt.reach.res,h,s.r,vt.reach.mode==="fly"?null:vt.reach.forbid),h,s.r),`${vt.reach.res.dist[h].toFixed(1)}" of ${vt.reach.max}"`)}if(c==="shoot"&&t.unit&&t.unit.side!==s.side){const h=a.shotInfo(o,s,t.unit);return h.ok?Ob(s,t.unit,h):`✖ ${h.why}`}if(c==="charge"&&t.unit&&t.unit.side!==s.side){if(!a.chargeTargets(o,s).includes(t.unit))return`✖ out of charge range (${a.gap(s,t.unit).toFixed(1)}")`;const h=a.chargePlan(o,s,t.unit);return h?`Charge: need ${h.need}" on 2D6 — ${Math.round(os(h.need)*100)}%`:"✖ no route"}return""}));if(!i&&t.unit){const o=un(t.unit);i=`${t.unit.t.name} · ${t.unit.t.models>1?`${o.alive}/${t.unit.t.models} models`:`${o.models[0].w}/${t.unit.t.W} wounds`}`}i&&vt.mouse&&(n.innerHTML=i,n.style.display="block",n.style.left=vt.mouse.x+16+"px",n.style.top=vt.mouse.y+14+"px")}function Ob(n,t,e){const i=n.t.ranged;if(i.mesmerize)return`Mesmerize: cast ${i.spell}+ on 2D6 (${Math.round(os(i.spell)*100)}%) · D3 mortal wounds`;const s=[];i.spell&&s.push(`Cast ${i.spell}+ (${Math.round(os(i.spell)*100)}%)`);const r=Zs(n,i,!1),o=Kr(i.S,t.t.T,i.poison),a=Jr(t.t.Sv,i.AP,e.cover);s.push(`${r} ${i.blast?`template${r>1?"s":""} (${i.blast}")`:"shots"} · hit ${i.spell?"auto":e.need+"+"} · wound ${o}+ · save ${a>6?"—":a+"+"}`);const c=[];if(c.push(`${e.range.toFixed(1)}"`),e.cover&&c.push("cover"),e.visible?e.seen<e.total&&c.push(`${e.seen}/${e.total} visible`):c.push("unseen (indirect −1)"),i.heavy&&n.flags.moved&&c.push("moved (heavy −1)"),!i.blast){const l=Xo(r,e.need,i,t,e.cover);c.push(`≈${l.kills.toFixed(1)} slain`)}return s.push(c.join(" · ")),s.join("<br>")}const Fb={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};function kb(n,t){const e=document.createElement("div");e.className=`die ${t}`;for(let i=0;i<9;i++){const s=document.createElement("i");Fb[n].includes(i)&&(s.className="on"),e.appendChild(s)}return e}const Lc={el:Mt("#tray"),clear(n){this.el.innerHTML="";const t=document.createElement("div");t.className="tray-title",t.textContent=n,this.el.appendChild(t),this.el.classList.add("show")},async row(n,t,e,{sum:i=!1,pass:s,note:r="",save:o=!1}={}){Ne.dice(t.length);const a=document.createElement("div");a.className="tray-row";const c=document.createElement("span");c.className="lbl",c.textContent=n,a.appendChild(c);const l=document.createElement("span");l.className="dice",a.appendChild(l),t.slice(0,30).forEach((d,m)=>{const g=e?d>=e?o?"saved":"ok":"fail":s===!1?"fail":s?"ok":"plain",_=kb(d,g);_.style.animationDelay=`${m*.025/gn.speed}s`,l.appendChild(_)});const u=document.createElement("span");if(u.className="res",e){const d=ci(t,e);u.textContent=o?`${d} saved`:`${d} ✓`,t.length>30&&(u.textContent+=` (of ${t.length})`)}else i&&(u.textContent=r||`= ${t.reduce((d,m)=>d+m,0)}`,s===!0&&u.classList.add("good"),s===!1&&u.classList.add("bad"));for(a.appendChild(u),this.el.appendChild(a);this.el.children.length>7;)this.el.children[1].remove();await Gn(Br.dice(t.length))}};function Bb(n,t,e,i){const s=Mt("#logList"),r=document.createElement("div");for(r.className=`entry s${n} ${e}`,r.innerHTML=t,ke&&(ke.reach(i),r.dataset.at=i),s.prepend(r);s.children.length>80;)s.lastChild.remove()}const Xu=["M","WS","BS","S","T","W","A","Ld","Sv","OC"];let wr=null;function Ci(n){var l;const t=Mt("#card");if(wr=n,!n){t.classList.remove("show");return}const e=n.t,i=h=>h==="M"?`${e.M}"`:["WS","BS","Sv"].includes(h)?`${e[h]}+`:e[h],s=(h,u)=>{if(!h)return"";if(h.mesmerize)return`<div class="wpn"><span>${u} ${h.name}</span><em>spell ${h.spell}+ · ${h.range}" · D3 mortal + mesmerize</em></div>`;const d=[];return h.range&&d.push(`${h.range}"`),h.spell&&d.push(`spell ${h.spell}+`),h.blast?d.push(`blast ${h.blast}" ×${h.shots}`):h.shots&&d.push(`A${h.shots}`),d.push(`S${h.S}`,`AP-${h.AP}`,`D${h.D}`),h.poison&&d.push(`poison ${h.poison}+`),h.indirect&&d.push("indirect"),h.heavy&&d.push("heavy"),h.assault&&d.push("assault"),`<div class="wpn"><span>${u} ${h.name}</span><em>${d.join(" · ")}</em></div>`},r=un(n),o=ye.idle,a=[];o&&n.flags.moved&&a.push(n.flags.fellBack?"fell back":n.flags.advanced?`advanced +${n.flags.advRoll}"`:"moved"),o&&n.flags.shot&&a.push("shot"),o&&n.flags.charged&&a.push("charged"),r.mesmerized&&a.push("🌀 mesmerized"),r.alive>0&&r.engaged&&a.push("⚔ in combat"),o&&r.alive>0&&Gy(si(),n)&&a.push("🛡 in cover");const c=e.models>1?`${r.alive}/${e.models} models`:`${r.models[0].w}/${e.W} wounds`;t.innerHTML=`
    <div class="card-head s${n.side}"><b>${e.name}</b><span>${pe[n.side].short} · ${e.role}</span></div>
    <div class="card-sub">${r.alive>0?c:"destroyed"}${a.length?" · "+a.join(" · "):""}</div>
    <table class="stats"><tr>${Xu.map(h=>`<th>${h}</th>`).join("")}</tr><tr>${Xu.map(h=>`<td>${i(h)}</td>`).join("")}</tr></table>
    ${s(e.ranged,(l=e.ranged)!=null&&l.spell?"✦":"➹")}${s({...e.melee,range:0},"⚔")}
    <ul class="abil">${(e.abilities||[]).map(h=>`<li>${h}</li>`).join("")}</ul>`,t.classList.add("show")}function qn(){var p;const n=ye.mirror,e=si().setup.rounds;Mt("#vp0").textContent=n.vp[0],Mt("#vp1").textContent=n.vp[1],Mt("#round").textContent=n.stage==="deploy"?"Deployment":`Round ${Math.min(n.round,e)} / ${e}`,document.querySelectorAll("#phases .ph").forEach(f=>{f.classList.toggle("on",n.stage==="battle"&&f.dataset.k===n.phase)}),Mt("#sideA").classList.toggle("active",n.stage==="battle"&&n.active===0),Mt("#sideB").classList.toggle("active",n.stage==="battle"&&n.active===1);const i=ye.idle,s=fa(),r=vt.sel,o=(s==null?void 0:s.k)==="deploy",a=js&&(s==null?void 0:s.k)==="phase"&&n.stage==="battle"&&n.active===s.seats[0]&&n.phase===s.phase&&n.round===he.turn.round,c=js&&(s==null?void 0:s.k)==="chargeEnd"&&n.stage==="battle"&&n.active===s.seats[0]&&n.phase==="charge"&&n.round===he.turn.round,l=fi(),h=Mt("#endPhase"),u=Mt("#autoPhase"),d=Mt("#advance");!a&&!c?Oo=!1:i&&(Oo=!0);const m=Oo&&!l;h.style.display=o||m?"":"none",u.style.display=m?"":"none",Mt("#closestSpot").style.display=l?"":"none",o?h.textContent="Begin battle ▸":a&&(h.textContent=`End ${Id[s.phase]} ▸`),h.disabled=u.disabled=d.disabled=!i,a?i&&(d.style.display=s.phase==="move"&&r&&!r.flags.moved&&!r.flags.advanced&&!$n((f,v)=>v.isEngaged(f,r))?"":"none"):d.style.display="none",r&&(d.textContent=`Advance (+D6") — no ${(p=r.t.ranged)!=null&&p.assault?"charge":"shooting or charge"} after`,r.t.chargeAfterAdvance&&(d.textContent='Advance (+D6") — can still charge'));const g=Di();for(const f of[0,1])ll[f].opacity=n.stage==="battle"||n.stage==="over"?.05:f===g?.2:.07;let _=Mt("#hint").textContent;l?_=`Charge! Rolled ${l.rolled}" — click the orange area to place ${l.u.t.short}, or take the shortest move.`:o?_="Deployment — click one of your units, then click inside your shaded zone to move it there.":he&&js&&n.stage==="battle"&&!rb(n.active)?_=`${pe[n.active].name} (AI) are taking their turn…`:a&&(i||!r)?_={move:r?$n((f,v)=>v.isEngaged(f,r))?"Engaged — click inside the red area to fall back (no shooting or charging after).":"Click inside the shaded area to move. Difficult ground costs double.":"Movement — pick a unit with a white ring to move it.",shoot:r?"Click an enemy unit to shoot it. Hover for odds.":"Shooting — pick a unit with a white ring to fire.",charge:r?'Click an enemy within 12" to declare a charge, then roll 2D6.':"Charge — pick a unit to charge with."}[s.phase]||"":a||(_=""),Mt("#hint").textContent=_,Mt("#hint").style.display=_?"":"none",dl()}function dl(){const n=zi(),t=Di(),e=fi(),i=vt.sel,s=n?$n((r,o)=>{const a=o.phaseKey(r),c=new Map;for(const l of r.units)!o.alive(l)||l===i||(o.canAct(r,l)?c.set(l.id,["#ffffff",.75]):i&&a==="shoot"&&l.side!==i.side&&o.shotInfo(r,i,l).ok?c.set(l.id,["#ff5a4a",.95]):i&&a==="charge"&&l.side!==i.side&&o.chargeTargets(r,i).includes(l)&&c.set(l.id,["#ffa040",.95]));return c}):new Map;for(const r of _e.values()){const o=r.u;if(!(un(o).alive>0))continue;const a=r.ring.material;let c=0,l="#ffffff";o===i?(c=1,l="#ffe680"):t>=0&&o.side===t?c=.5:e&&o===e.tg?(c=.95,l="#ffa040"):s.has(o.id)?[l,c]=s.get(o.id):o===vt.hover&&(c=.35),a.opacity=c,a.color.set(l)}}async function $d(n,t,e=-1){const i=Mt("#banner");i.innerHTML=`<div class="b1">${n}</div><div class="b2">${t}</div>`,i.querySelector(".b1").style.color=Ld(e),i.classList.remove("show"),i.offsetWidth,i.classList.add("show");const s=ye.mirror;await Gn(Br.phaseStart(Dd(s.active),s.stage))}Mt("#endPhase").onclick=()=>{if(ua(),Ne.click(),Di()>=0){const n=hi(Di(),{t:"deployed"});return n||(vt.sel=null,Ci(null),qn()),n}return zi()?(Xn(null),hi(ui(),{t:"end"})):"no phase of a seat played here to end now"};Mt("#closestSpot").onclick=()=>(Ne.click(),Ib());Mt("#autoPhase").onclick=()=>zi()?(Xn(null),hi(ui(),{t:"auto"})):"no phase of a seat played here to play out now";Mt("#advance").onclick=()=>{const n=vt.sel;return!n||!zi()?"no unit of a seat played here to advance now":zd(n)};const lc=[1,2,4];Mt("#speed").onclick=()=>{gn.speed=lc[(lc.indexOf(gn.speed)+1)%lc.length],Mt("#speed").textContent=`⏩ ${gn.speed}×`};Mt("#follow").onclick=()=>{vt.follow=!vt.follow,Mt("#follow").classList.toggle("off",!vt.follow)};Mt("#mute").textContent=Oy()?"🔇":"🔊";Mt("#mute").onclick=()=>{ua(),Mt("#mute").textContent=zy()?"🔇":"🔊"};Mt("#helpBtn").onclick=()=>Mt("#help").classList.remove("hidden");Mt("#helpClose").onclick=()=>Mt("#help").classList.add("hidden");Mt("#logToggle").onclick=()=>Mt("#log").classList.toggle("collapsed");Mt("#seed").value=vt.seed;Mt("#reroll").onclick=()=>{vt.seed=Math.random()*1e6|0,Mt("#seed").value=vt.seed,ns(vt.seed)};Mt("#seed").onchange=()=>{const n=(Number(Mt("#seed").value)||1)>>>0;ns(n),vt.seed=n,Mt("#seed").value=n};document.querySelectorAll("[data-mode]").forEach(n=>{n.onclick=()=>{ua(),Ne.click(),pl(n.dataset.mode)}});Mt("#again").onclick=()=>{Mt("#over").classList.add("hidden"),Mt("#title").classList.remove("hidden"),document.body.classList.remove("playing"),vt.titleSpin=!0,vt.titleAngle-=gn.time*.035,vt.viewShift=1,ns(vt.seed)};const Nn=new Set;addEventListener("keydown",n=>{n.target.tagName!=="INPUT"&&(Nn.add(n.key.toLowerCase()),n.key==="Escape"&&!fi()&&Xn(null))});addEventListener("keyup",n=>Nn.delete(n.key.toLowerCase()));function Hb(n){const t=new C,e=new C().subVectors(Ve.target,de.position).setY(0).normalize(),i=new C(-e.z,0,e.x);(Nn.has("w")||Nn.has("arrowup"))&&t.add(e),(Nn.has("s")||Nn.has("arrowdown"))&&t.sub(e),(Nn.has("d")||Nn.has("arrowright"))&&t.add(i),(Nn.has("a")||Nn.has("arrowleft"))&&t.sub(i),t.lengthSq()&&(t.normalize().multiplyScalar(n*18),Ve.target.add(t),de.position.add(t))}function ns(n,{terrain:t="classic",races:e=hl}={}){const i=_d({board:n,dice:0,terrain:t,seats:e.map(s=>({race:s,ctrl:"human"}))},{out:[]});ge==null||ge.close(),ge=null,he=null,ts=i,ul=!0,Rd(fl(e)),ab(),vt.sel=null,vt.reach=null,Ko=null,js=!1,Oo=!1,pa(),Mt("#logList").innerHTML="",Mt("#tray").classList.remove("show"),ye.reset({...Ac(i),stage:"title"}),ye.push(i.out.splice(0).filter(s=>/^terrain\./.test(s.t))),nb();for(const s of i.units)ob(s,i);for(const s of i.units)Gr(s);for(const s of Ad)Xd(s,-1);ee.clearDecals(),Fn==null||Fn.userData.remove(),Fn=null;for(const s of $r.values())for(const r of s)re.remove(r);$r.clear(),qn()}const hc={bushtail:["human","ai"],serpent:["ai","human"],hotseat:["human","human"],watch:["ai","ai"]},Zo=n=>{const t=gd(n);return{board:t.board,terrain:t.terrain,races:t.seats.map(e=>e.race)}},Vb=(n,t)=>JSON.stringify(Zo(n))===JSON.stringify(Zo(t));function pl(n){if(!Object.hasOwn(hc,n))throw new Error(`no mode "${n}" (there are ${Object.keys(hc).join(", ")})`);const t=hc[n];ge&&ns(vt.seed);const e=(Number(Ln.get("dice"))||Math.random()*1e9|0)>>>0,i={board:vt.seed,dice:e,terrain:"classic",rounds:ar.classic.rounds,diceMode:"shared",seats:hl.map((c,l)=>({race:c,ctrl:t[l]}))};(!ul||!Vb(ts.setup,i))&&ns(i.board,Zo(i)),vt.control=[...t],vt.sel=null,vt.reach=null,Rd(fl(i.seats.map(c=>c.race))),ke==null||ke.begin(),ye.reset(structuredClone(ye.mirror)),Yo=!0;const s=new uy;if(ge=new hy({store:s,localSeats:t.flatMap((c,l)=>c==="human"?[l]:[]),sink:hb,onTrace:sb}),s.append({s:-1,t:"start",setup:i}),ge.status==="refused"){const c=ge.error;throw ge.close(),ge=null,Yo=!1,ns(ts.setup.board,Zo(ts.setup)),new Error(`the battle could not start: ${c}`)}Mt("#title").classList.add("hidden"),document.body.classList.add("playing"),vt.titleSpin=!1;const r=de.position.clone(),o=Ve.target.clone(),a=Xb();innerWidth<700&&Mt("#log").classList.add("collapsed"),De(1.4,c=>{vt.viewShift=1-c,de.position.lerpVectors(r,a.pos,c),Ve.target.lerpVectors(o,a.target,c)},ol),qn()}const Wb=new Rx,Lo=new C;vt.titleSpin=!0;vt.titleAngle=-1.02;vt.viewShift=1;function Gb(n,t){const e=ye.mirror;for(const i of _e.values()){const s=i.u,r=e.units[s.id],o=i.at??r.pos;for(const[a,c]of r.models.entries()){const l=i.models[a];if(!c.alive&&!l.dying)continue;const h=l.mesh.userData.anim;if(c.alive){const m=o.x+c.ox,g=o.z+c.oz,_=1-Math.exp(-n*(i.moving?16:7)),p=l.x,f=l.z;l.x+=(m-l.x)*_,l.z+=(g-l.z)*_;const v=Math.hypot(l.x-p,l.z-f)/Math.max(n,1e-4),x=v>.6?Math.atan2(l.x-p,l.z-f):l.look??i.facing;l.yaw+=my(x-l.yaw)*(1-Math.exp(-n*8)),l.moving=v>.6;let M=0,R=0;if(l.lunge>0){l.lunge=Math.max(0,l.lunge-n*2.5);const E=Math.sin((1-l.lunge)*Math.PI)*.35;M=Math.sin(l.lungeDir)*E,R=Math.cos(l.lungeDir)*E}l.mesh.position.set(l.x+M,l.lift||0,l.z+R),l.mesh.rotation.y=l.yaw}if(!h||!c.alive)continue;const u=t+l.mesh.userData.phase,d=l.mesh.userData.fig;if(h.kind==="squirrel"){const m=l.moving?Math.abs(Math.sin(u*13))*.16:0;d.position.y=d.userData.y0+m,d.scale.y=1+(l.moving?0:Math.sin(u*2.4)*.018),d.rotation.x=l.moving?.12:0}else if(h.kind==="naga")d.rotation.z=Math.sin(u*(l.moving?9:1.4))*(l.moving?.12:.035),d.scale.y=1+Math.sin(u*1.4)*.015;else if(h.kind==="machine"&&l.moving)for(const m of h.wheels)m.rotation.x+=n*6;h.gem&&(h.gem.rotation.y=u*2),l.flash>0&&(l.flash-=n,d.position.x=Math.sin(t*60)*.04*(l.flash>0?1:0))}if(r.alive>0&&!Dc){Lo.set(o.x,s.t.big?2.7:s.t.fly?2.3:1.7,o.z).project(de);const a=Lo.z<1;i.label.style.transform=`translate(${(Lo.x*.5+.5)*innerWidth}px, ${(-Lo.y*.5+.5)*innerHeight}px) translate(-50%, -100%)`,i.label.style.visibility=a&&e.stage!=="title"?"visible":"hidden",i.label.classList.toggle("sel",s===vt.sel)}}}function Xd(n,t){n.owner=t,n.flagMat.color.set(t<0?"#e8e0d0":pe[t].color),n.ring.material.color.set(t<0?"#fff3c0":pe[t].color)}function $b(n,t){const e=ye.mirror.owners;for(const i of Ad){const s=e[i.i];s!==i.owner&&Xd(i,s),i.gem.rotation.y=t*1.2,i.gem.position.y=.45+Math.sin(t*2+i.i)*.05,i.flag.rotation.y=Math.sin(t*2.2+i.i)*.25,i.ring.material.opacity=.3+Math.sin(t*2+i.i)*.08}}const Dc=Ln.has("fast");function jd(){var r;requestAnimationFrame(jd),Dc&&(gn.speed=1e4);const n=Math.min(Wb.getDelta(),.05),t=n*gn.speed;if(gn.time+=t,_y(t),ee.update(t),Gb(t,gn.time),$b(t,gn.time),vt.titleSpin){const o=vt.titleAngle+gn.time*.035;de.position.set(-5+Math.sin(o)*25,13,Math.cos(o)*25),Ve.target.set(-5,0,0)}const e=innerWidth>900?vt.viewShift:0;e>.001?de.setViewOffset(innerWidth,innerHeight,-innerWidth*.21*e,0,innerWidth,innerHeight):(r=de.view)!=null&&r.enabled&&de.clearViewOffset(),Hb(n),Ve.update();const i=ee.shake,s=new C((Math.random()-.5)*i,(Math.random()-.5)*i,(Math.random()-.5)*i);de.position.add(s),Dc||Ke.render(re,de),de.position.sub(s)}function Xb(){return innerWidth>=innerHeight?{pos:new C(0,30,31),target:new C(0,0,1.5)}:{pos:new C(-36,46,0),target:new C(-1,0,0)}}function qd(){de.fov=innerWidth>=innerHeight?40:56,de.aspect=innerWidth/innerHeight,de.updateProjectionMatrix()}qd();addEventListener("resize",()=>{qd(),de.aspect=innerWidth/innerHeight,de.updateProjectionMatrix(),Ke.setSize(innerWidth,innerHeight)});ns(vt.seed);jd();Ln.has("watch")&&pl("watch");if(Ln.has("debug")){const n=new Set(["stage","round","active","first","phase","vp","wiped"]),t={busy:()=>!ye.idle,auto:()=>!ye.idle,deploySide:()=>Di()<0?void 0:Di()},e=[],i=[];let s=null;const r=()=>ye.idle&&!i.length,o=p=>{if(s)return s.turn[p];const f=si(),v=f.turn;return p==="stage"?he?v.stage==="over"&&!r()?"battle":v.stage:"title":p==="wiped"?v.wiped<0?void 0:v.wiped:p==="phase"?Hr(f):v[p]},a=new Proxy(vt,{get:(p,f)=>n.has(f)?o(f):Object.hasOwn(t,f)?t[f]():p[f],has:(p,f)=>n.has(f)||Object.hasOwn(t,f)||f in p,set:(p,f,v)=>{if(n.has(f))throw new Error(`__ts.S.${f} is the match's ${f==="phase"?"G.turn.ph (phaseKey)":`G.turn.${f}`}: it can't be set through S`);if(Object.hasOwn(t,f))throw new Error(`__ts.S.${f} is derived from the Session and the player: it can't be set`);return p[f]=v,!0},ownKeys:p=>[...new Set([...Reflect.ownKeys(p),...n,...Object.keys(t)])],getOwnPropertyDescriptor:(p,f)=>n.has(f)?{value:o(f),enumerable:!0,configurable:!0,writable:!1}:Object.hasOwn(t,f)?{value:t[f](),enumerable:!0,configurable:!0,writable:!1}:Reflect.getOwnPropertyDescriptor(p,f)}),c=p=>{var f;return!!((f=p.out)!=null&&f.length)||!ye.idle},l=(p,f)=>{const v=p.turn,x=/^over /.test(f)&&v.step==="score";return{turn:{stage:v.stage,round:x?v.round+1:v.round,active:v.active,phase:Hr(p),first:v.first,vp:[...v.vp],wiped:v.wiped<0?void 0:v.wiped},rng:Hu(p.rng),units:p.units.map(M=>({...M,pos:{...M.pos},flags:{...M.flags},models:M.models.map(R=>({...R}))})),chunks:p.terrain.chunks.map(M=>({id:M.id,kind:M.kind,alive:M.alive,hp:M.hp,shape:{...M.shape}}))}},h=(p,f)=>{s=f;try{e.push(p)}finally{s=null}},u=[],d=[],m=(p=()=>!0)=>new Promise(f=>{d.push({until:p,resolve:f}),ke.settled()});ke={begin:()=>{e.length=0,i.length=0,u.length=0;for(const p of d.splice(0))p.resolve()},line:(p,f)=>{const v=/^log /.test(p)?null:l(f,p);/^(act|phase|over) /.test(p)&&u.push({at:f.out.length,proj:Ac(f),act:/^act /.test(p)}),i.length||c(f)?i.push([p,v]):h(p,v)},reach:p=>{for(;e.length<p&&i.length;)h(...i.shift())},idle:()=>{for(;i.length;)h(...i.shift())},settled:()=>{if(ye.idle)for(const p of d.splice(0)){let f=!0;try{f=p.until()}catch{}f?p.resolve():d.push(p)}},present:(p,f)=>{const v=[],x=u.filter(R=>R.act).map(R=>R.proj);let M=0;for(p.forEach((R,E)=>{for(;M<u.length&&u[M].at<=E;)v.push({t:"check",proj:u[M++].proj});v.push(R.t==="act"?{...R,proj:x.shift()}:R)});M<u.length;)v.push({t:"check",proj:u[M++].proj});return v.push({t:"check",proj:Ac(f)}),u.length=0,v}};const g=(p,f)=>{if(p)throw new Error(`?debug ${f}: ${p}`)},_=p=>vd(si(),p);window.__ts={S:a,clock:gn,camera:de,controls:Ve,renderer:Ke,trace:e,get G(){return he},get session(){return ge},get player(){return ye},present:{listen(p){ye.observer=p},card(p){var f;return Ci(p),((f=/class="card-sub">([^<]*)</.exec(Mt("#card").innerHTML))==null?void 0:f[1])??null}},get units(){return s?s.units:si().units},get nav(){return si().nav},scenery:{get chunks(){return s?s.chunks:si().terrain.chunks},scene:re,blast(p,f,v,x,M){if(he)throw new Error("?debug scenery.blast: only on the title screen (no battle)");const R=[],E=ts.terrain.blast(p,f,v,x,M,R);return ul=!1,ye.push(R),us(ts),E}},validEnd:(p,f)=>_(v=>jy(v,p,f)),get phaseResolve(){return zi()||null},get chargePick(){const p=fi();return p&&{u:p.u,plan:p.plan,ok:p.ok}},start:pl,select:Xn,doMove:(p,f)=>(g(Nd(p,f),"doMove"),m()),doAdvance:p=>(g(zd(p),"doAdvance"),m()),doShoot:(p,f)=>(g(Od(p,f),"doShoot"),m()),doCharge:(p,f)=>{g(Fd(p,f),"doCharge");const v=ge;return m(()=>{var x;return v!==ge||((x=v.G.pending)==null?void 0:x.k)!=="chargeEnd"})},placeCharge:p=>(g(kd(p),"placeCharge"),m()),deployClick:(p,f)=>g(Vd(p,f),"deployClick"),endPhase:()=>(g(Mt("#endPhase").onclick(),"endPhase"),m()),autoPhase:()=>(g(Mt("#autoPhase").onclick(),"autoPhase"),m()),q:{alive:By,isEngaged:p=>_(f=>Hy(f,p)),canAct:p=>_(f=>$y(f,p)),movePlan:(p,f)=>_(v=>Xy(v,p,f)),freeSpot:(p,f,v,x,M)=>_(R=>qy(R,p,f,v,x,M)),shootTargets:p=>_(f=>Ky(f,p)),shotInfo:(p,f)=>_(v=>Yy(v,p,f)),chargeTargets:p=>_(f=>Jy(f,p)),chargePlan:(p,f)=>_(v=>Zy(v,p,f)),rngState:()=>s?s.rng:Hu(si().rng)},screen(p,f,v){const x=new C(p,f,v).project(de);return[(x.x*.5+.5)*innerWidth,(-x.y*.5+.5)*innerHeight]}}}
