(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const oa="160",Ci={ROTATE:0,DOLLY:1,PAN:2},Li={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Iu=0,wa=1,Nu=2,Rc=1,Cc=2,In=3,ni=0,He=1,on=2,Kn=0,ir=1,Aa=2,Ra=3,Ca=4,Ou=5,pi=100,Fu=101,zu=102,La=103,Pa=104,Bu=200,Hu=201,ku=202,Gu=203,Wo=204,Xo=205,Vu=206,Wu=207,Xu=208,Yu=209,qu=210,$u=211,ju=212,Zu=213,Ku=214,Ju=0,Qu=1,th=2,Ns=3,eh=4,nh=5,ih=6,rh=7,Lc=0,sh=1,oh=2,Jn=0,ah=1,lh=2,ch=3,Pc=4,uh=5,hh=6,Dc=300,ar=301,lr=302,Yo=303,qo=304,$s=306,$o=1e3,xn=1001,jo=1002,Ve=1003,Da=1004,io=1005,en=1006,fh=1007,Lr=1008,Qn=1009,dh=1010,ph=1011,aa=1012,Uc=1013,jn=1014,Zn=1015,Pr=1016,Ic=1017,Nc=1018,_i=1020,mh=1021,vn=1023,gh=1024,_h=1025,xi=1026,cr=1027,xh=1028,Oc=1029,vh=1030,Fc=1031,zc=1033,ro=33776,so=33777,oo=33778,ao=33779,Ua=35840,Ia=35841,Na=35842,Oa=35843,Bc=36196,Fa=37492,za=37496,Ba=37808,Ha=37809,ka=37810,Ga=37811,Va=37812,Wa=37813,Xa=37814,Ya=37815,qa=37816,$a=37817,ja=37818,Za=37819,Ka=37820,Ja=37821,lo=36492,Qa=36494,tl=36495,Mh=36283,el=36284,nl=36285,il=36286,Hc=3e3,vi=3001,Sh=3200,yh=3201,kc=0,Eh=1,an="",de="srgb",Bn="srgb-linear",la="display-p3",js="display-p3-linear",Os="linear",he="srgb",Fs="rec709",zs="p3",Pi=7680,rl=519,bh=512,Th=513,wh=514,Gc=515,Ah=516,Rh=517,Ch=518,Lh=519,Zo=35044,Ph=35048,sl="300 es",Ko=1035,On=2e3,Bs=2001;class Ai{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const r=this._listeners[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const Oe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],As=Math.PI/180,Jo=180/Math.PI;function ti(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Oe[i&255]+Oe[i>>8&255]+Oe[i>>16&255]+Oe[i>>24&255]+"-"+Oe[t&255]+Oe[t>>8&255]+"-"+Oe[t>>16&15|64]+Oe[t>>24&255]+"-"+Oe[e&63|128]+Oe[e>>8&255]+"-"+Oe[e>>16&255]+Oe[e>>24&255]+Oe[n&255]+Oe[n>>8&255]+Oe[n>>16&255]+Oe[n>>24&255]).toLowerCase()}function We(i,t,e){return Math.max(t,Math.min(e,i))}function Dh(i,t){return(i%t+t)%t}function co(i,t,e){return(1-e)*i+e*t}function ol(i){return(i&i-1)===0&&i!==0}function Qo(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Nn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ae(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Uh={DEG2RAD:As};class Nt{constructor(t=0,e=0){Nt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(We(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Zt{constructor(t,e,n,r,s,a,o,l,c){Zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,l,c)}set(t,e,n,r,s,a,o,l,c){const u=this.elements;return u[0]=t,u[1]=r,u[2]=o,u[3]=e,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],f=n[7],h=n[2],m=n[5],g=n[8],_=r[0],p=r[3],d=r[6],y=r[1],S=r[4],E=r[7],P=r[2],w=r[5],A=r[8];return s[0]=a*_+o*y+l*P,s[3]=a*p+o*S+l*w,s[6]=a*d+o*E+l*A,s[1]=c*_+u*y+f*P,s[4]=c*p+u*S+f*w,s[7]=c*d+u*E+f*A,s[2]=h*_+m*y+g*P,s[5]=h*p+m*S+g*w,s[8]=h*d+m*E+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return e*a*u-e*o*c-n*s*u+n*o*l+r*s*c-r*a*l}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],f=u*a-o*c,h=o*l-u*s,m=c*s-a*l,g=e*f+n*h+r*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(r*c-u*n)*_,t[2]=(o*n-r*a)*_,t[3]=h*_,t[4]=(u*e-r*l)*_,t[5]=(r*s-o*e)*_,t[6]=m*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-r*c,r*l,-r*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(uo.makeScale(t,e)),this}rotate(t){return this.premultiply(uo.makeRotation(-t)),this}translate(t,e){return this.premultiply(uo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const uo=new Zt;function Vc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Hs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ih(){const i=Hs("canvas");return i.style.display="block",i}const al={};function Ar(i){i in al||(al[i]=!0,console.warn(i))}const ll=new Zt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),cl=new Zt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),kr={[Bn]:{transfer:Os,primaries:Fs,toReference:i=>i,fromReference:i=>i},[de]:{transfer:he,primaries:Fs,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[js]:{transfer:Os,primaries:zs,toReference:i=>i.applyMatrix3(cl),fromReference:i=>i.applyMatrix3(ll)},[la]:{transfer:he,primaries:zs,toReference:i=>i.convertSRGBToLinear().applyMatrix3(cl),fromReference:i=>i.applyMatrix3(ll).convertLinearToSRGB()}},Nh=new Set([Bn,js]),oe={enabled:!0,_workingColorSpace:Bn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Nh.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=kr[t].toReference,r=kr[e].fromReference;return r(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return kr[i].primaries},getTransfer:function(i){return i===an?Os:kr[i].transfer}};function rr(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ho(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Di;class Wc{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Di===void 0&&(Di=Hs("canvas")),Di.width=t.width,Di.height=t.height;const n=Di.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Di}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Hs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=rr(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(rr(e[n]/255)*255):e[n]=rr(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Oh=0;class Xc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Oh++}),this.uuid=ti(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(fo(r[a].image)):s.push(fo(r[a]))}else s=fo(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function fo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Wc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Fh=0;class Ye extends Ai{constructor(t=Ye.DEFAULT_IMAGE,e=Ye.DEFAULT_MAPPING,n=xn,r=xn,s=en,a=Lr,o=vn,l=Qn,c=Ye.DEFAULT_ANISOTROPY,u=an){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fh++}),this.uuid=ti(),this.name="",this.source=new Xc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Nt(0,0),this.repeat=new Nt(1,1),this.center=new Nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(Ar("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===vi?de:an),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Dc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case $o:t.x=t.x-Math.floor(t.x);break;case xn:t.x=t.x<0?0:1;break;case jo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case $o:t.y=t.y-Math.floor(t.y);break;case xn:t.y=t.y<0?0:1;break;case jo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Ar("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===de?vi:Hc}set encoding(t){Ar("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===vi?de:an}}Ye.DEFAULT_IMAGE=null;Ye.DEFAULT_MAPPING=Dc;Ye.DEFAULT_ANISOTROPY=1;class De{constructor(t=0,e=0,n=0,r=1){De.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const l=t.elements,c=l[0],u=l[4],f=l[8],h=l[1],m=l[5],g=l[9],_=l[2],p=l[6],d=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(c+1)/2,E=(m+1)/2,P=(d+1)/2,w=(u+h)/4,A=(f+_)/4,Z=(g+p)/4;return S>E&&S>P?S<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(S),r=w/n,s=A/n):E>P?E<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(E),n=w/r,s=Z/r):P<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),n=A/s,r=Z/s),this.set(n,r,s,e),this}let y=Math.sqrt((p-g)*(p-g)+(f-_)*(f-_)+(h-u)*(h-u));return Math.abs(y)<.001&&(y=1),this.x=(p-g)/y,this.y=(f-_)/y,this.z=(h-u)/y,this.w=Math.acos((c+m+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class zh extends Ai{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new De(0,0,t,e),this.scissorTest=!1,this.viewport=new De(0,0,t,e);const r={width:t,height:e,depth:1};n.encoding!==void 0&&(Ar("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===vi?de:an),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:en,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ye(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Xc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Mi extends zh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Yc extends Ye{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=xn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Bh extends Ye{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=xn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class En{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let l=n[r+0],c=n[r+1],u=n[r+2],f=n[r+3];const h=s[a+0],m=s[a+1],g=s[a+2],_=s[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=f;return}if(o===1){t[e+0]=h,t[e+1]=m,t[e+2]=g,t[e+3]=_;return}if(f!==_||l!==h||c!==m||u!==g){let p=1-o;const d=l*h+c*m+u*g+f*_,y=d>=0?1:-1,S=1-d*d;if(S>Number.EPSILON){const P=Math.sqrt(S),w=Math.atan2(P,d*y);p=Math.sin(p*w)/P,o=Math.sin(o*w)/P}const E=o*y;if(l=l*p+h*E,c=c*p+m*E,u=u*p+g*E,f=f*p+_*E,p===1-o){const P=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=P,c*=P,u*=P,f*=P}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,r,s,a){const o=n[r],l=n[r+1],c=n[r+2],u=n[r+3],f=s[a],h=s[a+1],m=s[a+2],g=s[a+3];return t[e]=o*g+u*f+l*m-c*h,t[e+1]=l*g+u*h+c*f-o*m,t[e+2]=c*g+u*m+o*h-l*f,t[e+3]=u*g-o*f-l*h-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(r/2),f=o(s/2),h=l(n/2),m=l(r/2),g=l(s/2);switch(a){case"XYZ":this._x=h*u*f+c*m*g,this._y=c*m*f-h*u*g,this._z=c*u*g+h*m*f,this._w=c*u*f-h*m*g;break;case"YXZ":this._x=h*u*f+c*m*g,this._y=c*m*f-h*u*g,this._z=c*u*g-h*m*f,this._w=c*u*f+h*m*g;break;case"ZXY":this._x=h*u*f-c*m*g,this._y=c*m*f+h*u*g,this._z=c*u*g+h*m*f,this._w=c*u*f-h*m*g;break;case"ZYX":this._x=h*u*f-c*m*g,this._y=c*m*f+h*u*g,this._z=c*u*g-h*m*f,this._w=c*u*f+h*m*g;break;case"YZX":this._x=h*u*f+c*m*g,this._y=c*m*f+h*u*g,this._z=c*u*g-h*m*f,this._w=c*u*f-h*m*g;break;case"XZY":this._x=h*u*f-c*m*g,this._y=c*m*f-h*u*g,this._z=c*u*g+h*m*f,this._w=c*u*f+h*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],l=e[9],c=e[2],u=e[6],f=e[10],h=n+o+f;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(u-l)*m,this._y=(s-c)*m,this._z=(a-r)*m}else if(n>o&&n>f){const m=2*Math.sqrt(1+n-o-f);this._w=(u-l)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+c)/m}else if(o>f){const m=2*Math.sqrt(1+o-n-f);this._w=(s-c)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+f-n-o);this._w=(a-r)/m,this._x=(s+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(We(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-r*o,this._w=a*u-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-e;return this._w=m*a+e*this._w,this._x=m*n+e*this._x,this._y=m*r+e*this._y,this._z=m*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),f=Math.sin((1-e)*u)/c,h=Math.sin(e*u)/c;return this._w=a*f+this._w*h,this._x=n*f+this._x*h,this._y=r*f+this._y*h,this._z=s*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(e*Math.cos(r),n*Math.sin(s),n*Math.cos(s),e*Math.sin(r))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(t=0,e=0,n=0){F.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ul.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ul.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*r-o*n),u=2*(o*e-s*r),f=2*(s*n-a*e);return this.x=e+l*c+a*f-o*u,this.y=n+l*u+o*c-s*f,this.z=r+l*f+s*u-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,l=e.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return po.copy(this).projectOnVector(t),this.sub(po)}reflect(t){return this.sub(po.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(We(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const po=new F,ul=new En;class Ri{constructor(t=new F(1/0,1/0,1/0),e=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,hn):hn.fromBufferAttribute(s,a),hn.applyMatrix4(t.matrixWorld),this.expandByPoint(hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Gr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Gr.copy(n.boundingBox)),Gr.applyMatrix4(t.matrixWorld),this.union(Gr)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(mr),Vr.subVectors(this.max,mr),Ui.subVectors(t.a,mr),Ii.subVectors(t.b,mr),Ni.subVectors(t.c,mr),kn.subVectors(Ii,Ui),Gn.subVectors(Ni,Ii),oi.subVectors(Ui,Ni);let e=[0,-kn.z,kn.y,0,-Gn.z,Gn.y,0,-oi.z,oi.y,kn.z,0,-kn.x,Gn.z,0,-Gn.x,oi.z,0,-oi.x,-kn.y,kn.x,0,-Gn.y,Gn.x,0,-oi.y,oi.x,0];return!mo(e,Ui,Ii,Ni,Vr)||(e=[1,0,0,0,1,0,0,0,1],!mo(e,Ui,Ii,Ni,Vr))?!1:(Wr.crossVectors(kn,Gn),e=[Wr.x,Wr.y,Wr.z],mo(e,Ui,Ii,Ni,Vr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Rn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Rn=[new F,new F,new F,new F,new F,new F,new F,new F],hn=new F,Gr=new Ri,Ui=new F,Ii=new F,Ni=new F,kn=new F,Gn=new F,oi=new F,mr=new F,Vr=new F,Wr=new F,ai=new F;function mo(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){ai.fromArray(i,s);const o=r.x*Math.abs(ai.x)+r.y*Math.abs(ai.y)+r.z*Math.abs(ai.z),l=t.dot(ai),c=e.dot(ai),u=n.dot(ai);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Hh=new Ri,gr=new F,go=new F;class Nr{constructor(t=new F,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Hh.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;gr.subVectors(t,this.center);const e=gr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(gr,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(go.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(gr.copy(t.center).add(go)),this.expandByPoint(gr.copy(t.center).sub(go))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Cn=new F,_o=new F,Xr=new F,Vn=new F,xo=new F,Yr=new F,vo=new F;class ca{constructor(t=new F,e=new F(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Cn.copy(this.origin).addScaledVector(this.direction,e),Cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){_o.copy(t).add(e).multiplyScalar(.5),Xr.copy(e).sub(t).normalize(),Vn.copy(this.origin).sub(_o);const s=t.distanceTo(e)*.5,a=-this.direction.dot(Xr),o=Vn.dot(this.direction),l=-Vn.dot(Xr),c=Vn.lengthSq(),u=Math.abs(1-a*a);let f,h,m,g;if(u>0)if(f=a*l-o,h=a*o-l,g=s*u,f>=0)if(h>=-g)if(h<=g){const _=1/u;f*=_,h*=_,m=f*(f+a*h+2*o)+h*(a*f+h+2*l)+c}else h=s,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-a*s+o)),h=f>0?-s:Math.min(Math.max(-s,-l),s),m=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-s,-l),s),m=h*(h+2*l)+c):(f=Math.max(0,-(a*s+o)),h=f>0?s:Math.min(Math.max(-s,-l),s),m=-f*f+h*(h+2*l)+c);else h=a>0?-s:s,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(_o).addScaledVector(Xr,h),m}intersectSphere(t,e){Cn.subVectors(t.center,this.origin);const n=Cn.dot(this.direction),r=Cn.dot(Cn)-n*n,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(n=(t.min.x-h.x)*c,r=(t.max.x-h.x)*c):(n=(t.max.x-h.x)*c,r=(t.min.x-h.x)*c),u>=0?(s=(t.min.y-h.y)*u,a=(t.max.y-h.y)*u):(s=(t.max.y-h.y)*u,a=(t.min.y-h.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(t.min.z-h.z)*f,l=(t.max.z-h.z)*f):(o=(t.max.z-h.z)*f,l=(t.min.z-h.z)*f),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,Cn)!==null}intersectTriangle(t,e,n,r,s){xo.subVectors(e,t),Yr.subVectors(n,t),vo.crossVectors(xo,Yr);let a=this.direction.dot(vo),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Vn.subVectors(this.origin,t);const l=o*this.direction.dot(Yr.crossVectors(Vn,Yr));if(l<0)return null;const c=o*this.direction.dot(xo.cross(Vn));if(c<0||l+c>a)return null;const u=-o*Vn.dot(vo);return u<0?null:this.at(u/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ce{constructor(t,e,n,r,s,a,o,l,c,u,f,h,m,g,_,p){ce.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,l,c,u,f,h,m,g,_,p)}set(t,e,n,r,s,a,o,l,c,u,f,h,m,g,_,p){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=r,d[1]=s,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=f,d[14]=h,d[3]=m,d[7]=g,d[11]=_,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ce().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/Oi.setFromMatrixColumn(t,0).length(),s=1/Oi.setFromMatrixColumn(t,1).length(),a=1/Oi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const h=a*u,m=a*f,g=o*u,_=o*f;e[0]=l*u,e[4]=-l*f,e[8]=c,e[1]=m+g*c,e[5]=h-_*c,e[9]=-o*l,e[2]=_-h*c,e[6]=g+m*c,e[10]=a*l}else if(t.order==="YXZ"){const h=l*u,m=l*f,g=c*u,_=c*f;e[0]=h+_*o,e[4]=g*o-m,e[8]=a*c,e[1]=a*f,e[5]=a*u,e[9]=-o,e[2]=m*o-g,e[6]=_+h*o,e[10]=a*l}else if(t.order==="ZXY"){const h=l*u,m=l*f,g=c*u,_=c*f;e[0]=h-_*o,e[4]=-a*f,e[8]=g+m*o,e[1]=m+g*o,e[5]=a*u,e[9]=_-h*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const h=a*u,m=a*f,g=o*u,_=o*f;e[0]=l*u,e[4]=g*c-m,e[8]=h*c+_,e[1]=l*f,e[5]=_*c+h,e[9]=m*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const h=a*l,m=a*c,g=o*l,_=o*c;e[0]=l*u,e[4]=_-h*f,e[8]=g*f+m,e[1]=f,e[5]=a*u,e[9]=-o*u,e[2]=-c*u,e[6]=m*f+g,e[10]=h-_*f}else if(t.order==="XZY"){const h=a*l,m=a*c,g=o*l,_=o*c;e[0]=l*u,e[4]=-f,e[8]=c*u,e[1]=h*f+_,e[5]=a*u,e[9]=m*f-g,e[2]=g*f-m,e[6]=o*u,e[10]=_*f+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(kh,t,Gh)}lookAt(t,e,n){const r=this.elements;return $e.subVectors(t,e),$e.lengthSq()===0&&($e.z=1),$e.normalize(),Wn.crossVectors(n,$e),Wn.lengthSq()===0&&(Math.abs(n.z)===1?$e.x+=1e-4:$e.z+=1e-4,$e.normalize(),Wn.crossVectors(n,$e)),Wn.normalize(),qr.crossVectors($e,Wn),r[0]=Wn.x,r[4]=qr.x,r[8]=$e.x,r[1]=Wn.y,r[5]=qr.y,r[9]=$e.y,r[2]=Wn.z,r[6]=qr.z,r[10]=$e.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],f=n[5],h=n[9],m=n[13],g=n[2],_=n[6],p=n[10],d=n[14],y=n[3],S=n[7],E=n[11],P=n[15],w=r[0],A=r[4],Z=r[8],v=r[12],T=r[1],O=r[5],H=r[9],Q=r[13],U=r[2],z=r[6],W=r[10],D=r[14],B=r[3],X=r[7],K=r[11],nt=r[15];return s[0]=a*w+o*T+l*U+c*B,s[4]=a*A+o*O+l*z+c*X,s[8]=a*Z+o*H+l*W+c*K,s[12]=a*v+o*Q+l*D+c*nt,s[1]=u*w+f*T+h*U+m*B,s[5]=u*A+f*O+h*z+m*X,s[9]=u*Z+f*H+h*W+m*K,s[13]=u*v+f*Q+h*D+m*nt,s[2]=g*w+_*T+p*U+d*B,s[6]=g*A+_*O+p*z+d*X,s[10]=g*Z+_*H+p*W+d*K,s[14]=g*v+_*Q+p*D+d*nt,s[3]=y*w+S*T+E*U+P*B,s[7]=y*A+S*O+E*z+P*X,s[11]=y*Z+S*H+E*W+P*K,s[15]=y*v+S*Q+E*D+P*nt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],u=t[2],f=t[6],h=t[10],m=t[14],g=t[3],_=t[7],p=t[11],d=t[15];return g*(+s*l*f-r*c*f-s*o*h+n*c*h+r*o*m-n*l*m)+_*(+e*l*m-e*c*h+s*a*h-r*a*m+r*c*u-s*l*u)+p*(+e*c*f-e*o*m-s*a*f+n*a*m+s*o*u-n*c*u)+d*(-r*o*u-e*l*f+e*o*h+r*a*f-n*a*h+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],f=t[9],h=t[10],m=t[11],g=t[12],_=t[13],p=t[14],d=t[15],y=f*p*c-_*h*c+_*l*m-o*p*m-f*l*d+o*h*d,S=g*h*c-u*p*c-g*l*m+a*p*m+u*l*d-a*h*d,E=u*_*c-g*f*c+g*o*m-a*_*m-u*o*d+a*f*d,P=g*f*l-u*_*l-g*o*h+a*_*h+u*o*p-a*f*p,w=e*y+n*S+r*E+s*P;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return t[0]=y*A,t[1]=(_*h*s-f*p*s-_*r*m+n*p*m+f*r*d-n*h*d)*A,t[2]=(o*p*s-_*l*s+_*r*c-n*p*c-o*r*d+n*l*d)*A,t[3]=(f*l*s-o*h*s-f*r*c+n*h*c+o*r*m-n*l*m)*A,t[4]=S*A,t[5]=(u*p*s-g*h*s+g*r*m-e*p*m-u*r*d+e*h*d)*A,t[6]=(g*l*s-a*p*s-g*r*c+e*p*c+a*r*d-e*l*d)*A,t[7]=(a*h*s-u*l*s+u*r*c-e*h*c-a*r*m+e*l*m)*A,t[8]=E*A,t[9]=(g*f*s-u*_*s-g*n*m+e*_*m+u*n*d-e*f*d)*A,t[10]=(a*_*s-g*o*s+g*n*c-e*_*c-a*n*d+e*o*d)*A,t[11]=(u*o*s-a*f*s-u*n*c+e*f*c+a*n*m-e*o*m)*A,t[12]=P*A,t[13]=(u*_*r-g*f*r+g*n*h-e*_*h-u*n*p+e*f*p)*A,t[14]=(g*o*r-a*_*r-g*n*l+e*_*l+a*n*p-e*o*p)*A,t[15]=(a*f*r-u*o*r+u*n*l-e*f*l-a*n*h+e*o*h)*A,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,l=t.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+n,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,a=e._y,o=e._z,l=e._w,c=s+s,u=a+a,f=o+o,h=s*c,m=s*u,g=s*f,_=a*u,p=a*f,d=o*f,y=l*c,S=l*u,E=l*f,P=n.x,w=n.y,A=n.z;return r[0]=(1-(_+d))*P,r[1]=(m+E)*P,r[2]=(g-S)*P,r[3]=0,r[4]=(m-E)*w,r[5]=(1-(h+d))*w,r[6]=(p+y)*w,r[7]=0,r[8]=(g+S)*A,r[9]=(p-y)*A,r[10]=(1-(h+_))*A,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=Oi.set(r[0],r[1],r[2]).length();const a=Oi.set(r[4],r[5],r[6]).length(),o=Oi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],fn.copy(this);const c=1/s,u=1/a,f=1/o;return fn.elements[0]*=c,fn.elements[1]*=c,fn.elements[2]*=c,fn.elements[4]*=u,fn.elements[5]*=u,fn.elements[6]*=u,fn.elements[8]*=f,fn.elements[9]*=f,fn.elements[10]*=f,e.setFromRotationMatrix(fn),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=On){const l=this.elements,c=2*s/(e-t),u=2*s/(n-r),f=(e+t)/(e-t),h=(n+r)/(n-r);let m,g;if(o===On)m=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===Bs)m=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=On){const l=this.elements,c=1/(e-t),u=1/(n-r),f=1/(a-s),h=(e+t)*c,m=(n+r)*u;let g,_;if(o===On)g=(a+s)*f,_=-2*f;else if(o===Bs)g=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Oi=new F,fn=new ce,kh=new F(0,0,0),Gh=new F(1,1,1),Wn=new F,qr=new F,$e=new F,hl=new ce,fl=new En;class hr{constructor(t=0,e=0,n=0,r=hr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],m=r[10];switch(e){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(We(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-We(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return hl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(hl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return fl.setFromEuler(this),this.setFromQuaternion(fl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}hr.DEFAULT_ORDER="XYZ";class ua{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Vh=0;const dl=new F,Fi=new En,Ln=new ce,$r=new F,_r=new F,Wh=new F,Xh=new En,pl=new F(1,0,0),ml=new F(0,1,0),gl=new F(0,0,1),Yh={type:"added"},qh={type:"removed"};class ye extends Ai{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vh++}),this.uuid=ti(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ye.DEFAULT_UP.clone();const t=new F,e=new hr,n=new En,r=new F(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ce},normalMatrix:{value:new Zt}}),this.matrix=new ce,this.matrixWorld=new ce,this.matrixAutoUpdate=ye.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ua,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.multiply(Fi),this}rotateOnWorldAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.premultiply(Fi),this}rotateX(t){return this.rotateOnAxis(pl,t)}rotateY(t){return this.rotateOnAxis(ml,t)}rotateZ(t){return this.rotateOnAxis(gl,t)}translateOnAxis(t,e){return dl.copy(t).applyQuaternion(this.quaternion),this.position.add(dl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(pl,t)}translateY(t){return this.translateOnAxis(ml,t)}translateZ(t){return this.translateOnAxis(gl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?$r.copy(t):$r.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),_r.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(_r,$r,this.up):Ln.lookAt($r,_r,this.up),this.quaternion.setFromRotationMatrix(Ln),r&&(Ln.extractRotation(r.matrixWorld),Fi.setFromRotationMatrix(Ln),this.quaternion.premultiply(Fi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Yh)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(qh)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ln.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ln),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_r,t,Wh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_r,Xh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++){const s=e[n];(s.matrixWorldAutoUpdate===!0||t===!0)&&s.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++){const o=r[s];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(t.materials,this.material[l]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),u=a(t.images),f=a(t.shapes),h=a(t.skeletons),m=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}ye.DEFAULT_UP=new F(0,1,0);ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dn=new F,Pn=new F,Mo=new F,Dn=new F,zi=new F,Bi=new F,_l=new F,So=new F,yo=new F,Eo=new F;let jr=!1;class nn{constructor(t=new F,e=new F,n=new F){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),dn.subVectors(t,e),r.cross(dn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){dn.subVectors(r,e),Pn.subVectors(n,e),Mo.subVectors(t,e);const a=dn.dot(dn),o=dn.dot(Pn),l=dn.dot(Mo),c=Pn.dot(Pn),u=Pn.dot(Mo),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;const h=1/f,m=(c*l-o*u)*h,g=(a*u-o*l)*h;return s.set(1-m-g,g,m)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getUV(t,e,n,r,s,a,o,l){return jr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),jr=!0),this.getInterpolation(t,e,n,r,s,a,o,l)}static getInterpolation(t,e,n,r,s,a,o,l){return this.getBarycoord(t,e,n,r,Dn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Dn.x),l.addScaledVector(a,Dn.y),l.addScaledVector(o,Dn.z),l)}static isFrontFacing(t,e,n,r){return dn.subVectors(n,e),Pn.subVectors(t,e),dn.cross(Pn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return dn.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),dn.cross(Pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return nn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return nn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,r,s){return jr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),jr=!0),nn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}getInterpolation(t,e,n,r,s){return nn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return nn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return nn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let a,o;zi.subVectors(r,n),Bi.subVectors(s,n),So.subVectors(t,n);const l=zi.dot(So),c=Bi.dot(So);if(l<=0&&c<=0)return e.copy(n);yo.subVectors(t,r);const u=zi.dot(yo),f=Bi.dot(yo);if(u>=0&&f<=u)return e.copy(r);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),e.copy(n).addScaledVector(zi,a);Eo.subVectors(t,s);const m=zi.dot(Eo),g=Bi.dot(Eo);if(g>=0&&m<=g)return e.copy(s);const _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(Bi,o);const p=u*g-m*f;if(p<=0&&f-u>=0&&m-g>=0)return _l.subVectors(s,r),o=(f-u)/(f-u+(m-g)),e.copy(r).addScaledVector(_l,o);const d=1/(p+_+h);return a=_*d,o=h*d,e.copy(n).addScaledVector(zi,a).addScaledVector(Bi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const qc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Xn={h:0,s:0,l:0},Zr={h:0,s:0,l:0};function bo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Kt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=de){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.toWorkingColorSpace(this,e),this}setRGB(t,e,n,r=oe.workingColorSpace){return this.r=t,this.g=e,this.b=n,oe.toWorkingColorSpace(this,r),this}setHSL(t,e,n,r=oe.workingColorSpace){if(t=Dh(t,1),e=We(e,0,1),n=We(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=bo(a,s,t+1/3),this.g=bo(a,s,t),this.b=bo(a,s,t-1/3)}return oe.toWorkingColorSpace(this,r),this}setStyle(t,e=de){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=de){const n=qc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=rr(t.r),this.g=rr(t.g),this.b=rr(t.b),this}copyLinearToSRGB(t){return this.r=ho(t.r),this.g=ho(t.g),this.b=ho(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=de){return oe.fromWorkingColorSpace(Fe.copy(this),t),Math.round(We(Fe.r*255,0,255))*65536+Math.round(We(Fe.g*255,0,255))*256+Math.round(We(Fe.b*255,0,255))}getHexString(t=de){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.fromWorkingColorSpace(Fe.copy(this),e);const n=Fe.r,r=Fe.g,s=Fe.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-n)/f+2;break;case s:l=(n-r)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=oe.workingColorSpace){return oe.fromWorkingColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=de){oe.fromWorkingColorSpace(Fe.copy(this),t);const e=Fe.r,n=Fe.g,r=Fe.b;return t!==de?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Xn),this.setHSL(Xn.h+t,Xn.s+e,Xn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Xn),t.getHSL(Zr);const n=co(Xn.h,Zr.h,e),r=co(Xn.s,Zr.s,e),s=co(Xn.l,Zr.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new Kt;Kt.NAMES=qc;let $h=0;class fr extends Ai{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$h++}),this.uuid=ti(),this.name="",this.type="Material",this.blending=ir,this.side=ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wo,this.blendDst=Xo,this.blendEquation=pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Kt(0,0,0),this.blendAlpha=0,this.depthFunc=Ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=rl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pi,this.stencilZFail=Pi,this.stencilZPass=Pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ir&&(n.blending=this.blending),this.side!==ni&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Wo&&(n.blendSrc=this.blendSrc),this.blendDst!==Xo&&(n.blendDst=this.blendDst),this.blendEquation!==pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ns&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==rl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Dr extends fr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Lc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const be=new F,Kr=new Nt;class ln{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Zo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Kr.fromBufferAttribute(this,e),Kr.applyMatrix3(t),this.setXY(e,Kr.x,Kr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix3(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Nn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ae(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Nn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ae(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Nn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ae(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Nn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ae(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Nn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ae(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array),r=ae(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array),r=ae(r,this.array),s=ae(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Zo&&(t.usage=this.usage),t}}class $c extends ln{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class jc extends ln{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Ze extends ln{constructor(t,e,n){super(new Float32Array(t),e,n)}}let jh=0;const Qe=new ce,To=new ye,Hi=new F,je=new Ri,xr=new Ri,Le=new F;class bn extends Ai{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jh++}),this.uuid=ti(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Vc(t)?jc:$c)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Zt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Qe.makeRotationFromQuaternion(t),this.applyMatrix4(Qe),this}rotateX(t){return Qe.makeRotationX(t),this.applyMatrix4(Qe),this}rotateY(t){return Qe.makeRotationY(t),this.applyMatrix4(Qe),this}rotateZ(t){return Qe.makeRotationZ(t),this.applyMatrix4(Qe),this}translate(t,e,n){return Qe.makeTranslation(t,e,n),this.applyMatrix4(Qe),this}scale(t,e,n){return Qe.makeScale(t,e,n),this.applyMatrix4(Qe),this}lookAt(t){return To.lookAt(t),To.updateMatrix(),this.applyMatrix4(To.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hi).negate(),this.translate(Hi.x,Hi.y,Hi.z),this}setFromPoints(t){const e=[];for(let n=0,r=t.length;n<r;n++){const s=t[n];e.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Ze(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ri);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];je.setFromBufferAttribute(s),this.morphTargetsRelative?(Le.addVectors(this.boundingBox.min,je.min),this.boundingBox.expandByPoint(Le),Le.addVectors(this.boundingBox.max,je.max),this.boundingBox.expandByPoint(Le)):(this.boundingBox.expandByPoint(je.min),this.boundingBox.expandByPoint(je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Nr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new F,1/0);return}if(t){const n=this.boundingSphere.center;if(je.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];xr.setFromBufferAttribute(o),this.morphTargetsRelative?(Le.addVectors(je.min,xr.min),je.expandByPoint(Le),Le.addVectors(je.max,xr.max),je.expandByPoint(Le)):(je.expandByPoint(xr.min),je.expandByPoint(xr.max))}je.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)Le.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Le));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Le.fromBufferAttribute(o,c),l&&(Hi.fromBufferAttribute(t,c),Le.add(Hi)),r=Math.max(r,n.distanceToSquared(Le))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,r=e.position.array,s=e.normal.array,a=e.uv.array,o=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ln(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],u=[];for(let T=0;T<o;T++)c[T]=new F,u[T]=new F;const f=new F,h=new F,m=new F,g=new Nt,_=new Nt,p=new Nt,d=new F,y=new F;function S(T,O,H){f.fromArray(r,T*3),h.fromArray(r,O*3),m.fromArray(r,H*3),g.fromArray(a,T*2),_.fromArray(a,O*2),p.fromArray(a,H*2),h.sub(f),m.sub(f),_.sub(g),p.sub(g);const Q=1/(_.x*p.y-p.x*_.y);isFinite(Q)&&(d.copy(h).multiplyScalar(p.y).addScaledVector(m,-_.y).multiplyScalar(Q),y.copy(m).multiplyScalar(_.x).addScaledVector(h,-p.x).multiplyScalar(Q),c[T].add(d),c[O].add(d),c[H].add(d),u[T].add(y),u[O].add(y),u[H].add(y))}let E=this.groups;E.length===0&&(E=[{start:0,count:n.length}]);for(let T=0,O=E.length;T<O;++T){const H=E[T],Q=H.start,U=H.count;for(let z=Q,W=Q+U;z<W;z+=3)S(n[z+0],n[z+1],n[z+2])}const P=new F,w=new F,A=new F,Z=new F;function v(T){A.fromArray(s,T*3),Z.copy(A);const O=c[T];P.copy(O),P.sub(A.multiplyScalar(A.dot(O))).normalize(),w.crossVectors(Z,O);const Q=w.dot(u[T])<0?-1:1;l[T*4]=P.x,l[T*4+1]=P.y,l[T*4+2]=P.z,l[T*4+3]=Q}for(let T=0,O=E.length;T<O;++T){const H=E[T],Q=H.start,U=H.count;for(let z=Q,W=Q+U;z<W;z+=3)v(n[z+0]),v(n[z+1]),v(n[z+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ln(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,m=n.count;h<m;h++)n.setXYZ(h,0,0,0);const r=new F,s=new F,a=new F,o=new F,l=new F,c=new F,u=new F,f=new F;if(t)for(let h=0,m=t.count;h<m;h+=3){const g=t.getX(h+0),_=t.getX(h+1),p=t.getX(h+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),a.fromBufferAttribute(e,p),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let h=0,m=e.count;h<m;h+=3)r.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),a.fromBufferAttribute(e,h+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Le.fromBufferAttribute(t,e),Le.normalize(),t.setXYZ(e,Le.x,Le.y,Le.z)}toNonIndexed(){function t(o,l){const c=o.array,u=o.itemSize,f=o.normalized,h=new c.constructor(l.length*u);let m=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*u;for(let d=0;d<u;d++)h[g++]=c[m++]}return new ln(h,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new bn,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=t(l,n);e.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,f=c.length;u<f;u++){const h=c[u],m=t(h,n);l.push(m)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const m=c[f];u.push(m.toJSON(t.data))}u.length>0&&(r[l]=u,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const r=t.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(e))}const s=t.morphAttributes;for(const c in s){const u=[],f=s[c];for(let h=0,m=f.length;h<m;h++)u.push(f[h].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xl=new ce,li=new ca,Jr=new Nr,vl=new F,ki=new F,Gi=new F,Vi=new F,wo=new F,Qr=new F,ts=new Nt,es=new Nt,ns=new Nt,Ml=new F,Sl=new F,yl=new F,is=new F,rs=new F;class pe extends ye{constructor(t=new bn,e=new Dr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){Qr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],f=s[l];u!==0&&(wo.fromBufferAttribute(f,t),a?Qr.addScaledVector(wo,u):Qr.addScaledVector(wo.sub(e),u))}e.add(Qr)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Jr.copy(n.boundingSphere),Jr.applyMatrix4(s),li.copy(t.ray).recast(t.near),!(Jr.containsPoint(li.origin)===!1&&(li.intersectSphere(Jr,vl)===null||li.origin.distanceToSquared(vl)>(t.far-t.near)**2))&&(xl.copy(s).invert(),li.copy(t.ray).applyMatrix4(xl),!(n.boundingBox!==null&&li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,li)))}_computeIntersections(t,e,n){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=h.length;g<_;g++){const p=h[g],d=a[p.materialIndex],y=Math.max(p.start,m.start),S=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let E=y,P=S;E<P;E+=3){const w=o.getX(E),A=o.getX(E+1),Z=o.getX(E+2);r=ss(this,d,t,n,c,u,f,w,A,Z),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const g=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let p=g,d=_;p<d;p+=3){const y=o.getX(p),S=o.getX(p+1),E=o.getX(p+2);r=ss(this,a,t,n,c,u,f,y,S,E),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=h.length;g<_;g++){const p=h[g],d=a[p.materialIndex],y=Math.max(p.start,m.start),S=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let E=y,P=S;E<P;E+=3){const w=E,A=E+1,Z=E+2;r=ss(this,d,t,n,c,u,f,w,A,Z),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let p=g,d=_;p<d;p+=3){const y=p,S=p+1,E=p+2;r=ss(this,a,t,n,c,u,f,y,S,E),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}}}function Zh(i,t,e,n,r,s,a,o){let l;if(t.side===He?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,t.side===ni,o),l===null)return null;rs.copy(o),rs.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(rs);return c<e.near||c>e.far?null:{distance:c,point:rs.clone(),object:i}}function ss(i,t,e,n,r,s,a,o,l,c){i.getVertexPosition(o,ki),i.getVertexPosition(l,Gi),i.getVertexPosition(c,Vi);const u=Zh(i,t,e,n,ki,Gi,Vi,is);if(u){r&&(ts.fromBufferAttribute(r,o),es.fromBufferAttribute(r,l),ns.fromBufferAttribute(r,c),u.uv=nn.getInterpolation(is,ki,Gi,Vi,ts,es,ns,new Nt)),s&&(ts.fromBufferAttribute(s,o),es.fromBufferAttribute(s,l),ns.fromBufferAttribute(s,c),u.uv1=nn.getInterpolation(is,ki,Gi,Vi,ts,es,ns,new Nt),u.uv2=u.uv1),a&&(Ml.fromBufferAttribute(a,o),Sl.fromBufferAttribute(a,l),yl.fromBufferAttribute(a,c),u.normal=nn.getInterpolation(is,ki,Gi,Vi,Ml,Sl,yl,new F),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new F,materialIndex:0};nn.getNormal(ki,Gi,Vi,f.normal),u.face=f}return u}class Tn extends bn{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],f=[];let h=0,m=0;g("z","y","x",-1,-1,n,e,t,a,s,0),g("z","y","x",1,-1,n,e,-t,a,s,1),g("x","z","y",1,1,t,n,e,r,a,2),g("x","z","y",1,-1,t,n,-e,r,a,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new Ze(c,3)),this.setAttribute("normal",new Ze(u,3)),this.setAttribute("uv",new Ze(f,2));function g(_,p,d,y,S,E,P,w,A,Z,v){const T=E/A,O=P/Z,H=E/2,Q=P/2,U=w/2,z=A+1,W=Z+1;let D=0,B=0;const X=new F;for(let K=0;K<W;K++){const nt=K*O-Q;for(let it=0;it<z;it++){const V=it*T-H;X[_]=V*y,X[p]=nt*S,X[d]=U,c.push(X.x,X.y,X.z),X[_]=0,X[p]=0,X[d]=w>0?1:-1,u.push(X.x,X.y,X.z),f.push(it/A),f.push(1-K/Z),D+=1}}for(let K=0;K<Z;K++)for(let nt=0;nt<A;nt++){const it=h+nt+z*K,V=h+nt+z*(K+1),J=h+(nt+1)+z*(K+1),st=h+(nt+1)+z*K;l.push(it,V,st),l.push(V,J,st),B+=6}o.addGroup(m,B,v),m+=B,h+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ur(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function Ge(i){const t={};for(let e=0;e<i.length;e++){const n=ur(i[e]);for(const r in n)t[r]=n[r]}return t}function Kh(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Zc(i){return i.getRenderTarget()===null?i.outputColorSpace:oe.workingColorSpace}const Jh={clone:ur,merge:Ge};var Qh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Si extends fr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Qh,this.fragmentShader=tf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ur(t.uniforms),this.uniformsGroups=Kh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Kc extends ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ce,this.projectionMatrix=new ce,this.projectionMatrixInverse=new ce,this.coordinateSystem=On}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class rn extends Kc{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Jo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(As*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Jo*2*Math.atan(Math.tan(As*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(As*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,e-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Wi=-90,Xi=1;class ef extends ye{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new rn(Wi,Xi,t,e);r.layers=this.layers,this.add(r);const s=new rn(Wi,Xi,t,e);s.layers=this.layers,this.add(s);const a=new rn(Wi,Xi,t,e);a.layers=this.layers,this.add(a);const o=new rn(Wi,Xi,t,e);o.layers=this.layers,this.add(o);const l=new rn(Wi,Xi,t,e);l.layers=this.layers,this.add(l);const c=new rn(Wi,Xi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,l]=e;for(const c of e)this.remove(c);if(t===On)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Bs)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,l),t.setRenderTarget(n,4,r),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,r),t.render(e,u),t.setRenderTarget(f,h,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Jc extends Ye{constructor(t,e,n,r,s,a,o,l,c,u){t=t!==void 0?t:[],e=e!==void 0?e:ar,super(t,e,n,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class nf extends Mi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];e.encoding!==void 0&&(Ar("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===vi?de:an),this.texture=new Jc(r,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:en}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Tn(5,5,5),s=new Si({name:"CubemapFromEquirect",uniforms:ur(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:He,blending:Kn});s.uniforms.tEquirect.value=e;const a=new pe(r,s),o=e.minFilter;return e.minFilter===Lr&&(e.minFilter=en),new ef(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,r){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}}const Ao=new F,rf=new F,sf=new Zt;class qn{constructor(t=new F(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Ao.subVectors(n,e).cross(rf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ao),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||sf.getNormalMatrix(t),r=this.coplanarPoint(Ao).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ci=new Nr,os=new F;class ha{constructor(t=new qn,e=new qn,n=new qn,r=new qn,s=new qn,a=new qn){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=On){const n=this.planes,r=t.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],u=r[5],f=r[6],h=r[7],m=r[8],g=r[9],_=r[10],p=r[11],d=r[12],y=r[13],S=r[14],E=r[15];if(n[0].setComponents(l-s,h-c,p-m,E-d).normalize(),n[1].setComponents(l+s,h+c,p+m,E+d).normalize(),n[2].setComponents(l+a,h+u,p+g,E+y).normalize(),n[3].setComponents(l-a,h-u,p-g,E-y).normalize(),n[4].setComponents(l-o,h-f,p-_,E-S).normalize(),e===On)n[5].setComponents(l+o,h+f,p+_,E+S).normalize();else if(e===Bs)n[5].setComponents(o,f,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(t){return ci.center.set(0,0,0),ci.radius=.7071067811865476,ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(os.x=r.normal.x>0?t.max.x:t.min.x,os.y=r.normal.y>0?t.max.y:t.min.y,os.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(os)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Qc(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function of(i,t){const e=t.isWebGL2,n=new WeakMap;function r(c,u){const f=c.array,h=c.usage,m=f.byteLength,g=i.createBuffer();i.bindBuffer(u,g),i.bufferData(u,f,h),c.onUploadCallback();let _;if(f instanceof Float32Array)_=i.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(f instanceof Int16Array)_=i.SHORT;else if(f instanceof Uint32Array)_=i.UNSIGNED_INT;else if(f instanceof Int32Array)_=i.INT;else if(f instanceof Int8Array)_=i.BYTE;else if(f instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:g,type:_,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version,size:m}}function s(c,u,f){const h=u.array,m=u._updateRange,g=u.updateRanges;if(i.bindBuffer(f,c),m.count===-1&&g.length===0&&i.bufferSubData(f,0,h),g.length!==0){for(let _=0,p=g.length;_<p;_++){const d=g[_];e?i.bufferSubData(f,d.start*h.BYTES_PER_ELEMENT,h,d.start,d.count):i.bufferSubData(f,d.start*h.BYTES_PER_ELEMENT,h.subarray(d.start,d.start+d.count))}u.clearUpdateRanges()}m.count!==-1&&(e?i.bufferSubData(f,m.offset*h.BYTES_PER_ELEMENT,h,m.offset,m.count):i.bufferSubData(f,m.offset*h.BYTES_PER_ELEMENT,h.subarray(m.offset,m.offset+m.count)),m.count=-1),u.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);u&&(i.deleteBuffer(u.buffer),n.delete(c))}function l(c,u){if(c.isGLBufferAttribute){const h=n.get(c);(!h||h.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const f=n.get(c);if(f===void 0)n.set(c,r(c,u));else if(f.version<c.version){if(f.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(f.buffer,c,u),f.version=c.version}}return{get:a,remove:o,update:l}}class ei extends bn{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(n),l=Math.floor(r),c=o+1,u=l+1,f=t/o,h=e/l,m=[],g=[],_=[],p=[];for(let d=0;d<u;d++){const y=d*h-a;for(let S=0;S<c;S++){const E=S*f-s;g.push(E,-y,0),_.push(0,0,1),p.push(S/o),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let y=0;y<o;y++){const S=y+c*d,E=y+c*(d+1),P=y+1+c*(d+1),w=y+1+c*d;m.push(S,E,w),m.push(E,P,w)}this.setIndex(m),this.setAttribute("position",new Ze(g,3)),this.setAttribute("normal",new Ze(_,3)),this.setAttribute("uv",new Ze(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ei(t.width,t.height,t.widthSegments,t.heightSegments)}}var af=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lf=`#ifdef USE_ALPHAHASH
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
#endif`,cf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,ff=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,df=`#ifdef USE_AOMAP
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
#endif`,pf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,mf=`#ifdef USE_BATCHING
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
#endif`,gf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,_f=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Mf=`#ifdef USE_IRIDESCENCE
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
#endif`,Sf=`#ifdef USE_BUMPMAP
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
#endif`,yf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ef=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,bf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,wf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Af=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Rf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Cf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Lf=`#define PI 3.141592653589793
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
} // validated`,Pf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Df=`vec3 transformedNormal = objectNormal;
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
#endif`,Uf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,If=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Nf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Of=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ff="gl_FragColor = linearToOutputTexel( gl_FragColor );",zf=`
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
}`,Bf=`#ifdef USE_ENVMAP
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
#endif`,Hf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,kf=`#ifdef USE_ENVMAP
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
#endif`,Gf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vf=`#ifdef USE_ENVMAP
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
#endif`,Wf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$f=`#ifdef USE_GRADIENTMAP
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
}`,jf=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Zf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Kf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qf=`uniform bool receiveShadow;
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
#endif`,td=`#ifdef USE_ENVMAP
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
#endif`,ed=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,id=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sd=`PhysicalMaterial material;
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
#endif`,od=`struct PhysicalMaterial {
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
}`,ad=`
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
#endif`,ld=`#if defined( RE_IndirectDiffuse )
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
#endif`,cd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ud=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,dd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,pd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,md=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,_d=`#if defined( USE_POINTS_UV )
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
#endif`,xd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Md=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sd=`#ifdef USE_MORPHNORMALS
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
#endif`,yd=`#ifdef USE_MORPHTARGETS
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
#endif`,Ed=`#ifdef USE_MORPHTARGETS
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
#endif`,bd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Td=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,wd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ad=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Cd=`#ifdef USE_NORMALMAP
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
#endif`,Ld=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Dd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ud=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Id=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Od=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Bd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Hd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Xd=`float getShadowMask() {
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
}`,Yd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qd=`#ifdef USE_SKINNING
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
#endif`,$d=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jd=`#ifdef USE_SKINNING
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
#endif`,Zd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Kd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Jd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qd=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,tp=`#ifdef USE_TRANSMISSION
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
#endif`,ep=`#ifdef USE_TRANSMISSION
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
#endif`,np=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ip=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const op=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ap=`uniform sampler2D t2D;
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
}`,lp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fp=`#include <common>
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
}`,dp=`#if DEPTH_PACKING == 3200
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
}`,pp=`#define DISTANCE
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
}`,mp=`#define DISTANCE
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
}`,gp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_p=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xp=`uniform float scale;
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
}`,vp=`uniform vec3 diffuse;
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
}`,Mp=`#include <common>
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
}`,Sp=`uniform vec3 diffuse;
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
}`,yp=`#define LAMBERT
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
}`,Ep=`#define LAMBERT
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
}`,bp=`#define MATCAP
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
}`,Tp=`#define MATCAP
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
}`,wp=`#define NORMAL
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
}`,Ap=`#define NORMAL
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
}`,Rp=`#define PHONG
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
}`,Cp=`#define PHONG
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
}`,Lp=`#define STANDARD
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
}`,Pp=`#define STANDARD
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
}`,Dp=`#define TOON
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
}`,Up=`#define TOON
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
}`,Ip=`uniform float size;
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
}`,Np=`uniform vec3 diffuse;
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
}`,Op=`#include <common>
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
}`,Fp=`uniform vec3 color;
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
}`,zp=`uniform float rotation;
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
}`,Bp=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:af,alphahash_pars_fragment:lf,alphamap_fragment:cf,alphamap_pars_fragment:uf,alphatest_fragment:hf,alphatest_pars_fragment:ff,aomap_fragment:df,aomap_pars_fragment:pf,batching_pars_vertex:mf,batching_vertex:gf,begin_vertex:_f,beginnormal_vertex:xf,bsdfs:vf,iridescence_fragment:Mf,bumpmap_pars_fragment:Sf,clipping_planes_fragment:yf,clipping_planes_pars_fragment:Ef,clipping_planes_pars_vertex:bf,clipping_planes_vertex:Tf,color_fragment:wf,color_pars_fragment:Af,color_pars_vertex:Rf,color_vertex:Cf,common:Lf,cube_uv_reflection_fragment:Pf,defaultnormal_vertex:Df,displacementmap_pars_vertex:Uf,displacementmap_vertex:If,emissivemap_fragment:Nf,emissivemap_pars_fragment:Of,colorspace_fragment:Ff,colorspace_pars_fragment:zf,envmap_fragment:Bf,envmap_common_pars_fragment:Hf,envmap_pars_fragment:kf,envmap_pars_vertex:Gf,envmap_physical_pars_fragment:td,envmap_vertex:Vf,fog_vertex:Wf,fog_pars_vertex:Xf,fog_fragment:Yf,fog_pars_fragment:qf,gradientmap_pars_fragment:$f,lightmap_fragment:jf,lightmap_pars_fragment:Zf,lights_lambert_fragment:Kf,lights_lambert_pars_fragment:Jf,lights_pars_begin:Qf,lights_toon_fragment:ed,lights_toon_pars_fragment:nd,lights_phong_fragment:id,lights_phong_pars_fragment:rd,lights_physical_fragment:sd,lights_physical_pars_fragment:od,lights_fragment_begin:ad,lights_fragment_maps:ld,lights_fragment_end:cd,logdepthbuf_fragment:ud,logdepthbuf_pars_fragment:hd,logdepthbuf_pars_vertex:fd,logdepthbuf_vertex:dd,map_fragment:pd,map_pars_fragment:md,map_particle_fragment:gd,map_particle_pars_fragment:_d,metalnessmap_fragment:xd,metalnessmap_pars_fragment:vd,morphcolor_vertex:Md,morphnormal_vertex:Sd,morphtarget_pars_vertex:yd,morphtarget_vertex:Ed,normal_fragment_begin:bd,normal_fragment_maps:Td,normal_pars_fragment:wd,normal_pars_vertex:Ad,normal_vertex:Rd,normalmap_pars_fragment:Cd,clearcoat_normal_fragment_begin:Ld,clearcoat_normal_fragment_maps:Pd,clearcoat_pars_fragment:Dd,iridescence_pars_fragment:Ud,opaque_fragment:Id,packing:Nd,premultiplied_alpha_fragment:Od,project_vertex:Fd,dithering_fragment:zd,dithering_pars_fragment:Bd,roughnessmap_fragment:Hd,roughnessmap_pars_fragment:kd,shadowmap_pars_fragment:Gd,shadowmap_pars_vertex:Vd,shadowmap_vertex:Wd,shadowmask_pars_fragment:Xd,skinbase_vertex:Yd,skinning_pars_vertex:qd,skinning_vertex:$d,skinnormal_vertex:jd,specularmap_fragment:Zd,specularmap_pars_fragment:Kd,tonemapping_fragment:Jd,tonemapping_pars_fragment:Qd,transmission_fragment:tp,transmission_pars_fragment:ep,uv_pars_fragment:np,uv_pars_vertex:ip,uv_vertex:rp,worldpos_vertex:sp,background_vert:op,background_frag:ap,backgroundCube_vert:lp,backgroundCube_frag:cp,cube_vert:up,cube_frag:hp,depth_vert:fp,depth_frag:dp,distanceRGBA_vert:pp,distanceRGBA_frag:mp,equirect_vert:gp,equirect_frag:_p,linedashed_vert:xp,linedashed_frag:vp,meshbasic_vert:Mp,meshbasic_frag:Sp,meshlambert_vert:yp,meshlambert_frag:Ep,meshmatcap_vert:bp,meshmatcap_frag:Tp,meshnormal_vert:wp,meshnormal_frag:Ap,meshphong_vert:Rp,meshphong_frag:Cp,meshphysical_vert:Lp,meshphysical_frag:Pp,meshtoon_vert:Dp,meshtoon_frag:Up,points_vert:Ip,points_frag:Np,shadow_vert:Op,shadow_frag:Fp,sprite_vert:zp,sprite_frag:Bp},pt={common:{diffuse:{value:new Kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new Nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new Kt(16777215)},opacity:{value:1},center:{value:new Nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},Sn={basic:{uniforms:Ge([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Ge([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Kt(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Ge([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Kt(0)},specular:{value:new Kt(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Ge([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new Kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Ge([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new Kt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Ge([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Ge([pt.points,pt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Ge([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Ge([pt.common,pt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Ge([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Ge([pt.sprite,pt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Ge([pt.common,pt.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Ge([pt.lights,pt.fog,{color:{value:new Kt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};Sn.physical={uniforms:Ge([Sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new Nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new Kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new Nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new Kt(0)},specularColor:{value:new Kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new Nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const as={r:0,b:0,g:0};function Hp(i,t,e,n,r,s,a){const o=new Kt(0);let l=s===!0?0:1,c,u,f=null,h=0,m=null;function g(p,d){let y=!1,S=d.isScene===!0?d.background:null;S&&S.isTexture&&(S=(d.backgroundBlurriness>0?e:t).get(S)),S===null?_(o,l):S&&S.isColor&&(_(S,1),y=!0);const E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),S&&(S.isCubeTexture||S.mapping===$s)?(u===void 0&&(u=new pe(new Tn(1,1,1),new Si({name:"BackgroundCubeMaterial",uniforms:ur(Sn.backgroundCube.uniforms),vertexShader:Sn.backgroundCube.vertexShader,fragmentShader:Sn.backgroundCube.fragmentShader,side:He,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),u.material.uniforms.envMap.value=S,u.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,u.material.toneMapped=oe.getTransfer(S.colorSpace)!==he,(f!==S||h!==S.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,f=S,h=S.version,m=i.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new pe(new ei(2,2),new Si({name:"BackgroundMaterial",uniforms:ur(Sn.background.uniforms),vertexShader:Sn.background.vertexShader,fragmentShader:Sn.background.fragmentShader,side:ni,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,c.material.toneMapped=oe.getTransfer(S.colorSpace)!==he,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(f!==S||h!==S.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,f=S,h=S.version,m=i.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function _(p,d){p.getRGB(as,Zc(i)),n.buffers.color.setClear(as.r,as.g,as.b,d,a)}return{getClearColor:function(){return o},setClearColor:function(p,d=1){o.set(p),l=d,_(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,_(o,l)},render:g}}function kp(i,t,e,n){const r=i.getParameter(i.MAX_VERTEX_ATTRIBS),s=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||s!==null,o={},l=p(null);let c=l,u=!1;function f(U,z,W,D,B){let X=!1;if(a){const K=_(D,W,z);c!==K&&(c=K,m(c.object)),X=d(U,D,W,B),X&&y(U,D,W,B)}else{const K=z.wireframe===!0;(c.geometry!==D.id||c.program!==W.id||c.wireframe!==K)&&(c.geometry=D.id,c.program=W.id,c.wireframe=K,X=!0)}B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(X||u)&&(u=!1,Z(U,z,W,D),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function h(){return n.isWebGL2?i.createVertexArray():s.createVertexArrayOES()}function m(U){return n.isWebGL2?i.bindVertexArray(U):s.bindVertexArrayOES(U)}function g(U){return n.isWebGL2?i.deleteVertexArray(U):s.deleteVertexArrayOES(U)}function _(U,z,W){const D=W.wireframe===!0;let B=o[U.id];B===void 0&&(B={},o[U.id]=B);let X=B[z.id];X===void 0&&(X={},B[z.id]=X);let K=X[D];return K===void 0&&(K=p(h()),X[D]=K),K}function p(U){const z=[],W=[],D=[];for(let B=0;B<r;B++)z[B]=0,W[B]=0,D[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:W,attributeDivisors:D,object:U,attributes:{},index:null}}function d(U,z,W,D){const B=c.attributes,X=z.attributes;let K=0;const nt=W.getAttributes();for(const it in nt)if(nt[it].location>=0){const J=B[it];let st=X[it];if(st===void 0&&(it==="instanceMatrix"&&U.instanceMatrix&&(st=U.instanceMatrix),it==="instanceColor"&&U.instanceColor&&(st=U.instanceColor)),J===void 0||J.attribute!==st||st&&J.data!==st.data)return!0;K++}return c.attributesNum!==K||c.index!==D}function y(U,z,W,D){const B={},X=z.attributes;let K=0;const nt=W.getAttributes();for(const it in nt)if(nt[it].location>=0){let J=X[it];J===void 0&&(it==="instanceMatrix"&&U.instanceMatrix&&(J=U.instanceMatrix),it==="instanceColor"&&U.instanceColor&&(J=U.instanceColor));const st={};st.attribute=J,J&&J.data&&(st.data=J.data),B[it]=st,K++}c.attributes=B,c.attributesNum=K,c.index=D}function S(){const U=c.newAttributes;for(let z=0,W=U.length;z<W;z++)U[z]=0}function E(U){P(U,0)}function P(U,z){const W=c.newAttributes,D=c.enabledAttributes,B=c.attributeDivisors;W[U]=1,D[U]===0&&(i.enableVertexAttribArray(U),D[U]=1),B[U]!==z&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](U,z),B[U]=z)}function w(){const U=c.newAttributes,z=c.enabledAttributes;for(let W=0,D=z.length;W<D;W++)z[W]!==U[W]&&(i.disableVertexAttribArray(W),z[W]=0)}function A(U,z,W,D,B,X,K){K===!0?i.vertexAttribIPointer(U,z,W,B,X):i.vertexAttribPointer(U,z,W,D,B,X)}function Z(U,z,W,D){if(n.isWebGL2===!1&&(U.isInstancedMesh||D.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;S();const B=D.attributes,X=W.getAttributes(),K=z.defaultAttributeValues;for(const nt in X){const it=X[nt];if(it.location>=0){let V=B[nt];if(V===void 0&&(nt==="instanceMatrix"&&U.instanceMatrix&&(V=U.instanceMatrix),nt==="instanceColor"&&U.instanceColor&&(V=U.instanceColor)),V!==void 0){const J=V.normalized,st=V.itemSize,ht=e.get(V);if(ht===void 0)continue;const ft=ht.buffer,Mt=ht.type,Pt=ht.bytesPerElement,wt=n.isWebGL2===!0&&(Mt===i.INT||Mt===i.UNSIGNED_INT||V.gpuType===Uc);if(V.isInterleavedBufferAttribute){const L=V.data,R=L.stride,j=V.offset;if(L.isInstancedInterleavedBuffer){for(let rt=0;rt<it.locationSize;rt++)P(it.location+rt,L.meshPerAttribute);U.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=L.meshPerAttribute*L.count)}else for(let rt=0;rt<it.locationSize;rt++)E(it.location+rt);i.bindBuffer(i.ARRAY_BUFFER,ft);for(let rt=0;rt<it.locationSize;rt++)A(it.location+rt,st/it.locationSize,Mt,J,R*Pt,(j+st/it.locationSize*rt)*Pt,wt)}else{if(V.isInstancedBufferAttribute){for(let L=0;L<it.locationSize;L++)P(it.location+L,V.meshPerAttribute);U.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let L=0;L<it.locationSize;L++)E(it.location+L);i.bindBuffer(i.ARRAY_BUFFER,ft);for(let L=0;L<it.locationSize;L++)A(it.location+L,st/it.locationSize,Mt,J,st*Pt,st/it.locationSize*L*Pt,wt)}}else if(K!==void 0){const J=K[nt];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(it.location,J);break;case 3:i.vertexAttrib3fv(it.location,J);break;case 4:i.vertexAttrib4fv(it.location,J);break;default:i.vertexAttrib1fv(it.location,J)}}}}w()}function v(){H();for(const U in o){const z=o[U];for(const W in z){const D=z[W];for(const B in D)g(D[B].object),delete D[B];delete z[W]}delete o[U]}}function T(U){if(o[U.id]===void 0)return;const z=o[U.id];for(const W in z){const D=z[W];for(const B in D)g(D[B].object),delete D[B];delete z[W]}delete o[U.id]}function O(U){for(const z in o){const W=o[z];if(W[U.id]===void 0)continue;const D=W[U.id];for(const B in D)g(D[B].object),delete D[B];delete W[U.id]}}function H(){Q(),u=!0,c!==l&&(c=l,m(c.object))}function Q(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:H,resetDefaultState:Q,dispose:v,releaseStatesOfGeometry:T,releaseStatesOfProgram:O,initAttributes:S,enableAttribute:E,disableUnusedAttributes:w}}function Gp(i,t,e,n){const r=n.isWebGL2;let s;function a(u){s=u}function o(u,f){i.drawArrays(s,u,f),e.update(f,s,1)}function l(u,f,h){if(h===0)return;let m,g;if(r)m=i,g="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](s,u,f,h),e.update(f,s,h)}function c(u,f,h){if(h===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<h;g++)this.render(u[g],f[g]);else{m.multiDrawArraysWEBGL(s,u,0,f,0,h);let g=0;for(let _=0;_<h;_++)g+=f[_];e.update(g,s,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function Vp(i,t,e){let n;function r(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function s(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const l=s(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||t.has("WEBGL_draw_buffers"),u=e.logarithmicDepthBuffer===!0,f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),h=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),d=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=h>0,E=a||t.has("OES_texture_float"),P=S&&E,w=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:r,getMaxPrecision:s,precision:o,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:h,maxTextureSize:m,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:p,maxVaryings:d,maxFragmentUniforms:y,vertexTextures:S,floatFragmentTextures:E,floatVertexTextures:P,maxSamples:w}}function Wp(i){const t=this;let e=null,n=0,r=!1,s=!1;const a=new qn,o=new Zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const m=f.length!==0||h||n!==0||r;return r=h,n=f.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){e=u(f,h,0)},this.setState=function(f,h,m){const g=f.clippingPlanes,_=f.clipIntersection,p=f.clipShadows,d=i.get(f);if(!r||g===null||g.length===0||s&&!p)s?u(null):c();else{const y=s?0:n,S=y*4;let E=d.clippingState||null;l.value=E,E=u(g,h,S,m);for(let P=0;P!==S;++P)E[P]=e[P];d.clippingState=E,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,h,m,g){const _=f!==null?f.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const d=m+_*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<d)&&(p=new Float32Array(d));for(let S=0,E=m;S!==_;++S,E+=4)a.copy(f[S]).applyMatrix4(y,o),a.normal.toArray(p,E),p[E+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,p}}function Xp(i){let t=new WeakMap;function e(a,o){return o===Yo?a.mapping=ar:o===qo&&(a.mapping=lr),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Yo||o===qo)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new nf(l.height/2);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",r),e(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}class tu extends Kc{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=r+e,l=r-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Qi=4,El=[.125,.215,.35,.446,.526,.582],mi=20,Ro=new tu,bl=new Kt;let Co=null,Lo=0,Po=0;const hi=(1+Math.sqrt(5))/2,Yi=1/hi,Tl=[new F(1,1,1),new F(-1,1,1),new F(1,1,-1),new F(-1,1,-1),new F(0,hi,Yi),new F(0,hi,-Yi),new F(Yi,0,hi),new F(-Yi,0,hi),new F(hi,Yi,0),new F(-hi,Yi,0)];class wl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100){Co=this._renderer.getRenderTarget(),Lo=this._renderer.getActiveCubeFace(),Po=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,r,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Co,Lo,Po),t.scissorTest=!1,ls(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ar||t.mapping===lr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Co=this._renderer.getRenderTarget(),Lo=this._renderer.getActiveCubeFace(),Po=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:en,minFilter:en,generateMipmaps:!1,type:Pr,format:vn,colorSpace:Bn,depthBuffer:!1},r=Al(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Al(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Yp(s)),this._blurMaterial=qp(s,t,e)}return r}_compileMaterial(t){const e=new pe(this._lodPlanes[0],t);this._renderer.compile(e,Ro)}_sceneToCubeUV(t,e,n,r){const o=new rn(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,h=u.toneMapping;u.getClearColor(bl),u.toneMapping=Jn,u.autoClear=!1;const m=new Dr({name:"PMREM.Background",side:He,depthWrite:!1,depthTest:!1}),g=new pe(new Tn,m);let _=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,_=!0):(m.color.copy(bl),_=!0);for(let d=0;d<6;d++){const y=d%3;y===0?(o.up.set(0,l[d],0),o.lookAt(c[d],0,0)):y===1?(o.up.set(0,0,l[d]),o.lookAt(0,c[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,c[d]));const S=this._cubeSize;ls(r,y*S,d>2?S:0,S,S),u.setRenderTarget(r),_&&u.render(g,o),u.render(t,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=h,u.autoClear=f,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===ar||t.mapping===lr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rl());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new pe(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const l=this._cubeSize;ls(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Ro)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Tl[(r-1)%Tl.length];this._blur(t,r-1,r,s,a)}e.autoClear=n}_blur(t,e,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new pe(this._lodPlanes[r],c),h=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*mi-1),_=s/g,p=isFinite(s)?1+Math.floor(u*_):mi;p>mi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${mi}`);const d=[];let y=0;for(let A=0;A<mi;++A){const Z=A/_,v=Math.exp(-Z*Z/2);d.push(v),A===0?y+=v:A<p&&(y+=2*v)}for(let A=0;A<d.length;A++)d[A]=d[A]/y;h.envMap.value=t.texture,h.samples.value=p,h.weights.value=d,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:S}=this;h.dTheta.value=g,h.mipInt.value=S-n;const E=this._sizeLods[r],P=3*E*(r>S-Qi?r-S+Qi:0),w=4*(this._cubeSize-E);ls(e,P,w,3*E,2*E),l.setRenderTarget(e),l.render(f,Ro)}}function Yp(i){const t=[],e=[],n=[];let r=i;const s=i-Qi+1+El.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let l=1/o;a>i-Qi?l=El[a-i+Qi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,f=1+c,h=[u,u,f,u,f,f,u,u,f,f,u,f],m=6,g=6,_=3,p=2,d=1,y=new Float32Array(_*g*m),S=new Float32Array(p*g*m),E=new Float32Array(d*g*m);for(let w=0;w<m;w++){const A=w%3*2/3-1,Z=w>2?0:-1,v=[A,Z,0,A+2/3,Z,0,A+2/3,Z+1,0,A,Z,0,A+2/3,Z+1,0,A,Z+1,0];y.set(v,_*g*w),S.set(h,p*g*w);const T=[w,w,w,w,w,w];E.set(T,d*g*w)}const P=new bn;P.setAttribute("position",new ln(y,_)),P.setAttribute("uv",new ln(S,p)),P.setAttribute("faceIndex",new ln(E,d)),t.push(P),r>Qi&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Al(i,t,e){const n=new Mi(i,t,e);return n.texture.mapping=$s,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ls(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function qp(i,t,e){const n=new Float32Array(mi),r=new F(0,1,0);return new Si({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:fa(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Rl(){return new Si({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fa(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Cl(){return new Si({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function fa(){return`

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
	`}function $p(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Yo||l===qo,u=l===ar||l===lr;if(c||u)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let f=t.get(o);return e===null&&(e=new wl(i)),f=c?e.fromEquirectangular(o,f):e.fromCubemap(o,f),t.set(o,f),f.texture}else{if(t.has(o))return t.get(o).texture;{const f=o.image;if(c&&f&&f.height>0||u&&f&&r(f)){e===null&&(e=new wl(i));const h=c?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,h),o.addEventListener("dispose",s),h.texture}else return null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function jp(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const r=e(n);return r===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Zp(i,t,e,n){const r={},s=new WeakMap;function a(f){const h=f.target;h.index!==null&&t.remove(h.index);for(const g in h.attributes)t.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let p=0,d=_.length;p<d;p++)t.remove(_[p])}h.removeEventListener("dispose",a),delete r[h.id];const m=s.get(h);m&&(t.remove(m),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function o(f,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,e.memory.geometries++),h}function l(f){const h=f.attributes;for(const g in h)t.update(h[g],i.ARRAY_BUFFER);const m=f.morphAttributes;for(const g in m){const _=m[g];for(let p=0,d=_.length;p<d;p++)t.update(_[p],i.ARRAY_BUFFER)}}function c(f){const h=[],m=f.index,g=f.attributes.position;let _=0;if(m!==null){const y=m.array;_=m.version;for(let S=0,E=y.length;S<E;S+=3){const P=y[S+0],w=y[S+1],A=y[S+2];h.push(P,w,w,A,A,P)}}else if(g!==void 0){const y=g.array;_=g.version;for(let S=0,E=y.length/3-1;S<E;S+=3){const P=S+0,w=S+1,A=S+2;h.push(P,w,w,A,A,P)}}else return;const p=new(Vc(h)?jc:$c)(h,1);p.version=_;const d=s.get(f);d&&t.remove(d),s.set(f,p)}function u(f){const h=s.get(f);if(h){const m=f.index;m!==null&&h.version<m.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function Kp(i,t,e,n){const r=n.isWebGL2;let s;function a(m){s=m}let o,l;function c(m){o=m.type,l=m.bytesPerElement}function u(m,g){i.drawElements(s,g,o,m*l),e.update(g,s,1)}function f(m,g,_){if(_===0)return;let p,d;if(r)p=i,d="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[d](s,g,o,m*l,_),e.update(g,s,_)}function h(m,g,_){if(_===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<_;d++)this.render(m[d]/l,g[d]);else{p.multiDrawElementsWEBGL(s,g,0,o,m,0,_);let d=0;for(let y=0;y<_;y++)d+=g[y];e.update(d,s,1)}}this.setMode=a,this.setIndex=c,this.render=u,this.renderInstances=f,this.renderMultiDraw=h}function Jp(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Qp(i,t){return i[0]-t[0]}function tm(i,t){return Math.abs(t[1])-Math.abs(i[1])}function em(i,t,e){const n={},r=new Float32Array(8),s=new WeakMap,a=new De,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,u,f){const h=c.morphTargetInfluences;if(t.isWebGL2===!0){const g=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,_=g!==void 0?g.length:0;let p=s.get(u);if(p===void 0||p.count!==_){let z=function(){Q.dispose(),s.delete(u),u.removeEventListener("dispose",z)};var m=z;p!==void 0&&p.texture.dispose();const S=u.morphAttributes.position!==void 0,E=u.morphAttributes.normal!==void 0,P=u.morphAttributes.color!==void 0,w=u.morphAttributes.position||[],A=u.morphAttributes.normal||[],Z=u.morphAttributes.color||[];let v=0;S===!0&&(v=1),E===!0&&(v=2),P===!0&&(v=3);let T=u.attributes.position.count*v,O=1;T>t.maxTextureSize&&(O=Math.ceil(T/t.maxTextureSize),T=t.maxTextureSize);const H=new Float32Array(T*O*4*_),Q=new Yc(H,T,O,_);Q.type=Zn,Q.needsUpdate=!0;const U=v*4;for(let W=0;W<_;W++){const D=w[W],B=A[W],X=Z[W],K=T*O*4*W;for(let nt=0;nt<D.count;nt++){const it=nt*U;S===!0&&(a.fromBufferAttribute(D,nt),H[K+it+0]=a.x,H[K+it+1]=a.y,H[K+it+2]=a.z,H[K+it+3]=0),E===!0&&(a.fromBufferAttribute(B,nt),H[K+it+4]=a.x,H[K+it+5]=a.y,H[K+it+6]=a.z,H[K+it+7]=0),P===!0&&(a.fromBufferAttribute(X,nt),H[K+it+8]=a.x,H[K+it+9]=a.y,H[K+it+10]=a.z,H[K+it+11]=X.itemSize===4?a.w:1)}}p={count:_,texture:Q,size:new Nt(T,O)},s.set(u,p),u.addEventListener("dispose",z)}let d=0;for(let S=0;S<h.length;S++)d+=h[S];const y=u.morphTargetsRelative?1:1-d;f.getUniforms().setValue(i,"morphTargetBaseInfluence",y),f.getUniforms().setValue(i,"morphTargetInfluences",h),f.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),f.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}else{const g=h===void 0?0:h.length;let _=n[u.id];if(_===void 0||_.length!==g){_=[];for(let E=0;E<g;E++)_[E]=[E,0];n[u.id]=_}for(let E=0;E<g;E++){const P=_[E];P[0]=E,P[1]=h[E]}_.sort(tm);for(let E=0;E<8;E++)E<g&&_[E][1]?(o[E][0]=_[E][0],o[E][1]=_[E][1]):(o[E][0]=Number.MAX_SAFE_INTEGER,o[E][1]=0);o.sort(Qp);const p=u.morphAttributes.position,d=u.morphAttributes.normal;let y=0;for(let E=0;E<8;E++){const P=o[E],w=P[0],A=P[1];w!==Number.MAX_SAFE_INTEGER&&A?(p&&u.getAttribute("morphTarget"+E)!==p[w]&&u.setAttribute("morphTarget"+E,p[w]),d&&u.getAttribute("morphNormal"+E)!==d[w]&&u.setAttribute("morphNormal"+E,d[w]),r[E]=A,y+=A):(p&&u.hasAttribute("morphTarget"+E)===!0&&u.deleteAttribute("morphTarget"+E),d&&u.hasAttribute("morphNormal"+E)===!0&&u.deleteAttribute("morphNormal"+E),r[E]=0)}const S=u.morphTargetsRelative?1:1-y;f.getUniforms().setValue(i,"morphTargetBaseInfluence",S),f.getUniforms().setValue(i,"morphTargetInfluences",r)}}return{update:l}}function nm(i,t,e,n){let r=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,f=t.get(l,u);if(r.get(f)!==c&&(t.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return f}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:a}}class eu extends Ye{constructor(t,e,n,r,s,a,o,l,c,u){if(u=u!==void 0?u:xi,u!==xi&&u!==cr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===xi&&(n=jn),n===void 0&&u===cr&&(n=_i),super(null,r,s,a,o,l,u,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Ve,this.minFilter=l!==void 0?l:Ve,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const nu=new Ye,iu=new eu(1,1);iu.compareFunction=Gc;const ru=new Yc,su=new Bh,ou=new Jc,Ll=[],Pl=[],Dl=new Float32Array(16),Ul=new Float32Array(9),Il=new Float32Array(4);function dr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=Ll[r];if(s===void 0&&(s=new Float32Array(r),Ll[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function Ae(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Re(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Zs(i,t){let e=Pl[t];e===void 0&&(e=new Int32Array(t),Pl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function im(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function rm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2fv(this.addr,t),Re(e,t)}}function sm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;i.uniform3fv(this.addr,t),Re(e,t)}}function om(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4fv(this.addr,t),Re(e,t)}}function am(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;Il.set(n),i.uniformMatrix2fv(this.addr,!1,Il),Re(e,n)}}function lm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;Ul.set(n),i.uniformMatrix3fv(this.addr,!1,Ul),Re(e,n)}}function cm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;Dl.set(n),i.uniformMatrix4fv(this.addr,!1,Dl),Re(e,n)}}function um(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function hm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2iv(this.addr,t),Re(e,t)}}function fm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3iv(this.addr,t),Re(e,t)}}function dm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4iv(this.addr,t),Re(e,t)}}function pm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2uiv(this.addr,t),Re(e,t)}}function gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3uiv(this.addr,t),Re(e,t)}}function _m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4uiv(this.addr,t),Re(e,t)}}function xm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);const s=this.type===i.SAMPLER_2D_SHADOW?iu:nu;e.setTexture2D(t||s,r)}function vm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||su,r)}function Mm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||ou,r)}function Sm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||ru,r)}function ym(i){switch(i){case 5126:return im;case 35664:return rm;case 35665:return sm;case 35666:return om;case 35674:return am;case 35675:return lm;case 35676:return cm;case 5124:case 35670:return um;case 35667:case 35671:return hm;case 35668:case 35672:return fm;case 35669:case 35673:return dm;case 5125:return pm;case 36294:return mm;case 36295:return gm;case 36296:return _m;case 35678:case 36198:case 36298:case 36306:case 35682:return xm;case 35679:case 36299:case 36307:return vm;case 35680:case 36300:case 36308:case 36293:return Mm;case 36289:case 36303:case 36311:case 36292:return Sm}}function Em(i,t){i.uniform1fv(this.addr,t)}function bm(i,t){const e=dr(t,this.size,2);i.uniform2fv(this.addr,e)}function Tm(i,t){const e=dr(t,this.size,3);i.uniform3fv(this.addr,e)}function wm(i,t){const e=dr(t,this.size,4);i.uniform4fv(this.addr,e)}function Am(i,t){const e=dr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Rm(i,t){const e=dr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Cm(i,t){const e=dr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Lm(i,t){i.uniform1iv(this.addr,t)}function Pm(i,t){i.uniform2iv(this.addr,t)}function Dm(i,t){i.uniform3iv(this.addr,t)}function Um(i,t){i.uniform4iv(this.addr,t)}function Im(i,t){i.uniform1uiv(this.addr,t)}function Nm(i,t){i.uniform2uiv(this.addr,t)}function Om(i,t){i.uniform3uiv(this.addr,t)}function Fm(i,t){i.uniform4uiv(this.addr,t)}function zm(i,t,e){const n=this.cache,r=t.length,s=Zs(e,r);Ae(n,s)||(i.uniform1iv(this.addr,s),Re(n,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||nu,s[a])}function Bm(i,t,e){const n=this.cache,r=t.length,s=Zs(e,r);Ae(n,s)||(i.uniform1iv(this.addr,s),Re(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||su,s[a])}function Hm(i,t,e){const n=this.cache,r=t.length,s=Zs(e,r);Ae(n,s)||(i.uniform1iv(this.addr,s),Re(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||ou,s[a])}function km(i,t,e){const n=this.cache,r=t.length,s=Zs(e,r);Ae(n,s)||(i.uniform1iv(this.addr,s),Re(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||ru,s[a])}function Gm(i){switch(i){case 5126:return Em;case 35664:return bm;case 35665:return Tm;case 35666:return wm;case 35674:return Am;case 35675:return Rm;case 35676:return Cm;case 5124:case 35670:return Lm;case 35667:case 35671:return Pm;case 35668:case 35672:return Dm;case 35669:case 35673:return Um;case 5125:return Im;case 36294:return Nm;case 36295:return Om;case 36296:return Fm;case 35678:case 36198:case 36298:case 36306:case 35682:return zm;case 35679:case 36299:case 36307:return Bm;case 35680:case 36300:case 36308:case 36293:return Hm;case 36289:case 36303:case 36311:case 36292:return km}}class Vm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=ym(e.type)}}class Wm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Gm(e.type)}}class Xm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],n)}}}const Do=/(\w+)(\])?(\[|\.)?/g;function Nl(i,t){i.seq.push(t),i.map[t.id]=t}function Ym(i,t,e){const n=i.name,r=n.length;for(Do.lastIndex=0;;){const s=Do.exec(n),a=Do.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Nl(e,c===void 0?new Vm(o,i,t):new Wm(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new Xm(o),Nl(e,f)),e=f}}}class Rs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);Ym(s,a,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&n.push(a)}return n}}function Ol(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const qm=37297;let $m=0;function jm(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function Zm(i){const t=oe.getPrimaries(oe.workingColorSpace),e=oe.getPrimaries(i);let n;switch(t===e?n="":t===zs&&e===Fs?n="LinearDisplayP3ToLinearSRGB":t===Fs&&e===zs&&(n="LinearSRGBToLinearDisplayP3"),i){case Bn:case js:return[n,"LinearTransferOETF"];case de:case la:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Fl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=i.getShaderInfoLog(t).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return e.toUpperCase()+`

`+r+`

`+jm(i.getShaderSource(t),a)}else return r}function Km(i,t){const e=Zm(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Jm(i,t){let e;switch(t){case ah:e="Linear";break;case lh:e="Reinhard";break;case ch:e="OptimizedCineon";break;case Pc:e="ACESFilmic";break;case hh:e="AgX";break;case uh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Qm(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(tr).join(`
`)}function t0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(tr).join(`
`)}function e0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function n0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function tr(i){return i!==""}function zl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Bl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const i0=/^[ \t]*#include +<([\w\d./]+)>/gm;function ta(i){return i.replace(i0,s0)}const r0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function s0(i,t){let e=Xt[t];if(e===void 0){const n=r0.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ta(e)}const o0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Hl(i){return i.replace(o0,a0)}function a0(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function kl(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function l0(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Rc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Cc?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===In&&(t="SHADOWMAP_TYPE_VSM"),t}function c0(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ar:case lr:t="ENVMAP_TYPE_CUBE";break;case $s:t="ENVMAP_TYPE_CUBE_UV";break}return t}function u0(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case lr:t="ENVMAP_MODE_REFRACTION";break}return t}function h0(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Lc:t="ENVMAP_BLENDING_MULTIPLY";break;case sh:t="ENVMAP_BLENDING_MIX";break;case oh:t="ENVMAP_BLENDING_ADD";break}return t}function f0(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function d0(i,t,e,n){const r=i.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=l0(e),c=c0(e),u=u0(e),f=h0(e),h=f0(e),m=e.isWebGL2?"":Qm(e),g=t0(e),_=e0(s),p=r.createProgram();let d,y,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(tr).join(`
`),d.length>0&&(d+=`
`),y=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(tr).join(`
`),y.length>0&&(y+=`
`)):(d=[kl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(tr).join(`
`),y=[m,kl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Jn?"#define TONE_MAPPING":"",e.toneMapping!==Jn?Xt.tonemapping_pars_fragment:"",e.toneMapping!==Jn?Jm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,Km("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(tr).join(`
`)),a=ta(a),a=zl(a,e),a=Bl(a,e),o=ta(o),o=zl(o,e),o=Bl(o,e),a=Hl(a),o=Hl(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,d=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,y=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===sl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===sl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const E=S+d+a,P=S+y+o,w=Ol(r,r.VERTEX_SHADER,E),A=Ol(r,r.FRAGMENT_SHADER,P);r.attachShader(p,w),r.attachShader(p,A),e.index0AttributeName!==void 0?r.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(p,0,"position"),r.linkProgram(p);function Z(H){if(i.debug.checkShaderErrors){const Q=r.getProgramInfoLog(p).trim(),U=r.getShaderInfoLog(w).trim(),z=r.getShaderInfoLog(A).trim();let W=!0,D=!0;if(r.getProgramParameter(p,r.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,p,w,A);else{const B=Fl(r,w,"vertex"),X=Fl(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(p,r.VALIDATE_STATUS)+`

Program Info Log: `+Q+`
`+B+`
`+X)}else Q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Q):(U===""||z==="")&&(D=!1);D&&(H.diagnostics={runnable:W,programLog:Q,vertexShader:{log:U,prefix:d},fragmentShader:{log:z,prefix:y}})}r.deleteShader(w),r.deleteShader(A),v=new Rs(r,p),T=n0(r,p)}let v;this.getUniforms=function(){return v===void 0&&Z(this),v};let T;this.getAttributes=function(){return T===void 0&&Z(this),T};let O=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return O===!1&&(O=r.getProgramParameter(p,qm)),O},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=$m++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=w,this.fragmentShader=A,this}let p0=0;class m0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new g0(t),e.set(t,n)),n}}class g0{constructor(t){this.id=p0++,this.code=t,this.usedTimes=0}}function _0(i,t,e,n,r,s,a){const o=new ua,l=new m0,c=[],u=r.isWebGL2,f=r.logarithmicDepthBuffer,h=r.vertexTextures;let m=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){return v===0?"uv":`uv${v}`}function p(v,T,O,H,Q){const U=H.fog,z=Q.geometry,W=v.isMeshStandardMaterial?H.environment:null,D=(v.isMeshStandardMaterial?e:t).get(v.envMap||W),B=D&&D.mapping===$s?D.image.height:null,X=g[v.type];v.precision!==null&&(m=r.getMaxPrecision(v.precision),m!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",m,"instead."));const K=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,nt=K!==void 0?K.length:0;let it=0;z.morphAttributes.position!==void 0&&(it=1),z.morphAttributes.normal!==void 0&&(it=2),z.morphAttributes.color!==void 0&&(it=3);let V,J,st,ht;if(X){const ve=Sn[X];V=ve.vertexShader,J=ve.fragmentShader}else V=v.vertexShader,J=v.fragmentShader,l.update(v),st=l.getVertexShaderID(v),ht=l.getFragmentShaderID(v);const ft=i.getRenderTarget(),Mt=Q.isInstancedMesh===!0,Pt=Q.isBatchedMesh===!0,wt=!!v.map,L=!!v.matcap,R=!!D,j=!!v.aoMap,rt=!!v.lightMap,N=!!v.bumpMap,_t=!!v.normalMap,Tt=!!v.displacementMap,mt=!!v.emissiveMap,M=!!v.metalnessMap,x=!!v.roughnessMap,G=v.anisotropy>0,tt=v.clearcoat>0,et=v.iridescence>0,ot=v.sheen>0,Et=v.transmission>0,gt=G&&!!v.anisotropyMap,vt=tt&&!!v.clearcoatMap,At=tt&&!!v.clearcoatNormalMap,Ot=tt&&!!v.clearcoatRoughnessMap,at=et&&!!v.iridescenceMap,re=et&&!!v.iridescenceThicknessMap,Yt=ot&&!!v.sheenColorMap,Ht=ot&&!!v.sheenRoughnessMap,Dt=!!v.specularMap,St=!!v.specularColorMap,C=!!v.specularIntensityMap,ct=Et&&!!v.transmissionMap,Ct=Et&&!!v.thicknessMap,bt=!!v.gradientMap,lt=!!v.alphaMap,I=v.alphaTest>0,ut=!!v.alphaHash,xt=!!v.extensions,zt=!!z.attributes.uv1,It=!!z.attributes.uv2,Qt=!!z.attributes.uv3;let te=Jn;return v.toneMapped&&(ft===null||ft.isXRRenderTarget===!0)&&(te=i.toneMapping),{isWebGL2:u,shaderID:X,shaderType:v.type,shaderName:v.name,vertexShader:V,fragmentShader:J,defines:v.defines,customVertexShaderID:st,customFragmentShaderID:ht,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:m,batching:Pt,instancing:Mt,instancingColor:Mt&&Q.instanceColor!==null,supportsVertexTextures:h,outputColorSpace:ft===null?i.outputColorSpace:ft.isXRRenderTarget===!0?ft.texture.colorSpace:Bn,map:wt,matcap:L,envMap:R,envMapMode:R&&D.mapping,envMapCubeUVHeight:B,aoMap:j,lightMap:rt,bumpMap:N,normalMap:_t,displacementMap:h&&Tt,emissiveMap:mt,normalMapObjectSpace:_t&&v.normalMapType===Eh,normalMapTangentSpace:_t&&v.normalMapType===kc,metalnessMap:M,roughnessMap:x,anisotropy:G,anisotropyMap:gt,clearcoat:tt,clearcoatMap:vt,clearcoatNormalMap:At,clearcoatRoughnessMap:Ot,iridescence:et,iridescenceMap:at,iridescenceThicknessMap:re,sheen:ot,sheenColorMap:Yt,sheenRoughnessMap:Ht,specularMap:Dt,specularColorMap:St,specularIntensityMap:C,transmission:Et,transmissionMap:ct,thicknessMap:Ct,gradientMap:bt,opaque:v.transparent===!1&&v.blending===ir,alphaMap:lt,alphaTest:I,alphaHash:ut,combine:v.combine,mapUv:wt&&_(v.map.channel),aoMapUv:j&&_(v.aoMap.channel),lightMapUv:rt&&_(v.lightMap.channel),bumpMapUv:N&&_(v.bumpMap.channel),normalMapUv:_t&&_(v.normalMap.channel),displacementMapUv:Tt&&_(v.displacementMap.channel),emissiveMapUv:mt&&_(v.emissiveMap.channel),metalnessMapUv:M&&_(v.metalnessMap.channel),roughnessMapUv:x&&_(v.roughnessMap.channel),anisotropyMapUv:gt&&_(v.anisotropyMap.channel),clearcoatMapUv:vt&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:At&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ot&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:at&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:re&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:Yt&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:Ht&&_(v.sheenRoughnessMap.channel),specularMapUv:Dt&&_(v.specularMap.channel),specularColorMapUv:St&&_(v.specularColorMap.channel),specularIntensityMapUv:C&&_(v.specularIntensityMap.channel),transmissionMapUv:ct&&_(v.transmissionMap.channel),thicknessMapUv:Ct&&_(v.thicknessMap.channel),alphaMapUv:lt&&_(v.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(_t||G),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,vertexUv1s:zt,vertexUv2s:It,vertexUv3s:Qt,pointsUvs:Q.isPoints===!0&&!!z.attributes.uv&&(wt||lt),fog:!!U,useFog:v.fog===!0,fogExp2:U&&U.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:Q.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:it,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&O.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,useLegacyLights:i._useLegacyLights,decodeVideoTexture:wt&&v.map.isVideoTexture===!0&&oe.getTransfer(v.map.colorSpace)===he,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===on,flipSided:v.side===He,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionDerivatives:xt&&v.extensions.derivatives===!0,extensionFragDepth:xt&&v.extensions.fragDepth===!0,extensionDrawBuffers:xt&&v.extensions.drawBuffers===!0,extensionShaderTextureLOD:xt&&v.extensions.shaderTextureLOD===!0,extensionClipCullDistance:xt&&v.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()}}function d(v){const T=[];if(v.shaderID?T.push(v.shaderID):(T.push(v.customVertexShaderID),T.push(v.customFragmentShaderID)),v.defines!==void 0)for(const O in v.defines)T.push(O),T.push(v.defines[O]);return v.isRawShaderMaterial===!1&&(y(T,v),S(T,v),T.push(i.outputColorSpace)),T.push(v.customProgramCacheKey),T.join()}function y(v,T){v.push(T.precision),v.push(T.outputColorSpace),v.push(T.envMapMode),v.push(T.envMapCubeUVHeight),v.push(T.mapUv),v.push(T.alphaMapUv),v.push(T.lightMapUv),v.push(T.aoMapUv),v.push(T.bumpMapUv),v.push(T.normalMapUv),v.push(T.displacementMapUv),v.push(T.emissiveMapUv),v.push(T.metalnessMapUv),v.push(T.roughnessMapUv),v.push(T.anisotropyMapUv),v.push(T.clearcoatMapUv),v.push(T.clearcoatNormalMapUv),v.push(T.clearcoatRoughnessMapUv),v.push(T.iridescenceMapUv),v.push(T.iridescenceThicknessMapUv),v.push(T.sheenColorMapUv),v.push(T.sheenRoughnessMapUv),v.push(T.specularMapUv),v.push(T.specularColorMapUv),v.push(T.specularIntensityMapUv),v.push(T.transmissionMapUv),v.push(T.thicknessMapUv),v.push(T.combine),v.push(T.fogExp2),v.push(T.sizeAttenuation),v.push(T.morphTargetsCount),v.push(T.morphAttributeCount),v.push(T.numDirLights),v.push(T.numPointLights),v.push(T.numSpotLights),v.push(T.numSpotLightMaps),v.push(T.numHemiLights),v.push(T.numRectAreaLights),v.push(T.numDirLightShadows),v.push(T.numPointLightShadows),v.push(T.numSpotLightShadows),v.push(T.numSpotLightShadowsWithMaps),v.push(T.numLightProbes),v.push(T.shadowMapType),v.push(T.toneMapping),v.push(T.numClippingPlanes),v.push(T.numClipIntersection),v.push(T.depthPacking)}function S(v,T){o.disableAll(),T.isWebGL2&&o.enable(0),T.supportsVertexTextures&&o.enable(1),T.instancing&&o.enable(2),T.instancingColor&&o.enable(3),T.matcap&&o.enable(4),T.envMap&&o.enable(5),T.normalMapObjectSpace&&o.enable(6),T.normalMapTangentSpace&&o.enable(7),T.clearcoat&&o.enable(8),T.iridescence&&o.enable(9),T.alphaTest&&o.enable(10),T.vertexColors&&o.enable(11),T.vertexAlphas&&o.enable(12),T.vertexUv1s&&o.enable(13),T.vertexUv2s&&o.enable(14),T.vertexUv3s&&o.enable(15),T.vertexTangents&&o.enable(16),T.anisotropy&&o.enable(17),T.alphaHash&&o.enable(18),T.batching&&o.enable(19),v.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.skinning&&o.enable(4),T.morphTargets&&o.enable(5),T.morphNormals&&o.enable(6),T.morphColors&&o.enable(7),T.premultipliedAlpha&&o.enable(8),T.shadowMapEnabled&&o.enable(9),T.useLegacyLights&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),v.push(o.mask)}function E(v){const T=g[v.type];let O;if(T){const H=Sn[T];O=Jh.clone(H.uniforms)}else O=v.uniforms;return O}function P(v,T){let O;for(let H=0,Q=c.length;H<Q;H++){const U=c[H];if(U.cacheKey===T){O=U,++O.usedTimes;break}}return O===void 0&&(O=new d0(i,T,v,s),c.push(O)),O}function w(v){if(--v.usedTimes===0){const T=c.indexOf(v);c[T]=c[c.length-1],c.pop(),v.destroy()}}function A(v){l.remove(v)}function Z(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:E,acquireProgram:P,releaseProgram:w,releaseShaderCache:A,programs:c,dispose:Z}}function x0(){let i=new WeakMap;function t(s){let a=i.get(s);return a===void 0&&(a={},i.set(s,a)),a}function e(s){i.delete(s)}function n(s,a,o){i.get(s)[a]=o}function r(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:r}}function v0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Gl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Vl(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(f,h,m,g,_,p){let d=i[t];return d===void 0?(d={id:f.id,object:f,geometry:h,material:m,groupOrder:g,renderOrder:f.renderOrder,z:_,group:p},i[t]=d):(d.id=f.id,d.object=f,d.geometry=h,d.material=m,d.groupOrder=g,d.renderOrder=f.renderOrder,d.z=_,d.group=p),t++,d}function o(f,h,m,g,_,p){const d=a(f,h,m,g,_,p);m.transmission>0?n.push(d):m.transparent===!0?r.push(d):e.push(d)}function l(f,h,m,g,_,p){const d=a(f,h,m,g,_,p);m.transmission>0?n.unshift(d):m.transparent===!0?r.unshift(d):e.unshift(d)}function c(f,h){e.length>1&&e.sort(f||v0),n.length>1&&n.sort(h||Gl),r.length>1&&r.sort(h||Gl)}function u(){for(let f=t,h=i.length;f<h;f++){const m=i[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:l,finish:u,sort:c}}function M0(){let i=new WeakMap;function t(n,r){const s=i.get(n);let a;return s===void 0?(a=new Vl,i.set(n,[a])):r>=s.length?(a=new Vl,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function S0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new F,color:new Kt};break;case"SpotLight":e={position:new F,direction:new F,color:new Kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new F,color:new Kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new F,skyColor:new Kt,groundColor:new Kt};break;case"RectAreaLight":e={color:new Kt,position:new F,halfWidth:new F,halfHeight:new F};break}return i[t.id]=e,e}}}function y0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let E0=0;function b0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function T0(i,t){const e=new S0,n=y0(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)r.probe.push(new F);const s=new F,a=new ce,o=new ce;function l(u,f){let h=0,m=0,g=0;for(let H=0;H<9;H++)r.probe[H].set(0,0,0);let _=0,p=0,d=0,y=0,S=0,E=0,P=0,w=0,A=0,Z=0,v=0;u.sort(b0);const T=f===!0?Math.PI:1;for(let H=0,Q=u.length;H<Q;H++){const U=u[H],z=U.color,W=U.intensity,D=U.distance,B=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)h+=z.r*W*T,m+=z.g*W*T,g+=z.b*W*T;else if(U.isLightProbe){for(let X=0;X<9;X++)r.probe[X].addScaledVector(U.sh.coefficients[X],W);v++}else if(U.isDirectionalLight){const X=e.get(U);if(X.color.copy(U.color).multiplyScalar(U.intensity*T),U.castShadow){const K=U.shadow,nt=n.get(U);nt.shadowBias=K.bias,nt.shadowNormalBias=K.normalBias,nt.shadowRadius=K.radius,nt.shadowMapSize=K.mapSize,r.directionalShadow[_]=nt,r.directionalShadowMap[_]=B,r.directionalShadowMatrix[_]=U.shadow.matrix,E++}r.directional[_]=X,_++}else if(U.isSpotLight){const X=e.get(U);X.position.setFromMatrixPosition(U.matrixWorld),X.color.copy(z).multiplyScalar(W*T),X.distance=D,X.coneCos=Math.cos(U.angle),X.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),X.decay=U.decay,r.spot[d]=X;const K=U.shadow;if(U.map&&(r.spotLightMap[A]=U.map,A++,K.updateMatrices(U),U.castShadow&&Z++),r.spotLightMatrix[d]=K.matrix,U.castShadow){const nt=n.get(U);nt.shadowBias=K.bias,nt.shadowNormalBias=K.normalBias,nt.shadowRadius=K.radius,nt.shadowMapSize=K.mapSize,r.spotShadow[d]=nt,r.spotShadowMap[d]=B,w++}d++}else if(U.isRectAreaLight){const X=e.get(U);X.color.copy(z).multiplyScalar(W),X.halfWidth.set(U.width*.5,0,0),X.halfHeight.set(0,U.height*.5,0),r.rectArea[y]=X,y++}else if(U.isPointLight){const X=e.get(U);if(X.color.copy(U.color).multiplyScalar(U.intensity*T),X.distance=U.distance,X.decay=U.decay,U.castShadow){const K=U.shadow,nt=n.get(U);nt.shadowBias=K.bias,nt.shadowNormalBias=K.normalBias,nt.shadowRadius=K.radius,nt.shadowMapSize=K.mapSize,nt.shadowCameraNear=K.camera.near,nt.shadowCameraFar=K.camera.far,r.pointShadow[p]=nt,r.pointShadowMap[p]=B,r.pointShadowMatrix[p]=U.shadow.matrix,P++}r.point[p]=X,p++}else if(U.isHemisphereLight){const X=e.get(U);X.skyColor.copy(U.color).multiplyScalar(W*T),X.groundColor.copy(U.groundColor).multiplyScalar(W*T),r.hemi[S]=X,S++}}y>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=pt.LTC_FLOAT_1,r.rectAreaLTC2=pt.LTC_FLOAT_2):(r.rectAreaLTC1=pt.LTC_HALF_1,r.rectAreaLTC2=pt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=pt.LTC_FLOAT_1,r.rectAreaLTC2=pt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=pt.LTC_HALF_1,r.rectAreaLTC2=pt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=h,r.ambient[1]=m,r.ambient[2]=g;const O=r.hash;(O.directionalLength!==_||O.pointLength!==p||O.spotLength!==d||O.rectAreaLength!==y||O.hemiLength!==S||O.numDirectionalShadows!==E||O.numPointShadows!==P||O.numSpotShadows!==w||O.numSpotMaps!==A||O.numLightProbes!==v)&&(r.directional.length=_,r.spot.length=d,r.rectArea.length=y,r.point.length=p,r.hemi.length=S,r.directionalShadow.length=E,r.directionalShadowMap.length=E,r.pointShadow.length=P,r.pointShadowMap.length=P,r.spotShadow.length=w,r.spotShadowMap.length=w,r.directionalShadowMatrix.length=E,r.pointShadowMatrix.length=P,r.spotLightMatrix.length=w+A-Z,r.spotLightMap.length=A,r.numSpotLightShadowsWithMaps=Z,r.numLightProbes=v,O.directionalLength=_,O.pointLength=p,O.spotLength=d,O.rectAreaLength=y,O.hemiLength=S,O.numDirectionalShadows=E,O.numPointShadows=P,O.numSpotShadows=w,O.numSpotMaps=A,O.numLightProbes=v,r.version=E0++)}function c(u,f){let h=0,m=0,g=0,_=0,p=0;const d=f.matrixWorldInverse;for(let y=0,S=u.length;y<S;y++){const E=u[y];if(E.isDirectionalLight){const P=r.directional[h];P.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),P.direction.sub(s),P.direction.transformDirection(d),h++}else if(E.isSpotLight){const P=r.spot[g];P.position.setFromMatrixPosition(E.matrixWorld),P.position.applyMatrix4(d),P.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),P.direction.sub(s),P.direction.transformDirection(d),g++}else if(E.isRectAreaLight){const P=r.rectArea[_];P.position.setFromMatrixPosition(E.matrixWorld),P.position.applyMatrix4(d),o.identity(),a.copy(E.matrixWorld),a.premultiply(d),o.extractRotation(a),P.halfWidth.set(E.width*.5,0,0),P.halfHeight.set(0,E.height*.5,0),P.halfWidth.applyMatrix4(o),P.halfHeight.applyMatrix4(o),_++}else if(E.isPointLight){const P=r.point[m];P.position.setFromMatrixPosition(E.matrixWorld),P.position.applyMatrix4(d),m++}else if(E.isHemisphereLight){const P=r.hemi[p];P.direction.setFromMatrixPosition(E.matrixWorld),P.direction.transformDirection(d),p++}}}return{setup:l,setupView:c,state:r}}function Wl(i,t){const e=new T0(i,t),n=[],r=[];function s(){n.length=0,r.length=0}function a(f){n.push(f)}function o(f){r.push(f)}function l(f){e.setup(n,f)}function c(f){e.setupView(n,f)}return{init:s,state:{lightsArray:n,shadowsArray:r,lights:e},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function w0(i,t){let e=new WeakMap;function n(s,a=0){const o=e.get(s);let l;return o===void 0?(l=new Wl(i,t),e.set(s,[l])):a>=o.length?(l=new Wl(i,t),o.push(l)):l=o[a],l}function r(){e=new WeakMap}return{get:n,dispose:r}}class A0 extends fr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class R0 extends fr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const C0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,L0=`uniform sampler2D shadow_pass;
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
}`;function P0(i,t,e){let n=new ha;const r=new Nt,s=new Nt,a=new De,o=new A0({depthPacking:yh}),l=new R0,c={},u=e.maxTextureSize,f={[ni]:He,[He]:ni,[on]:on},h=new Si({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Nt},radius:{value:4}},vertexShader:C0,fragmentShader:L0}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const g=new bn;g.setAttribute("position",new ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new pe(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Rc;let d=this.type;this.render=function(w,A,Z){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const v=i.getRenderTarget(),T=i.getActiveCubeFace(),O=i.getActiveMipmapLevel(),H=i.state;H.setBlending(Kn),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const Q=d!==In&&this.type===In,U=d===In&&this.type!==In;for(let z=0,W=w.length;z<W;z++){const D=w[z],B=D.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",D,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;r.copy(B.mapSize);const X=B.getFrameExtents();if(r.multiply(X),s.copy(B.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/X.x),r.x=s.x*X.x,B.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/X.y),r.y=s.y*X.y,B.mapSize.y=s.y)),B.map===null||Q===!0||U===!0){const nt=this.type!==In?{minFilter:Ve,magFilter:Ve}:{};B.map!==null&&B.map.dispose(),B.map=new Mi(r.x,r.y,nt),B.map.texture.name=D.name+".shadowMap",B.camera.updateProjectionMatrix()}i.setRenderTarget(B.map),i.clear();const K=B.getViewportCount();for(let nt=0;nt<K;nt++){const it=B.getViewport(nt);a.set(s.x*it.x,s.y*it.y,s.x*it.z,s.y*it.w),H.viewport(a),B.updateMatrices(D,nt),n=B.getFrustum(),E(A,Z,B.camera,D,this.type)}B.isPointLightShadow!==!0&&this.type===In&&y(B,Z),B.needsUpdate=!1}d=this.type,p.needsUpdate=!1,i.setRenderTarget(v,T,O)};function y(w,A){const Z=t.update(_);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Mi(r.x,r.y)),h.uniforms.shadow_pass.value=w.map.texture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,Z,h,_,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,Z,m,_,null)}function S(w,A,Z,v){let T=null;const O=Z.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(O!==void 0)T=O;else if(T=Z.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const H=T.uuid,Q=A.uuid;let U=c[H];U===void 0&&(U={},c[H]=U);let z=U[Q];z===void 0&&(z=T.clone(),U[Q]=z,A.addEventListener("dispose",P)),T=z}if(T.visible=A.visible,T.wireframe=A.wireframe,v===In?T.side=A.shadowSide!==null?A.shadowSide:A.side:T.side=A.shadowSide!==null?A.shadowSide:f[A.side],T.alphaMap=A.alphaMap,T.alphaTest=A.alphaTest,T.map=A.map,T.clipShadows=A.clipShadows,T.clippingPlanes=A.clippingPlanes,T.clipIntersection=A.clipIntersection,T.displacementMap=A.displacementMap,T.displacementScale=A.displacementScale,T.displacementBias=A.displacementBias,T.wireframeLinewidth=A.wireframeLinewidth,T.linewidth=A.linewidth,Z.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const H=i.properties.get(T);H.light=Z}return T}function E(w,A,Z,v,T){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&T===In)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,w.matrixWorld);const Q=t.update(w),U=w.material;if(Array.isArray(U)){const z=Q.groups;for(let W=0,D=z.length;W<D;W++){const B=z[W],X=U[B.materialIndex];if(X&&X.visible){const K=S(w,X,v,T);w.onBeforeShadow(i,w,A,Z,Q,K,B),i.renderBufferDirect(Z,null,Q,K,w,B),w.onAfterShadow(i,w,A,Z,Q,K,B)}}}else if(U.visible){const z=S(w,U,v,T);w.onBeforeShadow(i,w,A,Z,Q,z,null),i.renderBufferDirect(Z,null,Q,z,w,null),w.onAfterShadow(i,w,A,Z,Q,z,null)}}const H=w.children;for(let Q=0,U=H.length;Q<U;Q++)E(H[Q],A,Z,v,T)}function P(w){w.target.removeEventListener("dispose",P);for(const Z in c){const v=c[Z],T=w.target.uuid;T in v&&(v[T].dispose(),delete v[T])}}}function D0(i,t,e){const n=e.isWebGL2;function r(){let I=!1;const ut=new De;let xt=null;const zt=new De(0,0,0,0);return{setMask:function(It){xt!==It&&!I&&(i.colorMask(It,It,It,It),xt=It)},setLocked:function(It){I=It},setClear:function(It,Qt,te,me,ve){ve===!0&&(It*=me,Qt*=me,te*=me),ut.set(It,Qt,te,me),zt.equals(ut)===!1&&(i.clearColor(It,Qt,te,me),zt.copy(ut))},reset:function(){I=!1,xt=null,zt.set(-1,0,0,0)}}}function s(){let I=!1,ut=null,xt=null,zt=null;return{setTest:function(It){It?Pt(i.DEPTH_TEST):wt(i.DEPTH_TEST)},setMask:function(It){ut!==It&&!I&&(i.depthMask(It),ut=It)},setFunc:function(It){if(xt!==It){switch(It){case Ju:i.depthFunc(i.NEVER);break;case Qu:i.depthFunc(i.ALWAYS);break;case th:i.depthFunc(i.LESS);break;case Ns:i.depthFunc(i.LEQUAL);break;case eh:i.depthFunc(i.EQUAL);break;case nh:i.depthFunc(i.GEQUAL);break;case ih:i.depthFunc(i.GREATER);break;case rh:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}xt=It}},setLocked:function(It){I=It},setClear:function(It){zt!==It&&(i.clearDepth(It),zt=It)},reset:function(){I=!1,ut=null,xt=null,zt=null}}}function a(){let I=!1,ut=null,xt=null,zt=null,It=null,Qt=null,te=null,me=null,ve=null;return{setTest:function(ne){I||(ne?Pt(i.STENCIL_TEST):wt(i.STENCIL_TEST))},setMask:function(ne){ut!==ne&&!I&&(i.stencilMask(ne),ut=ne)},setFunc:function(ne,Ee,Mn){(xt!==ne||zt!==Ee||It!==Mn)&&(i.stencilFunc(ne,Ee,Mn),xt=ne,zt=Ee,It=Mn)},setOp:function(ne,Ee,Mn){(Qt!==ne||te!==Ee||me!==Mn)&&(i.stencilOp(ne,Ee,Mn),Qt=ne,te=Ee,me=Mn)},setLocked:function(ne){I=ne},setClear:function(ne){ve!==ne&&(i.clearStencil(ne),ve=ne)},reset:function(){I=!1,ut=null,xt=null,zt=null,It=null,Qt=null,te=null,me=null,ve=null}}}const o=new r,l=new s,c=new a,u=new WeakMap,f=new WeakMap;let h={},m={},g=new WeakMap,_=[],p=null,d=!1,y=null,S=null,E=null,P=null,w=null,A=null,Z=null,v=new Kt(0,0,0),T=0,O=!1,H=null,Q=null,U=null,z=null,W=null;const D=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,X=0;const K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(K)[1]),B=X>=1):K.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),B=X>=2);let nt=null,it={};const V=i.getParameter(i.SCISSOR_BOX),J=i.getParameter(i.VIEWPORT),st=new De().fromArray(V),ht=new De().fromArray(J);function ft(I,ut,xt,zt){const It=new Uint8Array(4),Qt=i.createTexture();i.bindTexture(I,Qt),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let te=0;te<xt;te++)n&&(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)?i.texImage3D(ut,0,i.RGBA,1,1,zt,0,i.RGBA,i.UNSIGNED_BYTE,It):i.texImage2D(ut+te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,It);return Qt}const Mt={};Mt[i.TEXTURE_2D]=ft(i.TEXTURE_2D,i.TEXTURE_2D,1),Mt[i.TEXTURE_CUBE_MAP]=ft(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Mt[i.TEXTURE_2D_ARRAY]=ft(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Mt[i.TEXTURE_3D]=ft(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Pt(i.DEPTH_TEST),l.setFunc(Ns),mt(!1),M(wa),Pt(i.CULL_FACE),_t(Kn);function Pt(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function wt(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function L(I,ut){return m[I]!==ut?(i.bindFramebuffer(I,ut),m[I]=ut,n&&(I===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=ut),I===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=ut)),!0):!1}function R(I,ut){let xt=_,zt=!1;if(I)if(xt=g.get(ut),xt===void 0&&(xt=[],g.set(ut,xt)),I.isWebGLMultipleRenderTargets){const It=I.texture;if(xt.length!==It.length||xt[0]!==i.COLOR_ATTACHMENT0){for(let Qt=0,te=It.length;Qt<te;Qt++)xt[Qt]=i.COLOR_ATTACHMENT0+Qt;xt.length=It.length,zt=!0}}else xt[0]!==i.COLOR_ATTACHMENT0&&(xt[0]=i.COLOR_ATTACHMENT0,zt=!0);else xt[0]!==i.BACK&&(xt[0]=i.BACK,zt=!0);zt&&(e.isWebGL2?i.drawBuffers(xt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(xt))}function j(I){return p!==I?(i.useProgram(I),p=I,!0):!1}const rt={[pi]:i.FUNC_ADD,[Fu]:i.FUNC_SUBTRACT,[zu]:i.FUNC_REVERSE_SUBTRACT};if(n)rt[La]=i.MIN,rt[Pa]=i.MAX;else{const I=t.get("EXT_blend_minmax");I!==null&&(rt[La]=I.MIN_EXT,rt[Pa]=I.MAX_EXT)}const N={[Bu]:i.ZERO,[Hu]:i.ONE,[ku]:i.SRC_COLOR,[Wo]:i.SRC_ALPHA,[qu]:i.SRC_ALPHA_SATURATE,[Xu]:i.DST_COLOR,[Vu]:i.DST_ALPHA,[Gu]:i.ONE_MINUS_SRC_COLOR,[Xo]:i.ONE_MINUS_SRC_ALPHA,[Yu]:i.ONE_MINUS_DST_COLOR,[Wu]:i.ONE_MINUS_DST_ALPHA,[$u]:i.CONSTANT_COLOR,[ju]:i.ONE_MINUS_CONSTANT_COLOR,[Zu]:i.CONSTANT_ALPHA,[Ku]:i.ONE_MINUS_CONSTANT_ALPHA};function _t(I,ut,xt,zt,It,Qt,te,me,ve,ne){if(I===Kn){d===!0&&(wt(i.BLEND),d=!1);return}if(d===!1&&(Pt(i.BLEND),d=!0),I!==Ou){if(I!==y||ne!==O){if((S!==pi||w!==pi)&&(i.blendEquation(i.FUNC_ADD),S=pi,w=pi),ne)switch(I){case ir:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Aa:i.blendFunc(i.ONE,i.ONE);break;case Ra:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ca:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case ir:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Aa:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Ra:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ca:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}E=null,P=null,A=null,Z=null,v.set(0,0,0),T=0,y=I,O=ne}return}It=It||ut,Qt=Qt||xt,te=te||zt,(ut!==S||It!==w)&&(i.blendEquationSeparate(rt[ut],rt[It]),S=ut,w=It),(xt!==E||zt!==P||Qt!==A||te!==Z)&&(i.blendFuncSeparate(N[xt],N[zt],N[Qt],N[te]),E=xt,P=zt,A=Qt,Z=te),(me.equals(v)===!1||ve!==T)&&(i.blendColor(me.r,me.g,me.b,ve),v.copy(me),T=ve),y=I,O=!1}function Tt(I,ut){I.side===on?wt(i.CULL_FACE):Pt(i.CULL_FACE);let xt=I.side===He;ut&&(xt=!xt),mt(xt),I.blending===ir&&I.transparent===!1?_t(Kn):_t(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),l.setFunc(I.depthFunc),l.setTest(I.depthTest),l.setMask(I.depthWrite),o.setMask(I.colorWrite);const zt=I.stencilWrite;c.setTest(zt),zt&&(c.setMask(I.stencilWriteMask),c.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),c.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),G(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?Pt(i.SAMPLE_ALPHA_TO_COVERAGE):wt(i.SAMPLE_ALPHA_TO_COVERAGE)}function mt(I){H!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),H=I)}function M(I){I!==Iu?(Pt(i.CULL_FACE),I!==Q&&(I===wa?i.cullFace(i.BACK):I===Nu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):wt(i.CULL_FACE),Q=I}function x(I){I!==U&&(B&&i.lineWidth(I),U=I)}function G(I,ut,xt){I?(Pt(i.POLYGON_OFFSET_FILL),(z!==ut||W!==xt)&&(i.polygonOffset(ut,xt),z=ut,W=xt)):wt(i.POLYGON_OFFSET_FILL)}function tt(I){I?Pt(i.SCISSOR_TEST):wt(i.SCISSOR_TEST)}function et(I){I===void 0&&(I=i.TEXTURE0+D-1),nt!==I&&(i.activeTexture(I),nt=I)}function ot(I,ut,xt){xt===void 0&&(nt===null?xt=i.TEXTURE0+D-1:xt=nt);let zt=it[xt];zt===void 0&&(zt={type:void 0,texture:void 0},it[xt]=zt),(zt.type!==I||zt.texture!==ut)&&(nt!==xt&&(i.activeTexture(xt),nt=xt),i.bindTexture(I,ut||Mt[I]),zt.type=I,zt.texture=ut)}function Et(){const I=it[nt];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function gt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function vt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function At(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ot(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function at(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function re(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Yt(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ht(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Dt(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function St(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function C(I){st.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),st.copy(I))}function ct(I){ht.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),ht.copy(I))}function Ct(I,ut){let xt=f.get(ut);xt===void 0&&(xt=new WeakMap,f.set(ut,xt));let zt=xt.get(I);zt===void 0&&(zt=i.getUniformBlockIndex(ut,I.name),xt.set(I,zt))}function bt(I,ut){const zt=f.get(ut).get(I);u.get(ut)!==zt&&(i.uniformBlockBinding(ut,zt,I.__bindingPointIndex),u.set(ut,zt))}function lt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},nt=null,it={},m={},g=new WeakMap,_=[],p=null,d=!1,y=null,S=null,E=null,P=null,w=null,A=null,Z=null,v=new Kt(0,0,0),T=0,O=!1,H=null,Q=null,U=null,z=null,W=null,st.set(0,0,i.canvas.width,i.canvas.height),ht.set(0,0,i.canvas.width,i.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Pt,disable:wt,bindFramebuffer:L,drawBuffers:R,useProgram:j,setBlending:_t,setMaterial:Tt,setFlipSided:mt,setCullFace:M,setLineWidth:x,setPolygonOffset:G,setScissorTest:tt,activeTexture:et,bindTexture:ot,unbindTexture:Et,compressedTexImage2D:gt,compressedTexImage3D:vt,texImage2D:Dt,texImage3D:St,updateUBOMapping:Ct,uniformBlockBinding:bt,texStorage2D:Yt,texStorage3D:Ht,texSubImage2D:At,texSubImage3D:Ot,compressedTexSubImage2D:at,compressedTexSubImage3D:re,scissor:C,viewport:ct,reset:lt}}function U0(i,t,e,n,r,s,a){const o=r.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap;let f;const h=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(M,x){return m?new OffscreenCanvas(M,x):Hs("canvas")}function _(M,x,G,tt){let et=1;if((M.width>tt||M.height>tt)&&(et=tt/Math.max(M.width,M.height)),et<1||x===!0)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap){const ot=x?Qo:Math.floor,Et=ot(et*M.width),gt=ot(et*M.height);f===void 0&&(f=g(Et,gt));const vt=G?g(Et,gt):f;return vt.width=Et,vt.height=gt,vt.getContext("2d").drawImage(M,0,0,Et,gt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+M.width+"x"+M.height+") to ("+Et+"x"+gt+")."),vt}else return"data"in M&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+M.width+"x"+M.height+")."),M;return M}function p(M){return ol(M.width)&&ol(M.height)}function d(M){return o?!1:M.wrapS!==xn||M.wrapT!==xn||M.minFilter!==Ve&&M.minFilter!==en}function y(M,x){return M.generateMipmaps&&x&&M.minFilter!==Ve&&M.minFilter!==en}function S(M){i.generateMipmap(M)}function E(M,x,G,tt,et=!1){if(o===!1)return x;if(M!==null){if(i[M]!==void 0)return i[M];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let ot=x;if(x===i.RED&&(G===i.FLOAT&&(ot=i.R32F),G===i.HALF_FLOAT&&(ot=i.R16F),G===i.UNSIGNED_BYTE&&(ot=i.R8)),x===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(ot=i.R8UI),G===i.UNSIGNED_SHORT&&(ot=i.R16UI),G===i.UNSIGNED_INT&&(ot=i.R32UI),G===i.BYTE&&(ot=i.R8I),G===i.SHORT&&(ot=i.R16I),G===i.INT&&(ot=i.R32I)),x===i.RG&&(G===i.FLOAT&&(ot=i.RG32F),G===i.HALF_FLOAT&&(ot=i.RG16F),G===i.UNSIGNED_BYTE&&(ot=i.RG8)),x===i.RGBA){const Et=et?Os:oe.getTransfer(tt);G===i.FLOAT&&(ot=i.RGBA32F),G===i.HALF_FLOAT&&(ot=i.RGBA16F),G===i.UNSIGNED_BYTE&&(ot=Et===he?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(ot=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(ot=i.RGB5_A1)}return(ot===i.R16F||ot===i.R32F||ot===i.RG16F||ot===i.RG32F||ot===i.RGBA16F||ot===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ot}function P(M,x,G){return y(M,G)===!0||M.isFramebufferTexture&&M.minFilter!==Ve&&M.minFilter!==en?Math.log2(Math.max(x.width,x.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?x.mipmaps.length:1}function w(M){return M===Ve||M===Da||M===io?i.NEAREST:i.LINEAR}function A(M){const x=M.target;x.removeEventListener("dispose",A),v(x),x.isVideoTexture&&u.delete(x)}function Z(M){const x=M.target;x.removeEventListener("dispose",Z),O(x)}function v(M){const x=n.get(M);if(x.__webglInit===void 0)return;const G=M.source,tt=h.get(G);if(tt){const et=tt[x.__cacheKey];et.usedTimes--,et.usedTimes===0&&T(M),Object.keys(tt).length===0&&h.delete(G)}n.remove(M)}function T(M){const x=n.get(M);i.deleteTexture(x.__webglTexture);const G=M.source,tt=h.get(G);delete tt[x.__cacheKey],a.memory.textures--}function O(M){const x=M.texture,G=n.get(M),tt=n.get(x);if(tt.__webglTexture!==void 0&&(i.deleteTexture(tt.__webglTexture),a.memory.textures--),M.depthTexture&&M.depthTexture.dispose(),M.isWebGLCubeRenderTarget)for(let et=0;et<6;et++){if(Array.isArray(G.__webglFramebuffer[et]))for(let ot=0;ot<G.__webglFramebuffer[et].length;ot++)i.deleteFramebuffer(G.__webglFramebuffer[et][ot]);else i.deleteFramebuffer(G.__webglFramebuffer[et]);G.__webglDepthbuffer&&i.deleteRenderbuffer(G.__webglDepthbuffer[et])}else{if(Array.isArray(G.__webglFramebuffer))for(let et=0;et<G.__webglFramebuffer.length;et++)i.deleteFramebuffer(G.__webglFramebuffer[et]);else i.deleteFramebuffer(G.__webglFramebuffer);if(G.__webglDepthbuffer&&i.deleteRenderbuffer(G.__webglDepthbuffer),G.__webglMultisampledFramebuffer&&i.deleteFramebuffer(G.__webglMultisampledFramebuffer),G.__webglColorRenderbuffer)for(let et=0;et<G.__webglColorRenderbuffer.length;et++)G.__webglColorRenderbuffer[et]&&i.deleteRenderbuffer(G.__webglColorRenderbuffer[et]);G.__webglDepthRenderbuffer&&i.deleteRenderbuffer(G.__webglDepthRenderbuffer)}if(M.isWebGLMultipleRenderTargets)for(let et=0,ot=x.length;et<ot;et++){const Et=n.get(x[et]);Et.__webglTexture&&(i.deleteTexture(Et.__webglTexture),a.memory.textures--),n.remove(x[et])}n.remove(x),n.remove(M)}let H=0;function Q(){H=0}function U(){const M=H;return M>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+r.maxTextures),H+=1,M}function z(M){const x=[];return x.push(M.wrapS),x.push(M.wrapT),x.push(M.wrapR||0),x.push(M.magFilter),x.push(M.minFilter),x.push(M.anisotropy),x.push(M.internalFormat),x.push(M.format),x.push(M.type),x.push(M.generateMipmaps),x.push(M.premultiplyAlpha),x.push(M.flipY),x.push(M.unpackAlignment),x.push(M.colorSpace),x.join()}function W(M,x){const G=n.get(M);if(M.isVideoTexture&&Tt(M),M.isRenderTargetTexture===!1&&M.version>0&&G.__version!==M.version){const tt=M.image;if(tt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{st(G,M,x);return}}e.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+x)}function D(M,x){const G=n.get(M);if(M.version>0&&G.__version!==M.version){st(G,M,x);return}e.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+x)}function B(M,x){const G=n.get(M);if(M.version>0&&G.__version!==M.version){st(G,M,x);return}e.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+x)}function X(M,x){const G=n.get(M);if(M.version>0&&G.__version!==M.version){ht(G,M,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+x)}const K={[$o]:i.REPEAT,[xn]:i.CLAMP_TO_EDGE,[jo]:i.MIRRORED_REPEAT},nt={[Ve]:i.NEAREST,[Da]:i.NEAREST_MIPMAP_NEAREST,[io]:i.NEAREST_MIPMAP_LINEAR,[en]:i.LINEAR,[fh]:i.LINEAR_MIPMAP_NEAREST,[Lr]:i.LINEAR_MIPMAP_LINEAR},it={[bh]:i.NEVER,[Lh]:i.ALWAYS,[Th]:i.LESS,[Gc]:i.LEQUAL,[wh]:i.EQUAL,[Ch]:i.GEQUAL,[Ah]:i.GREATER,[Rh]:i.NOTEQUAL};function V(M,x,G){if(G?(i.texParameteri(M,i.TEXTURE_WRAP_S,K[x.wrapS]),i.texParameteri(M,i.TEXTURE_WRAP_T,K[x.wrapT]),(M===i.TEXTURE_3D||M===i.TEXTURE_2D_ARRAY)&&i.texParameteri(M,i.TEXTURE_WRAP_R,K[x.wrapR]),i.texParameteri(M,i.TEXTURE_MAG_FILTER,nt[x.magFilter]),i.texParameteri(M,i.TEXTURE_MIN_FILTER,nt[x.minFilter])):(i.texParameteri(M,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(M,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(M===i.TEXTURE_3D||M===i.TEXTURE_2D_ARRAY)&&i.texParameteri(M,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(x.wrapS!==xn||x.wrapT!==xn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(M,i.TEXTURE_MAG_FILTER,w(x.magFilter)),i.texParameteri(M,i.TEXTURE_MIN_FILTER,w(x.minFilter)),x.minFilter!==Ve&&x.minFilter!==en&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),x.compareFunction&&(i.texParameteri(M,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(M,i.TEXTURE_COMPARE_FUNC,it[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const tt=t.get("EXT_texture_filter_anisotropic");if(x.magFilter===Ve||x.minFilter!==io&&x.minFilter!==Lr||x.type===Zn&&t.has("OES_texture_float_linear")===!1||o===!1&&x.type===Pr&&t.has("OES_texture_half_float_linear")===!1)return;(x.anisotropy>1||n.get(x).__currentAnisotropy)&&(i.texParameterf(M,tt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy)}}function J(M,x){let G=!1;M.__webglInit===void 0&&(M.__webglInit=!0,x.addEventListener("dispose",A));const tt=x.source;let et=h.get(tt);et===void 0&&(et={},h.set(tt,et));const ot=z(x);if(ot!==M.__cacheKey){et[ot]===void 0&&(et[ot]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),et[ot].usedTimes++;const Et=et[M.__cacheKey];Et!==void 0&&(et[M.__cacheKey].usedTimes--,Et.usedTimes===0&&T(x)),M.__cacheKey=ot,M.__webglTexture=et[ot].texture}return G}function st(M,x,G){let tt=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(tt=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(tt=i.TEXTURE_3D);const et=J(M,x),ot=x.source;e.bindTexture(tt,M.__webglTexture,i.TEXTURE0+G);const Et=n.get(ot);if(ot.version!==Et.__version||et===!0){e.activeTexture(i.TEXTURE0+G);const gt=oe.getPrimaries(oe.workingColorSpace),vt=x.colorSpace===an?null:oe.getPrimaries(x.colorSpace),At=x.colorSpace===an||gt===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);const Ot=d(x)&&p(x.image)===!1;let at=_(x.image,Ot,!1,r.maxTextureSize);at=mt(x,at);const re=p(at)||o,Yt=s.convert(x.format,x.colorSpace);let Ht=s.convert(x.type),Dt=E(x.internalFormat,Yt,Ht,x.colorSpace,x.isVideoTexture);V(tt,x,re);let St;const C=x.mipmaps,ct=o&&x.isVideoTexture!==!0&&Dt!==Bc,Ct=Et.__version===void 0||et===!0,bt=P(x,at,re);if(x.isDepthTexture)Dt=i.DEPTH_COMPONENT,o?x.type===Zn?Dt=i.DEPTH_COMPONENT32F:x.type===jn?Dt=i.DEPTH_COMPONENT24:x.type===_i?Dt=i.DEPTH24_STENCIL8:Dt=i.DEPTH_COMPONENT16:x.type===Zn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),x.format===xi&&Dt===i.DEPTH_COMPONENT&&x.type!==aa&&x.type!==jn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),x.type=jn,Ht=s.convert(x.type)),x.format===cr&&Dt===i.DEPTH_COMPONENT&&(Dt=i.DEPTH_STENCIL,x.type!==_i&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),x.type=_i,Ht=s.convert(x.type))),Ct&&(ct?e.texStorage2D(i.TEXTURE_2D,1,Dt,at.width,at.height):e.texImage2D(i.TEXTURE_2D,0,Dt,at.width,at.height,0,Yt,Ht,null));else if(x.isDataTexture)if(C.length>0&&re){ct&&Ct&&e.texStorage2D(i.TEXTURE_2D,bt,Dt,C[0].width,C[0].height);for(let lt=0,I=C.length;lt<I;lt++)St=C[lt],ct?e.texSubImage2D(i.TEXTURE_2D,lt,0,0,St.width,St.height,Yt,Ht,St.data):e.texImage2D(i.TEXTURE_2D,lt,Dt,St.width,St.height,0,Yt,Ht,St.data);x.generateMipmaps=!1}else ct?(Ct&&e.texStorage2D(i.TEXTURE_2D,bt,Dt,at.width,at.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,at.width,at.height,Yt,Ht,at.data)):e.texImage2D(i.TEXTURE_2D,0,Dt,at.width,at.height,0,Yt,Ht,at.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){ct&&Ct&&e.texStorage3D(i.TEXTURE_2D_ARRAY,bt,Dt,C[0].width,C[0].height,at.depth);for(let lt=0,I=C.length;lt<I;lt++)St=C[lt],x.format!==vn?Yt!==null?ct?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,lt,0,0,0,St.width,St.height,at.depth,Yt,St.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,lt,Dt,St.width,St.height,at.depth,0,St.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ct?e.texSubImage3D(i.TEXTURE_2D_ARRAY,lt,0,0,0,St.width,St.height,at.depth,Yt,Ht,St.data):e.texImage3D(i.TEXTURE_2D_ARRAY,lt,Dt,St.width,St.height,at.depth,0,Yt,Ht,St.data)}else{ct&&Ct&&e.texStorage2D(i.TEXTURE_2D,bt,Dt,C[0].width,C[0].height);for(let lt=0,I=C.length;lt<I;lt++)St=C[lt],x.format!==vn?Yt!==null?ct?e.compressedTexSubImage2D(i.TEXTURE_2D,lt,0,0,St.width,St.height,Yt,St.data):e.compressedTexImage2D(i.TEXTURE_2D,lt,Dt,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ct?e.texSubImage2D(i.TEXTURE_2D,lt,0,0,St.width,St.height,Yt,Ht,St.data):e.texImage2D(i.TEXTURE_2D,lt,Dt,St.width,St.height,0,Yt,Ht,St.data)}else if(x.isDataArrayTexture)ct?(Ct&&e.texStorage3D(i.TEXTURE_2D_ARRAY,bt,Dt,at.width,at.height,at.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,Yt,Ht,at.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Dt,at.width,at.height,at.depth,0,Yt,Ht,at.data);else if(x.isData3DTexture)ct?(Ct&&e.texStorage3D(i.TEXTURE_3D,bt,Dt,at.width,at.height,at.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,Yt,Ht,at.data)):e.texImage3D(i.TEXTURE_3D,0,Dt,at.width,at.height,at.depth,0,Yt,Ht,at.data);else if(x.isFramebufferTexture){if(Ct)if(ct)e.texStorage2D(i.TEXTURE_2D,bt,Dt,at.width,at.height);else{let lt=at.width,I=at.height;for(let ut=0;ut<bt;ut++)e.texImage2D(i.TEXTURE_2D,ut,Dt,lt,I,0,Yt,Ht,null),lt>>=1,I>>=1}}else if(C.length>0&&re){ct&&Ct&&e.texStorage2D(i.TEXTURE_2D,bt,Dt,C[0].width,C[0].height);for(let lt=0,I=C.length;lt<I;lt++)St=C[lt],ct?e.texSubImage2D(i.TEXTURE_2D,lt,0,0,Yt,Ht,St):e.texImage2D(i.TEXTURE_2D,lt,Dt,Yt,Ht,St);x.generateMipmaps=!1}else ct?(Ct&&e.texStorage2D(i.TEXTURE_2D,bt,Dt,at.width,at.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Yt,Ht,at)):e.texImage2D(i.TEXTURE_2D,0,Dt,Yt,Ht,at);y(x,re)&&S(tt),Et.__version=ot.version,x.onUpdate&&x.onUpdate(x)}M.__version=x.version}function ht(M,x,G){if(x.image.length!==6)return;const tt=J(M,x),et=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,M.__webglTexture,i.TEXTURE0+G);const ot=n.get(et);if(et.version!==ot.__version||tt===!0){e.activeTexture(i.TEXTURE0+G);const Et=oe.getPrimaries(oe.workingColorSpace),gt=x.colorSpace===an?null:oe.getPrimaries(x.colorSpace),vt=x.colorSpace===an||Et===gt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const At=x.isCompressedTexture||x.image[0].isCompressedTexture,Ot=x.image[0]&&x.image[0].isDataTexture,at=[];for(let lt=0;lt<6;lt++)!At&&!Ot?at[lt]=_(x.image[lt],!1,!0,r.maxCubemapSize):at[lt]=Ot?x.image[lt].image:x.image[lt],at[lt]=mt(x,at[lt]);const re=at[0],Yt=p(re)||o,Ht=s.convert(x.format,x.colorSpace),Dt=s.convert(x.type),St=E(x.internalFormat,Ht,Dt,x.colorSpace),C=o&&x.isVideoTexture!==!0,ct=ot.__version===void 0||tt===!0;let Ct=P(x,re,Yt);V(i.TEXTURE_CUBE_MAP,x,Yt);let bt;if(At){C&&ct&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ct,St,re.width,re.height);for(let lt=0;lt<6;lt++){bt=at[lt].mipmaps;for(let I=0;I<bt.length;I++){const ut=bt[I];x.format!==vn?Ht!==null?C?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,I,0,0,ut.width,ut.height,Ht,ut.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,I,St,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):C?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,I,0,0,ut.width,ut.height,Ht,Dt,ut.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,I,St,ut.width,ut.height,0,Ht,Dt,ut.data)}}}else{bt=x.mipmaps,C&&ct&&(bt.length>0&&Ct++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Ct,St,at[0].width,at[0].height));for(let lt=0;lt<6;lt++)if(Ot){C?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,at[lt].width,at[lt].height,Ht,Dt,at[lt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,St,at[lt].width,at[lt].height,0,Ht,Dt,at[lt].data);for(let I=0;I<bt.length;I++){const xt=bt[I].image[lt].image;C?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,I+1,0,0,xt.width,xt.height,Ht,Dt,xt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,I+1,St,xt.width,xt.height,0,Ht,Dt,xt.data)}}else{C?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,Ht,Dt,at[lt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,St,Ht,Dt,at[lt]);for(let I=0;I<bt.length;I++){const ut=bt[I];C?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,I+1,0,0,Ht,Dt,ut.image[lt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,I+1,St,Ht,Dt,ut.image[lt])}}}y(x,Yt)&&S(i.TEXTURE_CUBE_MAP),ot.__version=et.version,x.onUpdate&&x.onUpdate(x)}M.__version=x.version}function ft(M,x,G,tt,et,ot){const Et=s.convert(G.format,G.colorSpace),gt=s.convert(G.type),vt=E(G.internalFormat,Et,gt,G.colorSpace);if(!n.get(x).__hasExternalTextures){const Ot=Math.max(1,x.width>>ot),at=Math.max(1,x.height>>ot);et===i.TEXTURE_3D||et===i.TEXTURE_2D_ARRAY?e.texImage3D(et,ot,vt,Ot,at,x.depth,0,Et,gt,null):e.texImage2D(et,ot,vt,Ot,at,0,Et,gt,null)}e.bindFramebuffer(i.FRAMEBUFFER,M),_t(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,tt,et,n.get(G).__webglTexture,0,N(x)):(et===i.TEXTURE_2D||et>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,tt,et,n.get(G).__webglTexture,ot),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Mt(M,x,G){if(i.bindRenderbuffer(i.RENDERBUFFER,M),x.depthBuffer&&!x.stencilBuffer){let tt=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(G||_t(x)){const et=x.depthTexture;et&&et.isDepthTexture&&(et.type===Zn?tt=i.DEPTH_COMPONENT32F:et.type===jn&&(tt=i.DEPTH_COMPONENT24));const ot=N(x);_t(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot,tt,x.width,x.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ot,tt,x.width,x.height)}else i.renderbufferStorage(i.RENDERBUFFER,tt,x.width,x.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,M)}else if(x.depthBuffer&&x.stencilBuffer){const tt=N(x);G&&_t(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,tt,i.DEPTH24_STENCIL8,x.width,x.height):_t(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,tt,i.DEPTH24_STENCIL8,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,M)}else{const tt=x.isWebGLMultipleRenderTargets===!0?x.texture:[x.texture];for(let et=0;et<tt.length;et++){const ot=tt[et],Et=s.convert(ot.format,ot.colorSpace),gt=s.convert(ot.type),vt=E(ot.internalFormat,Et,gt,ot.colorSpace),At=N(x);G&&_t(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,At,vt,x.width,x.height):_t(x)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,At,vt,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,vt,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pt(M,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,M),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W(x.depthTexture,0);const tt=n.get(x.depthTexture).__webglTexture,et=N(x);if(x.depthTexture.format===xi)_t(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,tt,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,tt,0);else if(x.depthTexture.format===cr)_t(x)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,tt,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function wt(M){const x=n.get(M),G=M.isWebGLCubeRenderTarget===!0;if(M.depthTexture&&!x.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");Pt(x.__webglFramebuffer,M)}else if(G){x.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[tt]),x.__webglDepthbuffer[tt]=i.createRenderbuffer(),Mt(x.__webglDepthbuffer[tt],M,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer=i.createRenderbuffer(),Mt(x.__webglDepthbuffer,M,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function L(M,x,G){const tt=n.get(M);x!==void 0&&ft(tt.__webglFramebuffer,M,M.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&wt(M)}function R(M){const x=M.texture,G=n.get(M),tt=n.get(x);M.addEventListener("dispose",Z),M.isWebGLMultipleRenderTargets!==!0&&(tt.__webglTexture===void 0&&(tt.__webglTexture=i.createTexture()),tt.__version=x.version,a.memory.textures++);const et=M.isWebGLCubeRenderTarget===!0,ot=M.isWebGLMultipleRenderTargets===!0,Et=p(M)||o;if(et){G.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(o&&x.mipmaps&&x.mipmaps.length>0){G.__webglFramebuffer[gt]=[];for(let vt=0;vt<x.mipmaps.length;vt++)G.__webglFramebuffer[gt][vt]=i.createFramebuffer()}else G.__webglFramebuffer[gt]=i.createFramebuffer()}else{if(o&&x.mipmaps&&x.mipmaps.length>0){G.__webglFramebuffer=[];for(let gt=0;gt<x.mipmaps.length;gt++)G.__webglFramebuffer[gt]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(ot)if(r.drawBuffers){const gt=M.texture;for(let vt=0,At=gt.length;vt<At;vt++){const Ot=n.get(gt[vt]);Ot.__webglTexture===void 0&&(Ot.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&M.samples>0&&_t(M)===!1){const gt=ot?x:[x];G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let vt=0;vt<gt.length;vt++){const At=gt[vt];G.__webglColorRenderbuffer[vt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[vt]);const Ot=s.convert(At.format,At.colorSpace),at=s.convert(At.type),re=E(At.internalFormat,Ot,at,At.colorSpace,M.isXRRenderTarget===!0),Yt=N(M);i.renderbufferStorageMultisample(i.RENDERBUFFER,Yt,re,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,G.__webglColorRenderbuffer[vt])}i.bindRenderbuffer(i.RENDERBUFFER,null),M.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),Mt(G.__webglDepthRenderbuffer,M,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(et){e.bindTexture(i.TEXTURE_CUBE_MAP,tt.__webglTexture),V(i.TEXTURE_CUBE_MAP,x,Et);for(let gt=0;gt<6;gt++)if(o&&x.mipmaps&&x.mipmaps.length>0)for(let vt=0;vt<x.mipmaps.length;vt++)ft(G.__webglFramebuffer[gt][vt],M,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,vt);else ft(G.__webglFramebuffer[gt],M,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);y(x,Et)&&S(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ot){const gt=M.texture;for(let vt=0,At=gt.length;vt<At;vt++){const Ot=gt[vt],at=n.get(Ot);e.bindTexture(i.TEXTURE_2D,at.__webglTexture),V(i.TEXTURE_2D,Ot,Et),ft(G.__webglFramebuffer,M,Ot,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,0),y(Ot,Et)&&S(i.TEXTURE_2D)}e.unbindTexture()}else{let gt=i.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(o?gt=M.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(gt,tt.__webglTexture),V(gt,x,Et),o&&x.mipmaps&&x.mipmaps.length>0)for(let vt=0;vt<x.mipmaps.length;vt++)ft(G.__webglFramebuffer[vt],M,x,i.COLOR_ATTACHMENT0,gt,vt);else ft(G.__webglFramebuffer,M,x,i.COLOR_ATTACHMENT0,gt,0);y(x,Et)&&S(gt),e.unbindTexture()}M.depthBuffer&&wt(M)}function j(M){const x=p(M)||o,G=M.isWebGLMultipleRenderTargets===!0?M.texture:[M.texture];for(let tt=0,et=G.length;tt<et;tt++){const ot=G[tt];if(y(ot,x)){const Et=M.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,gt=n.get(ot).__webglTexture;e.bindTexture(Et,gt),S(Et),e.unbindTexture()}}}function rt(M){if(o&&M.samples>0&&_t(M)===!1){const x=M.isWebGLMultipleRenderTargets?M.texture:[M.texture],G=M.width,tt=M.height;let et=i.COLOR_BUFFER_BIT;const ot=[],Et=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=n.get(M),vt=M.isWebGLMultipleRenderTargets===!0;if(vt)for(let At=0;At<x.length;At++)e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let At=0;At<x.length;At++){ot.push(i.COLOR_ATTACHMENT0+At),M.depthBuffer&&ot.push(Et);const Ot=gt.__ignoreDepthValues!==void 0?gt.__ignoreDepthValues:!1;if(Ot===!1&&(M.depthBuffer&&(et|=i.DEPTH_BUFFER_BIT),M.stencilBuffer&&(et|=i.STENCIL_BUFFER_BIT)),vt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,gt.__webglColorRenderbuffer[At]),Ot===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Et]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Et])),vt){const at=n.get(x[At]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,at,0)}i.blitFramebuffer(0,0,G,tt,0,0,G,tt,et,i.NEAREST),c&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ot)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),vt)for(let At=0;At<x.length;At++){e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,gt.__webglColorRenderbuffer[At]);const Ot=n.get(x[At]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,Ot,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}}function N(M){return Math.min(r.maxSamples,M.samples)}function _t(M){const x=n.get(M);return o&&M.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Tt(M){const x=a.render.frame;u.get(M)!==x&&(u.set(M,x),M.update())}function mt(M,x){const G=M.colorSpace,tt=M.format,et=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||M.format===Ko||G!==Bn&&G!==an&&(oe.getTransfer(G)===he?o===!1?t.has("EXT_sRGB")===!0&&tt===vn?(M.format=Ko,M.minFilter=en,M.generateMipmaps=!1):x=Wc.sRGBToLinear(x):(tt!==vn||et!==Qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),x}this.allocateTextureUnit=U,this.resetTextureUnits=Q,this.setTexture2D=W,this.setTexture2DArray=D,this.setTexture3D=B,this.setTextureCube=X,this.rebindTextures=L,this.setupRenderTarget=R,this.updateRenderTargetMipmap=j,this.updateMultisampleRenderTarget=rt,this.setupDepthRenderbuffer=wt,this.setupFrameBufferTexture=ft,this.useMultisampledRTT=_t}function I0(i,t,e){const n=e.isWebGL2;function r(s,a=an){let o;const l=oe.getTransfer(a);if(s===Qn)return i.UNSIGNED_BYTE;if(s===Ic)return i.UNSIGNED_SHORT_4_4_4_4;if(s===Nc)return i.UNSIGNED_SHORT_5_5_5_1;if(s===dh)return i.BYTE;if(s===ph)return i.SHORT;if(s===aa)return i.UNSIGNED_SHORT;if(s===Uc)return i.INT;if(s===jn)return i.UNSIGNED_INT;if(s===Zn)return i.FLOAT;if(s===Pr)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(s===mh)return i.ALPHA;if(s===vn)return i.RGBA;if(s===gh)return i.LUMINANCE;if(s===_h)return i.LUMINANCE_ALPHA;if(s===xi)return i.DEPTH_COMPONENT;if(s===cr)return i.DEPTH_STENCIL;if(s===Ko)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(s===xh)return i.RED;if(s===Oc)return i.RED_INTEGER;if(s===vh)return i.RG;if(s===Fc)return i.RG_INTEGER;if(s===zc)return i.RGBA_INTEGER;if(s===ro||s===so||s===oo||s===ao)if(l===he)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(s===ro)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===so)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===oo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===ao)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(s===ro)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===so)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===oo)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===ao)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Ua||s===Ia||s===Na||s===Oa)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(s===Ua)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Ia)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Na)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Oa)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Bc)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===Fa||s===za)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(s===Fa)return l===he?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(s===za)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===Ba||s===Ha||s===ka||s===Ga||s===Va||s===Wa||s===Xa||s===Ya||s===qa||s===$a||s===ja||s===Za||s===Ka||s===Ja)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(s===Ba)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===Ha)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===ka)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Ga)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Va)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===Wa)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===Xa)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===Ya)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===qa)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===$a)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===ja)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===Za)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Ka)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Ja)return l===he?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===lo||s===Qa||s===tl)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(s===lo)return l===he?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Qa)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===tl)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===Mh||s===el||s===nl||s===il)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(s===lo)return o.COMPRESSED_RED_RGTC1_EXT;if(s===el)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===nl)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===il)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===_i?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[s]!==void 0?i[s]:null}return{convert:r}}class N0 extends rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ie extends ye{constructor(){super(),this.isGroup=!0,this.type="Group"}}const O0={type:"move"};class Uo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ie,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ie,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ie,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const p=e.getJointPose(_,n),d=this._getHandJoint(c,_);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),m=.02,g=.005;c.inputState.pinching&&h>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(O0)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ie;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class F0 extends Ai{constructor(t,e){super();const n=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,h=null,m=null,g=null;const _=e.getContextAttributes();let p=null,d=null;const y=[],S=[],E=new Nt;let P=null;const w=new rn;w.layers.enable(1),w.viewport=new De;const A=new rn;A.layers.enable(2),A.viewport=new De;const Z=[w,A],v=new N0;v.layers.enable(1),v.layers.enable(2);let T=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let J=y[V];return J===void 0&&(J=new Uo,y[V]=J),J.getTargetRaySpace()},this.getControllerGrip=function(V){let J=y[V];return J===void 0&&(J=new Uo,y[V]=J),J.getGripSpace()},this.getHand=function(V){let J=y[V];return J===void 0&&(J=new Uo,y[V]=J),J.getHandSpace()};function H(V){const J=S.indexOf(V.inputSource);if(J===-1)return;const st=y[J];st!==void 0&&(st.update(V.inputSource,V.frame,c||a),st.dispatchEvent({type:V.type,data:V.inputSource}))}function Q(){r.removeEventListener("select",H),r.removeEventListener("selectstart",H),r.removeEventListener("selectend",H),r.removeEventListener("squeeze",H),r.removeEventListener("squeezestart",H),r.removeEventListener("squeezeend",H),r.removeEventListener("end",Q),r.removeEventListener("inputsourceschange",U);for(let V=0;V<y.length;V++){const J=S[V];J!==null&&(S[V]=null,y[V].disconnect(J))}T=null,O=null,t.setRenderTarget(p),m=null,h=null,f=null,r=null,d=null,it.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){s=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(V){if(r=V,r!==null){if(p=t.getRenderTarget(),r.addEventListener("select",H),r.addEventListener("selectstart",H),r.addEventListener("selectend",H),r.addEventListener("squeeze",H),r.addEventListener("squeezestart",H),r.addEventListener("squeezeend",H),r.addEventListener("end",Q),r.addEventListener("inputsourceschange",U),_.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(E),r.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const J={antialias:r.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,e,J),r.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),d=new Mi(m.framebufferWidth,m.framebufferHeight,{format:vn,type:Qn,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let J=null,st=null,ht=null;_.depth&&(ht=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=_.stencil?cr:xi,st=_.stencil?_i:jn);const ft={colorFormat:e.RGBA8,depthFormat:ht,scaleFactor:s};f=new XRWebGLBinding(r,e),h=f.createProjectionLayer(ft),r.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),d=new Mi(h.textureWidth,h.textureHeight,{format:vn,type:Qn,depthTexture:new eu(h.textureWidth,h.textureHeight,st,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const Mt=t.properties.get(d);Mt.__ignoreDepthValues=h.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),it.setContext(r),it.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function U(V){for(let J=0;J<V.removed.length;J++){const st=V.removed[J],ht=S.indexOf(st);ht>=0&&(S[ht]=null,y[ht].disconnect(st))}for(let J=0;J<V.added.length;J++){const st=V.added[J];let ht=S.indexOf(st);if(ht===-1){for(let Mt=0;Mt<y.length;Mt++)if(Mt>=S.length){S.push(st),ht=Mt;break}else if(S[Mt]===null){S[Mt]=st,ht=Mt;break}if(ht===-1)break}const ft=y[ht];ft&&ft.connect(st)}}const z=new F,W=new F;function D(V,J,st){z.setFromMatrixPosition(J.matrixWorld),W.setFromMatrixPosition(st.matrixWorld);const ht=z.distanceTo(W),ft=J.projectionMatrix.elements,Mt=st.projectionMatrix.elements,Pt=ft[14]/(ft[10]-1),wt=ft[14]/(ft[10]+1),L=(ft[9]+1)/ft[5],R=(ft[9]-1)/ft[5],j=(ft[8]-1)/ft[0],rt=(Mt[8]+1)/Mt[0],N=Pt*j,_t=Pt*rt,Tt=ht/(-j+rt),mt=Tt*-j;J.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(mt),V.translateZ(Tt),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert();const M=Pt+Tt,x=wt+Tt,G=N-mt,tt=_t+(ht-mt),et=L*wt/x*M,ot=R*wt/x*M;V.projectionMatrix.makePerspective(G,tt,et,ot,M,x),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}function B(V,J){J===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(J.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(r===null)return;v.near=A.near=w.near=V.near,v.far=A.far=w.far=V.far,(T!==v.near||O!==v.far)&&(r.updateRenderState({depthNear:v.near,depthFar:v.far}),T=v.near,O=v.far);const J=V.parent,st=v.cameras;B(v,J);for(let ht=0;ht<st.length;ht++)B(st[ht],J);st.length===2?D(v,w,A):v.projectionMatrix.copy(w.projectionMatrix),X(V,v,J)};function X(V,J,st){st===null?V.matrix.copy(J.matrixWorld):(V.matrix.copy(st.matrixWorld),V.matrix.invert(),V.matrix.multiply(J.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(J.projectionMatrix),V.projectionMatrixInverse.copy(J.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Jo*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(V){l=V,h!==null&&(h.fixedFoveation=V),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=V)};let K=null;function nt(V,J){if(u=J.getViewerPose(c||a),g=J,u!==null){const st=u.views;m!==null&&(t.setRenderTargetFramebuffer(d,m.framebuffer),t.setRenderTarget(d));let ht=!1;st.length!==v.cameras.length&&(v.cameras.length=0,ht=!0);for(let ft=0;ft<st.length;ft++){const Mt=st[ft];let Pt=null;if(m!==null)Pt=m.getViewport(Mt);else{const L=f.getViewSubImage(h,Mt);Pt=L.viewport,ft===0&&(t.setRenderTargetTextures(d,L.colorTexture,h.ignoreDepthValues?void 0:L.depthStencilTexture),t.setRenderTarget(d))}let wt=Z[ft];wt===void 0&&(wt=new rn,wt.layers.enable(ft),wt.viewport=new De,Z[ft]=wt),wt.matrix.fromArray(Mt.transform.matrix),wt.matrix.decompose(wt.position,wt.quaternion,wt.scale),wt.projectionMatrix.fromArray(Mt.projectionMatrix),wt.projectionMatrixInverse.copy(wt.projectionMatrix).invert(),wt.viewport.set(Pt.x,Pt.y,Pt.width,Pt.height),ft===0&&(v.matrix.copy(wt.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),ht===!0&&v.cameras.push(wt)}}for(let st=0;st<y.length;st++){const ht=S[st],ft=y[st];ht!==null&&ft!==void 0&&ft.update(ht,J,c||a)}K&&K(V,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const it=new Qc;it.setAnimationLoop(nt),this.setAnimationLoop=function(V){K=V},this.dispose=function(){}}}function z0(i,t){function e(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function n(p,d){d.color.getRGB(p.fogColor.value,Zc(i)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function r(p,d,y,S,E){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(p,d):d.isMeshToonMaterial?(s(p,d),f(p,d)):d.isMeshPhongMaterial?(s(p,d),u(p,d)):d.isMeshStandardMaterial?(s(p,d),h(p,d),d.isMeshPhysicalMaterial&&m(p,d,E)):d.isMeshMatcapMaterial?(s(p,d),g(p,d)):d.isMeshDepthMaterial?s(p,d):d.isMeshDistanceMaterial?(s(p,d),_(p,d)):d.isMeshNormalMaterial?s(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&o(p,d)):d.isPointsMaterial?l(p,d,y,S):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,e(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===He&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,e(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===He&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,e(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,e(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const y=t.get(d).envMap;if(y&&(p.envMap.value=y,p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap){p.lightMap.value=d.lightMap;const S=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=d.lightMapIntensity*S,e(d.lightMap,p.lightMapTransform)}d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform))}function o(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,y,S){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*y,p.scale.value=S*.5,d.map&&(p.map.value=d.map,e(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function u(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function f(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function h(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,p.roughnessMapTransform)),t.get(d).envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,y){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===He&&p.clearcoatNormalScale.value.negate())),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,d){d.matcap&&(p.matcap.value=d.matcap)}function _(p,d){const y=t.get(d).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function B0(i,t,e,n){let r={},s={},a=[];const o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(y,S){const E=S.program;n.uniformBlockBinding(y,E)}function c(y,S){let E=r[y.id];E===void 0&&(g(y),E=u(y),r[y.id]=E,y.addEventListener("dispose",p));const P=S.program;n.updateUBOMapping(y,P);const w=t.render.frame;s[y.id]!==w&&(h(y),s[y.id]=w)}function u(y){const S=f();y.__bindingPointIndex=S;const E=i.createBuffer(),P=y.__size,w=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,P,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,E),E}function f(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(y){const S=r[y.id],E=y.uniforms,P=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let w=0,A=E.length;w<A;w++){const Z=Array.isArray(E[w])?E[w]:[E[w]];for(let v=0,T=Z.length;v<T;v++){const O=Z[v];if(m(O,w,v,P)===!0){const H=O.__offset,Q=Array.isArray(O.value)?O.value:[O.value];let U=0;for(let z=0;z<Q.length;z++){const W=Q[z],D=_(W);typeof W=="number"||typeof W=="boolean"?(O.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,H+U,O.__data)):W.isMatrix3?(O.__data[0]=W.elements[0],O.__data[1]=W.elements[1],O.__data[2]=W.elements[2],O.__data[3]=0,O.__data[4]=W.elements[3],O.__data[5]=W.elements[4],O.__data[6]=W.elements[5],O.__data[7]=0,O.__data[8]=W.elements[6],O.__data[9]=W.elements[7],O.__data[10]=W.elements[8],O.__data[11]=0):(W.toArray(O.__data,U),U+=D.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,H,O.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(y,S,E,P){const w=y.value,A=S+"_"+E;if(P[A]===void 0)return typeof w=="number"||typeof w=="boolean"?P[A]=w:P[A]=w.clone(),!0;{const Z=P[A];if(typeof w=="number"||typeof w=="boolean"){if(Z!==w)return P[A]=w,!0}else if(Z.equals(w)===!1)return Z.copy(w),!0}return!1}function g(y){const S=y.uniforms;let E=0;const P=16;for(let A=0,Z=S.length;A<Z;A++){const v=Array.isArray(S[A])?S[A]:[S[A]];for(let T=0,O=v.length;T<O;T++){const H=v[T],Q=Array.isArray(H.value)?H.value:[H.value];for(let U=0,z=Q.length;U<z;U++){const W=Q[U],D=_(W),B=E%P;B!==0&&P-B<D.boundary&&(E+=P-B),H.__data=new Float32Array(D.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=E,E+=D.storage}}}const w=E%P;return w>0&&(E+=P-w),y.__size=E,y.__cache={},this}function _(y){const S={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(S.boundary=4,S.storage=4):y.isVector2?(S.boundary=8,S.storage=8):y.isVector3||y.isColor?(S.boundary=16,S.storage=12):y.isVector4?(S.boundary=16,S.storage=16):y.isMatrix3?(S.boundary=48,S.storage=48):y.isMatrix4?(S.boundary=64,S.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),S}function p(y){const S=y.target;S.removeEventListener("dispose",p);const E=a.indexOf(S.__bindingPointIndex);a.splice(E,1),i.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function d(){for(const y in r)i.deleteBuffer(r[y]);a=[],r={},s={}}return{bind:l,update:c,dispose:d}}class au{constructor(t={}){const{canvas:e=Ih(),context:n=null,depth:r=!0,stencil:s=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let h;n!==null?h=n.getContextAttributes().alpha:h=a;const m=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const d=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=de,this._useLegacyLights=!1,this.toneMapping=Jn,this.toneMappingExposure=1;const S=this;let E=!1,P=0,w=0,A=null,Z=-1,v=null;const T=new De,O=new De;let H=null;const Q=new Kt(0);let U=0,z=e.width,W=e.height,D=1,B=null,X=null;const K=new De(0,0,z,W),nt=new De(0,0,z,W);let it=!1;const V=new ha;let J=!1,st=!1,ht=null;const ft=new ce,Mt=new Nt,Pt=new F,wt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function L(){return A===null?D:1}let R=n;function j(b,k){for(let q=0;q<b.length;q++){const $=b[q],Y=e.getContext($,k);if(Y!==null)return Y}return null}try{const b={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${oa}`),e.addEventListener("webglcontextlost",lt,!1),e.addEventListener("webglcontextrestored",I,!1),e.addEventListener("webglcontextcreationerror",ut,!1),R===null){const k=["webgl2","webgl","experimental-webgl"];if(S.isWebGL1Renderer===!0&&k.shift(),R=j(k,b),R===null)throw j(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&R instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),R.getShaderPrecisionFormat===void 0&&(R.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let rt,N,_t,Tt,mt,M,x,G,tt,et,ot,Et,gt,vt,At,Ot,at,re,Yt,Ht,Dt,St,C,ct;function Ct(){rt=new jp(R),N=new Vp(R,rt,t),rt.init(N),St=new I0(R,rt,N),_t=new D0(R,rt,N),Tt=new Jp(R),mt=new x0,M=new U0(R,rt,_t,mt,N,St,Tt),x=new Xp(S),G=new $p(S),tt=new of(R,N),C=new kp(R,rt,tt,N),et=new Zp(R,tt,Tt,C),ot=new nm(R,et,tt,Tt),Yt=new em(R,N,M),Ot=new Wp(mt),Et=new _0(S,x,G,rt,N,C,Ot),gt=new z0(S,mt),vt=new M0,At=new w0(rt,N),re=new Hp(S,x,G,_t,ot,h,l),at=new P0(S,ot,N),ct=new B0(R,Tt,N,_t),Ht=new Gp(R,rt,Tt,N),Dt=new Kp(R,rt,Tt,N),Tt.programs=Et.programs,S.capabilities=N,S.extensions=rt,S.properties=mt,S.renderLists=vt,S.shadowMap=at,S.state=_t,S.info=Tt}Ct();const bt=new F0(S,R);this.xr=bt,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const b=rt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=rt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return D},this.setPixelRatio=function(b){b!==void 0&&(D=b,this.setSize(z,W,!1))},this.getSize=function(b){return b.set(z,W)},this.setSize=function(b,k,q=!0){if(bt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=b,W=k,e.width=Math.floor(b*D),e.height=Math.floor(k*D),q===!0&&(e.style.width=b+"px",e.style.height=k+"px"),this.setViewport(0,0,b,k)},this.getDrawingBufferSize=function(b){return b.set(z*D,W*D).floor()},this.setDrawingBufferSize=function(b,k,q){z=b,W=k,D=q,e.width=Math.floor(b*q),e.height=Math.floor(k*q),this.setViewport(0,0,b,k)},this.getCurrentViewport=function(b){return b.copy(T)},this.getViewport=function(b){return b.copy(K)},this.setViewport=function(b,k,q,$){b.isVector4?K.set(b.x,b.y,b.z,b.w):K.set(b,k,q,$),_t.viewport(T.copy(K).multiplyScalar(D).floor())},this.getScissor=function(b){return b.copy(nt)},this.setScissor=function(b,k,q,$){b.isVector4?nt.set(b.x,b.y,b.z,b.w):nt.set(b,k,q,$),_t.scissor(O.copy(nt).multiplyScalar(D).floor())},this.getScissorTest=function(){return it},this.setScissorTest=function(b){_t.setScissorTest(it=b)},this.setOpaqueSort=function(b){B=b},this.setTransparentSort=function(b){X=b},this.getClearColor=function(b){return b.copy(re.getClearColor())},this.setClearColor=function(){re.setClearColor.apply(re,arguments)},this.getClearAlpha=function(){return re.getClearAlpha()},this.setClearAlpha=function(){re.setClearAlpha.apply(re,arguments)},this.clear=function(b=!0,k=!0,q=!0){let $=0;if(b){let Y=!1;if(A!==null){const yt=A.texture.format;Y=yt===zc||yt===Fc||yt===Oc}if(Y){const yt=A.texture.type,Lt=yt===Qn||yt===jn||yt===aa||yt===_i||yt===Ic||yt===Nc,Bt=re.getClearColor(),kt=re.getClearAlpha(),qt=Bt.r,Gt=Bt.g,Vt=Bt.b;Lt?(m[0]=qt,m[1]=Gt,m[2]=Vt,m[3]=kt,R.clearBufferuiv(R.COLOR,0,m)):(g[0]=qt,g[1]=Gt,g[2]=Vt,g[3]=kt,R.clearBufferiv(R.COLOR,0,g))}else $|=R.COLOR_BUFFER_BIT}k&&($|=R.DEPTH_BUFFER_BIT),q&&($|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",lt,!1),e.removeEventListener("webglcontextrestored",I,!1),e.removeEventListener("webglcontextcreationerror",ut,!1),vt.dispose(),At.dispose(),mt.dispose(),x.dispose(),G.dispose(),ot.dispose(),C.dispose(),ct.dispose(),Et.dispose(),bt.dispose(),bt.removeEventListener("sessionstart",ve),bt.removeEventListener("sessionend",ne),ht&&(ht.dispose(),ht=null),Ee.stop()};function lt(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function I(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const b=Tt.autoReset,k=at.enabled,q=at.autoUpdate,$=at.needsUpdate,Y=at.type;Ct(),Tt.autoReset=b,at.enabled=k,at.autoUpdate=q,at.needsUpdate=$,at.type=Y}function ut(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function xt(b){const k=b.target;k.removeEventListener("dispose",xt),zt(k)}function zt(b){It(b),mt.remove(b)}function It(b){const k=mt.get(b).programs;k!==void 0&&(k.forEach(function(q){Et.releaseProgram(q)}),b.isShaderMaterial&&Et.releaseShaderCache(b))}this.renderBufferDirect=function(b,k,q,$,Y,yt){k===null&&(k=wt);const Lt=Y.isMesh&&Y.matrixWorld.determinant()<0,Bt=Lu(b,k,q,$,Y);_t.setMaterial($,Lt);let kt=q.index,qt=1;if($.wireframe===!0){if(kt=et.getWireframeAttribute(q),kt===void 0)return;qt=2}const Gt=q.drawRange,Vt=q.attributes.position;let Me=Gt.start*qt,qe=(Gt.start+Gt.count)*qt;yt!==null&&(Me=Math.max(Me,yt.start*qt),qe=Math.min(qe,(yt.start+yt.count)*qt)),kt!==null?(Me=Math.max(Me,0),qe=Math.min(qe,kt.count)):Vt!=null&&(Me=Math.max(Me,0),qe=Math.min(qe,Vt.count));const Ce=qe-Me;if(Ce<0||Ce===1/0)return;C.setup(Y,$,Bt,q,kt);let An,fe=Ht;if(kt!==null&&(An=tt.get(kt),fe=Dt,fe.setIndex(An)),Y.isMesh)$.wireframe===!0?(_t.setLineWidth($.wireframeLinewidth*L()),fe.setMode(R.LINES)):fe.setMode(R.TRIANGLES);else if(Y.isLine){let $t=$.linewidth;$t===void 0&&($t=1),_t.setLineWidth($t*L()),Y.isLineSegments?fe.setMode(R.LINES):Y.isLineLoop?fe.setMode(R.LINE_LOOP):fe.setMode(R.LINE_STRIP)}else Y.isPoints?fe.setMode(R.POINTS):Y.isSprite&&fe.setMode(R.TRIANGLES);if(Y.isBatchedMesh)fe.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else if(Y.isInstancedMesh)fe.renderInstances(Me,Ce,Y.count);else if(q.isInstancedBufferGeometry){const $t=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Qs=Math.min(q.instanceCount,$t);fe.renderInstances(Me,Ce,Qs)}else fe.render(Me,Ce)};function Qt(b,k,q){b.transparent===!0&&b.side===on&&b.forceSinglePass===!1?(b.side=He,b.needsUpdate=!0,Hr(b,k,q),b.side=ni,b.needsUpdate=!0,Hr(b,k,q),b.side=on):Hr(b,k,q)}this.compile=function(b,k,q=null){q===null&&(q=b),p=At.get(q),p.init(),y.push(p),q.traverseVisible(function(Y){Y.isLight&&Y.layers.test(k.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),b!==q&&b.traverseVisible(function(Y){Y.isLight&&Y.layers.test(k.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights(S._useLegacyLights);const $=new Set;return b.traverse(function(Y){const yt=Y.material;if(yt)if(Array.isArray(yt))for(let Lt=0;Lt<yt.length;Lt++){const Bt=yt[Lt];Qt(Bt,q,Y),$.add(Bt)}else Qt(yt,q,Y),$.add(yt)}),y.pop(),p=null,$},this.compileAsync=function(b,k,q=null){const $=this.compile(b,k,q);return new Promise(Y=>{function yt(){if($.forEach(function(Lt){mt.get(Lt).currentProgram.isReady()&&$.delete(Lt)}),$.size===0){Y(b);return}setTimeout(yt,10)}rt.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let te=null;function me(b){te&&te(b)}function ve(){Ee.stop()}function ne(){Ee.start()}const Ee=new Qc;Ee.setAnimationLoop(me),typeof self<"u"&&Ee.setContext(self),this.setAnimationLoop=function(b){te=b,bt.setAnimationLoop(b),b===null?Ee.stop():Ee.start()},bt.addEventListener("sessionstart",ve),bt.addEventListener("sessionend",ne),this.render=function(b,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),bt.enabled===!0&&bt.isPresenting===!0&&(bt.cameraAutoUpdate===!0&&bt.updateCamera(k),k=bt.getCamera()),b.isScene===!0&&b.onBeforeRender(S,b,k,A),p=At.get(b,y.length),p.init(),y.push(p),ft.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),V.setFromProjectionMatrix(ft),st=this.localClippingEnabled,J=Ot.init(this.clippingPlanes,st),_=vt.get(b,d.length),_.init(),d.push(_),Mn(b,k,0,S.sortObjects),_.finish(),S.sortObjects===!0&&_.sort(B,X),this.info.render.frame++,J===!0&&Ot.beginShadows();const q=p.state.shadowsArray;if(at.render(q,b,k),J===!0&&Ot.endShadows(),this.info.autoReset===!0&&this.info.reset(),re.render(_,b),p.setupLights(S._useLegacyLights),k.isArrayCamera){const $=k.cameras;for(let Y=0,yt=$.length;Y<yt;Y++){const Lt=$[Y];Ma(_,b,Lt,Lt.viewport)}}else Ma(_,b,k);A!==null&&(M.updateMultisampleRenderTarget(A),M.updateRenderTargetMipmap(A)),b.isScene===!0&&b.onAfterRender(S,b,k),C.resetDefaultState(),Z=-1,v=null,y.pop(),y.length>0?p=y[y.length-1]:p=null,d.pop(),d.length>0?_=d[d.length-1]:_=null};function Mn(b,k,q,$){if(b.visible===!1)return;if(b.layers.test(k.layers)){if(b.isGroup)q=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(k);else if(b.isLight)p.pushLight(b),b.castShadow&&p.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||V.intersectsSprite(b)){$&&Pt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ft);const Lt=ot.update(b),Bt=b.material;Bt.visible&&_.push(b,Lt,Bt,q,Pt.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||V.intersectsObject(b))){const Lt=ot.update(b),Bt=b.material;if($&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Pt.copy(b.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),Pt.copy(Lt.boundingSphere.center)),Pt.applyMatrix4(b.matrixWorld).applyMatrix4(ft)),Array.isArray(Bt)){const kt=Lt.groups;for(let qt=0,Gt=kt.length;qt<Gt;qt++){const Vt=kt[qt],Me=Bt[Vt.materialIndex];Me&&Me.visible&&_.push(b,Lt,Me,q,Pt.z,Vt)}}else Bt.visible&&_.push(b,Lt,Bt,q,Pt.z,null)}}const yt=b.children;for(let Lt=0,Bt=yt.length;Lt<Bt;Lt++)Mn(yt[Lt],k,q,$)}function Ma(b,k,q,$){const Y=b.opaque,yt=b.transmissive,Lt=b.transparent;p.setupLightsView(q),J===!0&&Ot.setGlobalState(S.clippingPlanes,q),yt.length>0&&Cu(Y,yt,k,q),$&&_t.viewport(T.copy($)),Y.length>0&&Br(Y,k,q),yt.length>0&&Br(yt,k,q),Lt.length>0&&Br(Lt,k,q),_t.buffers.depth.setTest(!0),_t.buffers.depth.setMask(!0),_t.buffers.color.setMask(!0),_t.setPolygonOffset(!1)}function Cu(b,k,q,$){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;const yt=N.isWebGL2;ht===null&&(ht=new Mi(1,1,{generateMipmaps:!0,type:rt.has("EXT_color_buffer_half_float")?Pr:Qn,minFilter:Lr,samples:yt?4:0})),S.getDrawingBufferSize(Mt),yt?ht.setSize(Mt.x,Mt.y):ht.setSize(Qo(Mt.x),Qo(Mt.y));const Lt=S.getRenderTarget();S.setRenderTarget(ht),S.getClearColor(Q),U=S.getClearAlpha(),U<1&&S.setClearColor(16777215,.5),S.clear();const Bt=S.toneMapping;S.toneMapping=Jn,Br(b,q,$),M.updateMultisampleRenderTarget(ht),M.updateRenderTargetMipmap(ht);let kt=!1;for(let qt=0,Gt=k.length;qt<Gt;qt++){const Vt=k[qt],Me=Vt.object,qe=Vt.geometry,Ce=Vt.material,An=Vt.group;if(Ce.side===on&&Me.layers.test($.layers)){const fe=Ce.side;Ce.side=He,Ce.needsUpdate=!0,Sa(Me,q,$,qe,Ce,An),Ce.side=fe,Ce.needsUpdate=!0,kt=!0}}kt===!0&&(M.updateMultisampleRenderTarget(ht),M.updateRenderTargetMipmap(ht)),S.setRenderTarget(Lt),S.setClearColor(Q,U),S.toneMapping=Bt}function Br(b,k,q){const $=k.isScene===!0?k.overrideMaterial:null;for(let Y=0,yt=b.length;Y<yt;Y++){const Lt=b[Y],Bt=Lt.object,kt=Lt.geometry,qt=$===null?Lt.material:$,Gt=Lt.group;Bt.layers.test(q.layers)&&Sa(Bt,k,q,kt,qt,Gt)}}function Sa(b,k,q,$,Y,yt){b.onBeforeRender(S,k,q,$,Y,yt),b.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),Y.onBeforeRender(S,k,q,$,b,yt),Y.transparent===!0&&Y.side===on&&Y.forceSinglePass===!1?(Y.side=He,Y.needsUpdate=!0,S.renderBufferDirect(q,k,$,Y,b,yt),Y.side=ni,Y.needsUpdate=!0,S.renderBufferDirect(q,k,$,Y,b,yt),Y.side=on):S.renderBufferDirect(q,k,$,Y,b,yt),b.onAfterRender(S,k,q,$,Y,yt)}function Hr(b,k,q){k.isScene!==!0&&(k=wt);const $=mt.get(b),Y=p.state.lights,yt=p.state.shadowsArray,Lt=Y.state.version,Bt=Et.getParameters(b,Y.state,yt,k,q),kt=Et.getProgramCacheKey(Bt);let qt=$.programs;$.environment=b.isMeshStandardMaterial?k.environment:null,$.fog=k.fog,$.envMap=(b.isMeshStandardMaterial?G:x).get(b.envMap||$.environment),qt===void 0&&(b.addEventListener("dispose",xt),qt=new Map,$.programs=qt);let Gt=qt.get(kt);if(Gt!==void 0){if($.currentProgram===Gt&&$.lightsStateVersion===Lt)return Ea(b,Bt),Gt}else Bt.uniforms=Et.getUniforms(b),b.onBuild(q,Bt,S),b.onBeforeCompile(Bt,S),Gt=Et.acquireProgram(Bt,kt),qt.set(kt,Gt),$.uniforms=Bt.uniforms;const Vt=$.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Vt.clippingPlanes=Ot.uniform),Ea(b,Bt),$.needsLights=Du(b),$.lightsStateVersion=Lt,$.needsLights&&(Vt.ambientLightColor.value=Y.state.ambient,Vt.lightProbe.value=Y.state.probe,Vt.directionalLights.value=Y.state.directional,Vt.directionalLightShadows.value=Y.state.directionalShadow,Vt.spotLights.value=Y.state.spot,Vt.spotLightShadows.value=Y.state.spotShadow,Vt.rectAreaLights.value=Y.state.rectArea,Vt.ltc_1.value=Y.state.rectAreaLTC1,Vt.ltc_2.value=Y.state.rectAreaLTC2,Vt.pointLights.value=Y.state.point,Vt.pointLightShadows.value=Y.state.pointShadow,Vt.hemisphereLights.value=Y.state.hemi,Vt.directionalShadowMap.value=Y.state.directionalShadowMap,Vt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Vt.spotShadowMap.value=Y.state.spotShadowMap,Vt.spotLightMatrix.value=Y.state.spotLightMatrix,Vt.spotLightMap.value=Y.state.spotLightMap,Vt.pointShadowMap.value=Y.state.pointShadowMap,Vt.pointShadowMatrix.value=Y.state.pointShadowMatrix),$.currentProgram=Gt,$.uniformsList=null,Gt}function ya(b){if(b.uniformsList===null){const k=b.currentProgram.getUniforms();b.uniformsList=Rs.seqWithValue(k.seq,b.uniforms)}return b.uniformsList}function Ea(b,k){const q=mt.get(b);q.outputColorSpace=k.outputColorSpace,q.batching=k.batching,q.instancing=k.instancing,q.instancingColor=k.instancingColor,q.skinning=k.skinning,q.morphTargets=k.morphTargets,q.morphNormals=k.morphNormals,q.morphColors=k.morphColors,q.morphTargetsCount=k.morphTargetsCount,q.numClippingPlanes=k.numClippingPlanes,q.numIntersection=k.numClipIntersection,q.vertexAlphas=k.vertexAlphas,q.vertexTangents=k.vertexTangents,q.toneMapping=k.toneMapping}function Lu(b,k,q,$,Y){k.isScene!==!0&&(k=wt),M.resetTextureUnits();const yt=k.fog,Lt=$.isMeshStandardMaterial?k.environment:null,Bt=A===null?S.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Bn,kt=($.isMeshStandardMaterial?G:x).get($.envMap||Lt),qt=$.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Gt=!!q.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Vt=!!q.morphAttributes.position,Me=!!q.morphAttributes.normal,qe=!!q.morphAttributes.color;let Ce=Jn;$.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ce=S.toneMapping);const An=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,fe=An!==void 0?An.length:0,$t=mt.get($),Qs=p.state.lights;if(J===!0&&(st===!0||b!==v)){const Je=b===v&&$.id===Z;Ot.setState($,b,Je)}let ge=!1;$.version===$t.__version?($t.needsLights&&$t.lightsStateVersion!==Qs.state.version||$t.outputColorSpace!==Bt||Y.isBatchedMesh&&$t.batching===!1||!Y.isBatchedMesh&&$t.batching===!0||Y.isInstancedMesh&&$t.instancing===!1||!Y.isInstancedMesh&&$t.instancing===!0||Y.isSkinnedMesh&&$t.skinning===!1||!Y.isSkinnedMesh&&$t.skinning===!0||Y.isInstancedMesh&&$t.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&$t.instancingColor===!1&&Y.instanceColor!==null||$t.envMap!==kt||$.fog===!0&&$t.fog!==yt||$t.numClippingPlanes!==void 0&&($t.numClippingPlanes!==Ot.numPlanes||$t.numIntersection!==Ot.numIntersection)||$t.vertexAlphas!==qt||$t.vertexTangents!==Gt||$t.morphTargets!==Vt||$t.morphNormals!==Me||$t.morphColors!==qe||$t.toneMapping!==Ce||N.isWebGL2===!0&&$t.morphTargetsCount!==fe)&&(ge=!0):(ge=!0,$t.__version=$.version);let ri=$t.currentProgram;ge===!0&&(ri=Hr($,k,Y));let ba=!1,pr=!1,to=!1;const Ne=ri.getUniforms(),si=$t.uniforms;if(_t.useProgram(ri.program)&&(ba=!0,pr=!0,to=!0),$.id!==Z&&(Z=$.id,pr=!0),ba||v!==b){Ne.setValue(R,"projectionMatrix",b.projectionMatrix),Ne.setValue(R,"viewMatrix",b.matrixWorldInverse);const Je=Ne.map.cameraPosition;Je!==void 0&&Je.setValue(R,Pt.setFromMatrixPosition(b.matrixWorld)),N.logarithmicDepthBuffer&&Ne.setValue(R,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&Ne.setValue(R,"isOrthographic",b.isOrthographicCamera===!0),v!==b&&(v=b,pr=!0,to=!0)}if(Y.isSkinnedMesh){Ne.setOptional(R,Y,"bindMatrix"),Ne.setOptional(R,Y,"bindMatrixInverse");const Je=Y.skeleton;Je&&(N.floatVertexTextures?(Je.boneTexture===null&&Je.computeBoneTexture(),Ne.setValue(R,"boneTexture",Je.boneTexture,M)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Y.isBatchedMesh&&(Ne.setOptional(R,Y,"batchingTexture"),Ne.setValue(R,"batchingTexture",Y._matricesTexture,M));const eo=q.morphAttributes;if((eo.position!==void 0||eo.normal!==void 0||eo.color!==void 0&&N.isWebGL2===!0)&&Yt.update(Y,q,ri),(pr||$t.receiveShadow!==Y.receiveShadow)&&($t.receiveShadow=Y.receiveShadow,Ne.setValue(R,"receiveShadow",Y.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(si.envMap.value=kt,si.flipEnvMap.value=kt.isCubeTexture&&kt.isRenderTargetTexture===!1?-1:1),pr&&(Ne.setValue(R,"toneMappingExposure",S.toneMappingExposure),$t.needsLights&&Pu(si,to),yt&&$.fog===!0&&gt.refreshFogUniforms(si,yt),gt.refreshMaterialUniforms(si,$,D,W,ht),Rs.upload(R,ya($t),si,M)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(Rs.upload(R,ya($t),si,M),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&Ne.setValue(R,"center",Y.center),Ne.setValue(R,"modelViewMatrix",Y.modelViewMatrix),Ne.setValue(R,"normalMatrix",Y.normalMatrix),Ne.setValue(R,"modelMatrix",Y.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const Je=$.uniformsGroups;for(let no=0,Uu=Je.length;no<Uu;no++)if(N.isWebGL2){const Ta=Je[no];ct.update(Ta,ri),ct.bind(Ta,ri)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ri}function Pu(b,k){b.ambientLightColor.needsUpdate=k,b.lightProbe.needsUpdate=k,b.directionalLights.needsUpdate=k,b.directionalLightShadows.needsUpdate=k,b.pointLights.needsUpdate=k,b.pointLightShadows.needsUpdate=k,b.spotLights.needsUpdate=k,b.spotLightShadows.needsUpdate=k,b.rectAreaLights.needsUpdate=k,b.hemisphereLights.needsUpdate=k}function Du(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(b,k,q){mt.get(b.texture).__webglTexture=k,mt.get(b.depthTexture).__webglTexture=q;const $=mt.get(b);$.__hasExternalTextures=!0,$.__hasExternalTextures&&($.__autoAllocateDepthBuffer=q===void 0,$.__autoAllocateDepthBuffer||rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,k){const q=mt.get(b);q.__webglFramebuffer=k,q.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(b,k=0,q=0){A=b,P=k,w=q;let $=!0,Y=null,yt=!1,Lt=!1;if(b){const kt=mt.get(b);kt.__useDefaultFramebuffer!==void 0?(_t.bindFramebuffer(R.FRAMEBUFFER,null),$=!1):kt.__webglFramebuffer===void 0?M.setupRenderTarget(b):kt.__hasExternalTextures&&M.rebindTextures(b,mt.get(b.texture).__webglTexture,mt.get(b.depthTexture).__webglTexture);const qt=b.texture;(qt.isData3DTexture||qt.isDataArrayTexture||qt.isCompressedArrayTexture)&&(Lt=!0);const Gt=mt.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Gt[k])?Y=Gt[k][q]:Y=Gt[k],yt=!0):N.isWebGL2&&b.samples>0&&M.useMultisampledRTT(b)===!1?Y=mt.get(b).__webglMultisampledFramebuffer:Array.isArray(Gt)?Y=Gt[q]:Y=Gt,T.copy(b.viewport),O.copy(b.scissor),H=b.scissorTest}else T.copy(K).multiplyScalar(D).floor(),O.copy(nt).multiplyScalar(D).floor(),H=it;if(_t.bindFramebuffer(R.FRAMEBUFFER,Y)&&N.drawBuffers&&$&&_t.drawBuffers(b,Y),_t.viewport(T),_t.scissor(O),_t.setScissorTest(H),yt){const kt=mt.get(b.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+k,kt.__webglTexture,q)}else if(Lt){const kt=mt.get(b.texture),qt=k||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,kt.__webglTexture,q||0,qt)}Z=-1},this.readRenderTargetPixels=function(b,k,q,$,Y,yt,Lt){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Bt=mt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Lt!==void 0&&(Bt=Bt[Lt]),Bt){_t.bindFramebuffer(R.FRAMEBUFFER,Bt);try{const kt=b.texture,qt=kt.format,Gt=kt.type;if(qt!==vn&&St.convert(qt)!==R.getParameter(R.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Vt=Gt===Pr&&(rt.has("EXT_color_buffer_half_float")||N.isWebGL2&&rt.has("EXT_color_buffer_float"));if(Gt!==Qn&&St.convert(Gt)!==R.getParameter(R.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Gt===Zn&&(N.isWebGL2||rt.has("OES_texture_float")||rt.has("WEBGL_color_buffer_float")))&&!Vt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=b.width-$&&q>=0&&q<=b.height-Y&&R.readPixels(k,q,$,Y,St.convert(qt),St.convert(Gt),yt)}finally{const kt=A!==null?mt.get(A).__webglFramebuffer:null;_t.bindFramebuffer(R.FRAMEBUFFER,kt)}}},this.copyFramebufferToTexture=function(b,k,q=0){const $=Math.pow(2,-q),Y=Math.floor(k.image.width*$),yt=Math.floor(k.image.height*$);M.setTexture2D(k,0),R.copyTexSubImage2D(R.TEXTURE_2D,q,0,0,b.x,b.y,Y,yt),_t.unbindTexture()},this.copyTextureToTexture=function(b,k,q,$=0){const Y=k.image.width,yt=k.image.height,Lt=St.convert(q.format),Bt=St.convert(q.type);M.setTexture2D(q,0),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,q.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,q.unpackAlignment),k.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,$,b.x,b.y,Y,yt,Lt,Bt,k.image.data):k.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,$,b.x,b.y,k.mipmaps[0].width,k.mipmaps[0].height,Lt,k.mipmaps[0].data):R.texSubImage2D(R.TEXTURE_2D,$,b.x,b.y,Lt,Bt,k.image),$===0&&q.generateMipmaps&&R.generateMipmap(R.TEXTURE_2D),_t.unbindTexture()},this.copyTextureToTexture3D=function(b,k,q,$,Y=0){if(S.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const yt=b.max.x-b.min.x+1,Lt=b.max.y-b.min.y+1,Bt=b.max.z-b.min.z+1,kt=St.convert($.format),qt=St.convert($.type);let Gt;if($.isData3DTexture)M.setTexture3D($,0),Gt=R.TEXTURE_3D;else if($.isDataArrayTexture||$.isCompressedArrayTexture)M.setTexture2DArray($,0),Gt=R.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,$.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,$.unpackAlignment);const Vt=R.getParameter(R.UNPACK_ROW_LENGTH),Me=R.getParameter(R.UNPACK_IMAGE_HEIGHT),qe=R.getParameter(R.UNPACK_SKIP_PIXELS),Ce=R.getParameter(R.UNPACK_SKIP_ROWS),An=R.getParameter(R.UNPACK_SKIP_IMAGES),fe=q.isCompressedTexture?q.mipmaps[Y]:q.image;R.pixelStorei(R.UNPACK_ROW_LENGTH,fe.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,fe.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,b.min.x),R.pixelStorei(R.UNPACK_SKIP_ROWS,b.min.y),R.pixelStorei(R.UNPACK_SKIP_IMAGES,b.min.z),q.isDataTexture||q.isData3DTexture?R.texSubImage3D(Gt,Y,k.x,k.y,k.z,yt,Lt,Bt,kt,qt,fe.data):q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),R.compressedTexSubImage3D(Gt,Y,k.x,k.y,k.z,yt,Lt,Bt,kt,fe.data)):R.texSubImage3D(Gt,Y,k.x,k.y,k.z,yt,Lt,Bt,kt,qt,fe),R.pixelStorei(R.UNPACK_ROW_LENGTH,Vt),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Me),R.pixelStorei(R.UNPACK_SKIP_PIXELS,qe),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ce),R.pixelStorei(R.UNPACK_SKIP_IMAGES,An),Y===0&&$.generateMipmaps&&R.generateMipmap(Gt),_t.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?M.setTextureCube(b,0):b.isData3DTexture?M.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?M.setTexture2DArray(b,0):M.setTexture2D(b,0),_t.unbindTexture()},this.resetState=function(){P=0,w=0,A=null,_t.reset(),C.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===la?"display-p3":"srgb",e.unpackColorSpace=oe.workingColorSpace===js?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===de?vi:Hc}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===vi?de:Bn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class H0 extends au{}H0.prototype.isWebGL1Renderer=!0;class da{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Kt(t),this.near=e,this.far=n}clone(){return new da(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class k0 extends ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class G0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Zo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=ti()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let r=0,s=this.stride;r<s;r++)this.array[t+r]=e.array[n+r];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ti()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ti()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const ke=new F;class ks{constructor(t,e,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyMatrix4(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyNormalMatrix(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.transformDirection(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}setX(t,e){return this.normalized&&(e=ae(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Nn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Nn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Nn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Nn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array),r=ae(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ae(e,this.array),n=ae(n,this.array),r=ae(r,this.array),s=ae(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return new ln(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ks(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class lu extends fr{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Kt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let qi;const vr=new F,$i=new F,ji=new F,Zi=new Nt,Mr=new Nt,cu=new ce,cs=new F,Sr=new F,us=new F,Xl=new Nt,Io=new Nt,Yl=new Nt;class V0 extends ye{constructor(t=new lu){if(super(),this.isSprite=!0,this.type="Sprite",qi===void 0){qi=new bn;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new G0(e,5);qi.setIndex([0,1,2,0,2,3]),qi.setAttribute("position",new ks(n,3,0,!1)),qi.setAttribute("uv",new ks(n,2,3,!1))}this.geometry=qi,this.material=t,this.center=new Nt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),$i.setFromMatrixScale(this.matrixWorld),cu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ji.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&$i.multiplyScalar(-ji.z);const n=this.material.rotation;let r,s;n!==0&&(s=Math.cos(n),r=Math.sin(n));const a=this.center;hs(cs.set(-.5,-.5,0),ji,a,$i,r,s),hs(Sr.set(.5,-.5,0),ji,a,$i,r,s),hs(us.set(.5,.5,0),ji,a,$i,r,s),Xl.set(0,0),Io.set(1,0),Yl.set(1,1);let o=t.ray.intersectTriangle(cs,Sr,us,!1,vr);if(o===null&&(hs(Sr.set(-.5,.5,0),ji,a,$i,r,s),Io.set(0,1),o=t.ray.intersectTriangle(cs,us,Sr,!1,vr),o===null))return;const l=t.ray.origin.distanceTo(vr);l<t.near||l>t.far||e.push({distance:l,point:vr.clone(),uv:nn.getInterpolation(vr,cs,Sr,us,Xl,Io,Yl,new Nt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function hs(i,t,e,n,r,s){Zi.subVectors(i,e).addScalar(.5).multiply(n),r!==void 0?(Mr.x=s*Zi.x-r*Zi.y,Mr.y=r*Zi.x+s*Zi.y):Mr.copy(Zi),i.copy(t),i.x+=Mr.x,i.y+=Mr.y,i.applyMatrix4(cu)}class ql extends ln{constructor(t,e,n,r=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ki=new ce,$l=new ce,fs=[],jl=new Ri,W0=new ce,yr=new pe,Er=new Nr;class Gs extends pe{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ql(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,W0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ri),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ki),jl.copy(t.boundingBox).applyMatrix4(Ki),this.boundingBox.union(jl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Nr),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ki),Er.copy(t.boundingSphere).applyMatrix4(Ki),this.boundingSphere.union(Er)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,r=this.count;if(yr.geometry=this.geometry,yr.material=this.material,yr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Er.copy(this.boundingSphere),Er.applyMatrix4(n),t.ray.intersectsSphere(Er)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Ki),$l.multiplyMatrices(n,Ki),yr.matrixWorld=$l,yr.raycast(t,fs);for(let a=0,o=fs.length;a<o;a++){const l=fs[a];l.instanceId=s,l.object=this,e.push(l)}fs.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new ql(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Or extends Ye{constructor(t,e,n,r,s,a,o,l,c){super(t,e,n,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ii extends bn{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],f=[],h=[],m=[];let g=0;const _=[],p=n/2;let d=0;y(),a===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(u),this.setAttribute("position",new Ze(f,3)),this.setAttribute("normal",new Ze(h,3)),this.setAttribute("uv",new Ze(m,2));function y(){const E=new F,P=new F;let w=0;const A=(e-t)/n;for(let Z=0;Z<=s;Z++){const v=[],T=Z/s,O=T*(e-t)+t;for(let H=0;H<=r;H++){const Q=H/r,U=Q*l+o,z=Math.sin(U),W=Math.cos(U);P.x=O*z,P.y=-T*n+p,P.z=O*W,f.push(P.x,P.y,P.z),E.set(z,A,W).normalize(),h.push(E.x,E.y,E.z),m.push(Q,1-T),v.push(g++)}_.push(v)}for(let Z=0;Z<r;Z++)for(let v=0;v<s;v++){const T=_[v][Z],O=_[v+1][Z],H=_[v+1][Z+1],Q=_[v][Z+1];u.push(T,O,Q),u.push(O,H,Q),w+=6}c.addGroup(d,w,0),d+=w}function S(E){const P=g,w=new Nt,A=new F;let Z=0;const v=E===!0?t:e,T=E===!0?1:-1;for(let H=1;H<=r;H++)f.push(0,p*T,0),h.push(0,T,0),m.push(.5,.5),g++;const O=g;for(let H=0;H<=r;H++){const U=H/r*l+o,z=Math.cos(U),W=Math.sin(U);A.x=v*W,A.y=p*T,A.z=v*z,f.push(A.x,A.y,A.z),h.push(0,T,0),w.x=z*.5+.5,w.y=W*.5*T+.5,m.push(w.x,w.y),g++}for(let H=0;H<r;H++){const Q=P+H,U=O+H;E===!0?u.push(U,U+1,Q):u.push(U+1,U,Q),Z+=3}c.addGroup(d,Z,E===!0?1:2),d+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ii(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Fr extends ii{constructor(t=1,e=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Fr(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class zr extends bn{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],f=new F,h=new F,m=[],g=[],_=[],p=[];for(let d=0;d<=n;d++){const y=[],S=d/n;let E=0;d===0&&a===0?E=.5/e:d===n&&l===Math.PI&&(E=-.5/e);for(let P=0;P<=e;P++){const w=P/e;f.x=-t*Math.cos(r+w*s)*Math.sin(a+S*o),f.y=t*Math.cos(a+S*o),f.z=t*Math.sin(r+w*s)*Math.sin(a+S*o),g.push(f.x,f.y,f.z),h.copy(f).normalize(),_.push(h.x,h.y,h.z),p.push(w+E,1-S),y.push(c++)}u.push(y)}for(let d=0;d<n;d++)for(let y=0;y<e;y++){const S=u[d][y+1],E=u[d][y],P=u[d+1][y],w=u[d+1][y+1];(d!==0||a>0)&&m.push(S,E,w),(d!==n-1||l<Math.PI)&&m.push(E,P,w)}this.setIndex(m),this.setAttribute("position",new Ze(g,3)),this.setAttribute("normal",new Ze(_,3)),this.setAttribute("uv",new Ze(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ft extends fr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Kt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=kc,this.normalScale=new Nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class uu extends ye{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Kt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class X0 extends uu{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Kt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const No=new ce,Zl=new F,Kl=new F;class Y0{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Nt(512,512),this.map=null,this.mapPass=null,this.matrix=new ce,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ha,this._frameExtents=new Nt(1,1),this._viewportCount=1,this._viewports=[new De(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Zl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Zl),Kl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Kl),e.updateMatrixWorld(),No.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(No),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(No)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class q0 extends Y0{constructor(){super(new tu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Jl extends uu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.target=new ye,this.shadow=new q0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class $0{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Ql(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Ql();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Ql(){return(typeof performance>"u"?Date:performance).now()}class j0{constructor(t,e,n=0,r=1/0){this.ray=new ca(t,e),this.near=n,this.far=r,this.camera=null,this.layers=new ua,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return ea(t,this,n,e),n.sort(tc),n}intersectObjects(t,e=!0,n=[]){for(let r=0,s=t.length;r<s;r++)ea(t[r],this,n,e);return n.sort(tc),n}}function tc(i,t){return i.distance-t.distance}function ea(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const r=i.children;for(let s=0,a=r.length;s<a;s++)ea(r[s],t,e,!0)}}class ec{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(We(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:oa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=oa);const nc={type:"change"},Oo={type:"start"},ic={type:"end"},ds=new ca,rc=new qn,Z0=Math.cos(70*Uh.DEG2RAD);class K0 extends Ai{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new F,this.cursor=new F,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ci.ROTATE,MIDDLE:Ci.DOLLY,RIGHT:Ci.PAN},this.touches={ONE:Li.ROTATE,TWO:Li.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(C){C.addEventListener("keydown",At),this._domElementKeyEvents=C},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",At),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(nc),n.update(),s=r.NONE},this.update=function(){const C=new F,ct=new En().setFromUnitVectors(t.up,new F(0,1,0)),Ct=ct.clone().invert(),bt=new F,lt=new En,I=new F,ut=2*Math.PI;return function(zt=null){const It=n.object.position;C.copy(It).sub(n.target),C.applyQuaternion(ct),o.setFromVector3(C),n.autoRotate&&s===r.NONE&&H(T(zt)),n.enableDamping?(o.theta+=l.theta*n.dampingFactor,o.phi+=l.phi*n.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let Qt=n.minAzimuthAngle,te=n.maxAzimuthAngle;isFinite(Qt)&&isFinite(te)&&(Qt<-Math.PI?Qt+=ut:Qt>Math.PI&&(Qt-=ut),te<-Math.PI?te+=ut:te>Math.PI&&(te-=ut),Qt<=te?o.theta=Math.max(Qt,Math.min(te,o.theta)):o.theta=o.theta>(Qt+te)/2?Math.max(Qt,o.theta):Math.min(te,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&w||n.object.isOrthographicCamera?o.radius=K(o.radius):o.radius=K(o.radius*c),C.setFromSpherical(o),C.applyQuaternion(Ct),It.copy(n.target).add(C),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),u.set(0,0,0));let me=!1;if(n.zoomToCursor&&w){let ve=null;if(n.object.isPerspectiveCamera){const ne=C.length();ve=K(ne*c);const Ee=ne-ve;n.object.position.addScaledVector(E,Ee),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const ne=new F(P.x,P.y,0);ne.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),me=!0;const Ee=new F(P.x,P.y,0);Ee.unproject(n.object),n.object.position.sub(Ee).add(ne),n.object.updateMatrixWorld(),ve=C.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ve!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ve).add(n.object.position):(ds.origin.copy(n.object.position),ds.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(ds.direction))<Z0?t.lookAt(n.target):(rc.setFromNormalAndCoplanarPoint(n.object.up,n.target),ds.intersectPlane(rc,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),me=!0);return c=1,w=!1,me||bt.distanceToSquared(n.object.position)>a||8*(1-lt.dot(n.object.quaternion))>a||I.distanceToSquared(n.target)>0?(n.dispatchEvent(nc),bt.copy(n.object.position),lt.copy(n.object.quaternion),I.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",re),n.domElement.removeEventListener("pointerdown",M),n.domElement.removeEventListener("pointercancel",G),n.domElement.removeEventListener("wheel",ot),n.domElement.removeEventListener("pointermove",x),n.domElement.removeEventListener("pointerup",G),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",At),n._domElementKeyEvents=null)};const n=this,r={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let s=r.NONE;const a=1e-6,o=new ec,l=new ec;let c=1;const u=new F,f=new Nt,h=new Nt,m=new Nt,g=new Nt,_=new Nt,p=new Nt,d=new Nt,y=new Nt,S=new Nt,E=new F,P=new Nt;let w=!1;const A=[],Z={};let v=!1;function T(C){return C!==null?2*Math.PI/60*n.autoRotateSpeed*C:2*Math.PI/60/60*n.autoRotateSpeed}function O(C){const ct=Math.abs(C*.01);return Math.pow(.95,n.zoomSpeed*ct)}function H(C){l.theta-=C}function Q(C){l.phi-=C}const U=function(){const C=new F;return function(Ct,bt){C.setFromMatrixColumn(bt,0),C.multiplyScalar(-Ct),u.add(C)}}(),z=function(){const C=new F;return function(Ct,bt){n.screenSpacePanning===!0?C.setFromMatrixColumn(bt,1):(C.setFromMatrixColumn(bt,0),C.crossVectors(n.object.up,C)),C.multiplyScalar(Ct),u.add(C)}}(),W=function(){const C=new F;return function(Ct,bt){const lt=n.domElement;if(n.object.isPerspectiveCamera){const I=n.object.position;C.copy(I).sub(n.target);let ut=C.length();ut*=Math.tan(n.object.fov/2*Math.PI/180),U(2*Ct*ut/lt.clientHeight,n.object.matrix),z(2*bt*ut/lt.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(U(Ct*(n.object.right-n.object.left)/n.object.zoom/lt.clientWidth,n.object.matrix),z(bt*(n.object.top-n.object.bottom)/n.object.zoom/lt.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function D(C){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=C:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function B(C){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=C:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function X(C,ct){if(!n.zoomToCursor)return;w=!0;const Ct=n.domElement.getBoundingClientRect(),bt=C-Ct.left,lt=ct-Ct.top,I=Ct.width,ut=Ct.height;P.x=bt/I*2-1,P.y=-(lt/ut)*2+1,E.set(P.x,P.y,1).unproject(n.object).sub(n.object.position).normalize()}function K(C){return Math.max(n.minDistance,Math.min(n.maxDistance,C))}function nt(C){f.set(C.clientX,C.clientY)}function it(C){X(C.clientX,C.clientX),d.set(C.clientX,C.clientY)}function V(C){g.set(C.clientX,C.clientY)}function J(C){h.set(C.clientX,C.clientY),m.subVectors(h,f).multiplyScalar(n.rotateSpeed);const ct=n.domElement;H(2*Math.PI*m.x/ct.clientHeight),Q(2*Math.PI*m.y/ct.clientHeight),f.copy(h),n.update()}function st(C){y.set(C.clientX,C.clientY),S.subVectors(y,d),S.y>0?D(O(S.y)):S.y<0&&B(O(S.y)),d.copy(y),n.update()}function ht(C){_.set(C.clientX,C.clientY),p.subVectors(_,g).multiplyScalar(n.panSpeed),W(p.x,p.y),g.copy(_),n.update()}function ft(C){X(C.clientX,C.clientY),C.deltaY<0?B(O(C.deltaY)):C.deltaY>0&&D(O(C.deltaY)),n.update()}function Mt(C){let ct=!1;switch(C.code){case n.keys.UP:C.ctrlKey||C.metaKey||C.shiftKey?Q(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,n.keyPanSpeed),ct=!0;break;case n.keys.BOTTOM:C.ctrlKey||C.metaKey||C.shiftKey?Q(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,-n.keyPanSpeed),ct=!0;break;case n.keys.LEFT:C.ctrlKey||C.metaKey||C.shiftKey?H(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(n.keyPanSpeed,0),ct=!0;break;case n.keys.RIGHT:C.ctrlKey||C.metaKey||C.shiftKey?H(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(-n.keyPanSpeed,0),ct=!0;break}ct&&(C.preventDefault(),n.update())}function Pt(C){if(A.length===1)f.set(C.pageX,C.pageY);else{const ct=St(C),Ct=.5*(C.pageX+ct.x),bt=.5*(C.pageY+ct.y);f.set(Ct,bt)}}function wt(C){if(A.length===1)g.set(C.pageX,C.pageY);else{const ct=St(C),Ct=.5*(C.pageX+ct.x),bt=.5*(C.pageY+ct.y);g.set(Ct,bt)}}function L(C){const ct=St(C),Ct=C.pageX-ct.x,bt=C.pageY-ct.y,lt=Math.sqrt(Ct*Ct+bt*bt);d.set(0,lt)}function R(C){n.enableZoom&&L(C),n.enablePan&&wt(C)}function j(C){n.enableZoom&&L(C),n.enableRotate&&Pt(C)}function rt(C){if(A.length==1)h.set(C.pageX,C.pageY);else{const Ct=St(C),bt=.5*(C.pageX+Ct.x),lt=.5*(C.pageY+Ct.y);h.set(bt,lt)}m.subVectors(h,f).multiplyScalar(n.rotateSpeed);const ct=n.domElement;H(2*Math.PI*m.x/ct.clientHeight),Q(2*Math.PI*m.y/ct.clientHeight),f.copy(h)}function N(C){if(A.length===1)_.set(C.pageX,C.pageY);else{const ct=St(C),Ct=.5*(C.pageX+ct.x),bt=.5*(C.pageY+ct.y);_.set(Ct,bt)}p.subVectors(_,g).multiplyScalar(n.panSpeed),W(p.x,p.y),g.copy(_)}function _t(C){const ct=St(C),Ct=C.pageX-ct.x,bt=C.pageY-ct.y,lt=Math.sqrt(Ct*Ct+bt*bt);y.set(0,lt),S.set(0,Math.pow(y.y/d.y,n.zoomSpeed)),D(S.y),d.copy(y);const I=(C.pageX+ct.x)*.5,ut=(C.pageY+ct.y)*.5;X(I,ut)}function Tt(C){n.enableZoom&&_t(C),n.enablePan&&N(C)}function mt(C){n.enableZoom&&_t(C),n.enableRotate&&rt(C)}function M(C){n.enabled!==!1&&(A.length===0&&(n.domElement.setPointerCapture(C.pointerId),n.domElement.addEventListener("pointermove",x),n.domElement.addEventListener("pointerup",G)),Yt(C),C.pointerType==="touch"?Ot(C):tt(C))}function x(C){n.enabled!==!1&&(C.pointerType==="touch"?at(C):et(C))}function G(C){Ht(C),A.length===0&&(n.domElement.releasePointerCapture(C.pointerId),n.domElement.removeEventListener("pointermove",x),n.domElement.removeEventListener("pointerup",G)),n.dispatchEvent(ic),s=r.NONE}function tt(C){let ct;switch(C.button){case 0:ct=n.mouseButtons.LEFT;break;case 1:ct=n.mouseButtons.MIDDLE;break;case 2:ct=n.mouseButtons.RIGHT;break;default:ct=-1}switch(ct){case Ci.DOLLY:if(n.enableZoom===!1)return;it(C),s=r.DOLLY;break;case Ci.ROTATE:if(C.ctrlKey||C.metaKey||C.shiftKey){if(n.enablePan===!1)return;V(C),s=r.PAN}else{if(n.enableRotate===!1)return;nt(C),s=r.ROTATE}break;case Ci.PAN:if(C.ctrlKey||C.metaKey||C.shiftKey){if(n.enableRotate===!1)return;nt(C),s=r.ROTATE}else{if(n.enablePan===!1)return;V(C),s=r.PAN}break;default:s=r.NONE}s!==r.NONE&&n.dispatchEvent(Oo)}function et(C){switch(s){case r.ROTATE:if(n.enableRotate===!1)return;J(C);break;case r.DOLLY:if(n.enableZoom===!1)return;st(C);break;case r.PAN:if(n.enablePan===!1)return;ht(C);break}}function ot(C){n.enabled===!1||n.enableZoom===!1||s!==r.NONE||(C.preventDefault(),n.dispatchEvent(Oo),ft(Et(C)),n.dispatchEvent(ic))}function Et(C){const ct=C.deltaMode,Ct={clientX:C.clientX,clientY:C.clientY,deltaY:C.deltaY};switch(ct){case 1:Ct.deltaY*=16;break;case 2:Ct.deltaY*=100;break}return C.ctrlKey&&!v&&(Ct.deltaY*=10),Ct}function gt(C){C.key==="Control"&&(v=!0,document.addEventListener("keyup",vt,{passive:!0,capture:!0}))}function vt(C){C.key==="Control"&&(v=!1,document.removeEventListener("keyup",vt,{passive:!0,capture:!0}))}function At(C){n.enabled===!1||n.enablePan===!1||Mt(C)}function Ot(C){switch(Dt(C),A.length){case 1:switch(n.touches.ONE){case Li.ROTATE:if(n.enableRotate===!1)return;Pt(C),s=r.TOUCH_ROTATE;break;case Li.PAN:if(n.enablePan===!1)return;wt(C),s=r.TOUCH_PAN;break;default:s=r.NONE}break;case 2:switch(n.touches.TWO){case Li.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;R(C),s=r.TOUCH_DOLLY_PAN;break;case Li.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;j(C),s=r.TOUCH_DOLLY_ROTATE;break;default:s=r.NONE}break;default:s=r.NONE}s!==r.NONE&&n.dispatchEvent(Oo)}function at(C){switch(Dt(C),s){case r.TOUCH_ROTATE:if(n.enableRotate===!1)return;rt(C),n.update();break;case r.TOUCH_PAN:if(n.enablePan===!1)return;N(C),n.update();break;case r.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Tt(C),n.update();break;case r.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;mt(C),n.update();break;default:s=r.NONE}}function re(C){n.enabled!==!1&&C.preventDefault()}function Yt(C){A.push(C.pointerId)}function Ht(C){delete Z[C.pointerId];for(let ct=0;ct<A.length;ct++)if(A[ct]==C.pointerId){A.splice(ct,1);return}}function Dt(C){let ct=Z[C.pointerId];ct===void 0&&(ct=new Nt,Z[C.pointerId]=ct),ct.set(C.pageX,C.pageY)}function St(C){const ct=C.pointerId===A[0]?A[1]:A[0];return Z[ct]}n.domElement.addEventListener("contextmenu",re),n.domElement.addEventListener("pointerdown",M),n.domElement.addEventListener("pointercancel",G),n.domElement.addEventListener("wheel",ot,{passive:!1}),document.addEventListener("keydown",gt,{passive:!0,capture:!0}),this.update()}}const xe={L:.4,H:.16,D:.2},yn=.02,Vs=xe.L+yn,Te=xe.H+yn,Jt={w:5.04,d:4.18,t:xe.D,wallCourses:14,gableCourses:7,eaveOverhang:.3},Ur=Jt.wallCourses*Te,pa=Jt.gableCourses*Te,hu=Ur+pa,yi=Jt.d/2,Ws=Math.atan2(pa,yi),na=Jt.d/2-Jt.t/2,sc=Jt.w/2-Jt.t/2,_e={side:1,x:Jt.w/2+xe.D/2,z:-.9,depth:xe.D,runLen:.82,courses:22},le=[{y:0},{y:1.44},{y:2.7}],J0=1.7,Q0=1.25,oc=.72,ac=.85,zn={rx:Jt.w/2+ac,rz:Jt.d/2+ac,deckW:.6,ladder:{x:-3.37,z:2.05}},dt={trailer:{x:-7.9,z:3.6,rot:.62},pallets:[{x:8.2,z:-3},{x:8.2,z:-1.2},{x:8.2,z:.6}],stack:{x:0,z:4.15},mixer:{x:3.4,z:5.1},timber:{x:-4.9,z:-3.4},dumpster:{x:8.6,z:5.2},privy:{x:-8.6,z:-2.2},gate:{x:0,z:7},roadZ:9.7,fence:{x0:-11.2,x1:10.2,z0:-6.6,z1:7,gapX0:-1.7,gapX1:1.7},muster:{x:-5.4,z:5.9},offsite:{x:17,z:9.7},arrival:{x:-17,z:9.7}},Cs=300,Fo=[{name:"Redline",accent:14173231,hat:16036890},{name:"Bluecap",accent:3108824,hat:15265007},{name:"Greenfield",accent:3120730,hat:9425231},{name:"Violet",accent:8014808,hat:15760076},{name:"Copper",accent:12872223,hat:16048289}],tg=[{role:"foreman",n:1},{role:"barrow",n:2},{role:"carrier",n:2},{role:"mason",n:6}],ps={barrow:8,carrier:3,mason:6},eg=70,ui={walk:2.1,walkLaden:1.75,climb:2,layTime:.9,pickTime:.2},ng=.8,ig=260,we={brick:[11026732,10238504,11817530,9385252,12279878],mortar:13617078,lintel:8158326,timber:12159566,tile:[4869975,5593956,4277837],dirt:11571826,grass:8364636},fu=pa/yi,du=Math.cos(Ws),ms=(yi+Jt.eaveOverhang)/du;function er(i){return Ur+.12+(yi-i)*fu}function ma(i){return yi+Jt.eaveOverhang-i*du}const fi=[{key:"walls",label:"WALLS"},{key:"gables",label:"GABLES"},{key:"chimney",label:"CHIMNEY"},{key:"roof",label:"ROOF FRAME"},{key:"tiles",label:"ROOF TILES"}],zo=[{id:"S",axis:"x",line:na,nx:0,nz:1},{id:"E",axis:"z",line:sc,nx:1,nz:0},{id:"N",axis:"x",line:-na,nx:0,nz:-1},{id:"W",axis:"z",line:-sc,nx:-1,nz:0}],lc=["PLOT 4 — GABLE COTTAGE","PLOT 5 — THE LITTLE STACK","PLOT 6 — BRICKWORKS LODGE","PLOT 7 — MORTAR END","PLOT 8 — HEARTHSTONE"];function cc(i,t){const e=t-i,n=Math.max(1,Math.round(e/Vs)),r=e/n,s=[];for(let a=0;a<n;a++)s.push({c:i+(a+.5)*r,len:r-yn});return s}function rg(i,t,e){const n=[];for(let r=i-e;r<t-1e-6;r+=Vs){const s=Math.max(r,i),a=Math.min(r+Vs-yn,t);a-s>.08&&n.push({c:(s+a)/2,len:a-s})}return n}function sg(i,t){let e=i.c-i.len/2,n=i.c+i.len/2;for(const r of t){if(n<=r.u0||e>=r.u1)continue;const s=r.u0-e,a=n-r.u1;if(s<=.09&&a<=.09)return null;s>=a?n=r.u0:e=r.u1}return n-e<.09?null:{c:(e+n)/2,len:n-e}}function og(i,t){for(let e=0;e<le.length;e++){const n=le[e].y;if(!(n<i-Q0)&&t<=n+J0)return e}return le.length-1}function Ji(i,t,e,n,r,s){const a=og(r,s);if(a===0)return{level:0,x:i+e*oc,y:0,z:t+n*oc};const o=e!==0?e*zn.rx:i,l=n!==0?n*zn.rz:t;return{level:a,x:o,y:le[a].y,z:l}}function Bo(i,t,e){const n=ma(e);return{level:"roof",side:t,sd:e,x:i,y:er(n),z:t*n,tilt:Ws*.6}}function ag(i,t=1){const e=[],n=[],r=new Map,s=we.brick.map(D=>D),a=we.tile,o={masonry:0,timber:0,tile:0},l=D=>(D.i=e.length,D.slot=o[D.family]++,e.push(D),D.i),c=()=>s[i()*s.length|0],u=()=>a[i()*a.length|0];function f(D,B){let X=r.get(D);return X===void 0&&(X=n.length,n.push({...B(),needs:0,key:D}),r.set(D,X)),n[X].needs++,X}function h(D){const B=[];for(const X of D){const K=X.c-X.len/2,nt=X.c+X.len/2,it=B[B.length-1];it&&K-it.u1<.07?it.u1=nt:B.push({u0:K,u1:nt})}return B}const m=(D,B)=>D.findIndex(X=>B.c>=X.u0-1e-6&&B.c<=X.u1+1e-6),_=i()<.5?-1.08:1.08,p=[{wall:"S",kind:"door",u0:_-.53,u1:_+.53,c0:0,c1:10},{wall:"S",kind:"window",u0:-_-.55,u1:-_+.55,c0:4,c1:9},{wall:"N",kind:"window",u0:-1.72,u1:-.62,c0:4,c1:9},{wall:"N",kind:"window",u0:.62,u1:1.72,c0:4,c1:9},{wall:"W",kind:"window",u0:-.55,u1:.55,c0:4,c1:9}];p.push({wall:"E",kind:"window",u0:.35,u1:1.45,c0:4,c1:9});const d=D=>p.filter(B=>B.wall===D);for(let D=0;D<Jt.wallCourses;D++){const B=D&1,X=D*Te+xe.H/2,K=D*Te,nt=K+xe.H,it=zo.map(J=>{const st=J.axis==="x",ht=B===0?st:!st,ft=(st?Jt.w/2:Jt.d/2)-(ht?0:Jt.t),Mt=d(J.id),Pt=[];for(const R of Mt)D>=R.c0&&D<=R.c1?Pt.push({u0:R.u0,u1:R.u1}):D===R.c1+1&&Pt.push({u0:R.u0-.12,u1:R.u1+.12});const wt=cc(-ft,ft).map(R=>sg(R,Pt)).filter(Boolean),L=h(wt);return wt.map(R=>({w:J,b:R,runs:L,run:m(L,R)}))}),V=Math.max(...it.map(J=>J.length));for(let J=0;J<V;J++)for(const st of it){const ht=st[J];if(!ht)continue;const{w:ft,b:Mt,runs:Pt,run:wt}=ht,L=ft.axis==="x",R=L?Mt.c:ft.line,j=L?ft.line:Mt.c,rt=Pt[wt]??{u0:Mt.c-Mt.len/2,u1:Mt.c+Mt.len/2},N=(rt.u0+rt.u1)/2,_t=rt.u1-rt.u0;l({kind:"brick",phase:"walls",group:ft.id,course:D,pos:[R,X,j],euler:[0,L?0:Math.PI/2,0],size:[Mt.len,xe.H,Jt.t],color:c(),family:"masonry",deps:[],span:[Mt.c-Mt.len/2,Mt.c+Mt.len/2],stand:Ji(R,j,ft.nx,ft.nz,K,nt),mortar:f(`${ft.id}:${D}:${wt}`,()=>({pos:[L?N:ft.line,K+Te/2,L?ft.line:N],size:L?[_t-.02,Te,Jt.t-.035]:[Jt.t-.035,Te,_t-.02]}))})}for(const J of p){const st=zo.find(Mt=>Mt.id===J.wall),ht=st.axis==="x",ft=(J.u0+J.u1)/2;if(J.kind==="window"&&D===J.c0-1){const Mt=J.u1-J.u0+.22;l({kind:"sill",phase:"walls",group:st.id,course:D,pos:[ht?ft:st.line+st.nx*.03,K+Te+.03,ht?st.line+st.nz*.03:ft],euler:[0,ht?0:Math.PI/2,0],size:[Mt,.07,Jt.t+.12],color:we.lintel,family:"masonry",deps:[],stand:Ji(ht?ft:st.line,ht?st.line:ft,st.nx,st.nz,K,K+.1),mortar:-1})}if(D===J.c1+1){const Mt=J.u1-J.u0+.3;l({kind:"lintel",phase:"walls",group:st.id,course:D,pos:[ht?ft:st.line,X,ht?st.line:ft],euler:[0,ht?0:Math.PI/2,0],size:[Mt,xe.H,Jt.t+.02],color:we.lintel,family:"masonry",deps:[],stand:Ji(ht?ft:st.line,ht?st.line:ft,st.nx,st.nz,K,nt),mortar:-1})}}}for(let D=0;D<Jt.gableCourses;D++){const B=Ur+D*Te,X=B+xe.H/2,K=B+xe.H,nt=yi-(D+.5)*Te/fu;if(!(nt<.14))for(const it of zo.filter(V=>V.axis==="z"))for(const V of cc(-nt,nt))l({kind:"brick",phase:"gables",group:`gable${it.id}`,course:D,pos:[it.line,X,V.c],euler:[0,Math.PI/2,0],size:[V.len,xe.H,Jt.t],color:c(),family:"masonry",deps:[],span:[V.c-V.len/2,V.c+V.len/2],stand:Ji(it.line,V.c,it.nx,it.nz,B,K),mortar:f(`gable${it.id}:${D}`,()=>({pos:[it.line,B+Te/2,0],size:[Jt.t-.035,Te,nt*2-.02]}))})}const y=[_e.x],S=_e.z-_e.runLen/2,E=_e.z+_e.runLen/2;for(let D=0;D<_e.courses;D++){const B=D*Te,X=B+xe.H/2,K=B+xe.H;for(let nt=0;nt<y.length;nt++){const it=D+nt&1?Vs/2:0;for(const V of rg(S,E,it))l({kind:"brick",phase:"chimney",group:"chim",course:D,pos:[y[nt],X,V.c],euler:[0,Math.PI/2,0],size:[V.len,xe.H,xe.D],color:c(),family:"masonry",deps:[],span:[V.c-V.len/2,V.c+V.len/2],stand:Ji(_e.x,V.c,_e.side,0,B,K),mortar:f(`chim:${D}`,()=>({pos:[_e.x,B+Te/2,_e.z],size:[_e.depth-.035,Te,_e.runLen-.02]}))})}}for(let D=0;D<2;D++){const B=(_e.courses+D)*Te;l({kind:"lintel",phase:"chimney",group:"chim",course:_e.courses+D,pos:[_e.x,B+Te/2,_e.z],euler:[0,0,0],size:[_e.depth+.16-D*.06,Te,_e.runLen+.16-D*.06],color:we.lintel,family:"masonry",deps:[],stand:Ji(_e.x,_e.z,_e.side,0,B,B+Te),mortar:-1})}const P={};for(const D of[1,-1])P[D]=l({kind:"plate",phase:"roof",group:"roof",course:0,pos:[0,Ur+.06,D*na],euler:[0,0,0],size:[Jt.w,.12,Jt.t],color:we.timber,family:"timber",deps:[],stand:{level:1,x:0,y:le[1].y,z:D*zn.rz},mortar:-1});const w=9,A=[],Z=ms;for(let D=0;D<w;D++){const B=-2.32+D*(Jt.w-.4)/(w-1);for(const X of[1,-1]){const K=X*(yi+Jt.eaveOverhang)/2,nt=er(Math.abs(K))-.07;A.push(l({kind:"rafter",phase:"roof",group:"roof",course:1,pos:[B,nt,K],euler:[Ws,X>0?0:Math.PI,0],size:[.09,.14,Z],color:we.timber,family:"timber",deps:[P[X]],stand:{level:2,x:B,y:le[2].y,z:X*zn.rz},mortar:-1}))}}for(let D=0;D<3;D++){const B=Jt.w/3,X=-5.04/2+B*(D+.5);l({kind:"ridge",phase:"roof",group:"roof",course:2,pos:[X,er(0)-.1,0],euler:[0,0,0],size:[B,.2,.14],color:we.timber,family:"timber",deps:A.slice(),stand:Bo(X,1,ms-.72),mortar:-1})}const v=5,T=8,O=ms/v,H=Jt.w+.2,Q=H/T,U={};for(const D of[1,-1])for(let B=0;B<v;B++){const X=(B+.5)*O,K=ma(X),nt=er(K)+.03+B*.004;for(let it=0;it<T;it++){const V=-H/2+Q*(it+.5),J=X-.62,st=J<.5?{level:2,x:V,y:le[2].y,z:D*zn.rz}:Bo(V,D,J);U[`${D}:${B}:${it}`]=l({kind:"tile",phase:"tiles",group:`tile${D}`,course:B,pos:[V,nt,D*K],euler:[Ws,D>0?0:Math.PI,0],size:[Q-.012,.05,O+.1],color:u(),family:"tile",deps:B>0?[U[`${D}:${B-1}:${it}`]]:[],stand:st,mortar:-1})}}for(let D=0;D<T;D++){const B=-H/2+Q*(D+.5);l({kind:"cap",phase:"tiles",group:"caps",course:0,pos:[B,er(0)+.09,0],euler:[0,0,0],size:[Q-.012,.12,.36],color:u(),family:"tile",deps:[U[`1:${v-1}:${D}`],U[`-1:${v-1}:${D}`]],stand:Bo(B,1,ms-.6),mortar:-1})}const z=new Map;for(const D of e){if(!D.span)continue;const B=`${D.group}:${D.course}`;z.has(B)||z.set(B,[]),z.get(B).push(D)}for(const D of e){if(!D.span||D.course===0)continue;const B=z.get(`${D.group}:${D.course-1}`);if(B)for(const X of B)Math.min(D.span[1],X.span[1])-Math.max(D.span[0],X.span[0])>.05&&D.deps.push(X.i)}const W=fi.map(D=>({...D,total:e.filter(B=>B.phase===D.key).length})).filter(D=>D.total>0);return{items:e,phases:W,mortar:n,openings:p,familyCount:o,title:lc[(t-1)%lc.length],day:t}}const pu=new Tn(1,1,1),Un=new ii(.5,.5,1,16),gi=90;function jt(i,t,e,n,r,s=0,a=0,o=0,l=pu){const c=new pe(l,t);return c.scale.set(e,n,r),c.position.set(s,a,o),c.castShadow=!0,c.receiveShadow=!0,i.add(c),c}const uc=i=>`#${i.toString(16).padStart(6,"0")}`;function Xe(i,t){const e=Math.sin(i*127.1+t*311.7)*43758.5453;return e-Math.floor(e)}function lg(){const t=document.createElement("canvas");t.width=t.height=1024;const e=t.getContext("2d"),n=c=>(c+gi/2)/gi*1024,r=c=>(c+gi/2)/gi*1024,s=c=>c/gi*1024;e.fillStyle=uc(we.grass),e.fillRect(0,0,1024,1024);for(let c=0;c<2200;c++){const u=Xe(c,1)*1024,f=Xe(c,2)*1024;e.fillStyle=`rgba(${Xe(c,3)>.5?"120,160,80":"90,130,60"},0.16)`,e.fillRect(u,f,6+Xe(c,4)*22,3+Xe(c,5)*6)}const a=dt.fence;e.fillStyle=uc(we.dirt),e.beginPath(),e.rect(n(a.x0-.6),r(a.z0-.6),s(a.x1-a.x0+1.2),s(a.z1-a.z0+1.2)),e.fill();for(let c=0;c<4e3;c++){const u=n(a.x0)+Xe(c,11)*s(a.x1-a.x0),f=r(a.z0)+Xe(c,12)*s(a.z1-a.z0),h=Xe(c,13);e.fillStyle=h>.66?"rgba(150,120,88,0.30)":h>.33?"rgba(120,94,66,0.28)":"rgba(196,172,140,0.22)",e.fillRect(u,f,3+h*14,3+Xe(c,14)*10)}e.strokeStyle="rgba(92,72,52,0.5)",e.lineCap="round";const o=(c,u,f,h,m)=>{e.lineWidth=s(m),e.beginPath(),e.moveTo(n(c),r(u)),e.lineTo(n(f),r(h)),e.stroke()};o(dt.gate.x,dt.roadZ,dt.gate.x,dt.stack.z,2.6),o(dt.gate.x,dt.stack.z,dt.pallets[1].x,dt.pallets[1].z,2.2),o(dt.stack.x,dt.stack.z,dt.trailer.x,dt.trailer.z,1.6),o(dt.pallets[0].x,dt.pallets[0].z,dt.pallets[2].x,dt.pallets[2].z,1.8),e.strokeStyle="rgba(70,54,38,0.34)";for(const c of[-.55,.55])e.lineWidth=s(.2),e.beginPath(),e.moveTo(n(dt.gate.x+c),r(dt.roadZ)),e.lineTo(n(dt.gate.x+c),r(dt.stack.z-1)),e.stroke();e.fillStyle="#3b3f44",e.fillRect(0,r(dt.roadZ-3.1),1024,s(6.2)),e.fillStyle="rgba(255,255,255,0.06)";for(let c=0;c<900;c++)e.fillRect(Xe(c,21)*1024,r(dt.roadZ-3.1)+Xe(c,22)*s(6.2),3,2);e.fillStyle="#c9c2a8";for(let c=0;c<1024;c+=s(3.4))e.fillRect(c,r(dt.roadZ)-s(.09),s(1.9),s(.18));e.fillStyle="rgba(230,230,220,0.5)",e.fillRect(0,r(dt.roadZ-3),1024,s(.12)),e.fillRect(0,r(dt.roadZ+2.9),1024,s(.12)),e.fillStyle="#9a958c",e.fillRect(0,r(dt.roadZ-3.35),1024,s(.28)),e.fillRect(0,r(dt.roadZ+3.07),1024,s(.28));const l=new Or(t);return l.colorSpace=de,l.anisotropy=8,l}function cg(){const t=document.createElement("canvas");t.width=512,t.height=512;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,0,512);n.addColorStop(0,"#0d4b9c"),n.addColorStop(.32,"#2b76c6"),n.addColorStop(.46,"#5b9dda"),n.addColorStop(.58,"#8dbde6"),n.addColorStop(.72,"#b9d4e6"),n.addColorStop(1,"#cdbb99"),e.fillStyle=n,e.fillRect(0,0,512,512);for(let a=0;a<26;a++){const o=Xe(a,31)*512,l=40+Xe(a,32)*512*.42,c=16+Xe(a,33)*34,u=e.createRadialGradient(o,l,0,o,l,c);u.addColorStop(0,"rgba(250,252,255,0.62)"),u.addColorStop(.6,"rgba(240,246,252,0.28)"),u.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=u,e.beginPath(),e.arc(o,l,c,0,Math.PI*2),e.fill()}const r=new Or(t);return r.colorSpace=de,{mesh:new pe(new zr(220,24,16),new Dr({map:r,side:He,fog:!1,depthWrite:!1,toneMapped:!1}))}}function ug(){const i=new ie;i.add(new X0(12376309,9073493,1.05));const t=new Jl(16772300,2.15);t.position.set(-13,20,16),t.castShadow=!0,t.shadow.mapSize.set(2048,2048);const e=t.shadow.camera;e.left=-15,e.right=14,e.top=15,e.bottom=-11,e.near=1,e.far=60,t.shadow.bias=-6e-4,t.shadow.normalBias=.028,i.add(t),i.add(t.target),t.target.position.set(0,1.2,0);const n=new Jl(10470638,.42);return n.position.set(12,8,-14),i.add(n),{group:i,sun:t}}function hg(i,t){const e=document.createElement("canvas");e.width=512,e.height=160;const n=e.getContext("2d");n.fillStyle="#1d2a33",n.fillRect(0,0,512,160),n.fillStyle="#f0b429",n.fillRect(8,8,496,144),n.fillStyle="#1d2a33",n.fillRect(16,16,480,128),n.textAlign="center",n.fillStyle="#f5e6c8",n.font="bold 54px ui-monospace, Menlo, Consolas, monospace",n.fillText(i,256,76),n.fillStyle="#f0b429",n.font="26px ui-monospace, Menlo, Consolas, monospace",n.fillText(t,256,116);const r=new Or(e);return r.colorSpace=de,r.anisotropy=4,r}function fg(){const i=new ie,t=new Ft({color:15262418,roughness:.55,metalness:.2}),e=new Ft({color:3108776,roughness:.5,metalness:.3}),n=new Ft({color:4541266,roughness:.6,metalness:.4}),r=new Ft({color:9418444,roughness:.12,metalness:.5,emissive:1780275}),s=5.6,a=2.35,o=2.5,l=.72;jt(i,n,s-.3,.16,o-.4,0,l-.14);for(const d of[-1,1])for(const y of[-.62,.62]){const S=jt(i,new Ft({color:2040357,roughness:.95}),.62,.62,.24,d*1.5,.31,y,Un);S.rotation.x=Math.PI/2}jt(i,n,.16,.14,1.5,-s/2-.55,.5).rotation.y=0,jt(i,n,1.3,.12,.12,-s/2-.5,.5),jt(i,n,.1,.5,.1,-s/2-1.05,.3),jt(i,t,s,a,o,0,l+a/2);for(let d=0;d<22;d++)jt(i,t,.05,a-.16,.03,-s/2+.16+d*((s-.32)/21),l+a/2,o/2+.005),jt(i,t,.05,a-.16,.03,-s/2+.16+d*((s-.32)/21),l+a/2,-o/2-.005);jt(i,e,s+.14,.16,o+.14,0,l+a+.02),jt(i,e,s+.1,.14,o+.1,0,l+.06),jt(i,e,.98,1.95,.08,1.36,l+.98,o/2+.03),jt(i,n,.86,1.83,.04,1.36,l+.96,o/2+.07),jt(i,r,.5,.4,.02,1.36,l+1.6,o/2+.1),jt(i,new Ft({color:14270058,roughness:.3,metalness:.8}),.09,.09,.12,1.75,l+.95,o/2+.11);for(let d=0;d<3;d++)jt(i,n,1.1,.07,.34,1.36,l-.08-d*.24,o/2+.24+d*.3);jt(i,n,.06,.9,.06,1.95,l-.1,o/2+.4);for(const d of[-1.7,-.2])jt(i,e,1.24,.98,.06,d,l+1.42,o/2+.02),jt(i,r,1.1,.84,.03,d,l+1.42,o/2+.06),jt(i,new Ft({color:14209728,roughness:.9}),1.08,.26,.02,d,l+1.72,o/2+.08);jt(i,n,.8,.42,.7,-1.7,l+a+.28),jt(i,new Ft({color:7041144,roughness:.5}),.7,.06,.6,-1.7,l+a+.5),jt(i,n,.14,.7,.14,1.9,l+a+.4,-.6,Un),jt(i,n,.3,.08,.3,1.9,l+a+.76,-.6,Un),jt(i,new Ft({color:14474452,roughness:.6}),.62,.1,.62,.6,l+a+.36,.5,Un).rotation.set(.7,0,.3),jt(i,n,.05,.34,.05,.6,l+a+.2,.5);const u=new Ft({color:16747038,emissive:16738816,emissiveIntensity:1.4,roughness:.35}),f=jt(i,u,.26,.24,.26,0,l+a+.24,.9,Un);jt(i,n,.3,.06,.3,0,l+a+.12,.9,Un);const h=new pe(new ei(2.6,.82),new Ft({map:hg("SITE OFFICE","BRICK CREW CONSTRUCTION CO."),roughness:.85}));h.position.set(-.9,l+.5,o/2+.05),i.add(h);const m=jt(i,new Ft({color:15261118,roughness:.85}),.16,1.1,.16,2.15,.55,o/2+.35,Un);m.rotation.z=.24,jt(i,new Ft({color:12729134,roughness:.8}),.18,.05,.18,2.19,.7,o/2+.35,Un).rotation.z=.24;for(let d=0;d<2;d++)jt(i,new Ft({color:d?14509636:15790056,roughness:.7}),.11,.12,.11,1.05+d*.2,l+0,o/2+.3,Un);const g=new Dr({visible:!1}),_=[jt(i,g,s+.4,a+.9,o+.5,0,l+a/2),jt(i,g,1.4,2.2,1.2,1.36,l+1,o/2+.4)];_.forEach(d=>{d.castShadow=!1,d.receiveShadow=!1});const p=new pe(pu,new Dr({color:16765562,side:He,transparent:!0,opacity:0}));return p.scale.set(s+.22,a+.22,o+.22),p.position.set(0,l+a/2,0),p.castShadow=!1,i.add(p),{group:i,proxies:_,glow:p,beacon:f.material}}function dg(i){const t=document.createElement("canvas");t.width=512,t.height=128;const e=t.getContext("2d");e.fillStyle="rgba(20,26,31,0.88)",e.beginPath(),e.roundRect(6,18,500,76,14),e.fill(),e.strokeStyle="#f0b429",e.lineWidth=4,e.stroke(),e.fillStyle="#ffd97a",e.font="bold 44px ui-monospace, Menlo, Consolas, monospace",e.textAlign="center",e.fillText("BLUEPRINTS",256,70);const n=new Or(t);n.colorSpace=de;const r=new V0(new lu({map:n,depthTest:!1,transparent:!0}));return r.scale.set(2.6,.65,1),r}function pg(i){const t=new ie,e=[];for(let u=0;u<220&&e.length<90;u++){const f=i()*Math.PI*2,h=34+i()*52,m=Math.cos(f)*h,g=Math.sin(f)*h;Math.abs(g-dt.roadZ)<5.5||e.push([m,g,2.6+i()*3.8,i()])}const n=new Gs(new ii(.13,.19,1,6),new Ft({color:7033398,roughness:.95}),e.length),r=new Gs(new Fr(.5,1,7),new Ft({color:6262604,roughness:1}),e.length),s=new ce,a=new En,o=new F,l=new F,c=new Kt;return e.forEach(([u,f,h,m],g)=>{const _=h*.34;o.set(u,_/2,f),l.set(1,_,1),s.compose(o,a,l),n.setMatrixAt(g,s);const p=h*(.52+m*.22);o.set(u,_+(h-_)/2,f),l.set(p,h-_,p),s.compose(o,a,l),r.setMatrixAt(g,s),r.setColorAt(g,c.setHSL(.26+m*.06,.3+m*.12,.3+m*.13))}),n.instanceMatrix.needsUpdate=!0,r.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0),t.add(n,r),t}function mg(i){const t=dt.fence,e=new Ft({color:7298116,roughness:.92}),n=new Ft({color:13606751,roughness:.9}),r=new Ft({color:3108776,roughness:.7}),s=1.32,a=(l,c,u,f,h)=>{const m=Math.hypot(u-l,f-c),g=Math.max(1,Math.round(m/2.4));for(let _=0;_<g;_++){const p=_/g,d=(_+1)/g,y=l+(u-l)*(p+d)/2,S=c+(f-c)*(p+d)/2;if(h&&y>h[0]&&y<h[1])continue;const E=Math.abs(u-l)>Math.abs(f-c),P=m/g*.97,w=jt(i,_%4===1?r:n,E?P:.06,s,E?.06:P,y,s/2+.04,S);w.receiveShadow=!0}for(let _=0;_<=g;_++){const p=_/g,d=l+(u-l)*p,y=c+(f-c)*p;h&&d>h[0]-.4&&d<h[1]+.4||jt(i,e,.1,s+.14,.1,d,(s+.14)/2,y)}};a(t.x0,t.z1,t.x1,t.z1,[t.gapX0,t.gapX1]),a(t.x0,t.z0,t.x1,t.z0),a(t.x0,t.z0,t.x0,t.z1),a(t.x1,t.z0,t.x1,t.z1);const o=new Ft({color:10134184,roughness:.6,metalness:.4});for(const l of[-1,1]){const c=new ie;c.position.set(l>0?dt.fence.gapX1:dt.fence.gapX0,0,t.z1),c.rotation.y=l*1.15,jt(c,o,1.7,1.7,.05,l*1.7/2,.9),jt(c,e,.08,1.9,.08,0,.95),jt(c,e,.08,1.9,.08,l*1.7,.95),i.add(c)}}function gg(i=Math.random){const t=new ie,e=new pe(new ei(420,420),new Ft({color:we.grass,roughness:1}));e.rotation.x=-Math.PI/2,e.position.y=-.03,t.add(e);const n=new pe(new ei(gi,gi),new Ft({map:lg(),roughness:1}));n.rotation.x=-Math.PI/2,n.receiveShadow=!0,t.add(n),mg(t),t.add(pg(i));const r=fg();r.group.position.set(dt.trailer.x,0,dt.trailer.z),r.group.rotation.y=dt.trailer.rot,t.add(r.group);const s=dg();s.position.set(dt.trailer.x,4.15,dt.trailer.z),s.visible=!1,t.add(s);const a=new ie;a.position.set(dt.fence.gapX1+.5,0,dt.fence.z1),t.add(a),jt(a,new Ft({color:13159632,roughness:.4,metalness:.6}),.06,3.4,.06,0,1.7);const o=new ei(1.1,.62,10,1),l=new pe(o,new Ft({color:15769632,roughness:.85,side:on}));l.position.set(.57,3.05,0),l.castShadow=!0,a.add(l);const c=o.attributes.position.array.slice();let u=0,f=0;return{group:t,trailer:r.group,trailerTargets:r.proxies,trailerLabel:s,setTrailerHighlight(h){u=h?1:0},update(h,m){f+=m,r.glow.material.opacity+=(u*.42-r.glow.material.opacity)*Math.min(1,m*8),r.beacon.emissiveIntensity=.5+Math.abs(Math.sin(f*2.6))*2.2,s.position.y=4.15+Math.sin(f*2)*.06;const g=o.attributes.position;for(let _=0;_<g.count;_++){const p=c[_*3],d=c[_*3+1],y=(p+.55)/1.1;g.setZ(_,Math.sin(f*5+y*6)*.16*y+Math.sin(d*4+f*3)*.03*y)}g.needsUpdate=!0}}}const _g=new Tn(1,1,1),Ei=new ii(.5,.5,1,14),Xs=new Fr(.5,1,14);new zr(.5,10,8);const Ue=i=>i?i():Math.random(),Rt={steel:new Ft({color:11713732,roughness:.36,metalness:.8}),darkSteel:new Ft({color:5989227,roughness:.5,metalness:.7}),rubber:new Ft({color:2303529,roughness:.95}),timber:new Ft({color:we.timber,roughness:.92}),timberDark:new Ft({color:9397560,roughness:.94}),ply:new Ft({color:13673571,roughness:.9}),board:new Ft({color:9075296,roughness:.96}),orange:new Ft({color:14836255,roughness:.7}),yellow:new Ft({color:15249952,roughness:.62}),white:new Ft({color:15330800,roughness:.6}),wrap:new Ft({color:10475519,roughness:.25,metalness:.1,transparent:!0,opacity:.3,side:on}),sand:new Ft({color:13084784,roughness:1}),grit:new Ft({color:9341830,roughness:1}),mortar:new Ft({color:we.mortar,roughness:.95})};function Ut(i,t,e,n,r,s=0,a=0,o=0,l=_g){const c=new pe(l,t);return c.scale.set(e,n,r),c.position.set(s,a,o),c.castShadow=!0,c.receiveShadow=!0,i.add(c),c}function Ho(i,t,e,n,r,s,a){const o=Ut(i,t,n*2,e,n*2,r,s,a,Ei);return o.rotation.z=Math.PI/2,o}function gs(i,t,e,n,r,s,a){const o=Ut(i,t,n*2,e,n*2,r,s,a,Ei);return o.rotation.x=Math.PI/2,o}const xg=xe.L-yn,Ir=xe.H-yn,vg=xe.D-yn;function mu(i,t,e){const n=new Tn(xg,Ir,vg),r=new Gs(n,new Ft({roughness:.92,metalness:0}),i);r.castShadow=!0,r.receiveShadow=!0;const s=new ce,a=new En,o=new hr,l=new F,c=new F(1,1,1),u=new Kt;for(let f=0;f<i;f++){const h=t(f,e);o.set(0,h.ry||0,h.rz||0),a.setFromEuler(o),l.set(h.x,h.y,h.z),s.compose(l,a,c),r.setMatrixAt(f,s),r.setColorAt(f,u.setHex(we.brick[(f*7+3)%we.brick.length]))}return r.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0),r.count=i,r}function Mg(i){const t=new ie,e=120;for(const l of[-.44,0,.44])Ut(t,Rt.timberDark,1.15,.07,.11,0,.035,l);for(let l=0;l<6;l++)Ut(t,Rt.timber,1.15,.035,.13,0,.088,-.5+l*.2);const n=5,r=n*4,s=mu(e,l=>{const c=Math.floor(l/r),u=l%r,f=Math.floor(u/n),h=u%n,m=c&1;return{x:m?-.44+f*.29:-.5+h*.25,y:.108+c*(Ir+.006)+Ir/2,z:m?-.5+h*.25:-.44+f*.29,ry:m?Math.PI/2:0}},i);t.add(s);const a=Ut(t,Rt.wrap,1.22,.9,1.12,0,.56);a.castShadow=!1;let o=e;return{group:t,capacity:e,setCount(l){o=Math.max(0,Math.min(e,Math.round(l))),s.count=o,a.visible=o>12,a.scale.y=Math.max(.12,o/e*.9),a.position.y=a.scale.y/2+.11},get count(){return o}}}function Sg(i){const t=new ie,e=eg;Ut(t,Rt.ply,1.7,.03,1.3,0,.015);const n=6,r=n*2,s=[];for(let c=0;c<e;c++)s.push([(Ue(i)-.5)*.05,(Ue(i)-.5)*.16,(Ue(i)-.5)*.05]);const a=mu(e,c=>{const u=Math.floor(c/r),f=c%r,h=Math.floor(f/n),m=f%n,g=s[c];return{x:-.72+m*.28+g[0],y:.03+u*(Ir+.008)+Ir/2,z:-.24+h*.48+g[2],ry:g[1]}},i);t.add(a);let o=0;const l={group:t,capacity:e,setCount(c){o=Math.max(0,Math.min(e,Math.round(c))),a.count=o},get count(){return o}};return l.setCount(0),l}function yg(i){const t=new ie,e=1.3;for(const l of[-1,1]){const c=Ut(t,Rt.timber,.055,.055,e,l*.18,-.02,e/2);c.rotation.x=.1}const n=.92,r=Ut(t,Rt.steel,.64,.28,.72,0,-.24,n);r.rotation.x=.1,Ut(t,Rt.steel,.68,.06,.1,0,-.09,n-.32);for(const l of[-1,1])Ut(t,Rt.darkSteel,.05,.34,.05,l*.18,-.53,.46);for(const l of[-1,1])Ut(t,Rt.darkSteel,.055,.055,.36,l*.18,-.69,.56);const s=Ut(t,Rt.rubber,.3,.3,.12,0,-.57,n+.5,Ei);s.rotation.z=Math.PI/2;const a=Ut(t,Rt.steel,.12,.14,.12,0,-.57,n+.5,Ei);a.rotation.z=Math.PI/2;for(const l of[-1,1])Ut(t,Rt.darkSteel,.035,.4,.05,l*.1,-.4,n+.5);const o=new ye;return o.position.set(0,-.2,n),o.rotation.x=.1,t.add(o),{group:t,tray:o,wheel:s}}function Eg(i){const t=new ie;Ut(t,Rt.orange,.1,.68,.1,-.28,.34),Ut(t,Rt.orange,.1,.68,.1,.28,.34),Ut(t,Rt.darkSteel,.78,.07,.5,0,.05);for(const a of[-1,1]){const o=Ut(t,Rt.rubber,.2,.2,.07,a*.34,.1,-.06,Ei);o.rotation.z=Math.PI/2}const e=new ye;e.position.set(0,.78,.06),e.rotation.x=-.5,t.add(e);const n=Ut(e,Rt.yellow,.52,.5,.52,0,0,0,Ei);n.rotation.x=Math.PI/2,Ut(e,Rt.yellow,.34,.16,.34,0,0,.3,Xs).rotation.x=-Math.PI/2,Ut(t,Rt.darkSteel,.7,.16,.5,.9,.08,.3),Ut(t,Rt.mortar,.62,.1,.42,.9,.13,.3);const r=Ut(t,Rt.timber,.035,.9,.035,1.15,.45,.05);r.rotation.z=.3,Ut(t,Rt.steel,.17,.24,.02,1.29,.06,.05);let s=0;return{group:t,update(a){s+=a,e.rotation.z=s*1.1}}}function bg(){const i=new ie,{rx:t,rz:e,deckW:n,ladder:r}=zn,s=[];le[le.length-1].y;const a=[],o=t*2/4,l=e*2/3;for(let m=0;m<=4;m++)for(const g of[1,-1])a.push([-t+m*o,g*e]);for(let m=1;m<3;m++)for(const g of[1,-1])a.push([g*t,-e+m*l]);for(let m=1;m<le.length;m++){const g=new ie,_=le[m].y;for(const p of[1,-1])Ut(g,Rt.board,t*2+n,.05,n,0,_,p*e),Ut(g,Rt.board,n,.05,e*2-n,p*t,_,0);for(const p of[1,-1])Ho(g,Rt.darkSteel,t*2+n,.028,0,_-.05,p*(e-n/2+.03)),Ho(g,Rt.darkSteel,t*2+n,.028,0,_-.05,p*(e+n/2-.03)),gs(g,Rt.darkSteel,e*2,.028,p*(t-n/2+.03),_-.05,0),gs(g,Rt.darkSteel,e*2,.028,p*(t+n/2-.03),_-.05,0),Ho(g,Rt.steel,t*2+n,.022,0,_+.52,p*(e+n/2)),gs(g,Rt.steel,e*2,.022,p*(t+n/2),_+.52,0),Ut(g,Rt.timber,t*2+n,.13,.03,0,_+.09,p*(e+n/2)),Ut(g,Rt.timber,.03,.13,e*2,p*(t+n/2),_+.09,0);s.push({group:g,y:_}),i.add(g)}const c=[];for(let m=1;m<le.length;m++){const g=new ie,_=le[m-1].y,p=le[m].y+(m===le.length-1?.75:0);for(const[d,y]of a)Ut(g,Rt.steel,.05,p-_,.05,d,_+(p-_)/2,y,Ei);c.push(g),i.add(g)}const u=[];for(let m=1;m<le.length;m++){const g=new ie,_=le[m-1].y,d=le[m].y+.5-_;for(const S of[-1,1])Ut(g,Rt.timber,.045,d,.045,r.x-.16,_+d/2,r.z+S*.19);const y=Math.max(2,Math.round(d/.26));for(let S=1;S<y;S++)gs(g,Rt.timber,.4,.018,r.x-.16,_+d*S/y,r.z);u.push(g),i.add(g)}let f=-1;function h(m){const g=Math.max(0,Math.min(s.length,Math.round(m)));g!==f&&(f=g,s.forEach((_,p)=>_.group.visible=p<g),c.forEach((_,p)=>_.visible=p<g),u.forEach((_,p)=>_.visible=p<g),i.visible=g>0)}return h(0),{group:i,setDecks:h}}function Tg(i){const t=new ie;return Ut(t,Rt.rubber,.34,.035,.34,0,.018),Ut(t,Rt.orange,.26,.52,.26,0,.28,0,Xs),Ut(t,Rt.white,.2,.07,.2,0,.3,0,Xs).scale.set(.2,.09,.2),t.rotation.y=Ue(i)*Math.PI,t}function wg(i){const t=new ie;Ut(t,Rt.timberDark,.72,.36,.5,0,.18),Ut(t,Rt.timber,.74,.05,.52,0,.02);const e=Ut(t,Rt.timber,.72,.04,.5,0,.4,-.24);e.rotation.x=-1.1;for(let n=0;n<3;n++){const r=Ut(t,Rt.timber,.03,.42,.03,-.2+n*.18,.5,.05);r.rotation.z=-.3+n*.25}return Ut(t,Rt.steel,.13,.03,.2,.26,.38,.1),t.rotation.y=(Ue(i)-.5)*.7,t}function Ag(i){const t=new ie;for(const e of[-.7,.7])Ut(t,Rt.timberDark,2.2,.08,.12,0,.04,e);for(let e=0;e<5;e++){const n=5-Math.floor(e/2);for(let r=0;r<n;r++)Ut(t,e&1?Rt.timber:Rt.timberDark,2.2,.09,.15,0,.09+e*.1,-.4+r*.2+(Ue(i)-.5)*.02)}for(const e of[-.7,.7])Ut(t,Rt.darkSteel,.02,.56,.9,e,.3);return t.rotation.y=(Ue(i)-.5)*.3,t}function Rg(i){const t=new ie,e=Ut(t,Rt.yellow,2.1,.86,1.25,0,.5);e.material=new Ft({color:12093738,roughness:.75,metalness:.25});for(const n of[-1,1])Ut(t,Rt.darkSteel,2.14,.09,.09,0,.93,n*.6);for(const n of[-1,1])Ut(t,Rt.darkSteel,.09,.9,.09,n*1,.5,0);Ut(t,Rt.darkSteel,2.2,.12,1.3,0,.06);for(let n=0;n<14;n++)Ut(t,n%3?Rt.grit:Rt.timberDark,.16+Ue(i)*.2,.1,.14,(Ue(i)-.5)*1.7,.9+Ue(i)*.14,(Ue(i)-.5)*.9).rotation.set(Ue(i),Ue(i)*3,Ue(i));return t}function Cg(i){const t=new ie,e=new Ft({color:4165485,roughness:.55});return Ut(t,e,.94,2.06,.94,0,1.03),Ut(t,e,1.02,.08,1.02,0,2.08),Ut(t,Rt.white,.62,1.5,.02,0,.85,.48),Ut(t,new Ft({color:2767428,roughness:.4}),.4,.22,.02,0,1.72,.49),Ut(t,Rt.darkSteel,.06,.06,.03,.24,.95,.5),t.rotation.y=(Ue(i)-.5)*.5,t}function Lg(i){const t=new ie;for(let e=0;e<3;e++){const n=1.5-e*.32,r=Ut(t,e===1?Rt.grit:Rt.sand,n*2,.5+e*.16,n*2,(Ue(i)-.5)*.5,0,(Ue(i)-.5)*.5,Xs);r.position.y=(.5+e*.16)/2,r.receiveShadow=!0}return t}function Pg(i){const t=new ie,e=document.createElement("canvas");e.width=512,e.height=256;const n=e.getContext("2d");n.fillStyle="#d8b071",n.fillRect(0,0,512,256),n.strokeStyle="rgba(120,80,40,0.16)";for(let l=0;l<60;l++)n.beginPath(),n.moveTo(0,l*4.6+Math.sin(l)*3),n.bezierCurveTo(170,l*4.6+6,340,l*4.6-6,512,l*4.6+Math.cos(l)*3),n.stroke();n.fillStyle="#22282c",n.fillRect(16,16,480,224),n.fillStyle="#d8b071",n.fillRect(24,24,464,208),n.fillStyle="#1d2226",n.textAlign="center",String(i).split(`
`).forEach((l,c)=>{n.font=`${c===0?"bold 58":"34"}px ui-monospace, Menlo, Consolas, monospace`,n.fillText(l,256,108+c*52)});const s=new Or(e);s.colorSpace=de,s.anisotropy=4;const a=new Ft({map:s,roughness:.9});for(const l of[-1,1])Ut(t,Rt.timberDark,.08,1.5,.08,l*.62,.75);const o=Ut(t,a,1.6,.8,.05,0,1.2,.04);return o.material=a,t}const gu=Jt.w/2+.3,_u=Jt.d/2+.3,_s=gu+.35,xs=_u+.35,Dg=[[_s,xs],[_s,-xs],[-_s,-xs],[-_s,xs]],Yn=zn.rx,gn=zn.rz,Rr=[[-Yn,gn,Yn,gn],[Yn,gn,Yn,-gn],[Yn,-gn,-Yn,-gn],[-Yn,-gn,-Yn,gn]],Cr=Rr.map(([i,t,e,n])=>Math.hypot(e-i,n-t)),ga=Cr.reduce((i,t)=>(i.push(i[i.length-1]+t),i),[0]),$n=ga[4],tn=zn.ladder;function vs(i,t,e,n){const r=gu-.02,s=_u-.02,a=e-i,o=n-t;let l=0,c=1;const u=(f,h)=>{if(Math.abs(f)<1e-9)return h>=0;const m=h/f;if(f<0){if(m>c)return!1;m>l&&(l=m)}else{if(m<l)return!1;m<c&&(c=m)}return!0};return!u(-a,i+r)||!u(a,r-i)||!u(-o,t+s)||!u(o,s-t)?!1:l<c}function hc(i,t,e,n){if(!vs(i,t,e,n))return[{x:e,y:0,z:n}];let r=null;for(let a=0;a<4;a++)for(const o of[1,-1])for(let l=1;l<=3;l++){const c=[];let u=a;for(let g=0;g<l;g++)c.push(Dg[u]),u=(u+o+4)%4;let f=!vs(i,t,c[0][0],c[0][1]);for(let g=0;f&&g<c.length-1;g++)f=!vs(c[g][0],c[g][1],c[g+1][0],c[g+1][1]);const h=c[c.length-1];if(f=f&&!vs(h[0],h[1],e,n),!f)continue;let m=Math.hypot(c[0][0]-i,c[0][1]-t);for(let g=0;g<c.length-1;g++)m+=Math.hypot(c[g+1][0]-c[g][0],c[g+1][1]-c[g][1]);m+=Math.hypot(e-h[0],n-h[1]),(!r||m<r.len)&&(r={len:m,pts:c})}const s=r?r.pts.map(([a,o])=>({x:a,y:0,z:o})):[];return s.push({x:e,y:0,z:n}),s}function di(i,t){let e=1/0,n=0;for(let r=0;r<4;r++){const[s,a,o,l]=Rr[r],c=o-s,u=l-a,f=c*c+u*u;let h=((i-s)*c+(t-a)*u)/f;h=Math.max(0,Math.min(1,h));const m=s+c*h,g=a+u*h,_=(m-i)**2+(g-t)**2;_<e&&(e=_,n=ga[r]+h*Cr[r])}return n}function fc(i){let t=(i%$n+$n)%$n;for(let e=0;e<4;e++){if(t<=Cr[e]||e===3){const n=Math.min(1,t/Cr[e]),[r,s,a,o]=Rr[e];return{x:r+(a-r)*n,z:s+(o-s)*n}}t-=Cr[e]}return{x:Rr[0][0],z:Rr[0][1]}}const ko=(i,t)=>(i%t+t)%t;function Ms(i,t,e){const n=ko(e-t,$n),r=n<=$n-n?1:-1,s=r===1?n:$n-n,a=[];for(let c=0;c<4;c++){const u=ga[c],f=ko(r===1?u-t:t-u,$n);f>.001&&f<s-.001&&a.push({d:f,cu:u})}a.sort((c,u)=>c.d-u.d);const o=a.map(({cu:c})=>{const u=fc(c);return{x:u.x,y:i,z:u.z}}),l=fc(e);return o.push({x:l.x,y:i,z:l.z}),o}function Ls(i,t,e){const n=ma(e);return{x:i,y:er(n),z:t*n}}function Ug(i,t){return Ls(i,t,0)}const dc=di(tn.x,tn.z);function Ig(i,t){const e=[];let n={...i};if(n.level==="roof"&&t.level==="roof"&&t.side===n.side)return e.push({...Ls(t.x,t.side,t.sd),roof:t.side}),e;n.level==="roof"&&(e.push({...Ls(n.x,n.side,0),roof:n.side}),e.push({x:n.x,y:le[2].y,z:n.side*gn}),n={level:2,x:n.x,y:le[2].y,z:n.side*gn});const r=t.level==="roof"?2:t.level;for(;n.level>r;){const s=di(n.x,n.z);for(const o of Ms(le[n.level].y,s,dc))e.push(o);const a=n.level-1===0?0:le[n.level-1].y;e.push({x:tn.x,y:a,z:tn.z,climb:!0}),n={level:n.level-1,x:tn.x,y:a,z:tn.z}}for(;n.level<r;){if(n.level===0)for(const s of hc(n.x,n.z,tn.x,tn.z))e.push(s);else{const s=di(n.x,n.z);for(const a of Ms(le[n.level].y,s,dc))e.push(a)}e.push({x:tn.x,y:le[n.level+1].y,z:tn.z,climb:!0}),n={level:n.level+1,x:tn.x,y:le[n.level+1].y,z:tn.z}}if(t.level==="roof"){const s=di(n.x,n.z),a=di(t.x,t.side*gn);for(const o of Ms(le[2].y,s,a))e.push(o);return e.push({...Ug(t.x,t.side),roof:t.side}),e.push({...Ls(t.x,t.side,t.sd),roof:t.side}),e}if(r===0)for(const s of hc(n.x,n.z,t.x,t.z))e.push(s);else{const s=di(n.x,n.z);for(const a of Ms(le[r].y,s,di(t.x,t.z)))e.push(a)}return e}function Ng(i){return i.level==="roof"?{level:"roof",side:i.side,sd:i.sd,x:i.x,y:i.y,z:i.z,tilt:i.tilt??0}:{level:i.level,x:i.x,y:i.y,z:i.z}}const xu=new Tn(1,1,1);new ii(.5,.5,1,12);const Ss=new zr(.5,12,8),ys=new Kt;function pc(i,t,e=.08){ys.setHex(i);const n={};return ys.getHSL(n),ys.setHSL(n.h+(t()-.5)*.02,Math.max(0,Math.min(1,n.s+(t()-.5)*.12)),Math.max(.04,Math.min(.96,n.l+(t()-.5)*e))),ys.getHex()}function mn(i,t={}){return new Ft({color:i,roughness:.72,metalness:.12,...t})}function ee(i,t,e,n,r,s=0,a=0,o=0,l=xu){const c=new pe(l,t);return c.scale.set(e,n,r),c.position.set(s,a,o),c.castShadow=!0,i.add(c),c}function pn(i,t=0,e=0,n=0){const r=new ye;return r.position.set(t,e,n),i.add(r),r}const Wt=(i,t,e)=>i+(t-i)*e,br=i=>i<0?0:i>1?1:i;function mc(i,t=we.brick){const e=new ie,n=xe.L-yn,r=xe.H-yn,s=xe.D-yn,a=2;for(let o=0;o<i;o++){const l=Math.floor(o/a),c=o%a,u=new pe(xu,mn(t[o%t.length],{roughness:.9,metalness:0}));u.scale.set(n*.92,r,s*.92),u.position.set((c-(a-1)/2)*(s*1.02),l*(r+.012),o*37%7*.004-.012),u.rotation.y=Math.PI/2+(o*13%5-2)*.012,u.castShadow=!0,e.add(u)}return e}function Og({role:i="mason",accent:t=14173231,hatColor:e=16036890,rng:n=Math.random}={}){const r=new ie;r.rotation.order="YXZ";const s=i==="foreman",a=.94+n()*.14,o=pc(i==="barrow"?9279395:10134704,n,.14),l=pc(3949129,n,.1),c=s?15921738:15769632,u=mn(o,{roughness:.5,metalness:.45}),f=mn(l,{roughness:.65,metalness:.3}),h=mn(c,{roughness:.85,metalness:0}),m=mn(15265522,{roughness:.28,metalness:.15,emissive:1712166}),g=mn(t,{roughness:.6,metalness:.2}),_=mn(e,{roughness:.42,metalness:.05}),p=new Ft({color:858914,emissive:4839679,emissiveIntensity:1.35,roughness:.25,metalness:.4}),d=mn(2303787,{roughness:.95,metalness:0}),y=mn(12174025,{roughness:.3,metalness:.8}),S=.6+n()*.04,E=.27,P=.25,w=.48+n()*.05,A=w*.86;.19+n()*.03;const Z=.23,v=.21,T=.36+n()*.05,O=.24,H=pn(r,0,S),Q=pn(H,0,0);ee(H,f,T*.92,.11,O*.95,0,-.02),ee(Q,u,T,w,O,0,w/2),ee(Q,h,T+.035,w*.62,O+.035,0,w*.44),s&&ee(Q,h,T+.03,.2,O+.03,0,w*.06);for(const Tt of[w*.3,w*.56])ee(Q,m,T+.045,.035,O+.045,0,Tt);ee(Q,g,.1,.11,.02,T*.28,w*.72,O/2+.02),ee(Q,g,.14,.1,.02,0,w*.52,-O/2-.03),ee(Q,f,T+.04,.06,O+.04,0,.04),ee(Q,y,.05,.09,.04,T*.42,.02,O/2-.02);const U=pn(Q,0,w);ee(U,f,.09,.05,.09,0,.02);const z=.24;ee(U,u,.29,z,.24,0,.04+z/2);const W=ee(U,p,.22,.075,.02,0,.05+z*.62,.125),D=.04+z+.035;if(ee(U,_,.3,.13,.27,0,D,0,Ss),ee(U,_,.34,.028,.36,0,D-.055),ee(U,g,.05,.1,.28,0,D+.02),n()<.45?(ee(U,y,.012,.16,.012,.1,D+.1),ee(U,g,.035,.035,.035,.1,D+.19,0,Ss)):ee(U,m,.09,.035,.05,0,D+.04,.13),n()<.4)for(const Tt of[-1,1])ee(U,f,.05,.09,.09,Tt*.16,.05+z*.55);function B(Tt){const mt=pn(Q,Tt*(T/2+.035),A);ee(mt,g,.09,.09,.09,0,0,0,Ss),ee(mt,u,.1,Z,.11,0,-Z/2);const M=pn(mt,0,-Z);ee(M,f,.075,.075,.075,0,0,0,Ss),ee(M,u,.09,v,.1,0,-v/2);const x=pn(M,0,-v);return ee(x,f,.1,.09,.11,0,-.03),{sh:mt,el:M,hand:x}}const X=B(-1),K=B(1);function nt(Tt){const mt=pn(H,Tt*(T*.26),-.06);ee(mt,u,.13,E,.14,0,-E/2);const M=pn(mt,0,-E);ee(M,g,.13,.05,.13,0,.01),ee(M,u,.11,P,.12,0,-P/2);const x=pn(M,0,-P);return ee(x,d,.15,.09,.26,0,-.045,.045),ee(x,f,.16,.03,.24,0,-.085,.04),{hp:mt,kn:M,ft:x}}const it=nt(-1),V=nt(1),J=new ie;ee(J,f,.025,.09,.025);const st=ee(J,y,.075,.012,.19,0,-.06,.09);st.rotation.x=.12,J.position.set(0,-.06,.02),J.rotation.x=-.4,J.visible=!1,K.hand.add(J);let ht=null;s&&(ht=new ie,ee(ht,mn(13081180,{roughness:.9}),.2,.01,.26),ee(ht,mn(15986658,{roughness:.95}),.17,.008,.22,0,.011,-.01),ee(ht,y,.07,.012,.03,0,.02,.1),ht.position.set(0,-.08,.06),ht.rotation.x=-.5,X.hand.add(ht));const ft=pn(Q,0,w*.42,O/2+.16),Mt=pn(r,0,.62,.42);r.traverse(Tt=>{Tt.isMesh&&(Tt.castShadow=!0)}),r.scale.setScalar(a);const Pt=(S+w+.04+z+.14)*a,wt=n()*Math.PI*2,L=.012+n()*.008;let R=wt,j=0;const rt=()=>({hipL:0,hipR:0,kneeL:0,kneeR:0,shLX:0,shRX:0,shLZ:.06,shRZ:-.06,elL:-.12,elR:-.12,torsoX:.03,torsoY:0,rootY:0,rootZ:0}),N=rt();function _t(Tt,mt={}){const M=mt.speed??0,x=!!mt.moving&&M>.02,G=mt.carry??0,tt=br(mt.push??0),et=br(mt.lay??0),ot=br(mt.reach??0),Et=br(mt.idle??0),gt=br(mt.wave??0),vt=G>0?1:0;if(Object.assign(N,rt()),x){const At=Math.min(.72,.34+M*.26);R+=Tt*(M/.42)*Math.PI;const Ot=Math.sin(R),at=Math.cos(R);N.hipL=Ot*At,N.hipR=-Ot*At,N.kneeL=-Math.max(0,-Ot)*.9-.12,N.kneeR=-Math.max(0,Ot)*.9-.12,N.shLX=-Ot*At*.55,N.shRX=Ot*At*.55,N.rootY=Math.abs(at)*L-L*.5,N.torsoY=Ot*.06,N.torsoX=.05+M*.04}else R+=Tt*1.1,N.rootY=Math.sin(R*.8)*.004;if(Et>0&&(N.shLX=Wt(N.shLX,-.15,Et),N.shRX=Wt(N.shRX,-.15,Et),N.shLZ=Wt(N.shLZ,.75,Et),N.shRZ=Wt(N.shRZ,-.75,Et),N.elL=Wt(N.elL,-1.55,Et),N.elR=Wt(N.elR,-1.55,Et),N.torsoY=Wt(N.torsoY,Math.sin(R*.5)*.12,Et)),vt>0&&(N.shLX=Wt(N.shLX,-1.25,vt),N.shRX=Wt(N.shRX,-1.25,vt),N.shLZ=Wt(N.shLZ,.22,vt),N.shRZ=Wt(N.shRZ,-.22,vt),N.elL=Wt(N.elL,-1.15,vt),N.elR=Wt(N.elR,-1.15,vt),N.torsoX=Wt(N.torsoX,-.1,vt)),tt>0&&(N.shLX=Wt(N.shLX,-1.05,tt),N.shRX=Wt(N.shRX,-1.05,tt),N.shLZ=Wt(N.shLZ,.12,tt),N.shRZ=Wt(N.shRZ,-.12,tt),N.elL=Wt(N.elL,-.18,tt),N.elR=Wt(N.elR,-.18,tt),N.torsoX=Wt(N.torsoX,.26,tt)),ot>0&&(N.shLX=Wt(N.shLX,-2.35,ot),N.shRX=Wt(N.shRX,-2.5,ot),N.elL=Wt(N.elL,-.2,ot),N.elR=Wt(N.elR,-.15,ot),N.torsoX=Wt(N.torsoX,-.16,ot),N.kneeL=Wt(N.kneeL,-.05,ot),N.kneeR=Wt(N.kneeR,-.05,ot)),et>0){const At=Math.sin(j*3.4)*.12;N.hipL=Wt(N.hipL,.42,et),N.hipR=Wt(N.hipR,.42,et),N.kneeL=Wt(N.kneeL,-.78,et),N.kneeR=Wt(N.kneeR,-.78,et),N.torsoX=Wt(N.torsoX,.46+At*.4,et),N.shRX=Wt(N.shRX,-.62+At,et),N.shLX=Wt(N.shLX,-.34,et),N.elR=Wt(N.elR,-.5,et),N.elL=Wt(N.elL,-.9,et),N.rootY=Wt(N.rootY,-.1,et)}gt>0?(j+=Tt,N.shRX=Wt(N.shRX,-2.7,gt),N.shRZ=Wt(N.shRZ,-.5+Math.sin(j*7)*.45,gt),N.elR=Wt(N.elR,-.35,gt)):j+=Tt,H.position.y=S+N.rootY,H.position.z=N.rootZ,Q.rotation.x=N.torsoX,Q.rotation.y=N.torsoY*.5,Q.rotation.z=0,it.hp.rotation.x=N.hipL,V.hp.rotation.x=N.hipR,it.kn.rotation.x=N.kneeL,V.kn.rotation.x=N.kneeR,X.sh.rotation.set(N.shLX,0,N.shLZ),K.sh.rotation.set(N.shRX,0,N.shRZ),X.el.rotation.x=N.elL,K.el.rotation.x=N.elR,r.rotation.x=mt.tilt??0,J.visible=et>.25&&!s,W.material.emissiveIntensity=1.15+Math.sin(j*2.2+wt)*.25}return _t(0,{}),{group:r,height:Pt,handAnchor:ft,barrowAnchor:Mt,update:_t,role:i}}const Ps=Math.PI*2,Fg=i=>((i+Math.PI)%Ps+Ps)%Ps-Math.PI,gc={level:0,x:dt.stack.x,y:0,z:dt.stack.z-1.15},_c={x:dt.muster.x,z:dt.muster.z};function zg({plan:i,rng:t,scene:e,stack:n,pallets:r,scaffold:s,onPlace:a,onBanner:o,onComplete:l}){const c=[],u=new Uint8Array(i.items.length),f=new Int16Array(i.items.length).fill(-1),h=i.mortar.map(L=>L.needs);let m=0,g=0,_=0,p=0,d=0,y=0,S=Fo[0],E=!1,P=0;const w=[],A=fi.map(L=>i.items.filter(R=>R.phase===L.key).length),Z=()=>r.reduce((L,R)=>L+R.count,0);function v(){let L=r[0];for(const R of r)R.count>L.count&&(L=R);return L}function T(L){return{level:0,x:L.pos.x-1.15,y:0,z:L.pos.z}}function O(L){const R=i.items,j=Math.min(R.length,g+70);for(let rt=g;rt<j;rt++){const N=R[rt];if(u[rt]||f[rt]>=0||N.phase!==fi[_].key)continue;let _t=!0;for(const mt of N.deps)if(!u[mt]){_t=!1;break}if(!_t)continue;let Tt=!0;for(const mt of c){if(mt===L||mt.claim==null)continue;const M=R[mt.claim].stand;if(Math.hypot(M.x-N.stand.x,M.z-N.stand.z)<ng&&Math.abs((M.y||0)-(N.stand.y||0))<.6){Tt=!1;break}}if(Tt)return f[rt]=1,rt}return null}function H(L){const R=i.items[L];for(u[L]=1,f[L]=-1,m++,p++,w.push(d),w.length>220&&w.shift(),a(R),R.mortar>=0&&--h[R.mortar]===0&&a(i.mortar[R.mortar],!0);g<u.length&&u[g];)g++;p>=A[_]&&_<fi.length-1&&(_++,p=0);let j=0;for(let rt=g;rt<Math.min(i.items.length,g+90);rt++){const N=i.items[rt].stand.level;j=Math.max(j,N==="roof"?2:N)}s.setDecks(j),m>=i.items.length&&!E&&(E=!0,P=0,l==null||l())}function Q(L,R){const j=[];let rt=0;for(const N of tg)for(let _t=0;_t<N.n;_t++,rt++){const Tt=Og({role:N.role,accent:L.accent,hatColor:L.hat,rng:t}),mt=(rt-4)*.55,M={rig:Tt,role:N.role,crewId:y,pos:new F(dt.arrival.x-Math.abs(mt)*1.4,0,dt.arrival.z+mt*.5),yaw:Math.PI/2,stance:{level:0,x:dt.arrival.x,y:0,z:dt.arrival.z},path:[],then:null,state:"walk",timer:0,claim:null,carry:0,leaving:!1,anim:{}};R||(M.pos.set(dt.muster.x+mt,0,dt.muster.z+rt%3*.5),M.stance={level:0,x:M.pos.x,y:0,z:M.pos.z}),M.rig.group.position.copy(M.pos),e.add(Tt.group);const x=mc(6,we.brick);if(x.scale.setScalar(.94),x.position.y=-.06,Tt.handAnchor.add(x),M.armful=x,x.children.forEach(G=>G.visible=!1),N.role==="barrow"){const G=yg();Tt.barrowAnchor.add(G.group);const tt=mc(10,we.brick);tt.scale.setScalar(.95),tt.position.set(0,-.02,0),G.tray.add(tt),tt.children.forEach(et=>et.visible=!1),M.barrow=G,M.barrowLoad=tt}j.push(M),c.push(M)}for(const N of j)R?U(N,{level:0,x:dt.gate.x+(t()-.5)*1.8,y:0,z:dt.gate.z-.8},()=>D(N)):D(N);return j}function U(L,R,j){L.path=Ig(L.stance,R),L.target=R,L.then=j,L.state="walk"}function z(L,R,j){L.state="wait",L.timer=R,L.then=j}function W(L,R,j){const rt=R-L.pos.x,N=j-L.pos.z;Math.abs(rt)+Math.abs(N)>1e-4&&(L.faceYaw=Math.atan2(rt,N))}function D(L){return L.leaving?it(L):E?V(L):L.role==="foreman"?nt(L):L.role==="mason"?B(L):X(L)}function B(L){if(L.claim==null){const j=O(L);if(j==null)return z(L,.9+t()*.6,()=>D(L));L.claim=j}if(L.carry<=0)return n.count<=0?z(L,.8+t()*.7,()=>D(L)):U(L,gc,()=>{const j=Math.min(ps.mason,n.count);if(j<=0)return D(L);n.setCount(n.count-j),L.carry=j,W(L,dt.stack.x,dt.stack.z),z(L,ui.pickTime*j,()=>D(L))});const R=i.items[L.claim];U(L,R.stand,()=>{W(L,R.pos[0],R.pos[2]),L.state="lay",L.timer=ui.layTime,L.layHigh=R.pos[1]-(R.stand.y||0)>1.05,L.then=()=>{u[L.claim]?f[L.claim]=-1:H(L.claim),L.claim=null,L.carry=Math.max(0,L.carry-1),D(L)}})}function X(L){const R=L.role==="barrow"?ps.barrow:ps.carrier;if(L.carry<=0){if(Z()<=0)return z(L,1.5,()=>D(L));const j=v();return U(L,T(j),()=>{const rt=Math.min(R,j.count);j.setCount(j.count-rt),L.carry=rt,W(L,j.pos.x,j.pos.z),z(L,ui.pickTime*(L.role==="barrow"?rt*.35:rt),()=>D(L))})}return n.count>=n.capacity-2?z(L,1.2,()=>D(L)):U(L,gc,()=>{W(L,dt.stack.x,dt.stack.z);const j=n.capacity-n.count,rt=Math.min(L.carry,j);n.setCount(n.count+rt),L.carry-=rt,z(L,1.1,()=>{L.carry=0,D(L)})})}const K=[{x:dt.trailer.x+2.4,z:dt.trailer.z+2.2},{x:dt.stack.x-2.2,z:dt.stack.z+.6},{x:4.4,z:3},{x:-4.6,z:-2.4},{x:.4,z:5.6},{x:dt.pallets[1].x-2.2,z:dt.pallets[1].z}];function nt(L){const R=K[t()*K.length|0];U(L,{level:0,x:R.x,y:0,z:R.z},()=>{W(L,0,0),L.state="inspect",L.timer=3+t()*4,L.then=()=>D(L)})}function it(L){L.claim!=null&&(f[L.claim]=-1,L.claim=null),L.carry>0&&(n.setCount(Math.min(n.capacity,n.count+L.carry)),L.carry=0),U(L,{level:0,x:_c.x+(t()-.5)*2.4,y:0,z:_c.z+(t()-.5)*1.4},()=>{W(L,dt.gate.x,dt.roadZ),L.state="wave",L.timer=1.4+t()*1.2,L.then=()=>{U(L,{level:0,x:dt.gate.x+(t()-.5)*1.6,y:0,z:dt.gate.z+.6},()=>{U(L,{level:0,x:dt.offsite.x,y:0,z:dt.offsite.z},()=>{L.dead=!0})})}})}function V(L){const R=c.indexOf(L)/Math.max(1,c.length)*Ps;U(L,{level:0,x:Math.cos(R)*5.6,y:0,z:4.4+Math.sin(R)*1.5},()=>{W(L,0,1),L.state="wave",L.timer=1/0,L.then=null})}function J(L,R){if(!L.path.length){L.state="idle";const j=L.then;L.then=null,j&&j();return}for(;L.path.length;){const j=L.path[0],rt=!!j.climb,N=L.carry>0||L.role==="barrow",_t=rt?ui.climb:N?ui.walkLaden:ui.walk,Tt=j.x-L.pos.x,mt=j.y-L.pos.y,M=j.z-L.pos.z,x=Math.hypot(Tt,mt,M),G=_t*R;if(x<=Math.max(G,1e-4)){if(L.pos.set(j.x,j.y,j.z),L.roofSide=j.roof??null,L.path.shift(),!L.path.length){L.stance=Ng(L.target),L.speed=0;const tt=L.then;L.then=null,L.state="idle",tt&&tt();return}continue}L.pos.x+=Tt/x*G,L.pos.y+=mt/x*G,L.pos.z+=M/x*G,L.speed=_t,!rt&&Math.abs(Tt)+Math.abs(M)>.001&&(L.faceYaw=Math.atan2(Tt,M)),L.climbing=rt,L.roofSide=j.roof??null;return}}function st(L){if(y++,S=Fo[(y-1)%Fo.length],Q(S,!L),!L){for(const R of c)R.crewId<y&&!R.leaving&&(R.leaving=!0,(R.state==="wait"||R.state==="idle"||R.state==="inspect")&&D(R));ht||o("SHIFT CHANGE",`${S.name} crew on — day ${i.day}`,`#${S.accent.toString(16).padStart(6,"0")}`)}}let ht=!1;function ft(L){ht=!0;const R=1/20;for(let j=0;j<L;j+=R)Mt(R);ht=!1}st(!0);function Mt(L){d+=L,!E&&Math.floor(d/Cs)+1>y&&st(!1),E&&!ht&&(P+=L);for(const R of r)R.count<=0&&(R.restock=(R.restock??0)+L,R.restock>7&&(R.setCount(R.capacity),R.restock=0));for(let R=c.length-1;R>=0;R--){const j=c[R];if(j.dead){e.remove(j.rig.group),c.splice(R,1);continue}if(j.state==="walk")J(j,L);else if(j.timer>0&&(j.timer-=L,j.timer<=0)){const Tt=j.then;j.then=null,j.state="idle",Tt&&Tt()}j.state==="idle"&&!j.path.length&&!j.then&&j.timer<=0&&D(j);const rt=j.anim,N=j.state==="walk"&&j.path.length>0;rt.moving=N,rt.speed=N?j.speed||ui.walk:0,rt.carry=j.role==="barrow"?0:j.carry,rt.push=j.role==="barrow"?1:0,rt.lay=j.state==="lay"&&!j.layHigh?1:0,rt.reach=j.state==="lay"&&j.layHigh?1:0,rt.idle=j.state==="wait"||j.state==="inspect"?1:0,rt.wave=j.state==="wave"?1:0,rt.tilt=j.roofSide?j.stance.tilt||.32:0,j.climbing&&N&&(rt.moving=!0,rt.reach=.6),j.rig.update(L,rt);const _t=j.role==="barrow"?0:j.carry;for(let Tt=0;Tt<j.armful.children.length;Tt++)j.armful.children[Tt].visible=Tt<_t;if(j.barrowLoad){const Tt=Math.round(j.carry/ps.barrow*j.barrowLoad.children.length);for(let mt=0;mt<j.barrowLoad.children.length;mt++)j.barrowLoad.children[mt].visible=mt<Tt;N&&(j.barrow.wheel.rotation.y-=(j.speed||0)*L*6.6)}j.rig.group.position.copy(j.pos),j.faceYaw!=null&&(j.yaw+=Fg(j.faceYaw-j.yaw)*Math.min(1,L*9)),j.rig.group.rotation.y=j.yaw}}function Pt(){const R=d-100;let j=0;for(let rt=w.length-1;rt>=0&&w[rt]>=R;rt--)j++;return j<4?w.length>1?w.length/Math.max(1,d)*60:0:j/Math.min(100,d)*60}function wt(){const L=i.items.length-m;if(L<=0)return 0;const R=Pt();return R<.4?null:L/R*60}return{update:Mt,preroll:ft,dispose(){for(const L of c)e.remove(L.rig.group);c.length=0},robots:c,get placed(){return m},get total(){return i.items.length},get shiftIndex(){return y},get crew(){return S},get finished(){return E},get celebrateT(){return P},get phaseKey(){return fi[_].key},get phaseLabel(){return fi[_].label},secondsToShiftChange:()=>Cs-d%Cs,phaseProgress:()=>fi.map((L,R)=>({key:L.key,label:L.label,total:A[R],done:R<_?A[R]:R===_?p:0})).filter(L=>L.total>0),isPlaced:L=>!!u[L],ratePerMin:Pt,etaSeconds:wt}}const ze="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",Ie="#e4f0f8",Be="rgba(214,234,247,0.55)",Fn="rgba(190,220,240,0.34)",_a="#0d3f60",Bg="#0a3350",Tr="#ffc861",xc=Array.from({length:260},(i,t)=>{const e=Math.sin(t*12.9898)*43758.5453,n=Math.sin(t*78.233)*12345.6789;return[e-Math.floor(e),n-Math.floor(n),(e*7%1+1)%1]});function Hg(){return 1.42}function vu(i){if(i==null||!isFinite(i)||i<0)return"--";const t=Math.round(i);return t<3600?`${Math.floor(t/60)}m ${String(t%60).padStart(2,"0")}s`:`${Math.floor(t/3600)}h ${String(Math.floor(t%3600/60)).padStart(2,"0")}m`}const kg=i=>{const t=Math.max(0,Math.round(i));return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`};function Se(i,t,e,n,r){i.beginPath(),i.moveTo(t,e),i.lineTo(n,r),i.stroke()}function Ks(i,t,e){i.save(),i.strokeStyle="rgba(200,228,245,0.28)",i.lineWidth=1,i.setLineDash([5,4]),i.strokeRect(t.x,t.y,t.w,t.h),i.setLineDash([]),i.fillStyle=Be,i.font=`600 ${Math.max(9,Math.min(14,t.w*.026))}px ${ze}`,i.textAlign="left",i.textBaseline="alphabetic",i.fillText(e,t.x+8,t.y+16),i.restore()}function sr(i,t,e,n,r,s,a=0){i.save(),i.strokeStyle=Be,i.fillStyle=Be,i.lineWidth=1;const o=n-t,l=r-e,c=Math.hypot(o,l)||1,u=-l/c,f=o/c,h=t+u*a,m=e+f*a,g=n+u*a,_=r+f*a;Se(i,h,m,g,_);for(const[d,y]of[[h,m],[g,_]])Se(i,d-u*4,y-f*4,d+u*4,y+f*4);i.save(),i.translate((h+g)/2,(m+_)/2),Math.abs(l)>Math.abs(o)&&i.rotate(-Math.PI/2),i.font=`10px ${ze}`,i.textAlign="center";const p=i.measureText(s).width+8;i.fillStyle=_a,i.fillRect(-p/2,-6,p,12),i.fillStyle=Be,i.fillText(s,0,3),i.restore(),i.restore()}let Mu=_a;function Ds(i,t,e,n,r,s,a,o,l){const c=n/s,u=h=>{const m=t+h*c+c/2;return l&&l.some(([g,_])=>m>g-c*.35&&m<_+c*.35)};i.strokeStyle=Ie,i.lineWidth=1;for(let h=0;h<Math.min(s,a);h++){if(u(h))continue;const m=t+h*c;i.fillStyle=o,i.fillRect(m,e,c,r),i.strokeRect(m+.5,e+.5,c-1,r-1)}if(a>=s)return;i.strokeStyle=Fn,i.lineWidth=.8,i.setLineDash([3,3]);let f=-1;for(let h=Math.max(0,a);h<=s;h++){const m=h<s&&!u(h);m&&f<0&&(f=h),!m&&f>=0&&(i.strokeRect(t+f*c+.5,e+.5,(h-f)*c-1,r-1),f=-1)}i.setLineDash([])}function Gg(i,t){const e=Math.max(12,i*.024),n={x:e,y:e,w:i-e*2,h:t-e*2},r=i/t<1.05,s=(l,c)=>({x:n.x,y:n.y+n.h*l,w:n.w,h:n.h*c});if(r)return{inner:n,portrait:r,elev:s(0,.26),gable:{x:n.x,y:n.y+n.h*.27,w:n.w*.48,h:n.h*.19},plan:{x:n.x+n.w*.52,y:n.y+n.h*.27,w:n.w*.48,h:n.h*.19},rear:null,prog:s(.47,.33),title:s(.81,.19)};const a=n.w*.28,o=n.w-a-12;return{inner:n,portrait:r,elev:{x:n.x,y:n.y+4,w:o*.62,h:n.h*.52},gable:{x:n.x+o*.64,y:n.y+4,w:o*.36,h:n.h*.52},plan:{x:n.x,y:n.y+n.h*.56,w:o*.52,h:n.h*.44},rear:{x:n.x+o*.55,y:n.y+n.h*.56,w:o*.45,h:n.h*.44},prog:{x:n.x+o+12,y:n.y+4,w:a,h:n.h*.58},title:{x:n.x+o+12,y:n.y+n.h*.62,w:a,h:n.h*.38}}}function Su(i,t){return i.openings.filter(e=>e.wall===t)}function vc(i,t,e,n,r){Ks(i,t,r);const s=e.house,a=s.ridgeY+.5,o=s.w+1.6,l=Math.min((t.w-30)/o,(t.h-58)/a),c=t.x+t.w/2,u=t.y+t.h-32,f=P=>c+P*l,h=P=>u-P*l;i.strokeStyle=Ie,i.lineWidth=1.6,Se(i,t.x+10,u,t.x+t.w-10,u),i.strokeStyle=Be,i.lineWidth=.8;for(let P=0;P<26;P++){const w=t.x+12+P*((t.w-24)/26);Se(i,w,u,w-5,u+6)}const m=Su(e,n),g=e.built[n]??0,_=12,p=s.courseH*l;for(let P=0;P<s.wallCourses;P++){const w=h((P+1)*s.courseH),A=P<Math.floor(g)?_:P===Math.floor(g)?Math.round(g%1*_):0,Z=m.filter(v=>P>=v.c0&&P<=v.c1).map(v=>[f(v.u0),f(v.u1)]);Ds(i,f(-s.w/2),w,s.w*l,p,_,A,"rgba(190,225,245,0.10)",Z)}for(const P of m){const w=f(P.u0),A=f(P.u1),Z=h((P.c1+1)*s.courseH),v=h(P.c0*s.courseH),T=g>P.c1+1;i.strokeStyle=T?Ie:Fn,i.lineWidth=T?1.4:.8,T||i.setLineDash([3,3]),i.strokeRect(w,Z,A-w,v-Z),i.strokeRect(w-4,Z-p,A-w+8,p),i.setLineDash([]),P.kind==="window"?(i.strokeStyle=T?Be:Fn,i.lineWidth=.8,Se(i,(w+A)/2,Z,(w+A)/2,v),Se(i,w,(Z+v)/2,A,(Z+v)/2)):(i.strokeStyle=T?Be:Fn,i.lineWidth=.8,Se(i,w+5,Z+6,w+5,v),Se(i,A-5,Z+6,A-5,v))}const d=h(s.eaveY),y=h(s.ridgeY),S=e.roofDone??0,E=e.tilesDone??0;if(i.strokeStyle=S>.2?Ie:Fn,i.lineWidth=S>.2?1.4:.8,S<=.2&&i.setLineDash([4,4]),i.beginPath(),i.moveTo(f(-s.w/2-.1),d),i.lineTo(f(s.w/2+.1),d),i.lineTo(f(s.w/2),y),i.lineTo(f(-s.w/2),y),i.closePath(),i.stroke(),i.setLineDash([]),E>.02){i.save(),i.beginPath(),i.rect(f(-s.w/2),y,s.w*l,d-y),i.clip(),i.strokeStyle="rgba(214,234,247,0.35)",i.lineWidth=.7;const P=7;for(let w=1;w<=Math.round(P*E);w++){const A=y+(d-y)*w/P;Se(i,f(-s.w/2),A,f(s.w/2),A)}for(let w=0;w<=10;w++){const A=f(-s.w/2+s.w*w/10);Se(i,A,d-(d-y)*E,A,d)}i.restore()}sr(i,f(-s.w/2),u,f(s.w/2),u,`${s.w.toFixed(2)} m`,18),sr(i,f(s.w/2),u,f(s.w/2),h(s.eaveY),`${s.eaveY.toFixed(2)}`,-20),sr(i,f(-s.w/2),h(s.eaveY),f(-s.w/2),h(s.ridgeY),`${(s.ridgeY-s.eaveY).toFixed(2)}`,20)}function Vg(i,t,e){Ks(i,t,"GABLE ELEVATION  (EAST)");const n=e.house,r=Math.min((t.w-34)/(n.d+2.2),(t.h-58)/(n.ridgeY+.6)),s=t.x+t.w/2+6,a=t.y+t.h-30,o=E=>s+E*r,l=E=>a-E*r;i.strokeStyle=Ie,i.lineWidth=1.6,Se(i,t.x+10,a,t.x+t.w-10,a);const c=e.built.E??0,u=10,f=n.courseH*r,h=Su(e,"E")[0];for(let E=0;E<n.wallCourses;E++){const P=l((E+1)*n.courseH),w=E<Math.floor(c)?u:E===Math.floor(c)?Math.round(c%1*u):0,A=h&&E>=h.c0&&E<=h.c1?[[o(h.u0),o(h.u1)]]:null;Ds(i,o(-n.d/2),P,n.d*r,f,u,w,"rgba(190,225,245,0.10)",A)}if(h){const E=c>h.c1+1;i.strokeStyle=E?Ie:Fn,i.lineWidth=E?1.3:.8,E||i.setLineDash([3,3]),i.strokeRect(o(h.u0),l((h.c1+1)*n.courseH),(h.u1-h.u0)*r,(h.c1+1-h.c0)*n.courseH*r),i.setLineDash([])}const m=e.built.gableE??0,g=(n.ridgeY-n.eaveY)/(n.d/2);for(let E=0;E<n.gableCourses;E++){const P=n.d/2-(E+.5)*n.courseH/g;if(P<.14)continue;const w=Math.max(1,Math.round(P*2/.42)),A=E<Math.floor(m)?w:E===Math.floor(m)?Math.round(m%1*w):0;Ds(i,o(-P),l(n.eaveY+(E+1)*n.courseH),P*2*r,f,w,A,"rgba(190,225,245,0.10)")}const _=e.roofDone??0;i.strokeStyle=_>.2?Ie:Fn,i.lineWidth=_>.2?1.5:.9,_<=.2&&i.setLineDash([4,4]),i.beginPath(),i.moveTo(o(-n.d/2-.3),l(n.eaveY-.18)),i.lineTo(o(0),l(n.ridgeY+.06)),i.lineTo(o(n.d/2+.3),l(n.eaveY-.18)),i.stroke(),i.setLineDash([]);const p=e.chimney,d=e.built.chim??0,y=o(p.z),S=p.runLen*r;for(let E=0;E<p.courses;E++){const P=E<Math.floor(d)?2:E===Math.floor(d)?Math.round(d%1*2):0;Ds(i,y-S/2,l((E+1)*n.courseH),S,f,2,P,"rgba(190,225,245,0.10)")}i.strokeStyle=d>=p.courses?Ie:Fn,i.lineWidth=1,i.strokeRect(y-S/2-5,l((p.courses+2)*n.courseH),S+10,f*2),sr(i,o(-n.d/2),a,o(n.d/2),a,`${n.d.toFixed(2)} m`,16),i.fillStyle=Be,i.font=`9px ${ze}`,i.textAlign="center",i.fillText(`PITCH ${(Math.atan(g)*180/Math.PI).toFixed(0)}°`,o(n.d/4),l(n.eaveY+.55))}function Wg(i,t,e){Ks(i,t,"GROUND FLOOR PLAN  1:50");const n=e.house,r=Math.min((t.w-90)/(n.w+2.4),(t.h-60)/(n.d+2.4)),s=t.x+t.w/2-10,a=t.y+t.h/2+8,o=p=>s+p*r,l=p=>a+p*r,c=n.t*r,u=o(-n.w/2),f=l(-n.d/2);i.save(),i.beginPath(),i.rect(u,f,n.w*r,n.d*r),i.rect(u+c,f+c,(n.w-2*n.t)*r,(n.d-2*n.t)*r),i.fillStyle="rgba(210,235,250,0.5)",i.fill("evenodd"),i.restore(),i.strokeStyle=Ie,i.lineWidth=1.4,i.strokeRect(u,f,n.w*r,n.d*r),i.strokeRect(u+c,f+c,(n.w-2*n.t)*r,(n.d-2*n.t)*r),i.fillStyle=Mu;for(const p of e.openings)p.wall==="S"?i.fillRect(o(p.u0),l(n.d/2-n.t)-1,(p.u1-p.u0)*r,c+2):p.wall==="N"?i.fillRect(o(p.u0),l(-n.d/2)-1,(p.u1-p.u0)*r,c+2):p.wall==="E"?i.fillRect(o(n.w/2-n.t)-1,l(p.u0),c+2,(p.u1-p.u0)*r):i.fillRect(o(-n.w/2)-1,l(p.u0),c+2,(p.u1-p.u0)*r);i.strokeStyle=Be,i.lineWidth=1;for(const p of e.openings){const d=p.wall==="S"||p.wall==="N",y=p.wall==="S"?l(n.d/2):l(-n.d/2),S=p.wall==="E"?o(n.w/2):o(-n.w/2),E=p.wall==="S"||p.wall==="E"?-c:c;if(d?(Se(i,o(p.u0),y,o(p.u0),y+E),Se(i,o(p.u1),y,o(p.u1),y+E)):(Se(i,S,l(p.u0),S+E,l(p.u0)),Se(i,S,l(p.u1),S+E,l(p.u1))),p.kind==="door"){const P=(p.u1-p.u0)*r,w=o(p.u0),A=l(n.d/2-n.t);i.beginPath(),i.moveTo(w,A),i.lineTo(w,A-P),i.stroke(),i.beginPath(),i.arc(w,A,P,-Math.PI/2,0),i.stroke()}}const h=e.chimney,m=(h.depth??.2)*r;i.strokeStyle=Ie,i.lineWidth=1.2,i.strokeRect(o(h.x)-m/2,l(h.z-h.runLen/2),m,h.runLen*r),i.beginPath(),i.moveTo(o(h.x)-m/2,l(h.z-h.runLen/2)),i.lineTo(o(h.x)+m/2,l(h.z+h.runLen/2)),i.moveTo(o(h.x)+m/2,l(h.z-h.runLen/2)),i.lineTo(o(h.x)-m/2,l(h.z+h.runLen/2)),i.stroke(),i.strokeStyle=Fn,i.setLineDash([6,4]),i.lineWidth=1,Se(i,o(.6),l(-n.d/2+n.t),o(.6),l(n.d/2-n.t)),Se(i,o(.6),l(-.4),o(n.w/2-n.t),l(-.4)),i.setLineDash([]),t.w>260&&t.h>200&&(i.fillStyle=Be,i.font=`10px ${ze}`,i.textAlign="center",i.fillText("LIVING",o(-1.1),l(.2)),i.fillText("KITCHEN",o(1.6),l(.9)),i.fillText("STORE",o(1.6),l(-1.3))),sr(i,o(-n.w/2),l(n.d/2),o(n.w/2),l(n.d/2),`${n.w.toFixed(2)} m`,30),sr(i,o(n.w/2),l(-n.d/2),o(n.w/2),l(n.d/2),`${n.d.toFixed(2)} m`,-30);const g=t.x+t.w-34,_=t.y+46;i.strokeStyle=Ie,i.fillStyle=Ie,i.lineWidth=1.2,i.beginPath(),i.moveTo(g,_-16),i.lineTo(g+6,_+10),i.lineTo(g,_+4),i.lineTo(g-6,_+10),i.closePath(),i.fill(),i.font=`bold 11px ${ze}`,i.textAlign="center",i.fillText("N",g,_-20)}function Xg(i,t,e){Ks(i,t,"PROGRESS  /  SITE RECORD");const n=10,r=t.w-n*2,s=t.x+n,a=t.y+t.h-6,o=t.h<250,l=o?46:62,c=o?14:22;let u=t.y+(o?26:34);i.fillStyle="rgba(255,200,97,0.1)",i.fillRect(s,u,r,l),i.strokeStyle=Tr,i.lineWidth=1.6,i.strokeRect(s,u,r,l),i.fillStyle=Tr,i.font=`${o?8:10}px ${ze}`,i.textAlign="left",i.fillText("EST. TIME TO COMPLETION",s+8,u+(o?14:18)),i.font=`bold ${Math.min(o?24:34,r*.17)}px ${ze}`,i.fillText(vu(e.etaSeconds),s+8,u+l-12),i.font=`${o?8:10}px ${ze}`,i.textAlign="right",i.fillText(`${(e.ratePerMin||0).toFixed(1)}/min`,s+r-8,u+l-12),u+=l+(o?18:24);const f=e.total?e.placed/e.total:0;i.fillStyle=Ie,i.font=`bold ${o?11:13}px ${ze}`,i.textAlign="left",i.fillText(`${(f*100).toFixed(1)}% COMPLETE`,s,u),i.textAlign="right",i.fillStyle=Be,i.font=`${o?9:11}px ${ze}`,i.fillText(`${e.placed} / ${e.total}`,s+r,u),u+=7,i.fillStyle="rgba(255,255,255,0.12)",i.fillRect(s,u,r,8),i.fillStyle=Tr,i.fillRect(s,u,r*f,8),i.strokeStyle=Be,i.lineWidth=1,i.strokeRect(s+.5,u+.5,r-1,7),u+=o?20:26;const h=o?34:52;for(const m of e.phases){if(u+c>a-h)break;const g=m.total?m.done/m.total:0;i.fillStyle=g>=1?Tr:Be,i.font=`${o?8:10}px ${ze}`,i.textAlign="left",i.fillText(m.label,s,u),i.textAlign="right",i.fillText(`${m.done}/${m.total}`,s+r,u),u+=4,i.fillStyle="rgba(255,255,255,0.1)",i.fillRect(s,u,r,4),i.fillStyle=g>=1?"rgba(255,200,97,0.85)":"rgba(214,234,247,0.6)",i.fillRect(s,u,r*g,4),u+=c-4}u=a-h+(o?8:16),i.strokeStyle=Be,i.setLineDash([3,3]),Se(i,s,u-12,s+r,u-12),i.setLineDash([]),i.fillStyle=Ie,i.font=`${o?9:11}px ${ze}`,i.textAlign="left",i.fillText(`SHIFT ${e.shift.index}  ·  ${e.shift.crewName.toUpperCase()}`,s,u),i.fillStyle=Be,i.font=`${o?8:10}px ${ze}`,i.fillText(`NEXT SHIFT CHANGE IN ${kg(e.shift.secondsLeft)}`,s,u+(o?13:16))}function Yg(i,t,e){i.strokeStyle=Ie,i.lineWidth=1.4,i.strokeRect(t.x,t.y,t.w,t.h);const n=[["PROJECT",e.title],["CLIENT","BRICK CREW CONSTRUCTION CO."],["DRAWING",`BC-${String(100+e.day)}-A / GA ELEVATIONS + PLAN`],["SCALE","1:50 @ A2      REV. C"],["DAY",`${e.day}`],["STATUS",e.placed>=e.total?"TOPPED OUT":"ISSUED FOR CONSTRUCTION"]],r=t.h/n.length,s=r>=26;n.forEach((a,o)=>{const l=t.y+r*o;o&&(i.strokeStyle="rgba(200,228,245,0.3)",i.lineWidth=.8,Se(i,t.x,l,t.x+t.w,l));const c=l+r-Math.max(4,r*.28);i.fillStyle=Be,i.font=`${Math.max(7,Math.min(9,r*.45))}px ${ze}`,i.textAlign="left",i.fillText(a[0],t.x+6,s?l+14:c);const u=s?0:i.measureText(a[0]).width+10;i.fillStyle=Ie,i.font=`${Math.max(8,Math.min(12,t.w*.05))}px ${ze}`;const f=t.w-14-u;let h=a[1];const m=h;for(;i.measureText(h).width>f&&h.length>4;)h=h.slice(0,-2);i.textAlign=s?"left":"right",i.fillText(h===m?h:`${h}…`,s?t.x+6:t.x+t.w-6,c)})}function qg(i,t,e,n){const r=i;r.save(),r.clearRect(0,0,t,e);const s=r.createLinearGradient(0,0,t*.4,e);s.addColorStop(0,_a),s.addColorStop(1,Bg),Mu=s,r.fillStyle=s,r.fillRect(0,0,t,e);for(let c=0;c<xc.length;c++){const[u,f,h]=xc[c];r.fillStyle=h>.5?"rgba(255,255,255,0.035)":"rgba(0,0,0,0.05)",r.fillRect(u*t,f*e,1+h*2,1+h*2)}r.strokeStyle="rgba(255,255,255,0.05)",r.lineWidth=1;const a=Math.max(24,t/34);for(let c=a;c<t;c+=a)Se(r,c,0,c,e);for(let c=a;c<e;c+=a)Se(r,0,c,t,c);const o=Gg(t,e);r.globalAlpha=.25+.75*Math.min(1,(n.revealed??1)*1.35),r.strokeStyle=Ie,r.lineWidth=2,r.strokeRect(o.inner.x-6,o.inner.y-6,o.inner.w+12,o.inner.h+12),r.lineWidth=1,r.strokeRect(o.inner.x-2,o.inner.y-2,o.inner.w+4,o.inner.h+4),r.textBaseline="alphabetic",vc(r,o.elev,n,"S","FRONT ELEVATION  (SOUTH)  1:50"),Vg(r,o.gable,n),Wg(r,o.plan,n),o.rear&&vc(r,o.rear,n,"N","REAR ELEVATION  (NORTH)"),Xg(r,o.prog,n),Yg(r,o.title,n);const l=n.phases.find(c=>c.done<c.total);if(l){const c=l.key==="walls"?o.elev:o.gable;r.strokeStyle="rgba(255,200,97,0.55)",r.lineWidth=1.4;const u=c.x+c.w-52,f=c.y+34;r.beginPath();for(let h=0;h<=16;h++){const m=h/16*Math.PI*2,g=22+(h%2?5:0);r.arc(u+Math.cos(m)*26,f+Math.sin(m)*13,g*.3,0,Math.PI*2)}r.stroke(),r.fillStyle=Tr,r.font=`bold 10px ${ze}`,r.textAlign="center",r.fillText(l.label,u,f+3)}r.globalAlpha=1;for(const[c,u,f]of[[o.inner.x-10,o.inner.y-10,-.7],[t-o.inner.x+10,o.inner.y-10,.7]])r.save(),r.translate(c,u),r.rotate(f),r.fillStyle="rgba(240,240,225,0.2)",r.fillRect(-34,-11,68,22),r.restore();r.restore()}const ue=i=>document.getElementById(i),Es=matchMedia("(prefers-reduced-motion: reduce)").matches,$g=i=>{const t=Math.max(0,Math.round(i));return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`};function jg(i){return i>=1?1:1-Math.pow(1-i,2.6)+Math.sin(i*Math.PI)*.035}function Zg({onSheetOpen:i,onSheetClose:t}={}){const e=ue("loading"),n=ue("load-fill"),r=ue("load-sub"),s={shiftNo:ue("shift-no"),crewName:ue("crew-name"),chipShift:ue("chip-shift"),shiftLeft:ue("shift-left"),phase:ue("chip-phase"),eta:ue("eta"),day:ue("chip-day"),onSite:ue("on-site"),fill:ue("progress-fill"),count:ue("progress-count"),rate:ue("progress-rate"),hint:ue("hint"),banner:ue("banner"),bannerText:ue("banner-text"),bannerSub:ue("banner-sub"),backdrop:ue("sheet-backdrop"),stage:ue("sheet-stage"),wrap:ue("sheet-wrap"),clip:ue("sheet-clip"),roll:ue("sheet-roll"),close:ue("sheet-close")},a=ue("sheet-canvas");let o=0,l=0;function c(){const O=Hg(),H=Math.min(84,innerWidth*.09),Q=Math.min(96,innerHeight*.12);let U=innerWidth-H,z=U/O;z>innerHeight-Q&&(z=innerHeight-Q,U=z*O),innerWidth/innerHeight<.9&&(U=innerWidth-Math.min(24,innerWidth*.06),z=Math.min(innerHeight-110,U*1.62)),o=Math.max(240,Math.round(U)),l=Math.max(200,Math.round(z));const W=Math.min(devicePixelRatio||1,2);a.width=Math.round(o*W),a.height=Math.round(l*W),a.style.width=`${o}px`,a.style.height=`${l}px`,a.getContext("2d").setTransform(W,0,0,W,0,0),s.wrap.style.width=`${o}px`}c(),addEventListener("resize",c);let u="closed",f=0,h=0;const m=Es?.25:1.1,g=Es?.05:.28,_=Es?.2:.7;function p(O,H){const Q=Math.max(0,Math.round(l*O));s.clip.style.height=`${Q}px`,s.roll.style.transform=`translateY(${Q}px) rotate(${H*.55}deg)`,s.wrap.style.transform=`rotate(${H}deg)`,s.roll.style.opacity=O>.995?"0":"1"}function d(){u==="open"||u==="unrolling"||u==="dropping"||(c(),u="dropping",f=0,s.stage.classList.add("on"),s.backdrop.classList.add("on"),s.wrap.style.transform="none",p(0,0),s.roll.style.transform="translateY(-60px)",i==null||i())}function y(){u==="closed"||u==="rolling"||(u="rolling",f=0,s.stage.classList.remove("open"),s.backdrop.classList.remove("on"),t==null||t())}function S(O){if(u!=="closed"){if(f+=O,u==="dropping"){const H=Math.min(1,f/g);s.roll.style.opacity="1",s.roll.style.transform=`translateY(${(-60*(1-H)**2).toFixed(1)}px)`,H>=1&&(u="unrolling",f=0),h=0;return}if(u==="unrolling"){const H=Math.min(1,f/m);h=Math.min(1,jg(H));const Q=Es?0:Math.sin(H*9)*(1-H)*1.5;p(h,Q),H>=1&&(u="open",h=1,p(1,0),s.stage.classList.add("open"));return}if(u==="open"){h=1;return}if(u==="rolling"){const H=Math.min(1,f/_);h=Math.max(0,1-H*H),p(h,0),H>=1&&(u="closed",h=0,s.stage.classList.remove("on"))}}}s.close.addEventListener("click",O=>{O.stopPropagation(),y()}),s.backdrop.addEventListener("click",y),addEventListener("keydown",O=>{O.key==="Escape"&&y()});let E=0;function P(O,H,Q){s.bannerText.textContent=O,s.bannerSub.textContent=H||"",s.banner.classList.add("on"),Q&&(s.banner.querySelector(".banner-inner").style.borderColor=Q),s.banner.classList.remove("klaxon"),/shift/i.test(O)&&(s.banner.offsetWidth,s.banner.classList.add("klaxon"),s.chipShift.classList.remove("flash"),s.chipShift.offsetWidth,s.chipShift.classList.add("flash")),clearTimeout(E),E=setTimeout(()=>{s.banner.classList.remove("on","klaxon")},4e3)}let w="";function A(O){s.shiftNo.textContent=`SHIFT ${O.shiftIndex}`,s.crewName.textContent=O.crewName,s.chipShift.style.borderLeftColor=O.crewAccent,s.shiftLeft.textContent=$g(O.secondsToShiftChange),s.phase.textContent=O.phaseLabel,s.eta.textContent=vu(O.etaSeconds),s.day.textContent=`DAY ${O.day}`,s.onSite.textContent=String(O.onSite);const H=`${O.placed}/${O.total}`;H!==w&&(w=H,s.count.textContent=`${O.placed} / ${O.total} SET`,s.fill.style.width=`${O.total?O.placed/O.total*100:0}%`),s.rate.textContent=`${(O.ratePerMin||0).toFixed(1)} /min`}function Z(O,H){H&&(r.textContent=H),n.style.width=`${Math.min(1,Math.max(0,O))*100}%`,O>=1&&e.classList.add("done")}let v=!0;function T(O){O!==v&&(v=O,s.hint.classList.toggle("gone",!O))}return s.hint.addEventListener("click",()=>{d(),T(!1)}),{setLoading:Z,setHud:A,openSheet:d,closeSheet:y,toggleSheet:()=>u==="closed"||u==="rolling"?d():y(),isSheetOpen:()=>u!=="closed",sheetCanvas:a,sheetSize:()=>({w:o,h:l}),sheetReveal:()=>h,banner:P,tick:S,setHint:T}}const Kg=new URLSearchParams(location.search),Jg=(parseInt(Kg.get("seed"),10)||20250801)>>>0;function Qg(i){let t=i>>>0;return function(){t=t+1831565813>>>0;let n=t;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}const bi=document.getElementById("scene"),Hn=new au({canvas:bi,antialias:!0});Hn.setPixelRatio(Math.min(devicePixelRatio,2));Hn.shadowMap.enabled=!0;Hn.shadowMap.type=Cc;Hn.toneMapping=Pc;Hn.toneMappingExposure=1.02;Hn.outputColorSpace=de;const wn=new k0;wn.fog=new da(12178662,58,210);const Ti=new rn(42,1,.1,400);Ti.position.set(13.6,5.9,12.5);const cn=new K0(Ti,bi);cn.target.set(.3,1.7,1.5);cn.enableDamping=!0;cn.dampingFactor=.07;cn.maxPolarAngle=Math.PI*.487;cn.minDistance=5;cn.maxDistance=42;cn.autoRotate=!0;cn.autoRotateSpeed=.28;function yu(){Hn.setSize(innerWidth,innerHeight,!1),Ti.aspect=innerWidth/innerHeight,Ti.updateProjectionMatrix()}addEventListener("resize",yu);yu();const Ke=Qg(Jg),Pe=Zg({onSheetOpen:()=>cn.autoRotate=!1,onSheetClose:()=>{}});Pe.setLoading(.06,"pegging out…");const t_=cg();wn.add(t_.mesh);const e_=ug();wn.add(e_.group);const wi=gg(Ke);wn.add(wi.group);Pe.setLoading(.3,"putting up the hoarding…");const un=new ie;wn.add(un);const Mc=dt.pallets.map(i=>{const t=Mg(Ke);return t.group.position.set(i.x,0,i.z),t.group.rotation.y=(Ke()-.5)*.3,t.pos=i,un.add(t.group),t}),Ys=Sg(Ke);Ys.group.position.set(dt.stack.x,0,dt.stack.z);un.add(Ys.group);const Js=Eg();Js.group.position.set(dt.mixer.x,0,dt.mixer.z);Js.group.rotation.y=-.5;un.add(Js.group);const ia=bg();un.add(ia.group);const Eu=Ag(Ke);Eu.position.set(dt.timber.x,0,dt.timber.z);un.add(Eu);const xa=Rg(Ke);xa.position.set(dt.dumpster.x,0,dt.dumpster.z);xa.rotation.y=.4;un.add(xa);const bu=Cg(Ke);bu.position.set(dt.privy.x,0,dt.privy.z);un.add(bu);const Tu=Lg(Ke);Tu.position.set(-7.4,0,-4.4);un.add(Tu);for(const[i,t,e]of[[-3.2,-4.8,0],[4.9,-3.6,0],[-6.2,1.4,0]]){const n=wg(Ke);n.position.set(i,0,t),n.rotation.y+=e,un.add(n)}for(let i=0;i<9;i++){const t=Tg(Ke),e=i/9*Math.PI*2;t.position.set(Math.cos(e)*(5.6+Ke()*2.4),0,4.4+Math.sin(e)*2.2),un.add(t)}const va=Pg(`BRICK CREW
HARD HATS ON SITE`);va.position.set(dt.gate.x+3.4,0,dt.gate.z-.4);va.rotation.y=-.35;un.add(va);Pe.setLoading(.52,"unloading the pallets…");const n_={masonry:{roughness:.94,metalness:0},timber:{roughness:.88,metalness:0},tile:{roughness:.66,metalness:.05}};let sn=null,se=null,ra=null,qs=null,or=1;const nr=new ce,Us=new En,Sc=new hr,bs=new F,Ts=new F,yc=new F(0,0,0),Is=new ie;wn.add(Is);function Ec(i,t){const e=new Gs(new Tn(1,1,1),new Ft(t),Math.max(1,i));e.castShadow=!0,e.receiveShadow=!0,e.frustumCulled=!1;for(let n=0;n<e.count;n++)nr.compose(yc,Us.identity(),yc),e.setMatrixAt(n,nr);return e.instanceMatrix.needsUpdate=!0,e.instanceMatrix.setUsage(Ph),e}function i_(i,t){if(t){const n=sn.mortar.indexOf(i);bs.set(i.pos[0],i.pos[1],i.pos[2]),Ts.set(i.size[0],i.size[1],i.size[2]),nr.compose(bs,Us.identity(),Ts),qs.setMatrixAt(n,nr),qs.instanceMatrix.needsUpdate=!0;return}const e=ra[i.family];Sc.set(i.euler[0],i.euler[1],0,"YXZ"),Us.setFromEuler(Sc),bs.set(i.pos[0],i.pos[1],i.pos[2]),Ts.set(i.size[0],i.size[1],i.size[2]),nr.compose(bs,Us,Ts),e.setMatrixAt(i.slot,nr),e.instanceMatrix.needsUpdate=!0}function r_(i,t,e){const n=new Kt;for(const r of t)r.family===e&&i.setColorAt(r.slot,n.setHex(r.color));i.instanceColor&&(i.instanceColor.needsUpdate=!0)}const _n=new ie;_n.visible=!1;{const i=new pe(new ii(.02,.02,1,8),new Ft({color:9397560,roughness:.9}));i.position.y=.5,_n.add(i);for(let e=0;e<3;e++){const n=new pe(new Fr(.24-e*.06,.3,7),new Ft({color:4160846,roughness:.95}));n.position.y=.66+e*.16,_n.add(n)}const t=new pe(new ei(.42,.24),new Ft({color:15774761,roughness:.9,side:on}));t.position.set(.21,.9,0),_n.add(t),_n.position.set(0,hu+.2,0),_n.traverse(e=>e.castShadow=!0),wn.add(_n)}function wu(i,t){or=i,se==null||se.dispose(),Is.clear(),sn=ag(Ke,or),ra={};for(const[e,n]of Object.entries(n_)){const r=Ec(sn.familyCount[e],n);ra[e]=r,Is.add(r),r_(r,sn.items,e)}qs=Ec(sn.mortar.length,{color:we.mortar,roughness:.98,metalness:0}),Is.add(qs),_n.visible=!1,ia.setDecks(0),Ys.setCount(26),Mc.forEach(e=>e.setCount(e.capacity)),se=zg({plan:sn,rng:Ke,scene:wn,stack:Ys,pallets:Mc,scaffold:ia,onPlace:i_,onBanner:(e,n,r)=>Pe.banner(e,n,r),onComplete:()=>{_n.visible=!0,Pe.banner("TOPPED OUT",`${sn.title} — day ${or} complete`,"#8fd14f")}}),t&&se.preroll(ig)}Pe.setLoading(.72,"reading the drawings…");wu(1,!0);Pe.setLoading(.9,"signing the crew on…");const bc=new j0,Tc=new Nt;let sa=!1,wr=null,Au=!1;function Ru(i,t){return Tc.set(i/innerWidth*2-1,-(t/innerHeight)*2+1),bc.setFromCamera(Tc,Ti),bc.intersectObjects(wi.trailerTargets,!1).length>0}bi.addEventListener("pointermove",i=>{if(Pe.isSheetOpen())return;const t=Ru(i.clientX,i.clientY);t!==sa&&(sa=t,wi.setTrailerHighlight(t),wi.trailerLabel.visible=t,bi.style.cursor=t?"pointer":"")});bi.addEventListener("pointerdown",i=>{cn.autoRotate=!1,wr=[i.clientX,i.clientY]});bi.addEventListener("pointerup",i=>{if(!wr)return;const t=Math.hypot(i.clientX-wr[0],i.clientY-wr[1]);wr=null,!(t>6)&&Ru(i.clientX,i.clientY)&&(Pe.toggleSheet(),Au=!0,Pe.setHint(!1))});bi.addEventListener("pointerleave",()=>{sa=!1,wi.setTrailerHighlight(!1),wi.trailerLabel.visible=!1});const s_=Pe.sheetCanvas.getContext("2d");function o_(){const i=new Map;for(let e=0;e<sn.items.length;e++){const n=sn.items[e];if(n.course==null||!n.group)continue;const r=n.group;let s=i.get(r);s||i.set(r,s=[]);const a=n.course;s[a]||(s[a]=[0,0]),s[a][1]++,se.isPlaced(e)&&s[a][0]++}const t={};for(const[e,n]of i){let r=0;for(let s=0;s<n.length;s++){const a=n[s];if(a)if(a[0]>=a[1])r=s+1;else{r=s+a[0]/a[1];break}}t[e]=r}return t}function a_(){const i=se.phaseProgress(),t=i.find(n=>n.key==="roof"),e=i.find(n=>n.key==="tiles");return{title:sn.title,house:{w:Jt.w,d:Jt.d,t:Jt.t,wallCourses:Jt.wallCourses,gableCourses:Jt.gableCourses,eaveY:Ur,ridgeY:hu,courseH:Te},openings:sn.openings,chimney:_e,phases:i,built:o_(),roofDone:t?t.done/Math.max(1,t.total):0,tilesDone:e?e.done/Math.max(1,e.total):0,placed:se.placed,total:se.total,etaSeconds:se.etaSeconds(),ratePerMin:se.ratePerMin(),shift:{index:se.shiftIndex,crewName:se.crew.name,secondsLeft:se.secondsToShiftChange(),lengthSeconds:Cs},revealed:Pe.sheetReveal(),day:or}}const wc=new $0;let Go=0,Ac=0;const Vo=1/30;let ws=0;Pe.setLoading(1,"on site");Hn.setAnimationLoop(()=>{const i=Math.min(wc.getDelta(),.25),t=wc.elapsedTime;ws+=i;let e=0;for(;ws>=Vo&&e<8;)se.update(Vo),ws-=Vo,e++;if(e===8&&(ws=0),wi.update(t,i),Js.update(i),Pe.tick(i),se.finished&&se.celebrateT>16&&wu(or+1),_n.visible&&(_n.rotation.y=Math.sin(t*.8)*.25),Go-=i,Go<=0&&(Go=.25,Pe.setHud({shiftIndex:se.shiftIndex,crewName:se.crew.name,crewAccent:`#${se.crew.accent.toString(16).padStart(6,"0")}`,secondsToShiftChange:se.secondsToShiftChange(),placed:se.placed,total:se.total,phaseLabel:se.finished?"COMPLETE":se.phaseLabel,etaSeconds:se.etaSeconds(),ratePerMin:se.ratePerMin(),onSite:se.robots.length,day:or})),Au||(Ac+=i,Pe.setHint(Ac>4)),Pe.isSheetOpen()){const{w:n,h:r}=Pe.sheetSize();qg(s_,n,r,a_())}cn.update(),Hn.render(wn,Ti)});window.brickCrew={get sim(){return se},get plan(){return sn},scene:wn,camera:Ti,controls:cn};
