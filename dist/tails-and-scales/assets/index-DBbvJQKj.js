(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Tc="160",Bn={ROTATE:0,DOLLY:1,PAN:2},Wi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Wd=0,ol=1,Gd=2,qu=1,Yu=2,Fn=3,fi=0,qe=1,en=2,ri=0,ms=1,al=2,cl=3,ll=4,$d=5,wi=100,jd=101,Xd=102,hl=103,ul=104,qd=200,Yd=201,Kd=202,Jd=203,tc=204,ec=205,Zd=206,Qd=207,tp=208,ep=209,np=210,ip=211,sp=212,rp=213,op=214,ap=0,cp=1,lp=2,_o=3,hp=4,up=5,fp=6,dp=7,Ac=0,pp=1,mp=2,oi=0,gp=1,vp=2,xp=3,Ku=4,_p=5,yp=6,Ju=300,bs=301,Ss=302,nc=303,ic=304,Lo=306,yo=1e3,vn=1001,sc=1002,De=1003,fl=1004,Zo=1005,Xe=1006,Mp=1007,lr=1008,ai=1009,bp=1010,Sp=1011,Rc=1012,Zu=1013,ni=1014,ii=1015,hr=1016,Qu=1017,tf=1018,Ri=1020,wp=1021,an=1023,Ep=1024,Tp=1025,Ci=1026,ws=1027,Ap=1028,ef=1029,Rp=1030,nf=1031,sf=1033,Qo=33776,ta=33777,ea=33778,na=33779,dl=35840,pl=35841,ml=35842,gl=35843,rf=36196,vl=37492,xl=37496,_l=37808,yl=37809,Ml=37810,bl=37811,Sl=37812,wl=37813,El=37814,Tl=37815,Al=37816,Rl=37817,Cl=37818,Pl=37819,Ll=37820,Dl=37821,ia=36492,Il=36494,Ul=36495,Cp=36283,Nl=36284,Ol=36285,zl=36286,of=3e3,Pi=3001,Pp=3200,Lp=3201,Cc=0,Dp=1,cn="",be="srgb",jn="srgb-linear",Pc="display-p3",Do="display-p3-linear",Mo="linear",ce="srgb",bo="rec709",So="p3",Gi=7680,Fl=519,Ip=512,Up=513,Np=514,af=515,Op=516,zp=517,Fp=518,kp=519,kl=35044,Bp=35048,Bl="300 es",rc=1035,Wn=2e3,wo=2001;class Fi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],co=Math.PI/180,oc=180/Math.PI;function gr(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ne[i&255]+Ne[i>>8&255]+Ne[i>>16&255]+Ne[i>>24&255]+"-"+Ne[t&255]+Ne[t>>8&255]+"-"+Ne[t>>16&15|64]+Ne[t>>24&255]+"-"+Ne[e&63|128]+Ne[e>>8&255]+"-"+Ne[e>>16&255]+Ne[e>>24&255]+Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]).toLowerCase()}function Ce(i,t,e){return Math.max(t,Math.min(e,i))}function Hp(i,t){return(i%t+t)%t}function sa(i,t,e){return(1-e)*i+e*t}function Hl(i){return(i&i-1)===0&&i!==0}function ac(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Hs(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function je(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Vp={DEG2RAD:co};class mt{constructor(t=0,e=0){mt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jt{constructor(t,e,n,s,r,o,a,c,l){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=s[0],m=s[3],p=s[6],x=s[1],y=s[4],_=s[7],R=s[2],S=s[5],E=s[8];return r[0]=o*v+a*x+c*R,r[3]=o*m+a*y+c*S,r[6]=o*p+a*_+c*E,r[1]=l*v+h*x+u*R,r[4]=l*m+h*y+u*S,r[7]=l*p+h*_+u*E,r[2]=d*v+f*x+g*R,r[5]=d*m+f*y+g*S,r[8]=d*p+f*_+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*l-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=d*v,t[4]=(h*e-s*c)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ra.makeScale(t,e)),this}rotate(t){return this.premultiply(ra.makeRotation(-t)),this}translate(t,e){return this.premultiply(ra.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ra=new Jt;function cf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Eo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Wp(){const i=Eo("canvas");return i.style.display="block",i}const Vl={};function tr(i){i in Vl||(Vl[i]=!0,console.warn(i))}const Wl=new Jt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Gl=new Jt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Tr={[jn]:{transfer:Mo,primaries:bo,toReference:i=>i,fromReference:i=>i},[be]:{transfer:ce,primaries:bo,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Do]:{transfer:Mo,primaries:So,toReference:i=>i.applyMatrix3(Gl),fromReference:i=>i.applyMatrix3(Wl)},[Pc]:{transfer:ce,primaries:So,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Gl),fromReference:i=>i.applyMatrix3(Wl).convertLinearToSRGB()}},Gp=new Set([jn,Do]),ae={enabled:!0,_workingColorSpace:jn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Gp.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Tr[t].toReference,s=Tr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Tr[i].primaries},getTransfer:function(i){return i===cn?Mo:Tr[i].transfer}};function gs(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function oa(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let $i;class lf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{$i===void 0&&($i=Eo("canvas")),$i.width=t.width,$i.height=t.height;const n=$i.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=$i}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Eo("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=gs(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(gs(e[n]/255)*255):e[n]=gs(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let $p=0;class hf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$p++}),this.uuid=gr(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(aa(s[o].image)):r.push(aa(s[o]))}else r=aa(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function aa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?lf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let jp=0;class We extends Fi{constructor(t=We.DEFAULT_IMAGE,e=We.DEFAULT_MAPPING,n=vn,s=vn,r=Xe,o=lr,a=an,c=ai,l=We.DEFAULT_ANISOTROPY,h=cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jp++}),this.uuid=gr(),this.name="",this.source=new hf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new mt(0,0),this.repeat=new mt(1,1),this.center=new mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(tr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Pi?be:cn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ju)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case yo:t.x=t.x-Math.floor(t.x);break;case vn:t.x=t.x<0?0:1;break;case sc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case yo:t.y=t.y-Math.floor(t.y);break;case vn:t.y=t.y<0?0:1;break;case sc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return tr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===be?Pi:of}set encoding(t){tr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Pi?be:cn}}We.DEFAULT_IMAGE=null;We.DEFAULT_MAPPING=Ju;We.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,s=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(l+1)/2,_=(f+1)/2,R=(p+1)/2,S=(h+d)/4,E=(u+v)/4,N=(g+m)/4;return y>_&&y>R?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=S/n,r=E/n):_>R?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=S/s,r=N/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=E/r,s=N/r),this.set(n,s,r,e),this}let x=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-v)/x,this.z=(d-h)/x,this.w=Math.acos((l+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Xp extends Fi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(tr("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Pi?be:cn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xe,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new We(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new hf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ii extends Xp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class uf extends We{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=De,this.minFilter=De,this.wrapR=vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qp extends We{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=De,this.minFilter=De,this.wrapR=vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Tn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const d=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==d||l!==f||h!==g){let m=1-a;const p=c*d+l*f+h*g+u*v,x=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const R=Math.sqrt(y),S=Math.atan2(R,p*x);m=Math.sin(m*S)/R,a=Math.sin(a*S)/R}const _=a*x;if(c=c*m+d*_,l=l*m+f*_,h=h*m+g*_,u=u*m+v*_,m===1-a){const R=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=R,l*=R,h*=R,u*=R}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-a*f,t[e+2]=l*g+h*f+a*d-c*u,t[e+3]=h*g-a*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),d=c(n/2),f=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ce(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion($l.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion($l.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ca.copy(this).projectOnVector(t),this.sub(ca)}reflect(t){return this.sub(ca.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ca=new C,$l=new Tn;class ki{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(fn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(fn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=fn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,fn):fn.fromBufferAttribute(r,o),fn.applyMatrix4(t.matrixWorld),this.expandByPoint(fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ar.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ar.copy(n.boundingBox)),Ar.applyMatrix4(t.matrixWorld),this.union(Ar)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,fn),fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Vs),Rr.subVectors(this.max,Vs),ji.subVectors(t.a,Vs),Xi.subVectors(t.b,Vs),qi.subVectors(t.c,Vs),qn.subVectors(Xi,ji),Yn.subVectors(qi,Xi),gi.subVectors(ji,qi);let e=[0,-qn.z,qn.y,0,-Yn.z,Yn.y,0,-gi.z,gi.y,qn.z,0,-qn.x,Yn.z,0,-Yn.x,gi.z,0,-gi.x,-qn.y,qn.x,0,-Yn.y,Yn.x,0,-gi.y,gi.x,0];return!la(e,ji,Xi,qi,Rr)||(e=[1,0,0,0,1,0,0,0,1],!la(e,ji,Xi,qi,Rr))?!1:(Cr.crossVectors(qn,Yn),e=[Cr.x,Cr.y,Cr.z],la(e,ji,Xi,qi,Rr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(In[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),In[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),In[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),In[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),In[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),In[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),In[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),In[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(In),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const In=[new C,new C,new C,new C,new C,new C,new C,new C],fn=new C,Ar=new ki,ji=new C,Xi=new C,qi=new C,qn=new C,Yn=new C,gi=new C,Vs=new C,Rr=new C,Cr=new C,vi=new C;function la(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){vi.fromArray(i,r);const a=s.x*Math.abs(vi.x)+s.y*Math.abs(vi.y)+s.z*Math.abs(vi.z),c=t.dot(vi),l=e.dot(vi),h=n.dot(vi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Yp=new ki,Ws=new C,ha=new C;class Us{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Yp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ws.subVectors(t,this.center);const e=Ws.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ws,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ha.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ws.copy(t.center).add(ha)),this.expandByPoint(Ws.copy(t.center).sub(ha))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Un=new C,ua=new C,Pr=new C,Kn=new C,fa=new C,Lr=new C,da=new C;class Io{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Un.copy(this.origin).addScaledVector(this.direction,e),Un.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ua.copy(t).add(e).multiplyScalar(.5),Pr.copy(e).sub(t).normalize(),Kn.copy(this.origin).sub(ua);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Pr),a=Kn.dot(this.direction),c=-Kn.dot(Pr),l=Kn.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ua).addScaledVector(Pr,d),f}intersectSphere(t,e){Un.subVectors(t.center,this.origin);const n=Un.dot(this.direction),s=Un.dot(Un)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Un)!==null}intersectTriangle(t,e,n,s,r){fa.subVectors(e,t),Lr.subVectors(n,t),da.crossVectors(fa,Lr);let o=this.direction.dot(da),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Kn.subVectors(this.origin,t);const c=a*this.direction.dot(Lr.crossVectors(Kn,Lr));if(c<0)return null;const l=a*this.direction.dot(fa.cross(Kn));if(l<0||c+l>o)return null;const h=-a*Kn.dot(da);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class se{constructor(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m){se.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m)}set(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new se().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Yi.setFromMatrixColumn(t,0).length(),r=1/Yi.setFromMatrixColumn(t,1).length(),o=1/Yi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-v*l,e[9]=-a*c,e[2]=v-d*l,e[6]=g+f*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d+v*a,e[4]=g*a-f,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=v+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d-v*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=v-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=f*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,f=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=o*c,f=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Kp,t,Jp)}lookAt(t,e,n){const s=this.elements;return Ze.subVectors(t,e),Ze.lengthSq()===0&&(Ze.z=1),Ze.normalize(),Jn.crossVectors(n,Ze),Jn.lengthSq()===0&&(Math.abs(n.z)===1?Ze.x+=1e-4:Ze.z+=1e-4,Ze.normalize(),Jn.crossVectors(n,Ze)),Jn.normalize(),Dr.crossVectors(Ze,Jn),s[0]=Jn.x,s[4]=Dr.x,s[8]=Ze.x,s[1]=Jn.y,s[5]=Dr.y,s[9]=Ze.y,s[2]=Jn.z,s[6]=Dr.z,s[10]=Ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],x=n[3],y=n[7],_=n[11],R=n[15],S=s[0],E=s[4],N=s[8],M=s[12],w=s[1],B=s[5],W=s[9],nt=s[13],U=s[2],k=s[6],$=s[10],tt=s[14],q=s[3],Y=s[7],K=s[11],ot=s[15];return r[0]=o*S+a*w+c*U+l*q,r[4]=o*E+a*B+c*k+l*Y,r[8]=o*N+a*W+c*$+l*K,r[12]=o*M+a*nt+c*tt+l*ot,r[1]=h*S+u*w+d*U+f*q,r[5]=h*E+u*B+d*k+f*Y,r[9]=h*N+u*W+d*$+f*K,r[13]=h*M+u*nt+d*tt+f*ot,r[2]=g*S+v*w+m*U+p*q,r[6]=g*E+v*B+m*k+p*Y,r[10]=g*N+v*W+m*$+p*K,r[14]=g*M+v*nt+m*tt+p*ot,r[3]=x*S+y*w+_*U+R*q,r[7]=x*E+y*B+_*k+R*Y,r[11]=x*N+y*W+_*$+R*K,r[15]=x*M+y*nt+_*tt+R*ot,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+r*c*u-s*l*u-r*a*d+n*l*d+s*a*f-n*c*f)+v*(+e*c*f-e*l*d+r*o*d-s*o*f+s*l*h-r*c*h)+m*(+e*l*u-e*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*d+s*o*u-n*o*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],x=u*m*l-v*d*l+v*c*f-a*m*f-u*c*p+a*d*p,y=g*d*l-h*m*l-g*c*f+o*m*f+h*c*p-o*d*p,_=h*v*l-g*u*l+g*a*f-o*v*f-h*a*p+o*u*p,R=g*u*c-h*v*c-g*a*d+o*v*d+h*a*m-o*u*m,S=e*x+n*y+s*_+r*R;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=x*E,t[1]=(v*d*r-u*m*r-v*s*f+n*m*f+u*s*p-n*d*p)*E,t[2]=(a*m*r-v*c*r+v*s*l-n*m*l-a*s*p+n*c*p)*E,t[3]=(u*c*r-a*d*r-u*s*l+n*d*l+a*s*f-n*c*f)*E,t[4]=y*E,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*E,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*p-e*c*p)*E,t[7]=(o*d*r-h*c*r+h*s*l-e*d*l-o*s*f+e*c*f)*E,t[8]=_*E,t[9]=(g*u*r-h*v*r-g*n*f+e*v*f+h*n*p-e*u*p)*E,t[10]=(o*v*r-g*a*r+g*n*l-e*v*l-o*n*p+e*a*p)*E,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*f-e*a*f)*E,t[12]=R*E,t[13]=(h*v*s-g*u*s+g*n*d-e*v*d-h*n*m+e*u*m)*E,t[14]=(g*a*s-o*v*s-g*n*c+e*v*c+o*n*m-e*a*m)*E,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*d+e*a*d)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,g=r*u,v=o*h,m=o*u,p=a*u,x=c*l,y=c*h,_=c*u,R=n.x,S=n.y,E=n.z;return s[0]=(1-(v+p))*R,s[1]=(f+_)*R,s[2]=(g-y)*R,s[3]=0,s[4]=(f-_)*S,s[5]=(1-(d+p))*S,s[6]=(m+x)*S,s[7]=0,s[8]=(g+y)*E,s[9]=(m-x)*E,s[10]=(1-(d+v))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Yi.set(s[0],s[1],s[2]).length();const o=Yi.set(s[4],s[5],s[6]).length(),a=Yi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],dn.copy(this);const l=1/r,h=1/o,u=1/a;return dn.elements[0]*=l,dn.elements[1]*=l,dn.elements[2]*=l,dn.elements[4]*=h,dn.elements[5]*=h,dn.elements[6]*=h,dn.elements[8]*=u,dn.elements[9]*=u,dn.elements[10]*=u,e.setFromRotationMatrix(dn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Wn){const c=this.elements,l=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let f,g;if(a===Wn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===wo)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Wn){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*l,f=(n+s)*h;let g,v;if(a===Wn)g=(o+r)*u,v=-2*u;else if(a===wo)g=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Yi=new C,dn=new se,Kp=new C(0,0,0),Jp=new C(1,1,1),Jn=new C,Dr=new C,Ze=new C,jl=new se,Xl=new Tn;class Ns{constructor(t=0,e=0,n=0,s=Ns.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Ce(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ce(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ce(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ce(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ce(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ce(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return jl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(jl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Xl.setFromEuler(this),this.setFromQuaternion(Xl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ns.DEFAULT_ORDER="XYZ";class Lc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Zp=0;const ql=new C,Ki=new Tn,Nn=new se,Ir=new C,Gs=new C,Qp=new C,tm=new Tn,Yl=new C(1,0,0),Kl=new C(0,1,0),Jl=new C(0,0,1),em={type:"added"},nm={type:"removed"};class Pe extends Fi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zp++}),this.uuid=gr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Pe.DEFAULT_UP.clone();const t=new C,e=new Ns,n=new Tn,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new Jt}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=Pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Lc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ki.setFromAxisAngle(t,e),this.quaternion.multiply(Ki),this}rotateOnWorldAxis(t,e){return Ki.setFromAxisAngle(t,e),this.quaternion.premultiply(Ki),this}rotateX(t){return this.rotateOnAxis(Yl,t)}rotateY(t){return this.rotateOnAxis(Kl,t)}rotateZ(t){return this.rotateOnAxis(Jl,t)}translateOnAxis(t,e){return ql.copy(t).applyQuaternion(this.quaternion),this.position.add(ql.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Yl,t)}translateY(t){return this.translateOnAxis(Kl,t)}translateZ(t){return this.translateOnAxis(Jl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Nn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ir.copy(t):Ir.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Gs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Nn.lookAt(Gs,Ir,this.up):Nn.lookAt(Ir,Gs,this.up),this.quaternion.setFromRotationMatrix(Nn),s&&(Nn.extractRotation(s.matrixWorld),Ki.setFromRotationMatrix(Nn),this.quaternion.premultiply(Ki.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(em)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(nm)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Nn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Nn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Nn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gs,t,Qp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gs,tm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Pe.DEFAULT_UP=new C(0,1,0);Pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pn=new C,On=new C,pa=new C,zn=new C,Ji=new C,Zi=new C,Zl=new C,ma=new C,ga=new C,va=new C;let Ur=!1;class gn{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),pn.subVectors(t,e),s.cross(pn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){pn.subVectors(s,e),On.subVectors(n,e),pa.subVectors(t,e);const o=pn.dot(pn),a=pn.dot(On),c=pn.dot(pa),l=On.dot(On),h=On.dot(pa),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,zn)===null?!1:zn.x>=0&&zn.y>=0&&zn.x+zn.y<=1}static getUV(t,e,n,s,r,o,a,c){return Ur===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ur=!0),this.getInterpolation(t,e,n,s,r,o,a,c)}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,zn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,zn.x),c.addScaledVector(o,zn.y),c.addScaledVector(a,zn.z),c)}static isFrontFacing(t,e,n,s){return pn.subVectors(n,e),On.subVectors(t,e),pn.cross(On).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pn.subVectors(this.c,this.b),On.subVectors(this.a,this.b),pn.cross(On).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return gn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return gn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Ur===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ur=!0),gn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return gn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return gn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return gn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Ji.subVectors(s,n),Zi.subVectors(r,n),ma.subVectors(t,n);const c=Ji.dot(ma),l=Zi.dot(ma);if(c<=0&&l<=0)return e.copy(n);ga.subVectors(t,s);const h=Ji.dot(ga),u=Zi.dot(ga);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Ji,o);va.subVectors(t,r);const f=Ji.dot(va),g=Zi.dot(va);if(g>=0&&f<=g)return e.copy(r);const v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(Zi,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Zl.subVectors(r,s),a=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(Zl,a);const p=1/(m+v+d);return o=v*p,a=d*p,e.copy(n).addScaledVector(Ji,o).addScaledVector(Zi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ff={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},Nr={h:0,s:0,l:0};function xa(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ae.workingColorSpace){return this.r=t,this.g=e,this.b=n,ae.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ae.workingColorSpace){if(t=Hp(t,1),e=Ce(e,0,1),n=Ce(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=xa(o,r,t+1/3),this.g=xa(o,r,t),this.b=xa(o,r,t-1/3)}return ae.toWorkingColorSpace(this,s),this}setStyle(t,e=be){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=be){const n=ff[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=gs(t.r),this.g=gs(t.g),this.b=gs(t.b),this}copyLinearToSRGB(t){return this.r=oa(t.r),this.g=oa(t.g),this.b=oa(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=be){return ae.fromWorkingColorSpace(Oe.copy(this),t),Math.round(Ce(Oe.r*255,0,255))*65536+Math.round(Ce(Oe.g*255,0,255))*256+Math.round(Ce(Oe.b*255,0,255))}getHexString(t=be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.fromWorkingColorSpace(Oe.copy(this),e);const n=Oe.r,s=Oe.g,r=Oe.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ae.workingColorSpace){return ae.fromWorkingColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=be){ae.fromWorkingColorSpace(Oe.copy(this),t);const e=Oe.r,n=Oe.g,s=Oe.b;return t!==be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Zn),this.setHSL(Zn.h+t,Zn.s+e,Zn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Zn),t.getHSL(Nr);const n=sa(Zn.h,Nr.h,e),s=sa(Zn.s,Nr.s,e),r=sa(Zn.l,Nr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Oe=new qt;qt.NAMES=ff;let im=0;class Bi extends Fi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:im++}),this.uuid=gr(),this.name="",this.type="Material",this.blending=ms,this.side=fi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tc,this.blendDst=ec,this.blendEquation=wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=_o,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Gi,this.stencilZFail=Gi,this.stencilZPass=Gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ms&&(n.blending=this.blending),this.side!==fi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==tc&&(n.blendSrc=this.blendSrc),this.blendDst!==ec&&(n.blendDst=this.blendDst),this.blendEquation!==wi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_o&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class He extends Bi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ac,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ye=new C,Or=new mt;class sn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=kl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=ii,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Or.fromBufferAttribute(this,e),Or.applyMatrix3(t),this.setXY(e,Or.x,Or.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Hs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=je(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Hs(e,this.array)),e}setX(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Hs(e,this.array)),e}setY(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Hs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Hs(e,this.array)),e}setW(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),n=je(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),n=je(n,this.array),s=je(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),n=je(n,this.array),s=je(s,this.array),r=je(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==kl&&(t.usage=this.usage),t}}class df extends sn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class pf extends sn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ie extends sn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let sm=0;const on=new se,_a=new Pe,Qi=new C,Qe=new ki,$s=new ki,Re=new C;class xe extends Fi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:sm++}),this.uuid=gr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(cf(t)?pf:df)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return on.makeRotationFromQuaternion(t),this.applyMatrix4(on),this}rotateX(t){return on.makeRotationX(t),this.applyMatrix4(on),this}rotateY(t){return on.makeRotationY(t),this.applyMatrix4(on),this}rotateZ(t){return on.makeRotationZ(t),this.applyMatrix4(on),this}translate(t,e,n){return on.makeTranslation(t,e,n),this.applyMatrix4(on),this}scale(t,e,n){return on.makeScale(t,e,n),this.applyMatrix4(on),this}lookAt(t){return _a.lookAt(t),_a.updateMatrix(),this.applyMatrix4(_a.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qi).negate(),this.translate(Qi.x,Qi.y,Qi.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ie(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ki);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,Qe.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,Qe.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(Qe.min),this.boundingBox.expandByPoint(Qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Us);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(Qe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];$s.setFromBufferAttribute(a),this.morphTargetsRelative?(Re.addVectors(Qe.min,$s.min),Qe.expandByPoint(Re),Re.addVectors(Qe.max,$s.max),Qe.expandByPoint(Re)):(Qe.expandByPoint($s.min),Qe.expandByPoint($s.max))}Qe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Re.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Re));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Re.fromBufferAttribute(a,l),c&&(Qi.fromBufferAttribute(t,l),Re.add(Qi)),s=Math.max(s,n.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new sn(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let w=0;w<a;w++)l[w]=new C,h[w]=new C;const u=new C,d=new C,f=new C,g=new mt,v=new mt,m=new mt,p=new C,x=new C;function y(w,B,W){u.fromArray(s,w*3),d.fromArray(s,B*3),f.fromArray(s,W*3),g.fromArray(o,w*2),v.fromArray(o,B*2),m.fromArray(o,W*2),d.sub(u),f.sub(u),v.sub(g),m.sub(g);const nt=1/(v.x*m.y-m.x*v.y);isFinite(nt)&&(p.copy(d).multiplyScalar(m.y).addScaledVector(f,-v.y).multiplyScalar(nt),x.copy(f).multiplyScalar(v.x).addScaledVector(d,-m.x).multiplyScalar(nt),l[w].add(p),l[B].add(p),l[W].add(p),h[w].add(x),h[B].add(x),h[W].add(x))}let _=this.groups;_.length===0&&(_=[{start:0,count:n.length}]);for(let w=0,B=_.length;w<B;++w){const W=_[w],nt=W.start,U=W.count;for(let k=nt,$=nt+U;k<$;k+=3)y(n[k+0],n[k+1],n[k+2])}const R=new C,S=new C,E=new C,N=new C;function M(w){E.fromArray(r,w*3),N.copy(E);const B=l[w];R.copy(B),R.sub(E.multiplyScalar(E.dot(B))).normalize(),S.crossVectors(N,B);const nt=S.dot(h[w])<0?-1:1;c[w*4]=R.x,c[w*4+1]=R.y,c[w*4+2]=R.z,c[w*4+3]=nt}for(let w=0,B=_.length;w<B;++w){const W=_[w],nt=W.start,U=W.count;for(let k=nt,$=nt+U;k<$;k+=3)M(n[k+0]),M(n[k+1]),M(n[k+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new sn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new C,r=new C,o=new C,a=new C,c=new C,l=new C,h=new C,u=new C;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let v=0,m=c.length;v<m;v++){a.isInterleavedBufferAttribute?f=c[v]*a.data.stride+a.offset:f=c[v]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new sn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new xe,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ql=new se,xi=new Io,zr=new Us,th=new C,ts=new C,es=new C,ns=new C,ya=new C,Fr=new C,kr=new mt,Br=new mt,Hr=new mt,eh=new C,nh=new C,ih=new C,Vr=new C,Wr=new C;class Vt extends Pe{constructor(t=new xe,e=new He){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Fr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(ya.fromBufferAttribute(u,t),o?Fr.addScaledVector(ya,h):Fr.addScaledVector(ya.sub(e),h))}e.add(Fr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),zr.copy(n.boundingSphere),zr.applyMatrix4(r),xi.copy(t.ray).recast(t.near),!(zr.containsPoint(xi.origin)===!1&&(xi.intersectSphere(zr,th)===null||xi.origin.distanceToSquared(th)>(t.far-t.near)**2))&&(Ql.copy(r).invert(),xi.copy(t.ray).applyMatrix4(Ql),!(n.boundingBox!==null&&xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,xi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),y=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let _=x,R=y;_<R;_+=3){const S=a.getX(_),E=a.getX(_+1),N=a.getX(_+2);s=Gr(this,p,t,n,l,h,u,S,E,N),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=a.getX(m),y=a.getX(m+1),_=a.getX(m+2);s=Gr(this,o,t,n,l,h,u,x,y,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),y=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let _=x,R=y;_<R;_+=3){const S=_,E=_+1,N=_+2;s=Gr(this,p,t,n,l,h,u,S,E,N),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=m,y=m+1,_=m+2;s=Gr(this,o,t,n,l,h,u,x,y,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function rm(i,t,e,n,s,r,o,a){let c;if(t.side===qe?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===fi,a),c===null)return null;Wr.copy(a),Wr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Wr);return l<e.near||l>e.far?null:{distance:l,point:Wr.clone(),object:i}}function Gr(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,ts),i.getVertexPosition(c,es),i.getVertexPosition(l,ns);const h=rm(i,t,e,n,ts,es,ns,Vr);if(h){s&&(kr.fromBufferAttribute(s,a),Br.fromBufferAttribute(s,c),Hr.fromBufferAttribute(s,l),h.uv=gn.getInterpolation(Vr,ts,es,ns,kr,Br,Hr,new mt)),r&&(kr.fromBufferAttribute(r,a),Br.fromBufferAttribute(r,c),Hr.fromBufferAttribute(r,l),h.uv1=gn.getInterpolation(Vr,ts,es,ns,kr,Br,Hr,new mt),h.uv2=h.uv1),o&&(eh.fromBufferAttribute(o,a),nh.fromBufferAttribute(o,c),ih.fromBufferAttribute(o,l),h.normal=gn.getInterpolation(Vr,ts,es,ns,eh,nh,ih,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new C,materialIndex:0};gn.getNormal(ts,es,ns,u.normal),h.face=u}return h}class An extends xe{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ie(l,3)),this.setAttribute("normal",new ie(h,3)),this.setAttribute("uv",new ie(u,2));function g(v,m,p,x,y,_,R,S,E,N,M){const w=_/E,B=R/N,W=_/2,nt=R/2,U=S/2,k=E+1,$=N+1;let tt=0,q=0;const Y=new C;for(let K=0;K<$;K++){const ot=K*B-nt;for(let at=0;at<k;at++){const j=at*w-W;Y[v]=j*x,Y[m]=ot*y,Y[p]=U,l.push(Y.x,Y.y,Y.z),Y[v]=0,Y[m]=0,Y[p]=S>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(at/E),u.push(1-K/N),tt+=1}}for(let K=0;K<N;K++)for(let ot=0;ot<E;ot++){const at=d+ot+k*K,j=d+ot+k*(K+1),Z=d+(ot+1)+k*(K+1),dt=d+(ot+1)+k*K;c.push(at,j,dt),c.push(j,Z,dt),q+=6}a.addGroup(f,q,M),f+=q,d+=tt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new An(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Es(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Be(i){const t={};for(let e=0;e<i.length;e++){const n=Es(i[e]);for(const s in n)t[s]=n[s]}return t}function om(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function mf(i){return i.getRenderTarget()===null?i.outputColorSpace:ae.workingColorSpace}const am={clone:Es,merge:Be};var cm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ui extends Bi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cm,this.fragmentShader=lm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Es(t.uniforms),this.uniformsGroups=om(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class gf extends Pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=Wn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class tn extends gf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=oc*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(co*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return oc*2*Math.atan(Math.tan(co*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(co*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const is=-90,ss=1;class hm extends Pe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new tn(is,ss,t,e);s.layers=this.layers,this.add(s);const r=new tn(is,ss,t,e);r.layers=this.layers,this.add(r);const o=new tn(is,ss,t,e);o.layers=this.layers,this.add(o);const a=new tn(is,ss,t,e);a.layers=this.layers,this.add(a);const c=new tn(is,ss,t,e);c.layers=this.layers,this.add(c);const l=new tn(is,ss,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===Wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===wo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class vf extends We{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:bs,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class um extends Ii{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(tr("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Pi?be:cn),this.texture=new vf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Xe}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new An(5,5,5),r=new Ui({name:"CubemapFromEquirect",uniforms:Es(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qe,blending:ri});r.uniforms.tEquirect.value=e;const o=new Vt(s,r),a=e.minFilter;return e.minFilter===lr&&(e.minFilter=Xe),new hm(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Ma=new C,fm=new C,dm=new Jt;class ei{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ma.subVectors(n,e).cross(fm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ma),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||dm.getNormalMatrix(t),s=this.coplanarPoint(Ma).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const _i=new Us,$r=new C;class Dc{constructor(t=new ei,e=new ei,n=new ei,s=new ei,r=new ei,o=new ei){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Wn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],v=s[10],m=s[11],p=s[12],x=s[13],y=s[14],_=s[15];if(n[0].setComponents(c-r,d-l,m-f,_-p).normalize(),n[1].setComponents(c+r,d+l,m+f,_+p).normalize(),n[2].setComponents(c+o,d+h,m+g,_+x).normalize(),n[3].setComponents(c-o,d-h,m-g,_-x).normalize(),n[4].setComponents(c-a,d-u,m-v,_-y).normalize(),e===Wn)n[5].setComponents(c+a,d+u,m+v,_+y).normalize();else if(e===wo)n[5].setComponents(a,u,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),_i.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),_i.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(_i)}intersectsSprite(t){return _i.center.set(0,0,0),_i.radius=.7071067811865476,_i.applyMatrix4(t.matrixWorld),this.intersectsSphere(_i)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if($r.x=s.normal.x>0?t.max.x:t.min.x,$r.y=s.normal.y>0?t.max.y:t.min.y,$r.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint($r)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function xf(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function pm(i,t){const e=t.isWebGL2,n=new WeakMap;function s(l,h){const u=l.array,d=l.usage,f=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,d),l.onUploadCallback();let v;if(u instanceof Float32Array)v=i.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)v=i.SHORT;else if(u instanceof Uint32Array)v=i.UNSIGNED_INT;else if(u instanceof Int32Array)v=i.INT;else if(u instanceof Int8Array)v=i.BYTE;else if(u instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:v,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:f}}function r(l,h,u){const d=h.array,f=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,l),f.count===-1&&g.length===0&&i.bufferSubData(u,0,d),g.length!==0){for(let v=0,m=g.length;v<m;v++){const p=g[v];e?i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}f.count!==-1&&(e?i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const d=n.get(l);(!d||d.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:o,remove:a,update:c}}class ci extends xe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,d=e/c,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const x=p*d-o;for(let y=0;y<l;y++){const _=y*u-r;g.push(_,-x,0),v.push(0,0,1),m.push(y/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<a;x++){const y=x+l*p,_=x+l*(p+1),R=x+1+l*(p+1),S=x+1+l*p;f.push(y,_,S),f.push(_,R,S)}this.setIndex(f),this.setAttribute("position",new ie(g,3)),this.setAttribute("normal",new ie(v,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ci(t.width,t.height,t.widthSegments,t.heightSegments)}}var mm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,gm=`#ifdef USE_ALPHAHASH
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
#endif`,vm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,xm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_m=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,ym=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mm=`#ifdef USE_AOMAP
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
#endif`,bm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Sm=`#ifdef USE_BATCHING
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
#endif`,wm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Em=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Tm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Am=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Rm=`#ifdef USE_IRIDESCENCE
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
#endif`,Cm=`#ifdef USE_BUMPMAP
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
#endif`,Pm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Lm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Dm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Im=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Um=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Nm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Om=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,zm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Fm=`#define PI 3.141592653589793
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
} // validated`,km=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Bm=`vec3 transformedNormal = objectNormal;
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
#endif`,Hm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Wm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Gm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$m="gl_FragColor = linearToOutputTexel( gl_FragColor );",jm=`
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
}`,Xm=`#ifdef USE_ENVMAP
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
#endif`,qm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ym=`#ifdef USE_ENVMAP
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
#endif`,Km=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Jm=`#ifdef USE_ENVMAP
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
#endif`,Zm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,t0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,e0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,n0=`#ifdef USE_GRADIENTMAP
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
}`,i0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,s0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,r0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,o0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,a0=`uniform bool receiveShadow;
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
#endif`,c0=`#ifdef USE_ENVMAP
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
#endif`,l0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,h0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,u0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,f0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,d0=`PhysicalMaterial material;
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
#endif`,p0=`struct PhysicalMaterial {
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
}`,m0=`
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
#endif`,g0=`#if defined( RE_IndirectDiffuse )
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
#endif`,v0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,x0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,y0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,M0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,b0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,S0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,w0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,E0=`#if defined( USE_POINTS_UV )
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
#endif`,T0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,A0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,R0=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,C0=`#ifdef USE_MORPHNORMALS
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
#endif`,P0=`#ifdef USE_MORPHTARGETS
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
#endif`,L0=`#ifdef USE_MORPHTARGETS
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
#endif`,D0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,I0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,U0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,N0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,O0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,z0=`#ifdef USE_NORMALMAP
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
#endif`,F0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,k0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,B0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,H0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,V0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,W0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,G0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,j0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,X0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,q0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Y0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,K0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,J0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Z0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Q0=`float getShadowMask() {
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
}`,tg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,eg=`#ifdef USE_SKINNING
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
#endif`,ng=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ig=`#ifdef USE_SKINNING
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
#endif`,sg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,rg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,og=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ag=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,cg=`#ifdef USE_TRANSMISSION
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
#endif`,lg=`#ifdef USE_TRANSMISSION
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
#endif`,hg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ug=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const pg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,mg=`uniform sampler2D t2D;
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
}`,gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,xg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_g=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yg=`#include <common>
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
}`,Mg=`#if DEPTH_PACKING == 3200
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
}`,bg=`#define DISTANCE
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
}`,Sg=`#define DISTANCE
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
}`,wg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Eg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tg=`uniform float scale;
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
}`,Ag=`uniform vec3 diffuse;
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
}`,Rg=`#include <common>
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
}`,Cg=`uniform vec3 diffuse;
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
}`,Pg=`#define LAMBERT
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
}`,Lg=`#define LAMBERT
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
}`,Dg=`#define MATCAP
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
}`,Ig=`#define MATCAP
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
}`,Ug=`#define NORMAL
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
}`,Ng=`#define NORMAL
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
}`,Og=`#define PHONG
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
}`,zg=`#define PHONG
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
}`,Fg=`#define STANDARD
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
}`,kg=`#define STANDARD
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
}`,Bg=`#define TOON
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
}`,Hg=`#define TOON
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
}`,Vg=`uniform float size;
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
}`,Wg=`uniform vec3 diffuse;
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
}`,Gg=`#include <common>
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
}`,$g=`uniform vec3 color;
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
}`,jg=`uniform float rotation;
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
}`,Xg=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:mm,alphahash_pars_fragment:gm,alphamap_fragment:vm,alphamap_pars_fragment:xm,alphatest_fragment:_m,alphatest_pars_fragment:ym,aomap_fragment:Mm,aomap_pars_fragment:bm,batching_pars_vertex:Sm,batching_vertex:wm,begin_vertex:Em,beginnormal_vertex:Tm,bsdfs:Am,iridescence_fragment:Rm,bumpmap_pars_fragment:Cm,clipping_planes_fragment:Pm,clipping_planes_pars_fragment:Lm,clipping_planes_pars_vertex:Dm,clipping_planes_vertex:Im,color_fragment:Um,color_pars_fragment:Nm,color_pars_vertex:Om,color_vertex:zm,common:Fm,cube_uv_reflection_fragment:km,defaultnormal_vertex:Bm,displacementmap_pars_vertex:Hm,displacementmap_vertex:Vm,emissivemap_fragment:Wm,emissivemap_pars_fragment:Gm,colorspace_fragment:$m,colorspace_pars_fragment:jm,envmap_fragment:Xm,envmap_common_pars_fragment:qm,envmap_pars_fragment:Ym,envmap_pars_vertex:Km,envmap_physical_pars_fragment:c0,envmap_vertex:Jm,fog_vertex:Zm,fog_pars_vertex:Qm,fog_fragment:t0,fog_pars_fragment:e0,gradientmap_pars_fragment:n0,lightmap_fragment:i0,lightmap_pars_fragment:s0,lights_lambert_fragment:r0,lights_lambert_pars_fragment:o0,lights_pars_begin:a0,lights_toon_fragment:l0,lights_toon_pars_fragment:h0,lights_phong_fragment:u0,lights_phong_pars_fragment:f0,lights_physical_fragment:d0,lights_physical_pars_fragment:p0,lights_fragment_begin:m0,lights_fragment_maps:g0,lights_fragment_end:v0,logdepthbuf_fragment:x0,logdepthbuf_pars_fragment:_0,logdepthbuf_pars_vertex:y0,logdepthbuf_vertex:M0,map_fragment:b0,map_pars_fragment:S0,map_particle_fragment:w0,map_particle_pars_fragment:E0,metalnessmap_fragment:T0,metalnessmap_pars_fragment:A0,morphcolor_vertex:R0,morphnormal_vertex:C0,morphtarget_pars_vertex:P0,morphtarget_vertex:L0,normal_fragment_begin:D0,normal_fragment_maps:I0,normal_pars_fragment:U0,normal_pars_vertex:N0,normal_vertex:O0,normalmap_pars_fragment:z0,clearcoat_normal_fragment_begin:F0,clearcoat_normal_fragment_maps:k0,clearcoat_pars_fragment:B0,iridescence_pars_fragment:H0,opaque_fragment:V0,packing:W0,premultiplied_alpha_fragment:G0,project_vertex:$0,dithering_fragment:j0,dithering_pars_fragment:X0,roughnessmap_fragment:q0,roughnessmap_pars_fragment:Y0,shadowmap_pars_fragment:K0,shadowmap_pars_vertex:J0,shadowmap_vertex:Z0,shadowmask_pars_fragment:Q0,skinbase_vertex:tg,skinning_pars_vertex:eg,skinning_vertex:ng,skinnormal_vertex:ig,specularmap_fragment:sg,specularmap_pars_fragment:rg,tonemapping_fragment:og,tonemapping_pars_fragment:ag,transmission_fragment:cg,transmission_pars_fragment:lg,uv_pars_fragment:hg,uv_pars_vertex:ug,uv_vertex:fg,worldpos_vertex:dg,background_vert:pg,background_frag:mg,backgroundCube_vert:gg,backgroundCube_frag:vg,cube_vert:xg,cube_frag:_g,depth_vert:yg,depth_frag:Mg,distanceRGBA_vert:bg,distanceRGBA_frag:Sg,equirect_vert:wg,equirect_frag:Eg,linedashed_vert:Tg,linedashed_frag:Ag,meshbasic_vert:Rg,meshbasic_frag:Cg,meshlambert_vert:Pg,meshlambert_frag:Lg,meshmatcap_vert:Dg,meshmatcap_frag:Ig,meshnormal_vert:Ug,meshnormal_frag:Ng,meshphong_vert:Og,meshphong_frag:zg,meshphysical_vert:Fg,meshphysical_frag:kg,meshtoon_vert:Bg,meshtoon_frag:Hg,points_vert:Vg,points_frag:Wg,shadow_vert:Gg,shadow_frag:$g,sprite_vert:jg,sprite_frag:Xg},pt={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},bn={basic:{uniforms:Be([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Be([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new qt(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Be([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Be([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Be([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new qt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Be([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Be([pt.points,pt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Be([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Be([pt.common,pt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Be([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Be([pt.sprite,pt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Be([pt.common,pt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Be([pt.lights,pt.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};bn.physical={uniforms:Be([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const jr={r:0,b:0,g:0};function qg(i,t,e,n,s,r,o){const a=new qt(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function g(m,p){let x=!1,y=p.isScene===!0?p.background:null;y&&y.isTexture&&(y=(p.backgroundBlurriness>0?e:t).get(y)),y===null?v(a,c):y&&y.isColor&&(v(y,1),x=!0);const _=i.xr.getEnvironmentBlendMode();_==="additive"?n.buffers.color.setClear(0,0,0,1,o):_==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),y&&(y.isCubeTexture||y.mapping===Lo)?(h===void 0&&(h=new Vt(new An(1,1,1),new Ui({name:"BackgroundCubeMaterial",uniforms:Es(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:qe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=ae.getTransfer(y.colorSpace)!==ce,(u!==y||d!==y.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,f=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Vt(new ci(2,2),new Ui({name:"BackgroundMaterial",uniforms:Es(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:fi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,l.material.toneMapped=ae.getTransfer(y.colorSpace)!==ce,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=y,d=y.version,f=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function v(m,p){m.getRGB(jr,mf(i)),n.buffers.color.setClear(jr.r,jr.g,jr.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),c=p,v(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,v(a,c)},render:g}}function Yg(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=m(null);let l=c,h=!1;function u(U,k,$,tt,q){let Y=!1;if(o){const K=v(tt,$,k);l!==K&&(l=K,f(l.object)),Y=p(U,tt,$,q),Y&&x(U,tt,$,q)}else{const K=k.wireframe===!0;(l.geometry!==tt.id||l.program!==$.id||l.wireframe!==K)&&(l.geometry=tt.id,l.program=$.id,l.wireframe=K,Y=!0)}q!==null&&e.update(q,i.ELEMENT_ARRAY_BUFFER),(Y||h)&&(h=!1,N(U,k,$,tt),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function f(U){return n.isWebGL2?i.bindVertexArray(U):r.bindVertexArrayOES(U)}function g(U){return n.isWebGL2?i.deleteVertexArray(U):r.deleteVertexArrayOES(U)}function v(U,k,$){const tt=$.wireframe===!0;let q=a[U.id];q===void 0&&(q={},a[U.id]=q);let Y=q[k.id];Y===void 0&&(Y={},q[k.id]=Y);let K=Y[tt];return K===void 0&&(K=m(d()),Y[tt]=K),K}function m(U){const k=[],$=[],tt=[];for(let q=0;q<s;q++)k[q]=0,$[q]=0,tt[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:$,attributeDivisors:tt,object:U,attributes:{},index:null}}function p(U,k,$,tt){const q=l.attributes,Y=k.attributes;let K=0;const ot=$.getAttributes();for(const at in ot)if(ot[at].location>=0){const Z=q[at];let dt=Y[at];if(dt===void 0&&(at==="instanceMatrix"&&U.instanceMatrix&&(dt=U.instanceMatrix),at==="instanceColor"&&U.instanceColor&&(dt=U.instanceColor)),Z===void 0||Z.attribute!==dt||dt&&Z.data!==dt.data)return!0;K++}return l.attributesNum!==K||l.index!==tt}function x(U,k,$,tt){const q={},Y=k.attributes;let K=0;const ot=$.getAttributes();for(const at in ot)if(ot[at].location>=0){let Z=Y[at];Z===void 0&&(at==="instanceMatrix"&&U.instanceMatrix&&(Z=U.instanceMatrix),at==="instanceColor"&&U.instanceColor&&(Z=U.instanceColor));const dt={};dt.attribute=Z,Z&&Z.data&&(dt.data=Z.data),q[at]=dt,K++}l.attributes=q,l.attributesNum=K,l.index=tt}function y(){const U=l.newAttributes;for(let k=0,$=U.length;k<$;k++)U[k]=0}function _(U){R(U,0)}function R(U,k){const $=l.newAttributes,tt=l.enabledAttributes,q=l.attributeDivisors;$[U]=1,tt[U]===0&&(i.enableVertexAttribArray(U),tt[U]=1),q[U]!==k&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](U,k),q[U]=k)}function S(){const U=l.newAttributes,k=l.enabledAttributes;for(let $=0,tt=k.length;$<tt;$++)k[$]!==U[$]&&(i.disableVertexAttribArray($),k[$]=0)}function E(U,k,$,tt,q,Y,K){K===!0?i.vertexAttribIPointer(U,k,$,q,Y):i.vertexAttribPointer(U,k,$,tt,q,Y)}function N(U,k,$,tt){if(n.isWebGL2===!1&&(U.isInstancedMesh||tt.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;y();const q=tt.attributes,Y=$.getAttributes(),K=k.defaultAttributeValues;for(const ot in Y){const at=Y[ot];if(at.location>=0){let j=q[ot];if(j===void 0&&(ot==="instanceMatrix"&&U.instanceMatrix&&(j=U.instanceMatrix),ot==="instanceColor"&&U.instanceColor&&(j=U.instanceColor)),j!==void 0){const Z=j.normalized,dt=j.itemSize,wt=e.get(j);if(wt===void 0)continue;const St=wt.buffer,Nt=wt.type,Ot=wt.bytesPerElement,Dt=n.isWebGL2===!0&&(Nt===i.INT||Nt===i.UNSIGNED_INT||j.gpuType===Zu);if(j.isInterleavedBufferAttribute){const jt=j.data,z=jt.stride,de=j.offset;if(jt.isInstancedInterleavedBuffer){for(let bt=0;bt<at.locationSize;bt++)R(at.location+bt,jt.meshPerAttribute);U.isInstancedMesh!==!0&&tt._maxInstanceCount===void 0&&(tt._maxInstanceCount=jt.meshPerAttribute*jt.count)}else for(let bt=0;bt<at.locationSize;bt++)_(at.location+bt);i.bindBuffer(i.ARRAY_BUFFER,St);for(let bt=0;bt<at.locationSize;bt++)E(at.location+bt,dt/at.locationSize,Nt,Z,z*Ot,(de+dt/at.locationSize*bt)*Ot,Dt)}else{if(j.isInstancedBufferAttribute){for(let jt=0;jt<at.locationSize;jt++)R(at.location+jt,j.meshPerAttribute);U.isInstancedMesh!==!0&&tt._maxInstanceCount===void 0&&(tt._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let jt=0;jt<at.locationSize;jt++)_(at.location+jt);i.bindBuffer(i.ARRAY_BUFFER,St);for(let jt=0;jt<at.locationSize;jt++)E(at.location+jt,dt/at.locationSize,Nt,Z,dt*Ot,dt/at.locationSize*jt*Ot,Dt)}}else if(K!==void 0){const Z=K[ot];if(Z!==void 0)switch(Z.length){case 2:i.vertexAttrib2fv(at.location,Z);break;case 3:i.vertexAttrib3fv(at.location,Z);break;case 4:i.vertexAttrib4fv(at.location,Z);break;default:i.vertexAttrib1fv(at.location,Z)}}}}S()}function M(){W();for(const U in a){const k=a[U];for(const $ in k){const tt=k[$];for(const q in tt)g(tt[q].object),delete tt[q];delete k[$]}delete a[U]}}function w(U){if(a[U.id]===void 0)return;const k=a[U.id];for(const $ in k){const tt=k[$];for(const q in tt)g(tt[q].object),delete tt[q];delete k[$]}delete a[U.id]}function B(U){for(const k in a){const $=a[k];if($[U.id]===void 0)continue;const tt=$[U.id];for(const q in tt)g(tt[q].object),delete tt[q];delete $[U.id]}}function W(){nt(),h=!0,l!==c&&(l=c,f(l.object))}function nt(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:W,resetDefaultState:nt,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfProgram:B,initAttributes:y,enableAttribute:_,disableUnusedAttributes:S}}function Kg(i,t,e,n){const s=n.isWebGL2;let r;function o(h){r=h}function a(h,u){i.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,d){if(d===0)return;let f,g;if(s)f=i,g="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,h,u,d),e.update(u,r,d)}function l(h,u,d){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{f.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let v=0;v<d;v++)g+=u[v];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function Jg(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const l=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),y=d>0,_=o||t.has("OES_texture_float"),R=y&&_,S=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:x,vertexTextures:y,floatFragmentTextures:_,floatVertexTextures:R,maxSamples:S}}function Zg(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new ei,a=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const x=r?0:n,y=x*4;let _=p.clippingState||null;c.value=_,_=h(g,d,y,f);for(let R=0;R!==y;++R)_[R]=e[R];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=f+v*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,_=f;y!==v;++y,_+=4)o.copy(u[y]).applyMatrix4(x,a),o.normal.toArray(m,_),m[_+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function Qg(i){let t=new WeakMap;function e(o,a){return a===nc?o.mapping=bs:a===ic&&(o.mapping=Ss),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===nc||a===ic)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new um(c.height/2);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class _f extends gf{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ds=4,sh=[.125,.215,.35,.446,.526,.582],Ei=20,ba=new _f,rh=new qt;let Sa=null,wa=0,Ea=0;const yi=(1+Math.sqrt(5))/2,rs=1/yi,oh=[new C(1,1,1),new C(-1,1,1),new C(1,1,-1),new C(-1,1,-1),new C(0,yi,rs),new C(0,yi,-rs),new C(rs,0,yi),new C(-rs,0,yi),new C(yi,rs,0),new C(-yi,rs,0)];class ah{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Sa=this._renderer.getRenderTarget(),wa=this._renderer.getActiveCubeFace(),Ea=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=lh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Sa,wa,Ea),t.scissorTest=!1,Xr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===bs||t.mapping===Ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Sa=this._renderer.getRenderTarget(),wa=this._renderer.getActiveCubeFace(),Ea=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Xe,minFilter:Xe,generateMipmaps:!1,type:hr,format:an,colorSpace:jn,depthBuffer:!1},s=ch(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ch(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=tv(r)),this._blurMaterial=ev(r,t,e)}return s}_compileMaterial(t){const e=new Vt(this._lodPlanes[0],t);this._renderer.compile(e,ba)}_sceneToCubeUV(t,e,n,s){const a=new tn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(rh),h.toneMapping=oi,h.autoClear=!1;const f=new He({name:"PMREM.Background",side:qe,depthWrite:!1,depthTest:!1}),g=new Vt(new An,f);let v=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,v=!0):(f.color.copy(rh),v=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):x===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const y=this._cubeSize;Xr(s,x*y,p>2?y:0,y,y),h.setRenderTarget(s),v&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===bs||t.mapping===Ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=hh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=lh());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Vt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;Xr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,ba)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=oh[(s-1)%oh.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Vt(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ei-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):Ei;m>Ei&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ei}`);const p=[];let x=0;for(let E=0;E<Ei;++E){const N=E/v,M=Math.exp(-N*N/2);p.push(M),E===0?x+=M:E<m&&(x+=2*M)}for(let E=0;E<p.length;E++)p[E]=p[E]/x;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-n;const _=this._sizeLods[s],R=3*_*(s>y-ds?s-y+ds:0),S=4*(this._cubeSize-_);Xr(e,R,S,3*_,2*_),c.setRenderTarget(e),c.render(u,ba)}}function tv(i){const t=[],e=[],n=[];let s=i;const r=i-ds+1+sh.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-ds?c=sh[o-i+ds-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,x=new Float32Array(v*g*f),y=new Float32Array(m*g*f),_=new Float32Array(p*g*f);for(let S=0;S<f;S++){const E=S%3*2/3-1,N=S>2?0:-1,M=[E,N,0,E+2/3,N,0,E+2/3,N+1,0,E,N,0,E+2/3,N+1,0,E,N+1,0];x.set(M,v*g*S),y.set(d,m*g*S);const w=[S,S,S,S,S,S];_.set(w,p*g*S)}const R=new xe;R.setAttribute("position",new sn(x,v)),R.setAttribute("uv",new sn(y,m)),R.setAttribute("faceIndex",new sn(_,p)),t.push(R),s>ds&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function ch(i,t,e){const n=new Ii(i,t,e);return n.texture.mapping=Lo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Xr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function ev(i,t,e){const n=new Float32Array(Ei),s=new C(0,1,0);return new Ui({name:"SphericalGaussianBlur",defines:{n:Ei,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ic(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function lh(){return new Ui({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ic(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function hh(){return new Ui({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function Ic(){return`

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
	`}function nv(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===nc||c===ic,h=c===bs||c===Ss;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new ah(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{const u=a.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new ah(i));const d=l?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function iv(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function sv(i,t,e,n){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const v=f[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],i.ARRAY_BUFFER)}}function l(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const x=f.array;v=f.version;for(let y=0,_=x.length;y<_;y+=3){const R=x[y+0],S=x[y+1],E=x[y+2];d.push(R,S,S,E,E,R)}}else if(g!==void 0){const x=g.array;v=g.version;for(let y=0,_=x.length/3-1;y<_;y+=3){const R=y+0,S=y+1,E=y+2;d.push(R,S,S,E,E,R)}}else return;const m=new(cf(d)?pf:df)(d,1);m.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function rv(i,t,e,n){const s=n.isWebGL2;let r;function o(f){r=f}let a,c;function l(f){a=f.type,c=f.bytesPerElement}function h(f,g){i.drawElements(r,g,a,f*c),e.update(g,r,1)}function u(f,g,v){if(v===0)return;let m,p;if(s)m=i,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,a,f*c,v),e.update(g,r,v)}function d(f,g,v){if(v===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<v;p++)this.render(f[p]/c,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,a,f,0,v);let p=0;for(let x=0;x<v;x++)p+=g[x];e.update(p,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function ov(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function av(i,t){return i[0]-t[0]}function cv(i,t){return Math.abs(t[1])-Math.abs(i[1])}function lv(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,o=new le,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,u){const d=l.morphTargetInfluences;if(t.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=g!==void 0?g.length:0;let m=r.get(h);if(m===void 0||m.count!==v){let k=function(){nt.dispose(),r.delete(h),h.removeEventListener("dispose",k)};var f=k;m!==void 0&&m.texture.dispose();const y=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,R=h.morphAttributes.color!==void 0,S=h.morphAttributes.position||[],E=h.morphAttributes.normal||[],N=h.morphAttributes.color||[];let M=0;y===!0&&(M=1),_===!0&&(M=2),R===!0&&(M=3);let w=h.attributes.position.count*M,B=1;w>t.maxTextureSize&&(B=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const W=new Float32Array(w*B*4*v),nt=new uf(W,w,B,v);nt.type=ii,nt.needsUpdate=!0;const U=M*4;for(let $=0;$<v;$++){const tt=S[$],q=E[$],Y=N[$],K=w*B*4*$;for(let ot=0;ot<tt.count;ot++){const at=ot*U;y===!0&&(o.fromBufferAttribute(tt,ot),W[K+at+0]=o.x,W[K+at+1]=o.y,W[K+at+2]=o.z,W[K+at+3]=0),_===!0&&(o.fromBufferAttribute(q,ot),W[K+at+4]=o.x,W[K+at+5]=o.y,W[K+at+6]=o.z,W[K+at+7]=0),R===!0&&(o.fromBufferAttribute(Y,ot),W[K+at+8]=o.x,W[K+at+9]=o.y,W[K+at+10]=o.z,W[K+at+11]=Y.itemSize===4?o.w:1)}}m={count:v,texture:nt,size:new mt(w,B)},r.set(h,m),h.addEventListener("dispose",k)}let p=0;for(let y=0;y<d.length;y++)p+=d[y];const x=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(i,"morphTargetBaseInfluence",x),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}else{const g=d===void 0?0:d.length;let v=n[h.id];if(v===void 0||v.length!==g){v=[];for(let _=0;_<g;_++)v[_]=[_,0];n[h.id]=v}for(let _=0;_<g;_++){const R=v[_];R[0]=_,R[1]=d[_]}v.sort(cv);for(let _=0;_<8;_++)_<g&&v[_][1]?(a[_][0]=v[_][0],a[_][1]=v[_][1]):(a[_][0]=Number.MAX_SAFE_INTEGER,a[_][1]=0);a.sort(av);const m=h.morphAttributes.position,p=h.morphAttributes.normal;let x=0;for(let _=0;_<8;_++){const R=a[_],S=R[0],E=R[1];S!==Number.MAX_SAFE_INTEGER&&E?(m&&h.getAttribute("morphTarget"+_)!==m[S]&&h.setAttribute("morphTarget"+_,m[S]),p&&h.getAttribute("morphNormal"+_)!==p[S]&&h.setAttribute("morphNormal"+_,p[S]),s[_]=E,x+=E):(m&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),s[_]=0)}const y=h.morphTargetsRelative?1:1-x;u.getUniforms().setValue(i,"morphTargetBaseInfluence",y),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function hv(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class yf extends We{constructor(t,e,n,s,r,o,a,c,l,h){if(h=h!==void 0?h:Ci,h!==Ci&&h!==ws)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ci&&(n=ni),n===void 0&&h===ws&&(n=Ri),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:De,this.minFilter=c!==void 0?c:De,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Mf=new We,bf=new yf(1,1);bf.compareFunction=af;const Sf=new uf,wf=new qp,Ef=new vf,uh=[],fh=[],dh=new Float32Array(16),ph=new Float32Array(9),mh=new Float32Array(4);function Os(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=uh[s];if(r===void 0&&(r=new Float32Array(s),uh[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Ee(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Te(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Uo(i,t){let e=fh[t];e===void 0&&(e=new Int32Array(t),fh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function uv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function fv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2fv(this.addr,t),Te(e,t)}}function dv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ee(e,t))return;i.uniform3fv(this.addr,t),Te(e,t)}}function pv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4fv(this.addr,t),Te(e,t)}}function mv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;mh.set(n),i.uniformMatrix2fv(this.addr,!1,mh),Te(e,n)}}function gv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;ph.set(n),i.uniformMatrix3fv(this.addr,!1,ph),Te(e,n)}}function vv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;dh.set(n),i.uniformMatrix4fv(this.addr,!1,dh),Te(e,n)}}function xv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function _v(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2iv(this.addr,t),Te(e,t)}}function yv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3iv(this.addr,t),Te(e,t)}}function Mv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4iv(this.addr,t),Te(e,t)}}function bv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Sv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2uiv(this.addr,t),Te(e,t)}}function wv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3uiv(this.addr,t),Te(e,t)}}function Ev(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4uiv(this.addr,t),Te(e,t)}}function Tv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?bf:Mf;e.setTexture2D(t||r,s)}function Av(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||wf,s)}function Rv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ef,s)}function Cv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Sf,s)}function Pv(i){switch(i){case 5126:return uv;case 35664:return fv;case 35665:return dv;case 35666:return pv;case 35674:return mv;case 35675:return gv;case 35676:return vv;case 5124:case 35670:return xv;case 35667:case 35671:return _v;case 35668:case 35672:return yv;case 35669:case 35673:return Mv;case 5125:return bv;case 36294:return Sv;case 36295:return wv;case 36296:return Ev;case 35678:case 36198:case 36298:case 36306:case 35682:return Tv;case 35679:case 36299:case 36307:return Av;case 35680:case 36300:case 36308:case 36293:return Rv;case 36289:case 36303:case 36311:case 36292:return Cv}}function Lv(i,t){i.uniform1fv(this.addr,t)}function Dv(i,t){const e=Os(t,this.size,2);i.uniform2fv(this.addr,e)}function Iv(i,t){const e=Os(t,this.size,3);i.uniform3fv(this.addr,e)}function Uv(i,t){const e=Os(t,this.size,4);i.uniform4fv(this.addr,e)}function Nv(i,t){const e=Os(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Ov(i,t){const e=Os(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function zv(i,t){const e=Os(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Fv(i,t){i.uniform1iv(this.addr,t)}function kv(i,t){i.uniform2iv(this.addr,t)}function Bv(i,t){i.uniform3iv(this.addr,t)}function Hv(i,t){i.uniform4iv(this.addr,t)}function Vv(i,t){i.uniform1uiv(this.addr,t)}function Wv(i,t){i.uniform2uiv(this.addr,t)}function Gv(i,t){i.uniform3uiv(this.addr,t)}function $v(i,t){i.uniform4uiv(this.addr,t)}function jv(i,t,e){const n=this.cache,s=t.length,r=Uo(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Mf,r[o])}function Xv(i,t,e){const n=this.cache,s=t.length,r=Uo(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||wf,r[o])}function qv(i,t,e){const n=this.cache,s=t.length,r=Uo(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Ef,r[o])}function Yv(i,t,e){const n=this.cache,s=t.length,r=Uo(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Sf,r[o])}function Kv(i){switch(i){case 5126:return Lv;case 35664:return Dv;case 35665:return Iv;case 35666:return Uv;case 35674:return Nv;case 35675:return Ov;case 35676:return zv;case 5124:case 35670:return Fv;case 35667:case 35671:return kv;case 35668:case 35672:return Bv;case 35669:case 35673:return Hv;case 5125:return Vv;case 36294:return Wv;case 36295:return Gv;case 36296:return $v;case 35678:case 36198:case 36298:case 36306:case 35682:return jv;case 35679:case 36299:case 36307:return Xv;case 35680:case 36300:case 36308:case 36293:return qv;case 36289:case 36303:case 36311:case 36292:return Yv}}class Jv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Pv(e.type)}}class Zv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Kv(e.type)}}class Qv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Ta=/(\w+)(\])?(\[|\.)?/g;function gh(i,t){i.seq.push(t),i.map[t.id]=t}function tx(i,t,e){const n=i.name,s=n.length;for(Ta.lastIndex=0;;){const r=Ta.exec(n),o=Ta.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){gh(e,l===void 0?new Jv(a,i,t):new Zv(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Qv(a),gh(e,u)),e=u}}}class lo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);tx(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function vh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const ex=37297;let nx=0;function ix(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function sx(i){const t=ae.getPrimaries(ae.workingColorSpace),e=ae.getPrimaries(i);let n;switch(t===e?n="":t===So&&e===bo?n="LinearDisplayP3ToLinearSRGB":t===bo&&e===So&&(n="LinearSRGBToLinearDisplayP3"),i){case jn:case Do:return[n,"LinearTransferOETF"];case be:case Pc:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function xh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+ix(i.getShaderSource(t),o)}else return s}function rx(i,t){const e=sx(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function ox(i,t){let e;switch(t){case gp:e="Linear";break;case vp:e="Reinhard";break;case xp:e="OptimizedCineon";break;case Ku:e="ACESFilmic";break;case yp:e="AgX";break;case _p:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function ax(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(ps).join(`
`)}function cx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(ps).join(`
`)}function lx(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function hx(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function ps(i){return i!==""}function _h(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function yh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const ux=/^[ \t]*#include +<([\w\d./]+)>/gm;function cc(i){return i.replace(ux,dx)}const fx=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function dx(i,t){let e=Xt[t];if(e===void 0){const n=fx.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return cc(e)}const px=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Mh(i){return i.replace(px,mx)}function mx(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function bh(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function gx(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===qu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Yu?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Fn&&(t="SHADOWMAP_TYPE_VSM"),t}function vx(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case bs:case Ss:t="ENVMAP_TYPE_CUBE";break;case Lo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function xx(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ss:t="ENVMAP_MODE_REFRACTION";break}return t}function _x(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ac:t="ENVMAP_BLENDING_MULTIPLY";break;case pp:t="ENVMAP_BLENDING_MIX";break;case mp:t="ENVMAP_BLENDING_ADD";break}return t}function yx(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Mx(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=gx(e),l=vx(e),h=xx(e),u=_x(e),d=yx(e),f=e.isWebGL2?"":ax(e),g=cx(e),v=lx(r),m=s.createProgram();let p,x,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(ps).join(`
`),p.length>0&&(p+=`
`),x=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(ps).join(`
`),x.length>0&&(x+=`
`)):(p=[bh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ps).join(`
`),x=[f,bh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==oi?"#define TONE_MAPPING":"",e.toneMapping!==oi?Xt.tonemapping_pars_fragment:"",e.toneMapping!==oi?ox("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,rx("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ps).join(`
`)),o=cc(o),o=_h(o,e),o=yh(o,e),a=cc(a),a=_h(a,e),a=yh(a,e),o=Mh(o),a=Mh(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,x=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Bl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Bl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const _=y+p+o,R=y+x+a,S=vh(s,s.VERTEX_SHADER,_),E=vh(s,s.FRAGMENT_SHADER,R);s.attachShader(m,S),s.attachShader(m,E),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function N(W){if(i.debug.checkShaderErrors){const nt=s.getProgramInfoLog(m).trim(),U=s.getShaderInfoLog(S).trim(),k=s.getShaderInfoLog(E).trim();let $=!0,tt=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if($=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,S,E);else{const q=xh(s,S,"vertex"),Y=xh(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+nt+`
`+q+`
`+Y)}else nt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",nt):(U===""||k==="")&&(tt=!1);tt&&(W.diagnostics={runnable:$,programLog:nt,vertexShader:{log:U,prefix:p},fragmentShader:{log:k,prefix:x}})}s.deleteShader(S),s.deleteShader(E),M=new lo(s,m),w=hx(s,m)}let M;this.getUniforms=function(){return M===void 0&&N(this),M};let w;this.getAttributes=function(){return w===void 0&&N(this),w};let B=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return B===!1&&(B=s.getProgramParameter(m,ex)),B},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=nx++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=S,this.fragmentShader=E,this}let bx=0;class Sx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new wx(t),e.set(t,n)),n}}class wx{constructor(t){this.id=bx++,this.code=t,this.usedTimes=0}}function Ex(i,t,e,n,s,r,o){const a=new Lc,c=new Sx,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return M===0?"uv":`uv${M}`}function m(M,w,B,W,nt){const U=W.fog,k=nt.geometry,$=M.isMeshStandardMaterial?W.environment:null,tt=(M.isMeshStandardMaterial?e:t).get(M.envMap||$),q=tt&&tt.mapping===Lo?tt.image.height:null,Y=g[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const K=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ot=K!==void 0?K.length:0;let at=0;k.morphAttributes.position!==void 0&&(at=1),k.morphAttributes.normal!==void 0&&(at=2),k.morphAttributes.color!==void 0&&(at=3);let j,Z,dt,wt;if(Y){const ge=bn[Y];j=ge.vertexShader,Z=ge.fragmentShader}else j=M.vertexShader,Z=M.fragmentShader,c.update(M),dt=c.getVertexShaderID(M),wt=c.getFragmentShaderID(M);const St=i.getRenderTarget(),Nt=nt.isInstancedMesh===!0,Ot=nt.isBatchedMesh===!0,Dt=!!M.map,jt=!!M.matcap,z=!!tt,de=!!M.aoMap,bt=!!M.lightMap,Rt=!!M.bumpMap,xt=!!M.normalMap,oe=!!M.displacementMap,Ht=!!M.emissiveMap,A=!!M.metalnessMap,b=!!M.roughnessMap,F=M.anisotropy>0,rt=M.clearcoat>0,L=M.iridescence>0,D=M.sheen>0,X=M.transmission>0,et=F&&!!M.anisotropyMap,Q=rt&&!!M.clearcoatMap,ut=rt&&!!M.clearcoatNormalMap,Ct=rt&&!!M.clearcoatRoughnessMap,J=L&&!!M.iridescenceMap,Zt=L&&!!M.iridescenceThicknessMap,Wt=D&&!!M.sheenColorMap,zt=D&&!!M.sheenRoughnessMap,Pt=!!M.specularMap,_t=!!M.specularColorMap,P=!!M.specularIntensityMap,ct=X&&!!M.transmissionMap,Tt=X&&!!M.thicknessMap,Mt=!!M.gradientMap,it=!!M.alphaMap,I=M.alphaTest>0,lt=!!M.alphaHash,gt=!!M.extensions,It=!!k.attributes.uv1,Lt=!!k.attributes.uv2,Qt=!!k.attributes.uv3;let te=oi;return M.toneMapped&&(St===null||St.isXRRenderTarget===!0)&&(te=i.toneMapping),{isWebGL2:h,shaderID:Y,shaderType:M.type,shaderName:M.name,vertexShader:j,fragmentShader:Z,defines:M.defines,customVertexShaderID:dt,customFragmentShaderID:wt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:Ot,instancing:Nt,instancingColor:Nt&&nt.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:St===null?i.outputColorSpace:St.isXRRenderTarget===!0?St.texture.colorSpace:jn,map:Dt,matcap:jt,envMap:z,envMapMode:z&&tt.mapping,envMapCubeUVHeight:q,aoMap:de,lightMap:bt,bumpMap:Rt,normalMap:xt,displacementMap:d&&oe,emissiveMap:Ht,normalMapObjectSpace:xt&&M.normalMapType===Dp,normalMapTangentSpace:xt&&M.normalMapType===Cc,metalnessMap:A,roughnessMap:b,anisotropy:F,anisotropyMap:et,clearcoat:rt,clearcoatMap:Q,clearcoatNormalMap:ut,clearcoatRoughnessMap:Ct,iridescence:L,iridescenceMap:J,iridescenceThicknessMap:Zt,sheen:D,sheenColorMap:Wt,sheenRoughnessMap:zt,specularMap:Pt,specularColorMap:_t,specularIntensityMap:P,transmission:X,transmissionMap:ct,thicknessMap:Tt,gradientMap:Mt,opaque:M.transparent===!1&&M.blending===ms,alphaMap:it,alphaTest:I,alphaHash:lt,combine:M.combine,mapUv:Dt&&v(M.map.channel),aoMapUv:de&&v(M.aoMap.channel),lightMapUv:bt&&v(M.lightMap.channel),bumpMapUv:Rt&&v(M.bumpMap.channel),normalMapUv:xt&&v(M.normalMap.channel),displacementMapUv:oe&&v(M.displacementMap.channel),emissiveMapUv:Ht&&v(M.emissiveMap.channel),metalnessMapUv:A&&v(M.metalnessMap.channel),roughnessMapUv:b&&v(M.roughnessMap.channel),anisotropyMapUv:et&&v(M.anisotropyMap.channel),clearcoatMapUv:Q&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:ut&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ct&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:Zt&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:Wt&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:zt&&v(M.sheenRoughnessMap.channel),specularMapUv:Pt&&v(M.specularMap.channel),specularColorMapUv:_t&&v(M.specularColorMap.channel),specularIntensityMapUv:P&&v(M.specularIntensityMap.channel),transmissionMapUv:ct&&v(M.transmissionMap.channel),thicknessMapUv:Tt&&v(M.thicknessMap.channel),alphaMapUv:it&&v(M.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(xt||F),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,vertexUv1s:It,vertexUv2s:Lt,vertexUv3s:Qt,pointsUvs:nt.isPoints===!0&&!!k.attributes.uv&&(Dt||it),fog:!!U,useFog:M.fog===!0,fogExp2:U&&U.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:nt.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:ot,morphTextureStride:at,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&B.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Dt&&M.map.isVideoTexture===!0&&ae.getTransfer(M.map.colorSpace)===ce,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===en,flipSided:M.side===qe,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:gt&&M.extensions.derivatives===!0,extensionFragDepth:gt&&M.extensions.fragDepth===!0,extensionDrawBuffers:gt&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:gt&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:gt&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function p(M){const w=[];if(M.shaderID?w.push(M.shaderID):(w.push(M.customVertexShaderID),w.push(M.customFragmentShaderID)),M.defines!==void 0)for(const B in M.defines)w.push(B),w.push(M.defines[B]);return M.isRawShaderMaterial===!1&&(x(w,M),y(w,M),w.push(i.outputColorSpace)),w.push(M.customProgramCacheKey),w.join()}function x(M,w){M.push(w.precision),M.push(w.outputColorSpace),M.push(w.envMapMode),M.push(w.envMapCubeUVHeight),M.push(w.mapUv),M.push(w.alphaMapUv),M.push(w.lightMapUv),M.push(w.aoMapUv),M.push(w.bumpMapUv),M.push(w.normalMapUv),M.push(w.displacementMapUv),M.push(w.emissiveMapUv),M.push(w.metalnessMapUv),M.push(w.roughnessMapUv),M.push(w.anisotropyMapUv),M.push(w.clearcoatMapUv),M.push(w.clearcoatNormalMapUv),M.push(w.clearcoatRoughnessMapUv),M.push(w.iridescenceMapUv),M.push(w.iridescenceThicknessMapUv),M.push(w.sheenColorMapUv),M.push(w.sheenRoughnessMapUv),M.push(w.specularMapUv),M.push(w.specularColorMapUv),M.push(w.specularIntensityMapUv),M.push(w.transmissionMapUv),M.push(w.thicknessMapUv),M.push(w.combine),M.push(w.fogExp2),M.push(w.sizeAttenuation),M.push(w.morphTargetsCount),M.push(w.morphAttributeCount),M.push(w.numDirLights),M.push(w.numPointLights),M.push(w.numSpotLights),M.push(w.numSpotLightMaps),M.push(w.numHemiLights),M.push(w.numRectAreaLights),M.push(w.numDirLightShadows),M.push(w.numPointLightShadows),M.push(w.numSpotLightShadows),M.push(w.numSpotLightShadowsWithMaps),M.push(w.numLightProbes),M.push(w.shadowMapType),M.push(w.toneMapping),M.push(w.numClippingPlanes),M.push(w.numClipIntersection),M.push(w.depthPacking)}function y(M,w){a.disableAll(),w.isWebGL2&&a.enable(0),w.supportsVertexTextures&&a.enable(1),w.instancing&&a.enable(2),w.instancingColor&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),M.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.skinning&&a.enable(4),w.morphTargets&&a.enable(5),w.morphNormals&&a.enable(6),w.morphColors&&a.enable(7),w.premultipliedAlpha&&a.enable(8),w.shadowMapEnabled&&a.enable(9),w.useLegacyLights&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function _(M){const w=g[M.type];let B;if(w){const W=bn[w];B=am.clone(W.uniforms)}else B=M.uniforms;return B}function R(M,w){let B;for(let W=0,nt=l.length;W<nt;W++){const U=l[W];if(U.cacheKey===w){B=U,++B.usedTimes;break}}return B===void 0&&(B=new Mx(i,w,M,r),l.push(B)),B}function S(M){if(--M.usedTimes===0){const w=l.indexOf(M);l[w]=l[l.length-1],l.pop(),M.destroy()}}function E(M){c.remove(M)}function N(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:R,releaseProgram:S,releaseShaderCache:E,programs:l,dispose:N}}function Tx(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function Ax(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Sh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function wh(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,f,g,v,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function a(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||Ax),n.length>1&&n.sort(d||Sh),s.length>1&&s.sort(d||Sh)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Rx(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new wh,i.set(n,[o])):s>=r.length?(o=new wh,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Cx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new qt};break;case"SpotLight":e={position:new C,direction:new C,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function Px(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Lx=0;function Dx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Ix(i,t){const e=new Cx,n=Px(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new C);const r=new C,o=new se,a=new se;function c(h,u){let d=0,f=0,g=0;for(let W=0;W<9;W++)s.probe[W].set(0,0,0);let v=0,m=0,p=0,x=0,y=0,_=0,R=0,S=0,E=0,N=0,M=0;h.sort(Dx);const w=u===!0?Math.PI:1;for(let W=0,nt=h.length;W<nt;W++){const U=h[W],k=U.color,$=U.intensity,tt=U.distance,q=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)d+=k.r*$*w,f+=k.g*$*w,g+=k.b*$*w;else if(U.isLightProbe){for(let Y=0;Y<9;Y++)s.probe[Y].addScaledVector(U.sh.coefficients[Y],$);M++}else if(U.isDirectionalLight){const Y=e.get(U);if(Y.color.copy(U.color).multiplyScalar(U.intensity*w),U.castShadow){const K=U.shadow,ot=n.get(U);ot.shadowBias=K.bias,ot.shadowNormalBias=K.normalBias,ot.shadowRadius=K.radius,ot.shadowMapSize=K.mapSize,s.directionalShadow[v]=ot,s.directionalShadowMap[v]=q,s.directionalShadowMatrix[v]=U.shadow.matrix,_++}s.directional[v]=Y,v++}else if(U.isSpotLight){const Y=e.get(U);Y.position.setFromMatrixPosition(U.matrixWorld),Y.color.copy(k).multiplyScalar($*w),Y.distance=tt,Y.coneCos=Math.cos(U.angle),Y.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),Y.decay=U.decay,s.spot[p]=Y;const K=U.shadow;if(U.map&&(s.spotLightMap[E]=U.map,E++,K.updateMatrices(U),U.castShadow&&N++),s.spotLightMatrix[p]=K.matrix,U.castShadow){const ot=n.get(U);ot.shadowBias=K.bias,ot.shadowNormalBias=K.normalBias,ot.shadowRadius=K.radius,ot.shadowMapSize=K.mapSize,s.spotShadow[p]=ot,s.spotShadowMap[p]=q,S++}p++}else if(U.isRectAreaLight){const Y=e.get(U);Y.color.copy(k).multiplyScalar($),Y.halfWidth.set(U.width*.5,0,0),Y.halfHeight.set(0,U.height*.5,0),s.rectArea[x]=Y,x++}else if(U.isPointLight){const Y=e.get(U);if(Y.color.copy(U.color).multiplyScalar(U.intensity*w),Y.distance=U.distance,Y.decay=U.decay,U.castShadow){const K=U.shadow,ot=n.get(U);ot.shadowBias=K.bias,ot.shadowNormalBias=K.normalBias,ot.shadowRadius=K.radius,ot.shadowMapSize=K.mapSize,ot.shadowCameraNear=K.camera.near,ot.shadowCameraFar=K.camera.far,s.pointShadow[m]=ot,s.pointShadowMap[m]=q,s.pointShadowMatrix[m]=U.shadow.matrix,R++}s.point[m]=Y,m++}else if(U.isHemisphereLight){const Y=e.get(U);Y.skyColor.copy(U.color).multiplyScalar($*w),Y.groundColor.copy(U.groundColor).multiplyScalar($*w),s.hemi[y]=Y,y++}}x>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_FLOAT_1,s.rectAreaLTC2=pt.LTC_FLOAT_2):(s.rectAreaLTC1=pt.LTC_HALF_1,s.rectAreaLTC2=pt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_FLOAT_1,s.rectAreaLTC2=pt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_HALF_1,s.rectAreaLTC2=pt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=f,s.ambient[2]=g;const B=s.hash;(B.directionalLength!==v||B.pointLength!==m||B.spotLength!==p||B.rectAreaLength!==x||B.hemiLength!==y||B.numDirectionalShadows!==_||B.numPointShadows!==R||B.numSpotShadows!==S||B.numSpotMaps!==E||B.numLightProbes!==M)&&(s.directional.length=v,s.spot.length=p,s.rectArea.length=x,s.point.length=m,s.hemi.length=y,s.directionalShadow.length=_,s.directionalShadowMap.length=_,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=S,s.spotShadowMap.length=S,s.directionalShadowMatrix.length=_,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=S+E-N,s.spotLightMap.length=E,s.numSpotLightShadowsWithMaps=N,s.numLightProbes=M,B.directionalLength=v,B.pointLength=m,B.spotLength=p,B.rectAreaLength=x,B.hemiLength=y,B.numDirectionalShadows=_,B.numPointShadows=R,B.numSpotShadows=S,B.numSpotMaps=E,B.numLightProbes=M,s.version=Lx++)}function l(h,u){let d=0,f=0,g=0,v=0,m=0;const p=u.matrixWorldInverse;for(let x=0,y=h.length;x<y;x++){const _=h[x];if(_.isDirectionalLight){const R=s.directional[d];R.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),d++}else if(_.isSpotLight){const R=s.spot[g];R.position.setFromMatrixPosition(_.matrixWorld),R.position.applyMatrix4(p),R.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),g++}else if(_.isRectAreaLight){const R=s.rectArea[v];R.position.setFromMatrixPosition(_.matrixWorld),R.position.applyMatrix4(p),a.identity(),o.copy(_.matrixWorld),o.premultiply(p),a.extractRotation(o),R.halfWidth.set(_.width*.5,0,0),R.halfHeight.set(0,_.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),v++}else if(_.isPointLight){const R=s.point[f];R.position.setFromMatrixPosition(_.matrixWorld),R.position.applyMatrix4(p),f++}else if(_.isHemisphereLight){const R=s.hemi[m];R.direction.setFromMatrixPosition(_.matrixWorld),R.direction.transformDirection(p),m++}}}return{setup:c,setupView:l,state:s}}function Eh(i,t){const e=new Ix(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(u){n.push(u)}function a(u){s.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function Ux(i,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let c;return a===void 0?(c=new Eh(i,t),e.set(r,[c])):o>=a.length?(c=new Eh(i,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class Nx extends Bi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Pp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Ox extends Bi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const zx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Fx=`uniform sampler2D shadow_pass;
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
}`;function kx(i,t,e){let n=new Dc;const s=new mt,r=new mt,o=new le,a=new Nx({depthPacking:Lp}),c=new Ox,l={},h=e.maxTextureSize,u={[fi]:qe,[qe]:fi,[en]:en},d=new Ui({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new mt},radius:{value:4}},vertexShader:zx,fragmentShader:Fx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new xe;g.setAttribute("position",new sn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Vt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qu;let p=this.type;this.render=function(S,E,N){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const M=i.getRenderTarget(),w=i.getActiveCubeFace(),B=i.getActiveMipmapLevel(),W=i.state;W.setBlending(ri),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const nt=p!==Fn&&this.type===Fn,U=p===Fn&&this.type!==Fn;for(let k=0,$=S.length;k<$;k++){const tt=S[k],q=tt.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",tt,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);const Y=q.getFrameExtents();if(s.multiply(Y),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Y.x),s.x=r.x*Y.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Y.y),s.y=r.y*Y.y,q.mapSize.y=r.y)),q.map===null||nt===!0||U===!0){const ot=this.type!==Fn?{minFilter:De,magFilter:De}:{};q.map!==null&&q.map.dispose(),q.map=new Ii(s.x,s.y,ot),q.map.texture.name=tt.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();const K=q.getViewportCount();for(let ot=0;ot<K;ot++){const at=q.getViewport(ot);o.set(r.x*at.x,r.y*at.y,r.x*at.z,r.y*at.w),W.viewport(o),q.updateMatrices(tt,ot),n=q.getFrustum(),_(E,N,q.camera,tt,this.type)}q.isPointLightShadow!==!0&&this.type===Fn&&x(q,N),q.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,w,B)};function x(S,E){const N=t.update(v);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Ii(s.x,s.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(E,null,N,d,v,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(E,null,N,f,v,null)}function y(S,E,N,M){let w=null;const B=N.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(B!==void 0)w=B;else if(w=N.isPointLight===!0?c:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const W=w.uuid,nt=E.uuid;let U=l[W];U===void 0&&(U={},l[W]=U);let k=U[nt];k===void 0&&(k=w.clone(),U[nt]=k,E.addEventListener("dispose",R)),w=k}if(w.visible=E.visible,w.wireframe=E.wireframe,M===Fn?w.side=E.shadowSide!==null?E.shadowSide:E.side:w.side=E.shadowSide!==null?E.shadowSide:u[E.side],w.alphaMap=E.alphaMap,w.alphaTest=E.alphaTest,w.map=E.map,w.clipShadows=E.clipShadows,w.clippingPlanes=E.clippingPlanes,w.clipIntersection=E.clipIntersection,w.displacementMap=E.displacementMap,w.displacementScale=E.displacementScale,w.displacementBias=E.displacementBias,w.wireframeLinewidth=E.wireframeLinewidth,w.linewidth=E.linewidth,N.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const W=i.properties.get(w);W.light=N}return w}function _(S,E,N,M,w){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&w===Fn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,S.matrixWorld);const nt=t.update(S),U=S.material;if(Array.isArray(U)){const k=nt.groups;for(let $=0,tt=k.length;$<tt;$++){const q=k[$],Y=U[q.materialIndex];if(Y&&Y.visible){const K=y(S,Y,M,w);S.onBeforeShadow(i,S,E,N,nt,K,q),i.renderBufferDirect(N,null,nt,K,S,q),S.onAfterShadow(i,S,E,N,nt,K,q)}}}else if(U.visible){const k=y(S,U,M,w);S.onBeforeShadow(i,S,E,N,nt,k,null),i.renderBufferDirect(N,null,nt,k,S,null),S.onAfterShadow(i,S,E,N,nt,k,null)}}const W=S.children;for(let nt=0,U=W.length;nt<U;nt++)_(W[nt],E,N,M,w)}function R(S){S.target.removeEventListener("dispose",R);for(const N in l){const M=l[N],w=S.target.uuid;w in M&&(M[w].dispose(),delete M[w])}}}function Bx(i,t,e){const n=e.isWebGL2;function s(){let I=!1;const lt=new le;let gt=null;const It=new le(0,0,0,0);return{setMask:function(Lt){gt!==Lt&&!I&&(i.colorMask(Lt,Lt,Lt,Lt),gt=Lt)},setLocked:function(Lt){I=Lt},setClear:function(Lt,Qt,te,pe,ge){ge===!0&&(Lt*=pe,Qt*=pe,te*=pe),lt.set(Lt,Qt,te,pe),It.equals(lt)===!1&&(i.clearColor(Lt,Qt,te,pe),It.copy(lt))},reset:function(){I=!1,gt=null,It.set(-1,0,0,0)}}}function r(){let I=!1,lt=null,gt=null,It=null;return{setTest:function(Lt){Lt?Ot(i.DEPTH_TEST):Dt(i.DEPTH_TEST)},setMask:function(Lt){lt!==Lt&&!I&&(i.depthMask(Lt),lt=Lt)},setFunc:function(Lt){if(gt!==Lt){switch(Lt){case ap:i.depthFunc(i.NEVER);break;case cp:i.depthFunc(i.ALWAYS);break;case lp:i.depthFunc(i.LESS);break;case _o:i.depthFunc(i.LEQUAL);break;case hp:i.depthFunc(i.EQUAL);break;case up:i.depthFunc(i.GEQUAL);break;case fp:i.depthFunc(i.GREATER);break;case dp:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}gt=Lt}},setLocked:function(Lt){I=Lt},setClear:function(Lt){It!==Lt&&(i.clearDepth(Lt),It=Lt)},reset:function(){I=!1,lt=null,gt=null,It=null}}}function o(){let I=!1,lt=null,gt=null,It=null,Lt=null,Qt=null,te=null,pe=null,ge=null;return{setTest:function(ee){I||(ee?Ot(i.STENCIL_TEST):Dt(i.STENCIL_TEST))},setMask:function(ee){lt!==ee&&!I&&(i.stencilMask(ee),lt=ee)},setFunc:function(ee,_e,yn){(gt!==ee||It!==_e||Lt!==yn)&&(i.stencilFunc(ee,_e,yn),gt=ee,It=_e,Lt=yn)},setOp:function(ee,_e,yn){(Qt!==ee||te!==_e||pe!==yn)&&(i.stencilOp(ee,_e,yn),Qt=ee,te=_e,pe=yn)},setLocked:function(ee){I=ee},setClear:function(ee){ge!==ee&&(i.clearStencil(ee),ge=ee)},reset:function(){I=!1,lt=null,gt=null,It=null,Lt=null,Qt=null,te=null,pe=null,ge=null}}}const a=new s,c=new r,l=new o,h=new WeakMap,u=new WeakMap;let d={},f={},g=new WeakMap,v=[],m=null,p=!1,x=null,y=null,_=null,R=null,S=null,E=null,N=null,M=new qt(0,0,0),w=0,B=!1,W=null,nt=null,U=null,k=null,$=null;const tt=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,Y=0;const K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(K)[1]),q=Y>=1):K.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),q=Y>=2);let ot=null,at={};const j=i.getParameter(i.SCISSOR_BOX),Z=i.getParameter(i.VIEWPORT),dt=new le().fromArray(j),wt=new le().fromArray(Z);function St(I,lt,gt,It){const Lt=new Uint8Array(4),Qt=i.createTexture();i.bindTexture(I,Qt),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let te=0;te<gt;te++)n&&(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)?i.texImage3D(lt,0,i.RGBA,1,1,It,0,i.RGBA,i.UNSIGNED_BYTE,Lt):i.texImage2D(lt+te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Lt);return Qt}const Nt={};Nt[i.TEXTURE_2D]=St(i.TEXTURE_2D,i.TEXTURE_2D,1),Nt[i.TEXTURE_CUBE_MAP]=St(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Nt[i.TEXTURE_2D_ARRAY]=St(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Nt[i.TEXTURE_3D]=St(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Ot(i.DEPTH_TEST),c.setFunc(_o),Ht(!1),A(ol),Ot(i.CULL_FACE),xt(ri);function Ot(I){d[I]!==!0&&(i.enable(I),d[I]=!0)}function Dt(I){d[I]!==!1&&(i.disable(I),d[I]=!1)}function jt(I,lt){return f[I]!==lt?(i.bindFramebuffer(I,lt),f[I]=lt,n&&(I===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=lt),I===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=lt)),!0):!1}function z(I,lt){let gt=v,It=!1;if(I)if(gt=g.get(lt),gt===void 0&&(gt=[],g.set(lt,gt)),I.isWebGLMultipleRenderTargets){const Lt=I.texture;if(gt.length!==Lt.length||gt[0]!==i.COLOR_ATTACHMENT0){for(let Qt=0,te=Lt.length;Qt<te;Qt++)gt[Qt]=i.COLOR_ATTACHMENT0+Qt;gt.length=Lt.length,It=!0}}else gt[0]!==i.COLOR_ATTACHMENT0&&(gt[0]=i.COLOR_ATTACHMENT0,It=!0);else gt[0]!==i.BACK&&(gt[0]=i.BACK,It=!0);It&&(e.isWebGL2?i.drawBuffers(gt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(gt))}function de(I){return m!==I?(i.useProgram(I),m=I,!0):!1}const bt={[wi]:i.FUNC_ADD,[jd]:i.FUNC_SUBTRACT,[Xd]:i.FUNC_REVERSE_SUBTRACT};if(n)bt[hl]=i.MIN,bt[ul]=i.MAX;else{const I=t.get("EXT_blend_minmax");I!==null&&(bt[hl]=I.MIN_EXT,bt[ul]=I.MAX_EXT)}const Rt={[qd]:i.ZERO,[Yd]:i.ONE,[Kd]:i.SRC_COLOR,[tc]:i.SRC_ALPHA,[np]:i.SRC_ALPHA_SATURATE,[tp]:i.DST_COLOR,[Zd]:i.DST_ALPHA,[Jd]:i.ONE_MINUS_SRC_COLOR,[ec]:i.ONE_MINUS_SRC_ALPHA,[ep]:i.ONE_MINUS_DST_COLOR,[Qd]:i.ONE_MINUS_DST_ALPHA,[ip]:i.CONSTANT_COLOR,[sp]:i.ONE_MINUS_CONSTANT_COLOR,[rp]:i.CONSTANT_ALPHA,[op]:i.ONE_MINUS_CONSTANT_ALPHA};function xt(I,lt,gt,It,Lt,Qt,te,pe,ge,ee){if(I===ri){p===!0&&(Dt(i.BLEND),p=!1);return}if(p===!1&&(Ot(i.BLEND),p=!0),I!==$d){if(I!==x||ee!==B){if((y!==wi||S!==wi)&&(i.blendEquation(i.FUNC_ADD),y=wi,S=wi),ee)switch(I){case ms:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case al:i.blendFunc(i.ONE,i.ONE);break;case cl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ll:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case ms:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case al:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case cl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ll:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}_=null,R=null,E=null,N=null,M.set(0,0,0),w=0,x=I,B=ee}return}Lt=Lt||lt,Qt=Qt||gt,te=te||It,(lt!==y||Lt!==S)&&(i.blendEquationSeparate(bt[lt],bt[Lt]),y=lt,S=Lt),(gt!==_||It!==R||Qt!==E||te!==N)&&(i.blendFuncSeparate(Rt[gt],Rt[It],Rt[Qt],Rt[te]),_=gt,R=It,E=Qt,N=te),(pe.equals(M)===!1||ge!==w)&&(i.blendColor(pe.r,pe.g,pe.b,ge),M.copy(pe),w=ge),x=I,B=!1}function oe(I,lt){I.side===en?Dt(i.CULL_FACE):Ot(i.CULL_FACE);let gt=I.side===qe;lt&&(gt=!gt),Ht(gt),I.blending===ms&&I.transparent===!1?xt(ri):xt(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),c.setFunc(I.depthFunc),c.setTest(I.depthTest),c.setMask(I.depthWrite),a.setMask(I.colorWrite);const It=I.stencilWrite;l.setTest(It),It&&(l.setMask(I.stencilWriteMask),l.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),l.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),F(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?Ot(i.SAMPLE_ALPHA_TO_COVERAGE):Dt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ht(I){W!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),W=I)}function A(I){I!==Wd?(Ot(i.CULL_FACE),I!==nt&&(I===ol?i.cullFace(i.BACK):I===Gd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Dt(i.CULL_FACE),nt=I}function b(I){I!==U&&(q&&i.lineWidth(I),U=I)}function F(I,lt,gt){I?(Ot(i.POLYGON_OFFSET_FILL),(k!==lt||$!==gt)&&(i.polygonOffset(lt,gt),k=lt,$=gt)):Dt(i.POLYGON_OFFSET_FILL)}function rt(I){I?Ot(i.SCISSOR_TEST):Dt(i.SCISSOR_TEST)}function L(I){I===void 0&&(I=i.TEXTURE0+tt-1),ot!==I&&(i.activeTexture(I),ot=I)}function D(I,lt,gt){gt===void 0&&(ot===null?gt=i.TEXTURE0+tt-1:gt=ot);let It=at[gt];It===void 0&&(It={type:void 0,texture:void 0},at[gt]=It),(It.type!==I||It.texture!==lt)&&(ot!==gt&&(i.activeTexture(gt),ot=gt),i.bindTexture(I,lt||Nt[I]),It.type=I,It.texture=lt)}function X(){const I=at[ot];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function et(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Q(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ut(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ct(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function J(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Zt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Wt(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function zt(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Pt(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function _t(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function P(I){dt.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),dt.copy(I))}function ct(I){wt.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),wt.copy(I))}function Tt(I,lt){let gt=u.get(lt);gt===void 0&&(gt=new WeakMap,u.set(lt,gt));let It=gt.get(I);It===void 0&&(It=i.getUniformBlockIndex(lt,I.name),gt.set(I,It))}function Mt(I,lt){const It=u.get(lt).get(I);h.get(lt)!==It&&(i.uniformBlockBinding(lt,It,I.__bindingPointIndex),h.set(lt,It))}function it(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},ot=null,at={},f={},g=new WeakMap,v=[],m=null,p=!1,x=null,y=null,_=null,R=null,S=null,E=null,N=null,M=new qt(0,0,0),w=0,B=!1,W=null,nt=null,U=null,k=null,$=null,dt.set(0,0,i.canvas.width,i.canvas.height),wt.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:Ot,disable:Dt,bindFramebuffer:jt,drawBuffers:z,useProgram:de,setBlending:xt,setMaterial:oe,setFlipSided:Ht,setCullFace:A,setLineWidth:b,setPolygonOffset:F,setScissorTest:rt,activeTexture:L,bindTexture:D,unbindTexture:X,compressedTexImage2D:et,compressedTexImage3D:Q,texImage2D:Pt,texImage3D:_t,updateUBOMapping:Tt,uniformBlockBinding:Mt,texStorage2D:Wt,texStorage3D:zt,texSubImage2D:ut,texSubImage3D:Ct,compressedTexSubImage2D:J,compressedTexSubImage3D:Zt,scissor:P,viewport:ct,reset:it}}function Hx(i,t,e,n,s,r,o){const a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,b){return f?new OffscreenCanvas(A,b):Eo("canvas")}function v(A,b,F,rt){let L=1;if((A.width>rt||A.height>rt)&&(L=rt/Math.max(A.width,A.height)),L<1||b===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){const D=b?ac:Math.floor,X=D(L*A.width),et=D(L*A.height);u===void 0&&(u=g(X,et));const Q=F?g(X,et):u;return Q.width=X,Q.height=et,Q.getContext("2d").drawImage(A,0,0,X,et),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+X+"x"+et+")."),Q}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function m(A){return Hl(A.width)&&Hl(A.height)}function p(A){return a?!1:A.wrapS!==vn||A.wrapT!==vn||A.minFilter!==De&&A.minFilter!==Xe}function x(A,b){return A.generateMipmaps&&b&&A.minFilter!==De&&A.minFilter!==Xe}function y(A){i.generateMipmap(A)}function _(A,b,F,rt,L=!1){if(a===!1)return b;if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let D=b;if(b===i.RED&&(F===i.FLOAT&&(D=i.R32F),F===i.HALF_FLOAT&&(D=i.R16F),F===i.UNSIGNED_BYTE&&(D=i.R8)),b===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(D=i.R8UI),F===i.UNSIGNED_SHORT&&(D=i.R16UI),F===i.UNSIGNED_INT&&(D=i.R32UI),F===i.BYTE&&(D=i.R8I),F===i.SHORT&&(D=i.R16I),F===i.INT&&(D=i.R32I)),b===i.RG&&(F===i.FLOAT&&(D=i.RG32F),F===i.HALF_FLOAT&&(D=i.RG16F),F===i.UNSIGNED_BYTE&&(D=i.RG8)),b===i.RGBA){const X=L?Mo:ae.getTransfer(rt);F===i.FLOAT&&(D=i.RGBA32F),F===i.HALF_FLOAT&&(D=i.RGBA16F),F===i.UNSIGNED_BYTE&&(D=X===ce?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(D=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(D=i.RGB5_A1)}return(D===i.R16F||D===i.R32F||D===i.RG16F||D===i.RG32F||D===i.RGBA16F||D===i.RGBA32F)&&t.get("EXT_color_buffer_float"),D}function R(A,b,F){return x(A,F)===!0||A.isFramebufferTexture&&A.minFilter!==De&&A.minFilter!==Xe?Math.log2(Math.max(b.width,b.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?b.mipmaps.length:1}function S(A){return A===De||A===fl||A===Zo?i.NEAREST:i.LINEAR}function E(A){const b=A.target;b.removeEventListener("dispose",E),M(b),b.isVideoTexture&&h.delete(b)}function N(A){const b=A.target;b.removeEventListener("dispose",N),B(b)}function M(A){const b=n.get(A);if(b.__webglInit===void 0)return;const F=A.source,rt=d.get(F);if(rt){const L=rt[b.__cacheKey];L.usedTimes--,L.usedTimes===0&&w(A),Object.keys(rt).length===0&&d.delete(F)}n.remove(A)}function w(A){const b=n.get(A);i.deleteTexture(b.__webglTexture);const F=A.source,rt=d.get(F);delete rt[b.__cacheKey],o.memory.textures--}function B(A){const b=A.texture,F=n.get(A),rt=n.get(b);if(rt.__webglTexture!==void 0&&(i.deleteTexture(rt.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let L=0;L<6;L++){if(Array.isArray(F.__webglFramebuffer[L]))for(let D=0;D<F.__webglFramebuffer[L].length;D++)i.deleteFramebuffer(F.__webglFramebuffer[L][D]);else i.deleteFramebuffer(F.__webglFramebuffer[L]);F.__webglDepthbuffer&&i.deleteRenderbuffer(F.__webglDepthbuffer[L])}else{if(Array.isArray(F.__webglFramebuffer))for(let L=0;L<F.__webglFramebuffer.length;L++)i.deleteFramebuffer(F.__webglFramebuffer[L]);else i.deleteFramebuffer(F.__webglFramebuffer);if(F.__webglDepthbuffer&&i.deleteRenderbuffer(F.__webglDepthbuffer),F.__webglMultisampledFramebuffer&&i.deleteFramebuffer(F.__webglMultisampledFramebuffer),F.__webglColorRenderbuffer)for(let L=0;L<F.__webglColorRenderbuffer.length;L++)F.__webglColorRenderbuffer[L]&&i.deleteRenderbuffer(F.__webglColorRenderbuffer[L]);F.__webglDepthRenderbuffer&&i.deleteRenderbuffer(F.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let L=0,D=b.length;L<D;L++){const X=n.get(b[L]);X.__webglTexture&&(i.deleteTexture(X.__webglTexture),o.memory.textures--),n.remove(b[L])}n.remove(b),n.remove(A)}let W=0;function nt(){W=0}function U(){const A=W;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),W+=1,A}function k(A){const b=[];return b.push(A.wrapS),b.push(A.wrapT),b.push(A.wrapR||0),b.push(A.magFilter),b.push(A.minFilter),b.push(A.anisotropy),b.push(A.internalFormat),b.push(A.format),b.push(A.type),b.push(A.generateMipmaps),b.push(A.premultiplyAlpha),b.push(A.flipY),b.push(A.unpackAlignment),b.push(A.colorSpace),b.join()}function $(A,b){const F=n.get(A);if(A.isVideoTexture&&oe(A),A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){const rt=A.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{dt(F,A,b);return}}e.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+b)}function tt(A,b){const F=n.get(A);if(A.version>0&&F.__version!==A.version){dt(F,A,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+b)}function q(A,b){const F=n.get(A);if(A.version>0&&F.__version!==A.version){dt(F,A,b);return}e.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+b)}function Y(A,b){const F=n.get(A);if(A.version>0&&F.__version!==A.version){wt(F,A,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+b)}const K={[yo]:i.REPEAT,[vn]:i.CLAMP_TO_EDGE,[sc]:i.MIRRORED_REPEAT},ot={[De]:i.NEAREST,[fl]:i.NEAREST_MIPMAP_NEAREST,[Zo]:i.NEAREST_MIPMAP_LINEAR,[Xe]:i.LINEAR,[Mp]:i.LINEAR_MIPMAP_NEAREST,[lr]:i.LINEAR_MIPMAP_LINEAR},at={[Ip]:i.NEVER,[kp]:i.ALWAYS,[Up]:i.LESS,[af]:i.LEQUAL,[Np]:i.EQUAL,[Fp]:i.GEQUAL,[Op]:i.GREATER,[zp]:i.NOTEQUAL};function j(A,b,F){if(F?(i.texParameteri(A,i.TEXTURE_WRAP_S,K[b.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,K[b.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,K[b.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,ot[b.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,ot[b.minFilter])):(i.texParameteri(A,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(A,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(b.wrapS!==vn||b.wrapT!==vn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(A,i.TEXTURE_MAG_FILTER,S(b.magFilter)),i.texParameteri(A,i.TEXTURE_MIN_FILTER,S(b.minFilter)),b.minFilter!==De&&b.minFilter!==Xe&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),b.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,at[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const rt=t.get("EXT_texture_filter_anisotropic");if(b.magFilter===De||b.minFilter!==Zo&&b.minFilter!==lr||b.type===ii&&t.has("OES_texture_float_linear")===!1||a===!1&&b.type===hr&&t.has("OES_texture_half_float_linear")===!1)return;(b.anisotropy>1||n.get(b).__currentAnisotropy)&&(i.texParameterf(A,rt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy)}}function Z(A,b){let F=!1;A.__webglInit===void 0&&(A.__webglInit=!0,b.addEventListener("dispose",E));const rt=b.source;let L=d.get(rt);L===void 0&&(L={},d.set(rt,L));const D=k(b);if(D!==A.__cacheKey){L[D]===void 0&&(L[D]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,F=!0),L[D].usedTimes++;const X=L[A.__cacheKey];X!==void 0&&(L[A.__cacheKey].usedTimes--,X.usedTimes===0&&w(b)),A.__cacheKey=D,A.__webglTexture=L[D].texture}return F}function dt(A,b,F){let rt=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(rt=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(rt=i.TEXTURE_3D);const L=Z(A,b),D=b.source;e.bindTexture(rt,A.__webglTexture,i.TEXTURE0+F);const X=n.get(D);if(D.version!==X.__version||L===!0){e.activeTexture(i.TEXTURE0+F);const et=ae.getPrimaries(ae.workingColorSpace),Q=b.colorSpace===cn?null:ae.getPrimaries(b.colorSpace),ut=b.colorSpace===cn||et===Q?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);const Ct=p(b)&&m(b.image)===!1;let J=v(b.image,Ct,!1,s.maxTextureSize);J=Ht(b,J);const Zt=m(J)||a,Wt=r.convert(b.format,b.colorSpace);let zt=r.convert(b.type),Pt=_(b.internalFormat,Wt,zt,b.colorSpace,b.isVideoTexture);j(rt,b,Zt);let _t;const P=b.mipmaps,ct=a&&b.isVideoTexture!==!0&&Pt!==rf,Tt=X.__version===void 0||L===!0,Mt=R(b,J,Zt);if(b.isDepthTexture)Pt=i.DEPTH_COMPONENT,a?b.type===ii?Pt=i.DEPTH_COMPONENT32F:b.type===ni?Pt=i.DEPTH_COMPONENT24:b.type===Ri?Pt=i.DEPTH24_STENCIL8:Pt=i.DEPTH_COMPONENT16:b.type===ii&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),b.format===Ci&&Pt===i.DEPTH_COMPONENT&&b.type!==Rc&&b.type!==ni&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),b.type=ni,zt=r.convert(b.type)),b.format===ws&&Pt===i.DEPTH_COMPONENT&&(Pt=i.DEPTH_STENCIL,b.type!==Ri&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),b.type=Ri,zt=r.convert(b.type))),Tt&&(ct?e.texStorage2D(i.TEXTURE_2D,1,Pt,J.width,J.height):e.texImage2D(i.TEXTURE_2D,0,Pt,J.width,J.height,0,Wt,zt,null));else if(b.isDataTexture)if(P.length>0&&Zt){ct&&Tt&&e.texStorage2D(i.TEXTURE_2D,Mt,Pt,P[0].width,P[0].height);for(let it=0,I=P.length;it<I;it++)_t=P[it],ct?e.texSubImage2D(i.TEXTURE_2D,it,0,0,_t.width,_t.height,Wt,zt,_t.data):e.texImage2D(i.TEXTURE_2D,it,Pt,_t.width,_t.height,0,Wt,zt,_t.data);b.generateMipmaps=!1}else ct?(Tt&&e.texStorage2D(i.TEXTURE_2D,Mt,Pt,J.width,J.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,J.width,J.height,Wt,zt,J.data)):e.texImage2D(i.TEXTURE_2D,0,Pt,J.width,J.height,0,Wt,zt,J.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){ct&&Tt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,Pt,P[0].width,P[0].height,J.depth);for(let it=0,I=P.length;it<I;it++)_t=P[it],b.format!==an?Wt!==null?ct?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,_t.width,_t.height,J.depth,Wt,_t.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,Pt,_t.width,_t.height,J.depth,0,_t.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ct?e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,_t.width,_t.height,J.depth,Wt,zt,_t.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,Pt,_t.width,_t.height,J.depth,0,Wt,zt,_t.data)}else{ct&&Tt&&e.texStorage2D(i.TEXTURE_2D,Mt,Pt,P[0].width,P[0].height);for(let it=0,I=P.length;it<I;it++)_t=P[it],b.format!==an?Wt!==null?ct?e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,_t.width,_t.height,Wt,_t.data):e.compressedTexImage2D(i.TEXTURE_2D,it,Pt,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ct?e.texSubImage2D(i.TEXTURE_2D,it,0,0,_t.width,_t.height,Wt,zt,_t.data):e.texImage2D(i.TEXTURE_2D,it,Pt,_t.width,_t.height,0,Wt,zt,_t.data)}else if(b.isDataArrayTexture)ct?(Tt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,Pt,J.width,J.height,J.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,Wt,zt,J.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Pt,J.width,J.height,J.depth,0,Wt,zt,J.data);else if(b.isData3DTexture)ct?(Tt&&e.texStorage3D(i.TEXTURE_3D,Mt,Pt,J.width,J.height,J.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,Wt,zt,J.data)):e.texImage3D(i.TEXTURE_3D,0,Pt,J.width,J.height,J.depth,0,Wt,zt,J.data);else if(b.isFramebufferTexture){if(Tt)if(ct)e.texStorage2D(i.TEXTURE_2D,Mt,Pt,J.width,J.height);else{let it=J.width,I=J.height;for(let lt=0;lt<Mt;lt++)e.texImage2D(i.TEXTURE_2D,lt,Pt,it,I,0,Wt,zt,null),it>>=1,I>>=1}}else if(P.length>0&&Zt){ct&&Tt&&e.texStorage2D(i.TEXTURE_2D,Mt,Pt,P[0].width,P[0].height);for(let it=0,I=P.length;it<I;it++)_t=P[it],ct?e.texSubImage2D(i.TEXTURE_2D,it,0,0,Wt,zt,_t):e.texImage2D(i.TEXTURE_2D,it,Pt,Wt,zt,_t);b.generateMipmaps=!1}else ct?(Tt&&e.texStorage2D(i.TEXTURE_2D,Mt,Pt,J.width,J.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Wt,zt,J)):e.texImage2D(i.TEXTURE_2D,0,Pt,Wt,zt,J);x(b,Zt)&&y(rt),X.__version=D.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function wt(A,b,F){if(b.image.length!==6)return;const rt=Z(A,b),L=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+F);const D=n.get(L);if(L.version!==D.__version||rt===!0){e.activeTexture(i.TEXTURE0+F);const X=ae.getPrimaries(ae.workingColorSpace),et=b.colorSpace===cn?null:ae.getPrimaries(b.colorSpace),Q=b.colorSpace===cn||X===et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);const ut=b.isCompressedTexture||b.image[0].isCompressedTexture,Ct=b.image[0]&&b.image[0].isDataTexture,J=[];for(let it=0;it<6;it++)!ut&&!Ct?J[it]=v(b.image[it],!1,!0,s.maxCubemapSize):J[it]=Ct?b.image[it].image:b.image[it],J[it]=Ht(b,J[it]);const Zt=J[0],Wt=m(Zt)||a,zt=r.convert(b.format,b.colorSpace),Pt=r.convert(b.type),_t=_(b.internalFormat,zt,Pt,b.colorSpace),P=a&&b.isVideoTexture!==!0,ct=D.__version===void 0||rt===!0;let Tt=R(b,Zt,Wt);j(i.TEXTURE_CUBE_MAP,b,Wt);let Mt;if(ut){P&&ct&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Tt,_t,Zt.width,Zt.height);for(let it=0;it<6;it++){Mt=J[it].mipmaps;for(let I=0;I<Mt.length;I++){const lt=Mt[I];b.format!==an?zt!==null?P?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,I,0,0,lt.width,lt.height,zt,lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,I,_t,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,I,0,0,lt.width,lt.height,zt,Pt,lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,I,_t,lt.width,lt.height,0,zt,Pt,lt.data)}}}else{Mt=b.mipmaps,P&&ct&&(Mt.length>0&&Tt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Tt,_t,J[0].width,J[0].height));for(let it=0;it<6;it++)if(Ct){P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,J[it].width,J[it].height,zt,Pt,J[it].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,_t,J[it].width,J[it].height,0,zt,Pt,J[it].data);for(let I=0;I<Mt.length;I++){const gt=Mt[I].image[it].image;P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,I+1,0,0,gt.width,gt.height,zt,Pt,gt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,I+1,_t,gt.width,gt.height,0,zt,Pt,gt.data)}}else{P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,zt,Pt,J[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,_t,zt,Pt,J[it]);for(let I=0;I<Mt.length;I++){const lt=Mt[I];P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,I+1,0,0,zt,Pt,lt.image[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,I+1,_t,zt,Pt,lt.image[it])}}}x(b,Wt)&&y(i.TEXTURE_CUBE_MAP),D.__version=L.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function St(A,b,F,rt,L,D){const X=r.convert(F.format,F.colorSpace),et=r.convert(F.type),Q=_(F.internalFormat,X,et,F.colorSpace);if(!n.get(b).__hasExternalTextures){const Ct=Math.max(1,b.width>>D),J=Math.max(1,b.height>>D);L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?e.texImage3D(L,D,Q,Ct,J,b.depth,0,X,et,null):e.texImage2D(L,D,Q,Ct,J,0,X,et,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),xt(b)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,rt,L,n.get(F).__webglTexture,0,Rt(b)):(L===i.TEXTURE_2D||L>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&L<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,rt,L,n.get(F).__webglTexture,D),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Nt(A,b,F){if(i.bindRenderbuffer(i.RENDERBUFFER,A),b.depthBuffer&&!b.stencilBuffer){let rt=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(F||xt(b)){const L=b.depthTexture;L&&L.isDepthTexture&&(L.type===ii?rt=i.DEPTH_COMPONENT32F:L.type===ni&&(rt=i.DEPTH_COMPONENT24));const D=Rt(b);xt(b)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,D,rt,b.width,b.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,D,rt,b.width,b.height)}else i.renderbufferStorage(i.RENDERBUFFER,rt,b.width,b.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,A)}else if(b.depthBuffer&&b.stencilBuffer){const rt=Rt(b);F&&xt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt,i.DEPTH24_STENCIL8,b.width,b.height):xt(b)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt,i.DEPTH24_STENCIL8,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,A)}else{const rt=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let L=0;L<rt.length;L++){const D=rt[L],X=r.convert(D.format,D.colorSpace),et=r.convert(D.type),Q=_(D.internalFormat,X,et,D.colorSpace),ut=Rt(b);F&&xt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ut,Q,b.width,b.height):xt(b)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ut,Q,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,Q,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ot(A,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),$(b.depthTexture,0);const rt=n.get(b.depthTexture).__webglTexture,L=Rt(b);if(b.depthTexture.format===Ci)xt(b)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0,L):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0);else if(b.depthTexture.format===ws)xt(b)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0,L):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0);else throw new Error("Unknown depthTexture format")}function Dt(A){const b=n.get(A),F=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!b.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");Ot(b.__webglFramebuffer,A)}else if(F){b.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[rt]),b.__webglDepthbuffer[rt]=i.createRenderbuffer(),Nt(b.__webglDepthbuffer[rt],A,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=i.createRenderbuffer(),Nt(b.__webglDepthbuffer,A,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function jt(A,b,F){const rt=n.get(A);b!==void 0&&St(rt.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&Dt(A)}function z(A){const b=A.texture,F=n.get(A),rt=n.get(b);A.addEventListener("dispose",N),A.isWebGLMultipleRenderTargets!==!0&&(rt.__webglTexture===void 0&&(rt.__webglTexture=i.createTexture()),rt.__version=b.version,o.memory.textures++);const L=A.isWebGLCubeRenderTarget===!0,D=A.isWebGLMultipleRenderTargets===!0,X=m(A)||a;if(L){F.__webglFramebuffer=[];for(let et=0;et<6;et++)if(a&&b.mipmaps&&b.mipmaps.length>0){F.__webglFramebuffer[et]=[];for(let Q=0;Q<b.mipmaps.length;Q++)F.__webglFramebuffer[et][Q]=i.createFramebuffer()}else F.__webglFramebuffer[et]=i.createFramebuffer()}else{if(a&&b.mipmaps&&b.mipmaps.length>0){F.__webglFramebuffer=[];for(let et=0;et<b.mipmaps.length;et++)F.__webglFramebuffer[et]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(D)if(s.drawBuffers){const et=A.texture;for(let Q=0,ut=et.length;Q<ut;Q++){const Ct=n.get(et[Q]);Ct.__webglTexture===void 0&&(Ct.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&A.samples>0&&xt(A)===!1){const et=D?b:[b];F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let Q=0;Q<et.length;Q++){const ut=et[Q];F.__webglColorRenderbuffer[Q]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[Q]);const Ct=r.convert(ut.format,ut.colorSpace),J=r.convert(ut.type),Zt=_(ut.internalFormat,Ct,J,ut.colorSpace,A.isXRRenderTarget===!0),Wt=Rt(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,Zt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.RENDERBUFFER,F.__webglColorRenderbuffer[Q])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),Nt(F.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(L){e.bindTexture(i.TEXTURE_CUBE_MAP,rt.__webglTexture),j(i.TEXTURE_CUBE_MAP,b,X);for(let et=0;et<6;et++)if(a&&b.mipmaps&&b.mipmaps.length>0)for(let Q=0;Q<b.mipmaps.length;Q++)St(F.__webglFramebuffer[et][Q],A,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Q);else St(F.__webglFramebuffer[et],A,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0);x(b,X)&&y(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(D){const et=A.texture;for(let Q=0,ut=et.length;Q<ut;Q++){const Ct=et[Q],J=n.get(Ct);e.bindTexture(i.TEXTURE_2D,J.__webglTexture),j(i.TEXTURE_2D,Ct,X),St(F.__webglFramebuffer,A,Ct,i.COLOR_ATTACHMENT0+Q,i.TEXTURE_2D,0),x(Ct,X)&&y(i.TEXTURE_2D)}e.unbindTexture()}else{let et=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(a?et=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(et,rt.__webglTexture),j(et,b,X),a&&b.mipmaps&&b.mipmaps.length>0)for(let Q=0;Q<b.mipmaps.length;Q++)St(F.__webglFramebuffer[Q],A,b,i.COLOR_ATTACHMENT0,et,Q);else St(F.__webglFramebuffer,A,b,i.COLOR_ATTACHMENT0,et,0);x(b,X)&&y(et),e.unbindTexture()}A.depthBuffer&&Dt(A)}function de(A){const b=m(A)||a,F=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let rt=0,L=F.length;rt<L;rt++){const D=F[rt];if(x(D,b)){const X=A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,et=n.get(D).__webglTexture;e.bindTexture(X,et),y(X),e.unbindTexture()}}}function bt(A){if(a&&A.samples>0&&xt(A)===!1){const b=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],F=A.width,rt=A.height;let L=i.COLOR_BUFFER_BIT;const D=[],X=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=n.get(A),Q=A.isWebGLMultipleRenderTargets===!0;if(Q)for(let ut=0;ut<b.length;ut++)e.bindFramebuffer(i.FRAMEBUFFER,et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,et.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,et.__webglFramebuffer);for(let ut=0;ut<b.length;ut++){D.push(i.COLOR_ATTACHMENT0+ut),A.depthBuffer&&D.push(X);const Ct=et.__ignoreDepthValues!==void 0?et.__ignoreDepthValues:!1;if(Ct===!1&&(A.depthBuffer&&(L|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&(L|=i.STENCIL_BUFFER_BIT)),Q&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,et.__webglColorRenderbuffer[ut]),Ct===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[X]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[X])),Q){const J=n.get(b[ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,J,0)}i.blitFramebuffer(0,0,F,rt,0,0,F,rt,L,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,D)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Q)for(let ut=0;ut<b.length;ut++){e.bindFramebuffer(i.FRAMEBUFFER,et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,et.__webglColorRenderbuffer[ut]);const Ct=n.get(b[ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,Ct,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,et.__webglMultisampledFramebuffer)}}function Rt(A){return Math.min(s.maxSamples,A.samples)}function xt(A){const b=n.get(A);return a&&A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function oe(A){const b=o.render.frame;h.get(A)!==b&&(h.set(A,b),A.update())}function Ht(A,b){const F=A.colorSpace,rt=A.format,L=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===rc||F!==jn&&F!==cn&&(ae.getTransfer(F)===ce?a===!1?t.has("EXT_sRGB")===!0&&rt===an?(A.format=rc,A.minFilter=Xe,A.generateMipmaps=!1):b=lf.sRGBToLinear(b):(rt!==an||L!==ai)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),b}this.allocateTextureUnit=U,this.resetTextureUnits=nt,this.setTexture2D=$,this.setTexture2DArray=tt,this.setTexture3D=q,this.setTextureCube=Y,this.rebindTextures=jt,this.setupRenderTarget=z,this.updateRenderTargetMipmap=de,this.updateMultisampleRenderTarget=bt,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=St,this.useMultisampledRTT=xt}function Vx(i,t,e){const n=e.isWebGL2;function s(r,o=cn){let a;const c=ae.getTransfer(o);if(r===ai)return i.UNSIGNED_BYTE;if(r===Qu)return i.UNSIGNED_SHORT_4_4_4_4;if(r===tf)return i.UNSIGNED_SHORT_5_5_5_1;if(r===bp)return i.BYTE;if(r===Sp)return i.SHORT;if(r===Rc)return i.UNSIGNED_SHORT;if(r===Zu)return i.INT;if(r===ni)return i.UNSIGNED_INT;if(r===ii)return i.FLOAT;if(r===hr)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===wp)return i.ALPHA;if(r===an)return i.RGBA;if(r===Ep)return i.LUMINANCE;if(r===Tp)return i.LUMINANCE_ALPHA;if(r===Ci)return i.DEPTH_COMPONENT;if(r===ws)return i.DEPTH_STENCIL;if(r===rc)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Ap)return i.RED;if(r===ef)return i.RED_INTEGER;if(r===Rp)return i.RG;if(r===nf)return i.RG_INTEGER;if(r===sf)return i.RGBA_INTEGER;if(r===Qo||r===ta||r===ea||r===na)if(c===ce)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Qo)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ta)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ea)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===na)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Qo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ta)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ea)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===na)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===dl||r===pl||r===ml||r===gl)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===dl)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===pl)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===ml)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===gl)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===rf)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===vl||r===xl)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===vl)return c===ce?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===xl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===_l||r===yl||r===Ml||r===bl||r===Sl||r===wl||r===El||r===Tl||r===Al||r===Rl||r===Cl||r===Pl||r===Ll||r===Dl)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===_l)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===yl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Ml)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===bl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Sl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===wl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===El)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Tl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Al)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Rl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Cl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Pl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Ll)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Dl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ia||r===Il||r===Ul)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===ia)return c===ce?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Il)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Ul)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Cp||r===Nl||r===Ol||r===zl)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===ia)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Nl)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Ol)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===zl)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Ri?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class Wx extends tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class kt extends Pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Gx={type:"move"};class Aa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new kt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new kt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new kt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Gx)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new kt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class $x extends Fi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const v=e.getContextAttributes();let m=null,p=null;const x=[],y=[],_=new mt;let R=null;const S=new tn;S.layers.enable(1),S.viewport=new le;const E=new tn;E.layers.enable(2),E.viewport=new le;const N=[S,E],M=new Wx;M.layers.enable(1),M.layers.enable(2);let w=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let Z=x[j];return Z===void 0&&(Z=new Aa,x[j]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(j){let Z=x[j];return Z===void 0&&(Z=new Aa,x[j]=Z),Z.getGripSpace()},this.getHand=function(j){let Z=x[j];return Z===void 0&&(Z=new Aa,x[j]=Z),Z.getHandSpace()};function W(j){const Z=y.indexOf(j.inputSource);if(Z===-1)return;const dt=x[Z];dt!==void 0&&(dt.update(j.inputSource,j.frame,l||o),dt.dispatchEvent({type:j.type,data:j.inputSource}))}function nt(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",nt),s.removeEventListener("inputsourceschange",U);for(let j=0;j<x.length;j++){const Z=y[j];Z!==null&&(y[j]=null,x[j].disconnect(Z))}w=null,B=null,t.setRenderTarget(m),f=null,d=null,u=null,s=null,p=null,at.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(_.width,_.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",nt),s.addEventListener("inputsourceschange",U),v.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(_),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const Z={antialias:s.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Z),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new Ii(f.framebufferWidth,f.framebufferHeight,{format:an,type:ai,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let Z=null,dt=null,wt=null;v.depth&&(wt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Z=v.stencil?ws:Ci,dt=v.stencil?Ri:ni);const St={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(St),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),p=new Ii(d.textureWidth,d.textureHeight,{format:an,type:ai,depthTexture:new yf(d.textureWidth,d.textureHeight,dt,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});const Nt=t.properties.get(p);Nt.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),at.setContext(s),at.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function U(j){for(let Z=0;Z<j.removed.length;Z++){const dt=j.removed[Z],wt=y.indexOf(dt);wt>=0&&(y[wt]=null,x[wt].disconnect(dt))}for(let Z=0;Z<j.added.length;Z++){const dt=j.added[Z];let wt=y.indexOf(dt);if(wt===-1){for(let Nt=0;Nt<x.length;Nt++)if(Nt>=y.length){y.push(dt),wt=Nt;break}else if(y[Nt]===null){y[Nt]=dt,wt=Nt;break}if(wt===-1)break}const St=x[wt];St&&St.connect(dt)}}const k=new C,$=new C;function tt(j,Z,dt){k.setFromMatrixPosition(Z.matrixWorld),$.setFromMatrixPosition(dt.matrixWorld);const wt=k.distanceTo($),St=Z.projectionMatrix.elements,Nt=dt.projectionMatrix.elements,Ot=St[14]/(St[10]-1),Dt=St[14]/(St[10]+1),jt=(St[9]+1)/St[5],z=(St[9]-1)/St[5],de=(St[8]-1)/St[0],bt=(Nt[8]+1)/Nt[0],Rt=Ot*de,xt=Ot*bt,oe=wt/(-de+bt),Ht=oe*-de;Z.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Ht),j.translateZ(oe),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert();const A=Ot+oe,b=Dt+oe,F=Rt-Ht,rt=xt+(wt-Ht),L=jt*Dt/b*A,D=z*Dt/b*A;j.projectionMatrix.makePerspective(F,rt,L,D,A,b),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}function q(j,Z){Z===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(Z.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;M.near=E.near=S.near=j.near,M.far=E.far=S.far=j.far,(w!==M.near||B!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),w=M.near,B=M.far);const Z=j.parent,dt=M.cameras;q(M,Z);for(let wt=0;wt<dt.length;wt++)q(dt[wt],Z);dt.length===2?tt(M,S,E):M.projectionMatrix.copy(S.projectionMatrix),Y(j,M,Z)};function Y(j,Z,dt){dt===null?j.matrix.copy(Z.matrixWorld):(j.matrix.copy(dt.matrixWorld),j.matrix.invert(),j.matrix.multiply(Z.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(Z.projectionMatrix),j.projectionMatrixInverse.copy(Z.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=oc*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(j){c=j,d!==null&&(d.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)};let K=null;function ot(j,Z){if(h=Z.getViewerPose(l||o),g=Z,h!==null){const dt=h.views;f!==null&&(t.setRenderTargetFramebuffer(p,f.framebuffer),t.setRenderTarget(p));let wt=!1;dt.length!==M.cameras.length&&(M.cameras.length=0,wt=!0);for(let St=0;St<dt.length;St++){const Nt=dt[St];let Ot=null;if(f!==null)Ot=f.getViewport(Nt);else{const jt=u.getViewSubImage(d,Nt);Ot=jt.viewport,St===0&&(t.setRenderTargetTextures(p,jt.colorTexture,d.ignoreDepthValues?void 0:jt.depthStencilTexture),t.setRenderTarget(p))}let Dt=N[St];Dt===void 0&&(Dt=new tn,Dt.layers.enable(St),Dt.viewport=new le,N[St]=Dt),Dt.matrix.fromArray(Nt.transform.matrix),Dt.matrix.decompose(Dt.position,Dt.quaternion,Dt.scale),Dt.projectionMatrix.fromArray(Nt.projectionMatrix),Dt.projectionMatrixInverse.copy(Dt.projectionMatrix).invert(),Dt.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),St===0&&(M.matrix.copy(Dt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),wt===!0&&M.cameras.push(Dt)}}for(let dt=0;dt<x.length;dt++){const wt=y[dt],St=x[dt];wt!==null&&St!==void 0&&St.update(wt,Z,l||o)}K&&K(j,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const at=new xf;at.setAnimationLoop(ot),this.setAnimationLoop=function(j){K=j},this.dispose=function(){}}}function jx(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,mf(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,y,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,x,y):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===qe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===qe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p).envMap;if(x&&(m.envMap.value=x,m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const y=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*y,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=y*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===qe&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Xx(i,t,e,n){let s={},r={},o=[];const a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(x,y){const _=y.program;n.uniformBlockBinding(x,_)}function l(x,y){let _=s[x.id];_===void 0&&(g(x),_=h(x),s[x.id]=_,x.addEventListener("dispose",m));const R=y.program;n.updateUBOMapping(x,R);const S=t.render.frame;r[x.id]!==S&&(d(x),r[x.id]=S)}function h(x){const y=u();x.__bindingPointIndex=y;const _=i.createBuffer(),R=x.__size,S=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,R,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,_),_}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const y=s[x.id],_=x.uniforms,R=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let S=0,E=_.length;S<E;S++){const N=Array.isArray(_[S])?_[S]:[_[S]];for(let M=0,w=N.length;M<w;M++){const B=N[M];if(f(B,S,M,R)===!0){const W=B.__offset,nt=Array.isArray(B.value)?B.value:[B.value];let U=0;for(let k=0;k<nt.length;k++){const $=nt[k],tt=v($);typeof $=="number"||typeof $=="boolean"?(B.__data[0]=$,i.bufferSubData(i.UNIFORM_BUFFER,W+U,B.__data)):$.isMatrix3?(B.__data[0]=$.elements[0],B.__data[1]=$.elements[1],B.__data[2]=$.elements[2],B.__data[3]=0,B.__data[4]=$.elements[3],B.__data[5]=$.elements[4],B.__data[6]=$.elements[5],B.__data[7]=0,B.__data[8]=$.elements[6],B.__data[9]=$.elements[7],B.__data[10]=$.elements[8],B.__data[11]=0):($.toArray(B.__data,U),U+=tt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,W,B.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(x,y,_,R){const S=x.value,E=y+"_"+_;if(R[E]===void 0)return typeof S=="number"||typeof S=="boolean"?R[E]=S:R[E]=S.clone(),!0;{const N=R[E];if(typeof S=="number"||typeof S=="boolean"){if(N!==S)return R[E]=S,!0}else if(N.equals(S)===!1)return N.copy(S),!0}return!1}function g(x){const y=x.uniforms;let _=0;const R=16;for(let E=0,N=y.length;E<N;E++){const M=Array.isArray(y[E])?y[E]:[y[E]];for(let w=0,B=M.length;w<B;w++){const W=M[w],nt=Array.isArray(W.value)?W.value:[W.value];for(let U=0,k=nt.length;U<k;U++){const $=nt[U],tt=v($),q=_%R;q!==0&&R-q<tt.boundary&&(_+=R-q),W.__data=new Float32Array(tt.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=_,_+=tt.storage}}}const S=_%R;return S>0&&(_+=R-S),x.__size=_,x.__cache={},this}function v(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function m(x){const y=x.target;y.removeEventListener("dispose",m);const _=o.indexOf(y.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function p(){for(const x in s)i.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class Tf{constructor(t={}){const{canvas:e=Wp(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const f=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const p=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=be,this._useLegacyLights=!1,this.toneMapping=oi,this.toneMappingExposure=1;const y=this;let _=!1,R=0,S=0,E=null,N=-1,M=null;const w=new le,B=new le;let W=null;const nt=new qt(0);let U=0,k=e.width,$=e.height,tt=1,q=null,Y=null;const K=new le(0,0,k,$),ot=new le(0,0,k,$);let at=!1;const j=new Dc;let Z=!1,dt=!1,wt=null;const St=new se,Nt=new mt,Ot=new C,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function jt(){return E===null?tt:1}let z=n;function de(T,O){for(let V=0;V<T.length;V++){const G=T[V],H=e.getContext(G,O);if(H!==null)return H}return null}try{const T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Tc}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",I,!1),e.addEventListener("webglcontextcreationerror",lt,!1),z===null){const O=["webgl2","webgl","experimental-webgl"];if(y.isWebGL1Renderer===!0&&O.shift(),z=de(O,T),z===null)throw de(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&z instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),z.getShaderPrecisionFormat===void 0&&(z.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let bt,Rt,xt,oe,Ht,A,b,F,rt,L,D,X,et,Q,ut,Ct,J,Zt,Wt,zt,Pt,_t,P,ct;function Tt(){bt=new iv(z),Rt=new Jg(z,bt,t),bt.init(Rt),_t=new Vx(z,bt,Rt),xt=new Bx(z,bt,Rt),oe=new ov(z),Ht=new Tx,A=new Hx(z,bt,xt,Ht,Rt,_t,oe),b=new Qg(y),F=new nv(y),rt=new pm(z,Rt),P=new Yg(z,bt,rt,Rt),L=new sv(z,rt,oe,P),D=new hv(z,L,rt,oe),Wt=new lv(z,Rt,A),Ct=new Zg(Ht),X=new Ex(y,b,F,bt,Rt,P,Ct),et=new jx(y,Ht),Q=new Rx,ut=new Ux(bt,Rt),Zt=new qg(y,b,F,xt,D,d,c),J=new kx(y,D,Rt),ct=new Xx(z,oe,Rt,xt),zt=new Kg(z,bt,oe,Rt),Pt=new rv(z,bt,oe,Rt),oe.programs=X.programs,y.capabilities=Rt,y.extensions=bt,y.properties=Ht,y.renderLists=Q,y.shadowMap=J,y.state=xt,y.info=oe}Tt();const Mt=new $x(y,z);this.xr=Mt,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const T=bt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=bt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return tt},this.setPixelRatio=function(T){T!==void 0&&(tt=T,this.setSize(k,$,!1))},this.getSize=function(T){return T.set(k,$)},this.setSize=function(T,O,V=!0){if(Mt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=T,$=O,e.width=Math.floor(T*tt),e.height=Math.floor(O*tt),V===!0&&(e.style.width=T+"px",e.style.height=O+"px"),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(k*tt,$*tt).floor()},this.setDrawingBufferSize=function(T,O,V){k=T,$=O,tt=V,e.width=Math.floor(T*V),e.height=Math.floor(O*V),this.setViewport(0,0,T,O)},this.getCurrentViewport=function(T){return T.copy(w)},this.getViewport=function(T){return T.copy(K)},this.setViewport=function(T,O,V,G){T.isVector4?K.set(T.x,T.y,T.z,T.w):K.set(T,O,V,G),xt.viewport(w.copy(K).multiplyScalar(tt).floor())},this.getScissor=function(T){return T.copy(ot)},this.setScissor=function(T,O,V,G){T.isVector4?ot.set(T.x,T.y,T.z,T.w):ot.set(T,O,V,G),xt.scissor(B.copy(ot).multiplyScalar(tt).floor())},this.getScissorTest=function(){return at},this.setScissorTest=function(T){xt.setScissorTest(at=T)},this.setOpaqueSort=function(T){q=T},this.setTransparentSort=function(T){Y=T},this.getClearColor=function(T){return T.copy(Zt.getClearColor())},this.setClearColor=function(){Zt.setClearColor.apply(Zt,arguments)},this.getClearAlpha=function(){return Zt.getClearAlpha()},this.setClearAlpha=function(){Zt.setClearAlpha.apply(Zt,arguments)},this.clear=function(T=!0,O=!0,V=!0){let G=0;if(T){let H=!1;if(E!==null){const yt=E.texture.format;H=yt===sf||yt===nf||yt===ef}if(H){const yt=E.texture.type,At=yt===ai||yt===ni||yt===Rc||yt===Ri||yt===Qu||yt===tf,Ut=Zt.getClearColor(),Ft=Zt.getClearAlpha(),Yt=Ut.r,Gt=Ut.g,$t=Ut.b;At?(f[0]=Yt,f[1]=Gt,f[2]=$t,f[3]=Ft,z.clearBufferuiv(z.COLOR,0,f)):(g[0]=Yt,g[1]=Gt,g[2]=$t,g[3]=Ft,z.clearBufferiv(z.COLOR,0,g))}else G|=z.COLOR_BUFFER_BIT}O&&(G|=z.DEPTH_BUFFER_BIT),V&&(G|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",I,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),Q.dispose(),ut.dispose(),Ht.dispose(),b.dispose(),F.dispose(),D.dispose(),P.dispose(),ct.dispose(),X.dispose(),Mt.dispose(),Mt.removeEventListener("sessionstart",ge),Mt.removeEventListener("sessionend",ee),wt&&(wt.dispose(),wt=null),_e.stop()};function it(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),_=!0}function I(){console.log("THREE.WebGLRenderer: Context Restored."),_=!1;const T=oe.autoReset,O=J.enabled,V=J.autoUpdate,G=J.needsUpdate,H=J.type;Tt(),oe.autoReset=T,J.enabled=O,J.autoUpdate=V,J.needsUpdate=G,J.type=H}function lt(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function gt(T){const O=T.target;O.removeEventListener("dispose",gt),It(O)}function It(T){Lt(T),Ht.remove(T)}function Lt(T){const O=Ht.get(T).programs;O!==void 0&&(O.forEach(function(V){X.releaseProgram(V)}),T.isShaderMaterial&&X.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,V,G,H,yt){O===null&&(O=Dt);const At=H.isMesh&&H.matrixWorld.determinant()<0,Ut=kd(T,O,V,G,H);xt.setMaterial(G,At);let Ft=V.index,Yt=1;if(G.wireframe===!0){if(Ft=L.getWireframeAttribute(V),Ft===void 0)return;Yt=2}const Gt=V.drawRange,$t=V.attributes.position;let ve=Gt.start*Yt,Je=(Gt.start+Gt.count)*Yt;yt!==null&&(ve=Math.max(ve,yt.start*Yt),Je=Math.min(Je,(yt.start+yt.count)*Yt)),Ft!==null?(ve=Math.max(ve,0),Je=Math.min(Je,Ft.count)):$t!=null&&(ve=Math.max(ve,0),Je=Math.min(Je,$t.count));const Ae=Je-ve;if(Ae<0||Ae===1/0)return;P.setup(H,G,Ut,V,Ft);let Dn,he=zt;if(Ft!==null&&(Dn=rt.get(Ft),he=Pt,he.setIndex(Dn)),H.isMesh)G.wireframe===!0?(xt.setLineWidth(G.wireframeLinewidth*jt()),he.setMode(z.LINES)):he.setMode(z.TRIANGLES);else if(H.isLine){let Kt=G.linewidth;Kt===void 0&&(Kt=1),xt.setLineWidth(Kt*jt()),H.isLineSegments?he.setMode(z.LINES):H.isLineLoop?he.setMode(z.LINE_LOOP):he.setMode(z.LINE_STRIP)}else H.isPoints?he.setMode(z.POINTS):H.isSprite&&he.setMode(z.TRIANGLES);if(H.isBatchedMesh)he.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else if(H.isInstancedMesh)he.renderInstances(ve,Ae,H.count);else if(V.isInstancedBufferGeometry){const Kt=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,qo=Math.min(V.instanceCount,Kt);he.renderInstances(ve,Ae,qo)}else he.render(ve,Ae)};function Qt(T,O,V){T.transparent===!0&&T.side===en&&T.forceSinglePass===!1?(T.side=qe,T.needsUpdate=!0,Er(T,O,V),T.side=fi,T.needsUpdate=!0,Er(T,O,V),T.side=en):Er(T,O,V)}this.compile=function(T,O,V=null){V===null&&(V=T),m=ut.get(V),m.init(),x.push(m),V.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),T!==V&&T.traverseVisible(function(H){H.isLight&&H.layers.test(O.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights(y._useLegacyLights);const G=new Set;return T.traverse(function(H){const yt=H.material;if(yt)if(Array.isArray(yt))for(let At=0;At<yt.length;At++){const Ut=yt[At];Qt(Ut,V,H),G.add(Ut)}else Qt(yt,V,H),G.add(yt)}),x.pop(),m=null,G},this.compileAsync=function(T,O,V=null){const G=this.compile(T,O,V);return new Promise(H=>{function yt(){if(G.forEach(function(At){Ht.get(At).currentProgram.isReady()&&G.delete(At)}),G.size===0){H(T);return}setTimeout(yt,10)}bt.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let te=null;function pe(T){te&&te(T)}function ge(){_e.stop()}function ee(){_e.start()}const _e=new xf;_e.setAnimationLoop(pe),typeof self<"u"&&_e.setContext(self),this.setAnimationLoop=function(T){te=T,Mt.setAnimationLoop(T),T===null?_e.stop():_e.start()},Mt.addEventListener("sessionstart",ge),Mt.addEventListener("sessionend",ee),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(_===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Mt.enabled===!0&&Mt.isPresenting===!0&&(Mt.cameraAutoUpdate===!0&&Mt.updateCamera(O),O=Mt.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,O,E),m=ut.get(T,x.length),m.init(),x.push(m),St.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),j.setFromProjectionMatrix(St),dt=this.localClippingEnabled,Z=Ct.init(this.clippingPlanes,dt),v=Q.get(T,p.length),v.init(),p.push(v),yn(T,O,0,y.sortObjects),v.finish(),y.sortObjects===!0&&v.sort(q,Y),this.info.render.frame++,Z===!0&&Ct.beginShadows();const V=m.state.shadowsArray;if(J.render(V,T,O),Z===!0&&Ct.endShadows(),this.info.autoReset===!0&&this.info.reset(),Zt.render(v,T),m.setupLights(y._useLegacyLights),O.isArrayCamera){const G=O.cameras;for(let H=0,yt=G.length;H<yt;H++){const At=G[H];tl(v,T,At,At.viewport)}}else tl(v,T,O);E!==null&&(A.updateMultisampleRenderTarget(E),A.updateRenderTargetMipmap(E)),T.isScene===!0&&T.onAfterRender(y,T,O),P.resetDefaultState(),N=-1,M=null,x.pop(),x.length>0?m=x[x.length-1]:m=null,p.pop(),p.length>0?v=p[p.length-1]:v=null};function yn(T,O,V,G){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)V=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||j.intersectsSprite(T)){G&&Ot.setFromMatrixPosition(T.matrixWorld).applyMatrix4(St);const At=D.update(T),Ut=T.material;Ut.visible&&v.push(T,At,Ut,V,Ot.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||j.intersectsObject(T))){const At=D.update(T),Ut=T.material;if(G&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ot.copy(T.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),Ot.copy(At.boundingSphere.center)),Ot.applyMatrix4(T.matrixWorld).applyMatrix4(St)),Array.isArray(Ut)){const Ft=At.groups;for(let Yt=0,Gt=Ft.length;Yt<Gt;Yt++){const $t=Ft[Yt],ve=Ut[$t.materialIndex];ve&&ve.visible&&v.push(T,At,ve,V,Ot.z,$t)}}else Ut.visible&&v.push(T,At,Ut,V,Ot.z,null)}}const yt=T.children;for(let At=0,Ut=yt.length;At<Ut;At++)yn(yt[At],O,V,G)}function tl(T,O,V,G){const H=T.opaque,yt=T.transmissive,At=T.transparent;m.setupLightsView(V),Z===!0&&Ct.setGlobalState(y.clippingPlanes,V),yt.length>0&&Fd(H,yt,O,V),G&&xt.viewport(w.copy(G)),H.length>0&&wr(H,O,V),yt.length>0&&wr(yt,O,V),At.length>0&&wr(At,O,V),xt.buffers.depth.setTest(!0),xt.buffers.depth.setMask(!0),xt.buffers.color.setMask(!0),xt.setPolygonOffset(!1)}function Fd(T,O,V,G){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;const yt=Rt.isWebGL2;wt===null&&(wt=new Ii(1,1,{generateMipmaps:!0,type:bt.has("EXT_color_buffer_half_float")?hr:ai,minFilter:lr,samples:yt?4:0})),y.getDrawingBufferSize(Nt),yt?wt.setSize(Nt.x,Nt.y):wt.setSize(ac(Nt.x),ac(Nt.y));const At=y.getRenderTarget();y.setRenderTarget(wt),y.getClearColor(nt),U=y.getClearAlpha(),U<1&&y.setClearColor(16777215,.5),y.clear();const Ut=y.toneMapping;y.toneMapping=oi,wr(T,V,G),A.updateMultisampleRenderTarget(wt),A.updateRenderTargetMipmap(wt);let Ft=!1;for(let Yt=0,Gt=O.length;Yt<Gt;Yt++){const $t=O[Yt],ve=$t.object,Je=$t.geometry,Ae=$t.material,Dn=$t.group;if(Ae.side===en&&ve.layers.test(G.layers)){const he=Ae.side;Ae.side=qe,Ae.needsUpdate=!0,el(ve,V,G,Je,Ae,Dn),Ae.side=he,Ae.needsUpdate=!0,Ft=!0}}Ft===!0&&(A.updateMultisampleRenderTarget(wt),A.updateRenderTargetMipmap(wt)),y.setRenderTarget(At),y.setClearColor(nt,U),y.toneMapping=Ut}function wr(T,O,V){const G=O.isScene===!0?O.overrideMaterial:null;for(let H=0,yt=T.length;H<yt;H++){const At=T[H],Ut=At.object,Ft=At.geometry,Yt=G===null?At.material:G,Gt=At.group;Ut.layers.test(V.layers)&&el(Ut,O,V,Ft,Yt,Gt)}}function el(T,O,V,G,H,yt){T.onBeforeRender(y,O,V,G,H,yt),T.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),H.onBeforeRender(y,O,V,G,T,yt),H.transparent===!0&&H.side===en&&H.forceSinglePass===!1?(H.side=qe,H.needsUpdate=!0,y.renderBufferDirect(V,O,G,H,T,yt),H.side=fi,H.needsUpdate=!0,y.renderBufferDirect(V,O,G,H,T,yt),H.side=en):y.renderBufferDirect(V,O,G,H,T,yt),T.onAfterRender(y,O,V,G,H,yt)}function Er(T,O,V){O.isScene!==!0&&(O=Dt);const G=Ht.get(T),H=m.state.lights,yt=m.state.shadowsArray,At=H.state.version,Ut=X.getParameters(T,H.state,yt,O,V),Ft=X.getProgramCacheKey(Ut);let Yt=G.programs;G.environment=T.isMeshStandardMaterial?O.environment:null,G.fog=O.fog,G.envMap=(T.isMeshStandardMaterial?F:b).get(T.envMap||G.environment),Yt===void 0&&(T.addEventListener("dispose",gt),Yt=new Map,G.programs=Yt);let Gt=Yt.get(Ft);if(Gt!==void 0){if(G.currentProgram===Gt&&G.lightsStateVersion===At)return il(T,Ut),Gt}else Ut.uniforms=X.getUniforms(T),T.onBuild(V,Ut,y),T.onBeforeCompile(Ut,y),Gt=X.acquireProgram(Ut,Ft),Yt.set(Ft,Gt),G.uniforms=Ut.uniforms;const $t=G.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&($t.clippingPlanes=Ct.uniform),il(T,Ut),G.needsLights=Hd(T),G.lightsStateVersion=At,G.needsLights&&($t.ambientLightColor.value=H.state.ambient,$t.lightProbe.value=H.state.probe,$t.directionalLights.value=H.state.directional,$t.directionalLightShadows.value=H.state.directionalShadow,$t.spotLights.value=H.state.spot,$t.spotLightShadows.value=H.state.spotShadow,$t.rectAreaLights.value=H.state.rectArea,$t.ltc_1.value=H.state.rectAreaLTC1,$t.ltc_2.value=H.state.rectAreaLTC2,$t.pointLights.value=H.state.point,$t.pointLightShadows.value=H.state.pointShadow,$t.hemisphereLights.value=H.state.hemi,$t.directionalShadowMap.value=H.state.directionalShadowMap,$t.directionalShadowMatrix.value=H.state.directionalShadowMatrix,$t.spotShadowMap.value=H.state.spotShadowMap,$t.spotLightMatrix.value=H.state.spotLightMatrix,$t.spotLightMap.value=H.state.spotLightMap,$t.pointShadowMap.value=H.state.pointShadowMap,$t.pointShadowMatrix.value=H.state.pointShadowMatrix),G.currentProgram=Gt,G.uniformsList=null,Gt}function nl(T){if(T.uniformsList===null){const O=T.currentProgram.getUniforms();T.uniformsList=lo.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function il(T,O){const V=Ht.get(T);V.outputColorSpace=O.outputColorSpace,V.batching=O.batching,V.instancing=O.instancing,V.instancingColor=O.instancingColor,V.skinning=O.skinning,V.morphTargets=O.morphTargets,V.morphNormals=O.morphNormals,V.morphColors=O.morphColors,V.morphTargetsCount=O.morphTargetsCount,V.numClippingPlanes=O.numClippingPlanes,V.numIntersection=O.numClipIntersection,V.vertexAlphas=O.vertexAlphas,V.vertexTangents=O.vertexTangents,V.toneMapping=O.toneMapping}function kd(T,O,V,G,H){O.isScene!==!0&&(O=Dt),A.resetTextureUnits();const yt=O.fog,At=G.isMeshStandardMaterial?O.environment:null,Ut=E===null?y.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:jn,Ft=(G.isMeshStandardMaterial?F:b).get(G.envMap||At),Yt=G.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Gt=!!V.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),$t=!!V.morphAttributes.position,ve=!!V.morphAttributes.normal,Je=!!V.morphAttributes.color;let Ae=oi;G.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Ae=y.toneMapping);const Dn=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,he=Dn!==void 0?Dn.length:0,Kt=Ht.get(G),qo=m.state.lights;if(Z===!0&&(dt===!0||T!==M)){const rn=T===M&&G.id===N;Ct.setState(G,T,rn)}let me=!1;G.version===Kt.__version?(Kt.needsLights&&Kt.lightsStateVersion!==qo.state.version||Kt.outputColorSpace!==Ut||H.isBatchedMesh&&Kt.batching===!1||!H.isBatchedMesh&&Kt.batching===!0||H.isInstancedMesh&&Kt.instancing===!1||!H.isInstancedMesh&&Kt.instancing===!0||H.isSkinnedMesh&&Kt.skinning===!1||!H.isSkinnedMesh&&Kt.skinning===!0||H.isInstancedMesh&&Kt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Kt.instancingColor===!1&&H.instanceColor!==null||Kt.envMap!==Ft||G.fog===!0&&Kt.fog!==yt||Kt.numClippingPlanes!==void 0&&(Kt.numClippingPlanes!==Ct.numPlanes||Kt.numIntersection!==Ct.numIntersection)||Kt.vertexAlphas!==Yt||Kt.vertexTangents!==Gt||Kt.morphTargets!==$t||Kt.morphNormals!==ve||Kt.morphColors!==Je||Kt.toneMapping!==Ae||Rt.isWebGL2===!0&&Kt.morphTargetsCount!==he)&&(me=!0):(me=!0,Kt.__version=G.version);let pi=Kt.currentProgram;me===!0&&(pi=Er(G,O,H));let sl=!1,Bs=!1,Yo=!1;const Ue=pi.getUniforms(),mi=Kt.uniforms;if(xt.useProgram(pi.program)&&(sl=!0,Bs=!0,Yo=!0),G.id!==N&&(N=G.id,Bs=!0),sl||M!==T){Ue.setValue(z,"projectionMatrix",T.projectionMatrix),Ue.setValue(z,"viewMatrix",T.matrixWorldInverse);const rn=Ue.map.cameraPosition;rn!==void 0&&rn.setValue(z,Ot.setFromMatrixPosition(T.matrixWorld)),Rt.logarithmicDepthBuffer&&Ue.setValue(z,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Ue.setValue(z,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,Bs=!0,Yo=!0)}if(H.isSkinnedMesh){Ue.setOptional(z,H,"bindMatrix"),Ue.setOptional(z,H,"bindMatrixInverse");const rn=H.skeleton;rn&&(Rt.floatVertexTextures?(rn.boneTexture===null&&rn.computeBoneTexture(),Ue.setValue(z,"boneTexture",rn.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}H.isBatchedMesh&&(Ue.setOptional(z,H,"batchingTexture"),Ue.setValue(z,"batchingTexture",H._matricesTexture,A));const Ko=V.morphAttributes;if((Ko.position!==void 0||Ko.normal!==void 0||Ko.color!==void 0&&Rt.isWebGL2===!0)&&Wt.update(H,V,pi),(Bs||Kt.receiveShadow!==H.receiveShadow)&&(Kt.receiveShadow=H.receiveShadow,Ue.setValue(z,"receiveShadow",H.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(mi.envMap.value=Ft,mi.flipEnvMap.value=Ft.isCubeTexture&&Ft.isRenderTargetTexture===!1?-1:1),Bs&&(Ue.setValue(z,"toneMappingExposure",y.toneMappingExposure),Kt.needsLights&&Bd(mi,Yo),yt&&G.fog===!0&&et.refreshFogUniforms(mi,yt),et.refreshMaterialUniforms(mi,G,tt,$,wt),lo.upload(z,nl(Kt),mi,A)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(lo.upload(z,nl(Kt),mi,A),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Ue.setValue(z,"center",H.center),Ue.setValue(z,"modelViewMatrix",H.modelViewMatrix),Ue.setValue(z,"normalMatrix",H.normalMatrix),Ue.setValue(z,"modelMatrix",H.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const rn=G.uniformsGroups;for(let Jo=0,Vd=rn.length;Jo<Vd;Jo++)if(Rt.isWebGL2){const rl=rn[Jo];ct.update(rl,pi),ct.bind(rl,pi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return pi}function Bd(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function Hd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(T,O,V){Ht.get(T.texture).__webglTexture=O,Ht.get(T.depthTexture).__webglTexture=V;const G=Ht.get(T);G.__hasExternalTextures=!0,G.__hasExternalTextures&&(G.__autoAllocateDepthBuffer=V===void 0,G.__autoAllocateDepthBuffer||bt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,O){const V=Ht.get(T);V.__webglFramebuffer=O,V.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(T,O=0,V=0){E=T,R=O,S=V;let G=!0,H=null,yt=!1,At=!1;if(T){const Ft=Ht.get(T);Ft.__useDefaultFramebuffer!==void 0?(xt.bindFramebuffer(z.FRAMEBUFFER,null),G=!1):Ft.__webglFramebuffer===void 0?A.setupRenderTarget(T):Ft.__hasExternalTextures&&A.rebindTextures(T,Ht.get(T.texture).__webglTexture,Ht.get(T.depthTexture).__webglTexture);const Yt=T.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(At=!0);const Gt=Ht.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Gt[O])?H=Gt[O][V]:H=Gt[O],yt=!0):Rt.isWebGL2&&T.samples>0&&A.useMultisampledRTT(T)===!1?H=Ht.get(T).__webglMultisampledFramebuffer:Array.isArray(Gt)?H=Gt[V]:H=Gt,w.copy(T.viewport),B.copy(T.scissor),W=T.scissorTest}else w.copy(K).multiplyScalar(tt).floor(),B.copy(ot).multiplyScalar(tt).floor(),W=at;if(xt.bindFramebuffer(z.FRAMEBUFFER,H)&&Rt.drawBuffers&&G&&xt.drawBuffers(T,H),xt.viewport(w),xt.scissor(B),xt.setScissorTest(W),yt){const Ft=Ht.get(T.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ft.__webglTexture,V)}else if(At){const Ft=Ht.get(T.texture),Yt=O||0;z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,Ft.__webglTexture,V||0,Yt)}N=-1},this.readRenderTargetPixels=function(T,O,V,G,H,yt,At){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ut=Ht.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&At!==void 0&&(Ut=Ut[At]),Ut){xt.bindFramebuffer(z.FRAMEBUFFER,Ut);try{const Ft=T.texture,Yt=Ft.format,Gt=Ft.type;if(Yt!==an&&_t.convert(Yt)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const $t=Gt===hr&&(bt.has("EXT_color_buffer_half_float")||Rt.isWebGL2&&bt.has("EXT_color_buffer_float"));if(Gt!==ai&&_t.convert(Gt)!==z.getParameter(z.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Gt===ii&&(Rt.isWebGL2||bt.has("OES_texture_float")||bt.has("WEBGL_color_buffer_float")))&&!$t){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-G&&V>=0&&V<=T.height-H&&z.readPixels(O,V,G,H,_t.convert(Yt),_t.convert(Gt),yt)}finally{const Ft=E!==null?Ht.get(E).__webglFramebuffer:null;xt.bindFramebuffer(z.FRAMEBUFFER,Ft)}}},this.copyFramebufferToTexture=function(T,O,V=0){const G=Math.pow(2,-V),H=Math.floor(O.image.width*G),yt=Math.floor(O.image.height*G);A.setTexture2D(O,0),z.copyTexSubImage2D(z.TEXTURE_2D,V,0,0,T.x,T.y,H,yt),xt.unbindTexture()},this.copyTextureToTexture=function(T,O,V,G=0){const H=O.image.width,yt=O.image.height,At=_t.convert(V.format),Ut=_t.convert(V.type);A.setTexture2D(V,0),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,V.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,V.unpackAlignment),O.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,G,T.x,T.y,H,yt,At,Ut,O.image.data):O.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,G,T.x,T.y,O.mipmaps[0].width,O.mipmaps[0].height,At,O.mipmaps[0].data):z.texSubImage2D(z.TEXTURE_2D,G,T.x,T.y,At,Ut,O.image),G===0&&V.generateMipmaps&&z.generateMipmap(z.TEXTURE_2D),xt.unbindTexture()},this.copyTextureToTexture3D=function(T,O,V,G,H=0){if(y.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const yt=T.max.x-T.min.x+1,At=T.max.y-T.min.y+1,Ut=T.max.z-T.min.z+1,Ft=_t.convert(G.format),Yt=_t.convert(G.type);let Gt;if(G.isData3DTexture)A.setTexture3D(G,0),Gt=z.TEXTURE_3D;else if(G.isDataArrayTexture||G.isCompressedArrayTexture)A.setTexture2DArray(G,0),Gt=z.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,G.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,G.unpackAlignment);const $t=z.getParameter(z.UNPACK_ROW_LENGTH),ve=z.getParameter(z.UNPACK_IMAGE_HEIGHT),Je=z.getParameter(z.UNPACK_SKIP_PIXELS),Ae=z.getParameter(z.UNPACK_SKIP_ROWS),Dn=z.getParameter(z.UNPACK_SKIP_IMAGES),he=V.isCompressedTexture?V.mipmaps[H]:V.image;z.pixelStorei(z.UNPACK_ROW_LENGTH,he.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,he.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,T.min.x),z.pixelStorei(z.UNPACK_SKIP_ROWS,T.min.y),z.pixelStorei(z.UNPACK_SKIP_IMAGES,T.min.z),V.isDataTexture||V.isData3DTexture?z.texSubImage3D(Gt,H,O.x,O.y,O.z,yt,At,Ut,Ft,Yt,he.data):V.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),z.compressedTexSubImage3D(Gt,H,O.x,O.y,O.z,yt,At,Ut,Ft,he.data)):z.texSubImage3D(Gt,H,O.x,O.y,O.z,yt,At,Ut,Ft,Yt,he),z.pixelStorei(z.UNPACK_ROW_LENGTH,$t),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,ve),z.pixelStorei(z.UNPACK_SKIP_PIXELS,Je),z.pixelStorei(z.UNPACK_SKIP_ROWS,Ae),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Dn),H===0&&G.generateMipmaps&&z.generateMipmap(Gt),xt.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?A.setTextureCube(T,0):T.isData3DTexture?A.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?A.setTexture2DArray(T,0):A.setTexture2D(T,0),xt.unbindTexture()},this.resetState=function(){R=0,S=0,E=null,xt.reset(),P.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Pc?"display-p3":"srgb",e.unpackColorSpace=ae.workingColorSpace===Do?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===be?Pi:of}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Pi?be:jn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class qx extends Tf{}qx.prototype.isWebGL1Renderer=!0;class Uc{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new qt(t),this.near=e,this.far=n}clone(){return new Uc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Af extends Pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Yx extends We{constructor(t=null,e=1,n=1,s,r,o,a,c,l=De,h=De,u,d){super(null,o,a,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Th extends sn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const os=new se,Ah=new se,qr=[],Rh=new ki,Kx=new se,js=new Vt,Xs=new Us;class er extends Vt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Th(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Kx)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ki),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,os),Rh.copy(t.boundingBox).applyMatrix4(os),this.boundingBox.union(Rh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Us),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,os),Xs.copy(t.boundingSphere).applyMatrix4(os),this.boundingSphere.union(Xs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(js.geometry=this.geometry,js.material=this.material,js.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Xs.copy(this.boundingSphere),Xs.applyMatrix4(n),t.ray.intersectsSphere(Xs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,os),Ah.multiplyMatrices(n,os),js.matrixWorld=Ah,js.raycast(t,qr);for(let o=0,a=qr.length;o<a;o++){const c=qr[o];c.instanceId=r,c.object=this,e.push(c)}qr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Th(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Nc extends Bi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ch=new C,Ph=new C,Lh=new se,Ra=new Io,Yr=new Us;class Rf extends Pe{constructor(t=new xe,e=new Nc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Ch.fromBufferAttribute(e,s-1),Ph.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Ch.distanceTo(Ph);t.setAttribute("lineDistance",new ie(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Yr.copy(n.boundingSphere),Yr.applyMatrix4(s),Yr.radius+=r,t.ray.intersectsSphere(Yr)===!1)return;Lh.copy(s).invert(),Ra.copy(t.ray).applyMatrix4(Lh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=new C,h=new C,u=new C,d=new C,f=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){const p=Math.max(0,o.start),x=Math.min(g.count,o.start+o.count);for(let y=p,_=x-1;y<_;y+=f){const R=g.getX(y),S=g.getX(y+1);if(l.fromBufferAttribute(m,R),h.fromBufferAttribute(m,S),Ra.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const N=t.ray.origin.distanceTo(d);N<t.near||N>t.far||e.push({distance:N,point:u.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,o.start),x=Math.min(m.count,o.start+o.count);for(let y=p,_=x-1;y<_;y+=f){if(l.fromBufferAttribute(m,y),h.fromBufferAttribute(m,y+1),Ra.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const S=t.ray.origin.distanceTo(d);S<t.near||S>t.far||e.push({distance:S,point:u.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const Dh=new C,Ih=new C;class Jx extends Rf{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Dh.fromBufferAttribute(e,s),Ih.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Dh.distanceTo(Ih);t.setAttribute("lineDistance",new ie(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Oc extends We{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ln{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new mt:new C);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,s=[],r=[],o=[],a=new C,c=new se;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new C)}r[0]=new C,o[0]=new C;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Ce(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Ce(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class zc extends Ln{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){const n=e||new mt,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Zx extends zc{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Fc(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Kr=new C,Ca=new Fc,Pa=new Fc,La=new Fc;class kc extends Ln{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(Kr.subVectors(s[0],s[1]).add(s[0]),l=Kr);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Kr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Kr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Ca.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,v,m),Pa.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,v,m),La.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Ca.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Pa.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),La.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Ca.calc(c),Pa.calc(c),La.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Uh(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function Qx(i,t){const e=1-i;return e*e*t}function t_(i,t){return 2*(1-i)*i*t}function e_(i,t){return i*i*t}function nr(i,t,e,n){return Qx(i,t)+t_(i,e)+e_(i,n)}function n_(i,t){const e=1-i;return e*e*e*t}function i_(i,t){const e=1-i;return 3*e*e*i*t}function s_(i,t){return 3*(1-i)*i*i*t}function r_(i,t){return i*i*i*t}function ir(i,t,e,n,s){return n_(i,t)+i_(i,e)+s_(i,n)+r_(i,s)}class Cf extends Ln{constructor(t=new mt,e=new mt,n=new mt,s=new mt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new mt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ir(t,s.x,r.x,o.x,a.x),ir(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class o_ extends Ln{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ir(t,s.x,r.x,o.x,a.x),ir(t,s.y,r.y,o.y,a.y),ir(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Pf extends Ln{constructor(t=new mt,e=new mt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new mt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new mt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class a_ extends Ln{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Lf extends Ln{constructor(t=new mt,e=new mt,n=new mt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new mt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(nr(t,s.x,r.x,o.x),nr(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class c_ extends Ln{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(nr(t,s.x,r.x,o.x),nr(t,s.y,r.y,o.y),nr(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Df extends Ln{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new mt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Uh(a,c.x,l.x,h.x,u.x),Uh(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new mt().fromArray(s))}return this}}var Nh=Object.freeze({__proto__:null,ArcCurve:Zx,CatmullRomCurve3:kc,CubicBezierCurve:Cf,CubicBezierCurve3:o_,EllipseCurve:zc,LineCurve:Pf,LineCurve3:a_,QuadraticBezierCurve:Lf,QuadraticBezierCurve3:c_,SplineCurve:Df});class l_ extends Ln{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Nh[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Nh[s.type]().fromJSON(s))}return this}}class h_ extends l_{constructor(t){super(),this.type="Path",this.currentPoint=new mt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Pf(this.currentPoint.clone(),new mt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Lf(this.currentPoint.clone(),new mt(t,e),new mt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Cf(this.currentPoint.clone(),new mt(t,e),new mt(n,s),new mt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Df(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const l=new zc(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Bc extends xe{constructor(t=[new mt(0,-.5),new mt(.5,0),new mt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Ce(s,0,Math.PI*2);const r=[],o=[],a=[],c=[],l=[],h=1/e,u=new C,d=new mt,f=new C,g=new C,v=new C;let m=0,p=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:m=t[x+1].x-t[x].x,p=t[x+1].y-t[x].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:m=t[x+1].x-t[x].x,p=t[x+1].y-t[x].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(g)}for(let x=0;x<=e;x++){const y=n+x*h*s,_=Math.sin(y),R=Math.cos(y);for(let S=0;S<=t.length-1;S++){u.x=t[S].x*_,u.y=t[S].y,u.z=t[S].x*R,o.push(u.x,u.y,u.z),d.x=x/e,d.y=S/(t.length-1),a.push(d.x,d.y);const E=c[3*S+0]*_,N=c[3*S+1],M=c[3*S+0]*R;l.push(E,N,M)}}for(let x=0;x<e;x++)for(let y=0;y<t.length-1;y++){const _=y+x*t.length,R=_,S=_+t.length,E=_+t.length+1,N=_+1;r.push(R,S,N),r.push(E,N,S)}this.setIndex(r),this.setAttribute("position",new ie(o,3)),this.setAttribute("uv",new ie(a,2)),this.setAttribute("normal",new ie(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bc(t.points,t.segments,t.phiStart,t.phiLength)}}class Hc extends Bc{constructor(t=1,e=1,n=4,s=8){const r=new h_;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new Hc(t.radius,t.length,t.capSegments,t.radialSegments)}}class Ni extends xe{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],l=new C,h=new mt;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ie(o,3)),this.setAttribute("normal",new ie(a,3)),this.setAttribute("uv",new ie(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ni(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ye extends xe{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;x(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new ie(u,3)),this.setAttribute("normal",new ie(d,3)),this.setAttribute("uv",new ie(f,2));function x(){const _=new C,R=new C;let S=0;const E=(e-t)/n;for(let N=0;N<=r;N++){const M=[],w=N/r,B=w*(e-t)+t;for(let W=0;W<=s;W++){const nt=W/s,U=nt*c+a,k=Math.sin(U),$=Math.cos(U);R.x=B*k,R.y=-w*n+m,R.z=B*$,u.push(R.x,R.y,R.z),_.set(k,E,$).normalize(),d.push(_.x,_.y,_.z),f.push(nt,1-w),M.push(g++)}v.push(M)}for(let N=0;N<s;N++)for(let M=0;M<r;M++){const w=v[M][N],B=v[M+1][N],W=v[M+1][N+1],nt=v[M][N+1];h.push(w,B,nt),h.push(B,W,nt),S+=6}l.addGroup(p,S,0),p+=S}function y(_){const R=g,S=new mt,E=new C;let N=0;const M=_===!0?t:e,w=_===!0?1:-1;for(let W=1;W<=s;W++)u.push(0,m*w,0),d.push(0,w,0),f.push(.5,.5),g++;const B=g;for(let W=0;W<=s;W++){const U=W/s*c+a,k=Math.cos(U),$=Math.sin(U);E.x=M*$,E.y=m*w,E.z=M*k,u.push(E.x,E.y,E.z),d.push(0,w,0),S.x=k*.5+.5,S.y=$*.5*w+.5,f.push(S.x,S.y),g++}for(let W=0;W<s;W++){const nt=R+W,U=B+W;_===!0?h.push(U,U+1,nt):h.push(U+1,U,nt),N+=3}l.addGroup(p,N,_===!0?1:2),p+=N}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ye(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Rn extends Ye{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Rn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class vr extends xe{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new ie(r,3)),this.setAttribute("normal",new ie(r.slice(),3)),this.setAttribute("uv",new ie(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const y=new C,_=new C,R=new C;for(let S=0;S<e.length;S+=3)f(e[S+0],y),f(e[S+1],_),f(e[S+2],R),c(y,_,R,x)}function c(x,y,_,R){const S=R+1,E=[];for(let N=0;N<=S;N++){E[N]=[];const M=x.clone().lerp(_,N/S),w=y.clone().lerp(_,N/S),B=S-N;for(let W=0;W<=B;W++)W===0&&N===S?E[N][W]=M:E[N][W]=M.clone().lerp(w,W/B)}for(let N=0;N<S;N++)for(let M=0;M<2*(S-N)-1;M++){const w=Math.floor(M/2);M%2===0?(d(E[N][w+1]),d(E[N+1][w]),d(E[N][w])):(d(E[N][w+1]),d(E[N+1][w+1]),d(E[N+1][w]))}}function l(x){const y=new C;for(let _=0;_<r.length;_+=3)y.x=r[_+0],y.y=r[_+1],y.z=r[_+2],y.normalize().multiplyScalar(x),r[_+0]=y.x,r[_+1]=y.y,r[_+2]=y.z}function h(){const x=new C;for(let y=0;y<r.length;y+=3){x.x=r[y+0],x.y=r[y+1],x.z=r[y+2];const _=m(x)/2/Math.PI+.5,R=p(x)/Math.PI+.5;o.push(_,1-R)}g(),u()}function u(){for(let x=0;x<o.length;x+=6){const y=o[x+0],_=o[x+2],R=o[x+4],S=Math.max(y,_,R),E=Math.min(y,_,R);S>.9&&E<.1&&(y<.2&&(o[x+0]+=1),_<.2&&(o[x+2]+=1),R<.2&&(o[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function f(x,y){const _=x*3;y.x=t[_+0],y.y=t[_+1],y.z=t[_+2]}function g(){const x=new C,y=new C,_=new C,R=new C,S=new mt,E=new mt,N=new mt;for(let M=0,w=0;M<r.length;M+=9,w+=6){x.set(r[M+0],r[M+1],r[M+2]),y.set(r[M+3],r[M+4],r[M+5]),_.set(r[M+6],r[M+7],r[M+8]),S.set(o[w+0],o[w+1]),E.set(o[w+2],o[w+3]),N.set(o[w+4],o[w+5]),R.copy(x).add(y).add(_).divideScalar(3);const B=m(R);v(S,w+0,x,B),v(E,w+2,y,B),v(N,w+4,_,B)}}function v(x,y,_,R){R<0&&x.x===1&&(o[y]=x.x-1),_.x===0&&_.z===0&&(o[y]=R/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vr(t.vertices,t.indices,t.radius,t.details)}}class To extends vr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new To(t.radius,t.detail)}}class Cn extends vr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Cn(t.radius,t.detail)}}class No extends vr{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new No(t.radius,t.detail)}}class Oi extends xe{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],l=[],h=[];let u=t;const d=(e-t)/s,f=new C,g=new mt;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){const p=r+m/n*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<s;v++){const m=v*(n+1);for(let p=0;p<n;p++){const x=p+m,y=x,_=x+n+1,R=x+n+2,S=x+1;a.push(y,_,S),a.push(_,R,S)}}this.setIndex(a),this.setAttribute("position",new ie(c,3)),this.setAttribute("normal",new ie(l,3)),this.setAttribute("uv",new ie(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class nn extends xe{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new C,d=new C,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const x=[],y=p/n;let _=0;p===0&&o===0?_=.5/e:p===n&&c===Math.PI&&(_=-.5/e);for(let R=0;R<=e;R++){const S=R/e;u.x=-t*Math.cos(s+S*r)*Math.sin(o+y*a),u.y=t*Math.cos(o+y*a),u.z=t*Math.sin(s+S*r)*Math.sin(o+y*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(S+_,1-y),x.push(l++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<e;x++){const y=h[p][x+1],_=h[p][x],R=h[p+1][x],S=h[p+1][x+1];(p!==0||o>0)&&f.push(y,_,S),(p!==n-1||c<Math.PI)&&f.push(_,R,S)}this.setIndex(f),this.setAttribute("position",new ie(g,3)),this.setAttribute("normal",new ie(v,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class _n extends xe{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],l=[],h=new C,u=new C,d=new C;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const v=g/s*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const v=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,x=(s+1)*f+g;o.push(v,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new ie(a,3)),this.setAttribute("normal",new ie(c,3)),this.setAttribute("uv",new ie(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class xn extends Bi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cc,this.normalScale=new mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class u_ extends Bi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cc,this.normalScale=new mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ac,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Vc extends Pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class f_ extends Vc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Da=new se,Oh=new C,zh=new C;class If{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new mt(512,512),this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Dc,this._frameExtents=new mt(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Oh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Oh),zh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(zh),e.updateMatrixWorld(),Da.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Da),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Da)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Fh=new se,qs=new C,Ia=new C;class d_ extends If{constructor(){super(new tn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new mt(4,2),this._viewportCount=6,this._viewports=[new le(2,1,1,1),new le(0,1,1,1),new le(3,1,1,1),new le(1,1,1,1),new le(3,0,1,1),new le(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),qs.setFromMatrixPosition(t.matrixWorld),n.position.copy(qs),Ia.copy(n.position),Ia.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ia),n.updateMatrixWorld(),s.makeTranslation(-qs.x,-qs.y,-qs.z),Fh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fh)}}class p_ extends Vc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new d_}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class m_ extends If{constructor(){super(new _f(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class kh extends Vc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.target=new Pe,this.shadow=new m_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class g_{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Bh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Bh();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Bh(){return(typeof performance>"u"?Date:performance).now()}class v_{constructor(t,e,n=0,s=1/0){this.ray=new Io(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Lc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return lc(t,this,n,e),n.sort(Hh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)lc(t[s],this,n,e);return n.sort(Hh),n}}function Hh(i,t){return i.distance-t.distance}function lc(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,o=s.length;r<o;r++)lc(s[r],t,e,!0)}}class Vh{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ce(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Tc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Tc);function x_(i){return{a:i>>>0,n:0,h:0,locked:!1}}function sr(i){if(i.locked)throw new Error("a dice draw while the rng is locked (a preview or legality check must never roll)");let t=i.a|0;t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);e=e+Math.imul(e^e>>>7,61|e)^e;const n=((e^e>>>14)>>>0)/4294967296;return i.a=t,i.n++,i.h=Math.imul(i.h,31)+Math.floor(n*4294967296)>>>0,n}const Oo=i=>`${i.n}#${i.h.toString(36)}`;function Uf(i){i.locked=!0}function Nf(i){i.locked=!1}const Xn=Object.freeze({W:40,H:28,deploy:8}),li=1,xr=12,zo=3,Of=5,_r=6,Ts=Object.freeze([{key:"move",name:"Movement"},{key:"shoot",name:"Shooting"},{key:"charge",name:"Charge"},{key:"fight",name:"Fight"},{key:"morale",name:"Morale"}].map(Object.freeze)),Wc=i=>1+Math.floor(sr(i.rng)*6),ke=(i,t)=>Array.from({length:t},()=>Wc(i)),Gn=(i,t)=>i.filter(e=>e>=t).length,__=(i,t,e)=>i<t?t:i>e?e:i,ho=i=>i>6?0:i<=1?1:(7-i)/6;function zi(i){let t=0;for(let e=1;e<=6;e++)for(let n=1;n<=6;n++)e+n>=i&&t++;return t/36}function yr(i,t,e){let n;return i>=2*t?n=2:i>t?n=3:i===t?n=4:2*i<=t?n=6:n=5,e?Math.min(n,e):n}function Mr(i,t,e){return Math.max(2,i+t-(e?1:0))}const ur=(i,t)=>__(i+t,2,6);function As(i,t,e){const n=i.alive;return e?n*i.t.A:t.blast?Math.min(t.shots,n):n*t.shots}function Ao(i,t,e,n,s){const r=n.t,o=ho(t),a=ho(yr(e.S,r.T,e.poison)),c=1-ho(Mr(r.Sv,e.AP,s)),l=i*o*a*c,h=Math.min(e.D,r.W)/r.W,u=Math.min(n.alive,l*h);return{wounds:l,kills:u,value:u*r.pts}}function zf(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const ln=(i,t,e)=>i+(t-i)*e,Ge=(i,t)=>i[Math.floor(t()*i.length)],ne=(i,t,e)=>t+i()*(e-t);function un(i){if(i&&typeof i=="object"&&!Object.isFrozen(i)){Object.freeze(i);for(const t of Object.values(i))un(t)}return i}function Gc(i,t=0){let e=3735928559^t,n=1103547991^t;for(let s=0;s<i.length;s++){const r=i.charCodeAt(s);e=Math.imul(e^r,2654435761),n=Math.imul(n^r,1597334677)}return e=Math.imul(e^e>>>16,2246822507),e^=Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507),n^=Math.imul(e^e>>>13,3266489909),4294967296*(2097151&n)+(e>>>0)}function Rs(i){var t;if(i===null||typeof i=="boolean"||typeof i=="string")return JSON.stringify(i);if(typeof i=="number"){if(!Number.isFinite(i))throw new Error(`canonicalJSON: ${i} is not a finite number`);return JSON.stringify(i)}if(Array.isArray(i))return`[${i.map(e=>{if(e===void 0)throw new Error("canonicalJSON: undefined in an array");return Rs(e)}).join(",")}]`;if(typeof i=="object"&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null))return`{${Object.keys(i).filter(n=>i[n]!==void 0).sort().map(n=>`${JSON.stringify(n)}:${Rs(i[n])}`).join(",")}}`;throw new Error(`canonicalJSON: can't encode ${typeof i=="object"?((t=i.constructor)==null?void 0:t.name)??"object":typeof i}`)}const Wh={name:"Twig knives",S:3,AP:0,D:1},y_={key:"squirrel",name:"Bushtail Clans",short:"Bushtails",icon:"🐿️",look:{team:"#ec8a34",dark:"#7a3d12",alt:"#c75ad6",gore:["#cf6d2a","#f1dcb5"],voice:"squeak",models:"squirrel",anim:"squirrel"},army:["elder","oakguard","nutkin","nutkin","grenadier","glider","trebuchet"],units:{nutkin:{name:"Nutkin Skirmishers",short:"Nutkin",role:"Troops",ai:"shooter",models:6,base:.3,pts:7,stats:"M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2",ranged:{name:"Slingshots",range:18,shots:2,S:3,AP:0,D:1,assault:!0,fx:"acorn"},melee:Wh,abilities:["Scurry — may shoot after Advancing."]},grenadier:{name:"Acorn Grenadiers",short:"Grenadiers",role:"Troops",ai:"shooter",models:5,base:.3,pts:11,stats:"M6 WS4 BS4 S3 T3 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Blasting acorns",range:12,shots:2,blast:1.6,S:4,AP:1,D:1,scenery:1,fx:"bomb"},melee:Wh,abilities:['Blast — lobs 2 templates; a miss scatters D6+1".']},oakguard:{name:"Oak Guard",short:"Oak Guard",role:"Elite",ai:"melee",models:5,base:.34,pts:22,stats:"M5 WS3 BS5 S4 T4 W2 A2 Ld8 Sv3 OC1",ranged:null,melee:{name:"Pinecone halberds",S:5,AP:2,D:1},abilities:["Bark shields — the clan’s anvil. No guns, all heart."]},glider:{name:"Glider Wing",short:"Gliders",role:"Fast",ai:"raider",models:4,base:.32,pts:15,fly:!0,stats:"M12 WS3 BS4 S3 T3 W1 A2 Ld7 Sv5 OC1",ranged:{name:"Thorn darts",range:10,shots:2,S:3,AP:1,D:1,assault:!0,fx:"dart"},melee:{name:"Hooked claws",S:4,AP:1,D:1},abilities:["Fly — moves over scenery and enemy units.","Swoop — may shoot after Advancing."]},trebuchet:{name:"Pinecone Trebuchet",short:"Trebuchet",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:95,big:!0,stats:"M3 WS6 BS4 S3 T5 W7 A2 Ld7 Sv4 OC0",ranged:{name:"Flaming pinecone",range:36,shots:1,blast:3,S:6,AP:1,D:2,indirect:!0,heavy:!0,scenery:3,fx:"pinecone"},melee:{name:"Crew mallets",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving."]},elder:{name:"Elder Chitterwick",short:"Elder",role:"Hero",ai:"hero",models:1,base:.42,pts:80,hero:!0,stats:"M6 WS3 BS3 S4 T4 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Thornburst",spell:6,range:18,shots:1,blast:2.4,S:5,AP:2,D:1,scenery:2,fx:"thorns"},melee:{name:"Rootwood staff",S:5,AP:1,D:2},abilities:["Spell — cast on 2D6 ≥ 6: thorns erupt under the target, no scatter.",`Grey whiskers — friends within ${_r}" use his Ld 9.`]}}},M_={key:"serpent",name:"Coil of Ssithra",short:"Serpents",icon:"🐍",look:{team:"#46c27a",dark:"#14532d",alt:"#4aa8e8",gore:["#3f8f4a","#d9cf86"],voice:"hiss",models:"serpent",anim:"serpent"},army:["hierophant","brute","scaleguard","scaleguard","spitter","sidewinder","engine"],units:{scaleguard:{name:"Scaleguard",short:"Scaleguard",role:"Troops",ai:"line",models:6,base:.32,pts:10,stats:"M5 WS3 BS5 S4 T4 W1 A1 Ld7 Sv4 OC2",ranged:{name:"Javelins",range:8,shots:1,S:4,AP:0,D:1,fx:"javelin"},melee:{name:"Serpent spears",S:4,AP:1,D:1},abilities:["Shield wall — the Coil’s steady line."]},spitter:{name:"Venom Spitters",short:"Spitters",role:"Troops",ai:"shooter",models:5,base:.32,pts:12,stats:"M5 WS4 BS3 S3 T4 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Venom spit",range:12,shots:2,S:2,AP:1,D:1,poison:4,fx:"spit"},melee:{name:"Fangs",S:3,AP:0,D:1,poison:4},abilities:["Poison 4+ — always wounds on a 4+, however tough the target."]},sidewinder:{name:"Sidewinder Stalkers",short:"Sidewinders",role:"Fast",ai:"melee",models:4,base:.34,pts:24,chargeAfterAdvance:!0,stats:"M10 WS3 BS5 S4 T4 W2 A2 Ld7 Sv5 OC1",ranged:null,melee:{name:"Twin sickles",S:4,AP:1,D:1},abilities:["Sidewind — may charge after Advancing."]},brute:{name:"Constrictor Brute",short:"Brute",role:"Monster",ai:"melee",models:1,base:.95,pts:125,big:!0,wrecker:!0,stats:"M6 WS3 BS6 S6 T6 W9 A4 Ld8 Sv4 OC4",ranged:null,melee:{name:"Crushing coils",S:7,AP:2,D:2},abilities:["Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it)."]},engine:{name:"Basilisk Venom Engine",short:"Venom Engine",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:100,big:!0,stats:"M4 WS6 BS4 S3 T6 W7 A1 Ld7 Sv3 OC0",ranged:{name:"Acid globe",range:30,shots:1,blast:2.6,S:5,AP:2,D:2,poison:3,indirect:!0,heavy:!0,scenery:4,corrodes:!0,fx:"acid"},melee:{name:"Crew hooks",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving.","Acid — Poison 3+, and it eats stone."]},hierophant:{name:"Hierophant Ssithra",short:"Hierophant",role:"Hero",ai:"hero",models:1,base:.45,pts:85,hero:!0,stats:"M5 WS3 BS3 S4 T5 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Mesmerize",spell:7,range:18,mesmerize:!0,fx:"gaze"},melee:{name:"Fang staff",S:5,AP:2,D:2,poison:3},abilities:["Spell — cast on 2D6 ≥ 7: the target suffers D3 mortal wounds and is Mesmerized — it can’t shoot or charge next turn and hits at −1 in melee.",`Coiled will — friends within ${_r}" use her Ld 9.`]}}},Gh=Object.freeze(["M","WS","BS","S","T","W","A","Ld","Sv","OC"]),$h=Object.freeze(["Troops","Elite","Fast","Hero","Monster","Artillery"]),jh=Object.freeze(["melee","raider","line","shooter","hero","artillery"]),Ff=Object.freeze(["fly","big","hero","wrecker","burrow","chargeAfterAdvance","noCharge","brawler"]),b_=new Set(["name","short","role","ai","models","base","pts","stats","ranged","melee","abilities",...Ff,"move","deployRow","eye","chest","swarm","swoop"]),kf=["range","shots","S","AP","D","blast","scenery","poison","spell"],Bf=["assault","heavy","indirect","corrodes","mesmerize"],S_=new Set(["name","fx",...kf,...Bf]),Xh=["walk","fly","wreck","burrow"],qh=["front","mid","back"],Yh=/^#[0-9a-f]{6}$/i,Kh=/^[a-z][a-z0-9-]*$/;function w_(i){const t={};for(const n of String(i).trim().split(/\s+/)){const s=/^([A-Za-z]+)(\d+)$/.exec(n);if(!s||!Gh.includes(s[1]))throw new Error(`bad stat "${n}" in "${i}"`);if(s[1]in t)throw new Error(`${s[1]} given twice in "${i}"`);t[s[1]]=Number(s[2])}const e=Gh.filter(n=>!(n in t));if(e.length)throw new Error(`"${i}" lacks ${e.join(", ")}`);return t}function Jh(i,t,e){const n=r=>new Error(`${t}: ${r}`);if(!i||typeof i!="object")throw n("must be a weapon object");for(const r of Object.keys(i))if(!S_.has(r))throw n(`unknown field "${r}"`);if(typeof i.name!="string"||!i.name)throw n("needs a name");if(i.fx!==void 0&&typeof i.fx!="string")throw n("fx is a string");for(const r of kf)if(i[r]!==void 0&&!(Number.isFinite(i[r])&&i[r]>=0))throw n(`${r} must be a number ≥ 0`);for(const r of Bf)if(i[r]!==void 0&&typeof i[r]!="boolean")throw n(`${r} must be true or false`);for(const r of["shots","S","AP","D","scenery","poison","spell"])if(i[r]!==void 0&&!Number.isInteger(i[r]))throw n(`${r} must be a whole number`);const s=["S","AP","D"];if(e){for(const r of s)if(i[r]===void 0)throw n(`a melee weapon needs ${r}`);for(const r of["range","shots","blast","spell","mesmerize","indirect","heavy","assault"])if(i[r]!==void 0)throw n(`a melee weapon has no ${r}`)}else{if(i.range===void 0)throw n("a ranged weapon needs a range");if(!i.mesmerize){for(const r of["shots",...s])if(i[r]===void 0)throw n(`a ranged weapon needs ${r}`)}if(i.mesmerize&&!i.spell)throw n("mesmerize is a spell: give it a cast value")}return{...i}}function E_(i,t,e){var v,m;const n=`race ${i}, unit ${t}`,s=p=>new Error(`${n}: ${p}`);if(!e||typeof e!="object")throw s("must be an object");for(const p of Object.keys(e))if(!b_.has(p))throw s(`unknown field "${p}"`);for(const p of["name","short"])if(typeof e[p]!="string"||!e[p])throw s(`needs a ${p}`);if(!$h.includes(e.role))throw s(`role must be one of ${$h.join(", ")}`);if(!jh.includes(e.ai))throw s(`ai must be one of ${jh.join(", ")}`);if(!Number.isInteger(e.models)||e.models<1)throw s("models must be a whole number ≥ 1");if(!(Number.isFinite(e.base)&&e.base>0))throw s("base must be a radius > 0");if(!Number.isInteger(e.pts)||e.pts<0)throw s("pts must be a whole number ≥ 0");if(!Array.isArray(e.abilities)||e.abilities.some(p=>typeof p!="string"))throw s("abilities is a list of card text");for(const p of Ff)if(e[p]!==void 0&&typeof e[p]!="boolean")throw s(`${p} must be true or false`);if(e.move!==void 0&&!Xh.includes(e.move))throw s(`move must be one of ${Xh.join(", ")}`);if(e.deployRow!==void 0&&!qh.includes(e.deployRow))throw s(`deployRow must be one of ${qh.join(", ")}`);for(const p of["eye","chest"])if(e[p]!==void 0&&!(Number.isFinite(e[p])&&e[p]>0))throw s(`${p} must be a height > 0`);if(e.swarm!==void 0&&!Number.isInteger((v=e.swarm)==null?void 0:v.min))throw s("swarm is { min }");if(e.swoop!==void 0&&!Number.isInteger((m=e.swoop)==null?void 0:m.chargeS))throw s("swoop is { chargeS }");let r;try{r=w_(e.stats)}catch(p){throw s(p.message)}const o=e.ranged===null?null:Jh(e.ranged,`${n}, ranged`,!1),a=Jh(e.melee,`${n}, melee`,!0),c=(p,x)=>e[p]===void 0?x:e[p],l=c("fly",!1),h=c("big",!1),u=c("wrecker",!1),d=c("burrow",!1),f=c("hero",e.role==="Hero"),g={key:t,race:i,name:e.name,short:e.short,role:e.role,ai:e.ai,models:e.models,base:e.base,pts:e.pts,...r,ranged:o,melee:a,abilities:[...e.abilities],fly:l,big:h,hero:f,wrecker:u,burrow:d,chargeAfterAdvance:c("chargeAfterAdvance",!1),noCharge:c("noCharge",e.role==="Artillery"),brawler:c("brawler",!o||u),move:e.move??(l?"fly":u?"wreck":d?"burrow":"walk"),deployRow:e.deployRow??(e.role==="Artillery"?"back":f?"mid":"front"),eye:e.eye??(h?1.9:l?1.5:.95),chest:e.chest??(h||l?1:.55)};return e.swarm&&(g.swarm={min:e.swarm.min}),e.swoop&&(g.swoop={chargeS:e.swoop.chargeS}),g}function T_(i){if(!i||typeof i!="object")throw new Error("defineRace needs a race object");const{key:t}=i;if(typeof t!="string"||!Kh.test(t))throw new Error(`race key "${t}" must be lower-case letters, digits and dashes`);const e=r=>new Error(`race ${t}: ${r}`);for(const r of Object.keys(i))if(!["key","name","short","icon","look","army","units"].includes(r))throw e(`unknown field "${r}"`);for(const r of["name","short","icon"])if(typeof i[r]!="string"||!i[r])throw e(`needs a ${r}`);const n=i.look;if(!n||typeof n!="object")throw e("needs a look");for(const r of["team","dark","alt"])if(!Yh.test(n[r]??""))throw e(`look.${r} must be a #rrggbb colour`);if(!Array.isArray(n.gore)||n.gore.length!==2||!n.gore.every(r=>Yh.test(r)))throw e("look.gore is two #rrggbb colours");for(const r of["voice","models","anim"])if(typeof n[r]!="string"||!n[r])throw e(`look.${r} must be named`);if(!i.units||typeof i.units!="object"||!Object.keys(i.units).length)throw e("needs units");const s=Object.create(null);for(const[r,o]of Object.entries(i.units)){if(!Kh.test(r))throw e(`unit key "${r}" must be lower-case letters, digits and dashes`);s[r]=E_(t,r,o)}if(!Array.isArray(i.army)||!i.army.length)throw e("needs an army list");for(const r of i.army)if(!s[r])throw e(`army lists "${r}", which is not one of its units`);return un({key:t,name:i.name,short:i.short,icon:i.icon,look:{...n,gore:[...n.gore]},army:[...i.army],units:s})}function A_(i){const t=i.map(s=>T_(s)),e=t.map(s=>s.key),n=e.find((s,r)=>e.indexOf(s)!==r);if(n!==void 0)throw new Error(`two races use the key "${n}"`);return un(Object.assign(Object.create(null),Object.fromEntries(t.map(s=>[s.key,s]))))}const Sn=A_([y_,M_]),Cs=un(Object.assign(Object.create(null),{classic:{objectives:[{x:0,z:0},{x:-9,z:8},{x:9,z:-8},{x:-9,z:-8},{x:9,z:8}],rounds:Of,deploy:Xn.deploy}})),Zh=Object.freeze(["squirrel","serpent"]);function Bt(i,t){const e=Math.abs(i),n=Math.abs(t);if(e===1/0||n===1/0)return 1/0;const s=Math.max(e,n);return s!==s?NaN:s===0?0:Math.sqrt(e/s*(e/s)+n/s*(n/s))*s}function R_(i,t,e){const n=Math.abs(i),s=Math.abs(t),r=Math.abs(e);if(n===1/0||s===1/0||r===1/0)return 1/0;const o=Math.max(Math.max(n,s),r);if(o!==o)return NaN;if(o===0)return 0;const a=n/o*(n/o),c=s/o*(s/o),l=a+c-a-c,h=r/o*(r/o)-l;return Math.sqrt(a+c+h)*o}const Li=new DataView(new ArrayBuffer(8)),wn=i=>(Li.setFloat64(0,i),Li.getInt32(0)),hc=i=>(Li.setFloat64(0,i),Li.getUint32(4)),Et=(i,t)=>(Li.setUint32(0,i>>>0),Li.setUint32(4,t>>>0),Li.getFloat64(0));function Jr(i,t){for(;t>1023;)i*=Et(2145386496,0),t-=1023;for(;t<-1022;)i*=Et(1048576,0),t+=1022;return i*Et(t+1023<<20,0)}const Qh=Object.freeze([10680707,7228996,1387004,2578385,16069853,12639074,9804092,4427841,16666979,11263675,12935607,2387514,4345298,14681673,3074569,13734428,16653803,1880361,10960616,8533493,3062596,8710556,7349940,6258241,3772886,3769171,3798172,8675211,12450088,3874808,9961438,366607,15675153,9132554,7151469,3571407,2607881,12013382,4155038,6285869,7677882,13102053,15825725,473591,9065106,15363067,6271263,9264392,5636912,4652155,7056368,13614112,10155062,1944035,9527646,15080200,6658437,6231200,6832269,16767104,5075751,3212806,1398474,7579849,6349435,12618859]),C_=Object.freeze([1073291771,1074340347,1074977148,1075388923,1075800698,1076025724,1076231611,1076437499,1076643386,1076849274,1076971356,1077074300,1077177244,1077280187,1077383131,1077486075,1077589019,1077691962,1077794906,1077897850,1077968460,1078019932,1078071404,1078122876,1078174348,1078225820,1078277292,1078328763,1078380235,1078431707,1078483179,1078534651]),P_=Object.freeze([Et(1073291771,1073741824),Et(1047807021,0),Et(1022903960,2147483648),Et(997772369,1610612736),Et(972036995,2147483648),Et(947528992,1073741824),Et(920879650,2147483648),Et(896135965,0)]),uo=Et(1097859072,0),Ua=Et(1047527424,0),L_=Et(1071931184,1841940611),tu=Et(1073291771,1413480448),Na=Et(1037087841,442655537),eu=Et(1037087841,442499072),Oa=Et(1000544650,771977331),D_=Et(1000544650,771751936),I_=Et(964395930,622873025);function U_(i,t,e,n){const o=new Array(20).fill(0),a=new Array(20).fill(0),c=new Array(20).fill(0),l=new Array(20).fill(0),h=n-1,u=Math.max(0,Math.trunc((e-3)/24));let d=e-24*(u+1);for(let x=0,y=u-h;x<=h+4;x++,y++)o[x]=y<0?0:Qh[y];for(let x=0;x<=4;x++){let y=0;for(let _=0;_<=h;_++)y+=i[_]*o[h+x-_];a[x]=y}let f=4,g,v,m,p;for(;;){g=a[f];for(let _=0,R=f;R>0;_++,R--)p=Math.trunc(Ua*g),l[_]=Math.trunc(g-uo*p),g=a[R-1]+p;if(g=Jr(g,d),g-=8*Math.floor(g*.125),v=Math.trunc(g),g-=v,m=0,d>0){const _=l[f-1]>>24-d;v+=_,l[f-1]-=_<<24-d,m=l[f-1]>>23-d}else d===0?m=l[f-1]>>23:g>=.5&&(m=2);if(m>0){v+=1;let _=0;for(let R=0;R<f;R++){const S=l[R];_===0?S!==0&&(_=1,l[R]=16777216-S):l[R]=16777215-S}d===1?l[f-1]&=8388607:d===2&&(l[f-1]&=4194303),m===2&&(g=1-g,_!==0&&(g-=Jr(1,d)))}if(g!==0)break;let x=0;for(let _=f-1;_>=4;_--)x|=l[_];if(x!==0)break;let y=1;for(;4>=y&&l[4-y]===0;)y++;for(let _=f+1;_<=f+y;_++){o[h+_]=Qh[u+_];let R=0;for(let S=0;S<=h;S++)R+=i[S]*o[h+_-S];a[_]=R}f+=y}if(g===0)for(f-=1,d-=24;l[f]===0;)f--,d-=24;else g=Jr(g,-d),g>=uo?(p=Math.trunc(Ua*g),l[f]=Math.trunc(g-uo*p),f+=1,d+=24,l[f]=p):l[f]=Math.trunc(g);p=Jr(1,d);for(let x=f;x>=0;x--)a[x]=p*l[x],p*=Ua;for(let x=f;x>=0;x--){let y=0;for(let _=0;_<=4&&_<=f-x;_++)y+=P_[_]*a[x+_];c[f-x]=y}p=0;for(let x=f;x>=0;x--)p+=c[x];t[0]=m===0?p:-p,p=c[0]-p;for(let x=1;x<=f;x++)p+=c[x];return t[1]=m===0?p:-p,v&7}function Hf(i,t){const e=wn(i),n=e&2147483647;if(n<=1072243195)return t[0]=i,t[1]=0,0;if(n<1073928572){const l=e>0?1:-1;let h=i-l*tu;return n!==1073291771?(t[0]=h-l*Na,t[1]=h-t[0]-l*Na):(h-=l*eu,t[0]=h-l*Oa,t[1]=h-t[0]-l*Oa),l}if(n<=1094263291){let l=Math.abs(i);const h=Math.trunc(l*L_+.5);let u=l-h*tu,d=h*Na;if(t[0]=u-d,h>=32||n===C_[h-1]){const f=n>>20;f-(wn(t[0])>>20&2047)>16&&(l=u,d=h*eu,u=l-d,d=h*Oa-(l-u-d),t[0]=u-d,f-(wn(t[0])>>20&2047)>49&&(l=u,d=h*D_,u=l-d,d=h*I_-(l-u-d),t[0]=u-d))}return t[1]=u-t[0]-d,e<0?(t[0]=-t[0],t[1]=-t[1],-h):h}if(n>=2146435072)return t[0]=t[1]=i-i,0;const s=(n>>20)-1046;let r=Et(n-(s<<20),hc(i));const o=[0,0,0];for(let l=0;l<2;l++)o[l]=Math.trunc(r),r=(r-o[l])*uo;o[2]=r;let a=3;for(;o[a-1]===0;)a--;const c=U_(o,t,s,a);return e<0?(t[0]=-t[0],t[1]=-t[1],-c):c}const nu=Et(3217380693,1431655753),N_=Et(1065423121,286324902),O_=Et(3207201184,432103893),z_=Et(1053236707,1471282813),F_=Et(3193628134,2318114027),k_=Et(1038473530,1523570044);function rr(i,t,e){if((wn(i)&2147483647)<1044381696&&Math.trunc(i)===0)return i;const n=i*i,s=n*i,r=N_+n*(O_+n*(z_+n*(F_+n*k_)));return e===0?i+s*(nu+n*r):i-(n*(.5*t-s*r)-t-s*nu)}const B_=Et(1067799893,1431655756),H_=Et(3210133868,381768055),V_=Et(1056571808,432739728),W_=Et(3197271631,2157728429),G_=Et(1042411166,3182735812),$_=Et(3181968105,3196598484);function or(i,t){const e=wn(i)&2147483647;if(e<1044381696&&Math.trunc(i)===0)return 1;const n=i*i,s=n*(B_+n*(H_+n*(V_+n*(W_+n*(G_+n*$_)))));if(e<1070805811)return 1-(.5*n-(n*s-i*t));const r=e>1072234496?.28125:Et(e-2097152,0);return 1-r-(.5*n-r-(n*s-i*t))}function Ie(i){const t=wn(i)&2147483647;if(t<=1072243195)return rr(i,0,0);if(t>=2146435072)return i-i;const e=[0,0];switch(Hf(i,e)&3){case 0:return rr(e[0],e[1],1);case 1:return or(e[0],e[1]);case 2:return-rr(e[0],e[1],1);default:return-or(e[0],e[1])}}function $e(i){const t=wn(i)&2147483647;if(t<=1072243195)return or(i,0);if(t>=2146435072)return i-i;const e=[0,0];switch(Hf(i,e)&3){case 0:return or(e[0],e[1]);case 1:return-rr(e[0],e[1],1);case 2:return-or(e[0],e[1]);default:return rr(e[0],e[1],1)}}const za=Object.freeze([Et(1071492199,90291023),Et(1072243195,1413754136),Et(1072657163,3531732635),Et(1073291771,1413754136)]),Fa=Object.freeze([Et(1014639487,573531618),Et(1015129638,856972295),Et(1013974920,2062601149),Et(1016178214,856972295)]),mn=Object.freeze([Et(1070945621,1431655693),Et(3217660313,2576935876),Et(1069697316,2449507327),Et(3216798150,4263712369),Et(1068975565,3310100590),Et(3216224498,2943654509),Et(1068567910,2698001745),Et(3215842861,1390345626),Et(1068071755,611716587),Et(3215111236,745172015),Et(1066446138,3810712081)]);function uc(i){const t=wn(i),e=t&2147483647;let n;if(e>=1141899264)return i!==i?i+i:t>0?za[3]+Fa[3]:-za[3]-Fa[3];if(e<1071382528){if(e<1044381696)return i;n=-1}else i=Math.abs(i),e<1072889856?e<1072037888?(n=0,i=(2*i-1)/(2+i)):(n=1,i=(i-1)/(i+1)):e<1073971200?(n=2,i=(i-1.5)/(1+1.5*i)):(n=3,i=-1/i);const s=i*i,r=s*s,o=s*(mn[0]+r*(mn[2]+r*(mn[4]+r*(mn[6]+r*(mn[8]+r*mn[10]))))),a=r*(mn[1]+r*(mn[3]+r*(mn[5]+r*(mn[7]+r*mn[9]))));if(n<0)return i-i*(o+a);const c=za[n]-(i*(o+a)-Fa[n]-i);return t<0?-c:c}const Zr=Et(1072243195,1413754136),Ys=Et(1073291771,1413754136),as=Et(1074340347,1413754136),ka=Et(1017226790,856972295);function Ps(i,t){if(t!==t||i!==i)return t+i;const e=wn(t),n=hc(t),s=e&2147483647,r=wn(i),o=hc(i),a=r&2147483647;if(t===1)return uc(i);let c=r>>31&1|e>>30&2;if(!(a|o))return c<2?i:c===2?as:-as;if(!(s|n))return r<0?-Ys:Ys;if(s===2146435072)return a===2146435072?[Zr,-Zr,3*Zr,-3*Zr][c]:[0,-0,as,-as][c];if(a===2146435072)return r<0?-Ys:Ys;const l=a-s>>20;let h;switch(l>60?(h=Ys+.5*ka,c&=1):e<0&&l<-60?h=0:h=uc(Math.abs(i/t)),c){case 0:return h;case 1:return-h;case 2:return as-(h-ka);default:return h-ka-as}}const iu=Math.SQRT2,Vf=(i,t,e)=>({nx:Math.round(i/e),nz:Math.round(t/e)});class j_{constructor(t,e,n=.5){this.W=t,this.H=e,this.cell=n;const{nx:s,nz:r}=Vf(t,e,n);this.nx=s,this.nz=r;const o=this.N=this.nx*this.nz;this.hard=new Uint8Array(o),this.soft=new Uint8Array(o),this.diff=new Uint8Array(o),this.cover=new Uint8Array(o),this.clearAll=new Float32Array(o),this.clearHard=new Float32Array(o),this.tmp=new Float32Array(o)}x(t){return-this.W/2+(t%this.nx+.5)*this.cell}z(t){return-this.H/2+(Math.floor(t/this.nx)+.5)*this.cell}index(t,e){const n=Math.floor((t+this.W/2)/this.cell),s=Math.floor((e+this.H/2)/this.cell);return n<0||s<0||n>=this.nx||s>=this.nz?-1:s*this.nx+n}rebuild(t){this.hard.fill(0),this.soft.fill(0),this.diff.fill(0),this.cover.fill(0);for(const e of t){if(!e.alive)continue;const n=e.nav||e.shape;e.navKind==="hard"?this.raster(n,.1,this.hard):e.navKind==="soft"?this.raster(n,.1,this.soft):e.navKind==="diff"&&this.raster(n,.15,this.diff),e.cover&&this.raster(e.coverShape||n,.6,this.cover)}this.field(this.hard,null,this.clearHard),this.field(this.hard,this.soft,this.clearAll)}raster(t,e,n){const s=Bt(t.hx,t.hz)+e,r=$e(t.yaw),o=Ie(t.yaw),a=Math.max(0,Math.floor((t.x-s+this.W/2)/this.cell)),c=Math.min(this.nx-1,Math.floor((t.x+s+this.W/2)/this.cell)),l=Math.max(0,Math.floor((t.z-s+this.H/2)/this.cell)),h=Math.min(this.nz-1,Math.floor((t.z+s+this.H/2)/this.cell));for(let u=l;u<=h;u++)for(let d=a;d<=c;d++){const f=u*this.nx+d,g=this.x(f)-t.x,v=this.z(f)-t.z,m=g*r-v*o,p=g*o+v*r;Math.abs(m)<=t.hx+e&&Math.abs(p)<=t.hz+e&&(n[f]=1)}}field(t,e,n){const{nx:s,nz:r,cell:o}=this,a=1e6,c=o,l=o*iu;for(let h=0;h<this.N;h++)n[h]=t[h]||e&&e[h]?0:a;for(let h=0;h<r;h++)for(let u=0;u<s;u++){const d=h*s+u;let f=n[d];u>0&&(f=Math.min(f,n[d-1]+c)),h>0&&(f=Math.min(f,n[d-s]+c),u>0&&(f=Math.min(f,n[d-s-1]+l)),u<s-1&&(f=Math.min(f,n[d-s+1]+l))),n[d]=f}for(let h=r-1;h>=0;h--)for(let u=s-1;u>=0;u--){const d=h*s+u;let f=n[d];u<s-1&&(f=Math.min(f,n[d+1]+c)),h<r-1&&(f=Math.min(f,n[d+s]+c),u<s-1&&(f=Math.min(f,n[d+s+1]+l)),u>0&&(f=Math.min(f,n[d+s-1]+l))),n[d]=f}for(let h=0;h<this.N;h++){const u=this.x(h),d=this.z(h),f=Math.min(u+this.W/2,this.W/2-u,d+this.H/2,this.H/2-d);n[h]=Math.min(n[h]>0?n[h]-o*.5:0,f)}}clearance(t,e){return e==="wreck"?this.clearHard[t]:this.clearAll[t]}standable(t,e,n,s){return t<0||s&&s[t]?!1:this.clearance(t,n==="wreck"?"wreck":"all")>=e-.06}reach(t,e,{r:n,max:s,mode:r="walk",forbid:o=null}){const a=this.N,c=new Float64Array(a).fill(1/0),l=new Int32Array(a).fill(-1),h=this.index(t,e),u={dist:c,prev:l,start:h,mode:r,sx:t,sz:e};if(h<0)return u;if(r==="fly"){for(let x=0;x<a;x++){const y=Bt(this.x(x)-t,this.z(x)-e);y<=s&&(c[x]=y)}return u}const d=Bt(t-this.x(h),e-this.z(h));c[h]=d;const f=new q_;f.push(h,d);const{nx:g,nz:v,cell:m}=this,p=this.clearance(h,r==="wreck"?"wreck":"all")<n-.06?n*1.5:0;for(;f.size;){const[x,y]=f.pop();if(y>c[x])continue;const _=x%g,R=x/g|0;for(let S=-1;S<=1;S++)for(let E=-1;E<=1;E++){if(!E&&!S)continue;const N=_+E,M=R+S;if(N<0||M<0||N>=g||M>=v)continue;const w=M*g+N;if(o&&o[w])continue;const B=this.clearance(w,r==="wreck"?"wreck":"all");if(B<n-.06&&!(p&&B>.05&&Bt(this.x(w)-t,this.z(w)-e)<p))continue;let W=this.diff[w]?2:1;r==="wreck"&&this.clearAll[w]<n-.06&&(W=2);const nt=y+(E&&S?iu:1)*m*W;nt<=s&&nt<c[w]&&(c[w]=nt,l[w]=x,f.push(w,nt))}}return u}path(t,e,n,s){if(t.mode==="fly")return[{x:t.sx,z:t.sz},{x:this.x(e),z:this.z(e)}];const r=[];for(let l=e;l!==-1&&(r.push(l),l!==t.start);l=t.prev[l]);r.reverse();const o=r.map(l=>({x:this.x(l),z:this.z(l)}));if(o[0]={x:t.sx,z:t.sz},o.length<3)return o;const a=[o[0]];let c=0;for(;c<o.length-1;){let l=c+1;for(let h=o.length-1;h>c+1;h--)if(this.walkable(o[c],o[h],n,t.mode,s)){l=h;break}a.push(o[l]),c=l}return a}walkable(t,e,n,s,r){const o=Bt(e.x-t.x,e.z-t.z),a=Math.ceil(o/(this.cell*.5)),c=this.diff[this.index(t.x,t.z)];for(let l=1;l<a;l++){const h=l/a,u=this.index(t.x+(e.x-t.x)*h,t.z+(e.z-t.z)*h);if(u<0||r&&r[u]||this.clearance(u,s==="wreck"?"wreck":"all")<n-.06||this.diff[u]!==c||s==="wreck"&&this.clearAll[u]<n-.06)return!1}if(r!=null&&r.discs){for(const l of r.discs)if(X_(t,e,l)<l.R)return!1}return!0}}function X_(i,t,e){const n=t.x-i.x,s=t.z-i.z,r=n*n+s*s;let o=r>0?((e.x-i.x)*n+(e.z-i.z)*s)/r:0;return o=o<0?0:o>1?1:o,Bt(i.x+n*o-e.x,i.z+s*o-e.z)}const Wf=i=>{let t=0;for(let e=1;e<i.length;e++)t+=Bt(i[e].x-i[e-1].x,i[e].z-i[e-1].z);return t};class q_{constructor(){this.ids=[],this.keys=[]}get size(){return this.ids.length}push(t,e){const{ids:n,keys:s}=this;let r=n.length;for(n.push(t),s.push(e);r>0;){const o=r-1>>1;if(s[o]<=e)break;n[r]=n[o],s[r]=s[o],r=o}n[r]=t,s[r]=e}pop(){const{ids:t,keys:e}=this,n=[t[0],e[0]],s=t.pop(),r=e.pop();if(t.length){let o=0;const a=t.length;for(;;){let c=2*o+1;if(c>=a||(c+1<a&&e[c+1]<e[c]&&c++,e[c]>=r))break;t[o]=t[c],e[o]=e[c],o=c}t[o]=s,e[o]=r}return n}}function Mi(i,t,e){i&&i.push({t,...e})}function ht(i,t,e={}){Mi(i.out,t,e)}function Gf(i,t){var e;i.journal.trace.push(t),(e=i.onTrace)==null||e.call(i,t,i)}function Fo(i,t){const e=i.units.map(n=>`${n.id}:${n.pos.x.toFixed(3)},${n.pos.z.toFixed(3)},${n.models.map(s=>s.w).join("/")}`).join(" ");Gf(i,`${t} ${e} chunks:${i.terrain.chunks.filter(n=>n.alive).length} vp:${i.turn.vp.join("-")} rng:${Oo(i.rng)}`)}function Y_(i,t,e){Gf(i,`log ${t} ${e.replace(/<[^>]+>/g,"")} rng:${Oo(i.rng)}`)}function Le(i,t,e,n=""){Y_(i,t,e),ht(i,"log",{side:t,html:e,cls:n,traced:!0,at:i.journal.trace.length}),$f(i)}function $f(i){for(const[t,e,n]of i.journal.pendingLog.splice(0))ht(i,"log",{side:t,html:e,cls:n,traced:!1,at:i.journal.trace.length})}const jf=un({stone:{colors:["#8f8b82","#9c978d","#7f7b73","#a7a296","#878378"],bw:1,by:.72,bt:.62,hp:3,look:"box"},sand:{colors:["#c9a66b","#d6b67e","#b9935b","#ddc28e","#c29a60"],bw:1,by:.72,bt:.66,hp:2,look:"box"},log:{colors:["#7a5232","#6b4528","#86603c","#5f3e24"],bw:1,by:.56,bt:.56,hp:2,look:"log"}}),K_=un({oak:["#4f8a34","#5f9a3c","#447a2c","#6aa646"],autumn:["#d08a2c","#c4622a","#e0a93a","#b8481f"],pine:["#2f6a3c","#3a7a46","#285c34"]}),J_=un(["#7a5232","#5f3e24","#9a7048","#b08a5a"]),Z_=Object.freeze(["#6b4a2e","#5a3d24","#7a5638"]),Q_=Object.freeze(["#3f7a34","#4a8a3a","#386c2e"]),ty=Object.freeze(["#4f8f3e","#5c9a46","#3f7a34"]),ey=Object.freeze(["#3f7a34","#5c9a46","#2f5f28"]),ny=Object.freeze(["#7d7a74","#8c8880","#6e6b66","#96918a"]),iy=Object.freeze(["#9a7048","#8a6038","#a77d50"]),sy=Object.freeze(["#8a5a34","#7a4c2a"]),ry=Object.freeze(["#c0392b","#d35a1f","#8e44ad","#b03050"]),su=22;function ar(i,t,e,n){const s=zf(n),r=$e(e.yaw),o=Ie(e.yaw),a={p:(c,l)=>({x:e.x+r*c+o*l,z:e.z-o*c+r*l}),yaw:(c=0)=>e.yaw+c};fo[t](i,a,s)}function fr(i,t,e,n,s,r,o,a,{holes:c=[],cap:l=!1,bw:h,bt:u}={}){const d=jf[a],f=h??d.bw,g=u??d.bt,v=t.p(n,s),m=t.yaw(r),p={blocks:[],x:v.x,z:v.z,yaw:m,style:a,by:d.by,rubble:null,w:f,t:g};for(let x=0;x<o;x++){if(c.includes(x))continue;const y=Ge(d.colors,e),_=m+(e()-.5)*.06,R=d.look==="log"?[f*1.02,d.by,g]:[f*(.95+e()*.04),d.by*.96,g*(.9+e()*.1)],S=i.add({kind:"block",hp:d.hp,shape:{x:v.x,y:d.by*(x+.5),z:v.z,hx:f/2,hy:d.by/2,hz:g/2,yaw:m},navKind:"soft",los:"block",cover:!0,col:p,level:x,look:{piece:d.look,color:y,chip:y,scale:R,yaw:_}});p.blocks.push(S)}if(l&&o>0){const x=Ge(d.colors,e),y=d.by*o+f*.55,_=i.add({kind:"block",hp:d.hp,shape:{x:v.x,y,z:v.z,hx:f/2,hy:f*.55,hz:f/2,yaw:m},navKind:"soft",los:"block",cover:!0,col:p,level:o,look:{piece:"cap",color:x,chip:x,r:f*.72,h:f*1.1,yaw:m}});p.blocks.push(_)}return p}function oy(i,t,e,n,s,r){const o=t.p(n,s),a=ne(e,1.5,2.4),c=ne(e,.17,.26),l=Ge(Z_,e),h=K_[r],u=[];let d;if(r==="pine"){for(let g=0;g<3;g++){const v=1.05-g*.26,m=1.3-g*.15;u.push({cone:!0,r:v,h:m,color:Ge(h,e),y:a*.45+g*.75+m/2,yaw:e()*3})}d=a*.45+2.5}else{const g=3+Math.floor(e()*3);for(let v=0;v<g;v++){const m=ne(e,.55,.9);u.push({r:m,color:Ge(h,e),pos:[ne(e,-.5,.5),a+ne(e,-.1,.6),ne(e,-.5,.5)]})}d=a+1.2}const f=e()*6;return i.add({kind:"tree",hp:3,shape:{x:o.x,y:d/2,z:o.z,hx:.7,hy:d/2,hz:.7,yaw:0},nav:{x:o.x,z:o.z,hx:c+.12,hz:c+.12,yaw:0},coverShape:{x:o.x,z:o.z,hx:.8,hz:.8,yaw:0},navKind:"soft",los:"obscure",cover:!0,trunkH:a,trunkR:c,look:{piece:"tree",trunk:{h:a,r:c},bark:l,canopy:u,yaw:f,leaves:h}})}function ay(i,t,e,n,s,r){const o=t.p(n,s),a=t.yaw(r),c=Ge(Q_,e),l=[];for(let u=0;u<3;u++)l.push({color:Ge(ty,e),pos:[-.4+u*.4,.62+e()*.08,ne(e,-.08,.08)]});const h=[];if(e()<.4)for(let u=0;u<4;u++)h.push([ne(e,-.5,.5),ne(e,.35,.75),.29]);return i.add({kind:"hedge",hp:1,shape:{x:o.x,y:.42,z:o.z,hx:.6,hy:.42,hz:.3,yaw:a},navKind:"diff",los:"obscure",cover:!0,look:{piece:"hedge",color:c,tufts:l,berries:h,yaw:a,leaves:ey}})}function fc(i,t,e,n,s,r){const o=t.p(n,s),a=ne(e,.65,1.25),c=Ge(ny,e),l=[1,a,ne(e,.75,1.1)],h=[e()*.6,e()*6,e()*.6],u=r*a,d=e()<.6,f=u*1.5;return i.add({kind:"rock",hp:1/0,shape:{x:o.x,y:f/2,z:o.z,hx:r*.85,hy:f/2,hz:r*.85,yaw:0},navKind:"hard",los:f>1.2?"block":"obscure",cover:!0,look:{piece:"boulder",size:r,color:c,scale:l,rot:h,y:u*.55,moss:d}})}function $c(i,t,e,n,s){const r=t.p(n,s),o=t.yaw(e()*6),a=e();let c,l;if(a<.45){const h=ne(e,.55,.75),u=Ge(iy,e),d=e()<.4;c={piece:"crate",s:h,color:u,stacked:d},l=d?h*1.7:h}else if(a<.8)c={piece:"barrel",color:Ge(sy,e)},l=.75;else{const h=[];for(let u=0;u<4;u++)h.push([ne(e,-.12,.12),ne(e,-.12,.12)]);c={piece:"sack",acorns:h},l=.78}return i.add({kind:"crate",hp:1,shape:{x:r.x,y:l/2,z:r.z,hx:.36,hy:l/2,hz:.36,yaw:o},navKind:"diff",los:"obscure",cover:!0,look:{...c,yaw:o,chip:"#9a7048"}})}function cy(i,t,e,n,s){const r=t.p(n,s),o=ne(e,.9,1.9),a=ne(e,.5,.95),c=ne(e,.12,.2),l=Ge(ry,e),h=[];for(let f=0;f<6;f++){const g=e()*6,v=ne(e,.25,1.1);h.push([g,v])}const u=ne(e,-.12,.12),d=o+a*.7;return i.add({kind:"mushroom",hp:2,shape:{x:r.x,y:d/2,z:r.z,hx:a*.6,hy:d/2,hz:a*.6,yaw:0},nav:{x:r.x,z:r.z,hx:c+.12,hz:c+.12,yaw:0},navKind:"soft",los:"obscure",cover:!0,look:{piece:"mushroom",h:o,r:a,sr:c,cap:l,dots:h,tilt:u,leaves:[l,"#fff6e0","#efe6d0"]}})}function ly(i,t,e,n,s){const r=t.p(0,0),o=[];for(let a=1;a<su+2;a++)o.push(.78+e()*.3);return i.add({kind:"floor",hp:1/0,shape:{x:r.x,y:.01,z:r.z,hx:n*.75,hy:.01,hz:n*.75,yaw:0},navKind:"diff",cover:!0,look:{piece:"floor",r:n,segments:su,color:s,rim:o}})}function hy(i,t,e){const n=Ge(["stone","sand","log","stone"],e),s=4+Math.floor(e()*3),r=3+Math.floor(e()*3),o=-s/2+.5,a=-r/2+.5,c=1+Math.floor(e()*(s-2));for(let h=0;h<s;h++){if(h===c)continue;let u=Math.max(1,Math.min(3,3-Math.floor(h/2)+Math.floor(e()*2)-(e()<.3?1:0)));const d=u===3&&e()<.35?[1]:[];fr(i,t,e,o+h,a,0,u,n,{holes:d})}for(let h=1;h<=r;h++){let u=Math.max(1,Math.min(3,3-Math.floor(h/2)+Math.floor(e()*2)));if(e()<.15)continue;const d=u===3&&e()<.35?[1]:[];fr(i,t,e,o,a+.3+.5+(h-1),Math.PI/2,u,n,{holes:d})}const l=Math.floor(e()*3);for(let h=0;h<l;h++)$c(i,t,e,o+ne(e,1.5,s-1),a+ne(e,1.6,r-.5))}function uy(i,t,e){const n=Ge(["stone","sand","log"],e),s=5+Math.floor(e()*3),r=Math.floor(e()*s);for(let o=0;o<s;o++){if(o===r&&s>5)continue;const a=1+Math.floor(e()*3);fr(i,t,e,o-(s-1)/2,0,0,a,n,{holes:a===3&&e()<.4?[1]:[]})}e()<.6&&$c(i,t,e,ne(e,-2,2),ne(e,.9,1.4))}function fy(i,t,e){const n=Ge(["stone","sand"],e),s=18,r=3.4,o=[];for(let l=0;l<s/2;l++)o.push(1+Math.floor(e()*3));const a=new Set([0,Math.floor(s/4)+(e()<.5?0:1)]),c=o.map(l=>l===3&&e()<.4);for(let l=0;l<s;l++){const h=l%(s/2);if(a.has(h))continue;const u=l/s*Math.PI*2,d=Ps(-$e(u),-Ie(u));fr(i,t,e,$e(u)*r,Ie(u)*r,d,o[h],n,{holes:c[h]?[1]:[],bw:1.12})}}function dy(i,t,e){const n=e()<.3?"pine":e()<.4?"autumn":"oak";ly(i,t,e,3,n==="autumn"?"#5a5a2a":"#355a2a");const s=[],r=3+Math.floor(e()*3);for(let o=0;o<60&&s.length<r;o++){const a=e()*Math.PI*2,c=Math.sqrt(e())*2.2,l=$e(a)*c,h=Ie(a)*c;s.some(u=>Bt(u.x-l,u.z-h)<1.55)||s.push({x:l,z:h})}for(const o of s)oy(i,t,e,o.x,o.z,n)}function py(i,t,e){const n=5+Math.floor(e()*3),s=ne(e,-.12,.12),r=1+Math.floor(e()*(n-2));for(let o=0;o<n;o++){if(o===r&&e()<.7)continue;const a=(o-(n-1)/2)*1.12,c=s*a*a;ay(i,t,e,a,c,-uc(2*s*a))}}function my(i,t,e){const n=2+Math.floor(e()*3);fc(i,t,e,0,0,ne(e,.8,1.15));for(let s=1;s<n;s++){const r=e()*6;fc(i,t,e,$e(r)*ne(e,.9,1.4),Ie(r)*ne(e,.9,1.4),ne(e,.35,.7))}}function gy(i,t,e){const n=3+Math.floor(e()*3);for(let s=0;s<n;s++)$c(i,t,e,(s-(n-1)/2)*.8+ne(e,-.1,.1),ne(e,-.3,.3))}function vy(i,t,e){const n=3+Math.floor(e()*3),s=[];for(let r=0;r<40&&s.length<n;r++){const o=e()*6,a=Math.sqrt(e())*1.5,c=$e(o)*a,l=Ie(o)*a;s.some(h=>Bt(h.x-c,h.z-l)<.9)||(s.push({x:c,z:l}),cy(i,t,e,c,l))}}function xy(i,t,e){fr(i,t,e,0,0,0,3+Math.floor(e()*2),"sand",{cap:!0,bw:.8,bt:.8}),e()<.7&&fc(i,t,e,1,.4,.4)}const fo=un(Object.assign(Object.create(null),{ruin:hy,wall:uy,tower:fy,forest:dy,hedgerow:py,rocks:my,barricade:gy,mushrooms:vy,obelisk:xy})),dc=un(Object.assign(Object.create(null),{tower(i,t,e){ar(i,"tower",{x:0,z:0,yaw:t()*Math.PI},t()*1e9|0),e.push({x:0,z:0,r:4.6,hollow:!0})},rockbox(i,t,e){const n=t()*Math.PI;for(const s of[0,1]){const r=n+s*(Math.PI/2),o=$e(r)*4.2,a=Ie(r)*4.2,c=t()*1e9|0;ar(i,"rocks",{x:o,z:a,yaw:r},c),ar(i,"rocks",{x:-o,z:-a,yaw:r+Math.PI},c),e.push({x:o,z:a,r:1.8},{x:-o,z:-a,r:1.8})}}}));function _y(i,t,e,n,s){const r=zf(e),{W:o,H:a}=i,c=[],l=r(),h=t.centre.find(([,v])=>l<v);h&&dc[h[0]](i,r,c);const u=t.kinds,d=u.reduce((v,m)=>v+m[2],0),f=t.pairs[0]+Math.floor(r()*t.pairs[1]);let g=0;for(let v=0;v<t.attempts&&g<f;v++){let m=r()*d,p=u[0];for(const w of u)if((m-=w[2])<=0){p=w;break}const[x,y]=p,_=ne(r,-o/2+y+t.margin,o/2-y-t.margin),R=ne(r,-a/2+y+t.margin,a/2-y-t.margin);if(Bt(_,R)<y+t.selfGap||Math.abs(_)>o/2-s-t.deployMargin&&(y>t.bigNotInDeploy||t.notInDeploy.includes(x))||n.some(w=>Bt(w.x-_,w.z-R)<y+t.objectiveGap))continue;const E=t.gap;if(c.some(w=>Bt(w.x-_,w.z-R)<w.r+y+E||Bt(w.x+_,w.z+R)<w.r+y+E))continue;const N=r()*Math.PI*2,M=r()*1e9|0;ar(i,x,{x:_,z:R,yaw:N},M),ar(i,x,{x:-_,z:-R,yaw:N+Math.PI},M),c.push({x:_,z:R,r:y},{x:-_,z:-R,r:y}),g++}return c}const ru=Object.freeze(["centre","kinds","pairs","attempts","mirror","margin","selfGap","deployMargin","bigNotInDeploy","notInDeploy","objectiveGap","gap"]),ou=Object.freeze(["point"]);function yy(i,t){const e=r=>{throw new Error(`terrain set "${i}": ${r}`)},n=r=>typeof r=="number"&&Number.isFinite(r),s=r=>Number.isInteger(r)&&r>=0;(!t||typeof t!="object")&&e("is not a table");for(const r of Object.keys(t))ru.includes(r)||e(`unknown field "${r}"`);for(const r of ru)r in t||e(`no "${r}"`);(!Array.isArray(t.kinds)||!t.kinds.length)&&e("kinds must list at least one feature"),t.kinds.forEach((r,o)=>{(!Array.isArray(r)||r.length!==3)&&e(`kinds[${o}] must be [feature, radius, weight]`),r[0]in fo||e(`kinds[${o}]: no feature "${r[0]}" (there are ${Object.keys(fo).join(", ")})`),(!n(r[1])||r[1]<=0)&&e(`kinds[${o}] (${r[0]}): radius ${r[1]} must be a number above 0`),(!n(r[2])||r[2]<=0)&&e(`kinds[${o}] (${r[0]}): weight ${r[2]} must be a number above 0`)}),Array.isArray(t.centre)||e("centre must be a list of [piece, threshold]"),t.centre.forEach((r,o)=>{(!Array.isArray(r)||r.length!==2)&&e(`centre[${o}] must be [piece, threshold]`),r[0]in dc||e(`centre[${o}]: no centre piece "${r[0]}" (there are ${Object.keys(dc).join(", ")})`),(!n(r[1])||r[1]<=0||r[1]>1)&&e(`centre[${o}] (${r[0]}): threshold ${r[1]} must be in (0, 1]`),o&&r[1]<=t.centre[o-1][1]&&e(`centre[${o}] (${r[0]}): thresholds must rise (the first one above the draw wins)`)}),(!Array.isArray(t.pairs)||t.pairs.length!==2||!t.pairs.every(s))&&e("pairs must be two whole numbers, 0 or more"),s(t.attempts)||e(`attempts ${t.attempts} must be a whole number, 0 or more`),ou.includes(t.mirror)||e(`mirror "${t.mirror}" is not one scatter knows (${ou.join(", ")})`);for(const r of["margin","selfGap","deployMargin","bigNotInDeploy","objectiveGap","gap"])n(t[r])||e(`${r} ${t[r]} must be a finite number`);Array.isArray(t.notInDeploy)||e("notInDeploy must be a list of features");for(const r of t.notInDeploy)r in fo||e(`notInDeploy: no feature "${r}"`);return t}const vs=un(Object.assign(Object.create(null),{classic:{centre:[["tower",.55],["rockbox",.8]],kinds:[["ruin",3.2,4],["wall",3.6,2],["forest",3.2,3],["hedgerow",3.4,2],["rocks",2,2],["barricade",2,2],["mushrooms",2,1.5],["obelisk",1.6,1]],pairs:[6,3],attempts:1200,mirror:"point",margin:.5,selfGap:1.4,deployMargin:1,bigNotInDeploy:2.1,notInDeploy:["forest"],objectiveGap:2.2,gap:2.1}}));for(const i of Object.keys(vs))yy(i,vs[i]);function My(i,t,e,n,s){const r=$e(s.yaw),o=Ie(s.yaw),a=i.x-s.x,c=i.y-s.y,l=i.z-s.z,h=[a*r-l*o,c,a*o+l*r],u=[t*r-n*o,e,t*o+n*r],d=[s.hx,s.hy,s.hz];let f=0,g=1;for(let v=0;v<3;v++)if(Math.abs(u[v])<1e-9){if(Math.abs(h[v])>d[v])return!1}else{let m=(-d[v]-h[v])/u[v],p=(d[v]-h[v])/u[v];if(m>p&&([m,p]=[p,m]),m>f&&(f=m),p<g&&(g=p),f>g)return!1}return!0}function by(i,t,e,n){const s=$e(n.yaw),r=Ie(n.yaw),o=i-n.x,a=t-n.y,c=e-n.z,l=o*s-c*r,h=o*r+c*s,u=Math.max(0,Math.abs(l)-n.hx),d=Math.max(0,Math.abs(a)-n.hy),f=Math.max(0,Math.abs(h)-n.hz);return R_(u,d,f)}const au=i=>({x:i.shape.x,y:i.shape.y,z:i.shape.z}),Sy=i=>({id:i.id,kind:i.kind,shape:{...i.shape},look:i.look});class wy{constructor(t,e){this.W=t,this.H=e,this.chunks=[],this.features=[],this.dirty=!0,this.nextId=1}clear(t=null){this.chunks=[],this.features=[],this.nextId=1,this.dirty=!0,Mi(t,"terrain.clear",{})}add(t,e=null){const n={id:this.nextId++,alive:!0,destructible:t.hp!==1/0,hp:t.hp??1/0,maxHp:t.hp??1/0,los:null,cover:!1,navKind:null,...t},s=n.shape;return s.reach=Bt(s.hx,s.hz)+.05,this.chunks.push(n),Mi(e,"terrain.add",{def:Sy(n)}),n}generate(t,e,n,s="classic",r=null){if(!(s in vs))throw new Error(`no terrain set "${s}" (there are ${Object.keys(vs).join(", ")})`);this.clear(r);const o={W:this.W,H:this.H,add:a=>this.add(a,r)};this.features=_y(o,vs[s],t,e,n),this.dirty=!0}los(t,e,n=1.3){let s=0;const r=e.x-t.x,o=e.y-t.y,a=e.z-t.z,c=r*r+a*a;for(const l of this.chunks){if(!l.alive||!l.los)continue;const h=l.shape;let u=c>0?((h.x-t.x)*r+(h.z-t.z)*a)/c:0;u=u<0?0:u>1?1:u;const d=t.x+r*u-h.x,f=t.z+a*u-h.z;if(!(d*d+f*f>h.reach*h.reach)&&My(t,r,o,a,h)){if(l.los==="block")return{blocked:!0,obscure:s};Bt(h.x-t.x,h.z-t.z)<n+h.reach*.5||s++}}return{blocked:s>=2,obscure:s}}blast(t,e,n,s,{acid:r=!1}={},o=null){const a=[];for(const c of[...this.chunks]){if(!c.alive||!c.destructible)continue;const l=by(t,.5,e,c.shape);if(l>n)continue;let h=l<n*.6?s:Math.ceil(s/2);r&&c.kind==="block"&&(h+=1),this.hurt(c,h,{x:t,z:e},o,a)}return a}hurt(t,e,n,s=null,r=[]){return!t.alive||!t.destructible||(t.hp-=e,t.hp<=0?(this.destroy(t,n,s),r.push(t)):Mi(s,"terrain.hurt",{id:t.id,from:n,at:au(t)})),r}destroy(t,e,n=null){switch(t.alive=!1,this.dirty=!0,Mi(n,"terrain.destroy",{id:t.id,kind:t.kind,from:e,at:au(t)}),t.kind){case"block":this.collapse(t.col,n),this.rubble(t.col,e,n);break;case"tree":this.topple(t,e,n);break}}collapse(t,e=null){t.blocks=t.blocks.filter(r=>r.alive).sort((r,o)=>r.level-o.level);const n=[];let s=0;for(const r of t.blocks){if(r.level>s){const o=(r.level-s)*t.by;r.level=s,r.shape.y-=o,n.push({id:r.id,dy:o})}s=r.level+1}n.length&&Mi(e,"terrain.collapse",{drops:n,by:t.by})}rubble(t,e,n=null){let s=t.rubble;if(!s){const r=t.style;s=t.rubble=this.add({kind:"rubble",hp:1/0,shape:{x:t.x,y:.2,z:t.z,hx:t.w*.7,hy:.2,hz:.6,yaw:t.yaw},navKind:"diff",los:"obscure",cover:!0,look:{piece:"rubble",style:r}},n),this.dirty=!0}Mi(n,"terrain.rubble",{id:s.id,from:e})}topple(t,e,n=null){const s=t.shape;let r=s.x-((e==null?void 0:e.x)??s.x-1),o=s.z-((e==null?void 0:e.z)??s.z);const a=Bt(r,o)||1;r/=a,o/=a;const c=t.trunkH,l=this.add({kind:"log",hp:2,shape:{x:s.x+r*c*.5,y:t.trunkR,z:s.z+o*c*.5,hx:c*.5,hy:t.trunkR,hz:t.trunkR+.05,yaw:Ps(-o,r)},navKind:"diff",los:"obscure",cover:!0,look:{piece:"fallen",tree:t.id,dx:r,dz:o}},n);return this.dirty=!0,l}}function Ey(i,t){const e=t*2+.16;if(i===1)return[[0,0]];if(i<=4){const r=i===2?e/2:e/(2*Ie(Math.PI/i));return Array.from({length:i},(o,a)=>[$e(a/i*Math.PI*2+.4)*r,Ie(a/i*Math.PI*2+.4)*r])}const n=i-1,s=Math.max(e,e/(2*Ie(Math.PI/n)));return[[0,0],...Array.from({length:n},(r,o)=>[$e(o/n*Math.PI*2+.3)*s,Ie(o/n*Math.PI*2+.3)*s])]}function Ty(i,t,e){const n=hi(i,e),s=n.units[t],r={id:i.nextUnitId++,key:t,t:s,side:e,race:n.key,pos:{x:0,z:0},models:[],alive:s.models,r:0,flags:{},lost:0,mesmerized:!1};for(let o=0;o<s.models;o++)r.models.push({w:s.W,alive:!0,ox:0,oz:0});return Xf(r),r}function Xf(i){const t=i.models.filter(n=>n.alive),e=Ey(t.length,i.t.base);t.sort((n,s)=>Ps(n.oz,n.ox)-Ps(s.oz,s.ox)),e.forEach(([n,s],r)=>{t[r].ox=n,t[r].oz=s}),i.r=e.reduce((n,[s,r])=>Math.max(n,Bt(s,r)),0)+i.t.base}function ko(i,t,e){i.pos.x=t,i.pos.z=e}function qf(i,t){const{W:e}=Xn,n=Bo(i,t),s=n*(e/2),r=n*(e/2-dr(i.setup).deploy);return{minX:Math.min(s,r),maxX:Math.max(s,r)}}function Yf(i,t,e,{minX:n,maxX:s},r){const o=i.nav,a=o.x(e),c=o.z(e);return!(a-t.r<n-.01||a+t.r>s+.01||!o.standable(e,t.r,"walk")||r.some(l=>Bt(l.pos.x-a,l.pos.z-c)<l.r+t.r+.4))}function Ay(i,t,e){return Number.isInteger(e)&&e>=0&&e<i.nav.N&&Yf(i,t,e,qf(i,t.side),i.units.filter(n=>n!==t))}function Kf(i,t,e,n,s,r){const o=i.nav;let a=null,c=1/0;const l=qf(i,s);for(let h=0;h<o.N;h++){if(!Yf(i,t,h,l,r))continue;const u=o.x(h),d=o.z(h),f=Bt(u-e,d-n);f<c&&(c=f,a={x:u,z:d})}return a}function Ry(i){const{W:t,H:e}=Xn;for(const n of[0,1]){const s=Bo(i,n),r=i.units.filter(d=>d.side===n),o=[],a=r.filter(d=>d.t.deployRow==="back"),c=r.filter(d=>d.t.deployRow==="mid"),l=r.filter(d=>d.t.deployRow==="front"),h=dr(i.setup).deploy,u=[[l,t/2-h+1.8],[c,t/2-h+3.6],[a,t/2-2.4]];for(const[d,f]of u)d.forEach((g,v)=>{const m=((v+.5)/d.length-.5)*(e-6)*-s,p=Kf(i,g,s*f,m,n,o)||{x:s*f,z:m};ko(g,p.x,p.z),o.push(g)})}}const Jf=Object.freeze([-1,1]),dr=i=>Cs.classic,Zf=.5;function Cy(i,t){if(i.length!==2||t.length!==2)throw new Error("a match has two seats");return i.map((e,n)=>{if(typeof e!="string"||!Sn[e])throw new Error(`seat ${n}: no race "${e}" (there are ${Object.keys(Sn).join(", ")})`);if(t[n]!=="human"&&t[n]!=="ai")throw new Error(`seat ${n}: controller "${t[n]}" is neither human nor ai`);return{seat:n,race:e,edge:Jf[n],ctrl:t[n]}})}const Py=i=>({...i,seats:i.seats.map(t=>({...t}))}),hi=(i,t)=>Sn[i.seats[t].race],Bo=(i,t)=>i.seats[t].edge,Qf=(i,t)=>i.seats[t].ctrl;function Ly(i,{out:t=null,onTrace:e=null}={}){const{W:n,H:s}=Xn,r={setup:un(Py(i)),rng:x_(i.dice),seats:Cy(i.seats.map(o=>o.race),i.seats.map(o=>o.ctrl)),units:[],nextUnitId:1,objectives:dr().objectives.map((o,a)=>({i:a,x:o.x,z:o.z})),terrain:new wy(n,s),nav:new j_(n,s,Zf),turn:{stage:"deploy",step:"rolloff",round:1,t:0,active:0,first:0,ph:0,vp:[0,0],wiped:-1,result:null,overtime:0},pending:null,journal:{trace:[],pendingLog:[]},out:t,onTrace:e,strict:!1};r.terrain.generate(i.board,r.objectives,dr().deploy,i.terrain,t),Hi(r);for(const o of[0,1])for(const a of hi(r,o).army)r.units.push(Ty(r,a,o));return Ry(r),r}function Hi(i){i.terrain.dirty&&(i.terrain.dirty=!1,i.nav.rebuild(i.terrain.chunks))}function Ho(i,t,e,n,s,r=null){let o=0;for(let a=0;a<e;a++){const c=t.models.filter(f=>f.alive);if(!c.length)break;let l=r?c.filter(f=>r.includes(f)):[];l.length||(l=c);const h=l.filter(f=>f.w<t.t.W);let u;if(h.length)u=h[0];else{const f=g=>Bt(Fs(t,g)-s.pos.x,ks(t,g)-s.pos.z);u=l.reduce((g,v)=>f(g)<f(v)?g:v)}u.w-=n;const d=Math.min(n,n+Math.min(0,u.w));u.w<=0?(Dy(i,t,u,s,d),o++):ht(i,"unit.wound",{u:t.id,m:t.models.indexOf(u),dmg:d}),ht(i,"pause",{s:.06})}return o&&(t.lost+=o,ht(i,"pause",{s:.25}),re(t)&&td(i,t),i.out&&ht(i,"objectives",{owners:Vi(i)})),i.out&&ht(i,"status",di(i)),o}function td(i,t){const e=Sr(i,t);if(Xf(t),e.length&&!Ke(i,t)){const n=e.reduce((o,a)=>ui(t,o)<ui(t,a)?o:a),s=Go(t,n),r=ui(t,n)-(li-.3);ko(t,t.pos.x+(n.pos.x-t.pos.x)/s*r,t.pos.z+(n.pos.z-t.pos.z)/s*r)}ht(i,"unit.formation",{u:t.id,offs:t.models.map(n=>[n.ox,n.oz]),r:t.r,pos:{x:t.pos.x,z:t.pos.z}})}function Dy(i,t,e,n,s){e.alive=!1,e.w=0,t.alive--,ht(i,"unit.slain",{u:t.id,m:t.models.indexOf(e),by:n?n.id:null,dmg:s}),re(t)||ed(i,t,n)}function ed(i,t,e){i.journal.pendingLog.push([t.side,`<b>${t.t.name}</b> ${t.t.models>1?"are":"is"} destroyed!`,"big"]),ht(i,"unit.destroyed",{u:t.id,by:e?e.id:null})}function Ls(i,t){const e=t.t.ranged;return!(!e||!re(t)||t.flags.shot||t.mesmerized||t.flags.fellBack||Ke(i,t)||t.flags.advanced&&!e.assault)}function Vo(i,t,e){const n=t.t.ranged,s=ui(t,e);if(s>n.range)return{ok:!1,why:`out of range (${s.toFixed(1)}" / ${n.range}")`};if(Ke(i,e)&&!n.spell)return{ok:!1,why:"locked in combat"};const r=Jc(i,t,e);if(!r.visible&&!n.indirect)return{ok:!1,why:"no line of sight"};let o=0;return n.heavy&&t.flags.moved&&o++,n.indirect&&!r.visible&&o++,{ok:!0,range:s,...r,mod:o,need:ur(t.t.BS,o)}}function jc(i,t){return Ls(i,t)?Pn(i,t).filter(e=>Vo(i,t,e).ok):[]}function Iy(i,t,e){const n=t.t.ranged,s=Vo(i,t,e);if(t.flags.shot=!0,ht(i,"unit.face",{u:t.id,tg:e.id}),ht(i,"tray.open",{title:`${t.t.short} → ${e.t.short} · ${n.name}`}),n.spell){const v=ke(i,2),m=v[0]+v[1]>=n.spell;if(ht(i,"dice",{label:`Cast ${n.spell}+ (2D6)`,dice:v,need:0,sum:!0,pass:m}),!m){ht(i,"spell.fizzle",{u:t.id}),Le(i,t.side,`<b>${t.t.short}</b> tries ${n.name} — it fizzles (${v[0]+v[1]}).`);return}return ht(i,"spell.cast",{u:t.id}),n.mesmerize?Oy(i,t,e):(Le(i,t.side,`<b>${t.t.short}</b> casts <b>${n.name}</b> on ${e.t.short}!`),Ny(i,t,e,n))}if(n.blast)return Uy(i,t,e,n,s);const r=As(t,n,!1);ht(i,"volley",{u:t.id,tg:e.id,fx:n.fx,n:r});const o=ke(i,r),a=Gn(o,s.need);ht(i,"dice",{label:`Hit ${s.need}+`,dice:o,need:s.need});const c=yr(n.S,e.t.T,n.poison),l=ke(i,a),h=Gn(l,c);a&&ht(i,"dice",{label:`Wound ${c}+`,dice:l,need:c});const u=Mr(e.t.Sv,n.AP,s.cover),d=ke(i,h),f=u>6?h:h-Gn(d,u);h&&ht(i,"dice",{label:u>6?"No save":`Save ${u}+${s.cover?" (cover)":""}`,dice:u>6?[]:d,need:u,save:!0});const g=Ho(i,e,f,n.D,t);Le(i,t.side,`<b>${t.t.short}</b> shoot ${e.t.short}: ${a} hit, ${h} wound, ${f} unsaved${g?` — <b>${g} slain</b>`:""}.`)}function Uy(i,t,e,n,s){const{W:r,H:o}=Xn,a=As(t,n,!1);Le(i,t.side,`<b>${t.t.short}</b> fire ${n.name} at ${e.t.short} (${s.need}+${s.visible?"":", unseen"}).`);for(let c=0;c<a&&!(!re(t)||!re(e)&&c>0);c++){const l=sr(i.rng)*Math.PI*2,h=sr(i.rng)*e.r*.5,u={x:e.pos.x+$e(l)*h,z:e.pos.z+Ie(l)*h};ht(i,"blast.aim",{x:u.x,z:u.z,r:n.blast});const d=ke(i,1),f=d[0]>=s.need;ht(i,"dice",{label:a>1?`Template ${c+1}: hit ${s.need}+`:`Hit ${s.need}+`,dice:d,need:s.need});let g=u;if(!f){const v=ke(i,1)[0]+1,m=sr(i.rng)*Math.PI*2;g={x:Math.max(-r/2+.3,Math.min(r/2-.3,u.x+$e(m)*v)),z:Math.max(-o/2+.3,Math.min(o/2-.3,u.z+Ie(m)*v))},ht(i,"dice",{label:"Scatter D6+1",dice:[v-1],need:0,sum:!0,note:`${v}"`}),ht(i,"blast.scatter",{from:{x:u.x,z:u.z},to:{x:g.x,z:g.z},d:v})}ht(i,"blast.fire",{u:t.id,to:{x:g.x,z:g.z},fx:n.fx}),nd(i,t,g,n)}}function Ny(i,t,e,n){const s={x:e.pos.x,z:e.pos.z};ht(i,"spell.thorns",{u:t.id,x:s.x,z:s.z,r:n.blast}),nd(i,t,s,n),ht(i,"spell.fade",{u:t.id})}function nd(i,t,e,n){ht(i,"blast.land",{x:e.x,z:e.z,r:n.blast,fx:n.fx});const s=[];for(const o of i.units){if(!re(o))continue;const a=o.models.filter(c=>c.alive&&Bt(Fs(o,c)-e.x,ks(o,c)-e.z)<=n.blast+o.t.base*.6);a.length&&s.push({v:o,under:a})}for(const{v:o,under:a}of s){let c=a.length;o.t.big&&(c=Math.ceil(Wc(i)/2)+1);const l=o.side===t.side,h=yr(n.S,o.t.T,n.poison),u=ke(i,c),d=Gn(u,h);ht(i,"dice",{label:`${l?"⚠ ":""}${o.t.short}: ${c} hit${c>1?"s":""} · wound ${h}+`,dice:u,need:h});const f=$o(i,o),g=Mr(o.t.Sv,n.AP,f),v=ke(i,d),m=g>6?d:d-Gn(v,g);d&&g<=6&&ht(i,"dice",{label:`Save ${g}+${f?" (cover)":""}`,dice:v,need:g,save:!0});const p=Ho(i,o,m,n.D,t,a);Le(i,t.side,`${l?"<b>Friendly fire!</b> ":""}${n.name} hits ${o.t.short}: ${d} wound, ${m} unsaved${p?` — <b>${p} slain</b>`:""}.`)}s.length||ht(i,"pause",{s:.25});const r=i.terrain.blast(e.x,e.z,n.blast,n.scenery||1,{acid:!!n.corrodes},i.out);r.length&&Le(i,t.side,`…and ${r.length} piece${r.length>1?"s":""} of scenery ${r.length>1?"are":"is"} wrecked.`),Hi(i)}function Oy(i,t,e){ht(i,"spell.gaze",{u:t.id,tg:e.id});const n=Math.ceil(Wc(i)/2);ht(i,"dice",{label:"Mortal wounds D3",dice:[n],need:0,sum:!0,note:`${n}`});const s=Ho(i,e,n,1,t);e.mesmerized=!0,i.out&&ht(i,"status",di(i)),ht(i,"spell.mesmerized",{u:t.id,tg:e.id}),Le(i,t.side,`<b>${t.t.short}</b> mesmerizes ${e.t.short}: ${n} mortal wound${n>1?"s":""}${s?`, <b>${s} slain</b>`:""}. It can't shoot or charge next turn.`)}function Xc(i){return i.t.move}function Ro(i,t,e,n=[]){const{W:s,H:r}=Xn,o=i.nav,a=new Uint8Array(o.N);a.discs=[];for(const c of Pn(i,t)){const l=c.r+t.r+(n.includes(c)?.02:e);a.discs.push({x:c.pos.x,z:c.pos.z,R:l-.02});const h=Math.max(0,Math.floor((c.pos.x-l+s/2)/o.cell)),u=Math.min(o.nx-1,Math.floor((c.pos.x+l+s/2)/o.cell)),d=Math.max(0,Math.floor((c.pos.z-l+r/2)/o.cell)),f=Math.min(o.nz-1,Math.floor((c.pos.z+l+r/2)/o.cell));for(let g=d;g<=f;g++)for(let v=h;v<=u;v++){const m=g*o.nx+v;Bt(o.x(m)-c.pos.x,o.z(m)-c.pos.z)<l&&(a[m]=1)}}return a}function xs(i,t,e=0){Hi(i);const n=Ke(i,t),s=t.t.M+e,r=Xc(t),o=Pn(i,t),a=Ro(i,t,li+.05,n?o:[]),c=Ro(i,t,li+.05),l=i.nav.reach(t.pos.x,t.pos.z,{r:t.r,max:s,mode:r==="fly"?"fly":r,forbid:r==="fly"?null:a});return{u:t,res:l,max:s,mode:r,forbid:a,endForbid:c,fallback:n}}function br(i,t,e){const{u:n,res:s,mode:r,endForbid:o}=t,a=i.nav;if(e<0||!isFinite(s.dist[e])||!a.standable(e,n.r,r==="wreck"?"wreck":"walk",o))return!1;const c=a.x(e),l=a.z(e);for(const h of i.units)if(h!==n&&re(h)&&Bt(h.pos.x-c,h.pos.z-l)<h.r+n.r+.08)return!1;return!0}function zy(i,t,e,n,s=2.4){const r=i.nav;let o=-1,a=s;const c=r.index(e,n);if(c<0)return-1;const l=Math.ceil(s/r.cell),h=c%r.nx,u=c/r.nx|0;for(let d=-l;d<=l;d++)for(let f=-l;f<=l;f++){const g=h+f,v=u+d;if(g<0||v<0||g>=r.nx||v>=r.nz)continue;const m=v*r.nx+g,p=Bt(r.x(m)-e,r.z(m)-n);p<a&&br(i,t,m)&&(a=p,o=m)}return o}function Fy(i,t,e,n=xs(i,t,t.flags.advanced?t.flags.advRoll:0)){const s=i.nav.path(n.res,e,t.r,n.mode==="fly"?null:n.forbid);t.flags.moved=!0,n.fallback&&(t.flags.fellBack=!0);const r=Wf(s);Le(i,t.side,`<b>${t.t.short}</b> ${n.fallback?"fall back":t.flags.advanced?"advance":"move"} ${r.toFixed(1)}".`),id(i,t,s,{fly:n.mode==="fly",stomp:t.t.wrecker&&r>.1}),Hi(i)}function ky(i,t){ht(i,"tray.open",{title:`${t.t.short} — Advance`});const e=ke(i,1);return ht(i,"dice",{label:"Advance D6",dice:e,need:0,sum:!0,note:`+${e[0]}"`}),t.flags.advanced=!0,t.flags.advRoll=e[0],Le(i,t.side,`<b>${t.t.short}</b> advance: +${e[0]}".`),e[0]}function By(i,t){t.flags.moved=!0}function id(i,t,e,{speed:n=7,fly:s=!1,stomp:r=!1}={}){const o=Wf(e);if(o<.05)return;const a=[];let c=0;for(let d=1;d<e.length;d++){const f=Bt(e[d].x-e[d-1].x,e[d].z-e[d-1].z);a.push({a:e[d-1],b:e[d],s:c,l:f}),c+=f}const l=[];if(t.t.wrecker){const d=[];for(const g of a)for(let v=0;v<g.l;v+=.25)d.push({s:g.s+v,x:g.a.x+(g.b.x-g.a.x)*v/g.l,z:g.a.z+(g.b.z-g.a.z)*v/g.l,dir:Ps(g.b.x-g.a.x,g.b.z-g.a.z)});const f=a[a.length-1];d.push({s:o,x:e[e.length-1].x,z:e[e.length-1].z,dir:Ps(f.b.x-f.a.x,f.b.z-f.a.z)});for(const g of d){const v=i.out?[]:null;Hy(i,t,g,v)&&v&&l.push({s:g.s,ev:v})}}const h=a.find(d=>o<=d.s+d.l)||a[a.length-1],u=h.l>0?(o-h.s)/h.l:1;ko(t,ln(h.a.x,h.b.x,u),ln(h.a.z,h.b.z,u)),i.out&&(ht(i,"unit.move",{u:t.id,path:e.map(d=>({x:d.x,z:d.z})),L:o,speed:n,fly:s,stomp:r,smashes:l,to:{x:t.pos.x,z:t.pos.z}}),ht(i,"objectives",{owners:Vi(i)}),ht(i,"status",di(i)))}function Hy(i,t,{x:e,z:n,dir:s},r){let o=0;for(const a of i.terrain.chunks){if(!a.alive||!a.destructible)continue;const c=a.nav||a.shape;Bt(c.x-e,c.z-n)<t.r+Math.max(c.hx,c.hz)*.8&&(i.terrain.hurt(a,99,{x:e-Ie(s),z:n-$e(s)},r),o++)}return o}function pr(i,t){return!(!re(t)||t.flags.charged||t.flags.chargeTried||t.t.noCharge||t.mesmerized||t.flags.fellBack||Ke(i,t)||t.flags.advanced&&!t.t.chargeAfterAdvance)}function Wo(i,t){return pr(i,t)?Pn(i,t).filter(e=>ui(t,e)<=xr):[]}function zs(i,t,e){Hi(i);const n=i.nav,s=Pn(i,t).filter(m=>m!==e),r=Xc(t),o=Ro(i,t,li+.05,[e]),a=n.reach(t.pos.x,t.pos.z,{r:t.r,max:xr+.5,mode:r,forbid:r==="fly"?null:o}),c=[];let l=-1,h=1/0;const u=e.r+t.r+li-.08,d=Math.ceil((u+1)/n.cell),f=n.index(e.pos.x,e.pos.z),g=f%n.nx,v=f/n.nx|0;for(let m=-d;m<=d;m++)for(let p=-d;p<=d;p++){const x=g+p,y=v+m;if(x<0||y<0||x>=n.nx||y>=n.nz)continue;const _=y*n.nx+x,R=a.dist[_];if(!isFinite(R))continue;const S=Bt(n.x(_)-e.pos.x,n.z(_)-e.pos.z);S>u||S<e.r+t.r+.02||n.standable(_,t.r,r==="wreck"?"wreck":"walk",o)&&(s.some(E=>Bt(n.x(_)-E.pos.x,n.z(_)-E.pos.z)<E.r+t.r+li)||i.units.some(E=>E!==t&&E!==e&&re(E)&&E.side===t.side&&Bt(E.pos.x-n.x(_),E.pos.z-n.z(_))<E.r+t.r+.05)||(c.push({i:_,d:R}),R<h&&(l=_,h=R)))}return l<0?null:{cell:l,need:Math.max(2,Math.ceil(h-.01)),res:a,forbid:o,mode:r,dist:h,spots:c}}function sd(i,t){const e=new Uint8Array(i.res.dist.length);for(const n of i.spots)n.d<=t+.011&&(e[n.i]=1);return e[i.cell]=1,e}function Vy(i,t,e,n){const s=zs(i,t,e);if(t.flags.chargeTried=!0,ht(i,"tray.open",{title:`${t.t.short} charge ${e.t.short}`}),!s)return Le(i,t.side,`<b>${t.t.short}</b> can't find a way to ${e.t.short}.`),null;const r=ke(i,2),o=r[0]+r[1],a=o>=s.need;return ht(i,"dice",{label:`Charge ${s.need}" (2D6)`,dice:r,need:0,sum:!0,pass:a}),ht(i,"unit.face",{u:t.id,tg:e.id}),a?(t.flags.charged=!0,t.flags.chargeTarget=e.id,ht(i,"charge.result",{u:t.id,tg:e.id,ok:a}),Le(i,t.side,`<b>${t.t.short}</b> charge ${e.t.short} — roll ${o} vs ${s.need}. <b>Contact!</b>`),n!=="ai"?{plan:s,rolled:o}:(rd(i,t,e,s.cell,s),null)):(ht(i,"charge.result",{u:t.id,tg:e.id,ok:a}),Le(i,t.side,`<b>${t.t.short}</b> charge ${e.t.short} — roll ${o}, needed ${s.need}. Failed.`),null)}function rd(i,t,e,n,s=zs(i,t,e)){const r=i.nav.path(s.res,n,t.r,s.mode==="fly"?null:s.forbid);id(i,t,r,{speed:11,fly:s.mode==="fly"}),Hi(i)}const re=i=>i.alive>0,Pn=(i,t)=>i.units.filter(e=>e.side!==t.side&&re(e)),qc=(i,t)=>i.units.filter(e=>e.side===t.side&&re(e)&&e!==t),Go=(i,t)=>Bt(i.pos.x-t.pos.x,i.pos.z-t.pos.z),ui=(i,t)=>Go(i,t)-i.r-t.r,Sr=(i,t)=>Pn(i,t).filter(e=>ui(t,e)<=li+.05),Fs=(i,t)=>i.pos.x+t.ox,ks=(i,t)=>i.pos.z+t.oz,Ke=(i,t)=>Sr(i,t).length>0,Yc=i=>i.t.eye,Kc=i=>i.t.chest;function $o(i,t){const e=t.models.filter(s=>s.alive);if(t.t.fly)return!1;let n=0;for(const s of e)i.nav.cover[i.nav.index(Fs(t,s),ks(t,s))]&&n++;return n*2>=e.length&&n>0}function Jc(i,t,e,n=t.pos){const s={x:n.x,y:Yc(t),z:n.z};let r=0,o=0,a=0;for(const c of e.models){if(!c.alive)continue;a++;const l=i.terrain.los(s,{x:Fs(e,c),y:Kc(e),z:ks(e,c)});l.blocked||(r++,l.obscure&&o++)}return{visible:r>0,cover:r>0&&(o>0||r<a||$o(i,e)),seen:r,total:a}}function od(i,t){let e=t.t.Ld;for(const n of qc(i,t))n.t.hero&&Go(t,n)<=_r+t.r&&(e=Math.max(e,n.t.Ld));return e}function jo(i,t){const e=[0,0];for(const n of i.units)if(re(n))for(const s of n.models)s.alive&&Bt(Fs(n,s)-t.x,ks(n,s)-t.z)<=zo+n.t.base&&(e[n.side]+=n.t.OC);return e[0]>e[1]?0:e[1]>e[0]?1:-1}const Vi=i=>i.objectives.map(t=>jo(i,t)),di=i=>({engaged:i.units.filter(t=>re(t)&&Ke(i,t)).map(t=>t.id),mesmerized:i.units.filter(t=>t.mesmerized).map(t=>t.id)}),$n=i=>Ts[Math.min(i.turn.ph,Ts.length-1)].key;function ad(i,t){if(!re(t)||t.side!==i.turn.active)return!1;switch($n(i)){case"move":return!t.flags.moved;case"shoot":return Ls(i,t)&&jc(i,t).length>0;case"charge":return pr(i,t)&&Wo(i,t).length>0}return!1}const cd=(i,t)=>i.units.some(e=>e.side===t&&ad(i,e)),ld=Object.freeze(Object.defineProperty({__proto__:null,alive:re,anyCanAct:cd,canAct:ad,canCharge:pr,canShoot:Ls,chargePlan:zs,chargeSpots:sd,chargeTargets:Wo,chestY:Kc,controlOf:jo,dist:Go,enemiesOf:Pn,engagedWith:Sr,eyeY:Yc,forbidMask:Ro,freeSpot:Kf,friendsOf:qc,gap:ui,inCover:$o,isEngaged:Ke,leadership:od,moveMode:Xc,movePlan:xs,mx:Fs,mz:ks,nearestValid:zy,ownersOf:Vi,phaseKey:$n,rngState:Oo,shootTargets:jc,shotInfo:Vo,sight:Jc,statusOf:di,validEnd:br},Symbol.toStringTag,{value:"Module"}));function cu(i,t){if(!re(t)||t.flags.fought)return;const e=Sr(i,t);if(!e.length)return;t.flags.fought=!0;const n=e.find(p=>p.id===t.flags.chargeTarget)||e.reduce((p,x)=>p.alive*p.t.W<x.alive*x.t.W?p:x),s=t.t.melee,r=t.mesmerized?1:0,o=ur(t.t.WS,r);ht(i,"unit.face",{u:t.id,tg:n.id}),ht(i,"focus",{x:t.pos.x*.5+n.pos.x*.5,z:t.pos.z*.5+n.pos.z*.5}),ht(i,"tray.open",{title:`${t.t.short} fight ${n.t.short} · ${s.name}`});const a=As(t,s,!0),c=ke(i,a),l=Gn(c,o);ht(i,"melee",{u:t.id,tg:n.id,n:a,hits:l}),ht(i,"dice",{label:`Hit ${o}+${r?" (mesmerized)":""}`,dice:c,need:o});const h=yr(s.S,n.t.T,s.poison),u=ke(i,l),d=Gn(u,h);l&&ht(i,"dice",{label:`Wound ${h}+`,dice:u,need:h});const f=Mr(n.t.Sv,s.AP,!1),g=ke(i,d),v=f>6?d:d-Gn(g,f);d&&ht(i,"dice",{label:f>6?"No save":`Save ${f}+`,dice:f>6?[]:g,need:f,save:!0});const m=Ho(i,n,v,s.D,t);Le(i,t.side,`<b>${t.t.short}</b> fight ${n.t.short}: ${l} hit, ${d} wound, ${v} unsaved${m?` — <b>${m} slain</b>`:""}.`),ht(i,"pause",{s:.3})}function Wy(i,t){const e=i.units.filter(s=>s.side===t&&s.flags.charged&&re(s));for(const s of e)cu(i,s);let n=1-t;for(let s=0;s<30;s++){const r=i.units.find(a=>a.side===n&&re(a)&&!a.flags.fought&&Ke(i,a)),o=i.units.find(a=>a.side===1-n&&re(a)&&!a.flags.fought&&Ke(i,a));if(!r&&!o)break;r&&cu(i,r),n=1-n}for(const s of i.units)s.flags.fought=!1;i.out&&ht(i,"status",di(i))}function Gy(i){let t=!1;for(const e of i.units){if(!re(e)||!e.lost||e.t.models===1)continue;t||ht(i,"tray.open",{title:"Morale"}),t=!0;const n=od(i,e),s=ke(i,1),r=s[0]+e.lost,o=s[0]===1?0:Math.max(0,r-n);if(ht(i,"dice",{label:`${e.t.short}: D6 + ${e.lost} lost vs Ld ${n}`,dice:s,need:0,sum:!0,pass:o===0,note:`${r}`}),o){const a=Math.min(o,e.alive),c=e.models.filter(l=>l.alive).slice(-a);for(const l of c)$y(i,e,l);Le(i,e.side,`<b>${e.t.short}</b> lose their nerve — <b>${a} flee</b>.`),re(e)?td(i,e):ed(i,e,null),i.out&&(ht(i,"objectives",{owners:Vi(i)}),ht(i,"status",di(i))),ht(i,"pause",{s:.5})}else Le(i,e.side,`<b>${e.t.short}</b> hold firm (${r} vs Ld ${n}).`)}}function $y(i,t,e){e.alive=!1,e.w=0,t.alive--,ht(i,"unit.flee",{u:t.id,m:t.models.indexOf(e)})}const hd=i=>i.t.pts*i.alive/i.t.models;function Di(i,t){return i.t.melee?Ao(i.alive*i.t.A,ur(i.t.WS,i.mesmerized?1:0),i.t.melee,t,!1).value:0}function ud(i,t,e,n,s){var l;const r=t.t.ranged;if(!r||Bt(e.pos.x-n.x,e.pos.z-n.z)-t.r-e.r>r.range||Ke(i,e)&&!r.spell)return 0;const a=Jc(i,t,e,n);if(!a.visible&&!r.indirect&&!r.mesmerize)return 0;if(r.mesmerize)return a.visible?zi(r.spell)*(hd(e)*.25+Math.min(2,e.alive)*e.t.pts*.08+((l=e.t.ranged)!=null&&l.blast?8:0)):0;let c=0;if(r.heavy&&s&&c++,r.indirect&&!a.visible&&c++,r.blast){const h=r.spell?zi(r.spell):ho(ur(t.t.BS,c)),u=e.t.big?3:Math.max(1,Math.min(e.alive,Math.round(e.alive*Math.min(1,r.blast*r.blast/(e.r*e.r))*.8)));return As(t,r,!1)*h*Ao(u,1,r,e,a.cover).value}return Ao(As(t,r,!1),ur(t.t.BS,c),r,e,a.cover).value}function lu(i,t,e,n){const{nav:s}=i,r=Pn(i,t),o=qc(i,t),a=i.objectives.map(f=>jo(i,f)),c=t.t.ai,l={enemies:r,friends:o,owners:a,claimed:n,role:c};let h={cell:-1,score:hu(i,t,t.pos.x,t.pos.z,l,!1),dist:0,...l.last};const u=t.t.M>8?3:2,d=e.res;for(let f=0;f<s.nz;f+=u)for(let g=f/u%2?1:0;g<s.nx;g+=u){const v=f*s.nx+g;if(!isFinite(d.dist[v])||!br(i,e,v))continue;const m=s.x(v),p=s.z(v),x=hu(i,t,m,p,l,!0)+sr(i.rng)*.05;x>h.score&&(h={cell:v,score:x,dist:Bt(m-t.pos.x,p-t.pos.z),...l.last})}return h}function hu(i,t,e,n,s,r){const{enemies:o,friends:a,owners:c,claimed:l,role:h}=s,u=t.t,d={x:e,z:n},f=r&&Bt(e-t.pos.x,n-t.pos.z)>.3;let g=0,v=!1,m=-1;if(u.OC>0){const _=h==="line"||h==="shooter"?5:h==="melee"?2:2.5;let R=0;for(const S of i.objectives){const E=Bt(S.x-e,S.z-n),N=c[S.i]===t.side?.45:1,M=l.has(S.i)?.25:1;let w;E<=2.6?w=_*N*M*1.4:w=_*N*M*Math.max(0,1-(E-2.6)/16)*.7,w>R&&(R=w,E<=2.6?(v=!0,m=S.i):v||(m=-1))}g+=R}let p=!1;if(u.ranged&&h!=="melee"){let _=0;for(const S of o){const E=ud(i,t,S,d,f);E>_&&(_=E)}_>0&&(p=!0),g+=_*(h==="artillery"?.25:h==="hero"?.12:.18)*(t.flags.advanced&&!u.ranged.assault?0:1)}if(h==="melee"||h==="line"||h==="raider"||h==="hero"){let _=0;for(const S of o){const E=Bt(S.pos.x-e,S.pos.z-n)-t.r-S.r;if(E>xr)continue;const N=E<=1?1:zi(Math.ceil(E)),M=Di(S,t)*.4,w=N*(Di(t,S)-M+(S.t.role==="Artillery"?10:0));w>_&&(_=w)}if(g+=_*(h==="melee"?.3:h==="raider"?.18:h==="hero"?.06:.15),_===0&&h!=="hero"){const S=Math.min(...o.map(E=>Bt(E.pos.x-e,E.pos.z-n)));g-=S*(h==="melee"?.12:.05)}}const x=h==="shooter"||h==="artillery"||h==="hero";for(const _ of o){const R=Bt(_.pos.x-e,_.pos.z-n)-t.r-_.r;_.t.brawler&&R<_.t.M+7&&(g-=Di(_,t)*(x?.16:.05)*(1-R/(_.t.M+7)))}const y=i.nav.index(e,n);if(y>=0&&i.nav.cover[y]&&(g+=x?1.5:.5),h==="artillery"&&f&&(g-=2.5),h==="hero"){let _=0;for(const S of a)Bt(S.pos.x-e,S.pos.z-n)<=_r+S.r&&_++;g+=Math.min(3,_)*.9;const R=Math.min(...o.map(S=>Bt(S.pos.x-e,S.pos.z-n)));R<8&&(g-=(8-R)*.6)}for(const _ of a){const R=Bt(_.pos.x-e,_.pos.z-n)-_.r-t.r;R<1.5&&(g-=(1.5-R)*.6)}return s.last={onObjective:v,obj:m,canShoot:p},g}const Ds=Object.freeze(["melee","raider","line","shooter","hero","artillery"]);function*jy(i,t,e){e==="move"?yield*Xy(i,t):e==="shoot"?yield*qy(i,t):e==="charge"&&(yield*Yy(i,t))}function*Xy(i,t){const e=i.units.filter(s=>s.side===t&&re(s));e.sort((s,r)=>Ds.indexOf(s.t.ai)-Ds.indexOf(r.t.ai));const n=new Set;for(const s of e){if(!re(s)||s.flags.moved)continue;const r=s.t.ai;if(Ke(i,s)){const h=Sr(i,s),u=h.reduce((m,p)=>m+Di(p,s),0),d=h.reduce((m,p)=>Math.max(m,Di(s,p)),0);if(r==="melee"||r==="line"||d>=u*.8)continue;const f=xs(i,s);let g=-1,v=-1/0;for(let m=0;m<i.nav.N;m+=2){if(!br(i,f,m))continue;const p=i.nav.x(m),x=i.nav.z(m),y=Math.min(...Pn(i,s).map(_=>Bt(_.pos.x-p,_.pos.z-x)-_.r));y>v&&(v=y,g=m)}g>=0&&(ht(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"move",u:s.id,c:g});continue}let o=xs(i,s,s.flags.advanced?s.flags.advRoll:0),a=lu(i,s,o,n);const c=Math.min(...Pn(i,s).map(h=>ui(s,h)));let l=!1;if(r==="melee"||r==="line"||r==="raider"?l=c>s.t.M+8&&!(r==="line"&&a.onObjective)&&!(r==="raider"&&a.canShoot):r==="shooter"&&(l=!a.canShoot&&!a.onObjective&&(s.t.ranged.assault||c>s.t.ranged.range+s.t.M+3)),l&&!s.flags.advanced){ht(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"advance",u:s.id},o=xs(i,s,s.flags.advRoll);const h=lu(i,s,o,n);h.cell>=0&&(a=h)}a.obj>=0&&n.add(a.obj),a.cell>=0&&a.dist>.4?(ht(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"move",u:s.id,c:a.cell}):s.flags.advanced&&By(i,s),ht(i,"pause",{s:.05})}}function*qy(i,t){const e=i.units.filter(n=>n.side===t&&Ls(i,n));e.sort((n,s)=>Ds.indexOf(s.t.ai)-Ds.indexOf(n.t.ai));for(const n of e){if(!Ls(i,n))continue;const s=jc(i,n);let r=null,o=.4;for(const a of s){let c=ud(i,n,a,n.pos,n.flags.moved);const l=n.t.ranged;if(l.blast)for(const h of i.units){if(h.side!==n.side||!re(h))continue;const u=Bt(h.pos.x-a.pos.x,h.pos.z-a.pos.z)-h.r;u<l.blast+2.5&&(c-=hd(h)*.25*(1-Math.max(0,u)/(l.blast+2.5)))}l.mesmerize&&a.mesmerized&&(c*=.2),c>o&&(o=c,r=a)}r&&(ht(i,"focus",{x:(n.pos.x+r.pos.x)/2,z:(n.pos.z+r.pos.z)/2}),yield{t:"shoot",u:n.id,tg:r.id},ht(i,"pause",{s:.1}))}}function*Yy(i,t){const e=i.units.filter(n=>n.side===t&&pr(i,n));e.sort((n,s)=>Ds.indexOf(n.t.ai)-Ds.indexOf(s.t.ai));for(const n of e){if(!pr(i,n))continue;const s=n.t.ai;let r=null,o=0;for(const a of Wo(i,n)){const c=zs(i,n,a);if(!c)continue;const l=zi(c.need),h=Di(n,a)+(a.t.role==="Artillery"?12:0)+(a.alive<=2?6:0),u=Di(a,n);if(l<(s==="melee"?.25:s==="line"?.33:s==="raider"?.4:s==="hero"?.5:.6)||(s==="shooter"||s==="hero")&&h<u*1.4)continue;const f=l*(h-u*.4);f>o&&(o=f,r=a)}r&&(ht(i,"focus",{x:(n.pos.x+r.pos.x)/2,z:(n.pos.z+r.pos.z)/2}),yield{t:"charge",u:n.id,tg:r.id},ht(i,"pause",{s:.1}))}}const Me=(i,t)=>i.units.find(e=>e.id===t),pc=Object.freeze({place(i,t,{u:e,c:n}){const s=Me(i,e);ko(s,i.nav.x(n),i.nav.z(n)),ht(i,"unit.place",{u:e,x:s.pos.x,z:s.pos.z})},deployed(i,t){const e=i.pending.seats.filter(n=>n!==t);i.pending=e.length?{...i.pending,seats:e}:null},advance(i,t,{u:e}){ky(i,Me(i,e))},move(i,t,{u:e,c:n}){Fy(i,Me(i,e),n),Qr(i)},shoot(i,t,{u:e,tg:n}){Iy(i,Me(i,e),Me(i,n)),Qr(i)},charge(i,t,{u:e,tg:n},s){const r=Vy(i,Me(i,e),Me(i,n),s);if(!r)return Qr(i);i.pending={k:"chargeEnd",seats:[t],u:e,tg:n,rolled:r.rolled,cell:r.plan.cell}},chargeEnd(i,t,{c:e}){const n=i.pending;rd(i,Me(i,n.u),Me(i,n.tg),e===-1?n.cell:e),i.pending={k:"phase",seats:n.seats,phase:$n(i)},Qr(i)},end(i){i.pending=null},auto(i,t){gd(i,t,i.pending.phase),i.pending=null},concede(i,t){xc(i,t)}}),mc=un({place:{k:"deploy",fields:["u","c"],ok:(i,t,{u:e,c:n})=>Ks(i,t,e)??(Ay(i,Me(i,e),n)?null:`cell ${n} is no free spot in seat ${t}'s zone for unit ${e}`)},deployed:{k:"deploy",fields:[]},advance:{k:"phase",phase:"move",fields:["u"],ok:(i,t,{u:e})=>Ks(i,t,e)??Qy(i,Me(i,e))},move:{k:"phase",phase:"move",fields:["u","c"],ok:(i,t,{u:e,c:n})=>Ks(i,t,e)??tM(i,Me(i,e),n)},shoot:{k:"phase",phase:"shoot",fields:["u","tg"],ok:(i,t,{u:e,tg:n})=>Ks(i,t,e)??uu(i,t,n)??eM(i,Me(i,e),Me(i,n))},charge:{k:"phase",phase:"charge",fields:["u","tg"],ok:(i,t,{u:e,tg:n})=>Ks(i,t,e)??uu(i,t,n)??nM(i,Me(i,e),Me(i,n))},chargeEnd:{k:"chargeEnd",fields:["c"],ok:(i,t,{c:e},n)=>iM(i,n,e)},end:{k:"phase",fields:[]},auto:{k:"phase",fields:[]},concede:{k:null,fields:[],ok:(i,t)=>Zy(i,t)}}),Ky=Object.freeze(Object.keys(mc));function gc(i,t,e){return fd(i,t,e,i.pending)}function fd(i,t,e,n){const s=i.rng.locked;Uf(i.rng);try{return Jy(i,t,e,n)}finally{s||Nf(i.rng)}}function Jy(i,t,e,n){var r;if(!e||typeof e!="object"||Array.isArray(e))return"not a command";const s=typeof e.t=="string"&&Object.hasOwn(mc,e.t)?mc[e.t]:null;if(!s)return`no command "${e.t}"`;if(!Number.isInteger(t)||t<0||t>=i.seats.length)return`no seat ${t}`;for(const o of Object.keys(e))if(o!=="t"&&!s.fields.includes(o))return`${e.t} takes no field "${o}"`;for(const o of s.fields)if(!Number.isInteger(e[o]))return`${e.t} takes a whole number ${o}`;return i.turn.stage==="over"?"the battle is over":s.k?!n||!n.seats.includes(t)?`seat ${t} has no decision to make now`:n.k!==s.k?`${e.t} doesn't answer the ${n.k} decision`:s.phase&&n.phase!==s.phase?`${e.t} belongs to the ${s.phase} phase, not the ${n.phase}`:((r=s.ok)==null?void 0:r.call(s,i,t,e,n))??null:s.ok(i,t,e)}function Ks(i,t,e){const n=Me(i,e);return n&&re(n)&&n.side===t?null:`unit ${e} is no standing unit of seat ${t}`}function uu(i,t,e){const n=Me(i,e);return n&&re(n)&&n.side!==t?null:`unit ${e} is no standing enemy of seat ${t}`}const dd=(i,t)=>t>=0&&t<i.nav.N;function Zy(i,t){return Qf(i,t)!=="human"?`seat ${t} is the AI's: only a human seat concedes`:i.turn.wiped>=0?`the battle is decided: seat ${i.turn.wiped} is wiped out`:null}function Qy(i,t){return t.flags.moved?`${t.t.short} has moved`:t.flags.advanced?`${t.t.short} has advanced`:Ke(i,t)?`${t.t.short} is in combat`:null}function tM(i,t,e){return t.flags.moved?`${t.t.short} has moved`:!dd(i,e)||!br(i,xs(i,t,t.flags.advanced?t.flags.advRoll:0),e)?`${t.t.short} can't end its move on cell ${e}`:null}function eM(i,t,e){if(!Ls(i,t))return`${t.t.short} can't shoot now`;const n=Vo(i,t,e);return n.ok?null:`${t.t.short} can't shoot ${e.t.short}: ${n.why}`}function nM(i,t,e){return Wo(i,t).includes(e)?zs(i,t,e)?null:`${t.t.short} has no way to ${e.t.short}`:`${t.t.short} can't charge ${e.t.short}`}function iM(i,t,e){if(e===-1)return null;const n=dd(i,e)&&zs(i,Me(i,t.u),Me(i,t.tg));return n&&sd(n,t.rolled)[e]?null:`the charge can't end on cell ${e} (rolled ${t.rolled}")`}const vc=i=>i.seats.filter(t=>t.ctrl==="human").map(t=>t.seat);function pd(i){const t=i.turn;for(;!i.pending&&t.stage!=="over";)switch(t.step){case"rolloff":t.stage="battle",ht(i,"stage",{stage:"battle"}),i.out&&ht(i,"objectives",{owners:Vi(i)}),sM(i),t.round=1,t.t=0,t.step="turnStart";break;case"turnStart":t.active=(t.first+t.t)%2,rM(i,t.active),t.ph=0,t.step="phase";break;case"phase":{const e=$n(i);ht(i,"phase.start",{side:t.active,phase:e,round:t.round}),t.step="phaseEnd",e==="fight"?i.units.some(n=>re(n)&&Ke(i,n))&&Wy(i,t.active):e==="morale"?Gy(i):cd(i,t.active)?Qf(i,t.active)==="human"?i.pending={k:"phase",seats:[t.active],phase:e}:gd(i,t.active,e):ht(i,"pause",{s:.2});break}case"phaseEnd":if(Fo(i,`phase ${t.active}:${$n(i)}`),md(i),t.wiped>=0){xc(i);break}t.step=++t.ph<Ts.length?"phase":"turnEnd";break;case"turnEnd":oM(i,t.active),t.step=++t.t<2?"turnStart":"score";break;case"score":aM(i),t.round<i.setup.rounds?(t.round++,t.t=0,t.step="turnStart"):i.setup.overtime==="vote"&&vc(i).length?i.pending={k:"roundLimit",seats:vc(i),votes:{}}:xc(i);break;default:throw new Error(`the engine has no step "${t.step}"`)}i.pending&&i.out&&ht(i,"pending",{k:i.pending.k,seats:[...i.pending.seats]})}function sM(i){const t=i.turn;ht(i,"tray.open",{title:"Roll-off for the first turn"});let e,n;do e=ke(i,1),n=ke(i,1),ht(i,"dice",{label:hi(i,0).short,dice:e,need:0,sum:!0}),ht(i,"dice",{label:hi(i,1).short,dice:n,need:0,sum:!0});while(e[0]===n[0]);t.first=e[0]>n[0]?0:1,Le(i,t.first,`<b>${hi(i,t.first).name}</b> win the roll-off and take the first turn.`,"big")}function rM(i,t){for(const e of i.units)e.lost=0,e.side===t&&(e.flags={})}function oM(i,t){for(const e of i.units)e.side===t&&e.mesmerized&&(e.mesmerized=!1);i.out&&ht(i,"status",di(i))}function Qr(i){Fo(i,"act"),i.out&&(ht(i,"objectives",{owners:Vi(i)}),ht(i,"status",di(i))),ht(i,"act",{tag:"act"}),md(i)}function md(i){for(const t of[0,1])i.units.some(e=>e.side===t&&re(e))||(i.turn.wiped=t)}function aM(i){const t=i.turn,e=Vi(i),n=[0,0];for(const o of e)o>=0&&n[o]++;t.vp[0]+=n[0],t.vp[1]+=n[1],Fo(i,`round ${t.round}`);const s=hi(i,0).short,r=hi(i,1).short;Le(i,-1,`End of round ${t.round}: ${s} hold ${n[0]} objective${n[0]===1?"":"s"}, ${r} hold ${n[1]}. Score ${t.vp[0]}–${t.vp[1]}.`,"big"),ht(i,"round.scored",{round:t.round,held:[...n],vp:[...t.vp],owners:e})}function xc(i,t=-1){const e=i.turn,n=e.stage==="deploy"?0:e.round;$f(i),Fo(i,"over"),e.stage="over",i.pending=null,ht(i,"stage",{stage:"over"});const s=t>=0?1-t:e.wiped>=0?1-e.wiped:e.vp[0]>e.vp[1]?0:e.vp[1]>e.vp[0]?1:-1,r=t>=0?"concede":e.wiped>=0?"wipe":"score";e.result={win:s,why:r},ht(i,"game.over",{win:s,why:r,vp:[...e.vp],rounds:n})}function gd(i,t,e){const n=i.pending,s={k:"phase",seats:[t],phase:e};for(const r of jy(i,t,e)){if(i.strict){const o=fd(i,t,r,s);if(o)throw new Error(`the AI (seat ${t}, ${e} phase) asked for ${JSON.stringify(r)}, which is illegal: ${o}`)}if(pc[r.t](i,t,r,"ai"),i.pending!==n)throw new Error(`the AI's ${JSON.stringify(r)} left a decision open: ${JSON.stringify(i.pending)}`)}}const cM=new Set(["name","short","icon","look","abilities","fx"]),Co=i=>Array.isArray(i)?i.map(Co):i&&typeof i=="object"?Object.fromEntries(Object.entries(i).filter(([t])=>!cM.has(t)).map(([t,e])=>[t,Co(e)])):i,fu=(i,t)=>Object.fromEntries(Object.entries(i).map(([e,n])=>[e,t(n)])),lM=Object.freeze({BOARD:Xn,ENGAGE:li,CHARGE_RANGE:xr,OBJECTIVE_RANGE:zo,ROUNDS:Of,AURA:_r});function hM({races:i=Sn,constants:t=lM,phases:e=Ts.map(r=>r.key),sets:n=vs,missions:s=Cs}={}){return{races:fu(i,({units:r,...o})=>({...Co(o),units:fu(r,Co)})),constants:t,phases:e,sets:n,missions:s}}const uM=i=>Gc(Rs(hM(i))).toString(36),po=uM(),mo=1,kn=i=>Object.is(i,-0)?"-0":String(i),fM=i=>typeof i=="number"?kn(i):String(i),dM=i=>Object.keys(i).filter(t=>i[t]!==void 0).sort().map(t=>`${t}=${String(i[t])}`).join(","),vd=Object.freeze({}),pM=(i,t=vd)=>Object.keys(t).sort().filter(e=>i[e]!==void 0&&!Object.is(i[e],t[e])).map(e=>`${e}=${fM(i[e])}`).join(",");function xd(i,t=vd){const e=i.turn,n=[e.stage,e.step,e.round,e.t,e.first,e.active,e.ph,e.vp.join("-"),e.wiped,e.overtime].map(String).join(","),s=i.units.map(o=>{const a=pM(o,t);return[o.id,kn(o.pos.x),kn(o.pos.z),kn(o.r),o.alive,o.lost,o.mesmerized,`{${dM(o.flags)}}`,o.models.map(c=>`${kn(c.w)}/${c.alive}/${kn(c.ox)}/${kn(c.oz)}`).join(" "),...a?[`[${a}]`]:[]].join(",")}).join(";"),r=i.terrain.chunks.map(o=>`${o.id},${o.alive},${kn(o.hp)},${kn(o.shape.y)}`).join(";");return`turn ${n}
pending ${Rs(i.pending)}
units ${s}
chunks ${r}
rng ${Oo(i.rng)} ${i.rng.a}`}const go=i=>Gc(xd(i)).toString(36),mM=i=>{var t;return[...((t=i.pending)==null?void 0:t.seats)??[]]},du=99;function _d(i){const t={};for(const[s,r]of Object.entries(i??{}))r!=null&&(t[s]=r);const e={terrain:"classic",rounds:dr().rounds,overtime:"never",diceMode:"shared"};for(const[s,r]of Object.entries(e))t[s]??(t[s]=r);const n=s=>Number.isInteger(s)&&s>=0&&s<=4294967295;if(!n(t.board)||!n(t.dice))throw new Error(`a setup's board and dice are whole numbers from 0 to 2^32 - 1, not ${t.board} and ${t.dice}`);if(!Number.isInteger(t.rounds)||t.rounds<1||t.rounds>du)throw new Error(`a battle lasts a whole number of rounds, from 1 to ${du}, not ${t.rounds}`);if(t.overtime!=="never")throw new Error(`overtime "${t.overtime}": a battle ends after its rounds ('never') until F4's vote`);if(t.diceMode!=="shared")throw new Error(`dice mode "${t.diceMode}": only 'shared' dice so far`);if(!Array.isArray(t.seats))throw new Error("a setup names its seats");return t}function yd(i,{out:t=null,onTrace:e=null,strict:n=!1}={}){const s=Ly(_d(i),{out:t,onTrace:e});s.strict=n;const r=vc(s);if(r.length){ht(s,"stage",{stage:"deploy"});for(const o of r)Le(s,o,`<b>${hi(s,o).name}</b>: deploy your army.`);s.pending={k:"deploy",seats:r}}return pd(s),s}function mr(i,t){const e=i.rng.locked;Uf(i.rng);try{return t(i,ld)}finally{e||Nf(i.rng)}}function pu(i,t,e){if(!Object.hasOwn(pc,e.t))throw new Error(`no command "${e.t}"`);pc[e.t](i,t,e,"seat"),pd(i)}const gM=i=>i.objectives.map(t=>i.turn.stage==="battle"||i.turn.stage==="over"?jo(i,t):-1);function _s(i){const t=i.turn,e={};for(const s of i.units)e[s.id]={pos:{x:s.pos.x,z:s.pos.z},r:s.r,models:s.models.map(r=>({w:r.w,alive:r.alive,ox:r.ox,oz:r.oz})),alive:s.alive,mesmerized:s.mesmerized,engaged:re(s)&&Ke(i,s)};const n={};for(const s of i.terrain.chunks)n[s.id]={alive:s.alive,y:s.shape.y};return{units:e,chunks:n,owners:gM(i),vp:[...t.vp],round:t.round,active:t.active,phase:$n(i),stage:t.stage}}function Md(i,t){const e=t.u===void 0?null:i.units[t.u];switch(t.t){case"unit.place":e.pos={x:t.x,z:t.z};break;case"unit.move":e.pos={x:t.to.x,z:t.to.z};for(const{ev:n}of t.smashes)for(const s of n)Md(i,s);break;case"unit.formation":e.pos={x:t.pos.x,z:t.pos.z},e.r=t.r,t.offs.forEach(([n,s],r)=>{e.models[r].ox=n,e.models[r].oz=s});break;case"unit.wound":e.models[t.m].w-=t.dmg;break;case"unit.slain":case"unit.flee":e.models[t.m].w=0,e.models[t.m].alive=!1,e.alive--;break;case"status":{const n=new Set(t.engaged),s=new Set(t.mesmerized);for(const[r,o]of Object.entries(i.units))o.engaged=n.has(Number(r)),o.mesmerized=s.has(Number(r));break}case"objectives":i.owners=[...t.owners];break;case"round.scored":i.vp=[...t.vp],i.owners=[...t.owners];break;case"phase.start":i.round=t.round,i.active=t.side,i.phase=t.phase;break;case"stage":i.stage=t.stage;break;case"terrain.clear":i.chunks={};break;case"terrain.add":i.chunks[t.def.id]={alive:!0,y:t.def.shape.y};break;case"terrain.destroy":i.chunks[t.id].alive=!1;break;case"terrain.collapse":for(const{id:n,dy:s}of t.drops)i.chunks[n].y-=s;break}return i}const Is=Object.freeze({phaseStart:(i,t)=>i||t!=="battle"?.9:.6,dice:i=>.38+Math.min(i,14)*.035,pause:i=>i,beat:.3}),vM=(i,t=Math.random)=>Ge(i,t),ys=i=>1-Math.pow(1-i,3),xM=i=>i*i*i,_c=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,_M=i=>Math.atan2(Math.sin(i),Math.cos(i));function yM(i){return i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375}const hn={speed:1,time:0},yc=new Set;function we(i,t,e=n=>n){return new Promise(n=>{yc.add({t:0,duration:Math.max(1e-4,i),fn:t,ease:e,resolve:n})})}const En=i=>we(i,()=>{});function MM(i){for(const t of[...yc]){t.t+=i;const e=Math.min(1,t.t/t.duration);t.fn(t.ease(e),e),e>=1&&(yc.delete(t),t.resolve())}}class bM{constructor({lowfi:t=!1,fast:e=!1}={}){this.fast=e;const n=this.renderer=new Tf({antialias:!0});n.setPixelRatio(t?.5:Math.min(devicePixelRatio,2)),n.setSize(innerWidth,innerHeight),n.shadowMap.enabled=!t,n.shadowMap.type=Yu,n.toneMapping=Ku,n.toneMappingExposure=1.05,document.body.prepend(n.domElement);const s=this.scene=new Af;s.background=new qt("#1c1712"),s.fog=new Uc("#1c1712",70,140),addEventListener("resize",()=>n.setSize(innerWidth,innerHeight)),this.overlay=document.querySelector("#labels")}light(){const t=this.scene;t.add(new f_("#d6e6ff","#3b2a1a",.85));const e=new kh("#fff0d6",2.3);e.position.set(-16,34,20),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),Object.assign(e.shadow.camera,{left:-27,right:27,top:22,bottom:-22,near:5,far:90}),e.shadow.bias=-4e-4,e.shadow.normalBias=.02,t.add(e);const n=new kh("#9fb8ff",.35);n.position.set(18,12,-16),t.add(n)}run({parts:t,rig:e,shake:n}){const s=new g_,r=()=>{requestAnimationFrame(r),this.fast&&(hn.speed=1e4);const o=Math.min(s.getDelta(),.05),a=o*hn.speed;hn.time+=a,MM(a),t(a,hn.time),e.update(o),e.render(this.renderer,this.scene,n(),!this.fast)};r()}}const mu={type:"change"},Ba={type:"start"},gu={type:"end"},to=new Io,vu=new ei,SM=Math.cos(70*Vp.DEG2RAD);class wM extends Fi{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Bn.ROTATE,MIDDLE:Bn.DOLLY,RIGHT:Bn.PAN},this.touches={ONE:Wi.ROTATE,TWO:Wi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(P){P.addEventListener("keydown",ut),this._domElementKeyEvents=P},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ut),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(mu),n.update(),r=s.NONE},this.update=function(){const P=new C,ct=new Tn().setFromUnitVectors(t.up,new C(0,1,0)),Tt=ct.clone().invert(),Mt=new C,it=new Tn,I=new C,lt=2*Math.PI;return function(It=null){const Lt=n.object.position;P.copy(Lt).sub(n.target),P.applyQuaternion(ct),a.setFromVector3(P),n.autoRotate&&r===s.NONE&&W(w(It)),n.enableDamping?(a.theta+=c.theta*n.dampingFactor,a.phi+=c.phi*n.dampingFactor):(a.theta+=c.theta,a.phi+=c.phi);let Qt=n.minAzimuthAngle,te=n.maxAzimuthAngle;isFinite(Qt)&&isFinite(te)&&(Qt<-Math.PI?Qt+=lt:Qt>Math.PI&&(Qt-=lt),te<-Math.PI?te+=lt:te>Math.PI&&(te-=lt),Qt<=te?a.theta=Math.max(Qt,Math.min(te,a.theta)):a.theta=a.theta>(Qt+te)/2?Math.max(Qt,a.theta):Math.min(te,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&S||n.object.isOrthographicCamera?a.radius=K(a.radius):a.radius=K(a.radius*l),P.setFromSpherical(a),P.applyQuaternion(Tt),Lt.copy(n.target).add(P),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),h.set(0,0,0));let pe=!1;if(n.zoomToCursor&&S){let ge=null;if(n.object.isPerspectiveCamera){const ee=P.length();ge=K(ee*l);const _e=ee-ge;n.object.position.addScaledVector(_,_e),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const ee=new C(R.x,R.y,0);ee.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),pe=!0;const _e=new C(R.x,R.y,0);_e.unproject(n.object),n.object.position.sub(_e).add(ee),n.object.updateMatrixWorld(),ge=P.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ge!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ge).add(n.object.position):(to.origin.copy(n.object.position),to.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(to.direction))<SM?t.lookAt(n.target):(vu.setFromNormalAndCoplanarPoint(n.object.up,n.target),to.intersectPlane(vu,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),pe=!0);return l=1,S=!1,pe||Mt.distanceToSquared(n.object.position)>o||8*(1-it.dot(n.object.quaternion))>o||I.distanceToSquared(n.target)>0?(n.dispatchEvent(mu),Mt.copy(n.object.position),it.copy(n.object.quaternion),I.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Zt),n.domElement.removeEventListener("pointerdown",A),n.domElement.removeEventListener("pointercancel",F),n.domElement.removeEventListener("wheel",D),n.domElement.removeEventListener("pointermove",b),n.domElement.removeEventListener("pointerup",F),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ut),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new Vh,c=new Vh;let l=1;const h=new C,u=new mt,d=new mt,f=new mt,g=new mt,v=new mt,m=new mt,p=new mt,x=new mt,y=new mt,_=new C,R=new mt;let S=!1;const E=[],N={};let M=!1;function w(P){return P!==null?2*Math.PI/60*n.autoRotateSpeed*P:2*Math.PI/60/60*n.autoRotateSpeed}function B(P){const ct=Math.abs(P*.01);return Math.pow(.95,n.zoomSpeed*ct)}function W(P){c.theta-=P}function nt(P){c.phi-=P}const U=function(){const P=new C;return function(Tt,Mt){P.setFromMatrixColumn(Mt,0),P.multiplyScalar(-Tt),h.add(P)}}(),k=function(){const P=new C;return function(Tt,Mt){n.screenSpacePanning===!0?P.setFromMatrixColumn(Mt,1):(P.setFromMatrixColumn(Mt,0),P.crossVectors(n.object.up,P)),P.multiplyScalar(Tt),h.add(P)}}(),$=function(){const P=new C;return function(Tt,Mt){const it=n.domElement;if(n.object.isPerspectiveCamera){const I=n.object.position;P.copy(I).sub(n.target);let lt=P.length();lt*=Math.tan(n.object.fov/2*Math.PI/180),U(2*Tt*lt/it.clientHeight,n.object.matrix),k(2*Mt*lt/it.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(U(Tt*(n.object.right-n.object.left)/n.object.zoom/it.clientWidth,n.object.matrix),k(Mt*(n.object.top-n.object.bottom)/n.object.zoom/it.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function tt(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l/=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function q(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l*=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Y(P,ct){if(!n.zoomToCursor)return;S=!0;const Tt=n.domElement.getBoundingClientRect(),Mt=P-Tt.left,it=ct-Tt.top,I=Tt.width,lt=Tt.height;R.x=Mt/I*2-1,R.y=-(it/lt)*2+1,_.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function K(P){return Math.max(n.minDistance,Math.min(n.maxDistance,P))}function ot(P){u.set(P.clientX,P.clientY)}function at(P){Y(P.clientX,P.clientX),p.set(P.clientX,P.clientY)}function j(P){g.set(P.clientX,P.clientY)}function Z(P){d.set(P.clientX,P.clientY),f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const ct=n.domElement;W(2*Math.PI*f.x/ct.clientHeight),nt(2*Math.PI*f.y/ct.clientHeight),u.copy(d),n.update()}function dt(P){x.set(P.clientX,P.clientY),y.subVectors(x,p),y.y>0?tt(B(y.y)):y.y<0&&q(B(y.y)),p.copy(x),n.update()}function wt(P){v.set(P.clientX,P.clientY),m.subVectors(v,g).multiplyScalar(n.panSpeed),$(m.x,m.y),g.copy(v),n.update()}function St(P){Y(P.clientX,P.clientY),P.deltaY<0?q(B(P.deltaY)):P.deltaY>0&&tt(B(P.deltaY)),n.update()}function Nt(P){let ct=!1;switch(P.code){case n.keys.UP:P.ctrlKey||P.metaKey||P.shiftKey?nt(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):$(0,n.keyPanSpeed),ct=!0;break;case n.keys.BOTTOM:P.ctrlKey||P.metaKey||P.shiftKey?nt(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):$(0,-n.keyPanSpeed),ct=!0;break;case n.keys.LEFT:P.ctrlKey||P.metaKey||P.shiftKey?W(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):$(n.keyPanSpeed,0),ct=!0;break;case n.keys.RIGHT:P.ctrlKey||P.metaKey||P.shiftKey?W(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):$(-n.keyPanSpeed,0),ct=!0;break}ct&&(P.preventDefault(),n.update())}function Ot(P){if(E.length===1)u.set(P.pageX,P.pageY);else{const ct=_t(P),Tt=.5*(P.pageX+ct.x),Mt=.5*(P.pageY+ct.y);u.set(Tt,Mt)}}function Dt(P){if(E.length===1)g.set(P.pageX,P.pageY);else{const ct=_t(P),Tt=.5*(P.pageX+ct.x),Mt=.5*(P.pageY+ct.y);g.set(Tt,Mt)}}function jt(P){const ct=_t(P),Tt=P.pageX-ct.x,Mt=P.pageY-ct.y,it=Math.sqrt(Tt*Tt+Mt*Mt);p.set(0,it)}function z(P){n.enableZoom&&jt(P),n.enablePan&&Dt(P)}function de(P){n.enableZoom&&jt(P),n.enableRotate&&Ot(P)}function bt(P){if(E.length==1)d.set(P.pageX,P.pageY);else{const Tt=_t(P),Mt=.5*(P.pageX+Tt.x),it=.5*(P.pageY+Tt.y);d.set(Mt,it)}f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const ct=n.domElement;W(2*Math.PI*f.x/ct.clientHeight),nt(2*Math.PI*f.y/ct.clientHeight),u.copy(d)}function Rt(P){if(E.length===1)v.set(P.pageX,P.pageY);else{const ct=_t(P),Tt=.5*(P.pageX+ct.x),Mt=.5*(P.pageY+ct.y);v.set(Tt,Mt)}m.subVectors(v,g).multiplyScalar(n.panSpeed),$(m.x,m.y),g.copy(v)}function xt(P){const ct=_t(P),Tt=P.pageX-ct.x,Mt=P.pageY-ct.y,it=Math.sqrt(Tt*Tt+Mt*Mt);x.set(0,it),y.set(0,Math.pow(x.y/p.y,n.zoomSpeed)),tt(y.y),p.copy(x);const I=(P.pageX+ct.x)*.5,lt=(P.pageY+ct.y)*.5;Y(I,lt)}function oe(P){n.enableZoom&&xt(P),n.enablePan&&Rt(P)}function Ht(P){n.enableZoom&&xt(P),n.enableRotate&&bt(P)}function A(P){n.enabled!==!1&&(E.length===0&&(n.domElement.setPointerCapture(P.pointerId),n.domElement.addEventListener("pointermove",b),n.domElement.addEventListener("pointerup",F)),Wt(P),P.pointerType==="touch"?Ct(P):rt(P))}function b(P){n.enabled!==!1&&(P.pointerType==="touch"?J(P):L(P))}function F(P){zt(P),E.length===0&&(n.domElement.releasePointerCapture(P.pointerId),n.domElement.removeEventListener("pointermove",b),n.domElement.removeEventListener("pointerup",F)),n.dispatchEvent(gu),r=s.NONE}function rt(P){let ct;switch(P.button){case 0:ct=n.mouseButtons.LEFT;break;case 1:ct=n.mouseButtons.MIDDLE;break;case 2:ct=n.mouseButtons.RIGHT;break;default:ct=-1}switch(ct){case Bn.DOLLY:if(n.enableZoom===!1)return;at(P),r=s.DOLLY;break;case Bn.ROTATE:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enablePan===!1)return;j(P),r=s.PAN}else{if(n.enableRotate===!1)return;ot(P),r=s.ROTATE}break;case Bn.PAN:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enableRotate===!1)return;ot(P),r=s.ROTATE}else{if(n.enablePan===!1)return;j(P),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ba)}function L(P){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Z(P);break;case s.DOLLY:if(n.enableZoom===!1)return;dt(P);break;case s.PAN:if(n.enablePan===!1)return;wt(P);break}}function D(P){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(P.preventDefault(),n.dispatchEvent(Ba),St(X(P)),n.dispatchEvent(gu))}function X(P){const ct=P.deltaMode,Tt={clientX:P.clientX,clientY:P.clientY,deltaY:P.deltaY};switch(ct){case 1:Tt.deltaY*=16;break;case 2:Tt.deltaY*=100;break}return P.ctrlKey&&!M&&(Tt.deltaY*=10),Tt}function et(P){P.key==="Control"&&(M=!0,document.addEventListener("keyup",Q,{passive:!0,capture:!0}))}function Q(P){P.key==="Control"&&(M=!1,document.removeEventListener("keyup",Q,{passive:!0,capture:!0}))}function ut(P){n.enabled===!1||n.enablePan===!1||Nt(P)}function Ct(P){switch(Pt(P),E.length){case 1:switch(n.touches.ONE){case Wi.ROTATE:if(n.enableRotate===!1)return;Ot(P),r=s.TOUCH_ROTATE;break;case Wi.PAN:if(n.enablePan===!1)return;Dt(P),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Wi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;z(P),r=s.TOUCH_DOLLY_PAN;break;case Wi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;de(P),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ba)}function J(P){switch(Pt(P),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;bt(P),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;Rt(P),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;oe(P),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Ht(P),n.update();break;default:r=s.NONE}}function Zt(P){n.enabled!==!1&&P.preventDefault()}function Wt(P){E.push(P.pointerId)}function zt(P){delete N[P.pointerId];for(let ct=0;ct<E.length;ct++)if(E[ct]==P.pointerId){E.splice(ct,1);return}}function Pt(P){let ct=N[P.pointerId];ct===void 0&&(ct=new mt,N[P.pointerId]=ct),ct.set(P.pageX,P.pageY)}function _t(P){const ct=P.pointerId===E[0]?E[1]:E[0];return N[ct]}n.domElement.addEventListener("contextmenu",Zt),n.domElement.addEventListener("pointerdown",A),n.domElement.addEventListener("pointercancel",F),n.domElement.addEventListener("wheel",D,{passive:!1}),document.addEventListener("keydown",et,{passive:!0,capture:!0}),this.update()}}const{W:eo,H:no}=Xn,si=Object.freeze({title:Object.freeze({orbit:Object.freeze({centre:Object.freeze([-5,0,0]),radius:25,y:13,speed:.035,angle:-1.02})}),landscape:Object.freeze({pos:Object.freeze([0,30,31]),target:Object.freeze([0,0,1.5]),fov:40}),portrait:Object.freeze({pos:Object.freeze([-36,46,0]),target:Object.freeze([-1,0,0]),fov:56}),broadside:Object.freeze({azimuth:0,elevation:.77,max:86}),behind:i=>Object.freeze({azimuth:i<0?-Math.PI/2:Math.PI/2,elevation:.9,max:75})}),bd=i=>!(i<1),EM=({localSeats:i=[],edges:t=[],aspect:e})=>bd(e)?si.landscape:si.portrait,Sd=i=>bd(i)?si.landscape.fov:si.portrait.fov;function TM(i,t,e=i.angle){const n=e+t*i.speed,s=i.centre;return{pos:[s[0]+Math.sin(n)*i.radius,i.y,s[2]+Math.cos(n)*i.radius],target:[s[0],s[1],s[2]]}}const AM=({follow:i,stage:t,active:e,localSeats:n})=>!!i&&t==="battle"&&!(n.length===1&&n.includes(e));function RM(i,t){if(i.pos)return i;const e=Sd(t),n=Math.tan(e*Math.PI/360),s=n*t,{azimuth:r,elevation:o}=i,a=[Math.sin(r)*Math.cos(o),Math.sin(o),Math.cos(r)*Math.cos(o)],c=a.map(v=>-v),l=PM([-c[2],0,c[0]]),h=CM(l,c),u=[[-eo/2,-no/2],[eo/2,-no/2],[-eo/2,no/2],[eo/2,no/2]].map(([v,m])=>[v,0,m]),d=v=>u.every(m=>{const p=[m[0]-a[0]*v,m[1]-a[1]*v,m[2]-a[2]*v],x=Ha(p,c);return x>0&&Math.abs(Ha(p,l))*1.12<=x*s&&Math.abs(Ha(p,h))*1.12<=x*n});let f=1,g=i.max;if(d(f))g=f;else if(d(g))for(let v=0;v<60;v++){const m=(f+g)/2;d(m)?g=m:f=m}return{pos:a.map(v=>v*g),target:[0,0,0],fov:e}}const Ha=(i,t)=>i[0]*t[0]+i[1]*t[1]+i[2]*t[2],CM=(i,t)=>[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]],PM=i=>{const t=Math.hypot(i[0],i[1],i[2]);return i.map(e=>e/t)},xu=i=>new C(i[0],i[1],i[2]),io=75;class LM{constructor(t){const e=si.landscape;this.camera=new tn(e.fov,innerWidth/innerHeight,.1,400),this.camera.position.set(...e.pos);const n=this.controls=new wM(this.camera,t.domElement);n.target.set(...e.target),n.enableDamping=!0,n.dampingFactor=.08,n.maxPolarAngle=1.32,n.minDistance=5,n.maxDistance=io,n.screenSpacePanning=!1,n.mouseButtons={LEFT:Bn.ROTATE,MIDDLE:Bn.DOLLY,RIGHT:Bn.PAN},this.follow=!0,this.titleSpin=!0,this.titleAngle=si.title.orbit.angle,this.viewShift=1,this.focusTween=null,this.keys=new Set,addEventListener("keydown",s=>{s.target.tagName!=="INPUT"&&this.keys.add(s.key.toLowerCase())}),addEventListener("keyup",s=>this.keys.delete(s.key.toLowerCase())),this.fitFov(),addEventListener("resize",()=>{this.fitFov(),this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix()})}fitFov(){const t=this.camera;t.fov=Sd(innerWidth/innerHeight),t.aspect=innerWidth/innerHeight,t.updateProjectionMatrix()}fit(t,e=innerWidth/innerHeight){return RM(t,e)}goTo(t,e=1.4){this.titleSpin=!1;const n=this.camera,s=this.controls,r=this.fit(t);s.maxDistance=Math.max(io,t.max??io);const o=n.position.clone(),a=s.target.clone(),c=xu(r.pos),l=xu(r.target);we(e,h=>{this.viewShift=1-h,n.position.lerpVectors(o,c,h),s.target.lerpVectors(a,l,h)},_c)}toTitle(){this.titleSpin=!0,this.controls.maxDistance=io,this.titleAngle-=hn.time*si.title.orbit.speed,this.viewShift=1}focus(t,e,{stage:n,active:s,localSeats:r}){if(!AM({follow:this.follow,stage:n,active:s,localSeats:r}))return;const o=this.camera,a=this.controls,c=a.target.clone();if(Math.hypot(t-c.x,e-c.z)<6)return;const h=o.position.clone().sub(c),u=new C(ln(c.x,t,.6),0,ln(c.z,e,.6)),d=this.focusTween={};we(.9,f=>{this.focusTween===d&&(a.target.lerpVectors(c,u,f),o.position.copy(a.target).add(h))},_c)}panKeys(t){const e=this.camera,n=this.controls,s=this.keys,r=new C,o=new C().subVectors(n.target,e.position).setY(0).normalize(),a=new C(-o.z,0,o.x);(s.has("w")||s.has("arrowup"))&&r.add(o),(s.has("s")||s.has("arrowdown"))&&r.sub(o),(s.has("d")||s.has("arrowright"))&&r.add(a),(s.has("a")||s.has("arrowleft"))&&r.sub(a),r.lengthSq()&&(r.normalize().multiplyScalar(t*18),n.target.add(r),e.position.add(r))}update(t){var s;const e=this.camera;if(this.titleSpin){const r=TM(si.title.orbit,hn.time,this.titleAngle);e.position.set(...r.pos),this.controls.target.set(...r.target)}const n=innerWidth>900?this.viewShift:0;n>.001?e.setViewOffset(innerWidth,innerHeight,-innerWidth*.21*n,0,innerWidth,innerHeight):(s=e.view)!=null&&s.enabled&&e.clearViewOffset(),this.panKeys(t),this.controls.update()}render(t,e,n,s=!0){const r=this.camera,o=new C((Math.random()-.5)*n,(Math.random()-.5)*n,(Math.random()-.5)*n);r.position.add(o),s&&t.render(e,r),r.position.sub(o)}}function DM(i,t,e){const n=document.createElement("canvas");n.width=2048,n.height=Math.round(2048*t/i);const s=n.getContext("2d");s.fillStyle="#5b7a36",s.fillRect(0,0,n.width,n.height);const r=(a,c,l,h,u)=>{for(let d=0;d<c;d++)s.globalAlpha=u*(.4+Math.random()*.6),s.fillStyle=a[Math.random()*a.length|0],s.beginPath(),s.ellipse(Math.random()*n.width,Math.random()*n.height,l+Math.random()*(h-l),l+Math.random()*(h-l),Math.random()*3,0,Math.PI*2),s.fill()};r(["#6a8a40","#4f6c2c","#729347","#55742f","#7f964c"],700,20,90,.35),r(["#7d6b45","#6e5d3a","#8a7650"],40,30,110,.22),r(["#8fa65a","#a4b46a"],300,4,14,.4);for(let a=0;a<14e3;a++)s.globalAlpha=.35,s.fillStyle=Math.random()<.5?"#3f5a24":"#8fae5a",s.fillRect(Math.random()*n.width,Math.random()*n.height,2,4+Math.random()*4);s.globalAlpha=1;const o=new Oc(n);return o.colorSpace=be,o.anisotropy=e.capabilities.getMaxAnisotropy(),o}function IM(){const i=document.createElement("canvas");i.width=i.height=512;const t=i.getContext("2d");t.fillStyle="#4a3020",t.fillRect(0,0,512,512);for(let n=0;n<260;n++){t.strokeStyle=Math.random()<.5?"rgba(30,18,10,0.35)":"rgba(110,70,40,0.25)",t.lineWidth=1+Math.random()*3;const s=Math.random()*512;t.beginPath(),t.moveTo(0,s);for(let r=0;r<=512;r+=32)t.lineTo(r,s+Math.sin(r*.02+n)*4);t.stroke()}const e=new Oc(i);return e.colorSpace=be,e.wrapS=e.wrapT=yo,e.repeat.set(6,6),e}class UM{constructor(t,e,{W:n,H:s,deploy:r,edges:o}){this.W=n,this.H=s;const a=new xn({map:DM(n,s,e),roughness:.95}),c=this.board=new Vt(new ci(n,s).rotateX(-Math.PI/2),a);c.receiveShadow=!0,t.add(c);const l=new Vt(new ci(220,220).rotateX(-Math.PI/2),new xn({map:IM(),roughness:.7}));l.position.y=-.62,l.receiveShadow=!0,t.add(l);{const h=new xn({color:"#5a3a22",roughness:.6}),u=[[n+1.6,.8,.8,0,-s/2-.4],[n+1.6,.8,.8,0,s/2+.4],[.8,.8,s,-n/2-.4,0],[.8,.8,s,n/2+.4,0]];for(const[f,g,v,m,p]of u){const x=new Vt(new An(f,g,v),h);x.position.set(m,-.22,p),x.castShadow=x.receiveShadow=!0,t.add(x)}const d=new Vt(new An(n,.6,s),h);d.position.y=-.31,t.add(d)}this.zoneMats=[],this.zoneLineMats=[];for(const h of[0,1]){const u=o[h],d=new He({transparent:!0,opacity:.07,depthWrite:!1});this.zoneMats.push(d);const f=new Vt(new ci(r,s).rotateX(-Math.PI/2),d);f.position.set(u*(n/2-r/2),.008,0),f.renderOrder=1,t.add(f);const g=[];for(let m=-s/2;m<s/2;m+=1)g.push(new C(u*(n/2-r),.02,m),new C(u*(n/2-r),.02,m+.5));const v=new Nc({transparent:!0,opacity:.5});this.zoneLineMats.push(v),t.add(new Jx(new xe().setFromPoints(g),v))}this.tufts=new er(new Rn(.035,.13,3),new xn({color:"#ffffff",roughness:1}),700),this.flowers=new er(new Cn(.05,0),new xn({roughness:.6}),140),t.add(this.tufts,this.flowers)}paint(t){for(const e of[0,1])this.zoneMats[e].color.set(t[e]),this.zoneLineMats[e].color.set(t[e])}zones(t){for(const e of[0,1])this.zoneMats[e].opacity=t[e]}scatterTufts(){const{W:t,H:e,tufts:n,flowers:s}=this,r=new se,o=new Tn,a=new Ns,c=new qt;for(let h=0;h<n.count;h++){const u=(Math.random()-.5)*(t-.4),d=(Math.random()-.5)*(e-.4),f=.6+Math.random()*1.2;o.setFromEuler(a.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5)),r.compose(new C(u,.08*f,d),o,new C(f,f,f)),n.setMatrixAt(h,r),n.setColorAt(h,c.set(["#9cba5a","#a8c464","#b4c86e","#8fae50"][h%4]))}const l=["#f4f0e0","#f2d14a","#d77ad0","#e8e8ff"];for(let h=0;h<s.count;h++){const u=(Math.random()-.5)*(t-.4),d=(Math.random()-.5)*(e-.4);r.compose(new C(u,.08,d),o.identity(),new C(1,.6,1)),s.setMatrixAt(h,r),s.setColorAt(h,c.set(l[h%l.length]))}n.instanceMatrix.needsUpdate=s.instanceMatrix.needsUpdate=!0,n.instanceColor.needsUpdate=s.instanceColor.needsUpdate=!0}}const Va=new Map;function vt(i,t={}){const e=i+JSON.stringify(t);return Va.has(e)||Va.set(e,new xn({color:i,roughness:.72,flatShading:!0,...t})),Va.get(e)}const Ai=i=>vt(i,{emissive:i,emissiveIntensity:1.6,roughness:.3}),Fe=i=>vt(i,{metalness:.65,roughness:.35}),ft={ico:new Cn(1,1),ico0:new Cn(1,0),sph:new nn(1,10,8),box:new An(1,1,1),cyl:new Ye(1,1,1,10),cone:new Rn(1,1,8),cap:new nn(1,12,6,0,Math.PI*2,0,Math.PI/2),brim:new Ni(1,12).rotateX(Math.PI/2),oct:new No(1,0)};function st(i,t,e=0,n=0,s=0,r=1,o=r,a=r){const c=new Vt(i,t);return c.position.set(e,n,s),c.scale.set(r,o,a),c.castShadow=!0,c}function bi(i,t,e,n){const s=new C(...i),r=new C(...t),o=st(ft.cyl,n);return o.position.copy(s).add(r).multiplyScalar(.5),o.scale.set(e,s.distanceTo(r),e),o.quaternion.setFromUnitVectors(new C(0,1,0),r.clone().sub(s).normalize()),o}function NM(i,t){const e=new kt,n=st(new Ye(i,i*1.05,.09,28),vt("#262422"),0,.045,0);n.receiveShadow=!0;const s=st(new Ye(i*.96,i*.96,.012,28),vt("#4c5e2c",{flatShading:!1}),0,.094,0);s.receiveShadow=!0;const r=st(new _n(i*1.02,.028,4,32).rotateX(Math.PI/2),vt(t,{emissive:t,emissiveIntensity:.35}),0,.07,0);e.add(n,s,r);for(let o=0;o<Math.round(i*9);o++){const a=Math.random()*6,c=Math.sqrt(Math.random())*i*.85;e.add(st(ft.cone,vt("#6a8a3a"),Math.cos(a)*c,.13,Math.sin(a)*c,.035,.08,.035))}return e}function OM(i,t,e,n,s=8,r=40){const o=new kc(i.map(p=>new C(...p))),a=o.computeFrenetFrames(r,!1),c=[],l=[];for(let p=0;p<=r;p++){const x=p/r,y=o.getPointAt(x),_=t+(e-t)*Math.pow(x,.6),R=a.normals[p],S=a.binormals[p];for(let E=0;E<=s;E++){const N=E/s*Math.PI*2,M=Math.cos(N),w=Math.sin(N);c.push(y.x+_*(M*R.x+w*S.x),y.y+_*(M*R.y+w*S.y),y.z+_*(M*R.z+w*S.z))}}for(let p=0;p<r;p++)for(let x=0;x<s;x++){const y=p*(s+1)+x,_=y+s+1;l.push(y,y+1,_,_,y+1,_+1)}const h=o.getPointAt(0),u=c.length/3;c.push(h.x,h.y,h.z);for(let p=0;p<s;p++)l.push(u,p+1,p);const d=o.getPointAt(1),f=c.length/3;c.push(d.x,d.y,d.z);const g=r*(s+1);for(let p=0;p<s;p++)l.push(f,g+p,g+p+1);const v=new xe;v.setAttribute("position",new ie(c,3)),v.setIndex(l),v.computeVertexNormals();const m=new Vt(v,n);return m.castShadow=!0,m}const Zs=()=>vt("#7a5232");function zM(i=1.1,t="#c9a24a"){const e=new kt;return e.add(st(ft.cyl,Zs(),0,0,0,.022,i,.022)),e.add(st(ft.cone,Fe(t),0,i/2+.07,0,.04,.14,.04)),e}function wd(i,t,e){const n=new kt,s=st(ft.cyl,t,0,0,0,i,.04,i);return s.rotation.x=Math.PI/2,n.add(s),n.add(st(ft.sph,e,0,0,.03,i*.25,i*.25,i*.15)),n}const Qs=(i,t)=>{const e=new qt(i),n={};return e.getHSL(n),e.setHSL(n.h,n.s,Math.max(0,Math.min(1,n.l+t))),"#"+e.getHexString()};function Hn(i,t,e=.9){i.userData.hand.add(t),t.rotation.x=e}function Ed(i,t,e,n){const s=new kt,r=st(ft.cyl,vt("#5a3a22"),0,0,0,i,.1,i);r.rotation.z=Math.PI/2;const o=st(ft.cyl,Fe("#444"),0,0,0,i*.3,.13,i*.3);return o.rotation.z=Math.PI/2,s.add(r,o),s.position.set(t,e,n),s}class FM{constructor(t,e,n,s){this.colorOf=s,this.items=e.map((r,o)=>{const a=new kt;a.position.set(r.x,0,r.z);const c=new Vt(new Ye(.55,.65,.16,8),vt("#8a8478"));c.position.y=.08,c.castShadow=c.receiveShadow=!0;const l=new Vt(new No(.2,0),new xn({color:"#fff3c0",emissive:"#ffd060",emissiveIntensity:.8,flatShading:!0}));l.position.y=.42;const h=new Vt(new Ye(.03,.03,2.1,6),vt("#5a3d24"));h.position.set(.35,1.1,0),h.castShadow=!0;const u=new xn({color:"#e8e0d0",side:en,roughness:.8}),d=new Vt(new ci(.8,.5,6,1).translate(.4,0,0),u);d.position.set(.35,1.85,0),d.castShadow=!0;const f=new Vt(new Oi(n-.06,n,64).rotateX(-Math.PI/2),new He({color:"#fff3c0",transparent:!0,opacity:.35,depthWrite:!1}));return f.position.y=.03,a.add(c,l,h,d,f),t.add(a),{i:o,g:a,gem:l,flag:d,flagMat:u,ring:f,owner:-1}})}paint(t,e){t.owner=e,t.flagMat.color.set(e<0?"#e8e0d0":this.colorOf(e)),t.ring.material.color.set(e<0?"#fff3c0":this.colorOf(e))}reset(){for(const t of this.items)this.paint(t,-1)}animate(t,e,n){for(const s of this.items){const r=n[s.i];r!==s.owner&&this.paint(s,r),s.gem.rotation.y=e*1.2,s.gem.position.y=.45+Math.sin(e*2+s.i)*.05,s.flag.rotation.y=Math.sin(e*2.2+s.i)*.25,s.ring.material.opacity=.3+Math.sin(e*2+s.i)*.08}}}let Ve=null,Ms=null,Vn=!1;try{Vn=localStorage.getItem("tails-and-scales:muted")==="1"}catch{}function Xo(){if(!Ve)try{Ve=new(window.AudioContext||window.webkitAudioContext),Ms=Ve.createGain(),Ms.gain.value=Vn?0:.5,Ms.connect(Ve.destination)}catch{Ve=null}}function kM(){Vn=!Vn;try{localStorage.setItem("tails-and-scales:muted",Vn?"1":"0")}catch{}return Ms&&(Ms.gain.value=Vn?0:.5),Vn}const BM=()=>Vn;function HM(i){const t=Math.floor(Ve.sampleRate*i),e=Ve.createBuffer(1,t,Ve.sampleRate),n=e.getChannelData(0);for(let r=0;r<t;r++)n[r]=Math.random()*2-1;const s=Ve.createBufferSource();return s.buffer=e,s}function Td(i,t,e,n,s){const r=Ve.createGain();return r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(n,t+e),r.gain.exponentialRampToValueAtTime(1e-4,t+s),i.connect(r),r.connect(Ms),r}function fs({dur:i=.3,freq:t=800,type:e="lowpass",peak:n=.5,delay:s=0,q:r=1}){const o=Ve.currentTime+s,a=HM(i),c=Ve.createBiquadFilter();c.type=e,c.frequency.value=t,c.Q.value=r,a.connect(c),Td(c,o,.005,n,i),a.start(o)}function Si({f0:i=440,f1:t=i,dur:e=.15,type:n="sine",peak:s=.2,delay:r=0}){const o=Ve.currentTime+r,a=Ve.createOscillator();a.type=n,a.frequency.setValueAtTime(i,o),a.frequency.exponentialRampToValueAtTime(Math.max(20,t),o+e),Td(a,o,.01,s,e),a.start(o),a.stop(o+e+.05)}const _u={squeak(){Si({f0:1400,f1:2400,dur:.12,type:"sine",peak:.12})},hiss(){fs({dur:.35,freq:5e3,type:"highpass",peak:.18})}},VM={voice(i){Object.hasOwn(_u,i)&&_u[i]()},dice(i=3){for(let t=0;t<Math.min(6,i);t++)fs({dur:.04,freq:2500+Math.random()*2e3,type:"bandpass",q:4,peak:.35,delay:t*.035+Math.random()*.02})},boom(i=1){fs({dur:.5+i*.5,freq:300+200/i,peak:.8}),Si({f0:90,f1:30,dur:.5+i*.3,type:"sine",peak:.5})},shot(){Si({f0:900,f1:300,dur:.08,type:"triangle",peak:.12})},thwack(){fs({dur:.07,freq:1400,type:"bandpass",q:2,peak:.4})},crumble(){fs({dur:.8,freq:500,peak:.45});for(let i=0;i<4;i++)fs({dur:.05,freq:1200,type:"bandpass",peak:.25,delay:.1+i*.09})},magic(){for(let i=0;i<4;i++)Si({f0:500+i*220,f1:900+i*300,dur:.25,type:"sine",peak:.08,delay:i*.06})},fizzle(){Si({f0:600,f1:120,dur:.35,type:"sawtooth",peak:.06})},fanfare(){[523,659,784,1046].forEach((i,t)=>Si({f0:i,dur:.3,type:"triangle",peak:.15,delay:t*.14}))},click(){Si({f0:1200,f1:900,dur:.04,type:"square",peak:.04})}},Se=new Proxy(VM,{get(i,t){return(...e)=>{if(!(!Ve||Vn))try{i[t](...e)}catch{}}}}),Ti=new An(1,1,1),Ad=new Ye(.5,.5,1,8).rotateZ(Math.PI/2),Wa=new Map;function ue(i,t={}){const e=i+JSON.stringify(t);return Wa.has(e)||Wa.set(e,new xn({color:i,roughness:.9,flatShading:!0,...t})),Wa.get(e)}function fe(i,t,{shadow:e=!0}={}){const n=new Vt(i,t);return n.castShadow=e,n.receiveShadow=!0,n}const Ga={box:i=>yu(i,Ti),log:i=>yu(i,Ad),cap(i){const{look:t,shape:e}=i,n=fe(new Rn(t.r,t.h,4).rotateY(Math.PI/4),ue(t.color));return n.position.set(e.x,e.y,e.z),n.rotation.y=t.yaw,{obj:n}},tree(i){const{look:t,shape:e}=i,{h:n,r:s}=t.trunk,r=new kt;r.position.set(e.x,0,e.z);const o=fe(new Ye(s*.75,s,n,7).translate(0,n/2,0),ue(t.bark));r.add(o);const a=new kt;r.add(a);for(const c of t.canopy)if(c.cone){const l=fe(new Rn(c.r,c.h,8),ue(c.color));l.position.y=c.y,l.rotation.y=c.yaw,a.add(l)}else{const l=fe(new Cn(c.r,1),ue(c.color));l.position.set(...c.pos),l.scale.y=.8,a.add(l)}return r.rotation.y=t.yaw,{obj:r,canopy:a}},hedge(i){const{look:t,shape:e}=i,n=new kt;n.position.set(e.x,0,e.z),n.rotation.y=t.yaw;const s=fe(Ti,ue(t.color));s.scale.set(1.15,.62,.55),s.position.y=.31,n.add(s);for(const r of t.tufts){const o=fe(new Cn(.3,0),ue(r.color));o.position.set(...r.pos),n.add(o)}for(const r of t.berries){const o=fe(new nn(.05,5,4),ue("#c0302a"),{shadow:!1});o.position.set(...r),n.add(o)}return{obj:n}},boulder(i){const{look:t,shape:e}=i,n=fe(new To(t.size,0),ue(t.color));if(n.scale.set(...t.scale),n.rotation.set(...t.rot),n.position.set(e.x,t.y,e.z),t.moss){const s=fe(new To(t.size*.55,0),ue("#5d7a3a"),{shadow:!1});s.position.set(0,t.size*.55,0),s.scale.set(1.1,.4,1.1),n.add(s)}return{obj:n}},crate(i){const{look:t}=i,e=new kt,n=t.s,s=fe(Ti,ue(t.color));s.scale.setScalar(n),s.position.y=n/2;const r=fe(Ti,ue("#5f3e24"));if(r.scale.set(n*1.02,n*.14,n*1.02),r.position.y=n/2,e.add(s,r),t.stacked){const o=fe(Ti,ue("#9a7048"));o.scale.setScalar(n*.7),o.position.set(0,n+n*.35,0),o.rotation.y=.5,e.add(o)}return $a(i,e)},barrel(i){const t=new kt,e=fe(new Ye(.28,.24,.75,10),ue(i.look.color));e.position.y=.375;const n=fe(new _n(.29,.025,4,14).rotateX(Math.PI/2),ue("#3a3a3a",{metalness:.4}));return n.position.y=.55,t.add(e,n),$a(i,t)},sack(i){const t=new kt,e=fe(new nn(.34,9,7),ue("#c2a77a"));e.scale.set(1,1.15,.9),e.position.y=.36,t.add(e);for(const[n,s]of i.look.acorns){const r=fe(new nn(.08,6,5),ue("#8a5a2a"));r.position.set(n,.72,s),t.add(r)}return $a(i,t)},mushroom(i){const{look:t,shape:e}=i,{h:n,r:s,sr:r}=t,o=new kt;o.position.set(e.x,0,e.z);const a=fe(new Ye(r*.8,r*1.2,n,8).translate(0,n/2,0),ue("#efe6d0")),c=fe(new nn(s,14,8,0,Math.PI*2,0,Math.PI/2),ue(t.cap));c.position.y=n-.05,c.scale.y=.7;const l=fe(new Ni(s,14).rotateX(Math.PI/2),ue("#e9dcc0"));l.position.y=n-.05,o.add(a,c,l);for(const[h,u]of t.dots){const d=fe(new nn(s*.12,5,4),ue("#fff6e0"),{shadow:!1});d.position.set(Math.cos(h)*Math.sin(u)*s,n-.05+Math.cos(u)*s*.7,Math.sin(h)*Math.sin(u)*s),o.add(d)}return o.rotation.z=t.tilt,{obj:o}},floor(i){const{look:t,shape:e}=i,n=new Ni(t.r,t.segments),s=n.attributes.position;if(t.rim.length!==s.count-1)throw new Error(`a forest floor of ${s.count} vertices with ${t.rim.length} rim draws`);for(let o=1;o<s.count;o++){const a=t.rim[o-1];s.setXY(o,s.getX(o)*a,s.getY(o)*a)}n.rotateX(-Math.PI/2);const r=fe(n,ue(t.color,{flatShading:!1}),{shadow:!1});return r.position.set(e.x,.012,e.z),{obj:r}},rubble(i){const t=new kt;return t.position.set(i.shape.x,0,i.shape.z),{obj:t,pieces:0}}};function yu(i,t){const{look:e,shape:n}=i,s=fe(t,ue(e.color));return s.scale.set(...e.scale),s.position.set(n.x,n.y,n.z),s.rotation.y=e.yaw,{obj:s}}function $a(i,t){return t.position.set(i.shape.x,0,i.shape.z),t.rotation.y=i.look.yaw,{obj:t}}class Rd{constructor(t,e){this.scene=t,this.effects=e,this.group=new kt,t.add(this.group),this.items=new Map,this.spares=new Map}object(t){var e;return(e=this.items.get(t))==null?void 0:e.obj}apply(t,e){switch(t.t){case"terrain.clear":return this.clear();case"terrain.add":return this.add(t.def);case"terrain.hurt":return this.hurt(this.items.get(t.id).c,t.from,t.at);case"terrain.destroy":return this.destroy(this.items.get(t.id).c,t.from,t.at);case"terrain.collapse":return this.collapse(t.drops,t.by,e);case"terrain.rubble":return this.rubble(this.items.get(t.id).c,t.from)}throw new Error(`TerrainView: no handler for ${t.t}`)}clear(){this.freeSpares(),this.scene.remove(this.group),this.group=new kt,this.scene.add(this.group),this.spares=this.items,this.items=new Map}add(t){const e=this.spares.get(t.id);if(e!=null&&e.obj&&!e.touched&&!e.shared&&bu(e.c,t,!0)){this.spares.delete(t.id),this.items.set(t.id,{...e,c:t}),this.group.add(e.obj);return}if(t.look.piece==="fallen")return this.fell(t);const n={c:t,...Ga[t.look.piece](t)};this.items.set(t.id,n),this.group.add(n.obj)}dispose(){this.freeSpares();for(const t of this.items.values())this.free(t);this.items.clear(),this.scene.remove(this.group),this.group=new kt,this.scene.add(this.group)}sync(t){var n;this.freeSpares();const e=new Map(t.map(s=>[s.id,s]));for(const[s,r]of[...this.items]){const o=e.get(s);o&&bu(r.c,o,!1)&&(o.alive?this.shows(r):!this.shows(r))||(this.free(r),this.items.delete(s))}for(const s of t){const r=this.items.get(s.id);if(r){s.alive&&WM.has(s.look.piece)&&(r.fall=null,r.obj.position.y=s.shape.y,r.c=Js(s));continue}if(!s.alive){this.items.has(s.id)||this.items.set(s.id,{c:Js(s),obj:null});continue}if(s.look.piece==="fallen"){this.fallen(Js(s),e.get(s.look.tree));continue}const o=Js(s),a={c:o,...Ga[s.look.piece](o)};if(this.items.set(s.id,a),this.group.add(a.obj),s.kind==="rubble")for(const c of t)c.kind==="block"&&!c.alive&&((n=c.col)==null?void 0:n.rubble)===s&&this.rubble(o,null)}}shows(t){var e;return!t.obj||t.obj.parent!==this.group?!1:t.c.kind==="tree"?((e=t.canopy)==null?void 0:e.parent)===t.obj:!0}state(t){const e=this.items.get(t),n=!!e&&this.shows(e);if(!n)return{shown:n};const s=e.obj;return{shown:n,x:s.position.x,y:s.position.y,z:s.position.z,q:s.quaternion.toArray()}}free(t){t.canopy&&t.canopy.parent!==t.obj&&Mu(t.canopy),t.canopy=null,!(!t.obj||t.shared)&&(t.obj.parent&&t.obj.parent.remove(t.obj),Mu(t.obj),t.ownMat&&t.obj.material.dispose(),t.obj=null)}freeSpares(){for(const t of this.spares.values())this.free(t);this.spares.clear()}hurt(t,e,n){const s=this.items.get(t.id),r=s.obj;s.touched=!0,r.isMesh&&(s.ownMat||(r.material=r.material.clone(),s.ownMat=!0),r.material.color.multiplyScalar(.8));const o=r.position.clone();we(.25,a=>{const c=(1-a)*.06;r.position.x=o.x+(Math.random()-.5)*c,r.position.z=o.z+(Math.random()-.5)*c}).then(()=>{r.position.x=o.x,r.position.z=o.z}),this.effects.debris(n.x,n.y,n.z,[t.look.chip||"#888","#666"],3,{from:e,power:3,size:.08})}destroy(t,e,n){const s=this.items.get(t.id);s.touched=!0;const r=n,o=this.effects;switch(t.kind){case"block":{this.group.remove(s.obj),o.debris(r.x,r.y,r.z,[t.look.chip,t.look.chip,"#5a5650"],12,{from:e,power:6}),o.smoke({x:r.x,y:r.y,z:r.z,size:.4,color:"#a09a8a",life:1.5});break}case"tree":{for(const a of s.canopy.children){const c=new C;a.getWorldPosition(c),o.leaves(c.x,c.y,c.z,t.look.leaves,14,1)}s.obj.remove(s.canopy);break}case"hedge":case"mushroom":if(this.group.remove(s.obj),o.leaves(r.x,r.y,r.z,t.look.leaves,t.kind==="hedge"?22:28,t.kind==="hedge"?.8:1.4),t.kind==="mushroom")for(let a=0;a<16;a++)o.mote({x:r.x,y:r.y*1.5,z:r.z,vx:(Math.random()-.5)*3,vy:Math.random()*2,vz:(Math.random()-.5)*3,size:.05,color:"#f0e0ff",life:2.5,drag:1});break;case"crate":case"log":this.group.remove(s.obj),o.debris(r.x,r.y,r.z,J_,14,{from:e,power:6,size:.12});break}t.kind==="block"?Se.crumble():Se.thwack()}collapse(t,e,n){for(const{id:s,dy:r}of t){const o=this.items.get(s),{c:a,obj:c}=o;o.touched=!0;const l=n.chunks[s].y,h=c.position.y,u=l,d=o.fall={};we(.18+r*.15,f=>o.fall===d&&(c.position.y=h+(u-h)*f),yM).then(()=>{this.effects.debris(a.shape.x,l-e/2,a.shape.z,["#8a8478"],3,{power:2,size:.07})})}}rubble(t,e){const n=this.items.get(t.id),s=n.obj;n.touched=!0;const r=jf[t.look.style],o=4+Math.floor(Math.random()*3);for(let a=0;a<o;a++){const c=fe(Ti,ue(vM(r.colors))),l=.18+Math.random()*.22;c.scale.set(l*(r.look==="log"?2.4:1.2),l*.7,l);const h=Math.random()*6,u=Math.random()*.6,d=e?t.shape.x-e.x:0,f=e?t.shape.z-e.z:0,g=Math.hypot(d,f)||1;c.position.set(Math.cos(h)*u+d/g*.25,l*.3+Math.min(.2,n.pieces*.012),Math.sin(h)*u+f/g*.25),c.rotation.set(Math.random(),Math.random()*6,Math.random()),s.add(c)}n.pieces+=o}fell(t){const e=this.items.get(t.look.tree),n=e.c,s=n.shape,r=n.look.trunk,{dx:o,dz:a}=t.look,c=e.obj,l=c.quaternion.clone(),h=Su(c,l,t.look,r);we(.9,h,xM).then(()=>{this.effects.debris(s.x+o*r.h,.2,s.z+a*r.h,["#6b4a2e","#4f8a34"],8,{power:3,size:.1}),this.effects.shake=Math.max(this.effects.shake,.05)}),e.shared=!0,this.items.set(t.id,{c:t,obj:c,touched:!0}),this.group.add(c)}fallen(t,e){const n=Js(e),{obj:s,canopy:r}=Ga.tree(n);s.remove(r),Su(s,s.quaternion.clone(),t.look,n.look.trunk)(1),this.items.set(n.id,{c:n,obj:s,canopy:r,shared:!0}),this.items.set(t.id,{c:t,obj:s,touched:!0}),this.group.add(s)}}function Mu(i){i.traverse(t=>{t.geometry&&t.geometry!==Ti&&t.geometry!==Ad&&t.geometry.dispose()})}const WM=new Set(["box","log","cap"]),Js=i=>({id:i.id,kind:i.kind,shape:{...i.shape},look:i.look});function bu(i,t,e){const n=s=>JSON.stringify({id:s.id,kind:s.kind,look:s.look,shape:e?s.shape:{...s.shape,y:0}});return n(i)===n(t)}function Su(i,t,{dx:e,dz:n},s){const r=new C(n,0,-e).normalize(),o=new Tn;return a=>{o.setFromAxisAngle(r,(Math.PI/2-.12)*a),i.quaternion.copy(t).premultiply(o),i.position.y=Math.sin(a*Math.PI)*.05+s.r*a}}function GM(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new xe;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in r){const u=wu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][d]);const g=wu(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function wu(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.array.length}const o=new t(r);let a=0;for(let l=0;l<i.length;++l)o.set(i[l].array,a),a+=i[l].array.length;const c=new sn(o,e,n);return s!==void 0&&(c.gpuType=s),c}function $M(i){for(const t of["position","normal"]){const e=i.getAttribute(t);for(let n=0;n<e.count;n+=3){const s=e.getX(n+1),r=e.getY(n+1),o=e.getZ(n+1);e.setXYZ(n+1,e.getX(n+2),e.getY(n+2),e.getZ(n+2)),e.setXYZ(n+2,s,r,o)}}}const ja=new Map;function jM(i){return[i.metalness,i.roughness,i.emissiveIntensity>0?i.emissive.getHex():0,i.emissiveIntensity,i.transparent,i.opacity,i.side,i.flatShading].join("|")}function Mc(i){i.updateMatrixWorld(!0);const t=new se().copy(i.matrixWorld).invert(),e=new se,n=new Map,s=[],r=o=>{for(const a of o.children){if(a.userData.keep){Mc(a);continue}if(a.isMesh){const c=a.material,l=jM(c);n.has(l)||n.set(l,{m:c,geos:[]});const h=a.geometry.index?a.geometry.toNonIndexed():a.geometry,u=new xe;u.setAttribute("position",h.getAttribute("position").clone()),u.setAttribute("normal",h.getAttribute("normal").clone()),u.applyMatrix4(e.multiplyMatrices(t,a.matrixWorld)),e.determinant()<0&&$M(u);const d=u.getAttribute("position").count,f=new Float32Array(d*3);for(let g=0;g<d;g++)f.set([c.color.r,c.color.g,c.color.b],g*3);u.setAttribute("color",new sn(f,3)),n.get(l).geos.push(u),s.push(a)}r(a)}};r(i);for(const o of s)o.parent.remove(o);for(const[o,{m:a,geos:c}]of n)ja.has(o)||ja.set(o,new xn({vertexColors:!0,metalness:a.metalness,roughness:a.roughness,flatShading:a.flatShading,emissive:a.emissive,emissiveIntensity:a.emissiveIntensity,transparent:a.transparent,opacity:a.opacity,side:a.side})),i.add(new Vt(GM(c),ja.get(o)))}function cs({fur:i="#c96a2d",belly:t="#f1dcb5",hat:e="acorn",hatColor:n="#6e4a2a",tailUp:s=1}={}){const r=new kt,o=new kt;r.add(o);const a=vt(i),c=vt(t),l=vt("#1b1410");for(const p of[-1,1])o.add(st(ft.ico,a,p*.1,.05,.07,.08,.045,.13)),o.add(st(ft.ico,a,p*.12,.17,-.02,.14));o.add(st(ft.ico,a,0,.38,0,.21,.28,.19)),o.add(st(ft.ico,c,0,.36,.1,.14,.2,.09));const h=new kt;h.position.set(0,.72,.05),o.add(h),h.add(st(ft.ico,a,0,0,0,.17)),h.add(st(ft.ico,c,0,-.05,.12,.09,.075,.08)),h.add(st(ft.sph,l,0,-.02,.2,.028));for(const p of[-1,1]){h.add(st(ft.sph,l,p*.075,.04,.13,.034)),h.add(st(ft.sph,vt("#ffffff"),p*.068,.055,.155,.01));const x=st(ft.cone,a,p*.09,.16,-.02,.05,.13,.04);x.rotation.z=-p*.25,h.add(x);const y=st(ft.cone,vt(Qs(i,-.25)),p*.1,.25,-.02,.025,.07,.02);y.rotation.z=-p*.3,h.add(y)}e==="acorn"&&(h.add(st(ft.cap,vt(n),0,.07,0,.19,.13,.19)),h.add(st(ft.brim,vt(n),0,.07,0,.19,1,.19)),h.add(st(ft.cyl,vt(Qs(n,-.2)),0,.22,0,.02,.06,.02)));const u=new kt;u.position.set(0,.22,-.18),o.add(u);const d=new kc([[0,0,0],[0,.2,-.26],[0,.55*s,-.32],[0,.82*s,-.22],[0,.93*s,-.02]].map(p=>new C(...p))),f=vt(Qs(i,.08)),g=vt(Qs(i,.2)),v=12;for(let p=0;p<v;p++){const x=p/(v-1),y=.085+Math.sin(Math.min(1,x*1.15)*Math.PI)*.11,_=d.getPointAt(x);u.add(st(ft.ico,x>.75?g:f,_.x,_.y,_.z,y,y*1.1,y))}const m=[];for(const p of[-1,1]){const x=new kt;x.position.set(p*.17,.52,.04),x.add(st(ft.ico,a,0,-.1,0,.05,.12,.05));const y=new kt;y.position.set(0,-.21,0),y.add(st(ft.ico,a,0,0,0,.045)),x.add(y),x.userData.hand=y,x.rotation.x=-.9,o.add(x),m.push(x)}return r.userData.anim={kind:"squirrel",body:o,tail:u,head:h,armL:m[0],armR:m[1]},r}const Cd={nutkin(){const i=cs({fur:"#cf6d2a",hatColor:"#6a4a26"}),t=i.userData.anim,e=st(ft.cone,vt("#5f8f2e"),0,.45,-.06,.25,.42,.2);e.rotation.x=.15,t.body.add(e);const n=new kt;return n.add(bi([0,-.08,0],[0,.04,0],.018,Zs())),n.add(bi([0,.04,0],[-.05,.13,0],.014,Zs())),n.add(bi([0,.04,0],[.05,.13,0],.014,Zs())),Hn(t.armR,n,1.4),t.armR.rotation.x=-1.3,i},grenadier(){const i=cs({fur:"#a9552a",hatColor:"#4f3a22"}),t=i.userData.anim,e=st(new _n(.21,.025,4,16),vt("#4a3020"),0,.4,.02);e.rotation.set(.1,0,.75),e.scale.z=.8,t.body.add(e);for(let s=0;s<4;s++){const r=-.7+s*.45;t.body.add(st(ft.sph,vt("#8a5a2a"),Math.sin(r)*.21*.7,.4+Math.cos(r)*.21*.7,.17,.045,.055,.045))}for(const s of[-1,1])t.head.add(st(new _n(.04,.012,4,10),Fe("#c9a24a"),s*.07,.07,.14));const n=new kt;return n.add(st(ft.sph,vt("#8a5a2a"),0,0,0,.06,.07,.06)),n.add(st(ft.cap,vt("#4f3a22"),0,.03,0,.065,.04,.065)),n.add(st(ft.brim,vt("#4f3a22"),0,.03,0,.065,1,.065)),n.add(st(ft.sph,Ai("#ffb030"),0,.1,0,.022)),Hn(t.armR,n,0),t.armR.rotation.x=2.3,i},oakguard(){const i=cs({fur:"#8a5a35",hatColor:"#5a3c22"}),t=i.userData.anim;t.body.add(st(ft.ico,vt("#5b4330"),0,.42,.05,.2,.22,.16));const e=st(ft.cone,vt("#c0302a"),0,.3,-.05,.03,.18,.08);e.rotation.x=-.5,t.head.add(e);const n=wd(.22,vt("#6b4a2e"),vt("#3e7a2a"));Hn(t.armL,n,.9),n.position.set(-.02,0,.08),t.armL.rotation.set(-.6,0,.3);const s=new kt;return s.add(st(ft.cyl,Zs(),0,.2,0,.022,1.15,.022)),s.add(st(ft.box,Fe("#a8b0b8"),.07,.62,0,.12,.16,.02)),s.add(st(ft.cone,vt("#6b4a26"),0,.85,0,.06,.18,.06)),Hn(t.armR,s,.9),i},glider(){const i=cs({fur:"#9a8a78",belly:"#efe5d5",hat:"none",tailUp:.25}),t=i.userData.anim;for(const n of[-1,1])t.head.add(st(new _n(.045,.015,4,10),Fe("#c9a24a"),n*.07,.07,.14));t.head.add(st(ft.cap,vt("#6b4a2e"),0,.06,-.01,.18,.11,.18)),t.head.add(st(ft.brim,vt("#6b4a2e"),0,.06,-.01,.18,1,.18)),t.armL.rotation.set(-.2,0,-1.25),t.armR.rotation.set(-.2,0,1.25);const e=vt(Qs("#9a8a78",-.12),{side:en});for(const n of[-1,1]){const s=new xe;s.setAttribute("position",new ie([n*.15,.52,.02,n*.42,.45,.02,n*.2,.1,0,n*.15,.52,.02,n*.2,.1,0,n*.12,.25,0],3)),s.computeVertexNormals();const r=new Vt(s,e);r.castShadow=!0,t.body.add(r)}return t.body.position.y=.7,t.body.rotation.x=.55,t.lift=.7,i.add(st(ft.cyl,vt("#cfe8ff",{transparent:!0,opacity:.35}),0,.42,0,.025,.66,.025)),t.tail.rotation.x=-.6,i},trebuchet(){const i=new kt,t=new kt;i.add(t);const e=vt("#7a5232"),n=vt("#5f3e24");for(const l of[-1,1])t.add(st(ft.box,n,l*.38,.2,0,.1,.1,1.6)),t.add(bi([l*.38,.2,-.55],[l*.38,1.25,0],.045,e)),t.add(bi([l*.38,.2,.55],[l*.38,1.25,0],.045,e));t.add(st(ft.box,n,0,.2,.6,.86,.08,.1)),t.add(st(ft.box,n,0,.2,-.6,.86,.08,.1));const s=st(ft.cyl,Fe("#555"),0,1.25,0,.04,.9,.04);s.rotation.z=Math.PI/2,t.add(s);const r=[];for(const l of[-1,1])for(const h of[-.6,.6]){const u=Ed(.17,l*.5,.17,h);t.add(u),r.push(u)}const o=new kt;o.position.set(0,1.25,0),o.add(st(ft.box,e,0,0,.35,.08,.08,1.7));const a=st(ft.box,n,0,-.18,-.45,.32,.3,.3);o.add(a);for(let l=0;l<5;l++)o.add(st(ft.sph,vt("#8a5a2a"),(Math.random()-.5)*.2,-.02,-.45+(Math.random()-.5)*.2,.06));const c=st(ft.cone,vt("#6b4a26"),0,0,1.25,.11,.24,.11);c.rotation.x=Math.PI/2,o.add(c),o.add(st(ft.sph,Ai("#ff8a2a"),0,.06,1.25,.05)),o.rotation.x=.75,o.rotation.y=Math.PI,t.add(o);for(const l of[-1,1]){const h=cs({fur:"#c96a2d"});h.scale.setScalar(.72),h.position.set(l*.72,.05,-.25),h.rotation.y=-l*.5,h.userData.anim.armR.rotation.x=-2.2,t.add(h)}o.userData.keep=!0;for(const l of r)l.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:r,throwArm:o,rest:.75},i},elder(){const i=cs({fur:"#a9a197",belly:"#f4efe6",hat:"none"}),t=i.userData.anim;i.scale.setScalar(1.28);const e=st(new Rn(.3,.55,10,1,!0),vt("#5a6b34",{side:en}),0,.3,0);t.body.add(e),t.head.add(st(ft.cone,vt("#f4efe6"),0,-.14,.15,.06,.16,.04).rotateX(Math.PI));for(let s=0;s<7;s++){const r=s/7*Math.PI*2,o=st(ft.cone,vt(s%2?"#d08a2c":"#6aa646"),Math.cos(r)*.15,.12,Math.sin(r)*.15,.035,.12,.02);o.rotation.set(Math.sin(r)*.4,0,-Math.cos(r)*.4),t.head.add(o)}const n=new kt;n.add(st(ft.cyl,vt("#5a3d24"),0,.25,0,.025,1,.025)),n.add(st(ft.oct,Ai("#7dff8a"),0,.82,0,.07,.11,.07));for(let s=0;s<3;s++){const r=s/3*Math.PI*2;n.add(bi([0,.7,0],[Math.cos(r)*.07,.86,Math.sin(r)*.07],.012,vt("#5a3d24")))}return Hn(t.armL,n,.9),t.armL.rotation.x=-.6,t.gem=n.children[1],t.gem.userData.keep=!0,i}},XM=new Set([Cd.trebuchet]);function ls({scale:i="#3f8f4a",belly:t="#d9cf86",hood:e=null,hoodSize:n=1,long:s=!1,thick:r=1}={}){const o=new kt,a=new kt;o.add(a);const c=vt(i),l=vt(t);let h;if(s)h=[[.05,.05,-.9],[-.18,.06,-.62],[.16,.07,-.34],[-.06,.1,-.08],[0,.26,.02],[0,.4,.03]];else{h=[];for(let v=0;v<=10;v++){const m=v/10,p=-.6+m*Math.PI*2.3,x=.3-m*.17;h.push([Math.cos(p)*x,.06+m*.1,Math.sin(p)*x-.04])}h.push([0,.3,.02],[0,.42,.03])}a.add(OM(h,.025,.115*r,c));const u=st(new Hc(.12*r,.2,3,8),c,0,.53,.04);u.rotation.x=.12,a.add(u),a.add(st(ft.ico,l,0,.5,.12*r,.085*r,.17,.05));const d=new kt;if(d.position.set(0,.79,.08),a.add(d),e){const v=st(ft.ico,vt(e),0,-.02,-.07,.21*n,.24*n,.05);d.add(v);for(const m of[-1,1])d.add(st(ft.sph,vt(t),m*.08*n,.02,-.12,.035*n,.035*n,.01))}d.add(st(ft.ico,c,0,0,.02,.11,.09,.15)),d.add(st(ft.ico,l,0,-.04,.06,.08,.04,.11));for(const v of[-1,1])d.add(st(ft.sph,vt("#ffd23a",{emissive:"#b08000",emissiveIntensity:.4}),v*.065,.035,.09,.03)),d.add(st(ft.sph,vt("#111111"),v*.079,.037,.1,.008,.024,.012));const f=new kt;f.position.set(0,-.03,.16);for(const v of[-1,1]){const m=st(ft.cyl,vt("#d0304a"),v*.012,0,.05,.008,.1,.008);m.rotation.x=Math.PI/2,m.rotation.z=v*.3,f.add(m)}f.scale.setScalar(.001),d.add(f);const g=[];for(const v of[-1,1]){const m=new kt;m.position.set(v*.15*r,.64,.05),m.add(st(ft.ico,c,0,-.1,0,.045*r,.12,.045*r));const p=new kt;p.position.set(0,-.21,0),p.add(st(ft.ico,c,0,0,0,.042*r)),m.add(p),m.userData.hand=p,m.rotation.x=-.9,a.add(m),g.push(m)}return o.userData.anim={kind:"naga",body:a,head:d,tongue:f,armL:g[0],armR:g[1]},o}const qM={scaleguard(){const i=ls({scale:"#3f8f4a",belly:"#d9cf86"}),t=i.userData.anim;t.head.add(st(ft.cap,Fe("#b8862e"),0,.04,.01,.12,.09,.15)),t.head.add(st(ft.brim,Fe("#b8862e"),0,.04,.01,.12,1,.15)),t.head.add(st(ft.box,Fe("#b8862e"),0,.12,-.02,.015,.06,.18)),Hn(t.armR,zM(1.15),.9);const e=wd(.2,Fe("#a8762a"),Fe("#e0b050"));return Hn(t.armL,e,.9),e.position.z=.06,t.armL.rotation.set(-.7,0,.35),i},spitter(){const i=ls({scale:"#2f8f86",belly:"#e0d890",hood:"#5a2f7a",hoodSize:1.45}),t=i.userData.anim;return t.head.add(st(ft.sph,Ai("#8aff5a"),0,-.04,.16,.035)),t.body.add(st(ft.ico,vt("#7a8a3a"),.17,.38,.05,.08,.1,.08)),t.body.add(st(ft.sph,Ai("#8aff5a"),.17,.48,.05,.03)),t.armL.rotation.x=-.5,t.armR.rotation.x=-.5,i},sidewinder(){const i=ls({scale:"#c2a061",belly:"#efe0b0",long:!0}),t=i.userData.anim;for(let e=0;e<6;e++)t.body.add(st(ft.oct,vt("#6b4a2a"),0,.12+e*.07,-.05-e*.02,.04,.03,.04));for(const e of[-1,1]){const n=st(ft.cone,vt("#8a6a3a"),e*.06,.08,.05,.02,.07,.02);n.rotation.z=-e*.4,t.head.add(n);const s=st(new _n(.13,.014,4,12,Math.PI*.9),Fe("#c8ccd0"),0,.08,.08);s.rotation.y=Math.PI/2,Hn(e<0?t.armL:t.armR,s,.4)}return t.armL.rotation.set(-1.3,0,.3),t.armR.rotation.set(-1.3,0,-.3),t.body.rotation.x=.12,i},brute(){const i=ls({scale:"#4f6e2a",belly:"#c8b870",thick:1.35}),t=i.userData.anim;i.scale.setScalar(2.15);for(let e=0;e<7;e++){const n=st(ft.cone,vt("#e8dcc0"),0,.45+e*.06,-.12-(e<3?0:(e-3)*.01),.02,.07,.02);n.rotation.x=-1.1,t.body.add(n)}for(const e of[-1,1]){const n=st(ft.cone,vt("#e8dcc0"),e*.07,.08,-.03,.025,.12,.025);n.rotation.set(-.6,0,-e*.6),t.head.add(n),t.body.add(st(new _n(.06,.015,4,10).rotateX(Math.PI/2),Fe("#b8862e"),e*.2,.5,.05))}return t.armL.rotation.set(-1.2,0,.5),t.armR.rotation.set(-1.2,0,-.5),i},engine(){const i=new kt,t=new kt;i.add(t);const e=vt("#4a3a2a"),n=vt("#3a2c20");t.add(st(ft.box,e,0,.36,0,.8,.22,1.35));const s=[];for(const c of[-1,1])for(const l of[-.45,.45]){const h=Ed(.21,c*.47,.21,l);t.add(h),s.push(h)}const r=st(ft.ico,vt("#d8cfb0"),0,.55,.78,.2,.16,.28);t.add(r);for(const c of[-1,1])t.add(st(ft.cone,vt("#f4ecd8"),c*.09,.43,.92,.025,.12,.025).rotateX(Math.PI)),t.add(st(ft.sph,Ai("#8aff5a"),c*.1,.62,.88,.035));for(const c of[-1,1])t.add(bi([c*.3,.45,-.3],[c*.2,1.05,-.1],.04,n));const o=new kt;o.position.set(0,1.05,-.1),o.add(st(ft.box,e,0,0,.35,.08,.08,.9)),o.add(st(ft.cap,vt("#3a2c20",{side:en}),0,.02,.8,.14,.08,.14).rotateX(Math.PI));const a=st(ft.sph,vt("#7dff5a",{emissive:"#4ad02a",emissiveIntensity:1.1,transparent:!0,opacity:.85,roughness:.15}),0,.12,.8,.14);a.userData.keep=!0,o.add(a),o.rotation.x=-.55,t.add(o);for(let c=0;c<3;c++)t.add(st(ft.sph,vt("#7dff5a",{emissive:"#3ab02a",emissiveIntensity:.9}),-.2+c*.2,.55,-.55,.08));for(const c of[-1,1]){const l=ls({scale:"#3f8f4a",belly:"#d9cf86"});l.scale.setScalar(.72),l.position.set(c*.72,.05,-.35),l.rotation.y=-c*.5,t.add(l)}o.userData.keep=!0;for(const c of s)c.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:s,throwArm:o,rest:-.55,globe:a},i},hierophant(){const i=ls({scale:"#5e3a8c",belly:"#e6c870",hood:"#3a2060",hoodSize:1.7}),t=i.userData.anim;i.scale.setScalar(1.32);for(let n=0;n<5;n++){const s=(n/4-.5)*1.6,r=st(ft.cone,Fe("#e0b040"),Math.sin(s)*.1,.12+Math.cos(s)*.04,-.02,.02,.12,.02);r.rotation.z=-s*.5,t.head.add(r)}for(const n of[-1,1])t.body.add(st(new _n(.05,.014,4,10).rotateX(Math.PI/2),Fe("#e0b040"),n*.15,.45,.05));const e=new kt;return e.add(st(ft.cyl,vt("#2a1a40"),0,.25,0,.022,1,.022)),e.add(st(ft.sph,Ai("#c070ff"),0,.82,0,.08)),e.add(st(new _n(.1,.012,4,14),Fe("#e0b040"),0,.82,0)),Hn(t.armL,e,.9),t.armL.rotation.x=-.6,t.gem=e.children[1],t.gem.userData.keep=!0,i}},YM=new Set,Xa=Object.freeze({squirrel:Cd,serpent:qM}),KM=new Set([...XM,...YM]),qa=new Map;function Eu(i,t,e,n){if(!Object.hasOwn(Xa,i)||!Object.hasOwn(Xa[i],t))throw new Error(`no figure for unit "${t}" in the "${i}" kit`);const s=`${i}/${t}`,r=Xa[i][t],o=KM.has(r),a=new kt,c=NM(e.base,n);a.add(c);const l=o||!qa.has(s),h=l?r():Tu(qa.get(s));h.position.y=e.big?.09:.06,h.userData.y0=h.position.y,a.add(h),a.userData.fig=h,a.userData.anim=h.userData.anim,a.userData.phase=Math.random()*10,a.userData.drawn=o,Mc(c),l&&Mc(h),a.traverse(f=>{f.isMesh&&(f.castShadow=!0)}),c.traverse(f=>{f.isMesh&&(f.receiveShadow=!0)});const u=new Set,d=f=>f.traverse(g=>g.isMesh&&u.add(g.geometry));return d(c),o&&d(h),a.userData.own=[...u],l&&!o&&qa.set(s,Tu(h)),a}function JM(i){for(const t of i.userData.own??[])t.dispose();i.userData.own=[]}function Tu(i){const t=new Map;i.traverse(o=>{t.set(o,o.userData),o.userData={}});let e;try{e=i.clone(!0)}finally{for(const[o,a]of t)o.userData=a}const n=new Map,s=(o,a)=>{n.set(o,a),o.children.forEach((c,l)=>s(c,a.children[l]))};s(i,e);const r=o=>o!=null&&o.isObject3D?n.get(o)??o:Array.isArray(o)?o.map(r):o&&typeof o=="object"?Object.fromEntries(Object.entries(o).map(([a,c])=>[a,r(c)])):o;for(const[o,a]of t)n.get(o).userData=r(a);return e}let ZM=null;const QM=()=>ZM??(ZM={ring:new Oi(.88,1,48).rotateX(-Math.PI/2),hit:new Ye(1,1,1,12)}),so=new C;class Pd{constructor({scene:t,labels:e,fx:n,mirror:s,colorOf:r,W:o}){this.scene=t,this.W=o,this.labels=e,this.effects=n,this.mirror=s,this.colorOf=r,this.views=new Map,this.gen=0}get(t){return this.views.get(t)}unit(t){return this.views.get(t).u}shown(t){return this.mirror().units[t]}standing(t){const e=this.shown(t);return this.views.get(t).models.filter((n,s)=>e.models[s].alive)}top(t){const e=this.shown(t).pos;return{x:e.x,y:this.unit(t).t.big?2.6:1.6,z:e.z}}gone(t,e,n){return this.views.get(t)!==e||this.gen!==n}make(t,e,n){const s=-e*Math.PI/2,r=this.shown(t.id),o={id:t.id,u:t,edge:e,color:n,facing:s,moving:!1,at:null,models:[]},a=Sn[t.race].look.models;for(let h=0;h<t.t.models;h++){if(!r.models[h].alive){o.models.push({mesh:null,x:0,z:0,yaw:s,lunge:0,lungeDir:0,lift:0});continue}const u=Eu(a,t.key,t.t,n);this.scene.add(u),o.models.push({mesh:u,x:0,z:0,yaw:s,lunge:0,lungeDir:0,lift:0})}const{ring:c,hit:l}=QM();return o.ring=new Vt(c,new He({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})),o.ring.position.y=.04,o.ring.renderOrder=2,this.scene.add(o.ring),o.hit=new Vt(l,new He({visible:!1})),o.hit.userData.id=t.id,this.scene.add(o.hit),o.label=document.createElement("div"),o.label.className=`ulabel s${t.side}`,this.labels.appendChild(o.label),this.views.set(t.id,o),this.disc(t.id),this.stands(o,r.alive>0),this.place(o),o}stands(t,e){t.ring.visible=e,t.hit.visible=e,e&&!t.hit.parent&&this.scene.add(t.hit),e||this.scene.remove(t.hit)}place(t){const e=this.shown(t.id);e.models.forEach((n,s)=>{const r=t.models[s];r.mesh&&(r.x=e.pos.x+n.ox,r.z=e.pos.z+n.oz,r.mesh.position.set(r.x,0,r.z),r.mesh.rotation.y=r.yaw)})}unfigure(t){t.mesh&&(this.scene.remove(t.mesh),JM(t.mesh))}drop(t){for(const e of t.models)this.unfigure(e);this.scene.remove(t.ring,t.hit),t.ring.material.dispose(),t.hit.material.dispose(),t.label.remove(),this.views.delete(t.id)}dispose(){for(const t of[...this.views.values()])this.drop(t);this.gen++}sync(t,e){this.gen++;const n=this.mirror(),s=new Set(t.map(r=>r.id));for(const r of[...this.views.values()])s.has(r.id)||this.drop(r);for(const r of t){const o=e(r.side),a=this.colorOf(r.side);let c=this.views.get(r.id);if(c&&(c.u.t!==r.t||c.u.side!==r.side||c.edge!==o||c.color!==a)&&(this.drop(c),c=null),!c){this.make(r,o,a);continue}const l=n.units[r.id],h=Sn[r.race].look.models;c.at=null,c.moving=!1,c.facing=-o*Math.PI/2,c.models.forEach((u,d)=>{if(!l.models[d].alive){this.unfigure(u),c.models[d]={mesh:null,x:u.x,z:u.z,yaw:c.facing,lunge:0,lungeDir:0,lift:0};return}if(!u.mesh||u.dying||u.fleeing||!u.mesh.parent){this.unfigure(u);const g=Eu(h,r.key,r.t,a);this.scene.add(g),u=c.models[d]={mesh:g,x:0,z:0,yaw:c.facing,lunge:0,lungeDir:0,lift:0}}Object.assign(u,{yaw:c.facing,look:void 0,lunge:0,lift:0,flash:0,flying:!1,moving:!1}),u.mesh.position.y=0,u.mesh.userData.fig.position.x=0;const f=u.mesh.userData.anim;f!=null&&f.throwArm&&(f.throwArm.rotation.x=f.rest),f!=null&&f.globe&&(f.globe.visible=!0)}),this.disc(r.id),this.stands(c,l.alive>0),this.place(c)}this.labelAll()}disc(t){const e=this.views.get(t),n=e.u,s=this.shown(t),r=e.at??s.pos;e.ring.scale.setScalar(s.r+.18);const o=n.t.big?2.4:n.t.fly?1.8:1.3;e.hit.scale.set(s.r,o,s.r),e.ring.position.x=e.hit.position.x=r.x,e.ring.position.z=e.hit.position.z=r.z,e.hit.position.y=e.hit.scale.y/2}label(t){const e=this.views.get(t),n=e.u,s=this.shown(t),r=s.models.filter(a=>a.alive);let o=`<span class="nm">${n.t.short}</span>`;n.t.models>1?o+=`<span class="ct">${s.alive}/${n.t.models}</span>`:o+=`<span class="ct">${r[0]?r[0].w:0}/${n.t.W}♥</span>`,s.mesmerized&&(o+='<span class="st" title="Mesmerized">🌀</span>'),s.alive>0&&s.engaged&&(o+='<span class="st" title="In combat">⚔</span>'),e.label.innerHTML=o,e.label.style.display=s.alive>0?"":"none"}labelAll(){for(const t of this.views.keys())this.label(t)}paintRings(t){for(const e of this.views.values()){if(!(this.shown(e.id).alive>0))continue;const[n,s]=t(e);e.ring.material.opacity=s,e.ring.material.color.set(n)}}pickables(){return[...this.views.values()].filter(t=>this.shown(t.id).alive>0).map(t=>t.hit)}animate(t,e,{fast:n,camera:s,sel:r}){const o=this.mirror();for(const a of this.views.values()){const c=a.u,l=o.units[c.id],h=a.at??l.pos;for(const[u,d]of l.models.entries()){const f=a.models[u];if(!d.alive&&!f.dying)continue;const g=f.mesh.userData.anim;if(d.alive){const p=h.x+d.ox,x=h.z+d.oz,y=1-Math.exp(-t*(a.moving?16:7)),_=f.x,R=f.z;f.x+=(p-f.x)*y,f.z+=(x-f.z)*y;const S=Math.hypot(f.x-_,f.z-R)/Math.max(t,1e-4),E=S>.6?Math.atan2(f.x-_,f.z-R):f.look??a.facing;f.yaw+=_M(E-f.yaw)*(1-Math.exp(-t*8)),f.moving=S>.6;let N=0,M=0;if(f.lunge>0){f.lunge=Math.max(0,f.lunge-t*2.5);const w=Math.sin((1-f.lunge)*Math.PI)*.35;N=Math.sin(f.lungeDir)*w,M=Math.cos(f.lungeDir)*w}f.mesh.position.set(f.x+N,f.lift||0,f.z+M),f.mesh.rotation.y=f.yaw}if(!g||!d.alive)continue;const v=e+f.mesh.userData.phase,m=f.mesh.userData.fig;if(g.kind==="squirrel"){const p=f.moving?Math.abs(Math.sin(v*13))*.16:0;m.position.y=m.userData.y0+p,m.scale.y=1+(f.moving?0:Math.sin(v*2.4)*.018),m.rotation.x=f.moving?.12:0}else if(g.kind==="naga")m.rotation.z=Math.sin(v*(f.moving?9:1.4))*(f.moving?.12:.035),m.scale.y=1+Math.sin(v*1.4)*.015;else if(g.kind==="machine"&&f.moving)for(const p of g.wheels)p.rotation.x+=t*6;g.gem&&(g.gem.rotation.y=v*2),f.flash>0&&(f.flash-=t,m.position.x=Math.sin(e*60)*.04*(f.flash>0?1:0))}if(l.alive>0&&!n){so.set(h.x,c.t.big?2.7:c.t.fly?2.3:1.7,h.z).project(s);const u=so.z<1;a.label.style.transform=`translate(${(so.x*.5+.5)*innerWidth}px, ${(-so.y*.5+.5)*innerHeight}px) translate(-50%, -100%)`,a.label.style.visibility=u&&o.stage!=="title"?"visible":"hidden",a.label.classList.toggle("sel",c.id===r)}}}wounded(t){const e=this.views.get(t.u),n=e.u,s=e.models[t.m];this.effects.text({x:s.x,y:n.t.big?2.3:1.3,z:s.z},`-${t.dmg}`,"#ff5a4a",{size:n.t.big?24:18}),s.flash=.4}slain(t,e){const n=this.views.get(t.u),s=n.u,r=n.models[t.m];this.effects.text({x:r.x,y:s.t.big?2.3:1.3,z:r.z},`-${t.dmg}`,"#ff5a4a",{size:s.t.big?24:18}),r.dying=!0;const o=Sn[s.race].look;Se.voice(o.voice);const a=r.mesh.userData.fig,c=t.by===null?null:e.units[t.by],l=c?Math.atan2(r.x-c.pos.x,r.z-c.pos.z)-r.yaw:0,h=Math.sin(l)>=0?1:-1;this.effects.debris(r.x,.5,r.z,o.gore,6,{power:2,size:.07}),we(.6,u=>{a.rotation.z=h*u*1.45,a.position.y=(s.t.big?.09:.06)+Math.sin(u*Math.PI)*.15},ys).then(()=>En(1.4)).then(()=>we(.8,u=>r.mesh.position.y=-u*1.4)).then(()=>{this.unfigure(r),r.dying=!1})}fled(t){const e=this.views.get(t.u),n=e.models[t.m];n.dying=!0;const s=e.edge,r=s*(this.W/2+3),o=n.x,a=n.z;n.fleeing=!0,this.effects.text({x:n.x,y:1.4,z:n.z},"flees!","#e0e0e0",{size:14}),n.yaw=s*Math.PI/2,we(2.2,c=>{n.x=ln(o,r,c),n.z=a,n.mesh.position.set(n.x,Math.abs(Math.sin(c*30))*.2,n.z),n.mesh.rotation.y=n.yaw}).then(()=>{this.unfigure(n),n.dying=!1})}destroyed(t,e){const n=this.views.get(t.u),s=n.u,r=e.units[t.u].pos;n.label.style.display="none",n.ring.visible=!1,n.hit.visible=!1,this.scene.remove(n.hit),this.effects.text({x:r.x,y:2.2,z:r.z},`${s.t.short} destroyed`,this.colorOf(t.by!==null?this.unit(t.by).side:1-s.side),{size:20,life:2})}face(t){const e=this.views.get(t.u),n=this.shown(t.tg).pos,s=this.shown(t.u).pos;e.facing=Math.atan2(n.x-s.x,n.z-s.z);for(const r of e.models)r.look=Math.atan2(n.x-r.x,n.z-r.z)}shout(t){const e=this.unit(t.u);t.ok?this.effects.text(this.top(t.u),"CHARGE!",this.colorOf(e.side),{size:22}):this.effects.text(this.top(t.u),"Charge failed","#d0d0d0")}lunge(t){const e=this.views.get(t.tg),n=this.gen,s=this.shown(t.tg).pos;for(const r of this.standing(t.u))r.lunge=1,r.lungeDir=Math.atan2(s.x-r.x,s.z-r.z);Se.thwack(),t.hits&&En(Is.dice(t.n)).then(()=>{if(!this.gone(t.tg,e,n))for(let r=0;r<Math.min(t.hits,8);r++){const o=this.standing(t.tg)[r%Math.max(1,this.shown(t.tg).alive)];if(o)for(let a=0;a<4;a++)this.effects.mote({x:o.x,y:.6,z:o.z,vx:(Math.random()-.5)*5,vy:Math.random()*4,vz:(Math.random()-.5)*5,size:.05,color:"#fff2b0",life:.3,g:12})}})}async walk(t,e,n){const s=this.views.get(t.u),r=this.gen,{path:o,L:a,speed:c,fly:l,smashes:h}=t;if(t.stomp&&Se.boom(.4),s.moving=!0,l)for(const m of s.models)m.flying=!0;const u=[];let d=0;for(let m=1;m<o.length;m++){const p=Bt(o[m].x-o[m-1].x,o[m].z-o[m-1].z);u.push({a:o[m-1],b:o[m],s:d,l:p}),d+=p}let f=0;const g=({ev:m})=>{n(m),this.effects.shake=Math.max(this.effects.shake,.08)},v=()=>this.gone(t.u,s,r);if(await we(a/c+.15,m=>{if(v())return;const p=Math.min(a,m*(a+c*.15)),x=u.find(_=>p<=_.s+_.l)||u[u.length-1],y=x.l>0?(p-x.s)/x.l:1;if(s.facing=Math.atan2(x.b.x-x.a.x,x.b.z-x.a.z),s.at={x:ln(x.a.x,x.b.x,y),z:ln(x.a.z,x.b.z,y)},this.disc(t.u),l)for(const _ of s.models)_.lift=Math.sin(Math.min(1,p/a)*Math.PI)*Math.min(3,a*.3);for(;f<h.length&&h[f].s<=p;)g(h[f++])},_c),!v()){for(;f<h.length;)g(h[f++]);if(s.at=null,this.disc(t.u),s.moving=!1,l)for(const m of s.models)m.flying=!1,m.lift=0;await En(.15)}}}class tb{constructor(t,{W:e,H:n,grid:s}){this.data=new Uint8Array(s.nx*s.nz*4);const r=this.tex=new Yx(this.data,s.nx,s.nz,an);r.magFilter=Xe,r.minFilter=Xe;const o=this.mesh=new Vt(new ci(e,n).rotateX(-Math.PI/2),new He({map:r,transparent:!0,depthWrite:!1,toneMapped:!1}));o.position.y=.035,o.renderOrder=2,o.visible=!1,t.add(o);const a=this.rangeRing=new Vt(new Oi(.985,1,96).rotateX(-Math.PI/2),new He({color:"#ffffff",transparent:!0,opacity:.6,depthWrite:!1,toneMapped:!1}));a.position.y=.04,a.visible=!1,t.add(a);const c=this.pathLine=new Rf(new xe,new Nc({color:"#ffffff",transparent:!0,opacity:.9,toneMapped:!1}));c.visible=!1,c.renderOrder=4,t.add(c);const l=this.ghost=new Vt(new Oi(.9,1,40).rotateX(-Math.PI/2),new He({color:"#ffffff",transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1}));l.position.y=.05,l.visible=!1,t.add(l)}reach(t,e){const n=t.u.flags.advanced,{u:s,res:r,mode:o,endForbid:a}=t,c=new Uint8Array(e.N);for(let l=0;l<e.N;l++)isFinite(r.dist[l])&&e.standable(l,s.r,o==="wreck"?"wreck":"walk",a)&&(c[l]=1);this.mask(c,t.fallback?[255,120,90]:n?[255,190,70]:[90,180,255],e)}mask(t,e,n,s=80){const r=this.data;r.fill(0);for(let o=0;o<n.N;o++){if(!t[o])continue;const a=o%n.nx,c=o/n.nx|0,l=a===0||c===0||a===n.nx-1||c===n.nz-1||!t[o-1]||!t[o+1]||!t[o-n.nx]||!t[o+n.nx],h=((n.nz-1-c)*n.nx+a)*4;r[h]=e[0],r[h+1]=e[1],r[h+2]=e[2],r[h+3]=l?210:n.diff[o]?Math.round(s*.7):s}this.tex.needsUpdate=!0,this.mesh.visible=!0}clear(){this.mesh.visible=!1,this.pathLine.visible=!1,this.rangeRing.visible=!1}range({x:t,z:e},n,s,r){const o=this.rangeRing;o.position.x=t,o.position.z=e,o.scale.setScalar(n+s),o.material.color.set(r),o.visible=!0}path(t){this.pathLine.geometry.setFromPoints(t.map(e=>new C(e.x,.08,e.z))),this.pathLine.visible=!0}ghostAt(t,e,n){const s=this.ghost;s.position.x=t.x(e),s.position.z=t.z(e),s.scale.setScalar(n),s.visible=!0}}const Au=900,Ru=700,Cu=260,hs=new se,Pu=new Tn,eb=new Ns,vo=new C,nb=new C,Lu=new qt;class Ya{constructor(t,e){this.mesh=t,this.max=e,this.items=[],this.free=[];for(let n=e-1;n>=0;n--)this.free.push(n);t.instanceMatrix.setUsage(Bp),t.frustumCulled=!1,hs.makeScale(0,0,0);for(let n=0;n<e;n++)t.setMatrixAt(n,hs),t.setColorAt(n,Lu.set(16777215))}spawn(t){if(!this.free.length){const e=this.items.shift();this.free.push(e.i)}t.i=this.free.pop(),this.mesh.setColorAt(t.i,Lu.set(t.color)),this.mesh.instanceColor.needsUpdate=!0,this.items.push(t)}update(t){const e=[];for(const n of this.items){if(n.age+=t,n.age>=n.life){hs.makeScale(0,0,0),this.mesh.setMatrixAt(n.i,hs),this.free.push(n.i);continue}n.vy-=n.g*t;const s=Math.exp(-n.drag*t);n.vx*=s,n.vz*=s,n.g<0&&(n.vy*=s),n.x+=n.vx*t,n.y+=n.vy*t,n.z+=n.vz*t,n.y<n.floor&&(n.y=n.floor,n.vy=-n.vy*n.bounce,n.vx*=.55,n.vz*=.55,n.spin*=.5),n.rx+=n.spin*t,n.ry+=n.spin*.7*t;const r=n.age/n.life,o=n.size*(n.grow?.4+r*n.grow:1)*(r>n.fadeAt?1-(r-n.fadeAt)/(1-n.fadeAt):1);Pu.setFromEuler(eb.set(n.rx,n.ry,0)),hs.compose(vo.set(n.x,n.y,n.z),Pu,nb.set(o*n.sx,o*n.sy,o*n.sz)),this.mesh.setMatrixAt(n.i,hs),e.push(n)}this.items=e,this.mesh.instanceMatrix.needsUpdate=!0}}function Ka(i){return{x:i.x,y:i.y,z:i.z,vx:i.vx||0,vy:i.vy||0,vz:i.vz||0,g:i.g??22,drag:i.drag??.6,bounce:i.bounce??.3,floor:i.floor??.04,size:i.size??.15,sx:i.sx??1,sy:i.sy??1,sz:i.sz??1,rx:Math.random()*6,ry:Math.random()*6,spin:i.spin??(Math.random()-.5)*18,age:0,life:i.life??1.5,fadeAt:i.fadeAt??.7,grow:i.grow||0,color:i.color}}function Du(i,t){const e=document.createElement("canvas");e.width=e.height=128;const n=e.getContext("2d"),s=n.createRadialGradient(64,64,4,64,64,62);s.addColorStop(0,i),s.addColorStop(.55,i),s.addColorStop(1,t),n.fillStyle=s,n.fillRect(0,0,128,128);for(let o=0;o<90;o++){const a=Math.random()*Math.PI*2,c=30+Math.random()*30;n.fillStyle=i,n.globalAlpha=Math.random()*.5,n.beginPath(),n.arc(64+Math.cos(a)*c,64+Math.sin(a)*c,2+Math.random()*6,0,Math.PI*2),n.fill()}const r=new Oc(e);return r.colorSpace=be,r}class ib{constructor(t,e,n){this.scene=t,this.camera=e,this.overlay=n,this.shake=0;const s=new er(new An(1,1,1),new xn({roughness:.85}),Au);s.castShadow=!0;const r=new er(new Cn(1,0),new He({toneMapped:!1}),Ru),o=new er(new Cn(1,1),new u_({transparent:!0,opacity:.55,depthWrite:!1}),Cu);t.add(s,r,o),this.cubes=new Ya(s,Au),this.glow=new Ya(r,Ru),this.puff=new Ya(o,Cu),this.lights=[];for(let a=0;a<3;a++){const c=new p_(16755285,0,14,1.6);c.position.set(0,-50,0),t.add(c),this.lights.push({l:c,until:0})}this.scorchTex=Du("rgba(20,14,8,0.85)","rgba(20,14,8,0)"),this.acidTex=Du("rgba(90,220,60,0.75)","rgba(40,120,20,0)"),this.decals=[],this.decalGeo=new Ni(1,28),this.decalGeo.rotateX(-Math.PI/2),this.texts=[],this.flashGeo=new nn(1,20,12),this.ringGeo=new Oi(.93,1,64),this.ringGeo.rotateX(-Math.PI/2),this.discGeo=new Ni(1,48),this.discGeo.rotateX(-Math.PI/2)}cube(t){this.cubes.spawn(Ka(t))}mote(t){this.glow.spawn(Ka({g:-1,drag:2.5,bounce:0,floor:-99,spin:0,...t}))}smoke(t){this.puff.spawn(Ka({g:-2.2,drag:1.8,bounce:0,floor:.1,spin:0,grow:2.2,fadeAt:.4,...t}))}debris(t,e,n,s,r,{from:o,power:a=7,size:c=.16}={}){for(let l=0;l<r;l++){let h=Math.random()-.5,u=Math.random()-.5;o&&(h+=(t-o.x)*.35,u+=(n-o.z)*.35);const d=Math.hypot(h,u)||1,f=a*(.4+Math.random()*.8);this.cube({x:t+(Math.random()-.5)*.4,y:e+Math.random()*.3,z:n+(Math.random()-.5)*.4,vx:h/d*f,vy:3+Math.random()*a,vz:u/d*f,size:c*(.5+Math.random()),sy:.6+Math.random()*.8,color:s[Math.random()*s.length|0],life:2.4+Math.random()*1.5,fadeAt:.75})}}leaves(t,e,n,s,r,o=1){for(let a=0;a<r;a++){const c=Math.random()*Math.PI*2,l=1+Math.random()*4*o;this.cube({x:t+Math.cos(c)*.5*o,y:e+Math.random()*o,z:n+Math.sin(c)*.5*o,vx:Math.cos(c)*l,vy:2+Math.random()*4,vz:Math.sin(c)*l,g:5,drag:2.4,size:.1+Math.random()*.08,sy:.25,spin:(Math.random()-.5)*10,color:s[Math.random()*s.length|0],life:1.6+Math.random()*1.6})}}flashLight(t,e,n,s,r,o){const a=this.lights.reduce((c,l)=>c.until<l.until?c:l);a.until=hn.time+o,a.l.color.set(s),a.l.position.set(t,e,n),we(o,c=>a.l.intensity=r*(1-c)*(1-c))}decal(t,e,n,s,r=.8){const o=new Vt(this.decalGeo,new He({map:s,transparent:!0,depthWrite:!1,opacity:r,polygonOffset:!0,polygonOffsetFactor:-2}));if(o.position.set(t,.015+this.decals.length*4e-4,e),o.rotation.y=Math.random()*6,o.scale.setScalar(n),o.renderOrder=1,this.scene.add(o),this.decals.push(o),this.decals.length>40){const a=this.decals.shift();this.scene.remove(a),a.material.dispose()}return o}clearDecals(){for(const t of this.decals)this.scene.remove(t),t.material.dispose();this.decals=[]}ring(t,e,n,s,{life:r=1.2,fill:o=.18,hold:a=!1}={}){const c=new kt,l=new Vt(this.ringGeo,new He({color:s,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1})),h=new Vt(this.discGeo,new He({color:s,transparent:!0,opacity:o,depthWrite:!1,toneMapped:!1}));c.add(l,h),c.position.set(t,.05,e),c.scale.setScalar(n),c.renderOrder=3,this.scene.add(c);const u=()=>{this.scene.remove(c),l.material.dispose(),h.material.dispose()};return a||we(r,d=>{l.material.opacity=.95*(1-d),h.material.opacity=o*(1-d)}).then(u),c.userData.remove=u,c}explode(t,e,n,s="fire"){const r={fire:{flash:16761963,glow:["#ffd36e","#ff8a2a","#ff5a1f","#fff2b0"],light:16751178,smoke:"#4a4038"},acid:{flash:10354538,glow:["#b8ff6a","#5be04a","#d8ff9a","#2fbf4a"],light:9109338,smoke:"#3f5a2a"},thorns:{flash:13172634,glow:["#9be36a","#e4ffb0","#5ab04a"],light:12255114,smoke:"#3a4a2a"},dust:{flash:16773328,glow:["#ffe9b0","#ffd080"],light:16769184,smoke:"#8a7a64"}}[s],o=new Vt(this.flashGeo,new He({color:r.flash,transparent:!0,opacity:.9,toneMapped:!1,depthWrite:!1}));o.position.set(t,.3,e),this.scene.add(o),we(.45,c=>{o.scale.setScalar(.2+n*.85*ys(c)),o.material.opacity=.9*(1-c)}).then(()=>{this.scene.remove(o),o.material.dispose()}),this.flashLight(t,1.5,e,r.light,9+n*6,.7);const a=Math.round(18+n*14);for(let c=0;c<a;c++){const l=Math.random()*Math.PI*2,h=(2+Math.random()*6)*(.6+n*.25);this.mote({x:t,y:.3,z:e,vx:Math.cos(l)*h,vy:2+Math.random()*6,vz:Math.sin(l)*h,g:9,drag:2.2,size:.07+Math.random()*.12,color:r.glow[c%r.glow.length],life:.5+Math.random()*.7})}for(let c=0;c<6+n*3;c++){const l=Math.random()*Math.PI*2,h=Math.random()*n*.6;this.smoke({x:t+Math.cos(l)*h,y:.3+Math.random()*.4,z:e+Math.sin(l)*h,vx:Math.cos(l)*1.2,vy:1+Math.random()*1.5,vz:Math.sin(l)*1.2,size:.25+Math.random()*.25*n,color:r.smoke,life:1.6+Math.random()*1.4})}this.debris(t,.1,e,["#5b4630","#6f8a3a","#4a3a28"],Math.round(6+n*4),{power:5+n,size:.1}),this.decal(t,e,n*.7,s==="acid"?this.acidTex:this.scorchTex,s==="acid"?.6:.45),this.shake=Math.max(this.shake,.05+n*.06)}async projectile(t,e,{mesh:n,arc:s=.25,speed:r=22,trail:o=null,spin:a=10}={}){const c=Math.hypot(e.x-t.x,e.z-t.z),l=c*s;this.scene.add(n);let h=0;await we(Math.max(.12,c/r),u=>{n.position.set(t.x+(e.x-t.x)*u,t.y+(e.y-t.y)*u+4*l*u*(1-u),t.z+(e.z-t.z)*u),n.rotation.x+=a*.016,n.rotation.z+=a*.011,o&&u-h>.03&&(h=u,o(n.position))}),this.scene.remove(n)}text(t,e,n="#ffffff",{size:s=18,life:r=1.3,rise:o=1.4}={}){const a=document.createElement("div");a.className="float-text",a.textContent=e,a.style.color=n,a.style.fontSize=s+"px",this.overlay.appendChild(a),this.texts.push({el:a,x:t.x,y:t.y,z:t.z,age:0,life:r,rise:o})}update(t){this.cubes.update(t),this.glow.update(t),this.puff.update(t),this.shake*=Math.exp(-t*6);const e=innerWidth,n=innerHeight;this.texts=this.texts.filter(s=>{if(s.age+=t,s.age>s.life)return s.el.remove(),!1;const r=s.age/s.life;return vo.set(s.x,s.y+s.rise*ys(r),s.z).project(this.camera),s.el.style.transform=`translate(${(vo.x*.5+.5)*e}px, ${(-vo.y*.5+.5)*n}px) translate(-50%, -50%) scale(${1+.3*(1-Math.min(1,r*5))})`,s.el.style.opacity=r>.6?1-(r-.6)/.4:1,!0})}}const sb=()=>({acorn:new nn(.07,6,5),dart:new Rn(.03,.3,4).rotateX(Math.PI/2),javelin:new Ye(.02,.02,.9,4).rotateX(Math.PI/2),spit:new Cn(.08,0),bomb:new nn(.11,8,6),pinecone:new Rn(.2,.42,7),acid:new nn(.24,12,8)}),Iu=new Map,Uu=i=>Iu.get(i)??Iu.set(i,new He({color:i,toneMapped:!1})).get(i);class rb{constructor({scene:t,fx:e,units:n}){this.scene=t,this.effects=e,this.units=n,this.projGeo=sb(),this.thorn=null,this.blastMarker=null,this.spikesOf=new Map}projectileStyle(t){const e=this.effects,n=this.projGeo;switch(t){case"acorn":return{mesh:new Vt(n.acorn,vt("#8a5a2a")),arc:.08,speed:28};case"dart":return{mesh:new Vt(n.dart,vt("#4a6a2a")),arc:.03,speed:34,spin:0};case"javelin":return{mesh:new Vt(n.javelin,vt("#8a6a3a")),arc:.18,speed:20,spin:0};case"spit":return{mesh:new Vt(n.spit,Uu("#9aff5a")),arc:.12,speed:18,trail:s=>e.mote({x:s.x,y:s.y,z:s.z,size:.04,color:"#7aef4a",life:.4,g:6})};case"bomb":return{mesh:new Vt(n.bomb,vt("#7a4a22")),arc:.45,speed:14,trail:s=>e.mote({x:s.x,y:s.y+.1,z:s.z,size:.05,color:"#ffb030",life:.3,g:-1})};case"pinecone":return{mesh:new Vt(n.pinecone,vt("#6b4a26",{emissive:"#ff5a10",emissiveIntensity:.6})),arc:.55,speed:18,trail:s=>{e.mote({x:s.x,y:s.y,z:s.z,size:.12,color:Math.random()<.5?"#ff8a2a":"#ffd36e",life:.4,g:-2}),e.smoke({x:s.x,y:s.y,z:s.z,size:.14,color:"#3a3430",life:.9})}};case"acid":return{mesh:new Vt(n.acid,Uu("#8aff5a")),arc:.5,speed:15,trail:s=>e.mote({x:s.x,y:s.y,z:s.z,size:.1,color:Math.random()<.5?"#5be04a":"#c8ff8a",life:.5,g:8})}}return{mesh:new Vt(n.acorn,vt("#888"))}}fly(t,e,n){return this.effects.projectile(t,e,this.projectileStyle(n))}async volley(t){const e=this.units,n=this.effects,s=e.unit(t.u),r=e.unit(t.tg),o=e.get(t.u),a=e.gen,c=()=>e.gone(t.u,o,a),l=e.standing(t.u),h=e.standing(t.tg),u=[],d=Math.min(10,t.n);for(let f=0;f<d;f++){const g=l[f%l.length],v=h[Math.random()*h.length|0],m={x:g.x,y:Yc(s)*.8+g.lift,z:g.z},p={x:v.x+(Math.random()-.5)*.6,y:Kc(r)*.8,z:v.z+(Math.random()-.5)*.6};u.push(En(f*.06).then(()=>{if(!c())return Se.shot(),this.fly(m,p,t.fx)}).then(()=>{if(!c())for(let x=0;x<5;x++)n.mote({x:p.x,y:p.y,z:p.z,vx:(Math.random()-.5)*4,vy:Math.random()*3,vz:(Math.random()-.5)*4,size:.05,color:t.fx==="spit"?"#9aff5a":"#ffe0a0",life:.35,g:10})}))}await Promise.all(u)}aimed(t){this.blastMarker=this.effects.ring(t.x,t.z,t.r,"#ffffff",{hold:!0,fill:.12})}async scattered(t){const e=this.blastMarker;this.effects.text({x:t.from.x,y:1.5,z:t.from.z},`scatter ${t.d}"`,"#ffd36e",{size:15}),await we(.35,n=>e==null?void 0:e.position.set(ln(t.from.x,t.to.x,n),.05,ln(t.from.z,t.to.z,n)),ys)}async fired(t){var r;const e=this.units,n=e.get(t.u),s=e.gen;await this.artilleryFire(t),!e.gone(t.u,n,s)&&((r=this.blastMarker)==null||r.userData.remove(),this.blastMarker=null)}async artilleryFire(t){const e=this.units,n=e.unit(t.u),s=e.get(t.u),r=e.gen,o=t.to,a=()=>e.gone(t.u,s,r),c=e.standing(t.u)[0],l=c.mesh.userData.anim;if(l!=null&&l.throwArm){const d=l.rest;if(Se.thwack(),we(.25,f=>l.throwArm.rotation.x=d-2.1*ys(f)).then(()=>we(.8,f=>l.throwArm.rotation.x=d-2.1*(1-f))),l.globe&&(l.globe.visible=!1),await En(.15),a())return}else c.lunge=1,c.lungeDir=Math.atan2(o.x-c.x,o.z-c.z);const h={x:c.x,y:n.t.big?1.8:.9,z:c.z},u={x:o.x,y:.15,z:o.z};Se.shot(),await this.fly(h,u,t.fx),!a()&&l!=null&&l.globe&&(l.globe.visible=!0)}landed(t){const e=this.effects;t.fx!=="thorns"&&(e.explode(t.x,t.z,t.r,t.fx==="acid"?"acid":"fire"),Se.boom(t.r/2)),e.ring(t.x,t.z,t.r,t.fx==="acid"?"#8aff5a":"#ff9a4a",{life:1.4,fill:.2})}cast(){Se.magic()}fizzled(t){Se.fizzle(),this.effects.text(this.units.top(t.u),"Fizzle…","#c8b8ff")}async thorns(t){const e=this.units,n=this.effects,s=e.get(t.u),r=e.gen,o=s.models[0].mesh.userData.anim.gem;if(o){const c=new C;o.getWorldPosition(c);for(let l=0;l<20;l++)n.mote({x:c.x,y:c.y,z:c.z,vx:(Math.random()-.5)*3,vy:Math.random()*3,vz:(Math.random()-.5)*3,size:.06,color:"#9aff7a",life:.8,g:-1})}const a=[];this.thorn??(this.thorn=new Rn(.12,1,5));for(let c=0;c<26;c++){const l=Math.random()*Math.PI*2,h=Math.sqrt(Math.random())*t.r,u=new Vt(this.thorn,vt(c%3?"#5a7a2a":"#7a5a2a"));u.position.set(t.x+Math.cos(l)*h,-.6,t.z+Math.sin(l)*h),u.rotation.set((Math.random()-.5)*.6,0,(Math.random()-.5)*.6),u.scale.set(1,.6+Math.random()*1.1,1),u.castShadow=!0,this.scene.add(u),a.push(u)}this.spikesOf.set(t.u,a),await we(.3,c=>a.forEach(l=>l.position.y=-.6+ys(c)*(.3+l.scale.y*.4))),!e.gone(t.u,s,r)&&n.explode(t.x,t.z,t.r,"thorns")}faded(t){const e=this.spikesOf.get(t.u)??[];this.spikesOf.delete(t.u),we(1.2,n=>e.forEach(s=>s.position.y-=.02*n)).then(()=>e.forEach(n=>this.scene.remove(n)))}async gaze(t){const e=this.units,n=this.effects,s=e.get(t.tg),r=e.gen,o=()=>e.gone(t.tg,s,r),a=e.top(t.u),c=e.top(t.tg),l=[];for(let u=0;u<=16;u++){const d=u/16;l.push(En(d*.3).then(()=>o()||n.mote({x:ln(a.x,c.x,d),y:ln(a.y,c.y,d)+Math.sin(d*Math.PI)*.8,z:ln(a.z,c.z,d),size:.09,color:"#c070ff",life:.7,g:0})))}if(await Promise.all(l),o())return;const h=e.shown(t.tg);for(let u=0;u<3;u++)n.ring(h.pos.x,h.pos.z,h.r*(.6+u*.35),"#c070ff",{life:1.2+u*.3,fill:.08})}mesmerized(t){this.effects.text(this.units.top(t.tg),"Mesmerized!","#e0a0ff",{size:20})}held(){return{marker:!!this.blastMarker,thorns:[...this.spikesOf.values()].reduce((t,e)=>t+e.length,0)}}clear(){var t;(t=this.blastMarker)==null||t.userData.remove(),this.blastMarker=null;for(const e of this.spikesOf.values())for(const n of e)this.scene.remove(n);this.spikesOf.clear()}}class ob{constructor({lowfi:t=!1,fast:e=!1,W:n,H:s,deploy:r,edges:o,objectives:a,range:c,colorOf:l}){this.fast=e,this.stage=new bM({lowfi:t,fast:e});const{renderer:h,scene:u}=this.stage;this.renderer=h,this.scene=u,this.rig=new LM(h),this.camera=this.rig.camera,this.controls=this.rig.controls,this.stage.light(),this.effects=new ib(u,this.camera,this.stage.overlay),this.table=new UM(u,h,{W:n,H:s,deploy:r,edges:o}),this.objectives=new FM(u,a,c,l),this.terrain=new Rd(u,this.effects)}figures({mirror:t,colorOf:e,W:n,H:s,grid:r}){this.units=new Pd({scene:this.scene,labels:this.stage.overlay,fx:this.effects,mirror:t,colorOf:e,W:n}),this.shots=new rb({scene:this.scene,fx:this.effects,units:this.units}),this.overlay=new tb(this.scene,{W:n,H:s,grid:r})}handlers({localSeats:t}){const{rig:e,units:n,shots:s,terrain:r}=this;return{pause:o=>En(Is.pause(o.s)),focus:(o,a)=>e.focus(o.x,o.z,{stage:a.stage,active:a.active,localSeats:t()}),"unit.place":o=>n.disc(o.u),"unit.formation":o=>{n.disc(o.u),n.label(o.u)},"unit.wound":o=>n.wounded(o),"unit.slain":(o,a)=>n.slain(o,a),"unit.flee":o=>n.fled(o),"unit.destroyed":(o,a)=>n.destroyed(o,a),"unit.face":o=>n.face(o),"unit.move":(o,a)=>n.walk(o,a,c=>{for(const l of c)r.apply(l,a)}),melee:o=>n.lunge(o),"charge.result":o=>n.shout(o),volley:o=>s.volley(o),"blast.aim":o=>s.aimed(o),"blast.scatter":o=>s.scattered(o),"blast.fire":o=>s.fired(o),"blast.land":o=>s.landed(o),"spell.cast":()=>s.cast(),"spell.fizzle":o=>s.fizzled(o),"spell.thorns":o=>s.thorns(o),"spell.fade":o=>s.faded(o),"spell.gaze":o=>s.gaze(o),"spell.mesmerized":o=>s.mesmerized(o),status:()=>n.labelAll(),objectives:()=>{},"terrain.clear":(o,a)=>r.apply(o,a),"terrain.add":(o,a)=>r.apply(o,a),"terrain.hurt":(o,a)=>r.apply(o,a),"terrain.destroy":(o,a)=>r.apply(o,a),"terrain.collapse":(o,a)=>r.apply(o,a),"terrain.rubble":(o,a)=>r.apply(o,a)}}rebuild(t,e,n={}){const{chunks:s=t.terrain.chunks,terrain:r=this.terrain,units:o=this.units,shots:a=this.shots,effects:c=this.effects}=n;r.sync(s),o.sync(t.units,l=>Bo(t,l)),a.clear(),c.clearDecals()}text(t,e,n){this.effects.text(t,e,n)}run({mirror:t,sel:e}){const{effects:n,units:s,objectives:r,camera:o}=this;this.stage.run({parts:(a,c)=>{n.update(a),s.animate(a,c,{fast:this.fast,camera:o,sel:e()}),r.animate(a,c,t().owners)},rig:this.rig,shake:()=>n.shake})}}class ab{constructor({camera:t,units:e,board:n,unitOf:s}){this.camera=t,this.units=e,this.board=n,this.unitOf=s,this.ray=new v_,this.ptr=new mt}pick(t){const{ray:e,ptr:n}=this;n.set(t.clientX/innerWidth*2-1,-(t.clientY/innerHeight)*2+1),e.setFromCamera(n,this.camera);const s=e.intersectObjects(this.units.pickables(),!1),r=s.length?this.unitOf(s[0].object.userData.id):null,o=e.intersectObject(this.board,!1)[0];return{unit:r,ground:o?o.point:null}}}const Nu=new WeakMap;function cb(i){var n;const t=(n=i.G)==null?void 0:n.pending;if((t==null?void 0:t.k)!=="chargeEnd")return null;let e=Nu.get(t);return e||(e=i.preview((s,r)=>{const o=s.units.find(l=>l.id===t.u),a=s.units.find(l=>l.id===t.tg),c=r.chargePlan(s,o,a);return{seat:t.seats[0],u:o,tg:a,rolled:t.rolled,cell:t.cell,plan:c,ok:r.chargeSpots(c,t.rolled)}}),Nu.set(t,e)),e}function Ou(i,t,e,n,s=2.4){let r=-1,o=s;for(let a=0;a<i.N;a++){if(!t[a])continue;const c=Bt(i.x(a)-e,i.z(a)-n);c<o&&(o=c,r=a)}return r}const lb=-1,hb=i=>({t:"chargeEnd",c:i});function ub(i,t,e,n){return i((s,r)=>{const o=r.freeSpot(s,t,e.x,e.z,n,s.units.filter(a=>a!==t));return o&&Math.hypot(o.x-e.x,o.z-e.z)<2.5?s.nav.index(o.x,o.z):-1})}const fb=(i,t)=>({t:"place",u:i.id,c:t}),db=(i,t)=>i((e,n)=>n.movePlan(e,t,t.flags.advanced?t.flags.advRoll:0)),pb=(i,t,e)=>i((n,s)=>s.nearestValid(n,t,e.x,e.z));function mb(i,t,e,n,s,r){const o=t.nearestValid(i,e,s.x,s.z);return o<0?"":(r(i.nav.path(e.res,o,n.r,e.mode==="fly"?null:e.forbid),o,n.r),`${e.res.dist[o].toFixed(1)}" of ${e.max}"`)}const gb=(i,t)=>({t:"move",u:i.id,c:t}),vb=i=>({t:"advance",u:i.id});class xb{constructor(t){this.el=t}hide(){this.el.style.display="none"}show(t,e){const n=this.el;n.innerHTML=t,n.style.display="block",n.style.left=e.x+16+"px",n.style.top=e.y+14+"px"}}function _b(i,t,e){const n=i.t.ranged;if(n.mesmerize)return`Mesmerize: cast ${n.spell}+ on 2D6 (${Math.round(zi(n.spell)*100)}%) · D3 mortal wounds`;const s=[];n.spell&&s.push(`Cast ${n.spell}+ (${Math.round(zi(n.spell)*100)}%)`);const r=As(i,n,!1),o=yr(n.S,t.t.T,n.poison),a=Mr(t.t.Sv,n.AP,e.cover);s.push(`${r} ${n.blast?`template${r>1?"s":""} (${n.blast}")`:"shots"} · hit ${n.spell?"auto":e.need+"+"} · wound ${o}+ · save ${a>6?"—":a+"+"}`);const c=[];if(c.push(`${e.range.toFixed(1)}"`),e.cover&&c.push("cover"),e.visible?e.seen<e.total&&c.push(`${e.seen}/${e.total} visible`):c.push("unseen (indirect −1)"),n.heavy&&i.flags.moved&&c.push("moved (heavy −1)"),!n.blast){const l=Ao(r,e.need,n,t,e.cover);c.push(`≈${l.kills.toFixed(1)} slain`)}return s.push(c.join(" · ")),s.join("<br>")}function yb(i,t,e,n){const s=t.shotInfo(i,e,n);return s.ok?_b(e,n,s):`✖ ${s.why}`}const Mb=(i,t)=>({t:"shoot",u:i.id,tg:t.id});function bb(i,t,e,n){if(!t.chargeTargets(i,e).includes(n))return`✖ out of charge range (${t.gap(e,n).toFixed(1)}")`;const s=t.chargePlan(i,e,n);return s?`Charge: need ${s.need}" on 2D6 — ${Math.round(zi(s.need)*100)}%`:"✖ no route"}const Sb=(i,t)=>({t:"charge",u:i.id,tg:t.id});class wb{constructor({flow:t,view:e,card:n,tooltip:s,picker:r}){this.flow=t,this.view=e,this.card=n,this.tooltip=s,this.picker=r,this.sel=null,this.reach=null,this.hover=null,this.hoverPick=null,this.mouse=null,this.pickShown=null,this.downAt=null}get session(){return this.flow.session}get G(){return this.flow.G}localSeat(){return this.session?this.session.decisionFor():-1}localDecision(){return this.localSeat()>=0?this.G.pending:null}mode(){return this.flow.player.idle&&this.localSeat()>=0?this.G.pending.k:"watch"}deploySeat(){var t;return((t=this.localDecision())==null?void 0:t.k)==="deploy"?this.localSeat():-1}myTurn(){return this.mode()==="phase"}picking(){return this.mode()==="chargeEnd"?cb(this.session):null}ask(t){return this.session.preview(t)}state(){return{idle:this.flow.player.idle,decision:this.localDecision(),mode:this.mode(),deploy:this.deploySeat(),sel:this.sel,pick:this.picking(),hover:this.hover}}send(t,e){const n=this.session,s=n?n.legal(t,e):"no battle";return s||(n.submit(t,e),this.flow.refreshUI(),null)}moveTo(t,e){return this.view.overlay.clear(),this.send(this.localSeat(),gb(t,e))}advance(t){return this.send(this.localSeat(),vb(t))}shoot(t,e){return this.send(this.localSeat(),Mb(t,e))}charge(t,e){return this.send(this.localSeat(),Sb(t,e))}placeCharge(t){const e=this.picking();return e?t>=0&&e.ok[t]?this.endCharge(e,t):`cell ${t} is no spot the roll reaches`:"no charge to end"}takeShortest(){const t=this.picking();return t?this.endCharge(t,lb):"no charge to end"}endCharge(t,e){const n=this.view.overlay;return this.pickShown=null,n.clear(),n.ghost.visible=!1,this.tooltip.hide(),this.send(t.seat,hb(e))}end(){if(this.deploySeat()>=0){const t=this.send(this.deploySeat(),{t:"deployed"});return t||(this.sel=null,this.card.show(null),this.flow.refreshUI()),t}return this.myTurn()?(this.select(null),this.send(this.localSeat(),{t:"end"})):"no phase of a seat played here to end now"}auto(){return this.myTurn()?(this.select(null),this.send(this.localSeat(),{t:"auto"})):"no phase of a seat played here to play out now"}advanceSel(){const t=this.sel;return!t||!this.myTurn()?"no unit of a seat played here to advance now":this.advance(t)}idled(){const t=this.view.overlay;this.sel&&this.myTurn()&&this.select(this.ask((n,s)=>s.canAct(n,this.sel))?this.sel:null);const e=this.picking();e&&this.pickShown!==e&&(this.pickShown=e,t.rangeRing.visible=!1,t.mask(e.ok,[255,150,60],this.G.nav,150),t.ghostAt(this.G.nav,e.cell,e.u.r))}listen(t){t.addEventListener("pointerdown",e=>{Xo(),this.downAt={x:e.clientX,y:e.clientY,b:e.button}}),t.addEventListener("pointerup",e=>{if(!this.downAt||e.button!==0)return;const n=Math.hypot(e.clientX-this.downAt.x,e.clientY-this.downAt.y);this.downAt=null,!(n>6)&&this.click(this.picker.pick(e))}),t.addEventListener("pointerleave",()=>{this.hoverPick=null,this.hover=null,this.pointed(),this.flow.refreshRings()}),t.addEventListener("pointermove",e=>{this.mouse={x:e.clientX,y:e.clientY},this.hoverPick=this.picker.pick(e),this.pointed()}),addEventListener("keydown",e=>{e.target.tagName!=="INPUT"&&e.key==="Escape"&&!this.picking()&&this.select(null)})}click({unit:t,ground:e}){if(this.tooltip.hide(),this.deploySeat()>=0)return this.deployClick(t,e);const n=this.picking();if(n){if(e){const o=Ou(this.G.nav,n.ok,e.x,e.z);o>=0&&this.placeCharge(o)}return}if(!this.myTurn()){t&&this.card.show(t);return}const s=this.sel,r=$n(this.G);if(t&&t.side===this.localSeat()){this.ask((o,a)=>a.canAct(o,t))?(Se.click(),this.select(t)):this.card.show(t);return}if(r==="move"&&s&&e){const o=pb(a=>this.ask(a),this.reach,e);o>=0&&this.moveTo(s,o);return}if(r==="shoot"&&s&&t&&t.side!==s.side)return void this.shoot(s,t);if(r==="charge"&&s&&t&&t.side!==s.side)return void this.charge(s,t);t?this.card.show(t):e&&this.select(null)}deployClick(t,e){const n=this.deploySeat();if(n<0)return"no seat deploying here";if(t&&t.side===n)return Se.click(),this.sel=t,this.card.show(t),this.flow.refreshRings(),null;if(this.sel&&e){const s=this.sel,r=ub(o=>this.ask(o),s,e,n);if(r>=0){const o=this.send(n,fb(s,r));return o||(Se.click(),this.view.units.labelAll()),o}}return null}select(t){const e=this.G,n=this.view.overlay;if(this.sel=t,this.reach=null,n.clear(),t&&e){const s=$n(e);e.turn.stage==="battle"&&s==="move"&&!t.flags.moved&&(this.reach=db(r=>this.ask(r),t),n.reach(this.reach,e.nav)),s==="shoot"&&t.t.ranged&&this.showRange(t,t.t.ranged.range),s==="charge"&&this.showRange(t,xr)}this.card.show(t),this.flow.refreshUI()}showRange(t,e){this.view.overlay.range(t.pos,t.r,e,$n(this.G)==="charge"?"#ffb070":"#ffffff")}pointed(){const t=this.view.overlay,e=this.G;this.tooltip.hide(),t.pathLine.visible=!1,t.ghost.visible=!1;const n=this.hoverPick,s=this.picking();if(!n){s&&t.ghostAt(e.nav,s.cell,s.u.r);return}this.hover=n.unit;let r="";const o=this.sel,a=(c,l,h)=>{t.path(c),t.ghostAt(e.nav,l,h)};if(s&&n.ground){const c=Ou(e.nav,s.ok,n.ground.x,n.ground.z);c>=0?(a(this.ask(l=>l.nav.path(s.plan.res,c,s.u.r,s.plan.mode==="fly"?null:s.plan.forbid)),c,s.u.r),r=`End charge here · ${s.plan.res.dist[c].toFixed(1)}" of ${s.rolled}"`):r="✖ out of reach — pick a spot in the orange area"}else this.myTurn()&&o&&(r=this.ask((c,l)=>{const h=l.phaseKey(c);return h==="move"&&this.reach&&n.ground&&!n.unit?mb(c,l,this.reach,o,n.ground,a):h==="shoot"&&n.unit&&n.unit.side!==o.side?yb(c,l,o,n.unit):h==="charge"&&n.unit&&n.unit.side!==o.side?bb(c,l,o,n.unit):""}));if(!r&&n.unit){const c=this.view.units.shown(n.unit.id);r=`${n.unit.t.name} · ${n.unit.t.models>1?`${c.alive}/${n.unit.t.models} models`:`${c.models[0].w}/${n.unit.t.W} wounds`}`}r&&this.mouse&&this.tooltip.show(r,this.mouse)}}const Ld=i=>i.length===2&&i[0].race===i[1].race;function zu(i){const t=Ld(i);return Object.freeze(i.map(({seat:e,race:n})=>{const s=Sn[n];return Object.freeze({name:s.name,short:s.short,icon:s.icon,color:t&&e===1?s.look.alt:s.look.team,dark:s.look.dark})}))}const xo=i=>i.map((t,e)=>({seat:e,race:t}));let ro=null;const Fu=i=>`rgba(${[1,3,5].map(t=>parseInt(i.slice(t,t+2),16)).join(", ")}, 0.45)`;function Eb(i){const t=e=>document.querySelector(e);ro||(ro=document.createElement("style"),document.body.appendChild(ro)),ro.textContent=`#hud, #labels, #log, #card { --s0: ${i[0].color}; --s1: ${i[1].color}; --s0-glow: ${Fu(i[0].color)}; --s1-glow: ${Fu(i[1].color)}; }`;for(const e of[0,1]){const n=e?"#sideB":"#sideA";t(`${n} .ic`).textContent=i[e].icon,t(`${n} .nm`).textContent=i[e].name}}const Tb=(i,t,e)=>e>=0&&Ld(i)?t[e].color:"",Ab={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};function Rb(i,t){const e=document.createElement("div");e.className=`die ${t}`;for(let n=0;n<9;n++){const s=document.createElement("i");Ab[i].includes(n)&&(s.className="on"),e.appendChild(s)}return e}class Cb{constructor(t){this.el=t}clear(t){this.el.innerHTML="";const e=document.createElement("div");e.className="tray-title",e.textContent=t,this.el.appendChild(e),this.el.classList.add("show")}hide(){this.el.classList.remove("show")}async row(t,e,n,{sum:s=!1,pass:r,note:o="",save:a=!1}={}){Se.dice(e.length);const c=document.createElement("div");c.className="tray-row";const l=document.createElement("span");l.className="lbl",l.textContent=t,c.appendChild(l);const h=document.createElement("span");h.className="dice",c.appendChild(h),e.slice(0,30).forEach((f,g)=>{const v=n?f>=n?a?"saved":"ok":"fail":r===!1?"fail":r?"ok":"plain",m=Rb(f,v);m.style.animationDelay=`${g*.025/hn.speed}s`,h.appendChild(m)});const d=document.createElement("span");if(d.className="res",n){const f=Gn(e,n);d.textContent=a?`${f} saved`:`${f} ✓`,e.length>30&&(d.textContent+=` (of ${e.length})`)}else s&&(d.textContent=o||`= ${e.reduce((f,g)=>f+g,0)}`,r===!0&&d.classList.add("good"),r===!1&&d.classList.add("bad"));for(c.appendChild(d),this.el.appendChild(c);this.el.children.length>7;)this.el.children[1].remove();await En(Is.dice(e.length))}}class Pb{constructor(t,e=()=>null){this.list=t,this.listener=e}write(t,e,n,s){const r=this.list,o=document.createElement("div");o.className=`entry s${t} ${n}`,o.innerHTML=e;const a=this.listener();for(a&&(a.reach(s),o.dataset.at=s),r.prepend(o);r.children.length>80;)r.lastChild.remove()}clear(){this.list.innerHTML=""}}const Dd=Object.fromEntries(Ts.map(i=>[i.key,i.name])),[Lb]=Ts.map(i=>i.key),Db=i=>({phaseShown:i.stage==="battle",buttonsUp:!1});function Ib({G:i,mirror:t,session:e,input:n,hud:s}){var E;const{idle:r,decision:o,deploy:a,sel:c,pick:l}=n,{phaseShown:h,sides:u}=s,d=i.setup.rounds,f=N=>e.preview(N),g=(e==null?void 0:e.G)??null,v=(o==null?void 0:o.k)==="deploy",m=h&&(o==null?void 0:o.k)==="phase"&&t.stage==="battle"&&t.active===o.seats[0]&&t.phase===o.phase&&t.round===g.turn.round,p=h&&(o==null?void 0:o.k)==="chargeEnd"&&t.stage==="battle"&&t.active===o.seats[0]&&t.phase==="charge"&&t.round===g.turn.round,x=!m&&!p?!1:r?!0:s.buttonsUp,y=x&&!l,_={show:v||y,label:v?"Begin battle ▸":m?`End ${Dd[o.phase]} ▸`:null,busy:!r,ready:m&&r?!f((N,M)=>M.anyCanAct(N,o.seats[0])):!1},R={show:m?r?o.phase==="move"&&!!c&&!c.flags.moved&&!c.flags.advanced&&!f((N,M)=>M.isEngaged(N,c)):null:!1,label:c?c.t.chargeAfterAdvance?'Advance (+D6") — can still charge':`Advance (+D6") — no ${(E=c.t.ranged)!=null&&E.assault?"charge":"shooting or charge"} after`:null,busy:!r};let S=s.hint;return l?S=`Charge! Rolled ${l.rolled}" — click the orange area to place ${l.u.t.short}, or take the shortest move.`:v?S="Deployment — click one of your units, then click inside your shaded zone to move it there.":g&&h&&t.stage==="battle"&&g.seats[t.active].ctrl!=="human"?S=`${u[t.active].name} (AI) are taking their turn…`:m&&(r||!c)?S={move:c?f((N,M)=>M.isEngaged(N,c))?"Engaged — click inside the red area to fall back (no shooting or charging after).":"Click inside the shaded area to move. Difficult ground costs double.":"Movement — pick a unit with a white ring to move it.",shoot:c?"Click an enemy unit to shoot it. Hover for odds.":"Shooting — pick a unit with a white ring to fire.",charge:c?'Click an enemy within 12" to declare a charge, then roll 2D6.':"Charge — pick a unit to charge with."}[o.phase]||"":m||(S=""),{vp:[t.vp[0],t.vp[1]],round:t.stage==="deploy"?"Deployment":`Round ${Math.min(t.round,d)} / ${d}`,phase:t.stage==="battle"?t.phase:null,active:t.stage==="battle"?t.active:-1,end:_,auto:{show:y,busy:!r},advance:R,shortest:{show:!!l},zones:[0,1].map(N=>t.stage==="battle"||t.stage==="over"?.05:N===a?.2:.07),hint:S,rings:Id({session:e,input:n}),buttonsUp:x}}function Id({session:i,input:t}){const{mode:e,deploy:n,pick:s,sel:r,hover:o}=t,a=e!=="phase"?new Map:i.preview((c,l)=>{const h=l.phaseKey(c),u=new Map;for(const d of c.units)!l.alive(d)||d===r||(l.canAct(c,d)?u.set(d.id,["#ffffff",.75]):r&&h==="shoot"&&d.side!==r.side&&l.shotInfo(c,r,d).ok?u.set(d.id,["#ff5a4a",.95]):r&&h==="charge"&&d.side!==r.side&&l.chargeTargets(c,r).includes(d)&&u.set(d.id,["#ffa040",.95]));return u});return c=>c.id===(r==null?void 0:r.id)?["#ffe680",1]:n>=0&&c.u.side===n?["#ffffff",.5]:s&&c.id===s.tg.id?["#ffa040",.95]:a.has(c.id)?a.get(c.id):c.id===(o==null?void 0:o.id)?["#ffffff",.35]:["#ffffff",0]}const Ud=(i,t)=>({side:t.side,moved:!!t.flags.moved,fellBack:!!t.flags.fellBack,advanced:!!t.flags.advanced,advRoll:t.flags.advRoll,shot:!!t.flags.shot,charged:!!t.flags.charged,cover:$o(i,t)});function Ja(i){const t={};for(const e of i.units)t[e.id]=Ud(i,e);return t}function Ub(i,t){if(t.phase!==Lb)return i;const e={};for(const[n,s]of Object.entries(i))e[n]=s.side===t.side?{...s,moved:!1,fellBack:!1,advanced:!1,advRoll:void 0,shot:!1,charged:!1}:s;return e}function Nb(i,t,e){const n=[];e.moved&&n.push(e.fellBack?"fell back":e.advanced?`advanced +${e.advRoll}"`:"moved"),e.shot&&n.push("shot"),e.charged&&n.push("charged"),t.mesmerized&&n.push("🌀 mesmerized"),t.alive>0&&t.engaged&&n.push("⚔ in combat"),t.alive>0&&e.cover&&n.push("🛡 in cover");const s=i.models>1?`${t.alive}/${i.models} models`:`${t.models[0].w}/${i.W} wounds`;return`${t.alive>0?s:"destroyed"}${n.length?" · "+n.join(" · "):""}`}function Ob(i){const t=i.turn;return{win:t.result.win,why:t.result.why,vp:[...t.vp],rounds:t.step==="rolloff"?0:t.round}}const ku=["M","WS","BS","S","T","W","A","Ld","Sv","OC"];class zb{constructor({el:t,sides:e,shown:n,live:s,ask:r,facts:o}){this.el=t,this.sides=e,this.shown=n,this.live=s,this.ask=r,this.facts=o,this.unit=null}get open(){return this.el.classList.contains("show")}show(t){var c;const e=this.el;if(this.unit=t,!t){e.classList.remove("show");return}const n=t.t,s=l=>l==="M"?`${n.M}"`:["WS","BS","Sv"].includes(l)?`${n[l]}+`:n[l],r=(l,h)=>{if(!l)return"";if(l.mesmerize)return`<div class="wpn"><span>${h} ${l.name}</span><em>spell ${l.spell}+ · ${l.range}" · D3 mortal + mesmerize</em></div>`;const u=[];return l.range&&u.push(`${l.range}"`),l.spell&&u.push(`spell ${l.spell}+`),l.blast?u.push(`blast ${l.blast}" ×${l.shots}`):l.shots&&u.push(`A${l.shots}`),u.push(`S${l.S}`,`AP-${l.AP}`,`D${l.D}`),l.poison&&u.push(`poison ${l.poison}+`),l.indirect&&u.push("indirect"),l.heavy&&u.push("heavy"),l.assault&&u.push("assault"),`<div class="wpn"><span>${h} ${l.name}</span><em>${u.join(" · ")}</em></div>`},o=this.shown(t),a=this.live()?this.ask(l=>Ud(l,t)):this.facts()[t.id];e.innerHTML=`
    <div class="card-head s${t.side}"><b>${n.name}</b><span>${this.sides()[t.side].short} · ${n.role}</span></div>
    <div class="card-sub">${Nb(n,o,a)}</div>
    <table class="stats"><tr>${ku.map(l=>`<th>${l}</th>`).join("")}</tr><tr>${ku.map(l=>`<td>${s(l)}</td>`).join("")}</tr></table>
    ${r(n.ranged,(c=n.ranged)!=null&&c.spell?"✦":"➹")}${r({...n.melee,range:0},"⚔")}
    <ul class="abil">${(n.abilities||[]).map(l=>`<li>${l}</li>`).join("")}</ul>`,e.classList.add("show")}}class Fb{constructor(t){this.el=t}async show(t,e,n,s){const r=this.el;r.innerHTML=`<div class="b1">${t}</div><div class="b2">${e}</div>`,r.querySelector(".b1").style.color=n,r.classList.remove("show"),r.offsetWidth,r.classList.add("show"),await En(s)}}const ze=i=>document.querySelector(i);class kb{render(t){ze("#vp0").textContent=t.vp[0],ze("#vp1").textContent=t.vp[1],ze("#round").textContent=t.round,document.querySelectorAll("#phases .ph").forEach(e=>{e.classList.toggle("on",e.dataset.k===t.phase)}),ze("#sideA").classList.toggle("active",t.active===0),ze("#sideB").classList.toggle("active",t.active===1),ze("#hint").textContent=t.hint,ze("#hint").style.display=t.hint?"":"none"}wire({rig:t}){const e=[1,2,4];ze("#speed").onclick=()=>{hn.speed=e[(e.indexOf(hn.speed)+1)%e.length],ze("#speed").textContent=`⏩ ${hn.speed}×`},ze("#follow").onclick=()=>{t.follow=!t.follow,ze("#follow").classList.toggle("off",!t.follow)},ze("#mute").textContent=BM()?"🔇":"🔊",ze("#mute").onclick=()=>{Xo(),ze("#mute").textContent=kM()?"🔇":"🔊"},ze("#logToggle").onclick=()=>ze("#log").classList.toggle("collapsed")}}const Qn=i=>document.querySelector(i);class Bb{render(t){const e=Qn("#endPhase"),n=Qn("#autoPhase"),s=Qn("#advance");e.style.display=t.end.show?"":"none",n.style.display=t.auto.show?"":"none",Qn("#closestSpot").style.display=t.shortest.show?"":"none",t.end.label!==null&&(e.textContent=t.end.label),e.disabled=t.end.busy,n.disabled=t.auto.busy,s.disabled=t.advance.busy,t.advance.show!==null&&(s.style.display=t.advance.show?"":"none"),t.advance.label!==null&&(s.textContent=t.advance.label)}wire(t){Qn("#endPhase").onclick=()=>(Xo(),Se.click(),t.end()),Qn("#closestSpot").onclick=()=>(Se.click(),t.takeShortest()),Qn("#autoPhase").onclick=()=>t.auto(),Qn("#advance").onclick=()=>t.advanceSel()}}const Mn=i=>document.querySelector(i);class Hb{note(t){const e=document.createElement("p");e.className="small",e.textContent=t,Mn("#title .modes").before(e)}hide(){Mn("#title").classList.add("hidden"),document.body.classList.add("playing"),innerWidth<700&&Mn("#log").classList.add("collapsed")}show(){Mn("#title").classList.remove("hidden"),document.body.classList.remove("playing")}wire({S:t,showTable:e,start:n}){Mn("#seed").value=t.seed,Mn("#reroll").onclick=()=>{t.seed=Math.random()*1e6|0,Mn("#seed").value=t.seed,e(t.seed)},Mn("#seed").onchange=()=>{const s=(Number(Mn("#seed").value)||1)>>>0;e(s),t.seed=s,Mn("#seed").value=s},document.querySelectorAll("[data-mode]").forEach(s=>{s.onclick=()=>{Xo(),Se.click(),n(s.dataset.mode)}})}}const us=i=>document.querySelector(i);class Vb{get up(){return!us("#over").classList.contains("hidden")}show({win:t,why:e,vp:n,rounds:s},r,o){const a=t<0?"A bloody draw":`${r[t].name} win!`,c=s?`in round ${s}`:"in the deployment",l=e==="wipe"?`${r[1-t].name} have been wiped from the table ${c}.`:e==="concede"?`${r[1-t].name} conceded ${c}.`:`Final score ${n[0]} – ${n[1]} after ${s} round${s===1?"":"s"}.`,h=us("#overTitle");h.textContent=`${t>=0?r[t].icon+" ":""}${a}`,h.style.color=o,us("#overWhy").textContent=l,us("#over").classList.remove("hidden"),Se.fanfare()}hide(){us("#over").classList.add("hidden")}wire(t){us("#again").onclick=t}}const oo=i=>document.querySelector(i);function Wb(){oo("#helpBtn").onclick=()=>oo("#help").classList.remove("hidden"),oo("#helpClose").onclick=()=>oo("#help").classList.add("hidden")}const bc=Object.freeze(["id","s","d","p","h"]),Bu=1024,Nd=64,Hu=Object.freeze({open:Object.freeze({commit:"string"}),start:Object.freeze({core:"int",rules:"string",setup:"object",a:"string?"}),desync:Object.freeze({at:"string",mine:"string"})}),Sc=i=>Number.isSafeInteger(i),cr=i=>typeof i=="string"&&i.length>0&&i.length<=Nd,Zc=i=>!!i&&typeof i=="object"&&!Array.isArray(i),Gb=Object.freeze({int:Sc,string:i=>typeof i=="string",object:Zc}),$b=(i,t,e)=>`${i}.${t.toString(36)}.${e}`,jb=(i,t)=>({...i,...t}),wc=i=>Rs(i),Vu=i=>Object.fromEntries(Object.entries(i).filter(([t])=>!bc.includes(t)));function Xb(i){if(!Zc(i))return"not an object";if(!cr(i.id))return"no id";if(!Sc(i.s)||i.s<-1)return"no seat";if(!cr(i.d))return"no device";for(const e of["p","h"])if(Object.hasOwn(i,e)&&!cr(i[e]))return`${e} is not a name`;const t=typeof i.t=="string"&&Object.hasOwn(Hu,i.t)?Hu[i.t]:null;if(t){if(i.s===-1!=(i.t!=="desync"))return`${i.t} for seat ${i.s}`;for(const e of Object.keys(i))if(e!=="t"&&!bc.includes(e)&&!Object.hasOwn(t,e))return`${i.t} takes no field "${e}"`;for(const[e,n]of Object.entries(t)){const s=n[n.length-1]==="?",r=n.replace("?","");if(Object.hasOwn(i,e)?!Gb[r](i[e]):!s)return`${i.t} takes a ${r} ${e}`}return null}if(!Ky.includes(i.t))return`no kind ${JSON.stringify(i.t)}`;if(i.s<0)return`${i.t} for seat ${i.s}`;for(const e of Object.keys(i))if(!(e==="t"||bc.includes(e))&&!Sc(i[e])&&typeof i[e]!="boolean")return`${i.t}'s ${e} is not a whole number`;return null}function qb(i){let t=0;for(let e=0;e<i.length;e++){const n=i.charCodeAt(e);n<128?t+=1:n<2048?t+=2:n>=55296&&n<56320&&(i.charCodeAt(e+1)&64512)===56320?(t+=4,e++):t+=3}return t}function Od(i){if(i&&typeof i=="object"&&!Object.isFrozen(i)){Object.freeze(i);for(const t of Object.values(i))Od(t)}return i}function zd(i){if(typeof i!="string")return{bad:"not text",id:null};if(qb(i)>Bu)return{bad:`over ${Bu} bytes`,id:null};let t;try{t=JSON.parse(i)}catch{return{bad:"not JSON",id:null}}const e=Zc(t)&&cr(t.id)?t.id:null,n=Xb(t);if(n)return{bad:n,id:e};let s;try{s=Rs(t)}catch{return{bad:"not canonical JSON",id:e}}return s!==i?{bad:"not canonical JSON",id:e}:Od(t)}const Ec=Object.freeze(["deploy","roundLimit"]),Yb=Object.freeze(["concede","desync"]),Wu=5e3,Gu=i=>{const t=i.turn;return`${t.stage}/${t.step}/${t.round}/${t.t}/${t.ph}/${t.overtime}`},Kb=({id:i,heads:t,seats:e})=>Gc(JSON.stringify(e.map(n=>t[n]??i))).toString(36),$u=(i,t)=>i===t||!!i&&!!t&&i.id===t.id&&JSON.stringify(i)===JSON.stringify(t);class Qc{constructor({out:t=null,onTrace:e=null,strict:n=!1}={}){this.opts={out:t,onTrace:e,strict:n},this.G=null,this.status="lobby",this.accepted=[],this.rejected=[],this.error=null,this.report=null,this.pushed=[],this.seen=new Set,this.openBy=null,this.last=null,this.simul=null,this.syncing=!1,this.busy=!1}head(t){return this.simul?this.simul.heads[t]??this.simul.id:this.last}get count(){return this.pushed.length}push(t){if(this.busy)throw new Error("Folder.push is not reentrant: it was called while an entry was being folded or its events handed on");this.busy=!0;try{this.judge(t)}finally{this.busy=!1}}judge(t){if(this.pushed.push(t),this.pushed.length>Wu)return(this.status==="lobby"||this.status==="live")&&this.halt("full",{at:t.id??null,why:`the log ran past ${Wu} entries`}),this.inert(t);if(t.bad)return this.reject(t,`envelope: ${t.bad}`);if(this.seen.has(t.id))return this.reject(t,"envelope: an id seen before");if(this.seen.add(t.id),this.status==="lobby")return t.t==="open"&&this.openBy===null?(this.openBy=t.d,this.accept(t)):t.t==="start"&&(this.openBy===null||t.d===this.openBy)?this.begin(t):(t.t==="start"&&(this.error=`the log was opened by device ${this.openBy}: only its start counts`),this.inert(t));if(this.status==="over"){if(t.t==="desync")return this.outOfBand(t);const a=this.G.setup.seats[t.s];if(t.h!==void 0&&t.p===this.last&&t.t!=="concede"&&(a==null?void 0:a.ctrl)==="human"&&t.d===a.dev&&t.h!==go(this.G))return this.freeze(t)}if(this.status!=="live")return this.inert(t);if(t.t==="open"||t.t==="start")return this.reject(t,`turn: the match has begun, so no ${t.t}`);if(Yb.includes(t.t))return this.outOfBand(t);const e=this.G,n=e.pending;if(!n.seats.includes(t.s))return this.reject(t,`turn: seat ${t.s} has no decision to make`);if(t.d!==e.setup.seats[t.s].dev)return this.reject(t,`device: seat ${t.s} is not played from ${t.d}`);if(t.p!==this.head(t.s))return this.reject(t,`stale: seat ${t.s}'s head is ${this.head(t.s)}, not ${t.p}`);if(!Ec.includes(n.k)&&t.h!==go(e))return this.freeze(t);const s=Vu(t),r=gc(e,t.s,s);if(r)return this.reject(t,`illegal: ${r}`);const o=Gu(e);return pu(e,t.s,s),this.accept(t,n,o)}begin(t){if(t.core!==mo||t.rules!==po)return this.error=`this battle was made with another version of the game (core ${t.core}, rules ${t.rules}; this is core ${mo}, rules ${po})`,this.reject(t,`skew: ${this.error}`),this.halt("skew",{at:t.id,why:this.error});const e=Array.isArray(t.setup.seats)?t.setup.seats:[],n=e.findIndex(s=>(s==null?void 0:s.ctrl)==="human"&&!cr(s.dev));if(n>=0){const s=e[n].dev;return this.error=typeof s=="string"&&s?`seat ${n} names a device no entry can carry (${s.length} characters; at most ${Nd})`:`seat ${n} is a human seat that names no device`,this.reject(t,`start: ${this.error}`)}try{this.G=yd(t.setup,{out:this.opts.out,onTrace:this.opts.onTrace,strict:this.opts.strict})}catch(s){return this.error=s.message,this.reject(t,`start: ${s.message}`)}return this.error=null,this.status="live",this.accept(t)}outOfBand(t){const e=this.G,n=e.setup.seats[t.s];if(!n||n.ctrl!=="human")return this.reject(t,`seat: ${t.t} from seat ${t.s}, which no human plays`);if(t.d!==n.dev)return this.reject(t,`device: seat ${t.s} is not played from ${t.d}`);if(t.t==="desync"){const o=this.pushed.find(a=>a.id===t.at&&!a.bad);return this.accept(t),this.halt("desync",{at:t.at,theirs:t.mine,mine:(o==null?void 0:o.h)??null,by:t.id,seat:t.s})}const s=Vu(t),r=gc(e,t.s,s);return r?this.reject(t,`illegal: ${r}`):(pu(e,t.s,s),this.accept(t))}freeze(t){return this.halt("desync",{at:t.id,theirs:t.h??null,mine:go(this.G),by:"hash",seat:t.s})}halt(t,e){this.status=t;const n=this.G;this.report={status:t,...e,core:mo,rules:po,count:this.pushed.length,setup:(n==null?void 0:n.setup)??null,entries:this.pushed.slice(),accepted:this.accepted.slice(),rejected:this.rejected.map(s=>({...s})),trace:n?n.journal.trace.slice(-50):[],state:n?xd(n):null}}accept(t,e=null,n=null){this.accepted.push(t.id),this.last=t.id;const s=this.G,r=s==null?void 0:s.pending,o=this.simul,a=!!r&&Ec.includes(r.k);o&&a&&(e==null?void 0:e.k)===r.k&&Gu(s)===n?o.heads[t.s]=t.id:(o&&(e&&(o.heads[t.s]=t.id),this.last=Kb(o)),this.simul=a?{id:this.last,seats:[...r.seats],heads:{}}:null),s&&s.turn.stage==="over"&&this.status==="live"&&(this.status="over")}reject(t,e){this.rejected.push({id:t.id??null,why:e})}inert(t){this.reject(t,this.status==="lobby"?"inert: the match has not started":`inert: the match is ${this.status}`)}step(t,e,n){var o;const s=this.accepted.length;if(this.push(t),this.accepted.length===s||!((o=this.G)!=null&&o.out))return;const r=this.G.out.splice(0);if(e.push(...r),!!n){this.busy=!0;try{n(r,t)}finally{this.busy=!1}}}sync(t,e=null){if(this.syncing)throw new Error("Folder.sync is not reentrant: it was called again while it handed on an entry's events");this.syncing=!0;try{return this.fold(t,e)}finally{this.syncing=!1}}refoldFrom(){return{next:new Qc({...this.opts,out:null,onTrace:null}),from:0}}fold(t,e){const n=[];if(this.status==="tamper")return{events:n,reset:!1,undone:0};const s=t.length,r=this.pushed.length;let o=s>=r;for(let _=0;o&&_<r;_++)o=$u(t[_],this.pushed[_]);if(o){for(let _=r;_<s;_++)this.step(t[_],n,e);return{events:n,reset:!1,undone:0}}const a=(_,R)=>{const S=new Map;for(let E=0;E<R;E++)!_[E].bad&&!S.has(_[E].id)&&S.set(_[E].id,{e:_[E],i:E});return S},c=a(t,s),l=a(this.pushed,r),h=this.accepted.filter(_=>!c.has(_)||!$u(c.get(_).e,l.get(_).e)),u=this.accepted.filter((_,R)=>{var S,E;return R>0&&((S=c.get(_))==null?void 0:S.i)<((E=c.get(this.accepted[R-1]))==null?void 0:E.i)});if(h.length||u.length)return this.halt("tamper",h.length?{at:h[0],gone:h}:{at:u[0],moved:u}),{events:n,reset:!1,undone:0};const d=this.accepted,{next:f,from:g}=this.refoldFrom();let v=!1,m=!1;const p=()=>{v=!0,f.G&&Object.assign(f.G,{out:this.opts.out?[]:null,onTrace:this.opts.onTrace}),Object.assign(this,{...f,opts:this.opts,syncing:!0})};d.length||p();for(let _=g;_<s;_++){const R=t[_];if(v){this.step(R,n,e);continue}const S=f.accepted.length;f.push(R),!(m||f.accepted.length===S)&&(f.accepted[S]!==d[S]?m=!0:S+1===d.length&&p())}const x=!v;x&&p();const y=new Set(this.accepted);return{events:n,reset:x,undone:x?d.filter(_=>!y.has(_)).length:0}}}class Jb{constructor({store:t,localSeats:e=[],dev:n="local",rand:s=()=>"0",sink:r=null,onTrace:o=null,strict:a=!1}){if(!Number.isInteger(t.length))throw new Error("a MatchStore tells its length (match/store.js)");this.store=t,this.localSeats=Object.freeze([...e]),this.dev=n,this.rand=s,this.sink=r,this.folder=new Qc({out:[],onTrace:o,strict:a}),this.told=null,this.unsent=null,this.n=t.length,this.folding=!1,this.again=!1,this.dirty=!1,this.shown=this.folder.status,this.queue=[],this.off=t.subscribe(()=>this.onChange()),this.onChange()}get G(){return this.folder.G}get status(){return this.folder.status}get error(){return this.unsent??this.folder.error}get report(){return this.folder.report}get accepted(){return this.folder.accepted}get rejected(){return this.folder.rejected}get count(){return this.folder.count}decisionFor(){var e;const t=(e=this.G)==null?void 0:e.pending;return(t==null?void 0:t.seats.find(n=>this.localSeats.includes(n)))??-1}preview(t){if(!this.G)throw new Error("no match to preview: the store has no start yet");return mr(this.G,t)}legal(t,e){var n;return this.status!=="live"?`the match is ${this.status}`:this.localSeats.includes(t)?((n=this.G.setup.seats[t])==null?void 0:n.dev)!==this.dev?`seat ${t} is played from another device`:(e==null?void 0:e.t)!=="concede"&&!mM(this.G).includes(t)?`seat ${t} has no decision to make now`:gc(this.G,t,e):`seat ${t} is not played on this device`}submit(t,e){!this.folding&&this.queue.length&&this.onChange();const n=this.legal(t,e);if(n)throw new Error(`seat ${t} can't send ${JSON.stringify(e)}: ${n}`);if(this.folding){this.queue.push({seat:t,body:{...e}});return}const s=this.send(t,e);if(s)throw new Error(`seat ${t} can't send ${JSON.stringify(e)}: its entry would be refused (${s})`)}send(t,e){const n=this.G.pending,s=e.t==="concede";return this.append(e,{s:t,p:s?void 0:this.folder.head(t),h:s||Ec.includes(n.k)?void 0:go(this.G)})}start(t,{a:e}={}){if(this.status!=="lobby")throw new Error(`the match has started already (${this.status})`);if(this.folding){this.queue.push({seat:-1,body:{t:"start",setup:t,a:e}});return}this.begin(t,e)}begin(t,e){this.unsent=null,this.unsent=this.append({t:"start",core:mo,rules:po,setup:t,a:e},{s:-1,p:this.folder.head(-1)??void 0})}append(t,e){const n=jb(t,{id:$b(this.dev,this.n,this.rand()),d:this.dev,...e});let s;try{s=wc(n)}catch(o){return o.message}const r=zd(s);return r.bad?r.bad:(this.n++,this.store.append(s),null)}drain(){const{seat:t,body:e}=this.queue.shift();if(t===-1&&e.t==="start"){this.status!=="lobby"?this.call(()=>{var s,r;return(r=(s=this.sink)==null?void 0:s.dropped)==null?void 0:r.call(s,t,e,`the match has started already (${this.status})`,this)}):this.begin(e.setup,e.a);return}const n=this.legal(t,e)??this.send(t,e);n&&this.call(()=>{var s,r;return(r=(s=this.sink)==null?void 0:s.dropped)==null?void 0:r.call(s,t,e,n,this)})}call(t){try{t()}catch(e){return this.failed??(this.failed=e),!1}return!0}onChange(){if(this.folding){this.again=!0;return}this.folding=!0,this.again=!0,this.failed=null;try{for(;;)if(this.again)this.call(()=>this.pass())||(this.dirty=!0);else if(this.status!==this.shown)this.shown=this.status,this.call(()=>{var e,n;return(n=(e=this.sink)==null?void 0:e.status)==null?void 0:n.call(e,this.status,this)});else if(!this.tell())if(this.queue.length)this.drain();else if(this.dirty)this.dirty=!1,this.call(()=>{var e,n;return(n=(e=this.sink)==null?void 0:e.settled)==null?void 0:n.call(e,this)});else break}finally{this.folding=!1}const t=this.failed;if(this.failed=null,t)throw t}pass(){this.again=!1;const t=this.folder.count,{reset:e,undone:n}=this.folder.sync(this.store.entries(),s=>this.call(()=>{var r,o;return(o=(r=this.sink)==null?void 0:r.events)==null?void 0:o.call(r,s,this)}));e&&this.G&&this.call(()=>{var s,r;return(r=(s=this.sink)==null?void 0:s.reset)==null?void 0:r.call(s,this.G,this,{undone:n})}),(e||this.folder.count!==t)&&(this.dirty=!0),this.status!=="lobby"&&(this.unsent=null)}tell(){const t=this.folder.report;if(this.status!=="desync"||(t==null?void 0:t.by)!=="hash"||this.told===t.at)return!1;const e=this.localSeats.find(n=>{var s;return((s=this.G.setup.seats[n])==null?void 0:s.dev)===this.dev});return e===void 0?!1:(this.told=t.at,this.append({t:"desync",at:t.at,mine:t.mine},{s:e}),!0)}close(){this.off()}}class Zb{constructor(t=[]){this.kind="local",this.log=t.map(e=>typeof e=="string"?e:wc(e)),this.decoded=[],this.subs=new Set}get length(){return this.log.length}entries(){for(let t=this.decoded.length;t<this.log.length;t++)this.decoded.push(zd(this.log[t]));return this.decoded}append(t){this.log.push(typeof t=="string"?t:wc(t));for(const e of[...this.subs])e()}subscribe(t){return this.subs.add(t),()=>this.subs.delete(t)}export(){return JSON.stringify(this.log)}}class Qb{constructor({handlers:t,view:e=null,mirror:n=null,onIdle:s=null}){this.handlers={fallback:(r,o)=>this.fallback(r,o),...t},this.view=e,this.mirror=n,this.onIdle=s,this.observer=null,this.q=[],this.running=!1,this.table=0}get idle(){return!this.running&&!this.q.length}push(t){for(const e of t)this.q.push(e);this.running||this.run()}snap(t,e=_s(t)){var n,s,r,o;this.table++,this.q.length=0,this.running=!1,this.mirror=e,(n=this.view)==null||n.rebuild(t,e),(r=(s=this.observer)==null?void 0:s.reset)==null||r.call(s,e),(o=this.onIdle)==null||o.call(this,{snap:!0,G:t})}run(){var e,n,s;const t=this.table;this.running=!0;try{for(;this.q.length;){const r=this.q.shift();this.mirror=Md(this.mirror,r),(n=(e=this.observer)==null?void 0:e.event)==null||n.call(e,r,this.mirror);const o=(this.handlers[r.t]??this.handlers.fallback)(r,this.mirror);if(o&&typeof o.then=="function"){o.then(()=>t===this.table&&this.run(),a=>t===this.table&&this.fail(a));return}}}catch(r){return this.fail(r)}this.running=!1,(s=this.onIdle)==null||s.call(this)}fallback(t,e){var s,r;const n=t.u!==void 0&&e.units[t.u]?e.units[t.u].pos:{x:t.x??0,z:t.z??0};return t.text&&((r=(s=this.view)==null?void 0:s.text)==null||r.call(s,{x:n.x,y:1.6,z:n.z},t.text,"#ffffff")),En(t.beat??Is.beat)}fail(t){throw this.running=!1,this.q.length=0,t}}const Za={bushtail:["human","ai"],serpent:["ai","human"],hotseat:["human","human"],watch:["ai","ai"]},ju="local",Po=i=>{const t=_d(i);return{board:t.board,terrain:t.terrain,races:t.seats.map(e=>e.race)}},tS=(i,t)=>JSON.stringify(Po(i))===JSON.stringify(Po(t)),Xu=i=>({..._s(i),stage:"title"});class eS{constructor({view:t,ui:e,params:n,seed:s,races:r}){this.view=t,this.ui=e,this.params=n,this.races=r,this.S={seed:s,control:["human","ai"]},this.session=null,this.G=null,this.backdrop=null,this.backdropAsDrawn=!0,this.traceListener=null,this.checkHook=null,this.sides=zu(xo(r)),this.hud={phaseShown:!1,buttonsUp:!1,hint:""},this.shownHud=null,this.facts={},this.acted=[],this.onTrace=(o,a)=>{var c;/^act /.test(o)&&this.acted.push(mr(a,Ja)),(c=this.traceListener)==null||c.line(o,a)},this.sink={events:(o,a)=>{this.G!==a.G&&(this.G=a.G,this.sameUnits(this.G));const c=this.acted.splice(0);o=o.map(l=>l.t==="act"?{...l,facts:c.shift()}:l.t==="pending"?{...l,facts:a.preview(Ja)}:l),this.traceListener&&(o=this.traceListener.present(o,this.G)),this.player.push(o)},reset:(o,a)=>{this.G=a.G,this.sameUnits(this.G),this.acted.length=0,this.player.snap(o,_s(o))}},this.human=null,this.player=null}play(t){const{view:e,ui:n}=this;this.human=t;const s={...e.handlers({localSeats:()=>{var r;return((r=this.session)==null?void 0:r.localSeats)??[]}}),log:r=>n.log.write(r.side,r.html,r.cls,r.at),"tray.open":r=>n.tray.clear(r.title),dice:r=>n.tray.row(r.label,r.dice,r.need,r),act:r=>{r.facts&&(this.facts=r.facts)},pending:r=>{r.facts&&(this.facts=r.facts)},stage:r=>this.staged(r),"phase.start":r=>this.phaseBegun(r),"round.scored":r=>this.scored(r),"game.over":r=>this.over(r),check:r=>{var o;return(o=this.checkHook)==null?void 0:o.call(this,r)}};return this.player=new Qb({handlers:s,view:e,onIdle:r=>this.idled(r)}),this.player}atTable(){return this.G??this.backdrop}unitById(t){return this.atTable().units.find(e=>e.id===t)}local(t){var e;return!!((e=this.session)!=null&&e.localSeats.includes(t))}ink(t){return Tb(this.atTable().seats,this.sides,t)}seatPlayers(t){this.sides=zu(t),Eb(this.sides),this.view.table.paint(this.sides.map(e=>e.color))}staged(t){this.hud.phaseShown=!1,t.stage!=="deploy"&&this.human.select(null),this.refreshUI()}phaseBegun(t){this.facts=Ub(this.facts,t),this.hud.phaseShown=!0,this.human.select(null),this.ui.tray.hide(),this.refreshUI();const e=this.player.mirror;return this.ui.banner.show(`${this.sides[t.side].icon} ${this.sides[t.side].name}`,Dd[t.phase],this.ink(t.side),Is.phaseStart(this.local(e.active),e.stage))}scored(t){t.owners.forEach((n,s)=>{const r=Cs.classic.objectives[s];n>=0&&this.view.effects.ring(r.x,r.z,zo,this.sides[n].color,{life:1.6,fill:.15})}),this.refreshUI();const e=this.player.mirror;return this.ui.banner.show(`End of round ${t.round}`,`VP ${t.vp[0]} – ${t.vp[1]}`,this.ink(-1),Is.phaseStart(this.local(e.active),e.stage))}over(t){this.human.select(null),this.refreshUI(),this.ui.result.show(t,this.sides,this.ink(t.win))}idled({snap:t=!1,G:e=null}={}){const n=this.traceListener,s=this.ui.card;n==null||n.idle(),t&&this.snapped(e);const r=!t&&s.unit&&this.unitById(s.unit.id);r&&r.t===s.unit.t&&r.side===s.unit.side&&s.open&&s.show(r),this.human.idled(),this.refreshUI(),n==null||n.settled()}snapped(t){const e=this.player.mirror,n=this.view.overlay,s=this.human;Object.assign(this.hud,Db(e)),s.sel=(s.sel&&t.units.find(r=>r.id===s.sel.id))??null,s.reach=null,s.hover=s.hoverPick=null,s.pickShown=null,n.clear(),n.ghost.visible=!1,this.facts=mr(t,Ja),e.stage==="over"&&!this.ui.result.up&&this.over(Ob(t))}refreshUI(){const{ui:t,view:e}=this,n=Ib({G:this.atTable(),mirror:this.player.mirror,session:this.session,input:this.human.state(),hud:{...this.hud,sides:this.sides}});this.hud.buttonsUp=n.buttonsUp,this.hud.hint=n.hint,this.shownHud=n,t.hud.render(n),t.actions.render(n),e.table.zones(n.zones),e.units.paintRings(n.rings)}refreshRings(){this.view.units.paintRings(this.rings())}rings(){return Id({session:this.session,input:this.human.state()})}sameUnits(t){const e=this.view.units,n=r=>!e.get(r.id)||e.unit(r.id).t!==r.t||e.unit(r.id).side!==r.side,s=t.units.find(n);if(s||t.units.length!==e.views.size)throw new Error(`the battle's units are not the table's (${s?`unit ${s.id}, ${s.key} of seat ${s.side}`:`${t.units.length} units, ${e.views.size} figures`}): a battle starts on its own table (start())`)}showTable(t,{terrain:e="classic",races:n=this.races}={}){var c;const{view:s,ui:r,human:o}=this,a=yd({board:t,dice:0,terrain:e,seats:n.map(l=>({race:l,ctrl:"human"}))},{out:null});(c=this.session)==null||c.close(),this.session=null,this.G=null,this.backdrop=a,this.backdropAsDrawn=!0,this.seatPlayers(xo(n)),s.units.dispose(),s.terrain.dispose(),o.sel=null,o.reach=null,s.overlay.clear(),r.log.clear(),r.tray.hide(),s.terrain.sync(a.terrain.chunks),s.table.scatterTufts(),this.player.snap(a,Xu(a)),s.objectives.reset(),this.refreshUI()}start(t){var l;const{view:e,ui:n,human:s}=this;if(!Object.hasOwn(Za,t))throw new Error(`no mode "${t}" (there are ${Object.keys(Za).join(", ")})`);const r=Za[t];this.session&&this.showTable(this.S.seed);const o=(Number(this.params.get("dice"))||Math.random()*1e9|0)>>>0,a={board:this.S.seed,dice:o,terrain:"classic",rounds:Cs.classic.rounds,diceMode:"shared",seats:this.races.map((h,u)=>r[u]==="human"?{race:h,ctrl:r[u],dev:ju}:{race:h,ctrl:r[u]})};(!this.backdropAsDrawn||!tS(this.backdrop.setup,a))&&this.showTable(a.board,Po(a)),this.S.control=[...r],s.sel=null,s.reach=null,this.seatPlayers(xo(a.seats.map(h=>h.race))),(l=this.traceListener)==null||l.begin(),this.acted.length=0,this.player.snap(this.backdrop,Xu(this.backdrop));const c=new Zb;if(this.session=new Jb({store:c,localSeats:r.flatMap((h,u)=>h==="human"?[u]:[]),dev:ju,sink:this.sink,onTrace:this.onTrace}),this.session.start(a),this.session.status!=="live"&&this.session.status!=="over"){const h=this.session.error;throw this.session.close(),this.session=null,this.showTable(this.backdrop.setup.board,Po(this.backdrop.setup)),new Error(`the battle could not start: ${h}`)}n.title.hide(),e.rig.goTo(EM({localSeats:this.session.localSeats,edges:[0,1].map(h=>Bo(this.session.G,h)),aspect:innerWidth/innerHeight})),this.refreshUI()}back(){this.ui.result.hide(),this.ui.title.show(),this.view.rig.toTitle(),this.showTable(this.S.seed)}}const{W:ao,H:Qa}=Xn,ti=i=>document.querySelector(i);function nS(i,t){if(!i.has("races"))return Zh;const e=i.get("races").split(",").map(s=>s.trim().toLowerCase());if(e.length===2&&e.every(s=>Sn[s]))return e;const n=`?races= takes two of ${Object.keys(Sn).join(", ")}, comma-separated, not "${i.get("races")}"`;return console.warn(`${n}: playing the classic matchup`),t.note(`${n}, so this is the classic matchup.`),Zh}function iS(i){const t=new URLSearchParams(i.search),e=t.has("fast");let n=null;const s=f=>n.sides[f].color,r=new ob({lowfi:t.has("lowfi"),fast:e,W:ao,H:Qa,deploy:Cs.classic.deploy,edges:Jf,objectives:Cs.classic.objectives,range:zo,colorOf:s}),o=(Number(t.get("seed"))||Math.random()*1e6|0)>>>0,a=new Hb,c=nS(t,a),l={tray:new Cb(ti("#tray")),log:new Pb(ti("#logList"),()=>n.traceListener),card:new zb({el:ti("#card"),sides:()=>n.sides,shown:f=>r.units.shown(f.id),live:()=>n.player.idle,ask:f=>mr(n.atTable(),f),facts:()=>n.facts}),tooltip:new xb(ti("#tooltip")),banner:new Fb(ti("#banner")),hud:new kb,actions:new Bb,title:a,result:new Vb};n=new eS({view:r,ui:l,params:t,seed:o,races:c}),n.seatPlayers(xo(c)),r.figures({mirror:()=>n.player.mirror,colorOf:s,W:ao,H:Qa,grid:Vf(ao,Qa,Zf)});const h=new ab({camera:r.camera,units:r.units,board:r.table.board,unitOf:f=>n.unitById(f)}),u=new wb({flow:n,view:r,card:l.card,tooltip:l.tooltip,picker:h}),d=n.play(u);if(u.listen(r.renderer.domElement),l.actions.wire(u),l.hud.wire({rig:r.rig}),Wb(),a.wire({S:n.S,showTable:f=>n.showTable(f),start:f=>n.start(f)}),l.result.wire(()=>n.back()),n.showTable(n.S.seed),r.run({mirror:()=>d.mirror,sel:()=>{var f;return(f=u.sel)==null?void 0:f.id}}),t.has("watch")&&n.start("watch"),t.has("debug")){const{alive:f,isEngaged:g,phaseKey:v,canAct:m,movePlan:p,validEnd:x,freeSpot:y,shotInfo:_,shootTargets:R,chargeTargets:S,chargePlan:E,rngState:N}=ld,{rig:M,scene:w,camera:B,controls:W,renderer:nt,effects:U,units:k,terrain:$,shots:tt}=r,q=()=>n.atTable(),Y=new Set(["stage","round","active","first","phase","vp","wiped"]),K=new Set(["titleSpin","titleAngle","viewShift","follow"]),ot=new Set(["sel","reach","hover","hoverPick","mouse"]),at={busy:()=>!d.idle,auto:()=>!d.idle,deploySide:()=>u.deploySeat()<0?void 0:u.deploySeat()},j=[],Z=[];let dt=null;const wt=()=>d.idle&&!Z.length,St=L=>{if(dt)return dt.turn[L];const D=q(),X=D.turn;return L==="stage"?n.G?X.stage==="over"&&!wt()?"battle":X.stage:"title":L==="wiped"?X.wiped<0?void 0:X.wiped:L==="phase"?v(D):X[L]},Nt=new Proxy(n.S,{get:(L,D)=>Y.has(D)?St(D):Object.hasOwn(at,D)?at[D]():K.has(D)?M[D]:ot.has(D)?u[D]:L[D],has:(L,D)=>Y.has(D)||Object.hasOwn(at,D)||K.has(D)||ot.has(D)||D in L,set:(L,D,X)=>{if(Y.has(D))throw new Error(`__ts.S.${D} is the match's ${D==="phase"?"G.turn.ph (phaseKey)":`G.turn.${D}`}: it can't be set through S`);if(Object.hasOwn(at,D))throw new Error(`__ts.S.${D} is derived from the Session and the player: it can't be set`);return K.has(D)?M[D]=X:ot.has(D)?u[D]=X:L[D]=X,!0},ownKeys:L=>[...new Set([...Reflect.ownKeys(L),...ot,...Y,...Object.keys(at),...K])],getOwnPropertyDescriptor:(L,D)=>Y.has(D)?{value:St(D),enumerable:!0,configurable:!0,writable:!1}:Object.hasOwn(at,D)?{value:at[D](),enumerable:!0,configurable:!0,writable:!1}:K.has(D)?{value:M[D],enumerable:!0,configurable:!0,writable:!0}:ot.has(D)?{value:u[D],enumerable:!0,configurable:!0,writable:!0}:Reflect.getOwnPropertyDescriptor(L,D)}),Ot=L=>{var D;return!!((D=L.out)!=null&&D.length)||!d.idle},Dt=(L,D)=>{const X=L.turn,et=/^over /.test(D)&&X.step==="score";return{turn:{stage:X.stage,round:et?X.round+1:X.round,active:X.active,phase:v(L),first:X.first,vp:[...X.vp],wiped:X.wiped<0?void 0:X.wiped},rng:N(L.rng),units:L.units.map(Q=>({...Q,pos:{...Q.pos},flags:{...Q.flags},models:Q.models.map(ut=>({...ut}))})),chunks:L.terrain.chunks.map(Q=>({id:Q.id,kind:Q.kind,alive:Q.alive,hp:Q.hp,shape:{...Q.shape}}))}},jt=(L,D)=>{dt=D;try{j.push(L)}finally{dt=null}},z=[],de=[],bt=(L=()=>!0)=>new Promise(D=>{de.push({until:L,resolve:D}),n.traceListener.settled()});n.traceListener={begin:()=>{j.length=0,Z.length=0,z.length=0;for(const L of de.splice(0))L.resolve()},line:(L,D)=>{const X=/^log /.test(L)?null:Dt(D,L);/^(act|phase|over) /.test(L)&&z.push({at:D.out.length,proj:_s(D),act:/^act /.test(L)}),Z.length||Ot(D)?Z.push([L,X]):jt(L,X)},reach:L=>{for(;j.length<L&&Z.length;)jt(...Z.shift())},idle:()=>{for(;Z.length;)jt(...Z.shift())},settled:()=>{if(d.idle)for(const L of de.splice(0)){let D=!0;try{D=L.until()}catch{}D?L.resolve():de.push(L)}},present:(L,D)=>{const X=[],et=z.filter(ut=>ut.act).map(ut=>ut.proj);let Q=0;for(L.forEach((ut,Ct)=>{for(;Q<z.length&&z[Q].at<=Ct;)X.push({t:"check",proj:z[Q++].proj});X.push(ut.t==="act"?{...ut,proj:et.shift()}:ut)});Q<z.length;)X.push({t:"check",proj:z[Q++].proj});return X.push({t:"check",proj:_s(D)}),z.length=0,X}};const Rt=(L,D)=>{if(L)throw new Error(`?debug ${D}: ${L}`)},xt=L=>mr(q(),L),oe=()=>{const L=new Af,D=new Proxy({},{get:()=>()=>{}}),X={M:null},et=new Pd({scene:L,labels:document.createElement("div"),fx:D,mirror:()=>X.M,colorOf:ut=>n.sides[ut].color,W:ao}),Q={clear(){},held:()=>({marker:!1,thorns:0})};return{at:X,units:et,terrain:new Rd(L,D),shots:Q,effects:D}},Ht=(L,D,X)=>{L.at.M=X??_s(D);const et=X?D.terrain.chunks.filter(Q=>X.chunks[Q.id]).map(Q=>({...Q,alive:X.chunks[Q.id].alive,shape:{...Q.shape,y:X.chunks[Q.id].y}})):D.terrain.chunks;return r.rebuild(D,L.at.M,{chunks:et,terrain:L.terrain,units:L.units,shots:L.shots,effects:L.effects}),L.units.paintRings(n.rings()),L},A=(L,D,X,et)=>({units:et.units.map(Q=>{const ut=L.get(Q.id);if(!ut)return{id:Q.id,view:null};const Ct=ut.ring,J=ut.hit;return{id:Q.id,ring:Ct.visible?{x:Ct.position.x,z:Ct.position.z,s:Ct.scale.x,op:Ct.material.opacity,col:Ct.material.color.getHexString()}:null,hit:J.visible&&J.parent?{x:J.position.x,y:J.position.y,z:J.position.z,sx:J.scale.x,sy:J.scale.y}:null,figures:ut.models.map(Zt=>{var Wt;return(Wt=Zt.mesh)!=null&&Wt.parent?{x:Zt.mesh.position.x,y:Zt.mesh.position.y,z:Zt.mesh.position.z}:null}),label:{html:ut.label.innerHTML,display:ut.label.style.display||""}}}),chunks:et.terrain.chunks.map(Q=>({id:Q.id,...D.state(Q.id)})),shots:X.held()}),b=(L,D,X,et)=>{if(typeof L=="number"&&typeof D=="number")Math.abs(L-D)<=1e-6||et.push(`${X}: ${L} | ${D}`);else if(L&&D&&typeof L=="object"&&typeof D=="object"){const Q=[...new Set([...Object.keys(L),...Object.keys(D)])];for(const ut of Q)b(L[ut],D[ut],`${X}.${ut}`,et)}else L!==D&&et.push(`${X}: ${JSON.stringify(L)} | ${JSON.stringify(D)}`);return et};let F=null;const rt=(L=null)=>{const D=q();if(!L&&!d.idle)throw new Error("?debug view.snapDiff: the player is still playing");const X=A(k,$,tt,D),et=Ht(oe(),D,L);F=Ht(F??oe(),D,L);const Q=[...b(X,A(et.units,et.terrain,et.shots,D),"fresh",[]),...b(X,A(F.units,F.terrain,F.shots,D),"kept",[])];return et.units.dispose(),et.terrain.dispose(),{diffs:Q.slice(0,12),n:Q.length,units:X.units.length,figures:X.units.reduce((ut,Ct)=>{var J;return ut+(((J=Ct.figures)==null?void 0:J.filter(Boolean).length)??0)},0),chunks:X.chunks.length,shown:X.chunks.filter(ut=>ut.shown).length}};window.__ts={S:Nt,clock:hn,camera:B,controls:W,renderer:nt,trace:j,get G(){return n.G},get session(){return n.session},get hud(){return n.shownHud},get player(){return d},present:{listen(L){d.observer=L},card(L){var D;return l.card.show(L),((D=/class="card-sub">([^<]*)</.exec(ti("#card").innerHTML))==null?void 0:D[1])??null}},get units(){return dt?dt.units:q().units},get nav(){return q().nav},scenery:{get chunks(){return dt?dt.chunks:q().terrain.chunks},scene:w,blast(L,D,X,et,Q){if(n.G)throw new Error("?debug scenery.blast: only on the title screen (no battle)");const ut=[],Ct=n.backdrop.terrain.blast(L,D,X,et,Q,ut);return n.backdropAsDrawn=!1,d.push(ut),Hi(n.backdrop),Ct}},validEnd:(L,D)=>xt(X=>x(X,L,D)),get phaseResolve(){return u.myTurn()||null},get chargePick(){const L=u.picking();return L&&{u:L.u,plan:L.plan,ok:L.ok}},start:L=>n.start(L),select:L=>u.select(L),doMove:(L,D)=>(Rt(u.moveTo(L,D),"doMove"),bt()),doAdvance:L=>(Rt(u.advance(L),"doAdvance"),bt()),doShoot:(L,D)=>(Rt(u.shoot(L,D),"doShoot"),bt()),doCharge:(L,D)=>{Rt(u.charge(L,D),"doCharge");const X=n.session;return bt(()=>{var et;return X!==n.session||((et=X.G.pending)==null?void 0:et.k)!=="chargeEnd"})},placeCharge:L=>(Rt(u.placeCharge(L),"placeCharge"),bt()),deployClick:(L,D)=>Rt(u.deployClick(L,D),"deployClick"),endPhase:()=>(Rt(ti("#endPhase").onclick(),"endPhase"),bt()),autoPhase:()=>(Rt(ti("#autoPhase").onclick(),"autoPhase"),bt()),q:{alive:f,isEngaged:L=>xt(D=>g(D,L)),canAct:L=>xt(D=>m(D,L)),movePlan:(L,D)=>xt(X=>p(X,L,D)),freeSpot:(L,D,X,et,Q)=>xt(ut=>y(ut,L,D,X,et,Q)),shootTargets:L=>xt(D=>R(D,L)),shotInfo:(L,D)=>xt(X=>_(X,L,D)),chargeTargets:L=>xt(D=>S(D,L)),chargePlan:(L,D)=>xt(X=>E(X,L,D)),rngState:()=>dt?dt.rng:N(q().rng)},screen(L,D,X){const et=new C(L,D,X).project(B);return[(et.x*.5+.5)*innerWidth,(-et.y*.5+.5)*innerHeight]},view:{snapDiff:rt,pauseAtChecks(L){n.checkHook=L},counts:()=>{let L=0;return w.traverse(D=>D.userData.fig&&L++),{scene:w.children.length,terrain:$.group.children.length,figures:L,labels:r.stage.overlay.children.length,marks:U.decals.length}}}}}}iS(location);
