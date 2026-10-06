(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Na="160",Zn={ROTATE:0,DOLLY:1,PAN:2},Ki={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},sf=0,Tc=1,rf=2,Lh=1,Dh=2,Jn=3,xi=0,rn=1,dn=2,mi=0,Es=1,Ac=2,Rc=3,Cc=4,of=5,Li=100,af=101,cf=102,Pc=103,Lc=104,lf=200,hf=201,uf=202,ff=203,Ma=204,ya=205,df=206,pf=207,mf=208,gf=209,_f=210,vf=211,xf=212,Mf=213,yf=214,Sf=0,bf=1,Ef=2,Jr=3,wf=4,Tf=5,Af=6,Rf=7,za=0,Cf=1,Pf=2,gi=0,Lf=1,Df=2,If=3,Ih=4,Uf=5,Nf=6,Uh=300,Cs=301,Ps=302,Sa=303,ba=304,ho=306,Zr=1e3,An=1001,Ea=1002,Ve=1003,Dc=1004,Po=1005,sn=1006,zf=1007,rr=1008,_i=1009,Of=1010,Ff=1011,Oa=1012,Nh=1013,di=1014,pi=1015,or=1016,zh=1017,Oh=1018,Ii=1020,Bf=1021,xn=1023,kf=1024,Hf=1025,Ui=1026,Ls=1027,Gf=1028,Fh=1029,Vf=1030,Bh=1031,kh=1033,Lo=33776,Do=33777,Io=33778,Uo=33779,Ic=35840,Uc=35841,Nc=35842,zc=35843,Hh=36196,Oc=37492,Fc=37496,Bc=37808,kc=37809,Hc=37810,Gc=37811,Vc=37812,Wc=37813,Xc=37814,$c=37815,qc=37816,Yc=37817,jc=37818,Kc=37819,Jc=37820,Zc=37821,No=36492,Qc=36494,tl=36495,Wf=36283,el=36284,nl=36285,il=36286,Gh=3e3,Ni=3001,Xf=3200,$f=3201,Fa=0,qf=1,Mn="",Ce="srgb",ri="srgb-linear",Ba="display-p3",uo="display-p3-linear",Qr="linear",pe="srgb",to="rec709",eo="p3",Ji=7680,sl=519,Yf=512,jf=513,Kf=514,Vh=515,Jf=516,Zf=517,Qf=518,td=519,rl=35044,ed=35048,ol="300 es",wa=1035,ei=2e3,no=2001;class Gi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],qr=Math.PI/180,Ta=180/Math.PI;function lr(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Xe[i&255]+Xe[i>>8&255]+Xe[i>>16&255]+Xe[i>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]).toLowerCase()}function Oe(i,t,e){return Math.max(t,Math.min(e,i))}function nd(i,t){return(i%t+t)%t}function zo(i,t,e){return(1-e)*i+e*t}function al(i){return(i&i-1)===0&&i!==0}function Aa(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Vs(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function nn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const id={DEG2RAD:qr};class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Oe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jt{constructor(t,e,n,s,r,o,a,c,h){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,h)}set(t,e,n,s,r,o,a,c,h){const l=this.elements;return l[0]=t,l[1]=s,l[2]=a,l[3]=e,l[4]=r,l[5]=c,l[6]=n,l[7]=o,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],h=n[1],l=n[4],u=n[7],f=n[2],p=n[5],_=n[8],g=s[0],m=s[3],d=s[6],v=s[1],x=s[4],M=s[7],C=s[2],w=s[5],A=s[8];return r[0]=o*g+a*v+c*C,r[3]=o*m+a*x+c*w,r[6]=o*d+a*M+c*A,r[1]=h*g+l*v+u*C,r[4]=h*m+l*x+u*w,r[7]=h*d+l*M+u*A,r[2]=f*g+p*v+_*C,r[5]=f*m+p*x+_*w,r[8]=f*d+p*M+_*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],h=t[7],l=t[8];return e*o*l-e*a*h-n*r*l+n*a*c+s*r*h-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],h=t[7],l=t[8],u=l*o-a*h,f=a*c-l*r,p=h*r-o*c,_=e*u+n*f+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return t[0]=u*g,t[1]=(s*h-l*n)*g,t[2]=(a*n-s*o)*g,t[3]=f*g,t[4]=(l*e-s*c)*g,t[5]=(s*r-a*e)*g,t[6]=p*g,t[7]=(n*c-h*e)*g,t[8]=(o*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*o+h*a)+o+t,-s*h,s*c,-s*(-h*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Oo.makeScale(t,e)),this}rotate(t){return this.premultiply(Oo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Oo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Oo=new Jt;function Wh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function io(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function sd(){const i=io("canvas");return i.style.display="block",i}const cl={};function tr(i){i in cl||(cl[i]=!0,console.warn(i))}const ll=new Jt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),hl=new Jt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Mr={[ri]:{transfer:Qr,primaries:to,toReference:i=>i,fromReference:i=>i},[Ce]:{transfer:pe,primaries:to,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[uo]:{transfer:Qr,primaries:eo,toReference:i=>i.applyMatrix3(hl),fromReference:i=>i.applyMatrix3(ll)},[Ba]:{transfer:pe,primaries:eo,toReference:i=>i.convertSRGBToLinear().applyMatrix3(hl),fromReference:i=>i.applyMatrix3(ll).convertLinearToSRGB()}},rd=new Set([ri,uo]),he={enabled:!0,_workingColorSpace:ri,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!rd.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Mr[t].toReference,s=Mr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Mr[i].primaries},getTransfer:function(i){return i===Mn?Qr:Mr[i].transfer}};function ws(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fo(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Zi;class Xh{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Zi===void 0&&(Zi=io("canvas")),Zi.width=t.width,Zi.height=t.height;const n=Zi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Zi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=io("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ws(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ws(e[n]/255)*255):e[n]=ws(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let od=0;class $h{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:od++}),this.uuid=lr(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Bo(s[o].image)):r.push(Bo(s[o]))}else r=Bo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Bo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Xh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ad=0;class en extends Gi{constructor(t=en.DEFAULT_IMAGE,e=en.DEFAULT_MAPPING,n=An,s=An,r=sn,o=rr,a=xn,c=_i,h=en.DEFAULT_ANISOTROPY,l=Mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ad++}),this.uuid=lr(),this.name="",this.source=new $h(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=h,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof l=="string"?this.colorSpace=l:(tr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=l===Ni?Ce:Mn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Uh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Zr:t.x=t.x-Math.floor(t.x);break;case An:t.x=t.x<0?0:1;break;case Ea:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Zr:t.y=t.y-Math.floor(t.y);break;case An:t.y=t.y<0?0:1;break;case Ea:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return tr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ce?Ni:Gh}set encoding(t){tr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Ni?Ce:Mn}}en.DEFAULT_IMAGE=null;en.DEFAULT_MAPPING=Uh;en.DEFAULT_ANISOTROPY=1;class ge{constructor(t=0,e=0,n=0,s=1){ge.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,h=c[0],l=c[4],u=c[8],f=c[1],p=c[5],_=c[9],g=c[2],m=c[6],d=c[10];if(Math.abs(l-f)<.01&&Math.abs(u-g)<.01&&Math.abs(_-m)<.01){if(Math.abs(l+f)<.1&&Math.abs(u+g)<.1&&Math.abs(_+m)<.1&&Math.abs(h+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(h+1)/2,M=(p+1)/2,C=(d+1)/2,w=(l+f)/4,A=(u+g)/4,U=(_+m)/4;return x>M&&x>C?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=w/n,r=A/n):M>C?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=w/s,r=U/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=A/r,s=U/r),this.set(n,s,r,e),this}let v=Math.sqrt((m-_)*(m-_)+(u-g)*(u-g)+(f-l)*(f-l));return Math.abs(v)<.001&&(v=1),this.x=(m-_)/v,this.y=(u-g)/v,this.z=(f-l)/v,this.w=Math.acos((h+p+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class cd extends Gi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ge(0,0,t,e),this.scissorTest=!1,this.viewport=new ge(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(tr("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Ni?Ce:Mn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new en(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new $h(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fi extends cd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class qh extends en{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ld extends en{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ve,this.minFilter=Ve,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class On{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],h=n[s+1],l=n[s+2],u=n[s+3];const f=r[o+0],p=r[o+1],_=r[o+2],g=r[o+3];if(a===0){t[e+0]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=p,t[e+2]=_,t[e+3]=g;return}if(u!==g||c!==f||h!==p||l!==_){let m=1-a;const d=c*f+h*p+l*_+u*g,v=d>=0?1:-1,x=1-d*d;if(x>Number.EPSILON){const C=Math.sqrt(x),w=Math.atan2(C,d*v);m=Math.sin(m*w)/C,a=Math.sin(a*w)/C}const M=a*v;if(c=c*m+f*M,h=h*m+p*M,l=l*m+_*M,u=u*m+g*M,m===1-a){const C=1/Math.sqrt(c*c+h*h+l*l+u*u);c*=C,h*=C,l*=C,u*=C}}t[e]=c,t[e+1]=h,t[e+2]=l,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],h=n[s+2],l=n[s+3],u=r[o],f=r[o+1],p=r[o+2],_=r[o+3];return t[e]=a*_+l*u+c*p-h*f,t[e+1]=c*_+l*f+h*u-a*p,t[e+2]=h*_+l*p+a*f-c*u,t[e+3]=l*_-a*u-c*f-h*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,h=a(n/2),l=a(s/2),u=a(r/2),f=c(n/2),p=c(s/2),_=c(r/2);switch(o){case"XYZ":this._x=f*l*u+h*p*_,this._y=h*p*u-f*l*_,this._z=h*l*_+f*p*u,this._w=h*l*u-f*p*_;break;case"YXZ":this._x=f*l*u+h*p*_,this._y=h*p*u-f*l*_,this._z=h*l*_-f*p*u,this._w=h*l*u+f*p*_;break;case"ZXY":this._x=f*l*u-h*p*_,this._y=h*p*u+f*l*_,this._z=h*l*_+f*p*u,this._w=h*l*u-f*p*_;break;case"ZYX":this._x=f*l*u-h*p*_,this._y=h*p*u+f*l*_,this._z=h*l*_-f*p*u,this._w=h*l*u+f*p*_;break;case"YZX":this._x=f*l*u+h*p*_,this._y=h*p*u+f*l*_,this._z=h*l*_-f*p*u,this._w=h*l*u-f*p*_;break;case"XZY":this._x=f*l*u-h*p*_,this._y=h*p*u-f*l*_,this._z=h*l*_+f*p*u,this._w=h*l*u+f*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],h=e[2],l=e[6],u=e[10],f=n+a+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(l-c)*p,this._y=(r-h)*p,this._z=(o-s)*p}else if(n>a&&n>u){const p=2*Math.sqrt(1+n-a-u);this._w=(l-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+h)/p}else if(a>u){const p=2*Math.sqrt(1+a-n-u);this._w=(r-h)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+l)/p}else{const p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+h)/p,this._y=(c+l)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Oe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,h=e._z,l=e._w;return this._x=n*l+o*a+s*h-r*c,this._y=s*l+o*c+r*a-n*h,this._z=r*l+o*h+n*c-s*a,this._w=o*l-n*a-s*c-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const h=Math.sqrt(c),l=Math.atan2(h,a),u=Math.sin((1-e)*l)/h,f=Math.sin(e*l)/h;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ul.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ul.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,h=2*(o*s-a*n),l=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*h+o*u-a*l,this.y=n+c*l+a*h-r*u,this.z=s+c*u+r*l-o*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ko.copy(this).projectOnVector(t),this.sub(ko)}reflect(t){return this.sub(ko.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Oe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ko=new R,ul=new On;class Vi{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Sn):Sn.fromBufferAttribute(r,o),Sn.applyMatrix4(t.matrixWorld),this.expandByPoint(Sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),yr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),yr.copy(n.boundingBox)),yr.applyMatrix4(t.matrixWorld),this.union(yr)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Sn),Sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ws),Sr.subVectors(this.max,Ws),Qi.subVectors(t.a,Ws),ts.subVectors(t.b,Ws),es.subVectors(t.c,Ws),oi.subVectors(ts,Qi),ai.subVectors(es,ts),bi.subVectors(Qi,es);let e=[0,-oi.z,oi.y,0,-ai.z,ai.y,0,-bi.z,bi.y,oi.z,0,-oi.x,ai.z,0,-ai.x,bi.z,0,-bi.x,-oi.y,oi.x,0,-ai.y,ai.x,0,-bi.y,bi.x,0];return!Ho(e,Qi,ts,es,Sr)||(e=[1,0,0,0,1,0,0,0,1],!Ho(e,Qi,ts,es,Sr))?!1:(br.crossVectors(oi,ai),e=[br.x,br.y,br.z],Ho(e,Qi,ts,es,Sr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Xn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Xn=[new R,new R,new R,new R,new R,new R,new R,new R],Sn=new R,yr=new Vi,Qi=new R,ts=new R,es=new R,oi=new R,ai=new R,bi=new R,Ws=new R,Sr=new R,br=new R,Ei=new R;function Ho(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ei.fromArray(i,r);const a=s.x*Math.abs(Ei.x)+s.y*Math.abs(Ei.y)+s.z*Math.abs(Ei.z),c=t.dot(Ei),h=e.dot(Ei),l=n.dot(Ei);if(Math.max(-Math.max(c,h,l),Math.min(c,h,l))>a)return!1}return!0}const hd=new Vi,Xs=new R,Go=new R;class zs{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):hd.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xs.subVectors(t,this.center);const e=Xs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Xs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Go.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xs.copy(t.center).add(Go)),this.expandByPoint(Xs.copy(t.center).sub(Go))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const $n=new R,Vo=new R,Er=new R,ci=new R,Wo=new R,wr=new R,Xo=new R;class fo{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,$n)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=$n.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):($n.copy(this.origin).addScaledVector(this.direction,e),$n.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Vo.copy(t).add(e).multiplyScalar(.5),Er.copy(e).sub(t).normalize(),ci.copy(this.origin).sub(Vo);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Er),a=ci.dot(this.direction),c=-ci.dot(Er),h=ci.lengthSq(),l=Math.abs(1-o*o);let u,f,p,_;if(l>0)if(u=o*c-a,f=o*a-c,_=r*l,u>=0)if(f>=-_)if(f<=_){const g=1/l;u*=g,f*=g,p=u*(u+o*f+2*a)+f*(o*u+f+2*c)+h}else f=r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;else f=-r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;else f<=-_?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h):f<=_?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+h):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Vo).addScaledVector(Er,f),p}intersectSphere(t,e){$n.subVectors(t.center,this.origin);const n=$n.dot(this.direction),s=$n.dot($n)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,f=this.origin;return h>=0?(n=(t.min.x-f.x)*h,s=(t.max.x-f.x)*h):(n=(t.max.x-f.x)*h,s=(t.min.x-f.x)*h),l>=0?(r=(t.min.y-f.y)*l,o=(t.max.y-f.y)*l):(r=(t.max.y-f.y)*l,o=(t.min.y-f.y)*l),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,$n)!==null}intersectTriangle(t,e,n,s,r){Wo.subVectors(e,t),wr.subVectors(n,t),Xo.crossVectors(Wo,wr);let o=this.direction.dot(Xo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ci.subVectors(this.origin,t);const c=a*this.direction.dot(wr.crossVectors(ci,wr));if(c<0)return null;const h=a*this.direction.dot(Wo.cross(ci));if(h<0||c+h>o)return null;const l=-a*ci.dot(Xo);return l<0?null:this.at(l/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class le{constructor(t,e,n,s,r,o,a,c,h,l,u,f,p,_,g,m){le.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,h,l,u,f,p,_,g,m)}set(t,e,n,s,r,o,a,c,h,l,u,f,p,_,g,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=c,d[2]=h,d[6]=l,d[10]=u,d[14]=f,d[3]=p,d[7]=_,d[11]=g,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new le().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ns.setFromMatrixColumn(t,0).length(),r=1/ns.setFromMatrixColumn(t,1).length(),o=1/ns.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),h=Math.sin(s),l=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*l,p=o*u,_=a*l,g=a*u;e[0]=c*l,e[4]=-c*u,e[8]=h,e[1]=p+_*h,e[5]=f-g*h,e[9]=-a*c,e[2]=g-f*h,e[6]=_+p*h,e[10]=o*c}else if(t.order==="YXZ"){const f=c*l,p=c*u,_=h*l,g=h*u;e[0]=f+g*a,e[4]=_*a-p,e[8]=o*h,e[1]=o*u,e[5]=o*l,e[9]=-a,e[2]=p*a-_,e[6]=g+f*a,e[10]=o*c}else if(t.order==="ZXY"){const f=c*l,p=c*u,_=h*l,g=h*u;e[0]=f-g*a,e[4]=-o*u,e[8]=_+p*a,e[1]=p+_*a,e[5]=o*l,e[9]=g-f*a,e[2]=-o*h,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const f=o*l,p=o*u,_=a*l,g=a*u;e[0]=c*l,e[4]=_*h-p,e[8]=f*h+g,e[1]=c*u,e[5]=g*h+f,e[9]=p*h-_,e[2]=-h,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const f=o*c,p=o*h,_=a*c,g=a*h;e[0]=c*l,e[4]=g-f*u,e[8]=_*u+p,e[1]=u,e[5]=o*l,e[9]=-a*l,e[2]=-h*l,e[6]=p*u+_,e[10]=f-g*u}else if(t.order==="XZY"){const f=o*c,p=o*h,_=a*c,g=a*h;e[0]=c*l,e[4]=-u,e[8]=h*l,e[1]=f*u+g,e[5]=o*l,e[9]=p*u-_,e[2]=_*u-p,e[6]=a*l,e[10]=g*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ud,t,fd)}lookAt(t,e,n){const s=this.elements;return ln.subVectors(t,e),ln.lengthSq()===0&&(ln.z=1),ln.normalize(),li.crossVectors(n,ln),li.lengthSq()===0&&(Math.abs(n.z)===1?ln.x+=1e-4:ln.z+=1e-4,ln.normalize(),li.crossVectors(n,ln)),li.normalize(),Tr.crossVectors(ln,li),s[0]=li.x,s[4]=Tr.x,s[8]=ln.x,s[1]=li.y,s[5]=Tr.y,s[9]=ln.y,s[2]=li.z,s[6]=Tr.z,s[10]=ln.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],h=n[12],l=n[1],u=n[5],f=n[9],p=n[13],_=n[2],g=n[6],m=n[10],d=n[14],v=n[3],x=n[7],M=n[11],C=n[15],w=s[0],A=s[4],U=s[8],y=s[12],b=s[1],H=s[5],G=s[9],K=s[13],I=s[2],F=s[6],W=s[10],Y=s[14],$=s[3],q=s[7],j=s[11],ot=s[15];return r[0]=o*w+a*b+c*I+h*$,r[4]=o*A+a*H+c*F+h*q,r[8]=o*U+a*G+c*W+h*j,r[12]=o*y+a*K+c*Y+h*ot,r[1]=l*w+u*b+f*I+p*$,r[5]=l*A+u*H+f*F+p*q,r[9]=l*U+u*G+f*W+p*j,r[13]=l*y+u*K+f*Y+p*ot,r[2]=_*w+g*b+m*I+d*$,r[6]=_*A+g*H+m*F+d*q,r[10]=_*U+g*G+m*W+d*j,r[14]=_*y+g*K+m*Y+d*ot,r[3]=v*w+x*b+M*I+C*$,r[7]=v*A+x*H+M*F+C*q,r[11]=v*U+x*G+M*W+C*j,r[15]=v*y+x*K+M*Y+C*ot,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],h=t[13],l=t[2],u=t[6],f=t[10],p=t[14],_=t[3],g=t[7],m=t[11],d=t[15];return _*(+r*c*u-s*h*u-r*a*f+n*h*f+s*a*p-n*c*p)+g*(+e*c*p-e*h*f+r*o*f-s*o*p+s*h*l-r*c*l)+m*(+e*h*u-e*a*p-r*o*u+n*o*p+r*a*l-n*h*l)+d*(-s*a*l-e*c*u+e*a*f+s*o*u-n*o*f+n*c*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],h=t[7],l=t[8],u=t[9],f=t[10],p=t[11],_=t[12],g=t[13],m=t[14],d=t[15],v=u*m*h-g*f*h+g*c*p-a*m*p-u*c*d+a*f*d,x=_*f*h-l*m*h-_*c*p+o*m*p+l*c*d-o*f*d,M=l*g*h-_*u*h+_*a*p-o*g*p-l*a*d+o*u*d,C=_*u*c-l*g*c-_*a*f+o*g*f+l*a*m-o*u*m,w=e*v+n*x+s*M+r*C;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return t[0]=v*A,t[1]=(g*f*r-u*m*r-g*s*p+n*m*p+u*s*d-n*f*d)*A,t[2]=(a*m*r-g*c*r+g*s*h-n*m*h-a*s*d+n*c*d)*A,t[3]=(u*c*r-a*f*r-u*s*h+n*f*h+a*s*p-n*c*p)*A,t[4]=x*A,t[5]=(l*m*r-_*f*r+_*s*p-e*m*p-l*s*d+e*f*d)*A,t[6]=(_*c*r-o*m*r-_*s*h+e*m*h+o*s*d-e*c*d)*A,t[7]=(o*f*r-l*c*r+l*s*h-e*f*h-o*s*p+e*c*p)*A,t[8]=M*A,t[9]=(_*u*r-l*g*r-_*n*p+e*g*p+l*n*d-e*u*d)*A,t[10]=(o*g*r-_*a*r+_*n*h-e*g*h-o*n*d+e*a*d)*A,t[11]=(l*a*r-o*u*r-l*n*h+e*u*h+o*n*p-e*a*p)*A,t[12]=C*A,t[13]=(l*g*s-_*u*s+_*n*f-e*g*f-l*n*m+e*u*m)*A,t[14]=(_*a*s-o*g*s-_*n*c+e*g*c+o*n*m-e*a*m)*A,t[15]=(o*u*s-l*a*s+l*n*c-e*u*c-o*n*f+e*a*f)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,h=r*o,l=r*a;return this.set(h*o+n,h*a-s*c,h*c+s*a,0,h*a+s*c,l*a+n,l*c-s*o,0,h*c-s*a,l*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,h=r+r,l=o+o,u=a+a,f=r*h,p=r*l,_=r*u,g=o*l,m=o*u,d=a*u,v=c*h,x=c*l,M=c*u,C=n.x,w=n.y,A=n.z;return s[0]=(1-(g+d))*C,s[1]=(p+M)*C,s[2]=(_-x)*C,s[3]=0,s[4]=(p-M)*w,s[5]=(1-(f+d))*w,s[6]=(m+v)*w,s[7]=0,s[8]=(_+x)*A,s[9]=(m-v)*A,s[10]=(1-(f+g))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=ns.set(s[0],s[1],s[2]).length();const o=ns.set(s[4],s[5],s[6]).length(),a=ns.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],bn.copy(this);const h=1/r,l=1/o,u=1/a;return bn.elements[0]*=h,bn.elements[1]*=h,bn.elements[2]*=h,bn.elements[4]*=l,bn.elements[5]*=l,bn.elements[6]*=l,bn.elements[8]*=u,bn.elements[9]*=u,bn.elements[10]*=u,e.setFromRotationMatrix(bn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=ei){const c=this.elements,h=2*r/(e-t),l=2*r/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let p,_;if(a===ei)p=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===no)p=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=l,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=ei){const c=this.elements,h=1/(e-t),l=1/(n-s),u=1/(o-r),f=(e+t)*h,p=(n+s)*l;let _,g;if(a===ei)_=(o+r)*u,g=-2*u;else if(a===no)_=r*u,g=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=g,c[14]=-_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ns=new R,bn=new le,ud=new R(0,0,0),fd=new R(1,1,1),li=new R,Tr=new R,ln=new R,fl=new le,dl=new On;class Os{constructor(t=0,e=0,n=0,s=Os.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],h=s[5],l=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Oe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-l,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Oe(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Oe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Oe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin(Oe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Oe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,h),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-l,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return fl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(fl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return dl.setFromEuler(this),this.setFromQuaternion(dl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Os.DEFAULT_ORDER="XYZ";class ka{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let dd=0;const pl=new R,is=new On,qn=new le,Ar=new R,$s=new R,pd=new R,md=new On,ml=new R(1,0,0),gl=new R(0,1,0),_l=new R(0,0,1),gd={type:"added"},_d={type:"removed"};class Fe extends Gi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:dd++}),this.uuid=lr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Fe.DEFAULT_UP.clone();const t=new R,e=new Os,n=new On,s=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new le},normalMatrix:{value:new Jt}}),this.matrix=new le,this.matrixWorld=new le,this.matrixAutoUpdate=Fe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Fe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ka,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.multiply(is),this}rotateOnWorldAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.premultiply(is),this}rotateX(t){return this.rotateOnAxis(ml,t)}rotateY(t){return this.rotateOnAxis(gl,t)}rotateZ(t){return this.rotateOnAxis(_l,t)}translateOnAxis(t,e){return pl.copy(t).applyQuaternion(this.quaternion),this.position.add(pl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ml,t)}translateY(t){return this.translateOnAxis(gl,t)}translateZ(t){return this.translateOnAxis(_l,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(qn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ar.copy(t):Ar.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),$s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qn.lookAt($s,Ar,this.up):qn.lookAt(Ar,$s,this.up),this.quaternion.setFromRotationMatrix(qn),s&&(qn.extractRotation(s.matrixWorld),is.setFromRotationMatrix(qn),this.quaternion.premultiply(is.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(gd)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(_d)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),qn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),qn.multiply(t.parent.matrixWorld)),t.applyMatrix4(qn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,t,pd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,md,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let h=0,l=c.length;h<l;h++){const u=c[h];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,h=this.material.length;c<h;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),h=o(t.textures),l=o(t.images),u=o(t.shapes),f=o(t.skeletons),p=o(t.animations),_=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),l.length>0&&(n.images=l),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=s,n;function o(a){const c=[];for(const h in a){const l=a[h];delete l.metadata,c.push(l)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Fe.DEFAULT_UP=new R(0,1,0);Fe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Fe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const En=new R,Yn=new R,$o=new R,jn=new R,ss=new R,rs=new R,vl=new R,qo=new R,Yo=new R,jo=new R;let Rr=!1;class Tn{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),En.subVectors(t,e),s.cross(En);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){En.subVectors(s,e),Yn.subVectors(n,e),$o.subVectors(t,e);const o=En.dot(En),a=En.dot(Yn),c=En.dot($o),h=Yn.dot(Yn),l=Yn.dot($o),u=o*h-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(h*c-a*l)*f,_=(o*l-a*c)*f;return r.set(1-p-_,_,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,jn)===null?!1:jn.x>=0&&jn.y>=0&&jn.x+jn.y<=1}static getUV(t,e,n,s,r,o,a,c){return Rr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Rr=!0),this.getInterpolation(t,e,n,s,r,o,a,c)}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,jn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,jn.x),c.addScaledVector(o,jn.y),c.addScaledVector(a,jn.z),c)}static isFrontFacing(t,e,n,s){return En.subVectors(n,e),Yn.subVectors(t,e),En.cross(Yn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return En.subVectors(this.c,this.b),Yn.subVectors(this.a,this.b),En.cross(Yn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Tn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Tn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Rr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Rr=!0),Tn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return Tn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Tn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Tn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;ss.subVectors(s,n),rs.subVectors(r,n),qo.subVectors(t,n);const c=ss.dot(qo),h=rs.dot(qo);if(c<=0&&h<=0)return e.copy(n);Yo.subVectors(t,s);const l=ss.dot(Yo),u=rs.dot(Yo);if(l>=0&&u<=l)return e.copy(s);const f=c*u-l*h;if(f<=0&&c>=0&&l<=0)return o=c/(c-l),e.copy(n).addScaledVector(ss,o);jo.subVectors(t,r);const p=ss.dot(jo),_=rs.dot(jo);if(_>=0&&p<=_)return e.copy(r);const g=p*h-c*_;if(g<=0&&h>=0&&_<=0)return a=h/(h-_),e.copy(n).addScaledVector(rs,a);const m=l*_-p*u;if(m<=0&&u-l>=0&&p-_>=0)return vl.subVectors(r,s),a=(u-l)/(u-l+(p-_)),e.copy(s).addScaledVector(vl,a);const d=1/(m+g+f);return o=g*d,a=f*d,e.copy(n).addScaledVector(ss,o).addScaledVector(rs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Yh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hi={h:0,s:0,l:0},Cr={h:0,s:0,l:0};function Ko(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ce){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=he.workingColorSpace){return this.r=t,this.g=e,this.b=n,he.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=he.workingColorSpace){if(t=nd(t,1),e=Oe(e,0,1),n=Oe(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Ko(o,r,t+1/3),this.g=Ko(o,r,t),this.b=Ko(o,r,t-1/3)}return he.toWorkingColorSpace(this,s),this}setStyle(t,e=Ce){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ce){const n=Yh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ws(t.r),this.g=ws(t.g),this.b=ws(t.b),this}copyLinearToSRGB(t){return this.r=Fo(t.r),this.g=Fo(t.g),this.b=Fo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ce){return he.fromWorkingColorSpace($e.copy(this),t),Math.round(Oe($e.r*255,0,255))*65536+Math.round(Oe($e.g*255,0,255))*256+Math.round(Oe($e.b*255,0,255))}getHexString(t=Ce){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.fromWorkingColorSpace($e.copy(this),e);const n=$e.r,s=$e.g,r=$e.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,h;const l=(a+o)/2;if(a===o)c=0,h=0;else{const u=o-a;switch(h=l<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=h,t.l=l,t}getRGB(t,e=he.workingColorSpace){return he.fromWorkingColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=Ce){he.fromWorkingColorSpace($e.copy(this),t);const e=$e.r,n=$e.g,s=$e.b;return t!==Ce?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(hi),this.setHSL(hi.h+t,hi.s+e,hi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(hi),t.getHSL(Cr);const n=zo(hi.h,Cr.h,e),s=zo(hi.s,Cr.s,e),r=zo(hi.l,Cr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $e=new qt;qt.NAMES=Yh;let vd=0;class Wi extends Gi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vd++}),this.uuid=lr(),this.name="",this.type="Material",this.blending=Es,this.side=xi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ma,this.blendDst=ya,this.blendEquation=Li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=Jr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ji,this.stencilZFail=Ji,this.stencilZPass=Ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Es&&(n.blending=this.blending),this.side!==xi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ma&&(n.blendSrc=this.blendSrc),this.blendDst!==ya&&(n.blendDst=this.blendDst),this.blendEquation!==Li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Jr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Qe extends Wi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=za,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Re=new R,Pr=new ht;class mn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=rl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=pi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Pr.fromBufferAttribute(this,e),Pr.applyMatrix3(t),this.setXY(e,Pr.x,Pr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix3(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix4(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyNormalMatrix(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.transformDirection(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Vs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=nn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Vs(e,this.array)),e}setX(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Vs(e,this.array)),e}setY(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Vs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Vs(e,this.array)),e}setW(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=nn(e,this.array),n=nn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=nn(e,this.array),n=nn(n,this.array),s=nn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=nn(e,this.array),n=nn(n,this.array),s=nn(s,this.array),r=nn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==rl&&(t.usage=this.usage),t}}class jh extends mn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Kh extends mn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class se extends mn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let xd=0;const vn=new le,Jo=new Fe,os=new R,hn=new Vi,qs=new Vi,ze=new R;class Te extends Gi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xd++}),this.uuid=lr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Wh(t)?Kh:jh)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return vn.makeRotationFromQuaternion(t),this.applyMatrix4(vn),this}rotateX(t){return vn.makeRotationX(t),this.applyMatrix4(vn),this}rotateY(t){return vn.makeRotationY(t),this.applyMatrix4(vn),this}rotateZ(t){return vn.makeRotationZ(t),this.applyMatrix4(vn),this}translate(t,e,n){return vn.makeTranslation(t,e,n),this.applyMatrix4(vn),this}scale(t,e,n){return vn.makeScale(t,e,n),this.applyMatrix4(vn),this}lookAt(t){return Jo.lookAt(t),Jo.updateMatrix(),this.applyMatrix4(Jo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(os).negate(),this.translate(os.x,os.y,os.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new se(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];hn.setFromBufferAttribute(r),this.morphTargetsRelative?(ze.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(ze),ze.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(ze)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new zs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(hn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];qs.setFromBufferAttribute(a),this.morphTargetsRelative?(ze.addVectors(hn.min,qs.min),hn.expandByPoint(ze),ze.addVectors(hn.max,qs.max),hn.expandByPoint(ze)):(hn.expandByPoint(qs.min),hn.expandByPoint(qs.max))}hn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)ze.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ze));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let h=0,l=a.count;h<l;h++)ze.fromBufferAttribute(a,h),c&&(os.fromBufferAttribute(t,h),ze.add(os)),s=Math.max(s,n.distanceToSquared(ze))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new mn(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,h=[],l=[];for(let b=0;b<a;b++)h[b]=new R,l[b]=new R;const u=new R,f=new R,p=new R,_=new ht,g=new ht,m=new ht,d=new R,v=new R;function x(b,H,G){u.fromArray(s,b*3),f.fromArray(s,H*3),p.fromArray(s,G*3),_.fromArray(o,b*2),g.fromArray(o,H*2),m.fromArray(o,G*2),f.sub(u),p.sub(u),g.sub(_),m.sub(_);const K=1/(g.x*m.y-m.x*g.y);isFinite(K)&&(d.copy(f).multiplyScalar(m.y).addScaledVector(p,-g.y).multiplyScalar(K),v.copy(p).multiplyScalar(g.x).addScaledVector(f,-m.x).multiplyScalar(K),h[b].add(d),h[H].add(d),h[G].add(d),l[b].add(v),l[H].add(v),l[G].add(v))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let b=0,H=M.length;b<H;++b){const G=M[b],K=G.start,I=G.count;for(let F=K,W=K+I;F<W;F+=3)x(n[F+0],n[F+1],n[F+2])}const C=new R,w=new R,A=new R,U=new R;function y(b){A.fromArray(r,b*3),U.copy(A);const H=h[b];C.copy(H),C.sub(A.multiplyScalar(A.dot(H))).normalize(),w.crossVectors(U,H);const K=w.dot(l[b])<0?-1:1;c[b*4]=C.x,c[b*4+1]=C.y,c[b*4+2]=C.z,c[b*4+3]=K}for(let b=0,H=M.length;b<H;++b){const G=M[b],K=G.start,I=G.count;for(let F=K,W=K+I;F<W;F+=3)y(n[F+0]),y(n[F+1]),y(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new mn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new R,r=new R,o=new R,a=new R,c=new R,h=new R,l=new R,u=new R;if(t)for(let f=0,p=t.count;f<p;f+=3){const _=t.getX(f+0),g=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,_),r.fromBufferAttribute(e,g),o.fromBufferAttribute(e,m),l.subVectors(o,r),u.subVectors(s,r),l.cross(u),a.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),h.fromBufferAttribute(n,m),a.add(l),c.add(l),h.add(l),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(g,c.x,c.y,c.z),n.setXYZ(m,h.x,h.y,h.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),l.subVectors(o,r),u.subVectors(s,r),l.cross(u),n.setXYZ(f+0,l.x,l.y,l.z),n.setXYZ(f+1,l.x,l.y,l.z),n.setXYZ(f+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ze.fromBufferAttribute(t,e),ze.normalize(),t.setXYZ(e,ze.x,ze.y,ze.z)}toNonIndexed(){function t(a,c){const h=a.array,l=a.itemSize,u=a.normalized,f=new h.constructor(c.length*l);let p=0,_=0;for(let g=0,m=c.length;g<m;g++){a.isInterleavedBufferAttribute?p=c[g]*a.data.stride+a.offset:p=c[g]*l;for(let d=0;d<l;d++)f[_++]=h[p++]}return new mn(f,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Te,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],h=t(c,n);e.setAttribute(a,h)}const r=this.morphAttributes;for(const a in r){const c=[],h=r[a];for(let l=0,u=h.length;l<u;l++){const f=h[l],p=t(f,n);c.push(p)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const h=o[a];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const h=n[c];t.data.attributes[c]=h.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],l=[];for(let u=0,f=h.length;u<f;u++){const p=h[u];l.push(p.toJSON(t.data))}l.length>0&&(s[c]=l,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const h in s){const l=s[h];this.setAttribute(h,l.clone(e))}const r=t.morphAttributes;for(const h in r){const l=[],u=r[h];for(let f=0,p=u.length;f<p;f++)l.push(u[f].clone(e));this.morphAttributes[h]=l}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let h=0,l=o.length;h<l;h++){const u=o[h];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xl=new le,wi=new fo,Lr=new zs,Ml=new R,as=new R,cs=new R,ls=new R,Zo=new R,Dr=new R,Ir=new ht,Ur=new ht,Nr=new ht,yl=new R,Sl=new R,bl=new R,zr=new R,Or=new R;class Ht extends Fe{constructor(t=new Te,e=new Qe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Dr.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const l=a[c],u=r[c];l!==0&&(Zo.fromBufferAttribute(u,t),o?Dr.addScaledVector(Zo,l):Dr.addScaledVector(Zo.sub(e),l))}e.add(Dr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Lr.copy(n.boundingSphere),Lr.applyMatrix4(r),wi.copy(t.ray).recast(t.near),!(Lr.containsPoint(wi.origin)===!1&&(wi.intersectSphere(Lr,Ml)===null||wi.origin.distanceToSquared(Ml)>(t.far-t.near)**2))&&(xl.copy(r).invert(),wi.copy(t.ray).applyMatrix4(xl),!(n.boundingBox!==null&&wi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,wi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,h=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,g=f.length;_<g;_++){const m=f[_],d=o[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let M=v,C=x;M<C;M+=3){const w=a.getX(M),A=a.getX(M+1),U=a.getX(M+2);s=Fr(this,d,t,n,h,l,u,w,A,U),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),g=Math.min(a.count,p.start+p.count);for(let m=_,d=g;m<d;m+=3){const v=a.getX(m),x=a.getX(m+1),M=a.getX(m+2);s=Fr(this,o,t,n,h,l,u,v,x,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let _=0,g=f.length;_<g;_++){const m=f[_],d=o[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let M=v,C=x;M<C;M+=3){const w=M,A=M+1,U=M+2;s=Fr(this,d,t,n,h,l,u,w,A,U),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),g=Math.min(c.count,p.start+p.count);for(let m=_,d=g;m<d;m+=3){const v=m,x=m+1,M=m+2;s=Fr(this,o,t,n,h,l,u,v,x,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Md(i,t,e,n,s,r,o,a){let c;if(t.side===rn?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===xi,a),c===null)return null;Or.copy(a),Or.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(Or);return h<e.near||h>e.far?null:{distance:h,point:Or.clone(),object:i}}function Fr(i,t,e,n,s,r,o,a,c,h){i.getVertexPosition(a,as),i.getVertexPosition(c,cs),i.getVertexPosition(h,ls);const l=Md(i,t,e,n,as,cs,ls,zr);if(l){s&&(Ir.fromBufferAttribute(s,a),Ur.fromBufferAttribute(s,c),Nr.fromBufferAttribute(s,h),l.uv=Tn.getInterpolation(zr,as,cs,ls,Ir,Ur,Nr,new ht)),r&&(Ir.fromBufferAttribute(r,a),Ur.fromBufferAttribute(r,c),Nr.fromBufferAttribute(r,h),l.uv1=Tn.getInterpolation(zr,as,cs,ls,Ir,Ur,Nr,new ht),l.uv2=l.uv1),o&&(yl.fromBufferAttribute(o,a),Sl.fromBufferAttribute(o,c),bl.fromBufferAttribute(o,h),l.normal=Tn.getInterpolation(zr,as,cs,ls,yl,Sl,bl,new R),l.normal.dot(n.direction)>0&&l.normal.multiplyScalar(-1));const u={a,b:c,c:h,normal:new R,materialIndex:0};Tn.getNormal(as,cs,ls,u.normal),l.face=u}return l}class Fn extends Te{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],h=[],l=[],u=[];let f=0,p=0;_("z","y","x",-1,-1,n,e,t,o,r,0),_("z","y","x",1,-1,n,e,-t,o,r,1),_("x","z","y",1,1,t,n,e,s,o,2),_("x","z","y",1,-1,t,n,-e,s,o,3),_("x","y","z",1,-1,t,e,n,s,r,4),_("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new se(h,3)),this.setAttribute("normal",new se(l,3)),this.setAttribute("uv",new se(u,2));function _(g,m,d,v,x,M,C,w,A,U,y){const b=M/A,H=C/U,G=M/2,K=C/2,I=w/2,F=A+1,W=U+1;let Y=0,$=0;const q=new R;for(let j=0;j<W;j++){const ot=j*H-K;for(let ct=0;ct<F;ct++){const X=ct*b-G;q[g]=X*v,q[m]=ot*x,q[d]=I,h.push(q.x,q.y,q.z),q[g]=0,q[m]=0,q[d]=w>0?1:-1,l.push(q.x,q.y,q.z),u.push(ct/A),u.push(1-j/U),Y+=1}}for(let j=0;j<U;j++)for(let ot=0;ot<A;ot++){const ct=f+ot+F*j,X=f+ot+F*(j+1),J=f+(ot+1)+F*(j+1),mt=f+(ot+1)+F*j;c.push(ct,X,mt),c.push(X,J,mt),$+=6}a.addGroup(p,$,y),p+=$,f+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ds(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ze(i){const t={};for(let e=0;e<i.length;e++){const n=Ds(i[e]);for(const s in n)t[s]=n[s]}return t}function yd(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Jh(i){return i.getRenderTarget()===null?i.outputColorSpace:he.workingColorSpace}const Sd={clone:Ds,merge:Ze};var bd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ed=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Bi extends Wi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bd,this.fragmentShader=Ed,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ds(t.uniforms),this.uniformsGroups=yd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Zh extends Fe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new le,this.projectionMatrix=new le,this.projectionMatrixInverse=new le,this.coordinateSystem=ei}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class un extends Zh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ta*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(qr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ta*2*Math.atan(Math.tan(qr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(qr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,h=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/h,s*=o.width/c,n*=o.height/h}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const hs=-90,us=1;class wd extends Fe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new un(hs,us,t,e);s.layers=this.layers,this.add(s);const r=new un(hs,us,t,e);r.layers=this.layers,this.add(r);const o=new un(hs,us,t,e);o.layers=this.layers,this.add(o);const a=new un(hs,us,t,e);a.layers=this.layers,this.add(a);const c=new un(hs,us,t,e);c.layers=this.layers,this.add(c);const h=new un(hs,us,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const h of e)this.remove(h);if(t===ei)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===no)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,h,l]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,s),t.render(e,l),t.setRenderTarget(u,f,p),t.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class Qh extends en{constructor(t,e,n,s,r,o,a,c,h,l){t=t!==void 0?t:[],e=e!==void 0?e:Cs,super(t,e,n,s,r,o,a,c,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Td extends Fi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(tr("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Ni?Ce:Mn),this.texture=new Qh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:sn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Fn(5,5,5),r=new Bi({name:"CubemapFromEquirect",uniforms:Ds(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:rn,blending:mi});r.uniforms.tEquirect.value=e;const o=new Ht(s,r),a=e.minFilter;return e.minFilter===rr&&(e.minFilter=sn),new wd(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Qo=new R,Ad=new R,Rd=new Jt;class fi{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Qo.subVectors(n,e).cross(Ad.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Qo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Rd.getNormalMatrix(t),s=this.coplanarPoint(Qo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ti=new zs,Br=new R;class Ha{constructor(t=new fi,e=new fi,n=new fi,s=new fi,r=new fi,o=new fi){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ei){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],h=s[4],l=s[5],u=s[6],f=s[7],p=s[8],_=s[9],g=s[10],m=s[11],d=s[12],v=s[13],x=s[14],M=s[15];if(n[0].setComponents(c-r,f-h,m-p,M-d).normalize(),n[1].setComponents(c+r,f+h,m+p,M+d).normalize(),n[2].setComponents(c+o,f+l,m+_,M+v).normalize(),n[3].setComponents(c-o,f-l,m-_,M-v).normalize(),n[4].setComponents(c-a,f-u,m-g,M-x).normalize(),e===ei)n[5].setComponents(c+a,f+u,m+g,M+x).normalize();else if(e===no)n[5].setComponents(a,u,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ti.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ti.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ti)}intersectsSprite(t){return Ti.center.set(0,0,0),Ti.radius=.7071067811865476,Ti.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ti)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Br.x=s.normal.x>0?t.max.x:t.min.x,Br.y=s.normal.y>0?t.max.y:t.min.y,Br.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Br)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function tu(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Cd(i,t){const e=t.isWebGL2,n=new WeakMap;function s(h,l){const u=h.array,f=h.usage,p=u.byteLength,_=i.createBuffer();i.bindBuffer(l,_),i.bufferData(l,u,f),h.onUploadCallback();let g;if(u instanceof Float32Array)g=i.FLOAT;else if(u instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(e)g=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)g=i.SHORT;else if(u instanceof Uint32Array)g=i.UNSIGNED_INT;else if(u instanceof Int32Array)g=i.INT;else if(u instanceof Int8Array)g=i.BYTE;else if(u instanceof Uint8Array)g=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)g=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:_,type:g,bytesPerElement:u.BYTES_PER_ELEMENT,version:h.version,size:p}}function r(h,l,u){const f=l.array,p=l._updateRange,_=l.updateRanges;if(i.bindBuffer(u,h),p.count===-1&&_.length===0&&i.bufferSubData(u,0,f),_.length!==0){for(let g=0,m=_.length;g<m;g++){const d=_[g];e?i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}l.clearUpdateRanges()}p.count!==-1&&(e?i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f,p.offset,p.count):i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f.subarray(p.offset,p.offset+p.count)),p.count=-1),l.onUploadCallback()}function o(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function a(h){h.isInterleavedBufferAttribute&&(h=h.data);const l=n.get(h);l&&(i.deleteBuffer(l.buffer),n.delete(h))}function c(h,l){if(h.isGLBufferAttribute){const f=n.get(h);(!f||f.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);const u=n.get(h);if(u===void 0)n.set(h,s(h,l));else if(u.version<h.version){if(u.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,h,l),u.version=h.version}}return{get:o,remove:a,update:c}}class Mi extends Te{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),h=a+1,l=c+1,u=t/a,f=e/c,p=[],_=[],g=[],m=[];for(let d=0;d<l;d++){const v=d*f-o;for(let x=0;x<h;x++){const M=x*u-r;_.push(M,-v,0),g.push(0,0,1),m.push(x/a),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let v=0;v<a;v++){const x=v+h*d,M=v+h*(d+1),C=v+1+h*(d+1),w=v+1+h*d;p.push(x,M,w),p.push(M,C,w)}this.setIndex(p),this.setAttribute("position",new se(_,3)),this.setAttribute("normal",new se(g,3)),this.setAttribute("uv",new se(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mi(t.width,t.height,t.widthSegments,t.heightSegments)}}var Pd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ld=`#ifdef USE_ALPHAHASH
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
#endif`,Dd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Id=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ud=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Nd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zd=`#ifdef USE_AOMAP
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
#endif`,Od=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Fd=`#ifdef USE_BATCHING
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
#endif`,Bd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,kd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Hd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Vd=`#ifdef USE_IRIDESCENCE
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
#endif`,Wd=`#ifdef USE_BUMPMAP
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
#endif`,Xd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$d=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Kd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Jd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Zd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Qd=`#define PI 3.141592653589793
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
} // validated`,tp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ep=`vec3 transformedNormal = objectNormal;
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
#endif`,np=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ip=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,op="gl_FragColor = linearToOutputTexel( gl_FragColor );",ap=`
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
}`,cp=`#ifdef USE_ENVMAP
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
#endif`,lp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,hp=`#ifdef USE_ENVMAP
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
#endif`,up=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,fp=`#ifdef USE_ENVMAP
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
#endif`,dp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_p=`#ifdef USE_GRADIENTMAP
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
}`,vp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,xp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Mp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,yp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sp=`uniform bool receiveShadow;
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
#endif`,bp=`#ifdef USE_ENVMAP
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
#endif`,Ep=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Tp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ap=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Rp=`PhysicalMaterial material;
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
#endif`,Cp=`struct PhysicalMaterial {
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
}`,Pp=`
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
#endif`,Lp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Dp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ip=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Up=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Np=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,zp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Op=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Bp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,kp=`#if defined( USE_POINTS_UV )
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
#endif`,Hp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Gp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Vp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Wp=`#ifdef USE_MORPHNORMALS
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
#endif`,Xp=`#ifdef USE_MORPHTARGETS
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
#endif`,$p=`#ifdef USE_MORPHTARGETS
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
#endif`,qp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Yp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,jp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Zp=`#ifdef USE_NORMALMAP
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
#endif`,Qp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,em=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,im=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,rm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,om=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,am=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,lm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,um=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,dm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,pm=`float getShadowMask() {
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
}`,mm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gm=`#ifdef USE_SKINNING
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
#endif`,_m=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vm=`#ifdef USE_SKINNING
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
#endif`,xm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Mm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ym=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Sm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,bm=`#ifdef USE_TRANSMISSION
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
#endif`,Em=`#ifdef USE_TRANSMISSION
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
#endif`,wm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Rm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Cm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pm=`uniform sampler2D t2D;
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
}`,Lm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Im=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Um=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Nm=`#include <common>
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
}`,zm=`#if DEPTH_PACKING == 3200
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
}`,Om=`#define DISTANCE
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
}`,Fm=`#define DISTANCE
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
}`,Bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,km=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hm=`uniform float scale;
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
}`,Gm=`uniform vec3 diffuse;
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
}`,Vm=`#include <common>
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
}`,Wm=`uniform vec3 diffuse;
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
}`,Xm=`#define LAMBERT
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
}`,$m=`#define LAMBERT
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
}`,qm=`#define MATCAP
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
}`,Ym=`#define MATCAP
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
}`,jm=`#define NORMAL
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
}`,Km=`#define NORMAL
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
}`,Jm=`#define PHONG
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
}`,Zm=`#define PHONG
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
}`,Qm=`#define STANDARD
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
}`,t0=`#define STANDARD
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
}`,e0=`#define TOON
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
}`,n0=`#define TOON
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
}`,i0=`uniform float size;
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
}`,s0=`uniform vec3 diffuse;
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
}`,r0=`#include <common>
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
}`,o0=`uniform vec3 color;
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
}`,a0=`uniform float rotation;
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
}`,c0=`uniform vec3 diffuse;
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
}`,$t={alphahash_fragment:Pd,alphahash_pars_fragment:Ld,alphamap_fragment:Dd,alphamap_pars_fragment:Id,alphatest_fragment:Ud,alphatest_pars_fragment:Nd,aomap_fragment:zd,aomap_pars_fragment:Od,batching_pars_vertex:Fd,batching_vertex:Bd,begin_vertex:kd,beginnormal_vertex:Hd,bsdfs:Gd,iridescence_fragment:Vd,bumpmap_pars_fragment:Wd,clipping_planes_fragment:Xd,clipping_planes_pars_fragment:$d,clipping_planes_pars_vertex:qd,clipping_planes_vertex:Yd,color_fragment:jd,color_pars_fragment:Kd,color_pars_vertex:Jd,color_vertex:Zd,common:Qd,cube_uv_reflection_fragment:tp,defaultnormal_vertex:ep,displacementmap_pars_vertex:np,displacementmap_vertex:ip,emissivemap_fragment:sp,emissivemap_pars_fragment:rp,colorspace_fragment:op,colorspace_pars_fragment:ap,envmap_fragment:cp,envmap_common_pars_fragment:lp,envmap_pars_fragment:hp,envmap_pars_vertex:up,envmap_physical_pars_fragment:bp,envmap_vertex:fp,fog_vertex:dp,fog_pars_vertex:pp,fog_fragment:mp,fog_pars_fragment:gp,gradientmap_pars_fragment:_p,lightmap_fragment:vp,lightmap_pars_fragment:xp,lights_lambert_fragment:Mp,lights_lambert_pars_fragment:yp,lights_pars_begin:Sp,lights_toon_fragment:Ep,lights_toon_pars_fragment:wp,lights_phong_fragment:Tp,lights_phong_pars_fragment:Ap,lights_physical_fragment:Rp,lights_physical_pars_fragment:Cp,lights_fragment_begin:Pp,lights_fragment_maps:Lp,lights_fragment_end:Dp,logdepthbuf_fragment:Ip,logdepthbuf_pars_fragment:Up,logdepthbuf_pars_vertex:Np,logdepthbuf_vertex:zp,map_fragment:Op,map_pars_fragment:Fp,map_particle_fragment:Bp,map_particle_pars_fragment:kp,metalnessmap_fragment:Hp,metalnessmap_pars_fragment:Gp,morphcolor_vertex:Vp,morphnormal_vertex:Wp,morphtarget_pars_vertex:Xp,morphtarget_vertex:$p,normal_fragment_begin:qp,normal_fragment_maps:Yp,normal_pars_fragment:jp,normal_pars_vertex:Kp,normal_vertex:Jp,normalmap_pars_fragment:Zp,clearcoat_normal_fragment_begin:Qp,clearcoat_normal_fragment_maps:tm,clearcoat_pars_fragment:em,iridescence_pars_fragment:nm,opaque_fragment:im,packing:sm,premultiplied_alpha_fragment:rm,project_vertex:om,dithering_fragment:am,dithering_pars_fragment:cm,roughnessmap_fragment:lm,roughnessmap_pars_fragment:hm,shadowmap_pars_fragment:um,shadowmap_pars_vertex:fm,shadowmap_vertex:dm,shadowmask_pars_fragment:pm,skinbase_vertex:mm,skinning_pars_vertex:gm,skinning_vertex:_m,skinnormal_vertex:vm,specularmap_fragment:xm,specularmap_pars_fragment:Mm,tonemapping_fragment:ym,tonemapping_pars_fragment:Sm,transmission_fragment:bm,transmission_pars_fragment:Em,uv_pars_fragment:wm,uv_pars_vertex:Tm,uv_vertex:Am,worldpos_vertex:Rm,background_vert:Cm,background_frag:Pm,backgroundCube_vert:Lm,backgroundCube_frag:Dm,cube_vert:Im,cube_frag:Um,depth_vert:Nm,depth_frag:zm,distanceRGBA_vert:Om,distanceRGBA_frag:Fm,equirect_vert:Bm,equirect_frag:km,linedashed_vert:Hm,linedashed_frag:Gm,meshbasic_vert:Vm,meshbasic_frag:Wm,meshlambert_vert:Xm,meshlambert_frag:$m,meshmatcap_vert:qm,meshmatcap_frag:Ym,meshnormal_vert:jm,meshnormal_frag:Km,meshphong_vert:Jm,meshphong_frag:Zm,meshphysical_vert:Qm,meshphysical_frag:t0,meshtoon_vert:e0,meshtoon_frag:n0,points_vert:i0,points_frag:s0,shadow_vert:r0,shadow_frag:o0,sprite_vert:a0,sprite_frag:c0},lt={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},In={basic:{uniforms:Ze([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:Ze([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new qt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:Ze([lt.common,lt.specularmap,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,lt.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:Ze([lt.common,lt.envmap,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.roughnessmap,lt.metalnessmap,lt.fog,lt.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:Ze([lt.common,lt.aomap,lt.lightmap,lt.emissivemap,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.gradientmap,lt.fog,lt.lights,{emissive:{value:new qt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:Ze([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,lt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:Ze([lt.points,lt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:Ze([lt.common,lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:Ze([lt.common,lt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:Ze([lt.common,lt.bumpmap,lt.normalmap,lt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:Ze([lt.sprite,lt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:Ze([lt.common,lt.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:Ze([lt.lights,lt.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};In.physical={uniforms:Ze([In.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const kr={r:0,b:0,g:0};function l0(i,t,e,n,s,r,o){const a=new qt(0);let c=r===!0?0:1,h,l,u=null,f=0,p=null;function _(m,d){let v=!1,x=d.isScene===!0?d.background:null;x&&x.isTexture&&(x=(d.backgroundBlurriness>0?e:t).get(x)),x===null?g(a,c):x&&x.isColor&&(g(x,1),v=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===ho)?(l===void 0&&(l=new Ht(new Fn(1,1,1),new Bi({name:"BackgroundCubeMaterial",uniforms:Ds(In.backgroundCube.uniforms),vertexShader:In.backgroundCube.vertexShader,fragmentShader:In.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(C,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),l.material.uniforms.envMap.value=x,l.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,l.material.toneMapped=he.getTransfer(x.colorSpace)!==pe,(u!==x||f!==x.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,f=x.version,p=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null)):x&&x.isTexture&&(h===void 0&&(h=new Ht(new Mi(2,2),new Bi({name:"BackgroundMaterial",uniforms:Ds(In.background.uniforms),vertexShader:In.background.vertexShader,fragmentShader:In.background.fragmentShader,side:xi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=x,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=he.getTransfer(x.colorSpace)!==pe,x.matrixAutoUpdate===!0&&x.updateMatrix(),h.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,f=x.version,p=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null))}function g(m,d){m.getRGB(kr,Jh(i)),n.buffers.color.setClear(kr.r,kr.g,kr.b,d,o)}return{getClearColor:function(){return a},setClearColor:function(m,d=1){a.set(m),c=d,g(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,g(a,c)},render:_}}function h0(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=m(null);let h=c,l=!1;function u(I,F,W,Y,$){let q=!1;if(o){const j=g(Y,W,F);h!==j&&(h=j,p(h.object)),q=d(I,Y,W,$),q&&v(I,Y,W,$)}else{const j=F.wireframe===!0;(h.geometry!==Y.id||h.program!==W.id||h.wireframe!==j)&&(h.geometry=Y.id,h.program=W.id,h.wireframe=j,q=!0)}$!==null&&e.update($,i.ELEMENT_ARRAY_BUFFER),(q||l)&&(l=!1,U(I,F,W,Y),$!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function p(I){return n.isWebGL2?i.bindVertexArray(I):r.bindVertexArrayOES(I)}function _(I){return n.isWebGL2?i.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function g(I,F,W){const Y=W.wireframe===!0;let $=a[I.id];$===void 0&&($={},a[I.id]=$);let q=$[F.id];q===void 0&&(q={},$[F.id]=q);let j=q[Y];return j===void 0&&(j=m(f()),q[Y]=j),j}function m(I){const F=[],W=[],Y=[];for(let $=0;$<s;$++)F[$]=0,W[$]=0,Y[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:W,attributeDivisors:Y,object:I,attributes:{},index:null}}function d(I,F,W,Y){const $=h.attributes,q=F.attributes;let j=0;const ot=W.getAttributes();for(const ct in ot)if(ot[ct].location>=0){const J=$[ct];let mt=q[ct];if(mt===void 0&&(ct==="instanceMatrix"&&I.instanceMatrix&&(mt=I.instanceMatrix),ct==="instanceColor"&&I.instanceColor&&(mt=I.instanceColor)),J===void 0||J.attribute!==mt||mt&&J.data!==mt.data)return!0;j++}return h.attributesNum!==j||h.index!==Y}function v(I,F,W,Y){const $={},q=F.attributes;let j=0;const ot=W.getAttributes();for(const ct in ot)if(ot[ct].location>=0){let J=q[ct];J===void 0&&(ct==="instanceMatrix"&&I.instanceMatrix&&(J=I.instanceMatrix),ct==="instanceColor"&&I.instanceColor&&(J=I.instanceColor));const mt={};mt.attribute=J,J&&J.data&&(mt.data=J.data),$[ct]=mt,j++}h.attributes=$,h.attributesNum=j,h.index=Y}function x(){const I=h.newAttributes;for(let F=0,W=I.length;F<W;F++)I[F]=0}function M(I){C(I,0)}function C(I,F){const W=h.newAttributes,Y=h.enabledAttributes,$=h.attributeDivisors;W[I]=1,Y[I]===0&&(i.enableVertexAttribArray(I),Y[I]=1),$[I]!==F&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,F),$[I]=F)}function w(){const I=h.newAttributes,F=h.enabledAttributes;for(let W=0,Y=F.length;W<Y;W++)F[W]!==I[W]&&(i.disableVertexAttribArray(W),F[W]=0)}function A(I,F,W,Y,$,q,j){j===!0?i.vertexAttribIPointer(I,F,W,$,q):i.vertexAttribPointer(I,F,W,Y,$,q)}function U(I,F,W,Y){if(n.isWebGL2===!1&&(I.isInstancedMesh||Y.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const $=Y.attributes,q=W.getAttributes(),j=F.defaultAttributeValues;for(const ot in q){const ct=q[ot];if(ct.location>=0){let X=$[ot];if(X===void 0&&(ot==="instanceMatrix"&&I.instanceMatrix&&(X=I.instanceMatrix),ot==="instanceColor"&&I.instanceColor&&(X=I.instanceColor)),X!==void 0){const J=X.normalized,mt=X.itemSize,Et=e.get(X);if(Et===void 0)continue;const St=Et.buffer,Bt=Et.type,kt=Et.bytesPerElement,Lt=n.isWebGL2===!0&&(Bt===i.INT||Bt===i.UNSIGNED_INT||X.gpuType===Nh);if(X.isInterleavedBufferAttribute){const Zt=X.data,O=Zt.stride,He=X.offset;if(Zt.isInstancedInterleavedBuffer){for(let Rt=0;Rt<ct.locationSize;Rt++)C(ct.location+Rt,Zt.meshPerAttribute);I.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=Zt.meshPerAttribute*Zt.count)}else for(let Rt=0;Rt<ct.locationSize;Rt++)M(ct.location+Rt);i.bindBuffer(i.ARRAY_BUFFER,St);for(let Rt=0;Rt<ct.locationSize;Rt++)A(ct.location+Rt,mt/ct.locationSize,Bt,J,O*kt,(He+mt/ct.locationSize*Rt)*kt,Lt)}else{if(X.isInstancedBufferAttribute){for(let Zt=0;Zt<ct.locationSize;Zt++)C(ct.location+Zt,X.meshPerAttribute);I.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Zt=0;Zt<ct.locationSize;Zt++)M(ct.location+Zt);i.bindBuffer(i.ARRAY_BUFFER,St);for(let Zt=0;Zt<ct.locationSize;Zt++)A(ct.location+Zt,mt/ct.locationSize,Bt,J,mt*kt,mt/ct.locationSize*Zt*kt,Lt)}}else if(j!==void 0){const J=j[ot];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(ct.location,J);break;case 3:i.vertexAttrib3fv(ct.location,J);break;case 4:i.vertexAttrib4fv(ct.location,J);break;default:i.vertexAttrib1fv(ct.location,J)}}}}w()}function y(){G();for(const I in a){const F=a[I];for(const W in F){const Y=F[W];for(const $ in Y)_(Y[$].object),delete Y[$];delete F[W]}delete a[I]}}function b(I){if(a[I.id]===void 0)return;const F=a[I.id];for(const W in F){const Y=F[W];for(const $ in Y)_(Y[$].object),delete Y[$];delete F[W]}delete a[I.id]}function H(I){for(const F in a){const W=a[F];if(W[I.id]===void 0)continue;const Y=W[I.id];for(const $ in Y)_(Y[$].object),delete Y[$];delete W[I.id]}}function G(){K(),l=!0,h!==c&&(h=c,p(h.object))}function K(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:G,resetDefaultState:K,dispose:y,releaseStatesOfGeometry:b,releaseStatesOfProgram:H,initAttributes:x,enableAttribute:M,disableUnusedAttributes:w}}function u0(i,t,e,n){const s=n.isWebGL2;let r;function o(l){r=l}function a(l,u){i.drawArrays(r,l,u),e.update(u,r,1)}function c(l,u,f){if(f===0)return;let p,_;if(s)p=i,_="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),_="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[_](r,l,u,f),e.update(u,r,f)}function h(l,u,f){if(f===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<f;_++)this.render(l[_],u[_]);else{p.multiDrawArraysWEBGL(r,l,0,u,0,f);let _=0;for(let g=0;g<f;g++)_+=u[g];e.update(_,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=h}function f0(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const h=o||t.has("WEBGL_draw_buffers"),l=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),d=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=f>0,M=o||t.has("OES_texture_float"),C=x&&M,w=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:l,maxTextures:u,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:_,maxAttributes:g,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:v,vertexTextures:x,floatFragmentTextures:M,floatVertexTextures:C,maxSamples:w}}function d0(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new fi,a=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=l(u,f,0)},this.setState=function(u,f,p){const _=u.clippingPlanes,g=u.clipIntersection,m=u.clipShadows,d=i.get(u);if(!s||_===null||_.length===0||r&&!m)r?l(null):h();else{const v=r?0:n,x=v*4;let M=d.clippingState||null;c.value=M,M=l(_,f,x,p);for(let C=0;C!==x;++C)M[C]=e[C];d.clippingState=M,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=v}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function l(u,f,p,_){const g=u!==null?u.length:0;let m=null;if(g!==0){if(m=c.value,_!==!0||m===null){const d=p+g*4,v=f.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<d)&&(m=new Float32Array(d));for(let x=0,M=p;x!==g;++x,M+=4)o.copy(u[x]).applyMatrix4(v,a),o.normal.toArray(m,M),m[M+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function p0(i){let t=new WeakMap;function e(o,a){return a===Sa?o.mapping=Cs:a===ba&&(o.mapping=Ps),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Sa||a===ba)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const h=new Td(c.height/2);return h.fromEquirectangularTexture(i,o),t.set(o,h),o.addEventListener("dispose",s),e(h.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class eu extends Zh{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,o=r+h*this.view.width,a-=l*this.view.offsetY,c=a-l*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ss=4,El=[.125,.215,.35,.446,.526,.582],Di=20,ta=new eu,wl=new qt;let ea=null,na=0,ia=0;const Pi=(1+Math.sqrt(5))/2,fs=1/Pi,Tl=[new R(1,1,1),new R(-1,1,1),new R(1,1,-1),new R(-1,1,-1),new R(0,Pi,fs),new R(0,Pi,-fs),new R(fs,0,Pi),new R(-fs,0,Pi),new R(Pi,fs,0),new R(-Pi,fs,0)];class Al{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){ea=this._renderer.getRenderTarget(),na=this._renderer.getActiveCubeFace(),ia=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ea,na,ia),t.scissorTest=!1,Hr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Cs||t.mapping===Ps?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ea=this._renderer.getRenderTarget(),na=this._renderer.getActiveCubeFace(),ia=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:or,format:xn,colorSpace:ri,depthBuffer:!1},s=Rl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=m0(r)),this._blurMaterial=g0(r,t,e)}return s}_compileMaterial(t){const e=new Ht(this._lodPlanes[0],t);this._renderer.compile(e,ta)}_sceneToCubeUV(t,e,n,s){const a=new un(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,f=l.toneMapping;l.getClearColor(wl),l.toneMapping=gi,l.autoClear=!1;const p=new Qe({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1}),_=new Ht(new Fn,p);let g=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,g=!0):(p.color.copy(wl),g=!0);for(let d=0;d<6;d++){const v=d%3;v===0?(a.up.set(0,c[d],0),a.lookAt(h[d],0,0)):v===1?(a.up.set(0,0,c[d]),a.lookAt(0,h[d],0)):(a.up.set(0,c[d],0),a.lookAt(0,0,h[d]));const x=this._cubeSize;Hr(s,v*x,d>2?x:0,x,x),l.setRenderTarget(s),g&&l.render(_,a),l.render(t,a)}_.geometry.dispose(),_.material.dispose(),l.toneMapping=f,l.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Cs||t.mapping===Ps;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cl());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Ht(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;Hr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,ta)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Tl[(s-1)%Tl.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,h=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const l=3,u=new Ht(this._lodPlanes[s],h),f=h.uniforms,p=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Di-1),g=r/_,m=isFinite(r)?1+Math.floor(l*g):Di;m>Di&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Di}`);const d=[];let v=0;for(let A=0;A<Di;++A){const U=A/g,y=Math.exp(-U*U/2);d.push(y),A===0?v+=y:A<m&&(v+=2*y)}for(let A=0;A<d.length;A++)d[A]=d[A]/v;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:x}=this;f.dTheta.value=_,f.mipInt.value=x-n;const M=this._sizeLods[s],C=3*M*(s>x-Ss?s-x+Ss:0),w=4*(this._cubeSize-M);Hr(e,C,w,3*M,2*M),c.setRenderTarget(e),c.render(u,ta)}}function m0(i){const t=[],e=[],n=[];let s=i;const r=i-Ss+1+El.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-Ss?c=El[o-i+Ss-1]:o===0&&(c=0),n.push(c);const h=1/(a-2),l=-h,u=1+h,f=[l,l,u,l,u,u,l,l,u,u,l,u],p=6,_=6,g=3,m=2,d=1,v=new Float32Array(g*_*p),x=new Float32Array(m*_*p),M=new Float32Array(d*_*p);for(let w=0;w<p;w++){const A=w%3*2/3-1,U=w>2?0:-1,y=[A,U,0,A+2/3,U,0,A+2/3,U+1,0,A,U,0,A+2/3,U+1,0,A,U+1,0];v.set(y,g*_*w),x.set(f,m*_*w);const b=[w,w,w,w,w,w];M.set(b,d*_*w)}const C=new Te;C.setAttribute("position",new mn(v,g)),C.setAttribute("uv",new mn(x,m)),C.setAttribute("faceIndex",new mn(M,d)),t.push(C),s>Ss&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Rl(i,t,e){const n=new Fi(i,t,e);return n.texture.mapping=ho,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Hr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function g0(i,t,e){const n=new Float32Array(Di),s=new R(0,1,0);return new Bi({name:"SphericalGaussianBlur",defines:{n:Di,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ga(),fragmentShader:`

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
		`,blending:mi,depthTest:!1,depthWrite:!1})}function Cl(){return new Bi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ga(),fragmentShader:`

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
		`,blending:mi,depthTest:!1,depthWrite:!1})}function Pl(){return new Bi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ga(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function Ga(){return`

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
	`}function _0(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,h=c===Sa||c===ba,l=c===Cs||c===Ps;if(h||l)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new Al(i)),u=h?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{const u=a.image;if(h&&u&&u.height>0||l&&u&&s(u)){e===null&&(e=new Al(i));const f=h?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let c=0;const h=6;for(let l=0;l<h;l++)a[l]!==void 0&&c++;return c===h}function r(a){const c=a.target;c.removeEventListener("dispose",r);const h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function v0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function x0(i,t,e,n){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const _ in f.attributes)t.remove(f.attributes[_]);for(const _ in f.morphAttributes){const g=f.morphAttributes[_];for(let m=0,d=g.length;m<d;m++)t.remove(g[m])}f.removeEventListener("dispose",o),delete s[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const _ in f)t.update(f[_],i.ARRAY_BUFFER);const p=u.morphAttributes;for(const _ in p){const g=p[_];for(let m=0,d=g.length;m<d;m++)t.update(g[m],i.ARRAY_BUFFER)}}function h(u){const f=[],p=u.index,_=u.attributes.position;let g=0;if(p!==null){const v=p.array;g=p.version;for(let x=0,M=v.length;x<M;x+=3){const C=v[x+0],w=v[x+1],A=v[x+2];f.push(C,w,w,A,A,C)}}else if(_!==void 0){const v=_.array;g=_.version;for(let x=0,M=v.length/3-1;x<M;x+=3){const C=x+0,w=x+1,A=x+2;f.push(C,w,w,A,A,C)}}else return;const m=new(Wh(f)?Kh:jh)(f,1);m.version=g;const d=r.get(u);d&&t.remove(d),r.set(u,m)}function l(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:l}}function M0(i,t,e,n){const s=n.isWebGL2;let r;function o(p){r=p}let a,c;function h(p){a=p.type,c=p.bytesPerElement}function l(p,_){i.drawElements(r,_,a,p*c),e.update(_,r,1)}function u(p,_,g){if(g===0)return;let m,d;if(s)m=i,d="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[d](r,_,a,p*c,g),e.update(_,r,g)}function f(p,_,g){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<g;d++)this.render(p[d]/c,_[d]);else{m.multiDrawElementsWEBGL(r,_,0,a,p,0,g);let d=0;for(let v=0;v<g;v++)d+=_[v];e.update(d,r,1)}}this.setMode=o,this.setIndex=h,this.render=l,this.renderInstances=u,this.renderMultiDraw=f}function y0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function S0(i,t){return i[0]-t[0]}function b0(i,t){return Math.abs(t[1])-Math.abs(i[1])}function E0(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,o=new ge,a=[];for(let h=0;h<8;h++)a[h]=[h,0];function c(h,l,u){const f=h.morphTargetInfluences;if(t.isWebGL2===!0){const _=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,g=_!==void 0?_.length:0;let m=r.get(l);if(m===void 0||m.count!==g){let F=function(){K.dispose(),r.delete(l),l.removeEventListener("dispose",F)};var p=F;m!==void 0&&m.texture.dispose();const x=l.morphAttributes.position!==void 0,M=l.morphAttributes.normal!==void 0,C=l.morphAttributes.color!==void 0,w=l.morphAttributes.position||[],A=l.morphAttributes.normal||[],U=l.morphAttributes.color||[];let y=0;x===!0&&(y=1),M===!0&&(y=2),C===!0&&(y=3);let b=l.attributes.position.count*y,H=1;b>t.maxTextureSize&&(H=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const G=new Float32Array(b*H*4*g),K=new qh(G,b,H,g);K.type=pi,K.needsUpdate=!0;const I=y*4;for(let W=0;W<g;W++){const Y=w[W],$=A[W],q=U[W],j=b*H*4*W;for(let ot=0;ot<Y.count;ot++){const ct=ot*I;x===!0&&(o.fromBufferAttribute(Y,ot),G[j+ct+0]=o.x,G[j+ct+1]=o.y,G[j+ct+2]=o.z,G[j+ct+3]=0),M===!0&&(o.fromBufferAttribute($,ot),G[j+ct+4]=o.x,G[j+ct+5]=o.y,G[j+ct+6]=o.z,G[j+ct+7]=0),C===!0&&(o.fromBufferAttribute(q,ot),G[j+ct+8]=o.x,G[j+ct+9]=o.y,G[j+ct+10]=o.z,G[j+ct+11]=q.itemSize===4?o.w:1)}}m={count:g,texture:K,size:new ht(b,H)},r.set(l,m),l.addEventListener("dispose",F)}let d=0;for(let x=0;x<f.length;x++)d+=f[x];const v=l.morphTargetsRelative?1:1-d;u.getUniforms().setValue(i,"morphTargetBaseInfluence",v),u.getUniforms().setValue(i,"morphTargetInfluences",f),u.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}else{const _=f===void 0?0:f.length;let g=n[l.id];if(g===void 0||g.length!==_){g=[];for(let M=0;M<_;M++)g[M]=[M,0];n[l.id]=g}for(let M=0;M<_;M++){const C=g[M];C[0]=M,C[1]=f[M]}g.sort(b0);for(let M=0;M<8;M++)M<_&&g[M][1]?(a[M][0]=g[M][0],a[M][1]=g[M][1]):(a[M][0]=Number.MAX_SAFE_INTEGER,a[M][1]=0);a.sort(S0);const m=l.morphAttributes.position,d=l.morphAttributes.normal;let v=0;for(let M=0;M<8;M++){const C=a[M],w=C[0],A=C[1];w!==Number.MAX_SAFE_INTEGER&&A?(m&&l.getAttribute("morphTarget"+M)!==m[w]&&l.setAttribute("morphTarget"+M,m[w]),d&&l.getAttribute("morphNormal"+M)!==d[w]&&l.setAttribute("morphNormal"+M,d[w]),s[M]=A,v+=A):(m&&l.hasAttribute("morphTarget"+M)===!0&&l.deleteAttribute("morphTarget"+M),d&&l.hasAttribute("morphNormal"+M)===!0&&l.deleteAttribute("morphNormal"+M),s[M]=0)}const x=l.morphTargetsRelative?1:1-v;u.getUniforms().setValue(i,"morphTargetBaseInfluence",x),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function w0(i,t,e,n){let s=new WeakMap;function r(c){const h=n.render.frame,l=c.geometry,u=t.get(c,l);if(s.get(u)!==h&&(t.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function o(){s=new WeakMap}function a(c){const h=c.target;h.removeEventListener("dispose",a),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:o}}class nu extends en{constructor(t,e,n,s,r,o,a,c,h,l){if(l=l!==void 0?l:Ui,l!==Ui&&l!==Ls)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&l===Ui&&(n=di),n===void 0&&l===Ls&&(n=Ii),super(null,s,r,o,a,c,l,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ve,this.minFilter=c!==void 0?c:Ve,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const iu=new en,su=new nu(1,1);su.compareFunction=Vh;const ru=new qh,ou=new ld,au=new Qh,Ll=[],Dl=[],Il=new Float32Array(16),Ul=new Float32Array(9),Nl=new Float32Array(4);function Fs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Ll[s];if(r===void 0&&(r=new Float32Array(s),Ll[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Ie(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ue(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function po(i,t){let e=Dl[t];e===void 0&&(e=new Int32Array(t),Dl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function T0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function A0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2fv(this.addr,t),Ue(e,t)}}function R0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;i.uniform3fv(this.addr,t),Ue(e,t)}}function C0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4fv(this.addr,t),Ue(e,t)}}function P0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,n))return;Nl.set(n),i.uniformMatrix2fv(this.addr,!1,Nl),Ue(e,n)}}function L0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,n))return;Ul.set(n),i.uniformMatrix3fv(this.addr,!1,Ul),Ue(e,n)}}function D0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ue(e,t)}else{if(Ie(e,n))return;Il.set(n),i.uniformMatrix4fv(this.addr,!1,Il),Ue(e,n)}}function I0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function U0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2iv(this.addr,t),Ue(e,t)}}function N0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;i.uniform3iv(this.addr,t),Ue(e,t)}}function z0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4iv(this.addr,t),Ue(e,t)}}function O0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function F0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2uiv(this.addr,t),Ue(e,t)}}function B0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;i.uniform3uiv(this.addr,t),Ue(e,t)}}function k0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4uiv(this.addr,t),Ue(e,t)}}function H0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?su:iu;e.setTexture2D(t||r,s)}function G0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||ou,s)}function V0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||au,s)}function W0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||ru,s)}function X0(i){switch(i){case 5126:return T0;case 35664:return A0;case 35665:return R0;case 35666:return C0;case 35674:return P0;case 35675:return L0;case 35676:return D0;case 5124:case 35670:return I0;case 35667:case 35671:return U0;case 35668:case 35672:return N0;case 35669:case 35673:return z0;case 5125:return O0;case 36294:return F0;case 36295:return B0;case 36296:return k0;case 35678:case 36198:case 36298:case 36306:case 35682:return H0;case 35679:case 36299:case 36307:return G0;case 35680:case 36300:case 36308:case 36293:return V0;case 36289:case 36303:case 36311:case 36292:return W0}}function $0(i,t){i.uniform1fv(this.addr,t)}function q0(i,t){const e=Fs(t,this.size,2);i.uniform2fv(this.addr,e)}function Y0(i,t){const e=Fs(t,this.size,3);i.uniform3fv(this.addr,e)}function j0(i,t){const e=Fs(t,this.size,4);i.uniform4fv(this.addr,e)}function K0(i,t){const e=Fs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function J0(i,t){const e=Fs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Z0(i,t){const e=Fs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Q0(i,t){i.uniform1iv(this.addr,t)}function tg(i,t){i.uniform2iv(this.addr,t)}function eg(i,t){i.uniform3iv(this.addr,t)}function ng(i,t){i.uniform4iv(this.addr,t)}function ig(i,t){i.uniform1uiv(this.addr,t)}function sg(i,t){i.uniform2uiv(this.addr,t)}function rg(i,t){i.uniform3uiv(this.addr,t)}function og(i,t){i.uniform4uiv(this.addr,t)}function ag(i,t,e){const n=this.cache,s=t.length,r=po(e,s);Ie(n,r)||(i.uniform1iv(this.addr,r),Ue(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||iu,r[o])}function cg(i,t,e){const n=this.cache,s=t.length,r=po(e,s);Ie(n,r)||(i.uniform1iv(this.addr,r),Ue(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||ou,r[o])}function lg(i,t,e){const n=this.cache,s=t.length,r=po(e,s);Ie(n,r)||(i.uniform1iv(this.addr,r),Ue(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||au,r[o])}function hg(i,t,e){const n=this.cache,s=t.length,r=po(e,s);Ie(n,r)||(i.uniform1iv(this.addr,r),Ue(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||ru,r[o])}function ug(i){switch(i){case 5126:return $0;case 35664:return q0;case 35665:return Y0;case 35666:return j0;case 35674:return K0;case 35675:return J0;case 35676:return Z0;case 5124:case 35670:return Q0;case 35667:case 35671:return tg;case 35668:case 35672:return eg;case 35669:case 35673:return ng;case 5125:return ig;case 36294:return sg;case 36295:return rg;case 36296:return og;case 35678:case 36198:case 36298:case 36306:case 35682:return ag;case 35679:case 36299:case 36307:return cg;case 35680:case 36300:case 36308:case 36293:return lg;case 36289:case 36303:case 36311:case 36292:return hg}}class fg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=X0(e.type)}}class dg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ug(e.type)}}class pg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const sa=/(\w+)(\])?(\[|\.)?/g;function zl(i,t){i.seq.push(t),i.map[t.id]=t}function mg(i,t,e){const n=i.name,s=n.length;for(sa.lastIndex=0;;){const r=sa.exec(n),o=sa.lastIndex;let a=r[1];const c=r[2]==="]",h=r[3];if(c&&(a=a|0),h===void 0||h==="["&&o+2===s){zl(e,h===void 0?new fg(a,i,t):new dg(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new pg(a),zl(e,u)),e=u}}}class Yr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);mg(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Ol(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const gg=37297;let _g=0;function vg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function xg(i){const t=he.getPrimaries(he.workingColorSpace),e=he.getPrimaries(i);let n;switch(t===e?n="":t===eo&&e===to?n="LinearDisplayP3ToLinearSRGB":t===to&&e===eo&&(n="LinearSRGBToLinearDisplayP3"),i){case ri:case uo:return[n,"LinearTransferOETF"];case Ce:case Ba:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Fl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+vg(i.getShaderSource(t),o)}else return s}function Mg(i,t){const e=xg(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function yg(i,t){let e;switch(t){case Lf:e="Linear";break;case Df:e="Reinhard";break;case If:e="OptimizedCineon";break;case Ih:e="ACESFilmic";break;case Nf:e="AgX";break;case Uf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Sg(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(bs).join(`
`)}function bg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(bs).join(`
`)}function Eg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function wg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function bs(i){return i!==""}function Bl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function kl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Tg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ra(i){return i.replace(Tg,Rg)}const Ag=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Rg(i,t){let e=$t[t];if(e===void 0){const n=Ag.get(t);if(n!==void 0)e=$t[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ra(e)}const Cg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Hl(i){return i.replace(Cg,Pg)}function Pg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Gl(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Lg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Lh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Dh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Jn&&(t="SHADOWMAP_TYPE_VSM"),t}function Dg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Cs:case Ps:t="ENVMAP_TYPE_CUBE";break;case ho:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Ig(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ps:t="ENVMAP_MODE_REFRACTION";break}return t}function Ug(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case za:t="ENVMAP_BLENDING_MULTIPLY";break;case Cf:t="ENVMAP_BLENDING_MIX";break;case Pf:t="ENVMAP_BLENDING_ADD";break}return t}function Ng(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function zg(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=Lg(e),h=Dg(e),l=Ig(e),u=Ug(e),f=Ng(e),p=e.isWebGL2?"":Sg(e),_=bg(e),g=Eg(r),m=s.createProgram();let d,v,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(bs).join(`
`),d.length>0&&(d+=`
`),v=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(bs).join(`
`),v.length>0&&(v+=`
`)):(d=[Gl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(bs).join(`
`),v=[p,Gl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==gi?"#define TONE_MAPPING":"",e.toneMapping!==gi?$t.tonemapping_pars_fragment:"",e.toneMapping!==gi?yg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,Mg("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(bs).join(`
`)),o=Ra(o),o=Bl(o,e),o=kl(o,e),a=Ra(a),a=Bl(a,e),a=kl(a,e),o=Hl(o),a=Hl(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,d=[_,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===ol?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ol?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const M=x+d+o,C=x+v+a,w=Ol(s,s.VERTEX_SHADER,M),A=Ol(s,s.FRAGMENT_SHADER,C);s.attachShader(m,w),s.attachShader(m,A),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function U(G){if(i.debug.checkShaderErrors){const K=s.getProgramInfoLog(m).trim(),I=s.getShaderInfoLog(w).trim(),F=s.getShaderInfoLog(A).trim();let W=!0,Y=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,w,A);else{const $=Fl(s,w,"vertex"),q=Fl(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+K+`
`+$+`
`+q)}else K!==""?console.warn("THREE.WebGLProgram: Program Info Log:",K):(I===""||F==="")&&(Y=!1);Y&&(G.diagnostics={runnable:W,programLog:K,vertexShader:{log:I,prefix:d},fragmentShader:{log:F,prefix:v}})}s.deleteShader(w),s.deleteShader(A),y=new Yr(s,m),b=wg(s,m)}let y;this.getUniforms=function(){return y===void 0&&U(this),y};let b;this.getAttributes=function(){return b===void 0&&U(this),b};let H=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return H===!1&&(H=s.getProgramParameter(m,gg)),H},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=_g++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=w,this.fragmentShader=A,this}let Og=0;class Fg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Bg(t),e.set(t,n)),n}}class Bg{constructor(t){this.id=Og++,this.code=t,this.usedTimes=0}}function kg(i,t,e,n,s,r,o){const a=new ka,c=new Fg,h=[],l=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return y===0?"uv":`uv${y}`}function m(y,b,H,G,K){const I=G.fog,F=K.geometry,W=y.isMeshStandardMaterial?G.environment:null,Y=(y.isMeshStandardMaterial?e:t).get(y.envMap||W),$=Y&&Y.mapping===ho?Y.image.height:null,q=_[y.type];y.precision!==null&&(p=s.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));const j=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ot=j!==void 0?j.length:0;let ct=0;F.morphAttributes.position!==void 0&&(ct=1),F.morphAttributes.normal!==void 0&&(ct=2),F.morphAttributes.color!==void 0&&(ct=3);let X,J,mt,Et;if(q){const be=In[q];X=be.vertexShader,J=be.fragmentShader}else X=y.vertexShader,J=y.fragmentShader,c.update(y),mt=c.getVertexShaderID(y),Et=c.getFragmentShaderID(y);const St=i.getRenderTarget(),Bt=K.isInstancedMesh===!0,kt=K.isBatchedMesh===!0,Lt=!!y.map,Zt=!!y.matcap,O=!!Y,He=!!y.aoMap,Rt=!!y.lightMap,Ut=!!y.bumpMap,Mt=!!y.normalMap,de=!!y.displacementMap,Vt=!!y.emissiveMap,T=!!y.metalnessMap,S=!!y.roughnessMap,z=y.anisotropy>0,nt=y.clearcoat>0,Q=y.iridescence>0,it=y.sheen>0,yt=y.transmission>0,dt=z&&!!y.anisotropyMap,xt=nt&&!!y.clearcoatMap,Pt=nt&&!!y.clearcoatNormalMap,Wt=nt&&!!y.clearcoatRoughnessMap,Z=Q&&!!y.iridescenceMap,re=Q&&!!y.iridescenceThicknessMap,Yt=it&&!!y.sheenColorMap,Nt=it&&!!y.sheenRoughnessMap,At=!!y.specularMap,gt=!!y.specularColorMap,P=!!y.specularIntensityMap,st=yt&&!!y.transmissionMap,bt=yt&&!!y.thicknessMap,vt=!!y.gradientMap,tt=!!y.alphaMap,D=y.alphaTest>0,rt=!!y.alphaHash,ft=!!y.extensions,Dt=!!F.attributes.uv1,Ct=!!F.attributes.uv2,Qt=!!F.attributes.uv3;let te=gi;return y.toneMapped&&(St===null||St.isXRRenderTarget===!0)&&(te=i.toneMapping),{isWebGL2:l,shaderID:q,shaderType:y.type,shaderName:y.name,vertexShader:X,fragmentShader:J,defines:y.defines,customVertexShaderID:mt,customFragmentShaderID:Et,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:kt,instancing:Bt,instancingColor:Bt&&K.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:St===null?i.outputColorSpace:St.isXRRenderTarget===!0?St.texture.colorSpace:ri,map:Lt,matcap:Zt,envMap:O,envMapMode:O&&Y.mapping,envMapCubeUVHeight:$,aoMap:He,lightMap:Rt,bumpMap:Ut,normalMap:Mt,displacementMap:f&&de,emissiveMap:Vt,normalMapObjectSpace:Mt&&y.normalMapType===qf,normalMapTangentSpace:Mt&&y.normalMapType===Fa,metalnessMap:T,roughnessMap:S,anisotropy:z,anisotropyMap:dt,clearcoat:nt,clearcoatMap:xt,clearcoatNormalMap:Pt,clearcoatRoughnessMap:Wt,iridescence:Q,iridescenceMap:Z,iridescenceThicknessMap:re,sheen:it,sheenColorMap:Yt,sheenRoughnessMap:Nt,specularMap:At,specularColorMap:gt,specularIntensityMap:P,transmission:yt,transmissionMap:st,thicknessMap:bt,gradientMap:vt,opaque:y.transparent===!1&&y.blending===Es,alphaMap:tt,alphaTest:D,alphaHash:rt,combine:y.combine,mapUv:Lt&&g(y.map.channel),aoMapUv:He&&g(y.aoMap.channel),lightMapUv:Rt&&g(y.lightMap.channel),bumpMapUv:Ut&&g(y.bumpMap.channel),normalMapUv:Mt&&g(y.normalMap.channel),displacementMapUv:de&&g(y.displacementMap.channel),emissiveMapUv:Vt&&g(y.emissiveMap.channel),metalnessMapUv:T&&g(y.metalnessMap.channel),roughnessMapUv:S&&g(y.roughnessMap.channel),anisotropyMapUv:dt&&g(y.anisotropyMap.channel),clearcoatMapUv:xt&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:Pt&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Wt&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Z&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:re&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:Yt&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&g(y.sheenRoughnessMap.channel),specularMapUv:At&&g(y.specularMap.channel),specularColorMapUv:gt&&g(y.specularColorMap.channel),specularIntensityMapUv:P&&g(y.specularIntensityMap.channel),transmissionMapUv:st&&g(y.transmissionMap.channel),thicknessMapUv:bt&&g(y.thicknessMap.channel),alphaMapUv:tt&&g(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Mt||z),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Dt,vertexUv2s:Ct,vertexUv3s:Qt,pointsUvs:K.isPoints===!0&&!!F.attributes.uv&&(Lt||tt),fog:!!I,useFog:y.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:K.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:ot,morphTextureStride:ct,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&H.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Lt&&y.map.isVideoTexture===!0&&he.getTransfer(y.map.colorSpace)===pe,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===dn,flipSided:y.side===rn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:ft&&y.extensions.derivatives===!0,extensionFragDepth:ft&&y.extensions.fragDepth===!0,extensionDrawBuffers:ft&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:ft&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ft&&y.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:l||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:l||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:l||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function d(y){const b=[];if(y.shaderID?b.push(y.shaderID):(b.push(y.customVertexShaderID),b.push(y.customFragmentShaderID)),y.defines!==void 0)for(const H in y.defines)b.push(H),b.push(y.defines[H]);return y.isRawShaderMaterial===!1&&(v(b,y),x(b,y),b.push(i.outputColorSpace)),b.push(y.customProgramCacheKey),b.join()}function v(y,b){y.push(b.precision),y.push(b.outputColorSpace),y.push(b.envMapMode),y.push(b.envMapCubeUVHeight),y.push(b.mapUv),y.push(b.alphaMapUv),y.push(b.lightMapUv),y.push(b.aoMapUv),y.push(b.bumpMapUv),y.push(b.normalMapUv),y.push(b.displacementMapUv),y.push(b.emissiveMapUv),y.push(b.metalnessMapUv),y.push(b.roughnessMapUv),y.push(b.anisotropyMapUv),y.push(b.clearcoatMapUv),y.push(b.clearcoatNormalMapUv),y.push(b.clearcoatRoughnessMapUv),y.push(b.iridescenceMapUv),y.push(b.iridescenceThicknessMapUv),y.push(b.sheenColorMapUv),y.push(b.sheenRoughnessMapUv),y.push(b.specularMapUv),y.push(b.specularColorMapUv),y.push(b.specularIntensityMapUv),y.push(b.transmissionMapUv),y.push(b.thicknessMapUv),y.push(b.combine),y.push(b.fogExp2),y.push(b.sizeAttenuation),y.push(b.morphTargetsCount),y.push(b.morphAttributeCount),y.push(b.numDirLights),y.push(b.numPointLights),y.push(b.numSpotLights),y.push(b.numSpotLightMaps),y.push(b.numHemiLights),y.push(b.numRectAreaLights),y.push(b.numDirLightShadows),y.push(b.numPointLightShadows),y.push(b.numSpotLightShadows),y.push(b.numSpotLightShadowsWithMaps),y.push(b.numLightProbes),y.push(b.shadowMapType),y.push(b.toneMapping),y.push(b.numClippingPlanes),y.push(b.numClipIntersection),y.push(b.depthPacking)}function x(y,b){a.disableAll(),b.isWebGL2&&a.enable(0),b.supportsVertexTextures&&a.enable(1),b.instancing&&a.enable(2),b.instancingColor&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),y.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.skinning&&a.enable(4),b.morphTargets&&a.enable(5),b.morphNormals&&a.enable(6),b.morphColors&&a.enable(7),b.premultipliedAlpha&&a.enable(8),b.shadowMapEnabled&&a.enable(9),b.useLegacyLights&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),y.push(a.mask)}function M(y){const b=_[y.type];let H;if(b){const G=In[b];H=Sd.clone(G.uniforms)}else H=y.uniforms;return H}function C(y,b){let H;for(let G=0,K=h.length;G<K;G++){const I=h[G];if(I.cacheKey===b){H=I,++H.usedTimes;break}}return H===void 0&&(H=new zg(i,b,y,r),h.push(H)),H}function w(y){if(--y.usedTimes===0){const b=h.indexOf(y);h[b]=h[h.length-1],h.pop(),y.destroy()}}function A(y){c.remove(y)}function U(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:M,acquireProgram:C,releaseProgram:w,releaseShaderCache:A,programs:h,dispose:U}}function Hg(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function Gg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Vl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Wl(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,f,p,_,g,m){let d=i[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:_,renderOrder:u.renderOrder,z:g,group:m},i[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=_,d.renderOrder=u.renderOrder,d.z=g,d.group=m),t++,d}function a(u,f,p,_,g,m){const d=o(u,f,p,_,g,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):e.push(d)}function c(u,f,p,_,g,m){const d=o(u,f,p,_,g,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function h(u,f){e.length>1&&e.sort(u||Gg),n.length>1&&n.sort(f||Vl),s.length>1&&s.sort(f||Vl)}function l(){for(let u=t,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:l,sort:h}}function Vg(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Wl,i.set(n,[o])):s>=r.length?(o=new Wl,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Wg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new qt};break;case"SpotLight":e={position:new R,direction:new R,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function Xg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let $g=0;function qg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Yg(i,t){const e=new Wg,n=Xg(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)s.probe.push(new R);const r=new R,o=new le,a=new le;function c(l,u){let f=0,p=0,_=0;for(let G=0;G<9;G++)s.probe[G].set(0,0,0);let g=0,m=0,d=0,v=0,x=0,M=0,C=0,w=0,A=0,U=0,y=0;l.sort(qg);const b=u===!0?Math.PI:1;for(let G=0,K=l.length;G<K;G++){const I=l[G],F=I.color,W=I.intensity,Y=I.distance,$=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)f+=F.r*W*b,p+=F.g*W*b,_+=F.b*W*b;else if(I.isLightProbe){for(let q=0;q<9;q++)s.probe[q].addScaledVector(I.sh.coefficients[q],W);y++}else if(I.isDirectionalLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*b),I.castShadow){const j=I.shadow,ot=n.get(I);ot.shadowBias=j.bias,ot.shadowNormalBias=j.normalBias,ot.shadowRadius=j.radius,ot.shadowMapSize=j.mapSize,s.directionalShadow[g]=ot,s.directionalShadowMap[g]=$,s.directionalShadowMatrix[g]=I.shadow.matrix,M++}s.directional[g]=q,g++}else if(I.isSpotLight){const q=e.get(I);q.position.setFromMatrixPosition(I.matrixWorld),q.color.copy(F).multiplyScalar(W*b),q.distance=Y,q.coneCos=Math.cos(I.angle),q.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),q.decay=I.decay,s.spot[d]=q;const j=I.shadow;if(I.map&&(s.spotLightMap[A]=I.map,A++,j.updateMatrices(I),I.castShadow&&U++),s.spotLightMatrix[d]=j.matrix,I.castShadow){const ot=n.get(I);ot.shadowBias=j.bias,ot.shadowNormalBias=j.normalBias,ot.shadowRadius=j.radius,ot.shadowMapSize=j.mapSize,s.spotShadow[d]=ot,s.spotShadowMap[d]=$,w++}d++}else if(I.isRectAreaLight){const q=e.get(I);q.color.copy(F).multiplyScalar(W),q.halfWidth.set(I.width*.5,0,0),q.halfHeight.set(0,I.height*.5,0),s.rectArea[v]=q,v++}else if(I.isPointLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*b),q.distance=I.distance,q.decay=I.decay,I.castShadow){const j=I.shadow,ot=n.get(I);ot.shadowBias=j.bias,ot.shadowNormalBias=j.normalBias,ot.shadowRadius=j.radius,ot.shadowMapSize=j.mapSize,ot.shadowCameraNear=j.camera.near,ot.shadowCameraFar=j.camera.far,s.pointShadow[m]=ot,s.pointShadowMap[m]=$,s.pointShadowMatrix[m]=I.shadow.matrix,C++}s.point[m]=q,m++}else if(I.isHemisphereLight){const q=e.get(I);q.skyColor.copy(I.color).multiplyScalar(W*b),q.groundColor.copy(I.groundColor).multiplyScalar(W*b),s.hemi[x]=q,x++}}v>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_FLOAT_1,s.rectAreaLTC2=lt.LTC_FLOAT_2):(s.rectAreaLTC1=lt.LTC_HALF_1,s.rectAreaLTC2=lt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_FLOAT_1,s.rectAreaLTC2=lt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=lt.LTC_HALF_1,s.rectAreaLTC2=lt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=p,s.ambient[2]=_;const H=s.hash;(H.directionalLength!==g||H.pointLength!==m||H.spotLength!==d||H.rectAreaLength!==v||H.hemiLength!==x||H.numDirectionalShadows!==M||H.numPointShadows!==C||H.numSpotShadows!==w||H.numSpotMaps!==A||H.numLightProbes!==y)&&(s.directional.length=g,s.spot.length=d,s.rectArea.length=v,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=C,s.pointShadowMap.length=C,s.spotShadow.length=w,s.spotShadowMap.length=w,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=C,s.spotLightMatrix.length=w+A-U,s.spotLightMap.length=A,s.numSpotLightShadowsWithMaps=U,s.numLightProbes=y,H.directionalLength=g,H.pointLength=m,H.spotLength=d,H.rectAreaLength=v,H.hemiLength=x,H.numDirectionalShadows=M,H.numPointShadows=C,H.numSpotShadows=w,H.numSpotMaps=A,H.numLightProbes=y,s.version=$g++)}function h(l,u){let f=0,p=0,_=0,g=0,m=0;const d=u.matrixWorldInverse;for(let v=0,x=l.length;v<x;v++){const M=l[v];if(M.isDirectionalLight){const C=s.directional[f];C.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(d),f++}else if(M.isSpotLight){const C=s.spot[_];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(d),C.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(d),_++}else if(M.isRectAreaLight){const C=s.rectArea[g];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(d),a.identity(),o.copy(M.matrixWorld),o.premultiply(d),a.extractRotation(o),C.halfWidth.set(M.width*.5,0,0),C.halfHeight.set(0,M.height*.5,0),C.halfWidth.applyMatrix4(a),C.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const C=s.point[p];C.position.setFromMatrixPosition(M.matrixWorld),C.position.applyMatrix4(d),p++}else if(M.isHemisphereLight){const C=s.hemi[m];C.direction.setFromMatrixPosition(M.matrixWorld),C.direction.transformDirection(d),m++}}}return{setup:c,setupView:h,state:s}}function Xl(i,t){const e=new Yg(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(u){n.push(u)}function a(u){s.push(u)}function c(u){e.setup(n,u)}function h(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a}}function jg(i,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let c;return a===void 0?(c=new Xl(i,t),e.set(r,[c])):o>=a.length?(c=new Xl(i,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class Kg extends Wi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Jg extends Wi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Zg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Qg=`uniform sampler2D shadow_pass;
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
}`;function t_(i,t,e){let n=new Ha;const s=new ht,r=new ht,o=new ge,a=new Kg({depthPacking:$f}),c=new Jg,h={},l=e.maxTextureSize,u={[xi]:rn,[rn]:xi,[dn]:dn},f=new Bi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:Zg,fragmentShader:Qg}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const _=new Te;_.setAttribute("position",new mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Ht(_,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lh;let d=this.type;this.render=function(w,A,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const y=i.getRenderTarget(),b=i.getActiveCubeFace(),H=i.getActiveMipmapLevel(),G=i.state;G.setBlending(mi),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const K=d!==Jn&&this.type===Jn,I=d===Jn&&this.type!==Jn;for(let F=0,W=w.length;F<W;F++){const Y=w[F],$=Y.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const q=$.getFrameExtents();if(s.multiply(q),r.copy($.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(r.x=Math.floor(l/q.x),s.x=r.x*q.x,$.mapSize.x=r.x),s.y>l&&(r.y=Math.floor(l/q.y),s.y=r.y*q.y,$.mapSize.y=r.y)),$.map===null||K===!0||I===!0){const ot=this.type!==Jn?{minFilter:Ve,magFilter:Ve}:{};$.map!==null&&$.map.dispose(),$.map=new Fi(s.x,s.y,ot),$.map.texture.name=Y.name+".shadowMap",$.camera.updateProjectionMatrix()}i.setRenderTarget($.map),i.clear();const j=$.getViewportCount();for(let ot=0;ot<j;ot++){const ct=$.getViewport(ot);o.set(r.x*ct.x,r.y*ct.y,r.x*ct.z,r.y*ct.w),G.viewport(o),$.updateMatrices(Y,ot),n=$.getFrustum(),M(A,U,$.camera,Y,this.type)}$.isPointLightShadow!==!0&&this.type===Jn&&v($,U),$.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(y,b,H)};function v(w,A){const U=t.update(g);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Fi(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,U,f,g,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,U,p,g,null)}function x(w,A,U,y){let b=null;const H=U.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(H!==void 0)b=H;else if(b=U.isPointLight===!0?c:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const G=b.uuid,K=A.uuid;let I=h[G];I===void 0&&(I={},h[G]=I);let F=I[K];F===void 0&&(F=b.clone(),I[K]=F,A.addEventListener("dispose",C)),b=F}if(b.visible=A.visible,b.wireframe=A.wireframe,y===Jn?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:u[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,U.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const G=i.properties.get(b);G.light=U}return b}function M(w,A,U,y,b){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&b===Jn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,w.matrixWorld);const K=t.update(w),I=w.material;if(Array.isArray(I)){const F=K.groups;for(let W=0,Y=F.length;W<Y;W++){const $=F[W],q=I[$.materialIndex];if(q&&q.visible){const j=x(w,q,y,b);w.onBeforeShadow(i,w,A,U,K,j,$),i.renderBufferDirect(U,null,K,j,w,$),w.onAfterShadow(i,w,A,U,K,j,$)}}}else if(I.visible){const F=x(w,I,y,b);w.onBeforeShadow(i,w,A,U,K,F,null),i.renderBufferDirect(U,null,K,F,w,null),w.onAfterShadow(i,w,A,U,K,F,null)}}const G=w.children;for(let K=0,I=G.length;K<I;K++)M(G[K],A,U,y,b)}function C(w){w.target.removeEventListener("dispose",C);for(const U in h){const y=h[U],b=w.target.uuid;b in y&&(y[b].dispose(),delete y[b])}}}function e_(i,t,e){const n=e.isWebGL2;function s(){let D=!1;const rt=new ge;let ft=null;const Dt=new ge(0,0,0,0);return{setMask:function(Ct){ft!==Ct&&!D&&(i.colorMask(Ct,Ct,Ct,Ct),ft=Ct)},setLocked:function(Ct){D=Ct},setClear:function(Ct,Qt,te,ye,be){be===!0&&(Ct*=ye,Qt*=ye,te*=ye),rt.set(Ct,Qt,te,ye),Dt.equals(rt)===!1&&(i.clearColor(Ct,Qt,te,ye),Dt.copy(rt))},reset:function(){D=!1,ft=null,Dt.set(-1,0,0,0)}}}function r(){let D=!1,rt=null,ft=null,Dt=null;return{setTest:function(Ct){Ct?kt(i.DEPTH_TEST):Lt(i.DEPTH_TEST)},setMask:function(Ct){rt!==Ct&&!D&&(i.depthMask(Ct),rt=Ct)},setFunc:function(Ct){if(ft!==Ct){switch(Ct){case Sf:i.depthFunc(i.NEVER);break;case bf:i.depthFunc(i.ALWAYS);break;case Ef:i.depthFunc(i.LESS);break;case Jr:i.depthFunc(i.LEQUAL);break;case wf:i.depthFunc(i.EQUAL);break;case Tf:i.depthFunc(i.GEQUAL);break;case Af:i.depthFunc(i.GREATER);break;case Rf:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ft=Ct}},setLocked:function(Ct){D=Ct},setClear:function(Ct){Dt!==Ct&&(i.clearDepth(Ct),Dt=Ct)},reset:function(){D=!1,rt=null,ft=null,Dt=null}}}function o(){let D=!1,rt=null,ft=null,Dt=null,Ct=null,Qt=null,te=null,ye=null,be=null;return{setTest:function(ee){D||(ee?kt(i.STENCIL_TEST):Lt(i.STENCIL_TEST))},setMask:function(ee){rt!==ee&&!D&&(i.stencilMask(ee),rt=ee)},setFunc:function(ee,Ae,Ln){(ft!==ee||Dt!==Ae||Ct!==Ln)&&(i.stencilFunc(ee,Ae,Ln),ft=ee,Dt=Ae,Ct=Ln)},setOp:function(ee,Ae,Ln){(Qt!==ee||te!==Ae||ye!==Ln)&&(i.stencilOp(ee,Ae,Ln),Qt=ee,te=Ae,ye=Ln)},setLocked:function(ee){D=ee},setClear:function(ee){be!==ee&&(i.clearStencil(ee),be=ee)},reset:function(){D=!1,rt=null,ft=null,Dt=null,Ct=null,Qt=null,te=null,ye=null,be=null}}}const a=new s,c=new r,h=new o,l=new WeakMap,u=new WeakMap;let f={},p={},_=new WeakMap,g=[],m=null,d=!1,v=null,x=null,M=null,C=null,w=null,A=null,U=null,y=new qt(0,0,0),b=0,H=!1,G=null,K=null,I=null,F=null,W=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,q=0;const j=i.getParameter(i.VERSION);j.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(j)[1]),$=q>=1):j.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),$=q>=2);let ot=null,ct={};const X=i.getParameter(i.SCISSOR_BOX),J=i.getParameter(i.VIEWPORT),mt=new ge().fromArray(X),Et=new ge().fromArray(J);function St(D,rt,ft,Dt){const Ct=new Uint8Array(4),Qt=i.createTexture();i.bindTexture(D,Qt),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let te=0;te<ft;te++)n&&(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)?i.texImage3D(rt,0,i.RGBA,1,1,Dt,0,i.RGBA,i.UNSIGNED_BYTE,Ct):i.texImage2D(rt+te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ct);return Qt}const Bt={};Bt[i.TEXTURE_2D]=St(i.TEXTURE_2D,i.TEXTURE_2D,1),Bt[i.TEXTURE_CUBE_MAP]=St(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Bt[i.TEXTURE_2D_ARRAY]=St(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Bt[i.TEXTURE_3D]=St(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),h.setClear(0),kt(i.DEPTH_TEST),c.setFunc(Jr),Vt(!1),T(Tc),kt(i.CULL_FACE),Mt(mi);function kt(D){f[D]!==!0&&(i.enable(D),f[D]=!0)}function Lt(D){f[D]!==!1&&(i.disable(D),f[D]=!1)}function Zt(D,rt){return p[D]!==rt?(i.bindFramebuffer(D,rt),p[D]=rt,n&&(D===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=rt),D===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=rt)),!0):!1}function O(D,rt){let ft=g,Dt=!1;if(D)if(ft=_.get(rt),ft===void 0&&(ft=[],_.set(rt,ft)),D.isWebGLMultipleRenderTargets){const Ct=D.texture;if(ft.length!==Ct.length||ft[0]!==i.COLOR_ATTACHMENT0){for(let Qt=0,te=Ct.length;Qt<te;Qt++)ft[Qt]=i.COLOR_ATTACHMENT0+Qt;ft.length=Ct.length,Dt=!0}}else ft[0]!==i.COLOR_ATTACHMENT0&&(ft[0]=i.COLOR_ATTACHMENT0,Dt=!0);else ft[0]!==i.BACK&&(ft[0]=i.BACK,Dt=!0);Dt&&(e.isWebGL2?i.drawBuffers(ft):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ft))}function He(D){return m!==D?(i.useProgram(D),m=D,!0):!1}const Rt={[Li]:i.FUNC_ADD,[af]:i.FUNC_SUBTRACT,[cf]:i.FUNC_REVERSE_SUBTRACT};if(n)Rt[Pc]=i.MIN,Rt[Lc]=i.MAX;else{const D=t.get("EXT_blend_minmax");D!==null&&(Rt[Pc]=D.MIN_EXT,Rt[Lc]=D.MAX_EXT)}const Ut={[lf]:i.ZERO,[hf]:i.ONE,[uf]:i.SRC_COLOR,[Ma]:i.SRC_ALPHA,[_f]:i.SRC_ALPHA_SATURATE,[mf]:i.DST_COLOR,[df]:i.DST_ALPHA,[ff]:i.ONE_MINUS_SRC_COLOR,[ya]:i.ONE_MINUS_SRC_ALPHA,[gf]:i.ONE_MINUS_DST_COLOR,[pf]:i.ONE_MINUS_DST_ALPHA,[vf]:i.CONSTANT_COLOR,[xf]:i.ONE_MINUS_CONSTANT_COLOR,[Mf]:i.CONSTANT_ALPHA,[yf]:i.ONE_MINUS_CONSTANT_ALPHA};function Mt(D,rt,ft,Dt,Ct,Qt,te,ye,be,ee){if(D===mi){d===!0&&(Lt(i.BLEND),d=!1);return}if(d===!1&&(kt(i.BLEND),d=!0),D!==of){if(D!==v||ee!==H){if((x!==Li||w!==Li)&&(i.blendEquation(i.FUNC_ADD),x=Li,w=Li),ee)switch(D){case Es:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ac:i.blendFunc(i.ONE,i.ONE);break;case Rc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Cc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Es:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ac:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Rc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Cc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}M=null,C=null,A=null,U=null,y.set(0,0,0),b=0,v=D,H=ee}return}Ct=Ct||rt,Qt=Qt||ft,te=te||Dt,(rt!==x||Ct!==w)&&(i.blendEquationSeparate(Rt[rt],Rt[Ct]),x=rt,w=Ct),(ft!==M||Dt!==C||Qt!==A||te!==U)&&(i.blendFuncSeparate(Ut[ft],Ut[Dt],Ut[Qt],Ut[te]),M=ft,C=Dt,A=Qt,U=te),(ye.equals(y)===!1||be!==b)&&(i.blendColor(ye.r,ye.g,ye.b,be),y.copy(ye),b=be),v=D,H=!1}function de(D,rt){D.side===dn?Lt(i.CULL_FACE):kt(i.CULL_FACE);let ft=D.side===rn;rt&&(ft=!ft),Vt(ft),D.blending===Es&&D.transparent===!1?Mt(mi):Mt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),c.setFunc(D.depthFunc),c.setTest(D.depthTest),c.setMask(D.depthWrite),a.setMask(D.colorWrite);const Dt=D.stencilWrite;h.setTest(Dt),Dt&&(h.setMask(D.stencilWriteMask),h.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),h.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),z(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?kt(i.SAMPLE_ALPHA_TO_COVERAGE):Lt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Vt(D){G!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),G=D)}function T(D){D!==sf?(kt(i.CULL_FACE),D!==K&&(D===Tc?i.cullFace(i.BACK):D===rf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Lt(i.CULL_FACE),K=D}function S(D){D!==I&&($&&i.lineWidth(D),I=D)}function z(D,rt,ft){D?(kt(i.POLYGON_OFFSET_FILL),(F!==rt||W!==ft)&&(i.polygonOffset(rt,ft),F=rt,W=ft)):Lt(i.POLYGON_OFFSET_FILL)}function nt(D){D?kt(i.SCISSOR_TEST):Lt(i.SCISSOR_TEST)}function Q(D){D===void 0&&(D=i.TEXTURE0+Y-1),ot!==D&&(i.activeTexture(D),ot=D)}function it(D,rt,ft){ft===void 0&&(ot===null?ft=i.TEXTURE0+Y-1:ft=ot);let Dt=ct[ft];Dt===void 0&&(Dt={type:void 0,texture:void 0},ct[ft]=Dt),(Dt.type!==D||Dt.texture!==rt)&&(ot!==ft&&(i.activeTexture(ft),ot=ft),i.bindTexture(D,rt||Bt[D]),Dt.type=D,Dt.texture=rt)}function yt(){const D=ct[ot];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function dt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Pt(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Wt(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Z(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function re(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Yt(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Nt(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function At(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function gt(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function P(D){mt.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),mt.copy(D))}function st(D){Et.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),Et.copy(D))}function bt(D,rt){let ft=u.get(rt);ft===void 0&&(ft=new WeakMap,u.set(rt,ft));let Dt=ft.get(D);Dt===void 0&&(Dt=i.getUniformBlockIndex(rt,D.name),ft.set(D,Dt))}function vt(D,rt){const Dt=u.get(rt).get(D);l.get(rt)!==Dt&&(i.uniformBlockBinding(rt,Dt,D.__bindingPointIndex),l.set(rt,Dt))}function tt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},ot=null,ct={},p={},_=new WeakMap,g=[],m=null,d=!1,v=null,x=null,M=null,C=null,w=null,A=null,U=null,y=new qt(0,0,0),b=0,H=!1,G=null,K=null,I=null,F=null,W=null,mt.set(0,0,i.canvas.width,i.canvas.height),Et.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),h.reset()}return{buffers:{color:a,depth:c,stencil:h},enable:kt,disable:Lt,bindFramebuffer:Zt,drawBuffers:O,useProgram:He,setBlending:Mt,setMaterial:de,setFlipSided:Vt,setCullFace:T,setLineWidth:S,setPolygonOffset:z,setScissorTest:nt,activeTexture:Q,bindTexture:it,unbindTexture:yt,compressedTexImage2D:dt,compressedTexImage3D:xt,texImage2D:At,texImage3D:gt,updateUBOMapping:bt,uniformBlockBinding:vt,texStorage2D:Yt,texStorage3D:Nt,texSubImage2D:Pt,texSubImage3D:Wt,compressedTexSubImage2D:Z,compressedTexSubImage3D:re,scissor:P,viewport:st,reset:tt}}function n_(i,t,e,n,s,r,o){const a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(T,S){return p?new OffscreenCanvas(T,S):io("canvas")}function g(T,S,z,nt){let Q=1;if((T.width>nt||T.height>nt)&&(Q=nt/Math.max(T.width,T.height)),Q<1||S===!0)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap){const it=S?Aa:Math.floor,yt=it(Q*T.width),dt=it(Q*T.height);u===void 0&&(u=_(yt,dt));const xt=z?_(yt,dt):u;return xt.width=yt,xt.height=dt,xt.getContext("2d").drawImage(T,0,0,yt,dt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+T.width+"x"+T.height+") to ("+yt+"x"+dt+")."),xt}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+T.width+"x"+T.height+")."),T;return T}function m(T){return al(T.width)&&al(T.height)}function d(T){return a?!1:T.wrapS!==An||T.wrapT!==An||T.minFilter!==Ve&&T.minFilter!==sn}function v(T,S){return T.generateMipmaps&&S&&T.minFilter!==Ve&&T.minFilter!==sn}function x(T){i.generateMipmap(T)}function M(T,S,z,nt,Q=!1){if(a===!1)return S;if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let it=S;if(S===i.RED&&(z===i.FLOAT&&(it=i.R32F),z===i.HALF_FLOAT&&(it=i.R16F),z===i.UNSIGNED_BYTE&&(it=i.R8)),S===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(it=i.R8UI),z===i.UNSIGNED_SHORT&&(it=i.R16UI),z===i.UNSIGNED_INT&&(it=i.R32UI),z===i.BYTE&&(it=i.R8I),z===i.SHORT&&(it=i.R16I),z===i.INT&&(it=i.R32I)),S===i.RG&&(z===i.FLOAT&&(it=i.RG32F),z===i.HALF_FLOAT&&(it=i.RG16F),z===i.UNSIGNED_BYTE&&(it=i.RG8)),S===i.RGBA){const yt=Q?Qr:he.getTransfer(nt);z===i.FLOAT&&(it=i.RGBA32F),z===i.HALF_FLOAT&&(it=i.RGBA16F),z===i.UNSIGNED_BYTE&&(it=yt===pe?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(it=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(it=i.RGB5_A1)}return(it===i.R16F||it===i.R32F||it===i.RG16F||it===i.RG32F||it===i.RGBA16F||it===i.RGBA32F)&&t.get("EXT_color_buffer_float"),it}function C(T,S,z){return v(T,z)===!0||T.isFramebufferTexture&&T.minFilter!==Ve&&T.minFilter!==sn?Math.log2(Math.max(S.width,S.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?S.mipmaps.length:1}function w(T){return T===Ve||T===Dc||T===Po?i.NEAREST:i.LINEAR}function A(T){const S=T.target;S.removeEventListener("dispose",A),y(S),S.isVideoTexture&&l.delete(S)}function U(T){const S=T.target;S.removeEventListener("dispose",U),H(S)}function y(T){const S=n.get(T);if(S.__webglInit===void 0)return;const z=T.source,nt=f.get(z);if(nt){const Q=nt[S.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&b(T),Object.keys(nt).length===0&&f.delete(z)}n.remove(T)}function b(T){const S=n.get(T);i.deleteTexture(S.__webglTexture);const z=T.source,nt=f.get(z);delete nt[S.__cacheKey],o.memory.textures--}function H(T){const S=T.texture,z=n.get(T),nt=n.get(S);if(nt.__webglTexture!==void 0&&(i.deleteTexture(nt.__webglTexture),o.memory.textures--),T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(z.__webglFramebuffer[Q]))for(let it=0;it<z.__webglFramebuffer[Q].length;it++)i.deleteFramebuffer(z.__webglFramebuffer[Q][it]);else i.deleteFramebuffer(z.__webglFramebuffer[Q]);z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer[Q])}else{if(Array.isArray(z.__webglFramebuffer))for(let Q=0;Q<z.__webglFramebuffer.length;Q++)i.deleteFramebuffer(z.__webglFramebuffer[Q]);else i.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&i.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let Q=0;Q<z.__webglColorRenderbuffer.length;Q++)z.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(z.__webglColorRenderbuffer[Q]);z.__webglDepthRenderbuffer&&i.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(T.isWebGLMultipleRenderTargets)for(let Q=0,it=S.length;Q<it;Q++){const yt=n.get(S[Q]);yt.__webglTexture&&(i.deleteTexture(yt.__webglTexture),o.memory.textures--),n.remove(S[Q])}n.remove(S),n.remove(T)}let G=0;function K(){G=0}function I(){const T=G;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),G+=1,T}function F(T){const S=[];return S.push(T.wrapS),S.push(T.wrapT),S.push(T.wrapR||0),S.push(T.magFilter),S.push(T.minFilter),S.push(T.anisotropy),S.push(T.internalFormat),S.push(T.format),S.push(T.type),S.push(T.generateMipmaps),S.push(T.premultiplyAlpha),S.push(T.flipY),S.push(T.unpackAlignment),S.push(T.colorSpace),S.join()}function W(T,S){const z=n.get(T);if(T.isVideoTexture&&de(T),T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){const nt=T.image;if(nt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(nt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{mt(z,T,S);return}}e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+S)}function Y(T,S){const z=n.get(T);if(T.version>0&&z.__version!==T.version){mt(z,T,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+S)}function $(T,S){const z=n.get(T);if(T.version>0&&z.__version!==T.version){mt(z,T,S);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+S)}function q(T,S){const z=n.get(T);if(T.version>0&&z.__version!==T.version){Et(z,T,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+S)}const j={[Zr]:i.REPEAT,[An]:i.CLAMP_TO_EDGE,[Ea]:i.MIRRORED_REPEAT},ot={[Ve]:i.NEAREST,[Dc]:i.NEAREST_MIPMAP_NEAREST,[Po]:i.NEAREST_MIPMAP_LINEAR,[sn]:i.LINEAR,[zf]:i.LINEAR_MIPMAP_NEAREST,[rr]:i.LINEAR_MIPMAP_LINEAR},ct={[Yf]:i.NEVER,[td]:i.ALWAYS,[jf]:i.LESS,[Vh]:i.LEQUAL,[Kf]:i.EQUAL,[Qf]:i.GEQUAL,[Jf]:i.GREATER,[Zf]:i.NOTEQUAL};function X(T,S,z){if(z?(i.texParameteri(T,i.TEXTURE_WRAP_S,j[S.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,j[S.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,j[S.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ot[S.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ot[S.minFilter])):(i.texParameteri(T,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(T,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(S.wrapS!==An||S.wrapT!==An)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(T,i.TEXTURE_MAG_FILTER,w(S.magFilter)),i.texParameteri(T,i.TEXTURE_MIN_FILTER,w(S.minFilter)),S.minFilter!==Ve&&S.minFilter!==sn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),S.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ct[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const nt=t.get("EXT_texture_filter_anisotropic");if(S.magFilter===Ve||S.minFilter!==Po&&S.minFilter!==rr||S.type===pi&&t.has("OES_texture_float_linear")===!1||a===!1&&S.type===or&&t.has("OES_texture_half_float_linear")===!1)return;(S.anisotropy>1||n.get(S).__currentAnisotropy)&&(i.texParameterf(T,nt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy)}}function J(T,S){let z=!1;T.__webglInit===void 0&&(T.__webglInit=!0,S.addEventListener("dispose",A));const nt=S.source;let Q=f.get(nt);Q===void 0&&(Q={},f.set(nt,Q));const it=F(S);if(it!==T.__cacheKey){Q[it]===void 0&&(Q[it]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),Q[it].usedTimes++;const yt=Q[T.__cacheKey];yt!==void 0&&(Q[T.__cacheKey].usedTimes--,yt.usedTimes===0&&b(S)),T.__cacheKey=it,T.__webglTexture=Q[it].texture}return z}function mt(T,S,z){let nt=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(nt=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(nt=i.TEXTURE_3D);const Q=J(T,S),it=S.source;e.bindTexture(nt,T.__webglTexture,i.TEXTURE0+z);const yt=n.get(it);if(it.version!==yt.__version||Q===!0){e.activeTexture(i.TEXTURE0+z);const dt=he.getPrimaries(he.workingColorSpace),xt=S.colorSpace===Mn?null:he.getPrimaries(S.colorSpace),Pt=S.colorSpace===Mn||dt===xt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const Wt=d(S)&&m(S.image)===!1;let Z=g(S.image,Wt,!1,s.maxTextureSize);Z=Vt(S,Z);const re=m(Z)||a,Yt=r.convert(S.format,S.colorSpace);let Nt=r.convert(S.type),At=M(S.internalFormat,Yt,Nt,S.colorSpace,S.isVideoTexture);X(nt,S,re);let gt;const P=S.mipmaps,st=a&&S.isVideoTexture!==!0&&At!==Hh,bt=yt.__version===void 0||Q===!0,vt=C(S,Z,re);if(S.isDepthTexture)At=i.DEPTH_COMPONENT,a?S.type===pi?At=i.DEPTH_COMPONENT32F:S.type===di?At=i.DEPTH_COMPONENT24:S.type===Ii?At=i.DEPTH24_STENCIL8:At=i.DEPTH_COMPONENT16:S.type===pi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),S.format===Ui&&At===i.DEPTH_COMPONENT&&S.type!==Oa&&S.type!==di&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),S.type=di,Nt=r.convert(S.type)),S.format===Ls&&At===i.DEPTH_COMPONENT&&(At=i.DEPTH_STENCIL,S.type!==Ii&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),S.type=Ii,Nt=r.convert(S.type))),bt&&(st?e.texStorage2D(i.TEXTURE_2D,1,At,Z.width,Z.height):e.texImage2D(i.TEXTURE_2D,0,At,Z.width,Z.height,0,Yt,Nt,null));else if(S.isDataTexture)if(P.length>0&&re){st&&bt&&e.texStorage2D(i.TEXTURE_2D,vt,At,P[0].width,P[0].height);for(let tt=0,D=P.length;tt<D;tt++)gt=P[tt],st?e.texSubImage2D(i.TEXTURE_2D,tt,0,0,gt.width,gt.height,Yt,Nt,gt.data):e.texImage2D(i.TEXTURE_2D,tt,At,gt.width,gt.height,0,Yt,Nt,gt.data);S.generateMipmaps=!1}else st?(bt&&e.texStorage2D(i.TEXTURE_2D,vt,At,Z.width,Z.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Z.width,Z.height,Yt,Nt,Z.data)):e.texImage2D(i.TEXTURE_2D,0,At,Z.width,Z.height,0,Yt,Nt,Z.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){st&&bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,At,P[0].width,P[0].height,Z.depth);for(let tt=0,D=P.length;tt<D;tt++)gt=P[tt],S.format!==xn?Yt!==null?st?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,gt.width,gt.height,Z.depth,Yt,gt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,tt,At,gt.width,gt.height,Z.depth,0,gt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?e.texSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,gt.width,gt.height,Z.depth,Yt,Nt,gt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,tt,At,gt.width,gt.height,Z.depth,0,Yt,Nt,gt.data)}else{st&&bt&&e.texStorage2D(i.TEXTURE_2D,vt,At,P[0].width,P[0].height);for(let tt=0,D=P.length;tt<D;tt++)gt=P[tt],S.format!==xn?Yt!==null?st?e.compressedTexSubImage2D(i.TEXTURE_2D,tt,0,0,gt.width,gt.height,Yt,gt.data):e.compressedTexImage2D(i.TEXTURE_2D,tt,At,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?e.texSubImage2D(i.TEXTURE_2D,tt,0,0,gt.width,gt.height,Yt,Nt,gt.data):e.texImage2D(i.TEXTURE_2D,tt,At,gt.width,gt.height,0,Yt,Nt,gt.data)}else if(S.isDataArrayTexture)st?(bt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,vt,At,Z.width,Z.height,Z.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,Yt,Nt,Z.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,At,Z.width,Z.height,Z.depth,0,Yt,Nt,Z.data);else if(S.isData3DTexture)st?(bt&&e.texStorage3D(i.TEXTURE_3D,vt,At,Z.width,Z.height,Z.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,Yt,Nt,Z.data)):e.texImage3D(i.TEXTURE_3D,0,At,Z.width,Z.height,Z.depth,0,Yt,Nt,Z.data);else if(S.isFramebufferTexture){if(bt)if(st)e.texStorage2D(i.TEXTURE_2D,vt,At,Z.width,Z.height);else{let tt=Z.width,D=Z.height;for(let rt=0;rt<vt;rt++)e.texImage2D(i.TEXTURE_2D,rt,At,tt,D,0,Yt,Nt,null),tt>>=1,D>>=1}}else if(P.length>0&&re){st&&bt&&e.texStorage2D(i.TEXTURE_2D,vt,At,P[0].width,P[0].height);for(let tt=0,D=P.length;tt<D;tt++)gt=P[tt],st?e.texSubImage2D(i.TEXTURE_2D,tt,0,0,Yt,Nt,gt):e.texImage2D(i.TEXTURE_2D,tt,At,Yt,Nt,gt);S.generateMipmaps=!1}else st?(bt&&e.texStorage2D(i.TEXTURE_2D,vt,At,Z.width,Z.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Yt,Nt,Z)):e.texImage2D(i.TEXTURE_2D,0,At,Yt,Nt,Z);v(S,re)&&x(nt),yt.__version=it.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function Et(T,S,z){if(S.image.length!==6)return;const nt=J(T,S),Q=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+z);const it=n.get(Q);if(Q.version!==it.__version||nt===!0){e.activeTexture(i.TEXTURE0+z);const yt=he.getPrimaries(he.workingColorSpace),dt=S.colorSpace===Mn?null:he.getPrimaries(S.colorSpace),xt=S.colorSpace===Mn||yt===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const Pt=S.isCompressedTexture||S.image[0].isCompressedTexture,Wt=S.image[0]&&S.image[0].isDataTexture,Z=[];for(let tt=0;tt<6;tt++)!Pt&&!Wt?Z[tt]=g(S.image[tt],!1,!0,s.maxCubemapSize):Z[tt]=Wt?S.image[tt].image:S.image[tt],Z[tt]=Vt(S,Z[tt]);const re=Z[0],Yt=m(re)||a,Nt=r.convert(S.format,S.colorSpace),At=r.convert(S.type),gt=M(S.internalFormat,Nt,At,S.colorSpace),P=a&&S.isVideoTexture!==!0,st=it.__version===void 0||nt===!0;let bt=C(S,re,Yt);X(i.TEXTURE_CUBE_MAP,S,Yt);let vt;if(Pt){P&&st&&e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,gt,re.width,re.height);for(let tt=0;tt<6;tt++){vt=Z[tt].mipmaps;for(let D=0;D<vt.length;D++){const rt=vt[D];S.format!==xn?Nt!==null?P?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D,0,0,rt.width,rt.height,Nt,rt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D,gt,rt.width,rt.height,0,rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D,0,0,rt.width,rt.height,Nt,At,rt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D,gt,rt.width,rt.height,0,Nt,At,rt.data)}}}else{vt=S.mipmaps,P&&st&&(vt.length>0&&bt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,gt,Z[0].width,Z[0].height));for(let tt=0;tt<6;tt++)if(Wt){P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,Z[tt].width,Z[tt].height,Nt,At,Z[tt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,gt,Z[tt].width,Z[tt].height,0,Nt,At,Z[tt].data);for(let D=0;D<vt.length;D++){const ft=vt[D].image[tt].image;P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D+1,0,0,ft.width,ft.height,Nt,At,ft.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D+1,gt,ft.width,ft.height,0,Nt,At,ft.data)}}else{P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,Nt,At,Z[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,gt,Nt,At,Z[tt]);for(let D=0;D<vt.length;D++){const rt=vt[D];P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D+1,0,0,Nt,At,rt.image[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,D+1,gt,Nt,At,rt.image[tt])}}}v(S,Yt)&&x(i.TEXTURE_CUBE_MAP),it.__version=Q.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function St(T,S,z,nt,Q,it){const yt=r.convert(z.format,z.colorSpace),dt=r.convert(z.type),xt=M(z.internalFormat,yt,dt,z.colorSpace);if(!n.get(S).__hasExternalTextures){const Wt=Math.max(1,S.width>>it),Z=Math.max(1,S.height>>it);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?e.texImage3D(Q,it,xt,Wt,Z,S.depth,0,yt,dt,null):e.texImage2D(Q,it,xt,Wt,Z,0,yt,dt,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,nt,Q,n.get(z).__webglTexture,0,Ut(S)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,nt,Q,n.get(z).__webglTexture,it),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Bt(T,S,z){if(i.bindRenderbuffer(i.RENDERBUFFER,T),S.depthBuffer&&!S.stencilBuffer){let nt=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(z||Mt(S)){const Q=S.depthTexture;Q&&Q.isDepthTexture&&(Q.type===pi?nt=i.DEPTH_COMPONENT32F:Q.type===di&&(nt=i.DEPTH_COMPONENT24));const it=Ut(S);Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it,nt,S.width,S.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,it,nt,S.width,S.height)}else i.renderbufferStorage(i.RENDERBUFFER,nt,S.width,S.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,T)}else if(S.depthBuffer&&S.stencilBuffer){const nt=Ut(S);z&&Mt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,i.DEPTH24_STENCIL8,S.width,S.height):Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,i.DEPTH24_STENCIL8,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,T)}else{const nt=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let Q=0;Q<nt.length;Q++){const it=nt[Q],yt=r.convert(it.format,it.colorSpace),dt=r.convert(it.type),xt=M(it.internalFormat,yt,dt,it.colorSpace),Pt=Ut(S);z&&Mt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Pt,xt,S.width,S.height):Mt(S)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Pt,xt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,xt,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function kt(T,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),W(S.depthTexture,0);const nt=n.get(S.depthTexture).__webglTexture,Q=Ut(S);if(S.depthTexture.format===Ui)Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0);else if(S.depthTexture.format===Ls)Mt(S)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0);else throw new Error("Unknown depthTexture format")}function Lt(T){const S=n.get(T),z=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!S.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");kt(S.__webglFramebuffer,T)}else if(z){S.__webglDepthbuffer=[];for(let nt=0;nt<6;nt++)e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[nt]),S.__webglDepthbuffer[nt]=i.createRenderbuffer(),Bt(S.__webglDepthbuffer[nt],T,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=i.createRenderbuffer(),Bt(S.__webglDepthbuffer,T,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Zt(T,S,z){const nt=n.get(T);S!==void 0&&St(nt.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&Lt(T)}function O(T){const S=T.texture,z=n.get(T),nt=n.get(S);T.addEventListener("dispose",U),T.isWebGLMultipleRenderTargets!==!0&&(nt.__webglTexture===void 0&&(nt.__webglTexture=i.createTexture()),nt.__version=S.version,o.memory.textures++);const Q=T.isWebGLCubeRenderTarget===!0,it=T.isWebGLMultipleRenderTargets===!0,yt=m(T)||a;if(Q){z.__webglFramebuffer=[];for(let dt=0;dt<6;dt++)if(a&&S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer[dt]=[];for(let xt=0;xt<S.mipmaps.length;xt++)z.__webglFramebuffer[dt][xt]=i.createFramebuffer()}else z.__webglFramebuffer[dt]=i.createFramebuffer()}else{if(a&&S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer=[];for(let dt=0;dt<S.mipmaps.length;dt++)z.__webglFramebuffer[dt]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(it)if(s.drawBuffers){const dt=T.texture;for(let xt=0,Pt=dt.length;xt<Pt;xt++){const Wt=n.get(dt[xt]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&T.samples>0&&Mt(T)===!1){const dt=it?S:[S];z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let xt=0;xt<dt.length;xt++){const Pt=dt[xt];z.__webglColorRenderbuffer[xt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[xt]);const Wt=r.convert(Pt.format,Pt.colorSpace),Z=r.convert(Pt.type),re=M(Pt.internalFormat,Wt,Z,Pt.colorSpace,T.isXRRenderTarget===!0),Yt=Ut(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Yt,re,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,z.__webglColorRenderbuffer[xt])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Bt(z.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Q){e.bindTexture(i.TEXTURE_CUBE_MAP,nt.__webglTexture),X(i.TEXTURE_CUBE_MAP,S,yt);for(let dt=0;dt<6;dt++)if(a&&S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)St(z.__webglFramebuffer[dt][xt],T,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,xt);else St(z.__webglFramebuffer[dt],T,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0);v(S,yt)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(it){const dt=T.texture;for(let xt=0,Pt=dt.length;xt<Pt;xt++){const Wt=dt[xt],Z=n.get(Wt);e.bindTexture(i.TEXTURE_2D,Z.__webglTexture),X(i.TEXTURE_2D,Wt,yt),St(z.__webglFramebuffer,T,Wt,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,0),v(Wt,yt)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let dt=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(a?dt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(dt,nt.__webglTexture),X(dt,S,yt),a&&S.mipmaps&&S.mipmaps.length>0)for(let xt=0;xt<S.mipmaps.length;xt++)St(z.__webglFramebuffer[xt],T,S,i.COLOR_ATTACHMENT0,dt,xt);else St(z.__webglFramebuffer,T,S,i.COLOR_ATTACHMENT0,dt,0);v(S,yt)&&x(dt),e.unbindTexture()}T.depthBuffer&&Lt(T)}function He(T){const S=m(T)||a,z=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let nt=0,Q=z.length;nt<Q;nt++){const it=z[nt];if(v(it,S)){const yt=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,dt=n.get(it).__webglTexture;e.bindTexture(yt,dt),x(yt),e.unbindTexture()}}}function Rt(T){if(a&&T.samples>0&&Mt(T)===!1){const S=T.isWebGLMultipleRenderTargets?T.texture:[T.texture],z=T.width,nt=T.height;let Q=i.COLOR_BUFFER_BIT;const it=[],yt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=n.get(T),xt=T.isWebGLMultipleRenderTargets===!0;if(xt)for(let Pt=0;Pt<S.length;Pt++)e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,dt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,dt.__webglFramebuffer);for(let Pt=0;Pt<S.length;Pt++){it.push(i.COLOR_ATTACHMENT0+Pt),T.depthBuffer&&it.push(yt);const Wt=dt.__ignoreDepthValues!==void 0?dt.__ignoreDepthValues:!1;if(Wt===!1&&(T.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),xt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,dt.__webglColorRenderbuffer[Pt]),Wt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[yt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[yt])),xt){const Z=n.get(S[Pt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Z,0)}i.blitFramebuffer(0,0,z,nt,0,0,z,nt,Q,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,it)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),xt)for(let Pt=0;Pt<S.length;Pt++){e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,dt.__webglColorRenderbuffer[Pt]);const Wt=n.get(S[Pt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,Wt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,dt.__webglMultisampledFramebuffer)}}function Ut(T){return Math.min(s.maxSamples,T.samples)}function Mt(T){const S=n.get(T);return a&&T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function de(T){const S=o.render.frame;l.get(T)!==S&&(l.set(T,S),T.update())}function Vt(T,S){const z=T.colorSpace,nt=T.format,Q=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||T.format===wa||z!==ri&&z!==Mn&&(he.getTransfer(z)===pe?a===!1?t.has("EXT_sRGB")===!0&&nt===xn?(T.format=wa,T.minFilter=sn,T.generateMipmaps=!1):S=Xh.sRGBToLinear(S):(nt!==xn||Q!==_i)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),S}this.allocateTextureUnit=I,this.resetTextureUnits=K,this.setTexture2D=W,this.setTexture2DArray=Y,this.setTexture3D=$,this.setTextureCube=q,this.rebindTextures=Zt,this.setupRenderTarget=O,this.updateRenderTargetMipmap=He,this.updateMultisampleRenderTarget=Rt,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=St,this.useMultisampledRTT=Mt}function i_(i,t,e){const n=e.isWebGL2;function s(r,o=Mn){let a;const c=he.getTransfer(o);if(r===_i)return i.UNSIGNED_BYTE;if(r===zh)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Oh)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Of)return i.BYTE;if(r===Ff)return i.SHORT;if(r===Oa)return i.UNSIGNED_SHORT;if(r===Nh)return i.INT;if(r===di)return i.UNSIGNED_INT;if(r===pi)return i.FLOAT;if(r===or)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Bf)return i.ALPHA;if(r===xn)return i.RGBA;if(r===kf)return i.LUMINANCE;if(r===Hf)return i.LUMINANCE_ALPHA;if(r===Ui)return i.DEPTH_COMPONENT;if(r===Ls)return i.DEPTH_STENCIL;if(r===wa)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Gf)return i.RED;if(r===Fh)return i.RED_INTEGER;if(r===Vf)return i.RG;if(r===Bh)return i.RG_INTEGER;if(r===kh)return i.RGBA_INTEGER;if(r===Lo||r===Do||r===Io||r===Uo)if(c===pe)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Lo)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Do)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Io)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Uo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Lo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Do)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Io)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Uo)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ic||r===Uc||r===Nc||r===zc)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Ic)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Uc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Nc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===zc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Hh)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Oc||r===Fc)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Oc)return c===pe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Fc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Bc||r===kc||r===Hc||r===Gc||r===Vc||r===Wc||r===Xc||r===$c||r===qc||r===Yc||r===jc||r===Kc||r===Jc||r===Zc)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Bc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===kc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Hc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Gc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Vc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Wc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Xc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===$c)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===qc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Yc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===jc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Kc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Jc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Zc)return c===pe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===No||r===Qc||r===tl)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===No)return c===pe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Qc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===tl)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Wf||r===el||r===nl||r===il)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===No)return a.COMPRESSED_RED_RGTC1_EXT;if(r===el)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===nl)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===il)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Ii?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class s_ extends un{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ot extends Fe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const r_={type:"move"};class ra{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ot,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ot,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ot,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){o=!0;for(const g of t.hand.values()){const m=e.getJointPose(g,n),d=this._getHandJoint(h,g);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],f=l.position.distanceTo(u.position),p=.02,_=.005;h.inputState.pinching&&f>p+_?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&f<=p-_&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(r_)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ot;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class o_ extends Gi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,h=null,l=null,u=null,f=null,p=null,_=null;const g=e.getContextAttributes();let m=null,d=null;const v=[],x=[],M=new ht;let C=null;const w=new un;w.layers.enable(1),w.viewport=new ge;const A=new un;A.layers.enable(2),A.viewport=new ge;const U=[w,A],y=new s_;y.layers.enable(1),y.layers.enable(2);let b=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let J=v[X];return J===void 0&&(J=new ra,v[X]=J),J.getTargetRaySpace()},this.getControllerGrip=function(X){let J=v[X];return J===void 0&&(J=new ra,v[X]=J),J.getGripSpace()},this.getHand=function(X){let J=v[X];return J===void 0&&(J=new ra,v[X]=J),J.getHandSpace()};function G(X){const J=x.indexOf(X.inputSource);if(J===-1)return;const mt=v[J];mt!==void 0&&(mt.update(X.inputSource,X.frame,h||o),mt.dispatchEvent({type:X.type,data:X.inputSource}))}function K(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",I);for(let X=0;X<v.length;X++){const J=x[X];J!==null&&(x[X]=null,v[X].disconnect(J))}b=null,H=null,t.setRenderTarget(m),p=null,f=null,u=null,s=null,d=null,ct.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||o},this.setReferenceSpace=function(X){h=X},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",K),s.addEventListener("inputsourceschange",I),g.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(M),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const J={antialias:s.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,J),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),d=new Fi(p.framebufferWidth,p.framebufferHeight,{format:xn,type:_i,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let J=null,mt=null,Et=null;g.depth&&(Et=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=g.stencil?Ls:Ui,mt=g.stencil?Ii:di);const St={colorFormat:e.RGBA8,depthFormat:Et,scaleFactor:r};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(St),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),d=new Fi(f.textureWidth,f.textureHeight,{format:xn,type:_i,depthTexture:new nu(f.textureWidth,f.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const Bt=t.properties.get(d);Bt.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(c),h=null,o=await s.requestReferenceSpace(a),ct.setContext(s),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function I(X){for(let J=0;J<X.removed.length;J++){const mt=X.removed[J],Et=x.indexOf(mt);Et>=0&&(x[Et]=null,v[Et].disconnect(mt))}for(let J=0;J<X.added.length;J++){const mt=X.added[J];let Et=x.indexOf(mt);if(Et===-1){for(let Bt=0;Bt<v.length;Bt++)if(Bt>=x.length){x.push(mt),Et=Bt;break}else if(x[Bt]===null){x[Bt]=mt,Et=Bt;break}if(Et===-1)break}const St=v[Et];St&&St.connect(mt)}}const F=new R,W=new R;function Y(X,J,mt){F.setFromMatrixPosition(J.matrixWorld),W.setFromMatrixPosition(mt.matrixWorld);const Et=F.distanceTo(W),St=J.projectionMatrix.elements,Bt=mt.projectionMatrix.elements,kt=St[14]/(St[10]-1),Lt=St[14]/(St[10]+1),Zt=(St[9]+1)/St[5],O=(St[9]-1)/St[5],He=(St[8]-1)/St[0],Rt=(Bt[8]+1)/Bt[0],Ut=kt*He,Mt=kt*Rt,de=Et/(-He+Rt),Vt=de*-He;J.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Vt),X.translateZ(de),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const T=kt+de,S=Lt+de,z=Ut-Vt,nt=Mt+(Et-Vt),Q=Zt*Lt/S*T,it=O*Lt/S*T;X.projectionMatrix.makePerspective(z,nt,Q,it,T,S),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function $(X,J){J===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(J.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;y.near=A.near=w.near=X.near,y.far=A.far=w.far=X.far,(b!==y.near||H!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),b=y.near,H=y.far);const J=X.parent,mt=y.cameras;$(y,J);for(let Et=0;Et<mt.length;Et++)$(mt[Et],J);mt.length===2?Y(y,w,A):y.projectionMatrix.copy(w.projectionMatrix),q(X,y,J)};function q(X,J,mt){mt===null?X.matrix.copy(J.matrixWorld):(X.matrix.copy(mt.matrixWorld),X.matrix.invert(),X.matrix.multiply(J.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(J.projectionMatrix),X.projectionMatrixInverse.copy(J.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Ta*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(X){c=X,f!==null&&(f.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)};let j=null;function ot(X,J){if(l=J.getViewerPose(h||o),_=J,l!==null){const mt=l.views;p!==null&&(t.setRenderTargetFramebuffer(d,p.framebuffer),t.setRenderTarget(d));let Et=!1;mt.length!==y.cameras.length&&(y.cameras.length=0,Et=!0);for(let St=0;St<mt.length;St++){const Bt=mt[St];let kt=null;if(p!==null)kt=p.getViewport(Bt);else{const Zt=u.getViewSubImage(f,Bt);kt=Zt.viewport,St===0&&(t.setRenderTargetTextures(d,Zt.colorTexture,f.ignoreDepthValues?void 0:Zt.depthStencilTexture),t.setRenderTarget(d))}let Lt=U[St];Lt===void 0&&(Lt=new un,Lt.layers.enable(St),Lt.viewport=new ge,U[St]=Lt),Lt.matrix.fromArray(Bt.transform.matrix),Lt.matrix.decompose(Lt.position,Lt.quaternion,Lt.scale),Lt.projectionMatrix.fromArray(Bt.projectionMatrix),Lt.projectionMatrixInverse.copy(Lt.projectionMatrix).invert(),Lt.viewport.set(kt.x,kt.y,kt.width,kt.height),St===0&&(y.matrix.copy(Lt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),Et===!0&&y.cameras.push(Lt)}}for(let mt=0;mt<v.length;mt++){const Et=x[mt],St=v[mt];Et!==null&&St!==void 0&&St.update(Et,J,h||o)}j&&j(X,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),_=null}const ct=new tu;ct.setAnimationLoop(ot),this.setAnimationLoop=function(X){j=X},this.dispose=function(){}}}function a_(i,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,Jh(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,v,x,M){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),l(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,M)):d.isMeshMatcapMaterial?(r(m,d),_(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),g(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?c(m,d,v,x):d.isSpriteMaterial?h(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===rn&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===rn&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const v=t.get(d).envMap;if(v&&(m.envMap.value=v,m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;const x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*x,e(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,v,x){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*v,m.scale.value=x*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),t.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,v){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===rn&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,d){d.matcap&&(m.matcap.value=d.matcap)}function g(m,d){const v=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function c_(i,t,e,n){let s={},r={},o=[];const a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(v,x){const M=x.program;n.uniformBlockBinding(v,M)}function h(v,x){let M=s[v.id];M===void 0&&(_(v),M=l(v),s[v.id]=M,v.addEventListener("dispose",m));const C=x.program;n.updateUBOMapping(v,C);const w=t.render.frame;r[v.id]!==w&&(f(v),r[v.id]=w)}function l(v){const x=u();v.__bindingPointIndex=x;const M=i.createBuffer(),C=v.__size,w=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,C,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,M),M}function u(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const x=s[v.id],M=v.uniforms,C=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let w=0,A=M.length;w<A;w++){const U=Array.isArray(M[w])?M[w]:[M[w]];for(let y=0,b=U.length;y<b;y++){const H=U[y];if(p(H,w,y,C)===!0){const G=H.__offset,K=Array.isArray(H.value)?H.value:[H.value];let I=0;for(let F=0;F<K.length;F++){const W=K[F],Y=g(W);typeof W=="number"||typeof W=="boolean"?(H.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,G+I,H.__data)):W.isMatrix3?(H.__data[0]=W.elements[0],H.__data[1]=W.elements[1],H.__data[2]=W.elements[2],H.__data[3]=0,H.__data[4]=W.elements[3],H.__data[5]=W.elements[4],H.__data[6]=W.elements[5],H.__data[7]=0,H.__data[8]=W.elements[6],H.__data[9]=W.elements[7],H.__data[10]=W.elements[8],H.__data[11]=0):(W.toArray(H.__data,I),I+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,H.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,x,M,C){const w=v.value,A=x+"_"+M;if(C[A]===void 0)return typeof w=="number"||typeof w=="boolean"?C[A]=w:C[A]=w.clone(),!0;{const U=C[A];if(typeof w=="number"||typeof w=="boolean"){if(U!==w)return C[A]=w,!0}else if(U.equals(w)===!1)return U.copy(w),!0}return!1}function _(v){const x=v.uniforms;let M=0;const C=16;for(let A=0,U=x.length;A<U;A++){const y=Array.isArray(x[A])?x[A]:[x[A]];for(let b=0,H=y.length;b<H;b++){const G=y[b],K=Array.isArray(G.value)?G.value:[G.value];for(let I=0,F=K.length;I<F;I++){const W=K[I],Y=g(W),$=M%C;$!==0&&C-$<Y.boundary&&(M+=C-$),G.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=M,M+=Y.storage}}}const w=M%C;return w>0&&(M+=C-w),v.__size=M,v.__cache={},this}function g(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function m(v){const x=v.target;x.removeEventListener("dispose",m);const M=o.indexOf(x.__bindingPointIndex);o.splice(M,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function d(){for(const v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:c,update:h,dispose:d}}class cu{constructor(t={}){const{canvas:e=sd(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;const p=new Uint32Array(4),_=new Int32Array(4);let g=null,m=null;const d=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ce,this._useLegacyLights=!1,this.toneMapping=gi,this.toneMappingExposure=1;const x=this;let M=!1,C=0,w=0,A=null,U=-1,y=null;const b=new ge,H=new ge;let G=null;const K=new qt(0);let I=0,F=e.width,W=e.height,Y=1,$=null,q=null;const j=new ge(0,0,F,W),ot=new ge(0,0,F,W);let ct=!1;const X=new Ha;let J=!1,mt=!1,Et=null;const St=new le,Bt=new ht,kt=new R,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Zt(){return A===null?Y:1}let O=n;function He(E,N){for(let k=0;k<E.length;k++){const V=E[k],B=e.getContext(V,N);if(B!==null)return B}return null}try{const E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Na}`),e.addEventListener("webglcontextlost",tt,!1),e.addEventListener("webglcontextrestored",D,!1),e.addEventListener("webglcontextcreationerror",rt,!1),O===null){const N=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&N.shift(),O=He(N,E),O===null)throw He(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&O instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),O.getShaderPrecisionFormat===void 0&&(O.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Rt,Ut,Mt,de,Vt,T,S,z,nt,Q,it,yt,dt,xt,Pt,Wt,Z,re,Yt,Nt,At,gt,P,st;function bt(){Rt=new v0(O),Ut=new f0(O,Rt,t),Rt.init(Ut),gt=new i_(O,Rt,Ut),Mt=new e_(O,Rt,Ut),de=new y0(O),Vt=new Hg,T=new n_(O,Rt,Mt,Vt,Ut,gt,de),S=new p0(x),z=new _0(x),nt=new Cd(O,Ut),P=new h0(O,Rt,nt,Ut),Q=new x0(O,nt,de,P),it=new w0(O,Q,nt,de),Yt=new E0(O,Ut,T),Wt=new d0(Vt),yt=new kg(x,S,z,Rt,Ut,P,Wt),dt=new a_(x,Vt),xt=new Vg,Pt=new jg(Rt,Ut),re=new l0(x,S,z,Mt,it,f,c),Z=new t_(x,it,Ut),st=new c_(O,de,Ut,Mt),Nt=new u0(O,Rt,de,Ut),At=new M0(O,Rt,de,Ut),de.programs=yt.programs,x.capabilities=Ut,x.extensions=Rt,x.properties=Vt,x.renderLists=xt,x.shadowMap=Z,x.state=Mt,x.info=de}bt();const vt=new o_(x,O);this.xr=vt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const E=Rt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Rt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(E){E!==void 0&&(Y=E,this.setSize(F,W,!1))},this.getSize=function(E){return E.set(F,W)},this.setSize=function(E,N,k=!0){if(vt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=E,W=N,e.width=Math.floor(E*Y),e.height=Math.floor(N*Y),k===!0&&(e.style.width=E+"px",e.style.height=N+"px"),this.setViewport(0,0,E,N)},this.getDrawingBufferSize=function(E){return E.set(F*Y,W*Y).floor()},this.setDrawingBufferSize=function(E,N,k){F=E,W=N,Y=k,e.width=Math.floor(E*k),e.height=Math.floor(N*k),this.setViewport(0,0,E,N)},this.getCurrentViewport=function(E){return E.copy(b)},this.getViewport=function(E){return E.copy(j)},this.setViewport=function(E,N,k,V){E.isVector4?j.set(E.x,E.y,E.z,E.w):j.set(E,N,k,V),Mt.viewport(b.copy(j).multiplyScalar(Y).floor())},this.getScissor=function(E){return E.copy(ot)},this.setScissor=function(E,N,k,V){E.isVector4?ot.set(E.x,E.y,E.z,E.w):ot.set(E,N,k,V),Mt.scissor(H.copy(ot).multiplyScalar(Y).floor())},this.getScissorTest=function(){return ct},this.setScissorTest=function(E){Mt.setScissorTest(ct=E)},this.setOpaqueSort=function(E){$=E},this.setTransparentSort=function(E){q=E},this.getClearColor=function(E){return E.copy(re.getClearColor())},this.setClearColor=function(){re.setClearColor.apply(re,arguments)},this.getClearAlpha=function(){return re.getClearAlpha()},this.setClearAlpha=function(){re.setClearAlpha.apply(re,arguments)},this.clear=function(E=!0,N=!0,k=!0){let V=0;if(E){let B=!1;if(A!==null){const _t=A.texture.format;B=_t===kh||_t===Bh||_t===Fh}if(B){const _t=A.texture.type,wt=_t===_i||_t===di||_t===Oa||_t===Ii||_t===zh||_t===Oh,It=re.getClearColor(),zt=re.getClearAlpha(),jt=It.r,Gt=It.g,Xt=It.b;wt?(p[0]=jt,p[1]=Gt,p[2]=Xt,p[3]=zt,O.clearBufferuiv(O.COLOR,0,p)):(_[0]=jt,_[1]=Gt,_[2]=Xt,_[3]=zt,O.clearBufferiv(O.COLOR,0,_))}else V|=O.COLOR_BUFFER_BIT}N&&(V|=O.DEPTH_BUFFER_BIT),k&&(V|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",tt,!1),e.removeEventListener("webglcontextrestored",D,!1),e.removeEventListener("webglcontextcreationerror",rt,!1),xt.dispose(),Pt.dispose(),Vt.dispose(),S.dispose(),z.dispose(),it.dispose(),P.dispose(),st.dispose(),yt.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",be),vt.removeEventListener("sessionend",ee),Et&&(Et.dispose(),Et=null),Ae.stop()};function tt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function D(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const E=de.autoReset,N=Z.enabled,k=Z.autoUpdate,V=Z.needsUpdate,B=Z.type;bt(),de.autoReset=E,Z.enabled=N,Z.autoUpdate=k,Z.needsUpdate=V,Z.type=B}function rt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function ft(E){const N=E.target;N.removeEventListener("dispose",ft),Dt(N)}function Dt(E){Ct(E),Vt.remove(E)}function Ct(E){const N=Vt.get(E).programs;N!==void 0&&(N.forEach(function(k){yt.releaseProgram(k)}),E.isShaderMaterial&&yt.releaseShaderCache(E))}this.renderBufferDirect=function(E,N,k,V,B,_t){N===null&&(N=Lt);const wt=B.isMesh&&B.matrixWorld.determinant()<0,It=Qu(E,N,k,V,B);Mt.setMaterial(V,wt);let zt=k.index,jt=1;if(V.wireframe===!0){if(zt=Q.getWireframeAttribute(k),zt===void 0)return;jt=2}const Gt=k.drawRange,Xt=k.attributes.position;let Ee=Gt.start*jt,cn=(Gt.start+Gt.count)*jt;_t!==null&&(Ee=Math.max(Ee,_t.start*jt),cn=Math.min(cn,(_t.start+_t.count)*jt)),zt!==null?(Ee=Math.max(Ee,0),cn=Math.min(cn,zt.count)):Xt!=null&&(Ee=Math.max(Ee,0),cn=Math.min(cn,Xt.count));const Ne=cn-Ee;if(Ne<0||Ne===1/0)return;P.setup(B,V,It,k,zt);let Wn,ve=Nt;if(zt!==null&&(Wn=nt.get(zt),ve=At,ve.setIndex(Wn)),B.isMesh)V.wireframe===!0?(Mt.setLineWidth(V.wireframeLinewidth*Zt()),ve.setMode(O.LINES)):ve.setMode(O.TRIANGLES);else if(B.isLine){let Kt=V.linewidth;Kt===void 0&&(Kt=1),Mt.setLineWidth(Kt*Zt()),B.isLineSegments?ve.setMode(O.LINES):B.isLineLoop?ve.setMode(O.LINE_LOOP):ve.setMode(O.LINE_STRIP)}else B.isPoints?ve.setMode(O.POINTS):B.isSprite&&ve.setMode(O.TRIANGLES);if(B.isBatchedMesh)ve.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else if(B.isInstancedMesh)ve.renderInstances(Ee,Ne,B.count);else if(k.isInstancedBufferGeometry){const Kt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,To=Math.min(k.instanceCount,Kt);ve.renderInstances(Ee,Ne,To)}else ve.render(Ee,Ne)};function Qt(E,N,k){E.transparent===!0&&E.side===dn&&E.forceSinglePass===!1?(E.side=rn,E.needsUpdate=!0,xr(E,N,k),E.side=xi,E.needsUpdate=!0,xr(E,N,k),E.side=dn):xr(E,N,k)}this.compile=function(E,N,k=null){k===null&&(k=E),m=Pt.get(k),m.init(),v.push(m),k.traverseVisible(function(B){B.isLight&&B.layers.test(N.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),E!==k&&E.traverseVisible(function(B){B.isLight&&B.layers.test(N.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),m.setupLights(x._useLegacyLights);const V=new Set;return E.traverse(function(B){const _t=B.material;if(_t)if(Array.isArray(_t))for(let wt=0;wt<_t.length;wt++){const It=_t[wt];Qt(It,k,B),V.add(It)}else Qt(_t,k,B),V.add(_t)}),v.pop(),m=null,V},this.compileAsync=function(E,N,k=null){const V=this.compile(E,N,k);return new Promise(B=>{function _t(){if(V.forEach(function(wt){Vt.get(wt).currentProgram.isReady()&&V.delete(wt)}),V.size===0){B(E);return}setTimeout(_t,10)}Rt.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let te=null;function ye(E){te&&te(E)}function be(){Ae.stop()}function ee(){Ae.start()}const Ae=new tu;Ae.setAnimationLoop(ye),typeof self<"u"&&Ae.setContext(self),this.setAnimationLoop=function(E){te=E,vt.setAnimationLoop(E),E===null?Ae.stop():Ae.start()},vt.addEventListener("sessionstart",be),vt.addEventListener("sessionend",ee),this.render=function(E,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(N),N=vt.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,N,A),m=Pt.get(E,v.length),m.init(),v.push(m),St.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),X.setFromProjectionMatrix(St),mt=this.localClippingEnabled,J=Wt.init(this.clippingPlanes,mt),g=xt.get(E,d.length),g.init(),d.push(g),Ln(E,N,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort($,q),this.info.render.frame++,J===!0&&Wt.beginShadows();const k=m.state.shadowsArray;if(Z.render(k,E,N),J===!0&&Wt.endShadows(),this.info.autoReset===!0&&this.info.reset(),re.render(g,E),m.setupLights(x._useLegacyLights),N.isArrayCamera){const V=N.cameras;for(let B=0,_t=V.length;B<_t;B++){const wt=V[B];Mc(g,E,wt,wt.viewport)}}else Mc(g,E,N);A!==null&&(T.updateMultisampleRenderTarget(A),T.updateRenderTargetMipmap(A)),E.isScene===!0&&E.onAfterRender(x,E,N),P.resetDefaultState(),U=-1,y=null,v.pop(),v.length>0?m=v[v.length-1]:m=null,d.pop(),d.length>0?g=d[d.length-1]:g=null};function Ln(E,N,k,V){if(E.visible===!1)return;if(E.layers.test(N.layers)){if(E.isGroup)k=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(N);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||X.intersectsSprite(E)){V&&kt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(St);const wt=it.update(E),It=E.material;It.visible&&g.push(E,wt,It,k,kt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||X.intersectsObject(E))){const wt=it.update(E),It=E.material;if(V&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),kt.copy(E.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),kt.copy(wt.boundingSphere.center)),kt.applyMatrix4(E.matrixWorld).applyMatrix4(St)),Array.isArray(It)){const zt=wt.groups;for(let jt=0,Gt=zt.length;jt<Gt;jt++){const Xt=zt[jt],Ee=It[Xt.materialIndex];Ee&&Ee.visible&&g.push(E,wt,Ee,k,kt.z,Xt)}}else It.visible&&g.push(E,wt,It,k,kt.z,null)}}const _t=E.children;for(let wt=0,It=_t.length;wt<It;wt++)Ln(_t[wt],N,k,V)}function Mc(E,N,k,V){const B=E.opaque,_t=E.transmissive,wt=E.transparent;m.setupLightsView(k),J===!0&&Wt.setGlobalState(x.clippingPlanes,k),_t.length>0&&Zu(B,_t,N,k),V&&Mt.viewport(b.copy(V)),B.length>0&&vr(B,N,k),_t.length>0&&vr(_t,N,k),wt.length>0&&vr(wt,N,k),Mt.buffers.depth.setTest(!0),Mt.buffers.depth.setMask(!0),Mt.buffers.color.setMask(!0),Mt.setPolygonOffset(!1)}function Zu(E,N,k,V){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;const _t=Ut.isWebGL2;Et===null&&(Et=new Fi(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")?or:_i,minFilter:rr,samples:_t?4:0})),x.getDrawingBufferSize(Bt),_t?Et.setSize(Bt.x,Bt.y):Et.setSize(Aa(Bt.x),Aa(Bt.y));const wt=x.getRenderTarget();x.setRenderTarget(Et),x.getClearColor(K),I=x.getClearAlpha(),I<1&&x.setClearColor(16777215,.5),x.clear();const It=x.toneMapping;x.toneMapping=gi,vr(E,k,V),T.updateMultisampleRenderTarget(Et),T.updateRenderTargetMipmap(Et);let zt=!1;for(let jt=0,Gt=N.length;jt<Gt;jt++){const Xt=N[jt],Ee=Xt.object,cn=Xt.geometry,Ne=Xt.material,Wn=Xt.group;if(Ne.side===dn&&Ee.layers.test(V.layers)){const ve=Ne.side;Ne.side=rn,Ne.needsUpdate=!0,yc(Ee,k,V,cn,Ne,Wn),Ne.side=ve,Ne.needsUpdate=!0,zt=!0}}zt===!0&&(T.updateMultisampleRenderTarget(Et),T.updateRenderTargetMipmap(Et)),x.setRenderTarget(wt),x.setClearColor(K,I),x.toneMapping=It}function vr(E,N,k){const V=N.isScene===!0?N.overrideMaterial:null;for(let B=0,_t=E.length;B<_t;B++){const wt=E[B],It=wt.object,zt=wt.geometry,jt=V===null?wt.material:V,Gt=wt.group;It.layers.test(k.layers)&&yc(It,N,k,zt,jt,Gt)}}function yc(E,N,k,V,B,_t){E.onBeforeRender(x,N,k,V,B,_t),E.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),B.onBeforeRender(x,N,k,V,E,_t),B.transparent===!0&&B.side===dn&&B.forceSinglePass===!1?(B.side=rn,B.needsUpdate=!0,x.renderBufferDirect(k,N,V,B,E,_t),B.side=xi,B.needsUpdate=!0,x.renderBufferDirect(k,N,V,B,E,_t),B.side=dn):x.renderBufferDirect(k,N,V,B,E,_t),E.onAfterRender(x,N,k,V,B,_t)}function xr(E,N,k){N.isScene!==!0&&(N=Lt);const V=Vt.get(E),B=m.state.lights,_t=m.state.shadowsArray,wt=B.state.version,It=yt.getParameters(E,B.state,_t,N,k),zt=yt.getProgramCacheKey(It);let jt=V.programs;V.environment=E.isMeshStandardMaterial?N.environment:null,V.fog=N.fog,V.envMap=(E.isMeshStandardMaterial?z:S).get(E.envMap||V.environment),jt===void 0&&(E.addEventListener("dispose",ft),jt=new Map,V.programs=jt);let Gt=jt.get(zt);if(Gt!==void 0){if(V.currentProgram===Gt&&V.lightsStateVersion===wt)return bc(E,It),Gt}else It.uniforms=yt.getUniforms(E),E.onBuild(k,It,x),E.onBeforeCompile(It,x),Gt=yt.acquireProgram(It,zt),jt.set(zt,Gt),V.uniforms=It.uniforms;const Xt=V.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Xt.clippingPlanes=Wt.uniform),bc(E,It),V.needsLights=ef(E),V.lightsStateVersion=wt,V.needsLights&&(Xt.ambientLightColor.value=B.state.ambient,Xt.lightProbe.value=B.state.probe,Xt.directionalLights.value=B.state.directional,Xt.directionalLightShadows.value=B.state.directionalShadow,Xt.spotLights.value=B.state.spot,Xt.spotLightShadows.value=B.state.spotShadow,Xt.rectAreaLights.value=B.state.rectArea,Xt.ltc_1.value=B.state.rectAreaLTC1,Xt.ltc_2.value=B.state.rectAreaLTC2,Xt.pointLights.value=B.state.point,Xt.pointLightShadows.value=B.state.pointShadow,Xt.hemisphereLights.value=B.state.hemi,Xt.directionalShadowMap.value=B.state.directionalShadowMap,Xt.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Xt.spotShadowMap.value=B.state.spotShadowMap,Xt.spotLightMatrix.value=B.state.spotLightMatrix,Xt.spotLightMap.value=B.state.spotLightMap,Xt.pointShadowMap.value=B.state.pointShadowMap,Xt.pointShadowMatrix.value=B.state.pointShadowMatrix),V.currentProgram=Gt,V.uniformsList=null,Gt}function Sc(E){if(E.uniformsList===null){const N=E.currentProgram.getUniforms();E.uniformsList=Yr.seqWithValue(N.seq,E.uniforms)}return E.uniformsList}function bc(E,N){const k=Vt.get(E);k.outputColorSpace=N.outputColorSpace,k.batching=N.batching,k.instancing=N.instancing,k.instancingColor=N.instancingColor,k.skinning=N.skinning,k.morphTargets=N.morphTargets,k.morphNormals=N.morphNormals,k.morphColors=N.morphColors,k.morphTargetsCount=N.morphTargetsCount,k.numClippingPlanes=N.numClippingPlanes,k.numIntersection=N.numClipIntersection,k.vertexAlphas=N.vertexAlphas,k.vertexTangents=N.vertexTangents,k.toneMapping=N.toneMapping}function Qu(E,N,k,V,B){N.isScene!==!0&&(N=Lt),T.resetTextureUnits();const _t=N.fog,wt=V.isMeshStandardMaterial?N.environment:null,It=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ri,zt=(V.isMeshStandardMaterial?z:S).get(V.envMap||wt),jt=V.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Gt=!!k.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Xt=!!k.morphAttributes.position,Ee=!!k.morphAttributes.normal,cn=!!k.morphAttributes.color;let Ne=gi;V.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ne=x.toneMapping);const Wn=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ve=Wn!==void 0?Wn.length:0,Kt=Vt.get(V),To=m.state.lights;if(J===!0&&(mt===!0||E!==y)){const _n=E===y&&V.id===U;Wt.setState(V,E,_n)}let Se=!1;V.version===Kt.__version?(Kt.needsLights&&Kt.lightsStateVersion!==To.state.version||Kt.outputColorSpace!==It||B.isBatchedMesh&&Kt.batching===!1||!B.isBatchedMesh&&Kt.batching===!0||B.isInstancedMesh&&Kt.instancing===!1||!B.isInstancedMesh&&Kt.instancing===!0||B.isSkinnedMesh&&Kt.skinning===!1||!B.isSkinnedMesh&&Kt.skinning===!0||B.isInstancedMesh&&Kt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Kt.instancingColor===!1&&B.instanceColor!==null||Kt.envMap!==zt||V.fog===!0&&Kt.fog!==_t||Kt.numClippingPlanes!==void 0&&(Kt.numClippingPlanes!==Wt.numPlanes||Kt.numIntersection!==Wt.numIntersection)||Kt.vertexAlphas!==jt||Kt.vertexTangents!==Gt||Kt.morphTargets!==Xt||Kt.morphNormals!==Ee||Kt.morphColors!==cn||Kt.toneMapping!==Ne||Ut.isWebGL2===!0&&Kt.morphTargetsCount!==ve)&&(Se=!0):(Se=!0,Kt.__version=V.version);let yi=Kt.currentProgram;Se===!0&&(yi=xr(V,N,B));let Ec=!1,Gs=!1,Ao=!1;const We=yi.getUniforms(),Si=Kt.uniforms;if(Mt.useProgram(yi.program)&&(Ec=!0,Gs=!0,Ao=!0),V.id!==U&&(U=V.id,Gs=!0),Ec||y!==E){We.setValue(O,"projectionMatrix",E.projectionMatrix),We.setValue(O,"viewMatrix",E.matrixWorldInverse);const _n=We.map.cameraPosition;_n!==void 0&&_n.setValue(O,kt.setFromMatrixPosition(E.matrixWorld)),Ut.logarithmicDepthBuffer&&We.setValue(O,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&We.setValue(O,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Gs=!0,Ao=!0)}if(B.isSkinnedMesh){We.setOptional(O,B,"bindMatrix"),We.setOptional(O,B,"bindMatrixInverse");const _n=B.skeleton;_n&&(Ut.floatVertexTextures?(_n.boneTexture===null&&_n.computeBoneTexture(),We.setValue(O,"boneTexture",_n.boneTexture,T)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}B.isBatchedMesh&&(We.setOptional(O,B,"batchingTexture"),We.setValue(O,"batchingTexture",B._matricesTexture,T));const Ro=k.morphAttributes;if((Ro.position!==void 0||Ro.normal!==void 0||Ro.color!==void 0&&Ut.isWebGL2===!0)&&Yt.update(B,k,yi),(Gs||Kt.receiveShadow!==B.receiveShadow)&&(Kt.receiveShadow=B.receiveShadow,We.setValue(O,"receiveShadow",B.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(Si.envMap.value=zt,Si.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),Gs&&(We.setValue(O,"toneMappingExposure",x.toneMappingExposure),Kt.needsLights&&tf(Si,Ao),_t&&V.fog===!0&&dt.refreshFogUniforms(Si,_t),dt.refreshMaterialUniforms(Si,V,Y,W,Et),Yr.upload(O,Sc(Kt),Si,T)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Yr.upload(O,Sc(Kt),Si,T),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&We.setValue(O,"center",B.center),We.setValue(O,"modelViewMatrix",B.modelViewMatrix),We.setValue(O,"normalMatrix",B.normalMatrix),We.setValue(O,"modelMatrix",B.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const _n=V.uniformsGroups;for(let Co=0,nf=_n.length;Co<nf;Co++)if(Ut.isWebGL2){const wc=_n[Co];st.update(wc,yi),st.bind(wc,yi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return yi}function tf(E,N){E.ambientLightColor.needsUpdate=N,E.lightProbe.needsUpdate=N,E.directionalLights.needsUpdate=N,E.directionalLightShadows.needsUpdate=N,E.pointLights.needsUpdate=N,E.pointLightShadows.needsUpdate=N,E.spotLights.needsUpdate=N,E.spotLightShadows.needsUpdate=N,E.rectAreaLights.needsUpdate=N,E.hemisphereLights.needsUpdate=N}function ef(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(E,N,k){Vt.get(E.texture).__webglTexture=N,Vt.get(E.depthTexture).__webglTexture=k;const V=Vt.get(E);V.__hasExternalTextures=!0,V.__hasExternalTextures&&(V.__autoAllocateDepthBuffer=k===void 0,V.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(E,N){const k=Vt.get(E);k.__webglFramebuffer=N,k.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(E,N=0,k=0){A=E,C=N,w=k;let V=!0,B=null,_t=!1,wt=!1;if(E){const zt=Vt.get(E);zt.__useDefaultFramebuffer!==void 0?(Mt.bindFramebuffer(O.FRAMEBUFFER,null),V=!1):zt.__webglFramebuffer===void 0?T.setupRenderTarget(E):zt.__hasExternalTextures&&T.rebindTextures(E,Vt.get(E.texture).__webglTexture,Vt.get(E.depthTexture).__webglTexture);const jt=E.texture;(jt.isData3DTexture||jt.isDataArrayTexture||jt.isCompressedArrayTexture)&&(wt=!0);const Gt=Vt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Gt[N])?B=Gt[N][k]:B=Gt[N],_t=!0):Ut.isWebGL2&&E.samples>0&&T.useMultisampledRTT(E)===!1?B=Vt.get(E).__webglMultisampledFramebuffer:Array.isArray(Gt)?B=Gt[k]:B=Gt,b.copy(E.viewport),H.copy(E.scissor),G=E.scissorTest}else b.copy(j).multiplyScalar(Y).floor(),H.copy(ot).multiplyScalar(Y).floor(),G=ct;if(Mt.bindFramebuffer(O.FRAMEBUFFER,B)&&Ut.drawBuffers&&V&&Mt.drawBuffers(E,B),Mt.viewport(b),Mt.scissor(H),Mt.setScissorTest(G),_t){const zt=Vt.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+N,zt.__webglTexture,k)}else if(wt){const zt=Vt.get(E.texture),jt=N||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,zt.__webglTexture,k||0,jt)}U=-1},this.readRenderTargetPixels=function(E,N,k,V,B,_t,wt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=Vt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&wt!==void 0&&(It=It[wt]),It){Mt.bindFramebuffer(O.FRAMEBUFFER,It);try{const zt=E.texture,jt=zt.format,Gt=zt.type;if(jt!==xn&&gt.convert(jt)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Xt=Gt===or&&(Rt.has("EXT_color_buffer_half_float")||Ut.isWebGL2&&Rt.has("EXT_color_buffer_float"));if(Gt!==_i&&gt.convert(Gt)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Gt===pi&&(Ut.isWebGL2||Rt.has("OES_texture_float")||Rt.has("WEBGL_color_buffer_float")))&&!Xt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=E.width-V&&k>=0&&k<=E.height-B&&O.readPixels(N,k,V,B,gt.convert(jt),gt.convert(Gt),_t)}finally{const zt=A!==null?Vt.get(A).__webglFramebuffer:null;Mt.bindFramebuffer(O.FRAMEBUFFER,zt)}}},this.copyFramebufferToTexture=function(E,N,k=0){const V=Math.pow(2,-k),B=Math.floor(N.image.width*V),_t=Math.floor(N.image.height*V);T.setTexture2D(N,0),O.copyTexSubImage2D(O.TEXTURE_2D,k,0,0,E.x,E.y,B,_t),Mt.unbindTexture()},this.copyTextureToTexture=function(E,N,k,V=0){const B=N.image.width,_t=N.image.height,wt=gt.convert(k.format),It=gt.convert(k.type);T.setTexture2D(k,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,k.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,k.unpackAlignment),N.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,V,E.x,E.y,B,_t,wt,It,N.image.data):N.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,V,E.x,E.y,N.mipmaps[0].width,N.mipmaps[0].height,wt,N.mipmaps[0].data):O.texSubImage2D(O.TEXTURE_2D,V,E.x,E.y,wt,It,N.image),V===0&&k.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),Mt.unbindTexture()},this.copyTextureToTexture3D=function(E,N,k,V,B=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const _t=E.max.x-E.min.x+1,wt=E.max.y-E.min.y+1,It=E.max.z-E.min.z+1,zt=gt.convert(V.format),jt=gt.convert(V.type);let Gt;if(V.isData3DTexture)T.setTexture3D(V,0),Gt=O.TEXTURE_3D;else if(V.isDataArrayTexture||V.isCompressedArrayTexture)T.setTexture2DArray(V,0),Gt=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,V.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,V.unpackAlignment);const Xt=O.getParameter(O.UNPACK_ROW_LENGTH),Ee=O.getParameter(O.UNPACK_IMAGE_HEIGHT),cn=O.getParameter(O.UNPACK_SKIP_PIXELS),Ne=O.getParameter(O.UNPACK_SKIP_ROWS),Wn=O.getParameter(O.UNPACK_SKIP_IMAGES),ve=k.isCompressedTexture?k.mipmaps[B]:k.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,ve.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ve.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,E.min.x),O.pixelStorei(O.UNPACK_SKIP_ROWS,E.min.y),O.pixelStorei(O.UNPACK_SKIP_IMAGES,E.min.z),k.isDataTexture||k.isData3DTexture?O.texSubImage3D(Gt,B,N.x,N.y,N.z,_t,wt,It,zt,jt,ve.data):k.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),O.compressedTexSubImage3D(Gt,B,N.x,N.y,N.z,_t,wt,It,zt,ve.data)):O.texSubImage3D(Gt,B,N.x,N.y,N.z,_t,wt,It,zt,jt,ve),O.pixelStorei(O.UNPACK_ROW_LENGTH,Xt),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Ee),O.pixelStorei(O.UNPACK_SKIP_PIXELS,cn),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ne),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Wn),B===0&&V.generateMipmaps&&O.generateMipmap(Gt),Mt.unbindTexture()},this.initTexture=function(E){E.isCubeTexture?T.setTextureCube(E,0):E.isData3DTexture?T.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?T.setTexture2DArray(E,0):T.setTexture2D(E,0),Mt.unbindTexture()},this.resetState=function(){C=0,w=0,A=null,Mt.reset(),P.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ba?"display-p3":"srgb",e.unpackColorSpace=he.workingColorSpace===uo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ce?Ni:Gh}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Ni?Ce:ri}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class l_ extends cu{}l_.prototype.isWebGL1Renderer=!0;class Va{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new qt(t),this.near=e,this.far=n}clone(){return new Va(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class h_ extends Fe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class u_ extends en{constructor(t=null,e=1,n=1,s,r,o,a,c,h=Ve,l=Ve,u,f){super(null,o,a,c,h,l,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $l extends mn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ds=new le,ql=new le,Gr=[],Yl=new Vi,f_=new le,Ys=new Ht,js=new zs;class er extends Ht{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new $l(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,f_)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Vi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ds),Yl.copy(t.boundingBox).applyMatrix4(ds),this.boundingBox.union(Yl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new zs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ds),js.copy(t.boundingSphere).applyMatrix4(ds),this.boundingSphere.union(js)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Ys.geometry=this.geometry,Ys.material=this.material,Ys.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),js.copy(this.boundingSphere),js.applyMatrix4(n),t.ray.intersectsSphere(js)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ds),ql.multiplyMatrices(n,ds),Ys.matrixWorld=ql,Ys.raycast(t,Gr);for(let o=0,a=Gr.length;o<a;o++){const c=Gr[o];c.instanceId=r,c.object=this,e.push(c)}Gr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new $l(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Wa extends Wi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const jl=new R,Kl=new R,Jl=new le,oa=new fo,Vr=new zs;class lu extends Fe{constructor(t=new Te,e=new Wa){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)jl.fromBufferAttribute(e,s-1),Kl.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=jl.distanceTo(Kl);t.setAttribute("lineDistance",new se(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vr.copy(n.boundingSphere),Vr.applyMatrix4(s),Vr.radius+=r,t.ray.intersectsSphere(Vr)===!1)return;Jl.copy(s).invert(),oa.copy(t.ray).applyMatrix4(Jl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,h=new R,l=new R,u=new R,f=new R,p=this.isLineSegments?2:1,_=n.index,m=n.attributes.position;if(_!==null){const d=Math.max(0,o.start),v=Math.min(_.count,o.start+o.count);for(let x=d,M=v-1;x<M;x+=p){const C=_.getX(x),w=_.getX(x+1);if(h.fromBufferAttribute(m,C),l.fromBufferAttribute(m,w),oa.distanceSqToSegment(h,l,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const U=t.ray.origin.distanceTo(f);U<t.near||U>t.far||e.push({distance:U,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const d=Math.max(0,o.start),v=Math.min(m.count,o.start+o.count);for(let x=d,M=v-1;x<M;x+=p){if(h.fromBufferAttribute(m,x),l.fromBufferAttribute(m,x+1),oa.distanceSqToSegment(h,l,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const w=t.ray.origin.distanceTo(f);w<t.near||w>t.far||e.push({distance:w,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const Zl=new R,Ql=new R;class d_ extends lu{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Zl.fromBufferAttribute(e,s),Ql.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Zl.distanceTo(Ql);t.setAttribute("lineDistance",new se(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Xa extends en{constructor(t,e,n,s,r,o,a,c,h){super(t,e,n,s,r,o,a,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Gn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,h;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),h=n[s]-o,h<0)a=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const l=n[s],f=n[s+1]-l,p=(o-l)/f;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new ht:new R);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new R,s=[],r=[],o=[],a=new R,c=new le;for(let p=0;p<=t;p++){const _=p/t;s[p]=this.getTangentAt(_,new R)}r[0]=new R,o[0]=new R;let h=Number.MAX_VALUE;const l=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);l<=h&&(h=l,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),f<=h&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();const _=Math.acos(Oe(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(a,_))}o[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(Oe(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(p=-p);for(let _=1;_<=t;_++)r[_].applyMatrix4(c.makeRotationAxis(s[_],p*_)),o[_].crossVectors(s[_],r[_])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class $a extends Gn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){const n=e||new ht,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),h=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const l=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,p=h-this.aY;c=f*l-p*u+this.aX,h=f*u+p*l+this.aY}return n.set(c,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class p_ extends $a{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function qa(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,h){s(o,a,h*(a-r),h*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,h,l,u){let f=(o-r)/h-(a-r)/(h+l)+(a-o)/l,p=(a-o)/l-(c-o)/(l+u)+(c-a)/u;f*=l,p*=l,s(o,a,f,p)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Wr=new R,aa=new qa,ca=new qa,la=new qa;class Ya extends Gn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new R){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let h,l;this.closed||a>0?h=s[(a-1)%r]:(Wr.subVectors(s[0],s[1]).add(s[0]),h=Wr);const u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?l=s[(a+2)%r]:(Wr.subVectors(s[r-1],s[r-2]).add(s[r-1]),l=Wr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let _=Math.pow(h.distanceToSquared(u),p),g=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(l),p);g<1e-4&&(g=1),_<1e-4&&(_=g),m<1e-4&&(m=g),aa.initNonuniformCatmullRom(h.x,u.x,f.x,l.x,_,g,m),ca.initNonuniformCatmullRom(h.y,u.y,f.y,l.y,_,g,m),la.initNonuniformCatmullRom(h.z,u.z,f.z,l.z,_,g,m)}else this.curveType==="catmullrom"&&(aa.initCatmullRom(h.x,u.x,f.x,l.x,this.tension),ca.initCatmullRom(h.y,u.y,f.y,l.y,this.tension),la.initCatmullRom(h.z,u.z,f.z,l.z,this.tension));return n.set(aa.calc(c),ca.calc(c),la.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new R().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function th(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function m_(i,t){const e=1-i;return e*e*t}function g_(i,t){return 2*(1-i)*i*t}function __(i,t){return i*i*t}function nr(i,t,e,n){return m_(i,t)+g_(i,e)+__(i,n)}function v_(i,t){const e=1-i;return e*e*e*t}function x_(i,t){const e=1-i;return 3*e*e*i*t}function M_(i,t){return 3*(1-i)*i*i*t}function y_(i,t){return i*i*i*t}function ir(i,t,e,n,s){return v_(i,t)+x_(i,e)+M_(i,n)+y_(i,s)}class hu extends Gn{constructor(t=new ht,e=new ht,n=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ir(t,s.x,r.x,o.x,a.x),ir(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class S_ extends Gn{constructor(t=new R,e=new R,n=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new R){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ir(t,s.x,r.x,o.x,a.x),ir(t,s.y,r.y,o.y,a.y),ir(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class uu extends Gn{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class b_ extends Gn{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class fu extends Gn{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(nr(t,s.x,r.x,o.x),nr(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class E_ extends Gn{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(nr(t,s.x,r.x,o.x),nr(t,s.y,r.y,o.y),nr(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class du extends Gn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],h=s[o],l=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(th(a,c.x,h.x,l.x,u.x),th(a,c.y,h.y,l.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ht().fromArray(s))}return this}}var eh=Object.freeze({__proto__:null,ArcCurve:p_,CatmullRomCurve3:Ya,CubicBezierCurve:hu,CubicBezierCurve3:S_,EllipseCurve:$a,LineCurve:uu,LineCurve3:b_,QuadraticBezierCurve:fu,QuadraticBezierCurve3:E_,SplineCurve:du});class w_ extends Gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new eh[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),h=c===0?0:1-o/c;return a.getPointAt(h,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let h=0;h<c.length;h++){const l=c[h];n&&n.equals(l)||(e.push(l),n=l)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new eh[s.type]().fromJSON(s))}return this}}class T_ extends w_{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new uu(this.currentPoint.clone(),new ht(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new fu(this.currentPoint.clone(),new ht(t,e),new ht(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new hu(this.currentPoint.clone(),new ht(t,e),new ht(n,s),new ht(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new du(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const h=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(t+h,e+l,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const h=new $a(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const l=h.getPoint(1);return this.currentPoint.copy(l),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ja extends Te{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Oe(s,0,Math.PI*2);const r=[],o=[],a=[],c=[],h=[],l=1/e,u=new R,f=new ht,p=new R,_=new R,g=new R;let m=0,d=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:m=t[v+1].x-t[v].x,d=t[v+1].y-t[v].y,p.x=d*1,p.y=-m,p.z=d*0,g.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case t.length-1:c.push(g.x,g.y,g.z);break;default:m=t[v+1].x-t[v].x,d=t[v+1].y-t[v].y,p.x=d*1,p.y=-m,p.z=d*0,_.copy(p),p.x+=g.x,p.y+=g.y,p.z+=g.z,p.normalize(),c.push(p.x,p.y,p.z),g.copy(_)}for(let v=0;v<=e;v++){const x=n+v*l*s,M=Math.sin(x),C=Math.cos(x);for(let w=0;w<=t.length-1;w++){u.x=t[w].x*M,u.y=t[w].y,u.z=t[w].x*C,o.push(u.x,u.y,u.z),f.x=v/e,f.y=w/(t.length-1),a.push(f.x,f.y);const A=c[3*w+0]*M,U=c[3*w+1],y=c[3*w+0]*C;h.push(A,U,y)}}for(let v=0;v<e;v++)for(let x=0;x<t.length-1;x++){const M=x+v*t.length,C=M,w=M+t.length,A=M+t.length+1,U=M+1;r.push(C,w,U),r.push(A,U,w)}this.setIndex(r),this.setAttribute("position",new se(o,3)),this.setAttribute("uv",new se(a,2)),this.setAttribute("normal",new se(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ja(t.points,t.segments,t.phiStart,t.phiLength)}}class Ka extends ja{constructor(t=1,e=1,n=4,s=8){const r=new T_;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new Ka(t.radius,t.length,t.capSegments,t.radialSegments)}}class ki extends Te{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],h=new R,l=new ht;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const p=n+u/e*s;h.x=t*Math.cos(p),h.y=t*Math.sin(p),o.push(h.x,h.y,h.z),a.push(0,0,1),l.x=(o[f]/t+1)/2,l.y=(o[f+1]/t+1)/2,c.push(l.x,l.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new se(o,3)),this.setAttribute("normal",new se(a,3)),this.setAttribute("uv",new se(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ki(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class on extends Te{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const l=[],u=[],f=[],p=[];let _=0;const g=[],m=n/2;let d=0;v(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(l),this.setAttribute("position",new se(u,3)),this.setAttribute("normal",new se(f,3)),this.setAttribute("uv",new se(p,2));function v(){const M=new R,C=new R;let w=0;const A=(e-t)/n;for(let U=0;U<=r;U++){const y=[],b=U/r,H=b*(e-t)+t;for(let G=0;G<=s;G++){const K=G/s,I=K*c+a,F=Math.sin(I),W=Math.cos(I);C.x=H*F,C.y=-b*n+m,C.z=H*W,u.push(C.x,C.y,C.z),M.set(F,A,W).normalize(),f.push(M.x,M.y,M.z),p.push(K,1-b),y.push(_++)}g.push(y)}for(let U=0;U<s;U++)for(let y=0;y<r;y++){const b=g[y][U],H=g[y+1][U],G=g[y+1][U+1],K=g[y][U+1];l.push(b,H,K),l.push(H,G,K),w+=6}h.addGroup(d,w,0),d+=w}function x(M){const C=_,w=new ht,A=new R;let U=0;const y=M===!0?t:e,b=M===!0?1:-1;for(let G=1;G<=s;G++)u.push(0,m*b,0),f.push(0,b,0),p.push(.5,.5),_++;const H=_;for(let G=0;G<=s;G++){const I=G/s*c+a,F=Math.cos(I),W=Math.sin(I);A.x=y*W,A.y=m*b,A.z=y*F,u.push(A.x,A.y,A.z),f.push(0,b,0),w.x=F*.5+.5,w.y=W*.5*b+.5,p.push(w.x,w.y),_++}for(let G=0;G<s;G++){const K=C+G,I=H+G;M===!0?l.push(I,I+1,K):l.push(I+1,I,K),U+=3}h.addGroup(d,U,M===!0?1:2),d+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new on(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Bn extends on{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Bn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class hr extends Te{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),h(n),l(),this.setAttribute("position",new se(r,3)),this.setAttribute("normal",new se(r.slice(),3)),this.setAttribute("uv",new se(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){const x=new R,M=new R,C=new R;for(let w=0;w<e.length;w+=3)p(e[w+0],x),p(e[w+1],M),p(e[w+2],C),c(x,M,C,v)}function c(v,x,M,C){const w=C+1,A=[];for(let U=0;U<=w;U++){A[U]=[];const y=v.clone().lerp(M,U/w),b=x.clone().lerp(M,U/w),H=w-U;for(let G=0;G<=H;G++)G===0&&U===w?A[U][G]=y:A[U][G]=y.clone().lerp(b,G/H)}for(let U=0;U<w;U++)for(let y=0;y<2*(w-U)-1;y++){const b=Math.floor(y/2);y%2===0?(f(A[U][b+1]),f(A[U+1][b]),f(A[U][b])):(f(A[U][b+1]),f(A[U+1][b+1]),f(A[U+1][b]))}}function h(v){const x=new R;for(let M=0;M<r.length;M+=3)x.x=r[M+0],x.y=r[M+1],x.z=r[M+2],x.normalize().multiplyScalar(v),r[M+0]=x.x,r[M+1]=x.y,r[M+2]=x.z}function l(){const v=new R;for(let x=0;x<r.length;x+=3){v.x=r[x+0],v.y=r[x+1],v.z=r[x+2];const M=m(v)/2/Math.PI+.5,C=d(v)/Math.PI+.5;o.push(M,1-C)}_(),u()}function u(){for(let v=0;v<o.length;v+=6){const x=o[v+0],M=o[v+2],C=o[v+4],w=Math.max(x,M,C),A=Math.min(x,M,C);w>.9&&A<.1&&(x<.2&&(o[v+0]+=1),M<.2&&(o[v+2]+=1),C<.2&&(o[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function p(v,x){const M=v*3;x.x=t[M+0],x.y=t[M+1],x.z=t[M+2]}function _(){const v=new R,x=new R,M=new R,C=new R,w=new ht,A=new ht,U=new ht;for(let y=0,b=0;y<r.length;y+=9,b+=6){v.set(r[y+0],r[y+1],r[y+2]),x.set(r[y+3],r[y+4],r[y+5]),M.set(r[y+6],r[y+7],r[y+8]),w.set(o[b+0],o[b+1]),A.set(o[b+2],o[b+3]),U.set(o[b+4],o[b+5]),C.copy(v).add(x).add(M).divideScalar(3);const H=m(C);g(w,b+0,v,H),g(A,b+2,x,H),g(U,b+4,M,H)}}function g(v,x,M,C){C<0&&v.x===1&&(o[x]=v.x-1),M.x===0&&M.z===0&&(o[x]=C/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function d(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hr(t.vertices,t.indices,t.radius,t.details)}}class so extends hr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new so(t.radius,t.detail)}}class kn extends hr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new kn(t.radius,t.detail)}}class mo extends hr{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new mo(t.radius,t.detail)}}class Xi extends Te{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],h=[],l=[];let u=t;const f=(e-t)/s,p=new R,_=new ht;for(let g=0;g<=s;g++){for(let m=0;m<=n;m++){const d=r+m/n*o;p.x=u*Math.cos(d),p.y=u*Math.sin(d),c.push(p.x,p.y,p.z),h.push(0,0,1),_.x=(p.x/e+1)/2,_.y=(p.y/e+1)/2,l.push(_.x,_.y)}u+=f}for(let g=0;g<s;g++){const m=g*(n+1);for(let d=0;d<n;d++){const v=d+m,x=v,M=v+n+1,C=v+n+2,w=v+1;a.push(x,M,w),a.push(M,C,w)}}this.setIndex(a),this.setAttribute("position",new se(c,3)),this.setAttribute("normal",new se(h,3)),this.setAttribute("uv",new se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class pn extends Te{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let h=0;const l=[],u=new R,f=new R,p=[],_=[],g=[],m=[];for(let d=0;d<=n;d++){const v=[],x=d/n;let M=0;d===0&&o===0?M=.5/e:d===n&&c===Math.PI&&(M=-.5/e);for(let C=0;C<=e;C++){const w=C/e;u.x=-t*Math.cos(s+w*r)*Math.sin(o+x*a),u.y=t*Math.cos(o+x*a),u.z=t*Math.sin(s+w*r)*Math.sin(o+x*a),_.push(u.x,u.y,u.z),f.copy(u).normalize(),g.push(f.x,f.y,f.z),m.push(w+M,1-x),v.push(h++)}l.push(v)}for(let d=0;d<n;d++)for(let v=0;v<e;v++){const x=l[d][v+1],M=l[d][v],C=l[d+1][v],w=l[d+1][v+1];(d!==0||o>0)&&p.push(x,M,w),(d!==n-1||c<Math.PI)&&p.push(M,C,w)}this.setIndex(p),this.setAttribute("position",new se(_,3)),this.setAttribute("normal",new se(g,3)),this.setAttribute("uv",new se(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class wn extends Te{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],h=[],l=new R,u=new R,f=new R;for(let p=0;p<=n;p++)for(let _=0;_<=s;_++){const g=_/s*r,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(g),u.y=(t+e*Math.cos(m))*Math.sin(g),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),l.x=t*Math.cos(g),l.y=t*Math.sin(g),f.subVectors(u,l).normalize(),c.push(f.x,f.y,f.z),h.push(_/s),h.push(p/n)}for(let p=1;p<=n;p++)for(let _=1;_<=s;_++){const g=(s+1)*p+_-1,m=(s+1)*(p-1)+_-1,d=(s+1)*(p-1)+_,v=(s+1)*p+_;o.push(g,m,v),o.push(m,d,v)}this.setIndex(o),this.setAttribute("position",new se(a,3)),this.setAttribute("normal",new se(c,3)),this.setAttribute("uv",new se(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Cn extends Wi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fa,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class A_ extends Wi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fa,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=za,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ja extends Fe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class R_ extends Ja{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Fe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ha=new le,nh=new R,ih=new R;class pu{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.map=null,this.mapPass=null,this.matrix=new le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ha,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new ge(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;nh.setFromMatrixPosition(t.matrixWorld),e.position.copy(nh),ih.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ih),e.updateMatrixWorld(),ha.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ha),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ha)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const sh=new le,Ks=new R,ua=new R;class C_ extends pu{constructor(){super(new un(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ht(4,2),this._viewportCount=6,this._viewports=[new ge(2,1,1,1),new ge(0,1,1,1),new ge(3,1,1,1),new ge(1,1,1,1),new ge(3,0,1,1),new ge(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ks.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ks),ua.copy(n.position),ua.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ua),n.updateMatrixWorld(),s.makeTranslation(-Ks.x,-Ks.y,-Ks.z),sh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sh)}}class P_ extends Ja{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new C_}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class L_ extends pu{constructor(){super(new eu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class mu extends Ja{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Fe.DEFAULT_UP),this.updateMatrix(),this.target=new Fe,this.shadow=new L_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class D_{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=rh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=rh();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function rh(){return(typeof performance>"u"?Date:performance).now()}class I_{constructor(t,e,n=0,s=1/0){this.ray=new fo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ka,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Ca(t,this,n,e),n.sort(oh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Ca(t[s],this,n,e);return n.sort(oh),n}}function oh(i,t){return i.distance-t.distance}function Ca(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,o=s.length;r<o;r++)Ca(s[r],t,e,!0)}}class ah{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Oe(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Na}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Na);const ch={type:"change"},fa={type:"start"},lh={type:"end"},Xr=new fo,hh=new fi,U_=Math.cos(70*id.DEG2RAD);class N_ extends Gi{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Zn.ROTATE,MIDDLE:Zn.DOLLY,RIGHT:Zn.PAN},this.touches={ONE:Ki.ROTATE,TWO:Ki.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(P){P.addEventListener("keydown",Pt),this._domElementKeyEvents=P},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Pt),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(ch),n.update(),r=s.NONE},this.update=function(){const P=new R,st=new On().setFromUnitVectors(t.up,new R(0,1,0)),bt=st.clone().invert(),vt=new R,tt=new On,D=new R,rt=2*Math.PI;return function(Dt=null){const Ct=n.object.position;P.copy(Ct).sub(n.target),P.applyQuaternion(st),a.setFromVector3(P),n.autoRotate&&r===s.NONE&&G(b(Dt)),n.enableDamping?(a.theta+=c.theta*n.dampingFactor,a.phi+=c.phi*n.dampingFactor):(a.theta+=c.theta,a.phi+=c.phi);let Qt=n.minAzimuthAngle,te=n.maxAzimuthAngle;isFinite(Qt)&&isFinite(te)&&(Qt<-Math.PI?Qt+=rt:Qt>Math.PI&&(Qt-=rt),te<-Math.PI?te+=rt:te>Math.PI&&(te-=rt),Qt<=te?a.theta=Math.max(Qt,Math.min(te,a.theta)):a.theta=a.theta>(Qt+te)/2?Math.max(Qt,a.theta):Math.min(te,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(l,n.dampingFactor):n.target.add(l),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&w||n.object.isOrthographicCamera?a.radius=j(a.radius):a.radius=j(a.radius*h),P.setFromSpherical(a),P.applyQuaternion(bt),Ct.copy(n.target).add(P),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,l.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),l.set(0,0,0));let ye=!1;if(n.zoomToCursor&&w){let be=null;if(n.object.isPerspectiveCamera){const ee=P.length();be=j(ee*h);const Ae=ee-be;n.object.position.addScaledVector(M,Ae),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const ee=new R(C.x,C.y,0);ee.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),ye=!0;const Ae=new R(C.x,C.y,0);Ae.unproject(n.object),n.object.position.sub(Ae).add(ee),n.object.updateMatrixWorld(),be=P.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;be!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(be).add(n.object.position):(Xr.origin.copy(n.object.position),Xr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Xr.direction))<U_?t.lookAt(n.target):(hh.setFromNormalAndCoplanarPoint(n.object.up,n.target),Xr.intersectPlane(hh,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),ye=!0);return h=1,w=!1,ye||vt.distanceToSquared(n.object.position)>o||8*(1-tt.dot(n.object.quaternion))>o||D.distanceToSquared(n.target)>0?(n.dispatchEvent(ch),vt.copy(n.object.position),tt.copy(n.object.quaternion),D.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",re),n.domElement.removeEventListener("pointerdown",T),n.domElement.removeEventListener("pointercancel",z),n.domElement.removeEventListener("wheel",it),n.domElement.removeEventListener("pointermove",S),n.domElement.removeEventListener("pointerup",z),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Pt),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new ah,c=new ah;let h=1;const l=new R,u=new ht,f=new ht,p=new ht,_=new ht,g=new ht,m=new ht,d=new ht,v=new ht,x=new ht,M=new R,C=new ht;let w=!1;const A=[],U={};let y=!1;function b(P){return P!==null?2*Math.PI/60*n.autoRotateSpeed*P:2*Math.PI/60/60*n.autoRotateSpeed}function H(P){const st=Math.abs(P*.01);return Math.pow(.95,n.zoomSpeed*st)}function G(P){c.theta-=P}function K(P){c.phi-=P}const I=function(){const P=new R;return function(bt,vt){P.setFromMatrixColumn(vt,0),P.multiplyScalar(-bt),l.add(P)}}(),F=function(){const P=new R;return function(bt,vt){n.screenSpacePanning===!0?P.setFromMatrixColumn(vt,1):(P.setFromMatrixColumn(vt,0),P.crossVectors(n.object.up,P)),P.multiplyScalar(bt),l.add(P)}}(),W=function(){const P=new R;return function(bt,vt){const tt=n.domElement;if(n.object.isPerspectiveCamera){const D=n.object.position;P.copy(D).sub(n.target);let rt=P.length();rt*=Math.tan(n.object.fov/2*Math.PI/180),I(2*bt*rt/tt.clientHeight,n.object.matrix),F(2*vt*rt/tt.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(I(bt*(n.object.right-n.object.left)/n.object.zoom/tt.clientWidth,n.object.matrix),F(vt*(n.object.top-n.object.bottom)/n.object.zoom/tt.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function Y(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h/=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function $(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h*=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function q(P,st){if(!n.zoomToCursor)return;w=!0;const bt=n.domElement.getBoundingClientRect(),vt=P-bt.left,tt=st-bt.top,D=bt.width,rt=bt.height;C.x=vt/D*2-1,C.y=-(tt/rt)*2+1,M.set(C.x,C.y,1).unproject(n.object).sub(n.object.position).normalize()}function j(P){return Math.max(n.minDistance,Math.min(n.maxDistance,P))}function ot(P){u.set(P.clientX,P.clientY)}function ct(P){q(P.clientX,P.clientX),d.set(P.clientX,P.clientY)}function X(P){_.set(P.clientX,P.clientY)}function J(P){f.set(P.clientX,P.clientY),p.subVectors(f,u).multiplyScalar(n.rotateSpeed);const st=n.domElement;G(2*Math.PI*p.x/st.clientHeight),K(2*Math.PI*p.y/st.clientHeight),u.copy(f),n.update()}function mt(P){v.set(P.clientX,P.clientY),x.subVectors(v,d),x.y>0?Y(H(x.y)):x.y<0&&$(H(x.y)),d.copy(v),n.update()}function Et(P){g.set(P.clientX,P.clientY),m.subVectors(g,_).multiplyScalar(n.panSpeed),W(m.x,m.y),_.copy(g),n.update()}function St(P){q(P.clientX,P.clientY),P.deltaY<0?$(H(P.deltaY)):P.deltaY>0&&Y(H(P.deltaY)),n.update()}function Bt(P){let st=!1;switch(P.code){case n.keys.UP:P.ctrlKey||P.metaKey||P.shiftKey?K(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,n.keyPanSpeed),st=!0;break;case n.keys.BOTTOM:P.ctrlKey||P.metaKey||P.shiftKey?K(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,-n.keyPanSpeed),st=!0;break;case n.keys.LEFT:P.ctrlKey||P.metaKey||P.shiftKey?G(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(n.keyPanSpeed,0),st=!0;break;case n.keys.RIGHT:P.ctrlKey||P.metaKey||P.shiftKey?G(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(-n.keyPanSpeed,0),st=!0;break}st&&(P.preventDefault(),n.update())}function kt(P){if(A.length===1)u.set(P.pageX,P.pageY);else{const st=gt(P),bt=.5*(P.pageX+st.x),vt=.5*(P.pageY+st.y);u.set(bt,vt)}}function Lt(P){if(A.length===1)_.set(P.pageX,P.pageY);else{const st=gt(P),bt=.5*(P.pageX+st.x),vt=.5*(P.pageY+st.y);_.set(bt,vt)}}function Zt(P){const st=gt(P),bt=P.pageX-st.x,vt=P.pageY-st.y,tt=Math.sqrt(bt*bt+vt*vt);d.set(0,tt)}function O(P){n.enableZoom&&Zt(P),n.enablePan&&Lt(P)}function He(P){n.enableZoom&&Zt(P),n.enableRotate&&kt(P)}function Rt(P){if(A.length==1)f.set(P.pageX,P.pageY);else{const bt=gt(P),vt=.5*(P.pageX+bt.x),tt=.5*(P.pageY+bt.y);f.set(vt,tt)}p.subVectors(f,u).multiplyScalar(n.rotateSpeed);const st=n.domElement;G(2*Math.PI*p.x/st.clientHeight),K(2*Math.PI*p.y/st.clientHeight),u.copy(f)}function Ut(P){if(A.length===1)g.set(P.pageX,P.pageY);else{const st=gt(P),bt=.5*(P.pageX+st.x),vt=.5*(P.pageY+st.y);g.set(bt,vt)}m.subVectors(g,_).multiplyScalar(n.panSpeed),W(m.x,m.y),_.copy(g)}function Mt(P){const st=gt(P),bt=P.pageX-st.x,vt=P.pageY-st.y,tt=Math.sqrt(bt*bt+vt*vt);v.set(0,tt),x.set(0,Math.pow(v.y/d.y,n.zoomSpeed)),Y(x.y),d.copy(v);const D=(P.pageX+st.x)*.5,rt=(P.pageY+st.y)*.5;q(D,rt)}function de(P){n.enableZoom&&Mt(P),n.enablePan&&Ut(P)}function Vt(P){n.enableZoom&&Mt(P),n.enableRotate&&Rt(P)}function T(P){n.enabled!==!1&&(A.length===0&&(n.domElement.setPointerCapture(P.pointerId),n.domElement.addEventListener("pointermove",S),n.domElement.addEventListener("pointerup",z)),Yt(P),P.pointerType==="touch"?Wt(P):nt(P))}function S(P){n.enabled!==!1&&(P.pointerType==="touch"?Z(P):Q(P))}function z(P){Nt(P),A.length===0&&(n.domElement.releasePointerCapture(P.pointerId),n.domElement.removeEventListener("pointermove",S),n.domElement.removeEventListener("pointerup",z)),n.dispatchEvent(lh),r=s.NONE}function nt(P){let st;switch(P.button){case 0:st=n.mouseButtons.LEFT;break;case 1:st=n.mouseButtons.MIDDLE;break;case 2:st=n.mouseButtons.RIGHT;break;default:st=-1}switch(st){case Zn.DOLLY:if(n.enableZoom===!1)return;ct(P),r=s.DOLLY;break;case Zn.ROTATE:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enablePan===!1)return;X(P),r=s.PAN}else{if(n.enableRotate===!1)return;ot(P),r=s.ROTATE}break;case Zn.PAN:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enableRotate===!1)return;ot(P),r=s.ROTATE}else{if(n.enablePan===!1)return;X(P),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(fa)}function Q(P){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;J(P);break;case s.DOLLY:if(n.enableZoom===!1)return;mt(P);break;case s.PAN:if(n.enablePan===!1)return;Et(P);break}}function it(P){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(P.preventDefault(),n.dispatchEvent(fa),St(yt(P)),n.dispatchEvent(lh))}function yt(P){const st=P.deltaMode,bt={clientX:P.clientX,clientY:P.clientY,deltaY:P.deltaY};switch(st){case 1:bt.deltaY*=16;break;case 2:bt.deltaY*=100;break}return P.ctrlKey&&!y&&(bt.deltaY*=10),bt}function dt(P){P.key==="Control"&&(y=!0,document.addEventListener("keyup",xt,{passive:!0,capture:!0}))}function xt(P){P.key==="Control"&&(y=!1,document.removeEventListener("keyup",xt,{passive:!0,capture:!0}))}function Pt(P){n.enabled===!1||n.enablePan===!1||Bt(P)}function Wt(P){switch(At(P),A.length){case 1:switch(n.touches.ONE){case Ki.ROTATE:if(n.enableRotate===!1)return;kt(P),r=s.TOUCH_ROTATE;break;case Ki.PAN:if(n.enablePan===!1)return;Lt(P),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Ki.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;O(P),r=s.TOUCH_DOLLY_PAN;break;case Ki.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;He(P),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(fa)}function Z(P){switch(At(P),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Rt(P),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;Ut(P),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;de(P),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Vt(P),n.update();break;default:r=s.NONE}}function re(P){n.enabled!==!1&&P.preventDefault()}function Yt(P){A.push(P.pointerId)}function Nt(P){delete U[P.pointerId];for(let st=0;st<A.length;st++)if(A[st]==P.pointerId){A.splice(st,1);return}}function At(P){let st=U[P.pointerId];st===void 0&&(st=new ht,U[P.pointerId]=st),st.set(P.pageX,P.pageY)}function gt(P){const st=P.pointerId===A[0]?A[1]:A[0];return U[st]}n.domElement.addEventListener("contextmenu",re),n.domElement.addEventListener("pointerdown",T),n.domElement.addEventListener("pointercancel",z),n.domElement.addEventListener("wheel",it,{passive:!1}),document.addEventListener("keydown",dt,{passive:!0,capture:!0}),this.update()}}function gu(i){return{a:i>>>0,n:0,h:0,locked:!1}}function sr(i){if(i.locked)throw new Error("a dice draw while the rng is locked (a preview or legality check must never roll)");let t=i.a|0;t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);e=e+Math.imul(e^e>>>7,61|e)^e;const n=((e^e>>>14)>>>0)/4294967296;return i.a=t,i.n++,i.h=Math.imul(i.h,31)+Math.floor(n*4294967296)>>>0,n}const Za=i=>`${i.n}#${i.h.toString(36)}`,Nn={W:40,H:28,deploy:8},zi=1,go=12,ro=3,oo=5,ao=6,we=[{key:"squirrel",name:"Bushtail Clans",short:"Bushtails",color:"#ec8a34",dark:"#7a3d12",icon:"🐿️"},{key:"snake",name:"Coil of Ssithra",short:"Serpents",color:"#46c27a",dark:"#14532d",icon:"🐍"}],_u=[{key:"move",name:"Movement"},{key:"shoot",name:"Shooting"},{key:"charge",name:"Charge"},{key:"fight",name:"Fight"},{key:"morale",name:"Morale"}],z_={nutkin:{side:0,name:"Nutkin Skirmishers",short:"Nutkin",role:"Troops",models:6,base:.3,pts:7,M:7,WS:4,BS:4,S:3,T:3,W:1,A:1,Ld:6,Sv:6,OC:2,ranged:{name:"Slingshots",range:18,shots:2,S:3,AP:0,D:1,assault:!0,fx:"acorn"},melee:{name:"Twig knives",S:3,AP:0,D:1},abilities:["Scurry — may shoot after Advancing."]},grenadier:{side:0,name:"Acorn Grenadiers",short:"Grenadiers",role:"Troops",models:5,base:.3,pts:11,M:6,WS:4,BS:4,S:3,T:3,W:1,A:1,Ld:7,Sv:5,OC:1,ranged:{name:"Blasting acorns",range:12,shots:2,blast:1.6,S:4,AP:1,D:1,scenery:1,fx:"bomb"},melee:{name:"Twig knives",S:3,AP:0,D:1},abilities:['Blast — lobs 2 templates; a miss scatters D6+1".']},oakguard:{side:0,name:"Oak Guard",short:"Oak Guard",role:"Elite",models:5,base:.34,pts:22,M:5,WS:3,BS:5,S:4,T:4,W:2,A:2,Ld:8,Sv:3,OC:1,ranged:null,melee:{name:"Pinecone halberds",S:5,AP:2,D:1},abilities:["Bark shields — the clan’s anvil. No guns, all heart."]},glider:{side:0,name:"Glider Wing",short:"Gliders",role:"Fast",models:4,base:.32,pts:15,M:12,fly:!0,WS:3,BS:4,S:3,T:3,W:1,A:2,Ld:7,Sv:5,OC:1,ranged:{name:"Thorn darts",range:10,shots:2,S:3,AP:1,D:1,assault:!0,fx:"dart"},melee:{name:"Hooked claws",S:4,AP:1,D:1},abilities:["Fly — moves over scenery and enemy units.","Swoop — may shoot after Advancing."]},trebuchet:{side:0,name:"Pinecone Trebuchet",short:"Trebuchet",role:"Artillery",models:1,base:1.05,pts:95,M:3,WS:6,BS:4,S:3,T:5,W:7,A:2,Ld:7,Sv:4,OC:0,big:!0,ranged:{name:"Flaming pinecone",range:36,shots:1,blast:3,S:6,AP:1,D:2,indirect:!0,heavy:!0,scenery:3,fx:"pinecone"},melee:{name:"Crew mallets",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving."]},elder:{side:0,name:"Elder Chitterwick",short:"Elder",role:"Hero",models:1,base:.42,pts:80,hero:!0,M:6,WS:3,BS:3,S:4,T:4,W:5,A:3,Ld:9,Sv:4,OC:1,ranged:{name:"Thornburst",spell:6,range:18,shots:1,blast:2.4,S:5,AP:2,D:1,scenery:2,fx:"thorns"},melee:{name:"Rootwood staff",S:5,AP:1,D:2},abilities:["Spell — cast on 2D6 ≥ 6: thorns erupt under the target, no scatter.",`Grey whiskers — friends within ${ao}" use his Ld 9.`]},scaleguard:{side:1,name:"Scaleguard",short:"Scaleguard",role:"Troops",models:6,base:.32,pts:10,M:5,WS:3,BS:5,S:4,T:4,W:1,A:1,Ld:7,Sv:4,OC:2,ranged:{name:"Javelins",range:8,shots:1,S:4,AP:0,D:1,fx:"javelin"},melee:{name:"Serpent spears",S:4,AP:1,D:1},abilities:["Shield wall — the Coil’s steady line."]},spitter:{side:1,name:"Venom Spitters",short:"Spitters",role:"Troops",models:5,base:.32,pts:12,M:5,WS:4,BS:3,S:3,T:4,W:1,A:1,Ld:7,Sv:5,OC:1,ranged:{name:"Venom spit",range:12,shots:2,S:2,AP:1,D:1,poison:4,fx:"spit"},melee:{name:"Fangs",S:3,AP:0,D:1,poison:4},abilities:["Poison 4+ — always wounds on a 4+, however tough the target."]},sidewinder:{side:1,name:"Sidewinder Stalkers",short:"Sidewinders",role:"Fast",models:4,base:.34,pts:24,M:10,WS:3,BS:5,S:4,T:4,W:2,A:2,Ld:7,Sv:5,OC:1,ranged:null,melee:{name:"Twin sickles",S:4,AP:1,D:1},abilities:["Sidewind — may charge after Advancing."]},brute:{side:1,name:"Constrictor Brute",short:"Brute",role:"Monster",models:1,base:.95,pts:125,big:!0,M:6,WS:3,BS:6,S:6,T:6,W:9,A:4,Ld:8,Sv:4,OC:4,ranged:null,melee:{name:"Crushing coils",S:7,AP:2,D:2},abilities:["Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it)."],wrecker:!0},engine:{side:1,name:"Basilisk Venom Engine",short:"Venom Engine",role:"Artillery",models:1,base:1.05,pts:100,big:!0,M:4,WS:6,BS:4,S:3,T:6,W:7,A:1,Ld:7,Sv:3,OC:0,ranged:{name:"Acid globe",range:30,shots:1,blast:2.6,S:5,AP:2,D:2,poison:3,indirect:!0,heavy:!0,scenery:4,fx:"acid"},melee:{name:"Crew hooks",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving.","Acid — Poison 3+, and it eats stone."]},hierophant:{side:1,name:"Hierophant Ssithra",short:"Hierophant",role:"Hero",models:1,base:.45,pts:85,hero:!0,M:5,WS:3,BS:3,S:4,T:5,W:5,A:3,Ld:9,Sv:4,OC:1,ranged:{name:"Mesmerize",spell:7,range:18,mesmerize:!0,fx:"gaze"},melee:{name:"Fang staff",S:5,AP:2,D:2,poison:3},abilities:["Spell — cast on 2D6 ≥ 7: the target suffers D3 mortal wounds and is Mesmerized — it can’t shoot or charge next turn and hits at −1 in melee.",`Coiled will — friends within ${ao}" use her Ld 9.`]}},O_=[["elder","oakguard","nutkin","nutkin","grenadier","glider","trebuchet"],["hierophant","brute","scaleguard","scaleguard","spitter","sidewinder","engine"]],Qa=i=>1+Math.floor(sr(i.rng)*6),Ye=(i,t)=>Array.from({length:t},()=>Qa(i)),ii=(i,t)=>i.filter(e=>e>=t).length,F_=(i,t,e)=>i<t?t:i>e?e:i,jr=i=>i>6?0:i<=1?1:(7-i)/6;function Hi(i){let t=0;for(let e=1;e<=6;e++)for(let n=1;n<=6;n++)e+n>=i&&t++;return t/36}function ur(i,t,e){let n;return i>=2*t?n=2:i>t?n=3:i===t?n=4:2*i<=t?n=6:n=5,e?Math.min(n,e):n}function fr(i,t,e){return Math.max(2,i+t-(e?1:0))}const ar=(i,t)=>F_(i+t,2,6);function Is(i,t,e){const n=i.alive;return e?n*i.t.A:t.blast?Math.min(t.shots,n):n*t.shots}function co(i,t,e,n,s){const r=n.t,o=jr(t),a=jr(ur(e.S,r.T,e.poison)),c=1-jr(fr(r.Sv,e.AP,s)),h=i*o*a*c,l=Math.min(e.D,r.W)/r.W,u=Math.min(n.alive,h*l);return{wounds:h,kills:u,value:u*r.pts}}function Ft(i,t){const e=Math.abs(i),n=Math.abs(t);if(e===1/0||n===1/0)return 1/0;const s=Math.max(e,n);return s!==s?NaN:s===0?0:Math.sqrt(e/s*(e/s)+n/s*(n/s))*s}function B_(i,t,e){const n=Math.abs(i),s=Math.abs(t),r=Math.abs(e);if(n===1/0||s===1/0||r===1/0)return 1/0;const o=Math.max(Math.max(n,s),r);if(o!==o)return NaN;if(o===0)return 0;const a=n/o*(n/o),c=s/o*(s/o),h=a+c-a-c,l=r/o*(r/o)-h;return Math.sqrt(a+c+l)*o}const uh=Math.SQRT2;class k_{constructor(t,e,n=.5){this.W=t,this.H=e,this.cell=n,this.nx=Math.round(t/n),this.nz=Math.round(e/n);const s=this.N=this.nx*this.nz;this.hard=new Uint8Array(s),this.soft=new Uint8Array(s),this.diff=new Uint8Array(s),this.cover=new Uint8Array(s),this.clearAll=new Float32Array(s),this.clearHard=new Float32Array(s),this.tmp=new Float32Array(s)}x(t){return-this.W/2+(t%this.nx+.5)*this.cell}z(t){return-this.H/2+(Math.floor(t/this.nx)+.5)*this.cell}index(t,e){const n=Math.floor((t+this.W/2)/this.cell),s=Math.floor((e+this.H/2)/this.cell);return n<0||s<0||n>=this.nx||s>=this.nz?-1:s*this.nx+n}rebuild(t){this.hard.fill(0),this.soft.fill(0),this.diff.fill(0),this.cover.fill(0);for(const e of t){if(!e.alive)continue;const n=e.nav||e.shape;e.navKind==="hard"?this.raster(n,.1,this.hard):e.navKind==="soft"?this.raster(n,.1,this.soft):e.navKind==="diff"&&this.raster(n,.15,this.diff),e.cover&&this.raster(e.coverShape||n,.6,this.cover)}this.field(this.hard,null,this.clearHard),this.field(this.hard,this.soft,this.clearAll)}raster(t,e,n){const s=Ft(t.hx,t.hz)+e,r=Math.cos(t.yaw),o=Math.sin(t.yaw),a=Math.max(0,Math.floor((t.x-s+this.W/2)/this.cell)),c=Math.min(this.nx-1,Math.floor((t.x+s+this.W/2)/this.cell)),h=Math.max(0,Math.floor((t.z-s+this.H/2)/this.cell)),l=Math.min(this.nz-1,Math.floor((t.z+s+this.H/2)/this.cell));for(let u=h;u<=l;u++)for(let f=a;f<=c;f++){const p=u*this.nx+f,_=this.x(p)-t.x,g=this.z(p)-t.z,m=_*r-g*o,d=_*o+g*r;Math.abs(m)<=t.hx+e&&Math.abs(d)<=t.hz+e&&(n[p]=1)}}field(t,e,n){const{nx:s,nz:r,cell:o}=this,a=1e6,c=o,h=o*uh;for(let l=0;l<this.N;l++)n[l]=t[l]||e&&e[l]?0:a;for(let l=0;l<r;l++)for(let u=0;u<s;u++){const f=l*s+u;let p=n[f];u>0&&(p=Math.min(p,n[f-1]+c)),l>0&&(p=Math.min(p,n[f-s]+c),u>0&&(p=Math.min(p,n[f-s-1]+h)),u<s-1&&(p=Math.min(p,n[f-s+1]+h))),n[f]=p}for(let l=r-1;l>=0;l--)for(let u=s-1;u>=0;u--){const f=l*s+u;let p=n[f];u<s-1&&(p=Math.min(p,n[f+1]+c)),l<r-1&&(p=Math.min(p,n[f+s]+c),u<s-1&&(p=Math.min(p,n[f+s+1]+h)),u>0&&(p=Math.min(p,n[f+s-1]+h))),n[f]=p}for(let l=0;l<this.N;l++){const u=this.x(l),f=this.z(l),p=Math.min(u+this.W/2,this.W/2-u,f+this.H/2,this.H/2-f);n[l]=Math.min(n[l]>0?n[l]-o*.5:0,p)}}clearance(t,e){return e==="wreck"?this.clearHard[t]:this.clearAll[t]}standable(t,e,n,s){return t<0||s&&s[t]?!1:this.clearance(t,n==="wreck"?"wreck":"all")>=e-.06}reach(t,e,{r:n,max:s,mode:r="walk",forbid:o=null}){const a=this.N,c=new Float64Array(a).fill(1/0),h=new Int32Array(a).fill(-1),l=this.index(t,e),u={dist:c,prev:h,start:l,mode:r,sx:t,sz:e};if(l<0)return u;if(r==="fly"){for(let v=0;v<a;v++){const x=Ft(this.x(v)-t,this.z(v)-e);x<=s&&(c[v]=x)}return u}const f=Ft(t-this.x(l),e-this.z(l));c[l]=f;const p=new G_;p.push(l,f);const{nx:_,nz:g,cell:m}=this,d=this.clearance(l,r==="wreck"?"wreck":"all")<n-.06?n*1.5:0;for(;p.size;){const[v,x]=p.pop();if(x>c[v])continue;const M=v%_,C=v/_|0;for(let w=-1;w<=1;w++)for(let A=-1;A<=1;A++){if(!A&&!w)continue;const U=M+A,y=C+w;if(U<0||y<0||U>=_||y>=g)continue;const b=y*_+U;if(o&&o[b])continue;const H=this.clearance(b,r==="wreck"?"wreck":"all");if(H<n-.06&&!(d&&H>.05&&Ft(this.x(b)-t,this.z(b)-e)<d))continue;let G=this.diff[b]?2:1;r==="wreck"&&this.clearAll[b]<n-.06&&(G=2);const K=x+(A&&w?uh:1)*m*G;K<=s&&K<c[b]&&(c[b]=K,h[b]=v,p.push(b,K))}}return u}path(t,e,n,s){if(t.mode==="fly")return[{x:t.sx,z:t.sz},{x:this.x(e),z:this.z(e)}];const r=[];for(let h=e;h!==-1&&(r.push(h),h!==t.start);h=t.prev[h]);r.reverse();const o=r.map(h=>({x:this.x(h),z:this.z(h)}));if(o[0]={x:t.sx,z:t.sz},o.length<3)return o;const a=[o[0]];let c=0;for(;c<o.length-1;){let h=c+1;for(let l=o.length-1;l>c+1;l--)if(this.walkable(o[c],o[l],n,t.mode,s)){h=l;break}a.push(o[h]),c=h}return a}walkable(t,e,n,s,r){const o=Ft(e.x-t.x,e.z-t.z),a=Math.ceil(o/(this.cell*.5)),c=this.diff[this.index(t.x,t.z)];for(let h=1;h<a;h++){const l=h/a,u=this.index(t.x+(e.x-t.x)*l,t.z+(e.z-t.z)*l);if(u<0||r&&r[u]||this.clearance(u,s==="wreck"?"wreck":"all")<n-.06||this.diff[u]!==c||s==="wreck"&&this.clearAll[u]<n-.06)return!1}if(r!=null&&r.discs){for(const h of r.discs)if(H_(t,e,h)<h.R)return!1}return!0}}function H_(i,t,e){const n=t.x-i.x,s=t.z-i.z,r=n*n+s*s;let o=r>0?((e.x-i.x)*n+(e.z-i.z)*s)/r:0;return o=o<0?0:o>1?1:o,Ft(i.x+n*o-e.x,i.z+s*o-e.z)}const vu=i=>{let t=0;for(let e=1;e<i.length;e++)t+=Ft(i[e].x-i[e-1].x,i[e].z-i[e-1].z);return t};class G_{constructor(){this.ids=[],this.keys=[]}get size(){return this.ids.length}push(t,e){const{ids:n,keys:s}=this;let r=n.length;for(n.push(t),s.push(e);r>0;){const o=r-1>>1;if(s[o]<=e)break;n[r]=n[o],s[r]=s[o],r=o}n[r]=t,s[r]=e}pop(){const{ids:t,keys:e}=this,n=[t[0],e[0]],s=t.pop(),r=e.pop();if(t.length){let o=0;const a=t.length;for(;;){let c=2*o+1;if(c>=a||(c+1<a&&e[c+1]<e[c]&&c++,e[c]>=r))break;t[o]=t[c],e[o]=e[c],o=c}t[o]=s,e[o]=r}return n}}function fh(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const zn=(i,t,e)=>i+(t-i)*e,Je=(i,t=Math.random)=>i[Math.floor(t()*i.length)],ne=(i,t,e)=>t+i()*(e-t),Us=i=>1-Math.pow(1-i,3),V_=i=>i*i*i,tc=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,W_=i=>Math.atan2(Math.sin(i),Math.cos(i));function X_(i){return i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375}const fn={speed:1,time:0},Pa=new Set;function De(i,t,e=n=>n){return new Promise(n=>{Pa.add({t:0,duration:Math.max(1e-4,i),fn:t,ease:e,resolve:n})})}const je=i=>De(i,()=>{});function $_(i){for(const t of[...Pa]){t.t+=i;const e=Math.min(1,t.t/t.duration);t.fn(t.ease(e),e),e>=1&&(Pa.delete(t),t.resolve())}}const ps=new Fn(1,1,1),q_=new on(.5,.5,1,8).rotateZ(Math.PI/2),da=new Map;function xe(i,t={}){const e=i+JSON.stringify(t);return da.has(e)||da.set(e,new Cn({color:i,roughness:.9,flatShading:!0,...t})),da.get(e)}function Me(i,t,{shadow:e=!0}={}){const n=new Ht(i,t);return n.castShadow=e,n.receiveShadow=!0,n}const Y_={stone:{colors:["#8f8b82","#9c978d","#7f7b73","#a7a296","#878378"],bw:1,by:.72,bt:.62,hp:3,look:"box"},sand:{colors:["#c9a66b","#d6b67e","#b9935b","#ddc28e","#c29a60"],bw:1,by:.72,bt:.66,hp:2,look:"box"},log:{colors:["#7a5232","#6b4528","#86603c","#5f3e24"],bw:1,by:.56,bt:.56,hp:2,look:"log"}},j_={oak:["#4f8a34","#5f9a3c","#447a2c","#6aa646"],autumn:["#d08a2c","#c4622a","#e0a93a","#b8481f"],pine:["#2f6a3c","#3a7a46","#285c34"]},K_=["#7a5232","#5f3e24","#9a7048","#b08a5a"];let J_=1;class Z_{constructor(t,e,n,s){this.scene=t,this.fx=e,this.W=n,this.H=s,this.group=new Ot,t.add(this.group),this.chunks=[],this.features=[],this.dirty=!0,this.onBreak=null}clear(){this.scene.remove(this.group),this.group=new Ot,this.scene.add(this.group),this.chunks=[],this.features=[],this.dirty=!0}add(t){const e={id:J_++,alive:!0,destructible:t.hp!==1/0,hp:t.hp??1/0,maxHp:t.hp??1/0,los:null,cover:!1,navKind:null,...t},n=e.shape;return n.reach=Ft(n.hx,n.hz)+.05,e.mesh&&this.group.add(e.mesh),this.chunks.push(e),e}generate(t,e,n){this.clear();const s=fh(t),{W:r,H:o}=this,a=[],c=s();if(c<.55)this.build("tower",{x:0,z:0,yaw:s()*Math.PI},s()*1e9|0),a.push({x:0,z:0,r:4.6,hollow:!0});else if(c<.8){const p=s()*Math.PI;for(const _ of[0,1]){const g=p+_*(Math.PI/2),m=Math.cos(g)*4.2,d=Math.sin(g)*4.2,v=s()*1e9|0;this.build("rocks",{x:m,z:d,yaw:g},v),this.build("rocks",{x:-m,z:-d,yaw:g+Math.PI},v),a.push({x:m,z:d,r:1.8},{x:-m,z:-d,r:1.8})}}const h=[["ruin",3.2,4],["wall",3.6,2],["forest",3.2,3],["hedgerow",3.4,2],["rocks",2,2],["barricade",2,2],["mushrooms",2,1.5],["obelisk",1.6,1]],l=h.reduce((p,_)=>p+_[2],0),u=6+Math.floor(s()*3);let f=0;for(let p=0;p<1200&&f<u;p++){let _=s()*l,g=h[0];for(const U of h)if((_-=U[2])<=0){g=U;break}const[m,d]=g,v=ne(s,-r/2+d+.5,r/2-d-.5),x=ne(s,-o/2+d+.5,o/2-d-.5);if(Ft(v,x)<d+1.4||Math.abs(v)>r/2-n-1&&(d>2.1||m==="forest")||e.some(U=>Ft(U.x-v,U.z-x)<d+2.2))continue;const C=2.1;if(a.some(U=>Ft(U.x-v,U.z-x)<U.r+d+C||Ft(U.x+v,U.z+x)<U.r+d+C))continue;const w=s()*Math.PI*2,A=s()*1e9|0;this.build(m,{x:v,z:x,yaw:w},A),this.build(m,{x:-v,z:-x,yaw:w+Math.PI},A),a.push({x:v,z:x,r:d},{x:-v,z:-x,r:d}),f++}this.features=a,this.dirty=!0}build(t,e,n){const s=fh(n),r=Math.cos(e.yaw),o=Math.sin(e.yaw),a={p:(c,h)=>({x:e.x+r*c+o*h,z:e.z-o*c+r*h}),yaw:(c=0)=>e.yaw+c};this[t](a,s)}column(t,e,n,s,r,o,a,{holes:c=[],cap:h=!1,bw:l,bt:u}={}){const f=Y_[a],p=l??f.bw,_=u??f.bt,g=t.p(n,s),m=t.yaw(r),d={blocks:[],x:g.x,z:g.z,yaw:m,style:f,rubble:null,w:p,t:_};for(let v=0;v<o;v++){if(c.includes(v))continue;const x=Je(f.colors,e),M=m+(e()-.5)*.06,C=Me(f.look==="log"?q_:ps,xe(x));f.look==="log"?C.scale.set(p*1.02,f.by,_):C.scale.set(p*(.95+e()*.04),f.by*.96,_*(.9+e()*.1)),C.position.set(g.x,f.by*(v+.5),g.z),C.rotation.y=M;const w=this.add({kind:"block",mesh:C,hp:f.hp,color:x,shape:{x:g.x,y:f.by*(v+.5),z:g.z,hx:p/2,hy:f.by/2,hz:_/2,yaw:m},navKind:"soft",los:"block",cover:!0});w.col=d,w.level=v,d.blocks.push(w)}if(h&&o>0){const v=Je(f.colors,e),x=Me(new Bn(p*.72,p*1.1,4).rotateY(Math.PI/4),xe(v)),M=f.by*o+p*.55;x.position.set(g.x,M,g.z),x.rotation.y=m;const C=this.add({kind:"block",mesh:x,hp:f.hp,color:v,capH:p*1.1,shape:{x:g.x,y:M,z:g.z,hx:p/2,hy:p*.55,hz:p/2,yaw:m},navKind:"soft",los:"block",cover:!0});C.col=d,C.level=o,d.blocks.push(C)}return d}tree(t,e,n,s,r){const o=t.p(n,s),a=ne(e,1.5,2.4),c=ne(e,.17,.26),h=new Ot;h.position.set(o.x,0,o.z);const l=Me(new on(c*.75,c,a,7).translate(0,a/2,0),xe(Je(["#6b4a2e","#5a3d24","#7a5638"],e)));h.add(l);const u=new Ot;h.add(u);let f;const p=j_[r];if(r==="pine"){for(let g=0;g<3;g++){const m=1.05-g*.26,d=1.3-g*.15,v=Me(new Bn(m,d,8),xe(Je(p,e)));v.position.y=a*.45+g*.75+d/2,v.rotation.y=e()*3,u.add(v)}f=a*.45+2.5}else{const g=3+Math.floor(e()*3);for(let m=0;m<g;m++){const d=ne(e,.55,.9),v=Me(new kn(d,1),xe(Je(p,e)));v.position.set(ne(e,-.5,.5),a+ne(e,-.1,.6),ne(e,-.5,.5)),v.scale.y=.8,u.add(v)}f=a+1.2}h.rotation.y=e()*6;const _=this.add({kind:"tree",mesh:h,hp:3,leaves:p,shape:{x:o.x,y:f/2,z:o.z,hx:.7,hy:f/2,hz:.7,yaw:0},nav:{x:o.x,z:o.z,hx:c+.12,hz:c+.12,yaw:0},coverShape:{x:o.x,z:o.z,hx:.8,hz:.8,yaw:0},navKind:"soft",los:"obscure",cover:!0});return _.trunkH=a,_.trunkR=c,_.canopy=u,_}hedge(t,e,n,s,r){const o=t.p(n,s),a=t.yaw(r),c=new Ot;c.position.set(o.x,0,o.z),c.rotation.y=a;const h=Je(["#3f7a34","#4a8a3a","#386c2e"],e),l=Me(ps,xe(h));l.scale.set(1.15,.62,.55),l.position.y=.31,c.add(l);for(let u=0;u<3;u++){const f=Me(new kn(.3,0),xe(Je(["#4f8f3e","#5c9a46","#3f7a34"],e)));f.position.set(-.4+u*.4,.62+e()*.08,ne(e,-.08,.08)),c.add(f)}if(e()<.4)for(let u=0;u<4;u++){const f=Me(new pn(.05,5,4),xe("#c0302a"),{shadow:!1});f.position.set(ne(e,-.5,.5),ne(e,.35,.75),.29),c.add(f)}return this.add({kind:"hedge",mesh:c,hp:1,leaves:["#3f7a34","#5c9a46","#2f5f28"],shape:{x:o.x,y:.42,z:o.z,hx:.6,hy:.42,hz:.3,yaw:a},navKind:"diff",los:"obscure",cover:!0})}boulder(t,e,n,s,r){const o=t.p(n,s),a=ne(e,.65,1.25),c=Me(new so(r,0),xe(Je(["#7d7a74","#8c8880","#6e6b66","#96918a"],e)));c.scale.set(1,a,ne(e,.75,1.1)),c.rotation.set(e()*.6,e()*6,e()*.6);const h=r*a;if(c.position.set(o.x,h*.55,o.z),e()<.6){const u=Me(new so(r*.55,0),xe("#5d7a3a"),{shadow:!1});u.position.set(0,r*.55,0),u.scale.set(1.1,.4,1.1),c.add(u)}const l=h*1.5;return this.add({kind:"rock",mesh:c,hp:1/0,shape:{x:o.x,y:l/2,z:o.z,hx:r*.85,hy:l/2,hz:r*.85,yaw:0},navKind:"hard",los:l>1.2?"block":"obscure",cover:!0})}crate(t,e,n,s){const r=t.p(n,s),o=t.yaw(e()*6),a=e();let c,h;if(a<.45){c=new Ot;const l=ne(e,.55,.75),u=Me(ps,xe(Je(["#9a7048","#8a6038","#a77d50"],e)));u.scale.setScalar(l),u.position.y=l/2;const f=Me(ps,xe("#5f3e24"));if(f.scale.set(l*1.02,l*.14,l*1.02),f.position.y=l/2,c.add(u,f),e()<.4){const p=Me(ps,xe("#9a7048"));p.scale.setScalar(l*.7),p.position.set(0,l+l*.35,0),p.rotation.y=.5,c.add(p),h=l*1.7}else h=l}else if(a<.8){c=new Ot;const l=Me(new on(.28,.24,.75,10),xe(Je(["#8a5a34","#7a4c2a"],e)));l.position.y=.375;const u=Me(new wn(.29,.025,4,14).rotateX(Math.PI/2),xe("#3a3a3a",{metalness:.4}));u.position.y=.55,c.add(l,u),h=.75}else{c=new Ot;const l=Me(new pn(.34,9,7),xe("#c2a77a"));l.scale.set(1,1.15,.9),l.position.y=.36,c.add(l);for(let u=0;u<4;u++){const f=Me(new pn(.08,6,5),xe("#8a5a2a"));f.position.set(ne(e,-.12,.12),.72,ne(e,-.12,.12)),c.add(f)}h=.78}return c.position.set(r.x,0,r.z),c.rotation.y=o,this.add({kind:"crate",mesh:c,hp:1,color:"#9a7048",shape:{x:r.x,y:h/2,z:r.z,hx:.36,hy:h/2,hz:.36,yaw:o},navKind:"diff",los:"obscure",cover:!0})}mushroom(t,e,n,s){const r=t.p(n,s),o=ne(e,.9,1.9),a=ne(e,.5,.95),c=ne(e,.12,.2),h=new Ot;h.position.set(r.x,0,r.z);const l=Me(new on(c*.8,c*1.2,o,8).translate(0,o/2,0),xe("#efe6d0")),u=Je(["#c0392b","#d35a1f","#8e44ad","#b03050"],e),f=Me(new pn(a,14,8,0,Math.PI*2,0,Math.PI/2),xe(u));f.position.y=o-.05,f.scale.y=.7;const p=Me(new ki(a,14).rotateX(Math.PI/2),xe("#e9dcc0"));p.position.y=o-.05,h.add(l,f,p);for(let g=0;g<6;g++){const m=e()*6,d=ne(e,.25,1.1),v=Me(new pn(a*.12,5,4),xe("#fff6e0"),{shadow:!1});v.position.set(Math.cos(m)*Math.sin(d)*a,o-.05+Math.cos(d)*a*.7,Math.sin(m)*Math.sin(d)*a),h.add(v)}h.rotation.z=ne(e,-.12,.12);const _=o+a*.7;return this.add({kind:"mushroom",mesh:h,hp:2,leaves:[u,"#fff6e0","#efe6d0"],shape:{x:r.x,y:_/2,z:r.z,hx:a*.6,hy:_/2,hz:a*.6,yaw:0},nav:{x:r.x,z:r.z,hx:c+.12,hz:c+.12,yaw:0},navKind:"soft",los:"obscure",cover:!0})}floor(t,e,n,s){const r=t.p(0,0),o=new ki(n,22),a=o.attributes.position;for(let h=1;h<a.count;h++){const l=.78+e()*.3;a.setXY(h,a.getX(h)*l,a.getY(h)*l)}o.rotateX(-Math.PI/2);const c=Me(o,xe(s,{flatShading:!1}),{shadow:!1});return c.position.set(r.x,.012,r.z),this.add({kind:"floor",mesh:c,hp:1/0,shape:{x:r.x,y:.01,z:r.z,hx:n*.75,hy:.01,hz:n*.75,yaw:0},navKind:"diff",cover:!0})}ruin(t,e){const n=Je(["stone","sand","log","stone"],e),s=4+Math.floor(e()*3),r=3+Math.floor(e()*3),o=-s/2+.5,a=-r/2+.5,c=1+Math.floor(e()*(s-2));for(let l=0;l<s;l++){if(l===c)continue;let u=Math.max(1,Math.min(3,3-Math.floor(l/2)+Math.floor(e()*2)-(e()<.3?1:0)));const f=u===3&&e()<.35?[1]:[];this.column(t,e,o+l,a,0,u,n,{holes:f})}for(let l=1;l<=r;l++){let u=Math.max(1,Math.min(3,3-Math.floor(l/2)+Math.floor(e()*2)));if(e()<.15)continue;const f=u===3&&e()<.35?[1]:[];this.column(t,e,o,a+.3+.5+(l-1),Math.PI/2,u,n,{holes:f})}const h=Math.floor(e()*3);for(let l=0;l<h;l++)this.crate(t,e,o+ne(e,1.5,s-1),a+ne(e,1.6,r-.5))}wall(t,e){const n=Je(["stone","sand","log"],e),s=5+Math.floor(e()*3),r=Math.floor(e()*s);for(let o=0;o<s;o++){if(o===r&&s>5)continue;const a=1+Math.floor(e()*3);this.column(t,e,o-(s-1)/2,0,0,a,n,{holes:a===3&&e()<.4?[1]:[]})}e()<.6&&this.crate(t,e,ne(e,-2,2),ne(e,.9,1.4))}tower(t,e){const n=Je(["stone","sand"],e),s=18,r=3.4,o=[];for(let h=0;h<s/2;h++)o.push(1+Math.floor(e()*3));const a=new Set([0,Math.floor(s/4)+(e()<.5?0:1)]),c=o.map(h=>h===3&&e()<.4);for(let h=0;h<s;h++){const l=h%(s/2);if(a.has(l))continue;const u=h/s*Math.PI*2,f=Math.atan2(-Math.cos(u),-Math.sin(u));this.column(t,e,Math.cos(u)*r,Math.sin(u)*r,f,o[l],n,{holes:c[l]?[1]:[],bw:1.12})}}forest(t,e){const n=e()<.3?"pine":e()<.4?"autumn":"oak";this.floor(t,e,3,n==="autumn"?"#5a5a2a":"#355a2a");const s=[],r=3+Math.floor(e()*3);for(let o=0;o<60&&s.length<r;o++){const a=e()*Math.PI*2,c=Math.sqrt(e())*2.2,h=Math.cos(a)*c,l=Math.sin(a)*c;s.some(u=>Ft(u.x-h,u.z-l)<1.55)||s.push({x:h,z:l})}for(const o of s)this.tree(t,e,o.x,o.z,n)}hedgerow(t,e){const n=5+Math.floor(e()*3),s=ne(e,-.12,.12),r=1+Math.floor(e()*(n-2));for(let o=0;o<n;o++){if(o===r&&e()<.7)continue;const a=(o-(n-1)/2)*1.12,c=s*a*a;this.hedge(t,e,a,c,-Math.atan(2*s*a))}}rocks(t,e){const n=2+Math.floor(e()*3);this.boulder(t,e,0,0,ne(e,.8,1.15));for(let s=1;s<n;s++){const r=e()*6;this.boulder(t,e,Math.cos(r)*ne(e,.9,1.4),Math.sin(r)*ne(e,.9,1.4),ne(e,.35,.7))}}barricade(t,e){const n=3+Math.floor(e()*3);for(let s=0;s<n;s++)this.crate(t,e,(s-(n-1)/2)*.8+ne(e,-.1,.1),ne(e,-.3,.3))}mushrooms(t,e){const n=3+Math.floor(e()*3),s=[];for(let r=0;r<40&&s.length<n;r++){const o=e()*6,a=Math.sqrt(e())*1.5,c=Math.cos(o)*a,h=Math.sin(o)*a;s.some(l=>Ft(l.x-c,l.z-h)<.9)||(s.push({x:c,z:h}),this.mushroom(t,e,c,h))}}obelisk(t,e){this.column(t,e,0,0,0,3+Math.floor(e()*2),"sand",{cap:!0,bw:.8,bt:.8}),e()<.7&&this.boulder(t,e,1,.4,.4)}los(t,e,n=1.3){let s=0;const r=e.x-t.x,o=e.y-t.y,a=e.z-t.z,c=r*r+a*a;for(const h of this.chunks){if(!h.alive||!h.los)continue;const l=h.shape;let u=c>0?((l.x-t.x)*r+(l.z-t.z)*a)/c:0;u=u<0?0:u>1?1:u;const f=t.x+r*u-l.x,p=t.z+a*u-l.z;if(!(f*f+p*p>l.reach*l.reach)&&Q_(t,r,o,a,l)){if(h.los==="block")return{blocked:!0,obscure:s};Ft(l.x-t.x,l.z-t.z)<n+l.reach*.5||s++}}return{blocked:s>=2,obscure:s}}blast(t,e,n,s,{acid:r=!1}={}){const o=[];for(const a of[...this.chunks]){if(!a.alive||!a.destructible)continue;const c=tv(t,.5,e,a.shape);if(c>n)continue;let h=c<n*.6?s:Math.ceil(s/2);r&&a.kind==="block"&&(h+=1),this.hurt(a,h,{x:t,z:e},o)}return o}hurt(t,e,n,s=[]){if(!t.alive||!t.destructible)return s;if(t.hp-=e,t.hp<=0)this.destroy(t,n),s.push(t);else{t.mesh.isMesh&&(t.ownMat||(t.mesh.material=t.mesh.material.clone(),t.ownMat=!0),t.mesh.material.color.multiplyScalar(.8));const r=t.mesh.position.clone();De(.25,o=>{const a=(1-o)*.06;t.mesh.position.set(r.x+(Math.random()-.5)*a,r.y,r.z+(Math.random()-.5)*a)}).then(()=>t.mesh.position.copy(r)),this.fx.debris(t.shape.x,t.shape.y,t.shape.z,[t.color||"#888","#666"],3,{from:n,power:3,size:.08})}return s}destroy(t,e){var r;t.alive=!1,this.dirty=!0;const n=t.shape,s=this.fx;switch(t.kind){case"block":{this.group.remove(t.mesh),s.debris(n.x,n.y,n.z,[t.color,t.color,"#5a5650"],12,{from:e,power:6}),s.smoke({x:n.x,y:n.y,z:n.z,size:.4,color:"#a09a8a",life:1.5}),this.collapse(t.col),this.rubble(t.col,e);break}case"tree":this.topple(t,e);break;case"hedge":case"mushroom":if(this.group.remove(t.mesh),s.leaves(n.x,n.y,n.z,t.leaves,t.kind==="hedge"?22:28,t.kind==="hedge"?.8:1.4),t.kind==="mushroom")for(let o=0;o<16;o++)s.mote({x:n.x,y:n.y*1.5,z:n.z,vx:(Math.random()-.5)*3,vy:Math.random()*2,vz:(Math.random()-.5)*3,size:.05,color:"#f0e0ff",life:2.5,drag:1});break;case"crate":case"log":this.group.remove(t.mesh),s.debris(n.x,n.y,n.z,K_,14,{from:e,power:6,size:.12});break}(r=this.onBreak)==null||r.call(this,t)}collapse(t){t.blocks=t.blocks.filter(n=>n.alive).sort((n,s)=>n.level-s.level);let e=0;for(const n of t.blocks){if(n.level>e){const s=(n.level-e)*t.style.by;n.level=e,n.shape.y-=s;const r=n.mesh.position.y,o=r-s;De(.18+s*.15,a=>n.mesh.position.y=r+(o-r)*a,X_).then(()=>{this.fx.debris(n.shape.x,n.shape.y-t.style.by/2,n.shape.z,["#8a8478"],3,{power:2,size:.07})})}e=n.level+1}}rubble(t,e){const n=t.style;let s=t.rubble;if(!s){const a=new Ot;a.position.set(t.x,0,t.z),s=t.rubble=this.add({kind:"rubble",mesh:a,hp:1/0,pieces:0,shape:{x:t.x,y:.2,z:t.z,hx:t.w*.7,hy:.2,hz:.6,yaw:t.yaw},navKind:"diff",los:"obscure",cover:!0}),this.dirty=!0}const r=s.mesh,o=4+Math.floor(Math.random()*3);for(let a=0;a<o;a++){const c=Me(ps,xe(Je(n.colors))),h=.18+Math.random()*.22;c.scale.set(h*(n.look==="log"?2.4:1.2),h*.7,h);const l=Math.random()*6,u=Math.random()*.6,f=e?t.x-e.x:0,p=e?t.z-e.z:0,_=Math.hypot(f,p)||1;c.position.set(Math.cos(l)*u+f/_*.25,h*.3+Math.min(.2,s.pieces*.012),Math.sin(l)*u+p/_*.25),c.rotation.set(Math.random(),Math.random()*6,Math.random()),r.add(c)}s.pieces+=o}topple(t,e){const n=t.shape;let s=n.x-((e==null?void 0:e.x)??n.x-1),r=n.z-((e==null?void 0:e.z)??n.z);const o=Ft(s,r)||1;s/=o,r/=o;const a=t.leaves;for(const _ of t.canopy.children){const g=new R;_.getWorldPosition(g),this.fx.leaves(g.x,g.y,g.z,a,14,1)}t.mesh.remove(t.canopy);const c=t.mesh,h=new R(r,0,-s).normalize(),l=c.quaternion.clone(),u=new On;De(.9,_=>{u.setFromAxisAngle(h,(Math.PI/2-.12)*_),c.quaternion.copy(l).premultiply(u),c.position.y=Math.sin(_*Math.PI)*.05+t.trunkR*_},V_).then(()=>{this.fx.debris(n.x+s*t.trunkH,.2,n.z+r*t.trunkH,["#6b4a2e","#4f8a34"],8,{power:3,size:.1}),this.fx.shake=Math.max(this.fx.shake,.05)});const f=t.trunkH,p=this.add({kind:"log",mesh:c,hp:2,shape:{x:n.x+s*f*.5,y:t.trunkR,z:n.z+r*f*.5,hx:f*.5,hy:t.trunkR,hz:t.trunkR+.05,yaw:Math.atan2(-r,s)},navKind:"diff",los:"obscure",cover:!0});return this.dirty=!0,p}}function Q_(i,t,e,n,s){const r=Math.cos(s.yaw),o=Math.sin(s.yaw),a=i.x-s.x,c=i.y-s.y,h=i.z-s.z,l=[a*r-h*o,c,a*o+h*r],u=[t*r-n*o,e,t*o+n*r],f=[s.hx,s.hy,s.hz];let p=0,_=1;for(let g=0;g<3;g++)if(Math.abs(u[g])<1e-9){if(Math.abs(l[g])>f[g])return!1}else{let m=(-f[g]-l[g])/u[g],d=(f[g]-l[g])/u[g];if(m>d&&([m,d]=[d,m]),m>p&&(p=m),d<_&&(_=d),p>_)return!1}return!0}function tv(i,t,e,n){const s=Math.cos(n.yaw),r=Math.sin(n.yaw),o=i-n.x,a=t-n.y,c=e-n.z,h=o*s-c*r,l=o*r+c*s,u=Math.max(0,Math.abs(h)-n.hx),f=Math.max(0,Math.abs(a)-n.hy),p=Math.max(0,Math.abs(l)-n.hz);return B_(u,f,p)}const dh=900,ph=700,mh=260,ms=new le,gh=new On,ev=new Os,Kr=new R,nv=new R,_h=new qt;class pa{constructor(t,e){this.mesh=t,this.max=e,this.items=[],this.free=[];for(let n=e-1;n>=0;n--)this.free.push(n);t.instanceMatrix.setUsage(ed),t.frustumCulled=!1,ms.makeScale(0,0,0);for(let n=0;n<e;n++)t.setMatrixAt(n,ms),t.setColorAt(n,_h.set(16777215))}spawn(t){if(!this.free.length){const e=this.items.shift();this.free.push(e.i)}t.i=this.free.pop(),this.mesh.setColorAt(t.i,_h.set(t.color)),this.mesh.instanceColor.needsUpdate=!0,this.items.push(t)}update(t){const e=[];for(const n of this.items){if(n.age+=t,n.age>=n.life){ms.makeScale(0,0,0),this.mesh.setMatrixAt(n.i,ms),this.free.push(n.i);continue}n.vy-=n.g*t;const s=Math.exp(-n.drag*t);n.vx*=s,n.vz*=s,n.g<0&&(n.vy*=s),n.x+=n.vx*t,n.y+=n.vy*t,n.z+=n.vz*t,n.y<n.floor&&(n.y=n.floor,n.vy=-n.vy*n.bounce,n.vx*=.55,n.vz*=.55,n.spin*=.5),n.rx+=n.spin*t,n.ry+=n.spin*.7*t;const r=n.age/n.life,o=n.size*(n.grow?.4+r*n.grow:1)*(r>n.fadeAt?1-(r-n.fadeAt)/(1-n.fadeAt):1);gh.setFromEuler(ev.set(n.rx,n.ry,0)),ms.compose(Kr.set(n.x,n.y,n.z),gh,nv.set(o*n.sx,o*n.sy,o*n.sz)),this.mesh.setMatrixAt(n.i,ms),e.push(n)}this.items=e,this.mesh.instanceMatrix.needsUpdate=!0}}function ma(i){return{x:i.x,y:i.y,z:i.z,vx:i.vx||0,vy:i.vy||0,vz:i.vz||0,g:i.g??22,drag:i.drag??.6,bounce:i.bounce??.3,floor:i.floor??.04,size:i.size??.15,sx:i.sx??1,sy:i.sy??1,sz:i.sz??1,rx:Math.random()*6,ry:Math.random()*6,spin:i.spin??(Math.random()-.5)*18,age:0,life:i.life??1.5,fadeAt:i.fadeAt??.7,grow:i.grow||0,color:i.color}}function vh(i,t){const e=document.createElement("canvas");e.width=e.height=128;const n=e.getContext("2d"),s=n.createRadialGradient(64,64,4,64,64,62);s.addColorStop(0,i),s.addColorStop(.55,i),s.addColorStop(1,t),n.fillStyle=s,n.fillRect(0,0,128,128);for(let o=0;o<90;o++){const a=Math.random()*Math.PI*2,c=30+Math.random()*30;n.fillStyle=i,n.globalAlpha=Math.random()*.5,n.beginPath(),n.arc(64+Math.cos(a)*c,64+Math.sin(a)*c,2+Math.random()*6,0,Math.PI*2),n.fill()}const r=new Xa(e);return r.colorSpace=Ce,r}class iv{constructor(t,e,n){this.scene=t,this.camera=e,this.overlay=n,this.shake=0;const s=new er(new Fn(1,1,1),new Cn({roughness:.85}),dh);s.castShadow=!0;const r=new er(new kn(1,0),new Qe({toneMapped:!1}),ph),o=new er(new kn(1,1),new A_({transparent:!0,opacity:.55,depthWrite:!1}),mh);t.add(s,r,o),this.cubes=new pa(s,dh),this.glow=new pa(r,ph),this.puff=new pa(o,mh),this.lights=[];for(let a=0;a<3;a++){const c=new P_(16755285,0,14,1.6);c.position.set(0,-50,0),t.add(c),this.lights.push({l:c,until:0})}this.scorchTex=vh("rgba(20,14,8,0.85)","rgba(20,14,8,0)"),this.acidTex=vh("rgba(90,220,60,0.75)","rgba(40,120,20,0)"),this.decals=[],this.decalGeo=new ki(1,28),this.decalGeo.rotateX(-Math.PI/2),this.texts=[],this.flashGeo=new pn(1,20,12),this.ringGeo=new Xi(.93,1,64),this.ringGeo.rotateX(-Math.PI/2),this.discGeo=new ki(1,48),this.discGeo.rotateX(-Math.PI/2)}cube(t){this.cubes.spawn(ma(t))}mote(t){this.glow.spawn(ma({g:-1,drag:2.5,bounce:0,floor:-99,spin:0,...t}))}smoke(t){this.puff.spawn(ma({g:-2.2,drag:1.8,bounce:0,floor:.1,spin:0,grow:2.2,fadeAt:.4,...t}))}debris(t,e,n,s,r,{from:o,power:a=7,size:c=.16}={}){for(let h=0;h<r;h++){let l=Math.random()-.5,u=Math.random()-.5;o&&(l+=(t-o.x)*.35,u+=(n-o.z)*.35);const f=Math.hypot(l,u)||1,p=a*(.4+Math.random()*.8);this.cube({x:t+(Math.random()-.5)*.4,y:e+Math.random()*.3,z:n+(Math.random()-.5)*.4,vx:l/f*p,vy:3+Math.random()*a,vz:u/f*p,size:c*(.5+Math.random()),sy:.6+Math.random()*.8,color:s[Math.random()*s.length|0],life:2.4+Math.random()*1.5,fadeAt:.75})}}leaves(t,e,n,s,r,o=1){for(let a=0;a<r;a++){const c=Math.random()*Math.PI*2,h=1+Math.random()*4*o;this.cube({x:t+Math.cos(c)*.5*o,y:e+Math.random()*o,z:n+Math.sin(c)*.5*o,vx:Math.cos(c)*h,vy:2+Math.random()*4,vz:Math.sin(c)*h,g:5,drag:2.4,size:.1+Math.random()*.08,sy:.25,spin:(Math.random()-.5)*10,color:s[Math.random()*s.length|0],life:1.6+Math.random()*1.6})}}flashLight(t,e,n,s,r,o){const a=this.lights.reduce((c,h)=>c.until<h.until?c:h);a.until=fn.time+o,a.l.color.set(s),a.l.position.set(t,e,n),De(o,c=>a.l.intensity=r*(1-c)*(1-c))}decal(t,e,n,s,r=.8){const o=new Ht(this.decalGeo,new Qe({map:s,transparent:!0,depthWrite:!1,opacity:r,polygonOffset:!0,polygonOffsetFactor:-2}));if(o.position.set(t,.015+this.decals.length*4e-4,e),o.rotation.y=Math.random()*6,o.scale.setScalar(n),o.renderOrder=1,this.scene.add(o),this.decals.push(o),this.decals.length>40){const a=this.decals.shift();this.scene.remove(a),a.material.dispose()}return o}clearDecals(){for(const t of this.decals)this.scene.remove(t),t.material.dispose();this.decals=[]}ring(t,e,n,s,{life:r=1.2,fill:o=.18,hold:a=!1}={}){const c=new Ot,h=new Ht(this.ringGeo,new Qe({color:s,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1})),l=new Ht(this.discGeo,new Qe({color:s,transparent:!0,opacity:o,depthWrite:!1,toneMapped:!1}));c.add(h,l),c.position.set(t,.05,e),c.scale.setScalar(n),c.renderOrder=3,this.scene.add(c);const u=()=>{this.scene.remove(c),h.material.dispose(),l.material.dispose()};return a||De(r,f=>{h.material.opacity=.95*(1-f),l.material.opacity=o*(1-f)}).then(u),c.userData.remove=u,c}explode(t,e,n,s="fire"){const r={fire:{flash:16761963,glow:["#ffd36e","#ff8a2a","#ff5a1f","#fff2b0"],light:16751178,smoke:"#4a4038"},acid:{flash:10354538,glow:["#b8ff6a","#5be04a","#d8ff9a","#2fbf4a"],light:9109338,smoke:"#3f5a2a"},thorns:{flash:13172634,glow:["#9be36a","#e4ffb0","#5ab04a"],light:12255114,smoke:"#3a4a2a"},dust:{flash:16773328,glow:["#ffe9b0","#ffd080"],light:16769184,smoke:"#8a7a64"}}[s],o=new Ht(this.flashGeo,new Qe({color:r.flash,transparent:!0,opacity:.9,toneMapped:!1,depthWrite:!1}));o.position.set(t,.3,e),this.scene.add(o),De(.45,c=>{o.scale.setScalar(.2+n*.85*Us(c)),o.material.opacity=.9*(1-c)}).then(()=>{this.scene.remove(o),o.material.dispose()}),this.flashLight(t,1.5,e,r.light,9+n*6,.7);const a=Math.round(18+n*14);for(let c=0;c<a;c++){const h=Math.random()*Math.PI*2,l=(2+Math.random()*6)*(.6+n*.25);this.mote({x:t,y:.3,z:e,vx:Math.cos(h)*l,vy:2+Math.random()*6,vz:Math.sin(h)*l,g:9,drag:2.2,size:.07+Math.random()*.12,color:r.glow[c%r.glow.length],life:.5+Math.random()*.7})}for(let c=0;c<6+n*3;c++){const h=Math.random()*Math.PI*2,l=Math.random()*n*.6;this.smoke({x:t+Math.cos(h)*l,y:.3+Math.random()*.4,z:e+Math.sin(h)*l,vx:Math.cos(h)*1.2,vy:1+Math.random()*1.5,vz:Math.sin(h)*1.2,size:.25+Math.random()*.25*n,color:r.smoke,life:1.6+Math.random()*1.4})}this.debris(t,.1,e,["#5b4630","#6f8a3a","#4a3a28"],Math.round(6+n*4),{power:5+n,size:.1}),this.decal(t,e,n*.7,s==="acid"?this.acidTex:this.scorchTex,s==="acid"?.6:.45),this.shake=Math.max(this.shake,.05+n*.06)}async projectile(t,e,{mesh:n,arc:s=.25,speed:r=22,trail:o=null,spin:a=10}={}){const c=Math.hypot(e.x-t.x,e.z-t.z),h=c*s;this.scene.add(n);let l=0;await De(Math.max(.12,c/r),u=>{n.position.set(t.x+(e.x-t.x)*u,t.y+(e.y-t.y)*u+4*h*u*(1-u),t.z+(e.z-t.z)*u),n.rotation.x+=a*.016,n.rotation.z+=a*.011,o&&u-l>.03&&(l=u,o(n.position))}),this.scene.remove(n)}text(t,e,n="#ffffff",{size:s=18,life:r=1.3,rise:o=1.4}={}){const a=document.createElement("div");a.className="float-text",a.textContent=e,a.style.color=n,a.style.fontSize=s+"px",this.overlay.appendChild(a),this.texts.push({el:a,x:t.x,y:t.y,z:t.z,age:0,life:r,rise:o})}update(t){this.cubes.update(t),this.glow.update(t),this.puff.update(t),this.shake*=Math.exp(-t*6);const e=innerWidth,n=innerHeight;this.texts=this.texts.filter(s=>{if(s.age+=t,s.age>s.life)return s.el.remove(),!1;const r=s.age/s.life;return Kr.set(s.x,s.y+s.rise*Us(r),s.z).project(this.camera),s.el.style.transform=`translate(${(Kr.x*.5+.5)*e}px, ${(-Kr.y*.5+.5)*n}px) translate(-50%, -50%) scale(${1+.3*(1-Math.min(1,r*5))})`,s.el.style.opacity=r>.6?1-(r-.6)/.4:1,!0})}}function sv(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new Te;let h=0;for(let l=0;l<i.length;++l){const u=i[l];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,l),h+=p}}if(e){let l=0;const u=[];for(let f=0;f<i.length;++f){const p=i[f].index;for(let _=0;_<p.count;++_)u.push(p.getX(_)+l);l+=i[f].attributes.position.count}c.setIndex(u)}for(const l in r){const u=xh(r[l]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" attribute."),null;c.setAttribute(l,u)}for(const l in o){const u=o[l][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[l]=[];for(let f=0;f<u;++f){const p=[];for(let g=0;g<o[l].length;++g)p.push(o[l][g][f]);const _=xh(p);if(!_)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" morphAttribute."),null;c.morphAttributes[l].push(_)}}return c}function xh(i){let t,e,n,s=-1,r=0;for(let h=0;h<i.length;++h){const l=i[h];if(l.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=l.array.constructor),t!==l.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=l.itemSize),e!==l.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=l.normalized),n!==l.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=l.gpuType),s!==l.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=l.array.length}const o=new t(r);let a=0;for(let h=0;h<i.length;++h)o.set(i[h].array,a),a+=i[h].array.length;const c=new mn(o,e,n);return s!==void 0&&(c.gpuType=s),c}const ga=new Map;function pt(i,t={}){const e=i+JSON.stringify(t);return ga.has(e)||ga.set(e,new Cn({color:i,roughness:.72,flatShading:!0,...t})),ga.get(e)}const Ai=i=>pt(i,{emissive:i,emissiveIntensity:1.6,roughness:.3}),qe=i=>pt(i,{metalness:.65,roughness:.35}),at={ico:new kn(1,1),ico0:new kn(1,0),sph:new pn(1,10,8),box:new Fn(1,1,1),cyl:new on(1,1,1,10),cone:new Bn(1,1,8),cap:new pn(1,12,6,0,Math.PI*2,0,Math.PI/2),brim:new ki(1,12).rotateX(Math.PI/2),oct:new mo(1,0)};function et(i,t,e=0,n=0,s=0,r=1,o=r,a=r){const c=new Ht(i,t);return c.position.set(e,n,s),c.scale.set(r,o,a),c.castShadow=!0,c}function Ri(i,t,e,n){const s=new R(...i),r=new R(...t),o=et(at.cyl,n);return o.position.copy(s).add(r).multiplyScalar(.5),o.scale.set(e,s.distanceTo(r),e),o.quaternion.setFromUnitVectors(new R(0,1,0),r.clone().sub(s).normalize()),o}function rv(i,t){const e=new Ot,n=et(new on(i,i*1.05,.09,28),pt("#262422"),0,.045,0);n.receiveShadow=!0;const s=et(new on(i*.96,i*.96,.012,28),pt("#4c5e2c",{flatShading:!1}),0,.094,0);s.receiveShadow=!0;const r=et(new wn(i*1.02,.028,4,32).rotateX(Math.PI/2),pt(t,{emissive:t,emissiveIntensity:.35}),0,.07,0);e.add(n,s,r);for(let o=0;o<Math.round(i*9);o++){const a=Math.random()*6,c=Math.sqrt(Math.random())*i*.85;e.add(et(at.cone,pt("#6a8a3a"),Math.cos(a)*c,.13,Math.sin(a)*c,.035,.08,.035))}return e}function ov(i,t,e,n,s=8,r=40){const o=new Ya(i.map(d=>new R(...d))),a=o.computeFrenetFrames(r,!1),c=[],h=[];for(let d=0;d<=r;d++){const v=d/r,x=o.getPointAt(v),M=t+(e-t)*Math.pow(v,.6),C=a.normals[d],w=a.binormals[d];for(let A=0;A<=s;A++){const U=A/s*Math.PI*2,y=Math.cos(U),b=Math.sin(U);c.push(x.x+M*(y*C.x+b*w.x),x.y+M*(y*C.y+b*w.y),x.z+M*(y*C.z+b*w.z))}}for(let d=0;d<r;d++)for(let v=0;v<s;v++){const x=d*(s+1)+v,M=x+s+1;h.push(x,x+1,M,M,x+1,M+1)}const l=o.getPointAt(0),u=c.length/3;c.push(l.x,l.y,l.z);for(let d=0;d<s;d++)h.push(u,d+1,d);const f=o.getPointAt(1),p=c.length/3;c.push(f.x,f.y,f.z);const _=r*(s+1);for(let d=0;d<s;d++)h.push(p,_+d,_+d+1);const g=new Te;g.setAttribute("position",new se(c,3)),g.setIndex(h),g.computeVertexNormals();const m=new Ht(g,n);return m.castShadow=!0,m}function gs({fur:i="#c96a2d",belly:t="#f1dcb5",hat:e="acorn",hatColor:n="#6e4a2a",tailUp:s=1}={}){const r=new Ot,o=new Ot;r.add(o);const a=pt(i),c=pt(t),h=pt("#1b1410");for(const d of[-1,1])o.add(et(at.ico,a,d*.1,.05,.07,.08,.045,.13)),o.add(et(at.ico,a,d*.12,.17,-.02,.14));o.add(et(at.ico,a,0,.38,0,.21,.28,.19)),o.add(et(at.ico,c,0,.36,.1,.14,.2,.09));const l=new Ot;l.position.set(0,.72,.05),o.add(l),l.add(et(at.ico,a,0,0,0,.17)),l.add(et(at.ico,c,0,-.05,.12,.09,.075,.08)),l.add(et(at.sph,h,0,-.02,.2,.028));for(const d of[-1,1]){l.add(et(at.sph,h,d*.075,.04,.13,.034)),l.add(et(at.sph,pt("#ffffff"),d*.068,.055,.155,.01));const v=et(at.cone,a,d*.09,.16,-.02,.05,.13,.04);v.rotation.z=-d*.25,l.add(v);const x=et(at.cone,pt(Zs(i,-.25)),d*.1,.25,-.02,.025,.07,.02);x.rotation.z=-d*.3,l.add(x)}e==="acorn"&&(l.add(et(at.cap,pt(n),0,.07,0,.19,.13,.19)),l.add(et(at.brim,pt(n),0,.07,0,.19,1,.19)),l.add(et(at.cyl,pt(Zs(n,-.2)),0,.22,0,.02,.06,.02)));const u=new Ot;u.position.set(0,.22,-.18),o.add(u);const f=new Ya([[0,0,0],[0,.2,-.26],[0,.55*s,-.32],[0,.82*s,-.22],[0,.93*s,-.02]].map(d=>new R(...d))),p=pt(Zs(i,.08)),_=pt(Zs(i,.2)),g=12;for(let d=0;d<g;d++){const v=d/(g-1),x=.085+Math.sin(Math.min(1,v*1.15)*Math.PI)*.11,M=f.getPointAt(v);u.add(et(at.ico,v>.75?_:p,M.x,M.y,M.z,x,x*1.1,x))}const m=[];for(const d of[-1,1]){const v=new Ot;v.position.set(d*.17,.52,.04),v.add(et(at.ico,a,0,-.1,0,.05,.12,.05));const x=new Ot;x.position.set(0,-.21,0),x.add(et(at.ico,a,0,0,0,.045)),v.add(x),v.userData.hand=x,v.rotation.x=-.9,o.add(v),m.push(v)}return r.userData.anim={kind:"squirrel",body:o,tail:u,head:l,armL:m[0],armR:m[1]},r}function _s({scale:i="#3f8f4a",belly:t="#d9cf86",hood:e=null,hoodSize:n=1,long:s=!1,thick:r=1}={}){const o=new Ot,a=new Ot;o.add(a);const c=pt(i),h=pt(t);let l;if(s)l=[[.05,.05,-.9],[-.18,.06,-.62],[.16,.07,-.34],[-.06,.1,-.08],[0,.26,.02],[0,.4,.03]];else{l=[];for(let g=0;g<=10;g++){const m=g/10,d=-.6+m*Math.PI*2.3,v=.3-m*.17;l.push([Math.cos(d)*v,.06+m*.1,Math.sin(d)*v-.04])}l.push([0,.3,.02],[0,.42,.03])}a.add(ov(l,.025,.115*r,c));const u=et(new Ka(.12*r,.2,3,8),c,0,.53,.04);u.rotation.x=.12,a.add(u),a.add(et(at.ico,h,0,.5,.12*r,.085*r,.17,.05));const f=new Ot;if(f.position.set(0,.79,.08),a.add(f),e){const g=et(at.ico,pt(e),0,-.02,-.07,.21*n,.24*n,.05);f.add(g);for(const m of[-1,1])f.add(et(at.sph,pt(t),m*.08*n,.02,-.12,.035*n,.035*n,.01))}f.add(et(at.ico,c,0,0,.02,.11,.09,.15)),f.add(et(at.ico,h,0,-.04,.06,.08,.04,.11));for(const g of[-1,1])f.add(et(at.sph,pt("#ffd23a",{emissive:"#b08000",emissiveIntensity:.4}),g*.065,.035,.09,.03)),f.add(et(at.sph,pt("#111111"),g*.079,.037,.1,.008,.024,.012));const p=new Ot;p.position.set(0,-.03,.16);for(const g of[-1,1]){const m=et(at.cyl,pt("#d0304a"),g*.012,0,.05,.008,.1,.008);m.rotation.x=Math.PI/2,m.rotation.z=g*.3,p.add(m)}p.scale.setScalar(.001),f.add(p);const _=[];for(const g of[-1,1]){const m=new Ot;m.position.set(g*.15*r,.64,.05),m.add(et(at.ico,c,0,-.1,0,.045*r,.12,.045*r));const d=new Ot;d.position.set(0,-.21,0),d.add(et(at.ico,c,0,0,0,.042*r)),m.add(d),m.userData.hand=d,m.rotation.x=-.9,a.add(m),_.push(m)}return o.userData.anim={kind:"naga",body:a,head:f,tongue:p,armL:_[0],armR:_[1]},o}const Js=()=>pt("#7a5232");function av(i=1.1,t="#c9a24a"){const e=new Ot;return e.add(et(at.cyl,Js(),0,0,0,.022,i,.022)),e.add(et(at.cone,qe(t),0,i/2+.07,0,.04,.14,.04)),e}function Mh(i,t,e){const n=new Ot,s=et(at.cyl,t,0,0,0,i,.04,i);return s.rotation.x=Math.PI/2,n.add(s),n.add(et(at.sph,e,0,0,.03,i*.25,i*.25,i*.15)),n}const Zs=(i,t)=>{const e=new qt(i),n={};return e.getHSL(n),e.setHSL(n.h,n.s,Math.max(0,Math.min(1,n.l+t))),"#"+e.getHexString()};function Kn(i,t,e=.9){i.userData.hand.add(t),t.rotation.x=e}function yh(i,t,e,n){const s=new Ot,r=et(at.cyl,pt("#5a3a22"),0,0,0,i,.1,i);r.rotation.z=Math.PI/2;const o=et(at.cyl,qe("#444"),0,0,0,i*.3,.13,i*.3);return o.rotation.z=Math.PI/2,s.add(r,o),s.position.set(t,e,n),s}const cv={nutkin(){const i=gs({fur:"#cf6d2a",hatColor:"#6a4a26"}),t=i.userData.anim,e=et(at.cone,pt("#5f8f2e"),0,.45,-.06,.25,.42,.2);e.rotation.x=.15,t.body.add(e);const n=new Ot;return n.add(Ri([0,-.08,0],[0,.04,0],.018,Js())),n.add(Ri([0,.04,0],[-.05,.13,0],.014,Js())),n.add(Ri([0,.04,0],[.05,.13,0],.014,Js())),Kn(t.armR,n,1.4),t.armR.rotation.x=-1.3,i},grenadier(){const i=gs({fur:"#a9552a",hatColor:"#4f3a22"}),t=i.userData.anim,e=et(new wn(.21,.025,4,16),pt("#4a3020"),0,.4,.02);e.rotation.set(.1,0,.75),e.scale.z=.8,t.body.add(e);for(let s=0;s<4;s++){const r=-.7+s*.45;t.body.add(et(at.sph,pt("#8a5a2a"),Math.sin(r)*.21*.7,.4+Math.cos(r)*.21*.7,.17,.045,.055,.045))}for(const s of[-1,1])t.head.add(et(new wn(.04,.012,4,10),qe("#c9a24a"),s*.07,.07,.14));const n=new Ot;return n.add(et(at.sph,pt("#8a5a2a"),0,0,0,.06,.07,.06)),n.add(et(at.cap,pt("#4f3a22"),0,.03,0,.065,.04,.065)),n.add(et(at.brim,pt("#4f3a22"),0,.03,0,.065,1,.065)),n.add(et(at.sph,Ai("#ffb030"),0,.1,0,.022)),Kn(t.armR,n,0),t.armR.rotation.x=2.3,i},oakguard(){const i=gs({fur:"#8a5a35",hatColor:"#5a3c22"}),t=i.userData.anim;t.body.add(et(at.ico,pt("#5b4330"),0,.42,.05,.2,.22,.16));const e=et(at.cone,pt("#c0302a"),0,.3,-.05,.03,.18,.08);e.rotation.x=-.5,t.head.add(e);const n=Mh(.22,pt("#6b4a2e"),pt("#3e7a2a"));Kn(t.armL,n,.9),n.position.set(-.02,0,.08),t.armL.rotation.set(-.6,0,.3);const s=new Ot;return s.add(et(at.cyl,Js(),0,.2,0,.022,1.15,.022)),s.add(et(at.box,qe("#a8b0b8"),.07,.62,0,.12,.16,.02)),s.add(et(at.cone,pt("#6b4a26"),0,.85,0,.06,.18,.06)),Kn(t.armR,s,.9),i},glider(){const i=gs({fur:"#9a8a78",belly:"#efe5d5",hat:"none",tailUp:.25}),t=i.userData.anim;for(const n of[-1,1])t.head.add(et(new wn(.045,.015,4,10),qe("#c9a24a"),n*.07,.07,.14));t.head.add(et(at.cap,pt("#6b4a2e"),0,.06,-.01,.18,.11,.18)),t.head.add(et(at.brim,pt("#6b4a2e"),0,.06,-.01,.18,1,.18)),t.armL.rotation.set(-.2,0,-1.25),t.armR.rotation.set(-.2,0,1.25);const e=pt(Zs("#9a8a78",-.12),{side:dn});for(const n of[-1,1]){const s=new Te;s.setAttribute("position",new se([n*.15,.52,.02,n*.42,.45,.02,n*.2,.1,0,n*.15,.52,.02,n*.2,.1,0,n*.12,.25,0],3)),s.computeVertexNormals();const r=new Ht(s,e);r.castShadow=!0,t.body.add(r)}return t.body.position.y=.7,t.body.rotation.x=.55,t.lift=.7,i.add(et(at.cyl,pt("#cfe8ff",{transparent:!0,opacity:.35}),0,.42,0,.025,.66,.025)),t.tail.rotation.x=-.6,i},trebuchet(){const i=new Ot,t=new Ot;i.add(t);const e=pt("#7a5232"),n=pt("#5f3e24");for(const h of[-1,1])t.add(et(at.box,n,h*.38,.2,0,.1,.1,1.6)),t.add(Ri([h*.38,.2,-.55],[h*.38,1.25,0],.045,e)),t.add(Ri([h*.38,.2,.55],[h*.38,1.25,0],.045,e));t.add(et(at.box,n,0,.2,.6,.86,.08,.1)),t.add(et(at.box,n,0,.2,-.6,.86,.08,.1));const s=et(at.cyl,qe("#555"),0,1.25,0,.04,.9,.04);s.rotation.z=Math.PI/2,t.add(s);const r=[];for(const h of[-1,1])for(const l of[-.6,.6]){const u=yh(.17,h*.5,.17,l);t.add(u),r.push(u)}const o=new Ot;o.position.set(0,1.25,0),o.add(et(at.box,e,0,0,.35,.08,.08,1.7));const a=et(at.box,n,0,-.18,-.45,.32,.3,.3);o.add(a);for(let h=0;h<5;h++)o.add(et(at.sph,pt("#8a5a2a"),(Math.random()-.5)*.2,-.02,-.45+(Math.random()-.5)*.2,.06));const c=et(at.cone,pt("#6b4a26"),0,0,1.25,.11,.24,.11);c.rotation.x=Math.PI/2,o.add(c),o.add(et(at.sph,Ai("#ff8a2a"),0,.06,1.25,.05)),o.rotation.x=.75,o.rotation.y=Math.PI,t.add(o);for(const h of[-1,1]){const l=gs({fur:"#c96a2d"});l.scale.setScalar(.72),l.position.set(h*.72,.05,-.25),l.rotation.y=-h*.5,l.userData.anim.armR.rotation.x=-2.2,t.add(l)}o.userData.keep=!0;for(const h of r)h.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:r,throwArm:o,rest:.75},i},elder(){const i=gs({fur:"#a9a197",belly:"#f4efe6",hat:"none"}),t=i.userData.anim;i.scale.setScalar(1.28);const e=et(new Bn(.3,.55,10,1,!0),pt("#5a6b34",{side:dn}),0,.3,0);t.body.add(e),t.head.add(et(at.cone,pt("#f4efe6"),0,-.14,.15,.06,.16,.04).rotateX(Math.PI));for(let s=0;s<7;s++){const r=s/7*Math.PI*2,o=et(at.cone,pt(s%2?"#d08a2c":"#6aa646"),Math.cos(r)*.15,.12,Math.sin(r)*.15,.035,.12,.02);o.rotation.set(Math.sin(r)*.4,0,-Math.cos(r)*.4),t.head.add(o)}const n=new Ot;n.add(et(at.cyl,pt("#5a3d24"),0,.25,0,.025,1,.025)),n.add(et(at.oct,Ai("#7dff8a"),0,.82,0,.07,.11,.07));for(let s=0;s<3;s++){const r=s/3*Math.PI*2;n.add(Ri([0,.7,0],[Math.cos(r)*.07,.86,Math.sin(r)*.07],.012,pt("#5a3d24")))}return Kn(t.armL,n,.9),t.armL.rotation.x=-.6,t.gem=n.children[1],t.gem.userData.keep=!0,i},scaleguard(){const i=_s({scale:"#3f8f4a",belly:"#d9cf86"}),t=i.userData.anim;t.head.add(et(at.cap,qe("#b8862e"),0,.04,.01,.12,.09,.15)),t.head.add(et(at.brim,qe("#b8862e"),0,.04,.01,.12,1,.15)),t.head.add(et(at.box,qe("#b8862e"),0,.12,-.02,.015,.06,.18)),Kn(t.armR,av(1.15),.9);const e=Mh(.2,qe("#a8762a"),qe("#e0b050"));return Kn(t.armL,e,.9),e.position.z=.06,t.armL.rotation.set(-.7,0,.35),i},spitter(){const i=_s({scale:"#2f8f86",belly:"#e0d890",hood:"#5a2f7a",hoodSize:1.45}),t=i.userData.anim;return t.head.add(et(at.sph,Ai("#8aff5a"),0,-.04,.16,.035)),t.body.add(et(at.ico,pt("#7a8a3a"),.17,.38,.05,.08,.1,.08)),t.body.add(et(at.sph,Ai("#8aff5a"),.17,.48,.05,.03)),t.armL.rotation.x=-.5,t.armR.rotation.x=-.5,i},sidewinder(){const i=_s({scale:"#c2a061",belly:"#efe0b0",long:!0}),t=i.userData.anim;for(let e=0;e<6;e++)t.body.add(et(at.oct,pt("#6b4a2a"),0,.12+e*.07,-.05-e*.02,.04,.03,.04));for(const e of[-1,1]){const n=et(at.cone,pt("#8a6a3a"),e*.06,.08,.05,.02,.07,.02);n.rotation.z=-e*.4,t.head.add(n);const s=et(new wn(.13,.014,4,12,Math.PI*.9),qe("#c8ccd0"),0,.08,.08);s.rotation.y=Math.PI/2,Kn(e<0?t.armL:t.armR,s,.4)}return t.armL.rotation.set(-1.3,0,.3),t.armR.rotation.set(-1.3,0,-.3),t.body.rotation.x=.12,i},brute(){const i=_s({scale:"#4f6e2a",belly:"#c8b870",thick:1.35}),t=i.userData.anim;i.scale.setScalar(2.15);for(let e=0;e<7;e++){const n=et(at.cone,pt("#e8dcc0"),0,.45+e*.06,-.12-(e<3?0:(e-3)*.01),.02,.07,.02);n.rotation.x=-1.1,t.body.add(n)}for(const e of[-1,1]){const n=et(at.cone,pt("#e8dcc0"),e*.07,.08,-.03,.025,.12,.025);n.rotation.set(-.6,0,-e*.6),t.head.add(n),t.body.add(et(new wn(.06,.015,4,10).rotateX(Math.PI/2),qe("#b8862e"),e*.2,.5,.05))}return t.armL.rotation.set(-1.2,0,.5),t.armR.rotation.set(-1.2,0,-.5),i},engine(){const i=new Ot,t=new Ot;i.add(t);const e=pt("#4a3a2a"),n=pt("#3a2c20");t.add(et(at.box,e,0,.36,0,.8,.22,1.35));const s=[];for(const c of[-1,1])for(const h of[-.45,.45]){const l=yh(.21,c*.47,.21,h);t.add(l),s.push(l)}const r=et(at.ico,pt("#d8cfb0"),0,.55,.78,.2,.16,.28);t.add(r);for(const c of[-1,1])t.add(et(at.cone,pt("#f4ecd8"),c*.09,.43,.92,.025,.12,.025).rotateX(Math.PI)),t.add(et(at.sph,Ai("#8aff5a"),c*.1,.62,.88,.035));for(const c of[-1,1])t.add(Ri([c*.3,.45,-.3],[c*.2,1.05,-.1],.04,n));const o=new Ot;o.position.set(0,1.05,-.1),o.add(et(at.box,e,0,0,.35,.08,.08,.9)),o.add(et(at.cap,pt("#3a2c20",{side:dn}),0,.02,.8,.14,.08,.14).rotateX(Math.PI));const a=et(at.sph,pt("#7dff5a",{emissive:"#4ad02a",emissiveIntensity:1.1,transparent:!0,opacity:.85,roughness:.15}),0,.12,.8,.14);a.userData.keep=!0,o.add(a),o.rotation.x=-.55,t.add(o);for(let c=0;c<3;c++)t.add(et(at.sph,pt("#7dff5a",{emissive:"#3ab02a",emissiveIntensity:.9}),-.2+c*.2,.55,-.55,.08));for(const c of[-1,1]){const h=_s({scale:"#3f8f4a",belly:"#d9cf86"});h.scale.setScalar(.72),h.position.set(c*.72,.05,-.35),h.rotation.y=-c*.5,t.add(h)}o.userData.keep=!0;for(const c of s)c.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:s,throwArm:o,rest:-.55,globe:a},i},hierophant(){const i=_s({scale:"#5e3a8c",belly:"#e6c870",hood:"#3a2060",hoodSize:1.7}),t=i.userData.anim;i.scale.setScalar(1.32);for(let n=0;n<5;n++){const s=(n/4-.5)*1.6,r=et(at.cone,qe("#e0b040"),Math.sin(s)*.1,.12+Math.cos(s)*.04,-.02,.02,.12,.02);r.rotation.z=-s*.5,t.head.add(r)}for(const n of[-1,1])t.body.add(et(new wn(.05,.014,4,10).rotateX(Math.PI/2),qe("#e0b040"),n*.15,.45,.05));const e=new Ot;return e.add(et(at.cyl,pt("#2a1a40"),0,.25,0,.022,1,.022)),e.add(et(at.sph,Ai("#c070ff"),0,.82,0,.08)),e.add(et(new wn(.1,.012,4,14),qe("#e0b040"),0,.82,0)),Kn(t.armL,e,.9),t.armL.rotation.x=-.6,t.gem=e.children[1],t.gem.userData.keep=!0,i}};function lv(i,t,e){const n=new Ot;n.add(rv(t.base,e));const s=cv[i]();return s.position.y=t.big?.09:.06,s.userData.y0=s.position.y,n.add(s),n.userData.fig=s,n.userData.anim=s.userData.anim,n.userData.phase=Math.random()*10,La(n.children[0]),La(s),n.traverse(r=>{r.isMesh&&(r.castShadow=!0)}),n.children[0].traverse(r=>{r.isMesh&&(r.receiveShadow=!0)}),n}function hv(i){for(const t of["position","normal"]){const e=i.getAttribute(t);for(let n=0;n<e.count;n+=3){const s=e.getX(n+1),r=e.getY(n+1),o=e.getZ(n+1);e.setXYZ(n+1,e.getX(n+2),e.getY(n+2),e.getZ(n+2)),e.setXYZ(n+2,s,r,o)}}}const _a=new Map;function uv(i){return[i.metalness,i.roughness,i.emissiveIntensity>0?i.emissive.getHex():0,i.emissiveIntensity,i.transparent,i.opacity,i.side,i.flatShading].join("|")}function La(i){i.updateMatrixWorld(!0);const t=new le().copy(i.matrixWorld).invert(),e=new le,n=new Map,s=[],r=o=>{for(const a of o.children){if(a.userData.keep){La(a);continue}if(a.isMesh){const c=a.material,h=uv(c);n.has(h)||n.set(h,{m:c,geos:[]});const l=a.geometry.index?a.geometry.toNonIndexed():a.geometry,u=new Te;u.setAttribute("position",l.getAttribute("position").clone()),u.setAttribute("normal",l.getAttribute("normal").clone()),u.applyMatrix4(e.multiplyMatrices(t,a.matrixWorld)),e.determinant()<0&&hv(u);const f=u.getAttribute("position").count,p=new Float32Array(f*3);for(let _=0;_<f;_++)p.set([c.color.r,c.color.g,c.color.b],_*3);u.setAttribute("color",new mn(p,3)),n.get(h).geos.push(u),s.push(a)}r(a)}};r(i);for(const o of s)o.parent.remove(o);for(const[o,{m:a,geos:c}]of n)_a.has(o)||_a.set(o,new Cn({vertexColors:!0,metalness:a.metalness,roughness:a.roughness,flatShading:a.flatShading,emissive:a.emissive,emissiveIntensity:a.emissiveIntensity,transparent:a.transparent,opacity:a.opacity,side:a.side})),i.add(new Ht(sv(c),_a.get(o)))}const si={nutkin:"shooter",grenadier:"shooter",oakguard:"melee",glider:"raider",trebuchet:"artillery",elder:"hero",scaleguard:"line",spitter:"shooter",sidewinder:"melee",brute:"melee",engine:"artillery",hierophant:"hero"},Ns=["melee","raider","line","shooter","hero","artillery"];async function xu(i,t,e){e==="move"?await fv(i,t):e==="shoot"?await dv(i,t):e==="charge"&&await pv(i,t)}const Mu=i=>i.t.pts*i.alive/i.t.models;function Oi(i,t){return i.t.melee?co(i.alive*i.t.A,ar(i.t.WS,i.mesmerized?1:0),i.t.melee,t,!1).value:0}function yu(i,t,e,n,s){var h;const r=t.t.ranged;if(!r||Ft(e.pos.x-n.x,e.pos.z-n.z)-t.r-e.r>r.range||i.isEngaged(e)&&!r.spell)return 0;const a=i.sight(t,e,n);if(!a.visible&&!r.indirect&&!r.mesmerize)return 0;if(r.mesmerize)return a.visible?Hi(r.spell)*(Mu(e)*.25+Math.min(2,e.alive)*e.t.pts*.08+((h=e.t.ranged)!=null&&h.blast?8:0)):0;let c=0;if(r.heavy&&s&&c++,r.indirect&&!a.visible&&c++,r.blast){const l=r.spell?Hi(r.spell):jr(ar(t.t.BS,c)),u=e.t.big?3:Math.max(1,Math.min(e.alive,Math.round(e.alive*Math.min(1,r.blast*r.blast/(e.r*e.r))*.8)));return Is(t,r,!1)*l*co(u,1,r,e,a.cover).value}return co(Is(t,r,!1),ar(t.t.BS,c),r,e,a.cover).value}async function fv(i,t){const e=i.units.filter(s=>s.side===t&&i.alive(s));e.sort((s,r)=>Ns.indexOf(si[s.key])-Ns.indexOf(si[r.key]));const n=new Set;for(const s of e){if(!i.alive(s)||s.flags.moved)continue;const r=si[s.key];if(i.isEngaged(s)){const l=i.engagedWith(s),u=l.reduce((m,d)=>m+Oi(d,s),0),f=l.reduce((m,d)=>Math.max(m,Oi(s,d)),0);if(r==="melee"||r==="line"||f>=u*.8)continue;const p=i.movePlan(s);let _=-1,g=-1/0;for(let m=0;m<i.nav.N;m+=2){if(!i.validEnd(p,m))continue;const d=i.nav.x(m),v=i.nav.z(m),x=Math.min(...i.enemiesOf(s).map(M=>Ft(M.pos.x-d,M.pos.z-v)-M.r));x>g&&(g=x,_=m)}_>=0&&(i.focus(s.pos.x,s.pos.z),await i.doMove(s,_,p));continue}let o=i.movePlan(s,s.flags.advanced?s.flags.advRoll:0),a=Sh(i,s,o,n);const c=Math.min(...i.enemiesOf(s).map(l=>i.gap(s,l)));let h=!1;if(r==="melee"||r==="line"||r==="raider"?h=c>s.t.M+8&&!(r==="line"&&a.onObjective)&&!(r==="raider"&&a.canShoot):r==="shooter"&&(h=!a.canShoot&&!a.onObjective&&(s.t.ranged.assault||c>s.t.ranged.range+s.t.M+3)),h&&!s.flags.advanced){i.focus(s.pos.x,s.pos.z);const l=await i.doAdvance(s);o=i.movePlan(s,l);const u=Sh(i,s,o,n);u.cell>=0&&(a=u)}a.obj>=0&&n.add(a.obj),a.cell>=0&&a.dist>.4?(i.focus(s.pos.x,s.pos.z),await i.doMove(s,a.cell,o)):s.flags.advanced&&(s.flags.moved=!0),await je(.05)}}function Sh(i,t,e,n){const{nav:s}=i,r=i.enemiesOf(t),o=i.friendsOf(t),a=i.objectives.map(p=>i.controlOf(p)),c=si[t.key],h={enemies:r,friends:o,owners:a,claimed:n,role:c};let l={cell:-1,score:bh(i,t,t.pos.x,t.pos.z,h,!1),dist:0,...h.last};const u=t.t.M>8?3:2,f=e.res;for(let p=0;p<s.nz;p+=u)for(let _=p/u%2?1:0;_<s.nx;_+=u){const g=p*s.nx+_;if(!isFinite(f.dist[g])||!i.validEnd(e,g))continue;const m=s.x(g),d=s.z(g),v=bh(i,t,m,d,h,!0)+sr(i.G.rng)*.05;v>l.score&&(l={cell:g,score:v,dist:Ft(m-t.pos.x,d-t.pos.z),...h.last})}return l}function bh(i,t,e,n,s,r){const{enemies:o,friends:a,owners:c,claimed:h,role:l}=s,u=t.t,f={x:e,z:n},p=r&&Ft(e-t.pos.x,n-t.pos.z)>.3;let _=0,g=!1,m=-1;if(u.OC>0){const M=l==="line"||l==="shooter"?5:l==="melee"?2:2.5;let C=0;for(const w of i.objectives){const A=Ft(w.x-e,w.z-n),U=c[w.i]===t.side?.45:1,y=h.has(w.i)?.25:1;let b;A<=2.6?b=M*U*y*1.4:b=M*U*y*Math.max(0,1-(A-2.6)/16)*.7,b>C&&(C=b,A<=2.6?(g=!0,m=w.i):g||(m=-1))}_+=C}let d=!1;if(u.ranged&&l!=="melee"){let M=0;for(const w of o){const A=yu(i,t,w,f,p);A>M&&(M=A)}M>0&&(d=!0),_+=M*(l==="artillery"?.25:l==="hero"?.12:.18)*(t.flags.advanced&&!u.ranged.assault?0:1)}if(l==="melee"||l==="line"||l==="raider"||l==="hero"){let M=0;for(const w of o){const A=Ft(w.pos.x-e,w.pos.z-n)-t.r-w.r;if(A>go)continue;const U=A<=1?1:Hi(Math.ceil(A)),y=Oi(w,t)*.4,b=U*(Oi(t,w)-y+(w.t.role==="Artillery"?10:0));b>M&&(M=b)}if(_+=M*(l==="melee"?.3:l==="raider"?.18:l==="hero"?.06:.15),M===0&&l!=="hero"){const w=Math.min(...o.map(A=>Ft(A.pos.x-e,A.pos.z-n)));_-=w*(l==="melee"?.12:.05)}}const v=l==="shooter"||l==="artillery"||l==="hero";for(const M of o){const C=Ft(M.pos.x-e,M.pos.z-n)-t.r-M.r;(!M.t.ranged||M.t.wrecker||M.key==="sidewinder"||M.key==="oakguard")&&C<M.t.M+7&&(_-=Oi(M,t)*(v?.16:.05)*(1-C/(M.t.M+7)))}const x=i.nav.index(e,n);if(x>=0&&i.nav.cover[x]&&(_+=v?1.5:.5),l==="artillery"&&p&&(_-=2.5),l==="hero"){let M=0;for(const w of a)Ft(w.pos.x-e,w.pos.z-n)<=ao+w.r&&M++;_+=Math.min(3,M)*.9;const C=Math.min(...o.map(w=>Ft(w.pos.x-e,w.pos.z-n)));C<8&&(_-=(8-C)*.6)}for(const M of a){const C=Ft(M.pos.x-e,M.pos.z-n)-M.r-t.r;C<1.5&&(_-=(1.5-C)*.6)}return s.last={onObjective:g,obj:m,canShoot:d},_}async function dv(i,t){const e=i.units.filter(n=>n.side===t&&i.canShoot(n));e.sort((n,s)=>Ns.indexOf(si[s.key])-Ns.indexOf(si[n.key]));for(const n of e){if(!i.canShoot(n))continue;const s=i.shootTargets(n);let r=null,o=.4;for(const a of s){let c=yu(i,n,a,n.pos,n.flags.moved);const h=n.t.ranged;if(h.blast)for(const l of i.units){if(l.side!==n.side||!i.alive(l))continue;const u=Ft(l.pos.x-a.pos.x,l.pos.z-a.pos.z)-l.r;u<h.blast+2.5&&(c-=Mu(l)*.25*(1-Math.max(0,u)/(h.blast+2.5)))}h.mesmerize&&a.mesmerized&&(c*=.2),c>o&&(o=c,r=a)}r&&(i.focus((n.pos.x+r.pos.x)/2,(n.pos.z+r.pos.z)/2),await i.doShoot(n,r),await je(.1))}}async function pv(i,t){const e=i.units.filter(n=>n.side===t&&i.canCharge(n));e.sort((n,s)=>Ns.indexOf(si[n.key])-Ns.indexOf(si[s.key]));for(const n of e){if(!i.canCharge(n))continue;const s=si[n.key];let r=null,o=0;for(const a of i.chargeTargets(n)){const c=i.chargePlan(n,a);if(!c)continue;const h=Hi(c.need),l=Oi(n,a)+(a.t.role==="Artillery"?12:0)+(a.alive<=2?6:0),u=Oi(a,n);if(h<(s==="melee"?.25:s==="line"?.33:s==="raider"?.4:s==="hero"?.5:.6)||(s==="shooter"||s==="hero")&&l<u*1.4)continue;const p=h*(l-u*.4);p>o&&(o=p,r=a)}r&&(i.focus((n.pos.x+r.pos.x)/2,(n.pos.z+r.pos.z)/2),await i.doCharge(n,r,{auto:!0}),await je(.1))}}let tn=null,Ts=null,Qn=!1;try{Qn=localStorage.getItem("tails-and-scales:muted")==="1"}catch{}function _o(){if(!tn)try{tn=new(window.AudioContext||window.webkitAudioContext),Ts=tn.createGain(),Ts.gain.value=Qn?0:.5,Ts.connect(tn.destination)}catch{tn=null}}function mv(){Qn=!Qn;try{localStorage.setItem("tails-and-scales:muted",Qn?"1":"0")}catch{}return Ts&&(Ts.gain.value=Qn?0:.5),Qn}const gv=()=>Qn;function _v(i){const t=Math.floor(tn.sampleRate*i),e=tn.createBuffer(1,t,tn.sampleRate),n=e.getChannelData(0);for(let r=0;r<t;r++)n[r]=Math.random()*2-1;const s=tn.createBufferSource();return s.buffer=e,s}function Su(i,t,e,n,s){const r=tn.createGain();return r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(n,t+e),r.gain.exponentialRampToValueAtTime(1e-4,t+s),i.connect(r),r.connect(Ts),r}function vs({dur:i=.3,freq:t=800,type:e="lowpass",peak:n=.5,delay:s=0,q:r=1}){const o=tn.currentTime+s,a=_v(i),c=tn.createBiquadFilter();c.type=e,c.frequency.value=t,c.Q.value=r,a.connect(c),Su(c,o,.005,n,i),a.start(o)}function Ci({f0:i=440,f1:t=i,dur:e=.15,type:n="sine",peak:s=.2,delay:r=0}){const o=tn.currentTime+r,a=tn.createOscillator();a.type=n,a.frequency.setValueAtTime(i,o),a.frequency.exponentialRampToValueAtTime(Math.max(20,t),o+e),Su(a,o,.01,s,e),a.start(o),a.stop(o+e+.05)}const vv={dice(i=3){for(let t=0;t<Math.min(6,i);t++)vs({dur:.04,freq:2500+Math.random()*2e3,type:"bandpass",q:4,peak:.35,delay:t*.035+Math.random()*.02})},boom(i=1){vs({dur:.5+i*.5,freq:300+200/i,peak:.8}),Ci({f0:90,f1:30,dur:.5+i*.3,type:"sine",peak:.5})},shot(){Ci({f0:900,f1:300,dur:.08,type:"triangle",peak:.12})},thwack(){vs({dur:.07,freq:1400,type:"bandpass",q:2,peak:.4})},squeak(){Ci({f0:1400,f1:2400,dur:.12,type:"sine",peak:.12})},hiss(){vs({dur:.35,freq:5e3,type:"highpass",peak:.18})},crumble(){vs({dur:.8,freq:500,peak:.45});for(let i=0;i<4;i++)vs({dur:.05,freq:1200,type:"bandpass",peak:.25,delay:.1+i*.09})},magic(){for(let i=0;i<4;i++)Ci({f0:500+i*220,f1:900+i*300,dur:.25,type:"sine",peak:.08,delay:i*.06})},fizzle(){Ci({f0:600,f1:120,dur:.35,type:"sawtooth",peak:.06})},fanfare(){[523,659,784,1046].forEach((i,t)=>Ci({f0:i,dur:.3,type:"triangle",peak:.15,delay:t*.14}))},click(){Ci({f0:1200,f1:900,dur:.04,type:"square",peak:.04})}},Le=new Proxy(vv,{get(i,t){return(...e)=>{if(!(!tn||Qn))try{i[t](...e)}catch{}}}}),{W:ue,H:Pe}=Nn,Tt=i=>document.querySelector(i),$i=new URLSearchParams(location.search),Ke=new cu({antialias:!0});Ke.setPixelRatio($i.has("lowfi")?.5:Math.min(devicePixelRatio,2));Ke.setSize(innerWidth,innerHeight);Ke.shadowMap.enabled=!$i.has("lowfi");Ke.shadowMap.type=Dh;Ke.toneMapping=Ih;Ke.toneMappingExposure=1.05;document.body.prepend(Ke.domElement);const ce=new h_;ce.background=new qt("#1c1712");ce.fog=new Va("#1c1712",70,140);const me=new un(40,innerWidth/innerHeight,.1,400);me.position.set(0,30,31);const Be=new N_(me,Ke.domElement);Be.target.set(0,0,1.5);Be.enableDamping=!0;Be.dampingFactor=.08;Be.maxPolarAngle=1.32;Be.minDistance=5;Be.maxDistance=75;Be.screenSpacePanning=!1;Be.mouseButtons={LEFT:Zn.ROTATE,MIDDLE:Zn.DOLLY,RIGHT:Zn.PAN};ce.add(new R_("#d6e6ff","#3b2a1a",.85));const qi=new mu("#fff0d6",2.3);qi.position.set(-16,34,20);qi.castShadow=!0;qi.shadow.mapSize.set(2048,2048);Object.assign(qi.shadow.camera,{left:-27,right:27,top:22,bottom:-22,near:5,far:90});qi.shadow.bias=-4e-4;qi.shadow.normalBias=.02;ce.add(qi);const bu=new mu("#9fb8ff",.35);bu.position.set(18,12,-16);ce.add(bu);const Eu=Tt("#labels"),ie=new iv(ce,me,Eu);function xv(){const i=document.createElement("canvas");i.width=2048,i.height=Math.round(2048*Pe/ue);const t=i.getContext("2d");t.fillStyle="#5b7a36",t.fillRect(0,0,i.width,i.height);const e=(s,r,o,a,c)=>{for(let h=0;h<r;h++)t.globalAlpha=c*(.4+Math.random()*.6),t.fillStyle=s[Math.random()*s.length|0],t.beginPath(),t.ellipse(Math.random()*i.width,Math.random()*i.height,o+Math.random()*(a-o),o+Math.random()*(a-o),Math.random()*3,0,Math.PI*2),t.fill()};e(["#6a8a40","#4f6c2c","#729347","#55742f","#7f964c"],700,20,90,.35),e(["#7d6b45","#6e5d3a","#8a7650"],40,30,110,.22),e(["#8fa65a","#a4b46a"],300,4,14,.4);for(let s=0;s<14e3;s++)t.globalAlpha=.35,t.fillStyle=Math.random()<.5?"#3f5a24":"#8fae5a",t.fillRect(Math.random()*i.width,Math.random()*i.height,2,4+Math.random()*4);t.globalAlpha=1;const n=new Xa(i);return n.colorSpace=Ce,n.anisotropy=Ke.capabilities.getMaxAnisotropy(),n}function Mv(){const i=document.createElement("canvas");i.width=i.height=512;const t=i.getContext("2d");t.fillStyle="#4a3020",t.fillRect(0,0,512,512);for(let n=0;n<260;n++){t.strokeStyle=Math.random()<.5?"rgba(30,18,10,0.35)":"rgba(110,70,40,0.25)",t.lineWidth=1+Math.random()*3;const s=Math.random()*512;t.beginPath(),t.moveTo(0,s);for(let r=0;r<=512;r+=32)t.lineTo(r,s+Math.sin(r*.02+n)*4);t.stroke()}const e=new Xa(i);return e.colorSpace=Ce,e.wrapS=e.wrapT=Zr,e.repeat.set(6,6),e}const yv=new Cn({map:xv(),roughness:.95}),ec=new Ht(new Mi(ue,Pe).rotateX(-Math.PI/2),yv);ec.receiveShadow=!0;ce.add(ec);const nc=new Ht(new Mi(220,220).rotateX(-Math.PI/2),new Cn({map:Mv(),roughness:.7}));nc.position.y=-.62;nc.receiveShadow=!0;ce.add(nc);{const i=new Cn({color:"#5a3a22",roughness:.6}),t=[[ue+1.6,.8,.8,0,-Pe/2-.4],[ue+1.6,.8,.8,0,Pe/2+.4],[.8,.8,Pe,-ue/2-.4,0],[.8,.8,Pe,ue/2+.4,0]];for(const[n,s,r,o,a]of t){const c=new Ht(new Fn(n,s,r),i);c.position.set(o,-.22,a),c.castShadow=c.receiveShadow=!0,ce.add(c)}const e=new Ht(new Fn(ue,.6,Pe),i);e.position.y=-.31,ce.add(e)}const lo=[];for(const i of[0,1]){const t=i===0?-1:1,e=new Qe({color:we[i].color,transparent:!0,opacity:.07,depthWrite:!1});lo.push(e);const n=new Ht(new Mi(Nn.deploy,Pe).rotateX(-Math.PI/2),e);n.position.set(t*(ue/2-Nn.deploy/2),.008,0),n.renderOrder=1,ce.add(n);const s=[];for(let o=-Pe/2;o<Pe/2;o+=1)s.push(new R(t*(ue/2-Nn.deploy),.02,o),new R(t*(ue/2-Nn.deploy),.02,o+.5));const r=new d_(new Te().setFromPoints(s),new Wa({color:we[i].color,transparent:!0,opacity:.5}));ce.add(r)}const xs=new er(new Bn(.035,.13,3),new Cn({color:"#ffffff",roughness:1}),700),Ms=new er(new kn(.05,0),new Cn({roughness:.6}),140);ce.add(xs,Ms);function Sv(){const i=new le,t=new On,e=new Os,n=new qt;for(let r=0;r<xs.count;r++){const o=(Math.random()-.5)*(ue-.4),a=(Math.random()-.5)*(Pe-.4),c=.6+Math.random()*1.2;t.setFromEuler(e.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5)),i.compose(new R(o,.08*c,a),t,new R(c,c,c)),xs.setMatrixAt(r,i),xs.setColorAt(r,n.set(["#9cba5a","#a8c464","#b4c86e","#8fae50"][r%4]))}const s=["#f4f0e0","#f2d14a","#d77ad0","#e8e8ff"];for(let r=0;r<Ms.count;r++){const o=(Math.random()-.5)*(ue-.4),a=(Math.random()-.5)*(Pe-.4);i.compose(new R(o,.08,a),t.identity(),new R(1,.6,1)),Ms.setMatrixAt(r,i),Ms.setColorAt(r,n.set(s[r%s.length]))}xs.instanceMatrix.needsUpdate=Ms.instanceMatrix.needsUpdate=!0,xs.instanceColor.needsUpdate=Ms.instanceColor.needsUpdate=!0}const bv=[{x:0,z:0},{x:-9,z:8},{x:9,z:-8},{x:-9,z:-8},{x:9,z:8}],cr=bv.map((i,t)=>{const e=new Ot;e.position.set(i.x,0,i.z);const n=new Ht(new on(.55,.65,.16,8),pt("#8a8478"));n.position.y=.08,n.castShadow=n.receiveShadow=!0;const s=new Ht(new mo(.2,0),new Cn({color:"#fff3c0",emissive:"#ffd060",emissiveIntensity:.8,flatShading:!0}));s.position.y=.42;const r=new Ht(new on(.03,.03,2.1,6),pt("#5a3d24"));r.position.set(.35,1.1,0),r.castShadow=!0;const o=new Cn({color:"#e8e0d0",side:dn,roughness:.8}),a=new Ht(new Mi(.8,.5,6,1).translate(.4,0,0),o);a.position.set(.35,1.85,0),a.castShadow=!0;const c=new Ht(new Xi(ro-.06,ro,64).rotateX(-Math.PI/2),new Qe({color:"#fff3c0",transparent:!0,opacity:.35,depthWrite:!1}));return c.position.y=.03,e.add(n,s,r,a,c),ce.add(e),{...i,i:t,g:e,gem:s,flag:a,flagMat:o,ring:c,owner:-1}}),gn=new Z_(ce,ie,ue,Pe),ut=new k_(ue,Pe,.5);gn.onBreak=i=>{i.kind==="block"?Le.crumble():Le.thwack()};function Bs(){gn.dirty&&(gn.dirty=!1,ut.rebuild(gn.chunks))}const L={seed:Number($i.get("seed"))||Math.random()*1e6|0,stage:"title",control:["human","ai"],round:1,active:0,first:0,phase:"move",vp:[0,0],busy:!1,sel:null,reach:null,hover:null,follow:!0,pendingLog:[]},fe={rng:gu(Math.random()*1e9|0)};let ae=[],Ev=1;const oe=i=>i.alive>0,Yi=i=>ae.filter(t=>t.side!==i.side&&oe(t)),wu=i=>ae.filter(t=>t.side===i.side&&oe(t)&&t!==i),vo=(i,t)=>Ft(i.pos.x-t.pos.x,i.pos.z-t.pos.z),vi=(i,t)=>vo(i,t)-i.r-t.r,xo=i=>Yi(i).filter(t=>vi(i,t)<=zi+.05),dr=(i,t)=>i.pos.x+t.ox,pr=(i,t)=>i.pos.z+t.oz,an=i=>xo(i).length>0,Hn=i=>L.control[i]==="human";function wv(i,t){const e=t*2+.16;if(i===1)return[[0,0]];if(i<=4){const r=i===2?e/2:e/(2*Math.sin(Math.PI/i));return Array.from({length:i},(o,a)=>[Math.cos(a/i*Math.PI*2+.4)*r,Math.sin(a/i*Math.PI*2+.4)*r])}const n=i-1,s=Math.max(e,e/(2*Math.sin(Math.PI/n)));return[[0,0],...Array.from({length:n},(r,o)=>[Math.cos(o/n*Math.PI*2+.3)*s,Math.sin(o/n*Math.PI*2+.3)*s])]}function Tv(i,t){const e=z_[i],n={id:Ev++,key:i,t:e,side:t,name:e.name,pos:{x:0,z:0},facing:t===0?Math.PI/2:-Math.PI/2,models:[],alive:e.models,r:0,flags:{},lost:0,mesmerized:!1,moving:!1};for(let s=0;s<e.models;s++){const r=lv(i,e,we[t].color);ce.add(r),n.models.push({mesh:r,w:e.W,alive:!0,ox:0,oz:0,x:0,z:0,yaw:n.facing,lunge:0,lungeDir:0,lift:0})}return n.ring=new Ht(new Xi(.88,1,48).rotateX(-Math.PI/2),new Qe({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})),n.ring.position.y=.04,n.ring.renderOrder=2,ce.add(n.ring),n.hit=new Ht(new on(1,1,1,12),new Qe({visible:!1})),n.hit.userData.unit=n,ce.add(n.hit),n.label=document.createElement("div"),n.label.className=`ulabel s${t}`,Eu.appendChild(n.label),Tu(n,!0),n}function Tu(i,t=!1){const e=i.models.filter(r=>r.alive),n=wv(e.length,i.t.base);e.sort((r,o)=>Math.atan2(r.oz,r.ox)-Math.atan2(o.oz,o.ox)),n.forEach(([r,o],a)=>{e[a].ox=r,e[a].oz=o}),i.r=n.reduce((r,[o,a])=>Math.max(r,Ft(o,a)),0)+i.t.base,i.ring.scale.setScalar(i.r+.18);const s=i.t.big?2.4:i.t.fly?1.8:1.3;if(i.hit.scale.set(i.r,s,i.r),t)for(const r of i.models)Au(i,r);Vn(i)}function Au(i,t){t.x=i.pos.x+t.ox,t.z=i.pos.z+t.oz,t.mesh.position.set(t.x,0,t.z),t.mesh.rotation.y=t.yaw}function mr(i,t,e){i.pos.x=t,i.pos.z=e,i.ring.position.x=i.hit.position.x=t,i.ring.position.z=i.hit.position.z=e,i.hit.position.y=i.hit.scale.y/2}function Vn(i){const t=i.models.filter(n=>n.alive);let e=`<span class="nm">${i.t.short}</span>`;i.t.models>1?e+=`<span class="ct">${i.alive}/${i.t.models}</span>`:e+=`<span class="ct">${t[0]?t[0].w:0}/${i.t.W}♥</span>`,i.mesmerized&&(e+='<span class="st" title="Mesmerized">🌀</span>'),oe(i)&&an(i)&&(e+='<span class="st" title="In combat">⚔</span>'),i.label.innerHTML=e,i.label.style.display=oe(i)?"":"none"}function Av(){for(const i of ae){for(const t of i.models)ce.remove(t.mesh);ce.remove(i.ring,i.hit),i.label.remove()}ae=[]}function ic(i,t,e,n,s){let r=null,o=1/0;const a=n===0?-ue/2:ue/2-Nn.deploy,c=n===0?-ue/2+Nn.deploy:ue/2;for(let h=0;h<ut.N;h++){const l=ut.x(h),u=ut.z(h);if(l-i.r<a-.01||l+i.r>c+.01||!ut.standable(h,i.r,"walk")||s.some(p=>Ft(p.pos.x-l,p.pos.z-u)<p.r+i.r+.4))continue;const f=Ft(l-t,u-e);f<o&&(o=f,r={x:l,z:u})}return r}function Rv(){for(const i of[0,1]){const t=i===0?-1:1,e=ae.filter(c=>c.side===i),n=[],s=e.filter(c=>c.t.role==="Artillery"),r=e.filter(c=>c.t.hero),a=[[e.filter(c=>!s.includes(c)&&!r.includes(c)),ue/2-Nn.deploy+1.8],[r,ue/2-Nn.deploy+3.6],[s,ue/2-2.4]];for(const[c,h]of a)c.forEach((l,u)=>{const f=((u+.5)/c.length-.5)*(Pe-6)*(i?-1:1),p=ic(l,t*h,f,i,n)||{x:t*h,z:f};mr(l,p.x,p.z),n.push(l);for(const _ of l.models)Au(l,_)})}}const Ru=i=>i.t.big?1.9:i.t.fly?1.5:.95,Cu=i=>i.t.big||i.t.fly?1:.55;function Mo(i){const t=i.models.filter(n=>n.alive);if(i.t.fly)return!1;let e=0;for(const n of t)ut.cover[ut.index(dr(i,n),pr(i,n))]&&e++;return e*2>=t.length&&e>0}function Pu(i,t,e=i.pos){const n={x:e.x,y:Ru(i),z:e.z};let s=0,r=0,o=0;for(const a of t.models){if(!a.alive)continue;o++;const c=gn.los(n,{x:dr(t,a),y:Cu(t),z:pr(t,a)});c.blocked||(s++,c.obscure&&r++)}return{visible:s>0,cover:s>0&&(r>0||s<o||Mo(t)),seen:s,total:o}}function Lu(i){let t=i.t.Ld;for(const e of wu(i))e.t.hero&&vo(i,e)<=ao+i.r&&(t=Math.max(t,e.t.Ld));return t}function sc(i){const t=[0,0];for(const e of ae)if(oe(e))for(const n of e.models)n.alive&&Ft(dr(e,n)-i.x,pr(e,n)-i.z)<=ro+e.t.base&&(t[e.side]+=e.t.OC);return t[0]>t[1]?0:t[1]>t[0]?1:-1}function Du(i){return i.t.fly?"fly":i.t.wrecker?"wreck":"walk"}function Da(i,t,e=[]){const n=new Uint8Array(ut.N);n.discs=[];for(const s of Yi(i)){const r=s.r+i.r+(e.includes(s)?.02:t);n.discs.push({x:s.pos.x,z:s.pos.z,R:r-.02});const o=Math.max(0,Math.floor((s.pos.x-r+ue/2)/ut.cell)),a=Math.min(ut.nx-1,Math.floor((s.pos.x+r+ue/2)/ut.cell)),c=Math.max(0,Math.floor((s.pos.z-r+Pe/2)/ut.cell)),h=Math.min(ut.nz-1,Math.floor((s.pos.z+r+Pe/2)/ut.cell));for(let l=c;l<=h;l++)for(let u=o;u<=a;u++){const f=l*ut.nx+u;Ft(ut.x(f)-s.pos.x,ut.z(f)-s.pos.z)<r&&(n[f]=1)}}return n}function rc(i,t=0){Bs();const e=an(i),n=i.t.M+t,s=Du(i),r=Yi(i),o=Da(i,zi+.05,e?r:[]),a=Da(i,zi+.05),c=ut.reach(i.pos.x,i.pos.z,{r:i.r,max:n,mode:s==="fly"?"fly":s,forbid:s==="fly"?null:o});return{u:i,res:c,max:n,mode:s,forbid:o,endForbid:a,fallback:e}}function oc(i,t){const{u:e,res:n,mode:s,endForbid:r}=i;if(t<0||!isFinite(n.dist[t])||!ut.standable(t,e.r,s==="wreck"?"wreck":"walk",r))return!1;const o=ut.x(t),a=ut.z(t);for(const c of ae)if(c!==e&&oe(c)&&Ft(c.pos.x-o,c.pos.z-a)<c.r+e.r+.08)return!1;return!0}function Iu(i,t,e,n=2.4){let s=-1,r=n;const o=ut.index(t,e);if(o<0)return-1;const a=Math.ceil(n/ut.cell),c=o%ut.nx,h=o/ut.nx|0;for(let l=-a;l<=a;l++)for(let u=-a;u<=a;u++){const f=c+u,p=h+l;if(f<0||p<0||f>=ut.nx||p>=ut.nz)continue;const _=p*ut.nx+f,g=Ft(ut.x(_)-t,ut.z(_)-e);g<r&&oc(i,_)&&(r=g,s=_)}return s}async function Uu(i,t,{speed:e=7,fly:n=!1}={}){const s=vu(t);if(s<.05)return;if(i.moving=!0,n)for(const h of i.models)h.flying=!0;const r=[];let o=0;for(let h=1;h<t.length;h++){const l=Ft(t[h].x-t[h-1].x,t[h].z-t[h-1].z);r.push({a:t[h-1],b:t[h],s:o,l}),o+=l}const a=[];if(i.t.wrecker)for(const h of r)for(let l=0;l<h.l;l+=.25)a.push({s:h.s+l,x:h.a.x+(h.b.x-h.a.x)*l/h.l,z:h.a.z+(h.b.z-h.a.z)*l/h.l,dir:Math.atan2(h.b.x-h.a.x,h.b.z-h.a.z)});i.t.wrecker&&a.push({s,x:t[t.length-1].x,z:t[t.length-1].z,dir:r[r.length-1]?Math.atan2(r[r.length-1].b.x-r[r.length-1].a.x,r[r.length-1].b.z-r[r.length-1].a.z):i.facing});let c=0;for(await De(s/e+.15,h=>{const l=Math.min(s,h*(s+e*.15)),u=r.find(g=>l<=g.s+g.l)||r[r.length-1],f=u.l>0?(l-u.s)/u.l:1,p=zn(u.a.x,u.b.x,f),_=zn(u.a.z,u.b.z,f);if(i.facing=Math.atan2(u.b.x-u.a.x,u.b.z-u.a.z),mr(i,p,_),n)for(const g of i.models)g.lift=Math.sin(Math.min(1,l/s)*Math.PI)*Math.min(3,s*.3);for(;c<a.length&&a[c].s<=l;)Eh(i,a[c++])},tc);c<a.length;)Eh(i,a[c++]);if(i.moving=!1,n)for(const h of i.models)h.flying=!1,h.lift=0;await je(.15)}function Eh(i,{x:t,z:e,dir:n}){for(const s of gn.chunks){if(!s.alive||!s.destructible)continue;const r=s.nav||s.shape;Ft(r.x-t,r.z-e)<i.r+Math.max(r.hx,r.hz)*.8&&(gn.hurt(s,99,{x:t-Math.sin(n),z:e-Math.cos(n)}),ie.shake=Math.max(ie.shake,.08))}}async function ac(i,t,e){L.busy=!0;const n=ut.path(e.res,t,i.r,e.mode==="fly"?null:e.forbid);i.flags.moved=!0,e.fallback&&(i.flags.fellBack=!0);const s=vu(n);ke(i.side,`<b>${i.t.short}</b> ${e.fallback?"fall back":i.flags.advanced?"advance":"move"} ${s.toFixed(1)}".`),i.t.wrecker&&s>.1&&Le.boom(.4),await Uu(i,n,{fly:e.mode==="fly"}),Bs(),ni()}async function cc(i){L.busy=!0,_e.clear(`${i.t.short} — Advance`);const t=Ye(fe,1);return await _e.row("Advance D6",t,0,{sum:!0,note:`+${t[0]}"`}),i.flags.advanced=!0,i.flags.advRoll=t[0],ke(i.side,`<b>${i.t.short}</b> advance: +${t[0]}".`),L.busy=!1,t[0]}function lc(i){const t=i.t.ranged;return!(!t||!oe(i)||i.flags.shot||i.mesmerized||i.flags.fellBack||an(i)||i.flags.advanced&&!t.assault)}function ji(i,t){const e=i.t.ranged,n=vi(i,t);if(n>e.range)return{ok:!1,why:`out of range (${n.toFixed(1)}" / ${e.range}")`};if(an(t)&&!e.spell)return{ok:!1,why:"locked in combat"};const s=Pu(i,t);if(!s.visible&&!e.indirect)return{ok:!1,why:"no line of sight"};let r=0;return e.heavy&&i.flags.moved&&r++,e.indirect&&!s.visible&&r++,{ok:!0,range:n,...s,mod:r,need:ar(i.t.BS,r)}}function hc(i){return lc(i)?Yi(i).filter(t=>ji(i,t).ok):[]}async function uc(i,t){L.busy=!0;const e=i.t.ranged,n=ji(i,t);if(i.flags.shot=!0,mc(i,t),_e.clear(`${i.t.short} → ${t.t.short} · ${e.name}`),e.spell){const _=Ye(fe,2),g=_[0]+_[1]>=e.spell;return await _e.row(`Cast ${e.spell}+ (2D6)`,_,0,{sum:!0,pass:g}),g?(Le.magic(),e.mesmerize?Iv(i,t):(ke(i.side,`<b>${i.t.short}</b> casts <b>${e.name}</b> on ${t.t.short}!`),await Dv(i,t,e),ni())):(Le.fizzle(),ie.text(As(i),"Fizzle…","#c8b8ff"),ke(i.side,`<b>${i.t.short}</b> tries ${e.name} — it fizzles (${_[0]+_[1]}).`),ni())}if(e.blast)return await Pv(i,t,e,n),ni();const s=Is(i,e,!1);await Cv(i,t,e);const r=Ye(fe,s),o=ii(r,n.need);await _e.row(`Hit ${n.need}+`,r,n.need);const a=ur(e.S,t.t.T,e.poison),c=Ye(fe,o),h=ii(c,a);o&&await _e.row(`Wound ${a}+`,c,a);const l=fr(t.t.Sv,e.AP,n.cover),u=Ye(fe,h),f=l>6?h:h-ii(u,l);h&&await _e.row(l>6?"No save":`Save ${l}+${n.cover?" (cover)":""}`,l>6?[]:u,l,{save:!0});const p=await yo(t,f,e.D,i);ke(i.side,`<b>${i.t.short}</b> shoot ${t.t.short}: ${o} hit, ${h} wound, ${f} unsaved${p?` — <b>${p} slain</b>`:""}.`),ni()}async function Cv(i,t,e){const n=i.models.filter(a=>a.alive),s=t.models.filter(a=>a.alive),r=[],o=Math.min(10,n.length*e.shots);for(let a=0;a<o;a++){const c=n[a%n.length],h=s[Math.random()*s.length|0],l={x:c.x,y:Ru(i)*.8+c.lift,z:c.z},u={x:h.x+(Math.random()-.5)*.6,y:Cu(t)*.8,z:h.z+(Math.random()-.5)*.6};r.push(je(a*.06).then(()=>(Le.shot(),ie.projectile(l,u,Nu(e.fx)))).then(()=>{for(let f=0;f<5;f++)ie.mote({x:u.x,y:u.y,z:u.z,vx:(Math.random()-.5)*4,vy:Math.random()*3,vz:(Math.random()-.5)*4,size:.05,color:e.fx==="spit"?"#9aff5a":"#ffe0a0",life:.35,g:10})}))}await Promise.all(r)}const ui={acorn:new pn(.07,6,5),dart:new Bn(.03,.3,4).rotateX(Math.PI/2),javelin:new on(.02,.02,.9,4).rotateX(Math.PI/2),spit:new kn(.08,0),bomb:new pn(.11,8,6),pinecone:new Bn(.2,.42,7),acid:new pn(.24,12,8)};function Nu(i){const t=e=>new Qe({color:e,toneMapped:!1});switch(i){case"acorn":return{mesh:new Ht(ui.acorn,pt("#8a5a2a")),arc:.08,speed:28};case"dart":return{mesh:new Ht(ui.dart,pt("#4a6a2a")),arc:.03,speed:34,spin:0};case"javelin":return{mesh:new Ht(ui.javelin,pt("#8a6a3a")),arc:.18,speed:20,spin:0};case"spit":return{mesh:new Ht(ui.spit,t("#9aff5a")),arc:.12,speed:18,trail:e=>ie.mote({x:e.x,y:e.y,z:e.z,size:.04,color:"#7aef4a",life:.4,g:6})};case"bomb":return{mesh:new Ht(ui.bomb,pt("#7a4a22")),arc:.45,speed:14,trail:e=>ie.mote({x:e.x,y:e.y+.1,z:e.z,size:.05,color:"#ffb030",life:.3,g:-1})};case"pinecone":return{mesh:new Ht(ui.pinecone,pt("#6b4a26",{emissive:"#ff5a10",emissiveIntensity:.6})),arc:.55,speed:18,trail:e=>{ie.mote({x:e.x,y:e.y,z:e.z,size:.12,color:Math.random()<.5?"#ff8a2a":"#ffd36e",life:.4,g:-2}),ie.smoke({x:e.x,y:e.y,z:e.z,size:.14,color:"#3a3430",life:.9})}};case"acid":return{mesh:new Ht(ui.acid,t("#8aff5a")),arc:.5,speed:15,trail:e=>ie.mote({x:e.x,y:e.y,z:e.z,size:.1,color:Math.random()<.5?"#5be04a":"#c8ff8a",life:.5,g:8})}}return{mesh:new Ht(ui.acorn,pt("#888"))}}async function Pv(i,t,e,n){const s=Is(i,e,!1);ke(i.side,`<b>${i.t.short}</b> fire ${e.name} at ${t.t.short} (${n.need}+${n.visible?"":", unseen"}).`);for(let r=0;r<s&&!(!oe(i)||!oe(t)&&r>0);r++){const o=sr(fe.rng)*Math.PI*2,a=sr(fe.rng)*t.r*.5,c={x:t.pos.x+Math.cos(o)*a,z:t.pos.z+Math.sin(o)*a},h=ie.ring(c.x,c.z,e.blast,"#ffffff",{hold:!0,fill:.12}),l=Ye(fe,1),u=l[0]>=n.need;await _e.row(s>1?`Template ${r+1}: hit ${n.need}+`:`Hit ${n.need}+`,l,n.need);let f=c;if(!u){const p=Ye(fe,1)[0]+1,_=sr(fe.rng)*Math.PI*2;f={x:Math.max(-ue/2+.3,Math.min(ue/2-.3,c.x+Math.cos(_)*p)),z:Math.max(-Pe/2+.3,Math.min(Pe/2-.3,c.z+Math.sin(_)*p))},await _e.row("Scatter D6+1",[p-1],0,{sum:!0,note:`${p}"`}),ie.text({x:c.x,y:1.5,z:c.z},`scatter ${p}"`,"#ffd36e",{size:15}),await De(.35,g=>h.position.set(zn(c.x,f.x,g),.05,zn(c.z,f.z,g)),Us)}await Lv(i,f,e),h.userData.remove(),await zu(i,f,e)}}async function Lv(i,t,e){const n=i.models.find(o=>o.alive),s=n.mesh.userData.anim;if(s!=null&&s.throwArm){const o=s.rest;Le.thwack(),De(.25,a=>s.throwArm.rotation.x=o-2.1*Us(a)).then(()=>De(.8,a=>s.throwArm.rotation.x=o-2.1*(1-a))),s.globe&&(s.globe.visible=!1),await je(.15)}else n.lunge=1,n.lungeDir=Math.atan2(t.x-n.x,t.z-n.z);const r={x:n.x,y:i.t.big?1.8:.9,z:n.z};Le.shot(),await ie.projectile(r,{x:t.x,y:.15,z:t.z},Nu(e.fx)),s!=null&&s.globe&&(s.globe.visible=!0)}async function Dv(i,t,e){const n={x:t.pos.x,z:t.pos.z},s=i.models[0].mesh.userData.anim.gem;if(s){const a=new R;s.getWorldPosition(a);for(let c=0;c<20;c++)ie.mote({x:a.x,y:a.y,z:a.z,vx:(Math.random()-.5)*3,vy:Math.random()*3,vz:(Math.random()-.5)*3,size:.06,color:"#9aff7a",life:.8,g:-1})}const r=[],o=new Bn(.12,1,5);for(let a=0;a<26;a++){const c=Math.random()*Math.PI*2,h=Math.sqrt(Math.random())*e.blast,l=new Ht(o,pt(a%3?"#5a7a2a":"#7a5a2a"));l.position.set(n.x+Math.cos(c)*h,-.6,n.z+Math.sin(c)*h),l.rotation.set((Math.random()-.5)*.6,0,(Math.random()-.5)*.6),l.scale.set(1,.6+Math.random()*1.1,1),l.castShadow=!0,ce.add(l),r.push(l)}await De(.3,a=>r.forEach(c=>c.position.y=-.6+Us(a)*(.3+c.scale.y*.4))),ie.explode(n.x,n.z,e.blast,"thorns"),await zu(i,n,e),De(1.2,a=>r.forEach(c=>c.position.y-=.02*a)).then(()=>r.forEach(a=>ce.remove(a)))}async function zu(i,t,e){e.fx!=="thorns"&&(ie.explode(t.x,t.z,e.blast,e.fx==="acid"?"acid":"fire"),Le.boom(e.blast/2)),ie.ring(t.x,t.z,e.blast,e.fx==="acid"?"#8aff5a":"#ff9a4a",{life:1.4,fill:.2});const n=[];for(const r of ae){if(!oe(r))continue;const o=r.models.filter(a=>a.alive&&Ft(dr(r,a)-t.x,pr(r,a)-t.z)<=e.blast+r.t.base*.6);o.length&&n.push({v:r,under:o})}for(const{v:r,under:o}of n){let a=o.length;r.t.big&&(a=Math.ceil(Qa(fe)/2)+1);const c=r.side===i.side,h=ur(e.S,r.t.T,e.poison),l=Ye(fe,a),u=ii(l,h);await _e.row(`${c?"⚠ ":""}${r.t.short}: ${a} hit${a>1?"s":""} · wound ${h}+`,l,h);const f=Mo(r),p=fr(r.t.Sv,e.AP,f),_=Ye(fe,u),g=p>6?u:u-ii(_,p);u&&p<=6&&await _e.row(`Save ${p}+${f?" (cover)":""}`,_,p,{save:!0});const m=await yo(r,g,e.D,i,o);ke(i.side,`${c?"<b>Friendly fire!</b> ":""}${e.name} hits ${r.t.short}: ${u} wound, ${g} unsaved${m?` — <b>${m} slain</b>`:""}.`)}n.length||await je(.25);const s=gn.blast(t.x,t.z,e.blast,e.scenery||1,{acid:e.fx==="acid"});s.length&&ke(i.side,`…and ${s.length} piece${s.length>1?"s":""} of scenery ${s.length>1?"are":"is"} wrecked.`),Bs()}async function Iv(i,t){const e=As(i),n=As(t),s=[];for(let a=0;a<=16;a++){const c=a/16;s.push(je(c*.3).then(()=>ie.mote({x:zn(e.x,n.x,c),y:zn(e.y,n.y,c)+Math.sin(c*Math.PI)*.8,z:zn(e.z,n.z,c),size:.09,color:"#c070ff",life:.7,g:0})))}await Promise.all(s);for(let a=0;a<3;a++)ie.ring(t.pos.x,t.pos.z,t.r*(.6+a*.35),"#c070ff",{life:1.2+a*.3,fill:.08});const r=Math.ceil(Qa(fe)/2);await _e.row("Mortal wounds D3",[r],0,{sum:!0,note:`${r}`});const o=await yo(t,r,1,i);t.mesmerized=!0,Vn(t),ie.text(As(t),"Mesmerized!","#e0a0ff",{size:20}),ke(i.side,`<b>${i.t.short}</b> mesmerizes ${t.t.short}: ${r} mortal wound${r>1?"s":""}${o?`, <b>${o} slain</b>`:""}. It can't shoot or charge next turn.`),ni()}async function yo(i,t,e,n,s=null){let r=0;for(let o=0;o<t;o++){const a=i.models.filter(u=>u.alive);if(!a.length)break;let c=s?a.filter(u=>s.includes(u)):[];c.length||(c=a);const h=c.filter(u=>u.w<i.t.W);let l;if(h.length)l=h[0];else{const u=f=>Ft(dr(i,f)-n.pos.x,pr(i,f)-n.pos.z);l=c.reduce((f,p)=>u(f)<u(p)?f:p)}l.w-=e,ie.text({x:l.x,y:i.t.big?2.3:1.3,z:l.z},`-${Math.min(e,e+Math.min(0,l.w))}`,"#ff5a4a",{size:i.t.big?24:18}),l.w<=0?(Uv(i,l,n),r++):l.flash=.4,await je(.06)}return r&&(i.lost+=r,await je(.25),oe(i)&&Ou(i)),Vn(i),r}function Ou(i){const t=xo(i);if(Tu(i),!t.length||an(i))return;const e=t.reduce((r,o)=>vi(i,r)<vi(i,o)?r:o),n=vo(i,e),s=vi(i,e)-(zi-.3);mr(i,i.pos.x+(e.pos.x-i.pos.x)/n*s,i.pos.z+(e.pos.z-i.pos.z)/n*s)}function Uv(i,t,e){t.alive=!1,t.w=0,i.alive--,t.dying=!0,i.side===0?Le.squeak():Le.hiss();const n=t.mesh.userData.fig,s=e?Math.atan2(t.x-e.pos.x,t.z-e.pos.z)-t.yaw:0,r=Math.sin(s)>=0?1:-1;ie.debris(t.x,.5,t.z,i.side===0?["#cf6d2a","#f1dcb5"]:["#3f8f4a","#d9cf86"],6,{power:2,size:.07}),De(.6,o=>{n.rotation.z=r*o*1.45,n.position.y=(i.t.big?.09:.06)+Math.sin(o*Math.PI)*.15},Us).then(()=>je(1.4)).then(()=>De(.8,o=>t.mesh.position.y=-o*1.4)).then(()=>{ce.remove(t.mesh),t.dying=!1}),oe(i)||Fu(i,e)}function Fu(i,t){i.label.style.display="none",i.ring.visible=!1,i.hit.visible=!1,ce.remove(i.hit),L.pendingLog.push([i.side,`<b>${i.t.name}</b> ${i.t.models>1?"are":"is"} destroyed!`,"big"]),ie.text({x:i.pos.x,y:2.2,z:i.pos.z},`${i.t.short} destroyed`,we[t?t.side:1-i.side].color,{size:20,life:2})}function fc(i){var t;return!(!oe(i)||i.flags.charged||i.flags.chargeTried||i.t.role==="Artillery"||i.mesmerized||i.flags.fellBack||an(i)||i.flags.advanced&&!((t=i.t.abilities)!=null&&t.some(e=>e.startsWith("Sidewind"))))}function ks(i){return fc(i)?Yi(i).filter(t=>vi(i,t)<=go):[]}function gr(i,t){Bs();const e=Yi(i).filter(_=>_!==t),n=Du(i),s=Da(i,zi+.05,[t]),r=ut.reach(i.pos.x,i.pos.z,{r:i.r,max:go+.5,mode:n,forbid:n==="fly"?null:s}),o=[];let a=-1,c=1/0;const h=t.r+i.r+zi-.08,l=Math.ceil((h+1)/ut.cell),u=ut.index(t.pos.x,t.pos.z),f=u%ut.nx,p=u/ut.nx|0;for(let _=-l;_<=l;_++)for(let g=-l;g<=l;g++){const m=f+g,d=p+_;if(m<0||d<0||m>=ut.nx||d>=ut.nz)continue;const v=d*ut.nx+m,x=r.dist[v];if(!isFinite(x))continue;const M=Ft(ut.x(v)-t.pos.x,ut.z(v)-t.pos.z);M>h||M<t.r+i.r+.02||ut.standable(v,i.r,n==="wreck"?"wreck":"walk",s)&&(e.some(C=>Ft(ut.x(v)-C.pos.x,ut.z(v)-C.pos.z)<C.r+i.r+zi)||ae.some(C=>C!==i&&C!==t&&oe(C)&&C.side===i.side&&Ft(C.pos.x-ut.x(v),C.pos.z-ut.z(v))<C.r+i.r+.05)||(o.push({i:v,d:x}),x<c&&(a=v,c=x)))}return a<0?null:{cell:a,need:Math.max(2,Math.ceil(c-.01)),res:r,forbid:s,mode:n,dist:c,spots:o}}async function dc(i,t,{auto:e=!1}={}){L.busy=!0;const n=gr(i,t);if(i.flags.chargeTried=!0,_e.clear(`${i.t.short} charge ${t.t.short}`),!n)return ke(i.side,`<b>${i.t.short}</b> can't find a way to ${t.t.short}.`),ni();const s=Ye(fe,2),r=s[0]+s[1],o=r>=n.need;if(await _e.row(`Charge ${n.need}" (2D6)`,s,0,{sum:!0,pass:o}),mc(i,t),!o)return ie.text(As(i),"Charge failed","#d0d0d0"),ke(i.side,`<b>${i.t.short}</b> charge ${t.t.short} — roll ${r}, needed ${n.need}. Failed.`),ni();i.flags.charged=!0,i.flags.chargeTarget=t.id,ie.text(As(i),"CHARGE!",we[i.side].color,{size:22}),ke(i.side,`<b>${i.t.short}</b> charge ${t.t.short} — roll ${r} vs ${n.need}. <b>Contact!</b>`);const a=e||!Hn(i.side)?n.cell:await Nv(i,t,n,r),c=ut.path(n.res,a,i.r,n.mode==="fly"?null:n.forbid);await Uu(i,c,{speed:11,fly:n.mode==="fly"}),Bs();for(const h of[i,t])Vn(h);ni()}function Nv(i,t,e,n){const s=new Uint8Array(ut.N);for(const r of e.spots)r.d<=n+.011&&(s[r.i]=1);return s[e.cell]=1,Un.visible=!1,Xu(s,[255,150,60],150),$u(e.cell,i.r),new Promise(r=>{L.chargePick={u:i,target:t,plan:e,rolled:n,ok:s,resolve:r},Pn()})}function Bu(i,t,e,n=2.4){let s=-1,r=n;for(let o=0;o<ut.N;o++){if(!i.ok[o])continue;const a=Ft(ut.x(o)-t,ut.z(o)-e);a<r&&(r=a,s=o)}return s}function pc(i){const t=L.chargePick;!t||i<0||!t.ok[i]||(L.chargePick=null,_c(),Ge.visible=!1,Tt("#tooltip").style.display="none",Pn(),t.resolve(i))}async function wh(i){if(!oe(i)||i.flags.fought)return;const t=xo(i);if(!t.length)return;i.flags.fought=!0;const e=t.find(m=>m.id===i.flags.chargeTarget)||t.reduce((m,d)=>m.alive*m.t.W<d.alive*d.t.W?m:d),n=i.t.melee,s=i.mesmerized?1:0,r=ar(i.t.WS,s);mc(i,e),(Hn(i.side)||Hn(e.side)||L.follow)&&Hu(i.pos.x*.5+e.pos.x*.5,i.pos.z*.5+e.pos.z*.5),_e.clear(`${i.t.short} fight ${e.t.short} · ${n.name}`);for(const m of i.models)m.alive&&(m.lunge=1,m.lungeDir=Math.atan2(e.pos.x-m.x,e.pos.z-m.z));Le.thwack();const o=Is(i,n,!0),a=Ye(fe,o),c=ii(a,r);await _e.row(`Hit ${r}+${s?" (mesmerized)":""}`,a,r);for(let m=0;m<Math.min(c,8);m++){const d=e.models.filter(v=>v.alive)[m%Math.max(1,e.alive)];if(d)for(let v=0;v<4;v++)ie.mote({x:d.x,y:.6,z:d.z,vx:(Math.random()-.5)*5,vy:Math.random()*4,vz:(Math.random()-.5)*5,size:.05,color:"#fff2b0",life:.3,g:12})}const h=ur(n.S,e.t.T,n.poison),l=Ye(fe,c),u=ii(l,h);c&&await _e.row(`Wound ${h}+`,l,h);const f=fr(e.t.Sv,n.AP,!1),p=Ye(fe,u),_=f>6?u:u-ii(p,f);u&&await _e.row(f>6?"No save":`Save ${f}+`,f>6?[]:p,f,{save:!0});const g=await yo(e,_,n.D,i);ke(i.side,`<b>${i.t.short}</b> fight ${e.t.short}: ${c} hit, ${u} wound, ${_} unsaved${g?` — <b>${g} slain</b>`:""}.`),await je(.3)}async function zv(i){const t=ae.filter(n=>n.side===i&&n.flags.charged&&oe(n));for(const n of t)await wh(n);let e=1-i;for(let n=0;n<30;n++){const s=ae.find(o=>o.side===e&&oe(o)&&!o.flags.fought&&an(o)),r=ae.find(o=>o.side===1-e&&oe(o)&&!o.flags.fought&&an(o));if(!s&&!r)break;s&&await wh(s),e=1-e}for(const n of ae)n.flags.fought=!1,Vn(n)}async function Ov(){let i=!1;for(const t of ae){if(!oe(t)||!t.lost||t.t.models===1)continue;i||_e.clear("Morale"),i=!0;const e=Lu(t),n=Ye(fe,1),s=n[0]+t.lost,r=n[0]===1?0:Math.max(0,s-e);if(await _e.row(`${t.t.short}: D6 + ${t.lost} lost vs Ld ${e}`,n,0,{sum:!0,pass:r===0,note:`${s}`}),r){const o=Math.min(r,t.alive),a=t.models.filter(c=>c.alive).slice(-o);for(const c of a)Fv(t,c);ke(t.side,`<b>${t.t.short}</b> lose their nerve — <b>${o} flee</b>.`),oe(t)?Ou(t):Fu(t,null),Vn(t),await je(.5)}else ke(t.side,`<b>${t.t.short}</b> hold firm (${s} vs Ld ${e}).`)}}function Fv(i,t){t.alive=!1,t.w=0,i.alive--,t.dying=!0;const e=i.side===0?-ue/2-3:ue/2+3,n=t.x,s=t.z;t.fleeing=!0,ie.text({x:t.x,y:1.4,z:t.z},"flees!","#e0e0e0",{size:14}),t.yaw=i.side===0?-Math.PI/2:Math.PI/2,De(2.2,r=>{t.x=zn(n,e,r),t.z=s,t.mesh.position.set(t.x,Math.abs(Math.sin(r*30))*.2,t.z),t.mesh.rotation.y=t.yaw}).then(()=>{ce.remove(t.mesh),t.dying=!1})}function mc(i,t){i.facing=Math.atan2(t.pos.x-i.pos.x,t.pos.z-i.pos.z);for(const e of i.models)e.look=Math.atan2(t.pos.x-e.x,t.pos.z-e.z)}const As=i=>({x:i.pos.x,y:i.t.big?2.6:1.6,z:i.pos.z});function ni(){Eo("act"),L.busy=!1;for(const i of ae)Vn(i);L.sel&&!_r(L.sel)?yn(null):L.sel&&yn(L.sel),Pn(),ku()}function ku(){for(const i of[0,1])ae.some(t=>t.side===i&&oe(t))||(L.wiped=i)}let Th=null;function Hu(i,t){if(!L.follow||L.stage!=="battle"||Hn(L.active)&&L.control[0]!==L.control[1])return;const e=Be.target.clone();if(Math.hypot(i-e.x,t-e.z)<6)return;const s=me.position.clone().sub(e),r=new R(zn(e.x,i,.6),0,zn(e.z,t,.6)),o=Th={};De(.9,a=>{Th===o&&(Be.target.lerpVectors(e,r,a),me.position.copy(Be.target).add(s))},tc)}const Gu={G:fe,get units(){return ae},objectives:cr,nav:ut,scenery:gn,S:L,alive:oe,enemiesOf:Yi,friendsOf:wu,dist:vo,gap:vi,isEngaged:an,engagedWith:xo,sight:Pu,inCover:Mo,controlOf:sc,movePlan:rc,validEnd:oc,doMove:ac,doAdvance:cc,canShoot:lc,shootTargets:hc,shotInfo:ji,doShoot:uc,canCharge:fc,chargeTargets:ks,chargePlan:gr,doCharge:dc,focus:Hu,leadership:Lu};let Rn=null;async function Bv(){L.stage="battle",yn(null),lo.forEach(e=>e.opacity=.05),_e.clear("Roll-off for the first turn");let i,t;do i=Ye(fe,1),t=Ye(fe,1),await _e.row(we[0].short,i,0,{sum:!0}),await _e.row(we[1].short,t,0,{sum:!0});while(i[0]===t[0]);for(L.first=i[0]>t[0]?0:1,ke(L.first,`<b>${we[L.first].name}</b> win the roll-off and take the first turn.`,"big"),L.round=1;L.round<=oo;L.round++){for(let e=0;e<2;e++)if(L.active=(L.first+e)%2,await kv(L.active),L.wiped!==void 0)return Ah();await Hv()}Ah()}async function kv(i){for(const t of ae)t.lost=0,t.side===i&&(t.flags={});for(const t of _u)if(L.phase=t.key,yn(null),_e.el.classList.remove("show"),Pn(),await Yu(`${we[i].icon} ${we[i].name}`,t.name),t.key==="fight"?ae.some(e=>oe(e)&&an(e))&&await zv(i):t.key==="morale"?await Ov():Gv(i)?Hn(i)?(await new Promise(e=>{Rn=e,L.waiting=!0,Pn()}),Rn=null,L.waiting=!1):await xu(Gu,i,t.key):await je(.2),Eo(`phase ${i}:${t.key}`),ku(),L.wiped!==void 0)return;for(const t of ae)t.side===i&&t.mesmerized&&(t.mesmerized=!1,Vn(t))}async function Hv(){const i=[0,0];for(const t of cr){const e=sc(t);e>=0&&(i[e]++,ie.ring(t.x,t.z,ro,we[e].color,{life:1.6,fill:.15}))}L.vp[0]+=i[0],L.vp[1]+=i[1],Eo(`round ${L.round}`),ke(-1,`End of round ${L.round}: ${we[0].short} hold ${i[0]} objective${i[0]===1?"":"s"}, ${we[1].short} hold ${i[1]}. Score ${L.vp[0]}–${L.vp[1]}.`,"big"),Pn(),await Yu(`End of round ${L.round}`,`VP ${L.vp[0]} – ${L.vp[1]}`)}function Ah(){for(const n of L.pendingLog.splice(0))Ia(...n);Eo("over"),L.stage="over",yn(null),Pn();let i;L.wiped!==void 0?i=1-L.wiped:i=L.vp[0]>L.vp[1]?0:L.vp[1]>L.vp[0]?1:-1;const t=i<0?"A bloody draw":`${we[i].name} win!`,e=L.wiped!==void 0?`${we[L.wiped].name} have been wiped from the table.`:`Final score ${L.vp[0]} – ${L.vp[1]} after ${oo} rounds.`;Tt("#overTitle").textContent=`${i>=0?we[i].icon+" ":""}${t}`,Tt("#overWhy").textContent=e,Tt("#over").classList.remove("hidden"),Le.fanfare()}const va=new I_,Rh=new ht;let Qs=null;function Vu(i){Rh.set(i.clientX/innerWidth*2-1,-(i.clientY/innerHeight)*2+1),va.setFromCamera(Rh,me);const t=va.intersectObjects(ae.filter(oe).map(s=>s.hit),!1),e=t.length?t[0].object.userData.unit:null,n=va.intersectObject(ec,!1)[0];return{unit:e,ground:n?n.point:null}}function _r(i){if(!oe(i)||i.side!==L.active)return!1;switch(L.phase){case"move":return!i.flags.moved;case"shoot":return lc(i)&&hc(i).length>0;case"charge":return fc(i)&&ks(i).length>0}return!1}const Gv=i=>ae.some(t=>t.side===i&&_r(t));Ke.domElement.addEventListener("pointerdown",i=>{_o(),Qs={x:i.clientX,y:i.clientY,b:i.button}});Ke.domElement.addEventListener("pointerup",i=>{if(!Qs||i.button!==0)return;const t=Math.hypot(i.clientX-Qs.x,i.clientY-Qs.y);Qs=null,!(t>6)&&Vv(Vu(i))});Ke.domElement.addEventListener("pointerleave",()=>{L.hoverPick=null,L.hover=null,qu(),vc()});Ke.domElement.addEventListener("pointermove",i=>{L.mouse={x:i.clientX,y:i.clientY},L.hoverPick=Vu(i),qu()});function gc(){return L.stage==="battle"&&Hn(L.active)&&Rn&&!L.busy&&!L.auto||L.stage==="deploy"}async function Vv({unit:i,ground:t}){if(Tt("#tooltip").style.display="none",L.stage==="deploy")return Wu(i,t);if(L.chargePick){t&&pc(Bu(L.chargePick,t.x,t.z));return}if(!gc()){i&&Rs(i);return}const e=L.sel;if(i&&i.side===L.active){_r(i)?(Le.click(),yn(i)):Rs(i);return}if(L.phase==="move"&&e&&t){const n=Iu(L.reach,t.x,t.z);n>=0&&(_c(),await ac(e,n,L.reach));return}if(L.phase==="shoot"&&e&&i&&i.side!==e.side){ji(e,i).ok&&await uc(e,i);return}if(L.phase==="charge"&&e&&i&&i.side!==e.side){ks(e).includes(i)&&gr(e,i)&&await dc(e,i);return}i?Rs(i):!i&&t&&yn(null)}function Wu(i,t){const e=L.deploySide;if(i&&i.side===e){Le.click(),L.sel=i,Rs(i),vc();return}if(L.sel&&t){const n=L.sel,s=ae.filter(o=>o!==n),r=ic(n,t.x,t.z,e,s);if(r&&Math.hypot(r.x-t.x,r.z-t.z)<2.5){mr(n,r.x,r.z),Le.click();for(const o of ae)Vn(o)}}}function yn(i){L.sel=i,L.reach=null,_c(),i&&L.stage==="battle"&&L.phase==="move"&&!i.flags.moved&&(L.reach=rc(i,i.flags.advanced?i.flags.advRoll:0),Wv(L.reach)),i&&L.phase==="shoot"&&i.t.ranged&&Ch(i,i.t.ranged.range),i&&L.phase==="charge"&&Ch(i,go),Rs(i),Pn()}const ys=new Uint8Array(ut.nx*ut.nz*4),So=new u_(ys,ut.nx,ut.nz,xn);So.magFilter=sn;So.minFilter=sn;const Hs=new Ht(new Mi(ue,Pe).rotateX(-Math.PI/2),new Qe({map:So,transparent:!0,depthWrite:!1,toneMapped:!1}));Hs.position.y=.035;Hs.renderOrder=2;Hs.visible=!1;ce.add(Hs);function Wv(i){const t=i.u.flags.advanced,{u:e,res:n,mode:s,endForbid:r}=i,o=new Uint8Array(ut.N);for(let a=0;a<ut.N;a++)isFinite(n.dist[a])&&ut.standable(a,e.r,s==="wreck"?"wreck":"walk",r)&&(o[a]=1);Xu(o,i.fallback?[255,120,90]:t?[255,190,70]:[90,180,255])}function Xu(i,t,e=80){ys.fill(0);for(let n=0;n<ut.N;n++){if(!i[n])continue;const s=n%ut.nx,r=n/ut.nx|0,o=s===0||r===0||s===ut.nx-1||r===ut.nz-1||!i[n-1]||!i[n+1]||!i[n-ut.nx]||!i[n+ut.nx],a=((ut.nz-1-r)*ut.nx+s)*4;ys[a]=t[0],ys[a+1]=t[1],ys[a+2]=t[2],ys[a+3]=o?210:ut.diff[n]?Math.round(e*.7):e}So.needsUpdate=!0,Hs.visible=!0}function _c(){Hs.visible=!1,ti.visible=!1,Un.visible=!1}const Un=new Ht(new Xi(.985,1,96).rotateX(-Math.PI/2),new Qe({color:"#ffffff",transparent:!0,opacity:.6,depthWrite:!1,toneMapped:!1}));Un.position.y=.04;Un.visible=!1;ce.add(Un);function Ch(i,t){Un.position.x=i.pos.x,Un.position.z=i.pos.z,Un.scale.setScalar(i.r+t),Un.material.color.set(L.phase==="charge"?"#ffb070":"#ffffff"),Un.visible=!0}const ti=new lu(new Te,new Wa({color:"#ffffff",transparent:!0,opacity:.9,toneMapped:!1}));ti.visible=!1;ti.renderOrder=4;ce.add(ti);const Ge=new Ht(new Xi(.9,1,40).rotateX(-Math.PI/2),new Qe({color:"#ffffff",transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1}));Ge.position.y=.05;Ge.visible=!1;ce.add(Ge);function $u(i,t){Ge.position.x=ut.x(i),Ge.position.z=ut.z(i),Ge.scale.setScalar(t),Ge.visible=!0}function qu(){const i=Tt("#tooltip");i.style.display="none",ti.visible=!1,Ge.visible=!1;const t=L.hoverPick;if(!t){L.chargePick&&$u(L.chargePick.plan.cell,L.chargePick.u.r);return}L.hover=t.unit;let e="";const n=L.sel;if(L.chargePick&&t.ground){const s=L.chargePick,r=Bu(s,t.ground.x,t.ground.z);if(r>=0){const o=ut.path(s.plan.res,r,s.u.r,s.plan.mode==="fly"?null:s.plan.forbid);ti.geometry.setFromPoints(o.map(a=>new R(a.x,.08,a.z))),ti.visible=!0,Ge.position.x=ut.x(r),Ge.position.z=ut.z(r),Ge.scale.setScalar(s.u.r),Ge.visible=!0,e=`End charge here · ${s.plan.res.dist[r].toFixed(1)}" of ${s.rolled}"`}else e="✖ out of reach — pick a spot in the orange area"}else if(L.stage==="battle"&&gc()&&n){if(L.phase==="move"&&L.reach&&t.ground&&!t.unit){const s=Iu(L.reach,t.ground.x,t.ground.z);if(s>=0){const r=ut.path(L.reach.res,s,n.r,L.reach.mode==="fly"?null:L.reach.forbid);ti.geometry.setFromPoints(r.map(o=>new R(o.x,.08,o.z))),ti.visible=!0,Ge.position.x=ut.x(s),Ge.position.z=ut.z(s),Ge.scale.setScalar(n.r),Ge.visible=!0,e=`${L.reach.res.dist[s].toFixed(1)}" of ${L.reach.max}"`}}else if(L.phase==="shoot"&&t.unit&&t.unit.side!==n.side){const s=ji(n,t.unit);e=s.ok?Xv(n,t.unit,s):`✖ ${s.why}`}else if(L.phase==="charge"&&t.unit&&t.unit.side!==n.side)if(!ks(n).includes(t.unit))e=`✖ out of charge range (${vi(n,t.unit).toFixed(1)}")`;else{const s=gr(n,t.unit);e=s?`Charge: need ${s.need}" on 2D6 — ${Math.round(Hi(s.need)*100)}%`:"✖ no route"}}!e&&t.unit&&(e=`${t.unit.t.name} · ${t.unit.t.models>1?`${t.unit.alive}/${t.unit.t.models} models`:`${t.unit.models[0].w}/${t.unit.t.W} wounds`}`),e&&L.mouse&&(i.innerHTML=e,i.style.display="block",i.style.left=L.mouse.x+16+"px",i.style.top=L.mouse.y+14+"px")}function Xv(i,t,e){const n=i.t.ranged;if(n.mesmerize)return`Mesmerize: cast ${n.spell}+ on 2D6 (${Math.round(Hi(n.spell)*100)}%) · D3 mortal wounds`;const s=[];n.spell&&s.push(`Cast ${n.spell}+ (${Math.round(Hi(n.spell)*100)}%)`);const r=Is(i,n,!1),o=ur(n.S,t.t.T,n.poison),a=fr(t.t.Sv,n.AP,e.cover);s.push(`${r} ${n.blast?`template${r>1?"s":""} (${n.blast}")`:"shots"} · hit ${n.spell?"auto":e.need+"+"} · wound ${o}+ · save ${a>6?"—":a+"+"}`);const c=[];if(c.push(`${e.range.toFixed(1)}"`),e.cover&&c.push("cover"),e.visible?e.seen<e.total&&c.push(`${e.seen}/${e.total} visible`):c.push("unseen (indirect −1)"),n.heavy&&i.flags.moved&&c.push("moved (heavy −1)"),!n.blast){const h=co(r,e.need,n,t,e.cover);c.push(`≈${h.kills.toFixed(1)} slain`)}return s.push(c.join(" · ")),s.join("<br>")}const $v={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};function qv(i,t){const e=document.createElement("div");e.className=`die ${t}`;for(let n=0;n<9;n++){const s=document.createElement("i");$v[i].includes(n)&&(s.className="on"),e.appendChild(s)}return e}const _e={el:Tt("#tray"),clear(i){this.el.innerHTML="";const t=document.createElement("div");t.className="tray-title",t.textContent=i,this.el.appendChild(t),this.el.classList.add("show")},async row(i,t,e,{sum:n=!1,pass:s,note:r="",save:o=!1}={}){Le.dice(t.length);const a=document.createElement("div");a.className="tray-row";const c=document.createElement("span");c.className="lbl",c.textContent=i,a.appendChild(c);const h=document.createElement("span");h.className="dice",a.appendChild(h),t.slice(0,30).forEach((f,p)=>{const _=e?f>=e?o?"saved":"ok":"fail":s===!1?"fail":s?"ok":"plain",g=qv(f,_);g.style.animationDelay=`${p*.025/fn.speed}s`,h.appendChild(g)});const u=document.createElement("span");if(u.className="res",e){const f=ii(t,e);u.textContent=o?`${f} saved`:`${f} ✓`,t.length>30&&(u.textContent+=` (of ${t.length})`)}else n&&(u.textContent=r||`= ${t.reduce((f,p)=>f+p,0)}`,s===!0&&u.classList.add("good"),s===!1&&u.classList.add("bad"));for(a.appendChild(u),this.el.appendChild(a);this.el.children.length>7;)this.el.children[1].remove();await je(.38+Math.min(t.length,14)*.035)}},bo=[];function Eo(i){const t=ae.map(e=>`${e.id}:${e.pos.x.toFixed(3)},${e.pos.z.toFixed(3)},${e.models.map(n=>n.w).join("/")}`).join(" ");bo.push(`${i} ${t} chunks:${gn.chunks.filter(e=>e.alive).length} vp:${L.vp.join("-")} rng:${Za(fe.rng)}`)}function ke(i,t,e=""){bo.push(`log ${i} ${t.replace(/<[^>]+>/g,"")} rng:${Za(fe.rng)}`),Ia(i,t,e);for(const n of L.pendingLog.splice(0))Ia(...n)}function Ia(i,t,e){const n=Tt("#logList"),s=document.createElement("div");for(s.className=`entry s${i} ${e}`,s.innerHTML=t,n.prepend(s);n.children.length>80;)n.lastChild.remove()}const Ph=["M","WS","BS","S","T","W","A","Ld","Sv","OC"];function Rs(i){var a;const t=Tt("#card");if(!i){t.classList.remove("show");return}const e=i.t,n=c=>c==="M"?`${e.M}"`:["WS","BS","Sv"].includes(c)?`${e[c]}+`:e[c],s=(c,h)=>{if(!c)return"";if(c.mesmerize)return`<div class="wpn"><span>${h} ${c.name}</span><em>spell ${c.spell}+ · ${c.range}" · D3 mortal + mesmerize</em></div>`;const l=[];return c.range&&l.push(`${c.range}"`),c.spell&&l.push(`spell ${c.spell}+`),c.blast?l.push(`blast ${c.blast}" ×${c.shots}`):c.shots&&l.push(`A${c.shots}`),l.push(`S${c.S}`,`AP-${c.AP}`,`D${c.D}`),c.poison&&l.push(`poison ${c.poison}+`),c.indirect&&l.push("indirect"),c.heavy&&l.push("heavy"),c.assault&&l.push("assault"),`<div class="wpn"><span>${h} ${c.name}</span><em>${l.join(" · ")}</em></div>`},r=[];i.flags.moved&&r.push(i.flags.fellBack?"fell back":i.flags.advanced?`advanced +${i.flags.advRoll}"`:"moved"),i.flags.shot&&r.push("shot"),i.flags.charged&&r.push("charged"),i.mesmerized&&r.push("🌀 mesmerized"),oe(i)&&an(i)&&r.push("⚔ in combat"),oe(i)&&Mo(i)&&r.push("🛡 in cover");const o=e.models>1?`${i.alive}/${e.models} models`:`${i.models[0].w}/${e.W} wounds`;t.innerHTML=`
    <div class="card-head s${i.side}"><b>${e.name}</b><span>${we[i.side].short} · ${e.role}</span></div>
    <div class="card-sub">${oe(i)?o:"destroyed"}${r.length?" · "+r.join(" · "):""}</div>
    <table class="stats"><tr>${Ph.map(c=>`<th>${c}</th>`).join("")}</tr><tr>${Ph.map(c=>`<td>${n(c)}</td>`).join("")}</tr></table>
    ${s(e.ranged,(a=e.ranged)!=null&&a.spell?"✦":"➹")}${s({...e.melee,range:0},"⚔")}
    <ul class="abil">${(e.abilities||[]).map(c=>`<li>${c}</li>`).join("")}</ul>`,t.classList.add("show")}function Pn(){var r,o;Tt("#vp0").textContent=L.vp[0],Tt("#vp1").textContent=L.vp[1],Tt("#round").textContent=L.stage==="deploy"?"Deployment":`Round ${Math.min(L.round,oo)} / ${oo}`,document.querySelectorAll("#phases .ph").forEach(a=>{a.classList.toggle("on",L.stage==="battle"&&a.dataset.k===L.phase)}),Tt("#sideA").classList.toggle("active",L.stage==="battle"&&L.active===0),Tt("#sideB").classList.toggle("active",L.stage==="battle"&&L.active===1);const i=L.stage==="battle"&&Hn(L.active)&&!!Rn&&!L.auto,t=L.sel,e=!!L.chargePick;Tt("#endPhase").style.display=i&&!e||L.stage==="deploy"?"":"none",Tt("#closestSpot").style.display=e?"":"none",Tt("#endPhase").textContent=L.stage==="deploy"?"Begin battle ▸":`End ${_u.find(a=>a.key===L.phase).name} ▸`,Tt("#endPhase").disabled=L.busy||L.auto,Tt("#autoPhase").style.display=i&&!e?"":"none";const n=Tt("#advance");n.style.display=i&&L.phase==="move"&&t&&!t.flags.moved&&!t.flags.advanced&&!an(t)?"":"none",n.textContent=`Advance (+D6") — no ${(r=t==null?void 0:t.t.ranged)!=null&&r.assault?"charge":"shooting or charge"} after`,(o=t==null?void 0:t.t.abilities)!=null&&o.some(a=>a.startsWith("Sidewind"))&&(n.textContent='Advance (+D6") — can still charge');let s="";e?s=`Charge! Rolled ${L.chargePick.rolled}" — click the orange area to place ${L.chargePick.u.t.short}, or take the shortest move.`:L.stage==="deploy"?s="Deployment — click one of your units, then click inside your shaded zone to move it there.":L.stage==="battle"&&!Hn(L.active)?s=`${we[L.active].name} (AI) are taking their turn…`:i&&(s={move:t?an(t)?"Engaged — click inside the red area to fall back (no shooting or charging after).":"Click inside the shaded area to move. Difficult ground costs double.":"Movement — pick a unit with a white ring to move it.",shoot:t?"Click an enemy unit to shoot it. Hover for odds.":"Shooting — pick a unit with a white ring to fire.",charge:t?'Click an enemy within 12" to declare a charge, then roll 2D6.':"Charge — pick a unit to charge with."}[L.phase]||""),Tt("#hint").textContent=s,Tt("#hint").style.display=s?"":"none",vc()}function vc(){const i=gc();for(const t of ae){if(!oe(t))continue;const e=t.ring.material;let n=0,s="#ffffff";t===L.sel?(n=1,s="#ffe680"):L.stage==="deploy"&&t.side===L.deploySide?n=.5:L.chargePick&&t===L.chargePick.target?(n=.95,s="#ffa040"):i&&L.stage==="battle"&&_r(t)?n=.75:i&&L.sel&&L.phase==="shoot"&&t.side!==L.sel.side&&ji(L.sel,t).ok?(n=.95,s="#ff5a4a"):i&&L.sel&&L.phase==="charge"&&t.side!==L.sel.side&&ks(L.sel).includes(t)?(n=.95,s="#ffa040"):t===L.hover&&(n=.35),e.opacity=n,e.color.set(s)}}async function Yu(i,t){const e=Tt("#banner");e.innerHTML=`<div class="b1">${i}</div><div class="b2">${t}</div>`,e.classList.remove("show"),e.offsetWidth,e.classList.add("show"),await je(Hn(L.active)||L.stage!=="battle"?.9:.6)}Tt("#endPhase").onclick=()=>{var i;if(_o(),Le.click(),L.stage==="deploy")return(i=L.deployDone)==null?void 0:i.call(L);L.busy||L.auto||!Rn||(yn(null),Rn())};Tt("#closestSpot").onclick=()=>{Le.click(),L.chargePick&&pc(L.chargePick.plan.cell)};Tt("#autoPhase").onclick=async()=>{if(!(L.busy||L.auto||!Rn)){yn(null),L.auto=!0,L.busy=!0,Pn();try{await xu(Gu,L.active,L.phase)}finally{L.auto=!1,L.busy=!1}Rn==null||Rn()}};Tt("#advance").onclick=async()=>{const i=L.sel;!i||L.busy||L.auto||(await cc(i),yn(i))};const xa=[1,2,4];Tt("#speed").onclick=()=>{fn.speed=xa[(xa.indexOf(fn.speed)+1)%xa.length],Tt("#speed").textContent=`⏩ ${fn.speed}×`};Tt("#follow").onclick=()=>{L.follow=!L.follow,Tt("#follow").classList.toggle("off",!L.follow)};Tt("#mute").textContent=gv()?"🔇":"🔊";Tt("#mute").onclick=()=>{_o(),Tt("#mute").textContent=mv()?"🔇":"🔊"};Tt("#helpBtn").onclick=()=>Tt("#help").classList.remove("hidden");Tt("#helpClose").onclick=()=>Tt("#help").classList.add("hidden");Tt("#logToggle").onclick=()=>Tt("#log").classList.toggle("collapsed");Tt("#seed").value=L.seed;Tt("#reroll").onclick=()=>{L.seed=Math.random()*1e6|0,Tt("#seed").value=L.seed,wo()};Tt("#seed").onchange=()=>{L.seed=Number(Tt("#seed").value)||1,wo()};document.querySelectorAll("[data-mode]").forEach(i=>{i.onclick=()=>{_o(),Le.click(),xc(i.dataset.mode)}});Tt("#again").onclick=()=>{Tt("#over").classList.add("hidden"),Tt("#title").classList.remove("hidden"),document.body.classList.remove("playing"),L.stage="title",L.titleSpin=!0,L.titleAngle-=fn.time*.035,L.viewShift=1,wo()};const Dn=new Set;addEventListener("keydown",i=>{i.target.tagName!=="INPUT"&&(Dn.add(i.key.toLowerCase()),i.key==="Escape"&&!L.chargePick&&yn(null))});addEventListener("keyup",i=>Dn.delete(i.key.toLowerCase()));function Yv(i){const t=new R,e=new R().subVectors(Be.target,me.position).setY(0).normalize(),n=new R(-e.z,0,e.x);(Dn.has("w")||Dn.has("arrowup"))&&t.add(e),(Dn.has("s")||Dn.has("arrowdown"))&&t.sub(e),(Dn.has("d")||Dn.has("arrowright"))&&t.add(n),(Dn.has("a")||Dn.has("arrowleft"))&&t.sub(n),t.lengthSq()&&(t.normalize().multiplyScalar(i*18),Be.target.add(t),me.position.add(t))}function wo(){Av(),L.vp=[0,0],L.round=1,L.wiped=void 0,L.sel=null,Tt("#logList").innerHTML="",Tt("#tray").classList.remove("show"),gn.generate(L.seed,cr,Nn.deploy),gn.dirty=!0,Bs(),Sv();for(const i of[0,1])for(const t of O_[i])ae.push(Tv(t,i));Rv();for(const i of ae)Vn(i);for(const i of cr)ju(i,-1);ie.clearDecals(),L.pendingLog=[],L.phase="move",L.active=0,L.busy=!1,L.waiting=!1,L.chargePick=null,L.auto=!1,Pn()}async function xc(i){L.dice=Number($i.get("dice"))||Math.random()*1e9|0,fe.rng=gu(L.dice),bo.length=0,L.control={bushtail:["human","ai"],serpent:["ai","human"],hotseat:["human","human"],watch:["ai","ai"]}[i],Tt("#title").classList.add("hidden"),document.body.classList.add("playing"),L.titleSpin=!1;const t=me.position.clone(),e=Be.target.clone(),n=Zv();innerWidth<700&&Tt("#log").classList.add("collapsed"),De(1.4,s=>{L.viewShift=1-s,me.position.lerpVectors(t,n.pos,s),Be.target.lerpVectors(e,n.target,s)},tc);for(const s of[0,1])Hn(s)&&(L.stage="deploy",L.deploySide=s,lo[s].opacity=.2,ke(s,`<b>${we[s].name}</b>: deploy your army.`),Pn(),await new Promise(r=>L.deployDone=r),lo[s].opacity=.07,L.sel=null,Rs(null));Bv()}const jv=new D_,$r=new R;L.titleSpin=!0;L.titleAngle=-1.02;L.viewShift=1;function Kv(i,t){for(const e of ae){for(const n of e.models){if(!n.alive&&!n.dying)continue;const s=n.mesh.userData.anim;if(n.alive){const a=e.pos.x+n.ox,c=e.pos.z+n.oz,h=1-Math.exp(-i*(e.moving?16:7)),l=n.x,u=n.z;n.x+=(a-n.x)*h,n.z+=(c-n.z)*h;const f=Math.hypot(n.x-l,n.z-u)/Math.max(i,1e-4),p=f>.6?Math.atan2(n.x-l,n.z-u):n.look??e.facing;n.yaw+=W_(p-n.yaw)*(1-Math.exp(-i*8)),n.moving=f>.6;let _=0,g=0;if(n.lunge>0){n.lunge=Math.max(0,n.lunge-i*2.5);const m=Math.sin((1-n.lunge)*Math.PI)*.35;_=Math.sin(n.lungeDir)*m,g=Math.cos(n.lungeDir)*m}n.mesh.position.set(n.x+_,n.lift||0,n.z+g),n.mesh.rotation.y=n.yaw}if(!s||!n.alive)continue;const r=t+n.mesh.userData.phase,o=n.mesh.userData.fig;if(s.kind==="squirrel"){const a=n.moving?Math.abs(Math.sin(r*13))*.16:0;o.position.y=o.userData.y0+a,o.scale.y=1+(n.moving?0:Math.sin(r*2.4)*.018),o.rotation.x=n.moving?.12:0}else if(s.kind==="naga")o.rotation.z=Math.sin(r*(n.moving?9:1.4))*(n.moving?.12:.035),o.scale.y=1+Math.sin(r*1.4)*.015;else if(s.kind==="machine"&&n.moving)for(const a of s.wheels)a.rotation.x+=i*6;s.gem&&(s.gem.rotation.y=r*2),n.flash>0&&(n.flash-=i,o.position.x=Math.sin(t*60)*.04*(n.flash>0?1:0))}if(oe(e)&&!Ua){$r.set(e.pos.x,e.t.big?2.7:e.t.fly?2.3:1.7,e.pos.z).project(me);const n=$r.z<1;e.label.style.transform=`translate(${($r.x*.5+.5)*innerWidth}px, ${(-$r.y*.5+.5)*innerHeight}px) translate(-50%, -100%)`,e.label.style.visibility=n&&L.stage!=="title"?"visible":"hidden",e.label.classList.toggle("sel",e===L.sel)}}}function ju(i,t){i.owner=t,i.flagMat.color.set(t<0?"#e8e0d0":we[t].color),i.ring.material.color.set(t<0?"#fff3c0":we[t].color)}function Jv(i,t){for(const e of cr){const n=L.stage==="battle"||L.stage==="over"?sc(e):-1;n!==e.owner&&ju(e,n),e.gem.rotation.y=t*1.2,e.gem.position.y=.45+Math.sin(t*2+e.i)*.05,e.flag.rotation.y=Math.sin(t*2.2+e.i)*.25,e.ring.material.opacity=.3+Math.sin(t*2+e.i)*.08}}const Ua=$i.has("fast");function Ku(){var r;requestAnimationFrame(Ku),Ua&&(fn.speed=1e4);const i=Math.min(jv.getDelta(),.05),t=i*fn.speed;if(fn.time+=t,$_(t),ie.update(t),Kv(t,fn.time),Jv(t,fn.time),L.titleSpin){const o=L.titleAngle+fn.time*.035;me.position.set(-5+Math.sin(o)*25,13,Math.cos(o)*25),Be.target.set(-5,0,0)}const e=innerWidth>900?L.viewShift:0;e>.001?me.setViewOffset(innerWidth,innerHeight,-innerWidth*.21*e,0,innerWidth,innerHeight):(r=me.view)!=null&&r.enabled&&me.clearViewOffset(),Yv(i),Be.update();const n=ie.shake,s=new R((Math.random()-.5)*n,(Math.random()-.5)*n,(Math.random()-.5)*n);me.position.add(s),Ua||Ke.render(ce,me),me.position.sub(s)}function Zv(){return innerWidth>=innerHeight?{pos:new R(0,30,31),target:new R(0,0,1.5)}:{pos:new R(-36,46,0),target:new R(-1,0,0)}}function Ju(){me.fov=innerWidth>=innerHeight?40:56,me.aspect=innerWidth/innerHeight,me.updateProjectionMatrix()}Ju();addEventListener("resize",()=>{Ju(),me.aspect=innerWidth/innerHeight,me.updateProjectionMatrix(),Ke.setSize(innerWidth,innerHeight)});wo();Ku();$i.has("watch")&&xc("watch");$i.has("debug")&&(window.__ts={S:L,clock:fn,scenery:gn,nav:ut,camera:me,controls:Be,renderer:Ke,validEnd:oc,setUnitPos:mr,trace:bo,get units(){return ae},get phaseResolve(){return Rn},get chargePick(){return L.chargePick},start:xc,select:yn,doMove:ac,doAdvance:cc,doShoot:uc,doCharge:dc,placeCharge:pc,deployClick:Wu,endPhase:()=>Tt("#endPhase").onclick(),autoPhase:()=>Tt("#autoPhase").onclick(),q:{alive:oe,isEngaged:an,canAct:_r,movePlan:rc,freeSpot:ic,shootTargets:hc,shotInfo:ji,chargeTargets:ks,chargePlan:gr,rngState:()=>Za(fe.rng)},screen(i,t,e){const n=new R(i,t,e).project(me);return[(n.x*.5+.5)*innerWidth,(-n.y*.5+.5)*innerHeight]}});
